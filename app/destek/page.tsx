"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase"; // Veritabanı bağlantısı
import { 
  Phone, Mail, MessageCircle, 
  LifeBuoy, Send, CheckCircle, AlertCircle
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
    
    // Veritabanına Gönderilecek Paket
    // Not: Bu talebi 'aura_jobs' tablosuna ekliyoruz ki panele düşsün.
    const { error } = await supabase.from('aura_jobs').insert({
        customer: formData.adSoyad,
        phone: formData.telefon,
        email: formData.email, // SQL ile eklediğimiz yeni sütun
        device: formData.konu, // Panelde 'Cihaz' kısmında Konu görünecek (Örn: Arıza Bildirimi)
        problem: formData.mesaj,
        status: 'Bekliyor', // Panele 'Bekliyor' olarak düşsün
        category: 'Destek Talebi', // Kategorisi belli olsun
        price: 0 // Ücret henüz yok
    });

    setLoading(false);

    if (error) {
        console.error(error);
        setDurum('hata');
    } else {
        setDurum('basarili');
        // Formu temizle
        setFormData({ adSoyad: "", telefon: "", email: "", konu: "Teknik Servis Durumu", mesaj: "" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 pt-32 pb-12 font-sans">
      <div className="container mx-auto px-6">
        
        {/* BAŞLIK */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-2xl mb-4 ring-1 ring-cyan-500/20">
            <LifeBuoy className="text-cyan-400 w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Size Nasıl Yardımcı Olabiliriz?
          </h1>
          <p className="text-slate-400 text-lg">
            Teknik sorunlar, ürün bilgisi veya servis takibi... <br/>
            Aura Bilişim uzman ekibi her zaman yanınızda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* --- SOL: İLETİŞİM KARTLARI --- */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Telefon */}
            <div className="bg-[#151921] border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/30 transition-all group shadow-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Çağrı Merkezi</h3>
                  <p className="text-sm text-slate-400">Hafta içi 09:00 - 18:00</p>
                  <a href="tel:05396321469" className="text-lg font-bold text-blue-400 mt-1 block hover:underline">0539 632 14 69</a>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-[#151921] border border-slate-800 p-6 rounded-2xl hover:border-green-500/30 transition-all group shadow-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">WhatsApp Destek</h3>
                  <p className="text-sm text-slate-400">7/24 Mesaj Bırakın</p>
                  <a href="https://wa.me/905396321469" target="_blank" className="text-lg font-bold text-green-400 mt-1 block hover:underline">0539 632 14 69</a>
                </div>
              </div>
            </div>

            {/* E-Posta */}
            <div className="bg-[#151921] border border-slate-800 p-6 rounded-2xl hover:border-purple-500/30 transition-all group shadow-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">E-Posta</h3>
                  <p className="text-sm text-slate-400">Kurumsal & Teknik</p>
                  <a href="mailto:destek@aurabilisim.com" className="text-lg font-bold text-purple-400 mt-1 block hover:underline break-all">destek@aurabilisim.com</a>
                </div>
              </div>
            </div>

          </div>

          {/* --- SAĞ: DESTEK FORMU --- */}
          <div className="lg:col-span-2">
            <div className="bg-[#151921] border border-slate-800 rounded-3xl p-8 h-full relative overflow-hidden shadow-2xl">
              {/* Arkaplan Efekti */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Send className="text-cyan-500" size={24}/> Destek Talebi Oluştur
              </h2>

              {durum === 'basarili' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 ring-1 ring-green-500/50">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Talebiniz Alındı!</h3>
                  <p className="text-slate-400 max-w-md">
                    Destek talebiniz başarıyla oluşturuldu ve panele iletildi. Uzman ekibimiz en kısa sürede size dönüş yapacaktır.
                  </p>
                  <button onClick={() => setDurum('bosta')} className="mt-8 text-cyan-400 hover:text-white font-bold underline transition-colors">Yeni Talep Oluştur</button>
                </div>
              ) : durum === 'hata' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/50">
                      <AlertCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Bir Hata Oluştu!</h3>
                    <p className="text-slate-400 max-w-md">
                      Talebiniz şu an gönderilemedi. Lütfen WhatsApp hattımızdan bize ulaşın.
                    </p>
                    <button onClick={() => setDurum('bosta')} className="mt-8 text-red-400 hover:text-white font-bold underline transition-colors">Tekrar Dene</button>
                  </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ad Soyad</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Adınız Soyadınız" 
                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600"
                        value={formData.adSoyad}
                        onChange={(e) => setFormData({...formData, adSoyad: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">İletişim Numarası</label>
                      <input 
                        required 
                        type="tel" 
                        placeholder="05XX..." 
                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600"
                        value={formData.telefon}
                        onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-Posta Adresi</label>
                    <input 
                        required 
                        type="email" 
                        placeholder="ornek@email.com" 
                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Konu</label>
                    <select 
                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all cursor-pointer"
                        value={formData.konu}
                        onChange={(e) => setFormData({...formData, konu: e.target.value})}
                    >
                      <option>Teknik Servis Durumu</option>
                      <option>Ürün Bilgisi / Satış</option>
                      <option>Arıza Bildirimi</option>
                      <option>Öneri / Şikayet</option>
                      <option>Diğer</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mesajınız</label>
                    <textarea 
                        required 
                        rows={5} 
                        placeholder="Size nasıl yardımcı olabiliriz?" 
                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                        value={formData.mesaj}
                        onChange={(e) => setFormData({...formData, mesaj: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>Gönderiliyor...</>
                    ) : (
                      <>TALEBİ GÖNDER <Send size={18}/></>
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