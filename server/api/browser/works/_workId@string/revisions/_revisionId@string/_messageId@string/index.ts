import type { ApiReply } from '$/types'

export type Methods = {
  post: {
    reqBody: Pick<ApiReply, 'content' | 'userName'>
    resBody: ApiReply
  }
}
