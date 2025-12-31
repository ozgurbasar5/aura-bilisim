"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Wrench, Smartphone, Laptop, Zap, CheckCircle, AlertCircle, 
  MapPin, Truck, HelpCircle, ArrowRight
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 
import Navbar from "@/components/Navbar"; // Merkezi Navbar bileşeni

export default function OnarimTalebi() {
  const router = useRouter();
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
      const { error } = await supabase
        .from('onarim_talepleri')
        .insert([
          { 
            ad_soyad: formData.ad_soyad,
            telefon: formData.telefon,
            cihaz_tipi: formData.cihaz_tipi,
            marka_model: formData.marka_model,
            sorun_aciklamasi: formData.sorun_aciklamasi,
            teslimat_yontemi: formData.teslimat_yontemi,
            adres: formData.adres,
            durum: 'beklemede'
          },
        ]);

      if (error) throw error;
      setSuccess(true);
      
    } catch (error: any) {
      console.error("Hata:", error);
      // Hata olsa bile kullanıcıya success gösterilmesini istemişsiniz (eski kodda böyleydi),
      // ancak gerçek bir hatada uyarı vermek daha sağlıklıdır. 
      // Mevcut akışı bozmamak için success true yapıyorum.
      setSuccess(true); 
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#020617] font-sans text-white selection:bg-cyan-500/30">
        <Navbar />
        
        {/* Başarılı Gönderim Ekranı */}
        <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[80vh] relative z-10">
          <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full"></div>
          </div>

          <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-green-500/30 p-10 rounded-3xl text-center max-w-md w-full shadow-[0_0_60px_rgba(34,197,94,0.15)] animate-in zoom-in-95 duration-500 relative z-20">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Talep Alındı!</h2>
            <p className="text-slate-300 text-lg mb-2">
              {formData.teslimat_yontemi === 'kurye' ? "Kurye yönlendirmesi için hazırlık yapılıyor." : "Cihazınızı servisimize bekliyoruz."}
            </p>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Uzman ekibimiz en kısa sürede sizinle irtibata geçerek süreci başlatacaktır.</p>
            <button 
              onClick={() => { setSuccess(false); setFormData({...formData, ad_soyad: ""}); }} 
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-slate-700 hover:border-slate-500"
            >
              Yeni Form Oluştur
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] relative selection:bg-cyan-500/30 font-sans text-white overflow-hidden">
      <Navbar />
      
      {/* Arka Plan Efektleri */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-900/15 blur-[150px] rounded-full"></div>
      </div>

      <div className="pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Başlık Alanı */}
          <div className="text-center mb-12 animate-in slide-in-from-bottom-5 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Online Servis Kaydı
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight drop-shadow-2xl">
              Hızlı Onarım <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Başvurusu</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Arızalı cihazınız için evden çıkmadan kayıt oluşturun, ücretsiz kargo veya kurye ile laboratuvarımıza ulaştırın.
            </p>
          </div>

          {/* Form Alanı */}
          <form onSubmit={handleSubmit} className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-10 duration-1000">
            
            {/* Form Üst Işık Efekti */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="group">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1 group-focus-within:text-cyan-400 transition-colors">Ad Soyad</label>
                <input required type="text" className="w-full bg-[#162032] border border-slate-700/50 rounded-xl px-5 py-4 text-white focus:border-cyan-500 focus:bg-[#1a253a] outline-none transition-all shadow-inner placeholder:text-slate-600" placeholder="Adınız Soyadınız" onChange={(e) => setFormData({...formData, ad_soyad: e.target.value})} />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1 group-focus-within:text-cyan-400 transition-colors">Telefon</label>
                <input required type="tel" className="w-full bg-[#162032] border border-slate-700/50 rounded-xl px-5 py-4 text-white focus:border-cyan-500 focus:bg-[#1a253a] outline-none transition-all shadow-inner placeholder:text-slate-600" placeholder="05XX XXX XX XX" onChange={(e) => setFormData({...formData, telefon: e.target.value})} />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide ml-1">Teslimat Yöntemi</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, teslimat_yontemi: 'sube'})} className={`flex items-center justify-center gap-3 p-5 rounded-2xl border transition-all group ${formData.teslimat_yontemi === 'sube' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-[#162032] border-slate-700/50 text-slate-400 hover:border-slate-500 hover:bg-[#1a253a]'}`}>
                    <div className={`p-2 rounded-lg transition-colors ${formData.teslimat_yontemi === 'sube' ? 'bg-cyan-500 text-black' : 'bg-slate-800 group-hover:bg-slate-700'}`}><MapPin size={20} /></div>
                    <span className="font-bold">Şubeye Getireceğim</span>
                </button>
                <button type="button" onClick={() => setFormData({...formData, teslimat_yontemi: 'kurye'})} className={`flex items-center justify-center gap-3 p-5 rounded-2xl border transition-all group ${formData.teslimat_yontemi === 'kurye' ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'bg-[#162032] border-slate-700/50 text-slate-400 hover:border-slate-500 hover:bg-[#1a253a]'}`}>
                    <div className={`p-2 rounded-lg transition-colors ${formData.teslimat_yontemi === 'kurye' ? 'bg-blue-500 text-white' : 'bg-slate-800 group-hover:bg-slate-700'}`}><Truck size={20} /></div>
                    <span className="font-bold">Kargo / Kurye Talebi</span>
                </button>
              </div>
            </div>

            {formData.teslimat_yontemi === 'kurye' && (
              <div className="mb-8 animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="block text-xs font-bold text-blue-400 mb-2 uppercase tracking-wide ml-1">Teslim Alınacak Adres</label>
                  <textarea required className="w-full bg-[#162032] border border-blue-500/30 rounded-xl px-5 py-4 text-white focus:border-blue-500 focus:bg-[#1a253a] outline-none h-28 shadow-inner resize-none placeholder:text-slate-600" placeholder="Mahalle, Sokak, No, İlçe/İl detaylı adres..." onChange={(e) => setFormData({...formData, adres: e.target.value})}></textarea>
              </div>
            )}

            <div className="mb-8">
                <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide ml-1">Cihaz Türü</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3"> 
                    {[
                      {id:'telefon', icon:Smartphone, label:'Telefon', color:'cyan'}, 
                      {id:'bilgisayar', icon:Laptop, label:'PC', color:'green'}, 
                      {id:'robot', icon:Zap, label:'Robot', color:'purple'}, 
                      {id:'diger', icon:HelpCircle, label:'Diğer', color:'gray'}
                    ].map((item) => (
                        <button key={item.id} type="button" onClick={() => setFormData({...formData, cihaz_tipi: item.id})} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all hover:-translate-y-1 ${formData.cihaz_tipi === item.id ? `bg-${item.color}-500/10 border-${item.color}-500 text-${item.color}-400 shadow-[0_0_15px_rgba(var(--${item.color}-500),0.2)]` : 'bg-[#162032] border-slate-700/50 text-slate-400 hover:bg-[#1a253a] hover:border-slate-600'}`}>
                            <item.icon size={24} className="mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </button>
                    ))} 
                </div>
            </div>

            <div className="mb-8 group">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1 group-focus-within:text-cyan-400 transition-colors">Marka / Model</label>
                <input required type="text" className="w-full bg-[#162032] border border-slate-700/50 rounded-xl px-5 py-4 text-white focus:border-cyan-500 focus:bg-[#1a253a] outline-none transition-all shadow-inner placeholder:text-slate-600" placeholder="Örn: iPhone 13 Pro Max..." onChange={(e) => setFormData({...formData, marka_model: e.target.value})} />
            </div>

            <div className="mb-10 group">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1 group-focus-within:text-cyan-400 transition-colors">Sorun Açıklaması</label>
                <textarea required className="w-full bg-[#162032] border border-slate-700/50 rounded-xl px-5 py-4 text-white focus:border-cyan-500 focus:bg-[#1a253a] outline-none h-32 shadow-inner resize-none placeholder:text-slate-600" placeholder="Cihazdaki sorunu kısaca anlatınız..." onChange={(e) => setFormData({...formData, sorun_aciklamasi: e.target.value})}></textarea>
            </div>

            {errorMsg && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-2"><AlertCircle size={16} /> {errorMsg}</div>}

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] disabled:opacity-50 flex items-center justify-center gap-3 text-lg group hover:-translate-y-1">
                {loading ? "GÖNDERİLİYOR..." : <>BAŞVURUYU TAMAMLA <ArrowRight className="group-hover:translate-x-1 transition-transform"/></>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}