import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';

export default function DataTable({ columns, data, className }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  const pageCount = Math.ceil(data.length / pageSize);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;
  
  const currentPageData = data.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const gotoPage = (index) => {
    setPageIndex(index);
  };

  const nextPage = () => {
    setPageIndex(Math.min(pageIndex + 1, pageCount - 1));
  };

  const previousPage = () => {
    setPageIndex(Math.max(pageIndex - 1, 0));
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    // Adjust pageIndex if current page would be empty
    const newPageCount = Math.ceil(data.length / newSize);
    setPageIndex(Math.min(pageIndex, newPageCount - 1));
  };

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th key={i}>{column.Header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.accessor ? row[column.accessor] : column.Cell?.({ value: row[column.accessor] || row })}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageCount}
            </strong>
          </span>
          
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="select select-bordered select-sm"
          >
            {[5, 10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="btn btn-sm btn-ghost"
          >
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className="btn btn-sm btn-ghost"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className="btn btn-sm btn-ghost"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="btn btn-sm btn-ghost"
          >
            <ChevronDoubleRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}