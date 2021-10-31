require('dotenv').config({ path: 'server/.env' })

const {
  NODE_ENV,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSEGING_SENDER_ID,
  FIREBASE_APP_ID,
} = process.env

module.exports = {
  env: {
    IS_PRODUCTION: NODE_ENV === 'production',
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSEGING_SENDER_ID,
    FIREBASE_APP_ID,
  },
  pageExtensions: ['page.tsx'],
}
