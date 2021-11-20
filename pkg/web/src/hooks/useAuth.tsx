import { AuthContext } from '@violet/web/src/contexts/Auth'
import { useContext } from 'react'

export const useAuth = () => useContext(AuthContext)
