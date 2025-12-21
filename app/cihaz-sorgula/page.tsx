"use client";

import { useState } from "react";
import { Search, Settings, Clock, CheckCircle2, FileText, Wrench, Truck } from "lucide-react";

export default function CihazSorgula() {
  const [takipNo, setTakipNo] = useState("");
  const [sonuc, setSonuc] = useState<any>(null);

  const sorgula = (e: React.FormEvent) => {
    e.preventDefault();
    if(takipNo.length > 3) {
      setSonuc({
        cihaz: "iPhone 11 - Ekran Değişimi",
        durum: "islemde",
        teknisyen: "Ahmet Usta",
        tarih: "22.12.2025"
      });
    } else {
      setSonuc(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Dekoratif Arka Plan */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-cyan-500/5 blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cihaz Takip Sistemi</h1>
          <p className="text-slate-400">Servis takip numaranız ile anlık durum sorgulama.</p>
        </div>

        {/* Arama Alanı */}
        <form onSubmit={sorgula} className="relative mb-16 max-w-2xl mx-auto">
          <input type="text" className="w-full bg-[#1E293B] border border-slate-700 rounded-2xl pl-6 pr-36 py-5 text-lg text-white focus:border-cyan-500 shadow-2xl outline-none" placeholder="Takip No Giriniz..." value={takipNo} onChange={(e) => setTakipNo(e.target.value)} />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-cyan-600 hover:bg-cyan-500 text-white px-8 rounded-xl font-bold transition-all shadow-lg">Sorgula</button>
        </form>

        {/* SONUÇ KARTI */}
        {sonuc && (
          <div className="bg-[#1E293B]/80 backdrop-blur border border-cyan-500/50 rounded-3xl p-8 mb-20 animate-float-fast shadow-[0_0_50px_rgba(6,182,212,0.15)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{sonuc.cihaz}</h3>
                <p className="text-slate-400 mt-1">Giriş Tarihi: <span className="text-cyan-400">{sonuc.tarih}</span></p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-sm ${sonuc.durum === 'hazir' ? 'bg-green-500/20 text-green-400' : sonuc.durum === 'islemde' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-300'}`}>
                {sonuc.durum === 'hazir' ? 'HAZIR' : sonuc.durum === 'islemde' ? 'İŞLEMDE' : 'SIRADA'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase px-2">
                <span>Kayıt</span>
                <span>Onarım</span>
                <span>Teslimat</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 rounded-full ${sonuc.durum === 'hazir' ? 'w-full bg-green-500' : sonuc.durum === 'islemde' ? 'w-2/3 bg-yellow-500' : 'w-1/3 bg-cyan-500'}`}></div>
              </div>
            </div>

             <div className="mt-6 flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-white/5">
              <Settings className="text-cyan-500" size={24} />
              <p className="text-sm text-slate-300">
                Teknisyen <strong>{sonuc.teknisyen}</strong> şu an cihaz üzerinde çalışıyor.
              </p>
            </div>
          </div>
        )}

        {/* --- SAYFAYI DOLDURAN GÖRSEL ALAN: ONARIM SÜRECİ --- */}
        <div className="mt-12">
            <h3 className="text-center text-xl font-bold text-white mb-8">Servis Süreci Nasıl İşler?</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-white/5 text-center group hover:bg-[#1E293B] transition-colors">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                    </div>
                    <h4 className="font-bold text-white mb-2">1. Kayıt</h4>
                    <p className="text-xs text-slate-400">Cihazınız sisteme kaydedilir ve size takip numarası verilir.</p>
                </div>

                <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-white/5 text-center group hover:bg-[#1E293B] transition-colors">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-400 group-hover:scale-110 transition-transform">
                        <Search size={24} />
                    </div>
                    <h4 className="font-bold text-white mb-2">2. Arıza Tespiti</h4>
                    <p className="text-xs text-slate-400">Uzman teknisyenlerimiz arızayı ve maliyeti belirler.</p>
                </div>

                <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-white/5 text-center group hover:bg-[#1E293B] transition-colors">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                        <Wrench size={24} />
                    </div>
                    <h4 className="font-bold text-white mb-2">3. Profesyonel Onarım</h4>
                    <p className="text-xs text-slate-400">Onayınızla birlikte orijinal parçalarla onarım başlar.</p>
                </div>

                <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-white/5 text-center group hover:bg-[#1E293B] transition-colors">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={24} />
                    </div>
                    <h4 className="font-bold text-white mb-2">4. Test ve Teslim</h4>
                    <p className="text-xs text-slate-400">Son kontroller yapılır ve cihaz size teslim edilir.</p>
                </div>

            </div>
        </div>

      </div>
    </main>
  );
}