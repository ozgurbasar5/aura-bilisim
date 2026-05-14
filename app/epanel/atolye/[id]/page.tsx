"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Printer, User, Zap, Box, 
  ClipboardCheck, CreditCard, AlertTriangle, MessageCircle, Lock,
  Battery, Eye, Trash2, Camera, Upload, X,
  CheckCircle2, ShoppingBag, FileText, PlusCircle, Book, Search, Plus, Clock, PackageMinus, Check, Building2, ScanLine, Activity, Monitor, Cpu, Speaker, Vibrate, Phone, Radio, ShieldCheck, Package
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { Html5QrcodeScanner } from "html5-qrcode";

// --- TİP TANIMLAMALARI ---
interface DevicePart {
    id: string;
    name: string;
    icon: any;
    price: number;
    path: string;
    baseColor?: string;
    fillRule?: "nonzero" | "evenodd" | "inherit";
}

// --- GÖRSEL PARÇALAR ---
const DEVICE_PARTS_SVG: DevicePart[] = [
    { id: 'motherboard', name: 'ANAKART', icon: Cpu, price: 4500, path: "M 160 40 L 270 40 L 270 300 L 160 300 L 160 140 L 140 140 L 140 40 Z", baseColor: "#334155" },
    { id: 'battery', name: 'BATARYA', icon: Battery, price: 900, path: "M 20 130 L 130 130 L 130 460 L 20 460 Z", baseColor: "#1e293b" },
    { id: 'camera_back', name: 'ARKA KAMERA', icon: Camera, price: 1200, path: "M 190 50 L 260 50 L 260 120 L 190 120 Z", baseColor: "#0f172a" },
    { id: 'camera_front', name: 'ÖN KAMERA', icon: Eye, price: 800, path: "M 80 20 L 150 20 L 150 50 L 80 50 Z", baseColor: "#000000" },
    { id: 'charging', name: 'ŞARJ SOKETİ', icon: Zap, price: 600, path: "M 80 540 L 220 540 L 220 590 L 80 590 Z", baseColor: "#475569" },
    { id: 'taptic', name: 'TİTREŞİM', icon: Vibrate, price: 450, path: "M 20 480 L 100 480 L 100 530 L 20 530 Z", baseColor: "#334155" },
    { id: 'speaker', name: 'HOPARLÖR', icon: Speaker, price: 500, path: "M 130 480 L 270 480 L 270 530 L 130 530 Z", baseColor: "#334155" },
    { id: 'earpiece', name: 'AHİZE', icon: Phone, price: 300, path: "M 100 5 L 200 5 L 200 15 L 100 15 Z", baseColor: "#64748b" },
    { id: 'wireless_charging', name: 'KABLOSUZ ŞARJ', icon: Radio, price: 400, path: "M 150 200 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0 M 150 215 m -35 0 a 35 35 0 1 0 70 0 a 35 35 0 1 0 -70 0", fillRule: "evenodd", baseColor: "#94a3b8" },
    { id: 'screen', name: 'EKRAN / CAM', icon: Monitor, price: 2500, path: "M 5 5 L 295 5 L 295 595 L 5 595 Z M 10 10 L 10 590 L 290 590 L 290 10 Z", fillRule: "evenodd", baseColor: "transparent" },
];

const CATEGORY_DATA: any = { 
    "Cep Telefonu": { 
        accessories: ["Cihazın Kendisi", "Kutu", "Orijinal Şarj Aleti", "USB Kablo", "Kılıf", "Sim İğnesi", "Fatura", "Kulaklık", "Dönüştürücü", "Garanti Belgesi"], 
        preChecks: ["Ekran Kırık/Çatlak", "Kasa Ezik/Çizik", "Arka Cam Kırık", "Sıvı Teması Şüphesi", "FaceID/TouchID Çalışmıyor", "Kamera Lens Çizik", "Vida Eksik/Oynanmış", "Şarj Almıyor", "El Feneri Yanmıyor", "Ahize Sesi Az", "Batarya Şişik"], 
        finalChecks: ["Dokunmatik Hassasiyeti", "Ön Kamera", "Arka Kamera & Odak", "Şarj Entegresi & Akım", "Mikrofon (Alt/Üst)", "Ahize & Hoparlör", "Şebeke & Wifi & BT", "Yakınlık Sensörü", "TrueTone / Ekran Renkleri", "FaceID / Parmak İzi", "NFC / Kablosuz Şarj", "Tuş Takımı Kontrolü"] 
    }, 
    "Robot Süpürge": { 
        accessories: ["Cihazın Kendisi", "Şarj İstasyonu", "Güç Kablosu", "Yan Fırça", "Ana Fırça", "Paspas (Mop)", "Paspas Standı", "Su Tankı", "Toz Haznesi", "Filtre", "Kumanda"], 
        preChecks: ["Tekerlek Sıkışık/Zorlanıyor", "Lidar Dönmüyor/Sesli", "Sıvı Teması (Anakart)", "Fan Sesi Yüksek/Islık", "Yan Fırça Dönmüyor", "Ana Fırça Dönmüyor", "Tampon (Bumper) Takılı", "Sensör Camları Çizik", "Şarj Olmuyor Hatası"], 
        finalChecks: ["Emiş Gücü (Pa) Testi", "Haritalama & Lidar", "Şarj Oluyor & Dock Dönüş", "Su Akıtma (Pompa) Testi", "Düşme Sensörleri", "Wifi Bağlantısı", "Halı Algılama", "Sesli Asistan", "Tekerlek Motor Testi", "Batarya Kapasite Testi"] 
    }, 
    "Bilgisayar": { 
        accessories: ["Cihazın Kendisi", "Orijinal Şarj Aleti", "Güç Kablosu", "Çanta / Kılıf", "Mouse", "HDMI / Çevirici", "Kutu", "Batarya (Harici)"], 
        preChecks: ["Ekran Kırık/Lekeli", "Menteşe Gevşek/Kırık", "Klavye Tuş Eksik", "Kasa Köşe Ezik", "Sıvı Teması", "Trackpad Basmıyor", "Vida Eksik", "Fan Çok Sesli", "USB Portları Hasarlı"], 
        finalChecks: ["Klavye (Tüm Tuşlar)", "Ekran & Ölü Piksel", "Ses (Sağ/Sol Hoparlör)", "Wifi & Bluetooth", "Termal Test (Stress)", "SSD Sağlık & Hız", "Fan Devir Kontrolü", "USB & Type-C Portları", "Webcam & Mikrofon", "Batarya Döngüsü", "Menteşe Sertliği"] 
    },
    "Tablet": { 
        accessories: ["Cihazın Kendisi", "Kılıf", "Akıllı Kalem", "Şarj Aleti", "Kablo", "Klavye Kılıf", "Kutu"], 
        preChecks: ["Ekran Çatlak", "Kasa Yamuk/Eğik", "Butonlar Basmıyor", "Şarj Soketi Gevşek", "Kamera Lensi Kırık"], 
        finalChecks: ["Dokunmatik (Multi-touch)", "Kalem (Pencil) Testi", "Ön/Arka Kamera", "Şarj Entegresi", "Wifi & Sim Kart", "Jiroskop (Döndürme)", "Mikrofon & Hoparlör"] 
    },
    "Akıllı Saat": { 
        accessories: ["Cihazın Kendisi", "Kordon (Alt/Üst)", "Şarj Kablosu / Standı", "Kutu"], 
        preChecks: ["Cam Çizik/Kırık", "Kordon Kilit Arızalı", "Arka Sensör Camı Kırık", "Digital Crown Dönmüyor", "Tuş Basmıyor"], 
        finalChecks: ["Dokunmatik Hassasiyeti", "Nabız & Oksijen Sensörü", "Titreşim Motoru", "Telefon Eşleşme", "Mikrofon & Hoparlör", "Su Tahliye Modu", "Şarj Oluyor"] 
    },
    "Oyun Konsolu": { 
        accessories: ["Konsol", "Güç Kablosu", "HDMI Kablo", "Gamepad (1)", "Gamepad (2)", "USB Kablo"], 
        preChecks: ["HDMI Portu Bozuk", "CD Okumuyor", "Fan Sesi Aşırı", "Görüntü Vermiyor", "Gamepad Drift Sorunu", "Kasa Hasarlı"], 
        finalChecks: ["Görüntü & Ses Çıkışı", "Disk Okuyucu Testi", "Wifi/Ethernet", "Isınma Testi", "Gamepad Bağlantısı", "HDD/SSD Sağlık"] 
    },
    "Diğer": { 
        accessories: ["Cihazın Kendisi", "Güç Kablosu", "Kumanda", "Adaptör", "Aksesuar"], 
        preChecks: ["Fiziksel Hasar", "Eksik Parça", "Açılmıyor", "Ses Gelmiyor"], 
        finalChecks: ["Güç Testi", "Fonksiyon Testi", "Güvenlik Testi", "Temizlik"] 
    } 
};

const SERVICE_CATEGORIES = ["Garanti Uzatma", "Koruma Paketi", "Yazılım Hizmeti", "Bakım Paketi", "Hizmet"];

export default function ServisDetaySayfasi() {
  const router = useRouter();
  const params = useParams(); 
  const id = params?.id as string; 
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [expertiseId, setExpertiseId] = useState<number | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("Sistem");
  
  // LİSTELER
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [dealersList, setDealersList] = useState<any[]>([]);
  
  // MODALLAR
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState({ amount: 0, desc: "" });
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockSearchTerm, setStockSearchTerm] = useState("");
  const [stockResults, setStockResults] = useState<any[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Nakit");
  const [isVisualDiagnosticOpen, setIsVisualDiagnosticOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const [warrantyDuration, setWarrantyDuration] = useState("6");
  const [warrantyScope, setWarrantyScope] = useState("");
  const [customScope, setCustomScope] = useState("");

  const [isWikiModalOpen, setIsWikiModalOpen] = useState(false);
  const [wikiSearchTerm, setWikiSearchTerm] = useState("");
  const [wikiResults, setWikiResults] = useState<any[]>([]);
  const [wikiViewMode, setWikiViewMode] = useState<'search' | 'add'>('search');
  const [newWikiEntry, setNewWikiEntry] = useState({ title: "", problem: "", solution: "" });

  const [usedParts, setUsedParts] = useState<any[]>([]); 
  const [timelineLogs, setTimelineLogs] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    id: 0, customerType: "Son Kullanıcı", customer: "", email: "", phone: "", address: "",
    category: "Cep Telefonu", device: "", serialNo: "", password: "",
    issue: "", privateNote: "", notes: "", 
    accessories: [], preCheck: [], finalCheck: [],
    status: "Bekliyor", price: 0, cost: 0, 
    payment_status: "unpaid",
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

  // CALLBACK KORUMALARI EKLENDİ
  const checkExpertise = useCallback(async (imei: string) => {
      if (!imei) { setExpertiseId(null); return; }
      const { data } = await supabase.from('aura_expertise').select('id').eq('serial_no', imei).single();
      if (data) setExpertiseId(data.id); else setExpertiseId(null);
  }, []);

  const fetchTimeline = useCallback(async (jobId: string) => {
      const { data } = await supabase.from('aura_timeline').select('*').eq('job_id', jobId).order('created_at', { ascending: false });
      if(data) setTimelineLogs(data);
  }, []);

  const fetchUsedParts = useCallback(async (jobId: string) => {
      // 1. Önce kullanılan parçaları servis tablosundan çek
      const { data: parts, error } = await supabase.from('aura_servis_parcalari').select('*').eq('job_id', String(jobId)); 
      
      if(error) { console.error("Parça çekme hatası:", error); return; }
      if(!parts || parts.length === 0) { setUsedParts([]); return; }

      // 2. Bu parçaların stok ID'lerini bir diziye topla
      const stokIds = parts.map(p => p.stok_id);

      // 3. Stok tablosundan bu ID'lere ait isimleri manuel olarak çek (Supabase relation hatasını bypass ediyoruz)
      const { data: stockData } = await supabase.from('aura_stok').select('id, urun_adi').in('id', stokIds);

      // 4. Verileri birleştir ve state'e at
      const enrichedParts = parts.map(part => {
          const stockItem = stockData?.find(s => s.id === part.stok_id);
          return {
              ...part,
              // Frontend'in beklediği formatta sahte bir relation (aura_stok) objesi oluşturuyoruz:
              aura_stok: { urun_adi: stockItem ? stockItem.urun_adi : 'Bilinmeyen Parça' }
          };
      });

      setUsedParts(enrichedParts);
  }, []);

  useEffect(() => {
      const init = async () => {
          const { data: { user } } = await supabase.auth.getUser(); if (user?.email) setCurrentUserEmail(user.email);
          const { data: dealers } = await supabase.from('bayi_basvurulari').select('*').eq('durum', 'Onaylandı'); if(dealers) setDealersList(dealers);

          const { data: upsells } = await supabase.from('aura_upsell_products').select('*').eq('is_active', true);
          if (upsells) {
              setAvailableServices(upsells.filter(u => SERVICE_CATEGORIES.includes(u.category) || u.category === 'Hizmet'));
              setAvailableProducts(upsells.filter(u => !SERVICE_CATEGORIES.includes(u.category) && u.category !== 'Hizmet'));
          }

          if (id === 'yeni') {
              setFormData((p:any) => ({ ...p, tracking_code: `SRV-${Math.floor(10000 + Math.random() * 90000)}` }));
              setLoading(false);
          } else {
              const { data } = await supabase.from('aura_jobs').select('*').eq('id', id).single();
              if (data) {
                  let cleanPrivateNote = "";
                  let visualParts = [];
                  if (data.private_note && data.private_note.includes("|||")) {
                      const parts = data.private_note.split("|||");
                      cleanPrivateNote = parts[0];
                      visualParts = parseArray(parts[1]);
                  } else if (data.private_note && data.private_note.startsWith("[")) {
                      visualParts = parseArray(data.private_note);
                      cleanPrivateNote = "";
                  } else {
                      cleanPrivateNote = data.private_note || "";
                  }

                  setFormData({
                      ...data,
                      price: Number(data.price), cost: Number(data.cost),
                      payment_status: data.payment_status || "unpaid",
                      accessories: parseArray(data.accessories), preCheck: parseArray(data.pre_checks),
                      finalCheck: parseArray(data.final_checks), images: parseArray(data.images),
                      recommended_upsells: parseArray(data.recommended_upsells), sold_upsells: parseArray(data.sold_upsells),
                      serialNo: data.serial_no || "",
                      notes: data.technician_note || "", 
                      privateNote: cleanPrivateNote, 
                      selectedVisualParts: visualParts 
                  });
                  if (data.serial_no) checkExpertise(data.serial_no);
                  fetchUsedParts(data.id);
                  fetchTimeline(data.id);
                  
                  if(data.warranty_duration) setWarrantyDuration(data.warranty_duration.replace(" Ay", ""));
                  if(data.warranty_scope) setWarrantyScope(data.warranty_scope);
              }
              setLoading(false);
          }
      };
      init();
  }, [id, checkExpertise, fetchUsedParts, fetchTimeline]);

  useEffect(() => {
      if (showScanner && isStockModalOpen) {
          const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
          scanner.render((decodedText: any) => {
              setStockSearchTerm(decodedText); scanner.clear(); setShowScanner(false);
              setTimeout(() => handleStockSearch(decodedText), 500); 
          }, (error: any) => { console.warn(error); });
          return () => { scanner.clear().catch((error: any) => console.error(error)); };
      }
  }, [showScanner, isStockModalOpen]);

  const handleDealerChange = (selectedDealerName: string) => {
      const dealer = dealersList.find(d => d.sirket_adi === selectedDealerName);
      if (dealer) setFormData({ ...formData, customer: dealer.sirket_adi, email: dealer.email, phone: dealer.telefon, address: dealer.adres });
      else setFormData({ ...formData, customer: selectedDealerName });
  };

  const logToTimeline = async (action: string, desc: string) => {
      if (id === 'yeni') return; 
      const now = new Date().toISOString();
      const newLog = { job_id: id, action_type: action, description: desc, created_by: currentUserEmail, created_at: now };
      setTimelineLogs(prev => [newLog, ...prev]);
      await supabase.from('aura_timeline').insert([newLog]);
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

      try {
          const { error: insertError } = await supabase.from('aura_servis_parcalari').insert([{ 
              job_id: id, 
              stok_id: part.id, 
              adet: 1, 
              alis_fiyati_anlik: part.alis_fiyati, 
              satis_fiyati_anlik: part.satis_fiyati 
          }]);
          if(insertError) throw insertError;

          await supabase.from('aura_stok').update({ stok_adedi: part.stok_adedi - 1 }).eq('id', part.id);
          
          const newCost = Number(formData.cost) + Number(part.alis_fiyati);
          const newPrice = Number(formData.price) + Number(part.satis_fiyati);
          
          await supabase.from('aura_jobs').update({ price: String(newPrice), cost: newCost }).eq('id', id);
          
          setFormData({ ...formData, price: newPrice, cost: newCost });
          logToTimeline("Parça Kullanıldı", `${part.urun_adi} stoktan düşüldü.`);
          
          await fetchUsedParts(id); 
          setIsStockModalOpen(false);
          alert("Parça eklendi!");

      } catch (err:any) {
          console.error(err);
          alert("Parça eklenirken hata oluştu: " + err.message);
      }
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

  const handleWikiSearch = async () => { 
      if (!wikiSearchTerm) return; 
      const { data } = await supabase.from('aura_wiki').select('*').ilike('title', `%${wikiSearchTerm}%`).limit(5); 
      setWikiResults(data || []); 
  };

  const handleAddToWiki = async () => {
      if (!newWikiEntry.title || !newWikiEntry.solution) { alert("Başlık ve Çözüm alanları zorunludur."); return; }
      const { error } = await supabase.from('aura_wiki').insert([{ title: newWikiEntry.title, device_category: formData.category, problem_desc: newWikiEntry.problem, solution_steps: newWikiEntry.solution, author: currentUserEmail }]);
      if (!error) { alert("Çözüm kütüphaneye eklendi!"); setWikiViewMode('search'); setWikiSearchTerm(newWikiEntry.title); handleWikiSearch(); } else { alert("Hata: " + error.message); }
  };
  
  const applyWikiSolution = (solution: string) => { 
      setFormData({ ...formData, notes: (formData.notes ? formData.notes + "\n\n" : "") + "📚 WIKI ÇÖZÜMÜ:\n" + solution }); 
      setIsWikiModalOpen(false); 
      logToTimeline("Wiki Kullanıldı", "Arıza kütüphanesinden çözüm uygulandı."); 
  };

  const toggleUpsell = (item: any) => {
      const isSold = formData.sold_upsells?.some((i:any) => i.id == item.id);
      if (isSold) { alert("Bu ürün zaten satıldı."); return; }
      const currentRec = Array.isArray(formData.recommended_upsells) ? [...formData.recommended_upsells] : [];
      const isRec = currentRec.some((i:any) => i.id == item.id);
      let newRec;
      if (isRec) { newRec = currentRec.filter((i:any) => i.id != item.id); } 
      else { newRec = [...currentRec, item]; }
      setFormData({...formData, recommended_upsells: newRec});
  };

  const generateCorporateReport = () => {
      const parts = usedParts.map(p => p.aura_stok?.urun_adi).join(", ");
      const upsells = Array.isArray(formData.sold_upsells) ? formData.sold_upsells.map((u:any) => typeof u === 'object' ? u.name : u).join(", ") : "";
      
      let report = `Sayın *${formData.customer}*,\n\n`;
      report += `Teknik servisimize *${formData.tracking_code}* referans numarası ile kabul edilen *${formData.device}* cihazınızın işlemleri tamamlanmıştır.\n\n`;
      if (usedParts.length > 0) report += `🔧 *Yapılan Teknik Müdahaleler:*\n${parts}\n\n`;
      if (upsells.length > 0) report += `✨ *Ek Hizmetler:*\n${upsells}\n\n`;
      report += `📝 *Teknisyen Notu:*\n${formData.notes || "Genel bakım yapıldı."}\n\n`;
      report += `🛡️ *Garanti:* ${warrantyDuration} Ay (${warrantyScope || "Genel Kapsam"})\n`;
      report += `💰 *Toplam Tutar:* ${formData.price} TL\n\n`;
      report += `Cihazınızı servisimizden teslim alabilirsiniz.\n\n*Aura Bilişim Teknik Servis*`;
      return report;
  };

  const sendWhatsAppMessage = () => {
      let cleanPhone = (formData.phone || "").replace(/\D/g, ''); 
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1); 
      if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone; 
      const message = generateCorporateReport();
      logToTimeline("WhatsApp Mesajı", "Müşteriye kurumsal durum bildirimi gönderildi."); 
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank"); 
  };

  const handlePaymentAndComplete = async () => {
      setLoading(true);
      if (Number(formData.price) > 0) {
          await supabase.from('aura_finans').insert([{ 
              tur: 'Gelir', kategori: 'Servis Hizmeti', tutar: Number(formData.price), 
              odeme_yontemi: paymentMethod, 
              aciklama: `${formData.tracking_code} - ${formData.customer} Servis Ücreti`, 
              tarih: new Date().toISOString().split('T')[0] 
          }]);
      }
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + parseInt(warrantyDuration));
      const maintenanceDate = new Date();
      maintenanceDate.setMonth(maintenanceDate.getMonth() + 6);
      let finalScope = warrantyScope;
      if (warrantyScope === 'custom') finalScope = customScope;
      if (!finalScope && usedParts.length > 0) finalScope = usedParts.map(p => p.aura_stok?.urun_adi).join(", ");
      if (!finalScope) finalScope = "Genel İşçilik";

      await supabase.from('aura_jobs').update({ 
          status: 'Teslim Edildi', payment_status: 'paid', updated_at: new Date().toISOString(), 
          next_maintenance_date: maintenanceDate.toISOString().split('T')[0],
          warranty_duration: `${warrantyDuration} Ay`, warranty_scope: finalScope, warranty_end_date: endDate.toISOString().split('T')[0]
      }).eq('id', id);

      logToTimeline("Teslimat", `Cihaz teslim edildi. ${warrantyDuration} Ay garanti tanımlandı. Ödeme alındı.`);
      setFormData({...formData, status: 'Teslim Edildi', payment_status: 'paid'});
      setIsPaymentModalOpen(false); 
      setLoading(false); 
      alert("İşlem tamamlandı! Garanti başlatıldı.");
      if(confirm("Müşteriye garanti mesajı gönderilsin mi?")) sendWhatsAppMessage();
  };

  const handleSave = async () => {
    if (!formData.customer) { alert("Müşteri adı zorunlu!"); return; }
    setLoading(true);
    
    // GÜVENLİK YAMASI: Numara sadece kayıt yepyeni ise ve tam veritabanına giderken oluşturulur.
    const finalTrackingCode = formData.tracking_code || `SRV-${Math.floor(10000 + Math.random() * 90000)}`;
    const combinedPrivateNote = (formData.privateNote || "") + "|||" + JSON.stringify(formData.selectedVisualParts || []);

    const payload = {
        customer: formData.customer,
        email: formData.email, 
        phone: formData.phone, 
        address: formData.address, 
        customer_type: formData.customerType,
        device: formData.device, 
        category: formData.category,
        serial_no: formData.serialNo, 
        password: formData.password,
        issue: formData.issue, 
        technician_note: formData.notes,
        private_note: combinedPrivateNote,
        status: formData.status, 
        price: String(formData.price), 
        cost: Number(formData.cost), 
        tracking_code: formData.tracking_code || `SRV-${Math.floor(10000 + Math.random() * 90000)}`,
        payment_status: formData.payment_status,
        accessories: JSON.stringify(formData.accessories), 
        pre_checks: JSON.stringify(formData.preCheck), 
        final_checks: JSON.stringify(formData.finalCheck), 
        images: JSON.stringify(formData.images), 
        recommended_upsells: JSON.stringify(formData.recommended_upsells), 
        sold_upsells: JSON.stringify(formData.sold_upsells),
        tip_id: formData.tip_id, 
        approval_status: formData.approval_status, 
        approval_amount: String(formData.approval_amount), 
        approval_desc: formData.approval_desc, 
        updated_at: new Date().toISOString()
    };
    
    let res;
    if (id === 'yeni') res = await supabase.from('aura_jobs').insert([payload]).select();
    else { res = await supabase.from('aura_jobs').update(payload).eq('id', id); logToTimeline("Kayıt Güncellendi", `Durum: ${formData.status}`); }
    
    setLoading(false);
    if (!res.error) { 
        alert("Kaydedildi!"); 
        if (id === 'yeni' && res.data) router.push(`/epanel/atolye/${res.data[0].id}`); 
    } else { 
        console.error(res.error); 
        alert("Hata: " + res.error.message); 
    }
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
  
  const handleDelete = async () => { 
      if(!confirm("DİKKAT: Bu kayıt silinecek. Emin misiniz?")) return; 
      setLoading(true); 
      try {
          await supabase.from('aura_servis_parcalari').delete().eq('job_id', id);
          await supabase.from('aura_timeline').delete().eq('job_id', id);
          const { error } = await supabase.from('aura_jobs').delete().eq('id', id);
          if (error) throw error;
          alert("Kayıt silindi."); router.push('/epanel/atolye'); 
      } catch (err: any) { alert("Hata: " + err.message); setLoading(false); }
  };

  const toggleArrayItem = (field: string, item: string) => { setFormData((prev: any) => { const current = Array.isArray(prev[field]) ? prev[field] : []; const updated = current.includes(item) ? current.filter((i: string) => i !== item) : [...current, item]; return { ...prev, [field]: updated }; }); };

  const catInfo = getCategoryInfo(formData.category);
  const totalPartsCost = usedParts.reduce((acc, part) => acc + (Number(part.satis_fiyati_anlik) * Number(part.adet)), 0);
  const totalUpsellsCost = Array.isArray(formData.sold_upsells) ? formData.sold_upsells.reduce((acc:any, item:any) => acc + (Number(item.price)||0), 0) : 0;
  const laborCost = Math.max(Number(formData.price) - totalPartsCost - totalUpsellsCost, 0);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://aurabilisim.net/cihaz-sorgula?takip=${formData.tracking_code}`)}`;

  if (loading) return <div className="p-20 text-white text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 font-sans relative">
       {/* HEADER */}
       <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-800 pb-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur-md z-50 gap-4 print:hidden">
           <div className="flex items-center gap-4">
               <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 font-bold text-sm"><ArrowLeft size={18}/> GERİ DÖN</button>
               <h1 className="text-xl font-black text-white">SERVİS <span className="text-cyan-500">#{formData.tracking_code || "YENİ"}</span></h1>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
               <button onClick={sendWhatsAppMessage} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-sm shadow-lg active:scale-95"><MessageCircle size={18}/> WP</button>
               <button onClick={() => window.print()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 text-white font-bold text-sm active:scale-95"><Printer size={18}/> YAZDIR</button>
               {formData.status !== 'Teslim Edildi' && id !== 'yeni' && (<button onClick={() => setIsPaymentModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-bold text-sm shadow-lg active:scale-95"><CheckCircle2 size={18}/> TESLİM ET</button>)}
               {id !== 'yeni' && (<button onClick={handleDelete} className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg font-bold"><Trash2 size={18}/></button>)}
               <button onClick={handleSave} className="px-6 py-2 bg-cyan-600 rounded-lg font-bold text-white shadow-lg"><Save size={18}/> KAYDET</button>
           </div>
       </div>

       <div className="grid grid-cols-12 gap-6 print:hidden">
           {/* SOL KOLON */}
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
                           
                           <select value={formData.payment_status} onChange={e => setFormData((p:any)=>({...p, payment_status: e.target.value}))} className={`w-full border rounded-lg p-2.5 text-sm font-bold outline-none ${formData.payment_status === 'paid' ? 'bg-emerald-900/30 border-emerald-700 text-emerald-400' : 'bg-red-900/30 border-red-700 text-red-400'}`}>
                               <option value="unpaid">Ödenmedi ❌</option>
                               <option value="paid">Ödendi ✅</option>
                           </select>

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
               
               {/* --- UPSELL & HİZMETLER --- */}
               <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                   <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ShoppingBag size={14} className="text-pink-500"/> Fırsat & Hizmet Ekle</h3>
                   <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                       {availableServices.length > 0 && (
                           <div>
                               <div className="text-[9px] font-bold text-purple-400 mb-2 border-b border-slate-800 pb-1">EK HİZMETLER</div>
                               <div className="grid grid-cols-1 gap-2">
                                   {availableServices.map((item:any) => {
                                       const isSold = formData.sold_upsells?.some((i:any) => i.id == item.id);
                                       const isRecommended = formData.recommended_upsells?.some((i:any) => i.id == item.id);
                                       return (
                                           <button key={item.id} onClick={() => toggleUpsell(item)} className={`w-full flex justify-between items-center p-2 rounded border transition-all text-xs ${isSold ? 'bg-green-600 border-green-500 text-white shadow-lg cursor-not-allowed' : isRecommended ? 'bg-purple-900/40 border-purple-500 text-purple-300' : 'bg-[#0b0e14] border-slate-700 text-slate-400 hover:border-purple-500/50'}`}>
                                               <div className="flex items-center gap-2">{isSold ? <CheckCircle2 size={14}/> : <ShieldCheck size={12}/>} {item.name}</div>
                                               <span className="font-bold">{isSold ? 'SATILDI' : (isRecommended ? 'ÖNERİLDİ' : `${item.price}₺`)}</span>
                                           </button>
                                       )
                                   })}
                               </div>
                           </div>
                       )}
                       {availableProducts.length > 0 && (
                           <div className="mt-4">
                               <div className="text-[9px] font-bold text-cyan-400 mb-2 border-b border-slate-800 pb-1">AKSESUAR & ÜRÜN</div>
                               <div className="grid grid-cols-1 gap-2">
                                   {availableProducts.map((item:any) => {
                                       const isSold = formData.sold_upsells?.some((i:any) => i.id == item.id);
                                       const isRecommended = formData.recommended_upsells?.some((i:any) => i.id == item.id);
                                       return (
                                           <button key={item.id} onClick={() => toggleUpsell(item)} className={`w-full flex justify-between items-center p-2 rounded border transition-all text-xs ${isSold ? 'bg-green-600 border-green-500 text-white shadow-lg cursor-not-allowed' : isRecommended ? 'bg-cyan-900/40 border-cyan-500 text-cyan-300' : 'bg-[#0b0e14] border-slate-700 text-slate-400 hover:border-cyan-500/50'}`}>
                                               <div className="flex items-center gap-2">{isSold ? <CheckCircle2 size={14}/> : <Package size={12}/>} {item.name}</div>
                                               <span className="font-bold">{isSold ? 'SATILDI' : (isRecommended ? 'ÖNERİLDİ' : `${item.price}₺`)}</span>
                                           </button>
                                       )
                                   })}
                               </div>
                           </div>
                       )}
                   </div>
               </div>
           </div>

           {/* ORTA: CİHAZ & İŞLEM */}
           <div className="col-span-12 lg:col-span-5 space-y-6">
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                             <div className="flex-1"><label className="text-[10px] text-slate-500 font-bold ml-1">KATEGORİ</label><select value={formData.category} onChange={e => handleCategoryChange(e.target.value)} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm font-bold text-white outline-none focus:border-cyan-500">{Object.keys(CATEGORY_DATA).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                             <div className="flex-1"><label className="text-[10px] text-slate-500 font-bold ml-1">MARKA / MODEL</label><input type="text" value={formData.device} onChange={e => setFormData((p:any)=>({...p, device: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm font-bold text-white outline-none focus:border-cyan-500" placeholder="Model"/></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4"><div className="relative"><input type="text" value={formData.serialNo} onChange={e => { const val = e.target.value; setFormData((p:any)=>({...p, serialNo: val})); checkExpertise(val); }} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm font-mono uppercase outline-none focus:border-cyan-500" placeholder="IMEI / SERİ NO"/>{(formData.serialNo || "").length > 5 && (<div className="absolute right-1 top-1 bottom-1">{expertiseId ? (<button onClick={() => router.push(`/epanel/ekspertiz/detay/${expertiseId}`)} className="h-full px-3 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-lg hover:scale-105 transition-transform"><FileText size={12}/> RAPOR VAR</button>) : (<button onClick={() => router.push(`/epanel/ekspertiz?yeni=${formData.serialNo}`)} className="h-full px-3 bg-slate-700 hover:bg-blue-600 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-lg hover:scale-105 transition-transform"><PlusCircle size={12}/> RAPOR EKLE</button>)}</div>)}</div><input type="text" value={formData.password} onChange={e => setFormData((p:any)=>({...p, password: e.target.value}))} className="w-full bg-[#0b0e14] border border-red-900/30 text-red-400 rounded-lg p-3 font-bold outline-none focus:border-red-500" placeholder="Şifre"/></div>
                        <div><div className="flex justify-between items-center mb-1 ml-1"><label className="text-[10px] text-slate-500 font-bold">ŞİKAYET / ARIZA</label><button onClick={() => { setIsWikiModalOpen(true); setWikiSearchTerm(formData.device); handleWikiSearch(); }} className="text-[10px] flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/30"><Book size={10}/> Wiki'de Ara</button></div><textarea value={formData.issue} onChange={e => setFormData((p:any)=>({...p, issue: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm h-24 outline-none resize-none focus:border-cyan-500" placeholder="Arıza detayını giriniz..."></textarea></div>
                        <div className="bg-black/20 p-3 rounded-xl border border-slate-800"><label className="text-[10px] text-cyan-500 font-bold uppercase mb-2 block">Teslim Alınanlar</label><div className="flex flex-wrap gap-2">{catInfo.accessories.map((acc: string) => { const accArray = Array.isArray(formData.accessories) ? formData.accessories : []; const isSelected = accArray.includes(acc); return (<button key={acc} onClick={() => toggleArrayItem("accessories", acc)} className={`px-2 py-1 rounded border text-[10px] font-bold transition-all ${isSelected ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400 scale-105' : 'bg-[#0b0e14] border-slate-500 hover:border-slate-600'}`}>{acc}</button>); })}</div></div>
                        <button onClick={() => setIsVisualDiagnosticOpen(true)} className="w-full mt-2 py-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/50 rounded-lg font-bold text-sm flex justify-center items-center gap-2 transition-all shadow-lg"><Monitor size={18}/> GÖRSEL TEŞHİS BAŞLAT</button>
                    </div>
                </div>

                {/* --- GELİŞMİŞ ÖN KONTROL --- */}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-4"><h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={14} className="text-orange-500"/> Ön Kontrol (Giriş)</h3><span className="text-[9px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700">{formData.category}</span></div>
                    <div className="flex flex-wrap gap-2">
                        {catInfo.preChecks.map((item: string) => { const preArray = Array.isArray(formData.preCheck) ? formData.preCheck : []; const isSelected = preArray.includes(item); return (<button key={item} onClick={() => toggleArrayItem("preCheck", item)} className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-[10px] font-bold transition-all group ${isSelected ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-[#0b0e14] border-slate-800 text-slate-500 hover:border-slate-600'}`}><div className={`w-3 h-3 rounded flex items-center justify-center border transition-all ${isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-slate-600 group-hover:border-slate-500'}`}>{isSelected && <X size={8} strokeWidth={4}/>}</div>{item}</button>); })}
                    </div>
                </div>

                {id !== 'yeni' && (
                    <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><PackageMinus size={14} className="text-yellow-500"/> Parça / İşçilik</h3><div className="flex gap-2"><button onClick={() => { setIsStockModalOpen(true); setShowScanner(true); }} className="text-[10px] bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-lg"><ScanLine size={12}/> BARKOD</button><button onClick={() => setIsStockModalOpen(true)} className="text-[10px] bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-lg"><Plus size={12}/> EKLE</button></div></div>
                        <div className="space-y-2">{usedParts.length > 0 ? usedParts.map((part) => (<div key={part.id} className="flex justify-between items-center bg-[#0b0e14] border border-slate-800 p-2.5 rounded-lg group"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-xs">{part.adet}x</div><div><p className="text-xs font-bold text-white">{part.aura_stok?.urun_adi}</p><p className="text-[10px] text-slate-500">Mal: {(part.alis_fiyati_anlik * part.adet)}₺ • Sat: {(part.satis_fiyati_anlik * part.adet)}₺</p></div></div><button onClick={() => removePartFromJob(part.id, part.stok_id, part.alis_fiyati_anlik, part.satis_fiyati_anlik, part.adet)} className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button></div>)) : (<div className="text-center text-[10px] text-slate-600 border border-dashed border-slate-800 p-4 rounded-lg">Henüz parça eklenmedi.</div>)}</div>
                    </div>
                )}
           </div>

           {/* SAĞ: NOTLAR & KONTROL */}
           <div className="col-span-12 lg:col-span-4 space-y-6">
                {id !== 'yeni' && (
                    <div className="bg-[#151921] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col max-h-[300px]">
                        <div className="p-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center"><h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-emerald-500"/> Canlı Akış</h3><span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20">LOGLAR</span></div>
                        <div className="overflow-y-auto custom-scrollbar p-3 space-y-3">{timelineLogs.length > 0 ? timelineLogs.map((log: any) => (<div key={log.id} className="flex gap-3 text-xs"><div className="flex flex-col items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5"></div><div className="w-px h-full bg-slate-800"></div></div><div className="pb-2"><p className="text-slate-300 font-bold">{log.action_type}</p><p className="text-slate-500 text-[10px] leading-tight">{log.description}</p><div className="flex gap-2 mt-1"><span className="text-[9px] text-slate-600">{new Date(log.created_at).toLocaleString('tr-TR')}</span><span className="text-[9px] text-cyan-900/70">{log.created_by?.split('@')[0]}</span></div></div></div>)) : <div className="text-center text-[10px] text-slate-600 py-4">Henüz kayıt yok.</div>}</div>
                    </div>
                )}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="bg-[#0b0e14] border border-slate-800 border-b-0 rounded-t-lg px-4 py-2 flex justify-between items-center"><span className="font-bold text-sm uppercase text-slate-300">Yapılan İşlemler (Rapor)</span></div>
                    <textarea value={formData.notes} onChange={e => setFormData((p:any)=>({...p, notes: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-800 text-slate-300 text-sm h-32 p-3 outline-none resize-none rounded-b-lg" placeholder="Teknisyen notu..."></textarea>
                    {formData.sold_upsells?.length > 0 && <div className="mt-3 p-3 bg-black/20 rounded border border-slate-800"><div className="text-[10px] font-bold text-slate-500 mb-2">EKLENEN HİZMETLER</div><div className="space-y-1">{formData.sold_upsells.map((u:any, i:number) => <div key={i} className="text-xs text-white flex justify-between"><span>{u.name}</span><span className="font-bold">{u.price}₺</span></div>)}</div></div>}
                </div>

                {/* --- GELİŞTİRİLMİŞ KALİTE KONTROL --- */}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ClipboardCheck size={14} className="text-green-500"/> Kalite Kontrol (Çıkış)</h3>
                    <div className="flex flex-wrap gap-2">
                        {catInfo.finalChecks.map((item: string) => {
                            const finalArray = Array.isArray(formData.finalCheck) ? formData.finalCheck : [];
                            const isSelected = finalArray.includes(item);
                            return (
                                <button key={item} onClick={() => toggleArrayItem("finalCheck", item)} className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-bold text-left transition-all group ${isSelected ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-[#0b0e14] border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                                    <div className={`w-3 h-3 rounded flex items-center justify-center border transition-all ${isSelected ? 'bg-green-600 border-green-600 text-white' : 'border-slate-600 group-hover:border-slate-500'}`}>
                                        {isSelected && <Check size={8} strokeWidth={4}/>}
                                    </div>
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Camera size={14} className="text-cyan-500"/> Fotoğraflar</h3>
                    <label className={`cursor-pointer w-full text-[10px] bg-[#0b0e14] hover:bg-slate-900 border border-slate-700 border-dashed py-3 rounded-lg text-slate-400 font-bold transition-all flex items-center justify-center gap-2 ${uploading ? 'opacity-50' : ''}`}>
                        <Upload size={14}/> {uploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
                        <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading}/>
                    </label>
                    {Array.isArray(formData.images) && formData.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {formData.images.map((img:string, i:number)=>(<div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-700"><img src={img} className="w-full h-full object-cover"/><button onClick={() => setFormData((prev:any)=>{ const ni=[...prev.images]; ni.splice(i,1); return {...prev, images:ni} })} className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"><X size={10}/></button></div>))}
                        </div>
                    )}
                </div>
           </div>
       </div>

       {/* MODALLAR */}
       {isPaymentModalOpen && (
            <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in zoom-in-95">
                <div className="bg-[#1e293b] rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-6 bg-slate-900 border-b border-slate-700 text-center">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]"><ShieldCheck size={32} className="text-emerald-400"/></div>
                        <h3 className="text-xl font-black text-white">Teslimat & Garanti</h3>
                        <p className="text-slate-400 text-xs mt-1">Ödeme alınacak ve garanti süreci başlayacaktır.</p>
                    </div>
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">TAHSİLAT TUTARI</label>
                            <div className="text-3xl font-black text-white bg-[#0b0e14] p-4 rounded-xl border border-slate-700 text-center">{formData.price.toLocaleString('tr-TR')} ₺</div>
                            <div className="grid grid-cols-2 gap-2 mt-3">{['Nakit', 'Kredi Kartı', 'Havale / EFT', 'Cari'].map((m) => (<button key={m} onClick={() => setPaymentMethod(m)} className={`p-2 rounded-lg text-xs font-bold transition-all border ${paymentMethod === m ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-[#0b0e14] border-slate-700 text-slate-400'}`}>{m}</button>))}</div>
                        </div>
                        <div className="h-px bg-slate-700/50"></div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><ShieldCheck size={12}/> GARANTİ SÜRESİ</label>
                            <div className="grid grid-cols-4 gap-2 mb-4">{['0', '3', '6', '12'].map((m) => (<button key={m} onClick={() => setWarrantyDuration(m)} className={`p-2 rounded-lg text-xs font-bold border transition-all ${warrantyDuration === m ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-[#0b0e14] border-slate-700 text-slate-400'}`}>{m === '0' ? 'YOK' : `${m} AY`}</button>))}</div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">KAPSAM</label>
                            <select className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-sm text-white outline-none mb-2" onChange={(e) => setWarrantyScope(e.target.value)}><option value="">Otomatik (Değişen Parçalar)</option><option value="Tüm Cihaz (Full)">Tüm Cihaz (Full Kapsam)</option><option value="Sadece İşçilik">Sadece İşçilik</option><option value="custom">Özel Yaz...</option></select>
                            {warrantyScope === 'custom' && (<input type="text" placeholder="Örn: Ekran ve Batarya hariç..." className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" onChange={(e) => setCustomScope(e.target.value)}/>)}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900 border-t border-slate-700 flex gap-3">
                        <button onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 font-bold text-sm hover:bg-slate-800">İPTAL</button>
                        <button onClick={handlePaymentAndComplete} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm shadow-lg">ONAYLA & BİTİR</button>
                    </div>
                </div>
            </div>
        )}
       {isStockModalOpen && (<div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-[#1e293b] rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"><div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center"><h3 className="text-white font-bold flex items-center gap-2"><Box size={18} className="text-yellow-400"/> STOKTAN PARÇA SEÇ</h3><button onClick={() => { setIsStockModalOpen(false); setShowScanner(false); }}><X size={20} className="text-slate-400 hover:text-white"/></button></div><div className="p-4 bg-[#0b0e14]"><div className="relative"><input type="text" value={stockSearchTerm} onChange={(e) => { setStockSearchTerm(e.target.value); if(e.target.value.length>1) handleStockSearch(); }} className="w-full bg-[#151921] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-yellow-500" placeholder="Parça ara veya barkod okut..." autoFocus/><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/></div>{showScanner && (<div className="mt-4 border-2 border-dashed border-slate-700 rounded-xl p-2 bg-black"><div id="reader" className="w-full"></div><p className="text-center text-xs text-slate-500 mt-2">Kameraya barkodu gösterin...</p></div>)}</div><div className="flex-1 overflow-y-auto p-2 space-y-1">{stockResults.map((part) => (<button key={part.id} onClick={() => addPartToJob(part)} className="w-full flex justify-between items-center p-3 hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700 transition-all group text-left"><div><p className="text-sm font-bold text-white group-hover:text-yellow-400">{part.urun_adi}</p><p className="text-[10px] text-slate-500">{part.kategori} • Stok: {part.stok_adedi}</p></div><div className="text-right"><p className="text-xs font-bold text-slate-300">{part.satis_fiyati}₺</p></div></button>))}</div></div></div>)}
       {approvalModalOpen && (<div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-[#1e293b] p-6 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Zap size={18} className="text-purple-500"/> Ekstra İşlem Onayı</h3><input type="number" onChange={(e)=>setApprovalData({...approvalData,amount:Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mb-3 text-white font-bold" placeholder="Tutar"/><textarea onChange={(e)=>setApprovalData({...approvalData,desc:e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mb-4 text-white h-24 text-sm resize-none" placeholder="Açıklama..."></textarea><div className="flex gap-2"><button onClick={()=>setApprovalModalOpen(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg text-xs font-bold text-slate-300">İPTAL</button><button onClick={sendApprovalRequest} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-lg text-xs font-bold text-white shadow-lg">GÖNDER</button></div></div></div>)}
       {isWikiModalOpen && (<div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-[#1e293b] rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[80vh]"><div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center"><h3 className="text-white font-bold flex items-center gap-2"><Book size={18} className="text-purple-400"/> AURA WIKI</h3><button onClick={() => setIsWikiModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white"/></button></div>{wikiViewMode==='search'?(<div className="p-6 flex-1 overflow-y-auto"><div className="relative mb-6"><input type="text" value={wikiSearchTerm} onChange={(e)=>setWikiSearchTerm(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleWikiSearch()} className="w-full bg-[#0b0e14] border border-slate-600 rounded-xl py-3 pl-11 pr-4 text-white focus:border-purple-500 outline-none" placeholder="Arıza ara..."/><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/><button onClick={handleWikiSearch} className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">ARA</button></div>{wikiResults.length>0?(<div className="space-y-3">{wikiResults.map((res:any)=>(<div key={res.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:bg-slate-800 transition-colors"><div className="flex justify-between items-start mb-2"><h4 className="text-purple-400 font-bold text-sm">{res.title}</h4><button onClick={()=>applyWikiSolution(res.solution_steps)} className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded font-bold">UYGULA</button></div><p className="text-slate-400 text-xs mb-2 line-clamp-2">{res.problem_desc}</p></div>))}</div>):(<div className="text-center py-10"><Book size={40} className="text-slate-700 mx-auto mb-3"/><p className="text-slate-400 font-bold">Sonuç Bulunamadı</p><button onClick={()=>{setWikiViewMode('add');setNewWikiEntry({...newWikiEntry,title:wikiSearchTerm,problem:formData.issue});}} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 mx-auto"><Plus size={14}/> YENİ EKLE</button></div>)}</div>):(<div className="p-6 flex-1 overflow-y-auto space-y-4"><div className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer hover:text-white mb-2" onClick={()=>setWikiViewMode('search')}><ArrowLeft size={14}/> Geri</div><div><label className="text-[10px] font-bold text-slate-500 mb-1 block">BAŞLIK</label><input type="text" value={newWikiEntry.title} onChange={(e)=>setNewWikiEntry({...newWikiEntry,title:e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-2.5 text-white text-sm"/></div><div><label className="text-[10px] font-bold text-slate-500 mb-1 block">SORUN</label><textarea value={newWikiEntry.problem} onChange={(e)=>setNewWikiEntry({...newWikiEntry,problem:e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-2.5 text-white text-sm h-20 resize-none"/></div><div><label className="text-[10px] font-bold text-slate-500 mb-1 block">ÇÖZÜM</label><textarea value={newWikiEntry.solution} onChange={(e)=>setNewWikiEntry({...newWikiEntry,solution:e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-2.5 text-white text-sm h-40 resize-none"/></div><button onClick={handleAddToWiki} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg">KAYDET</button></div>)}</div></div>)}
       {isVisualDiagnosticOpen && (
            <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-lg animate-in zoom-in-95">
                <div className="bg-[#0f172a] w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
                    <button onClick={() => setIsVisualDiagnosticOpen(false)} className="absolute top-6 right-6 text-white z-50 hover:bg-slate-800 p-2 rounded-full transition-all"><X size={24}/></button>
                    <div className="flex-1 relative flex items-center justify-center bg-slate-900 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(#1e293b_1px,transparent_1px),linear-gradient(90deg,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                        <div className="relative z-10 w-[360px] h-[720px] scale-90 md:scale-100 transition-all">
                            <div className="absolute inset-0 border-8 border-slate-700 rounded-[3.5rem] bg-slate-950 shadow-2xl"></div>
                            <svg viewBox="0 0 300 600" className="absolute inset-0 w-full h-full z-10 overflow-visible p-4">
                                <defs>
                                    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="4" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                {DEVICE_PARTS_SVG.map((part) => {
                                    const isSelected = formData.selectedVisualParts?.find((p:any) => p.id === part.id);
                                    const fillColor = isSelected ? (isSelected.type === 'degisim' ? '#ef4444' : '#eab308') : (part.baseColor || '#334155');
                                    const strokeColor = isSelected ? 'white' : '#475569';
                                    const opacity = isSelected ? 1 : 0.8;
                                    const filter = isSelected ? "url(#neonGlow)" : "none";
                                    return (
                                        <g key={part.id} onClick={() => handleVisualPartClick(part.id)} className="cursor-pointer hover:opacity-100 transition-all duration-200 group/part">
                                            <path d={part.path} fill={fillColor} stroke={strokeColor} strokeWidth="2" fillRule={part.fillRule as any || "nonzero"} style={{ opacity, filter }} className="transition-all duration-200" />
                                            <text x={part.id === 'battery' ? 75 : (part.id === 'motherboard' ? 215 : 150)} y={part.id === 'battery' ? 300 : (part.id === 'motherboard' ? 170 : (part.id === 'charging' ? 565 : (part.id === 'taptic' ? 505 : (part.id === 'speaker' ? 505 : (part.id === 'camera_back' ? 85 : 35)))))} textAnchor="middle" fontSize="10" fill="white" className={`font-bold uppercase tracking-wider pointer-events-none select-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover/part:opacity-100'} transition-opacity`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{part.name}</text>
                                            <foreignObject x={part.id === 'battery' ? 65 : (part.id === 'motherboard' ? 205 : 140)} y={part.id === 'battery' ? 270 : (part.id === 'motherboard' ? 140 : (part.id === 'charging' ? 545 : (part.id === 'taptic' ? 485 : (part.id === 'speaker' ? 485 : (part.id === 'camera_back' ? 65 : 15)))))} width="20" height="20">
                                                <div className={`flex justify-center items-center w-full h-full text-white/50 ${isSelected ? 'text-white' : ''}`}><part.icon size={20}/></div>
                                            </foreignObject>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 shadow-lg"><div className="w-3 h-3 rounded bg-[#ef4444] shadow-[0_0_8px_#ef4444]"></div><span className="text-xs text-white font-bold">DEĞİŞİM (KIRMIZI)</span></div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 shadow-lg"><div className="w-3 h-3 rounded bg-[#eab308] shadow-[0_0_8px_#eab308]"></div><span className="text-xs text-white font-bold">ONARIM (SARI)</span></div>
                        </div>
                    </div>
                    <div className="w-full md:w-96 bg-[#0f172a] border-l border-slate-800 p-8 flex flex-col shadow-xl z-20">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                            <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><Activity size={24}/></div>
                            <div><h2 className="text-white font-bold text-lg leading-tight">ARIZA TESPİT</h2><p className="text-slate-400 text-xs">Parçaları seçerek işlem ekleyin.</p></div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 mb-6 custom-scrollbar pr-2">
                            {(!formData.selectedVisualParts || formData.selectedVisualParts.length === 0) && (<div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500"><ScanLine size={32} className="mb-2 opacity-50"/><span className="text-xs">Sol taraftan parça seçiniz.</span></div>)}
                            {formData.selectedVisualParts?.map((part: any, i:number) => (
                                <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-slate-600 transition-colors">
                                    <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${part.type === 'degisim' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}><part.icon size={18}/></div><div><div className="text-white font-bold text-sm">{part.name}</div><div className="text-[10px] text-slate-400 uppercase font-bold">{part.type}</div></div></div>
                                    <div className="text-right"><div className="text-white font-mono font-bold">{part.finalPrice}₺</div><button onClick={() => handleVisualPartClick(part.id)} className="text-[10px] text-red-400 hover:text-red-300 underline decoration-red-400/30">İptal</button></div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                            <div className="flex justify-between items-center mb-4"><span className="text-slate-400 text-xs font-bold uppercase">Tahmini Tutar</span><span className="text-2xl font-black text-white">{formData.price}₺</span></div>
                            <button onClick={() => setIsVisualDiagnosticOpen(false)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">ONAYLA VE KAYDET</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

       {/* YAZDIRMA ALANI */}
       <div id="printable-area" className="hidden bg-white text-black font-sans">
            <div className="w-full h-full p-8 box-border flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                        <div className="flex items-center gap-4"><img src="/image/aura-logo.png" className="h-16 w-auto object-contain"/><div><h1 className="text-3xl font-black text-cyan-700 leading-none">AURA BİLİŞİM</h1><p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">TEKNOLOJİ SERVİS MERKEZİ</p><p className="text-[10px] text-slate-500 mt-1">www.aurabilisim.net • 0850 123 45 67</p></div></div>
                        <div className="text-right"><h2 className="text-2xl font-bold text-black uppercase tracking-tight">SERVİS FORMU</h2><div className="mt-2 text-right"><div className="text-sm font-bold bg-slate-100 px-3 py-1 rounded inline-block border border-slate-300">NO: <span className="font-black text-black">{formData.tracking_code}</span></div><div className="text-xs text-slate-600 mt-1">{new Date().toLocaleDateString('tr-TR')}</div></div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 text-sm"><h3 className="font-bold border-b border-slate-300 mb-2 pb-1 text-xs uppercase text-slate-700">MÜŞTERİ BİLGİLERİ</h3><table className="w-full text-xs"><tbody><tr><td className="font-bold text-slate-600 w-24 py-0.5">Ad Soyad:</td><td>{formData.customer}</td></tr><tr><td className="font-bold text-slate-600 py-0.5">Telefon:</td><td>{formData.phone}</td></tr><tr><td className="font-bold text-slate-600 py-0.5 align-top">Adres:</td><td>{formData.address || "-"}</td></tr></tbody></table></div>
                        <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 text-sm"><h3 className="font-bold border-b border-slate-300 mb-2 pb-1 text-xs uppercase text-slate-700">CİHAZ BİLGİLERİ</h3><table className="w-full text-xs"><tbody><tr><td className="font-bold text-slate-600 w-24 py-0.5">Cihaz:</td><td>{formData.device}</td></tr><tr><td className="font-bold text-slate-600 py-0.5">Seri / IMEI:</td><td>{formData.serialNo}</td></tr><tr><td className="font-bold text-slate-600 py-0.5">Şifre:</td><td>{formData.password || "Yok"}</td></tr><tr><td className="font-bold text-slate-600 py-0.5">Aksesuarlar:</td><td>{Array.isArray(formData.accessories) ? formData.accessories.join(", ") : "-"}</td></tr></tbody></table></div>
                    </div>
                    <div className="mb-6 border border-slate-300 rounded-lg overflow-hidden"><div className="grid grid-cols-2 divide-x divide-slate-300"><div className="p-3"><h4 className="font-bold text-xs uppercase text-slate-700 mb-1">BİLDİRİLEN ARIZA / ŞİKAYET</h4><p className="text-xs text-slate-900 min-h-[40px] italic">{formData.issue}</p></div><div className="p-3 bg-slate-50"><h4 className="font-bold text-xs uppercase text-slate-700 mb-1">TEKNİSYEN RAPORU / YAPILAN İŞLEM</h4><p className="text-xs text-slate-900 font-medium whitespace-pre-wrap">{formData.notes || "Henüz işlem notu girilmedi."}</p></div></div></div>
                    <div className="mb-6"><h4 className="font-bold text-xs uppercase text-slate-700 mb-2 border-b-2 border-slate-800 pb-1">HİZMET VE PARÇA DÖKÜMÜ</h4><table className="w-full text-xs border-collapse"><thead><tr className="bg-slate-100 text-slate-700 border-b border-slate-300"><th className="py-2 px-2 text-left w-10">#</th><th className="py-2 px-2 text-left">CİNSİ / AÇIKLAMA</th><th className="py-2 px-2 text-center w-20">ADET</th><th className="py-2 px-2 text-right w-24">BİRİM FİYAT</th><th className="py-2 px-2 text-right w-24">TUTAR</th></tr></thead><tbody className="divide-y divide-slate-200">{usedParts.map((part, i) => (<tr key={part.id}><td className="py-1.5 px-2 text-slate-500">{i+1}</td><td className="py-1.5 px-2 font-bold">{part.aura_stok?.urun_adi}</td><td className="py-1.5 px-2 text-center">{part.adet}</td><td className="py-1.5 px-2 text-right">{part.satis_fiyati_anlik} ₺</td><td className="py-1.5 px-2 text-right font-bold">{(part.satis_fiyati_anlik * part.adet).toLocaleString()} ₺</td></tr>))}{Array.isArray(formData.sold_upsells) && formData.sold_upsells.map((item:any, i:number) => (<tr key={'up'+i}><td className="py-1.5 px-2 text-slate-500">{usedParts.length + i + 1}</td><td className="py-1.5 px-2 font-bold">{item.name || item.urun_adi}</td><td className="py-1.5 px-2 text-center">1</td><td className="py-1.5 px-2 text-right">{item.price} ₺</td><td className="py-1.5 px-2 text-right font-bold">{item.price} ₺</td></tr>))}<tr className="bg-slate-50"><td className="py-1.5 px-2 text-slate-500">-</td><td className="py-1.5 px-2 font-bold text-slate-700">TEKNİK SERVİS HİZMET BEDELİ / İŞÇİLİK</td><td className="py-1.5 px-2 text-center">1</td><td className="py-1.5 px-2 text-right">{laborCost.toLocaleString()} ₺</td><td className="py-1.5 px-2 text-right font-bold">{laborCost.toLocaleString()} ₺</td></tr></tbody><tfoot className="border-t-2 border-slate-800"><tr><td colSpan={3}></td><td className="py-3 px-2 text-right font-bold text-sm">TOPLAM:</td><td className="py-3 px-2 text-right font-black text-xl">{formData.price.toLocaleString('tr-TR')} ₺</td></tr></tfoot></table></div>
                    <div className="flex gap-6 mb-6 pt-4 border-t border-slate-300">
                        <div className="w-1/2 border border-slate-300 rounded p-2 text-xs"><h4 className="font-bold text-xs uppercase mb-1 border-b border-slate-200 pb-1">KONTROL LİSTESİ</h4><div className="grid grid-cols-2 gap-1"><div><span className="font-bold block text-[9px] text-slate-500">Giriş Kontrol:</span><div className="flex flex-wrap gap-1">{Array.isArray(formData.preCheck) && formData.preCheck.length > 0 ? formData.preCheck.map((chk:string)=><span key={chk} className="text-[8px] bg-slate-100 px-1 rounded">☑ {chk}</span>) : <span className="text-[8px] italic">Sorunsuz</span>}</div></div><div><span className="font-bold block text-[9px] text-slate-500">Çıkış Kontrol:</span><div className="flex flex-wrap gap-1">{Array.isArray(formData.finalCheck) && formData.finalCheck.length > 0 ? formData.finalCheck.map((chk:string)=><span key={chk} className="text-[8px] bg-green-50 px-1 rounded text-green-700">☑ {chk}</span>) : <span className="text-[8px] italic">Yapılmadı</span>}</div></div></div></div>
                        <div className="w-1/2 flex gap-4"><div className="flex-1 text-[8px] text-slate-500 text-justify leading-tight"><strong>GARANTİ ŞARTLARI:</strong><br/>1. 90 gün içinde alınmayan cihazlardan sorumluluk kabul edilmez.<br/>2. Sıvı temaslı cihazlara garanti verilmez.<br/>3. Veri yedeği müşteriye aittir.<br/>4. Parça garantisi 6 aydır.</div><div className="flex flex-col items-center justify-center"><img src={qrUrl} alt="Takip QR" className="w-16 h-16 border border-slate-200 p-1 bg-white"/><span className="text-[8px] font-bold mt-1 text-slate-500">TAKİP KODU</span></div></div>
                    </div>
                </div>
                <div className="flex justify-between mt-auto pt-4 border-t-2 border-black"><div className="text-center w-1/3"><p className="text-xs font-bold mb-8">TESLİM EDEN (MÜŞTERİ)</p><div className="border-b border-black w-full"></div><p className="text-[10px] mt-1">{formData.customer}</p></div><div className="text-center w-1/3"><p className="text-xs font-bold mb-8">TESLİM ALAN (YETKİLİ)</p><div className="border-b border-black w-full"></div><p className="text-[10px] mt-1">Aura Bilişim Teknik Servis</p></div></div>
            </div>
       </div>

       <style jsx global>{` @media print { @page { size: A4; margin: 0; } body { visibility: hidden; background-color: white; -webkit-print-color-adjust: exact; } .print\\:hidden { display: none !important; } #printable-area { visibility: visible; display: block !important; position: fixed; left: 0; top: 0; width: 210mm; height: 297mm; padding: 0; background-color: white; z-index: 9999; } #printable-area * { visibility: visible; } } `}</style>
    </div>
  );
}