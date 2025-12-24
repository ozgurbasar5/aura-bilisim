"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Printer, User, Smartphone, Zap, Laptop, Watch, Box, 
  CheckSquare, ClipboardCheck, History, CreditCard, AlertTriangle, Send, Phone, Globe, MapPin, MessageCircle, Lock
} from "lucide-react";
import { getWorkshopFromStorage, saveWorkshopToStorage } from "@/utils/storage";

// --- KATEGORİ VERİLERİ (Aynı kalıyor) ---
const CATEGORY_DATA: any = {
  "Cep Telefonu": {
    accessories: ["Kutu", "Şarj Aleti", "USB Kablo", "Kılıf", "Sim Tepsisi"],
    preChecks: ["Ekran Kırık", "Kasa Ezik", "Sıvı Temas", "Şarj Almıyor", "Dokunmatik Arızalı", "FaceID/TouchID Yok", "Kamera Buğulu", "Ses Yok"],
    finalChecks: ["Şebeke Testi", "Ahize/Mikrofon", "Kamera Odaklama", "Batarya Performans", "Ekran Piksel", "True Tone", "Vida Kontrolü"]
  },
  "Robot Süpürge": {
    accessories: ["Şarj İstasyonu", "Su Tankı", "Mop", "Yan Fırça", "Ana Fırça"],
    preChecks: ["Lidar Dönmüyor", "Tekerlek Sıkışık", "Su Akıtmıyor", "Haritalama Hatası", "Sensör Hatası", "Fırça Dönmüyor", "Darbe İzi", "Gürültülü"],
    finalChecks: ["Lidar Temizliği", "Yazılım Güncel", "İstasyon Testi", "Su Pompa Testi", "Emiş Gücü", "Düşme Sensörü", "Genel Temizlik"]
  },
  "Bilgisayar": {
    accessories: ["Şarj Adaptörü", "Çanta", "Mouse", "Klavye", "Güç Kablosu"],
    preChecks: ["Menteşe Kırık", "Klavye Eksik", "Ekran Ölü Piksel", "Touchpad Hatası", "USB Port Hasarı", "Batarya Şişik", "Isınma", "Mavi Ekran"],
    finalChecks: ["Stress Testi", "SSD Sağlık", "Fan Bakımı", "Klavye Testi", "Wifi Bağlantı", "Sürücü Güncel", "Lisans Kontrol"]
  },
  "Akıllı Saat": {
    accessories: ["Şarj Kablosu", "Yedek Kordon", "Kutu"],
    preChecks: ["Ekran Çizik", "Kordon Kopuk", "Nabız Sensörü", "Titreşim Yok", "Buton Basmıyor", "Eşleşmiyor", "Sıvı Teması"],
    finalChecks: ["Su Sızdırmazlık", "Sensör Testi", "Dokunmatik", "Şarj Hızı", "Kordon Temizliği", "Fabrika Ayarları"]
  },
  "Diğer": {
    accessories: ["Kutu", "Kumanda", "Kablo", "Adaptör"],
    preChecks: ["Fiziksel Hasar", "Çalışmıyor", "Parça Eksik", "Yanık Kokusu"],
    finalChecks: ["Genel Temizlik", "Fonksiyon Testi", "Müşteri Bilgi", "Paketleme"]
  }
};

export default function ServisDetaySayfasi() {
  const router = useRouter();
  const params = useParams(); // Params'ı aldık
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
    id: 0, customerType: "Son Kullanıcı", customer: "", phone: "", address: "",
    category: "Cep Telefonu", device: "", serialNo: "", password: "",
    issue: "", privateNote: "", notes: "", accessories: [], preCheck: [], finalCheck: [],
    status: "Bekliyor", price: 0, cost: 0, date: ""
  });

  useEffect(() => {
    // --- HATA DÜZELTME: ID YOKSA DUR ---
    if (!params?.id) return;

    const allJobs = getWorkshopFromStorage();
    
    if (params.id === 'yeni') {
        let randomId = Math.floor(100000 + Math.random() * 900000);
        while (allJobs.some((job: any) => job.id === randomId)) {
            randomId = Math.floor(100000 + Math.random() * 900000);
        }
        setFormData({ ...formData, id: randomId, date: new Date().toLocaleDateString('tr-TR') });
    } else {
        // ID KARŞILAŞTIRMASI (String'e çevirerek yapıyoruz)
        const job = allJobs.find((j: any) => j.id.toString() === params.id!.toString());
        if (job) {
            setFormData({ ...job, preCheck: job.preCheck || [], finalCheck: job.finalCheck || [], accessories: job.accessories || [] });
        }
    }
    setLoading(false);
  }, [params]); // params değişince tetikle

  const sendWhatsAppMessage = () => {
    let cleanPhone = formData.phone.replace(/\D/g, ''); 
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (!cleanPhone.startsWith('90')) cleanPhone = '90' + cleanPhone;

    let rawMessage = "";

    if (formData.status === "Hazır" || formData.status === "Teslim Edildi") {
        rawMessage = `Sayın *${formData.customer}*,\n\n*#${formData.id}* takip numaralı *${formData.device}* cihazınızın işlemleri tamamlanmıştır.\n\n✅ *İşlem:* ${formData.notes || "Genel Bakım"}\n💰 *Tutar:* ${formData.price} TL\n\nServisimizden teslim alabilirsiniz.\n\n*Aura Bilişim*`;
    } else if (formData.status === "Bekliyor") {
        rawMessage = `Sayın *${formData.customer}*,\n\n*#${formData.id}* takip numaralı *${formData.device}* cihazınızın kaydı alınmıştır.\n\nDurum sorgulamak için bu takip numarasını kullanabilirsiniz.\n\n*Aura Bilişim*`;
    } else {
        rawMessage = `Merhaba *${formData.customer}*,\n\n*#${formData.id}* takip numaralı cihazınızın durumu: *${formData.status}*.\n\nBilgilerinize sunarız.\n\n*Aura Bilişim*`;
    }

    const encodedMessage = encodeURIComponent(rawMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
  };

  const handleCategoryChange = (cat: string) => {
    setFormData({ ...formData, category: cat, accessories: [], preCheck: [], finalCheck: [] });
  };

  const handleSave = () => {
    if (!formData.customer) { alert("Müşteri adı zorunlu!"); return; }
    if (!params?.id) return; // Güvenlik kontrolü

    const allJobs = getWorkshopFromStorage();
    
    const newJobs = params.id === 'yeni' 
        ? [formData, ...allJobs] 
        : allJobs.map((j: any) => j.id.toString() === formData.id.toString() ? formData : j);
        
    saveWorkshopToStorage(newJobs);
    alert(`Kayıt Başarılı! Takip No: ${formData.id}`);
  };

  const toggleArrayItem = (field: string, item: string) => {
    const current = formData[field] || [];
    const updated = current.includes(item) ? current.filter((i: string) => i !== item) : [...current, item];
    setFormData({ ...formData, [field]: updated });
  };

  if (loading) return <div className="p-10 text-white text-center font-mono">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 font-sans">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-800 pb-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur-md z-50 gap-4 print:hidden">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 font-bold text-sm">
                    <ArrowLeft size={18}/> GERİ DÖN
                </button>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black uppercase text-white tracking-wide">
                        SERVİS FORMU <span className="text-cyan-500 text-2xl">#{formData.id}</span>
                    </h1>
                </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <button onClick={sendWhatsAppMessage} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-sm shadow-lg shadow-green-900/20 transition-all active:scale-95">
                    <MessageCircle size={18}/> WHATSAPP
                </button>
                <button onClick={() => window.print()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 text-white font-bold text-sm transition-all active:scale-95">
                    <Printer size={18}/> FORMU YAZDIR
                </button>
                <button onClick={handleSave} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-bold text-sm shadow-lg shadow-cyan-900/40 transition-all active:scale-95">
                    <Save size={18}/> KAYDET
                </button>
            </div>
        </div>

        {/* --- FORM İÇERİĞİ (GİZLİ NOT, KATEGORİ VS. BURADA) --- */}
        <div className="grid grid-cols-12 gap-6 print:hidden">
            <div className="col-span-12 lg:col-span-3 space-y-6">
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={14} className="text-cyan-500"/> Müşteri Bilgileri</h3>
                    <div className="space-y-3">
                        <div className="flex bg-black/30 p-1 rounded-lg border border-slate-800 mb-3">
                             {["Son Kullanıcı", "Bayi"].map(t => (
                                 <button key={t} onClick={() => setFormData({...formData, customerType: t})} className={`flex-1 text-[10px] py-1.5 rounded font-bold transition-all uppercase ${formData.customerType === t ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>{t}</button>
                             ))}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-bold ml-1">AD SOYAD</label>
                            <input type="text" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-sm font-bold text-white outline-none" placeholder="Müşteri Adı"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-bold ml-1">TELEFON</label>
                            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-sm font-mono text-white outline-none" placeholder="5XX XXX XX XX"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-bold ml-1">ADRES / NOT</label>
                            <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-xs h-24 outline-none resize-none" placeholder="Adres bilgisi..."></textarea>
                        </div>
                    </div>
                </div>
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><CreditCard size={14} className="text-green-500"/> Ödeme Durumu</h3>
                    <div className="space-y-4">
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-white outline-none cursor-pointer focus:border-green-500">
                            <option>Bekliyor</option><option>İşlemde</option><option>Parça Bekliyor</option><option>Hazır</option><option>Teslim Edildi</option><option>İade</option>
                        </select>
                        <div className="grid grid-cols-2 gap-3">
                            <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-[#0b0e14] border border-green-900/50 focus:border-green-500 rounded-lg p-2.5 text-sm text-green-400 font-bold text-right outline-none"/>
                            <input type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} className="w-full bg-[#0b0e14] border border-red-900/50 focus:border-red-500 rounded-lg p-2.5 text-sm text-red-400 font-bold text-right outline-none"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-5 space-y-6">
                 <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg h-full">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2"><Smartphone size={14} className="text-blue-500"/> Cihaz Kimliği</h3>
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {Object.keys(CATEGORY_DATA).map(cat => (
                            <button key={cat} onClick={() => handleCategoryChange(cat)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold whitespace-nowrap transition-all ${formData.category === cat ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-900/30' : 'bg-[#0b0e14] text-slate-500 border-slate-700 hover:border-slate-500'}`}>{cat}</button>
                        ))}
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-bold ml-1">MARKA / MODEL</label>
                            <input type="text" value={formData.device} onChange={e => setFormData({...formData, device: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 focus:border-cyan-500 rounded-lg p-3 text-lg text-white font-black uppercase outline-none placeholder:text-slate-700" placeholder="ÖRN: IPHONE 13 PRO"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" value={formData.serialNo} onChange={e => setFormData({...formData, serialNo: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 focus:border-cyan-500 rounded-lg p-3 text-sm font-mono outline-none uppercase" placeholder="IMEI"/>
                            <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-[#0b0e14] border border-red-900/30 text-red-400 focus:border-red-500 rounded-lg p-3 font-bold outline-none" placeholder="******"/>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-slate-800">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[10px] text-cyan-500 font-bold uppercase">Teslim Alınanlar</label>
                                <span className="text-[9px] text-slate-600 uppercase font-bold">{formData.category}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORY_DATA[formData.category].accessories.map((acc: string) => (
                                    <button key={acc} onClick={() => toggleArrayItem("accessories", acc)} className={`px-3 py-1.5 rounded border text-[10px] font-bold transition-all ${formData.accessories.includes(acc) ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400 shadow-md scale-105' : 'bg-[#0b0e14] border-slate-800 text-slate-500 hover:border-slate-600'}`}>{acc}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-bold ml-1">MÜŞTERİ ŞİKAYETİ / ARIZA</label>
                            <textarea value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 focus:border-cyan-500 rounded-lg p-3 text-sm h-32 outline-none resize-none" placeholder="Arıza detayını giriniz..."></textarea>
                        </div>
                        <div className="relative pt-2">
                            <div className="absolute -top-1 right-0 flex items-center gap-1 text-[9px] text-red-500 font-black bg-red-950/30 px-2 py-0.5 rounded border border-red-900/50 uppercase tracking-wider"><Lock size={10} /> Sadece Teknisyen</div>
                            <label className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-2">ÖZEL NOT (GİZLİ)</label>
                            <textarea value={formData.privateNote} onChange={e => setFormData({...formData, privateNote: e.target.value})} className="w-full bg-red-950/10 border border-red-900/30 focus:border-red-600 rounded-lg p-3 text-sm h-20 outline-none resize-none text-red-200 placeholder:text-red-900/50" placeholder="Bu not fişte ve mesajlarda görünmez."></textarea>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle size={14} className="text-orange-500"/> Ön Kontrol (Giriş)</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {CATEGORY_DATA[formData.category].preChecks.map((item: string) => (
                            <button key={item} onClick={() => toggleArrayItem("preCheck", item)} className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${formData.preCheck.includes(item) ? 'bg-red-500/10 border-red-500/50 text-red-400 font-bold' : 'bg-[#0b0e14] border-slate-800 text-slate-600 hover:border-slate-700'}`}>
                                <div className={`min-w-[8px] h-[8px] rounded-full ${formData.preCheck.includes(item) ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                                <span className="text-[10px]">{item}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><History size={14} className="text-purple-500"/> Yapılan İşlemler</h3>
                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 focus:border-purple-500 rounded-lg p-3 text-sm h-32 outline-none font-medium resize-none" placeholder="Teknik müdahale notları..."></textarea>
                </div>
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ClipboardCheck size={14} className="text-green-500"/> Kalite Kontrol (QC)</h3>
                    <div className="space-y-2">
                         {CATEGORY_DATA[formData.category].finalChecks.map((item: string) => (
                            <button key={item} onClick={() => toggleArrayItem("finalCheck", item)} className={`flex items-center gap-3 p-2 w-full rounded-lg border text-[11px] font-bold text-left transition-all ${formData.finalCheck.includes(item) ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-[#0b0e14] border-slate-800 text-slate-600 hover:border-slate-700'}`}>
                                <div className={`min-w-[14px] h-[14px] rounded flex items-center justify-center border ${formData.finalCheck.includes(item) ? 'bg-green-600 border-green-600 text-white' : 'border-slate-700'}`}>
                                    {formData.finalCheck.includes(item) && <ClipboardCheck size={8}/>}
                                </div>
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* --- YAZDIRMA ŞABLONU --- */}
        <div id="printable-area" className="hidden">
            <div className="w-full h-full p-10 relative font-sans text-black box-border">
                <div className="flex justify-between items-start border-b-[3px] border-slate-900 pb-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-black text-[#0ea5e9] tracking-tighter uppercase">AURA BİLİŞİM</h1>
                        <p className="text-xs font-bold text-slate-500 tracking-[0.3em] uppercase mt-1">İLERİ SEVİYE TEKNOLOJİ LABORATUVARI</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-slate-900 uppercase tracking-tight">SERVİS FORMU</div>
                        <div className="mt-2 text-sm font-bold text-slate-600 flex flex-col items-end">
                            <span className="bg-slate-100 px-3 py-1 rounded mb-1">NO: #{formData.id}</span>
                            <span>{formData.date}</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between bg-slate-100 border border-slate-200 p-3 rounded-lg mb-8 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                     <span className="flex items-center gap-2"><Phone size={12}/> 0850 123 45 67</span>
                     <span className="flex items-center gap-2"><Globe size={12}/> WWW.AURABILISIM.COM</span>
                     <span className="flex items-center gap-2"><MapPin size={12}/> ISTANBUL, TURKIYE</span>
                </div>
                <div className="flex gap-6 mb-6">
                    <div className="flex-1 border-2 border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-black text-xs uppercase text-slate-700">Müşteri Bilgileri</div>
                        <div className="p-4 space-y-2 text-xs">
                            <div className="grid grid-cols-3 border-b border-dashed border-slate-200 pb-2"><span className="font-bold text-slate-500 uppercase">Ad Soyad</span><span className="col-span-2 font-bold">{formData.customer}</span></div>
                            <div className="grid grid-cols-3 border-b border-dashed border-slate-200 pb-2"><span className="font-bold text-slate-500 uppercase">Telefon</span><span className="col-span-2 font-mono">{formData.phone}</span></div>
                            <div className="grid grid-cols-3"><span className="font-bold text-slate-500 uppercase">Adres</span><span className="col-span-2">{formData.address || "-"}</span></div>
                        </div>
                    </div>
                    <div className="flex-1 border-2 border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-black text-xs uppercase text-slate-700">Cihaz Bilgileri</div>
                        <div className="p-4 space-y-2 text-xs">
                            <div className="grid grid-cols-3 border-b border-dashed border-slate-200 pb-2"><span className="font-bold text-slate-500 uppercase">Marka/Model</span><span className="col-span-2 font-bold uppercase">{formData.device}</span></div>
                            <div className="grid grid-cols-3 border-b border-dashed border-slate-200 pb-2"><span className="font-bold text-slate-500 uppercase">Seri No</span><span className="col-span-2 font-mono uppercase">{formData.serialNo || "-"}</span></div>
                            <div className="grid grid-cols-3"><span className="font-bold text-slate-500 uppercase">Şikayet</span><span className="col-span-2 font-bold text-red-600 italic">{formData.issue}</span></div>
                        </div>
                    </div>
                </div>
                <div className="border-2 border-slate-200 rounded-xl overflow-hidden mb-6">
                    <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                        <span className="font-black text-xs uppercase text-slate-700">Teknik Servis Raporu</span>
                        <span className="text-[10px] font-bold border border-slate-400 bg-white px-2 py-0.5 rounded uppercase">DURUM: {formData.status}</span>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="p-4 border-r border-slate-200">
                             <h4 className="text-[9px] font-bold text-slate-400 uppercase mb-2">Teslim Alınanlar</h4>
                             <div className="flex flex-wrap gap-1">
                                {formData.accessories.length > 0 ? formData.accessories.map((acc:string) => (
                                    <span key={acc} className="border border-slate-300 px-2 py-1 rounded-[4px] text-[10px] font-bold text-slate-700 uppercase bg-slate-50">{acc}</span>
                                )) : <span className="text-xs italic text-slate-400">Ekstra donanım yok.</span>}
                             </div>
                        </div>
                        <div className="p-4">
                             <h4 className="text-[9px] font-bold text-slate-400 uppercase mb-2">Yapılan İşlemler</h4>
                             <p className="text-xs font-medium leading-snug min-h-[40px]">{formData.notes || "Servis süreci devam etmektedir."}</p>
                        </div>
                    </div>
                </div>
                <div className="mb-8 border border-slate-200 p-4 rounded-xl">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 border-b border-slate-100 pb-1">Yapılan Testler ve Kontroller</h4>
                    <div className="grid grid-cols-4 gap-y-2 gap-x-4">
                        {[...formData.preCheck, ...formData.finalCheck].map((check: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-700"><div className="w-3 h-3 bg-slate-800 text-white flex items-center justify-center text-[8px] rounded-[2px]">✓</div>{check}</div>
                        ))}
                    </div>
                </div>
                <div className="flex items-end justify-between mt-auto pt-4 border-t-2 border-slate-800">
                    <div className="w-[60%] text-[8px] text-slate-500 text-justify leading-tight pr-4">
                        <strong>YASAL UYARI:</strong><br/>1. Teslim edilen cihazlar 90 gün içinde alınmalıdır.<br/>2. Sıvı temaslı cihazlarda onarım sonrası sorumluluk kabul edilmez.<br/>3. Yazılım işlemlerinde veri kaybı riski müşteriye aittir.<br/>4. Bu belge servis fişi niteliğindedir.
                    </div>
                    <div className="w-[40%]">
                        <div className="flex justify-between items-center mb-6 border-b-2 border-slate-200 pb-2"><span className="text-sm font-bold text-slate-600 uppercase">TOPLAM TUTAR:</span><span className="text-2xl font-black text-slate-900">{formData.price.toLocaleString('tr-TR')} ₺</span></div>
                        <div className="flex justify-between gap-4"><div className="text-center w-1/2"><div className="h-8"></div><div className="border-t border-slate-400 pt-1 text-[9px] font-bold uppercase">MÜŞTERİ<br/>(Teslim Eden)</div></div><div className="text-center w-1/2"><div className="h-8"></div><div className="border-t border-slate-400 pt-1 text-[9px] font-bold uppercase">AURA BİLİŞİM<br/>(Teslim Alan)</div></div></div>
                    </div>
                </div>
            </div>
        </div>

        <style jsx global>{`
            @media print {
                @page { size: A4; margin: 0; }
                body { visibility: hidden; background-color: white; -webkit-print-color-adjust: exact; }
                .print\\:hidden { display: none !important; }
                #printable-area { visibility: visible; display: block !important; position: fixed; left: 0; top: 0; width: 210mm; height: 297mm; padding: 0; background-color: white; z-index: 9999; }
                #printable-area * { visibility: visible; }
            }
        `}</style>
    </div>
  );
}