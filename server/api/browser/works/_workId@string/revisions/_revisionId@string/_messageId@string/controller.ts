import { createReply } from '$/service/stream'
import type { MessageId } from '$/types'
import { defineController } from './$relay'

export default defineController(() => ({
  post: async ({ params, body }) => {
    const reply = await createReply(params.messageId as MessageId, body.content, body.userName)
    return reply ? { status: 200, body: reply } : { status: 404 }
  },
}))
