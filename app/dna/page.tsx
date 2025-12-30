import React from "react";
import Link from "next/link";
import { 
  Cpu, Zap, ShieldCheck, ScanEye, 
  ArrowLeft, Binary, Share2, Ruler, Compass, PenTool,
  Layers, GitBranch, Database, ChevronDown, Activity, Network
} from "lucide-react";

/* ================================================================= */
/* 1. SVG: 2D ALTIN ORAN BLUEPRINT (Phase 1)                       */
/* ================================================================= */
const BlueprintLogo2D = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">
    <defs>
      <marker id="arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
        <path d="M 0 0 L 4 2 L 0 4 Z" fill="#22d3ee" />
      </marker>
      <pattern id="hatch" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M 0 2 L 2 0" stroke="#22d3ee" strokeWidth="0.2" strokeOpacity="0.4" />
      </pattern>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Arka Plan Izgarası & Daireler */}
    <g stroke="rgba(34,211,238,0.2)" strokeWidth="0.3">
        <line x1="100" y1="0" x2="100" y2="200" strokeDasharray="4 2"/>
        <line x1="0" y1="100" x2="200" y2="100" strokeDasharray="4 2"/>
        <circle cx="100" cy="100" r="28" fill="none" strokeOpacity="0.4" />
        <circle cx="100" cy="100" r="45" fill="none" strokeOpacity="0.3" />
        <circle cx="100" cy="100" r="72" fill="none" strokeOpacity="0.2" />
        <line x1="0" y1="0" x2="200" y2="200" opacity="0.2" />
        <line x1="200" y1="0" x2="0" y2="200" opacity="0.2" />
    </g>

    {/* Uzatma Çizgileri */}
    <g stroke="#22d3ee" strokeWidth="0.4" opacity="0.7">
        <line x1="70" y1="70" x2="130" y2="130" />
        <line x1="130" y1="70" x2="70" y2="130" />
        <line x1="40" y1="10" x2="40" y2="190" strokeDasharray="2 2" />
        <line x1="160" y1="10" x2="160" y2="190" strokeDasharray="2 2" />
    </g>

    {/* Ana Logo Formu */}
    <g transform="translate(100, 100)" filter="url(#glow)">
        <g transform="rotate(45)">
            <rect x="-20" y="-20" width="40" height="40" rx="4" stroke="#fff" strokeWidth="1" fill="rgba(255,255,255,0.05)" className="animate-pulse" />
            <rect x="-14" y="-14" width="28" height="28" rx="1" stroke="#22d3ee" strokeWidth="0.5" fill="none" strokeDasharray="3 1" />
            <circle cx="0" cy="0" r="2" fill="#fff" />
        </g>
        <path d="M -25 -45 L -55 -15 L -55 10 L -40 10 L -40 -10 L -10 -40 Z" stroke="#22d3ee" strokeWidth="1" fill="url(#hatch)" strokeLinejoin="round" />
        <path d="M 25 45 L 55 15 L 55 -10 L 40 -10 L 40 10 L 10 40 Z" stroke="#3b82f6" strokeWidth="1" fill="url(#hatch)" strokeLinejoin="round" />
        <g fill="#22d3ee">
            <rect x="-35" y="-5" width="6" height="1.5" transform="rotate(45)" />
            <rect x="29" y="4" width="6" height="1.5" transform="rotate(45)" />
        </g>
    </g>

    {/* Ölçüler ve Etiketler */}
    <g fill="#22d3ee" fontFamily="monospace" fontSize="4" fontWeight="bold" filter="url(#glow)">
        <line x1="100" y1="100" x2="145" y2="100" stroke="#22d3ee" strokeWidth="0.4" markerEnd="url(#arrow)" />
        <text x="105" y="96">R=1.618 (PHI)</text>
        <path d="M 160 100 Q 170 100 170 90" stroke="#22d3ee" strokeWidth="0.4" fill="none" />
        <text x="172" y="88">45° TILT</text>
        <line x1="45" y1="145" x2="45" y2="165" stroke="#22d3ee" strokeWidth="0.4" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <text x="25" y="155">W=15mm</text>
        <circle cx="100" cy="100" r="2" fill="white" />
        <circle cx="60" cy="60" r="2" fill="white" opacity="0.6" />
        <circle cx="140" cy="140" r="2" fill="white" opacity="0.6" />
    </g>
  </svg>
);

/* ================================================================= */
/* 2. SVG: 3D PATLATILMIŞ GÖRÜNÜM (Exploded View - Phase 2)        */
/* ================================================================= */
const ExplodedLogo3D = () => (
  <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_50px_rgba(34,211,238,0.3)] scale-125">
    
    {/* --- KATMAN 1: DONANIM (Alt - Yeşil) --- */}
    <g transform="translate(200, 280) scale(1.2, 0.6)" className="group/hw">
        <rect x="-80" y="-80" width="160" height="160" stroke="#22c55e" strokeWidth="1.5" fill="rgba(34, 197, 94, 0.05)" className="group-hover/hw:fill-green-900/20 transition-colors"/>
        <path d="M -70 -60 H 70 M -70 0 H 70 M -70 60 H 70" stroke="#22c55e" strokeWidth="0.8" strokeOpacity="0.4"/>
        <path d="M -60 -70 V 70 M 0 -70 V 70 M 60 -70 V 70" stroke="#22c55e" strokeWidth="0.8" strokeOpacity="0.4"/>
        <rect x="-30" y="-30" width="60" height="60" fill="#22c55e" opacity="0.4" className="animate-pulse"/>
        <text x="90" y="0" fill="#22c55e" fontSize="14" fontWeight="bold" fontFamily="monospace">HARDWARE_LAYER</text>
    </g>

    {/* Veri Akış Çizgileri */}
    <g strokeDasharray="4 4" strokeWidth="1.5" className="animate-[dash_2s_linear_infinite]">
        <path d="M 170 250 L 170 180" stroke="#22c55e" opacity="0.6"/>
        <path d="M 230 250 L 230 180" stroke="#22c55e" opacity="0.6"/>
    </g>

    {/* --- KATMAN 2: YAZILIM (Orta - Mavi) --- */}
    <g transform="translate(200, 180) scale(1.2, 0.6)" className="group/sw">
        <rect x="-70" y="-70" width="140" height="140" stroke="#3b82f6" strokeWidth="1.5" fill="rgba(59, 130, 246, 0.05)" className="group-hover/sw:fill-blue-900/20 transition-colors"/>
        <line x1="-40" y1="-30" x2="20" y2="-30" stroke="#3b82f6" strokeWidth="3"/>
        <line x1="-40" y1="0" x2="40" y2="0" stroke="#3b82f6" strokeWidth="3"/>
        <line x1="-40" y1="30" x2="10" y2="30" stroke="#3b82f6" strokeWidth="3"/>
        <text x="80" y="0" fill="#3b82f6" fontSize="14" fontWeight="bold" fontFamily="monospace">SOFTWARE_CORE</text>
    </g>

    {/* Veri Akış Çizgileri */}
    <g strokeDasharray="4 4" strokeWidth="1.5" className="animate-[dash_2s_linear_infinite_reverse]">
        <path d="M 170 150 L 170 80" stroke="#3b82f6" opacity="0.6"/>
        <path d="M 230 150 L 230 80" stroke="#3b82f6" opacity="0.6"/>
    </g>

    {/* --- KATMAN 3: KALKAN (Üst - Cyan) --- */}
    <g transform="translate(200, 80) scale(1.2, 0.6)" className="group/sh">
        <rect x="-60" y="-60" width="120" height="120" stroke="#22d3ee" strokeWidth="3" fill="rgba(34, 211, 238, 0.1)" className="animate-pulse group-hover/sh:fill-cyan-900/20 transition-colors"/>
        <path d="M -40 -40 L 40 40 M 40 -40 L -40 40" stroke="#22d3ee" strokeWidth="1.5"/>
        <text x="70" y="0" fill="#22d3ee" fontSize="14" fontWeight="bold" fontFamily="monospace">AURA_SHIELD</text>
    </g>
  </svg>
);


/* ================================================================= */
/* ANA SAYFA BİLEŞENİ                                               */
/* ================================================================= */
export default function DnaPage() {
  return (
    <main className="min-h-screen relative bg-[#020611] text-white overflow-hidden selection:bg-cyan-500/30">
      
      {/* ARKA PLAN - Daha Derin ve Hareketli */}
      <div className="absolute inset-0 bg-[#020611]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:60px_60px] opacity-30 animate-[pulse_10s_ease-in-out_infinite]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)]"></div>
      
      {/* --- ÜST MENÜYÜ KALDIRDIM --- */}
      {/* Çakışmayı önlemek için buradaki özel <nav> bloğu silindi. */}
      {/* Site genel Navbar'ı (layout.tsx'ten gelen) görünecektir. */}

      {/* ================================================================= */}
      {/* BÖLÜM 1: 2D MİMARİ ESKİZ (Phase 1)                               */}
      {/* ================================================================= */}
      {/* pt-40: Navbar'ın altında kalmaması için ekstra üst boşluk verildi */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-40 pb-20 px-6">
        
        <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 mb-4 backdrop-blur-md shadow-lg">
                <Compass size={20} className="animate-[spin_10s_linear_infinite]" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase font-mono">
                    System ID: AURA_FULL_SPEC
                </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter">
                TASARIM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">SÜRECİ</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-xl font-light leading-relaxed">
                Logomuz rastgele bir çizim değil; matematiksel kesinlik ve mühendislik prensipleriyle inşa edilmiş <strong className="text-cyan-400 font-medium">teknik bir manifestodur.</strong>
            </p>
        </div>

        <div className="relative w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* SOL: TEKNİK ÇİZİM MASASI (Holografik Projeksiyon) */}
            <div className="lg:col-span-7 relative h-[600px] lg:h-[700px] rounded-[3rem] border-2 border-cyan-900/30 overflow-hidden group bg-[#0a0f1e] shadow-[0_0_50px_rgba(34,211,238,0.1)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)] group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_49%,rgba(34,211,238,0.1)_50%,transparent_51%)] bg-[size:100%_20px] animate-[scan_5s_linear_infinite]"></div>

                {/* Cetvel Kenarlıkları */}
                <div className="absolute top-0 w-full h-10 border-b border-cyan-900/50 flex justify-between px-4 items-end opacity-70 bg-[#020611]/50">
                     {Array.from({length: 50}).map((_, i) => (<div key={i} className={`w-px bg-cyan-700 ${i % 5 === 0 ? 'h-5' : 'h-3'}`}></div>))}
                </div>
                <div className="absolute left-0 h-full w-10 border-r border-cyan-900/50 flex flex-col justify-between py-4 items-end opacity-70 bg-[#020611]/50">
                     {Array.from({length: 40}).map((_, i) => (<div key={i} className={`h-px bg-cyan-700 ${i % 5 === 0 ? 'w-5' : 'w-3'}`}></div>))}
                </div>

                {/* LOGO */}
                <div className="relative w-full h-full p-12 flex items-center justify-center z-10">
                    <div className="w-[450px] h-[450px] md:w-[550px] md:h-[550px]">
                        <BlueprintLogo2D />
                    </div>
                </div>
                
                {/* Alt Bilgi Paneli */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-[#020611]/80 border-t border-cyan-900/50 backdrop-blur-md flex justify-between items-center font-mono text-[10px] text-cyan-500">
                    <div>
                        <span className="block text-slate-400">PROJECT:</span>
                        AURA_IDENTITY_V2.1
                    </div>
                    <div>
                        <span className="block text-slate-400">SCALE:</span>
                        1:1.618 (PHI)
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                        RENDERING: ACTIVE
                    </div>
                </div>
            </div>

            {/* SAĞ: TEKNİK ÖZELLİKLER (Genişletilmiş) */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* Modül 1 */}
                <div className="group relative p-8 bg-slate-900/40 border-l-4 border-cyan-500/50 hover:border-cyan-400 transition-all hover:bg-gradient-to-r hover:from-cyan-950/30 hover:to-transparent rounded-r-3xl overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Ruler size={120} className="text-cyan-500 -translate-y-1/4 translate-x-1/4" />
                    </div>
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-500/30 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                            <Ruler size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                                    Milimetrik Simetri
                                </h3>
                                <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-300 font-mono uppercase">
                                    STATUS: LOCKED
                                </span>
                            </div>
                            <p className="text-slate-400 text-base leading-relaxed font-light">
                                Altın oran (Phi) kurallarına göre hesaplanmış 45 derecelik açılar ve kusursuz denge. Doğadaki mükemmel düzenin dijital yansıması.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modül 2 */}
                <div className="group relative p-8 bg-slate-900/40 border-l-4 border-blue-500/50 hover:border-blue-400 transition-all hover:bg-gradient-to-r hover:from-blue-950/30 hover:to-transparent rounded-r-3xl overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Cpu size={120} className="text-blue-500 -translate-y-1/4 translate-x-1/4" />
                    </div>
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-blue-950/50 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/30 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            <Cpu size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                                    Çekirdek Odaklı
                                </h3>
                                <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-blue-300 font-mono uppercase">
                                    PRIORITY: HIGH
                                </span>
                            </div>
                            <p className="text-slate-400 text-base leading-relaxed font-light">
                                Logonun tam merkezindeki kare "Core" (İşlemci), tüm sistemin referans noktasıdır. Sorunun kaynağına odaklanan felsefemizi simgeler.
                            </p>
                        </div>
                    </div>
                </div>

                 {/* Modül 3 */}
                 <div className="group relative p-8 bg-slate-900/40 border-l-4 border-purple-500/50 hover:border-purple-400 transition-all hover:bg-gradient-to-r hover:from-purple-950/30 hover:to-transparent rounded-r-3xl overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Network size={120} className="text-purple-500 -translate-y-1/4 translate-x-1/4" />
                    </div>
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-purple-950/50 flex items-center justify-center text-purple-400 shrink-0 border border-purple-500/30 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <Network size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors">
                                    Akışkan Veri Yolları
                                </h3>
                                <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-purple-300 font-mono uppercase">
                                    FLOW: OPTIMIZED
                                </span>
                            </div>
                            <p className="text-slate-400 text-base leading-relaxed font-light">
                                Kalkanların kavisli yapısı, kesintisiz enerji ve veri akışını temsil eder. Engel tanımayan, sürekli bir çözüm süreci.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Aşağı Kaydırma İkonu */}
        <div className="absolute bottom-10 animate-bounce text-cyan-500/70">
            <ChevronDown size={36} />
        </div>
      </section>

      {/* ================================================================= */}
      {/* BÖLÜM 2: 3D PATLATILMIŞ GÖRÜNÜM (Phase 2)                        */}
      {/* ================================================================= */}
      <section className="relative z-10 py-40 border-t border-cyan-900/30 bg-[#010409] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(34,211,238,0.05)_0%,transparent_60%)] animate-[spin_60s_linear_infinite] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-28">
                 <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-950/50 border border-blue-800/50 text-blue-400 mb-6 backdrop-blur-md shadow-lg">
                    <Layers size={20} />
                    <span className="text-xs font-bold tracking-[0.3em] uppercase font-mono">Phase 2: System Architecture</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
                    ÇOK KATMANLI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">MİMARİ</span>
                </h2>
                <p className="text-slate-400 mt-6 text-xl max-w-2xl mx-auto font-light">Logomuz sadece bir şekil değil, entegre çalışan bir <strong className="text-blue-400">ekosistemin kesitidir.</strong></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                
                {/* SOL: KATMAN KARTLARI */}
                <div className="space-y-8 order-2 lg:order-1">
                    
                    {/* Katman 1 */}
                    <div className="group relative p-8 bg-[#0a0f1e] border border-cyan-900/50 rounded-3xl hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300 cursor-pointer">
                        <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500 rounded-l-3xl"></div>
                        <div className="flex items-start gap-6 pl-4">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors flex items-center gap-3">
                                    AURA SHIELD
                                    <span className="text-[10px] px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-300 font-mono uppercase">LAYER: TOP</span>
                                </h3>
                                <p className="text-slate-400 text-base leading-relaxed">
                                    En üst katman. Cihazı dış etkenlerden, voltaj dalgalanmalarından ve statik yükten koruyan aktif "Koruma Kalkanı".
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Katman 2 */}
                    <div className="group relative p-8 bg-[#0a0f1e] border border-blue-900/50 rounded-3xl hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-pointer">
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 rounded-l-3xl"></div>
                        <div className="flex items-start gap-6 pl-4">
                            <div className="w-16 h-16 rounded-2xl bg-blue-950/50 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/30 group-hover:scale-110 transition-transform">
                                <GitBranch size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors flex items-center gap-3">
                                    SOFTWARE LINK
                                    <span className="text-[10px] px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 font-mono uppercase">LAYER: MID</span>
                                </h3>
                                <p className="text-slate-400 text-base leading-relaxed">
                                    Orta katman. Donanımı yöneten zeka. Kendi geliştirdiğimiz yazılım entegrasyonu sayesinde donanım maksimum verimle çalışır.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Katman 3 */}
                    <div className="group relative p-8 bg-[#0a0f1e] border border-green-900/50 rounded-3xl hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-300 cursor-pointer">
                        <div className="absolute top-0 left-0 w-2 h-full bg-green-500 rounded-l-3xl"></div>
                        <div className="flex items-start gap-6 pl-4">
                            <div className="w-16 h-16 rounded-2xl bg-green-950/50 flex items-center justify-center text-green-400 shrink-0 border border-green-500/30 group-hover:scale-110 transition-transform">
                                <Database size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-green-400 transition-colors flex items-center gap-3">
                                    HARDWARE BASE
                                    <span className="text-[10px] px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-300 font-mono uppercase">LAYER: CORE</span>
                                </h3>
                                <p className="text-slate-400 text-base leading-relaxed">
                                    Temel katman. Anakart, çipler ve devreler. Fiziksel onarımın ve mühendisliğin uygulandığı "Merkez Üs".
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAĞ: 3D SVG GÖRSELİ */}
                <div className="order-1 lg:order-2 flex justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl rounded-full animate-pulse"></div>
                    <div className="w-full max-w-[600px] h-[600px] relative z-10 p-8 flex items-center justify-center hover:scale-105 transition-transform duration-700">
                        <ExplodedLogo3D />
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* BÖLÜM 3: KURUMSAL PROTOKOLLER                                    */}
      {/* ================================================================= */}
      <section className="relative z-10 py-32 border-t border-slate-800 bg-[#010307]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
                 <h2 className="text-4xl font-black text-white mb-6">Operasyonel <span className="text-cyan-400">Protokoller</span></h2>
                 <p className="text-slate-400 text-xl max-w-2xl mx-auto">Bu teknik mimariyi hayata geçiren, laboratuvarımızın çalışma standartlarıdır.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Protokol Kartları */}
                {[
                    { icon: <Cpu size={32}/>, color: "text-cyan-400", bg: "bg-cyan-950/50", border: "border-cyan-500/20", title: "Ar-Ge Kültürü", desc: "Arızaları veri noktası olarak işleyip kronik sorunları analiz ediyoruz." },
                    { icon: <ShieldCheck size={32}/>, color: "text-blue-400", bg: "bg-blue-950/50", border: "border-blue-500/20", title: "Yetkili Servis Disiplini", desc: "Antistatik (ESD) zemin ve steril ortam standarttır." },
                    { icon: <Binary size={32}/>, color: "text-green-400", bg: "bg-green-950/50", border: "border-green-500/20", title: "Hibrit Uzmanlık", desc: "Donanım ustalığı ile yazılım zekasının birleşimi." }
                ].map((item, i) => (
                    <div key={i} className={`p-10 bg-[#0a0f1e] border border-slate-800 rounded-[2rem] hover:border-cyan-500/50 transition-all group hover:-translate-y-2`}>
                        <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 border ${item.border} group-hover:scale-110 transition-transform`}>{item.icon}</div>
                        <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                        <p className="text-slate-400 text-base leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* FİNAL CTA */}
            <div className="mt-32 pt-16 border-t border-slate-800 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-[#010307] text-cyan-500 font-mono text-xs tracking-widest uppercase border border-cyan-900/50 rounded-full">
                    END OF REPORT
                </div>
                <p className="text-slate-500 text-sm font-mono mb-10 tracking-widest">
                    SYSTEM STATUS: OPERATIONAL & READY <br/>
                    LOCATION: ISTANBUL TECHNOLOGY BASE
                </p>
                <Link href="/iletisim" className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg rounded-2xl transition-all shadow-[0_0_30px_rgba(8,145,178,0.4)] hover:shadow-[0_0_50px_rgba(8,145,178,0.6)] hover:scale-105">
                    <Share2 size={20} /> Mühendislik Ekibiyle Tanışın
                </Link>
            </div>
        </div>
      </section>

    </main>
  );
}