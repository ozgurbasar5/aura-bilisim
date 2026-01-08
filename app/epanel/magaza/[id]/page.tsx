"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Trash2, 
  ShoppingBag, Clock, CheckCircle2, Truck, 
  DollarSign, FileText, Image as ImageIcon, Upload, X, Loader2,
  Globe, Instagram, ExternalLink
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE BAĞLANTISI (Senin verdiğin bilgiler) ---
const SUPABASE_URL = "https://cmkjewcpqohkhnfpvoqw.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2pld2NwcW9oa2huZnB2b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDQ2MDIsImV4cCI6MjA4MTkyMDYwMn0.HwgnX8tn9ObFCLgStWWSSHMM7kqc9KqSZI96gpGJ6lw";       

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function UrunDetayPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // --- ANA STATE ---
  const [product, setProduct] = useState({
    id: 0,
    name: "",
    category: "",
    description: "", // Görünen temiz açıklama
    cost: 0,
    price: 0,
    images: [] as string[],
    status: "Satışta",
    customerName: "",
    customerLocation: "",
    adminNotes: "",
    // Linkler (Ayrıştırılmış)
    sahibindenLink: "",
    dolapLink: "",
    letgoLink: "",
    instagramLink: ""
  });

  // --- 1. VERİYİ ÇEK VE AYRIŞTIR (DECODER) ---
  useEffect(() => {
    async function fetchProduct() {
      // ID kontrolü (Next.js sürümüne göre array veya string gelebilir)
      const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (!productId) return;
      
      const { data, error } = await supabase
        .from('urunler')
        .select('*')
        .eq('id', productId)
        .single();

      if (data) {
        // Resim formatı kontrolü (Dizi mi string mi?)
        let imageList: string[] = [];
        if (data.images && Array.isArray(data.images)) {
            imageList = data.images;
        } else if (data.resim_url) {
            imageList = [data.resim_url];
        }

        // --- REGEX İLE LİNKLERİ AYIKLA ---
        const fullDesc = data.aciklama || "";
        
        // Linkleri buluyoruz
        const sLink = fullDesc.match(/Sahibinden:\s*(https?:\/\/[^\s]+)/)?.[1] || "";
        const dLink = fullDesc.match(/Dolap:\s*(https?:\/\/[^\s]+)/)?.[1] || "";
        const lLink = fullDesc.match(/Letgo:\s*(https?:\/\/[^\s]+)/)?.[1] || "";
        const iLink = fullDesc.match(/Instagram:\s*(https?:\/\/[^\s]+)/)?.[1] || "";

        // Ekranda karmaşa olmasın diye "Platform Linkleri:" yazısından öncesini alıyoruz.
        const cleanDesc = fullDesc.split("Platform Linkleri:")[0].trim();

        setProduct({
            id: data.id,
            name: data.ad,
            category: data.kategori,
            description: cleanDesc,
            cost: data.maliyet || 0,
            price: data.fiyat || 0,
            images: imageList,
            status: (data.stok_durumu === "Satışta" || data.stok_durumu === "true") ? "Satışta" : data.stok_durumu || "Stok Dışı",
            customerName: "", 
            customerLocation: "",
            adminNotes: "",
            sahibindenLink: sLink,
            dolapLink: dLink,
            letgoLink: lLink,
            instagramLink: iLink
        });
      } else {
        alert("Ürün bulunamadı!");
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params]);

  // --- RESİM YÜKLEME ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
        const files = Array.from(e.target.files);
        const newImageUrls: string[] = [];
        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
            newImageUrls.push(publicUrl);
        }
        setProduct(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
    } catch (error: any) {
        alert("Resim yükleme hatası: " + error.message);
    } finally {
        setUploading(false);
    }
  };

  const removeImage = (index: number) => {
      setProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // --- 2. KAYDETME (ENCODER) ---
  const handleSave = async () => {
    setLoading(true);

    // Açıklama ve Linkleri "Yeni Ürün" sayfasındaki formatla birleştiriyoruz
    const combinedDescription = `
${product.description}

Platform Linkleri:
${product.sahibindenLink ? 'Sahibinden: ' + product.sahibindenLink : ''}
${product.dolapLink ? 'Dolap: ' + product.dolapLink : ''}
${product.letgoLink ? 'Letgo: ' + product.letgoLink : ''}
${product.instagramLink ? 'Instagram: ' + product.instagramLink : ''}
    `.trim();

    const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const { error } = await supabase
      .from('urunler')
      .update({
        ad: product.name,
        fiyat: Number(product.price),
        maliyet: Number(product.cost),
        kategori: product.category,
        stok_durumu: product.status,
        aciklama: combinedDescription, // Paketlenmiş veri
        images: product.images,
        // Eski sistem uyumluluğu için ilk resmi ayrıca kaydediyoruz
        resim_url: product.images.length > 0 ? product.images[0] : ""
      })
      .eq('id', productId);
    
    setLoading(false);

    if (!error) {
        alert("Kayıt Başarılı!");
    } else {
        alert("Hata: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;
    const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const { error } = await supabase.from('urunler').delete().eq('id', productId);
    if (!error) router.push("/epanel/magaza");
    else alert("Silme hatası: " + error.message);
  };

  const profit = (Number(product.price) || 0) - (Number(product.cost) || 0);

  if (loading) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-slate-500 font-bold animate-pulse">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-4 md:p-8 pb-32 animate-in fade-in duration-300">
      
      {/* ÜST BAR */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => router.back()} className="p-3 bg-[#151921] border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors group">
             <ArrowLeft size={20} className="text-slate-400 group-hover:-translate-x-1 transition-transform"/>
          </button>
          <div>
             <h1 className="text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
               {product.name}
             </h1>
             <p className="text-xs text-slate-500 font-bold mt-1">STOK KARTI DÜZENLEME: #{product.id}</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
           <button onClick={handleDelete} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-red-900/10 text-red-500 font-bold border border-red-900/20 hover:bg-red-900/30 flex items-center justify-center gap-2 transition-colors">
              <Trash2 size={18}/> SİL
           </button>
           <button onClick={handleSave} disabled={loading || uploading} className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100">
              {loading ? <Loader2 className="animate-spin"/> : <><Save size={18}/> GÜNCELLE</>}
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- SOL KOLON (Görsel & Durum & Canlı Linkler) --- */}
        <div className="space-y-6">

           {/* 1. CANLI LİNK BUTONLARI (VİTRİN) */}
           <div className="bg-[#151921] border border-slate-800 p-4 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><ExternalLink size={12}/> AKTİF İLAN LİNKLERİ</h3>
              
              <div className="grid grid-cols-4 gap-2">
                  {/* Sahibinden */}
                  <a href={product.sahibindenLink || "#"} target={product.sahibindenLink ? "_blank" : "_self"}
                     className={`flex flex-col items-center justify-center h-20 rounded-xl transition-all border border-transparent ${product.sahibindenLink ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black hover:scale-105 shadow-lg shadow-yellow-500/20' : 'bg-slate-800/40 text-slate-600 grayscale opacity-50 cursor-not-allowed'}`}>
                     <span className="text-2xl font-black">S</span>
                     <span className="text-[8px] font-bold uppercase mt-1">Sahibinden</span>
                  </a>

                  {/* Dolap */}
                  <a href={product.dolapLink || "#"} target={product.dolapLink ? "_blank" : "_self"}
                     className={`flex flex-col items-center justify-center h-20 rounded-xl transition-all border border-transparent ${product.dolapLink ? 'bg-gradient-to-br from-green-400 to-green-600 text-white hover:scale-105 shadow-lg shadow-green-500/20' : 'bg-slate-800/40 text-slate-600 grayscale opacity-50 cursor-not-allowed'}`}>
                     <span className="text-2xl font-black">D</span>
                     <span className="text-[8px] font-bold uppercase mt-1">Dolap</span>
                  </a>

                  {/* Letgo */}
                  <a href={product.letgoLink || "#"} target={product.letgoLink ? "_blank" : "_self"}
                     className={`flex flex-col items-center justify-center h-20 rounded-xl transition-all border border-transparent ${product.letgoLink ? 'bg-gradient-to-br from-red-400 to-red-600 text-white hover:scale-105 shadow-lg shadow-red-500/20' : 'bg-slate-800/40 text-slate-600 grayscale opacity-50 cursor-not-allowed'}`}>
                     <span className="text-2xl font-black">L</span>
                     <span className="text-[8px] font-bold uppercase mt-1">Letgo</span>
                  </a>

                  {/* Instagram */}
                  <a href={product.instagramLink || "#"} target={product.instagramLink ? "_blank" : "_self"}
                     className={`flex flex-col items-center justify-center h-20 rounded-xl transition-all border border-transparent ${product.instagramLink ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white hover:scale-105 shadow-lg shadow-purple-500/20' : 'bg-slate-800/40 text-slate-600 grayscale opacity-50 cursor-not-allowed'}`}>
                     <Instagram size={24}/>
                     <span className="text-[8px] font-bold uppercase mt-1">Instagram</span>
                  </a>
              </div>
           </div>
           
           {/* 2. DURUM SEÇİCİ */}
           <div className="bg-[#151921] border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                 <ShoppingBag size={14}/> Stok Durumu
              </div>
              <div className="grid grid-cols-2 gap-2">
                 {["Satışta", "Kargoda", "Opsiyonlandı", "Satıldı"].map((statusOption) => (
                     <button 
                       key={statusOption}
                       onClick={() => setProduct({...product, status: statusOption})}
                       className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all
                       ${product.status === statusOption 
                           ? (statusOption === "Satışta" ? "bg-green-500 border-green-400 text-white shadow-lg shadow-green-900/20" 
                           : statusOption === "Kargoda" ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-900/20"
                           : statusOption === "Opsiyonlandı" ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-900/20"
                           : "bg-slate-200 border-white text-black shadow-lg")
                           : "bg-slate-900/50 text-slate-500 border-slate-800 hover:bg-slate-800 hover:border-slate-600"}`}
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

           {/* 3. FİYAT & KÂR */}
           <div className="bg-[#151921] border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-green-400 uppercase tracking-wider">
                 <DollarSign size={14}/> Değerleme
              </div>
              <div className="space-y-4 relative z-10">
                  <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">SATIŞ FİYATI (TL)</label>
                      <input type="number" value={product.price} onChange={(e) => setProduct({...product, price: Number(e.target.value)})} className="w-full bg-[#0b0e14] border border-green-900/30 rounded-xl p-3 text-green-400 text-xl font-black outline-none focus:border-green-500 transition-colors placeholder:text-slate-800" />
                  </div>
                  <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">MALİYET (TL)</label>
                      <input type="number" value={product.cost} onChange={(e) => setProduct({...product, cost: Number(e.target.value)})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-slate-400 font-bold outline-none focus:border-slate-500 transition-colors" />
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-bold">NET KÂR</span>
                      <span className={`text-xl font-black ${profit > 0 ? 'text-green-400' : 'text-red-500'}`}>{profit.toLocaleString()} ₺</span>
                  </div>
              </div>
           </div>

           {/* 4. GÖRSELLER */}
           <div className="bg-[#151921] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                     <ImageIcon size={14}/> Görseller
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{product.images.length} Adet</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {product.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group bg-black">
                          <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                          <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                              <X size={12}/>
                          </button>
                          {i === 0 && <span className="absolute bottom-0 w-full bg-cyan-600/80 text-white text-[8px] font-bold text-center py-0.5">KAPAK</span>}
                      </div>
                  ))}
                  
                  <div className="relative aspect-square bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer">
                      {uploading ? <Loader2 className="animate-spin"/> : <Upload size={24}/>}
                      <span className="text-[9px] font-bold mt-1 uppercase">EKLE</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer"/>
                  </div>
              </div>
           </div>
        </div>

        {/* --- SAĞ KOLON (Detaylar & Link Girişi) --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* LİNK DÜZENLEME INPUTLARI */}
            <div className="bg-[#151921] border border-slate-800 p-6 rounded-2xl">
                 <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2 mb-5 border-b border-slate-800 pb-3"><Globe size={14} className="text-blue-500"/> Platform Link Entegrasyonu</h3>
                 
                 <div className="grid gap-4">
                    <div className="flex gap-3 items-center group">
                        <div className="w-10 h-10 bg-[#F9C305] text-black flex items-center justify-center rounded-xl font-black text-sm shrink-0 shadow-lg shadow-yellow-900/20 group-hover:scale-110 transition-transform">S</div>
                        <div className="flex-1">
                             <label className="text-[9px] font-bold text-slate-500 mb-1 block ml-1">SAHİBİNDEN LİNKİ</label>
                             <input type="text" value={product.sahibindenLink} onChange={e => setProduct({...product, sahibindenLink: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-xs text-white focus:border-[#F9C305] outline-none transition-colors placeholder:text-slate-700 font-mono" placeholder="https://sahibinden.com/ilan..."/>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center group">
                        <div className="w-10 h-10 bg-[#00D678] text-white flex items-center justify-center rounded-xl font-black text-sm shrink-0 shadow-lg shadow-green-900/20 group-hover:scale-110 transition-transform">D</div>
                        <div className="flex-1">
                             <label className="text-[9px] font-bold text-slate-500 mb-1 block ml-1">DOLAP LİNKİ</label>
                             <input type="text" value={product.dolapLink} onChange={e => setProduct({...product, dolapLink: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-xs text-white focus:border-[#00D678] outline-none transition-colors placeholder:text-slate-700 font-mono" placeholder="https://dolap.com/urun..."/>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center group">
                        <div className="w-10 h-10 bg-[#FF3C4C] text-white flex items-center justify-center rounded-xl font-black text-sm shrink-0 shadow-lg shadow-red-900/20 group-hover:scale-110 transition-transform">L</div>
                        <div className="flex-1">
                             <label className="text-[9px] font-bold text-slate-500 mb-1 block ml-1">LETGO LİNKİ</label>
                             <input type="text" value={product.letgoLink} onChange={e => setProduct({...product, letgoLink: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-xs text-white focus:border-[#FF3C4C] outline-none transition-colors placeholder:text-slate-700 font-mono" placeholder="https://letgo.com/item..."/>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 text-white flex items-center justify-center rounded-xl font-black text-sm shrink-0 shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform"><Instagram size={20}/></div>
                        <div className="flex-1">
                             <label className="text-[9px] font-bold text-slate-500 mb-1 block ml-1">INSTAGRAM LİNKİ</label>
                             <input type="text" value={product.instagramLink} onChange={e => setProduct({...product, instagramLink: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-xs text-white focus:border-purple-500 outline-none transition-colors placeholder:text-slate-700 font-mono" placeholder="https://instagram.com/p/..."/>
                        </div>
                    </div>
                 </div>
            </div>

            {/* GENEL BİLGİLER */}
            <div className="bg-[#151921] border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-6 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
                   <FileText size={14}/> Ürün Bilgileri
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">ÜRÜN BAŞLIĞI</label>
                        <input type="text" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3.5 text-white font-bold text-sm outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">KATEGORİ</label>
                        <input type="text" value={product.category || ""} onChange={(e) => setProduct({...product, category: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3.5 text-white font-bold text-sm outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">ÜRÜN AÇIKLAMASI</label>
                    <textarea rows={8} value={product.description || ""} onChange={(e) => setProduct({...product, description: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-4 text-slate-300 text-sm outline-none focus:border-cyan-500 transition-colors resize-none leading-relaxed" placeholder="Ürün detaylarını buraya giriniz..."></textarea>
                    <p className="text-[10px] text-slate-600 mt-2 italic flex items-center gap-1"><Globe size={10}/> Not: Girdiğiniz platform linkleri otomatik olarak bu açıklamanın altına eklenir.</p>
                </div>
            </div>

            {/* YÖNETİCİ NOTLARI */}
            <div className="bg-[#151921] border border-slate-800 p-6 rounded-2xl h-fit opacity-70 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-yellow-600 uppercase tracking-wider">
                   Müşteri & Servis Notları (Gizli)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">MÜŞTERİ AD SOYAD</label>
                        <input type="text" value={product.customerName || ""} onChange={(e) => setProduct({...product, customerName: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-yellow-600" />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">KONUM / ADRES</label>
                        <input type="text" value={product.customerLocation || ""} onChange={(e) => setProduct({...product, customerLocation: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-yellow-600" />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">ÖZEL NOTLAR</label>
                    <textarea rows={3} value={product.adminNotes || ""} onChange={(e) => setProduct({...product, adminNotes: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none focus:border-yellow-600 resize-none"></textarea>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}