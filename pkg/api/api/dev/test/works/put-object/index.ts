import type { RunningStatus } from '@violet/lib/s3/tester'

export type Methods = {
  get: {
    resBody: RunningStatus | null
  }
  post: {
    reqBody: {
      bucket: string
      objectKeys: string[]
    }
    resBody: null
  }
}
