import type { winston } from '@violet/lib/logger'
import type { FastifyLogFn, FastifyLoggerInstance, FastifyReply, FastifyRequest } from 'fastify'
import 'fastify-cookie'

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

const summarizeSensitive = (obj: unknown) => {
  return {
    type: typeof obj,
    length: typeof obj === 'string' || Array.isArray(obj) ? obj.length : null,
  }
}

const summarizeCookies = (cookies: Record<string, unknown>) => {
  const keys = Object.keys(cookies)
  if (keys.length === 0) return null
  return {
    keys,
    wellKnown: Object.fromEntries(
      Object.entries(cookies).map(([key, value]) => [key, summarizeSensitive(value)])
    ),
  }
}

const summarizeHeaders = (headers: Record<string, unknown>) => {
  const keys = Object.keys(headers)
  if (keys.length === 0) return null
  const wellKnownKeys = [
    'host',
    'origin',
    'user-agent',
    'accept',
    'content-length',
    'cache-control',
    'accept-encoding',
    'referer',
    'accept-language',
    // ALB specific headers
    // https://docs.aws.amazon.com/elasticloadbalancing/latest/application/x-forwarded-headers.html
    'x-forwarded-for',
    'x-forwarded-proto',
    'x-forwarded-port',
  ]
  return {
    keys,
    wellKnown: Object.fromEntries(
      wellKnownKeys.filter((key) => headers[key] != null).map((key) => [key, headers[key]])
    ),
  }
}

// eslint-disable-next-line complexity -- listing
const extractInfo = (obj: unknown): unknown => {
  if (typeof obj !== 'object') return obj
  if (obj === null) return obj
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyObj: any = obj
  const maybeRequest: DeepPartial<FastifyRequest> = anyObj.req
  const maybeReply: DeepPartial<FastifyReply> = anyObj.reply
  return Object.fromEntries(
    Object.entries({
      keys: Object.keys(anyObj),
      err: anyObj.err,
      responseTime: anyObj.responseTime,
      url: maybeRequest?.url,
      method: maybeRequest?.method,
      ip: maybeRequest?.ip,
      reqCookie: summarizeCookies(maybeRequest?.cookies ?? {}),
      replyStatus: maybeReply?.status,
      reqHeaderSummary: summarizeHeaders(maybeRequest?.headers ?? {}),
      replyHeaderSummary: summarizeHeaders(maybeReply?.headers ?? {}),
    }).filter(([_key, value]) => value != null)
  )
}

export const convertToLeveledFastifyLogger = (
  leveledLogger: winston.LeveledLogMethod
): FastifyLogFn => {
  return (obj: unknown, msg?: unknown) => {
    if (typeof msg === 'string') {
      leveledLogger(msg, extractInfo(obj))
    } else {
      leveledLogger(extractInfo(obj))
    }
  }
}

export const convertToFastifyLogger = (logger: winston.Logger): FastifyLoggerInstance => ({
  trace: () => {},
  debug: () => {},
  info: convertToLeveledFastifyLogger(logger.debug.bind(logger)),
  warn: convertToLeveledFastifyLogger(logger.warn.bind(logger)),
  error: convertToLeveledFastifyLogger(logger.warn.bind(logger)),
  fatal: convertToLeveledFastifyLogger(logger.error.bind(logger)),
  child: (bindings) => convertToFastifyLogger(logger.child(bindings)),
})
