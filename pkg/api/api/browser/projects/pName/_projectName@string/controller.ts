import { getNewProject } from '@violet/api/src/service/browser/projects'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const newProject = await getNewProject(params.projectName)
    return newProject ? { status: 200, body: newProject } : { status: 404 }
  },
}))
