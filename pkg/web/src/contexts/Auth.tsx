// TODO(infra): Cognito auth
import { createContext, useEffect, useState } from 'react'

interface User {
  photoURL: string
  displayName: string
}

export const AuthContext = createContext<{ currentUser: User | null }>({
  currentUser: null,
})

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    setCurrentUser({ photoURL: '', displayName: '' })
  }, [])

  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>
}
