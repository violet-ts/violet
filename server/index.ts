import Fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import fastifyJwt from 'fastify-jwt'
import fastifyStatic from 'fastify-static'
import path from 'path'
import server from './$server'
import { BASE_PATH, JWT_SECRET, SERVER_PORT } from './utils/envValues'

const fastify = Fastify()

fastify.register(helmet)
fastify.register(cors)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: BASE_PATH,
})
fastify.register(fastifyJwt, { secret: JWT_SECRET })

server(fastify, { basePath: BASE_PATH })

fastify.listen(SERVER_PORT)
