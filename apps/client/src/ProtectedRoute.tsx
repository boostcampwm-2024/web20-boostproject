import { useContext } from 'react';
import { AuthContext } from '@contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { isLoggedIn } = useContext(AuthContext);
  const accessToken = localStorage.getItem('accessToken');

  return isLoggedIn || accessToken ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
