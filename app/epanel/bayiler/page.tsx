"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { 
  Briefcase, Search, Plus, Building2, TrendingUp, Save, 
  X, CheckCircle2, Shield, Settings, Laptop, User, Phone, Mail, Box
} from "lucide-react";
import DealerEditModal from "@/components/DealerEditModal";

export default function BayilerPage() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Genel İstatistikler
  const [stats, setStats] = useState({
    totalDealers: 0,
    activeDevices: 0,
    totalRevenue: 0
  });

  // Modal Durumları
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<any>(null);

  // Cihaz Kayıt Formu
  const [newDevice, setNewDevice] = useState({
    device: "", model: "", serial_no: "", problem: "", password: ""
  });

  // VERİLERİ ÇEKME
  const fetchData = async () => {
    setLoading(true);
    
    // 1. Onaylı Bayileri Çek
    const { data: dealerData } = await supabase
        .from('bayi_basvurulari')
        .select('*')
        .eq('durum', 'Onaylandı')
        .order('sirket_adi', { ascending: true });

    // 2. İşleri Çek (İstatistik hesaplamak için)
    const { data: jobData } = await supabase.from('aura_jobs').select('*');

    // 3. Teknisyen Listesi (Atama yapmak için opsiyonel)
    // Eğer personel tablonuz varsa oradan çekebilirsiniz, şimdilik mock data:
    setTechnicians([
        { id: 'tech1', ad_soyad: 'Baş Teknisyen', rol: 'Usta' },
        { id: 'tech2', ad_soyad: 'Yazılım Uzmanı', rol: 'Yazılımcı' }
    ]);

    if (dealerData && jobData) {
        // Bayi verilerini zenginleştir
        const enrichedDealers = dealerData.map(dealer => {
            // Bu bayiye ait işleri bul (İsim eşleşmesi veya customer_type='Bayi' kontrolü)
            const dealerJobs = jobData.filter(job => 
                job.customer === dealer.sirket_adi || 
                (job.customer_type === 'Bayi' && job.customer.includes(dealer.sirket_adi))
            );

            const active = dealerJobs.filter(j => !['Teslim Edildi', 'İade'].includes(j.status)).length;
            const completed = dealerJobs.filter(j => j.status === 'Teslim Edildi').length;
            const revenue = dealerJobs.reduce((sum, job) => sum + (Number(job.price) || 0), 0);

            return {
                ...dealer,
                stats: {
                    totalJobs: dealerJobs.length,
                    activeJobs: active,
                    completedJobs: completed,
                    revenue: revenue
                }
            };
        });

        setDealers(enrichedDealers);
        
        // Genel Toplam İstatistikler
        setStats({
            totalDealers: enrichedDealers.length,
            activeDevices: enrichedDealers.reduce((sum, d) => sum + d.stats.activeJobs, 0),
            totalRevenue: enrichedDealers.reduce((sum, d) => sum + d.stats.revenue, 0)
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Modal Açma Fonksiyonları
  const openDeviceModal = (dealer: any) => {
      setSelectedDealer(dealer);
      setNewDevice({ device: "", model: "", serial_no: "", problem: "", password: "" }); // Formu sıfırla
      setIsDeviceModalOpen(true);
  };

  const openEditModal = (dealer: any) => {
      setSelectedDealer(dealer);
      setIsEditModalOpen(true);
  };

  // --- KRİTİK FONKSİYON: CİHAZ KAYDI ---
  const handleRegisterDevice = async () => {
    if (!newDevice.device || !newDevice.problem) return alert("Lütfen cihaz ve arıza bilgisini girin.");
    
    try {
        const { error } = await supabase.from('aura_jobs').insert([{
                customer: selectedDealer.sirket_adi, // Bayi ismi
                phone: selectedDealer.telefon,
                
                // --- BURASI ÇOK ÖNEMLİ ---
                customer_type: "Bayi",  // Otomatik olarak 'Bayi' olarak işaretliyoruz
                category: "Bayi Cihazı",
                // -------------------------
                
                device: `${newDevice.device} ${newDevice.model}`,
                serial_no: newDevice.serial_no,
                problem: newDevice.problem,
                password: newDevice.password,
                
                status: "Bekliyor",
                approval_status: 'none', // Onay durumu henüz yok
                
                tracking_code: `SRV-${Math.floor(10000 + Math.random() * 90000)}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
        }]);

        if (error) throw error;

        alert(`✅ Cihaz başarıyla ${selectedDealer.sirket_adi} hesabına eklendi! Bayi Atölye sayfasında görebilirsiniz.`);
        setIsDeviceModalOpen(false);
        fetchData(); // İstatistikleri güncellemek için yeniden çek
    } catch (error: any) {
        alert("Hata: " + error.message);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#0b0e14] text-white font-sans">
      
      {/* ÜST BAŞLIK & GENEL İSTATİSTİK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Briefcase className="text-indigo-500" size={32}/> Bayi Yönetimi
          </h1>
          <p className="text-slate-400 mt-1 font-medium">İş ortaklarınızı yönetin ve onlar adına servis kaydı oluşturun.</p>
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

      {/* ARAMA */}
      <div className="mb-6 relative max-w-md">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
         <input 
           type="text" 
           placeholder="Bayi adı veya yetkili ara..." 
           className="w-full bg-[#161b22] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {/* BAYİ LİSTESİ */}
      <div className="grid grid-cols-1 gap-4">
          {loading ? (
              <div className="text-center py-10 text-slate-500 animate-pulse">Veriler yükleniyor...</div>
          ) : dealers.filter(d => 
                d.sirket_adi?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                d.yetkili_kisi?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((dealer) => (
              <div key={dealer.id} className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-indigo-500/30 transition-all group shadow-lg">
                  
                  {/* Sol: Bayi Kartı */}
                  <div className="flex items-center gap-4 flex-1 w-full lg:w-auto">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center text-indigo-500 font-black text-2xl shadow-inner uppercase">
                          {dealer.sirket_adi.substring(0, 2)}
                      </div>
                      <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{dealer.sirket_adi}</h3>
                            {/* Paket Rozeti */}
                            {dealer.subscription_plan && (
                                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase tracking-wider">
                                    {dealer.subscription_plan}
                                </span>
                            )}
                          </div>
                          
                          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 font-medium">
                              <span className="flex items-center gap-1"><User size={12} className="text-slate-500"/> {dealer.yetkili_kisi}</span>
                              <span className="flex items-center gap-1"><Phone size={12} className="text-slate-500"/> {dealer.telefon}</span>
                          </div>
                      </div>
                  </div>

                  {/* Orta: Bayi Özel Metrikleri */}
                  <div className="flex items-center gap-8 w-full lg:w-auto justify-center lg:justify-start bg-[#0d1117]/50 p-3 rounded-xl border border-white/5">
                      <div className="text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">Teslim</div>
                          <div className="text-lg font-bold text-white">{dealer.stats.completedJobs}</div>
                      </div>
                      <div className="text-center px-4 border-x border-white/5">
                          <div className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">Atölye</div>
                          <div className="text-lg font-bold text-amber-500">{dealer.stats.activeJobs}</div>
                      </div>
                      <div className="text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">Ciro</div>
                          <div className="text-lg font-black text-green-400">₺{dealer.stats.revenue.toLocaleString()}</div>
                      </div>
                  </div>

                  {/* Sağ: Butonlar */}
                  <div className="flex items-center gap-2 w-full lg:w-auto">
                      <button 
                        onClick={() => openDeviceModal(dealer)} 
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-transform hover:scale-105 shadow-lg shadow-indigo-500/20"
                      >
                          <Plus size={16}/> Cihaz Ekle
                      </button>
                      
                      <button 
                        onClick={() => openEditModal(dealer)} 
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors" 
                        title="Bayi Ayarları ve Şifre"
                      >
                          <Settings size={18}/>
                      </button>
                  </div>
              </div>
          ))}
          
          {dealers.length === 0 && !loading && (
              <div className="text-center py-10 text-slate-500">Kayıtlı onaylı bayi bulunamadı.</div>
          )}
      </div>

      {/* MODALLAR */}
      
      {/* 1. Cihaz Ekleme Modalı */}
      {isDeviceModalOpen && selectedDealer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-[#161b22] border border-indigo-500/30 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                  <div className="bg-[#0d1117] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                      <div>
                          <h3 className="text-lg font-bold text-white">Servis Kaydı Oluştur</h3>
                          <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{selectedDealer.sirket_adi} ADINA</p>
                      </div>
                      <button onClick={() => setIsDeviceModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      {/* Form Alanları */}
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500">Cihaz</label>
                              <input type="text" placeholder="Örn: iPhone 13" className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-indigo-500 outline-none" value={newDevice.device} onChange={(e) => setNewDevice({...newDevice, device: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500">Model</label>
                              <input type="text" placeholder="Pro Max" className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-indigo-500 outline-none" value={newDevice.model} onChange={(e) => setNewDevice({...newDevice, model: e.target.value})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500">Seri No / IMEI</label>
                              <input type="text" placeholder="İsteğe bağlı" className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-indigo-500 outline-none" value={newDevice.serial_no} onChange={(e) => setNewDevice({...newDevice, serial_no: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500">Ekran Şifresi</label>
                              <input type="text" placeholder="123456" className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-indigo-500 outline-none" value={newDevice.password} onChange={(e) => setNewDevice({...newDevice, password: e.target.value})} />
                          </div>
                      </div>
                      <div className="space-y-1">
                           <label className="text-xs font-bold text-slate-500">Arıza / Şikayet</label>
                           <textarea className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-indigo-500 outline-none h-20 resize-none" placeholder="Sorun nedir?" value={newDevice.problem} onChange={(e) => setNewDevice({...newDevice, problem: e.target.value})}></textarea>
                      </div>
                  </div>
                  <div className="p-6 border-t border-white/5 bg-[#0d1117]">
                      <button onClick={handleRegisterDevice} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                          <Save size={18}/> KAYDET VE ATÖLYEYE GÖNDER
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* 2. Bayi Düzenleme Modalı */}
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