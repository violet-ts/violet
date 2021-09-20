import type { ApiMessage, RevisionId } from '$/types'

export type Methods = {
  get: {
    resBody: { revisionId: RevisionId; messages: ApiMessage[] }
  }
}
