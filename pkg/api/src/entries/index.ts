import 'source-map-support/register'

import Fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import server from '@violet/api/$server'
import { createBucketIfNotExists } from '@violet/api/src/service/s3'
import { API_BASE_PATH, API_PORT } from '@violet/api/src/utils/envValues'

const fastify = Fastify()

const startServer = async () => {
  await createBucketIfNotExists()
  server(fastify, { basePath: API_BASE_PATH })
  fastify.listen(API_PORT, '::')
  console.log(`API started on :: port ${API_PORT}`)
}

fastify.register(helmet)
fastify.register(cors)

startServer()
