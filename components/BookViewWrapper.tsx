import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx'; // Import xlsx
import { BookDefinition, GenericEntry, FieldDefinition, DataDesaEntry, BukuIndukPenduduk } from '../types';
import { DataTable } from './DataTable';
import { DataForm } from './DataForm';
import { printTable, exportToXLSX } from '../exportUtils';

interface BookViewWrapperProps {
  bookDefinition: BookDefinition;
  initialData: GenericEntry[];
  onAddEntry: (newEntryData: Omit<GenericEntry, 'id'>) => Promise<void>;
  onUpdateEntry: (updatedEntryData: GenericEntry) => Promise<void>;
  onDeleteEntry: (id: number) => Promise<void>;
  onAddMultipleEntries: (newEntriesData: Omit<GenericEntry, 'id'>[]) => Promise<void>; // New prop
  dataDesa: DataDesaEntry | null;
}

// Helper to format date to YYYY-MM-DD
function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export const BookViewWrapper: React.FC<BookViewWrapperProps> = ({ 
  bookDefinition, 
  initialData, 
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onAddMultipleEntries, // Destructure new prop
  dataDesa
}) => {
  const [data, setData] = useState<GenericEntry[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GenericEntry | null>(null);
  const [isLoadingImport, setIsLoadingImport] = useState(false); // Loading state for import

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleFormSubmit = async (formData: GenericEntry | Omit<GenericEntry, 'id'>) => {
    if (editingEntry && 'id' in formData) {
      await onUpdateEntry(formData as GenericEntry);
    } else {
      await onAddEntry(formData as Omit<GenericEntry, 'id'>);
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus entri ini?')) {
      await onDeleteEntry(id);
    }
  };

  const handleEditClick = (entry: GenericEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const toggleForm = () => {
    if (showForm && editingEntry) {
      setEditingEntry(null);
    }
    setShowForm(!showForm);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoadingImport(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, raw: false, defval: null });

        if (jsonData.length < 2) {
          alert("File Excel kosong atau hanya berisi header.");
          setIsLoadingImport(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        const excelHeadersRaw = (jsonData[0] as string[] || []);
        const excelHeaders = excelHeadersRaw.map(h => h?.toString().trim().toLowerCase() || '');
        
        const fieldMap: Record<string, string> = {}; // excelHeaderLowercase -> field.name
        const mappedFieldNames = new Set<string>();

        // Map Excel headers to field definitions
        bookDefinition.fields.forEach(field => {
          const fieldLabelLower = field.label.toLowerCase();
          const fieldNameLower = field.name.toLowerCase();
          
          const excelHeaderIndex = excelHeaders.findIndex(eh => eh === fieldLabelLower || eh === fieldNameLower);

          if (excelHeaderIndex !== -1 && !mappedFieldNames.has(field.name)) {
             // Use the actual Excel header found (lowercase) as key
            fieldMap[excelHeaders[excelHeaderIndex]] = field.name;
            mappedFieldNames.add(field.name);
          }
        });
        
        const newEntries: Omit<BukuIndukPenduduk, 'id'>[] = [];
        const importErrors: string[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const rowData = jsonData[i] as any[];
          if (!rowData || rowData.every(cell => cell === null || cell === '')) continue; // Skip entirely empty rows

          const entry: Partial<BukuIndukPenduduk> = {};
          let rowHasCriticalError = false;

          bookDefinition.fields.forEach(fieldDef => {
            // Find which excel header was mapped to this fieldDef.name
            const excelHeaderKey = Object.keys(fieldMap).find(key => fieldMap[key] === fieldDef.name);
            let value: any = null;

            if (excelHeaderKey) {
                const excelColIndex = excelHeaders.indexOf(excelHeaderKey);
                if (excelColIndex !== -1) {
                    value = rowData[excelColIndex];
                }
            }

            // Type conversion and validation
            if (fieldDef.type === 'date') {
              if (value instanceof Date) {
                entry[fieldDef.name as keyof BukuIndukPenduduk] = formatDateToYYYYMMDD(value);
              } else if (typeof value === 'string' && value.trim()) {
                // Try to parse if string, e.g. "YYYY-MM-DD" or "DD/MM/YYYY"
                // This part can be complex, for now assume YYYY-MM-DD or rely on cellDates:true
                entry[fieldDef.name as keyof BukuIndukPenduduk] = value.trim();
              } else if (typeof value === 'number') { // Excel date serial number
                entry[fieldDef.name as keyof BukuIndukPenduduk] = formatDateToYYYYMMDD(XLSX.SSF.parse_date_code(value));
              }
            } else if (fieldDef.type === 'number') {
              if (value !== null && value !== undefined && value !== '') {
                const num = parseFloat(value);
                if (!isNaN(num)) {
                  entry[fieldDef.name as keyof BukuIndukPenduduk] = num;
                } else {
                   importErrors.push(`Baris ${i + 1}, Kolom "${fieldDef.label}": Nilai "${value}" bukan angka valid.`);
                }
              }
            } else { // text, textarea, select
              entry[fieldDef.name as keyof BukuIndukPenduduk] = value?.toString().trim() || '';
            }

            if (fieldDef.required && (entry[fieldDef.name as keyof BukuIndukPenduduk] === undefined || entry[fieldDef.name as keyof BukuIndukPenduduk] === null || entry[fieldDef.name as keyof BukuIndukPenduduk] === '')) {
              importErrors.push(`Baris ${i + 1}: Kolom wajib "${fieldDef.label}" kosong.`);
              rowHasCriticalError = true;
            }
          });

          if (!rowHasCriticalError && Object.keys(entry).length > 0) {
            newEntries.push(entry as Omit<BukuIndukPenduduk, 'id'>);
          }
        }

        if (importErrors.length > 0) {
          alert(`Peringatan saat import:\n${importErrors.slice(0,10).join("\n")}${importErrors.length > 10 ? `\n...dan ${importErrors.length-10} kesalahan lainnya.` : ''}`);
        }

        if (newEntries.length > 0) {
          await onAddMultipleEntries(newEntries);
          alert(`${newEntries.length} entri berhasil diimpor.`);
        } else if (importErrors.length === 0) {
          alert("Tidak ada entri baru yang valid untuk diimpor dari file.");
        }

      } catch (error) {
        console.error("Error importing file:", error);
        alert(`Terjadi kesalahan saat mengimpor file: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoadingImport(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };


  const tableColumns: FieldDefinition[] = [
    { name: 'id', label: 'ID', type: 'number' },
    ...bookDefinition.fields,
  ];

  const handlePrint = () => {
    if (data.length === 0) {
      alert("Tidak ada data untuk dicetak.");
      return;
    }
    printTable(bookDefinition.label, tableColumns, data, dataDesa); 
  };

  const handleExport = () => {
    if (data.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    exportToXLSX(bookDefinition.label, tableColumns, data);
  };

  return (
    <div className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-gray-200 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">{bookDefinition.label}</h2>
        <div className="flex flex-wrap items-center space-x-2 gap-y-2">
          <button
            onClick={handlePrint}
            disabled={data.length === 0 || isLoadingImport}
            className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50"
          >
            Cetak
          </button>
          <button
            onClick={handleExport}
            disabled={data.length === 0 || isLoadingImport}
            className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 disabled:opacity-50"
          >
            Export XLS
          </button>
          {bookDefinition.key === 'buku_induk_penduduk' && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelected} 
                accept=".xlsx, .xls" 
                style={{ display: 'none' }} 
                disabled={isLoadingImport}
              />
              <button
                onClick={handleImportClick}
                disabled={isLoadingImport}
                className="px-4 py-2 text-sm font-medium bg-purple-500 text-white rounded-md shadow-sm hover:bg-purple-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 disabled:opacity-50"
              >
                {isLoadingImport ? 'Mengimpor...' : 'Import XLS'}
              </button>
            </>
          )}
          <button
            onClick={toggleForm}
            disabled={isLoadingImport}
            className="px-4 py-2 text-sm font-medium bg-sky-600 text-white rounded-md shadow-sm hover:bg-sky-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {showForm ? (editingEntry ? 'Batal Edit' : 'Batal Tambah') : 'Tambah Entri Baru'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            {editingEntry ? `Edit Entri: ${bookDefinition.label}` : `Tambah Entri Baru: ${bookDefinition.label}`}
          </h3>
          <DataForm
            fields={bookDefinition.fields}
            onSubmit={handleFormSubmit}
            initialData={editingEntry}
            onCancel={() => { setShowForm(false); setEditingEntry(null); }}
          />
        </div>
      )}
      
      {isLoadingImport && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-purple-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">Sedang mengimpor data...</p>
        </div>
      )}


      <DataTable columns={tableColumns} data={data} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      {data.length === 0 && !showForm && !isLoadingImport && (
        <div className="text-center py-12">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Data Kosong</h3>
          <p className="mt-2 text-md text-gray-500">
            Belum ada data untuk buku administrasi ini. <br/>
            Silakan klik tombol "Tambah Entri Baru" atau "Import XLS" (jika tersedia) untuk memulai.
          </p>
        </div>
      )}
    </div>
  );
};