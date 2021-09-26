import { createRevision, getRevisions } from '$/service/browser'
import type { WorkId } from '$/types'
import { defineController } from './$relay'

export default defineController(() => ({
  get: ({ params }) => {
    const revisions = getRevisions(params.workId as WorkId)
    return revisions ? { status: 200, body: revisions } : { status: 404 }
  },
  post: ({ params }) => {
    const revision = createRevision(params.workId as WorkId)
    return revision ? { status: 201, body: revision } : { status: 404 }
  },
}))
