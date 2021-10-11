import { getProjects } from '$/service/browser'
import { defineController } from './$relay'

export default defineController({ getProjects }, () => ({
  get: async () => {
    const body = getProjects()
    return body ? { status: 200, body: await body } : { status: 404 }
  },
}))
