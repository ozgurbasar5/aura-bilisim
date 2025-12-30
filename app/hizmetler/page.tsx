import React from "react";
import Link from "next/link";
import { 
  Smartphone, Bot, Laptop, ArrowRight, 
  Cpu, ShieldCheck, Zap, Wrench, Search, 
  ChevronRight, HardDrive, MousePointer2 
} from "lucide-react";

export default function HizmetlerPage() {
  
  const services = [
    {
      id: "telefon",
      title: "Cep Telefonu Onarımı",
      desc: "iPhone ve Android cihazlar için anakart seviyesinde onarım, ekran değişimi ve FaceID kalibrasyonu.",
      icon: Smartphone,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      hoverBorder: "hover:border-cyan-500",
      features: ["Anakart Onarımı", "Ekran & Cam", "Sıvı Teması", "FaceID Revizyonu"]
    },
    {
      id: "robot",
      title: "Robot Süpürge Servisi",
      desc: "Roborock, Xiaomi ve Dyson cihazlar için Lidar sensör onarımı, batarya yenileme ve anakart tamiri.",
      icon: Bot,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      hoverBorder: "hover:border-purple-500",
      features: ["Lidar Hatası", "Tekerlek Motoru", "Anakart Tamiri", "Fan Değişimi"]
    },
    {
      id: "bilgisayar",
      title: "Bilgisayar & Laptop",
      desc: "Gaming laptop ve iş bilgisayarları için chipset değişimi, termal bakım ve performans optimizasyonu.",
      icon: Laptop,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      hoverBorder: "hover:border-green-500",
      features: ["BGA Chipset", "Termal Macun", "BIOS Yazılım", "Kasa Onarımı"]
    },
    {
      id: "veri-kurtarma", // Bu slug için detay sayfası yoksa genel destek sayfasına yönlendirebiliriz
      title: "Veri Kurtarma",
      desc: "Bozuk hard disk, SSD veya açılmayan telefonlardan profesyonel veri kurtarma hizmeti.",
      icon: HardDrive,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      hoverBorder: "hover:border-orange-500",
      features: ["Silinen Veriler", "Bozuk Disk", "Fidye Yazılımı", "RAID Kurtarma"]
    }
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-white pt-32 pb-20 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* ARKA PLAN EFEKTLERİ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* BAŞLIK */}
        <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Profesyonel <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Çözümlerimiz</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Standart tamir dükkanlarının ötesinde; laboratuvar ortamında, mühendislik disipliniyle sunduğumuz teknik hizmetler.
            </p>
        </div>

        {/* HİZMET GRİDİ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
                <div key={index} className={`group relative bg-[#0f1420] border ${service.border} rounded-3xl p-8 hover:bg-[#131b2c] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${service.hoverBorder}`}>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* İkon */}
                        <div className={`w-20 h-20 shrink-0 rounded-2xl ${service.bg} flex items-center justify-center border ${service.border} group-hover:scale-110 transition-transform duration-500`}>
                            <service.icon size={40} className={service.color} />
                        </div>

                        {/* İçerik */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-100 transition-colors">{service.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">{service.desc}</p>
                            
                            {/* Özellik Listesi */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {service.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <div className={`w-1.5 h-1.5 rounded-full ${service.bg.replace('/10', '/50')}`}></div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            {/* Buton */}
                            <Link href={`/hizmetler/${service.id}`} className={`inline-flex items-center gap-2 text-sm font-bold ${service.color} hover:underline decoration-2 underline-offset-4 transition-all`}>
                                DETAYLI İNCELE <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Dekoratif Arkaplan Işığı */}
                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none ${service.bg.replace('/10','/30')}`}></div>
                </div>
            ))}
        </div>

        {/* ALT BİLGİ & CTA */}
        <div className="mt-32 p-12 rounded-[3rem] bg-gradient-to-r from-slate-900 to-[#020617] border border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            
            <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-4">Aradığınız hizmeti bulamadınız mı?</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Özel endüstriyel kart onarımları ve kurumsal anlaşmalar için doğrudan mühendislerimizle görüşün.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/iletisim" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                        Bize Ulaşın <ChevronRight size={18}/>
                    </Link>
                    <Link href="/destek" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
                        Canlı Destek
                    </Link>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}