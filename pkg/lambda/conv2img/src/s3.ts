import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromInstanceMetadata } from "@aws-sdk/credential-providers";
import type { Credentials, Provider } from "@aws-sdk/types";
import { IncomingMessage } from "http";
import { extractEnv } from "@violet/def/envValues";
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_REGION,
} = extractEnv(process.env);

const getCredentials = (): Credentials | Provider<Credentials> => {
  if (AWS_ACCESS_KEY_ID) {
    return {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    };
  }
  return fromInstanceMetadata();
};

let s3Client: S3Client;

const getS3Client = () => {
  s3Client = s3Client ??
    new S3Client({
      region: S3_REGION,
      credentials: getCredentials(),
      endpoint: S3_ENDPOINT,
      forcePathStyle: true,
    });

  return s3Client;
};

export const getObject = (key: string) =>
  getS3Client()
    .send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }))
    .then(({ Body }) => {
      if (Body instanceof IncomingMessage) return Body;

      throw new Error("Body of getObject is not IncomingMessage");
    });

export const putObject = async (
  key: string,
  contentType: string,
  body: Buffer | string,
) =>
  getS3Client()
    .send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ContentType: contentType,
        Body: body,
      }),
    )
    .then((res) => res.$metadata);
