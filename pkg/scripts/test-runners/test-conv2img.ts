import { parseVioletEnv } from '@violet/def/env/violet'
import { createLogger } from '@violet/lib/logger'
import { listKeys } from '@violet/lib/s3'
import { listAllKeysForPublicBucket } from '@violet/lib/s3/public-server'
import { createS3PutObjectTestContext } from '@violet/lib/s3/tester'
import type { ResultStatus } from '@violet/lib/s3/tester/types'
import arg from 'arg'
import dotenv from 'dotenv'
import path from 'path'

const log = (str: string) => {
  console.log(new Date(), str)
}

const err = (str: string) => {
  console.error(new Date(), str)
}

const printFailedResult = (key: string, result: ResultStatus) => {
  err(`[FAIL] key=${key}`)
  if (result.errorMessage) {
    err(`[FAIL] ${result.errorMessage}`)
  }
  err(
    `[FAIL] To rerun only this case, run script with --key '${encodeURI(key).replace(/'/g, "\\'")}'`
  )
  err(`[FAIL] -----------------------------`)
}

const ctx = createS3PutObjectTestContext()

// 対応するテストケース一覧
const folders = ['basic-pdf-0001', 'basic-docs-0001']

interface Params {
  cwd: string
  bucket: string
  concurrency: number
  caseKey: string
}
const main = async ({ cwd, bucket, concurrency, caseKey }: Params) => {
  const startTime = Date.now()
  log('Start conv2img test.')
  dotenv.config({
    path: path.resolve(cwd, '.env'),
  })

  const allKeys = await listAllKeysForPublicBucket(bucket)
  const keys = caseKey
    ? [{ contentKey: caseKey }]
    : folders
        .flatMap((folder) => {
          return listKeys(allKeys, `tests/works/${folder}/`, false).filter(
            (k) => !k.endsWith('.json')
          )
        })
        .map((contentKey) => ({
          contentKey,
        }))
  const env = parseVioletEnv(process.env)
  const logger = createLogger({ env, service: 'test-runners/conv2img' })
  log(`${keys.length} case(s) found.`)
  await ctx.start({ bucket, keys, concurrency, env, logger })
  log('Summarizing the results.')
  const status = ctx.getStatus()!
  let failCount = 0
  Object.entries(status.results).map(([key, value]) => {
    if (value.type !== 'succeeded') {
      failCount += 1
      printFailedResult(key, value)
    }
  })
  log('Finish conv2img test.')
  log(`${Math.ceil((Date.now() - startTime) / 1000).toString()} seconds passed.`)
  if (failCount > 0) {
    throw new Error('No less than one test failed.')
  }
}

const args = arg({
  '--cwd': String,
  '--bucket': String,
  '--concurrency': Number,
  '--key': String,
  '-b': '--bucket',
  '-j': '--concurrency',
  '-k': '--key',
})

void main({
  cwd: args['--cwd'] ?? '.',
  bucket: args['--bucket'] ?? 'violet-public-dev',
  concurrency: (args['--concurrency'] ?? 1) | 0,
  caseKey: decodeURI(args['--key'] ?? ''),
}).catch((e) => {
  console.error(e)
  process.exit(1)
})
