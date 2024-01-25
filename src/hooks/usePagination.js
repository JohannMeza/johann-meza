import { useState } from 'react';

export default function usePagination (page = 0, limitRowsPage = 10) {
  const [paginate, setPaginate] = useState({ page, limitRowsPage, total_rows: 0, total_current: 0 })
  
  const handleChangePaginate = (pagination) => {
    let { page, limitRowsPage, total_rows, total_current } = pagination;
    setPaginate((paginate) => {return { ...paginate, page, limitRowsPage, total_rows, total_current }})
  }

  return { handleChangePaginate, paginate }
}