import type { ApiProject } from '@violet/lib/types/api'

export type Methods = {
  get: {
    resBody: ApiProject
  }
  put: {
    reqFormat: FormData
    reqBody: { name: string; iconExt?: string | null; imageFile?: Blob }
    resBody: ApiProject
  }
}
