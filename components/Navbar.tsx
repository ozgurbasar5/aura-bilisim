import Link from 'next/link';
import { Wrench, ShoppingBag, Monitor } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO ALANI */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-400 transition-all">
               <Monitor className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">AURA<span className="text-cyan-400">BİLİŞİM</span></span>
              <span className="text-[10px] text-slate-400 tracking-wider">TEKNOLOJİ LABORATUVARI</span>
            </div>
          </Link>

          {/* ORTA MENÜ */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-900/50 p-1.5 rounded-full border border-slate-800">
            <Link href="/magaza" className="flex items-center text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-full text-sm font-medium transition-all">
              <ShoppingBag className="w-4 h-4 mr-2 text-purple-400" />
              Mağaza
            </Link>
            <Link href="/servis" className="flex items-center text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-full text-sm font-medium transition-all">
              <Wrench className="w-4 h-4 mr-2 text-cyan-400" />
              Teknik Servis
            </Link>
          </div>

          {/* SAĞ BUTON */}
          <button className="hidden md:flex bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-105">
            Durum Sorgula
          </button>
          
        </div>
      </div>
    </nav>
  );
}