import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { fileTypes } from '@violet/def/constants'
import type { RevisionPath } from '@violet/lib/types/branded'
import type { MultipartFile } from 'fastify-multipart'
import { depend } from 'velona'
import envValues from '../utils/envValues'
import { getCredentials } from './aws-credential'
const { S3_BUCKET_ORIGINAL, S3_ENDPOINT, S3_REGION } = envValues

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

export const getRevisionsSignedUrl = depend({ getS3Client }, ({ getS3Client }) =>
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
      path: RevisionPath
    }
  ) => {
    const uploadParams = {
      Bucket: S3_BUCKET_ORIGINAL,
      Key: props.path,
      ContentType: fileTypes.find((f) => props.uploadFile.filename.endsWith(f.ex))?.type,
      Body: await props.uploadFile.toBuffer(),
      ACL: 'public-read',
    }

    const data = await getS3Client()
      .send(new PutObjectCommand(uploadParams))
      .then((res) => res.$metadata)

    return data
  }
)

export const getDisplayWork = depend(
  { getS3Client },
  async ({ getS3Client }, path: RevisionPath) => {
    const params = {
      Bucket: S3_BUCKET_ORIGINAL,
      Key: path,
    }

    const data = await getS3Client()
      .send(new GetObjectCommand(params))
      .then((res) => res.Body)

    return data
  }
)
