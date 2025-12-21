"use client";

import Link from "next/link";
import { Smartphone, Laptop, Zap, ShieldCheck, ArrowRight, Activity, Users, Wrench, Tag } from 'lucide-react';

export default function Home() {
  const brands = ["APPLE", "SAMSUNG", "XIAOMI", "ROBOROCK", "DYSON", "HUAWEI", "OPPO", "MONSTER", "ASUS", "LENOVO"];

  return (
    <div className="relative overflow-hidden selection:bg-cyan-500/30 pt-20">
       
      {/* --- GİRİŞ BÖLÜMÜ (HERO) --- */}
      <section className="relative py-24 z-10">
        <div className="container mx-auto px-6 text-center relative">
          
          {/* ROZET */}
          <div className="inline-flex items-center gap-3 bg-[#0a101e]/80 border border-cyan-500/30 px-6 py-3 rounded-full text-cyan-400 mb-10 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-cyan-400 transition-all cursor-default">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="font-bold tracking-[0.15em] uppercase text-sm">TEKNİK SERVİS LABORATUVARI</span>
          </div>
          
          {/* Başlık */}
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
            Teknolojiniz <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-500 animate-text-gradient">
              Emin Ellerde.
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Sıradan bir tamirci değil, <span className="text-white font-medium">ileri seviye teknoloji üssü.</span> <br className="hidden md:block"/>
            Roborock, iPhone ve Gaming PC onarımında <span className="text-cyan-400 font-bold border-b border-cyan-500/30">%99 başarı oranı</span>.
          </p>

          {/* Butonlar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <Link href="/onarim-talebi" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-[0_0_40px_rgba(8,145,178,0.4)] hover:shadow-[0_0_60px_rgba(8,145,178,0.6)] hover:scale-105 flex items-center gap-2">
              Onarım Talebi Oluştur <ArrowRight size={22} />
            </Link>
            
            <Link href="/cihaz-sorgula" className="bg-[#1e293b]/60 hover:bg-[#1e293b] text-white px-10 py-5 rounded-2xl font-bold text-xl border border-white/10 transition-all hover:border-cyan-500/50 hover:text-cyan-400">
              Cihaz Durumu Sorgula
            </Link>
          </div>

          {/* İSTATİSTİKLER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto border border-white/10 py-10 px-6 bg-[#0a101e]/40 backdrop-blur-md rounded-3xl">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-white mb-2">%100</span>
              <span className="text-sm text-slate-400 flex items-center gap-2 uppercase"><Users size={16} className="text-cyan-500" /> Müşteri Memnuniyeti</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-white mb-2">Onaylı</span>
              <span className="text-sm text-slate-400 flex items-center gap-2 uppercase"><Tag size={16} className="text-purple-500" /> Orijinal Parça</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-white mb-2">6 Ay</span>
              <span className="text-sm text-slate-400 flex items-center gap-2 uppercase"><ShieldCheck size={16} className="text-green-500" /> Garanti Süresi</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-white mb-2">15K+</span>
              <span className="text-sm text-slate-400 flex items-center gap-2 uppercase"><Wrench size={16} className="text-yellow-500" /> Başarılı Tamir</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARKA ŞERİDİ --- */}
      <div className="w-full bg-[#020610] border-y border-white/5 py-10 overflow-hidden relative z-40">
        <div className="inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] relative z-10">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-16 [&_li]:max-w-none animate-infinite-scroll">
                {brands.map((brand, index) => (
                    <li key={index} className="text-3xl font-black text-slate-800/80 hover:text-cyan-500 transition-colors duration-500 cursor-default tracking-[0.2em]">
                        {brand}
                    </li>
                ))}
            </ul>
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-16 [&_li]:max-w-none animate-infinite-scroll" aria-hidden="true">
                {brands.map((brand, index) => (
                    <li key={`dup-${index}`} className="text-3xl font-black text-slate-800/80 hover:text-cyan-500 transition-colors duration-500 cursor-default tracking-[0.2em]">
                        {brand}
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* --- HİZMETLER --- */}
      <section className="py-24 relative z-40 bg-[#0F172A]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Hizmet Alanlarımız</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Teknik laboratuvarımızda en sık işlem gören cihaz grupları</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kart 1: Telefon */}
            <Link href="/onarim-talebi">
                <div className="group bg-[#0f1623]/80 border border-slate-800 p-8 rounded-3xl hover:border-cyan-500/50 transition-all hover:-translate-y-2 cursor-pointer h-full">
                    <Smartphone className="w-12 h-12 text-cyan-400 mb-6" />
                    <h3 className="text-2xl font-bold mb-4 text-white">Telefon Onarımı</h3>
                    <p className="text-slate-400 mb-6">iPhone ekran ve FaceID onarımı, Android anakart tamiri.</p>
                    <span className="text-cyan-400 font-bold flex items-center gap-2">İncele <ArrowRight size={18}/></span>
                </div>
            </Link>

            {/* Kart 2: Robot */}
            <Link href="/onarim-talebi">
                <div className="group bg-[#0f1623]/80 border border-slate-800 p-8 rounded-3xl hover:border-purple-500/50 transition-all hover:-translate-y-2 cursor-pointer h-full">
                    <Zap className="w-12 h-12 text-purple-400 mb-6" />
                    <h3 className="text-2xl font-bold mb-4 text-white">Robot Süpürge</h3>
                    <p className="text-slate-400 mb-6">Roborock Lidar hatası, sıvı teması ve tekerlek değişimi.</p>
                    <span className="text-purple-400 font-bold flex items-center gap-2">İncele <ArrowRight size={18}/></span>
                </div>
            </Link>

            {/* Kart 3: PC */}
            <Link href="/onarim-talebi">
                <div className="group bg-[#0f1623]/80 border border-slate-800 p-8 rounded-3xl hover:border-green-500/50 transition-all hover:-translate-y-2 cursor-pointer h-full">
                    <Laptop className="w-12 h-12 text-green-400 mb-6" />
                    <h3 className="text-2xl font-bold mb-4 text-white">Bilgisayar & Laptop</h3>
                    <p className="text-slate-400 mb-6">Gaming laptop ısınma sorunu, chipset tamiri ve bakım.</p>
                    <span className="text-green-400 font-bold flex items-center gap-2">İncele <ArrowRight size={18}/></span>
                </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}