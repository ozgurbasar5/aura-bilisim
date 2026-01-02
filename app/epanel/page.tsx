"use client";

import { useEffect, useState } from "react";
import { 
  Users, Smartphone, Zap, Laptop, Watch, Box, 
  Activity, Wrench, CheckCircle2, Clock, 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  PieChart, BarChart3, AlertCircle, ShoppingBag, 
  Package, Truck, Coins, ArrowRight
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 
import Link from "next/link";

// --- YARDIMCI BİLEŞENLER ---
const ProgressBar = ({ width, color }: { width: string, color: string }) => (
  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
    <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width: width }}></div>
  </div>
);

const ProcessBox = ({ title, count, percent, color, colorName, icon }: any) => (
  <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 relative hover:bg-slate-800/50 transition-colors group">
    <div className="flex justify-between items-start mb-2">
       <div className={`p-2 rounded-lg bg-opacity-10 ${colorName.replace('bg-', 'bg-').replace('500', '500/10')} ${color}`}>
          {icon}
       </div>
       <span className="text-2xl font-black text-white">{count}</span>
    </div>
    <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-2">{title}</h4>
    <ProgressBar width={percent} color={colorName} />
  </div>
);

export default function EPanelDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monthlyRevenue: 0,
    monthlyCost: 0,
    monthlyProfit: 0,
    profitMargin: 0,
    bekleyenAlacak: 0,
    
    serviceCount: 0,
    activeServiceTotal: 0,
    waiting: 0, processing: 0, ready: 0,
    
    phone: 0, robot: 0, pc: 0, other: 0, topCategory: "Yok",
    
    storeSoldThisMonth: 0,
    storeRevenue: 0,
    storeProfit: 0,
    storeActiveTotal: 0, 
    storePacking: 0, storeShipped: 0, storeCompleted: 0,
    
    stockList: [] as any[], 
    totalStockValue: 0,
    
    avgServiceTicket: 0, 
    avgStoreProfit: 0    
  });

  useEffect(() => {
    async function fetchData() {
        setLoading(true);

        // --- VERİ ÇEKME (TÜM KAYNAKLAR) ---
        const { data: jobs } = await supabase.from('aura_jobs').select('*');
        const { data: products } = await supabase.from('urunler').select('*');
        const { data: quickSales } = await supabase.from('satis_gecmisi').select('*'); // Hızlı Satışlar
        const { data: expenses } = await supabase.from('giderler').select('*');       // Giderler (Kira/Fatura)
        
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // --- HESAPLAMA DEĞİŞKENLERİ ---
        let totalRevenue = 0; // CİRO
        let totalCost = 0;    // MALİYET (Parça + Ürün Alış + Giderler)
        let totalPending = 0; // BEKLEYEN ALACAK

        // Servis Sayaçları
        let sCount = 0, sWaiting = 0, sProcessing = 0, sReady = 0;
        let sRevenue = 0;
        let catPhone = 0, catRobot = 0, catPc = 0, catOther = 0;

        // Mağaza Sayaçları
        let mSoldCount = 0, mRevenue = 0, mCost = 0;
        let mPacking = 0, mShipped = 0; 
        let mStockVal = 0;
        let activeStockList: any[] = [];

        // 1. SERVİS HESAPLAMALARI
        if (jobs) {
            jobs.forEach((job: any) => {
                const status = (job.status || "").toLowerCase();
                const price = Number(job.price) || 0;
                const cost = Number(job.cost) || 0;
                const date = new Date(job.created_at);
                const isThisMonth = (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear);

                // Kategori
                const cat = (job.category || job.device || "").toLowerCase();
                if (cat.includes("telefon") || cat.includes("iphone")) catPhone++;
                else if (cat.includes("süpürge") || cat.includes("robot")) catRobot++;
                else if (cat.includes("bilgisayar") || cat.includes("laptop")) catPc++;
                else catOther++;

                // Tamamlanan (Ciro)
                if ((status.includes("teslim") || status.includes("hazır")) && isThisMonth) {
                    totalRevenue += price;
                    totalCost += cost; // Parça maliyetini giderlere ekle
                    sRevenue += price;
                    sCount++;
                }

                // Bekleyen (Alacak)
                if (!status.includes("teslim") && !status.includes("hazır") && !status.includes("iptal") && !status.includes("iade") && !status.includes("red")) {
                    totalPending += price;
                    if (status.includes("bekliyor") || status.includes("onay")) sWaiting++;
                    else sProcessing++;
                }
                if(status.includes("hazır") && !status.includes("teslim")) sReady++;
            });
        }

        // 2. MAĞAZA (ÜRÜNLER) HESAPLAMALARI
        if (products) {
            products.forEach((prod: any) => {
                const status = (prod.stok_durumu || "").toLowerCase();
                const price = Number(prod.fiyat) || 0;
                const cost = Number(prod.maliyet) || 0;
                
                // Basit mantık: Satıldıysa bu ay satılmış sayıyoruz (veya updated_at kontrolü eklenebilir)
                if (status.includes("satıldı") || status.includes("tamam")) {
                    totalRevenue += price;
                    totalCost += cost;
                    mRevenue += price;
                    mCost += cost;
                    mSoldCount++;
                }
                else if (status.includes("kargo") || status.includes("opsiyon")) {
                    totalPending += price;
                    if(status.includes("kargo")) mShipped++;
                    if(status.includes("opsiyon")) mPacking++;
                }
                else if (status.includes("satışta") || status === "true" || !status) {
                    mStockVal += price;
                    if (activeStockList.length < 5) activeStockList.push({ name: prod.ad, price: price });
                }
            });
        }

        // 3. HIZLI SATIŞLAR (POS)
        if (quickSales) {
            quickSales.forEach((sale: any) => {
                const date = new Date(sale.created_at);
                const isThisMonth = (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear);
                const price = Number(sale.tutar) || 0;

                if (isThisMonth && sale.durum === 'Tamamlandı') {
                    totalRevenue += price;
                    mRevenue += price;
                    mSoldCount++;
                    // Hızlı satışın maliyeti girilmediyse 0 kabul edilir
                }
            });
        }

        // 4. GİDERLER (KİRA, FATURA VB.)
        if (expenses) {
            expenses.forEach((exp: any) => {
                const date = new Date(exp.created_at);
                const isThisMonth = (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear);
                const amount = Number(exp.tutar) || 0;

                if (isThisMonth) {
                    totalCost += amount; // Toplam maliyete ekle
                }
            });
        }

        // --- SONUÇLAR ---
        const totalProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
        const activeServiceTotal = sWaiting + sProcessing + sReady;
        const storeActiveTotal = mPacking + mShipped + mSoldCount;

        const maxCatVal = Math.max(catPhone, catRobot, catPc, catOther);
        let topCat = "Diğer";
        if (maxCatVal > 0) {
            if (maxCatVal === catPhone) topCat = "Cep Telefonu";
            else if (maxCatVal === catRobot) topCat = "Robot Süpürge";
            else if (maxCatVal === catPc) topCat = "Bilgisayar";
        }

        setStats({
            monthlyRevenue: totalRevenue,
            monthlyCost: totalCost,
            monthlyProfit: totalProfit,
            profitMargin: Math.round(profitMargin),
            bekleyenAlacak: totalPending,

            serviceCount: sCount,
            activeServiceTotal: activeServiceTotal,
            waiting: sWaiting,
            processing: sProcessing,
            ready: sReady,
            
            phone: catPhone, robot: catRobot, pc: catPc, other: catOther, topCategory: topCat,
            
            storeSoldThisMonth: mSoldCount,
            storeRevenue: mRevenue,
            storeProfit: mRevenue - mCost,
            storeActiveTotal: storeActiveTotal,
            storePacking: mPacking,
            storeShipped: mShipped,
            storeCompleted: mSoldCount,
            
            stockList: activeStockList,
            totalStockValue: mStockVal,
            
            avgServiceTicket: sCount > 0 ? Math.round(sRevenue / sCount) : 0,
            avgStoreProfit: mSoldCount > 0 ? Math.round((mRevenue - mCost) / mSoldCount) : 0
        });
        setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-cyan-500 font-mono animate-pulse tracking-widest">SİSTEM ANALİZ EDİLİYOR...</div>
      </div>
  );

  return (
    <div className="p-6 text-slate-200 space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1920px] mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                <span className="text-cyan-500">|ıIı</span> KOMUTA MERKEZİ
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                AURA BİLİŞİM v3.5 FINAL <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </p>
          </div>
          <div className="flex gap-3">
              <Link href="/epanel/hizli-kayit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-cyan-900/20 transition-all hover:scale-105 flex items-center gap-2">
                  <Activity size={18}/> HIZLI KAYIT
              </Link>
              <Link href="/epanel/finans" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 flex items-center gap-2">
                  <DollarSign size={18}/> FİNANS DETAY
              </Link>
          </div>
      </div>
      
      {/* --- BÖLÜM 1: ÜST FİNANSAL KARTLAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CİRO KARTI */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={80}/></div>
             <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2">TOPLAM CİRO (BU AY)</p>
             <h2 className="text-4xl font-black text-white mb-3 tracking-tight">{stats.monthlyRevenue.toLocaleString('tr-TR')} ₺</h2>
             <div className="flex items-center gap-3 text-[10px] text-slate-400 bg-slate-800/50 w-fit px-3 py-1.5 rounded-lg border border-slate-700">
                <Wrench size={12} className="text-cyan-400"/> {stats.serviceCount} Servis <span className="text-slate-600">|</span> <ShoppingBag size={12} className="text-purple-400"/> {stats.storeSoldThisMonth} Satış
             </div>
        </div>

        {/* KAR KARTI */}
        <div className="bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-900/50 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={80}/></div>
             <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">NET KÂR (GERÇEK)</p>
             <h2 className="text-4xl font-black text-emerald-400 mb-3 tracking-tight">{stats.monthlyProfit.toLocaleString('tr-TR')} ₺</h2>
             <div className="flex items-center gap-2 text-[10px] text-emerald-200/60 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <ArrowRight size={12}/> %{stats.profitMargin} Kâr Marjı
             </div>
        </div>

        {/* MALİYET KARTI */}
        <div className="bg-gradient-to-br from-red-950/30 to-slate-900 border border-red-900/50 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/50 transition-all shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingDown size={80}/></div>
             <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">GİDER & MALİYET</p>
             <h2 className="text-4xl font-black text-white mb-3 tracking-tight">{stats.monthlyCost.toLocaleString('tr-TR')} ₺</h2>
             <div className="flex items-center gap-2 text-[10px] text-red-200/60 bg-red-500/10 w-fit px-3 py-1.5 rounded-lg border border-red-500/20">
                 Kira + Faturalar + Parça
             </div>
        </div>

        {/* BEKLEYEN KARTI */}
        <div className="bg-gradient-to-br from-yellow-950/30 to-slate-900 border border-yellow-900/50 p-6 rounded-2xl relative overflow-hidden group hover:border-yellow-500/50 transition-all shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet size={80}/></div>
             <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-2">BEKLEYEN ALACAK</p>
             
             <h2 className="text-4xl font-black text-white mb-3 tracking-tight">{stats.bekleyenAlacak.toLocaleString('tr-TR')} ₺</h2>
             
             <div className="flex items-center gap-2 text-[10px] text-yellow-200/60 bg-yellow-500/10 w-fit px-3 py-1.5 rounded-lg border border-yellow-500/20">
                <Clock size={12}/> Servis + Opsiyonlu Ürün
             </div>
        </div>
      </div>

      {/* --- BÖLÜM 2: DETAYLI PANELLER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SOL GENİŞ KOLON */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* 1. ATÖLYE HAREKETLİLİĞİ */}
              <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold flex items-center gap-3 text-sm text-white">
                          <span className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500 border border-cyan-500/20"><Activity size={18}/></span> 
                          ATÖLYE HAREKETLİLİĞİ
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">AKTİF CİHAZ: {stats.activeServiceTotal}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ProcessBox 
                        title="Sırada Bekleyen / Onay" 
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

              {/* 2. SATIŞ HAREKETLİLİĞİ */}
              <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold flex items-center gap-3 text-sm text-white">
                          <span className="p-2 bg-purple-500/10 rounded-lg text-purple-500 border border-purple-500/20"><ShoppingBag size={18}/></span> 
                          SATIŞ & E-TİCARET
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">BU AY İŞLEM: {stats.storeActiveTotal}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        title="Satılan (Toplam)" 
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
                  <div className="bg-[#151a25] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-lg group hover:border-slate-700 transition-colors">
                      <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                          <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1 tracking-wider">ORTALAMA ONARIM</span>
                              <div className="text-2xl font-black text-cyan-400 flex items-center gap-2">
                                  {stats.avgServiceTicket.toLocaleString('tr-TR')} ₺
                              </div>
                          </div>
                          <Wrench size={24} className="text-cyan-500/20 group-hover:text-cyan-500 transition-colors"/>
                      </div>
                  </div>

                  <div className="bg-[#151a25] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-lg group hover:border-slate-700 transition-colors">
                      <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                          <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1 tracking-wider">ORTALAMA ÜRÜN CİROSU</span>
                              <div className="text-2xl font-black text-purple-400 flex items-center gap-2">
                                  {stats.avgStoreProfit.toLocaleString('tr-TR')} ₺
                              </div>
                          </div>
                          <ShoppingBag size={24} className="text-purple-500/20 group-hover:text-purple-500 transition-colors"/>
                      </div>
                  </div>
              </div>
          </div>

          {/* SAĞ DAR KOLON */}
          <div className="space-y-6">
              
              {/* LİSTE 1: SERVİS KATEGORİLERİ */}
              <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-700 pb-3">
                      <PieChart className="text-purple-500" size={16}/> SERVİS KATEGORİLERİ
                  </h3>
                  
                  <div className="space-y-5">
                      <StatRow icon={<Smartphone size={16}/>} label="Telefon" count={stats.phone} total={stats.activeServiceTotal} color="bg-purple-500"/>
                      <StatRow icon={<Zap size={16}/>} label="Robot Süpürge" count={stats.robot} total={stats.activeServiceTotal} color="bg-orange-500"/>
                      <StatRow icon={<Laptop size={16}/>} label="Bilgisayar" count={stats.pc} total={stats.activeServiceTotal} color="bg-blue-500"/>
                      <StatRow icon={<Box size={16}/>} label="Diğer" count={stats.other} total={stats.activeServiceTotal} color="bg-slate-500"/>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 uppercase font-bold">EN YOĞUN KATEGORİ</span>
                      <span className="font-bold text-white bg-slate-800 px-3 py-1 rounded-full border border-slate-600">{stats.topCategory}</span>
                  </div>
              </div>

              {/* LİSTE 2: VİTRİN (AKTİF) */}
              <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                      <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Package size={16} className="text-yellow-500"/> VİTRİN (SATIŞ STOK)
                      </h3>
                      <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded">Aktif</span>
                  </div>
                  
                  <div className="space-y-3">
                      {stats.stockList.length === 0 ? (
                          <div className="text-center text-xs text-slate-600 py-4 italic">Vitrin boş.</div>
                      ) : (
                          stats.stockList.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-slate-800/50 last:border-0 group hover:bg-slate-800/30 px-2 -mx-2 rounded transition-colors">
                                  <span className="flex items-center gap-3 text-slate-300 truncate max-w-[150px]">
                                      <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></span> {item.name}
                                  </span>
                                  <span className="text-white font-mono font-bold">{Number(item.price).toLocaleString()} ₺</span>
                              </div>
                          ))
                      )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between items-center">
                      <span className="text-[11px] text-slate-500 uppercase font-bold">Toplam Değer</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">{stats.totalStockValue.toLocaleString()} ₺</span>
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
            <div className="flex justify-between text-xs font-bold mb-2 text-slate-400 group-hover:text-white transition-colors">
                <span className="flex items-center gap-2">{icon} {label}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">{count}</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width: `${width}%` }}></div>
            </div>
        </div>
    )
}