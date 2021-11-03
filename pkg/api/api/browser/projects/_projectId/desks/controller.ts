import { getDesks } from '@violet/api/src/service/browser'
import type { ProjectId } from '@violet/api/src/types'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const desks = await getDesks(params.projectId as ProjectId)
    return desks ? { status: 200, body: desks } : { status: 404 }
  },
}))
