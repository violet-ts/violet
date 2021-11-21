import type { FastifyReply, FastifyRequest } from 'fastify'
import { defineHooks } from './$relay'

const injectionKeysFromReply = ['generateCsrf'] as const

type InjectionFromReply = Pick<FastifyReply, typeof injectionKeysFromReply[number]>

export type AdditionalRequest = Pick<
  FastifyRequest,
  | 'cookies'
  | 'env'
  | 'logger'
  | 'unsignCookie'
  | 'getUserClaims'
  | 'refreshUserClaims'
  | 'ensureUserClaims'
> &
  InjectionFromReply & {
    setCookie: (...args: Parameters<FastifyReply['setCookie']>) => void
  }

export default defineHooks((fastify) => ({
  onRequest: async (req, reply) => {
    for (const key of injectionKeysFromReply) {
      const value = reply[key]
      Object.assign(req, {
        [key]: typeof value === 'function' ? value.bind(reply) : value,
      })
    }
    Object.assign(req, {
      setCookie: (...args: Parameters<FastifyReply['setCookie']>) => void reply.setCookie(...args),
    })
    if (req.method !== 'GET' && req.method !== 'OPTIONS') {
      await new Promise<void>((resolve) => {
        fastify.csrfProtection(req, reply, resolve)
      })
    }
  },
}))
