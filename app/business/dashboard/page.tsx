"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { 
  Search, Plus, LayoutGrid, List, LogOut, 
  Smartphone, Clock, CheckCircle2, AlertCircle, 
  Wallet, ChevronRight, TrendingUp, Settings, BarChart3,
  Crown, Phone, MessageCircle, User, FileText, X, Camera, Upload, Loader2, Save
} from "lucide-react";

// Kategori Listesi
const CATEGORIES = ["Cep Telefonu", "Robot Süpürge", "Bilgisayar", "Tablet", "Akıllı Saat", "Diğer"];

export default function DealerDashboard() {
  const router = useRouter();
  
  const [dealer, setDealer] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, pending, ready
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Yeni Talep State
  const [newRequest, setNewRequest] = useState({
      category: "Cep Telefonu",
      brand: "",
      model: "",
      serial_no: "",
      problem: "",
      password: "" // Ekran şifresi opsiyonel
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // İstatistikler
  const [stats, setStats] = useState({
    activeCount: 0,
    readyCount: 0,
    totalSpent: 0,
    pendingApproval: 0
  });

  // Müşteri Temsilcisi (Platinum İçin Mock Data - Gerçekte DB'den gelebilir)
  const salesRep = {
      name: "Buse Yılmaz",
      phone: "0555 123 45 67",
      title: "Kıdemli Müşteri Temsilcisi",
      avatar: "https://i.pravatar.cc/150?u=buse"
  };

  useEffect(() => {
    const init = async () => {
        const storedUser = localStorage.getItem('aura_dealer_user');
        if (!storedUser) {
            router.push('/kurumsal/login');
            return;
        }
        const parsedDealer = JSON.parse(storedUser);
        
        // Bayi detaylarını DB'den tazeleyelim (Paket değişmiş olabilir)
        const { data: freshDealer } = await supabase
            .from('bayi_basvurulari')
            .select('*')
            .eq('id', parsedDealer.id)
            .single();

        const currentDealer = freshDealer || parsedDealer;
        setDealer(currentDealer);
        fetchDealerJobs(currentDealer.sirket_adi);
    };
    init();
  }, []);

  const fetchDealerJobs = async (dealerName: string) => {
    setLoading(true);
    const { data, error } = await supabase
        .from('aura_jobs')
        .select('*')
        // Müşteri adı bayi adı olan VEYA bayi adı içerenler
        .or(`customer.eq.${dealerName},customer.ilike.%${dealerName}%`)
        .order('created_at', { ascending: false });

    if (data) {
        setJobs(data);
        calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (data: any[]) => {
      const active = data.filter(j => !['Teslim Edildi', 'İade', 'İptal'].includes(j.status)).length;
      const ready = data.filter(j => ['Hazır', 'Teslim Edildi'].includes(j.status)).length;
      const approval = data.filter(j => j.status === 'Onay Bekliyor' || j.approval_status === 'pending').length;
      const spent = data
        .filter(j => ['Hazır', 'Teslim Edildi'].includes(j.status))
        .reduce((sum, j) => sum + Number(j.price || 0), 0);

      setStats({
          activeCount: active,
          readyCount: ready,
          pendingApproval: approval,
          totalSpent: spent
      });
  };

  // --- YENİ TALEP OLUŞTURMA ---
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
          alert("Lütfen Marka, Model ve Arıza bilgisini giriniz.");
          return;
      }
      setSubmitting(true);

      try {
          // 1. Resimleri Yükle
          let uploadedImageUrls: string[] = [];
          for (const file of selectedFiles) {
              const fileExt = file.name.split('.').pop();
              const fileName = `dealer-upload-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
              const { error } = await supabase.storage.from('service-images').upload(fileName, file);
              if (!error) {
                  const { data } = supabase.storage.from('service-images').getPublicUrl(fileName);
                  uploadedImageUrls.push(data.publicUrl);
              }
          }

          // 2. Takip Kodu
          const trackingCode = `SRV-${Math.floor(100000 + Math.random() * 900000)}`;

          // 3. Kaydet
          const { error } = await supabase.from('aura_jobs').insert([{
              customer: dealer.sirket_adi,
              customer_email: dealer.email,
              phone: dealer.telefon,
              customer_type: "Bayi",
              
              category: newRequest.category,
              brand: newRequest.brand,
              model: newRequest.model,
              device: `${newRequest.brand} ${newRequest.model}`,
              serial_no: newRequest.serial_no,
              password: newRequest.password,
              
              problem: newRequest.problem,
              status: "Bekliyor",
              tracking_code: trackingCode,
              
              images: uploadedImageUrls, // Saf Dizi (Supabase JSON olarak kaydeder)
              sold_upsells: [], // Boş dizi
              process_details: [{
                  date: new Date().toISOString(),
                  action: "Talep Oluşturuldu",
                  user: dealer.yetkili_kisi || "Bayi",
                  details: "Onarım talebi bayi panelinden açıldı."
              }],
              
              created_at: new Date().toISOString()
          }]);

          if(error) throw error;

          alert("✅ Onarım talebiniz başarıyla oluşturuldu.");
          setIsModalOpen(false);
          // Formu Sıfırla
          setNewRequest({ category: "Cep Telefonu", brand: "", model: "", serial_no: "", problem: "", password: "" });
          setSelectedFiles([]);
          setPreviewUrls([]);
          // Listeyi Yenile
          fetchDealerJobs(dealer.sirket_adi);

      } catch (error: any) {
          alert("Hata: " + error.message);
      } finally {
          setSubmitting(false);
      }
  };

  const handleLogout = () => {
      if(confirm("Çıkış yapmak istiyor musunuz?")) {
          localStorage.removeItem('aura_dealer_user');
          router.push('/kurumsal/login');
      }
  };

  // --- FİLTRELEME ---
  const filteredJobs = jobs.filter(job => {
      const matchesSearch = job.device.toLowerCase().includes(searchTerm.toLowerCase()) || job.tracking_code.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (filterStatus === 'all') return true;
      if (filterStatus === 'active') return !['Teslim Edildi', 'İade', 'İptal', 'Hazır'].includes(job.status);
      if (filterStatus === 'ready') return ['Hazır', 'Teslim Edildi'].includes(job.status);
      if (filterStatus === 'pending') return job.status === 'Onay Bekliyor' || job.approval_status === 'pending';
      return true;
  });

  const getStatusColor = (status: string) => {
      const s = status.toLowerCase();
      if (s.includes("hazır") || s.includes("teslim")) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      if (s.includes("onay")) return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      if (s.includes("bekliyor")) return "text-slate-400 bg-slate-400/10 border-slate-400/20";
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
  };

  if (loading) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2"/> Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 font-sans pb-20">
        
        {/* ÜST BAR */}
        <header className="bg-[#151921] border-b border-white/5 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center font-black text-white">A</div>
                    <span className="font-bold text-white tracking-wide">BAYİ PANELİ</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-sm text-white font-bold">{dealer?.sirket_adi}</div>
                        <div className="text-[10px] text-slate-500">{dealer?.subscription_plan || "Standart"} Paket</div>
                    </div>
                    <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-red-400 transition-colors">
                        <LogOut size={18}/>
                    </button>
                </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
            
            {/* PLATINUM ÖZEL ALAN */}
            {dealer?.subscription_plan === 'Platinum' && (
                <div className="mb-8 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Crown size={120} className="text-amber-500"/></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-2 border-amber-500/50 p-1">
                                <img src={salesRep.avatar} alt="Rep" className="w-full h-full rounded-full object-cover"/>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-white">{salesRep.name}</h3>
                                    <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">Özel Temsilciniz</span>
                                </div>
                                <p className="text-sm text-amber-200/70">{salesRep.title}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold transition-all"><MessageCircle size={16}/> WhatsApp</button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-all border border-white/10"><Phone size={16}/> Ara</button>
                        </div>
                    </div>
                </div>
            )}

            {/* İSTATİSTİKLER & AKSİYON */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#151921] p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">Aktif İşler</div>
                    <div className="text-3xl font-black text-white">{stats.activeCount}</div>
                    <div className="h-1 w-full bg-slate-800 mt-3 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-1/2"></div></div>
                </div>
                <div className="bg-[#151921] p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">Onay Bekleyen</div>
                    <div className="text-3xl font-black text-amber-500">{stats.pendingApproval}</div>
                    <div className="h-1 w-full bg-slate-800 mt-3 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-1/3"></div></div>
                </div>
                <div className="bg-[#151921] p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">Toplam Harcama</div>
                    <div className="text-3xl font-black text-green-400">₺{stats.totalSpent.toLocaleString()}</div>
                    <div className="h-1 w-full bg-slate-800 mt-3 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-3/4"></div></div>
                </div>
                
                {/* ONARIM TALEBİ OLUŞTUR BUTONU */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
                >
                    <Plus size={32}/>
                    <span className="font-bold text-sm">YENİ ONARIM TALEBİ</span>
                </button>
            </div>

            {/* FİLTRELER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex bg-[#151921] p-1 rounded-xl border border-white/5">
                    {[
                        { id: 'all', label: 'Tümü' },
                        { id: 'active', label: 'İşlemde' },
                        { id: 'pending', label: 'Onay Bekleyen' },
                        { id: 'ready', label: 'Tamamlanan' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setFilterStatus(tab.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === tab.id ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                    <input 
                        type="text" 
                        placeholder="Cihaz, Takip Kodu..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#151921] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                </div>
            </div>

            {/* LİSTE */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-20 text-slate-500">Yükleniyor...</div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 bg-[#151921] rounded-2xl border border-dashed border-white/5">
                        Kayıt bulunamadı.
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <div key={job.id} onClick={() => router.push(`/business/cihaz-takip/${job.id}`)} className="bg-[#151921] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-cyan-500/30 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-12 h-12 bg-[#0b0e14] rounded-lg flex items-center justify-center text-slate-500 group-hover:text-cyan-500 transition-colors">
                                    <Smartphone size={24}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{job.device}</h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{job.tracking_code}</span>
                                        <span>{new Date(job.created_at).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(job.status)}`}>
                                    {job.status}
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500">Tutar</div>
                                    <div className="text-sm font-bold text-white">₺{Number(job.price).toLocaleString()}</div>
                                </div>
                                <ChevronRight className="text-slate-600 group-hover:text-white transition-colors"/>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>

        {/* --- ONARIM TALEBİ MODALI --- */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-[#151921] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#0b0e14] rounded-t-2xl">
                        <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-cyan-500"/> Yeni Onarım Talebi</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                        
                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-1.5 block">Cihaz Türü</label>
                            <div className="grid grid-cols-3 gap-2">
                                {CATEGORIES.map(cat => (
                                    <button 
                                        key={cat} 
                                        onClick={() => setNewRequest({...newRequest, category: cat})}
                                        className={`p-2 rounded-lg text-[10px] font-bold border transition-all ${newRequest.category === cat ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-[#0b0e14] border-white/10 text-slate-400 hover:border-white/30'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-slate-400 mb-1 block">Marka</label><input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none" value={newRequest.brand} onChange={e => setNewRequest({...newRequest, brand: e.target.value})}/></div>
                            <div><label className="text-xs font-bold text-slate-400 mb-1 block">Model</label><input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none" value={newRequest.model} onChange={e => setNewRequest({...newRequest, model: e.target.value})}/></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-slate-400 mb-1 block">Seri No / IMEI</label><input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none" value={newRequest.serial_no} onChange={e => setNewRequest({...newRequest, serial_no: e.target.value})}/></div>
                            <div><label className="text-xs font-bold text-slate-400 mb-1 block">Ekran Şifresi</label><input type="text" className="w-full bg-[#0b0e14] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none" value={newRequest.password} onChange={e => setNewRequest({...newRequest, password: e.target.value})}/></div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-1 block">Arıza / Şikayet</label>
                            <textarea className="w-full bg-[#0b0e14] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none h-24 resize-none" value={newRequest.problem} onChange={e => setNewRequest({...newRequest, problem: e.target.value})} placeholder="Cihazın sorunu nedir?"></textarea>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-2 block">Fotoğraflar (Opsiyonel)</label>
                            <div className="grid grid-cols-4 gap-2">
                                {previewUrls.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                                        <img src={url} className="w-full h-full object-cover"/>
                                    </div>
                                ))}
                                <label className="aspect-square border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-cyan-500 hover:bg-cyan-500/5 transition-colors">
                                    <Upload size={20} className="text-slate-500"/>
                                    <span className="text-[9px] font-bold text-slate-500">Ekle</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                                </label>
                            </div>
                        </div>

                    </div>

                    <div className="p-5 border-t border-white/10 bg-[#0b0e14] rounded-b-2xl">
                        <button 
                            onClick={handleSubmitRequest} 
                            disabled={submitting}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="animate-spin"/> : <Save size={18}/>}
                            {submitting ? "Oluşturuluyor..." : "Talebi Oluştur"}
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
}