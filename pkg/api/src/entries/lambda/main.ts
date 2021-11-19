import type { APIExecHandler } from '@violet/def/lambda-handlers/apiexec-handler'
import { execThrow } from '@violet/lib/exec'

export const handler: APIExecHandler = async (event) => {
  const [file, ...args] = event.command
  await execThrow(file, args, false)
}
