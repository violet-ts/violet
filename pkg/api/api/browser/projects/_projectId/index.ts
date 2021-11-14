import type { ApiDesk, ApiProject, ProjectId } from '@violet/api/types'

export type Methods = {
  get: {
    resBody: { projectId: ProjectId; desks: ApiDesk[] }
  }
  put: {
    reqBody: Pick<ApiProject, 'name'>
    resBody: ApiProject
  }
}
