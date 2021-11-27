import type { ApiMessage, ApiReply, ApiRevision, Cursor } from '@violet/lib/types/api'
import type { RevisionId } from '@violet/lib/types/branded'

export type Methods = {
  get: {
    query: Cursor<RevisionId>
    resBody: (ApiRevision & { messages: (ApiMessage & { replies: ApiReply[] })[] })[]
  }
  post: {
    reqFormat: FormData
    reqBody: { uploadFile: Blob }
    resBody: ApiRevision
  }
}
