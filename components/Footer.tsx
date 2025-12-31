"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Lock, Facebook, Instagram, Twitter, ChevronRight, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/BrandLogo"; 

export default function Footer() {
  return (
    <footer className="relative bg-[#0B0E14] text-slate-400 pt-20 pb-10 border-t border-white/5 overflow-hidden font-sans">
      
      {/* --- NEON EFEKTLERİ --- */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.8)]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* 1. SÜTUN: LOGO & HAKKINDA */}
          <div className="col-span-1">
            <Link href="/" className="inline-block mb-6 group">
              <BrandLogo variant="full" className="scale-90 origin-left" />
            </Link>
            
            <p className="text-sm leading-relaxed mb-6 text-slate-400">
              Teknolojiniz için laboratuvar standartlarında onarım merkezi. 
              <span className="text-white font-medium"> Güvenilir, hızlı ve garantili</span> çözümler üretiyoruz. Donanım ve yazılımın senfonisi.
            </p>
            
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. SÜTUN: KURUMSAL */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-500 rounded-full"></span> KURUMSAL
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: "Hikayemiz & Biyografi", href: "/kurumsal" },
                { label: "Logo Anlamı (DNA)", href: "/dna" },
                { label: "Cihaz Sorgula", href: "/sorgula" },
                { label: "İletişim & Ulaşım", href: "/iletisim" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="flex items-center gap-2 hover:text-cyan-400 transition-colors hover:translate-x-1 duration-300">
                    <ChevronRight size={14} className="text-slate-600" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. SÜTUN: HİZMETLER */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span> Hizmetlerimiz
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: "iPhone Onarım", href: "/hizmetler/telefon" },
                { label: "Robot Süpürge Bakım", href: "/hizmetler/robot" },
                { label: "Gaming Laptop Servis", href: "/hizmetler/bilgisayar" },
                { label: "Veri Kurtarma", href: "/destek" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="flex items-center gap-2 hover:text-purple-400 transition-colors hover:translate-x-1 duration-300">
                    <ChevronRight size={14} className="text-slate-600" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. SÜTUN: İLETİŞİM */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full"></span> İletişim
            </h4>
            <ul className="space-y-5 text-sm font-medium">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                  <MapPin size={18} />
                </div>
                <span className="mt-1">Beylikdüzü / İstanbul <br/> (Teknoloji Laboratuvarı)</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 group-hover:text-green-400 transition-colors">
                  <Phone size={18} />
                </div>
                <span>0539 632 14 69</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                  <Mail size={18} />
                </div>
                <span>destek@aurabilisim.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ALT BAR (YASAL LİNKLER EKLENDİ) */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-slate-500">
          <p>&copy; {new Date().getFullYear()} Aura Bilişim Teknolojileri. Tüm hakları saklıdır.</p>
          
          <div className="flex flex-wrap justify-center gap-6 items-center">
            <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="/kullanim-sartlari" className="hover:text-white transition-colors">Kullanım Şartları</Link>
            <Link href="/kvkk" className="flex items-center gap-1 hover:text-white transition-colors">
               <ShieldCheck size={12}/> KVKK Aydınlatma Metni
            </Link>
            <Link href="/login" className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full transition-all hover:bg-cyan-500/20 ml-2">
              <Lock size={12}/> Personel Girişi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}