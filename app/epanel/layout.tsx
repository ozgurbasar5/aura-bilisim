"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { 
  LayoutDashboard, PackagePlus, LogOut, 
  Search, Calculator, StickyNote, Users, 
  CircuitBoard, Activity, Signal, Cpu, 
  Menu, Bell, ChevronRight, Smartphone, ClipboardList, Settings,
  Zap, X, ShoppingBag, Maximize2, Minimize2, User, Home, ChevronDown, Loader2,
  MessageSquare
} from "lucide-react";
import { getWorkshopFromStorage } from "@/utils/storage"; 

// MATRIX EFEKTİ
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
      ctx.fillStyle = "rgba(2, 6, 23, 0.1)"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0891b2"; 
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
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-20 opacity-[0.07] pointer-events-none print:hidden" />;
};

export default function EPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [authorized, setAuthorized] = useState(false); // Başlangıçta yetkisiz
  const [loadingCheck, setLoadingCheck] = useState(true); // Kontrol ediliyor mu?
  const [userEmail, setUserEmail] = useState("Sistem...");
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [myNote, setMyNote] = useState("");
  const [calcDisplay, setCalcDisplay] = useState("");
  const [dolarKuru, setDolarKuru] = useState<number | null>(null);
  
  // SAYAÇLAR
  const [bekleyenSayisi, setBekleyenSayisi] = useState(0);
  const [basvuruSayisi, setBasvuruSayisi] = useState(0);
  const [mesajSayisi, setMesajSayisi] = useState(0);
  
  const [ping, setPing] = useState(24);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResultBox, setShowResultBox] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- GÜVENLİK VE BAŞLANGIÇ KONTROLÜ ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Oturum yoksa Login'e fırlat (replace geçmişi siler, geri dönemez)
          router.replace("/login");
          return;
        }

        // Oturum varsa verileri yükle
        setUserEmail(session.user.email || "");
        
        const ADMIN_EMAILS = ["admin@aurabilisim.com", "ozgurbasar5@gmail.com", "patron@aura.com"]; 
        setIsAdmin(ADMIN_EMAILS.includes(session.user.email || ""));
        
        setAuthorized(true); // Kapıyı aç
        
        // Diğer verileri yükle
        checkCounts();
        fetchDolar();
        const savedNote = localStorage.getItem("teknisyen_notu");
        if (savedNote) setMyNote(savedNote);

      } catch (error) {
        router.replace("/login");
      } finally {
        setLoadingCheck(false);
      }
    };

    checkAuth();

    // Ping Simülasyonu
    const pingInterval = setInterval(() => setPing(Math.floor(Math.random() * (45 - 15 + 1) + 15)), 2000);
    return () => clearInterval(pingInterval);
  }, [router]);

  // Klavye Kısayolları
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === 'Escape') { setShowResultBox(false); setShowCalc(false); setShowNotes(false); setShowNotifications(false); setShowUserMenu(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchDolar = async () => {
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY');
      const data = await res.json();
      setDolarKuru(data.rates.TRY);
    } catch { setDolarKuru(35.95); }
  };

  const checkCounts = async () => {
      const localData = getWorkshopFromStorage();
      const localWaiting = localData.filter((x:any) => x.status === 'Bekliyor').length;
      const { count: dbCount } = await supabase.from('aura_jobs').select('*', { count: 'exact', head: true }).eq('status', 'Bekliyor').neq('category', 'Destek Talebi');
      setBekleyenSayisi(localWaiting + (dbCount || 0));
      
      const { count: formCount } = await supabase.from('aura_online_forms').select('*', { count: 'exact', head: true }).eq('status', 'Okunmadı');
      setBasvuruSayisi(formCount || 0);

      const { count: msgCount } = await supabase.from('aura_jobs').select('*', { count: 'exact', head: true }).eq('category', 'Destek Talebi').neq('status', 'Tamamlandı');
      setMesajSayisi(msgCount || 0);
  };

  const handleGlobalSearch = async (e: any) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length < 2) { setSearchResults([]); setShowResultBox(false); return; }
    setIsSearching(true); setShowResultBox(true);

    const localJobs = getWorkshopFromStorage();
    const filteredLocal = localJobs.filter((j: any) => 
        j.customer.toLowerCase().includes(term.toLowerCase()) || 
        j.id.toString().includes(term) ||
        (j.serialNo && j.serialNo.toLowerCase().includes(term.toLowerCase()))
    ).map((j: any) => ({ ...j, source: 'local' }));

    const { data: dbJobs } = await supabase.from('aura_jobs')
        .select('id, customer, device, status, serial_no')
        .or(`customer.ilike.%${term}%,device.ilike.%${term}%,phone.ilike.%${term}%,serial_no.ilike.%${term}%`)
        .limit(5);
    const mappedDb = (dbJobs || []).map((j: any) => ({ ...j, source: 'db' }));

    setSearchResults([...filteredLocal, ...mappedDb].slice(0, 8));
    setIsSearching(false);
  };

  const goToResult = (id: number) => { router.push(`/epanel/atolye/${id}`); setShowResultBox(false); setSearchTerm(""); };
  
  const cikisYap = async () => { 
    await supabase.auth.signOut(); 
    router.replace("/login"); // Push yerine Replace
  };
  
  const saveNote = (val: string) => { setMyNote(val); localStorage.setItem("teknisyen_notu", val); };
  const handleCalc = (val: string) => { if (val === 'C') setCalcDisplay(""); else if (val === '=') { try { setCalcDisplay(eval(calcDisplay).toString()); } catch { setCalcDisplay("ERR"); } } else setCalcDisplay(calcDisplay + val); };

  // --- GÜVENLİK DUVARI ---
  // Kontrol bitene kadar veya yetkisizse içerik gösterme
  if (loadingCheck || !authorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-cyan-500 font-mono gap-4">
        <Loader2 className="animate-spin w-10 h-10" />
        <span className="animate-pulse tracking-widest text-xs">AURA GÜVENLİK KONTROLÜ...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden relative font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      <MatrixRain />
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#0f172a]/80 backdrop-blur-xl border-r border-cyan-500/10 flex flex-col z-50 transition-all duration-300 shadow-[10px_0_40px_rgba(0,0,0,0.6)] print:hidden`}>
        <div className="h-20 flex items-center justify-center border-b border-white/5 relative overflow-hidden group">
          <div className={`flex items-center gap-3 transition-all duration-300 ${isSidebarOpen ? 'scale-100' : 'scale-90'}`}>
             <div className="bg-gradient-to-br from-cyan-500 to-blue-700 p-2.5 rounded-xl shadow-lg border border-cyan-400/30">
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
        
        {/* NAVIGASYON LİNKLERİ */}
        <nav className="flex-1 p-3 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Genel Bakış" href="/epanel" isOpen={isSidebarOpen} active={pathname === '/epanel'} />
            
            <NavItem icon={<ClipboardList size={20}/>} label="Atölye Listesi" href="/epanel/atolye" isOpen={isSidebarOpen} active={pathname.includes('/atolye')} badge={bekleyenSayisi} badgeColor="bg-orange-500"/>
            
            <NavItem icon={<MessageSquare size={20}/>} label="Gelen Mesajlar" href="/epanel/destek" isOpen={isSidebarOpen} active={pathname.includes('/destek')} badge={mesajSayisi} badgeColor="bg-pink-500 animate-pulse"/>

            <NavItem icon={<Users size={20}/>} label="Online Başvurular" href="/epanel/basvurular" isOpen={isSidebarOpen} active={pathname.includes('/basvurular')} badge={basvuruSayisi} badgeColor="bg-red-600" />
            
            <NavItem icon={<ShoppingBag size={20}/>} label="Aura Store" href="/epanel/magaza" isOpen={isSidebarOpen} active={pathname.includes('/magaza')} />
            
            <div className="my-2 border-t border-white/5 pt-2"></div>
            
            <Link href="/epanel/hizli-kayit" className={`flex items-center gap-4 p-3 rounded-xl font-bold text-sm transition-all group relative overflow-hidden ${pathname.includes('/hizli-kayit') ? 'text-black bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10'}`}>
                <PackagePlus size={20} className={pathname.includes('/hizli-kayit') ? "animate-bounce" : ""}/>
                {isSidebarOpen && <span className="relative z-10">Hızlı Kayıt</span>}
            </Link>
            
            {isAdmin && <NavItem icon={<Settings size={20}/>} label="Sistem Ayarları" href="/epanel/ayarlar" isOpen={isSidebarOpen} active={pathname.includes('/ayarlar')} />}
        </nav>

        {/* ALT KULLANICI BİLGİSİ */}
        <div className="p-4 border-t border-white/5 bg-[#020617]/50 relative">
           <button onClick={() => isSidebarOpen && setShowUserMenu(!showUserMenu)} className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${showUserMenu ? 'bg-white/10' : 'hover:bg-white/5'}`}>
               <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-white font-black text-xs relative shadow-inner">
                   {userEmail.charAt(0).toUpperCase()}
                   <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#020617] rounded-full"></span>
               </div>
               {isSidebarOpen && <div className="flex-1 text-left overflow-hidden"><p className="text-white text-[11px] font-bold truncate">{userEmail.split('@')[0]}</p><p className="text-[9px] text-slate-500 font-bold uppercase">{isAdmin ? 'Admin' : 'Teknisyen'}</p></div>}
               {isSidebarOpen && <ChevronDown size={14} className="text-slate-500"/>}
           </button>
           {showUserMenu && isSidebarOpen && (
               <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                   <button onClick={cikisYap} className="w-full text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-slate-700"><LogOut size={14}/> GÜVENLİ ÇIKIŞ</button>
               </div>
           )}
        </div>
      </aside>

      {/* HEADER VE İÇERİK */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-20 bg-[#020617]/80 backdrop-blur-md border-b border-cyan-500/10 flex items-center justify-between px-6 z-30 gap-6 print:hidden">
           <div className="flex items-center gap-6 flex-1">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white transition-colors"><Menu size={20} /></button>
              
              {/* GLOBAL ARAMA */}
              <div className="relative group w-full max-w-2xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500" size={16} />
                  <input ref={searchInputRef} type="text" value={searchTerm} onChange={handleGlobalSearch} onKeyDown={(e) => e.key === 'Enter' && searchResults.length > 0 && goToResult(searchResults[0].id)} placeholder="Arama Yap (Takip No, İsim, IMEI)..." className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-2.5 pl-11 pr-12 text-sm text-white focus:border-cyan-500/50 outline-none shadow-inner" />
                  {showResultBox && (
                      <div className="absolute top-12 left-0 w-full bg-[#1e293b] border border-cyan-500/20 rounded-xl shadow-2xl z-[9999] overflow-hidden">
                          <div className="px-4 py-2 bg-slate-900 border-b border-slate-700 text-[10px] font-bold text-slate-400 uppercase flex justify-between"><span>SONUÇLAR</span><span>{searchResults.length} KAYIT</span></div>
                          <div className="max-h-[300px] overflow-y-auto bg-[#151a25]">
                              {isSearching ? <div className="p-8 text-center text-cyan-500 flex justify-center items-center gap-2 text-xs"><Loader2 className="animate-spin" size={16}/> ARANIYOR...</div> : 
                                searchResults.length === 0 ? <div className="p-8 text-center text-slate-500 text-xs font-bold font-mono">KAYIT BULUNAMADI</div> :
                                searchResults.map((result) => (
                                  <div key={`${result.source}-${result.id}`} onClick={() => goToResult(result.id)} className="p-3 hover:bg-slate-800 cursor-pointer border-b border-slate-700/50 flex items-center justify-between transition-colors">
                                      <div className="flex items-center gap-3">
                                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs border ${result.source === 'local' ? 'text-yellow-500 border-yellow-500/30' : 'text-cyan-500 border-cyan-500/20'}`}>#{result.id}</div>
                                          <div><p className="text-white font-bold text-sm tracking-tight">{result.customer}</p><p className="text-[10px] text-slate-500 font-mono uppercase italic">{result.device}</p></div>
                                      </div>
                                      <ChevronRight size={16} className="text-slate-600"/>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
           </div>
           
           {/* ARAÇLAR */}
           <div className="flex items-center gap-3">
              <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-[#0f172a] rounded-xl border border-slate-800 shadow-sm font-mono text-emerald-400 text-sm font-bold tracking-tighter">USD: {dolarKuru?.toFixed(2)}₺</div>
              <button onClick={() => setShowCalc(!showCalc)} className={`p-2.5 rounded-xl border transition-all ${showCalc ? 'bg-cyan-600 border-cyan-400' : 'bg-[#0f172a] border-slate-800'}`}><Calculator size={18}/></button>
              <button onClick={() => setShowNotes(!showNotes)} className={`p-2.5 rounded-xl border transition-all ${showNotes ? 'bg-yellow-600 border-yellow-400' : 'bg-[#0f172a] border-slate-800'}`}><StickyNote size={18}/></button>
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800 relative">
                  <Bell size={18}/>{(bekleyenSayisi > 0 || mesajSayisi > 0) && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
              </button>
           </div>
        </header>

        {/* WIDGETS */}
        {showCalc && (
            <div className="absolute top-24 right-8 z-[100] bg-[#1e293b]/95 backdrop-blur-xl p-5 rounded-3xl border border-cyan-500/20 shadow-2xl w-72 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4 font-mono text-[10px] text-cyan-500 font-black uppercase"><span>{'>'} HESAP MAKİNESİ</span><button onClick={() => setShowCalc(false)}><X size={16}/></button></div>
                <div className="bg-black/40 p-4 rounded-xl mb-4 text-right text-2xl font-mono text-cyan-400 border border-white/5 h-16 flex items-center justify-end shadow-inner">{calcDisplay || "0"}</div>
                <div className="grid grid-cols-4 gap-2">{['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map((btn) => (<button key={btn} onClick={() => handleCalc(btn)} className={`p-3 rounded-lg font-bold transition-colors ${btn === '=' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{btn}</button>))}</div>
            </div>
        )}
        {showNotes && (
            <div className="absolute top-24 right-20 z-[100] bg-[#1e293b]/95 backdrop-blur-xl p-5 rounded-3xl border border-yellow-500/20 shadow-2xl w-96 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4 font-mono text-[10px] text-yellow-500 font-black uppercase"><span>{'>'} NOTLAR</span><button onClick={() => setShowNotes(false)}><X size={16}/></button></div>
                <textarea value={myNote} onChange={(e) => saveNote(e.target.value)} className="w-full h-64 bg-black/40 border border-white/5 rounded-xl p-4 text-slate-200 focus:border-yellow-500/50 outline-none text-sm font-mono shadow-inner resize-none custom-scrollbar" placeholder="Not al..."></textarea>
            </div>
        )}
        
        {/* BİLDİRİMLER */}
        {showNotifications && (
            <div className="absolute top-20 right-20 z-[100] w-80 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
                <div className="bg-slate-900 p-3 border-b border-slate-800 text-xs font-bold text-white flex justify-between items-center">BİLDİRİMLER<button onClick={() => setShowNotifications(false)}><X size={14}/></button></div>
                <div className="p-2 space-y-1">
                    {mesajSayisi > 0 && <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg flex gap-3"><div className="bg-pink-500 p-2 rounded-full h-fit"><MessageSquare size={16} className="text-white"/></div><div><p className="text-pink-400 font-bold text-xs">Yeni Mesaj!</p><p className="text-slate-400 text-[10px] mt-0.5">{mesajSayisi} adet okunmamış destek talebi.</p></div></div>}
                    {basvuruSayisi > 0 && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3"><div className="bg-red-500 p-2 rounded-full h-fit"><Users size={16} className="text-white"/></div><div><p className="text-red-400 font-bold text-xs">Yeni Başvuru!</p><p className="text-slate-400 text-[10px] mt-0.5">{basvuruSayisi} adet yeni online başvuru bekliyor.</p></div></div>}
                    {bekleyenSayisi > 5 && <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg flex gap-3"><div className="bg-orange-500 p-2 rounded-full h-fit"><Activity size={16} className="text-white"/></div><div><p className="text-orange-400 font-bold text-xs">Yoğunluk Uyarısı</p><p className="text-slate-400 text-[10px] mt-0.5">Serviste bekleyen cihaz sayısı: {bekleyenSayisi}</p></div></div>}
                    {basvuruSayisi === 0 && bekleyenSayisi <= 5 && mesajSayisi === 0 && <div className="p-4 text-center text-xs text-slate-500">Bildirim yok</div>}
                </div>
            </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 custom-scrollbar">{children}</main>
        <footer className="h-8 bg-[#020617] border-t border-white/5 flex items-center justify-between px-6 text-[10px] font-mono text-slate-500 select-none z-50 print:hidden">
            <div className="flex gap-4"><span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> SYSTEM: ONLINE</span><span className="flex items-center gap-1.5"><Signal size={10}/> PING: {ping}ms</span></div>
            <div className="opacity-50">AURA PRO OS v5.9.1 | HIBRIT MOD</div>
        </footer>
      </div>
    </div>
  );
}

// NavItem Bileşeni
function NavItem({ icon, label, href, isOpen, active, badge, badgeColor = "bg-red-500" }: any) {
    return (
        <Link href={href} className={`flex items-center gap-4 p-3 rounded-xl font-bold text-sm transition-all group relative overflow-hidden ${active ? 'text-white bg-white/5 border border-white/10 shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <div className={`absolute left-0 top-0 h-full w-1 ${active ? 'bg-cyan-500' : 'bg-transparent'} transition-all duration-300`}></div>
            <div className="relative">{icon}{badge > 0 && <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 ${badgeColor} rounded-full text-[9px] flex items-center justify-center text-white border border-[#0f172a] shadow-sm`}>{badge}</span>}</div>
            {isOpen && <span className="animate-in fade-in slide-in-from-left-2 duration-200">{label}</span>}
        </Link>
    )
}