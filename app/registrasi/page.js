'use client'; 
import React, { useState } from 'react';
import { 
  ArrowLeft, Save, User, CreditCard, MapPin, 
  Phone, Database, Activity, Users, UserPlus, 
  ClipboardList, CheckCircle2, AlertCircle, Calendar, Droplets,
  Pill, Settings, Stethoscope // Ditambahkan untuk sinkronisasi sidebar
} from 'lucide-react';
import Link from 'next/link';

export default function RegistrasiPasien() {
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    hp: '',
    gender: 'Laki-laki',
    usia: '', 
    golongan_darah: 'O+', 
    alamat: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimpan = (e) => {
    e.preventDefault();
    const dataLama = JSON.parse(localStorage.getItem('data_pasien') || '[]');
    const dataBaru = [...dataLama, { ...formData, id: Date.now() }];
    localStorage.setItem('data_pasien', JSON.stringify(dataBaru));
    
    setShowSuccess(true);
    
    setFormData({ 
      nama: '', 
      nik: '', 
      hp: '', 
      gender: 'Laki-laki', 
      usia: '', 
      golongan_darah: 'O+', 
      alamat: '' 
    });
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900">
      
      {/* SIDEBAR SINKRON */}
      <aside className="w-72 bg-emerald-950 text-white hidden lg:flex flex-col shadow-2xl h-screen sticky top-0 z-50">
        <div className="p-8 text-2xl font-black border-b border-white/5 flex items-center gap-3">
          <div className="bg-emerald-50 p-2 rounded-xl">
            <Database size={24} className="text-emerald-950" />
          </div>
          <span>SIRS-T <span className="text-emerald-500 font-light">PRO</span></span>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 mt-4 overflow-y-auto">
          <p className="text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.25em] px-4 mb-4">Sistem Navigasi</p>
          
          <MenuLink href="/" icon={<Activity size={20} />} label="Overview" />
          <MenuLink href="/pasien" icon={<Users size={20} />} label="Data Pasien" />
          <MenuLink href="/registrasi" icon={<UserPlus size={20} />} label="Registrasi Baru" active />
          
          <MenuLink href="/tenaga-medis" icon={<Stethoscope size={20} />} label="Tenaga Medis" />
          
          <MenuLink href="/rekam_medis" icon={<ClipboardList size={20} />} label="Rekam Medis" />
          
          <MenuLink href="/farmasi" icon={<Pill size={20} />} label="Farmasi & Obat" />
          
          <MenuLink href="/monitoring" icon={<Settings size={20} />} label="Konfigurasi" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Area */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest hover:text-emerald-700 transition-all mb-2">
                <ArrowLeft size={16} /> Kembali
              </Link>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Registrasi Pasien</h2>
            </div>
            
            {showSuccess && (
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-3 animate-bounce">
                <CheckCircle2 size={20} />
                <span className="font-bold text-sm text-white">Data Berhasil Disimpan!</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[40px] shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="bg-emerald-900 p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Formulir Rekam Medis</h3>
                <p className="text-emerald-400 text-sm font-medium">Pastikan data NIK sesuai dengan KTP asli pasien.</p>
              </div>
              <UserPlus className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 -rotate-12" />
            </div>

            <form className="p-10 space-y-8" onSubmit={handleSimpan}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Nama */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-emerald-500" /> Nama Lengkap
                  </label>
                  <input 
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    type="text" 
                    placeholder="Masukkan nama lengkap..." 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-slate-700 placeholder:font-medium" 
                    required
                  />
                </div>

                {/* Input NIK */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard size={14} className="text-emerald-500" /> Nomor NIK
                  </label>
                  <input 
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    type="number" 
                    placeholder="16 digit nomor KTP..." 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-slate-700" 
                    required
                  />
                </div>
              </div>

              {/* Baris Baru: HP, Usia, Gender */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Input HP */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone size={14} className="text-emerald-500" /> WhatsApp
                  </label>
                  <input 
                    name="hp"
                    value={formData.hp}
                    onChange={handleChange}
                    type="tel" 
                    placeholder="08xxxxxxxxxx" 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-slate-700" 
                    required
                  />
                </div>

                {/* Input Usia */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-500" /> Usia Pasien
                  </label>
                  <input 
                    name="usia"
                    value={formData.usia}
                    onChange={handleChange}
                    type="number" 
                    placeholder="Contoh: 25" 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-slate-700" 
                    required
                  />
                </div>

                {/* Input Gender */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Kelamin</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-slate-700"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Input Golongan Darah */}
                <div className="space-y-3 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Droplets size={14} className="text-emerald-500" /> Gol. Darah
                  </label>
                  <select 
                    name="golongan_darah"
                    value={formData.golongan_darah}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-slate-700"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* Input Alamat */}
                <div className="space-y-3 md:col-span-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-500" /> Alamat Domisili
                  </label>
                  <textarea 
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Jl. Nama Jalan, No. Rumah, Kota..." 
                    rows="3" 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-slate-700"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[24px] shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 transition-all active:scale-95">
                  <Save size={20} /> SIMPAN DATA KE SISTEM
                </button>
                <Link href="/pasien" className="bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold px-8 py-5 rounded-[24px] transition-all flex items-center gap-2">
                    DAFTAR PASIEN
                </Link>
              </div>
            </form>
          </div>
          
          <div className="mt-8 flex items-center gap-3 bg-blue-50 p-6 rounded-3xl border border-blue-100">
             <AlertCircle className="text-blue-500" size={24} />
             <p className="text-xs text-blue-700 font-medium leading-relaxed">
                Data yang Anda masukkan (termasuk <strong>Usia</strong> dan <strong>Golongan Darah</strong>) akan langsung tersimpan di database lokal sistem SIRS-T dan dapat diakses melalui menu <strong>Data Pasien</strong>.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function MenuLink({ href, icon, label, active = false }) {
  return (
    <Link href={href}>
      <div className={`
        flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 cursor-pointer group active:scale-95
        ${active 
          ? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20 font-black' 
          : 'text-emerald-100/50 hover:bg-white/5 hover:text-white hover:pl-6 font-semibold'}
      `}>
        <span className={active ? 'text-emerald-950' : 'group-hover:text-emerald-400'}>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}