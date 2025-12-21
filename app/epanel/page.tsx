"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase"; // Adres
import { Clock, Smartphone, Laptop, Zap, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link"; // Link özelliğini ekledik

export default function PanelHome() {
  const [talepler, setTalepler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const veriCek = async () => {
      // Verileri tarihe göre çek
      const { data } = await supabase
        .from('onarim_talepleri')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setTalepler(data);
      setLoading(false);
    };
    veriCek();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2 font-bold">Yükleniyor...</span>
    </div>
  );

  return (
    <div>
      <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
        <Clock className="text-cyan-400" /> Bekleyen Onarım Talepleri
      </h2>

      <div className="grid gap-4">
        {talepler.map((talep) => (
          <div key={talep.id} className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-between group">
            
            {/* Sol Kısım */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${talep.cihaz_tipi === 'telefon' ? 'bg-blue-500/20 text-blue-400' : talep.cihaz_tipi === 'robot' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                {talep.cihaz_tipi === 'telefon' ? <Smartphone size={20}/> : talep.cihaz_tipi === 'robot' ? <Zap size={20}/> : <Laptop size={20}/>}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{talep.ad_soyad}</h3>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                    {talep.marka_model} • <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${talep.durum === 'tamamlandi' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {talep.durum || 'BEKLEMEDE'}
                    </span>
                </p>
              </div>
            </div>

            {/* Sağ Kısım: Detay Butonu (ARTIK ÇALIŞIYOR) */}
            <div className="text-right flex flex-col items-end gap-2">
                <p className="text-slate-500 text-xs">{new Date(talep.created_at).toLocaleDateString('tr-TR')}</p>
                
                {/* İŞTE SİHİRLİ DOKUNUŞ BURADA: LINK */}
                <Link href={`/epanel/detay/${talep.id}`} className="bg-cyan-600/20 text-cyan-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-600 hover:text-white transition-all flex items-center gap-2">
                    Detay Gör <ArrowRight size={16} />
                </Link>
            </div>

          </div>
        ))}

        {talepler.length === 0 && (
            <div className="text-center p-10 text-slate-500 bg-[#1E293B] rounded-2xl border border-dashed border-slate-700">
                Henüz hiç talep yok usta. Dükkan sakin. ☕
            </div>
        )}
      </div>
    </div>
  );
}