import { createRevision, getDeskId, getRevisions } from '@violet/api/src/service/browser'
import { sendNewWork } from '@violet/api/src/service/s3'
import type { WorkId } from '@violet/api/src/types'
import { createS3SaveWorksPath } from '@violet/api/src/utils/s3'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const revisions = await getRevisions(params.workId as WorkId)
    return revisions ? { status: 200, body: revisions } : { status: 404 }
  },
  post: async ({ params, body }) => {
    const revision = await createRevision(params.workId as WorkId)
    const deskId = await getDeskId(params.workId as WorkId)
    if (deskId === undefined) return { status: 404 }
    const ids = {
      projectId: body.projectId,
      deskId,
      revisionId: revision.id,
    }
    const props = {
      uploadFile: body.uploadFile,
      path: createS3SaveWorksPath(ids),
    }
    const data = await sendNewWork(props)
    return data.httpStatusCode === 200 ? { status: 201, body: revision } : { status: 404 }
  },
}))
