"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase"; // Veritabanı bağlantısı eklendi
import { 
  Building2, ShieldCheck, Zap, Activity, ChevronRight, 

  ArrowLeft, CheckCircle2, TrendingUp, Lock, Users, 

  Briefcase, Calculator, Truck,

  XCircle, BarChart, Smartphone, Bot, Layers, Monitor, 

  Crown, Loader2
} from "lucide-react";

export default function KurumsalPage() {
  const [deviceCount, setDeviceCount] = useState(50);
  const estimatedSavings = (deviceCount * 27000).toLocaleString('tr-TR');

  // FORM STATE'LERİ
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    sirket_adi: "",
    yetkili_kisi: "",
    email: "",
    telefon: "",
    notlar: "",
    sektorler: [] as string[]
  });

  // Checkbox (Hizmet Seçimi) Yönetimi
  const handleCheckboxChange = (value: string) => {
    setFormData(prev => {
      if (prev.sektorler.includes(value)) {
        return { ...prev, sektorler: prev.sektorler.filter(item => item !== value) };
      } else {
        return { ...prev, sektorler: [...prev.sektorler, value] };
      }
    });
  };

  // Form Gönderme İşlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // Supabase'e veri ekleme
        const { error } = await supabase.from('bayi_basvurulari').insert([
            {
                sirket_adi: formData.sirket_adi,
                yetkili_kisi: formData.yetkili_kisi,
                email: formData.email,
                telefon: formData.telefon,
                notlar: formData.notlar,
                sektorler: formData.sektorler
            }
        ]);

        if (error) throw error;

        setSuccess(true);
        // Formu temizle
        setFormData({ sirket_adi: "", yetkili_kisi: "", email: "", telefon: "", notlar: "", sektorler: [] });
    } catch (error) {
        console.error("Hata:", error);
        alert("Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-amber-500/30">
      
      {/* HEADER / NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> 
                <span className="hidden sm:inline">Ana Sayfaya Dön</span>
            </Link>
            <div className="flex items-center gap-3">
                <div className="hidden md:flex bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase items-center gap-2">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>
                    B2B PARTNER PORTAL
                </div>
                <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                    <Building2 className="text-amber-500" size={24}/>
                    AURA<span className="text-amber-500">BUSINESS</span>
                </div>
            </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-amber-900/10 via-[#020617] to-[#020617] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-in fade-in slide-in-from-bottom-4">
                    <Briefcase size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Kurumsal Güvence Protokolü</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
                    İşletmenizin Teknolojik <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 filter drop-shadow-lg">Sürekliliğini Koruyun.</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mb-10 font-light">
                    Kurumsal envanteriniz için <strong>resmi faturalı, garantili ve KVKK uyumlu</strong> teknik servis altyapısı. Biz cihazlarınızla ilgilenirken, siz büyümenize odaklanın.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-8 mb-12 items-start sm:items-center">
                    <button onClick={() => document.getElementById('basvuru-formu')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] flex items-center justify-center gap-3 hover:-translate-y-1">
                        KURUMSAL TEKLİF AL <ChevronRight size={20} strokeWidth={3}/>
                    </button>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-300">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><CheckCircle2 className="text-green-500" size={16}/> 6 Ay Garanti</div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><CheckCircle2 className="text-green-500" size={16}/> Orijinal Parça</div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><CheckCircle2 className="text-green-500" size={16}/> E-Fatura</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* UZMANLIK ALANLARI */}
      <section className="py-24 bg-[#020617] relative border-t border-white/5">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-white mb-4">Uzmanlık Alanlarımız</h2>
                  <p className="text-slate-400">Teknik laboratuvarımız, aşağıdaki donanım gruplarında "Level 4" onarım yetkinliğine sahiptir.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* 1. PC & Workstation */}
                  <div className="bg-[#0a0e17] border border-white/5 p-8 rounded-2xl hover:border-amber-500/50 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Monitor size={80}/></div>
                      <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-500">
                          <Monitor size={32} />
                      </div>
                      <h4 className="text-white font-bold text-lg mb-3">PC & İş İstasyonu</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                          Ofis laptopları, All-in-One PC'ler, yüksek performanslı Render bilgisayarları ve sunucu bakımları.
                      </p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded">Anakart</span>
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded">Ekran Kartı</span>
                      </div>
                  </div>

                  {/* 2. Kurumsal Mobilite */}
                  <div className="bg-[#0a0e17] border border-white/5 p-8 rounded-2xl hover:border-amber-500/50 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Smartphone size={80}/></div>
                      <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-green-500">
                          <Smartphone size={32} />
                      </div>
                      <h4 className="text-white font-bold text-lg mb-3">Kurumsal Mobilite</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                          Şirket hatlarına tanımlı iPhone, Samsung filoları ve saha operasyon tabletlerinin toplu onarımı.
                      </p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                          <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded">Ekran</span>
                          <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded">Batarya</span>
                      </div>
                  </div>

                  {/* 3. Robotik Temizlik */}
                  <div className="bg-[#0a0e17] border border-white/5 p-8 rounded-2xl hover:border-amber-500/50 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Bot size={80}/></div>
                      <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-amber-500">
                          <Bot size={32} />
                      </div>
                      <h4 className="text-white font-bold text-lg mb-3">Robotik Temizlik</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                          Ofis ve plazalarda kullanılan Roborock, Xiaomi vb. robot süpürgelerin sensör ve anakart onarımı.
                      </p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded">Lidar</span>
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded">Fırça Motoru</span>
                      </div>
                  </div>

                  {/* 4. Ekosistem & IoT */}
                  <div className="bg-[#0a0e17] border border-white/5 p-8 rounded-2xl hover:border-amber-500/50 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Layers size={80}/></div>
                      <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-purple-500">
                          <Layers size={32} />
                      </div>
                      <h4 className="text-white font-bold text-lg mb-3">Ekosistem Ürünleri</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                          Akıllı saatler, kulaklıklar, projeksiyon cihazları ve diğer ofis içi IoT donanımlarının bakımı.
                      </p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                          <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded">Apple Watch</span>
                          <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded">AirPods</span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* HİZMET PAKETLERİ */}
      <section className="py-24 bg-[#030712] border-y border-white/5">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <span className="text-amber-500 font-bold tracking-widest text-xs uppercase bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">Service Level Agreement</span>
                  <h2 className="text-3xl font-bold text-white mt-4">Hizmet Seviyeleri</h2>
                  <p className="text-slate-400 mt-2">İş hacminize uygun bakım modelini seçin.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {/* Standart Paket */}
                  <div className="border border-white/10 rounded-3xl p-8 bg-[#0a0e17] flex flex-col hover:border-slate-500 transition-colors relative group">
                      <div className="text-slate-400 font-bold tracking-widest text-xs uppercase mb-2">Başlangıç</div>
                      <h3 className="text-2xl font-black text-white mb-6">Standart</h3>
                      <div className="text-sm text-slate-400 mb-8 border-b border-white/5 pb-8 min-h-[60px]">
                          Düzenli anlaşma gerektirmez. Cihazınız bozuldukça gönderin, standart tarife üzerinden işlem yapalım.
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={16} className="text-slate-500"/> Standart Servis (3-5 Gün)</li>
                          <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={16} className="text-slate-500"/> Şube/Kargo Teslim</li>
                          <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={16} className="text-slate-500"/> Dijital Servis Formu</li>
                          <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={16} className="text-slate-500"/> 3 Ay Garanti</li>
                      </ul>
                      <button onClick={() => document.getElementById('basvuru-formu')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all font-bold text-sm">Seç</button>
                  </div>

                  {/* Gold Partner (ÖNERİLEN) */}
                  <div className="border border-amber-500 rounded-3xl p-8 bg-[#0a0e17] flex flex-col relative shadow-[0_0_30px_rgba(245,158,11,0.1)] scale-105 z-10">
                      <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">EN ÇOK TERCİH EDİLEN</div>
                      <div className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-2">Profesyonel</div>
                      <h3 className="text-2xl font-black text-white mb-6">Gold Partner</h3>
                      <div className="text-sm text-slate-400 mb-8 border-b border-white/5 pb-8 min-h-[60px]">
                          KOBİ'ler ve büyüyen filolar için. Öncelik, hız ve maliyet avantajı bir arada.
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 size={16} className="text-amber-500"/> <strong>24 Saat</strong> Fast-Track (Hız)</li>
                          <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 size={16} className="text-amber-500"/> %10 Yedek Parça İndirimi</li>
                          <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 size={16} className="text-amber-500"/> Ücretsiz Kargo / Moto-Kurye</li>
                          <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 size={16} className="text-amber-500"/> Aura Fleet Panel Erişimi</li>
                      </ul>
                      <button onClick={() => document.getElementById('basvuru-formu')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-all font-bold text-sm shadow-lg shadow-amber-500/20">Hemen Başvur</button>
                  </div>

                  {/* Platinum Paket */}
                  <div className="border border-white/10 rounded-3xl p-8 bg-[#0a0e17] flex flex-col hover:border-purple-500 transition-colors relative group">
                      <div className="text-purple-400 font-bold tracking-widest text-xs uppercase mb-2">Holding / Zincir</div>
                      <h3 className="text-2xl font-black text-white mb-6">Platinum</h3>
                      <div className="text-sm text-slate-400 mb-8 border-b border-white/5 pb-8 min-h-[60px]">
                          Büyük ölçekli operasyonlar için VIP hizmet. Size özel atanan müşteri yöneticisi.
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-3 text-sm text-slate-300"><Crown size={16} className="text-purple-500"/> <strong>Dedike Müşteri Yöneticisi</strong></li>
                          <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={16} className="text-purple-500"/> Konsinye (Yedek) Cihaz Desteği</li>
                          <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={16} className="text-purple-500"/> 7/24 Acil Destek Hattı</li>
                          <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={16} className="text-purple-500"/> Yıllık Envanter Check-Up</li>
                      </ul>
                      <button onClick={() => document.getElementById('basvuru-formu')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all font-bold text-sm">Teklif Al</button>
                  </div>
              </div>
          </div>
      </section>

      {/* KARŞILAŞTIRMA TABLOSU */}
      <section className="py-24 relative">
          <div className="container mx-auto px-6">
              <div className="bg-[#0f172a]/50 rounded-3xl border border-white/5 p-8 md:p-12 overflow-hidden relative backdrop-blur-sm">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                  
                  <div className="text-center mb-16">
                      <h2 className="text-3xl md:text-5xl font-black text-white mt-4 leading-tight">
                          Neden <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Aura Business?</span>
                      </h2>
                  </div>

                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead>
                              <tr className="border-b border-white/10">
                                  <th className="py-6 px-6 text-slate-500 font-bold uppercase text-xs tracking-widest w-1/4">Hizmet Kriteri</th>
                                  <th className="py-6 px-6 text-slate-500 font-bold text-lg w-1/3 opacity-70">Standart Servisler</th>
                                  <th className="py-6 px-6 text-amber-500 font-black text-xl w-1/3 bg-amber-500/5 rounded-t-2xl border-t border-x border-amber-500/20">
                                      AURA BUSINESS
                                  </th>
                              </tr>
                          </thead>
                          <tbody className="text-sm">
                              {/* 1. Veri Güvenliği */}
                              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                  <td className="py-6 px-6 text-white font-bold text-base flex items-center gap-3">
                                      <Lock size={20} className="text-slate-600 group-hover:text-white transition-colors"/> Veri Güvenliği
                                  </td>
                                  <td className="py-6 px-6 text-slate-500">
                                      <div className="flex items-center gap-2"><XCircle size={16} className="text-red-900"/> Belirsiz / Riskli</div>
                                  </td>
                                  <td className="py-6 px-6 text-white font-bold bg-amber-500/5 border-x border-amber-500/10">
                                      <div className="flex items-center gap-2 text-amber-400"><ShieldCheck size={18}/> KVKK & NDA Garantisi</div>
                                  </td>
                              </tr>
                              {/* 2. Hız */}
                              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                  <td className="py-6 px-6 text-white font-bold text-base flex items-center gap-3">
                                      <Zap size={20} className="text-slate-600 group-hover:text-white transition-colors"/> Hız
                                  </td>
                                  <td className="py-6 px-6 text-slate-500">
                                      <div className="flex items-center gap-2"><XCircle size={16} className="text-red-900"/> 3 - 15 Gün</div>
                                  </td>
                                  <td className="py-6 px-6 text-white font-bold bg-amber-500/5 border-x border-amber-500/10">
                                      <div className="flex items-center gap-2 text-amber-400"><CheckCircle2 size={18}/> 24 Saat (Fast-Track)</div>
                                  </td>
                              </tr>
                              {/* 3. Lojistik */}
                              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                  <td className="py-6 px-6 text-white font-bold text-base flex items-center gap-3">
                                      <Truck size={20} className="text-slate-600 group-hover:text-white transition-colors"/> Lojistik
                                  </td>
                                  <td className="py-6 px-6 text-slate-500">
                                      <div className="flex items-center gap-2"><XCircle size={16} className="text-red-900"/> Siz Getirirsiniz</div>
                                  </td>
                                  <td className="py-6 px-6 text-white font-bold bg-amber-500/5 border-x border-amber-500/10">
                                      <div className="flex items-center gap-2 text-amber-400"><CheckCircle2 size={18}/> Yerinde Alım / Teslim</div>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="py-24 bg-[#050810] border-y border-white/5 relative overflow-hidden">
         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Aura Fleet <span className="text-amber-500">Panel</span></h2>
                    <p className="text-slate-400 max-w-xl text-lg">
                        Cihazlarınızı Excel'de değil, profesyonel panelde takip edin.
                    </p>
                </div>
            </div>

            {/* FAKE DASHBOARD UI */}
            <div className="relative w-full bg-[#0f172a] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
                <div className="bg-[#1e293b] px-6 py-4 flex items-center justify-between border-b border-slate-700">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono hidden sm:block">portal.aura-bilisim.com/enterprise</div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-slate-400">Canlı Bağlantı</span>
                    </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#020617] p-5 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-bold">Envanter</div>
                        <div className="text-3xl font-black text-white">142 <span className="text-sm font-normal text-slate-500">Aktif</span></div>
                    </div>
                    <div className="bg-[#020617] p-5 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-bold">Serviste</div>
                        <div className="text-3xl font-black text-amber-500">3 <span className="text-sm font-normal text-slate-500">İşlemde</span></div>
                    </div>
                    <div className="md:col-span-2 bg-[#020617] p-5 rounded-xl border border-slate-800 flex items-center justify-between relative overflow-hidden">
                        <div>
                            <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-bold">Toplam Tasarruf</div>
                            <div className="text-3xl font-black text-green-500">₺45.200</div>
                        </div>
                        <BarChart className="text-slate-700 absolute right-4 bottom-4" size={64}/>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* ROI / TASARRUF HESAPLAYICI */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
            <div className="bg-[#0a0e17] p-8 md:p-12 rounded-[2.5rem] border border-slate-800 shadow-[0_0_50px_rgba(245,158,11,0.05)] relative group max-w-4xl mx-auto text-center">
                <div className="absolute top-0 right-0 p-6 opacity-20"><Calculator size={64} className="text-amber-500"/></div>
                
                <h3 className="text-3xl font-bold text-white mb-2">Bütçe Dostu Teknoloji</h3>
                <p className="text-slate-400 text-sm mb-10">Cihaz yenilemek yerine Aura garantisiyle onarın, şirket bütçesini koruyun.</p>
                
                <div className="mb-10 max-w-lg mx-auto">
                    <label className="text-slate-400 text-sm font-bold mb-4 block flex justify-between uppercase tracking-wider">
                        <span>Şirket Cihaz Sayısı</span>
                        <span className="text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">{deviceCount} Adet</span>
                    </label>
                    <input 
                        type="range" 
                        min="10" 
                        max="500" 
                        step="10"
                        value={deviceCount} 
                        onChange={(e) => setDeviceCount(parseInt(e.target.value))}
                        className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
                    />
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800">
                    <div className="text-slate-400 text-xs mb-1 uppercase tracking-widest">Potansiyel Yıllık Kazanç</div>
                    <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tight">
                        {estimatedSavings} ₺
                    </div>
                    <div className="text-[10px] text-slate-600 mt-4">
                        *Ortalama cihaz yenileme vs onarım maliyetleri baz alınmıştır.
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* SIKÇA SORULAN SORULAR */}
      <section className="py-24 border-t border-white/5 bg-[#030712]">
          <div className="container mx-auto px-6 max-w-4xl">
              <div className="text-center mb-12">
                  <h2 className="text-2xl font-bold text-white">Sıkça Sorulan Sorular</h2>
              </div>
              <div className="space-y-4">
                  {[
                      { q: "Sözleşme süresi ne kadar?", a: "Aura Business esnektir. İsterseniz yıllık bakım anlaşması yapabilir, isterseniz taahhütsüz 'Servis Başına Ödeme' modelini seçebilirsiniz." },
                      { q: "Hangi bölgelere hizmet veriyorsunuz?", a: "İstanbul içi (Avrupa & Anadolu) moto-kurye ile yerinden alım yapıyoruz. Diğer iller için 'Kurumsal Kargo Anlaşma Kodu'muz ile ücretsiz gönderim sağlayabilirsiniz." },
                      { q: "Ödeme koşulları nasıl?", a: "Projeye ve anlaşma kapsamına bağlı olarak, nakit akışınıza uygun esnek ödeme planları sunuyoruz. Detaylar için teklif isteyiniz." },
                      { q: "Veri güvenliğini nasıl sağlıyorsunuz?", a: "Cihazlar laboratuvara girdiği an 'Offline Mode'a alınır. Talep edilirse onarım sonrası diskler 'Military Grade' (Askeri Standart) silme işlemine tabi tutulur." },
                  ].map((faq, i) => (
                      <div key={i} className="bg-[#0f172a] border border-white/5 rounded-xl p-6 hover:border-amber-500/20 transition-colors">
                          <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-3"><span className="text-amber-500">Q.</span> {faq.q}</h4>
                          <p className="text-slate-400 text-sm pl-7">{faq.a}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* BAŞVURU FORMU */}
      <section id="basvuru-formu" className="py-24 bg-[#010205] relative border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-white mb-4">Partnerlik Başvurusu</h2>
                <p className="text-slate-400 text-lg">Aşağıdaki formu doldurun, Kurumsal departmanımız size özel bir teklif ile dönüş yapsın.</p>
            </div>

            {success ? (
                <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-center animate-in zoom-in">
                    <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4"/>
                    <h3 className="text-2xl font-bold text-white mb-2">Başvurunuz Alındı!</h3>
                    <p className="text-slate-400">Talebiniz kurumsal ekibimize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.</p>
                    <button onClick={() => setSuccess(false)} className="mt-6 text-green-500 hover:text-green-400 underline">Yeni Başvuru Yap</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-[#0a0e17] p-8 md:p-12 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Şirket Ünvanı</label>
                            <input required value={formData.sirket_adi} onChange={e => setFormData({...formData, sirket_adi: e.target.value})} type="text" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-amber-500 outline-none transition-colors" placeholder="Firma Adı" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Yetkili Kişi</label>
                            <input required value={formData.yetkili_kisi} onChange={e => setFormData({...formData, yetkili_kisi: e.target.value})} type="text" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-amber-500 outline-none transition-colors" placeholder="Ad Soyad" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Kurumsal E-Posta</label>
                            <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-amber-500 outline-none transition-colors" placeholder="info@sirketiniz.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Telefon</label>
                            <input required value={formData.telefon} onChange={e => setFormData({...formData, telefon: e.target.value})} type="tel" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-amber-500 outline-none transition-colors" placeholder="05XX..." />
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">İhtiyaç Duyulan Hizmetler</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['PC / İş İstasyonu', 'Mobil Cihazlar', 'Robotik / IoT', 'Veri Kurtarma'].map((opt, i) => (
                                <label key={i} className={`flex items-center gap-3 p-4 bg-[#020617] border rounded-xl cursor-pointer transition-all group ${formData.sektorler.includes(opt) ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 hover:border-amber-500/50'}`}>
                                    <input 
                                        type="checkbox" 
                                        className="accent-amber-500 w-4 h-4"
                                        checked={formData.sektorler.includes(opt)}
                                        onChange={() => handleCheckboxChange(opt)}
                                    />
                                    <span className={`text-sm group-hover:text-white transition-colors ${formData.sektorler.includes(opt) ? 'text-amber-400' : 'text-slate-400'}`}>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 relative z-10">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Not / Özel İstekler</label>
                        <textarea value={formData.notlar} onChange={e => setFormData({...formData, notlar: e.target.value})} className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-amber-500 outline-none transition-colors h-32 resize-none" placeholder="Filo büyüklüğü ve detaylar..."></textarea>
                    </div>

                    <button disabled={loading} type="submit" className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-xl text-lg shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] transition-all transform hover:scale-[1.01] active:scale-[0.99] relative z-10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? <><Loader2 className="animate-spin"/> GÖNDERİLİYOR...</> : "BAŞVURUYU GÖNDER"}
                    </button>
                    <p className="text-center text-[10px] text-slate-600 flex items-center justify-center gap-2 mt-4">
                        <Lock size={12} /> Bilgileriniz Aura B2B Gizlilik Politikası kapsamında korunmaktadır.
                    </p>
                </form>
            )}
        </div>
      </section>

    </div>
  );
}