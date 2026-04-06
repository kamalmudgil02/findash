import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
