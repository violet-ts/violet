import type { VioletEnv } from '@violet/def/env/violet'
import type { TestCaseJson } from '@violet/lib/s3/tester/types'

interface CheckParams {
  env: VioletEnv
  caseJson: TestCaseJson
  destKey: string
}

export const constructInput = ({ env, destKey, caseJson }: CheckParams): unknown => {
  const { eventType } = caseJson
  const bucket = env.S3_BUCKET_ORIGINAL
  const key = encodeURIComponent(destKey).replace(/ /g, '+')
  if (eventType === undefined) {
    return {
      Records: [
        {
          s3: {
            bucket: {
              name: bucket,
            },
            object: {
              key,
            },
          },
        },
      ],
    }
  }
  switch (eventType) {
    case 'behind-sqs':
      return {
        Records: [
          {
            attributes: {
              ApproximateFirstReceiveTimestamp: '1638119360914',
              ApproximateReceiveCount: '1',
              SenderId: 'FFFFFFFFFFFFFFFFFFFFF',
              SentTimestamp: '1638119360899',
            },
            awsRegion: 'ap-northeast-1',
            body: JSON.stringify({
              Records: [
                {
                  eventVersion: '2.1',
                  eventSource: 'aws:s3',
                  awsRegion: 'ap-northeast-1',
                  eventTime: '2021-11-28T17:09:19.743Z',
                  eventName: 'ObjectCreated:Put',
                  userIdentity: {
                    principalId: 'AWS:FKAEFAKEFAKEFAKEFAKE:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                  },
                  requestParameters: { sourceIPAddress: '10.0.102.127' },
                  responseElements: {
                    'x-amz-request-id': 'AAAAAAAAAAAAAAAA',
                    'x-amz-id-2': 'W+mIuTVe5h8epVKbX2OLb2zaO+g3Q2pC2dGPHc4/i8E=',
                  },
                  s3: {
                    s3SchemaVersion: '1.0',
                    configurationId: 'fake-configuration-id',
                    bucket: {
                      name: bucket,
                      ownerIdentity: { principalId: 'BBBBBBBBBBBBBB' },
                      arn: `arn:aws:s3:::${bucket}`,
                    },
                    object: {
                      key,
                      size: 11111,
                      eTag: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                      sequencer: 'CCCCCCCCCCCCCCCCCC',
                    },
                  },
                },
              ],
            }),
            eventSource: 'aws:sqs',
            eventSourceARN: `arn:aws:sqs:ap-northeast-1:111111111111:${bucket}`,
            md5OfBody: '11111111111111111111111111111111',
            messageAttributes: {},
            messageId: '7c930a90-2f76-4e53-b027-f793123155d8',
            receiptHandle:
              'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          },
        ],
      }
    default:
      throw new Error(
        `invalid test configuration eventType: ${typeof eventType}: ${String(eventType)}`
      )
  }
}
