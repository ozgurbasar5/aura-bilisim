"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, Star, Smartphone, Laptop, Zap, Filter, ArrowRight, 
  Watch, Box, Image as ImageIcon, MapPin 
} from "lucide-react";

export default function SatisSayfasi() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState("Tümü");
  const [search, setSearch] = useState("");

  const CATEGORIES = [
      { id: "Tümü", label: "Tümü", icon: Filter },
      { id: "Cep Telefonu", label: "Telefon", icon: Smartphone },
      { id: "Robot Süpürge", label: "Robot", icon: Zap },
      { id: "Bilgisayar", label: "Bilgisayar", icon: Laptop },
      { id: "Akıllı Saat", label: "Saat", icon: Watch },
      { id: "Yedek Parça / Outlet", label: "Outlet / Parça", icon: Box },
  ];

  useEffect(() => {
    const storedProducts = localStorage.getItem("aura_store_products");
    if (storedProducts) {
        try {
            const parsed = JSON.parse(storedProducts);
            setProducts(parsed.filter((p: any) => p.status === "Satışta"));
        } catch (e) { console.error("Veri hatası", e); }
    }
  }, []);

  // İsimden URL (Slug) Oluşturma Fonksiyonu
  const createSlug = (name: string) => {
      return name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[ıİ]/g, "i")
        .replace(/[ğĞ]/g, "g")
        .replace(/[üÜ]/g, "u")
        .replace(/[şŞ]/g, "s")
        .replace(/[öÖ]/g, "o")
        .replace(/[çÇ]/g, "c")
        .replace(/[^a-z0-9-]/g, "");
  };

  const filteredProducts = products.filter(p => {
      const matchesCategory = category === "Tümü" || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#0F172A] text-white pt-24 pb-20 relative font-sans">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 border-b border-white/10 pb-6">
           <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1 uppercase tracking-widest text-xs">
                 <Star size={14} fill="currentColor" /> Güvenilir Mağaza
              </div>
              <h1 className="text-4xl font-black tracking-tight">AURA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">STORE</span></h1>
           </div>
           
           <div className="w-full md:w-auto relative group">
               <input 
                  type="text" 
                  placeholder="İlanlarda ara..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-80 bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-cyan-500 transition-all placeholder:text-slate-500"
               />
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
           </div>
        </div>

        {/* Kategoriler */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
                <button 
                    key={cat.id} 
                    onClick={() => setCategory(cat.id)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap border ${category === cat.id ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'}`}
                >
                    <cat.icon size={16} /> {cat.label}
                </button>
            ))}
        </div>

        {/* Ürün Listesi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((urun) => (
                <div 
                    key={urun.id} 
                    onClick={() => router.push(`/satis/${createSlug(urun.name)}`)} // Linkleme Yapıldı
                    className="bg-[#1E293B] border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col"
                >
                    <div className="h-56 bg-black relative flex items-center justify-center overflow-hidden border-b border-slate-700">
                        {urun.images && urun.images.length > 0 ? (
                            <img src={urun.images[0]} alt={urun.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <ImageIcon size={48} className="text-slate-700"/>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                            <span className="flex items-center gap-1 text-[10px] text-slate-300"><MapPin size={10}/> İstanbul / Kadıköy</span>
                        </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-cyan-400 transition-colors">{urun.name}</h3>
                        <div className="mt-auto pt-3 border-t border-slate-700/50 flex justify-between items-center">
                            <span className="text-xl font-black text-white">{Number(urun.price).toLocaleString('tr-TR')} TL</span>
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                                <ArrowRight size={16}/>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </main>
  );
}