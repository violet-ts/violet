import type { ApiRevision } from '@violet/lib/types/api'
import type { DeskId, WorkId } from '@violet/lib/types/branded'

export type Methods = {
  get: {
    resBody: { workId: WorkId; revisions: ApiRevision[] }
  }
  post: {
    reqFormat: FormData
    reqBody: { uploadFile: Blob; deskId: DeskId }
    resBody: ApiRevision
  }
}
