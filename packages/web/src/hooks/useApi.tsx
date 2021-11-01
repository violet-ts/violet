import { useContext } from 'react'
import { ApiContext } from '@violet/web/src/contexts/Api'

export const useApi = () => ({
  api: useContext(ApiContext).api,
  onErr: () => undefined,
})
