"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase"; // Bağlantı
import { 
  Search, Filter, CheckCircle2, XCircle, Building2, Phone, Mail, Calendar, UserCheck, ShieldAlert, Eye, RefreshCw
} from "lucide-react";

export default function DealerApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Verileri Çek
  const fetchApps = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('bayi_basvurulari').select('*').order('created_at', { ascending: false });
    if (data) setApps(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Durum Güncelleme
  const handleStatusChange = async (id: number, newStatus: string) => {
    const { error } = await supabase.from('bayi_basvurulari').update({ durum: newStatus }).eq('id', id);
    if (!error) {
        setApps(apps.map(app => app.id === id ? { ...app, durum: newStatus } : app));
    } else {
        alert("Durum güncellenemedi!");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#0b0e14] text-white">
      
      {/* BAŞLIK */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="text-amber-500" size={32}/> Bayi Başvuruları
          </h1>
          <p className="text-slate-400 mt-1">Gelen kurumsal partnerlik talepleri.</p>
        </div>
        <button onClick={fetchApps} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><RefreshCw size={20}/></button>
      </div>

      {/* ARAMA */}
      <div className="mb-6 relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
         <input 
           type="text" 
           placeholder="Firma adı, yetkili veya telefon ara..." 
           className="w-full bg-[#161b22] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-amber-500 outline-none"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {/* TABLO */}
      <div className="bg-[#161b22] border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[#0d1117] border-b border-slate-700">
                    <tr>
                        <th className="p-4 text-slate-500 text-xs font-bold uppercase">Firma</th>
                        <th className="p-4 text-slate-500 text-xs font-bold uppercase">İletişim</th>
                        <th className="p-4 text-slate-500 text-xs font-bold uppercase">Tarih</th>
                        <th className="p-4 text-slate-500 text-xs font-bold uppercase">Hizmetler</th>
                        <th className="p-4 text-slate-500 text-xs font-bold uppercase">Durum</th>
                        <th className="p-4 text-slate-500 text-xs font-bold uppercase text-right">İşlem</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                    {loading ? (
                        <tr><td colSpan={6} className="p-8 text-center text-slate-500">Yükleniyor...</td></tr>
                    ) : apps.filter(app => app.sirket_adi?.toLowerCase().includes(searchTerm.toLowerCase())).map((app) => (
                        <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-white">{app.sirket_adi}</div>
                                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1"><UserCheck size={12}/> {app.yetkili_kisi}</div>
                            </td>
                            <td className="p-4 text-sm">
                                <div className="text-slate-300">{app.telefon}</div>
                                <div className="text-xs text-slate-500">{app.email}</div>
                            </td>
                            <td className="p-4 text-xs text-slate-400">
                                {new Date(app.created_at).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="p-4">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {app.sektorler?.map((s:string, i:number) => (
                                        <span key={i} className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">{s}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    app.durum === 'Onaylandı' ? 'bg-green-500/10 text-green-400' : 
                                    app.durum === 'Reddedildi' ? 'bg-red-500/10 text-red-400' : 
                                    'bg-amber-500/10 text-amber-400'
                                }`}>
                                    {app.durum}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                {app.durum === 'Bekliyor' && (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleStatusChange(app.id, 'Onaylandı')} className="p-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded transition-colors"><CheckCircle2 size={18}/></button>
                                        <button onClick={() => handleStatusChange(app.id, 'Reddedildi')} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded transition-colors"><XCircle size={18}/></button>
                                    </div>
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