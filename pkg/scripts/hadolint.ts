import { execThrow } from '@violet/lib/exec'
import arg from 'arg'
import { asyncIter } from 'ballvalve'
import { spawn } from 'child_process'
import fg from 'fast-glob'
import fs from 'fs'
import path from 'path'

const lambdaIgnore = [
  'DL3045', // WORKDIR before COPY
]

const devIgnores = [
  'DL3032', // yum clean
  'DL3033', // specify version
  'DL3045', // WORKDIR before COPY
  'DL3059', // consolidate RUN
]

const prodTrustedRegistries = ['docker.io', 'public.ecr.aws']

interface HadolintRunParams {
  tag: string
  filepath: string
  ignores: string[]
  trustedRegistries: string[]
  cwd: string
  local: boolean
}
interface HadolintRunResult {
  stdout: Buffer
  stderr: Buffer
  exitCode: number | null
}
const hadolintRun = async ({
  tag,
  cwd,
  ignores,
  filepath,
  trustedRegistries,
  local,
}: HadolintRunParams): Promise<HadolintRunResult> => {
  const ignoresArgs = ignores.flatMap((ignore) => ['--ignore', ignore])
  const trustedRegistriesArgs = trustedRegistries.flatMap((registry) => [
    '--trusted-registry',
    registry,
  ])
  const cmdFile = local ? 'hadolint' : 'docker'
  const cmdArgs = local ? ['-'] : ['run', '--rm', '-i', `hadolint/hadolint:${tag}`, 'hadolint', '-']
  const args = [...cmdArgs, '-t', 'style', ...ignoresArgs, ...trustedRegistriesArgs]
  console.log(`Running ${cmdFile} ${args.join(' ')} < ${filepath}`)
  const proc = spawn(cmdFile, args, {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  const rs = fs.createReadStream(filepath)
  rs.pipe(proc.stdin)
  const [stdout, stderr] = await Promise.all([
    asyncIter<Buffer>(proc.stdout)
      .collect()
      .then((b) => Buffer.concat(b)),
    asyncIter<Buffer>(proc.stderr)
      .collect()
      .then((b) => Buffer.concat(b)),
  ])
  const prom = new Promise<void>((resolve) =>
    proc.once('exit', () => {
      resolve()
    })
  )
  await prom
  return {
    stdout,
    stderr,
    exitCode: proc.exitCode,
  }
}

interface constructArgsResult {
  ignores: string[]
  trustedRegistries: string[]
}
const constructArgs = (pathnames: readonly string[]): constructArgsResult => {
  const ignores: string[] = []
  const trustedRegistries: string[] = []
  if (pathnames.includes('dev')) ignores.push(...devIgnores)
  if (pathnames.includes('prod')) trustedRegistries.push(...prodTrustedRegistries)
  if (pathnames.includes('lambda')) ignores.push(...lambdaIgnore)
  return { ignores, trustedRegistries }
}

interface Params {
  only: string[]
  dir: string
  hadolintTag: string
  local: boolean
}
const main = async ({ only, dir, hadolintTag, local }: Params): Promise<void> => {
  if (!local) await execThrow('docker', ['pull', `hadolint/hadolint:${hadolintTag}`], false)
  const cwd = path.resolve(process.cwd(), dir)
  const allFiles = await fg('**/Dockerfile', { cwd })
  const onlyFrom = only.map((f) => path.relative(cwd, path.resolve(process.cwd(), f)))
  const files = allFiles.filter(
    (f) => only.length === 0 || onlyFrom.some((from) => f.startsWith(from))
  )
  const results = await Promise.all(
    files.map(async (file) => {
      const pathnames = file.split('/')
      const filepath = path.resolve(cwd, file)
      const { ignores, trustedRegistries } = constructArgs(pathnames)
      return {
        filepath,
        ...(await hadolintRun({
          tag: hadolintTag,
          filepath,
          ignores,
          trustedRegistries,
          cwd,
          local,
        })),
      }
    })
  )
  const failed = results.filter(({ exitCode }) => exitCode !== 0)
  failed.forEach(({ filepath, stdout, stderr }) => {
    console.error(`Failed to hadolint ${filepath}.`)
    process.stdout.write(Uint8Array.from(stdout))
    process.stderr.write(Uint8Array.from(stderr))
  })
  if (failed.length > 0) {
    throw new Error(`Hadolint failed ${failed.length} files within ${results.length} files.`)
  }
  console.log(`Hadolint succeeded for ${results.length} files.`)
}

const args = arg({
  '--dir': String,
  '--tag': String,
  '--local': Boolean,
})

main({
  only: args._,
  dir: args['--dir'] ?? '',
  hadolintTag: args['--tag'] ?? 'latest',
  local: Boolean(args['--local']),
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
