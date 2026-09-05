'use client';
import React from 'react';
import Link from 'next/link';
import { Pill, ArrowLeft } from 'lucide-react';

export default function FarmasiPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans p-6 text-slate-900">
      <div className="bg-white p-10 rounded-[32px] shadow-xl border border-slate-200/60 max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
          <Pill size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Modul Farmasi & Obat</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Halaman siklus hidup obat, stok gudang farmasi lokal, dan mutasi obat antar-cabang sedang disiapkan.
          </p>
        </div>
        <Link href="/">
          <button className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all shadow-md">
            <ArrowLeft size={16} /> Kembali ke Overview
          </button>
        </Link>
      </div>
    </div>
  );
}