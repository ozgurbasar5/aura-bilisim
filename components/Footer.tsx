"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook, ArrowUp, ShieldCheck, Cpu } from "lucide-react";

export default function Footer() {
  
  const yukariCik = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a101e] border-t border-white/5 text-slate-400 text-sm relative overflow-hidden z-50">
      
      {/* Arka Plan Süslemesi (Linkleri engellemesin diye pointer-events-none eklendi) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* 1. SÜTUN: Marka */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6 text-white group cursor-pointer w-fit">
               <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors">
                 <Cpu className="w-6 h-6 text-cyan-400" />
               </div>
               <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-wide">AURA</span>
                  <span className="text-[10px] text-slate-500 tracking-[0.2em] uppercase">Bilişim</span>
               </div>
            </Link>
            <p className="leading-relaxed mb-6 text-slate-400">
              Teknolojiniz için laboratuvar standartlarında onarım merkezi. 
              Robot süpürge, telefon ve bilgisayar çözümleri.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center hover:bg-cyan-600 hover:text-white transition-all"><Instagram size={18} /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center hover:bg-cyan-600 hover:text-white transition-all"><Twitter size={18} /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center hover:bg-cyan-600 hover:text-white transition-all"><Facebook size={18} /></Link>
            </div>
          </div>

          {/* 2. SÜTUN: Hızlı Linkler (Linkler Kontrol Edildi) */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-500 rounded-full"></span> Hızlı Erişim
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Ana Sayfa</Link></li>
              <li><Link href="/cihaz-sorgula" className="hover:text-cyan-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Cihaz Durumu Sorgula</Link></li>
              <li><Link href="/satis" className="hover:text-cyan-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Aura Store (Satış)</Link></li>
              <li><Link href="/onarim-talebi" className="hover:text-cyan-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Onarım Başvurusu</Link></li>
              <li><Link href="/epanel" className="text-cyan-600 hover:text-cyan-400 transition-colors font-bold flex items-center gap-2 hover:translate-x-1 duration-300">Personel Girişi</Link></li>
            </ul>
          </div>

          {/* 3. SÜTUN: Hizmetler (Hepsi Onarıma Gider) */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span> Hizmetlerimiz
            </h4>
            <ul className="space-y-3">
              <li><Link href="/onarim-talebi" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-purple-500"></span> iPhone Ekran Değişimi</Link></li>
              <li><Link href="/onarim-talebi" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-purple-500"></span> Roborock Batarya Yenileme</Link></li>
              <li><Link href="/onarim-talebi" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-purple-500"></span> Macbook Anakart Onarım</Link></li>
              <li><Link href="/onarim-talebi" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-purple-500"></span> Sıvı Teması Temizliği</Link></li>
              <li><Link href="/onarim-talebi" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-purple-500"></span> Veri Kurtarma</Link></li>
            </ul>
          </div>

          {/* 4. SÜTUN: İletişim (GÜNCELLENDİ) */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-green-500 rounded-full"></span> İletişim
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-all shrink-0">
                    <MapPin size={16} />
                </div>
                <span className="text-sm">Beylikdüzü / İstanbul</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-all shrink-0">
                    <Phone size={16} />
                </div>
                <span className="text-sm">0539 632 1429</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-all shrink-0">
                    <Mail size={16} />
                </div>
                <span className="text-sm">destek@aurabilisim.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Şerit */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
             <ShieldCheck size={14} className="text-green-500"/>
             <p>© 2025 Aura Bilişim Teknolojileri. Tüm hakları saklıdır.</p>
          </div>
          
          <button 
            onClick={yukariCik}
            className="flex items-center gap-2 bg-[#1E293B] hover:bg-cyan-600 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all group"
          >
            YUKARI ÇIK <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}