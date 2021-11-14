import { fromContainerMetadata } from '@aws-sdk/credential-providers'
import type { Credentials, Provider } from '@aws-sdk/types'
import type { VioletEnv } from '@violet/def/envValues'

export const createCredentials = (env: VioletEnv): Credentials | Provider<Credentials> => {
  if (env.AWS_ACCESS_KEY_ID) {
    return {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    }
  }
  return fromContainerMetadata()
}
