import {fromContainerMetadata, fromEnv} from '@aws-sdk/credential-providers';

import {
  AWS_ACCESS_KEY_ID,
} from '../utils/envValues'

export const getCredentials = () => {
  if (AWS_ACCESS_KEY_ID) {
    return fromEnv();
  }
  return fromContainerMetadata()
}
