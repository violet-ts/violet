import type { ApiMessage } from '@violet/lib/types/api'
import type { RevisionId } from '@violet/lib/types/branded'

export type Methods = {
  get: {
    resBody: { revisionId: RevisionId; messages: ApiMessage[] }
  }
}
