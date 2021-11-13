import type {
  S3Event,
  S3EventRecord,
  SNSEvent,
  SNSEventRecord,
  SQSEvent,
  SQSRecord,
} from 'aws-lambda'

interface S3ObjectLocation {
  bucket: string
  key: string
}

export const findS3LocationsInEvent = (
  event: S3Event | SQSEvent | SNSEvent
): S3ObjectLocation[] => {
  return event.Records.flatMap(findS3LocationsInRecord)
}

export const findS3LocationsInRecord = (
  record: S3EventRecord | SQSRecord | SNSEventRecord
): S3ObjectLocation[] => {
  if ('s3' in record) {
    return [
      {
        bucket: record.s3.bucket.name,
        // https://docs.aws.amazon.com/lambda/latest/dg/with-s3-tutorial.html#with-s3-tutorial-create-function-code
        key: decodeURIComponent(record.s3.object.key.replace(/\+/g, ' ')),
      },
    ]
  } else if ('Sns' in record) {
    return findS3LocationsInRecord(JSON.parse(record.Sns.Message))
  } else if ('body' in record) {
    return findS3LocationsInRecord(JSON.parse(record.body))
  }
  return []
}
