import { updateDir } from '@violet/api/src/service/browser/dirs'
import type { DirId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  patch: async ({ params, body }) => {
    return { status: 200, body: await updateDir(params.dirId as DirId, body) }
  },
}))
