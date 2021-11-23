import type { ApiDesk, ApiProject } from '@violet/lib/types/api'
import type { ProjectId } from '@violet/lib/types/branded'

export type Methods = {
  get: {
    resBody: { projectId: ProjectId; desks: ApiDesk[] }
  }
  put: {
    reqFormat: FormData
    reqBody: { projectName: string; iconExt?: string | null; imageFile?: Blob }
    resBody: ApiProject
  }
}
