import React, { useState, useMemo, useCallback } from 'react';
import { AllDataBooks, GenericEntry, BookDefinition, BukuRpjmdes, BukuRkp, BukuApbdes, FieldDefinition, DataDesaEntry } from '../../types';
import { DataTable } from '../DataTable';
import { DataForm } from '../DataForm';
import { printTable, exportToXLSX, downloadDoc } from '../../exportUtils';
import { RpjmdesDetailView } from './RpjmdesDetailView';
import { RkpdesDetailView } from './RkpdesDetailView'; 
import { statusRpjmdesOptions } from '../../constants'; // Import status options if needed for display mapping (not directly by DataTable but good for context)

interface PlanningViewProps {
  allData: AllDataBooks;
  menuItems: BookDefinition[];
  onAddEntry: (bookKey: keyof AllDataBooks, entryData: Omit<GenericEntry, 'id'>) => Promise<void>;
  onUpdateEntry: (bookKey: keyof AllDataBooks, entryData: GenericEntry) => Promise<void>;
  onDeleteEntry: (bookKey: keyof AllDataBooks, id: number) => Promise<void>;
  getBookData: (bookKey: keyof AllDataBooks) => GenericEntry[];
  getBookDefinition: (bookKey: string) => BookDefinition | undefined;
  dataDesa: DataDesaEntry | null;
}

type FormType = 'rpjmdes' | 'rkpdes' | 'apbdes' | null;
type DetailViewType = 'rpjmdes' | 'rkpdes';

interface DetailViewTarget {
  type: DetailViewType;
  data: GenericEntry;
}

export const PlanningView: React.FC<PlanningViewProps> = ({ 
  allData, 
  menuItems, 
  onAddEntry, 
  onUpdateEntry, 
  onDeleteEntry, 
  getBookData,
  getBookDefinition,
  dataDesa
}) => {
  const [selectedRpjmdesId, setSelectedRpjmdesId] = useState<number | null>(null);
  const [selectedRkpdesId, setSelectedRkpdesId] = useState<number | null>(null);

  const [editingEntry, setEditingEntry] = useState<GenericEntry | null>(null);
  const [currentForm, setCurrentForm] = useState<FormType>(null);
  const [detailViewTarget, setDetailViewTarget] = useState<DetailViewTarget | null>(null);

  const rpjmdesDefinition = useMemo(() => getBookDefinition('buku_rpjmdes'), [getBookDefinition]);
  const rkpdesDefinition = useMemo(() => getBookDefinition('buku_rkp'), [getBookDefinition]);
  const apbdesDefinition = useMemo(() => getBookDefinition('buku_apbdes'), [getBookDefinition]);

  const rpjmdesList = useMemo(() => (getBookData('buku_rpjmdes') as BukuRpjmdes[]) || [], [getBookData]);
  
  const rkpdesListForSelectedRpjmdes = useMemo(() => {
    const currentViewIsRpjmdesDetail = detailViewTarget?.type === 'rpjmdes';
    const contextRpjmId = currentViewIsRpjmdesDetail ? detailViewTarget.data.id : selectedRpjmdesId;

    if (!contextRpjmId) return [];
    return (getBookData('buku_rkp') as BukuRkp[]).filter(rkp => rkp.id_rpjmdes_induk === contextRpjmId) || [];
  }, [selectedRpjmdesId, getBookData, detailViewTarget]);


  const apbdesListForSelectedRkpdes = useMemo(() => {
    const currentViewIsRkpdesDetail = detailViewTarget?.type === 'rkpdes';
    const contextRkpId = currentViewIsRkpdesDetail ? detailViewTarget.data.id : selectedRkpdesId;
    if (!contextRkpId) return [];
    return (getBookData('buku_apbdes') as BukuApbdes[]).filter(apb => apb.id_rkp_induk === contextRkpId) || [];
  }, [selectedRkpdesId, getBookData, detailViewTarget]);

  const handleFormSubmitCallback = async (formData: GenericEntry | Omit<GenericEntry, 'id'>) => {
    if (!currentForm) return;
    setDetailViewTarget(null); 

    let bookKey: keyof AllDataBooks;
    let entryData = { ...formData }; 

    if (currentForm === 'rpjmdes') bookKey = 'buku_rpjmdes';
    else if (currentForm === 'rkpdes') {
      bookKey = 'buku_rkp';
      if (!editingEntry && selectedRpjmdesId) (entryData as BukuRkp).id_rpjmdes_induk = selectedRpjmdesId;
    } else if (currentForm === 'apbdes') {
      bookKey = 'buku_apbdes';
      if (!editingEntry && selectedRkpdesId) (entryData as BukuApbdes).id_rkp_induk = selectedRkpdesId;
    } else return;

    if (editingEntry && 'id' in entryData) {
      await onUpdateEntry(bookKey, entryData as GenericEntry);
    } else {
      await onAddEntry(bookKey, entryData as Omit<GenericEntry, 'id'>);
    }
    
    setCurrentForm(null);
    setEditingEntry(null);
  };
  
  const handleDeleteCallback = async (bookKey: keyof AllDataBooks, id: number) => {
    await onDeleteEntry(bookKey, id);
    if (bookKey === 'buku_rpjmdes' && (selectedRpjmdesId === id || detailViewTarget?.data.id === id)) {
        setSelectedRpjmdesId(null);
        setSelectedRkpdesId(null); 
        if (detailViewTarget?.type === 'rpjmdes' && detailViewTarget.data.id === id) {
            setDetailViewTarget(null);
        }
    }
    if (bookKey === 'buku_rkp' && (selectedRkpdesId === id || detailViewTarget?.data.id === id)) {
        setSelectedRkpdesId(null);
        if (detailViewTarget?.type === 'rkpdes' && detailViewTarget.data.id === id) {
            setDetailViewTarget(null);
        }
    }
  };

  const openForm = (formType: FormType, entryToEdit: GenericEntry | null = null) => {
    setEditingEntry(entryToEdit);
    setCurrentForm(formType);
    setDetailViewTarget(null); 
  };

  const openDetailView = (type: DetailViewType, data: GenericEntry) => {
    setDetailViewTarget({ type, data });
    setCurrentForm(null); 
    if (type === 'rpjmdes') {
        setSelectedRpjmdesId(data.id); 
        setSelectedRkpdesId(null); 
    } else if (type === 'rkpdes') {
        setSelectedRkpdesId(data.id); 
        const rkpItem = data as BukuRkp;
        if (rkpItem.id_rpjmdes_induk && rkpItem.id_rpjmdes_induk !== selectedRpjmdesId) {
             setSelectedRpjmdesId(rkpItem.id_rpjmdes_induk);
        }
    }
  };
  
  const rpjmdesSummaryColumns: FieldDefinition[] = [
    { name: 'id', label: 'ID', type: 'number' },
    { name: 'tahun_awal_periode', label: 'Thn Awal', type: 'number' },
    { name: 'tahun_akhir_periode', label: 'Thn Akhir', type: 'number' },
    { name: 'nomor_perdes_rpjmdes', label: 'No. Perdes', type: 'text' },
    { name: 'tanggal_penetapan_perdes', label: 'Tgl Penetapan', type: 'date' },
    { name: 'status_rpjmdes', label: 'Status', type: 'select', options: statusRpjmdesOptions },
    { name: 'keterangan', label: 'Keterangan Umum', type: 'textarea' },
  ];

  const rkpdesSummaryColumns: FieldDefinition[] = [
    { name: 'id', label: 'ID', type: 'number' },
    { name: 'tahun_rkp', label: 'Thn RKP', type: 'number' },
    { name: 'bidang_pembangunan', label: 'Tema/Bidang Utama', type: 'textarea' },
    { name: 'sub_bidang_kegiatan', label: 'Sub Tema/Fokus', type: 'textarea' },
    { name: 'anggaran', label: 'Total Anggaran (Rp)', type: 'number' },
    { name: 'keterangan', label: 'Keterangan Umum', type: 'textarea' },
  ];

  const apbdesAllColumns: FieldDefinition[] = apbdesDefinition 
    ? [{ name: 'id', label: 'ID', type: 'number' }, ...apbdesDefinition.fields]
    : [];


  const handlePrintData = (title: string, columns: FieldDefinition[], dataToPrint?: GenericEntry[]) => {
    if (!columns || columns.length === 0 || !dataToPrint || dataToPrint.length === 0) {
      alert("Tidak ada data untuk dicetak atau definisi kolom tidak tersedia.");
      return;
    }
    printTable(title, columns, dataToPrint, dataDesa);
  };

  const handleExportData = (fileName: string, columns: FieldDefinition[], dataToExport?: GenericEntry[]) => {
     if (!columns || columns.length === 0 || !dataToExport || dataToExport.length === 0) {
      alert("Tidak ada data untuk diekspor atau definisi kolom tidak tersedia.");
      return;
    }
    exportToXLSX(fileName, columns, dataToExport);
  };

  const handleExportApbdesTableToWord = async () => {
    if (!selectedRkpdesId || !apbdesDefinition || apbdesListForSelectedRkpdes.length === 0) {
      alert("Tidak ada data APBDes untuk diekspor atau definisi tidak termuat.");
      return;
    }
    const generateKopSuratHtmlForExport = (dataDesaParam: DataDesaEntry | null): string => {
      if (!dataDesaParam) return '';
      return `
        <div style="display: flex; align-items: flex-start; margin-bottom: 10px; padding-bottom: 10px; width: 100%; font-family: Arial, sans-serif; border-bottom: 3px solid black;">
          <div style="flex: 0 0 80px; margin-right: 15px; display: flex; align-items: center; justify-content: center; height: 80px;">
            ${dataDesaParam.logo_desa_path ? `<img src="${dataDesaParam.logo_desa_path}" alt="Logo Desa" style="max-width: 70px; max-height: 70px; object-fit: contain;">` : '<div style="width: 70px; height: 70px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #777;">Logo</div>'}
          </div>
          <div style="flex-grow: 1; text-align: center;">
            <div style="font-weight: bold; margin: 0; line-height: 1.2; font-size: 14pt;">PEMERINTAH KABUPATEN ${dataDesaParam.nama_kabupaten_kota?.toUpperCase() || ''}</div>
            <div style="font-weight: bold; margin: 0; line-height: 1.2; font-size: 16pt;">KECAMATAN ${dataDesaParam.nama_kecamatan?.toUpperCase() || ''}</div>
            <div style="font-weight: bold; margin: 0; line-height: 1.2; font-size: 18pt; margin-bottom: 2px;">PEMERINTAH DESA ${dataDesaParam.nama_desa?.toUpperCase() || ''}</div>
            <div style="font-size: 9pt; margin-top: 2px; line-height: 1.1;">${dataDesaParam.alamat_kantor_desa || ''}</div>
            <div style="font-size: 9pt; margin-top: 2px; line-height: 1.1;">
              ${dataDesaParam.nomor_telepon_kantor_desa ? `<span>Telp: ${dataDesaParam.nomor_telepon_kantor_desa}</span>` : ''}
              ${dataDesaParam.email_desa ? `<span style="margin-left: 10px;">Email: ${dataDesaParam.email_desa}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    };
    
    const generateApbdesTableForExportHtml = (columnsForExport: FieldDefinition[], data: BukuApbdes[]): string => {
        const headers = columnsForExport.map(col => `<th>${col.label}</th>`).join('');
        const rows = data.map(entry => {
            const cells = columnsForExport.map(col => {
            let cellValue = entry[col.name as keyof BukuApbdes];
            if (col.name === 'tahun_apbdes' && typeof cellValue === 'number') { // Ensure this applies to tahun_apbdes
                cellValue = cellValue.toString();
            } else if (col.type === 'number' && typeof cellValue === 'number') {
                cellValue = cellValue.toLocaleString('id-ID');
            }
            return `<td>${cellValue !== null && cellValue !== undefined ? cellValue : '-'}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    };


    const title = `Data APBDes (Untuk RKPDes ID: ${selectedRkpdesId})`;
    const tableHtml = generateApbdesTableForExportHtml(apbdesAllColumns, apbdesListForSelectedRkpdes);
    const kopSuratHtml = generateKopSuratHtmlForExport(dataDesa);
    
    const fullHtmlString = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; font-size: 10pt; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: auto;}
            th, td { border: 1px solid #333; padding: 4px; text-align: left; word-wrap: break-word; font-size: 9pt; }
            th { background-color: #f0f0f0; font-weight: bold; }
            .doc-title { font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 0; text-align: center; margin-bottom: 10px;}
          </style>
        </head>
        <body>
          ${kopSuratHtml}
          <div class="doc-title">${title}</div>
          ${tableHtml}
        </body>
      </html>
    `;

    try {
      downloadDoc(fullHtmlString, `APBDes_RKPDes_${selectedRkpdesId}_${dataDesa?.nama_desa || 'Desa'}.doc`);
    } catch (error) {
      console.error('Error exporting APBDes table to Word:', error);
      alert('Gagal mengekspor tabel APBDes ke Word.');
    }
  };

  const rpjmdesTableActions = [
    {
      label: 'Rincian',
      onClick: (entry: GenericEntry) => openDetailView('rpjmdes', entry),
      className: "text-green-600 hover:text-green-800 transition font-medium",
      ariaLabel: (entry: GenericEntry) => `Lihat Rincian RPJMDes ID ${entry.id}`
    },
    {
      label: 'Edit',
      onClick: (entry: GenericEntry) => openForm('rpjmdes', entry),
      className: "text-sky-600 hover:text-sky-800 transition font-medium",
      ariaLabel: (entry: GenericEntry) => `Edit RPJMDes ID ${entry.id}`
    },
    {
      label: 'Hapus',
      onClick: (entry: GenericEntry) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus RPJMDes ini beserta RKPDes dan APBDes terkait?')) {
          handleDeleteCallback('buku_rpjmdes', entry.id);
        }
      },
      className: "text-red-600 hover:text-red-800 transition font-medium",
      ariaLabel: (entry: GenericEntry) => `Hapus RPJMDes ID ${entry.id}`
    }
  ];

  const rkpdesTableActions = [
    {
      label: 'Rincian',
      onClick: (entry: GenericEntry) => openDetailView('rkpdes', entry as BukuRkp),
      className: "text-green-600 hover:text-green-800 transition font-medium",
      ariaLabel: (entry: GenericEntry) => `Lihat Rincian RKPDes ID ${entry.id}`
    },
    {
      label: 'Edit',
      onClick: (entry: GenericEntry) => openForm('rkpdes', entry),
      className: "text-sky-600 hover:text-sky-800 transition font-medium",
      ariaLabel: (entry: GenericEntry) => `Edit RKPDes ID ${entry.id}`
    },
    {
      label: 'Hapus',
      onClick: (entry: GenericEntry) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus RKPDes ini beserta APBDes terkait?')) {
          handleDeleteCallback('buku_rkp', entry.id);
        }
      },
      className: "text-red-600 hover:text-red-800 transition font-medium",
      ariaLabel: (entry: GenericEntry) => `Hapus RKPDes ID ${entry.id}`
    }
  ];


  if (detailViewTarget?.type === 'rpjmdes' && rpjmdesDefinition) {
    return (
      <RpjmdesDetailView
        rpjmdesData={detailViewTarget.data as BukuRpjmdes}
        rkpDataForRpjmdes={rkpdesListForSelectedRpjmdes}
        dataDesa={dataDesa}
        allData={allData}
        onClose={() => setDetailViewTarget(null)}
        rkpdesDefinition={rkpdesDefinition} 
      />
    );
  }

  if (detailViewTarget?.type === 'rkpdes' && rkpdesDefinition && apbdesDefinition) {
    const rkpData = detailViewTarget.data as BukuRkp;
    const parentRpjm = rpjmdesList.find(rpjm => rpjm.id === rkpData.id_rpjmdes_induk) || null;
    return (
      <RkpdesDetailView
        rkpdesData={rkpData}
        apbdesDataForRkpdes={apbdesListForSelectedRkpdes}
        parentRpjmdesData={parentRpjm}
        dataDesa={dataDesa}
        onClose={() => setDetailViewTarget(null)}
        apbdesDefinition={apbdesDefinition}
      />
    );
  }

  const renderForm = () => {
    if (!currentForm) return null;
    let definition: BookDefinition | undefined;
    let title = "";
    let parentInfo = "";

    if (currentForm === 'rpjmdes') {
      definition = rpjmdesDefinition;
      title = editingEntry ? "Edit Dokumen RPJMDes" : "Tambah Dokumen RPJMDes Baru";
    } else if (currentForm === 'rkpdes') {
      definition = rkpdesDefinition;
      title = editingEntry ? "Edit Dokumen RKPDes" : "Tambah Dokumen RKPDes Baru";
      const currentRpjmdesId = editingEntry?.id_rpjmdes_induk || selectedRpjmdesId;
      if (!currentRpjmdesId) {
        return <p className="text-red-600 p-4 bg-red-50 rounded-md">Pilih atau simpan RPJMDes terlebih dahulu untuk menambah RKPDes.</p>;
      }
      parentInfo = `Untuk RPJMDes ID: ${currentRpjmdesId}`;
    } else if (currentForm === 'apbdes') {
      definition = apbdesDefinition;
      title = editingEntry ? "Edit Entri APBDes" : "Tambah Entri APBDes Baru";
      const currentRkpdesId = editingEntry?.id_rkp_induk || selectedRkpdesId;
      if (!currentRkpdesId) {
         return <p className="text-red-600 p-4 bg-red-50 rounded-md">Pilih atau simpan RKPDes terlebih dahulu untuk menambah APBDes.</p>;
      }
      parentInfo = `Untuk RKPDes ID: ${currentRkpdesId}`;
    }

    if (!definition) return <p className="text-red-500 p-4 bg-red-50 rounded-md">Definisi buku tidak ditemukan.</p>;

    let formInitialData = editingEntry;
    if (!editingEntry) { 
        if (currentForm === 'rkpdes' && selectedRpjmdesId) {
            formInitialData = { ...formInitialData, id_rpjmdes_induk: selectedRpjmdesId } as GenericEntry;
        } else if (currentForm === 'apbdes' && selectedRkpdesId) {
            formInitialData = { ...formInitialData, id_rkp_induk: selectedRkpdesId } as GenericEntry;
        }
    }

    return (
      <div className="my-8 p-6 bg-gray-50 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-1">{title}</h3>
        {parentInfo && <p className="text-sm text-gray-500 mb-4">{parentInfo}</p>}
        <DataForm
          fields={definition.fields}
          onSubmit={handleFormSubmitCallback}
          initialData={formInitialData}
          onCancel={() => { setCurrentForm(null); setEditingEntry(null); }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 mb-2">
        <h1 className="text-3xl font-bold text-gray-800">Perencanaan Desa Terpadu</h1>
        <p className="mt-1 text-md text-gray-600">Kelola dokumen RPJMDes, RKPDes, dan APBDes secara berjenjang.</p>
      </div>
      
      {renderForm()}

      {/* RPJMDes Section */}
      <section className="p-6 bg-white rounded-xl shadow-lg">
        <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b border-gray-200 gap-2">
          <h2 className="text-2xl font-semibold text-gray-700">Dokumen RPJMDes <span className="text-gray-500 font-normal">({rpjmdesList.length})</span></h2>
          <div className="flex flex-wrap items-center space-x-2 gap-y-2">
            <button onClick={() => handlePrintData('Data RPJMDes', rpjmdesSummaryColumns, rpjmdesList)} disabled={rpjmdesList.length === 0} className="px-3 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 shadow-sm">Cetak Tabel</button>
            <button onClick={() => handleExportData('RPJMDes', rpjmdesSummaryColumns, rpjmdesList)} disabled={rpjmdesList.length === 0} className="px-3 py-2 text-sm font-medium bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 shadow-sm">Export XLS</button>
            <button onClick={() => openForm('rpjmdes')} className="px-3 py-2 text-sm font-medium bg-sky-600 text-white rounded-md hover:bg-sky-700 shadow-sm">Tambah RPJMDes</button>
          </div>
        </div>
        {rpjmdesDefinition ? (
          <DataTable
            columns={rpjmdesSummaryColumns}
            data={rpjmdesList}
            customActions={rpjmdesTableActions}
          />
        ) : <p className="text-gray-500">Definisi RPJMDes tidak termuat.</p>}
        {rpjmdesList.length > 0 && !detailViewTarget && (
            <div className="mt-6">
            <label htmlFor="select-rpjmdes" className="block text-sm font-medium text-gray-700 mb-1">Pilih RPJMDes untuk melihat RKPDes terkait:</label>
            <select
                id="select-rpjmdes"
                value={selectedRpjmdesId || ''}
                onChange={(e) => { setSelectedRpjmdesId(Number(e.target.value) || null); setSelectedRkpdesId(null); }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm"
            >
                <option value="">-- Semua RPJMDes --</option>
                {rpjmdesList.map(rpjm => (
                <option key={rpjm.id} value={rpjm.id}>
                    ID: {rpjm.id} (Periode {rpjm.tahun_awal_periode}-{rpjm.tahun_akhir_periode}) No. {rpjm.nomor_perdes_rpjmdes || 'N/A'}
                </option>
                ))}
            </select>
            </div>
        )}
      </section>

      {selectedRpjmdesId && !detailViewTarget && rpjmdesDefinition && (
        <section className="p-6 bg-white rounded-xl shadow-lg">
          <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b border-gray-200 gap-2">
            <h2 className="text-2xl font-semibold text-gray-700">Dokumen RKPDes <span className="text-gray-500 font-normal">(RPJMDes ID: {selectedRpjmdesId}, Total: {rkpdesListForSelectedRpjmdes.length})</span></h2>
            <div className="flex flex-wrap items-center space-x-2 gap-y-2">
              <button onClick={() => handlePrintData(`RKPDes (RPJMDes ID ${selectedRpjmdesId})`, rkpdesSummaryColumns, rkpdesListForSelectedRpjmdes)} disabled={rkpdesListForSelectedRpjmdes.length === 0} className="px-3 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 shadow-sm">Cetak Tabel</button>
              <button onClick={() => handleExportData(`RKPDes_RPJMDes_${selectedRpjmdesId}`, rkpdesSummaryColumns, rkpdesListForSelectedRpjmdes)} disabled={rkpdesListForSelectedRpjmdes.length === 0} className="px-3 py-2 text-sm font-medium bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 shadow-sm">Export XLS</button>
              <button onClick={() => openForm('rkpdes')} className="px-3 py-2 text-sm font-medium bg-sky-600 text-white rounded-md hover:bg-sky-700 shadow-sm">Tambah RKPDes</button>
            </div>
          </div>
          {rkpdesDefinition ? (
            <DataTable
              columns={rkpdesSummaryColumns}
              data={rkpdesListForSelectedRpjmdes}
              customActions={rkpdesTableActions} 
            />
          ) : <p className="text-gray-500">Definisi RKPDes tidak termuat.</p>}
          {rkpdesListForSelectedRpjmdes.length > 0 && !detailViewTarget && (
            <div className="mt-6">
              <label htmlFor="select-rkpdes" className="block text-sm font-medium text-gray-700 mb-1">Pilih RKPDes untuk melihat APBDes terkait:</label>
              <select
                id="select-rkpdes"
                value={selectedRkpdesId || ''}
                onChange={(e) => setSelectedRkpdesId(Number(e.target.value) || null)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm"
              >
                <option value="">-- Semua RKPDes untuk RPJMDes ID: {selectedRpjmdesId} --</option>
                {rkpdesListForSelectedRpjmdes.map(rkp => (
                  <option key={rkp.id} value={rkp.id}>
                    ID: {rkp.id} (Tahun {rkp.tahun_rkp}) - {rkp.bidang_pembangunan.substring(0,50) || rkp.sub_bidang_kegiatan?.substring(0,50) || 'Tanpa Judul'}...
                  </option>
                ))}
              </select>
            </div>
          )}
           {rkpdesListForSelectedRpjmdes.length === 0 && !currentForm && selectedRpjmdesId && (
                <p className="text-center text-gray-500 py-6">Belum ada RKPDes untuk RPJMDes yang dipilih. Silakan tambahkan.</p>
            )}
        </section>
      )}

      {selectedRkpdesId && !detailViewTarget && rkpdesDefinition && apbdesDefinition && ( 
        <section className="p-6 bg-white rounded-xl shadow-lg">
          <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b border-gray-200 gap-2">
            <h2 className="text-2xl font-semibold text-gray-700">Entri APBDes <span className="text-gray-500 font-normal">(RKPDes ID: {selectedRkpdesId}, Total: {apbdesListForSelectedRkpdes.length})</span></h2>
            <div className="flex flex-wrap items-center space-x-2 gap-y-2">
              <button onClick={() => handlePrintData(`APBDes (RKPDes ID ${selectedRkpdesId})`, apbdesAllColumns, apbdesListForSelectedRkpdes)} disabled={apbdesListForSelectedRkpdes.length === 0} className="px-3 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 shadow-sm">Cetak Tabel</button>
              <button onClick={() => handleExportData(`APBDes_RKPDes_${selectedRkpdesId}`, apbdesAllColumns, apbdesListForSelectedRkpdes)} disabled={apbdesListForSelectedRkpdes.length === 0} className="px-3 py-2 text-sm font-medium bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 shadow-sm">Export XLS</button>
              <button onClick={handleExportApbdesTableToWord} disabled={apbdesListForSelectedRkpdes.length === 0} className="px-3 py-2 text-sm font-medium bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 shadow-sm">Export Word</button>
              <button onClick={() => openForm('apbdes')} className="px-3 py-2 text-sm font-medium bg-sky-600 text-white rounded-md hover:bg-sky-700 shadow-sm">Tambah APBDes</button>
            </div>
          </div>
          <DataTable
            columns={apbdesAllColumns}
            data={apbdesListForSelectedRkpdes}
            onEdit={(entry) => openForm('apbdes', entry)} 
            onDelete={(id) => {
                if(window.confirm('Apakah Anda yakin ingin menghapus entri APBDes ini?')) {
                    handleDeleteCallback('buku_apbdes', id);
                }
            }}
          />
           {apbdesListForSelectedRkpdes.length === 0 && !currentForm && selectedRkpdesId && (
                <p className="text-center text-gray-500 py-6">Belum ada APBDes untuk RKPDes yang dipilih. Silakan tambahkan.</p>
            )}
        </section>
      )}

      {!selectedRpjmdesId && !currentForm && !detailViewTarget && (
        <div className="text-center py-12">
           <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 21h16.5M16.5 3.75h.008v.008H16.5V3.75zM12 3.75h.008v.008H12V3.75zM7.5 3.75h.008v.008H7.5V3.75z" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Mulai Perencanaan Desa</h3>
          <p className="mt-2 text-md text-gray-500">
            Pilih atau tambah Dokumen RPJMDes untuk memulai pengelolaan alur perencanaan <br/>
            dari RPJMDes ke RKPDes, hingga ke APBDes. Atau klik "Rincian" pada salah satu RPJMDes/RKPDes untuk melihat detailnya.
          </p>
        </div>
      )}
    </div>
  );
};