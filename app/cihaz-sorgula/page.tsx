"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, CheckCircle2, AlertCircle, 
  Barcode, PackageOpen, ClipboardList, Activity, User, Calendar,
  MessageCircle, Lightbulb, Zap, Battery, Fan, Eye, ShieldCheck, Camera, Wrench
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

// --- AURA İPUÇLARI (SABİT VERİLER) ---
const AURA_TIPS: any = {
    "genel": { title: "Aura Koruma", desc: "Cihaz performansını korumak için orijinal şarj aksesuarları kullanın.", icon: ShieldCheck, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    "pil": { title: "Pil Sağlığı", desc: "Ömrü uzatmak için şarjı %20-%80 arasında tutmaya özen gösterin.", icon: Battery, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    "sensor": { title: "Sensör Bakımı", desc: "Robot süpürge sensörlerini haftada bir mikrofiber bezle silin.", icon: Eye, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    "termal": { title: "Termal Bakım", desc: "Hava kanallarını kapatmayın, 6 ayda bir termal bakım yaptırın.", icon: Fan, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    "sivi": { title: "Sıvı Teması", desc: "Suya dayanıklı olsa bile cihazı yoğun buhardan uzak tutun.", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
};

export default function CihazSorgulaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-bold">Yükleniyor...</div>}>
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

  const STEPS = ["Kayıt Açıldı", "İşlemde", "Test Ediliyor", "Hazır / Teslim"];

  useEffect(() => {
    if (urlCode) {
        performSearch(urlCode);
    }
  }, [urlCode]);

  const performSearch = async (searchValue: string) => {
    if (!searchValue) return;
    setLoading(true); setResult(null); setError("");

    let cleanCode = searchValue.trim().toUpperCase().replace(/\s/g, ''); 
    if (/^\d+$/.test(cleanCode)) {
        cleanCode = `SRV-${cleanCode}`;
    } else if (cleanCode.startsWith("SRV") && !cleanCode.includes("-")) {
        cleanCode = cleanCode.replace("SRV", "SRV-");
    }
    setCode(cleanCode);

    const { data } = await supabase
      .from('aura_jobs')
      .select('*')
      .or(`tracking_code.eq.${cleanCode},id.eq.${cleanCode.replace('SRV-', '')}`)
      .single();

    setLoading(false);
    if (data) { setResult(data); } else { setError("Kayıt bulunamadı. Takip numarasını kontrol ediniz."); }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(code);
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
      if (s.includes("işlem") || s.includes("parça") || s.includes("tamir")) return 2;
      return 1; 
  };

  const currentStep = result ? getCurrentStep(result.status) : 0;
  const isFinished = currentStep >= 3; 
  const tip = result ? (AURA_TIPS[result.tip_id] || AURA_TIPS["genel"]) : null;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* Hafif Arkaplan Efektleri */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      {/* DÜZELTME BURADA YAPILDI: 
          pt-36 (padding-top: 9rem/144px) eklendi. 
          Böylece içerik Navbar'ın altında kalmayacak.
      */}
      <div className="container mx-auto max-w-5xl px-4 pt-36 pb-12 relative z-10">
        
        {/* LOGO & ARAMA ALANI */}
        <div className={`transition-all duration-700 ease-in-out ${result ? 'mb-8 flex flex-col md:flex-row gap-6 items-center justify-between border-b border-slate-800/60 pb-8' : 'min-h-[50vh] flex flex-col items-center justify-center'}`}>
             
             <div className={`${result ? 'text-left w-full md:w-auto' : 'text-center mb-8'}`}>
                 <h1 className="font-black tracking-tight text-white text-3xl md:text-5xl mb-2">
                    CİHAZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DURUMU</span>
                 </h1>
                 {!result && <p className="text-slate-400">Servisimizdeki cihazınızın detaylarını görüntüleyin.</p>}
             </div>

             <form onSubmit={handleManualSearch} className={`relative w-full ${result ? 'max-w-md' : 'max-w-lg'}`}>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative flex items-center bg-[#151e32] rounded-xl border border-slate-700/50 shadow-2xl">
                        <Search className="ml-4 text-slate-400" size={20}/>
                        <input 
                            type="text" 
                            placeholder="Takip Kodu (Örn: SRV-1234)" 
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            className="w-full bg-transparent border-none py-3.5 px-3 text-white font-bold outline-none placeholder:text-slate-600 uppercase tracking-widest"
                        />
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="mr-1 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50"
                        >
                            {loading ? "..." : "Sorgula"}
                        </button>
                    </div>
                </div>
             </form>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center justify-center gap-2 font-bold max-w-lg mx-auto mb-8">
                <AlertCircle size={20}/> {error}
            </div>
        )}

        {/* --- SONUÇ PANELİ (BENTO GRID YAPISI) --- */}
        {result && (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                
                {/* 1. ÜST BİLGİ KARTI (Ana Durum) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#151e32]/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-xl">
                    <div className="md:col-span-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 font-bold uppercase tracking-wider">{result.category || "Cihaz"}</span>
                            <span className="px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-400 font-mono tracking-wider">{result.tracking_code || result.id}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{result.device}</h2>
                        <div className="flex gap-4 text-sm font-medium text-slate-400">
                             <span className="flex items-center gap-1.5"><User size={14}/> {maskName(result.customer)}</span>
                             <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(result.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                        
                        {/* Timeline */}
                        <div className="mt-8 relative">
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${isFinished ? 'bg-green-500' : 'bg-cyan-500'}`} 
                                    style={{ width: `${(currentStep / 3) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-3 text-xs md:text-sm font-bold text-slate-500 uppercase tracking-tight">
                                {STEPS.map((s, i) => (
                                    <span key={i} className={`${i + 1 <= currentStep ? (isFinished ? 'text-green-400' : 'text-cyan-400') : ''}`}>{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sağ Taraf - Fiyat & Destek */}
                    <div className="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-700/50 pt-6 md:pt-0 md:pl-8 gap-4">
                        <div>
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Hizmet Bedeli</p>
                             <p className="text-3xl font-black text-white">{Number(result.price).toLocaleString('tr-TR')} ₺</p>
                        </div>
                        <a 
                           href={`https://wa.me/905396321469?text=SRV-${result.tracking_code} kodlu cihazım hakkında görüşmek istiyorum.`}
                           target="_blank" rel="noreferrer"
                           className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0a3319] font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                            <MessageCircle size={20}/> WhatsApp Destek
                        </a>
                    </div>
                </div>

                {/* 2. ORTA BÖLÜM - SİMETRİK GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    
                    {/* SOL KOLON */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#151e32]/60 backdrop-blur border border-slate-700/50 rounded-3xl p-6 flex-1">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-700/50 pb-4">
                                <div className="p-2 bg-slate-800 rounded-lg text-slate-300"><ClipboardList size={20}/></div>
                                <h3 className="font-bold text-lg text-white">Cihaz Kimliği & Durum</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                    <span className="text-sm text-slate-400">Seri No / IMEI</span>
                                    <span className="text-sm font-mono text-white tracking-widest">{result.serial_no || "---"}</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-2">Teslim Alınan Aksesuarlar</p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.accessories?.length ? result.accessories.map((acc:string, i:number) => (
                                            <span key={i} className="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">{acc}</span>
                                        )) : <span className="text-xs text-slate-500 italic">Aksesuar yok</span>}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-2">Ön Kontrol Notları</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {result.pre_checks?.length ? result.pre_checks.map((check:string, i:number) => (
                                            <div key={i} className="flex items-center gap-1.5 text-xs text-yellow-500/90 bg-yellow-500/5 px-2 py-1.5 rounded border border-yellow-500/10">
                                                <AlertCircle size={10}/> {check}
                                            </div>
                                        )) : <span className="text-xs text-slate-500 italic">Sorunsuz</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#151e32]/60 backdrop-blur border border-red-900/20 rounded-3xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Activity size={100} className="text-red-500"/></div>
                            <h3 className="text-red-400 font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Activity size={16}/> Müşteri Şikayeti
                            </h3>
                            <p className="text-slate-300 italic text-sm leading-relaxed">"{result.problem}"</p>
                        </div>
                    </div>

                    {/* SAĞ KOLON: TEKNİK RAPOR */}
                    <div className="bg-[#151e32]/60 backdrop-blur border border-slate-700/50 rounded-3xl p-6 flex flex-col relative overflow-hidden">
                        <div className="flex items-center justify-between gap-2 mb-6 border-b border-slate-700/50 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-cyan-900/30 text-cyan-400 rounded-lg"><Wrench size={20}/></div>
                                <h3 className="font-bold text-lg text-white">Teknik Servis Raporu</h3>
                            </div>
                            {isFinished && <div className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20"><CheckCircle2 size={12}/> TAMAMLANDI</div>}
                        </div>

                        <div className="flex-1 bg-[#0d1320] rounded-xl border border-slate-800 p-5 font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-line shadow-inner overflow-y-auto max-h-[400px]">
                            {result.process_details || 
                                <span className="text-slate-600 animate-pulse">Teknisyen incelemesi devam ediyor...<br/>Detaylar buraya eklenecektir.</span>
                            }
                        </div>

                        {tip && (
                            <div className={`mt-4 p-4 rounded-xl border ${tip.bg} ${tip.border} flex items-start gap-3`}>
                                <div className={`p-2 rounded-lg bg-black/20 ${tip.color}`}><tip.icon size={18}/></div>
                                <div>
                                    <h4 className={`font-bold text-sm ${tip.color}`}>{tip.title}</h4>
                                    <p className="text-xs text-slate-300 mt-1">{tip.desc}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. GALERİ */}
                {result.images && result.images.length > 0 && (
                    <div className="bg-[#151e32]/60 backdrop-blur border border-slate-700/50 rounded-3xl p-6 md:p-8">
                        <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
                            <Camera size={20} className="text-cyan-400"/> Servis Görselleri
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {result.images.map((img: string, i: number) => (
                                <div 
                                    key={i} 
                                    className="group aspect-square rounded-2xl overflow-hidden border border-slate-700 cursor-pointer relative bg-slate-900"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img src={img} alt={`Servis Resmi ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Eye className="text-white drop-shadow-md"/>
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
            <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedImage(null)}>
                <img src={selectedImage} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-white/10"/>
                <button className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20"><span className="text-2xl">&times;</span></button>
            </div>
        )}
      </div>
    </div>
  );
}