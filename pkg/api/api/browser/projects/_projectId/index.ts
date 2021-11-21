import type { ApiDesk, ApiProject } from '@violet/lib/types/api'
import type { ProjectId } from '@violet/lib/types/branded'

export type Methods = {
  get: {
    resBody: { projectId: ProjectId; desks: ApiDesk[] }
  }
  put: {
    reqBody: { project: Pick<ApiProject, 'name'>; iconExt?: string | null }
    resBody: ApiProject
  }
  post: {
    reqFormat: FormData
    reqBody: { project: Pick<ApiProject, 'name'>; iconExt?: string | null; imageFile: Blob }
    resBody: ApiProject
  }
}
