const AWS_ACCESS_KEY_ID = process.env.MINIO_ROOT_USER ?? ''
const AWS_SECRET_ACCESS_KEY = process.env.MINIO_ROOT_PASSWORD ?? ''
const S3_REGION = process.env.S3_REGION ?? ''
const S3_ENDPOINT = process.env.S3_ENDPOINT || undefined
const S3_BUCKET = process.env.S3_BUCKET ?? 'violet-app'

export { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_REGION, S3_ENDPOINT, S3_BUCKET }
