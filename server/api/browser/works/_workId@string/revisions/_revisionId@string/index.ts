import type { ApiMessage } from '$/types'

export type Methods = {
  get: {
    resBody: ApiMessage[]
  }
  post: {
    reqBody: {
      content: ApiMessage['content']
      userName: ApiMessage['userName']
    }
    resBody: ApiMessage
  }
}
