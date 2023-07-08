import React, { useRef } from "react";
import ReactPaginate from 'react-paginate';

const listPages = [{value: 5, label: 5}, {value: 10, label: 10}, {value: 15, label: 15}, {value: 25, label: 25}, {value: 50, label: 50}]
export default function TableComponent({ children, paginate, onAction }) {
  const pageCount = Math.ceil(paginate?.total_rows / paginate?.limitRowsPage);
  const navigation = useRef();
  const handleLimitPages = ({ target }) => {
    let value = parseInt(target.value);
    if (value > paginate.total_rows)  onAction({ ...paginate, page: 0, limitRowsPage: value })
    else onAction({ ...paginate, page: 0, limitRowsPage: value })
    navigation.current.state.selected = 0;
  }
  return (
    <div className="flex flex-col overflow-x-auto">
      <div className="p-2 inline-block min-w-full">
        <table className="table-base">{children}</table>
        {
          paginate &&
          <div className="flex justify-start md:justify-end gap-6 items-center mt-4">
            <div className="flex gap-6">
              <div className="flex gap-2">
                <span className="text-paragraph-3 whitespace-nowrap">Filas por página</span>
                <select className="border rounded-md w-14" value={paginate.limitRowsPage} onChange={handleLimitPages}>
                  {
                    listPages.map((el, index) => (
                      <option key={index} value={el.value}>{el.label}</option>
                    ))
                  }
                </select>
              </div>
              <div className="text-paragraph-2 flex gap-1">
                <span>{paginate.limitRowsPage * paginate.page} </span>
                <span>-</span>
                <span>{paginate.limitRowsPage * (paginate.page + 1) > paginate.total_rows ? paginate.total_rows : paginate.limitRowsPage * (paginate.page + 1)}</span>
                <span>de</span>
                <span>{paginate.total_rows}</span>
              </div>
            </div>
            <ReactPaginate
              ref={navigation}
              className="pagination-base"
              breakLabel="..."
              nextLabel="&#8702;"
              onPageChange={(event) => onAction({ ...paginate, page: event.selected })}
              pageRangeDisplayed={0}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              selectedPageRel={1}
              previousLabel="&#8701;"
              renderOnZeroPageCount={null}
            />
          </div>
        }
        </div>
    </div>
  );
}