import type { RunningStatus } from '@violet/lib/s3/tester/types'

export type Methods = {
  get: {
    resBody: RunningStatus | null
  }
  post: {
    reqBody: {
      bucket: string
      concurrency: number
      objectKeys: string[]
    }
    resBody: null
  }
}
