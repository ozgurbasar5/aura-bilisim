"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, CheckCircle2, Clock, Wrench, AlertCircle, Smartphone, 
  Barcode, PackageOpen, ClipboardList, Activity, User, Calendar
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function CihazSorgulaPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-20">Yükleniyor...</div>}>
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

  const STEPS = ["Bekliyor", "İşlemde", "Hazır", "Teslim Edildi"];

  useEffect(() => {
    if (urlCode) {
        performSearch(urlCode);
    }
  }, [urlCode]);

  const performSearch = async (searchValue: string) => {
    if (!searchValue) return;
    
    setLoading(true); 
    setResult(null); 
    setError("");

    // AKILLI FORMATLAMA
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

    if (data) {
      setResult(data);
    } else {
      setError("Kayıt bulunamadı. Lütfen takip numarasını kontrol ediniz.");
    }
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
      if (s.includes("teslim")) return 4;
      if (s.includes("hazır")) return 3;
      if (s.includes("işlem") || s.includes("parça")) return 2;
      return 1; 
  };

  const currentStep = result ? getCurrentStep(result.status) : 0;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 font-sans">
      
      {/* LOGO & BAŞLIK */}
      <div className={`w-full max-w-lg text-center mb-8 transition-all duration-700 ${result ? 'mt-10' : 'mt-0'}`}>
          {!result && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-2xl mb-4 shadow-lg shadow-cyan-500/20 border border-cyan-500/20 animate-bounce-slow">
                    <Search className="text-cyan-400" size={32}/>
                </div>
                <h1 className="text-4xl font-black mb-2 tracking-tight">CİHAZ <span className="text-cyan-500">DURUMU</span></h1>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">Aura Bilişim Teknik Servis</p>
              </>
          )}
      </div>

      <div className="w-full max-w-4xl">
        
        {/* ARAMA KUTUSU */}
        <form onSubmit={handleManualSearch} className="relative mb-8 group max-w-lg mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Takip Kodu (Örn: 83785)" 
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl py-4 pl-6 pr-20 text-lg font-bold text-white outline-none focus:border-cyan-500 shadow-xl placeholder:text-slate-600 tracking-wider"
                />
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="absolute right-2 top-2 bottom-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search size={20}/>}
                </button>
            </div>
        </form>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-center gap-3 text-red-400 font-bold max-w-lg mx-auto animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20}/> {error}
            </div>
        )}

        {/* --- SONUÇ DETAY KARTI --- */}
        {result && (
            <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-6">
                
                {/* 1. ÜST KART: Özet Bilgi & Timeline */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 text-cyan-500 font-bold text-xs uppercase tracking-wider mb-2 bg-cyan-500/10 px-3 py-1 rounded-full w-fit">
                                <Smartphone size={14}/> {result.category || "Cihaz"}
                            </div>
                            <h2 className="text-3xl font-black text-white">{result.device}</h2>
                            <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm font-medium">
                                <span className="flex items-center gap-1"><User size={14}/> {maskName(result.customer)}</span>
                                <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(result.created_at).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>
                        <div className="text-left md:text-right bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">TAHMİNİ TUTAR</div>
                            <div className="text-3xl font-black text-white tracking-tight">{Number(result.price).toLocaleString('tr-TR')} ₺</div>
                        </div>
                    </div>

                    {/* TIMELINE */}
                    <div className="mb-4 relative z-10">
                        <div className="flex justify-between mb-3 px-2">
                            {STEPS.map((step, i) => (
                                <div key={i} className={`text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${i + 1 <= currentStep ? 'text-cyan-400' : 'text-slate-600'}`}>
                                    {step}
                                </div>
                            ))}
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden flex relative">
                            <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-1000 ease-out relative" style={{ width: `${(currentStep / 4) * 100}%` }}>
                                <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. DETAY GRID YAPISI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* SOL KOLON: Cihaz Kimliği & Teslim Alınanlar */}
                    <div className="space-y-6">
                        
                        {/* Cihaz Kimliği */}
                        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Barcode size={16} className="text-purple-500"/> Cihaz Kimliği
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                    <span className="text-xs text-slate-500 font-bold">TAKİP KODU</span>
                                    <span className="text-sm font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">{result.tracking_code || result.id}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                    <span className="text-xs text-slate-500 font-bold">SERİ NO / IMEI</span>
                                    <span className="text-sm font-mono text-white tracking-wide uppercase">{result.serial_no || "BELİRTİLMEDİ"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-bold">MARKA / MODEL</span>
                                    <span className="text-sm font-bold text-white">{result.device}</span>
                                </div>
                            </div>
                        </div>

                        {/* Teslim Alınanlar & Ön Eksper */}
                        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <PackageOpen size={16} className="text-orange-500"/> Teslim Alınanlar
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {result.accessories && result.accessories.length > 0 ? (
                                    result.accessories.map((acc:string, i:number) => (
                                        <span key={i} className="text-[10px] font-bold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">{acc}</span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-600 italic">Sadece cihaz teslim alındı.</span>
                                )}
                            </div>

                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2 border-t border-slate-800 pt-4">
                                <ClipboardList size={16} className="text-yellow-500"/> Ön Eksper Notları
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {result.pre_checks && result.pre_checks.length > 0 ? (
                                    result.pre_checks.map((check:string, i:number) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-yellow-500/80 bg-yellow-500/5 px-2 py-1.5 rounded border border-yellow-500/10">
                                            <AlertCircle size={12}/> {check}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-600 italic col-span-2">Fiziksel kusur tespit edilmedi.</span>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* SAĞ KOLON: Şikayet & Teknik Rapor */}
                    <div className="space-y-6">
                        
                        {/* Müşteri Şikayeti */}
                        <div className="bg-[#0f172a] border border-red-900/30 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><AlertCircle size={64} className="text-red-500"/></div>
                            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity size={16}/> Müşteri Şikayeti
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed font-medium bg-red-950/20 p-4 rounded-xl border border-red-500/10">
                                "{result.problem || 'Belirtilmedi'}"
                            </p>
                        </div>

                        {/* Teknik Servis Raporu */}
                        <div className="bg-[#0f172a] border border-green-900/30 rounded-2xl p-6 flex-1 h-full relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10"><Wrench size={64} className="text-green-500"/></div>
                             <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Wrench size={16}/> Teknik Rapor & İşlemler
                            </h3>
                            <div className="text-sm text-slate-300 leading-relaxed min-h-[100px] font-mono bg-green-950/20 p-4 rounded-xl border border-green-500/10 whitespace-pre-line">
                                {result.process_details || "Cihazınız şu an teknisyenlerimiz tarafından işlem görmektedir. Detaylar işlem tamamlandığında buraya eklenecektir."}
                            </div>

                            {result.status.includes("Teslim") && (
                                <div className="mt-6 flex items-center gap-3 bg-green-500/10 text-green-400 px-4 py-3 rounded-xl border border-green-500/20">
                                    <CheckCircle2 size={24}/>
                                    <div>
                                        <p className="font-bold text-sm">İŞLEM TAMAMLANDI</p>
                                        <p className="text-xs opacity-80">Cihaz başarıyla onarıldı ve teslim edildi.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        )}
      </div>
    </div>
  );
}