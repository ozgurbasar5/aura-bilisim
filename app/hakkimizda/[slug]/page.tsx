"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Smartphone, Bot, Laptop, Cpu, Wrench, 
  ShieldCheck, ArrowLeft, Zap, Layers, Microscope, 
  Activity, CheckCircle, Component, Search, Binary, BrainCircuit, Scan
} from "lucide-react";

// --- GÜNCELLENMİŞ VE GENİŞLETİLMİŞ HİZMET VERİLERİ ---
const hizmetDetaylari: any = {
  "telefon": {
    baslik: "Cep Telefonu Laboratuvarı",
    aciklama: "Standart parça değişiminin ötesinde; şematik analiz ve tersine mühendislik yöntemleriyle, 'tamir edilemez' denilen arızalara Ar-Ge odaklı çözümler üretiyoruz.",
    renk: "text-cyan-400",
    borderRenk: "border-cyan-500/20",
    bgGradient: "from-cyan-500/20 to-blue-600/10",
    glow: "shadow-cyan-500/20",
    ikon: Smartphone,
    ozellikler: [
      { baslik: "Şematik Arıza Tespiti", detay: "Arızayı deneme-yanılma ile değil, üretici şemaları ve diyagram analizi ile nokta atışı tespit ediyoruz.", ikon: Search },
      { baslik: "Anakart & Entegre", detay: "Kısa devre, şarj entegresi (PMIC) değişimi ve CPU reballing (yeniden kalıplama) işlemleri.", ikon: Cpu },
      { baslik: "Veri Kurtarma Ar-Ge", detay: "Açılmayan veya ağır hasarlı cihazlardan, özel donanımlarla veri kurtarma mühendisliği.", ikon: Binary },
      { baslik: "Ekran & Ön Cam", detay: "-150°C dondurma teknolojisiyle sadece cam değişimi veya orijinal panel revizyonu.", ikon: Layers },
      { baslik: "FaceID & Sensör", detay: "TrueDepth kamera, Dot Projector ve biyometrik sensör onarımları hatasız yapılır.", ikon: Scan },
      { baslik: "Sıvı Teması Çözümleri", detay: "Ultrasonik temizleme ve korozyon giderme sonrası mikroskobik hat onarımı.", ikon: Microscope },
    ],
    surec: "Telefonunuz ESD korumalı laboratuvara alınır. Önce endüstriyel cihazlarla 'Arıza Haritası' çıkarılır, ardından sadece gerekli müdahale yapılır."
  },
  "robot": {
    baslik: "Robot Süpürge Ar-Ge Merkezi",
    aciklama: "Roborock, Xiaomi ve Dreame gibi otonom sistemlerin sadece mekanik değil, sensör ve yazılım tabanlı tüm 'davranışsal' arızalarını çözümlüyoruz.",
    renk: "text-purple-400",
    borderRenk: "border-purple-500/20",
    bgGradient: "from-purple-500/20 to-pink-600/10",
    glow: "shadow-purple-500/20",
    ikon: Bot,
    ozellikler: [
      { baslik: "Lidar Navigasyon Analizi", detay: "Robotun 'yönünü bulamama' veya 'hatalı haritalama' sorunlarına lazer kalibrasyonlu çözüm.", ikon: Activity },
      { baslik: "Yapay Zeka (AI) Onarımı", detay: "Sensör verilerini yanlış işleyen anakart işlemcilerinin lojik onarımı.", ikon: BrainCircuit },
      { baslik: "BMS Batarya Revizyonu", detay: "Pili tamamen değiştirmek yerine, BMS (Pil Yönetim Sistemi) devresini onararak maliyeti düşürüyoruz.", ikon: Zap },
      { baslik: "Anakart Sıvı Teması", detay: "Su haznesi sızıntısı sonucu oksitlenen devrelerin kimyasal ve mekanik restorasyonu.", ikon: Cpu },
      { baslik: "Tekerlek & Çekiş Sistemi", detay: "Sıkışan motorlar, dişli sıyırmaları ve süspansiyon mekanizması yenileme.", ikon: Wrench },
      { baslik: "Sensör Kalibrasyonu", detay: "Uçurum sensörü, duvar sensörü ve çarpışma sensörlerinin fabrika değerlerine getirilmesi.", ikon: Scan },
    ],
    surec: "Robotunuz bir teste tabi tutulmaz, simüle edilmiş ev ortamında 'davranış testine' sokulur. Yazılımsal ve donanımsal tüm hatalar raporlanır."
  },
  "bilgisayar": {
    baslik: "Bilgisayar & İleri Elektronik",
    aciklama: "Sadece format atıp geçenlerden değiliz. Gaming laptop, MacBook ve Endüstriyel PC'lerin elektronik kart seviyesindeki en karmaşık sorunlarını çözüyoruz.",
    renk: "text-green-400",
    borderRenk: "border-green-500/20",
    bgGradient: "from-green-500/20 to-emerald-600/10",
    glow: "shadow-green-500/20",
    ikon: Laptop,
    ozellikler: [
      { baslik: "BGA & Chipset Rework", detay: "Görüntü vermeyen cihazlarda ekran kartı (GPU) ve kuzey köprüsü çip değişimi.", ikon: Component },
      { baslik: "Endüstriyel Kart Onarımı", detay: "Standart dışı, özel üretim anakartların devre takibi ve komponent değişimi.", ikon: activityMonitorIcon },
      { baslik: "Termal Mühendislik", detay: "Fabrikasyon termal macun yerine, sıvı metal veya endüstriyel pedlerle soğutma modifikasyonu.", ikon: Zap },
      { baslik: "BIOS & IO Programlama", detay: "Çökmüş BIOS, ME Region temizliği ve Super I/O yazılım sorunlarının giderilmesi.", ikon: Binary },
      { baslik: "Kasa & Menteşe Restorasyonu", detay: "Kırık laptop kasaları için plastik kaynak ve güçlendirilmiş menteşe onarımı.", ikon: ShieldCheck },
      { baslik: "Güç Devresi Analizi", detay: "Hiç elektrik almayan cihazlarda Mosfet, kapasitör ve PWM entegre taraması.", ikon: Search },
    ],
    surec: "Cihazınız önce stres testlerine sokulur, termal kameralarla ısınma haritası çıkarılır ve darboğaz yaratan donanım tespit edilip iyileştirilir."
  }
};

// İkon hatalarını önlemek için yardımcı fonksiyonlar
function ScanFace(props:any) { return <Activity {...props} /> } 
function activityMonitorIcon(props:any) { return <Activity {...props} /> }

export default function HizmetDetay() {
  const params = useParams();
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
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pt-32 pb-20 relative overflow-hidden">
      
      {/* ARKA PLAN DESENİ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* HEADER / HERO */}
      <div className="container mx-auto px-6 mb-20 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors text-sm font-bold">
            <ArrowLeft size={16}/> Ana Sayfaya Dön
        </Link>
        
        <div className={`relative bg-gradient-to-r from-[#0f172a] to-[#020617] border border-white/10 rounded-3xl p-8 md:p-16 overflow-hidden group shadow-2xl`}>
            {/* Arkaplan Gradient Efekti */}
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${veri.bgGradient} blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/2`}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className={`w-24 h-24 rounded-2xl bg-black/40 backdrop-blur-md border ${veri.borderRenk} flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] ${veri.renk} ${veri.glow}`}>
                    <Ikon size={48} />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-none">{veri.baslik}</h1>
                    <p className="text-lg text-slate-400 max-w-3xl font-light leading-relaxed">{veri.aciklama}</p>
                </div>
            </div>
        </div>
      </div>

      {/* DETAY KARTLARI (GRID - GENİŞLETİLMİŞ) */}
      <div className="container mx-auto px-6 mb-24 relative z-10">
        <div className="flex items-center gap-3 mb-8">
            <div className={`p-2 rounded-lg bg-white/5 ${veri.renk}`}><Wrench size={20} /></div>
            <h2 className="text-2xl font-bold text-white">Ar-Ge Destekli Onarım Çözümleri</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {veri.ozellikler.map((ozellik: any, index: number) => (
                <div key={index} className={`bg-[#0f172a]/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-${veri.renk.split('-')[1]}-500/50 hover:bg-[#0f172a] transition-all group duration-300 flex flex-col`}>
                    <div className={`w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/5 ${veri.renk}`}>
                        <ozellik.ikon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors">{ozellik.baslik}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{ozellik.detay}</p>
                </div>
            ))}
        </div>
      </div>

      {/* SÜREÇ BİLGİSİ VE CTA */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-gradient-to-r from-[#0f172a] to-[#020617] border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl">
                <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="text-green-500"/> Mühendislik Süreci
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed font-light">
                    {veri.surec}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
                    <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2"><ShieldCheck size={14}/> 6 Ay Garanti</span>
                    <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2"><Cpu size={14}/> Orijinal Parça</span>
                    <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2"><Zap size={14}/> Hızlı Teslimat</span>
                </div>
            </div>
            
            <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto">
                <Link href="/onarim-talebi" className={`px-8 py-4 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(0,0,0,0.4)] text-center transition-transform hover:scale-105 border border-white/10 ${slug === 'robot' ? 'bg-purple-600 hover:bg-purple-500' : slug === 'bilgisayar' ? 'bg-green-600 hover:bg-green-500' : 'bg-cyan-600 hover:bg-cyan-500'}`}>
                    ARIZA TESPİTİ İSTE
                </Link>
                <Link href="/iletisim" className="px-8 py-4 rounded-xl font-bold text-slate-300 border border-white/10 hover:bg-white/5 text-center transition-colors">
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