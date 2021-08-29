import Firebase from 'firebase/app'
import 'firebase/auth'
import { createContext, FC, useEffect, useState } from 'react'

if (!Firebase.apps.length) {
  Firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  })
}

const AuthContext = createContext<{ currentUser: Firebase.User | null }>({
  currentUser: null,
})

const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Firebase.User | null>(null)

  useEffect(() => {
    const auth = Firebase.auth()

    if (!process.env.IS_PRODUCTION) {
      // @ts-expect-error hide footer warning
      auth.useEmulator('http://localhost:9099', { disableWarnings: true })
    }

    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
  }, [])

  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
