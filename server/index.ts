import Fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import server from './$server'
import { createBucketIfNotExists } from './service/s3'
import { BASE_PATH, SERVER_PORT } from './utils/envValues'

const fastify = Fastify()

const startServer = async () => {
  await createBucketIfNotExists()
  server(fastify, { basePath: BASE_PATH })
  fastify.listen(SERVER_PORT, '::')
}

fastify.register(helmet)
fastify.register(cors)

startServer()
