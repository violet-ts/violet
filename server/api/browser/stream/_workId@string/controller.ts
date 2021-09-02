import { getWorkById } from '$/service/works'
import type { WorkId } from '$/types'
import { defineController } from './$relay'

const validateParams = (params: { workId: string }) => params as { workId: WorkId }

export default defineController(() => ({
  get: ({ params }) => ({ status: 200, body: getWorkById(validateParams(params).workId) }),
}))
