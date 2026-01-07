"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase"; 
import { 
  Search, Building2, UserCheck, RefreshCw, CheckCircle2, XCircle, Clock
} from "lucide-react";

export default function DealerApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Başvuruları Çek
  const fetchApps = async () => {
    setLoading(true);
    // Sadece henüz işlem yapılmamış (Bekleyen) veya reddedilenleri görelim. 
    // Onaylananlar artık "Bayiler" sayfasının konusudur ama geçmişi görmek için hepsini çekebiliriz.
    const { data, error } = await supabase
      .from('bayi_basvurulari')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setApps(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Durum Güncelleme (Onaylama / Reddetme)
  const handleStatusChange = async (id: number, newStatus: string) => {
    // Optimistik güncelleme (arayüzde hemen göster)
    setApps(apps.map(app => app.id === id ? { ...app, durum: newStatus } : app));

    const { error } = await supabase
      .from('bayi_basvurulari')
      .update({ 
        durum: newStatus,
        updated_at: new Date().toISOString() // Güncelleme tarihi
      })
      .eq('id', id);

    if (error) {
        alert("Durum güncellenemedi!");
        fetchApps(); // Hata varsa geri al
    }
  };

  // Filtreleme: Arama metni ve duruma göre
  const filteredApps = apps.filter(app => 
    (app.sirket_adi?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     app.yetkili_kisi?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 min-h-screen bg-[#0b0e14] text-white font-sans">
      
      {/* BAŞLIK */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-white">
            <Building2 className="text-amber-500" size={32}/> Bayi Başvuruları
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Web sitesinden gelen partnerlik taleplerini yönetin.</p>
        </div>
        <button onClick={fetchApps} className="p-3 bg-[#161b22] border border-slate-700 rounded-xl hover:border-amber-500 text-slate-400 hover:text-white transition-all">
            <RefreshCw size={20}/>
        </button>
      </div>

      {/* ARAMA */}
      <div className="mb-6 relative max-w-lg">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
         <input 
           type="text" 
           placeholder="Firma adı, yetkili veya telefon ara..." 
           className="w-full bg-[#161b22] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all shadow-lg placeholder:text-slate-600"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {/* LİSTE */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#0d1117] border-b border-slate-800">
                    <tr>
                        <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-wider">Firma Bilgisi</th>
                        <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-wider">İletişim</th>
                        <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-wider">Tarih</th>
                        <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-wider">İlgilendiği Alanlar</th>
                        <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-wider">Durum</th>
                        <th className="p-5 text-slate-500 text-xs font-bold uppercase tracking-wider text-right">Aksiyon</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr><td colSpan={6} className="p-10 text-center text-slate-500 animate-pulse">Veriler yükleniyor...</td></tr>
                    ) : filteredApps.length === 0 ? (
                        <tr><td colSpan={6} className="p-10 text-center text-slate-500">Başvuru bulunamadı.</td></tr>
                    ) : filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-5">
                                <div className="font-bold text-white text-base group-hover:text-amber-500 transition-colors">{app.sirket_adi}</div>
                                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                                    <UserCheck size={14} className="text-slate-500"/> {app.yetkili_kisi}
                                </div>
                            </td>
                            <td className="p-5">
                                <div className="text-slate-300 font-medium">{app.telefon}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{app.email}</div>
                            </td>
                            <td className="p-5 text-sm text-slate-400 font-medium">
                                {new Date(app.created_at).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="p-5">
                                <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                                    {app.sektorler && Array.isArray(app.sektorler) ? app.sektorler.map((s:string, i:number) => (
                                        <span key={i} className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700/50">{s}</span>
                                    )) : <span className="text-slate-600 text-xs">-</span>}
                                </div>
                            </td>
                            <td className="p-5">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                    app.durum === 'Onaylandı' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                                    app.durum === 'Reddedildi' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                                    'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                }`}>
                                    {app.durum === 'Onaylandı' && <CheckCircle2 size={12}/>}
                                    {app.durum === 'Reddedildi' && <XCircle size={12}/>}
                                    {app.durum === 'Bekliyor' && <Clock size={12}/>}
                                    {app.durum}
                                </div>
                            </td>
                            <td className="p-5 text-right">
                                {app.durum === 'Bekliyor' ? (
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleStatusChange(app.id, 'Onaylandı')} 
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-green-900/20"
                                            title="Onayla ve Bayi Yap"
                                        >
                                            <CheckCircle2 size={14}/> ONAYLA
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(app.id, 'Reddedildi')} 
                                            className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                                            title="Reddet"
                                        >
                                            <XCircle size={16}/>
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-600 font-medium italic">İşlem yapıldı</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}