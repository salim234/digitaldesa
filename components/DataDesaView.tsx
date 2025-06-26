import React, { useState, useEffect } from 'react';
import { DataDesaEntry, FieldDefinition, DATA_DESA_KEY } from '../types';
import { DataForm } from './DataForm';
import { DATA_DESA_FIELDS } from '../constants'; // Import field definitions

interface DataDesaViewProps {
  dataDesa: DataDesaEntry | null;
  onSave: (updatedData: Omit<DataDesaEntry, 'id'>) => Promise<void>;
  isLoading: boolean;
  fields: FieldDefinition[]; // Passed from App.tsx, originally from constants.tsx
}

export const DataDesaView: React.FC<DataDesaViewProps> = ({ dataDesa, onSave, isLoading, fields }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleFormSubmit = async (formData: Omit<DataDesaEntry, 'id'>) => {
    // The id is fixed (1) and handled by the saveDataDesa in database.ts
    // So we submit without id from the form itself.
    await onSave(formData);
    setIsEditing(false);
  };

  const currentData = dataDesa || {} as DataDesaEntry; // Use empty object if null for display

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-sky-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Memuat Data Desa...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-gray-200 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Data Umum Desa</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium bg-sky-600 text-white rounded-md shadow-sm hover:bg-sky-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
          >
            {dataDesa ? 'Edit Data Desa' : 'Input Data Desa'}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            {dataDesa ? 'Edit Data Umum Desa' : 'Input Data Umum Desa'}
          </h3>
          <DataForm
            fields={fields}
            onSubmit={handleFormSubmit}
            initialData={dataDesa} // Pass current dataDesa object for pre-filling
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          {dataDesa ? (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {fields.map(field => (
                <div key={field.name} className={`${field.type === 'textarea' || field.type === 'file' ? 'md:col-span-2' : ''} py-2`}>
                  <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                  <dd className="mt-1 text-md text-gray-900 break-words">
                    {field.type === 'file' && currentData[field.name] ? (
                      <img src={currentData[field.name] as string} alt="Logo Desa" className="h-24 w-auto object-contain rounded border border-gray-200 p-1" />
                    ) : currentData[field.name] !== undefined && currentData[field.name] !== null && String(currentData[field.name]).trim() !== '' ? (
                      String(currentData[field.name])
                    ) : (
                      <span className="italic text-gray-400">Belum diisi</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="text-center py-12">
              <svg 
                className="mx-auto h-16 w-16 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.126 0 1.131.094 1.976 1.057 1.976 2.192V7.5M12 14.25m-2.625 0a2.625 2.625 0 005.25 0m-5.25 0a2.625 2.625 0 015.25 0m-5.25 0v.008c0 .09.022.176.064.252a6.709 6.709 0 001.996 2.118M12 14.25c.094 0 .187.006.28.017a6.71 6.71 0 011.996 2.118" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.735L17.25 15h-1.045a4.125 4.125 0 010-8.25h1.045l1.125 2.265m0 0a3.003 3.003 0 010 3.705" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M5.625 12.735L6.75 15h1.045a4.125 4.125 0 000-8.25H6.75L5.625 12.735m0 0a3.003 3.003 0 000 3.705" />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">Data Desa Kosong</h3>
              <p className="mt-2 text-md text-gray-500">
                Informasi umum desa belum diinput. <br/>
                Silakan klik tombol "Input Data Desa" untuk memulai.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};