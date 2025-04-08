import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/User';
import axios from 'axios';


interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const fetchUser = async (jwt: string) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setUser(res.data);
      console.log(res.data)
    } catch (err) {
      console.error('Erreur lors de la récupération de l’utilisateur');
      logout();
    }
  };

  const login = (jwt: string) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
    fetchUser(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Appelé une seule fois au chargement
  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
