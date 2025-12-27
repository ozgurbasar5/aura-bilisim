"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Share2, ShieldCheck, Box, RefreshCw, 
  Phone, MessageCircle, Calendar, Tag, Hash, 
  Cpu, Maximize2, Truck, Wallet, CheckCircle2, Layers, ExternalLink,
  Wrench, ShoppingBag, Search, Instagram, Facebook, Twitter, MapPin, Mail, Lock, 
  FileCheck, BadgeCheck
} from "lucide-react";

export default function UrunDetaySayfasi() {
  const params = useParams();
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

  if (!product) return (
    <div className="min-h-screen bg-[#02040a] flex flex-col items-center justify-center text-white gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_#06b6d4]"></div>
        <p className="text-slate-500 text-sm">Ürün bilgileri yükleniyor...</p>
        <Link href="/satis" className="text-cyan-500 hover:underline text-xs">Mağazaya Dön</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#02040a] text-slate-200 font-sans pb-20 selection:bg-cyan-500/30 overflow-x-hidden relative flex flex-col">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-[#020617]/90 backdrop-blur-md border-b border-white/5 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/20"><Wrench className="text-white" size={20}/></div>
             <div><h1 className="text-xl font-black tracking-tight leading-none text-white">AURA<span className="text-cyan-500">BİLİŞİM</span></h1><p className="text-[10px] text-slate-400 tracking-widest font-bold uppercase">Teknik Servis</p></div>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
             <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
             <Link href="/destek" className="hover:text-white transition-colors">Destek</Link>
             <Link href="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link>
             <Link href="/sss" className="hover:text-white transition-colors">S.S.S</Link>
             <Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/satis" className="hidden sm:flex items-center gap-2 text-white font-bold text-sm transition-all border border-purple-500 bg-purple-500/10 px-5 py-2.5 rounded-xl"><ShoppingBag size={18} className="text-purple-400"/> Aura Store</Link>
             <Link href="/onarim-talebi" className="hidden sm:flex items-center gap-2 bg-[#1e293b] hover:bg-[#283547] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-700 hover:border-cyan-500/50 shadow-lg"><Wrench size={18} className="text-cyan-400"/> Onarım Talebi</Link>
          </div>
        </div>
      </nav>

      {/* ARKA PLAN */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse"></div>
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/15 blur-[130px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[600px] bg-blue-700/15 blur-[160px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="container mx-auto px-4 pt-32 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 flex-1">
          
          <div className="lg:col-span-12 mb-[-20px] lg:mb-0">
             <Link href="/satis" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                <ArrowLeft size={16}/> Mağazaya Dön
             </Link>
          </div>

          {/* SOL TARAF (GÖRSEL & BİLGİ) */}
          <div className="lg:col-span-7 space-y-8">
              <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-purple-600/40 rounded-[2rem] blur-lg opacity-60 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-[#050505] rounded-[1.8rem] overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                          <img src={product.images[activeImage]} className="max-w-full max-h-full object-contain z-10 relative transition-transform duration-700 hover:scale-105" />
                      ) : (
                          <div className="text-slate-700 font-bold flex flex-col items-center gap-2"><ShoppingBag size={48} className="opacity-20"/>Görsel Yok</div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
                          <p className="text-white opacity-[0.03] font-black text-5xl md:text-8xl -rotate-12 tracking-[0.5em] uppercase whitespace-nowrap">AURA BİLİŞİM</p>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-2.5 rounded-xl text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10"><Maximize2 size={20}/></div>
                  </div>
              </div>
              
              {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                      {product.images.map((img: string, i: number) => (
                          <button key={i} onClick={() => setActiveImage(i)} className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === i ? 'border-cyan-500 shadow-[0_0_15px_#06b6d4_inset] opacity-100' : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'}`}>
                              <img src={img} className="w-full h-full object-cover" />
                          </button>
                      ))}
                  </div>
              )}

              {/* BİLGİ SEKMELERİ - GÜNCELLENDİ */}
              <div className="bg-[#0a0c14]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="flex border-b border-white/10 bg-black/40">
                      <button onClick={() => setActiveTab("aciklama")} className={`flex-1 py-5 text-center text-sm font-bold transition-all relative tracking-wide ${activeTab === "aciklama" ? "text-cyan-400 bg-white/5" : "text-slate-500 hover:text-slate-300"}`}>ÜRÜN AÇIKLAMASI {activeTab === "aciklama" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>}</button>
                      <button onClick={() => setActiveTab("guvenlik")} className={`flex-1 py-5 text-center text-sm font-bold transition-all relative tracking-wide ${activeTab === "guvenlik" ? "text-cyan-400 bg-white/5" : "text-slate-500 hover:text-slate-300"}`}>GÜVENLİK & TESLİMAT {activeTab === "guvenlik" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>}</button>
                  </div>
                  <div className="p-8 min-h-[250px]">
                      {activeTab === "aciklama" ? (
                          <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-slate-300 whitespace-pre-wrap font-medium">
                              {product.description || product.notes || "Bu ürün için satıcı tarafından detaylı bir açıklama girilmemiştir."}
                          </div>
                      ) : (
                          <div className="space-y-6">
                              {/* Güvenlik & Teslimat Detayları */}
                              <div className="flex gap-5 items-start group">
                                  <div className="p-3.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors"><FileCheck className="text-cyan-400" size={24}/></div>
                                  <div>
                                      <h4 className="font-bold text-white mb-1.5 text-lg">Teknik Servis Onaylı</h4>
                                      <p className="text-sm text-slate-400 leading-relaxed">Bu cihaz, Aura Bilişim laboratuvarlarında <strong>24 noktalı teknik kontrolden</strong> geçmiştir. Tüm fonksiyonları test edilmiş ve onaylanmıştır.</p>
                                  </div>
                              </div>
                              <div className="flex gap-5 items-start group">
                                  <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors"><ShieldCheck className="text-blue-400" size={24}/></div>
                                  <div>
                                      <h4 className="font-bold text-white mb-1.5 text-lg">Mağaza Garantisi</h4>
                                      <p className="text-sm text-slate-400 leading-relaxed">Satın aldığınız ürün, aksi belirtilmedikçe <strong>3 Ay Aura Bilişim Mağaza Garantisi</strong> altındadır. Sorun durumunda birebir destek sağlanır.</p>
                                  </div>
                              </div>
                              <div className="flex gap-5 items-start group">
                                  <div className="p-3.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors"><Truck className="text-purple-400" size={24}/></div>
                                  <div>
                                      <h4 className="font-bold text-white mb-1.5 text-lg">Güvenli Kargo & Paketleme</h4>
                                      <p className="text-sm text-slate-400 leading-relaxed">Şehir dışı gönderimlerde havalı ambalaj ve darbe emici kutu kullanılır. Kargoya verilmeden önce cihazın çalışır durumdaki videosu tarafınıza iletilir.</p>
                                  </div>
                              </div>
                              <div className="flex gap-5 items-start group">
                                  <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors"><BadgeCheck className="text-emerald-400" size={24}/></div>
                                  <div>
                                      <h4 className="font-bold text-white mb-1.5 text-lg">Elden Teslim & Test</h4>
                                      <p className="text-sm text-slate-400 leading-relaxed">Dilerseniz İstanbul/Beylikdüzü şubemize gelerek cihazı yerinde inceleyebilir, test edebilir ve elden teslim alabilirsiniz.</p>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* SAĞ TARAF (FİYAT & KÜNYE) */}
          <div className="lg:col-span-5 space-y-8">
              <div className="space-y-5">
                  <div>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="bg-cyan-950/60 text-cyan-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]">{product.category}</span>
                          <span className="text-slate-500 text-xs font-mono flex items-center gap-1"><Calendar size={12}/> {product.date}</span>
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

              {/* --- ÜRÜN KÜNYESİ (DETAYLANDIRILDI) --- */}
              <div className="bg-[#0a0c14]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-7">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-white/5 pb-3"><Tag size={16} className="text-cyan-500"/> Ürün Künyesi</h3>
                  <div className="space-y-4">
                      {/* Mevcut Veriler */}
                      <DetailRow icon={<Hash/>} label="İLAN NO" value={`#${product.id}`} />
                      <DetailRow icon={<Calendar/>} label="İLAN TARİHİ" value={product.date} />
                      <DetailRow icon={<Layers/>} label="KATEGORİ" value={product.category} valueColor="text-cyan-400" />
                      
                      {/* Statik / Mantıksal Eklemeler */}
                      <DetailRow icon={<BadgeCheck/>} label="DURUM" value="İkinci El (Kontrol Edilmiş)" />
                      <DetailRow icon={<ShieldCheck/>} label="GARANTİ" value="Var (Mağaza Garantili)" valueColor="text-green-400" />
                      <DetailRow icon={<MapPin/>} label="KONUM" value="İstanbul / Beylikdüzü" />

                      <div className="h-px bg-white/10 my-4"></div>

                      <div className="grid grid-cols-2 gap-3">
                          <FeatureBadge icon={<ShieldCheck/>} label="GARANTİLİ" color="text-green-400" border="border-green-500/30" bg="bg-green-500/10"/>
                          <FeatureBadge icon={<Box/>} label="STOKTA VAR" color="text-orange-400" border="border-orange-500/30" bg="bg-orange-500/10"/>
                          <FeatureBadge icon={<RefreshCw/>} label="TAKAS İMKANI" color="text-blue-400" border="border-blue-500/30" bg="bg-blue-500/10"/>
                      </div>
                  </div>
              </div>

              {/* Platform Linkleri */}
              {(product.sahibindenLink || product.dolapLink || product.letgoLink || product.instagramLink) && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {product.sahibindenLink && <PlatformBtn name="SAHİBİNDEN" link={product.sahibindenLink} color="from-yellow-600/80 to-yellow-500/80" borderColor="border-yellow-400/30" icon="S" />}
                      {/* ... Diğerleri ... */}
                  </div>
              )}

              {/* İletişim */}
              <div className="grid grid-cols-5 gap-4 pt-4">
                  <a href="tel:+905396321429" className="col-span-2 group bg-[#151515] hover:bg-[#252525] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 transition-all active:scale-95">
                      <Phone size={24} className="text-slate-400 group-hover:text-white mb-1 transition-colors"/>
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-white tracking-wider">ARA</span>
                  </a>
                  <a href={`https://wa.me/905396321429?text=Merhaba, ${product.name} (ID: ${product.id}) hakkında bilgi almak istiyorum.`} target="_blank" className="col-span-3 bg-green-600 hover:bg-green-500 text-white rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg shadow-green-900/30 transition-all active:scale-95 group border border-white/10">
                      <MessageCircle size={28} className="mb-1 group-hover:rotate-12 transition-transform"/>
                      <span className="text-xs font-black tracking-widest">WHATSAPP</span>
                  </a>
              </div>
          </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10 mt-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6"><div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center"><Wrench size={16} className="text-white"/></div><span className="font-black text-xl italic">AURA</span></div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">Teknolojiniz için laboratuvar standartlarında onarım merkezi.</p>
                        <div className="flex gap-4"><SocialIcon icon={<Instagram size={18}/>}/><SocialIcon icon={<Facebook size={18}/>}/><SocialIcon icon={<Twitter size={18}/>}/></div>
                    </div>
                    <div><h4 className="font-bold text-white mb-6">Hızlı Erişim</h4><ul className="space-y-4 text-sm text-slate-500"><li><Link href="/" className="hover:text-cyan-400">Ana Sayfa</Link></li><li><Link href="/sorgula" className="hover:text-cyan-400">Cihaz Durumu Sorgula</Link></li><li><Link href="/satis" className="hover:text-cyan-400">Aura Store</Link></li><li><Link href="/onarim-talebi" className="hover:text-cyan-400">Onarım Başvurusu</Link></li></ul></div>
                    <div><h4 className="font-bold text-white mb-6">Hizmetlerimiz</h4><ul className="space-y-4 text-sm text-slate-500"><li><Link href="#" className="hover:text-cyan-400">• iPhone Ekran Değişimi</Link></li><li><Link href="#" className="hover:text-cyan-400">• Roborock Batarya Yenileme</Link></li><li><Link href="#" className="hover:text-cyan-400">• Macbook Anakart Onarım</Link></li></ul></div>
                    <div><h4 className="font-bold text-white mb-6">İletişim</h4><ul className="space-y-4 text-sm text-slate-500"><li className="flex items-start gap-3"><MapPin size={18} className="text-cyan-600"/> Beylikdüzü / İstanbul</li><li className="flex items-center gap-3"><Phone size={18} className="text-cyan-600"/> 0539 632 1429</li><li className="flex items-center gap-3"><Mail size={18} className="text-cyan-600"/> destek@aurabilisim.com</li></ul></div>
                </div>
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-medium">
                    <p>&copy; 2024 Aura Bilişim.</p>
                    <div className="flex gap-6"><Link href="#" className="hover:text-slate-400">KVKK</Link><Link href="#" className="hover:text-slate-400">Çerez Politikası</Link><Link href="/login" className="hover:text-red-500 transition-colors flex items-center gap-1"><Lock size={10}/> Personel Girişi</Link></div>
                </div>
            </div>
      </footer>
    </main>
  );
}

// Yardımcılar
function DetailRow({ icon, label, value, valueColor = "text-slate-200", bg }: any) {
    return (
        <div className={`flex justify-between items-center p-3.5 rounded-xl ${bg || 'hover:bg-white/5'} transition-colors group border border-transparent hover:border-white/5`}>
            <div className="flex items-center gap-3 text-slate-500 text-xs font-bold tracking-wide">
                <div className="text-slate-600 group-hover:text-cyan-500 transition-colors">{icon}</div><span>{label}</span>
            </div>
            <div className={`text-sm font-bold ${valueColor}`}>{value || "-"}</div>
        </div>
    )
}

function FeatureBadge({ icon, label, color, border, bg }: any) {
    return (
        <div className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${border} ${bg} ${color} transition-all hover:bg-opacity-20`}>
            {icon}<span className="text-[10px] font-black tracking-wider uppercase">{label}</span>
        </div>
    )
}

function PlatformBtn({ name, link, color, borderColor, icon }: any) {
    return (
        <a href={link} target="_blank" className={`relative group overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${color} backdrop-blur-md p-3 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 hover:shadow-xl active:scale-95`}>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-lg font-black text-white">{icon}</span>
            <span className="text-[8px] font-bold text-white tracking-widest">{name}</span>
            <ExternalLink size={10} className="absolute top-2 right-2 text-white/50 group-hover:text-white"/>
        </a>
    )
}

function SocialIcon({ icon }: any) {
    return <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-cyan-600 hover:text-white transition-all">{icon}</a>;
}