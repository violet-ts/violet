import { createProject, getProjects } from '@violet/api/src/service/browser/projects'
import { defineController } from './$relay'

export default defineController({ getProjects, createProject }, () => ({
  get: async () => {
    const body = await getProjects()

    return { status: 200, body }
  },
  post: async ({ body }) => {
    const project = await createProject(body.name)

    return { status: 200, body: project }
  },
}))
