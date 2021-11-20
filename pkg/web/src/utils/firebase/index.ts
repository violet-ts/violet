/* eslint-disable no-restricted-imports */
import { initializeApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import { connectAuthEmulator, getAuth, inMemoryPersistence } from 'firebase/auth'
export { EmailAuthProvider, GithubAuthProvider } from 'firebase/auth'
/* eslint-enable no-restricted-imports */

const createAuth = () => {
  if (process.env.NEXT_PUBLIC_AUTH_EMULATOR) {
    // emulator settings
    // https://firebase.google.com/docs/emulator-suite/connect_auth
    const app = initializeApp({
      apiKey: 'fake-api-key',
    })
    const auth = getAuth(app)
    auth.setPersistence(inMemoryPersistence)
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_AUTH_EMULATOR, {
      disableWarnings: process.env.NEXT_PUBLIC_AUTH_DISABLE_UI_WARNING === '1',
    })
    return auth
  } else {
    // production settings
    const config = {
      apiKey: process.env.NEXT_PUBLIC_GCIP_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_GCIP_AUTH_DOMAIN,
    }
    const app = initializeApp(config)
    const auth = getAuth(app)
    auth.setPersistence(inMemoryPersistence)
    return auth
  }
}

const cacheAuth = (): Auth | null => {
  // TODO(test): dirty
  if (process.env.NODE_ENV === 'test') return null
  if (typeof window === 'undefined') return null
  if (process.env.NODE_ENV === 'production') return createAuth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- prevent HMR
  return ((window as any)._firebase_auth = (window as any)._firebase_auth ?? createAuth())
}

export const auth = cacheAuth()
