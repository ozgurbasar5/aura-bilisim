"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase"; 
import { useParams, useRouter } from "next/navigation"; 
import { 
  ArrowLeft, User, Phone, MapPin, Smartphone, Save, 
  Trash2, Loader2, CheckCircle, ScanBarcode, PenTool, 
  Printer, Building2, Clock, Wrench 
} from "lucide-react";
import Link from "next/link";

export default function TalepDetay() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [talep, setTalep] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [yeniDurum, setYeniDurum] = useState("");
  
  // Kabul İşlemi State'leri (Gümrük Geçişi)
  const [kabulModu, setKabulModu] = useState(false);
  const [dogrulamaVerisi, setDogrulamaVerisi] = useState({
    imei_no: "",
    marka_model: "",
    cihaz_kaynagi: "Son Kullanıcı"
  });

  useEffect(() => {
    const getir = async () => {
      if (!id) return;
      const { data } = await supabase.from('onarim_talepleri').select('*').eq('id', id).single(); 
      if (data) {
        setTalep(data);
        setYeniDurum(data.durum || "beklemede");
        setDogrulamaVerisi({ 
            imei_no: data.imei_no || "", 
            marka_model: data.marka_model,
            cihaz_kaynagi: data.cihaz_kaynagi || "Son Kullanıcı"
        });
      }
      setLoading(false);
    };
    getir();
  }, [id]);

  // --- CİHAZ KABUL VE DOĞRULAMA FONKSİYONU ---
  const serviseKabulEt = async () => {
    if(!dogrulamaVerisi.marka_model) return alert("Usta, model bilgisini boş bırakma!");

    const { error } = await supabase
      .from('onarim_talepleri')
      .update({ 
        durum: 'onarim_isleminde', // Servis listesine düşmesi için durum değişiyor
        marka_model: dogrulamaVerisi.marka_model,
        imei_no: dogrulamaVerisi.imei_no,
        cihaz_kaynagi: dogrulamaVerisi.cihaz_kaynagi
      })
      .eq('id', id);

    if (!error) {
      alert("✅ Cihaz doğrulandı ve Atölye Listesine alındı!");
      router.push("/epanel"); 
    }
  };

  const durumuGuncelle = async () => {
    const { error } = await supabase.from('onarim_talepleri').update({ durum: yeniDurum }).eq('id', id);
    if (!error) { 
        alert("Durum güncellendi usta! ✅"); 
        setTalep({ ...talep, durum: yeniDurum });
        router.refresh(); 
    }
  };

  const talebiSil = async () => {
    if(!confirm("Bu kaydı silmek istediğine emin misin?")) return;
    const { error } = await supabase.from('onarim_talepleri').delete().eq('id', id);
    if (!error) router.push("/epanel"); 
  };

  if (loading) return <div className="p-10 text-cyan-400 flex items-center gap-2"><Loader2 className="animate-spin"/> Yükleniyor...</div>;
  if (!talep) return <div className="p-10 text-red-400 font-bold">Kayıt bulunamadı!</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      {/* ÜST BAŞLIK ALANI */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Link href="/epanel" className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-all shadow-lg border border-slate-700">
                <ArrowLeft size={24} />
            </Link>
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Servis No #{talep.id}</h1>
                <p className="text-slate-400 font-bold">Müşteri: {talep.ad_soyad}</p>
            </div>
        </div>
        
        {/* YAZDIRMA BUTONU */}
        {talep.durum !== 'beklemede' && (
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all border border-slate-700 shadow-xl group">
                <Printer size={20} className="group-hover:text-cyan-400 transition-colors"/> <span>Servis Formu</span>
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL KOLON: BİLGİLER */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E293B]/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 p-8 opacity-5 text-white group-hover:opacity-10 transition-opacity"><User size={120}/></div>
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <User size={14} className="text-cyan-500"/> Müşteri Bilgileri
            </h3>
            <div className="text-3xl font-black text-white mb-2 tracking-tight">{talep.ad_soyad}</div>
            <div className="text-cyan-400 font-mono text-xl flex items-center gap-2 mb-6 tracking-wider">
                <Phone size={20}/> {talep.telefon}
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Building2 size={14}/> {talep.cihaz_kaynagi || "Son Kullanıcı"}
            </div>
          </div>

          <div className="bg-[#1E293B]/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-2xl">
             <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Wrench size={14} className="text-cyan-500"/> Cihaz Kimliği ve Arıza
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800/50">
                    <span className="text-slate-600 text-[10px] block mb-1 font-black uppercase">Fiziksel Model</span>
                    <div className="text-white font-black text-lg">{talep.marka_model}</div>
                </div>
                <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800/50">
                    <span className="text-slate-600 text-[10px] block mb-1 font-black uppercase">IMEI / Seri Numarası</span>
                    <div className="text-cyan-400 font-mono font-black text-lg">{talep.imei_no || "Kayıt Yok"}</div>
                </div>
             </div>
             <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed font-medium relative">
                <span className="text-6xl absolute -top-4 left-2 opacity-5 font-serif text-cyan-400">"</span>
                {talep.sorun_aciklamasi}
             </div>
          </div>
        </div>

        {/* SAĞ KOLON: İŞLEM MERKEZİ */}
        <div className="space-y-6">
          <div className="bg-[#1E293B] p-8 rounded-3xl border border-cyan-500/20 shadow-2xl">
            <h3 className="text-white font-black text-lg mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
                <CheckCircle className="text-cyan-400" size={20}/> Servis Kontrolü
            </h3>

            {/* --- DURUM 1: BEKLEMEDE (GÜMRÜK KONTROLÜ) --- */}
            {talep.durum === 'beklemede' ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {!kabulModu ? (
                   <div className="text-center">
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed font-bold">Cihaz şu an 'Online Talep' havuzunda. Fiziksel teslim alındı mı?</p>
                      <button 
                        onClick={() => setKabulModu(true)} 
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-900/40 transition-all hover:scale-[1.02] active:scale-95 animate-pulse"
                      >
                        <CheckCircle size={24}/> CİHAZI TESLİM AL
                      </button>
                   </div>
                ) : (
                  <div className="space-y-5">
                    <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/20 text-orange-400 text-[10px] font-black text-center uppercase tracking-widest">
                      Kayıt Doğrulama Formu
                    </div>
                    
                    <div>
                      <label className="text-[10px] text-slate-500 font-black uppercase ml-1 mb-2 block">Cihaz Modelini Teyit Et</label>
                      <div className="relative">
                        <PenTool className="absolute left-4 top-3.5 text-slate-600" size={16}/>
                        <input 
                            type="text" 
                            value={dogrulamaVerisi.marka_model} 
                            onChange={(e)=>setDogrulamaVerisi({...dogrulamaVerisi, marka_model: e.target.value})} 
                            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-3.5 pl-12 text-white focus:border-orange-500 outline-none transition-all text-sm font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-black uppercase ml-1 mb-2 block">IMEI / S/N Kaydı</label>
                      <div className="relative">
                        <ScanBarcode className="absolute left-4 top-3.5 text-slate-600" size={16}/>
                        <input 
                            type="text" 
                            placeholder="IMEI veya Seri No" 
                            value={dogrulamaVerisi.imei_no} 
                            onChange={(e)=>setDogrulamaVerisi({...dogrulamaVerisi, imei_no: e.target.value})} 
                            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-3.5 pl-12 text-white focus:border-orange-500 outline-none transition-all text-sm font-mono font-bold"
                        />
                      </div>
                    </div>

                    <button 
                        onClick={serviseKabulEt} 
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-900/30 transition-all hover:scale-[1.02]"
                    >
                      KAYDI ATÖLYEYE GÖNDER
                    </button>
                    <button onClick={() => setKabulModu(false)} className="w-full text-slate-600 text-[10px] font-black uppercase hover:text-white transition-colors">İşlemi İptal Et</button>
                  </div>
                )}
              </div>
            ) : (
              /* --- DURUM 2: SERVİSTE (GÜNCELLEME MODU) --- */
              <div className="space-y-6">
                 <div className="bg-[#0F172A] p-5 rounded-2xl space-y-4 border border-slate-800 shadow-inner">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-slate-500">Mevcut Durum</span>
                      <span className="text-cyan-400 animate-pulse italic">Aktif Onarımda</span>
                    </div>
                    <select 
                        value={yeniDurum} 
                        onChange={(e) => setYeniDurum(e.target.value)} 
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none cursor-pointer font-black text-sm"
                    >
                        <option value="onarim_isleminde">⚙️ Onarım İşleminde</option>
                        <option value="teklif_bekliyor">⏳ Teklif Bekleniyor</option>
                        <option value="parca_bekliyor">🟣 Parça Bekliyor</option>
                        <option value="fiyat_onayi">🟠 Fiyat Onayı Bekliyor</option>
                        <option value="tamamlandi">🟢 Tamamlandı (Hazır)</option>
                        <option value="teslim_edildi">🏁 Müşteriye Teslim Edildi</option>
                        <option value="iptal">🔴 İptal / İade</option>
                    </select>
                 </div>

                 <button 
                    onClick={durumuGuncelle} 
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-cyan-900/40 transition-all hover:scale-[1.02] active:scale-95"
                 >
                    <Save size={22}/> VERİLERİ GÜNCELLE
                 </button>
              </div>
            )}
          </div>
           
          {/* SİLME BUTONU */}
          <button 
            onClick={talebiSil} 
            className="w-full border border-red-500/10 text-red-500/30 hover:text-red-500 hover:bg-red-500/5 font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all text-[10px] uppercase tracking-widest"
          >
            <Trash2 size={16}/> Servis Kaydını Sil
          </button>
        </div>
      </div>
    </div>
  );
}