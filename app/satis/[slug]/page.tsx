"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Share2, ShieldCheck, Box, RefreshCw, 
  Phone, MessageCircle, Calendar, Tag, Hash, 
  Cpu, Maximize2, Truck, Wallet, CheckCircle2, Layers, ExternalLink
} from "lucide-react";

export default function UrunDetaySayfasi() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("aciklama");

  // Slug Oluşturucu
  const createSlug = (name: string) => {
      return name.toLowerCase().replace(/ /g, "-").replace(/[ıİ]/g, "i").replace(/[ğĞ]/g, "g").replace(/[üÜ]/g, "u").replace(/[şŞ]/g, "s").replace(/[öÖ]/g, "o").replace(/[çÇ]/g, "c").replace(/[^a-z0-9-]/g, "");
  };

  useEffect(() => {
    const stored = localStorage.getItem("aura_store_products");
    if (stored) {
        const allProducts = JSON.parse(stored);
        const found = allProducts.find((p: any) => createSlug(p.name) === params.slug);
        if (found) setProduct(found);
    }
  }, [params.slug]);

  if (!product) return (<div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_#06b6d4]"></div></div>);

  return (
    <main className="min-h-screen bg-[#02040a] text-slate-200 font-sans pb-20 selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* --- ARKA PLAN (DAHA CANLI & RENKLİ) --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Sol Üst Mor Işık */}
          <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse"></div>
          {/* Sağ Orta Camgöbeği Işık */}
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/15 blur-[130px] rounded-full mix-blend-screen"></div>
          {/* Alt Mavi Işık */}
          <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[600px] bg-blue-700/15 blur-[160px] rounded-full mix-blend-screen"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6">
          <button onClick={() => router.back()} className="group flex items-center gap-3 text-white/90 hover:text-white transition-all bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> 
              <span className="text-sm font-bold tracking-wide">MAĞAZA</span>
          </button>
          
          <div className="flex gap-3">
             <button className="p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/90 hover:text-cyan-400 border border-white/10 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"><Share2 size={18}/></button>
          </div>
      </nav>

      <div className="container mx-auto px-4 pt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
          
          {/* ================= SOL TARAF (7 Birim) ================= */}
          <div className="lg:col-span-7 space-y-8">
              
              {/* --- BÜYÜK RESİM --- */}
              <div className="relative group">
                  {/* Neon Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-purple-600/40 rounded-[2rem] blur-lg opacity-60 group-hover:opacity-100 transition duration-1000"></div>
                  
                  <div className="relative bg-[#050505] rounded-[1.8rem] overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                          <img src={product.images[activeImage]} className="max-w-full max-h-full object-contain z-10 relative transition-transform duration-700 hover:scale-105" />
                      ) : (
                          <div className="text-slate-700 font-bold">Görsel Yok</div>
                      )}

                      {/* FİLİGRAN (SAYDAM) */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
                          <p className="text-white opacity-[0.03] font-black text-5xl md:text-8xl -rotate-12 tracking-[0.5em] uppercase whitespace-nowrap">AURA BİLİŞİM</p>
                      </div>

                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-2.5 rounded-xl text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10"><Maximize2 size={20}/></div>
                  </div>
              </div>

              {/* KÜÇÜK RESİMLER */}
              {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                      {product.images.map((img: string, i: number) => (
                          <button 
                            key={i} 
                            onClick={() => setActiveImage(i)}
                            className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === i ? 'border-cyan-500 shadow-[0_0_15px_#06b6d4_inset] opacity-100' : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'}`}
                          >
                              <img src={img} className="w-full h-full object-cover" />
                          </button>
                      ))}
                  </div>
              )}

              {/* --- BİLGİ SEKMELERİ --- */}
              <div className="bg-[#0a0c14]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Başlıklar */}
                  <div className="flex border-b border-white/10 bg-black/40">
                      <button onClick={() => setActiveTab("aciklama")} className={`flex-1 py-5 text-center text-sm font-bold transition-all relative tracking-wide ${activeTab === "aciklama" ? "text-cyan-400 bg-white/5" : "text-slate-500 hover:text-slate-300"}`}>
                          ÜRÜN AÇIKLAMASI
                          {activeTab === "aciklama" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>}
                      </button>
                      <button onClick={() => setActiveTab("guvenlik")} className={`flex-1 py-5 text-center text-sm font-bold transition-all relative tracking-wide ${activeTab === "guvenlik" ? "text-cyan-400 bg-white/5" : "text-slate-500 hover:text-slate-300"}`}>
                          GÜVENLİK & TESLİMAT
                          {activeTab === "guvenlik" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>}
                      </button>
                  </div>

                  {/* İçerik */}
                  <div className="p-8 min-h-[250px]">
                      {activeTab === "aciklama" ? (
                          <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-slate-300 whitespace-pre-wrap font-medium">
                              {product.notes || "Bu ürün için satıcı tarafından detaylı bir açıklama girilmemiştir."}
                          </div>
                      ) : (
                          <div className="space-y-6">
                              <div className="flex gap-5 items-start group">
                                  <div className="p-3.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors"><CheckCircle2 className="text-cyan-400" size={24}/></div>
                                  <div><h4 className="font-bold text-white mb-1.5 text-lg">Mağazada Test İmkanı</h4><p className="text-sm text-slate-400 leading-relaxed">Ürünü mağazamızda dilediğiniz kadar test edebilir, içinize sindikten sonra teslim alabilirsiniz.</p></div>
                              </div>
                              <div className="flex gap-5 items-start group">
                                  <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors"><Truck className="text-blue-400" size={24}/></div>
                                  <div><h4 className="font-bold text-white mb-1.5 text-lg">Kargo & Teslimat</h4><p className="text-sm text-slate-400 leading-relaxed">Şehir dışı gönderimlerde özel paketleme yapılır. Kargo öncesi detaylı video iletilir.</p></div>
                              </div>
                              <div className="flex gap-5 items-start group">
                                  <div className="p-3.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors"><Wallet className="text-purple-400" size={24}/></div>
                                  <div><h4 className="font-bold text-white mb-1.5 text-lg">Ödeme Yöntemleri</h4><p className="text-sm text-slate-400 leading-relaxed">Nakit veya Havale/EFT ile güvenli ödeme yapabilirsiniz.</p></div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* ================= SAĞ TARAF (5 Birim) ================= */}
          <div className="lg:col-span-5 space-y-8">
              
              {/* BAŞLIK & FİYAT */}
              <div className="space-y-5">
                  <div>
                      <div className="flex items-center gap-3 mb-3">
                          <span className="bg-cyan-950/60 text-cyan-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]">{product.category}</span>
                          {product.stockCode && <span className="text-slate-500 text-xs font-mono flex items-center gap-1"><Hash size={10}/> {product.stockCode}</span>}
                      </div>
                      <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">{product.name}</h1>
                  </div>

                  <div className="p-7 bg-gradient-to-br from-[#12141c] to-[#050505] rounded-[2rem] border border-white/10 shadow-2xl flex flex-col gap-1 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[90px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-500 pointer-events-none"></div>
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-widest z-10">NAKİT FİYAT</span>
                      <div className="flex items-baseline gap-2 z-10">
                          <span className="text-6xl font-black text-white tracking-tighter">{Number(product.price).toLocaleString('tr-TR')}</span>
                          <span className="text-3xl font-bold text-cyan-500">₺</span>
                      </div>
                  </div>
              </div>

              {/* --- ÜRÜN KÜNYESİ --- */}
              <div className="bg-[#0a0c14]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-7">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-white/5 pb-3">
                      <Tag size={16} className="text-cyan-500"/> Ürün Künyesi
                  </h3>
                  <div className="space-y-4">
                      <DetailRow icon={<Hash/>} label="İLAN NO" value={`#${product.id}`} />
                      <DetailRow icon={<Calendar/>} label="TARİH" value={product.dateAdded} />
                      <DetailRow icon={<Layers/>} label="MARKA" value={product.brand} valueColor="text-cyan-400" />
                      <DetailRow icon={<Cpu/>} label="KONDİSYON" value={product.condition} valueColor="text-white font-black" bg="bg-white/5" />

                      <div className="h-px bg-white/10 my-4"></div>

                      {/* Özellik Rozetleri */}
                      <div className="grid grid-cols-2 gap-3">
                          {product.warranty && <FeatureBadge icon={<ShieldCheck/>} label="GARANTİLİ" color="text-green-400" border="border-green-500/30" bg="bg-green-500/10"/>}
                          {product.box && <FeatureBadge icon={<Box/>} label="KUTU/FATURA" color="text-orange-400" border="border-orange-500/30" bg="bg-orange-500/10"/>}
                          {product.exchange && <FeatureBadge icon={<RefreshCw/>} label="TAKAS İMKANI" color="text-blue-400" border="border-blue-500/30" bg="bg-blue-500/10"/>}
                      </div>
                  </div>
              </div>

              {/* --- PLATFORM BUTONLARI --- */}
              {(product.sahibindenLink || product.dolapLink || product.letgoLink || product.instagramLink) && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {product.sahibindenLink && <PlatformBtn name="SAHİBİNDEN" link={product.sahibindenLink} color="from-yellow-600/80 to-yellow-500/80" borderColor="border-yellow-400/30" icon="S" />}
                      {product.dolapLink && <PlatformBtn name="DOLAP" link={product.dolapLink} color="from-green-600/80 to-green-500/80" borderColor="border-green-400/30" icon="D" />}
                      {product.letgoLink && <PlatformBtn name="LETGO" link={product.letgoLink} color="from-red-600/80 to-red-500/80" borderColor="border-red-400/30" icon="L" />}
                      {product.instagramLink && <PlatformBtn name="INSTAGRAM" link={product.instagramLink} color="from-purple-600/80 to-pink-500/80" borderColor="border-purple-400/30" icon="IG" />}
                  </div>
              )}

              {/* İLETİŞİM BUTONLARI (GÜNCELLENDİ) */}
              <div className="grid grid-cols-5 gap-4 pt-4">
                  <a href="tel:+905396321429" className="col-span-2 group bg-[#151515] hover:bg-[#252525] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 transition-all active:scale-95">
                      <Phone size={24} className="text-slate-400 group-hover:text-white mb-1 transition-colors"/>
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-white tracking-wider">ARA</span>
                  </a>
                  <a 
                      href={`https://wa.me/905396321429?text=Merhaba, ${product.name} (ID: ${product.id}) hakkında bilgi almak istiyorum.`}
                      target="_blank"
                      className="col-span-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg shadow-green-900/30 transition-all active:scale-95 group border border-white/10"
                  >
                      <MessageCircle size={28} className="mb-1 group-hover:rotate-12 transition-transform"/>
                      <span className="text-xs font-black tracking-widest">WHATSAPP</span>
                  </a>
              </div>

          </div>
      </div>
    </main>
  );
}

// --- YARDIMCI BİLEŞENLER ---

function DetailRow({ icon, label, value, valueColor = "text-slate-200", bg }: any) {
    return (
        <div className={`flex justify-between items-center p-3.5 rounded-xl ${bg || 'hover:bg-white/5'} transition-colors group border border-transparent hover:border-white/5`}>
            <div className="flex items-center gap-3 text-slate-500 text-xs font-bold tracking-wide">
                <div className="text-slate-600 group-hover:text-cyan-500 transition-colors">{icon}</div>
                <span>{label}</span>
            </div>
            <div className={`text-sm font-bold ${valueColor}`}>{value || "-"}</div>
        </div>
    )
}

function FeatureBadge({ icon, label, color, border, bg }: any) {
    return (
        <div className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${border} ${bg} ${color} transition-all hover:bg-opacity-20`}>
            {icon}
            <span className="text-[10px] font-black tracking-wider uppercase">{label}</span>
        </div>
    )
}

function PlatformBtn({ name, link, color, borderColor, icon }: any) {
    return (
        <a 
            href={link} 
            target="_blank" 
            className={`relative group overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${color} backdrop-blur-md p-3 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 hover:shadow-xl active:scale-95`}
        >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-lg font-black text-white">{icon}</span>
            <span className="text-[8px] font-bold text-white tracking-widest">{name}</span>
            <ExternalLink size={10} className="absolute top-2 right-2 text-white/50 group-hover:text-white"/>
        </a>
    )
}