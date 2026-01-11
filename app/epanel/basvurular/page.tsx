"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Users, ArrowRight, CheckCircle, Clock, Trash2, MapPin, Phone } from "lucide-react";

export default function OnlineBasvurular() {
  const [liste, setListe] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verileri Getir
  const getir = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('onarim_talepleri')
      .select('*')
      .eq('durum', 'beklemede') 
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
        setListe(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- ATÖLYEYE AKTAR (KRİTİK DÜZELTME: ADRES EKLENDİ) ---
  const handleAtolyeyeAktar = async (basvuru: any) => {
    if(!confirm("Bu kaydı atölyeye aktarmak istiyor musunuz?")) return;

    const yeniTakipKodu = `SRV-${Math.floor(10000 + Math.random() * 90000)}`;

    // Başvuru adresini al, yoksa boş string ata
    const adresBilgisi = basvuru.adres || ""; 
    const teslimatNotu = basvuru.teslimat_yontemi === 'kurye' ? " (Kurye Talebi)" : " (Elden Teslim)";

    const { error: insertError } = await supabase
      .from('aura_jobs')
      .insert([
        {
          customer: basvuru.ad_soyad,
          phone: basvuru.telefon,
          device: `${basvuru.marka_model} (${basvuru.cihaz_tipi})`,
          problem: basvuru.sorun_aciklamasi, 
          address: adresBilgisi, // <--- İŞTE BURASI: Adresi artık atölyeye taşıyoruz
          private_note: `Online Başvuru${teslimatNotu}`, // Teknisyen notuna teslimat bilgisini ekledik
          status: 'Bekliyor', 
          price: 0,
          created_at: new Date().toISOString(),
          tracking_code: yeniTakipKodu 
        }
      ]);

    if (insertError) {
      alert("Aktarım sırasında hata oluştu: " + insertError.message);
      return;
    }

    // Başvuru durumunu güncelle
    await supabase
      .from('onarim_talepleri')
      .update({ durum: 'islemde' })
      .eq('id', basvuru.id);

    getir();
    alert(`Kayıt başarıyla atölyeye aktarıldı!\nAdres: ${adresBilgisi ? "Eklendi ✅" : "Yok ❌"}\nServis No: ${yeniTakipKodu}`);
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
            <div key={item.id} className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-slate-500 transition-colors shadow-lg">
              
              {/* SOL TARA: Bilgiler */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                    <div className="font-bold text-lg text-white">{item.ad_soyad}</div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${item.teslimat_yontemi === 'kurye' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                        {item.teslimat_yontemi === 'kurye' ? 'Kurye' : 'Şube'}
                    </span>
                </div>

                <div className="text-slate-400 text-sm flex flex-wrap gap-x-4 gap-y-1 items-center">
                   <span className="flex items-center gap-1"><Clock size={12}/> {new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
                   <span className="flex items-center gap-1 text-cyan-400 font-medium"><CheckCircle size={12}/> {item.marka_model}</span>
                   <span className="flex items-center gap-1 font-mono text-slate-500"><Phone size={12}/> {item.telefon}</span>
                </div>

                {/* ADRES ALANI (LİSTEDE GÖSTERİM) */}
                {item.adres && (
                    <div className="flex items-start gap-1.5 text-xs text-slate-300 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                        <MapPin size={14} className="text-red-400 shrink-0 mt-0.5"/> 
                        <span>{item.adres}</span>
                    </div>
                )}

                <div className="mt-2 text-sm text-slate-300 bg-[#0f172a] p-3 rounded-xl border border-slate-700/50 max-w-2xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                    <span className="text-orange-400 font-bold text-xs uppercase tracking-wider block mb-1">Şikayet:</span> 
                    {item.sorun_aciklamasi}
                </div>
              </div>
              
              {/* SAĞ TARAF: Butonlar */}
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <button 
                    onClick={() => handleSil(item.id)}
                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20 group/trash"
                    title="Başvuruyu Sil"
                  >
                    <Trash2 size={20} className="group-hover/trash:scale-110 transition-transform"/>
                  </button>

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