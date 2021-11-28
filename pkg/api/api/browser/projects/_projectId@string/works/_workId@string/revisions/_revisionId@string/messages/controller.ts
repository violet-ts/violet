import { createMessage, getMessages } from '@violet/api/src/service/streamBar'
import type { RevisionId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params, query }) => {
    const messages = await getMessages(params.revisionId as RevisionId, query)

    return { status: 200, body: messages }
  },
  post: async ({ params, body }) => {
    const message = await createMessage(
      params.revisionId as RevisionId,
      body.content,
      body.userName
    )

    return { status: 201, body: message }
  },
}))
