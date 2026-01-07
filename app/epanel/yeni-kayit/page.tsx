"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { Save, User, Smartphone, Building2, ScanBarcode, CircuitBoard, Layers } from "lucide-react";

export default function YeniKayit() {
  const router = useRouter();
  const [kaynaklar, setKaynaklar] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ad_soyad: "",
    telefon: "",
    marka_model: "",
    imei_no: "",
    cihaz_tipi: "cep telefonu", // Varsayılan
    sorun_aciklamasi: "",
    cihaz_kaynagi: "Son Kullanıcı",
    durum: "Bekliyor" 
  });

  useEffect(() => {
    // Firma listesini çek (Bayi listesi)
    const kaynakGetir = async () => {
      const { data } = await supabase.from('ayarlar_kaynaklar').select('isim');
      if (data) setKaynaklar(data);
    };
    kaynakGetir();
  }, []);

  // Rastgele Takip Kodu Oluşturucu (Örn: TRK-92834)
  const generateTrackingCode = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `TRK-${randomNum}`;
  };

  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Veri Hazırlığı
    const trackingCode = generateTrackingCode();
    
    // Eğer kaynak "Son Kullanıcı" değilse, bu bir Bayi işidir.
    // Bayi işlerinde müşteri adı olarak Bayi ismini kullanıyoruz ki bayi panelinde gözüksün.
    // Gerçek son kullanıcı adını açıklamaya ekliyoruz.
    const isDealer = form.cihaz_kaynagi !== "Son Kullanıcı";
    
    const jobData = {
        customer: isDealer ? form.cihaz_kaynagi : form.ad_soyad, // Bayi ise Bayi Adı, değilse Şahıs Adı
        customer_type: isDealer ? 'Bayi' : 'Bireysel',
        phone: form.telefon,
        device: `${form.marka_model} (${form.cihaz_tipi})`, // Marka Model + Tip birleşimi
        serial_no: form.imei_no,
        problem_desc: form.sorun_aciklamasi + (isDealer ? `\n\n(Son Kullanıcı: ${form.ad_soyad})` : ""), // Bayi ise son kullanıcıyı nota ekle
        status: 'Bekliyor', // Varsayılan başlangıç durumu
        tracking_code: trackingCode,
        price: 0, // İlk başta fiyat 0
        approval_status: 'pending', // Onay durumu
        created_at: new Date().toISOString()
    };
    
    // 2. Aura Jobs Tablosuna Kayıt
    const { error } = await supabase.from('aura_jobs').insert([jobData]);
    
    if (!error) {
      alert(`✅ Kayıt Başarıyla Açıldı!\nTakip Kodu: ${trackingCode}`);
      router.push("/epanel/atolye"); // Kayıttan sonra direkt atölye listesine yönlendir
    } else {
      console.error("Supabase Hatası:", error);
      alert("Hata oluştu: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
        <CircuitBoard className="text-green-500" size={32} /> Yeni Servis Kaydı
      </h1>

      <form onSubmit={kaydet} className="space-y-6">
        <div className="bg-[#1E293B] p-8 rounded-3xl border border-slate-700 shadow-xl space-y-8">
          
          {/* 1. MÜŞTERİ BİLGİLERİ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Müşteri Adı Soyadı</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input required type="text" placeholder="Ad Soyad" 
                  onChange={(e) => setForm({...form, ad_soyad: e.target.value})}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Telefon Numarası</label>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input required type="text" placeholder="05xx..." 
                  onChange={(e) => setForm({...form, telefon: e.target.value})}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all font-mono font-bold" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/50"></div>

          {/* 2. CİHAZ TÜRÜ VE KAYNAK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* KATEGORİ SEÇİMİ */}
             <div className="space-y-2">
              <label className="text-[10px] text-green-400 font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Layers size={12}/> Cihaz Türü (Kategori)
              </label>
              <div className="relative">
                <select 
                  onChange={(e) => setForm({...form, cihaz_tipi: e.target.value})}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-2xl py-3.5 px-4 text-white focus:border-green-500 outline-none transition-all appearance-none font-bold cursor-pointer hover:bg-slate-900"
                >
                  <option value="cep telefonu">📱 Cep Telefonu</option>
                  <option value="robot süpürge">🧹 Robot Süpürge</option>
                  <option value="bilgisayar">💻 Bilgisayar / Laptop</option>
                  <option value="diger">🔌 Diğer Elektronik</option>
                </select>
                <div className="absolute right-4 top-4 pointer-events-none text-slate-500">▼</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Cihaz Kaynağı / Firma</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <select 
                  onChange={(e) => setForm({...form, cihaz_kaynagi: e.target.value})}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all appearance-none font-bold cursor-pointer"
                >
                  <option value="Son Kullanıcı">Son Kullanıcı</option>
                  {kaynaklar.map(k => <option key={k.isim} value={k.isim}>{k.isim}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 3. DETAYLAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Marka / Model</label>
                <input required type="text" placeholder="Örn: Roborock S7" 
                  onChange={(e) => setForm({...form, marka_model: e.target.value})}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-2xl py-3.5 px-4 text-white focus:border-cyan-500 outline-none transition-all font-bold" />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">IMEI / Seri No</label>
                <div className="relative group">
                  <ScanBarcode className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  <input type="text" placeholder="Seri Numarası Giriniz" 
                    onChange={(e) => setForm({...form, imei_no: e.target.value})}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all font-mono font-bold" />
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Arıza / Sorun Açıklaması</label>
            <textarea required rows={3} placeholder="Müşterinin belirttiği sorun..." 
              onChange={(e) => setForm({...form, sorun_aciklamasi: e.target.value})}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none transition-all font-medium resize-none" />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-cyan-900/30 transition-all hover:scale-[1.01] active:scale-95 uppercase tracking-widest text-sm">
            {loading ? "Kayıt Açılıyor..." : <><Save size={20} /> Kaydı Oluştur ve Atölyeye Al</>}
          </button>
        </div>
      </form>
    </div>
  );
}