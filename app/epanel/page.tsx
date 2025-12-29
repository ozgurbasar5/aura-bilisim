"use client";

import { useEffect, useState } from "react";
import { 
  Users, Smartphone, Zap, Laptop, Watch, Box, 
  Activity, Wrench, CheckCircle2, Clock, 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  PieChart, BarChart3, AlertCircle, ShoppingBag, 
  Package, Truck, Coins
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 

// --- YARDIMCI BİLEŞENLER (İlerleme Çubukları) ---
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

export default function YonetimPaneli() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    // FİNANSAL
    monthlyRevenue: 0,
    monthlyCost: 0,
    monthlyProfit: 0,
    profitMargin: 0,
    
    // SERVİS VERİLERİ
    serviceCount: 0,
    potentialServiceRevenue: 0,
    activeServiceTotal: 0,
    waiting: 0,    // Sırada Bekleyen
    processing: 0, // İşlem Gören
    ready: 0,      // Hazır
    
    // KATEGORİ DAĞILIMI
    phone: 0, robot: 0, pc: 0, other: 0, topCategory: "Yok",
    
    // MAĞAZA VERİLERİ
    storeSoldThisMonth: 0,
    storeRevenue: 0,
    storeProfit: 0,
    storeActiveTotal: 0, 
    storePacking: 0,    // Hazırlanıyor
    storeShipped: 0,    // Kargoda
    storeCompleted: 0,  // Satıldı
    
    // STOK DURUMU
    stockList: [] as any[], 
    totalStockValue: 0,

    // ORTALAMALAR
    avgServiceTicket: 0, 
    avgStoreProfit: 0    
  });

  useEffect(() => {
    async function fetchData() {
        setLoading(true);

        // 1. SERVİS VERİLERİNİ ÇEK
        const { data: jobs } = await supabase.from('aura_jobs').select('*');
        
        // 2. MAĞAZA VERİLERİNİ ÇEK
        const { data: products } = await supabase.from('urunler').select('*');

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // Geçici Değişkenler (Hesaplama için)
        let ciro = 0, maliyet = 0;
        
        // Servis Sayaçları
        let sCount = 0; // Toplam tamamlanan servis
        let sWaiting = 0, sProcessing = 0, sReady = 0;
        let sFutureMoney = 0;
        let catPhone = 0, catRobot = 0, catPc = 0, catOther = 0;

        // Mağaza Sayaçları
        let mSoldCount = 0;
        let mRevenue = 0, mCost = 0;
        let mPacking = 0, mShipped = 0; // Kargoda vs.
        let mStockVal = 0;
        let activeStockList: any[] = [];

        // --- A) SERVİS ANALİZİ ---
        if (jobs) {
            jobs.forEach((job: any) => {
                const jStatus = (job.status || "").toLowerCase();
                const jDate = new Date(job.created_at);
                const isThisMonth = (jDate.getMonth() + 1 === currentMonth && jDate.getFullYear() === currentYear);
                const price = Number(job.price) || 0;
                const cost = Number(job.cost) || 0;

                // Kategori Analizi (Cihaz isminden veya kategoriden)
                const cat = (job.category || job.device || "").toLowerCase();
                if (cat.includes("telefon") || cat.includes("iphone") || cat.includes("samsung")) catPhone++;
                else if (cat.includes("süpürge") || cat.includes("robot") || cat.includes("roborock")) catRobot++;
                else if (cat.includes("bilgisayar") || cat.includes("laptop") || cat.includes("mac")) catPc++;
                else catOther++;

                // Tamamlananlar (Ciroya Ekle)
                if (jStatus.includes("teslim") && isThisMonth) {
                    ciro += price;
                    maliyet += cost;
                    sCount++;
                }

                // Aktif Servisler (Durum Analizi)
                if (!jStatus.includes("teslim") && !jStatus.includes("iade")) {
                    sFutureMoney += price;
                    
                    if (jStatus.includes("bekliyor")) sWaiting++;
                    else if (jStatus.includes("hazır")) sReady++;
                    else sProcessing++; // İşlemde, Parça Bekliyor vs.
                }
            });
        }

        // --- B) MAĞAZA ANALİZİ ---
        if (products) {
            products.forEach((prod: any) => {
                const pStatus = (prod.stok_durumu || "").toLowerCase();
                const price = Number(prod.fiyat) || 0;
                const cost = Number(prod.maliyet) || 0;

                // Satılanlar
                if (pStatus.includes("satıldı")) {
                    ciro += price;
                    maliyet += cost;
                    mRevenue += price;
                    mCost += cost;
                    mSoldCount++;
                    mShipped++; // Şimdilik satılanı kargoda gibi sayalım veya ayrı statü varsa ayıralım
                }
                else if (pStatus.includes("kargo")) {
                    mShipped++;
                }
                else if (pStatus.includes("opsiyon")) {
                    mPacking++;
                }

                // Vitrin (Stoktakiler)
                if (pStatus.includes("satışta") || pStatus === "true") {
                    mStockVal += price;
                    if (activeStockList.length < 5) {
                        activeStockList.push({ name: prod.ad, price: price });
                    }
                }
            });
        }

        // --- GENEL MATEMATİK ---
        const totalProfit = ciro - maliyet;
        const margin = ciro > 0 ? (totalProfit / ciro) * 100 : 0;
        
        const serviceRevenue = ciro - mRevenue;
        const avgService = sCount > 0 ? serviceRevenue / sCount : 0;
        const storeTotalProfit = mRevenue - mCost;
        const avgStoreP = mSoldCount > 0 ? storeTotalProfit / mSoldCount : 0;

        const activeServiceTotal = sWaiting + sProcessing + sReady;
        const storeActiveTotal = mPacking + mShipped + mSoldCount;

        // En Yoğun Kategori Bulma
        const maxCatVal = Math.max(catPhone, catRobot, catPc, catOther);
        let topCat = "Diğer";
        if (maxCatVal > 0) {
            if (maxCatVal === catPhone) topCat = "Cep Telefonu";
            else if (maxCatVal === catRobot) topCat = "Robot Süpürge";
            else if (maxCatVal === catPc) topCat = "Bilgisayar";
        }

        setStats({
            monthlyRevenue: ciro,
            monthlyCost: maliyet,
            monthlyProfit: totalProfit,
            profitMargin: Math.round(margin),
            
            serviceCount: sCount,
            potentialServiceRevenue: sFutureMoney,
            activeServiceTotal: activeServiceTotal,
            waiting: sWaiting,
            processing: sProcessing,
            ready: sReady,
            
            phone: catPhone, robot: catRobot, pc: catPc, other: catOther, topCategory: topCat,
            
            storeSoldThisMonth: mSoldCount,
            storeRevenue: mRevenue,
            storeProfit: storeTotalProfit,
            storeActiveTotal: storeActiveTotal,
            storePacking: mPacking,
            storeShipped: mShipped,
            storeCompleted: mSoldCount,
            
            stockList: activeStockList,
            totalStockValue: mStockVal,

            avgServiceTicket: Math.round(avgService),
            avgStoreProfit: Math.round(avgStoreP)
        });
        setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-20 text-center text-slate-500 font-bold animate-pulse">Veriler hesaplanıyor...</div>;

  return (
    <div className="p-6 text-slate-200 space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span className="text-cyan-500">|ıIı</span> KOMUTA MERKEZİ
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                AURA BİLİŞİM OPERASYONEL RAPORU
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-400">CANLI AKTİF</span>
          </div>
      </div>
      
      {/* --- BÖLÜM 1: ÜST FİNANSAL KARTLAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-all">
             <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider mb-1">TOPLAM CİRO (BU AY)</p>
             <h2 className="text-3xl font-bold text-white mb-2">{stats.monthlyRevenue.toLocaleString('tr-TR')} ₺</h2>
             <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Wrench size={10}/> {stats.serviceCount} Servis | <ShoppingBag size={10}/> {stats.storeSoldThisMonth} Satış
             </div>
             <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800/50 w-16 h-16 group-hover:scale-110 transition-transform"/>
        </div>

        <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-emerald-900/30 transition-all">
             <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">NET KÂR</p>
             <h2 className="text-3xl font-bold text-emerald-400 mb-2">{stats.monthlyProfit.toLocaleString('tr-TR')} ₺</h2>
             <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="text-emerald-500 font-bold">%{stats.profitMargin}</span> Kâr Marjı
             </div>
             <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-900/40 w-16 h-16 group-hover:scale-110 transition-transform"/>
        </div>

        <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-red-900/30 transition-all">
             <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">GİDER / MALİYET</p>
             <h2 className="text-3xl font-bold text-white mb-2">{stats.monthlyCost.toLocaleString('tr-TR')} ₺</h2>
             <TrendingDown className="absolute right-4 top-1/2 -translate-y-1/2 text-red-900/40 w-16 h-16 group-hover:scale-110 transition-transform"/>
        </div>

        <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-yellow-900/30 transition-all">
             <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider mb-1">BEKLEYEN ALACAK</p>
             <h2 className="text-3xl font-bold text-white mb-2">{stats.potentialServiceRevenue.toLocaleString('tr-TR')} ₺</h2>
             <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Clock size={12} className="text-yellow-500"/> Serviste Teslim Bekleyen
             </div>
             <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-900/40 w-16 h-16 group-hover:scale-110 transition-transform"/>
        </div>
      </div>

      {/* --- BÖLÜM 2: DETAYLI PANELLER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SOL GENİŞ KOLON */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* 1. ATÖLYE HAREKETLİLİĞİ (AKTİF) */}
              <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-5">
                      <h3 className="font-bold flex items-center gap-2 text-sm text-white">
                          <span className="text-cyan-500"><Activity size={18}/></span> ATÖLYE HAREKETLİLİĞİ
                      </h3>
                      <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded">AKTİF CİHAZ: {stats.activeServiceTotal}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                      <ProcessBox 
                        title="Sırada Bekleyen" 
                        count={stats.waiting} 
                        percent={stats.activeServiceTotal > 0 ? `${(stats.waiting/stats.activeServiceTotal)*100}%` : '0%'} 
                        color="text-yellow-500" 
                        colorName="bg-yellow-500"
                        icon={<Clock size={20}/>}
                      />
                      <ProcessBox 
                        title="İşlem Gören" 
                        count={stats.processing} 
                        percent={stats.activeServiceTotal > 0 ? `${(stats.processing/stats.activeServiceTotal)*100}%` : '0%'} 
                        color="text-blue-500" 
                        colorName="bg-blue-500"
                        icon={<Wrench size={20}/>}
                      />
                      <ProcessBox 
                        title="Teslime Hazır" 
                        count={stats.ready} 
                        percent={stats.activeServiceTotal > 0 ? `${(stats.ready/stats.activeServiceTotal)*100}%` : '0%'} 
                        color="text-emerald-500" 
                        colorName="bg-emerald-500"
                        icon={<CheckCircle2 size={20}/>}
                      />
                  </div>
              </div>

              {/* 2. SATIŞ HAREKETLİLİĞİ (AKTİF) */}
              <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-5">
                      <h3 className="font-bold flex items-center gap-2 text-sm text-white">
                          <span className="text-purple-500"><ShoppingBag size={18}/></span> SATIŞ & E-TİCARET
                      </h3>
                      <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded">BU AY İŞLEM: {stats.storeActiveTotal}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                      <ProcessBox 
                        title="Paketleme / Opsiyon" 
                        count={stats.storePacking} 
                        percent={stats.storeActiveTotal > 0 ? `${(stats.storePacking/stats.storeActiveTotal)*100}%` : '0%'} 
                        color="text-purple-500" 
                        colorName="bg-purple-500"
                        icon={<Package size={20}/>}
                      />
                      <ProcessBox 
                        title="Kargolanıyor" 
                        count={stats.storeShipped} 
                        percent={stats.storeActiveTotal > 0 ? `${(stats.storeShipped/stats.storeActiveTotal)*100}%` : '0%'} 
                        color="text-blue-400" 
                        colorName="bg-blue-400"
                        icon={<Truck size={20}/>}
                      />
                      <ProcessBox 
                        title="Satılan" 
                        count={stats.storeCompleted} 
                        percent={stats.storeActiveTotal > 0 ? `${(stats.storeCompleted/stats.storeActiveTotal)*100}%` : '0%'} 
                        color="text-emerald-500" 
                        colorName="bg-emerald-500"
                        icon={<Coins size={20}/>}
                      />
                  </div>
              </div>

              {/* 3. ORTALAMALAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#151a25] border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-lg">
                      <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                          <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">ORTALAMA ONARIM ÜCRETİ</span>
                              <div className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                                  <Wrench size={18}/> {stats.avgServiceTicket.toLocaleString('tr-TR')} ₺
                              </div>
                          </div>
                      </div>
                      <div className="p-5 bg-purple-500/5 flex justify-between items-center">
                          <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">ORTALAMA SATIŞ KÂRI</span>
                              <div className="text-xl font-bold text-purple-400 flex items-center gap-2">
                                  <ShoppingBag size={18}/> {stats.avgStoreProfit.toLocaleString('tr-TR')} ₺
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
                      <div>
                          <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase">BAŞARI ORANI</div>
                          <div className="text-4xl font-black text-white tracking-tight">%98.5</div>
                      </div>
                      <div className="bg-emerald-500/10 p-3 rounded-full">
                            <CheckCircle2 size={32} className="text-emerald-500"/>
                      </div>
                  </div>
              </div>
          </div>

          {/* SAĞ DAR KOLON */}
          <div className="space-y-6">
              
              {/* LİSTE 1: SERVİSTEKİLER (AKTİF) */}
              <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                      <PieChart className="text-purple-500" size={18}/> SERVİSTEKİ CİHAZLAR
                  </h3>
                  
                  <div className="space-y-4">
                      <StatRow icon={<Smartphone size={14}/>} label="Telefon" count={stats.phone} total={stats.activeServiceTotal} color="bg-purple-500"/>
                      <StatRow icon={<Zap size={14}/>} label="Robot" count={stats.robot} total={stats.activeServiceTotal} color="bg-orange-500"/>
                      <StatRow icon={<Laptop size={14}/>} label="Bilgisayar" count={stats.pc} total={stats.activeServiceTotal} color="bg-blue-500"/>
                      <StatRow icon={<Box size={14}/>} label="Diğer" count={stats.other} total={stats.activeServiceTotal} color="bg-slate-500"/>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">EN YOĞUN KATEGORİ</span>
                      <span className="font-bold text-white bg-slate-800 px-2 py-1 rounded border border-slate-700">{stats.topCategory}</span>
                  </div>
              </div>

              {/* LİSTE 2: VİTRİN (AKTİF) */}
              <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                          <Package size={16} className="text-yellow-500"/> SATIŞ STOK (VİTRİN)
                      </h3>
                      <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded">Aktif</span>
                  </div>
                  
                  <div className="space-y-3">
                      {stats.stockList.length === 0 ? (
                          <div className="text-center text-xs text-slate-600 py-4">Vitrin boş.</div>
                      ) : (
                          stats.stockList.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-slate-800/50 last:border-0">
                                  <span className="flex items-center gap-2 text-slate-400 truncate max-w-[150px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0"></span> {item.name}
                                  </span>
                                  <span className="text-white font-semibold">{Number(item.price).toLocaleString()} ₺</span>
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
  );
}

// Alt Bileşen: İnce Liste Satırı
function StatRow({ icon, label, count, total, color }: any) {
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
}