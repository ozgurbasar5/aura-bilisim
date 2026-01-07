"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { 
  Briefcase, Search, Smartphone, Wrench, CheckCircle2, 
  Clock, LogOut, Wallet, ChevronRight, AlertTriangle, ShoppingBag, ArrowRight
} from "lucide-react";

export default function BusinessDashboard() {
  const router = useRouter();
  const [dealer, setDealer] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]); // Fırsat Ürünleri
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
        const storedUser = localStorage.getItem('aura_dealer_user');
        if (!storedUser) { router.push('/kurumsal/login'); return; }
        const dealerData = JSON.parse(storedUser);
        setDealer(dealerData);
        fetchData(dealerData.sirket_adi);
    };
    checkAuth();
  }, []);

  const fetchData = async (companyName: string) => {
      setLoading(true);
      // 1. Cihazları Çek
      const { data: jobData } = await supabase.from('aura_jobs').select('*').eq('customer', companyName).order('created_at', { ascending: false });
      if (jobData) setJobs(jobData);

      // 2. Fırsat Ürünlerini Çek (Limitli Vitrin)
      const { data: prodData } = await supabase.from('firsat_urunleri').select('*').eq('durum', 'Aktif').limit(3);
      if (prodData) setProducts(prodData);
      
      setLoading(false);
  };

  const handleLogout = () => { localStorage.removeItem('aura_dealer_user'); router.push('/kurumsal/login'); };

  // Metrikler
  const pendingApprovals = jobs.filter(j => j.status === 'Onay Bekliyor'); // Kritik Onaylar
  const activeJobs = jobs.filter(j => ['İşlemde', 'Parça Bekleniyor', 'Test Aşamasında', 'Bekliyor'].includes(j.status));
  const totalBalance = jobs.reduce((sum, job) => sum + (Number(job.fiyat)||0) + (Number(job.parca_ucreti)||0), 0);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans p-4 md:p-8 pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
           <h1 className="text-2xl font-black flex items-center gap-2 text-white"><Briefcase className="text-amber-500"/> {dealer?.sirket_adi}</h1>
           <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">Kurumsal Servis Paneli</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-[#161b22] hover:bg-red-500/10 hover:text-red-500 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 transition-colors flex items-center gap-2"><LogOut size={14}/> Çıkış</button>
      </div>

      {/* ⚠️ KRİTİK BİLDİRİMLER (FİYAT ONAYI) */}
      {pendingApprovals.length > 0 && (
          <div className="mb-8 animate-in slide-in-from-top-4">
              <div className="bg-gradient-to-r from-red-500/10 to-red-900/5 border border-red-500/30 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={80}/></div>
                  <h3 className="text-red-400 font-bold flex items-center gap-2 mb-3"><AlertTriangle size={20}/> Onay Bekleyen İşlemler ({pendingApprovals.length})</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                      {pendingApprovals.map(job => (
                          <div key={job.id} onClick={() => router.push(`/business/cihaz-takip/${job.id}`)} className="bg-[#0b0e14] border border-red-500/30 p-4 rounded-xl min-w-[280px] cursor-pointer hover:border-red-400 transition-colors group">
                              <div className="flex justify-between items-start mb-2">
                                  <span className="text-white font-bold text-sm">{job.device}</span>
                                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold">ONAYLA</span>
                              </div>
                              <div className="text-xs text-slate-400 mb-2">{job.problem.substring(0, 40)}...</div>
                              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                                  <span className="text-xs text-slate-500 font-mono">{job.tracking_code}</span>
                                  <span className="text-white font-bold">₺{((Number(job.fiyat)||0) + (Number(job.parca_ucreti)||0)).toLocaleString()}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* METRİKLER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#161b22] p-5 rounded-2xl border border-slate-800"><div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Toplam İşlem</div><div className="text-3xl font-black text-white">{jobs.length}</div></div>
          <div className="bg-[#161b22] p-5 rounded-2xl border border-amber-500/20"><div className="text-amber-500 text-[10px] font-bold uppercase mb-1">Atölyedeki</div><div className="text-3xl font-black text-amber-500">{activeJobs.length}</div></div>
          <div className="bg-[#161b22] p-5 rounded-2xl border border-green-500/20"><div className="text-green-500 text-[10px] font-bold uppercase mb-1">Teslim Edilen</div><div className="text-3xl font-black text-green-500">{jobs.filter(j => j.status === 'Teslim Edildi').length}</div></div>
          <div className="bg-[#161b22] p-5 rounded-2xl border border-indigo-500/20"><div className="text-indigo-400 text-[10px] font-bold uppercase mb-1">Toplam Hacim</div><div className="text-3xl font-black text-indigo-400">₺{totalBalance.toLocaleString()}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL: SERVİS LİSTESİ */}
          <div className="lg:col-span-2">
              <div className="bg-[#161b22] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Wrench size={18} className="text-slate-400"/> Servis Hareketleri</h2>
                      <div className="relative w-48"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14}/><input type="text" placeholder="Ara..." className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-amber-500" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/></div>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <tbody className="divide-y divide-slate-800/50">
                              {loading ? <tr><td className="p-6 text-center text-slate-500 text-sm">Yükleniyor...</td></tr> : 
                               jobs.filter(j => j.device.toLowerCase().includes(searchTerm.toLowerCase())).map(job => (
                                  <tr key={job.id} onClick={() => router.push(`/business/cihaz-takip/${job.id}`)} className="hover:bg-white/[0.02] cursor-pointer group transition-colors">
                                      <td className="p-5">
                                          <div className="font-bold text-white text-sm group-hover:text-amber-500 transition-colors">{job.device}</div>
                                          <div className="text-[10px] text-slate-500 mt-1">{job.tracking_code} • {new Date(job.created_at).toLocaleDateString('tr-TR')}</div>
                                      </td>
                                      <td className="p-5"><span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${job.status === 'Onay Bekliyor' ? 'bg-red-500 text-white animate-pulse' : job.status === 'Teslim Edildi' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-400'}`}>{job.status}</span></td>
                                      <td className="p-5 text-right font-bold text-white text-sm">₺{((Number(job.fiyat)||0) + (Number(job.parca_ucreti)||0)).toLocaleString()}</td>
                                      <td className="p-5 text-right"><ChevronRight size={16} className="text-slate-600"/></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>

          {/* SAĞ: FIRSAT ÜRÜNLERİ VİTRİNİ */}
          <div>
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingBag size={18} className="text-purple-400"/> Bayi Fırsatları</h2>
                  <button onClick={() => router.push('/business/firsatlar')} className="text-xs text-purple-400 hover:text-white flex items-center gap-1 font-bold">Tümünü Gör <ArrowRight size={12}/></button>
              </div>
              <div className="space-y-4">
                  {products.map(product => (
                      <div key={product.id} className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 flex gap-4 hover:border-purple-500/40 transition-all cursor-pointer group">
                          <div className="w-16 h-16 bg-slate-800 rounded-xl overflow-hidden shrink-0">
                             {product.resim_url ? <img src={product.resim_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" /> : <div className="w-full h-full flex items-center justify-center text-slate-600"><ShoppingBag size={20}/></div>}
                          </div>
                          <div>
                              <h4 className="text-white font-bold text-sm leading-tight mb-1">{product.urun_adi}</h4>
                              <div className="flex items-center gap-2">
                                  <span className="text-purple-400 font-black text-lg">₺{product.indirimli_fiyat}</span>
                                  <span className="text-slate-600 text-xs line-through">₺{product.normal_fiyat}</span>
                              </div>
                          </div>
                      </div>
                  ))}
                  {products.length === 0 && <div className="text-center py-10 text-slate-500 bg-[#161b22] rounded-2xl border border-dashed border-slate-800 text-sm">Aktif fırsat bulunmuyor.</div>}
              </div>
          </div>

      </div>
    </div>
  );
}