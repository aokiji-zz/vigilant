import { useEffect } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { setAuthenticatedUser } from '../redux/slices/auth.slice'

export const AuthBootstrapper = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      dispatch(setAuthenticatedUser(JSON.parse(storedUser)))
    }
  }, [dispatch])

  return null
}
