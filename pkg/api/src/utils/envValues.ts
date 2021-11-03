import * as path from 'path'
import dotenv from 'dotenv'
import { extractEnv } from '@violet/def/envValues'

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
})

export default extractEnv(process.env)
