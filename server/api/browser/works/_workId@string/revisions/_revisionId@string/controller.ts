import { createMessage, getMessages } from '$/service/browser'
import { ApiMessage, RevisionId } from '$/types'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const messages = await getMessages(params.revisionId as RevisionId)
    return messages ? { status: 200, body: messages } : { status: 404 }
  },
  post: async ({ params, body }) => {
    const messages = await createMessage(
      params.revisionId as RevisionId,
      body.content as ApiMessage['content'],
      body.userName as ApiMessage['userName']
    )
    return messages ? { status: 200, body: messages } : { status: 404 }
  },
}))
