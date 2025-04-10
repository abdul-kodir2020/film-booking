import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoutes';
import Register from './pages/Register';
import { Toaster } from 'sonner'
import Home from './pages/Home';
import { ThemeProvider } from "@/components/theme-provider"
import AuthRedirect from './components/AuthRedirect';
import Decouvrir from './pages/Decouvrir';
import Reservations from './pages/Reservations';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <AuthRedirect />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            >
              {/* Redirection par défaut vers /home/decouvrir */}
              <Route index element={<Navigate to="decouvrir" replace />} />
              <Route path="decouvrir" element={<Decouvrir />} />
              <Route path="reservations" element={<Reservations />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <div>
          <Toaster richColors />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
