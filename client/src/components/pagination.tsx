import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

import React from 'react'

const PaginationComponent = ({page, totalPages, setPage}: {page: number, totalPages: number, setPage: (current: any) => void}) => {
    const pages = page === 1 
            ? [1, 2, 3] 
            : page === totalPages ? [page - 2, page - 1, page] : [page - 1, page, page + 1]
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious className="cursor-pointer" type="button" onClick={() => {if(page > 1) setPage((current: number) => current - 1)}} />
        </PaginationItem>
        {
            pages.map((item)=>(
                <PaginationItem key={item} className="cursor-pointer">
                    <PaginationLink isActive={item === page} onClick={() => setPage(item)}>{item}</PaginationLink>
                </PaginationItem>
            ))
        }
        <PaginationItem className="cursor-pointer">
          <PaginationNext type="button"  onClick={() => {if(page < totalPages) setPage((current: number) => current + 1)}} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationComponent