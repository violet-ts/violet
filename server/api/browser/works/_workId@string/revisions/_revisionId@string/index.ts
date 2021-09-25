import type { ApiMessage, RevisionId } from '$/types'

export type Methods = {
  get: {
    resBody: { revisionId: RevisionId; messages: ApiMessage[] }
  }
  post: {
    reqBody: {
      content: ApiMessage['content']
      userName: ApiMessage['userName']
    }
    resBody: ApiMessage
  }
}
