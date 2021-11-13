import { exec } from '@violet/lib/exec'
import type { S3Handler } from 'aws-lambda'
import * as fs from 'fs'
import type { IncomingMessage } from 'http'
import * as path from 'path'
import { getObject, putObject } from './s3'

const CONTENT_TYPES = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  png: 'image/png',
} as const

const FALLBACK_EXTS = ['jpg', 'png'] as const

type InfoJson = {
  fallbackImageExts: typeof FALLBACK_EXTS[number][]
}

const LOCAL_DIR_NAMES = {
  tmp: '/tmp/tmp',
  original: '/tmp/original',
  converted: '/tmp/converted',
} as const

Object.values(LOCAL_DIR_NAMES).forEach((name) => fs.mkdirSync(name, { recursive: true }))

const convertS3DataToPdf = (data: IncomingMessage, filename: string) =>
  new Promise<void>((resolve) => {
    const { dirname, onFinish } = {
      true: { dirname: LOCAL_DIR_NAMES.original, onFinish: resolve },
      false: {
        dirname: LOCAL_DIR_NAMES.tmp,
        onFinish: () =>
          exec(
            'libreoffice',
            [
              '--nolockcheck',
              '--nologo',
              '--headless',
              '--norestore',
              '--language=ja',
              '--nofirststartwizard',
              '--convert-to',
              'pdf',
              '--outdir',
              LOCAL_DIR_NAMES.original,
              path.join(LOCAL_DIR_NAMES.tmp, filename),
            ],
            false
          ).then(() => resolve()),
      },
    }[`${filename.endsWith('.pdf')}`]

    const writer = fs.createWriteStream(path.join(dirname, filename))
    writer.once('finish', onFinish)
    data.pipe(writer)
  })

export const handler: S3Handler = async (event) => {
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' ')) // ref: https://docs.aws.amazon.com/lambda/latest/dg/with-s3-tutorial.html#with-s3-tutorial-create-function-code
  const filename = `${Date.now()}-${key.split('/').pop()}`
  const convertedDir = path.join(LOCAL_DIR_NAMES.converted, filename.replace(/\.[^.]+$/, ''))
  fs.mkdirSync(convertedDir, { recursive: true })

  await getObject(key).then((data) => convertS3DataToPdf(data, filename))

  for (const ext of FALLBACK_EXTS) {
    await exec(
      'convert',
      [
        '-density',
        '400',
        '-resize',
        '1280x1280',
        '-alpha',
        'remove',
        '-quality',
        '85',
        path.join(LOCAL_DIR_NAMES.original, filename.replace(/[^.]+$/, 'pdf')),
        path.join(convertedDir, `%d.${ext}`),
      ],
      false
    )
  }

  // Todo: mozjpeg

  const info: InfoJson = {
    fallbackImageExts: [...Array(fs.readdirSync(convertedDir).length / FALLBACK_EXTS.length)].map(
      (_, i) =>
        FALLBACK_EXTS.map((ext) => ({
          ext,
          size: fs.statSync(path.join(convertedDir, `${i}.${ext}`)).size,
        })).sort((a, b) => a.size - b.size)[0].ext
    ),
  }

  for (let i = 0; i < info.fallbackImageExts.length; i += 1) {
    await exec(
      'convert',
      [
        path.join(convertedDir, `${i}.${info.fallbackImageExts[i]}`),
        path.join(convertedDir, `${i}.webp`),
      ],
      false
    )
  }

  const convertedKeyPrefix = key.replace(/\/original\/[^/]+$/, '/converted')

  await Promise.all(
    info.fallbackImageExts.flatMap((ext, i) =>
      (['webp', ext] as const).map((e) =>
        putObject(
          `${convertedKeyPrefix}/${i}.${e}`,
          CONTENT_TYPES[e],
          fs.readFileSync(path.join(convertedDir, `${i}.${e}`))
        )
      )
    )
  )

  await putObject(`${convertedKeyPrefix}/info.json`, 'application/json', JSON.stringify(info))
}
