"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import BrandLogo from "@/components/BrandLogo";
import { 
  LayoutDashboard, Search, Smartphone, 
  LogOut, Bell, ChevronRight, Zap, 
  Plus, CheckCircle2, AlertCircle, X, FileText, Loader2, Phone, MessageCircle, Crown, Upload,
  TrendingUp, BarChart3, History, MessageSquare, Award, Clock, Save, Printer, ArrowUpRight
} from "lucide-react";

// Kategori Listesi
const CATEGORIES = ["Cep Telefonu", "Robot Süpürge", "Bilgisayar", "Tablet", "Akıllı Saat", "Diğer"];

// PAKET DETAYLARI
const PACKAGES = [
  {
    id: "standart",
    name: "Standart",
    price: "Ücretsiz",
    color: "slate",
    features: [ "Standart Servis Önceliği", "Temel Arıza Takibi", "WhatsApp Destek Hattı", "Cari Hesap Görüntüleme" ]
  },
  {
    id: "gold",
    name: "Gold Partner",
    price: "Aylık 2.500₺",
    color: "blue",
    features: [ "%5 Yedek Parça İndirimi", "Hızlandırılmış Servis (Fast Track)", "Gelişmiş Finansal Raporlar", "Öncelikli Kargo İşlemleri", "Haftalık Performans Özeti" ]
  },
  {
    id: "platinum",
    name: "Platinum Partner",
    price: "Aylık 5.000₺",
    color: "amber",
    popular: true,
    features: [ "%10 Yedek Parça İndirimi", "VIP Müşteri Temsilcisi (7/24)", "Ücretsiz Kargo (Gidiş-Dönüş)", "En Yüksek Servis Önceliği", "Özel API Erişimi", "Yıllık Ciro Primi" ]
  }
];

export default function BusinessDashboard() {
  const router = useRouter();
  const [dealer, setDealer] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false); 
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [isMembershipStatusOpen, setIsMembershipStatusOpen] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  
  // Yeni Servis Kaydı State
  const [newRequest, setNewRequest] = useState({
      category: "Cep Telefonu", brand: "", model: "", serial_no: "", problem: "", password: "" 
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Yeni Destek Talebi State
  const [newTicket, setNewTicket] = useState({ subject: "", message: "" });

  // İSTATİSTİKLER & GRAFİK (GÜNCELLENDİ: İndirim ve Brüt eklendi)
  const [stats, setStats] = useState({ active: 0, completed: 0, pending: 0, totalSpent: 0, totalDiscount: 0, grossTotal: 0 });
  const [chartData, setChartData] = useState<any[]>([]); 

  // TEMSİLCİ SEÇİMİ
  const getSalesRep = (dealerData: any) => {
      if (dealerData?.satis_temsilcisi) {
          return {
              name: dealerData.satis_temsilcisi,
              phone: dealerData.satis_temsilcisi_tel || "0850 123 45 67",
              title: "Özel Müşteri Danışmanınız",
              avatar: dealerData.satis_temsilcisi_avatar || `https://ui-avatars.com/api/?name=${dealerData.satis_temsilcisi}&background=random`
          };
      }
      if (dealerData?.subscription_plan === 'Platinum') {
          return { name: "Selin Demir", phone: "0555 999 88 77", title: "Kıdemli Portföy Yöneticisi", avatar: "https://i.pravatar.cc/150?u=selin_aura" };
      } else if (dealerData?.subscription_plan === 'Gold') {
          return { name: "Ahmet Yılmaz", phone: "0555 111 22 33", title: "Müşteri Temsilcisi", avatar: "https://i.pravatar.cc/150?u=ahmet_aura" };
      }
      return null;
  };

  useEffect(() => {
    const init = async () => {
        const storedUser = localStorage.getItem('aura_dealer_user');
        if (!storedUser) { router.push('/kurumsal/login'); return; }
        
        const dealerData = JSON.parse(storedUser);
        
        const { data: freshDealer } = await supabase.from('bayi_basvurulari').select('*').eq('id', dealerData.id).single();
        const currentDealer = freshDealer || dealerData;
        setDealer(currentDealer);
        
        const { data: jobData } = await supabase
            .from('aura_jobs')
            .select('*')
            .or(`customer.eq.${currentDealer.sirket_adi},customer_email.eq.${currentDealer.email}`)
            .order('created_at', { ascending: false });
            
        if (jobData) {
            setJobs(jobData);
            calculateStats(jobData);
            generateChartData(jobData); 
        }

        const { data: ticketData } = await supabase
            .from('bayi_destek')
            .select('*')
            .eq('bayi_id', currentDealer.id)
            .order('created_at', { ascending: false });

        if (ticketData) {
            setTickets(ticketData);
        }

        setLoading(false);
    };
    init();
  }, []);

  // --- HESAPLAMA MANTIĞI (GÜNCELLENDİ) ---
  const calculateStats = (data: any[]) => {
      const active = data.filter(j => !['Teslim Edildi', 'İptal', 'İade'].includes(j.status)).length;
      const completed = data.filter(j => ['Teslim Edildi'].includes(j.status)).length;
      const pending = data.filter(j => j.status === 'Onay Bekliyor' || j.approval_status === 'pending').length;
      
      let spent = 0; // Net Ciro (Ödenen)
      let discount = 0; // Toplam İndirim
      let gross = 0; // İndirimsiz Ham Tutar

      data.filter(j => j.status === 'Teslim Edildi').forEach(j => {
          const finalPrice = Number(j.price) || Number(j.fiyat) || 0;
          const discAmt = Number(j.discount_amount) || 0;
          
          // Eğer original_price varsa onu kullan, yoksa (fiyat + indirim) ham fiyatı verir
          const rawPrice = Number(j.original_price) > 0 ? Number(j.original_price) : (finalPrice + discAmt);

          spent += finalPrice;
          discount += discAmt;
          gross += rawPrice;
      });

      setStats({ active, completed, pending, totalSpent: spent, totalDiscount: discount, grossTotal: gross });
  };

  const generateChartData = (data: any[]) => {
      const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
      const last6Months: { index: number; year: number; label: string; value: number }[] = [];
      
      for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          last6Months.push({
              index: d.getMonth(),
              year: d.getFullYear(),
              label: months[d.getMonth()],
              value: 0
          });
      }

      data.forEach(job => {
          const jobDate = new Date(job.created_at);
          const price = Number(job.price) || Number(job.fiyat) || 0;
          const monthIndex = last6Months.findIndex(m => m.index === jobDate.getMonth() && m.year === jobDate.getFullYear());
          if (monthIndex !== -1 && job.status === 'Teslim Edildi') {
              last6Months[monthIndex].value += price;
          }
      });

      const maxValue = Math.max(...last6Months.map(m => m.value)) || 1;
      const formattedChart = last6Months.map(m => ({
          month: m.label,
          value: m.value,
          height: `${Math.max((m.value / maxValue) * 100, 10)}%` 
      }));

      setChartData(formattedChart);
  };

  const handleLogout = () => {
      if(confirm("Güvenli çıkış yapmak üzeresiniz?")) {
          localStorage.removeItem('aura_dealer_user');
          router.push('/kurumsal/login');
      }
  };

  // --- İŞLEMLER ---
  const handleSubmitTicket = async () => {
    if(!newTicket.subject || !newTicket.message) {
        alert("Lütfen konu ve mesaj alanlarını doldurunuz.");
        return;
    }
    setSubmitting(true);
    try {
        const { error } = await supabase.from('bayi_destek').insert([{
            bayi_id: dealer.id,
            bayi_adi: dealer.sirket_adi,
            konu: newTicket.subject,
            mesaj: newTicket.message,
            durum: 'İnceleniyor'
        }]);
        if (error) throw error;
        alert("✅ Destek talebiniz oluşturuldu.");
        setIsTicketModalOpen(false);
        setNewTicket({ subject: "", message: "" });
        window.location.reload(); 
    } catch (error: any) { alert("Hata: " + error.message); } finally { setSubmitting(false); }
  };

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
          alert("✅ Servis kaydı oluşturuldu.");
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

  const currentRep = getSalesRep(dealer);

  const handleWhatsApp = () => {
      if (!currentRep?.phone) return;
      const cleanPhone = currentRep.phone.replace(/[^0-9]/g, '');
      const targetPhone = cleanPhone.startsWith('90') ? cleanPhone : `90${cleanPhone.replace(/^0/, '')}`;
      window.open(`https://wa.me/${targetPhone}`, '_blank');
  };

  const handleCall = () => {
      if (!currentRep?.phone) return;
      window.open(`tel:${currentRep.phone}`);
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

  const completedJobs = jobs.filter(j => j.status === 'Teslim Edildi');

  if (loading) return <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4"><Loader2 className="animate-spin w-12 h-12 text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"/><span className="text-sm tracking-[0.2em] text-cyan-500/70 animate-pulse glitch">SYSTEM LOADING...</span></div>;

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-slate-300 selection:bg-cyan-500/30 pb-20 relative overflow-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slower"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#050505]/60 print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.reload()}>
                <div className="relative">
                    <BrandLogo variant="icon" className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                    <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight text-white leading-none glitch-hover">AURA</h1>
                    <span className="text-[10px] font-black tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-size-200 animate-gradient">BUSINESS</span>
                </div>
            </div>

            {/* ORTA MENÜ */}
            <div className="hidden md:flex items-center gap-2 p-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
                <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2"><LayoutDashboard size={14}/> Panel</button>
                <button onClick={() => setIsFinancialModalOpen(true)} className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"><FileText size={14}/> Finans</button>
                <button onClick={() => setIsTicketModalOpen(true)} className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"><MessageSquare size={14}/> Destek</button>
                <button onClick={() => setIsMembershipStatusOpen(true)} className="px-4 py-2 rounded-full text-xs font-bold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all flex items-center gap-2 border border-amber-500/20"><Crown size={14}/> Üyelik</button>
            </div>

            {/* SAĞ: Profil & Duyuru */}
            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-blue-300">iPhone ekranlarında kampanya!</span>
                </div>

                <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-white">{dealer?.sirket_adi}</div>
                    <div className={`text-[10px] tracking-wider uppercase font-bold flex items-center justify-end gap-1 ${dealer?.subscription_plan === 'Platinum' ? 'text-amber-400' : 'text-slate-500'}`}>
                        {dealer?.subscription_plan || "Standart"} Üye
                    </div>
                </div>
                
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                    <LogOut size={16}/>
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10 print:hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Sol: Özet Kartı */}
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

            {/* Sağ: Temsilci Kartı */}
            <div className="h-full">
            {currentRep ? (
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
                        <button onClick={handleWhatsApp} className="flex items-center justify-center gap-2 py-3 bg-green-600/10 text-green-400 hover:bg-green-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-green-600/20 hover:border-green-600 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                            <MessageCircle size={16}/> WhatsApp
                        </button>
                        <button onClick={handleCall} className="flex items-center justify-center gap-2 py-3 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">
                            <Phone size={16}/> Ara
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden rounded-[2rem] bg-[#121212] border border-white/5 p-6 flex flex-col justify-center items-center text-center group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Crown size={56} className="text-slate-700 mb-4 group-hover:text-amber-500/50 transition-colors duration-500"/>
                    <h3 className="text-white font-bold text-xl mb-2">Platinum'a Geçin</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-[200px]">Özel müşteri temsilcisi, öncelikli servis ve %10 yedek parça indirimi.</p>
                    <button onClick={() => setIsPackagesModalOpen(true)} className="px-8 py-3 bg-white/5 hover:bg-amber-600 hover:text-black hover:font-bold border border-white/10 hover:border-amber-500 text-white rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider relative z-10">
                        Paketleri İncele
                    </button>
                </div>
            )}
            </div>
        </div>

        {/* GRAFİKLER */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
            {/* KPI Kartları */}
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

            {/* BÜYÜK GRAFİK KARTI (DİNAMİK) */}
            <div className="lg:col-span-2 bg-[#121212]/80 backdrop-blur border border-white/5 p-6 rounded-[1.5rem] flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 z-10">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2"><BarChart3 size={18} className="text-cyan-500"/> Aylık İşlem Hacmi (Son 6 Ay)</h4>
                    <span className="text-[10px] text-green-400 bg-green-900/20 px-2 py-1 rounded font-mono flex items-center gap-1 border border-green-500/20"><TrendingUp size={12}/> Canlı Veri</span>
                </div>
                
                <div className="flex items-end justify-between h-32 gap-4 z-10 px-2">
                    {chartData.length > 0 ? chartData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 flex-1 group">
                            <div className="w-full bg-white/5 rounded-t-xl relative overflow-hidden group-hover:bg-cyan-900/20 transition-all duration-500" style={{ height: d.height }}>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600/80 to-blue-600/80 h-full group-hover:from-cyan-400 group-hover:to-blue-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]"></div>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0 shadow-xl whitespace-nowrap z-20">
                                    ₺{d.value.toLocaleString()}
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{d.month}</span>
                        </div>
                    )) : <div className="w-full text-center text-xs text-slate-500">Veri yok</div>}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none"></div>
            </div>
        </div>

        {/* LİSTE */}
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-9 bg-[#121212]/90 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
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
                            <input type="text" placeholder="Cihaz, marka, takip no..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent border-none py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-0"/>
                        </div>
                    </div>
                </div>

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
                            {filteredJobs.length === 0 ? (
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
                                        <td className="px-6 py-5 text-right font-mono text-sm font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                                            {job.status === 'Teslim Edildi' ? (
                                                <div className="flex flex-col items-end">
                                                    <span className={job.discount_amount > 0 ? "line-through text-slate-600 text-[10px]" : ""}>
                                                        {job.original_price ? `₺${Number(job.original_price).toLocaleString()}` : ""}
                                                    </span>
                                                    <span>₺{((Number(job.price)||Number(job.fiyat)||0) + (Number(job.parca_ucreti)||0)).toLocaleString()}</span>
                                                </div>
                                            ) : "-"}
                                        </td>
                                        <td className="px-6 py-5 text-right"><button className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-cyan-600 transition-all shadow-lg"><ChevronRight size={18} /></button></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-3 space-y-6">
                 {/* Son Hareketler */}
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
                     </div>
                 </div>

                 {/* Destek Talepleri */}
                 <div className="bg-[#121212]/90 border border-white/10 rounded-[2rem] p-6 shadow-xl max-h-96 flex flex-col">
                     <div className="flex justify-between items-center mb-5">
                        <h4 className="text-white font-bold flex items-center gap-2 text-sm"><MessageSquare size={18} className="text-purple-500"/> Destek</h4>
                        <button onClick={() => setIsTicketModalOpen(true)} className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-white transition-colors">Yeni Talep</button>
                     </div>
                     <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
                         {tickets.length > 0 ? tickets.map(t => (
                             <div key={t.id} className="bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-purple-500/30 cursor-pointer transition-all group">
                                 <div className="flex justify-between items-start mb-1">
                                     <span className="text-xs text-slate-300 font-bold group-hover:text-purple-300 transition-colors line-clamp-1">{t.konu}</span>
                                     <span className={`text-[9px] px-2 py-0.5 rounded-full border ${t.durum === 'Yanıtlandı' ? 'text-green-400 bg-green-900/20 border-green-500/20' : 'text-amber-400 bg-amber-900/20 border-amber-500/20'}`}>{t.durum}</span>
                                 </div>
                                 <p className="text-[10px] text-slate-500 line-clamp-2 mb-1">{t.mesaj}</p>
                                 <span className="text-[9px] text-slate-600 flex items-center gap-1"><Clock size={10}/> {new Date(t.created_at).toLocaleDateString('tr-TR')}</span>
                             </div>
                         )) : <div className="text-center py-4 text-slate-600 text-xs italic">Henüz destek talebiniz yok.</div>}
                     </div>
                 </div>
            </div>
        </div>

      </main>

      {/* --- YENİ DESTEK MODALI --- */}
      {isTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
              <div className="bg-[#151921] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl flex flex-col">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0b0e14] rounded-t-3xl">
                      <div><h3 className="text-lg font-black text-white flex items-center gap-2"><MessageSquare size={20} className="text-purple-500"/> YENİ DESTEK TALEBİ</h3></div>
                      <button onClick={() => setIsTicketModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-all"><X size={18}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Konu</label>
                          <select className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-500 transition-all" value={newTicket.subject} onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}>
                              <option value="">Seçiniz...</option>
                              <option value="Fatura İtirazı">Fatura / Ödeme Sorunu</option>
                              <option value="Kargo Gecikmesi">Kargo Durumu</option>
                              <option value="Teknik Sorun">Panel Teknik Sorun</option>
                              <option value="Diğer">Diğer</option>
                          </select>
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Mesajınız</label>
                          <textarea className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-500 h-32 resize-none transition-all" placeholder="Sorununuzu detaylıca anlatınız..." value={newTicket.message} onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}></textarea>
                      </div>
                      <button onClick={handleSubmitTicket} disabled={submitting} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2">
                          {submitting ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Gönder
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- GÜNCELLENMİŞ CARİ RAPOR MODALI (AURA BUSINESS LOGO & İNDİRİMLER) --- */}
      {isFinancialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
              <div className="bg-[#151921] border border-white/10 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0b0e14] print:hidden">
                      <div><h3 className="text-xl font-black text-white flex items-center gap-2 tracking-wide"><FileText size={24} className="text-amber-500"/> FİNANSAL EKSTRE</h3><p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{dealer?.sirket_adi}</p></div>
                      <div className="flex items-center gap-2">
                          <button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 transition-colors"><Printer size={18}/> YAZDIR</button>
                          <button onClick={() => setIsFinancialModalOpen(false)} className="p-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-colors"><X size={18}/></button>
                      </div>
                  </div>
                  
                  {/* PRINT CONTENT - GÜNCELLENMİŞ VERSİYON */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white text-black print:p-0 print:overflow-visible">
                      <div className="mb-8 border-b pb-4 flex justify-between items-end">
                          <div>
                              <h1 className="text-3xl font-black text-black tracking-tight">AURA <span className="text-cyan-600">BUSINESS</span></h1>
                              <p className="text-sm text-gray-500 mt-1 font-bold uppercase">Yetkili Servis & Onarım Raporu</p>
                          </div>
                          <div className="text-right">
                              <p className="font-bold text-lg">{dealer?.sirket_adi}</p>
                              <p className="text-sm text-gray-500">{new Date().toLocaleDateString('tr-TR')}</p>
                          </div>
                      </div>

                      <div className="mb-6">
                          <h4 className="font-bold text-lg mb-4 border-l-4 border-black pl-3 uppercase">Tamamlanan İşlemler</h4>
                          <table className="w-full text-left border-collapse text-sm">
                              <thead>
                                  <tr className="bg-gray-100 border-b border-gray-300">
                                      <th className="p-3 font-bold text-gray-700">Takip Kodu</th>
                                      <th className="p-3 font-bold text-gray-700">Cihaz</th>
                                      <th className="p-3 font-bold text-gray-700">Tarih</th>
                                      <th className="p-3 font-bold text-gray-700">İndirim Detayı</th>
                                      <th className="p-3 text-right font-bold text-gray-700">Net Tutar</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {jobs.filter(j => j.status === 'Teslim Edildi').map((job) => (
                                      <tr key={job.id} className="border-b border-gray-200">
                                          <td className="p-3 font-mono text-gray-600">{job.tracking_code}</td>
                                          <td className="p-3 font-bold">{job.device}</td>
                                          <td className="p-3 text-gray-600">{new Date(job.created_at).toLocaleDateString('tr-TR')}</td>
                                          <td className="p-3">
                                              {job.discount_amount > 0 ? (
                                                  <div className="text-xs">
                                                      <span className="text-gray-500 line-through mr-2">₺{Number(job.original_price || (Number(job.price) + Number(job.discount_amount))).toLocaleString()}</span>
                                                      <span className="text-red-600 font-bold">%{job.discount_rate} İndirim</span>
                                                  </div>
                                              ) : "-"}
                                          </td>
                                          <td className="p-3 text-right font-mono font-bold">
                                              ₺{Number(job.price).toLocaleString()}
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                              <tfoot>
                                  <tr className="bg-gray-50 text-gray-600 text-sm">
                                      <td colSpan={4} className="p-2 text-right">İndirimsiz Ara Toplam:</td>
                                      <td className="p-2 text-right">₺{stats.grossTotal.toLocaleString()}</td>
                                  </tr>
                                  <tr className="bg-gray-50 text-red-600 text-sm font-bold">
                                      <td colSpan={4} className="p-2 text-right">Toplam İndirim:</td>
                                      <td className="p-2 text-right">-₺{stats.totalDiscount.toLocaleString()}</td>
                                  </tr>
                                  <tr className="bg-gray-100 font-black text-lg text-black border-t-2 border-black">
                                      <td colSpan={4} className="p-4 text-right">ÖDENECEK GENEL TOPLAM:</td>
                                      <td className="p-4 text-right">₺{stats.totalSpent.toLocaleString()}</td>
                                  </tr>
                              </tfoot>
                          </table>
                      </div>
                      
                      <div className="mt-12 text-center text-xs text-gray-400 print:fixed print:bottom-10 print:left-0 print:w-full">
                          Bu belge Aura Business sistemi tarafından otomatik oluşturulmuştur.
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- YENİ: ÜYELİK DURUMU MODALI (DÜZELTİLDİ) --- */}
      {isMembershipStatusOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
              <div className="bg-[#0b0e14] border border-amber-500/30 w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>
                  
                  <div className="p-6 relative z-10">
                      <div className="flex justify-between items-start mb-6">
                          <div>
                              <h3 className="text-xl font-black text-white flex items-center gap-2"><Crown size={24} className="text-amber-500"/> {dealer?.subscription_plan || "Standart"} Paket</h3>
                              <p className="text-xs text-slate-400 mt-1">Aktif Üyelik</p>
                          </div>
                          <button onClick={() => setIsMembershipStatusOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"><X size={20}/></button>
                      </div>

                      <div className="space-y-4 mb-6">
                          <div className="bg-[#151921] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                              <div>
                                  <div className="text-xs text-slate-400 mb-1">Destek Önceliği</div>
                                  <div className="text-white font-bold flex items-center gap-2"><Award size={14} className="text-amber-500"/> VIP Seviye</div>
                              </div>
                              <div className="text-right">
                                  <div className="text-xs text-slate-400 mb-1">Ciro Primi</div>
                                  <div className="text-green-400 font-bold">%2</div>
                              </div>
                          </div>
                          
                          <div className="bg-[#151921] p-4 rounded-xl border border-white/5">
                              <div className="flex justify-between text-xs mb-2">
                                  <span className="text-slate-400">Yedek Parça İndirimi</span>
                                  <span className="text-green-400 font-bold">%5 Aktif</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                  <CheckCircle2 size={12} className="text-green-500"/> Sonraki siparişte otomatik uygulanır
                              </div>
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <button onClick={() => { setIsMembershipStatusOpen(false); setIsPackagesModalOpen(true); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all">PAKET YÜKSELT</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- PAKETLER MODALI (WP LINK EKLENDİ) --- */}
      {isPackagesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
              <div className="bg-[#0b0e14] border border-white/10 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151921]">
                      <div><h3 className="text-xl font-black text-white flex items-center gap-2"><Crown size={24} className="text-amber-500"/> ÜYELİK PAKETLERİ</h3><p className="text-xs text-slate-500 mt-1">İşletmenize en uygun paketi seçerek avantajlardan yararlanın.</p></div>
                      <button onClick={() => setIsPackagesModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"><X size={20}/></button>
                  </div>
                  <div className="p-8 overflow-y-auto custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {PACKAGES.map(pkg => (
                              <div key={pkg.id} className={`relative p-8 rounded-3xl border flex flex-col ${pkg.popular ? 'bg-gradient-to-b from-amber-900/20 to-[#151921] border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.1)] scale-105 z-10' : 'bg-[#151921] border-white/10'}`}>
                                  {pkg.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-b-lg uppercase tracking-widest">En Çok Tercih Edilen</div>}
                                  <h4 className={`text-2xl font-black mb-2 ${pkg.id === 'platinum' ? 'text-amber-400' : pkg.id === 'gold' ? 'text-blue-400' : 'text-white'}`}>{pkg.name}</h4>
                                  <p className="text-3xl font-light text-white mb-6">{pkg.price}</p>
                                  <ul className="space-y-4 mb-8 flex-1">
                                      {pkg.features.map((feat, i) => (
                                          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                              <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${pkg.id === 'platinum' ? 'text-amber-500' : 'text-slate-500'}`}/>
                                              {feat}
                                          </li>
                                      ))}
                                  </ul>
                                  <button 
                                    onClick={() => window.open(`https://wa.me/905396321429?text=Merhaba, ${pkg.name} paketi hakkında detaylı bilgi almak istiyorum.`, '_blank')}
                                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${pkg.id === 'platinum' ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                  >
                                      {dealer?.subscription_plan === pkg.name ? 'MEVCUT PAKETİNİZ' : 'BİLGİ AL'}
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- ONARIM TALEBİ MODALI --- */}
      {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
                <div className="bg-[#151921] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0b0e14]">
                        <div><h3 className="text-lg font-black text-white flex items-center gap-2"><Zap size={20} className="text-cyan-500 fill-cyan-500"/> HIZLI SERVİS KAYDI</h3><p className="text-xs text-slate-500 mt-1">Cihaz bilgilerini girerek onarım sürecini başlatın.</p></div>
                        <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-all"><X size={18}/></button>
                    </div>
                    <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 bg-gradient-to-b from-[#151921] to-[#0b0e14]">
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">Cihaz Türü</label><div className="grid grid-cols-3 sm:grid-cols-6 gap-2">{CATEGORIES.map(cat => (<button key={cat} onClick={() => setNewRequest({...newRequest, category: cat})} className={`p-3 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center gap-2 ${newRequest.category === cat ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-900/50' : 'bg-[#0b0e14] border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300'}`}><Smartphone size={16}/>{cat}</button>))}</div></div>
                        <div className="grid grid-cols-2 gap-6"><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Marka</label><input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="Örn: Apple" value={newRequest.brand} onChange={e => setNewRequest({...newRequest, brand: e.target.value})}/></div><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Model</label><input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="Örn: iPhone 13" value={newRequest.model} onChange={e => setNewRequest({...newRequest, model: e.target.value})}/></div></div>
                        <div className="grid grid-cols-2 gap-6"><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Seri No / IMEI</label><input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all font-mono" placeholder="Zorunlu Değil" value={newRequest.serial_no} onChange={e => setNewRequest({...newRequest, serial_no: e.target.value})}/></div><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Ekran Şifresi</label><input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all" placeholder="Varsa Giriniz" value={newRequest.password} onChange={e => setNewRequest({...newRequest, password: e.target.value})}/></div></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><AlertCircle size={12} className="text-red-500"/> Arıza / Şikayet Detayı</label><textarea className="w-full bg-[#0b0e14] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-cyan-500 outline-none h-24 resize-none transition-all placeholder-slate-600" value={newRequest.problem} onChange={e => setNewRequest({...newRequest, problem: e.target.value})} placeholder="Cihazdaki sorunu detaylıca açıklayınız..."></textarea></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Cihaz Fotoğrafları</label><div className="grid grid-cols-4 sm:grid-cols-5 gap-3">{previewUrls.map((url, idx) => (<div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group"><img src={url} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"></div></div>))}<label className="aspect-square border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-cyan-500 hover:bg-cyan-500/5 transition-colors group"><Upload size={20} className="text-slate-500 group-hover:text-cyan-500 transition-colors"/><span className="text-[9px] font-bold text-slate-500 group-hover:text-cyan-500 uppercase">Yükle</span><input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} /></label></div></div>
                    </div>
                    <div className="p-6 border-t border-white/10 bg-[#0b0e14]"><button onClick={handleSubmitRequest} disabled={submitting} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? <Loader2 className="animate-spin"/> : <Save size={20}/>}{submitting ? "Kayıt Açılıyor..." : "TALEBİ OLUŞTUR VE GÖNDER"}</button></div>
                </div>
            </div>
      )}

      <style jsx global>{`
          @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .animate-gradient { background-size: 200% auto; animation: gradient 3s ease infinite; }
          .glitch-hover:hover { animation: glitch-anim 0.3s cubic-bezier(.25, .46, .45, .94) both infinite; color: #06b6d4; }
          @keyframes glitch-anim { 0% { transform: translate(0) } 20% { transform: translate(-2px, 2px) } 40% { transform: translate(-2px, -2px) } 60% { transform: translate(2px, 2px) } 80% { transform: translate(2px, -2px) } 100% { transform: translate(0) } }
          @media print {
            body * { visibility: hidden; }
            .fixed.inset-0.z-50.flex, .fixed.inset-0.z-50.flex * { visibility: visible; }
            .fixed.inset-0.z-50.flex { position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: white; padding: 0; }
            .print\\:hidden { display: none !important; }
            .print\\:p-0 { padding: 0 !important; }
            .print\\:overflow-visible { overflow: visible !important; }
          }
      `}</style>

    </div>
  );
}