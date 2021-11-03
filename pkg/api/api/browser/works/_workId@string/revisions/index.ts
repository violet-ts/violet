import type { ApiRevision, ProjectId, WorkId } from '@violet/api/src/types'

export type Methods = {
  get: {
    resBody: { workId: WorkId; revisions: ApiRevision[] }
  }
  post: {
    reqFormat: FormData
    reqBody: { uploadFile: Blob; projectId: ProjectId }
    resBody: ApiRevision
  }
}
