"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import AyarlarModal from "@/components/AyarlarModal";
import AuraAI from "@/components/AuraAI"; 
import { 
  LayoutDashboard, PackagePlus, LogOut, 
  Search, Calculator, StickyNote, Users, 
  Activity, Signal, Menu, Bell, ChevronRight, 
  Smartphone, ClipboardList, Settings, X, 
  ShoppingBag, ChevronDown, Loader2, MessageSquare, 
  Package, ShieldCheck, Tag, CreditCard, Wallet, User,
  Cpu, Zap, HardDrive, Terminal
} from "lucide-react"; 
import { getWorkshopFromStorage } from "@/utils/storage"; 

// MATRIX EFEKTİ (Optimize Edilmiş Cyberpunk Atmosferi)
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = "01XYZAURAPRO$#@";
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(2, 6, 23, 0.05)"; // İz bırakma efekti için opaklık düşürüldü
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0e7490"; // Daha koyu cyan (Slate-Cyan karışımı)
      ctx.font = "bold " + fontSize + "px monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 50);

    return () => {
        clearInterval(interval);
        window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-20 opacity-[0.08] pointer-events-none print:hidden" />;
};

export default function EPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [authorized, setAuthorized] = useState(false); 
  const [loadingCheck, setLoadingCheck] = useState(true); 
  
  // KULLANICI STATE'LERİ
  const [userEmail, setUserEmail] = useState("Sistem...");
  const [currentUserFull, setCurrentUserFull] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Widget Durumları
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [myNote, setMyNote] = useState("");
  const [calcDisplay, setCalcDisplay] = useState("");
  const [dolarKuru, setDolarKuru] = useState<number | null>(null);
  
  // Sayaçlar & Ping
  const [bekleyenSayisi, setBekleyenSayisi] = useState(0);
  const [basvuruSayisi, setBasvuruSayisi] = useState(0);
  const [mesajSayisi, setMesajSayisi] = useState(0);
  const [ping, setPing] = useState(24);
  
  // Arama
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResultBox, setShowResultBox] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null); 

  // --- GÜVENLİK VE BAŞLANGIÇ ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.replace("/login"); return; }

        setUserEmail(session.user.email || "");
        const { data: profile } = await supabase.from('personel_izinleri').select('*').eq('email', session.user.email).single();
        const fullUser = { ...session.user, ...profile };
        setCurrentUserFull(fullUser);

        const ADMIN_EMAILS = ["admin@aurabilisim.com", "ozgurbasar5@gmail.com", "patron@aura.com"]; 
        setIsAdmin(profile?.rol === 'admin' || ADMIN_EMAILS.includes(session.user.email || ""));

        setAuthorized(true); 
        checkCounts();
        fetchDolar();
        const savedNote = localStorage.getItem("teknisyen_notu");
        if (savedNote) setMyNote(savedNote);

      } catch (error) { router.replace("/login"); } finally { setLoadingCheck(false); }
    };

    checkAuth();
    const pingInterval = setInterval(() => setPing(Math.floor(Math.random() * (45 - 15 + 1) + 15)), 2000);
    return () => clearInterval(pingInterval);
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === 'Escape') { setShowResultBox(false); setShowCalc(false); setShowNotes(false); setShowNotifications(false); setShowUserMenu(false); setIsSettingsOpen(false); }
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) { setShowResultBox(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => { window.removeEventListener('keydown', handleKeyDown); document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const fetchDolar = async () => {
    try { const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY'); const data = await res.json(); setDolarKuru(data.rates.TRY); } catch { setDolarKuru(35.95); }
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
    const { data: dbJobs } = await supabase.from('aura_jobs').select('id, customer, device, status, serial_no').or(`customer.ilike.%${term}%,device.ilike.%${term}%,phone.ilike.%${term}%,serial_no.ilike.%${term}%`).limit(5);
    const mappedJobs = (dbJobs || []).map((j: any) => ({ ...j, type: 'service' }));
    const { data: products } = await supabase.from('urunler').select('id, ad, fiyat, stok_durumu').ilike('ad', `%${term}%`).limit(5);
    const mappedProducts = (products || []).map((p: any) => ({ ...p, type: 'product' }));

    setSearchResults([...mappedJobs, ...mappedProducts]);
    setIsSearching(false);
  };

  const goToResult = (item: any) => { 
      if (item.type === 'service') router.push(`/epanel/atolye/${item.id}`);
      else router.push(`/epanel/magaza/${item.id}`);
      setShowResultBox(false); setSearchTerm(""); 
  };
  
  const cikisYap = async () => { await supabase.auth.signOut(); window.location.reload(); };
  const saveNote = (val: string) => { setMyNote(val); localStorage.setItem("teknisyen_notu", val); };
  const handleCalc = (val: string) => { if (val === 'C') setCalcDisplay(""); else if (val === '=') { try { setCalcDisplay(eval(calcDisplay).toString()); } catch { setCalcDisplay("ERR"); } } else setCalcDisplay(calcDisplay + val); };

  if (loadingCheck || !authorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-cyan-500 font-mono gap-4 relative overflow-hidden">
        <MatrixRain />
        <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
            <Cpu className="animate-spin-slow w-16 h-16 relative z-10" />
        </div>
        <div className="flex flex-col items-center">
             <span className="tracking-[0.5em] text-xs font-bold text-white">AURA OS</span>
             <span className="text-[10px] text-cyan-500/70 mt-1">SİSTEM YÜKLENİYOR...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden relative font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      <MatrixRain />
      <AuraAI />

      {/* --- SIDEBAR (SOL MENÜ) --- */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#0b0e14]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col z-50 transition-all duration-300 shadow-[10px_0_40px_rgba(0,0,0,0.5)] print:hidden relative`}>
        {/* Dekoratif Yan Çizgi (Neon) */}
        <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>

        {/* LOGO ALANI */}
        <div className="h-24 flex items-center justify-center border-b border-white/5 relative shrink-0">
          <Link href="/epanel" className={`flex items-center gap-3 transition-all duration-300 ${isSidebarOpen ? 'scale-100' : 'scale-90'}`}>
             
             {/* YENİ AURA LOGOSU (HEX CORE) */}
             <div className="relative w-11 h-11 group cursor-pointer">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-700 blur-md"></div>
                <div className="absolute inset-0 border border-cyan-500/30 rounded-xl rotate-45 bg-[#0b0e14] flex items-center justify-center z-10 shadow-lg group-hover:border-cyan-400/60 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan-400 fill-cyan-400/10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                {/* Ping Noktası */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-pulse z-20 border-2 border-[#0b0e14]"></div>
             </div>

             {isSidebarOpen && (
                 <div className="animate-in fade-in slide-in-from-left-2 duration-300 flex flex-col">
                    <h1 className="text-2xl font-black text-white tracking-tighter leading-none flex items-center">
                        AURA<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PRO</span>
                    </h1>
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-[2px] w-4 bg-cyan-600 rounded-full"></div>
                        <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">V7.0 OS</p>
                    </div>
                 </div>
             )}
          </Link>
        </div>
        
        {/* MENÜ LİNKLERİ */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
            {/* GRUP 1: ANA KOMUTA */}
            <NavGroup title="ANA KOMUTA" isOpen={isSidebarOpen} />
            <NavItem icon={<LayoutDashboard size={20}/>} label="Komuta Merkezi" href="/epanel" isOpen={isSidebarOpen} active={pathname === '/epanel'} />
            
            <div className="my-3 border-t border-white/5 mx-2"></div>
            
            {/* GRUP 2: TEKNİK BİRİM */}
            <NavGroup title="TEKNİK BİRİM" isOpen={isSidebarOpen} />
            <NavItem icon={<ClipboardList size={20}/>} label="Atölye Listesi" href="/epanel/atolye" isOpen={isSidebarOpen} active={pathname.includes('/atolye')} badge={bekleyenSayisi} badgeColor="bg-orange-500 text-black font-bold"/>
            <NavItem icon={<ShieldCheck size={20}/>} label="Ekspertiz İstasyonu" href="/epanel/ekspertiz" isOpen={isSidebarOpen} active={pathname.includes('/ekspertiz')} />
            <NavItem icon={<Zap size={20}/>} label="Hızlı Kayıt" href="/epanel/hizli-kayit" isOpen={isSidebarOpen} active={pathname.includes('/hizli-kayit')} />

            <div className="my-3 border-t border-white/5 mx-2"></div>

            {/* GRUP 3: DEPO & FİNANS */}
            <NavGroup title="DEPO & FİNANS" isOpen={isSidebarOpen} />
            <NavItem icon={<Package size={20}/>} label="Stok Yönetimi" href="/epanel/stok" isOpen={isSidebarOpen} active={pathname.includes('/stok')} />
            <NavItem icon={<ShoppingBag size={20}/>} label="Aura Store" href="/epanel/magaza" isOpen={isSidebarOpen} active={pathname.includes('/magaza')} />
            <NavItem icon={<CreditCard size={20}/>} label="Satış Yönetimi" href="/epanel/satis" isOpen={isSidebarOpen} active={pathname.includes('/satis')} />
            <NavItem icon={<Wallet size={20}/>} label="Finans & Kasa" href="/epanel/finans" isOpen={isSidebarOpen} active={pathname.includes('/finans')} highlight />

            <div className="my-3 border-t border-white/5 mx-2"></div>

            {/* GRUP 4: İLETİŞİM AĞI */}
            <NavGroup title="İLETİŞİM AĞI" isOpen={isSidebarOpen} />
            <NavItem icon={<MessageSquare size={20}/>} label="Destek Talepleri" href="/epanel/destek" isOpen={isSidebarOpen} active={pathname.includes('/destek')} badge={mesajSayisi} badgeColor="bg-pink-500 text-white animate-pulse"/>
            <NavItem icon={<Users size={20}/>} label="Online Başvurular" href="/epanel/basvurular" isOpen={isSidebarOpen} active={pathname.includes('/basvurular')} badge={basvuruSayisi} badgeColor="bg-red-600 text-white" />
            
            {isAdmin && (
              <>
                <div className="my-3 border-t border-white/5 mx-2"></div>
                <NavItem icon={<Terminal size={20}/>} label="Sistem Ayarları" href="/epanel/ayarlar" isOpen={isSidebarOpen} active={pathname.includes('/ayarlar')} />
              </>
            )}
        </nav>

        {/* ALT: KULLANICI KARTI */}
        <div className="p-4 border-t border-white/5 bg-[#050810] relative shrink-0">
           <button onClick={() => isSidebarOpen && setShowUserMenu(!showUserMenu)} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border border-transparent ${showUserMenu ? 'bg-white/5 border-white/10' : 'hover:bg-white/5 hover:border-white/5'}`}>
               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-xs relative shadow-inner shrink-0 overflow-hidden group">
                   {currentUserFull?.avatar_url ? (
                       <img src={currentUserFull.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                   ) : (
                       <span className="text-slate-400 group-hover:text-cyan-400 transition-colors">{userEmail.charAt(0).toUpperCase()}</span>
                   )}
                   <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#050810] rounded-full"></span>
               </div>
               {isSidebarOpen && (
                   <div className="flex-1 text-left overflow-hidden animate-in fade-in slide-in-from-left-2">
                       <p className="text-white text-xs font-bold truncate">{currentUserFull?.ad_soyad || userEmail.split('@')[0]}</p>
                       <p className="text-[9px] text-cyan-500 font-bold uppercase tracking-wider">{isAdmin ? 'ROOT ADMIN' : 'TEKNISYEN'}</p>
                   </div>
               )}
               {isSidebarOpen && <ChevronDown size={14} className={`text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}/>}
           </button>
           
           {/* POPUP MENU */}
           {showUserMenu && isSidebarOpen && (
               <div className="absolute bottom-full left-4 right-4 mb-3 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in">
                   <button onClick={() => { setIsSettingsOpen(true); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 flex items-center gap-2">
                       <User size={14} className="text-cyan-400"/> PROFİLİ DÜZENLE
                   </button>
                   <div className="h-[1px] bg-white/5 mx-2"></div>
                   <button onClick={cikisYap} className="w-full text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                       <LogOut size={14}/> SİSTEMİ KAPAT
                   </button>
               </div>
           )}
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* HEADER (KOKPİT PANELİ) */}
        <header className="h-20 bg-[#0b0e14]/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-30 gap-6 print:hidden shrink-0 relative">
           {/* Header Alt Çizgi Efekti */}
           <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

           <div className="flex items-center gap-6 flex-1">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20">
                  <Menu size={20} />
              </button>
              
              {/* GLOBAL ARAMA (HUD STİLİ) */}
              <div className="relative group w-full max-w-2xl" ref={searchContainerRef}>
                  <div className="absolute inset-0 bg-cyan-500/5 rounded-xl blur-sm group-focus-within:opacity-100 opacity-0 transition-opacity duration-500"></div>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                  <input 
                      ref={searchInputRef} 
                      type="text" 
                      value={searchTerm} 
                      onChange={handleGlobalSearch} 
                      onKeyDown={(e) => e.key === 'Enter' && searchResults.length > 0 && goToResult(searchResults[0])} 
                      placeholder="Veritabanında Ara (Cihaz, Stok, Müşteri)..." 
                      className="relative w-full bg-[#050810] border border-white/10 rounded-xl py-2.5 pl-11 pr-14 text-sm text-white focus:border-cyan-500/50 outline-none shadow-inner transition-all placeholder:text-slate-600 font-medium" 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                    <span className="text-[9px] bg-[#1e293b] text-slate-400 px-1.5 py-0.5 rounded border border-white/5 font-mono font-bold">CTRL</span>
                    <span className="text-[9px] bg-[#1e293b] text-slate-400 px-1.5 py-0.5 rounded border border-white/5 font-mono font-bold">K</span>
                  </div>
                  
                  {/* SEARCH RESULTS DROPDOWN */}
                  {showResultBox && (
                      <div className="absolute top-14 left-0 w-full bg-[#1e293b] border border-cyan-500/20 rounded-xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2">
                          <div className="px-4 py-2.5 bg-[#0f172a] border-b border-white/5 text-[10px] font-bold text-cyan-500 uppercase flex justify-between tracking-wider">
                              <span>ARAMA SONUÇLARI</span>
                              <span className="bg-cyan-900/30 px-2 rounded text-cyan-300">{searchResults.length}</span>
                          </div>
                          <div className="max-h-[350px] overflow-y-auto custom-scrollbar bg-[#0b0e14]">
                              {isSearching ? <div className="p-8 text-center text-cyan-400 flex justify-center items-center gap-3 text-xs font-mono"><Loader2 className="animate-spin" size={16}/> VERİ TARANIYOR...</div> : 
                                searchResults.length === 0 ? <div className="p-8 text-center text-slate-500 text-xs font-bold font-mono">EŞLEŞEN KAYIT BULUNAMADI</div> :
                                searchResults.map((result) => (
                                  <div key={`${result.type}-${result.id}`} onClick={() => goToResult(result)} className="p-3.5 hover:bg-white/5 cursor-pointer border-b border-white/5 flex items-center justify-between transition-colors group/item last:border-0">
                                      <div className="flex items-center gap-4">
                                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xs border ${result.type === 'service' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                              {result.type === 'service' ? <Smartphone size={18}/> : <Package size={18}/>}
                                          </div>
                                          <div>
                                              <p className="text-white font-bold text-sm tracking-tight flex items-center gap-2 group-hover/item:text-cyan-400 transition-colors">
                                                  {result.type === 'service' ? result.customer : result.ad}
                                                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase ${result.type === 'service' ? 'border-purple-500/30 text-purple-400' : 'border-green-500/30 text-green-400'}`}>{result.type === 'service' ? 'SERVİS' : 'STOK'}</span>
                                              </p>
                                              <p className="text-[10px] text-slate-500 font-mono uppercase mt-1 flex items-center gap-2">
                                                  {result.type === 'service' ? <><span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span> {result.device} - {result.status}</> : <><span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span> {result.fiyat} ₺ - {result.stok_durumu}</>}
                                              </p>
                                          </div>
                                      </div>
                                      <ChevronRight size={16} className="text-slate-700 group-hover/item:text-cyan-500 group-hover/item:translate-x-1 transition-all"/>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
           </div>
           
           {/* HEADER TOOLBAR */}
           <div className="flex items-center gap-3">
              <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-[#050810] rounded-lg border border-white/10 shadow-sm font-mono text-emerald-400 text-xs font-bold tracking-tight">
                  <span className="text-slate-500">USD/TRY</span> {dolarKuru?.toFixed(2)}
              </div>
              
              <div className="h-6 w-[1px] bg-white/10 mx-1 hidden md:block"></div>

              <button onClick={() => setShowCalc(!showCalc)} className={`p-2.5 rounded-xl border transition-all ${showCalc ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]' : 'bg-[#0f172a] border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}>
                  <Calculator size={18}/>
              </button>
              
              <button onClick={() => setShowNotes(!showNotes)} className={`p-2.5 rounded-xl border transition-all ${showNotes ? 'bg-yellow-600 border-yellow-400 text-white shadow-[0_0_15px_rgba(202,138,4,0.5)]' : 'bg-[#0f172a] border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}>
                  <StickyNote size={18}/>
              </button>
              
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl bg-[#0f172a] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 relative transition-all">
                  <Bell size={18}/>
                  {(bekleyenSayisi > 0 || mesajSayisi > 0) && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}
                  {(bekleyenSayisi > 0 || mesajSayisi > 0) && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
           </div>
        </header>

        {/* WIDGET POPUPS (Calculator, Notes, Notifications) - Kodları sadeleştirdim, mantık aynı */}
        {showCalc && (
            <div className="absolute top-24 right-8 z-[100] bg-[#1e293b]/95 backdrop-blur-xl p-5 rounded-3xl border border-cyan-500/20 shadow-2xl w-72 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4 font-mono text-[10px] text-cyan-500 font-black uppercase tracking-widest"><span>HESAP MAKİNESİ</span><button onClick={() => setShowCalc(false)}><X size={16}/></button></div>
                <div className="bg-black/40 p-4 rounded-xl mb-4 text-right text-2xl font-mono text-cyan-400 border border-white/5 h-16 flex items-center justify-end shadow-inner">{calcDisplay || "0"}</div>
                <div className="grid grid-cols-4 gap-2">{['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map((btn) => (<button key={btn} onClick={() => handleCalc(btn)} className={`p-3 rounded-lg font-bold transition-colors ${btn === '=' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{btn}</button>))}</div>
            </div>
        )}
        {showNotes && (
            <div className="absolute top-24 right-20 z-[100] bg-[#1e293b]/95 backdrop-blur-xl p-5 rounded-3xl border border-yellow-500/20 shadow-2xl w-96 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4 font-mono text-[10px] text-yellow-500 font-black uppercase tracking-widest"><span>HIZLI NOTLAR</span><button onClick={() => setShowNotes(false)}><X size={16}/></button></div>
                <textarea value={myNote} onChange={(e) => saveNote(e.target.value)} className="w-full h-64 bg-black/40 border border-white/5 rounded-xl p-4 text-slate-200 focus:border-yellow-500/50 outline-none text-sm font-mono shadow-inner resize-none custom-scrollbar" placeholder="Not al..."></textarea>
            </div>
        )}
        {showNotifications && (
            <div className="absolute top-20 right-20 z-[100] w-80 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
                <div className="bg-slate-900 p-3 border-b border-slate-800 text-xs font-bold text-white flex justify-between items-center">BİLDİRİMLER<button onClick={() => setShowNotifications(false)}><X size={14}/></button></div>
                <div className="p-2 space-y-1">
                    {mesajSayisi > 0 && <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg flex gap-3"><div className="bg-pink-500 p-2 rounded-full h-fit"><MessageSquare size={16} className="text-white"/></div><div><p className="text-pink-400 font-bold text-xs">Yeni Mesaj!</p><p className="text-slate-400 text-[10px] mt-0.5">{mesajSayisi} destek talebi.</p></div></div>}
                    {basvuruSayisi > 0 && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3"><div className="bg-red-500 p-2 rounded-full h-fit"><Users size={16} className="text-white"/></div><div><p className="text-red-400 font-bold text-xs">Yeni Başvuru!</p><p className="text-slate-400 text-[10px] mt-0.5">{basvuruSayisi} başvuru bekliyor.</p></div></div>}
                    {basvuruSayisi === 0 && mesajSayisi === 0 && <div className="p-6 text-center text-xs text-slate-600 font-mono">Tüm bildirimler okundu.</div>}
                </div>
            </div>
        )}

        {/* AYARLAR MODALI */}
        <AyarlarModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUserFull} onUpdate={() => window.location.reload()} />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10 custom-scrollbar">{children}</main>
        
        {/* FOOTER */}
        <footer className="h-8 bg-[#0b0e14] border-t border-white/5 flex items-center justify-between px-6 text-[9px] font-bold text-slate-600 select-none z-50 print:hidden shrink-0 uppercase tracking-wider">
            <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-emerald-500/80"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> SYSTEM: ONLINE</span>
                <span className="flex items-center gap-1.5 text-slate-500"><Signal size={10}/> {ping}ms</span>
            </div>
            <div className="flex items-center gap-2">
                <Activity size={10} className="text-cyan-600"/>
                <span>AURA PRO OS v7.0 | DEVELOPED BY OZGR</span>
            </div>
        </footer>
      </div>
    </div>
  );
}

// Yardımcı Bileşenler (Stilleri Güncellendi)
function NavGroup({ title, isOpen }: { title: string, isOpen: boolean }) {
    if (!isOpen) return <div className="h-4"></div>;
    return <div className="px-3 pb-2 pt-4 text-[9px] font-black text-slate-600 tracking-[0.15em] uppercase border-b border-transparent">{title}</div>
}

function NavItem({ icon, label, href, isOpen, active, badge, badgeColor = "bg-red-500", highlight }: any) {
    return (
        <Link 
            href={href} 
            title={!isOpen ? label : ""} 
            className={`flex items-center gap-3 p-2.5 rounded-xl font-bold text-sm transition-all group relative overflow-hidden 
                ${active ? 'text-white bg-gradient-to-r from-cyan-500/20 to-transparent border border-cyan-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'} 
                ${highlight ? 'text-cyan-400' : ''}`}
        >
            {active && <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>}
            
            <div className={`relative transition-transform group-hover:scale-110 duration-300 ${active ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-slate-500 group-hover:text-white'}`}>
                {icon}
                {badge > 0 && <span className={`absolute -top-2 -right-2 min-w-[16px] h-4 px-1 ${badgeColor} rounded-full text-[9px] flex items-center justify-center text-white border border-[#0f172a] shadow-sm z-10`}>{badge}</span>}
            </div>
            
            {isOpen && <span className={`animate-in fade-in slide-in-from-left-2 duration-200 ${active ? 'text-cyan-100' : ''}`}>{label}</span>}
        </Link>
    )
}