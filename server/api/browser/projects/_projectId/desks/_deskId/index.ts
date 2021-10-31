import type { ApiWork } from '$/types'

export type Methods = {
  post: {
    reqBody: Pick<ApiWork, 'path' | 'name' | 'ext'>
    resBody: ApiWork
  }
}
