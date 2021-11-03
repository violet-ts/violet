import type { ApiWork } from '@violet/api/src/types'

export type Methods = {
  post: {
    reqBody: Pick<ApiWork, 'path' | 'name' | 'ext'>
    resBody: ApiWork
  }
}
