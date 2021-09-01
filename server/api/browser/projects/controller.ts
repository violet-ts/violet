import { getProjects } from '$/service/tree'
import { defineController } from './$relay'

export default defineController(() => ({
  get: () => {
    const body = getProjects()

    return body ? { status: 200, body } : { status: 404 }
  },
}))
