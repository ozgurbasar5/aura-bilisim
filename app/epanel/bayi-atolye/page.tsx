"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Wrench, ArrowRight, Building2, Briefcase } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function BayiAtolyeListesi() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDealerJobs();
  }, []);

  const fetchDealerJobs = async () => {
    // SADECE 'Bayi Cihazı' KATEGORİSİNDEKİLERİ ÇEKİYORUZ
    const { data, error } = await supabase
      .from('aura_jobs')
      .select('*')
      .eq('category', 'Bayi Cihazı') 
      .order('created_at', { ascending: false });

    if (data) setJobs(data);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("teslim")) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (s.includes("hazır")) return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
    return "text-amber-400 bg-amber-400/10 border-amber-400/20"; 
  };

  const filteredJobs = jobs.filter(job => 
    (job.customer || "").toLowerCase().includes(search.toLowerCase()) ||
    (job.device || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen text-slate-200 pb-20 animate-in fade-in">
      {/* Üst Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Briefcase className="text-amber-500" size={32}/> BAYİ ATÖLYESİ
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">KURUMSAL CİHAZ TAKİBİ</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Bayi veya Cihaz Ara..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full bg-[#0a0c10] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-amber-500 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
          </div>
          {/* Yeni Kayıt butonu burada opsiyonel, genelde Bayi Yönetiminden eklenir ama buraya da koyabiliriz */}
          <Link href="/epanel/bayiler">
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-5 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap">
               <Building2 size={18}/> BAYİ LİSTESİNE GİT
            </button>
          </Link>
        </div>
      </div>

      {/* Liste */}
      {loading ? <div className="text-center py-20 text-slate-500">Yükleniyor...</div> : (
        <div className="grid gap-3">
          {filteredJobs.map((job) => (
            <Link key={job.id} href={`/epanel/bayi-atolye/${job.id}`}>
              <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-amber-500/50 transition-all group cursor-pointer relative overflow-hidden">
                
                {/* Sol: Bayi ve Cihaz */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {job.customer?.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base flex items-center gap-2">
                        {job.customer} 
                        <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold">B2B</span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="font-mono bg-white/5 px-1.5 rounded text-slate-300">{job.tracking_code}</span>
                      <span className="flex items-center gap-1"><Wrench size={12}/> {job.device}</span>
                    </div>
                  </div>
                </div>

                {/* Sağ: Durum ve Tutar */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(job.status)}`}>
                    {job.status || "Bekliyor"}
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="text-lg font-black text-white">{job.price ? Number(job.price).toLocaleString('tr-TR') : 0} ₺</div>
                    <div className="text-[10px] text-slate-500">Bayi Fiyatı</div>
                  </div>
                  <ArrowRight className="text-slate-600 group-hover:text-amber-500 transition-colors"/>
                </div>

              </div>
            </Link>
          ))}
          {filteredJobs.length === 0 && (
            <div className="text-center py-16 bg-[#151a25] rounded-xl border border-dashed border-slate-800">
                <Briefcase size={48} className="mx-auto text-slate-700 mb-4"/>
                <p className="text-slate-500">Henüz bayi cihazı kaydı yok.</p>
                <Link href="/epanel/bayiler" className="text-amber-500 hover:underline text-sm mt-2 block">Bayi Yönetiminden Ekle</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}