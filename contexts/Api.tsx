import aspida from '@aspida/fetch'
import { createContext, useCallback, useMemo, useState } from 'react'
import $api from '~/server/api/$api'

export const ApiContext = createContext({
  api: $api(aspida()),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToken: (() => {}) as (token: string) => void,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  deleteToken: () => {},
})

export const ApiProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState('')
  const api = useMemo(
    () => $api(token ? aspida(fetch, { headers: { Authorization: `Bearer ${token}` } }) : aspida()),
    [token]
  )
  const deleteToken = useCallback(() => setToken(''), [])

  return (
    <ApiContext.Provider value={{ api, setToken, deleteToken }}>{children}</ApiContext.Provider>
  )
}
