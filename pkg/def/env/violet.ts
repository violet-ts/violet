/**
 * バックエンド (API, Lambda) などで使用する環境変数
 */
export interface VioletEnv {
  readonly API_BASE_PATH: string
  readonly API_ORIGIN: string
  readonly API_PORT: number
  readonly S3_REGION: string | undefined
  readonly S3_BUCKET_ORIGINAL: string
  readonly S3_BUCKET_CONVERTED: string

  // deployed
  readonly GCIP_CONFIG_JSON: string | undefined
  readonly GCIP_PROJECT: string | undefined
  readonly CLOUDWATCH_CRITICAL_LOG_GROUP: string | undefined

  // local
  readonly MINIO_ROOT_USER: string | undefined
  readonly MINIO_ROOT_PASSWORD: string | undefined
  readonly S3_ENDPOINT: string | undefined
  readonly LOGGING_LEVEL: string | undefined
  readonly PRETTY_LOGGING: string | undefined
  readonly FIREBASE_AUTH_EMULATOR_HOST: string | undefined
  readonly GOOGLE_APPLICATION_CREDENTIALS: string | undefined
}

// eslint-disable-next-line complexity -- 列挙
export const parseVioletEnv = (obj: Record<string, string | undefined>): VioletEnv => {
  const {
    MINIO_ROOT_USER,
    MINIO_ROOT_PASSWORD,
    S3_ENDPOINT,
    S3_BUCKET_ORIGINAL,
    S3_BUCKET_CONVERTED,
    S3_REGION,
    GCIP_CONFIG_JSON,
    GCIP_PROJECT,
    CLOUDWATCH_CRITICAL_LOG_GROUP,
    LOGGING_LEVEL,
    PRETTY_LOGGING,
    FIREBASE_AUTH_EMULATOR_HOST,
    GOOGLE_APPLICATION_CREDENTIALS,
  } = obj
  const API_PORT = +(obj.API_PORT ?? '8080')
  const API_BASE_PATH = obj.API_BASE_PATH ?? ''
  const API_ORIGIN = obj.API_ORIGIN ?? ''

  if (!S3_BUCKET_ORIGINAL) throw new Error('S3_BUCKET_ORIGINAL not set')
  if (!S3_BUCKET_CONVERTED) throw new Error('S3_BUCKET_CONVERTED not set')

  return {
    API_BASE_PATH,
    API_ORIGIN,
    API_PORT,
    MINIO_ROOT_USER,
    MINIO_ROOT_PASSWORD,
    S3_ENDPOINT,
    S3_REGION,
    S3_BUCKET_ORIGINAL,
    S3_BUCKET_CONVERTED,
    GCIP_CONFIG_JSON,
    GCIP_PROJECT,
    CLOUDWATCH_CRITICAL_LOG_GROUP,
    LOGGING_LEVEL,
    PRETTY_LOGGING,
    FIREBASE_AUTH_EMULATOR_HOST,
    GOOGLE_APPLICATION_CREDENTIALS,
  }
}
