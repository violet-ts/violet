import { getCachedApp } from '@violet/api/src/service/firebase-admin'
import { defineController } from './$relay'

// https://firebase.google.com/docs/auth/admin/manage-cookies
export default defineController(() => ({
  post: async ({ body: { idToken }, env, logger, setCookie }) => {
    // TODO(security): kick too old tokens
    const auth = getCachedApp({ env, logger }).auth()
    // 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })
    setCookie('session', sessionCookie, {
      signed: true,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
    return {
      status: 200,
      body: {},
    }
  },
  delete: async ({ setCookie }) => {
    setCookie('session', '', {
      maxAge: 0,
      path: '/',
    })
    return {
      status: 200,
      body: {},
    }
  },
}))
