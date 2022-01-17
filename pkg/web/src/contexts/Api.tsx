import aspida from '@aspida/fetch'
import useAspidaSWR from '@aspida/swr'
import $api from '@violet/api/api/$api'
import { createContext, useContext, useEffect, useMemo, useRef } from 'react'

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

type ResolveCsrfToken = (csrfToken: string) => void
type GetCsrfToken = Promise<string>
type MutateCsrfToken = () => Promise<unknown>

export const ApiProvider: React.FC = ({ children }) => {
  const resolveCsrfToken = useRef<ResolveCsrfToken>()
  const getCsrfToken = useRef<GetCsrfToken>()
  const mutateCsrfToken = useRef<MutateCsrfToken>()

  const resetCsrfTokenPromise = () => {
    if (getCsrfToken.current === undefined) {
      getCsrfToken.current = new Promise<string>((resolve) => {
        resolveCsrfToken.current = resolve
      })
    }
  }

  resetCsrfTokenPromise()

  const plainApi = useMemo(
    () => $api(aspida(fetch, { credentials: 'include', throwHttpErrors: true })),
    []
  )

  const {
    data: csrfToken,
    mutate,
    isValidating,
  } = useAspidaSWR(plainApi.csrf, {
    refreshInterval: 1000 * 60 * 12, // 12 hours
  })
  useEffect(() => {
    if (typeof csrfToken === 'string' && !isValidating) {
      const oldResolve = resolveCsrfToken.current
      getCsrfToken.current = Promise.resolve(csrfToken)
      resolveCsrfToken.current = undefined
      mutateCsrfToken.current = async () => {
        // リセットすることで使用者側が確実に新しいトークンを取るようにする
        getCsrfToken.current = undefined
        resetCsrfTokenPromise()
        await mutate()
      }
      oldResolve?.(csrfToken)
    } else if (isValidating) {
      resetCsrfTokenPromise()
    }
  }, [plainApi, csrfToken, mutate, isValidating])

  // NOTE: この中で ref を経由せずにステートにアクセスしてはいけない。最新の（代入時点では未来の）ステートが知りたいため。
  const customFetch: typeof fetch = async (input, init) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- depending on impl of aspida
    ;(init!.headers as Record<string, string>)['csrf-token'] = await getCsrfToken.current!
    {
      const response = await fetch(input, init)
      if (response.status !== 403) return response
    }

    // 403 (Forbidden) の際に自動リトライ
    await mutateCsrfToken.current?.()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- depending on impl of aspida
    ;(init!.headers as Record<string, string>)['csrf-token'] = await getCsrfToken.current!
    const response = await fetch(input, init)
    return response
  }

  const api = useMemo(
    () =>
      $api(
        aspida(customFetch, {
          credentials: 'include',
          throwHttpErrors: true,
        })
      ),
    []
  )

  return <ApiContext.Provider value={{ api, onErr: () => {} }}>{children}</ApiContext.Provider>
}
