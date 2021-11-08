import type { ApiProject } from '@violet/api/types'

export type Methods = {
  get: {
    resBody: ApiProject[]
  }
  post: {
    reqBody: Pick<ApiProject, 'name'>
    resBody: ApiProject
  }
}
