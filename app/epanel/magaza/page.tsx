"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Plus, Search, Filter,
  Image as ImageIcon, Trash2, Edit,
  Package, DollarSign, Tag, Archive
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// !!! BURAYI DOLDUR USTA !!!
// .env dosyasındaki linkini ve şifreni tırnak içine yapıştır.
const SUPABASE_URL = "https://cmkjewcpqohkhnfpvoqw.supabase.co"; // Kendi URL'ini yapıştır
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2pld2NwcW9oa2huZnB2b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDQ2MDIsImV4cCI6MjA4MTkyMDYwMn0.HwgnX8tn9ObFCLgStWWSSHMM7kqc9KqSZI96gpGJ6lw";      // Kendi ANON KEY'ini yapıştır

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function MagazaVitrin() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [loading, setLoading] = useState(true);

  // Kategori Listesi
  const CATEGORIES = [
      "Tümü", "Cep Telefonu", "Robot Süpürge", "Bilgisayar",
      "Akıllı Saat", "Tablet", "Ekosistem Ürünleri",
      "Aksesuar", "Yedek Parça", "Sarf Malzeme"
  ];

  // --- VERİ ÇEKME (SQL) ---
  const fetchProducts = async () => {
    try {
        setLoading(true);
        let { data, error } = await supabase
            .from('urunler')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
            // SQL verisini (Türkçe sütunlar) UI formatına (İngilizce keyler) çeviriyoruz
            const mappedData = data.map((item: any) => ({
                id: item.id,
                name: item.ad,
                price: item.fiyat,
                category: item.kategori,
                // UI bir dizi (array) bekliyor, tek resim varsa diziye koyuyoruz
                images: item.resim_url ? [item.resim_url] : [],
                // SQL'de true/false var, UI string bekliyor
                status: item.stok_durumu ? "Satışta" : "Stok Dışı", 
                cost: 0 // Veritabanında maliyet sütunu yoksa 0 varsayalım
            }));
            setProducts(mappedData);
        }
    } catch (e) {
        console.error("Veri çekme hatası:", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- HESAPLAMALAR ---
  // Sadece "Satışta" olanların toplam değeri (Vitrin Değeri)
  const activeProducts = products.filter(p => p.status === "Satışta");
  const activeValue = activeProducts.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

  // Bu ay satılanların cirosu (SQL'de 'Stok Dışı' olanları satılmış varsayabiliriz veya status mantığını geliştirebiliriz)
  const soldProducts = products.filter(p => p.status !== "Satışta");
  const soldValue = soldProducts.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

  // Filtreleme Mantığı
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                          p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Tümü" || p.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
      // Satışta olanlar önce gelsin
      if (a.status === "Satışta" && b.status !== "Satışta") return -1;
      if (a.status !== "Satışta" && b.status === "Satışta") return 1;
      return 0;
  });

  // --- SİLME İŞLEMİ (SQL) ---
  const deleteProduct = async (e: any, id: number) => {
      e.stopPropagation();
      if(!confirm("Bu stok kartını veritabanından kalıcı olarak silmek istediğine emin misin?")) return;
      
      try {
          const { error } = await supabase.from('urunler').delete().eq('id', id);
          if (error) throw error;
          
          // Listeyi güncelle (Tekrar çekmeye gerek yok, state'ten silelim daha hızlı olur)
          setProducts(prev => prev.filter(p => p.id !== id));
      } catch (err) {
          alert("Silme işlemi başarısız oldu.");
          console.error(err);
      }
  };

  return (
    <div className="p-6 text-slate-200 animate-in fade-in zoom-in-95 duration-500 pb-20 space-y-6">
      
      {/* HEADER & İSTATİSTİKLER */}
      <div className="flex flex-col xl:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <ShoppingBag className="text-purple-500" size={32}/> AURA STORE
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 ml-1">VİTRİN & STOK YÖNETİMİ</p>
          </div>
          
          {/* Hızlı İstatistik Kartları */}
          <div className="flex flex-wrap gap-3">
              {/* Kart 1: Vitrin Adedi */}
              <div className="bg-[#151921] border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Tag size={18}/></div>
                  <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">VİTRİNDEKİ</p>
                      <p className="text-xl font-bold text-white">{activeProducts.length} <span className="text-xs text-slate-600">Adet</span></p>
                  </div>
              </div>

              {/* Kart 2: Vitrin Değeri */}
              <div className="bg-[#151921] border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-emerald-500"><DollarSign size={18}/></div>
                  <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">STOK DEĞERİ</p>
                      <p className="text-xl font-bold text-emerald-400">{activeValue.toLocaleString('tr-TR')} ₺</p>
                  </div>
              </div>

              {/* Kart 3: Satılan Ciro */}
              <div className="bg-[#151921] border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-purple-500"><Archive size={18}/></div>
                  <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">TOPLAM SATIŞ</p>
                      <p className="text-xl font-bold text-purple-400">{soldValue.toLocaleString('tr-TR')} ₺</p>
                  </div>
              </div>
          </div>

          <button onClick={() => router.push('/epanel/magaza/yeni')} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2 active:scale-95">
              <Plus size={20}/> ÜRÜN EKLE
          </button>
      </div>

      {/* ARAMA & FİLTRE */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Kategori Barı */}
        <div className="bg-[#151921] p-2 rounded-xl border border-slate-800 flex-1 overflow-x-auto scrollbar-hide flex gap-2">
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-slate-800 text-white border-slate-600 shadow-md' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Arama Kutusu */}
        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
            <input
                type="text"
                placeholder="Model, Marka Ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full bg-[#151921] border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-500 transition-all placeholder:text-slate-600"
            />
        </div>
      </div>

      {/* ÜRÜN GRID LİSTESİ */}
      {loading ? (
           <div className="text-center py-20 text-slate-500">Veriler yükleniyor...</div>
      ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
              <div className="bg-slate-800 p-4 rounded-full mb-4 opacity-50"><Package size={48} className="text-slate-400"/></div>
              <h3 className="text-xl font-bold text-slate-400">Vitrin Boş</h3>
              <p className="text-slate-600 text-sm mt-1">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/epanel/magaza/${product.id}`)}
                    className="group bg-[#151921] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all hover:shadow-2xl hover:shadow-black/50 relative flex flex-col cursor-pointer"
                  >
                      
                      {/* STATÜ ROZETİ */}
                      <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase z-20 shadow-lg backdrop-blur-md border border-white/10
                        ${product.status === 'Satıldı' ? 'bg-emerald-600/90 text-white' :
                          product.status === 'Kargoda' ? 'bg-blue-600/90 text-white' :
                          product.status === 'Satışta' ? 'bg-yellow-500/90 text-black' : 
                          'bg-slate-700 text-white'}`}>
                          {product.status === 'Satışta' ? 'VİTRİNDE' : product.status}
                      </div>

                      {/* GÖRSEL ALANI */}
                      <div className="h-48 bg-slate-900/50 relative flex items-center justify-center overflow-hidden border-b border-slate-800">
                          {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                          ) : (
                              <div className="flex flex-col items-center gap-2 text-slate-700">
                                  <ImageIcon size={32}/>
                                  <span className="text-[10px] font-bold uppercase">Görsel Yok</span>
                              </div>
                          )}
                          
                          {/* Hover Aksiyonları */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                              <button className="bg-white text-black p-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-200 text-xs">
                                  <Edit size={14}/> DÜZENLE
                              </button>
                              <button
                                onClick={(e) => deleteProduct(e, product.id)}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                              >
                                  <Trash2 size={14}/>
                              </button>
                          </div>
                      </div>

                      {/* BİLGİ ALANI */}
                      <div className="p-4 flex-1 flex flex-col">
                          <div className="mb-3">
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider bg-slate-800 px-1.5 py-0.5 rounded">{product.category || 'Genel'}</span>
                              <h3 className="text-white font-bold text-sm leading-snug mt-2 line-clamp-2 min-h-[40px]">{product.name}</h3>
                          </div>

                          <div className="mt-auto flex justify-between items-end border-t border-slate-800/50 pt-3">
                              <div>
                                  <span className="text-[9px] text-slate-500 font-bold block">MALİYET</span>
                                  <span className="text-xs font-mono text-slate-400">{Number(product.cost || 0).toLocaleString()} ₺</span>
                              </div>
                              <div className="text-right">
                                  <span className="text-[9px] text-slate-500 font-bold block">SATIŞ</span>
                                  <span className="text-lg font-black text-emerald-400">{Number(product.price).toLocaleString()} ₺</span>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}