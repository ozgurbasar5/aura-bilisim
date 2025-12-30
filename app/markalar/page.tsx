import React from "react";
import Link from "next/link";
import { 
  Smartphone, Bot, Laptop, Watch, Wifi, 
  ArrowLeft, CheckCircle2, Zap, Cpu, Server, Radio
} from "lucide-react";

export default function MarkalarPage() {

  const categories = [
    {
      id: "mobile",
      title: "Mobil & Tablet",
      subtitle: "Akıllı Cihaz Ekosistemi",
      description: "Amiral gemisi modellerden tabletlere kadar geniş kapsamlı anakart, ekran ve FaceID onarımı.",
      icon: Smartphone,
      color: "cyan",
      brands: [
        "Apple iPhone", "Samsung Galaxy", "Xiaomi", "Huawei", "Oppo", "Vivo", "OnePlus", 
        "Honor", "Realme", "Google Pixel", "POCO", "Redmi", "General Mobile", 
        "iPad Pro/Air", "Samsung Tab S", "Huawei MatePad"
      ]
    },
    {
      id: "robot",
      title: "Otonom Temizlik",
      subtitle: "Robot Süpürge Laboratuvarı",
      description: "Lidar sensör, sıvı teması ve anakart arızalarında uzmanlaştığımız premium markalar.",
      icon: Bot,
      color: "purple",
      brands: [
        "Roborock", "Xiaomi Vacuum", "Dreame", "Viomi", 
        "Ecovacs Deebot", "Dyson", "iRobot Roomba", "Anker Eufy", 
        "Roidmi", "Lydsto", "Tefal", "Rowenta"
      ]
    },
    {
      id: "laptop",
      title: "Bilgisayar & Laptop",
      subtitle: "Yüksek Performans Sistemleri",
      description: "Gaming laptoplar, iş istasyonları ve ultrabooklar için BGA chipset ve termal revizyon işlemleri.",
      icon: Laptop,
      color: "green",
      brands: [
        "Apple MacBook", "Monster Notebook", "Asus ROG/TUF", "MSI Gaming", 
        "Lenovo Legion", "Dell Alienware", "HP Omen", "Acer Predator", 
        "Casper Excalibur", "Huawei MateBook", "Microsoft Surface",
        "Razer Blade", "Gigabyte Aorus", "Toshiba", "Samsung Book"
      ]
    },
    {
      id: "watch",
      title: "Giyilebilir Teknoloji",
      subtitle: "Akıllı Saat Laboratuvarı",
      description: "Mikroskobik hassasiyet gerektiren akıllı saat ekran, batarya ve sensör onarımları.",
      icon: Watch,
      color: "rose", // Pembe/Kırmızı tonları
      brands: [
        "Apple Watch Ultra", "Apple Watch Series", "Samsung Galaxy Watch", 
        "Huawei Watch GT", "Xiaomi Watch", "Amazfit", "Garmin Fenix", 
        "Oppo Watch", "Honor Watch", "Fitbit"
      ]
    },
    {
      id: "ecosystem",
      title: "Akıllı Ev & IoT",
      subtitle: "Bağlantılı Yaşam Ürünleri",
      description: "Hayatınızı kolaylaştıran IoT cihazları ve görüntüleme sistemleri teknik servisi.",
      icon: Wifi,
      color: "orange",
      brands: [
        "Yeelight", "70mai (Araç Kamerası)", "Mieco", "Xiaomi Mi Box", 
        "Mi TV Stick", "Apple TV 4K", "Google Chromecast", "Amazon Fire TV",
        "Philips Hue", "Sonoff"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      
      {/* --- HERO HEADER --- */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Arka Plan Efektleri */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-900/30 to-transparent blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 mb-8 transition-all text-xs font-bold uppercase tracking-widest group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Ana Üsse Dön
            </Link>
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-white">
                Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">Partnerler.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                Laboratuvarımızda onarım protokolleri tanımlanmış, orijinal yedek parça stoğu bulunan ve aktif mühendislik desteği verdiğimiz teknoloji devleri.
            </p>
        </div>
      </section>

      {/* --- KATEGORİLER VE MARKALAR --- */}
      <section className="pb-32 relative z-10">
        <div className="container mx-auto px-6 space-y-32">
            
            {categories.map((cat, index) => (
                <div key={index} className="relative group">
                    
                    {/* Kategori Başlığı ve Dekoru */}
                    <div className="flex flex-col md:flex-row md:items-end gap-8 mb-12 relative">
                        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-transparent via-slate-700 to-transparent opacity-50 hidden md:block"></div>
                        
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-${cat.color}-500/20 to-transparent border border-${cat.color}-500/30 text-${cat.color}-400 shadow-[0_0_30px_rgba(0,0,0,0.2)]`}>
                            <cat.icon size={40} />
                        </div>
                        <div className="flex-1">
                            <span className={`text-${cat.color}-500 font-bold tracking-widest text-xs uppercase mb-2 block`}>{cat.subtitle}</span>
                            <h2 className="text-4xl font-black text-white mb-3">{cat.title}</h2>
                            <p className="text-slate-400 max-w-2xl text-lg font-light">{cat.description}</p>
                        </div>
                    </div>

                    {/* Marka Izgarası (Grid) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {cat.brands.map((brand, i) => (
                            <div key={i} className="group/card relative h-28 bg-[#0a0e17] border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                                
                                {/* Arka Plan Glow Efekti */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-${cat.color}-600/0 via-${cat.color}-600/0 to-${cat.color}-600/0 group-hover/card:via-${cat.color}-900/10 group-hover/card:to-${cat.color}-600/20 transition-all duration-500`}></div>
                                
                                <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center">
                                    {/* Marka İsmi */}
                                    <span className={`text-sm md:text-base font-bold text-slate-400 group-hover/card:text-white transition-colors duration-300`}>
                                        {brand}
                                    </span>
                                    
                                    {/* Alt Çizgi Animasyonu */}
                                    <div className={`w-0 h-[2px] bg-${cat.color}-500 mt-2 transition-all duration-300 group-hover/card:w-8`}></div>
                                </div>

                                {/* Köşe İkonu */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover/card:translate-x-0">
                                    <CheckCircle2 size={14} className={`text-${cat.color}-500`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

        </div>
      </section>

      {/* --- ALT ÇAĞRI (CTA) --- */}
      <section className="py-24 bg-[#010205] border-t border-white/5 relative overflow-hidden">
        {/* Dekoratif Çizgiler */}
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
                <Radio size={14} className="text-green-500 animate-pulse"/> Özel Destek Hattı
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Listenin Dışında Bir Cihazınız mı Var?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg">
                Endişelenmeyin. Mühendislerimiz özel üretim, endüstriyel kartlar veya liste dışı premium cihazlar için de <strong className="text-white">Ar-Ge odaklı çözümler</strong> sunmaktadır.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/iletisim" className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Marka Sorgula
                </Link>
                <Link href="/onarim-talebi" className="px-10 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                    <Server size={20}/> Cihaz Gönder
                </Link>
            </div>
        </div>
      </section>

    </main>
  );
}