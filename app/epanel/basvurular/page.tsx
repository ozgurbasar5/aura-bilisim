"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import { 
  Wrench, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Package,
  History,
  LayoutDashboard
} from "lucide-react";

export default function ServisListesi() {
  const [liste, setListe] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [arama, setArama] = useState("");

  useEffect(() => {
    const getir = async () => {
      const { data, error } = await supabase
        .from('onarim_talepleri')
        .select('*')
        .neq('durum', 'beklemede') // ⚠️ KRİTİK: Sadece teslim alınanlar
        .order('created_at', { ascending: false });

      if (!error) setListe(data);
      setLoading(false);
    };
    getir();
  }, []);

  // Arama filtresi (Müşteri adı veya IMEI'ye göre)
  const filtrelenmişListe = liste.filter(item => 
    item.ad_soyad.toLowerCase().includes(arama.toLowerCase()) || 
    (item.imei_no && item.imei_no.includes(arama))
  );

  // İstatistik hesaplama
  const istatistik = {
    toplam: liste.length,
    islemde: liste.filter(i => i.durum === 'onarim_isleminde').length,
    teklif: liste.filter(i => i.durum === 'teklif_bekliyor').length,
    hazir: liste.filter(i => i.durum === 'tamamlandi').length
  };

  if (loading) return <div className="p-10 text-cyan-400 font-bold animate-pulse">Atölye verileri yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      
      {/* ÜST BAR VE İSTATİSTİKLER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 shadow-xl">
          <div className="text-slate-500 text-[10px] font-black uppercase mb-1">Dükkandaki Cihaz</div>
          <div className="text-2xl font-black text-white">{istatistik.toplam}</div>
        </div>
        <div className="bg-[#1E293B] p-4 rounded-2xl border border-cyan-500/20 shadow-xl">
          <div className="text-cyan-500 text-[10px] font-black uppercase mb-1">Onarımda</div>
          <div className="text-2xl font-black text-white">{istatistik.islemde}</div>
        </div>
        <div className="bg-[#1E293B] p-4 rounded-2xl border border-yellow-500/20 shadow-xl">
          <div className="text-yellow-500 text-[10px] font-black uppercase mb-1">Teklif Bekleyen</div>
          <div className="text-2xl font-black text-white">{istatistik.teklif}</div>
        </div>
        <div className="bg-[#1E293B] p-4 rounded-2xl border border-green-500/20 shadow-xl">
          <div className="text-green-500 text-[10px] font-black uppercase mb-1">Hazır / Teslim</div>
          <div className="text-2xl font-black text-white">{istatistik.hazir}</div>
        </div>
      </div>

      {/* ARAMA VE BAŞLIK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <LayoutDashboard className="text-cyan-400" size={32} /> Atölye Listesi
        </h1>
        
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Müşteri adı veya IMEI ile ara..." 
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="w-full bg-[#1E293B] border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all shadow-inner font-medium"
          />
        </div>
      </div>

      {/* LİSTE ALANI */}
      <div className="grid gap-4">
        {filtrelenmişListe.length > 0 ? (
          filtrelenmişListe.map((item) => (
            <Link 
              href={`/epanel/detay/${item.id}`} 
              key={item.id}
              className="group bg-[#1E293B] hover:bg-[#243147] border border-slate-700 hover:border-cyan-500/50 p-5 rounded-2xl transition-all duration-300 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
            >
              {/* Sol Taraf: Cihaz ve Müşteri */}
              <div className="flex items-start gap-4 z-10">
                <div className={`p-3 rounded-xl ${
                  item.durum === 'tamamlandi' ? 'bg-green-500/10 text-green-500' : 
                  item.durum === 'teklif_bekliyor' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-cyan-500/10 text-cyan-400'
                }`}>
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">{item.ad_soyad}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Wrench size={14}/> {item.marka_model}</span>
                    <span className="flex items-center gap-1 font-mono text-[12px]"><History size={14}/> {item.imei_no || 'IMEI Kaydı Yok'}</span>
                  </div>
                </div>
              </div>

              {/* Sağ Taraf: Durum ve Buton */}
              <div className="flex items-center justify-between md:justify-end gap-6 z-10">
                <div className="text-right">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                    item.durum === 'tamamlandi' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    item.durum === 'teklif_bekliyor' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                    'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                  }`}>
                    {item.durum.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 font-bold">Kayıt: {new Date(item.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
                <ChevronRight className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" size={24} />
              </div>

              {/* Arka Plan Dekor (Sadece Tasarım İçin) */}
              <div className="absolute right-0 top-0 h-full w-1 bg-cyan-500 opacity-0 group-hover:opacity-100 transition-all"></div>
            </Link>
          ))
        ) : (
          <div className="bg-[#1E293B] border border-dashed border-slate-700 p-20 rounded-3xl text-center">
            <AlertCircle className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-400 font-bold">Atölyede şu an cihaz bulunmuyor usta.</p>
            <Link href="/epanel/basvurular" className="text-cyan-400 text-sm hover:underline mt-2 inline-block">Online Başvurulara Göz At →</Link>
          </div>
        )}
      </div>
    </div>
  );
}