import { getMessages } from '@violet/api/src/service/streamBar'
import type { RevisionId } from '@violet/api/types'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({ params }) => {
    const messages = await getMessages(params.revisionId as RevisionId)
    return messages ? { status: 200, body: messages } : { status: 404 }
  },
}))
