import { Provider } from 'react-redux'
import RootNavigation from './app/navigation/RootNavigation'
import { store } from './app/redux/store'
import 'react-notifications/lib/notifications.css'
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
          {/* <NotificationContainer />
          <Loader show={general.showLoader} />
          <Navbar bg="dark" expand="lg" variant="dark">
            <Container>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {access_token ? <Nav.Link href="/calculator">My Calculator</Nav.Link> : <Outlet />}
                  {access_token ? (
                    <NavDropdown title={email} id="basic-nav-dropdown">
                      <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <NavDropdown title={'UnAuthenticted'} id="basic-nav-dropdown">
                      <NavDropdown.Item href="/">Login</NavDropdown.Item>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar> */}
          <RootNavigation />
        </Provider>
      ) : (
        <></>
      )}
    </div>
  )
}

export default App
