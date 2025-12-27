"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Users, ArrowRight, CheckCircle, Clock } from "lucide-react";

export default function OnlineBasvurular() {
  const [liste, setListe] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verileri Getir
  const getir = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('onarim_talepleri')
      .select('*')
      .eq('durum', 'beklemede') // Sadece bekleyenler
      .order('created_at', { ascending: false });
    
    if (data) setListe(data);
    setLoading(false);
  };

  useEffect(() => {
    getir();
  }, []);

  // --- KRİTİK FONKSİYON: Atölyeye Aktar ---
  const handleAtolyeyeAktar = async (basvuru: any) => {
    if(!confirm("Bu kaydı atölyeye aktarmak istiyor musunuz?")) return;

    // 1. Atölye Tablosuna (aura_jobs) Ekle
    const { error: insertError } = await supabase
      .from('aura_jobs')
      .insert([
        {
          customer: basvuru.ad_soyad,
          phone: basvuru.telefon,
          device: `${basvuru.marka_model} (${basvuru.cihaz_tipi})`,
          problem: basvuru.sorun_aciklamasi, // Sorun açıklaması
          status: 'Bekliyor', // Başlangıç durumu
          price: 0,
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) {
      alert("Aktarım sırasında hata oluştu: " + insertError.message);
      return;
    }

    // 2. Başvuru Durumunu Güncelle (Listeden düşmesi için)
    await supabase
      .from('onarim_talepleri')
      .update({ durum: 'islemde' })
      .eq('id', basvuru.id);

    // 3. Listeyi Yenile
    getir();
    alert("Kayıt başarıyla atölyeye aktarıldı!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-6 flex items-center gap-2 text-white">
        <Users className="text-orange-500" /> Online Başvuru Havuzu
      </h1>
      
      {loading ? (
        <div className="text-slate-500">Yükleniyor...</div>
      ) : (
        <div className="grid gap-4">
          {liste.length === 0 && <div className="text-slate-500">Yeni başvuru yok.</div>}
          
          {liste.map((item) => (
            <div key={item.id} className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="font-bold text-lg text-white">{item.ad_soyad}</div>
                <div className="text-slate-400 text-sm flex gap-2 items-center">
                   <Clock size={14} /> {new Date(item.created_at).toLocaleDateString('tr-TR')}
                   <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                   {item.marka_model}
                </div>
                <div className="text-xs text-slate-500 mt-1">{item.telefon}</div>
                <div className="mt-2 text-sm text-slate-300 bg-slate-800 p-2 rounded-lg border border-slate-700 max-w-xl">
                    <span className="text-orange-400 font-bold text-xs">SORUN:</span> {item.sorun_aciklamasi}
                </div>
              </div>
              
              <button 
                onClick={() => handleAtolyeyeAktar(item)}
                className="bg-orange-600 hover:bg-orange-500 px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-orange-900/20"
              >
                Kabul Et & Atölye'ye Aktar <ArrowRight size={16}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}