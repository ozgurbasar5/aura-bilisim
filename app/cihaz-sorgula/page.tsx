"use client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, CheckCircle2, AlertTriangle, User, MessageCircle, 
  ShoppingBag, Plus, Wrench, Cpu, Battery, Clock, Radio, AlertCircle, Smartphone, Activity, Loader2, Package, ShieldCheck, Camera, Eye, X, Printer, CreditCard, FileText, QrCode, Home
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

// --- FİRMA BİLGİLERİ ---
const COMPANY_INFO = {
    name: "Aura Bilişim & Teknoloji",
    slogan: "Teknolojide Güvenilir Çözüm Ortağınız",
    phone: "0850 123 45 67",
    web: "www.aurabilisim.net",
    address: "Teknoloji Mah. Bilişim Cad. No:1 İstanbul",
    logoUrl: "/image/aura-logo.png"
};

const STEPS = ["Kayıt Açıldı", "İşlemde", "Parça Bekleniyor", "Onay Bekleniyor", "Hazır", "Teslim Edildi"];
const SERVICE_CATEGORIES = ["Garanti Uzatma", "Koruma Paketi", "Yazılım Hizmeti", "Bakım Paketi", "Hizmet", "Servis"];

export default function CihazSorgulaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-10 h-10 text-cyan-500 animate-spin"/></div>}>
            <CihazSorgulaContent />
        </Suspense>
    );
}

// --- 3D TELEFON ŞEMASI (Blueprint V5) ---
const ExplodedPhone = ({ status }: { status: string }) => {
    const s = status?.toLowerCase() || "";
    const isFixed = s.includes('hazır') || s.includes('teslim') || s.includes('tamam');
    const isWaiting = s.includes('parça') || s.includes('onay') || s.includes('bekle');
    
    const colors = {
        primary: isFixed ? "#10b981" : (isWaiting ? "#f59e0b" : "#0ea5e9"),
        glow: isFixed ? "rgba(16, 185, 129, 0.2)" : (isWaiting ? "rgba(245, 158, 11, 0.2)" : "rgba(14, 165, 233, 0.2)"),
        metal: "#334155",
        text: isFixed ? "#34d399" : (isWaiting ? "#fbbf24" : "#38bdf8")
    };

    return (
        <div className="w-full h-[450px] flex items-center justify-center perspective-2000 overflow-hidden relative rounded-3xl border border-slate-800 shadow-2xl mb-8 group bg-[#050912] print:hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050912_100%)]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse-slow" style={{ background: colors.glow }}></div>

            <div className="relative w-[200px] h-[400px] transform-style-3d animate-float cursor-pointer transition-transform duration-700 group-hover:rotate-x-12 group-hover:rotate-y-[-25deg] rotate-x-12 rotate-y-[-15deg]">
                <div className="absolute inset-0 translate-z-[-80px] group-hover:translate-z-[-120px] transition-all duration-500">
                    <svg viewBox="0 0 300 600" className="w-full h-full drop-shadow-2xl">
                        <path d="M 40 20 H 260 A 30 30 0 0 1 290 50 V 550 A 30 30 0 0 1 260 580 H 40 A 30 30 0 0 1 10 550 V 50 A 30 30 0 0 1 40 20 Z" fill="#1e293b" stroke={colors.metal} strokeWidth="2" opacity="0.9" />
                        <circle cx="150" cy="300" r="45" fill="none" stroke={colors.metal} strokeWidth="1.5" strokeDasharray="5 3" />
                    </svg>
                </div>
                <div className="absolute inset-0 translate-z-[-40px] group-hover:translate-z-[-60px] transition-all duration-500">
                    <svg viewBox="0 0 300 600" className="w-full h-full filter drop-shadow-lg">
                        <rect x="60" y="140" width="180" height="320" rx="8" fill="#0f172a" stroke={colors.metal} strokeWidth="2" />
                        <text x="150" y="300" textAnchor="middle" fill={colors.metal} fontSize="12" style={{writingMode: 'vertical-rl', textOrientation: 'upright'}} letterSpacing="4">BATTERY</text>
                    </svg>
                </div>
                <div className="absolute inset-0 translate-z-[0px] transition-all duration-500">
                    <svg viewBox="0 0 300 600" className="w-full h-full filter drop-shadow-xl">
                        <path d="M 20 40 H 280 V 280 H 160 V 160 H 20 V 40 Z" fill="rgba(15, 23, 42, 0.9)" stroke={colors.primary} strokeWidth="1.5" />
                        <g transform="translate(80, 70)">
                            <rect x="0" y="0" width="70" height="70" rx="4" fill="#000" stroke={colors.metal} strokeWidth="1" />
                            <rect x="15" y="15" width="40" height="40" rx="2" fill="none" stroke={colors.primary} strokeWidth="1" />
                            <text x="35" y="38" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">AURA</text>
                            <text x="35" y="46" textAnchor="middle" fill={colors.primary} fontSize="5">CHIP</text>
                        </g>
                    </svg>
                </div>
                <div className="absolute inset-0 translate-z-[40px] group-hover:translate-z-[60px] transition-all duration-500 z-20">
                    <svg viewBox="0 0 300 600" className="w-full h-full filter drop-shadow-2xl">
                        <rect x="30" y="30" width="110" height="110" rx="25" fill="#0f172a" stroke={colors.metal} strokeWidth="2" />
                        <circle cx="85" cy="85" r="30" fill="none" stroke={colors.metal} strokeWidth="1"/>
                        <circle cx="85" cy="85" r="10" fill="#111" stroke="#3b82f6" strokeWidth="2"/>
                    </svg>
                </div>
                <div className={`absolute inset-0 translate-z-[60px] group-hover:translate-z-[120px] transition-all duration-500`}>
                    <svg viewBox="0 0 300 600" className="w-full h-full filter drop-shadow-2xl">
                        <path d="M 40 20 H 260 A 30 30 0 0 1 290 50 V 550 A 30 30 0 0 1 260 580 H 40 A 30 30 0 0 1 10 550 V 50 A 30 30 0 0 1 40 20 Z" fill="rgba(0,0,0,0.6)" stroke={colors.primary} strokeWidth="1" />
                        <g transform="translate(150, 300)">
                            {isFixed ? (
                                <g><circle r="30" fill={colors.primary} fillOpacity="0.2" stroke={colors.primary}/><text y="50" textAnchor="middle" fill={colors.primary} fontSize="14" fontWeight="bold">HAZIR</text></g>
                            ) : (
                                <g><circle r="30" fill="none" stroke={colors.metal} strokeDasharray="4 4"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite" /></circle><text y="50" textAnchor="middle" fill={colors.text} fontSize="14" fontWeight="bold">İŞLEM</text></g>
                            )}
                        </g>
                    </svg>
                </div>
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

  const parseData = (data: any) => { if (!data) return []; if (Array.isArray(data)) return data; try { return JSON.parse(data); } catch { return []; } };
  const maskName = (name: string) => { if (!name) return "***"; return name.split(" ").map(p => p.length > 2 ? p[0] + p[1] + "*".repeat(p.length - 2) : p[0] + "*").join(" "); };
  
  const checkStatus = (current: string, target: string) => {
      if(!current) return false;
      return current.toLocaleLowerCase('tr').trim().includes(target.toLocaleLowerCase('tr').trim());
  };

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

  useEffect(() => {
    if (urlCode) { setSearchInput(urlCode); performSearch(urlCode); }
  }, [urlCode]);

  const performSearch = async (val: string) => {
    if (!val) return; 
    setLoading(true); setResult(null); setError(""); 
    
    const rawInput = val.trim().toUpperCase().replace(/\s/g, ''); 
    const numericPart = rawInput.replace(/\D/g, '');
    const searchCandidates = [rawInput];
    if (numericPart) {
        searchCandidates.push(numericPart);
        searchCandidates.push(`SRV-${numericPart}`);
    }
    const uniqueCandidates = [...new Set(searchCandidates)];

    try {
        const { data, error } = await supabase.from('aura_jobs').select('*').in('tracking_code', uniqueCandidates).maybeSingle();
        if (error) throw error;
        if (data) setResult(data); else setError("Kayıt bulunamadı. Lütfen takip numarasını kontrol ediniz."); 
    } catch (err: any) { console.error(err); setError("Bağlantı hatası."); } 
    finally { setLoading(false); }
  };

  const handleManualSearch = (e: React.FormEvent) => { e.preventDefault(); performSearch(searchInput); };
  
  // --- UPSELL SATIN ALMA (Önerilenden Çıkar -> Satılana Ekle) ---
  const handleBuyUpsell = async (item: any) => {
      if(!confirm(`${item.name} eklemek istiyor musunuz?`)) return; 
      setLoading(true);
      
      const newPrice = Number(result.price) + Number(item.price);
      
      // Mevcut listeleri al
      const currentRec = parseData(result.recommended_upsells);
      const currentSold = parseData(result.sold_upsells);
      
      // Önerilenlerden çıkar
      const newRec = currentRec.filter((i:any) => i.id !== item.id);
      // Satılanlara ekle
      const newSold = [...currentSold, item];

      const { error } = await supabase.from('aura_jobs').update({ 
          price: String(newPrice), 
          sold_upsells: JSON.stringify(newSold), 
          recommended_upsells: JSON.stringify(newRec) 
      }).eq('id', result.id);

      if(!error) {
          // Arayüzü güncelle
          setResult({ 
              ...result, 
              price: newPrice, 
              sold_upsells: JSON.stringify(newSold), 
              recommended_upsells: JSON.stringify(newRec) 
          }); 
      }
      setLoading(false);
  };

  // --- MÜŞTERİ ONAYI ---
  const handleClientApproval = async (decision: 'approved' | 'rejected') => {
      if (!confirm("Emin misiniz?")) return; setLoading(true);
      const newStatus = decision === 'approved' ? 'İşlemde' : 'İptal/Reddedildi';
      const updatePayload: any = { approval_status: decision, status: newStatus };
      if(decision === 'approved' && result.approval_amount) updatePayload.price = String(Number(result.price) + Number(result.approval_amount));
      const { error } = await supabase.from('aura_jobs').update(updatePayload).eq('id', result.id);
      if (!error) setResult({...result, ...updatePayload}); 
      setLoading(false);
  };

  const currentStep = result ? (checkStatus(result.status, "Teslim") ? 6 : checkStatus(result.status, "Hazır") ? 5 : checkStatus(result.status, "Onay") ? 4 : checkStatus(result.status, "Parça") ? 3 : checkStatus(result.status, "İşlem") ? 2 : 1) : 0;
  const accessories = result ? parseData(result.accessories || result.accessory) : [];
  const finalChecks = result ? parseData(result.final_checks) : [];
  const images = result ? parseData(result.images) : [];
  
  // Upsell Ayrıştırma
  const recUpsells = result ? parseData(result.recommended_upsells) : [];
  const soldUpsells = result ? parseData(result.sold_upsells) : [];
  
  const recServices = recUpsells.filter((i:any) => SERVICE_CATEGORIES.includes(i.category) || i.category === 'Hizmet' || i.category === 'Servis');
  const recProducts = recUpsells.filter((i:any) => !SERVICE_CATEGORIES.includes(i.category) && i.category !== 'Hizmet' && i.category !== 'Servis');

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 print:bg-white print:text-black">
      
      <style jsx global>{`
        @media print {
            @page { margin: 0; size: A4; }
            body { background-color: white !important; color: black !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            .no-print, form, .exploded-phone, .fixed-overlays, button { display: none !important; }
            .print-only { display: block !important; }
            .print-container { padding: 40px; height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
            .print-border { border: 1px solid #ddd !important; }
            .print-header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
            .print-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .print-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
            .print-footer { border-top: 1px solid #000; padding-top: 20px; font-size: 10px; }
        }
      `}</style>

      {/* Arka Plan */}
      <div className="fixed inset-0 pointer-events-none z-0 no-print">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-20 relative z-10 print:p-0 print:max-w-none">
        
        {/* ARAMA ALANI */}
        <div className={`transition-all duration-700 ease-out flex flex-col items-center justify-center no-print ${result ? 'mb-10' : 'min-h-[60vh]'}`}>
             {!result && (<div className="mb-8 text-center"><h1 className="font-black tracking-tighter text-white text-5xl mb-2 drop-shadow-2xl">CİHAZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">DURUMU</span></h1><p className="text-slate-400">Takip numaranız ile cihazınızın dijital ikizini görüntüleyin.</p></div>)}
             <form onSubmit={handleManualSearch} className={`relative w-full max-w-lg transition-all duration-500 ${loading ? 'opacity-80' : ''}`}><div className="relative flex items-center bg-[#0B1120] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden focus-within:border-cyan-500/50 transition-colors"><div className="pl-5 text-cyan-500"><Radio size={20}/></div><input type="text" placeholder="TAKİP KODU (ÖRN: 30570)" value={searchInput} onChange={e => setSearchInput(e.target.value)} className="w-full bg-transparent border-none py-4 px-4 text-white font-bold text-lg outline-none placeholder:text-slate-600 uppercase tracking-widest"/><button type="submit" disabled={loading} className="mr-1.5 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-lg text-sm">{loading ? <Loader2 className="w-5 h-5 animate-spin"/> : "SORGULA"}</button></div></form>
             {error && <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 font-bold text-sm"><AlertCircle size={18}/> {error}</div>}
        </div>

        {/* --- SONUÇ PANELİ --- */}
        {result && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">
                
                {/* SOL: Cihaz Şeması & Durum */}
                <div className="lg:col-span-5 space-y-6 no-print">
                    <ExplodedPhone status={result.status} />
                    
                    <div className="bg-[#0F1623]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Package size={14}/> Cihaz Kimliği</h3>
                            {result.payment_status === 'paid' ? (
                                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 rounded-md flex items-center gap-1"><CheckCircle2 size={10}/> ÖDENDİ</span>
                            ) : (
                                <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20 rounded-md flex items-center gap-1"><CreditCard size={10}/> ÖDENMEDİ</span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><div className="text-[10px] text-slate-500 font-bold mb-1">MARKA</div><div className="text-sm font-bold text-white">{result.brand || "Belirtilmemiş"}</div></div>
                            <div><div className="text-[10px] text-slate-500 font-bold mb-1">MODEL</div><div className="text-sm font-bold text-white">{result.model || result.device_name || "-"}</div></div>
                            <div className="col-span-2 pt-2 border-t border-slate-800"><div className="text-[10px] text-slate-500 font-bold mb-1">SERİ NO / IMEI</div><div className="text-sm font-mono text-cyan-400">{result.serial_no || "Girilmemiş"}</div></div>
                        </div>
                    </div>

                    <div className="bg-[#0F1623]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-6 flex items-center gap-2"><Activity size={14}/> İşlem Süreci</h3>
                        <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">{STEPS.map((step, i) => { const isCompleted = i + 1 < currentStep; const isCurrent = i + 1 === currentStep; const colorClass = getStepColor(step, isCurrent); return (<div key={i} className="relative"><div className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full border-4 transition-all duration-500 ${isCompleted ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_10px_#06b6d4]' : isCurrent ? colorClass.split(" ")[0] + " " + colorClass.split(" ")[2] : 'border-slate-700 bg-[#0F1623]'}`}></div><div className={`text-sm font-bold transition-colors duration-300 ${isCompleted ? 'text-white' : isCurrent ? colorClass.split(" ")[1] : 'text-slate-600'}`}>{step}</div>{isCurrent && <div className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${colorClass.split(" ")[1]}`}>Şu anki aşama</div>}</div>)})}</div>
                    </div>
                </div>

                {/* SAĞ: Detaylar & Rapor */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* ANA BAŞLIK KARTI */}
                    <div className="bg-[#0F1623]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden no-print">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-2 inline-block">
                                    {result.category || "SERVİS"} - SRV-{result.tracking_code}
                                </span>
                                <h2 className="text-3xl font-black text-white mb-1">{result.device_name || result.device}</h2>
                                <div className="text-slate-400 text-sm flex items-center gap-2"><User size={14}/> {maskName(result.customer_email || result.customer || "")}</div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <div className="text-right">
                                    <div className="text-4xl font-black text-white">{Number(result.price).toLocaleString('tr-TR')} ₺</div>
                                    <div className="text-xs text-slate-500 font-bold mt-1">TOPLAM TUTAR</div>
                                </div>
                                <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-slate-700">
                                    <Printer size={14} /> RAPORU YAZDIR
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* UPSELL (EK HİZMET VE ÜRÜNLER) - MÜŞTERİ ONAY EKRANI */}
                    {(recServices.length > 0 || recProducts.length > 0) && (
                        <div className="bg-gradient-to-br from-purple-900/10 to-indigo-900/10 border border-purple-500/20 rounded-2xl p-6 no-print animate-in slide-in-from-bottom-4">
                            <h3 className="text-xs font-bold text-purple-400 uppercase mb-4 flex items-center gap-2"><ShoppingBag size={14}/> Size Özel Öneriler</h3>
                            
                            {recServices.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-[10px] font-bold text-indigo-400 mb-2 tracking-widest">ÖNERİLEN HİZMETLER</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {recServices.map((item: any, i: number) => (
                                            <div key={i} className="bg-[#151921] border border-purple-500/30 rounded-xl p-3 flex justify-between items-center group hover:bg-purple-500/10 transition-all">
                                                <div><p className="font-bold text-white text-sm">{item.name}</p><p className="text-purple-400 font-mono font-bold text-xs">{item.price} ₺</p></div>
                                                <button onClick={() => handleBuyUpsell(item)} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1"><Plus size={14}/> EKLE</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {recProducts.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-bold text-cyan-400 mb-2 tracking-widest">ÖNERİLEN AKSESUARLAR</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {recProducts.map((item: any, i: number) => (
                                            <div key={i} className="bg-[#151921] border border-cyan-500/30 rounded-xl p-3 flex justify-between items-center group hover:bg-cyan-500/10 transition-all">
                                                <div><p className="font-bold text-white text-sm">{item.name}</p><p className="text-cyan-400 font-mono font-bold text-xs">{item.price} ₺</p></div>
                                                <button onClick={() => handleBuyUpsell(item)} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1"><Plus size={14}/> EKLE</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SATILAN EK HİZMETLER (YESİL LİSTE) */}
                    {soldUpsells.length > 0 && (
                        <div className="bg-green-900/10 border border-green-500/20 rounded-2xl p-4 no-print">
                            <h3 className="text-xs font-bold text-green-400 uppercase mb-2 flex items-center gap-2"><CheckCircle2 size={14}/> Onaylanan Ek Hizmetler</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {soldUpsells.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-green-500/10 p-2 rounded border border-green-500/30">
                                        <span className="text-xs font-bold text-white">{item.name}</span>
                                        <span className="text-xs font-mono text-green-400">{item.price}₺</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ONAY BEKLEYEN İŞLEM VARSA */}
                    {result.approval_status === 'pending' && (
                        <div className="bg-yellow-950/20 border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden group no-print">
                             <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
                             <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3 text-yellow-400"><AlertTriangle size={24} className="animate-bounce"/><h3 className="text-lg font-bold">Ekstra İşlem Onayı Gerekiyor</h3></div>
                                <p className="text-slate-300 text-sm mb-4 bg-black/20 p-3 rounded-lg border border-yellow-500/10">{result.approval_desc}</p>
                                <div className="flex items-center justify-between">
                                    <div className="text-xl font-black text-white">+{result.approval_amount} ₺ <span className="text-xs font-normal text-slate-400">Ek Ücret</span></div>
                                    <div className="flex gap-2"><button onClick={() => handleClientApproval('rejected')} className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold">Reddet</button><button onClick={() => handleClientApproval('approved')} className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm shadow-lg shadow-yellow-500/20">Onayla</button></div>
                                </div>
                             </div>
                        </div>
                    )}

                    {/* İŞLEM NOTLARI */}
                    <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6 no-print">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Wrench size={14} className="text-purple-500"/> Yapılan İşlemler & Notlar</h3>
                        <div className="bg-[#0b0e14] rounded-xl p-4 border border-slate-700">
                            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{result.technician_note || "Teknisyen notu henüz girilmemiş."}</p>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div><span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">TESLİM ALINANLAR</span><div className="flex flex-wrap gap-2">{accessories.length > 0 ? accessories.map((acc:string, i:number) => (<span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded border border-slate-700 font-bold">{acc}</span>)) : <span className="text-xs text-slate-600 italic">Yok</span>}</div></div>
                            <div><span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">KALİTE KONTROL</span><div className="flex flex-wrap gap-2">{finalChecks.length > 0 ? finalChecks.map((chk:string, i:number) => (<span key={i} className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20 font-bold flex items-center gap-1"><CheckCircle2 size={10}/> {chk}</span>)) : <span className="text-xs text-slate-600 italic">Test aşamasında</span>}</div></div>
                        </div>
                    </div>

                    {/* GÖRSELLER */}
                    {images.length > 0 && (
                        <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6 no-print">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Camera size={14} className="text-cyan-500"/> Cihaz Görselleri</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img: string, i: number) => (
                                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-700 cursor-pointer" onClick={() => setSelectedImage(img)}>
                                        <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Eye size={20} className="text-white"/></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* DİJİTAL GARANTİ (PREMIUM) */}
                    {result.status === 'Teslim Edildi' && result.warranty_end_date && (
                        <div className="mt-6 relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-[#0f1219] shadow-[0_0_40px_rgba(234,179,8,0.1)] group no-print">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-[80px] pointer-events-none"></div>
                            
                            <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-8">
                                <div className="text-center md:text-left">
                                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 text-yellow-400 mb-4 ring-1 ring-yellow-500/30 shadow-lg shadow-yellow-900/20">
                                        <ShieldCheck size={48} strokeWidth={1.5} className="animate-pulse"/>
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">PREMIUM <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">GARANTİ</span></h3>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Bu cihaz Aura Bilişim güvencesi altındadır.</p>
                                </div>
                                <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                                    <div className="bg-[#0b0e14] p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">GARANTİ BİTİŞ</p>
                                        <div className="flex items-center gap-2">
                                            <Clock size={18} className="text-yellow-500"/>
                                            <span className="text-xl font-black text-white font-mono">
                                                {new Date(result.warranty_end_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-[#0b0e14] p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">KAPSAM</p>
                                        <div className="flex items-start gap-2">
                                            <span className="text-sm font-bold text-slate-300 leading-tight">{result.warranty_scope || "Genel İşçilik ve Parça Garantisi"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="no-print pt-4">
                        <a href={`https://wa.me/905396321429?text=Merhaba, SRV-${result.tracking_code} nolu cihazım hakkında görüşmek istiyorum.`} target="_blank" className="flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-[#0a3319] font-black rounded-xl transition-transform hover:scale-[1.02] shadow-lg shadow-green-500/20">
                            <MessageCircle size={20}/> WHATSAPP DESTEK
                        </a>
                    </div>
                </div>
            </div>
        )}

        {selectedImage && (<div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in fixed-overlays no-print" onClick={() => setSelectedImage(null)}><img src={selectedImage} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border border-white/10"/><button className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full"><X size={24}/></button></div>)}

        {/* --- YAZDIRILABİLİR ALAN (GİZLİ - SADECE YAZICIDA GÖRÜNÜR) --- */}
        {result && (
            <div className="hidden print-only print-container text-black">
                <div>
                    {/* Header */}
                    <div className="print-header flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            {/* LOGO */}
                            <img src={COMPANY_INFO.logoUrl} alt="Logo" className="h-16 object-contain" />
                            <div>
                                <h1 className="text-2xl font-black text-cyan-800 uppercase tracking-tight">{COMPANY_INFO.name}</h1>
                                <p className="text-xs text-gray-500 font-bold">{COMPANY_INFO.slogan}</p>
                                <div className="text-[10px] text-gray-500 mt-1 space-x-2">
                                    <span>📞 {COMPANY_INFO.phone}</span>
                                    <span>🌐 {COMPANY_INFO.web}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold bg-gray-100 px-4 py-2 rounded border border-gray-300">
                                SERVİS FORMU<br/>
                                <span className="text-lg font-black text-black">NO: {result.tracking_code}</span>
                            </div>
                            <div className="text-[10px] text-gray-500 mt-2">
                                Tarih: {new Date().toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                    </div>

                    {/* Müşteri ve Cihaz */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="print-box">
                            <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-1 mb-2 text-gray-700">MÜŞTERİ BİLGİLERİ</h3>
                            <table className="w-full text-xs">
                                <tbody>
                                    <tr><td className="font-bold py-1 w-20">Ad Soyad:</td><td>{result.customer_name}</td></tr>
                                    <tr><td className="font-bold py-1">Telefon:</td><td>{result.phone}</td></tr>
                                    <tr><td className="font-bold py-1 align-top">Adres:</td><td>{result.address || "-"}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="print-box">
                            <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-1 mb-2 text-gray-700">CİHAZ BİLGİLERİ</h3>
                            <table className="w-full text-xs">
                                <tbody>
                                    <tr><td className="font-bold py-1 w-20">Cihaz:</td><td>{result.device_name}</td></tr>
                                    <tr><td className="font-bold py-1">Marka:</td><td>{result.brand || result.category}</td></tr>
                                    <tr><td className="font-bold py-1">Seri No:</td><td>{result.serial_no || "-"}</td></tr>
                                    <tr><td className="font-bold py-1">Aksesuar:</td><td>{accessories.join(", ")}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Arıza ve İşlem */}
                    <div className="print-box mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-bold text-xs uppercase text-gray-700 mb-1">BİLDİRİLEN ARIZA / ŞİKAYET</h4>
                                <p className="text-xs text-gray-900 italic min-h-[40px]">{result.problem_description || "-"}</p>
                            </div>
                            <div className="border-l border-gray-200 pl-4">
                                <h4 className="font-bold text-xs uppercase text-gray-700 mb-1">TEKNİSYEN RAPORU</h4>
                                <p className="text-xs text-gray-900 font-medium whitespace-pre-line">{result.technician_note || "İşlem devam ediyor."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mali Durum */}
                    <div className="mb-6">
                        <table className="w-full text-xs border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2 text-left">HİZMET / PARÇA</th>
                                    <th className="border border-gray-300 p-2 text-right w-32">TUTAR</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 p-2 font-bold">Teknik Servis Hizmeti ve Parça Bedeli Toplamı</td>
                                    <td className="border border-gray-300 p-2 text-right font-bold">{Number(result.price).toLocaleString()} ₺</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50">
                                    <td className="border border-gray-300 p-2 text-right font-bold">GENEL TOPLAM:</td>
                                    <td className="border border-gray-300 p-2 text-right font-black text-lg">{Number(result.price).toLocaleString()} ₺</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Garanti Bilgisi (Varsa) */}
                    {result.status === 'Teslim Edildi' && (
                        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg mb-6 bg-gray-50">
                            <h4 className="font-bold text-sm text-center mb-2">GARANTİ SERTİFİKASI</h4>
                            <div className="flex justify-between text-xs">
                                <div><strong>Süre:</strong> {result.warranty_duration || "-"}</div>
                                <div><strong>Bitiş:</strong> {result.warranty_end_date ? new Date(result.warranty_end_date).toLocaleDateString() : "-"}</div>
                                <div><strong>Kapsam:</strong> {result.warranty_scope || "Genel"}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / İmza */}
                <div className="print-footer">
                    <div className="grid grid-cols-2 gap-10 mb-4">
                        <div className="text-center">
                            <p className="font-bold text-xs mb-8">TESLİM EDEN (MÜŞTERİ)</p>
                            <div className="border-b border-black w-3/4 mx-auto"></div>
                            <p className="text-[10px] mt-1">{result.customer_name}</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-xs mb-8">TESLİM ALAN (SERVİS YETKİLİSİ)</p>
                            <div className="border-b border-black w-3/4 mx-auto"></div>
                            <p className="text-[10px] mt-1">{COMPANY_INFO.name}</p>
                        </div>
                    </div>
                    <p className="text-center text-gray-500 italic">
                        * Cihaz teslim alındıktan sonra 3 ay içerisinde alınmayan cihazlardan firmamız sorumlu değildir. Sıvı temaslı cihazlara garanti verilmez. Veri yedeği müşteriye aittir.
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}