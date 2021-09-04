import type { ApiDesk, ProjectId } from '$/types'

export type Methods = {
  get: {
    resBody: { projectId: ProjectId; desks: ApiDesk[] }
  }
}
