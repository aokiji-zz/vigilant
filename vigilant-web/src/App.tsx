import { Provider } from 'react-redux'
import RootNavigation from './app/navigation/RootNavigation'
import { store } from './app/redux/store'
import 'react-notifications/lib/notifications.css'
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useAppDispatch, useAppSelector } from './app/redux/hooks'
import { selectGeneral } from './app/redux/slices/general.slice'
import { useEffect, useState } from 'react'
import { resetState, selectAuthenticatedUser, setAuthenticatedUser } from './app/redux/slices/auth.slice'
import './App.css'
function App() {
  const general = useAppSelector(selectGeneral)
  const { email, access_token } = useAppSelector(selectAuthenticatedUser)
  const dispatch = useAppDispatch()
  const [finsihedInitialize, setFinsihedInitialize] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userFromStorage = JSON.parse(user)
      console.log('userFromStorage', userFromStorage)
      dispatch(setAuthenticatedUser(userFromStorage))
    }
    setFinsihedInitialize(true)
  }, [dispatch])

  const logout = () => {
    dispatch(resetState())
  }

  return (
    <div className='App'>
      {finsihedInitialize ? (
        <Provider store={store}>
          <RootNavigation />
        </Provider>
      ) : (
        <></>
      )}
    </div>
  )
}

export default App
