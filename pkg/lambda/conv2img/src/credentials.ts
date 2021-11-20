import { fromEnv } from '@aws-sdk/credential-providers'
import type { Credentials, Provider } from '@aws-sdk/types'
import type { VioletEnv } from '@violet/def/env/violet'

export const createCredentials = (env: VioletEnv): Credentials | Provider<Credentials> => {
  if (env.MINIO_ROOT_USER && env.MINIO_ROOT_PASSWORD) {
    return {
      accessKeyId: env.MINIO_ROOT_USER,
      secretAccessKey: env.MINIO_ROOT_PASSWORD,
    }
  }
  return fromEnv()
}
