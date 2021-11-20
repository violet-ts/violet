import { ApiContext } from '@violet/web/src/contexts/Api'
import { useContext } from 'react'

export const useApi = () => useContext(ApiContext)
