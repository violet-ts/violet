import { getProjects } from '$/service/browser'
import { defineController } from './$relay'

export default defineController({ getProjects }, () => ({
  get: async () => {
    const body = await getProjects()
    return body ? { status: 200, body } : { status: 404 }
  },
}))
