"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { buildAuraJobInsertPayload } from "@/utils/buildAuraJobInsertPayload";
import {
  PackagePlus,
  Save,
  User,
  Cpu,
  Loader2,
  ArrowLeft,
  Hash,
  Wallet,
  Wrench,
  LifeBuoy,
  Building2,
} from "lucide-react";

const COUNTER_EVENT = "aura-epanel-refresh-counters";

export default function HizliKayit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    email: "",
    serial_no: "",
    device: "",
    category: "Cep Telefonu",
    fault: "",
    password: "",
    price: "",
    cost: "",
    notes: "",
    customer_type: "Son Kullanıcı" as "Son Kullanıcı" | "Bayi",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer?.trim() || !formData.device?.trim()) {
      alert("Lütfen Müşteri Adı ve Cihaz Modelini giriniz.");
      return;
    }

    setLoading(true);

    const newTrackingCode = `SRV-${Math.floor(10000 + Math.random() * 90000)}`;

    const payload = buildAuraJobInsertPayload({
      customer: formData.customer.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      serial_no: formData.serial_no.trim(),
      device: formData.device.trim(),
      category: formData.category,
      issue: formData.fault.trim(),
      password: formData.password,
      technician_note: formData.notes.trim(),
      private_note: "|||[]",
      status: "Bekliyor",
      price: formData.price,
      cost: Number(formData.cost) || 0,
      tracking_code: newTrackingCode,
      payment_status: "unpaid",
      customer_type: formData.customer_type,
    });

    const { data, error } = await supabase
      .from("aura_jobs")
      .insert([payload])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase Hatası:", error);
      alert(`Kayıt oluşturulurken hata: ${error.message}`);
      setLoading(false);
      return;
    }

    const jobId = data?.id;
    if (jobId != null) {
      const { data: auth } = await supabase.auth.getUser();
      const { error: tlErr } = await supabase.from("aura_timeline").insert([
        {
          job_id: String(jobId),
          action_type: "Hızlı Kayıt",
          description: `${newTrackingCode} — ${formData.device} (komuta merkezi)`,
          created_by: auth.user?.email ?? "epanel",
          created_at: new Date().toISOString(),
        },
      ]);
      if (tlErr) console.warn("Zaman çizelgesi:", tlErr.message);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(COUNTER_EVENT));
    }

    setLoading(false);
    const goDetail = confirm(
      `Kayıt oluşturuldu.\nTakip: ${newTrackingCode}\n\nServis kartını açmak için Tamam, listeye dönmek için İptal.`
    );
    if (goDetail && jobId != null) {
      router.push(`/epanel/atolye/${jobId}`);
    } else {
      router.push("/epanel/atolye");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-slate-200 pb-20 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-xl bg-[#0f1219] border border-slate-800 text-[11px] text-slate-400">
        <span className="font-bold text-cyan-500 uppercase tracking-wider">ERP akışı:</span>
        <Link href="/epanel/atolye" className="text-cyan-400 hover:underline flex items-center gap-1">
          <Wrench size={12} /> Atölye
        </Link>
        <span className="text-slate-600">|</span>
        <Link href="/epanel/finans" className="text-emerald-400 hover:underline flex items-center gap-1">
          <Wallet size={12} /> Finans
        </Link>
        <span className="text-slate-600">|</span>
        <Link href="/epanel/destek" className="text-pink-400 hover:underline flex items-center gap-1">
          <LifeBuoy size={12} /> Destek
        </Link>
      </div>

      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-slate-500 hover:text-white transition-colors text-sm font-bold"
      >
        <ArrowLeft size={16} /> Geri Dön
      </button>

      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
          <PackagePlus size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">YENİ SERVİS KAYDI</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Atölye + kasa ile uyumlu tam şema kayıt
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#151a25] border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <User size={16} className="text-cyan-500" /> Müşteri &amp; Cihaz
          </h3>

          <div className="flex bg-black/30 p-1 rounded-lg border border-slate-800 mb-2">
            {(["Son Kullanıcı", "Bayi"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, customer_type: t }))}
                className={`flex-1 text-[11px] py-2 rounded font-bold transition-all uppercase ${
                  formData.customer_type === t
                    ? "bg-cyan-600 text-white shadow"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "Bayi" ? (
                  <span className="inline-flex items-center justify-center gap-1">
                    <Building2 size={12} /> Bayi
                  </span>
                ) : (
                  t
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">
                Müşteri Adı Soyadı {formData.customer_type === "Bayi" ? "(veya bayi ünvanı)" : ""}
              </label>
              <input
                type="text"
                required
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                placeholder="Örn: Ahmet Yılmaz"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Telefon</label>
              <input
                type="text"
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                placeholder="05XX..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">E-posta (opsiyonel)</label>
              <input
                type="email"
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                placeholder="musteri@..."
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                <Hash size={12} /> IMEI / Seri No (opsiyonel)
              </label>
              <input
                type="text"
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white font-mono text-sm focus:border-cyan-500 outline-none transition-colors"
                placeholder="Arama ve garanti için"
                value={formData.serial_no}
                onChange={(e) => setFormData({ ...formData, serial_no: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Cihaz Modeli</label>
              <input
                type="text"
                required
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                placeholder="Örn: iPhone 11, Roborock S5..."
                value={formData.device}
                onChange={(e) => setFormData({ ...formData, device: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Kategori</label>
              <select
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Cep Telefonu</option>
                <option>Robot Süpürge</option>
                <option>Bilgisayar</option>
                <option>Tablet</option>
                <option>Akıllı Saat</option>
                <option>Oyun Konsolu</option>
                <option>Diğer</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#151a25] border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Cpu size={16} className="text-purple-500" /> Teknik &amp; Maliyet
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Arıza / Şikayet</label>
            <input
              type="text"
              className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none transition-colors"
              placeholder="Örn: Ekran kırık, şarj almıyor..."
              value={formData.fault}
              onChange={(e) => setFormData({ ...formData, fault: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Tahmini Fiyat (TL)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-emerald-400 font-bold focus:border-emerald-500 outline-none transition-colors"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Parça / işçilik maliyeti (TL)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-amber-400 font-bold focus:border-amber-500 outline-none transition-colors"
                placeholder="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Ekran kilidi / parola</label>
              <input
                type="text"
                className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none transition-colors"
                placeholder="Yok veya desen"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Teknisyen notu</label>
            <textarea
              rows={3}
              className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-slate-300 focus:border-purple-500 outline-none transition-colors resize-none"
              placeholder="Kasa çizik, sıvı teması şüphesi..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-cyan-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? "SİSTEME İŞLENİYOR..." : "KAYDI OLUŞTUR (ATÖLYE + ZAMAN ÇİZELGESİ)"}
        </button>
      </form>
    </div>
  );
}
