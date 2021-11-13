import server from '@violet/api/$server'
import envValues from '@violet/api/src/utils/envValues'
import Fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'

const { API_BASE_PATH, API_PORT } = envValues

const fastify = Fastify()

const startServer = async () => {
  server(fastify, { basePath: API_BASE_PATH })
  fastify.listen(API_PORT, '::')
  console.log(`API started on :: port ${API_PORT}`)
}

fastify.register(helmet)
fastify.register(cors)

startServer()
