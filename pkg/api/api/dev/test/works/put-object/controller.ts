import { defineController } from './$relay'

export default defineController(() => ({
  get: () => {
    return {
      status: 200,
      body: null,
    }
  },
  post: () => {
    return {
      status: 200,
      body: null,
    }
  },
}))
