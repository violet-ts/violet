import type { Handler } from 'aws-lambda'

export type APIExecEvent = {
  command: string[]
}
export type APIExecResult = void
export type APIExecHandler = Handler<APIExecEvent, APIExecResult>
