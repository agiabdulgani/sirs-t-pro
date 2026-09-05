'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Activity, Heart, Thermometer, Droplets, 
  FileText, User, Stethoscope, Save, Plus, Database, 
  Users, UserPlus, ClipboardList, Clock, Globe, MapPin,
  Printer, Download, Pill, Settings // Tambahkan icon Pill dan Settings untuk sinkronisasi menu
} from 'lucide-react';

function RekamMedisContent() {
  const searchParams = useSearchParams();
  
  // Ambil data dinamis dari URL
  const patientId = searchParams.get('id') || 'RM-TEMP';
  const namaPasien = searchParams.get('nama') || 'Pasien Baru';
  const usiaPasien = searchParams.get('usia') || '20';
  const golDarah = searchParams.get('golongan_darah') || 'O+';
  const origin = searchParams.get('origin') || 'Lokal'; // Ambil info asal data

  const [isInputMode, setIsInputMode] = useState(false);
  const [history, setHistory] = useState([]);
  
  const [vitals, setVitals] = useState({
    bpm: '78', bp: '120/80', temp: '36.5', spo2: '98%'
  });

  const [formData, setFormData] = useState({ 
    tensi: '', suhu: '', berat: '', keluhan: '', diagnosa: '' 
  });

  useEffect(() => {
    if (patientId) {
      const allRecords = JSON.parse(localStorage.getItem('rekam_medis') || '[]');
      const patientRecords = allRecords.filter(r => r.patientId === patientId);
      setHistory(patientRecords.reverse());

      if (patientRecords.length > 0) {
        const lastCheck = patientRecords[0];
        setVitals(prev => ({
          ...prev,
          bp: lastCheck.tensi || prev.bp,
          temp: lastCheck.suhu || prev.temp
        }));
      }
    }
  }, [patientId]);

  const handleSimpan = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      patientId: patientId,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      title: "Pemeriksaan Klinis",
      doctor: "Unit SIRS-T PRO",
      tensi: formData.tensi,
      suhu: formData.suhu,
      berat: formData.berat,
      note: formData.keluhan,
      diagnosa: formData.diagnosa,
      tag: "Rawat Jalan",
      color: "bg-emerald-500",
      origin: origin // Simpan asal data
    };

    const allRecords = JSON.parse(localStorage.getItem('rekam_medis') || '[]');
    localStorage.setItem('rekam_medis', JSON.stringify([...allRecords, newEntry]));

    setHistory([newEntry, ...history]);
    setVitals(prev => ({ ...prev, bp: formData.tensi, temp: formData.suhu }));
    setIsInputMode(false);
    setFormData({ tensi: '', suhu: '', berat: '', keluhan: '', diagnosa: '' });
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-emerald-950 text-white hidden lg:flex flex-col h-screen sticky top-0 z-50">
        <div className="p-8 text-2xl font-black border-b border-white/5 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl"><Database size={24} className="text-emerald-950" /></div>
          <span>SIRS-T <span className="text-emerald-500 font-light">PRO</span></span>
        </div>
        
        {/* Navigasi Sidebar yang sudah Disinkronkan */}
        <nav className="flex-1 p-6 space-y-2 mt-4 overflow-y-auto">
          <p className="text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.25em] px-4 mb-4">Sistem Navigasi</p>
          
          <MenuLink href="/" icon={<Activity size={20} />} label="Overview" />
          <MenuLink href="/pasien" icon={<Users size={20} />} label="Data Pasien" />
          <MenuLink href="/registrasi" icon={<UserPlus size={20} />} label="Registrasi Baru" />
          
          {/* Menu Baru 1: Tenaga Medis */}
          <MenuLink href="/tenaga-medis" icon={<Stethoscope size={20} />} label="Tenaga Medis" />
          
          <MenuLink href="/rekam_medis" icon={<ClipboardList size={20} />} label="Rekam Medis" active />
          
          {/* Menu Baru 2: Farmasi & Obat */}
          <MenuLink href="/farmasi" icon={<Pill size={20} />} label="Farmasi & Obat" />
          
          <MenuLink href="/monitoring" icon={<Settings size={20} />} label="Konfigurasi" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Link href="/pasien" className="p-2 hover:bg-slate-100 rounded-full transition-all">
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <h2 className="font-black text-xl text-slate-800 uppercase tracking-tight">Detail Rekam Medis</h2>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-emerald-600 transition-all shadow-sm">
                <Printer size={18} />
             </button>
            <button 
              onClick={() => setIsInputMode(!isInputMode)}
              className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg ${isInputMode ? 'bg-slate-800 text-white' : 'bg-emerald-600 text-white shadow-emerald-200'}`}
            >
              {isInputMode ? <ClipboardList size={16}/> : <Plus size={16}/>} 
              {isInputMode ? 'LIHAT RIWAYAT' : 'PERIKSA BARU'}
            </button>
          </div>
        </header>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* KOLOM KIRI: PROFIL PASIEN */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-200/60">
              <div className="bg-emerald-950 p-8 text-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-4 opacity-10"><Database size={100} /></div>
                
                <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center text-emerald-950 mb-4 border-4 border-emerald-400/30 shadow-xl mx-auto relative z-10 font-black text-4xl uppercase">
                  {namaPasien.charAt(0)}
                </div>
                <h2 className="text-xl font-black text-white uppercase mb-1 leading-tight relative z-10">{namaPasien}</h2>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${origin === 'Lokal' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                   {origin === 'Lokal' ? <MapPin size={10}/> : <Globe size={10}/>} {origin}
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest border-b border-slate-50 pb-3">
                   <span className="text-slate-400">Nomor Rekam Medis</span>
                   <span className="text-slate-700">{patientId.slice(-8)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Gol. Darah</p>
                    <p className="font-black text-emerald-600 text-xl">{golDarah}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Usia</p>
                    <p className="font-black text-emerald-600 text-xl">{usiaPasien} Thn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 gap-4">
              <VitalCard icon={<Heart />} label="BPM" val={vitals.bpm} status="Normal" color="text-red-500" bg="bg-red-50" />
              <VitalCard icon={<Activity />} label="BP" val={vitals.bp} status="Optimal" color="text-blue-500" bg="bg-blue-50" />
              <VitalCard icon={<Thermometer />} label="Temp" val={vitals.temp} status="Normal" color="text-orange-500" bg="bg-orange-50" />
              <VitalCard icon={<Droplets />} label="SPO2" val={vitals.spo2} status="Normal" color="text-sky-500" bg="bg-sky-50" />
            </div>
          </div>

          {/* KOLOM KANAN: FORM ATAU RIWAYAT */}
          <div className="lg:col-span-8 space-y-8">
            {isInputMode ? (
              <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-emerald-500 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-4 mb-8 text-emerald-600">
                  <Stethoscope size={24} />
                  <h3 className="text-xl font-black uppercase tracking-tight">Input Pemeriksaan Baru</h3>
                </div>
                
                <form onSubmit={handleSimpan} className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <InputField label="Tensi (mmHg)" placeholder="120/80" onChange={(v)=>setFormData({...formData, tensi: v})} />
                    <InputField label="Suhu (°C)" placeholder="36.5" type="text" onChange={(v)=>setFormData({...formData, suhu: v})} />
                    <InputField label="Berat (Kg)" placeholder="65" type="text" onChange={(v)=>setFormData({...formData, berat: v})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Keluhan Utama</label>
                    <textarea rows="3" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-sm" placeholder="Contoh: Nyeri ulu hati, mual..." onChange={(e)=>setFormData({...formData, keluhan: e.target.value})} required></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Diagnosa Klinis</label>
                    <textarea rows="3" className="w-full p-5 bg-emerald-50/30 border border-emerald-100 rounded-[24px] focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-sm" placeholder="Hasil diagnosa dokter..." onChange={(e)=>setFormData({...formData, diagnosa: e.target.value})} required></textarea>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[24px] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95">
                    <Save size={20} /> SIMPAN KE DATABASE SIRS-T
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-200/60 min-h-[600px]">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Clock size={20}/></div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Riwayat Kunjungan</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Data Terdistribusi: Aktif</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-4 py-2 rounded-xl uppercase tracking-widest">{history.length} Sesi</span>
                </div>
                
                <div className="space-y-10 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <TimelineItem key={item.id} {...item} />
                    ))
                  ) : (
                    <div className="py-32 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-4 text-slate-200 border-2 border-dashed border-slate-200">
                        <FileText size={32} />
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-300 italic">Belum ada riwayat medis tercatat</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-Komponen
function InputField({ label, placeholder, type="text", onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
      <input 
        type={type} 
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-sm transition-all" 
        placeholder={placeholder} 
        onChange={(e) => onChange(e.target.value)} 
        required 
      />
    </div>
  );
}

function VitalCard({ icon, label, val, status, color, bg }) {
  return (
    <div className="p-6 rounded-[32px] bg-white border border-slate-200 shadow-sm flex flex-col items-center group hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
      <div className={`mb-3 p-3 ${bg} rounded-2xl transition-transform group-hover:scale-110`}>{React.cloneElement(icon, { className: color, size: 20 })}</div>
      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{label}</p>
      <p className="text-xl font-black text-slate-800">{val}</p>
      <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 uppercase tracking-tighter">{status}</span>
    </div>
  );
}

function TimelineItem({ date, time, title, doctor, note, diagnosa, tag, color, origin }) {
  return (
    <div className="relative pl-16 group animate-in slide-in-from-bottom-5 duration-500">
      <div className={`absolute left-0 top-0 w-12 h-12 ${color} rounded-[20px] border-4 border-white shadow-lg z-10 flex items-center justify-center text-white transition-transform group-hover:scale-110`}>
        <Activity size={20} />
      </div>
      <div className="bg-white border border-slate-100 p-8 rounded-[32px] transition-all group-hover:border-emerald-100 group-hover:shadow-md relative overflow-hidden">
        {/* Origin Label di tiap item */}
        <div className="absolute top-0 right-0 mt-4 mr-6">
           <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${origin === 'Lokal' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>
              {origin}
           </span>
        </div>

        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{date}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase">{time} WIB</p>
          </div>
        </div>
        <h4 className="font-black text-slate-800 text-lg mb-1 uppercase tracking-tight">{title}</h4>
        <p className="text-[9px] text-slate-400 font-bold mb-6 uppercase italic tracking-widest">PJ: {doctor}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-50">
             <h5 className="text-[9px] font-black text-slate-400 uppercase mb-2">Analisa Keluhan</h5>
             <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{note}"</p>
          </div>
          <div className="p-5 bg-emerald-50/30 rounded-2xl border border-emerald-50">
             <h5 className="text-[9px] font-black text-emerald-600 uppercase mb-2">Diagnosa Akhir</h5>
             <p className="text-xs text-slate-800 font-black leading-relaxed">{diagnosa}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuLink({ href, icon, label, active = false }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer group active:scale-95 ${active ? 'bg-emerald-500 text-emerald-950 font-black shadow-lg shadow-emerald-500/20' : 'text-emerald-100/50 hover:bg-white/5 hover:text-white hover:pl-6'}`}>
        <span>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}

export default function RekamMedisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-emerald-950 text-emerald-500 font-black tracking-widest animate-pulse">SIRS-T PRO: MEMUAT DATA...</div>}>
      <RekamMedisContent />
    </Suspense>
  );
}