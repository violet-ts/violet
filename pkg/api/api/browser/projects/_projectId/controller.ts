import { getDesks, updateProject } from '@violet/api/src/service/browser'
import { sendNewProjectIcon } from '@violet/api/src/service/s3'
import { createS3SaveProjectIconPath } from '@violet/api/src/utils/s3'
import type { ProjectId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const desks = await getDesks(params.projectId as ProjectId)
    return desks ? { status: 200, body: desks } : { status: 404 }
  },
  put: async ({ params, body }) => {
    const project = await updateProject(params.projectId as ProjectId, body.name)
    return project ? { status: 200, body: project } : { status: 404 }
  },
  post: async ({ params, body }) => {
    const icon = await sendNewProjectIcon({
      imageFile: body.imageFile,
      path: createS3SaveProjectIconPath({
        projectId: params.projectId as ProjectId,
        filename: body.imageFile.filename,
      }),
    })
    return icon.httpStatusCode === 200 ? { status: 201, body: icon } : { status: 400 }
  },
}))
