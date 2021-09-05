import type { ApiRevision, ProjectId, WorkId } from '$/types'

export type Methods = {
  get: {
    resBody: { projectId: ProjectId; workId: WorkId; revisions: ApiRevision[] }
  }
  post: {
    reqFormat: FormData
    reqBody: { file: Blob }
    resBody: ApiRevision
  }
}
