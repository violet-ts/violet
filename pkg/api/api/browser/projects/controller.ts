import { createProject, getProjects } from '@violet/api/src/service/browser'
import { defineController } from './$relay'

export default defineController({ getProjects, createProject }, () => ({
  get: async () => {
    const body = await getProjects()
    return body ? { status: 200, body } : { status: 404 }
  },
  post: async ({ body }) => {
    const project = await createProject(body.name)
    return project ? { status: 200, body: project } : { status: 404 }
  },
}))
