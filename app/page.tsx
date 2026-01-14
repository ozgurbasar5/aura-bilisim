"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  // Temel UI İkonları
  Search, ArrowRight, ChevronRight, Menu, X, Plus, Minus, 
  Check, CheckCircle, CheckCircle2, AlertTriangle, Info, HelpCircle,
  
  // Marka ve Sosyal
  Instagram, Facebook, Twitter, 
  
  // Donanım ve Cihazlar
  Smartphone, Laptop, Tablet, Watch, Monitor, HardDrive, 
  Cpu, CircuitBoard, Battery, BatteryCharging, Fan, 
  MousePointer2, Bot,
  
  // Teknik ve Servis
  Wrench, Hammer, Zap, Signal, Wifi, Activity, 
  Microscope, Layers, Scan, Move, Power, Terminal, 
  FileSearch, ShieldCheck, ShieldAlert,
  
  // Ticaret ve Mağaza
  ShoppingBag, Package, Tag, CreditCard,
  
  // Kurumsal ve Diğer
  Users, Trophy, Award, HeartPulse, Star, Gem, 
  MapPin, Clock, Eye, Globe, Map, FileText,
  
  // Navigasyon
  Home as HomeIcon, LifeBuoy, Phone, MessageCircle, Send,
  
  // Sistem
  BarChart3, Thermometer, Droplets, GripVertical,

  
  
  // YENİ EKLENEN
  Building2
} from "lucide-react";
import HeroVisuals from "@/components/HeroVisuals";

import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase";



// -----------------------------------------------------------------------------
// 1. BİLEŞEN: CANLI SERVİS İSTİHBARATI (LIVE LOGS)
// -----------------------------------------------------------------------------
function LiveLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ cpu: 12, ram: 45, ping: 24 });

  useEffect(() => {
    const interval = setInterval(() => {
        setStats({
            cpu: Math.floor(Math.random() * (45 - 10) + 10),
            ram: Math.floor(Math.random() * (60 - 30) + 30),
            ping: Math.floor(Math.random() * (35 - 15) + 15),
        });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const dummyData = [
    { device: "iPhone 14 Pro", action: "FaceID Dot Projector Onarıldı", status: "success", time: "12 sn önce" },
    { device: "Roborock S7", action: "Lidar Motoru Değişimi", status: "warning", time: "45 sn önce" },
    { device: "Monster Tulpar", action: "Termal Macun (Sıvı Metal) Uygulandı", status: "process", time: "1 dk önce" },
    { device: "Dyson V11", action: "Tetik Mekanizması Güçlendirildi", status: "success", time: "3 dk önce" },
    { device: "Samsung S23 Ultra", action: "Ekran Flex Revizyonu", status: "process", time: "5 dk önce" },
    { device: "Xiaomi Mi Robot", action: "Anakart Sıvı Teması Temizliği", status: "process", time: "7 dk önce" },
    { device: "MacBook Pro M1", action: "NAND Entegre Değişimi", status: "warning", time: "12 dk önce" },
  ];

  useEffect(() => {
    setLogs(dummyData);
    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [...prev];
        const first = newLogs.shift(); 
        if (first) newLogs.push(first);
        return newLogs;
      });
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#02040a] border-y border-white/5 py-3 overflow-hidden relative group z-30 font-mono">
      {/* SOL PANEL: Sistem Monitörü */}
      <div className="absolute left-0 top-0 bottom-0 bg-[#02040a] z-20 px-4 md:px-8 flex items-center gap-6 border-r border-white/10 shadow-[20px_0_40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
            <span className="text-[10px] font-bold text-emerald-500 tracking-widest hidden md:block">ONLINE</span>
        </div>
        <div className="hidden lg:flex gap-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1"><Cpu size={10} className="text-cyan-500"/> CPU: {stats.cpu}%</div>
            <div className="flex items-center gap-1"><BarChart3 size={10} className="text-purple-500"/> MEM: {stats.ram}%</div>
            <div className="flex items-center gap-1"><Signal size={10} className="text-yellow-500"/> {stats.ping}ms</div>
        </div>
      </div>

      {/* SAĞ PANEL: Kayan Loglar */}
      <div className="flex gap-8 animate-infinite-scroll pl-32 md:pl-[400px] hover:[animation-play-state:paused]">
        {[...logs, ...logs].map((log, i) => (
          <div key={i} className="flex items-center gap-3 min-w-max px-3 py-1 rounded bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-colors group/item">
            {log.status === 'success' ? <Check size={12} className="text-emerald-400"/> : 
             log.status === 'warning' ? <Wrench size={12} className="text-amber-400"/> : 
             <Activity size={12} className="text-cyan-400 animate-pulse"/>}
            
            <span className="text-[11px] text-slate-400 font-medium">
              <span className="text-slate-200 font-bold">{log.device}</span> <span className="text-slate-600">::</span> {log.action}
            </span>
            <span className="text-[9px] text-slate-600 font-bold border-l border-white/10 pl-2 flex items-center gap-1">
                <Clock size={10}/> {log.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 2. X-RAY DIAGNOSTICS (YENİ MODÜL) ---
function XrayDiagnostics() {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  const deviceData = {
    name: "iPhone 14 Pro Max",
    modelCode: "A2894 (EMC 8240)",
    parts: [
      {
        id: "logic-board",
        label: "A16 Bionic Anakart",
        shortDesc: "Cihazın beyni. CPU, GPU ve Neural Engine.",
        fullDesc: "TSMC 4nm süreciyle üretilen 6 çekirdekli CPU. Sandwich PCB yapısı.",
        specs: [
          { key: "Çipset", val: "Apple A16 Bionic" },
          { key: "Mimari", val: "Sandwich PCB" },
          { key: "Onarım", val: "BGA Reballing" },
        ],
        svgPath: "M 180 40 H 280 V 160 H 220 V 280 H 120 V 200 H 180 V 40 Z",
        centerX: 220, centerY: 100
      },
      {
        id: "battery",
        label: "Li-Ion Batarya",
        shortDesc: "4323 mAh kapasiteli güç kaynağı.",
        fullDesc: "Yüksek yoğunluklu Lityum-İyon polimer batarya. %100 sağlık kalibrasyonu.",
        specs: [
          { key: "Kapasite", val: "4323 mAh" },
          { key: "Voltaj", val: "3.85V DC" },
          { key: "Onarım", val: "Hücre Değişimi" },
        ],
        svgPath: "M 30 80 H 160 V 280 H 30 V 80 Z M 160 200 H 200 V 280 H 160 V 200 Z",
        centerX: 95, centerY: 180
      },
      {
        id: "truedepth",
        label: "TrueDepth (FaceID)",
        shortDesc: "Yüz tanıma sensör dizisi.",
        fullDesc: "Dot Projector ve Kızılötesi kamera içeren modül.",
        specs: [
          { key: "Sensörler", val: "IR + Dot Proj." },
          { key: "Hassasiyet", val: "Mikron Seviyesi" },
        ],
        svgPath: "M 120 10 H 200 V 35 H 120 V 10 Z",
        centerX: 160, centerY: 22.5
      },
      {
        id: "camera-rear",
        label: "Pro Kamera",
        shortDesc: "48MP Ana, Ultra Geniş ve Telefoto.",
        fullDesc: "Sensör kaydırmalı OIS içeren üçlü lens bloğu.",
        specs: [
          { key: "Ana Sensör", val: "48MP" },
          { key: "OIS", val: "Sensor-Shift 2" },
        ],
        svgPath: "M 20 40 H 100 V 140 H 20 V 40 Z",
        centerX: 60, centerY: 90
      }
    ]
  };

  const selectedPartData = selectedPartId ? deviceData.parts.find(p => p.id === selectedPartId) : null;

  return (
    <section className="py-24 bg-[#020408] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#22d3ee0a_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Scan size={14} className="animate-pulse"/> X-RAY DIAGNOSTICS v3.0
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                Cihazın <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">Anatomisi</span>
            </h2>
            <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-sm md:text-lg font-light leading-relaxed">
                Laboratuvarımızdaki mühendislik yaklaşımını keşfedin. Cihazınızın iç dünyasına interaktif bir bakış atın.
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* SOL TARAF: X-RAY SVG */}
            <div className="flex-1 w-full relative group outline-none px-4">
                <div className="relative w-full max-w-[320px] mx-auto aspect-[9/16] bg-[#050810] rounded-[3rem] border-4 border-[#1e293b] shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_80px_rgba(6,182,212,0.2)]">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.8)] z-20 animate-scanline opacity-70 pointer-events-none"></div>
                    <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 320 568" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1"/>
                            </pattern>
                            <linearGradient id="selected-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
                                <stop offset="100%" stopColor="rgba(34, 211, 238, 0.1)" />
                            </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
                        <rect x="10" y="10" width="300" height="548" rx="35" fill="none" stroke="#334155" strokeWidth="3" opacity="0.5"/>
                        {deviceData.parts.map((part) => {
                            const isSelected = selectedPartId === part.id;
                            return (
                                <g key={part.id} onClick={() => setSelectedPartId(isSelected ? null : part.id)} className="cursor-pointer group/part transition-all duration-300">
                                    <path d={part.svgPath} fill={isSelected ? "url(#selected-gradient)" : "transparent"} stroke={isSelected ? "#22d3ee" : "#475569"} strokeWidth={isSelected ? "2" : "1.5"} className={`transition-all duration-300 ${isSelected ? 'filter drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'group-hover/part:stroke-cyan-400 group-hover/part:fill-cyan-500/10'}`} strokeDasharray={isSelected ? "none" : "5,5"}/>
                                    {!isSelected && (<circle cx={part.centerX} cy={part.centerY} r="4" fill="#22d3ee" className="opacity-0 group-hover/part:opacity-100 transition-opacity animate-pulse" />)}
                                    {isSelected && (<g transform={`translate(${part.centerX - 12}, ${part.centerY - 12})`}><circle cx="12" cy="12" r="16" fill="#06b6d4" fillOpacity="0.2" className="animate-pulse" /><Microscope size={24} className="text-cyan-400" /></g>)}
                                </g>
                            );
                        })}
                    </svg>
                    <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none">
                        <span className="text-[10px] font-mono text-cyan-500/60 tracking-widest uppercase">MODEL: {deviceData.name}</span>
                    </div>
                </div>
            </div>

            {/* SAĞ TARAF: DETAYLI BİLGİ PANELİ */}
            <div className="flex-1 w-full">
                <div className={`h-full bg-[#0a0e17]/80 backdrop-blur-xl border rounded-3xl p-8 relative overflow-hidden transition-all duration-500 ${selectedPartData ? 'border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]' : 'border-white/10'}`}>
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(6,182,212,0.05)_50%,transparent_52%)] bg-[size:20px_20px] pointer-events-none"></div>
                    {selectedPartData ? (
                        <div className="relative z-10 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-start justify-between mb-6 pb-6 border-b border-cyan-500/20">
                                <div><h3 className="text-2xl md:text-3xl font-black text-white leading-tight">{selectedPartData.label}</h3></div>
                                <Cpu size={32} className="text-cyan-500/50" />
                            </div>
                            <div className="mb-8">
                                <p className="text-white text-lg font-medium mb-2">{selectedPartData.shortDesc}</p>
                                <p className="text-slate-400 text-sm leading-relaxed">{selectedPartData.fullDesc}</p>
                            </div>
                            <div className="bg-[#0f1420] rounded-xl border border-white/5 p-4 mb-6">
                                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Terminal size={16} className="text-cyan-400"/> Teknik Veriler</h4>
                                <div className="space-y-3">
                                    {selectedPartData.specs.map((spec, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                            <span className="text-slate-500 font-mono">{spec.key}:</span>
                                            <span className="text-cyan-50 font-bold">{spec.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div className="mt-auto pt-4">
                                <Link href="/onarim-talebi" className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 group">
                                    <Wrench size={18} className="group-hover:rotate-12 transition-transform"/> Onarım Talep Et
                                </Link>
                             </div>
                        </div>
                    ) : (
                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-500 min-h-[300px]">
                             <div className="w-24 h-24 bg-cyan-950/30 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20 relative">
                                <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping-slow opacity-50"></div>
                                <Scan size={40} className="text-cyan-400" />
                             </div>
                             <h3 className="text-2xl font-bold text-white mb-3">Sistem Hazır</h3>
                             <p className="text-slate-400 max-w-sm leading-relaxed mb-6">Analiz etmek istediğiniz donanım bileşeninin üzerine gelin veya tıklayın.</p>
                             <div className="flex gap-2 text-xs font-mono text-slate-500 bg-[#0f1420] px-4 py-2 rounded-lg border border-white/5">
                                 <Activity size={14} className="text-cyan-500 animate-pulse"/> AWAITING_USER_INPUT...
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 2. BİLEŞEN: GELİŞMİŞ CİHAZ ANATOMİSİ (TELEFON & ROBOT)
// -----------------------------------------------------------------------------
function DeviceAnatomy() {
  const [activeTab, setActiveTab] = useState<'phone' | 'robot'>('phone');
  const [activePart, setActivePart] = useState<string | null>(null);

  

  // Telefon Parçaları Verisi
  const phoneParts = [
    { id: "faceid", label: "Face ID / TrueDepth", desc: "Dot Projector onarımı ile yüz okuma hatalarının giderilmesi.", x: 50, y: 10, icon: Scan },
    { id: "cpu", label: "A16 Bionic Anakart", desc: "Sandwich anakart ayırma, CPU Reballing ve hat çekimi.", x: 65, y: 35, icon: Cpu },
    { id: "battery", label: "Batarya & BMS", desc: "Pil sağlığı %100 revizyonu ve orijinal çip aktarımı.", x: 35, y: 50, icon: Battery },
    { id: "altboard", label: "Alt Board (Şarj)", desc: "Mikrofon, şarj soketi ve şebeke anten hatlarının onarımı.", x: 50, y: 85, icon: Zap },
  ];

  // Robot Parçaları Verisi
  const robotParts = [
    { id: "lidar", label: "Lidar Kulesi", desc: "Lazer mesafe sensörü motor ve optik lens kalibrasyonu.", x: 50, y: 50, icon: Scan }, 
    { id: "wheel", label: "Tekerlek Modülleri", desc: "Sıkışan veya zorlanan tekerlek motorlarının dişli değişimi.", x: 25, y: 65, icon: Move },
    { id: "fan", label: "Vakum Motoru", desc: "Emiş gücü kaybına neden olan fan motoru revizyonu.", x: 75, y: 65, icon: Fan },
    { id: "mboard", label: "Ana Kontrol Kartı", desc: "Sıvı teması sonrası oksit temizliği ve yol onarımı.", x: 50, y: 25, icon: CircuitBoard },
  ];

  const currentParts = activeTab === 'phone' ? phoneParts : robotParts;

  return (
    <section className="py-24 bg-[#050810] relative overflow-hidden z-20 border-t border-white/5">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        
        {/* SOL: Açıklama ve Tablar */}
        <div className="flex-1 space-y-8 relative z-10 w-full">
            <div>
                <span className="text-cyan-500 font-bold tracking-[0.25em] text-[10px] uppercase border border-cyan-500/20 px-2 py-1 rounded bg-cyan-950/20">Donanım Mimarisi</span>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mt-4">
                    Mikron Seviyesinde <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Hakimiyet.</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mt-4 font-light">
                    Sadece parça değiştirmiyoruz. Cihazın mühendislik şemasına iniyor, her bir komponentin sinyal yollarını analiz ediyoruz.
                </p>
            </div>

            {/* TAB SEÇİCİ */}
            <div className="flex gap-4 p-1 bg-white/5 rounded-xl w-fit border border-white/10">
                <button 
                    onClick={() => { setActiveTab('phone'); setActivePart(null); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'phone' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
                >
                    <Smartphone size={18}/> Akıllı Telefon
                </button>
                <button 
                    onClick={() => { setActiveTab('robot'); setActivePart(null); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'robot' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white'}`}
                >
                    <Gem size={18}/> Robot Süpürge
                </button>
            </div>
            
            {/* Dinamik Bilgi Kartı */}
            <div className={`p-6 rounded-2xl border border-white/10 bg-[#0a0e17] transition-all duration-500 relative overflow-hidden min-h-[140px] flex items-center ${activePart ? 'shadow-[0_0_30px_rgba(6,182,212,0.1)] border-cyan-500/30' : ''}`}>
                {activePart ? (
                    (() => {
                        const part = currentParts.find(p => p.id === activePart);
                        return (
                            <div className="flex items-start gap-5 animate-in fade-in slide-in-from-bottom-2">
                                <div className={`p-3 rounded-xl text-white border shadow-lg ${activeTab === 'phone' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-purple-500/20 border-purple-500/40 text-purple-400'}`}>
                                    {part?.icon && <part.icon size={32}/>}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">{part?.label}</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">{part?.desc}</p>
                                </div>
                            </div>
                        )
                    })()
                ) : (
                    <div className="flex items-center gap-4 text-slate-500">
                        <div className="p-3 bg-white/5 rounded-xl"><CircuitBoard size={24} className="animate-pulse"/></div>
                        <p className="text-sm">Şema üzerindeki noktalara gelerek teknik detayları inceleyin.</p>
                    </div>
                )}
            </div>
        </div>

        {/* SAĞ: İnteraktif Vektörel Görsel */}
        <div className="flex-1 relative flex justify-center w-full px-4">
            {/* Arka Plan Glow */}
            <div className={`absolute inset-0 blur-[120px] rounded-full pointer-events-none transition-colors duration-700 ${activeTab === 'phone' ? 'bg-cyan-900/20' : 'bg-purple-900/20'}`}></div>
       {/* mx-auto eklendi ve w-[320px] yerine w-full max-w-[320px] yapıldı */}
<div className="relative w-full max-w-[320px] h-[520px] bg-[#020408] rounded-[3rem] border-4 border-[#1e293b] shadow-2xl overflow-hidden select-none group transition-all duration-500 mx-auto">
                {/* LAZER TARAMA EFEKTİ */}
                <div className={`absolute top-0 left-0 w-full h-[2px] shadow-[0_0_20px] z-10 animate-scanline opacity-50 ${activeTab === 'phone' ? 'bg-cyan-400 shadow-cyan-400' : 'bg-purple-400 shadow-purple-400'}`}></div>
                
                {/* SVG Çizim (Blueprint) */}
                <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 520">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={activeTab === 'phone' ? "#22d3ee" : "#a855f7"} strokeWidth="0.5" opacity="0.2"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* PHONE SVG PATHS */}
                    {activeTab === 'phone' && (
                        <g className="animate-in fade-in duration-700">
                            {/* Dış Çerçeve */}
                            <rect x="20" y="20" width="280" height="480" rx="40" fill="none" stroke="#334155" strokeWidth="2"/>
                            {/* Ekran Çentiği */}
                            <path d="M 110 20 L 110 50 L 210 50 L 210 20" fill="none" stroke="#334155" strokeWidth="2"/>
                            {/* Batarya */}
                            <rect x="80" y="150" width="160" height="200" rx="10" fill="none" stroke={activeTab === 'phone' ? "#22d3ee" : "#a855f7"} strokeWidth="1" strokeDasharray="5,5"/>
                            <path d="M 150 220 L 170 250 L 150 280" fill="none" stroke={activeTab === 'phone' ? "#22d3ee" : "#a855f7"} strokeWidth="2"/>
                            {/* Anakart (Üst) */}
                            <path d="M 30 60 L 290 60 L 290 140 L 160 140 L 160 120 L 30 120 Z" fill="none" stroke="#475569" strokeWidth="2"/>
                            <rect x="50" y="70" width="40" height="40" fill="#1e293b"/> {/* CPU Temsili */}
                            {/* Alt Board */}
                            <path d="M 40 440 L 280 440 L 280 490 L 40 490 Z" fill="none" stroke="#475569" strokeWidth="2"/>
                            <rect x="140" y="470" width="40" height="15" fill="#1e293b"/> {/* Şarj Soketi Temsili */}
                            {/* Bağlantı Yolları */}
                            <path d="M 100 140 L 100 440" stroke="#1e293b" strokeWidth="2" strokeDasharray="2,2"/>
                            <path d="M 220 140 L 220 440" stroke="#1e293b" strokeWidth="2" strokeDasharray="2,2"/>
                        </g>
                    )}

                    {/* ROBOT SVG PATHS - Geliştirilmiş Vektör */}
                    {activeTab === 'robot' && (
                        <g className="animate-in fade-in duration-700">
                            {/* Ana Gövde Çerçevesi */}
                            <circle cx="160" cy="260" r="145" fill="none" stroke="#334155" strokeWidth="2"/>
                            <circle cx="160" cy="260" r="140" fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.3" strokeDasharray="4,4"/>

                            {/* Lidar Kulesi ve Tarama Alanı */}
                            <circle cx="160" cy="260" r="35" fill="#0f172a" stroke="#a855f7" strokeWidth="2"/>
                            <circle cx="160" cy="260" r="8" fill="#a855f7"/>
                            {/* Dönen Lidar Efekti */}
                            <path d="M 160 260 L 200 220" stroke="#a855f7" strokeWidth="1" className="animate-spin-slow origin-center"/>
                            
                            {/* Ön Tampon ve Sensörler */}
                            <path d="M 45 190 Q 160 110 275 190" fill="none" stroke="#475569" strokeWidth="3"/>
                            <circle cx="70" cy="170" r="4" fill="#a855f7" opacity="0.8"/>
                            <circle cx="250" cy="170" r="4" fill="#a855f7" opacity="0.8"/>

                            {/* İç Donanım Blokları */}
                            <rect x="110" y="160" width="100" height="60" rx="5" fill="none" stroke="#a855f7" strokeWidth="1"/> {/* Anakart */}
                            <rect x="120" y="170" width="30" height="30" fill="#1e293b" opacity="0.5"/> {/* Çip */}
                            
                            {/* Vakum Motoru Alanı */}
                            <circle cx="160" cy="350" r="30" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="3,3"/>
                            <path d="M 160 330 L 160 370 M 140 350 L 180 350" stroke="#475569" strokeWidth="1"/> {/* Fan pervanesi temsili */}

                            {/* Tekerlekler */}
                            <rect x="30" y="230" width="35" height="60" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
                            <rect x="255" y="230" width="35" height="60" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2"/>

                            {/* Ana Fırça */}
                            <rect x="90" y="310" width="140" height="35" rx="10" fill="none" stroke="#475569" strokeWidth="2"/>
                            <path d="M 100 327 L 220 327" stroke="#475569" strokeWidth="1" strokeDasharray="5,5"/>
                        </g>
                    )}
                </svg>

                {/* İNTERAKTİF NOKTALAR (HOTSPOTS) */}
                {currentParts.map((part) => (
                    <button
                        key={part.id}
                        onMouseEnter={() => setActivePart(part.id)}
                        onMouseLeave={() => setActivePart(null)}
                        className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center transition-all duration-300 z-20 group/point cursor-crosshair`}
                        style={{ left: `${part.x}%`, top: `${part.y}%` }}
                    >
                        <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${activePart === part.id ? `scale-125 opacity-100 ${activeTab === 'phone' ? 'border-cyan-400' : 'border-purple-400'}` : `scale-100 opacity-30 ${activeTab === 'phone' ? 'border-cyan-500' : 'border-purple-500'}`}`}></span>
                        <span className={`relative w-3 h-3 rounded-full transition-all duration-300 ${activePart === part.id ? `${activeTab === 'phone' ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]' : 'bg-purple-400 shadow-[0_0_15px_#a855f7]'} scale-125` : 'bg-slate-600 group-hover/point:bg-slate-400'}`}></span>
                        
                        {/* Etiket */}
                        <span className={`absolute top-full mt-2 text-[10px] font-bold bg-[#020617] px-3 py-1.5 rounded border border-white/10 opacity-0 group-hover/point:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-30 ${activeTab === 'phone' ? 'text-cyan-400' : 'text-purple-400'}`}>
                            {part.label}
                        </span>
                    </button>
                ))}

                <div className="absolute inset-4 border border-white/5 rounded-[2.5rem] pointer-events-none"></div>
            </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 3. YENİ BİLEŞEN: AURA DIAGNOSTICS (ARIZA SİHİRBAZI)
// -----------------------------------------------------------------------------
function AuraDiagnostics() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<any>({});
  const [analyzing, setAnalyzing] = useState(false);

  const devices = [
    { id: "phone", label: "Telefon", icon: Smartphone },
    { id: "robot", label: "Robot", icon: Bot }, // Bot import edilmeli veya Gem kullanılmalı
    { id: "pc", label: "Bilgisayar", icon: Laptop },
  ];

  const symptoms = [
    { id: "power", label: "Açılmıyor", icon: Power },
    { id: "liquid", label: "Sıvı Teması", icon: Droplets }, // Droplets import edilmeli
    { id: "screen", label: "Ekran / Görüntü", icon: Scan },
    { id: "battery", label: "Şarj / Batarya", icon: Battery },
  ];

  const handleSelectDevice = (id: string) => {
    setSelection({ ...selection, device: id });
    setStep(2);
  };

  const handleSelectSymptom = (id: string) => {
    setSelection({ ...selection, symptom: id });
    setAnalyzing(true);
    setTimeout(() => {
        setAnalyzing(false);
        setStep(3);
    }, 2500); // 2.5 saniye analiz simülasyonu
  };

  const reset = () => {
    setStep(1);
    setSelection({});
    setAnalyzing(false);
  };

  return (
    <section className="py-24 bg-[#050810] relative overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                
                {/* SOL: Başlık */}
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 text-cyan-400 font-bold tracking-widest text-xs uppercase border border-cyan-500/30 px-3 py-1 rounded bg-cyan-950/20">
                        <Activity size={14} className="animate-pulse"/> AI SYSTEM
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Sorun Nedir? <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Yapay Zeka Analizi.</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Servise gelmeden önce ön bilgi alın. Akıllı sistemimiz, cihazınızdaki belirtilere göre tahmini arıza kaynağını ve çözüm yolunu analiz eder.
                    </p>
                    <div className="flex gap-4 text-sm font-bold text-slate-500">
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-500"/> Ücretsiz Analiz</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-500"/> Anında Sonuç</div>
                    </div>
                </div>

                {/* SAĞ: İnteraktif Panel */}
                <div className="flex-1 w-full max-w-lg">
                    <div className="bg-[#0a0e17] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl min-h-[400px] flex flex-col">
                        {/* Dekoratif Header */}
                        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                            <span className="text-xs font-mono text-cyan-500">AURA_DIAG_V2.1</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                        </div>

                        {/* STEP 1: CİHAZ SEÇİMİ */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right duration-500">
                                <h3 className="text-white font-bold mb-6 text-lg">Cihazınızı Seçin</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {devices.map((d) => (
                                        <button key={d.id} onClick={() => handleSelectDevice(d.id)} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/50 transition-all group text-left">
                                            <div className="p-3 bg-black/40 rounded-lg text-slate-400 group-hover:text-cyan-400 transition-colors"><d.icon size={24}/></div>
                                            <span className="text-slate-200 font-bold group-hover:text-white">{d.label}</span>
                                            <ChevronRight className="ml-auto text-slate-600 group-hover:text-cyan-400"/>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: SORUN SEÇİMİ & ANALİZ */}
                        {step === 2 && !analyzing && (
                            <div className="animate-in fade-in slide-in-from-right duration-500">
                                <h3 className="text-white font-bold mb-6 text-lg">Şikayetiniz Nedir?</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {symptoms.map((s) => (
                                        <button key={s.id} onClick={() => handleSelectSymptom(s.id)} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/50 transition-all group text-center h-32 justify-center">
                                            <s.icon size={32} className="text-slate-400 group-hover:text-red-400 transition-colors"/>
                                            <span className="text-slate-200 font-bold text-sm group-hover:text-white">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={reset} className="mt-6 text-xs text-slate-500 hover:text-white underline">Geri Dön</button>
                            </div>
                        )}

                        {/* ANALİZ EKRANI (LOADING) */}
                        {analyzing && (
                            <div className="flex flex-col items-center justify-center h-full animate-in fade-in">
                                <div className="relative w-20 h-20 mb-6">
                                    <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                    <Cpu className="absolute inset-0 m-auto text-cyan-500 animate-pulse" size={30}/>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Sistem Analiz Ediliyor...</h3>
                                <div className="text-xs font-mono text-cyan-400">
                                    Checking circuits... <br/>
                                    Verifying sensor data... <br/>
                                    Calculating probability...
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SONUÇ RAPORU */}
                        {step === 3 && (
                            <div className="animate-in zoom-in duration-500 h-full flex flex-col">
                                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl mb-4 flex items-start gap-3">
                                    <CheckCircle size={24} className="text-emerald-400 shrink-0 mt-1"/>
                                    <div>
                                        <h4 className="text-emerald-400 font-bold text-sm">Ön Tespit Tamamlandı</h4>
                                        <p className="text-slate-400 text-xs mt-1">Cihazınızda <strong>Donanımsal Müdahale</strong> gerekebilir.</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Tahmini İşlem:</span>
                                        <span className="text-white font-bold">Anakart / Entegre Onarımı</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Süre:</span>
                                        <span className="text-white font-bold">1-3 İş Günü</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Başarı Oranı:</span>
                                        <span className="text-cyan-400 font-bold">%98.5</span>
                                    </div>
                                </div>

                                <Link href="/onarim-talebi" className="mt-auto w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl text-center shadow-lg hover:shadow-cyan-500/25 transition-all">
                                    Ücretsiz Detaylı Analiz Al
                                </Link>
                                <button onClick={reset} className="mt-3 text-center text-xs text-slate-500 hover:text-white">Yeni Sorgulama</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// 4. BİLEŞEN: ONARIM ÖNCESİ VE SONRASI (VEKTÖREL BEFORE/AFTER)
// -----------------------------------------------------------------------------
function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const position = ((pageX - left) / width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  return (
    <section className="py-24 bg-[#020611] relative overflow-hidden border-t border-white/5">
      {/* GÜNCELLENEN SATIR: px-6 yerine px-4 yapıldı */}
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
            {/* ... Başlık kodları buraya ... */}
        </div>

        <div 
            ref={containerRef}
            className="relative w-full max-w-4xl mx-auto h-[350px] md:h-[500px] rounded-3xl overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.1)] group select-none cursor-ew-resize bg-[#0a0e17]"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
        >
            {/* SAĞ TARAF (AFTER - CLEAN / FIXED) */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0a0e17]">
                <div className="relative w-full h-full p-10 flex items-center justify-center">
                    {/* Temiz Vektörel Çizim (SAĞLAM) */}
                    <svg viewBox="0 0 200 300" className="h-full w-auto drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-500">
                        {/* Kasa */}
                        <rect x="10" y="10" width="180" height="280" rx="20" fill="#0f172a" stroke="#22d3ee" strokeWidth="2"/>
                        {/* Ekran (Sağlam) */}
                        <rect x="20" y="20" width="160" height="260" rx="10" fill="#1e293b" stroke="none"/>
                        {/* Devre Yolları (Mavi/Düzenli) */}
                        <path d="M 50 50 L 150 50 M 50 150 L 150 150 M 50 250 L 150 250" stroke="#22d3ee" strokeWidth="1" opacity="0.3"/>
                        <path d="M 100 50 L 100 250" stroke="#22d3ee" strokeWidth="1" opacity="0.3"/>
                        <circle cx="100" cy="150" r="30" fill="none" stroke="#22d3ee" strokeWidth="1"/>
                        {/* Batarya İkonu (Dolu/Yeşil) */}
                        <g transform="translate(85, 135)">
                             <BatteryCharging size={30} className="text-emerald-400"/>
                        </g>
                        {/* Onay İkonu */}
                        <circle cx="100" cy="220" r="15" fill="#22d3ee" opacity="0.2"/>
                        <Check size={20} x="90" y="210" className="text-cyan-400" />
                        <text x="100" y="280" textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="monospace" letterSpacing="2">SYSTEM STATUS: OK</text>
                    </svg>
                </div>
                <div className="absolute top-6 right-6 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md z-10 flex items-center gap-2">
                    <CheckCircle2 size={14}/> ONARILDI
                </div>
            </div>

            {/* SOL TARAF (BEFORE - BROKEN / DAMAGED) */}
            <div 
                className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-red-500/50 bg-[#050505]" 
                style={{ width: `${sliderPosition}%` }}
            >
                <div className="absolute inset-0 w-full max-w-none flex items-center justify-center" style={{width: containerRef.current?.clientWidth || '100%'}}>
                     {/* Bozuk Vektörel Çizim (HASARLI) */}
                     <svg viewBox="0 0 200 300" className="h-[350px] md:h-[500px] w-auto transition-all duration-500">
                        {/* Kasa (Kırık Hatlı) */}
                        <rect x="10" y="10" width="180" height="280" rx="20" fill="#0f0505" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5"/>
                        {/* Ekran (Kırık) */}
                        <rect x="20" y="20" width="160" height="260" rx="10" fill="#1f0a0a" stroke="none"/>
                        {/* Kırık Ekran Çizgileri (Örümcek Ağı) */}
                        <path d="M 100 150 L 20 20 M 100 150 L 180 20 M 100 150 L 20 280 M 100 150 L 180 280 M 100 150 L 50 50 M 100 150 L 150 50" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                        {/* Devre Yolları (Kırmızı/Kopuk) */}
                        <path d="M 50 80 L 80 80 M 120 80 L 150 80 M 50 220 L 90 220" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2"/>
                         {/* Batarya İkonu (Boş/Kırmızı/Hata) */}
                        <g transform="translate(85, 135)">
                             <Battery size={30} className="text-red-500"/>
                             <X size={20} className="text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
                        </g>
                         {/* Hata Uyarısı (Daha Realistik) */}
                        <rect x="60" y="205" width="80" height="30" fill="#ef4444" opacity="0.2" rx="5"/>
                        <text x="100" y="225" textAnchor="middle" fill="#ef4444" fontSize="12" fontFamily="monospace" fontWeight="bold">ANAKART HATASI</text>
                    </svg>
                </div>
                <div className="absolute top-6 left-6 bg-red-500/20 text-red-400 border border-red-500/50 text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md z-10 flex items-center gap-2">
                    <Activity size={14}/> HASARLI CİHAZ
                </div>
            </div>

            {/* HANDLE */}
            <div 
                className="absolute inset-y-0 w-10 -ml-5 flex items-center justify-center z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    <GripVertical size={20} />
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 5. YENİ BİLEŞEN: MİKRO KOZMOS (MAKRO GALERİ - Vektörel ve Teknik)
// -----------------------------------------------------------------------------
function MacroGallery() {
    // Vektörel çizimler için SVG path'leri ve başlık/açıklamalar
    const vectorGraphics = [
        {
            id: "cpu",
            title: "GÜÇ MERKEZİ (CPU)",
            desc: "Nano-teknoloji ile işlenmiş işlemci çekirdeği ve veri yolları.",
            path: (
                <>
                    <rect x="50" y="50" width="100" height="100" rx="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <rect x="70" y="70" width="60" height="60" rx="5" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M 50 60 L 20 60 M 50 80 L 20 80 M 50 100 L 20 100 M 50 120 L 20 120 M 50 140 L 20 140" stroke="currentColor" strokeWidth="2" />
                    <path d="M 150 60 L 180 60 M 150 80 L 180 80 M 150 100 L 180 100 M 150 120 L 180 120 M 150 140 L 180 140" stroke="currentColor" strokeWidth="2" />
                    <path d="M 60 50 L 60 20 M 80 50 L 80 20 M 100 50 L 100 20 M 120 50 L 120 20 M 140 50 L 140 20" stroke="currentColor" strokeWidth="2" />
                    <path d="M 60 150 L 60 180 M 80 150 L 80 180 M 100 150 L 100 180 M 120 150 L 120 180 M 140 150 L 140 180" stroke="currentColor" strokeWidth="2" />
                    <circle cx="100" cy="100" r="15" stroke="currentColor" strokeWidth="2" fill="none" className="animate-pulse-slow" />
                </>
            )
        },
        {
            id: "circuits",
            title: "SİNYAL OTOYOLLARI",
            desc: "Veri akışını sağlayan mikroskobik, çok katmanlı devre hatları.",
            path: (
                <>
                    <path d="M 10 20 L 50 20 L 70 40 L 130 40 L 150 20 L 190 20" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M 10 60 L 30 60 L 50 80 L 150 80 L 170 60 L 190 60" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M 10 100 L 40 100 L 60 120 L 140 120 L 160 100 L 190 100" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M 10 140 L 20 140 L 40 160 L 160 160 L 180 140 L 190 140" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M 10 180 L 60 180 L 80 160 M 120 160 L 140 180 L 190 180" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="50" cy="20" r="3" fill="currentColor" className="animate-ping" />
                    <circle cx="150" cy="80" r="3" fill="currentColor" className="animate-ping delay-300" />
                    <circle cx="60" cy="120" r="3" fill="currentColor" className="animate-ping delay-700" />
                </>
            )
        },
        {
            id: "sensor",
            title: "GELİŞMİŞ SENSÖR",
            desc: "Hassas optik kalibrasyonlu Lidar ünitesi ve lens mimarisi.",
            path: (
                <>
                    <rect x="40" y="40" width="120" height="120" rx="20" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="100" cy="80" r="25" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="100" cy="80" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="100" cy="80" r="5" fill="currentColor" className="animate-pulse" />
                    <rect x="70" y="120" width="60" height="20" rx="5" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M 40 80 L 10 80 M 160 80 L 190 80" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
                    <path d="M 100 40 L 100 10 M 100 160 L 100 190" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
                </>
            )
        },
    ];

    return (
        <section className="py-24 bg-[#020611] relative border-t border-white/5 overflow-hidden">
            {/* Dekoratif Arka Plan Efekti - Izgara ve Devreler */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20"></div>
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-orange-900/10 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                {/* Başlık Alanı */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-950/30 border border-orange-500/30 text-orange-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(251,146,60,0.2)] animate-in fade-in slide-in-from-bottom-4">
                        <CircuitBoard size={18} className="animate-pulse"/>
                        Teknik Derinlik
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                        TEKNOLOJİNİN <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 filter drop-shadow-[0_0_15px_rgba(251,146,60,0.4)]">KALBİ</span>
                    </h2>
                    <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Gözle görülemeyen mühendislik harikalarını keşfedin. Cihazınızın en ince detaylarına inen, mikroskobik bir yolculuk.
                    </p>
                </div>

                {/* Vektörel Kartlar Izgarası */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {vectorGraphics.map((item, i) => (
                        <div key={i} className="group relative h-[450px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-b from-[#0a0e17] to-[#050810] hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(251,146,60,0.2)] hover:-translate-y-2">
                            
                            {/* Vektörel Çizim Alanı */}
                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <div className="relative w-full h-full flex items-center justify-center text-orange-500/40 group-hover:text-orange-400 transition-colors duration-500">
                                    {/* Arka Plan Parlaması */}
                                    <div className="absolute inset-0 bg-orange-500/5 rounded-full blur-[80px] group-hover:bg-orange-500/15 transition-all duration-700"></div>
                                    
                                    {/* SVG Çizim */}
                                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_10px_currentColor] group-hover:drop-shadow-[0_0_25px_currentColor] transition-all duration-500 transform group-hover:scale-110">
                                        {item.path}
                                    </svg>
                                </div>
                            </div>

                            {/* Bilgi Kartı */}
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-3 mb-3">
                                    <Microscope size={20} className="text-orange-400" />
                                    <h3 className="text-white font-bold text-2xl tracking-wide uppercase group-hover:text-orange-300 transition-colors">{item.title}</h3>
                                </div>
                                <p className="text-slate-300 text-base font-light leading-relaxed border-l-2 border-orange-500/30 pl-4 group-hover:border-orange-500 transition-all">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// -----------------------------------------------------------------------------
// 6. BİLEŞEN: SIKÇA SORULAN SORULAR (FAQ)
// -----------------------------------------------------------------------------
function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const faqs = [
        { q: "Onarım süreci ne kadar sürer?", a: "Arıza tespitine göre değişmekle birlikte, ekran ve batarya değişimleri aynı gün, anakart onarımları ortalama 1-3 iş günü sürer." },
        { q: "Yapılan işlemler garantili mi?", a: "Evet, servisimizde yapılan tüm donanım onarımları ve parça değişimleri 6 ay boyunca AURA BİLİŞİM garantisi altındadır." },
        { q: "Verilerim silinir mi?", a: "Donanım onarımlarının %95'inde veri kaybı yaşanmaz. Ancak yazılım yüklemesi veya anakartın ağır hasarlı olduğu durumlarda risk olabilir. Öncesinde yedek almanızı öneririz." },
        { q: "Kargo ile cihaz gönderebilir miyim?", a: "Tüm Türkiye'den anlaşmalı kargo kodumuz ile ücretsiz cihaz gönderebilirsiniz. Cihazınız sigortalı olarak teslim alınır." },
    ];

    return (
        <section className="py-24 bg-[#020611] relative overflow-hidden border-t border-white/5 mb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-white mb-4">Merak Edilenler</h2>
                    <p className="text-slate-400">Teknik süreçler hakkında sıkça sorulan sorular.</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className={`border border-white/10 rounded-2xl overflow-hidden bg-[#0a0e17] transition-all ${openIndex === i ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'hover:border-white/20'}`}>
                            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                                <span className={`font-bold transition-colors ${openIndex === i ? 'text-cyan-400' : 'text-white'}`}>{faq.q}</span>
                                {openIndex === i ? <Minus size={20} className="text-cyan-500"/> : <Plus size={20} className="text-slate-500"/>}
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// -----------------------------------------------------------------------------
// 7. YENİ BİLEŞEN: AURA TERMINAL (İLETİŞİM FORMU)
// -----------------------------------------------------------------------------
function AuraTerminal() {
  const [activeLine, setActiveLine] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", issue: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInput = (e: any, field: string) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleEnter = (e: any) => {
    if (e.key === 'Enter') {
      if (activeLine < 2) {
        setActiveLine(activeLine + 1);
      } else {
        setIsSubmitted(true);
      }
    }
  };

  return (
    <section className="py-24 bg-[#0b0e14] relative overflow-hidden border-t border-white/5 font-mono">
      <div className="container mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
        
        {/* SOL: Açıklama */}
        <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-black text-white leading-tight">
                Sisteme <span className="text-emerald-500">Bağlanın.</span>
            </h2>
            <p className="text-slate-400 text-lg">
                Klasik formlarla zaman kaybetmeyin. Arızanızı doğrudan ana sisteme iletin, teknisyenlerimiz size dönüş yapsın.
            </p>
            <div className="flex flex-col gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-2"><Terminal size={16} className="text-emerald-500"/> Direct Link: Secure</div>
                <div className="flex items-center gap-2"><Wifi size={16} className="text-emerald-500"/> Latency: 12ms</div>
            </div>
        </div>

        {/* SAĞ: Terminal */}
        <div className="flex-1 w-full max-w-lg">
            <div className="bg-[#020408] rounded-xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden font-mono text-sm relative">
                {/* Terminal Header */}
                <div className="bg-[#0f172a] px-4 py-2 flex items-center justify-between border-b border-white/10">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-slate-500 text-xs">user@aura-bilisim:~</div>
                </div>

                {/* Terminal Body */}
                <div className="p-6 min-h-[300px] flex flex-col gap-4">
                    
                    {/* Satır 1: Başlangıç */}
                    <div className="text-emerald-500">
                        <span className="mr-2">➜</span> 
                        <span className="text-white">initiate_repair_protocol.exe</span>
                    </div>
                    <div className="text-slate-400 text-xs mb-4">
                        [SYSTEM] Protocol loaded.<br/>
                        [SYSTEM] Connection established.
                    </div>

                    {/* Form Adımları */}
                    {!isSubmitted ? (
                        <>
                            {/* Adım 1: İsim */}
                            <div className={`transition-opacity duration-500 ${activeLine >= 0 ? 'opacity-100' : 'opacity-50'}`}>
                                <div className="text-emerald-400 mb-1">? Adınız Soyadınız:</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500">{">"}</span>
                                    <input 
                                        type="text" 
                                        className="bg-transparent outline-none text-white w-full caret-emerald-500"
                                        placeholder="Adınızı yazıp ENTER'a basın..."
                                        disabled={activeLine !== 0}
                                        onKeyDown={handleEnter}
                                        onChange={(e) => handleInput(e, 'name')}
                                        autoFocus={activeLine === 0}
                                    />
                                </div>
                            </div>

                            {/* Adım 2: Telefon */}
                            {activeLine >= 1 && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="text-emerald-400 mb-1 mt-4">? İletişim Numarası:</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">{">"}</span>
                                        <input 
                                            type="tel" 
                                            className="bg-transparent outline-none text-white w-full caret-emerald-500"
                                            placeholder="05XX..."
                                            disabled={activeLine !== 1}
                                            onKeyDown={handleEnter}
                                            onChange={(e) => handleInput(e, 'phone')}
                                            autoFocus={activeLine === 1}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Adım 3: Sorun */}
                            {activeLine >= 2 && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="text-emerald-400 mb-1 mt-4">? Cihazdaki Sorun Nedir:</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">{">"}</span>
                                        <input 
                                            type="text" 
                                            className="bg-transparent outline-none text-white w-full caret-emerald-500"
                                            placeholder="Sorunu kısaca yazıp ENTER'a basın..."
                                            onKeyDown={handleEnter}
                                            onChange={(e) => handleInput(e, 'issue')}
                                            autoFocus={activeLine === 2}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="animate-in zoom-in duration-500 text-center py-10">
                            <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4 animate-bounce"/>
                            <h3 className="text-white text-xl font-bold">Kayıt Alındı!</h3>
                            <p className="text-slate-400 text-sm mt-2">
                                Veriler şifrelendi ve teknisyen terminaline iletildi.<br/>
                                <span className="text-emerald-400">Kısa süre içinde aranacaksınız.</span>
                            </p>
                            <button onClick={() => {setIsSubmitted(false); setActiveLine(0); setFormData({name:"",phone:"",issue:""})}} className="mt-6 text-xs text-slate-500 hover:text-white underline">
                                Yeni Kayıt Başlat
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 8. YENİ BİLEŞEN: GLITCH TEXT (BAŞLIK EFEKTİ)
// -----------------------------------------------------------------------------
function GlitchText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

  const handleMouseOver = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        prev.split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("")
      );
      
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <span onMouseOver={handleMouseOver} className="inline-block cursor-default">
      {displayText}
    </span>
  );
}

// -----------------------------------------------------------------------------
// 9. YENİ BİLEŞEN: THERMAL VISION (VEKTÖREL ISI HARİTASI SİMÜLASYONU)
// -----------------------------------------------------------------------------
function ThermalVision() {
  const [active, setActive] = useState(false);

  return (
    <section className="py-24 bg-[#020408] relative overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            
            {/* SOL: Metin Alanı */}
            <div className="flex-1 space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-bold tracking-widest uppercase mb-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <Thermometer size={14} className="animate-pulse"/>
                    Termal Analiz
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                    Gözle Görülmeyeni <br/>
                    <span className={`transition-colors duration-500 ${active ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600' : 'text-slate-500'}`}>
                        Ortaya Çıkarıyoruz.
                    </span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Aşırı ısınma, performansın gizli katilidir. Endüstriyel termal kameralarımızla anakart üzerindeki ısı kaçaklarını tespit ediyor, sıvı metal uygulamalarıyla cihazınızı "buz gibi" yapıyoruz.
                </p>
                
                <button 
                    onMouseEnter={() => setActive(true)}
                    onMouseLeave={() => setActive(false)}
                    className={`group flex items-center gap-4 px-8 py-4 rounded-xl border transition-all duration-300 ${active ? 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                >
                    <Scan size={24} />
                    <span className="font-bold tracking-wider">{active ? 'TERMAL MOD AKTİF' : 'TERMAL KAMERAYI AÇ'}</span>
                </button>
            </div>

            {/* SAĞ: Vektörel Termal Simülasyon */}
            <div className="flex-1 w-full max-w-xl relative group">
                <div className={`relative rounded-3xl overflow-hidden aspect-video border-2 transition-all duration-500 shadow-2xl bg-[#050810] ${active ? 'border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
                    
                    {/* KATMAN 1: SVG Base */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg viewBox="0 0 400 250" className={`w-full h-full transition-opacity duration-700 ${active ? 'opacity-30' : 'opacity-50'}`}>
                            <defs>
                                <pattern id="grid-pattern-thermal" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid-pattern-thermal)" />
                            
                            {/* Anakart Dış Hatları */}
                            <path d="M 40 40 H 360 V 210 H 40 Z" fill="none" stroke="#334155" strokeWidth="2"/>
                            
                            {/* CPU Soket Alanı */}
                            <g transform="translate(160, 90)">
                                <rect width="80" height="80" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="2"/>
                                <rect x="15" y="15" width="50" height="50" rx="2" fill="none" stroke="#334155" strokeWidth="1"/>
                                <circle cx="40" cy="40" r="5" fill="#1e293b" stroke="#334155"/>
                            </g>

                            {/* RAM Slotları */}
                            <g transform="translate(260, 90)">
                                <rect width="10" height="80" fill="none" stroke="#334155" strokeWidth="2"/>
                                <rect x="18" width="10" height="80" fill="none" stroke="#334155" strokeWidth="2"/>
                            </g>

                            {/* Güç Bileşenleri */}
                            <g transform="translate(100, 90)">
                                <rect width="40" height="35" fill="none" stroke="#334155" strokeWidth="1"/>
                                <rect y="45" width="40" height="35" fill="none" stroke="#334155" strokeWidth="1"/>
                                <circle cx="20" cy="17.5" r="8" fill="none" stroke="#334155" strokeWidth="1"/>
                                <circle cx="20" cy="62.5" r="8" fill="none" stroke="#334155" strokeWidth="1"/>
                            </g>

                            {/* Devre Yolları */}
                            <path d="M 160 130 H 140 M 160 110 H 140 M 240 130 H 260 M 200 90 V 60 M 200 170 V 200 M 120 90 V 60 M 120 170 V 200" stroke="#334155" strokeWidth="1" strokeDasharray="2,2"/>
                        </svg>
                    </div>

                    {/* KATMAN 2: Termal Canlı Isı Haritası */}
                    <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${active ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Ana Isı Kaynağı */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
                            <div className="absolute inset-0 bg-red-600 rounded-full blur-[50px] opacity-60 animate-pulse-slow"></div>
                            <div className="absolute inset-8 bg-orange-500 rounded-full blur-[35px] opacity-80 animate-pulse"></div>
                            <div className="absolute inset-12 bg-yellow-400 rounded-full blur-[25px] opacity-90"></div>
                        </div>

                        {/* İkincil Isı Kaynakları */}
                        <div className="absolute top-[45%] left-[28%] w-20 h-20 bg-purple-600 rounded-full blur-[35px] opacity-50 animate-pulse-slow" style={{animationDelay: '0.5s'}}></div>
                        <div className="absolute bottom-[30%] right-[30%] w-16 h-16 bg-blue-600 rounded-full blur-[30px] opacity-40 animate-pulse-slow" style={{animationDelay: '1s'}}></div>

                        {/* Vektörel İzobarlar */}
                        <svg viewBox="0 0 400 250" className="absolute inset-0 w-full h-full">
                            <g transform="translate(200, 130)">
                                <circle r="80" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.3" className="animate-pulse"/>
                                <circle r="55" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.6" className="animate-pulse-slow"/>
                                <circle r="30" fill="none" stroke="#eab308" strokeWidth="2" opacity="0.8" className="animate-pulse" style={{animationDuration: '1.5s'}}/>
                            </g>
                        </svg>
                    </div>

                    {/* KATMAN 3: HUD Arayüzü */}
                    <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-6 transition-all duration-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-red-400 bg-black/60 px-2 py-1 rounded border border-red-500/30 backdrop-blur-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> REC [LIVE] - 00:14:22
                                </span>
                                <span className="text-[8px] font-mono text-white/40 pl-1">SENSOR_ARRAY_MAIN // IR_OPTIC</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-4xl font-black text-white font-mono drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-tighter">94.2°C</span>
                                <span className="text-[9px] text-red-500 font-bold uppercase animate-pulse border border-red-500/50 px-1 rounded bg-red-950/50 mt-1">Thermal Throttling Active</span>
                            </div>
                        </div>
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center opacity-60">
                            <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-red-500/50 to-transparent"></div>
                            <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
                            <div className="w-6 h-6 border border-red-500 rounded-full flex items-center justify-center">
                                <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="space-y-1 w-1/3">
                                <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-purple-500 via-red-500 to-yellow-400 rounded-full border border-white/10 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 h-full w-1 bg-white animate-pulse"></div>
                                </div>
                                <div className="flex justify-between text-[8px] font-mono text-white/50">
                                    <span>25°C</span>
                                    <span className="text-red-400 font-bold">105°C</span>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="text-[8px] font-mono text-white/40">EMISSIVITY: 0.95</div>
                                <span className="text-[10px] font-mono text-white/50 border border-white/10 px-2 py-1 rounded inline-block bg-black/40">ISO 12800</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// 10. YENİ BİLEŞEN: SYSTEM HUD FOOTER (CYBERPUNK FOOTER)
// -----------------------------------------------------------------------------
function SystemFooter() {
    return (
        <footer className="bg-[#010205] border-t border-white/5 pt-16 pb-8 relative overflow-hidden font-mono text-sm z-20">
            {/* Arka Plan Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    
                    {/* KOLON 1: Marka & Durum */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-cyan-900/20 rounded flex items-center justify-center border border-cyan-500/30 text-cyan-400">
                                <Terminal size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white tracking-widest">AURA_OS</h3>
                                <span className="text-[10px] text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> SYSTEM ONLINE</span>
                            </div>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">
                            Aura Bilişim Hizmetleri A.Ş.<br/>
                            Teknoloji ve Ar-Ge Laboratuvarı<br/>
                            İstanbul, Türkiye
                        </p>
                    </div>

                    {/* KOLON 2: Hızlı Erişim */}
                    <div>
                        <h4 className="text-cyan-500 font-bold mb-6 text-xs uppercase tracking-widest border-b border-white/5 pb-2 w-fit">Navigasyon</h4>
                        <ul className="space-y-3 text-slate-400 text-xs">
                            {['Ana Sayfa', 'Cihaz Sorgula', 'Kurumsal', 'Hizmetler', 'İletişim'].map((item, i) => (
                                <li key={i}><Link href="#" className="hover:text-cyan-400 hover:pl-2 transition-all flex items-center gap-2 before:content-['>'] before:opacity-0 hover:before:opacity-100"> {item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* KOLON 3: Yasal & Politikalar */}
                    <div>
                        <h4 className="text-cyan-500 font-bold mb-6 text-xs uppercase tracking-widest border-b border-white/5 pb-2 w-fit">Protokoller</h4>
                        <ul className="space-y-3 text-slate-400 text-xs">
                            {['KVKK Metni', 'Garanti Şartları', 'Çerez Politikası', 'Teslimat Koşulları'].map((item, i) => (
                                <li key={i}><Link href="#" className="hover:text-white transition-colors flex items-center gap-2"><FileText size={12}/> {item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* KOLON 4: Canlı Sistem Verileri */}
                    <div className="bg-[#050810] border border-white/10 rounded-xl p-4 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500 text-[10px]">SERVER LOAD</span>
                            <span className="text-emerald-400 text-xs font-bold">%12.4</span>
                        </div>
                         <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500 text-[10px]">LAB TEMP</span>
                            <span className="text-yellow-400 text-xs font-bold flex items-center gap-1"><Thermometer size={10}/> 22°C</span>
                        </div>
                         <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-slate-500 text-[10px]">NETWORK</span>
                            <span className="text-cyan-400 text-xs font-bold flex items-center gap-1"><Globe size={10}/> SECURE</span>
                        </div>
                        <div className="pt-2">
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 w-[85%] animate-pulse"></div>
                            </div>
                            <span className="text-[9px] text-slate-600 mt-1 block text-right">UPTIME: 99.9%</span>
                        </div>
                    </div>

                </div>

                {/* Alt Telif */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600">
                    <div>
                        &copy; 2025 AURA BİLİŞİM. ALL RIGHTS RESERVED. <span className="text-slate-700">|</span> DESIGNED BY SYSTEM_CORE
                    </div>
                    <div className="flex gap-4">
                       <ShieldAlert size={14} className="text-slate-700 hover:text-white cursor-pointer transition-colors"/>
                       <Wifi size={14} className="text-slate-700 hover:text-white cursor-pointer transition-colors"/>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// -----------------------------------------------------------------------------
// ANA BİLEŞEN: HOME
// -----------------------------------------------------------------------------
export default function Home() {
  const router = useRouter();
  const [takipNo, setTakipNo] = useState("");
  const [vitrinUrunleri, setVitrinUrunleri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAcik, setMenuAcik] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const brandsSource = ["APPLE", "SAMSUNG", "XIAOMI", "ROBOROCK", "DYSON", "HUAWEI", "OPPO", "MONSTER", "ASUS", "LENOVO"];
  const brands = [...brandsSource, ...brandsSource, ...brandsSource, ...brandsSource];

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        if (!supabase) return; 
        let { data } = await supabase.from('urunler').select('*').or('stok_durumu.eq.Satışta,stok_durumu.eq.true').order('created_at', { ascending: false }).limit(4);
        if (data) {
           const mapped = data.map((item: any) => ({
             id: item.id,
             name: item.ad,
             price: item.fiyat,
             image: (item.images && item.images.length > 0) ? item.images[0] : item.resim_url,
             category: item.kategori,
             tag: "Fırsat" 
           }));
           setVitrinUrunleri(mapped);
        }
      } catch (e) { console.error("Veri hatası:", e); } finally { setLoading(false); }
    };
    fetchShowcase();
  }, []);

  const sorgula = (e: React.FormEvent) => {
    e.preventDefault();
    if (takipNo.trim().length > 0) {
        const code = takipNo.trim().toUpperCase().replace(/\s/g, '');
        router.push(`/cihaz-sorgula?takip=${code}`);
    }
  };

  const getRandomGradient = (index: number) => {
    const gradients = ["bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-800", "bg-gradient-to-br from-fuchsia-600 via-pink-600 to-rose-800", "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-800", "bg-gradient-to-br from-orange-500 via-amber-600 to-red-800", "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-900"];
    return gradients[index % gradients.length];
  };

 return (
    <div className="relative bg-[#020617] text-white font-sans selection:bg-cyan-500/30 min-h-screen w-full overflow-x-hidden">
      {/* NAVBAR - TAMAMI GÜNCELLENMİŞ VERSİYON */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? "bg-[#020617]/95 backdrop-blur-xl border-white/5 h-20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-[#020617] border-transparent h-24"} print:hidden`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3.5 group select-none shrink-0" onClick={() => setMenuAcik(false)}>
            <div className="relative w-11 h-11 flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" stopColor="#ffffff" stopOpacity="1" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0" /></radialGradient>
                  </defs>
                  <path d="M 50 12 L 22 40 L 22 52 L 12 52 L 12 35 L 45 2 Z" fill="#fff" className="opacity-95 group-hover:fill-cyan-50 transition-colors"/>
                  <path d="M 50 88 L 78 60 L 78 48 L 88 48 L 88 65 L 55 98 Z" fill="#fff" className="opacity-95 group-hover:fill-cyan-50 transition-colors"/>
                  <rect x="36" y="36" width="28" height="28" rx="3" transform="rotate(45 50 50)" fill="url(#coreGradient)" className="group-hover:scale-105 transition-transform duration-300 origin-center outline outline-1 outline-white/20"/>
                  <circle cx="50" cy="50" r="5" fill="url(#centerGlow)" className="animate-pulse-slow" />
                  <rect x="24" y="42" width="8" height="1.5" fill="url(#coreGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                  <rect x="24" y="46" width="5" height="1.5" fill="url(#coreGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                  <rect x="68" y="56.5" width="8" height="1.5" fill="url(#coreGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                  <rect x="71" y="52.5" width="5" height="1.5" fill="url(#coreGradient)" className="group-hover:opacity-100 opacity-80 transition-opacity"/>
                </svg>
            </div>
            <div className="flex flex-col justify-center">
                <div className="font-extrabold text-[22px] tracking-tight leading-none text-white flex items-center gap-1 group-hover:text-cyan-50 transition-colors">AURA<span className="text-cyan-400">BİLİŞİM</span></div>
                <span className="text-[9px] text-slate-400 font-bold tracking-[0.25em] uppercase group-hover:text-cyan-400/80 transition-colors">TEKNOLOJİ ÜSSÜ</span>
            </div>
          </Link>

          {/* DESKTOP MENÜ LİNKLERİ (Sadece PC'de görünür) */}
          <div className="hidden xl:flex items-center gap-8">
              {[ { href: "/", label: "Ana Sayfa" }, { href: "/destek", label: "Destek" }, { href: "/hakkimizda", label: "Hakkımızda" }, { href: "/sss", label: "S.S.S" }, { href: "/iletisim", label: "İletişim" } ].map((link) => (
                <Link key={link.href} href={link.href} className={`text-[14px] font-bold transition-all relative py-2 px-1 group ${isActive(link.href) ? "text-cyan-400" : "text-slate-300 hover:text-white"}`}>
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                </Link>
              ))}
          </div>

          {/* SAĞ TARAF BUTONLARI (Desktop) */}
          <div className="flex items-center gap-3 shrink-0">
              {/* Kurumsal Butonu (Desktop) */}
              <Link href="/kurumsal-cozumler" className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 hover:from-white hover:to-amber-200 text-black px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:-translate-y-0.5 border border-yellow-300/50 group">
                  <Building2 size={16} className="text-black/80 fill-black/10"/> 
                  <span className="tracking-wide">KURUMSAL</span>
              </Link>

              <Link href="/cihaz-sorgula" className="hidden lg:flex items-center gap-2 border border-slate-700/50 bg-[#0f172a] hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs transition-all group">
                  <Search size={16} className="text-cyan-400 group-hover:text-cyan-300 transition-colors"/> <span>CİHAZ SORGULA</span>
              </Link>
              
              <Link href="/magaza" className="hidden lg:flex items-center gap-2 border border-slate-700/50 bg-[#0f172a] hover:bg-slate-800 text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs transition-all group">
                  <ShoppingBag size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors"/> <span>MAĞAZA</span>
              </Link>
              
              <Link href="/onarim-talebi" className="hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-cyan-900/20 hover:-translate-y-0.5 active:scale-95 border border-white/10">
                  <Wrench size={16} className="text-white fill-white/20"/> 
                  <span>ONARIM BAŞLAT</span>
              </Link>
              
              {/* HAMBURGER BUTONU (Sadece Mobilde Görünür) */}
              <button onClick={() => setMenuAcik(!menuAcik)} className="xl:hidden p-2 text-slate-300 hover:text-white transition-colors">
                  {menuAcik ? <X size={28}/> : <Menu size={28}/>}
              </button>
          </div>
        </div>
        
        {/* MOBİL MENÜ (AÇILIR KISIM - TÜM BUTONLAR EKLENDİ) */}
        {menuAcik && (
          <div className="xl:hidden fixed top-20 left-0 w-full bg-[#0b0e14]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2 z-50 overflow-y-auto max-h-[calc(100vh-80px)]">
              
              {/* Navigasyon Linkleri */}
              <div className="grid grid-cols-2 gap-2">
                 {[ 
                     { href: "/", label: "Ana Sayfa", icon: HomeIcon }, 
                     { href: "/destek", label: "Destek", icon: LifeBuoy },
                     { href: "/hakkimizda", label: "Hakkımızda", icon: Info },
                     { href: "/iletisim", label: "İletişim", icon: Phone }
                 ].map((item) => (
                   <Link key={item.href} href={item.href} onClick={() => setMenuAcik(false)} className="py-3 px-4 rounded-lg font-bold flex items-center gap-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-sm">
                       <item.icon size={18} className="text-cyan-500"/> {item.label}
                   </Link>
                 ))}
              </div>

              <div className="h-px w-full bg-white/10 my-1"></div>

              {/* Aksiyon Butonları (Mobilde Eksik Olanlar Buraya Eklendi) */}
              <div className="space-y-3">
                  <Link href="/kurumsal-cozumler" onClick={() => setMenuAcik(false)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-black px-4 py-3 rounded-xl font-black text-sm shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                      <Building2 size={18} className="text-black/80"/> KURUMSAL ÇÖZÜMLER
                  </Link>

                  <div className="grid grid-cols-2 gap-3">
                      <Link href="/cihaz-sorgula" onClick={() => setMenuAcik(false)} className="flex items-center justify-center gap-2 border border-slate-700 bg-[#0f172a] text-white px-3 py-3 rounded-xl font-bold text-xs">
                          <Search size={16} className="text-cyan-400"/> CİHAZ SORGULA
                      </Link>
                      
                      <Link href="/magaza" onClick={() => setMenuAcik(false)} className="flex items-center justify-center gap-2 border border-slate-700 bg-[#0f172a] text-white px-3 py-3 rounded-xl font-bold text-xs">
                          <ShoppingBag size={16} className="text-purple-400"/> MAĞAZA
                      </Link>
                  </div>

                  <Link href="/onarim-talebi" onClick={() => setMenuAcik(false)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg shadow-cyan-900/20">
                      <Wrench size={18}/> ONARIM BAŞLAT
                  </Link>
              </div>
          </div>
        )}
      </nav>
      {/* ARKA PLAN DEKORASYON */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[800px] h-[500px] md:h-[600px] bg-cyan-600/15 rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-0 animate-pulse-slow"></div>
      {/* HERO SECTION */}
      <section className="relative pt-44 pb-20 z-10 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#0f172a]/80 border border-cyan-500/50 px-4 py-2 rounded-full text-cyan-300 mb-8 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span></span>
            <span className="font-bold tracking-widest uppercase text-[10px] md:text-xs">High-End Teknik Servis</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight drop-shadow-2xl">
            <GlitchText text="Teknolojiniz" /> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-500 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">Sınırların Ötesinde.</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Sıradan bir işlem değil, <strong className="text-white">hassas kalibrasyon ve optimizasyon.</strong> <br className="hidden md:block"/>
            Roborock, iPhone ve Gaming PC donanımlarında <span className="text-cyan-400 font-bold">%99 başarı oranı</span>.
          </p>
          <div className="max-w-xl mx-auto relative group mb-20">
             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition duration-500 group-hover:duration-200 animate-tilt"></div>
             <form onSubmit={sorgula} className="relative bg-[#0a0e17] p-2 rounded-2xl flex items-center shadow-2xl border border-white/10 backdrop-blur-xl">
                <div className="pl-4 text-cyan-500"><Search size={22}/></div>
                <input type="text" placeholder="Cihaz Takip No (Örn: 83785)" className="w-full h-14 bg-transparent px-4 outline-none text-white placeholder:text-slate-500 font-medium text-lg" value={takipNo} onChange={(e) => setTakipNo(e.target.value)} />
                <button type="submit" className="h-14 px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] uppercase tracking-wide">Sorgula</button>
             </form>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
             {[{ val: "%100", label: "Müşteri Memnuniyeti", icon: Users, color: "text-cyan-400", shadow: "shadow-cyan-500/20", border: "border-cyan-500/30" }, { val: "Onaylı", label: "Orijinal Parça", icon: Tag, color: "text-purple-400", shadow: "shadow-purple-500/20", border: "border-purple-500/30" }, { val: "6 Ay", label: "Garanti Süresi", icon: ShieldCheck, color: "text-green-400", shadow: "shadow-green-500/20", border: "border-green-500/30" }, { val: "15K+", label: "Başarılı İşlem", icon: CheckCircle2, color: "text-yellow-400", shadow: "shadow-yellow-500/20", border: "border-yellow-500/30" }].map((stat, i) => (
               <div key={i} className={`bg-[#0a0e17]/60 backdrop-blur-md border ${stat.border} p-8 rounded-3xl hover:bg-[#111620] transition-all group cursor-default hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-105 ${stat.shadow.replace('/20','/40')}`}>
                  <div className={`text-4xl font-black text-white mb-2 group-hover:${stat.color.replace('text-', '')} transition-colors drop-shadow-lg`}>{stat.val}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-2"><stat.icon size={16} className={stat.color} /> {stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      

      {/* MARKALAR (Infinite Scroll) */}
      <section className="relative py-24 bg-[#010205] border-b border-white/5 overflow-hidden">
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[300px] bg-indigo-900/20 blur-[100px] rounded-full pointer-events-none"></div>        <div className="container mx-auto px-6 relative z-10 text-center mb-12">
            <span className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-2 block">Global Partners</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Hizmet Verilen <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Teknoloji Devleri</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">Dünyanın önde gelen teknoloji markalarının tüm modellerine laboratuvar standartlarında müdahale ediyoruz.</p>
            <Link href="/markalar" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all hover:scale-105 group">Tüm Marka Listesini İncele <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></Link>
        </div>
        <div className="relative w-full overflow-hidden group space-y-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#010205] to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#010205] to-transparent z-10"></div>
            <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
                {brands.map((brand, index) => (<div key={index} className="mx-8 text-4xl font-black text-slate-800 hover:text-cyan-500 transition-colors duration-300 cursor-default uppercase select-none whitespace-nowrap">{brand}</div>))}
            </div>
             <div className="flex w-max animate-infinite-scroll-reverse hover:[animation-play-state:paused]">
                {brands.reverse().map((brand, index) => (<div key={index} className="mx-8 text-4xl font-black text-slate-800 hover:text-indigo-500 transition-colors duration-300 cursor-default uppercase select-none whitespace-nowrap">{brand}</div>))}
            </div>
        </div>
      </section>

      {/* GÜVEN BANDI (Footer Öncesi Son Dokunuş) */}
      <div className="w-full bg-gradient-to-r from-[#020617] via-[#0a0e17] to-[#020617] border-t border-white/5 py-6 relative z-20 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-wrap items-center justify-center md:justify-between gap-6 text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2"><Award className="w-5 h-5 text-cyan-500" /> <span>İstanbul'un <strong>En Prestijli</strong> Teknik Üssü</span></div>
            <div className="flex items-center gap-2"><Trophy size={18} className="text-yellow-500" /> <span>Global Servis Standartları</span></div>
            <div className="flex items-center gap-2"><HeartPulse size={18} className="text-red-500" /> <span><strong>10.000+</strong> Kusursuz Teslimat</span></div>
        </div>
      </div>


      {/* HİZMETLER */}
      <section className="py-28 relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div><h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">Uzmanlık Alanlarımız</h2><p className="text-slate-400 text-lg max-w-2xl font-light">Laboratuvarımızda uygulanan profesyonel müdahale süreçleri.</p></div>
            <Link href="/hizmetler" className="hidden md:flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20 relative z-30">Tüm Hizmetleri Gör <ArrowRight size={18}/></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                {id: "telefon", title: "Mobil Kalibrasyon", desc: "iPhone FaceID optimizasyonu, anakart mikron seviyesi onarım.", icon: Smartphone, color: "cyan"},
                {id: "robot", title: "Otonom Sistemler", desc: "Roborock Lidar sensör kalibrasyonu, motor tork analizi.", icon: Zap, color: "purple"},
                {id: "bilgisayar", title: "Performans PC", desc: "Gaming laptop termal optimizasyon, BGA chipset onarımı.", icon: Laptop, color: "emerald"}
            ].map((srv, i) => (
                <Link key={i} href={`/hizmetler/${srv.id}`} className="group relative block h-full">
                    <div className={`absolute -inset-0.5 bg-gradient-to-b from-${srv.color}-500 to-${srv.color}-600 rounded-[2rem] blur-md opacity-0 group-hover:opacity-100 transition duration-500 group-hover:blur-[1px]`}></div>
                    <div className="relative bg-[#0b0e14] p-[1px] rounded-[2rem] h-full">
                        <div className="bg-gradient-to-b from-[#0f131a] to-[#0b0e14] rounded-[2rem] p-10 h-full flex flex-col items-start group-hover:bg-[#111620] transition-colors relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-${srv.color}-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-${srv.color}-500/20 transition-all`}></div>
                            <div className={`w-16 h-16 bg-${srv.color}-950/50 rounded-2xl flex items-center justify-center mb-8 text-${srv.color}-400 group-hover:scale-110 transition-transform duration-300 border border-${srv.color}-500/30 shadow-[0_0_20px_rgba(${srv.color === 'cyan' ? '6,182,212' : srv.color === 'purple' ? '168,85,247' : '16,185,129'},0.15)] relative z-10`}>
                                <srv.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{srv.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">{srv.desc}</p>
                            <div className={`mt-auto w-full py-4 rounded-xl bg-slate-900/50 border border-${srv.color}-900/50 text-center text-sm font-bold text-${srv.color}-400 uppercase tracking-wider group-hover:bg-${srv.color}-600 group-hover:text-white group-hover:border-${srv.color}-500 transition-all shadow-[0_0_20px_rgba(0,0,0,0)] group-hover:shadow-[0_0_20px_rgba(${srv.color === 'cyan' ? '6,182,212' : srv.color === 'purple' ? '168,85,247' : '16,185,129'},0.4)] relative z-10`}>İNCELE</div>
                        </div>
                    </div>
                </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- DEVICE ANATOMY --- */}
      <DeviceAnatomy />

      {/* --- AURA DIAGNOSTICS (YENİ) --- */}
      <AuraDiagnostics />


      {/* --- MACRO GALLERY (YENİ VEKTÖREL) --- */}
      <MacroGallery />

      {/* --- THERMAL VISION --- */}
      <ThermalVision />

      {/* X-RAY DIAGNOSTICS (YENİ) */}
      <XrayDiagnostics />

      {/* --- AURA STORE VİTRİNİ --- */}
      <section className="py-28 relative overflow-hidden bg-[#050810]">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2"><ShoppingBag size={20} className="text-pink-400"/> <span className="text-pink-400 font-bold tracking-widest text-xs uppercase drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">Aura Store</span></div>
                    <h2 className="text-4xl font-black text-white drop-shadow-lg">Mağaza Vitrini</h2>
                </div>
                <Link href="/magaza" className="px-6 py-3 bg-[#1e1b4b]/50 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all flex items-center gap-2 backdrop-blur-md hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">Tüm Ürünleri Gör <ChevronRight size={16}/></Link>
            </div>
            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vitrinUrunleri.length > 0 ? vitrinUrunleri.map((product, i) => {
                        const displayPrice = product.price ? Number(product.price).toLocaleString('tr-TR') + ' ₺' : "Fiyat Sorunuz";
                        const fallbackGradient = getRandomGradient(i);
                        return (
                          <Link href={`/magaza/${product.id}`} key={i} className="group relative rounded-2xl block h-full cursor-pointer hover:-translate-y-2 transition-transform duration-500">
                              <div className={`absolute -inset-[1px] bg-gradient-to-b from-indigo-500 to-purple-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500 group-hover:blur-md`}></div>
                              <div className="relative bg-[#11151d] rounded-2xl overflow-hidden h-full flex flex-col border border-white/5 group-hover:border-white/10 transition-colors">
                                  <div className={`h-56 w-full relative flex items-center justify-center border-b border-white/5 overflow-hidden bg-[#161b25]`}>
                                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg z-20">Fırsat</span>
                                      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${fallbackGradient} group-hover:scale-110 transition-transform duration-700 z-0`}><Package size={48} className="text-white/40 drop-shadow-md"/></div>
                                      {product.image && (<img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.currentTarget.style.display = 'none'; }}/>)}
                                  </div>
                                  <div className="p-6 flex-1 flex flex-col justify-between bg-[#11151d]">
                                      <h3 className="text-white font-bold mb-2 text-lg truncate" title={product.name}>{product.name}</h3>
                                      <div className="flex items-center justify-between mt-4">
                                          <span className="text-xl font-black text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">{displayPrice}</span>
                                          <button className="w-10 h-10 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]"><ShoppingBag size={16}/></button>
                                      </div>
                                  </div>
                              </div>
                          </Link>
                        );
                    }) : (<div className="col-span-4 text-center text-slate-500 py-10">Henüz vitrin ürünü yok.</div>)}
                </div>
            )}
        </div>
      </section>

      {/* --- FAQ --- */}
      <FAQ />

      {/* --- PREMIUM HAKKIMIZDA & DNA --- */}
      <section className="relative py-32 bg-[#020611] border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-900/10 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <Gem size={14} />
                            Premium Teknoloji Üssü
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">MÜKEMMELLİK BİR <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">TERCİHTİR.</span></h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-4">Sıradanlığı reddediyoruz. Aura Bilişim, sadece arızalı parçayı değiştiren bir dükkan değil; cihazınızın performansını fabrika standartlarının ötesine taşıyan bir <strong>mühendislik laboratuvarıdır.</strong></p>
                        <p className="text-slate-400 text-lg leading-relaxed">Her vida sıkımında tork ayarı, her lehimde mikron hassasiyeti. Bu bizim imzamız.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/kurumsal" className="group relative px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all overflow-hidden flex items-center justify-center gap-3 border border-white/10 hover:border-white/20"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div><FileSearch size={20} className="text-slate-400 group-hover:text-white transition-colors"/>Hikayemiz & Vizyon</Link>
                        <Link href="/dna" className="group relative px-8 py-4 bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-3"><Cpu size={20} className="animate-pulse"/>Teknik DNA & Mühendislik<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/></Link>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 mt-8">
                        <div className="bg-[#0f1420] p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group"><Microscope size={32} className="text-cyan-500 mb-4 group-hover:scale-110 transition-transform"/><h4 className="text-white font-bold mb-2">Mikro Analiz</h4><p className="text-xs text-slate-400">Gözle görülmeyen hasar tespiti.</p></div>
                        <div className="bg-[#0f1420] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors group"><Layers size={32} className="text-purple-500 mb-4 group-hover:scale-110 transition-transform"/><h4 className="text-white font-bold mb-2">Donanım & Yazılım</h4><p className="text-xs text-slate-400">Tam entegrasyonlu çözüm.</p></div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-[#0f1420] p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-colors group"><ShieldCheck size={32} className="text-green-500 mb-4 group-hover:scale-110 transition-transform"/><h4 className="text-white font-bold mb-2">Aura Güvencesi</h4><p className="text-xs text-slate-400">Yapılan her işleme %100 garanti.</p></div>
                        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 rounded-2xl border border-cyan-500/20 flex flex-col justify-center items-center text-center group hover:border-cyan-500/50 transition-colors"><div className="mb-2 p-3 bg-cyan-500/10 rounded-full group-hover:bg-cyan-500/20 transition-colors"><Award size={28} className="text-cyan-400"/></div><span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Yüksek Performans Merkezi</span></div>
                    </div>
                </div>
            </div>
        </div>
      </section>

    
    
      
   

    </div>
  );
}