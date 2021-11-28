import server from '@violet/api/$server'
import user from '@violet/api/src/fastify-plugins/fastify-user'
import violetInject from '@violet/api/src/fastify-plugins/fastify-violet-inject'
import { getCredentials } from '@violet/api/src/service/aws-credential'
import { getCachedApp } from '@violet/api/src/service/firebase-admin'
import { parseVioletEnv } from '@violet/def/env/violet'
import { createLogger } from '@violet/lib/logger'
import { convertToFastifyLogger } from '@violet/lib/logger/fastify'
import Fastify from 'fastify'
import cookie from 'fastify-cookie'
import cors from 'fastify-cors'
import csrf from 'fastify-csrf'
import helmet from 'fastify-helmet'

const startServer = async () => {
  const env = parseVioletEnv(process.env)
  const { API_BASE_PATH, API_PORT } = env
  const credentials = getCredentials()
  const logger = createLogger({ env, service: '@violet/api', credentials })

  // To cache firebase admin app.
  getCachedApp({ logger, env })

  const fastify = Fastify({ logger: convertToFastifyLogger(logger) })

  server(fastify, { basePath: API_BASE_PATH })

  await fastify.register(helmet)
  // TODO(security): CORS の設定を制限しないと CSRF の効果はない
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  })
  // TODO(security): use cookie secret with secrets manager rotation
  await fastify.register(cookie, { secret: 'secretforawhile' })
  await fastify.register(violetInject, { env, logger })
  await fastify.register(user)
  await fastify.register(csrf, {
    cookieOpts: {
      signed: true,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })

  console.log(`API started on :: port ${API_PORT}`)
  await fastify.listen(API_PORT, '::')
}

void startServer().catch((err) => {
  console.error(err)
  process.exit(1)
})
