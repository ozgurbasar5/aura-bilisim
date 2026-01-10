"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Printer, User, Smartphone, Zap, Laptop, Watch, Box, 
  CheckSquare, ClipboardCheck, History, CreditCard, AlertTriangle, Send, Phone, Globe, MapPin, MessageCircle, Lock,
  Lightbulb, Battery, Fan, Eye, ShieldCheck, Database, Wrench, HardDrive, Wifi, Trash2, Camera, Upload, X, Image as ImageIcon,
  CheckCircle2, XCircle, ShoppingBag, FileText, PlusCircle, Book, Search, Plus, Clock, PackageMinus, ChevronRight, CheckCircle, Building2, QrCode, Wallet, ScanLine, Activity, Monitor, Cpu, Speaker, Vibrate, Cable, MemoryStick, Mic, Radio, Layers
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { Html5QrcodeScanner } from "html5-qrcode";

// --- ELIT GÖRSEL PARÇALAR (GOLD/TITANIUM STYLE) ---
// cx ve cy değerleri ikonların merkez noktalarıdır.
const DEVICE_PARTS_SVG = [
    { 
        id: 'motherboard', name: 'Anakart (Logic Board)', icon: Cpu, price: 4500, 
        path: "M 170 30 L 270 30 L 270 320 L 170 320 L 170 130 L 140 130 L 140 30 Z", 
        cx: 220, cy: 80, baseColor: "#334155" 
    },
    { 
        id: 'battery', name: 'Batarya (Pil)', icon: Battery, price: 900, 
        path: "M 20 120 L 130 120 L 130 460 L 20 460 Z", 
        cx: 75, cy: 290, baseColor: "#1e293b" 
    },
    { 
        id: 'camera_back', name: 'Arka Kamera', icon: Camera, price: 1200, 
        path: "M 180 40 L 260 40 L 260 120 L 180 120 Z", 
        cx: 220, cy: 80, baseColor: "#0f172a" 
    },
    { 
        id: 'camera_front', name: 'FaceID / Ön Kam', icon: Eye, price: 800, 
        path: "M 80 10 L 220 10 L 220 40 L 80 40 Z", 
        cx: 150, cy: 25, baseColor: "#000000" 
    },
    { 
        id: 'charging', name: 'Şarj Soketi / Bord', icon: Zap, price: 600, 
        path: "M 40 540 L 260 540 L 260 590 L 40 590 Z", 
        cx: 150, cy: 565, baseColor: "#475569" 
    },
    { 
        id: 'taptic', name: 'Titreşim (Taptic)', icon: Vibrate, price: 450, 
        path: "M 20 480 L 110 480 L 110 520 L 20 520 Z", 
        cx: 65, cy: 500, baseColor: "#334155" 
    },
    { 
        id: 'speaker', name: 'Hoparlör (Buzzer)', icon: Speaker, price: 500, 
        path: "M 130 480 L 280 480 L 280 520 L 130 520 Z", 
        cx: 205, cy: 500, baseColor: "#334155" 
    },
    {
        id: 'wireless', name: 'NFC / Kablosuz Şarj', icon: Radio, price: 400,
        path: "M 150 290 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0", 
        fillRule: "evenodd", cx: 150, cy: 290, baseColor: "#94a3b8" 
    },
    { 
        id: 'screen', name: 'Ekran / Panel', icon: Monitor, price: 2500, 
        path: "M 5 5 L 295 5 L 295 595 L 5 595 Z M 10 10 L 10 590 L 290 590 L 290 10 Z", 
        fillRule: "evenodd", cx: 150, cy: 300, baseColor: "transparent"
    },
];

// --- KATEGORİ VERİLERİ ---
const CATEGORY_TIPS: any = { "Cep Telefonu": [], "Robot Süpürge": [], "Bilgisayar": [], "Tablet": [], "Akıllı Saat": [], "Diğer": [] };
const CATEGORY_DATA: any = { "Cep Telefonu": { accessories: ["Kutu", "Şarj Aleti", "Kılıf"], preChecks: ["Ekran Kırık", "Çizik", "Ses Yok"], finalChecks: ["Dokunmatik", "Kamera", "Şarj"] }, "Robot Süpürge": { accessories: ["İstasyon", "Fırça"], preChecks: ["Tekerlek", "Lidar"], finalChecks: ["Emiş", "Sensör"] }, "Bilgisayar": { accessories: ["Şarj Aleti", "Çanta"], preChecks: ["Kırık", "Menteşe"], finalChecks: ["Klavye", "Ekran"] }, "Tablet": { accessories: ["Kılıf"], preChecks: ["Ekran"], finalChecks: ["Dokunmatik"] }, "Akıllı Saat": { accessories: ["Kordon"], preChecks: ["Cam"], finalChecks: ["Sensör"] }, "Diğer": { accessories: [], preChecks: [], finalChecks: [] } };

export default function ServisDetaySayfasi() {
  const router = useRouter();
  const params = useParams(); 
  const id = params?.id as string; 
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [expertiseId, setExpertiseId] = useState<number | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("Sistem");
  
  // LİSTELER
  const [availableUpsells, setAvailableUpsells] = useState<any[]>([]);
  const [dealersList, setDealersList] = useState<any[]>([]);
  
  // MODALLAR VE STATE'LER
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState({ amount: 0, desc: "" });
  
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockSearchTerm, setStockSearchTerm] = useState("");
  const [stockResults, setStockResults] = useState<any[]>([]);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Nakit");
  
  const [isVisualDiagnosticOpen, setIsVisualDiagnosticOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false); // Barkod

  // --- WIKI STATE (EKSİK OLANLAR EKLENDİ) ---
  const [isWikiModalOpen, setIsWikiModalOpen] = useState(false);
  const [wikiSearchTerm, setWikiSearchTerm] = useState("");
  const [wikiResults, setWikiResults] = useState<any[]>([]);
  const [wikiViewMode, setWikiViewMode] = useState<'search' | 'add'>('search');
  const [newWikiEntry, setNewWikiEntry] = useState({ title: "", problem: "", solution: "" });

  // DATA
  const [usedParts, setUsedParts] = useState<any[]>([]); 
  const [timelineLogs, setTimelineLogs] = useState<any[]>([]);

  // FORM
  const [formData, setFormData] = useState<any>({
    id: 0, customerType: "Son Kullanıcı", customer: "", email: "", phone: "", address: "",
    category: "Cep Telefonu", device: "", serialNo: "", password: "",
    issue: "", privateNote: "", notes: "", 
    accessories: [], preCheck: [], finalCheck: [],
    status: "Bekliyor", price: 0, cost: 0, 
    date: new Date().toLocaleDateString('tr-TR'),
    tracking_code: "", tip_id: "", images: [],
    approval_status: 'none', approval_amount: 0, approval_desc: '',
    recommended_upsells: [], sold_upsells: [],
    selectedVisualParts: [] 
  });

  const getCategoryInfo = (catName: string) => CATEGORY_DATA[catName] || CATEGORY_DATA["Diğer"];

  const parseArray = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val) || []; } catch { return []; }
  };

  useEffect(() => {
      const init = async () => {
          const { data: { user } } = await supabase.auth.getUser(); if (user?.email) setCurrentUserEmail(user.email);
          const { data: dealers } = await supabase.from('bayi_basvurulari').select('*').eq('durum', 'Onaylandı'); if(dealers) setDealersList(dealers);

          if (id === 'yeni') {
              setFormData((p:any) => ({ ...p, tracking_code: `SRV-${Math.floor(10000 + Math.random() * 90000)}` }));
              setLoading(false);
          } else {
              const { data } = await supabase.from('aura_jobs').select('*').eq('id', id).single();
              if (data) {
                  setFormData({
                      ...data,
                      price: Number(data.price), cost: Number(data.cost),
                      accessories: parseArray(data.accessories), preCheck: parseArray(data.pre_checks),
                      finalCheck: parseArray(data.final_checks), images: parseArray(data.images),
                      recommended_upsells: parseArray(data.recommended_upsells), sold_upsells: parseArray(data.sold_upsells),
                      selectedVisualParts: parseArray(data.private_note).filter((p:any) => p.id) // private_note içinde JSON saklıyoruz
                  });
                  if (data.serial_no) checkExpertise(data.serial_no);
                  fetchUsedParts(data.id);
                  fetchTimeline(data.id);
              }
              setLoading(false);
          }
      };
      init();
  }, [id]);

  useEffect(() => {
      const fetchUpsells = async () => {
          if (!formData.category) return;
          const { data } = await supabase.from('aura_upsell_products').select('*').eq('category', formData.category).eq('is_active', true); 
          if(data) setAvailableUpsells(data); else setAvailableUpsells([]); 
      };
      fetchUpsells();
  }, [formData.category]); 

  // --- BARKOD ---
  useEffect(() => {
      if (showScanner && isStockModalOpen) {
          const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
          scanner.render((decodedText) => {
              setStockSearchTerm(decodedText); scanner.clear(); setShowScanner(false);
              setTimeout(() => handleStockSearch(decodedText), 500); 
          }, (error) => { console.warn(error); });
          return () => { scanner.clear().catch(error => console.error(error)); };
      }
  }, [showScanner, isStockModalOpen]);

  // --- İŞLEMLER ---
  const handleDealerChange = (selectedDealerName: string) => {
      const dealer = dealersList.find(d => d.sirket_adi === selectedDealerName);
      if (dealer) setFormData({ ...formData, customer: dealer.sirket_adi, email: dealer.email, phone: dealer.telefon, address: dealer.adres });
      else setFormData({ ...formData, customer: selectedDealerName });
  };

  const checkExpertise = async (imei: string) => {
      const { data } = await supabase.from('aura_expertise').select('id').eq('serial_no', imei).single();
      if (data) setExpertiseId(data.id); else setExpertiseId(null);
  };

  const fetchTimeline = async (jobId: string) => {
      const { data } = await supabase.from('aura_timeline').select('*').eq('job_id', jobId).order('created_at', { ascending: false });
      if(data) setTimelineLogs(data);
  };

  const logToTimeline = async (action: string, desc: string) => {
      if (id === 'yeni') return; 
      const now = new Date().toISOString();
      const newLog = { job_id: id, action_type: action, description: desc, created_by: currentUserEmail, created_at: now };
      setTimelineLogs(prev => [newLog, ...prev]);
      await supabase.from('aura_timeline').insert([newLog]);
  };

  const fetchUsedParts = async (jobId: string) => {
      const { data } = await supabase.from('aura_servis_parcalari').select(`*, aura_stok(urun_adi)`).eq('job_id', String(jobId)); 
      if(data) setUsedParts(data);
  };

  const handleStockSearch = async (termOverride?: string) => {
      const term = termOverride || stockSearchTerm;
      if(term.length < 2) return;
      const { data } = await supabase.from('aura_stok').select('*').or(`urun_adi.ilike.%${term}%,stok_kodu.ilike.%${term}%`).gt('stok_adedi', 0).limit(10);
      setStockResults(data || []);
  };

  const addPartToJob = async (part: any) => {
      if(id === 'yeni') { alert("Önce servisi kaydetmelisiniz."); return; }
      if(!confirm(`${part.urun_adi} stoktan düşülecek. Onaylıyor musunuz?`)) return;

      await supabase.from('aura_servis_parcalari').insert([{ job_id: id, stok_id: part.id, adet: 1, alis_fiyati_anlik: part.alis_fiyati, satis_fiyati_anlik: part.satis_fiyati }]);
      await supabase.from('aura_stok').update({ stok_adedi: part.stok_adedi - 1 }).eq('id', part.id);
      
      const newCost = Number(formData.cost) + Number(part.alis_fiyati);
      const newPrice = Number(formData.price) + Number(part.satis_fiyati);
      const newNotes = formData.notes ? formData.notes + `\n[PARÇA] ${part.urun_adi}` : `[PARÇA] ${part.urun_adi}`;

      await supabase.from('aura_jobs').update({ price: String(newPrice), cost: newCost, technician_note: newNotes }).eq('id', id);
      setFormData({ ...formData, price: newPrice, cost: newCost, notes: newNotes });
      logToTimeline("Parça Kullanıldı", `${part.urun_adi} stoktan düşüldü.`);
      fetchUsedParts(id); setIsStockModalOpen(false);
  };

  const removePartFromJob = async (partRelId: number, partStokId: number, alis: number, satis: number, adet: number) => {
      if(!confirm(`İptal edilsin mi?`)) return;
      await supabase.from('aura_servis_parcalari').delete().eq('id', partRelId);
      const { data: currStock } = await supabase.from('aura_stok').select('stok_adedi').eq('id', partStokId).single();
      if(currStock) await supabase.from('aura_stok').update({ stok_adedi: currStock.stok_adedi + adet }).eq('id', partStokId);
      const newCost = Number(formData.cost) - (alis * adet);
      const newPrice = Number(formData.price) - (satis * adet);
      await supabase.from('aura_jobs').update({ price: String(newPrice), cost: newCost }).eq('id', id);
      setFormData({ ...formData, price: newPrice, cost: newCost });
      logToTimeline("Parça İptali", `Parça kullanımı iptal edildi.`);
      fetchUsedParts(id);
  };

  // --- VISUAL DIAGNOSTIC ---
  const handleVisualPartClick = (partId: string) => {
      if(partId === 'screen') return; 
      const part = DEVICE_PARTS_SVG.find(p => p.id === partId);
      if(!part) return;
      
      const exists = formData.selectedVisualParts.find((p:any) => p.id === partId);
      let newParts = [];
      
      if(exists) {
          newParts = formData.selectedVisualParts.filter((p:any) => p.id !== partId);
      } else {
          const action = prompt(`${part.name} için işlem?\n1. Değişim (${part.price}₺)\n2. Onarım (${part.price/2}₺)`, "1");
          if(!action) return;
          const isReplace = action === "1";
          const finalPrice = isReplace ? part.price : part.price / 2;
          newParts = [...formData.selectedVisualParts, { ...part, type: isReplace ? 'degisim' : 'onarim', finalPrice }];
      }

      const totalVisualPrice = newParts.reduce((acc:number, p:any) => acc + p.finalPrice, 0);
      const visualDiff = (exists ? -exists.finalPrice : newParts[newParts.length-1]?.finalPrice || 0);
      
      setFormData({ ...formData, selectedVisualParts: newParts, price: formData.price + visualDiff });
  };

  // --- WIKI İŞLEMLERİ (EKSİK OLANLAR EKLENDİ) ---
  const handleWikiSearch = async () => { 
      if (!wikiSearchTerm) return; 
      const { data } = await supabase.from('aura_wiki').select('*').ilike('title', `%${wikiSearchTerm}%`).limit(5); 
      setWikiResults(data || []); 
  };

  const handleAddToWiki = async () => {
      if (!newWikiEntry.title || !newWikiEntry.solution) { alert("Başlık ve Çözüm alanları zorunludur."); return; }
      const { error } = await supabase.from('aura_wiki').insert([{ 
          title: newWikiEntry.title, 
          device_category: formData.category, 
          problem_desc: newWikiEntry.problem, 
          solution_steps: newWikiEntry.solution, 
          author: currentUserEmail 
      }]);
      if (!error) { 
          alert("Çözüm kütüphaneye eklendi!"); 
          setWikiViewMode('search'); 
          setWikiSearchTerm(newWikiEntry.title); 
          handleWikiSearch(); 
      } else { 
          alert("Hata: " + error.message); 
      }
  };

  const applyWikiSolution = (solution: string) => { 
      setFormData({ ...formData, notes: (formData.notes ? formData.notes + "\n\n" : "") + "📚 WIKI ÇÖZÜMÜ:\n" + solution }); 
      setIsWikiModalOpen(false); 
      logToTimeline("Wiki Kullanıldı", "Arıza kütüphanesinden çözüm uygulandı."); 
  };

  const toggleUpsell = (item: any) => {
      const current = Array.isArray(formData.recommended_upsells) ? [...formData.recommended_upsells] : [];
      const exists = current.find((i:any) => i.id === item.id);
      if (exists) setFormData({...formData, recommended_upsells: current.filter((i:any) => i.id !== item.id)});
      else setFormData({...formData, recommended_upsells: [...current, item]});
  };

  const handlePaymentAndComplete = async () => {
      setLoading(true);
      if (Number(formData.price) > 0) {
          const { error } = await supabase.from('aura_finans').insert([{ tur: 'Gelir', kategori: 'Servis Hizmeti', tutar: Number(formData.price), odeme_yontemi: paymentMethod, aciklama: `${formData.tracking_code} - ${formData.customer} Servis Ücreti`, tarih: new Date().toISOString().split('T')[0] }]);
      }
      await supabase.from('aura_jobs').update({ status: 'Teslim Edildi', updated_at: new Date().toISOString() }).eq('id', id);
      logToTimeline("Teslimat & Ödeme", `Cihaz teslim edildi. ${formData.price} TL tahsil edildi.`);
      setFormData({...formData, status: 'Teslim Edildi'});
      setIsPaymentModalOpen(false); setLoading(false); alert("İşlem tamamlandı!");
      if(confirm("Mesaj gönderilsin mi?")) sendWhatsAppMessage();
  };

  const handleSave = async () => {
    if (!formData.customer) { alert("Müşteri adı zorunlu!"); return; }
    setLoading(true);
    
    const visualNotes = formData.selectedVisualParts?.map((p:any) => `[DIAGNOSTIC] ${p.name} (${p.type}) - ${p.finalPrice}₺`).join('\n');
    const finalNotes = visualNotes ? (formData.notes + "\n" + visualNotes) : formData.notes;

    const payload = {
        customer: formData.customer, customer_email: formData.email, customer_name: formData.customer, phone: formData.phone, address: formData.address, customer_type: formData.customerType,
        device_name: formData.device, device: formData.device, model: formData.device, brand: formData.category, category: formData.category,
        serial_no: formData.serialNo, serial_number: formData.serialNo, imei: formData.serialNo,
        password: formData.password, screen_password: formData.password, pattern_password: formData.password, passcode: formData.password,
        problem_description: formData.issue, problem: formData.issue, issue: formData.issue, complaint: formData.issue, technician_note: finalNotes, 
        private_note: JSON.stringify(formData.selectedVisualParts), 
        status: formData.status, price: String(formData.price), cost: Number(formData.cost), tracking_code: formData.tracking_code || `SRV-${Math.floor(10000 + Math.random() * 90000)}`,
        accessories: JSON.stringify(formData.accessories), accessory: JSON.stringify(formData.accessories), pre_checks: JSON.stringify(formData.preCheck), final_checks: JSON.stringify(formData.finalCheck), images: JSON.stringify(formData.images), recommended_upsells: JSON.stringify(formData.recommended_upsells), sold_upsells: JSON.stringify(formData.sold_upsells),
        tip_id: formData.tip_id, approval_status: formData.approval_status, approval_amount: String(formData.approval_amount), approval_desc: formData.approval_desc, updated_at: new Date().toISOString()
    };
    
    let res;
    if (id === 'yeni') res = await supabase.from('aura_jobs').insert([payload]).select();
    else { res = await supabase.from('aura_jobs').update(payload).eq('id', id); logToTimeline("Kayıt Güncellendi", `Durum: ${formData.status}`); }
    setLoading(false);
    if (!res.error) { alert("Kaydedildi!"); if (id === 'yeni' && res.data) router.push(`/epanel/atolye/${res.data[0].id}`); } else { alert("Hata: " + res.error.message); }
  };

  const sendApprovalRequest = async () => {
    setLoading(true);
    const { error } = await supabase.from('aura_jobs').update({ approval_status: 'pending', approval_amount: String(approvalData.amount), approval_desc: approvalData.desc, status: 'Onay Bekliyor' }).eq('id', id);
    if (!error) { alert("Onay isteği gönderildi!"); setFormData({ ...formData, status: 'Onay Bekliyor', approval_status: 'pending', approval_amount: approvalData.amount, approval_desc: approvalData.desc }); logToTimeline("Onay İsteği", `Müşteriden ${approvalData.amount} TL tutarında ek onay istendi.`); setApprovalModalOpen(false); }
    setLoading(false);
  };

  const handleCategoryChange = (cat: string) => { setFormData((prev: any) => ({ ...prev, category: cat, accessories: [], preCheck: [], finalCheck: [], tip_id: "genel", recommended_upsells: [] })); };
  
  const handleImageUpload = async (e: any) => { 
    if (!e.target.files.length) return; setUploading(true);
    const files = Array.from(e.target.files); const newImages = Array.isArray(formData.images) ? [...formData.images] : [];
    for (const file of files as File[]) {
        const fileExt = file.name.split('.').pop(); const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error } = await supabase.storage.from('service-images').upload(fileName, file);
        if (!error) { const { data } = supabase.storage.from('service-images').getPublicUrl(fileName); newImages.push(data.publicUrl); }
    }
    setFormData({ ...formData, images: newImages }); logToTimeline("Fotoğraf Yüklendi", `${files.length} adet yeni fotoğraf eklendi.`); setUploading(false);
  };
  const removeImage = (index: number) => { const newImages = Array.isArray(formData.images) ? [...formData.images] : []; newImages.splice(index, 1); setFormData({ ...formData, images: newImages }); };
  const handleDelete = async () => { if(!confirm("Silmek istiyor musunuz?")) return; setLoading(true); const { error } = await supabase.from('aura_jobs').delete().eq('id', id); if (error) { alert("Hata: " + error.message); setLoading(false); } else { alert("Silindi."); router.push('/epanel/atolye'); } };
  const sendWhatsAppMessage = () => { let cleanPhone = (formData.phone || "").replace(/\D/g, ''); if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1); if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone; let rawMessage = formData.status === "Hazır" ? `Sayın *${formData.customer}*,\n\n*${formData.tracking_code}* kodlu cihazınız hazır.\n💰 Tutar: ${formData.price} TL` : `Merhaba,\n\nCihaz durumu: *${formData.status}*.`; logToTimeline("WhatsApp Mesajı", "Müşteriye durum bildirimi gönderildi."); window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(rawMessage)}`, "_blank"); };
  const toggleArrayItem = (field: string, item: string) => { setFormData((prev: any) => { const current = Array.isArray(prev[field]) ? prev[field] : []; const updated = current.includes(item) ? current.filter((i: string) => i !== item) : [...current, item]; return { ...prev, [field]: updated }; }); };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://aurabilisim.net/cihaz-sorgula?takip=${formData.tracking_code}`)}`;
  if (loading) return <div className="p-20 text-white text-center">Yükleniyor...</div>;
  const catInfo = getCategoryInfo(formData.category);
  const totalPartsCost = usedParts.reduce((acc, part) => acc + (Number(part.satis_fiyati_anlik) * Number(part.adet)), 0);
  const totalUpsellsCost = Array.isArray(formData.sold_upsells) ? formData.sold_upsells.reduce((acc:any, item:any) => acc + (Number(item.price)||0), 0) : 0;
  const laborCost = Math.max(Number(formData.price) - totalPartsCost - totalUpsellsCost, 0);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 font-sans relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-800 pb-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur-md z-50 gap-4 print:hidden">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 font-bold text-sm"><ArrowLeft size={18}/> GERİ DÖN</button>
                <h1 className="text-xl font-black text-white">SERVİS <span className="text-cyan-500">#{formData.tracking_code || "YENİ"}</span></h1>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <button onClick={sendWhatsAppMessage} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-sm shadow-lg shadow-green-900/20 active:scale-95"><MessageCircle size={18}/> WP</button>
                <button onClick={() => window.print()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 text-white font-bold text-sm active:scale-95"><Printer size={18}/> YAZDIR</button>
                {formData.status !== 'Teslim Edildi' && id !== 'yeni' && (<button onClick={() => setIsPaymentModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-bold text-sm shadow-lg active:scale-95"><CheckCircle2 size={18}/> TESLİM ET</button>)}
                {id !== 'yeni' && (<button onClick={handleDelete} className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg font-bold"><Trash2 size={18}/></button>)}
                <button onClick={handleSave} className="px-6 py-2 bg-cyan-600 rounded-lg font-bold text-white shadow-lg"><Save size={18}/> KAYDET</button>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-6 print:hidden">
            <div className="col-span-12 lg:col-span-3 space-y-6">
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={14} className="text-cyan-500"/> Müşteri</h3>
                    <div className="space-y-3">
                        <div className="flex bg-black/30 p-1 rounded-lg border border-slate-800 mb-3">{["Son Kullanıcı", "Bayi"].map(t => (<button key={t} onClick={() => setFormData((p:any)=>({...p, customerType: t}))} className={`flex-1 text-[10px] py-1.5 rounded font-bold transition-all uppercase ${formData.customerType === t ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>{t}</button>))}</div>
                        {formData.customerType === 'Bayi' ? (<div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" size={14} /><select className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 pl-9 text-sm font-bold text-white outline-none focus:border-cyan-500 appearance-none" value={formData.customer} onChange={(e) => handleDealerChange(e.target.value)}><option value="">Bayi Seçiniz...</option>{dealersList.map((d: any) => ( <option key={d.id} value={d.sirket_adi}>{d.sirket_adi}</option> ))}</select></div>) : (<input type="text" value={formData.customer} onChange={e => setFormData((p:any)=>({...p, customer: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-white outline-none" placeholder="Ad Soyad"/>)}
                        <input type="text" value={formData.phone} onChange={e => setFormData((p:any)=>({...p, phone: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-mono" placeholder="Telefon"/>
                        <textarea value={formData.address} onChange={e => setFormData((p:any)=>({...p, address: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-xs h-20 outline-none resize-none" placeholder="Adres..."></textarea>
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                            <select value={formData.status} onChange={e => setFormData((p:any)=>({...p, status: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-white"><option>Bekliyor</option><option>İşlemde</option><option>Parça Bekliyor</option><option>Onay Bekliyor</option><option>Hazır</option><option>Teslim Edildi</option></select>
                            <div className="flex gap-2"><div className="flex-1"><label className="text-[9px] text-green-500 font-bold">FİYAT</label><input type="number" value={formData.price} onChange={e => setFormData((p:any)=>({...p, price: Number(e.target.value)}))} className="w-full bg-[#0b0e14] border border-green-900/50 text-green-400 font-bold text-right p-2 rounded-lg"/></div><div className="flex-1"><label className="text-[9px] text-red-500 font-bold">MALİYET</label><input type="number" value={formData.cost} onChange={e => setFormData((p:any)=>({...p, cost: Number(e.target.value)}))} className="w-full bg-[#0b0e14] border border-red-900/50 text-red-400 font-bold text-right p-2 rounded-lg"/></div></div>
                        </div>
                        {formData.approval_status === 'none' && <button onClick={() => setApprovalModalOpen(true)} className="w-full py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg font-bold text-xs flex justify-center gap-2"><Zap size={14}/> EKSTRA ONAY İSTE</button>}
                        {formData.approval_status === 'pending' && <div className="text-center text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/30 animate-pulse">ONAY BEKLENİYOR (+{formData.approval_amount}₺)</div>}
                        {formData.approval_status === 'approved' && <div className="text-center text-xs text-green-500 bg-green-500/10 p-2 rounded border border-green-500/30">MÜŞTERİ ONAYLADI ✅</div>}
                    </div>
                </div>

                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Lock size={14} className="text-indigo-400"/> Özel Not (Gizli)</h3>
                    <textarea value={formData.privateNote} onChange={e => setFormData((p:any)=>({...p, privateNote: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-xs h-24 outline-none resize-none focus:border-indigo-500 text-slate-300" placeholder="Sadece yöneticiler ve teknisyenler görebilir..."></textarea>
                </div>
                
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ShoppingBag size={14} className="text-pink-500"/> Fırsat Öner (Upsell)</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {availableUpsells.length > 0 ? availableUpsells.map((item:any) => {
                            const recUpsells = Array.isArray(formData.recommended_upsells) ? formData.recommended_upsells : [];
                            const sldUpsells = Array.isArray(formData.sold_upsells) ? formData.sold_upsells : [];
                            const isSelected = recUpsells.some((i:any) => i.id === item.id);
                            const isSold = sldUpsells.some((i:any) => i.id === item.id || i.name === item.name || i === item.name);
                            if(isSold) return <div key={item.id} className="p-2 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400 flex justify-between"><span>{item.name}</span><span className="font-bold">SATILDI</span></div>;
                            return ( <button key={item.id} onClick={() => toggleUpsell(item)} className={`w-full flex justify-between items-center p-2 rounded border transition-all text-xs ${isSelected ? 'bg-pink-500/20 border-pink-500 text-pink-300' : 'bg-[#0b0e14] border-slate-700 text-slate-400 hover:border-slate-500'}`}><span>{item.name}</span><span className="font-bold">{item.price}₺</span></button> );
                        }) : (<div className="text-center text-[10px] text-slate-600">Bu kategori için ürün bulunamadı.</div>)}
                    </div>
                    {Array.isArray(formData.recommended_upsells) && formData.recommended_upsells.length > 0 && <div className="text-[10px] text-slate-500 text-center mt-2">Seçili {formData.recommended_upsells.length} ürün müşteriye gösterilecek.</div>}
                </div>
            </div>

            <div className="col-span-12 lg:col-span-5 space-y-6">
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-5">
                         <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Smartphone size={14} className="text-blue-500"/> Cihaz Kimliği</h3>
                         <button onClick={() => setIsVisualDiagnosticOpen(true)} className="text-[9px] bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-400 px-3 py-1.5 rounded-full border border-cyan-500/30 font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/10"><Activity size={12} className="animate-pulse"/> AURA VISUAL DIAGNOSTIC</button>
                    </div>
                    <div className="space-y-4">
                        <div><label className="text-[10px] text-slate-500 font-bold ml-1">MARKA / MODEL</label><input type="text" value={formData.device} onChange={e => setFormData((p:any)=>({...p, device: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-lg font-black text-white outline-none focus:border-cyan-500" placeholder="Model (Örn: iPhone 13)"/></div>
                        <div className="grid grid-cols-2 gap-4"><div className="relative"><input type="text" value={formData.serialNo} onChange={e => { setFormData((p:any)=>({...p, serialNo: e.target.value})); checkExpertise(e.target.value); }} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm font-mono uppercase outline-none focus:border-cyan-500" placeholder="IMEI / SERİ NO"/>{formData.serialNo.length > 5 && (<div className="absolute right-1 top-1 bottom-1">{expertiseId ? (<button onClick={() => router.push(`/epanel/ekspertiz/detay/${expertiseId}`)} className="h-full px-3 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-lg hover:scale-105 transition-transform"><FileText size={12}/> RAPOR VAR</button>) : (<button onClick={() => router.push(`/epanel/ekspertiz?yeni=${formData.serialNo}`)} className="h-full px-3 bg-slate-700 hover:bg-blue-600 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-lg hover:scale-105 transition-transform"><PlusCircle size={12}/> RAPOR EKLE</button>)}</div>)}</div><input type="text" value={formData.password} onChange={e => setFormData((p:any)=>({...p, password: e.target.value}))} className="w-full bg-[#0b0e14] border border-red-900/30 text-red-400 rounded-lg p-3 font-bold outline-none focus:border-red-500" placeholder="Şifre"/></div>
                        <div><div className="flex justify-between items-center mb-1 ml-1"><label className="text-[10px] text-slate-500 font-bold">ŞİKAYET / ARIZA</label><button onClick={() => { setIsWikiModalOpen(true); setWikiSearchTerm(formData.device); handleWikiSearch(); }} className="text-[10px] flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/30"><Book size={10}/> Wiki'de Ara</button></div><textarea value={formData.issue} onChange={e => setFormData((p:any)=>({...p, issue: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm h-24 outline-none resize-none focus:border-cyan-500" placeholder="Arıza detayını giriniz..."></textarea></div>
                        <div className="bg-black/20 p-3 rounded-xl border border-slate-800"><label className="text-[10px] text-cyan-500 font-bold uppercase mb-2 block">Teslim Alınanlar</label><div className="flex flex-wrap gap-2">{catInfo.accessories.map((acc: string) => { const accArray = Array.isArray(formData.accessories) ? formData.accessories : []; const isSelected = accArray.includes(acc); return (<button key={acc} onClick={() => { const curr = isSelected ? accArray.filter((i:any)=>i!==acc) : [...accArray, acc]; setFormData({...formData, accessories: curr}); }} className={`px-2 py-1 rounded border text-[10px] font-bold transition-all ${isSelected ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400 scale-105' : 'bg-[#0b0e14] border-slate-500 hover:border-slate-600'}`}>{acc}</button>); })}</div></div>
                    </div>
                </div>

                {id !== 'yeni' && (
                    <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><PackageMinus size={14} className="text-yellow-500"/> Kullanılan Parçalar</h3><div className="flex gap-2"><button onClick={() => { setIsStockModalOpen(true); setShowScanner(true); }} className="text-[10px] bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-lg"><ScanLine size={12}/> BARKOD</button><button onClick={() => setIsStockModalOpen(true)} className="text-[10px] bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-lg"><Plus size={12}/> STOKTAN DÜŞ</button></div></div>
                        <div className="space-y-2">{usedParts.length > 0 ? usedParts.map((part) => (<div key={part.id} className="flex justify-between items-center bg-[#0b0e14] border border-slate-800 p-2.5 rounded-lg group"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-xs">{part.adet}x</div><div><p className="text-xs font-bold text-white">{part.aura_stok?.urun_adi}</p><p className="text-[10px] text-slate-500">Mal: {(part.alis_fiyati_anlik * part.adet)}₺ • Sat: {(part.satis_fiyati_anlik * part.adet)}₺</p></div></div><button onClick={() => removePartFromJob(part.id, part.stok_id, part.alis_fiyati_anlik, part.satis_fiyati_anlik, part.adet)} className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button></div>)) : (<div className="text-center text-[10px] text-slate-600 border border-dashed border-slate-800 p-4 rounded-lg">Henüz parça eklenmedi. "Stoktan Düş" butonunu kullanın.</div>)}</div>
                    </div>
                )}
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
                {id !== 'yeni' && (
                    <div className="bg-[#151921] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col max-h-[300px]">
                        <div className="p-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center"><h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-emerald-500"/> Canlı Akış</h3><span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20">LOGLAR</span></div>
                        <div className="overflow-y-auto custom-scrollbar p-3 space-y-3">{timelineLogs.length > 0 ? timelineLogs.map((log: any) => (<div key={log.id} className="flex gap-3 text-xs"><div className="flex flex-col items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5"></div><div className="w-px h-full bg-slate-800"></div></div><div className="pb-2"><p className="text-slate-300 font-bold">{log.action_type}</p><p className="text-slate-500 text-[10px] leading-tight">{log.description}</p><div className="flex gap-2 mt-1"><span className="text-[9px] text-slate-600">{new Date(log.created_at).toLocaleString('tr-TR')}</span><span className="text-[9px] text-cyan-900/70">{log.created_by?.split('@')[0]}</span></div></div></div>)) : <div className="text-center text-[10px] text-slate-600 py-4">Henüz kayıt yok.</div>}</div>
                    </div>
                )}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="bg-[#0b0e14] border border-slate-800 border-b-0 rounded-t-lg px-4 py-2 flex justify-between items-center"><span className="font-bold text-sm uppercase text-slate-300">Servis İşlemleri & Değişen Parçalar</span><span className="text-xs font-bold border border-slate-700 bg-[#151921] px-2 py-0.5 rounded uppercase text-slate-400">DURUM: {formData.status}</span></div>
                    <div className="border border-slate-800 rounded-b-lg p-4 min-h-[120px] bg-[#0b0e14]"><textarea value={formData.notes} onChange={e => setFormData((p:any)=>({...p, notes: e.target.value}))} className="w-full bg-transparent border-none text-slate-300 text-sm h-full outline-none resize-none" placeholder="Yapılan işlemler..."></textarea>{Array.isArray(formData.sold_upsells) && formData.sold_upsells.length > 0 && (<div className="mt-4 pt-4 border-t border-slate-800"><h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Eklenen Ürünler / Hizmetler:</h5><ul className="text-sm list-disc pl-4 space-y-1 text-slate-400">{formData.sold_upsells.map((item:any, idx:number) => (<li key={idx}>{typeof item === 'object' ? (item.name || item.urun_adi || "İsimsiz Ürün") : item}</li>))}</ul></div>)}</div>
                </div>
                
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle size={14} className="text-orange-500"/> Ön Kontrol</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {catInfo.preChecks.map((item: string) => { const preArray = Array.isArray(formData.preCheck) ? formData.preCheck : []; const isSelected = preArray.includes(item); return (<button key={item} onClick={() => { const curr = isSelected ? preArray.filter((i:any)=>i!==item) : [...preArray, item]; setFormData({...formData, preCheck: curr}); }} className={`flex items-center gap-2 p-2 rounded border text-left text-[10px] transition-all ${isSelected ? 'bg-red-500/10 border-red-500/50 text-red-400 font-bold' : 'bg-[#0b0e14] border-slate-800 text-slate-600 hover:border-slate-700'}`}><div className={`w-2 h-2 rounded-full ${isSelected?'bg-red-500':'bg-slate-700'}`}></div>{item}</button>); })}
                    </div>
                </div>
                
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-2"><Camera size={14} className="text-cyan-500"/> Fotoğraflar</h3>
                        <label className={`cursor-pointer text-[10px] bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg text-white font-bold transition-all flex items-center gap-1 ${uploading ? 'opacity-50' : ''}`}>
                            <Upload size={10}/> {uploading ? '...' : 'Ekle'}
                            <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading}/>
                        </label>
                    </div>
                    {Array.isArray(formData.images) && formData.images.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                            {formData.images.map((img:string, i:number)=>(
                                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-700">
                                    <img src={img} className="w-full h-full object-cover"/>
                                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"><X size={10}/></button>
                                </div>
                            ))}
                        </div>
                    ) : ( <div className="text-center text-slate-600 text-xs border border-dashed border-slate-800 p-4 rounded-lg">Görsel yok.</div> )}
                </div>
                
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ClipboardCheck size={14} className="text-green-500"/> Kalite Kontrol</h3>
                    <div className="space-y-2">
                         {catInfo.finalChecks.map((item: string) => {
                             const finalArray = Array.isArray(formData.finalCheck) ? formData.finalCheck : [];
                             const isSelected = finalArray.includes(item);
                             return (
                                <button key={item} onClick={() => toggleArrayItem("finalCheck", item)} className={`flex items-center gap-3 p-2 w-full rounded-lg border text-[11px] font-bold text-left transition-all ${isSelected ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-[#0b0e14] border-slate-800 text-slate-600 hover:border-slate-700'}`}>
                                    <div className={`min-w-[14px] h-[14px] rounded flex items-center justify-center border ${isSelected ? 'bg-green-600 border-green-600 text-white' : 'border-slate-700'}`}>{isSelected && <ClipboardCheck size={8}/>}</div>{item}
                                </button>
                             );
                         })}
                    </div>
                </div>
            </div>
        </div>

        {/* --- AURA VISUAL DIAGNOSTIC MODAL (GOLD PCB STYLE) --- */}
        {isVisualDiagnosticOpen && (
            <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-lg animate-in zoom-in-95">
                <div className="bg-[#0a0a0a] border border-yellow-600/30 w-full max-w-5xl h-[90vh] rounded-3xl shadow-[0_0_100px_rgba(234,179,8,0.1)] overflow-hidden flex flex-col md:flex-row relative">
                    <button onClick={() => setIsVisualDiagnosticOpen(false)} className="absolute top-4 right-4 text-white z-50 hover:scale-110 transition-transform"><X size={24}/></button>
                    
                    {/* SOL: GÖRSEL SEÇİM ALANI */}
                    <div className="flex-1 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-[#0a0a0a] to-[#0a0a0a] overflow-hidden">
                         <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                        
                        <div className="relative z-10 w-[300px] h-[600px] group scale-110 md:scale-100 origin-center">
                            {/* TELEFON ÇERÇEVESİ */}
                            <div className="absolute inset-0 border-[6px] border-yellow-600/50 rounded-[3rem] shadow-[0_0_30px_rgba(234,179,8,0.3),inset_0_0_20px_rgba(0,0,0,0.8)] bg-[#050505] z-0 overflow-hidden"></div>
                            
                            {/* SVG KATMANI */}
                            <svg viewBox="0 0 300 600" className="absolute inset-0 w-full h-full z-10 overflow-visible pl-[10px] pr-[10px] py-[20px]">
                                <defs>
                                    <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                {DEVICE_PARTS_SVG.map((part) => {
                                    const isSelected = formData.selectedVisualParts?.find((p:any) => p.id === part.id);
                                    
                                    const fillColor = isSelected 
                                        ? (isSelected.type === 'degisim' ? '#ef4444' : '#eab308') 
                                        : (part.id === 'screen' || part.id.includes('charging') ? 'transparent' : '#1e293b');
                                    
                                    const strokeColor = isSelected ? '#facc15' : '#4b5563';
                                    const strokeWidth = isSelected ? 2 : 1;
                                    const filter = isSelected ? 'url(#goldGlow)' : 'none';

                                    return (
                                        <g key={part.id} onClick={() => handleVisualPartClick(part.id)} className="cursor-pointer group/part transition-all duration-300">
                                            <path 
                                                d={part.path} 
                                                fill={fillColor} 
                                                stroke={strokeColor} 
                                                strokeWidth={strokeWidth}
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                                fillRule={part.fillRule as any || "nonzero"}
                                                filter={filter}
                                                className="transition-all duration-300 hover:opacity-80" 
                                            />
                                            {/* Etiket */}
                                            {isSelected && (
                                                <text x={part.cx} y={part.cy} textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="bold" className="pointer-events-none drop-shadow-md bg-black">
                                                    {part.name}
                                                </text>
                                            )}
                                             {!isSelected && part.id !== 'screen' && (
                                                <foreignObject x={part.cx - 10} y={part.cy - 10} width="20" height="20" className="pointer-events-none opacity-30 group-hover/part:opacity-100 transition-opacity">
                                                    <part.icon size={20} className="text-white"/>
                                                </foreignObject>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                        
                        <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-6">
                            <div className="flex items-center gap-3 px-4 py-2 bg-red-900/20 rounded-full border border-red-500/30 backdrop-blur-sm"><div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_red]"></div><span className="text-xs text-red-400 font-bold tracking-wider">DEĞİŞİM</span></div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-yellow-900/20 rounded-full border border-yellow-500/30 backdrop-blur-sm"><div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_yellow]"></div><span className="text-xs text-yellow-400 font-bold tracking-wider">ONARIM</span></div>
                        </div>
                    </div>

                    {/* SAĞ: LİSTE VE TOPLAM */}
                    <div className="w-full md:w-96 bg-[#0a0a0a] border-l border-yellow-600/30 p-8 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-20">
                        <h2 className="text-yellow-500 font-black text-2xl mb-2 flex items-center gap-3 tracking-tight"><Wrench className="animate-spin-slow text-yellow-400" size={24}/> DIAGNOSTIC</h2>
                        <div className="h-0.5 w-full bg-gradient-to-r from-yellow-500/50 to-transparent mb-6"></div>
                        <p className="text-slate-400 text-sm mb-8 font-medium">Arızalı parçaları görsel üzerinden seçin.</p>
                        
                        <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
                            {(!formData.selectedVisualParts || formData.selectedVisualParts.length === 0) && <div className="text-center text-slate-500 text-sm py-16 italic border-2 border-dashed border-yellow-600/20 rounded-2xl bg-yellow-900/5">Henüz parça seçilmedi.</div>}
                            {formData.selectedVisualParts?.map((part: any, i:number) => (
                                <div key={i} className="flex justify-between items-center bg-gradient-to-r from-[#111] to-[#0a0a0a] p-4 rounded-2xl border border-yellow-600/20 hover:border-yellow-500/50 transition-all shadow-sm group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`p-3 rounded-xl shadow-inner ${part.type === 'degisim' ? 'bg-red-500/10 text-red-400 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]' : 'bg-yellow-500/10 text-yellow-400 shadow-[inset_0_0_10px_rgba(234,179,8,0.2)]'}`}><part.icon size={20}/></div>
                                        <div><div className="text-sm font-bold text-white tracking-wide">{part.name}</div><div className={`text-[10px] font-bold uppercase tracking-wider ${part.type === 'degisim' ? 'text-red-500' : 'text-yellow-500'}`}>{part.type}</div></div>
                                    </div>
                                    <div className="text-right relative z-10"><div className="font-mono font-black text-yellow-400 text-lg">{part.finalPrice}₺</div></div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-yellow-600/30">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Tahmini Tutar</span>
                                <span className="text-3xl font-black text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{formData.price}₺</span>
                            </div>
                            <button onClick={() => setIsVisualDiagnosticOpen(false)} className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-[#0a0a0a] py-4 rounded-2xl font-black text-base shadow-[0_10px_30px_rgba(234,179,8,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                <CheckCircle2 size={20} className="text-[#0a0a0a]"/> ONAYLA & KAPAT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* WIKI MODAL */}
        {isWikiModalOpen && (<div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-[#1e293b] rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[80vh]"><div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center"><h3 className="text-white font-bold flex items-center gap-2"><Book size={18} className="text-purple-400"/> AURA WIKI</h3><button onClick={() => setIsWikiModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white"/></button></div>{wikiViewMode==='search'?(<div className="p-6 flex-1 overflow-y-auto"><div className="relative mb-6"><input type="text" value={wikiSearchTerm} onChange={(e)=>setWikiSearchTerm(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleWikiSearch()} className="w-full bg-[#0b0e14] border border-slate-600 rounded-xl py-3 pl-11 pr-4 text-white focus:border-purple-500 outline-none" placeholder="Arıza ara..."/><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/><button onClick={handleWikiSearch} className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">ARA</button></div>{wikiResults.length>0?(<div className="space-y-3">{wikiResults.map((res:any)=>(<div key={res.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:bg-slate-800 transition-colors"><div className="flex justify-between items-start mb-2"><h4 className="text-purple-400 font-bold text-sm">{res.title}</h4><button onClick={()=>applyWikiSolution(res.solution_steps)} className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded font-bold">UYGULA</button></div><p className="text-slate-400 text-xs mb-2 line-clamp-2">{res.problem_desc}</p></div>))}</div>):(<div className="text-center py-10"><Book size={40} className="text-slate-700 mx-auto mb-3"/><p className="text-slate-400 font-bold">Sonuç Bulunamadı</p><button onClick={()=>{setWikiViewMode('add');setNewWikiEntry({...newWikiEntry,title:wikiSearchTerm,problem:formData.issue});}} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 mx-auto"><Plus size={14}/> YENİ EKLE</button></div>)}</div>):(<div className="p-6 flex-1 overflow-y-auto space-y-4"><div className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer hover:text-white mb-2" onClick={()=>setWikiViewMode('search')}><ArrowLeft size={14}/> Geri</div><div><label className="text-[10px] font-bold text-slate-500 mb-1 block">BAŞLIK</label><input type="text" value={newWikiEntry.title} onChange={(e)=>setNewWikiEntry({...newWikiEntry,title:e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-2.5 text-white text-sm"/></div><div><label className="text-[10px] font-bold text-slate-500 mb-1 block">SORUN</label><textarea value={newWikiEntry.problem} onChange={(e)=>setNewWikiEntry({...newWikiEntry,problem:e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-2.5 text-white text-sm h-20 resize-none"/></div><div><label className="text-[10px] font-bold text-slate-500 mb-1 block">ÇÖZÜM</label><textarea value={newWikiEntry.solution} onChange={(e)=>setNewWikiEntry({...newWikiEntry,solution:e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-2.5 text-white text-sm h-40 resize-none"/></div><button onClick={handleAddToWiki} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg">KAYDET</button></div>)}</div></div>)}

        {/* --- PRINT AREA --- */}
        <div id="printable-area" className="hidden bg-white text-black font-sans">
             <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-center">
                 <div className="flex items-center gap-4"><img src="/image/aura-logo.png" className="h-16 w-auto object-contain"/><div><h1 className="text-3xl font-black text-cyan-700 leading-none">AURA BİLİŞİM</h1><p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">TEKNOLOJİ SERVİS MERKEZİ</p><p className="text-[10px] text-slate-500 mt-1">www.aurabilisim.net • 0850 123 45 67</p></div></div>
                 <div className="text-right"><div className="text-xl font-bold">#{formData.tracking_code}</div><div>{new Date().toLocaleDateString('tr-TR')}</div></div>
             </div>
             <div className="grid grid-cols-2 gap-8 mb-8">
                 <div><h3 className="font-bold border-b mb-2">Müşteri</h3><p>{formData.customer}</p><p>{formData.phone}</p></div>
                 <div><h3 className="font-bold border-b mb-2">Cihaz</h3><p>{formData.device}</p><p>{formData.serialNo}</p></div>
             </div>
             <div className="mb-8"><h3 className="font-bold border-b mb-2">İşlemler</h3><p>{formData.notes}</p></div>
             <div className="text-right text-2xl font-black">TOPLAM: {formData.price} ₺</div>
        </div>

        <style jsx global>{` @media print { @page { size: A4; margin: 0; } body { visibility: hidden; } #printable-area { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; } .print\\:hidden { display: none !important; } } `}</style>
    </div>
  );
}