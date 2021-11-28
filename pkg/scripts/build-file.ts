import arg from 'arg'
import type { Plugin, WatchMode } from 'esbuild'
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import * as fs from 'fs'
import * as path from 'path'

interface Params {
  from: string
  to: string
  watch: boolean
  target: string
}

const omitImportNodeNSPlugin: Plugin = {
  name: 'omit-import-node-ns',
  setup(build) {
    build.onResolve({ filter: /^node:/ }, (args) => {
      return {
        path: args.path.slice(5),
        external: true,
      }
    })
  },
}

const main = async ({ from, to, watch, target }: Params) => {
  const fromPath = path.resolve(process.cwd(), from)
  const toPath = path.resolve(process.cwd(), to)
  const toDir = path.dirname(toPath)

  fs.mkdirSync(toDir, { recursive: true })

  const watchOptions: boolean | WatchMode = watch && {
    onRebuild(error) {
      if (error) {
        console.error(error)
        return
      }
      console.log(`Build done for file ${fromPath}`)
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
    outfile: toPath,
    entryPoints: [fromPath],
    watch: watchOptions,
    plugins: [
      omitImportNodeNSPlugin,
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
  '--from': String,
  '--to': String,
  '--target': String,
})
main({
  watch: Boolean(args['--watch']),
  from: args['--from'] || '',
  to: args['--to'] || '',
  target: args['--target'] || '',
}).catch((e) => {
  console.error(e)
  process.exit(1)
})
