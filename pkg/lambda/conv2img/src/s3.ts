import type { GetObjectCommandInput } from '@aws-sdk/client-s3'
import { S3 } from '@aws-sdk/client-s3'
import type { Credentials, Provider } from '@aws-sdk/types'
import type { VioletEnv } from '@violet/def/env/violet'
import type { winston } from '@violet/lib/logger'
import { IncomingMessage } from 'http'

interface CreateS3ClientParams {
  env: VioletEnv
  credentials: Credentials | Provider<Credentials>
  logger: winston.Logger
}
export const createS3Client = ({ env, logger, credentials }: CreateS3ClientParams) => {
  return new S3({
    region: env.S3_REGION,
    credentials,
    logger,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: true,
  })
}

export const getObject = (s3: S3, input: GetObjectCommandInput) =>
  s3.getObject(input).then(({ Body }) => {
    if (Body instanceof IncomingMessage) return Body

    throw new Error('Body of getObject is not IncomingMessage')
  })
