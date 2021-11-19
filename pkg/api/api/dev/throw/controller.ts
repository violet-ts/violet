import { defineController } from './$relay'

export default defineController(() => ({
  get: () => {
    throw new Error('GET: Thrown error')
  },
  post: () => {
    throw new Error('POST: Thrown error')
  },
}))
