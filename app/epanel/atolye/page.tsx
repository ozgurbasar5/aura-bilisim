"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Smartphone, CheckCircle, Clock } from "lucide-react";
import { getWorkshopFromStorage } from "@/utils/storage";

export default function AtolyeListesi() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setJobs(getWorkshopFromStorage());
  }, []);

  // --- DÜZELTME: ID'yi String'e çevirerek arama ---
  const filteredJobs = jobs.filter((job) => 
    job.customer.toLowerCase().includes(search.toLowerCase()) ||
    job.device.toLowerCase().includes(search.toLowerCase()) ||
    job.id.toString().includes(search) // <-- BURASI SAYIYI YAZIYA ÇEVİRİR VE BULUR
  );

  return (
    <div className="p-6 text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
          <Smartphone className="text-cyan-500" /> ATÖLYE LİSTESİ
        </h1>
        <button onClick={() => router.push('/epanel/atolye/yeni')} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
          <Plus size={18} /> YENİ KAYIT
        </button>
      </div>

      {/* Arama Barı */}
      <div className="bg-[#151921] p-4 rounded-xl mb-6 flex gap-4 border border-slate-800">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-500" size={18}/>
            <input 
                type="text" 
                placeholder="Takip No, Müşteri veya Cihaz Ara..." 
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg py-2.5 pl-10 text-white outline-none focus:border-cyan-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <button className="bg-[#0b0e14] border border-slate-700 px-4 rounded-lg text-slate-400 hover:text-white"><Filter size={18}/></button>
      </div>

      {/* Liste */}
      <div className="grid gap-4">
        {filteredJobs.map((job) => (
            <div key={job.id} onClick={() => router.push(`/epanel/atolye/${job.id}`)} className="bg-[#151921] border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-cyan-600 cursor-pointer transition-all group">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center text-cyan-500 font-bold text-xs group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        #{job.id}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{job.customer}</h3>
                        <p className="text-xs text-slate-500">{job.device} • {job.date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded text-xs font-bold ${job.status === 'Hazır' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {job.status}
                    </span>
                    <div className="text-right">
                        <p className="text-sm font-bold text-white">{job.price} ₺</p>
                        <p className="text-[10px] text-slate-500">Tutar</p>
                    </div>
                </div>
            </div>
        ))}
        {filteredJobs.length === 0 && <div className="text-center text-slate-500 py-10">Kayıt bulunamadı.</div>}
      </div>
    </div>
  );
}