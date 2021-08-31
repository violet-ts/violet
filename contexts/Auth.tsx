import { getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, User } from 'firebase/auth'
import { createContext, useEffect, useState } from 'react'

if (!getApps().length) {
  initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  })
}

export const AuthContext = createContext<{ currentUser: User | null }>({
  currentUser: null,
})

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth()

    if (!process.env.IS_PRODUCTION) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    }

    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
  }, [])

  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>
}
