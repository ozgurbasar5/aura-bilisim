"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Users, ArrowRight, CheckCircle, Clock, Trash2 } from "lucide-react";

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

  // --- SİLME FONKSİYONU ---
  const handleSil = async (id: number) => {
    if (!confirm("Bu başvuruyu kalıcı olarak silmek istediğinize emin misiniz?")) return;

    const { error } = await supabase
        .from('onarim_talepleri')
        .delete()
        .eq('id', id);

    if (error) {
        alert("Silme işlemi başarısız: " + error.message);
    } else {
        // Listeyi güncelle (silineni çıkar)
        setListe(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- KRİTİK FONKSİYON: Atölyeye Aktar ---
  const handleAtolyeyeAktar = async (basvuru: any) => {
    if(!confirm("Bu kaydı atölyeye aktarmak istiyor musunuz?")) return;

    // 1. Rastgele Servis Takip Kodu Oluştur (SRV-XXXXX)
    const yeniTakipKodu = `SRV-${Math.floor(10000 + Math.random() * 90000)}`;

    // 2. Atölye Tablosuna (aura_jobs) Ekle
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
          created_at: new Date().toISOString(),
          tracking_code: yeniTakipKodu 
        }
      ]);

    if (insertError) {
      alert("Aktarım sırasında hata oluştu: " + insertError.message);
      return;
    }

    // 3. Başvuru Durumunu Güncelle (Listeden düşmesi için)
    await supabase
      .from('onarim_talepleri')
      .update({ durum: 'islemde' })
      .eq('id', basvuru.id);

    // 4. Listeyi Yenile
    getir();
    alert(`Kayıt başarıyla atölyeye aktarıldı!\nOluşturulan Servis No: ${yeniTakipKodu}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-6 flex items-center gap-2 text-white">
        <Users className="text-orange-500" /> Online Başvuru Havuzu
      </h1>
      
      {loading ? (
        <div className="text-slate-500 animate-pulse">Yükleniyor...</div>
      ) : (
        <div className="grid gap-4">
          {liste.length === 0 && <div className="text-slate-500 border border-dashed border-slate-700 p-8 rounded-xl text-center">Yeni başvuru yok.</div>}
          
          {liste.map((item) => (
            <div key={item.id} className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-slate-500 transition-colors shadow-lg">
              <div className="flex-1">
                <div className="font-bold text-lg text-white">{item.ad_soyad}</div>
                <div className="text-slate-400 text-sm flex gap-2 items-center mt-1">
                   <Clock size={14} className="text-slate-500"/> {new Date(item.created_at).toLocaleDateString('tr-TR')}
                   <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                   <span className="text-cyan-400 font-medium">{item.marka_model}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-mono">{item.telefon}</div>
                <div className="mt-3 text-sm text-slate-300 bg-[#0f172a] p-3 rounded-xl border border-slate-700/50 max-w-2xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                    <span className="text-orange-400 font-bold text-xs uppercase tracking-wider block mb-1">Müşteri Şikayeti:</span> 
                    {item.sorun_aciklamasi}
                </div>
                {/* Teslimat Yöntemi Göstergesi */}
                <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${item.teslimat_yontemi === 'kurye' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                    {item.teslimat_yontemi === 'kurye' ? '🚛 Kurye / Kargo Talebi' : '📍 Şubeye Gelecek'}
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* SİLME BUTONU */}
                  <button 
                    onClick={() => handleSil(item.id)}
                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20 group/trash"
                    title="Başvuruyu Sil"
                  >
                    <Trash2 size={20} className="group-hover/trash:scale-110 transition-transform"/>
                  </button>

                  {/* KABUL ET BUTONU */}
                  <button 
                    onClick={() => handleAtolyeyeAktar(item)}
                    className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-orange-900/20 active:scale-95 whitespace-nowrap flex-1 md:flex-none justify-center"
                  >
                    Kabul Et & Aktar <ArrowRight size={16}/>
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}