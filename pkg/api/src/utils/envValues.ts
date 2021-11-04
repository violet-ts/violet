import { extractEnv } from '@violet/def/envValues'
import dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
})

export default extractEnv(process.env)
