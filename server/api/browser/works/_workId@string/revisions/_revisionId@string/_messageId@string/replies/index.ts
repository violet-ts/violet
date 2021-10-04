import type { ApiReply, MessageId } from '$/types'

export type Methods = {
  get: {
    resBody: { messageId: MessageId; replies: ApiReply[] }
  }
  post: {
    reqBody: Pick<ApiReply, 'content' | 'userName'>
    resBody: ApiReply
  }
}
