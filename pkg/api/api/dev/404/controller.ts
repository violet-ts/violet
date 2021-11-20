import { defineController } from './$relay'

export default defineController(() => ({
  get: () => ({ status: 404, body: 'GET: Not Found' }),
  post: () => ({ status: 404, body: 'POST: Not Found' }),
}))
