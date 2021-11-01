import * as path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
})

const API_PORT = +(process.env.API_PORT ?? '8080')
const API_BASE_PATH = process.env.API_BASE_PATH ?? ''
const API_ORIGIN = process.env.API_ORIGIN ?? ''
const AWS_ACCESS_KEY_ID = process.env.MINIO_ROOT_USER ?? ''
const AWS_SECRET_ACCESS_KEY = process.env.MINIO_ROOT_PASSWORD ?? ''
const S3_REGION = process.env.S3_REGION ?? ''
const S3_ENDPOINT = process.env.S3_ENDPOINT || undefined
const S3_BUCKET = process.env.S3_BUCKET ?? 'violet-app'

export {
  API_PORT,
  API_BASE_PATH,
  API_ORIGIN,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_REGION,
  S3_ENDPOINT,
  S3_BUCKET,
}
