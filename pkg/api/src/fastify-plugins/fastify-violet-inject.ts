import type { VioletEnv } from '@violet/def/env/violet'
import type { winston } from '@violet/lib/logger'
import { createChildLogger } from '@violet/lib/logger'
import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    logger: winston.Logger
    env: VioletEnv
  }
}

export interface FastifyVioletInjectOptions {
  logger: winston.Logger
  env: VioletEnv
}

const fastifyVioletInject: FastifyPluginCallback<FastifyVioletInjectOptions> = fp(
  (fastify: FastifyInstance, options: FastifyVioletInjectOptions, next: () => void) => {
    fastify.decorateRequest('logger', null)
    fastify.decorateRequest('env', { getter: () => options.env })

    fastify.addHook(
      'onRequest',
      (fastifyReq: FastifyRequest, _fastifyRes: FastifyReply, done: () => void) => {
        fastifyReq.logger = createChildLogger(
          createChildLogger(options.logger, fastifyReq.url),
          fastifyReq.method
        )
        done()
      }
    )

    next()
  },
  {
    fastify: '>=3',
    name: 'fastify-winston-logger',
  }
)

export default fastifyVioletInject
