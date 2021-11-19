import { Loading } from '@violet/web/src/components/atoms/Loading'
import { useEffect } from 'react'

export const Fetching = ({ error }: { error: unknown }) => {
  useEffect(() => {
    if (error) console.error(error)
  }, [error])
  return error === undefined ? <Loading /> : <div>Error...</div>
}
