import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext";
  
  export function AlertDialogLogout() {
      const { logout } = useAuth();
    
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="cursor-pointer">Se déconnecter</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etes vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous serez déconnecté !!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Non</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 text-white cursor-pointer" onClick={logout}>Me déconnecter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  