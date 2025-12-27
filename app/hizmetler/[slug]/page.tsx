"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Smartphone, Bot, Laptop, Cpu, Wrench, 
  ShieldCheck, ArrowLeft, Zap, Layers, Microscope, 
  Activity, CheckCircle, Component
} from "lucide-react";

// HİZMET VERİLERİ (İÇERİKLER BURADA)
const hizmetDetaylari: any = {
  "telefon": {
    baslik: "Cep Telefonu Laboratuvarı",
    aciklama: "iPhone, Samsung ve Android cihazlarda anakart seviyesinde mikroskobik onarım.",
    renk: "text-cyan-400",
    bgGradient: "from-cyan-500/20 to-blue-600/10",
    ikon: Smartphone,
    ozellikler: [
      { baslik: "Anakart & Entegre", detay: "Kısa devre, şarj entegresi ve CPU reballing işlemleri.", ikon: Cpu },
      { baslik: "Ekran & Ön Cam", detay: "-150°C teknolojisiyle sadece cam değişimi veya orijinal ekran revizyonu.", ikon: Layers },
      { baslik: "FaceID & Sensör", detay: "TrueDepth kamera ve FaceID onarımları hatasız yapılır.", ikon: ScanFace },
      { baslik: "Sıvı Teması", detay: "Ultrasonik temizleme ve korozyon giderme işlemleri.", ikon: Microscope },
    ],
    surec: "Telefonunuz ESD korumalı alanda sökülür, termal kamera ile arıza tespiti yapılır ve onarım sonrası 20 nokta testinden geçer."
  },
  "robot": {
    baslik: "Robot Süpürge Servisi",
    aciklama: "Roborock, Xiaomi ve Dreame modelleri için yetkili servis standartlarında bakım.",
    renk: "text-purple-400",
    bgGradient: "from-purple-500/20 to-pink-600/10",
    ikon: Bot,
    ozellikler: [
      { baslik: "Lidar & Sensör", detay: "Lidar motoru onarımı, haritalama hataları ve sensör kalibrasyonu.", ikon: Activity },
      { baslik: "Anakart Onarımı", detay: "Sıvı teması sonrası oksitlenen anakartların kurtarılması.", ikon: Cpu },
      { baslik: "Tekerlek & Motor", detay: "Sıkışan tekerlek motorları ve fırça modüllerinin bakımı.", ikon: Wrench },
      { baslik: "Batarya Yenileme", detay: "Performansı düşen pillerin yüksek amperli hücrelerle değişimi.", ikon: Zap },
    ],
    surec: "Robotunuzun tüm hava kanalları temizlenir, sensörleri kalibre edilir ve orijinal parçalarla onarılır."
  },
  "bilgisayar": {
    baslik: "Bilgisayar & Laptop",
    aciklama: "Gaming laptop, MacBook ve masaüstü sistemler için performans odaklı çözümler.",
    renk: "text-green-400",
    bgGradient: "from-green-500/20 to-emerald-600/10",
    ikon: Laptop,
    ozellikler: [
      { baslik: "Chipset & BGA", detay: "Ekran kartı ve kuzey köprüsü chipset değişimi (BGA Rework).", ikon: Component },
      { baslik: "Termal Bakım", detay: "Pump-out yapmayan endüstriyel termal macun ile ısı sorununa son.", ikon: Zap },
      { baslik: "Kasa & Menteşe", detay: "Kırık laptop kasaları ve menteşe tamiri (Plastik kaynak).", ikon: ShieldCheck },
      { baslik: "BIOS & Yazılım", detay: "BIOS yazma, ME Region temizliği ve sistem kurulumu.", ikon: Layers },
    ],
    surec: "Cihazınız stres testlerine sokulur, sıcaklık değerleri analiz edilir ve maksimum performans hedeflenir."
  }
};

// Lucide ikon hatasını önlemek için dummy component
function ScanFace(props:any) { return <Activity {...props} /> } 

export default function HizmetDetay() {
  const params = useParams();
  // slug: "telefon", "robot" veya "bilgisayar" olarak gelir
  const slug = params?.slug as string; 
  const veri = hizmetDetaylari[slug];

  if (!veri) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Hizmet Bulunamadı</h1>
        <Link href="/" className="text-cyan-500 underline">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const Ikon = veri.ikon;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 font-sans pt-32 pb-20">
      
      {/* HEADER / HERO */}
      <div className="container mx-auto px-6 mb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors text-sm font-bold">
            <ArrowLeft size={16}/> Ana Sayfaya Dön
        </Link>
        
        <div className={`relative bg-[#151921] border border-slate-800 rounded-3xl p-8 md:p-16 overflow-hidden group`}>
            {/* Arkaplan Gradient Efekti */}
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${veri.bgGradient} blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/2`}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className={`w-20 h-20 rounded-2xl bg-slate-900/50 border border-slate-700 flex items-center justify-center shadow-2xl ${veri.renk}`}>
                    <Ikon size={40} />
                </div>
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">{veri.baslik}</h1>
                    <p className="text-lg text-slate-400 max-w-2xl">{veri.aciklama}</p>
                </div>
            </div>
        </div>
      </div>

      {/* DETAY KARTLARI (GRID) */}
      <div className="container mx-auto px-6 mb-24">
        <div className="flex items-center gap-3 mb-8">
            <Wrench className={veri.renk} size={24} />
            <h2 className="text-2xl font-bold text-white">Yapılan Teknik İşlemler</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {veri.ozellikler.map((ozellik: any, index: number) => (
                <div key={index} className="bg-[#151921] border border-slate-800 p-6 rounded-2xl hover:border-slate-600 transition-all group">
                    <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${veri.renk}`}>
                        <ozellik.ikon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{ozellik.baslik}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{ozellik.detay}</p>
                </div>
            ))}
        </div>
      </div>

      {/* SÜREÇ BİLGİSİ VE CTA */}
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-slate-900 to-[#0f172a] border border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
                <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="text-green-500"/> Servis Süreci
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                    {veri.surec}
                </p>
                <div className="mt-6 flex gap-3 text-sm font-bold text-slate-500">
                    <span className="px-3 py-1 bg-black/30 rounded-lg border border-white/5">6 Ay Garanti</span>
                    <span className="px-3 py-1 bg-black/30 rounded-lg border border-white/5">Orijinal Parça</span>
                    <span className="px-3 py-1 bg-black/30 rounded-lg border border-white/5">Hızlı Teslimat</span>
                </div>
            </div>
            
            <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto">
                <Link href="/onarim-talebi" className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg text-center transition-transform hover:scale-105 ${slug === 'robot' ? 'bg-purple-600 hover:bg-purple-500' : slug === 'bilgisayar' ? 'bg-green-600 hover:bg-green-500' : 'bg-cyan-600 hover:bg-cyan-500'}`}>
                    HEMEN FİYAT AL
                </Link>
                <Link href="/iletisim" className="px-8 py-4 rounded-xl font-bold text-slate-300 border border-slate-700 hover:bg-slate-800 text-center transition-colors">
                    BİZE ULAŞIN
                </Link>
            </div>

            {/* Arkaplan Süsleri */}
            <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
        </div>
      </div>

    </div>
  );
}