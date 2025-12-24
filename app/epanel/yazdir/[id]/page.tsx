"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useParams } from "next/navigation";
import { Loader2, Phone, MapPin, Globe, CheckSquare, Square, ShieldCheck, Printer } from "lucide-react";

// --- DİNAMİK KONTROL LİSTELERİ ---
const KONTROL_LISTESI: any = {
  telefon: [
    "Ekran / Dokunmatik", "Kamera Lensleri", "Sıvı Temas Bandı", "Şarj Soketi",
    "Yan Tuşlar", "Mikrofon / Ahize", "Kasa Ezik/Çizik", "Wifi / Şebeke"
  ],
  robot: [
    "Lidar Sensörü", "Batarya Performansı", "Ana Fırça Motoru", "Yan Fırça Modülü",
    "Tekerlek Motorları", "Su Haznesi / Pompa", "Wi-Fi / Haritalama", "Fan Motoru (Emiş)"
  ],
  bilgisayar: [
    "Ekran / Panel Durumu", "Klavye / Touchpad", "USB / Port Kontrolü", "Batarya Sağlığı",
    "SSD / HDD Sağlığı", "Termal Değerler", "Menteşe Durumu", "Fan Sesi / RPM"
  ],
  varsayilan: [
    "Genel Fiziksel Durum", "Açma/Kapama Testi", "Şarj Testi", "Aksesuar Kontrolü",
    "Sıvı Temas Kontrolü", "Vida/Etiket Kontrolü", "Fonksiyon Testi", "Bağlantı Testi"
  ]
};

export default function YazdirSayfasi() {
  const params = useParams();
  const id = params.id;
  const [talep, setTalep] = useState<any>(null);

  useEffect(() => {
    const getir = async () => {
      const { data } = await supabase.from('onarim_talepleri').select('*').eq('id', id).single();
      if (data) {
        setTalep(data);
        // Otomatik yazdırmayı tetikle
        setTimeout(() => { window.print(); }, 800);
      }
    };
    getir();
  }, [id]);

  if (!talep) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-cyan-600" size={50}/></div>;

  // Cihaz tipine göre doğru listeyi seç
  const cihazTipi = talep.cihaz_tipi === "cep telefonu" ? "telefon" : 
                    talep.cihaz_tipi === "robot süpürge" ? "robot" : 
                    talep.cihaz_tipi === "bilgisayar" ? "bilgisayar" : "varsayilan";
  
  const aktifListe = KONTROL_LISTESI[cihazTipi];

  // Rastgele Barkod (Görsel)
  const Barkod = () => (
    <div className="flex items-end gap-[2px] h-8 opacity-80">
      {[...Array(30)].map((_, i) => (
        <div key={i} className="bg-black" style={{ width: Math.random() > 0.5 ? '2px' : '1px', height: '100%' }}></div>
      ))}
    </div>
  );

  return (
    <div className="bg-white text-black w-[210mm] min-h-[297mm] mx-auto p-12 font-sans text-sm relative box-border leading-snug">
      
      {/* --- MANUEL YAZDIRMA BUTONU (Sadece Ekranda Görünür) --- */}
      <div className="fixed top-5 right-5 print:hidden z-50">
        <button 
            onClick={() => window.print()} 
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-full shadow-xl flex items-center gap-2 animate-bounce"
        >
            <Printer size={20}/> YAZDIR / PDF İNDİR
        </button>
      </div>

      {/* --- 1. HEADER --- */}
      <div className="flex justify-between items-start border-b-4 border-cyan-600 pb-6 mb-6">
        <div>
            <div className="text-4xl font-black tracking-tighter text-slate-900 mb-1">AURA<span className="text-cyan-600">BİLİŞİM</span></div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">İleri Seviye Teknoloji Laboratuvarı</div>
            <div className="mt-4 text-[9px] text-slate-500 space-y-1">
                <div className="flex items-center gap-2"><MapPin size={10}/> Teknoloji Mah. Bilişim Cad. No:1 İstanbul</div>
                <div className="flex items-center gap-2"><Phone size={10}/> 0850 123 45 67 &nbsp;|&nbsp; <Globe size={10}/> www.aurabilisim.com</div>
            </div>
        </div>
        <div className="text-right">
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 mb-2">
                <div className="text-[9px] text-slate-500 font-bold uppercase">Servis Takip No</div>
                <div className="text-2xl font-mono font-black text-cyan-700 tracking-widest">#{talep.id.toString().padStart(6, '0')}</div>
            </div>
            <div className="flex justify-end items-center gap-2">
                <Barkod />
                <span className="text-[10px] font-mono">{new Date().toLocaleDateString('tr-TR')}</span>
            </div>
        </div>
      </div>

      {/* --- 2. BİLGİ KARTLARI --- */}
      <div className="grid grid-cols-2 gap-6 mb-6">
         <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-xs uppercase text-slate-700 flex justify-between">
                <span>Müşteri Bilgileri</span>
                <span className="text-slate-400">ID: {talep.telefon.slice(-4)}</span>
            </div>
            <div className="p-4 space-y-2 text-xs">
                <div className="grid grid-cols-3"><span className="text-slate-500 font-bold">Ad Soyad:</span> <span className="col-span-2 font-bold uppercase">{talep.ad_soyad}</span></div>
                <div className="grid grid-cols-3"><span className="text-slate-500 font-bold">Telefon:</span> <span className="col-span-2 font-mono">{talep.telefon}</span></div>
                <div className="grid grid-cols-3"><span className="text-slate-500 font-bold">Adres:</span> <span className="col-span-2 text-[10px] leading-tight">{talep.adres || "Adres belirtilmedi."}</span></div>
            </div>
         </div>
         <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-xs uppercase text-slate-700 flex justify-between">
                <span>Cihaz Kimliği</span>
                <span className="text-cyan-600 font-bold uppercase">{talep.cihaz_tipi}</span>
            </div>
            <div className="p-4 space-y-2 text-xs">
                <div className="grid grid-cols-3"><span className="text-slate-500 font-bold">Marka/Model:</span> <span className="col-span-2 font-bold uppercase">{talep.marka_model}</span></div>
                <div className="grid grid-cols-3"><span className="text-slate-500 font-bold">IMEI / SN:</span> <span className="col-span-2 font-mono">{talep.imei_no || "---"}</span></div>
                <div className="grid grid-cols-3"><span className="text-slate-500 font-bold">Şikayet:</span> <span className="col-span-2 italic text-slate-700">"{talep.sorun_aciklamasi}"</span></div>
            </div>
         </div>
      </div>

      {/* --- 3. DİNAMİK KALİTE KONTROL (GİRİŞ EKSPERTİZİ) --- */}
      <div className="mb-6">
        <h3 className="text-[10px] font-black uppercase text-slate-500 mb-2 border-b border-slate-200 pb-1 flex justify-between">
            <span>Giriş Kalite Kontrol & Ekspertiz</span>
            <span className="text-cyan-600 text-[9px]">Kontrol Tipi: {cihazTipi.toUpperCase()}</span>
        </h3>
        <div className="grid grid-cols-4 gap-2 text-[10px] border border-slate-200 p-3 rounded-lg bg-slate-50/50">
            {aktifListe.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                    <CheckSquare size={12} className="text-slate-400"/> {item}
                </div>
            ))}
        </div>
        {/* TEKNİSYEN NOTU BURADAN KALDIRILDI - MÜŞTERİ GÖREMEZ */}
      </div>

      {/* --- 4. SERVİS RAPORU --- */}
      <div className="mb-6 border border-slate-300 rounded-xl overflow-hidden min-h-[160px]">
         <div className="bg-slate-800 text-white px-4 py-2 text-xs font-bold flex justify-between items-center">
            <span>TEKNİK SERVİS İŞLEM RAPORU</span>
            <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-[9px] uppercase font-black">{talep.durum?.replace('_', ' ')}</span>
         </div>
         <div className="p-5 grid grid-cols-12 gap-8">
            <div className="col-span-7">
                <div className="mb-4">
                    <h4 className="font-bold text-[10px] text-slate-400 uppercase mb-2">Uygulanan Onarım Adımları</h4>
                    <ul className="list-disc list-inside text-xs space-y-1 text-slate-800">
                        {talep.yapilan_islemler && talep.yapilan_islemler.length > 0 
                            ? talep.yapilan_islemler.map((islem:string) => <li key={islem}>{islem}</li>)
                            : <li>Genel arıza tespiti ve test işlemleri.</li>
                        }
                    </ul>
                </div>
                {talep.yapilan_islemler_detay && (
                    <div className="text-[10px] bg-yellow-50 border border-yellow-200 p-2 rounded text-slate-700">
                        <strong>Teknik Açıklama:</strong> {talep.yapilan_islemler_detay}
                    </div>
                )}
            </div>
            
            <div className="col-span-5 border-l border-slate-200 pl-6 flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-[10px] text-slate-400 uppercase mb-2">Teslim Alınanlar</h4>
                    <div className="flex flex-wrap gap-1">
                         {talep.teslim_alinanlar && talep.teslim_alinanlar.length > 0 ? 
                            talep.teslim_alinanlar.map((t:string) => (
                                <span key={t} className="text-[9px] border border-slate-300 px-1.5 py-0.5 rounded bg-white uppercase">{t}</span>
                            )) : <span className="text-[10px]">-</span>
                        }
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-cyan-700 bg-cyan-50 p-2 rounded border border-cyan-100">
                    <ShieldCheck size={20}/>
                    <div className="leading-none">
                        <div className="font-black text-xs">6 AY GARANTİ</div>
                        <div className="text-[8px]">Yedek parça ve işçilik garantilidir.</div>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* --- 5. FİYATLANDIRMA (KDV GİZLENDİ) --- */}
      {talep.fiyat > 0 && (
          <div className="flex justify-end mb-8">
              <div className="w-1/2">
                  <table className="w-full text-xs border-collapse">
                      <tbody>
                          <tr className="bg-slate-100 border-t-2 border-slate-800">
                              <td className="py-3 font-bold text-slate-700 text-right pr-4 text-sm">HİZMET VE PARÇA BEDELİ (TOPLAM)</td>
                              <td className="py-3 font-black text-slate-900 text-right text-lg">{talep.fiyat} ₺</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* --- 6. FOOTER --- */}
      <div className="mt-auto">
          <div className="text-[8px] text-slate-400 text-justify mb-6 border-t border-slate-200 pt-3 space-y-1">
             <p><strong>KVKK AYDINLATMA METNİ:</strong> Tarafınıza ait kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Aura Bilişim tarafından servis hizmetinin verilebilmesi amacıyla işlenmektedir.</p>
             <p><strong>TESLİM ŞARTLARI:</strong> 1. Servis süresi yasal olarak 20 iş günüdür. 2. 90 gün içinde teslim alınmayan cihazlardan firmamız sorumlu değildir. 3. Sıvı temaslı cihazlarda onarım sonrası farklı arızalar çıkabilir, garantisi yoktur. 4. Müşteri, cihazındaki verilerin yedeğini almakla yükümlüdür, veri kaybından servisimiz sorumlu tutulamaz. 5. İşbu form, cihazın teslim alındığını ve yukarıdaki şartların kabul edildiğini belgeler.</p>
          </div>

          <div className="grid grid-cols-2 gap-10">
              <div className="text-center">
                  <div className="text-[10px] font-bold mb-8 text-slate-900">CİHAZI TESLİM EDEN (Müşteri)</div>
                  <div className="text-[9px] mb-1">Ad Soyad / İmza</div>
                  <div className="border-b border-slate-300 border-dashed w-2/3 mx-auto"></div>
                  <div className="text-[9px] font-bold mt-1 uppercase">{talep.ad_soyad}</div>
              </div>
              <div className="text-center">
                  <div className="text-[10px] font-bold mb-8 text-slate-900">CİHAZI TESLİM ALAN (Aura Bilişim)</div>
                  <div className="text-[9px] mb-1">Kaşe / İmza</div>
                  <div className="border-b border-slate-300 border-dashed w-2/3 mx-auto"></div>
                  <div className="text-[9px] font-bold mt-1">Teknik Servis Personeli</div>
              </div>
          </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none; }
        }
      `}</style>
    </div>
  );
}