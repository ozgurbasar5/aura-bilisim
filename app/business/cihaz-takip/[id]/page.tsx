"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { 
  ArrowLeft, ShoppingBag, Plus, Star, Send, Search, CheckCircle2, AlertCircle, 
  Activity, User, MessageCircle, Zap, Battery, Fan, Eye, ShieldCheck, Camera, 
  Wrench, Cpu, Radio, X, MonitorPlay
} from "lucide-react";

export default function DealerDeviceDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  const [job, setJob] = useState<any>(null);
  const [dealer, setDealer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const STEPS = ["Kayıt Açıldı", "İşlemde", "Parça/Test", "Hazır / Teslim"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      // 1. Auth Kontrol
      const storedUser = localStorage.getItem('aura_dealer_user');
      if (!storedUser) { router.push('/kurumsal/login'); return; }
      const dealerData = JSON.parse(storedUser);
      setDealer(dealerData);

      // 2. Veri Çek
      const { data, error } = await supabase.from('aura_jobs').select('*').eq('id', id).single();
      
      if (error || !data) { alert("Kayıt bulunamadı."); router.push('/business/dashboard'); return; }
      
      // Güvenlik kontrolü: Sadece kendi işini görebilsin
      if (data.customer !== dealerData.sirket_adi && data.customer_type === 'Bayi') { 
          // İsim eşleşmiyorsa, belki bayi prefixi vardır kontrolü yapılabilir ama şimdilik katı kural:
           if(!data.customer.includes(dealerData.sirket_adi)){
              alert("Yetkisiz işlem."); 
              router.push('/business/dashboard'); 
              return; 
           }
      }

      setJob(data);
      setLoading(false);
  };

  // --- İŞLEMLER ---

  // Onay / Red
  const handleApproval = async (decision: 'approved' | 'rejected') => {
      if(!confirm(decision === 'approved' ? "Ek ücreti ve işlemi onaylıyor musunuz?" : "İşlemi reddedip iade istiyor musunuz?")) return;
      
      setProcessing(true);
      const newStatus = decision === 'approved' ? 'İşlemde' : 'İade'; 
      // Onaylanırsa fiyatı güncelle
      const newPrice = decision === 'approved' ? (Number(job.price) + Number(job.approval_amount)) : job.price;

      const { error } = await supabase.from('aura_jobs').update({
          status: newStatus,
          approval_status: decision,
          price: newPrice,
          updated_at: new Date().toISOString()
      }).eq('id', id);

      if(!error) {
          alert("✅ İşlem kaydedildi.");
          window.location.reload();
      } else {
          alert("Hata: " + error.message);
      }
      setProcessing(false);
  };

  // Ek Ürün Satın Alma (Upsell)
  const handleBuyUpsell = async (item: any) => {
      if(!confirm(`${item.name} ürününü ${item.price} TL karşılığında eklemek istiyor musunuz?`)) return;
      setProcessing(true);

      const currentUpsells = job.sold_upsells || [];
      const newUpsells = [...currentUpsells, item];
      
      // Listeden çıkar (Artık satıldı olarak işaretle veya listeden sil)
      // Burada güvenli upsell listesini kullanacağız ama veritabanına yazarken job.recommended_upsells kullanıyoruz
      let currentRec = [];
      try {
        currentRec = typeof job.recommended_upsells === 'string' ? JSON.parse(job.recommended_upsells) : job.recommended_upsells;
      } catch (e) { currentRec = []; }
      
      const newRecommended = (Array.isArray(currentRec) ? currentRec : []).filter((i:any) => i.id !== item.id);
      
      // Fiyatı güncelle
      const newPrice = Number(job.price) + Number(item.price);

      const { error } = await supabase.from('aura_jobs').update({
          sold_upsells: newUpsells,
          recommended_upsells: newRecommended,
          price: newPrice
      }).eq('id', id);

      if(!error) {
          alert("Ürün eklendi!");
          window.location.reload();
      } else {
          alert("Hata oluştu.");
      }
      setProcessing(false);
  };

  if (loading || !job) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>;

  // Hesaplamalar
  const getCurrentStep = (status: string) => {
      const s = status.toLowerCase();
      if (s.includes("teslim") || s.includes("iade")) return 4;
      if (s.includes("hazır") || s.includes("bit")) return 3;
      if (s.includes("işlem") || s.includes("parça") || s.includes("onay")) return 2;
      return 1;
  };
  const currentStep = getCurrentStep(job.status);
  const isFinished = currentStep >= 3;

  // --- KRİTİK DÜZELTME: Upsell Verisini Güvenli Hale Getirme ---
  let safeUpsells: any[] = [];
  if (job.recommended_upsells) {
      if (Array.isArray(job.recommended_upsells)) {
          safeUpsells = job.recommended_upsells;
      } else if (typeof job.recommended_upsells === 'string') {
          try {
              safeUpsells = JSON.parse(job.recommended_upsells);
          } catch (e) {
              safeUpsells = [];
          }
      }
  }
  // -------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 pb-20">
      
      {/* ARKA PLAN EFEKTLERİ */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pt-8 relative z-10">
         
         {/* NAVİGASYON */}
         <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all font-bold text-sm backdrop-blur-md border border-white/5">
            <ArrowLeft size={16}/> LİSTEYE DÖN
         </button>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">
             
             {/* --- ONAY BEKLEYEN İŞLEM (EN ÜSTTE) --- */}
             {job.approval_status === 'pending' && (
                 <div className="lg:col-span-12">
                     <div className="relative overflow-hidden rounded-[2rem] border-2 border-purple-500 bg-[#0F1623] p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                         <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl animate-pulse"></div>
                         
                         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                             <div className="flex-1 text-center md:text-left">
                                 <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                                     <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/50 animate-bounce">
                                         <Zap size={24} />
                                     </div>
                                     <h2 className="text-2xl font-black text-white uppercase tracking-tight">Kritik Onay Bekleniyor</h2>
                                 </div>
                                 <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                     Teknisyen, cihazda ekstra işlem gerektiğini belirtti. Devam etmek için onayınız gerekiyor.
                                 </p>
                                 
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-left">
                                     <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                                         <span className="text-xs font-bold text-slate-500 uppercase">Ekstra Tutar</span>
                                         <span className="text-xl font-black text-purple-400">+{job.approval_amount} ₺</span>
                                     </div>
                                     <div>
                                         <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Teknisyen Notu</span>
                                         <p className="text-sm text-white font-medium italic">"{job.approval_desc}"</p>
                                     </div>
                                 </div>
                             </div>

                             <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px]">
                                 <button 
                                     disabled={processing}
                                     onClick={() => handleApproval('approved')}
                                     className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-900/40 hover:scale-105 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                                 >
                                     <CheckCircle2 size={18}/> ONAYLA
                                 </button>
                                 <button 
                                     disabled={processing}
                                     onClick={() => handleApproval('rejected')}
                                     className="w-full py-3 px-6 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-xs"
                                 >
                                     <X size={16}/> REDDET
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}

             {/* --- ÖNERİLEN ÜRÜNLER (UPSELL) - DÜZELTİLMİŞ KISIM --- */}
             {safeUpsells.length > 0 && (
                 <div className="lg:col-span-12">
                     <div className="relative overflow-hidden rounded-[2rem] border border-pink-500/30 bg-[#0F1623] p-6 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                         <div className="flex items-center gap-4 mb-6">
                             <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 border border-pink-500/50">
                                 <ShoppingBag size={20} />
                             </div>
                             <div>
                                 <h2 className="text-xl font-black text-white uppercase tracking-tight">Teknisyen Önerileri</h2>
                                 <p className="text-xs text-slate-400">Bu cihaza özel performans ve koruma ürünleri.</p>
                             </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             {safeUpsells.map((item:any, index:number) => (
                                 <div key={index} className="bg-white/5 border border-pink-500/20 rounded-xl p-4 flex justify-between items-center group hover:bg-pink-500/10 transition-colors">
                                     <div>
                                         <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                                         <span className="text-xs text-pink-300 font-mono font-bold">{item.price} ₺</span>
                                     </div>
                                     <button 
                                         onClick={() => handleBuyUpsell(item)}
                                         disabled={processing}
                                         className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-pink-900/20 flex items-center gap-2 group-hover:scale-105 transition-transform"
                                     >
                                         <Plus size={14}/> EKLE
                                     </button>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
             )}

             {/* SOL KOLON: ANA BİLGİLER */}
             <div className="lg:col-span-8 space-y-6">
                 
                 {/* CİHAZ KARTI */}
                 <div className="relative bg-[#0F1623]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] group-hover:bg-cyan-500/10 transition-colors"></div>
                     
                     <div className="flex flex-wrap items-start justify-between gap-4 mb-8 relative z-10">
                         <div>
                             <div className="flex items-center gap-3 mb-2">
                                 <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.2)]">{job.category || "SERVİS"}</span>
                                 <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 font-mono tracking-wider">#{job.tracking_code}</span>
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
                             <div 
                                 className={`h-full transition-all duration-1000 ease-out relative ${isFinished ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-cyan-600 to-blue-500'}`} 
                                 style={{ width: `${(currentStep / 4) * 100}%` }}
                             >
                                 <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px] animate-pulse"></div>
                             </div>
                         </div>
                         <div className="grid grid-cols-4 gap-2">
                             {STEPS.map((s, i) => {
                                 const active = i + 1 <= currentStep;
                                 return (
                                     <div key={i} className={`flex flex-col items-center text-center gap-2 ${active ? 'opacity-100' : 'opacity-30'}`}>
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${active ? 'bg-cyan-500 text-[#020617] shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-800 text-slate-500'}`}>
                                             {active ? <CheckCircle2 size={16}/> : i + 1}
                                         </div>
                                         <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">{s}</span>
                                     </div>
                                 )
                             })}
                         </div>
                     </div>
                 </div>

                 {/* DETAY GRID */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-[#0F1623]/60 border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                         <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Cpu size={16}/> Teknik Kimlik</h3>
                         <div className="space-y-3">
                             <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                 <span className="text-sm text-slate-400">Seri No</span>
                                 <span className="text-sm font-mono text-cyan-400 tracking-widest">{job.serial_no || "-"}</span>
                             </div>
                             <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                 <span className="text-sm text-slate-400">Kayıt Tarihi</span>
                                 <span className="text-sm font-bold text-white">{new Date(job.created_at).toLocaleDateString('tr-TR')}</span>
                             </div>
                         </div>
                     </div>

                     <div className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/10 rounded-3xl p-6 relative overflow-hidden">
                         <Activity className="absolute top-[-10px] right-[-10px] text-red-500/10 w-32 h-32"/>
                         <h3 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><AlertCircle size={16}/> Arıza / Şikayet</h3>
                         <p className="text-slate-200 font-medium italic leading-relaxed">"{job.problem}"</p>
                     </div>
                 </div>
             </div>

             {/* SAĞ KOLON: FİNANS & RAPOR */}
             <div className="lg:col-span-4 space-y-6">
                 
                 {/* FİYAT KARTI */}
                 <div className="bg-gradient-to-b from-[#1a2333] to-[#0f1623] border border-cyan-500/20 rounded-[2rem] p-8 text-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                     <div className="relative z-10">
                         <p className="text-cyan-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">TOPLAM TUTAR</p>
                         <div className="text-5xl font-black text-white mb-6 tracking-tight drop-shadow-xl">
                            {Number(job.price).toLocaleString('tr-TR')}<span className="text-2xl text-slate-500 ml-1">₺</span>
                         </div>
                         <div className="text-xs text-slate-500 bg-black/20 p-2 rounded-lg">
                             * Bu tutar cari hesabınıza işlenecektir.
                         </div>
                     </div>
                 </div>

                 {/* TEKNİK RAPOR */}
                 <div className="bg-[#0F1623] border border-slate-800 rounded-3xl p-6 flex flex-col min-h-[300px]">
                     <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                         <h3 className="font-bold text-white flex items-center gap-2"><Wrench size={18} className="text-slate-400"/> İşlem Raporu</h3>
                     </div>
                     <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                         <p className="font-mono text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                             {job.son_islem || "Henüz teknik rapor girilmedi."}
                         </p>
                     </div>
                 </div>

             </div>
             
             {/* GÖRSELLER */}
             {job.images && job.images.length > 0 && (
                 <div className="lg:col-span-12 bg-[#0F1623]/50 border border-white/5 rounded-3xl p-8">
                     <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-3"><Camera size={24} className="text-purple-400"/> Servis Görselleri</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {/* job.images var mı VE bir dizi mi diye kontrol et, değilse boş dizi kabul et */}
{(Array.isArray(job.images) ? job.images : []).map((img: string, i: number) => (
                             <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-700 cursor-pointer bg-slate-900" onClick={() => setSelectedImage(img)}>
                                 <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"/>
                             </div>
                         ))}
                     </div>
                 </div>
             )}

         </div>

         {/* LIGHTBOX */}
         {selectedImage && (
             <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
                 <img src={selectedImage} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border border-white/10"/>
                 <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"><X size={40}/></button>
             </div>
         )}

      </div>
    </div>
  );
}