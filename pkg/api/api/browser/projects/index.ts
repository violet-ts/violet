import type { ApiProject } from '@violet/lib/types/api'

export type Methods = {
  get: {
    resBody: ApiProject[]
  }
  post: {
    reqBody: Pick<ApiProject, 'name'>
    resBody: ApiProject
  }
}
