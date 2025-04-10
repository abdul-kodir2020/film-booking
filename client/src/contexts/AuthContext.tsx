import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/User';
import axios from 'axios';
import { toast } from 'sonner';


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
  const [loading, setLoading] = useState<Boolean>(false)

  const fetchUser = async (jwt: string) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération de l’utilisateur');
      console.error(err);
    //   logout();
    }
  };

  const login = async (jwt: string): Promise<void> => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
    await fetchUser(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.warning("Vous êtes déconnecté ! Revenez vite !")
  };

  useEffect(() => {
    setLoading(true)

    if (token) {
      fetchUser(token);
    }
    setLoading(false)

  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
        {!loading ? children : "test"}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
