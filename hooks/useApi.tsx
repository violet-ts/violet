import useAspidaSWR from '@aspida/swr'
import { useContext } from 'react'
import { ApiContext } from '~/contexts/Api'

export const useApi = () => ({
  api: useContext(ApiContext).api,
  useAspidaSWR,
  onErr: () => undefined,
})
