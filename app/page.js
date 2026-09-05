'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Activity, Calendar, UserPlus, Database, 
  ClipboardList, TrendingUp, Search, Bell, Settings,
  ArrowUpRight, MapPin, ChevronDown, Check, Zap, Heart, ShieldCheck,
  Stethoscope, 
  Pill      
} from 'lucide-react';

export default function DashboardSIRST() {
  // State untuk Dropdown Lokasi
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi');

  // State untuk menampung data live tren kunjungan dari database
  const [trendData, setTrendData] = useState([
    { hari: 'SEN', pasien: 0 }, { hari: 'SEL', pasien: 0 }, { hari: 'RAB', pasien: 0 },
    { hari: 'KAM', pasien: 0 }, { hari: 'JUM', pasien: 0 }, { hari: 'SAB', pasien: 0 }, { hari: 'MIN', pasien: 0 }
  ]);

  const locations = [
    'Semua Lokasi', 'Bali', 'Banten', 'DI Yogyakarta', 'DKI Jakarta', 'Jawa Barat'
  ];

  // Fungsi fetch data dari API tren-kunjungan
  const fetchTrendData = async () => {
    try {
      const res = await fetch('/api/tren-kunjungan');
      const json = await res.json();
      if (json.success) {
        setTrendData(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat tren grafik dari database lokal:", err);
    }
  };

  useEffect(() => {
    fetchTrendData();
    // Auto-refresh data tren setiap 10 detik agar sinkron saat ada pasien baru masuk
    const interval = setInterval(fetchTrendData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Mencari nilai tertinggi untuk menentukan puncak (Peak) skala grafik secara proporsional
  const maxPasien = Math.max(...trendData.map(d => d.pasien), 1); 

  // Algoritma pembuat string jalur (Path) kurva SVG dinamis berdasarkan data jumlah pasien
  const generateSvgPath = () => {
    const widthBetweenPoints = 95; // Jarak horizontal antar hari
    const startX = 30;
    const chartHeight = 150; // Tinggi batas dasar area grafik dalam SVG
    
    return trendData.reduce((path, item, index) => {
      const x = startX + (index * widthBetweenPoints);
      const y = chartHeight - ((item.pasien / maxPasien) * 110); 
      
      if (index === 0) return `M ${x},${y}`;
      
      const prevX = startX + ((index - 1) * widthBetweenPoints);
      const prevY = chartHeight - ((trendData[index - 1].pasien / maxPasien) * 110);
      const cpX = (prevX + x) / 2; // Titik kontrol lengkungan tengah
      
      return `${path} Q ${cpX},${prevY} ${x},${y}`;
    }, "");
  };

  const dynamicPath = generateSvgPath();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 overflow-hidden">
      
      {/* --- SIDEBAR: GLASSMORPHISM DARK SINKRON --- */}
      <aside className="w-80 bg-emerald-950 text-white flex flex-col relative z-50 overflow-hidden shrink-0">
        <div className="absolute top-0 -left-20 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full"></div>
        
        {/* Logo Area */}
        <div className="p-10 text-2xl font-black flex items-center gap-4 relative z-10">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-2.5 rounded-2xl shadow-xl shadow-emerald-500/20">
            <Database size={24} className="text-emerald-950" />
          </div>
          <span className="tracking-tighter">SIRS-T <span className="text-emerald-400 font-light">PRO</span></span>
        </div>
        
        {/* Navigasi Utama - Diselaraskan dengan penamaan halaman lain */}
        <nav className="flex-1 px-6 space-y-2 mt-2 relative z-10 overflow-y-auto">
          <p className="text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.25em] px-4 mb-4">Sistem Navigasi</p>
          
          <MenuLink href="/" icon={<Activity size={22} />} label="Overview" active />
          <MenuLink href="/pasien" icon={<Users size={22} />} label="Data Pasien" />
          <MenuLink href="/registrasi" icon={<UserPlus size={22} />} label="Registrasi Baru" />
          
          <MenuLink href="/tenaga-medis" icon={<Stethoscope size={22} />} label="Tenaga Medis" />
          
          <MenuLink href="/rekam_medis" icon={<ClipboardList size={22} />} label="Rekam Medis" />
          
          <MenuLink href="/farmasi" icon={<Pill size={22} />} label="Farmasi & Obat" />
          
          <MenuLink href="/monitoring" icon={<Settings size={22} />} label="Konfigurasi" />
        </nav>

        {/* Profil Admin Card */}
        <div className="p-8 relative z-10">
          <div className="bg-white/5 rounded-[32px] p-6 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-emerald-300 rounded-2xl flex items-center justify-center font-black text-emerald-950 text-lg shadow-lg">
                  AG
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-emerald-950 rounded-full"></div>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-white truncate leading-none mb-1 uppercase tracking-tight">Agi Abdul Gani</p>
                <p className="text-[10px] text-emerald-500/70 font-bold uppercase truncate tracking-wider">Super Administrator</p>
              </div>
            </div>
            <button className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-emerald-950 rounded-xl text-[10px] font-black transition-all border border-emerald-500/20 uppercase tracking-[0.15em]">
              Keluar Sesi
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* Top Header Floating */}
        <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-40 bg-[#F8FAFC]/80 backdrop-blur-xl gap-6">
          <div className="flex items-center gap-6 flex-1">
            
            {/* Dropdown Lokasi */}
            <div className="relative">
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all active:scale-95 min-w-[200px]"
              >
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                  <MapPin size={18} />
                </div>
                <div className="text-left pr-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Lokasi Kerja</p>
                  <p className="text-sm font-bold text-slate-700 leading-none">{selectedLocation}</p>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isLocationOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLocationOpen && (
                <div className="absolute top-full mt-3 w-64 bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                  <div className="p-4 border-b border-slate-50">
                    <div className="relative">
                      <CircleSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="text" placeholder="Cari wilayah..." className="w-full bg-slate-50 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-500/20" />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto p-2">
                    {locations.map((loc) => (
                      <div 
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationOpen(false);
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all ${selectedLocation === loc ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-600'}`}
                      >
                        <span className="text-xs font-bold">{loc}</span>
                        {selectedLocation === loc && <Check size={14} className="text-emerald-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative group w-full max-w-lg">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Cari pasien berdasarkan NIK atau Nama..." 
                className="w-full pl-14 pr-6 py-4 bg-white shadow-sm border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-medium" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <Zap size={16} className="text-orange-500 fill-orange-500" />
              <span className="text-[11px] font-black uppercase text-slate-600 tracking-tighter italic">V.22 Engine Online</span>
            </div>
            <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all relative">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-10 space-y-12 max-w-[1600px] mx-auto w-full">
          
          {/* Header Greeting & Action */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Halo, Agi <span className="text-emerald-500">.</span></h1>
              <p className="text-slate-500 mt-2 font-semibold text-lg italic">Menampilkan data real-time untuk wilayah: <span className="text-emerald-600 uppercase font-black">{selectedLocation}</span></p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-white border border-slate-200 p-5 rounded-[24px] font-black text-slate-600 hover:bg-slate-50 transition-all">
                <Calendar size={24} />
              </button>
              <Link href="/registrasi">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-[24px] font-black flex items-center gap-4 transition-all shadow-2xl shadow-emerald-200 hover:-translate-y-1 active:scale-95 group">
                  <UserPlus size={22} /> PENDAFTARAN PASIEN <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </Link>
            </div>
          </section>
          
          {/* Dashboard Intelligence Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard icon={<Users />} label="Total Pasien" val="1.422" trend="+12% bulan ini" color="emerald" />
            <StatCard icon={<Activity />} label="Bed Occupancy" val="78%" trend="14 Bed Tersedia" color="blue" />
            <StatCard icon={<Heart />} label="Kapasitas Poli" val="92%" trend="Padat" color="red" />
            <StatCard icon={<ShieldCheck />} label="Keamanan Data" val="100%" trend="Enkripsi Aktif" color="teal" />
          </section>

          {/* Analytics & Insight Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* AREA GRAFIK GARIS KUNJUNGAN REAL-TIME DARI POSTGRESQL */}
            <div className="lg:col-span-2 bg-white p-10 rounded-[48px] shadow-sm border border-slate-200/60 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-slate-900 text-2xl tracking-tight">Tren Kunjungan - {selectedLocation}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase mt-1">Laporan Mingguan Unit SIRS (Live DB)</p>
                </div>
                <select className="bg-slate-100 border-none rounded-2xl text-[10px] font-black px-4 py-3 outline-none uppercase tracking-widest text-slate-500">
                  <option>Mei - Juni 2026</option>
                </select>
              </div>
              
              {/* Tempat Perhitungan Dinamis Kurva Grafik SVG */}
              <div className="relative h-56 w-full mt-4 flex flex-col justify-between">
                <div className="absolute inset-0">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 640 160">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {dynamicPath && (
                      <>
                        <path
                          d={dynamicPath}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="4"
                          strokeLinecap="round"
                          className="transition-all duration-700 drop-shadow-[0_6px_16px_rgba(16,185,129,0.25)]"
                        />
                        <path
                          d={`${dynamicPath} L ${30 + (trendData.length - 1) * 95},150 L 30,150 Z`}
                          fill="url(#chartGrad)"
                          className="transition-all duration-700"
                        />
                      </>
                    )}
                  </svg>
                </div>

                {/* Sumbu X / Label Hari */}
                <div className="flex justify-between items-center text-xs font-black text-slate-400 mt-auto pt-4 border-t border-slate-100 relative z-10">
                  {trendData.map((item, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 relative">
                      {item.pasien === maxPasien && item.pasien > 0 && (
                        <span className="absolute -top-36 bg-slate-900 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider animate-bounce">
                          Peak ({item.pasien})
                        </span>
                      )}
                      <span className={`tracking-widest uppercase text-[11px] ${item.pasien === maxPasien && item.pasien > 0 ? 'text-emerald-600 font-black' : 'text-slate-400'}`}>
                        {item.hari}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Information / Logs */}
            <div className="space-y-8">
              <div className="bg-emerald-950 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-xl tracking-tight uppercase">Sistem Log</h3>
                    <TrendingUp className="text-emerald-400" />
                  </div>
                  <div className="space-y-6">
                    <LogItem status="INFO" msg="Update Database Relasional Selesai" time="2 Menit lalu" />
                    <LogItem status="WARN" msg="Limit Kapasitas Poli Gigi Terdeteksi" time="15 Menit lalu" />
                    <LogItem status="SUKS" msg="Sync Cloud Storage Berhasil" time="1 Jam lalu" />
                  </div>
                </div>
                
                <Link href="/monitoring">
                  <button className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all relative z-10 text-center">
                    Buka Konsol Pengembang
                  </button>
                </Link>
                
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
              </div>
            </div>
          </section>

          {/* Quick Shortcuts Section */}
          <section className="bg-white rounded-[40px] p-10 border border-slate-200">
             <h3 className="font-black text-slate-800 text-xl mb-8 uppercase tracking-widest">Akses Cepat</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <Shortcut icon={<ClipboardList />} label="Input Diagnosa" />
                <Shortcut icon={<Users />} label="Cek Kamar" />
                <Shortcut icon={<Zap />} label="Rawat Darurat" />
                <Shortcut icon={<Settings />} label="Konfigurasi" />
                <Shortcut icon={<Calendar />} label="Jadwal Dokter" />
                <Shortcut icon={<TrendingUp />} label="Ekspor Laporan" />
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Tambahan alias lokal untuk menghindari konflik ikon pencarian
const CircleSearch = Search;

// --- SUB COMPONENTS ---

function MenuLink({ href, icon, label, active = false }) {
  return (
    <Link href={href}>
      <div className={`
        flex items-center gap-4 p-5 rounded-[24px] transition-all duration-500 cursor-pointer group active:scale-95 relative
        ${active 
          ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/0 text-emerald-400 font-black' 
          : 'text-white/40 hover:text-white font-bold'}
      `}>
        {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_20px_#10b981]"></div>}
        <span className={`${active ? 'text-emerald-400' : 'group-hover:text-white'} transition-colors`}>{icon}</span>
        <span className="text-[13px] tracking-tight">{label}</span>
      </div>
    </Link>
  );
}

function StatCard({ icon, label, val, trend, color }) {
  const themes = {
    emerald: 'text-emerald-600 bg-emerald-50 ring-emerald-100 shadow-emerald-100',
    blue: 'text-blue-600 bg-blue-50 ring-blue-100 shadow-blue-100',
    red: 'text-red-600 bg-red-50 ring-red-100 shadow-red-100',
    teal: 'text-teal-600 bg-teal-50 ring-teal-100 shadow-teal-100',
  };

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200/60 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 ring-4 ${themes[color]} group-hover:rotate-12 transition-all duration-500`}>
        {React.cloneElement(icon, { size: 30 })}
      </div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">{label}</p>
      <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{val}</h3>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${themes[color]} uppercase`}>{trend}</span>
      </div>
    </div>
  );
}

function LogItem({ status, msg, time }) {
  const colors = {
    INFO: 'bg-blue-500',
    WARN: 'bg-orange-500',
    SUKS: 'bg-emerald-500'
  };
  return (
    <div className="flex gap-4 group cursor-default">
      <div className={`w-1.5 h-12 rounded-full ${colors[status]} opacity-40 group-hover:opacity-100 transition-all`}></div>
      <div>
        <p className="text-xs font-black text-white/90 group-hover:text-emerald-400 transition-colors uppercase leading-none mb-1">{msg}</p>
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{time}</p>
      </div>
    </div>
  );
}

function Shortcut({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-4 group cursor-pointer">
      <div className="w-full aspect-square bg-slate-50 border border-slate-100 rounded-[24px] flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all group-hover:-translate-y-2 shadow-sm">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <p className="text-[10px] font-black text-slate-500 group-hover:text-emerald-600 uppercase tracking-tight">{label}</p>
    </div>
  );
}