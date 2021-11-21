import { createRevision, getRevisions } from '@violet/api/src/service/browser'
import { sendNewWork } from '@violet/api/src/service/s3'
import { createS3SaveRevisionPath } from '@violet/api/src/utils/s3'
import type { WorkId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const revisions = await getRevisions(params.workId as WorkId)

    return { status: 200, body: revisions }
  },
  post: async ({ params, body }) => {
    const revision = await createRevision(body.projectId, body.deskId, params.workId as WorkId)

    const data = await sendNewWork({
      uploadFile: body.uploadFile,
      path: createS3SaveRevisionPath({
        projectId: body.projectId,
        deskId: body.deskId,
        revisionId: revision.id,
        filename: body.uploadFile.filename,
      }),
    })

    return data.httpStatusCode === 200 ? { status: 201, body: revision } : { status: 400 }
  },
}))
