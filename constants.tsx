
import React from 'react'; // Required for JSX in icons
import { BookDefinition, FieldDefinition, DATA_DESA_KEY, USAGE_GUIDE_KEY, PEMBUAT_SURAT_KEY, KlasifikasiSuratKeterangan } from './types'; 

// Using Heroicons (MIT License) by Tailwind Labs
// https://heroicons.com/
export const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a.375.375 0 0 1-.375-.375V6.75A3.75 3.75 0 0 0 9 3H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.5H16.5A5.23 5.23 0 0 1 19.5 9V9.75h-2.25A2.625 2.625 0 0 0 14.625 12H12a2.625 2.625 0 0 0-2.625 2.625V15h1.875c.414 0 .75.336.75.75v3a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h1.5v-1.875A2.625 2.625 0 0 0 9.375 9.75H7.5V6.75A5.25 5.25 0 0 1 12.75 1.5h.221Z" />
  </svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.5 6.375a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75ZM4.5 10.125a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75ZM4.5 13.875a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75ZM19.5 6.375a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75V6.375Z" />
    <path fillRule="evenodd" d="M17.705 3.442A.75.75 0 0 1 18 3.75v16.5a.75.75 0 0 1-.75.75h-12a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 .75-.75h12.705Zm-1.5 1.5H6v13.5h10.205V4.942Z" clipRule="evenodd" />
  </svg>
);

export const BanknotesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
    <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM18 12a.75.75 0 0 0 .75-.75V11.25a.75.75 0 0 0-.75-.75h-.008a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75H18Z" clipRule="evenodd" />
    <path d="M5.25 10.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75V11.25a.75.75 0 0 0-.75-.75H5.25ZM6 13.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75H6.75a.75.75 0 0 0 .75-.75V14.25a.75.75 0 0 0-.75-.75H6Z" />
    </svg>
);

export const BuildingOfficeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0-.75.75v18a.75.75 0 0 0 .75.75h15a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75h-3.375A3.75 3.75 0 0 1 12.375 7.5H12V4.5A2.25 2.25 0 0 0 9.75 2.25H4.5ZM11.25 7.5V15h3.75V9A2.25 2.25 0 0 0 12.75 6.75H9.75A2.25 2.25 0 0 0 7.5 9v6h3.75V7.5H11.25Z" clipRule="evenodd" />
    <path d="M15 17.25a.75.75 0 0 0 .75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008a.75.75 0 0 0-.75.75v.008ZM15.75 19.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V19.5Z" />
    <path d="M17.25 17.25a.75.75 0 0 0 .75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008a.75.75 0 0 0-.75.75v.008ZM18 19.5a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V19.5Z" />
    <path d="M8.25 4.5a.75.75 0 0 0 .75.75H9a.75.75 0 0 0 .75-.75V4.5a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0-.75.75v.008c0 .414-.336.75-.75.75H8.25Z" />
    <path d="M6.75 6a.75.75 0 0 0 .75.75h.008a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75h-.008a.75.75 0 0 0-.75.75v.008Z" />
    <path d="M5.25 4.5a.75.75 0 0 0 .75.75H6a.75.75 0 0 0 .75-.75V4.5a.75.75 0 0 0-.75-.75H6a.75.75 0 0 0-.75.75v.008c0 .414-.336.75-.75.75H5.25Z" />
    </svg>
);

export const FolderIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.5 21a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3h-4.5a3 3 0 0 0-2.596 1.352l-.707.943A3 3 0 0 1 9.404 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Z" />
    </svg>
);

export const InboxArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.5 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H3.75a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    <path d="M3 3.75A2.25 2.25 0 0 1 5.25 1.5h13.5A2.25 2.25 0 0 1 21 3.75v16.5A2.25 2.25 0 0 1 18.75 22.5H5.25A2.25 2.25 0 0 1 3 20.25V3.75Zm1.5.75v2.449a.75.75 0 0 0 .22.53l3.22 3.22a.75.75 0 0 0 1.06 0l1.3-1.3a2.25 2.25 0 0 1 3.181-.22L16.5 11.81V4.5H4.5Zm0 15V12.19l-1.03-1.03a.75.75 0 0 0-1.061 0l-.22.22A2.25 2.25 0 0 0 1.969 13.5v6A.75.75 0 0 0 2.719 21h15.562a.75.75 0 0 0 .75-.75v-2.69l-3.31-3.31a2.25 2.25 0 0 0-3.182.22l-1.3 1.3a.75.75 0 0 1-1.06 0l-3.22-3.22a.75.75 0 0 0-.53-.22H4.5v6.75Z" />
  </svg>
);

export const PaperAirplaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 1.5a.75.75 0 0 1 .75.75V7.5h-1.5V2.25A.75.75 0 0 1 12 1.5ZM11.25 7.5v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
  </svg>
);

export const ClipboardDocumentListIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.5 3A2.502 2.502 0 0 0 8 5.502V5.75a.75.75 0 0 0 1.5 0V5.502a1 1 0 0 1 1-1h3.001a1 1 0 0 1 1 1V5.75a.75.75 0 0 0 1.5 0V5.502A2.502 2.502 0 0 0 13.501 3h-3.002ZM4.125 4.5A2.625 2.625 0 0 0 1.5 7.125v12.75A2.625 2.625 0 0 0 4.125 22.5h15.75A2.625 2.625 0 0 0 22.5 19.875V7.125A2.625 2.625 0 0 0 19.875 4.5H4.125Z" clipRule="evenodd" />
    <path d="M7.5 10.5a.75.75 0 0 1 .75-.75h8.25a.75.75 0 0 1 0 1.5H8.25a.75.75 0 0 1-.75-.75Z" />
    <path d="M7.5 13.5a.75.75 0 0 1 .75-.75h8.25a.75.75 0 0 1 0 1.5H8.25a.75.75 0 0 1-.75-.75Z" />
    <path d="M7.5 16.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H8.25a.75.75 0 0 1-.75-.75Z" />
  </svg>
);

export const HomeModernIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);

export const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5A1.5 1.5 0 0 0 7.5 20.25h9a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3V9A.75.75 0 0 1 18 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-9ZM10.72 10.72a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06l-1.72 1.72V3.75a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
  </svg>
);

export const InformationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
  </svg>
);

export const ArrowDownTrayIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Backup Icon
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const ArrowUpTrayIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Restore Icon
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const KeyIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Change Password Icon
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.655 5.263L8.12 7.737a.75.75 0 00-1.06 1.06L8.12 9.858A4.502 4.502 0 0117.25 9c.308 0 .611.025.912.072L19.5 7.737a.75.75 0 10-1.06-1.06l-1.335 1.335A6.727 6.727 0 0015.75 1.5zm-3 9a3.25 3.25 0 100-6.5 3.25 3.25 0 000 6.5z" clipRule="evenodd" />
    <path d="M10.828 10.828a1.5 1.5 0 01.168-1.996l2.25-2.25a1.5 1.5 0 112.122 2.121l-2.25 2.25a1.5 1.5 0 01-1.996.168A4.478 4.478 0 009 13.5a4.5 4.5 0 002.7 4.102V21a.75.75 0 001.5 0v-2.625A4.5 4.5 0 0017.25 13.5a.75.75 0 000-1.5 2.25 2.25 0 01-2.25-2.25.75.75 0 00-1.5 0 2.25 2.25 0 01-2.25 2.25.75.75 0 000 1.5A4.478 4.478 0 0011.7 11.968z" />
  </svg>
);

export const PencilSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
  </svg>
);


export const BOOK_CATEGORIES = {
  ADMINISTRASI_UMUM: "Administrasi Umum",
  ADMINISTRASI_PENDUDUK: "Administrasi Penduduk",
  ADMINISTRASI_KEUANGAN: "Administrasi Keuangan",
  ADMINISTRASI_PEMBANGUNAN: "Administrasi Pembangunan",
  ADMINISTRASI_LAINNYA: "Administrasi Lainnya (BPD & Lembaga)",
  PERENCANAAN_DESA: "Perencanaan Desa", 
  PEMBUAT_SURAT: "Pembuat Surat", // New category
};

const commonIconProps = { width: 20, height: 20, className: "mr-2 inline-block" };
const jenisKelaminOptions = ['Laki-laki', 'Perempuan'];
const statusKepegawaianOptions = ['PNS', 'PPPK', 'Perangkat Desa Tetap', 'Perangkat Desa Tidak Tetap/Honorer', 'Staf Honorer', 'Lainnya'];
const kondisiBarangOptions = ['Baik', 'Rusak Ringan', 'Rusak Berat'];
const statusPeraturanOptions = ['Berlaku', 'Dicabut', 'Diubah', 'Dalam Proses'];
const jenisMutasiPendudukOptions = ['Lahir', 'Mati', 'Pindah Keluar', 'Datang Masuk'];
const statusPerkawinanOptions = ['Belum Kawin', 'Kawin Tercatat', 'Kawin Belum Tercatat', 'Cerai Hidup', 'Cerai Mati'];
const kewarganegaraanOptions = ['WNI', 'WNA'];
const golonganDarahOptions = ['A', 'B', 'AB', 'O', 'Tidak Tahu'];
const jenisAnggaranOptions = ['Pendapatan', 'Belanja', 'Pembiayaan'];
const polaPelaksanaanOptions = ['Swakelola', 'Kerjasama Antar Desa', 'Pihak Ketiga'];
const statusDokumenOptions = ['Diajukan', 'Diproses', 'Ditolak', 'Selesai/Terbit', 'Diambil'];
const statusKehadiranOptions = ['Hadir', 'Sakit', 'Izin', 'Dinas Luar', 'Cuti', 'Alpha'];
export const statusRpjmdesOptions = ['Dalam Penyusunan', 'Musdes Pembahasan', 'Finalisasi Rancangan', 'Perdes Penetapan', 'Berlaku Aktif', 'Dalam Proses Revisi', 'Sudah Direvisi', 'Selesai/Tidak Berlaku'];

export const KLASIFIKASI_SURAT_KETERANGAN_OPTIONS: KlasifikasiSuratKeterangan[] = [
  // Kependudukan (470)
  { kode: "470/01", label: "Surat Keterangan Domisili", deskripsiSingkat: "Menerangkan domisili penduduk." },
  { kode: "470/02", label: "Surat Keterangan Pindah Datang", deskripsiSingkat: "Untuk penduduk yang pindah datang." },
  { kode: "470/03", label: "Surat Keterangan Pindah Keluar", deskripsiSingkat: "Untuk penduduk yang pindah keluar." },
  { kode: "470/04", label: "Surat Keterangan Kelahiran", deskripsiSingkat: "Mencatat peristiwa kelahiran." },
  { kode: "470/05", label: "Surat Keterangan Kematian", deskripsiSingkat: "Mencatat peristiwa kematian." },
  { kode: "470/06", label: "Surat Pengantar KTP", deskripsiSingkat: "Pengantar untuk pembuatan KTP." },
  { kode: "470/07", label: "Surat Pengantar KK", deskripsiSingkat: "Pengantar untuk pembuatan/perubahan KK." },
  { kode: "470/08", label: "Surat Keterangan Belum Menikah", deskripsiSingkat: "Menyatakan status belum menikah." },
  { kode: "470/09", label: "Surat Keterangan Janda/Duda", deskripsiSingkat: "Menyatakan status janda/duda." },
  { kode: "470/10", label: "Surat Keterangan Beda Identitas / Nama", deskripsiSingkat: "Untuk kasus perbedaan data identitas." },
  // Kesejahteraan Sosial (474)
  { kode: "474/01", label: "Surat Keterangan Tidak Mampu (SKTM)", deskripsiSingkat: "Untuk keperluan bantuan sosial, keringanan biaya." },
  { kode: "474/02", label: "Rekomendasi Bantuan Sosial", deskripsiSingkat: "Surat rekomendasi untuk penerimaan bantuan sosial." },
  { kode: "474/03", label: "Surat Rekomendasi PKH/BPNT", deskripsiSingkat: "Rekomendasi untuk program PKH/BPNT." },
  { kode: "474/04", label: "Surat Rekomendasi Rumah Tidak Layak Huni (RTLH)", deskripsiSingkat: "Rekomendasi untuk program bantuan RTLH." },
  // Ekonomi & Usaha (511)
  { kode: "511/01", label: "Surat Keterangan Usaha (SKU)", deskripsiSingkat: "Menerangkan keberadaan suatu usaha." },
  { kode: "511/02", label: "Surat Domisili Usaha", deskripsiSingkat: "Menerangkan domisili tempat usaha." },
  { kode: "511/03", label: "Rekomendasi Izin Usaha Mikro", deskripsiSingkat: "Rekomendasi untuk izin usaha mikro." },
  { kode: "511/04", label: "Surat Rekomendasi NIB", deskripsiSingkat: "Rekomendasi untuk pengurusan Nomor Induk Berusaha." },
  // Perizinan & Umum (400)
  { kode: "400/01", label: "Surat Izin Hajatan", deskripsiSingkat: "Untuk menyelenggarakan acara hajatan." },
  { kode: "400/02", label: "Surat Izin Keramaian", deskripsiSingkat: "Untuk menyelenggarakan acara yang mengundang keramaian." },
  { kode: "400/03", label: "Surat Tugas Perjalanan Dinas", deskripsiSingkat: "Untuk aparat desa yang melakukan perjalanan dinas." },
  { kode: "400/04", label: "Surat Keterangan Izin Orang Tua", deskripsiSingkat: "Pernyataan izin dari orang tua/wali." },
  { kode: "400/05", label: "Surat Rekomendasi Pemasangan Listrik", deskripsiSingkat: "Rekomendasi untuk pemasangan listrik baru." },
  { kode: "400/06", label: "Surat Tugas Kader Posyandu/Linmas", deskripsiSingkat: "Surat tugas untuk kader." },
  { kode: "400/07", label: "Surat Dukungan Kegiatan Masyarakat", deskripsiSingkat: "Dukungan resmi dari desa untuk kegiatan masyarakat." },
  // Keamanan & Ketertiban (430)
  { kode: "430/01", label: "Surat Pengantar Pengaduan", deskripsiSingkat: "Pengantar untuk menyampaikan pengaduan ke pihak berwenang." },
  { kode: "430/02", label: "Surat Keterangan Kehilangan", deskripsiSingkat: "Menerangkan kehilangan dokumen/barang." },
  { kode: "430/03", label: "Surat Keterangan Tahanan", deskripsiSingkat: "Keterangan terkait status tahanan (jika relevan & berwenang)." },
  // Keuangan & Pendapatan (900)
  { kode: "900/01", label: "Surat Keterangan Penghasilan", deskripsiSingkat: "Menerangkan estimasi penghasilan." },
  { kode: "900/02", label: "Surat Keterangan Keringanan Biaya", deskripsiSingkat: "Untuk permohonan keringanan biaya." },
  { kode: "900/03", label: "Surat Rekomendasi Beasiswa", deskripsiSingkat: "Rekomendasi untuk pengajuan beasiswa." },
  // Pertanahan (640)
  { kode: "640/01", label: "Surat Keterangan Tanah (SKT)", deskripsiSingkat: "Keterangan mengenai status kepemilikan tanah." },
  { kode: "640/02", label: "Surat Keterangan Riwayat Tanah", deskripsiSingkat: "Menjelaskan sejarah kepemilikan tanah." },
  { kode: "640/03", label: "Surat Keterangan Jual Beli Tanah", deskripsiSingkat: "Keterangan mengenai transaksi jual beli tanah." },
  { kode: "640/04", label: "Surat Keterangan Waris Tanah", deskripsiSingkat: "Keterangan mengenai ahli waris tanah." },
  { kode: "640/05", label: "Surat Sporadik (Penguasaan Fisik Tanah)", deskripsiSingkat: "Pernyataan penguasaan fisik atas sebidang tanah." },
  // Pernikahan & Perceraian (472)
  { kode: "472/01", label: "Surat Pengantar Nikah (Model N1-N4)", deskripsiSingkat: "Pengantar untuk proses administrasi pernikahan." },
  { kode: "472/02", label: "Surat Keterangan Cerai", deskripsiSingkat: "Menerangkan status perceraian." },
  { kode: "472/03", label: "Surat Izin Orang Tua Nikah", deskripsiSingkat: "Pernyataan izin menikah dari orang tua/wali." },
  // Default/Lainnya
  { kode: "000/00", label: "Surat Keterangan Lainnya", deskripsiSingkat: "Untuk keperluan lain yang tidak tercakup." },
];


export const DATA_DESA_FIELDS: FieldDefinition[] = [
  { name: 'nama_desa', label: 'Nama Desa', type: 'text', required: true },
  { name: 'kode_desa', label: 'Kode Desa (Kemendagri)', type: 'text', placeholder: 'Contoh: 32.01.01.2001' },
  { name: 'nama_kepala_desa', label: 'Nama Kepala Desa', type: 'text' },
  { name: 'alamat_kantor_desa', label: 'Alamat Kantor Desa', type: 'textarea' },
  { name: 'nomor_telepon_kantor_desa', label: 'No. Telepon Kantor', type: 'text' },
  { name: 'email_desa', label: 'Email Desa', type: 'text' },
  { name: 'website_desa', label: 'Website Desa', type: 'text', placeholder: 'Contoh: https://desaSaya.desa.id' },
  { name: 'luas_wilayah', label: 'Luas Wilayah', type: 'text', placeholder: 'Contoh: 150.5 Ha atau 1.5 km²' },
  { name: 'jumlah_dusun', label: 'Jumlah Dusun', type: 'number' },
  { name: 'jumlah_rw', label: 'Jumlah RW', type: 'number' },
  { name: 'jumlah_rt', label: 'Jumlah RT', type: 'number' },
  { name: 'nama_kecamatan', label: 'Nama Kecamatan', type: 'text' },
  { name: 'nama_kabupaten_kota', label: 'Nama Kabupaten/Kota', type: 'text' },
  { name: 'nama_provinsi', label: 'Nama Provinsi', type: 'text' },
  { name: 'logo_desa_path', label: 'Logo Desa', type: 'file', accept: 'image/png, image/jpeg, image/gif, image/webp' },
];


export const MENU_ITEMS: BookDefinition[] = [
  // Data Desa (placed first under Administrasi Umum for visibility)
  {
    key: DATA_DESA_KEY, 
    label: 'Data Umum Desa',
    category: BOOK_CATEGORIES.ADMINISTRASI_UMUM,
    icon: <HomeModernIcon {...commonIconProps} />, 
    fields: DATA_DESA_FIELDS, 
  },
  // Administrasi Umum
  {
    key: 'buku_peraturan', label: 'Buku Peraturan Desa', category: BOOK_CATEGORIES.ADMINISTRASI_UMUM, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
      { name: 'nomor_peraturan', label: 'Nomor Peraturan', type: 'text', required: true },
      { name: 'nama_peraturan', label: 'Nama Peraturan', type: 'text', required: true },
      { name: 'tentang', label: 'Tentang (Isi Pokok)', type: 'textarea', required: true },
      { name: 'jenis_peraturan', label: 'Jenis Peraturan', type: 'text', placeholder: 'Perdes, PerkBerkades, dll' },
      { name: 'tanggal_ditetapkan', label: 'Tgl Ditetapkan', type: 'date', required: true },
      { name: 'tanggal_diundangkan', label: 'Tgl Diundangkan', type: 'date' },
      { name: 'nomor_lembaran_desa', label: 'No. Lembaran Desa', type: 'text' },
      { name: 'status_peraturan', label: 'Status Peraturan', type: 'select', options: statusPeraturanOptions },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_keputusan_kades', label: 'Buku Keputusan Kades', category: BOOK_CATEGORIES.ADMINISTRASI_UMUM, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
      { name: 'nomor_keputusan', label: 'Nomor Keputusan', type: 'text', required: true },
      { name: 'nama_keputusan', label: 'Nama Keputusan', type: 'text', required: true },
      { name: 'tentang', label: 'Tentang (Isi Pokok)', type: 'textarea', required: true },
      { name: 'tanggal_keputusan', label: 'Tgl Keputusan', type: 'date', required: true },
      { name: 'dasar_hukum', label: 'Dasar Hukum', type: 'textarea' },
      { name: 'status_keputusan', label: 'Status Keputusan', type: 'select', options: statusPeraturanOptions },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_inventaris', label: 'Buku Inventaris Desa', category: BOOK_CATEGORIES.ADMINISTRASI_UMUM, icon: <FolderIcon {...commonIconProps} />,
    fields: [
      { name: 'kode_barang', label: 'Kode Barang', type: 'text' },
      { name: 'nama_barang', label: 'Nama Barang', type: 'text', required: true },
      { name: 'merk_tipe', label: 'Merk/Tipe', type: 'text' },
      { name: 'jumlah', label: 'Jumlah', type: 'number', required: true },
      { name: 'satuan_barang', label: 'Satuan', type: 'text', placeholder: 'Unit, Buah, Set' },
      { name: 'tahun_perolehan', label: 'Tahun Perolehan', type: 'number', placeholder: 'YYYY' },
      { name: 'sumber_perolehan', label: 'Sumber Perolehan', type: 'text', placeholder: 'APBDes, Bantuan, Hibah' },
      { name: 'harga_perolehan', label: 'Harga Perolehan (Rp)', type: 'number' },
      { name: 'kondisi', label: 'Kondisi', type: 'select', options: kondisiBarangOptions, required: true },
      { name: 'lokasi_penyimpanan', label: 'Lokasi Penyimpanan', type: 'text' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_aparat', label: 'Buku Aparat Desa', category: BOOK_CATEGORIES.ADMINISTRASI_UMUM, icon: <UsersIcon {...commonIconProps} />,
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'nik', label: 'NIK', type: 'text', placeholder: '16 digit NIK' },
      { name: 'nip', label: 'NIP/NIAP/NIPD', type: 'text' },
      { name: 'jabatan', label: 'Jabatan', type: 'text', required: true },
      { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text' },
      { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date' },
      { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', options: jenisKelaminOptions },
      { name: 'pendidikan_terakhir', label: 'Pendidikan Terakhir', type: 'text' },
      { name: 'status_kepegawaian', label: 'Status Kepegawaian', type: 'select', options: statusKepegawaianOptions },
      { name: 'nomor_sk_pengangkatan', label: 'No. SK Pengangkatan', type: 'text' },
      { name: 'tanggal_sk_pengangkatan', label: 'Tgl SK Pengangkatan', type: 'date' },
      { name: 'nomor_sk_pemberhentian', label: 'No. SK Pemberhentian', type: 'text' },
      { name: 'tanggal_sk_pemberhentian', label: 'Tgl SK Pemberhentian', type: 'date' },
      { name: 'alamat', label: 'Alamat Lengkap', type: 'textarea', required: true },
      { name: 'no_telepon', label: 'No. Telepon/HP', type: 'text' },
      { name: 'email', label: 'Alamat Email', type: 'text' },
    ],
  },
  {
    key: 'buku_tanah_kas', label: 'Buku Tanah Kas Desa', category: BOOK_CATEGORIES.ADMINISTRASI_UMUM, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
      { name: 'lokasi', label: 'Lokasi (Blok/Persil)', type: 'text', required: true },
      { name: 'luas', label: 'Luas (m2 atau Ha)', type: 'text', required: true },
      { name: 'nomor_sertifikat', label: 'No. Sertifikat', type: 'text' },
      { name: 'jenis_hak', label: 'Jenis Hak', type: 'text', placeholder: 'Hak Milik, HGB, dll.' },
      { name: 'status', label: 'Status Tanah', type: 'text', required: true, placeholder: 'Sertifikat an. Pemdes No. X' },
      { name: 'batas_utara', label: 'Batas Utara', type: 'text' },
      { name: 'batas_selatan', label: 'Batas Selatan', type: 'text' },
      { name: 'batas_timur', label: 'Batas Timur', type: 'text' },
      { name: 'batas_barat', label: 'Batas Barat', type: 'text' },
      { name: 'penggunaan_saat_ini', label: 'Penggunaan Saat Ini', type: 'text' },
      { name: 'nilai_aset_tanah', label: 'Nilai Aset Tanah (Rp)', type: 'number' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_tanah_desa', label: 'Buku Tanah Milik Desa', category: BOOK_CATEGORIES.ADMINISTRASI_UMUM, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [ 
      { name: 'lokasi', label: 'Lokasi (Blok/Persil)', type: 'text', required: true },
      { name: 'luas', label: 'Luas (m2 atau Ha)', type: 'text', required: true },
      { name: 'nomor_sertifikat', label: 'No. Sertifikat', type: 'text' },
      { name: 'jenis_hak', label: 'Jenis Hak', type: 'text', placeholder: 'Hak Milik, HGB, dll.' },
      { name: 'status', label: 'Status Tanah', type: 'text', required: true, placeholder: 'Sertifikat an. Pemdes No. X' },
      { name: 'batas_utara', label: 'Batas Utara', type: 'text' },
      { name: 'batas_selatan', label: 'Batas Selatan', type: 'text' },
      { name: 'batas_timur', label: 'Batas Timur', type: 'text' },
      { name: 'batas_barat', label: 'Batas Barat', type: 'text' },
      { name: 'penggunaan_saat_ini', label: 'Penggunaan Saat Ini', type: 'text' },
      { name: 'nilai_aset_tanah', label: 'Nilai Aset Tanah (Rp)', type: 'number' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_agenda_surat_masuk', label: 'Buku Agenda Surat Masuk', category: BOOK_CATEGORIES.ADMINISTRASI_UMUM, icon: <InboxArrowDownIcon {...commonIconProps} />,
    fields: [
      { name: 'tanggal_diterima', label: 'Tgl Diterima', type: 'date', required: true },
      { name: 'nomor_surat_masuk', label: 'No. Surat Masuk', type: 'text', required: true },
      { name: 'tanggal_surat', label: 'Tgl Surat (Asli)', type: 'date' },
      { name: 'pengirim', label: 'Pengirim', type: 'text', required: true },
      { name: 'perihal_surat', label: 'Perihal Surat', type: 'textarea', required: true },
      { name: 'lampiran_surat_masuk', label: 'Lampiran', type: 'text', placeholder: 'e.g. 3 berkas' },
      { name: 'disposisi_kepada', label: 'Disposisi Kepada', type: 'text' },
      { name: 'isi_disposisi', label: 'Isi Disposisi', type: 'textarea' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_agenda_surat_keluar', label: 'Buku Agenda Surat Keluar', category: BOOK_CATEGORIES.ADMINISTRASI_UMUM, icon: <PaperAirplaneIcon {...commonIconProps} />,
    fields: [
      { name: 'tanggal_kirim', label: 'Tgl Kirim/Surat', type: 'date', required: true },
      { name: 'nomor_surat_keluar', label: 'No. Surat Keluar', type: 'text', required: true },
      { name: 'tujuan_surat', label: 'Tujuan Surat', type: 'text', required: true },
      { name: 'perihal_surat', label: 'Perihal Surat', type: 'textarea', required: true },
      { name: 'lampiran_surat_keluar', label: 'Lampiran', type: 'text' },
      { name: 'pengolah_surat', label: 'Pengolah/Konseptor Surat', type: 'text' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_ekspedisi', label: 'Buku Ekspedisi', category: BOOK_CATEGORIES.ADMINISTRASI_UMUM, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
      { name: 'tanggal', label: 'Tanggal Kirim', type: 'date', required: true },
      { name: 'nomor_surat_dikirim', label: 'No. Surat Dikirim', type: 'text', required: true },
      { name: 'tujuan', label: 'Tujuan Surat/Penerima', type: 'text', required: true },
      { name: 'isi_ringkas', label: 'Isi Ringkas/Perihal', type: 'textarea' },
      { name: 'nama_penerima', label: 'Nama Penerima (Ekspedisi)', type: 'text' },
      { name: 'tanggal_diterima_penerima', label: 'Tgl Diterima (Ekspedisi)', type: 'date' },
      { name: 'keterangan', label: 'Keterangan (Paraf)', type: 'textarea' },
    ],
  },
  {
    key: 'buku_lembaran_berita', label: 'Buku Lembaran & Berita Desa', category: BOOK_CATEGORIES.ADMINISTRASI_UMUM, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
      { name: 'nomor_lembaran_berita_desa', label: 'No. Lembaran/Berita Desa', type: 'text' },
      { name: 'tanggal', label: 'Tanggal Terbit', type: 'date', required: true },
      { name: 'judul', label: 'Judul', type: 'text', required: true },
      { name: 'jenis_publikasi', label: 'Jenis Publikasi', type: 'text', placeholder: 'Pengumuman, Berita Desa, Perdes' },
      { name: 'isi_ringkas', label: 'Isi Ringkas', type: 'textarea' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: USAGE_GUIDE_KEY,
    label: 'Petunjuk Penggunaan',
    category: BOOK_CATEGORIES.ADMINISTRASI_UMUM,
    icon: <InformationCircleIcon {...commonIconProps} />,
    fields: [], 
  },

  // Administrasi Penduduk
  {
    key: 'buku_induk_penduduk', label: 'Buku Induk Penduduk', category: BOOK_CATEGORIES.ADMINISTRASI_PENDUDUK, icon: <UsersIcon {...commonIconProps} />,
    fields: [
      { name: 'nomor_kk', label: 'No. Kartu Keluarga', type: 'text', required: true },
      { name: 'nik', label: 'NIK', type: 'text', required: true, placeholder: '16 digit NIK' },
      { name: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text' },
      { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date' },
      { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', options: jenisKelaminOptions },
      { name: 'alamat', label: 'Alamat Lengkap', type: 'textarea', required: true },
      { name: 'rt', label: 'RT', type: 'text' },
      { name: 'rw', label: 'RW', type: 'text' },
      { name: 'agama', label: 'Agama', type: 'text' },
      { name: 'status_perkawinan', label: 'Status Perkawinan', type: 'select', options: statusPerkawinanOptions },
      { name: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
      { name: 'kewarganegaraan', label: 'Kewarganegaraan', type: 'select', options: kewarganegaraanOptions },
      { name: 'pendidikan_terakhir', label: 'Pendidikan Terakhir', type: 'text' },
      { name: 'nama_ayah', label: 'Nama Ayah', type: 'text' },
      { name: 'nama_ibu', label: 'Nama Ibu', type: 'text' },
      { name: 'golongan_darah', label: 'Golongan Darah', type: 'select', options: golonganDarahOptions },
      { name: 'status_hubungan_dalam_keluarga', label: 'Status Hub. Keluarga', type: 'text', placeholder: 'Kepala Keluarga, Istri, Anak' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_mutasi_penduduk', label: 'Buku Mutasi Penduduk', category: BOOK_CATEGORIES.ADMINISTRASI_PENDUDUK, icon: <UsersIcon {...commonIconProps} />,
    fields: [
      { name: 'nik', label: 'NIK Penduduk', type: 'text', required: true },
      { name: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'jenis_mutasi', label: 'Jenis Mutasi', type: 'select', options: jenisMutasiPendudukOptions, required: true },
      { name: 'tanggal', label: 'Tanggal Mutasi', type: 'date', required: true },
      { name: 'tempat_dilahirkan', label: 'Tempat Dilahirkan (Lahir)', type: 'text', placeholder: 'Jika jenis mutasi Lahir' },
      { name: 'penolong_kelahiran', label: 'Penolong Kelahiran (Lahir)', type: 'text' },
      { name: 'tempat_meninggal', label: 'Tempat Meninggal (Mati)', type: 'text' },
      { name: 'sebab_meninggal', label: 'Sebab Meninggal (Mati)', type: 'text' },
      { name: 'alamat_tujuan_pindah', label: 'Alamat Tujuan (Pindah Keluar)', type: 'textarea' },
      { name: 'alasan_pindah', label: 'Alasan Pindah (Pindah Keluar)', type: 'text' },
      { name: 'klasifikasi_pindah', label: 'Klasifikasi Pindah (Pindah Keluar)', type: 'text', placeholder: 'Antar Desa, Kecamatan, Kab/Kota, Provinsi'},
      { name: 'alamat_asal_datang', label: 'Alamat Asal (Datang Masuk)', type: 'textarea' },
      { name: 'alasan_datang', label: 'Alasan Datang (Datang Masuk)', type: 'text' },
      { name: 'klasifikasi_datang', label: 'Klasifikasi Datang (Datang Masuk)', type: 'text'},
      { name: 'keterangan', label: 'Keterangan Tambahan', type: 'textarea' },
    ],
  },
   {
    key: 'buku_rekap_penduduk', label: 'Buku Rekap Jumlah Penduduk', category: BOOK_CATEGORIES.ADMINISTRASI_PENDUDUK, icon: <UsersIcon {...commonIconProps} />,
    fields: [
      { name: 'bulan', label: 'Bulan', type: 'text', required: true, placeholder: 'e.g. Januari' },
      { name: 'tahun', label: 'Tahun', type: 'number', required: true, placeholder: 'e.g. 2024'},
      { name: 'jumlah_penduduk_awal_bulan', label: 'Jml Penduduk Awal Bulan', type: 'number' },
      { name: 'jumlah_lahir', label: 'Jml Kelahiran', type: 'number' },
      { name: 'jumlah_mati', label: 'Jml Kematian', type: 'number' },
      { name: 'jumlah_pindah_keluar', label: 'Jml Pindah Keluar', type: 'number' },
      { name: 'jumlah_datang_masuk', label: 'Jml Datang Masuk', type: 'number' },
      { name: 'jumlah_penduduk_akhir_bulan', label: 'Jml Penduduk Akhir Bulan', type: 'number', required: true },
      { name: 'jumlah_laki_laki', label: 'Jml Laki-laki', type: 'number' },
      { name: 'jumlah_perempuan', label: 'Jml Perempuan', type: 'number' },
      { name: 'jumlah_kk', label: 'Jumlah KK', type: 'number' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_penduduk_sementara', label: 'Buku Penduduk Sementara/Tamu', category: BOOK_CATEGORIES.ADMINISTRASI_PENDUDUK, icon: <UsersIcon {...commonIconProps} />,
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'nik', label: 'NIK (jika ada)', type: 'text' },
      { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', options: jenisKelaminOptions },
      { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text' },
      { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date' },
      { name: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
      { name: 'kewarganegaraan', label: 'Kewarganegaraan', type: 'select', options: kewarganegaraanOptions },
      { name: 'alamat_asal', label: 'Alamat Asal', type: 'textarea' },
      { name: 'alamat_tinggal_sementara', label: 'Alamat Tinggal Sementara di Desa', type: 'textarea', required: true },
      { name: 'maksud_kedatangan', label: 'Maksud Kedatangan', type: 'text' },
      { name: 'tanggal_datang', label: 'Tanggal Datang', type: 'date', required: true },
      { name: 'rencana_tinggal_sampai', label: 'Rencana Tinggal Sampai Tgl', type: 'date' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_ktp_kk', label: 'Buku Layanan KTP & KK', category: BOOK_CATEGORIES.ADMINISTRASI_PENDUDUK, icon: <UsersIcon {...commonIconProps} />,
    fields: [
      { name: 'tanggal_pengajuan', label: 'Tgl Pengajuan Layanan', type: 'date', required: true },
      { name: 'nik_pemohon', label: 'NIK Pemohon', type: 'text', required: true },
      { name: 'nama_pemohon', label: 'Nama Pemohon', type: 'text', required: true },
      { name: 'nomor_kk_lama', label: 'No. KK Lama (jika ada)', type: 'text' },
      { name: 'nomor_kk_baru', label: 'No. KK Baru (jika terbit)', type: 'text' },
      { name: 'jenis_permohonan', label: 'Jenis Permohonan', type: 'text', required: true, placeholder: 'KTP Baru, KK Baru, Ubah Data KTP/KK' },
      { name: 'status_dokumen', label: 'Status Dokumen', type: 'select', options: statusDokumenOptions },
      { name: 'tanggal_selesai_diproses', label: 'Tgl Selesai/Diambil', type: 'date' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },

  // Administrasi Keuangan
  {
    key: 'buku_apbdes', label: 'Buku APBDes', category: BOOK_CATEGORIES.ADMINISTRASI_KEUANGAN, icon: <BanknotesIcon {...commonIconProps} />,
    fields: [
      { name: 'id_rkp_induk', label: 'ID RKP Induk (Opsional)', type: 'number', placeholder: 'ID dari Buku RKP Desa' },
      { name: 'tahun_apbdes', label: 'Tahun Anggaran APBDes', type: 'number', required: true, placeholder: 'YYYY' },
      { name: 'kode_rekening', label: 'Kode Rekening', type: 'text', required: true },
      { name: 'uraian', label: 'Uraian (Akun)', type: 'text', required: true },
      { name: 'jenis_anggaran', label: 'Jenis Anggaran', type: 'select', options: jenisAnggaranOptions },
      { name: 'sumber_dana', label: 'Sumber Dana (Pendapatan)', type: 'text', placeholder: 'ADD, DD, PADes, dll.' },
      { name: 'bidang_kegiatan', label: 'Bidang Kegiatan (Belanja)', type: 'text', placeholder: 'Penyelenggaraan Pemdes, Pembangunan, dll.'},
      { name: 'jumlah', label: 'Anggaran (Rp)', type: 'number', required: true },
      { name: 'volume', label: 'Volume', type: 'text' },
      { name: 'satuan', label: 'Satuan', type: 'text' },
      { name: 'harga_satuan', label: 'Harga Satuan (Rp)', type: 'number' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_penjabaran_apbdes', label: 'Buku Penjabaran APBDes', category: BOOK_CATEGORIES.ADMINISTRASI_KEUANGAN, icon: <BanknotesIcon {...commonIconProps} />,
    fields: [
      { name: 'tahun', label: 'Tahun Anggaran', type: 'number', required: true, placeholder: 'YYYY' },
      { name: 'kode_rekening_kegiatan', label: 'Kode Rek. Kegiatan/Sub', type: 'text', required: true },
      { name: 'nama_kegiatan', label: 'Nama Kegiatan', type: 'text' },
      { name: 'sub_kegiatan', label: 'Nama Sub Kegiatan', type: 'text' },
      { name: 'uraian_detail', label: 'Uraian Rincian Objek', type: 'text', required: true },
      { name: 'target_output_kegiatan', label: 'Target Output', type: 'text' },
      { name: 'volume_detail', label: 'Volume', type: 'text' },
      { name: 'satuan_detail', label: 'Satuan', type: 'text' },
      { name: 'harga_satuan_detail', label: 'Harga Satuan (Rp)', type: 'number' },
      { name: 'jumlah', label: 'Jumlah Anggaran (Rp)', type: 'number', required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
   {
    key: 'buku_rka', label: 'Buku RKA Desa', category: BOOK_CATEGORIES.ADMINISTRASI_KEUANGAN, icon: <BanknotesIcon {...commonIconProps} />,
    fields: [
      { name: 'tahun', label: 'Tahun Anggaran', type: 'number', required: true, placeholder: 'YYYY' },
      { name: 'kode_kegiatan', label: 'Kode Kegiatan', type: 'text', required: true },
      { name: 'kegiatan', label: 'Nama Kegiatan', type: 'text', required: true },
      { name: 'sumber_dana_rka', label: 'Sumber Dana', type: 'text' },
      { name: 'penanggung_jawab_kegiatan', label: 'Penanggung Jawab', type: 'text' },
      { name: 'lokasi_kegiatan', label: 'Lokasi Kegiatan', type: 'text' },
      { name: 'waktu_pelaksanaan', label: 'Waktu Pelaksanaan', type: 'text', placeholder: 'e.g. Jan-Mar 2024' },
      { name: 'anggaran', label: 'Anggaran (Rp)', type: 'number', required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_kas_umum', label: 'Buku Kas Umum (BKU)', category: BOOK_CATEGORIES.ADMINISTRASI_KEUANGAN, icon: <BanknotesIcon {...commonIconProps} />,
    fields: [
      { name: 'tanggal', label: 'Tanggal Transaksi', type: 'date', required: true },
      { name: 'nomor_bukti_kas', label: 'No. Bukti Kas (BKU)', type: 'text', required: true },
      { name: 'kode_rekening_transaksi', label: 'Kode Rekening', type: 'text' },
      { name: 'uraian', label: 'Uraian Transaksi', type: 'text', required: true },
      { name: 'penerimaan', label: 'Penerimaan (Rp)', type: 'number' },
      { name: 'pengeluaran', label: 'Pengeluaran (Rp)', type: 'number' },
      { name: 'saldo', label: 'Saldo (Rp)', type: 'number', required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
   {
    key: 'buku_kas_pembantu', label: 'Buku Kas Pembantu Kegiatan', category: BOOK_CATEGORIES.ADMINISTRASI_KEUANGAN, icon: <BanknotesIcon {...commonIconProps} />,
    fields: [
      { name: 'kegiatan', label: 'Nama Kegiatan', type: 'text', required: true },
      { name: 'kode_rekening_kegiatan_terkait', label: 'Kode Rek. Kegiatan', type: 'text' },
      { name: 'tanggal', label: 'Tanggal Transaksi', type: 'date', required: true },
      { name: 'nomor_bukti_kas_pembantu', label: 'No. Bukti Kas Pembantu', type: 'text', required: true },
      { name: 'uraian_transaksi_pembantu', label: 'Uraian Transaksi', type: 'text', required: true },
      { name: 'penerimaan', label: 'Penerimaan (Rp)', type: 'number' },
      { name: 'pengeluaran', label: 'Pengeluaran (Rp)', type: 'number' },
      { name: 'saldo', label: 'Saldo Kegiatan (Rp)', type: 'number', required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_bank', label: 'Buku Bank Desa', category: BOOK_CATEGORIES.ADMINISTRASI_KEUANGAN, icon: <BanknotesIcon {...commonIconProps} />,
    fields: [
      { name: 'nama_bank', label: 'Nama Bank', type: 'text', required: true },
      { name: 'nomor_rekening_desa', label: 'No. Rekening Desa', type: 'text', required: true },
      { name: 'tanggal', label: 'Tanggal Transaksi', type: 'date', required: true },
      { name: 'nomor_bukti_bank', label: 'No. Bukti Bank (Slip, dll)', type: 'text', required: true },
      { name: 'uraian', label: 'Uraian Transaksi', type: 'text', required: true },
      { name: 'masuk', label: 'Pemasukan/Debit (Rp)', type: 'number' },
      { name: 'keluar', label: 'Pengeluaran/Kredit (Rp)', type: 'number' },
      { name: 'saldo', label: 'Saldo Bank (Rp)', type: 'number', required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_panjar', label: 'Buku Kas Panjar', category: BOOK_CATEGORIES.ADMINISTRASI_KEUANGAN, icon: <BanknotesIcon {...commonIconProps} />,
    fields: [
        { name: 'tanggal', label: 'Tanggal Panjar', type: 'date', required: true },
        { name: 'nomor_bukti_panjar', label: 'No. Bukti Panjar', type: 'text', required: true },
        { name: 'penerima_panjar', label: 'Penerima Panjar', type: 'text', required: true },
        { name: 'uraian', label: 'Uraian Keperluan Panjar', type: 'text', required: true },
        { name: 'jumlah', label: 'Jumlah Panjar (Rp)', type: 'number', required: true },
        { name: 'batas_waktu_pertanggungjawaban', label: 'Batas Waktu PJ', type: 'date' },
        { name: 'tanggal_pertanggungjawaban', label: 'Tanggal PJ', type: 'date' },
        { name: 'jumlah_dipertanggungjawabkan', label: 'Jumlah Di-PJ-kan (Rp)', type: 'number' },
        { name: 'sisa_kurang_panjar', label: 'Sisa/Kurang Panjar (Rp)', type: 'number' },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  
  // Administrasi Pembangunan
  {
    key: 'buku_rpjmdes',
    label: 'Buku RPJMDes',
    category: BOOK_CATEGORIES.ADMINISTRASI_PEMBANGUNAN, 
    icon: <BuildingOfficeIcon {...commonIconProps} />,
    fields: [
      { name: 'tahun_awal_periode', label: 'Tahun Awal Periode RPJMDes', type: 'number', required: true, placeholder: 'YYYY' },
      { name: 'tahun_akhir_periode', label: 'Tahun Akhir Periode RPJMDes', type: 'number', required: true, placeholder: 'YYYY' },
      { name: 'nomor_perdes_rpjmdes', label: 'No. Perdes RPJMDes', type: 'text', required: true },
      { name: 'tanggal_penetapan_perdes', label: 'Tgl Penetapan Perdes', type: 'date', required: true },
      { name: 'tanggal_diundangkan_perdes', label: 'Tgl Diundangkan Perdes', type: 'date' },
      { name: 'nomor_lembaran_desa_rpjmdes', label: 'No. Lembaran Desa (Perdes RPJMDes)', type: 'text' },
      { name: 'tanggal_musdes_penetapan_rpjmdes', label: 'Tgl Musdes Penetapan RPJMDes', type: 'date' },
      { name: 'nomor_berita_acara_musdes_rpjmdes', label: 'No. BA Musdes Penetapan RPJMDes', type: 'text' },
      { name: 'dokumen_rpjmdes_final_link', label: 'Link Dokumen Final RPJMDes (URL)', type: 'text', placeholder: 'https://link-dokumen-rpjmdes.desa.id' },
      { name: 'visi_desa', label: 'Visi Desa', type: 'textarea', required: true },
      { name: 'misi_desa', label: 'Misi Desa', type: 'textarea', required: true },
      { name: 'potensi_dan_masalah_utama', label: 'Potensi & Permasalahan Utama Desa', type: 'textarea', placeholder: 'Analisis potensi SDA, SDM, kelembagaan, sarpras, serta masalah utama yang dihadapi.' },
      { name: 'arah_kebijakan_pembangunan_desa', label: 'Arah Kebijakan Pembangunan Desa', type: 'textarea', placeholder: 'Arah kebijakan umum, keuangan, dan program prioritas.' },
      { name: 'prioritas_program_bidang_penyelenggaraan_pemerintahan', label: 'Prioritas Program Bidang Penyelenggaraan Pemerintahan', type: 'textarea', placeholder: 'Program-program utama bidang pemerintahan desa.' },
      { name: 'prioritas_program_bidang_pelaksanaan_pembangunan', label: 'Prioritas Program Bidang Pelaksanaan Pembangunan', type: 'textarea', placeholder: 'Program-program utama bidang pembangunan infrastruktur, ekonomi, dll.' },
      { name: 'prioritas_program_bidang_pembinaan_kemasyarakatan', label: 'Prioritas Program Bidang Pembinaan Kemasyarakatan', type: 'textarea', placeholder: 'Program-program utama bidang pembinaan sosial, budaya, olahraga, dll.' },
      { name: 'prioritas_program_bidang_pemberdayaan_masyarakat', label: 'Prioritas Program Bidang Pemberdayaan Masyarakat', type: 'textarea', placeholder: 'Program-program utama bidang pemberdayaan ekonomi, perempuan, pemuda, dll.' },
      { name: 'prioritas_program_bidang_penanggulangan_bencana_darurat_mendesak', label: 'Prioritas Program Bidang Penanggulangan Bencana, Darurat & Mendesak', type: 'textarea', placeholder: 'Program-program utama bidang kebencanaan dan situasi mendesak.' },
      { name: 'indikator_kinerja_utama_desa_rpjmdes', label: 'Indikator Kinerja Utama Desa (RPJMDes)', type: 'textarea', placeholder: 'Indikator-indikator kunci keberhasilan RPJMDes.' },
      { name: 'pagu_indikatif_rpjmdes', label: 'Pagu Indikatif Total RPJMDes (Rp)', type: 'number', placeholder: 'Estimasi total anggaran selama periode RPJMDes' },
      { name: 'ringkasan_sumber_pendanaan_rpjmdes', label: 'Ringkasan Sumber Pendanaan RPJMDes', type: 'textarea', placeholder: 'Deskripsi sumber-sumber pendanaan utama (APBDes, APBD, APBN, Swadaya, dll.)' },
      { name: 'lampiran_dokumen_pendukung_rpjmdes', label: 'Lampiran Dokumen Pendukung RPJMDes', type: 'textarea', placeholder: 'Sebutkan dokumen-dokumen pendukung yang dilampirkan (misal: Peta Desa, Data Statistik, dll.)' },
      { name: 'tim_penyusun_rpjmdes_dan_sk', label: 'Tim Penyusun RPJMDes & No. SK', type: 'textarea', placeholder: 'Nama-nama tim penyusun dan Nomor SK Tim.' },
      { name: 'status_rpjmdes', label: 'Status Dokumen RPJMDes', type: 'select', options: statusRpjmdesOptions, required: true },
      { name: 'catatan_revisi_rpjmdes', label: 'Catatan Revisi RPJMDes (jika ada)', type: 'textarea', placeholder: 'Informasi mengenai revisi yang dilakukan.' },
      { name: 'keterangan', label: 'Keterangan Tambahan', type: 'textarea' },
      // New narrative fields for RPJMDes document generation
      { name: 'kata_pengantar_rpjmdes_narasi', label: 'Narasi Kata Pengantar RPJMDes', type: 'textarea' },
      { name: 'bab1_latar_belakang_konteks_umum', label: 'BAB I - Latar Belakang (Konteks Umum Desa)', type: 'textarea' },
      { name: 'bab1_maksud_tujuan_narasi', label: 'BAB I - Maksud dan Tujuan (Narasi Spesifik Desa)', type: 'textarea' },
      { name: 'bab1_dasar_hukum_tambahan', label: 'BAB I - Dasar Hukum Tambahan (Spesifik Desa/Daerah)', type: 'textarea' },
      { name: 'bab1_tahapan_pembentukan_tim_narasi', label: 'BAB I - Tahapan Pembentukan Tim Penyusun', type: 'textarea' },
      { name: 'bab1_tahapan_penyelarasan_arah_kebijakan_narasi', label: 'BAB I - Tahapan Penyelarasan Arah Kebijakan', type: 'textarea' },
      { name: 'bab1_tahapan_mengkaji_sdgs_narasi', label: 'BAB I - Tahapan Mengkaji Peta Jalan SDGs Desa', type: 'textarea'},
      { name: 'bab1_tahapan_mengkaji_rencana_program_narasi', label: 'BAB I - Tahapan Mengkaji Rencana Program Masuk Desa', type: 'textarea'},
      { name: 'bab1_tahapan_penyusunan_rancangan_narasi', label: 'BAB I - Tahapan Penyusunan Rancangan RPJMDes', type: 'textarea' },
      { name: 'bab1_tahapan_musrenbang_narasi', label: 'BAB I - Tahapan Musrenbang Desa', type: 'textarea' },
      { name: 'bab1_tahapan_musdes_penetapan_narasi', label: 'BAB I - Tahapan Musdes Penetapan RPJMDes', type: 'textarea' },
      { name: 'bab1_tahapan_sosialisasi_narasi', label: 'BAB I - Tahapan Sosialisasi RPJMDes', type: 'textarea' },
      { name: 'bab2_sejarah_desa_narasi', label: 'BAB II - Sejarah Desa', type: 'textarea' },
      { name: 'bab2_kondisi_geografis_narasi', label: 'BAB II - Kondisi Geografis Desa', type: 'textarea' },
      { name: 'bab2_demografi_narasi', label: 'BAB II - Kondisi Demografi/Kependudukan', type: 'textarea' },
      { name: 'bab2_kesehatan_narasi', label: 'BAB II - Kondisi Kesehatan Masyarakat', type: 'textarea' },
      { name: 'bab2_pendidikan_narasi', label: 'BAB II - Kondisi Pendidikan', type: 'textarea' },
      { name: 'bab2_mata_pencaharian_narasi', label: 'BAB II - Kondisi Mata Pencaharian', type: 'textarea' },
      { name: 'bab2_kesejahteraan_narasi', label: 'BAB II - Kondisi Kesejahteraan Masyarakat', type: 'textarea' },
      { name: 'bab2_agama_narasi', label: 'BAB II - Kondisi Agama', type: 'textarea' },
      { name: 'bab2_budaya_narasi', label: 'BAB II - Kondisi Budaya', type: 'textarea' },
      { name: 'bab2_ekonomi_desa_narasi', label: 'BAB II - Kondisi Ekonomi Desa', type: 'textarea' },
      { name: 'bab2_infrastruktur_desa_narasi', label: 'BAB II - Kondisi Infrastruktur Desa', type: 'textarea' },
      { name: 'bab2_pembagian_wilayah_narasi', label: 'BAB II - Pembagian Wilayah Desa', type: 'textarea' },
      { name: 'bab2_sotk_desa_narasi', label: 'BAB II - Struktur Organisasi Pemerintahan Desa', type: 'textarea' },
      { name: 'bab2_lembaga_bpd_narasi', label: 'BAB II - Kelembagaan BPD', type: 'textarea' },
      { name: 'bab3_visi_narasi', label: 'BAB III - Pengantar Visi', type: 'textarea' },
      { name: 'bab3_misi_narasi', label: 'BAB III - Pengantar Misi', type: 'textarea' },
      { name: 'bab3_nilai_nilai_narasi', label: 'BAB III - Nilai-nilai Pembangunan Desa', type: 'textarea' },
      { name: 'bab4_masalah_analisis', label: 'BAB IV - Analisis Permasalahan Desa', type: 'textarea' },
      { name: 'bab4_potensi_analisis', label: 'BAB IV - Analisis Potensi Desa', type: 'textarea' },
      { name: 'bab5_arah_kebijakan_pembangunan_narasi', label: 'BAB V - Arah Kebijakan Pembangunan Desa', type: 'textarea' },
      { name: 'bab5_arah_kebijakan_keuangan_narasi', label: 'BAB V - Arah Kebijakan Keuangan Desa', type: 'textarea' },
      { name: 'bab6_program_kegiatan_narasi_umum', label: 'BAB VI - Pengantar Program & Kegiatan Pembangunan', type: 'textarea' },
      { name: 'bab6_bidang_pemerintahan_narasi', label: 'BAB VI - Bidang Penyelenggaraan Pemerintahan Desa (Narasi)', type: 'textarea' },
      { name: 'bab6_bidang_pembangunan_narasi', label: 'BAB VI - Bidang Pelaksanaan Pembangunan Desa (Narasi)', type: 'textarea' },
      { name: 'bab6_bidang_pembinaan_narasi', label: 'BAB VI - Bidang Pembinaan Kemasyarakatan (Narasi)', type: 'textarea' },
      { name: 'bab6_bidang_pemberdayaan_narasi', label: 'BAB VI - Bidang Pemberdayaan Masyarakat (Narasi)', type: 'textarea' },
      { name: 'bab6_bidang_bencana_narasi', label: 'BAB VI - Bidang Penanggulangan Bencana, Darurat & Mendesak (Narasi)', type: 'textarea' },
      { name: 'bab7_kesimpulan_narasi', label: 'BAB VII - Kesimpulan RPJMDes', type: 'textarea' },
      { name: 'bab7_saran_narasi', label: 'BAB VII - Saran Umum RPJMDes', type: 'textarea' },
      { name: 'bab7_saran_tambahan_1', label: 'BAB VII - Saran Tambahan 1', type: 'textarea' },
      { name: 'bab7_saran_tambahan_2', label: 'BAB VII - Saran Tambahan 2', type: 'textarea' },
      // Lampiran checklist / text fields
      { name: 'lampiran_sk_tim_penyusun', label: 'Lampiran: SK Tim Penyusun RPJM Desa (Ya/Tidak/Deskripsi)', type: 'text' },
      { name: 'lampiran_rktl_tim_penyusun', label: 'Lampiran: RKTL Tim Penyusun RPJM Desa', type: 'text' },
      { name: 'lampiran_peta_jalan_sdgs', label: 'Lampiran: Peta Jalan SDGs Desa', type: 'text' },
      { name: 'lampiran_data_rencana_program_kegiatan_masuk', label: 'Lampiran: Data Rencana Program Kegiatan Masuk Desa', type: 'text' },
      { name: 'lampiran_gambar_bagan_kelembagaan', label: 'Lampiran: Gambar Bagan Kelembagaan', type: 'text' },
      { name: 'lampiran_daftar_masalah_potensi_bagan_kelembagaan', label: 'Lampiran: Daftar Masalah/Potensi Bagan Kelembagaan', type: 'text' },
      { name: 'lampiran_gambar_peta_sosial_desa', label: 'Lampiran: Gambar Peta Sosial Desa', type: 'text' },
      { name: 'lampiran_daftar_masalah_potensi_sketsa_desa', label: 'Lampiran: Daftar Masalah/Potensi Sketsa Desa', type: 'text' },
      { name: 'lampiran_gambar_kalender_musim', label: 'Lampiran: Gambar Kalender Musim', type: 'text' },
      { name: 'lampiran_daftar_masalah_potensi_kalender_musim', label: 'Lampiran: Daftar Masalah/Potensi Kalender Musim', type: 'text' },
      { name: 'lampiran_gambar_pohon_masalah', label: 'Lampiran: Gambar Pohon Masalah', type: 'text' },
      { name: 'lampiran_daftar_masalah_potensi_pohon_masalah', label: 'Lampiran: Daftar Masalah/Potensi Pohon Masalah', type: 'text' },
      { name: 'lampiran_daftar_inventarisir_masalah', label: 'Lampiran: Daftar Inventarisir Masalah', type: 'text' },
      { name: 'lampiran_daftar_inventarisir_potensi', label: 'Lampiran: Daftar Inventarisir Potensi', type: 'text' },
      { name: 'lampiran_pengkajian_tindakan_pemecahan_masalah', label: 'Lampiran: Pengkajian Tindakan Pemecahan Masalah', type: 'text' },
      { name: 'lampiran_penentuan_tindakan_masalah', label: 'Lampiran: Penentuan Tindakan Masalah', type: 'text' },
      { name: 'lampiran_penentuan_peringkat_tindakan', label: 'Lampiran: Penentuan Peringkat Tindakan', type: 'text' },
      { name: 'lampiran_daftar_gagasan_dusun_kelompok', label: 'Lampiran: Daftar Gagasan Dusun/Kelompok', type: 'text' },
      { name: 'lampiran_rekapitulasi_gagasan_dusun_kelompok', label: 'Lampiran: Rekapitulasi Gagasan Dusun/Kelompok', type: 'text' },
      { name: 'lampiran_rancangan_rpjm_desa', label: 'Lampiran: Rancangan RPJM Desa', type: 'text' },
      { name: 'lampiran_dokumen_visi_misi_kepala_desa', label: 'Lampiran: Dokumen Visi Misi Kepala Desa', type: 'text' },
      { name: 'lampiran_dokumen_pokok_pikiran_bpd', label: 'Lampiran: Dokumen Pokok-pokok Pikiran BPD', type: 'text' },
      { name: 'lampiran_keputusan_tim_penyusun_dll', label: 'Lampiran: Keputusan (Tim Penyusun, Panitia Musrenbang, dll)', type: 'text' },
      { name: 'lampiran_berita_acara_musyawarah', label: 'Lampiran: Berita Acara Musyawarah', type: 'text' },
      { name: 'lampiran_undangan_daftar_hadir_musyawarah', label: 'Lampiran: Undangan dan Daftar Hadir Musyawarah', type: 'text' },
      { name: 'lampiran_notulen_musyawarah', label: 'Lampiran: Notulen Musyawarah', type: 'text' },
      { name: 'lampiran_peta_desa', label: 'Lampiran: Peta Desa', type: 'text' },
      { name: 'lampiran_foto_kegiatan_desa', label: 'Lampiran: Foto Kegiatan/Desa', type: 'text' },
    ],
  },
  {
    key: 'buku_rkp', label: 'Buku RKP Desa', category: BOOK_CATEGORIES.ADMINISTRASI_PEMBANGUNAN, icon: <BuildingOfficeIcon {...commonIconProps} />,
    fields: [
      { name: 'id_rpjmdes_induk', label: 'ID RPJMDes Induk (Opsional)', type: 'number', placeholder: 'ID dari Buku RPJMDes' },
      { name: 'tahun_rkp', label: 'Tahun Perencanaan RKP', type: 'number', required: true, placeholder: 'YYYY' },
      { name: 'bidang_pembangunan', label: 'Bidang Pembangunan', type: 'text', required: true, placeholder: 'Penyelenggaraan Pemdes, Pembangunan, Pembinaan, Pemberdayaan' },
      { name: 'sub_bidang_kegiatan', label: 'Sub Bidang Kegiatan', type: 'text' },
      { name: 'kegiatan', label: 'Nama Kegiatan Direncanakan', type: 'text', required: true },
      { name: 'lokasi_pembangunan', label: 'Lokasi', type: 'text' },
      { name: 'prakiraan_volume', label: 'Prakiraan Volume', type: 'text' },
      { name: 'prakiraan_waktu_pelaksanaan', label: 'Prakiraan Waktu Pelaksanaan', type: 'text', placeholder: 'e.g. Triwulan I' },
      { name: 'sumber_dana_direncanakan', label: 'Sumber Dana Direncanakan', type: 'text' },
      { name: 'pola_pelaksanaan', label: 'Pola Pelaksanaan', type: 'select', options: polaPelaksanaanOptions },
      { name: 'anggaran', label: 'Pagu Anggaran (Rp)', type: 'number', required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_kegiatan_pembangunan', label: 'Buku Kegiatan Pembangunan', category: BOOK_CATEGORIES.ADMINISTRASI_PEMBANGUNAN, icon: <BuildingOfficeIcon {...commonIconProps} />,
    fields: [
      { name: 'tahun', label: 'Tahun Pelaksanaan', type: 'number', required: true, placeholder: 'YYYY' },
      { name: 'id_rkp_terkait', label: 'ID RKP Terkait (Opsional)', type: 'text' },
      { name: 'kegiatan', label: 'Nama Kegiatan Dilaksanakan', type: 'text', required: true },
      { name: 'sumber_dana_realisasi', label: 'Sumber Dana Realisasi', type: 'text' },
      { name: 'volume_realisasi', label: 'Volume Realisasi', type: 'text' },
      { name: 'satuan_realisasi', label: 'Satuan Realisasi', type: 'text' },
      { name: 'realisasi', label: 'Realisasi Anggaran (Rp)', type: 'number', required: true },
      { name: 'persentase_kemajuan', label: 'Persentase Kemajuan (%)', type: 'number', placeholder: '0-100' },
      { name: 'tanggal_mulai_pelaksanaan', label: 'Tgl Mulai Pelaksanaan', type: 'date' },
      { name: 'tanggal_selesai_pelaksanaan', label: 'Tgl Selesai Pelaksanaan', type: 'date' },
      { name: 'kontraktor_pelaksana', label: 'Kontraktor/Pihak Ketiga', type: 'text' },
      { name: 'masalah_hambatan', label: 'Masalah/Hambatan', type: 'textarea' },
      { name: 'keterangan', label: 'Keterangan (Progress, Status)', type: 'textarea' },
    ],
  },
  {
    key: 'buku_inventaris_hasil', label: 'Buku Inventaris Hasil Pembangunan', category: BOOK_CATEGORIES.ADMINISTRASI_PEMBANGUNAN, icon: <BuildingOfficeIcon {...commonIconProps} />,
    fields: [
      { name: 'tahun', label: 'Tahun Pembangunan', type: 'number', required: true, placeholder: 'YYYY' },
      { name: 'jenis_pembangunan', label: 'Jenis Pembangunan', type: 'text', placeholder: 'Jalan, Jembatan, Gedung, Irigasi' },
      { name: 'hasil', label: 'Nama Hasil Pembangunan', type: 'text', required: true },
      { name: 'lokasi_aset_pembangunan', label: 'Lokasi Aset', type: 'text' },
      { name: 'jumlah', label: 'Jumlah/Volume', type: 'number', required: true },
      { name: 'satuan_hasil', label: 'Satuan', type: 'text', placeholder: 'Unit, Meter, M2' },
      { name: 'nilai_aset', label: 'Nilai Aset (Rp)', type: 'number' },
      { name: 'sumber_dana_pembangunan_aset', label: 'Sumber Dana Pembangunan', type: 'text' },
      { name: 'kondisi_aset_saat_ini', label: 'Kondisi Aset', type: 'select', options: kondisiBarangOptions },
      { name: 'foto_dokumentasi', label: 'Foto Dokumentasi (Link/Deskripsi)', type: 'text' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_kader', label: 'Buku Kader Pemberdayaan Masyarakat', category: BOOK_CATEGORIES.ADMINISTRASI_PEMBANGUNAN, icon: <UsersIcon {...commonIconProps} />,
    fields: [
      { name: 'nama', label: 'Nama Kader', type: 'text', required: true },
      { name: 'nik_kader', label: 'NIK Kader', type: 'text' },
      { name: 'jenis_kelamin_kader', label: 'Jenis Kelamin', type: 'select', options: jenisKelaminOptions },
      { name: 'alamat_kader', label: 'Alamat Kader', type: 'textarea' },
      { name: 'no_telepon_kader', label: 'No. Telepon/HP Kader', type: 'text' },
      { name: 'bidang_kaderisasi', label: 'Bidang Kaderisasi', type: 'text', required: true, placeholder: 'Kesehatan, Posyandu, TPK, Pemberdayaan' },
      { name: 'tahun_aktif', label: 'Tahun Aktif', type: 'number', required: true, placeholder: 'YYYY' },
      { name: 'tanggal_pelatihan_diterima', label: 'Tgl Pelatihan Terakhir', type: 'date' },
      { name: 'status_keaktifan', label: 'Status Keaktifan', type: 'select', options: ['Aktif', 'Tidak Aktif'] },
      { name: 'keterangan', label: 'Keterangan (Prestasi, dll)', type: 'textarea' },
    ],
  },

  // Administrasi Lainnya (BPD & Lembaga)
  {
    key: 'buku_surat_keluar_bpd', label: 'Buku Surat Keluar BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <PaperAirplaneIcon {...commonIconProps} />,
    fields: [
      { name: 'tanggal', label: 'Tanggal Surat Keluar', type: 'date', required: true },
      { name: 'nomor_surat', label: 'Nomor Surat Keluar BPD', type: 'text', required: true },
      { name: 'tujuan', label: 'Tujuan Surat', type: 'text', required: true },
      { name: 'perihal_surat_bpd', label: 'Perihal Surat', type: 'textarea', required: true },
      { name: 'lampiran_bpd', label: 'Lampiran', type: 'text' },
      { name: 'isi_ringkas', label: 'Isi Ringkas Surat', type: 'textarea' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_surat_masuk_bpd', label: 'Buku Surat Masuk BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <InboxArrowDownIcon {...commonIconProps} />,
    fields: [
      { name: 'tanggal', label: 'Tanggal Surat (Asli)', type: 'date' },
      { name: 'tanggal_surat_diterima', label: 'Tanggal Diterima BPD', type: 'date', required: true },
      { name: 'nomor_surat', label: 'Nomor Surat Masuk', type: 'text', required: true },
      { name: 'pengirim', label: 'Pengirim Surat', type: 'text', required: true },
      { name: 'perihal_surat_bpd', label: 'Perihal Surat', type: 'textarea', required: true },
      { name: 'isi_ringkas', label: 'Isi Ringkas Surat', type: 'textarea' },
      { name: 'disposisi_bpd', label: 'Disposisi BPD', type: 'textarea' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_ekspedisi_bpd', label: 'Buku Ekspedisi BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
        { name: 'tanggal', label: 'Tanggal Kirim', type: 'date', required: true },
        { name: 'nomor_surat_dikirim_bpd', label: 'No. Surat Dikirim', type: 'text', required: true },
        { name: 'tujuan', label: 'Tujuan Surat/Penerima', type: 'text', required: true },
        { name: 'isi_ringkas', label: 'Isi Ringkas/Perihal', type: 'textarea' },
        { name: 'nama_penerima_bpd', label: 'Nama Penerima (Ekspedisi)', type: 'text' },
        { name: 'keterangan', label: 'Keterangan (Paraf)', type: 'textarea' },
    ],
  },
  {
    key: 'buku_data_inventaris_bpd', label: 'Buku Data Inventaris BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <FolderIcon {...commonIconProps} />,
    fields: [
        { name: 'kode_barang_bpd', label: 'Kode Barang BPD', type: 'text' },
        { name: 'nama_barang', label: 'Nama Barang', type: 'text', required: true },
        { name: 'merk_tipe_bpd', label: 'Merk/Tipe', type: 'text' },
        { name: 'jumlah', label: 'Jumlah', type: 'number', required: true },
        { name: 'satuan_barang_bpd', label: 'Satuan', type: 'text', placeholder: 'Unit, Buah, Set'},
        { name: 'tahun_perolehan_bpd', label: 'Tahun Perolehan', type: 'number', placeholder: 'YYYY' },
        { name: 'sumber_perolehan_bpd', label: 'Sumber Perolehan', type: 'text' },
        { name: 'harga_perolehan_bpd', label: 'Harga Perolehan (Rp)', type: 'number' },
        { name: 'kondisi', label: 'Kondisi', type: 'select', options: kondisiBarangOptions, required: true },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_laporan_keuangan_bpd', label: 'Buku Laporan Keuangan BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <BanknotesIcon {...commonIconProps} />,
    fields: [
        { name: 'tahun', label: 'Tahun Anggaran', type: 'number', required: true, placeholder: 'YYYY' },
        { name: 'jenis_transaksi_bpd', label: 'Jenis Transaksi', type: 'select', options: ['Penerimaan', 'Pengeluaran']},
        { name: 'nomor_bukti_transaksi_bpd', label: 'No. Bukti Transaksi', type: 'text' },
        { name: 'uraian', label: 'Uraian Transaksi', type: 'text', required: true },
        { name: 'jumlah', label: 'Jumlah (Rp)', type: 'number', required: true },
        { name: 'sumber_dana_anggaran_bpd', label: 'Sumber Dana/Anggaran', type: 'text' },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_tamu_bpd', label: 'Buku Tamu BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <UsersIcon {...commonIconProps} />,
    fields: [
        { name: 'nama', label: 'Nama Tamu', type: 'text', required: true },
        { name: 'alamat', label: 'Alamat Tamu', type: 'text', required: true },
        { name: 'instansi_tamu_bpd', label: 'Instansi Tamu', type: 'text' },
        { name: 'jabatan_tamu_bpd', label: 'Jabatan Tamu', type: 'text' },
        { name: 'nomor_telepon_tamu_bpd', label: 'No. Telepon/HP Tamu', type: 'text' },
        { name: 'tanggal', label: 'Tanggal Kunjungan', type: 'date', required: true },
        { name: 'keperluan', label: 'Keperluan', type: 'textarea', required: true },
    ],
  },
  {
    key: 'buku_anggota_bpd', label: 'Buku Anggota BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <UsersIcon {...commonIconProps} />,
    fields: [
        { name: 'nama', label: 'Nama Anggota BPD', type: 'text', required: true },
        { name: 'nik_anggota_bpd', label: 'NIK Anggota BPD', type: 'text' },
        { name: 'jabatan', label: 'Jabatan di BPD', type: 'text', required: true, placeholder: 'Ketua, Wakil, Sekretaris, Anggota' },
        { name: 'tempat_tanggal_lahir_anggota_bpd', label: 'Tempat, Tanggal Lahir', type: 'text', placeholder: 'Contoh: Jakarta, 1980-01-15' },
        { name: 'jenis_kelamin_anggota_bpd', label: 'Jenis Kelamin', type: 'select', options: jenisKelaminOptions },
        { name: 'pendidikan_terakhir_anggota_bpd', label: 'Pendidikan Terakhir', type: 'text' },
        { name: 'nomor_sk_pengangkatan_bpd', label: 'No. SK Pengangkatan BPD', type: 'text' },
        { name: 'tanggal_sk_pengangkatan_bpd', label: 'Tgl SK Pengangkatan BPD', type: 'date' },
        { name: 'awal_periode_jabatan_bpd', label: 'Awal Periode Jabatan', type: 'number', placeholder: 'YYYY' },
        { name: 'akhir_periode_jabatan_bpd', label: 'Akhir Periode Jabatan', type: 'number', placeholder: 'YYYY' },
        { name: 'alamat', label: 'Alamat Lengkap', type: 'textarea', required: true },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_kegiatan_bpd', label: 'Buku Kegiatan BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
        { name: 'tanggal', label: 'Tanggal Kegiatan', type: 'date', required: true },
        { name: 'jenis_kegiatan_bpd', label: 'Jenis Kegiatan', type: 'text', placeholder: 'Rapat, Kunker, Sosialisasi, Musyawarah' },
        { name: 'kegiatan', label: 'Nama/Tema Kegiatan', type: 'text', required: true },
        { name: 'tempat_kegiatan_bpd', label: 'Tempat Kegiatan', type: 'text' },
        { name: 'pemimpin_kegiatan_bpd', label: 'Pemimpin Kegiatan', type: 'text' },
        { name: 'jumlah_peserta_bpd', label: 'Jumlah Peserta', type: 'number' },
        { name: 'keterangan', label: 'Keterangan (Hasil, Kesimpulan)', type: 'textarea' },
    ],
  },
  {
    key: 'buku_aspirasi_masyarakat', label: 'Buku Aspirasi Masyarakat (BPD)', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
        { name: 'tanggal', label: 'Tanggal Penyampaian', type: 'date', required: true },
        { name: 'nama', label: 'Nama Penyampai Aspirasi', type: 'text', required: true },
        { name: 'alamat_penyampai_aspirasi', label: 'Alamat Penyampai', type: 'text' },
        { name: 'kontak_penyampai_aspirasi', label: 'Kontak Penyampai (HP/Email)', type: 'text' },
        { name: 'topik_aspirasi', label: 'Topik Aspirasi', type: 'text' },
        { name: 'aspirasi', label: 'Isi Aspirasi', type: 'textarea', required: true },
        { name: 'media_penyampaian', label: 'Media Penyampaian', type: 'text', placeholder: 'Langsung, Surat, Online, Kotak Saran' },
        { name: 'tindak_lanjut_bpd', label: 'Tindak Lanjut BPD', type: 'textarea' },
        { name: 'status_aspirasi', label: 'Status Aspirasi', type: 'select', options: ['Diterima', 'Diproses', 'Selesai Ditindaklanjuti', 'Belum Ditindaklanjuti'] },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_absensi_rapat_bpd', label: 'Buku Absensi Rapat BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <UsersIcon {...commonIconProps} />,
    fields: [
        { name: 'tanggal', label: 'Tanggal Rapat', type: 'date', required: true },
        { name: 'agenda_rapat_bpd', label: 'Agenda Rapat', type: 'text', required: true },
        { name: 'nama', label: 'Nama Peserta Rapat', type: 'text', required: true },
        { name: 'jabatan_peserta_bpd', label: 'Jabatan Peserta', type: 'text', placeholder: 'Anggota BPD, Perangkat Desa, Tokoh Masyarakat' },
        { name: 'status_kehadiran_bpd', label: 'Status Kehadiran', type: 'select', options: statusKehadiranOptions },
        { name: 'tanda_tangan', label: 'Tanda Tangan (Catatan)', type: 'text', placeholder: 'Paraf atau TTD' },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_notulen_rapat_bpd', label: 'Buku Notulen Rapat BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
        { name: 'tanggal', label: 'Tanggal Rapat', type: 'date', required: true },
        { name: 'agenda_rapat_bpd_notulen', label: 'Agenda Rapat', type: 'text', required: true },
        { name: 'pemimpin_rapat_bpd', label: 'Pemimpin Rapat', type: 'text' },
        { name: 'notulis_rapat_bpd', label: 'Notulis Rapat', type: 'text' },
        { name: 'daftar_hadir_terlampir', label: 'Daftar Hadir Terlampir', type: 'text', placeholder: 'Ya/Tidak atau No. Ref Absensi' },
        { name: 'isi_ringkas', label: 'Isi Ringkas Notulen (Pembahasan)', type: 'textarea', required: true },
        { name: 'keputusan_rapat_lengkap', label: 'Keputusan Rapat (Lengkap)', type: 'textarea' },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_peraturan_keputusan_bpd', label: 'Buku Peraturan & Keputusan BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
        { name: 'jenis_dokumen_bpd', label: 'Jenis Dokumen', type: 'select', options: ['Peraturan BPD', 'Keputusan BPD'] },
        { name: 'tanggal', label: 'Tanggal Penetapan', type: 'date', required: true },
        { name: 'nomor', label: 'Nomor Peraturan/Keputusan', type: 'text', required: true },
        { name: 'judul', label: 'Judul Peraturan/Keputusan', type: 'text', required: true },
        { name: 'tentang_bpd', label: 'Tentang (Isi Pokok)', type: 'textarea' },
        { name: 'dasar_hukum_bpd', label: 'Dasar Hukum', type: 'textarea' },
        { name: 'status_dokumen_bpd', label: 'Status Dokumen', type: 'select', options: statusPeraturanOptions },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_keputusan_musyawarah_bpd', label: 'Buku Keputusan Musyawarah BPD', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
        { name: 'tanggal', label: 'Tanggal Musyawarah', type: 'date', required: true },
        { name: 'agenda_musyawarah_bpd', label: 'Agenda Musyawarah', type: 'text', required: true },
        { name: 'nomor', label: 'Nomor Keputusan Musyawarah', type: 'text', required: true },
        { name: 'pemimpin_musyawarah_bpd', label: 'Pemimpin Musyawarah', type: 'text' },
        { name: 'jumlah_peserta_musyawarah_bpd', label: 'Jumlah Peserta', type: 'number' },
        { name: 'daftar_hadir_musyawarah_lampiran', label: 'Daftar Hadir Terlampir', type: 'text', placeholder: 'Ya/Tidak' },
        { name: 'isi_ringkas', label: 'Isi Ringkas Keputusan Musyawarah', type: 'textarea', required: true },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_keputusan_musyawarah_perencanaan', label: 'Buku Kep. Musyawarah Perencanaan Desa', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <DocumentTextIcon {...commonIconProps} />,
    fields: [
        { name: 'tanggal', label: 'Tanggal Musyawarah Perencanaan', type: 'date', required: true },
        { name: 'jenis_musyawarah_perencanaan', label: 'Jenis Musyawarah', type: 'text', placeholder: 'Musrenbangdes, Musdes Khusus RPJMDes, dll.' },
        { name: 'agenda_musrenbang', label: 'Agenda Musyawarah', type: 'text', required: true },
        { name: 'nomor', label: 'Nomor Keputusan Musyawarah', type: 'text', required: true },
        { name: 'pemimpin_musrenbang', label: 'Pemimpin Musyawarah', type: 'text' },
        { name: 'jumlah_peserta_musrenbang', label: 'Jumlah Peserta', type: 'number' },
        { name: 'usulan_prioritas_disepakati', label: 'Usulan Prioritas Disepakati', type: 'textarea' },
        { name: 'isi_ringkas', label: 'Isi Ringkas Keputusan', type: 'textarea', required: true },
        { name: 'keterangan', label: 'Keterangan (Peserta, Notulen)', type: 'textarea' },
    ],
  },
  {
    key: 'buku_pengurus_lembaga', label: 'Buku Pengurus Lembaga Desa', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <UsersIcon {...commonIconProps} />,
    fields: [
        { name: 'lembaga', label: 'Nama Lembaga Kemasyarakatan Desa', type: 'text', required: true, placeholder: 'LPMD, PKK, Karang Taruna, RT, RW, dll.' },
        { name: 'nama', label: 'Nama Pengurus', type: 'text', required: true },
        { name: 'nik_pengurus', label: 'NIK Pengurus', type: 'text' },
        { name: 'jabatan', label: 'Jabatan dalam Lembaga', type: 'text', required: true },
        { name: 'alamat_pengurus', label: 'Alamat Pengurus', type: 'textarea' },
        { name: 'no_telepon_pengurus', label: 'No. Telepon/HP Pengurus', type: 'text' },
        { name: 'nomor_sk_pengangkatan_lembaga', label: 'No. SK Pengangkatan', type: 'text' },
        { name: 'tanggal_sk_pengangkatan_lembaga', label: 'Tgl SK Pengangkatan', type: 'date' },
        { name: 'masa_bakti_pengurus', label: 'Masa Bakti', type: 'text', placeholder: 'e.g. 2023-2028' },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'buku_absensi_aparat', label: 'Buku Absensi Aparat Desa', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <UsersIcon {...commonIconProps} />,
    fields: [
        { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
        { name: 'nama', label: 'Nama Aparat', type: 'text', required: true },
        { name: 'jabatan', label: 'Jabatan', type: 'text', required: true },
        { name: 'jam_datang', label: 'Jam Datang', type: 'text', placeholder: 'HH:MM' },
        { name: 'jam_pulang', label: 'Jam Pulang', type: 'text', placeholder: 'HH:MM' },
        { name: 'status_kehadiran', label: 'Status Kehadiran', type: 'select', options: statusKehadiranOptions, required: true },
        { name: 'tanda_tangan_aparat', label: 'Tanda Tangan (Catatan)', type: 'text', placeholder: 'Paraf atau TTD' },
        { name: 'keterangan', label: 'Keterangan', type: 'text' },
    ],
  },
  {
    key: 'buku_tamu_umum', label: 'Buku Tamu Umum Desa', category: BOOK_CATEGORIES.ADMINISTRASI_LAINNYA, icon: <UsersIcon {...commonIconProps} />,
    fields: [
        { name: 'nama', label: 'Nama Tamu', type: 'text', required: true },
        { name: 'alamat', label: 'Alamat Tamu', type: 'text', required: true },
        { name: 'instansi_tamu', label: 'Nama Instansi (Jika ada)', type: 'text'},
        { name: 'jabatan_tamu', label: 'Jabatan Tamu (Jika ada)', type: 'text'},
        { name: 'nomor_telepon_tamu', label: 'No. Telepon/HP Tamu', type: 'text'},
        { name: 'tanggal', label: 'Tanggal Kunjungan', type: 'date', required: true },
        { name: 'keperluan', label: 'Keperluan', type: 'textarea', required: true },
        { name: 'tujuan_pejabat_ditemui', label: 'Pejabat/Staf Desa yang Ditemui', type: 'text'},
    ],
  },
  // New Menu Item for Surat Maker
  {
    key: PEMBUAT_SURAT_KEY,
    label: 'Buat Surat Desa',
    category: BOOK_CATEGORIES.PEMBUAT_SURAT,
    icon: <PencilSquareIcon {...commonIconProps} />,
    fields: [], // No standard book fields, custom form in component
  },
];

export const PLANNING_ICON = <ClipboardDocumentListIcon {...commonIconProps} />;
export const DEFAULT_PASSWORD = "admin123"; 
export const CUSTOM_PASSWORD_STORAGE_KEY = "digitalDesaCustomPassword";
