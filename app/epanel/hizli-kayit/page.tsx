"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, User, Phone, Smartphone, PenTool, AlertCircle, Zap, Watch, Laptop, Box } from "lucide-react";
import { getWorkshopFromStorage, saveWorkshopToStorage } from "@/utils/storage";

export default function HizliKayitSayfasi() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    category: "Cep Telefonu",
    device: "",
    serialNo: "",
    issue: ""
  });

  // Kategoriye Göre Hazır Şikayet Şablonları (GELİŞTİRİLDİ)
  const QUICK_ISSUES: any = {
      "Cep Telefonu": ["Ekran Kırık", "Şarj Almıyor", "Sıvı Temas", "Ses Gelmiyor", "Batarya Değişimi"],
      "Robot Süpürge": ["Lidar Hatası", "Tekerlek Sıkışık", "Su Vermiyor", "Fan Arızası", "Şarj Olmuyor"],
      "Bilgisayar": ["Açılmıyor", "Mavi Ekran", "Isınma Sorunu", "Yavaşlama", "Ekran Kırık"],
      "Akıllı Saat": ["Dokunmatik Çalışmıyor", "Eşleşme Sorunu", "Kordon Koptu", "Su Kaçırdı"],
      "Diğer": ["Genel Arıza", "Bakım İsteği", "Fiziksel Hasar"]
  };

  const handleSave = () => {
    if (!formData.customer || !formData.device || !formData.issue) {
      alert("Lütfen zorunlu alanları (Müşteri, Cihaz, Arıza) doldurun!");
      return;
    }

    const allJobs = getWorkshopFromStorage();
    let randomId = Math.floor(100000 + Math.random() * 900000);
    // ID Çakışma Kontrolü
    while (allJobs.some((job: any) => job.id === randomId)) {
        randomId = Math.floor(100000 + Math.random() * 900000);
    }

    const newJob = {
      id: randomId,
      date: new Date().toLocaleDateString('tr-TR'),
      status: "Bekliyor",
      price: 0,
      cost: 0,
      customerType: "Son Kullanıcı",
      notes: "",
      accessories: [],
      preCheck: [],
      finalCheck: [],
      ...formData
    };

    saveWorkshopToStorage([newJob, ...allJobs]);
    
    // Kayıt sonrası direkt o kaydın içine git (Daha profesyonel)
    router.push(`/epanel/atolye/${randomId}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-slate-200 animate-in fade-in zoom-in-95 duration-300">
      
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <div className="p-3 bg-cyan-500 rounded-xl shadow-lg shadow-cyan-500/30">
                <PenTool className="text-white" size={24}/>
            </div>
            HIZLI KAYIT AÇ
          </h1>
          <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 font-bold uppercase">HIZLI SERVİS MODU</p>
              <p className="text-[10px] text-slate-600">Minimum veri girişi ile maksimum hız.</p>
          </div>
      </div>

      <div className="bg-[#151921] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Dekoratif Efekt */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

        {/* 1. MÜŞTERİ BİLGİLERİ */}
        <div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={16} className="text-cyan-500"/> Müşteri Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                    <label className="text-[10px] font-bold text-slate-400 group-focus-within:text-cyan-500 transition-colors mb-1 block">AD SOYAD</label>
                    <input type="text" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all font-bold placeholder:font-normal" placeholder="Müşteri Adı Giriniz"/>
                </div>
                <div className="group">
                    <label className="text-[10px] font-bold text-slate-400 group-focus-within:text-cyan-500 transition-colors mb-1 block">TELEFON</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all font-mono" placeholder="05XX XXX XX XX"/>
                </div>
            </div>
        </div>

        <div className="w-full h-[1px] bg-slate-800/50"></div>

        {/* 2. CİHAZ BİLGİLERİ */}
        <div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Smartphone size={16} className="text-purple-500"/> Cihaz Bilgileri</h3>
            
            {/* Kategori Seçimi (Görsel Butonlar) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
                {Object.keys(QUICK_ISSUES).map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setFormData({...formData, category: cat})}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.category === cat ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30 scale-105' : 'bg-[#0b0e14] border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}
                    >
                        {cat === "Cep Telefonu" ? <Smartphone size={20}/> : cat === "Robot Süpürge" ? <Zap size={20}/> : cat === "Bilgisayar" ? <Laptop size={20}/> : cat === "Akıllı Saat" ? <Watch size={20}/> : <Box size={20}/>}
                        <span className="text-[10px] font-bold">{cat}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                    <label className="text-[10px] font-bold text-slate-400 group-focus-within:text-purple-500 transition-colors mb-1 block">MARKA / MODEL</label>
                    <input type="text" value={formData.device} onChange={e => setFormData({...formData, device: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-purple-500 transition-all font-bold placeholder:font-normal" placeholder="Örn: iPhone 13, Roborock S7"/>
                </div>
                <div className="group">
                    <label className="text-[10px] font-bold text-slate-400 group-focus-within:text-purple-500 transition-colors mb-1 block">SERİ NO / IMEI</label>
                    <input type="text" value={formData.serialNo} onChange={e => setFormData({...formData, serialNo: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-purple-500 transition-all font-mono" placeholder="Opsiyonel"/>
                </div>
            </div>
        </div>

        <div className="w-full h-[1px] bg-slate-800/50"></div>

        {/* 3. ARIZA VE ŞİKAYET */}
        <div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertCircle size={16} className="text-red-500"/> Şikayet & Arıza</h3>
            
            {/* Hızlı Şikayet Seçimi (Tagler) */}
            <div className="flex flex-wrap gap-2 mb-3">
                {QUICK_ISSUES[formData.category]?.map((issue: string) => (
                    <button 
                        key={issue} 
                        onClick={() => setFormData({...formData, issue: issue})}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors active:scale-95"
                    >
                        {issue}
                    </button>
                ))}
            </div>

            <textarea value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.15)] h-32 resize-none transition-all placeholder:text-slate-600 font-medium" placeholder="Müşterinin belirttiği sorun..."></textarea>
        </div>

        {/* KAYDET BUTONU */}
        <button onClick={handleSave} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-cyan-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg group">
            <Save size={24} className="group-hover:rotate-12 transition-transform"/> 
            KAYDI OLUŞTUR
        </button>

      </div>
    </div>
  );
}