import React from 'react';
import { BukuRpjmdes, BukuRkp, DataDesaEntry, BookDefinition, FieldDefinition, BukuAparat, GenericEntry } from '../../types';
import { DataTable } from '../DataTable';
import { downloadDoc } from '../../exportUtils'; 

interface RpjmdesDetailViewProps {
  rpjmdesData: BukuRpjmdes;
  rkpDataForRpjmdes: BukuRkp[];
  dataDesa: DataDesaEntry | null;
  allData: AllDataBooks; // Added to access buku_aparat
  onClose: () => void;
  rkpdesDefinition?: BookDefinition; // For RKPDes table columns
}

interface AllDataBooks { // Simplified for this component's needs
  buku_aparat?: BukuAparat[];
  [key: string]: GenericEntry[] | undefined;
}


const Section: React.FC<{ title?: string; level?: number; children: React.ReactNode; className?: string; id?: string }> = ({ title, level = 2, children, className, id }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <section id={id} className={`mb-6 pb-4 border-b border-gray-200 last:border-b-0 ${className}`}>
      {title && <Tag className={`text-${4-level}xl font-semibold text-gray-700 mb-3`}>{title}</Tag>}
      <div className="space-y-3 prose prose-sm sm:prose-base max-w-none text-gray-700">
        {children}
      </div>
    </section>
  );
};

const SubSection: React.FC<{ title: string; children: React.ReactNode; id?: string }> = ({ title, children, id }) => {
  return (
    <div id={id} className="mb-4">
      <h4 className="text-lg font-medium text-gray-600 mb-2">{title}</h4>
      {children}
    </div>
  );
};

const DisplayField: React.FC<{ label?: string; value: any; type?: FieldDefinition['type']; className?: string, isHtml?: boolean }> = ({ label, value, type, className, isHtml }) => {
  let displayValue: React.ReactNode;

  if (value === null || value === undefined || String(value).trim() === '') {
    displayValue = <span className="text-gray-400 italic">Belum diisi</span>;
  } else if (isHtml) {
    displayValue = <div dangerouslySetInnerHTML={{ __html: String(value) }} />;
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

const getYearsInRange = (startYear?: number, endYear?: number): number[] => {
  if (!startYear || !endYear || startYear > endYear) return [];
  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }
  return years;
};


export const RpjmdesDetailView = ({
  rpjmdesData,
  rkpDataForRpjmdes,
  dataDesa,
  allData,
  onClose,
  rkpdesDefinition,
}: RpjmdesDetailViewProps): React.ReactElement | null => {

  const idColumnDefinition: FieldDefinition = { name: 'id', label: 'ID', type: 'number' };

  let rkpColumns: FieldDefinition[];
  if (rkpdesDefinition) {
    rkpColumns = [idColumnDefinition, ...rkpdesDefinition.fields];
  } else {
    rkpColumns = [];
  }
  
  const daftarKepalaDesaHtml = (): string => {
    const aparat = allData?.buku_aparat || [];
    const kepalaDesaList = aparat
        .filter(a => a.jabatan?.toLowerCase().includes('kepala desa'))
        .sort((a, b) => {
            const dateA = a.tanggal_sk_pengangkatan ? new Date(a.tanggal_sk_pengangkatan).getTime() : 0;
            const dateB = b.tanggal_sk_pengangkatan ? new Date(b.tanggal_sk_pengangkatan).getTime() : 0;
            return dateA - dateB;
        });

    if (kepalaDesaList.length === 0) {
        return '<p><em>Data Kepala Desa belum tersedia di Buku Aparat.</em></p>';
    }

    let tableHtml = '<p>Berikut daftar nama-nama kepala Desa sejak tahun ..... adalah:</p>';
    tableHtml += '<table style="width: 80%; margin-left: auto; margin-right: auto; border: 1px solid #ccc; font-size: 9pt;"><thead><tr><th style="border: 1px solid #ccc; padding: 4px; text-align:center;">NO.</th><th style="border: 1px solid #ccc; padding: 4px; text-align:center;">NAMA KEPALA DESA</th><th style="border: 1px solid #ccc; padding: 4px; text-align:center;">TAHUN</th></tr></thead><tbody>';
    kepalaDesaList.forEach((kades, index) => {
        const tahunAwal = kades.tanggal_sk_pengangkatan ? new Date(kades.tanggal_sk_pengangkatan).getFullYear() : 'N/A';
        // Assuming a 6 year term, or use SK pemberhentian if available
        const tahunAkhir = kades.tanggal_sk_pemberhentian ? new Date(kades.tanggal_sk_pemberhentian).getFullYear() : (typeof tahunAwal === 'number' ? tahunAwal + 6 : 'Sekarang');
        tableHtml += `<tr>
                        <td style="border: 1px solid #ccc; padding: 4px; text-align:center;">${index + 1}.</td>
                        <td style="border: 1px solid #ccc; padding: 4px;">${kades.nama || 'N/A'}</td>
                        <td style="border: 1px solid #ccc; padding: 4px; text-align:center;">${tahunAwal} - ${tahunAkhir}</td>
                      </tr>`;
    });
    tableHtml += '</tbody></table>';
    return tableHtml;
  };


  const generateKopSuratHtml = (dataDesaParam: DataDesaEntry | null): string => {
    if (!dataDesaParam) return '';
    return `
      <div style="display: flex; align-items: flex-start; margin-bottom: 10px; padding-bottom: 10px; width: 100%; font-family: Arial, sans-serif; border-bottom: 3px solid black;">
        <div style="flex: 0 0 80px; margin-right: 15px; display: flex; align-items: center; justify-content: center; height: 80px;">
          ${dataDesaParam.logo_desa_path ? `<img src="${dataDesaParam.logo_desa_path}" alt="Logo Desa" style="max-width: 70px; max-height: 70px; object-fit: contain;">` : '<div style="width: 70px; height: 70px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #777;">Logo</div>'}
        </div>
        <div style="flex-grow: 1; text-align: center;">
          <div style="font-weight: bold; margin: 0; line-height: 1.2; font-size: 14pt;">PEMERINTAH KABUPATEN ${dataDesaParam.nama_kabupaten_kota?.toUpperCase() || '........................'}</div>
          <div style="font-weight: bold; margin: 0; line-height: 1.2; font-size: 16pt;">KECAMATAN ${dataDesaParam.nama_kecamatan?.toUpperCase() || '........................'}</div>
          <div style="font-weight: bold; margin: 0; line-height: 1.2; font-size: 18pt; margin-bottom: 2px;">PEMERINTAH DESA ${dataDesaParam.nama_desa?.toUpperCase() || '........................'}</div>
          <div style="font-size: 9pt; margin-top: 2px; line-height: 1.1;">${dataDesaParam.alamat_kantor_desa || 'Alamat Kantor Desa ............................................................'}</div>
          <div style="font-size: 9pt; margin-top: 2px; line-height: 1.1;">
            ${dataDesaParam.nomor_telepon_kantor_desa ? `<span>Telp: ${dataDesaParam.nomor_telepon_kantor_desa}</span>` : ''}
            ${dataDesaParam.email_desa ? `<span style="margin-left: 10px;">Email: ${dataDesaParam.email_desa}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  };

  const renderTextareaForExport = (text?: string) => {
    if (!text) return '<p style="font-style: italic; color: #9ca3af;">Belum diisi</p>';
    return text.split('\n').map(line => `<p style="margin-bottom: 2px; margin-top:0; text-align:justify;">${line || '&nbsp;'}</p>`).join('');
  };
  
  const renderFieldForExport = (value: any, type?: FieldDefinition['type'], label?: string) => {
    if (value === null || value === undefined || String(value).trim() === '') {
        return '<span style="font-style: italic; color: #9ca3af;">Belum diisi</span>';
    }
    if (type === 'number' && typeof value === 'number') {
        if (label?.toLowerCase().includes("tahun")) {
            return value.toString();
        }
        return value.toLocaleString('id-ID');
    }
    if (type === 'date' && value) {
        try {
            return new Date(value).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) { return String(value); }
    }
    if (type === 'textarea') {
        return renderTextareaForExport(String(value));
    }
    return String(value);
};


  const handleExportToWord = async () => {
    const kopSuratHtml = generateKopSuratHtml(dataDesa);
    const namaDesa = dataDesa?.nama_desa || '........................';
    const namaKecamatan = dataDesa?.nama_kecamatan || '........................';
    const namaKabupaten = dataDesa?.nama_kabupaten_kota || 'Kabupaten Situbondo'; // Default if not set
    const tahunAwal = rpjmdesData.tahun_awal_periode || '20XX';
    const tahunAkhir = rpjmdesData.tahun_akhir_periode || '20YY';

    const dataUmumHtml = `
      <h4 style="font-size: 12pt; font-weight: bold;">Data Umum Dokumen RPJMDes</h4>
      <p><strong>Periode RPJMDes:</strong> ${renderFieldForExport(rpjmdesData.tahun_awal_periode, 'number', 'Tahun Awal Periode')} - ${renderFieldForExport(rpjmdesData.tahun_akhir_periode, 'number', 'Tahun Akhir Periode')}</p>
      <p><strong>Nomor Perdes RPJMDes:</strong> ${renderFieldForExport(rpjmdesData.nomor_perdes_rpjmdes)}</p>
      <p><strong>Tanggal Penetapan Perdes:</strong> ${renderFieldForExport(rpjmdesData.tanggal_penetapan_perdes, 'date')}</p>
      <p><strong>Tanggal Diundangkan Perdes:</strong> ${renderFieldForExport(rpjmdesData.tanggal_diundangkan_perdes, 'date')}</p>
      <p><strong>Nomor Lembaran Desa (Perdes RPJMDes):</strong> ${renderFieldForExport(rpjmdesData.nomor_lembaran_desa_rpjmdes)}</p>
      <p><strong>Tanggal Musdes Penetapan RPJMDes:</strong> ${renderFieldForExport(rpjmdesData.tanggal_musdes_penetapan_rpjmdes, 'date')}</p>
      <p><strong>No. BA Musdes Penetapan RPJMDes:</strong> ${renderFieldForExport(rpjmdesData.nomor_berita_acara_musdes_rpjmdes)}</p>
      <p><strong>Status Dokumen RPJMDes:</strong> ${renderFieldForExport(rpjmdesData.status_rpjmdes)}</p>
      <p><strong>Catatan Revisi:</strong> ${renderTextareaForExport(rpjmdesData.catatan_revisi_rpjmdes)}</p>
      <p><strong>Keterangan Umum:</strong> ${renderTextareaForExport(rpjmdesData.keterangan)}</p>
    `;

    const dasarHukumHtml = `
      <ol style="list-style-type: decimal; padding-left: 2em; margin-left:0; text-align:justify;">
        <li>Undang-Undang Nomor 6 Tahun 2014 tentang Desa (Lembaran Negara Republik Indonesia Tahun 2014 Nomor 7, Tambahan Lembaran Negara Republik Indonesia Nomor 5495);</li>
        <li>Peraturan Pemerintah Nomor 43 Tahun 2014 tentang Peraturan Pelaksanaan Undang-Undang Nomor 6 Tahun 2014 tentang Desa (Lembaran Negara Republik Indonesia Tahun 2014 Nomor 123, Tambahan Lembaran Negara Republik Indonesia Nomor 5539) sebagaimana telah beberapa kali diubah, terakhir dengan Peraturan Pemerintah Nomor 11 Tahun 2019 tentang Perubahan Kedua atas Peraturan Pemerintah Nomor 43 Tahun 2014 tentang Peraturan Pelaksanaan Undang-Undang Nomor 6 Tahun 2014 tentang Desa (Lembaran Negara Republik Indonesia Tahun 2019 Nomor 41, Tambahan Lembaran Negara Republik Indonesia Nomor 6321);</li>
        <li>Peraturan Menteri Dalam Negeri Nomor 114 Tahun 2014 tentang Pedoman Pembangunan Desa (Berita Negara Republik Indonesia Tahun 2014 Nomor 2094);</li>
        <li>Peraturan Menteri Desa, Pembangunan Daerah Tertinggal, dan Transmigrasi Nomor 21 Tahun 2020 tentang Pedoman Umum Pembangunan Desa dan Pemberdayaan Masyarakat Desa (Berita Negara Republik Indonesia Tahun 2020 Nomor 1445);</li>
        ${dataDesa?.nama_kabupaten_kota ? `<li>Peraturan Daerah Kabupaten ${dataDesa.nama_kabupaten_kota.toUpperCase()} tentang Pedoman Penyusunan Dokumen Perencanaan Pembangunan Desa dan/atau Penyelenggaraan Pemerintahan Desa (Nomor dan Tahun Perda disesuaikan);</li>` : ''}
        ${dataDesa?.nama_kabupaten_kota ? `<li>Peraturan Bupati ${dataDesa.nama_kabupaten_kota.toUpperCase()} tentang Petunjuk Teknis Penyusunan Rencana Pembangunan Jangka Menengah Desa dan Rencana Kerja Pemerintah Desa (Nomor dan Tahun Perbup disesuaikan);</li>` : ''}
        ${rpjmdesData.nomor_perdes_rpjmdes && dataDesa?.nama_desa ? `<li>Peraturan Desa ${dataDesa.nama_desa.toUpperCase()} Nomor ${rpjmdesData.nomor_perdes_rpjmdes} Tahun ${rpjmdesData.tanggal_penetapan_perdes ? new Date(rpjmdesData.tanggal_penetapan_perdes).getFullYear() : '(TAHUN)'} tentang Rencana Pembangunan Jangka Menengah Desa Tahun ${rpjmdesData.tahun_awal_periode} - ${rpjmdesData.tahun_akhir_periode};</li>` : ''}
        ${rpjmdesData.bab1_dasar_hukum_tambahan ? `<li>${renderTextareaForExport(rpjmdesData.bab1_dasar_hukum_tambahan)}</li>` : ''}
        <li>Peraturan perundang-undangan lain yang relevan dan berlaku.</li>
      </ol>
    `;

    const lampiranListHtml = [
        { field: rpjmdesData.lampiran_sk_tim_penyusun, title: "SK Tim Penyusun RPJM Desa" },
        { field: rpjmdesData.lampiran_rktl_tim_penyusun, title: "RKTL Tim Penyusun RPJM Desa" },
        { field: rpjmdesData.lampiran_peta_jalan_sdgs, title: "Peta Jalan SDGs Desa" },
        { field: rpjmdesData.lampiran_data_rencana_program_kegiatan_masuk, title: "Data Rencana Program dan Kegiatan Pembangunan Yang Akan Masuk Ke Desa" },
        { field: rpjmdesData.lampiran_gambar_bagan_kelembagaan, title: "Gambar Bagan Kelembagaan" },
        { field: rpjmdesData.lampiran_daftar_masalah_potensi_bagan_kelembagaan, title: "Daftar Masalah dan Potensi dari Bagan Kelembagaan" },
        { field: rpjmdesData.lampiran_gambar_peta_sosial_desa, title: "Gambar Peta Sosial Desa" },
        { field: rpjmdesData.lampiran_daftar_masalah_potensi_sketsa_desa, title: "Daftar Masalah dan Potensi dari Sketsa Desa" },
        { field: rpjmdesData.lampiran_gambar_kalender_musim, title: "Gambar Kalender Musim" },
        { field: rpjmdesData.lampiran_daftar_masalah_potensi_kalender_musim, title: "Daftar Masalah dan Potensi dari Kalender Musim" },
        { field: rpjmdesData.lampiran_gambar_pohon_masalah, title: "Gambar Pohon Masalah" },
        { field: rpjmdesData.lampiran_daftar_masalah_potensi_pohon_masalah, title: "Daftar Masalah dan Potensi dari Pohon Masalah" },
        { field: rpjmdesData.lampiran_daftar_inventarisir_masalah, title: "Daftar Inventarisir Masalah" },
        { field: rpjmdesData.lampiran_daftar_inventarisir_potensi, title: "Daftar Inventarisir Potensi" },
        { field: rpjmdesData.lampiran_pengkajian_tindakan_pemecahan_masalah, title: "Pengkajian Tindakan Pemecahan Masalah" },
        { field: rpjmdesData.lampiran_penentuan_tindakan_masalah, title: "Penentuan Tindakan Masalah" },
        { field: rpjmdesData.lampiran_penentuan_peringkat_tindakan, title: "Penentuan Peringkat Tindakan" },
        { field: rpjmdesData.lampiran_daftar_gagasan_dusun_kelompok, title: "Daftar Gagasan Dusun/Kelompok" },
        { field: rpjmdesData.lampiran_rekapitulasi_gagasan_dusun_kelompok, title: "Rekapitulasi Gagasan Dusun/Kelompok" },
        { field: rpjmdesData.lampiran_rancangan_rpjm_desa, title: "Rancangan RPJM Desa" },
        { field: rpjmdesData.lampiran_dokumen_visi_misi_kepala_desa, title: "Dokumen Visi Misi Kepala Desa" },
        { field: rpjmdesData.lampiran_dokumen_pokok_pikiran_bpd, title: "Dokumen Pokok-pokok Pikiran BPD" },
        { field: rpjmdesData.lampiran_keputusan_tim_penyusun_dll, title: "Keputusan (Tim Penyusun RPJM Desa, Panitia Musrenbang Desa RPJM Desa, Panitia Musdes Pembahasan, Penetapan, dan Pengesahan RPJM Desa)" },
        { field: rpjmdesData.lampiran_berita_acara_musyawarah, title: "Berita Acara Musyawarah (Musyawarah Dusun/Kelompok, Musrenbang Desa RPJM Desa, Musdes tentang Pembahasan, Penetapan, dan Pengesahan RPJM Desa)" },
        { field: rpjmdesData.lampiran_undangan_daftar_hadir_musyawarah, title: "Undangan dan Daftar Hadir Musyawarah (Musyawarah Dusun/Kelompok, Musrenbang Desa RPJM Desa, Musdes tentang Pembahasan, Penetapan, dan Pengesahan RPJM Desa)" },
        { field: rpjmdesData.lampiran_notulen_musyawarah, title: "Notulen Musyawarah (Musyawarah Dusun/Kelompok, Musrenbang Desa RPJM Desa, Musdes tentang Pembahasan, Penetapan, dan Pengesahan RPJM Desa)" },
        { field: rpjmdesData.lampiran_peta_desa, title: "Peta Desa" },
        { field: rpjmdesData.lampiran_foto_kegiatan_desa, title: "Foto Kegiatan/Foto Desa (Musyawarah Dusun/Kelompok, Musrenbang Desa RPJM Desa, Musdes tentang Pembahasan, Penetapan, dan Pengesahan RPJM Desa)" },
      ]
      .filter(item => item.field && String(item.field).toLowerCase() !== 'tidak' && String(item.field).toLowerCase() !== 'tidak ada')
      .map((item, index) => `<li style="text-align:justify;">${index + 1}. ${item.title} ${item.field && typeof item.field === 'string' && item.field.toLowerCase() !== 'ya' ? `(${item.field})` : ''}</li>`)
      .join('');

    // RKPDes Table for Export
    let rkpTableHtml = '<h4>Tabel RKPDes Terkait</h4>';
    if (rkpDataForRpjmdes.length > 0 && rkpdesDefinition) {
      const rkpCols = [idColumnDefinition, ...rkpdesDefinition.fields];
      const rkpHeaders = rkpCols.map(col => `<th>${col.label}</th>`).join('');
      const rkpRows = rkpDataForRpjmdes.map(entry => {
        const cells = rkpCols.map(col => {
          let cellValue = entry[col.name as keyof BukuRkp];
          if (col.name === 'tahun_rkp' && typeof cellValue === 'number') {
            cellValue = cellValue.toString();
          } else if (col.type === 'number' && typeof cellValue === 'number') {
            cellValue = cellValue.toLocaleString('id-ID');
          }
          return `<td>${cellValue !== null && cellValue !== undefined ? cellValue : '-'}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      rkpTableHtml += `<table><thead><tr>${rkpHeaders}</tr></thead><tbody>${rkpRows}</tbody></table>`;
    } else {
      rkpTableHtml += '<p>Tidak ada data RKPDes yang terkait.</p>';
    }


    const contentHtml = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 16pt; font-weight: bold; margin:0;">DOKUMEN RENCANA PEMBANGUNAN JANGKA MENENGAH DESA (RPJM DESA)</h2>
        <h3 style="font-size: 14pt; font-weight: bold; margin:0;">TAHUN ${rpjmdesData.tahun_awal_periode || '20XX'} - ${rpjmdesData.tahun_akhir_periode || '20YY'}</h3>
        <h3 style="font-size: 14pt; font-weight: bold; margin:0;">DESA ${namaDesa.toUpperCase()}</h3>
        <p style="font-size: 12pt; margin:5px 0;">Peraturan Menteri Desa, PDTT Nomor 21 Tahun 2020<br>Pedoman Umum Pembangunan dan Pemberdayaan Masyarakat Desa</p>
      </div>
      ${dataUmumHtml}
      <div style="page-break-after: always;"></div>

      <section id="kata-pengantar">
        <h3 style="text-align:center; font-size: 14pt; font-weight: bold;">KATA PENGANTAR</h3>
        <p>Dengan ungkapan Alhamdulillah kami panjatkan ke hadirat Allah SWT. yang telah memberikan rahmat dan hidayah-Nya sehingga kami dapat menyelesaikan penyusunan dokumen Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) dengan baik.</p>
        <p>Dokumen Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) ini memuat visi dan misi kepala Desa, arah kebijakan perencanaan pembangunan Desa yang difokuskan pada upaya pencapaian SDGs Desa, dan rencana program dan/atau kegiatan yang difokuskan pada upaya pencapaian SDGs Desa, serta disusun berdasarkan usulan/gagasan dari tiap-tiap RT di masing-masing dusun di Desa ${namaDesa} Kecamatan ${namaKecamatan} Kabupaten ${namaKabupaten}.</p>
        <p>Usulan kegiatan yang dapat didanai dalam RPJM Desa ini dapat diklasifikasikan atas 5 (lima) bidang kegiatan meliputi: (1). bidang penyelenggaraan Pemerintahan Desa, (2). Bidang Pelaksanaan pembangunan Desa, (3). Bidang Pembinaan kemasyarakatan Desa, (4). Bidang Pemberdayaan masyarakat Desa dan (5). Bidang Penanggulangan Bencana, Keadaan Mendesak dan Darurat Lainnya.</p>
        <p>Prasarana dan sarana yang dipilih hendaknya mendukung peningkatan kesejahteraan sosial (kesehatan masyarakat dan pendidikan masyarakat) maupun pengembangan ekonomi baik dalam lingkup desa sampai pada lingkup yang lebih luas dan benar-benar sangat dibutuhkan oleh masyarakat dalam upaya pencapaian SDGs Desa diyakini dapat mendukung peningkatan kualitas dan peningkatan kapasitas masyarakat yang keberlanjutan.</p>
        <p>Disamping itu sebagai arah pelaksanaan pembangunan desa, dokumen Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) ini dapat juga dipergunakan sebagai alat dan sarana kontrol bagi pelaksanaan pembangunan yang ada di Desa ${namaDesa}. Masyarakat dapat memanfaatkan dokumen Rencana Pembangunan Jangka Menengah Desa untuk mengevaluasi kinerja Pemerintah Desa.</p>
        <p>Kami menyadari bahwa dokumen Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) ini masih banyak sekali kekurangannya. Oleh karena itu, masukan dari semua pihak sangat kami harapkan demi kebaikan bersama. Tidak lupa, kami sampaikan terima kasih kepada rekan-rekan yang telah memberi banyak masukan dalam proses penulisan dokumen Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) ini.</p>
        <p>Ucapan terima kasih juga kami sampaikan kepada semua pihak yang membantu dalam proses penyusunan sehingga kami dapat menyelesaikan dokumen Rencana Pembangunan Jangka Menengah Desa (RPJM Desa).</p>
        <p>Akhirnya, kami berharap mudah-mudahan dokumen Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) ini dapat bermanfaat serta dapat memenuhi harapan kita semua.</p>
        <br><br>
        <p style="text-align: right; margin-right: 50px;">${namaDesa}, ...................... ${rpjmdesData.tanggal_penetapan_perdes ? new Date(rpjmdesData.tanggal_penetapan_perdes).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'}) : new Date().getFullYear()}</p>
        <p style="text-align: right; margin-right: 50px;">Kepala Desa ${namaDesa}</p>
        <br><br><br>
        <p style="text-align: right; margin-right: 50px;"><u>(${dataDesa?.nama_kepala_desa || '.....................................'})</u></p>
        ${renderTextareaForExport(rpjmdesData.kata_pengantar_rpjmdes_narasi)}
      </section>
      <div style="page-break-after: always;"></div>

      <section id="daftar-isi">
        <h3 style="text-align:center; font-size: 14pt; font-weight: bold;">DAFTAR ISI</h3>
        <table style="border:none; width:100%;">
          <tr><td style="border:none;">LEMBAR PENGESAHAN</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none;">KATA PENGANTAR</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none;">DAFTAR ISI</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none;">BAB I. PENDAHULUAN</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">1.1. Latar belakang</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">1.2. Maksud dan Tujuan</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">1.3. Dasar Hukum</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">1.4. Tahapan Penyusunan RPJM Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none;">BAB II. PROFIL DESA</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">2.1. Kondisi Umum Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:40px;">2.1.1. Sejarah Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:40px;">2.1.2. Kondisi Geografis Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:40px;">2.1.3. Kondisi Sosial Budaya Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:40px;">2.1.4. Kondisi Ekonomi Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:40px;">2.1.5. Kondisi Infrastruktur Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">2.2. Kondisi Pemerintahan Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:40px;">2.2.1. Pembagian Wilayah Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:40px;">2.2.2. Struktur Organisasi Pemerintahan Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none;">BAB III. VISI DAN MISI</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">3.1. Visi dan Misi</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">3.2. Nilai-nilai</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none;">BAB IV. RUMUSAN PRIORITAS PEMBANGUNAN DESA</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">4.1. Masalah</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">4.2. Potensi</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none;">BAB V. ARAH KEBIJAKAN PEMBANGUNAN</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">5.1. Arah Kebijakan Pembangunan Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">5.2. Arah Kebijakan Keuangan Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none;">BAB VI. PROGRAM DAN KEGIATAN PEMBANGUNAN DESA</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">6.1. Bidang Penyelenggaran Pemerintahan Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">6.2. Bidang Pelaksanaan Pembangunan</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">6.3. Bidang Pembinaan Kemasyarakatan</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">6.4. Bidang Pemberdayaan Masyarakat Desa</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">6.5. Bidang Penanggulangan Bencana, Keadaan Mendesak dan Darurat Lainnya</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none;">BAB VII. PENUTUP</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">7.1. Kesimpulan</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none; padding-left:20px;">7.2. Saran-Saran</td><td style="border:none; text-align:right;">00</td></tr>
          <tr><td style="border:none;">LAMPIRAN-LAMPIRAN</td><td style="border:none; text-align:right;">00</td></tr>
        </table>
      </section>
      <div style="page-break-after: always;"></div>

      <section id="bab-i">
        <h3 style="text-align:center; font-size: 14pt; font-weight: bold;">BAB I<br>PENDAHULUAN</h3>
        <h4 style="font-size: 12pt; font-weight: bold;">1.1. Latar Belakang</h4>
        <p>Dalam penyelenggaraan pemerintahan dan pelaksanaan pembangunan desa, pembinaan kemasyarakatan dan pemberdayaan masyarakat desa sebagai upaya peningkatan kualitas hidup dan kehidupan yang sebesar-besarnya untuk kesejahteraan masyarakat desa, yang dilaksanakan secara berkelanjutan dengan didasarkan pada Pancasila, Undang-Undang Dasar Negara Republik Indonesia 1945, Negara Kesatuan Republik Indonesia, dan Bhinneka Tunggal Ika.</p>
        <p>Sejalan dengan perkembangan demokrasi dan keterbukaan masyarakat di era otonomi Desa seperti sekarang ini sesungguhnya telah memiliki akses politik yang makin kuat dalam Penyelengaraan Pemerintahan dan Pembangunan Desa. Sesuai dengan Undang-Undang Nomor 06 Tahun 2014 tentang Desa, dimana menyebutkan Desa dan desa adat atau yang disebut dengan nama lain, selanjutnya disebut desa adalah kesatuan masyarakat hukum yang memiliki batas wilayah yang berwenang untuk mengatur dan mengurus pemerintahan, kepentingan masyarakat setempat berdasarkan prakarsa masyarakat, hak asal usul, dan/atau hak tradisional yang diakui dan dihormati dalam sistem pemerintahan Negara Kesatuan Republik Indonesia, dimana desa telah diberikan keleluasaan dan kebebasan serta kemandirian untuk mengurus dan mengatur kepentingan masyarakat berdasarkan prakarsa masyarakat, hak asal-usul dan adat istiadat setempat.</p>
        <p>Dalam penyelengaraan pemerintahan dan pelaksanaan pembangunan pembinaankemasyarakatan dan pemberdayaan masyarakat desa berdasarkan pada azas :</p>
        <ol style="list-style-type: decimal; padding-left: 2em; margin-left:0; text-align:justify;"><li>Rekognisi;</li><li>Subsidiaritas;</li><li>Keberagaman;</li><li>Kebersamaan;</li><li>Kegotongroyongan;</li><li>Kekeluargaan;</li><li>Musyawarah;</li><li>Demokrasi;</li><li>Kemandirian;</li><li>Partisipasi;</li><li>Kesetaraan;</li><li>Pemberdayaan; dan</li><li>Keberlanjutan.</li></ol>
        <p>Berdasarkan landasan pemikiran dimaksud maka desa wajib mempunyai perencanaan yang matang dalam penyelenggaraan pemerintahan dan pembangunan yang dituangkan dalam Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) dan merupakan perubahan pertama setelah ditetapkannya Undang Undang Nomor 6 Tahun 2014 Tentang Desa dan Peraturan Pemerintah Nomor 43 Tahun 2014 tentang Peraturan Pelaksanaan Undang-Undang Nomor 6 Tahun 2014 tentang Desa sebagaimana telah diubah beberapa kali terakhir dengan Peraturan Pemerintah Nomor 11 Tahun 2019.</p>
        <p>Dalam penyusunan Perencanaan Pembangunan Desa disusun secara berjangka yang meliputi :</p>
        <ol style="list-style-type: decimal; padding-left: 2em; margin-left:0; text-align:justify;"><li>Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) untuk jangka waktu 6 (enam) Tahun</li><li>Rencana Kerja Pembangunan Desa (RKP Desa) untuk jangka waktu 1 (satu) tahun.</li></ol>
        <p>Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) ini merupakan pedoman bagi Pemerintah Desa/lembaga dalam menyusun Rencana Strategis Pemerintah Desa/lembaga (Renstra Pemdes) dan menjadi bahan pertimbangan bagi pemerintah desa dalam menyusun/menyesuaikan Rencana Pembangunan Desa dalam rangka pencapaian sasaran pembangunan Nasional. Untuk pelaksanaan lebih lanjut, Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) akan dijabarkan ke dalam Rencana Kerja Pemerintah Desa (RKP Desa) yang akan menjadi pedoman bagi penyusunan Rancangan Anggaran Pendapatan dan Belanja Desa (RAPB Desa).</p>
        <p>Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) dan Rencana Kerja Pembangunan Desa (RKP Desa) ditetapkan dengan peraturan desa dan merupakan satu-satunya dokumen perencanaan di Desa dimana dalam penyusunannya mengacu pada perencanaan pembangunan kabupaten/kota dan selanjutnya dijadikan sebagai sumber masukan dalam perencanaan pembangunan kabupaten/kota.</p>
        <p>Berpijak dari hal hal tersebut maka diperlukan proses-proses perencanaan pembangunan utamanya di tingkat Desa yang mengikutsertakan partisipasi langsung warga masyarakat. Sekaligus proses perencanaan pembangunan yang lebih regular dan formal semacam musrenbangdes, maupun dalam proses perencanaan pembangunan seperti diatur dalam Undang-Undang atau peraturan-peraturan pemerintah yang lain.</p>
        <p>Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) disusun untuk menjamin keterkaitan dan konsistensi antara perencanaan, penganggaran, pelaksanaan, Pemantauan dan pengawasan serta didasarkan pada :</p>
        <ol style="list-style-type: decimal; padding-left: 2em; margin-left:0; text-align:justify;"><li>Pemberdayaan yaitu upaya untuk mewujudkan kemampuan dan kemandirian masyarakat dalam kehidupan bermasyarakat, berbangsa dan bernegara.</li><li>Partisipatif yaitu keikutsertaan dan keterlibatan masyarakat secara aktif dalam proses pembangunan.</li><li>Berpihak pada masyarakat yaitu seluruh proses pembangunan di pedesaan secara serius memberikan kesempatan yang seluas-luasnya bagi masyarakat khususnya masyarakat miskin.</li><li>Terbuka yaitu setiap proses tahapan perencanaan pembangunan dapat dilihat dan diketahui secara langsung oleh seluruh masyarakat desa.</li><li>Akuntabel yaitu setiap proses dan tahapan-tahapan kegiatan pembangunan dapat dipertanggungjawabkan dengan benar, baik pada pemerintah di desa maupun pada masyarakat.</li><li>Selektif yaitu semua masalah terseleksi dengan baik untuk mencapai hasil yang optimal.</li><li>Efisiensi dan efektif yaitu pelaksanaan perencanaan kegiatan sesuai dengan potensi sumber daya alam dan sumber daya manusia yang tersedia.</li><li>Keberlanjutan yaitu setiap proses dan tahapan kegiatan perencanaan harus berjalan secara berkelanjutan.</li><li>Cermat yaitu data yang diperoleh cukup obyektif, teliti, dapat dipercaya dan menampung aspirasi masyarakat.</li><li>Proses berulang yaitu pengkajian terhadap suatu masalah/hal dilakukan secara berulang sehingga mendapatkan hasil yang terbaik.</li><li>Penggalian informasi yaitu di dalam menemukan masalah dilakukan penggalian informasi melalui alat kajian keadaan desa dengan sumber informasi utama dari peserta musyawarah perencanaan.</li></ol>
        <p>Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) Desa ${namaDesa} tahun ${tahunAwal} - ${tahunAkhir}, yang ditetapkan dalam Peraturan Desa adalah Dokumen Induk dari Perencanaan Pemerintahan dan Pembangunan Desa memuat penjabaran Visi dan Misi, rencana penyelenggaraan pemerintahan, arah kebijakan perencanaan pembangunan desa dengan memperhatikan arah kebijakan perencanaan pembangunan kabupaten/kota, arah kebijakan keuangan desa, pembinaan kemasyarakatan, pemberdayaan masyarakat desa, didasarkan pada kondisi dan potensi sumber daya manusia dan sumber daya alam yang ada, permasalahan yang terjadi di masyarakat, kebutuhan pembangunan desa dan Aspirasi masyarakat yang tumbuh dan berkembang di desa.</p>
        ${renderTextareaForExport(rpjmdesData.bab1_latar_belakang_konteks_umum)}
        <p>Perencanaan Pembangunan yang dibutuhkan desa khususnya Desa ${namaDesa} sebagai instrumen atau acuan kegiatan yang akan dilaksanakan selain RPJM Desa Desa ${namaDesa} tahun ${tahunAwal} - ${tahunAkhir} yang disusun oleh semua elemen masyarakat yang ada di Desa ${namaDesa} atau yang mewakilinya serta semua pihak yang berkepentingan merupakan dokumen perencanaan pembangunan enam tahun yang esensinya memuat program-program prioritas pembangunan sebagai komitmen dalam pemerintahan, pembangunan sesuai dengan visi dan misi yang telah ditetapkan adalah sebagai arah kebijakan dan program ${tahunAwal} - ${tahunAkhir} dan kemudian dijabarkan ke dalam Rencana Kerja Pembangunan Desa (RKP Desa).</p>
        <p>Selain sebagai petunjuk dan penentu arah kebijakan, dokumen ini juga digunakan untuk dasar penilaian kinerja Kepala Desa ${namaDesa} dalam melaksanakan pemerintahan, pembangunan, pembinaan kemasyarakatan, pemberdayaan masyarakat selama masa jabatannya. Dokumen ini juga dapat digunakan sebagai tolak ukur keberhasilan Kepala Desa ${namaDesa} dalam laporan pertanggungjawaban Kepala Desa yang diserahkan kepada BPD ${namaDesa} maupun masyarakat umum.</p>
        
        <h4 style="font-size: 12pt; font-weight: bold;">1.2. Maksud dan Tujuan</h4>
        <p>RPJM Desa ${namaDesa} Tahun ${tahunAwal} - ${tahunAkhir} sebagai bahan dasar dan pedoman resmi bagi Pemerintah Desa, BPD, LPMD, PKK, semua elemen masyarakat dan semua pihak yang berkepentingan dalam pembangunan desa. Selain itu, dokumen ini menjadi acuan penentuan pilihan-pilihan program kegiatan tahunan desa yang akan dibahas dalam rangkaian forum musyawarah perencanaan pembangunan secara berjenjang. Untuk itu isi dan substansinya mencakup indikasi rencana program kegiatan secara lintas sumber pembiayaan, baik dari ADD, BHP, DD, BKK, Unit Anggaran dari jenjang diatasnya maupun dari semua pihak yang berkepentingan dengan pembangunan Desa ${namaDesa}.</p>
        <p>Rencana Pembangunan Jangka Menengah Desa ${namaDesa} tahun ${tahunAwal} – ${tahunAkhir} disusun dengan maksud yaitu :</p>
        <ol style="list-style-type: decimal; padding-left: 2em; margin-left:0; text-align:justify;"><li>Menyediakan dasar dan pedoman resmi bagi seluruh jajaran aparatur pemerintah desa, BPD, Lembaga-lembaga Kemasyarakatan, seluruh elemen masyarakat serta semua pihak yang berkepentingan dalam menentukan prioritas program dan kegiatan tahunan yang akan dibiayai dari APBDesa dan anggaran dari jenjang unit pemerintahan diatasnya.</li><li>Menyediakan tolak ukur untuk mengukur dan melakukan evaluasi kinerja tahunan setiap unsur/bidang didalam pemerintahan desa, serta sebagai bahan bagi perencanaan dan penganggaran pembangunan desa tahunan.</li><li>Menjabarkan gambaran tentang kondisi desa sekarang dalam konstelasi kecamatan dan kabupaten. Sekaligus memahami arah dan tujuan yang ingin dicapai pada kurun waktu enam tahun dalam rangka mewujudkan visi dan misi desa.</li><li>Memudahkan seluruh jajaran pemerintahan desa, BPD dan lembaga-lembaga kemasyarakatan, elemen lain dan semua pihak yang berkepentingan dalam mencapai tujuan dengan menyusun program dan kegiatan secara terpadu, terarah dan terukur.</li><li>Memudahkan jajaran aparatur pemerintah desa, BPD, Lembaga-lembaga Kemasyarakatan, seluruh elemen masyarakat serta semua pihak yang berkepentingan untuk memahami dan menilai arah kebijakan dan program serta kegiatan pembangunan tahunan dalam kurun waktu enam tahun.</li><li>Sebagai masukan bagi RPJM unit pemerintahan yang lebih tinggi yaitu kecamatan dan kabupaten.</li></ol>
        <p>Berdasarkan pertimbangan tersebut, Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) ${namaDesa} tahun ${tahunAwal} - ${tahunAkhir} disusun dengan tujuan sebagai berikut :</p>
        <ol style="list-style-type: lower-alpha; padding-left: 2em; margin-left:0; text-align:justify;"><li>Mewujudkan perencanaan pembangunan desa sesuai dengan kebutuhan dan keadaan masyarakat.</li><li>Menciptakan rasa memiliki dan tanggungjawab masyarakat terhadap program pembangunan di desa.</li><li>Memelihara dan mengembangkan hasil-hasil pembangunan di desa.</li><li>Menumbuh kembangkan dan mendorong peran serta masyarakat dalam kegiatan pembangunan desa.</li></ol>
        ${renderTextareaForExport(rpjmdesData.bab1_maksud_tujuan_narasi)}

        <h4 style="font-size: 12pt; font-weight: bold;">1.3. Dasar Hukum</h4>
        <p>Dalam penyusunan Rencana Pembangunan Jangka Menengah Desa ${namaDesa} Tahun ${tahunAwal} - ${tahunAkhir} didasarkan pada beberapa landasan, antara lain :</p>
        <ol style="list-style-type: decimal; padding-left: 2em; margin-left:0; text-align:justify;">
            <li>Landasan Ideologis Pancasila.</li>
            <li>Landasan Konstitusional Undang-Undang Dasar 1945.</li>
            <li>Landasan Pokok : ${dasarHukumHtml}</li>
        </ol>

        <h4 style="font-size: 12pt; font-weight: bold;">1.4. Tahapan Penyusunan RPJM Desa</h4>
        <h5 style="font-size: 11pt; font-weight: bold;">1.4.1. Pembentukan Tim Penyusun RPJM Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab1_tahapan_pembentukan_tim_narasi)}
        <h5 style="font-size: 11pt; font-weight: bold;">1.4.2. Pencermatan Hasil Penyelarasan Arah Kebijakan Perencanaan Pembangunan Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab1_tahapan_penyelarasan_arah_kebijakan_narasi)}
        <p>a). Mempelajari dan Mengkaji Peta Jalan SDGs Desa</p>
        ${renderTextareaForExport(rpjmdesData.bab1_tahapan_mengkaji_sdgs_narasi)}
        <p>b). mempelajari dan mengkaji daftar rencana program dan kegiatan yang masuk ke Desa</p>
        ${renderTextareaForExport(rpjmdesData.bab1_tahapan_mengkaji_rencana_program_narasi)}
        <h5 style="font-size: 11pt; font-weight: bold;">1.4.3. Penyusunan Rancangan RPJM Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab1_tahapan_penyusunan_rancangan_narasi)}
        <h5 style="font-size: 11pt; font-weight: bold;">1.4.4. Penyelenggaraan Musrenbang Desa untuk Membahas Rancangan RPJM Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab1_tahapan_musrenbang_narasi)}
        <h5 style="font-size: 11pt; font-weight: bold;">1.4.5. Penyelenggaraan Musyawarah Desa untuk Membahas, Menyepakati dan Menetapkan RPJM Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab1_tahapan_musdes_penetapan_narasi)}
        <h5 style="font-size: 11pt; font-weight: bold;">1.4.6. Penyelenggaraan Sosialisasi RPJM Desa kepada Masyarakat oleh Pemerintah Desa melalui Media dan Forum Pertemuan Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab1_tahapan_sosialisasi_narasi)}
      </section>
      <div style="page-break-after: always;"></div>
      
      <section id="bab-ii">
        <h3 style="text-align:center; font-size: 14pt; font-weight: bold;">BAB II<br>PROFIL DESA</h3>
        <h4 style="font-size: 12pt; font-weight: bold;">2.1. Kondisi Umum Desa</h4>
        <h5 style="font-size: 11pt; font-weight: bold;">2.1.1. Sejarah Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab2_sejarah_desa_narasi)}
        ${daftarKepalaDesaHtml()}
        <h5 style="font-size: 11pt; font-weight: bold;">2.1.2. Kondisi Geografis Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab2_kondisi_geografis_narasi)}
        <h5 style="font-size: 11pt; font-weight: bold;">2.1.3. Kondisi Sosial Budaya Desa</h5>
        <p>1. Kondisi Demografis/Kependudukan</p>
        ${renderTextareaForExport(rpjmdesData.bab2_demografi_narasi)}
        <!-- Tabel Demografi akan digenerate -->
        <p>2. Kondisi Kesehatan Masyarakat</p>
        ${renderTextareaForExport(rpjmdesData.bab2_kesehatan_narasi)}
        <p>3. Pendidikan</p>
        ${renderTextareaForExport(rpjmdesData.bab2_pendidikan_narasi)}
        <!-- Tabel Pendidikan akan digenerate -->
        <p>4. Mata Pencaharian</p>
        ${renderTextareaForExport(rpjmdesData.bab2_mata_pencaharian_narasi)}
        <!-- Tabel Mata Pencaharian akan digenerate -->
        <p>5. Kesejahteraan Masyarakat</p>
        ${renderTextareaForExport(rpjmdesData.bab2_kesejahteraan_narasi)}
        <p>6. Agama</p>
        ${renderTextareaForExport(rpjmdesData.bab2_agama_narasi)}
        <!-- Tabel Agama akan digenerate -->
        <p>7. Budaya</p>
        ${renderTextareaForExport(rpjmdesData.bab2_budaya_narasi)}
        <h5 style="font-size: 11pt; font-weight: bold;">2.1.4. Kondisi Ekonomi Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab2_ekonomi_desa_narasi)}
        <h5 style="font-size: 11pt; font-weight: bold;">2.1.5. Kondisi Infrastruktur Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab2_infrastruktur_desa_narasi)}
        <h4 style="font-size: 12pt; font-weight: bold;">2.2. Kondisi Pemerintahan Desa</h4>
        <h5 style="font-size: 11pt; font-weight: bold;">2.2.1. Pembagian Wilayah Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab2_pembagian_wilayah_narasi)}
        <h5 style="font-size: 11pt; font-weight: bold;">2.2.2. Struktur Organisasi Pemerintahan Desa</h5>
        ${renderTextareaForExport(rpjmdesData.bab2_sotk_desa_narasi)}
        <!-- Tabel SOTK Desa akan digenerate -->
        <p>Lembaga BPD</p>
        ${renderTextareaForExport(rpjmdesData.bab2_lembaga_bpd_narasi)}
        <!-- Tabel BPD akan digenerate -->
      </section>
      <div style="page-break-after: always;"></div>

      <section id="bab-iii">
        <h3 style="text-align:center; font-size: 14pt; font-weight: bold;">BAB III<br>VISI DAN MISI</h3>
        <h4 style="font-size: 12pt; font-weight: bold;">3.1. Visi</h4>
        ${renderTextareaForExport(rpjmdesData.bab3_visi_narasi)}
        <p style="font-weight:bold; text-align:center;">"${renderTextareaForExport(rpjmdesData.visi_desa) || 'VISI DESA BELUM DIISI'}"</p>
        <h4 style="font-size: 12pt; font-weight: bold;">3.2. Misi</h4>
        ${renderTextareaForExport(rpjmdesData.bab3_misi_narasi)}
        ${renderTextareaForExport(rpjmdesData.misi_desa)}
        <h4 style="font-size: 12pt; font-weight: bold;">3.3. Nilai-nilai</h4>
        ${renderTextareaForExport(rpjmdesData.bab3_nilai_nilai_narasi)}
      </section>
      <div style="page-break-after: always;"></div>

      <section id="bab-iv">
        <h3 style="text-align:center; font-size: 14pt; font-weight: bold;">BAB IV<br>RUMUSAN PRIORITAS PEMBANGUNAN DESA</h3>
        <h4 style="font-size: 12pt; font-weight: bold;">4.1. Masalah</h4>
        ${renderTextareaForExport(rpjmdesData.bab4_masalah_analisis)}
        <h4 style="font-size: 12pt; font-weight: bold;">4.2. Potensi</h4>
        ${renderTextareaForExport(rpjmdesData.bab4_potensi_analisis)}
      </section>
      <div style="page-break-after: always;"></div>

      <section id="bab-v">
        <h3 style="text-align:center; font-size: 14pt; font-weight: bold;">BAB V<br>ARAH KEBIJAKAN PEMBANGUNAN</h3>
        <h4 style="font-size: 12pt; font-weight: bold;">5.1. Arah Kebijakan Pembangunan Desa</h4>
        ${renderTextareaForExport(rpjmdesData.bab5_arah_kebijakan_pembangunan_narasi)}
        <h4 style="font-size: 12pt; font-weight: bold;">5.2. Arah Kebijakan Keuangan Desa</h4>
        ${renderTextareaForExport(rpjmdesData.bab5_arah_kebijakan_keuangan_narasi)}
        <p>Dengan diundangkannya Undang Undang Desa Nomor 6 Tahun 2014, membuka peluang bagi Desa untuk menentukan arah kebijakan pembangunannya melalui kewenangannya, dan hal itu sangat erat sekali dengan sistem penganggaran yang ada. Dengan dana yang ada Desa dituntut untuk mampu dan dapat mengembangkan desanya sendiri sesuai dengan segala potensi yang ada.</p>
        <p>Sumber sumber keuangan yang ada :</p>
        <ol style="list-style-type: decimal; padding-left: 2em; margin-left:0; text-align:justify;">
          <li>Pendapatan Asli Desa (PADesa)</li>
          <li>Alokasi Dana Desa (ADD) APBD Kab. ${namaKabupaten}</li>
          <li>Bagi Hasil Pajak dan Retribusi Daerah (BHP) APBD Kab. ${namaKabupaten}</li>
          <li>Dana Desa (DD) APBN</li>
          <li>Bantuan Keuangan baik dari Pusat, Propinsi dan Kabupaten.</li>
          <li>Bantuan dari Pihak Ketiga.</li>
          <li>dan Lain-lain</li>
        </ol>
        <p>Dalam memenuhi unsur tersebut maka APB Desa yang menjadi sarana dalam upaya mencapai sasaran yang sudah ditentukan dan ditetapkan oleh pemerintah Desa bersama BPD.</p>
        <p>Realisasi dan Kontribusi Pendapatan desa dapat dijadikan dasar referensi untuk APB Desa yang ada, sebagai dasar dalam hal penganggaran pendapatan yang didasarkan pada Potensi, manfaat dan kemampuan pencapaian yang ada. Untuk perencanaan Pendapatan asli Desa (Pades) harus mempertimbangkan penerimaan hasil pada tahun sebelumnya, potensi dan kondisi ekonomi yang mempengaruhi jenis penerimaan,objek penerimaan dan rincian onjek penerimaan.</p>
        <p>Kebijakan pendapatan dan belanja Desa disusun berdasarkan pendekatan anggaran yang disusun dan dicapai pada tahun sebelumnya yang bertujuan untuk meningkatkan akuntabilitas perencanaan anggaran yang ada serta memperjelas efektiftas dan efisiensi penggunaan anggaran.</p>
      </section>
      <div style="page-break-after: always;"></div>

      <section id="bab-vi">
        <h3 style="text-align:center; font-size: 14pt; font-weight: bold;">BAB VI<br>PROGRAM DAN KEGIATAN PEMBANGUNAN DESA</h3>
        ${renderTextareaForExport(rpjmdesData.bab6_program_kegiatan_narasi_umum)}
        <h4 style="font-size: 12pt; font-weight: bold;">6.1. Bidang Penyelenggaraan Pemerintahan Desa</h4>
        ${renderTextareaForExport(rpjmdesData.bab6_bidang_pemerintahan_narasi)}
        <h4 style="font-size: 12pt; font-weight: bold;">6.2. Bidang Pelaksanaan Pembangunan Desa</h4>
        ${renderTextareaForExport(rpjmdesData.bab6_bidang_pembangunan_narasi)}
        <h4 style="font-size: 12pt; font-weight: bold;">6.3. Bidang Pembinaan Kemasyarakatan</h4>
        ${renderTextareaForExport(rpjmdesData.bab6_bidang_pembinaan_narasi)}
        <h4 style="font-size: 12pt; font-weight: bold;">6.4. Bidang Pemberdayaan Masyarakat Desa</h4>
        ${renderTextareaForExport(rpjmdesData.bab6_bidang_pemberdayaan_narasi)}
        <h4 style="font-size: 12pt; font-weight: bold;">6.5. Bidang Penanggulangan Bencana, Keadaan Mendesak dan Darurat Lainnya</h4>
        ${renderTextareaForExport(rpjmdesData.bab6_bidang_bencana_narasi)}
        <br>
        ${rkpTableHtml}
      </section>
      <div style="page-break-after: always;"></div>

      <section id="bab-vii">
        <h3 style="text-align:center; font-size: 14pt; font-weight: bold;">BAB VII<br>PENUTUP</h3>
        <h4 style="font-size: 12pt; font-weight: bold;">7.1. Kesimpulan</h4>
        <p>Bahwasanya keberhasilan suatu Desa dalam hal ini ditentukan oleh bagaimana desa ini mengawali dengan perencanaan yang baik, terstruktur dengan rapi dan berkesinambungan/ berkelanjutan, sehingga hasil yang dicapai akan sesuai dengan yang kita harapkan.</p>
        ${renderTextareaForExport(rpjmdesData.bab7_kesimpulan_narasi)}
        <h4 style="font-size: 12pt; font-weight: bold;">7.2. Saran-Saran</h4>
        <p>Bahwa pembangunan bukan hanya menjadi tanggung jawab pemerintah semata, akan tetapi merupakan tanggung jawab setiap elemen masyarakat yang ada,oleh karenanya kami mengharap kepada semua elemen masyarakat di Desa ${namaDesa} agar:</p>
        <ol style="list-style-type: decimal; padding-left: 2em; margin-left:0; text-align:justify;">
            <li>Mempererat dan memperkuat kebersamaan untuk membangun Desa tercinta agar kesejahteraan masyarakat Desa ${namaDesa} segera terwujud.</li>
            ${rpjmdesData.bab7_saran_tambahan_1 ? `<li>${renderFieldForExport(rpjmdesData.bab7_saran_tambahan_1, 'textarea')}</li>` : '<li>.............................</li>'}
            ${rpjmdesData.bab7_saran_tambahan_2 ? `<li>${renderFieldForExport(rpjmdesData.bab7_saran_tambahan_2, 'textarea')}</li>` : '<li>................................</li>'}
        </ol>
        <p>Semoga Dokumen RPJM Desa ini bisa bermanfaat untuk kita semua.</p>
        ${renderTextareaForExport(rpjmdesData.bab7_saran_narasi)}
        <br><br>
        <p style="text-align: right; margin-right: 50px;">Kepala Desa ${namaDesa}</p>
        <br><br><br>
        <p style="text-align: right; margin-right: 50px;"><u>(${dataDesa?.nama_kepala_desa || '.....................................'})</u></p>
      </section>
      <div style="page-break-after: always;"></div>

      <section id="lampiran">
        <h3 style="text-align:center; font-size: 14pt; font-weight: bold;">LAMPIRAN-LAMPIRAN</h3>
        <ol style="list-style-type: decimal; padding-left: 2em; margin-left:0;">${lampiranListHtml}</ol>
        <br/>
        <p><strong>Informasi Tim Penyusun RPJMDes & No. SK:</strong> ${renderTextareaForExport(rpjmdesData.tim_penyusun_rpjmdes_dan_sk)}</p>
        <p><strong>Ringkasan Pagu Indikatif Total RPJMDes (Rp):</strong> ${renderFieldForExport(rpjmdesData.pagu_indikatif_rpjmdes, 'number')}</p>
        <p><strong>Ringkasan Sumber Pendanaan RPJMDes:</strong> ${renderTextareaForExport(rpjmdesData.ringkasan_sumber_pendanaan_rpjmdes)}</p>
        ${rpjmdesData.dokumen_rpjmdes_final_link ? `
            <div>
            <p><strong>Link Dokumen Final RPJMDes (Jika ada):</strong></p>
            <p><a href="${rpjmdesData.dokumen_rpjmdes_final_link}" target="_blank" rel="noopener noreferrer">${rpjmdesData.dokumen_rpjmdes_final_link}</a></p>
            </div>
        ` : ''}
      </section>
    `;
    
    const finalHtml = `
      <html>
        <head><meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.5; margin: 0.5in; }
            section { margin-bottom: 20px; }
            h1, h2, h3, h4, h5, h6 { margin-top: 20px; margin-bottom: 10px; page-break-after: avoid; }
            p { margin-top: 0; margin-bottom: 10px; text-align: justify; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9pt; page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            th, td { border: 1px solid #333; padding: 5px; text-align: left; vertical-align: top; }
            th { background-color: #f0f0f0; font-weight: bold; }
            ol, ul { padding-left: 2em; margin-left: 0; text-align: justify; }
            li { margin-bottom: 5px; text-align: justify; }
            .italic { font-style: italic; }
            .text-gray-400 { color: #9ca3af; }
            .text-center { text-align: center; }
            /* Specific Kop Surat styles should be embedded if not using classes from React */
          </style>
        </head>
        <body>
          ${kopSuratHtml}
          ${contentHtml}
        </body>
      </html>
    `;

    try {
      downloadDoc(finalHtml, `RPJMDes - ${dataDesa?.nama_desa || 'Desa'} (${rpjmdesData.tahun_awal_periode}-${rpjmdesData.tahun_akhir_periode}).doc`);
    } catch (error) {
      console.error('Error exporting to Word:', error);
      alert('Gagal mengekspor ke Word.');
    }
  };


  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-gray-200 gap-4 no-print">
        <h1 className="text-2xl font-bold text-gray-800">Rincian Dokumen RPJMDes</h1>
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
      
      {/* This div is now primarily for on-screen display. Export uses direct HTML generation. */}
      <div id="rpjmdesDetailScreenView">
        <Section title="Data Umum Dokumen RPJMDes" level={3}>
            <DisplayField label="Periode RPJMDes" value={`${rpjmdesData.tahun_awal_periode} - ${rpjmdesData.tahun_akhir_periode}`} />
            <DisplayField label="Nomor Perdes RPJMDes" value={rpjmdesData.nomor_perdes_rpjmdes} />
            <DisplayField label="Tanggal Penetapan Perdes" value={rpjmdesData.tanggal_penetapan_perdes} type="date"/>
            <DisplayField label="Tanggal Diundangkan Perdes" value={rpjmdesData.tanggal_diundangkan_perdes} type="date"/>
            <DisplayField label="Nomor Lembaran Desa (Perdes RPJMDes)" value={rpjmdesData.nomor_lembaran_desa_rpjmdes} />
            <DisplayField label="Tanggal Musdes Penetapan RPJMDes" value={rpjmdesData.tanggal_musdes_penetapan_rpjmdes} type="date"/>
            <DisplayField label="No. BA Musdes Penetapan RPJMDes" value={rpjmdesData.nomor_berita_acara_musdes_rpjmdes} />
            <DisplayField label="Status Dokumen RPJMDes" value={rpjmdesData.status_rpjmdes} />
            <DisplayField label="Keterangan Umum" value={rpjmdesData.keterangan} type="textarea"/>
            {rpjmdesData.catatan_revisi_rpjmdes && <DisplayField label="Catatan Revisi" value={rpjmdesData.catatan_revisi_rpjmdes} type="textarea"/>}
        </Section>
        
        <Section title="Kata Pengantar" level={3}>
             <DisplayField value={rpjmdesData.kata_pengantar_rpjmdes_narasi} type="textarea" />
        </Section>

        <Section title="BAB I: PENDAHULUAN" level={2} id="scr-bab-i">
          <SubSection title="1.1 Latar Belakang" id="scr-bab1-sub1">
             <DisplayField label="Konteks Umum Desa (Potensi & Permasalahan)" value={rpjmdesData.bab1_latar_belakang_konteks_umum} type="textarea"/>
          </SubSection>
          <SubSection title="1.2 Maksud dan Tujuan" id="scr-bab1-sub2">
            <DisplayField label="Narasi Maksud dan Tujuan Spesifik Desa" value={rpjmdesData.bab1_maksud_tujuan_narasi} type="textarea"/>
          </SubSection>
          <SubSection title="1.3 Dasar Hukum" id="scr-bab1-sub3">
            <DisplayField label="Dasar Hukum Tambahan (Spesifik Desa/Daerah)" value={rpjmdesData.bab1_dasar_hukum_tambahan} type="textarea"/>
          </SubSection>
          <SubSection title="1.4 Tahapan Penyusunan RPJM Desa" id="scr-bab1-sub4">
            <DisplayField label="1.4.1. Pembentukan Tim Penyusun RPJM Desa" value={rpjmdesData.bab1_tahapan_pembentukan_tim_narasi} type="textarea"/>
            <DisplayField label="1.4.2. Pencermatan Hasil Penyelarasan Arah Kebijakan Perencanaan Pembangunan Desa" value={rpjmdesData.bab1_tahapan_penyelarasan_arah_kebijakan_narasi} type="textarea"/>
             <DisplayField label="   a). Mempelajari dan Mengkaji Peta Jalan SDGs Desa" value={rpjmdesData.bab1_tahapan_mengkaji_sdgs_narasi} type="textarea"/>
             <DisplayField label="   b). Mempelajari dan mengkaji daftar rencana program dan kegiatan yang masuk ke Desa" value={rpjmdesData.bab1_tahapan_mengkaji_rencana_program_narasi} type="textarea"/>
            <DisplayField label="1.4.3. Penyusunan Rancangan RPJM Desa" value={rpjmdesData.bab1_tahapan_penyusunan_rancangan_narasi} type="textarea"/>
            <DisplayField label="1.4.4. Penyelenggaraan Musrenbang Desa" value={rpjmdesData.bab1_tahapan_musrenbang_narasi} type="textarea"/>
            <DisplayField label="1.4.5. Penyelenggaraan Musyawarah Desa Penetapan RPJM Desa" value={rpjmdesData.bab1_tahapan_musdes_penetapan_narasi} type="textarea"/>
            <DisplayField label="1.4.6. Penyelenggaraan Sosialisasi RPJM Desa" value={rpjmdesData.bab1_tahapan_sosialisasi_narasi} type="textarea"/>
          </SubSection>
        </Section>

        <Section title="BAB II: PROFIL DESA" level={2} id="scr-bab-ii">
            <SubSection title="2.1.1. Sejarah Desa" id="scr-bab2-sub1-1">
                <DisplayField value={rpjmdesData.bab2_sejarah_desa_narasi} type="textarea"/>
                <DisplayField label="Daftar Kepala Desa (Berdasarkan Data Buku Aparat)" value={daftarKepalaDesaHtml()} isHtml={true} />
            </SubSection>
            <SubSection title="2.1.2. Kondisi Geografis Desa" id="scr-bab2-sub1-2"><DisplayField value={rpjmdesData.bab2_kondisi_geografis_narasi} type="textarea"/></SubSection>
            <SubSection title="2.1.3. Kondisi Sosial Budaya Desa" id="scr-bab2-sub1-3">
                <DisplayField label="Narasi Demografi/Kependudukan" value={rpjmdesData.bab2_demografi_narasi} type="textarea"/>
                <DisplayField label="Narasi Kesehatan Masyarakat" value={rpjmdesData.bab2_kesehatan_narasi} type="textarea"/>
                <DisplayField label="Narasi Pendidikan" value={rpjmdesData.bab2_pendidikan_narasi} type="textarea"/>
                <DisplayField label="Narasi Mata Pencaharian" value={rpjmdesData.bab2_mata_pencaharian_narasi} type="textarea"/>
                <DisplayField label="Narasi Kesejahteraan Masyarakat" value={rpjmdesData.bab2_kesejahteraan_narasi} type="textarea"/>
                <DisplayField label="Narasi Agama" value={rpjmdesData.bab2_agama_narasi} type="textarea"/>
                <DisplayField label="Narasi Budaya" value={rpjmdesData.bab2_budaya_narasi} type="textarea"/>
            </SubSection>
            <SubSection title="2.1.4. Kondisi Ekonomi Desa" id="scr-bab2-sub1-4"><DisplayField value={rpjmdesData.bab2_ekonomi_desa_narasi} type="textarea"/></SubSection>
            <SubSection title="2.1.5. Kondisi Infrastruktur Desa" id="scr-bab2-sub1-5"><DisplayField value={rpjmdesData.bab2_infrastruktur_desa_narasi} type="textarea"/></SubSection>
            <SubSection title="2.2.1. Pembagian Wilayah Desa" id="scr-bab2-sub2-1"><DisplayField value={rpjmdesData.bab2_pembagian_wilayah_narasi} type="textarea"/></SubSection>
            <SubSection title="2.2.2. Struktur Organisasi Pemerintahan Desa" id="scr-bab2-sub2-2">
                <DisplayField label="Narasi SOTK Desa" value={rpjmdesData.bab2_sotk_desa_narasi} type="textarea"/>
                <DisplayField label="Narasi Kelembagaan BPD" value={rpjmdesData.bab2_lembaga_bpd_narasi} type="textarea"/>
            </SubSection>
        </Section>
        
        <Section title="BAB III: VISI DAN MISI" level={2} id="scr-bab-iii">
            <SubSection title="3.1. Visi" id="scr-bab3-sub1">
                <DisplayField label="Narasi Pengantar Visi" value={rpjmdesData.bab3_visi_narasi} type="textarea"/>
                <DisplayField label="Visi Desa" value={rpjmdesData.visi_desa} type="textarea" className="font-semibold text-xl text-center italic p-4 bg-gray-50 rounded"/>
            </SubSection>
            <SubSection title="3.2. Misi" id="scr-bab3-sub2">
                <DisplayField label="Narasi Pengantar Misi" value={rpjmdesData.bab3_misi_narasi} type="textarea"/>
                <DisplayField label="Misi Desa" value={rpjmdesData.misi_desa} type="textarea"/>
            </SubSection>
            <SubSection title="3.3. Nilai-nilai" id="scr-bab3-sub3">
                 <DisplayField value={rpjmdesData.bab3_nilai_nilai_narasi} type="textarea"/>
            </SubSection>
        </Section>

        <Section title="BAB IV: RUMUSAN PRIORITAS PEMBANGUNAN DESA" level={2} id="scr-bab-iv">
            <SubSection title="4.1. Masalah" id="scr-bab4-sub1"><DisplayField value={rpjmdesData.bab4_masalah_analisis} type="textarea"/></SubSection>
            <SubSection title="4.2. Potensi" id="scr-bab4-sub2"><DisplayField value={rpjmdesData.bab4_potensi_analisis} type="textarea"/></SubSection>
        </Section>
        
        <Section title="BAB V: ARAH KEBIJAKAN PEMBANGUNAN" level={2} id="scr-bab-v">
            <SubSection title="5.1. Arah Kebijakan Pembangunan Desa" id="scr-bab5-sub1"><DisplayField value={rpjmdesData.bab5_arah_kebijakan_pembangunan_narasi} type="textarea"/></SubSection>
            <SubSection title="5.2. Arah Kebijakan Keuangan Desa" id="scr-bab5-sub2"><DisplayField value={rpjmdesData.bab5_arah_kebijakan_keuangan_narasi} type="textarea"/></SubSection>
        </Section>

        <Section title="BAB VI: PROGRAM DAN KEGIATAN PEMBANGUNAN DESA" level={2} id="scr-bab-vi">
            <DisplayField label="Narasi Umum Program & Kegiatan" value={rpjmdesData.bab6_program_kegiatan_narasi_umum} type="textarea"/>
            <DisplayField label="6.1. Bidang Penyelenggaraan Pemerintahan Desa" value={rpjmdesData.bab6_bidang_pemerintahan_narasi} type="textarea"/>
            <DisplayField label="6.2. Bidang Pelaksanaan Pembangunan" value={rpjmdesData.bab6_bidang_pembangunan_narasi} type="textarea"/>
            <DisplayField label="6.3. Bidang Pembinaan Kemasyarakatan" value={rpjmdesData.bab6_bidang_pembinaan_narasi} type="textarea"/>
            <DisplayField label="6.4. Bidang Pemberdayaan Masyarakat Desa" value={rpjmdesData.bab6_bidang_pemberdayaan_narasi} type="textarea"/>
            <DisplayField label="6.5. Bidang Penanggulangan Bencana, Keadaan Mendesak dan Darurat Lainnya" value={rpjmdesData.bab6_bidang_bencana_narasi} type="textarea"/>
            
            <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Daftar RKPDes Terkait:</h4>
            {rkpDataForRpjmdes.length > 0 && rkpdesDefinition ? (
                <DataTable columns={rkpColumns} data={rkpDataForRpjmdes} />
            ) : (
                <p className="text-gray-500">Belum ada data RKPDes yang terkait dengan RPJMDes ini.</p>
            )}
        </Section>

        <Section title="BAB VII: PENUTUP" level={2} id="scr-bab-vii">
            <SubSection title="7.1. Kesimpulan" id="scr-bab7-sub1"><DisplayField value={rpjmdesData.bab7_kesimpulan_narasi} type="textarea"/></SubSection>
            <SubSection title="7.2. Saran-Saran" id="scr-bab7-sub2">
                <DisplayField value={rpjmdesData.bab7_saran_narasi} type="textarea"/>
                <DisplayField label="Saran Tambahan 1" value={rpjmdesData.bab7_saran_tambahan_1} type="textarea"/>
                <DisplayField label="Saran Tambahan 2" value={rpjmdesData.bab7_saran_tambahan_2} type="textarea"/>
            </SubSection>
        </Section>
        
        <Section title="LAMPIRAN-LAMPIRAN" level={2} id="scr-lampiran">
            {[
                { field: rpjmdesData.lampiran_sk_tim_penyusun, title: "SK Tim Penyusun RPJM Desa" },
                { field: rpjmdesData.lampiran_rktl_tim_penyusun, title: "RKTL Tim Penyusun RPJM Desa" },
                { field: rpjmdesData.lampiran_peta_jalan_sdgs, title: "Peta Jalan SDGs Desa" },
                { field: rpjmdesData.lampiran_data_rencana_program_kegiatan_masuk, title: "Data Rencana Program dan Kegiatan Pembangunan Yang Akan Masuk Ke Desa" },
                { field: rpjmdesData.lampiran_gambar_bagan_kelembagaan, title: "Gambar Bagan Kelembagaan" },
                { field: rpjmdesData.lampiran_daftar_masalah_potensi_bagan_kelembagaan, title: "Daftar Masalah dan Potensi dari Bagan Kelembagaan" },
                { field: rpjmdesData.lampiran_gambar_peta_sosial_desa, title: "Gambar Peta Sosial Desa" },
                { field: rpjmdesData.lampiran_daftar_masalah_potensi_sketsa_desa, title: "Daftar Masalah dan Potensi dari Sketsa Desa" },
                { field: rpjmdesData.lampiran_gambar_kalender_musim, title: "Gambar Kalender Musim" },
                { field: rpjmdesData.lampiran_daftar_masalah_potensi_kalender_musim, title: "Daftar Masalah dan Potensi dari Kalender Musim" },
                { field: rpjmdesData.lampiran_gambar_pohon_masalah, title: "Gambar Pohon Masalah" },
                { field: rpjmdesData.lampiran_daftar_masalah_potensi_pohon_masalah, title: "Daftar Masalah dan Potensi dari Pohon Masalah" },
                { field: rpjmdesData.lampiran_daftar_inventarisir_masalah, title: "Daftar Inventarisir Masalah" },
                { field: rpjmdesData.lampiran_daftar_inventarisir_potensi, title: "Daftar Inventarisir Potensi" },
                { field: rpjmdesData.lampiran_pengkajian_tindakan_pemecahan_masalah, title: "Pengkajian Tindakan Pemecahan Masalah" },
                { field: rpjmdesData.lampiran_penentuan_tindakan_masalah, title: "Penentuan Tindakan Masalah" },
                { field: rpjmdesData.lampiran_penentuan_peringkat_tindakan, title: "Penentuan Peringkat Tindakan" },
                { field: rpjmdesData.lampiran_daftar_gagasan_dusun_kelompok, title: "Daftar Gagasan Dusun/Kelompok" },
                { field: rpjmdesData.lampiran_rekapitulasi_gagasan_dusun_kelompok, title: "Rekapitulasi Gagasan Dusun/Kelompok" },
                { field: rpjmdesData.lampiran_rancangan_rpjm_desa, title: "Rancangan RPJM Desa" },
                { field: rpjmdesData.lampiran_dokumen_visi_misi_kepala_desa, title: "Dokumen Visi Misi Kepala Desa" },
                { field: rpjmdesData.lampiran_dokumen_pokok_pikiran_bpd, title: "Dokumen Pokok-pokok Pikiran BPD" },
                { field: rpjmdesData.lampiran_keputusan_tim_penyusun_dll, title: "Keputusan Tim Penyusun, Panitia Musrenbang, Panitia Musdes" },
                { field: rpjmdesData.lampiran_berita_acara_musyawarah, title: "Berita Acara Musyawarah" },
                { field: rpjmdesData.lampiran_undangan_daftar_hadir_musyawarah, title: "Undangan dan Daftar Hadir Musyawarah" },
                { field: rpjmdesData.lampiran_notulen_musyawarah, title: "Notulen Musyawarah" },
                { field: rpjmdesData.lampiran_peta_desa, title: "Peta Desa" },
                { field: rpjmdesData.lampiran_foto_kegiatan_desa, title: "Foto Kegiatan/Desa" },
            ].map((item, index) => (
                (item.field && String(item.field).toLowerCase() !== 'tidak' && String(item.field).toLowerCase() !== 'tidak ada') &&
                <DisplayField key={index} label={`${index + 1}. ${item.title}`} value={item.field} type="textarea" />
            ))}
            <DisplayField label="Informasi Tim Penyusun RPJMDes & No. SK" value={rpjmdesData.tim_penyusun_rpjmdes_dan_sk} type="textarea"/>
            <DisplayField label="Ringkasan Pagu Indikatif Total RPJMDes (Rp)" value={rpjmdesData.pagu_indikatif_rpjmdes} type="number" />
            <DisplayField label="Ringkasan Sumber Pendanaan RPJMDes" value={rpjmdesData.ringkasan_sumber_pendanaan_rpjmdes} type="textarea"/>
            {rpjmdesData.dokumen_rpjmdes_final_link && (
                <div>
                <strong>Link Dokumen Final RPJMDes (Jika ada):</strong>
                <p><a href={rpjmdesData.dokumen_rpjmdes_final_link} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">{rpjmdesData.dokumen_rpjmdes_final_link}</a></p>
                </div>
            )}
        </Section>
      </div>
    </div>
  );
};