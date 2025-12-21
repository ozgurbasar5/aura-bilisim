import { Smartphone, Laptop, Zap, CheckCircle2, ShieldCheck, Microscope } from 'lucide-react';

export default function Home() {
  return (
    <main className="pt-24 bg-[#0F172A] min-h-screen text-white">
      {/* GİRİŞ BÖLÜMÜ (HERO) */}
      <section className="relative py-20 overflow-hidden">
        {/* Arka Plan Aura Efekti */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 px-4 py-2 rounded-full text-cyan-400 text-sm mb-10 backdrop-blur-sm">
            <Microscope className="w-4 h-4" />
            <span className="font-medium tracking-wide">Laboratuvar Standartlarında Onarım</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">
            Teknolojiniz <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
              Emin Ellerde.
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Robot süpürge, cep telefonu ve bilgisayar onarımında uzman teknisyen kadrosu. 
            Hızlı teşhis, şeffaf süreç ve garantili işçilik.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(8,145,178,0.3)] hover:scale-105 active:scale-95">
              Servis Talebi Oluştur
            </button>
            <button className="w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 text-white px-10 py-4 rounded-2xl font-bold text-lg border border-slate-700 transition-all backdrop-blur-sm">
              Cihaz Sorgula
            </button>
          </div>

          {/* Hızlı Güven İkonları */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto border-t border-slate-800/50 pt-10">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <ShieldCheck className="w-5 h-5 text-green-500" /> 6 Ay Garanti
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <Zap className="w-5 h-5 text-yellow-500" /> Hızlı Onarım
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <CheckCircle2 className="w-5 h-5 text-blue-500" /> Orijinal Parça
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <Microscope className="w-5 h-5 text-purple-500" /> Detaylı Test
            </div>
          </div>
        </div>
      </section>

      {/* SERVİS KARTLARI */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-slate-900/50 border border-slate-800 p-10 rounded-3xl hover:border-cyan-500/50 transition-all duration-500">
              <Smartphone className="w-12 h-12 text-cyan-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-4">Telefon Onarımı</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Ekran, batarya, şarj soketi ve ileri seviye anakart tamiri. iPhone ve tüm Android modelleri için profesyonel çözümler.</p>
            </div>
            <div className="group bg-slate-900/50 border border-slate-800 p-10 rounded-3xl hover:border-purple-500/50 transition-all duration-500">
              <Zap className="w-12 h-12 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-4">Robot Süpürge</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Roborock, Xiaomi, Dreame modellerinde Lidar sensör, tekerlek ve batarya sorunlarına teknik laboratuvar desteği.</p>
            </div>
            <div className="group bg-slate-900/50 border border-slate-800 p-10 rounded-3xl hover:border-blue-500/50 transition-all duration-500">
              <Laptop className="w-12 h-12 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-4">Bilgisayar & Laptop</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Sıvı teması onarımı, donanım yükseltme, chipset tamiri ve termal bakım hizmetleri ile maksimum performans.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}