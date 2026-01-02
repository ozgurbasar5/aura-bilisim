"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import AyarlarModal from "@/components/AyarlarModal";
import AuraAI from "@/components/AuraAI"; // YENİ: Yapay Zeka Bileşeni
import { 
  LayoutDashboard, PackagePlus, LogOut, 
  Search, Calculator, StickyNote, Users, 
  CircuitBoard, Activity, Signal,
  Menu, Bell, ChevronRight, Smartphone, ClipboardList, Settings,
  X, ShoppingBag, ChevronDown, Loader2,
  MessageSquare, Package, ShieldCheck, Tag, CreditCard, Wallet, User
} from "lucide-react"; 
import { getWorkshopFromStorage } from "@/utils/storage"; 

// MATRIX EFEKTİ (Optimize Edildi & Geri Planda Çalışır)
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Canvas boyutlandırma
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas(); // İlk boyutlandırma

    // Pencere yeniden boyutlandırma olayını dinle
    window.addEventListener('resize', resizeCanvas);

    const chars = "01XYZAURAPRO$#@";
    const fontSize = 14;
    
    // Sütun sayısını ve düşen damlaları yeniden hesapla
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array(columns).fill(1);

    // Pencere boyutu değiştiğinde sütunları güncelle
    const handleResize = () => {
        resizeCanvas();
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1); // Damlaları sıfırla
    };
    window.addEventListener('resize', handleResize);

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

    return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('resize', resizeCanvas); // Temizlik
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-20 opacity-[0.05] pointer-events-none print:hidden" />;
};

export default function EPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [authorized, setAuthorized] = useState(false); 
  const [loadingCheck, setLoadingCheck] = useState(true); 
  
  // KULLANICI STATE'LERİ
  const [userEmail, setUserEmail] = useState("Sistem...");
  const [currentUserFull, setCurrentUserFull] = useState<any>(null); // Ayarlar için full veri
  const [isAdmin, setIsAdmin] = useState(false); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Ayarlar Modal Kontrolü
  
  // Widget Durumları
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [myNote, setMyNote] = useState("");
  const [calcDisplay, setCalcDisplay] = useState("");
  const [dolarKuru, setDolarKuru] = useState<number | null>(null);
  
  // Sayaçlar
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
        
        if (!session) {
          router.replace("/login");
          return;
        }

        setUserEmail(session.user.email || "");

        // Profil detaylarını çek (Avatar ve Rol için - Ayarlar Modalı için Gerekli)
        const { data: profile } = await supabase
            .from('personel_izinleri')
            .select('*')
            .eq('email', session.user.email)
            .single();
        
        // Full kullanıcı verisini set et
        const fullUser = { ...session.user, ...profile };
        setCurrentUserFull(fullUser);

        const ADMIN_EMAILS = ["admin@aurabilisim.com", "ozgurbasar5@gmail.com", "patron@aura.com"]; 
        // DB rolü veya email listesi kontrolü
        const adminCheck = profile?.rol === 'admin' || ADMIN_EMAILS.includes(session.user.email || "");
        setIsAdmin(adminCheck);

        setAuthorized(true); 
        
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
    const pingInterval = setInterval(() => setPing(Math.floor(Math.random() * (45 - 15 + 1) + 15)), 2000);
    return () => clearInterval(pingInterval);
  }, [router]);

  // Klavye Kısayolları
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

  // Global Arama
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
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-cyan-500 font-mono gap-4">
        <Loader2 className="animate-spin w-10 h-10" />
        <span className="animate-pulse tracking-widest text-xs">SİSTEM BAŞLATILIYOR...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden relative font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      <MatrixRain />
      
      {/* YENİ: Aura AI Modülü (Her Sayfada Sağ Altta) */}
      <AuraAI />

      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#0f172a]/90 backdrop-blur-2xl border-r border-cyan-500/10 flex flex-col z-50 transition-all duration-300 shadow-[5px_0_30px_rgba(0,0,0,0.5)] print:hidden`}>
        {/* LOGO ALANI */}
        <div className="h-20 flex items-center justify-center border-b border-white/5 relative overflow-hidden group shrink-0">
          <div className={`flex items-center gap-3 transition-all duration-300 ${isSidebarOpen ? 'scale-100' : 'scale-90'}`}>
             <div className="bg-gradient-to-br from-cyan-600 to-blue-800 p-2.5 rounded-xl shadow-lg border border-cyan-400/30 group-hover:animate-pulse">
                <CircuitBoard className="text-white" size={isSidebarOpen ? 22 : 24} />
             </div>
             {isSidebarOpen && (
                 <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                   <h1 className="text-2xl font-black text-white tracking-tighter leading-none italic">AURA<span className="text-cyan-400">PRO</span></h1>
                   <p className="text-[9px] text-cyan-600/80 font-bold tracking-[0.3em] uppercase mt-0.5">V7.0 AI SYSTEM</p>
                 </div>
             )}
          </div>
        </div>
        
        {/* MENÜ LİNKLERİ */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            {/* GRUP 1: MERKEZ */}
            <NavGroup title="MERKEZ" isOpen={isSidebarOpen} />
            <NavItem icon={<LayoutDashboard size={20}/>} label="Genel Bakış" href="/epanel" isOpen={isSidebarOpen} active={pathname === '/epanel'} />
            
            {/* GRUP 2: SERVİS & OPERASYON */}
            <div className="my-2"></div>
            <NavGroup title="SERVİS & OPERASYON" isOpen={isSidebarOpen} />
            <NavItem icon={<ClipboardList size={20}/>} label="Atölye Listesi" href="/epanel/atolye" isOpen={isSidebarOpen} active={pathname.includes('/atolye')} badge={bekleyenSayisi} badgeColor="bg-orange-500"/>
            <NavItem icon={<ShieldCheck size={20}/>} label="Ekspertiz İstasyonu" href="/epanel/ekspertiz" isOpen={isSidebarOpen} active={pathname.includes('/ekspertiz')} />
            <NavItem icon={<PackagePlus size={20}/>} label="Hızlı Kayıt" href="/epanel/hizli-kayit" isOpen={isSidebarOpen} active={pathname.includes('/hizli-kayit')} />

            {/* GRUP 3: TİCARİ & FİNANS */}
            <div className="my-2"></div>
            <NavGroup title="TİCARİ & FİNANS" isOpen={isSidebarOpen} />
            <NavItem icon={<Package size={20}/>} label="Stok Yönetimi" href="/epanel/stok" isOpen={isSidebarOpen} active={pathname.includes('/stok')} />
            <NavItem icon={<ShoppingBag size={20}/>} label="Aura Store" href="/epanel/magaza" isOpen={isSidebarOpen} active={pathname.includes('/magaza')} />
            <NavItem icon={<CreditCard size={20}/>} label="Satış Yönetimi" href="/epanel/satis" isOpen={isSidebarOpen} active={pathname.includes('/satis')} />
            <NavItem icon={<Wallet size={20}/>} label="Finans & Kasa" href="/epanel/finans" isOpen={isSidebarOpen} active={pathname.includes('/finans')} highlight />
            <NavItem icon={<Tag size={20}/>} label="Fırsat Ürünleri" href="/epanel/firsat-urunleri" isOpen={isSidebarOpen} active={pathname.includes('/firsat-urunleri')} />

            {/* GRUP 4: İLİŞKİLER */}
            <div className="my-2"></div>
            <NavGroup title="İLİŞKİLER" isOpen={isSidebarOpen} />
            <NavItem icon={<MessageSquare size={20}/>} label="Mesajlar" href="/epanel/destek" isOpen={isSidebarOpen} active={pathname.includes('/destek')} badge={mesajSayisi} badgeColor="bg-pink-500 animate-pulse"/>
            <NavItem icon={<Users size={20}/>} label="Online Başvurular" href="/epanel/basvurular" isOpen={isSidebarOpen} active={pathname.includes('/basvurular')} badge={basvuruSayisi} badgeColor="bg-red-600" />
            
            {isAdmin && (
              <>
                <div className="my-2 border-t border-white/5 pt-2"></div>
                <NavItem icon={<Settings size={20}/>} label="Sistem Ayarları" href="/epanel/ayarlar" isOpen={isSidebarOpen} active={pathname.includes('/ayarlar')} />
              </>
            )}
        </nav>

        {/* ALT: KULLANICI PROFİLİ VE POPUP */}
        <div className="p-4 border-t border-white/5 bg-[#020617]/50 relative shrink-0">
           <button onClick={() => isSidebarOpen && setShowUserMenu(!showUserMenu)} className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${showUserMenu ? 'bg-white/10' : 'hover:bg-white/5'}`}>
               <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-white font-black text-xs relative shadow-inner shrink-0 overflow-hidden">
                   {currentUserFull?.avatar_url ? (
                       <img src={currentUserFull.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                   ) : (
                       userEmail.charAt(0).toUpperCase()
                   )}
                   <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#020617] rounded-full"></span>
               </div>
               {isSidebarOpen && <div className="flex-1 text-left overflow-hidden animate-in fade-in slide-in-from-left-2"><p className="text-white text-[11px] font-bold truncate">{userEmail.split('@')[0]}</p><p className="text-[9px] text-slate-500 font-bold uppercase">{isAdmin ? 'Admin' : 'Teknisyen'}</p></div>}
               {isSidebarOpen && <ChevronDown size={14} className="text-slate-500"/>}
           </button>
           
           {/* PROFİL MENÜSÜ POPUP */}
           {showUserMenu && isSidebarOpen && (
               <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in">
                   {/* Ayarlar Butonu */}
                   <button 
                        onClick={() => { setIsSettingsOpen(true); setShowUserMenu(false); }} 
                        className="w-full text-left px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                   >
                       <User size={14} className="text-cyan-400"/> PROFİL AYARLARI
                   </button>
                   
                   {/* Çıkış Butonu */}
                   <button onClick={cikisYap} className="w-full text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-slate-700"><LogOut size={14}/> GÜVENLİ ÇIKIŞ</button>
               </div>
           )}
        </div>
      </aside>

      {/* --- ANA İÇERİK ALANI --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* HEADER */}
        <header className="h-20 bg-[#020617]/80 backdrop-blur-md border-b border-cyan-500/10 flex items-center justify-between px-6 z-30 gap-6 print:hidden shrink-0">
           <div className="flex items-center gap-6 flex-1">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"><Menu size={20} /></button>
              
              {/* GELİŞMİŞ ARAMA BAR */}
              <div className="relative group w-full max-w-2xl" ref={searchContainerRef}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={16} />
                  <input ref={searchInputRef} type="text" value={searchTerm} onChange={handleGlobalSearch} onKeyDown={(e) => e.key === 'Enter' && searchResults.length > 0 && goToResult(searchResults[0])} placeholder="Komut veya Arama (Müşteri, Cihaz, Stok)..." className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-2.5 pl-11 pr-12 text-sm text-white focus:border-cyan-500/50 outline-none shadow-inner transition-all focus:shadow-[0_0_20px_rgba(6,182,212,0.15)] placeholder:text-slate-600" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">CTRL</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">K</span>
                  </div>
                  
                  {/* SONUÇ KUTUSU */}
                  {showResultBox && (
                      <div className="absolute top-12 left-0 w-full bg-[#1e293b] border border-cyan-500/20 rounded-xl shadow-2xl z-[9999] overflow-hidden">
                          <div className="px-4 py-2 bg-slate-900 border-b border-slate-700 text-[10px] font-bold text-slate-400 uppercase flex justify-between"><span>SONUÇLAR</span><span>{searchResults.length} KAYIT</span></div>
                          <div className="max-h-[300px] overflow-y-auto bg-[#151a25]">
                              {isSearching ? <div className="p-8 text-center text-cyan-500 flex justify-center items-center gap-2 text-xs"><Loader2 className="animate-spin" size={16}/> SİSTEM TARANIYOR...</div> : 
                                searchResults.length === 0 ? <div className="p-8 text-center text-slate-500 text-xs font-bold font-mono">KAYIT YOK</div> :
                                searchResults.map((result) => (
                                  <div key={`${result.type}-${result.id}`} onClick={() => goToResult(result)} className="p-3 hover:bg-slate-800 cursor-pointer border-b border-slate-700/50 flex items-center justify-between transition-colors group/item">
                                      <div className="flex items-center gap-3">
                                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs border ${result.type === 'service' ? 'bg-purple-900/20 text-purple-400 border-purple-500/20' : 'bg-green-900/20 text-green-400 border-green-500/20'}`}>
                                              {result.type === 'service' ? <Smartphone size={16}/> : <Package size={16}/>}
                                          </div>
                                          <div>
                                              <p className="text-white font-bold text-sm tracking-tight flex items-center gap-2 group-hover/item:text-cyan-400 transition-colors">
                                                  {result.type === 'service' ? result.customer : result.ad}
                                                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${result.type === 'service' ? 'border-purple-500/30 text-purple-400' : 'border-green-500/30 text-green-400'}`}>{result.type === 'service' ? 'SERVİS' : 'MAĞAZA'}</span>
                                              </p>
                                              <p className="text-[10px] text-slate-500 font-mono uppercase italic mt-0.5">
                                                  {result.type === 'service' ? `${result.device} - ${result.status}` : `${result.fiyat} ₺ - ${result.stok_durumu}`}
                                              </p>
                                          </div>
                                      </div>
                                      <ChevronRight size={16} className="text-slate-600 group-hover/item:text-cyan-500 group-hover/item:translate-x-1 transition-all"/>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
           </div>
           
           {/* HEADER ARAÇLARI */}
           <div className="flex items-center gap-3">
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#0f172a] rounded-lg border border-slate-800 shadow-sm font-mono text-emerald-400 text-xs font-bold tracking-tighter">
                  <span className="text-slate-500">$</span> {dolarKuru?.toFixed(2)}
              </div>
              <button onClick={() => setShowCalc(!showCalc)} className={`p-2.5 rounded-xl border transition-all ${showCalc ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]' : 'bg-[#0f172a] border-slate-800 text-slate-400 hover:text-white'}`}><Calculator size={18}/></button>
              <button onClick={() => setShowNotes(!showNotes)} className={`p-2.5 rounded-xl border transition-all ${showNotes ? 'bg-yellow-600 border-yellow-400 text-white shadow-[0_0_15px_rgba(202,138,4,0.5)]' : 'bg-[#0f172a] border-slate-800 text-slate-400 hover:text-white'}`}><StickyNote size={18}/></button>
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800 text-slate-400 hover:text-white relative">
                  <Bell size={18}/>{(bekleyenSayisi > 0 || mesajSayisi > 0) && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
              </button>
           </div>
        </header>

        {/* --- WIDGET POPUPS --- */}
        {showCalc && (
            <div className="absolute top-24 right-8 z-[100] bg-[#1e293b]/95 backdrop-blur-xl p-5 rounded-3xl border border-cyan-500/20 shadow-2xl w-72 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4 font-mono text-[10px] text-cyan-500 font-black uppercase"><span>HESAP MAKİNESİ</span><button onClick={() => setShowCalc(false)}><X size={16}/></button></div>
                <div className="bg-black/40 p-4 rounded-xl mb-4 text-right text-2xl font-mono text-cyan-400 border border-white/5 h-16 flex items-center justify-end shadow-inner">{calcDisplay || "0"}</div>
                <div className="grid grid-cols-4 gap-2">{['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map((btn) => (<button key={btn} onClick={() => handleCalc(btn)} className={`p-3 rounded-lg font-bold transition-colors ${btn === '=' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{btn}</button>))}</div>
            </div>
        )}
        {showNotes && (
            <div className="absolute top-24 right-20 z-[100] bg-[#1e293b]/95 backdrop-blur-xl p-5 rounded-3xl border border-yellow-500/20 shadow-2xl w-96 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4 font-mono text-[10px] text-yellow-500 font-black uppercase"><span>HIZLI NOTLAR</span><button onClick={() => setShowNotes(false)}><X size={16}/></button></div>
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

        {/* --- AYARLAR MODALI --- */}
        <AyarlarModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            user={currentUserFull}
            onUpdate={() => window.location.reload()} 
        />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10 custom-scrollbar">{children}</main>
        
        {/* FOOTER */}
        <footer className="h-8 bg-[#020617] border-t border-white/5 flex items-center justify-between px-6 text-[10px] font-mono text-slate-600 select-none z-50 print:hidden shrink-0">
            <div className="flex gap-4"><span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> SYSTEM: ONLINE</span><span className="flex items-center gap-1.5"><Signal size={10}/> {ping}ms</span></div>
            <div className="opacity-50 hover:opacity-100 transition-opacity">AURA PRO OS v7.0 | DESIGNED BY OZGUR</div>
        </footer>
      </div>
    </div>
  );
}

// Yardımcı Bileşenler
function NavGroup({ title, isOpen }: { title: string, isOpen: boolean }) {
    if (!isOpen) return <div className="h-4"></div>;
    return <div className="px-3 pb-2 pt-4 text-[9px] font-black text-slate-600 tracking-widest uppercase">{title}</div>
}

function NavItem({ icon, label, href, isOpen, active, badge, badgeColor = "bg-red-500", highlight }: any) {
    return (
        <Link 
            href={href} 
            title={!isOpen ? label : ""} // Akıllı Tooltip: Sidebar kapalıyken üzerine gelince isim yazar
            className={`flex items-center gap-3 p-2.5 rounded-lg font-bold text-sm transition-all group relative overflow-hidden ${active ? 'text-white bg-gradient-to-r from-cyan-900/40 to-blue-900/20 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${highlight ? 'text-cyan-400' : ''}`}
        >
            {active && <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>}
            <div className={`relative ${active ? 'text-cyan-400' : ''}`}>{icon}{badge > 0 && <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 ${badgeColor} rounded-full text-[9px] flex items-center justify-center text-white border border-[#0f172a] shadow-sm`}>{badge}</span>}</div>
            {isOpen && <span className="animate-in fade-in slide-in-from-left-2 duration-200">{label}</span>}
        </Link>
    )
}