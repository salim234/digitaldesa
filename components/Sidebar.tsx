
import React, { useState, useEffect, useRef } from 'react';
import { BookDefinition, DATA_DESA_KEY, USAGE_GUIDE_KEY, PEMBUAT_SURAT_KEY } from '../types';
import { BOOK_CATEGORIES, LogoutIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, KeyIcon } from '../constants';

interface SidebarProps {
  menuItems: BookDefinition[];
  categories: Record<string, string>;
  selectedKey: string | null;
  onSelectNavigation: (viewType: 'book' | 'planning' | 'dashboard' | 'data_desa' | 'usage_guide' | 'surat_maker', key?: string) => void;
  planningIcon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  onLogout: () => void;
  onBackupDatabase: () => void;
  onRestoreDatabase: (file: File) => void;
  onChangePassword: () => void;
  isMobileSidebarOpen: boolean; 
  onCloseMobileSidebar: () => void; 
}

const ChevronIcon: React.FC<{ isOpen: boolean, className?: string }> = ({ isOpen, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-5 h-5 transition-transform duration-200 ease-in-out ${isOpen ? 'transform rotate-0' : 'transform -rotate-90'} ${className || 'text-gray-400'}`}
  >
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ 
    menuItems, 
    categories, 
    selectedKey, 
    onSelectNavigation, 
    planningIcon,
    onLogout,
    onBackupDatabase,
    onRestoreDatabase,
    onChangePassword,
    isMobileSidebarOpen,
    onCloseMobileSidebar
}) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);


  useEffect(() => {
    let categoryToOpen: string | undefined = undefined;
    if (selectedKey) { 
      if (selectedKey === 'planning') {
        categoryToOpen = categories[BOOK_CATEGORIES.PERENCANAAN_DESA];
      } else if (selectedKey === PEMBUAT_SURAT_KEY) {
        categoryToOpen = categories[BOOK_CATEGORIES.PEMBUAT_SURAT];
      } else {
        const currentBook = menuItems.find(item => item.key === selectedKey);
        if (currentBook) {
          categoryToOpen = currentBook.category;
        }
      }
    }

    if (categoryToOpen && !openCategories[categoryToOpen]) {
       setOpenCategories(prevOpen => {
        const newState = {...prevOpen};
        Object.keys(categories).forEach(catKey => {
            if (categories[catKey] === categoryToOpen) {
                 newState[categories[catKey]] = true;
            }
        });
        if (selectedKey !== 'planning' && categoryToOpen) {
             newState[categoryToOpen] = true;
        }
        return newState;
       });
    }
  }, [selectedKey, menuItems, categories]); 

  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName], 
    }));
  };

  const handleNavigationAndCloseMobile = (viewType: 'book' | 'planning' | 'dashboard' | 'data_desa' | 'usage_guide' | 'surat_maker', key?: string) => {
    onSelectNavigation(viewType, key);
    if (isMobileSidebarOpen) {
      onCloseMobileSidebar();
    }
  };

  const actualGroupedMenuItems = Object.entries(categories)
    .filter(([categoryKey]) => categoryKey !== 'PERENCANAAN_DESA' && categoryKey !== 'PEMBUAT_SURAT') 
    .map(([categoryKey, categoryName]) => ({
      key: categoryKey, 
      name: categoryName,
      items: menuItems.filter(item => item.category === categoryName && item.key !== PEMBUAT_SURAT_KEY), // Explicitly exclude PEMBUAT_SURAT_KEY item
    }));
  
  const suratMakerMenuItem = menuItems.find(item => item.key === PEMBUAT_SURAT_KEY);

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
    if (isMobileSidebarOpen) onCloseMobileSidebar();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onRestoreDatabase(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleUtilityAction = (action: () => void) => {
    action();
    if (isMobileSidebarOpen) {
      onCloseMobileSidebar();
    }
  };

  return (
    <>
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" 
          onClick={onCloseMobileSidebar}
          aria-hidden="true"
        ></div>
      )}

      <aside 
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white text-gray-700 p-4 space-y-1 flex flex-col overflow-y-auto border-r border-gray-200 transition-transform duration-300 ease-in-out
                   md:relative md:translate-x-0 md:flex md:flex-shrink-0
                   ${isMobileSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}`}
        aria-label="Menu Navigasi Utama"
      >
        <div 
          className="text-2xl font-semibold text-center text-sky-600 py-3 mb-4 cursor-pointer hover:text-sky-700 transition-colors"
          onClick={() => handleNavigationAndCloseMobile('dashboard')}
          role="button"
          tabIndex={0}
          aria-label="Ke Dashboard Utama"
        >
          Digital Desa
        </div>
        <nav className="flex-grow space-y-1">
          {/* Planning Menu Item */}
          <div>
            <button
              onClick={() => handleNavigationAndCloseMobile('planning', 'planning')}
              className={`group w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                          ${selectedKey === 'planning'
                  ? 'bg-sky-100 text-sky-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
                          focus:outline-none focus:ring-2 focus:ring-sky-500/50`}
              aria-current={selectedKey === 'planning' ? 'page' : undefined}
            >
              {React.cloneElement(planningIcon, { className: `w-5 h-5 mr-3 flex-shrink-0 ${selectedKey === 'planning' ? 'text-sky-600' : 'text-gray-500 group-hover:text-sky-600'}` })}
              <span className="flex-grow">{categories[BOOK_CATEGORIES.PERENCANAAN_DESA] || "Perencanaan Desa"}</span>
            </button>
          </div>

          {/* Surat Maker Menu Item */}
          {suratMakerMenuItem && (
             <div>
                <button
                onClick={() => handleNavigationAndCloseMobile('surat_maker', PEMBUAT_SURAT_KEY)}
                className={`group w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                            ${selectedKey === PEMBUAT_SURAT_KEY
                    ? 'bg-sky-100 text-sky-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                            focus:outline-none focus:ring-2 focus:ring-sky-500/50`}
                aria-current={selectedKey === PEMBUAT_SURAT_KEY ? 'page' : undefined}
                >
                {suratMakerMenuItem.icon && React.cloneElement(suratMakerMenuItem.icon, { className: `w-5 h-5 mr-3 flex-shrink-0 ${selectedKey === PEMBUAT_SURAT_KEY ? 'text-sky-600' : 'text-gray-500 group-hover:text-sky-600'}` })}
                <span className="flex-grow">{suratMakerMenuItem.label}</span>
                </button>
            </div>
          )}


          {/* Other Book Categories */}
          {actualGroupedMenuItems.map((group) => (
            group.items.length > 0 && ( 
              <div key={group.key}>
                <button
                  onClick={() => toggleCategory(group.name)}
                  className="w-full flex justify-between items-center text-left px-3 py-2.5 rounded-md text-sm 
                            text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900
                            focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  aria-expanded={!!openCategories[group.name]}
                  aria-controls={`category-items-${group.key}`}
                >
                  <span className="flex-grow">{group.name}</span>
                  <ChevronIcon isOpen={!!openCategories[group.name]} className="text-gray-500" />
                </button>
                {openCategories[group.name] && (
                  <ul id={`category-items-${group.key}`} className="space-y-1 mt-1 pl-4">
                    {group.items.map((item) => (
                      <li key={item.key}>
                        <button
                          onClick={() => handleNavigationAndCloseMobile(
                              item.key === DATA_DESA_KEY ? 'data_desa' :
                              item.key === USAGE_GUIDE_KEY ? 'usage_guide' :
                              'book',
                              item.key
                          )}
                          className={`group w-full flex items-center text-left pl-3 pr-2 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                            ${selectedKey === item.key
                              ? 'bg-sky-100 text-sky-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            } focus:outline-none focus:ring-1 focus:ring-sky-500/50`}
                          aria-current={selectedKey === item.key ? 'page' : undefined}
                        >
                          {item.icon && React.cloneElement(item.icon, { className: `w-5 h-5 mr-2.5 flex-shrink-0 ${selectedKey === item.key ? 'text-sky-600' : 'text-gray-500 group-hover:text-sky-600'}` })}
                          <span className="flex-grow text-xs tracking-normal">{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          ))}
        </nav>
        {/* Database Utilities Section */}
        <div className="pt-2 mt-2 border-t border-gray-200 space-y-1">
          <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Utilitas Database
            </h3>
            <button
              onClick={() => handleUtilityAction(onBackupDatabase)}
              className="group w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              aria-label="Backup Database Aplikasi"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-3 flex-shrink-0 text-gray-500 group-hover:text-sky-600" />
              <span className="flex-grow">Backup Database</span>
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelected}
              accept=".db,.sqlite,.sqlite3,application/octet-stream,application/x-sqlite3"
              style={{ display: 'none' }}
              aria-hidden="true"
            />
            <button
              onClick={handleRestoreClick} 
              className="group w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              aria-label="Restore Database Aplikasi"
            >
              <ArrowUpTrayIcon className="w-5 h-5 mr-3 flex-shrink-0 text-gray-500 group-hover:text-sky-600" />
              <span className="flex-grow">Restore Database</span>
            </button>
        </div>

        {/* User Settings Section */}
        <div className="pt-2 mt-2 border-t border-gray-200 space-y-1">
          <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Pengaturan Pengguna
            </h3>
            <button
              onClick={() => handleUtilityAction(onChangePassword)}
              className="group w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              aria-label="Ubah Kata Sandi"
            >
              <KeyIcon className="w-5 h-5 mr-3 flex-shrink-0 text-gray-500 group-hover:text-sky-600" />
              <span className="flex-grow">Ubah Kata Sandi</span>
            </button>
        </div>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={() => handleUtilityAction(onLogout)}
            className="group w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500/50"
            aria-label="Logout Aplikasi"
          >
            <LogoutIcon className="w-5 h-5 mr-3 flex-shrink-0 text-red-500 group-hover:text-red-600" />
            <span className="flex-grow">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
