"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
// EKSİK İKONLARIN HEPSİ EKLENDİ
import { 
  ShoppingBag, Star, Smartphone, Laptop, Zap, Filter, ArrowRight, 
  Watch, Box, Image as ImageIcon, Wrench,
  Menu, X, Search, Home, LifeBuoy, Info, HelpCircle, Phone,
  Instagram, Facebook, Twitter, MapPin 
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cmkjewcpqohkhnfpvoqw.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2pld2NwcW9oa2huZnB2b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDQ2MDIsImV4cCI6MjA4MTkyMDYwMn0.HwgnX8tn9ObFCLgStWWSSHMM7kqc9KqSZI96gpGJ6lw";

export default function MagazaPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [menuAcik, setMenuAcik] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const CATEGORIES = [
      { id: "Tümü", label: "Tümü", icon: Filter },
      { id: "Cep Telefonu", label: "Telefon", icon: Smartphone },
      { id: "Robot Süpürge", label: "Robot", icon: Zap },
      { id: "Bilgisayar", label: "Bilgisayar", icon: Laptop },
      { id: "Akıllı Saat", label: "Saat", icon: Watch },
      { id: "Yedek Parça", label: "Yedek Parça", icon: Box },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchProductsFromSQL();
  }, []);

  const filteredProducts = products.filter(p => {
      const matchesCategory = category === "Tümü" || p.category === category;
      const matchesSearch = (p.name || "").toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#020617] text-white pt-28 relative font-sans selection:bg-cyan-500/30">
      
      {/* --- GÜNCEL NAVBAR --- */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? "bg-[#020617]/95 backdrop-blur-xl border-white/5 h-20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "bg-[#020617] border-transparent h-24"
        } print:hidden`}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group select-none shrink-0" onClick={() => setMenuAcik(false)}>
            <div className="relative w-11 h-11 flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                <Wrench className="w-6 h-6 text-white relative z-10" />
            </div>
            <div className="flex flex-col justify-center">
                <div className="font-extrabold text-[22px] tracking-tight leading-none text-white flex items-center gap-1 group-hover:text-cyan-50 transition-colors">
                   AURA<span className="text-cyan-400">BİLİŞİM</span>
                </div>
                <span className="text-[9px] text-slate-400 font-bold tracking-[0.25em] uppercase group-hover:text-cyan-400/80 transition-colors">
                   TEKNOLOJİ ÜSSÜ
                </span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-8">
              {[ { href: "/", label: "Ana Sayfa" }, { href: "/destek", label: "Destek" }, { href: "/hakkimizda", label: "Hakkımızda" }, { href: "/sss", label: "S.S.S" }, { href: "/iletisim", label: "İletişim" } ].map((link) => (
                <Link key={link.href} href={link.href} className={`text-[14px] font-bold transition-all relative py-2 px-1 group ${isActive(link.href) ? "text-cyan-400" : "text-slate-300 hover:text-white"}`}>
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                </Link>
              ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
              {/* CİHAZ SORGULA BUTONU */}
              <Link href="/cihaz-sorgula" className="hidden lg:flex items-center gap-2 border border-slate-700/50 bg-[#0f172a] hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs transition-all group">
                  <Search size={16} className="text-cyan-400 group-hover:text-cyan-300 transition-colors"/> 
                  <span>CİHAZ SORGULA</span>
              </Link>

              <Link href="/magaza" className="hidden lg:flex items-center gap-2 border border-slate-700/50 bg-[#0f172a] hover:bg-slate-800 text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs transition-all group">
                  <ShoppingBag size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors"/> 
                  <span>MAĞAZA</span>
              </Link>

              <Link href="/onarim-talebi" className="hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-cyan-900/20 hover:-translate-y-0.5 active:scale-95 border border-white/10">
                  <Wrench size={16} className="text-white fill-white/20"/> 
                  <span>ONARIM BAŞLAT</span>
              </Link>

              <button onClick={() => setMenuAcik(!menuAcik)} className="xl:hidden p-2 text-slate-300 hover:text-white transition-colors">
                    {menuAcik ? <X size={28}/> : <Menu size={28}/>}
              </button>
          </div>
        </div>
        
        {/* MOBİL MENÜ */}
        {menuAcik && (
          <div className="xl:hidden fixed top-20 left-0 w-full bg-[#0b0e14] border-b border-white/10 p-6 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-2 z-50">
              {[ { href: "/", label: "Ana Sayfa", icon: Home }, { href: "/cihaz-sorgula", label: "Cihaz Sorgula", icon: Search }, { href: "/magaza", label: "Mağaza", icon: ShoppingBag } ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuAcik(false)} className="py-4 px-4 rounded-lg font-bold flex items-center gap-4 text-slate-400 hover:bg-white/5 hover:text-white">
                  <item.icon size={20}/> {item.label}
                </Link>
              ))}
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* BAŞLIK & ARAMA */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/10 pb-8 mt-4">
           <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2 uppercase tracking-widest text-xs">
                 <Star size={14} fill="currentColor" /> Güvenilir Mağaza
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">AURA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">STORE</span></h1>
              <p className="text-slate-400 mt-2 font-light">Revize edilmiş, garantili ve test edilmiş teknolojik ürünler.</p>
           </div>
           <div className="w-full md:w-auto relative group">
               <input type="text" placeholder="Ürün Ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-80 bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-cyan-500 transition-all placeholder:text-slate-500"/>
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
           </div>
        </div>

        {/* KATEGORİLER */}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${category === cat.id ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                    <cat.icon size={16} /> {cat.label}
                </button>
            ))}
        </div>

        {/* ÜRÜN LİSTESİ */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div><p className="text-slate-500 text-sm font-bold animate-pulse tracking-widest uppercase">Yükleniyor...</p></div>
        ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30"><ShoppingBag size={48} className="mb-4 opacity-50"/><p>Ürün bulunamadı.</p></div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                {filteredProducts.map((urun) => {
                    let rawImage = urun.image || ""; 
                    const hasImage = rawImage && rawImage.length > 5;
                    return (
                        <div key={urun.id} onClick={() => router.push(`/magaza/${urun.id}`)} className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all group hover:-translate-y-2 cursor-pointer flex flex-col">
                            <div className="h-60 bg-[#1e293b] relative flex items-center justify-center overflow-hidden border-b border-slate-800">
                                {hasImage ? (<img src={rawImage} alt={urun.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />) : (<div className="flex flex-col items-center gap-2 text-slate-600"><ImageIcon size={48}/><span className="text-[10px] font-bold uppercase">Görsel Yok</span></div>)}
                                <div className="absolute top-3 left-3"><span className="bg-cyan-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider">{urun.category}</span></div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-4 group-hover:text-cyan-400 transition-colors min-h-[40px]">{urun.name}</h3>
                                <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                                    <div><span className="text-[10px] text-slate-500 font-bold block uppercase">Fiyat</span><span className="text-xl font-black text-white">{Number(urun.price).toLocaleString('tr-TR')} ₺</span></div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-lg"><ArrowRight size={18}/></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      <footer className="bg-[#020617] border-t border-white/5 pt-20 pb-10 mt-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/20"><Wrench size={16} className="text-white"/></div>
                            <div className="font-extrabold text-xl tracking-tight leading-none text-white flex items-center gap-1">AURA<span className="text-cyan-400">BİLİŞİM</span></div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">Teknolojiniz için laboratuvar standartlarında onarım merkezi.</p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-cyan-600 hover:text-white transition-all"><Instagram size={18}/></a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-cyan-600 hover:text-white transition-all"><Twitter size={18}/></a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-cyan-600 hover:text-white transition-all"><Facebook size={18}/></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6">İletişim</h4>
                        <ul className="space-y-5 text-sm text-slate-500">
                            <li className="flex items-start gap-3"><div className="p-2 bg-slate-800 rounded-lg text-slate-300 shrink-0"><MapPin size={16}/></div><span>Beylikdüzü / İstanbul</span></li>
                            <li className="flex items-center gap-3"><div className="p-2 bg-slate-800 rounded-lg text-slate-300 shrink-0"><Phone size={16}/></div><span>0539 632 14 29</span></li>
                        </ul>
                    </div>
                </div>
            </div>
      </footer>
    </main>
  );
}