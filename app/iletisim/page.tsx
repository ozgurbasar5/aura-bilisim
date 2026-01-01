"use client";

import { MapPin, Phone, Mail, Clock, Navigation, Coffee } from "lucide-react";

export default function Iletisim() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-0 font-sans flex flex-col relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* ARKA PLAN EFEKTLERİ */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 mb-16 relative z-10">
        
        {/* BAŞLIK */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Coffee size={14} className="fill-current"/> Merkez Ofis
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
                Bize <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Ulaşın</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
              Teknik laboratuvarımızı ziyaret edin, cihazınızı elden teslim edin veya kargo süreçleri hakkında bilgi alın. Çayımız her zaman tazedir. ☕
            </p>
        </div>

        {/* İLETİŞİM KARTLARI (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* ADRES KARTI */}
            <div className="group bg-[#0F1623]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center hover:border-cyan-500/30 transition-all hover:-translate-y-2 shadow-lg">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-500 group-hover:text-[#020617] transition-colors shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                    <MapPin size={28}/>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Adresimiz</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                   YAKINDA  <br/> No:1, Beylikdüzü / İstanbul
                </p>
            </div>

            {/* TELEFON KARTI */}
            <div className="group bg-[#0F1623]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center hover:border-green-500/30 transition-all hover:-translate-y-2 shadow-lg">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-green-400 mb-6 group-hover:bg-green-500 group-hover:text-[#020617] transition-colors shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    <Phone size={28}/>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Telefon & WP</h3>
                <a href="tel:05396321429" className="text-lg font-black text-slate-200 hover:text-green-400 transition-colors">0539 632 14 29</a>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">7/24 Mesaj Atabilirsiniz</p>
            </div>

            {/* E-POSTA KARTI */}
            <div className="group bg-[#0F1623]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center hover:border-purple-500/30 transition-all hover:-translate-y-2 shadow-lg">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500 group-hover:text-[#020617] transition-colors shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                    <Mail size={28}/>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">E-Posta</h3>
                <a href="mailto:destek@aurabilisim.com" className="text-sm font-bold text-slate-200 hover:text-purple-400 transition-colors">destek@aurabilisim.com</a>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">Kurumsal & Teknik</p>
            </div>

            {/* SAATLER KARTI */}
            <div className="group bg-[#0F1623]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center hover:border-orange-500/30 transition-all hover:-translate-y-2 shadow-lg">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-orange-400 mb-6 group-hover:bg-orange-500 group-hover:text-[#020617] transition-colors shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                    <Clock size={28}/>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Çalışma Saatleri</h3>
                <p className="text-sm text-slate-400">Hafta İçi: <span className="text-white font-bold">09:00 - 18:00</span></p>
                <p className="text-sm text-slate-400 mt-1">Cumartesi: <span className="text-white font-bold">10:00 - 15:00</span></p>
            </div>
        </div>
      </div>

      {/* HARİTA BÖLÜMÜ (TAM EKRAN + DARK MODE STYLE) */}
      <div className="flex-1 bg-slate-900 relative min-h-[500px] border-t border-white/10 group">
        {/* Google Maps İframe */}
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.650490016625!2d28.63973437654267!3d40.98921297135293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b55f9a65555555%3A0x123456789abcdef!2sBeylikd%C3%BCz%C3%BC%2C%20Istanbul!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%) brightness(90%)' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700"
        ></iframe>
        
        {/* Harita Üzeri Buton */}
        <div className="absolute inset-0 pointer-events-none flex items-end justify-end p-8">
            <a 
                href="https://goo.gl/maps/xExampleMapLink" // Buraya gerçek Google Maps linkini koyabilirsin
                target="_blank" 
                className="pointer-events-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-3 hover:-translate-y-1 transition-all z-10 border border-white/20"
            >
                <Navigation size={20} className="animate-pulse"/> YOL TARİFİ AL
            </a>
        </div>
        
        {/* Harita Üzeri Gradient (Yumuşak Geçiş İçin) */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020617] to-transparent pointer-events-none"></div>
      </div>

    </div>
  );
}