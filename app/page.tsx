"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, ArrowRight, Users, Tag, ShieldCheck, 
  Smartphone, Zap, Laptop, ShoppingBag, 
  CheckCircle2, Package, ChevronRight, Activity, Trophy, 
  HeartPulse, MessageCircle, MonitorPlay, Send, Award
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

// !!! BURAYI DOLDUR USTA !!!
// .env dosyasındaki linkini ve şifreni tırnak içine yapıştır.
const SUPABASE_URL = "https://cmkjewcpqohkhnfpvoqw.supabase.co"; // Kendi URL'ini yapıştır
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2pld2NwcW9oa2huZnB2b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDQ2MDIsImV4cCI6MjA4MTkyMDYwMn0.HwgnX8tn9ObFCLgStWWSSHMM7kqc9KqSZI96gpGJ6lw";      // Kendi ANON KEY'ini yapıştır

// Client oluştur
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// URL oluşturucu
const slugify = (text: string) => {
  if (!text) return ""; 
  return text.toString().toLowerCase().trim()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
};

export default function Home() {
  const router = useRouter();
  const [takipNo, setTakipNo] = useState("");
  const [vitrinUrunleri, setVitrinUrunleri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // MARKA LİSTESİ
  const brandsSource = ["APPLE", "SAMSUNG", "XIAOMI", "ROBOROCK", "DYSON", "HUAWEI", "OPPO", "MONSTER", "ASUS", "LENOVO"];
  const brands = [...brandsSource, ...brandsSource, ...brandsSource, ...brandsSource];

  // Veritabanından vitrin ürünlerini çek
  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        let { data, error } = await supabase
          .from('urunler')
          .select('*')
          .eq('stok_durumu', true) // Sadece stokta olanları göster
          .order('created_at', { ascending: false })
          .limit(4); // Ana sayfada sadece 4 veya 8 ürün gösterelim

        if (data) {
           const mapped = data.map((item: any) => ({
             id: item.id,
             name: item.ad,
             price: item.fiyat,
             image: item.resim_url,
             category: item.kategori,
             tag: "Fırsat" // Vitrin için etiket
           }));
           setVitrinUrunleri(mapped);
        }
      } catch (e) {
        console.error("Vitrin yüklenirken hata:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShowcase();
  }, []);

  const sorgula = (e: React.FormEvent) => {
    e.preventDefault();
    if (takipNo.trim().length > 0) router.push(`/sorgula?no=${takipNo}`);
  };

  const getRandomGradient = (index: number) => {
    const gradients = [
      "bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-800",
      "bg-gradient-to-br from-fuchsia-600 via-pink-600 to-rose-800",
      "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-800",
      "bg-gradient-to-br from-orange-500 via-amber-600 to-red-800",
      "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-900",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="relative bg-[#020617] text-white font-sans selection:bg-cyan-500/30 min-h-screen overflow-x-hidden">
      
      {/* ARKA PLAN */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-600/15 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse-slow"></div>

      {/* HERO SECTION */}
      <section className="relative pt-44 pb-20 z-10 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#0f172a]/80 border border-cyan-500/50 px-4 py-2 rounded-full text-cyan-300 mb-8 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="font-bold tracking-widest uppercase text-[10px] md:text-xs">Profesyonel Teknik Servis</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight drop-shadow-2xl">
            Teknolojiniz <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-500 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
               Emin Ellerde.
            </span>
          </h1>
          <p className="text-slate-300 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Sıradan bir tamirci değil, <strong className="text-white">ileri seviye teknoloji üssü.</strong> <br className="hidden md:block"/>
            Roborock, iPhone ve Gaming PC onarımında <span className="text-cyan-400 font-bold">%99 başarı oranı</span>.
          </p>
          
          {/* SORGULAMA INPUT */}
          <div className="max-w-xl mx-auto relative group mb-20">
             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition duration-500 group-hover:duration-200 animate-tilt"></div>
             <form onSubmit={sorgula} className="relative bg-[#0a0e17] p-2 rounded-2xl flex items-center shadow-2xl border border-white/10 backdrop-blur-xl">
                <div className="pl-4 text-cyan-500"><Search size={22}/></div>
                <input type="text" placeholder="Cihaz Takip No (Örn: 1453)" className="w-full h-14 bg-transparent px-4 outline-none text-white placeholder:text-slate-500 font-medium text-lg" value={takipNo} onChange={(e) => setTakipNo(e.target.value)} />
                <button type="submit" className="h-14 px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] uppercase tracking-wide">Sorgula</button>
             </form>
          </div>

          {/* İSTATİSTİKLER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
             {[{ val: "%100", label: "Müşteri Memnuniyeti", icon: Users, color: "text-cyan-400", shadow: "shadow-cyan-500/20", border: "border-cyan-500/30" }, { val: "Onaylı", label: "Orijinal Parça", icon: Tag, color: "text-purple-400", shadow: "shadow-purple-500/20", border: "border-purple-500/30" }, { val: "6 Ay", label: "Garanti Süresi", icon: ShieldCheck, color: "text-green-400", shadow: "shadow-green-500/20", border: "border-green-500/30" }, { val: "15K+", label: "Başarılı Tamir", icon: CheckCircle2, color: "text-yellow-400", shadow: "shadow-yellow-500/20", border: "border-yellow-500/30" }].map((stat, i) => (
               <div key={i} className={`bg-[#0a0e17]/60 backdrop-blur-md border ${stat.border} p-8 rounded-3xl hover:bg-[#111620] transition-all group cursor-default hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-105 ${stat.shadow.replace('/20','/40')}`}>
                  <div className={`text-4xl font-black text-white mb-2 group-hover:${stat.color.replace('text-', '')} transition-colors drop-shadow-lg`}>{stat.val}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-2"><stat.icon size={16} className={stat.color} /> {stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* GÜVEN BANDI */}
      <div className="w-full bg-gradient-to-r from-[#020617] via-[#0a0e17] to-[#020617] border-y border-white/5 py-6 relative z-20 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-wrap items-center justify-center md:justify-between gap-6 text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2"><Award className="w-5 h-5 text-cyan-500" /> <span>İstanbul'un <strong>En Güvenilir</strong> Teknik Servisi</span></div>
            <div className="flex items-center gap-2"><Trophy size={18} className="text-yellow-500" /> <span>Bölgenin En Donanımlı Laboratuvarı</span></div>
            <div className="flex items-center gap-2"><HeartPulse size={18} className="text-red-500" /> <span><strong>10.000+</strong> Mutlu Müşteri</span></div>
        </div>
      </div>

      {/* MARKA ŞERİDİ */}
      <div className="w-full bg-[#020610] border-b border-white/5 py-12 overflow-hidden relative z-20 group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#020610] via-transparent to-[#020610] z-10 pointer-events-none"></div>
        <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((brand, index) => (
                <div key={index} className="mx-16 text-3xl font-black text-slate-700/50 hover:text-cyan-400 transition-colors duration-300 cursor-default tracking-[0.25em] uppercase select-none drop-shadow-sm whitespace-nowrap">
                    {brand}
                </div>
            ))}
        </div>
      </div>

      {/* HİZMETLER */}
      <section className="py-28 relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">Hizmet Alanlarımız</h2>
                <p className="text-slate-400 text-lg max-w-2xl font-light">Teknik laboratuvarımızda en sık işlem gören profesyonel hizmetler.</p>
            </div>
            <Link href="/hizmetler" className="hidden md:flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                Tüm Hizmetleri Gör <ArrowRight size={18}/>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kart 1: Telefon */}
            <Link href="/hizmetler/telefon" className="group relative block h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-[2rem] blur-md opacity-0 group-hover:opacity-100 transition duration-500 group-hover:blur-[1px]"></div>
                <div className="relative bg-[#0b0e14] p-[1px] rounded-[2rem] h-full">
                    <div className="bg-gradient-to-b from-[#0f131a] to-[#0b0e14] rounded-[2rem] p-10 h-full flex flex-col items-start group-hover:bg-[#111620] transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all"></div>
                        <div className="w-16 h-16 bg-cyan-950/50 rounded-2xl flex items-center justify-center mb-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative z-10"><Smartphone size={32} /></div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Telefon Onarımı</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">iPhone ekran ve FaceID onarımı, Android anakart tamiri, sıvı teması temizliği ve batarya değişimi.</p>
                        <div className="mt-auto w-full py-4 rounded-xl bg-slate-900/50 border border-cyan-900/50 text-center text-sm font-bold text-cyan-400 uppercase tracking-wider group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-500 transition-all group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] relative z-10">İNCELE</div>
                    </div>
                </div>
            </Link>
            {/* Kart 2: Robot */}
            <Link href="/hizmetler/robot" className="group relative block h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-purple-500 to-pink-600 rounded-[2rem] blur-md opacity-0 group-hover:opacity-100 transition duration-500 group-hover:blur-[1px]"></div>
                <div className="relative bg-[#0b0e14] p-[1px] rounded-[2rem] h-full">
                      <div className="bg-gradient-to-b from-[#0f131a] to-[#0b0e14] rounded-[2rem] p-10 h-full flex flex-col items-start group-hover:bg-[#111620] transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all"></div>
                        <div className="w-16 h-16 bg-purple-950/50 rounded-2xl flex items-center justify-center mb-8 text-purple-400 group-hover:scale-110 transition-transform duration-300 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] relative z-10"><Zap size={32} /></div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Robot Süpürge</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">Roborock, Xiaomi ve Dyson için Lidar hatası, anakart onarımı, tekerlek değişimi ve genel bakım.</p>
                        <div className="mt-auto w-full py-4 rounded-xl bg-slate-900/50 border border-purple-900/50 text-center text-sm font-bold text-purple-400 uppercase tracking-wider group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-500 transition-all group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] relative z-10">İNCELE</div>
                    </div>
                </div>
            </Link>
            {/* Kart 3: PC */}
            <Link href="/hizmetler/bilgisayar" className="group relative block h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-[2rem] blur-md opacity-0 group-hover:opacity-100 transition duration-500 group-hover:blur-[1px]"></div>
                <div className="relative bg-[#0b0e14] p-[1px] rounded-[2rem] h-full">
                      <div className="bg-gradient-to-b from-[#0f131a] to-[#0b0e14] rounded-[2rem] p-10 h-full flex flex-col items-start group-hover:bg-[#111620] transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/20 transition-all"></div>
                        <div className="w-16 h-16 bg-green-950/50 rounded-2xl flex items-center justify-center mb-8 text-green-400 group-hover:scale-110 transition-transform duration-300 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)] relative z-10"><Laptop size={32} /></div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Bilgisayar & Laptop</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">Gaming laptop ısınma sorunu, chipset (BGA) tamiri, termal macun bakımı ve SSD yükseltme işlemleri.</p>
                        <div className="mt-auto w-full py-4 rounded-xl bg-slate-900/50 border border-green-900/50 text-center text-sm font-bold text-green-400 uppercase tracking-wider group-hover:bg-green-600 group-hover:text-white group-hover:border-green-500 transition-all group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] relative z-10">İNCELE</div>
                    </div>
                </div>
            </Link>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="py-24 relative overflow-hidden bg-[#0a0f18] border-y border-white/5">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
              <div className="inline-block mb-4 px-4 py-1.5 bg-cyan-950/30 rounded-full border border-cyan-500/20 text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(6,182,212,0.2)]">Süreç Yönetimi</div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
               Nasıl <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Çalışır?</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">Arızalı cihazınızın servisimize girişinden teslimatına kadar geçen şeffaf süreç.</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[85px] left-0 w-full h-[3px] bg-slate-800/50 overflow-hidden rounded-full">
               <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-shimmer-fast opacity-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Adım 1 */}
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-40 blur-xl transition duration-500"></div>
                 <div className="relative h-full bg-[#111620] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center group-hover:border-cyan-500/50 transition-all duration-300 group-hover:-translate-y-2 z-10 shadow-xl">
                    <div className="w-20 h-20 mb-8 rounded-2xl bg-[#1a202c] border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-all duration-500 relative bg-gradient-to-br from-cyan-900/20 to-transparent">
                       <Activity className="text-cyan-400 w-10 h-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                       <div className="absolute -top-3 -right-3 w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-black text-sm border-2 border-[#0a0f18]">1</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Kayıt Oluştur</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Web sitemizden veya WhatsApp hattımızdan saniyeler içinde arıza kaydınızı oluşturun.</p>
                 </div>
              </div>

              {/* Adım 2 */}
              <div className="relative group lg:mt-12">
                 <div className="absolute -inset-1 bg-gradient-to-b from-purple-500 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-40 blur-xl transition duration-500"></div>
                 <div className="relative h-full bg-[#111620] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center group-hover:border-purple-500/50 transition-all duration-300 group-hover:-translate-y-2 z-10 shadow-xl">
                    <div className="w-20 h-20 mb-8 rounded-2xl bg-[#1a202c] border border-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-all duration-500 relative bg-gradient-to-br from-purple-900/20 to-transparent">
                       <Send className="text-purple-400 w-10 h-10 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                       <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-black text-sm border-2 border-[#0a0f18]">2</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Ücretsiz Gönder</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Size verilen kod ile cihazınızı Yurtiçi Kargo üzerinden ücretsiz olarak bize gönderin.</p>
                 </div>
              </div>

              {/* Adım 3 */}
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-b from-pink-500 to-orange-600 rounded-3xl opacity-0 group-hover:opacity-40 blur-xl transition duration-500"></div>
                 <div className="relative h-full bg-[#111620] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center group-hover:border-pink-500/50 transition-all duration-300 group-hover:-translate-y-2 z-10 shadow-xl">
                    <div className="w-20 h-20 mb-8 rounded-2xl bg-[#1a202c] border border-pink-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.15)] group-hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] group-hover:scale-110 transition-all duration-500 relative bg-gradient-to-br from-pink-900/20 to-transparent">
                       <MonitorPlay className="text-pink-400 w-10 h-10 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                       <div className="absolute -top-3 -right-3 w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white font-black text-sm border-2 border-[#0a0f18]">3</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">Uzman Onarım</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Cihaz laboratuvar ortamında incelenir, onayınızla garantili parçalarla tamir edilir.</p>
                 </div>
              </div>

               {/* Adım 4 */}
               <div className="relative group lg:mt-12">
                 <div className="absolute -inset-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-3xl opacity-0 group-hover:opacity-40 blur-xl transition duration-500"></div>
                 <div className="relative h-full bg-[#111620] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center group-hover:border-green-500/50 transition-all duration-300 group-hover:-translate-y-2 z-10 shadow-xl">
                    <div className="w-20 h-20 mb-8 rounded-2xl bg-[#1a202c] border border-green-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-all duration-500 relative bg-gradient-to-br from-green-900/20 to-transparent">
                       <CheckCircle2 className="text-green-400 w-10 h-10 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                       <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-sm border-2 border-[#0a0f18]">4</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Teslimat</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Testleri geçen cihazınız sterilize edilir ve kargoya verilir. Size keyfini sürmek kalır.</p>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- AURA STORE VİTRİNİ --- */}
      <section className="py-28 relative overflow-hidden bg-[#050810]">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2"><ShoppingBag size={20} className="text-pink-400"/> <span className="text-pink-400 font-bold tracking-widest text-xs uppercase drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">Aura Store</span></div>
                    <h2 className="text-4xl font-black text-white drop-shadow-lg">Mağaza Vitrini</h2>
                </div>
                <Link href="/magaza" className="px-6 py-3 bg-[#1e1b4b]/50 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all flex items-center gap-2 backdrop-blur-md hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">Tüm Ürünleri Gör <ChevronRight size={16}/></Link>
            </div>

            {/* ÜRÜN LİSTESİ */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vitrinUrunleri.length > 0 ? vitrinUrunleri.map((product, i) => {
                        const displayTitle = product.name;
                        const displayPrice = product.price ? Number(product.price).toLocaleString('tr-TR') + ' ₺' : "Fiyat Sorunuz";
                        let rawImage = product.image || "";
                        const hasImage = rawImage && rawImage.length > 5;
                        const productSlug = slugify(displayTitle); 
                        const fallbackGradient = getRandomGradient(i);

                        return (
                          <Link href={`/magaza/${productSlug}`} key={i} className="group relative rounded-2xl block h-full cursor-pointer hover:-translate-y-2 transition-transform duration-500">
                              <div className={`absolute -inset-[1px] bg-gradient-to-b from-indigo-500 to-purple-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500 group-hover:blur-md`}></div>
                              <div className="relative bg-[#11151d] rounded-2xl overflow-hidden h-full flex flex-col border border-white/5 group-hover:border-white/10 transition-colors">
                                  {/* --- RESİM ALANI --- */}
                                  <div className={`h-56 w-full relative flex items-center justify-center border-b border-white/5 overflow-hidden bg-[#161b25]`}>
                                      
                                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg z-20">Fırsat</span>
                                      
                                      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${fallbackGradient} group-hover:scale-110 transition-transform duration-700 z-0`}>
                                         <Package size={48} className="text-white/40 drop-shadow-md"/>
                                      </div>

                                      {hasImage && (
                                        <img 
                                          src={rawImage} 
                                          alt={displayTitle} 
                                          className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-110 transition-transform duration-700" 
                                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                      )}
                                  </div>

                                  <div className="p-6 flex-1 flex flex-col justify-between bg-[#11151d]">
                                      <h3 className="text-white font-bold mb-2 text-lg truncate" title={displayTitle}>{displayTitle}</h3>
                                      <div className="flex items-center justify-between mt-4">
                                          <span className="text-xl font-black text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">{displayPrice}</span>
                                          <button className="w-10 h-10 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]"><ShoppingBag size={16}/></button>
                                      </div>
                                  </div>
                              </div>
                          </Link>
                        );
                    }) : (
                        <div className="col-span-4 text-center text-slate-500 py-10">Henüz vitrin ürünü yok.</div>
                    )}
                </div>
            )}
        </div>
      </section>

      {/* WHATSAPP BUTONU */}
      <a href="https://wa.me/905396321469" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center" aria-label="WhatsApp Destek">
        <MessageCircle size={28} fill="white" className="text-white" />
        <span className="absolute right-full mr-3 bg-white text-black px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">Hızlı Destek</span>
      </a>
    </div>
  );
}