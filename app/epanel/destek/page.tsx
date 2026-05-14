"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/lib/supabase";
import { 
  MessageSquare, User, Phone, Mail, Clock, 
  Trash2, MessageCircle, AlertCircle, RefreshCw
} from "lucide-react";

const EPANEL_COUNTER_EVENT = "aura-epanel-refresh-counters";

function refreshEpanelCounters() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EPANEL_COUNTER_EVENT));
}

export default function DestekYonetim() {
  const [talepler, setTalepler] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const talepleriGetir = async () => {
    const { data } = await supabase
      .from('destek_talepleri')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setTalepler(data);
    setYukleniyor(false);
  };

  useEffect(() => {
    talepleriGetir();
  }, []);

  const durumGuncelle = async (id: number, yeniDurum: string) => {
    const { error } = await supabase.from('destek_talepleri').update({ durum: yeniDurum }).eq('id', id);
    if (!error) {
      setTalepler((prev) => prev.map((t) => (t.id === id ? { ...t, durum: yeniDurum } : t)));
      refreshEpanelCounters();
    }
  };

  const talepSil = async (id: number) => {
    if (!confirm("Bu mesajı silmek istediğine emin misin?")) return;
    await supabase.from('destek_talepleri').delete().eq('id', id);
    await talepleriGetir();
    refreshEpanelCounters();
  };

  // WhatsApp Linki
  const whatsappGit = (tel: string) => {
    if(!tel) return;
    let clean = tel.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = clean.substring(1);
    if (!clean.startsWith('90')) clean = '90' + clean;
    window.open(`https://wa.me/${clean}`, '_blank');
  };

  const filtreliTalepler = useMemo(() => {
    if (statusFilter === "all") return talepler;
    return talepler.filter((t) => (t.durum || "Bekliyor") === statusFilter);
  }, [talepler, statusFilter]);

  const durumRenk = (d: string | undefined) => {
    const v = d || "Bekliyor";
    if (v === "Bekliyor") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    if (v === "İnceleniyor") return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (v === "Çözüldü") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    return "text-slate-400 bg-slate-500/10 border-slate-500/20";
  };

  if (yukleniyor) return <div className="p-10 text-slate-400 text-center animate-pulse">Mesajlar yükleniyor...</div>;

  return (
    <div className="p-6 min-h-screen text-slate-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <MessageSquare className="text-pink-500" size={32} />
          WEB SİTESİ MESAJLARI
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
            {["all", "Bekliyor", "İnceleniyor", "Çözüldü"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-colors ${
                  statusFilter === st
                    ? "bg-pink-600 border-pink-500 text-white"
                    : "bg-[#151921] border-slate-700 text-slate-400 hover:border-slate-500"
                }`}
              >
                {st === "all" ? "Tümü" : st}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => { setYukleniyor(true); void talepleriGetir(); }}
            className="p-2.5 bg-[#151921] border border-slate-700 rounded-xl text-slate-400 hover:text-pink-400 transition-colors"
            title="Yenile"
          >
            <RefreshCw size={18} />
          </button>
          <div className="bg-pink-500/10 text-pink-400 px-4 py-2 rounded-lg font-bold border border-pink-500/20">
            {filtreliTalepler.length} / {talepler.length}
          </div>
        </div>
      </div>

      {talepler.length === 0 ? (
        <div className="text-center py-20 bg-[#151921] rounded-3xl border border-slate-800 border-dashed">
          <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
            <MessageSquare size={32}/>
          </div>
          <h3 className="text-xl font-bold text-white">Gelen Kutusu Boş</h3>
          <p className="text-slate-500">Web sitesinden henüz bir form doldurulmadı.</p>
        </div>
      ) : (
        <>
          {filtreliTalepler.length === 0 ? (
            <div className="text-center py-16 bg-[#151921] rounded-3xl border border-slate-800 border-dashed">
              <p className="text-slate-400 text-sm">Bu filtreye uygun talep yok. Farklı bir durum seçin veya &quot;Tümü&quot;ne dönün.</p>
            </div>
          ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtreliTalepler.map((talep) => (
            <div key={talep.id} className="bg-[#151921] border border-slate-800 p-6 rounded-2xl hover:border-pink-500/40 transition-all group shadow-lg flex flex-col">
              
              {/* Üst Bilgi */}
              <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                <div>
                  <div className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertCircle size={12}/> {talep.konu || "Genel Konu"}
                  </div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User size={18} className="text-slate-500"/> {talep.ad_soyad}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${durumRenk(talep.durum)}`}>{talep.durum || "Bekliyor"}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center gap-1">
                    <Clock size={10}/> {new Date(talep.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              {/* Mesaj İçeriği */}
              <div className="bg-[#0b0e14] p-4 rounded-xl border border-slate-800/50 mb-6 flex-1">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">"{talep.mesaj}"</p>
              </div>

              {/* İletişim Bilgileri */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-white/5">
                  <Phone size={14} className="text-blue-400"/> {talep.telefon}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-white/5 overflow-hidden">
                  <Mail size={14} className="text-purple-400"/> <span className="truncate">{talep.email || "-"}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 p-2 bg-[#0b0e14] rounded-xl border border-slate-800/50">
                <span className="text-[10px] text-slate-500 font-bold uppercase w-full sm:w-auto sm:mr-2 flex items-center">Durum</span>
                {(["Bekliyor", "İnceleniyor", "Çözüldü"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => void durumGuncelle(talep.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                      (talep.durum || "Bekliyor") === st
                        ? durumRenk(st) + " ring-1 ring-white/10"
                        : "border-transparent text-slate-500 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => whatsappGit(talep.telefon)}
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
        </>
      )}
    </div>
  );
}