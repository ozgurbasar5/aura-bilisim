"use client";

import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";

export default function Iletisim() {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 pt-32 pb-0 font-sans flex flex-col">
      
      <div className="container mx-auto px-6 mb-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-4">Bize Ulaşın</h1>
            <p className="text-slate-400">Merkez servisimize bekleriz. Çayımız her zaman tazedir. ☕</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* ADRES KARTI */}
            <div className="bg-[#151921] p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:border-cyan-500/30 transition-all">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-cyan-500 mb-4"><MapPin/></div>
                <h3 className="font-bold text-white mb-2">Adresimiz</h3>
                <p className="text-sm text-slate-400">Teknoloji Mah. Bilişim Cad. <br/> No:1, İstanbul / Türkiye</p>
            </div>

            {/* TELEFON KARTI */}
            <div className="bg-[#151921] p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:border-cyan-500/30 transition-all">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-green-500 mb-4"><Phone/></div>
                <h3 className="font-bold text-white mb-2">Telefon & WP</h3>
                <p className="text-sm text-slate-400">0539 632 14 29</p>
                <p className="text-xs text-slate-500 mt-1">0539 632 14 29 (Çağrı)</p>
            </div>

            {/* E-POSTA KARTI */}
            <div className="bg-[#151921] p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:border-cyan-500/30 transition-all">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-purple-500 mb-4"><Mail/></div>
                <h3 className="font-bold text-white mb-2">E-Posta</h3>
                <p className="text-sm text-slate-400">destek@aurabilisim.com</p>
                <p className="text-xs text-slate-500 mt-1"></p>
            </div>

            {/* SAATLER KARTI */}
            <div className="bg-[#151921] p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:border-cyan-500/30 transition-all">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-orange-500 mb-4"><Clock/></div>
                <h3 className="font-bold text-white mb-2">Çalışma Saatleri</h3>
                <p className="text-sm text-slate-400">Hafta İçi: 09:00 - 18:00</p>
                <p className="text-xs text-slate-500 mt-1">Cumartesi: 10:00 - 15:00</p>
            </div>
        </div>
      </div>

      {/* HARİTA BÖLÜMÜ (TAM EKRAN) */}
      <div className="flex-1 bg-slate-900 relative min-h-[400px] border-t border-slate-800">
        {/* Google Maps İframe (Örnek İstanbul Konumu) */}
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192698.6198942296!2d28.87209724036665!3d41.00546324269936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1703666666666!5m2!1str!2str" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full opacity-80 hover:opacity-100 transition-opacity"
        ></iframe>
        
        {/* Harita Üzeri Buton */}
        <a 
            href="https://maps.google.com" 
            target="_blank" 
            className="absolute bottom-8 right-8 bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 hover:bg-cyan-500 transition-all z-10"
        >
            <Navigation size={18}/> Yol Tarifi Al
        </a>
      </div>

    </div>
  );
}