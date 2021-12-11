import { worksConvertedKeyPrefix, worksOriginalKeyPrefix } from '@violet/def/constants/s3'
import type { VioletEnv } from '@violet/def/env/violet'
import { dockerComposeNameToContainerName } from '@violet/lib/docker/docker-compose'
import { execThrow } from '@violet/lib/exec'
import type { winston } from '@violet/lib/logger'
import { createChildLogger } from '@violet/lib/logger'
import { replaceKeyPrefix } from '@violet/lib/s3'
import { downloadObjectTo } from '@violet/lib/s3/public-server'
import type {
  RunningStatusInternal,
  S3PutObjectTestContext,
  StartParams,
} from '@violet/lib/s3/tester/types'
import { createTmpdirContext } from '@violet/lib/tmpdir'
import type { InfoJson } from '@violet/lib/types/files'
import { Sema } from 'async-sema'
import fetch from 'node-fetch'
import PLazy from 'p-lazy'
import * as path from 'path'

export const createS3PutObjectTestContext = (): S3PutObjectTestContext => {
  let status: RunningStatusInternal | null = null
  let sema: Sema | null = null
  const minioContainerName = PLazy.from(() => dockerComposeNameToContainerName('minio'))
  const startKey = async (
    bucket: string,
    key: string,
    tmpContentPath: string,
    env: VioletEnv,
    logger: winston.Logger
  ) => {
    if (!sema) throw new Error('sema is not initialized')
    await sema.acquire()

    const main = async (): Promise<void> => {
      if (!status) throw new Error('status not set')
      status.results[key] = {
        type: 'running',
        startTime: Date.now(),
      }

      await downloadObjectTo(bucket, key, tmpContentPath)
      const [suite, filename] = key.split('/').slice(-2)

      // '%' を使うと convert とかぶるので避ける
      const destKeyPrefix = `${worksOriginalKeyPrefix}/projects/test-works-proj-${
        status.id
      }/revisions/${suite}--${encodeURIComponent(filename).replace(/%/g, '$')}/`
      const minioContentDirPath = `/data/${env.S3_BUCKET_ORIGINAL}/${destKeyPrefix}`
      const minioContentPath = `${minioContentDirPath}${filename}`
      const destKey = `${destKeyPrefix}${filename}`

      const convertedKeyPrefix = replaceKeyPrefix(
        destKeyPrefix,
        worksOriginalKeyPrefix,
        worksConvertedKeyPrefix
      )
      const convertedInfoJsonKey = `${convertedKeyPrefix}info.json`

      const json = JSON.stringify({
        Records: [
          {
            s3: {
              bucket: {
                name: env.S3_BUCKET_ORIGINAL,
              },
              object: {
                key: encodeURIComponent(destKey).replace(/ /g, '+'),
              },
            },
          },
        ],
      })

      await execThrow(
        'docker-compose',
        ['exec', '-T', 'minio', 'mkdir', '-p', minioContentDirPath],
        false
      )
      await execThrow(
        'docker',
        ['cp', tmpContentPath, `${await minioContainerName}:${minioContentPath}`],
        false
      )
      await execThrow(
        'docker-compose',
        [
          'exec',
          '-T',
          'lambda',
          'node',
          '--unhandled-rejections=throw',
          './pkg/lambda/conv2img/build/invoke',
          json,
        ],
        false
      )

      const infoJson = (await fetch(
        `${env.S3_ENDPOINT}/${env.S3_BUCKET_CONVERTED}/${convertedInfoJsonKey}`
      ).then((res) => {
        if (!res.ok) throw new Error('info.json not found')
        return res.json()
      })) as InfoJson
      logger.debug('info.json found', { infoJson })
      if (infoJson.fallbackImageExts.length === 0)
        throw Object.assign(new Error('no image generated'), { infoJson })

      // TODO: 事前定義したページ数と一致するかテストする機能を追加
    }

    try {
      await main()
    } finally {
      sema.release()
    }
  }
  const start = async ({ keys, bucket, concurrency, env, logger }: StartParams) => {
    sema = new Sema(concurrency)
    const tmpdirCtx = createTmpdirContext()
    const tmpdir = tmpdirCtx.open()
    const id = Math.random().toFixed(8).slice(-8)
    const minioOriginalDir = `/data/${env.S3_BUCKET_ORIGINAL}/${worksOriginalKeyPrefix}/projects/test-works-proj-${id}/revisions/`
    const minioConvertedDir = `/data/${env.S3_BUCKET_CONVERTED}/${worksConvertedKeyPrefix}/projects/test-works-proj-${id}/revisions/`
    const thisStatus: RunningStatusInternal = {
      bucket,
      id,
      minioOriginalDir,
      minioConvertedDir,
      tmpdir,
      results: Object.fromEntries(keys.map((key) => [key, { type: 'waiting' }] as const)),
    }
    status = thisStatus
    try {
      await Promise.all(
        keys.map((key, i) =>
          startKey(
            bucket,
            key,
            path.resolve(tmpdir, `content-${`000${i}`.slice(-4)}`),
            env,
            createChildLogger(logger, key)
          )
            .then(() => {
              thisStatus.results[key] = {
                ...thisStatus.results[key],
                type: 'succeeded',
                endTime: Date.now(),
              }
            })
            .catch((err: unknown) => {
              const errorMessage = String(err)
              thisStatus.results[key] = {
                ...thisStatus.results[key],
                type: 'failed',
                endTime: Date.now(),
                errorMessage,
              }
              createChildLogger(logger, 'error').error(`Failed to convert ${key}`, {
                key,
                i,
                err,
                errorMessage,
              })
            })
        )
      )
    } finally {
      tmpdirCtx.close()
      sema = null
    }
  }
  const isRunning = () =>
    status !== null &&
    Object.values(status.results)
      .map(({ type: status }) => status)
      .includes('running')
  return {
    getStatus: () =>
      status && {
        ...status,
        running: isRunning(),
      },
    isRunning,
    start,
  }
}
