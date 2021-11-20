import type { Credentials, Provider } from '@aws-sdk/types'
import type { VioletEnv } from '@violet/def/env/violet'
import stringify from 'safe-stable-stringify'
import type { Logger } from 'winston'
import * as winston from 'winston'

export type { winston }

const replacer = (_key: string, value: unknown): unknown => {
  if (value instanceof Buffer) return value.toString('base64')
  if (value instanceof Set) return `Set(${[...value.keys()].join(', ')})`
  if (typeof value === 'bigint') return value.toString()
  return value
}

export const cloudwatchLogsFormat = winston.format.printf((info) => {
  return `${info.level}: ${info.message} ${stringify(info, replacer)}`
})

export interface CreateLoggerParams {
  env: VioletEnv
  credentials?: Credentials | Provider<Credentials> | undefined
  service: string
}
export const createLogger = ({ env, service }: CreateLoggerParams): Logger => {
  const logger = winston.createLogger({
    level: 'debug',
    defaultMeta: { service: [service] },
  })

  logger.add(
    new winston.transports.Console({
      level: 'debug',
      format: env.PRETTY_LOGGING === '1' ? winston.format.prettyPrint() : cloudwatchLogsFormat,
    })
  )

  if (env.CLOUDWATCH_CRITICAL_LOG_GROUP) {
    // const cloudWatchLogs = new CloudWatchLogs({ credentials })
    // TODO: critical level logging
  }

  return logger
}

export const createChildLogger = (logger: Logger, name: string): Logger => {
  const childLogger = logger.child({})
  childLogger.defaultMeta = {
    ...logger.defaultMeta,
    service: [...logger.defaultMeta.service, name],
  }
  return childLogger
}
