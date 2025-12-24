"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, Image as ImageIcon, Tag, Globe, DollarSign, ArrowLeft, 
  UploadCloud, X, Box, ShieldCheck, RefreshCw, Instagram, 
  Smartphone, Zap, Laptop, Watch, Grid, Layers
} from "lucide-react";

export default function YeniUrunEkle() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Cep Telefonu",
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
    sahibindenNo: "",
    dolapLink: "",
    dolapNo: "",
    letgoLink: "",
    instagramLink: "",
    notes: ""
  });

  // --- GÜNCELLENMİŞ KATEGORİ LİSTESİ ---
  const CATEGORIES = [
      "Cep Telefonu", "Robot Süpürge", "Bilgisayar", 
      "Akıllı Saat", "Tablet", "Ekosistem Ürünleri", // Yeni Eklendi
      "Aksesuar", "Yedek Parça / Outlet"
  ];

  const CONDITIONS = ["Sıfır (Kapalı Kutu)", "İkinci El (Çok Temiz)", "İkinci El (Orta)", "Yenilenmiş", "Outlet / Hasarlı", "Yedek Parça"];

  // --- ÇOKLU RESİM YÜKLEME ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 5 * 1024 * 1024) continue; 
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

  const removeImage = (indexToRemove: number) => {
      setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, index) => index !== indexToRemove)
      }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) {
        alert("Ürün adı, kategori ve fiyat zorunludur!");
        return;
    }
    
    if (formData.images.length === 0) {
        alert("En az 1 adet ürün görseli yüklemelisiniz!");
        return;
    }

    setLoading(true);

    const existing = JSON.parse(localStorage.getItem("aura_store_products") || "[]");
    const finalStockCode = formData.stockCode || `STK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProduct = {
        id: Date.now(),
        dateAdded: new Date().toLocaleDateString('tr-TR'),
        ...formData,
        stockCode: finalStockCode
    };

    try {
        localStorage.setItem("aura_store_products", JSON.stringify([newProduct, ...existing]));
        setTimeout(() => {
            alert("Ürün Başarıyla Yayınlandı!");
            router.push("/epanel/magaza");
        }, 500);
    } catch (error) {
        alert("Hata: Görseller çok büyük olduğu için kaydedilemedi.");
        setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 text-slate-200 pb-20 animate-in slide-in-from-bottom-5">
      
      {/* BAŞLIK */}
      <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
          <button onClick={() => router.back()} className="p-3 bg-slate-800 rounded-xl hover:text-white transition-colors group"><ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/></button>
          <div>
            <h1 className="text-2xl font-black text-white">YENİ ÜRÜN GİRİŞİ</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">AURA STORE YÖNETİM</p>
          </div>
          <div className="ml-auto">
              <button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-900/30 transition-all active:scale-95 flex items-center gap-2">
                  <Save size={20}/> {loading ? "KAYDEDİLİYOR..." : "YAYINLA"}
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* --- SOL KOLON: GÖRSELLER & HIZLI ÖZELLİKLER (4 Birim) --- */}
          <div className="xl:col-span-4 space-y-6">
              
              {/* Fotoğraf Yükleme */}
              <div className="bg-[#151921] border border-slate-800 rounded-2xl p-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer group min-h-[250px]"
                  >
                      <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                      <div className="p-4 bg-slate-800 rounded-full mb-3 group-hover:bg-cyan-600 group-hover:text-white transition-colors shadow-lg"><UploadCloud size={32}/></div>
                      <p className="font-bold text-sm text-slate-300 group-hover:text-white">Görsel Yükle</p>
                      <p className="text-[10px] text-slate-500 mt-1">Sürükle bırak veya seç</p>
                  </div>

                  {/* Yüklenenler */}
                  {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                          {formData.images.map((img, index) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group">
                                  <img src={img} className="w-full h-full object-cover" />
                                  <button onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"><X size={12}/></button>
                                  {index === 0 && <span className="absolute bottom-0 w-full bg-cyan-600 text-white text-[8px] font-bold text-center py-0.5">KAPAK</span>}
                              </div>
                          ))}
                      </div>
                  )}
              </div>

              {/* Hızlı Özellikler (Tikler) */}
              <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><Tag size={14}/> ÖNE ÇIKAN ÖZELLİKLER</h4>
                  
                  <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5 cursor-pointer hover:border-green-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${formData.warranty ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500'}`}><ShieldCheck size={18}/></div>
                          <span className="text-sm font-bold">Garanti Mevcut</span>
                      </div>
                      <input type="checkbox" checked={formData.warranty} onChange={(e) => setFormData({...formData, warranty: e.target.checked})} className="w-5 h-5 accent-green-500"/>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5 cursor-pointer hover:border-orange-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${formData.box ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'}`}><Box size={18}/></div>
                          <span className="text-sm font-bold">Kutu / Fatura</span>
                      </div>
                      <input type="checkbox" checked={formData.box} onChange={(e) => setFormData({...formData, box: e.target.checked})} className="w-5 h-5 accent-orange-500"/>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5 cursor-pointer hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${formData.exchange ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}><RefreshCw size={18}/></div>
                          <span className="text-sm font-bold">Takas İmkanı</span>
                      </div>
                      <input type="checkbox" checked={formData.exchange} onChange={(e) => setFormData({...formData, exchange: e.target.checked})} className="w-5 h-5 accent-blue-500"/>
                  </label>
              </div>
          </div>

          {/* --- ORTA KOLON: ÜRÜN KÜNYESİ (4 Birim) --- */}
          <div className="xl:col-span-4 space-y-6">
              <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6 space-y-5 h-full">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/5 pb-4"><Layers size={16} className="text-cyan-500"/> Ürün Künyesi</h3>
                  
                  <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">ÜRÜN BAŞLIĞI</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-cyan-500 transition-all font-bold" placeholder="Örn: iPhone 13 Pro 128GB - Hatasız"/>
                  </div>

                  <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">KATEGORİ</label>
                      <div className="relative">
                          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-cyan-500 cursor-pointer text-sm appearance-none font-bold">
                              {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                          </select>
                          <Grid className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16}/>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">MARKA</label>
                          <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-cyan-500 transition-all font-bold text-sm" placeholder="Apple..."/>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">STOK KODU</label>
                          <input type="text" value={formData.stockCode} onChange={e => setFormData({...formData, stockCode: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-cyan-500 transition-all font-mono text-sm" placeholder="Otomatik"/>
                      </div>
                  </div>

                  <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">KONDİSYON</label>
                      <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-cyan-500 cursor-pointer text-sm font-bold">
                          {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                      </select>
                  </div>

                  <div className="space-y-1 flex-1 flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500">ÜRÜN AÇIKLAMASI</label>
                      <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-cyan-500 flex-1 resize-none transition-all placeholder:text-slate-600 text-sm leading-relaxed min-h-[150px]" placeholder="Cihazın kozmetik durumu, pil sağlığı vb. detayları buraya yazınız..."></textarea>
                  </div>
              </div>
          </div>

          {/* --- SAĞ KOLON: FİYAT & ENTEGRASYON (4 Birim) --- */}
          <div className="xl:col-span-4 space-y-6">
              
              {/* Fiyatlandırma */}
              <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/5 pb-4"><DollarSign size={16} className="text-green-500"/> Değerleme</h3>
                  
                  <div className="space-y-1">
                      <label className="text-[10px] font-bold text-green-500">SATIŞ FİYATI (TL)</label>
                      <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#0b0e14] border border-green-900/50 rounded-xl p-4 text-green-400 font-black text-right outline-none focus:border-green-500 text-2xl placeholder:text-green-900" placeholder="0"/>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-red-500">MALİYET</label>
                          <input type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full bg-[#0b0e14] border border-red-900/50 rounded-xl p-2.5 text-red-400 font-bold text-right outline-none focus:border-red-500 text-sm" placeholder="0"/>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">DURUM</label>
                          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 cursor-pointer text-sm font-bold">
                              <option>Satışta</option><option>Rezerve</option><option>Satıldı</option>
                          </select>
                      </div>
                  </div>
              </div>

              {/* Platform Entegrasyonu */}
              <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2 mb-2"><Globe size={14} className="text-blue-500"/> Platform Linkleri</h3>
                  
                  <div className="flex gap-2 items-center">
                      <div className="w-9 h-9 bg-[#F9C305] text-black flex items-center justify-center rounded-lg font-black text-xs shrink-0">S</div>
                      <input type="text" value={formData.sahibindenLink} onChange={e => setFormData({...formData, sahibindenLink: e.target.value})} className="flex-1 bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-[#F9C305] outline-none transition-colors" placeholder="Sahibinden İlan Linki"/>
                  </div>

                  <div className="flex gap-2 items-center">
                      <div className="w-9 h-9 bg-[#00D678] text-white flex items-center justify-center rounded-lg font-black text-xs shrink-0">D</div>
                      <input type="text" value={formData.dolapLink} onChange={e => setFormData({...formData, dolapLink: e.target.value})} className="flex-1 bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-[#00D678] outline-none transition-colors" placeholder="Dolap İlan Linki"/>
                  </div>

                  <div className="flex gap-2 items-center">
                      <div className="w-9 h-9 bg-[#FF3C4C] text-white flex items-center justify-center rounded-lg font-black text-xs shrink-0">L</div>
                      <input type="text" value={formData.letgoLink} onChange={e => setFormData({...formData, letgoLink: e.target.value})} className="flex-1 bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-[#FF3C4C] outline-none transition-colors" placeholder="Letgo İlan Linki"/>
                  </div>

                  <div className="flex gap-2 items-center">
                      <div className="w-9 h-9 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 text-white flex items-center justify-center rounded-lg font-black text-xs shrink-0"><Instagram size={16}/></div>
                      <input type="text" value={formData.instagramLink} onChange={e => setFormData({...formData, instagramLink: e.target.value})} className="flex-1 bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-purple-500 outline-none transition-colors" placeholder="Instagram Gönderi Linki"/>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
}