"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { 
  Calendar, MessageCircle, CheckCircle2, Search, Wrench, 
  User, ArrowLeft, Clock, CalendarDays, ChevronRight, AlertCircle 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function BakimTakipPage() {
  const router = useRouter();
  const [allJobs, setAllJobs] = useState<any[]>([]); // Tüm veriyi tutar
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]); // Ekranda görünen
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'overdue' | 'today' | 'upcoming'>('today');

  // İstatistikler
  const [counts, setCounts] = useState({ overdue: 0, today: 0, upcoming: 0 });

  useEffect(() => {
    fetchMaintenanceJobs();
  }, []);

  // --- 1. VERİ ÇEKME VE GRUPLAMA ---
  const fetchMaintenanceJobs = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    
    // Gelecek 30 günü de kapsayacak şekilde çekelim
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureStr = futureDate.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('aura_jobs')
      .select('*')
      .eq('status', 'Teslim Edildi')
      .not('next_maintenance_date', 'is', null) // Tarihi boş olmayanlar
      .lte('next_maintenance_date', futureStr) // Bugünden 30 gün sonrasına kadar olanlar
      .order('next_maintenance_date', { ascending: true });

    if (data) {
      setAllJobs(data);
      // Sayıları hesapla
      const overdue = data.filter(j => j.next_maintenance_date < today).length;
      const todayCount = data.filter(j => j.next_maintenance_date === today).length;
      const upcoming = data.filter(j => j.next_maintenance_date > today).length;
      setCounts({ overdue, today: todayCount, upcoming });
      
      // Varsayılan olarak "Bugün"ü veya dolu olan ilk sekmeyi filtrele
      filterData(activeTab, searchTerm, data);
    }
    setLoading(false);
  };

  // --- 2. FİLTRELEME MANTIĞI ---
  useEffect(() => {
    filterData(activeTab, searchTerm, allJobs);
  }, [activeTab, searchTerm, allJobs]);

  const filterData = (tab: string, search: string, sourceData: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    let filtered = sourceData;

    // Sekme Filtresi
    if (tab === 'overdue') filtered = filtered.filter(j => j.next_maintenance_date < today);
    else if (tab === 'today') filtered = filtered.filter(j => j.next_maintenance_date === today);
    else if (tab === 'upcoming') filtered = filtered.filter(j => j.next_maintenance_date > today);

    // Arama Filtresi
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(j => 
        j.customer?.toLowerCase().includes(lowerSearch) || 
        j.device?.toLowerCase().includes(lowerSearch) ||
        j.phone?.includes(search)
      );
    }

    setFilteredJobs(filtered);
  };

  // --- 3. WHATSAPP MESAJI ---
  const sendMaintenanceMessage = (job: any) => {
    let cleanPhone = (job.phone || "").replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;

    const message = `Merhaba Sayın *${job.customer}*,\n\nAura Bilişim'de işlem gören *${job.device}* cihazınızın periyodik bakım zamanı gelmiştir. Cihazınızın ömrünü uzatmak için genel bakım yaptırmanızı öneririz.\n\nRandevu için: 0539 632 14 29`;
    
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // --- 4. ERTELEME FONKSİYONU ---
  const postponeJob = async (jobId: number, months: number) => {
    if(!confirm(`Bu cihazın bakım tarihini ${months} ay ertelemek istiyor musunuz?`)) return;

    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() + months);
    const dateStr = newDate.toISOString().split('T')[0];

    const { error } = await supabase
      .from('aura_jobs')
      .update({ next_maintenance_date: dateStr })
      .eq('id', jobId);

    if (!error) {
      alert("Tarih güncellendi!");
      fetchMaintenanceJobs(); // Listeyi yenile
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 md:p-8 font-sans">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
             <div className="flex items-center gap-4 w-full md:w-auto">
                 <button onClick={() => router.back()} className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"><ArrowLeft/></button>
                 <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Wrench className="text-cyan-500" /> BAKIM TAKİP
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">Periyodik bakım zamanı gelen cihazların yönetimi.</p>
                 </div>
             </div>

             {/* ARAMA */}
             <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18}/>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Müşteri veya cihaz ara..." 
                  className="w-full bg-[#151921] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                />
             </div>
        </div>

        {/* TABLAR (SEKMELER) */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
            <button 
                onClick={() => setActiveTab('overdue')} 
                className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${activeTab === 'overdue' ? 'bg-red-500/10 border-red-500 text-white' : 'bg-[#151921] border-slate-800 text-slate-500 hover:bg-slate-800'}`}
            >
                <div className="text-xs font-bold uppercase mb-1 flex items-center gap-2"><AlertCircle size={14}/> GECİKENLER</div>
                <div className={`text-2xl font-black ${activeTab === 'overdue' ? 'text-red-500' : 'text-slate-400'}`}>{counts.overdue}</div>
            </button>

            <button 
                onClick={() => setActiveTab('today')} 
                className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${activeTab === 'today' ? 'bg-yellow-500/10 border-yellow-500 text-white' : 'bg-[#151921] border-slate-800 text-slate-500 hover:bg-slate-800'}`}
            >
                <div className="text-xs font-bold uppercase mb-1 flex items-center gap-2"><Clock size={14}/> BUGÜN</div>
                <div className={`text-2xl font-black ${activeTab === 'today' ? 'text-yellow-500' : 'text-slate-400'}`}>{counts.today}</div>
            </button>

            <button 
                onClick={() => setActiveTab('upcoming')} 
                className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${activeTab === 'upcoming' ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-[#151921] border-slate-800 text-slate-500 hover:bg-slate-800'}`}
            >
                <div className="text-xs font-bold uppercase mb-1 flex items-center gap-2"><CalendarDays size={14}/> YAKLAŞAN (30 Gün)</div>
                <div className={`text-2xl font-black ${activeTab === 'upcoming' ? 'text-blue-500' : 'text-slate-400'}`}>{counts.upcoming}</div>
            </button>
        </div>

        {/* LİSTE */}
        {loading ? <div className="text-center p-10 text-slate-500 animate-pulse">Yükleniyor...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {filteredJobs.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#151921] rounded-2xl border border-dashed border-slate-800 text-slate-500">
                        <CheckCircle2 size={48} className="mb-4 text-slate-600"/>
                        <p>Bu kategoride bakım kaydı bulunamadı.</p>
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <div key={job.id} className="bg-[#151921] border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all group relative flex flex-col">
                            
                            {/* Üst Kısım: Tarih ve Kategori */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider
                                    ${activeTab === 'overdue' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                      activeTab === 'today' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                      'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                    {new Date(job.next_maintenance_date).toLocaleDateString('tr-TR', {day: 'numeric', month: 'long'})}
                                </div>
                                <div className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded">{job.category}</div>
                            </div>

                            {/* Cihaz ve Müşteri */}
                            <div className="mb-6 flex-1">
                                <h3 className="font-black text-white text-xl mb-1 line-clamp-1" title={job.device}>{job.device}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                                    <User size={14} className="text-cyan-500"/> 
                                    <span className="truncate">{job.customer}</span>
                                </div>
                                <div className="text-xs text-slate-600 font-mono">Son İşlem: {new Date(job.updated_at).toLocaleDateString('tr-TR')}</div>
                            </div>

                            {/* Aksiyon Butonları */}
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <button 
                                    onClick={() => sendMaintenanceMessage(job)}
                                    className="col-span-2 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-[#0a3319] font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                                >
                                    <MessageCircle size={18}/> WHATSAPP
                                </button>
                                
                                <button 
                                    onClick={() => postponeJob(job.id, 1)}
                                    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors border border-slate-700"
                                >
                                    <Calendar size={12}/> 1 Ay Ertele
                                </button>
                                <button 
                                    onClick={() => postponeJob(job.id, 6)}
                                    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors border border-slate-700"
                                >
                                    <CalendarDays size={12}/> 6 Ay Ertele
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>
        )}
    </div>
  );
}