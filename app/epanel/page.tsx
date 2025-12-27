"use client";

import { useEffect, useState } from "react";
import { 
  Users, Smartphone, Zap, Laptop, Box, 
  Activity, Wrench, CheckCircle2, Clock, 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  PieChart, ShoppingBag, BarChart3,
  Package, Truck, Coins, LayoutDashboard, Plus, Save, Trash2, Image as ImageIcon, Tag
} from "lucide-react";
import { 
  getWorkshopFromStorage, 
  getProductsFromStorage, 
  saveProductsToStorage, 
  fileToBase64, 
  Product, 
  generateId 
} from "@/utils/storage";

// --- YARDIMCI BİLEŞENLER (Senin Eski Tasarımın İçin Gerekli) ---
const ProgressBar = ({ width, color }: { width: string, color: string }) => (
  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
    <div className={`h-full ${color} transition-all duration-1000`} style={{ width: width }}></div>
  </div>
);

const ProcessBox = ({ title, count, percent, color, colorName, icon }: any) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 relative hover:bg-slate-800 transition-colors group">
    <div className="flex justify-between items-start mb-2">
       <span className={`${color} opacity-80 group-hover:opacity-100`}>{icon}</span>
       <span className="text-xl font-black text-white">{count}</span>
    </div>
    <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{title}</h4>
    <ProgressBar width={percent} color={colorName} />
  </div>
);

const StatRow = ({ icon, label, count, total, color }: any) => {
    const width = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="group">
            <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-400 group-hover:text-white transition-colors">
                <span className="flex items-center gap-2">{icon} {label}</span>
                <span>{count}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${width}%` }}></div>
            </div>
        </div>
    )
};

export default function YonetimPaneli() {
  // SEKME YÖNETİMİ
  const [activeTab, setActiveTab] = useState<"dashboard" | "store">("dashboard");
  
  // İSTATİSTİK STATE (Eski Tasarımın Tüm Verileri)
  const [stats, setStats] = useState({
    monthlyRevenue: 0, monthlyCost: 0, monthlyProfit: 0, profitMargin: 0,
    serviceCount: 0, potentialServiceRevenue: 0, activeServiceTotal: 0,
    waiting: 0, processing: 0, ready: 0,
    phone: 0, robot: 0, pc: 0, other: 0, topCategory: "",
    
    // Mağaza Detayları
    storeSoldThisMonth: 0, storeRevenue: 0, storeActiveTotal: 0,
    storePacking: 0, storeShipped: 0, storeCompleted: 0,
    
    // Stok
    stockList: [] as any[], totalStockValue: 0,
    
    // Ortalamalar
    avgServiceTicket: 0, avgStoreProfit: 0
  });

  // MAĞAZA YÖNETİM STATE
  const [products, setProducts] = useState<Product[]>([]);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formTag, setFormTag] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  // Sayfa açılınca verileri yükle
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    // 1. Verileri Çek
    const jobs = getWorkshopFromStorage();
    const storeProducts = getProductsFromStorage(); // YENİ DEPO
    
    setProducts(storeProducts);

    // 2. İstatistik Hesaplama
    let ciro = 0, maliyet = 0;
    let sCount = 0, sWaiting = 0, sProcessing = 0, sReady = 0, sFutureMoney = 0;
    let catPhone = 0, catRobot = 0, catPc = 0, catOther = 0;
    let mRevenue = 0, mSoldCount = 0, mStockVal = 0;
    let activeStockList: any[] = [];

    // Servis Verileri
    jobs.forEach((job: any) => {
        if (job.status === "Teslim Edildi") {
             ciro += Number(job.price) || 0;
             sCount++;
        } else {
             sFutureMoney += Number(job.price) || 0;
             if (job.status === "Bekliyor") sWaiting++;
             if (job.status === "İşlemde") sProcessing++;
             if (job.status === "Hazır") sReady++;
             
             if (job.category === "Cep Telefonu") catPhone++;
             else if (job.category === "Robot Süpürge") catRobot++;
             else if (job.category === "Bilgisayar") catPc++;
             else catOther++;
        }
    });

    // Vitrin/Mağaza Verileri
    storeProducts.forEach((prod: Product) => {
        // Fiyat temizleme
        const numericPrice = Number(prod.price.replace(/[^0-9]/g, '')) || 0;
        mStockVal += numericPrice;
        
        // Vitrin listesi (Son 5 ürün)
        if (activeStockList.length < 5) activeStockList.push(prod);
    });

    // Mağaza Satış İstatistikleri (Şimdilik Demo Veri ile UI dolsun diye hesaplıyoruz)
    // Gerçek satış modülü eklendiğinde burası güncellenir.
    const demoSold = 0; 
    const demoStoreRevenue = 0;

    setStats({
       monthlyRevenue: ciro + demoStoreRevenue,
       monthlyCost: maliyet,
       monthlyProfit: (ciro + demoStoreRevenue) * 0.6,
       profitMargin: 40,
       
       serviceCount: sCount,
       potentialServiceRevenue: sFutureMoney,
       activeServiceTotal: sWaiting + sProcessing + sReady,
       waiting: sWaiting, processing: sProcessing, ready: sReady,
       phone: catPhone, robot: catRobot, pc: catPc, other: catOther,
       topCategory: "Cep Telefonu",
       
       // Mağaza Detayları (UI boş kalmasın diye)
       storeSoldThisMonth: demoSold,
       storeRevenue: demoStoreRevenue,
       storeActiveTotal: 0, 
       storePacking: 0, 
       storeShipped: 0, 
       storeCompleted: demoSold,
       
       stockList: activeStockList,
       totalStockValue: mStockVal,
       
       avgServiceTicket: sCount > 0 ? ciro / sCount : 0,
       avgStoreProfit: 0
    });
  };

  // --- ÜRÜN EKLEME FONKSİYONLARI ---
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setPreviewUrl(base64);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: generateId(),
      name: formName,
      price: formPrice.includes("₺") ? formPrice : `${formPrice}₺`,
      tag: formTag,
      category: "Genel",
      stock: 1,
      image: previewUrl || "bg-gradient-to-br from-gray-900 to-slate-800"
    };

    const updatedList = [...products, newProduct];
    saveProductsToStorage(updatedList); 
    setProducts(updatedList);
    loadAllData();
    
    setFormName(""); setFormPrice(""); setFormTag(""); setPreviewUrl("");
    alert("Ürün başarıyla eklendi! Ana sayfayı kontrol edebilirsin.");
  };

  const handleDeleteProduct = (id: string) => {
    if(confirm("Silmek istediğine emin misin?")) {
        const filtered = products.filter(p => p.id !== id);
        saveProductsToStorage(filtered);
        setProducts(filtered);
        loadAllData();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 pb-20 font-sans">
      
      {/* HEADER & SEKME BUTONLARI */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-800 pb-4 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span className="text-cyan-500">|ıIı</span> KOMUTA MERKEZİ
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                Aralık 2025 Finansal & Operasyonel Raporu
            </p>
          </div>
          
          {/* SEKME GEÇİŞLERİ */}
          <div className="flex gap-2 bg-[#0f172a] p-1 rounded-lg border border-slate-800">
             <button 
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
             >
                <LayoutDashboard size={14}/> Genel Bakış
             </button>
             <button 
                onClick={() => setActiveTab("store")}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'store' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white'}`}
             >
                <ShoppingBag size={14}/> Mağaza Yönetimi
             </button>
          </div>
      </div>

      {/* --- TAB 1: ESKİ DETAYLI DASHBOARD (GERİ GELDİ) --- */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* 1. ÜST KARTLAR (4'lü) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-all">
                     <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider mb-1">TOPLAM CİRO (BU AY)</p>
                     <h2 className="text-3xl font-bold text-white mb-2">{stats.monthlyRevenue.toLocaleString('tr-TR')} ₺</h2>
                     <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-200 flex items-center gap-1"><Wrench size={10}/> {stats.serviceCount} Servis</span>
                     </div>
                     <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800/50 w-16 h-16 group-hover:scale-110 transition-transform"/>
                </div>

                <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-emerald-900/30 transition-all">
                     <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">NET KÂR (CEBE GİREN)</p>
                     <h2 className="text-3xl font-bold text-emerald-400 mb-2">{stats.monthlyProfit.toLocaleString('tr-TR')} ₺</h2>
                     <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="text-emerald-500 font-bold">%40</span> Kâr Marjı
                     </div>
                     <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-900/40 w-16 h-16 group-hover:scale-110 transition-transform"/>
                </div>

                <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-red-900/30 transition-all">
                     <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">TOPLAM MALİYET</p>
                     <h2 className="text-3xl font-bold text-white mb-2">{stats.monthlyCost.toLocaleString('tr-TR')} ₺</h2>
                     <div className="flex items-center gap-2 text-[10px] text-slate-400">Parça & Ürün Alışı</div>
                     <TrendingDown className="absolute right-4 top-1/2 -translate-y-1/2 text-red-900/40 w-16 h-16 group-hover:scale-110 transition-transform"/>
                </div>

                <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-yellow-900/30 transition-all">
                     <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider mb-1">BEKLEYEN ALACAK</p>
                     <h2 className="text-3xl font-bold text-white mb-2">{stats.potentialServiceRevenue.toLocaleString('tr-TR')} ₺</h2>
                     <div className="flex items-center gap-2 text-[10px] text-slate-400"><Clock size={12}/> Serviste Teslim Bekleyen</div>
                     <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-900/40 w-16 h-16 group-hover:scale-110 transition-transform"/>
                </div>
             </div>

             {/* 2. ORTA BÖLÜM GRID */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SOL GENİŞ KOLON */}
                <div className="lg:col-span-2 space-y-6">
                     
                     {/* ATÖLYE HAREKETLİLİĞİ */}
                     <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold flex items-center gap-2 text-sm text-white"><span className="text-cyan-500"><Activity size={18}/></span> ATÖLYE HAREKETLİLİĞİ</h3>
                            <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded">AKTİF CİHAZ: {stats.activeServiceTotal}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <ProcessBox title="Sırada Bekleyen" count={stats.waiting} percent={stats.activeServiceTotal > 0 ? `${(stats.waiting/stats.activeServiceTotal)*100}%` : '0%'} color="text-yellow-500" colorName="bg-yellow-500" icon={<Clock size={20}/>}/>
                            <ProcessBox title="İşlem Gören" count={stats.processing} percent={stats.activeServiceTotal > 0 ? `${(stats.processing/stats.activeServiceTotal)*100}%` : '0%'} color="text-blue-500" colorName="bg-blue-500" icon={<Wrench size={20}/>}/>
                            <ProcessBox title="Teslime Hazır" count={stats.ready} percent={stats.activeServiceTotal > 0 ? `${(stats.ready/stats.activeServiceTotal)*100}%` : '0%'} color="text-emerald-500" colorName="bg-emerald-500" icon={<CheckCircle2 size={20}/>}/>
                        </div>
                     </div>

                     {/* SATIŞ & E-TİCARET (SENİN İSTEDİĞİN GERİ GELDİ) */}
                     <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold flex items-center gap-2 text-sm text-white"><span className="text-purple-500"><ShoppingBag size={18}/></span> SATIŞ & E-TİCARET</h3>
                            <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded">BU AY SİPARİŞ: {stats.storeActiveTotal}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <ProcessBox title="Paketleme / Hazırlık" count={stats.storePacking} percent="10%" color="text-purple-500" colorName="bg-purple-500" icon={<Package size={20}/>}/>
                            <ProcessBox title="Kargolanan" count={stats.storeShipped} percent="20%" color="text-blue-400" colorName="bg-blue-400" icon={<Truck size={20}/>}/>
                            <ProcessBox title="Tamamlanan" count={stats.storeCompleted} percent="100%" color="text-emerald-500" colorName="bg-emerald-500" icon={<Coins size={20}/>}/>
                        </div>
                     </div>

                     {/* DETAYLAR & ORTALAMALAR (GERİ GELDİ) */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#151a25] border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-lg">
                             <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                                 <div>
                                     <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">ORTALAMA ONARIM ÜCRETİ</span>
                                     <div className="text-xl font-bold text-cyan-400 flex items-center gap-2"><Wrench size={18}/> {stats.avgServiceTicket.toLocaleString('tr-TR')} ₺</div>
                                 </div>
                             </div>
                             <div className="p-5 bg-purple-500/5 flex justify-between items-center">
                                 <div>
                                     <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">ORTALAMA SATIŞ KÂRI</span>
                                     <div className="text-xl font-bold text-purple-400 flex items-center gap-2"><ShoppingBag size={18}/> {stats.avgStoreProfit.toLocaleString('tr-TR')} ₺</div>
                                 </div>
                             </div>
                        </div>

                        <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
                             <div>
                                 <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase">BAŞARI ORANI</div>
                                 <div className="text-4xl font-black text-white tracking-tight">%98.5</div>
                             </div>
                             <div className="text-right">
                                 <div className="bg-emerald-500/10 p-3 rounded-full inline-block mb-2"><CheckCircle2 size={32} className="text-emerald-500"/></div>
                             </div>
                        </div>
                     </div>
                </div>

                {/* SAĞ DAR KOLON */}
                <div className="space-y-6">
                    {/* SERVİSTEKİ CİHAZLAR */}
                    <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2"><PieChart className="text-purple-500" size={18}/> SERVİSTEKİ CİHAZLAR</h3>
                        <div className="space-y-4">
                            <StatRow icon={<Smartphone size={14}/>} label="Telefon" count={stats.phone} total={stats.activeServiceTotal} color="bg-purple-500"/>
                            <StatRow icon={<Zap size={14}/>} label="Robot" count={stats.robot} total={stats.activeServiceTotal} color="bg-orange-500"/>
                            <StatRow icon={<Laptop size={14}/>} label="Bilgisayar" count={stats.pc} total={stats.activeServiceTotal} color="bg-blue-500"/>
                            <StatRow icon={<Box size={14}/>} label="Diğer" count={stats.other} total={stats.activeServiceTotal} color="bg-slate-500"/>
                        </div>
                    </div>

                    {/* VİTRİN LİSTESİ (CANLI) */}
                    <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm text-white flex items-center gap-2"><Package size={16} className="text-yellow-500"/> SATIŞ STOK (VİTRİN)</h3>
                            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded">Aktif</span>
                        </div>
                        <div className="space-y-3">
                            {stats.stockList.length === 0 ? (
                                <div className="text-center text-xs text-slate-600 py-4">Vitrin boş. 'Mağaza Yönetimi'nden ekleyin.</div>
                            ) : (
                                stats.stockList.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-slate-800/50 last:border-0">
                                        <span className="flex items-center gap-2 text-slate-400 truncate max-w-[150px]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0"></span> {item.name}
                                        </span>
                                        <span className="text-white font-semibold">{item.price}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-[11px] text-slate-500">Toplam Vitrin Değeri</span>
                            <span className="text-sm font-bold text-emerald-400">{stats.totalStockValue.toLocaleString()} ₺</span>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* --- TAB 2: MAĞAZA YÖNETİMİ (ÜRÜN EKLEME) --- */}
      {activeTab === "store" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* ÜRÜN EKLEME FORMU */}
            <div className="bg-[#151a25] p-6 rounded-2xl border border-slate-800 h-fit shadow-xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-slate-800 pb-4">
                    <Plus size={20} className="text-green-400"/> Yeni Ürün Ekle
                </h2>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">ÜRÜN ADI</label>
                        <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" placeholder="Örn: iPhone 15 Pro" value={formName} onChange={e=>setFormName(e.target.value)} required/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">FİYAT</label>
                            <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" placeholder="50.000" value={formPrice} onChange={e=>setFormPrice(e.target.value)} required/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">ETİKET</label>
                            <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" placeholder="Fırsat" value={formTag} onChange={e=>setFormTag(e.target.value)}/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">GÖRSEL</label>
                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-800 transition relative group">
                             <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"/>
                             {previewUrl ? (
                                <img src={previewUrl} className="h-32 mx-auto object-contain rounded-lg"/>
                             ) : (
                                <div className="flex flex-col items-center py-4">
                                    <ImageIcon className="mb-2 text-slate-500 group-hover:text-cyan-400 transition-colors"/> 
                                    <span className="text-slate-500 text-xs">Görsel Seçmek İçin Tıkla</span>
                                </div>
                             )}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl flex justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"><Save size={18}/> Ürünü Vitrine Koy</button>
                </form>
            </div>

            {/* MEVCUT LİSTE */}
            <div className="lg:col-span-2 bg-[#151a25] p-6 rounded-2xl border border-slate-800 shadow-xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-slate-800 pb-4">
                    <Package size={20} className="text-purple-400"/> Mevcut Stok & Vitrin
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {products.length === 0 ? (
                        <div className="col-span-2 text-center py-10 text-slate-500 bg-[#020617] rounded-xl border border-slate-800 border-dashed">
                            Henüz ürün eklenmemiş. Soldaki formu kullanın.
                        </div>
                    ) : (
                        products.map(product => (
                            <div key={product.id} className="flex items-center gap-4 bg-[#020617] p-3 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition group">
                                {product.image && (product.image.startsWith("data:") || product.image.startsWith("http")) ? 
                                    <img src={product.image} className="w-16 h-16 object-cover rounded-lg bg-white/5"/> : 
                                    <div className={`w-16 h-16 rounded-lg ${product.image} flex items-center justify-center`}><Package className="text-white/20"/></div>
                                }
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white text-sm truncate">{product.name}</h4>
                                    <p className="text-cyan-400 font-mono text-xs">{product.price}</p>
                                    {product.tag && <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 mt-1 inline-block">{product.tag}</span>}
                                </div>
                                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Sil">
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
}