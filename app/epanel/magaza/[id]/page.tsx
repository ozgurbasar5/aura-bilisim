"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Trash2, 
  ShoppingBag, Clock, CheckCircle2, Truck, 
  DollarSign, User, MapPin, FileText 
} from "lucide-react";

export default function UrunDetay() {
  const router = useRouter();
  const params = useParams(); // URL'den ID'yi al (örn: 176653...)
  const [loading, setLoading] = useState(true);

  // Ürün State'i
  const [product, setProduct] = useState({
    id: 0,
    name: "",
    brand: "",
    category: "",
    description: "",
    cost: 0,
    price: 0,
    images: [] as string[],
    status: "Satışta", // Varsayılan
    
    // Müşteri & Teslimat Bilgileri
    customerName: "",
    customerLocation: "",
    adminNotes: ""
  });

  // 1. Veriyi LocalStorage'dan Çek
  useEffect(() => {
    if (params.id) {
      const stored = JSON.parse(localStorage.getItem("aura_store_products") || "[]");
      const found = stored.find((p: any) => p.id == params.id);
      
      if (found) {
        setProduct(found);
      } else {
        alert("Ürün bulunamadı!");
        router.push("/epanel/magaza");
      }
      setLoading(false);
    }
  }, [params.id, router]);

  // 2. Değişiklikleri Kaydet (Dashboard'u Günceller)
  const handleSave = () => {
    const stored = JSON.parse(localStorage.getItem("aura_store_products") || "[]");
    
    // Mevcut listeyi güncelle
    const updatedList = stored.map((p: any) => {
      if (p.id == product.id) {
        return product; // Güncel haliyle değiştir
      }
      return p;
    });

    localStorage.setItem("aura_store_products", JSON.stringify(updatedList));
    
    // Dashboard anlık görsün diye event fırlat
    window.dispatchEvent(new Event("storage"));
    
    alert("Değişiklikler başarıyla kaydedildi ve sisteme işlendi.");
    router.push("/epanel/magaza"); // Listeye dön
  };

  // 3. Ürünü Sil
  const handleDelete = () => {
    if (!confirm("Bu kaydı ve tüm geçmişini silmek istediğine emin misin?")) return;

    const stored = JSON.parse(localStorage.getItem("aura_store_products") || "[]");
    const filtered = stored.filter((p: any) => p.id != product.id);
    
    localStorage.setItem("aura_store_products", JSON.stringify(filtered));
    window.dispatchEvent(new Event("storage"));
    
    router.push("/epanel/magaza");
  };

  // Otomatik Hesaplamalar
  const profit = (Number(product.price) || 0) - (Number(product.cost) || 0);
  const margin = product.price > 0 ? ((profit / product.price) * 100).toFixed(1) : "0";

  if (loading) return <div className="p-10 text-slate-500">Yükleniyor...</div>;

  return (
    <div className="p-6 text-slate-200 pb-20 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => router.back()} className="p-3 bg-[#151921] border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
             <ArrowLeft size={20} className="text-slate-400"/>
          </button>
          <div>
             <h1 className="text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
               {product.name} <span className="text-xs bg-slate-800 text-slate-500 px-2 py-1 rounded font-mono">#{product.id}</span>
             </h1>
             <p className="text-xs text-slate-500 font-bold mt-1">ÜRÜN YÖNETİM & SATIŞ EKRANI</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
           <button onClick={handleDelete} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-red-900/20 text-red-500 font-bold border border-red-900/30 hover:bg-red-900/40 flex items-center justify-center gap-2 transition-colors">
              <Trash2 size={18}/> SİL
           </button>
           <button onClick={handleSave} className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-colors">
              <Save size={18}/> DEĞİŞİKLİKLERİ KAYDET
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- SOL KOLON (Durum & Fiyat & Görsel) --- */}
        <div className="space-y-6">
           
           {/* 1. ÜRÜN DURUMU (STATUS) */}
           <div className="bg-[#151921] border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-purple-400 uppercase tracking-wider">
                 <ShoppingBag size={14}/> Ürün Durumu
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <button 
                    onClick={() => setProduct({...product, status: "Satışta"})}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all
                    ${product.status === "Satışta" ? "bg-green-500 text-white border-green-400 shadow-lg shadow-green-900/40" : "bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800"}`}
                 >
                    <ShoppingBag size={18}/> SATIŞTA
                 </button>

                 <button 
                    onClick={() => setProduct({...product, status: "Kargoda"})}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all
                    ${product.status === "Kargoda" ? "bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-900/40" : "bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800"}`}
                 >
                    <Truck size={18}/> KARGODA
                 </button>

                 <button 
                    onClick={() => setProduct({...product, status: "Opsiyonlandı"})}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all
                    ${product.status === "Opsiyonlandı" ? "bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-900/40" : "bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800"}`}
                 >
                    <Clock size={18}/> OPSİYON
                 </button>

                 <button 
                    onClick={() => setProduct({...product, status: "Satıldı"})}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all
                    ${product.status === "Satıldı" ? "bg-slate-200 text-black border-white shadow-lg" : "bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800"}`}
                 >
                    <CheckCircle2 size={18}/> SATILDI
                 </button>
              </div>
           </div>

           {/* 2. FİYATLANDIRMA */}
           <div className="bg-[#151921] border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-green-400 uppercase tracking-wider">
                 <DollarSign size={14}/> Fiyatlandırma
              </div>
              
              <div className="space-y-4">
                  <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">SATIŞ FİYATI (TL)</label>
                      <input 
                        type="number" 
                        value={product.price}
                        onChange={(e) => setProduct({...product, price: Number(e.target.value)})}
                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white text-lg font-bold outline-none focus:border-green-500 transition-colors"
                      />
                  </div>
                  <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">MALİYET (TL)</label>
                      <input 
                        type="number" 
                        value={product.cost}
                        onChange={(e) => setProduct({...product, cost: Number(e.target.value)})}
                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-slate-400 outline-none focus:border-purple-500 transition-colors"
                      />
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-bold">NET KÂR</span>
                      <span className={`text-xl font-black ${profit > 0 ? 'text-green-400' : 'text-red-500'}`}>{profit.toLocaleString()} ₺</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-bold">KÂR MARJI</span>
                      <span className="text-sm font-mono text-slate-300">%{margin}</span>
                  </div>
              </div>
           </div>

           {/* 3. GÖRSEL */}
           <div className="bg-[#151921] border border-slate-800 rounded-2xl overflow-hidden h-64 flex items-center justify-center relative group">
              {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} className="w-full h-full object-cover" alt="Product"/>
              ) : (
                  <div className="text-slate-600 flex flex-col items-center">
                      <ShoppingBag size={48}/>
                      <span className="text-xs mt-2">Görsel Yok</span>
                  </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="text-xs bg-white text-black px-4 py-2 rounded-lg font-bold">Görsel Değiştir</button>
              </div>
           </div>

        </div>

        {/* --- SAĞ KOLON (Müşteri & Detaylar) --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 4. YÖNETİCİ NOTLARI & MÜŞTERİ BİLGİSİ */}
            <div className="bg-[#151921] border border-slate-800 p-6 rounded-2xl h-fit">
                <div className="flex items-center gap-2 mb-6 text-xs font-bold text-yellow-500 uppercase tracking-wider">
                   <FileText size={14}/> Yönetici Notları & Müşteri Bilgisi
                </div>
                <p className="text-[10px] text-slate-500 mb-4">
                    Bu alan sadece yönetim panelinde görünür. Ürün satıldığında müşteri bilgilerini, adresini veya cihazın özel kusurlarını buraya not alabilirsin.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1 flex items-center gap-1"><User size={10}/> MÜŞTERİ AD SOYAD</label>
                        <input 
                            type="text" 
                            placeholder="Satıldıysa müşteri adı..."
                            value={product.customerName || ""}
                            onChange={(e) => setProduct({...product, customerName: e.target.value})}
                            className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-yellow-500 placeholder:text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1 flex items-center gap-1"><MapPin size={10}/> TESLİMAT ADRESİ / KONUM</label>
                        <input 
                            type="text" 
                            placeholder="Kargo adresi veya elden teslim..."
                            value={product.customerLocation || ""}
                            onChange={(e) => setProduct({...product, customerLocation: e.target.value})}
                            className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-yellow-500 placeholder:text-slate-700"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">ÖZEL DETAYLI NOTLAR</label>
                    <textarea 
                        rows={4}
                        placeholder="Örn: Cihazın altında kılcal çizik var, müşteri biliyor. 3 Taksit yapıldı..."
                        value={product.adminNotes || ""}
                        onChange={(e) => setProduct({...product, adminNotes: e.target.value})}
                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none focus:border-yellow-500 placeholder:text-slate-700 resize-none"
                    ></textarea>
                </div>
            </div>

            {/* 5. GENEL İLAN BİLGİLERİ */}
            <div className="bg-[#151921] border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                   Genel İlan Bilgileri
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">ÜRÜN ADI</label>
                        <input 
                            type="text" 
                            value={product.name}
                            onChange={(e) => setProduct({...product, name: e.target.value})}
                            className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">MARKA</label>
                        <input 
                            type="text" 
                            value={product.brand || ""}
                            onChange={(e) => setProduct({...product, brand: e.target.value})}
                            className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-purple-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">HALKA AÇIK AÇIKLAMA</label>
                    <textarea 
                        rows={5}
                        value={product.description || ""}
                        onChange={(e) => setProduct({...product, description: e.target.value})}
                        className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none focus:border-purple-500"
                    ></textarea>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
}