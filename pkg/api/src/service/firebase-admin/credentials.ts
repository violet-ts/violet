import type {
  CredentialProvider as AwsCredentialProvider,
  Credentials as AwsCredentials,
} from '@aws-sdk/types'
import { getCredentials } from '@violet/api/src/service/aws-credential'
import type { VioletEnv } from '@violet/def/env/violet'
import type { winston } from '@violet/lib/logger'
import type { Credential, GoogleOAuthAccessToken } from 'firebase-admin/app'
import { applicationDefault, cert } from 'firebase-admin/app'
import * as fs from 'fs'
import type { AwsClientOptions, Credentials as GoogleAPICredentials } from 'google-auth-library'
import { AwsCredentialsClient } from './from-container-credentials'

// google-auth-library は内部で STS を呼び出しているが、そのレスポンスを露出させていないので逆変換する必要がある
const convertToFirebaseCredential = (gapiCred: GoogleAPICredentials): GoogleOAuthAccessToken => {
  const { access_token, expiry_date } = gapiCred
  if (typeof access_token !== 'string')
    throw new Error('Google auth credential without access_token is incompatible')
  if (typeof expiry_date !== 'number')
    throw new Error('Google auth credential without expiry_date is incompatible')
  return {
    access_token,
    // 下記の逆操作
    // https://github.com/googleapis/google-auth-library-nodejs/blob/5ed910513451c82e2551777a3e2212964799ef8e/src/auth/baseexternalclient.ts#L446-L446
    expires_in: Math.floor((expiry_date - new Date().getTime()) / 1000),
  }
}

export const createFirebaseCredentialFromAwsCredentials = (
  credentials: AwsCredentials | AwsCredentialProvider,
  options: AwsClientOptions
): Credential => {
  const client = new AwsCredentialsClient(credentials, options, {
    awsRefreshOptions: {
      eagerRefreshThresholdMillis: 60000, // 1 minute
    },
    refreshOptions: {
      eagerRefreshThresholdMillis: 60000, // 1 minute
    },
  })
  client.scopes = ['https://www.googleapis.com/auth/cloud-platform']
  return {
    getAccessToken: async () => {
      await client.getAccessToken()
      // リフレッシュについては google-auth-library で管理されており、 private 修飾子がついている
      // TODO: google-auth-library, firebase-admin-node に issue を立てて追っていく必要あり
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gapiCred: GoogleAPICredentials = (client as any).cachedAccessToken
      return convertToFirebaseCredential(gapiCred)
    },
  }
}

interface CreateFirebaseCredentialParams {
  env: VioletEnv
  logger: winston.Logger
}
export const createFirebaseCredential = ({
  env,
  logger,
}: CreateFirebaseCredentialParams): Credential | null => {
  const { FIREBASE_AUTH_EMULATOR_HOST, GOOGLE_APPLICATION_CREDENTIALS, GCIP_CONFIG_JSON } = env
  if (GCIP_CONFIG_JSON) {
    logger.info('GCIP_CONFIG_JSON found.')
    const credentials = getCredentials()
    return createFirebaseCredentialFromAwsCredentials(credentials, JSON.parse(GCIP_CONFIG_JSON))
  }
  if (FIREBASE_AUTH_EMULATOR_HOST) {
    // https://firebase.google.com/docs/emulator-suite/connect_auth#node.js-admin-sdk
    logger.warn('FIREBASE_AUTH_EMULATOR_HOST found and starting in emulator mode.')
    return null
  }
  if (GOOGLE_APPLICATION_CREDENTIALS) {
    logger.info('GOOGLE_APPLICATION_CREDENTIALS found.')
    return cert(JSON.parse(fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS).toString('utf-8')))
  }
  logger.info('No firebase credential information found.')
  return applicationDefault()
}
