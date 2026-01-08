"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import AyarlarModal from "@/components/AyarlarModal";
import AuraAI from "@/components/AuraAI"; 

import { 
  LayoutDashboard, LogOut, Search, Calculator, StickyNote, Users, 
  Activity, Signal, Menu, Bell, ChevronDown, MessageSquare, 
  Package, ShieldCheck, CreditCard, Wallet, User,
  Zap, Terminal, ClipboardList, ShoppingBag, X, Code2, ChevronRight,
  Building2, Briefcase, Wrench, LifeBuoy, AlertTriangle, Clock, Check
} from "lucide-react";
import { getWorkshopFromStorage } from "@/utils/storage"; 

// --- 1. MATRIX EFEKTİ ---
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
      ctx.fillStyle = "rgba(2, 6, 23, 0.05)"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0891b2"; // Cyan-600
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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-20 opacity-[0.06] pointer-events-none print:hidden" />;
};

// --- 2. TERMINAL MODÜLÜ ---
const AuraTerminal = ({ isOpen, onClose, user }: any) => {
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState<string[]>([
        "AURA OS v7.0 Sistem Başlatıldı...",
        "Veritabanı bağlantısı: BAŞARILI",
        "Güvenlik protokolleri: AKTİF",
        `Kullanıcı: ${user || 'Misafir'}`,
        "Komut bekleniyor... (Yardım için 'help' yazın)"
    ]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

    const handleCommand = (e: any) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            const newLogs = [...logs, `> ${input}`];
            
            if (cmd === 'help') {
                newLogs.push("KOMUTLAR: clear, date, status, system, close");
            } else if (cmd === 'clear') {
                setLogs(["Ekran temizlendi."]);
                setInput("");
                return;
            } else if (cmd === 'date') {
                newLogs.push(`Tarih: ${new Date().toLocaleString('tr-TR')}`);
            } else if (cmd === 'status') {
                newLogs.push("SİSTEM DURUMU: %100 Çalışıyor. Ping: 24ms. Sunucu: Online.");
            } else if (cmd.startsWith('calc ')) {
                try {
                    const result = eval(cmd.replace('calc ', ''));
                    newLogs.push(`Sonuç: ${result}`);
                } catch {
                    newLogs.push("Hata: Geçersiz işlem.");
                }
            } else if (cmd === 'close') {
                onClose();
            } else {
                newLogs.push(`'${cmd}' komutu tanınamadı.`);
            }
            
            setLogs(newLogs);
            setInput("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#0c0c0c] border border-green-500/30 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden font-mono text-sm">
                <div className="bg-[#1a1a1a] px-4 py-2 border-b border-white/10 flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <span className="text-green-500 font-bold tracking-widest text-xs">AURA_TERMINAL_V7.exe</span>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={14}/></button>
                </div>
                <div className="h-80 p-4 overflow-y-auto text-green-400/90 space-y-1 custom-scrollbar">
                    {logs.map((log, i) => (
                        <div key={i} className="break-all">{log}</div>
                    ))}
                    <div ref={bottomRef}></div>
                </div>
                <div className="p-3 border-t border-white/10 bg-[#111] flex items-center gap-2">
                    <span className="text-green-500 font-bold">{`admin@aura:~$`}</span>
                    <input 
                        autoFocus
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        className="flex-1 bg-transparent outline-none text-white caret-green-500"
                    />
                </div>
            </div>
        </div>
    )
}

// --- YARDIMCI BİLEŞENLER ---
function NavGroup({ title, isOpen }: { title: string, isOpen: boolean }) {
    if (!isOpen) return <div className="h-4"></div>;
    return <div className="px-3 pb-2 pt-4 text-[9px] font-black text-slate-500 tracking-[0.15em] uppercase border-b border-transparent">{title}</div>
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

// --- ANA LAYOUT ---
export default function EPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [authorized, setAuthorized] = useState(false); 
  const [loadingCheck, setLoadingCheck] = useState(true); 
  const [userEmail, setUserEmail] = useState("Sistem...");
  const [currentUserFull, setCurrentUserFull] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const [dolarKuru, setDolarKuru] = useState<number | null>(null);
  const [bekleyenSayisi, setBekleyenSayisi] = useState(0);
  const [basvuruSayisi, setBasvuruSayisi] = useState(0);
  
  // Bildirim ve Mesaj Sayaçları
  const [webMesajSayisi, setWebMesajSayisi] = useState(0); 
  const [bayiMesajSayisi, setBayiMesajSayisi] = useState(0); 
  
  // %100 ENTEGRE BİLDİRİM SİSTEMİ STATE'LERİ
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const [ping, setPing] = useState(24);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResultBox, setShowResultBox] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null); 
  
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [myNote, setMyNote] = useState("");
  const [calcDisplay, setCalcDisplay] = useState("");

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
        checkCounts(); // Global Sayaçlar
        checkNotifications(); // %100 Entegre Bildirimler
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') { e.preventDefault(); setShowTerminal(prev => !prev); }
      if (e.key === 'Escape') { 
          setShowResultBox(false); setShowCalc(false); setShowNotes(false); 
          setIsNotifOpen(false); setShowUserMenu(false); setIsSettingsOpen(false); 
          setShowTerminal(false);
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) { setShowResultBox(false); }
        if (notifRef.current && !notifRef.current.contains(event.target as Node)) { setIsNotifOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => { window.removeEventListener('keydown', handleKeyDown); document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const fetchDolar = async () => {
    try { const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY'); const data = await res.json(); setDolarKuru(data.rates.TRY); } catch { setDolarKuru(35.95); }
  };

  // --- GLOBAL SAYAÇLAR ---
  const checkCounts = async () => {
      const localData = getWorkshopFromStorage();
      const localWaiting = localData.filter((x:any) => x.status === 'Bekliyor').length;
      const { count: dbCount } = await supabase.from('aura_jobs').select('*', { count: 'exact', head: true }).eq('status', 'Bekliyor').neq('category', 'Destek Talebi');
      setBekleyenSayisi(localWaiting + (dbCount || 0));
      
      const { count: formCount } = await supabase.from('aura_online_forms').select('*', { count: 'exact', head: true }).eq('status', 'Okunmadı');
      setBasvuruSayisi(formCount || 0);

      const { count: webCount } = await supabase.from('destek_talepleri').select('*', { count: 'exact', head: true }).eq('durum', 'Bekliyor');
      setWebMesajSayisi(webCount || 0);

      const { count: bayiCount } = await supabase.from('bayi_destek').select('*', { count: 'exact', head: true }).eq('durum', 'İnceleniyor');
      setBayiMesajSayisi(bayiCount || 0);
  };

  // --- %100 ENTEGRE BİLDİRİM SİSTEMİ ---
  const checkNotifications = async () => {
      const newNotifs: any[] = [];

      // 1. Web Destek Talepleri
      const { data: webReqs } = await supabase.from('destek_talepleri').select('*').eq('durum', 'Bekliyor').order('created_at', {ascending:false}).limit(3);
      if(webReqs) webReqs.forEach(w => newNotifs.push({
          id: `web-${w.id}`,
          type: 'support',
          title: 'Yeni Destek Talebi',
          desc: `${w.ad_soyad}: ${w.konu}`,
          time: new Date(w.created_at),
          link: '/epanel/destek'
      }));

      // 2. Bayi Destek Talepleri
      const { data: dealerReqs } = await supabase.from('bayi_destek').select('*').eq('durum', 'İnceleniyor').order('created_at', {ascending:false}).limit(3);
      if(dealerReqs) dealerReqs.forEach(d => newNotifs.push({
          id: `dealer-${d.id}`,
          type: 'support_dealer',
          title: 'Bayi Destek Mesajı',
          desc: `${d.bayi_adi}: ${d.konu}`,
          time: new Date(d.created_at),
          link: '/epanel/bayi-destek'
      }));

      // 3. GECİKEN CİHAZLAR (KRİTİK UYARI) - 3 Günden Eski "Teslim Edilmemiş" İşler
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const { data: lateJobs } = await supabase.from('aura_jobs')
          .select('id, device, customer, created_at')
          .lt('created_at', threeDaysAgo.toISOString())
          .neq('status', 'Teslim Edildi')
          .neq('status', 'İptal')
          .neq('status', 'İade')
          .limit(5);
      
      if(lateJobs) lateJobs.forEach(j => newNotifs.push({
          id: `late-${j.id}`,
          type: 'alert',
          title: 'Geciken Cihaz Uyarısı',
          desc: `${j.device} (${j.customer}) 3 gündür serviste!`,
          time: new Date(j.created_at),
          link: `/epanel/atolye/${j.id}`
      }));

      // Tarihe göre sırala (En yeni en üstte)
      newNotifs.sort((a, b) => b.time.getTime() - a.time.getTime());
      setNotifications(newNotifs);
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
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-mono animate-pulse">SİSTEM YÜKLENİYOR...</div>;
  }

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden relative font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      <MatrixRain />
      <AuraAI />
      <AuraTerminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} user={currentUserFull?.ad_soyad} />

      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#0b0e14]/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 transition-all duration-300 shadow-[10px_0_40px_rgba(0,0,0,0.5)] print:hidden relative`}>
        <div className="h-24 flex items-center justify-center border-b border-white/5 relative shrink-0">
          <Link href="/epanel" className={`flex items-center gap-3 transition-all duration-300 ${isSidebarOpen ? 'scale-100' : 'scale-90'}`}>
              <div className="relative w-11 h-11 group cursor-pointer">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-700 blur-md"></div>
                <div className="absolute inset-0 border border-cyan-500/30 rounded-xl rotate-45 bg-[#0b0e14] flex items-center justify-center z-10 shadow-lg group-hover:border-cyan-400/60 transition-colors">
                    <Activity className="text-cyan-400"/>
                </div>
              </div>
              {isSidebarOpen && (
                  <div className="flex flex-col animate-in fade-in slide-in-from-left-2">
                    <h1 className="text-2xl font-black text-white tracking-tighter leading-none flex items-center">
                        AURA<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PRO</span>
                    </h1>
                    <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">V7.0 OS</p>
                  </div>
              )}
          </Link>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
            <NavGroup title="ANA KOMUTA" isOpen={isSidebarOpen} />
            <NavItem icon={<LayoutDashboard size={20}/>} label="Komuta Merkezi" href="/epanel" isOpen={isSidebarOpen} active={pathname === '/epanel'} />
            <div className="my-3 border-t border-white/5 mx-2"></div>
            
            <NavGroup title="TEKNİK BİRİM" isOpen={isSidebarOpen} />
            <NavItem icon={<ClipboardList size={20}/>} label="Atölye Listesi" href="/epanel/atolye" isOpen={isSidebarOpen} active={pathname.includes('/atolye')} badge={bekleyenSayisi} badgeColor="bg-orange-500 text-black font-bold"/>
            <NavItem icon={<ShieldCheck size={20}/>} label="Ekspertiz İstasyonu" href="/epanel/ekspertiz" isOpen={isSidebarOpen} active={pathname.includes('/ekspertiz')} />
            <NavItem icon={<Zap size={20}/>} label="Hızlı Kayıt" href="/epanel/hizli-kayit" isOpen={isSidebarOpen} active={pathname.includes('/hizli-kayit')} />

            <div className="my-3 border-t border-white/5 mx-2"></div>

            <NavGroup title="DEPO & FİNANS" isOpen={isSidebarOpen} />
            <NavItem icon={<Package size={20}/>} label="Stok Yönetimi" href="/epanel/stok" isOpen={isSidebarOpen} active={pathname.includes('/stok')} />
            <NavItem icon={<ShoppingBag size={20}/>} label="Aura Store" href="/epanel/magaza" isOpen={isSidebarOpen} active={pathname.includes('/magaza')} />
            <NavItem icon={<CreditCard size={20}/>} label="Satış Yönetimi" href="/epanel/satis" isOpen={isSidebarOpen} active={pathname.includes('/satis')} />
            <NavItem icon={<Wallet size={20}/>} label="Finans & Kasa" href="/epanel/finans" isOpen={isSidebarOpen} active={pathname.includes('/finans')} highlight />

            <div className="my-3 border-t border-white/5 mx-2"></div>

            <NavGroup title="İLETİŞİM AĞI" isOpen={isSidebarOpen} />
            <NavItem icon={<LifeBuoy size={20}/>} label="Destek Talepleri" href="/epanel/destek" isOpen={isSidebarOpen} active={pathname === '/epanel/destek'} badge={webMesajSayisi} badgeColor="bg-blue-600 text-white"/>
            <NavItem icon={<MessageSquare size={20}/>} label="Bayi Destek" href="/epanel/bayi-destek" isOpen={isSidebarOpen} active={pathname.includes('/bayi-destek')} badge={bayiMesajSayisi} badgeColor="bg-pink-500 text-white animate-pulse"/>
            <NavItem icon={<Users size={20}/>} label="Online Başvurular" href="/epanel/basvurular" isOpen={isSidebarOpen} active={pathname.includes('/basvurular')} badge={basvuruSayisi} badgeColor="bg-red-600 text-white" />
            
            <div className="my-3 border-t border-white/5 mx-2"></div>

            <NavGroup title="KURUMSAL / B2B" isOpen={isSidebarOpen} />
            <NavItem icon={<Building2 size={20}/>} label="Bayi Başvuruları" href="/epanel/bayi-basvurulari" isOpen={isSidebarOpen} active={pathname.includes('/bayi-basvurulari')} />
            <NavItem icon={<Briefcase size={20}/>} label="Bayi Yönetimi" href="/epanel/bayiler" isOpen={isSidebarOpen} active={pathname.includes('/bayiler')} />
            
            <NavItem 
              icon={<Wrench size={20}/>} 
              label="Bayi Atölyesi" 
              href="/epanel/bayi-atolye" 
              isOpen={isSidebarOpen} 
              active={pathname.includes('/bayi-atolye')} 
            />

            <NavItem 
              icon={<ShoppingBag size={20}/>} 
              label="Fırsat Ürünleri" 
              href="/epanel/firsat-urunleri" 
              isOpen={isSidebarOpen} 
              active={pathname.includes('/firsat-urunleri')} 
            />

            {isAdmin && (
              <>
                <div className="my-3 border-t border-white/5 mx-2"></div>
                <NavItem icon={<Terminal size={20}/>} label="Sistem Ayarları" href="/epanel/ayarlar" isOpen={isSidebarOpen} active={pathname.includes('/ayarlar')} />
              </>
            )}
        </nav>

        {/* ALT USER KARTI */}
        <div className="p-4 border-t border-white/5 bg-[#050810] relative shrink-0">
           <button onClick={() => isSidebarOpen && setShowUserMenu(!showUserMenu)} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border border-transparent ${showUserMenu ? 'bg-white/5 border-white/10' : 'hover:bg-white/5 hover:border-white/5'}`}>
               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-xs relative overflow-hidden">
                   {currentUserFull?.avatar_url ? (
                       <img src={currentUserFull.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                   ) : (
                       <span>{userEmail.charAt(0).toUpperCase()}</span>
                   )}
                   <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#050810] rounded-full"></span>
               </div>
               {isSidebarOpen && (
                   <div className="flex-1 text-left overflow-hidden">
                       <p className="text-white text-xs font-bold truncate">{currentUserFull?.ad_soyad || userEmail.split('@')[0]}</p>
                       <p className="text-[9px] text-cyan-500 font-bold uppercase tracking-wider">{isAdmin ? 'ROOT ADMIN' : 'TEKNISYEN'}</p>
                   </div>
               )}
               {isSidebarOpen && <ChevronDown size={14} className="text-slate-500"/>}
           </button>
           
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-20 bg-[#0b0e14]/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-30 gap-6 shrink-0 relative">
           <div className="flex items-center gap-6 flex-1">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-xl hover:bg-cyan-500/10 border border-transparent">
                  <Menu size={20} />
              </button>
              <div className="relative group w-full max-w-2xl" ref={searchContainerRef}>
                  <div className="absolute inset-0 bg-cyan-500/5 rounded-xl blur-sm group-focus-within:opacity-100 opacity-0 transition-opacity duration-500"></div>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                  <input ref={searchInputRef} type="text" value={searchTerm} onChange={handleGlobalSearch} onKeyDown={(e) => e.key === 'Enter' && searchResults.length > 0 && goToResult(searchResults[0])} placeholder="Veritabanında Ara..." className="relative w-full bg-[#050810] border border-white/10 rounded-xl py-2.5 pl-11 pr-14 text-sm text-white focus:border-cyan-500/50 outline-none shadow-inner" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                    <span className="text-[9px] bg-[#1e293b] text-slate-400 px-1.5 py-0.5 rounded border border-white/5 font-mono font-bold">CTRL</span>
                    <span className="text-[9px] bg-[#1e293b] text-slate-400 px-1.5 py-0.5 rounded border border-white/5 font-mono font-bold">K</span>
                  </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-[#050810] rounded-lg border border-white/10 shadow-sm font-mono text-emerald-400 text-xs font-bold tracking-tight">
                  <span className="text-slate-500">USD</span> {dolarKuru?.toFixed(2)}
              </div>
              <button onClick={() => setShowTerminal(true)} className="p-2.5 rounded-xl border border-white/10 bg-[#0f172a] text-slate-400 hover:text-green-400 hover:border-green-500/50 transition-all" title="Terminal (CTRL+J)"><Code2 size={18}/></button>
              <button onClick={() => setShowCalc(!showCalc)} className={`p-2.5 rounded-xl border transition-all ${showCalc ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg' : 'bg-[#0f172a] border-white/10 text-slate-400 hover:text-white'}`}><Calculator size={18}/></button>
              <button onClick={() => setShowNotes(!showNotes)} className={`p-2.5 rounded-xl border transition-all ${showNotes ? 'bg-yellow-600 border-yellow-400 text-white shadow-lg' : 'bg-[#0f172a] border-white/10 text-slate-400 hover:text-white'}`}><StickyNote size={18}/></button>
              
              {/* --- %100 ENTEGRE BİLDİRİM MERKEZİ --- */}
              <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)} 
                    className={`p-2.5 rounded-xl border transition-all relative ${isNotifOpen ? 'bg-[#1e293b] text-white border-white/20' : 'bg-[#0f172a] border-white/10 text-slate-400 hover:text-white'}`}
                  >
                      <Bell size={18}/>
                      {notifications.length > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}
                      {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[9px] flex items-center justify-center text-white border border-[#0b0e14]">{notifications.length}</span>}
                  </button>

                  {isNotifOpen && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                          <div className="p-3 border-b border-white/5 flex justify-between items-center bg-[#151921]">
                              <h4 className="text-xs font-bold text-white uppercase tracking-widest">BİLDİRİMLER</h4>
                              <button onClick={() => setNotifications([])} className="text-[10px] text-slate-400 hover:text-white transition-colors">Tümünü Okundu Say</button>
                          </div>
                          <div className="max-h-80 overflow-y-auto custom-scrollbar">
                              {notifications.length === 0 ? (
                                  <div className="p-8 text-center text-slate-500 text-xs italic flex flex-col items-center gap-2">
                                      <Check className="text-emerald-500" size={24}/>
                                      Tüm bildirimler okundu.
                                  </div>
                              ) : (
                                  notifications.map((notif:any) => (
                                      <Link key={notif.id} href={notif.link} onClick={() => setIsNotifOpen(false)} className="block p-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors group">
                                          <div className="flex gap-3">
                                              <div className={`mt-1 min-w-[24px] h-6 rounded-full flex items-center justify-center ${notif.type === 'alert' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                  {notif.type === 'alert' ? <AlertTriangle size={12}/> : <MessageSquare size={12}/>}
                                              </div>
                                              <div>
                                                  <h5 className={`text-xs font-bold ${notif.type === 'alert' ? 'text-red-400' : 'text-slate-200 group-hover:text-white'}`}>{notif.title}</h5>
                                                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">{notif.desc}</p>
                                                  <span className="text-[9px] text-slate-600 mt-1 block flex items-center gap-1"><Clock size={9}/> {new Date(notif.time).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}</span>
                                              </div>
                                          </div>
                                      </Link>
                                  ))
                              )}
                          </div>
                      </div>
                  )}
              </div>

           </div>
        </header>

        {/* WIDGETS */}
        {showCalc && <div className="absolute top-24 right-8 z-[100] bg-[#1e293b]/95 backdrop-blur-xl p-5 rounded-3xl border border-cyan-500/20 shadow-2xl w-72 animate-in zoom-in-95 duration-200"><div className="flex justify-between items-center mb-4"><span className="text-xs font-bold text-cyan-500">HESAP MAKİNESİ</span><button onClick={() => setShowCalc(false)}><X size={16} className="text-slate-400 hover:text-white"/></button></div><div className="bg-black/40 p-4 rounded-xl mb-4 text-right text-2xl font-mono text-cyan-400 border border-white/5 h-16 flex items-center justify-end">{calcDisplay || "0"}</div><div className="grid grid-cols-4 gap-2">{['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map((btn) => (<button key={btn} onClick={() => handleCalc(btn)} className="p-3 rounded-lg font-bold bg-slate-800 text-slate-300 hover:bg-slate-700">{btn}</button>))}</div></div>}
        
        {showNotes && <div className="absolute top-24 right-20 z-[100] bg-[#1e293b]/95 backdrop-blur-xl p-5 rounded-3xl border border-yellow-500/20 shadow-2xl w-96 animate-in zoom-in-95 duration-200"><div className="flex justify-between items-center mb-4"><span className="text-xs font-bold text-yellow-500">NOTLAR</span><button onClick={() => setShowNotes(false)}><X size={16} className="text-slate-400 hover:text-white"/></button></div><textarea value={myNote} onChange={(e) => saveNote(e.target.value)} className="w-full h-64 bg-black/40 border border-white/5 rounded-xl p-4 text-slate-200 focus:border-yellow-500/50 outline-none text-sm font-mono resize-none" placeholder="Not al..."></textarea></div>}

        <AyarlarModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUserFull} onUpdate={() => window.location.reload()} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10 custom-scrollbar">{children}</main>
        
        <footer className="h-8 bg-[#0b0e14] border-t border-white/5 flex items-center justify-between px-6 text-[9px] font-bold text-slate-500 select-none z-50 print:hidden shrink-0 uppercase tracking-wider">
            <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-emerald-500/80"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> SYSTEM: ONLINE</span>
                <span className="flex items-center gap-1.5 text-slate-500"><Signal size={10}/> {ping}ms</span>
            </div>
            <div className="flex items-center gap-2">
                <Activity size={10} className="text-cyan-600"/>
                <span>AURA PRO OS v7.0</span>
            </div>
        </footer>
      </div>
    </div>
  );
}