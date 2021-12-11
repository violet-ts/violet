import { getProject, updateProject } from '@violet/api/src/service/browser'
import { sendNewProjectIcon } from '@violet/api/src/service/s3'
import { createS3SaveProjectIconPath } from '@violet/api/src/utils/s3'
import type { ProjectId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const project = await getProject(params.projectId as ProjectId)
    return project ? { status: 200, body: project } : { status: 404 }
  },
  put: async ({ params, body }) => {
    const project = await updateProject(params.projectId as ProjectId, body.name, body.iconName)
    if (body.imageFile) {
      await sendNewProjectIcon({
        imageFile: body.imageFile,
        path: await createS3SaveProjectIconPath({
          projectId: params.projectId as ProjectId,
          iconName: body.iconName,
        }),
      })
    }
    return { status: 200, body: project }
  },
}))
