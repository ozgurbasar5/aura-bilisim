"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Printer, Building2, Smartphone, Zap, Laptop, Watch, Box, 
  CheckSquare, ClipboardCheck, History, CreditCard, AlertTriangle, Send, Phone, MapPin, MessageCircle, Lock,
  Fan, Eye, ShieldCheck, Database, Wrench, HardDrive, Trash2, Camera, Upload, X,
  CheckCircle2, FileText, PlusCircle, Book, Search, Plus, Clock, PackageMinus, ChevronRight, Briefcase
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 

// --- DİNAMİK AURA İPUÇLARI (KATEGORİ BAZLI) ---
const CATEGORY_TIPS: any = {
  "Cep Telefonu": [
    { id: "pil", title: "Pil Sağlığı & Şarj", desc: "Batarya kimyasını korumak için cihazı %20-%80 arasında şarj edin.", icon: Zap, color: "text-green-400" },
    { id: "ekran", title: "Ekran Koruma", desc: "Tam kaplayan kırılmaz cam, darbe riskini %90 azaltır.", icon: Smartphone, color: "text-blue-400" },
    { id: "sivi", title: "Sıvı Teması Kontrolü", desc: "Sıvı bantlarını ve contaları mutlaka kontrol edin.", icon: ShieldCheck, color: "text-cyan-400" }
  ],
  "Bilgisayar": [
      { id: "termal", title: "Termal Bakım", desc: "Termal macun yenilemesi ve fan temizliği yapın.", icon: Fan, color: "text-orange-400" },
      { id: "ssd", title: "Disk Sağlığı", desc: "SSD sağlık durumunu kontrol edin.", icon: HardDrive, color: "text-blue-400" },
  ],
  "Diğer": [
    { id: "genel", title: "Aura Standart Kontrol", desc: "Genel fonksiyon testlerini uygulayın.", icon: ShieldCheck, color: "text-blue-400" }
  ]
};

// --- KATEGORİ TANIMLARI ---
const CATEGORY_DATA: any = {
  "Cep Telefonu": {
    accessories: ["Kutu", "Şarj Aleti", "Sim Tepsisi", "Kılıf"],
    preChecks: ["Ekran Kırık", "Kasa Ezik", "Sıvı Temas", "Şarj Almıyor", "FaceID Yok", "Kamera Buğulu", "Ses Yok"],
    finalChecks: ["Şebeke Testi", "Ahize/Mikrofon", "Kamera Odaklama", "Batarya Performans", "Ekran Dokunmatik", "Vida Kontrolü"]
  },
  "Bilgisayar": {
    accessories: ["Şarj Adaptörü", "Çanta", "Mouse"],
    preChecks: ["Menteşe Kırık", "Ekran Ölü Piksel", "Klavye Eksik", "Batarya Şişik", "Isınma", "Mavi Ekran"],
    finalChecks: ["Stress Testi", "SSD Sağlık", "Fan Sesi", "Klavye Testi", "Wifi Bağlantı", "Sürücü Güncel"]
  },
  "Tablet": {
    accessories: ["Şarj Aleti", "Kılıf"],
    preChecks: ["Ekran Kırık", "Dokunmatik Hatası", "Şarj Soketi", "Yamuk Kasa"],
    finalChecks: ["Dokunmatik Testi", "Şarj Testi", "Wifi Bağlantı", "Kamera Testi"]
  },
  "Diğer": {
    accessories: ["Kutu", "Kablo", "Adaptör"],
    preChecks: ["Fiziksel Hasar", "Çalışmıyor", "Parça Eksik"],
    finalChecks: ["Genel Temizlik", "Fonksiyon Testi", "Güvenlik Testi"]
  }
};

export default function BayiServisDetaySayfasi() {
  const router = useRouter();
  const params = useParams(); 
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [expertiseId, setExpertiseId] = useState<number | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("Sistem");
  
  // --- ONAY MODALI STATE ---
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState({ amount: 0, desc: "" });

  // --- STOK & PARÇA YÖNETİMİ STATE ---
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockSearchTerm, setStockSearchTerm] = useState("");
  const [stockResults, setStockResults] = useState<any[]>([]);
  const [usedParts, setUsedParts] = useState<any[]>([]); 

  // --- TIMELINE (ZAMAN TÜNELİ) STATE ---
  const [timelineLogs, setTimelineLogs] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    id: 0, 
    customerType: "Bayi",  // Sabitlendi
    customer: "", // Bayi Adı
    phone: "", 
    address: "",
    category: "Cep Telefonu", 
    device: "", 
    serialNo: "", 
    password: "",
    issue: "", 
    privateNote: "", 
    notes: "", 
    accessories: [], 
    preCheck: [], 
    finalCheck: [],
    status: "Bekliyor", 
    price: 0,  // Bayiye Yansıtılacak Fiyat
    cost: 0,   // Maliyet
    listPrice: 0, // Son Kullanıcı Liste Fiyatı (Referans)
    date: new Date().toLocaleDateString('tr-TR'),
    tracking_code: "",
    tip_id: "",
    images: [],
    approval_status: 'none',
    approval_amount: 0,
    approval_desc: ''
  });

  const getCategoryInfo = (catName: string) => CATEGORY_DATA[catName] || CATEGORY_DATA["Diğer"];
  const getCurrentTips = () => CATEGORY_TIPS[formData.category] || CATEGORY_TIPS["Diğer"];

  // --- KULLANICIYI VE VERİLERİ ÇEK ---
  useEffect(() => {
      const getUser = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) setCurrentUserEmail(user.email);
      };
      getUser();

      async function fetchData() {
        if (!params?.id) return;
        try {
            if (params.id === 'yeni') {
                const defaultTips = CATEGORY_TIPS["Cep Telefonu"];
                setFormData((prev: any) => ({ 
                    ...prev, 
                    date: new Date().toLocaleDateString('tr-TR'),
                    tracking_code: `BY-${Math.floor(10000 + Math.random() * 90000)}`,
                    tip_id: defaultTips[0].id
                }));
            } else {
                const { data, error } = await supabase.from('aura_jobs').select('*').eq('id', params.id).single();
                if (error) throw error;
                if (data) {
                    setFormData({
                        id: data.id,
                        tracking_code: data.tracking_code,
                        customer: data.customer,
                        phone: data.phone,
                        customerType: "Bayi",
                        address: data.address || "",
                        category: data.category || "Diğer", 
                        device: data.device,
                        serialNo: data.serial_no || "",
                        password: data.password || "",
                        issue: data.problem || "",
                        privateNote: data.private_note || "",
                        notes: data.process_details || "",
                        status: data.status,
                        price: data.price || 0,
                        cost: data.cost || 0,
                        listPrice: data.list_price || 0, // Veritabanında yoksa 0
                        date: new Date(data.created_at).toLocaleDateString('tr-TR'),
                        accessories: data.accessories || [],
                        preCheck: data.pre_checks || [],
                        finalCheck: data.final_checks || [],
                        tip_id: data.tip_id || "genel",
                        images: data.images || [],
                        approval_status: data.approval_status || 'none',
                        approval_amount: data.approval_amount || 0,
                        approval_desc: data.approval_desc || ""
                    });
                    if (data.serial_no) checkExpertise(data.serial_no);
                    fetchTimeline(data.id);
                    fetchUsedParts(data.id);
                }
            }
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    fetchData();
  }, [params.id]);

  // --- FONKSİYONLAR ---

  const checkExpertise = async (imei: string) => {
      if (!imei || imei.length < 5) { setExpertiseId(null); return; }
      const { data } = await supabase.from('aura_expertise').select('id').eq('serial_no', imei).single();
      if (data) setExpertiseId(data.id); else setExpertiseId(null);
  };

  const fetchTimeline = async (jobId: number) => {
      const { data } = await supabase.from('aura_timeline').select('*').eq('job_id', jobId).order('created_at', { ascending: false });
      if (data) setTimelineLogs(data);
  };

  const logToTimeline = async (action: string, desc: string) => {
      if (params.id === 'yeni') return; 
      const newLog = { job_id: params.id, action_type: action, description: desc, created_by: currentUserEmail };
      await supabase.from('aura_timeline').insert([newLog]);
      setTimelineLogs(prev => [newLog, ...prev]);
  };

  // STOK FONKSİYONLARI
  const fetchUsedParts = async (jobId: number) => {
      const { data } = await supabase.from('aura_servis_parcalari').select(`*, aura_stok(urun_adi)`).eq('job_id', jobId);
      if(data) setUsedParts(data);
  };

  const handleStockSearch = async () => {
      if(stockSearchTerm.length < 2) return;
      const { data } = await supabase.from('aura_stok').select('*').ilike('urun_adi', `%${stockSearchTerm}%`).gt('stok_adedi', 0).limit(10);
      setStockResults(data || []);
  };

  const addPartToJob = async (part: any) => {
      if(params.id === 'yeni') { alert("Önce servisi kaydetmelisiniz."); return; }
      const quantityStr = prompt(`Kaç adet "${part.urun_adi}" kullanacaksınız?`, "1");
      if(!quantityStr || isNaN(Number(quantityStr)) || Number(quantityStr) < 1) return;
      const qty = Number(quantityStr);

      if(qty > part.stok_adedi) { alert(`Yetersiz stok! Mevcut: ${part.stok_adedi}`); return; }

      // Bayi için parça maliyeti = Alış Fiyatı (Bizim maliyetimiz)
      // Bayiye yansıtılacak = Satış Fiyatı (veya özel bayi fiyatı, şimdilik satış alıyoruz)
      const totalCost = Number(part.alis_fiyati) * qty;
      const totalPrice = Number(part.satis_fiyati) * qty;

      if(!confirm(`${part.urun_adi} (x${qty}) eklenecek.\nBayiye Yansıyacak: ${totalPrice}₺\nOnaylıyor musunuz?`)) return;

      const { error } = await supabase.from('aura_servis_parcalari').insert([{
          job_id: params.id, stok_id: part.id, adet: qty, alis_fiyati_anlik: part.alis_fiyati, satis_fiyati_anlik: part.satis_fiyati
      }]);

      if(error) { alert("Hata: " + error.message); return; }
      await supabase.from('aura_stok').update({ stok_adedi: part.stok_adedi - qty }).eq('id', part.id);

      const newCost = Number(formData.cost) + totalCost;
      const newPrice = Number(formData.price) + totalPrice; // Otomatik fiyat arttırma

      await supabase.from('aura_jobs').update({ price: newPrice, cost: newCost }).eq('id', params.id);
      setFormData({ ...formData, price: newPrice, cost: newCost });
      logToTimeline("Parça Eklendi", `${part.urun_adi} (x${qty}) eklendi.`);
      fetchUsedParts(Number(params.id));
      setIsStockModalOpen(false);
  };

  const removePartFromJob = async (partRelId: number, partStokId: number, alis: number, satis: number, adet: number) => {
      if(!confirm(`Parça iptal edilecek ve stok iade edilecek. Emin misiniz?`)) return;
      await supabase.from('aura_servis_parcalari').delete().eq('id', partRelId);

      const { data: currStock } = await supabase.from('aura_stok').select('stok_adedi').eq('id', partStokId).single();
      if(currStock) await supabase.from('aura_stok').update({ stok_adedi: currStock.stok_adedi + adet }).eq('id', partStokId);

      const newCost = Number(formData.cost) - (alis * adet);
      const newPrice = Number(formData.price) - (satis * adet);
      
      await supabase.from('aura_jobs').update({ price: newPrice, cost: newCost }).eq('id', params.id);
      setFormData({ ...formData, price: newPrice, cost: newCost });
      
      logToTimeline("Parça İptali", `Parça kullanımı iptal edildi.`);
      fetchUsedParts(Number(params.id));
  };

  const handleSave = async () => {
    if (!formData.customer) { alert("Bayi adı zorunlu!"); return; }
    setLoading(true);
    const payload = {
        customer: formData.customer, phone: formData.phone, customer_type: "Bayi", address: formData.address,
        category: formData.category, device: formData.device, serial_no: formData.serialNo, password: formData.password,
        problem: formData.issue, private_note: formData.privateNote, process_details: formData.notes,
        status: formData.status, price: Number(formData.price), cost: Number(formData.cost), list_price: Number(formData.listPrice),
        accessories: formData.accessories, pre_checks: formData.preCheck, final_checks: formData.finalCheck,
        tracking_code: formData.tracking_code, tip_id: formData.tip_id, images: formData.images,
        approval_status: formData.approval_status, approval_amount: formData.approval_amount, approval_desc: formData.approval_desc
    };

    let res;
    if (params.id === 'yeni') {
        res = await supabase.from('aura_jobs').insert([payload]).select();
    } else {
        res = await supabase.from('aura_jobs').update(payload).eq('id', params.id);
        logToTimeline("Kayıt Güncellendi", `Durum: ${formData.status}`);
    }

    setLoading(false);
    if (!res.error) {
        alert("Bayi kaydı başarıyla işlendi!");
        if (params.id === 'yeni' && res.data) router.push(`/epanel/bayi-atolye/${res.data[0].id}`);
    } else {
        alert("Hata: " + res.error.message);
    }
  };

  const sendApprovalRequest = async () => {
    setLoading(true);
    const { error } = await supabase.from('aura_jobs').update({
        approval_status: 'pending', approval_amount: approvalData.amount, approval_desc: approvalData.desc, status: 'Onay Bekliyor'
    }).eq('id', params.id);
    if (!error) {
        alert("Bayiye onay isteği gönderildi!");
        setFormData({ ...formData, status: 'Onay Bekliyor', approval_status: 'pending', approval_amount: approvalData.amount, approval_desc: approvalData.desc });
        logToTimeline("Onay İsteği", `Bayiden ${approvalData.amount} TL ek onay istendi.`);
        setApprovalModalOpen(false);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: any) => { 
    if (!e.target.files.length) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const newImages = [...formData.images];
    for (const file of files as File[]) {
        const fileExt = file.name.split('.').pop();
        const fileName = `bayi-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error } = await supabase.storage.from('service-images').upload(fileName, file);
        if (!error) {
            const { data } = supabase.storage.from('service-images').getPublicUrl(fileName);
            newImages.push(data.publicUrl);
        }
    }
    setFormData({ ...formData, images: newImages });
    setUploading(false);
  };

  const removeImage = (index: number) => {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
  };

  const handleDelete = async () => {
    if(!confirm("Bu bayi kaydını silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    const { error } = await supabase.from('aura_jobs').delete().eq('id', params.id);
    if (error) { alert("Hata: " + error.message); setLoading(false); }
    else { router.push('/epanel/atolye'); } // Atölye listesine dön
  };

  const sendWhatsAppMessage = () => {
    let cleanPhone = (formData.phone || "").replace(/\D/g, ''); 
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;

    let rawMessage = "";
    const takipKodu = formData.tracking_code || formData.id;

    if (formData.approval_status === 'pending') {
        rawMessage = `Sayın İş Ortağımız *${formData.customer}*,\n\nServisimize gönderdiğiniz *${formData.device}* cihazı için ek işlem onayı gerekmektedir.\n\n🔗 Detay ve Onay: https://aurabilisim.net/portal/onay?id=${takipKodu}\n\n*Aura Bilişim B2B*`;
    } else if (formData.status === "Hazır" || formData.status === "Teslim Edildi") {
        rawMessage = `Sayın İş Ortağımız *${formData.customer}*,\n\n*${takipKodu}* referanslı *${formData.device}* cihazının işlemleri tamamlanmıştır.\n\n✅ *İşlem:* ${formData.notes}\n💰 *Bayi Cari Tutar:* ${formData.price} TL\n\nSevkiyat için hazırdır.\n\n*Aura Bilişim*`;
    } else {
        rawMessage = `Merhaba *${formData.customer}*,\n\n*${takipKodu}* referanslı cihazın durumu: *${formData.status}* olarak güncellenmiştir.\n\n*Aura Bilişim*`;
    }

    logToTimeline("WhatsApp Mesajı", "Bayiye bildirim gönderildi.");
    const encodedMessage = encodeURIComponent(rawMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData((prev: any) => {
        const current = prev[field] || [];
        const updated = current.includes(item) ? current.filter((i: string) => i !== item) : [...current, item];
        return { ...prev, [field]: updated };
    });
  };

  if (loading) return <div className="p-20 text-white text-center font-bold animate-pulse">Bayi Verileri Yükleniyor...</div>;

  const catInfo = getCategoryInfo(formData.category);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 font-sans relative">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-amber-900/30 pb-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur-md z-50 gap-4 print:hidden">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 font-bold text-sm"><ArrowLeft size={18}/> GERİ</button>
                <div>
                    <h1 className="text-xl font-black text-white flex items-center gap-2"><Briefcase className="text-amber-500"/> BAYİ SERVİSİ <span className="text-amber-500">#{formData.tracking_code || "YENİ"}</span></h1>
                    <p className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest">KURUMSAL İŞ ORTAĞI KAYDI</p>
                </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <button onClick={sendWhatsAppMessage} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-sm shadow-lg shadow-green-900/20 active:scale-95">
                    <MessageCircle size={18}/> BAYİYE YAZ
                </button>
                <button onClick={() => window.print()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 text-white font-bold text-sm active:scale-95">
                    <Printer size={18}/> FİŞ
                </button>
                {params.id !== 'yeni' && (
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg border border-red-500/20 font-bold"><Trash2 size={18}/></button>
                )}
                <button onClick={handleSave} className="px-6 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold text-white shadow-lg shadow-amber-900/20"><Save size={18}/> KAYDET</button>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-6 print:hidden">
            {/* SOL KOLON - BAYİ BİLGİLERİ */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
                <div className="bg-[#151921] border border-amber-900/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2"><Building2 className="text-amber-500/10 w-24 h-24 -mr-4 -mt-4"/></div>
                    <h3 className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10"><Building2 size={14}/> Bayi Bilgileri</h3>
                    <div className="space-y-3 relative z-10">
                        <div>
                            <label className="text-[10px] text-slate-500 font-bold">BAYİ ADI</label>
                            <input type="text" value={formData.customer} onChange={e => setFormData((p:any)=>({...p, customer: e.target.value}))} className="w-full bg-[#0b0e14] border border-amber-500/30 rounded-lg p-2.5 text-sm font-bold text-white outline-none focus:border-amber-500" placeholder="Örn: Özgür İletişim"/>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500 font-bold">BAYİ TELEFON</label>
                            <input type="text" value={formData.phone} onChange={e => setFormData((p:any)=>({...p, phone: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-mono" placeholder="05..."/>
                        </div>
                        <textarea value={formData.address} onChange={e => setFormData((p:any)=>({...p, address: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-xs h-16 outline-none resize-none" placeholder="Bayi notu / Adres..."></textarea>
                        
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                            <label className="text-[10px] text-slate-500 font-bold">SERVİS DURUMU</label>
                            <select value={formData.status} onChange={e => setFormData((p:any)=>({...p, status: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-white"><option>Bekliyor</option><option>İşlemde</option><option>Parça Bekliyor</option><option>Onay Bekliyor</option><option>Hazır</option><option>Teslim Edildi</option></select>
                            
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <label className="text-[9px] text-amber-500 font-bold block">BAYİ FİYATI (Net)</label>
                                    <input type="number" value={formData.price} onChange={e => setFormData((p:any)=>({...p, price: Number(e.target.value)}))} className="w-full bg-[#0b0e14] border border-amber-500/50 text-amber-400 font-bold text-right p-2 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="text-[9px] text-red-500 font-bold block">MALİYET</label>
                                    <input type="number" value={formData.cost} onChange={e => setFormData((p:any)=>({...p, cost: Number(e.target.value)}))} className="w-full bg-[#0b0e14] border border-red-900/50 text-red-400 font-bold text-right p-2 rounded-lg"/>
                                </div>
                            </div>
                            {/* Liste Fiyatı Referansı */}
                            <div className="bg-black/20 p-2 rounded border border-white/5 flex justify-between items-center">
                                <span className="text-[9px] text-slate-500">Tavsiye Edilen Satış:</span>
                                <input type="number" value={formData.listPrice || ""} onChange={e => setFormData((p:any)=>({...p, listPrice: Number(e.target.value)}))} className="w-16 bg-transparent text-right text-[10px] text-slate-300 outline-none border-b border-slate-700 focus:border-white" placeholder="0"/>
                            </div>
                        </div>

                        {/* Onay Butonu */}
                        {formData.approval_status === 'none' && (
                            <button onClick={() => setApprovalModalOpen(true)} className="w-full py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg font-bold text-xs flex justify-center gap-2"><Zap size={14}/> EKSTRA ONAY İSTE</button>
                        )}
                        {formData.approval_status === 'pending' && <div className="text-center text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/30 animate-pulse">BAYİ ONAYI BEKLENİYOR (+{formData.approval_amount}₺)</div>}
                        {formData.approval_status === 'approved' && <div className="text-center text-xs text-green-500 bg-green-500/10 p-2 rounded border border-green-500/30">BAYİ ONAYLADI ✅</div>}
                    </div>
                </div>
            </div>

            {/* ORTA KOLON - CİHAZ BİLGİLERİ */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2"><Smartphone size={14} className="text-blue-500"/> Cihaz Kimliği</h3>
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {Object.keys(CATEGORY_DATA).map(cat => ( 
                            <button key={cat} onClick={() => setFormData({...formData, category: cat})} className={`px-3 py-1 rounded text-[10px] font-bold border whitespace-nowrap transition-all ${formData.category === cat ? 'bg-amber-600 text-white border-amber-500' : 'text-slate-500 border-slate-700 hover:border-slate-500'}`}>{cat}</button> 
                        ))}
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-slate-500 font-bold ml-1">MARKA / MODEL</label>
                            <input type="text" value={formData.device} onChange={e => setFormData((p:any)=>({...p, device: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-lg font-black text-white outline-none focus:border-amber-500" placeholder="Model (Örn: iPhone 13)"/>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <input type="text" value={formData.serialNo} onChange={e => { setFormData((p:any)=>({...p, serialNo: e.target.value})); checkExpertise(e.target.value); }} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm font-mono uppercase outline-none focus:border-amber-500" placeholder="IMEI / SERİ NO"/>
                                {formData.serialNo.length > 5 && expertiseId && (
                                    <button onClick={() => router.push(`/epanel/ekspertiz/detay/${expertiseId}`)} className="absolute right-1 top-1 bottom-1 px-3 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold rounded flex items-center gap-1"><FileText size={12}/> RAPOR</button>
                                )}
                            </div>
                            <input type="text" value={formData.password} onChange={e => setFormData((p:any)=>({...p, password: e.target.value}))} className="w-full bg-[#0b0e14] border border-red-900/30 text-red-400 rounded-lg p-3 font-bold outline-none focus:border-red-500" placeholder="Ekran Şifresi"/>
                        </div>

                        <div>
                            <label className="text-[10px] text-slate-500 font-bold ml-1">BAYİ BEYANI / ARIZA</label>
                            <textarea value={formData.issue} onChange={e => setFormData((p:any)=>({...p, issue: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm h-24 outline-none resize-none focus:border-amber-500" placeholder="Bayinin belirttiği sorun..."></textarea>
                        </div>
                        
                        {/* TESLİM ALINANLAR */}
                        <div className="bg-black/20 p-3 rounded-xl border border-slate-800">
                            <label className="text-[10px] text-amber-500 font-bold uppercase mb-2 block">Bayiden Gelen Aksesuarlar</label>
                            <div className="flex flex-wrap gap-2">
                                {catInfo.accessories.map((acc: string) => (
                                    <button key={acc} onClick={() => toggleArrayItem("accessories", acc)} className={`px-2 py-1 rounded border text-[10px] font-bold transition-all ${formData.accessories.includes(acc) ? 'bg-amber-900/40 border-amber-500 text-amber-400 scale-105' : 'bg-[#0b0e14] border-slate-800 text-slate-500 hover:border-slate-600'}`}>{acc}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PARÇA KULLANIMI */}
                {params.id !== 'yeni' && (
                    <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><PackageMinus size={14} className="text-yellow-500"/> Parça Kullanımı</h3>
                            <button onClick={() => setIsStockModalOpen(true)} className="text-[10px] bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-lg"><Plus size={12}/> STOKTAN EKLE</button>
                        </div>
                        
                        <div className="space-y-2">
                            {usedParts.length > 0 ? usedParts.map((part) => (
                                <div key={part.id} className="flex justify-between items-center bg-[#0b0e14] border border-slate-800 p-2.5 rounded-lg group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-xs">{part.adet}x</div>
                                        <div>
                                            <p className="text-xs font-bold text-white">{part.aura_stok?.urun_adi}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removePartFromJob(part.id, part.stok_id, part.alis_fiyati_anlik, part.satis_fiyati_anlik, part.adet)} className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                                </div>
                            )) : (
                                <div className="text-center text-[10px] text-slate-600 border border-dashed border-slate-800 p-4 rounded-lg">Parça kullanılmadı.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* SAĞ KOLON - İŞLEMLER */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* TIMELINE */}
                {params.id !== 'yeni' && (
                    <div className="bg-[#151921] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col max-h-[250px]">
                        <div className="p-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-emerald-500"/> İşlem Kayıtları</h3>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar p-3 space-y-3">
                            {timelineLogs.map((log: any) => (
                                <div key={log.id} className="flex gap-3 text-xs">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5"></div>
                                        <div className="w-px h-full bg-slate-800"></div>
                                    </div>
                                    <div>
                                        <p className="text-slate-300 font-bold">{log.action_type}</p>
                                        <p className="text-slate-500 text-[10px]">{log.description}</p>
                                        <span className="text-[9px] text-slate-600">{new Date(log.created_at).toLocaleString('tr-TR')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><History size={14} className="text-purple-500"/> Yapılan İşlemler</h3>
                    <textarea value={formData.notes} onChange={e => setFormData((p:any)=>({...p, notes: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm h-32 outline-none focus:border-purple-500 resize-none" placeholder="Teknik müdahale detayları..."></textarea>
                </div>

                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle size={14} className="text-orange-500"/> Ön Kontrol (Bayi Teslimi)</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {catInfo.preChecks.map((item: string) => (
                            <button key={item} onClick={() => toggleArrayItem("preCheck", item)} className={`flex items-center gap-2 p-2 rounded border text-left text-[10px] transition-all ${formData.preCheck.includes(item) ? 'bg-red-500/10 border-red-500/50 text-red-400 font-bold' : 'bg-[#0b0e14] border-slate-800 text-slate-600 hover:border-slate-700'}`}><div className={`w-2 h-2 rounded-full ${formData.preCheck.includes(item)?'bg-red-500':'bg-slate-700'}`}></div>{item}</button>
                        ))}
                    </div>
                </div>
                
                {/* FOTOĞRAFLAR */}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-2"><Camera size={14} className="text-cyan-500"/> Fotoğraflar</h3>
                        <label className={`cursor-pointer text-[10px] bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg text-white font-bold transition-all flex items-center gap-1 ${uploading ? 'opacity-50' : ''}`}>
                            <Upload size={10}/> {uploading ? '...' : 'Ekle'}
                            <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading}/>
                        </label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((img:string, i:number)=>(
                            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-700">
                                <img src={img} className="w-full h-full object-cover"/>
                                <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"><X size={10}/></button>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* SON KONTROL */}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ClipboardCheck size={14} className="text-green-500"/> QC (Kalite Kontrol)</h3>
                    <div className="space-y-2">
                         {catInfo.finalChecks.map((item: string) => (
                            <button key={item} onClick={() => toggleArrayItem("finalCheck", item)} className={`flex items-center gap-3 p-2 w-full rounded-lg border text-[11px] font-bold text-left transition-all ${formData.finalCheck.includes(item) ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-[#0b0e14] border-slate-800 text-slate-600 hover:border-slate-700'}`}>
                                <div className={`min-w-[14px] h-[14px] rounded flex items-center justify-center border ${formData.finalCheck.includes(item) ? 'bg-green-600 border-green-600 text-white' : 'border-slate-700'}`}>{formData.finalCheck.includes(item) && <ClipboardCheck size={8}/>}</div>{item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* --- STOK MODALI --- */}
        {isStockModalOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-[#1e293b] rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
                    <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="text-white font-bold flex items-center gap-2"><Box size={18} className="text-yellow-400"/> STOKTAN PARÇA SEÇ</h3>
                        <button onClick={() => setIsStockModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white"/></button>
                    </div>
                    <div className="p-4 bg-[#0b0e14]">
                        <div className="relative">
                            <input type="text" value={stockSearchTerm} onChange={(e) => { setStockSearchTerm(e.target.value); if(e.target.value.length>1) handleStockSearch(); }} className="w-full bg-[#151921] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-yellow-500" placeholder="Parça ara..." autoFocus/>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {stockResults.map((part) => (
                            <button key={part.id} onClick={() => addPartToJob(part)} className="w-full flex justify-between items-center p-3 hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700 transition-all group text-left">
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-yellow-400">{part.urun_adi}</p>
                                    <p className="text-[10px] text-slate-500">{part.kategori} • Stok: {part.stok_adedi}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-300">Fiyat: {part.satis_fiyati}₺</p>
                                </div>
                            </button>
                        ))}
                        {stockResults.length === 0 && <div className="text-center py-8 text-slate-500 text-xs">Parça bulunamadı.</div>}
                    </div>
                </div>
            </div>
        )}

        {/* ONAY MODALI */}
        {approvalModalOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-[#1e293b] p-6 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Zap size={18} className="text-purple-500"/> Bayi Ek Onay İsteği</h3>
                    <p className="text-slate-400 text-xs mb-4">Bu işlem bayiye WhatsApp/Link üzerinden onay bildirimi gönderecektir.</p>
                    <input type="number" onChange={(e) => setApprovalData({...approvalData, amount: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mb-3 text-white outline-none focus:border-purple-500 font-bold" placeholder="Ek Tutar (TL)"/>
                    <textarea onChange={(e) => setApprovalData({...approvalData, desc: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mb-4 text-white h-24 text-sm resize-none outline-none focus:border-purple-500" placeholder="Açıklama (Örn: Anakart müdahalesi gerekiyor)..."></textarea>
                    <div className="flex gap-2"><button onClick={() => setApprovalModalOpen(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg text-xs font-bold text-slate-300">İPTAL</button><button onClick={sendApprovalRequest} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-lg text-xs font-bold text-white shadow-lg">GÖNDER</button></div>
                </div>
            </div>
        )}
        
        {/* YAZDIRMA ŞABLONU - BAYİ ÖZEL */}
        <div id="printable-area" className="hidden bg-white text-black font-sans">
            <div className="p-10 w-full h-full box-border">
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                    <div className="flex items-center gap-4">
                        <img src="/image/aura-logo.png" alt="Aura" className="h-16 w-auto object-contain"/>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-amber-600">AURA B2B SERVICE</h1>
                            <p className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase">KURUMSAL SERVİS RAPORU</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold bg-slate-100 px-3 py-1 rounded">REF: {formData.tracking_code}</div>
                        <span className="text-xs text-slate-600 mt-1 block">{formData.date}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
                        <h3 className="font-bold border-b border-slate-300 mb-2 pb-1 text-sm uppercase text-slate-700">Bayi Bilgileri</h3>
                        <p className="text-sm font-bold">{formData.customer}</p>
                        <p className="text-sm">{formData.phone}</p>
                    </div>
                    <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
                        <h3 className="font-bold border-b border-slate-300 mb-2 pb-1 text-sm uppercase text-slate-700">Cihaz</h3>
                        <p className="text-sm font-bold">{formData.device}</p>
                        <p className="text-sm">SN: {formData.serialNo}</p>
                    </div>
                </div>

                <div className="mb-6 border border-slate-300 rounded-lg p-4">
                     <h4 className="font-bold text-xs uppercase mb-2">Yapılan İşlemler</h4>
                     <p className="text-sm">{formData.notes || "İşlem detayı girilmedi."}</p>
                </div>

                <div className="flex justify-end mt-10">
                    <div className="text-right">
                        <div className="text-xs font-bold text-slate-500 uppercase">BAYİ CARİ TUTAR</div>
                        <div className="text-3xl font-black text-slate-900">{formData.price.toLocaleString('tr-TR')} ₺</div>
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