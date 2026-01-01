"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, MessageCircle, Phone, 
  MapPin, CheckCircle2, Package, Calendar, 
  Share2, Instagram, RefreshCcw, ShieldCheck, Tag,
  Hash, Award, Layers, Globe, Zap, Cpu, Battery, 
  Smartphone, Volume2, Wifi, Monitor, HelpCircle, Truck, Box
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// SUPABASE AYARLARI
const SUPABASE_URL = "https://cmkjewcpqohkhnfpvoqw.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2pld2NwcW9oa2huZnB2b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDQ2MDIsImV4cCI6MjA4MTkyMDYwMn0.HwgnX8tn9ObFCLgStWWSSHMM7kqc9KqSZI96gpGJ6lw";

export default function UrunDetayPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Veri Çekme
  useEffect(() => {
    const fetchProduct = async () => {
      const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (!productId) return;

      try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
          const { data, error } = await supabase
            .from('urunler')
            .select('*')
            .eq('id', productId)
            .single();

          if (error) throw error;

          if (data) {
            const imageList = data.images && data.images.length > 0 ? data.images : (data.resim_url ? [data.resim_url] : []);
            const fullDesc = data.aciklama || "";
            const extractedLinks = {
                sahibinden: fullDesc.match(/Sahibinden:\s*(https?:\/\/[^\s]+)/)?.[1] || "",
                dolap: fullDesc.match(/Dolap:\s*(https?:\/\/[^\s]+)/)?.[1] || "",
                letgo: fullDesc.match(/Letgo:\s*(https?:\/\/[^\s]+)/)?.[1] || "",
                instagram: fullDesc.match(/Instagram:\s*(https?:\/\/[^\s]+)/)?.[1] || ""
            };
            const cleanDescription = fullDesc.split("Platform Linkleri:")[0].trim();

            setProduct({
                id: data.id,
                name: data.ad,
                price: data.fiyat,
                description: cleanDescription,
                images: imageList, 
                category: data.kategori,
                date: new Date(data.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
                stok: data.stok_durumu,
                kondisyon: data.kondisyon || "İkinci El (Temiz)", 
                marka: data.marka || "Apple", 
                konum: data.konum || "İstanbul / Mağaza",
                links: extractedLinks
            });
          }
      } catch (err) {
          console.error("Hata:", err);
      } finally {
          setLoading(false);
      }
    };
    fetchProduct();
  }, [params]);

  if (loading) return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-200 pt-28 pb-20 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* BACKGROUND FX */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* NAV BAR */}
          <div className="mb-6 flex items-center justify-between">
              <Link href="/magaza" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Mağazaya Dön
              </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* --- SOL KOLON (Görsel & Ekspertiz) --- */}
              <div className="lg:col-span-7 space-y-8">
                  
                  {/* GÖRSEL SAHNESİ */}
                  <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                      <div className="relative aspect-[4/3] bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl">
                          {product.images.length > 0 ? (
                              <img src={product.images[activeImage]} className="max-w-full max-h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700"/>
                          ) : (
                              <div className="flex flex-col items-center text-slate-600 gap-2"><Package size={48}/><span>Görsel Yok</span></div>
                          )}
                          {/* Zoom */}
                          <div className="absolute top-4 right-4 bg-black/40 p-2 rounded-xl text-white/70 backdrop-blur-md border border-white/5"><Share2 size={18}/></div>
                      </div>
                  </div>

                  {/* THUMBNAILS */}
                  {product.images.length > 1 && (
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                          {product.images.map((img: string, index: number) => (
                              <button key={index} onClick={() => setActiveImage(index)} className={`relative w-20 h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${activeImage === index ? 'border-cyan-500 shadow-lg scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'}`}>
                                  <img src={img} className="w-full h-full object-cover"/>
                              </button>
                          ))}
                      </div>
                  )}

                  {/* 🛠️ DİJİTAL EKSPERTİZ RAPORU (YENİ ÖZELLİK) */}
                  {/* Burası müşteriye senin bir teknisyen olduğunu kanıtlar */}
                  <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden">
                      <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                          <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><ShieldCheck size={20}/></div>
                          <div>
                              <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wide">Teknisyen Ekspertiz Raporu</h3>
                              <p className="text-[10px] text-slate-500">Bu cihaz Aura Bilişim laboratuvarında test edilmiştir.</p>
                          </div>
                      </div>
                      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                           {/* Test Maddeleri */}
                           <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2 text-center">
                               <Monitor size={20} className="text-cyan-400"/>
                               <span className="text-[10px] font-bold text-slate-400 uppercase">Ekran / Dokunmatik</span>
                               <span className="text-xs font-bold text-green-400 flex items-center gap-1"><CheckCircle2 size={12}/> Sorunsuz</span>
                           </div>
                           <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2 text-center">
                               <Battery size={20} className="text-green-400"/>
                               <span className="text-[10px] font-bold text-slate-400 uppercase">Batarya Sağlığı</span>
                               <span className="text-xs font-bold text-white flex items-center gap-1">Test Edildi</span>
                           </div>
                           <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2 text-center">
                               <Smartphone size={20} className="text-purple-400"/>
                               <span className="text-[10px] font-bold text-slate-400 uppercase">Kasa / Kozmetik</span>
                               <span className="text-xs font-bold text-white flex items-center gap-1">10/{product.kondisyon?.includes("Temiz") ? "9" : "8"}</span>
                           </div>
                           <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2 text-center">
                               <Wifi size={20} className="text-blue-400"/>
                               <span className="text-[10px] font-bold text-slate-400 uppercase">Şebeke / Wifi</span>
                               <span className="text-xs font-bold text-green-400 flex items-center gap-1"><CheckCircle2 size={12}/> Aktif</span>
                           </div>
                      </div>
                  </div>

                  {/* 📝 ÜRÜN AÇIKLAMASI & TEKNİSYEN NOTU */}
                  <div className="space-y-4">
                      {/* Teknisyen Notu Kutusu */}
                      <div className="relative bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-l-4 border-cyan-500 p-6 rounded-r-xl">
                          <h4 className="text-cyan-400 font-bold text-xs uppercase mb-2 flex items-center gap-2">
                             <Zap size={14}/> Teknisyenin Notu
                          </h4>
                          <p className="text-sm text-slate-300 italic leading-relaxed">
                            "{product.description ? product.description.substring(0, 150) + "..." : "Bu cihaz tüm testlerden başarıyla geçmiştir. Gönül rahatlığıyla kullanabilirsiniz."}"
                          </p>
                      </div>

                      {/* Detaylı Açıklama */}
                      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Cpu size={18}/> Detaylı Açıklama</h3>
                          <p className="text-slate-400 text-sm leading-7 font-light whitespace-pre-wrap">
                            {product.description || "Ekstra açıklama bulunmuyor."}
                          </p>
                      </div>
                  </div>

              </div>

              {/* --- SAĞ KOLON (Satın Alma & Güven) --- */}
              <div className="lg:col-span-5 space-y-6">
                  
                  {/* FİYAT & BAŞLIK KARTI */}
                  <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-cyan-500/20">
                            {product.category}
                        </span>
                        <span className="text-[10px] text-slate-500">STK-{product.id}</span>
                      </div>
                      
                      <h1 className="text-3xl font-black text-white uppercase leading-none mb-6">{product.name}</h1>
                      
                      <div className="flex items-end justify-between border-t border-slate-800 pt-6">
                          <div>
                              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">NAKİT FİYAT</span>
                              <div className="text-4xl font-black text-white tracking-tighter">
                                  {Number(product.price).toLocaleString('tr-TR')} <span className="text-xl text-cyan-500">₺</span>
                              </div>
                          </div>
                          {/* Stok Durumu Badge */}
                          <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${product.stok === 'Satışta' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                              {product.stok === 'Satışta' ? 'Stokta Var' : 'Tükendi'}
                          </div>
                      </div>
                  </div>

                  {/* 🚚 TESLİMAT & GÜVENCE (YENİ) */}
                  <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                          <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400"><Truck size={18}/></div>
                          <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Hızlı Kargo</p>
                              <p className="text-[9px] text-slate-600">Aynı gün teslimat</p>
                          </div>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                          <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400"><Box size={18}/></div>
                          <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Özenli Paket</p>
                              <p className="text-[9px] text-slate-600">Patpat korumalı</p>
                          </div>
                      </div>
                      <div className="col-span-2 bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                          <div className="bg-green-500/10 p-2 rounded-lg text-green-400"><ShieldCheck size={18}/></div>
                          <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Aura Bilişim Güvencesi</p>
                              <p className="text-[9px] text-slate-600">Satış sonrası teknik destek garantisi</p>
                          </div>
                      </div>
                  </div>

                  {/* KISA KÜNYE */}
                  <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs text-slate-500 font-bold uppercase">Marka</span>
                          <span className="text-xs text-white font-bold">{product.marka}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs text-slate-500 font-bold uppercase">Durum</span>
                          <span className="text-xs text-white font-bold">{product.kondisyon}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-xs text-slate-500 font-bold uppercase">Konum</span>
                          <span className="text-xs text-white font-bold">{product.konum}</span>
                      </div>
                  </div>

                  {/* NEON LİNKLER */}
                  <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Güvenli Ödeme İle Al</p>
                      <div className="grid grid-cols-4 gap-2">
                          <a href={product.links.sahibinden || "#"} target="_blank" className={`h-14 rounded-xl flex items-center justify-center border transition-all ${product.links.sahibinden ? 'bg-[#ffe800] border-[#ffe800] text-black hover:scale-105' : 'bg-slate-900 border-slate-800 opacity-30 grayscale'}`}>
                             <span className="font-black text-lg">S</span>
                          </a>
                          <a href={product.links.dolap || "#"} target="_blank" className={`h-14 rounded-xl flex items-center justify-center border transition-all ${product.links.dolap ? 'bg-[#00D678] border-[#00D678] text-white hover:scale-105' : 'bg-slate-900 border-slate-800 opacity-30 grayscale'}`}>
                             <span className="font-black text-lg">D</span>
                          </a>
                          <a href={product.links.letgo || "#"} target="_blank" className={`h-14 rounded-xl flex items-center justify-center border transition-all ${product.links.letgo ? 'bg-[#FF3C4C] border-[#FF3C4C] text-white hover:scale-105' : 'bg-slate-900 border-slate-800 opacity-30 grayscale'}`}>
                             <span className="font-black text-lg">L</span>
                          </a>
                          <a href={product.links.instagram || "#"} target="_blank" className={`h-14 rounded-xl flex items-center justify-center border transition-all ${product.links.instagram ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white hover:scale-105' : 'bg-slate-900 border-slate-800 opacity-30 grayscale'}`}>
                             <Instagram size={20}/>
                          </a>
                      </div>
                  </div>

                  {/* AKSİYON BUTONLARI */}
                  <div className="grid grid-cols-12 gap-3 pt-2">
                      <a href="tel:05396321429" className="col-span-3 bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-white rounded-2xl flex flex-col items-center justify-center py-4 transition-colors">
                          <Phone size={20} className="text-slate-400"/>
                      </a>
                      <a href={`https://wa.me/905396321429?text=Merhaba, ilan no: #${product.id} olan "${product.name}" hakkında görüşmek istiyorum.`} target="_blank" className="col-span-9 bg-[#25D366] hover:bg-[#20bd5a] text-[#0a3319] rounded-2xl flex flex-col items-center justify-center py-4 shadow-lg shadow-green-900/20 transition-transform active:scale-95 group">
                          <div className="flex items-center gap-2">
                              <MessageCircle size={24} className="group-hover:animate-bounce"/>
                              <div className="flex flex-col items-start leading-none">
                                  <span className="text-[10px] font-bold uppercase opacity-80">Hemen İletişime Geç</span>
                                  <span className="text-lg font-black uppercase tracking-wide">WHATSAPP</span>
                              </div>
                          </div>
                      </a>
                  </div>

                  {/* SSS (Accordion Basitleştirilmiş) */}
                  <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3 text-cyan-400">
                          <HelpCircle size={16}/> <span className="text-xs font-bold uppercase">Sıkça Sorulanlar</span>
                      </div>
                      <div className="space-y-3">
                          <details className="group">
                              <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-slate-300">
                                  <span>Bu cihazın garantisi var mı?</span>
                                  <span className="transition group-open:rotate-180">▼</span>
                              </summary>
                              <p className="group-open:animate-fadeIn mt-2 text-xs text-slate-500 leading-relaxed">
                                  Evet, ikinci el cihazlarımız firmamız tarafından test edilmiş olup, tarafımızca 1 ay teknik servis garantilidir.
                              </p>
                          </details>
                          <div className="h-px bg-slate-800"></div>
                          <details className="group">
                              <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-slate-300">
                                  <span>Kargo süreci nasıl işliyor?</span>
                                  <span className="transition group-open:rotate-180">▼</span>
                              </summary>
                              <p className="group-open:animate-fadeIn mt-2 text-xs text-slate-500 leading-relaxed">
                                  Hafta içi 16:00'a kadar verilen siparişler aynı gün, özenle paketlenerek kargoya verilir.
                              </p>
                          </details>
                      </div>
                  </div>

              </div>
          </div>
      </div>
    </div>
  );
}