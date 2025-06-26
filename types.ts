import React from 'react'; // Added for React.ReactElement and React.SVGProps

// Base types
export interface FieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'file'; // Added 'file' type
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select type
  accept?: string; // For file type, e.g., 'image/*'
}

export interface BookDefinition {
  key: string;
  label: string;
  category: string;
  fields: FieldDefinition[];
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

export interface GenericEntry {
  id: number;
  [key: string]: any;
}

// Data Desa
export const DATA_DESA_KEY = 'data_desa_umum';
export const USAGE_GUIDE_KEY = 'usage_guide'; 
export const PEMBUAT_SURAT_KEY = 'pembuat_surat'; // New Key for Surat Maker

export interface DataDesaEntry extends GenericEntry { // id will be fixed to 1
  nama_desa?: string;
  kode_desa?: string;
  nama_kepala_desa?: string;
  alamat_kantor_desa?: string;
  nomor_telepon_kantor_desa?: string;
  email_desa?: string;
  website_desa?: string;
  luas_wilayah?: string; // e.g. "150.5 Ha" or "1.5 km2"
  jumlah_dusun?: number;
  jumlah_rw?: number;
  jumlah_rt?: number;
  nama_kecamatan?: string;
  nama_kabupaten_kota?: string;
  nama_provinsi?: string;
  logo_desa_path?: string; // Path, URL, or base64 data URL to logo image file
  installation_id?: string; // Added for single-install mechanism
}

// Surat Maker Data Types
export interface KlasifikasiSuratKeterangan {
  kode: string; // e.g., "470/01"
  label: string; // e.g., "Surat Keterangan Domisili"
  deskripsiSingkat: string; // e.g., "Menerangkan domisili penduduk"
}

export interface SuratUndanganFormData {
  nomor_surat: string;
  lampiran?: string;
  perihal: string;
  tanggal_surat: string; // YYYY-MM-DD
  kepada_yth: string; // Tujuan surat (multiline)
  di_tempat: string; // "di - Tempat" or specific location
  isi_pembuka: string; // e.g., Dengan hormat, mengharap kehadiran Bapak/Ibu/Saudara/i
  isi_acara: string;
  isi_tanggal_acara: string; // YYYY-MM-DD
  isi_waktu_acara: string; // e.g., "09:00 WIB - Selesai"
  isi_tempat_acara: string;
  isi_penutup: string; // e.g., Demikian undangan ini kami sampaikan...
  nama_penandatangan: string;
  jabatan_penandatangan: string;
  nama_tembusan?: string; // Tembusan (multiline)
}

export interface SuratPemberitahuanFormData {
  nomor_surat: string;
  lampiran?: string;
  perihal: string;
  tanggal_surat: string; // YYYY-MM-DD
  kepada_yth: string; // Tujuan surat (multiline)
  di_tempat: string;
  isi_pembuka: string; // e.g., Dengan hormat, bersama ini kami sampaikan...
  isi_pemberitahuan: string; // Main content (multiline)
  isi_penutup: string; // e.g., Demikian pemberitahuan ini kami sampaikan...
  nama_penandatangan: string;
  jabatan_penandatangan: string;
  nama_tembusan?: string; // Tembusan (multiline)
}

export interface SuratKeteranganFormData {
  nomor_surat: string; // Format: [Kode Klasifikasi]/[Nomor Urut Input]/[Kode Desa Kemendagri]/[Tahun] - AUTO GENERATED
  klasifikasi_surat_kode: string; // e.g., "470/01" - User selected
  nomor_urut_input: string; // e.g., "001", "123" - User input for sequence
  tanggal_surat: string; // YYYY-MM-DD
  // Data Pemohon
  nama_pemohon: string;
  nik_pemohon: string;
  tempat_lahir_pemohon: string;
  tanggal_lahir_pemohon: string; // YYYY-MM-DD
  jenis_kelamin_pemohon: string;
  agama_pemohon: string;
  status_perkawinan_pemohon: string;
  pekerjaan_pemohon: string;
  alamat_pemohon: string; // Textarea: RT/RW, Dusun, Desa (otomatis), Kec (otomatis), Kab (otomatis)
  // Keperluan
  keperluan: string; // Textarea for specific details, main purpose from klasifikasi
  detail_keperluan_data?: Record<string, any>; // For structured specific details based on letter type
  // Penandatangan
  nama_penandatangan: string;
  jabatan_penandatangan: string;
}


export type AnyLetterFormData = SuratUndanganFormData | SuratPemberitahuanFormData | SuratKeteranganFormData;
export type LetterType = 'undangan' | 'pemberitahuan' | 'keterangan';


// Administrasi Umum
export interface BukuPeraturan extends GenericEntry {
  nomor_peraturan: string;
  nama_peraturan: string;
  tentang: string;
  jenis_peraturan?: string; // e.g., Perdes, Peraturan Bersama Kades
  tanggal_ditetapkan: string; // YYYY-MM-DD
  tanggal_diundangkan?: string; // YYYY-MM-DD
  nomor_lembaran_desa?: string;
  status_peraturan?: string; // e.g., Berlaku, Dicabut, Diubah
  keterangan?: string;
}

export interface BukuKeputusanKades extends GenericEntry {
  nomor_keputusan: string;
  nama_keputusan: string;
  tentang: string;
  tanggal_keputusan: string; // YYYY-MM-DD
  dasar_hukum?: string;
  status_keputusan?: string; // e.g., Berlaku, Dicabut
  keterangan?: string;
}

export interface BukuInventaris extends GenericEntry {
  kode_barang?: string;
  nama_barang: string;
  merk_tipe?: string;
  jumlah: number;
  satuan_barang?: string; // e.g., unit, buah, set
  tahun_perolehan?: string; // YYYY
  sumber_perolehan?: string; // APBDes, Bantuan Provinsi, Hibah, dll.
  harga_perolehan?: number;
  kondisi: string; // Baik, Rusak Ringan, Rusak Berat
  lokasi_penyimpanan?: string;
  keterangan?: string;
}

export interface BukuAparat extends GenericEntry {
  nama: string;
  nik?: string;
  nip?: string;
  jabatan: string;
  tempat_lahir?: string;
  tanggal_lahir?: string; // YYYY-MM-DD
  jenis_kelamin?: string; // Laki-laki, Perempuan
  pendidikan_terakhir?: string;
  status_kepegawaian?: string; // PNS, PTT, Honorer, Perangkat Desa
  nomor_sk_pengangkatan?: string;
  tanggal_sk_pengangkatan?: string; // YYYY-MM-DD
  nomor_sk_pemberhentian?: string;
  tanggal_sk_pemberhentian?: string; // YYYY-MM-DD
  alamat: string;
  no_telepon?: string;
  email?: string;
}

export interface BukuTanah extends GenericEntry { // Common for Tanah Kas & Tanah Desa
  lokasi: string;
  luas: string; // e.g., "1000 m2" or "1.5 Ha"
  nomor_sertifikat?: string;
  jenis_hak?: string; // Hak Milik, Hak Guna Bangunan, dll.
  status: string; // e.g., "Sertifikat Hak Milik No. 123 Atas Nama Desa X"
  batas_utara?: string;
  batas_selatan?: string;
  batas_timur?: string;
  batas_barat?: string;
  penggunaan_saat_ini?: string;
  nilai_aset_tanah?: number;
  keterangan?: string;
}

export interface BukuAgendaSuratMasuk extends GenericEntry {
  tanggal_diterima: string; // YYYY-MM-DD
  nomor_surat_masuk: string;
  tanggal_surat: string; // YYYY-MM-DD (date on the letter itself)
  pengirim: string;
  perihal_surat: string;
  lampiran_surat_masuk?: string; // e.g. "3 berkas"
  disposisi_kepada?: string;
  isi_disposisi?: string;
  keterangan?: string;
}

export interface BukuAgendaSuratKeluar extends GenericEntry {
  tanggal_kirim: string; // YYYY-MM-DD
  nomor_surat_keluar: string;
  tujuan_surat: string;
  perihal_surat: string;
  lampiran_surat_keluar?: string;
  pengolah_surat?: string; // Unit/person who prepared the letter
  keterangan?: string;
}

export interface BukuEkspedisi extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  nomor_surat_dikirim: string;
  tujuan: string;
  isi_ringkas: string; // Perihal/Subjek surat
  nama_penerima?: string;
  tanggal_diterima_penerima?: string; // YYYY-MM-DD
  keterangan?: string;
}

export interface BukuLembaranBerita extends GenericEntry {
  nomor_lembaran_berita_desa?: string;
  tanggal: string; // YYYY-MM-DD
  judul: string;
  jenis_publikasi?: string; // Pengumuman, Berita Desa
  isi_ringkas: string;
  keterangan?: string;
}

// Administrasi Penduduk
export interface BukuIndukPenduduk extends GenericEntry {
  nomor_kk: string;
  nik: string;
  nama: string;
  tempat_lahir?: string;
  tanggal_lahir?: string; // YYYY-MM-DD
  jenis_kelamin?: string; // Laki-laki, Perempuan
  alamat: string;
  rt?: string;
  rw?: string;
  agama?: string;
  status_perkawinan?: string;
  pekerjaan?: string;
  kewarganegaraan?: string; // WNI, WNA
  pendidikan_terakhir?: string;
  nama_ayah?: string;
  nama_ibu?: string;
  golongan_darah?: string; // A, B, AB, O, Tidak Tahu
  status_hubungan_dalam_keluarga?: string; // Kepala Keluarga, Istri, Anak, dll.
  keterangan?: string;
}

export interface BukuMutasiPenduduk extends GenericEntry {
  nik: string;
  nama: string;
  jenis_mutasi: string; // Lahir, Mati, Pindah Keluar, Datang Masuk
  tanggal: string; // YYYY-MM-DD
  // For Lahir
  tempat_dilahirkan?: string;
  penolong_kelahiran?: string;
  // For Mati
  tempat_meninggal?: string;
  sebab_meninggal?: string;
  // For Pindah Keluar
  alamat_tujuan_pindah?: string;
  alasan_pindah?: string;
  klasifikasi_pindah?: string; // Antar Desa, Antar Kecamatan, Antar Kab/Kota, Antar Provinsi
  // For Datang Masuk
  alamat_asal_datang?: string;
  alasan_datang?: string;
  klasifikasi_datang?: string;
  keterangan?: string;
}

export interface BukuRekapPenduduk extends GenericEntry {
  bulan: string; // Nama bulan, e.g., "Januari"
  tahun: string; // e.g., "2024"
  jumlah_penduduk_awal_bulan?: number;
  jumlah_lahir?: number;
  jumlah_mati?: number;
  jumlah_pindah_keluar?: number;
  jumlah_datang_masuk?: number;
  jumlah_penduduk_akhir_bulan: number;
  jumlah_laki_laki?: number;
  jumlah_perempuan?: number;
  jumlah_kk?: number;
  keterangan?: string;
}

export interface BukuPendudukSementara extends GenericEntry {
  nama: string;
  nik?: string;
  jenis_kelamin?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string; // YYYY-MM-DD
  pekerjaan?: string;
  kewarganegaraan?: string;
  alamat_asal?: string;
  alamat_tinggal_sementara: string;
  maksud_kedatangan?: string;
  tanggal_datang: string; // YYYY-MM-DD
  rencana_tinggal_sampai?: string; // YYYY-MM-DD
  keterangan?: string;
}

export interface BukuKtpKk extends GenericEntry {
  tanggal_pengajuan: string; // YYYY-MM-DD
  nik_pemohon: string;
  nama_pemohon: string;
  nomor_kk_lama?: string; // Jika ada
  nomor_kk_baru?: string; // Jika sudah terbit
  jenis_permohonan: string; // KTP Baru, KK Baru, Perubahan Data KTP, Perubahan Data KK, dll.
  status_dokumen?: string; // Diajukan, Diproses, Selesai, Diambil
  tanggal_selesai_diproses?: string; // YYYY-MM-DD
  keterangan?: string;
}

// Administrasi Keuangan
export interface BukuApbdes extends GenericEntry {
  id_rkp_induk?: number; // Foreign key to buku_rkp.id
  tahun_apbdes: string; // YYYY - Renamed from 'tahun' for clarity
  kode_rekening: string;
  uraian: string; // Nama Akun (Pendapatan/Belanja/Pembiayaan)
  jenis_anggaran?: string; // Pendapatan, Belanja, Pembiayaan
  sumber_dana?: string; // Untuk Pendapatan (ADD, DD, PADes, dll.)
  bidang_kegiatan?: string; // Untuk Belanja (Penyelenggaraan Pemdes, Pembangunan, Pembinaan, Pemberdayaan)
  jumlah: number; // Anggaran
  volume?: string;
  satuan?: string;
  harga_satuan?: number;
  keterangan?: string;
}

export interface BukuPenjabaranApbdes extends GenericEntry {
  tahun: string; // YYYY
  kode_rekening_kegiatan: string;
  nama_kegiatan: string;
  sub_kegiatan?: string;
  uraian_detail: string; // Rincian objek belanja
  target_output_kegiatan?: string;
  volume_detail?: string;
  satuan_detail?: string;
  harga_satuan_detail?: number;
  jumlah: number; // Anggaran per rincian objek
  keterangan?: string;
}

export interface BukuRka extends GenericEntry { // Rencana Kegiatan dan Anggaran
  tahun: string; // YYYY
  kode_kegiatan: string;
  kegiatan: string; // Nama Kegiatan
  sumber_dana_rka?: string;
  penanggung_jawab_kegiatan?: string;
  lokasi_kegiatan?: string;
  waktu_pelaksanaan?: string; // e.g., "Jan-Mar 2024"
  anggaran: number;
  keterangan?: string;
}

export interface BukuKasUmum extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  nomor_bukti_kas: string;
  kode_rekening_transaksi?: string;
  uraian: string;
  penerimaan?: number;
  pengeluaran?: number;
  saldo: number;
  keterangan?: string;
}

export interface BukuKasPembantu extends GenericEntry {
  kegiatan: string; // Nama Kegiatan terkait (dari RKA/APBDes)
  kode_rekening_kegiatan_terkait?: string;
  tanggal: string; // YYYY-MM-DD
  nomor_bukti_kas_pembantu: string;
  uraian_transaksi_pembantu: string;
  penerimaan?: number;
  pengeluaran?: number;
  saldo: number;
  keterangan?: string;
}

export interface BukuBank extends GenericEntry {
  nama_bank: string;
  nomor_rekening_desa: string;
  tanggal: string; // YYYY-MM-DD
  nomor_bukti_bank: string;
  uraian: string;
  masuk?: number;
  keluar?: number;
  saldo: number;
  keterangan?: string;
}

export interface BukuPanjar extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  nomor_bukti_panjar: string;
  penerima_panjar: string;
  uraian: string; // Keperluan panjar
  jumlah: number;
  batas_waktu_pertanggungjawaban?: string; // YYYY-MM-DD
  tanggal_pertanggungjawaban?: string; // YYYY-MM-DD
  jumlah_dipertanggungjawabkan?: number;
  sisa_kurang_panjar?: number;
  keterangan?: string;
}

// Administrasi Pembangunan
export interface BukuRpjmdes extends GenericEntry {
  tahun_awal_periode: number; // YYYY
  tahun_akhir_periode: number; // YYYY
  nomor_perdes_rpjmdes: string;
  tanggal_penetapan_perdes: string; // YYYY-MM-DD, (was tanggal_perdes_rpjmdes)
  tanggal_diundangkan_perdes?: string; // YYYY-MM-DD (new)
  nomor_lembaran_desa_rpjmdes?: string; // (new)
  tanggal_musdes_penetapan_rpjmdes?: string; // YYYY-MM-DD (Musdes for RPJMDes approval, new)
  nomor_berita_acara_musdes_rpjmdes?: string; // (new)
  dokumen_rpjmdes_final_link?: string; // (was dokumen_rpjmdes_link, for URL/Path to final doc)
  visi_desa: string; // textarea
  misi_desa: string; // textarea
  potensi_dan_masalah_utama?: string; // textarea (new, combines potential and problems)
  arah_kebijakan_pembangunan_desa?: string; // textarea (new, replaces strategi_arah_kebijakan)
  prioritas_program_bidang_penyelenggaraan_pemerintahan?: string; // textarea (new, more specific than program_unggulan_desa)
  prioritas_program_bidang_pelaksanaan_pembangunan?: string; // textarea (new)
  prioritas_program_bidang_pembinaan_kemasyarakatan?: string; // textarea (new)
  prioritas_program_bidang_pemberdayaan_masyarakat?: string; // textarea (new)
  prioritas_program_bidang_penanggulangan_bencana_darurat_mendesak?: string; // textarea (new)
  indikator_kinerja_utama_desa_rpjmdes?: string; // textarea (new, summary of KPIs, replaces indikator_kinerja_kunci)
  pagu_indikatif_rpjmdes?: number; // (new, numeric total indicative budget, replaces sumber_pendanaan_indikatif for value)
  ringkasan_sumber_pendanaan_rpjmdes?: string; // textarea (new, textual description of funding sources)
  lampiran_dokumen_pendukung_rpjmdes?: string; // textarea (new, list/describe attachments)
  tim_penyusun_rpjmdes_dan_sk?: string; // textarea (new, info about team and their SK)
  status_rpjmdes?: string; // 'Berlaku', 'Dalam Penyusunan', 'Revisi', 'Tidak Berlaku' - options to be updated
  catatan_revisi_rpjmdes?: string; // textarea (new)
  keterangan?: string;

  // New fields for detailed RPJMDes Document structure
  kata_pengantar_rpjmdes_narasi?: string; // textarea
  // BAB I
  bab1_latar_belakang_konteks_umum?: string; // textarea
  bab1_maksud_tujuan_narasi?: string; // textarea
  bab1_dasar_hukum_tambahan?: string; // textarea (specific local regulations)
  bab1_tahapan_pembentukan_tim_narasi?: string; // textarea
  bab1_tahapan_penyelarasan_arah_kebijakan_narasi?: string; // textarea
  bab1_tahapan_mengkaji_sdgs_narasi?: string; // textarea
  bab1_tahapan_mengkaji_rencana_program_narasi?: string; // textarea
  bab1_tahapan_penyusunan_rancangan_narasi?: string; // textarea
  bab1_tahapan_musrenbang_narasi?: string; // textarea
  bab1_tahapan_musdes_penetapan_narasi?: string; // textarea
  bab1_tahapan_sosialisasi_narasi?: string; // textarea
  // BAB II
  bab2_sejarah_desa_narasi?: string; // textarea
  bab2_kondisi_geografis_narasi?: string; // textarea
  bab2_demografi_narasi?: string; // textarea
  bab2_kesehatan_narasi?: string; // textarea
  bab2_pendidikan_narasi?: string; // textarea
  bab2_mata_pencaharian_narasi?: string; // textarea
  bab2_kesejahteraan_narasi?: string; // textarea
  bab2_agama_narasi?: string; // textarea
  bab2_budaya_narasi?: string; // textarea
  bab2_ekonomi_desa_narasi?: string; // textarea
  bab2_infrastruktur_desa_narasi?: string; // textarea
  bab2_pembagian_wilayah_narasi?: string; // textarea
  bab2_sotk_desa_narasi?: string; // textarea
  bab2_lembaga_bpd_narasi?: string; // textarea
  // BAB III
  bab3_visi_narasi?: string; // textarea
  bab3_misi_narasi?: string; // textarea
  bab3_nilai_nilai_narasi?: string; // textarea
  // BAB IV
  bab4_masalah_analisis?: string; // textarea
  bab4_potensi_analisis?: string; // textarea
  // BAB V
  bab5_arah_kebijakan_pembangunan_narasi?: string; // textarea
  bab5_arah_kebijakan_keuangan_narasi?: string; // textarea
  // BAB VI
  bab6_program_kegiatan_narasi_umum?: string; // textarea
  bab6_bidang_pemerintahan_narasi?: string; // textarea
  bab6_bidang_pembangunan_narasi?: string; // textarea
  bab6_bidang_pembinaan_narasi?: string; // textarea
  bab6_bidang_pemberdayaan_narasi?: string; // textarea
  bab6_bidang_bencana_narasi?: string; // textarea
  // BAB VII
  bab7_kesimpulan_narasi?: string; // textarea
  bab7_saran_narasi?: string; // textarea
  bab7_saran_tambahan_1?: string; // textarea
  bab7_saran_tambahan_2?: string; // textarea
  // Lampiran Checklist / Descriptions
  lampiran_sk_tim_penyusun?: string; // select: Ya/Tidak/NamaFile
  lampiran_rktl_tim_penyusun?: string;
  lampiran_peta_jalan_sdgs?: string;
  lampiran_data_rencana_program_kegiatan_masuk?: string;
  lampiran_gambar_bagan_kelembagaan?: string;
  lampiran_daftar_masalah_potensi_bagan_kelembagaan?: string;
  lampiran_gambar_peta_sosial_desa?: string;
  lampiran_daftar_masalah_potensi_sketsa_desa?: string;
  lampiran_gambar_kalender_musim?: string;
  lampiran_daftar_masalah_potensi_kalender_musim?: string;
  lampiran_gambar_pohon_masalah?: string;
  lampiran_daftar_masalah_potensi_pohon_masalah?: string;
  lampiran_daftar_inventarisir_masalah?: string;
  lampiran_daftar_inventarisir_potensi?: string;
  lampiran_pengkajian_tindakan_pemecahan_masalah?: string;
  lampiran_penentuan_tindakan_masalah?: string;
  lampiran_penentuan_peringkat_tindakan?: string;
  lampiran_daftar_gagasan_dusun_kelompok?: string;
  lampiran_rekapitulasi_gagasan_dusun_kelompok?: string;
  lampiran_rancangan_rpjm_desa?: string;
  lampiran_dokumen_visi_misi_kepala_desa?: string;
  lampiran_dokumen_pokok_pikiran_bpd?: string;
  lampiran_keputusan_tim_penyusun_dll?: string;
  lampiran_berita_acara_musyawarah?: string;
  lampiran_undangan_daftar_hadir_musyawarah?: string;
  lampiran_notulen_musyawarah?: string;
  lampiran_peta_desa?: string;
  lampiran_foto_kegiatan_desa?: string;
}


export interface BukuRkp extends GenericEntry { // Rencana Kerja Pemerintah Desa
  id_rpjmdes_induk?: number; // Foreign key to buku_rpjmdes.id
  tahun_rkp: string; // YYYY - Renamed from 'tahun' for clarity
  bidang_pembangunan: string; // Penyelenggaraan Pemerintahan Desa, Pelaksanaan Pembangunan Desa, dll.
  sub_bidang_kegiatan?: string;
  kegiatan: string; // Nama Kegiatan
  lokasi_pembangunan?: string;
  prakiraan_volume?: string;
  prakiraan_waktu_pelaksanaan?: string; // e.g., "Triwulan I"
  sumber_dana_direncanakan?: string;
  pola_pelaksanaan?: string; // Swakelola, Kerjasama Antar Desa, Pihak Ketiga
  anggaran: number;
  keterangan?: string;
}

export interface BukuKegiatanPembangunan extends GenericEntry {
  tahun: string; // YYYY
  id_rkp_terkait?: string; // Referensi ke Buku RKP
  kegiatan: string;
  sumber_dana_realisasi?: string;
  volume_realisasi?: string;
  satuan_realisasi?: string;
  realisasi: number; // Anggaran yang terealisasi
  persentase_kemajuan?: number; // 0-100
  tanggal_mulai_pelaksanaan?: string; // YYYY-MM-DD
  tanggal_selesai_pelaksanaan?: string; // YYYY-MM-DD
  kontraktor_pelaksana?: string; // Jika Pihak Ketiga
  masalah_hambatan?: string;
  keterangan?: string; // Progress, status, etc.
}

export interface BukuInventarisHasil extends GenericEntry { // Inventaris Hasil Pembangunan
  tahun: string; // YYYY
  jenis_pembangunan?: string; // Jalan, Jembatan, Gedung, Irigasi
  hasil: string; // Nama hasil pembangunan, e.g., "Jalan Rabat Beton RT 01"
  lokasi_aset_pembangunan?: string;
  jumlah: number; // Bisa jadi unit, panjang (meter), luas (m2)
  satuan_hasil?: string;
  nilai_aset?: number;
  sumber_dana_pembangunan_aset?: string;
  kondisi_aset_saat_ini?: string; // Baik, Perlu Perbaikan, Rusak
  foto_dokumentasi?: string; // Path/link or description
  keterangan?: string;
}

export interface BukuKader extends GenericEntry {
  nama: string;
  nik_kader?: string;
  jenis_kelamin_kader?: string;
  alamat_kader?: string;
  no_telepon_kader?: string;
  bidang_kaderisasi: string; // e.g., "Kesehatan", "Pemberdayaan", "Posyandu", "TPK"
  tahun_aktif: string; // YYYY
  tanggal_pelatihan_diterima?: string; // YYYY-MM-DD
  status_keaktifan?: string; // Aktif, Tidak Aktif
  keterangan?: string;
}

// Administrasi Lainnya (BPD & Lembaga)
export interface BukuSuratKeluarBpd extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  nomor_surat: string;
  tujuan: string;
  perihal_surat_bpd: string;
  lampiran_bpd?: string;
  isi_ringkas: string;
  keterangan?: string;
}

export interface BukuSuratMasukBpd extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  nomor_surat: string;
  tanggal_surat_diterima?: string; // YYYY-MM-DD
  pengirim: string;
  perihal_surat_bpd: string;
  isi_ringkas: string;
  disposisi_bpd?: string;
  keterangan?: string;
}

export interface BukuEkspedisiBpd extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  nomor_surat_dikirim_bpd: string;
  tujuan: string;
  isi_ringkas: string; // Perihal
  nama_penerima_bpd?: string;
  keterangan?: string;
}

export interface BukuDataInventarisBpd extends GenericEntry {
  kode_barang_bpd?: string;
  nama_barang: string;
  merk_tipe_bpd?: string;
  jumlah: number;
  satuan_barang_bpd?: string;
  tahun_perolehan_bpd?: string; // YYYY
  sumber_perolehan_bpd?: string;
  harga_perolehan_bpd?: number;
  kondisi: string;
  keterangan?: string;
}

export interface BukuLaporanKeuanganBpd extends GenericEntry {
  tahun: string; // YYYY
  jenis_transaksi_bpd?: string; // Penerimaan, Pengeluaran
  nomor_bukti_transaksi_bpd?: string;
  uraian: string;
  jumlah: number;
  sumber_dana_anggaran_bpd?: string;
  keterangan?: string;
}

export interface BukuTamu extends GenericEntry { // General or BPD specific, this is buku_tamu_umum
  nama: string;
  alamat: string; // Alamat Tamu
  instansi_tamu?: string;
  jabatan_tamu?: string;
  nomor_telepon_tamu?: string;
  tanggal: string; // YYYY-MM-DD
  keperluan: string;
  tujuan_pejabat_ditemui?: string; // Pejabat/Staf Desa yang dituju
}

export interface BukuTamuBpd extends GenericEntry { // Specific for BPD
  nama: string;
  alamat: string;
  instansi_tamu_bpd?: string;
  jabatan_tamu_bpd?: string;
  nomor_telepon_tamu_bpd?: string;
  tanggal: string; // YYYY-MM-DD
  keperluan: string;
}


export interface BukuAnggotaBpd extends GenericEntry {
  nama: string;
  nik_anggota_bpd?: string;
  jabatan: string; // Ketua, Wakil Ketua, Sekretaris, Anggota
  tempat_tanggal_lahir_anggota_bpd?: string; // Format: Tempat, YYYY-MM-DD
  jenis_kelamin_anggota_bpd?: string;
  pendidikan_terakhir_anggota_bpd?: string;
  nomor_sk_pengangkatan_bpd?: string;
  tanggal_sk_pengangkatan_bpd?: string; // YYYY-MM-DD
  awal_periode_jabatan_bpd?: string; // YYYY
  akhir_periode_jabatan_bpd?: string; // YYYY
  alamat: string;
  keterangan?: string;
}

export interface BukuKegiatanBpd extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  jenis_kegiatan_bpd?: string; // Rapat, Kunjungan Kerja, Sosialisasi, Musyawarah
  kegiatan: string; // Nama/Tema Kegiatan
  tempat_kegiatan_bpd?: string;
  pemimpin_kegiatan_bpd?: string;
  jumlah_peserta_bpd?: number;
  keterangan?: string; // Hasil, Kesimpulan
}

export interface BukuAspirasiMasyarakat extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  nama: string; // Nama Penyampai
  alamat_penyampai_aspirasi?: string;
  kontak_penyampai_aspirasi?: string; // No HP/Email
  topik_aspirasi?: string;
  aspirasi: string; // Isi Aspirasi
  media_penyampaian?: string; // Langsung, Surat, Online, Kotak Saran
  tindak_lanjut_bpd?: string;
  status_aspirasi?: string; // Diterima, Diproses, Selesai Ditindaklanjuti, Belum Ditindaklanjuti
  keterangan?: string;
}

export interface BukuAbsensiRapatBpd extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  agenda_rapat_bpd: string;
  nama: string; // Nama peserta
  jabatan_peserta_bpd?: string; // Anggota BPD, Perangkat Desa, Tokoh Masyarakat
  status_kehadiran_bpd?: string; // Hadir, Izin, Alpha
  tanda_tangan?: string; // Catatan "Paraf" atau "TTD"
  keterangan?: string;
}

export interface BukuNotulenRapatBpd extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  agenda_rapat_bpd_notulen: string;
  pemimpin_rapat_bpd?: string;
  notulis_rapat_bpd?: string;
  daftar_hadir_terlampir?: string; // Ya/Tidak atau No. Referensi Absensi
  isi_ringkas: string; // Poin-poin penting rapat, Pembahasan
  keputusan_rapat_lengkap?: string; // Keputusan-keputusan yang dihasilkan
  keterangan?: string;
}

export interface BukuPeraturanKeputusanBpd extends GenericEntry { // Peraturan & Keputusan BPD
  jenis_dokumen_bpd?: string; // Peraturan BPD, Keputusan BPD
  tanggal: string; // YYYY-MM-DD (Tanggal Penetapan)
  nomor: string;
  judul: string;
  tentang_bpd?: string; // Pokok isi
  dasar_hukum_bpd?: string;
  status_dokumen_bpd?: string; // Berlaku, Dicabut, Diubah
  keterangan?: string;
}

export interface BukuKeputusanMusyawarahBpd extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  agenda_musyawarah_bpd: string;
  nomor: string; // Nomor Keputusan Musyawarah
  pemimpin_musyawarah_bpd?: string;
  jumlah_peserta_musyawarah_bpd?: number;
  daftar_hadir_musyawarah_lampiran?: string; // Ya/Tidak
  isi_ringkas: string; // Isi Ringkas Keputusan Musyawarah
  keterangan?: string;
}

export interface BukuKeputusanMusyawarahPerencanaan extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  jenis_musyawarah_perencanaan?: string; // Musrenbangdes, Musdes Khusus RPJMDes, dll.
  agenda_musrenbang: string;
  nomor: string; // Nomor Keputusan Musyawarah
  pemimpin_musrenbang?: string;
  jumlah_peserta_musrenbang?: number;
  usulan_prioritas_disepakati?: string; // Dalam bentuk textarea atau poin-poin
  isi_ringkas: string; // Rangkuman hasil keputusan
  keterangan?: string;
}

export interface BukuPengurusLembaga extends GenericEntry {
  lembaga: string; // Nama lembaga, e.g., "LPMD", "Karang Taruna", "PKK", "RT", "RW"
  nama: string; // Nama Pengurus
  nik_pengurus?: string;
  jabatan: string; // Jabatan dalam Lembaga
  alamat_pengurus?: string;
  no_telepon_pengurus?: string;
  nomor_sk_pengangkatan_lembaga?: string;
  tanggal_sk_pengangkatan_lembaga?: string; // YYYY-MM-DD
  masa_bakti_pengurus?: string; // e.g., "2023-2028"
  keterangan?: string;
}

export interface BukuAbsensiAparat extends GenericEntry {
  tanggal: string; // YYYY-MM-DD
  nama: string;
  jabatan: string;
  jam_datang?: string; // HH:MM
  jam_pulang?: string; // HH:MM
  status_kehadiran: string; // Hadir, Sakit, Izin, Dinas Luar, Cuti, Alpha
  tanda_tangan_aparat?: string; // "Paraf" atau "TTD"
  keterangan?: string;
}

// Union type for all possible book entries
export type AnyBookEntry =
  | BukuPeraturan
  | BukuKeputusanKades
  | BukuInventaris
  | BukuAparat
  | BukuTanah // Covers Kas Desa & Milik Desa
  | BukuAgendaSuratMasuk
  | BukuAgendaSuratKeluar
  | BukuEkspedisi
  | BukuLembaranBerita
  | BukuIndukPenduduk
  | BukuMutasiPenduduk
  | BukuRekapPenduduk
  | BukuPendudukSementara
  | BukuKtpKk
  | BukuApbdes
  | BukuPenjabaranApbdes
  | BukuRka
  | BukuKasUmum
  | BukuKasPembantu
  | BukuBank
  | BukuPanjar
  | BukuRpjmdes
  | BukuRkp
  | BukuKegiatanPembangunan
  | BukuInventarisHasil
  | BukuKader
  | BukuSuratKeluarBpd
  | BukuSuratMasukBpd
  | BukuEkspedisiBpd
  | BukuDataInventarisBpd
  | BukuLaporanKeuanganBpd
  | BukuTamu // For Tamu Umum Desa
  | BukuTamuBpd // For Tamu BPD
  | BukuAnggotaBpd
  | BukuKegiatanBpd
  | BukuAspirasiMasyarakat
  | BukuAbsensiRapatBpd
  | BukuNotulenRapatBpd
  | BukuPeraturanKeputusanBpd
  | BukuKeputusanMusyawarahBpd
  | BukuKeputusanMusyawarahPerencanaan
  | BukuPengurusLembaga
  | BukuAbsensiAparat;

export type AllData = Record<string, GenericEntry[]>;
// Define specific book entry types that can be part of AllData
export interface AllDataBooks {
  buku_peraturan?: BukuPeraturan[];
  buku_keputusan_kades?: BukuKeputusanKades[];
  buku_inventaris?: BukuInventaris[];
  buku_aparat?: BukuAparat[];
  buku_tanah_kas?: BukuTanah[];
  buku_tanah_desa?: BukuTanah[];
  buku_agenda_surat_masuk?: BukuAgendaSuratMasuk[];
  buku_agenda_surat_keluar?: BukuAgendaSuratKeluar[];
  buku_ekspedisi?: BukuEkspedisi[];
  buku_lembaran_berita?: BukuLembaranBerita[];
  buku_induk_penduduk?: BukuIndukPenduduk[];
  buku_mutasi_penduduk?: BukuMutasiPenduduk[];
  buku_rekap_penduduk?: BukuRekapPenduduk[];
  buku_penduduk_sementara?: BukuPendudukSementara[];
  buku_ktp_kk?: BukuKtpKk[];
  buku_apbdes?: BukuApbdes[];
  buku_penjabaran_apbdes?: BukuPenjabaranApbdes[];
  buku_rka?: BukuRka[];
  buku_kas_umum?: BukuKasUmum[];
  buku_kas_pembantu?: BukuKasPembantu[];
  buku_bank?: BukuBank[];
  buku_panjar?: BukuPanjar[];
  buku_rpjmdes?: BukuRpjmdes[];
  buku_rkp?: BukuRkp[];
  buku_kegiatan_pembangunan?: BukuKegiatanPembangunan[];
  buku_inventaris_hasil?: BukuInventarisHasil[];
  buku_kader?: BukuKader[];
  buku_surat_keluar_bpd?: BukuSuratKeluarBpd[];
  buku_surat_masuk_bpd?: BukuSuratMasukBpd[];
  buku_ekspedisi_bpd?: BukuEkspedisiBpd[];
  buku_data_inventaris_bpd?: BukuDataInventarisBpd[];
  buku_laporan_keuangan_bpd?: BukuLaporanKeuanganBpd[];
  buku_tamu_umum?: BukuTamu[];
  buku_tamu_bpd?: BukuTamuBpd[];
  buku_anggota_bpd?: BukuAnggotaBpd[];
  buku_kegiatan_bpd?: BukuKegiatanBpd[];
  buku_aspirasi_masyarakat?: BukuAspirasiMasyarakat[];
  buku_absensi_rapat_bpd?: BukuAbsensiRapatBpd[];
  buku_notulen_rapat_bpd?: BukuNotulenRapatBpd[];
  buku_peraturan_keputusan_bpd?: BukuPeraturanKeputusanBpd[];
  buku_keputusan_musyawarah_bpd?: BukuKeputusanMusyawarahBpd[];
  buku_keputusan_musyawarah_perencanaan?: BukuKeputusanMusyawarahPerencanaan[];
  buku_pengurus_lembaga?: BukuPengurusLembaga[];
  buku_absensi_aparat?: BukuAbsensiAparat[];
  // Does not include data_desa_umum as it's handled differently (single entry)
  [key: string]: GenericEntry[] | undefined; // Index signature for dynamic access
}