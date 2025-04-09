import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoutes';
import Register from './pages/Register';
import { Toaster } from 'sonner'
import Home from './pages/Home';
import AuthRedirect from './components/AuthRedirect';

const App = () => {
  return (
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
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <div>
        <Toaster richColors />
      </div>
    </AuthProvider>
  );
};

export default App;
