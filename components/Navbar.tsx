"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, Wrench, ShoppingBag, Search, 
  Home, LifeBuoy, Info, HelpCircle, Phone, ArrowRight
} from "lucide-react";

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll efekti için
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Link aktiflik kontrolü
  const isActive = (path: string) => pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-[#020617]/95 backdrop-blur-md border-white/10 h-20 shadow-lg" 
          : "bg-[#020617] border-transparent h-24"
      } print:hidden`}
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        
        {/* --- 1. SOL: LOGO --- */}
        <Link href="/" className="flex items-center gap-3 group select-none shrink-0" onClick={() => setMenuAcik(false)}>
          {/* İkon Kutusu */}
          <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform duration-300 border border-white/10">
             <Wrench className="text-white w-6 h-6 drop-shadow-sm" strokeWidth={2.5} />
          </div>
          
          {/* Yazı */}
          <div className="flex flex-col justify-center">
             <div className="font-black text-2xl tracking-tighter leading-none text-white group-hover:text-cyan-50">
                AURA<span className="text-cyan-400">BİLİŞİM</span>
             </div>
             <span className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase mt-0.5 group-hover:text-cyan-400 transition-colors">
                TEKNİK LABORATUVAR
             </span>
          </div>
        </Link>

        {/* --- 2. ORTA: MENÜ LİNKLERİ --- */}
        <div className="hidden xl:flex items-center gap-8">
            {[
              { href: "/", label: "Ana Sayfa" },
              { href: "/destek", label: "Destek" },
              { href: "/hakkimizda", label: "Hakkımızda" },
              { href: "/sss", label: "S.S.S" },
              { href: "/iletisim", label: "İletişim" },
            ].map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`text-[15px] font-bold transition-all relative py-2 group ${
                  isActive(link.href) ? "text-cyan-400" : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
                {/* Alt Çizgi Animasyonu */}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>
            ))}
        </div>

        {/* --- 3. SAĞ: BUTONLAR --- */}
        <div className="flex items-center gap-4 shrink-0">
            
            {/* Arama İkonu */}
            <button className="hidden md:flex text-slate-400 hover:text-cyan-400 transition-colors p-2 hover:bg-white/5 rounded-full">
                <Search size={20} />
            </button>

            {/* Aura Store Butonu */}
            <Link 
              href="/magaza" 
              className="hidden lg:flex items-center gap-2 border border-slate-700 hover:border-purple-500/50 bg-[#0f172a] hover:bg-purple-500/10 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group"
            >
                <ShoppingBag size={18} className="text-purple-400 group-hover:scale-110 transition-transform"/> 
                <span>Aura Store</span>
            </Link>

            {/* Onarım Talebi Butonu */}
            <Link 
              href="/onarim-talebi" 
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-0.5 active:scale-95 group border border-white/10"
            >
                <Wrench size={18} className="fill-white/20"/> 
                <span>Onarım Talebi</span>
                <ArrowRight size={16} className="hidden group-hover:block animate-in slide-in-from-left-1 fade-in duration-200" />
            </Link>

            {/* Mobil Menü Butonu */}
            <button 
              onClick={() => setMenuAcik(!menuAcik)} 
              className="xl:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            >
                 {menuAcik ? <X size={26}/> : <Menu size={26}/>}
            </button>
        </div>
      </div>

      {/* --- 4. MOBİL MENÜ --- */}
      {menuAcik && (
        <>
          {/* Arka plan karartma */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden" onClick={() => setMenuAcik(false)}></div>
          
          {/* Menü İçeriği */}
          <div className="xl:hidden fixed top-20 left-0 w-full bg-[#0F172A] border-b border-white/10 p-6 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-5 z-50 rounded-b-3xl">
            
            {[
              { href: "/", label: "Ana Sayfa", icon: Home },
              { href: "/destek", label: "Destek", icon: LifeBuoy },
              { href: "/hakkimizda", label: "Hakkımızda", icon: Info },
              { href: "/sss", label: "S.S.S", icon: HelpCircle },
              { href: "/iletisim", label: "İletişim", icon: Phone },
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setMenuAcik(false)} 
                className={`py-3.5 px-4 rounded-xl font-bold flex items-center gap-4 transition-all ${
                  isActive(item.href) 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <item.icon size={20}/> {item.label}
              </Link>
            ))}
            
            <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/10 pt-6">
                <Link href="/magaza" onClick={() => setMenuAcik(false)} className="bg-[#1e1b4b] border border-indigo-500/30 text-indigo-200 py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 hover:bg-[#2e2a6b] transition-colors">
                  <ShoppingBag size={24} className="text-purple-400"/> Aura Store
                </Link>
                <Link href="/onarim-talebi" onClick={() => setMenuAcik(false)} className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all border border-white/10">
                  <Wrench size={24}/> Onarım Talebi
                </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}