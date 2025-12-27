"use client";

import { useState } from "react";
import { Plus, Minus, Search, HelpCircle, Bot, Smartphone, Watch, Laptop, Layers } from "lucide-react";

export default function SSS() {
  const [acikSoru, setAcikSoru] = useState<number | null>(0);
  const [arama, setArama] = useState("");
  const [aktifKategori, setAktifKategori] = useState("Tümü");

  const kategoriler = ["Tümü", "Robot Süpürge", "Cep Telefonu", "Bilgisayar & Diğer", "Genel Süreç"];

  // DİKKAT: Verilerde eksik olmamasına özen gösterdim.
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

  // HATA ÇÖZÜMÜ: Güvenli Filtreleme
  const filtrelenmisSorular = sorular.filter(item => {
    // Önce değerlerin var olup olmadığını (null/undefined) kontrol ediyoruz
    const soruMetni = item.s ? item.s.toLowerCase() : "";
    const cevapMetni = item.c ? item.c.toLowerCase() : "";
    const aranan = arama.toLowerCase();

    const aramaUyumu = soruMetni.includes(aranan) || cevapMetni.includes(aranan);
    const kategoriUyumu = aktifKategori === "Tümü" || item.kategori === aktifKategori;
    
    return aramaUyumu && kategoriUyumu;
  });

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 pt-32 pb-20 font-sans">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-4">Sıkça Sorulan Sorular</h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Teknik süreçler, robot süpürge bakımları ve cihaz onarımları hakkında merak ettiğiniz her şeyin cevabı burada.
            </p>
        </div>

        {/* ARAMA KUTUSU */}
        <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
            <input 
                type="text" 
                placeholder="Örn: Robot harita siliyor, Ekran değişimi..." 
                className="w-full bg-[#151921] border border-slate-800 rounded-2xl py-5 pl-14 pr-4 text-white focus:border-cyan-500 outline-none transition-all shadow-lg placeholder:text-slate-600"
                onChange={(e) => setArama(e.target.value)}
            />
        </div>

        {/* KATEGORİ SEÇİMİ */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {kategoriler.map((kat) => (
                <button 
                    key={kat}
                    onClick={() => setAktifKategori(kat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        aktifKategori === kat 
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.3)]' 
                        : 'bg-[#151921] text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                >
                    {kat}
                </button>
            ))}
        </div>

        {/* SORULAR LİSTESİ */}
        <div className="space-y-4">
            {filtrelenmisSorular.length > 0 ? (
                filtrelenmisSorular.map((item, index) => (
                    <div key={index} className={`bg-[#151921] border ${acikSoru === index ? 'border-cyan-500/40 bg-slate-900/50' : 'border-slate-800'} rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-700`}>
                        <button 
                            onClick={() => setAcikSoru(acikSoru === index ? null : index)}
                            className="w-full flex items-start text-left p-6 gap-4"
                        >
                            <div className={`mt-1 min-w-[24px] ${acikSoru === index ? 'text-cyan-400' : 'text-slate-500'}`}>
                                {item.kategori === "Robot Süpürge" ? <Bot size={24}/> : 
                                 item.kategori === "Cep Telefonu" ? <Smartphone size={24}/> :
                                 item.kategori === "Bilgisayar & Diğer" ? <Laptop size={24}/> :
                                 <Layers size={24}/>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold text-lg leading-snug ${acikSoru === index ? 'text-cyan-400' : 'text-white'}`}>{item.s}</span>
                                    {acikSoru === index ? <Minus className="text-cyan-500 shrink-0 ml-4"/> : <Plus className="text-slate-500 shrink-0 ml-4"/>}
                                </div>
                                <div className={`mt-4 text-slate-400 leading-relaxed text-sm md:text-base border-t border-white/5 pt-4 ${acikSoru === index ? 'block animate-in fade-in slide-in-from-top-2 duration-300' : 'hidden'}`}>
                                    {item.c}
                                </div>
                            </div>
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center py-16 text-slate-500 flex flex-col items-center border border-dashed border-slate-800 rounded-3xl">
                    <HelpCircle size={48} className="mb-4 opacity-20"/>
                    <p className="text-lg">Aradığınız kriterde soru bulunamadı.</p>
                    <button onClick={() => {setAktifKategori("Tümü"); setArama("");}} className="mt-4 text-cyan-500 font-bold hover:underline">Filtreleri Temizle</button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}