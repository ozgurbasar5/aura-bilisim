"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase"; 
import { useParams, useRouter } from "next/navigation"; 
import { 
  ArrowLeft, User, Phone, MapPin, Save, Trash2, Loader2, 
  Printer, CheckSquare, PackageOpen, ScanBarcode, 
  Lock, FileText, Banknote, Coins, History, ChevronDown
} from "lucide-react";
import Link from "next/link";

// --- SABİT LİSTELER ---
const AKSESUARLAR: any = {
  telefon: ["Kutu", "Şarj Aleti", "Kılıf", "Sim Kart", "SD Kart", "Fatura"],
  robot: ["Kutu", "Mop Aparatı", "Su Haznesi", "Toz Haznesi", "İstasyon", "Sarf Malzemeler"],
  bilgisayar: ["Orijinal Adaptör", "Çanta", "Mouse", "Klavye", "Harici Disk", "Batarya"],
  varsayilan: ["Kutu", "Güç Kablosu", "Aksesuar", "Garanti Belgesi"]
};

const STANDART_ISLEMLER = [
  "Arızalı elektronik parça değişimi",
  "Mekanik parça değişimi",
  "Yazılım güncellemesi / Yükleme",
  "Sıvı teması onarımı",
  "Genel bakım ve temizlik",
  "Anakart onarımı",
  "Batarya değişimi",
  "Ekran değişimi",
  "Belirtilen hata gözlemlenmedi",
  "Fiziksel hasar tespiti"
];

export default function TalepDetay() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [talep, setTalep] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State
  const [seciliAksesuarlar, setSeciliAksesuarlar] = useState<string[]>([]);
  const [yapilanIslemler, setYapilanIslemler] = useState<string[]>([]); 
  const [ozelNot, setOzelNot] = useState(""); 
  const [islemDetay, setIslemDetay] = useState(""); 
  const [finans, setFinans] = useState({ maliyet: 0, fiyat: 0 });
  const [dogrulama, setDogrulama] = useState({ imei: "", model: "" });
  const [yeniDurum, setYeniDurum] = useState("");

  useEffect(() => {
    const getir = async () => {
      if (!id) return;
      const { data } = await supabase.from('onarim_talepleri').select('*').eq('id', id).single(); 
      if (data) {
        setTalep(data);
        setYeniDurum(data.durum || "beklemede");
        setSeciliAksesuarlar(data.teslim_alinanlar || []);
        setYapilanIslemler(data.yapilan_islemler || []);
        setOzelNot(data.ozel_not || "");
        setIslemDetay(data.yapilan_islemler_detay || ""); 
        setFinans({ maliyet: data.maliyet || 0, fiyat: data.fiyat || 0 }); 
        setDogrulama({ imei: data.imei_no || "", model: data.marka_model || "" });
      }
      setLoading(false);
    };
    getir();
  }, [id]);

  const toggleList = (list: string[], setList: any, item: string) => {
    if (list.includes(item)) setList(list.filter((i) => i !== item));
    else setList([...list, item]);
  };

  // --- KAYDETME ---
  const teslimAl = async () => {
    if(!dogrulama.model) return alert("Model girmeden teslim alamazsın!");
    const { error } = await supabase.from('onarim_talepleri').update({ 
        durum: 'onarim_isleminde',
        teslim_alinanlar: seciliAksesuarlar,
        ozel_not: ozelNot,
        imei_no: dogrulama.imei,
        marka_model: dogrulama.model
      }).eq('id', id);
    if (!error) { alert("Atölyeye Alındı! ✅"); router.push("/epanel"); }
  };

  const guncelle = async () => {
    const { error } = await supabase.from('onarim_talepleri').update({ 
        durum: yeniDurum, 
        ozel_not: ozelNot, 
        yapilan_islemler: yapilanIslemler,
        yapilan_islemler_detay: islemDetay, 
        maliyet: finans.maliyet,            
        fiyat: finans.fiyat                 
      }).eq('id', id);
    if (!error) { alert("Kayıt Başarılı! ✅"); router.refresh(); }
  };

  const talebiSil = async () => {
    if(!confirm("Emin misin?")) return;
    const { error } = await supabase.from('onarim_talepleri').delete().eq('id', id);
    if (!error) router.push("/epanel"); 
  };

  if (loading) return <div className="p-10 text-cyan-400 font-bold text-xl flex items-center gap-3"><Loader2 className="animate-spin" size={30}/> Panel Hazırlanıyor...</div>;
  if (!talep) return <div className="p-10 text-red-400 font-bold">Kayıt bulunamadı!</div>;

  const cihazTipi = talep.cihaz_tipi === "cep telefonu" ? "telefon" : talep.cihaz_tipi === "robot süpürge" ? "robot" : "varsayilan";
  const aksesuarListesi = AKSESUARLAR[cihazTipi] || AKSESUARLAR["varsayilan"];
  const isKabulModu = talep.durum === 'beklemede';

  return (
    <div className="max-w-[1600px] mx-auto pb-24 px-6"> 
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-6">
            <Link href={isKabulModu ? "/epanel/basvurular" : "/epanel"} className="p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 text-white transition-all shadow-xl border border-slate-700">
                <ArrowLeft size={28} />
            </Link>
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                    {isKabulModu ? "Gümrük Kapısı" : `Talep #${talep.id}`}
                    {!isKabulModu && <span className="text-base bg-cyan-900/30 px-4 py-1.5 rounded-lg text-cyan-400 font-bold border border-cyan-500/30 tracking-wide">{talep.marka_model}</span>}
                </h1>
                <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">
                    {isKabulModu ? "Cihaz Kontrol & Teslim Alma" : "Aura Pro Teknik Servis Paneli"}
                </p>
            </div>
        </div>
        {!isKabulModu && (
            <div className="flex gap-4">
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 border border-slate-700 shadow-xl transition-all">
                    <History size={20} className="text-slate-400"/> <span>Loglar</span>
                </button>
                <button 
    onClick={() => window.open(`/epanel/yazdir/${id}`, '_blank')}
    className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-cyan-500 shadow-lg shadow-cyan-900/20 text-sm transition-all"
>
    <Printer size={18}/> <span>Form Yazdır (PDF)</span>
</button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* --- SOL TARAFTAKİ MÜŞTERİ KARTI (4 Kolon) --- */}
        <div className="col-span-12 xl:col-span-3 space-y-6">
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700 shadow-2xl">
                <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={16} className="text-cyan-400"/> Müşteri Bilgileri
                </h3>
                <div className="text-2xl font-black text-white mb-2">{talep.ad_soyad}</div>
                <div className="text-cyan-400 font-mono font-bold text-base flex items-center gap-2 mb-4 bg-cyan-950/30 p-2 rounded-lg border border-cyan-900/50 w-fit"><Phone size={16}/> {talep.telefon}</div>
                <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800 text-slate-400 text-sm font-bold leading-relaxed">{talep.adres || "Adres bilgisi yok."}</div>
            </div>
            
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700 shadow-2xl">
                 <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4">Müşteri Şikayeti</h3>
                 <div className="text-slate-300 text-sm italic font-medium p-4 bg-[#0F172A] rounded-2xl border border-slate-800 leading-relaxed">"{talep.sorun_aciklamasi}"</div>
            </div>

            {!isKabulModu && (
                 <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700 shadow-2xl">
                    <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <PackageOpen size={16} className="text-orange-500"/> Teslim Alınanlar
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {talep.teslim_alinanlar && talep.teslim_alinanlar.length > 0 ? talep.teslim_alinanlar.map((t:string) => (
                            <span key={t} className="text-xs bg-[#0F172A] border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 font-bold uppercase">{t}</span>
                        )) : <span className="text-xs text-slate-500 italic">Aksesuar teslim alınmadı.</span>}
                    </div>
                 </div>
            )}
        </div>

        {/* --- ORTA VE SAĞ ALAN (8 Kolon) --- */}
        <div className="col-span-12 xl:col-span-9">
            
            {/* MOD A: KABUL EKRANI */}
            {isKabulModu ? (
               <div className="bg-[#1E293B] p-10 rounded-3xl border border-slate-700 shadow-2xl">
                  <div className="text-center py-12">
                      <ScanBarcode className="mx-auto text-orange-500 mb-6" size={64}/>
                      <h2 className="text-3xl font-black text-white mb-3">Cihaz Kabul Terminali</h2>
                      <p className="text-slate-400 mb-8 text-lg">Sol taraftaki müşteri bilgilerini kontrol edip, aksesuar ve fiziksel durum girişini yapın.</p>
                      
                      {/* Kabul Butonu */}
                      <div className="max-w-md mx-auto space-y-4 text-left">
                          <div>
                            <label className="text-xs font-black text-slate-500 uppercase ml-1 mb-2 block">Cihaz Modeli</label>
                            <input type="text" value={dogrulama.model} onChange={(e)=>setDogrulama({...dogrulama, model: e.target.value})} className="w-full p-4 bg-[#0F172A] border border-slate-700 rounded-xl text-white font-bold outline-none focus:border-orange-500 transition-all"/>
                          </div>
                          <button onClick={teslimAl} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-900/40 text-lg transition-all active:scale-95">
                             TESLİM AL VE KAYDET
                          </button>
                      </div>
                  </div>
               </div>
            ) : (
               /* --- MOD B: FULL TEKNİK PANEL --- */
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                  
                  {/* SOL: FİNANS VE GİZLİ NOTLAR */}
                  <div className="bg-[#1E293B] p-8 rounded-3xl border border-slate-700 shadow-2xl flex flex-col gap-8">
                      
                      {/* Özel Not (Büyütüldü) */}
                      <div className="flex-1">
                          <h3 className="text-red-400 font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-widest">
                            <Lock size={16}/> Özel Teknisyen Notu (Gizli)
                          </h3>
                          <textarea 
                            className="w-full h-48 bg-[#0F172A] border border-slate-700 rounded-2xl p-5 text-white focus:border-red-500 outline-none text-sm leading-relaxed resize-none shadow-inner font-medium"
                            value={ozelNot}
                            onChange={(e) => setOzelNot(e.target.value)}
                            placeholder="Müşteriye söylenmeyecek, teknik ekibin bilmesi gereken notlar..."
                          ></textarea>
                      </div>

                      {/* Finansal Bilgiler (Kutular Büyütüldü) */}
                      <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800">
                          <h3 className="text-slate-500 font-black text-xs mb-4 uppercase flex items-center gap-2">
                             <Banknote size={16} className="text-green-500"/> Maliyet & Ücretlendirme
                          </h3>
                          <div className="grid grid-cols-2 gap-6">
                              <div>
                                  <label className="text-xs text-slate-500 font-bold block mb-2 uppercase">Parça Maliyeti</label>
                                  <div className="relative">
                                      <Coins className="absolute left-4 top-3.5 text-slate-600" size={18}/>
                                      <input 
                                        type="number" 
                                        value={finans.maliyet}
                                        onChange={(e) => setFinans({...finans, maliyet: parseFloat(e.target.value)})}
                                        className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-12 text-white text-sm font-bold focus:border-green-500 outline-none"
                                      />
                                  </div>
                              </div>
                              <div>
                                  <label className="text-xs text-slate-500 font-bold block mb-2 uppercase">Müşteri Fiyatı</label>
                                  <div className="relative">
                                      <Banknote className="absolute left-4 top-3.5 text-slate-600" size={18}/>
                                      <input 
                                        type="number" 
                                        value={finans.fiyat}
                                        onChange={(e) => setFinans({...finans, fiyat: parseFloat(e.target.value)})}
                                        className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-12 text-green-400 text-sm font-black focus:border-green-500 outline-none"
                                      />
                                  </div>
                              </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 font-medium text-right">
                             Tahmini Kâr: <span className="text-green-400 font-black text-lg ml-2">{(finans.fiyat - finans.maliyet).toLocaleString('tr-TR')} ₺</span>
                          </div>
                      </div>
                  </div>

                  {/* SAĞ: YAPILAN İŞLEMLER VE RAPOR */}
                  <div className="bg-[#1E293B] p-8 rounded-3xl border border-cyan-500/20 shadow-2xl flex flex-col gap-6">
                      
                      {/* Checkbox Listesi */}
                      <div className="flex-1">
                          <h3 className="text-white font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-widest">
                            <FileText size={16} className="text-cyan-400"/> Yapılan İşlemler (Form)
                          </h3>
                          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                              {STANDART_ISLEMLER.map((islem) => (
                                 <label key={islem} className={`cursor-pointer flex items-center gap-3 p-4 rounded-xl border transition-all ${yapilanIslemler.includes(islem) ? 'bg-cyan-900/20 border-cyan-500/50 text-white' : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${yapilanIslemler.includes(islem) ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600'}`}>
                                        {yapilanIslemler.includes(islem) && <CheckSquare size={14} className="text-white"/>}
                                    </div>
                                    <input type="checkbox" className="hidden" onChange={() => toggleList(yapilanIslemler, setYapilanIslemler, islem)} checked={yapilanIslemler.includes(islem)} />
                                    <span className="text-sm font-bold">{islem}</span>
                                 </label>
                              ))}
                          </div>
                      </div>

                      {/* YENİ: Detaylı İşlem Açıklaması (Text Box Büyütüldü) */}
                      <div>
                          <label className="text-xs text-slate-400 font-bold mb-3 block uppercase tracking-wide">Diğer İşlemler / Detaylı Rapor</label>
                          <textarea 
                             value={islemDetay}
                             onChange={(e) => setIslemDetay(e.target.value)}
                             placeholder="Örn: Anakart üzerindeki mosfet değiştirildi, termal macun yenilendi..."
                             className="w-full h-32 bg-[#0F172A] border border-slate-700 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none text-sm font-medium resize-none shadow-inner"
                          ></textarea>
                      </div>
                      
                      {/* Alt Bar: Durum ve Kaydet */}
                      <div className="pt-6 border-t border-slate-700/50 flex flex-col gap-4">
                         {/* DROPDOWN FIX BURADA */}
                         <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-slate-500 pointer-events-none">Durum</div>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18}/>
                            <select 
                                value={yeniDurum} 
                                onChange={(e) => setYeniDurum(e.target.value)} 
                                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-4 pl-16 pr-10 text-white text-sm font-bold outline-none cursor-pointer appearance-none hover:border-cyan-500 transition-colors"
                            >
                                <option className="bg-[#0F172A] text-white" value="onarim_isleminde">İşlemde</option>
                                <option className="bg-[#0F172A] text-white" value="teklif_bekliyor">Teklif Bekliyor</option>
                                <option className="bg-[#0F172A] text-white" value="parca_bekliyor">Parça Bekliyor</option>
                                <option className="bg-[#0F172A] text-white" value="fiyat_onayi">Fiyat Onayı</option>
                                <option className="bg-[#0F172A] text-white" value="tamamlandi">Tamamlandı</option>
                                <option className="bg-[#0F172A] text-white" value="teslim_edildi">Teslim Edildi</option>
                                <option className="bg-[#0F172A] text-white" value="iptal">İptal</option>
                            </select>
                         </div>

                         <button onClick={guncelle} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-cyan-900/40 transition-all active:scale-95 text-sm tracking-widest uppercase">
                            <Save size={18}/> KAYDET VE GÜNCELLE
                         </button>
                      </div>
                  </div>

               </div>
            )}
        </div>
      </div>
    </div>
  );
}