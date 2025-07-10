import { BrowserRouter, Navigate, Outlet, Route, RouteProps, Routes } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { selectAuthenticatedUser } from '../redux/slices/auth.slice'
import LoginPage from '../pages/login/LoginPage'
import VigilantPage from '../pages/vigilant/VigilantPage'
import VigilantListPage from '../pages/vigilant-list/VigilantListPage'
import ImportDataScanPage from '../pages/import-data/ImportDataPage'
import { AuthBootstrapper } from './Authbootstrapper'
const PrivateRoute = ({ ...rest }: RouteProps): React.ReactElement | null => {
  const { access_token } = useAppSelector(selectAuthenticatedUser)
  return access_token ? <Outlet /> : <Navigate to="/login" />
}

const RootNavigation = () => {
  return (
    <BrowserRouter>
      <AuthBootstrapper />
      <Routes>
        <Route path="/" element={<VigilantPage />} />
        <Route path="/list" element={<VigilantListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/import-data-scan" element={<PrivateRoute />}>
          <Route path="/import-data-scan" element={<ImportDataScanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default RootNavigation
