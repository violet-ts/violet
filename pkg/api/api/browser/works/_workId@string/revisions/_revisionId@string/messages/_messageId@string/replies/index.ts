import type { ApiReply } from '@violet/api/src/types'

export type Methods = {
  post: {
    reqBody: Pick<ApiReply, 'content' | 'userName'>
    resBody: ApiReply
  }
}
