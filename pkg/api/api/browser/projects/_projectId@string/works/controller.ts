import { createWork } from '@violet/api/src/service/browser/work'
import { defineController } from './$relay'

export default defineController(() => ({
  post: async ({ body }) => {
    return { status: 201, body: await createWork(body.parentDirId, body.name) }
  },
}))
