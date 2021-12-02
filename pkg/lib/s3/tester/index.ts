import { worksConvertedKeyPrefix, worksOriginalKeyPrefix } from '@violet/def/constants/s3'
import type { VioletEnv } from '@violet/def/env/violet'
import { dockerComposeNameToContainerName } from '@violet/lib/docker/docker-compose'
import { execThrow } from '@violet/lib/exec'
import type { winston } from '@violet/lib/logger'
import { createChildLogger } from '@violet/lib/logger'
import { downloadJson, downloadObjectTo } from '@violet/lib/s3/public-server'
import type {
  RunningStatusInternal,
  S3PutObjectTestContext,
  StartParams,
  TestCaseJson,
} from '@violet/lib/s3/tester/types'
import { createTmpdirContext } from '@violet/lib/tmpdir'
import { Sema } from 'async-sema'
import PLazy from 'p-lazy'
import * as path from 'path'
import { check } from './check'
import { constructInput } from './construct-input'

export const createS3PutObjectTestContext = (): S3PutObjectTestContext => {
  let status: RunningStatusInternal | null = null
  let sema: Sema | null = null
  const minioContainerName = PLazy.from(() => dockerComposeNameToContainerName('minio'))
  const startKey = async (
    bucket: string,
    contentKey: string,
    jsonKey: string | undefined,
    tmpContentPath: string,
    env: VioletEnv,
    logger: winston.Logger
  ) => {
    if (!sema) throw new Error('sema is not initialized')
    await sema.acquire()

    const main = async (): Promise<void> => {
      if (!status) throw new Error('status not set')
      status.results[contentKey] = {
        type: 'running',
        startTime: Date.now(),
      }

      await downloadObjectTo(bucket, contentKey, tmpContentPath)
      const caseJson = jsonKey ? ((await downloadJson(bucket, jsonKey)) as TestCaseJson) : {}
      const [suite, filename] = contentKey.split('/').slice(-2)

      // '%' を使うと convert とかぶるので避ける
      const destKeyPrefix = `${worksOriginalKeyPrefix}/projects/test-works-proj-${
        status.id
      }/revisions/${suite}--${encodeURIComponent(filename).replace(/%/g, '$')}/`
      const minioContentDirPath = `/data/${env.S3_BUCKET_ORIGINAL}/${destKeyPrefix}`
      const minioContentPath = `${minioContentDirPath}${filename}`
      const destKey = `${destKeyPrefix}${filename}`

      const json = JSON.stringify(
        constructInput({
          env,
          destKey,
          caseJson,
        })
      )

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
      await check({
        env,
        logger,
        destKeyPrefix,
        caseJson,
      })
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
      results: Object.fromEntries(
        keys.map((key) => [key.contentKey, { type: 'waiting' }] as const)
      ),
    }
    status = thisStatus
    try {
      await Promise.all(
        keys.map((key, i) =>
          startKey(
            bucket,
            key.contentKey,
            key.jsonKey,
            path.resolve(tmpdir, `content-${`000${i}`.slice(-4)}`),
            env,
            createChildLogger(logger, key.contentKey)
          )
            .then(() => {
              thisStatus.results[key.contentKey] = {
                ...thisStatus.results[key.contentKey],
                type: 'succeeded',
                endTime: Date.now(),
              }
            })
            .catch((err: unknown) => {
              const errorMessage = String(err)
              thisStatus.results[key.contentKey] = {
                ...thisStatus.results[key.contentKey],
                type: 'failed',
                endTime: Date.now(),
                errorMessage,
              }
              createChildLogger(logger, 'error').error(`Failed to convert ${key.contentKey}`, {
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
