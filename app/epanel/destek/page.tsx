"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { 
  MessageSquare, User, Phone, Mail, Clock, 
  Trash2, CheckCircle, MessageCircle, AlertCircle 
} from "lucide-react";

export default function DestekYonetim() {
  const [talepler, setTalepler] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  // Verileri Çek
  const talepleriGetir = async () => {
    const { data, error } = await supabase
      .from('aura_jobs')
      .select('*')
      .eq('category', 'Destek Talebi') // Sadece webden gelen destek formlarını al
      .order('created_at', { ascending: false });

    if (data) {
      setTalepler(data);
    }
    setYukleniyor(false);
  };

  useEffect(() => {
    talepleriGetir();
  }, []);

  // Talebi Silme
  const talepSil = async (id: number) => {
    if (!confirm("Bu mesajı silmek istediğine emin misin?")) return;
    await supabase.from('aura_jobs').delete().eq('id', id);
    talepleriGetir();
  };

  // Durum Güncelleme (Okundu/Tamamlandı Yapma)
  const talepKapat = async (id: number) => {
    await supabase.from('aura_jobs').update({ status: 'Tamamlandı' }).eq('id', id);
    talepleriGetir();
  };

  // WhatsApp Linki
  const whatsappGit = (tel: string) => {
    let clean = tel.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = clean.substring(1);
    if (!clean.startsWith('90')) clean = '90' + clean;
    window.open(`https://wa.me/${clean}`, '_blank');
  };

  if (yukleniyor) return <div className="p-10 text-slate-400 text-center">Mesajlar yükleniyor...</div>;

  return (
    <div className="p-6 min-h-screen text-slate-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <MessageSquare className="text-pink-500" size={32} />
          GELEN MESAJLAR
        </h1>
        <div className="bg-pink-500/10 text-pink-400 px-4 py-2 rounded-lg font-bold border border-pink-500/20">
          {talepler.length} Okunmamış Mesaj
        </div>
      </div>

      {talepler.length === 0 ? (
        <div className="text-center py-20 bg-[#151921] rounded-3xl border border-slate-800 border-dashed">
          <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
            <MessageSquare size={32}/>
          </div>
          <h3 className="text-xl font-bold text-white">Gelen Kutusu Boş</h3>
          <p className="text-slate-500">Şu an bekleyen destek talebi yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {talepler.map((talep) => (
            <div key={talep.id} className="bg-[#151921] border border-slate-800 p-6 rounded-2xl hover:border-pink-500/40 transition-all group shadow-lg flex flex-col">
              
              {/* Üst Bilgi */}
              <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                <div>
                  <div className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertCircle size={12}/> {talep.device || "Genel Konu"}
                  </div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User size={18} className="text-slate-500"/> {talep.customer}
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center gap-1">
                  <Clock size={10}/> {new Date(talep.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>

              {/* Mesaj İçeriği */}
              <div className="bg-[#0b0e14] p-4 rounded-xl border border-slate-800/50 mb-6 flex-1">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">"{talep.problem}"</p>
              </div>

              {/* İletişim Bilgileri */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-white/5">
                  <Phone size={14} className="text-blue-400"/> {talep.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-white/5 overflow-hidden">
                  <Mail size={14} className="text-purple-400"/> <span className="truncate">{talep.email || "-"}</span>
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => whatsappGit(talep.phone)}
                  className="flex-1 bg-green-600/10 text-green-400 hover:bg-green-600 hover:text-white border border-green-600/20 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16}/> WhatsApp
                </button>
                
                {talep.email && (
                  <a 
                    href={`mailto:${talep.email}`}
                    className="flex-1 bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-600/20 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Mail size={16}/> Cevapla
                  </a>
                )}

                <button 
                  onClick={() => talepSil(talep.id)}
                  className="p-2.5 bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  title="Sil"
                >
                  <Trash2 size={18}/>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}