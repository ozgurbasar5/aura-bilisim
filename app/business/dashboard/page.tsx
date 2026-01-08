"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import BrandLogo from "@/components/BrandLogo";
import { 
  LayoutDashboard, Search, Smartphone, Wrench, 
  LogOut, Wallet, Bell, ChevronRight, Zap, Users,
  Plus, CheckCircle2, AlertCircle, X, FileText, Loader2, Phone, MessageCircle, Crown, Upload,
  TrendingUp, ShieldCheck, Filter, Star, Calendar, Download, Printer, CreditCard,
  BarChart3, History, MessageSquare, ArrowUpRight, Sparkles, Award, Clock, Save
} from "lucide-react";

// Kategori Listesi
const CATEGORIES = ["Cep Telefonu", "Robot Süpürge", "Bilgisayar", "Tablet", "Akıllı Saat", "Diğer"];

export default function BusinessDashboard() {
  const router = useRouter();
  const [dealer, setDealer] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRequest, setNewRequest] = useState({
      category: "Cep Telefonu", brand: "", model: "", serial_no: "", problem: "", password: "" 
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);

  // İSTATİSTİKLER & MOCK DATA
  const [stats, setStats] = useState({
    active: 0, completed: 0, pending: 0, totalSpent: 0
  });

  // GRAFİK VERİSİ
  const chartData = [
    { month: 'Ağu', value: 12500, height: '40%' },
    { month: 'Eyl', value: 18200, height: '60%' },
    { month: 'Eki', value: 15400, height: '50%' },
    { month: 'Kas', value: 22100, height: '75%' },
    { month: 'Ara', value: 28500, height: '85%' },
    { month: 'Oca', value: 34200, height: '100%' },
  ];

  // DESTEK TALEPLERİ
  const activeTickets = [
    { id: 1, subject: "Fatura İtirazı", status: "Yanıtlandı", date: "2 saat önce" },
    { id: 2, subject: "Kargo Gecikmesi", status: "İnceleniyor", date: "Dün" },
  ];

  // TEMSİLCİ TANIMLARI (DİNAMİK SEÇİM)
  const getSalesRep = (plan: string) => {
      if (plan === 'Platinum') {
          return {
              name: "Selin Demir", 
              phone: "0555 999 88 77",
              title: "Kıdemli Portföy Yöneticisi",
              avatar: "https://i.pravatar.cc/150?u=selin_aura",
              color: "amber"
          };
      } else if (plan === 'Gold') {
          return {
              name: "Ahmet Yılmaz", 
              phone: "0555 111 22 33",
              title: "Müşteri Temsilcisi",
              avatar: "https://i.pravatar.cc/150?u=ahmet_aura",
              color: "blue"
          };
      }
      return null;
  };

  useEffect(() => {
    const init = async () => {
        const storedUser = localStorage.getItem('aura_dealer_user');
        if (!storedUser) { router.push('/kurumsal/login'); return; }
        
        const dealerData = JSON.parse(storedUser);
        // Veriyi Taze Çek (Plan değişikliği anında yansısın diye)
        const { data: freshDealer } = await supabase.from('bayi_basvurulari').select('*').eq('id', dealerData.id).single();
        const currentDealer = freshDealer || dealerData;
        
        setDealer(currentDealer);
        setLoading(true);
        
        const { data: jobData } = await supabase
            .from('aura_jobs')
            .select('*')
            .or(`customer.eq.${currentDealer.sirket_adi},customer_email.eq.${currentDealer.email}`)
            .order('created_at', { ascending: false });
            
        if (jobData) {
            setJobs(jobData);
            calculateStats(jobData);
        }
        setLoading(false);
    };
    init();
  }, []);

  const calculateStats = (data: any[]) => {
      const active = data.filter(j => !['Teslim Edildi', 'İptal', 'İade'].includes(j.status)).length;
      const completed = data.filter(j => ['Teslim Edildi'].includes(j.status)).length;
      const pending = data.filter(j => j.status === 'Onay Bekliyor' || j.approval_status === 'pending').length;
      const spent = data.filter(j => j.status !== 'İptal').reduce((acc, curr) => acc + (Number(curr.price) || Number(curr.fiyat) || 0), 0);
      setStats({ active, completed, pending, totalSpent: spent });
  };

  const handleLogout = () => {
      if(confirm("Güvenli çıkış yapmak üzeresiniz?")) {
          localStorage.removeItem('aura_dealer_user');
          router.push('/kurumsal/login');
      }
  };

  const filteredJobs = jobs.filter(job => {
    const term = searchTerm.toLowerCase();
    const matchSearch = (job.device?.toLowerCase() || "").includes(term) || (job.tracking_code?.toLowerCase() || "").includes(term);
    if (!matchSearch) return false;
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return !['Teslim Edildi', 'İptal', 'İade'].includes(job.status);
    if (filterStatus === 'pending') return job.status === 'Onay Bekliyor';
    if (filterStatus === 'completed') return job.status === 'Teslim Edildi';
    return true;
  });

  // --- YENİ KAYIT ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmitRequest = async () => {
      if(!newRequest.brand || !newRequest.model || !newRequest.problem) {
          alert("Lütfen zorunlu alanları doldurunuz.");
          return;
      }
      setSubmitting(true);
      try {
          let uploadedImageUrls: string[] = [];
          for (const file of selectedFiles) {
              const fileExt = file.name.split('.').pop();
              const fileName = `dealer-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
              const { error } = await supabase.storage.from('service-images').upload(fileName, file);
              if (!error) {
                  const { data } = supabase.storage.from('service-images').getPublicUrl(fileName);
                  uploadedImageUrls.push(data.publicUrl);
              }
          }
          const trackingCode = `SRV-${Math.floor(100000 + Math.random() * 900000)}`;
          const { error } = await supabase.from('aura_jobs').insert([{
              customer: dealer.sirket_adi, customer_email: dealer.email, phone: dealer.telefon, customer_type: "Bayi",
              category: newRequest.category, brand: newRequest.brand, model: newRequest.model, device: `${newRequest.brand} ${newRequest.model}`,
              serial_no: newRequest.serial_no, password: newRequest.password, problem: newRequest.problem,
              status: "Bekliyor", tracking_code: trackingCode, images: uploadedImageUrls, sold_upsells: [],
              process_details: [{ date: new Date().toISOString(), action: "Talep Oluşturuldu", user: dealer.yetkili_kisi, details: "Bayi panelinden oluşturuldu." }],
              created_at: new Date().toISOString()
          }]);
          if(error) throw error;
          alert("✅ Kayıt başarıyla oluşturuldu.");
          setIsModalOpen(false); setNewRequest({ category: "Cep Telefonu", brand: "", model: "", serial_no: "", problem: "", password: "" });
          window.location.reload();
      } catch (error: any) { alert("Hata: " + error.message); } finally { setSubmitting(false); }
  };

  const getStatusStyle = (status: string) => {
      const s = status.toLowerCase();
      if (s.includes("teslim")) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.2)]";
      if (s.includes("onay")) return "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.2)]";
      if (s.includes("bekliyor")) return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      return "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(96,165,250,0.2)]";
  };

  const currentRep = getSalesRep(dealer?.subscription_plan);

  if (loading) return <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4"><Loader2 className="animate-spin w-12 h-12 text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"/><span className="text-sm tracking-[0.2em] text-cyan-500/70 animate-pulse glitch" data-text="SYSTEM LOADING...">SYSTEM LOADING...</span></div>;

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-slate-300 selection:bg-cyan-500/30 pb-20 relative overflow-hidden">
      
      {/* --- AMBIENT LIGHTING --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slower"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#050505]/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer">
                <div className="relative">
                    <BrandLogo variant="icon" className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                    <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight text-white leading-none glitch-hover" data-text="AURA">AURA</h1>
                    <span className="text-[10px] font-black tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-size-200 animate-gradient">BUSINESS</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-white">{dealer?.sirket_adi}</div>
                    <div className={`text-[10px] tracking-wider uppercase font-bold flex items-center justify-end gap-1 ${dealer?.subscription_plan === 'Platinum' ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : dealer?.subscription_plan === 'Gold' ? 'text-yellow-200' : 'text-slate-500'}`}>
                        {dealer?.subscription_plan === 'Platinum' && <Crown size={12} fill="currentColor"/>}
                        {dealer?.subscription_plan === 'Gold' && <Award size={12} />}
                        {dealer?.subscription_plan || "Standart"} Üye
                    </div>
                </div>
                
                <button className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-all group border border-white/5 hover:border-cyan-500/30">
                    <Bell size={18} className="text-slate-400 group-hover:text-cyan-400 transition-colors"/>
                    {stats.pending > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>}
                </button>

                <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <LogOut size={16}/> <span className="hidden sm:inline">ÇIKIŞ</span>
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        
        {/* ÜST BÖLÜM: HERO AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Sol: Hoşgeldin ve Özet */}
            <div className="lg:col-span-2 flex flex-col justify-center gap-6 bg-[#121212]/60 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] relative overflow-hidden hover:border-cyan-500/20 transition-all duration-500 shadow-2xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px]"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">SİSTEM ÇEVRİMİÇİ</p>
                    </div>
                    <h2 className="text-4xl font-thin text-white">Hoş geldiniz, <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{dealer?.yetkili_kisi?.split(' ')[0]}</span></h2>
                </div>
                
                <div className="flex items-end gap-6 my-2 relative z-10">
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">TOPLAM HACİM</p>
                        <p className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">₺{stats.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-px bg-white/10"></div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">AKTİF İŞLER</p>
                        <p className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{stats.active}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-auto relative z-10">
                     <button onClick={() => setIsModalOpen(true)} className="flex-1 group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                        <Plus size={20} className="relative z-10"/> <span className="relative z-10">YENİ ONARIM TALEBİ</span>
                     </button>
                     <button onClick={() => setIsFinancialModalOpen(true)} className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-2xl font-bold transition-all">
                        <FileText size={20}/> Cari Raporu
                     </button>
                </div>
            </div>

            {/* Sağ: Temsilci Kartı (Platinum / Gold / Standart) */}
            {currentRep ? (
                // PLATINUM veya GOLD ise Temsilci Kartı
                <div className={`relative overflow-hidden rounded-[2rem] border p-6 group h-full flex flex-col justify-between shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all duration-500 ${dealer?.subscription_plan === 'Platinum' ? 'bg-[#0a0a0a] border-amber-500/20' : 'bg-[#0f1115] border-blue-500/20'}`}>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] transition-all ${dealer?.subscription_plan === 'Platinum' ? 'bg-amber-500/10 group-hover:bg-amber-500/20' : 'bg-blue-500/10 group-hover:bg-blue-500/20'}`}></div>
                    
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className={`${dealer?.subscription_plan === 'Platinum' ? 'text-amber-500' : 'text-blue-400'} text-[10px] font-black uppercase tracking-[0.2em] mb-1`}>VIP CONCIERGE</p>
                            <h3 className="text-white font-bold text-xl">Özel Temsilciniz</h3>
                        </div>
                        <div className={`p-2 rounded-full border ${dealer?.subscription_plan === 'Platinum' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
                             {dealer?.subscription_plan === 'Platinum' ? <Crown size={24} className="text-amber-500"/> : <Award size={24} className="text-blue-400"/>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10 my-6">
                        <div className="relative">
                            <img src={currentRep.avatar} className={`w-16 h-16 rounded-full border-2 p-1 ${dealer?.subscription_plan === 'Platinum' ? 'border-amber-500/50' : 'border-blue-500/50'}`} />
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-white">{currentRep.name}</div>
                            <div className="text-xs text-slate-400">{currentRep.title}</div>
                            <div className={`text-xs font-mono mt-1 ${dealer?.subscription_plan === 'Platinum' ? 'text-amber-500/80' : 'text-blue-400/80'}`}>{currentRep.phone}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 relative z-10">
                        <button className="flex items-center justify-center gap-2 py-3 bg-green-600/10 text-green-400 hover:bg-green-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-green-600/20 hover:border-green-600 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                            <MessageCircle size={16}/> WhatsApp
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">
                            <Phone size={16}/> Ara
                        </button>
                    </div>
                </div>
            ) : (
                // STANDART ise Yükseltme Önerisi
                <div className="relative overflow-hidden rounded-[2rem] bg-[#121212] border border-white/5 p-6 flex flex-col justify-center items-center text-center group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Crown size={56} className="text-slate-700 mb-4 group-hover:text-amber-500/50 transition-colors duration-500"/>
                    <h3 className="text-white font-bold text-xl mb-2">Platinum'a Geçin</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-[200px]">Özel müşteri temsilcisi, öncelikli servis ve %10 yedek parça indirimi.</p>
                    <button className="px-8 py-3 bg-white/5 hover:bg-amber-600 hover:text-black hover:font-bold border border-white/10 hover:border-amber-500 text-white rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider relative z-10">
                        Paketleri İncele
                    </button>
                </div>
            )}
        </div>

        {/* GRAFİK VE İSTATİSTİK GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
            {/* KPI Kartları (Neon Glow) */}
            <div className="bg-[#121212]/80 backdrop-blur border border-white/5 p-6 rounded-[1.5rem] flex flex-col justify-between hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all group cursor-default">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform"><AlertCircle size={24}/></div>
                    {stats.pending > 0 && <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]">Aksiyon</span>}
                </div>
                <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Onay Bekleyen</span>
                    <h3 className="text-4xl font-black text-white mt-1 group-hover:text-amber-400 transition-colors">{stats.pending}</h3>
                </div>
            </div>
            
            <div className="bg-[#121212]/80 backdrop-blur border border-white/5 p-6 rounded-[1.5rem] flex flex-col justify-between hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all group cursor-default">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 rounded-2xl text-green-400 group-hover:scale-110 transition-transform"><CheckCircle2 size={24}/></div>
                    <span className="text-xs font-mono text-green-500/70">Bu Ay</span>
                </div>
                <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tamamlanan</span>
                    <h3 className="text-4xl font-black text-white mt-1 group-hover:text-green-400 transition-colors">{stats.completed}</h3>
                </div>
            </div>

            {/* BÜYÜK GRAFİK KARTI (2 Birim Genişlik) */}
            <div className="lg:col-span-2 bg-[#121212]/80 backdrop-blur border border-white/5 p-6 rounded-[1.5rem] flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 z-10">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2"><BarChart3 size={18} className="text-cyan-500"/> Aylık İşlem Hacmi</h4>
                    <span className="text-[10px] text-green-400 bg-green-900/20 px-2 py-1 rounded font-mono flex items-center gap-1 border border-green-500/20"><TrendingUp size={12}/> +12.5%</span>
                </div>
                
                {/* CSS Bar Chart */}
                <div className="flex items-end justify-between h-32 gap-4 z-10 px-2">
                    {chartData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 flex-1 group">
                            <div className="w-full bg-white/5 rounded-t-xl relative overflow-hidden group-hover:bg-cyan-900/20 transition-all duration-500" style={{ height: d.height }}>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600/80 to-blue-600/80 h-full group-hover:from-cyan-400 group-hover:to-blue-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]"></div>
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0 shadow-xl whitespace-nowrap z-20">
                                    ₺{d.value.toLocaleString()}
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{d.month}</span>
                        </div>
                    ))}
                </div>
                {/* Bg Decoration */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none"></div>
            </div>
        </div>

        {/* FİLTRE VE LİSTE ALANI */}
        <div className="grid grid-cols-12 gap-6">
            
            {/* Ana Liste (Solda) */}
            <div className="col-span-12 lg:col-span-9 bg-[#121212]/90 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
                {/* Toolbar */}
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 shrink-0">
                            <LayoutDashboard className="text-cyan-500" size={20}/> 
                            <span className="hidden sm:inline">Servis Takip</span>
                        </h3>
                        <div className="flex bg-[#050505] p-1.5 rounded-2xl border border-white/5 overflow-x-auto w-full sm:w-auto">
                            {[{ id: 'all', label: 'Tümü' }, { id: 'active', label: 'İşlemde' }, { id: 'pending', label: 'Onay' }, { id: 'completed', label: 'Biten' }].map(tab => (
                                <button key={tab.id} onClick={() => setFilterStatus(tab.id)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filterStatus === tab.id ? 'bg-white/10 text-white shadow-lg border border-white/5' : 'text-slate-500 hover:text-white'}`}>{tab.label}</button>
                            ))}
                        </div>
                    </div>
                    <div className="relative w-full md:w-72 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative flex items-center bg-[#050505] rounded-2xl border border-white/10 group-focus-within:border-cyan-500/50 transition-colors">
                            <Search className="absolute left-4 text-slate-500" size={16}/>
                            <input 
                                type="text" 
                                placeholder="Cihaz, marka, takip no..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-0"
                            />
                        </div>
                    </div>
                </div>

                {/* Tablo */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="px-6 py-5">Cihaz</th>
                                <th className="px-6 py-5">Tarih</th>
                                <th className="px-6 py-5">Durum</th>
                                <th className="px-6 py-5 text-right">Tutar</th>
                                <th className="px-6 py-5 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={5} className="p-12 text-center text-slate-500 animate-pulse">Veriler yükleniyor...</td></tr>
                            ) : filteredJobs.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-slate-500 italic">Kayıt bulunamadı.</td></tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id} onClick={() => router.push(`/business/cihaz-takip/${job.id}`)} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                                                    <Smartphone size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{job.device}</div>
                                                    <div className="text-[10px] text-slate-500 font-mono tracking-wider mt-0.5">{job.tracking_code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs text-slate-500"><div className="flex items-center gap-1.5"><Clock size={12}/> {new Date(job.created_at).toLocaleDateString('tr-TR')}</div></td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(job.status)}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_5px_currentColor]"></div>{job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-mono text-sm font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">₺{((Number(job.price)||Number(job.fiyat)||0) + (Number(job.parca_ucreti)||0)).toLocaleString()}</td>
                                        <td className="px-6 py-5 text-right"><button className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-cyan-600 transition-all shadow-lg"><ChevronRight size={18} /></button></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sağ Panel: Canlı Akış ve Destek */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
                 
                 {/* Son Hareketler (Timeline) */}
                 <div className="bg-[#121212]/90 border border-white/10 rounded-[2rem] p-6 h-80 flex flex-col shadow-xl">
                     <h4 className="text-white font-bold flex items-center gap-2 mb-6 text-sm"><History size={18} className="text-cyan-500"/> Son Hareketler</h4>
                     <div className="space-y-6 overflow-y-auto custom-scrollbar flex-1 pr-2">
                         {jobs.slice(0, 5).map((job, i) => (
                             <div key={i} className="flex gap-4 relative pb-2 group">
                                 {i !== jobs.slice(0, 5).length - 1 && <div className="absolute left-[5px] top-2 bottom-[-1.5rem] w-px bg-white/10 group-hover:bg-cyan-500/30 transition-colors"></div>}
                                 <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#121212] border-2 border-slate-600 group-hover:border-cyan-400 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all mt-1.5 shrink-0"></div>
                                 <div>
                                     <p className="text-xs text-slate-300 font-bold group-hover:text-cyan-300 transition-colors">{job.status}</p>
                                     <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{job.device}</p>
                                     <span className="text-[9px] text-slate-600 mt-1 block font-mono">{new Date(job.updated_at || job.created_at).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}</span>
                                 </div>
                             </div>
                         ))}
                         {jobs.length === 0 && <div className="text-xs text-slate-500 text-center italic">Henüz işlem yok.</div>}
                     </div>
                 </div>

                 {/* Destek Talepleri (Ticket UI) */}
                 <div className="bg-[#121212]/90 border border-white/10 rounded-[2rem] p-6 shadow-xl">
                     <div className="flex justify-between items-center mb-5">
                        <h4 className="text-white font-bold flex items-center gap-2 text-sm"><MessageSquare size={18} className="text-purple-500"/> Destek</h4>
                        <button className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-white transition-colors">Yeni Talep</button>
                     </div>
                     <div className="space-y-3">
                         {activeTickets.map(t => (
                             <div key={t.id} className="bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-purple-500/30 cursor-pointer transition-all group">
                                 <div className="flex justify-between items-start mb-1">
                                     <span className="text-xs text-slate-300 font-bold group-hover:text-purple-300 transition-colors">{t.subject}</span>
                                     <span className="text-[9px] text-green-400 bg-green-900/20 px-2 py-0.5 rounded-full border border-green-500/20">{t.status}</span>
                                 </div>
                                 <span className="text-[10px] text-slate-600 flex items-center gap-1"><Clock size={10}/> {t.date}</span>
                             </div>
                         ))}
                     </div>
                 </div>

            </div>

        </div>

      </main>

      {/* --- CARİ RAPOR MODALI --- */}
      {isFinancialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
              <div className="bg-[#151921] border border-white/10 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0b0e14]">
                      <div><h3 className="text-xl font-black text-white flex items-center gap-2 tracking-wide"><FileText size={24} className="text-amber-500"/> FİNANSAL EKSTRE</h3><p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{dealer?.sirket_adi}</p></div>
                      <div className="flex items-center gap-2"><button onClick={() => window.print()} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white"><Printer size={18}/></button><button onClick={() => setIsFinancialModalOpen(false)} className="p-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-colors"><X size={18}/></button></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6"><TrendingUp size={48} className="text-slate-600"/></div>
                      <h4 className="text-xl font-bold text-white mb-2">Detaylı Rapor Hazırlanıyor</h4>
                      <p className="max-w-md text-sm leading-relaxed mb-6">Muhasebe sistemimiz şu an güncellenmektedir.</p>
                      <div className="flex gap-4"><div className="text-center p-4 bg-white/5 rounded-xl border border-white/5"><div className="text-xs text-slate-500 uppercase font-bold">Güncel Bakiye</div><div className="text-2xl font-black text-green-400">₺0,00</div></div><div className="text-center p-4 bg-white/5 rounded-xl border border-white/5"><div className="text-xs text-slate-500 uppercase font-bold">Bekleyen Ödeme</div><div className="text-2xl font-black text-white">₺0,00</div></div></div>
                  </div>
              </div>
          </div>
      )}

      {/* --- ONARIM TALEBİ MODALI (ELITE DESIGN) --- */}
      {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
                <div className="bg-[#151921] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
                    
                    {/* Modal Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0b0e14]">
                        <div>
                            <h3 className="text-lg font-black text-white flex items-center gap-2"><Zap size={20} className="text-cyan-500 fill-cyan-500"/> HIZLI SERVİS KAYDI</h3>
                            <p className="text-xs text-slate-500 mt-1">Cihaz bilgilerini girerek onarım sürecini başlatın.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-all"><X size={18}/></button>
                    </div>
                    
                    <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 bg-gradient-to-b from-[#151921] to-[#0b0e14]">
                        
                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">Cihaz Türü</label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {CATEGORIES.map(cat => (
                                    <button 
                                        key={cat} 
                                        onClick={() => setNewRequest({...newRequest, category: cat})}
                                        className={`p-3 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center gap-2 ${newRequest.category === cat ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-900/50' : 'bg-[#0b0e14] border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300'}`}
                                    >
                                        <Smartphone size={16}/>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Marka</label>
                                <input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="Örn: Apple" value={newRequest.brand} onChange={e => setNewRequest({...newRequest, brand: e.target.value})}/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Model</label>
                                <input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="Örn: iPhone 13" value={newRequest.model} onChange={e => setNewRequest({...newRequest, model: e.target.value})}/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Seri No / IMEI</label>
                                <input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all font-mono" placeholder="Zorunlu Değil" value={newRequest.serial_no} onChange={e => setNewRequest({...newRequest, serial_no: e.target.value})}/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Ekran Şifresi</label>
                                <input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all" placeholder="Varsa Giriniz" value={newRequest.password} onChange={e => setNewRequest({...newRequest, password: e.target.value})}/>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><AlertCircle size={12} className="text-red-500"/> Arıza / Şikayet Detayı</label>
                            <textarea className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-cyan-500 outline-none h-24 resize-none transition-all placeholder-slate-600" value={newRequest.problem} onChange={e => setNewRequest({...newRequest, problem: e.target.value})} placeholder="Cihazdaki sorunu detaylıca açıklayınız..."></textarea>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Cihaz Fotoğrafları</label>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {previewUrls.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                        <img src={url} className="w-full h-full object-cover"/>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                ))}
                                <label className="aspect-square border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-cyan-500 hover:bg-cyan-500/5 transition-colors group">
                                    <Upload size={20} className="text-slate-500 group-hover:text-cyan-500 transition-colors"/>
                                    <span className="text-[9px] font-bold text-slate-500 group-hover:text-cyan-500 uppercase">Yükle</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                                </label>
                            </div>
                        </div>

                    </div>

                    <div className="p-6 border-t border-white/10 bg-[#0b0e14]">
                        <button 
                            onClick={handleSubmitRequest} 
                            disabled={submitting}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? <Loader2 className="animate-spin"/> : <Save size={20}/>}
                            {submitting ? "Kayıt Açılıyor..." : "TALEBİ OLUŞTUR VE GÖNDER"}
                        </button>
                    </div>
                </div>
            </div>
      )}

      {/* GLOBAL CSS FOR GLITCH & ANIMATIONS */}
      <style jsx global>{`
          @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .animate-gradient { background-size: 200% auto; animation: gradient 3s ease infinite; }
          .glitch-hover:hover { animation: glitch-anim 0.3s cubic-bezier(.25, .46, .45, .94) both infinite; color: #06b6d4; }
          @keyframes glitch-anim { 0% { transform: translate(0) } 20% { transform: translate(-2px, 2px) } 40% { transform: translate(-2px, -2px) } 60% { transform: translate(2px, 2px) } 80% { transform: translate(2px, -2px) } 100% { transform: translate(0) } }
      `}</style>

    </div>
  );
}