"use client";

import { 
  Cpu, ShieldCheck, Zap, Users, Trophy, Target, 
  Microscope, Wrench, Code2, Layers,
  Activity, Server, ClipboardCheck, FileText, Lock, Eye, Handshake, ScanFace
} from "lucide-react";

export default function Hakkimizda() {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 pt-32 pb-20 font-sans">
      
      {/* --- HERO BÖLÜMÜ --- */}
      <div className="container mx-auto px-6 mb-24 text-center relative">
        {/* Arka plan efekti */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold tracking-[0.2em] text-xs uppercase mb-6">
          Aura Bilişim & Teknoloji
        </span>
        
        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-none">
          Teknolojinin <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">DNA'sını Çözüyoruz.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Biz sadece parça değiştiren bir tamirci değiliz. Global markaların yetkili servis disipliniyle yetişmiş, 
          robotik sistemlerden mobil cihazlara kadar teknolojinin her katmanına hakim bir mühendislik atölyesiyiz.
        </p>
      </div>

      <div className="container mx-auto px-6 space-y-20 mb-32">
        
        {/* --- BÖLÜM 1: LABORATUVAR YAKLAŞIMI (MEVCUT) --- */}
        <div className="bg-[#151921] border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 relative z-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Microscope className="text-cyan-500" size={32}/>
                        1. Laboratuvar Yaklaşımı
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-justify text-sm md:text-base">
                        Aura Bilişim'in temelleri, teknolojinin en hassas cihazları üzerinde yıllarca süren <strong>yetkili servis tecrübesiyle</strong> atıldı. 
                        Robot süpürgelerin karmaşık sensör yapılarından, yeni nesil akıllı saatlerin mikro çiplerine; yüksek performanslı bilgisayarlardan, 
                        cep telefonlarının anakart mimarisine kadar geniş bir yelpazede uzmanlaştık.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-justify text-sm md:text-base">
                        Sadece donanım değil, <strong>yazılım dünyasına olan tutkumuzla</strong> cihazlarınızı sadece onarmıyor, onları optimize ediyoruz. 
                        Amacımız, bozulanı atmak değil; mühendislik bilgimizle ona ilk günkü performansını geri kazandırmaktır.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                        {["Mikroskobik Onarım", "Yazılım Entegrasyonu", "Robotik Sensör Kalibrasyonu"].map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-[11px] font-bold text-slate-300 border border-slate-700/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Sağ Taraf - Görsel Temsili */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-2xl blur-2xl"></div>
                    <div className="bg-[#0b0e14] border border-slate-700 p-6 rounded-2xl relative grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Anakart & Çip</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Code2 className="w-8 h-8 text-purple-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Yazılım</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Layers className="w-8 h-8 text-green-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">IoT & Robotik</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Wrench className="w-8 h-8 text-orange-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Mobil Cihaz</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- BÖLÜM 2: İLERİ TEKNOLOJİ ALTYAPISI (YENİ) --- */}
        <div className="bg-[#151921] border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Sol Taraf - Görsel Temsili (Sıra değişti) */}
                <div className="relative order-2 lg:order-1">
                    <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/20 to-pink-500/20 rounded-2xl blur-2xl"></div>
                    <div className="bg-[#0b0e14] border border-slate-700 p-6 rounded-2xl relative grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Termal Analiz</div>
                            <div className="text-[10px] text-slate-500">Kısa Devre Tespiti</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Activity className="w-8 h-8 text-red-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Osiloskop</div>
                            <div className="text-[10px] text-slate-500">Sinyal Ölçümü</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Server className="w-8 h-8 text-indigo-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Clean Room</div>
                            <div className="text-[10px] text-slate-500">Tozsuz Ortam</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <ScanFace className="w-8 h-8 text-emerald-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Face ID Onarım</div>
                            <div className="text-[10px] text-slate-500">Dot Projector</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 relative z-10 order-1 lg:order-2">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Cpu className="text-indigo-500" size={32}/>
                        2. High-Tech Ekipman Parkuru
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-justify text-sm md:text-base">
                        Başarı tesadüf değildir; doğru bilgi ve doğru ekipmanın sonucudur. Aura Bilişim'de, standart servislerin aksine, 
                        gözle görülemeyen arızaları tespit etmek için <strong>endüstriyel sınıf termal kameralar</strong>, anakart üzerindeki 
                        milisaniyelik sinyal kayıplarını yakalayan <strong>dijital osiloskoplar</strong> kullanıyoruz.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-justify text-sm md:text-base">
                        Ekran değişimleri ve hassas montaj işlemleri, tozdan arındırılmış özel <strong>Clean Room (Temiz Oda)</strong> 
                        ünitemizde gerçekleştirilir. Yatırımımızı teknolojiye yaparak, hata payını sıfıra indiriyoruz.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                        {["Endüstriyel Termal Kamera", "Dijital Sinyal Analizi", "Tozsuz Montaj Odası"].map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-[11px] font-bold text-slate-300 border border-slate-700/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* --- BÖLÜM 3: YETKİLİ SERVİS DİSİPLİNİ (YENİ) --- */}
        <div className="bg-[#151921] border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-green-500/30 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 relative z-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <ClipboardCheck className="text-green-500" size={32}/>
                        3. Yetkili Servis Protokolleri
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-justify text-sm md:text-base">
                        Geçmişimizden gelen "Yetkili Servis" kültürü, çalışma şeklimizin temelidir. Atölyemize giren her cihaz, 
                        marka bağımsız olarak <strong>statik elektrikten (ESD) korunmuş</strong> özel alanlarda işleme alınır.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-justify text-sm md:text-base">
                        Onarım öncesi 20 noktalı giriş kontrolü ve onarım sonrası 30 noktalı çıkış kalite kontrol testleri uygulanır. 
                        Hiçbir işlem "tahminen" yapılmaz; her adım prosedürlere uygun, kayıt altında ve izlenebilir şekilde ilerler. 
                        Bu disiplin, aynı arızanın tekrar yaşanmamasının garantisidir.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                        {["ESD Korumalı Alan", "20+ Giriş/Çıkış Testi", "Prosedürlü İşlem", "Standart Kalite"].map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-[11px] font-bold text-slate-300 border border-slate-700/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Sağ Taraf - Görsel Temsili */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-teal-500/20 rounded-2xl blur-2xl"></div>
                    <div className="bg-[#0b0e14] border border-slate-700 p-6 rounded-2xl relative grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <ShieldCheck className="w-8 h-8 text-green-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">ESD Güvenliği</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <ClipboardCheck className="w-8 h-8 text-teal-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Check-List</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <FileText className="w-8 h-8 text-lime-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Raporlama</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Sıfır Hata</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- BÖLÜM 4: VERİ ETİĞİ VE ŞEFFAFLIK (YENİ) --- */}
        <div className="bg-[#151921] border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-red-500/30 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Sol Taraf - Görsel Temsili (Sıra değişti) */}
                <div className="relative order-2 lg:order-1">
                    <div className="absolute inset-0 bg-gradient-to-tl from-red-500/20 to-orange-500/20 rounded-2xl blur-2xl"></div>
                    <div className="bg-[#0b0e14] border border-slate-700 p-6 rounded-2xl relative grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Lock className="w-8 h-8 text-red-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">KVKK Uyumlu</div>
                            <div className="text-[10px] text-slate-500">Veri Gizliliği</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Eye className="w-8 h-8 text-orange-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">%100 Şeffaf</div>
                            <div className="text-[10px] text-slate-500">Sürpriz Yok</div>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <Handshake className="w-8 h-8 text-rose-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Güven İlkesi</div>
                            <div className="text-[10px] text-slate-500">Etik Çalışma</div>
                        </div>
                         <div className="bg-slate-900/50 p-5 rounded-xl text-center border border-slate-800">
                            <ShieldCheck className="w-8 h-8 text-pink-400 mx-auto mb-2"/>
                            <div className="font-bold text-white text-sm">Garanti</div>
                            <div className="text-[10px] text-slate-500">Yapılan İşlem</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 relative z-10 order-1 lg:order-2">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Lock className="text-red-500" size={32}/>
                        4. Veri Etiği ve Şeffaflık
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-justify text-sm md:text-base">
                        Cihazlarınızdaki veriler (fotoğraflar, rehber, özel dosyalar) bizim için mahremiyettir. Aura Bilişim'de, 
                        onarım süreci boyunca veri güvenliğiniz <strong>KVKK (Kişisel Verilerin Korunması Kanunu)</strong> standartlarında sağlanır.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-justify text-sm md:text-base">
                        Şeffaflık ilkemiz gereği, cihazınızdaki arıza ne ise sadece onun bilgisini alırsınız. Sizden habersiz parça değişimi yapılmaz, 
                        onayınız olmadan işlem uygulanmaz. Online sorgulama sistemimizle cihazınızın durumunu anlık olarak takip edebilir, 
                        sürecin her adımına hakim olursunuz.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                        {["Mahremiyet Garantisi", "Habersiz İşlem Yok", "Online Takip", "KVKK Standartları"].map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-[11px] font-bold text-slate-300 border border-slate-700/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* --- İSTATİSTİKLER (GÜVEN PEKİŞTİRME) --- */}
      <div className="bg-[#151921] border-y border-slate-800 py-16 mb-0">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
                { label: "Sektör Tecrübesi", val: "10+ Yıl", icon: Trophy },
                { label: "Onarılan Cihaz", val: "15.000+", icon: Zap },
                { label: "Başarı Oranı", val: "%98.5", icon: Target },
                { label: "Garanti Süresi", val: "6 Ay", icon: ShieldCheck },
            ].map((stat, i) => (
                <div key={i} className="group p-4 rounded-2xl hover:bg-white/5 transition-colors">
                    <stat.icon className="w-8 h-8 text-cyan-500 mx-auto mb-4 group-hover:scale-110 transition-transform"/>
                    <div className="text-3xl md:text-4xl font-black text-white mb-2">{stat.val}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
}