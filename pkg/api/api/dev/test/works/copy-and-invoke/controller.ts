import { createS3PutObjectTestContext } from '@violet/lib/s3/tester'
import { defineController } from './$relay'

const ctx = createS3PutObjectTestContext()

export default defineController(() => ({
  get: () => {
    return {
      status: 200,
      body: ctx.getStatus(),
    }
  },
  post: ({ body: { keys, bucket, concurrency }, env, logger }) => {
    if (ctx.isRunning()) {
      return {
        status: 400,
        body: null,
      }
    }
    void ctx.start({ bucket, keys, concurrency, env, logger })
    return {
      status: 200,
      body: null,
    }
  },
}))
