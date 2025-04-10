import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import { DateTimePicker24h } from "./date-time-picker"
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
  



const FilmDialog = ({film} : {film: any}) => {
    const [date, setDate] = useState<Date>();

    const apiUrl = import.meta.env.VITE_API_URL
    const jwt = localStorage.token;
    
    const handleClick = async() =>{
        if(!date){
            toast.error('Veuillez entrer la date de reservation !')
            return null   
        }

        try {

            const promise = axios.post(`${apiUrl}/reservation`, { movieId: film.id, date: date }, {headers: {
                Authorization: `Bearer ${jwt}`,
            },});

            await toast.promise(promise,{
                loading: 'Reservation en cours...',
                success: async () => {
                    return "Reservation réussie !!"
                },
                error: (err) => {
                    return err.response.data.message
                },
            })


        } catch (err) {
            toast.error("Echec de reservation")
        }
        console.log(date)
    }
  return (
    <Dialog>
        <DialogTrigger className='rounded-full border-none cursor-pointer size-10 bg-white text-black flex items-center justify-center'><Eye /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <h3 className="font-bold text-center">Bio</h3>
            {/* <Badge>Description</Badge> */}
            <DialogTitle className="text-2xl font-extrabold dark:text-white">Titre : {film.title}</DialogTitle>
            <DialogDescription className="text-md font-normal text-gray-800 lg:text-md dark:text-gray-100"><span className="font-extrabold text-black dark:text-white">Description</span> : {film.overview}</DialogDescription>
            </DialogHeader>
            <hr></hr>
            <h3 className="font-bold text-center">Réserver ce film</h3>
            <DateTimePicker24h date={date} setDate={setDate}/>
            <div className="flex items-center justify-center">
                <button className="rounded bg-black dark:bg-white dark:text-black text-white p-2 w-30 cursor-pointer" type="button" onClick={handleClick}>Réserver</button>
            </div>
        </DialogContent>
    </Dialog>

  )
}

export default FilmDialog