import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";


export function RegisterForm() {
    const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post(`${apiUrl}/auth/register`, { name, email, password });
//       toast.success("Inscription réussie !")
//       navigate('/login');
//     } catch (err) {
//       toast.error("Erreur lors de l’inscription.")
//     } finally {
//       setLoading(false);
//     }
//   };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const promise = axios.post(`${apiUrl}/auth/register`, { name, email, password });

            toast.promise(promise, {
                loading: 'Inscription en cours...',
                success: (res) => {
                    navigate('/login')
                    return `${res.data.user.name} a été inscrit avec succès`
                },
                error: (err) => {
                    return err.response.data.message
                },
            });

        } catch (err) {
            toast.error(" lors de l’inscription.");
        }
    };

  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Créez un compte</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Réjoignez Nous !
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" type="text" placeholder="Jean Doe" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
          </div>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Créez
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        </div>
      </div>
      <div className="text-center text-sm">
        Vous avez déjà un compte ? {" "}
        <Link to={"/login"} className="underline underline-offset-4">Connectez vous !</Link>
      </div>
    </form>
  )
}
