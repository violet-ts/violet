import { getTree } from '$/service/tree'
import type { ProjectId } from '$/types'
import { defineController } from './$relay'

const validateParams = (params: { projectId: string }) => params as { projectId: ProjectId }

export default defineController(() => ({
  get: ({ params }) => {
    const body = getTree(validateParams(params))

    return body ? { status: 200, body } : { status: 404 }
  },
}))
