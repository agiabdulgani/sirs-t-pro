'use client';

import React from 'react';
import { 
  Activity, 
  ArrowUpRight, 
  Bell, 
  Calendar, 
  ChevronDown, 
  ClipboardList, 
  Database, 
  Pill, 
  Search, 
  Settings, 
  ShieldCheck, 
  Stethoscope, 
  TrendingUp, 
  UserPlus, 
  Users, 
  Zap 
} from 'lucide-react';

export default function DashboardSIRST() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              SIRS-T Pro
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari pasien atau rekam medis..." 
                className="pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 transition-all w-64"
              />
            </div>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sistem Informasi Rumah Sakit</h1>
            <p className="text-slate-500 text-sm mt-1">
              Selamat datang di portal utama SIRS-T Pro.
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm">
            <UserPlus className="w-4 h-4" />
            Tambah Pasien Baru
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pasien</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">1,248</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% dari bulan lalu
              </p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Kunjungan Hari Ini</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">42</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +5 dibanding kemarin
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resep Obat</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">189</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Aktif minggu ini
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Pill className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status Server</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">PostgreSQL</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Terhubung & Stabil
              </p>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Patients Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Daftar Pasien Terbaru</h2>
              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Lihat Semua <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Nama Pasien</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Diagnosa</th>
                    <th className="px-6 py-3">Terakhir Periksa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">Ahmad Fauzi</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Selesai
                      </span>
                    </td>
                    <td className="px-6 py-4">Hipertensi</td>
                    <td className="px-6 py-4 text-slate-400">Hari ini, 10:15</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">Siti Rahma</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Dalam Perawatan
                      </span>
                    </td>
                    <td className="px-6 py-4">Diabetes Melitus</td>
                    <td className="px-6 py-4 text-slate-400">Hari ini, 09:30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-700 transition-all text-sm font-medium group">
                  <span className="flex items-center gap-3">
                    <ClipboardList className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    Buat Rekam Medis
                  </span>
                  <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400 group-hover:text-indigo-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-700 transition-all text-sm font-medium group">
                  <span className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    Atur Jadwal Konsultasi
                  </span>
                  <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400 group-hover:text-indigo-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-700 transition-all text-sm font-medium group">
                  <span className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    Input Resep Obat
                  </span>
                  <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400 group-hover:text-indigo-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}