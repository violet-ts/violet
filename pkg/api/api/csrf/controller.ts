import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ generateCsrf }) => ({ status: 200, body: await generateCsrf() }),
}))
