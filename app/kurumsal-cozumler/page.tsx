"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, ShieldCheck, Zap, Activity, ChevronRight, 
  ArrowLeft, CheckCircle2, TrendingUp, Lock, Users, 
  Laptop, Smartphone, FileText, Server, Sliders, Briefcase, Calculator
} from "lucide-react";

export default function KurumsalPage() {
  const [deviceCount, setDeviceCount] = useState(50);
  // Basit hesaplama: Cihaz başı yenileme maliyeti (30.000 TL) yerine onarım (3.000 TL) = 27.000 TL kazanç varsayımı
  const estimatedSavings = (deviceCount * 27000).toLocaleString('tr-TR');

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-amber-500/30">
      
      {/* HEADER / NAVBAR (Kurumsal Özel) */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Ana Sayfaya Dön
            </Link>
            <div className="flex items-center gap-3">
                <div className="hidden md:block bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                    B2B PARTNER PORTAL
                </div>
                <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                    <Building2 className="text-amber-500" size={24}/>
                    AURA<span className="text-amber-500">BUSINESS</span>
                </div>
            </div>
        </div>
      </nav>

      {/* HERO SECTION: İkna Edici Giriş */}
      <section className="pt-48 pb-24 relative overflow-hidden">
        {/* Arka Plan Efektleri */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-amber-900/10 via-[#020617] to-[#020617] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 animate-in fade-in slide-in-from-bottom-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <Briefcase size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Kurumsal Filo Çözümleri</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
                    Teknolojiniz Durursa, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 filter drop-shadow-lg">İşiniz Durur.</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mb-12 font-light">
                    Şirket envanterinizdeki mobil cihazlar, bilgisayarlar ve endüstriyel donanımlar için <strong>tek merkezden yönetilen</strong>, garantili ve ultra-hızlı bakım anlaşması. 
                    <br/><br/>
                    <span className="text-white font-medium">Siz işinize odaklanın, cihazlarınızın sağlığı Aura'ya emanet.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                    <button onClick={() => document.getElementById('basvuru-formu')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] flex items-center justify-center gap-3 hover:-translate-y-1">
                        KURUMSAL TEKLİF AL <ChevronRight size={20} strokeWidth={3}/>
                    </button>
                    <div className="flex items-center gap-4 px-6 py-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#020617] flex items-center justify-center text-[10px] font-bold text-slate-500">Logo</div>)}
                        </div>
                        <span className="text-sm text-slate-300 font-medium">50+ Kurumsal Partner</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* AURA FLEET PANEL (Burası X Firmasını Tavlar: "Vay, sistemleri var" dedirtir) */}
      <section className="py-24 bg-[#050810] border-y border-white/5 relative overflow-hidden">
         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Aura Fleet <span className="text-amber-500">Panel</span></h2>
                    <p className="text-slate-400 max-w-xl">
                        Excel tablolarında kaybolmayın. Kurumsal müşterilerimize özel panel ile zimmetli cihazlarınızın garanti durumunu, arıza geçmişini ve maliyetlerini tek ekrandan izleyin.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-amber-500 font-mono text-xs bg-amber-950/30 px-3 py-1 rounded border border-amber-500/20">
                    <Activity size={14} className="animate-pulse"/> SYSTEM_STATUS: ONLINE
                </div>
            </div>

            {/* FAKE DASHBOARD UI */}
            <div className="relative w-full bg-[#0f172a] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden group hover:border-amber-500/30 transition-all duration-700 transform hover:scale-[1.01]">
                {/* Header Bar */}
                <div className="bg-[#1e293b] px-6 py-4 flex items-center justify-between border-b border-slate-700">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="hidden md:flex bg-slate-900 px-4 py-1 rounded-md text-xs text-slate-400 font-mono border border-white/5">
                        https://portal.aura-bilisim.com/dashboard
                    </div>
                    <div className="flex gap-4 text-xs text-slate-400">
                        <span>Admin</span>
                        <span className="text-amber-500">Logout</span>
                    </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* İstatistik Kartları */}
                    <div className="bg-[#020617] p-5 rounded-xl border border-slate-800 relative overflow-hidden group/card">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/card:opacity-20 transition-opacity"><Laptop size={48}/></div>
                        <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-bold">Envanter</div>
                        <div className="text-3xl font-black text-white">142 <span className="text-sm font-normal text-slate-500">Cihaz</span></div>
                        <div className="mt-2 text-[10px] text-green-500 flex items-center gap-1"><CheckCircle2 size={10}/> %98 Aktif</div>
                    </div>
                    <div className="bg-[#020617] p-5 rounded-xl border border-slate-800 relative overflow-hidden group/card">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/card:opacity-20 transition-opacity"><Zap size={48} className="text-amber-500"/></div>
                        <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-bold">Serviste</div>
                        <div className="text-3xl font-black text-amber-500">3 <span className="text-sm font-normal text-slate-500">Cihaz</span></div>
                        <div className="mt-2 text-[10px] text-amber-500 flex items-center gap-1"><Activity size={10}/> İşlem Görüyor</div>
                    </div>
                    <div className="bg-[#020617] p-5 rounded-xl border border-slate-800 relative overflow-hidden group/card">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/card:opacity-20 transition-opacity"><TrendingUp size={48} className="text-green-500"/></div>
                        <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-bold">Tasarruf</div>
                        <div className="text-3xl font-black text-green-500">₺45K <span className="text-sm font-normal text-slate-500">/Yıl</span></div>
                        <div className="mt-2 text-[10px] text-slate-400">Yenileme yerine onarım</div>
                    </div>
                    
                    {/* Canlı Akış Listesi */}
                    <div className="md:col-span-1 row-span-2 bg-[#020617] p-5 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs mb-4 uppercase tracking-wider font-bold border-b border-white/5 pb-2">Son Hareketler</div>
                        <div className="space-y-3">
                            {[
                                {dev: "MacBook Pro M1", stat: "Tamamlandı", user: "Ahmet Y.", color: "text-green-500"},
                                {dev: "iPhone 13 Pro", stat: "İnceleniyor", user: "Selin K.", color: "text-amber-500"},
                                {dev: "Dell XPS 15", stat: "Parça Bekliyor", user: "IT Dept.", color: "text-blue-500"},
                                {dev: "iPad Air 5", stat: "Kargolandı", user: "Saha Ekibi", color: "text-purple-500"},
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-1 p-2 hover:bg-white/5 rounded transition-colors cursor-default">
                                    <div className="flex justify-between text-xs font-bold text-white"><span>{item.dev}</span> <span className={item.color}>{item.stat}</span></div>
                                    <div className="text-[10px] text-slate-500">Zimmet: {item.user}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grafik Alanı */}
                    <div className="md:col-span-3 bg-[#020617] p-6 rounded-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden min-h-[200px]">
                        <div className="flex justify-between items-center mb-6 z-10 relative">
                            <h3 className="font-bold text-white text-sm">Arıza Türü Analizi (Yıllık)</h3>
                            <div className="flex gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span> <span className="text-[10px] text-slate-400">Donanım</span>
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> <span className="text-[10px] text-slate-400">Yazılım</span>
                            </div>
                        </div>
                        <div className="flex items-end gap-3 h-32 w-full px-2 z-10 relative">
                            {[40, 65, 45, 80, 55, 90, 70, 50, 60, 85, 40, 55].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-800 rounded-t-sm hover:bg-amber-500 transition-all duration-300 relative group/bar" style={{height: `${h}%`}}></div>
                            ))}
                        </div>
                        {/* Grid Lines */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* ROI / TASARRUF HESAPLAYICI */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                
                {/* Hesaplayıcı */}
                <div className="bg-[#0a0e17] p-8 md:p-12 rounded-[2.5rem] border border-slate-800 shadow-[0_0_50px_rgba(245,158,11,0.05)] relative">
                    <div className="absolute top-0 right-0 p-6 opacity-20"><Calculator size={64} className="text-amber-500"/></div>
                    
                    <h3 className="text-2xl font-bold text-white mb-8">Tasarruf Simülasyonu</h3>
                    
                    <div className="mb-10">
                        <label className="text-slate-400 text-sm font-bold mb-4 block flex justify-between uppercase tracking-wider">
                            <span>Şirket Cihaz Sayısı</span>
                            <span className="text-amber-400">{deviceCount} Adet</span>
                        </label>
                        <input 
                            type="range" 
                            min="10" 
                            max="200" 
                            step="5"
                            value={deviceCount} 
                            onChange={(e) => setDeviceCount(parseInt(e.target.value))}
                            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
                        />
                        <div className="flex justify-between text-[10px] text-slate-600 mt-2 font-mono">
                            <span>10</span>
                            <span>200+</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 rounded-xl bg-[#020617] border border-slate-800/50">
                            <span className="text-slate-400 text-sm">Yeni Cihaz Alım Maliyeti (Tahmini)</span>
                            <span className="text-slate-500 font-mono line-through decoration-red-500/50">{(deviceCount * 30000).toLocaleString('tr-TR')} ₺</span>
                        </div>
                        <div className="flex justify-between items-center p-6 rounded-xl bg-gradient-to-r from-amber-950/30 to-[#020617] border border-amber-500/30">
                            <div>
                                <span className="text-amber-500 text-sm font-bold block mb-1">Aura Onarım & Bakım Maliyeti</span>
                                <span className="text-[10px] text-slate-400">Yıllık periyodik bakım + parça dahil</span>
                            </div>
                            <span className="text-white font-bold font-mono text-xl">{(deviceCount * 3000).toLocaleString('tr-TR')} ₺</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <div className="text-slate-400 text-xs mb-1 uppercase tracking-widest">Potansiyel Yıllık Kazanç</div>
                        <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tight">
                            {estimatedSavings} ₺
                        </div>
                        <div className="text-[10px] text-slate-600 mt-4 max-w-xs mx-auto leading-relaxed">
                            *Hesaplamalar ortalama piyasa verilerine dayanmaktadır. Şirketinizin cihaz durumuna göre değişiklik gösterebilir.
                        </div>
                    </div>
                </div>
                
                {/* Avantaj Kartları */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all group hover:-translate-y-1">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                            <Zap size={24} className="text-amber-500" />
                        </div>
                        <h3 className="text-white font-bold text-xl mb-3">VIP Fast-Track</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Sıra beklemek yok. Kurumsal partnerlerin cihazları <strong className="text-amber-400">öncelikli hattan</strong> işleme alınır. Maksimum 24 saatte teşhis garantisi.</p>
                    </div>
                    
                    <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all group hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                            <Lock size={24} className="text-blue-500" />
                        </div>
                        <h3 className="text-white font-bold text-xl mb-3">Veri Güvenliği & NDA</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Kurumsal verileriniz bizimle güvende. <strong className="text-blue-400">Gizlilik Sözleşmesi (NDA)</strong> kapsamında çalışıyor, veri güvenliğini garanti ediyoruz.</p>
                    </div>

                    <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-800 hover:border-green-500/50 transition-all group hover:-translate-y-1">
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                            <Users size={24} className="text-green-500" />
                        </div>
                        <h3 className="text-white font-bold text-xl mb-3">Yerinde & Kurye</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Siz zahmet etmeyin. İstanbul içi <strong className="text-green-400">moto-kurye ağımız</strong> ile cihazları kapınızdan alıp, kapınıza bırakıyoruz.</p>
                    </div>

                    <div className="bg-[#0f172a]/50 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all group hover:-translate-y-1">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                            <Sliders size={24} className="text-purple-500" />
                        </div>
                        <h3 className="text-white font-bold text-xl mb-3">Esnek Ödeme</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Her işlem için ayrı fatura ile uğraşmayın. Ay sonu <strong className="text-purple-400">toplu faturalandırma</strong> ve vade seçenekleri ile finansal kolaylık.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* REFERANS / MARKALAR (Opsiyonel - Gri Tonlamalı) */}
      <section className="py-16 border-y border-white/5 bg-black/20">
          <div className="container mx-auto px-6 text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-8">Çözüm Ortaklarımız</p>
              <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
                  {/* Buraya Marka Logoları Gelebilir (Placeholder Text) */}
                  <span className="text-2xl font-black text-white">LOGISTIC.CO</span>
                  <span className="text-2xl font-black text-white">TECH_HOLDING</span>
                  <span className="text-2xl font-black text-white">GLOBAL_PHARMA</span>
                  <span className="text-2xl font-black text-white">E-COMMERCE_DEV</span>
              </div>
          </div>
      </section>

      {/* BAŞVURU FORMU */}
      <section id="basvuru-formu" className="py-24 bg-[#010205] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-[#010205] to-[#010205] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
            <div className="text-center mb-12">
                <div className="inline-block p-3 rounded-full bg-amber-500/10 mb-4 border border-amber-500/20"><FileText size={32} className="text-amber-500"/></div>
                <h2 className="text-4xl font-black text-white mb-4">Partnerlik Başvurusu</h2>
                <p className="text-slate-400 text-lg">Aşağıdaki formu doldurun, Kurumsal departmanımız 24 saat içinde size özel bir teklif ile dönüş yapsın.</p>
            </div>

            <form className="space-y-6 bg-[#0a0e17] p-8 md:p-10 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                {/* Form Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Şirket Ünvanı</label>
                        <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-amber-500 outline-none transition-colors placeholder:text-slate-600" placeholder="Örn: Aura Teknoloji A.Ş." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Yetkili Kişi</label>
                        <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-amber-500 outline-none transition-colors placeholder:text-slate-600" placeholder="Ad Soyad" />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Kurumsal E-Posta</label>
                        <input type="email" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-amber-500 outline-none transition-colors placeholder:text-slate-600" placeholder="info@sirketiniz.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">İletişim Numarası</label>
                        <input type="tel" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-amber-500 outline-none transition-colors placeholder:text-slate-600" placeholder="05XX..." />
                    </div>
                </div>

                <div className="space-y-3 relative z-10">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">İhtiyaç Duyulan Hizmetler</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Mobil Cihazlar', 'Laptop / PC', 'Endüstriyel', 'Robotik'].map((opt, i) => (
                            <label key={i} className="flex items-center gap-3 p-3 bg-[#020617] border border-slate-700 rounded-xl cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group">
                                <input type="checkbox" className="accent-amber-500 w-4 h-4"/>
                                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 relative z-10">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Mesajınız</label>
                    <textarea className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-amber-500 outline-none transition-colors h-32 placeholder:text-slate-600 resize-none" placeholder="Filo büyüklüğü ve özel taleplerinizden bahsedebilirsiniz..."></textarea>
                </div>

                <button className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-xl text-lg shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] transition-all transform hover:scale-[1.01] active:scale-[0.99] relative z-10">
                    BAŞVURUYU GÖNDER
                </button>
                <p className="text-center text-[10px] text-slate-600 flex items-center justify-center gap-2 mt-4">
                    <ShieldCheck size={12} /> Bu form üzerinden gönderilen bilgiler KVKK kapsamında gizli tutulur.
                </p>
            </form>
        </div>
      </section>

    </div>
  );
}