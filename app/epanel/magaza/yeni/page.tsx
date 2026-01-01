"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, ArrowLeft, UploadCloud, X, Box, ShieldCheck, RefreshCw, 
  Grid, Layers, Wand2, CheckCircle2, AlertCircle, 
  Smartphone, Monitor, Battery, Wifi, Cpu, HardDrive, 
  Zap, Wind, Move, Activity, Globe, DollarSign, Instagram
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE BAĞLANTISI ---
const SUPABASE_URL = "https://cmkjewcpqohkhnfpvoqw.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2pld2NwcW9oa2huZnB2b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDQ2MDIsImV4cCI6MjA4MTkyMDYwMn0.HwgnX8tn9ObFCLgStWWSSHMM7kqc9KqSZI96gpGJ6lw";       

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- KATEGORİYE ÖZEL İKONLAR VE VARSAYILAN DEĞERLER ---
const CATEGORY_SPECS: any = {
  "Cep Telefonu": [
    { id: "screen", label: "EKRAN / DOKUNMATİK", icon: <Smartphone size={24} className="text-cyan-400"/>, default: "Sorunsuz / Orijinal" },
    { id: "battery", label: "BATARYA SAĞLIĞI", icon: <Battery size={24} className="text-green-400"/>, default: "%100 (Orijinal)" },
    { id: "cosmetic", label: "KASA / KOZMETİK", icon: <Layers size={24} className="text-purple-400"/>, default: "10/10 Hatasız" },
    { id: "network", label: "ŞEBEKE / WIFI", icon: <Wifi size={24} className="text-blue-400"/>, default: "Aktif / Test Edildi" }
  ],
  "Robot Süpürge": [
    { id: "mainbrush", label: "ANA FIRÇA / MOTOR", icon: <Wind size={24} className="text-orange-400"/>, default: "Temiz / Güçlü Çekim" },
    { id: "sensors", label: "LIDAR / SENSÖRLER", icon: <Zap size={24} className="text-yellow-400"/>, default: "Sorunsuz Çalışıyor" },
    { id: "battery", label: "BATARYA DURUMU", icon: <Battery size={24} className="text-green-400"/>, default: "Oda Testi Başarılı" },
    { id: "mop", label: "MOP / SU HAZNESİ", icon: <Activity size={24} className="text-blue-400"/>, default: "Sızdırma Yok" }
  ],
  "Bilgisayar": [
    { id: "cpu_temp", label: "ISI DEĞERLERİ", icon: <Cpu size={24} className="text-red-400"/>, default: "Normal (Macun Yeni)" },
    { id: "disk", label: "SSD / HDD SAĞLIK", icon: <HardDrive size={24} className="text-blue-400"/>, default: "%100 Sağlık" },
    { id: "screen_pc", label: "PANEL DURUMU", icon: <Monitor size={24} className="text-cyan-400"/>, default: "Ölü Piksel Yok" },
    { id: "cosmetic", label: "KLAVYE / KASA", icon: <Layers size={24} className="text-slate-400"/>, default: "Tuşlar Tam / Temiz" }
  ],
  "Akıllı Saat": [
    { id: "screen", label: "EKRAN DURUMU", icon: <Smartphone size={24} className="text-cyan-400"/>, default: "Çiziksiz" },
    { id: "battery", label: "PİL ÖMRÜ", icon: <Battery size={24} className="text-green-400"/>, default: "1-2 Gün Gidiyor" },
    { id: "sensors", label: "NABIZ SENSÖRÜ", icon: <Activity size={24} className="text-red-400"/>, default: "Aktif" },
    { id: "strap", label: "KORDON", icon: <Move size={24} className="text-orange-400"/>, default: "Orijinal / Yıpranmamış" }
  ],
  "Default": [
    { id: "gen1", label: "GENEL DURUM", icon: <CheckCircle2 size={24} className="text-green-400"/>, default: "Sorunsuz" },
    { id: "gen2", label: "FONKSİYONLAR", icon: <Zap size={24} className="text-yellow-400"/>, default: "Test Edildi" },
    { id: "gen3", label: "KOZMETİK", icon: <Layers size={24} className="text-purple-400"/>, default: "Çok İyi" },
    { id: "gen4", label: "AKSESUAR", icon: <Box size={24} className="text-blue-400"/>, default: "Tam" }
  ]
};

export default function YeniUrunEkle() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  // State'ler
  const [category, setCategory] = useState("Cep Telefonu");
  const [expertValues, setExpertValues] = useState<any>({});
  const [publicNote, setPublicNote] = useState(""); 
  const [techNote, setTechNote] = useState(""); 

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    condition: "İkinci El (Çok Temiz)",
    price: "",
    cost: "",
    stockCode: "",
    warranty: false,
    box: false,
    exchange: false,
    status: "Satışta",
    images: [] as string[],
    sahibindenLink: "",
    dolapLink: "",
    letgoLink: "",
    instagramLink: ""
  });

  // Kategori değişince Ekspertiz Kutularını Sıfırla/Ayarla
  useEffect(() => {
    const specs = CATEGORY_SPECS[category] || CATEGORY_SPECS["Default"];
    const initialValues: any = {};
    specs.forEach((spec: any) => {
      initialValues[spec.id] = spec.default;
    });
    setExpertValues(initialValues);
  }, [category]);

  const CATEGORIES = [
      "Cep Telefonu", "Robot Süpürge", "Bilgisayar", 
      "Akıllı Saat", "Tablet", "Ekosistem Ürünleri",
      "Aksesuar", "Yedek Parça"
  ];

  // --- ŞABLON OLUŞTURUCU ---
  const handleAutoTemplate = () => {
    const specs = CATEGORY_SPECS[category] || CATEGORY_SPECS["Default"];
    
    // Eksper verilerini metne dök
    let expertText = "";
    specs.forEach((spec: any) => {
        expertText += `- ${spec.label}: ${expertValues[spec.id]}\n`;
    });

    const sablon = `
Merhaba, ürün Aura Bilişim teknik servisimiz tarafından test edilmiştir.
Cihaz kozmetik olarak ${formData.condition} durumdadır.

TEKNİK KONTROLLER:
${expertText}

Ürün tarafımızca garantilidir. Alıcısına şimdiden hayırlı olsun.
    `.trim();

    setPublicNote(sablon);
  };

  // --- FOTOĞRAF YÜKLEME ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 2 * 1024 * 1024) { alert("Resim çok büyük (Max 2MB)"); continue; } 
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
            newImages.push(base64);
        }
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) { alert("İsim ve Fiyat zorunlu!"); return; }
    setLoading(true);

    const finalStockCode = formData.stockCode || `STK-${Math.floor(1000 + Math.random() * 9000)}`;

    const specs = CATEGORY_SPECS[category] || CATEGORY_SPECS["Default"];
    const expertReportFormatted = specs.map((s:any) => `[${s.label}]: ${expertValues[s.id]}`).join("  |  ");

    const combinedDescription = `
Marka: ${formData.brand}
Durum: ${formData.condition}
Garanti: ${formData.warranty ? 'Var' : 'Yok'} | Kutu: ${formData.box ? 'Var' : 'Yok'}
Stok Kodu: ${finalStockCode}
Maliyet: ${formData.cost} TL

--- EKSPERTİZ RAPORU ---
${expertReportFormatted}

--- ÜRÜN AÇIKLAMASI ---
${publicNote}

--- TEKNİSYEN NOTU (GİZLİ) ---
${techNote}

Platform Linkleri:
Sahibinden: ${formData.sahibindenLink}
Dolap: ${formData.dolapLink}
Letgo: ${formData.letgoLink}
Instagram: ${formData.instagramLink}
    `.trim();

    try {
        const { error } = await supabase
            .from('urunler')
            .insert([{
                ad: formData.name,
                fiyat: parseFloat(formData.price),
                kategori: category,
                resim_url: formData.images[0] || "",
                aciklama: combinedDescription,
                stok_durumu: formData.status === "Satışta",
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;
        alert("Ürün Kaydedildi!");
        router.push("/epanel/magaza");
    } catch (error: any) {
        alert("Hata: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  const currentSpecs = CATEGORY_SPECS[category] || CATEGORY_SPECS["Default"];

  return (
    <div className="max-w-[1600px] mx-auto p-6 text-slate-200 pb-20 animate-in slide-in-from-bottom-5">
      
      {/* BAŞLIK */}
      <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
          <button onClick={() => router.back()} className="p-3 bg-slate-800 rounded-xl hover:text-white transition-colors group"><ArrowLeft size={20}/></button>
          <div>
            <h1 className="text-2xl font-black text-white">ÜRÜN & EKSPERTİZ GİRİŞİ</h1>
            <p className="text-xs text-slate-500 font-bold uppercase">AURA TEKNİK SERVİS PANELİ</p>
          </div>
          <div className="ml-auto">
              <button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-900/30 flex items-center gap-2">
                  <Save size={20}/> {loading ? "KAYDEDİLİYOR..." : "YAYINLA"}
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* --- SOL TARA (Görseller & Hızlı Ayarlar) --- */}
          <div className="xl:col-span-3 space-y-6">
              {/* Fotoğraf Alanı */}
              <div className="bg-[#151921] border border-slate-800 rounded-2xl p-4">
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center hover:border-cyan-500/50 cursor-pointer group min-h-[200px]">
                      <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                      <UploadCloud size={32} className="text-slate-500 group-hover:text-cyan-500 mb-2"/>
                      <p className="text-xs font-bold text-slate-400">Görsel Seç</p>
                  </div>
                  {/* Önizleme */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                      {formData.images.map((img, i) => (
                          <img key={i} src={img} className="w-full h-20 object-cover rounded-lg border border-slate-700"/>
                      ))}
                  </div>
              </div>

              {/* Hızlı Tikler */}
              <div className="bg-[#151921] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl cursor-pointer">
                      <input type="checkbox" checked={formData.warranty} onChange={e => setFormData({...formData, warranty: e.target.checked})} className="accent-green-500 w-5 h-5"/>
                      <span className="font-bold text-sm">Garanti Var</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl cursor-pointer">
                      <input type="checkbox" checked={formData.box} onChange={e => setFormData({...formData, box: e.target.checked})} className="accent-orange-500 w-5 h-5"/>
                      <span className="font-bold text-sm">Kutu / Fatura</span>
                  </label>
              </div>
          </div>

          {/* --- ORTA (Ürün Bilgileri ve EKSPERTİZ) --- */}
          <div className="xl:col-span-6 space-y-6">
              
              {/* Temel Bilgiler */}
              <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">KATEGORİ</label>
                          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500">
                              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                          </select>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">MARKA</label>
                          <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white font-bold" placeholder="Apple, Roborock..."/>
                      </div>
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">ÜRÜN BAŞLIĞI</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white font-bold text-lg" placeholder="Örn: iPhone 13 Pro Max - Hatasız"/>
                  </div>
              </div>

              {/* --- GÜNCELLENMİŞ GÖRSEL TASARIMA UYGUN EKSPERTİZ ALANI --- */}
              <div className="bg-[#0f1218] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#1a2e29] flex items-center justify-center text-green-500 border border-green-900/30">
                              <ShieldCheck size={20}/>
                          </div>
                          <div>
                              <h3 className="text-white font-bold text-sm">TEKNİSYEN EKSPERTİZ RAPORU</h3>
                              <p className="text-[10px] text-slate-500">Bu cihaz Aura Bilişim laboratuvarında test edilmiştir.</p>
                          </div>
                      </div>
                  </div>

                  {/* Görseldeki Kutu Tasarımı */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {currentSpecs.map((spec: any) => (
                          <div key={spec.id} className="bg-[#0b0e14] border border-slate-800 rounded-xl p-4 flex flex-col items-center text-center group hover:border-slate-600 transition-all">
                              <div className="mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                  {spec.icon}
                              </div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{spec.label}</label>
                              <input 
                                type="text" 
                                value={expertValues[spec.id] || ""} 
                                onChange={(e) => setExpertValues({...expertValues, [spec.id]: e.target.value})}
                                className="w-full bg-transparent text-center text-white font-bold text-xs outline-none focus:text-cyan-400 transition-colors placeholder:text-slate-700"
                                placeholder="Değer"
                              />
                          </div>
                      ))}
                  </div>
              </div>

              {/* --- AYRI PENCERELER --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Müşteri Açıklaması */}
                  <div className="bg-[#151921] border border-slate-800 rounded-2xl p-5 flex flex-col h-full">
                      <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-white flex items-center gap-2"><Globe size={14} className="text-blue-400"/> MÜŞTERİ AÇIKLAMASI</h4>
                          <button onClick={handleAutoTemplate} className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-all flex items-center gap-1">
                              <Wand2 size={12}/> Şablondan Doldur
                          </button>
                      </div>
                      <textarea 
                        value={publicNote} 
                        onChange={e => setPublicNote(e.target.value)} 
                        className="w-full flex-1 bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-sm text-slate-300 outline-none focus:border-blue-500 resize-none min-h-[120px]"
                        placeholder="İlan sitelerinde görünecek detaylı açıklama..."
                      ></textarea>
                  </div>

                  {/* Teknisyen Özel Notu */}
                  <div className="bg-[#151921] border border-slate-800 rounded-2xl p-5 flex flex-col h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-bl-full pointer-events-none"></div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3"><AlertCircle size={14} className="text-red-400"/> GİZLİ TEKNİSYEN NOTU</h4>
                      <textarea 
                        value={techNote} 
                        onChange={e => setTechNote(e.target.value)} 
                        className="w-full flex-1 bg-[#0b0e14] border border-red-900/30 rounded-xl p-3 text-sm text-red-200/80 outline-none focus:border-red-500 resize-none font-mono min-h-[120px]"
                        placeholder="Müşteri görmez. Örn: Batarya değişti, eski parça rafta..."
                      ></textarea>
                  </div>
              </div>
          </div>

          {/* --- SAĞ (Fiyat & Stok & Platform Linkleri) --- */}
          <div className="xl:col-span-3 space-y-6">
              <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-green-500 flex items-center gap-1"><DollarSign size={12}/> SATIŞ FİYATI</label>
                          <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#0b0e14] border border-green-900/50 rounded-xl p-3 text-green-400 font-black text-2xl text-right outline-none focus:border-green-500"/>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-red-500">MALİYET</label>
                          <input type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full bg-[#0b0e14] border border-red-900/50 rounded-xl p-2 text-red-400 font-bold text-right outline-none focus:border-red-500 text-sm"/>
                      </div>
                      <div className="space-y-1 pt-2 border-t border-white/5">
                          <label className="text-[10px] font-bold text-slate-500">DURUM</label>
                          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-2 text-white text-sm font-bold">
                              <option>Satışta</option>
                              <option>Satıldı</option>
                              <option>Rezerve</option>
                          </select>
                      </div>
                  </div>
              </div>
              
              {/* --- YENİLENMİŞ PLATFORM LİNKLERİ TASARIMI (BADGE SİSTEMİ) --- */}
              <div className="bg-[#151921] border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                     <Globe size={12} className="text-blue-500"/> PLATFORM LİNKLERİ
                  </h3>

                  <div className="space-y-3">
                    
                    {/* Sahibinden - Sarı */}
                    <div className="flex items-center gap-3 group">
                      <div className="w-9 h-9 flex items-center justify-center bg-[#FFD000] rounded-lg shadow-sm shrink-0 transition-transform group-hover:scale-105">
                        <span className="text-black font-extrabold text-lg select-none">S</span>
                      </div>
                      <input 
                        type="text" 
                        value={formData.sahibindenLink}
                        onChange={e => setFormData({...formData, sahibindenLink: e.target.value})}
                        placeholder="Sahibinden İlan Linki" 
                        className="w-full bg-[#0b0e14] text-gray-300 text-xs border border-slate-700 rounded-lg px-3 py-2.5 outline-none focus:border-[#FFD000] transition-all placeholder:text-gray-600"
                      />
                    </div>

                    {/* Dolap - Yeşil */}
                    <div className="flex items-center gap-3 group">
                      <div className="w-9 h-9 flex items-center justify-center bg-[#00D288] rounded-lg shadow-sm shrink-0 transition-transform group-hover:scale-105">
                        <span className="text-white font-extrabold text-lg select-none">D</span>
                      </div>
                      <input 
                        type="text" 
                        value={formData.dolapLink}
                        onChange={e => setFormData({...formData, dolapLink: e.target.value})}
                        placeholder="Dolap İlan Linki" 
                        className="w-full bg-[#0b0e14] text-gray-300 text-xs border border-slate-700 rounded-lg px-3 py-2.5 outline-none focus:border-[#00D288] transition-all placeholder:text-gray-600"
                      />
                    </div>

                    {/* Letgo - Kırmızı */}
                    <div className="flex items-center gap-3 group">
                      <div className="w-9 h-9 flex items-center justify-center bg-[#FF3F55] rounded-lg shadow-sm shrink-0 transition-transform group-hover:scale-105">
                        <span className="text-white font-extrabold text-lg select-none">L</span>
                      </div>
                      <input 
                        type="text" 
                        value={formData.letgoLink}
                        onChange={e => setFormData({...formData, letgoLink: e.target.value})}
                        placeholder="Letgo İlan Linki" 
                        className="w-full bg-[#0b0e14] text-gray-300 text-xs border border-slate-700 rounded-lg px-3 py-2.5 outline-none focus:border-[#FF3F55] transition-all placeholder:text-gray-600"
                      />
                    </div>

                    {/* Instagram - Gradient */}
                    <div className="flex items-center gap-3 group">
                      <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-lg shadow-sm shrink-0 transition-transform group-hover:scale-105">
                        <Instagram className="text-white w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        value={formData.instagramLink}
                        onChange={e => setFormData({...formData, instagramLink: e.target.value})}
                        placeholder="Instagram Gönderi Linki" 
                        className="w-full bg-[#0b0e14] text-gray-300 text-xs border border-slate-700 rounded-lg px-3 py-2.5 outline-none focus:border-purple-500 transition-all placeholder:text-gray-600"
                      />
                    </div>

                  </div>
              </div>

          </div>

      </div>
    </div>
  );
}