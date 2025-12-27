"use client";

import { useEffect, useState } from "react";
import { 
  Users, Smartphone, Zap, Laptop, Watch, Box, 
  Activity, Wrench, CheckCircle2, Clock, 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  PieChart, BarChart3, AlertCircle, ShoppingBag, 
  Package, Truck, Coins
} from "lucide-react";
import { getWorkshopFromStorage } from "@/utils/storage";

// Yardımcı Bileşen: İlerleme Çubuğu (Bar)
const ProgressBar = ({ width, color }: { width: string, color: string }) => (
  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
    <div className={`h-full ${color} transition-all duration-1000`} style={{ width: width }}></div>
  </div>
);

// Yardımcı Bileşen: Küçük İstatistik Kutusu
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
  const [stats, setStats] = useState({
    // FİNANSAL (GENEL)
    monthlyRevenue: 0,
    monthlyCost: 0,
    monthlyProfit: 0,
    profitMargin: 0,
    
    // SERVİS VERİLERİ
    serviceCount: 0,
    potentialServiceRevenue: 0, // Bekleyen alacak
    activeServiceTotal: 0,
    waiting: 0,
    processing: 0,
    ready: 0,
    
    // KATEGORİ DAĞILIMI
    phone: 0, robot: 0, pc: 0, other: 0, topCategory: "",
    
    // MAĞAZA VERİLERİ (YENİ)
    storeSoldThisMonth: 0,
    storeRevenue: 0,
    storeProfit: 0,
    storeActiveTotal: 0, // Toplam sipariş süreci
    storePacking: 0,     // Hazırlanıyor
    storeShipped: 0,     // Kargoda
    storeCompleted: 0,   // Tamamlandı (Bu ay)
    
    // STOK DURUMU
    stockList: [] as any[], // Satıştaki ürünler
    totalStockValue: 0,     // Satıştaki ürünlerin toplam fiyatı

    // ORTALAMALAR
    avgServiceTicket: 0, // Servis başı ciro
    avgStoreProfit: 0    // Ürün başı kar
  });

  useEffect(() => {
    // 1. VERİLERİ ÇEK
    const jobs = getWorkshopFromStorage();
    const storeProducts = JSON.parse(localStorage.getItem("aura_store_products") || "[]");

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // --- DEĞİŞKENLER ---
    let ciro = 0, maliyet = 0;
    
    // Servis Değişkenleri
    let sCount = 0;
    let sWaiting = 0, sProcessing = 0, sReady = 0;
    let sFutureMoney = 0;
    let catPhone = 0, catRobot = 0, catPc = 0, catOther = 0;

    // Mağaza Değişkenleri
    let mSoldCount = 0;
    let mRevenue = 0, mCost = 0;
    let mPacking = 0, mShipped = 0;
    let mStockVal = 0;
    let activeStockList: any[] = [];

    // --- A) SERVİS HESAPLAMALARI ---
    jobs.forEach((job: any) => {
        const parts = job.date.split('.');
        const jobMonth = parseInt(parts[1]);
        const jobYear = parseInt(parts[2]);

        // 1. TAMAMLANAN İŞLER (Bu Ay)
        if (job.status === "Teslim Edildi" && jobMonth === currentMonth && jobYear === currentYear) {
            ciro += Number(job.price) || 0;
            maliyet += Number(job.cost) || 0;
            sCount++;
        }

        // 2. AKTİF DURUM & POTANSİYEL
        if (job.status !== "Teslim Edildi" && job.status !== "İade") {
            sFutureMoney += Number(job.price) || 0;
            
            if (job.status === "Bekliyor") sWaiting++;
            if (job.status === "İşlemde" || job.status === "Parça Bekliyor") sProcessing++;
            if (job.status === "Hazır") sReady++;

            // Kategori Sayımı
            if (job.category === "Cep Telefonu") catPhone++;
            else if (job.category === "Robot Süpürge") catRobot++;
            else if (job.category === "Bilgisayar") catPc++;
            else catOther++;
        }
    });

    // --- B) MAĞAZA HESAPLAMALARI ---
storeProducts.forEach((prod: any) => { // prod: any yaparak tip kontrolünü esnetiyoruz
    // Satılanlar (Ciroya Dahil Et)
    if (prod.status === "Satıldı") {
        // String(prod.price) kullanarak her zaman metne çevirip sonra sayıya dönüştürüyoruz
        const price = Number(String(prod.price || 0).replace(/[^0-9.]/g, '')) || 0;
        const cost = Number(String(prod.cost || 0).replace(/[^0-9.]/g, '')) || 0;
        
        ciro += price;
        maliyet += cost;
        mRevenue += price;
        mCost += cost;
        mSoldCount++;
    }

    // Stoktaki Ürünler (Satışta)
    if (prod.status === "Satışta") {
        const price = Number(String(prod.price || 0).replace(/[^0-9.]/g, '')) || 0;
        mStockVal += price;
        if (activeStockList.length < 5) {
            activeStockList.push(prod);
        }
    }
});

    // --- GENEL HESAPLAMALAR ---
    const totalProfit = ciro - maliyet;
    const margin = ciro > 0 ? (totalProfit / ciro) * 100 : 0;
    
    // Ortalamalar
    // 1. Servis Ortalaması (Sadece servis cirosu / servis sayısı)
    const serviceRevenue = ciro - mRevenue;
    const avgService = sCount > 0 ? serviceRevenue / sCount : 0;

    // 2. Satış Kar Ortalaması (Toplam Satış Karı / Satış Adeti)
    const storeTotalProfit = mRevenue - mCost;
    const avgStoreP = mSoldCount > 0 ? storeTotalProfit / mSoldCount : 0;

    // En Yoğun Kategori
    const maxCatVal = Math.max(catPhone, catRobot, catPc, catOther);
    let topCat = "Yok";
    if (maxCatVal > 0) {
        if (maxCatVal === catPhone) topCat = "Cep Telefonu";
        else if (maxCatVal === catRobot) topCat = "Robot Süpürge";
        else if (maxCatVal === catPc) topCat = "Bilgisayar";
        else topCat = "Diğer";
    }

    setStats({
        monthlyRevenue: ciro,
        monthlyCost: maliyet,
        monthlyProfit: totalProfit,
        profitMargin: Math.round(margin),
        
        serviceCount: sCount,
        potentialServiceRevenue: sFutureMoney,
        activeServiceTotal: sWaiting + sProcessing + sReady,
        waiting: sWaiting,
        processing: sProcessing,
        ready: sReady,
        
        phone: catPhone, robot: catRobot, pc: catPc, other: catOther, topCategory: topCat,
        
        storeSoldThisMonth: mSoldCount,
        storeRevenue: mRevenue,
        storeProfit: storeTotalProfit,
        storeActiveTotal: mPacking + mShipped + mSoldCount, // Toplam hareketlilik
        storePacking: mPacking,
        storeShipped: mShipped,
        storeCompleted: mSoldCount,
        
        stockList: activeStockList,
        totalStockValue: mStockVal,

        avgServiceTicket: Math.round(avgService),
        avgStoreProfit: Math.round(avgStoreP)
    });

  }, []);

  return (
    <div className="p-6 text-slate-200 space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span className="text-cyan-500">|ıIı</span> KOMUTA MERKEZİ
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                Aralık 2025 Finansal & Operasyonel Raporu
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-400">CANLI VERİ AKIŞI</span>
          </div>
      </div>
      
      {/* --- BÖLÜM 1: ÜST KARTLAR (4'lü Grid) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CİRO */}
        <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-all">
             <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider mb-1">TOPLAM CİRO (BU AY)</p>
             <h2 className="text-3xl font-bold text-white mb-2">{stats.monthlyRevenue.toLocaleString('tr-TR')} ₺</h2>
             <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-200 flex items-center gap-1"><Wrench size={10}/> {stats.serviceCount} Servis</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-purple-200 flex items-center gap-1"><ShoppingBag size={10}/> {stats.storeSoldThisMonth} Satış</span>
             </div>
             <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800/50 w-16 h-16 group-hover:scale-110 transition-transform"/>
        </div>

        {/* NET KAR */}
        <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-emerald-900/30 transition-all">
             <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">NET KÂR (CEBE GİREN)</p>
             <h2 className="text-3xl font-bold text-emerald-400 mb-2">{stats.monthlyProfit.toLocaleString('tr-TR')} ₺</h2>
             <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="text-emerald-500 font-bold">%42</span> Kâr Marjı
             </div>
             <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-900/40 w-16 h-16 group-hover:scale-110 transition-transform"/>
        </div>

        {/* MALİYET */}
        <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-red-900/30 transition-all">
             <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">TOPLAM MALİYET</p>
             <h2 className="text-3xl font-bold text-white mb-2">{stats.monthlyCost.toLocaleString('tr-TR')} ₺</h2>
             <div className="flex items-center gap-2 text-[10px] text-slate-400">
                🔧 Parça & Ürün Alışı
             </div>
             <TrendingDown className="absolute right-4 top-1/2 -translate-y-1/2 text-red-900/40 w-16 h-16 group-hover:scale-110 transition-transform"/>
        </div>

        {/* BEKLEYEN ALACAK */}
        <div className="bg-[#151a25] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-yellow-900/30 transition-all">
             <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider mb-1">BEKLEYEN ALACAK</p>
             <h2 className="text-3xl font-bold text-white mb-2">{stats.potentialServiceRevenue.toLocaleString('tr-TR')} ₺</h2>
             <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Clock size={12} className="text-yellow-500"/> Serviste Teslim Bekleyen
             </div>
             <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-900/40 w-16 h-16 group-hover:scale-110 transition-transform"/>
        </div>
      </div>

      {/* --- BÖLÜM 2: ANA GRID YAPISI --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SOL GENİŞ KOLON (2/3) */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* 1. ATÖLYE HAREKETLİLİĞİ */}
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

              {/* 2. SATIŞ & E-TİCARET HAREKETLİLİĞİ (YENİ) */}
              <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-5">
                      <h3 className="font-bold flex items-center gap-2 text-sm text-white">
                          <span className="text-purple-500"><ShoppingBag size={18}/></span> SATIŞ & E-TİCARET
                      </h3>
                      <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded">BU AY SİPARİŞ: {stats.storeActiveTotal}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                      <ProcessBox 
                        title="Paketleme / Hazırlık" 
                        count={stats.storePacking} 
                        percent="10%" 
                        color="text-purple-500" 
                        colorName="bg-purple-500"
                        icon={<Package size={20}/>}
                      />
                      <ProcessBox 
                        title="Kargolanan" 
                        count={stats.storeShipped} 
                        percent="20%" 
                        color="text-blue-400" 
                        colorName="bg-blue-400"
                        icon={<Truck size={20}/>}
                      />
                      <ProcessBox 
                        title="Tamamlanan" 
                        count={stats.storeCompleted} 
                        percent="100%" 
                        color="text-emerald-500" 
                        colorName="bg-emerald-500"
                        icon={<Coins size={20}/>}
                      />
                  </div>
              </div>

              {/* 3. DETAYLAR & ORTALAMALAR (ÇİFT SATIRLI) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* GELİŞMİŞ ORTALAMA KARTI */}
                  <div className="bg-[#151a25] border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-lg">
                      {/* Üst: Servis */}
                      <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                          <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">ORTALAMA ONARIM ÜCRETİ</span>
                              <div className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                                  <Wrench size={18}/> {stats.avgServiceTicket.toLocaleString('tr-TR')} ₺
                              </div>
                          </div>
                          <div className="text-[9px] text-right text-slate-500 leading-tight">Müşteri başına düşen<br/>ortalama servis geliri</div>
                      </div>
                      {/* Alt: Satış (Mor Alan) */}
                      <div className="p-5 bg-purple-500/5 flex justify-between items-center">
                          <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">ORTALAMA SATIŞ KÂRI</span>
                              <div className="text-xl font-bold text-purple-400 flex items-center gap-2">
                                  <ShoppingBag size={18}/> {stats.avgStoreProfit.toLocaleString('tr-TR')} ₺
                              </div>
                          </div>
                          <div className="text-[9px] text-right text-slate-500 leading-tight">Ürün başına düşen<br/>ortalama net kâr</div>
                      </div>
                  </div>

                  {/* BAŞARI ORANI */}
                  <div className="bg-[#151a25] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
                      <div>
                          <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase">BAŞARI ORANI</div>
                          <div className="text-4xl font-black text-white tracking-tight">%98.5</div>
                      </div>
                      <div className="text-right">
                          <div className="bg-emerald-500/10 p-3 rounded-full inline-block mb-2">
                            <CheckCircle2 size={32} className="text-emerald-500"/>
                          </div>
                          <div className="text-[9px] text-slate-500">İade edilmeyen başarılı<br/>onarımların oranı</div>
                      </div>
                  </div>

              </div>

          </div>

          {/* SAĞ DAR KOLON (1/3) */}
          <div className="space-y-6">
              
              {/* LİSTE 1: SERVİSTEKİLER */}
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

              {/* LİSTE 2: SATIŞTAKİ ÜRÜNLER (YENİ) */}
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
                                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0"></span> {item.name || item.model}
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