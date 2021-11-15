import server from '@violet/api/$server'
import { getCredentials } from '@violet/api/src/service/aws-credential'
import envValues from '@violet/api/src/utils/envValues'
import type { Logger } from '@violet/lib/logger'
import { createLogger } from '@violet/lib/logger'
import type { FastifyLoggerInstance } from 'fastify'
import Fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'

const { API_BASE_PATH, API_PORT } = envValues
const credentials = getCredentials()

const logger = createLogger({ env: envValues, service: '', credentials })
const convertTofastifyLogger = (logger: Logger): FastifyLoggerInstance => ({
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.error.bind(logger),
  child: (bindings) => convertTofastifyLogger(logger.child(bindings)),
})

const fastify = Fastify({ logger: convertTofastifyLogger(logger) })

const startServer = async () => {
  server(fastify, { basePath: API_BASE_PATH })
  fastify.listen(API_PORT, '::')
  console.log(`API started on :: port ${API_PORT}`)
}

fastify.register(helmet)
fastify.register(cors)

startServer()
