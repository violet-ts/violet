import type { ApiRevision, ProjectId, WorkId } from '$/types'

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
