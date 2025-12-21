"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Cpu, ShoppingBag, Wrench, Search } from "lucide-react";

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors">
            <Cpu className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wide text-white">AURA</span>
            <span className="text-[10px] text-slate-400 tracking-[0.2em] uppercase">Bilişim</span>
          </div>
        </Link>

        {/* MASAÜSTÜ MENÜ */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Ana Sayfa</Link>
          
          <Link href="/onarim-talebi" className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
            <Wrench size={16}/> Onarım Talebi
          </Link>
          
          <Link href="/cihaz-sorgula" className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
            <Search size={16}/> Cihaz Sorgula
          </Link>
          
          <Link href="/satis" className="flex items-center gap-1 text-white hover:text-cyan-400 transition-colors">
            <ShoppingBag size={16} /> Satış
          </Link>

          {/* GÜNCELLENDİ: Artık direkt Login sayfasına gidiyor */}
          <Link 
            href="/login" 
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_20px_rgba(8,145,178,0.4)]"
          >
            Personel Girişi
          </Link>
        </div>

        {/* MOBİL MENÜ BUTONU */}
        <button onClick={() => setMenuAcik(!menuAcik)} className="md:hidden text-slate-300 hover:text-white">
          {menuAcik ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBİL MENÜ İÇERİK */}
      {menuAcik && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0F172A] border-b border-white/5 p-6 flex flex-col gap-4 text-center z-50 shadow-2xl">
          <Link href="/" onClick={() => setMenuAcik(false)} className="text-slate-300 py-2">Ana Sayfa</Link>
          <Link href="/onarim-talebi" onClick={() => setMenuAcik(false)} className="text-slate-300 py-2">Onarım Talebi</Link>
          <Link href="/cihaz-sorgula" onClick={() => setMenuAcik(false)} className="text-slate-300 py-2">Cihaz Sorgula</Link>
          <Link href="/satis" onClick={() => setMenuAcik(false)} className="text-slate-300 py-2 flex items-center justify-center gap-2"><ShoppingBag size={16}/> Satış</Link>
          
          {/* GÜNCELLENDİ: Mobilde de Login'e gidiyor */}
          <Link href="/login" onClick={() => setMenuAcik(false)} className="bg-cyan-600 text-white py-3 rounded-lg font-bold">Personel Girişi</Link>
        </div>
      )}
    </nav>
  );
}