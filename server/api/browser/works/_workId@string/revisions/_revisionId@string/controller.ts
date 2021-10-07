import { createMessage, getMessages } from '$/service/streamBar'
import type { RevisionId } from '$/types'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const messages = await getMessages(params.revisionId as RevisionId)
    return messages ? { status: 200, body: messages } : { status: 404 }
  },
  post: async ({ params, body }) => {
    const messages = await createMessage(
      params.revisionId as RevisionId,
      body.content,
      body.userName
    )
    return messages ? { status: 200, body: messages } : { status: 404 }
  },
}))
