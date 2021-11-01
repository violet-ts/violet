import * as path from 'path'
import type { WatchMode } from 'esbuild'
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

const apiRootDir = path.resolve(__dirname, '..')
const entry = path.resolve(apiRootDir, 'src', 'entries', 'index.ts')
const buildDir = path.resolve(apiRootDir, 'build')

const main = async (watch: boolean) => {
  const watchOptions: boolean | WatchMode = watch
    ? {
        onRebuild(error) {
          if (!error) return console.error(error)
          console.log('building...')
        },
      }
    : false

  await build({
    platform: 'node',
    format: 'cjs',
    // NOTE(why): node16 docker イメージを使用
    target: 'node16',
    minify: true,
    sourcemap: 'inline',
    bundle: true,
    outdir: buildDir,
    entryPoints: [entry],
    watch: watchOptions,
    plugins: [
      nodeExternalsPlugin({
        allowList: ['@violet/web', '@violet/api'],
      }),
    ],
  })
}

main(process.argv.includes('--watch')).catch((e) => {
  console.error(e)
})
