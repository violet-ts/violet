import { createReply, getReplies } from '$/service/streamBar'
import type { MessageId } from '$/types'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const replies = await getReplies(params.messageId as MessageId)
    return replies ? { status: 200, body: replies } : { status: 404 }
  },
  post: async ({ params, body }) => {
    const reply = await createReply(params.messageId as MessageId, body.content, body.userName)
    return reply ? { status: 200, body: reply } : { status: 404 }
  },
}))
