import { createRevision, getDeskId, getRevisions } from '$/service/browser'
import { sendNewWork } from '$/service/s3'
import type { DeskId, WorkId } from '$/types'
import { createS3SaveWorksPath } from '$/utils/s3'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const revisions = await getRevisions(params.workId as WorkId)
    return revisions ? { status: 200, body: revisions } : { status: 404 }
  },
  post: async ({ params, body }) => {
    const revision = await createRevision(params.workId as WorkId)
    const deskId = await getDeskId(params.workId as WorkId)
    const ids = {
      projectId: body.projectId,
      deskId: deskId !== undefined ? deskId : ('404' as DeskId),
      revisionId: revision.id,
    }
    const props = {
      uploadFile: body.uploadFile,
      path: createS3SaveWorksPath(ids),
    }
    const data = await sendNewWork(props)
    return revision && data.httpStatusCode === 200
      ? { status: 201, body: revision }
      : { status: 404 }
  },
}))
