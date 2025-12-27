"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, Star, Smartphone, Laptop, Zap, Filter, ArrowRight, 
  Watch, Box, Image as ImageIcon, MapPin, Wrench
} from "lucide-react";

export default function MagazaPage() {
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
      { id: "Yedek Parça", label: "Yedek Parça", icon: Box },
  ];

  useEffect(() => {
    const checkSources = () => {
        const magazaData = localStorage.getItem("aura_magaza_urunleri");
        const storeData = localStorage.getItem("aura_store_products");
        
        let allProducts = [];
        
        if (magazaData) allProducts = JSON.parse(magazaData);
        else if (storeData) allProducts = JSON.parse(storeData);

        if (allProducts.length > 0) {
            const active = allProducts.filter((p: any) => p.status === "Satışta" || !p.status);
            setProducts(active.reverse());
        }
    }
    checkSources();
  }, []);

  const createSlug = (name: string) => {
      if (!name) return "";
      return name.toString().toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
  };

  const filteredProducts = products.filter(p => {
      const matchesCategory = category === "Tümü" || p.category === category;
      const matchesSearch = (p.name || "").toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#020617] text-white pt-24 relative font-sans selection:bg-cyan-500/30">
      
      {/* NAVBAR DÜZELTİLDİ: Blur kaldırıldı, Tam Opak Yapıldı */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#020617] border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* SOL: LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
             <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg"><Wrench size={20} className="text-white"/></div>
             <div><h1 className="text-xl font-black tracking-tight leading-none text-white">AURA<span className="text-cyan-500">BİLİŞİM</span></h1><p className="text-[10px] text-slate-400 tracking-widest font-bold uppercase">Teknik Laboratuvar</p></div>
          </div>
          
          {/* ORTA: MENÜ */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400 h-full">
             <Link href="/" className="hover:text-cyan-400 transition-colors h-full flex items-center">Ana Sayfa</Link>
             <Link href="/sorgula" className="hover:text-cyan-400 transition-colors h-full flex items-center">Cihaz Sorgula</Link>
             <Link href="/magaza" className="text-cyan-400 font-bold h-full flex items-center border-b-2 border-cyan-400">Aura Store</Link>
             <Link href="/iletisim" className="hover:text-cyan-400 transition-colors h-full flex items-center">İletişim</Link>
          </div>

          {/* SAĞ: BUTONLAR */}
          <div className="flex items-center gap-4">
             <Link href="/magaza" className="hidden sm:flex items-center gap-2 text-white font-bold text-sm transition-all border border-purple-500 bg-purple-500/10 px-5 py-2.5 rounded-xl hover:bg-purple-500"><ShoppingBag size={18}/> Aura Store</Link>
             <Link href="/onarim-talebi" className="hidden sm:flex items-center gap-2 bg-[#1e293b] hover:bg-[#283547] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-700 hover:border-cyan-500/50"><Wrench size={18} className="text-cyan-400"/> Onarım Talebi</Link>
          </div>
        </div>
      </nav>

      {/* İÇERİK ALANI */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/10 pb-8 mt-4">
           <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2 uppercase tracking-widest text-xs">
                 <Star size={14} fill="currentColor" /> Güvenilir Mağaza
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">AURA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">STORE</span></h1>
              <p className="text-slate-400 mt-2 font-light">Revize edilmiş, garantili ve test edilmiş teknolojik ürünler.</p>
           </div>
           
           <div className="w-full md:w-auto relative group">
               <input 
                  type="text" 
                  placeholder="Ürün Ara..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-80 bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-cyan-500 transition-all placeholder:text-slate-500"
               />
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
           </div>
        </div>

        {/* Kategoriler */}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
                <button 
                    key={cat.id} 
                    onClick={() => setCategory(cat.id)} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${category === cat.id ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <cat.icon size={16} /> {cat.label}
                </button>
            ))}
        </div>

        {/* Ürün Listesi */}
        {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
                <ShoppingBag size={48} className="mb-4 opacity-50"/>
                <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                {filteredProducts.map((urun) => {
                    let rawImage = "";
                    if (urun.images && Array.isArray(urun.images) && urun.images.length > 0) rawImage = urun.images[0];
                    else rawImage = urun.image || urun.img || urun.gorsel || urun.url;

                    const hasImage = rawImage && rawImage.length > 5 && !rawImage.startsWith('bg-');

                    return (
                        <div 
                            key={urun.id} 
                            onClick={() => router.push(`/magaza/${createSlug(urun.name)}`)} 
                            className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all group hover:-translate-y-2 cursor-pointer flex flex-col"
                        >
                            <div className="h-60 bg-[#1e293b] relative flex items-center justify-center overflow-hidden border-b border-slate-800">
                                {hasImage ? (
                                    <img src={rawImage} alt={urun.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-600">
                                        <ImageIcon size={48}/>
                                        <span className="text-[10px] font-bold uppercase">Görsel Yok</span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-cyan-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider">{urun.category || 'Genel'}</span>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-4 group-hover:text-cyan-400 transition-colors min-h-[40px]">{urun.name}</h3>
                                <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                                    <div>
                                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Fiyat</span>
                                        <span className="text-xl font-black text-white">{Number(urun.price).toLocaleString('tr-TR')} ₺</span>
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
    </main>
  );
}