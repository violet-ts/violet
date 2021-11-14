import type { Credentials, Provider } from '@aws-sdk/types'
import { worksConvertedKeyPrefix, worksOriginalKeyPrefix } from '@violet/def/constants/s3'
import type { VioletEnv } from '@violet/def/envValues'
import { exec } from '@violet/lib/exec'
import type { Logger } from '@violet/lib/logger'
import { replaceKeyPrefix } from '@violet/lib/s3'
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

export const LOCAL_DIR_NAMES = {
  tmp: '/tmp/tmp',
  original: '/tmp/original',
  converted: '/tmp/converted',
} as const

interface ConvertS3DataToPdfParams {
  data: IncomingMessage
  filename: string
}
const convertS3DataToPdf = ({ data, filename }: ConvertS3DataToPdfParams) =>
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

interface ConvertObjectParams {
  bucket: string
  key: string
  env: VioletEnv
  logger: Logger
  credentials: Credentials | Provider<Credentials>
}
export const convertObject = async ({
  bucket,
  key,
  env,
  logger,
  credentials,
}: ConvertObjectParams): Promise<void> => {
  Object.values(LOCAL_DIR_NAMES).forEach((name) => fs.mkdirSync(name, { recursive: true }))
  if (bucket !== env.S3_BUCKET_ORIGINAL) {
    console.warn(`Ignored bucket s3://${bucket}`)
    return
  }
  const convertedKeyPrefix = replaceKeyPrefix(
    key.split('/').slice(0, -1).join('/'),
    worksOriginalKeyPrefix,
    worksConvertedKeyPrefix
  )

  const filename = `${Date.now()}-${key.split('/').pop()}`
  const convertedDir = path.join(LOCAL_DIR_NAMES.converted, filename.replace(/\.[^.]+$/, ''))
  fs.mkdirSync(convertedDir, { recursive: true })
  logger.info('Destination directory created.')

  const data = await getObject({ key, env, logger, credentials })
  logger.info('Downloaded object.')

  await convertS3DataToPdf({ data, filename })
  logger.info('Converted to PDF.')

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
  logger.info('Converted fallbacks.')

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
  logger.info('Converted to webp.')

  await Promise.all(
    info.fallbackImageExts.flatMap((ext, i) =>
      (['webp', ext] as const).map((e) =>
        putObject({
          key: `${convertedKeyPrefix}/${i}.${e}`,
          contentType: CONTENT_TYPES[e],
          body: fs.readFileSync(path.join(convertedDir, `${i}.${e}`)),
          env,
          logger,
          credentials,
        })
      )
    )
  )
  logger.info('Uploaded images.')

  await putObject({
    key: `${convertedKeyPrefix}/info.json`,
    contentType: 'application/json',
    body: JSON.stringify(info),
    env,
    logger,
    credentials,
  })
  logger.info('Uploaded info.json.')
}
