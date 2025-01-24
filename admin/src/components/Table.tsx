import React from "react";

interface TableProps {
  headers: string[];
  data: (string | React.ReactNode)[][];
  onRowClick?: (rowData: (string | React.ReactNode)[]) => void; 
}

const Table: React.FC<TableProps> = ({ headers, data, onRowClick }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full border-collapse bg-card shadow rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-card text-description">
            {headers.map((header, index) => (
              <th
                key={`header-${index}`} 
                className="px-6 py-3 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className={`${
                "bg-card border-b-2 hover:bg-unread"
              } cursor-pointer`} 
              onClick={() => onRowClick?.(row)} 
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`row-${rowIndex}-cell-${cellIndex}`} 
                  className="px-6 py-4 text-description"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
