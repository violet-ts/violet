import type { UserClaims } from '@violet/def/user/session-claims'
import { useApi } from '@violet/web/src/hooks'
import { createContext, useCallback, useEffect, useState } from 'react'

const focusRefreshIntervalMilliseconds = 1000 * 60 * 5
const autoRefreshIntervalMilliseconds = 1000 * 60 * 60

interface AuthContextValue {
  readonly currentUser: UserClaims | null
  readonly refresh: () => Promise<UserClaims | null>
  readonly lastUpdatedAt: number
  readonly initialized: boolean
  readonly signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  lastUpdatedAt: Date.now(),
  refresh: async () => null,
  signOut: async () => {},
  initialized: false,
})

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserClaims | null>(null)
  const [initialized, setInitialized] = useState<boolean>(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now())
  const [needRefreshOnFocus, setNeedRefreshOnFocus] = useState<boolean>(false)
  const [timeoutForNeedRefreshOnFocus, setTimeoutForNeedRefreshOnFocus] = useState<
    NodeJS.Timeout | undefined
  >()

  const { api } = useApi()
  const refresh = useCallback(async () => {
    const userClaims = await api.auth.user.$get()
    setCurrentUser(userClaims)
    setInitialized(true)
    setLastUpdatedAt(Date.now())
    setNeedRefreshOnFocus(false)
    setTimeoutForNeedRefreshOnFocus(
      setTimeout(() => setNeedRefreshOnFocus(true), focusRefreshIntervalMilliseconds)
    )
    return userClaims
  }, [
    api,
    setCurrentUser,
    setLastUpdatedAt,
    setNeedRefreshOnFocus,
    setTimeoutForNeedRefreshOnFocus,
  ])

  const refreshOnFocus = useCallback(() => {
    if (needRefreshOnFocus) {
      refresh()
    }
  }, [needRefreshOnFocus, refresh])

  const signOut = useCallback(async () => {
    await api.auth.session.$delete({ body: {} })
    await refresh()
  }, [api, refresh])

  useEffect(() => {
    window.addEventListener('focus', refreshOnFocus)
    return () => {
      window.removeEventListener('focus', refreshOnFocus)
    }
  }, [refreshOnFocus])

  useEffect(() => {
    let canceled = false
    const startAutoRefresh = async () => {
      while (!canceled) {
        await refresh()
        await new Promise((resolve) => setTimeout(resolve, autoRefreshIntervalMilliseconds))
      }
    }
    startAutoRefresh()
    return () => {
      canceled = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutForNeedRefreshOnFocus) {
        clearTimeout(timeoutForNeedRefreshOnFocus)
      }
    }
  }, [timeoutForNeedRefreshOnFocus])

  return (
    <AuthContext.Provider value={{ currentUser, lastUpdatedAt, refresh, initialized, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
