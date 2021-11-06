import type { ApiReply } from '@violet/api/types'

export type Methods = {
  post: {
    reqBody: Pick<ApiReply, 'content' | 'userName'>
    resBody: ApiReply
  }
}
