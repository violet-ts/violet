import useAspidaSWR from '@aspida/swr'
import type { UserClaims } from '@violet/def/user/session-claims'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { useApiContext } from './Api'

interface AuthContextValue {
  readonly currentUser: UserClaims | null
  readonly refresh: () => Promise<void>
  readonly initialized: boolean
  readonly signOut: () => Promise<void>
  readonly error: unknown
  readonly isValidating: boolean
}

const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  refresh: async () => {},
  initialized: false,
  signOut: async () => {},
  error: null,
  isValidating: false,
})

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider: React.FC = ({ children }) => {
  const { api } = useApiContext()
  const {
    data: userClaims,
    mutate,
    error,
    isValidating,
  } = useAspidaSWR(api.auth.user, {
    refreshInterval: 1000 * 60 * 60, // 1 hour
    focusThrottleInterval: 1000 * 60 * 5, // 5 minutes
  })

  const initialized = useMemo(() => userClaims !== undefined, [userClaims])
  const currentUser = useMemo(() => userClaims ?? null, [userClaims])

  const refresh = useCallback(async () => {
    await mutate()
  }, [mutate])

  const signOut = useCallback(async () => {
    await api.auth.session.$delete({ body: {} })
    await refresh()
  }, [api, refresh])

  return (
    <AuthContext.Provider
      value={{ currentUser, refresh, initialized, error, isValidating, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
