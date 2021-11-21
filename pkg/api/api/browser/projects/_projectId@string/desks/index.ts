import type { ApiDesk } from '@violet/lib/types/api'
import type { ProjectId } from '@violet/lib/types/branded'

export type Methods = {
  get: {
    resBody: { projectId: ProjectId; desks: ApiDesk[] }
  }
}
