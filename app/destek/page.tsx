"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase"; 
import { 
  Phone, Mail, MessageCircle, 
  LifeBuoy, Send, CheckCircle, AlertCircle, MapPin
} from "lucide-react";

export default function DestekSayfasi() {
  const [loading, setLoading] = useState(false);
  const [durum, setDurum] = useState<'bosta' | 'basarili' | 'hata'>('bosta');

  // Form Verileri
  const [formData, setFormData] = useState({
    adSoyad: "",
    telefon: "",
    email: "",
    konu: "Teknik Servis Durumu",
    mesaj: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('aura_jobs').insert({
        customer: formData.adSoyad,
        phone: formData.telefon,
        email: formData.email, 
        device: formData.konu, 
        problem: formData.mesaj,
        status: 'Bekliyor', 
        category: 'Destek Talebi', 
        price: 0 
    });

    setLoading(false);

    if (error) {
        console.error(error);
        setDurum('hata');
    } else {
        setDurum('basarili');
        setFormData({ adSoyad: "", telefon: "", email: "", konu: "Teknik Servis Durumu", mesaj: "" });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-20 font-sans relative overflow-hidden">
      
      {/* ARKA PLAN DESENİ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* BAŞLIK */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-cyan-500/10 rounded-2xl mb-6 ring-1 ring-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <LifeBuoy className="text-cyan-400 w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            Size Nasıl <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Yardımcı Olabiliriz?</span>
          </h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed">
            Teknik sorunlar, ürün bilgisi veya servis takibi... <br/>
            <strong className="text-white">Aura Bilişim</strong> uzman ekibi her zaman yanınızda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* --- SOL: İLETİŞİM KARTLARI --- */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Telefon */}
            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all group shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-inner">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-blue-200 transition-colors">Çağrı Merkezi</h3>
                  <p className="text-xs text-slate-500 mb-1">Hafta içi 09:00 - 18:00</p>
                  <a href="tel:05396321469" className="text-lg font-black text-blue-400 block hover:underline tracking-wide">0539 632 14 69</a>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-green-500/30 transition-all group shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors shadow-inner">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-green-200 transition-colors">WhatsApp Destek</h3>
                  <p className="text-xs text-slate-500 mb-1">7/24 Mesaj Bırakın</p>
                  <a href="https://wa.me/905396321469" target="_blank" className="text-lg font-black text-green-400 block hover:underline tracking-wide">0539 632 14 69</a>
                </div>
              </div>
            </div>

            {/* E-Posta */}
            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-purple-500/30 transition-all group shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors shadow-inner">
                  <Mail size={24} />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-white group-hover:text-purple-200 transition-colors">E-Posta</h3>
                  <p className="text-xs text-slate-500 mb-1">Kurumsal & Teknik</p>
                  <a href="mailto:destek@aurabilisim.com" className="text-sm font-bold text-purple-400 block hover:underline truncate">destek@aurabilisim.com</a>
                </div>
              </div>
            </div>

             {/* Adres (Opsiyonel - Görsellik İçin) */}
             <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-orange-500/30 transition-all group shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-orange-200 transition-colors">Merkez Ofis</h3>
                  <p className="text-xs text-slate-400">Beylikdüzü / İstanbul</p>
                </div>
              </div>
            </div>

          </div>

          {/* --- SAĞ: DESTEK FORMU --- */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#0f172a] to-[#0b0e14] border border-white/10 rounded-3xl p-8 md:p-10 h-full relative overflow-hidden shadow-2xl">
              {/* Arkaplan Efekti */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
                <Send className="text-cyan-500" size={24}/> Destek Talebi Oluştur
              </h2>

              {durum === 'basarili' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 ring-1 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">Talebiniz Alındı!</h3>
                  <p className="text-slate-400 max-w-md text-lg leading-relaxed">
                    Destek talebiniz başarıyla oluşturuldu ve teknik ekibimize iletildi. En kısa sürede size dönüş yapacağız.
                  </p>
                  <button onClick={() => setDurum('bosta')} className="mt-10 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all">Yeni Talep Oluştur</button>
                </div>
              ) : durum === 'hata' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                      <AlertCircle size={48} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Bir Hata Oluştu!</h3>
                    <p className="text-slate-400 max-w-md text-lg leading-relaxed">
                      Talebiniz şu an gönderilemedi. Lütfen internet bağlantınızı kontrol edin veya WhatsApp hattımızdan bize ulaşın.
                    </p>
                    <button onClick={() => setDurum('bosta')} className="mt-10 px-8 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 font-bold transition-all">Tekrar Dene</button>
                  </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-cyan-500 uppercase ml-1 tracking-wider">Ad Soyad</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Adınız Soyadınız" 
                        className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                        value={formData.adSoyad}
                        onChange={(e) => setFormData({...formData, adSoyad: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-cyan-500 uppercase ml-1 tracking-wider">İletişim Numarası</label>
                      <input 
                        required 
                        type="tel" 
                        placeholder="05XX..." 
                        className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                        value={formData.telefon}
                        onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cyan-500 uppercase ml-1 tracking-wider">E-Posta Adresi</label>
                    <input 
                        required 
                        type="email" 
                        placeholder="ornek@email.com" 
                        className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cyan-500 uppercase ml-1 tracking-wider">Konu</label>
                    <div className="relative">
                        <select 
                            className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all cursor-pointer shadow-inner appearance-none"
                            value={formData.konu}
                            onChange={(e) => setFormData({...formData, konu: e.target.value})}
                        >
                          <option>Teknik Servis Durumu</option>
                          <option>Ürün Bilgisi / Satış</option>
                          <option>Arıza Bildirimi</option>
                          <option>Öneri / Şikayet</option>
                          <option>Diğer</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cyan-500 uppercase ml-1 tracking-wider">Mesajınız</label>
                    <textarea 
                        required 
                        rows={5} 
                        placeholder="Size nasıl yardımcı olabiliriz? Lütfen detayları buraya yazın..." 
                        className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-700 resize-none shadow-inner"
                        value={formData.mesaj}
                        onChange={(e) => setFormData({...formData, mesaj: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <>Gönderiliyor...</>
                    ) : (
                      <>TALEBİ GÖNDER <Send size={20}/></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}