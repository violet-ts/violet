import type { ApiDesk, ProjectId } from '@violet/api/types'

export type Methods = {
  get: {
    resBody: { projectId: ProjectId; desks: ApiDesk[] }
  }
}
