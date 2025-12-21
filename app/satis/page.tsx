"use client";

import { useState } from "react";
import { ShoppingBag, Star, Smartphone, Laptop, Zap, Filter, ArrowRight } from "lucide-react";

export default function SatisSayfasi() {
  const [kategori, setKategori] = useState("hepsi");

  // Örnek Ürün Verileri
  const urunler = [
    { id: 1, ad: "iPhone 13 Pro 128GB", tur: "telefon", fiyat: "38.500₺", etiket: "YENİLENMİŞ", resim: Smartphone, ozellik: ["Pil %100", "12 Ay Garanti"], renk: "purple" },
    { id: 2, ad: "RTX 4060 Gaming PC", tur: "pc", fiyat: "28.999₺", etiket: "FIRSAT", resim: Laptop, ozellik: ["Ryzen 5 5600", "16GB RAM"], renk: "cyan" },
    { id: 3, ad: "Roborock S7 Sonic", tur: "robot", fiyat: "14.250₺", etiket: "2. EL TEMİZ", resim: Zap, ozellik: ["Bakımlı", "6 Ay Garanti"], renk: "green" },
    { id: 4, ad: "Samsung S23 Ultra", tur: "telefon", fiyat: "42.000₺", etiket: "OUTLET", resim: Smartphone, ozellik: ["Çiziksiz", "Kutulu"], renk: "purple" },
    { id: 5, ad: "Monster Abra A5", tur: "pc", fiyat: "21.500₺", etiket: "ÖĞRENCİ", resim: Laptop, ozellik: ["GTX 1650", "8GB RAM"], renk: "cyan" },
    { id: 6, ad: "Xiaomi Mop Pro 2", tur: "robot", fiyat: "8.500₺", etiket: "EKONOMİK", resim: Zap, ozellik: ["Yeni Fırça", "Batarya Sıfır"], renk: "green" },
  ];

  const filtreliUrunler = kategori === "hepsi" ? urunler : urunler.filter(u => u.tur === kategori);

  return (
    <main className="min-h-screen bg-[#0F172A] text-white pt-24 pb-20 relative">
      <div className="container mx-auto px-6">
        
        {/* Başlık Alanı */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-white/10 pb-8">
           <div>
              <div className="flex items-center gap-2 text-yellow-500 font-bold mb-2">
                 <Star size={20} fill="currentColor" /> AURA STORE
              </div>
              <h1 className="text-4xl font-bold">Fırsat Ürünleri</h1>
              <p className="text-slate-400 mt-2">Teknisyen onaylı, garantili ikinci el ve sıfır cihazlar.</p>
           </div>
           
           {/* Kategori Butonları */}
           <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              <button onClick={() => setKategori("hepsi")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${kategori === 'hepsi' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Tümü</button>
              <button onClick={() => setKategori("telefon")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${kategori === 'telefon' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Telefon</button>
              <button onClick={() => setKategori("pc")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${kategori === 'pc' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Bilgisayar</button>
              <button onClick={() => setKategori("robot")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${kategori === 'robot' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Robot Süpürge</button>
           </div>
        </div>

        {/* Ürün Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {filtreliUrunler.map((urun) => (
             <div key={urun.id} className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4 hover:border-cyan-500/50 transition-all group hover:-translate-y-1">
                {/* Resim Alanı */}
                <div className="h-56 bg-slate-900 rounded-xl flex items-center justify-center relative mb-4 overflow-hidden">
                   <urun.resim size={80} className={`text-slate-600 group-hover:text-${urun.renk}-400 transition-colors duration-500`} />
                   <div className={`absolute top-3 left-3 bg-${urun.renk}-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg`}>
                      {urun.etiket}
                   </div>
                </div>

                {/* Bilgiler */}
                <h3 className="text-lg font-bold text-white mb-2">{urun.ad}</h3>
                <div className="flex gap-2 mb-4">
                   {urun.ozellik.map((oz, i) => (
                      <span key={i} className="bg-slate-800 text-xs text-slate-300 px-2 py-1 rounded">{oz}</span>
                   ))}
                </div>

                {/* Fiyat ve Buton */}
                <div className="flex items-center justify-between border-t border-slate-700 pt-4 mt-auto">
                   <span className={`text-xl font-bold text-${urun.renk}-400`}>{urun.fiyat}</span>
                   <button className="bg-white text-slate-900 p-2 rounded-lg hover:bg-cyan-500 hover:text-white transition-colors">
                      <ShoppingBag size={20} />
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Boş Durum Kontrolü */}
        {filtreliUrunler.length === 0 && (
           <div className="text-center py-20 text-slate-500">
              <Filter size={48} className="mx-auto mb-4 opacity-50" />
              <p>Bu kategoride şu an ürün bulunmuyor.</p>
           </div>
        )}

      </div>
    </main>
  );
}