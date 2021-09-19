import type { ApiMessage } from '$/types'

export type Methods = {
  get: {
    resBody: { messages: ApiMessage[] }
  }
}
