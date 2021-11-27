import type { ApiDir } from '@violet/lib/types/api'

export type Methods = {
  patch: {
    reqBody: Partial<Pick<ApiDir, 'name' | 'parentDirId'>>
    resBody: ApiDir
  }
}
