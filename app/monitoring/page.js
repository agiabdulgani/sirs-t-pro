'use client';
import React, { useState, useEffect } from 'react';
import { 
  Activity, Database, Server, RefreshCw, 
  CheckCircle2, AlertTriangle, ArrowLeft, 
  Globe, ShieldCheck, Zap, HardDrive,
  UserPlus, ClipboardList, Settings
} from 'lucide-react';
import Link from 'next/link';

export default function MonitoringFDW() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [nodes, setNodes] = useState([
    { name: 'Node Lokal', status: 'Checking...', ip_host: 'localhost', port: '5434' },
    { name: 'Pusat (Cloud)', status: 'Checking...', ip_host: 'db_sirst_secondary', port: '5435' }
  ]);
  const [latency, setLatency] = useState('0ms');
  const [lastSync, setLastSync] = useState('Belum dicek');

  // Mengambil data live dari API route Next.js
  const fetchStatus = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/status-node');
      const data = await res.json();
      
      if (data.nodes) {
        setNodes([
          { 
            name: 'Node Utama (Cipasung)', 
            status: data.nodes[0].status, 
            ip_host: data.nodes[0].ip_host, 
            port: data.nodes[0].port 
          },
          { 
            name: 'Node Sekunder (SIRS Cloud)', 
            status: data.nodes[1].status, 
            ip_host: data.nodes[1].ip_host, 
            port: data.nodes[1].port 
          }
        ]);
      }
      setLatency(data.latency || '12ms');
      setLastSync(data.lastChecked || new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Gagal mengambil status jaringan:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Auto-refresh tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  const handleSync = () => {
    fetchStatus();
  };

  // Cek validasi status koneksi FDW
  const isSystemNormal = nodes[1].status.includes('Connected');

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900">
      
      {/* SIDEBAR - DISINKRONKAN DENGAN DASHBOARD UTAMA */}
      <aside className="w-72 bg-[#042F1A] text-white hidden lg:flex flex-col h-screen sticky top-0 shadow-2xl">
        <div className="p-8 text-2xl font-black border-b border-white/5 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl">
            <Database size={24} className="text-emerald-950" />
          </div>
          <span>SIRS-T <span className="text-emerald-500 font-light">PRO</span></span>
        </div>
        
        <div className="px-6 pt-6">
          <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-4">Sistem Navigasi</p>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          <MenuLink href="/" icon={<Activity size={20} />} label="Overview" />
          <MenuLink href="/pasien" icon={<HardDrive size={20} />} label="Manajemen Pasien" />
          <MenuLink href="/registrasi" icon={<UserPlus size={20} />} label="Unit Registrasi" />
          <MenuLink href="/rekam_medis" icon={<ClipboardList size={20} />} label="Data Klinis" />
          <MenuLink href="/monitoring" icon={<Settings size={20} />} label="Konfigurasi" active />
        </nav>

        {/* PROFILE CARD BAWAH */}
        <div className="p-6 border-t border-white/5 bg-[#021F11]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-lg shadow-inner">
              AG
            </div>
            <div>
              <p className="font-black text-sm tracking-wide">AGI ABDUL GANI</p>
              <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Super Administrator</p>
            </div>
          </div>
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black tracking-widest transition-all border border-white/5">
            KELUAR SESI
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-4 mb-2">
               <Link href="/" className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-all text-slate-400">
                 <ArrowLeft size={18} />
               </Link>
               <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">System Monitoring</h1>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] ml-12">PostgreSQL Foreign Data Wrapper (FDW) Health</p>
          </div>

          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center gap-3 px-6 py-3 rounded-[20px] font-black text-xs tracking-widest transition-all active:scale-95 shadow-xl ${isSyncing ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'}`}
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'SINKRONISASI...' : 'RE-SYNC DATABASE'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* STATUS KONEKSI UTAMA */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-200/60 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 -mr-8 -mt-8 rotate-12">
                 <Globe size={200} />
               </div>
               
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                 <Server size={18} className="text-emerald-500" /> Connection Pipeline
               </h3>

               <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
                  {/* Local DB */}
                  <div className="text-center space-y-4 z-10 w-full md:w-auto">
                    <div className={`w-24 h-24 bg-slate-50 border-4 border-white shadow-xl rounded-[32px] flex items-center justify-center mx-auto transition-all ${nodes[0].status.includes('Connected') ? 'text-emerald-600' : 'text-red-500'}`}>
                      <Database size={40} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-xs tracking-tight">{nodes[0].name}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${nodes[0].status.includes('Connected') ? 'text-emerald-500' : 'text-red-500'}`}>
                        {nodes[0].status}
                      </p>
                    </div>
                  </div>

                  {/* Bridge Line */}
                  <div className="flex-1 h-[2px] relative hidden md:block transition-all bg-slate-200">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                        <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${isSystemNormal ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          FDW Protocol
                        </div>
                     </div>
                     <div className={`absolute inset-0 h-[2px] w-full transition-all duration-500 ${isSystemNormal ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                  </div>

                  {/* Remote DB */}
                  <div className="text-center space-y-4 z-10 w-full md:w-auto">
                    <div className={`w-24 h-24 border-4 border-white shadow-xl rounded-[32px] flex items-center justify-center mx-auto transition-all ${isSystemNormal ? 'bg-emerald-950 text-emerald-400' : 'bg-red-100 text-red-500'}`}>
                      <Globe size={40} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-xs tracking-tight">{nodes[1].name}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isSystemNormal ? 'text-emerald-400' : 'text-red-500'}`}>
                        {nodes[1].status}
                      </p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard title="Latensi Jaringan" value={latency} status="Real-Time" icon={<Zap className="text-amber-500" />} />
              <StatCard title="Update Terakhir" value={lastSync} status="Live Checked" icon={<ShieldCheck className="text-emerald-500" />} />
            </div>
          </div>

          {/* SIDE LOGS */}
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-200/60">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Activity Logs</h3>
              <div className="space-y-6">
                <LogItem time={lastSync.substring(0, 5)} msg={isSystemNormal ? "Query FDW Pasien Berhasil" : "Koneksi Jalur FDW Terputus"} status={isSystemNormal ? "success" : "danger"} />
                <LogItem time="14:45" msg="Sinkronisasi User Selesai" status="success" />
                <LogItem time="12:10" msg="Handshake with Master Server" status="success" />
              </div>
            </div>

            <div className={`rounded-[40px] p-8 text-white shadow-xl transition-all relative overflow-hidden ${isSystemNormal ? 'bg-emerald-600 shadow-emerald-200' : 'bg-red-600 shadow-red-200'}`}>
               <div className="relative z-10">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Status Terakhir</p>
                 <p className="text-xl font-black uppercase">{isSystemNormal ? 'Sistem Normal' : 'Ada Node Terputus'}</p>
                 <p className="text-[10px] font-medium mt-4 opacity-80 leading-relaxed">
                   {isSystemNormal 
                     ? 'Semua node terhubung. Data ditarik secara real-time dari database pusat.' 
                     : 'Jalur FDW patah karena container sekunder mati. Harap jalankan kembali di docker terminal.'}
                 </p>
               </div>
               {isSystemNormal ? (
                 <CheckCircle2 size={80} className="absolute -bottom-4 -right-4 opacity-20 rotate-12" />
               ) : (
                 <AlertTriangle size={80} className="absolute -bottom-4 -right-4 opacity-20 rotate-12" />
               )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, status, icon }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm flex items-center gap-6">
      <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
        <p className="text-[9px] font-bold text-emerald-600 uppercase mt-1">{status}</p>
      </div>
    </div>
  );
}
