
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Database } from 'sql.js';
import { Sidebar } from './components/Sidebar';
import { BookViewWrapper } from './components/BookViewWrapper';
import { PlanningView } from './components/planning/PlanningView';
import { DataDesaView } from './components/DataDesaView';
import { SuratMakerView } from './components/SuratMakerView'; // Import new view
import { Dashboard } from './components/Dashboard';
import { LoginView } from './components/LoginView';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { MENU_ITEMS, BOOK_CATEGORIES, PLANNING_ICON, DATA_DESA_FIELDS, DEFAULT_PASSWORD, CUSTOM_PASSWORD_STORAGE_KEY } from './constants';
import { AllDataBooks, BookDefinition, GenericEntry, FieldDefinition, DataDesaEntry, DATA_DESA_KEY, USAGE_GUIDE_KEY, PEMBUAT_SURAT_KEY } from './types';
import { 
  initializeDatabase, 
  loadAllDataFromDb, 
  addEntry, 
  updateEntry, 
  deleteDbEntry, 
  getAllEntries,
  getDataDesa, 
  saveDataDesa,
  saveDatabaseToIndexedDB, 
  getSqlJsStatic 
} from './utils/database';

const AUTH_STORAGE_KEY = 'digitalDesaAuth';
const LOCAL_INSTALLATION_TOKEN_KEY = 'local_installation_token';

const HamburgerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [db, setDb] = useState<Database | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [allData, setAllData] = useState<AllDataBooks>({});
  const [dataDesa, setDataDesa] = useState<DataDesaEntry | null>(null);
  const [isLoadingDataDesa, setIsLoadingDataDesa] = useState(false);
  const [isAccessBlocked, setIsAccessBlocked] = useState<boolean>(false); 

  const [selectedBookKey, setSelectedBookKey] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'book' | 'planning' | 'data_desa' | 'usage_guide' | 'surat_maker'>('dashboard');
  
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(null);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  useEffect(() => {
    async function initDbAndLoadData() {
      if (isAuthenticated && !db) {
        try {
          setIsLoadingDb(true);
          setIsLoadingDataDesa(true);
          const database = await initializeDatabase(MENU_ITEMS);
          setDb(database);
          
          const dataFromDb = await loadAllDataFromDb(database, MENU_ITEMS);
          setAllData(dataFromDb);

          const villageData = await getDataDesa(database);
          setDataDesa(villageData);

          if (villageData?.installation_id) {
            const localToken = localStorage.getItem(LOCAL_INSTALLATION_TOKEN_KEY);
            if (localToken !== villageData.installation_id) {
              console.warn("Access Blocked: Installation ID mismatch or local token missing.");
              setIsAccessBlocked(true);
            } else {
              setIsAccessBlocked(false); 
            }
          } else {
             setIsAccessBlocked(false); 
          }

        } catch (error) {
          console.error("Error initializing database or loading data:", error);
          setIsAccessBlocked(true); 
        } finally {
          setIsLoadingDb(false);
          setIsLoadingDataDesa(false);
        }
      }
    }
    initDbAndLoadData();
  }, [isAuthenticated, db]); 

  useEffect(() => {
    if (!isAuthenticated || isAccessBlocked) return; 

    const { pathname, search, hash: routeHash } = location;
    const cleanHash = routeHash.replace(/^#\//, '');

    if (pathname === '/planning' || (pathname === '/' && cleanHash === 'planning')) {
      setCurrentView('planning');
      setSelectedBookKey(null); 
      if (pathname !== '/planning' || search !== '' || routeHash !== '') {
        navigate('/planning', { replace: true });
      }
    } else if (cleanHash === DATA_DESA_KEY) {
      setCurrentView('data_desa');
      setSelectedBookKey(DATA_DESA_KEY);
      if (pathname !== '/' || search !== '' || routeHash !== `#/${DATA_DESA_KEY}`) {
         navigate(`/#/${DATA_DESA_KEY}`, { replace: true });
      }
    } else if (cleanHash === USAGE_GUIDE_KEY) { 
        setCurrentView('usage_guide');
        setSelectedBookKey(USAGE_GUIDE_KEY);
        if (pathname !== '/' || search !== '' || routeHash !== `#/${USAGE_GUIDE_KEY}`) {
            navigate(`/#/${USAGE_GUIDE_KEY}`, { replace: true });
        }
    } else if (cleanHash === PEMBUAT_SURAT_KEY) {
        setCurrentView('surat_maker');
        setSelectedBookKey(PEMBUAT_SURAT_KEY);
        if (pathname !== '/' || search !== '' || routeHash !== `#/${PEMBUAT_SURAT_KEY}`) {
            navigate(`/#/${PEMBUAT_SURAT_KEY}`, { replace: true });
        }
    } else if (cleanHash && MENU_ITEMS.some(item => item.key === cleanHash)) {
      setCurrentView('book');
      setSelectedBookKey(cleanHash);
      if (pathname !== '/' || search !== '' || routeHash !== `#/${cleanHash}`) {
         navigate(`/#/${cleanHash}`, { replace: true });
      }
    } else { 
      setCurrentView('dashboard');
      setSelectedBookKey(null);
      if (pathname !== '/' || search !== '' || routeHash !== '') {
        navigate('/', { replace: true });
      }
    }
  }, [location, navigate, isAuthenticated, isAccessBlocked]);

  const handleLogin = (passwordInput: string) => {
    const storedPassword = localStorage.getItem(CUSTOM_PASSWORD_STORAGE_KEY);
    const correctPassword = storedPassword || DEFAULT_PASSWORD;

    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setLoginError(null);
      navigate('/', { replace: true }); 
    } else {
      setLoginError('Kata sandi salah. Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setDb(null); 
    setAllData({}); 
    setDataDesa(null);
    setCurrentView('dashboard'); 
    setSelectedBookKey(null);
    setShowChangePasswordModal(false);
    setChangePasswordError(null);
    setChangePasswordSuccess(null);
    setIsAccessBlocked(false); 
    setIsMobileSidebarOpen(false); 
    navigate('/'); 
  };

  const handleShowChangePasswordModal = () => {
    setShowChangePasswordModal(true);
    setChangePasswordError(null);
    setChangePasswordSuccess(null);
  };

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setChangePasswordError(null);
    setChangePasswordSuccess(null);
  };

  const handleChangePassword = (oldPass: string, newPass: string, confirmPass: string) => {
    const storedPassword = localStorage.getItem(CUSTOM_PASSWORD_STORAGE_KEY);
    const currentActualPassword = storedPassword || DEFAULT_PASSWORD;

    if (oldPass !== currentActualPassword) {
      setChangePasswordError('Kata sandi lama salah.');
      setChangePasswordSuccess(null);
      return;
    }
    if (newPass !== confirmPass) {
      setChangePasswordError('Kata sandi baru dan konfirmasi tidak cocok.');
      setChangePasswordSuccess(null);
      return;
    }
    if (newPass.length < 6) {
      setChangePasswordError('Kata sandi baru minimal 6 karakter.');
      setChangePasswordSuccess(null);
      return;
    }
    if (newPass === currentActualPassword) {
      setChangePasswordError('Kata sandi baru tidak boleh sama dengan kata sandi lama.');
      setChangePasswordSuccess(null);
      return;
    }

    localStorage.setItem(CUSTOM_PASSWORD_STORAGE_KEY, newPass);
    setChangePasswordSuccess('Kata sandi berhasil diubah.');
    setChangePasswordError(null);
    setTimeout(() => {
      handleCloseChangePasswordModal();
    }, 2000); 
  };


  const handleSelectNavigation = useCallback((viewType: 'book' | 'planning' | 'dashboard' | 'data_desa' | 'usage_guide' | 'surat_maker', key?: string) => {
    if (!isAuthenticated || isAccessBlocked) return; 
    setIsMobileSidebarOpen(false); 

    if (viewType === 'planning') {
      navigate('/planning');
    } else if (viewType === 'data_desa' && key === DATA_DESA_KEY) {
      navigate(`/#/${DATA_DESA_KEY}`);
    } else if (viewType === 'usage_guide' && key === USAGE_GUIDE_KEY) {
        navigate(`/#/${USAGE_GUIDE_KEY}`);
    } else if (viewType === 'surat_maker' && key === PEMBUAT_SURAT_KEY) {
        navigate(`/#/${PEMBUAT_SURAT_KEY}`);
    } else if (viewType === 'book' && key) {
      navigate(`/#/${key}`);
    } else {
      navigate('/');
    }
  }, [navigate, isAuthenticated, isAccessBlocked]);

  const getBookDefinition = useCallback((bookKey: string): BookDefinition | undefined => {
    return MENU_ITEMS.find(item => item.key === bookKey);
  }, []);

  const handleAddDbEntry = async (bookKey: string, entryData: Omit<GenericEntry, 'id'>) => {
    if (!db || isAccessBlocked) return;
    const definition = getBookDefinition(bookKey);
    if (!definition) return;
    try {
      await addEntry(db, bookKey, entryData, definition.fields);
      const updatedBookData = await getAllEntries(db, bookKey);
      setAllData(prevData => ({ ...prevData, [bookKey]: updatedBookData }));
    } catch (error) { console.error("Gagal menambah entri via DB:", error); }
  };

  const handleAddMultipleDbEntries = async (bookKey: string, entries: Omit<GenericEntry, 'id'>[]) => {
    if (!db || isAccessBlocked) return;
    const definition = getBookDefinition(bookKey);
    if (!definition) {
      console.error(`Definisi buku tidak ditemukan untuk: ${bookKey}`);
      return;
    }
    try {
      for (const entryData of entries) {
        await addEntry(db, bookKey, entryData, definition.fields);
      }
      const updatedBookData = await getAllEntries(db, bookKey);
      setAllData(prevData => ({ ...prevData, [bookKey]: updatedBookData }));
    } catch (error) {
      console.error(`Gagal menambah multiple entri ke ${bookKey}:`, error);
      try {
        const updatedBookData = await getAllEntries(db, bookKey);
        setAllData(prevData => ({ ...prevData, [bookKey]: updatedBookData }));
      } catch (refreshError) {
        console.error(`Gagal memuat ulang data setelah error import untuk ${bookKey}:`, refreshError);
      }
    }
  };


  const handleUpdateDbEntry = async (bookKey: string, entryData: GenericEntry) => {
    if (!db || isAccessBlocked) return;
    const definition = getBookDefinition(bookKey);
    if (!definition) return;
    try {
      await updateEntry(db, bookKey, entryData, definition.fields);
      const updatedBookData = await getAllEntries(db, bookKey);
      setAllData(prevData => ({ ...prevData, [bookKey]: updatedBookData }));
    } catch (error) { console.error("Gagal update entri via DB:", error); }
  };

  const handleDeleteDbEntryApp = async (bookKey: string, id: number) => {
    if (!db || isAccessBlocked) return;
    try {
      await deleteDbEntry(db, bookKey, id);
      const updatedBookData = await getAllEntries(db, bookKey);
      setAllData(prevData => ({ ...prevData, [bookKey]: updatedBookData }));
      if (bookKey === 'buku_rpjmdes') {
        const rkpToDelete = (allData.buku_rkp || []).filter(rkp => rkp.id_rpjmdes_induk === id);
        for (const rkp of rkpToDelete) await handleDeleteDbEntryApp('buku_rkp', rkp.id);
      } else if (bookKey === 'buku_rkp') {
        const apbdesToDelete = (allData.buku_apbdes || []).filter(apbdes => apbdes.id_rkp_induk === id);
        for (const apbdes of apbdesToDelete) await handleDeleteDbEntryApp('buku_apbdes', apbdes.id);
      }
    } catch (error) { console.error("Gagal menghapus entri via DB:", error); }
  };

  const handleSaveDataDesa = async (updatedData: Omit<DataDesaEntry, 'id'>) => {
    if (!db || isAccessBlocked) return;
    try {
      await saveDataDesa(db, updatedData); 
      const reloadedDataDesa = await getDataDesa(db);
      setDataDesa(reloadedDataDesa);
      
      if (reloadedDataDesa?.installation_id) {
        const localToken = localStorage.getItem(LOCAL_INSTALLATION_TOKEN_KEY);
        if (localToken !== reloadedDataDesa.installation_id) {
           setIsAccessBlocked(true); 
           console.warn("Access blocked post-save: Mismatch after saving Data Desa.");
        } else {
           setIsAccessBlocked(false); 
        }
      }
      alert('Data Desa berhasil disimpan.');
    } catch (error) {
      console.error("Gagal menyimpan Data Desa:", error);
      alert('Gagal menyimpan Data Desa. Lihat konsol untuk detail.');
    }
  };

  const handleBackupDatabase = () => {
    if (!db) {
      alert('Database tidak termuat. Tidak dapat melakukan backup.');
      return;
    }
    try {
      const dbBinary = db.export();
      const blob = new Blob([dbBinary], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const date = new Date();
      const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
      link.download = `digital_desa_backup_${dateString}.db`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      alert('Database berhasil di-backup.');
    } catch (error) {
      console.error('Error backing up database:', error);
      alert('Gagal melakukan backup database.');
    }
  };

  const handleRestoreDatabase = async (file: File) => {
    const confirmation = window.confirm(
      'Restoring the database will overwrite all current data. Data yang tidak tersimpan akan hilang. Apakah Anda yakin ingin melanjutkan?'
    );
    if (!confirmation) return;

    setIsLoadingDb(true); 
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          throw new Error('File tidak dapat dibaca.');
        }

        const SQL = await getSqlJsStatic();
        const newDb = new SQL.Database(new Uint8Array(arrayBuffer));
        
        const dataDesaTableFields = [...DATA_DESA_FIELDS];
        if (!dataDesaTableFields.find(f => f.name === 'installation_id')) {
            dataDesaTableFields.push({ name: 'installation_id', label: 'Installation ID', type: 'text' });
        }
        const dataDesaColumns = dataDesaTableFields.map(f => `"${f.name}" ${f.type === 'number' ? 'REAL' : 'TEXT'}`).join(', ');
        newDb.run(`CREATE TABLE IF NOT EXISTS "${DATA_DESA_KEY}" (id INTEGER PRIMARY KEY, ${dataDesaColumns});`);

        MENU_ITEMS.forEach(book => {
            if (book.key !== DATA_DESA_KEY && book.fields.length > 0) {
                const checkTableSql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${book.key}';`;
                const result = newDb.exec(checkTableSql);
                if (!result || result.length === 0 || result[0].values.length === 0) {
                    console.warn(`Tabel ${book.key} tidak ada di backup, membuat tabel baru. Data untuk buku ini akan kosong.`);
                    const columns = book.fields.map(field => `"${field.name}" ${field.type === 'number' ? 'REAL' : 'TEXT'}`).join(', ');
                    newDb.run(`CREATE TABLE IF NOT EXISTS "${book.key}" (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns});`);
                }
            }
        });
        
        setDb(newDb); 
        await saveDatabaseToIndexedDB(newDb); 

        const dataFromDb = await loadAllDataFromDb(newDb, MENU_ITEMS);
        setAllData(dataFromDb);
        const villageData = await getDataDesa(newDb);
        setDataDesa(villageData);
        
        if (villageData?.installation_id) {
            const localToken = localStorage.getItem(LOCAL_INSTALLATION_TOKEN_KEY);
            if (localToken !== villageData.installation_id) {
                setIsAccessBlocked(true);
                 alert('Database berhasil dipulihkan. Namun, lisensi aplikasi ini terdeteksi aktif di instalasi lain. Akses dibatasi.');
            } else {
                setIsAccessBlocked(false);
                alert('Database berhasil dipulihkan.');
            }
        } else {
            setIsAccessBlocked(false); 
            alert('Database berhasil dipulihkan. Aplikasi siap untuk diaktifkan.');
        }
        
        setCurrentView('dashboard');
        setSelectedBookKey(null);
        setIsMobileSidebarOpen(false); 
        navigate('/', { replace: true });

      } catch (error) {
        console.error('Error restoring database:', error);
        alert(`Gagal memulihkan database. File mungkin rusak atau bukan backup yang valid. (${error instanceof Error ? error.message : String(error)})`);
      } finally {
        setIsLoadingDb(false);
      }
    };
    reader.onerror = () => {
      alert('Gagal membaca file backup.');
      setIsLoadingDb(false);
    };
    reader.readAsArrayBuffer(file);
  };
  
  const selectedBookDefinition = (currentView === 'book' || currentView === 'data_desa' || currentView === 'usage_guide' || currentView === 'surat_maker') && selectedBookKey
    ? getBookDefinition(selectedBookKey)
    : null;

  const getBookData = useCallback((bookKey: keyof AllDataBooks): GenericEntry[] => {
    return allData[bookKey] || [];
  }, [allData]);

  if (!isAuthenticated) return <LoginView onLogin={handleLogin} loginError={loginError} />;

  if (isLoadingDb || (isAuthenticated && !db && !isAccessBlocked)) { 
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-sky-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">
            {isLoadingDb ? 'Memproses database...' : 'Menunggu inisialisasi...'}
          </p>
        </div>
      </div>
    );
  }

  if (isAccessBlocked) {
    return (
      <div className="fixed inset-0 bg-red-50 flex flex-col items-center justify-center p-6 sm:p-10 z-[100]" role="alertdialog" aria-labelledby="access-denied-title" aria-describedby="access-denied-description">
        <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl max-w-lg w-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 sm:h-20 sm:w-20 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 id="access-denied-title" className="text-2xl sm:text-3xl font-bold text-red-700 mb-3">Akses Ditolak</h1>
            <div id="access-denied-description" className="text-gray-700 space-y-3 text-sm sm:text-base">
                <p>Sesuai ketentuan, aplikasi ini hanya dapat digunakan pada satu instalasi untuk satu dataset.</p>
                <p className="mt-4 text-xs sm:text-sm text-gray-500">
                    Jika ini adalah komputer instalasi asli Anda dan Anda melihat pesan ini setelah membersihkan data browser, data aktivasi lokal mungkin hilang. Untuk memulihkan akses, Anda mungkin perlu mereset data aplikasi (ini akan menghapus semua data yang ada) atau menghubungi dukungan teknis jika tersedia.
                </p>
            </div>
            <button
                onClick={handleLogout}
                className="mt-6 sm:mt-8 w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 sm:px-6 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            >
                Logout
            </button>
        </div>
      </div>
    );
  }


  const renderMainContent = () => {
    switch (currentView) {
      case 'planning':
        return (
          <PlanningView
            allData={allData}
            menuItems={MENU_ITEMS}
            onAddEntry={handleAddDbEntry}
            onUpdateEntry={handleUpdateDbEntry}
            onDeleteEntry={handleDeleteDbEntryApp}
            getBookData={getBookData}
            getBookDefinition={getBookDefinition}
            dataDesa={dataDesa} 
          />
        );
      case 'data_desa':
        return (
          <DataDesaView
            dataDesa={dataDesa}
            onSave={handleSaveDataDesa}
            isLoading={isLoadingDataDesa}
            fields={DATA_DESA_FIELDS}
          />
        );
      case 'usage_guide':
        return (
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Petunjuk Penggunaan Aplikasi</h2>
                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
                    <p className="lead">Selamat datang di Aplikasi Administrasi Digital Desa. Aplikasi ini dirancang untuk membantu Anda mengelola berbagai data administrasi desa secara digital dan efisien.</p>
                    
                    <h3 className="mt-6 mb-2 text-xl font-semibold text-gray-700">Navigasi Utama</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Gunakan menu di sebelah kiri (Sidebar) untuk mengakses berbagai buku administrasi atau fitur khusus. Pada perangkat mobile, sidebar dapat diakses melalui tombol menu (ikon tiga garis) di pojok kiri atas.</li>
                        <li><strong>Dashboard:</strong> Halaman awal yang menampilkan ringkasan data penting dan statistik desa.</li>
                        <li><strong>Perencanaan Desa:</strong> Fitur terpadu untuk mengelola dokumen RPJMDes, RKPDes, dan APBDes secara berjenjang.</li>
                        <li><strong>Data Umum Desa:</strong> (Terdapat di bawah kategori "Administrasi Umum") Digunakan untuk mengisi dan mengelola informasi dasar mengenai desa Anda yang akan digunakan pada kop surat dan laporan. Menyimpan data di sini untuk pertama kali akan mengaktifkan lisensi aplikasi untuk instalasi ini.</li>
                        <li><strong>Petunjuk Penggunaan:</strong> Halaman ini yang sedang Anda baca.</li>
                         <li><strong>Pembuat Surat:</strong> (Di menu "Pembuat Surat") Untuk membuat berbagai jenis surat resmi desa seperti Surat Undangan, Surat Pemberitahuan, dan Surat Keterangan.</li>
                        <li>Setiap <strong>buku administrasi</strong> (misalnya, Buku Peraturan Desa, Buku Induk Penduduk) memiliki halaman tersendiri untuk melihat, menambah, mengedit, dan menghapus data.</li>
                    </ul>

                    <h3 className="mt-6 mb-2 text-xl font-semibold text-gray-700">Pengelolaan Data</h3>
                     <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Tambah Data:</strong> Klik tombol "Tambah Entri Baru" (atau sejenisnya, misal "Tambah RPJMDes") yang tersedia di setiap halaman buku atau bagian.</li>
                        <li><strong>Edit Data:</strong> Pada tabel data, klik tombol "Edit" pada baris data yang ingin diubah.</li>
                        <li><strong>Hapus Data:</strong> Klik tombol "Hapus" pada baris data. Akan ada konfirmasi sebelum data dihapus permanen. Perhatian: Menghapus data RPJMDes juga akan menghapus data RKPDes dan APBDes terkait, begitu pula menghapus RKPDes akan menghapus APBDes terkait.</li>
                        <li><strong>Formulir Data:</strong> Isi formulir dengan data yang valid. Kolom yang ditandai dengan asteris (<span className="text-red-500">*</span>) wajib diisi.</li>
                        <li><strong>Import Data (Buku Induk Penduduk):</strong> Anda dapat mengimpor data dari file Excel (.xlsx). Pastikan file Excel Anda memiliki baris header yang sesuai dengan kolom-kolom pada Buku Induk Penduduk.</li>
                    </ul>

                    <h3 className="mt-6 mb-2 text-xl font-semibold text-gray-700">Cetak dan Ekspor Data</h3>
                     <ul className="list-disc pl-5 space-y-1">
                        <li>Setiap halaman buku (dan bagian pada Perencanaan Desa) menyediakan tombol "Cetak" untuk mencetak tabel data.</li>
                        <li>Tombol "Export XLS" tersedia untuk mengunduh data dalam format file Excel (.xlsx).</li>
                        <li><strong>Pembuat Surat:</strong> Fitur ini memungkinkan Anda mencetak surat resmi (Undangan, Pemberitahuan, Keterangan) atau mengunduhnya sebagai file Word (.doc), lengkap dengan kop surat otomatis.</li>
                        <li><strong>Kop Surat Otomatis:</strong> Pastikan Anda telah mengisi "Data Umum Desa" dengan lengkap. Informasi seperti nama desa, kabupaten, kecamatan, alamat, dan logo (jika URL gambar logo diisi) akan digunakan secara otomatis pada kop surat saat mencetak dokumen.</li>
                    </ul>
                    
                    <h3 className="mt-6 mb-2 text-xl font-semibold text-gray-700">Backup, Restore, dan Ubah Kata Sandi</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Pada sidebar, di bagian bawah, terdapat menu "Utilitas Database" dan "Pengaturan Pengguna".</li>
                        <li><strong>Backup Database:</strong> (Di Utilitas Database) Klik tombol ini untuk mengunduh seluruh database aplikasi ke komputer Anda dalam satu file (format .db).</li>
                        <li><strong>Restore Database:</strong> (Di Utilitas Database) Klik tombol ini untuk memulihkan database dari file backup. 
                            <strong className="text-red-600"> PERHATIAN:</strong> Proses restore akan MENGHAPUS SEMUA DATA yang ada saat ini dan menggantinya dengan data dari file backup. Jika database yang dipulihkan sudah teraktivasi di instalasi lain, akses ke aplikasi ini mungkin akan terkunci.
                        </li>
                         <li><strong>Ubah Kata Sandi:</strong> (Di Pengaturan Pengguna) Memungkinkan Anda mengubah kata sandi login aplikasi. Kata sandi baru akan disimpan lokal di browser Anda.</li>
                    </ul>


                    <h3 className="mt-6 mb-2 text-xl font-semibold text-gray-700">Login dan Keamanan Data</h3>
                     <ul className="list-disc pl-5 space-y-1">
                        <li>Aplikasi ini memerlukan login. Kata sandi default awal adalah: <strong><code>admin123</code></strong>. Anda dapat mengubahnya melalui menu "Ubah Kata Sandi".</li>
                        <li>Data Anda (termasuk kata sandi kustom dan data aktivasi instalasi) disimpan secara lokal di browser Anda.</li>
                        <li><strong>PENTING (Kebijakan Satu Instalasi):</strong>
                            <ul className="list-disc pl-6 mt-1">
                                <li>Aplikasi ini dirancang untuk penggunaan pada <strong>satu instalasi (satu komputer/profil browser)</strong> per dataset. Aktivasi pertama terjadi saat Anda menyimpan "Data Umum Desa".</li>
                                <li>Jangan membersihkan "Data Situs" atau "Cache" untuk aplikasi ini dari pengaturan browser, karena ini akan menghapus semua data, termasuk data aktivasi lokal, dan dapat <strong className="text-red-600">menyebabkan Anda terkunci</strong> dari instalasi Anda sendiri.</li>
                                <li>Lakukan backup data secara berkala.</li>
                                <li>Data tidak tersinkronisasi antar perangkat atau browser. Menggunakan database yang sama di instalasi lain akan menyebabkan instalasi tersebut terkunci.</li>
                            </ul>
                        </li>
                    </ul>
                    
                    <h3 className="mt-6 mb-2 text-xl font-semibold text-gray-700">Tips Penggunaan</h3>
                     <ul className="list-disc pl-5 space-y-1">
                        <li>Isi data secara lengkap dan akurat.</li>
                        <li>Gunakan browser versi terbaru (Chrome, Firefox, Edge, Safari).</li>
                        <li>Idealnya digunakan pada desktop/laptop. Tampilan mobile dioptimalkan untuk aksesibilitas, namun input data kompleks lebih nyaman di layar besar.</li>
                    </ul>
                    <p className="mt-8 text-center text-gray-600">Terima kasih telah menggunakan Aplikasi Administrasi Digital Desa!</p>
                </div>
            </div>
        );
      case 'surat_maker':
        return (
            <SuratMakerView dataDesa={dataDesa} allData={allData} />
        );
      case 'book':
        if (selectedBookDefinition && selectedBookKey && 
            selectedBookKey !== DATA_DESA_KEY && 
            selectedBookKey !== USAGE_GUIDE_KEY &&
            selectedBookKey !== PEMBUAT_SURAT_KEY) {
          return (
            <BookViewWrapper
              bookDefinition={selectedBookDefinition}
              initialData={getBookData(selectedBookKey as keyof AllDataBooks)}
              onAddEntry={(newEntry) => handleAddDbEntry(selectedBookKey, newEntry)}
              onUpdateEntry={(updatedEntry) => handleUpdateDbEntry(selectedBookKey, updatedEntry)}
              onDeleteEntry={(id) => handleDeleteDbEntryApp(selectedBookKey, id)}
              onAddMultipleEntries={(entries) => handleAddMultipleDbEntries(selectedBookKey, entries)}
              dataDesa={dataDesa}
            />
          );
        }
        return <Dashboard allData={allData} menuItems={MENU_ITEMS} onSelectNavigation={handleSelectNavigation} getBookData={getBookData} />;
      
      case 'dashboard':
      default:
        return <Dashboard allData={allData} menuItems={MENU_ITEMS} onSelectNavigation={handleSelectNavigation} getBookData={getBookData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 antialiased overflow-hidden"> 
      <Sidebar
        menuItems={MENU_ITEMS}
        categories={BOOK_CATEGORIES}
        selectedKey={currentView === 'planning' ? 'planning' : currentView === 'dashboard' ? null : selectedBookKey}
        onSelectNavigation={handleSelectNavigation}
        planningIcon={PLANNING_ICON}
        onLogout={handleLogout}
        onBackupDatabase={handleBackupDatabase}
        onRestoreDatabase={handleRestoreDatabase}
        onChangePassword={handleShowChangePasswordModal} 
        isMobileSidebarOpen={isMobileSidebarOpen}
        onCloseMobileSidebar={toggleMobileSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden"> 
        
        <header className="md:hidden bg-white shadow-sm p-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleMobileSidebar}
              className="text-gray-600 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
              aria-label="Buka menu navigasi"
            >
              <HamburgerIcon className="h-7 w-7" />
            </button>
            <h1 className="text-lg font-semibold text-sky-600">
              { selectedBookDefinition?.label || 
                (currentView === 'planning' ? 'Perencanaan Desa' : 
                (currentView === 'surat_maker' ? 'Pembuat Surat' : 
                (currentView === 'dashboard' ? 'Dashboard' : 'Digital Desa'))) 
              }
            </h1>
            <div className="w-7"></div> 
          </div>
        </header>

        <main className={`flex-1 ${currentView === 'dashboard' ? 'p-4 sm:p-6' : 'p-3 sm:p-6 md:p-8'} overflow-y-auto`}>
          {renderMainContent()}
        </main>
      </div>

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={handleCloseChangePasswordModal}
          onSubmit={handleChangePassword}
          error={changePasswordError}
          successMessage={changePasswordSuccess}
        />
      )}
    </div>
  );
};

export default App;
