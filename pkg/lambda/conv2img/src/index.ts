import { worksConvertedKeyPrefix, worksOriginalKeyPrefix } from '@violet/def/constants/s3'
import { extractEnv } from '@violet/def/envValues'
import { exec } from '@violet/lib/exec'
import { findS3LocationsInEvent } from '@violet/lib/lambda/s3'
import { replaceKeyPrefix } from '@violet/lib/s3'
import type { S3Handler, SNSHandler, SQSHandler } from 'aws-lambda'
import * as fs from 'fs'
import type { IncomingMessage } from 'http'
import * as path from 'path'
import { getObject, putObject } from './s3'

const { S3_BUCKET_ORIGINAL } = extractEnv(process.env)

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

const convertObject = async (bucket: string, key: string): Promise<void> => {
  if (bucket !== S3_BUCKET_ORIGINAL) {
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

  await getObject(key).then((data) => convertS3DataToPdf(data, filename))
  console.log('Downloaded object.');

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
  console.log('Converted fallbacks.');

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
  console.log('Converted to webp.');

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
  console.log('Uploaded images.');

  await putObject(`${convertedKeyPrefix}/info.json`, 'application/json', JSON.stringify(info))
  console.log('Uploaded info.json.');
}

export const handler: S3Handler & SQSHandler & SNSHandler = async (event) => {
  console.log('Event received.', JSON.stringify({ event }))
  const locations = findS3LocationsInEvent(event)
  if (locations.length === 0) throw new Error('no location found in received event')
  console.log(`Found ${locations.length} location(s).`)
  let failCount = 0
  for (const { key, bucket } of locations) {
    console.log(`s3://${bucket}/${key} is found in event.`)
    await convertObject(bucket, key).catch((err: unknown) => {
      console.error(`Failed to convert s3://${bucket}/${key}`)
      console.error(err)
      failCount += 1
    })
  }
  if (failCount > 0) {
    throw new Error(`failed to convert ${failCount} object(s)`)
  }
}
