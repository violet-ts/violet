import { getDesks, updateProject } from '@violet/api/src/service/browser'
import type { ProjectId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const desks = await getDesks(params.projectId as ProjectId)
    return { status: 200, body: desks }
  },
  put: async ({ params, body }) => {
    const project = await updateProject(params.projectId as ProjectId, body.name)
    return { status: 200, body: project }
  },
}))
