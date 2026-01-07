"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import BrandLogo from "@/components/BrandLogo";
import { 
  LayoutDashboard, Search, Smartphone, Wrench, 
  LogOut, Wallet, Bell, ChevronRight, Zap, Users
} from "lucide-react";

export default function BusinessDashboard() {
  const router = useRouter();
  const [dealer, setDealer] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
        const storedUser = localStorage.getItem('aura_dealer_user');
        if (!storedUser) { router.push('/kurumsal/login'); return; }
        
        const dealerData = JSON.parse(storedUser);
        setDealer(dealerData);
        
        setLoading(true);
        // Bayiye ait tüm işleri çekiyoruz
        const { data: jobData, error } = await supabase
            .from('aura_jobs')
            .select('*')
            .eq('customer', dealerData.sirket_adi)
            .order('created_at', { ascending: false });
            
        if (jobData) setJobs(jobData);
        setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => { localStorage.removeItem('aura_dealer_user'); router.push('/kurumsal/login'); };

  // --- HESAPLAMA FONKSİYONLARI ---
  // 1. Toplam Hacim: İşçilik (fiyat) + Parça (parca_ucreti)
  const totalVolume = jobs.reduce((acc, job) => {
    const servicePrice = Number(job.fiyat) || 0;
    const partPrice = Number(job.parca_ucreti) || 0;
    return acc + servicePrice + partPrice;
  }, 0);

  // 2. Aktif Cihazlar: Teslim edilmemiş veya iptal edilmemişler
  const activeJobs = jobs.filter(j => !['Teslim Edildi', 'İptal'].includes(j.status));

  // --- ARAMA FONKSİYONU ---
  // Hem cihaz isminde hem de takip kodunda arama yapar
  const filteredJobs = jobs.filter(job => {
    const term = searchTerm.toLowerCase();
    const deviceName = job.device?.toLowerCase() || "";
    const trackingCode = job.tracking_code?.toLowerCase() || "";
    return deviceName.includes(term) || trackingCode.includes(term);
  });

  return (
    <div className="min-h-screen bg-aura-dark bg-cyber-grid font-sans text-slate-300 selection:bg-aura-cyan/30">
      
      {/* --- PANEL NAVBAR --- */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-aura-dark/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <BrandLogo variant="full" className="scale-90 origin-left" />
                <div className="hidden md:block h-6 w-px bg-white/10"></div>
                <h2 className="hidden md:block text-sm font-medium tracking-wide text-slate-400">
                    KURUMSAL YÖNETİM
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-white">{dealer?.sirket_adi}</div>
                    <div className="text-[10px] text-aura-cyan tracking-wider uppercase">Yetkili Servis</div>
                </div>
                
                <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors group">
                    <Bell size={20} className="text-slate-400 group-hover:text-white"/>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-aura-cyan rounded-full animate-pulse"></span>
                </button>

                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-all duration-300">
                    <LogOut size={16}/> <span className="hidden sm:inline">ÇIKIŞ</span>
                </button>
            </div>
        </div>
      </header>

      {/* --- ANA İÇERİK --- */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* İSTATİSTİK KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Kart 1 */}
            <div className="bg-aura-card border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-aura-cyan/30 transition-all">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Atölyedeki Cihaz</p>
                        <h3 className="text-3xl font-black text-white mt-1 group-hover:text-aura-cyan transition-colors">{activeJobs.length}</h3>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-aura-cyan"><Wrench size={24} /></div>
                </div>
            </div>

             {/* Kart 2 */}
             <div className="bg-aura-card border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-aura-purple/30 transition-all">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Toplam İşlem</p>
                        <h3 className="text-3xl font-black text-white mt-1 group-hover:text-aura-purple transition-colors">{jobs.length}</h3>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-aura-purple"><LayoutDashboard size={24} /></div>
                </div>
            </div>

            {/* Kart 3: DÜZELTİLMİŞ HACİM */}
            <div className="bg-aura-card border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/30 transition-all">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Toplam Hacim</p>
                        <h3 className="text-3xl font-black text-white mt-1 group-hover:text-green-400 transition-colors">₺{totalVolume.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-green-400"><Wallet size={24} /></div>
                </div>
            </div>

             {/* Kart 4: Yeni Kayıt */}
             <button onClick={() => router.push('/business/yeni-kayit')} className="bg-gradient-to-br from-aura-cyan/20 to-aura-purple/20 border border-aura-cyan/30 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group">
                <div className="p-3 bg-aura-cyan rounded-full text-black shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] transition-shadow">
                    <Zap size={24} fill="currentColor" />
                </div>
                <span className="font-bold text-white tracking-wide">HIZLI SERVİS KAYDI</span>
            </button>
        </div>

        {/* LİSTE & ARAMA */}
        <div className="bg-aura-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/[0.02]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Smartphone className="text-aura-cyan" size={20}/> Servis Hareketleri</h3>
                
                {/* AKTİF ÇALIŞAN ARAMA KUTUSU */}
                <div className="relative w-full md:w-72 group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-aura-cyan to-aura-purple rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative flex items-center bg-[#0f1115] rounded-lg border border-white/10">
                        <Search className="absolute left-3 text-slate-500" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Cihaz, model veya takip no..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-none py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/[0.02] text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4">Cihaz Bilgisi</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4">Toplam Tutar</th>
                            <th className="px-6 py-4 text-right">Detay</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                             <tr><td colSpan={4} className="p-8 text-center text-slate-500 animate-pulse">Yükleniyor...</td></tr>
                        ) : filteredJobs.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                        ) : (
                            filteredJobs.map((job) => (
                                <tr key={job.id} onClick={() => router.push(`/business/cihaz-takip/${job.id}`)} className="group hover:bg-white/[0.03] transition-colors cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-aura-cyan group-hover:bg-aura-cyan/10 transition-colors">
                                                <Smartphone size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{job.device}</div>
                                                <div className="text-xs text-slate-500 font-mono">{job.tracking_code}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                                            job.status === 'İşlemde' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            job.status === 'Teslim Edildi' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            job.status === 'Onay Bekliyor' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
                                            'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-slate-300">
                                        {/* FİYAT + PARÇA ÜCRETİ TOPLAMI */}
                                        ₺{((Number(job.fiyat)||0) + (Number(job.parca_ucreti)||0)).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-500 hover:text-aura-cyan transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}