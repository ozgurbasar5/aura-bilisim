"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, ArrowRight, Users, Tag, ShieldCheck, 
  Smartphone, Zap, Laptop, ShoppingBag, 
  CheckCircle2, Package, ChevronRight, Activity, Trophy, 
  HeartPulse, MessageCircle, Send, Award, 
  Cpu, Layers, FileSearch, Microscope, CircuitBoard, Gem,
  Wrench, Menu, X, Home as HomeIcon, LifeBuoy, Info, HelpCircle, Phone,
  Instagram, Facebook, Twitter, MapPin
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
// DİKKAT: Supabase dosyan yoksa burası hata verebilir. 
// Eğer hata alırsan bu satırı ve aşağıdaki useEffect'i geçici olarak kapatabilirsin.
import { supabase } from "@/app/lib/supabase"; 

export default function Home() {
  const router = useRouter();
  const [takipNo, setTakipNo] = useState("");
  const [vitrinUrunleri, setVitrinUrunleri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navbar state
  const [menuAcik, setMenuAcik] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // Scroll takibi (Navbar şeffaflığı için)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Markalar listesi (Sonsuz döngü için çoğaltıldı)
  const brandsSource = ["APPLE", "SAMSUNG", "XIAOMI", "ROBOROCK", "DYSON", "HUAWEI", "OPPO", "MONSTER", "ASUS", "LENOVO"];
  const brands = [...brandsSource, ...brandsSource, ...brandsSource, ...brandsSource];

  // Vitrin Ürünlerini Çek (Supabase)
  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        // Eğer supabase ayarlı değilse hata vermesin diye try-catch içindeyiz
        if (!supabase) return; 

        let { data } = await supabase
          .from('urunler')
          .select('*')
          .or('stok_durumu.eq.Satışta,stok_durumu.eq.true') 
          .order('created_at', { ascending: false })
          .limit(4);

        if (data) {
           const mapped = data.map((item: any) => ({
             id: item.id,
             name: item.ad,
             price: item.fiyat,
             // Resim dizisi mi yoksa tek url mi kontrolü
             image: (item.images && item.images.length > 0) ? item.images[0] : item.resim_url,
             category: item.kategori,
             tag: "Fırsat" 
           }));
           setVitrinUrunleri(mapped);
        }
      } catch (e) {
        console.error("Veri çekme hatası (Supabase kurulu olmayabilir):", e);
      } finally {
        setLoading(false);
      }
    };
    fetchShowcase();
  }, []);

  const sorgula = (e: React.FormEvent) => {
    e.preventDefault();
    if (takipNo.trim().length > 0) {
        const code = takipNo.trim().toUpperCase().replace(/\s/g, '');
        router.push(`/cihaz-sorgula?takip=${code}`);
    }
  };

  // Ürün resmi yoksa arka plan için rastgele gradient
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
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? "bg-[#020617]/95 backdrop-blur-xl border-white/5 h-20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-[#020617] border-transparent h-24"} print:hidden`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group select-none shrink-0" onClick={() => setMenuAcik(false)}>
            <div className="relative w-11 h-11 flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                {/* LOGO SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <path d="M 50 12 L 22 40 L 22 52 L 12 52 L 12 35 L 45 2 Z" fill="#fff" className="opacity-95 group-hover:fill-cyan-50 transition-colors"/>
                  <path d="M 50 88 L 78 60 L 78 48 L 88 48 L 88 65 L 55 98 Z" fill="#fff" className="opacity-95 group-hover:fill-cyan-50 transition-colors"/>
                  <rect x="36" y="36" width="28" height="28" rx="3" transform="rotate(45 50 50)" fill="url(#coreGradient)" className="group-hover:scale-105 transition-transform duration-300 origin-center outline outline-1 outline-white/20"/>
                  <circle cx="50" cy="50" r="5" fill="url(#centerGlow)" className="animate-pulse-slow" />
                  <rect x="24" y="42" width="8" height="1.5" fill="url(#coreGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                  <rect x="24" y="46" width="5" height="1.5" fill="url(#coreGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                  <rect x="68" y="56.5" width="8" height="1.5" fill="url(#coreGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                  <rect x="71" y="52.5" width="5" height="1.5" fill="url(#coreGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                </svg>
            </div>
            <div className="flex flex-col justify-center">
                <div className="font-extrabold text-[22px] tracking-tight leading-none text-white flex items-center gap-1 group-hover:text-cyan-50 transition-colors">AURA<span className="text-cyan-400">BİLİŞİM</span></div>
                <span className="text-[9px] text-slate-400 font-bold tracking-[0.25em] uppercase group-hover:text-cyan-400/80 transition-colors">TEKNOLOJİ ÜSSÜ</span>
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
              {/* CİHAZ SORGULA BUTONU */}
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
        
        {/* MOBİL MENÜ */}
        {menuAcik && (
          <div className="xl:hidden fixed top-20 left-0 w-full bg-[#0b0e14] border-b border-white/10 p-6 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-2 z-50">
              {[ { href: "/", label: "Ana Sayfa", icon: HomeIcon }, { href: "/cihaz-sorgula", label: "Cihaz Sorgula", icon: Search }, { href: "/magaza", label: "Mağaza", icon: ShoppingBag } ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuAcik(false)} className="py-4 px-4 rounded-lg font-bold flex items-center gap-4 text-slate-400 hover:bg-white/5 hover:text-white">
                  <item.icon size={20}/> {item.label}
                </Link>
              ))}
          </div>
        )}
      </nav>

      {/* ARKA PLAN DEKORASYON */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-600/15 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse-slow"></div>

      {/* HERO SECTION */}
      <section className="relative pt-44 pb-20 z-10 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#0f172a]/80 border border-cyan-500/50 px-4 py-2 rounded-full text-cyan-300 mb-8 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span></span>
            <span className="font-bold tracking-widest uppercase text-[10px] md:text-xs">High-End Teknik Servis</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight drop-shadow-2xl">
            Teknolojiniz <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-500 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">Sınırların Ötesinde.</span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Sıradan bir işlem değil, <strong className="text-white">hassas kalibrasyon ve optimizasyon.</strong> <br className="hidden md:block"/>
            Roborock, iPhone ve Gaming PC donanımlarında <span className="text-cyan-400 font-bold">%99 başarı oranı</span>.
          </p>
          
          {/* SORGULAMA INPUT */}
          <div className="max-w-xl mx-auto relative group mb-20">
             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition duration-500 group-hover:duration-200 animate-tilt"></div>
             <form onSubmit={sorgula} className="relative bg-[#0a0e17] p-2 rounded-2xl flex items-center shadow-2xl border border-white/10 backdrop-blur-xl">
                <div className="pl-4 text-cyan-500"><Search size={22}/></div>
                <input type="text" placeholder="Cihaz Takip No (Örn: 83785)" className="w-full h-14 bg-transparent px-4 outline-none text-white placeholder:text-slate-500 font-medium text-lg" value={takipNo} onChange={(e) => setTakipNo(e.target.value)} />
                <button type="submit" className="h-14 px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] uppercase tracking-wide">Sorgula</button>
             </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
             {[{ val: "%100", label: "Müşteri Memnuniyeti", icon: Users, color: "text-cyan-400", shadow: "shadow-cyan-500/20", border: "border-cyan-500/30" }, { val: "Onaylı", label: "Orijinal Parça", icon: Tag, color: "text-purple-400", shadow: "shadow-purple-500/20", border: "border-purple-500/30" }, { val: "6 Ay", label: "Garanti Süresi", icon: ShieldCheck, color: "text-green-400", shadow: "shadow-green-500/20", border: "border-green-500/30" }, { val: "15K+", label: "Başarılı İşlem", icon: CheckCircle2, color: "text-yellow-400", shadow: "shadow-yellow-500/20", border: "border-yellow-500/30" }].map((stat, i) => (
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
            <div className="flex items-center gap-2"><Award className="w-5 h-5 text-cyan-500" /> <span>İstanbul'un <strong>En Prestijli</strong> Teknik Üssü</span></div>
            <div className="flex items-center gap-2"><Trophy size={18} className="text-yellow-500" /> <span>Global Servis Standartları</span></div>
            <div className="flex items-center gap-2"><HeartPulse size={18} className="text-red-500" /> <span><strong>10.000+</strong> Kusursuz Teslimat</span></div>
        </div>
      </div>

      {/* MARKALAR (Infinite Scroll) */}
      <section className="relative py-24 bg-[#010205] border-b border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-900/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 text-center mb-12">
            <span className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-2 block">Global Partners</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Hizmet Verilen <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Teknoloji Devleri</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">Dünyanın önde gelen teknoloji markalarının tüm modellerine laboratuvar standartlarında müdahale ediyoruz.</p>
            <Link href="/markalar" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all hover:scale-105 group">Tüm Marka Listesini İncele <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></Link>
        </div>
        <div className="relative w-full overflow-hidden group space-y-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#010205] to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#010205] to-transparent z-10"></div>
            {/* Sola Kayan Markalar */}
            <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
                {brands.map((brand, index) => (<div key={index} className="mx-8 text-4xl font-black text-slate-800 hover:text-cyan-500 transition-colors duration-300 cursor-default uppercase select-none whitespace-nowrap">{brand}</div>))}
            </div>
            {/* Sağa Kayan Markalar */}
             <div className="flex w-max animate-infinite-scroll-reverse hover:[animation-play-state:paused]">
                {brands.reverse().map((brand, index) => (<div key={index} className="mx-8 text-4xl font-black text-slate-800 hover:text-indigo-500 transition-colors duration-300 cursor-default uppercase select-none whitespace-nowrap">{brand}</div>))}
            </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section className="py-28 relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">Uzmanlık Alanlarımız</h2>
                <p className="text-slate-400 text-lg max-w-2xl font-light">Laboratuvarımızda uygulanan profesyonel müdahale süreçleri.</p>
            </div>
            
            <Link 
              href="/hizmetler" 
              className="hidden md:flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20 relative z-30"
            >
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
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Mobil Kalibrasyon</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">iPhone FaceID optimizasyonu, anakart mikron seviyesi onarım ve batarya verimlilik artırma işlemleri.</p>
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
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Otonom Sistemler</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">Roborock ve Dyson üniteleri için Lidar sensör kalibrasyonu, motor tork analizi ve anakart revizyonu.</p>
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
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Performans Bilgisayarları</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">Gaming laptop termal optimizasyon, BGA chipset onarımı ve veri yolu (Bus) analizi ile performans artışı.</p>
                        <div className="mt-auto w-full py-4 rounded-xl bg-slate-900/50 border border-green-900/50 text-center text-sm font-bold text-green-400 uppercase tracking-wider group-hover:bg-green-600 group-hover:text-white group-hover:border-green-500 transition-all group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] relative z-10">İNCELE</div>
                    </div>
                </div>
            </Link>
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
                        const displayPrice = product.price ? Number(product.price).toLocaleString('tr-TR') + ' ₺' : "Fiyat Sorunuz";
                        const fallbackGradient = getRandomGradient(i);

                        return (
                          <Link href={`/magaza/${product.id}`} key={i} className="group relative rounded-2xl block h-full cursor-pointer hover:-translate-y-2 transition-transform duration-500">
                              <div className={`absolute -inset-[1px] bg-gradient-to-b from-indigo-500 to-purple-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500 group-hover:blur-md`}></div>
                              <div className="relative bg-[#11151d] rounded-2xl overflow-hidden h-full flex flex-col border border-white/5 group-hover:border-white/10 transition-colors">
                                  {/* --- RESİM ALANI --- */}
                                  <div className={`h-56 w-full relative flex items-center justify-center border-b border-white/5 overflow-hidden bg-[#161b25]`}>
                                      
                                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg z-20">Fırsat</span>
                                      
                                      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${fallbackGradient} group-hover:scale-110 transition-transform duration-700 z-0`}>
                                         <Package size={48} className="text-white/40 drop-shadow-md"/>
                                      </div>

                                      {product.image && (
                                        <img 
                                          src={product.image} 
                                          alt={product.name} 
                                          className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-110 transition-transform duration-700" 
                                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                      )}
                                  </div>

                                  <div className="p-6 flex-1 flex flex-col justify-between bg-[#11151d]">
                                      <h3 className="text-white font-bold mb-2 text-lg truncate" title={product.name}>{product.name}</h3>
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

      {/* --- PREMIUM HAKKIMIZDA & DNA --- */}
      <section className="relative py-32 bg-[#020611] border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-900/10 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* SOL: METİN VE BUTONLAR */}
                <div className="space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <Gem size={14} />
                            Premium Teknoloji Üssü
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                            MÜKEMMELLİK BİR <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">TERCİHTİR.</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-4">
                            Sıradanlığı reddediyoruz. Aura Bilişim, sadece arızalı parçayı değiştiren bir dükkan değil; cihazınızın performansını fabrika standartlarının ötesine taşıyan bir <strong>mühendislik laboratuvarıdır.</strong>
                        </p>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Her vida sıkımında tork ayarı, her lehimde mikron hassasiyeti. Bu bizim imzamız.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/kurumsal" className="group relative px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all overflow-hidden flex items-center justify-center gap-3 border border-white/10 hover:border-white/20">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <FileSearch size={20} className="text-slate-400 group-hover:text-white transition-colors"/>
                            Hikayemiz & Vizyon
                        </Link>

                        <Link href="/dna" className="group relative px-8 py-4 bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-3">
                            <Cpu size={20} className="animate-pulse"/>
                            Teknik DNA & Mühendislik
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                        </Link>
                    </div>
                </div>

                {/* SAĞ: GÖRSEL KARTLAR */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 mt-8">
                        <div className="bg-[#0f1420] p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
                            <Microscope size={32} className="text-cyan-500 mb-4 group-hover:scale-110 transition-transform"/>
                            <h4 className="text-white font-bold mb-2">Mikro Analiz</h4>
                            <p className="text-xs text-slate-400">Gözle görülmeyen hasar tespiti.</p>
                        </div>
                        <div className="bg-[#0f1420] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                            <Layers size={32} className="text-purple-500 mb-4 group-hover:scale-110 transition-transform"/>
                            <h4 className="text-white font-bold mb-2">Donanım & Yazılım</h4>
                            <p className="text-xs text-slate-400">Tam entegrasyonlu çözüm.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-[#0f1420] p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-colors group">
                            <ShieldCheck size={32} className="text-green-500 mb-4 group-hover:scale-110 transition-transform"/>
                            <h4 className="text-white font-bold mb-2">Aura Güvencesi</h4>
                            <p className="text-xs text-slate-400">Yapılan her işleme %100 garanti.</p>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 rounded-2xl border border-cyan-500/20 flex flex-col justify-center items-center text-center group hover:border-cyan-500/50 transition-colors">
                            <div className="mb-2 p-3 bg-cyan-500/10 rounded-full group-hover:bg-cyan-500/20 transition-colors">
                                <Award size={28} className="text-cyan-400"/>
                            </div>
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Yüksek Performans Merkezi</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* WHATSAPP BUTONU */}
      <a href="https://wa.me/905396321429" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center" aria-label="WhatsApp Destek">
        <MessageCircle size={28} fill="white" className="text-white" />
        <span className="absolute right-full mr-3 bg-white text-black px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">Hızlı Destek</span>
      </a>
    
    </div>
  );
}