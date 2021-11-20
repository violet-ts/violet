import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ getUserClaims }) => ({
    status: 200,
    body: await getUserClaims(),
  }),
}))
