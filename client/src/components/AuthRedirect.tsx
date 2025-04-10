import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function AuthRedirect() {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    if (location.pathname === '/home') return <Navigate to="/login" replace />;
    return null;
  }

  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    const currentTime = Date.now() / 1000;
    console.log(decoded)
    if (!decoded.exp || decoded.exp < currentTime) {
      localStorage.removeItem('token');
      if (location.pathname === '/home') return <Navigate to="/login" replace />;
      return null;
    }

    if (location.pathname === '/login' || location.pathname === '/register') {
      return <Navigate to="/home" replace />;
    }

    return null;
  } catch {
    console.error("test")
    // localStorage.removeItem('token');
    // if (location.pathname === '/home') return <Navigate to="/login" replace />;
    return null;
  }
}
