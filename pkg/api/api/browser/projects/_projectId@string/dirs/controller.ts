import { createDirs, getDirs } from '@violet/api/src/service/browser'
import type { ProjectId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    return { status: 200, body: await getDirs(params.projectId as ProjectId) }
  },
  post: async ({ params, body }) => {
    const dirs = await createDirs(params.projectId as ProjectId, body.parentDirId, body.names)
    return { status: 201, body: dirs }
  },
}))
