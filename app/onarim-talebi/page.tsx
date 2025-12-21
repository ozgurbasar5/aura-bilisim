"use client";

import { useState } from "react";
import { Wrench, Smartphone, Laptop, Zap, CheckCircle, AlertCircle, MapPin, Truck, HelpCircle } from "lucide-react";
import { supabase } from "../lib/supabase"; // Bağlantıyı çağırdık

export default function OnarimTalebi() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    ad_soyad: "",
    telefon: "",
    cihaz_tipi: "telefon",
    teslimat_yontemi: "sube", 
    adres: "",
    marka_model: "",
    sorun_aciklamasi: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // --- SUPABASE'E VERİ GÖNDERME ---
      const { data, error } = await supabase
        .from('onarim_talepleri')
        .insert([
          { 
            ad_soyad: formData.ad_soyad,
            telefon: formData.telefon,
            cihaz_tipi: formData.cihaz_tipi,
            marka_model: formData.marka_model,
            sorun_aciklamasi: formData.sorun_aciklamasi,
            teslimat_yontemi: formData.teslimat_yontemi,
            adres: formData.adres
          },
        ]);

      if (error) throw error;

      // Başarılı olursa
      setSuccess(true);
      
    } catch (error: any) {
      console.error("Hata:", error);
      setErrorMsg("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="bg-[#1E293B] border border-green-500/30 p-8 rounded-3xl text-center max-w-md w-full shadow-[0_0_40px_rgba(34,197,94,0.2)] animate-float-slow">
          
          {/* Yeşil Tik İkonu */}
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          {/* Başlık */}
          <h2 className="text-3xl font-bold text-white mb-4">Talep Alındı!</h2>
          
          {/* Durum Bilgisi */}
          <p className="text-white text-lg mb-2">
            {formData.teslimat_yontemi === 'kurye' 
              ? "Kurye yönlendirmesi için hazırlık yapılıyor." 
              : "Cihazınızı servisimize bekliyoruz."}
          </p>

          {/* Yeni Eklenen Yazı */}
          <p className="text-slate-400 text-sm mb-6">
            Ekibimiz en kısa sürede sizinle irtibata geçecektir.
          </p>

          {/* İletişim Kutusu (Yeni) */}
          <div className="bg-[#0F172A] border border-slate-700 p-4 rounded-2xl mb-6">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Destek & İletişim</p>
            <a href="tel:05396321469" className="text-2xl font-black text-cyan-400 hover:text-cyan-300 transition-colors">
                0539 632 1469
            </a>
          </div>

          {/* Buton */}
          <button onClick={() => { setSuccess(false); setFormData({...formData, ad_soyad: ""}); }} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all">
            Yeni Form Oluştur
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Onarım Başvurusu</h1>
          <p className="text-slate-400">Arızalı cihazınız için servis kaydı oluşturun.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1E293B]/60 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-2xl">
          
          {/* Ad Soyad & Telefon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Ad Soyad</label>
              <input required type="text" className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" 
                placeholder="Adınız Soyadınız" 
                onChange={(e) => setFormData({...formData, ad_soyad: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Telefon</label>
              <input required type="tel" className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" 
                placeholder="05XX XXX XX XX" 
                onChange={(e) => setFormData({...formData, telefon: e.target.value})} 
              />
            </div>
          </div>

          {/* Teslimat Yöntemi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-3">Teslimat Yöntemi</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setFormData({...formData, teslimat_yontemi: 'sube'})}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${formData.teslimat_yontemi === 'sube' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-[#0F172A] border-slate-700 text-slate-400'}`}>
                <MapPin size={18} /> <span className="font-bold">Şubeye Getireceğim</span>
              </button>
              <button type="button" onClick={() => setFormData({...formData, teslimat_yontemi: 'kurye'})}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${formData.teslimat_yontemi === 'kurye' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-[#0F172A] border-slate-700 text-slate-400'}`}>
                <Truck size={18} /> <span className="font-bold">Adresten Alınsın</span>
              </button>
            </div>
          </div>

          {/* Adres (Kurye ise) */}
          {formData.teslimat_yontemi === 'kurye' && (
            <div className="mb-6 animate-pulse-slow">
              <label className="block text-sm font-medium text-orange-400 mb-2">Açık Adres</label>
              <textarea required className="w-full bg-[#0F172A] border border-orange-500/50 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none h-24" 
                placeholder="Mahalle, Sokak, No, İlçe/İl..." 
                onChange={(e) => setFormData({...formData, adres: e.target.value})}
              ></textarea>
            </div>
          )}

          {/* Cihaz Tipi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">Cihaz Türü</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                {id:'telefon', icon:Smartphone, label:'Telefon', color:'cyan'},
                {id:'bilgisayar', icon:Laptop, label:'PC', color:'green'},
                {id:'robot', icon:Zap, label:'Robot', color:'purple'},
                {id:'diger', icon:HelpCircle, label:'Diğer', color:'gray'}
              ].map((item) => (
                <button key={item.id} type="button" onClick={() => setFormData({...formData, cihaz_tipi: item.id})}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${formData.cihaz_tipi === item.id ? `bg-${item.color}-500/20 border-${item.color}-500 text-${item.color}-400` : 'bg-[#0F172A] border-slate-700 text-slate-400'}`}>
                  <item.icon size={20} className="mb-1" />
                  <span className="text-[10px] font-bold uppercase">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">Marka / Model</label>
            <input required type="text" className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" 
              placeholder="Örn: iPhone 13 Pro Max..." 
              onChange={(e) => setFormData({...formData, marka_model: e.target.value})} 
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-400 mb-2">Sorun Açıklaması</label>
            <textarea required className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none h-32" 
              placeholder="Sorunu detaylı anlatınız..." 
              onChange={(e) => setFormData({...formData, sorun_aciklamasi: e.target.value})}
            ></textarea>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50">
            {loading ? "GÖNDERİLİYOR..." : "TALEBİ OLUŞTUR"}
          </button>

        </form>
      </div>
    </main>
  );
}