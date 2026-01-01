"use client";

import { useState } from "react";
import { Plus, Minus, Search, HelpCircle, Bot, Smartphone, Watch, Laptop, Layers, Zap } from "lucide-react";

export default function SSS() {
  const [acikSoru, setAcikSoru] = useState<number | null>(0);
  const [arama, setArama] = useState("");
  const [aktifKategori, setAktifKategori] = useState("Tümü");

  const kategoriler = [
    { id: "Tümü", label: "Tümü", icon: Layers },
    { id: "Robot Süpürge", label: "Robot", icon: Bot },
    { id: "Cep Telefonu", label: "Telefon", icon: Smartphone },
    { id: "Bilgisayar & Diğer", label: "Bilgisayar", icon: Laptop },
    { id: "Genel Süreç", label: "Süreç", icon: HelpCircle },
  ];

  const sorular = [
    { 
      kategori: "Robot Süpürge",
      s: "Robot süpürgem haritalamayı unutuyor veya LIDAR hatası veriyor.", 
      c: "Bu durum genellikle lazer sensör (Lidar) motorunun tozlanması veya arızalanmasından kaynaklanır. Servisimizde Lidar ünitesi sökülerek optik kalibrasyon ve motor bakımı yapılır." 
    },
    { 
      kategori: "Robot Süpürge",
      s: "Robot süpürgem su akıtmıyor / paspas yapmıyor.", 
      c: "Su tankı içerisindeki peristaltik pompaların kireçlenmesi veya hava yapması sık görülen bir sorundur. Özel solüsyonlarla pompa kanallarını açıyor, elektronik devreleri test ediyoruz." 
    },
    { 
      kategori: "Robot Süpürge",
      s: "Batarya süresi çok kısaldı, istasyona dönmeden kapanıyor.", 
      c: "Lityum-iyon pillerin belirli bir şarj döngüsü vardır. Kapasitesi düşen bataryaları, yüksek amperli ve garantili hücrelerle yeniliyoruz." 
    },
    { 
      kategori: "Cep Telefonu",
      s: "Ekran değişiminden sonra 'Bilinmeyen Parça' uyarısı alır mıyım?", 
      c: "Yeni nesil iPhone modellerinde bu uyarı çıkar. Ancak Aura Bilişim laboratuvarında, eski ekranınızdaki entegreyi yeni ekrana aktararak (IC Transfer) bu uyarının çıkmamasını sağlıyoruz." 
    },
    { 
      kategori: "Cep Telefonu",
      s: "Sadece ön camım çatlak, görüntü var. Komple ekran mı değişmeli?", 
      c: "Hayır! Eğer dokunmatik çalışıyor ve görüntüde sorun yoksa, -150 derece soğutma teknolojisi ile sadece kırık ön camı değiştiriyoruz. Bu işlem çok daha ekonomiktir." 
    },
    { 
      kategori: "Cep Telefonu",
      s: "Sıvı teması olan cihazım kurtarılabilir mi?", 
      c: "Zaman en kritik faktördür. Cihazı şarja takmadan hemen bize ulaştırmalısınız. Anakartı özel kimyasallarla ultrasonik banyoda temizliyor ve onarıyoruz." 
    },
    { 
      kategori: "Bilgisayar & Diğer",
      s: "Laptopum çok ısınıyor ve fan sesi çok yüksek.", 
      c: "Termal macun zamanla kurur. Cihazınızı söküp fan ızgaralarındaki toz bloklarını temizliyor ve endüstriyel sınıf termal macun uygulaması yapıyoruz." 
    },
    { 
      kategori: "Bilgisayar & Diğer",
      s: "Akıllı saatimin arka camı sensörleri çalışmıyor.", 
      c: "Arka cam kırıklarında sensörler zarar görebilir. Saatin su geçirmezlik özelliğini bozmadan, lazer teknoloji ile arka camı değiştiriyoruz." 
    },
    { 
      kategori: "Genel Süreç",
      s: "Cihazımı kargolarken nelere dikkat etmeliyim?", 
      c: "Cihazı orijinal kutusuna koymanız en iyisidir. Yoksa, balonlu naylona sarıp sert bir karton kutuya koymalısınız. Kutunun içinde cihaz hareket etmemelidir." 
    },
    { 
      kategori: "Genel Süreç",
      s: "Veri gizliliği konusunda ne kadar hassassınız?", 
      c: "Laboratuvarımızda 'Veri Etiği' protokolü uygulanır. Cihazınız onarılırken kişisel alanlara (galeri, notlar vb.) erişim yasaktır." 
    },
    { 
      kategori: "Genel Süreç",
      s: "Yaptığınız işlemler garantili mi?", 
      c: "Evet, yaptığımız tüm parça değişimlerinde ve işçilikte 6 ay garanti sunuyoruz. Kullanıcı hatası dışındaki durumlarda ücretsiz destek sağlıyoruz." 
    }
  ];

  const filtrelenmisSorular = sorular.filter(item => {
    const soruMetni = item.s ? item.s.toLowerCase() : "";
    const cevapMetni = item.c ? item.c.toLowerCase() : "";
    const aranan = arama.toLowerCase();
    const aramaUyumu = soruMetni.includes(aranan) || cevapMetni.includes(aranan);
    const kategoriUyumu = aktifKategori === "Tümü" || item.kategori === aktifKategori;
    return aramaUyumu && kategoriUyumu;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-20 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* ARKA PLAN EFEKTLERİ */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyan-900/10 to-transparent"></div>
          <div className="absolute top-32 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        {/* BAŞLIK */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Zap size={14} className="fill-current"/> Bilgi Merkezi
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Nasıl Yardımcı <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Olabiliriz?</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
              Teknik süreçler, robot süpürge bakımları ve cihaz onarımları hakkında aklınıza takılan her şeyin cevabı burada.
            </p>
        </div>

        {/* ARAMA KUTUSU */}
        <div className="relative mb-12 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-[#0B1120] rounded-2xl flex items-center shadow-2xl">
                <Search className="absolute left-6 text-slate-500 group-hover:text-cyan-400 transition-colors" size={24}/>
                <input 
                    type="text" 
                    placeholder="Merak ettiğiniz konuyu arayın... (Örn: Lidar hatası)" 
                    className="w-full bg-transparent py-6 pl-16 pr-6 text-white text-lg font-medium outline-none placeholder:text-slate-600"
                    onChange={(e) => setArama(e.target.value)}
                />
            </div>
        </div>

        {/* KATEGORİ SEÇİMİ */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {kategoriler.map((kat) => (
                <button 
                    key={kat.id}
                    onClick={() => setAktifKategori(kat.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all border ${
                        aktifKategori === kat.id 
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.4)] scale-105' 
                        : 'bg-[#151921] text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white hover:bg-[#1e2430]'
                    }`}
                >
                    <kat.icon size={16}/> {kat.label}
                </button>
            ))}
        </div>

        {/* SORULAR LİSTESİ */}
        <div className="space-y-4">
            {filtrelenmisSorular.length > 0 ? (
                filtrelenmisSorular.map((item, index) => (
                    <div 
                        key={index} 
                        className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                            acikSoru === index 
                            ? 'bg-[#151e32]/80 border-cyan-500/40 shadow-[0_0_30px_rgba(0,0,0,0.2)]' 
                            : 'bg-[#0f1420]/60 border-slate-800 hover:border-slate-600 hover:bg-[#151e32]'
                        }`}
                    >
                        <button 
                            onClick={() => setAcikSoru(acikSoru === index ? null : index)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg transition-colors ${acikSoru === index ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}`}>
                                    {item.kategori === "Robot Süpürge" ? <Bot size={20}/> : 
                                     item.kategori === "Cep Telefonu" ? <Smartphone size={20}/> :
                                     item.kategori === "Bilgisayar & Diğer" ? <Laptop size={20}/> :
                                     <HelpCircle size={20}/>}
                                </div>
                                <span className={`font-bold text-lg pr-4 ${acikSoru === index ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{item.s}</span>
                            </div>
                            <div className={`p-1 rounded-full border transition-all ${acikSoru === index ? 'rotate-180 border-cyan-500 text-cyan-400' : 'border-slate-700 text-slate-500'}`}>
                                <Minus size={16} className={acikSoru === index ? 'block' : 'hidden'}/>
                                <Plus size={16} className={acikSoru === index ? 'hidden' : 'block'}/>
                            </div>
                        </button>
                        
                        <div 
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${acikSoru === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="p-6 pt-0 pl-[4.5rem]">
                                <p className="text-slate-400 leading-relaxed border-l-2 border-cyan-500/30 pl-4">
                                    {item.c}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-[#0f1420]/50 rounded-3xl border border-dashed border-slate-800">
                    <div className="inline-block p-4 rounded-full bg-slate-800/50 mb-4"><HelpCircle size={40} className="text-slate-600"/></div>
                    <p className="text-xl font-bold text-white mb-2">Sonuç Bulunamadı</p>
                    <p className="text-slate-500 mb-6">Aradığınız kriterlere uygun bir soru yok gibi görünüyor.</p>
                    <button onClick={() => {setAktifKategori("Tümü"); setArama("");}} className="text-cyan-400 font-bold hover:text-cyan-300 underline underline-offset-4">Filtreleri Temizle</button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}