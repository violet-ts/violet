import type { ApiDir } from '@violet/lib/types/api'

export type Methods = {
  get: {
    resBody: ApiDir[]
  }
  post: {
    reqBody: Pick<ApiDir, 'parentDirId'> & { names: string[] }
    resBody: ApiDir[]
  }
}
