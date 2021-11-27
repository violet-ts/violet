import type { ApiMessage, ApiReply, Cursor } from '@violet/lib/types/api'
import type { MessageId } from '@violet/lib/types/branded'

export type Methods = {
  get: {
    query: Cursor<MessageId>
    resBody: (ApiMessage & { replies: ApiReply[] })[]
  }
  post: {
    reqBody: Pick<ApiMessage, 'content' | 'userName'>
    resBody: ApiMessage
  }
}
