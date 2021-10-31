import type { ApiDesk, ProjectId } from '@violet/api/src/types'

export type Methods = {
  get: {
    resBody: { projectId: ProjectId; desks: ApiDesk[] }
  }
}
