"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { Bike, MapPin, Phone, CheckSquare, Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KuryeYonetimPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    const { data } = await supabase.from('aura_courier').select('*').order('created_at', { ascending: false });
    if (data) setRequests(data);
  };

  const updateStatus = async (id: number, status: string) => {
      await supabase.from('aura_courier').update({ status }).eq('id', id);
      fetchRequests();
  };

  const handleDelete = async (id: number) => {
      if(!confirm("Silinsin mi?")) return;
      await supabase.from('aura_courier').delete().eq('id', id);
      fetchRequests();
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-8 font-sans">
        <div className="flex items-center gap-4 mb-8">
             <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"><ArrowLeft/></button>
             <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Bike className="text-orange-500" /> KURYE TALEPLERİ
             </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length === 0 ? <div className="col-span-full text-center text-slate-500 py-10">Henüz talep yok.</div> : requests.map((req) => (
                <div key={req.id} className={`bg-[#151921] border p-5 rounded-2xl relative group transition-all ${req.status === 'Tamamlandı' ? 'border-green-900/50 opacity-60' : 'border-slate-800 hover:border-orange-500/50'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="font-bold text-white text-lg">{req.name}</div>
                            <div className="text-xs text-slate-500">{new Date(req.created_at).toLocaleString('tr-TR')}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${req.status === 'Bekliyor' ? 'bg-yellow-500/20 text-yellow-500 animate-pulse' : 'bg-green-500/20 text-green-500'}`}>{req.status}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                        <a href={`tel:${req.phone}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><Phone size={14} className="text-cyan-500"/> {req.phone}</a>
                        <div className="flex items-start gap-2 text-sm text-slate-300"><MapPin size={14} className="text-red-500 mt-1 shrink-0"/> {req.address}</div>
                        <div className="bg-black/20 p-2 rounded text-xs text-slate-400 border border-slate-800">Cihaz: <span className="text-white font-bold">{req.device}</span></div>
                    </div>

                    <div className="flex gap-2">
                         {req.status !== 'Tamamlandı' && (
                             <button onClick={() => updateStatus(req.id, 'Tamamlandı')} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow-lg"><CheckSquare size={14}/> ALINDI/TAMAMLA</button>
                         )}
                         <button onClick={() => handleDelete(req.id)} className="px-3 bg-red-900/20 hover:bg-red-900/50 text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}