"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { 
  Settings, Plus, Trash2, Building2, 
  Users, Shield, CheckCircle, XCircle, X, PlusCircle, Activity
} from "lucide-react";

// Tüm olası yetkilerimiz sabit
const TUM_YETKILER = ['Atölye', 'Başvurular', 'Hızlı Kayıt', 'Yönetim (Admin)'];

export default function YonetimPaneli() {
  const [kaynaklar, setKaynaklar] = useState<any[]>([]);
  const [personelListesi, setPersonelListesi] = useState<any[]>([]);
  const [yeniKaynak, setYeniKaynak] = useState("");
  const [loading, setLoading] = useState(true);

  // Hangi personelin "Ekleme (+) Menüsü" açık?
  const [eklemeAcikID, setEklemeAcikID] = useState<string | null>(null);

  const [yeniPersonel, setYeniPersonel] = useState({
    email: "",
    password: "",
    ad: "",
    yetkiler: [] as string[]
  });

  useEffect(() => {
    veriGetir();
  }, []);

  const veriGetir = async () => {
    const { data: kaynakData } = await supabase.from('ayarlar_kaynaklar').select('*').order('isim');
    const { data: personelData } = await supabase.from('personel_izinleri').select('*').order('created_at');
    
    if (kaynakData) setKaynaklar(kaynakData);
    if (personelData) setPersonelListesi(personelData);
    setLoading(false);
  };

  const kaynakEkle = async () => {
    if (!yeniKaynak) return;
    await supabase.from('ayarlar_kaynaklar').insert([{ isim: yeniKaynak }]);
    setYeniKaynak("");
    veriGetir();
  };

  const kaynakSil = async (id: string) => {
    if(!confirm("Silmek istediğine emin misin?")) return;
    await supabase.from('ayarlar_kaynaklar').delete().eq('id', id);
    veriGetir();
  };

  const yetkiSec = (yetki: string) => {
    if (yeniPersonel.yetkiler.includes(yetki)) {
      setYeniPersonel({ ...yeniPersonel, yetkiler: yeniPersonel.yetkiler.filter(y => y !== yetki) });
    } else {
      setYeniPersonel({ ...yeniPersonel, yetkiler: [...yeniPersonel.yetkiler, yetki] });
    }
  };

  const yetkiKaldir = async (personelId: string, yetkiyiSil: string) => {
    if (!confirm(`"${yetkiyiSil}" yetkisini silmek istiyor musun?`)) return;
    const { data: personel } = await supabase.from('personel_izinleri').select('yetkiler').eq('id', personelId).single();
    if (!personel) return;
    const yeniYetkiler = personel.yetkiler.filter((y: string) => y !== yetkiyiSil);
    await supabase.from('personel_izinleri').update({ yetkiler: yeniYetkiler }).eq('id', personelId);
    veriGetir();
  };

  const yetkiEkle = async (personelId: string, yeniYetki: string) => {
    const { data: personel } = await supabase.from('personel_izinleri').select('yetkiler').eq('id', personelId).single();
    if (!personel) return;
    if (personel.yetkiler.includes(yeniYetki)) return;
    const guncelYetkiler = [...personel.yetkiler, yeniYetki];
    await supabase.from('personel_izinleri').update({ yetkiler: guncelYetkiler }).eq('id', personelId);
    setEklemeAcikID(null); 
    veriGetir();
  };

  const personelOlustur = async () => {
    if (!yeniPersonel.email || !yeniPersonel.password) return alert("Email ve Şifre şart usta!");
    if (yeniPersonel.password.length < 6) return alert("Şifre en az 6 karakter olmalı!");

    const SUPABASE_URL = "https://cmkjewcpqohkhnfpvoqw.supabase.co";
    const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2pld2NwcW9oa2huZnB2b3F3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjM0NDYwMiwiZXhwIjoyMDgxOTIwNjAyfQ.AgQ8Vr4jDZfEjaym76Rkj4H1N2R6fSVMy07zLmw2iyI";

    try {
      const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

      const { error } = await supabaseAdmin.auth.admin.createUser({
        email: yeniPersonel.email,
        password: yeniPersonel.password,
        email_confirm: true
      });

      if (error) { alert("Hata: " + error.message); return; }

      await supabase.from('personel_izinleri').insert([{
        email: yeniPersonel.email,
        ad_soyad: yeniPersonel.ad,
        yetkiler: yeniPersonel.yetkiler
      }]);
      
      alert("✅ Personel Eklendi!");
      setYeniPersonel({ email: "", password: "", ad: "", yetkiler: [] });
      veriGetir();

    } catch (err: any) { alert("Hata: " + err.message); }
  };

  const personelSil = async (id: string) => {
    if(!confirm("Personeli silmek istiyor musun?")) return;
    await supabase.from('personel_izinleri').delete().eq('id', id);
    veriGetir();
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
        <Settings className="text-cyan-400" size={32} /> Sistem Yönetim Merkezi
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* SOL: FİRMA KAYNAKLARI */}
        <div className="bg-[#1E293B]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl h-fit">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <Building2 size={20} className="text-cyan-400" /> Cihaz Kaynakları / Markalar
          </h3>
          <div className="flex gap-2 mb-6">
            <input 
              type="text" placeholder="Yeni Marka / Firma Ekle" value={yeniKaynak} onChange={(e) => setYeniKaynak(e.target.value)}
              className="flex-1 bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-all font-bold"
            />
            <button onClick={kaynakEkle} className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20"><Plus size={24} /></button>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {kaynaklar.map((k) => (
                <div key={k.id} className="flex items-center justify-between bg-[#0F172A]/50 p-4 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                  <span className="text-slate-200 font-medium group-hover:text-white transition-colors">{k.isim}</span>
                  <button onClick={() => kaynakSil(k.id)} className="text-slate-500 hover:text-red-500 transition-colors bg-slate-800 p-2 rounded-lg hover:bg-red-500/10"><Trash2 size={16} /></button>
                </div>
              ))}
          </div>
        </div>

        {/* SAĞ: PERSONEL YÖNETİMİ */}
        <div className="bg-[#1E293B]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <Shield size={20} className="text-green-400" /> Personel & Yetki Yönetimi
          </h3>

          {/* EKLEME FORMU */}
          <div className="bg-[#0F172A]/50 p-6 rounded-2xl border border-white/5 mb-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Ad Soyad" value={yeniPersonel.ad} onChange={(e) => setYeniPersonel({...yeniPersonel, ad: e.target.value})} className="bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-green-500 transition-all text-sm"/>
                <input type="email" placeholder="E-Mail" value={yeniPersonel.email} onChange={(e) => setYeniPersonel({...yeniPersonel, email: e.target.value})} className="bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-green-500 transition-all text-sm"/>
                <input type="text" placeholder="Şifre (Min 6)" value={yeniPersonel.password} onChange={(e) => setYeniPersonel({...yeniPersonel, password: e.target.value})} className="col-span-2 w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-green-500 transition-all text-sm font-mono"/>
              </div>
              <div className="mb-4">
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-2 block">Başlangıç Yetkileri</label>
                <div className="flex flex-wrap gap-2">
                    {TUM_YETKILER.map((y) => (
                        <button key={y} onClick={() => yetkiSec(y)} className={`text-xs px-3 py-2 rounded-lg border font-bold transition-all flex items-center gap-2 ${yeniPersonel.yetkiler.includes(y) ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-800'}`}>
                            {yeniPersonel.yetkiler.includes(y) ? <CheckCircle size={14}/> : <XCircle size={14}/>} {y}
                        </button>
                    ))}
                </div>
              </div>
              <button onClick={personelOlustur} className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-black py-3 rounded-xl shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"><Users size={18}/> PERSONELİ EKLE</button>
          </div>

          {/* LİSTE */}
          <div className="space-y-3">
              <h4 className="text-[10px] text-slate-500 font-bold uppercase mb-2">Kayıtlı Personeller</h4>
              {personelListesi.map((p) => (
                <div key={p.id} className="bg-[#0F172A]/50 p-4 rounded-2xl border border-white/5 flex flex-col gap-3 group hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-slate-300">{p.ad_soyad?.charAt(0)}</div>
                            <div>
                                <div className="text-white font-bold text-sm flex items-center gap-2">{p.ad_soyad}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{p.email}</div>
                            </div>
                        </div>
                        <button onClick={() => personelSil(p.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                    </div>

                    {/* YETKİLER */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                        {p.yetkiler?.map((y:string) => (
                            <span key={y} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 hover:border-red-500/50 transition-colors group/yetki">
                                {y}
                                <button onClick={() => yetkiKaldir(p.id, y)} className="text-slate-500 hover:text-red-400 transition-colors"><X size={12} /></button>
                            </span>
                        ))}

                        {/* + BUTONU */}
                        <div className="relative">
                            <button 
                                onClick={() => setEklemeAcikID(eklemeAcikID === p.id ? null : p.id)}
                                className="text-green-500 hover:text-green-400 transition-colors p-1 bg-green-500/10 rounded-lg border border-green-500/20"
                                title="Yetki Ekle"
                            >
                                <PlusCircle size={14} />
                            </button>

                            {/* POPUP MENU */}
                            {eklemeAcikID === p.id && (
                                <div className="absolute top-8 left-0 z-50 bg-[#1E293B] border border-slate-600 rounded-xl p-2 w-48 shadow-2xl flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="text-[9px] text-slate-500 font-bold uppercase px-2 mb-1">Eklenebilir Yetkiler</div>
                                    {TUM_YETKILER.filter(y => !p.yetkiler.includes(y)).length > 0 ? (
                                        TUM_YETKILER.filter(y => !p.yetkiler.includes(y)).map(eksikYetki => (
                                            <button 
                                                key={eksikYetki}
                                                onClick={() => yetkiEkle(p.id, eksikYetki)}
                                                className="text-left text-[10px] text-white hover:bg-green-600 hover:text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <Plus size={10}/> {eksikYetki}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-[10px] text-slate-500 px-2 py-1">Tüm yetkiler tanımlı.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}