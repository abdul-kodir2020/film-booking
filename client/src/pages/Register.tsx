import { Clapperboard } from "lucide-react";
import image from "../assets/images/pexels-sofi-polishchuk-1772575385-31223608.jpg"
import { RegisterForm } from '@/components/register-form';
import { ModeToggle } from "@/components/mode-toggle";



const Register = () => {
  return ( 
   <div className="grid min-h-svh lg:grid-cols-2">
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center gap-2 font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Clapperboard className="size-4"/>
          </div>
          Film Booking.
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <RegisterForm />
        </div>
        
      </div>
      <div className="flex justify-start gap-2 ">
            <ModeToggle />
        </div>
    </div>
    <div className="relative hidden bg-muted lg:block">
      <img
        src = {image}
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-100 object-bottom"
      />
    </div>
  </div>
  );
};

export default Register;
