"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase'; // Yolunu kontrol et
import { 
  Activity, Clock, ShieldCheck, TrendingUp, 
  AlertCircle, Crown, Lock, Phone, MessageCircle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BusinessDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [technician, setTechnician] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]); // Aktif İşler Listesi

  useEffect(() => {
    const init = async () => {
      // 1. Giriş yapan kullanıcıyı bul
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/kurumsal/login');
        return;
      }

      // 2. Profil ve Paket Bilgisi Çek
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profileData) {
        setProfile(profileData);

        // 3. ATANAN TEKNİSYENİ ÇEK
        if (profileData.dedicated_technician_id) {
          const { data: techData } = await supabase
            .from('personel_izinleri')
            .select('ad_soyad, rol, email')
            .eq('id', profileData.dedicated_technician_id)
            .single();
          if (techData) setTechnician(techData);
        }

        // 4. AKTİF İŞLERİ (CİHAZLARI) ÇEK
        const { data: jobsData } = await supabase
          .from('aura_jobs')
          .select('*')
          .eq('customer_email', user.email) // Sadece bu bayiye ait işler
          .order('created_at', { ascending: false });
        
        if (jobsData) setJobs(jobsData);
      }
      setLoading(false);
    };

    init();
  }, []);

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-white">Yükleniyor...</div>;

  const isPlatinum = profile?.subscription_plan === 'platinum';
  const isGold = profile?.subscription_plan === 'gold' || isPlatinum;
  
  // Hesaplamalar
  const activeJobCount = jobs.filter(j => j.status !== 'Tamamlandı').length;
  // (Örnek Mantık) Onarım tutarının %20'si kadar tasarruf ettiğini varsayalım
  const totalSavings = jobs.reduce((acc, curr) => acc + (curr.cost || 0), 0) * 0.20;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-24 md:pb-10">
      
      {/* Üst Başlık */}
      <div className="px-6 pt-8 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hoşgeldin, <span className="text-amber-500">{profile?.company_name || "Değerli İş Ortağımız"}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            Paket Durumu: 
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
              isPlatinum ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' : 
              isGold ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 
              'bg-slate-700 text-slate-400 border-slate-600'
            }`}>
              {isPlatinum && <Crown size={10} className="inline mr-1"/>}
              {profile?.subscription_plan || 'Standart'}
            </span>
          </p>
        </div>
      </div>

      <div className="px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SOL TARAF: KPI VE İŞ LİSTESİ */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* KPI KARTLARI */}
           <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="bg-[#0f172a] border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                 <div className="absolute right-0 top-0 p-4 opacity-10"><Activity size={48} className="text-blue-500"/></div>
                 <p className="text-slate-400 text-xs font-bold uppercase">Aktif Onarımlar</p>
                 <h3 className="text-3xl font-black text-white mt-1">{activeJobCount} <span className="text-sm font-normal text-slate-500">Cihaz</span></h3>
              </div>
              <div className="bg-[#0f172a] border border-amber-500/20 p-5 rounded-2xl relative overflow-hidden">
                 <div className="absolute right-0 top-0 p-4 opacity-10"><TrendingUp size={48} className="text-amber-500"/></div>
                 <p className="text-slate-400 text-xs font-bold uppercase">Tahmini Tasarruf</p>
                 <h3 className="text-3xl font-black text-amber-500 mt-1">₺{totalSavings.toLocaleString('tr-TR')}</h3>
                 <p className="text-[10px] text-slate-500">Yeni cihaz alımı yerine onarım tercih ederek.</p>
              </div>
           </div>

           {/* OPERASYON DURUMU (CANLI CİHAZ LİSTESİ) */}
           <div>
              <h3 className="text-white font-bold mb-4 border-l-4 border-amber-500 pl-3">Operasyon Durumu</h3>
              <div className="space-y-4">
                {jobs.length > 0 ? jobs.map((job) => (
                  <div key={job.id} className="bg-[#0f172a] border border-white/5 p-5 rounded-2xl hover:border-indigo-500/30 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-lg flex items-center gap-2">
                             {job.device_name}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                             job.status === 'Onarımda' ? 'bg-blue-500/20 text-blue-400' :
                             job.status === 'Test Aşamasında' ? 'bg-purple-500/20 text-purple-400' :
                             'bg-green-500/20 text-green-400'
                          }`}>
                             {job.status}
                          </span>
                      </div>
                      
                      <div className="bg-black/20 p-3 rounded-xl mb-3 border border-white/5">
                         <p className="text-xs text-slate-500 font-bold mb-1">TEKNİSYEN NOTU:</p>
                         <p className="text-sm text-slate-300 italic">"{job.technician_note}"</p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-slate-500">
                         <span className="flex items-center gap-1"><AlertCircle size={12}/> {job.problem_description}</span>
                         <span className="flex items-center gap-1 text-amber-500"><Clock size={12}/> Tahmini: {job.estimated_date ? new Date(job.estimated_date).toLocaleDateString('tr-TR') : 'Belirsiz'}</span>
                      </div>
                  </div>
                )) : (
                  <div className="text-center py-10 bg-[#0f172a] rounded-2xl border border-dashed border-slate-700 text-slate-500">
                     <Activity size={32} className="mx-auto mb-2 opacity-50"/>
                     <p>Şu an işlemde olan cihazınız bulunmamaktadır.</p>
                  </div>
                )}
              </div>
           </div>

        </div>

        {/* SAĞ TARAF: DANIŞMAN VE DESTEK */}
        <div>
           <h3 className="text-white font-bold mb-4 border-l-4 border-indigo-500 pl-3">Müşteri Temsilciniz</h3>
           {technician ? (
              <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-indigo-500/30 p-6 rounded-2xl text-center relative shadow-2xl sticky top-6">
                  {isPlatinum && <div className="absolute top-3 right-3 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded font-bold">ÖZEL</div>}
                  
                  <div className="w-20 h-20 mx-auto bg-slate-700 rounded-full mb-4 border-2 border-indigo-500 p-1 relative">
                    <div className="w-full h-full bg-slate-600 rounded-full flex items-center justify-center text-2xl font-bold text-white uppercase">
                      {technician.ad_soyad.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0f172a]"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white">{technician.ad_soyad}</h3>
                  <p className="text-indigo-400 text-sm font-medium mb-4 uppercase tracking-wide">{technician.rol}</p>
                  
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                      <Phone size={18} /> Hemen Ara
                    </button>
                    <button className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-colors">
                      <MessageCircle size={18} /> WhatsApp Destek
                    </button>
                    <p className="text-[10px] text-slate-500 mt-2">*Hafta içi 09:00 - 19:00 arası doğrudan ulaşabilirsiniz.</p>
                  </div>
              </div>
           ) : (
              <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 text-center">
                  <h3 className="text-white font-bold">Genel Destek Hattı</h3>
                  <p className="text-slate-400 text-sm mt-2 mb-4">Henüz size özel atanmış bir danışman bulunmuyor.</p>
                  <button className="w-full py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-bold">Destek Talebi Oluştur</button>
              </div>
           )}

           {/* Yeni Kayıt Butonu */}
           <div className="mt-6 border-t border-white/5 pt-6">
              <button className="w-full py-4 border border-dashed border-slate-600 text-slate-400 rounded-2xl hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2">
                 <span className="text-2xl font-thin">+</span> Yeni Arıza Kaydı Oluştur
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}