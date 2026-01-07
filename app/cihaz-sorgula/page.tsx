"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, CheckCircle2, AlertCircle, Activity, User, MessageCircle, 
  Zap, Battery, Fan, Eye, ShieldCheck, Camera, Wrench, Cpu, Radio, 
  X, ShoppingBag, Plus, Star, Send, Loader2, ClipboardCheck, Box
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function CihazSorgulaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-10 h-10 text-cyan-500 animate-spin"/></div>}>
            <CihazSorgulaContent />
        </Suspense>
    );
}

function CihazSorgulaContent() {
  const searchParams = useSearchParams();
  const urlCode = searchParams.get('takip');

  const [searchInput, setSearchInput] = useState(urlCode || "");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // JSON Parse Yardımcısı (Veritabanından gelen text veriyi diziye çevirir)
  const parseData = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try { return JSON.parse(data); } catch { return []; }
  };

  const STEPS = ["Kayıt Açıldı", "İşlemde", "Parça Bekleniyor/Onay", "Hazır / Teslim"];

  useEffect(() => {
    if (urlCode) {
        setSearchInput(urlCode);
        performSearch(urlCode);
    }
  }, [urlCode]);

  const performSearch = async (val: string) => {
    if (!val) return;
    setLoading(true); 
    setResult(null); 
    setError(""); 
    
    // Temizle: Boşlukları sil, büyük harf yap
    const rawInput = val.trim().toUpperCase().replace(/\s/g, '');
    const numericPart = rawInput.replace(/\D/g, ''); // Sadece sayıları al (30570)

    try {
        // --- DÜZELTME: SADECE TRACKING_CODE SORGUSU ---
        // ID (UUID) sorgusu KALDIRILDI çünkü kısa sayı ile UUID aranmaz.
        let query = supabase.from('aura_jobs').select('*');
        
        // Hem "SRV-30570" hem de "30570" ihtimalini dene
        if (numericPart) {
             query = query.or(`tracking_code.eq.SRV-${numericPart},tracking_code.eq.${numericPart},tracking_code.eq.${rawInput}`);
        } else {
             query = query.eq('tracking_code', rawInput);
        }

        const { data, error } = await query.maybeSingle(); // maybeSingle hata patlatmaz, boşsa null döner

        if (error) throw error;

        if (data) { 
            setResult(data); 
            // Yorum kontrolü
            const { data: existingReview } = await supabase.from('aura_reviews').select('id').eq('job_id', data.id).maybeSingle();
            if (existingReview) setReviewSubmitted(true);
        } else { 
            setError("Kayıt bulunamadı. Lütfen takip numarasını kontrol ediniz."); 
        }
    } catch (err: any) {
        console.error("Arama Hatası:", err);
        setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
        setLoading(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  // --- UPSELL SATIN ALMA (MÜŞTERİ ONAYI) ---
  const handleBuyUpsell = async (item: any) => {
      if(!confirm(`${item.name} ürününü ${item.price} TL karşılığında servis işleminize eklemek istiyor musunuz?`)) return;
      
      setLoading(true);
      
      const newPrice = Number(result.price) + Number(item.price);
      
      // Mevcut listeleri al ve güncelle
      const currentSold = parseData(result.sold_upsells);
      const currentRec = parseData(result.recommended_upsells);

      const newSold = [...currentSold, item];
      const newRecommended = currentRec.filter((i:any) => i.id !== item.id);

      // Veritabanını güncelle
      const { error } = await supabase.from('aura_jobs').update({
          price: String(newPrice),
          sold_upsells: JSON.stringify(newSold),
          recommended_upsells: JSON.stringify(newRecommended)
      }).eq('id', result.id);

      if(!error) {
          alert("Ürün başarıyla eklendi! Toplam tutar güncellendi.");
          // Ekranı yenilemeden state güncelleme
          setResult({
              ...result,
              price: newPrice,
              sold_upsells: JSON.stringify(newSold),
              recommended_upsells: JSON.stringify(newRecommended)
          });
      } else {
          alert("Bir hata oluştu.");
      }
      setLoading(false);
  };

  // --- ONAY İŞLEMLERİ ---
  const handleClientApproval = async (decision: 'approved' | 'rejected') => {
      if (!confirm(decision === 'approved' ? "Onaylıyor musunuz?" : "Reddetmek istediğinize emin misiniz?")) return;
      setLoading(true);
      
      const newStatus = decision === 'approved' ? 'İşlemde' : 'İptal/Reddedildi';
      const updatePayload: any = { approval_status: decision, status: newStatus };
      
      // Onaylanırsa fiyatı güncelle
      if(decision === 'approved' && result.approval_amount) {
          updatePayload.price = String(Number(result.price) + Number(result.approval_amount));
      }

      const { error } = await supabase.from('aura_jobs').update(updatePayload).eq('id', result.id);
      
      if (!error) {
          alert("İşlem başarıyla kaydedildi.");
          setResult({...result, ...updatePayload});
      }
      setLoading(false);
  };

  // --- YORUM GÖNDERME ---
  const submitReview = async () => {
    if(rating === 0) return alert("Puan veriniz.");
    setLoading(true);
    await supabase.from('aura_reviews').insert([{ job_id: result.id, customer_name: result.customer_email || result.customer, rating, comment }]);
    setLoading(false);
    setReviewSubmitted(true);
    alert("Teşekkürler!");
  };

  // Helper
  const maskName = (name: string) => {
      if (!name) return "***";
      return name.split(" ").map(p => p.length > 2 ? p[0] + p[1] + "*".repeat(p.length - 2) : p[0] + "*").join(" ");
  };

  const currentStep = result ? (
    result.status.includes("Teslim") ? 4 : 
    result.status.includes("Hazır") ? 3 : 
    result.status.includes("Parça") || result.status.includes("Onay") ? 2 : 
    result.status.includes("İşlem") ? 2 : 1
  ) : 0;

  // Verileri Hazırla
  const recUpsells = result ? parseData(result.recommended_upsells) : [];
  const accessories = result ? parseData(result.accessories || result.accessory) : [];
  const preChecks = result ? parseData(result.pre_checks) : [];
  const finalChecks = result ? parseData(result.final_checks) : [];
  const images = result ? parseData(result.images) : [];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* ARKA PLAN */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 pt-24 pb-20 relative z-10">
        
        {/* ARAMA KUTUSU */}
        <div className={`transition-all duration-700 ease-out flex flex-col items-center justify-center ${result ? 'mb-10' : 'min-h-[60vh]'}`}>
             {!result && (
                 <div className="mb-8 text-center">
                    <h1 className="font-black tracking-tighter text-white text-5xl mb-2 drop-shadow-2xl">
                        CİHAZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">DURUMU</span>
                    </h1>
                    <p className="text-slate-400">Takip numaranız ile cihazınızın detaylarını sorgulayın.</p>
                 </div>
             )}

             <form onSubmit={handleManualSearch} className={`relative w-full max-w-lg transition-all duration-500 ${loading ? 'opacity-80' : ''}`}>
                <div className="relative flex items-center bg-[#0B1120] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden focus-within:border-cyan-500/50 transition-colors">
                    <div className="pl-5 text-cyan-500"><Radio size={20}/></div>
                    <input 
                        type="text" 
                        placeholder="TAKİP KODU (ÖRN: 30570)" 
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        className="w-full bg-transparent border-none py-4 px-4 text-white font-bold text-lg outline-none placeholder:text-slate-600 uppercase tracking-widest"
                    />
                    <button type="submit" disabled={loading} className="mr-1.5 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-lg text-sm">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : "SORGULA"}
                    </button>
                </div>
             </form>
             {error && <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 font-bold text-sm"><AlertCircle size={18}/> {error}</div>}
        </div>

        {/* --- SONUÇ DETAYLARI --- */}
        {result && (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                
                {/* 1. ÜST BİLGİ KARTI */}
                <div className="bg-[#0F1623]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[60px]"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                             <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest">{result.category || "SERVİS"}</span>
                                <span className="text-slate-500 text-xs font-mono">#{result.tracking_code}</span>
                             </div>
                             <h2 className="text-3xl font-black text-white">{result.device_name || result.device}</h2>
                             <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                                <User size={14}/> {maskName(result.customer_email || result.customer || "")}
                             </div>
                        </div>
                        <div className="text-right">
                             <p className="text-xs font-bold text-slate-500 uppercase mb-1">TOPLAM TUTAR</p>
                             <div className="text-4xl font-black text-white">{Number(result.price).toLocaleString('tr-TR')} ₺</div>
                             <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                 result.status.includes('Teslim') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                 result.status.includes('Bekliyor') ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                             }`}>
                                <Activity size={12}/> {result.status}
                             </div>
                        </div>
                    </div>

                    {/* TIMELINE BAR */}
                    <div className="mt-8 relative">
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] uppercase font-bold text-slate-500">
                            {STEPS.map((s, i) => (
                                <span key={i} className={i + 1 <= currentStep ? "text-cyan-400" : ""}>{s}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. ONAY KARTI (Varsa) */}
                {result.approval_status === 'pending' && (
                    <div className="bg-[#1e1b15] border-l-4 border-yellow-500 rounded-xl p-6 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Zap className="text-yellow-500"/> Ekstra İşlem Onayı Gerekiyor</h3>
                        <p className="text-slate-300 text-sm mb-4">{result.approval_desc}</p>
                        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg mb-4 border border-white/5">
                            <span className="text-sm font-bold text-slate-400">EK ÜCRET</span>
                            <span className="text-xl font-black text-yellow-400">+{result.approval_amount} ₺</span>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => handleClientApproval('approved')} className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-colors">ONAYLA</button>
                            <button onClick={() => handleClientApproval('rejected')} className="px-6 py-3 border border-slate-600 hover:bg-slate-800 text-slate-300 font-bold rounded-lg transition-colors">REDDET</button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 3. FIRSAT ÜRÜNLERİ (UPSELL) */}
                    {recUpsells.length > 0 && (
                        <div className="lg:col-span-3">
                            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><ShoppingBag size={16} className="text-pink-500"/> Size Özel Fırsatlar</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recUpsells.map((item: any, i: number) => (
                                    <div key={i} className="bg-[#151921] border border-pink-500/30 rounded-xl p-4 flex justify-between items-center group hover:bg-pink-500/5 transition-all">
                                        <div>
                                            <p className="font-bold text-white text-sm">{item.name}</p>
                                            <p className="text-pink-400 font-mono font-bold text-xs">{item.price} ₺</p>
                                        </div>
                                        <button onClick={() => handleBuyUpsell(item)} className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1">
                                            <Plus size={14}/> EKLE
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. TEKNİK DETAYLAR & AKSESUARLAR */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Wrench size={14} className="text-cyan-500"/> Yapılan İşlemler & Durum</h3>
                            <div className="bg-[#0b0e14] rounded-xl p-4 border border-slate-700 min-h-[100px]">
                                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                                    {result.technician_note || result.process_details || "Cihazınız işlem sırasındadır. Detaylar eklendikçe burada görünecektir."}
                                </p>
                            </div>
                            
                            {/* KONTROLLER */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">TESLİM ALINANLAR</span>
                                    <div className="flex flex-wrap gap-2">
                                        {accessories.length > 0 ? accessories.map((acc:string, i:number) => (
                                            <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded border border-slate-700 font-bold">{acc}</span>
                                        )) : <span className="text-xs text-slate-600 italic">Yok</span>}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">KALİTE KONTROL</span>
                                    <div className="flex flex-wrap gap-2">
                                        {finalChecks.length > 0 ? finalChecks.map((chk:string, i:number) => (
                                            <span key={i} className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20 font-bold flex items-center gap-1"><CheckCircle2 size={10}/> {chk}</span>
                                        )) : <span className="text-xs text-slate-600 italic">Henüz yapılmadı</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. CİHAZ BİLGİSİ & ŞİKAYET */}
                    <div className="space-y-6">
                        <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Cpu size={14} className="text-blue-500"/> Cihaz Kimliği</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                    <span className="text-slate-500">Model</span>
                                    <span className="text-white font-bold">{result.device_name || result.device}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                    <span className="text-slate-500">Seri No</span>
                                    <span className="text-white font-mono">{result.serial_no || "---"}</span>
                                </div>
                                <div className="pt-2">
                                    <span className="text-[10px] text-red-400 font-bold block mb-1">MÜŞTERİ ŞİKAYETİ</span>
                                    <p className="text-xs text-slate-300 italic">"{result.problem_description || result.issue}"</p>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Butonu */}
                        <a 
                            href={`https://wa.me/905396321429?text=Merhaba, SRV-${result.tracking_code} kodlu cihazım hakkında bilgi almak istiyorum.`}
                            target="_blank"
                            className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-[#0a3319] font-black rounded-xl transition-transform hover:scale-[1.02]"
                        >
                            <MessageCircle size={20}/> WHATSAPP DESTEK
                        </a>
                    </div>
                </div>

                {/* 6. GALERİ */}
                {images.length > 0 && (
                    <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Camera size={14} className="text-purple-500"/> Servis Görselleri</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {images.map((img:string, i:number) => (
                                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-700 cursor-pointer group" onClick={() => setSelectedImage(img)}>
                                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* LIGHTBOX */}
        {selectedImage && (
            <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedImage(null)}>
                <img src={selectedImage} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border border-white/10"/>
                <button className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full"><X size={24}/></button>
            </div>
        )}

      </div>
    </div>
  );
}