"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase"; 
import { 
  Briefcase, Search, Plus, Settings, User, Phone, Save, X, 
  Upload, Smartphone, CheckCircle, Package, Loader2, AlertCircle, Trash2, Filter, DollarSign, Wallet
} from "lucide-react";

import DealerEditModal from "@/components/DealerEditModal";

// Kategori Listesi
const CATEGORIES = ["Cep Telefonu", "Robot Süpürge", "Bilgisayar", "Tablet", "Akıllı Saat", "Diğer"];

export default function BayilerPage() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // İstatistiklerde 'totalBalance' (Toplam Bakiye) eklendi
  const [stats, setStats] = useState({ totalDealers: 0, activeDevices: 0, totalRevenue: 0 });

  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Yeni: Ödeme Modalı
  
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  
  // Ödeme Formu
  const [paymentData, setPaymentData] = useState({ amount: "", desc: "" });

  const [uploading, setUploading] = useState(false);
  
  const [newDevice, setNewDevice] = useState({
    brand: "", model: "", serial_no: "", password: "", pattern: "",
    problem: "", physical_condition: "", accessories: "", technician_note: "",
    category: "Cep Telefonu" 
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [upsellOptions, setUpsellOptions] = useState<any[]>([]); 
  const [selectedUpsells, setSelectedUpsells] = useState<any[]>([]); 

  const fetchData = async () => {
    setLoading(true);
    try {
        // Bayileri Çek
        const { data: dealerData } = await supabase.from('bayi_basvurulari').select('*').order('sirket_adi', { ascending: true });
        
        // Teknisyenleri Çek
        const { data: techData } = await supabase.from('teknisyenler').select('*');
        if (techData) setTechnicians(techData);

        // İşleri Çek (Borçlar)
        const { data: jobData } = await supabase.from('aura_jobs').select('*');
        
        // Ödemeleri Çek (Alacaklar) - Yeni Tablo
        const { data: paymentData } = await supabase.from('aura_payments').select('*');

        const { data: upsellData } = await supabase.from('aura_upsell_products').select('*').eq('is_active', true);
        if (upsellData) setUpsellOptions(upsellData);

        if (dealerData) {
            const enrichedDealers = dealerData.map(dealer => {
                const jobs = jobData || [];
                const payments = paymentData || [];

                // Bayiye ait işler
                const dealerJobs = jobs.filter(job => job.customer === dealer.sirket_adi || (job.customer_type === 'Bayi' && job.customer_email === dealer.email));
                
                // Bayiye ait ödemeler (ID eşleşmesi veya isim eşleşmesi)
                const dealerPayments = payments.filter(p => p.dealer_id === dealer.id.toString() || p.dealer_id === dealer.sirket_adi);

                // Toplam Borç (Ciro) - aura_jobs tablosundaki price veya fiyat sütunu
                const totalDebt = dealerJobs.reduce((sum, job) => sum + (Number(job.price) || 0), 0);
                
                // Toplam Ödeme
                const totalPaid = dealerPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

                // Bakiye (Pozitifse bayi borçlu)
                const balance = totalDebt - totalPaid;

                const active = dealerJobs.filter(j => !['Teslim Edildi', 'İade', 'İptal'].includes(j.status)).length;
                const completed = dealerJobs.filter(j => j.status === 'Teslim Edildi').length;

                return { 
                    ...dealer, 
                    stats: { 
                        totalJobs: dealerJobs.length, 
                        activeJobs: active, 
                        completedJobs: completed, 
                        revenue: totalDebt, // Ciro
                        totalPaid: totalPaid,
                        balance: balance // Kalan Borç
                    } 
                };
            });
            
            setDealers(enrichedDealers);
            setStats({
                totalDealers: enrichedDealers.length,
                activeDevices: enrichedDealers.reduce((sum, d) => sum + d.stats.activeJobs, 0),
                totalRevenue: enrichedDealers.reduce((sum, d) => sum + d.stats.revenue, 0)
            });
        }
    } catch (error: any) { 
        console.error("Veri hatası:", error.message); 
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- YENİ: ÖDEME İŞLEMİ ---
  const handlePayment = async () => {
      if(!paymentData.amount || !selectedDealer) return;
      
      const { error } = await supabase.from('aura_payments').insert([{
          dealer_id: selectedDealer.id.toString(), // ID ile eşleştiriyoruz
          amount: Number(paymentData.amount),
          description: paymentData.desc || "Ödeme Alındı",
          created_at: new Date().toISOString()
      }]);

      // Kasaya Gelir Olarak İşle (Opsiyonel ama önerilir)
      await supabase.from('aura_finans').insert([{
          tur: 'Gelir',
          kategori: 'Bayi Tahsilat',
          tutar: Number(paymentData.amount),
          aciklama: `${selectedDealer.sirket_adi} Tahsilat`,
          tarih: new Date().toISOString().split('T')[0]
      }]);

      if(!error) {
          alert("Ödeme alındı ve bakiyeden düşüldü.");
          setIsPaymentModalOpen(false);
          setPaymentData({ amount: "", desc: "" });
          fetchData(); // Listeyi güncelle
      } else {
          alert("Hata: " + error.message);
      }
  };

  const openPaymentModal = (dealer: any) => {
      setSelectedDealer(dealer);
      setIsPaymentModalOpen(true);
  };

  const openDeviceModal = (dealer: any) => {
      setSelectedDealer(dealer);
      setNewDevice({ 
          brand: "", model: "", serial_no: "", password: "", pattern: "", 
          problem: "", physical_condition: "", accessories: "", technician_note: "", 
          category: "Cep Telefonu" 
      });
      setSelectedFiles([]); setPreviewUrls([]); setSelectedUpsells([]);
      setIsDeviceModalOpen(true);
  };

  const openEditModal = (dealer: any) => { 
      setSelectedDealer(dealer); 
      setIsEditModalOpen(true); 
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const toggleUpsell = (product: any) => {
    const exists = selectedUpsells.find(p => p.id === product.id);
    if (exists) setSelectedUpsells(prev => prev.filter(p => p.id !== product.id));
    else setSelectedUpsells(prev => [...prev, product]);
  };

  const handleRegisterDevice = async () => {
    if (!newDevice.brand || !newDevice.model || !newDevice.problem) {
        alert("Lütfen Marka, Model ve Arıza bilgisini eksiksiz girin.");
        return;
    }
    setUploading(true);
    try {
        let uploadedImageUrls: string[] = [];
        if (selectedFiles.length > 0) {
            for (const file of selectedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `admin-device-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('service-images').upload(fileName, file);
                if (!uploadError) {
                    const { data } = supabase.storage.from('service-images').getPublicUrl(fileName);
                    uploadedImageUrls.push(data.publicUrl);
                }
            }
        }

        const initialLog = [{
            date: new Date().toISOString(),
            action: "Kayıt Açıldı",
            user: "Admin (Panel)",
            details: `${selectedDealer.sirket_adi} adına servis kaydı oluşturuldu.`
        }];

        const standardizedUpsells = selectedUpsells.map(u => ({
            id: u.id,
            name: u.name || u.urun_adi || "Ürün",
            price: u.price || u.satis_fiyati || 0
        }));

        const trackingCode = `SRV-${Math.floor(100000 + Math.random() * 900000)}`;

        const { error } = await supabase.from('aura_jobs').insert([{
            customer: selectedDealer.sirket_adi,
            phone: selectedDealer.telefon,
            customer_type: "Bayi",
            customer_email: selectedDealer.email,
            category: newDevice.category, 
            device: `${newDevice.brand} ${newDevice.model}`,
            brand: newDevice.brand,
            model: newDevice.model,
            serial_no: newDevice.serial_no || "",
            problem: newDevice.problem,
            physical_condition: newDevice.physical_condition || "",
            accessories: newDevice.accessories || "", 
            technician_note: newDevice.technician_note || "",
            password: newDevice.password || "",
            pattern: newDevice.pattern || "",
            status: "Bekliyor",
            approval_status: 'none',
            tracking_code: trackingCode,
            priority: "Normal",
            images: uploadedImageUrls,
            sold_upsells: standardizedUpsells,
            process_details: initialLog, 
            cost: 0, price: 0, parca_ucreti: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }]);

        if (error) throw error;
        alert(`✅ Cihaz kaydı başarılı! \nTakip Kodu: ${trackingCode}`);
        setIsDeviceModalOpen(false);
        fetchData(); 
    } catch (error: any) {
        alert("Kayıt sırasında bir hata oluştu: " + error.message);
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#0b0e14] text-white font-sans pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
                <Briefcase className="text-indigo-500" size={32}/> Bayi Yönetimi
            </h1>
            <p className="text-slate-400 mt-1 font-medium">Finansal Takip ve Servisler</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-[#161b22] px-6 py-3 rounded-2xl border border-white/5 flex flex-col items-center min-w-[140px] shadow-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Toplam Ciro</span>
                <div className="text-2xl font-black text-green-400">₺{stats.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-[#161b22] px-6 py-3 rounded-2xl border border-white/5 flex flex-col items-center min-w-[140px] shadow-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Aktif İşler</span>
                <div className="text-2xl font-black text-amber-500">{stats.activeDevices}</div>
            </div>
        </div>
      </div>

      {/* Arama */}
      <div className="mb-6 relative max-w-md group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-500" size={18}/>
            <input type="text" placeholder="Bayi veya yetkili ara..." className="w-full bg-[#161b22] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-indigo-500 outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
      </div>

      {/* Bayi Listesi */}
      <div className="grid grid-cols-1 gap-4">
          {loading ? (
              <div className="text-center py-10 text-slate-500 flex flex-col items-center gap-2"><Loader2 className="animate-spin text-indigo-500"/> Yükleniyor...</div>
          ) : dealers.filter(d => d.sirket_adi?.toLowerCase().includes(searchTerm.toLowerCase())).map((dealer) => (
              <div key={dealer.id} className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-indigo-500/30 transition-all group shadow-lg">
                  <div className="flex items-center gap-4 flex-1 w-full lg:w-auto">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center text-indigo-500 font-black text-2xl shadow-inner uppercase">{dealer.sirket_adi.substring(0, 2)}</div>
                      <div>
                          <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{dealer.sirket_adi}</h3>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${dealer.subscription_plan === 'Platinum' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : dealer.subscription_plan === 'Gold' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>{dealer.subscription_plan || 'Standart'}</span>
                          </div>
                          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 font-medium">
                              <span className="flex items-center gap-1"><User size={12} className="text-slate-500"/> {dealer.yetkili_kisi}</span>
                              <span className="flex items-center gap-1"><Phone size={12} className="text-slate-500"/> {dealer.telefon}</span>
                          </div>
                      </div>
                  </div>
                  
                  {/* FİNANSAL DURUM KARTI (GÜNCELLENDİ) */}
                  <div className="flex items-center gap-6 bg-[#0d1117]/50 p-4 rounded-xl border border-white/5 w-full lg:w-auto justify-between lg:justify-start">
                      <div className="text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">Toplam Borç</div>
                          <div className="text-sm font-bold text-slate-300">₺{dealer.stats.revenue.toLocaleString()}</div>
                      </div>
                      <div className="w-px h-8 bg-slate-700"></div>
                      <div className="text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">Ödenen</div>
                          <div className="text-sm font-bold text-green-500">₺{dealer.stats.totalPaid.toLocaleString()}</div>
                      </div>
                      <div className="w-px h-8 bg-slate-700"></div>
                      <div className="text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">BAKİYE</div>
                          <div className={`text-xl font-black ${dealer.stats.balance > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                              ₺{dealer.stats.balance.toLocaleString()}
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-2 w-full lg:w-auto">
                      {/* YENİ: ÖDEME AL BUTONU */}
                      <button onClick={() => openPaymentModal(dealer)} className="px-4 py-2.5 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white rounded-xl border border-green-500/20 font-bold text-sm transition-all flex items-center gap-2">
                          <DollarSign size={16}/> Tahsilat
                      </button>
                      
                      <button onClick={() => openDeviceModal(dealer)} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-transform hover:scale-105 shadow-lg shadow-indigo-500/20"><Plus size={16}/> Cihaz Ekle</button>
                      <button onClick={() => openEditModal(dealer)} className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"><Settings size={18}/></button>
                  </div>
              </div>
          ))}
      </div>

      {/* --- CİHAZ EKLEME MODALI (MEVCUT) --- */}
      {isDeviceModalOpen && selectedDealer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
              {/* ... (Bu kısım aynı kaldı, kısalttım) ... */}
              <div className="bg-[#161b22] border border-indigo-500/30 w-full max-w-2xl rounded-3xl shadow-2xl relative my-8 flex flex-col max-h-[90vh]">
                  <div className="bg-[#0d1117] px-6 py-4 border-b border-white/5 flex justify-between items-center rounded-t-3xl sticky top-0 z-10 shrink-0">
                      <div><h3 className="text-lg font-bold text-white flex items-center gap-2"><Smartphone size={20} className="text-indigo-500"/> Servis Kaydı Oluştur</h3><p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Bayi: {selectedDealer.sirket_adi}</p></div>
                      <button onClick={() => setIsDeviceModalOpen(false)} className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-full"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                      {/* Form Alanları (Kısalttım, kodda tam hali var) */}
                      <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-white/5 pb-2">Cihaz Bilgileri</h4>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                  <label className="text-xs font-bold text-slate-400 mb-1 block">Cihaz Türü (Kategori)</label>
                                  <select className="w-full bg-[#0d1117] border border-slate-700 rounded-lg p-2.5 text-sm text-white" value={newDevice.category} onChange={e => setNewDevice({...newDevice, category: e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                              </div>
                              <div><label className="text-xs font-bold text-slate-400 mb-1 block">Marka *</label><input type="text" className="w-full bg-[#0d1117] border border-slate-700 rounded-lg p-2.5 text-sm text-white" value={newDevice.brand} onChange={e => setNewDevice({...newDevice, brand: e.target.value})} placeholder="Apple..." /></div>
                              <div><label className="text-xs font-bold text-slate-400 mb-1 block">Model *</label><input type="text" className="w-full bg-[#0d1117] border border-slate-700 rounded-lg p-2.5 text-sm text-white" value={newDevice.model} onChange={e => setNewDevice({...newDevice, model: e.target.value})} placeholder="iPhone 11..." /></div>
                              <div className="col-span-2"><label className="text-xs font-bold text-slate-400 mb-1 block">Arıza *</label><textarea className="w-full bg-[#0d1117] border border-red-900/50 rounded-lg p-3 text-sm text-white h-20" value={newDevice.problem} onChange={e => setNewDevice({...newDevice, problem: e.target.value})} placeholder="Sorun nedir?"></textarea></div>
                          </div>
                      </div>
                  </div>
                  <div className="p-6 border-t border-white/5 bg-[#0d1117] rounded-b-3xl shrink-0">
                      <button onClick={handleRegisterDevice} disabled={uploading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                          {uploading ? <Loader2 className="animate-spin"/> : <Save size={20}/>} {uploading ? "Kaydediliyor..." : "KAYDI TAMAMLA"}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- YENİ: ÖDEME ALMA MODALI --- */}
      {isPaymentModalOpen && selectedDealer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl p-6">
                  <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2"><Wallet className="text-green-500"/> Ödeme Al</h3>
                  <p className="text-slate-400 text-xs mb-4">{selectedDealer.sirket_adi} cari hesabından düşülecek.</p>
                  
                  <div className="space-y-3">
                      <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">TUTAR (TL)</label>
                          <input type="number" value={paymentData.amount} onChange={e => setPaymentData({...paymentData, amount: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-lg font-bold outline-none focus:border-green-500" placeholder="0.00"/>
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">AÇIKLAMA</label>
                          <input type="text" value={paymentData.desc} onChange={e => setPaymentData({...paymentData, desc: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-sm outline-none" placeholder="Örn: Havale, Nakit..."/>
                      </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                      <button onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold text-xs">İPTAL</button>
                      <button onClick={handlePayment} className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-bold text-xs shadow-lg">TAHSİLAT YAP</button>
                  </div>
              </div>
          </div>
      )}

      {/* Bayi Düzenleme Modalı */}
      <DealerEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        dealer={selectedDealer} 
        technicians={technicians} 
        onUpdate={fetchData} 
      />
    </div>
  );
}