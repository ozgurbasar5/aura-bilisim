"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { 
  Plus, Search, Package, ShoppingBag, 
  Tag, MoreVertical, Trash2, Edit, Truck, Clock, CheckCircle2, XCircle, Filter, DollarSign, Image as ImageIcon, Archive
} from "lucide-react";

export default function MagazaPaneli() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Tümü");

  // Kategori Listesi
  const CATEGORIES = [
      "Tümü", "Cep Telefonu", "Robot Süpürge", "Bilgisayar", 
      "Akıllı Saat", "Tablet", "Ekosistem Ürünleri", 
      "Aksesuar", "Yedek Parça", "Sarf Malzeme"
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('urunler').select('*').order('created_at', { ascending: false });
    
    if (data) {
        // Veriyi işle
        const processedData = data.map((item:any) => ({
            ...item,
            // Eğer status null ise veya 'true' ise 'Satışta' yap
            stok_durumu: (item.stok_durumu === 'true' || !item.stok_durumu) ? 'Satışta' : item.stok_durumu,
            images: item.resim_url ? [item.resim_url] : [] // Tek resim varsa array yap
        }));
        setProducts(processedData);
    }
    setLoading(false);
  };

  // --- KRİTİK FONKSİYON: DURUM VE FİNANS GÜNCELLEME ---
  const updateStatus = async (id: number, newStatus: string, product: any) => {
      // 1. Önce Ürünler Tablosunu Güncelle (Görsel Durum)
      const { error: productError } = await supabase
          .from('urunler')
          .update({ stok_durumu: newStatus })
          .eq('id', id);

      if (productError) {
          alert("Durum güncellenemedi!");
          return;
      }

      // 2. FİNANSAL TABLOYU SENKRONİZE ET (aura_store_sales)
      // Mantık: Önce bu ürünle ilgili eski finans kaydını temizle, sonra yeni duruma göre ekle.
      
      // A. Eski kaydı sil (Varsa)
      await supabase.from('aura_store_sales').delete().eq('product_name', product.ad);

      // B. Yeni Duruma Göre İşlem Yap
      if (newStatus !== 'Satışta') {
          // Eğer ürün "Satışta" değilse, bir satış süreci başlamıştır (Kargo, Opsiyon veya Satıldı)
          // Finans tablosuna ekle
          
          let satisDurumu = '';
          if (newStatus === 'Satıldı') satisDurumu = 'Tamamlandı'; // Ciroya geçer
          else if (newStatus === 'Kargoda') satisDurumu = 'Kargoda'; // Bekleyene geçer
          else if (newStatus === 'Opsiyonlandı') satisDurumu = 'Opsiyonlandı'; // Bekleyene geçer

          // Müşteri adı (Otomatik veya sabit)
          const musteriAdi = product.musteri_adi || "Mağaza Müşterisi"; 

          await supabase.from('aura_store_sales').insert([{
              product_name: product.ad,
              customer_name: musteriAdi,
              price: product.fiyat,
              cost: product.maliyet,
              status: satisDurumu,
              created_at: new Date().toISOString() // İşlem tarihi şu an
          }]);
      }

      // Listeyi Yenile
      fetchProducts();
  };

  const handleDelete = async (id: number, productName: string) => {
      if(!confirm("Ürünü ve finansal kayıtlarını silmek istiyor musunuz?")) return;
      
      // Hem ürünü hem finans kaydını sil
      await supabase.from('urunler').delete().eq('id', id);
      await supabase.from('aura_store_sales').delete().eq('product_name', productName);
      
      fetchProducts();
  };

  // --- HESAPLAMALAR ---
  const activeValue = products.filter(p => p.stok_durumu === 'Satışta').reduce((acc, p) => acc + Number(p.fiyat), 0);
  const soldValue = products.filter(p => p.stok_durumu === 'Satıldı').reduce((acc, p) => acc + Number(p.fiyat), 0);
  const activeCount = products.filter(p => p.stok_durumu === 'Satışta').length;

  const filteredProducts = products.filter(p => {
      const matchesSearch = p.ad.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "Tümü" || p.kategori === filter;
      return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-20 text-center text-slate-500 font-bold animate-pulse">Mağaza yükleniyor...</div>;

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-6 animate-in fade-in duration-500 text-slate-200">
      
      {/* HEADER & İSTATİSTİKLER */}
      <div className="flex flex-col xl:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-6 pt-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <ShoppingBag className="text-purple-500" size={32} /> AURA STORE
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 ml-1">
                STOK & SATIŞ YÖNETİMİ
            </p>
          </div>

          {/* Hızlı İstatistik Kartları */}
          <div className="flex flex-wrap gap-3">
              <div className="bg-[#151921] border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Tag size={18}/></div>
                  <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">VİTRİNDEKİ</p>
                      <p className="text-xl font-bold text-white">{activeCount} <span className="text-xs text-slate-600">Adet</span></p>
                  </div>
              </div>

              <div className="bg-[#151921] border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-emerald-500"><DollarSign size={18}/></div>
                  <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">STOK DEĞERİ</p>
                      <p className="text-xl font-bold text-emerald-400">{activeValue.toLocaleString('tr-TR')} ₺</p>
                  </div>
              </div>

              <div className="bg-[#151921] border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-purple-500"><Archive size={18}/></div>
                  <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">TOPLAM SATIŞ</p>
                      <p className="text-xl font-bold text-purple-400">{soldValue.toLocaleString('tr-TR')} ₺</p>
                  </div>
              </div>
          </div>

          <Link href="/epanel/magaza/yeni" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-900/20 transition-all hover:scale-105 flex items-center gap-2">
              <Plus size={18}/> YENİ ÜRÜN
          </Link>
      </div>

      {/* FİLTRE & ARAMA */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
              <input 
                type="text" 
                placeholder="Ürün Ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all"
              />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${filter === cat ? 'bg-purple-600 border-purple-500 text-white' : 'bg-[#1E293B] border-slate-700 text-slate-400 hover:text-white'}`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
      </div>

      {/* ÜRÜN LİSTESİ (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
              <div key={product.id} className="bg-[#1E293B]/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden group hover:border-purple-500/30 transition-all flex flex-col hover:shadow-2xl hover:shadow-black/50">
                  
                  {/* Görsel Alanı */}
                  <div className="h-48 bg-[#0F172A] relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                      {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.ad} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                      ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-700">
                              <ImageIcon size={32}/>
                              <span className="text-[10px] font-bold uppercase">Görsel Yok</span>
                          </div>
                      )}
                      
                      {/* Durum Badge */}
                      <div className="absolute top-3 right-3 z-20">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-lg backdrop-blur-md ${
                              product.stok_durumu === 'Satıldı' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              product.stok_durumu === 'Kargoda' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse' :
                              product.stok_durumu === 'Opsiyonlandı' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              'bg-slate-500/20 text-slate-300 border-slate-500/30'
                          }`}>
                              {product.stok_durumu === 'Satışta' ? 'VİTRİNDE' : product.stok_durumu}
                          </span>
                      </div>
                  </div>

                  {/* İçerik */}
                  <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider bg-purple-900/20 px-2 py-0.5 rounded">{product.kategori}</span>
                              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mt-2">{product.ad}</h3>
                          </div>
                      </div>
                      
                      <div className="mt-auto pt-4 space-y-3">
                          <div className="flex justify-between items-end border-b border-slate-800/50 pb-3">
                              <div>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase">SATIŞ FİYATI</p>
                                  <p className="text-2xl font-black text-white">{Number(product.fiyat).toLocaleString('tr-TR')} ₺</p>
                              </div>
                              {Number(product.maliyet) > 0 && (
                                  <div className="text-right">
                                      <p className="text-[10px] text-slate-500 font-bold uppercase">MALİYET</p>
                                      <p className="text-sm font-mono text-slate-400">{Number(product.maliyet).toLocaleString('tr-TR')} ₺</p>
                                  </div>
                              )}
                          </div>

                          {/* DURUM DEĞİŞTİRME BUTONLARI (FİNANS TETİKLEYİCİ) */}
                          <div className="grid grid-cols-1">
                              <select 
                                  value={product.stok_durumu} 
                                  onChange={(e) => updateStatus(product.id, e.target.value, product)}
                                  className={`w-full p-2.5 rounded-lg text-xs font-bold outline-none border cursor-pointer appearance-none text-center transition-colors ${
                                      product.stok_durumu === 'Satışta' ? 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600' :
                                      product.stok_durumu === 'Satıldı' ? 'bg-green-600 text-white border-green-500' :
                                      'bg-slate-800 text-slate-300 border-slate-700'
                                  }`}
                              >
                                  <option value="Satışta">📦 Satışta (Stok)</option>
                                  <option value="Opsiyonlandı">⏳ Opsiyonlandı (Bekleyen)</option>
                                  <option value="Kargoda">🚚 Kargoda (Bekleyen)</option>
                                  <option value="Satıldı">✅ Satıldı (Ciro)</option>
                              </select>
                          </div>

                          <div className="flex justify-between gap-2 pt-1">
                              <Link href={`/epanel/magaza/${product.id}`} className="flex-1 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-xs font-bold flex items-center justify-center gap-1 border border-transparent hover:border-slate-700">
                                  <Edit size={14}/> DÜZENLE
                              </Link>
                              <button onClick={() => handleDelete(product.id, product.ad)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                                  <Trash2 size={16}/>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20 mt-8">
              <Package size={48} className="mx-auto mb-4 opacity-20"/>
              <h3 className="text-xl font-bold text-slate-400">Vitrin Boş</h3>
              <p className="text-slate-600 text-sm mt-1">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          </div>
      )}

    </div>
  );
}