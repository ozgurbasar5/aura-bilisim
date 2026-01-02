"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { 
  Settings, Plus, Trash2, Building2, 
  Users, Shield, CheckCircle, XCircle, X, PlusCircle,
  Save, RefreshCw, Globe, Edit2, Lock, UserX, UserCheck,
  Star, MessageSquare, ThumbsUp, Activity, FileText, Download, AlertTriangle, Database
} from "lucide-react";

// Sabitler
const TUM_YETKILER = ['Atölye', 'Başvurular', 'Hızlı Kayıt', 'Mağaza', 'Raporlar', 'Yönetim (Admin)', 'Fırsat Yönetimi'];
const ROLLER = [
    { id: 'admin', label: 'Yönetici', yetkiler: TUM_YETKILER },
    { id: 'teknisyen', label: 'Teknisyen', yetkiler: ['Atölye', 'Hızlı Kayıt'] },
    { id: 'satis', label: 'Satış Temsilcisi', yetkiler: ['Mağaza', 'Başvurular', 'Hızlı Kayıt'] },
    { id: 'stajyer', label: 'Stajyer', yetkiler: ['Atölye'] }
];
const KATEGORILER = ['Telefon', 'Robot Süpürge', 'Bilgisayar', 'Tablet', 'Akıllı Saat', 'Diğer'];

export default function GelismisYonetimPaneli() {
  const [aktifSekme, setAktifSekme] = useState<'personel' | 'markalar' | 'sistem' | 'yorumlar'>('personel');
  const [yukleniyor, setYukleniyor] = useState(false);
  
  // Veri State'leri
  const [kaynaklar, setKaynaklar] = useState<any[]>([]);
  const [personelListesi, setPersonelListesi] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  // Marka Ekleme State
  const [yeniKaynak, setYeniKaynak] = useState({ isim: "", kategori: "Telefon", web_site: "" });
  
  // Personel Ekleme State
  const [yeniPersonel, setYeniPersonel] = useState({
    email: "", password: "", ad: "", rol: "teknisyen", yetkiler: [] as string[]
  });
  
  // Personel Düzenleme
  const [yetkiPopupId, setYetkiPopupId] = useState<string | null>(null);

  // Sistem Ayarları
  const [sistemAyarlari, setSistemAyarlari] = useState({
      bakimModu: false,
      dovizOtomatik: true,
      dovizSabit: 34.50,
      smsBildirim: true
  });
  const [legalText, setLegalText] = useState("");
  const [savingText, setSavingText] = useState(false);

  useEffect(() => { veriGetir(); }, []);

  // --- VERİ ÇEKME ---
  const veriGetir = async () => {
    setYukleniyor(true);
    // Markaları çek
    const { data: kaynakData } = await supabase.from('ayarlar_kaynaklar').select('*').order('isim');
    if (kaynakData) setKaynaklar(kaynakData);

    // Personeli çek
    const { data: personelData } = await supabase.from('personel_izinleri').select('*').order('created_at');
    if (personelData) setPersonelListesi(personelData);

    // Yorumları Çek
    const { data: reviewData } = await supabase.from('aura_reviews').select('*').order('created_at', { ascending: false }).limit(20);
    if (reviewData) setReviews(reviewData);

    // Yasal Metni Çek
    const { data: settingData } = await supabase.from('aura_settings').select('setting_value').eq('setting_key', 'legal_text').single();
    if (settingData) setLegalText(settingData.setting_value);
    
    setYukleniyor(false);
  };

  // --- MARKA İŞLEMLERİ ---
  const kaynakEkle = async () => {
    if (!yeniKaynak.isim) return alert("Marka adı boş olamaz!");
    
    const { error } = await supabase.from('ayarlar_kaynaklar').insert([{
        isim: yeniKaynak.isim,
        kategori: yeniKaynak.kategori,
        web_site: yeniKaynak.web_site
    }]);

    if(error) alert("Hata: " + error.message);
    else {
        setYeniKaynak({ isim: "", kategori: "Telefon", web_site: "" });
        veriGetir();
    }
  };

  const kaynakSil = async (id: string) => {
    if(!confirm("Bu markayı silmek istediğine emin misin?")) return;
    await supabase.from('ayarlar_kaynaklar').delete().eq('id', id);
    veriGetir();
  };

  // --- PERSONEL İŞLEMLERİ ---
  const rolDegis = (rolId: string) => {
      const secilenRol = ROLLER.find(r => r.id === rolId);
      if(secilenRol) {
          setYeniPersonel({ ...yeniPersonel, rol: rolId, yetkiler: secilenRol.yetkiler });
      }
  };

  const yetkiToggle = (yetki: string) => {
    if (yeniPersonel.yetkiler.includes(yetki)) {
      setYeniPersonel({ ...yeniPersonel, yetkiler: yeniPersonel.yetkiler.filter(y => y !== yetki) });
    } else {
      setYeniPersonel({ ...yeniPersonel, yetkiler: [...yeniPersonel.yetkiler, yetki] });
    }
  };

  const personelOlustur = async () => {
    if (!yeniPersonel.email || !yeniPersonel.password) return alert("Email ve Şifre zorunlu!");
    if (yeniPersonel.password.length < 6) return alert("Şifre en az 6 karakter olmalı!");

    setYukleniyor(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: yeniPersonel.email,
        password: yeniPersonel.password,
        options: { data: { full_name: yeniPersonel.ad } }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Kullanıcı oluşturulamadı.");

      const { error: dbError } = await supabase.from('personel_izinleri').insert([{
        email: yeniPersonel.email,
        ad_soyad: yeniPersonel.ad,
        yetkiler: yeniPersonel.yetkiler,
        rol: yeniPersonel.rol,
        durum: 'aktif'
      }]);

      if (dbError) throw dbError;
      
      alert("✅ Personel Başarıyla Oluşturuldu! (Giriş yapabilir)");
      setYeniPersonel({ email: "", password: "", ad: "", rol: "teknisyen", yetkiler: [] });
      veriGetir();

    } catch (err: any) { 
        console.error(err);
        alert("Hata oluştu: " + err.message); 
    }
    setYukleniyor(false);
  };

  const yetkiGuncelle = async (personelId: string, yeniYetkiler: string[]) => {
      await supabase.from('personel_izinleri').update({ yetkiler: yeniYetkiler }).eq('id', personelId);
      veriGetir();
  };

  const personelSil = async (id: string) => {
    if(!confirm("Personeli veritabanından silmek istiyor musun?")) return;
    await supabase.from('personel_izinleri').delete().eq('id', id);
    veriGetir();
  };

  const durumDegistir = async (id: string, mevcutDurum: string) => {
      const yeniDurum = mevcutDurum === 'aktif' ? 'pasif' : 'aktif';
      await supabase.from('personel_izinleri').update({ durum: yeniDurum }).eq('id', id);
      veriGetir();
  };

  // --- SİSTEM AYARLARI ---
  const saveLegalText = async () => {
      setSavingText(true);
      const { error } = await supabase.from('aura_settings').upsert({ 
          setting_key: 'legal_text', 
          setting_value: legalText 
      }, { onConflict: 'setting_key' });
      
      setSavingText(false);
      if(!error) alert("Yasal metin başarıyla güncellendi!");
      else alert("Hata oluştu.");
  };

  const downloadBackup = async () => {
      if(!confirm("Tüm servis kayıtlarını JSON formatında indirmek istiyor musunuz?")) return;
      const { data } = await supabase.from('aura_jobs').select('*');
      if(!data) return;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aura-yedek-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
  };

  const ortalamaPuan = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-6 animate-in fade-in duration-500 text-slate-200">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pt-6">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Settings className="text-cyan-400 animate-spin-slow" size={32} /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">YÖNETİM MERKEZİ</span>
          </h1>
          <div className="flex bg-[#1E293B] p-1 rounded-xl border border-slate-700">
              <button onClick={() => setAktifSekme('personel')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${aktifSekme === 'personel' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Users size={16}/> Personel</button>
              <button onClick={() => setAktifSekme('markalar')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${aktifSekme === 'markalar' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Building2 size={16}/> Markalar</button>
              <button onClick={() => setAktifSekme('sistem')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${aktifSekme === 'sistem' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Settings size={16}/> Sistem</button>
              <button onClick={() => setAktifSekme('yorumlar')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${aktifSekme === 'yorumlar' ? 'bg-yellow-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><Star size={16}/> Yorumlar</button>
          </div>
      </div>

      {/* --- SEKME 1: PERSONEL YÖNETİMİ --- */}
      {aktifSekme === 'personel' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* YENİ PERSONEL FORMU */}
              <div className="xl:col-span-1">
                  <div className="bg-[#1E293B]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl sticky top-6">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                          <PlusCircle size={20} className="text-green-400" /> Yeni Personel Ekle
                      </h3>
                      <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Ad Soyad</label>
                                  <input type="text" value={yeniPersonel.ad} onChange={(e) => setYeniPersonel({...yeniPersonel, ad: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-all text-sm"/>
                              </div>
                              <div className="col-span-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">E-Posta</label>
                                  <input type="email" value={yeniPersonel.email} onChange={(e) => setYeniPersonel({...yeniPersonel, email: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-all text-sm"/>
                              </div>
                              <div className="col-span-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Şifre</label>
                                  <input type="text" value={yeniPersonel.password} onChange={(e) => setYeniPersonel({...yeniPersonel, password: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-all text-sm font-mono"/>
                              </div>
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-2 block">Rol Seçimi (Otomatik Yetki)</label>
                              <div className="grid grid-cols-2 gap-2">
                                  {ROLLER.map((rol) => (
                                      <button key={rol.id} onClick={() => rolDegis(rol.id)} className={`text-xs p-2 rounded-lg border font-bold transition-all text-left ${yeniPersonel.rol === rol.id ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>{rol.label}</button>
                                  ))}
                              </div>
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-2 block">Özel Yetkiler</label>
                              <div className="flex flex-wrap gap-2 bg-[#0F172A] p-3 rounded-xl border border-slate-700">
                                  {TUM_YETKILER.map((y) => (
                                      <button key={y} onClick={() => yetkiToggle(y)} className={`text-[10px] px-2 py-1.5 rounded border transition-all flex items-center gap-1.5 ${yeniPersonel.yetkiler.includes(y) ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'}`}>
                                          {yeniPersonel.yetkiler.includes(y) ? <CheckCircle size={12}/> : <div className="w-3 h-3 rounded-full border border-slate-500"></div>} {y}
                                      </button>
                                  ))}
                              </div>
                          </div>
                          <button onClick={personelOlustur} disabled={yukleniyor} className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-3 rounded-xl shadow-lg shadow-green-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                              {yukleniyor ? <RefreshCw size={18} className="animate-spin"/> : <Users size={18}/>} 
                              {yukleniyor ? "İşleniyor..." : "PERSONELİ OLUŞTUR"}
                          </button>
                      </div>
                  </div>
              </div>

              {/* PERSONEL LİSTESİ */}
              <div className="xl:col-span-2 space-y-4">
                  {personelListesi.map((p) => (
                      <div key={p.id} className={`bg-[#1E293B]/60 backdrop-blur-md p-5 rounded-2xl border transition-all group relative overflow-hidden ${p.durum === 'pasif' ? 'border-red-500/30 opacity-70' : 'border-white/5 hover:border-cyan-500/30'}`}>
                          <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white shadow-lg ${p.durum === 'pasif' ? 'bg-slate-700' : 'bg-gradient-to-br from-cyan-500 to-blue-600'}`}>{p.ad_soyad?.charAt(0).toUpperCase()}</div>
                                  <div>
                                      <h4 className="text-white font-bold text-lg flex items-center gap-2">{p.ad_soyad}{p.durum === 'pasif' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">PASİF</span>}</h4>
                                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5"><span>{p.email}</span><span className="w-1 h-1 rounded-full bg-slate-600"></span><span className="text-cyan-400 capitalize">{p.rol || 'Teknisyen'}</span></div>
                                  </div>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={() => durumDegistir(p.id, p.durum || 'aktif')} className={`p-2 rounded-lg transition-all ${p.durum === 'pasif' ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white'}`}>{p.durum === 'pasif' ? <UserCheck size={16}/> : <UserX size={16}/>}</button>
                                  <button onClick={() => personelSil(p.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                              </div>
                          </div>
                          <div className="bg-[#0F172A]/50 rounded-xl p-3 border border-white/5">
                              <div className="flex justify-between items-center mb-2"><span className="text-[10px] font-bold text-slate-500 uppercase">Aktif Yetkiler</span><button onClick={() => setYetkiPopupId(yetkiPopupId === p.id ? null : p.id)} className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 bg-cyan-900/20 px-2 py-1 rounded transition-colors"><Edit2 size={10}/> Düzenle</button></div>
                              <div className="flex flex-wrap gap-2">
                                  {p.yetkiler?.length > 0 ? p.yetkiler.map((y:string) => (
                                      <span key={y} className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5 shadow-sm"><Shield size={10} className="text-green-500"/> {y}{yetkiPopupId === p.id && (<button onClick={() => yetkiGuncelle(p.id, p.yetkiler.filter((i:string)=>i!==y))} className="hover:text-red-400 ml-1"><X size={10}/></button>)}</span>
                                  )) : <span className="text-xs text-red-400 italic">Yetki yok (Giriş yapamaz)</span>}
                                  {yetkiPopupId === p.id && (<div className="w-full mt-2 pt-2 border-t border-slate-700 animate-in slide-in-from-top-2"><div className="text-[10px] text-slate-500 mb-1">Eklenebilir:</div><div className="flex flex-wrap gap-2">{TUM_YETKILER.filter(ty => !p.yetkiler?.includes(ty)).map(ekle => (<button key={ekle} onClick={() => yetkiGuncelle(p.id, [...(p.yetkiler||[]), ekle])} className="text-[10px] bg-slate-700 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors"><Plus size={10}/> {ekle}</button>))}</div></div>)}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- SEKME 2: MARKA YÖNETİMİ --- */}
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

      {/* --- SEKME 3: SİSTEM AYARLARI --- */}
      {aktifSekme === 'sistem' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* SOL: YASAL METİN DÜZENLEYİCİ */}
              <div className="bg-[#1E293B]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-orange-400" /> Servis Formu Yasal Metni
                 </h3>
                 <p className="text-xs text-slate-400 mb-4">Servis fişlerinin altında çıkan garanti şartlarını buradan düzenleyebilirsiniz.</p>
                 <textarea 
                    value={legalText} 
                    onChange={(e) => setLegalText(e.target.value)} 
                    className="w-full h-40 bg-[#0F172A] border border-slate-700 rounded-xl p-4 text-sm text-slate-300 outline-none focus:border-orange-500 resize-none font-mono"
                    placeholder="Yasal metinleri buraya giriniz..."
                 ></textarea>
                 <button onClick={saveLegalText} className="mt-4 w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                    {savingText ? "Kaydediliyor..." : <><Save size={18}/> METNİ GÜNCELLE</>}
                 </button>
              </div>

              {/* SAĞ: VERİ YEDEKLEME & GÜVENLİK */}
              <div className="bg-[#1E293B]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Database size={20} className="text-blue-400" /> Veri Güvenliği & Yedekleme
                 </h3>
                 <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6 flex items-start gap-3">
                    <AlertTriangle className="text-blue-400 shrink-0" size={20} />
                    <div>
                        <h4 className="text-sm font-bold text-blue-300">Neden Yedek Almalıyım?</h4>
                        <p className="text-xs text-slate-400 mt-1">Sistemdeki tüm servis kayıtlarını, müşteri bilgilerini ve finansal verileri bilgisayarınıza indirerek güvence altına alabilirsiniz.</p>
                    </div>
                 </div>
                 <button onClick={downloadBackup} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                    <Download size={20}/> TÜM VERİLERİ YEDEKLE (JSON)
                 </button>
              </div>
          </div>
      )}

      {/* --- SEKME 4: YORUMLAR --- */}
      {aktifSekme === 'yorumlar' && (
          <div className="bg-[#1E293B]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl animate-in slide-in-from-bottom-10">
              <div className="flex items-center justify-between mb-8">
                  <div><h3 className="text-white text-2xl font-black flex items-center gap-3"><Star className="text-yellow-400 fill-yellow-400" size={28} /> Müşteri Memnuniyeti</h3><p className="text-slate-400 text-sm mt-1">Son değerlendirmeler ve puanlar.</p></div>
                  <div className="flex gap-4">
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center min-w-[120px]"><div className="text-3xl font-black text-white">{ortalamaPuan}</div><div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ORTALAMA</div></div>
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center min-w-[120px]"><div className="text-3xl font-black text-cyan-400">{reviews.length}</div><div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">YORUM</div></div>
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reviews.length > 0 ? reviews.map((r) => (
                      <div key={r.id} className="bg-[#0F172A] p-4 rounded-2xl border border-slate-700/50">
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">{r.customer_name?.charAt(0)}</div><div><div className="text-white font-bold text-sm">{r.customer_name}</div><div className="text-[10px] text-slate-500">{new Date(r.created_at).toLocaleDateString('tr-TR')}</div></div></div>
                              <div className="flex">{[...Array(5)].map((_,i)=><Star key={i} size={10} className={i<r.rating?"text-yellow-400 fill-yellow-400":"text-slate-700"}/>)}</div>
                          </div>
                          <p className="text-sm text-slate-300 italic">"{r.comment}"</p>
                      </div>
                  )) : <div className="col-span-3 text-center text-slate-500 py-10">Henüz yorum yok.</div>}
              </div>
          </div>
      )}

    </div>
  );
}