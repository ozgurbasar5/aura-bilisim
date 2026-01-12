"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Users, ArrowRight, CheckCircle, Clock, Trash2, MapPin, Phone, Bike, PackageCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnlineBasvurular() {
  const router = useRouter();
  const [liste, setListe] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verileri Getir
  const getir = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('onarim_talepleri')
      .select('*')
      .in('durum', ['beklemede', 'kurye_bekliyor', 'kurye_yonlendirildi', 'teslim_alindi']) 
      .order('created_at', { ascending: false });
    
    if (data) setListe(data);
    setLoading(false);
  };

  useEffect(() => { getir(); }, []);

  // --- SİLME ---
  const handleSil = async (id: number) => {
    if (!confirm("Bu başvuruyu silmek istiyor musunuz?")) return;
    const { error } = await supabase.from('onarim_talepleri').delete().eq('id', id);
    if (!error) setListe(prev => prev.filter(item => item.id !== id));
  };

  // --- 1. ADIM: KURYE YÖNETİMİNE AKTAR ---
  const handleKuryeyeAktar = async (basvuru: any) => {
      if(!confirm("Bu talep Kurye Yönetimine aktarılacak ve 'Kurye Bekliyor' durumuna geçecek.")) return;

      // Kurye tablosuna ekle
      const { error } = await supabase.from('aura_courier').insert([{
          name: basvuru.ad_soyad,
          phone: basvuru.telefon,
          address: basvuru.adres,
          device: `${basvuru.marka_model} (${basvuru.cihaz_tipi})`,
          note: basvuru.sorun_aciklamasi,
          status: 'Bekliyor',
          basvuru_id: basvuru.id
      }]);

      if (error) { alert("Hata: " + error.message); return; }

      // Durumu güncelle
      await supabase.from('onarim_talepleri').update({ durum: 'kurye_bekliyor' }).eq('id', basvuru.id);
      getir(); // Listeyi yenile
      router.push('/epanel/kurye-yonetim');
  };

  // --- 2. ADIM: ARA DURUMLARI GÜNCELLE (Yönlendirildi / Teslim Alındı) ---
  const updateKuryeStatus = async (id: number, status: string) => {
      // Sadece durumu güncelle ve listeyi yenile
      await supabase.from('onarim_talepleri').update({ durum: status }).eq('id', id);
      getir(); 
  };

  // --- 3. ADIM: ATÖLYEYE AKTAR (Cihaz fiziksel olarak elindeyse) ---
  const handleAtolyeyeAktar = async (basvuru: any) => {
    const imei = prompt("Cihazın Seri No / IMEI numarasını giriniz:");
    if (!imei) return;

    const yeniTakipKodu = `SRV-${Math.floor(10000 + Math.random() * 90000)}`;
    const teslimatNotu = basvuru.teslimat_yontemi === 'kurye' ? " (Kurye İle Geldi)" : " (Elden Teslim)";

    // İş kaydı oluştur
    const { error } = await supabase.from('aura_jobs').insert([{
        customer: basvuru.ad_soyad,
        phone: basvuru.telefon,
        device: `${basvuru.marka_model} (${basvuru.cihaz_tipi})`,
        problem: basvuru.sorun_aciklamasi, 
        address: basvuru.adres || "",
        serial_no: imei,
        private_note: `Online Başvuru${teslimatNotu}`,
        status: 'Bekliyor', 
        price: 0,
        created_at: new Date().toISOString(),
        tracking_code: yeniTakipKodu 
    }]);

    if (error) { alert("Hata: " + error.message); return; }

    // Başvuruyu listeden kaldır (Tamamlandı)
    await supabase.from('onarim_talepleri').update({ durum: 'tamamlandi' }).eq('id', basvuru.id);
    
    // Kurye kaydını da kapat
    await supabase.from('aura_courier').update({ status: 'Tamamlandı' }).eq('basvuru_id', basvuru.id);

    alert(`Cihaz atölyeye alındı!\nTakip No: ${yeniTakipKodu}`);
    router.push(`/epanel/atolye`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-6 flex items-center gap-2 text-white">
        <Users className="text-orange-500" /> Online Başvuru & Kurye Havuzu
      </h1>
      
      {loading ? <div className="text-slate-500 animate-pulse">Yükleniyor...</div> : (
        <div className="grid gap-4">
          {liste.length === 0 && <div className="text-slate-500 border border-dashed border-slate-700 p-8 rounded-xl text-center">İşlem bekleyen başvuru yok.</div>}
          
          {liste.map((item) => (
            <div key={item.id} className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group transition-all shadow-lg ${item.durum === 'teslim_alindi' ? 'bg-green-900/10 border-green-500/30' : 'bg-[#1E293B] border-slate-700 hover:border-slate-500'}`}>
              
              {/* SOL TARAF: Bilgiler */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                    <div className="font-bold text-lg text-white">{item.ad_soyad}</div>
                    
                    {/* DURUM ROZETLERİ */}
                    {item.teslimat_yontemi === 'kurye' ? (
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                                <Bike size={10}/> Kurye
                            </span>
                            {item.durum === 'beklemede' && <span className="text-[10px] text-yellow-500 font-bold animate-pulse">● Onay Bekliyor</span>}
                            {item.durum === 'kurye_bekliyor' && <span className="text-[10px] text-orange-500 font-bold">● Kurye Aranıyor</span>}
                            {item.durum === 'kurye_yonlendirildi' && <span className="text-[10px] text-blue-500 font-bold">● Kurye Yolda</span>}
                            {item.durum === 'teslim_alindi' && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500 text-black flex items-center gap-1"><CheckCircle size={10}/> TESLİM ALINDI</span>}
                        </div>
                    ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500/10 text-green-400 border border-green-500/20">Şube Teslim</span>
                    )}
                </div>

                <div className="text-slate-400 text-sm flex flex-wrap gap-x-4 gap-y-1 items-center">
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
                    <span className="flex items-center gap-1 text-cyan-400 font-medium"><PackageCheck size={12}/> {item.marka_model}</span>
                    <a href={`tel:${item.telefon}`} className="flex items-center gap-1 font-mono text-slate-500 hover:text-white"><Phone size={12}/> {item.telefon}</a>
                </div>

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

                {/* SADECE KURYE SÜRECİNDEYSE VE HENÜZ TESLİM ALINMADIYSA GÖRÜNEN KÜÇÜK BUTONLAR */}
                {item.teslimat_yontemi === 'kurye' && item.durum !== 'beklemede' && item.durum !== 'teslim_alindi' && (
                    <div className="flex gap-2 mt-3 p-2 bg-black/20 rounded-lg border border-white/5 w-fit">
                        <span className="text-[10px] text-slate-500 font-bold self-center mr-1">DURUM:</span>
                        <button onClick={() => updateKuryeStatus(item.id, 'kurye_yonlendirildi')} className={`px-2 py-1 text-[10px] border rounded transition-all ${item.durum === 'kurye_yonlendirildi' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-blue-400 border-blue-500/30 hover:bg-blue-900/30'}`}>Yönlendirildi</button>
                        <button onClick={() => updateKuryeStatus(item.id, 'teslim_alindi')} className="px-2 py-1 text-[10px] bg-green-900/20 text-green-400 border border-green-500/30 rounded hover:bg-green-600 hover:text-white transition-all">Cihaz Geldi (Teslim Al)</button>
                    </div>
                )}
              </div>
              
              {/* SAĞ TARAF: Ana Aksiyon Butonları */}
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 flex-col md:flex-row">
                  <button onClick={() => handleSil(item.id)} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20 group/trash" title="Başvuruyu Sil"><Trash2 size={20} className="group-hover/trash:scale-110 transition-transform"/></button>

                  {/* 1. EĞER KURYE İSE VE HALA ONAY BEKLİYORSA -> KURYE YÖNETİMİNE AKTAR */}
                  {item.teslimat_yontemi === 'kurye' && item.durum === 'beklemede' && (
                      <button onClick={() => handleKuryeyeAktar(item)} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-blue-900/20 active:scale-95 w-full md:w-auto justify-center">
                        <Bike size={18}/> Kuryeye Aktar
                      </button>
                  )}

                  {/* 2. EĞER CİHAZ TESLİM ALINDI İSE (VEYA ELDEN GELDİYSE) -> ATÖLYEYE GİRİŞ YAP */}
                  {(item.durum === 'teslim_alindi' || item.teslimat_yontemi !== 'kurye') && (
                      <button onClick={() => handleAtolyeyeAktar(item)} className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-green-900/20 active:scale-95 w-full md:w-auto justify-center animate-in zoom-in duration-300">
                        <PackageCheck size={18}/> {item.teslimat_yontemi === 'kurye' ? 'Atölyeye Giriş Yap' : 'Kabul Et & Aktar'}
                      </button>
                  )}

                  {/* 3. EĞER KURYE SÜRECİNDEYSE (BEKLİYOR/YÖNLENDİRİLDİ) -> BİLGİ BUTONU */}
                  {item.teslimat_yontemi === 'kurye' && item.durum !== 'beklemede' && item.durum !== 'teslim_alindi' && (
                      <div className="px-6 py-3 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold border border-slate-700 flex items-center gap-2 cursor-wait">
                          <Truck size={14} className="animate-bounce"/> Kurye Sürecinde...
                      </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}