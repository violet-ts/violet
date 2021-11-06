import type { ApiWork } from '@violet/api/types'

export type Methods = {
  post: {
    reqBody: Pick<ApiWork, 'path' | 'name' | 'ext'>
    resBody: ApiWork
  }
}
