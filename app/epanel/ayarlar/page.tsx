"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase"; 
import { 
  Settings, Plus, Trash2, Building2, 
  Users, Save, RefreshCw, Globe, 
  Star, Database, FileText, Download, AlertTriangle,
  PlusCircle, Archive, DollarSign, Calendar, BarChart3, XCircle, Edit, Power, Lock, CheckCircle2, ShieldAlert, UserCog
} from "lucide-react";

// Rol Tanımları
const ROLLER = [
    { id: 'admin', label: 'Yönetici (Admin)', desc: 'Tam Yetki', color: 'text-red-400 border-red-500/50 bg-red-500/10' },
    { id: 'teknisyen', label: 'Teknisyen', desc: 'Atölye & Servis', color: 'text-blue-400 border-blue-500/50 bg-blue-500/10' },
    { id: 'satis', label: 'Satış', desc: 'Mağaza & Kasa', color: 'text-purple-400 border-purple-500/50 bg-purple-500/10' },
    { id: 'stajyer', label: 'Stajyer', desc: 'Sınırlı Erişim', color: 'text-green-400 border-green-500/50 bg-green-500/10' }
];

const KATEGORILER = ['Telefon', 'Robot Süpürge', 'Bilgisayar', 'Tablet', 'Akıllı Saat', 'Diğer'];

export default function GelismisYonetimPaneli() {
  const [aktifSekme, setAktifSekme] = useState<'personel' | 'markalar' | 'sistem' | 'yorumlar'>('personel');
  const [yukleniyor, setYukleniyor] = useState(false);
  
  // Veri State'leri
  const [kaynaklar, setKaynaklar] = useState<any[]>([]);
  const [personelListesi, setPersonelListesi] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [systemConfig, setSystemConfig] = useState<any>({ kdv: '20', dolar: '30.00', bakim: 'false' });
  
  // Form State'leri
  const [yeniKaynak, setYeniKaynak] = useState({ isim: "", kategori: "Telefon", web_site: "" });
  const [yeniPersonel, setYeniPersonel] = useState({ email: "", password: "", ad: "", rol: "teknisyen", durum: "aktif" });
  
  // Düzenleme Modalı
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPersonel, setEditingPersonel] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");

  const [legalText, setLegalText] = useState("");
  const [savingText, setSavingText] = useState(false);
  const [closingMonth, setClosingMonth] = useState(false);

  useEffect(() => { veriGetir(); }, []);

  const veriGetir = async () => {
    setYukleniyor(true);
    
    // Markalar
    const { data: kaynakData } = await supabase.from('ayarlar_kaynaklar').select('*').order('isim');
    if (kaynakData) setKaynaklar(kaynakData);

    // Personel
    const { data: personelData } = await supabase.from('personel_izinleri').select('*').order('created_at');
    if (personelData) setPersonelListesi(personelData);

    // Yorumlar
    const { data: reviewData } = await supabase.from('aura_reviews').select('*').order('created_at', { ascending: false });
    if (reviewData) setReviews(reviewData);

    // Sistem Ayarları
    const { data: configData } = await supabase.from('aura_system_config').select('*');
    if (configData) {
        const configMap: any = {};
        configData.forEach(item => configMap[item.key] = item.value);
        setSystemConfig({ 
            kdv: configMap['kdv_orani'] || '20', 
            dolar: configMap['dolar_kuru'] || '30',
            bakim: configMap['bakim_modu'] || 'false'
        });
    }

    // Yasal Metin
    const { data: settingData } = await supabase.from('aura_settings').select('setting_value').eq('setting_key', 'legal_text').maybeSingle();
    if (settingData) setLegalText(settingData?.setting_value || "");
    
    setYukleniyor(false);
  };

  // --- PERSONEL İŞLEMLERİ ---
  const personelEkle = async () => {
    if (!yeniPersonel.email || !yeniPersonel.password) return alert("Email ve Şifre zorunlu!");
    setYukleniyor(true);
    try {
      // 1. Auth Kullanıcısı Oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
          email: yeniPersonel.email, 
          password: yeniPersonel.password, 
          options: { data: { full_name: yeniPersonel.ad } } 
      });
      
      // Hata olsa bile (örn: kullanıcı zaten var) devam et, veritabanına kaydet
      const userId = authData.user?.id || null;

      const { error: dbError } = await supabase.from('personel_izinleri').insert([{ 
          user_id: userId,
          email: yeniPersonel.email, 
          ad_soyad: yeniPersonel.ad, 
          rol: yeniPersonel.rol, 
          durum: 'aktif' 
      }]);

      if (dbError) throw dbError;

      alert("✅ Personel Başarıyla Eklendi!");
      setYeniPersonel({ email: "", password: "", ad: "", rol: "teknisyen", durum: "aktif" });
      veriGetir();
    } catch (err: any) { alert("Hata: " + err.message); }
    setYukleniyor(false);
  };

  const personelDuzenleAc = (personel: any) => {
      setEditingPersonel(personel);
      setNewPassword(""); 
      setEditModalOpen(true);
  };

  const personelGuncelle = async () => {
      if(!editingPersonel) return;
      setYukleniyor(true);

      try {
          // 1. Şifre ve Auth Onarımı (API Çağrısı)
          let finalUserId = editingPersonel.user_id;

          if(newPassword && newPassword.length >= 6) {
              const response = await fetch('/api/admin/update-password', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                      userId: editingPersonel.user_id, 
                      email: editingPersonel.email, 
                      newPassword: newPassword 
                  })
              });

              const data = await response.json();
              if (!response.ok) throw new Error(data.error);

              // Eğer kullanıcı yeniden oluşturulduysa, yeni ID'yi al
              if (data.recreated && data.user?.id) {
                  finalUserId = data.user.id;
              }
              alert(data.message);
          } else {
              // Sadece bilgiler güncelleniyorsa mesaj göster
              alert("Personel bilgileri güncelleniyor...");
          }

          // 2. Veritabanı Bilgilerini Güncelle (Ad, Rol, Durum ve Varsa Yeni Auth ID)
          const { error } = await supabase.from('personel_izinleri').update({
              ad_soyad: editingPersonel.ad_soyad,
              rol: editingPersonel.rol,
              durum: editingPersonel.durum,
              user_id: finalUserId // ID değiştiyse güncelle, yoksa eskisi kalsın
          }).eq('id', editingPersonel.id);

          if(error) throw error;

          alert("İşlem Başarılı! ✅");
          setEditModalOpen(false);
          
          // Eğer kendi rolünü değiştirdiysen anında yansıması için sayfayı yenile
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email === editingPersonel.email) {
              window.location.reload(); 
          } else {
              veriGetir();
          }

      } catch (err:any) {
          alert("Güncelleme hatası: " + err.message);
      }
      setYukleniyor(false);
  };

  const personelSil = async (personel: any) => { 
      if(!confirm(`"${personel.ad_soyad}" adlı personeli silmek istediğinize emin misiniz?`)) return; 
      setYukleniyor(true);

      try {
          // 1. Önce bu personelin atandığı profillerdeki bağını kopar (Null yap)
          // Bu, veritabanı kısıtlamasına takılmadan silmeyi sağlar
          const { error: unassignError } = await supabase
            .from('profiles')
            .update({ dedicated_technician_id: null })
            .eq('dedicated_technician_id', personel.id);
            
          if (unassignError) console.warn("Profil bağı uyarısı:", unassignError);

          // 2. Personel Tablosundan Sil
          const { error: dbError } = await supabase.from('personel_izinleri').delete().eq('id', personel.id);
          if (dbError) throw dbError;

          // 3. Auth Sisteminden Sil (API ile - ID yoksa pas geçilir)
          if (personel.user_id) {
              await fetch('/api/admin/delete-user', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: personel.user_id })
              });
          }

          alert("Personel başarıyla silindi.");
          veriGetir();
      } catch (err: any) {
          console.error(err);
          alert("Silme işlemi başarısız: " + err.message);
      }
      setYukleniyor(false);
  };

  // --- SİSTEM AYARLARI ---
  const saveSystemConfig = async () => {
      setSavingText(true);
      await supabase.from('aura_system_config').upsert([
          { key: 'kdv_orani', value: systemConfig.kdv, description: 'KDV Oranı' },
          { key: 'dolar_kuru', value: systemConfig.dolar, description: 'Sabit Dolar Kuru' },
          { key: 'bakim_modu', value: systemConfig.bakim, description: 'Sistem Bakım Modu' }
      ]);
      await supabase.from('aura_settings').upsert({ setting_key: 'legal_text', setting_value: legalText }, { onConflict: 'setting_key' });
      setSavingText(false);
      alert("Tüm sistem ayarları kaydedildi!");
  };

  // --- DİĞERLERİ ---
  const kaynakEkle = async () => {
    if (!yeniKaynak.isim) return alert("Marka adı boş olamaz!");
    const { error } = await supabase.from('ayarlar_kaynaklar').insert([{ isim: yeniKaynak.isim, kategori: yeniKaynak.kategori, web_site: yeniKaynak.web_site }]);
    if(error) alert("Hata: " + error.message); else { setYeniKaynak({ isim: "", kategori: "Telefon", web_site: "" }); veriGetir(); }
  };

  const kaynakSil = async (id: string) => {
    if(!confirm("Bu markayı silmek istediğine emin misin?")) return;
    await supabase.from('ayarlar_kaynaklar').delete().eq('id', id);
    veriGetir();
  };

  const downloadBackup = async () => {
      if(!confirm("Yedek almak istiyor musunuz?")) return;
      const { data } = await supabase.from('aura_jobs').select('*');
      if(!data) { alert("Veri yok."); return; }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `aura-yedek-${new Date().toISOString().slice(0,10)}.json`; a.click();
  };

  const handleAyKapanisi = async () => { /* Mevcut fonksiyon */ };
  const deleteReview = async (id: number) => {
    if(!confirm("Yorum silinsin mi?")) return;
    await supabase.from('aura_reviews').delete().eq('id', id);
    veriGetir();
  };

  const ortalamaPuan = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const starCounts = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
      percent: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-6 animate-in fade-in duration-500 text-slate-200">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pt-6">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Settings className="text-cyan-400 animate-spin-slow" size={32} /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">YÖNETİM MERKEZİ</span>
          </h1>
          <div className="flex bg-[#1E293B] p-1 rounded-xl border border-slate-700 overflow-x-auto max-w-full no-scrollbar">
              <button onClick={() => setAktifSekme('personel')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${aktifSekme === 'personel' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Users size={16}/> Personel</button>
              <button onClick={() => setAktifSekme('markalar')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${aktifSekme === 'markalar' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Building2 size={16}/> Markalar</button>
              <button onClick={() => setAktifSekme('sistem')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${aktifSekme === 'sistem' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Settings size={16}/> Sistem</button>
              <button onClick={() => setAktifSekme('yorumlar')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${aktifSekme === 'yorumlar' ? 'bg-yellow-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Star size={16}/> Yorumlar</button>
          </div>
      </div>

      {/* SEKME 1: PERSONEL YÖNETİMİ */}
      {aktifSekme === 'personel' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Personel Ekleme Formu */}
              <div className="xl:col-span-1">
                  <div className="bg-[#1E293B]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl sticky top-6">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                          <PlusCircle size={20} className="text-green-400" /> Yeni Personel Ekle
                      </h3>
                      <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Ad Soyad</label><input type="text" value={yeniPersonel.ad} onChange={(e) => setYeniPersonel({...yeniPersonel, ad: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-all text-sm"/></div>
                              <div className="col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase ml-1">E-Posta</label><input type="email" value={yeniPersonel.email} onChange={(e) => setYeniPersonel({...yeniPersonel, email: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-all text-sm"/></div>
                              <div className="col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Şifre</label><input type="text" value={yeniPersonel.password} onChange={(e) => setYeniPersonel({...yeniPersonel, password: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-all text-sm font-mono"/></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                              {ROLLER.map((rol) => (
                                  <button key={rol.id} onClick={() => setYeniPersonel({...yeniPersonel, rol: rol.id})} className={`text-xs p-2 rounded-lg border font-bold transition-all text-left flex flex-col ${yeniPersonel.rol === rol.id ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                                      <span>{rol.label}</span>
                                      <span className="text-[9px] opacity-70 font-normal">{rol.desc}</span>
                                  </button>
                              ))}
                          </div>
                          <button onClick={personelEkle} disabled={yukleniyor} className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-3 rounded-xl shadow-lg mt-4">{yukleniyor ? <RefreshCw size={18} className="animate-spin mx-auto"/> : "PERSONELİ OLUŞTUR"}</button>
                      </div>
                  </div>
              </div>
              {/* Personel Listesi */}
              <div className="xl:col-span-2 space-y-4">
                  {personelListesi.map((p) => {
                      const rolData = ROLLER.find(r => r.id === p.rol) || ROLLER[1];
                      const isPasif = p.durum === 'pasif';
                      return (
                          <div key={p.id} className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-4 transition-all ${isPasif ? 'bg-red-900/10 border-red-900/30 opacity-70 grayscale' : 'bg-[#1E293B]/60 border-white/5'}`}>
                              <div className="flex gap-4 items-center w-full">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white shadow-lg ${isPasif ? 'bg-slate-700' : 'bg-gradient-to-br from-cyan-600 to-blue-600'}`}>{p.ad_soyad?.charAt(0)}</div>
                                  <div>
                                      <h4 className="text-white font-bold text-lg flex items-center gap-2">
                                          {p.ad_soyad}
                                          {isPasif && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">PASİF</span>}
                                          {!p.user_id && <span className="text-[10px] bg-yellow-600 text-black px-2 py-0.5 rounded font-bold">AUTH EKSİK</span>}
                                      </h4>
                                      <p className="text-sm text-slate-400 font-mono">{p.email}</p>
                                      <div className={`text-[10px] px-2 py-0.5 rounded border inline-block mt-1 font-bold uppercase ${rolData.color}`}>{rolData.label}</div>
                                  </div>
                              </div>
                              <div className="flex gap-2 w-full md:w-auto">
                                  <button onClick={() => personelDuzenleAc(p)} className="flex-1 md:flex-none px-4 py-2 bg-slate-700 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"><Edit size={16}/> Düzenle</button>
                                  <button onClick={() => personelSil(p)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"><Trash2 size={16}/></button>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}

      {/* SEKME: MARKALAR */}
      {aktifSekme === 'markalar' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                  <div className="bg-[#1E293B]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl sticky top-6">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3"><Building2 size={20} className="text-purple-400" /> Yeni Marka Tanımla</h3>
                      <div className="space-y-3">
                          <div><label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Marka Adı</label><input type="text" value={yeniKaynak.isim} onChange={(e) => setYeniKaynak({...yeniKaynak, isim: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all font-bold"/></div>
                          <div><label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Kategori</label><div className="grid grid-cols-2 gap-2">{KATEGORILER.map(k => (<button key={k} onClick={() => setYeniKaynak({...yeniKaynak, kategori: k})} className={`text-xs py-2 rounded-lg border font-bold transition-all ${yeniKaynak.kategori === k ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>{k}</button>))}</div></div>
                          <div><label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Web Sitesi (Opsiyonel)</label><input type="text" value={yeniKaynak.web_site} onChange={(e) => setYeniKaynak({...yeniKaynak, web_site: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all text-sm" placeholder="https://..."/></div>
                          <button onClick={kaynakEkle} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded-xl shadow-lg shadow-purple-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"><Plus size={18}/> MARKA EKLE</button>
                      </div>
                  </div>
              </div>
              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kaynaklar.map((k) => (
                      <div key={k.id} className="bg-[#1E293B]/60 p-4 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group flex flex-col justify-between h-32">
                          <div className="flex justify-between items-start"><div><h4 className="text-white font-bold text-lg">{k.isim}</h4><span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">{k.kategori || 'Genel'}</span></div><button onClick={() => kaynakSil(k.id)} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button></div>
                          {k.web_site && (<a href={k.web_site} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-purple-400 flex items-center gap-1 mt-auto transition-colors"><Globe size={12}/> Web Sitesine Git</a>)}
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* SİSTEM AYARLARI */}
      {aktifSekme === 'sistem' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Sistem Konfigürasyonu */}
              <div className="bg-[#1E293B]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Settings size={20} className="text-orange-400" /> Sistem Konfigürasyonu</h3>
                 <div className="space-y-4">
                     <div>
                         <label className="text-xs text-slate-400 block mb-1">KDV Oranı (%)</label>
                         <input type="number" value={systemConfig.kdv} onChange={(e) => setSystemConfig({...systemConfig, kdv: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white font-bold"/>
                     </div>
                     <div>
                         <label className="text-xs text-slate-400 block mb-1">Sabit Dolar Kuru (₺)</label>
                         <input type="number" value={systemConfig.dolar} onChange={(e) => setSystemConfig({...systemConfig, dolar: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white font-bold"/>
                     </div>
                     <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-slate-700">
                         <span className="text-sm font-bold text-slate-300">Bakım Modu</span>
                         <button onClick={() => setSystemConfig({...systemConfig, bakim: systemConfig.bakim === 'true' ? 'false' : 'true'})} className={`w-12 h-6 rounded-full p-1 transition-all ${systemConfig.bakim === 'true' ? 'bg-red-600' : 'bg-slate-600'}`}>
                             <div className={`w-4 h-4 bg-white rounded-full transition-all ${systemConfig.bakim === 'true' ? 'translate-x-6' : ''}`}></div>
                         </button>
                     </div>
                 </div>
              </div>

              {/* Yasal Metinler */}
              <div className="bg-[#1E293B]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2"><FileText size={20} className="text-orange-400" /> Servis Formu Yasal Metni</h3>
                 <textarea value={legalText} onChange={(e) => setLegalText(e.target.value)} className="w-full h-40 bg-[#0F172A] border border-slate-700 rounded-xl p-4 text-sm text-slate-300 outline-none focus:border-orange-500 resize-none font-mono" placeholder="Yasal metinleri buraya giriniz..."></textarea>
              </div>

              {/* Finansal & Veri İşlemleri */}
              <div className="space-y-6">
                  <div className="bg-[#1E293B]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Database size={20} className="text-blue-400" /> Veri Yedekleme</h3>
                      <button onClick={downloadBackup} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"><Download size={20}/> YEDEĞİ İNDİR (JSON)</button>
                  </div>
                  <button onClick={saveSystemConfig} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg">{savingText ? "Kaydediliyor..." : <><Save size={20}/> TÜM AYARLARI KAYDET</>}</button>
              </div>
          </div>
      )}

      {/* YORUMLAR */}
      {aktifSekme === 'yorumlar' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-10">
              {/* İstatistikler */}
              <div className="lg:col-span-1 space-y-6">
                 <div className="bg-[#1E293B]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl text-center">
                     <div className="text-6xl font-black text-white mb-2">{ortalamaPuan}</div>
                     <div className="flex justify-center gap-1 mb-4">{[1,2,3,4,5].map(i => <Star key={i} size={20} className={i <= Math.round(Number(ortalamaPuan)) ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}/>)}</div>
                     <p className="text-slate-400 text-sm">{reviews.length} Değerlendirme</p>
                 </div>
                 
                 <div className="bg-[#1E293B]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl">
                     <h4 className="text-white font-bold mb-4 flex items-center gap-2"><BarChart3 size={16}/> Dağılım</h4>
                     <div className="space-y-3">
                         {starCounts.map((item) => (
                             <div key={item.star} className="flex items-center gap-2 text-xs">
                                 <div className="w-8 font-bold text-slate-400">{item.star} <span className="text-yellow-500">★</span></div>
                                 <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-yellow-500 rounded-full" style={{width: `${item.percent}%`}}></div>
                                 </div>
                                 <div className="w-8 text-right text-slate-500">{item.count}</div>
                             </div>
                         ))}
                     </div>
                 </div>
              </div>

              {/* Yorum Listesi */}
              <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews.length > 0 ? reviews.map((r) => (
                          <div key={r.id} className="bg-[#1E293B]/60 p-5 rounded-2xl border border-white/5 group hover:border-slate-600 transition-all relative">
                              <button onClick={() => deleteReview(r.id)} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><XCircle size={18}/></button>
                              <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-white shadow-inner">{r.customer_name?.charAt(0)}</div>
                                  <div>
                                      <div className="text-white font-bold text-sm">{r.customer_name}</div>
                                      <div className="text-[10px] text-slate-500">{new Date(r.created_at).toLocaleDateString('tr-TR')} • {r.tracking_code}</div>
                                  </div>
                              </div>
                              <div className="flex mb-3">{[...Array(5)].map((_,i)=><Star key={i} size={12} className={i<r.rating?"text-yellow-400 fill-yellow-400":"text-slate-700"}/>)}</div>
                              <p className="text-sm text-slate-300 italic leading-relaxed">"{r.comment}"</p>
                          </div>
                      )) : <div className="col-span-2 text-center text-slate-500 py-20 bg-[#1E293B]/30 rounded-3xl border border-dashed border-slate-800">Henüz yorum yok.</div>}
                  </div>
              </div>
          </div>
      )}

      {/* PERSONEL DÜZENLEME MODALI */}
      {editModalOpen && editingPersonel && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[#1E293B] rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl p-6 relative">
                  <button onClick={() => setEditModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><XCircle size={24}/></button>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><UserCog className="text-blue-500"/> Personel Düzenle</h3>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-slate-400 font-bold ml-1 block mb-1">AD SOYAD</label>
                          <input type="text" value={editingPersonel.ad_soyad} onChange={(e) => setEditingPersonel({...editingPersonel, ad_soyad: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-white"/>
                      </div>

                      <div>
                          <label className="text-xs text-slate-400 font-bold ml-1 block mb-1">ROL & YETKİ</label>
                          <div className="grid grid-cols-2 gap-2">
                              {ROLLER.map((rol) => (
                                  <button key={rol.id} onClick={() => setEditingPersonel({...editingPersonel, rol: rol.id})} className={`text-xs p-2 rounded-lg border font-bold transition-all text-left flex flex-col ${editingPersonel.rol === rol.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                      <span>{rol.label}</span>
                                      <span className="text-[9px] font-normal opacity-70">{rol.desc}</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div>
                          <label className="text-xs text-slate-400 font-bold ml-1 block mb-1">DURUM</label>
                          <div className="flex gap-2">
                              <button onClick={() => setEditingPersonel({...editingPersonel, durum: 'aktif'})} className={`flex-1 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 ${editingPersonel.durum === 'aktif' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><CheckCircle2 size={14}/> AKTİF</button>
                              <button onClick={() => setEditingPersonel({...editingPersonel, durum: 'pasif'})} className={`flex-1 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 ${editingPersonel.durum === 'pasif' ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><Power size={14}/> PASİF</button>
                          </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                          <label className="text-xs text-slate-400 font-bold ml-1 block mb-1 flex items-center gap-1"><Lock size={12}/> ŞİFRE DEĞİŞTİR</label>
                          <input type="text" placeholder="Yeni şifre (Değiştirmek istemiyorsanız boş bırakın)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-white font-mono placeholder:text-slate-600"/>
                          <p className="text-[10px] text-slate-500 mt-1 italic">* En az 6 karakter olmalı.</p>
                      </div>

                      <button onClick={personelGuncelle} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg mt-2">{yukleniyor ? <RefreshCw className="animate-spin mx-auto"/> : "KAYDET & GÜNCELLE"}</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}