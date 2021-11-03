import type { ApiMessage, RevisionId } from '@violet/api/src/types'

export type Methods = {
  get: {
    resBody: { revisionId: RevisionId; messages: ApiMessage[] }
  }
  post: {
    reqBody: Pick<ApiMessage, 'content' | 'userName'>
    resBody: ApiMessage
  }
}
