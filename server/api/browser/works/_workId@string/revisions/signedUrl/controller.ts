import { getRevisionsSidnedUrl } from '$/service/s3'
import { defineController } from './$relay'

export default defineController(() => ({
  post: async () => ({ status: 201, body: await getRevisionsSidnedUrl() }),
}))
