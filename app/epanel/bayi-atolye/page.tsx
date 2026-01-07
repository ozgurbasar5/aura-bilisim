"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { 
  Briefcase, Search, Wrench, AlertTriangle, 
  Clock, Smartphone, ChevronRight, Zap,
  TrendingUp, RefreshCw, UserCheck
} from "lucide-react";

export default function BayiAtolyePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tümü");

  // İstatistikler
  const [stats, setStats] = useState({
    total: 0, pendingApproval: 0, inProgress: 0, completed: 0, totalRevenue: 0
  });

  useEffect(() => { fetchSmartDealerJobs(); }, []);

  const fetchSmartDealerJobs = async () => {
    setLoading(true);
    try {
        const { data: dealers } = await supabase.from('bayi_basvurulari').select('sirket_adi').eq('durum', 'Onaylandı');
        const dealerNames = dealers?.map(d => d.sirket_adi.toLowerCase().trim()) || [];

        const { data: allJobs } = await supabase.from('aura_jobs').select('*').order('updated_at', { ascending: false });

        if (allJobs) {
            const filteredData = allJobs.filter(job => {
                const isMarkedAsDealer = job.customer_type === 'Bayi';
                const jobCustomerName = job.customer?.trim().toLowerCase() || "";
                const isNameMatch = dealerNames.some(dName => jobCustomerName.includes(dName));
                return isMarkedAsDealer || isNameMatch;
            });

            setJobs(filteredData);
            setStats({
                total: filteredData.length,
                pendingApproval: filteredData.filter(j => j.approval_status === 'pending' || j.status === 'Onay Bekliyor').length,
                inProgress: filteredData.filter(j => ['İşlemde', 'Parça Bekleniyor', 'Test Aşamasında'].includes(j.status)).length,
                completed: filteredData.filter(j => j.status === 'Teslim Edildi' || j.status === 'Hazır').length,
                totalRevenue: filteredData.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0)
            });
        }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const displayedJobs = jobs.filter(job => {
      const searchMatch = 
        job.device?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tracking_code?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (statusFilter === "Tümü") return searchMatch;
      if (statusFilter === "Onay Bekleyen") return searchMatch && (job.approval_status === 'pending' || job.status === 'Onay Bekliyor');
      if (statusFilter === "Atölyede") return searchMatch && ['İşlemde', 'Parça Bekleniyor', 'Bekliyor', 'Test Aşamasında'].includes(job.status);
      if (statusFilter === "Tamamlanan") return searchMatch && ['Hazır', 'Teslim Edildi'].includes(job.status);
      return searchMatch;
  });

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3"><Briefcase size={32} className="text-indigo-500" /> KURUMSAL ATÖLYE</h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">Bayi ve iş ortaklarının servis süreçlerini yönetin.</p>
        </div>
        <button onClick={fetchSmartDealerJobs} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors group">
            <RefreshCw size={20} className={`group-hover:text-indigo-400 transition-colors ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* İSTATİSTİKLER (Kısaltıldı, önceki kodla aynı kalabilir) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#161b22] border border-indigo-500/30 p-5 rounded-2xl"><div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Toplam Bayi Cihazı</div><div className="text-3xl font-black text-white">{stats.total}</div></div>
          <div className="bg-[#161b22] border border-amber-500/30 p-5 rounded-2xl"><div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Atölyede İşlemde</div><div className="text-3xl font-black text-amber-500">{stats.inProgress}</div></div>
          <div className="bg-[#161b22] border border-red-500/30 p-5 rounded-2xl"><div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Onay Bekleyen</div><div className="text-3xl font-black text-white">{stats.pendingApproval}</div></div>
          <div className="bg-[#161b22] border border-green-500/30 p-5 rounded-2xl"><div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Toplam Ciro (Bayi)</div><div className="text-3xl font-black text-white">₺{stats.totalRevenue.toLocaleString()}</div></div>
      </div>

      {/* FİLTRELER */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {["Tümü", "Onay Bekleyen", "Atölyede", "Tamamlanan"].map((filter) => (
                  <button key={filter} onClick={() => setStatusFilter(filter)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === filter ? 'bg-indigo-600 text-white shadow-lg' : 'bg-[#0b0e14] text-slate-400 border border-slate-700'}`}>{filter}</button>
              ))}
          </div>
          <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
              <input type="text" placeholder="Bayi adı, cihaz veya takip no..." className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-indigo-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
      </div>

      {/* LİSTE */}
      <div className="grid grid-cols-1 gap-4">
          {loading ? <div className="text-center py-20 text-slate-500 font-bold animate-pulse">Veriler yükleniyor...</div> : displayedJobs.length === 0 ? 
              <div className="text-center py-20 bg-[#161b22] rounded-2xl border border-dashed border-slate-800 text-slate-500">Kayıt bulunamadı.</div> : (
              displayedJobs.map((job) => (
                  <div 
                    key={job.id} 
                    // --- DÜZELTME BURADA: ARTIK BAYİ ATÖLYE DETAYINA GİDİYOR ---
                    onClick={() => router.push(`/epanel/bayi-atolye/${job.id}`)} 
                    className={`bg-[#161b22] border rounded-2xl p-5 hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden ${job.approval_status === 'pending' ? 'border-red-500/40' : 'border-slate-800'}`}
                  >
                      {job.approval_status === 'pending' && <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl shadow-lg z-10 animate-pulse">ONAY BEKLİYOR</div>}
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-0">
                          <div className="flex items-center gap-5 w-full md:w-auto">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner border border-white/5 ${job.approval_status === 'pending' ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-500'}`}><Smartphone size={24} /></div>
                              <div>
                                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{job.device}</h3>
                                  <div className="flex items-center gap-2 mt-1"><span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1"><UserCheck size={12}/> {job.customer}</span><span className="text-[10px] text-slate-500 font-mono bg-black/30 px-2 py-0.5 rounded">{job.tracking_code}</span></div>
                              </div>
                          </div>
                          <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start bg-black/20 p-3 rounded-xl border border-white/5">
                              <div className="text-center min-w-[80px]"><div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Durum</div><div className={`text-sm font-bold ${job.status === 'Teslim Edildi' ? 'text-green-400' : 'text-amber-500'}`}>{job.status}</div></div>
                              <div className="w-px h-8 bg-slate-700"></div>
                              <div className="text-center min-w-[80px]"><div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Tutar</div><div className="text-sm font-black text-white">₺{Number(job.price).toLocaleString()}</div></div>
                              <div className="w-px h-8 bg-slate-700"></div>
                              <div className="text-center min-w-[80px]"><div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Tarih</div><div className="text-xs text-slate-300 flex items-center justify-center gap-1"><Clock size={10}/> {new Date(job.created_at).toLocaleDateString('tr-TR', {day:'numeric', month:'short'})}</div></div>
                          </div>
                          <div className="w-full md:w-auto flex justify-end"><button className={`p-3 rounded-xl transition-colors ${job.approval_status === 'pending' ? 'bg-red-500 hover:bg-red-400 text-white shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'}`}>{job.approval_status === 'pending' ? <Zap size={20} className="animate-bounce"/> : <ChevronRight size={20}/>}</button></div>
                      </div>
                      {job.approval_status === 'pending' && <div className="mt-4 pt-3 border-t border-red-500/20 flex items-center gap-2 text-xs text-red-300"><AlertTriangle size={14} /><span><strong>DİKKAT:</strong> {job.approval_amount}₺ ekstra onay bekleniyor. Açıklama: "{job.approval_desc}"</span></div>}
                  </div>
              ))
          )}
      </div>
    </div>
  );
}