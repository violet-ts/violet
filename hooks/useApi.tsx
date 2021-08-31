import useAspidaSWR from '@aspida/swr'
import { useContext } from 'react'
import { Loading } from '~/components/atoms/Loading'
import { ApiContext } from '~/contexts/Api'

const Fetching = (props: { error: unknown }) =>
  props.error === undefined ? <Loading /> : <div>Error...</div>

export const useApi = () => ({
  api: useContext(ApiContext).api,
  useAspidaSWR,
  Fetching,
  onErr: () => undefined,
})
