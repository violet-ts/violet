import type { ApiWork } from '@violet/lib/types/api'

export type Methods = {
  post: {
    reqBody: Pick<ApiWork, 'path' | 'name' | 'ext'>
    resBody: ApiWork
  }
}
