"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Wrench, Clock, ArrowRight, User, MessageSquare, Mail } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { buildServisWhatsappMessage } from "@/utils/servisWhatsappMesaji";

export default function AtolyeListesi() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      // Supabase'den verileri çek (En yeniden eskiye)
      const { data, error } = await supabase
        .from('aura_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setJobs(data);
      if (error) console.error("Veri çekme hatası:", error);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  // --- 1. KURUMSAL WHATSAPP MESAJ OLUŞTURUCU ---
  const sendWhatsapp = (e: React.MouseEvent, job: any) => {
    e.preventDefault(); // Link'e tıklamayı engelle (Detay sayfasına gitmesin)
    
    // Telefon numarasını temizle (Boşlukları sil, +90 ekle vb.)
    if (!job.phone) return alert("Telefon numarası kayıtlı değil.");
    let phone = job.phone.replace(/\D/g, ''); 
    if (!phone.startsWith('90')) phone = '90' + phone;

    // Şablon Mesaj (Kurumsal Dil)
    const message = buildServisWhatsappMessage({
      customer: job.customer,
      device: job.device,
      tracking_code: job.tracking_code,
      status: job.status || "Bekliyor",
      issue: job.issue,
      price: job.price,
      serial_no: job.serial_no || job.imei,
    });

    // WhatsApp Linki Oluştur ve Aç
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // --- 2. OTOMATİK MAİL GÖNDERİCİ ---
  const sendEmailNotification = async (e: React.MouseEvent, job: any) => {
    e.preventDefault(); // Link'e tıklamayı engelle

    // Eğer müşterinin maili yoksa uyarı ver
    if (!job.email) {
      alert("Bu müşterinin mail adresi kayıtlı değil!");
      return;
    }

    const confirmSend = confirm(`${job.customer} firmasına durum bilgilendirme maili gönderilsin mi?`);
    if (!confirmSend) return;

    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: job.email, 
          subject: `Servis Bilgilendirmesi: ${job.device}`,
          type: 'hazir', // API route'unda 'hazir' tipini tanımlamıştık
          data: {
            customerName: job.customer,
            device: job.device,
            price: job.price || 'Belirlenmedi',
            islem: job.yapilan_islem || 'Genel Bakım ve Onarım'
          }
        })
      });

      if (res.ok) {
        alert("📧 Mail başarıyla gönderildi!");
      } else {
        alert("Mail gönderilemedi. Sunucu hatası.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    }
  };

  // Durum Renklendirme
  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("teslim")) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (s.includes("hazır")) return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
    if (s.includes("iade") || s.includes("iptal")) return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"; 
  };

  // --- GELİŞMİŞ AKILLI ARAMA FİLTRESİ ---
  const filteredJobs = jobs.filter(job => {
    // Arama kutusu boşsa hepsini göster
    const s = search.toLowerCase().trim();
    if (!s) return true;

    // Veritabanı alanlarını güvenli hale getir (null kontrolü)
    const customer = (job.customer || "").toLowerCase();
    const device = (job.device || "").toLowerCase();
    const imei = (job.imei || "").toLowerCase(); // IMEI alanı
    const serial = (job.serial_no || "").toLowerCase(); // Seri No alanı
    const trackingRaw = (job.tracking_code || "").toLowerCase();

    // 1. İsim, Cihaz, IMEI veya Seri No içinde direkt arama
    if (customer.includes(s)) return true;
    if (device.includes(s)) return true;
    if (imei.includes(s)) return true;
    if (serial.includes(s)) return true;

    // 2. Akıllı Takip No Araması (Tire ve boşlukları yoksayarak ara)
    // Örn: Kullanıcı "863" yazarsa "SRV-863..." bulsun.
    // Örn: Kullanıcı "srv863" yazarsa "SRV-863..." bulsun.
    const cleanTracking = trackingRaw.replace(/[^a-z0-9]/g, ''); // Sadece harf ve rakam kalsın
    const cleanSearch = s.replace(/[^a-z0-9]/g, '');

    if (cleanTracking.includes(cleanSearch)) return true;

    return false;
  });

  return (
    <div className="p-4 sm:p-6 text-slate-200 pb-24 motion-reduce:animate-none">
      {/* Üst Bar */}
      <div className="flex flex-col gap-4 mb-8 border-b border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Wrench className="text-cyan-500 shrink-0" size={28}/> <span>ATÖLYE</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Teknik servis listesi</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[20rem]">
          <div className="relative flex-1">
            {/* INPUT PLACEHOLDER GÜNCELLENDİ */}
            <input 
              type="text" 
              placeholder="Takip no, isim, IMEI..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full bg-[#0a0c10] border border-slate-700 rounded-xl py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-500 transition-colors duration-200"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18}/>
          </div>
          <Link href="/epanel/atolye/yeni" className="shrink-0">
            <button type="button" className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-cyan-900/20 active:scale-[0.98] transition-transform duration-150"><Plus size={20}/> YENİ GİRİŞ</button>
          </Link>
        </div>
        </div>
      </div>

      {/* Liste */}
      {loading ? <div className="text-center py-20 text-slate-500 animate-pulse">Yükleniyor...</div> : (
        <div className="grid gap-3 sm:gap-4">
          {filteredJobs.map((job) => (
            <Link key={job.id} href={`/epanel/atolye/${job.id}`} className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500/60 focus-visible:outline-offset-2">
              <div className="bg-[#151a25] border border-slate-800 p-4 sm:p-5 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-cyan-500/40 transition-colors duration-200 group cursor-pointer relative overflow-hidden active:scale-[0.99] motion-reduce:active:scale-100">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg bg-slate-800 text-slate-400`}>
                    {job.customer?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">{job.customer}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="text-cyan-400 font-mono bg-cyan-400/10 px-1.5 rounded">{job.tracking_code}</span>
                      <span className="flex items-center gap-1"><Wrench size={12}/> {job.device}</span>
                      {/* EĞER IMEI VARSA GÖSTER (OPSİYONEL GÖRÜNÜM) */}
                      {job.imei && <span className="text-[10px] text-slate-600 hidden sm:inline-block">IMEI: {job.imei.slice(-4)}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(job.status)}`}>
                    {job.status || "Bekliyor"}
                  </div>
                  <div className="text-right w-20 hidden sm:block">
                    <div className="text-lg font-black text-white">{job.price ? Number(job.price).toLocaleString('tr-TR') : 0} ₺</div>
                  </div>

                  {/* OTOMASYON BUTONLARI */}
                  <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
                      <button 
                        onClick={(e) => sendWhatsapp(e, job)}
                        className="p-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-lg transition-all border border-green-500/20 group/btn relative"
                        title="WhatsApp Bildirimi Gönder"
                      >
                          <MessageSquare size={18} />
                      </button>
                      
                      <button 
                        onClick={(e) => sendEmailNotification(e, job)}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg transition-all border border-blue-500/20 group/btn relative"
                        title="E-Posta Gönder"
                      >
                          <Mail size={18} />
                      </button>
                  </div>

                  <ArrowRight className="text-slate-600 group-hover:text-cyan-500 transition-colors"/>
                </div>
              </div>
            </Link>
          ))}
          {filteredJobs.length === 0 && <div className="text-center py-10 text-slate-500 bg-[#151a25] rounded-xl border border-dashed border-slate-800">Kayıt bulunamadı.</div>}
        </div>
      )}
    </div>
  );
}