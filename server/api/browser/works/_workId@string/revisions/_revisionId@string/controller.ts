import { getMessages } from '$/service/browser'
import { RevisionId } from '$/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  get: ({ params }) => {
    const messages = getMessages(params.revisionId as RevisionId)
    return messages ? { status: 200, body: messages } : { status: 404 }
  },
}))
