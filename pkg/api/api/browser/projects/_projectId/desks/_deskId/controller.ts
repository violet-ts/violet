import { createWork } from '@violet/api/src/service/browser'
import type { DeskId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  post: async ({ params, body }) => {
    const work = await createWork(params.deskId as DeskId, body.path, body.name, body.ext)

    return { status: 201, body: work }
  },
}))
