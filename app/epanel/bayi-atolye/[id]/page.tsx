"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Printer, Building2, Smartphone, Zap, Laptop, Briefcase,
  CheckSquare, ClipboardCheck, History, CreditCard, AlertTriangle, Send, Phone, Mail, 
  MessageSquare, Lock, Activity, Wrench, HardDrive, Trash2, Camera, Upload, X, 
  CheckCircle2, XCircle, ShoppingBag, FileText, PlusCircle, Book, Search, Plus, Clock, 
  PackageMinus, ChevronRight, TrendingUp, ShieldCheck, Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 

export default function BayiAtolyeDetayPage() {
  const router = useRouter();
  const params = useParams(); 
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("Sistem");

  // --- MODAL & SEARCH STATE'LERİ ---
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockSearchTerm, setStockSearchTerm] = useState("");
  const [stockResults, setStockResults] = useState<any[]>([]);
  
  const [isWikiModalOpen, setIsWikiModalOpen] = useState(false);
  const [wikiSearchTerm, setWikiSearchTerm] = useState("");
  const [wikiResults, setWikiResults] = useState<any[]>([]);

  // --- VERİ STATE'LERİ ---
  const [job, setJob] = useState<any>(null);
  const [timelineLogs, setTimelineLogs] = useState<any[]>([]);
  const [usedParts, setUsedParts] = useState<any[]>([]);

  // Form State'leri
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [processDetails, setProcessDetails] = useState("");
  const [adminNote, setAdminNote] = useState(""); // Gizli notlar
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) setCurrentUserEmail(user.email);
        fetchJobDetail();
    };
    init();
  }, [params.id]);

  const fetchJobDetail = async () => {
    const { data, error } = await supabase.from('aura_jobs').select('*').eq('id', params.id).single();
    if (data) {
        setJob(data);
        setStatus(data.status || "Bekliyor");
        setPrice(data.price || 0);
        setCost(data.cost || 0);
        setProcessDetails(data.process_details || "");
        setAdminNote(data.private_note || "");
        setImages(data.images || []);
        fetchTimeline(data.id);
        fetchUsedParts(data.id);
    }
    setLoading(false);
  };

  // --- OPERASYONEL FONKSİYONLAR ---

  const fetchTimeline = async (jobId: number) => {
    const { data } = await supabase.from('aura_timeline').select('*').eq('job_id', jobId).order('created_at', { ascending: false });
    if (data) setTimelineLogs(data);
  };

  const logAction = async (action: string, desc: string) => {
    await supabase.from('aura_timeline').insert([{
        job_id: params.id,
        action_type: action,
        description: desc,
        created_by: currentUserEmail
    }]);
    fetchTimeline(Number(params.id));
  };

  const fetchUsedParts = async (jobId: number) => {
    const { data } = await supabase.from('aura_servis_parcalari').select(`*, aura_stok(urun_adi)`).eq('job_id', jobId);
    if(data) setUsedParts(data);
  };

  const handleUpdate = async () => {
    setSaving(true);
    const { error } = await supabase.from('aura_jobs').update({
        status, price, cost, process_details: processDetails, private_note: adminNote, images,
        updated_at: new Date().toISOString()
    }).eq('id', params.id);

    if (!error) {
        logAction("Bayi Kaydı Güncellendi", `Durum: ${status}, Bayi Fiyatı: ${price} TL`);
        alert("B2B Servis Kaydı Güncellendi.");
    }
    setSaving(false);
  };

  const sendB2BWhatsapp = () => {
    let phone = job.phone.replace(/\D/g, ''); 
    if (!phone.startsWith('90')) phone = '90' + phone;

    const message = `
*AURA BUSINESS | Servis Raporu* 🏛
---------------------------------------
*İş Ortağımız:* ${job.customer}
*Cihaz:* ${job.device}
*Takip Kodu:* ${job.tracking_code}

✅ *Durum:* ${status.toUpperCase()}
💰 *Bayi Fiyatı:* ${price} TL
🛠 *İşlem:* ${processDetails || 'Onarım tamamlandı.'}

Cihaz sevkiyat için hazırdır. Teşekkür ederiz.
    `.trim();

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div className="p-20 text-center text-amber-500 font-bold animate-pulse">B2B VERİLERİ YÜKLENİYOR...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-amber-500/30">
        
        {/* TOP BAR / B2B HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center gap-5">
                <button onClick={() => router.push('/epanel/bayi-atolye')} className="p-3 bg-white/5 hover:bg-amber-500/10 text-slate-400 hover:text-amber-500 rounded-2xl border border-white/5 transition-all">
                    <ArrowLeft size={20}/>
                </button>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">B2B Partner Portal</span>
                        <span className="text-slate-500 text-xs font-mono">ID: {job.tracking_code}</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        {job.customer} <span className="text-amber-500">/</span> {job.device}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
                <button onClick={sendB2BWhatsapp} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white px-6 py-3 rounded-xl border border-green-500/20 font-bold transition-all shadow-lg shadow-green-900/10">
                    <MessageSquare size={18}/> RAPOR AT
                </button>
                <button onClick={handleUpdate} disabled={saving} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-xl font-black transition-all shadow-xl shadow-amber-500/20">
                    {saving ? "..." : <><Save size={20}/> KAYDET</>}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
            
            {/* SOL KOLON: TEKNİK PANEL */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
                
                {/* 1. BAYİ & CİHAZ KARTI */}
                <div className="bg-[#0a0e17] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Building2 size={120} className="text-amber-500"/></div>
                    <h3 className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><ShieldCheck size={16}/> Kurumsal Kayıt Bilgileri</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Firma / Yetkili</label>
                            <p className="text-lg font-bold text-white">{job.customer}</p>
                            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1"><Phone size={12}/> {job.phone}</p>
                        </div>
                        <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Cihaz / Seri No</label>
                            <p className="text-lg font-bold text-white">{job.device}</p>
                            <p className="text-sm font-mono text-cyan-500 mt-1">{job.serial_no || "SN_YOK"}</p>
                        </div>
                        <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Giriş Tarihi</label>
                            <p className="text-lg font-bold text-white">{new Date(job.created_at).toLocaleDateString('tr-TR')}</p>
                            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1"><Clock size={12}/> {new Date(job.created_at).toLocaleTimeString('tr-TR')}</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-3">Bayi Şikayeti & Servis Notu</label>
                        <div className="bg-black/30 border border-white/5 p-4 rounded-2xl text-slate-300 text-sm italic leading-relaxed">
                            "{job.problem || "Şikayet bilgisi girilmemiş."}"
                        </div>
                    </div>
                </div>

                {/* 2. OPERASYON MERKEZİ (FORM) */}
                <div className="bg-[#0a0e17] border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                    <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Wrench size={16}/> Teknik Servis Raporu</h3>
                    
                    <div className="space-y-6">
                        <div className="relative">
                            <label className="absolute -top-2.5 left-5 bg-[#0a0e17] px-2 text-[10px] font-bold text-slate-500 uppercase">Yapılan İşlemler (Bayi Görecek)</label>
                            <textarea 
                                value={processDetails}
                                onChange={e => setProcessDetails(e.target.value)}
                                className="w-full bg-transparent border border-white/10 rounded-2xl p-5 text-white focus:border-cyan-500 outline-none min-h-[200px] text-sm leading-relaxed transition-all"
                                placeholder="Bayiye sunulacak detaylı onarım raporunu buraya yazın..."
                            />
                        </div>

                        <div className="relative group">
                            <label className="absolute -top-2.5 left-5 bg-[#0a0e17] px-2 text-[10px] font-bold text-red-500 uppercase flex items-center gap-1"><Lock size={10}/> Dahili Notlar (Sadece Biz Görürüz)</label>
                            <input 
                                value={adminNote}
                                onChange={e => setAdminNote(e.target.value)}
                                className="w-full bg-red-500/5 border border-red-900/20 rounded-xl p-4 text-slate-300 text-sm focus:border-red-500 outline-none transition-all"
                                placeholder="Örn: Cihaz daha önce başka yerde kurcalanmış, vida eksik..."
                            />
                        </div>
                    </div>
                </div>

                {/* 3. B2B FOTOĞRAF ARŞİVİ */}
                <div className="bg-[#0a0e17] border border-white/5 rounded-[2rem] p-8">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-bold text-purple-500 uppercase tracking-[0.2em] flex items-center gap-2"><Camera size={16}/> Servis Görselleri</h3>
                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-[10px] font-bold transition-all">
                            {uploading ? "YÜKLENİYOR..." : "YENİ EKLE"}
                            <input type="file" multiple className="hidden" onChange={e => {/* Upload logic here */}} />
                        </label>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((img, i) => (
                            <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-white/5 group relative">
                                <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110"/>
                                <button className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                            </div>
                        ))}
                        <div className="aspect-video rounded-2xl border-2 border-dashed border-white/5 flex items-center justify-center text-slate-700">
                            <ImageIcon size={32}/>
                        </div>
                     </div>
                </div>
            </div>

            {/* SAĞ KOLON: FİNANS & DURUM PANELİ */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
                
                {/* 1. DURUM & FİYAT (KRİTİK ALAN) */}
                <div className="bg-[#1e293b] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl sticky top-8">
                    <div className="mb-8">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Güncel İşlem Durumu</label>
                        <select 
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500 transition-all appearance-none"
                        >
                            <option value="Bekliyor">⏳ Bekliyor</option>
                            <option value="İşlemde">⚙️ İşlemde</option>
                            <option value="Parça Bekliyor">📦 Parça Bekliyor</option>
                            <option value="Onay Bekliyor">⚖️ Onay Bekliyor</option>
                            <option value="Hazır">✅ Hazır / Test Ok</option>
                            <option value="Teslim Edildi">🚀 Teslim Edildi</option>
                            <option value="İade">❌ İptal / İade</option>
                        </select>
                    </div>

                    <div className="grid gap-6 mb-8">
                        <div className="bg-[#020617] p-5 rounded-3xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={40} className="text-green-500"/></div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Bayi Fatura Tutarı</label>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-white">₺</span>
                                <input 
                                    type="number" 
                                    value={price}
                                    onChange={e => setPrice(Number(e.target.value))}
                                    className="bg-transparent text-3xl font-black text-white outline-none w-full"
                                />
                            </div>
                        </div>

                        <div className="bg-[#020617] p-5 rounded-3xl border border-white/5 relative overflow-hidden opacity-60">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Net Parça Maliyeti</label>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-red-400">₺</span>
                                <input 
                                    type="number" 
                                    value={cost}
                                    onChange={e => setCost(Number(e.target.value))}
                                    className="bg-transparent text-xl font-bold text-red-400 outline-none w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* KAR HESAPLAYICI (Sadece Admin Görür) */}
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex justify-between items-center mb-8">
                        <span className="text-xs font-bold text-amber-500 uppercase">Tahmini B2B Karı:</span>
                        <span className="text-xl font-black text-amber-400">₺{price - cost}</span>
                    </div>

                    <button onClick={handleUpdate} className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:-translate-y-1 active:translate-y-0">
                        DEĞİŞİKLİKLERİ KAYDET
                    </button>
                </div>

                {/* 2. ZAMAN TÜNELİ (B2B AUDIT LOG) */}
                <div className="bg-[#0a0e17] border border-white/5 rounded-[2rem] p-8 shadow-2xl max-h-[400px] flex flex-col">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><History size={16}/> İşlem Geçmişi</h3>
                    <div className="overflow-y-auto custom-scrollbar flex-1 space-y-6">
                        {timelineLogs.map((log, i) => (
                            <div key={i} className="flex gap-4 relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div>
                                    <div className="w-px h-full bg-white/10 mt-2"></div>
                                </div>
                                <div className="pb-6">
                                    <p className="text-xs font-bold text-white">{log.action_type}</p>
                                    <p className="text-[10px] text-slate-500 leading-tight mt-1">{log.description}</p>
                                    <div className="flex gap-3 mt-2">
                                        <span className="text-[9px] text-slate-600 flex items-center gap-1"><Clock size={10}/> {new Date(log.created_at).toLocaleDateString()}</span>
                                        <span className="text-[9px] text-amber-900 font-bold uppercase">{log.created_by?.split('@')[0]}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
}