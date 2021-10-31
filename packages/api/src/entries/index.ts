import 'source-map-support/register'

import Fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import server from '@violet/api/$server'
import { createBucketIfNotExists } from '@violet/api/src/service/s3'
import { BASE_PATH, SERVER_PORT } from '@violet/api/src/utils/envValues'

const fastify = Fastify()

const startServer = async () => {
  await createBucketIfNotExists()
  server(fastify, { basePath: BASE_PATH })
  fastify.listen(SERVER_PORT, '::')
  console.log(`API started on :: port ${SERVER_PORT}`)
}

fastify.register(helmet)
fastify.register(cors)

startServer()
