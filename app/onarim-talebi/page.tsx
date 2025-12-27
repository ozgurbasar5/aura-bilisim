"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Wrench, Smartphone, Laptop, Zap, CheckCircle, AlertCircle, 
  MapPin, Truck, HelpCircle, ShoppingBag, ArrowRight
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 

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
      setSuccess(true); 
    } finally {
      setLoading(false);
    }
  };

  // --- NAVBAR (DÜZELTİLDİ: Tek Parça, Katı Arkaplan) ---
  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#020617] border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
             <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg"><Wrench size={20} className="text-white"/></div>
             <div><h1 className="text-xl font-black tracking-tight leading-none text-white">AURA<span className="text-cyan-500">BİLİŞİM</span></h1><p className="text-[10px] text-slate-400 tracking-widest font-bold uppercase">Teknik Laboratuvar</p></div>
          </div>
          
          {/* MENÜ */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400 h-full">
             <Link href="/" className="hover:text-cyan-400 transition-colors h-full flex items-center">Ana Sayfa</Link>
             <Link href="/sorgula" className="hover:text-cyan-400 transition-colors h-full flex items-center">Cihaz Sorgula</Link>
             <Link href="/magaza" className="hover:text-cyan-400 transition-colors h-full flex items-center">Aura Store</Link>
             <Link href="/iletisim" className="hover:text-cyan-400 transition-colors h-full flex items-center">İletişim</Link>
          </div>

          {/* SAĞ BUTONLAR */}
          <div className="flex items-center gap-4">
             <Link href="/magaza" className="hidden sm:flex items-center gap-2 text-white font-bold text-sm transition-all border border-purple-500/50 bg-purple-500/10 px-5 py-2.5 rounded-xl hover:bg-purple-500"><ShoppingBag size={18}/> Aura Store</Link>
             <Link href="/onarim-talebi" className="hidden sm:flex items-center gap-2 bg-[#1e293b] hover:bg-[#283547] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-700 hover:border-cyan-500/50 shadow-lg"><Wrench size={18} className="text-cyan-400"/> Onarım Talebi</Link>
          </div>
        </div>
    </nav>
  );

  if (success) {
    return (
      <main className="min-h-screen bg-[#020617] font-sans text-white">
        <Navbar />
        <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[80vh]">
          <div className="bg-[#0f172a] border border-green-500/30 p-10 rounded-3xl text-center max-w-md w-full shadow-[0_0_60px_rgba(34,197,94,0.15)] animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Talep Alındı!</h2>
            <p className="text-slate-300 text-lg mb-2">
              {formData.teslimat_yontemi === 'kurye' ? "Kurye yönlendirmesi için hazırlık yapılıyor." : "Cihazınızı servisimize bekliyoruz."}
            </p>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Uzman ekibimiz en kısa sürede sizinle irtibata geçerek süreci başlatacaktır.</p>
            <button onClick={() => { setSuccess(false); setFormData({...formData, ad_soyad: ""}); }} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-slate-700">Yeni Form Oluştur</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] relative selection:bg-cyan-500/30 font-sans text-white">
      <Navbar />
      
      {/* Background (Efektler navbar'ın altında kalsın) */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-900/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">Online Servis</div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight">Hızlı Onarım <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Başvurusu</span></h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Arızalı cihazınız için evden çıkmadan kayıt oluşturun, ücretsiz kargo veya kurye ile bize ulaştırın.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1">Ad Soyad</label>
                <input required type="text" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all shadow-inner" placeholder="Adınız Soyadınız" onChange={(e) => setFormData({...formData, ad_soyad: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1">Telefon</label>
                <input required type="tel" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all shadow-inner" placeholder="05XX XXX XX XX" onChange={(e) => setFormData({...formData, telefon: e.target.value})} />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide ml-1">Teslimat Yöntemi</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, teslimat_yontemi: 'sube'})} className={`flex items-center justify-center gap-3 p-5 rounded-2xl border transition-all group ${formData.teslimat_yontemi === 'sube' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-[#1e293b] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                    <div className={`p-2 rounded-lg ${formData.teslimat_yontemi === 'sube' ? 'bg-cyan-500 text-black' : 'bg-slate-800'}`}><MapPin size={20} /></div>
                    <span className="font-bold">Şubeye Getireceğim</span>
                </button>
                <button type="button" onClick={() => setFormData({...formData, teslimat_yontemi: 'kurye'})} className={`flex items-center justify-center gap-3 p-5 rounded-2xl border transition-all group ${formData.teslimat_yontemi === 'kurye' ? 'bg-orange-500/10 border-orange-500 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)]' : 'bg-[#1e293b] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                    <div className={`p-2 rounded-lg ${formData.teslimat_yontemi === 'kurye' ? 'bg-orange-500 text-black' : 'bg-slate-800'}`}><Truck size={20} /></div>
                    <span className="font-bold">Kargo / Kurye Talebi</span>
                </button>
              </div>
            </div>

            {formData.teslimat_yontemi === 'kurye' && (
              <div className="mb-8 animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="block text-xs font-bold text-orange-400 mb-2 uppercase tracking-wide ml-1">Teslim Alınacak Adres</label>
                  <textarea required className="w-full bg-[#1e293b] border border-orange-500/30 rounded-xl px-5 py-4 text-white focus:border-orange-500 outline-none h-28 shadow-inner resize-none" placeholder="Mahalle, Sokak, No, İlçe/İl detaylı adres..." onChange={(e) => setFormData({...formData, adres: e.target.value})}></textarea>
              </div>
            )}

            <div className="mb-8">
                <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide ml-1">Cihaz Türü</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3"> 
                    {[{id:'telefon', icon:Smartphone, label:'Telefon', color:'cyan'}, {id:'bilgisayar', icon:Laptop, label:'PC', color:'green'}, {id:'robot', icon:Zap, label:'Robot', color:'purple'}, {id:'diger', icon:HelpCircle, label:'Diğer', color:'gray'}].map((item) => (
                        <button key={item.id} type="button" onClick={() => setFormData({...formData, cihaz_tipi: item.id})} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${formData.cihaz_tipi === item.id ? `bg-${item.color}-500/10 border-${item.color}-500 text-${item.color}-400` : 'bg-[#1e293b] border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                            <item.icon size={24} className="mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </button>
                    ))} 
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1">Marka / Model</label>
                <input required type="text" className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all shadow-inner" placeholder="Örn: iPhone 13 Pro Max..." onChange={(e) => setFormData({...formData, marka_model: e.target.value})} />
            </div>

            <div className="mb-10">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide ml-1">Sorun Açıklaması</label>
                <textarea required className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-5 py-4 text-white focus:border-cyan-500 outline-none h-32 shadow-inner resize-none" placeholder="Cihazdaki sorunu kısaca anlatınız..." onChange={(e) => setFormData({...formData, sorun_aciklamasi: e.target.value})}></textarea>
            </div>

            {errorMsg && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-2"><AlertCircle size={16} /> {errorMsg}</div>}

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] disabled:opacity-50 flex items-center justify-center gap-3 text-lg group">
                {loading ? "GÖNDERİLİYOR..." : <>BAŞVURUYU TAMAMLA <ArrowRight className="group-hover:translate-x-1 transition-transform"/></>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}