"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { EXPERTISE_DATA } from '@/data/expertiseSteps';
import { 
  Printer, CheckCircle, ChevronLeft, AlertTriangle, ArrowRight, Save, 
  User, Smartphone, Globe, ShieldCheck, Download, History, Eye, X, FileText
} from 'lucide-react';

export default function ExpertisePage() {
  const [stage, setStage] = useState<'category' | 'details' | 'test' | 'report' | 'history'>('category');
  const [isSaving, setIsSaving] = useState(false);
  const [pastReports, setPastReports] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [includeCustomer, setIncludeCustomer] = useState(false); 
  const [includePrice, setIncludePrice] = useState(false); 
  
  const [deviceInfo, setDeviceInfo] = useState({ 
    brand: '', model: '', serial: '', 
    customerName: '', price: '', origin: 'TR', 
    reportDate: '' 
  });
  
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [technicianNote, setTechnicianNote] = useState("");
  const [currentScore, setCurrentScore] = useState(0);
  const [cosmeticGrade, setCosmeticGrade] = useState("-");

  // Puan ve Grade Hesapla
  useEffect(() => {
    if (!selectedCategory || !EXPERTISE_DATA[selectedCategory]) {
      setCurrentScore(0);
      setCosmeticGrade("-");
      return;
    }
    let totalScore = 0;
    let maxPossibleScore = 0;
    let gradeFound = "-";

    EXPERTISE_DATA[selectedCategory].forEach(group => {
      group.steps.forEach(step => {
        const maxOpt = Math.max(...step.options.map(o => o.score));
        maxPossibleScore += maxOpt;

        const val = answers[step.id];
        if (val) {
          const selectedOpt = step.options.find(o => o.value === val);
          if (selectedOpt) totalScore += selectedOpt.score;
          // Grade yakala (id'si grade olan sorunun cevabı)
          if (step.id === 'grade' && selectedOpt) {
             gradeFound = selectedOpt.value;
          }
        }
      });
    });
    
    setCosmeticGrade(gradeFound);
    setCurrentScore(maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0);
  }, [answers, selectedCategory]);

  // Geçmişi Getir
  const fetchHistory = async () => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from('aura_expertise_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPastReports(data);
    setLoadingHistory(false);
    setStage('history');
  };

  // Geçmiş Raporu Yükle
  const loadPastReport = (report: any) => {
    setSelectedCategory(report.category);
    setDeviceInfo({
      brand: report.brand,
      model: report.model,
      serial: report.serial_no,
      customerName: report.customer_name || '',
      price: report.service_price || '',
      origin: report.device_origin || 'TR',
      reportDate: new Date(report.created_at).toLocaleDateString('tr-TR')
    });
    setAnswers(report.answers);
    setTechnicianNote(report.technician_note || "");
    setIncludeCustomer(!!report.customer_name);
    setIncludePrice(!!report.service_price);
    setStage('report');
  };

  // Yeni Test Başlat
  const startNewTest = (cat: string) => {
    setSelectedCategory(cat);
    setDeviceInfo({ 
      brand: '', model: '', serial: '', 
      customerName: '', price: '', origin: 'TR', reportDate: '' 
    });
    setAnswers({});
    setTechnicianNote("");
    setStage('details');
  };

  // Kaydet
  const handleSaveReport = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('aura_expertise_reports').insert({
        category: selectedCategory,
        brand: deviceInfo.brand,
        model: deviceInfo.model,
        serial_no: deviceInfo.serial,
        customer_name: includeCustomer ? deviceInfo.customerName : null,
        service_price: includePrice ? deviceInfo.price : null,
        device_origin: deviceInfo.origin,
        score: currentScore,
        answers: answers,
        technician_note: technicianNote,
        technician_email: user?.email
      });

      if (error) throw error;
      alert("✅ Rapor başarıyla kaydedildi!");
    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- EKRAN 1: KATEGORİ ---
  if (stage === 'category') {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center animate-in zoom-in-95">
        <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">AURA<span className="text-cyan-400">EKSPER</span></h1>
        <p className="text-gray-400 mb-8">Profesyonel M360 Standardında Test Merkezi</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl mb-12">
          <CategoryCard icon="📱" title="Telefon" onClick={() => startNewTest('phone')} color="border-cyan-500/50 hover:bg-cyan-900/20" />
          <CategoryCard icon="🧹" title="Robot Süpürge" onClick={() => startNewTest('robot')} color="border-orange-500/50 hover:bg-orange-900/20" />
          <CategoryCard icon="📹" title="Araç Kamerası" onClick={() => startNewTest('dashcam')} color="border-red-500/50 hover:bg-red-900/20" />
          <CategoryCard icon="💻" title="Bilgisayar" onClick={() => startNewTest('pc')} color="border-purple-500/50 hover:bg-purple-900/20" />
          <CategoryCard icon="⌚️" title="Akıllı Saat" onClick={() => startNewTest('watch')} color="border-green-500/50 hover:bg-green-900/20" />
        </div>

        <button onClick={fetchHistory} className="flex items-center gap-2 bg-gray-800 text-gray-300 px-6 py-3 rounded-full hover:bg-gray-700 transition border border-gray-700">
           <History size={18} /> Geçmiş Raporlar
        </button>
      </div>
    );
  }

  // --- EKRAN 1.5: GEÇMİŞ LİSTESİ ---
  if (stage === 'history') {
    return (
       <div className="p-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <button onClick={() => setStage('category')} className="bg-gray-800 p-2 rounded-lg text-white hover:bg-gray-700"><ChevronLeft/></button>
             <h1 className="text-2xl font-bold text-white">Rapor Arşivi</h1>
          </div>
          
          {loadingHistory ? <div className="text-white text-center">Yükleniyor...</div> : (
             <div className="grid gap-3">
                {pastReports.length === 0 && <p className="text-gray-500 text-center">Kayıtlı rapor bulunamadı.</p>}
                {pastReports.map((report) => (
                   <div key={report.id} className="bg-gray-800 p-4 rounded-xl flex items-center justify-between border border-gray-700 hover:border-gray-500 transition">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${report.score >= 80 ? 'bg-green-900 text-green-400' : 'bg-orange-900 text-orange-400'}`}>
                            {report.score}
                         </div>
                         <div>
                            <h3 className="font-bold text-white">{report.brand} {report.model}</h3>
                            <p className="text-xs text-gray-400 font-mono">{report.serial_no} • {new Date(report.created_at).toLocaleDateString('tr-TR')}</p>
                         </div>
                      </div>
                      <button onClick={() => loadPastReport(report)} className="bg-cyan-600 px-4 py-2 rounded-lg text-white font-bold text-sm flex items-center gap-2 hover:bg-cyan-700">
                         <Eye size={16}/> Aç
                      </button>
                   </div>
                ))}
             </div>
          )}
       </div>
    )
  }

  // --- EKRAN 2: BİLGİ GİRİŞİ ---
  if (stage === 'details') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setStage('category')} className="absolute top-4 left-4 text-gray-400 hover:text-white"><X/></button>
            <h2 className="text-2xl font-bold text-white text-center mb-6">Cihaz Bilgileri</h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input value={deviceInfo.brand} onChange={e => setDeviceInfo({...deviceInfo, brand: e.target.value})} className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-cyan-500" placeholder="* Marka (Apple)" />
                    <input value={deviceInfo.model} onChange={e => setDeviceInfo({...deviceInfo, model: e.target.value})} className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-cyan-500" placeholder="* Model (iPhone 13)" />
                </div>
                <input value={deviceInfo.serial} onChange={e => setDeviceInfo({...deviceInfo, serial: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-cyan-500 font-mono" placeholder="* Seri No / IMEI" />
                
                <div className="flex gap-4">
                   <select value={deviceInfo.origin} onChange={e => setDeviceInfo({...deviceInfo, origin: e.target.value})} className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white outline-none w-full">
                      <option value="TR">🇹🇷 Türkiye Cihazı</option>
                      <option value="YD">🌍 Yurt Dışı</option>
                   </select>
                </div>

                <div className="border-t border-gray-700 pt-4 space-y-2">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Müşteri Bilgisi Ekle</span>
                      <input type="checkbox" checked={includeCustomer} onChange={e => setIncludeCustomer(e.target.checked)} className="w-5 h-5 accent-cyan-500"/>
                   </div>
                   {includeCustomer && <input value={deviceInfo.customerName} onChange={e => setDeviceInfo({...deviceInfo, customerName: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white outline-none" placeholder="Müşteri Adı Soyadı" />}
                   
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Fiyat Bilgisi Ekle</span>
                      <input type="checkbox" checked={includePrice} onChange={e => setIncludePrice(e.target.checked)} className="w-5 h-5 accent-cyan-500"/>
                   </div>
                   {includePrice && <input type="number" value={deviceInfo.price} onChange={e => setDeviceInfo({...deviceInfo, price: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white outline-none" placeholder="0.00 ₺" />}
                </div>

                <button 
                   onClick={() => { setDeviceInfo({...deviceInfo, reportDate: new Date().toLocaleDateString('tr-TR')}); setStage('test'); }}
                   disabled={!deviceInfo.brand || !deviceInfo.model || !deviceInfo.serial}
                   className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                   TESTİ BAŞLAT
                </button>
            </div>
         </div>
      </div>
    );
  }

  // --- EKRAN 3: RAPOR (A4 & BASKI) ---
  if (stage === 'report') {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex justify-center print:p-0 print:bg-white overflow-auto">
        <div className="fixed top-6 right-6 flex flex-col gap-3 print:hidden z-50">
           <button onClick={() => setStage('test')} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-600"><ChevronLeft size={18}/> Düzenle</button>
           <button onClick={handleSaveReport} disabled={isSaving} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg">{isSaving ? '...' : <><Save size={18}/> Kaydet</>}</button>
           <button onClick={() => window.print()} className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-700 shadow-lg"><Printer size={18}/> Yazdır / PDF</button>
           <button onClick={() => setStage('category')} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 mt-4"><X size={18}/> Çıkış</button>
        </div>

        {/* A4 KAĞIT ALANI */}
        <div className="bg-white text-slate-900 w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl print:shadow-none print:w-full print:absolute print:top-0 print:left-0 flex flex-col relative overflow-hidden">
           {/* LOGO WATERMARK - DÜZELTİLDİ: DAHA KOYU */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] opacity-[0.08] pointer-events-none grayscale">
              <img src="/image/aura-logo.png" alt="" className="w-full" />
           </div>

           {/* HEADER */}
           <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4 mb-6 relative z-10">
              <div className="flex items-center gap-4">
                 <img src="/image/aura-logo.png" alt="Logo" className="h-14 w-auto object-contain" />
                 <div className="pl-4 border-l-2 border-slate-800">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">AURA<span className="text-cyan-600">BİLİŞİM</span></h1>
                    <p className="text-[10px] font-bold text-slate-600 tracking-[0.2em] mt-1">PROFESYONEL EKSPERTİZ MERKEZİ</p>
                 </div>
              </div>
              <div className="text-right">
                 <div className="bg-slate-900 text-white px-3 py-1 text-[10px] font-bold rounded mb-1 inline-block">RAPOR ID: {Math.floor(Math.random()*999999)}</div>
                 <p className="text-xs text-slate-500 font-mono font-bold">{deviceInfo.reportDate}</p>
              </div>
           </div>

           {/* CİHAZ KARTI */}
           <div className="flex gap-4 mb-6 relative z-10">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-10">
                    <span className={`text-6xl font-black ${deviceInfo.origin === 'TR' ? 'text-red-500' : 'text-blue-500'}`}>{deviceInfo.origin}</span>
                 </div>
                 <div className="grid grid-cols-2 gap-y-3 text-sm relative z-10">
                    <div><span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">MARKA / MODEL</span><span className="font-black text-lg uppercase text-slate-800">{deviceInfo.brand} {deviceInfo.model}</span></div>
                    <div><span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">SERİ NO / IMEI</span><span className="font-mono font-bold text-slate-700">{deviceInfo.serial}</span></div>
                    {includeCustomer && <div><span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">MÜŞTERİ</span><span className="font-medium uppercase text-slate-800">{deviceInfo.customerName}</span></div>}
                 </div>
              </div>
              
              {/* PUAN VE GRADE KUTUSU */}
              <div className="w-32 flex flex-col gap-2">
                 <div className="flex-1 bg-slate-900 text-white rounded-xl p-2 flex flex-col items-center justify-center">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">KOZMETİK DERECESİ</span>
                    <div className={`text-5xl font-black ${cosmeticGrade.includes('A') ? 'text-green-400' : 'text-yellow-400'}`}>{cosmeticGrade}</div>
                 </div>
                 <div className="bg-slate-100 border border-slate-300 rounded-xl p-1 text-center">
                    <span className="text-[8px] font-bold text-slate-500">GENEL SKOR</span>
                    <div className="text-xl font-black text-slate-800">{currentScore}</div>
                 </div>
              </div>
           </div>
           
           {includePrice && (
              <div className="mb-6 bg-green-50 border border-green-200 p-3 rounded-lg flex justify-between items-center text-green-900 relative z-10">
                 <span className="font-bold text-xs uppercase">Hizmet Bedeli</span>
                 <span className="font-black text-xl">{deviceInfo.price} ₺</span>
              </div>
           )}

           {/* TEST SONUÇLARI */}
           <div className="flex-1 columns-2 gap-8 relative z-10">
              {selectedCategory && EXPERTISE_DATA[selectedCategory]?.map((group) => (
                 <div key={group.id} className="break-inside-avoid mb-5">
                    <h4 className="font-bold text-[10px] text-slate-600 uppercase mb-1.5 flex items-center gap-2 border-b border-slate-300 pb-1">
                       <span className="text-lg">{group.icon}</span> {group.title}
                    </h4>
                    <ul className="space-y-1">
                       {group.steps.map((step) => {
                          const val = answers[step.id];
                          const opt = step.options.find(o => o.value === val);
                          if(!opt) return null;
                          // Grade sorusunu raporda gizle, zaten yukarıda büyük gösteriyoruz
                          if(step.id === 'grade') return null;

                          return (
                             <li key={step.id} className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-700 font-semibold">{step.label}</span>
                                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${opt.isBad ? 'bg-red-100 text-red-700' : opt.score < 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{opt.reportText}</span>
                             </li>
                          )
                       })}
                    </ul>
                 </div>
              ))}
           </div>

           {/* TEKNİSYEN NOTU */}
           {technicianNote && (
              <div className="mb-4 text-[10px] text-slate-700 bg-yellow-50 p-3 rounded border border-yellow-200 relative z-10 italic">
                 <strong className="uppercase not-italic text-yellow-700 mr-2">TEKNİSYEN NOTU:</strong> {technicianNote}
              </div>
           )}

           {/* YASAL UYARI VE FOOTER - DETAYLANDIRILDI */}
           <div className="mt-auto relative z-10">
              <div className="border-t-2 border-slate-900 pt-3 grid grid-cols-10 gap-4 text-[7px] text-slate-600 leading-tight text-justify">
                  <div className="col-span-7 grid grid-cols-2 gap-4">
                     <div>
                        <h5 className="font-bold text-slate-900 mb-0.5">1. GENEL ŞARTLAR</h5>
                        <p>Bu rapor, cihazın teslim anındaki durumunu belgeler. Sonradan oluşacak arızalar kapsam dışıdır. Sıvı teması, darbe, voltaj hasarı garanti dışıdır. Müşteri veri yedeğini almakla yükümlüdür, veri kaybından firmamız sorumlu değildir.</p>
                     </div>
                     <div>
                        <h5 className="font-bold text-slate-900 mb-0.5">2. KVKK AYDINLATMA</h5>
                        <p>6698 sayılı KVKK gereği, cihazdaki kişisel veriler sadece onarım/test amaçlı işlenebilir. Cihaz sahibi, cihazını teslim ederek bu şartları kabul etmiş sayılır. Onarım garantisi (değişen parça için) 6 aydır.</p>
                     </div>
                     <div className="col-span-2 mt-1">
                        <strong>Aura Bilişim Teknolojileri San. ve Tic. Ltd. Şti.</strong> | Merkez Mah. Teknoloji Cad. No:123 İstanbul | 0850 123 45 67 | www.aurabilisim.com | Mersis: 012345678900001
                     </div>
                  </div>

                  <div className="col-span-3 flex flex-col justify-between">
                     <div className="flex justify-between items-end mb-2">
                        <div className="text-center w-20">
                           <div className="h-8 border-b border-slate-400 border-dashed mb-1"></div>
                           <p className="text-[6px] font-bold uppercase">TESLİM ALAN</p>
                        </div>
                        <div className="text-center w-20">
                           <div className="h-8 border-b border-slate-400 border-dashed mb-1 flex items-end justify-center relative">
                              <div className="absolute inset-0 opacity-20 rotate-[-10deg] flex items-center justify-center border border-cyan-700 rounded-full p-0.5">
                                 <span className="text-[5px] text-cyan-900 font-black uppercase text-center leading-none">AURA BİLİŞİM<br/>SERVİS ONAYI</span>
                              </div>
                              <span className="font-handwriting text-xs text-slate-500">AuraTech</span>
                           </div>
                           <p className="text-[6px] font-bold uppercase">YETKİLİ ONAYI</p>
                        </div>
                     </div>
                     <p className="text-[6px] text-center text-slate-400">Bu belge elektronik ortamda oluşturulmuştur.</p>
                  </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- EKRAN 4: TEST YAPMA (EDİTÖR) ---
  return (
    <div className="p-6 max-w-7xl mx-auto pb-24">
       <div className="sticky top-4 z-40 bg-gray-900/90 backdrop-blur p-4 rounded-xl border border-gray-700 shadow-xl mb-6 flex justify-between items-center">
          <div>
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Smartphone className="text-cyan-400"/> {deviceInfo.brand} {deviceInfo.model}
                <span className={`text-[10px] px-2 py-0.5 rounded border ${deviceInfo.origin === 'TR' ? 'bg-red-900/30 text-red-400 border-red-500/30' : 'bg-blue-900/30 text-blue-400 border-blue-500/30'}`}>{deviceInfo.origin}</span>
             </h2>
             <p className="text-gray-400 text-xs font-mono">{deviceInfo.serial}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-[10px] text-gray-500 font-bold uppercase">KOZMETİK</div>
                <div className={`text-3xl font-black leading-none ${cosmeticGrade.includes('A') ? 'text-green-500' : 'text-yellow-500'}`}>{cosmeticGrade}</div>
             </div>
             <button onClick={() => setStage('report')} className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition"><CheckCircle size={20} className="text-green-600"/> BİTİR</button>
          </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {selectedCategory && EXPERTISE_DATA[selectedCategory]?.map((group) => (
             <div key={group.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gray-900/50 p-3 border-b border-gray-700 flex items-center gap-3">
                   <span className="text-xl">{group.icon}</span>
                   <h3 className="font-bold text-white text-sm tracking-wide uppercase">{group.title}</h3>
                </div>
                <div className="p-4 space-y-4">
                   {group.steps.map((step) => (
                      <div key={step.id} className="border-b border-gray-700/50 pb-3 last:border-0 last:pb-0">
                         <label className="block text-xs font-bold text-cyan-500 uppercase mb-2 ml-1">{step.label}</label>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {step.options.map((opt) => {
                               const isSelected = answers[step.id] === opt.value;
                               let colorClass = "bg-gray-700/50 text-gray-400 border-gray-700 hover:bg-gray-700";
                               if (isSelected) {
                                  if (opt.isBad) colorClass = "bg-red-500/20 text-red-400 border-red-500";
                                  else if (opt.score < 10) colorClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500";
                                  else colorClass = "bg-green-500/20 text-green-400 border-green-500";
                               }
                               return (
                                  <button key={opt.value} onClick={() => setAnswers({...answers, [step.id]: opt.value})} className={`text-left px-2 py-2 rounded-lg text-[10px] font-bold border transition-all h-full ${colorClass}`}>
                                     {opt.label}
                                  </button>
                               )
                            })}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          ))}
       </div>

       <div className="mt-6 bg-gray-800 p-4 rounded-xl border border-gray-700">
          <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2"><FileText size={16}/> Teknisyen Notu</label>
          <textarea className="w-full bg-gray-900 border border-gray-600 rounded-xl p-3 text-white outline-none text-sm" rows={3} value={technicianNote} onChange={e => setTechnicianNote(e.target.value)} placeholder="Örn: Cihazın sağ alt vidası eksik, sıvı bandı kırmızı..."></textarea>
       </div>
    </div>
  );
}

function CategoryCard({ icon, title, onClick, color }: any) {
  return (
    <button onClick={onClick} className={`h-32 border-2 rounded-2xl flex flex-col items-center justify-center p-4 transition-all group bg-gray-900/50 hover:bg-gray-800 ${color}`}>
       <span className="text-4xl mb-2 group-hover:scale-110 transition duration-300 shadow-xl">{icon}</span>
       <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">{title}</h3>
    </button>
  )
}