import { defineController } from './$relay'

export default defineController(() => ({
  get: ({ logger }) => {
    logger.info('Reached GET dev/')
    return { status: 200, body: 'Hello' }
  },
}))
