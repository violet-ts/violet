import type { APIExecHandler } from '@violet/def/lambda-handlers/apiexec-handler'
import { execThrow } from '@violet/lib/exec'

const handler: APIExecHandler = async (event) => {
  const [file, ...args] = event.pnpmCommand
  await execThrow(file, args, false)
}

export { handler }
