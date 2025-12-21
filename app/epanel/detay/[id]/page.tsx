"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase"; 
import { useParams, useRouter } from "next/navigation"; // useParams eklendi
import { ArrowLeft, User, Phone, MapPin, Smartphone, Save, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function TalepDetay() {
  // YENİ YÖNTEM: ID'yi buradan alıyoruz (Garanti Yöntem)
  const params = useParams();
  const id = params.id;

  const [talep, setTalep] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [yeniDurum, setYeniDurum] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getir = async () => {
      if (!id) return; // ID yoksa işlem yapma

      const { data, error } = await supabase
        .from('onarim_talepleri')
        .select('*')
        .eq('id', id)
        .single(); 

      if (data) {
        setTalep(data);
        setYeniDurum(data.durum || "beklemede");
      } else {
        console.error("Veri gelmedi:", error);
      }
      setLoading(false);
    };
    getir();
  }, [id]);

  const durumuGuncelle = async () => {
    const { error } = await supabase
      .from('onarim_talepleri')
      .update({ durum: yeniDurum })
      .eq('id', id);

    if (!error) {
      alert("Durum güncellendi usta! ✅");
      router.refresh(); 
    }
  };

  const talebiSil = async () => {
    if(!confirm("Bu kaydı silmek istediğine emin misin?")) return;

    const { error } = await supabase
      .from('onarim_talepleri')
      .delete()
      .eq('id', id);
      
    if (!error) {
      router.push("/epanel"); 
    }
  };

  if (loading) return <div className="p-10 text-cyan-400 flex items-center gap-2"><Loader2 className="animate-spin"/> Detaylar Yükleniyor...</div>;
  if (!talep) return <div className="p-10 text-red-400 font-bold">Talep bulunamadı! (ID: {id})</div>;

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-20">
      {/* Üst Başlık ve Geri Butonu */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/epanel" className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-white">Talep Detayı #{talep.id}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL TARAF */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={16}/> Müşteri Bilgileri
            </h3>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-white">{talep.ad_soyad}</div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-lg">
                <Phone size={18} /> <a href={`tel:${talep.telefon}`}>{talep.telefon}</a>
              </div>
              {talep.adres && (
                <div className="flex items-start gap-2 text-slate-300 bg-slate-800/50 p-3 rounded-lg mt-2">
                  <MapPin size={18} className="mt-1 flex-shrink-0 text-orange-400" /> 
                  <span>{talep.adres}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Smartphone size={16}/> Cihaz ve Sorun
            </h3>
            <div className="mb-4">
              <span className="text-slate-500 text-sm">Cihaz Modeli:</span>
              <div className="text-xl font-bold text-white">{talep.marka_model}</div>
              <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300 mt-1 inline-block uppercase">{talep.cihaz_tipi}</span>
            </div>
            <div>
              <span className="text-slate-500 text-sm">Sorun Açıklaması:</span>
              <p className="text-slate-200 bg-slate-800 p-4 rounded-xl mt-1 border border-slate-700/50">
                {talep.sorun_aciklamasi}
              </p>
            </div>
          </div>
        </div>

        {/* SAĞ TARAF */}
        <div className="space-y-6">
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(8,145,178,0.1)]">
            <h3 className="text-white font-bold mb-4">Servis Durumu</h3>
            <select 
              value={yeniDurum} 
              onChange={(e) => setYeniDurum(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-600 rounded-xl p-3 text-white mb-4 focus:border-cyan-500 outline-none cursor-pointer"
            >
              <option value="beklemede">🟡 Beklemede</option>
              <option value="inceleniyor">🔵 İnceleniyor</option>
              <option value="parca_bekliyor">🟣 Parça Bekliyor</option>
              <option value="fiyat_onayi">🟠 Fiyat Onayı Bekliyor</option>
              <option value="tamamlandi">🟢 Tamamlandı</option>
              <option value="iptal">🔴 İptal Edildi</option>
            </select>
            <button onClick={durumuGuncelle} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20">
              <Save size={18} /> Kaydet
            </button>
          </div>
          <button onClick={talebiSil} className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
            <Trash2 size={18} /> Kaydı Sil
          </button>
        </div>
      </div>
    </div>
  );
}