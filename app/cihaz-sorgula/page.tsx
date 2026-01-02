"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, CheckCircle2, AlertCircle, 
  Activity, User, 
  MessageCircle, Zap, Battery, Fan, Eye, ShieldCheck, Camera, Wrench, Cpu, Radio, X, ShoppingBag, Plus, Star, Send
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

const AURA_TIPS: any = { 
    "genel": { title: "Aura Koruma", desc: "Cihaz performansını korumak için orijinal şarj aksesuarları kullanın.", icon: ShieldCheck, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    "pil": { title: "Pil Sağlığı", desc: "Ömrü uzatmak için şarjı %20-%80 arasında tutmaya özen gösterin.", icon: Battery, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    "sensor": { title: "Sensör Bakımı", desc: "Robot süpürge sensörlerini haftada bir mikrofiber bezle silin.", icon: Eye, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    "termal": { title: "Termal Bakım", desc: "Hava kanallarını kapatmayın, 6 ayda bir termal bakım yaptırın.", icon: Fan, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    "sivi": { title: "Sıvı Teması", desc: "Suya dayanıklı olsa bile cihazı yoğun buhardan uzak tutun.", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
};

export default function CihazSorgulaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <CihazSorgulaContent />
        </Suspense>
    );
}

function CihazSorgulaContent() {
  const searchParams = useSearchParams();
  const urlCode = searchParams.get('takip');

  const [code, setCode] = useState(urlCode || "");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Yorum State'leri
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const STEPS = ["Kayıt Açıldı", "İşlemde", "Test Ediliyor", "Hazır / Teslim"];

  useEffect(() => {
    if (urlCode) {
        performSearch(urlCode);
    }
  }, [urlCode]);

  const performSearch = async (searchValue: string) => {
    if (!searchValue) return;
    setLoading(true); setResult(null); setError(""); setReviewSubmitted(false);

    let cleanCode = searchValue.trim().toUpperCase().replace(/\s/g, ''); 
    if (/^\d+$/.test(cleanCode)) {
        cleanCode = `SRV-${cleanCode}`;
    } else if (cleanCode.startsWith("SRV") && !cleanCode.includes("-")) {
        cleanCode = cleanCode.replace("SRV", "SRV-");
    }
    setCode(cleanCode);

    try {
        const { data, error } = await supabase
          .from('aura_jobs')
          .select('*')
          .or(`tracking_code.eq.${cleanCode},id.eq.${cleanCode.replace('SRV-', '')}`)
          .single();

        if (error) throw error;
        if (data) { 
            setResult(data); 
            // Yorum kontrolü
            const { data: existingReview } = await supabase.from('aura_reviews').select('id').eq('job_id', data.id).single();
            if (existingReview) setReviewSubmitted(true);
        } else { 
            setError("Kayıt bulunamadı. Lütfen takip numarasını kontrol ediniz."); 
        }
    } catch (err) {
        setError("Kayıt bulunamadı veya sistem hatası.");
    } finally {
        setLoading(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(code);
  };

  // --- YORUM GÖNDERME ---
  const submitReview = async () => {
      if(rating === 0) return alert("Lütfen puan veriniz.");
      setLoading(true);
      const { error } = await supabase.from('aura_reviews').insert([{
          job_id: result.id,
          customer_name: result.customer,
          rating: rating,
          comment: comment
      }]);
      setLoading(false);
      if(!error) {
          setReviewSubmitted(true);
          alert("Değerli yorumunuz için teşekkür ederiz!");
      } else {
          alert("Hata oluştu: " + error.message);
      }
  };

  // --- ONAY İŞLEMİ ---
  const handleClientApproval = async (id: number, decision: 'approved' | 'rejected', newPrice?: number) => {
    if (!confirm(decision === 'approved' ? "İşlemi onaylıyor musunuz?" : "Reddetmek istediğinize emin misiniz?")) return;

    setLoading(true);
    
    const updates: any = {
        approval_status: decision,
        status: decision === 'approved' ? 'İşlemde' : 'İptal/Reddedildi'
    };
    
    if (decision === 'approved' && newPrice) {
        updates.price = newPrice;
    }

    const { error } = await supabase.from('aura_jobs').update(updates).eq('id', id);
    
    if (!error) {
        alert(decision === 'approved' ? "Teşekkürler! Onayınız alındı." : "Talebiniz alındı. İşlem reddedildi.");
        window.location.reload(); 
    } else {
        alert("Hata oluştu.");
    }
    setLoading(false);
  };

  // --- UPSELL SATIN ALMA ---
  const handleBuyUpsell = async (item: any) => {
      if(!confirm(`${item.name} ürününü ${item.price} TL karşılığında servis kaydınıza eklemek istiyor musunuz?`)) return;
      
      setLoading(true);
      
      const newPrice = Number(result.price) + item.price;
      const newSold = [...(result.sold_upsells || []), item];
      const newRecommended = result.recommended_upsells.filter((i:any) => i.id !== item.id);

      const { error } = await supabase.from('aura_jobs').update({
          price: newPrice,
          sold_upsells: newSold,
          recommended_upsells: newRecommended
      }).eq('id', result.id);

      if(!error) {
          alert("Ürün başarıyla eklendi! Toplam tutar güncellendi.");
          window.location.reload();
      } else {
          alert("Hata oluştu.");
      }
      setLoading(false);
  };

  const maskName = (name: string) => {
      if (!name) return "***";
      const parts = name.split(" ");
      return parts.map(p => p.length > 2 ? p[0] + p[1] + "*".repeat(p.length - 2) : p[0] + "*").join(" ");
  };

  const getCurrentStep = (status: string) => {
      if (!status) return 0;
      const s = status.toLowerCase();
      if (s.includes("teslim") || s.includes("kargo")) return 4;
      if (s.includes("hazır") || s.includes("tamam")) return 3;
      if (s.includes("işlem") || s.includes("parça") || s.includes("tamir") || s.includes("onay")) return 2;
      return 1; 
  };

  const currentStep = result ? getCurrentStep(result.status) : 0;
  const isFinished = currentStep >= 3; 
  const isDelivered = result?.status === "Teslim Edildi";
  const tip = result ? (AURA_TIPS[result.tip_id] || AURA_TIPS["genel"]) : null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* --- EPIC ARKA PLAN --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slow delay-1000"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pt-36 pb-20 relative z-10">
        
        {/* BAŞLIK & ARAMA ALANI */}
        <div className={`transition-all duration-700 ease-out flex flex-col items-center justify-center ${result ? 'min-h-[20vh] mb-12' : 'min-h-[60vh]'}`}>
             
             <div className="mb-8 text-center relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl">
                    <Search className="text-cyan-400 w-8 h-8" />
                </div>
                <h1 className="font-black tracking-tighter text-white text-5xl md:text-7xl mb-4 drop-shadow-2xl">
                    CİHAZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">DURUMU</span>
                </h1>
                {!result && <p className="text-slate-400 text-lg max-w-md mx-auto">Servisimize emanet ettiğiniz cihazınızın anlık durumunu, işlem geçmişini ve teknik detaylarını sorgulayın.</p>}
             </div>

             <form onSubmit={handleManualSearch} className={`relative w-full max-w-xl transition-all duration-500 ${loading ? 'scale-95 opacity-80' : 'scale-100'}`}>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-tilt"></div>
                    <div className="relative flex items-center bg-[#0B1120] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="pl-6 text-cyan-500 animate-pulse"><Radio size={24}/></div>
                        <input 
                            type="text" 
                            placeholder="TAKİP KODU (ÖRN: SRV-8371)" 
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            className="w-full bg-transparent border-none py-5 px-4 text-white font-bold text-lg outline-none placeholder:text-slate-600 uppercase tracking-widest"
                        />
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="mr-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : "SORGULA"}
                        </button>
                    </div>
                </div>
             </form>

             {error && (
                <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold animate-in slide-in-from-top-4">
                    <AlertCircle size={24}/> {error}
                </div>
             )}
        </div>

        {/* --- SONUÇ PANELİ --- */}
        {result && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-12 duration-700 relative">
                
                {/* --- MÜŞTERİ MEMNUNİYETİ (Sadece Teslim Edildiyse) --- */}
                {isDelivered && !reviewSubmitted && (
                    <div className="lg:col-span-12 mb-4 animate-in zoom-in-95 duration-500">
                        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-[2rem] p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                            <h2 className="text-2xl font-black text-white mb-2">Hizmetimizden Memnun Kaldınız mı?</h2>
                            <p className="text-slate-400 text-sm mb-6">Deneyiminizi bizimle paylaşarak daha iyi hizmet vermemize yardımcı olun.</p>
                            
                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setRating(star)} className={`transition-all hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-slate-700 hover:text-yellow-400/50'}`}>
                                        <Star size={40} fill={star <= rating ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>
                            
                            {rating > 0 && (
                                <div className="max-w-md mx-auto animate-in slide-in-from-bottom-4">
                                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500 h-24 mb-4 resize-none" placeholder="Düşüncelerinizi yazın..."></textarea>
                                    <button onClick={submitReview} className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl flex items-center justify-center gap-2"><Send size={18}/> GÖNDER</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- TEŞEKKÜR MESAJI (Yorum Yapıldıysa) --- */}
                {isDelivered && reviewSubmitted && (
                    <div className="lg:col-span-12 mb-4 animate-in zoom-in-95 duration-500">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-[2rem] p-6 text-center">
                            <CheckCircle2 size={40} className="text-green-500 mx-auto mb-2"/>
                            <h3 className="text-xl font-bold text-white">Teşekkür Ederiz!</h3>
                            <p className="text-green-400 text-sm">Geri bildiriminiz bizim için çok değerli.</p>
                        </div>
                    </div>
                )}

                {/* --- KRİTİK ONAY KARTI --- */}
                {result.approval_status === 'pending' && (
                    <div className="lg:col-span-12 mb-4">
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
                                        Teknisyenlerimiz cihazınızda ekstra bir durum tespit etti. İşleme devam edebilmek için onayınız gerekiyor. 
                                        Aşağıdaki detayları inceleyip karar verebilirsiniz.
                                    </p>
                                    
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-left">
                                        <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Ekstra Tutar</span>
                                            <span className="text-xl font-black text-purple-400">+{result.approval_amount} ₺</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Teknisyen Notu</span>
                                            <p className="text-sm text-white font-medium italic">"{result.approval_desc}"</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px]">
                                    <button 
                                        onClick={() => handleClientApproval(result.id, 'approved', Number(result.price) + Number(result.approval_amount))}
                                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-900/40 hover:scale-105 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                                    >
                                        <CheckCircle2 size={18}/> Onaylıyorum
                                    </button>
                                    <button 
                                        onClick={() => handleClientApproval(result.id, 'rejected')}
                                        className="w-full py-3 px-6 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-xs"
                                    >
                                        <X size={16}/> Reddet
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- AURA FIRSATLAR (UPSELL) KARTI --- */}
                {result.recommended_upsells && result.recommended_upsells.length > 0 && (
                    <div className="lg:col-span-12 mb-4">
                        <div className="relative overflow-hidden rounded-[2rem] border border-pink-500/30 bg-[#0F1623] p-8 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 border border-pink-500/50">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Cihazınız İçin Önerilenler</h2>
                                        <p className="text-xs text-slate-400">Teknisyenlerimiz cihazınızın performansını ve ömrünü artırmak için bu ürünleri öneriyor.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {result.recommended_upsells.map((item:any, index:number) => (
                                        <div key={index} className="bg-white/5 border border-pink-500/20 rounded-xl p-4 flex justify-between items-center group hover:bg-pink-500/10 transition-colors">
                                            <div>
                                                <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                                                <span className="text-xs text-pink-300 font-mono font-bold">{item.price} ₺</span>
                                            </div>
                                            <button 
                                                onClick={() => handleBuyUpsell(item)}
                                                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-pink-900/20 flex items-center gap-2 group-hover:scale-105 transition-transform"
                                            >
                                                <Plus size={14}/> EKLE
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SOL PANEL: CİHAZ KARTI & DURUM */}
                <div className="lg:col-span-8 space-y-6">
                    {/* ANA KART */}
                    <div className="relative bg-[#0F1623]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] group-hover:bg-cyan-500/10 transition-colors"></div>
                        
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-8 relative z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.2)]">{result.category || "CİHAZ"}</span>
                                    <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 font-mono tracking-wider">#{result.tracking_code || result.id}</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">{result.device}</h2>
                            </div>
                            <div className="text-right hidden md:block">
                                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Müşteri</div>
                                <div className="text-xl font-bold text-white flex items-center justify-end gap-2"><User size={18} className="text-purple-400"/> {maskName(result.customer)}</div>
                            </div>
                        </div>

                        {/* TIMELINE */}
                        <div className="relative pt-4 pb-2">
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                                <div 
                                    className={`h-full transition-all duration-1000 ease-out relative ${isFinished ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-cyan-600 to-blue-500'}`} 
                                    style={{ width: `${(currentStep / 3) * 100}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px] animate-pulse"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {STEPS.map((s, i) => {
                                    const active = i + 1 <= currentStep;
                                    const current = i + 1 === currentStep;
                                    return (
                                        <div key={i} className={`flex flex-col items-center text-center gap-2 ${active ? 'opacity-100' : 'opacity-30'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${active ? (isFinished ? 'bg-green-500 text-[#020617] shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-cyan-500 text-[#020617] shadow-[0_0_15px_rgba(6,182,212,0.5)]') : 'bg-slate-800 text-slate-500'}`}>
                                                {active ? <CheckCircle2 size={16}/> : i + 1}
                                            </div>
                                            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${current ? 'text-white scale-110' : 'text-slate-400'}`}>{s}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* DETAYLAR GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* SOL: Cihaz Bilgisi */}
                         <div className="bg-[#0F1623]/60 border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Cpu size={16}/> Teknik Detaylar</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-sm text-slate-400">Seri No / IMEI</span>
                                    <span className="text-sm font-mono text-cyan-400 tracking-widest">{result.serial_no || "---"}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-sm text-slate-400">Kabul Tarihi</span>
                                    <span className="text-sm font-bold text-white">{new Date(result.created_at).toLocaleDateString('tr-TR')}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 block mb-2">AKSESUARLAR</span>
                                    <div className="flex flex-wrap gap-2">
                                        {result.accessories?.length ? result.accessories.map((acc:string, i:number) => (
                                            <span key={i} className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 uppercase">{acc}</span>
                                        )) : <span className="text-xs text-slate-600 italic">Teslim alınan aksesuar yok.</span>}
                                    </div>
                                </div>
                            </div>
                         </div>

                         {/* SAĞ: Şikayet */}
                         <div className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/10 rounded-3xl p-6 relative overflow-hidden">
                             <Activity className="absolute top-[-10px] right-[-10px] text-red-500/10 w-32 h-32"/>
                             <h3 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><AlertCircle size={16}/> Müşteri Şikayeti</h3>
                             <p className="text-slate-200 font-medium italic leading-relaxed">"{result.problem}"</p>
                             
                             {result.pre_checks?.length > 0 && (
                                 <div className="mt-6 pt-4 border-t border-red-500/10">
                                     <span className="text-[10px] font-bold text-red-500/60 uppercase block mb-2">ÖN TESPİTLER</span>
                                     <div className="flex flex-wrap gap-2">
                                         {result.pre_checks.map((check:string, i:number) => (
                                             <span key={i} className="text-[10px] font-bold text-red-300 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">{check}</span>
                                         ))}
                                     </div>
                                 </div>
                             )}
                         </div>
                    </div>

                </div>

                {/* SAĞ PANEL: RAPOR & FİYAT */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* FİYAT & DESTEK */}
                    <div className="bg-gradient-to-b from-[#1a2333] to-[#0f1623] border border-cyan-500/20 rounded-[2rem] p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="relative z-10">
                            <p className="text-cyan-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">SERVİS BEDELİ</p>
                            <div className="text-5xl font-black text-white mb-8 tracking-tight drop-shadow-xl">{Number(result.price).toLocaleString('tr-TR')}<span className="text-2xl text-slate-500 ml-1">₺</span></div>
                            
                            <a 
                                href={`https://wa.me/905396321429?text=Merhaba, SRV-${result.tracking_code} kodlu cihazım (${result.device}) hakkında bilgi almak istiyorum.`}
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0a3319] font-black uppercase tracking-wide flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
                            >
                                <MessageCircle size={22} strokeWidth={2.5}/> WhatsApp Destek
                            </a>
                        </div>
                    </div>

                    {/* TEKNİK RAPOR */}
                    <div className="bg-[#0F1623] border border-slate-800 rounded-3xl p-6 flex flex-col h-[400px]">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                             <h3 className="font-bold text-white flex items-center gap-2"><Wrench size={18} className="text-slate-400"/> Teknik Rapor</h3>
                             {isFinished && <span className="bg-green-500 text-[#020617] text-[10px] font-black px-2 py-1 rounded uppercase">Tamamlandı</span>}
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <p className="font-mono text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                                {result.process_details || "Teknisyenlerimiz cihaz üzerinde çalışıyor. Detaylı rapor işlem tamamlandığında buraya eklenecektir."}
                            </p>
                        </div>
                        
                        {/* AKILLI İPUCU */}
                        {tip && (
                            <div className={`mt-4 p-4 rounded-2xl border ${tip.bg} ${tip.border} flex gap-3 items-start`}>
                                <div className={`p-2 rounded-lg bg-[#020617]/50 ${tip.color}`}><tip.icon size={18}/></div>
                                <div>
                                    <h4 className={`text-xs font-black uppercase ${tip.color} mb-1`}>{tip.title}</h4>
                                    <p className="text-[11px] text-slate-300 leading-snug">{tip.desc}</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* GALERİ - TAM GENİŞLİK */}
                {result.images && result.images.length > 0 && (
                    <div className="lg:col-span-12 bg-[#0F1623]/50 border border-white/5 rounded-3xl p-8">
                         <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-3"><Camera size={24} className="text-purple-400"/> Servis Görselleri</h3>
                         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {result.images.map((img: string, i: number) => (
                                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-700 cursor-pointer bg-slate-900" onClick={() => setSelectedImage(img)}>
                                    <img src={img} alt={`Servis Fotoğrafı ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"/>
                                    <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Eye className="text-white drop-shadow-lg" size={32}/>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}

            </div>
        )}

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