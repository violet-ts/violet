import arg from 'arg'
import type { Plugin, WatchMode } from 'esbuild'
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import * as fs from 'fs'
import * as path from 'path'

interface Params {
  fromDir: string
  toDir: string
  watch: boolean
  target: string
  clean: boolean
}

const main = async ({ fromDir, toDir, watch, target, clean }: Params) => {
  const fromDirAbs = path.resolve(process.cwd(), fromDir)
  const toDirAbs = path.resolve(process.cwd(), toDir)

  const entryPoints = fs
    .readdirSync(fromDirAbs)
    .map((f) => path.resolve(fromDirAbs, f))
    .filter((e) => e.endsWith('.ts'))
  const watchOptions: boolean | WatchMode = watch && {
    onRebuild(error) {
      if (error) return console.error(error)
      console.log(`Build done for files under ${fromDirAbs}`)
    },
  }

  const cleanPlugin: Plugin = {
    name: 'clean',
    setup(build) {
      build.onStart(() => {
        try {
          fs.rmSync(toDirAbs, { recursive: true, force: true, maxRetries: 3 })
        } catch (_err) {
          // ignore error
        }
        fs.mkdirSync(toDirAbs, { recursive: true })
      })
    },
  }

  await build({
    platform: 'node',
    format: 'cjs',
    target,
    minify: true,
    keepNames: true,
    sourcemap: 'inline',
    bundle: true,
    outdir: toDirAbs,
    entryPoints,
    watch: watchOptions,
    plugins: [
      ...(clean ? [cleanPlugin] : []),
      nodeExternalsPlugin({
        allowList: [
          '@violet/web',
          '@violet/api',
          '@violet/def',
          '@violet/lib',
          '@violet/scripts',
          '@violet/lambda-conv2img',
        ],
      }),
    ],
  })
}

const args = arg({
  '--watch': Boolean,
  // NOTE: 現状未使用
  '--prod': Boolean,
  '--from-dir': String,
  '--to-dir': String,
  '--target': String,
  '--clean': Boolean,
})
main({
  watch: Boolean(args['--watch']),
  fromDir: args['--from-dir'] || '',
  toDir: args['--to-dir'] || '',
  target: args['--target'] || '',
  clean: Boolean(args['--clean']),
}).catch((e) => {
  console.error(e)
  process.exit(1)
})
