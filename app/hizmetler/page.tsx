"use client";

import React from "react";
import Link from "next/link";
import { 
  Smartphone, Bot, Laptop, ArrowRight, 
  Cpu, ShieldCheck, Zap, Wrench, Search, 
  ChevronRight, HardDrive, MousePointer2, Activity,
  CircuitBoard, Terminal, Hammer, Star, Clock
} from "lucide-react";

export default function HizmetlerPage() {
  
  const services = [
    {
      id: "telefon",
      title: "Cep Telefonu Cerrahlığı",
      desc: "Sıradan bir tamir değil; iPhone ve Android cihazlar için mikron seviyesinde hassas onarım ve anakart restorasyonu.",
      icon: Smartphone,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      glow: "shadow-cyan-500/20",
      techSpecs: { level: "Level 4", time: "1-3 Gün" },
      features: ["FaceID Revizyonu", "CPU Kalıplama", "Kısa Devre Avcılığı", "Orijinal Panel İşçiliği"]
    },
    {
      id: "robot",
      title: "Robotik Sistem Bakımı",
      desc: "Roborock, Xiaomi ve Dyson cihazların sensör, motor ve batarya bloklarında fabrika standartlarında yenileme.",
      icon: Bot,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      glow: "shadow-purple-500/20",
      techSpecs: { level: "Level 3", time: "2-4 Gün" },
      features: ["Lidar Optik Ayarı", "Mekanik Aksam", "Sıvı Teması Temizliği", "Anakart Onarımı"]
    },
    {
      id: "bilgisayar",
      title: "PC & Laptop Ustalığı",
      desc: "Gaming laptop ve iş istasyonları için termal bakım, chipset değişimi ve donanım darboğazlarının giderilmesi.",
      icon: Laptop,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "shadow-emerald-500/20",
      techSpecs: { level: "Level 4", time: "1-2 Gün" },
      features: ["Chipset Değişimi", "Termal Macun & Ped", "BIOS Programlama", "Kasa Restorasyonu"]
    },
    {
      id: "veri-kurtarma",
      title: "Veri Kurtarma Uzmanlığı",
      desc: "Hasar görmüş disklerden veya susmuş cihazlardan, özel donanımlarla verilerinizi 'kazıyıp' çıkarıyoruz.",
      icon: HardDrive,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      glow: "shadow-orange-500/20",
      techSpecs: { level: "Level 5", time: "3-10 Gün" },
      features: ["Mekanik Disk (HDD)", "NAND Çip Okuma", "Fidye Yazılım Çözümü", "RAID Yapılandırma"]
    }
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-white pt-32 pb-20 relative overflow-hidden selection:bg-cyan-500/30">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center mb-24 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
                <CircuitBoard size={14} className="text-cyan-500"/>
                Ustalık ve Teknoloji
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
              Teknik <br className="md:hidden"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">Zanaatkarlık.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
              Biz sadece parça değiştirmiyoruz; cihazınızın ruhunu anlıyor, el emeği ve tecrübeyle <strong className="text-white font-medium">hayata döndürüyoruz.</strong>
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
                <Link href={`/hizmetler/${service.id}`} key={index} className="group relative block h-full">
                    <div className={`absolute -inset-[1px] rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500 ${service.bg.replace('/10', '/50')}`}></div>
                    
                    <div className={`relative h-full bg-[#0b0e14] border border-white/5 rounded-3xl p-1 overflow-hidden transition-transform duration-500 hover:-translate-y-1`}>
                        <div className="bg-[#0f131a] rounded-[1.3rem] p-8 h-full flex flex-col relative overflow-hidden">
                            <service.icon className={`absolute -right-6 -bottom-6 w-48 h-48 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity ${service.color}`} />

                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 ${service.bg} ${service.color} shadow-lg ${service.glow}`}>
                                    <service.icon size={32} />
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 bg-black/40 text-slate-400 flex items-center gap-1">
                                        <Star size={10} className="text-yellow-500"/> {service.techSpecs.level}
                                    </div>
                                    <div className="px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 bg-black/40 text-slate-400 flex items-center gap-1">
                                        <Clock size={10} className="text-blue-500"/> {service.techSpecs.time}
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-100 transition-colors">{service.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 border-b border-white/5 pb-6">{service.desc}</p>
                            
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-8">
                                {service.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-slate-300 transition-colors">
                                        <div className={`w-1 h-1 rounded-full ${service.color.replace('text-', 'bg-')}`}></div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">
                                <span className={`${service.color}`}>İNCELE</span>
                                <ArrowRight size={16} className={`${service.color}`}/>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>

        {/* Kurumsal Bandı */}
        <div className="mt-32 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-3xl opacity-30"></div>
            <div className="relative p-12 rounded-[3rem] bg-[#0b0e14] border border-white/10 text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                
                <h2 className="text-3xl font-bold text-white mb-6">Özel Projeler ve Kurumsal Anlaşmalar</h2>
                <p className="text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
                    Endüstriyel kart onarımları, filo bakım anlaşmaları ve özel veri kurtarma operasyonları için uzmanlarımızla görüşün.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/iletisim" className="group px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <Terminal size={18} className="text-slate-900"/>
                        Baş Teknisyenle Görüş
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>
                    <Link href="/destek" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                        <Activity size={18} className="text-green-500"/>
                        7/24 Destek Hattı
                    </Link>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}