import { createReply, getReplies } from '@violet/api/src/service/streamBar'
import type { MessageId } from '@violet/lib/types/branded'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params, query }) => {
    const messages = await getReplies(params.messageId as MessageId, query)

    return { status: 200, body: messages }
  },
  post: async ({ params, body }) => {
    const reply = await createReply(params.messageId as MessageId, body.content, body.userName)

    return { status: 201, body: reply }
  },
}))
