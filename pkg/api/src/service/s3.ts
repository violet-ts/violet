import {
  CreateBucketCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { S3SaveWorksPath } from '@violet/api/src/types'
import type { MultipartFile } from 'fastify-multipart'
import { depend } from 'velona'
import { fileTypes } from '../utils/constants'
import envValues from '../utils/envValues'
import { getCredentials } from './aws-credential'
const { S3_BUCKET, S3_ENDPOINT, S3_REGION } = envValues

let s3Client: S3Client

const getS3Client = () => {
  s3Client =
    s3Client ??
    new S3Client({
      region: S3_REGION,
      credentials: getCredentials(),
      endpoint: S3_ENDPOINT,
      forcePathStyle: true,
    })

  return s3Client
}

const listBucket = depend({ getS3Client }, ({ getS3Client }) =>
  getS3Client()
    .send(new ListBucketsCommand({}))
    .then((res) => res.Buckets)
)

const createBucket = depend({ getS3Client }, ({ getS3Client }) =>
  getS3Client()
    .send(new CreateBucketCommand({ Bucket: S3_BUCKET }))
    .then((res) => res.$metadata)
)

export const createBucketIfNotExists = async () => {
  if (!S3_ENDPOINT) return
  const isBucket = await listBucket()
  if (!isBucket?.some((b) => b.Name === S3_BUCKET)) {
    await createBucket()
  }
}

export const getRevisionsSidnedUrl = depend({ getS3Client }, ({ getS3Client }) =>
  getSignedUrl(getS3Client(), new GetObjectCommand({ Bucket: 'static', Key: 'sample.txt' }), {
    expiresIn: 3600,
  })
)

// TODO: presigned URL 検討
export const sendNewWork = depend(
  { getS3Client },
  async (
    { getS3Client },
    props: {
      uploadFile: MultipartFile
      path: S3SaveWorksPath
    }
  ) => {
    const uploadParams = {
      Bucket: S3_BUCKET,
      Key: props.path,
      ContentType: fileTypes.find((f) => props.uploadFile.filename.endsWith(f.ex))?.type,
      Body: await props.uploadFile.toBuffer(),
    }

    const data = await getS3Client()
      .send(new PutObjectCommand(uploadParams))
      .then((res) => res.$metadata)

    return data
  }
)
