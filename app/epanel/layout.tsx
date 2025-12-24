"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { 
  LayoutDashboard, PackagePlus, LogOut, 
  Search, Calculator, StickyNote, Users, 
  CircuitBoard, Activity, Signal, Cpu, 
  Menu, Bell, ChevronRight, Smartphone, ClipboardList, Settings, Phone as PhoneIcon,
  Zap, X, ShieldCheck, ShoppingBag, Maximize2, Minimize2, User, Home, ChevronDown
} from "lucide-react";
import { getWorkshopFromStorage } from "@/utils/storage"; 

// --- GÖRSEL EFEKTLER (OPTİMİZE EDİLDİ) ---
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = "01XYZAURAPRO$#@";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);
    
    const draw = () => {
      ctx.fillStyle = "rgba(2, 6, 23, 0.1)"; // İz bırakma efekti
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0891b2"; // Cyan rengi
      ctx.font = fontSize + "px monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-20 opacity-[0.07] pointer-events-none" />;
};

export default function EPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // --- STATE ---
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState("System Check...");
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Araçlar & Modallar
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Veriler
  const [myNote, setMyNote] = useState("");
  const [calcDisplay, setCalcDisplay] = useState("");
  const [dolarKuru, setDolarKuru] = useState<number | null>(null);
  const [bekleyenSayisi, setBekleyenSayisi] = useState(0);
  const [basvuruSayisi, setBasvuruSayisi] = useState(0); // DİNAMİK BAŞVURU SAYISI
  const [ping, setPing] = useState(24);
  
  // Arama
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResultBox, setShowResultBox] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- INITIALIZE & AUTH ---
  useEffect(() => {
    const baslat = async () => {
      // 1. Auth Kontrol
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setAuthorized(true);
      const email = session.user.email || "";
      setUserEmail(email);

      // 2. Admin Kontrol
      const ADMIN_EMAILS = ["admin@aurabilisim.com", "ozgurbasar5@gmail.com", "patron@aura.com"]; 
      const { data: personelData } = await supabase.from('personel_izinleri').select('yetkiler').eq('email', email).single();
      const dbYetkiler = personelData?.yetkiler || [];
      setIsAdmin(ADMIN_EMAILS.includes(email) || dbYetkiler.includes('Yönetim (Admin)'));
      
      // 3. Veri Yükleme
      loadDashboardData();

      // 4. Döviz Kuru
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY');
        const data = await res.json();
        setDolarKuru(data.rates.TRY);
      } catch { setDolarKuru(35.85); }

      // 5. Notlar
      const savedNote = localStorage.getItem("teknisyen_notu");
      if (savedNote) setMyNote(savedNote);
      
      // 6. Ping Simülasyonu
      setInterval(() => setPing(Math.floor(Math.random() * (45 - 15 + 1) + 15)), 2000);
    };

    baslat();

    // Klavye Kısayolları Listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowResultBox(false);
        setShowCalc(false);
        setShowNotes(false);
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);

  }, [router]);

  // --- LOCALSTORAGE LISTENER (CANLI BİLDİRİM İÇİN) ---
  useEffect(() => {
    const checkCounts = () => {
        // Atölye Bekleyen
        const allData = getWorkshopFromStorage();
        const waitingCount = allData.filter((x:any) => x.status === 'Bekliyor').length;
        setBekleyenSayisi(waitingCount);

        // Online Başvurular (DİNAMİK)
        const formApplications = JSON.parse(localStorage.getItem("aura_online_forms") || "[]");
        // İstersen sadece "okunmamış" olanları sayabilirsin, şimdilik toplam sayıyı alıyoruz
        setBasvuruSayisi(formApplications.length);
    };

    checkCounts(); // İlk açılışta kontrol et
    
    // Storage değişince tetikle
    window.addEventListener("storage", checkCounts);
    // Manuel event tetikleyicisi (uygulama içi güncellemeler için)
    window.addEventListener("local-storage-update", checkCounts);

    return () => {
        window.removeEventListener("storage", checkCounts);
        window.removeEventListener("local-storage-update", checkCounts);
    };
  }, []);

  const loadDashboardData = () => {
     // Manuel veri yenileme fonksiyonu gerekirse buraya
  };

  // --- ARAÇLAR ---
  const saveNote = (val: string) => { setMyNote(val); localStorage.setItem("teknisyen_notu", val); };
  
  const handleCalc = (val: string) => {
    if (val === 'C') setCalcDisplay("");
    else if (val === '=') { try { setCalcDisplay(eval(calcDisplay).toString()); } catch { setCalcDisplay("ERR"); } } 
    else setCalcDisplay(calcDisplay + val);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }
  };

  // --- ARAMA MOTORU ---
  const handleGlobalSearch = (e: any) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length < 2) {
        setSearchResults([]);
        setShowResultBox(false);
        return;
    }

    const allJobs = getWorkshopFromStorage();
    const lowerTerm = term.toLowerCase();
    const cleanSearchPhone = term.replace(/\D/g, ''); 

    const results = allJobs.filter((job: any) => {
        const jobPhoneClean = job.phone.replace(/\D/g, '');
        return (
            job.id.toString().includes(term) ||
            job.customer.toLowerCase().includes(lowerTerm) ||
            job.device.toLowerCase().includes(lowerTerm) ||
            (job.serialNo && job.serialNo.toLowerCase().includes(lowerTerm)) ||
            (cleanSearchPhone.length > 3 && jobPhoneClean.includes(cleanSearchPhone))
        );
    });

    setSearchResults(results.slice(0, 5));
    setShowResultBox(true);
  };

  const goToResult = (id: number) => {
      router.push(`/epanel/atolye/${id}`);
      setShowResultBox(false);
      setSearchTerm("");
  };

  const cikisYap = async () => { await supabase.auth.signOut(); router.push("/login"); };

  if (!authorized) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#020617] to-[#020617]"></div>
        <CircuitBoard size={64} className="text-cyan-500 animate-pulse mb-6"/>
        <div className="font-mono text-cyan-500 tracking-[0.5em] text-sm animate-pulse">SYSTEM INITIALIZING...</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden relative font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      <MatrixRain />
      
      {/* BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow delay-1000"></div>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#0f172a]/80 backdrop-blur-xl border-r border-cyan-500/10 flex flex-col z-50 transition-all duration-300 shadow-[10px_0_40px_rgba(0,0,0,0.6)]`}>
        {/* LOGO AREA */}
        <div className="h-20 flex items-center justify-center border-b border-white/5 relative overflow-hidden group">
          <div className={`flex items-center gap-3 transition-all duration-300 ${isSidebarOpen ? 'scale-100' : 'scale-90'}`}>
             <div className="bg-gradient-to-br from-cyan-500 to-blue-700 p-2.5 rounded-xl shadow-lg border border-cyan-400/30 group-hover:shadow-cyan-500/20 transition-all">
                <CircuitBoard className="text-white" size={isSidebarOpen ? 22 : 24} />
             </div>
             {isSidebarOpen && (
                 <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                   <h1 className="text-2xl font-black text-white tracking-tighter leading-none italic">AURA<span className="text-cyan-400">PRO</span></h1>
                   <p className="text-[9px] text-cyan-600/80 font-bold tracking-[0.3em] uppercase mt-0.5">Command Center</p>
                 </div>
             )}
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-3 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Yönetim Paneli" href="/epanel" isOpen={isSidebarOpen} active={pathname === '/epanel'} />
            
            {isSidebarOpen && <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 mt-6 mb-2 flex items-center gap-2"><div className="h-[1px] bg-slate-800 flex-1"></div>OPERASYON</div>}
            
            <NavItem icon={<ClipboardList size={20}/>} label="Atölye Listesi" href="/epanel/atolye" isOpen={isSidebarOpen} active={pathname.includes('/atolye')} badge={bekleyenSayisi > 0 ? bekleyenSayisi : 0} badgeColor="bg-orange-500"/>
            
            {/* DİNAMİK BAŞVURU SAYISI BURADA */}
            <NavItem 
                icon={<Users size={20}/>} 
                label="Online Başvurular" 
                href="/epanel/basvurular" 
                isOpen={isSidebarOpen} 
                active={pathname.includes('/basvurular')} 
                badge={basvuruSayisi > 0 ? basvuruSayisi : 0} 
                badgeColor="bg-red-600 animate-pulse"
            />
            
            <NavItem icon={<ShoppingBag size={20}/>} label="Aura Store (Mağaza)" href="/epanel/magaza" isOpen={isSidebarOpen} active={pathname.includes('/magaza')} />
            
            <div className="my-2"></div>

            {/* HIZLI KAYIT BUTTON */}
            <Link href="/epanel/hizli-kayit" className={`flex items-center gap-4 p-3 rounded-xl font-bold text-sm transition-all group relative overflow-hidden ${pathname.includes('/hizli-kayit') ? 'text-black bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10'}`}>
                {isSidebarOpen && <div className="absolute left-0 top-0 h-full w-1 bg-cyan-700 transition-all"></div>}
                <div className="relative z-10">
                    <PackagePlus size={20} className={pathname.includes('/hizli-kayit') ? "animate-bounce" : ""}/>
                </div>
                {isSidebarOpen && <span className="relative z-10">Hızlı Kayıt Aç</span>}
            </Link>

            {/* ADMIN ONLY */}
            {isAdmin && (
                <>
                    {isSidebarOpen && <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 mt-6 mb-2 flex items-center gap-2"><div className="h-[1px] bg-slate-800 flex-1"></div>YÖNETİM</div>}
                    <NavItem icon={<Settings size={20}/>} label="Sistem Ayarları" href="/epanel/ayarlar" isOpen={isSidebarOpen} active={pathname.includes('/ayarlar')} />
                </>
            )}
        </nav>

        {/* USER PROFILE AREA */}
        <div className="p-4 border-t border-white/5 bg-[#020617]/50 relative">
           {showUserMenu && isSidebarOpen && (
               <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 z-50">
                   <button className="w-full text-left px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 flex items-center gap-2"><User size={14}/> Profilim</button>
                   <button onClick={cikisYap} className="w-full text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-slate-700 flex items-center gap-2 border-t border-slate-700"><LogOut size={14}/> Güvenli Çıkış</button>
               </div>
           )}

           <button 
             onClick={() => isSidebarOpen ? setShowUserMenu(!showUserMenu) : null}
             className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${showUserMenu ? 'bg-white/10' : 'hover:bg-white/5'}`}
           >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-white font-black text-xs shadow-inner relative">
                    {userEmail.charAt(0).toUpperCase()}
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#020617] rounded-full"></span>
                </div>
                {isSidebarOpen && (
                    <div className="flex-1 text-left overflow-hidden">
                        <p className="text-white text-[11px] font-bold truncate">{userEmail.split('@')[0]}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            {isAdmin ? 
                                <span className="text-[9px] bg-yellow-500/20 text-yellow-500 px-1.5 rounded font-bold border border-yellow-500/20 flex items-center gap-1">ADMIN</span> 
                                : 
                                <span className="text-[9px] text-slate-500 font-bold">Teknisyen</span>
                            }
                        </div>
                    </div>
                )}
                {isSidebarOpen && <ChevronDown size={14} className={`text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}/>}
           </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* HEADER */}
        <header className="h-20 bg-[#020617]/80 backdrop-blur-md border-b border-cyan-500/10 flex items-center justify-between px-6 z-30 gap-6 shadow-sm">
           <div className="flex items-center gap-6 flex-1">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Menu size={20} />
              </button>
              
              {/* BREADCRUMB / SEARCH */}
              <div className="flex-1 max-w-2xl flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 border-r border-slate-800 pr-4">
                      <Home size={14}/>
                      <span>/</span>
                      <span className="text-slate-300 uppercase">{pathname.split('/')[2] || 'Dashboard'}</span>
                  </div>

                  <div className="relative group w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={16} />
                      <input 
                        ref={searchInputRef}
                        type="text" 
                        value={searchTerm} 
                        onChange={handleGlobalSearch} 
                        onKeyDown={(e) => e.key === 'Enter' && searchResults.length > 0 && goToResult(searchResults[0].id)}
                        placeholder="Global Arama... (CTRL+K)" 
                        className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-12 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all shadow-inner placeholder:text-slate-600" 
                      />
                      {/* Search Results Dropdown */}
                      {showResultBox && searchTerm.length >= 2 && (
                          <div className="absolute top-12 left-0 w-full bg-[#1e293b] border border-cyan-500/20 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/50">
                              <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-700 text-[10px] font-bold text-slate-400 uppercase flex justify-between">
                                  <span>SONUÇLAR</span><span>{searchResults.length} KAYIT</span>
                              </div>
                              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                  {searchResults.length === 0 ? (
                                      <div className="p-8 text-center">
                                          <Search size={32} className="mx-auto text-slate-700 mb-2"/>
                                          <p className="text-slate-400 font-bold text-sm">Sonuç Bulunamadı</p>
                                      </div>
                                  ) : (
                                      searchResults.map((result) => (
                                          <div key={result.id} onClick={() => goToResult(result.id)} className="p-3 hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-700/50 group/item">
                                              <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3">
                                                      <div className="h-9 w-9 bg-slate-800 text-cyan-500 rounded-lg flex items-center justify-center font-bold text-xs border border-slate-700">#{result.id}</div>
                                                      <div>
                                                          <div className="flex items-center gap-2">
                                                              <p className="text-white font-bold text-sm">{result.customer}</p>
                                                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${result.status === 'Hazır' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{result.status}</span>
                                                          </div>
                                                          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                                              <Smartphone size={10}/> {result.device} 
                                                          </p>
                                                      </div>
                                                  </div>
                                                  <ChevronRight size={16} className="text-slate-600 group-hover/item:text-cyan-500 transition-colors"/>
                                              </div>
                                          </div>
                                      ))
                                  )}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
           </div>

           {/* RIGHT TOOLS */}
           <div className="flex items-center gap-3">
              
              {/* USD/TRY INDICATOR */}
              <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-[#0f172a] rounded-xl border border-slate-800 mr-2 shadow-sm">
                  <div className="text-right leading-none">
                      <p className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">USD/TRY</p>
                      <p className="text-emerald-400 font-mono font-bold text-sm">{dolarKuru ? dolarKuru.toFixed(2) : "..."}₺</p>
                  </div>
              </div>

              {/* TOOLS BUTTONS */}
              <button onClick={() => setShowCalc(!showCalc)} className={`p-2.5 rounded-xl transition-all border ${showCalc ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(8,145,178,0.4)]' : 'bg-[#0f172a] text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'}`}>
                  <Calculator size={18}/>
              </button>
              
              <button onClick={() => setShowNotes(!showNotes)} className={`p-2.5 rounded-xl transition-all border ${showNotes ? 'bg-yellow-600 text-white border-yellow-400 shadow-[0_0_15px_rgba(202,138,4,0.4)]' : 'bg-[#0f172a] text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'}`}>
                  <StickyNote size={18}/>
              </button>
              
              {/* NOTIFICATION */}
              <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2.5 rounded-xl transition-all border relative ${showNotifications ? 'bg-slate-700 text-white border-slate-600' : 'bg-[#0f172a] text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'}`}
                  >
                      <Bell size={18}/>
                      {(bekleyenSayisi > 0 || basvuruSayisi > 0) && (
                          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#0f172a] animate-pulse"></span>
                      )}
                  </button>
                  {/* Notification Dropdown */}
                  {showNotifications && (
                      <div className="absolute top-12 right-0 w-80 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2">
                          <div className="bg-slate-900 p-3 border-b border-slate-800 text-xs font-bold text-white flex justify-between items-center">
                              BİLDİRİMLER
                              <button onClick={() => setShowNotifications(false)}><X size={14} className="text-slate-500 hover:text-white"/></button>
                          </div>
                          <div className="p-2 space-y-1">
                              {basvuruSayisi > 0 && (
                                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3">
                                      <div className="bg-red-500 p-2 rounded-full h-fit"><Users size={16} className="text-white"/></div>
                                      <div>
                                          <p className="text-red-400 font-bold text-xs">Yeni Başvuru!</p>
                                          <p className="text-slate-400 text-[10px] mt-0.5">{basvuruSayisi} adet yeni online başvuru bekliyor.</p>
                                      </div>
                                  </div>
                              )}
                              {bekleyenSayisi > 5 && (
                                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg flex gap-3">
                                      <div className="bg-orange-500 p-2 rounded-full h-fit"><Activity size={16} className="text-white"/></div>
                                      <div>
                                          <p className="text-orange-400 font-bold text-xs">Yoğunluk Uyarısı</p>
                                          <p className="text-slate-400 text-[10px] mt-0.5">Serviste bekleyen cihaz sayısı: {bekleyenSayisi}</p>
                                      </div>
                                  </div>
                              )}
                              {basvuruSayisi === 0 && bekleyenSayisi <= 5 && (
                                  <div className="p-4 text-center text-slate-500 text-xs">Yeni bildirim yok.</div>
                              )}
                          </div>
                      </div>
                  )}
              </div>

              {/* FULLSCREEN TOGGLE */}
              <button onClick={toggleFullscreen} className="hidden md:block p-2.5 text-slate-400 hover:text-white transition-colors">
                  {isFullscreen ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}
              </button>
           </div>
        </header>

        {/* --- POPUP TOOLS --- */}
        {showCalc && (
            <div className="absolute top-24 right-8 z-[60] bg-[#1e293b]/95 backdrop-blur-xl p-5 rounded-3xl border border-cyan-500/20 shadow-2xl w-72 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4"><span className="text-xs font-black text-cyan-500 uppercase flex items-center gap-2"><Calculator size={14}/> Hesap Makinesi</span><button onClick={() => setShowCalc(false)}><X size={16} className="text-slate-500 hover:text-white"/></button></div>
                <div className="bg-black/40 p-4 rounded-xl mb-4 text-right text-2xl font-mono text-cyan-400 border border-white/5 h-16 flex items-center justify-end shadow-inner">{calcDisplay || "0"}</div>
                <div className="grid grid-cols-4 gap-2">
                    {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map((btn) => (
                        <button key={btn} onClick={() => handleCalc(btn)} className={`p-3 rounded-lg font-bold transition-colors ${btn === '=' ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{btn}</button>
                    ))}
                </div>
            </div>
        )}
        
        {showNotes && (
            <div className="absolute top-24 right-20 z-[60] bg-[#1e293b]/95 backdrop-blur-xl p-5 rounded-3xl border border-yellow-500/20 shadow-2xl w-96 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4"><span className="text-xs font-black text-yellow-500 uppercase flex items-center gap-2"><StickyNote size={14}/> Hızlı Notlar</span><button onClick={() => setShowNotes(false)}><X size={16} className="text-slate-500 hover:text-white"/></button></div>
                <textarea value={myNote} onChange={(e) => saveNote(e.target.value)} className="w-full h-64 bg-black/40 border border-white/5 rounded-xl p-4 text-slate-200 focus:border-yellow-500/50 outline-none text-sm resize-none font-mono shadow-inner" placeholder="Buraya not al..."></textarea>
                <div className="mt-2 text-[10px] text-slate-500 text-right italic">Otomatik kaydediliyor...</div>
            </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {children}
        </main>
        
        {/* FOOTER */}
        <footer className="h-8 bg-[#020617] border-t border-white/5 flex items-center justify-between px-6 text-[10px] font-mono text-slate-500 select-none z-50">
            <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> SYSTEM: ONLINE</span>
                <span className="flex items-center gap-1.5"><Signal size={10}/> PING: {ping}ms</span>
                <span className="hidden sm:flex items-center gap-1.5"><Cpu size={10}/> MEM: OPTIMIZED</span>
            </div>
            <div className="opacity-50 hover:opacity-100 transition-opacity">AURA OS v5.8.0 | SECURE CONNECTION</div>
        </footer>
      </div>
    </div>
  );
}

// --- NAV ITEM COMPONENT (UPDATED) ---
function NavItem({ icon, label, href, isOpen, active, badge, badgeColor = "bg-red-500" }: any) {
    return (
        <Link href={href} className={`flex items-center gap-4 p-3 rounded-xl font-bold text-sm transition-all group relative overflow-hidden ${active ? 'text-white bg-white/5 border border-white/10 shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <div className={`absolute left-0 top-0 h-full w-1 ${active ? 'bg-cyan-500' : 'bg-transparent'} transition-all duration-300`}></div>
            <div className="relative">
                {icon}
                {badge > 0 && (
                    <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 ${badgeColor} rounded-full text-[9px] flex items-center justify-center text-white border border-[#0f172a] shadow-sm`}>
                        {badge}
                    </span>
                )}
            </div>
            {isOpen && <span className="animate-in fade-in slide-in-from-left-2 duration-200">{label}</span>}
        </Link>
    )
}