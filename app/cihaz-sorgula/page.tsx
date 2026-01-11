"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, CheckCircle2, AlertCircle, Activity, User, MessageCircle, 
  Zap, Battery, Fan, Eye, ShieldCheck, Camera, Wrench, Cpu, Radio, 
  X, ShoppingBag, Plus, Star, Send, Loader2, ClipboardCheck, Box, Smartphone, Clock, AlertTriangle, PackageCheck
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function CihazSorgulaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-10 h-10 text-cyan-500 animate-spin"/></div>}>
            <CihazSorgulaContent />
        </Suspense>
    );
}

// --- GELİŞTİRİLMİŞ 3D EXPLODED PHONE COMPONENT ---
const ExplodedPhone = ({ status }: { status: string }) => {
    // Mantık Düzeltmesi: Sadece Hazır veya Teslim ise 'Fixed' (Toplanmış) görünür.
    // Diğer tüm durumlarda (Parça, Onay, İşlem, Kayıt) 'Broken' (Dağınık) görünür.
    const statusLower = status.toLowerCase();
    const isFixed = statusLower.includes('hazır') || statusLower.includes('teslim');
    const isWaiting = statusLower.includes('parça') || statusLower.includes('onay');

    return (
        <div className={`w-full h-[450px] md:h-[550px] flex items-center justify-center perspective-1000 overflow-hidden relative rounded-3xl border shadow-2xl mb-8 group transition-all duration-500 ${isFixed ? 'bg-[#0a1820] border-emerald-500/20 shadow-emerald-500/10' : 'bg-[#1a0a0a] border-red-500/20 shadow-red-500/10'}`}>
            
            {/* Arka Plan Efekti */}
            <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20`}></div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[100px] animate-pulse-slow ${isFixed ? 'bg-emerald-500/20' : isWaiting ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}></div>

            {/* Ana 3D Konteyner */}
            <div className={`relative w-[200px] h-[400px] transform-style-3d animate-float cursor-pointer transition-transform duration-700 ${isFixed ? 'hover:rotate-x-6 hover:rotate-y-6' : 'hover:rotate-x-12 hover:rotate-y-12'}`}>
                
                {/* 1. KATMAN: ARKA KASA (En Arkada) */}
                <div className={`absolute inset-0 bg-[#1e293b] rounded-[3rem] border shadow-xl transform transition-transform duration-500 flex items-center justify-center ${isFixed ? 'translate-z-[-10px] group-hover:translate-z-[-20px] border-slate-700' : 'translate-z-[-40px] group-hover:translate-z-[-80px] border-red-900/50'}`}>
                    {!isFixed && <Wrench className="text-red-900/30 absolute top-10 left-4 animate-pulse"/>}
                    <div className="text-slate-600 text-[10px] font-bold rotate-90 tracking-widest">AURA CHASSIS // {isFixed ? 'OK' : 'SERVICE MODE'}</div>
                </div>

                {/* 2. KATMAN: ANAKART & BATARYA (Orta) */}
                <div className={`absolute inset-0 backdrop-blur-md rounded-[3rem] border shadow-xl transform transition-transform duration-500 flex flex-col items-center justify-center gap-3 p-4 ${
                    isFixed 
                    ? 'bg-black/80 border-emerald-500/30 translate-z-0 group-hover:translate-z-0' 
                    : 'bg-black/60 border-red-500/30 translate-z-0 group-hover:translate-z-0'
                }`}>
                    {/* Anakart */}
                    <div className={`w-full h-32 border rounded-lg relative overflow-hidden flex items-center justify-center ${isFixed ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-red-500/50 bg-red-900/20'}`}>
                        <Cpu className={`${isFixed ? 'text-emerald-400' : 'text-red-400'} animate-pulse`} size={32}/>
                        {/* Uyarı İkonları */}
                        {!isFixed && statusLower.includes('onay') && <AlertTriangle size={20} className="text-yellow-500 absolute top-2 right-2 animate-bounce"/>}
                        {!isFixed && statusLower.includes('parça') && <Box size={20} className="text-purple-500 absolute top-2 right-2 animate-bounce"/>}
                        
                        <div className={`absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,${isFixed ? '#10b981' : '#ef4444'}_5px,${isFixed ? '#10b981' : '#ef4444'}_10px)]`}></div>
                    </div>
                    {/* Batarya */}
                    <div className={`w-3/4 h-28 border rounded-lg flex items-center justify-center relative ${isFixed ? 'border-slate-600 bg-slate-800' : 'border-red-900/60 bg-red-950/50'}`}>
                        <Battery className={`${isFixed ? 'text-slate-400' : 'text-red-500/70'}`} size={24}/>
                    </div>
                </div>

                {/* 3. KATMAN: EKRAN (En Önde) */}
                <div className={`absolute inset-0 rounded-[3rem] border-2 shadow-2xl transform transition-transform duration-500 overflow-hidden flex flex-col items-center justify-center ${
                    isFixed 
                    ? 'bg-gradient-to-tr from-slate-900 to-emerald-900/20 border-emerald-500/20 translate-z-[10px] group-hover:translate-z-[20px]' 
                    : 'bg-gradient-to-tr from-slate-950 to-red-950/50 border-red-500/20 translate-z-[40px] group-hover:translate-z-[80px]'
                }`}>
                    
                    {/* Kırık Ekran Efekti (Sadece arızalıysa) */}
                    {!isFixed && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 200 400">
                            <path d="M0,0 L200,400 M200,0 L0,400 M100,0 L100,400 M0,200 L200,200" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
                            <circle cx="100" cy="200" r="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
                        </svg>
                    )}

                    {/* Sağlam Ekran Parlaması */}
                    {isFixed && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/10 to-transparent opacity-50 animate-pulse-slow"></div>}
                    
                    {/* Ekran İçeriği */}
                    <div className="relative z-10 text-center">
                        {isFixed ? <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-2"/> : <Smartphone size={40} className="text-red-500/50 mx-auto mb-2"/>}
                        <div className="text-white font-black text-lg tracking-widest">AURA OS</div>
                        <div className={`text-xs font-mono mt-2 px-3 py-1 rounded-full font-bold uppercase ${isFixed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400 animate-pulse'}`}>
                            {isFixed ? (statusLower.includes('teslim') ? 'TESLİM EDİLDİ' : 'SİSTEM HAZIR') : status.toUpperCase()}
                        </div>
                    </div>
                </div>

            </div>
            
            <div className={`absolute bottom-6 text-center w-full pointer-events-none text-xs font-bold tracking-[0.2em] animate-pulse ${isFixed ? 'text-emerald-500/50' : 'text-red-500/50'}`}>
                {isFixed ? 'ASSEMBLED // READY' : 'EXPLODED VIEW // DIAGNOSTIC MODE'}
            </div>
        </div>
    );
};

function CihazSorgulaContent() {
  const searchParams = useSearchParams();
  const urlCode = searchParams.get('takip');

  const [searchInput, setSearchInput] = useState(urlCode || "");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const parseData = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try { return JSON.parse(data); } catch { return []; }
  };

  // YENİ ADIMLAR
  const STEPS = ["Kayıt Açıldı", "İşlemde", "Parça Bekleniyor", "Onay Bekleniyor", "Hazır", "Teslim Edildi"];

  useEffect(() => {
    if (urlCode) {
        setSearchInput(urlCode);
        performSearch(urlCode);
    }
  }, [urlCode]);

  const performSearch = async (val: string) => {
    if (!val) return;
    setLoading(true); setResult(null); setError(""); 
    
    const rawInput = val.trim().toUpperCase().replace(/\s/g, '');
    const numericPart = rawInput.replace(/\D/g, '');

    try {
        let query = supabase.from('aura_jobs').select('*');
        if (numericPart) query = query.or(`tracking_code.eq.SRV-${numericPart},tracking_code.eq.${numericPart},tracking_code.eq.${rawInput}`);
        else query = query.eq('tracking_code', rawInput);

        const { data, error } = await query.maybeSingle();
        if (error) throw error;

        if (data) { 
            setResult(data); 
        } else { 
            setError("Kayıt bulunamadı. Lütfen takip numarasını kontrol ediniz."); 
        }
    } catch (err: any) {
        console.error(err); setError("Bağlantı hatası.");
    } finally {
        setLoading(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => { e.preventDefault(); performSearch(searchInput); };

  const handleClientApproval = async (decision: 'approved' | 'rejected') => {
      if (!confirm("Emin misiniz?")) return;
      setLoading(true);
      const newStatus = decision === 'approved' ? 'İşlemde' : 'İptal/Reddedildi';
      const updatePayload: any = { approval_status: decision, status: newStatus };
      if(decision === 'approved' && result.approval_amount) updatePayload.price = String(Number(result.price) + Number(result.approval_amount));
      const { error } = await supabase.from('aura_jobs').update(updatePayload).eq('id', result.id);
      if (!error) setResult({...result, ...updatePayload});
      setLoading(false);
  };

  const maskName = (name: string) => { if (!name) return "***"; return name.split(" ").map(p => p.length > 2 ? p[0] + p[1] + "*".repeat(p.length - 2) : p[0] + "*").join(" "); };

  // YENİ DURUM KONTROL MANTIĞI (6 ADIM)
  const currentStep = result ? (
    result.status.toLowerCase().includes("teslim") ? 6 :
    result.status.toLowerCase().includes("hazır") ? 5 :
    result.status.toLowerCase().includes("onay") ? 4 :
    result.status.toLowerCase().includes("parça") ? 3 :
    result.status.toLowerCase().includes("işlem") ? 2 : 1
  ) : 0;

  const accessories = result ? parseData(result.accessories || result.accessory) : [];
  const finalChecks = result ? parseData(result.final_checks) : [];
  const images = result ? parseData(result.images) : [];
  const recUpsells = result ? parseData(result.recommended_upsells) : [];

  // RENK BELİRLEME FONKSİYONU
  const getStepColor = (stepName: string, isActive: boolean) => {
    if (!isActive) return "border-slate-700 text-slate-600 bg-slate-800/50";
    
    if (stepName.includes("Kayıt")) return "border-blue-500 text-blue-400 bg-blue-500/20";
    if (stepName.includes("İşlem")) return "border-cyan-500 text-cyan-400 bg-cyan-500/20 animate-pulse";
    if (stepName.includes("Parça")) return "border-purple-500 text-purple-400 bg-purple-500/20 animate-pulse";
    if (stepName.includes("Onay")) return "border-yellow-500 text-yellow-400 bg-yellow-500/20 animate-pulse";
    if (stepName.includes("Hazır")) return "border-emerald-500 text-emerald-400 bg-emerald-500/20";
    if (stepName.includes("Teslim")) return "border-green-600 text-green-500 bg-green-600/20";
    
    return "border-slate-500 text-slate-400";
  };

  const handleBuyUpsell = async (item: any) => {
      if(!confirm(`${item.name} eklemek istiyor musunuz?`)) return;
      setLoading(true);
      const newPrice = Number(result.price) + Number(item.price);
      const newSold = [...parseData(result.sold_upsells), item];
      const newRecommended = parseData(result.recommended_upsells).filter((i:any) => i.id !== item.id);

      const { error } = await supabase.from('aura_jobs').update({ price: String(newPrice), sold_upsells: JSON.stringify(newSold), recommended_upsells: JSON.stringify(newRecommended) }).eq('id', result.id);
      if(!error) setResult({ ...result, price: newPrice, sold_upsells: JSON.stringify(newSold), recommended_upsells: JSON.stringify(newRecommended) });
      setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* ARKA PLAN */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-20 relative z-10">
        
        {/* ARAMA KUTUSU */}
        <div className={`transition-all duration-700 ease-out flex flex-col items-center justify-center ${result ? 'mb-10' : 'min-h-[60vh]'}`}>
             {!result && (
                 <div className="mb-8 text-center">
                    <h1 className="font-black tracking-tighter text-white text-5xl mb-2 drop-shadow-2xl">
                        CİHAZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">DURUMU</span>
                    </h1>
                    <p className="text-slate-400">Takip numaranız ile cihazınızın dijital ikizini görüntüleyin.</p>
                 </div>
             )}

             <form onSubmit={handleManualSearch} className={`relative w-full max-w-lg transition-all duration-500 ${loading ? 'opacity-80' : ''}`}>
                <div className="relative flex items-center bg-[#0B1120] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden focus-within:border-cyan-500/50 transition-colors">
                    <div className="pl-5 text-cyan-500"><Radio size={20}/></div>
                    <input type="text" placeholder="TAKİP KODU (ÖRN: 30570)" value={searchInput} onChange={e => setSearchInput(e.target.value)} className="w-full bg-transparent border-none py-4 px-4 text-white font-bold text-lg outline-none placeholder:text-slate-600 uppercase tracking-widest"/>
                    <button type="submit" disabled={loading} className="mr-1.5 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-lg text-sm">{loading ? <Loader2 className="w-5 h-5 animate-spin"/> : "SORGULA"}</button>
                </div>
             </form>
             {error && <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 font-bold text-sm"><AlertCircle size={18}/> {error}</div>}
        </div>

        {/* --- SONUÇ DETAYLARI --- */}
        {result && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">
                
                {/* SOL KOLON: 3D Görsel & Durum */}
                <div className="lg:col-span-5 space-y-6">
                    {/* 3D CİHAZ GÖRSELİ */}
                    <ExplodedPhone status={result.status} />
                    
                    {/* RENKLİ TIMELINE */}
                    <div className="bg-[#0F1623]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-6 flex items-center gap-2"><Activity size={14}/> İşlem Süreci</h3>
                        <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
                            {STEPS.map((step, i) => {
                                const isCompleted = i + 1 < currentStep;
                                const isCurrent = i + 1 === currentStep;
                                const colorClass = getStepColor(step, isCurrent);
                                
                                return (
                                    <div key={i} className="relative">
                                        {/* Timeline Noktası */}
                                        <div className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full border-4 transition-all duration-500 ${isCompleted ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_10px_#06b6d4]' : isCurrent ? colorClass.split(" ")[0] + " " + colorClass.split(" ")[2] : 'border-slate-700 bg-[#0F1623]'}`}></div>
                                        
                                        {/* Yazı */}
                                        <div className={`text-sm font-bold transition-colors duration-300 ${isCompleted ? 'text-white' : isCurrent ? colorClass.split(" ")[1] : 'text-slate-600'}`}>
                                            {step}
                                        </div>
                                        {isCurrent && <div className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${colorClass.split(" ")[1]}`}>Şu anki aşama</div>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* SAĞ KOLON: Detaylar */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* ÜST BİLGİ */}
                    <div className="bg-[#0F1623]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-2 inline-block">{result.category || "SERVİS"}</span>
                                <h2 className="text-3xl font-black text-white mb-1">{result.device_name || result.device}</h2>
                                <div className="text-slate-400 text-sm flex items-center gap-2"><User size={14}/> {maskName(result.customer_email || result.customer || "")}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-black text-white">{Number(result.price).toLocaleString('tr-TR')} ₺</div>
                                <div className="text-xs text-slate-500 font-bold mt-1">TOPLAM TUTAR</div>
                            </div>
                        </div>
                    </div>

                    {/* ONAY BEKLEYEN İŞLEM (Varsa) */}
                    {result.approval_status === 'pending' && (
                        <div className="bg-yellow-950/20 border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3 text-yellow-400">
                                    <AlertTriangle size={24} className="animate-bounce"/>
                                    <h3 className="text-lg font-bold">Ekstra İşlem Onayı Gerekiyor</h3>
                                </div>
                                <p className="text-slate-300 text-sm mb-4 bg-black/20 p-3 rounded-lg border border-yellow-500/10">{result.approval_desc}</p>
                                <div className="flex items-center justify-between">
                                    <div className="text-xl font-black text-white">+{result.approval_amount} ₺ <span className="text-xs font-normal text-slate-400">Ek Ücret</span></div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleClientApproval('rejected')} className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold">Reddet</button>
                                        <button onClick={() => handleClientApproval('approved')} className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm shadow-lg shadow-yellow-500/20">Onayla</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TEKNİK DETAYLAR */}
                    <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Wrench size={14} className="text-purple-500"/> Yapılan İşlemler</h3>
                        <div className="bg-[#0b0e14] rounded-xl p-4 border border-slate-700">
                            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                                {result.technician_note || "Teknisyen notu henüz girilmemiş."}
                            </p>
                        </div>
                        
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
                                    )) : <span className="text-xs text-slate-600 italic">Test aşamasında</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FIRSATLAR */}
                    {recUpsells.length > 0 && (
                        <div className="bg-gradient-to-br from-pink-900/10 to-purple-900/10 border border-pink-500/20 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-pink-400 uppercase mb-4 flex items-center gap-2"><ShoppingBag size={14}/> Size Özel Fırsatlar</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {recUpsells.map((item: any, i: number) => (
                                    <div key={i} className="bg-[#151921] border border-white/5 rounded-xl p-3 flex justify-between items-center group hover:border-pink-500/30 transition-all">
                                        <div>
                                            <p className="font-bold text-white text-sm">{item.name}</p>
                                            <p className="text-pink-400 font-mono font-bold text-xs">{item.price} ₺</p>
                                        </div>
                                        <button onClick={() => handleBuyUpsell(item)} className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1"><Plus size={14}/> EKLE</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* WHATSAPP */}
                    <a href={`https://wa.me/905396321429?text=Merhaba, SRV-${result.tracking_code} nolu cihazım hakkında görüşmek istiyorum.`} target="_blank" className="flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-[#0a3319] font-black rounded-xl transition-transform hover:scale-[1.02] shadow-lg shadow-green-500/20">
                        <MessageCircle size={20}/> WHATSAPP İLE GÖRÜŞ
                    </a>

                </div>
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