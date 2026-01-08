"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Search, ShoppingBag, Wrench, Menu, X, Home, Loader2 
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // --- ARAMA STATE'LERİ ---
  const [query, setQuery] = useState("");
  const [allJobs, setAllJobs] = useState<any[]>([]); // Tüm verileri burada tutacağız (Hafıza)
  const [results, setResults] = useState<any[]>([]); // Ekranda gösterilecek filtrelenmiş sonuçlar
  const [showResults, setShowResults] = useState(false);
  const [loadingData, setLoadingData] = useState(true); // İlk veri çekme durumu
  const searchRef = useRef<HTMLDivElement>(null); 

  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  // 1. SCROLL EFEKTİ
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. SAYFA YÜKLENİNCE VERİLERİ HAFIZAYA AL (Önbellekleme)
  useEffect(() => {
    async function fetchInitialData() {
      // Performans için son 200 kaydı çekiyoruz.
      // Eğer çok fazla kaydın varsa bu sayıyı artırabilir veya mantığı değiştirebiliriz.
      const { data, error } = await supabase
        .from('aura_jobs')
        .select('id, customer, device, tracking_code, status, imei, phone')
        .order('created_at', { ascending: false })
        .limit(200); 
      
      if (data) {
        setAllJobs(data);
      }
      setLoadingData(false);
    }
    fetchInitialData();
  }, []); 

  // 3. ANLIK ARAMA MANTIĞI (Javascript Filtreleme)
  useEffect(() => {
    // Arama kutusu boşsa veya 2 karakterden azsa sonuçları temizle
    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);

    const s = query.toLowerCase().trim(); // Aranan kelimeyi küçült
    const cleanSearch = s.replace(/[^a-z0-9]/g, ''); // Sadece harf ve rakamları bırak (SRV-123 -> srv123)

    // HAFIZADAKİ VERİYİ FİLTRELE
    const filtered = allJobs.filter(job => {
      // Veritabanı alanlarını güvenli stringe çevir ve küçült
      const customer = String(job.customer || "").toLowerCase();
      const device = String(job.device || "").toLowerCase();
      const tracking = String(job.tracking_code || "").toLowerCase();
      const imei = String(job.imei || "").toLowerCase();
      const phone = String(job.phone || "").toLowerCase();
      
      // Temizlenmiş takip kodu (SRV ve tireleri atar)
      const cleanTracking = tracking.replace(/[^a-z0-9]/g, '');

      // EŞLEŞME KONTROLÜ
      return (
        customer.includes(s) ||             // İsim içinde geçiyor mu?
        device.includes(s) ||               // Cihaz adında geçiyor mu?
        tracking.includes(s) ||             // Takip kodunda direkt geçiyor mu?
        imei.includes(s) ||                 // IMEI içinde geçiyor mu? (555 gibi)
        phone.includes(s) ||                // Telefon içinde geçiyor mu?
        cleanTracking.includes(cleanSearch) // "863" yazınca "SRV-863"ü bulsun diye
      );
    });

    setResults(filtered.slice(0, 6)); // Ekrana sığması için en alakalı 6 tanesini göster
  }, [query, allJobs]); // query veya veri değişince tekrar çalış

  // Dışarı tıklayınca kapat
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  // Enter'a basınca detaylı arama sayfasına git
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      setShowResults(false);
      router.push(`/cihaz-sorgula?q=${encodeURIComponent(query)}`);
    }
  };

  // Login vb sayfalarda Navbar'ı gizle
  if (pathname?.startsWith("/epanel") || pathname?.startsWith("/business") || pathname?.startsWith("/kurumsal") || pathname === "/login") {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out border-b ${
      scrolled 
        ? "bg-[#020617]/95 backdrop-blur-xl border-cyan-500/10 h-20 shadow-2xl" 
        : "bg-transparent border-transparent h-28"
    } print:hidden`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3.5 group select-none shrink-0" onClick={() => setMenuAcik(false)}>
            <div className={`relative flex items-center justify-center transition-all duration-500 ${scrolled ? "w-9 h-9" : "w-12 h-12"}`}>
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg relative z-10" fill="none">
                  <defs>
                    <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path d="M 50 12 L 22 40 L 22 52 L 12 52 L 12 35 L 45 2 Z" fill="#fff" className="opacity-95 group-hover:fill-cyan-50"/>
                  <path d="M 50 88 L 78 60 L 78 48 L 88 48 L 88 65 L 55 98 Z" fill="#fff" className="opacity-95 group-hover:fill-cyan-50"/>
                  <rect x="36" y="36" width="28" height="28" rx="3" transform="rotate(45 50 50)" fill="url(#navGradient)" className="group-hover:scale-105 transition-transform duration-300 origin-center outline outline-1 outline-white/20"/>
                </svg>
            </div>
            <div className="flex flex-col justify-center">
                <div className={`font-extrabold tracking-tight leading-none text-white flex items-center gap-1 group-hover:text-cyan-50 transition-all duration-500 ${scrolled ? "text-lg" : "text-2xl"}`}>AURA<span className="text-cyan-400">BİLİŞİM</span></div>
                <span className={`text-slate-400 font-bold tracking-[0.25em] uppercase group-hover:text-cyan-400/80 transition-all duration-500 ${scrolled ? "text-[8px]" : "text-[10px]"}`}>TEKNOLOJİ ÜSSÜ</span>
            </div>
          </Link>

          {/* MENÜ LİNKLERİ */}
          <div className="hidden xl:flex items-center gap-8">
             {[ { href: "/", label: "Ana Sayfa" }, { href: "/destek", label: "Destek" }, { href: "/hakkimizda", label: "Hakkımızda" }, { href: "/iletisim", label: "İletişim" } ].map((link) => (
                <Link key={link.href} href={link.href} className={`text-[14px] font-bold transition-all relative py-2 px-1 group ${isActive(link.href) ? "text-cyan-400" : "text-slate-300 hover:text-white"}`}>
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                </Link>
              ))}
          </div>

          {/* --- ARAMA ALANI (Z-INDEX 101 İLE EN ÜSTTE) --- */}
          <div className="flex items-center gap-4 shrink-0 relative z-[101]" ref={searchRef}>
              
              <div className="relative w-full max-w-md min-w-[300px] hidden md:block">
                  
                  {/* INPUT */}
                  <form 
                    onSubmit={handleSearchSubmit} 
                    className="relative flex items-center bg-[#0f172a] border border-slate-700 rounded-xl focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all z-20"
                  >
                      <div className="pl-4 text-slate-500">
                         {/* Veri yükleniyorsa loading ikonu göster */}
                         {loadingData ? <Loader2 size={18} className="animate-spin text-cyan-500"/> : <Search size={18} />}
                      </div>
                      <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setShowResults(true)}
                        placeholder="Cihaz Ara: Takip No, İsim..." 
                        className="w-full bg-transparent border-none outline-none py-3 px-3 text-sm text-slate-200 placeholder:text-slate-500 font-medium rounded-xl"
                        autoComplete="off"
                      />
                  </form>

                  {/* --- GOOGLE STYLE DROPDOWN --- */}
                  {showResults && (
                    <div className="absolute top-[115%] left-0 right-0 bg-[#1e293b] border border-slate-600 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden z-[50]">
                        {results.length > 0 ? (
                          <ul className="divide-y divide-slate-700/50">
                            <li className="px-4 py-2 bg-[#0f172a] text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                BULUNAN SONUÇLAR
                            </li>
                            
                            {results.map((item) => (
                              <li key={item.id}>
                                <Link 
                                  href={`/cihaz-sorgula?q=${item.tracking_code}`} 
                                  onClick={() => setShowResults(false)}
                                  className="block px-4 py-3 hover:bg-slate-700/50 transition-colors group cursor-pointer"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-xs border border-cyan-500/20">
                                        {/* İsim baş harfi kontrolü */}
                                        {(item.customer && item.customer[0]) ? item.customer[0].toUpperCase() : "?"}
                                      </div>
                                      <div>
                                        <div className="font-bold text-slate-200 text-sm group-hover:text-cyan-400 transition-colors">
                                          {item.customer}
                                        </div>
                                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                          <Wrench size={10} /> {item.device}
                                          {/* IMEI varsa son 4 hanesi */}
                                          {item.imei && <span className="text-slate-500">| IMEI: {item.imei.slice(-4)}</span>}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <span className="inline-block bg-cyan-950 text-cyan-400 text-[10px] font-mono font-bold px-2 py-1 rounded border border-cyan-500/20 shadow-sm">
                                        {item.tracking_code}
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          // Sonuç Yoksa
                          query.length >= 2 && (
                             <div className="p-6 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                               <Search size={24} className="text-slate-600 mb-1"/>
                               <span>"{query}" bulunamadı.</span>
                            </div>
                          )
                        )}
                    </div>
                  )}
              </div>
              
              {/* SAĞ TARAF BUTONLAR */}
              <Link href="/magaza" className="hidden lg:flex items-center gap-2 border border-slate-700/50 bg-[#0f172a] hover:bg-slate-800 text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs transition-all group">
                  <ShoppingBag size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors"/> 
                  <span>MAĞAZA</span>
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
        
        {/* MOBİL MENU */}
        {menuAcik && (
          <div className="xl:hidden fixed top-20 left-0 w-full bg-[#0b0e14] border-b border-white/10 p-6 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-2 z-50">
             {/* Linkler buraya gelecek */}
          </div>
        )}
      </nav>
  );
}