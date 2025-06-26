import React from 'react';
import { GenericEntry, FieldDefinition } from '../types';

interface CustomAction {
  label: string;
  onClick: (entry: GenericEntry) => void;
  className?: string;
  ariaLabel?: (entry: GenericEntry) => string;
}

interface DataTableProps {
  columns: FieldDefinition[];
  data: GenericEntry[];
  onEdit?: (entry: GenericEntry) => void;
  onDelete?: (id: number) => void;
  customActions?: CustomAction[]; // New prop for custom actions
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, onEdit, onDelete, customActions }) => {
  if (!data || data.length === 0) {
    return null; 
  }

  const hasActions = onEdit || onDelete || (customActions && customActions.length > 0);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.name}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((entry) => (
            <tr key={entry.id} className="hover:bg-sky-50/50 transition-colors duration-150 ease-in-out">
              {columns.map((col) => {
                const cellValue = entry[col.name];
                let displayValue;

                if (
                  (
                    col.name === 'tahun_awal_periode' || 
                    col.name === 'tahun_akhir_periode' ||
                    col.name === 'tahun_rkp' || 
                    col.name === 'tahun_apbdes'
                  ) && 
                  col.type === 'number' && typeof cellValue === 'number'
                ) {
                  displayValue = cellValue.toString();
                } else if (col.type === 'number' && typeof cellValue === 'number') {
                  displayValue = cellValue.toLocaleString('id-ID');
                } else {
                  displayValue = cellValue?.toString() || <span className="text-gray-400">-</span>;
                }
                
                return (
                  <td key={`${entry.id}-${col.name}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {displayValue}
                  </td>
                );
              })}
              {hasActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2 sm:space-x-3">
                  {customActions && customActions.map(action => (
                    <button
                      key={action.label}
                      onClick={() => action.onClick(entry)}
                      className={action.className || "text-blue-600 hover:text-blue-800 transition font-medium"}
                      aria-label={action.ariaLabel ? action.ariaLabel(entry) : action.label}
                    >
                      {action.label}
                    </button>
                  ))}
                  {!customActions && onEdit && (
                    <button
                      onClick={() => onEdit(entry)}
                      className="text-sky-600 hover:text-sky-800 transition font-medium"
                      aria-label={`Edit entri ${entry.id}`}
                    >
                      Edit
                    </button>
                  )}
                  {!customActions && onDelete && (
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="text-red-600 hover:text-red-800 transition font-medium"
                      aria-label={`Hapus entri ${entry.id}`}
                    >
                      Hapus
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};