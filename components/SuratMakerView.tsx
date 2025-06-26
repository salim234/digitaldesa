
import React, { useState, useMemo, useEffect } from 'react';
import { DataDesaEntry, SuratUndanganFormData, SuratPemberitahuanFormData, SuratKeteranganFormData, LetterType, AnyLetterFormData, KlasifikasiSuratKeterangan, AllDataBooks, BukuIndukPenduduk } from '../types';
import { printHtmlDocument, downloadDoc } from '../exportUtils';
import { KLASIFIKASI_SURAT_KETERANGAN_OPTIONS } from '../constants';


interface SuratMakerViewProps {
  dataDesa: DataDesaEntry | null;
  allData: AllDataBooks; // Added to receive all book data for NIK search
}

const generateFullNomorSurat = (
    klasifikasiKode: string, 
    nomorUrutInput: string, 
    kodeDesa: string | undefined, 
    tahun: number
): string => {
    const paddedNomorUrut = nomorUrutInput.padStart(3, '0');
    return `${klasifikasiKode}/${paddedNomorUrut}/${kodeDesa || 'KODE.DESA'}/${tahun}`;
};


const initialUndanganFormData: SuratUndanganFormData = {
  nomor_surat: '',
  lampiran: '',
  perihal: 'Undangan Rapat',
  tanggal_surat: new Date().toISOString().split('T')[0],
  kepada_yth: '',
  di_tempat: 'Tempat',
  isi_pembuka: 'Dengan hormat,\\nMengharap dengan hormat kehadiran Bapak/Ibu/Saudara/i dalam acara rapat yang akan diselenggarakan pada:',
  isi_acara: '',
  isi_tanggal_acara: '',
  isi_waktu_acara: '',
  isi_tempat_acara: '',
  isi_penutup: 'Demikian undangan ini kami sampaikan. Besar harapan kami atas kehadiran Bapak/Ibu/Saudara/i tepat pada waktunya. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.',
  nama_penandatangan: '',
  jabatan_penandatangan: '',
  nama_tembusan: '',
};

const initialPemberitahuanFormData: SuratPemberitahuanFormData = {
  nomor_surat: '',
  lampiran: '',
  perihal: 'Pemberitahuan',
  tanggal_surat: new Date().toISOString().split('T')[0],
  kepada_yth: '',
  di_tempat: 'Tempat',
  isi_pembuka: 'Dengan hormat,\\nBersama ini kami sampaikan pemberitahuan sebagai berikut:',
  isi_pemberitahuan: '',
  isi_penutup: 'Demikian pemberitahuan ini kami sampaikan untuk menjadi maklum dan atas perhatiannya diucapkan terima kasih.',
  nama_penandatangan: '',
  jabatan_penandatangan: '',
  nama_tembusan: '',
};

const initialKeteranganFormData = (kodeDesa?: string, namaKades?: string, jabatanKades?: string): SuratKeteranganFormData => {
    const defaultKlasifikasi = KLASIFIKASI_SURAT_KETERANGAN_OPTIONS[0]?.kode || "000/00";
    const defaultNomorUrut = "001";
    const currentYear = new Date().getFullYear();
    
    return {
        klasifikasi_surat_kode: defaultKlasifikasi,
        nomor_urut_input: defaultNomorUrut,
        nomor_surat: generateFullNomorSurat(defaultKlasifikasi, defaultNomorUrut, kodeDesa, currentYear),
        tanggal_surat: new Date().toISOString().split('T')[0],
        nama_pemohon: '',
        nik_pemohon: '',
        tempat_lahir_pemohon: '',
        tanggal_lahir_pemohon: '',
        jenis_kelamin_pemohon: 'Laki-laki',
        agama_pemohon: 'Islam',
        status_perkawinan_pemohon: 'Belum Kawin',
        pekerjaan_pemohon: '',
        alamat_pemohon: '',
        keperluan: '',
        detail_keperluan_data: {}, // Initialize for specific details
        nama_penandatangan: namaKades || '',
        jabatan_penandatangan: jabatanKades || 'Kepala Desa',
    };
};


const jenisKelaminOptions = ['Laki-laki', 'Perempuan'];
const agamaOptions = ['Islam', 'Kristen Protestan', 'Kristen Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'];
const statusPerkawinanOptions = ['Belum Kawin', 'Kawin Tercatat', 'Kawin Belum Tercatat', 'Cerai Hidup', 'Cerai Mati'];


export const SuratMakerView: React.FC<SuratMakerViewProps> = ({ dataDesa, allData }) => {
  const [selectedLetterType, setSelectedLetterType] = useState<LetterType>('undangan');
  
  const [formData, setFormData] = useState<AnyLetterFormData>(initialUndanganFormData);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [nikToSearch, setNikToSearch] = useState('');

  useEffect(() => {
    if (dataDesa?.nama_kepala_desa) {
      const namaKades = dataDesa.nama_kepala_desa;
      const jabatanKades = "Kepala Desa"; 

      setFormData(prev => {
        const updatedPrev = { 
          ...prev, 
          nama_penandatangan: namaKades,
          jabatan_penandatangan: (prev as any).jabatan_penandatangan || jabatanKades 
        };

        if (selectedLetterType === 'keterangan') {
           // Ensure detail_keperluan_data is initialized if switching to keterangan
           if (!(prev as SuratKeteranganFormData).detail_keperluan_data) {
             (updatedPrev as SuratKeteranganFormData).detail_keperluan_data = {};
           }
           if (!(prev as SuratKeteranganFormData).nama_penandatangan) {
             (updatedPrev as SuratKeteranganFormData).jabatan_penandatangan = jabatanKades;
           }
        }
        return updatedPrev;
      });
    }
  }, [dataDesa, selectedLetterType]);

  useEffect(() => {
    if (selectedLetterType === 'keterangan') {
        const fd = formData as SuratKeteranganFormData;
        const newNomorSuratOtomatis = generateFullNomorSurat(fd.klasifikasi_surat_kode, fd.nomor_urut_input, dataDesa?.kode_desa, new Date().getFullYear());
        if (fd.nomor_surat !== newNomorSuratOtomatis) {
            setFormData(prev => ({
                ...prev,
                nomor_surat: newNomorSuratOtomatis,
            }));
        }
    }
  }, [dataDesa?.kode_desa, selectedLetterType, (formData as SuratKeteranganFormData).klasifikasi_surat_kode, (formData as SuratKeteranganFormData).nomor_urut_input]);


  const handleTypeChange = (type: LetterType) => {
    setSelectedLetterType(type);
    setPreviewHtml('');
    const namaKades = dataDesa?.nama_kepala_desa || '';
    const jabatanKades = 'Kepala Desa';

    if (type === 'undangan') {
      setFormData({...initialUndanganFormData, nama_penandatangan: namaKades, jabatan_penandatangan: jabatanKades});
    } else if (type === 'pemberitahuan') {
      setFormData({...initialPemberitahuanFormData, nama_penandatangan: namaKades, jabatan_penandatangan: jabatanKades});
    } else if (type === 'keterangan') {
      setFormData(initialKeteranganFormData(dataDesa?.kode_desa, namaKades, jabatanKades));
      setNikToSearch(''); 
    }
  };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const currentKeteranganData = formData as SuratKeteranganFormData;

    if (selectedLetterType === 'keterangan' && name.startsWith('detail_')) {
        const detailKey = name.split('detail_')[1];
        setFormData(prev => ({
            ...prev,
            detail_keperluan_data: {
                ...(prev as SuratKeteranganFormData).detail_keperluan_data,
                [detailKey]: value,
            }
        }));
    } else if (selectedLetterType === 'keterangan' && (name === 'klasifikasi_surat_kode' || name === 'nomor_urut_input')) {
        const newKlasifikasi = name === 'klasifikasi_surat_kode' ? value : currentKeteranganData.klasifikasi_surat_kode;
        const newNomorUrut = name === 'nomor_urut_input' ? value : currentKeteranganData.nomor_urut_input;
        const newNomorSuratOtomatis = generateFullNomorSurat(newKlasifikasi, newNomorUrut, dataDesa?.kode_desa, new Date().getFullYear());
        
        setFormData(prev => ({
            ...prev,
            [name]: value,
            nomor_surat: newNomorSuratOtomatis,
             // Reset detail_keperluan_data if klasifikasi changes to ensure relevance
            detail_keperluan_data: name === 'klasifikasi_surat_kode' ? {} : (prev as SuratKeteranganFormData).detail_keperluan_data,
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleNikSearch = () => {
    if (selectedLetterType !== 'keterangan' || !nikToSearch) {
      alert("Silakan masukkan NIK yang valid.");
      return;
    }
    const pendudukList = allData?.buku_induk_penduduk || [];
    const foundPenduduk = pendudukList.find(p => p.nik === nikToSearch);

    if (foundPenduduk) {
      const alamatLengkap = [
        foundPenduduk.alamat,
        foundPenduduk.rt && foundPenduduk.rw ? `RT ${foundPenduduk.rt}/RW ${foundPenduduk.rw}` : (foundPenduduk.rt ? `RT ${foundPenduduk.rt}` : (foundPenduduk.rw ? `RW ${foundPenduduk.rw}` : '')),
        `Desa ${dataDesa?.nama_desa || ''}`,
        `Kecamatan ${dataDesa?.nama_kecamatan || ''}`,
        `Kabupaten ${dataDesa?.nama_kabupaten_kota || ''}`
      ].filter(Boolean).join(', ');

      setFormData(prev => ({
        ...(prev as SuratKeteranganFormData),
        nama_pemohon: foundPenduduk.nama || '',
        nik_pemohon: foundPenduduk.nik || '',
        tempat_lahir_pemohon: foundPenduduk.tempat_lahir || '',
        tanggal_lahir_pemohon: foundPenduduk.tanggal_lahir || '',
        jenis_kelamin_pemohon: foundPenduduk.jenis_kelamin || 'Laki-laki',
        agama_pemohon: foundPenduduk.agama || 'Islam',
        status_perkawinan_pemohon: foundPenduduk.status_perkawinan || 'Belum Kawin',
        pekerjaan_pemohon: foundPenduduk.pekerjaan || '',
        alamat_pemohon: alamatLengkap,
      }));
      alert(`Data penduduk dengan NIK ${nikToSearch} ditemukan dan diisi ke formulir.`);
    } else {
      alert(`Penduduk dengan NIK ${nikToSearch} tidak ditemukan dalam Buku Induk Penduduk.`);
    }
  };


  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    } catch {
        return dateString;
    }
  };


  const generateLetterHtml = (): string => {
    let body = '';
    const namaDesaFormatted = dataDesa?.nama_desa ? dataDesa.nama_desa.charAt(0).toUpperCase() + dataDesa.nama_desa.slice(1).toLowerCase() : 'Desa';
    const namaKecamatanFormatted = dataDesa?.nama_kecamatan || '...................';
    const namaKabupatenFormatted = dataDesa?.nama_kabupaten_kota || '...................';


    if (selectedLetterType === 'keterangan') {
        const fd = formData as SuratKeteranganFormData;
        const details = fd.detail_keperluan_data || {};
        const selectedKlasifikasi = KLASIFIKASI_SURAT_KETERANGAN_OPTIONS.find(k => k.kode === fd.klasifikasi_surat_kode);
        const judulSuratKeterangan = selectedKlasifikasi ? selectedKlasifikasi.label.toUpperCase() : "SURAT KETERANGAN";

        body += `<div style="text-align: center; font-family: 'Times New Roman', Times, serif; font-size: 14pt; margin-bottom: 5px;">
                    <p style="margin:0; font-weight: bold; text-decoration: underline;">${judulSuratKeterangan}</p>
                    <p style="margin:0; font-size: 12pt;">Nomor: ${fd.nomor_surat || '........... / ........... / ...........'}</p>
                 </div>`;
        
        body += `<p style="text-indent: 50px; margin-top:20px; margin-bottom: 15px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; text-align:justify;">
                    Yang bertanda tangan di bawah ini, Kepala Desa ${namaDesaFormatted}, Kecamatan ${namaKecamatanFormatted}, Kabupaten ${namaKabupatenFormatted}, menerangkan dengan sebenarnya bahwa:
                 </p>`;

        body += `<table style="width: 100%; margin-left: 50px; border-collapse:collapse; margin-bottom:15px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5;">
                    <tr><td style="width: 30%; vertical-align:top; padding: 1px 0;">Nama Lengkap</td><td style="width:5%; vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${fd.nama_pemohon || '...........'}</td></tr>
                    <tr><td style="vertical-align:top; padding: 1px 0;">NIK</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${fd.nik_pemohon || '...........'}</td></tr>
                    <tr><td style="vertical-align:top; padding: 1px 0;">Tempat/Tanggal Lahir</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${fd.tempat_lahir_pemohon || '...........'}, ${formatDate(fd.tanggal_lahir_pemohon)}</td></tr>
                    <tr><td style="vertical-align:top; padding: 1px 0;">Jenis Kelamin</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${fd.jenis_kelamin_pemohon || '...........'}</td></tr>
                    <tr><td style="vertical-align:top; padding: 1px 0;">Agama</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${fd.agama_pemohon || '...........'}</td></tr>
                    <tr><td style="vertical-align:top; padding: 1px 0;">Status Perkawinan</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${fd.status_perkawinan_pemohon || '...........'}</td></tr>
                    <tr><td style="vertical-align:top; padding: 1px 0;">Pekerjaan</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${fd.pekerjaan_pemohon || '...........'}</td></tr>
                    <tr><td style="vertical-align:top; padding: 1px 0;">Alamat</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${fd.alamat_pemohon || '...........'}</td></tr>
                 </table>`;
        
        body += `<p style="text-indent: 50px; margin-top:15px; margin-bottom: 10px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; text-align:justify;">
                    Bahwa nama tersebut di atas adalah benar penduduk Desa ${namaDesaFormatted}, Kecamatan ${namaKecamatanFormatted}, Kabupaten ${namaKabupatenFormatted}.
                 </p>`;
        
        body += `<p style="text-indent: 50px; margin-top:10px; margin-bottom: 10px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; text-align:justify;">
                    Selanjutnya, berdasarkan data yang ada pada kami dan/atau sepengetahuan kami, dengan ini diterangkan hal-hal sebagai berikut:
                 </p>`;

        const narasiKeperluan = fd.keperluan ? fd.keperluan : (selectedKlasifikasi?.deskripsiSingkat || 'Keperluan Tertentu');
        
        body += `<div style="margin-left: 50px; margin-right: 20px; margin-top:5px; margin-bottom: 15px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; text-align:justify;">
                    ${narasiKeperluan.split('\n').map(line => `<p style="margin-bottom: 0.5em; text-indent: 0;">${line || '&nbsp;'}</p>`).join('')}
                 </div>`;

        let detailNarasi = '';
        if (fd.klasifikasi_surat_kode === "511/01") { // SKU
            detailNarasi = `Adapun detail usaha yang bersangkutan adalah sebagai berikut:
                            <table style="width: 90%; margin-left: 0px; border-collapse:collapse; margin-top:5px; margin-bottom:5px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5;">
                                <tr><td style="width: 30%; vertical-align:top; padding: 1px 0;">Nama Usaha</td><td style="width:5%; vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${details.nama_usaha || '...........'}</td></tr>
                                <tr><td style="vertical-align:top; padding: 1px 0;">Jenis Usaha</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${details.jenis_usaha || '...........'}</td></tr>
                                <tr><td style="vertical-align:top; padding: 1px 0;">Alamat Usaha</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${details.alamat_usaha || '...........'}</td></tr>
                                <tr><td style="vertical-align:top; padding: 1px 0;">Dimulai Sejak</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${details.dimulai_sejak ? (details.dimulai_sejak.includes('-') ? formatDate(details.dimulai_sejak) : details.dimulai_sejak) : '...........'}</td></tr>
                            </table>`;
        } else if (fd.klasifikasi_surat_kode === "470/01") { // Domisili
             if (details.sejak_tanggal_domisili) {
                detailNarasi = `Yang bersangkutan telah berdomisili di alamat tersebut sejak tanggal ${formatDate(details.sejak_tanggal_domisili)}.`;
             }
        } else if (fd.klasifikasi_surat_kode === "430/02") { // Kehilangan
             detailNarasi = `Menurut pengakuan yang bersangkutan, telah kehilangan barang berupa: <br/>
                            <ul style="margin-top:0; padding-left: 1.5em;">
                                ${(details.barang_hilang || '...........').split('\n').map((item: string) => `<li>${item.trim()}</li>`).join('')}
                            </ul>
                            Diperkirakan hilang di sekitar ${details.lokasi_perkiraan_hilang || '...........'} pada ${details.waktu_perkiraan_hilang || '...........'}.`;
        } else if (fd.klasifikasi_surat_kode === "472/01") { // Pengantar Nikah
             detailNarasi = `Akan melangsungkan pernikahan dengan seorang ${details.jenis_kelamin_calon_pasangan === 'Laki-laki' ? 'pria' : 'wanita'} dengan data sebagai berikut:
                            <table style="width: 90%; margin-left: 0px; border-collapse:collapse; margin-top:5px; margin-bottom:5px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5;">
                                <tr><td style="width: 30%; vertical-align:top; padding: 1px 0;">Nama Calon Pasangan</td><td style="width:5%; vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${details.nama_calon_pasangan || '...........'}</td></tr>
                                <tr><td style="vertical-align:top; padding: 1px 0;">NIK Calon Pasangan</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${details.nik_calon_pasangan || '...........'}</td></tr>
                                <tr><td style="vertical-align:top; padding: 1px 0;">Tempat/Tgl Lahir Calon</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${details.tempat_lahir_calon_pasangan || '...........'}, ${formatDate(details.tanggal_lahir_calon_pasangan)}</td></tr>
                                <tr><td style="vertical-align:top; padding: 1px 0;">Alamat Calon Pasangan</td><td style="vertical-align:top; padding: 1px 0;">:</td><td style="vertical-align:top; padding: 1px 0;">${details.alamat_calon_pasangan || '...........'}</td></tr>
                            </table>`;
        }

        if (detailNarasi) {
            body += `<div style="margin-left: 50px; margin-right: 20px; margin-top:5px; margin-bottom: 15px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; text-align:justify;">
                        ${detailNarasi}
                     </div>`;
        }
        
        body += `<p style="text-indent: 50px; margin-top:15px; margin-bottom: 20px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; text-align:justify;">
                    Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya. Apabila di kemudian hari terdapat kekeliruan dalam surat keterangan ini, akan diadakan perbaikan sebagaimana mestinya.
                 </p>`;

    } else { // Undangan or Pemberitahuan (Existing logic)
        body += `<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-family: 'Times New Roman', Times, serif; font-size: 12pt;">
                    <tr>
                        <td style="width: 15%; padding: 2px 0;">Nomor</td>
                        <td style="width: 2%; padding: 2px 0;">:</td>
                        <td style="width: 48%; padding: 2px 0;">${formData.nomor_surat || '...........'}</td>
                        <td style="width: 35%; text-align: right; padding: 2px 0;">${namaDesaFormatted}, ${formatDate(formData.tanggal_surat)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0;">Lampiran</td>
                        <td style="padding: 2px 0;">:</td>
                        <td style="padding: 2px 0;">${(formData as SuratUndanganFormData | SuratPemberitahuanFormData).lampiran || '-'}</td>
                        <td style="padding: 2px 0;"></td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0;">Perihal</td>
                        <td style="padding: 2px 0;">:</td>
                        <td style="font-weight: bold; text-decoration: underline; padding: 2px 0;">${(formData as SuratUndanganFormData | SuratPemberitahuanFormData).perihal || '...........'}</td>
                        <td style="padding: 2px 0;"></td>
                    </tr>
                </table>`;

        body += `<div class="kepada-yth" style="margin-bottom: 20px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5;">
                    <p style="margin:0;">Kepada Yth.</p>
                    ${((formData as SuratUndanganFormData | SuratPemberitahuanFormData).kepada_yth || '...........').split('\n').map(line => `<p style="margin:0;">${line}</p>`).join('')}
                    <p style="margin:0.5em 0 0 0;">di -</p>
                    <p style="margin:0 0 0 1em;"><strong>${(formData as SuratUndanganFormData | SuratPemberitahuanFormData).di_tempat || 'Tempat'}</strong></p>
                </div>`;
        
        if (selectedLetterType === 'undangan') {
            const fd = formData as SuratUndanganFormData;
            body += `<p style="text-indent: 50px; margin-top:1em; margin-bottom: 1em; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; text-align:justify;">${fd.isi_pembuka.split('\n').map(l => l.trim()).join('<br/>') || ''}</p>
                    <table style="width: 100%; margin-left: 50px; border-collapse:collapse; margin-top:1em; margin-bottom:1em; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5;">
                            <tr><td style="width: 25%; vertical-align:top; padding: 2px 0;">Hari/Tanggal</td><td style="width:5%; vertical-align:top; padding: 2px 0;">:</td><td style="vertical-align:top; padding: 2px 0;"><strong>${formatDate(fd.isi_tanggal_acara)}</strong></td></tr>
                            <tr><td style="vertical-align:top; padding: 2px 0;">Waktu</td><td style="vertical-align:top; padding: 2px 0;">:</td><td style="vertical-align:top; padding: 2px 0;">${fd.isi_waktu_acara || '...........'}</td></tr>
                            <tr><td style="vertical-align:top; padding: 2px 0;">Tempat</td><td style="vertical-align:top; padding: 2px 0;">:</td><td style="vertical-align:top; padding: 2px 0;">${fd.isi_tempat_acara || '...........'}</td></tr>
                            <tr><td style="vertical-align:top; padding: 2px 0;">Acara</td><td style="vertical-align:top; padding: 2px 0;">:</td><td style="vertical-align:top; padding: 2px 0;">${fd.isi_acara || '...........'}</td></tr>
                    </table>
                    <p style="text-indent: 50px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; text-align:justify;">${fd.isi_penutup.split('\n').map(l => l.trim()).join('<br/>') || ''}</p>`;
        } else if (selectedLetterType === 'pemberitahuan') {
            const fd = formData as SuratPemberitahuanFormData;
            body += `<p style="text-indent: 50px; margin-top:1em; margin-bottom: 1em; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; text-align:justify;">${fd.isi_pembuka.split('\n').map(l => l.trim()).join('<br/>') || ''}</p>
                        <div class="isi-surat" style="margin-top:1em; margin-bottom:1em; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5;">
                            ${(fd.isi_pemberitahuan || '').split('\n').map(line => `<p style="margin-bottom:0.5em; text-align:justify;">${line}</p>`).join('')}
                        </div>
                    <p style="text-indent: 50px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; text-align:justify;">${fd.isi_penutup.split('\n').map(l => l.trim()).join('<br/>') || ''}</p>`;
        }
    }

    const namaPenandatangan = formData.nama_penandatangan || (dataDesa?.nama_kepala_desa || '(Nama Pejabat)');
    const jabatanPenandatangan = formData.jabatan_penandatangan || 'Kepala Desa';
    body += `<div class="signature-section" style="margin-top: 40px; font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5;">
                <table style="width:100%;">
                    <tr>
                        <td style="width:60%;"></td>
                        <td style="text-align:center;">
                             ${ selectedLetterType !== 'keterangan' ? `<p style="margin:0;">${namaDesaFormatted}, ${formatDate(formData.tanggal_surat)}</p>` : `<p style="margin:0;">Dikeluarkan di : ${namaDesaFormatted}</p><p style="margin:0;">Pada Tanggal : ${formatDate(formData.tanggal_surat)}</p>`}
                            <p style="margin:5px 0 0 0;">${jabatanPenandatangan} ${selectedLetterType === 'keterangan' && dataDesa?.nama_desa ? dataDesa.nama_desa : ''},</p>
                            <br><br><br><br>
                            <p style="margin:0; font-weight:bold; text-decoration:underline;">${namaPenandatangan}</p>
                        </td>
                    </tr>
                </table>
             </div>`;

    if (selectedLetterType !== 'keterangan' && (formData as SuratUndanganFormData | SuratPemberitahuanFormData).nama_tembusan && (formData as SuratUndanganFormData | SuratPemberitahuanFormData).nama_tembusan!.trim() !== '') {
        body += `<div class="tembusan" style="font-size: 11pt; margin-top: 30px; font-family: 'Times New Roman', Times, serif; line-height: 1.5;">
                    <p style="margin:0; font-weight:bold; text-decoration:underline;">Tembusan:</p>
                    <ol style="margin-top:0; padding-left:1.5em;">
                        ${(formData as SuratUndanganFormData | SuratPemberitahuanFormData).nama_tembusan!.split('\n').map(line => `<li>${line.trim()}</li>`).join('')}
                    </ol>
                 </div>`;
    }
    return body;
  };

  const handlePreview = () => {
    setPreviewHtml(generateLetterHtml());
  };

  const handlePrint = () => {
    const currentFullHtml = generateLetterHtml();
    setPreviewHtml(currentFullHtml);
    printHtmlDocument(`Surat ${selectedLetterType}`, currentFullHtml, dataDesa);
  };

  const handleDownload = () => {
    let htmlToDownload = previewHtml;
    if (!htmlToDownload) {
      htmlToDownload = generateLetterHtml();
      setPreviewHtml(htmlToDownload); 
    }

    let kopSuratForDoc = '';
    if (dataDesa) {
        kopSuratForDoc = `
          <div style="display: flex; align-items: flex-start; margin-bottom: 10px; padding-bottom: 10px; width: 100%; font-family: Arial, sans-serif; border-bottom: 3px solid black;">
            <div style="flex: 0 0 80px; margin-right: 15px; display: flex; align-items: center; justify-content: center; height: 80px;">
              ${dataDesa.logo_desa_path ? `<img src="${dataDesa.logo_desa_path}" alt="Logo Desa" style="max-width: 70px; max-height: 70px; object-fit: contain;">` : '<div style="width: 70px; height: 70px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #777;">Logo</div>'}
            </div>
            <div style="flex-grow: 1; text-align: center;">
              <div style="font-weight: bold; margin: 0; line-height: 1.2; font-size: 14pt;">PEMERINTAH KABUPATEN ${dataDesa.nama_kabupaten_kota?.toUpperCase() || ''}</div>
              <div style="font-weight: bold; margin: 0; line-height: 1.2; font-size: 16pt;">KECAMATAN ${dataDesa.nama_kecamatan?.toUpperCase() || ''}</div>
              <div style="font-weight: bold; margin: 0; line-height: 1.2; font-size: 18pt; margin-bottom: 2px;">PEMERINTAH DESA ${dataDesa.nama_desa?.toUpperCase() || ''}</div>
              <div style="font-size: 9pt; margin-top: 2px; line-height: 1.1;">${dataDesa.alamat_kantor_desa || ''}</div>
              <div style="font-size: 9pt; margin-top: 2px; line-height: 1.1;">
                ${dataDesa.nomor_telepon_kantor_desa ? `<span>Telp: ${dataDesa.nomor_telepon_kantor_desa}</span>` : ''}
                ${dataDesa.email_desa ? `<span style="margin-left: 10px;">Email: ${dataDesa.email_desa}</span>` : ''}
              </div>
            </div>
          </div>
        `;
    }

    const fullHtmlContentForDoc = `
        <div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; margin: 0.5in;">
            ${kopSuratForDoc}
            ${htmlToDownload}
        </div>
    `;
    const fileNameNomorSuratPart = formData.nomor_surat.replace(/[\/\s]/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
    downloadDoc(fullHtmlContentForDoc, `Surat_${selectedLetterType}_${fileNameNomorSuratPart || 'generated'}.doc`);
  };
  
  const renderDetailKeperluanFields = () => {
    if (selectedLetterType !== 'keterangan') return null;
    const klasifikasiKode = (formData as SuratKeteranganFormData).klasifikasi_surat_kode;
    const detailData = (formData as SuratKeteranganFormData).detail_keperluan_data || {};

    let specificFields: React.ReactNode = null;

    if (klasifikasiKode === "511/01") { // SKU
      specificFields = (
        <>
          <div className="md:col-span-2">
            <label htmlFor="detail_nama_usaha" className="block text-sm font-medium text-gray-700">Nama Usaha <span className="text-red-500">*</span></label>
            <input type="text" name="detail_nama_usaha" id="detail_nama_usaha" value={detailData.nama_usaha || ''} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
          </div>
          <div>
            <label htmlFor="detail_jenis_usaha" className="block text-sm font-medium text-gray-700">Jenis Usaha <span className="text-red-500">*</span></label>
            <input type="text" name="detail_jenis_usaha" id="detail_jenis_usaha" value={detailData.jenis_usaha || ''} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
          </div>
          <div>
            <label htmlFor="detail_dimulai_sejak" className="block text-sm font-medium text-gray-700">Usaha Dimulai Sejak (Tahun/Tanggal) <span className="text-red-500">*</span></label>
            <input type="text" name="detail_dimulai_sejak" id="detail_dimulai_sejak" value={detailData.dimulai_sejak || ''} onChange={handleChange} required className="mt-1 block w-full input-text-field" placeholder="Contoh: 2020 atau 2020-01-15" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="detail_alamat_usaha" className="block text-sm font-medium text-gray-700">Alamat Usaha <span className="text-red-500">*</span></label>
            <textarea name="detail_alamat_usaha" id="detail_alamat_usaha" value={detailData.alamat_usaha || ''} onChange={handleChange} rows={2} required className="mt-1 block w-full input-textarea-field"></textarea>
          </div>
        </>
      );
    } else if (klasifikasiKode === "470/01") { // Domisili
      specificFields = (
        <div>
          <label htmlFor="detail_sejak_tanggal_domisili" className="block text-sm font-medium text-gray-700">Telah Berdomisili Sejak Tanggal</label>
          <input type="date" name="detail_sejak_tanggal_domisili" id="detail_sejak_tanggal_domisili" value={detailData.sejak_tanggal_domisili || ''} onChange={handleChange} className="mt-1 block w-full input-text-field" />
        </div>
      );
    } else if (klasifikasiKode === "430/02") { // Kehilangan
        specificFields = (
            <>
                <div className="md:col-span-2">
                    <label htmlFor="detail_barang_hilang" className="block text-sm font-medium text-gray-700">Barang yang Hilang <span className="text-red-500">*</span> (Pisahkan per baris jika lebih dari satu)</label>
                    <textarea name="detail_barang_hilang" id="detail_barang_hilang" value={detailData.barang_hilang || ''} onChange={handleChange} rows={3} required className="mt-1 block w-full input-textarea-field"></textarea>
                </div>
                <div>
                    <label htmlFor="detail_lokasi_perkiraan_hilang" className="block text-sm font-medium text-gray-700">Perkiraan Lokasi Kehilangan</label>
                    <input type="text" name="detail_lokasi_perkiraan_hilang" id="detail_lokasi_perkiraan_hilang" value={detailData.lokasi_perkiraan_hilang || ''} onChange={handleChange} className="mt-1 block w-full input-text-field" />
                </div>
                <div>
                    <label htmlFor="detail_waktu_perkiraan_hilang" className="block text-sm font-medium text-gray-700">Perkiraan Waktu Kehilangan</label>
                    <input type="text" name="detail_waktu_perkiraan_hilang" id="detail_waktu_perkiraan_hilang" value={detailData.waktu_perkiraan_hilang || ''} onChange={handleChange} className="mt-1 block w-full input-text-field" placeholder="Contoh: Sekitar pukul 10:00 tanggal 15 Jan 2023"/>
                </div>
            </>
        );
    } else if (klasifikasiKode === "472/01") { // Pengantar Nikah
        specificFields = (
            <>
                <div className="md:col-span-2 pt-2 border-t mt-2">
                    <h5 className="text-sm font-semibold text-gray-600 mb-1">Data Calon Pasangan</h5>
                </div>
                <div>
                    <label htmlFor="detail_nama_calon_pasangan" className="block text-sm font-medium text-gray-700">Nama Calon Pasangan <span className="text-red-500">*</span></label>
                    <input type="text" name="detail_nama_calon_pasangan" id="detail_nama_calon_pasangan" value={detailData.nama_calon_pasangan || ''} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
                </div>
                <div>
                    <label htmlFor="detail_nik_calon_pasangan" className="block text-sm font-medium text-gray-700">NIK Calon Pasangan</label>
                    <input type="text" name="detail_nik_calon_pasangan" id="detail_nik_calon_pasangan" value={detailData.nik_calon_pasangan || ''} onChange={handleChange} className="mt-1 block w-full input-text-field" pattern="\d{16}" title="NIK harus 16 digit"/>
                </div>
                <div>
                    <label htmlFor="detail_tempat_lahir_calon_pasangan" className="block text-sm font-medium text-gray-700">Tempat Lahir Calon</label>
                    <input type="text" name="detail_tempat_lahir_calon_pasangan" id="detail_tempat_lahir_calon_pasangan" value={detailData.tempat_lahir_calon_pasangan || ''} onChange={handleChange} className="mt-1 block w-full input-text-field" />
                </div>
                 <div>
                    <label htmlFor="detail_tanggal_lahir_calon_pasangan" className="block text-sm font-medium text-gray-700">Tanggal Lahir Calon</label>
                    <input type="date" name="detail_tanggal_lahir_calon_pasangan" id="detail_tanggal_lahir_calon_pasangan" value={detailData.tanggal_lahir_calon_pasangan || ''} onChange={handleChange} className="mt-1 block w-full input-text-field" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="detail_alamat_calon_pasangan" className="block text-sm font-medium text-gray-700">Alamat Calon Pasangan</label>
                    <textarea name="detail_alamat_calon_pasangan" id="detail_alamat_calon_pasangan" value={detailData.alamat_calon_pasangan || ''} onChange={handleChange} rows={2} className="mt-1 block w-full input-textarea-field"></textarea>
                </div>
                 <div>
                    <label htmlFor="detail_jenis_kelamin_calon_pasangan" className="block text-sm font-medium text-gray-700">Jenis Kelamin Calon</label>
                    <select name="detail_jenis_kelamin_calon_pasangan" id="detail_jenis_kelamin_calon_pasangan" value={detailData.jenis_kelamin_calon_pasangan || 'Perempuan'} onChange={handleChange} className="mt-1 block w-full input-select-field">
                        {jenisKelaminOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </>
        );
    }


    return specificFields ? (
        <div className="md:col-span-2 pt-4 border-t">
            <h4 className="text-md font-medium text-gray-600 mb-3">Detail Tambahan Sesuai Jenis Surat</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {specificFields}
            </div>
        </div>
    ) : null;
  };

  const renderFormFields = () => {
    const commonFieldsPart1 = (
        <>
            {selectedLetterType === 'keterangan' && (
                <>
                    <div>
                        <label htmlFor="klasifikasi_surat_kode" className="block text-sm font-medium text-gray-700">Jenis Surat Keterangan <span className="text-red-500">*</span></label>
                        <select 
                            name="klasifikasi_surat_kode" 
                            id="klasifikasi_surat_kode" 
                            value={(formData as SuratKeteranganFormData).klasifikasi_surat_kode} 
                            onChange={handleChange} 
                            required 
                            className="mt-1 block w-full input-select-field"
                        >
                            {KLASIFIKASI_SURAT_KETERANGAN_OPTIONS.map(opt => (
                                <option key={opt.kode} value={opt.kode}>{opt.label} ({opt.kode})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="nomor_urut_input" className="block text-sm font-medium text-gray-700">Nomor Urut Surat Ini <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="nomor_urut_input" 
                            id="nomor_urut_input" 
                            value={(formData as SuratKeteranganFormData).nomor_urut_input} 
                            onChange={handleChange} 
                            required 
                            className="mt-1 block w-full input-text-field"
                            placeholder="Contoh: 001, 123" 
                        />
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Nomor Surat (Otomatis)</label>
                        <input type="text" value={formData.nomor_surat} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
                    </div>
                </>
            )}
            {selectedLetterType !== 'keterangan' && (
                 <div>
                    <label htmlFor="nomor_surat" className="block text-sm font-medium text-gray-700">Nomor Surat <span className="text-red-500">*</span></label>
                    <input type="text" name="nomor_surat" id="nomor_surat" value={formData.nomor_surat} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
                </div>
            )}
            {selectedLetterType !== 'keterangan' && (
              <>
                <div>
                    <label htmlFor="lampiran" className="block text-sm font-medium text-gray-700">Lampiran</label>
                    <input type="text" name="lampiran" id="lampiran" value={(formData as SuratUndanganFormData | SuratPemberitahuanFormData).lampiran || ''} onChange={handleChange} className="mt-1 block w-full input-text-field" placeholder="Contoh: 1 Berkas"/>
                </div>
                <div>
                    <label htmlFor="perihal" className="block text-sm font-medium text-gray-700">Perihal <span className="text-red-500">*</span></label>
                    <input type="text" name="perihal" id="perihal" value={(formData as SuratUndanganFormData | SuratPemberitahuanFormData).perihal} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
                </div>
              </>
            )}
            <div>
                <label htmlFor="tanggal_surat" className="block text-sm font-medium text-gray-700">Tanggal Surat <span className="text-red-500">*</span></label>
                <input type="date" name="tanggal_surat" id="tanggal_surat" value={formData.tanggal_surat} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
            </div>
        </>
    );
    const commonFieldsPart2UndanganPemberitahuan = (
        <>
            <div className="md:col-span-2">
                <label htmlFor="kepada_yth" className="block text-sm font-medium text-gray-700">Kepada Yth. <span className="text-red-500">*</span> (Pisahkan baris dengan Enter)</label>
                <textarea name="kepada_yth" id="kepada_yth" value={(formData as SuratUndanganFormData | SuratPemberitahuanFormData).kepada_yth} onChange={handleChange} rows={3} required className="mt-1 block w-full input-textarea-field" placeholder="Contoh:&#10;Bapak Camat Sukamaju&#10;Ketua BPD Desa Sejahtera"></textarea>
            </div>
             <div>
                <label htmlFor="di_tempat" className="block text-sm font-medium text-gray-700">Di <span className="text-red-500">*</span></label>
                <input type="text" name="di_tempat" id="di_tempat" value={(formData as SuratUndanganFormData | SuratPemberitahuanFormData).di_tempat} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="isi_pembuka" className="block text-sm font-medium text-gray-700">Isi Pembuka Surat <span className="text-red-500">*</span> (Pisahkan baris dengan Enter)</label>
                <textarea name="isi_pembuka" id="isi_pembuka" value={(formData as any).isi_pembuka} onChange={handleChange} rows={3} required className="mt-1 block w-full input-textarea-field"></textarea>
            </div>
        </>
    );

    const commonFieldsPart3Penandatangan = (
        <>
            <div className="md:col-span-2 pt-4 border-t">
                 <h4 className="text-md font-medium text-gray-600 mb-2">Penandatangan Surat</h4>
            </div>
            <div>
                <label htmlFor="nama_penandatangan" className="block text-sm font-medium text-gray-700">Nama Penandatangan <span className="text-red-500">*</span></label>
                <input type="text" name="nama_penandatangan" id="nama_penandatangan" value={formData.nama_penandatangan || ''} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
            </div>
            <div>
                <label htmlFor="jabatan_penandatangan" className="block text-sm font-medium text-gray-700">Jabatan Penandatangan <span className="text-red-500">*</span></label>
                <input type="text" name="jabatan_penandatangan" id="jabatan_penandatangan" value={formData.jabatan_penandatangan || ''} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
            </div>
            {selectedLetterType !== 'keterangan' && (
                <div className="md:col-span-2">
                    <label htmlFor="nama_tembusan" className="block text-sm font-medium text-gray-700">Tembusan (Pisahkan baris dengan Enter)</label>
                    <textarea name="nama_tembusan" id="nama_tembusan" value={(formData as SuratUndanganFormData | SuratPemberitahuanFormData).nama_tembusan || ''} onChange={handleChange} rows={3} className="mt-1 block w-full input-textarea-field" placeholder="Contoh:&#10;1. Arsip&#10;2. Yth. Bapak Camat (sebagai laporan)"></textarea>
                </div>
            )}
        </>
    );

    if (selectedLetterType === 'undangan') {
      const fd = formData as SuratUndanganFormData;
      return (
        <>
          {commonFieldsPart1}
          {commonFieldsPart2UndanganPemberitahuan}
          <div className="md:col-span-2 pt-4 border-t">
             <h4 className="text-md font-medium text-gray-600 mb-2">Detail Acara Undangan</h4>
          </div>
          <div>
            <label htmlFor="isi_acara" className="block text-sm font-medium text-gray-700">Acara <span className="text-red-500">*</span></label>
            <input type="text" name="isi_acara" id="isi_acara" value={fd.isi_acara} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
          </div>
          <div>
            <label htmlFor="isi_tanggal_acara" className="block text-sm font-medium text-gray-700">Tanggal Acara <span className="text-red-500">*</span></label>
            <input type="date" name="isi_tanggal_acara" id="isi_tanggal_acara" value={fd.isi_tanggal_acara} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
          </div>
          <div>
            <label htmlFor="isi_waktu_acara" className="block text-sm font-medium text-gray-700">Waktu Acara <span className="text-red-500">*</span></label>
            <input type="text" name="isi_waktu_acara" id="isi_waktu_acara" value={fd.isi_waktu_acara} onChange={handleChange} required className="mt-1 block w-full input-text-field" placeholder="Contoh: 09:00 WIB - Selesai"/>
          </div>
          <div>
            <label htmlFor="isi_tempat_acara" className="block text-sm font-medium text-gray-700">Tempat Acara <span className="text-red-500">*</span></label>
            <input type="text" name="isi_tempat_acara" id="isi_tempat_acara" value={fd.isi_tempat_acara} onChange={handleChange} required className="mt-1 block w-full input-text-field" placeholder="Contoh: Balai Desa Sejahtera"/>
          </div>
           <div className="md:col-span-2">
                <label htmlFor="isi_penutup" className="block text-sm font-medium text-gray-700">Isi Penutup Surat <span className="text-red-500">*</span> (Pisahkan baris dengan Enter)</label>
                <textarea name="isi_penutup" id="isi_penutup" value={(formData as any).isi_penutup} onChange={handleChange} rows={3} required className="mt-1 block w-full input-textarea-field"></textarea>
            </div>
          {commonFieldsPart3Penandatangan}
        </>
      );
    } else if (selectedLetterType === 'pemberitahuan') {
      const fd = formData as SuratPemberitahuanFormData;
      return (
        <>
          {commonFieldsPart1}
          {commonFieldsPart2UndanganPemberitahuan}
          <div className="md:col-span-2">
            <label htmlFor="isi_pemberitahuan" className="block text-sm font-medium text-gray-700">Isi Pemberitahuan <span className="text-red-500">*</span> (Pisahkan baris dengan Enter)</label>
            <textarea name="isi_pemberitahuan" id="isi_pemberitahuan" value={fd.isi_pemberitahuan} onChange={handleChange} rows={5} required className="mt-1 block w-full input-textarea-field"></textarea>
          </div>
           <div className="md:col-span-2">
                <label htmlFor="isi_penutup" className="block text-sm font-medium text-gray-700">Isi Penutup Surat <span className="text-red-500">*</span> (Pisahkan baris dengan Enter)</label>
                <textarea name="isi_penutup" id="isi_penutup" value={(formData as any).isi_penutup} onChange={handleChange} rows={3} required className="mt-1 block w-full input-textarea-field"></textarea>
            </div>
          {commonFieldsPart3Penandatangan}
        </>
      );
    } else if (selectedLetterType === 'keterangan') {
        const fd = formData as SuratKeteranganFormData;
        return (
            <>
                {commonFieldsPart1}
                <div className="md:col-span-2 pt-4 border-t">
                    <h4 className="text-md font-medium text-gray-600 mb-2">Data Pemohon</h4>
                </div>
                
                <div className="md:col-span-2">
                    <label htmlFor="nik_search" className="block text-sm font-medium text-gray-700">Cari NIK Pemohon di Buku Induk Penduduk</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            name="nik_search"
                            id="nik_search"
                            value={nikToSearch}
                            onChange={(e) => setNikToSearch(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            placeholder="Masukkan NIK 16 digit"
                        />
                        <button
                            type="button"
                            onClick={handleNikSearch}
                            className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-r-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                        >
                            Cari
                        </button>
                    </div>
                </div>


                <div>
                    <label htmlFor="nama_pemohon" className="block text-sm font-medium text-gray-700">Nama Pemohon <span className="text-red-500">*</span></label>
                    <input type="text" name="nama_pemohon" id="nama_pemohon" value={fd.nama_pemohon} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
                </div>
                <div>
                    <label htmlFor="nik_pemohon" className="block text-sm font-medium text-gray-700">NIK Pemohon <span className="text-red-500">*</span></label>
                    <input type="text" name="nik_pemohon" id="nik_pemohon" value={fd.nik_pemohon} onChange={handleChange} required pattern="\d{16}" title="NIK harus 16 digit angka" className="mt-1 block w-full input-text-field" />
                </div>
                <div>
                    <label htmlFor="tempat_lahir_pemohon" className="block text-sm font-medium text-gray-700">Tempat Lahir <span className="text-red-500">*</span></label>
                    <input type="text" name="tempat_lahir_pemohon" id="tempat_lahir_pemohon" value={fd.tempat_lahir_pemohon} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
                </div>
                <div>
                    <label htmlFor="tanggal_lahir_pemohon" className="block text-sm font-medium text-gray-700">Tanggal Lahir <span className="text-red-500">*</span></label>
                    <input type="date" name="tanggal_lahir_pemohon" id="tanggal_lahir_pemohon" value={fd.tanggal_lahir_pemohon} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
                </div>
                <div>
                    <label htmlFor="jenis_kelamin_pemohon" className="block text-sm font-medium text-gray-700">Jenis Kelamin <span className="text-red-500">*</span></label>
                    <select name="jenis_kelamin_pemohon" id="jenis_kelamin_pemohon" value={fd.jenis_kelamin_pemohon} onChange={handleChange} required className="mt-1 block w-full input-select-field">
                        {jenisKelaminOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="agama_pemohon" className="block text-sm font-medium text-gray-700">Agama <span className="text-red-500">*</span></label>
                     <select name="agama_pemohon" id="agama_pemohon" value={fd.agama_pemohon} onChange={handleChange} required className="mt-1 block w-full input-select-field">
                        {agamaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="status_perkawinan_pemohon" className="block text-sm font-medium text-gray-700">Status Perkawinan <span className="text-red-500">*</span></label>
                     <select name="status_perkawinan_pemohon" id="status_perkawinan_pemohon" value={fd.status_perkawinan_pemohon} onChange={handleChange} required className="mt-1 block w-full input-select-field">
                        {statusPerkawinanOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="pekerjaan_pemohon" className="block text-sm font-medium text-gray-700">Pekerjaan <span className="text-red-500">*</span></label>
                    <input type="text" name="pekerjaan_pemohon" id="pekerjaan_pemohon" value={fd.pekerjaan_pemohon} onChange={handleChange} required className="mt-1 block w-full input-text-field" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="alamat_pemohon" className="block text-sm font-medium text-gray-700">Alamat Pemohon (Lengkap) <span className="text-red-500">*</span></label>
                    <textarea name="alamat_pemohon" id="alamat_pemohon" value={fd.alamat_pemohon} onChange={handleChange} rows={3} required className="mt-1 block w-full input-textarea-field" placeholder="Contoh: Kp. Sejahtera RT 001/RW 001, Dusun Damai, Desa Maju Jaya, Kecamatan Sentosa, Kabupaten Bahagia"></textarea>
                </div>
                
                {/* Dynamic detail fields based on klasifikasi */}
                {renderDetailKeperluanFields()}

                <div className="md:col-span-2 pt-4 border-t">
                     <h4 className="text-md font-medium text-gray-600 mb-2">Tujuan/Isi Pokok Keterangan (Narasi)</h4>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="keperluan" className="block text-sm font-medium text-gray-700">
                        Narasi untuk menjelaskan tujuan/isi surat keterangan <span className="text-red-500">*</span>
                    </label>
                    <textarea name="keperluan" id="keperluan" value={fd.keperluan} onChange={handleChange} rows={3} required className="mt-1 block w-full input-textarea-field" placeholder="Contoh: Sebagai lampiran untuk pengajuan beasiswa Program Indonesia Pintar. Bahwa yang bersangkutan berkelakuan baik dan belum pernah tersangkut perkara pidana."></textarea>
                    <p className="mt-1 text-xs text-gray-500">Jelaskan secara detail mengenai keterangan yang diberikan tentang pemohon.</p>
                </div>
                {commonFieldsPart3Penandatangan}
            </>
        );
    }
    return null;
  };

   if (!dataDesa) {
    return (
      <div className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Pembuat Surat Desa</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <p className="text-yellow-700">
            <strong>Data Umum Desa belum terisi.</strong> Fitur Pembuat Surat memerlukan Data Umum Desa (terutama Nama Desa, Kode Desa, Kepala Desa, dll.) untuk otomatisasi kop surat dan penomoran.
            Silakan lengkapi Data Umum Desa terlebih dahulu melalui menu Administrasi Umum &gt; Data Umum Desa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <style>{`
        .input-text-field, .input-select-field, .input-textarea-field {
            padding: 0.5rem 0.75rem;
            background-color: white;
            border: 1px solid #d1d5db; /* gray-300 */
            border-radius: 0.375rem; /* rounded-md */
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
            font-size: 0.875rem; /* sm:text-sm */
            color: #111827; /* gray-900 */
        }
        .input-text-field:focus, .input-select-field:focus, .input-textarea-field:focus {
            outline: 2px solid transparent;
            outline-offset: 2px;
            box-shadow: 0 0 0 2px #38bdf8; /* focus:ring-sky-500 */
            border-color: #0ea5e9; /* focus:border-sky-500 */
        }
      `}</style>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Pembuat Surat Desa</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jenis Surat:</label>
        <div className="flex space-x-3 flex-wrap gap-y-2">
          <button
            onClick={() => handleTypeChange('undangan')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500
                        ${selectedLetterType === 'undangan' ? 'bg-sky-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            aria-pressed={selectedLetterType === 'undangan'}
          >
            Surat Undangan
          </button>
          <button
            onClick={() => handleTypeChange('pemberitahuan')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500
                        ${selectedLetterType === 'pemberitahuan' ? 'bg-sky-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            aria-pressed={selectedLetterType === 'pemberitahuan'}
          >
            Surat Pemberitahuan
          </button>
           <button
            onClick={() => handleTypeChange('keterangan')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500
                        ${selectedLetterType === 'keterangan' ? 'bg-sky-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            aria-pressed={selectedLetterType === 'keterangan'}
          >
            Surat Keterangan
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-gray-700 mb-5 pb-3 border-b border-gray-300">
          Isi Detail Surat {selectedLetterType === 'undangan' ? 'Undangan' : selectedLetterType === 'pemberitahuan' ? 'Pemberitahuan' : 'Keterangan'}
        </h3>
        <form className="space-y-5 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-5 md:space-y-0" onSubmit={(e) => e.preventDefault()}>
          {renderFormFields()}
        </form>
      </div>

      <div className="flex flex-wrap gap-3 pt-5 border-t border-gray-200 mt-6 justify-end">
        <button
          onClick={handlePreview}
          className="px-5 py-2.5 text-sm font-medium bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Preview Surat
        </button>
        <button
          onClick={handlePrint}
          disabled={!formData || !formData.nomor_surat}
          className="px-5 py-2.5 text-sm font-medium bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cetak Surat
        </button>
        <button
          onClick={handleDownload}
          disabled={!formData || !formData.nomor_surat}
          className="px-5 py-2.5 text-sm font-medium bg-purple-500 text-white rounded-md shadow-sm hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Download (.doc)
        </button>
      </div>

      {previewHtml && (
        <div className="mt-8 border border-gray-300 rounded-lg p-4 sm:p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-200">Pratinjau Surat</h3>
          <div className="overflow-x-auto">
            <div
              className="surat-preview-content border border-dashed border-gray-400 p-6 min-h-[700px] w-[210mm] max-w-full mx-auto bg-white shadow-lg"
              style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "12pt", lineHeight: "1.5" }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
