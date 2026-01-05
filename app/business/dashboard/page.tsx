import React from 'react';
import { 
  Activity, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  Phone, 
  MessageCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Tip Tanımlamaları (İleride Supabase'den gelecek)
type JobStatus = 'pending' | 'diagnosing' | 'repairing' | 'testing' | 'ready';

interface Job {
  id: string;
  device: string;
  issue: string;
  status: JobStatus;
  progress: number; // 0-100 arası
  estimatedCompletion: string;
  technicianNote?: string;
}

// Örnek Veriler (Simülasyon)
const activeJobs: Job[] = [
  {
    id: "JOB-4829",
    device: "MacBook Pro M1 Max (Render Station)",
    issue: "Sıvı Teması / Anakart Onarımı",
    status: 'repairing',
    progress: 65,
    estimatedCompletion: "Bugün, 16:00",
    technicianNote: "Level 4 onarım devam ediyor. Oksit temizliği tamamlandı, çip değişimi yapılıyor."
  },
  {
    id: "JOB-4830",
    device: "Roborock S7 MaxV",
    issue: "Lidar Sensör Hatası",
    status: 'testing',
    progress: 90,
    estimatedCompletion: "Hazır (Teslimat Bekleniyor)",
    technicianNote: "Sensör kalibrasyonu yapıldı, test sürüşü başarılı."
  }
];

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-24 md:pb-10">
      
      {/* Üst Başlık & Hoşgeldin Mesajı */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-white">
          Hoşgeldin, <span className="text-amber-500">Aras Mimarlık</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Teknoloji envanteriniz güvende ve kontrol altında.
        </p>
      </div>

      <div className="px-4 max-w-7xl mx-auto space-y-6">
        
        {/* 1. KPI KARTLARI (STRATEJİK ÖZET) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Aktif İşler */}
          <div className="bg-[#0f172a] border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Aktif Onarımlar</p>
              <h3 className="text-3xl font-bold text-white mt-1">2 <span className="text-sm font-normal text-slate-500">Cihaz</span></h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Activity size={24} />
            </div>
          </div>

          {/* Tasarruf Raporu (Patronu İkna Eden Kısım) */}
          <div className="bg-[#0f172a] border border-amber-500/20 p-5 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <div>
              <p className="text-amber-500/80 text-xs uppercase font-semibold tracking-wider flex items-center gap-1">
                <TrendingUp size={12} /> Yıllık Tasarruf
              </p>
              <h3 className="text-3xl font-bold text-amber-500 mt-1">₺142.500</h3>
              <p className="text-[10px] text-slate-500 mt-1">Yeni cihaz alımı yerine onarım tercih ederek.</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <ShieldCheck size={24} />
            </div>
          </div>

          {/* SLA Başarısı */}
          <div className="bg-[#0f172a] border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Hız Garantisi (SLA)</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-1">%98</h3>
              <p className="text-[10px] text-slate-500 mt-1">24 saat içinde onarım oranı.</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 2. AKTİF İŞ LİSTESİ (CANLI TAKİP) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
              Operasyon Durumu
            </h2>

            {activeJobs.map((job) => (
              <div key={job.id} className="bg-[#0f172a] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                {/* İlerleme Çubuğu Arkaplanı */}
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000" 
                  style={{ width: `${job.progress}%` }}
                ></div>

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg text-slate-300">
                      {job.device.includes('MacBook') ? <Laptop size={20} /> : <Smartphone size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{job.device}</h3>
                      <p className="text-xs text-amber-500 font-mono tracking-wide">{job.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    job.status === 'ready' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse'
                  }`}>
                    {job.status === 'repairing' ? 'Onarımda' : 'Test Aşamasında'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-slate-400 mb-1">Teknisyen Notu:</p>
                    <p className="text-sm text-slate-200">{job.technicianNote}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <AlertCircle size={14} />
                      <span>Sorun: {job.issue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-500 font-semibold">
                      <Clock size={14} />
                      <span>Tahmini: {job.estimatedCompletion}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3. DEDİKE MÜŞTERİ YÖNETİCİSİ (MUHATAP BULMA) */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              Müşteri Temsilciniz
            </h2>
            
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 p-6 rounded-2xl text-center relative">
              <div className="w-20 h-20 mx-auto bg-slate-700 rounded-full mb-4 border-2 border-amber-500 p-1">
                {/* Profil Resmi Placeholder */}
                <div className="w-full h-full bg-slate-600 rounded-full flex items-center justify-center text-2xl">👨‍💻</div>
              </div>
              
              <h3 className="text-xl font-bold text-white">Ahmet Yılmaz</h3>
              <p className="text-amber-500 text-sm font-medium mb-6">Senior Teknik Danışman</p>
              
              <div className="space-y-3">
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                  <Phone size={18} />
                  Hemen Ara
                </button>
                <button className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-colors">
                  <MessageCircle size={18} />
                  WhatsApp Destek
                </button>
              </div>

              <p className="text-[10px] text-slate-500 mt-4">
                *Hafta içi 09:00 - 19:00 arası doğrudan ulaşabilirsiniz.
              </p>
            </div>

            {/* Hızlı Eylem */}
            <button className="w-full py-4 border border-dashed border-slate-600 text-slate-400 rounded-2xl hover:border-amber-500 hover:text-amber-500 transition-all flex items-center justify-center gap-2">
              <span className="text-2xl">+</span> Yeni Arıza Kaydı Oluştur
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}