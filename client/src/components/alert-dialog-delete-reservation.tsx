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
import axios from "axios";

import React from 'react'
import { toast } from "sonner";

const AlertDialogDeleteReservation = ({reservation, setReservations} : {reservation: any, setReservations: (tab: any) => void}) => {
    const apiUrl = import.meta.env.VITE_API_URL
    const jwt = localStorage.token;

    const handleClick = async(id: string) => {
        try {
            const promise = axios.delete(`${apiUrl}/reservation/${id}`, {headers: {
                Authorization: `Bearer ${jwt}`,
            },});

            await toast.promise(promise,{
                loading: 'Suppression en cours...',
                success: async (res) => {
                    setReservations((current: any[]) => current.filter(reservation => reservation.id !== res.data.id_reservation))
                    return "Reservation supprimée !!"
                },
                error: (err) => {
                    return err.response.data.message
                },
            })
        } catch (err) {
            console.error('Erreur lors de la suppression');
            console.error(err);
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer bg-red-500 text-white rounded px-3 py-1" >Annuler la reservation</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Souhaitez vous supprimer cette reservation</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Non</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleClick(reservation)}>Oui, je le souhaite !</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default AlertDialogDeleteReservation