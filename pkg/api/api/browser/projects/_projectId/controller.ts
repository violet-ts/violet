import { getDesks, updateProject } from '@violet/api/src/service/browser'
import type { ProjectId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const desks = await getDesks(params.projectId as ProjectId)
    return desks ? { status: 200, body: desks } : { status: 404 }
  },
  put: async ({ params, body }) => {
    const project = await updateProject(params.projectId as ProjectId, body.name)
    return project ? { status: 200, body: project } : { status: 404 }
  },
}))
