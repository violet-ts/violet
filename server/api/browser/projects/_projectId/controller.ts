import { getDesks } from '$/service/browser'
import type { ProjectId } from '$/types'
import { defineController } from './$relay'

export default defineController(() => ({
  get: ({ params }) => {
    const projectId = params.projectId as ProjectId
    const desks = getDesks(projectId)
    return desks ? { status: 200, body: { projectId, desks } } : { status: 404 }
  },
}))
