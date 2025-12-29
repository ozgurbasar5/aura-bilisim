"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Wrench, Clock, ArrowRight, User } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function AtolyeListesi() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      // Supabase'den verileri çek (En yeniden eskiye)
      const { data, error } = await supabase
        .from('aura_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setJobs(data);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  // Durum Renklendirme
  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("teslim")) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (s.includes("hazır")) return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
    if (s.includes("iade") || s.includes("iptal")) return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"; 
  };

  // Arama Filtresi
  const filteredJobs = jobs.filter(job => 
    (job.customer || "").toLowerCase().includes(search.toLowerCase()) ||
    (job.device || "").toLowerCase().includes(search.toLowerCase()) ||
    (job.tracking_code || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-slate-200 pb-20 animate-in fade-in">
      {/* Üst Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Wrench className="text-cyan-500" size={32}/> ATÖLYE
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">TEKNİK SERVİS LİSTESİ</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input type="text" placeholder="Ara (Ad, Cihaz, Kod)..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#0a0c10] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500 transition-all"/>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
          </div>
          <Link href="/epanel/atolye/yeni">
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap shadow-lg shadow-cyan-900/20"><Plus size={20}/> YENİ GİRİŞ</button>
          </Link>
        </div>
      </div>

      {/* Liste */}
      {loading ? <div className="text-center py-20 text-slate-500">Yükleniyor...</div> : (
        <div className="grid gap-3">
          {filteredJobs.map((job) => (
            <Link key={job.id} href={`/epanel/atolye/${job.id}`}>
              <div className="bg-[#151a25] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-cyan-500/50 transition-all group cursor-pointer relative overflow-hidden">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg bg-slate-800 text-slate-400`}>
                    {job.customer?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">{job.customer}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="text-cyan-400 font-mono bg-cyan-400/10 px-1.5 rounded">{job.tracking_code}</span>
                      <span className="flex items-center gap-1"><Wrench size={12}/> {job.device}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(job.status)}`}>
                    {job.status || "Bekliyor"}
                  </div>
                  <div className="text-right w-20">
                    <div className="text-lg font-black text-white">{job.price ? Number(job.price).toLocaleString('tr-TR') : 0} ₺</div>
                  </div>
                  <ArrowRight className="text-slate-600 group-hover:text-cyan-500 transition-colors"/>
                </div>
              </div>
            </Link>
          ))}
          {filteredJobs.length === 0 && <div className="text-center py-10 text-slate-500 bg-[#151a25] rounded-xl border border-dashed border-slate-800">Kayıt bulunamadı.</div>}
        </div>
      )}
    </div>
  );
}