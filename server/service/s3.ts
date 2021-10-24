import type { S3SaveWorksPath } from '$/types'
import {
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { MultipartFile } from 'fastify-multipart'
import { depend } from 'velona'
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_ENDPOINT,
  S3_REGION,
} from '../utils/envValues'

let s3Client: S3Client

const getS3Client = () => {
  s3Client =
    s3Client ??
    new S3Client({
      region: S3_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      endpoint: S3_ENDPOINT,
      forcePathStyle: true,
    })

  return s3Client
}

export const listBucket = depend({ getS3Client }, ({ getS3Client }) =>
  getS3Client()
    .send(new ListBucketsCommand({}))
    .then((res) => res.Buckets)
)

export const getRevisionsSidnedUrl = depend({ getS3Client }, ({ getS3Client }) =>
  getSignedUrl(getS3Client(), new GetObjectCommand({ Bucket: 'static', Key: 'sample.txt' }), {
    expiresIn: 3600,
  })
)

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
      Bucket: 'Violet',
      Key: props.path,
      Body: await props.uploadFile.toBuffer(),
    }

    const data = getS3Client()
      .send(new PutObjectCommand(uploadParams))
      .then((res) => res.$metadata)

    return data
  }
)
