import { getProject, updateProject } from '@violet/api/src/service/browser/projects'
import type { ProjectId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const project = await getProject(params.projectId as ProjectId)
    return project ? { status: 200, body: project } : { status: 404 }
  },
  put: async ({ params, body }) => {
    const project = await updateProject(
      params.projectId as ProjectId,
      body.newProjectName,
      body.oldProjectName,
      body.iconName,
      body.imageFile
    )
    return { status: 200, body: project }
  },
}))
