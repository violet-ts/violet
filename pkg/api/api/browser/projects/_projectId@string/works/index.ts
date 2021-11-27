import type { ApiWork } from '@violet/lib/types/api'
import type { DirId } from '@violet/lib/types/branded'

export type Methods = {
  post: {
    reqBody: { parentDirId: DirId; name: string }
    resBody: ApiWork[]
  }
}
