import { BrowserRouter, Navigate, Outlet, Route, RouteProps, Routes } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { selectAuthenticatedUser } from '../redux/slices/auth.slice'
import LoginPage from '../pages/login/LoginPage'
import VigilantPage from '../pages/vigilant/VigilantPage'
import VigilantListPage from '../pages/vigilant-list/VigilantListPage'


// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ ...rest }: RouteProps): React.ReactElement | null => {
  const { access_token } = useAppSelector(selectAuthenticatedUser)
  // return access_token ? <Route {...rest} /> : <Route {...rest} element={<Navigate replace to="/" />} />
  return access_token ? <Outlet /> : <Navigate to="/login" />
}

const RootNavigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/nvigilant" element={<PrivateRoute />}> */}
        {/* </Route> */}
        <Route path="/" element={<VigilantPage />} />
        <Route path="/list" element={<VigilantListPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default RootNavigation
