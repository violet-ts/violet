import type { ApiRevision, WorkId } from '$/types'

export type Methods = {
  get: {
    resBody: { workId: WorkId; revisions: ApiRevision[] }
  }
  post: {
    reqFormat: FormData
    reqBody: { file: Blob }
    resBody: ApiRevision
  }
}
