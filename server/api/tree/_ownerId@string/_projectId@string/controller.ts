import { getTreeWithWork } from '$/service/tree'
import { OwnerId, ProjectId } from '$/types'
import { defineController } from './$relay'

const validateParams = (params: { ownerId: string; projectId: string }) =>
  params as { ownerId: OwnerId; projectId: ProjectId }

export default defineController(() => ({
  get: ({ params }) => {
    const body = getTreeWithWork(validateParams(params))

    return body ? { status: 200, body } : { status: 404 }
  },
}))
