import type { ApiRevision } from '@violet/lib/types/api'
import type { DeskId, ProjectId, WorkId } from '@violet/lib/types/branded'

export type Methods = {
  get: {
    resBody: { workId: WorkId; revisions: ApiRevision[] }
  }
  post: {
    reqFormat: FormData
    reqBody: { uploadFile: Blob; projectId: ProjectId; deskId: DeskId }
    resBody: ApiRevision
  }
}
