"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { 
  ArrowLeft, ShoppingBag, Plus, CheckCircle2, AlertCircle, 
  Activity, User, Zap, Camera, Wrench, Cpu, X, Calendar, 
  FileText, Printer, Phone, MapPin
} from "lucide-react";

export default function DealerDeviceDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  const [job, setJob] = useState<any>(null);
  const [dealer, setDealer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  // GÜVENLİ VERİ KAPLARI
  const [safeUpsells, setSafeUpsells] = useState<any[]>([]);
  const [safeRecommended, setSafeRecommended] = useState<any[]>([]);
  const [safeImages, setSafeImages] = useState<string[]>([]);
  const [safeLogs, setSafeLogs] = useState<any[]>([]);

  const STEPS = ["Kayıt Açıldı", "İşlemde", "Parça/Test", "Hazır / Teslim"];

  // --- EVRENSEL VERİ ÇÖZÜCÜ ---
  const parseArray = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        if (val === "null" || val.trim() === "") return [];
        try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    }
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      // 1. Auth Kontrol
      const storedUser = localStorage.getItem('aura_dealer_user');
      if (!storedUser) { router.push('/kurumsal/login'); return; }
      const dealerData = JSON.parse(storedUser);
      setDealer(dealerData);

      // 2. Veri Çek
      const { data, error } = await supabase
        .from('aura_jobs')
        .select('*')
        .or(`id.eq.${id},tracking_code.eq.${id}`)
        .maybeSingle();
      
      if (error || !data) { 
          alert("Kayıt bulunamadı."); 
          router.push('/business/dashboard'); 
          return; 
      }
      
      // Güvenlik kontrolü
      if (data.customer_type === 'Bayi') {
           if(!data.customer.toLowerCase().includes(dealerData.sirket_adi.toLowerCase()) && 
              !dealerData.sirket_adi.toLowerCase().includes(data.customer.toLowerCase())){
              alert("Bu kaydı görüntüleme yetkiniz yok."); 
              router.push('/business/dashboard'); 
              return; 
           }
      }

      setJob(data);

      setSafeUpsells(parseArray(data.sold_upsells));
      setSafeRecommended(parseArray(data.recommended_upsells));
      setSafeImages(parseArray(data.images));
      
      const logs = parseArray(data.process_details).map((log:any) => ({
          date: log.date || new Date().toISOString(),
          action: log.action || "İşlem",
          user: log.user || "Sistem",
          details: log.details || ""
      }));
      setSafeLogs(logs);

      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  // --- İŞLEMLER ---
  const handleApproval = async (decision: 'approved' | 'rejected') => {
      if(!confirm(decision === 'approved' ? "Ek ücreti ve işlemi onaylıyor musunuz?" : "İşlemi reddedip iade istiyor musunuz?")) return;
      
      setProcessing(true);
      const newStatus = decision === 'approved' ? 'İşlemde' : 'İade'; 
      const newPrice = decision === 'approved' ? (Number(job.price || 0) + Number(job.approval_amount || 0)) : job.price;

      const { error } = await supabase.from('aura_jobs').update({
          status: newStatus,
          approval_status: decision,
          price: newPrice, 
          updated_at: new Date().toISOString()
      }).eq('id', job.id);

      if(!error) {
          alert("✅ İşlem kaydedildi.");
          window.location.reload();
      } else {
          alert("Hata: " + error.message);
      }
      setProcessing(false);
  };

  const handleBuyUpsell = async (item: any) => {
      const standardizedItem = {
          id: item.id || Math.random().toString(36).substr(2, 9),
          name: typeof item === 'object' ? (item.name || item.urun_adi || "Ekstra Ürün") : item,
          price: typeof item === 'object' ? (Number(item.price) || Number(item.satis_fiyati) || 0) : 0
      };

      if(!confirm(`${standardizedItem.name} ürününü ${standardizedItem.price} TL karşılığında eklemek istiyor musunuz?`)) return;
      setProcessing(true);

      const newUpsells = [...safeUpsells, standardizedItem];
      const newRecommended = safeRecommended.filter((i:any) => i.id !== item.id);
      const newPrice = Number(job.price || 0) + Number(standardizedItem.price);

      const { error } = await supabase.from('aura_jobs').update({
          sold_upsells: JSON.stringify(newUpsells), 
          recommended_upsells: JSON.stringify(newRecommended), 
          price: String(newPrice),
          updated_at: new Date().toISOString()
      }).eq('id', job.id);

      if(!error) {
          alert("✅ Ürün eklendi!");
          window.location.reload();
      } else {
          console.error(error);
          alert("Hata oluştu: " + error.message);
      }
      setProcessing(false);
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white"><div className="flex flex-col items-center gap-4"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div><p>Veriler Yükleniyor...</p></div></div>;

  const getCurrentStep = (status: string) => {
      if(!status) return 1;
      const s = status.toLowerCase();
      if (s.includes("teslim") || s.includes("iade") || s.includes("iptal")) return 4;
      if (s.includes("hazır") || s.includes("tamam") || s.includes("bit")) return 3;
      if (s.includes("işlem") || s.includes("parça") || s.includes("onay") || s.includes("test")) return 2;
      return 1;
  };
  const currentStep = getCurrentStep(job.status);
  const isFinished = currentStep >= 3;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 pb-20">
      
      {/* HEADER BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pt-8 relative z-10">
         
         {/* NAVİGASYON */}
         <div className="flex justify-between items-center mb-8">
             <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all font-bold text-sm backdrop-blur-md border border-white/5">
                <ArrowLeft size={16}/> LİSTEYE DÖN
             </button>
             <button onClick={() => setShowReport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 hover:text-cyan-300 transition-all font-bold text-sm border border-cyan-500/30 shadow-lg shadow-cyan-900/20">
                <FileText size={16}/> SERVİS RAPORU
             </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">
             
             {/* --- ONAY BEKLEYEN İŞLEM --- */}
             {job.approval_status === 'pending' && (
                 <div className="lg:col-span-12">
                     <div className="relative overflow-hidden rounded-[2rem] border-2 border-purple-500 bg-[#0F1623] p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                             <div className="flex-1 text-center md:text-left">
                                 <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                                     <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/50 animate-bounce">
                                         <Zap size={24} />
                                     </div>
                                     <h2 className="text-2xl font-black text-white uppercase tracking-tight">Onay Bekleniyor</h2>
                                 </div>
                                 <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                     Cihazınızda ekstra işlem veya parça değişimi gerekiyor. Devam etmek için lütfen onay veriniz.
                                 </p>
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-left">
                                     <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                                         <span className="text-xs font-bold text-slate-500 uppercase">Ekstra Tutar</span>
                                         <span className="text-xl font-black text-purple-400">+{job.approval_amount} ₺</span>
                                     </div>
                                     <div>
                                         <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Açıklama</span>
                                         <p className="text-sm text-white font-medium italic">"{job.approval_desc}"</p>
                                     </div>
                                 </div>
                             </div>
                             <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px]">
                                 <button disabled={processing} onClick={() => handleApproval('approved')} className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                                     <CheckCircle2 size={18}/> ONAYLA
                                 </button>
                                 <button disabled={processing} onClick={() => handleApproval('rejected')} className="w-full py-3 px-6 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold transition-all flex items-center justify-center gap-2">
                                     <X size={16}/> REDDET
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}

             {/* --- UPSELL --- */}
             {safeRecommended.length > 0 && (
                 <div className="lg:col-span-12">
                     <div className="relative overflow-hidden rounded-[2rem] border border-pink-500/30 bg-[#0F1623] p-6 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                         <div className="flex items-center gap-4 mb-6">
                             <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 border border-pink-500/50"><ShoppingBag size={20} /></div>
                             <div><h2 className="text-xl font-black text-white uppercase">Önerilen Ürünler</h2><p className="text-xs text-slate-400">Cihazınız için tavsiye edilen aksesuarlar.</p></div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             {safeRecommended.map((item:any, index:number) => (
                                 <div key={index} className="bg-white/5 border border-pink-500/20 rounded-xl p-4 flex justify-between items-center hover:bg-pink-500/10 transition-colors">
                                     <div>
                                         <h4 className="text-sm font-bold text-white mb-1">
                                             {typeof item === 'object' ? (item.name || item.urun_adi || "Ürün") : item}
                                         </h4>
                                         <span className="text-xs text-pink-300 font-mono font-bold">
                                             {typeof item === 'object' ? (item.price || item.satis_fiyati || 0) : 0} ₺
                                         </span>
                                     </div>
                                     <button onClick={() => handleBuyUpsell(item)} disabled={processing} className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2"><Plus size={14}/> EKLE</button>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
             )}

             {/* SOL KOLON */}
             <div className="lg:col-span-8 space-y-6">
                 {/* CİHAZ KARTI */}
                 <div className="relative bg-[#0F1623]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl overflow-hidden group">
                     <div className="flex flex-wrap items-start justify-between gap-4 mb-8 relative z-10">
                         <div>
                             <div className="flex items-center gap-3 mb-2">
                                 <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest">{job.category || "SERVİS"}</span>
                                 <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 font-mono">#{job.tracking_code}</span>
                             </div>
                             <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">{job.device}</h2>
                         </div>
                         <div className="text-right hidden md:block">
                            <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Durum</div>
                            <div className={`text-xl font-bold flex items-center justify-end gap-2 ${job.status === 'Teslim Edildi' ? 'text-green-400' : 'text-amber-500'}`}>
                                {job.status === 'Teslim Edildi' ? <CheckCircle2 size={20}/> : <Activity size={20}/>} {job.status}
                            </div>
                         </div>
                     </div>
                     {/* TIMELINE */}
                     <div className="relative pt-4 pb-2">
                         <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                             <div className={`h-full transition-all duration-1000 ease-out relative ${isFinished ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-cyan-600 to-blue-500'}`} style={{ width: `${(currentStep / 4) * 100}%` }}>
                                 <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px] animate-pulse"></div>
                             </div>
                         </div>
                         <div className="grid grid-cols-4 gap-2">
                             {STEPS.map((s, i) => {
                                 const active = i + 1 <= currentStep;
                                 return (
                                     <div key={i} className={`flex flex-col items-center text-center gap-2 ${active ? 'opacity-100' : 'opacity-30'}`}>
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${active ? 'bg-cyan-500 text-[#020617]' : 'bg-slate-800 text-slate-500'}`}>{active ? <CheckCircle2 size={16}/> : i + 1}</div>
                                         <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">{s}</span>
                                     </div>
                                 )
                             })}
                         </div>
                     </div>
                 </div>

                 {/* DETAYLAR */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-[#0F1623]/60 border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                         <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Cpu size={16}/> Teknik Kimlik</h3>
                         <div className="space-y-3">
                             <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-sm text-slate-400">Seri No</span><span className="text-sm font-mono text-cyan-400">{job.serial_no || "-"}</span></div>
                             <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-sm text-slate-400">Kayıt Tarihi</span><span className="text-sm font-bold text-white">{new Date(job.created_at).toLocaleDateString('tr-TR')}</span></div>
                         </div>
                     </div>
                     <div className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/10 rounded-3xl p-6 relative overflow-hidden">
                         <Activity className="absolute top-[-10px] right-[-10px] text-red-500/10 w-32 h-32"/>
                         <h3 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><AlertCircle size={16}/> Arıza / Şikayet</h3>
                         <p className="text-slate-200 font-medium italic leading-relaxed">"{job.problem}"</p>
                     </div>
                 </div>
             </div>
             
             {/* SAĞ KOLON */}
             <div className="lg:col-span-4 space-y-6">
                 {/* FİYAT */}
                 <div className="bg-gradient-to-b from-[#1a2333] to-[#0f1623] border border-cyan-500/20 rounded-[2rem] p-8 text-center relative overflow-hidden group">
                     <div className="relative z-10">
                         <p className="text-cyan-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">TOPLAM TUTAR</p>
                         <div className="text-5xl font-black text-white mb-6 tracking-tight drop-shadow-xl">
                            {Number(job.price || 0).toLocaleString('tr-TR')}<span className="text-2xl text-slate-500 ml-1">₺</span>
                         </div>
                         {safeUpsells.length > 0 && (
                            <div className="text-xs text-left bg-black/20 p-3 rounded-lg space-y-1">
                                <p className="font-bold text-slate-400 border-b border-white/10 pb-1 mb-1">Eklemeler:</p>
                                {safeUpsells.map((u, i) => (
                                    <div key={i} className="flex justify-between text-slate-300">
                                        <span>{u.name || u.urun_adi || "Ekstra"}</span>
                                        <span>{u.price || u.satis_fiyati}₺</span>
                                    </div>
                                ))}
                            </div>
                         )}
                     </div>
                 </div>
                 {/* RAPOR */}
                 <div className="bg-[#0F1623] border border-slate-800 rounded-3xl p-6 flex flex-col min-h-[300px]">
                     <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                         <h3 className="font-bold text-white flex items-center gap-2"><Wrench size={18} className="text-slate-400"/> İşlem Raporu</h3>
                     </div>
                     <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                         <p className="font-mono text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                             {job.technician_note || "Henüz işlem raporu girilmedi."}
                         </p>
                     </div>
                 </div>
             </div>
             
             {/* GÖRSELLER */}
             {safeImages.length > 0 && (
                 <div className="lg:col-span-12 bg-[#0F1623]/50 border border-white/5 rounded-3xl p-8">
                     <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-3"><Camera size={24} className="text-purple-400"/> Servis Görselleri</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                         {safeImages.map((img: string, i: number) => (
                             <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-700 cursor-pointer bg-slate-900" onClick={() => setSelectedImage(img)}>
                                 <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"/>
                             </div>
                         ))}
                     </div>
                 </div>
             )}
         </div>

         {/* --- LIGHTBOX --- */}
         {selectedImage && (
             <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
                 <img src={selectedImage} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border border-white/10"/>
                 <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"><X size={40}/></button>
             </div>
         )}

         {/* --- SERVİS RAPORU MODALI --- */}
         {showReport && (
            <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white text-black w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                    {/* Toolbar */}
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
                        <h3 className="font-bold flex items-center gap-2"><FileText size={20}/> Servis Raporu Önizleme</h3>
                        <div className="flex gap-2">
                            <button onClick={() => window.print()} className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><Printer size={16}/> Yazdır</button>
                            <button onClick={() => setShowReport(false)} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><X size={16}/> Kapat</button>
                        </div>
                    </div>
                    {/* A4 Kağıt */}
                    <div className="flex-1 overflow-y-auto bg-slate-100 p-8 custom-scrollbar">
                        <div id="printable-area" className="bg-white mx-auto shadow-xl p-12 min-h-[1100px] w-[210mm] relative text-sm">
                            {/* Logo ve Başlık (DÜZELTİLDİ: IMG KULLANILDI) */}
                            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <img src="/image/aura-logo.png" alt="Aura Logo" className="h-20 w-auto object-contain"/>
                                    <div>
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">AURA BİLİŞİM</h1>
                                        <p className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase">TEKNİK SERVİS FORMU</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-500">Form No</div>
                                    <div className="text-2xl font-black text-slate-900 font-mono">#{job.tracking_code}</div>
                                    <div className="text-xs text-slate-400 mt-1">{new Date().toLocaleDateString('tr-TR')}</div>
                                </div>
                            </div>
                            {/* Tablolar */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="border border-slate-200 rounded-lg p-4">
                                    <h3 className="font-bold border-b border-slate-200 mb-3 pb-1 text-xs uppercase text-slate-500">Müşteri Bilgileri</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><span className="text-slate-500">İsim:</span> <span className="font-bold">{job.customer}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Telefon:</span> <span className="font-bold font-mono">{job.phone}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Tip:</span> <span>{job.customer_type}</span></div>
                                    </div>
                                </div>
                                <div className="border border-slate-200 rounded-lg p-4">
                                    <h3 className="font-bold border-b border-slate-200 mb-3 pb-1 text-xs uppercase text-slate-500">Cihaz Bilgileri</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><span className="text-slate-500">Cihaz:</span> <span className="font-bold">{job.device}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Seri No:</span> <span className="font-bold font-mono">{job.serial_no}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Kategori:</span> <span>{job.category}</span></div>
                                    </div>
                                </div>
                            </div>
                            {/* Detaylar */}
                            <div className="mb-8 space-y-6">
                                <div>
                                    <h4 className="font-bold text-xs uppercase text-slate-500 border-b border-slate-200 pb-1 mb-2">Müşteri Şikayeti / Arıza</h4>
                                    <p className="bg-slate-50 p-3 rounded border border-slate-100 italic text-slate-700">{job.problem}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs uppercase text-slate-500 border-b border-slate-200 pb-1 mb-2">Yapılan İşlemler</h4>
                                    <p className="bg-slate-50 p-3 rounded border border-slate-100 text-slate-700 whitespace-pre-line min-h-[100px]">{job.technician_note || "İşlem notu girilmedi."}</p>
                                </div>
                            </div>
                            {/* Toplam */}
                            <div className="border-t-2 border-slate-900 pt-6">
                                <div className="flex justify-between items-start">
                                    <div className="w-1/2 pr-8 text-[10px] text-slate-500 text-justify">
                                        <p className="mb-2 font-bold uppercase">Garanti ve Teslimat Şartları:</p>
                                        <p>1. Teslim edilen cihazlar 90 gün içerisinde alınmalıdır.</p>
                                        <p>2. Sıvı temaslı cihazlarda onarım sonrası garanti verilmemektedir.</p>
                                        <p>3. Veri yedekleme sorumluluğu müşteriye aittir.</p>
                                        <p>4. Yapılan işlem ve değişen parça 6 ay garantilidir.</p>
                                    </div>
                                    <div className="w-1/2 pl-8 text-right">
                                        {safeUpsells.length > 0 && (
                                            <div className="mb-4 text-xs text-slate-600">
                                                <p className="font-bold mb-1">Ekstralar:</p>
                                                {safeUpsells.map((u, i) => <div key={i}>{u.name} ({u.price}₺)</div>)}
                                            </div>
                                        )}
                                        <div className="text-4xl font-black text-slate-900">{Number(job.price || 0).toLocaleString()} ₺</div>
                                        <div className="text-xs text-slate-400">KDV Dahil Değildir</div>
                                    </div>
                                </div>
                            </div>
                            {/* İmza */}
                            <div className="flex justify-between mt-16 pt-8 border-t border-slate-200">
                                <div className="text-center"><p className="text-xs font-bold uppercase text-slate-500 mb-12">Teslim Alan (Müşteri)</p><div className="border-t border-slate-400 w-40 mx-auto"></div></div>
                                <div className="text-center"><p className="text-xs font-bold uppercase text-slate-500 mb-12">Teslim Eden (Teknisyen)</p><div className="border-t border-slate-400 w-40 mx-auto"></div></div>
                            </div>
                            <div className="absolute bottom-12 left-0 w-full text-center text-[10px] text-slate-400">www.aurabilisim.com • 0850 123 45 67 • info@aurabilisim.com</div>
                        </div>
                    </div>
                </div>
            </div>
         )}
         <style jsx global>{`
             @media print {
                 @page { size: A4; margin: 0; }
                 body * { visibility: hidden; }
                 #printable-area, #printable-area * { visibility: visible; }
                 #printable-area { position: fixed; left: 0; top: 0; width: 100%; height: 100%; margin: 0; padding: 20px; background: white; z-index: 9999; }
             }
         `}</style>
      </div>
    </div>
  );
}