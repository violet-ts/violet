import type { ApiReply, Cursor } from '@violet/lib/types/api'
import type { ReplyId } from '@violet/lib/types/branded'

export type Methods = {
  get: {
    query: Cursor<ReplyId>
    resBody: ApiReply[]
  }
  post: {
    reqBody: Pick<ApiReply, 'content' | 'userName'>
    resBody: ApiReply
  }
}
