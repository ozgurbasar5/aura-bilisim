"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { 
  Building2, Search, Plus, Smartphone, CheckCircle2, 
  Clock, TrendingUp, Wallet, ArrowRight, X, Save, 
  Briefcase, MoreVertical, Filter, Laptop
} from "lucide-react";

export default function BayilerPage() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // İstatistikler için State
  const [stats, setStats] = useState({
    totalDealers: 0,
    totalDevices: 0,
    activeDevices: 0,
    totalRevenue: 0
  });

  // Modal ve Kayıt State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const [newDevice, setNewDevice] = useState({
    device: "",
    model: "",
    serial_no: "",
    problem: "",
    password: "" // Cihaz şifresi
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

    // 2. Tüm İşleri Çek (İstatistik hesaplamak için)
    // Not: Gerçek senaryoda 'customer' alanının bayi adıyla eşleştiğini varsayıyoruz.
    // İleride 'dealer_id' sütunu eklenerek daha sağlam yapılabilir.
    const { data: jobData } = await supabase.from('aura_jobs').select('*');

    if (dealerData && jobData) {
        // Bayi bazlı verileri birleştir
        const enrichedDealers = dealerData.map(dealer => {
            // Bu bayiye ait işleri filtrele
            const dealerJobs = jobData.filter(job => job.customer === dealer.sirket_adi);
            
            const active = dealerJobs.filter(j => j.status !== 'Teslim Edildi' && j.status !== 'İade').length;
            const completed = dealerJobs.filter(j => j.status === 'Teslim Edildi').length;
            // Ciro hesapla (fiyat sütunu olduğunu varsayıyoruz, yoksa 0)
            const revenue = dealerJobs.reduce((sum, job) => sum + (Number(job.fiyat) || 0), 0);

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

        // Genel Toplamlar
        setStats({
            totalDealers: enrichedDealers.length,
            totalDevices: jobData.length, // Sadece bayilerinkini almak istersen filtrele
            activeDevices: jobData.filter(j => j.status !== 'Teslim Edildi').length,
            totalRevenue: enrichedDealers.reduce((sum, d) => sum + d.stats.revenue, 0)
        });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CİHAZ KAYDI FONKSİYONU
  const handleRegisterDevice = async () => {
    if (!newDevice.device || !newDevice.problem) return alert("Lütfen cihaz ve arıza bilgisini girin.");

    try {
        const { error } = await supabase.from('aura_jobs').insert([
            {
                customer: selectedDealer.sirket_adi,
                phone: selectedDealer.telefon,
                customer_type: "Bayi", // Sütun adını kontrol et: customer_type
                category: "Bayi Cihazı",
                device: `${newDevice.device} ${newDevice.model}`,
                serial_no: newDevice.serial_no,
                problem: newDevice.problem, // 'complaint' yerine 'problem' kullanıyoruz
                password: newDevice.password,
                status: "Bekliyor",
                tracking_code: `SRV-${Math.floor(10000 + Math.random() * 90000)}`, // Takip kodu üretimi
                created_at: new Date().toISOString()
            }
        ]);

        if (error) {
            console.error("Supabase Hatası:", error.message);
            alert("Hata: " + error.message); // Hatayı ekranda görerek teşhis edebilirsin
            return;
        }

        alert("Cihaz başarıyla atölyeye kaydedildi!");
        setIsModalOpen(false);
        // ... (formu temizleme kodları)
    } catch (error) {
        console.error("Genel Hata:", error);
    }
};

  const openRegisterModal = (dealer: any) => {
      setSelectedDealer(dealer);
      setIsModalOpen(true);
  };

  return (
    <div className="p-8 min-h-screen bg-[#0b0e14] text-white font-sans">
      
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Briefcase className="text-amber-500" size={32}/> Bayi Yönetim Paneli
          </h1>
          <p className="text-slate-400 mt-1 font-medium">İş ortaklarınızı ve servis performanslarını yönetin.</p>
        </div>
        
        {/* İSTATİSTİK KARTLARI */}
        <div className="flex gap-4">
            <div className="bg-[#161b22] px-5 py-3 rounded-2xl border border-white/5 flex flex-col items-center min-w-[120px]">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Toplam Ciro</span>
                <div className="text-xl font-black text-green-400">₺{stats.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-[#161b22] px-5 py-3 rounded-2xl border border-white/5 flex flex-col items-center min-w-[120px]">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Aktif Cihaz</span>
                <div className="text-xl font-black text-amber-500">{stats.activeDevices}</div>
            </div>
        </div>
      </div>

      {/* ARAMA VE FİLTRE */}
      <div className="mb-6 relative max-w-md">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-slate-500" size={18}/>
         </div>
         <input 
           type="text" 
           placeholder="Bayi adı veya yetkili ara..." 
           className="w-full bg-[#161b22] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-600 text-sm font-medium"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {/* BAYİ LİSTESİ */}
      <div className="grid grid-cols-1 gap-4">
          {loading ? (
              <div className="text-center py-10 text-slate-500 animate-pulse">Veriler yükleniyor...</div>
          ) : dealers.filter(d => d.sirket_adi.toLowerCase().includes(searchTerm.toLowerCase())).map((dealer) => (
              <div key={dealer.id} className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-amber-500/30 transition-all group">
                  
                  {/* Sol: Bayi Bilgisi */}
                  <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 flex items-center justify-center text-amber-500 font-bold text-xl shadow-lg">
                          {dealer.sirket_adi.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{dealer.sirket_adi}</h3>
                          <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1"><Building2 size={12}/> {dealer.yetkili_kisi}</span>
                              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                              <span>{dealer.telefon}</span>
                          </div>
                      </div>
                  </div>

                  {/* Orta: Performans Metrikleri */}
                  <div className="flex items-center gap-8">
                      <div className="text-center">
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Teslim Edilen</div>
                          <div className="text-lg font-bold text-white">{dealer.stats.completedJobs}</div>
                      </div>
                      <div className="text-center">
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Atölyedeki</div>
                          <div className="text-lg font-bold text-amber-500">{dealer.stats.activeJobs}</div>
                      </div>
                      <div className="text-center border-l border-white/10 pl-8">
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Toplam Hacim</div>
                          <div className="text-lg font-black text-green-400">₺{dealer.stats.revenue.toLocaleString()}</div>
                      </div>
                  </div>

                  {/* Sağ: Aksiyonlar */}
                  <div className="flex items-center gap-3">
                      <button 
                        onClick={() => openRegisterModal(dealer)}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-transform hover:scale-105 shadow-lg shadow-amber-500/20"
                      >
                          <Plus size={18}/> Cihaz Ekle
                      </button>
                      <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors">
                          <TrendingUp size={18}/>
                      </button>
                  </div>
              </div>
          ))}
      </div>

      {/* CİHAZ KAYIT MODALI */}
      {isModalOpen && selectedDealer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-[#161b22] border border-amber-500/30 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                  
                  {/* Modal Header */}
                  <div className="bg-[#0d1117] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                      <div>
                          <h3 className="text-lg font-bold text-white">Hızlı Cihaz Kaydı</h3>
                          <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">{selectedDealer.sirket_adi} ADINA</p>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Cihaz Türü</label>
                              <select 
                                value={newDevice.device} 
                                onChange={(e) => setNewDevice({...newDevice, device: e.target.value})}
                                className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-amber-500 outline-none"
                              >
                                  <option value="">Seçiniz...</option>
                                  <option value="iPhone">iPhone</option>
                                  <option value="Samsung">Samsung</option>
                                  <option value="Robot Süpürge">Robot Süpürge</option>
                                  <option value="MacBook">MacBook</option>
                                  <option value="Laptop">Laptop</option>
                                  <option value="Tablet">Tablet</option>
                              </select>
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Model</label>
                              <input 
                                type="text" 
                                placeholder="Örn: 13 Pro" 
                                className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-amber-500 outline-none"
                                value={newDevice.model}
                                onChange={(e) => setNewDevice({...newDevice, model: e.target.value})}
                              />
                          </div>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Seri No (Opsiyonel)</label>
                          <input 
                            type="text" 
                            placeholder="IMEI / SN..." 
                            className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-amber-500 outline-none"
                            value={newDevice.serial_no}
                            onChange={(e) => setNewDevice({...newDevice, serial_no: e.target.value})}
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Şikayet / Arıza</label>
                          <textarea 
                            className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-amber-500 outline-none h-24 resize-none"
                            placeholder="Cihazın sorunu nedir?"
                            value={newDevice.problem}
                            onChange={(e) => setNewDevice({...newDevice, problem: e.target.value})}
                          ></textarea>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Ekran Şifresi (Varsa)</label>
                          <input 
                            type="text" 
                            placeholder="123456" 
                            className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-amber-500 outline-none"
                            value={newDevice.password}
                            onChange={(e) => setNewDevice({...newDevice, password: e.target.value})}
                          />
                      </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-white/5 bg-[#0d1117]">
                      <button 
                        onClick={handleRegisterDevice}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black py-4 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                      >
                          <Save size={18}/> KAYDI TAMAMLA
                      </button>
                  </div>

              </div>
          </div>
      )}

    </div>
  );
}