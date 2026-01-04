"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Smartphone, Bot, Laptop, Cpu, Wrench, 
  ShieldCheck, ArrowLeft, Zap, Layers, Microscope, 
  Activity, CheckCircle2, Component, Search, Binary, BrainCircuit, Scan, HardDrive,
  FileSearch, PenTool, Hammer, Gauge, Box
} from "lucide-react";

// --- HİZMET VERİTABANI ---
const hizmetDetaylari: any = {
  "telefon": {
    id: "telefon",
    baslik: "Cep Telefonu Laboratuvarı",
    etiket: "HASSAS ELEKTRONİK ONARIM",
    aciklama: "Mikroskop altında yapılan, el emeği ve teknik bilgi gerektiren hassas işlemlerle cihazınızı fabrika kondisyonuna döndürüyoruz.",
    renk: "text-cyan-400",
    bgRenk: "bg-cyan-500",
    borderRenk: "border-cyan-500/30",
    glow: "shadow-[0_0_40px_rgba(6,182,212,0.3)]",
    ikon: Smartphone,
    zorlukSeviyesi: 85, // 100 üzerinden
    ekipmanlar: ["Stereo Mikroskop", "JBC Havya İstasyonu", "Termal Kamera", "Programlama Boxları"],
    ozellikler: [
      { baslik: "Şematik Arıza Takibi", detay: "Ezbere değil, üretici şemaları üzerinden nokta atışı arıza tespiti.", ikon: Search },
      { baslik: "Anakart & Entegre", detay: "Kısa devre, şarj entegresi ve işlemci kalıplama (Reballing) ustalığı.", ikon: Cpu },
      { baslik: "Veri Kurtarma", detay: "Açılmayan cihazlardan 'imkansız' denilen verileri kurtarma sanatı.", ikon: Binary },
      { baslik: "Ekran & Ön Cam", detay: "Orijinal paneli koruyarak sadece cam değişimi yapan ince işçilik.", ikon: Layers },
      { baslik: "FaceID Onarımı", detay: "TrueDepth kamera ve sensörlerin cerrahi hassasiyetle onarılması.", ikon: Scan },
      { baslik: "Sıvı Teması Müdahalesi", detay: "Ultrasonik temizleme ve korozyon giderme ile cihazı hayata döndürme.", ikon: Microscope },
    ]
  },
  "robot": {
    id: "robot",
    baslik: "Robot Süpürge Revizyonu",
    etiket: "OTONOM SİSTEM USTALIĞI",
    aciklama: "Roborock ve Xiaomi cihazların dilinden anlıyoruz. Sensör kalibrasyonu, motor bakımı ve anakart onarımıyla tam performans.",
    renk: "text-purple-400",
    bgRenk: "bg-purple-500",
    borderRenk: "border-purple-500/30",
    glow: "shadow-[0_0_40px_rgba(168,85,247,0.3)]",
    ikon: Bot,
    zorlukSeviyesi: 75,
    ekipmanlar: ["Lidar Test Standı", "Motor Tork Ölçer", "Ultrasonik Banyo", "Yazılım Arayüzü"],
    ozellikler: [
      { baslik: "Lidar Göz Tamiri", detay: "Lazer ünitesi ve motorunun hassas ayarı ve onarımı.", ikon: Activity },
      { baslik: "Anakart & Sensör", detay: "Yön bulma hatalarına sebep olan elektronik arızaların giderilmesi.", ikon: BrainCircuit },
      { baslik: "Batarya Hücre Yenileme", detay: "Pil ömrünü uzatan profesyonel hücre değişimi ve BMS onarımı.", ikon: Zap },
      { baslik: "Sıvı Teması Çözümü", detay: "Su kaçan anakartların özel kimyasallarla temizlenip onarılması.", ikon: Cpu },
      { baslik: "Tekerlek & Mekanik", detay: "Dişli sıyırması ve motor sıkışmalarına mekanik müdahale.", ikon: Wrench },
      { baslik: "Sensör Kalibrasyonu", detay: "Düşme ve çarpma sensörlerinin fabrika ayarlarına getirilmesi.", ikon: Scan },
    ]
  },
  "bilgisayar": {
    id: "bilgisayar",
    baslik: "Bilgisayar & Donanım",
    etiket: "PERFORMANS SANATI",
    aciklama: "Gaming laptop ve iş bilgisayarlarının sınırlarını zorluyoruz. Isınma, kapanma ve yavaşlama sorunlarına kesin çözümler.",
    renk: "text-emerald-400",
    bgRenk: "bg-emerald-500",
    borderRenk: "border-emerald-500/30",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.3)]",
    ikon: Laptop,
    zorlukSeviyesi: 90,
    ekipmanlar: ["BGA Rework İstasyonu", "BIOS Programlayıcı", "Sıvı Metal Macun", "Osilaskop"],
    ozellikler: [
      { baslik: "Chipset Değişimi", detay: "BGA makinesi ile ekran kartı ve chipset değişimi uzmanlığı.", ikon: Component },
      { baslik: "Endüstriyel Onarım", detay: "Özel üretim kartların devre takibi ve komponent değişimi.", ikon: Activity },
      { baslik: "Termal Ustalık", detay: "Sıvı metal ve kaliteli pedlerle soğutma performansını zirveye taşıma.", ikon: Zap },
      { baslik: "BIOS Yazılım", detay: "Çökmüş BIOS ve IO yazılımlarının programlayıcı ile atılması.", ikon: Binary },
      { baslik: "Kasa & Menteşe", detay: "Kırık kasalar için plastik kaynak ve sağlamlaştırma işçiliği.", ikon: ShieldCheck },
      { baslik: "Güç Devresi", detay: "Elektrik almayan cihazlarda Mosfet ve entegre taraması.", ikon: Search },
    ]
  },
  "veri-kurtarma": {
    id: "veri-kurtarma",
    baslik: "Veri Kurtarma Laboratuvarı",
    etiket: "DİJİTAL ARKEOLOJİ",
    aciklama: "Kayboldu sanılan verilerinizi, en son teknoloji cihazlar ve tecrübemizle geri getiriyoruz.",
    renk: "text-orange-400",
    bgRenk: "bg-orange-500",
    borderRenk: "border-orange-500/30",
    glow: "shadow-[0_0_40px_rgba(249,115,22,0.3)]",
    ikon: HardDrive,
    zorlukSeviyesi: 95,
    ekipmanlar: ["PC3000 Veri Kurtarma", "Clean Room (Class 100)", "NAND Okuyucu", "Kafa Değişim Seti"],
    ozellikler: [
      { baslik: "Mekanik Disk (HDD)", detay: "Kafa vuran disklerin temiz oda ortamında onarımı.", ikon: Wrench },
      { baslik: "SSD & Çip Okuma", detay: "Bozuk kontrolcülü disklerden doğrudan veri okuma.", ikon: Cpu },
      { baslik: "Fidye Yazılımı", detay: "Şifrelenmiş dosyaların analizi ve kurtarılma şansı.", ikon: ShieldCheck },
      { baslik: "RAID Sistemler", detay: "Çökmüş sunucu ve NAS yapılarının yeniden inşası.", ikon: Layers },
      { baslik: "Mobil Veri", detay: "Açılmayan telefonlardan rehber ve galeri kurtarma.", ikon: Smartphone },
      { baslik: "Dosya Onarımı", detay: "Bozuk veya silinmiş dosya yapılarının düzeltilmesi.", ikon: Binary },
    ]
  }
};

export default function HizmetDetay() {
  const pathname = usePathname();
  const slug = pathname?.split("/").pop(); 
  const veri = slug ? hizmetDetaylari[slug] : null;

  if (!veri) return null;

  const Ikon = veri.ikon;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pt-32 pb-20 relative overflow-hidden selection:bg-white/20">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 mb-24 relative z-10">
        <Link href="/hizmetler" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest">
            <ArrowLeft size={16}/> Hizmetlere Dön
        </Link>
        
        <div className={`relative bg-[#0b0e14]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 overflow-hidden shadow-2xl group`}>
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none ${veri.bgRenk}`}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start gap-10">
                <div className={`w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-3xl bg-[#0f131a] border flex items-center justify-center ${veri.borderRenk} ${veri.glow}`}>
                    <Ikon size={64} className={veri.renk} strokeWidth={1.5} />
                </div>
                
                <div className="flex-1 space-y-6">
                    <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border bg-black/40 uppercase tracking-[0.2em] mb-4 ${veri.renk} ${veri.borderRenk}`}>
                            {veri.etiket}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-none">
                            {veri.baslik}
                        </h1>
                        <p className="text-xl text-slate-400 font-light leading-relaxed max-w-3xl">
                            {veri.aciklama}
                        </p>
                    </div>

                    {/* EKİPMAN VE ZORLUK GÖSTERGESİ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                        {/* Zorluk Metresi */}
                        <div className="bg-[#0f1219]/80 p-4 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Gauge size={14}/> Teknik Zorluk</span>
                                <span className={`text-xs font-bold ${veri.renk}`}>%{veri.zorlukSeviyesi}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${veri.bgRenk}`} style={{width: `${veri.zorlukSeviyesi}%`}}></div>
                            </div>
                        </div>
                        {/* Ekipmanlar */}
                        <div className="bg-[#0f1219]/80 p-4 rounded-2xl border border-white/5">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-2"><Box size={14}/> Kullanılan Teknolojiler</span>
                            <div className="flex flex-wrap gap-2">
                                {veri.ekipmanlar.map((eq: string, idx: number) => (
                                    <span key={idx} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/5 text-slate-300">{eq}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mb-32 relative z-10">
        <div className="flex items-center gap-3 mb-10">
            <div className={`w-1 h-8 rounded-full ${veri.bgRenk}`}></div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Yapılan İşlemler</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {veri.ozellikler.map((ozellik: any, index: number) => (
                <div key={index} className="bg-[#0f1219] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all group hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors`}>
                            <ozellik.ikon size={20} className={veri.renk} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-sm">{ozellik.baslik}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">{ozellik.detay}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="container mx-auto px-6 mb-24 relative z-10">
        <div className="p-10 rounded-[2.5rem] bg-[#0b0e14] border border-white/5 relative overflow-hidden">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-white mb-4">Aura Onarım Protokolü</h2>
                <p className="text-slate-400">Cihazınız emin ellerde, adım adım ustalıkla işlenir.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>

                {[
                    { title: "Teşhis & Analiz", desc: "Cihazın arızası, uzman ekipmanlarla nokta atışı tespit edilir.", icon: FileSearch },
                    { title: "Cerrahi Müdahale", desc: "Anti-statik ortamda, mikroskop altında hassas onarım yapılır.", icon: Hammer },
                    { title: "Test & Teslimat", desc: "24 saatlik zorlu testlerden geçen cihaz, garantili teslim edilir.", icon: CheckCircle2 }
                ].map((step, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                        <div className={`w-24 h-24 rounded-full bg-[#020617] border-4 border-[#0b0e14] flex items-center justify-center mb-6 shadow-2xl relative`}>
                            <div className={`absolute inset-0 rounded-full opacity-20 ${veri.bgRenk} blur-md group-hover:opacity-40 transition-opacity`}></div>
                            <step.icon size={32} className="text-white relative z-10"/>
                            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1e293b] border border-white/10 flex items-center justify-center text-xs font-bold text-white`}>{i + 1}</div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 text-center">
         <div className="inline-flex flex-col items-center gap-6">
            <p className="text-slate-400">Cihazınızın gerçek performansına kavuşması için;</p>
            <Link href="/onarim-talebi" className={`px-12 py-5 rounded-2xl font-bold text-white shadow-2xl transition-transform hover:scale-105 ${veri.bgRenk} hover:brightness-110 flex items-center gap-3`}>
                <Wrench size={20}/>
                ÜCRETSİZ ARIZA TESPİTİ OLUŞTUR
            </Link>
         </div>
      </div>

    </div>
  );
}