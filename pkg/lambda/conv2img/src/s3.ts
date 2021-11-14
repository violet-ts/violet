import { S3 } from '@aws-sdk/client-s3'
import type { Credentials, Provider } from '@aws-sdk/types'
import type { VioletEnv } from '@violet/def/envValues'
import type { Logger } from '@violet/lib/logger'
import { IncomingMessage } from 'http'

interface CreateS3ClientParams {
  env: VioletEnv
  credentials: Credentials | Provider<Credentials>
  logger: Logger
}
const createS3Client = ({ env, logger, credentials }: CreateS3ClientParams) => {
  return new S3({
    region: env.S3_REGION,
    credentials,
    logger,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: true,
  })
}

interface GetObjectParams {
  key: string
  env: VioletEnv
  credentials: Credentials | Provider<Credentials>
  logger: Logger
}
export const getObject = ({ key, env, logger, credentials }: GetObjectParams) =>
  createS3Client({ env, credentials, logger })
    .getObject({ Bucket: env.S3_BUCKET_ORIGINAL, Key: key })
    .then(({ Body }) => {
      if (Body instanceof IncomingMessage) return Body

      throw new Error('Body of getObject is not IncomingMessage')
    })

interface PutObjectParams {
  key: string
  contentType: string
  body: Buffer | string
  env: VioletEnv
  credentials: Credentials | Provider<Credentials>
  logger: Logger
}
export const putObject = async ({
  key,
  body,
  env,
  logger,
  credentials,
  contentType,
}: PutObjectParams) =>
  createS3Client({ env, logger, credentials })
    .putObject({
      Bucket: env.S3_BUCKET_CONVERTED,
      Key: key,
      ContentType: contentType,
      Body: body,
    })
    .then((res) => res.$metadata)
