"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { 
  CheckCircle2, Clock, AlertTriangle, Package, ImageIcon, 
  ChevronRight, Wrench, Smartphone, Calendar, User
} from "lucide-react";

export default function CihazTakipPage() {
  const { id } = useParams(); // Takip kodu veya ID gelebilir
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- EVRENSEL ÇÖZÜCÜ ---
  const parseArray = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        if (val === "null" || val.trim() === "") return [];
        try { return JSON.parse(val); } catch { return []; }
    }
    return [];
  };

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      // Hem ID hem Tracking Code ile arama yapalım
      const { data, error } = await supabase
        .from('aura_jobs')
        .select('*')
        .or(`id.eq.${id},tracking_code.eq.${id}`) 
        .single();

      if (data) {
         setJob({
             ...data,
             // Verileri güvenli hale getir
             images: parseArray(data.images),
             sold_upsells: parseArray(data.sold_upsells),
             accessories: parseArray(data.accessories || data.accessory),
             process_details: parseArray(data.process_details)
         });
      }
      setLoading(false);
    };

    if(id) fetchJob();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Yükleniyor...</div>;
  if (!job) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Kayıt Bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#151921] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-black mb-1">{job.device}</h1>
                        <p className="text-cyan-400 font-mono text-sm tracking-widest">{job.tracking_code}</p>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                        <span className="text-xs font-bold text-slate-400 block mb-0.5">DURUM</span>
                        <span className="text-lg font-bold text-white">{job.status}</span>
                    </div>
                </div>
                <div className="flex gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(job.created_at).toLocaleDateString('tr-TR')}</span>
                    <span className="flex items-center gap-1"><User size={12}/> {job.customer}</span>
                </div>
            </div>
            {/* Dekoratif Arka Plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="p-8 space-y-8">
            
            {/* Arıza */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-500"/> Şikayet / Arıza
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm border border-slate-100">
                    {job.problem}
                </div>
            </div>

            {/* İşlemler */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Wrench size={14} className="text-blue-500"/> Yapılan İşlemler
                </h3>
                <div className="bg-blue-50/50 p-4 rounded-xl text-slate-700 text-sm border border-blue-100 whitespace-pre-line">
                    {job.technician_note || "Cihazınız işlem sırasındadır."}
                </div>
            </div>

            {/* Ekstra Ürünler (Upsell) - HİBRİT GÖSTERİM */}
            {job.sold_upsells && job.sold_upsells.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Package size={14} className="text-green-500"/> Ekstra Satın Alınanlar
                    </h3>
                    <div className="space-y-2">
                        {job.sold_upsells.map((item:any, idx:number) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-green-500"/>
                                    <span className="text-sm font-bold text-slate-700">
                                        {typeof item === 'object' ? (item.name || item.urun_adi) : item}
                                    </span>
                                </div>
                                {typeof item === 'object' && (item.price || item.satis_fiyati) && (
                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                        {item.price || item.satis_fiyati} ₺
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Fotoğraflar */}
            {job.images && job.images.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <ImageIcon size={14} className="text-purple-500"/> Cihaz Fotoğrafları
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {job.images.map((img:string, idx:number) => (
                            <a key={idx} href={img} target="_blank" rel="noreferrer" className="block relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

             {/* Zaman Tüneli (Timeline) */}
             <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock size={14} className="text-orange-500"/> İşlem Geçmişi
                </h3>
                <div className="space-y-4 relative pl-2">
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                    {/* Logları birleştir (process_details + varsa timeline tablosu ama burada basitlik için process_details yeterli olabilir, veya hibrit) */}
                    {/* Burada sadece process_details'i gösteriyorum basitlik için */}
                    {job.process_details && job.process_details.length > 0 ? job.process_details.map((log:any, i:number) => (
                        <div key={i} className="relative pl-6">
                            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-orange-500 z-10"></div>
                            <div className="text-xs text-slate-500 mb-0.5">{new Date(log.date || log.created_at).toLocaleString('tr-TR')}</div>
                            <div className="text-sm font-bold text-slate-800">{log.action || log.action_type}</div>
                            <div className="text-xs text-slate-600">{log.details || log.description}</div>
                        </div>
                    )) : <div className="text-xs text-slate-400 pl-6">Kayıt yok.</div>}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}