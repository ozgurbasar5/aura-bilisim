"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, Smartphone, Zap, Laptop, Box, 
  Wrench, CheckCircle2, Clock, 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  ShoppingBag, Package, Truck, Coins, ArrowRight, 
  LayoutDashboard, Search, Bell, Menu, X, HardDrive, 
  Settings, LogOut, Cpu, ShieldCheck, TerminalSquare,
  Activity, Plus, FileText, PieChart, BarChart3, 
  Tag, AlertTriangle, Target, CreditCard, Banknote,
  Layers, Filter, Command, RefreshCw, Calculator, MoreHorizontal
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 

// --- PATRON MODU & ERP BİLEŞENLERİ ---

// 1. Neon Glass Kart (Hatasız Tema Yapısı)
const NeonCard = ({ children, className = "", title, icon: Icon, action, theme = "cyan", noPadding = false }: any) => {
    const themes: any = {
        cyan: { border: "border-cyan-500/20 hover:border-cyan-500/50", shadow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]", iconBg: "bg-cyan-500/10", iconText: "text-cyan-400", gradient: "from-cyan-500/5" },
        purple: { border: "border-purple-500/20 hover:border-purple-500/50", shadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]", iconBg: "bg-purple-500/10", iconText: "text-purple-400", gradient: "from-purple-500/5" },
        emerald: { border: "border-emerald-500/20 hover:border-emerald-500/50", shadow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]", iconBg: "bg-emerald-500/10", iconText: "text-emerald-400", gradient: "from-emerald-500/5" },
        amber: { border: "border-amber-500/20 hover:border-amber-500/50", shadow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]", iconBg: "bg-amber-500/10", iconText: "text-amber-400", gradient: "from-amber-500/5" },
        red: { border: "border-red-500/20 hover:border-red-500/50", shadow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]", iconBg: "bg-red-500/10", iconText: "text-red-400", gradient: "from-red-500/5" },
        blue: { border: "border-blue-500/20 hover:border-blue-500/50", shadow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]", iconBg: "bg-blue-500/10", iconText: "text-blue-400", gradient: "from-blue-500/5" },
    };
    const currentTheme = themes[theme] || themes.cyan;

    return (
        <div className={`relative bg-[#0b0e14]/80 backdrop-blur-xl border rounded-2xl overflow-hidden group transition-all duration-500 ${currentTheme.border} ${currentTheme.shadow} ${className}`}>
            {title && (
                <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        {Icon && <div className={`p-1.5 rounded-lg ${currentTheme.iconBg} ${currentTheme.iconText}`}><Icon size={16} /></div>}
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{title}</h3>
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={`relative z-10 ${noPadding ? '' : 'p-5'}`}>{children}</div>
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
        </div>
    );
};

// 2. KANBAN KARTI (YENİ - İş Akışını Görselleştirir)
const KanbanCard = ({ job }: any) => (
    <div className="bg-[#151921] p-3 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer shadow-sm hover:shadow-lg hover:shadow-cyan-900/10 relative overflow-hidden mb-3 last:mb-0">
        <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">#{job.id.toString().padStart(4, '0')}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
    // job.device var mı diye sor (?), varsa küçült (?), sonra içinde 'iphone' ara
    job.device?.toLowerCase()?.includes('iphone') ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' :
    job.device?.toLowerCase()?.includes('robot') ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 
    'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
}`}>{job.category || 'Cihaz'}</span>
        </div>
        <h4 className="text-sm font-bold text-white mb-1 truncate relative z-10">{job.customer}</h4>
        <p className="text-xs text-slate-400 truncate mb-3 relative z-10 flex items-center gap-1"><Smartphone size={12}/> {job.device}</p>
        
        <div className="flex justify-between items-center pt-2 border-t border-white/5 relative z-10">
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono">{new Date(job.created_at).toLocaleDateString('tr-TR', {day:'numeric', month:'short'})}</span>
                {job.price > 0 && <span className="text-[10px] text-emerald-400 font-bold font-mono bg-emerald-500/10 px-1.5 rounded border border-emerald-500/20">{Number(job.price).toLocaleString()}₺</span>}
            </div>
            <ArrowRight size={14} className="text-slate-600 group-hover:text-white transition-colors"/>
        </div>
        {/* Aciliyet Çizgisi */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${job.aciliyet === 'Yüksek' ? 'bg-red-500' : 'bg-slate-800'}`}></div>
    </div>
);

// 3. Finansal Bar
const FinancialBar = ({ label, value, total, color }: any) => {
    const percent = total > 0 ? Math.min((value / total) * 100, 100) : 0;
    return (
        <div className="mb-4 last:mb-0 group cursor-default">
            <div className="flex justify-between items-end mb-1.5">
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors">{label}</span>
                <span className="text-xs font-mono font-bold text-slate-300">{value.toLocaleString('tr-TR')} ₺</span>
            </div>
            <div className="h-2 w-full bg-[#1e293b] rounded-full overflow-hidden relative border border-white/5">
                <div className={`h-full absolute top-0 left-0 ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
};

// 4. İstatistik Kartı (KPI)
const StatCard = ({ title, value, subValue, icon: Icon, color, trend }: any) => {
    const colorMap: any = {
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
        yellow: "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10",
    };
    const classes = colorMap[color] || "text-slate-400 bg-slate-500/10 border-slate-500/20";
    const highlightColor = classes.split(' ')[0];

    return (
        <div className={`relative p-5 bg-[#0f1219]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group hover:border-white/10`}>
            <div className={`absolute -right-6 -top-6 p-16 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${classes.split(' ')[1]}`}></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl border shadow-lg ${classes} transition-transform group-hover:scale-110`}>
                    <Icon size={22} />
                </div>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-[10px] font-medium text-slate-400 bg-slate-800/50 w-fit px-2 py-1 rounded border border-white/5">
                {trend && <span className={highlightColor}>{trend}</span>}
                <span>{subValue}</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-800">
                 <div className={`h-full ${classes.split(' ')[1].replace('/10', '')} w-3/4 opacity-50`}></div>
            </div>
        </div>
    );
};

// 5. Hızlı İşlem Butonu
const QuickAction = ({ icon: Icon, label, desc, href, color }: any) => (
  <Link href={href} className="group relative bg-[#0f172a] border border-white/5 hover:border-white/10 rounded-xl p-3 flex items-center gap-3 transition-all hover:-translate-y-1 overflow-hidden">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${color}`}></div>
      <div className={`p-2.5 rounded-lg ${color.replace('bg-', 'bg-opacity-10 text-')} bg-opacity-20 transition-transform group-hover:scale-110`}>
          <Icon size={20} />
      </div>
      <div className="flex-1">
          <h4 className="text-white font-bold text-xs">{label}</h4>
          <p className="text-[9px] text-slate-500 line-clamp-1">{desc}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 text-slate-400">
          <ArrowRight size={14}/>
      </div>
  </Link>
);

// 6. Tech Progress Bar (Alt kategori gösterimi için korundu)
const TechBar = ({ width, color }: { width: string, color: string }) => (
  <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden mt-2 relative">
    <div className={`h-full absolute top-0 left-0 ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`} style={{ width: width }}></div>
  </div>
);

export default function EPanelDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Veri yenileme tetikleyicisi
  
  // Patron Metrikleri State
  const [stats, setStats] = useState({
    monthlyRevenue: 0, monthlyCost: 0, monthlyProfit: 0, profitMargin: 0, bekleyenAlacak: 0,
    serviceCount: 0, activeServiceTotal: 0, waiting: 0, processing: 0, ready: 0,
    activeJobs: [] as any[], // Kanban için detaylı iş listesi
    phone: 0, robot: 0, pc: 0, other: 0, topCategory: "Yok",
    storeSoldThisMonth: 0, storeRevenue: 0, storeProfit: 0, storeActiveTotal: 0, 
    storePacking: 0, storeShipped: 0, storeCompleted: 0,
    stockList: [] as any[], totalStockValue: 0,
    avgServiceTicket: 0, avgStoreProfit: 0,
    recentActivities: [] as any[],
    targetRevenue: 150000 
  });

  // Hızlı Teklif Sihirbazı State'i
  const [quote, setQuote] = useState({ partCost: 0, labor: 0, rate: 36.5 }); 

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try {
            const { data: jobs } = await supabase.from('aura_jobs').select('*');
            const { data: products } = await supabase.from('urunler').select('*');
            const { data: quickSales } = await supabase.from('satis_gecmisi').select('*');
            const { data: expenses } = await supabase.from('aura_finans').select('*').eq('tur', 'Gider');
            
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            let totalRevenue = 0, totalCost = 0, totalPending = 0;
            let sCount = 0, sWaiting = 0, sProcessing = 0, sReady = 0, sRevenue = 0;
            let catPhone = 0, catRobot = 0, catPc = 0, catOther = 0;
            let mSoldCount = 0, mRevenue = 0, mCost = 0, mPacking = 0, mShipped = 0, mStockVal = 0;
            let activeStockList: any[] = [];
            let activities: any[] = [];

            // 1. SERVİS VERİLERİ
            if (jobs) {
                jobs.forEach((job: any) => {
                    const status = (job.status || "").toLowerCase();
                    const price = Number(job.price) || 0;
                    const cost = Number(job.cost) || 0;
                    const date = new Date(job.created_at);
                    const isThisMonth = (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear);
                    const cat = (job.category || job.device || "").toLowerCase();

                    // Kategori Sayımı
                    if (cat.includes("telefon") || cat.includes("iphone")) catPhone++;
                    else if (cat.includes("süpürge") || cat.includes("robot")) catRobot++;
                    else if (cat.includes("bilgisayar") || cat.includes("laptop")) catPc++;
                    else catOther++;

                    // Durum ve Ciro
                    if ((status.includes("teslim") || status.includes("hazır")) && isThisMonth) {
                        totalRevenue += price; totalCost += cost; sRevenue += price; sCount++;
                    }
                    if (!status.includes("teslim") && !status.includes("hazır") && !status.includes("iptal")) {
                        totalPending += price;
                        if (status.includes("bekliyor") || status.includes("onay") || status.includes("yeni")) sWaiting++; 
                        else if (status.includes("işlem") || status.includes("parça")) sProcessing++;
                    }
                    if(status.includes("hazır") && !status.includes("teslim")) sReady++;

                    // Aktivite Loguna Ekle
                    activities.push({ 
                        type: 'service', 
                        title: job.customer, 
                        desc: `${job.device} (${job.status})`, 
                        date: date, 
                        amount: 0, 
                        icon: Wrench, 
                        color: "text-blue-400 bg-blue-500/10 border-blue-500/20" 
                    });
                });
            }

            // 2. MAĞAZA VERİLERİ
            if (products) {
                products.forEach((prod: any) => {
                    const status = (prod.stok_durumu || "").toLowerCase();
                    const price = Number(prod.fiyat) || 0;
                    const cost = Number(prod.maliyet) || 0;
                    
                    if (status.includes("satıldı") || status.includes("tamam")) {
                        totalRevenue += price; totalCost += cost; mRevenue += price; mCost += cost; mSoldCount++;
                    } else if (status.includes("kargo") || status.includes("opsiyon")) {
                        totalPending += price;
                        if(status.includes("kargo")) mShipped++; if(status.includes("opsiyon")) mPacking++;
                    } else if (status.includes("satışta") || status === "true" || !status) {
                        mStockVal += price;
                        if (activeStockList.length < 5) activeStockList.push({ name: prod.ad, price: price });
                    }
                });
            }

            // 3. POS SATIŞLARI
            if (quickSales) {
                quickSales.forEach((sale: any) => {
                    const date = new Date(sale.created_at);
                    const isThisMonth = (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear);
                    const price = Number(sale.tutar) || 0;
                    if (isThisMonth && sale.durum === 'Tamamlandı') {
                        totalRevenue += price; mRevenue += price; mSoldCount++;
                        activities.push({ 
                            type: 'sale', title: 'Hızlı Satış', desc: 'POS İşlemi', date: date, amount: price, icon: ShoppingBag, color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
                        });
                    }
                });
            }

            // 4. GİDERLER
            if (expenses) {
                expenses.forEach((exp: any) => {
                    const date = new Date(exp.created_at || exp.tarih);
                    if (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear) {
                        totalCost += (Number(exp.tutar) || 0);
                    }
                });
            }

            activities.sort((a, b) => b.date.getTime() - a.date.getTime());
            
            // State Güncelleme
            setStats({
                monthlyRevenue: totalRevenue, monthlyCost: totalCost, monthlyProfit: totalRevenue - totalCost,
                profitMargin: totalRevenue > 0 ? Math.round(((totalRevenue - totalCost) / totalRevenue) * 100) : 0,
                bekleyenAlacak: totalPending, serviceCount: sCount,
                activeServiceTotal: sWaiting + sProcessing + sReady,
                waiting: sWaiting, processing: sProcessing, ready: sReady,
                activeJobs: jobs || [],
                phone: catPhone, robot: catRobot, pc: catPc, other: catOther, topCategory: "Tümü",
                storeSoldThisMonth: mSoldCount, storeRevenue: mRevenue, storeProfit: mRevenue - mCost,
                storeActiveTotal: mPacking + mShipped + mSoldCount, storePacking: mPacking,
                storeShipped: mShipped, storeCompleted: mSoldCount, stockList: activeStockList,
                totalStockValue: mStockVal, avgServiceTicket: sCount > 0 ? Math.round(sRevenue / sCount) : 0,
                avgStoreProfit: mSoldCount > 0 ? Math.round((mRevenue - mCost) / mSoldCount) : 0,
                recentActivities: activities.slice(0, 7),
                targetRevenue: 150000 
            });
        } catch (error) {
            console.error("Veri hatası:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [refreshKey]);

  if (loading) return (
      <div className="h-full flex flex-col items-center justify-center gap-6 bg-[#020617] animate-in fade-in duration-700">
          <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin-reverse"></div>
              <Cpu className="absolute inset-0 m-auto text-white animate-pulse" size={32}/>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-cyan-500 text-sm font-bold tracking-[0.3em] animate-pulse">AURA OS v7.0</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Sistem Modülleri Yükleniyor...</span>
          </div>
      </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
        
        {/* --- ÜST BAŞLIK ALANI --- */}
        <div className="flex flex-col md:flex-row justify-between items-end pb-2 border-b border-white/5 gap-4 relative">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            <div>
                <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                    <Activity className="text-cyan-500 animate-pulse" />
                    KOMUTA MERKEZİ
                </h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
                    İşletme Genel Görünümü • {new Date().toLocaleDateString('tr-TR')}
                </p>
            </div>
            <div className="flex gap-3 z-10">
                <button onClick={() => setRefreshKey(prev => prev + 1)} className="bg-[#1e293b] hover:bg-[#334155] border border-white/10 text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all">
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''}/> YENİLE
                </button>
                <Link href="/epanel/finans" className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all hover:scale-105 flex items-center gap-2">
                    <PieChart size={16}/> RAPORLAR
                </Link>
                <Link href="/epanel/satis" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105 flex items-center gap-2 border border-white/10">
                    <Plus size={16}/> İŞLEM EKLE
                </Link>
            </div>
        </div>

        {/* --- KPI KARTLARI --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="AYLIK CİRO" value={`${stats.monthlyRevenue.toLocaleString('tr-TR')} ₺`} subValue={`${stats.serviceCount + stats.storeSoldThisMonth} İşlem`} icon={DollarSign} color="cyan" trend={`%${stats.profitMargin} Kâr`} />
            <StatCard title="NET KÂR" value={`${stats.monthlyProfit.toLocaleString('tr-TR')} ₺`} subValue={`Gider: ${stats.monthlyCost.toLocaleString('tr-TR')} ₺`} icon={Wallet} color="emerald" />
            <StatCard title="BEKLEYEN ALACAK" value={`${stats.bekleyenAlacak.toLocaleString('tr-TR')} ₺`} subValue={`${stats.waiting + stats.processing} Aktif Dosya`} icon={Clock} color="yellow" />
            <StatCard title="STOK DEĞERİ" value={`${stats.totalStockValue.toLocaleString('tr-TR')} ₺`} subValue="Raf Değeri" icon={Package} color="purple" />
        </div>

        {/* --- ANA PANELLER --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* SOL PANEL (GELİŞMİŞ KANBAN & FİNANS) */}
            <div className="xl:col-span-2 space-y-6">
                
                {/* 1. KANBAN İŞ AKIŞI (ATÖLYE) */}
                <NeonCard title="ATÖLYE İŞ AKIŞI (KANBAN)" icon={Wrench} className="p-0" theme="blue" noPadding>
                    <div className="p-5 pb-0 grid grid-cols-1 md:grid-cols-3 gap-4 h-[450px]">
                        {/* Kolon 1: Bekleyen */}
                        <div className="bg-[#0f1219] rounded-xl border border-white/5 flex flex-col overflow-hidden hover:border-red-500/20 transition-colors">
                            <div className="p-3 bg-red-500/10 border-b border-red-500/10 flex justify-between items-center">
                                <span className="text-xs font-bold text-red-400 flex items-center gap-2"><AlertTriangle size={14}/> BEKLEYEN</span>
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.waiting}</span>
                            </div>
                            <div className="p-2 overflow-y-auto custom-scrollbar flex-1 space-y-2">
                                {stats.activeJobs.filter((j:any) => j.status?.toLowerCase().includes('bekliyor') || j.status?.toLowerCase().includes('yeni')).map(job => (
                                    <KanbanCard key={job.id} job={job} />
                                ))}
                                {stats.waiting === 0 && <div className="text-center text-slate-600 text-[10px] py-10">Kayıt yok.</div>}
                            </div>
                        </div>

                        {/* Kolon 2: İşlemde */}
                        <div className="bg-[#0f1219] rounded-xl border border-white/5 flex flex-col overflow-hidden hover:border-blue-500/20 transition-colors">
                            <div className="p-3 bg-blue-500/10 border-b border-blue-500/10 flex justify-between items-center">
                                <span className="text-xs font-bold text-blue-400 flex items-center gap-2"><Cpu size={14}/> İŞLEMDE</span>
                                <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.processing}</span>
                            </div>
                            <div className="p-2 overflow-y-auto custom-scrollbar flex-1 space-y-2">
                                {stats.activeJobs.filter((j:any) => j.status?.toLowerCase().includes('işlem') || j.status?.toLowerCase().includes('parça')).map(job => (
                                    <KanbanCard key={job.id} job={job} />
                                ))}
                            </div>
                        </div>

                        {/* Kolon 3: Hazır */}
                        <div className="bg-[#0f1219] rounded-xl border border-white/5 flex flex-col overflow-hidden hover:border-emerald-500/20 transition-colors">
                            <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/10 flex justify-between items-center">
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-2"><CheckCircle2 size={14}/> HAZIR</span>
                                <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.ready}</span>
                            </div>
                            <div className="p-2 overflow-y-auto custom-scrollbar flex-1 space-y-2">
                                {stats.activeJobs.filter((j:any) => j.status?.toLowerCase().includes('hazır') || j.status?.toLowerCase().includes('test')).map(job => (
                                    <KanbanCard key={job.id} job={job} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Alt Kategori Özeti (Eskisi gibi korundu) */}
                    <div className="grid grid-cols-4 gap-4 p-5 bg-[#0b0e14]">
                        {[
                            { label: "Telefon", val: stats.phone, ic: Smartphone, c: "text-purple-400" },
                            { label: "Robot", val: stats.robot, ic: Zap, c: "text-amber-400" },
                            { label: "PC", val: stats.pc, ic: Laptop, c: "text-blue-400" },
                            { label: "Diğer", val: stats.other, ic: Box, c: "text-slate-400" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-2 rounded-lg border border-white/5 bg-white/[0.02]">
                                <item.ic size={16} className={`mb-1 ${item.c}`}/>
                                <span className="text-xs font-bold text-white">{item.val}</span>
                                <span className="text-[9px] text-slate-500 uppercase">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </NeonCard>

                {/* 2. FİNANSAL ANALİZLER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NeonCard title="GELİR & GİDER ANALİZİ" icon={PieChart} className="p-5" theme="purple">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500 rounded-full animate-pulse opacity-20"></div>
                                <Banknote size={32} className="text-purple-500 relative z-10"/>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Nakit Akışı</h4>
                                <p className="text-[10px] text-slate-400">Bu Ayın Finansal Özeti</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <FinancialBar label="TOPLAM GELİR (CİRO)" value={stats.monthlyRevenue} total={stats.monthlyRevenue * 1.2} color="bg-cyan-500" />
                            <FinancialBar label="TOPLAM GİDER" value={stats.monthlyCost} total={stats.monthlyRevenue * 1.2} color="bg-red-500" />
                            <FinancialBar label="NET KÂR" value={stats.monthlyProfit} total={stats.monthlyRevenue * 1.2} color="bg-emerald-500" />
                        </div>
                    </NeonCard>

                    <NeonCard title="AYLIK HEDEF TAKİBİ" icon={Target} className="p-5" theme="amber">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-slate-400">Ciro Hedefi</span>
                            <span className="text-sm font-bold text-white">{stats.targetRevenue.toLocaleString()} ₺</span>
                        </div>
                        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden mb-6 relative border border-white/5">
                            <div className="absolute h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-1000" style={{ width: `${Math.min((stats.monthlyRevenue / stats.targetRevenue) * 100, 100)}%` }}></div>
                            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-md">%{Math.round((stats.monthlyRevenue / stats.targetRevenue) * 100)} TAMAMLANDI</div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                    <div className="p-1.5 bg-blue-500/20 rounded text-blue-400"><Wrench size={14}/></div> Servis Geliri
                                </div>
                                <span className="text-white font-mono">{stats.storeRevenue.toLocaleString()} ₺</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                    <div className="p-1.5 bg-purple-500/20 rounded text-purple-400"><ShoppingBag size={14}/></div> Mağaza Satış
                                </div>
                                <span className="text-white font-mono">{(stats.monthlyRevenue - stats.storeRevenue).toLocaleString()} ₺</span>
                            </div>
                        </div>
                    </NeonCard>
                </div>
            </div>

            {/* SAĞ PANEL: HIZLI ERİŞİM VE ARAÇLAR */}
            <div className="space-y-6">
                
                <NeonCard title="HIZLI ERİŞİM KOKPİTİ" icon={LayoutDashboard} className="p-5" theme="cyan">
                    <div className="grid grid-cols-1 gap-3">
                        <QuickAction icon={Wrench} label="Servis Kaydı Aç" desc="Yeni cihaz girişi yap" href="/epanel/hizli-kayit" color="bg-cyan-600" />
                        <QuickAction icon={ShoppingBag} label="Hızlı Satış Yap" desc="Ürün veya hizmet sat" href="/epanel/satis" color="bg-purple-600" />
                        <QuickAction icon={Package} label="Stok Ekle / Düzenle" desc="Envanter yönetimi" href="/epanel/stok" color="bg-emerald-600" />
                    </div>
                </NeonCard>

                {/* YENİ: HIZLI TEKLİF SİHİRBAZI */}
                <NeonCard title="HIZLI TEKLİF SİHİRBAZI" icon={Calculator} className="p-5" theme="purple">
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Parça Maliyeti ($ USD)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input type="number" value={quote.partCost} onChange={(e) => setQuote({...quote, partCost: Number(e.target.value)})} className="w-full bg-[#050810] border border-white/10 rounded-lg p-2.5 pl-7 text-white text-sm outline-none focus:border-purple-500 transition-colors" placeholder="0" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">İşçilik (TL)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₺</span>
                                <input type="number" value={quote.labor} onChange={(e) => setQuote({...quote, labor: Number(e.target.value)})} className="w-full bg-[#050810] border border-white/10 rounded-lg p-2.5 pl-7 text-white text-sm outline-none focus:border-purple-500 transition-colors" placeholder="0" />
                            </div>
                        </div>
                        <div className="pt-3 border-t border-white/5 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Dolar Kuru:</span>
                                <input type="number" value={quote.rate} onChange={(e) => setQuote({...quote, rate: Number(e.target.value)})} className="w-16 bg-transparent border-b border-white/10 text-right text-xs text-slate-300 outline-none"/>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Parça (TL):</span>
                                <span className="text-xs text-white font-mono">{(quote.partCost * quote.rate).toLocaleString()} ₺</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-black text-purple-400 mt-2 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                                <span>TOPLAM:</span>
                                <span>{((quote.partCost * quote.rate) + quote.labor).toLocaleString()} ₺</span>
                            </div>
                            <button className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
                                <CheckCircle2 size={14}/> TEKLİF OLUŞTUR
                            </button>
                        </div>
                    </div>
                </NeonCard>

                <NeonCard title="DEPO DURUMU" icon={Package} className="p-5" theme="emerald">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center text-xs p-3 bg-[#0f1219] rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors shadow-sm group">
                            <span className="text-slate-400 flex items-center gap-2 group-hover:text-purple-400 transition-colors"><Box size={14}/> Paketleniyor</span>
                            <span className="text-white font-bold bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">{stats.storePacking}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs p-3 bg-[#0f1219] rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors shadow-lg group">
                            <span className="text-slate-400 flex items-center gap-2 group-hover:text-blue-400 transition-colors"><Truck size={14}/> Yolda / Kargo</span>
                            <span className="text-white font-bold bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">{stats.storeShipped}</span>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2 flex justify-between">
                            <span>VİTRİN ÖZETİ</span>
                            <Link href="/epanel/magaza" className="text-cyan-500 hover:text-cyan-400 transition-colors">Tümü</Link>
                        </h4>
                        <div className="space-y-1.5">
                            {stats.stockList.length === 0 ? (
                                <div className="text-center text-xs text-slate-600 py-2">Vitrin boş.</div>
                            ) : (
                                stats.stockList.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-2 hover:bg-white/5 rounded transition-colors group cursor-default">
                                        <span className="text-slate-300 truncate max-w-[140px] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-cyan-400 transition-colors"></div>
                                            {item.name}
                                        </span>
                                        <span className="text-slate-500 font-mono font-bold group-hover:text-white transition-colors">{Number(item.price).toLocaleString()} ₺</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </NeonCard>

                 <NeonCard title="İŞLETME GÜNLÜĞÜ" icon={FileText} className="p-0" theme="red">
                    <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {stats.recentActivities.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-500 italic">Henüz bir aktivite yok.</div>
                        ) : (
                            stats.recentActivities.map((act, i) => (
                                <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                                    <div className={`p-2.5 rounded-lg border ${act.icon ? act.color : 'bg-slate-800'}`}>
                                        {act.icon ? <act.icon size={16}/> : <Activity size={16}/>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <h5 className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors">{act.title}</h5>
                                            <span className="text-[9px] text-slate-500 font-mono">{new Date(act.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 truncate">{act.desc}</p>
                                    </div>
                                    {act.amount > 0 && (
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">+{act.amount.toLocaleString()} ₺</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </NeonCard>
            </div>
        </div>
    </div>
  );
}