"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Users, Smartphone, Zap, Laptop, Box, 
  Wrench, CheckCircle2, Clock, 
  DollarSign, Wallet, 
  ShoppingBag, Package, Truck, ArrowRight, 
  LayoutDashboard, Search, Bell, AlertTriangle, 
  Target, Banknote, Calendar, 
  Activity, RefreshCw, Calculator, Plus, Bike, MapPin, CalendarClock,
  TrendingUp, TrendingDown, Cpu, ChevronRight, PlayCircle, BarChart3, AlertOctagon, UserCheck, Star, CreditCard, Coins, CheckSquare, PlusCircle, X
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 

// --- GRAFİK BİLEŞENİ (GERÇEK VERİ İÇİN GÜNCELLENDİ) ---
const SimpleLineChart = ({ data, color = "#06b6d4" }: { data: number[], color?: string }) => {
    // Veri yoksa düz çizgi
    const safeData = data.length > 0 ? data : [0,0,0,0,0,0,0];
    const max = Math.max(...safeData, 100); // 0 bölme hatası olmasın diye min 100
    const min = 0;
    
    const points = safeData.map((val, i) => {
        const x = (i / (safeData.length - 1)) * 100;
        const y = 100 - ((val / max) * 80) - 10; 
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="w-full h-28 relative overflow-hidden group">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <path d={`M0,100 ${points.split(" ").map(p => "L" + p).join(" ")} L100,100 Z`} fill={color} fillOpacity="0.15" />
                <polyline fill="none" stroke={color} strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Hover Tooltips */}
            <div className="absolute inset-0 flex justify-between items-end px-1 pb-1">
                {safeData.map((d, i) => (
                    <div key={i} className="group/point relative flex flex-col items-center justify-end h-full w-full">
                        <div className="w-2 h-2 rounded-full bg-[#0b0e14] border-2 transition-all group-hover/point:scale-150 group-hover/point:bg-white z-10" style={{ borderColor: color, position: 'absolute', bottom: `${(d / max) * 80 + 10}%` }}></div>
                        
                        {/* Tooltip */}
                        <div className="absolute opacity-0 group-hover/point:opacity-100 transition-opacity -top-2 bg-[#1e293b] border border-white/10 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none" style={{ bottom: `${(d / max) * 80 + 20}%`, top: 'auto' }}>
                            {d.toLocaleString()} ₺
                        </div>
                        
                        {/* Dikey Çizgi Efekti */}
                        <div className="w-[1px] bg-white/5 h-full absolute bottom-0 opacity-0 group-hover/point:opacity-100 transition-opacity"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- BENTO KART ---
const BentoCard = ({ children, className = "", title, icon: Icon, subTitle, glow = "blue", action }: any) => {
    const glows: any = {
        blue: "hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] border-blue-500/20 hover:border-blue-500/40",
        purple: "hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)] border-purple-500/20 hover:border-purple-500/40",
        emerald: "hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] border-emerald-500/20 hover:border-emerald-500/40",
        orange: "hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] border-orange-500/20 hover:border-orange-500/40",
        red: "hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)] border-red-500/20 hover:border-red-500/40",
        cyan: "hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)] border-cyan-500/20 hover:border-cyan-500/40",
        yellow: "hover:shadow-[0_0_40px_-10px_rgba(234,179,8,0.2)] border-yellow-500/20 hover:border-yellow-500/40",
    };

    return (
        <div className={`relative bg-[#0f1219]/80 backdrop-blur-3xl border rounded-3xl p-5 transition-all duration-500 group overflow-hidden flex flex-col ${glows[glow]} ${className}`}>
            <div className={`absolute -right-12 -top-12 w-48 h-48 bg-${glow}-500/5 rounded-full blur-[60px] group-hover:bg-${glow}-500/10 transition-all pointer-events-none`}></div>
            {title && (
                <div className="flex justify-between items-center mb-4 relative z-10 shrink-0">
                    <div>
                        <h3 className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-widest">
                            {Icon && <Icon size={14} className={`text-${glow}-400`} />}
                            {title}
                        </h3>
                        {subTitle && <p className="text-[9px] text-slate-500 font-bold mt-0.5">{subTitle}</p>}
                    </div>
                    {action}
                </div>
            )}
            <div className="relative z-10 flex-1">{children}</div>
        </div>
    );
};

// --- KPI KART ---
const StatCard = ({ title, value, subValue, icon: Icon, color, trend }: any) => {
    const colorMap: any = {
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        yellow: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        red: "text-red-400 bg-red-500/10 border-red-500/20",
    };
    const classes = colorMap[color] || "text-slate-400 bg-slate-500/10 border-slate-500/20";

    return (
        <div className={`relative p-5 bg-[#0f1219]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group hover:border-white/10`}>
            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className={`p-2.5 rounded-xl border ${classes} transition-transform group-hover:rotate-12`}>
                    <Icon size={20} />
                </div>
                {trend && <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${classes}`}>{trend}</span>}
            </div>
            <div>
                <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1">{title} <span className="text-slate-600 font-normal normal-case opacity-50">| {subValue}</span></p>
            </div>
        </div>
    );
};

// --- TICKER ---
const NewsTicker = ({ items }: { items: string[] }) => (
    <div className="w-full bg-cyan-950/20 border-y border-cyan-500/10 h-7 flex items-center overflow-hidden relative">
        <div className="absolute left-0 bg-cyan-950/80 backdrop-blur h-full px-3 flex items-center z-10 border-r border-cyan-500/20">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse mr-2"></span>
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">LIVE</span>
        </div>
        <div className="whitespace-nowrap animate-marquee flex gap-12 pl-24">
            {items.map((item, i) => (
                <span key={i} className="text-[10px] text-slate-300 font-mono flex items-center gap-2 uppercase">
                    <Activity size={10} className="text-slate-600"/> {item}
                </span>
            ))}
        </div>
    </div>
);

// --- MAIN DASHBOARD ---
export default function EPanelDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [tickerItems, setTickerItems] = useState<string[]>(["Sistem başlatıldı..."]);
  
  // TARİH
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  // DATA STATE
  const [stats, setStats] = useState<any>({
    monthlyRevenue: 0, monthlyCost: 0, monthlyProfit: 0, profitMargin: 0, bekleyenAlacak: 0,
    serviceCount: 0, waiting: 0, processing: 0, ready: 0,
    activeJobs: [], 
    courierWaiting: 0, courierOnWay: 0, 
    maintenanceDue: 0, targetRevenue: 150000,
    lowStock: [], weeklyTrend: [0,0,0,0,0,0,0],
    dailyGoal: 5, dailyFinished: 0, // Günlük Hedef
    paymentSplit: { cash: 0, card: 0 } // Nakit/Kart
  });

  const [quote, setQuote] = useState({ partCost: 0, labor: 0, rate: 36.80 }); 
  
  // Mini Todo List State
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try {
            const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
            const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59).toISOString();

            // 1. JOBS
            const { data: jobs } = await supabase.from('aura_jobs').select('*').gte('created_at', startDate).lte('created_at', endDate);
            const { data: activeJobs } = await supabase.from('aura_jobs').select('*').neq('status', 'Teslim Edildi').neq('status', 'İptal').order('created_at', {ascending: false}).limit(5);
            
            // 2. FINANS (Ödeme Yöntemi Analizi İçin)
            const { data: finances } = await supabase.from('aura_finans').select('*').gte('tarih', startDate).lte('tarih', endDate);

            // 3. COURIER
            const { data: couriers } = await supabase.from('aura_courier').select('status');
            
            // 4. ALERTS
            const todayStr = new Date().toISOString().split('T')[0];
            const { count: maintenanceCount } = await supabase.from('aura_jobs').select('*', { count: 'exact', head: true }).eq('status', 'Teslim Edildi').lte('next_maintenance_date', todayStr);

            // 5. TICKER
            const { data: timeline } = await supabase.from('aura_timeline').select('description, created_at').order('created_at', {ascending: false}).limit(10);
            if(timeline) setTickerItems(timeline.map(t => `${t.description}`));

            // --- CALCULATIONS ---
            let rev = 0, cost = 0, pending = 0, sCount = 0;
            let cWaiting = 0, cOnWay = 0;
            
            // Son 7 Gün Trendi Hazırla
            const trend = [0,0,0,0,0,0,0];
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toISOString().split('T')[0];
            }).reverse();

            // Günlük Hedef Sayacı
            let dailyDone = 0;

            if (jobs) {
                jobs.forEach((j: any) => {
                    const p = Number(j.price) || 0; 
                    const c = Number(j.cost) || 0;
                    
                    if(j.status === 'Teslim Edildi') { 
                        rev += p; cost += c; sCount++; 
                        
                        // Günlük Biten İş
                        if (j.updated_at?.split('T')[0] === todayStr) dailyDone++;

                        // Trend Grafiği (Son 7 Gün)
                        const jobDate = j.updated_at?.split('T')[0] || j.created_at.split('T')[0];
                        const dayIndex = last7Days.indexOf(jobDate);
                        if (dayIndex !== -1) trend[dayIndex] += p;
                    } 
                    else if(j.status !== 'İptal') { pending += p; }
                });
            }

            // Finansal Dağılım (Nakit / Kart)
            let cash = 0, card = 0;
            if (finances) {
                finances.forEach((f: any) => {
                    if (f.tur === 'Gelir') {
                        const amt = Number(f.tutar) || 0;
                        if (f.odeme_yontemi === 'Nakit') cash += amt;
                        else card += amt;
                    } else if (f.tur === 'Gider') {
                        cost += Number(f.tutar) || 0;
                    }
                });
            }

            if (couriers) couriers.forEach((c: any) => c.status === 'Bekliyor' ? cWaiting++ : c.status === 'Tamamlandı' ? null : cOnWay++);

            // Aktif İşler
            let w = 0, pr = 0, r = 0;
            if(activeJobs) activeJobs.forEach((j:any) => {
                const s = (j.status||"").toLowerCase();
                if(s.includes("bekliyor")) w++; else if(s.includes("hazır")) r++; else pr++;
            });

            setStats({
                monthlyRevenue: rev, monthlyCost: cost, monthlyProfit: rev - cost,
                profitMargin: rev > 0 ? Math.round(((rev - cost) / rev) * 100) : 0,
                bekleyenAlacak: pending, serviceCount: sCount,
                activeJobs: activeJobs || [],
                waiting: w, processing: pr, ready: r,
                courierWaiting: cWaiting, courierOnWay: cOnWay,
                maintenanceDue: maintenanceCount || 0,
                targetRevenue: 150000,
                weeklyTrend: trend,
                dailyGoal: 5, dailyFinished: dailyDone,
                paymentSplit: { cash, card }
            });

        } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    fetchData();
  }, [selectedMonth, selectedYear, refreshKey]);

  // Todo İşlemleri
  const handleAddTodo = (e: any) => {
      if(e.key === 'Enter' && newTodo) {
          setTodos([...todos, newTodo]);
          setNewTodo("");
      }
  }

  return (
    <div className="min-h-screen pb-12 animate-in fade-in duration-500">
        
        <div className="mb-6 -mx-6 -mt-6">
            <NewsTicker items={tickerItems} />
        </div>

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter mb-2 flex items-center gap-3">
                    <Activity size={32} className="text-cyan-500" />
                    AURA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">INTELLIGENCE</span>
                </h1>
                <p className="text-slate-400 text-sm font-medium">Hoş geldin Şef, sistemler %100 operasyonel.</p>
            </div>
            <div className="flex items-center gap-4 bg-[#1e293b] p-2 rounded-2xl border border-white/5 shadow-xl">
                 <button onClick={() => setRefreshKey(prev => prev + 1)} className="p-3 bg-[#0f1219] rounded-xl hover:bg-cyan-500 hover:text-white text-slate-400 transition-all"><RefreshCw size={20} className={loading ? 'animate-spin' : ''}/></button>
                 <div className="px-4 text-right border-l border-white/5">
                    <div className="text-xs font-bold text-slate-500 uppercase">{months[selectedMonth-1]} {selectedYear}</div>
                    <div className="text-white font-bold">{new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</div>
                 </div>
            </div>
        </div>

        {/* --- KPI --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard title="NET CİRO" value={`${stats.monthlyRevenue.toLocaleString()} ₺`} subValue={`${stats.serviceCount} Cihaz`} icon={DollarSign} color="cyan" trend={`%${stats.profitMargin} Kâr`} />
            <StatCard title="NET KÂR" value={`${stats.monthlyProfit.toLocaleString()} ₺`} subValue={`Gider: ${stats.monthlyCost.toLocaleString()}`} icon={Wallet} color="emerald" />
            <StatCard title="BEKLEYEN" value={`${stats.bekleyenAlacak.toLocaleString()} ₺`} subValue="Tahsilat" icon={Clock} color="yellow" />
            <StatCard title="BAKIM" value={`${stats.maintenanceDue} ADET`} subValue="Alarm Veriyor" icon={CalendarClock} color={stats.maintenanceDue > 0 ? "red" : "emerald"} />
        </div>

        {/* --- ANA BENTO GRID --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* SOL KOLON (2/3) */}
            <div className="xl:col-span-2 space-y-6">
                
                {/* 1. GELİR TRENDİ (YENİ SVG GRAFİK) */}
                <BentoCard title="GELİR TRENDİ (SON 7 GÜN)" icon={BarChart3} glow="cyan" className="min-h-[280px]">
                    <div className="flex flex-col h-full justify-between">
                        <div className="mb-4">
                            <h2 className="text-3xl font-black text-white">{stats.weeklyTrend.reduce((a:any,b:any)=>a+b,0).toLocaleString()} ₺</h2>
                            <p className="text-xs text-slate-500">Son 7 günlük toplam işlem hacmi</p>
                        </div>
                        <SimpleLineChart data={stats.weeklyTrend} color="#22d3ee" />
                    </div>
                </BentoCard>

                {/* 2. ATÖLYE & KURYE DURUMU */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BentoCard title="ATÖLYE DURUMU" icon={Wrench} glow="blue" action={<Link href="/epanel/atolye" className="text-[10px] text-blue-400 hover:underline">Tümü</Link>}>
                        <div className="space-y-3 mt-2">
                            <div className="flex justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/10 items-center">
                                <span className="text-xs font-bold text-red-400 flex gap-2"><AlertTriangle size={14}/> Bekleyen</span>
                                <span className="text-white font-black">{stats.waiting}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/10 items-center">
                                <span className="text-xs font-bold text-blue-400 flex gap-2"><Cpu size={14}/> İşlemde</span>
                                <span className="text-white font-black">{stats.processing}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/10 items-center">
                                <span className="text-xs font-bold text-emerald-400 flex gap-2"><CheckCircle2 size={14}/> Hazır</span>
                                <span className="text-white font-black">{stats.ready}</span>
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard title="KURYE OPERASYON" icon={Bike} glow="orange" action={<Link href="/epanel/kurye-yonetim" className="text-[10px] text-orange-400 hover:underline">Yönet</Link>}>
                        <div className="flex items-center justify-between h-full px-2">
                            <div className="text-center group">
                                <div className="text-3xl font-black text-white group-hover:text-orange-500 transition-colors">{stats.courierWaiting}</div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Bekleyen</div>
                            </div>
                            <div className="h-10 w-[1px] bg-white/10"></div>
                            <div className="text-center group">
                                <div className="text-3xl font-black text-blue-400 group-hover:text-blue-300 transition-colors">{stats.courierOnWay}</div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Yolda</div>
                            </div>
                            <div className="h-10 w-[1px] bg-white/10"></div>
                            <div className="text-center">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto text-orange-500">
                                    <Bike size={20}/>
                                </div>
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* 3. AKTİF İŞLER LİSTESİ */}
                <BentoCard title="SON HAREKETLER" icon={Clock} glow="purple">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-white/5">
                                    <th className="pb-3 pl-2">Takip No</th>
                                    <th className="pb-3">Müşteri / Cihaz</th>
                                    <th className="pb-3">Durum</th>
                                    <th className="pb-3 text-right">Tutar</th>
                                    <th className="pb-3"></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {stats.activeJobs.length === 0 ? <tr><td colSpan={5} className="text-center py-10 text-slate-600 text-xs">Kayıt bulunamadı.</td></tr> : stats.activeJobs.map((job:any) => (
                                    <tr key={job.id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                        <td className="py-3 pl-2 font-mono text-xs text-slate-400">#{job.tracking_code?.split('-')[1]}</td>
                                        <td className="py-3">
                                            <div className="font-bold text-white text-xs">{job.customer}</div>
                                            <div className="text-[10px] text-slate-500">{job.device}</div>
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                                                job.status === 'Bekliyor' ? 'bg-red-500/10 text-red-400' : 
                                                job.status === 'Hazır' ? 'bg-emerald-500/10 text-emerald-400' : 
                                                'bg-blue-500/10 text-blue-400'
                                            }`}>{job.status}</span>
                                        </td>
                                        <td className="py-3 text-right font-mono font-bold text-slate-300 text-xs">
                                            {job.price > 0 ? `${Number(job.price).toLocaleString()} ₺` : '-'}
                                        </td>
                                        <td className="py-3 text-right">
                                            <Link href={`/epanel/atolye/${job.id}`} className="p-1.5 bg-white/5 rounded hover:bg-purple-500 hover:text-white transition-colors inline-block"><ChevronRight size={14}/></Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </BentoCard>
            </div>

            {/* SAĞ KOLON (1/3) */}
            <div className="space-y-6">
                
                {/* GÜNLÜK HEDEF (YENİ) */}
                <BentoCard title="GÜNLÜK HEDEF" icon={Target} glow="yellow" subTitle={`${stats.dailyFinished} / ${stats.dailyGoal} Cihaz`}>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-yellow-500 transition-all duration-1000" strokeDasharray={175} strokeDashoffset={175 - (Math.min(stats.dailyFinished / stats.dailyGoal, 1) * 175)} />
                            </svg>
                            <span className="absolute text-xs font-black text-white">%{Math.round((stats.dailyFinished / stats.dailyGoal) * 100)}</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-slate-400">Hedefe ulaşmak için {Math.max(0, stats.dailyGoal - stats.dailyFinished)} cihaz daha tamamlamalısın.</p>
                        </div>
                    </div>
                </BentoCard>

                {/* FİNANSAL DAĞILIM (YENİ) */}
                <BentoCard title="KASA DAĞILIMI" icon={Coins} glow="emerald">
                    <div className="flex gap-2 mt-2">
                        <div className="flex-1 bg-[#0b0e14] p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center group hover:border-emerald-500/30 transition-colors">
                            <Banknote className="text-emerald-500 mb-1" size={20}/>
                            <span className="text-[10px] text-slate-500 uppercase">NAKİT</span>
                            <span className="text-sm font-bold text-white">{stats.paymentSplit.cash.toLocaleString()}₺</span>
                        </div>
                        <div className="flex-1 bg-[#0b0e14] p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center group hover:border-purple-500/30 transition-colors">
                            <CreditCard className="text-purple-500 mb-1" size={20}/>
                            <span className="text-[10px] text-slate-500 uppercase">KART</span>
                            <span className="text-sm font-bold text-white">{stats.paymentSplit.card.toLocaleString()}₺</span>
                        </div>
                    </div>
                </BentoCard>

                {/* HIZLI TEKLİF */}
                <BentoCard title="HIZLI TEKLİF" icon={Calculator} glow="cyan">
                     <div className="space-y-3 mt-1">
                        <div className="flex gap-2">
                             <input type="number" placeholder="Parça ($)" className="w-1/2 bg-[#050810] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-500 transition-colors" onChange={e => setQuote({...quote, partCost: Number(e.target.value)})}/>
                             <input type="number" placeholder="Kur" value={quote.rate} className="w-1/2 bg-[#050810] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-500 transition-colors" onChange={e => setQuote({...quote, rate: Number(e.target.value)})}/>
                        </div>
                        <input type="number" placeholder="İşçilik (TL)" className="w-full bg-[#050810] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-500 transition-colors" onChange={e => setQuote({...quote, labor: Number(e.target.value)})}/>
                        <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-xl flex justify-between items-center">
                             <span className="text-xs font-bold text-cyan-400">SONUÇ:</span>
                             <span className="text-lg font-black text-white">{((quote.partCost * quote.rate) + quote.labor).toLocaleString()} ₺</span>
                        </div>
                     </div>
                </BentoCard>

                {/* MINI TODO LIST (YENİ) */}
                <BentoCard title="HIZLI NOTLAR" icon={CheckSquare} glow="red">
                    <div className="flex gap-2 mb-3">
                        <input type="text" placeholder="Not ekle..." className="flex-1 bg-[#050810] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-red-500 transition-colors" value={newTodo} onChange={e=>setNewTodo(e.target.value)} onKeyDown={handleAddTodo} />
                        <button onClick={() => { if(newTodo) { setTodos([...todos, newTodo]); setNewTodo(""); }}} className="bg-red-500/20 text-red-400 p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Plus size={14}/></button>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                        {todos.length === 0 && <span className="text-[10px] text-slate-600 italic">Yapılacak iş yok.</span>}
                        {todos.map((t, i) => (
                            <div key={i} className="flex justify-between items-center bg-[#0b0e14] p-2 rounded border border-white/5 text-[10px] text-slate-300 group">
                                <span>{t}</span>
                                <button onClick={() => setTodos(todos.filter((_, idx) => idx !== i))} className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                            </div>
                        ))}
                    </div>
                </BentoCard>

            </div>
        </div>
    </div>
  );
}