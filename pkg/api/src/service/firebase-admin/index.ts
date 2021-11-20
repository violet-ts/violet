import type { VioletEnv } from '@violet/def/env/violet'
import type { winston } from '@violet/lib/logger'
import admin from 'firebase-admin'
import { createFirebaseCredential } from './credentials'

interface GetAppParams {
  env: VioletEnv
  logger: winston.Logger
}
const getApp = ({ env, logger }: GetAppParams) => {
  const credential = createFirebaseCredential({ env, logger })
  const options: admin.AppOptions = {
    projectId: env.GCIP_PROJECT,
  }
  if (credential) options.credential = credential
  return admin.initializeApp(options)
}

// Firebase App instance should be global singleton.
let app: admin.app.App | undefined
export const getCachedApp = (params: GetAppParams) => {
  return (app = app ?? getApp(params))
}
