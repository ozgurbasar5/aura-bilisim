"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { Calendar, MessageCircle, CheckCircle2, Search, Wrench, User, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BakimTakipPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceJobs();
  }, []);

  const fetchMaintenanceJobs = async () => {
    // Bakım tarihi gelmiş veya geçmiş olanları çek (Sadece Teslim Edilmişler)
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('aura_jobs')
      .select('*')
      .eq('status', 'Teslim Edildi')
      .lte('next_maintenance_date', today) // Tarihi bugün veya daha eski olanlar
      .order('next_maintenance_date', { ascending: false });

    if (data) setJobs(data);
    setLoading(false);
  };

  const sendMaintenanceMessage = (job: any) => {
    let cleanPhone = (job.phone || "").replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;

    const message = `Merhaba Sayın *${job.customer}*,\n\nAura Bilişim'de işlem gören *${job.device}* cihazınızın periyodik bakım zamanı gelmiştir. Cihazınızın ilk günkü performansını koruması ve ömrünün uzaması için genel bakım yaptırmanızı öneririz.\n\nDetaylı bilgi ve randevu için bize yazabilirsiniz.\n\n*Aura Bilişim Teknik Servis*`;
    
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-8 font-sans">
        <div className="flex items-center gap-4 mb-6">
             <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"><ArrowLeft/></button>
             <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Wrench className="text-cyan-500" /> PERİYODİK BAKIM HATIRLATICISI
                </h1>
                <p className="text-slate-400 text-sm">Bakım zamanı gelen cihazlar burada listelenir.</p>
             </div>
        </div>

        {loading ? <div className="text-center p-10">Yükleniyor...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-[#151921] rounded-2xl border border-dashed border-slate-800 text-slate-500">
                        <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500"/>
                        Şu an bakım zamanı gelen cihaz yok. Her şey yolunda!
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} className="bg-[#151921] border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Wrench size={60} />
                            </div>
                            
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <div className="text-xs font-bold text-cyan-500 uppercase mb-1">{job.category}</div>
                                    <h3 className="font-black text-white text-lg">{job.device}</h3>
                                </div>
                                <div className="bg-red-900/30 text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-500/20">
                                    {job.next_maintenance_date}
                                </div>
                            </div>

                            <div className="space-y-2 mb-6 text-sm text-slate-400 relative z-10">
                                <div className="flex items-center gap-2"><User size={14}/> {job.customer}</div>
                                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Son İşlem: {new Date(job.updated_at).toLocaleDateString('tr-TR')}</div>
                            </div>

                            <button 
                                onClick={() => sendMaintenanceMessage(job)}
                                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 relative z-10"
                            >
                                <MessageCircle size={18}/> BAKIM MESAJI GÖNDER
                            </button>
                        </div>
                    ))
                )}
            </div>
        )}
    </div>
  );
}