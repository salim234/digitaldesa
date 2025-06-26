import React, { useMemo, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { AllDataBooks, GenericEntry, BookDefinition, BukuIndukPenduduk, BukuInventaris, BukuTanah, BukuPeraturan, BukuAparat, BukuAgendaSuratMasuk, BukuKegiatanPembangunan, BukuApbdes } from '../types';
import { UsersIcon, BanknotesIcon, DocumentTextIcon, BuildingOfficeIcon, InboxArrowDownIcon, FolderIcon } from '../constants';

// Register Chart.js components
Chart.register(...registerables);

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  linkKey?: string;
  viewType?: 'book' | 'planning';
  onNavigate?: (viewType: 'book' | 'planning', key?: string) => void;
  isLoading?: boolean;
  unit?: string;
}

const Card: React.FC<DashboardCardProps> = ({ title, value, icon, linkKey, viewType = 'book', onNavigate, isLoading, unit }) => {
  const cardContent = (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-md font-semibold text-gray-700">{title}</h3>
        {React.cloneElement(icon, { className: "w-7 h-7 text-sky-500" })}
      </div>
      {isLoading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-800">
          {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
          {unit && <span className="text-lg font-medium text-gray-500 ml-1">{unit}</span>}
        </p>
      )}
    </>
  );

  if (linkKey && onNavigate) {
    return (
      <button
        onClick={() => onNavigate(viewType, linkKey)}
        className="block w-full text-left bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-60"
        aria-label={`Lihat detail ${title}`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg">
      {cardContent}
    </div>
  );
};


interface MiniCardListItemProps {
  primaryText: string;
  secondaryText?: string;
  tertiaryText?: string;
  linkKey?: string;
  onNavigate?: (viewType: 'book' | 'planning', key?: string) => void; 
}

const MiniCardListItem: React.FC<MiniCardListItemProps> = ({ primaryText, secondaryText, tertiaryText, linkKey, onNavigate }) => {
    const content = (
        <>
            <h4 className="text-sm font-semibold text-sky-700 truncate">{primaryText}</h4>
            {secondaryText && <p className="text-xs text-gray-600 truncate">{secondaryText}</p>}
            {tertiaryText && <p className="text-xs text-gray-500 truncate">{tertiaryText}</p>}
        </>
    );

    if (linkKey && onNavigate) {
        return (
            <button
                onClick={() => onNavigate('book', linkKey)} 
                className="block w-full text-left p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-sky-400"
                aria-label={`Buka detail untuk ${primaryText}`}
            >
               {content}
            </button>
        );
    }
    return (
        <div className="p-3 bg-gray-50 rounded-lg">
            {content}
        </div>
    );
}

// Helper function to calculate age
const calculateAge = (birthDateString?: string): number | null => {
  if (!birthDateString) return null;
  try {
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return null; // Invalid date
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch (e) {
    return null;
  }
};

// Reusable Chart Component
interface ChartComponentProps {
  chartId: string;
  type: 'bar' | 'pie' | 'doughnut' | 'line';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  options?: any;
  title: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartId, type, data, options, title }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null); // To store Chart.js instance

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy(); // Destroy previous instance if exists
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, {
          type: type,
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: type === 'pie' || type === 'doughnut' ? 'top' : 'top',
                labels: {
                    font: { size: 10 }
                }
              },
              title: {
                display: false, // Title is handled externally by the card
              },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null && type !== 'pie' && type !== 'doughnut') {
                      label += context.parsed.y.toLocaleString('id-ID');
                    } else if (context.parsed !== null && (type === 'pie' || type === 'doughnut')) {
                       label += context.parsed.toLocaleString('id-ID');
                    }
                    return label;
                  }
                }
              }
            },
            scales: (type === 'bar' || type === 'line') ? {
              y: {
                beginAtZero: true,
                ticks: {
                  font: { size: 10 },
                  callback: function(value:any) {
                      if (Number.isInteger(value)) {
                          return value.toLocaleString('id-ID');
                      }
                      return null; // hide non-integer ticks for counts
                  }
                }
              },
              x: {
                ticks: { font: { size: 10 } }
              }
            } : undefined,
            ...options,
          },
        });
      }
    }
    // Cleanup function to destroy chart instance on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [type, data, options, title]); // Re-run effect if data or type changes

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg h-80 sm:h-96 flex flex-col">
      <h3 className="text-md font-semibold text-gray-700 mb-3 text-center">{title}</h3>
      <div className="relative flex-grow">
        <canvas id={chartId} ref={chartRef}></canvas>
      </div>
    </div>
  );
};


interface DashboardProps {
  allData: AllDataBooks;
  menuItems: BookDefinition[];
  onSelectNavigation: (viewType: 'book' | 'planning' | 'dashboard', key?: string) => void;
  getBookData: (bookKey: keyof AllDataBooks) => GenericEntry[];
}

export const Dashboard: React.FC<DashboardProps> = ({ allData, menuItems, onSelectNavigation, getBookData }) => {

  const pendudukData = useMemo(() => getBookData('buku_induk_penduduk') as BukuIndukPenduduk[], [getBookData]);
  const inventarisData = useMemo(() => getBookData('buku_inventaris') as BukuInventaris[], [getBookData]);
  const tanahKasData = useMemo(() => getBookData('buku_tanah_kas') as BukuTanah[], [getBookData]);
  const tanahDesaData = useMemo(() => getBookData('buku_tanah_desa') as BukuTanah[], [getBookData]);
  const peraturanData = useMemo(() => getBookData('buku_peraturan') as BukuPeraturan[], [getBookData]);
  const aparatData = useMemo(() => getBookData('buku_aparat') as BukuAparat[], [getBookData]);
  const suratMasukData = useMemo(() => getBookData('buku_agenda_surat_masuk') as BukuAgendaSuratMasuk[], [getBookData]);
  const kegiatanPembangunanData = useMemo(() => getBookData('buku_kegiatan_pembangunan') as BukuKegiatanPembangunan[], [getBookData]);
  const apbdesData = useMemo(() => getBookData('buku_apbdes') as BukuApbdes[], [getBookData]);

  const totalPenduduk = useMemo(() => pendudukData.length, [pendudukData]);
  const totalKK = useMemo(() => new Set(pendudukData.map(p => p.nomor_kk)).size, [pendudukData]);

  const totalNilaiAset = useMemo(() => {
    const nilaiInventaris = inventarisData.reduce((sum, item) => sum + (item.harga_perolehan || 0), 0);
    const nilaiTanahKas = tanahKasData.reduce((sum, item) => sum + (item.nilai_aset_tanah || 0), 0);
    const nilaiTanahDesa = tanahDesaData.reduce((sum, item) => sum + (item.nilai_aset_tanah || 0), 0);
    return nilaiInventaris + nilaiTanahKas + nilaiTanahDesa;
  }, [inventarisData, tanahKasData, tanahDesaData]);

  const totalPeraturan = useMemo(() => peraturanData.length, [peraturanData]);
  const totalAparat = useMemo(() => aparatData.length, [aparatData]);

  const suratMasukTerbaru = useMemo(() => {
    return suratMasukData
      .sort((a, b) => new Date(b.tanggal_diterima).getTime() - new Date(a.tanggal_diterima).getTime())
      .slice(0, 3);
  }, [suratMasukData]);

  const kegiatanPembangunanBerjalan = useMemo(() => {
    return kegiatanPembangunanData.filter(k => (k.persentase_kemajuan || 0) < 100).length;
  }, [kegiatanPembangunanData]);

  const ringkasanApbdesTerkini = useMemo(() => {
    if (apbdesData.length === 0) return { tahun: 'N/A', pendapatan: 0, belanja: 0, sisa: 0 };

    const latestYear = Math.max(...apbdesData.map(a => parseInt(a.tahun_apbdes, 10)));
    const dataTahunTerkini = apbdesData.filter(a => parseInt(a.tahun_apbdes, 10) === latestYear);

    const pendapatan = dataTahunTerkini
      .filter(a => a.jenis_anggaran === 'Pendapatan')
      .reduce((sum, item) => sum + (item.jumlah || 0), 0);
    const belanja = dataTahunTerkini
      .filter(a => a.jenis_anggaran === 'Belanja')
      .reduce((sum, item) => sum + (item.jumlah || 0), 0);

    return { tahun: latestYear.toString(), pendapatan, belanja, sisa: pendapatan - belanja };
  }, [apbdesData]);
  
  // --- Demographics Data Processing ---
  const genderData = useMemo(() => {
    const counts: Record<string, number> = {};
    pendudukData.forEach(p => {
      const gender = p.jenis_kelamin || 'Tidak Diketahui';
      counts[gender] = (counts[gender] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Jumlah Penduduk',
        data: Object.values(counts),
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      }]
    };
  }, [pendudukData]);

  const ageGroupData = useMemo(() => {
    const ageGroups = {
      '0-4 Thn': 0, '5-11 Thn': 0, '12-14 Thn': 0, '15-17 Thn': 0, 
      '18-24 Thn': 0, '25-54 Thn': 0, '55-64 Thn': 0, '65+ Thn': 0, 'Tidak Diketahui': 0,
    };
    pendudukData.forEach(p => {
      const age = calculateAge(p.tanggal_lahir);
      if (age === null) ageGroups['Tidak Diketahui']++;
      else if (age <= 4) ageGroups['0-4 Thn']++;
      else if (age <= 11) ageGroups['5-11 Thn']++;
      else if (age <= 14) ageGroups['12-14 Thn']++;
      else if (age <= 17) ageGroups['15-17 Thn']++;
      else if (age <= 24) ageGroups['18-24 Thn']++;
      else if (age <= 54) ageGroups['25-54 Thn']++;
      else if (age <= 64) ageGroups['55-64 Thn']++;
      else ageGroups['65+ Thn']++;
    });
    return {
      labels: Object.keys(ageGroups),
      datasets: [{
        label: 'Jumlah Penduduk',
        data: Object.values(ageGroups),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    };
  }, [pendudukData]);

  const occupationData = useMemo(() => {
    const counts: Record<string, number> = {};
    pendudukData.forEach(p => {
      const occupation = p.pekerjaan?.trim() || 'Tidak Diketahui/Belum Bekerja';
      counts[occupation] = (counts[occupation] || 0) + 1;
    });
     // Sort by count descending and take top N or handle many categories
    const sortedOccupations = Object.entries(counts).sort(([,a],[,b]) => b-a);
    const topN = 10;
    const mainLabels = sortedOccupations.slice(0, topN).map(([label]) => label);
    const mainData = sortedOccupations.slice(0, topN).map(([,count]) => count);
    if (sortedOccupations.length > topN) {
        mainLabels.push('Lainnya');
        mainData.push(sortedOccupations.slice(topN).reduce((sum, [,count]) => sum + count, 0));
    }

    return {
      labels: mainLabels,
      datasets: [{
        label: 'Jumlah Penduduk',
        data: mainData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }]
    };
  }, [pendudukData]);

  const educationData = useMemo(() => {
    const counts: Record<string, number> = {};
    const educationOrder = [
        'Tidak/Belum Sekolah', 'Belum Tamat SD/Sederajat', 'Tamat SD/Sederajat',
        'SLTP/Sederajat', 'SLTA/Sederajat', 
        'Diploma I/II', 'Akademi/Diploma III/S. Muda', 
        'Diploma IV/Strata I', 'Strata II', 'Strata III', 
        'Lainnya', 'Tidak Diketahui'
    ];

    pendudukData.forEach(p => {
      const education = p.pendidikan_terakhir?.trim() || 'Tidak Diketahui';
      counts[education] = (counts[education] || 0) + 1;
    });
    
    // Sort labels according to educationOrder
    const sortedLabels = educationOrder.filter(edu => counts[edu] > 0);
    // Add any education levels from data not in predefined order to the end
    Object.keys(counts).forEach(edu => {
        if (!sortedLabels.includes(edu) && counts[edu] > 0) {
            sortedLabels.push(edu);
        }
    });

    return {
      labels: sortedLabels,
      datasets: [{
        label: 'Jumlah Penduduk',
        data: sortedLabels.map(label => counts[label]),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      }]
    };
  }, [pendudukData]);


  const commonIconProps = { width: 20, height: 20 };

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Administrasi Desa</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <Card title="Total Penduduk" value={totalPenduduk} icon={<UsersIcon {...commonIconProps} />} linkKey="buku_induk_penduduk" onNavigate={onSelectNavigation} unit="Jiwa"/>
        <Card title="Total Kartu Keluarga" value={totalKK} icon={<UsersIcon {...commonIconProps} />} linkKey="buku_induk_penduduk" onNavigate={onSelectNavigation} unit="KK"/>
        <Card title="Total Nilai Aset" value={totalNilaiAset.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })} icon={<FolderIcon {...commonIconProps} />} linkKey="buku_inventaris" onNavigate={onSelectNavigation} />
        <Card title="Peraturan Desa" value={totalPeraturan} icon={<DocumentTextIcon {...commonIconProps} />} linkKey="buku_peraturan" onNavigate={onSelectNavigation} unit="Dokumen"/>
        <Card title="Aparat Desa" value={totalAparat} icon={<UsersIcon {...commonIconProps} />} linkKey="buku_aparat" onNavigate={onSelectNavigation} unit="Orang"/>
        <Card title="Keg. Pembangunan" value={kegiatanPembangunanBerjalan} icon={<BuildingOfficeIcon {...commonIconProps} />} linkKey="buku_kegiatan_pembangunan" onNavigate={onSelectNavigation} unit="Aktif"/>
      </div>

      {/* Demographics Section */}
      <div className="pt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Demografi Penduduk</h2>
        {pendudukData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <ChartComponent chartId="genderChart" type="pie" data={genderData} title="Distribusi Jenis Kelamin" />
            <ChartComponent chartId="ageGroupChart" type="bar" data={ageGroupData} title="Distribusi Kelompok Umur" />
            <ChartComponent chartId="occupationChart" type="bar" data={occupationData} title="Distribusi Jenis Pekerjaan (Top 10)" 
              options={{ indexAxis: 'y', scales: { y: { ticks: { font: {size: 9} } } } }} />
            <ChartComponent chartId="educationChart" type="bar" data={educationData} title="Distribusi Tingkat Pendidikan" 
              options={{ indexAxis: 'y', scales: { y: { ticks: { font: {size: 9} } } } }}/>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-xl shadow-lg text-center text-gray-500">
            <UsersIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            Data penduduk belum tersedia untuk menampilkan grafik demografi. <br/>
            Silakan isi <button onClick={() => onSelectNavigation('book', 'buku_induk_penduduk')} className="text-sky-600 hover:underline font-medium">Buku Induk Penduduk</button> terlebih dahulu.
          </div>
        )}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-lg space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Ringkasan APBDes ({ringkasanApbdesTerkini.tahun})</h2>
          {apbdesData.length > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-700">Total Pendapatan:</span>
                <span className="text-lg font-bold text-green-800">{ringkasanApbdesTerkini.pendapatan.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-red-700">Total Belanja:</span>
                <span className="text-lg font-bold text-red-800">{ringkasanApbdesTerkini.belanja.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg ${ringkasanApbdesTerkini.sisa >= 0 ? 'bg-sky-50' : 'bg-yellow-50'}`}>
                <span className={`text-sm font-medium ${ringkasanApbdesTerkini.sisa >= 0 ? 'text-sky-700' : 'text-yellow-700'}`}>Sisa/Defisit Anggaran:</span>
                <span className={`text-lg font-bold ${ringkasanApbdesTerkini.sisa >= 0 ? 'text-sky-800' : 'text-yellow-800'}`}>{ringkasanApbdesTerkini.sisa.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</span>
              </div>
               <button
                onClick={() => onSelectNavigation('planning')}
                className="mt-3 w-full text-sm text-sky-600 hover:text-sky-800 font-medium py-2 px-3 rounded-md hover:bg-sky-100 transition-colors"
                >
                Lihat Detail Perencanaan & APBDes &rarr;
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Data APBDes belum tersedia.</p>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg space-y-3">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Surat Masuk Terbaru</h2>
          {suratMasukTerbaru.length > 0 ? (
            <ul className="space-y-2.5">
              {suratMasukTerbaru.map(surat => (
                <li key={surat.id}>
                    <MiniCardListItem
                        primaryText={surat.perihal_surat}
                        secondaryText={`Dari: ${surat.pengirim}`}
                        tertiaryText={`Diterima: ${new Date(surat.tanggal_diterima).toLocaleDateString('id-ID', {day: '2-digit', month:'short', year:'numeric'})}`}
                        linkKey='buku_agenda_surat_masuk'
                        onNavigate={onSelectNavigation}
                    />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Tidak ada surat masuk baru.</p>
          )}
           <button
            onClick={() => onSelectNavigation('book', 'buku_agenda_surat_masuk')}
            className="mt-3 w-full text-sm text-sky-600 hover:text-sky-800 font-medium py-2 px-3 rounded-md hover:bg-sky-100 transition-colors"
            >
            Lihat Semua Surat Masuk &rarr;
          </button>
        </div>
      </div>

    </div>
  );
};