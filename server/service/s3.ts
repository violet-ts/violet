import { GetObjectCommand, ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
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
