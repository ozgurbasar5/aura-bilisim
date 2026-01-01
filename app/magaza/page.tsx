"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, Star, Smartphone, Laptop, Zap, Filter, ArrowRight, 
  Watch, Box, Image as ImageIcon, Search, Tag, Cpu, Eye
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// SUPABASE AYARLARI
const SUPABASE_URL = "https://cmkjewcpqohkhnfpvoqw.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2pld2NwcW9oa2huZnB2b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDQ2MDIsImV4cCI6MjA4MTkyMDYwMn0.HwgnX8tn9ObFCLgStWWSSHMM7kqc9KqSZI96gpGJ6lw";

export default function MagazaPage() {
  const router = useRouter();
  
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // KATEGORİ LİSTESİ
  const CATEGORIES = [
      { id: "Tümü", label: "Tümü", icon: Filter },
      { id: "Cep Telefonu", label: "Telefon", icon: Smartphone },
      { id: "Robot Süpürge", label: "Robot", icon: Zap },
      { id: "Bilgisayar", label: "Bilgisayar", icon: Laptop },
      { id: "Akıllı Saat", label: "Saat", icon: Watch },
      { id: "Yedek Parça", label: "Yedek Parça", icon: Box },
      { id: "Aksesuar", label: "Aksesuar", icon: Tag },
  ];

  // VERİ ÇEKME
  useEffect(() => {
    const fetchProductsFromSQL = async () => {
        try {
            setLoading(true);
            const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
            
            let { data, error } = await supabase
                .from('urunler')
                .select('*')
                .or('stok_durumu.eq.Satışta,stok_durumu.eq.true') 
                .order('created_at', { ascending: false });

            if (data) {
                const mappedProducts = data.map((item: any) => ({
                    id: item.id,
                    name: item.ad || "İsimsiz Ürün",
                    price: item.fiyat || 0,
                    category: item.kategori || "Genel",
                    image: (item.images && item.images.length > 0) ? item.images[0] : (item.resim_url || ""),
                    description: item.aciklama || "",
                    status: "Stokta" 
                }));
                setProducts(mappedProducts);
            }
        } catch (err) {
            console.error("Sistem hatası:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchProductsFromSQL();
  }, []);

  // FİLTRELEME MANTIĞI
  const filteredProducts = products.filter(p => {
      const matchesCategory = category === "Tümü" || p.category === category;
      const searchLower = search.toLowerCase();
      const matchesSearch = 
          (p.name || "").toLowerCase().includes(searchLower) || 
          (p.category || "").toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-32 pb-20 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* ARKA PLAN EFEKTLERİ */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-900/10 to-transparent"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- ÜST KISIM --- */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-12 border-b border-white/10 pb-8">
           <div className="w-full lg:w-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-in fade-in slide-in-from-left-4">
                 <Star size={14} className="fill-current" /> Güvenilir & Garantili
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-2">
                  AURA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">STORE</span>
              </h1>
              <p className="text-slate-400 font-light text-lg">Teknoloji laboratuvarımızdan onaylı, revize edilmiş cihazlar.</p>
           </div>

           {/* ARAMA ÇUBUĞU */}
           <div className="w-full lg:w-[450px] relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
               <div className="relative bg-[#0B1120] rounded-xl flex items-center shadow-2xl border border-white/10">
                   <Search className="absolute left-4 text-slate-500 group-hover:text-cyan-400 transition-colors" size={20}/>
                   <input 
                      type="text" 
                      placeholder="Ürün, model veya parça ara..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent py-4 pl-12 pr-4 text-white font-medium outline-none placeholder:text-slate-600 rounded-xl"
                   />
               </div>
           </div>
        </div>

        {/* --- KATEGORİLER --- */}
        <div className="mb-10">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {CATEGORIES.map((cat) => (
                    <button 
                        key={cat.id} 
                        onClick={() => setCategory(cat.id)} 
                        className={`snap-start shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                            category === cat.id 
                            ? 'bg-cyan-600 text-white border-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.4)] scale-105' 
                            : 'bg-[#151921] text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white hover:bg-[#1e2430]'
                        }`}
                    >
                        <cat.icon size={16} /> {cat.label}
                    </button>
                ))}
            </div>
        </div>

        {/* --- ÜRÜN LİSTESİ --- */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-32 gap-6">
                 <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-800 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                 </div>
                 <p className="text-slate-500 text-sm font-bold animate-pulse tracking-widest uppercase">Mağaza Yükleniyor...</p>
             </div>
        ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-[#0f1420]/50 border border-dashed border-slate-800 rounded-3xl">
                <div className="p-4 bg-slate-800/50 rounded-full mb-4"><ShoppingBag size={48} className="opacity-50"/></div>
                <h3 className="text-xl font-bold text-white mb-2">Sonuç Bulunamadı</h3>
                <p>Aradığınız kriterlere uygun ürün mevcut değil.</p>
                <button onClick={() => {setCategory("Tümü"); setSearch("");}} className="mt-6 text-cyan-400 font-bold hover:text-white transition-colors underline underline-offset-4">Filtreleri Temizle</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
                {filteredProducts.map((urun) => {
                    let rawImage = urun.image || ""; 
                    const hasImage = rawImage && rawImage.length > 5;

                    return (
                        <div 
                            key={urun.id} 
                            onClick={() => router.push(`/magaza/${urun.id}`)} 
                            className="group relative bg-[#0f1420] border border-white/5 rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            
                            {/* Resim Alanı */}
                            <div className="h-64 relative bg-[#131823] overflow-hidden flex items-center justify-center">
                                {/* Kategori Rozeti */}
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                                       <Cpu size={10} className="text-cyan-400"/> {urun.category}
                                    </span>
                                </div>

                                {hasImage ? (
                                    <img 
                                        src={rawImage} 
                                        alt={urun.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-slate-600">
                                        <div className="p-4 bg-slate-800/50 rounded-full"><ImageIcon size={32}/></div>
                                        <span className="text-xs font-bold uppercase tracking-widest">Görsel Yok</span>
                                    </div>
                                )}

                                {/* Overlay & İncele Butonu */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="bg-white text-black font-bold px-6 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 shadow-xl hover:bg-cyan-50">
                                        <Eye size={18}/> İncele
                                    </div>
                                </div>
                            </div>

                            {/* İçerik */}
                            <div className="p-6 relative z-10 bg-[#0f1420]">
                                <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 mb-4 group-hover:text-cyan-400 transition-colors min-h-[56px]" title={urun.name}>
                                    {urun.name}
                                </h3>
                                
                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Nakit Fiyat</p>
                                        <div className="text-xl font-black text-white">{Number(urun.price).toLocaleString('tr-TR')} <span className="text-sm text-slate-500">₺</span></div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-lg">
                                        <ArrowRight size={18}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
}