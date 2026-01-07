"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, ShoppingBag, Wrench, Menu, X, Home 
} from "lucide-react";

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- DÜZELTME: KONTROLÜ BURAYA (HOOKLARDAN SONRAYA) ALDIK ---
  // Tüm hooklar (useState, useEffect) çalıştıktan sonra karar veriyoruz.
  // DÜZELTME BURADA: "/business" ve "/kurumsal" yollarını da engellenenlere ekle
  if (pathname?.startsWith("/epanel") || pathname?.startsWith("/business") || pathname?.startsWith("/kurumsal") || pathname === "/login") {
    return null;
  }
  // -----------------------------------------------------------

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
      scrolled 
        ? "bg-[#020617]/80 backdrop-blur-xl border-cyan-500/10 h-20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
        : "bg-transparent border-transparent h-28"
    } print:hidden`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between transition-all duration-500">
          {/* LOGO ALANI */}
          <Link href="/" className="flex items-center gap-3.5 group select-none shrink-0" onClick={() => setMenuAcik(false)}>
            <div className={`relative flex items-center justify-center transition-all duration-500 ${scrolled ? "w-9 h-9" : "w-12 h-12"}`}>
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg relative z-10" fill="none">
                  <defs>
                    <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <radialGradient id="navGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <path d="M 50 12 L 22 40 L 22 52 L 12 52 L 12 35 L 45 2 Z" fill="#fff" className="opacity-95 group-hover:fill-cyan-50 transition-colors"/>
                  <path d="M 50 88 L 78 60 L 78 48 L 88 48 L 88 65 L 55 98 Z" fill="#fff" className="opacity-95 group-hover:fill-cyan-50 transition-colors"/>
                  <rect x="36" y="36" width="28" height="28" rx="3" transform="rotate(45 50 50)" fill="url(#navGradient)" className="group-hover:scale-105 transition-transform duration-300 origin-center outline outline-1 outline-white/20"/>
                  <circle cx="50" cy="50" r="5" fill="url(#navGlow)" className="animate-pulse-slow"/>
                  <rect x="24" y="42" width="8" height="1.5" fill="url(#navGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                  <rect x="24" y="46" width="5" height="1.5" fill="url(#navGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                  <rect x="68" y="56.5" width="8" height="1.5" fill="url(#navGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                  <rect x="71" y="52.5" width="5" height="1.5" fill="url(#navGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                </svg>
            </div>
            <div className="flex flex-col justify-center">
                <div className={`font-extrabold tracking-tight leading-none text-white flex items-center gap-1 group-hover:text-cyan-50 transition-all duration-500 ${scrolled ? "text-lg" : "text-2xl"}`}>AURA<span className="text-cyan-400">BİLİŞİM</span></div>
                <span className={`text-slate-400 font-bold tracking-[0.25em] uppercase group-hover:text-cyan-400/80 transition-all duration-500 ${scrolled ? "text-[8px]" : "text-[10px]"}`}>TEKNOLOJİ ÜSSÜ</span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-8">
              {[ { href: "/", label: "Ana Sayfa" }, { href: "/destek", label: "Destek" }, { href: "/hakkimizda", label: "Hakkımızda" }, { href: "/sss", label: "S.S.S" }, { href: "/iletisim", label: "İletişim" } ].map((link) => (
                <Link key={link.href} href={link.href} className={`text-[14px] font-bold transition-all relative py-2 px-1 group ${isActive(link.href) ? "text-cyan-400" : "text-slate-300 hover:text-white"}`}>
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                </Link>
              ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
              <Link href="/cihaz-sorgula" className="hidden lg:flex items-center gap-2 border border-slate-700/50 bg-[#0f172a] hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs transition-all group">
                  <Search size={16} className="text-cyan-400 group-hover:text-cyan-300 transition-colors"/> <span>CİHAZ SORGULA</span>
              </Link>
              <Link href="/magaza" className="hidden lg:flex items-center gap-2 border border-slate-700/50 bg-[#0f172a] hover:bg-slate-800 text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs transition-all group">
                  <ShoppingBag size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors"/> <span>MAĞAZA</span>
              </Link>
              <Link href="/onarim-talebi" className="hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-cyan-900/20 hover:-translate-y-0.5 active:scale-95 border border-white/10">
                  <Wrench size={16} className="text-white fill-white/20"/> 
                  <span>ONARIM BAŞLAT</span>
              </Link>
              <button onClick={() => setMenuAcik(!menuAcik)} className="xl:hidden p-2 text-slate-300 hover:text-white transition-colors">
                    {menuAcik ? <X size={28}/> : <Menu size={28}/>}
              </button>
          </div>
        </div>
        
        {menuAcik && (
          <div className="xl:hidden fixed top-20 left-0 w-full bg-[#0b0e14] border-b border-white/10 p-6 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-2 z-50">
              {[ { href: "/", label: "Ana Sayfa", icon: Home }, { href: "/cihaz-sorgula", label: "Cihaz Sorgula", icon: Search }, { href: "/magaza", label: "Mağaza", icon: ShoppingBag } ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuAcik(false)} className="py-4 px-4 rounded-lg font-bold flex items-center gap-4 text-slate-400 hover:bg-white/5 hover:text-white">
                  <item.icon size={20}/> {item.label}
                </Link>
              ))}
          </div>
        )}
      </nav>
  );
}