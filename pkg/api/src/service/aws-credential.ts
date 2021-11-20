import { fromContainerMetadata } from '@aws-sdk/credential-providers'
import type { Credentials, Provider } from '@aws-sdk/types'
import envValues from '../utils/envValues'
const { MINIO_ROOT_USER, MINIO_ROOT_PASSWORD } = envValues

export const getCredentials = (): Credentials | Provider<Credentials> => {
  if (MINIO_ROOT_USER && MINIO_ROOT_PASSWORD) {
    return {
      accessKeyId: MINIO_ROOT_USER,
      secretAccessKey: MINIO_ROOT_PASSWORD,
    }
  }
  return fromContainerMetadata()
}
