import { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Badge } from '@/components/ui/badge'
import PaginationComponent from '@/components/pagination'
import FilmDialog from '@/components/film-dialog'

import { Film } from '@/types/Film'

const Decouvrir = () => {
    const [selectedOption, setSelectedOption] = useState('desc')
    const [keyWord, setKeyword] = useState('')
    const [films, setFilms] = useState<Film[]>([]) 
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(()=>{
        const params: {page: number, sortBy: string, search_keyword?: string} = {
            page: page,
            sortBy: selectedOption,
        }

        if(keyWord) params['search_keyword'] = keyWord

        const fetchFilms = async (jwt: string) => {
            setLoading(true)
            try {
              const res = await axios.get(`${import.meta.env.VITE_API_URL}/movies`, {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
                params: params
              });
              setTotalPages(res.data.tota_pages)
              setFilms(res.data.results);
            } catch (err) {
              console.error('Erreur lors de la récupération des films');
            }finally{
                setLoading(false)
            }
        };

        const token = localStorage.getItem('token');
        if(token) fetchFilms(token)
    },[selectedOption, keyWord,page])
  return (
    <div>
        <h1 className="mb-5 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">Découvrez tous les  <span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">films disponibles</span></h1>
        <hr></hr>
        <div className='flex items-center justify-between mt-4'>
            <div className=''>
                <Select onValueChange={(value) => setSelectedOption(value)} defaultValue={selectedOption}>
                    <SelectTrigger className="w-[200px] text-foreground">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Ordre Décroissant</SelectItem>
                        <SelectItem value="asc">Ordre croissant</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <PaginationComponent page={page} totalPages={totalPages} setPage={setPage}/>

            <div className="relative w-100">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-500 left-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <Input type="text" placeholder="Recherche..." className="pl-12 pr-4" value={keyWord} onChange={(e) => setKeyword(e.target.value)} />
            </div>

        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
            {
                !loading?
                    films?.map((film)=>(
                        <div className='bg-white rounded group/item relative cursor-pointer'>
                            <img className='object-cover size-full' src={"https://image.tmdb.org/t/p/original/"+film.poster_path}></img>
                            <div className='flex items-center justify-center size-full bg-black/40 absolute top-0 left-0 group/edit invisible group-hover/item:visible group-hover/edit:translate-x-0.5'>
                                <FilmDialog film={film}/>
                            </div>
                            <Badge className='bg-gray-800 text-white absolute top-2 left-2'>{new Date(film.release_date).getFullYear()}</Badge>
                        </div>
                    ))
                :
                    <div>
                        loading
                    </div>
            }
        </div>
        <div className='my-3 flex items-center'>
            {
                !loading &&
                <PaginationComponent page={page} totalPages={totalPages} setPage={setPage}/>
            }
        </div>
    </div>
  )
}

export default Decouvrir