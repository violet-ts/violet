import { useContext } from 'react'
import { ApiContext } from '@violet/frontend/src/contexts/Api'

export const useApi = () => ({
  api: useContext(ApiContext).api,
  onErr: () => undefined,
})
