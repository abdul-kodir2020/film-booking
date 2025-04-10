import axios from 'axios';
import { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import AlertDialogDeleteReservation from '@/components/alert-dialog-delete-reservation';

import { Reservation } from '@/types/Reservation';
  
function Reservations() {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(false)

    const formatDate = (date: string | number | Date) => {
        return format(new Date(date), "d MMMM yyyy 'à' HH'h'mm", {
            locale: fr,
        })
    }

    useEffect(()=>{
        const fetchReservations = async (jwt: string) => {
            setLoading(true)
            try {
              const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservation`, {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              });
              setReservations(res.data);
            } catch (err) {
              console.error('Erreur lors de la récupération des films');
            }finally{
                setLoading(false)
            }
        };

        const token = localStorage.getItem('token');
        if(token) fetchReservations(token)
    },[])
  return (
    <div>
        <h1 className="mb-5 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">Voir <span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">mes reservations</span></h1>
        <hr></hr>
        <div className='mt-4'>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="font-bold">Id du film</TableHead>
                    <TableHead className="font-bold">Date de la séance</TableHead>
                    <TableHead className="font-bold">Réservé le</TableHead>
                    <TableHead className="text-right font-bold"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !loading &&
                        reservations.map((reservation: Reservation) => (
                            <TableRow key={reservation.id}>
                                <TableCell className="font-medium">{reservation.id}</TableCell>
                                <TableCell>{formatDate((reservation.date))}</TableCell>
                                <TableCell>{formatDate(reservation.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                    <AlertDialogDeleteReservation setReservations={setReservations} reservation={reservation.id}/>
                                </TableCell>
                            </TableRow>
                        ))
                        
                    }
                    
                </TableBody>
            </Table>

        </div>
    </div>
  )
}

export default Reservations