
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (password: string) => void;
  loginError: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, loginError }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-4xl font-bold tracking-tight text-sky-600">
            Digital Desa
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Selamat datang! Silakan masuk untuk melanjutkan.
          </p>
        </div>
        <form 
            className="mt-8 space-y-6 bg-white p-8 shadow-xl rounded-xl" 
            onSubmit={handleSubmit}
            aria-labelledby="login-heading"
        >
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 bg-white text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby={loginError ? "login-error-message" : undefined}
              />
            </div>
          </div>

          {loginError && (
            <p id="login-error-message" className="mt-2 text-center text-sm text-red-600" role="alert">
              {loginError}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-3 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Masuk
            </button>
          </div>
        </form>
         <p className="mt-6 text-center text-xs text-gray-500">
            Kata sandi default: <code className="font-mono bg-gray-200 p-1 rounded">admin123</code>.
            <br /> Dapat diubah setelah login melalui menu di sidebar.
        </p>

        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-700 space-y-4 bg-white p-6 shadow-lg rounded-xl">
          <h2 className="text-lg font-semibold text-center text-sky-700 mb-3">Tentang Aplikasi Ini</h2>
          
          <p className="text-xs text-gray-600 mb-4">
            Aplikasi Administrasi Digital Desa ini dirancang sebagai alat bantu komprehensif untuk mengelola berbagai aspek administrasi di tingkat desa secara digital. Tujuannya adalah untuk meningkatkan efisiensi, akurasi data, kemudahan akses informasi, dan pelaporan.
          </p>

          <details className="group">
            <summary className="font-medium text-gray-800 cursor-pointer hover:text-sky-600 list-none group-open:mb-2">
              <span className="group-open:hidden">&#9654; Penjelasan Fitur Lengkap Aplikasi</span>
              <span className="hidden group-open:inline">&#9660; Penjelasan Fitur Lengkap Aplikasi</span>
            </summary>
            <div className="text-xs text-gray-600 space-y-3 mt-2">

              <details className="group ml-2">
                <summary className="font-semibold text-gray-700 cursor-pointer hover:text-sky-600 list-none group-open:mb-1">
                  <span className="group-open:hidden">&#9656;</span><span className="hidden group-open:inline">&#9662;</span> 1. Akses & Keamanan Aplikasi
                </summary>
                <ul className="list-disc pl-5 space-y-0.5 text-2xs">
                  <li><strong>Login Pengguna:</strong> Akses aman dengan kata sandi (default: <code className="font-mono bg-gray-200 p-0.5 rounded text-2xs">admin123</code>). Bisa diubah setelah login.</li>
                  <li><strong>Logout:</strong> Keluar dari sesi aplikasi untuk menjaga keamanan data.</li>
                  <li><strong>Penyimpanan Data Lokal & Keamanan:</strong> Data disimpan di browser Anda (IndexedDB). Penting untuk tidak membersihkan data situs/cache dan melakukan backup rutin.</li>
                </ul>
              </details>

              <details className="group ml-2">
                <summary className="font-semibold text-gray-700 cursor-pointer hover:text-sky-600 list-none group-open:mb-1">
                  <span className="group-open:hidden">&#9656;</span><span className="hidden group-open:inline">&#9662;</span> 2. Navigasi Utama dan Fitur Inti
                </summary>
                <ul className="list-disc pl-5 space-y-0.5 text-2xs">
                  <li><strong>Sidebar (Menu Samping):</strong> Pusat navigasi ke semua buku administrasi, perencanaan, dashboard, dll.</li>
                  <li><strong>Dashboard:</strong> Halaman awal dengan ringkasan data penting, statistik, grafik demografi, dan pintasan.</li>
                  <li><strong>Data Umum Desa:</strong> (Di menu Administrasi Umum) Mengisi info dasar desa untuk kop surat otomatis pada cetakan/ekspor.</li>
                  <li><strong>Petunjuk Penggunaan:</strong> (Di menu Administrasi Umum) Panduan lengkap penggunaan aplikasi.</li>
                  <li><strong>Utilitas Database:</strong>
                    <ul className="list-circle pl-4">
                      <li><strong>Backup Database:</strong> Unduh seluruh database sebagai file cadangan (.db).</li>
                      <li><strong>Restore Database:</strong> Pulihkan data dari file backup (.db). Hati-hati, ini akan menimpa data saat ini.</li>
                    </ul>
                  </li>
                  <li><strong>Ubah Kata Sandi:</strong> (Di Pengaturan Pengguna) Fitur untuk mengubah kata sandi login aplikasi.</li>
                </ul>
              </details>

              <details className="group ml-2">
                <summary className="font-semibold text-gray-700 cursor-pointer hover:text-sky-600 list-none group-open:mb-1">
                  <span className="group-open:hidden">&#9656;</span><span className="hidden group-open:inline">&#9662;</span> 3. Perencanaan Desa Terpadu
                </summary>
                <p className="text-2xs mb-1">Fitur terpadu untuk mengelola dokumen RPJMDes, RKPDes, dan APBDes secara berjenjang. Setiap tahapan memungkinkan Tambah, Edit, Hapus data, lihat Rincian, Cetak tabel, dan Ekspor tabel ke Excel. Dokumen RPJMDes dan RKPDes juga bisa diekspor ke format Word (.doc) lengkap dengan kop surat desa.</p>
                <ul className="list-disc pl-5 space-y-0.5 text-2xs">
                  <li><strong>Pengelolaan Dokumen RPJMDes:</strong> Input data, visi-misi, program, dll. Menampilkan RKPDes terkait.</li>
                  <li><strong>Pengelolaan Dokumen RKPDes:</strong> Input data kegiatan, anggaran, terhubung ke RPJMDes induk. Menampilkan APBDes terkait.</li>
                  <li><strong>Pengelolaan Entri APBDes:</strong> Input rincian anggaran per kode rekening, terhubung ke RKPDes induk.</li>
                </ul>
              </details>

              <details className="group ml-2">
                <summary className="font-semibold text-gray-700 cursor-pointer hover:text-sky-600 list-none group-open:mb-1">
                  <span className="group-open:hidden">&#9656;</span><span className="hidden group-open:inline">&#9662;</span> 4. Buku Administrasi Desa
                </summary>
                <p className="text-2xs mb-1">Setiap buku administrasi (dikelompokkan per kategori) umumnya memiliki fungsi: Tambah, Edit, Hapus entri, Cetak tabel (dengan kop surat otomatis), dan Ekspor ke Excel (.xlsx).</p>
                
                <details className="group ml-4 my-1">
                    <summary className="font-medium text-gray-600 cursor-pointer hover:text-sky-500 list-none group-open:mb-0.5">
                        <span className="group-open:hidden">&#9657;</span><span className="hidden group-open:inline">&#9663;</span> 4.1. Administrasi Umum
                    </summary>
                    <ul className="list-disc pl-5 space-y-0.5 text-2xs">
                        <li><strong>Buku Peraturan Desa:</strong> Perdes, Peraturan Bersama Kades, dll.</li>
                        <li><strong>Buku Keputusan Kades:</strong> Keputusan Kepala Desa.</li>
                        <li><strong>Buku Inventaris Desa:</strong> Aset dan barang milik desa.</li>
                        <li><strong>Buku Aparat Desa:</strong> Data perangkat desa.</li>
                        <li><strong>Buku Tanah Kas Desa:</strong> Data tanah kas desa.</li>
                        <li><strong>Buku Tanah Milik Desa:</strong> Data tanah lain milik desa.</li>
                        <li><strong>Buku Agenda Surat Masuk:</strong> Surat diterima desa.</li>
                        <li><strong>Buku Agenda Surat Keluar:</strong> Surat dikeluarkan desa.</li>
                        <li><strong>Buku Ekspedisi:</strong> Catatan pengiriman surat.</li>
                        <li><strong>Buku Lembaran & Berita Desa:</strong> Publikasi lembaran/berita desa.</li>
                    </ul>
                </details>

                <details className="group ml-4 my-1">
                    <summary className="font-medium text-gray-600 cursor-pointer hover:text-sky-500 list-none group-open:mb-0.5">
                        <span className="group-open:hidden">&#9657;</span><span className="hidden group-open:inline">&#9663;</span> 4.2. Administrasi Penduduk
                    </summary>
                    <ul className="list-disc pl-5 space-y-0.5 text-2xs">
                        <li><strong>Buku Induk Penduduk:</strong> Data detail penduduk (NIK, Nama, TTL, dll.). Fitur <strong>Import dari Excel</strong> tersedia.</li>
                        <li><strong>Buku Mutasi Penduduk:</strong> Perubahan data penduduk (lahir, mati, pindah, datang).</li>
                        <li><strong>Buku Rekap Jumlah Penduduk:</strong> Rekapitulasi jumlah penduduk.</li>
                        <li><strong>Buku Penduduk Sementara/Tamu:</strong> Data penduduk sementara atau tamu.</li>
                        <li><strong>Buku Layanan KTP & KK:</strong> Catatan permohonan KTP dan KK.</li>
                    </ul>
                </details>

                <details className="group ml-4 my-1">
                    <summary className="font-medium text-gray-600 cursor-pointer hover:text-sky-500 list-none group-open:mb-0.5">
                        <span className="group-open:hidden">&#9657;</span><span className="hidden group-open:inline">&#9663;</span> 4.3. Administrasi Keuangan
                    </summary>
                    <ul className="list-disc pl-5 space-y-0.5 text-2xs">
                        <li><strong>Buku APBDes:</strong> Entri detail APBDes per kode rekening.</li>
                        <li><strong>Buku Penjabaran APBDes:</strong> Rincian lebih detail APBDes.</li>
                        <li><strong>Buku RKA Desa:</strong> Rencana Kegiatan dan Anggaran.</li>
                        <li><strong>Buku Kas Umum (BKU):</strong> Transaksi penerimaan dan pengeluaran kas.</li>
                        <li><strong>Buku Kas Pembantu Kegiatan:</strong> Kas per kegiatan.</li>
                        <li><strong>Buku Bank Desa:</strong> Transaksi via rekening bank desa.</li>
                        <li><strong>Buku Kas Panjar:</strong> Pemberian dan PJ uang panjar.</li>
                    </ul>
                </details>

                <details className="group ml-4 my-1">
                    <summary className="font-medium text-gray-600 cursor-pointer hover:text-sky-500 list-none group-open:mb-0.5">
                        <span className="group-open:hidden">&#9657;</span><span className="hidden group-open:inline">&#9663;</span> 4.4. Administrasi Pembangunan
                    </summary>
                    <ul className="list-disc pl-5 space-y-0.5 text-2xs">
                        <li><strong>Buku RPJMDes (Data Entri):</strong> Entri dokumen RPJMDes (berbeda dari fitur Perencanaan).</li>
                        <li><strong>Buku RKP Desa (Data Entri):</strong> Entri dokumen RKPDes (berbeda dari fitur Perencanaan).</li>
                        <li><strong>Buku Kegiatan Pembangunan:</strong> Realisasi dan progres kegiatan pembangunan.</li>
                        <li><strong>Buku Inventaris Hasil Pembangunan:</strong> Aset hasil pembangunan.</li>
                        <li><strong>Buku Kader Pemberdayaan Masyarakat:</strong> Data kader desa.</li>
                    </ul>
                </details>

                <details className="group ml-4 my-1">
                    <summary className="font-medium text-gray-600 cursor-pointer hover:text-sky-500 list-none group-open:mb-0.5">
                        <span className="group-open:hidden">&#9657;</span><span className="hidden group-open:inline">&#9663;</span> 4.5. Administrasi Lainnya (BPD & Lembaga)
                    </summary>
                    <ul className="list-disc pl-5 space-y-0.5 text-2xs">
                        <li><strong>Buku Surat Keluar BPD:</strong> Surat keluar BPD.</li>
                        <li><strong>Buku Surat Masuk BPD:</strong> Surat masuk BPD.</li>
                        <li><strong>Buku Ekspedisi BPD:</strong> Pengiriman surat BPD.</li>
                        <li><strong>Buku Data Inventaris BPD:</strong> Aset BPD.</li>
                        <li><strong>Buku Laporan Keuangan BPD:</strong> Keuangan BPD.</li>
                        <li><strong>Buku Tamu BPD:</strong> Daftar tamu BPD.</li>
                        <li><strong>Buku Anggota BPD:</strong> Data anggota BPD.</li>
                        <li><strong>Buku Kegiatan BPD:</strong> Kegiatan BPD.</li>
                        <li><strong>Buku Aspirasi Masyarakat (BPD):</strong> Aspirasi yang diterima BPD.</li>
                        <li><strong>Buku Absensi Rapat BPD:</strong> Daftar hadir rapat BPD.</li>
                        <li><strong>Buku Notulen Rapat BPD:</strong> Catatan hasil rapat BPD.</li>
                        <li><strong>Buku Peraturan & Keputusan BPD:</strong> Dokumen peraturan dan keputusan BPD.</li>
                        <li><strong>Buku Keputusan Musyawarah BPD:</strong> Hasil keputusan musyawarah BPD.</li>
                        <li><strong>Buku Keputusan Musyawarah Perencanaan Desa:</strong> Hasil Musrenbangdes, dll.</li>
                        <li><strong>Buku Pengurus Lembaga Desa:</strong> Data pengurus LPMD, PKK, Karang Taruna, RT, RW.</li>
                        <li><strong>Buku Absensi Aparat Desa:</strong> Kehadiran harian aparat desa.</li>
                        <li><strong>Buku Tamu Umum Desa:</strong> Daftar tamu umum kantor desa.</li>
                    </ul>
                </details>
              </details>
              <p className="mt-3 text-2xs text-center text-gray-500">
                Informasi lebih teknis mengenai teknologi, instalasi, dan penyimpanan data dapat dilihat di bagian lain di bawah ini.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="font-medium text-gray-800 cursor-pointer hover:text-sky-600 list-none group-open:mb-2">
              <span className="group-open:hidden">&#9654;</span><span className="hidden group-open:inline">&#9660;</span> Teknologi yang Digunakan
            </summary>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
              <li><strong>Frontend:</strong> React (dengan TypeScript), Tailwind CSS.</li>
              <li><strong>Database:</strong> SQL.js (SQLite dijalankan di browser).</li>
              <li><strong>Penyimpanan Browser:</strong> LocalForage (untuk persistensi data SQLite ke IndexedDB).</li>
              <li><strong>Fitur Ekspor:</strong> 
                SheetJS (xlsx) untuk ekspor ke format Excel, 
                HTML yang diformat khusus untuk ekspor ke format Word (.doc).
              </li>
            </ul>
          </details>

          <details className="group">
            <summary className="font-medium text-gray-800 cursor-pointer hover:text-sky-600 list-none group-open:mb-2">
              <span className="group-open:hidden">&#9654;</span><span className="hidden group-open:inline">&#9660;</span> Instalasi & Menjalankan Aplikasi
            </summary>
            <div className="text-xs text-gray-600 space-y-2">
              <p>Aplikasi ini adalah aplikasi web statis yang berjalan sepenuhnya di browser (client-side) dan tidak memerlukan instalasi backend di server.</p>
              <p><strong>Cara Menjalankan Lokal (dari source code):</strong></p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Pastikan Anda memiliki Node.js dan npm/yarn terinstal (opsional, untuk alat bantu seperti `live-server`).</li>
                <li>Unduh atau clone source code aplikasi ini.</li>
                <li>Karena aplikasi ini menggunakan ES6 modules (`type="module"` di `index.html`), Anda perlu menjalankannya melalui server HTTP sederhana. Anda tidak bisa membuka `index.html` langsung dari file system (file://).</li>
                <li>
                  Cara termudah adalah menggunakan ekstensi "Live Server" di VS Code, atau package `live-server` dari npm:
                  <ul className="list-disc pl-5">
                     <li>Jika menggunakan `live-server` (npm): buka terminal di direktori root aplikasi, jalankan `npx live-server`. Ini akan membuka aplikasi di browser Anda.</li>
                  </ul>
                </li>
              </ol>
              <p><strong>Penggunaan Umum (Jika Sudah Di-deploy):</strong></p>
              <p>Cukup akses URL tempat aplikasi ini di-host melalui browser modern (Chrome, Firefox, Edge, Safari). Tidak ada langkah instalasi yang diperlukan oleh pengguna akhir.</p>
            </div>
          </details>
          
          <details className="group">
            <summary className="font-medium text-gray-800 cursor-pointer hover:text-sky-600 list-none group-open:mb-2">
              <span className="group-open:hidden">&#9654;</span><span className="hidden group-open:inline">&#9660;</span> Cara Memulai
            </summary>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
              <li>Buka aplikasi di browser Anda.</li>
              <li>Masukkan kata sandi default: <code className="font-mono bg-gray-200 p-0.5 rounded text-xs">admin123</code> pada halaman login.</li>
              <li>Setelah berhasil login, Anda akan diarahkan ke Dashboard.</li>
              <li>Sangat disarankan untuk memulai dengan mengisi "Data Umum Desa" (di bawah kategori Administrasi Umum di sidebar) karena informasi ini akan digunakan untuk kop surat pada dokumen yang dicetak/diekspor.</li>
              <li>Jelajahi berbagai menu administrasi yang tersedia di sidebar.</li>
              <li>Gunakan fitur "Petunjuk Penggunaan" (di bawah kategori Administrasi Umum) untuk panduan lebih rinci.</li>
            </ul>
          </details>

          <details className="group">
            <summary className="font-medium text-gray-800 cursor-pointer hover:text-sky-600 list-none group-open:mb-2">
              <span className="group-open:hidden">&#9654;</span><span className="hidden group-open:inline">&#9660;</span> Penyimpanan Data & Kata Sandi
            </summary>
            <div className="text-xs text-gray-600 space-y-2">
              <p>Semua data aplikasi (termasuk buku administrasi) disimpan secara lokal di browser Anda menggunakan IndexedDB (melalui LocalForage dan SQL.js). Kata sandi yang telah diubah juga disimpan secara lokal di <code className="font-mono bg-gray-200 p-0.5 rounded text-xs">localStorage</code>.</p>
              <p className="font-semibold text-red-600">PENTING:</p>
              <ul className="list-disc pl-5 space-y-1">
                  <li>Data tidak tersinkronisasi antar perangkat atau antar browser yang berbeda.</li>
                  <li>Membersihkan "Data Situs" atau "Cache" untuk domain aplikasi ini dari pengaturan browser Anda akan MENGHAPUS SEMUA DATA dan KATA SANDI KUSTOM secara permanen.</li>
                  <li>Sangat disarankan untuk menggunakan fitur "Backup Database" yang ada di sidebar secara berkala untuk mencadangkan seluruh data Anda. Simpan file backup (.db) di tempat yang aman.</li>
                  <li>Fitur "Ubah Kata Sandi" akan mengubah kata sandi yang digunakan untuk login di browser tersebut.</li>
              </ul>
            </div>
          </details>

          <details className="group">
            <summary className="font-medium text-gray-800 cursor-pointer hover:text-sky-600 list-none group-open:mb-2">
               <span className="group-open:hidden">&#9654;</span><span className="hidden group-open:inline">&#9660;</span> Tentang Kode API Key (Fitur AI Masa Depan)
            </summary>
             <p className="text-xs text-gray-600">
                Saat ini, aplikasi ini belum terintegrasi dengan Google Gemini API atau fitur berbasis AI lainnya.
                Jika di masa mendatang fitur AI yang memerlukan API Key (misalnya, untuk Google Gemini API) ditambahkan, 
                API Key tersebut akan diambil secara eksklusif dari variabel lingkungan `process.env.API_KEY` yang diasumsikan sudah dikonfigurasi di lingkungan eksekusi (hosting) aplikasi. 
                Aplikasi ini <strong className="font-semibold">tidak akan pernah</strong> meminta pengguna untuk memasukkan API Key melalui antarmuka pengguna (UI) atau menyimpannya dalam kode frontend.
             </p>
          </details>

        </div>

      </div>
    </div>
  );
};
