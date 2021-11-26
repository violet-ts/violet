import aspida from '@aspida/fetch'
import useAspidaSWR from '@aspida/swr'
import $api from '@violet/api/api/$api'
import { createContext, useContext, useMemo } from 'react'

const ApiContext = createContext({
  api: $api(
    aspida((() => {
      throw new Error('not provided')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- only for typing
    }) as any)
  ),
  onErr: () => {},
})

export const useApiContext = () => useContext(ApiContext)

export const ApiProvider: React.FC = ({ children }) => {
  const plainApi = useMemo(
    () => $api(aspida(fetch, { credentials: 'include', throwHttpErrors: true })),
    []
  )
  const { data: csrfToken } = useAspidaSWR(plainApi.csrf, {
    refreshInterval: 1000 * 60 * 12, // 12 hours
  })
  // TODO(service): 必須ではないが、csrf token で forbidden だったら一定数 mutate を自動でする、自動リトライする
  const api = useMemo(
    () =>
      $api(
        aspida(fetch, {
          credentials: 'include',
          throwHttpErrors: true,
          headers: csrfToken ? { 'csrf-token': csrfToken } : {},
        })
      ),
    [csrfToken]
  )

  return <ApiContext.Provider value={{ api, onErr: () => {} }}>{children}</ApiContext.Provider>
}
