import React from "react";
import BrandLogo from "@/components/BrandLogo";
import { 
  Microscope, ShieldCheck, Cpu, Code2, 
  Activity, Lock, Zap, ArrowUpRight, ClipboardList 
} from "lucide-react";

export default function KurumsalPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 relative bg-[#030712] text-white overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- ARKA PLAN EFEKTLERİ --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-cyan-900/20 via-blue-900/10 to-transparent blur-[120px] pointer-events-none"></div>

      {/* --- HERO SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-6 mb-32 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Aura Bilişim Ecosystem v2.0
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
          GELECEĞİN <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-600 animate-gradient-x">
            ONARIM MİMARİSİ.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
          Aura Bilişim; yetkili servis disiplinini, yeni nesil yazılım teknolojileriyle birleştiren 
          <strong className="text-white font-medium"> hibrit bir teknoloji laboratuvarıdır.</strong>
          <br className="hidden md:block"/>
          Biz onarımı bir tamirat işlemi değil, bir mühendislik süreci olarak yönetiyoruz.
        </p>
      </section>

      {/* --- BENTO GRID: YETENEKLERİMİZ --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KART 1: AR-GE (Büyük Kart) */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="p-10 relative z-10">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
                        <Code2 size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Yazılım Destekli Operasyon</h3>
                    <p className="text-slate-400 leading-relaxed max-w-md">
                        Sektördeki "kara düzen" takibi reddediyoruz. Kendi geliştirdiğimiz <strong>Aura Core</strong> yazılımı ile cihazınızın laboratuvara girişinden teslimatına kadar her milisaniyesi kayıt altındadır.
                    </p>
                </div>
            </div>

            {/* KART 2: DİSİPLİN (Dikey Kart) */}
            <div className="md:col-span-1 relative group overflow-hidden rounded-3xl bg-slate-900/40 border border-white/5 hover:border-purple-500/30 transition-all duration-500">
                <div className="p-10 relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                            <Microscope size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Laboratuvar Protokolü</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Global markaların (Roborock, Apple) yetkili servis standartlarını uyguluyoruz. Antistatik zemin ve steril ortam.
                        </p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 text-purple-300 text-xs font-bold uppercase tracking-wider">
                            <Activity size={14} />
                            <span>Sıfır Hata Toleransı</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KART 3: GÜVENLİK */}
            <div className="md:col-span-1 relative group overflow-hidden rounded-3xl bg-slate-900/40 border border-white/5 hover:border-blue-500/30 transition-all duration-500">
                 <div className="p-8">
                    <Lock size={32} className="text-blue-500 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Veri Mahremiyeti</h3>
                    <p className="text-slate-400 text-sm">Cihazınızdaki veriler, donanım kadar değerlidir. KVKK standartlarında veri güvenliği.</p>
                 </div>
            </div>

            {/* KART 4: DONANIM */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-slate-900/40 border border-white/5 hover:border-green-500/30 transition-all duration-500 flex items-center">
                 <div className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="shrink-0 w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20 text-green-400">
                        <Cpu size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Mikro-Onarım Uzmanlığı</h3>
                        <p className="text-slate-400 text-sm">
                            Sadece parça değiştiren değil, anakart üzerindeki mikronluk arızaları onaran <strong>Micro-Soldering</strong> altyapımız ile cihazın orijinal yapısını koruyoruz.
                        </p>
                    </div>
                 </div>
            </div>

        </div>
      </section>

      {/* --- KURUMSAL DNA (LOGO ANLAMI) --- */}
      <section className="relative py-24 border-y border-white/5 bg-slate-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* SOL: LOGO GÖRSELİ */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full animate-pulse"></div>
                    <BrandLogo variant="full" className="w-full h-full drop-shadow-2xl scale-125" />
                </div>
            </div>

            {/* SAĞ: AÇIKLAMA */}
            <div className="lg:col-span-7 space-y-10">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">DNA'mızın Kodları</h2>
                    <p className="text-slate-400">Logomuz bir şekil değil, iş yapış biçimimizin şemasıdır.</p>
                </div>

                <div className="grid gap-6">
                    <DnaItem 
                        icon={<Cpu />} color="text-cyan-400" 
                        title="THE CORE (Merkez)" 
                        desc="Teknik uzmanlığımızın merkezi. Sorunun kaynağına inen, anakarta hükmeden derin bilgi birikimi." 
                    />
                    <DnaItem 
                        icon={<Zap />} color="text-yellow-400" 
                        title="THE PULSE (Enerji)" 
                        desc="'Ölü' kabul edilen cihazlara yeniden verdiğimiz yaşam enerjisi. Aura'nın anlamı." 
                    />
                    <DnaItem 
                        icon={<ShieldCheck />} color="text-blue-400" 
                        title="THE SHIELD (Kalkan)" 
                        desc="Kurumsal güvence. Cihazınız laboratuvarımıza girdiği andan itibaren koruma altındadır." 
                    />
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA / FİNAL (GÜNCELLENDİ: YENİ BUTON EKLENDİ) --- */}
      <section className="max-w-5xl mx-auto px-6 mt-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Teknolojinize Hak Ettiği Değeri Verin.</h2>
        <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
            Standart tamir dükkanları ile zaman kaybetmeyin. Profesyonel süreç, kurumsal muhatap ve garantili işlem için süreci başlatın.
        </p>
        
        <div className="flex flex-col items-center gap-6">
             
             {/* YENİ EKLENEN ANA BUTON: ONARIM BAŞVURUSU */}
             <a href="/basvuru" className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                <button className="relative px-12 py-5 bg-[#0B0E14] rounded-xl leading-none flex items-center divide-x divide-slate-600 overflow-hidden">
                    <span className="flex items-center gap-3 pr-6 text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                        <ClipboardList className="group-hover:scale-110 transition-transform"/>
                        Onarım Sürecini Başlat
                    </span>
                    <span className="pl-6 text-slate-400 text-sm group-hover:text-white transition-colors">
                         Online Randevu
                    </span>
                </button>
             </a>

             {/* DİĞER BUTONLAR (İKİNCİL) */}
             <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <a href="/iletisim" className="px-6 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 text-sm font-medium border border-transparent hover:border-white/10">
                    Laboratuvar İle İletişim <ArrowUpRight size={16}/>
                </a>
                <a href="/sorgula" className="px-6 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 text-sm font-medium border border-transparent hover:border-white/10">
                    Cihaz Durumu Sorgula
                </a>
             </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-white/5 flex justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700">
             <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-500">İstanbul</span>
             <span className="text-[10px] tracking-[0.3em] uppercase text-slate-600">•</span>
             <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-500">Teknoloji Üssü</span>
        </div>
      </section>

    </main>
  );
}

// --- YARDIMCI COMPONENT ---
function DnaItem({ icon, color, title, desc }: any) {
    return (
        <div className="flex gap-5 group">
            <div className={`w-12 h-12 shrink-0 rounded-full bg-slate-800/50 flex items-center justify-center ${color} border border-white/5 group-hover:border-white/20 transition-colors`}>
                {icon}
            </div>
            <div>
                <h4 className={`text-lg font-bold ${color} mb-1`}>{title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}