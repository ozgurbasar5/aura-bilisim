"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

export default function OnlineBasvurular() {
  const [liste, setListe] = useState<any[]>([]);

  useEffect(() => {
    const getir = async () => {
      const { data } = await supabase
        .from('onarim_talepleri')
        .select('*')
        .eq('durum', 'beklemede') // Sadece başvurular
        .order('created_at', { ascending: false });
      if (data) setListe(data);
    };
    getir();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-black mb-6 flex items-center gap-2">
        <Users className="text-orange-500" /> Online Başvuru Havuzu
      </h1>
      <div className="grid gap-4">
        {liste.map((item) => (
          <div key={item.id} className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700 flex justify-between items-center">
            <div>
              <div className="font-bold text-lg text-white">{item.ad_soyad}</div>
              <div className="text-slate-400 text-sm">{item.marka_model} - {item.cihaz_tipi}</div>
            </div>
            <Link href={`/epanel/detay/${item.id}`} className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
              İncele & Teslim Al <ArrowRight size={16}/>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}