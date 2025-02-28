import React from "react";

interface TableProps {
  headers: string[];
  data: (string | React.ReactNode)[][];
  onRowClick?: (rowData: (string | React.ReactNode)[]) => void; 
  columnAlignment?: string[];
  columnWidths?: string[];
  className?: string;
}

const Table: React.FC<TableProps> = ({ headers, data, onRowClick, columnAlignment, columnWidths, className }) => { 
  return (
    <div className="overflow-x-auto mt-4">
      <table className={`w-full table-fixed border-collapse bg-card shadow rounded-lg overflow-hidden ${className}`}>
        <thead>
          <tr className="bg-card text-bold_detail text-secondary">
            {headers.map((header, index) => (
              <th
                key={`header-${index}`}
                className={`px-4 py-3 ${columnWidths?.[index] || "w-auto"} ${columnAlignment?.[index] || "text-left"} whitespace-nowrap`}
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
              className="bg-card border-b-2 border-ourGray hover:bg-unread cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`row-${rowIndex}-cell-${cellIndex}`}
                  className={`px-4 py-4 text-detail_2 text-secondary ${columnWidths?.[cellIndex] || "w-auto"} ${columnAlignment?.[cellIndex] || "text-left"} truncate`}
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
