import { parseVioletEnv } from '@violet/def/env/violet'
import { convertObject } from '@violet/lambda-conv2img/src/convert-object'
import { createCredentials } from '@violet/lambda-conv2img/src/credentials'
import { findS3LocationsInEvent } from '@violet/lib/lambda/s3'
import { createChildLogger, createLogger } from '@violet/lib/logger'
import type { S3Handler, SNSHandler, SQSHandler } from 'aws-lambda'

export const handler: S3Handler & SQSHandler & SNSHandler = async (event) => {
  const env = parseVioletEnv(process.env)
  const credentials = createCredentials(env)
  const logger = createLogger({ env, credentials, service: 'conv2img' })

  logger.info('Event received.', { event })
  const locations = findS3LocationsInEvent(event)
  if (locations.length === 0) throw new Error('no location found in received event')
  logger.info(`Found ${locations.length} location(s).`)
  let failCount = 0
  for (const { key, bucket } of locations) {
    logger.info(`s3://${bucket}/${key} is found in event.`)
    await convertObject({
      bucket,
      key,
      env,
      logger: createChildLogger(logger, key),
      credentials,
    }).catch((err: unknown) => {
      logger.error(`Failed to convert s3://${bucket}/${key}`, { err, errMessage: String(err) })
      failCount += 1
    })
  }
  if (failCount > 0) {
    throw new Error(`failed to convert ${failCount} object(s)`)
  }
}
