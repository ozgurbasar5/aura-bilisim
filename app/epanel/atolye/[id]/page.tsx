"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Printer, User, Smartphone, Zap, Laptop, Watch, Box, 
  CheckSquare, ClipboardCheck, History, CreditCard, AlertTriangle, Send, Phone, Globe, MapPin, MessageCircle, Lock,
  Lightbulb, Battery, Fan, Eye, ShieldCheck, Database, Wrench, HardDrive, Wifi, Trash2, Camera, Upload, X, Image as ImageIcon,
  CheckCircle2, XCircle, ShoppingBag, FileText, PlusCircle, Book, Search, Plus, Clock, PackageMinus, ChevronRight, CheckCircle, Building2
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

// --- KATEGORİ VE İPUCU VERİLERİ (ORİJİNAL) ---
const CATEGORY_TIPS: any = {
  "Cep Telefonu": [
    { id: "pil", title: "Pil Sağlığı & Şarj", desc: "Batarya kimyasını korumak için cihazı %20-%80 arasında şarj edin.", icon: Battery, color: "text-green-400" },
    { id: "ekran", title: "Ekran Koruma", desc: "Tam kaplayan kırılmaz cam, darbe riskini %90 azaltır.", icon: Smartphone, color: "text-blue-400" },
    { id: "sarj", title: "Orijinal Aksesuar", desc: "Anakart üzerindeki şarj entegresini korumak için sertifikalı kablo kullanın.", icon: Zap, color: "text-yellow-400" },
    { id: "sivi", title: "Sıvı Teması Uyarısı", desc: "Sıcak buhar (duş/sauna) contaları gevşeterek sıvı temasına yol açabilir.", icon: ShieldCheck, color: "text-cyan-400" }
  ],
  "Robot Süpürge": [
    { id: "sensor", title: "Lidar & Sensör Bakımı", desc: "Robotun körleşmemesi için sensörleri haftada bir silin.", icon: Eye, color: "text-purple-400" },
    { id: "filtre", title: "Filtre ve Emiş Gücü", desc: "HEPA filtreyi yıkamayın! Basınçlı hava ile temizleyin.", icon: Fan, color: "text-orange-400" },
    { id: "firca", title: "Fırça Motoru Koruması", desc: "Ana fırça ve yan fırçalara dolanan saçları düzenli temizleyin.", icon: Wrench, color: "text-red-400" },
    { id: "istasyon", title: "İstasyon Konumlandırma", desc: "İstasyonun sağında ve solunda 50cm boşluk bırakın.", icon: MapPin, color: "text-blue-400" }
  ],
  "Bilgisayar": [
      { id: "termal", title: "Termal Bakım & Fan", desc: "Hava kanallarını kapatmayın ve yılda bir kez termal bakım yaptırın.", icon: Fan, color: "text-orange-400" },
      { id: "ssd", title: "SSD & Veri Sağlığı", desc: "Disk ömrünü uzatmak için en az %15 boş alan bırakın.", icon: HardDrive, color: "text-blue-400" },
      { id: "sivi_pc", title: "Klavye & Sıvı Teması", desc: "Sıvı dökülürse cihazı hemen kapatın ve ters çevirin.", icon: Zap, color: "text-yellow-400" },
      { id: "menteşe", title: "Menteşe Kullanımı", desc: "Ekranı her zaman tam ortadan tutarak açıp kapatın.", icon: Laptop, color: "text-slate-400" }
  ],
  "Tablet": [
    { id: "ekran_tab", title: "Geniş Ekran Koruma", desc: "Sert kapaklı kılıf kullanmanızı öneririz.", icon: Smartphone, color: "text-blue-400" },
    { id: "sarj_soket", title: "Şarj Soketi", desc: "Şarj kablosu takılıyken tableti kullanmak soketi bozar.", icon: Zap, color: "text-yellow-400" },
    { id: "cocuk", title: "Ebeveyn Kilidi", desc: "Çocukların güvenliği için ekran süresi sınırlaması koyun.", icon: Lock, color: "text-green-400" }
  ],
  "Akıllı Saat": [
    { id: "su_saat", title: "Su Geçirmezlik", desc: "Denizden sonra mutlaka tatlı su ile durulayın.", icon: Zap, color: "text-blue-500" },
    { id: "sensor_saat", title: "Nabız Sensörü", desc: "Sensörlerin doğru ölçümü için arka camı temiz tutun.", icon: Eye, color: "text-red-400" },
    { id: "kordon", title: "Kordon Temizliği", desc: "Silikon kordonları düzenli yıkayıp kurulayın.", icon: Watch, color: "text-slate-400" }
  ],
  "Diğer": [
    { id: "genel", title: "Aura Koruma Kalkanı", desc: "Cihaz performansını korumak için orijinal aksesuar kullanın.", icon: ShieldCheck, color: "text-blue-400" },
    { id: "yedek", title: "Veri Yedekleme", desc: "Verilerinizi düzenli olarak yedeklemeyi unutmayın.", icon: Database, color: "text-cyan-400" }
  ]
};

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
  "Tablet": {
    accessories: ["Şarj Aleti", "Kılıf", "Kalem", "Klavye"],
    preChecks: ["Ekran Kırık", "Dokunmatik Hatası", "Şarj Soketi", "Yamuk Kasa", "Wifi Hatası"],
    finalChecks: ["Dokunmatik Testi", "Şarj Testi", "Wifi Bağlantı", "Kamera Testi", "Ses Testi"]
  },
  "Akıllı Saat": {
    accessories: ["Şarj Kablosu", "Yedek Kordon", "Kutu"],
    preChecks: ["Ekran Çizik", "Kordon Kopuk", "Nabız Sensörü", "Titreşim Yok", "Buton Basmıyor", "Eşleşmiyor", "Sıvı Teması"],
    finalChecks: ["Su Sızdırmazlık", "Sensör Testi", "Dokunmatik", "Şarj Hızı", "Kordon Temizliği", "Fabrika Ayarları"]
  },
  "Diğer": {
    accessories: ["Kutu", "Kumanda", "Kablo", "Adaptör", "Güç Kaynağı"],
    preChecks: ["Fiziksel Hasar", "Çalışmıyor", "Parça Eksik", "Yanık Kokusu", "Ses Gelmiyor"],
    finalChecks: ["Genel Temizlik", "Fonksiyon Testi", "Güvenlik Testi", "Paketleme"]
  }
};

export default function ServisDetaySayfasi() {
  const router = useRouter();
  const params = useParams(); 
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [expertiseId, setExpertiseId] = useState<number | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("Sistem");
  
  // FIRSAT ÜRÜNLERİ (DATABASE'DEN GELECEK)
  const [availableUpsells, setAvailableUpsells] = useState<any[]>([]);
  // YENİ: Bayi Listesi
  const [dealersList, setDealersList] = useState<any[]>([]);
  
  // --- ONAY MODALI STATE ---
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState({ amount: 0, desc: "" });

  // --- WIKI (ARIZA KÜTÜPHANESİ) STATE ---
  const [isWikiModalOpen, setIsWikiModalOpen] = useState(false);
  const [wikiSearchTerm, setWikiSearchTerm] = useState("");
  const [wikiResults, setWikiResults] = useState<any[]>([]);
  const [wikiViewMode, setWikiViewMode] = useState<'search' | 'add'>('search');
  const [newWikiEntry, setNewWikiEntry] = useState({ title: "", problem: "", solution: "" });

  // --- STOK & PARÇA YÖNETİMİ STATE ---
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockSearchTerm, setStockSearchTerm] = useState("");
  const [stockResults, setStockResults] = useState<any[]>([]);
  const [usedParts, setUsedParts] = useState<any[]>([]); 

  // --- TIMELINE (ZAMAN TÜNELİ) STATE ---
  const [timelineLogs, setTimelineLogs] = useState<any[]>([]);

  // FORM VERİSİ
  const [formData, setFormData] = useState<any>({
    id: 0, 
    customerType: "Son Kullanıcı", 
    customer: "", 
    email: "", // YENİ: Email ayrı saklanacak
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
    price: 0, 
    cost: 0, 
    date: new Date().toLocaleDateString('tr-TR'),
    tracking_code: "",
    tip_id: "",
    images: [],
    approval_status: 'none',
    approval_amount: 0,
    approval_desc: '',
    recommended_upsells: [], 
    sold_upsells: []          
  });

  const getCategoryInfo = (catName: string) => CATEGORY_DATA[catName] || CATEGORY_DATA["Diğer"];
  const getCurrentTips = () => CATEGORY_TIPS[formData.category] || CATEGORY_TIPS["Diğer"];

  // --- EVRENSEL VERİ ÇÖZÜCÜ (String, Array, Null Hepsini Çözer) ---
  const parseArray = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        if (val === "null" || val.trim() === "") return [];
        try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
        } catch { 
            return []; 
        }
    }
    return [];
  };

  // --- KULLANICIYI VE VERİLERİ ÇEK ---
  useEffect(() => {
      const getUser = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) setCurrentUserEmail(user.email);
      };
      getUser();

      // 1. Bayileri Çek (Listede göstermek için)
      const fetchDealers = async () => {
          const { data } = await supabase.from('bayi_basvurulari').select('*').eq('durum', 'Onaylandı').order('sirket_adi');
          if (data) setDealersList(data);
      };
      fetchDealers();

      async function fetchData() {
        if (!params?.id) return;
        try {
            if (params.id === 'yeni') {
                const defaultTips = CATEGORY_TIPS["Cep Telefonu"];
                setFormData((prev: any) => ({ 
                    ...prev, 
                    date: new Date().toLocaleDateString('tr-TR'),
                    tracking_code: `SRV-${Math.floor(10000 + Math.random() * 90000)}`,
                    tip_id: defaultTips[0].id
                }));
            } else {
                const { data, error } = await supabase.from('aura_jobs').select('*').eq('id', params.id).single();
                if (error) throw error;
                if (data) {
                    // --- Logları parse et ve timeline'a ekle ---
                    const embeddedLogs = parseArray(data.process_details).map((log:any) => ({
                        id: 'embedded-' + Math.random(),
                        action_type: log.action || "İşlem",
                        description: log.details || "Detay yok",
                        created_at: log.date || new Date().toISOString(),
                        created_by: log.user || "Sistem"
                    }));

                    setFormData({
                        id: data.id,
                        tracking_code: data.tracking_code || "",
                        // --- DÜZELTME: İsim ve Emaili ayır ---
                        customer: data.customer || data.customer_name || "",
                        email: data.customer_email || "",
                        phone: data.phone || "",
                        customerType: data.customer_type || "Son Kullanıcı",
                        address: data.address || "",
                        category: data.category || "Cep Telefonu", 
                        device: data.device_name || data.device || data.model || "",
                        serialNo: data.serial_no || data.serial_number || data.imei || "",
                        password: data.password || data.screen_password || "",
                        issue: data.problem_description || data.problem || data.issue || "",
                        privateNote: data.private_note || "",
                        // --- DÜZELTME: SADECE NOT ---
                        notes: data.technician_note || "", 
                        
                        status: data.status,
                        price: Number(data.price) || 0,
                        cost: Number(data.cost) || 0,
                        date: data.created_at ? new Date(data.created_at).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR'),
                        
                        accessories: parseArray(data.accessories || data.accessory),
                        preCheck: parseArray(data.pre_checks || data.pre_check),
                        finalCheck: parseArray(data.final_checks || data.final_check),
                        images: parseArray(data.images),
                        recommended_upsells: parseArray(data.recommended_upsells),
                        sold_upsells: parseArray(data.sold_upsells),
                        
                        tip_id: data.tip_id || "genel",
                        approval_status: data.approval_status || 'none',
                        approval_amount: data.approval_amount || 0,
                        approval_desc: data.approval_desc || ""
                    });
                    
                    if (data.serial_no || data.serial_number) checkExpertise(data.serial_no || data.serial_number);
                    fetchTimeline(data.id, embeddedLogs); 
                    fetchUsedParts(data.id);
                }
            }
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    fetchData();
  }, [params.id]);

  // --- KATEGORİYE GÖRE FIRSAT ÜRÜNLERİNİ ÇEK ---
  useEffect(() => {
      const fetchUpsells = async () => {
          if (!formData.category) return;
          const { data } = await supabase
            .from('aura_upsell_products')
            .select('*')
            .eq('category', formData.category) 
            .eq('is_active', true); 
          
          if(data) setAvailableUpsells(data);
          else setAvailableUpsells([]); 
      };
      
      fetchUpsells();
  }, [formData.category]); 

  // YENİ: Bayi Seçildiğinde Bilgileri Doldur
  const handleDealerChange = (selectedDealerName: string) => {
      const dealer = dealersList.find(d => d.sirket_adi === selectedDealerName);
      if (dealer) {
          setFormData({
              ...formData,
              customer: dealer.sirket_adi, // Şirket Adı = Müşteri Adı
              email: dealer.email,
              phone: dealer.telefon,
              address: dealer.adres
          });
      } else {
          setFormData({ ...formData, customer: selectedDealerName });
      }
  };

  // --- FONKSİYONLAR ---

  const checkExpertise = async (imei: string) => {
      if (!imei || imei.length < 5) { setExpertiseId(null); return; }
      const { data } = await supabase.from('aura_expertise').select('id').eq('serial_no', imei).single();
      if (data) setExpertiseId(data.id); else setExpertiseId(null);
  };

  const fetchTimeline = async (jobId: number, embeddedLogs: any[] = []) => {
      const { data } = await supabase.from('aura_timeline').select('*').eq('job_id', jobId).order('created_at', { ascending: false });
      const combined = [...(data || []), ...embeddedLogs];
      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setTimelineLogs(combined);
  };

  const logToTimeline = async (action: string, desc: string) => {
      if (params.id === 'yeni') return; 
      const newLog = {
          job_id: params.id,
          action_type: action,
          description: desc,
          created_by: currentUserEmail
      };
      await supabase.from('aura_timeline').insert([newLog]);
      setTimelineLogs(prev => [newLog, ...prev]);
  };

  const fetchUsedParts = async (jobId: number) => {
      const { data } = await supabase.from('aura_servis_parcalari')
        .select(`*, aura_stok(urun_adi)`)
        .eq('job_id', jobId);
      if(data) setUsedParts(data);
  };

  const handleStockSearch = async () => {
      if(stockSearchTerm.length < 2) return;
      const { data } = await supabase.from('aura_stok')
        .select('*')
        .ilike('urun_adi', `%${stockSearchTerm}%`)
        .gt('stok_adedi', 0) 
        .limit(10);
      setStockResults(data || []);
  };

  const addPartToJob = async (part: any) => {
      if(params.id === 'yeni') { alert("Önce servisi kaydetmelisiniz."); return; }
      
      const quantityStr = prompt(`Kaç adet "${part.urun_adi}" kullanacaksınız?`, "1");
      if(!quantityStr || isNaN(Number(quantityStr)) || Number(quantityStr) < 1) return;
      const qty = Number(quantityStr);

      if(qty > part.stok_adedi) { 
          alert(`Yetersiz stok! Mevcut stok: ${part.stok_adedi}`); 
          return; 
      }

      const totalCost = Number(part.alis_fiyati) * qty;
      const totalPrice = Number(part.satis_fiyati) * qty;

      if(!confirm(`${part.urun_adi} (x${qty}) stoktan düşülecek. Onaylıyor musunuz?`)) return;

      const { error } = await supabase.from('aura_servis_parcalari').insert([{
          job_id: params.id,
          stok_id: part.id,
          adet: qty,
          alis_fiyati_anlik: part.alis_fiyati,
          satis_fiyati_anlik: part.satis_fiyati
      }]);

      if(error) { alert("Hata: " + error.message); return; }

      await supabase.from('aura_stok').update({ stok_adedi: part.stok_adedi - qty }).eq('id', part.id);

      const newCost = Number(formData.cost) + totalCost;
      const newPrice = Number(formData.price) + totalPrice;
      const newNotes = formData.notes + `\n[PARÇA] ${part.urun_adi} (x${qty}) Eklendi.`;

      // Anlık Kayıt (Technician Note ile)
      await supabase.from('aura_jobs').update({ 
          price: String(newPrice), 
          cost: newCost,
          technician_note: newNotes
      }).eq('id', params.id);

      setFormData({ ...formData, price: newPrice, cost: newCost, notes: newNotes });
      logToTimeline("Parça Kullanıldı", `${part.urun_adi} (x${qty}) stoktan düşüldü.`);
      fetchUsedParts(Number(params.id));
      setIsStockModalOpen(false);
  };

  const removePartFromJob = async (partRelId: number, partStokId: number, alis: number, satis: number, adet: number) => {
      if(!confirm(`Bu parçayı (${adet} adet) iptal etmek istiyor musunuz? Stok geri iade edilecek.`)) return;
      
      await supabase.from('aura_servis_parcalari').delete().eq('id', partRelId);

      const { data: currStock } = await supabase.from('aura_stok').select('stok_adedi').eq('id', partStokId).single();
      if(currStock) await supabase.from('aura_stok').update({ stok_adedi: currStock.stok_adedi + adet }).eq('id', partStokId);

      const removedCost = alis * adet;
      const removedPrice = satis * adet;

      const newCost = Number(formData.cost) - removedCost;
      const newPrice = Number(formData.price) - removedPrice;
      
      // Anlık Güncelleme
      await supabase.from('aura_jobs').update({ 
          price: String(newPrice), 
          cost: newCost 
      }).eq('id', params.id);

      setFormData({ ...formData, price: newPrice, cost: newCost });
      logToTimeline("Parça İptali", `Parça kullanımı iptal edildi, ${adet} adet stok iade alındı.`);
      fetchUsedParts(Number(params.id));
  };

  const handleWikiSearch = async () => {
      if (!wikiSearchTerm) return;
      const { data } = await supabase.from('aura_wiki')
          .select('*')
          .ilike('title', `%${wikiSearchTerm}%`)
          .limit(5);
      setWikiResults(data || []);
  };

  const handleAddToWiki = async () => {
      if (!newWikiEntry.title || !newWikiEntry.solution) { alert("Başlık ve Çözüm alanları zorunludur."); return; }
      const payload = {
          title: newWikiEntry.title,
          device_category: formData.category,
          problem_desc: newWikiEntry.problem,
          solution_steps: newWikiEntry.solution,
          author: currentUserEmail
      };
      const { error } = await supabase.from('aura_wiki').insert([payload]);
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
      if (exists) {
          setFormData({...formData, recommended_upsells: current.filter((i:any) => i.id !== item.id)});
      } else {
          setFormData({...formData, recommended_upsells: [...current, item]});
      }
  };

  const handleSave = async () => {
    if (!formData.customer) { alert("Müşteri adı zorunlu!"); return; }
    setLoading(true);
    
    // --- "FLOOD" STRATEJİSİ: GARANTİLİ KAYIT ---
    const payload = {
        // İsim ve Emaili ayır
        customer: formData.customer, 
        customer_email: formData.email,
        customer_name: formData.customer,
        phone: formData.phone,
        address: formData.address,
        customer_type: formData.customerType,

        device_name: formData.device,
        device: formData.device,
        model: formData.device,
        brand: formData.category,
        category: formData.category,
        
        serial_no: formData.serialNo,
        serial_number: formData.serialNo,
        imei: formData.serialNo,
        
        password: formData.password,
        screen_password: formData.password,
        pattern_password: formData.password,
        passcode: formData.password,

        problem_description: formData.issue,
        problem: formData.issue,
        issue: formData.issue,
        complaint: formData.issue,
        technician_note: formData.notes,
        // DİKKAT: process_details buraya YAZILMAZ, JSON bozulmasın.
        private_note: formData.privateNote,

        status: formData.status,
        price: String(formData.price),
        cost: Number(formData.cost),
        tracking_code: formData.tracking_code || `SRV-${Math.floor(10000 + Math.random() * 90000)}`,
        
        // JSON Verileri (Stringify ile Text'e çevir)
        accessories: JSON.stringify(formData.accessories),
        accessory: JSON.stringify(formData.accessories),
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
    if (params.id === 'yeni') {
        res = await supabase.from('aura_jobs').insert([payload]).select();
    } else {
        res = await supabase.from('aura_jobs').update(payload).eq('id', params.id);
        logToTimeline("Kayıt Güncellendi", `Durum: ${formData.status}, Tutar: ${formData.price}TL.`);
    }

    setLoading(false);
    if (!res.error) {
        alert("Kayıt Başarılı!");
        if (params.id === 'yeni' && res.data) router.push(`/epanel/atolye/${res.data[0].id}`);
    } else {
        console.error("Save Error:", res.error);
        alert("Hata: " + res.error.message);
    }
  };

  const sendApprovalRequest = async () => {
    setLoading(true);
    const { error } = await supabase.from('aura_jobs').update({
        approval_status: 'pending', approval_amount: String(approvalData.amount), approval_desc: approvalData.desc, status: 'Onay Bekliyor'
    }).eq('id', params.id);
    if (!error) {
        alert("Onay isteği gönderildi!");
        setFormData({ ...formData, status: 'Onay Bekliyor', approval_status: 'pending', approval_amount: approvalData.amount, approval_desc: approvalData.desc });
        logToTimeline("Onay İsteği", `Müşteriden ${approvalData.amount} TL tutarında ek onay istendi.`);
        setApprovalModalOpen(false);
    }
    setLoading(false);
  };

  const handleCategoryChange = (cat: string) => {
    const newTips = CATEGORY_TIPS[cat] || CATEGORY_TIPS["Diğer"];
    setFormData((prev: any) => ({ ...prev, category: cat, accessories: [], preCheck: [], finalCheck: [], tip_id: newTips[0]?.id || "genel", recommended_upsells: [] }));
  };

  const handleImageUpload = async (e: any) => { 
    if (!e.target.files.length) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const newImages = Array.isArray(formData.images) ? [...formData.images] : [];
    for (const file of files as File[]) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error } = await supabase.storage.from('service-images').upload(fileName, file);
        if (!error) {
            const { data } = supabase.storage.from('service-images').getPublicUrl(fileName);
            newImages.push(data.publicUrl);
        }
    }
    setFormData({ ...formData, images: newImages });
    logToTimeline("Fotoğraf Yüklendi", `${files.length} adet yeni fotoğraf eklendi.`);
    setUploading(false);
  };

  const removeImage = (index: number) => {
      const newImages = Array.isArray(formData.images) ? [...formData.images] : [];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
  };

  const handleDelete = async () => {
    if(!confirm("BU SERVİS KAYDINI TAMAMEN SİLMEK İSTEDİĞİNİZE EMİN MİSİNİZ?\n\nBu işlem geri alınamaz!")) return;
    setLoading(true);
    const { error } = await supabase.from('aura_jobs').delete().eq('id', params.id);
    if (error) { alert("Silme hatası: " + error.message); setLoading(false); }
    else { alert("Kayıt başarıyla silindi."); router.push('/epanel/atolye'); }
  };

  const sendWhatsAppMessage = () => {
    let cleanPhone = (formData.phone || "").replace(/\D/g, ''); 
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;

    let rawMessage = "";
    const takipKodu = formData.tracking_code || formData.id;

    if (formData.approval_status === 'pending') {
        rawMessage = `Sayın *${formData.customer}*,\n\nCihazınızda tespit edilen ekstra durum için onayınız gerekmektedir. Lütfen aşağıdaki linkten detayları inceleyip onay veriniz:\n\n👉 https://aurabilisim.net/cihaz-sorgula?takip=${takipKodu}\n\n*Aura Bilişim*`;
    } else if (formData.status === "Hazır" || formData.status === "Teslim Edildi") {
        rawMessage = `Sayın *${formData.customer}*,\n\n*${takipKodu}* takip numaralı *${formData.device}* cihazınızın işlemleri tamamlanmıştır.\n\n✅ *İşlem:* ${formData.notes || "Genel Bakım"}\n💰 *Tutar:* ${formData.price} TL\n\nServisimizden teslim alabilirsiniz.\n\n*Aura Bilişim*`;
    } else {
        rawMessage = `Merhaba *${formData.customer}*,\n\n*${takipKodu}* takip numaralı cihazınızın durumu: *${formData.status}*.\n\nBilgilerinize sunarız.\n\n*Aura Bilişim*`;
    }

    logToTimeline("WhatsApp Mesajı", "Müşteriye durum bildirimi gönderildi.");
    const encodedMessage = encodeURIComponent(rawMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData((prev: any) => {
        const current = Array.isArray(prev[field]) ? prev[field] : [];
        const updated = current.includes(item) ? current.filter((i: string) => i !== item) : [...current, item];
        return { ...prev, [field]: updated };
    });
  };

  if (loading) return <div className="p-20 text-white text-center font-bold animate-pulse">Yükleniyor...</div>;

  const catInfo = getCategoryInfo(formData.category);
  const currentTips = getCurrentTips();
  const selectedTip = currentTips.find((t: any) => t.id === formData.tip_id) || currentTips[0];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 font-sans relative">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-800 pb-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur-md z-50 gap-4 print:hidden">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 font-bold text-sm"><ArrowLeft size={18}/> GERİ DÖN</button>
                <h1 className="text-xl font-black text-white">SERVİS <span className="text-cyan-500">#{formData.tracking_code || "YENİ"}</span></h1>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <button onClick={sendWhatsAppMessage} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-sm shadow-lg shadow-green-900/20 active:scale-95">
                    <MessageCircle size={18}/> WP
                </button>
                <button onClick={() => window.print()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 text-white font-bold text-sm active:scale-95">
                    <Printer size={18}/> YAZDIR
                </button>
                {params.id !== 'yeni' && (
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg border border-red-500/20 font-bold"><Trash2 size={18}/></button>
                )}
                <button onClick={handleSave} className="px-6 py-2 bg-cyan-600 rounded-lg font-bold text-white shadow-lg"><Save size={18}/> KAYDET</button>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-6 print:hidden">
            {/* SOL KOLON */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
                {/* MÜŞTERİ BİLGİLERİ */}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={14} className="text-cyan-500"/> Müşteri</h3>
                    <div className="space-y-3">
                        <div className="flex bg-black/30 p-1 rounded-lg border border-slate-800 mb-3">
                             {["Son Kullanıcı", "Bayi"].map(t => (
                                 <button key={t} onClick={() => setFormData((p:any)=>({...p, customerType: t}))} className={`flex-1 text-[10px] py-1.5 rounded font-bold transition-all uppercase ${formData.customerType === t ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>{t}</button>
                             ))}
                        </div>
                        
                        {/* DÜZELTME: BAYİ SEÇİMİ İÇİN DROPDOWN (Eğer Bayi ise listeden seçtir) */}
                        {formData.customerType === 'Bayi' ? (
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" size={14} />
                                <select 
                                    className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 pl-9 text-sm font-bold text-white outline-none focus:border-cyan-500 appearance-none"
                                    value={formData.customer}
                                    onChange={(e) => handleDealerChange(e.target.value)}
                                >
                                    <option value="">Bayi Seçiniz...</option>
                                    {dealersList.map((d: any) => (
                                        <option key={d.id} value={d.sirket_adi}>{d.sirket_adi}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <input type="text" value={formData.customer} onChange={e => setFormData((p:any)=>({...p, customer: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-white outline-none" placeholder="Ad Soyad"/>
                        )}

                        <input type="text" value={formData.phone} onChange={e => setFormData((p:any)=>({...p, phone: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-mono" placeholder="Telefon"/>
                        <textarea value={formData.address} onChange={e => setFormData((p:any)=>({...p, address: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-xs h-20 outline-none resize-none" placeholder="Adres..."></textarea>
                        
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                            <select value={formData.status} onChange={e => setFormData((p:any)=>({...p, status: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-white"><option>Bekliyor</option><option>İşlemde</option><option>Parça Bekliyor</option><option>Onay Bekliyor</option><option>Hazır</option><option>Teslim Edildi</option></select>
                            <div className="flex gap-2">
                                <div className="flex-1"><label className="text-[9px] text-green-500 font-bold">FİYAT</label><input type="number" value={formData.price} onChange={e => setFormData((p:any)=>({...p, price: Number(e.target.value)}))} className="w-full bg-[#0b0e14] border border-green-900/50 text-green-400 font-bold text-right p-2 rounded-lg"/></div>
                                <div className="flex-1"><label className="text-[9px] text-red-500 font-bold">MALİYET</label><input type="number" value={formData.cost} onChange={e => setFormData((p:any)=>({...p, cost: Number(e.target.value)}))} className="w-full bg-[#0b0e14] border border-red-900/50 text-red-400 font-bold text-right p-2 rounded-lg"/></div>
                            </div>
                        </div>

                        {/* Onay Butonu */}
                        {formData.approval_status === 'none' && (
                            <button onClick={() => setApprovalModalOpen(true)} className="w-full py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg font-bold text-xs flex justify-center gap-2"><Zap size={14}/> EKSTRA ONAY İSTE</button>
                        )}
                        {formData.approval_status === 'pending' && <div className="text-center text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/30 animate-pulse">ONAY BEKLENİYOR (+{formData.approval_amount}₺)</div>}
                        {formData.approval_status === 'approved' && <div className="text-center text-xs text-green-500 bg-green-500/10 p-2 rounded border border-green-500/30">MÜŞTERİ ONAYLADI ✅</div>}
                    </div>
                </div>

                {/* YENİ: AURA FIRSAT SEÇİCİ (UPSELL) */}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ShoppingBag size={14} className="text-pink-500"/> Fırsat Öner (Upsell)</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {availableUpsells.length > 0 ? availableUpsells.map((item:any) => {
                            // GÜVENLİ ARRAY KONTROLÜ
                            const recUpsells = Array.isArray(formData.recommended_upsells) ? formData.recommended_upsells : [];
                            const sldUpsells = Array.isArray(formData.sold_upsells) ? formData.sold_upsells : [];
                            
                            const isSelected = recUpsells.some((i:any) => i.id === item.id);
                            // Hibrit Kontrol: Hem ID hem isim kontrolü yap (Eski kayıtlar için)
                            const isSold = sldUpsells.some((i:any) => i.id === item.id || i.name === item.name || i === item.name);
                            
                            if(isSold) return <div key={item.id} className="p-2 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400 flex justify-between"><span>{item.name}</span><span className="font-bold">SATILDI</span></div>;

                            return (
                                <button key={item.id} onClick={() => toggleUpsell(item)} className={`w-full flex justify-between items-center p-2 rounded border transition-all text-xs ${isSelected ? 'bg-pink-500/20 border-pink-500 text-pink-300' : 'bg-[#0b0e14] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                    <span>{item.name}</span>
                                    <span className="font-bold">{item.price}₺</span>
                                </button>
                            );
                        }) : (
                            <div className="text-center text-[10px] text-slate-600">Bu kategori için ürün bulunamadı.</div>
                        )}
                    </div>
                    {Array.isArray(formData.recommended_upsells) && formData.recommended_upsells.length > 0 && <div className="text-[10px] text-slate-500 text-center mt-2">Seçili {formData.recommended_upsells.length} ürün müşteriye gösterilecek.</div>}
                </div>
            </div>

            {/* ORTA KOLON */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg">
                    {/* Cihaz Kimliği... */}
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2"><Smartphone size={14} className="text-blue-500"/> Cihaz Kimliği</h3>
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">{Object.keys(CATEGORY_DATA).map(cat => ( <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-3 py-1 rounded text-[10px] font-bold border whitespace-nowrap transition-all ${formData.category === cat ? 'bg-cyan-600 text-white border-cyan-500' : 'text-slate-500 border-slate-700 hover:border-slate-500'}`}>{cat}</button> ))}</div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-slate-500 font-bold ml-1">MARKA / MODEL</label>
                            <input type="text" value={formData.device} onChange={e => setFormData((p:any)=>({...p, device: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-lg font-black text-white outline-none focus:border-cyan-500" placeholder="Model (Örn: iPhone 13)"/>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <input type="text" value={formData.serialNo} onChange={e => { setFormData((p:any)=>({...p, serialNo: e.target.value})); checkExpertise(e.target.value); }} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm font-mono uppercase outline-none focus:border-cyan-500" placeholder="IMEI / SERİ NO"/>
                                {/* OTOMATİK EKSPERTİZ BUTONU */}
                                {formData.serialNo.length > 5 && (
                                    <div className="absolute right-1 top-1 bottom-1">
                                            {expertiseId ? (
                                                <button onClick={() => router.push(`/epanel/ekspertiz/detay/${expertiseId}`)} className="h-full px-3 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-lg hover:scale-105 transition-transform"><FileText size={12}/> RAPOR VAR</button>
                                            ) : (
                                                <button onClick={() => router.push(`/epanel/ekspertiz?yeni=${formData.serialNo}`)} className="h-full px-3 bg-slate-700 hover:bg-blue-600 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-lg hover:scale-105 transition-transform"><PlusCircle size={12}/> RAPOR EKLE</button>
                                            )}
                                    </div>
                                )}
                            </div>
                            <input type="text" value={formData.password} onChange={e => setFormData((p:any)=>({...p, password: e.target.value}))} className="w-full bg-[#0b0e14] border border-red-900/30 text-red-400 rounded-lg p-3 font-bold outline-none focus:border-red-500" placeholder="Şifre"/>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1 ml-1">
                                <label className="text-[10px] text-slate-500 font-bold">ŞİKAYET / ARIZA</label>
                                {/* WIKI BUTTON */}
                                <button onClick={() => { setIsWikiModalOpen(true); setWikiSearchTerm(formData.device); handleWikiSearch(); }} className="text-[10px] flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/30">
                                    <Book size={10}/> Wiki'de Ara
                                </button>
                            </div>
                            <textarea value={formData.issue} onChange={e => setFormData((p:any)=>({...p, issue: e.target.value}))} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm h-24 outline-none resize-none focus:border-cyan-500" placeholder="Arıza detayını giriniz..."></textarea>
                        </div>
                        
                        {/* TESLİM ALINANLAR (GÜVENLİ) */}
                        <div className="bg-black/20 p-3 rounded-xl border border-slate-800">
                            <label className="text-[10px] text-cyan-500 font-bold uppercase mb-2 block">Teslim Alınanlar</label>
                            <div className="flex flex-wrap gap-2">
                                {catInfo.accessories.map((acc: string) => {
                                    // Güvenli Array Kontrolü
                                    const accArray = Array.isArray(formData.accessories) ? formData.accessories : [];
                                    const isSelected = accArray.includes(acc);
                                    return (
                                        <button key={acc} onClick={() => { 
                                            const curr = isSelected ? accArray.filter((i:any)=>i!==acc) : [...accArray, acc]; 
                                            setFormData({...formData, accessories: curr}); 
                                        }} className={`px-2 py-1 rounded border text-[10px] font-bold transition-all ${isSelected ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400 scale-105' : 'bg-[#0b0e14] border-slate-800 text-slate-500 hover:border-slate-600'}`}>{acc}</button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- STOK / PARÇA YÖNETİMİ (YENİ) --- */}
                {params.id !== 'yeni' && (
                    <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><PackageMinus size={14} className="text-yellow-500"/> Kullanılan Parçalar</h3>
                            <button onClick={() => setIsStockModalOpen(true)} className="text-[10px] bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-lg"><Plus size={12}/> STOKTAN DÜŞ</button>
                        </div>
                        
                        <div className="space-y-2">
                            {usedParts.length > 0 ? usedParts.map((part) => (
                                <div key={part.id} className="flex justify-between items-center bg-[#0b0e14] border border-slate-800 p-2.5 rounded-lg group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-xs">{part.adet}x</div>
                                        <div>
                                            <p className="text-xs font-bold text-white">{part.aura_stok?.urun_adi}</p>
                                            <p className="text-[10px] text-slate-500">
                                                Mal: {(part.alis_fiyati_anlik * part.adet)}₺ • Sat: {(part.satis_fiyati_anlik * part.adet)}₺
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => removePartFromJob(part.id, part.stok_id, part.alis_fiyati_anlik, part.satis_fiyati_anlik, part.adet)} className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                                </div>
                            )) : (
                                <div className="text-center text-[10px] text-slate-600 border border-dashed border-slate-800 p-4 rounded-lg">
                                    Henüz parça eklenmedi. "Stoktan Düş" butonunu kullanın.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* SAĞ KOLON (Kontroller, İşlemler ve YENİ TIMELINE) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* --- YENİ EKLENEN: ZAMAN TÜNELİ (TIMELINE) --- */}
                {params.id !== 'yeni' && (
                    <div className="bg-[#151921] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col max-h-[300px]">
                        <div className="p-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-emerald-500"/> Canlı Akış</h3>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20">LOGLAR</span>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar p-3 space-y-3">
                            {timelineLogs.length > 0 ? timelineLogs.map((log: any) => (
                                <div key={log.id} className="flex gap-3 text-xs">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5"></div>
                                        <div className="w-px h-full bg-slate-800"></div>
                                    </div>
                                    <div className="pb-2">
                                        <p className="text-slate-300 font-bold">{log.action_type}</p>
                                        <p className="text-slate-500 text-[10px] leading-tight">{log.description}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[9px] text-slate-600">{new Date(log.created_at).toLocaleString('tr-TR')}</span>
                                            <span className="text-[9px] text-cyan-900/70">{log.created_by?.split('@')[0]}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : <div className="text-center text-[10px] text-slate-600 py-4">Henüz kayıt yok.</div>}
                        </div>
                    </div>
                )}

                {/* --- İŞLEMLER (DÜZELTİLDİ: RENGİ KOYU OLDU) --- */}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    {/* Header: Dark Mode */}
                    <div className="bg-[#0b0e14] border border-slate-800 border-b-0 rounded-t-lg px-4 py-2 flex justify-between items-center">
                        <span className="font-bold text-sm uppercase text-slate-300">Servis İşlemleri & Değişen Parçalar</span>
                        <span className="text-xs font-bold border border-slate-700 bg-[#151921] px-2 py-0.5 rounded uppercase text-slate-400">DURUM: {formData.status}</span>
                    </div>
                    {/* Body: Dark Mode */}
                    <div className="border border-slate-800 rounded-b-lg p-4 min-h-[120px] bg-[#0b0e14]">
                        <textarea value={formData.notes} onChange={e => setFormData((p:any)=>({...p, notes: e.target.value}))} className="w-full bg-transparent border-none text-slate-300 text-sm h-full outline-none resize-none" placeholder="Yapılan işlemler..."></textarea>
                        
                        {/* DÜZELTİLMİŞ UPSELL GÖSTERİMİ */}
                        {Array.isArray(formData.sold_upsells) && formData.sold_upsells.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-800">
                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Eklenen Ürünler / Hizmetler:</h5>
                                <ul className="text-sm list-disc pl-4 space-y-1 text-slate-400">
                                    {formData.sold_upsells.map((item:any, idx:number) => (
                                        <li key={idx}>
                                            {/* Hibrit Gösterim: Hem Nesne Hem String Desteği */}
                                            {typeof item === 'object' ? (item.name || item.urun_adi || "İsimsiz Ürün") : item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle size={14} className="text-orange-500"/> Ön Kontrol</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {catInfo.preChecks.map((item: string) => { const preArray = Array.isArray(formData.preCheck) ? formData.preCheck : []; const isSelected = preArray.includes(item); return (<button key={item} onClick={() => { const curr = isSelected ? preArray.filter((i:any)=>i!==item) : [...preArray, item]; setFormData({...formData, preCheck: curr}); }} className={`flex items-center gap-2 p-2 rounded border text-left text-[10px] transition-all ${isSelected ? 'bg-red-500/10 border-red-500/50 text-red-400 font-bold' : 'bg-[#0b0e14] border-slate-800 text-slate-600 hover:border-slate-700'}`}><div className={`w-2 h-2 rounded-full ${isSelected?'bg-red-500':'bg-slate-700'}`}></div>{item}</button>); })}
                    </div>
                </div>
                
                {/* FOTOĞRAF GALERİSİ (GÜVENLİ) */}
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
                    ) : (
                        <div className="text-center text-slate-600 text-xs border border-dashed border-slate-800 p-4 rounded-lg">Görsel yok.</div>
                    )}
                </div>
                
                {/* SON KONTROL (GÜVENLİ) */}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ClipboardCheck size={14} className="text-green-500"/> Kalite Kontrol</h3>
                    <div className="space-y-2">
                         {catInfo.finalChecks.map((item: string) => {
                             // GÜVENLİ ARRAY KONTROLÜ
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

        {/* ... Modals (Stok, Wiki, Onay) Aynen Kalıyor ... */}
        {isStockModalOpen && (<div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-[#1e293b] rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"><div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center"><h3 className="text-white font-bold flex items-center gap-2"><Box size={18} className="text-yellow-400"/> STOKTAN PARÇA SEÇ</h3><button onClick={() => setIsStockModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white"/></button></div><div className="p-4 bg-[#0b0e14]"><div className="relative"><input type="text" value={stockSearchTerm} onChange={(e) => { setStockSearchTerm(e.target.value); if(e.target.value.length>1) handleStockSearch(); }} className="w-full bg-[#151921] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-yellow-500" placeholder="Parça ara..." autoFocus/><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/></div></div><div className="flex-1 overflow-y-auto p-2 space-y-1">{stockResults.map((part) => (<button key={part.id} onClick={() => addPartToJob(part)} className="w-full flex justify-between items-center p-3 hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700 transition-all group text-left"><div><p className="text-sm font-bold text-white group-hover:text-yellow-400">{part.urun_adi}</p><p className="text-[10px] text-slate-500">{part.kategori} • Stok: {part.stok_adedi}</p></div><div className="text-right"><p className="text-xs font-bold text-slate-300">{part.satis_fiyati}₺</p></div></button>))}</div></div></div>)}
        {/* Wiki Modalı */}
        {isWikiModalOpen && (<div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-[#1e293b] rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[80vh]"><div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center"><h3 className="text-white font-bold flex items-center gap-2"><Book size={18} className="text-purple-400"/> AURA WIKI</h3><button onClick={() => setIsWikiModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white"/></button></div>{wikiViewMode==='search'?(<div className="p-6 flex-1 overflow-y-auto"><div className="relative mb-6"><input type="text" value={wikiSearchTerm} onChange={(e)=>setWikiSearchTerm(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleWikiSearch()} className="w-full bg-[#0b0e14] border border-slate-600 rounded-xl py-3 pl-11 pr-4 text-white focus:border-purple-500 outline-none" placeholder="Arıza ara..."/><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/><button onClick={handleWikiSearch} className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">ARA</button></div>{wikiResults.length>0?(<div className="space-y-3">{wikiResults.map((res:any)=>(<div key={res.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:bg-slate-800 transition-colors"><div className="flex justify-between items-start mb-2"><h4 className="text-purple-400 font-bold text-sm">{res.title}</h4><button onClick={()=>applyWikiSolution(res.solution_steps)} className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded font-bold">UYGULA</button></div><p className="text-slate-400 text-xs mb-2 line-clamp-2">{res.problem_desc}</p></div>))}</div>):(<div className="text-center py-10"><Book size={40} className="text-slate-700 mx-auto mb-3"/><p className="text-slate-400 font-bold">Sonuç Bulunamadı</p><button onClick={()=>{setWikiViewMode('add');setNewWikiEntry({...newWikiEntry,title:wikiSearchTerm,problem:formData.issue});}} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 mx-auto"><Plus size={14}/> YENİ EKLE</button></div>)}</div>):(<div className="p-6 flex-1 overflow-y-auto space-y-4"><div className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer hover:text-white mb-2" onClick={()=>setWikiViewMode('search')}><ArrowLeft size={14}/> Geri</div><div><label className="text-[10px] font-bold text-slate-500 mb-1 block">BAŞLIK</label><input type="text" value={newWikiEntry.title} onChange={(e)=>setNewWikiEntry({...newWikiEntry,title:e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-2.5 text-white text-sm"/></div><div><label className="text-[10px] font-bold text-slate-500 mb-1 block">SORUN</label><textarea value={newWikiEntry.problem} onChange={(e)=>setNewWikiEntry({...newWikiEntry,problem:e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-2.5 text-white text-sm h-20 resize-none"/></div><div><label className="text-[10px] font-bold text-slate-500 mb-1 block">ÇÖZÜM</label><textarea value={newWikiEntry.solution} onChange={(e)=>setNewWikiEntry({...newWikiEntry,solution:e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-2.5 text-white text-sm h-40 resize-none"/></div><button onClick={handleAddToWiki} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg">KAYDET</button></div>)}</div></div>)}
        {/* Onay Modalı */}
        {approvalModalOpen && (<div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-[#1e293b] p-6 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Zap size={18} className="text-purple-500"/> Ekstra İşlem Onayı</h3><input type="number" onChange={(e)=>setApprovalData({...approvalData,amount:Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mb-3 text-white font-bold" placeholder="Tutar"/><textarea onChange={(e)=>setApprovalData({...approvalData,desc:e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mb-4 text-white h-24 text-sm resize-none" placeholder="Açıklama..."></textarea><div className="flex gap-2"><button onClick={()=>setApprovalModalOpen(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg text-xs font-bold text-slate-300">İPTAL</button><button onClick={sendApprovalRequest} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-lg text-xs font-bold text-white shadow-lg">GÖNDER</button></div></div></div>)}
        
        {/* Yazdırma Şablonu */}
        <div id="printable-area" className="hidden bg-white text-black font-sans"><div className="p-10 w-full h-full box-border"><div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6"><div className="flex items-center gap-4"><img src="/image/aura-logo.png" className="h-16 w-auto object-contain"/><div><h1 className="text-3xl font-black text-cyan-600">AURA BİLİŞİM</h1><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">PROFESYONEL TEKNİK SERVİS</p></div></div><div className="text-right"><div className="text-4xl font-black text-slate-900">SERVİS FİŞİ</div><div className="flex flex-col items-end mt-1"><span className="text-lg font-bold bg-slate-100 px-3 py-1 rounded">NO: {formData.tracking_code || formData.id}</span><span className="text-sm text-slate-600 mt-1">{formData.date}</span></div></div></div><div className="grid grid-cols-2 gap-8 mb-6"><div className="border border-slate-300 rounded-lg p-4 bg-slate-50"><h3 className="font-bold border-b border-slate-300 mb-2 pb-1 text-sm uppercase text-slate-700">Müşteri Bilgileri</h3><div className="space-y-1 text-sm"><p><span className="font-bold text-slate-600">Ad Soyad:</span> {formData.customer}</p><p><span className="font-bold text-slate-600">Telefon:</span> {formData.phone}</p><p><span className="font-bold text-slate-600">Adres:</span> {formData.address || "Belirtilmemiş"}</p></div></div><div className="border border-slate-300 rounded-lg p-4 bg-slate-50"><h3 className="font-bold border-b border-slate-300 mb-2 pb-1 text-sm uppercase text-slate-700">Cihaz Bilgileri</h3><div className="space-y-1 text-sm"><p><span className="font-bold text-slate-600">Cihaz:</span> {formData.device}</p><p><span className="font-bold text-slate-600">Seri No:</span> {formData.serialNo}</p><p><span className="font-bold text-slate-600">Kategori:</span> {formData.category}</p></div></div></div><div className="grid grid-cols-3 gap-6 mb-6"><div className="col-span-1 border border-slate-300 rounded-lg p-3"><h4 className="font-bold text-xs uppercase mb-2 border-b border-slate-200 pb-1">Şikayet</h4><p className="text-xs italic">{formData.issue}</p></div><div className="col-span-1 border border-slate-300 rounded-lg p-3"><h4 className="font-bold text-xs uppercase mb-2 border-b border-slate-200 pb-1">Aksesuarlar</h4><div className="flex flex-wrap gap-1">{Array.isArray(formData.accessories) && formData.accessories.length > 0 ? formData.accessories.map((acc:string,i:number)=><span key={i} className="border border-slate-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{acc}</span>) : <span className="text-xs italic text-slate-400">Yok</span>}</div></div><div className="col-span-1 border border-slate-300 rounded-lg p-3"><h4 className="font-bold text-xs uppercase mb-2 border-b border-slate-200 pb-1">Kontrol</h4><div className="flex flex-wrap gap-1">{Array.isArray(formData.preCheck) && formData.preCheck.length > 0 ? formData.preCheck.map((chk:string)=><span key={chk} className="text-[10px]">☑ {chk}</span>) : <span className="text-xs italic text-slate-400">Temiz</span>}</div></div></div><div className="mt-auto"><div className="flex justify-between items-end border-t-2 border-black pt-4 mb-8"><div className="w-2/3 pr-8"><h5 className="text-[10px] font-bold uppercase mb-1">Yasal Bilgilendirme</h5><p className="text-[8px] text-justify leading-tight text-slate-600">1. Cihazlar 90 gün içinde alınmalıdır. 2. Sıvı temas garantisizdir. 3. Veri yedeği müşteriye aittir. 4. İşlem garantisi 6 aydır.</p></div><div className="w-1/3 text-right"><div className="text-sm font-bold text-slate-500 uppercase mb-1">TOPLAM</div><div className="text-3xl font-black text-slate-900">{formData.price.toLocaleString('tr-TR')} ₺</div><div className="text-[9px] text-slate-400 mt-1">KDV Dahil Değildir</div></div></div><div className="flex justify-between gap-8"><div className="w-1/2 text-center"><div className="h-16 border-b border-slate-400 mb-2"></div><span className="text-xs font-bold uppercase">MÜŞTERİ</span></div><div className="w-1/2 text-center"><div className="h-16 border-b border-slate-400 mb-2"></div><span className="text-xs font-bold uppercase">TEKNİSYEN</span></div></div></div></div></div>

        <style jsx global>{` @media print { @page { size: A4; margin: 0; } body { visibility: hidden; background-color: white; -webkit-print-color-adjust: exact; } .print\\:hidden { display: none !important; } #printable-area { visibility: visible; display: block !important; position: fixed; left: 0; top: 0; width: 210mm; height: 297mm; padding: 0; background-color: white; z-index: 9999; } #printable-area * { visibility: visible; } } `}</style>
    </div>
  );
}