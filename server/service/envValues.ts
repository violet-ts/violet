import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET ?? ''
const USER_ID = process.env.USER_ID ?? ''
const USER_PASS = process.env.USER_PASS ?? ''
const SERVER_PORT = +(process.env.SERVER_PORT ?? '8080')
const BASE_PATH = process.env.BASE_PATH ?? ''
const API_ORIGIN = process.env.API_ORIGIN ?? ''
const AWS_ACCESS_KEY_ID = process.env.MINIO_ROOT_USER ?? ''
const AWS_SECRET_ACCESS_KEY = process.env.MINIO_ROOT_PASSWORD ?? ''
const S3_REGION = process.env.S3_REGION ?? ''
const S3_ENDPOINT = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:9000'

export {
  JWT_SECRET,
  USER_ID,
  USER_PASS,
  SERVER_PORT,
  BASE_PATH,
  API_ORIGIN,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_REGION,
  S3_ENDPOINT,
}
