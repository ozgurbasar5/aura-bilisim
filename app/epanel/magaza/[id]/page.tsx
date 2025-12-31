"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Trash2, 
  ShoppingBag, Clock, CheckCircle2, Truck, 
  DollarSign, User, MapPin, FileText, Image as ImageIcon, Upload, X, Loader2
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 

export default function UrunDetay() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Ürün State'i
  const [product, setProduct] = useState({
    id: 0,
    name: "",
    brand: "",
    category: "",
    description: "",
    cost: 0,
    price: 0,
    images: [] as string[], // String dizisi (Çoklu Resim)
    status: "Satışta",
    customerName: "",
    customerLocation: "",
    adminNotes: ""
  });

  // 1. Veriyi Çek
  useEffect(() => {
    async function fetchProduct() {
      if (!params?.id) return;
      
      const { data, error } = await supabase
        .from('urunler')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) {
        // images sütunu yoksa veya boşsa, eski resim_url'i kullan
        const imageList = data.images && data.images.length > 0 
            ? data.images 
            : (data.resim_url ? [data.resim_url] : []);

        setProduct({
            id: data.id,
            name: data.ad,
            brand: "", 
            category: data.kategori,
            description: data.aciklama || "",
            cost: data.maliyet || 0,
            price: data.fiyat || 0,
            images: imageList,
            status: (data.stok_durumu === "Satışta" || data.stok_durumu === "true") ? "Satışta" : data.stok_durumu || "Stok Dışı",
            customerName: "", 
            customerLocation: "",
            adminNotes: "" 
        });
      } else {
        alert("Ürün bulunamadı!");
        router.push("/epanel/magaza");
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  // YENİ RESİM YÜKLEME FONKSİYONU
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    try {
        const files = Array.from(e.target.files);
        const newImageUrls: string[] = [];

        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('images') // Bucket adına dikkat et
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(fileName);
            
            newImageUrls.push(publicUrl);
        }

        // Yeni resimleri mevcutların üzerine ekle
        setProduct(prev => ({
            ...prev,
            images: [...prev.images, ...newImageUrls]
        }));

    } catch (error: any) {
        alert("Resim yükleme hatası: " + error.message);
    } finally {
        setUploading(false);
    }
  };

  // RESİM SİLME
  const removeImage = (index: number) => {
      setProduct(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
      }));
  };

  // 2. KAYDET
  const handleSave = async () => {
    setLoading(true);

    const { error } = await supabase
      .from('urunler')
      .update({
        ad: product.name,
        fiyat: Number(product.price),
        maliyet: Number(product.cost),
        kategori: product.category,
        stok_durumu: product.status,
        aciklama: product.description,
        // DİKKAT: Artık hem 'images' sütununa diziyi, hem de 'resim_url'e (eski sistem bozulmasın diye) ilk resmi atıyoruz.
        images: product.images,
        resim_url: product.images.length > 0 ? product.images[0] : ""
      })
      .eq('id', params.id);
    
    setLoading(false);

    if (!error) {
        alert("Değişiklikler başarıyla kaydedildi.");
        router.push("/epanel/magaza"); 
    } else {
        alert("Hata: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu kaydı silmek istediğine emin misin?")) return;
    const { error } = await supabase.from('urunler').delete().eq('id', params.id);
    if (!error) {
        router.push("/epanel/magaza");
    } else {
        alert("Silme hatası: " + error.message);
    }
  };

  const profit = (Number(product.price) || 0) - (Number(product.cost) || 0);
  const margin = product.price > 0 ? ((profit / product.price) * 100).toFixed(1) : "0";

  if (loading && !product.name) return <div className="p-20 text-center text-slate-500 font-bold animate-pulse">Yükleniyor...</div>;

  return (
    <div className="p-6 text-slate-200 pb-20 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* HEADER */}
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
           <button onClick={handleSave} disabled={loading || uploading} className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin"/> : <><Save size={18}/> DEĞİŞİKLİKLERİ KAYDET</>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SOL KOLON */}
        <div className="space-y-6">
           
           {/* DURUM */}
           <div className="bg-[#151921] border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-purple-400 uppercase tracking-wider">
                 <ShoppingBag size={14}/> Ürün Durumu
              </div>
              <div className="grid grid-cols-2 gap-2">
                 {["Satışta", "Kargoda", "Opsiyonlandı", "Satıldı"].map((statusOption) => (
                     <button 
                       key={statusOption}
                       onClick={() => setProduct({...product, status: statusOption})}
                       className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all
                       ${product.status === statusOption 
                           ? (statusOption === "Satışta" ? "bg-green-500 border-green-400 text-white" 
                           : statusOption === "Kargoda" ? "bg-blue-500 border-blue-400 text-white"
                           : statusOption === "Opsiyonlandı" ? "bg-orange-500 border-orange-400 text-white"
                           : "bg-slate-200 border-white text-black")
                           : "bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800"}`}
                     >
                        {statusOption === "Satışta" && <ShoppingBag size={18}/>}
                        {statusOption === "Kargoda" && <Truck size={18}/>}
                        {statusOption === "Opsiyonlandı" && <Clock size={18}/>}
                        {statusOption === "Satıldı" && <CheckCircle2 size={18}/>}
                        {statusOption.toUpperCase()}
                     </button>
                 ))}
              </div>
           </div>

           {/* FİYAT */}
           <div className="bg-[#151921] border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-green-400 uppercase tracking-wider">
                 <DollarSign size={14}/> Fiyatlandırma
              </div>
              <div className="space-y-4">
                  <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">SATIŞ FİYATI (TL)</label>
                      <input type="number" value={product.price} onChange={(e) => setProduct({...product, price: Number(e.target.value)})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white text-lg font-bold outline-none focus:border-green-500 transition-colors" />
                  </div>
                  <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">MALİYET (TL)</label>
                      <input type="number" value={product.cost} onChange={(e) => setProduct({...product, cost: Number(e.target.value)})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-slate-400 outline-none focus:border-purple-500 transition-colors" />
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-bold">NET KÂR</span>
                      <span className={`text-xl font-black ${profit > 0 ? 'text-green-400' : 'text-red-500'}`}>{profit.toLocaleString()} ₺</span>
                  </div>
              </div>
           </div>

           {/* --- YENİ ÇOKLU GÖRSEL YÜKLEME ALANI --- */}
           <div className="bg-[#151921] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                     <ImageIcon size={14}/> Ürün Görselleri
                  </div>
                  <span className="text-[10px] text-slate-500">{product.images.length} Görsel</span>
              </div>
              
              {/* Resim Listesi */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                  {product.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group">
                          <img src={img} className="w-full h-full object-cover"/>
                          <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={12}/>
                          </button>
                      </div>
                  ))}
                  
                  {/* Yükleme Butonu */}
                  <div className="relative aspect-square bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors cursor-pointer">
                      {uploading ? <Loader2 className="animate-spin"/> : <Upload size={24}/>}
                      <span className="text-[9px] font-bold mt-1 uppercase">EKLE</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer"/>
                  </div>
              </div>
           </div>

        </div>

        {/* SAĞ KOLON */}
        <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-[#151921] border border-slate-800 p-6 rounded-2xl h-fit">
                <div className="flex items-center gap-2 mb-6 text-xs font-bold text-yellow-500 uppercase tracking-wider">
                   <FileText size={14}/> Yönetici Notları & Müşteri Bilgisi
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">MÜŞTERİ AD SOYAD</label>
                        <input type="text" value={product.customerName || ""} onChange={(e) => setProduct({...product, customerName: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-yellow-500" />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">KONUM</label>
                        <input type="text" value={product.customerLocation || ""} onChange={(e) => setProduct({...product, customerLocation: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-yellow-500" />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">ÖZEL NOTLAR</label>
                    <textarea rows={4} value={product.adminNotes || ""} onChange={(e) => setProduct({...product, adminNotes: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none focus:border-yellow-500 resize-none"></textarea>
                </div>
            </div>

            <div className="bg-[#151921] border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                   Genel İlan Bilgileri
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">ÜRÜN ADI</label>
                        <input type="text" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-purple-500" />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">MARKA</label>
                        <input type="text" value={product.brand || ""} onChange={(e) => setProduct({...product, brand: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-purple-500" />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">AÇIKLAMA</label>
                    <textarea rows={5} value={product.description || ""} onChange={(e) => setProduct({...product, description: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none focus:border-purple-500"></textarea>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
}