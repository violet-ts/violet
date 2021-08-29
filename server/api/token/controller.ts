import { validateUser } from '$/service/user'
import { defineController } from './$relay'

export default defineController((fastify) => ({
  post: ({ body }) =>
    validateUser(body.id, body.pass)
      ? { status: 201, body: { token: fastify.jwt.sign({ id: body.id }) } }
      : { status: 401 },
}))
