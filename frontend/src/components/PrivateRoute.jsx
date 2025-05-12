import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  if (!user) {
    // Redirect to login page, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}