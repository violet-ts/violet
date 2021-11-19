import aspida from '@aspida/fetch'
import useAspidaSWR from '@aspida/swr'
import $api from '@violet/api/api/$api'
import { createContext, useMemo } from 'react'

export const ApiContext = createContext({
  api: $api(
    aspida((() => {
      throw new Error('not provided')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any)
  ),
  onErr: () => {},
})

export const ApiProvider: React.FC = ({ children }) => {
  const plainApi = useMemo(
    () =>
      $api(
        aspida(fetch, {
          credentials: 'include',
        })
      ),
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
          headers: csrfToken
            ? {
                'csrf-token': csrfToken,
              }
            : {},
        })
      ),
    [csrfToken]
  )

  return <ApiContext.Provider value={{ api, onErr: () => {} }}>{children}</ApiContext.Provider>
}
