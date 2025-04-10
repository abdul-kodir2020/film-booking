import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

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

    if (!decoded.exp || decoded.exp < currentTime) {
      localStorage.removeItem('token');
      toast.warning("Votre session a expiré ! Veuillez vous reconnecter !")
      if (location.pathname === '/home') return <Navigate to="/login" replace />;
      return null;
    }

    if (location.pathname === '/login' || location.pathname === '/register') {
      return <Navigate to="/home" replace />;
    }

    return null;
  } catch {
    localStorage.removeItem('token');
    if (location.pathname === '/home') return <Navigate to="/login" replace />;
    return null;
  }
}
