import { worksConvertedKeyPrefix, worksOriginalKeyPrefix } from '@violet/def/constants/s3'
import type { VioletEnv } from '@violet/def/env/violet'
import type { winston } from '@violet/lib/logger'
import { replaceKeyPrefix } from '@violet/lib/s3'
import type { TestCaseJson } from '@violet/lib/s3/tester/types'
import type { InfoJson } from '@violet/lib/types/files'
import fetch from 'node-fetch'

interface CheckParams {
  env: VioletEnv
  caseJson: TestCaseJson
  logger: winston.Logger
  destKeyPrefix: string
}

const assert = (checker: boolean, err: () => Error) => {
  if (!checker) throw err()
}

export const check = async ({
  env,
  logger,
  destKeyPrefix,
  caseJson,
}: CheckParams): Promise<void> => {
  const { numOfPages } = caseJson

  const convertedKeyPrefix = replaceKeyPrefix(
    destKeyPrefix,
    worksOriginalKeyPrefix,
    worksConvertedKeyPrefix
  )

  const convertedInfoJsonKey = `${convertedKeyPrefix}info.json`
  const infoJson = (await fetch(
    `${env.S3_ENDPOINT}/${env.S3_BUCKET_CONVERTED}/${convertedInfoJsonKey}`
  ).then((res) => {
    if (!res.ok) throw new Error('info.json not found')
    return res.json()
  })) as InfoJson
  logger.debug('info.json found', { infoJson })
  if (infoJson.fallbackImageExts.length === 0)
    throw Object.assign(new Error('no image generated'), { infoJson })
  if (typeof numOfPages === 'number') {
    const want = numOfPages
    const got = infoJson.fallbackImageExts.length
    assert(want === got, () => Object.assign(new Error('wrong number of pages'), { want, got }))
  }
}
