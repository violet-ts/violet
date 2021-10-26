import { fromContainerMetadata } from '@aws-sdk/credential-providers'
import type { Credentials, Provider } from "@aws-sdk/types";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../utils/envValues'

export const getCredentials = (): Credentials | Provider<Credentials> => {
  if (AWS_ACCESS_KEY_ID) {
    return {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
  }
  return fromContainerMetadata()
}
