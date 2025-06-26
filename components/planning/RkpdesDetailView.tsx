import React from 'react';
import { BukuRkp, BukuApbdes, BukuRpjmdes, DataDesaEntry, BookDefinition, FieldDefinition } from '../../types';
import { DataTable } from '../DataTable';
import { downloadDoc } from '../../exportUtils'; 

interface RkpdesDetailViewProps {
  rkpdesData: BukuRkp;
  apbdesDataForRkpdes: BukuApbdes[];
  parentRpjmdesData: BukuRpjmdes | null;
  dataDesa: DataDesaEntry | null;
  onClose: () => void;
  apbdesDefinition?: BookDefinition;
}

const Section: React.FC<{ title?: string; level?: number; children: React.ReactNode; className?: string }> = ({ title, level = 2, children, className }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <section className={`mb-6 pb-4 border-b border-gray-200 last:border-b-0 ${className}`}>
      {title && <Tag className={`text-${4-level}xl font-semibold text-gray-700 mb-3`}>{title}</Tag>}
      <div className="space-y-3 prose prose-sm sm:prose-base max-w-none text-gray-700">
        {children}
      </div>
    </section>
  );
};

const DisplayField: React.FC<{ label?: string; value: any; type?: FieldDefinition['type']; className?: string }> = ({ label, value, type, className }) => {
  let displayValue: React.ReactNode;

  if (value === null || value === undefined || String(value).trim() === '') {
    displayValue = <span className="text-gray-400 italic">Belum diisi</span>;
  } else if (type === 'number' && typeof value === 'number') {
     if (label?.toLowerCase().includes("tahun")) {
        displayValue = value.toString();
    } else {
        displayValue = value.toLocaleString('id-ID');
    }
  } else if (type === 'date' && value) {
    try {
      displayValue = new Date(value).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { 
      displayValue = String(value);
    }
  } else if (type === 'textarea') {
    displayValue = String(value).split('\n').map((line, idx) => <p key={idx} className="mb-1 last:mb-0">{line || <br />}</p>);
  } else if (typeof value === 'string' || typeof value === 'number' || React.isValidElement(value)) {
    displayValue = value;
  } else {
    displayValue = String(value);
  }

  return (
    <div className={`py-1 ${className}`}>
      {label && <strong className="block text-sm font-medium text-gray-500">{label}:</strong>}
      <div className={`mt-0.5 ${label ? 'pl-1' : ''}`}>{displayValue}</div>
    </div>
  );
};

const DasarHukumRkpdesContent: React.FC<{ rkpdesData: BukuRkp; parentRpjmdesData: BukuRpjmdes | null; dataDesa: DataDesaEntry | null }> = ({ rkpdesData, parentRpjmdesData, dataDesa }) => {
    return (
        <ol style={{ listStyleType: 'decimal', paddingLeft: '2em', marginLeft:'0', textAlign: 'justify' }}>
            <li>Undang-Undang Nomor 6 Tahun 2014 tentang Desa (Lembaran Negara Republik Indonesia Tahun 2014 Nomor 7, Tambahan Lembaran Negara Republik Indonesia Nomor 5495);</li>
            <li>Peraturan Pemerintah Nomor 43 Tahun 2014 tentang Peraturan Pelaksanaan Undang-Undang Nomor 6 Tahun 2014 tentang Desa (Lembaran Negara Republik Indonesia Tahun 2014 Nomor 123, Tambahan Lembaran Negara Republik Indonesia Nomor 5539) sebagaimana telah beberapa kali diubah, terakhir dengan Peraturan Pemerintah Nomor 11 Tahun 2019;</li>
            <li>Peraturan Menteri Dalam Negeri Nomor 114 Tahun 2014 tentang Pedoman Pembangunan Desa (Berita Negara Republik Indonesia Tahun 2014 Nomor 2094);</li>
            <li>Peraturan Menteri Desa, Pembangunan Daerah Tertinggal, dan Transmigrasi Nomor 21 Tahun 2020 tentang Pedoman Umum Pembangunan Desa dan Pemberdayaan Masyarakat Desa (Berita Negara Republik Indonesia Tahun 2020 Nomor 1445);</li>
            <li>Peraturan Menteri Desa, Pembangunan Daerah Tertinggal, dan Transmigrasi tentang Prioritas Penggunaan Dana Desa Tahun Anggaran {rkpdesData.tahun_rkp} (Nomor dan Tahun Permendesa disesuaikan dengan tahun anggaran RKPDes);</li>
            {dataDesa?.nama_kabupaten_kota && (
              <li>Peraturan Daerah Kabupaten {dataDesa.nama_kabupaten_kota.toUpperCase()} tentang Pedoman Penyusunan Dokumen Perencanaan Pembangunan Desa dan/atau Penyelenggaraan Pemerintahan Desa (Nomor dan Tahun Perda disesuaikan);</li>
            )}
            {dataDesa?.nama_kabupaten_kota && (
              <li>Peraturan Bupati {dataDesa.nama_kabupaten_kota.toUpperCase()} tentang Petunjuk Teknis Penyusunan RKPDes (Nomor dan Tahun Perbup disesuaikan);</li>
            )}
            {parentRpjmdesData && (
              <li>Peraturan Desa {dataDesa?.nama_desa?.toUpperCase() || '(NAMA DESA)'} Nomor {parentRpjmdesData.nomor_perdes_rpjmdes || '(Nomor Perdes RPJMDes)'} Tahun {parentRpjmdesData.tanggal_penetapan_perdes ? new Date(parentRpjmdesData.tanggal_penetapan_perdes).getFullYear() : '(Tahun Perdes RPJMDes)'} tentang Rencana Pembangunan Jangka Menengah Desa Tahun {parentRpjmdesData.tahun_awal_periode}-{parentRpjmdesData.tahun_akhir_periode};</li>
            )}
            <li>Peraturan Desa tentang Kewenangan Desa Berdasarkan Hak Asal Usul dan Kewenangan Lokal Berskala Desa (jika ada, nomor dan tahun disesuaikan);</li>
            <li>Dokumen hasil Musyawarah Desa tentang Perencanaan Desa untuk penyusunan RKPDes Tahun {rkpdesData.tahun_rkp}.</li>
        </ol>
    );
};


export const RkpdesDetailView: React.FC<RkpdesDetailViewProps> = ({
  rkpdesData,
  apbdesDataForRkpdes,
  parentRpjmdesData,
  dataDesa,
  onClose,
  apbdesDefinition,
}) => {

  const idColumnDefinition: FieldDefinition = { name: 'id', label: 'ID', type: 'number' };
  const apbdesColumns: FieldDefinition[] = apbdesDefinition ? [idColumnDefinition, ...apbdesDefinition.fields] : [];
  
  const generateKopSuratHtml = (dataDesaParam: DataDesaEntry | null): string => {
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

  const handleExportToWord = async () => {
    const printFrame = document.getElementById('rkpdesPrintFrame');
    const dasarHukumExportContent = document.getElementById('dasarHukumRkpdesContentExport');

    if (!printFrame) {
      alert('Konten untuk export tidak ditemukan.');
      return;
    }

    let contentHtml = '';
    
    const sections = Array.from(printFrame.children);
    sections.forEach(sectionElement => {
        const sectionClone = sectionElement.cloneNode(true) as HTMLElement;
        const h2Element = sectionClone.querySelector('h2'); 
        const titleText = h2Element?.textContent || (sectionClone.querySelector('h3') || sectionClone.querySelector('h4'))?.textContent || '';
        
        if (titleText.includes("Dasar Hukum Penyusunan RKPDes") && dasarHukumExportContent) {
            const exportDasarHukumHtml = dasarHukumExportContent.innerHTML;
            const contentDiv = sectionClone.querySelector('div.prose'); 
            if(contentDiv) {
                // Replace the content of the prose div with the export-specific HTML
                // This ensures the rest of the section structure is maintained
                contentDiv.innerHTML = exportDasarHukumHtml; 
            } else {
                 // Fallback if structure is different - might need adjustment
                 sectionClone.innerHTML = `<h3 style="font-size: 1.25rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem;">${titleText}</h3>${exportDasarHukumHtml}`; 
            }
            contentHtml += sectionClone.outerHTML;
        } else {
            contentHtml += sectionClone.outerHTML;
        }
    });
    
    const kopSuratHtml = generateKopSuratHtml(dataDesa);
    
    const fullHtml = `
      <html>
        <head><meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; font-size: 10pt; }
            section, div { margin-bottom: 10px; }
            h1, h2, h3, h4, h5, h6 { margin-top: 15px; margin-bottom: 5px; text-align: justify; }
            p { margin-top: 0; margin-bottom: 5px; line-height: 1.4; text-align: justify;}
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9pt; }
            th, td { border: 1px solid #333; padding: 4px; text-align: left; vertical-align: top; }
            th { background-color: #f0f0f0; font-weight: bold; }
            ol { list-style-type: decimal; padding-left: 2em; margin-left: 0; text-align: justify;}
            li { margin-bottom: 0.25em; text-align: justify; }
            .italic { font-style: italic; }
            .text-gray-400 { color: #9ca3af; }
            .text-center { text-align: center; } 
             /* Styles from React components */
            .text-2xl { font-size: 1.5rem; line-height: 2rem; text-align: center !important; } /* Center main title */
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .font-semibold { font-weight: 600; }
            .text-gray-700 { color: #374151; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .pb-4 { padding-bottom: 1rem; }
            .border-b { border-bottom-width: 1px; }
            .border-gray-200 { border-color: #e5e7eb; }
            .last\\:border-b-0:last-child { border-bottom-width: 0px; }
            .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; margin-bottom: 0.75rem; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .mt-0\\.5 { margin-top: 0.125rem; }
            .pl-1 { padding-left: 0.25rem; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-gray-500 { color: #6b7280; }
            .font-medium { font-weight: 500; }
          </style>
        </head>
        <body>
          ${kopSuratHtml}
          ${contentHtml}
        </body>
      </html>
    `;

    try {
      downloadDoc(fullHtml, `RKPDes - ${rkpdesData.tahun_rkp} - ${dataDesa?.nama_desa || 'Desa'}.doc`);
    } catch (error) {
      console.error('Error exporting to Word:', error);
      alert('Gagal mengekspor ke Word.');
    }
  };


  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-gray-200 gap-4 no-print">
        <h1 className="text-2xl font-bold text-gray-800">Rincian Dokumen RKPDes</h1>
        <div>
           <button
            onClick={handleExportToWord}
            className="px-4 py-2 mr-2 text-sm font-medium bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition"
          >
            Export to Word
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 transition"
          >
            Kembali
          </button>
        </div>
      </div>
      
      <div id="rkpdesPrintFrame"> {/* This div's direct children will be exported */}
        <Section title={`RENCANA KERJA PEMERINTAH DESA (RKPDes) TAHUN ${rkpdesData.tahun_rkp}`} level={2} className="text-center">
            {parentRpjmdesData && (
                <p className="text-sm text-center">Mengacu pada RPJMDes Periode {parentRpjmdesData.tahun_awal_periode}-{parentRpjmdesData.tahun_akhir_periode} (No. Perdes: {parentRpjmdesData.nomor_perdes_rpjmdes || 'N/A'})</p>
            )}
        </Section>
        
        {/* Hidden div for Word export content of Dasar Hukum */}
        <div id="dasarHukumRkpdesContentExport" style={{ display: 'none' }}>
            <DasarHukumRkpdesContent rkpdesData={rkpdesData} parentRpjmdesData={parentRpjmdesData} dataDesa={dataDesa} />
        </div>

        {/* Visible Dasar Hukum on screen */}
        <Section title="Dasar Hukum Penyusunan RKPDes" level={3} className="no-print">
            <DasarHukumRkpdesContent rkpdesData={rkpdesData} parentRpjmdesData={parentRpjmdesData} dataDesa={dataDesa} />
        </Section>


        <Section title="A. Data Umum RKPDes" level={3}>
            <DisplayField label="Tahun RKPDes" value={rkpdesData.tahun_rkp} type="number"/>
            <DisplayField label="Bidang Pembangunan" value={rkpdesData.bidang_pembangunan} />
            <DisplayField label="Sub Bidang Kegiatan" value={rkpdesData.sub_bidang_kegiatan} />
            <DisplayField label="Nama Kegiatan" value={rkpdesData.kegiatan} type="textarea"/>
            <DisplayField label="Lokasi Pembangunan" value={rkpdesData.lokasi_pembangunan} />
            <DisplayField label="Prakiraan Volume" value={rkpdesData.prakiraan_volume} />
            <DisplayField label="Prakiraan Waktu Pelaksanaan" value={rkpdesData.prakiraan_waktu_pelaksanaan} />
            <DisplayField label="Sumber Dana Direncanakan" value={rkpdesData.sumber_dana_direncanakan} />
            <DisplayField label="Pola Pelaksanaan" value={rkpdesData.pola_pelaksanaan} />
            <DisplayField label="Pagu Anggaran Kegiatan (Rp)" value={rkpdesData.anggaran} type="number"/>
            <DisplayField label="Keterangan Tambahan" value={rkpdesData.keterangan} type="textarea"/>
        </Section>

        <Section title="B. Rincian Anggaran Pendapatan dan Belanja Desa (APBDes) Terkait" level={3}>
          {apbdesDataForRkpdes.length > 0 && apbdesDefinition ? (
            <DataTable columns={apbdesColumns} data={apbdesDataForRkpdes} />
          ) : (
            <p className="text-gray-500">Belum ada data APBDes yang terkait dengan RKPDes ini.</p>
          )}
        </Section>
      </div>
    </div>
  );
};