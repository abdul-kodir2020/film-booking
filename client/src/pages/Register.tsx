import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from "../assets/images/pexels-xenofan-696995602-31006027.jpg"
import { RegisterForm } from '@/components/register-form';
import { toast } from 'sonner';



const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/auth/register`, { name, email, password });
      toast.success("Inscription réussie !")
      navigate('/login');
    } catch (err) {
      toast.error("Erreur lors de l’inscription.")
    } finally {
      setLoading(false);
    }
  };

  return (
    // <form onSubmit={handleSubmit}>
    //   <h2>Register</h2>
    //   <input
    //     type="text"
    //     placeholder="name"
    //     value={name}
    //     required
    //     onChange={(e) => setName(e.target.value)}
    //   />
    //   <input
    //     type='email'
    //     placeholder="email"
    //     value={email}
    //     required
    //     onChange={(e) => setEmail(e.target.value)}
    //   />
    //   <input
    //     type="password"
    //     placeholder="Password"
    //     value={password}
    //     required
    //     onChange={(e) => setPassword(e.target.value)}
    //   />
    //   <button type="submit" disabled={loading}>
    //     {loading ? 'En cours...' : 'S’inscrire'}
    //   </button>
    // </form>
    <div className="grid min-h-svh lg:grid-cols-2">
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center gap-2 font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <div className="size-4" />
          </div>
          Film Booking.
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <RegisterForm 
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        </div>
      </div>
    </div>
    <div className="relative hidden bg-muted lg:block">
      <img
        src = {image}
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale object-bottom"
      />
    </div>
  </div>
  );
};

export default Register;
