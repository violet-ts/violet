import type { Handler } from 'aws-lambda'

export type APIExecEvent = {
  pnpmCommand: string[]
}
export type APIExecResult = void
export type APIExecHandler = Handler<APIExecEvent, APIExecResult>
