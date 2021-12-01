import type { VioletEnv } from '@violet/def/env/violet'
import type { winston } from '@violet/lib/logger'

export type ResultStatusType = 'running' | 'waiting' | 'succeeded' | 'failed'
export interface ResultStatus {
  readonly type: ResultStatusType
  readonly errorMessage?: string
  readonly startTime?: number
  readonly endTime?: number
}

export interface RunningStatusInternal {
  bucket: string
  id: string
  minioOriginalDir: string
  minioConvertedDir: string
  tmpdir: string
  results: Record<string, ResultStatus>
}

export interface RunningStatus extends RunningStatusInternal {
  running: boolean
}

interface StartParams {
  bucket: string
  keys: string[]
  concurrency: number
  env: VioletEnv
  logger: winston.Logger
}

interface S3PutObjectTestContext {
  getStatus: () => RunningStatus | null
  isRunning: () => boolean
  start: (params: StartParams) => Promise<void>
}
