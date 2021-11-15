import type { ApiReply } from '@violet/lib/types/api'

export type Methods = {
  post: {
    reqBody: Pick<ApiReply, 'content' | 'userName'>
    resBody: ApiReply
  }
}
