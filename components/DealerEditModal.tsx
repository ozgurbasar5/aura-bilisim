"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { X, Save, Lock, Building2, User, Phone, CheckCircle2 } from "lucide-react";

interface DealerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealer: any; // Tip güvenliği için interface tanımlanabilir ama şimdilik any
  technicians: any[];
  onUpdate: () => void;
}

export default function DealerEditModal({ isOpen, onClose, dealer, technicians, onUpdate }: DealerEditModalProps) {
  const [formData, setFormData] = useState({
    sirket_adi: "",
    yetkili_kisi: "",
    telefon: "",
    subscription_plan: "",
    password: "" // Yeni şifre atamak için
  });

  const [loading, setLoading] = useState(false);

  // Modal açıldığında verileri doldur
  useEffect(() => {
    if (dealer) {
      setFormData({
        sirket_adi: dealer.sirket_adi || "",
        yetkili_kisi: dealer.yetkili_kisi || "",
        telefon: dealer.telefon || "",
        subscription_plan: dealer.subscription_plan || "Standart",
        password: "" // Güvenlik gereği şifreyi boş getiriyoruz, sadece değiştirilecekse girilir
      });
    }
  }, [dealer]);

  if (!isOpen || !dealer) return null;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updateData: any = {
        sirket_adi: formData.sirket_adi,
        yetkili_kisi: formData.yetkili_kisi,
        telefon: formData.telefon,
        subscription_plan: formData.subscription_plan
      };

      // Eğer şifre alanı doluysa onu da güncelleme paketine ekle
      if (formData.password.trim() !== "") {
        updateData.sifre = formData.password; // Veritabanı kolon adının 'sifre' olduğunu varsayıyorum
      }

      const { error } = await supabase
        .from('bayi_basvurulari')
        .update(updateData)
        .eq('id', dealer.id);

      if (error) throw error;

      alert("Bayi bilgileri güncellendi!");
      onUpdate(); // Listeyi yenile
      onClose();  // Modalı kapat
    } catch (error: any) {
      alert("Güncelleme hatası: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#161b22] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0d1117] px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 size={18} className="text-indigo-500"/> Bayi Düzenle
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20}/>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Building2 size={12}/> Şirket Adı</label>
            <input 
              type="text" 
              className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
              value={formData.sirket_adi}
              onChange={(e) => setFormData({...formData, sirket_adi: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><User size={12}/> Yetkili</label>
              <input 
                type="text" 
                className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                value={formData.yetkili_kisi}
                onChange={(e) => setFormData({...formData, yetkili_kisi: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Phone size={12}/> Telefon</label>
              <input 
                type="text" 
                className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                value={formData.telefon}
                onChange={(e) => setFormData({...formData, telefon: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Abonelik Paketi</label>
            <select 
              className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none appearance-none"
              value={formData.subscription_plan}
              onChange={(e) => setFormData({...formData, subscription_plan: e.target.value})}
            >
              <option value="Başlangıç">Başlangıç Paketi</option>
              <option value="Standart">Standart Paket</option>
              <option value="Pro">Pro Paket</option>
              <option value="Kurumsal">Kurumsal</option>
            </select>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-2">
             <label className="text-xs font-bold text-amber-500 flex items-center gap-1"><Lock size={12}/> Bayi Şifresini Değiştir</label>
             <input 
                type="text" 
                placeholder="Yeni şifre (Değişmeyecekse boş bırak)" 
                className="w-full bg-[#0d1117] border border-amber-900/30 text-amber-100 placeholder-amber-900/50 rounded-xl px-3 py-2.5 text-sm focus:border-amber-500 outline-none"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0d1117] border-t border-white/5">
          <button 
            onClick={handleUpdate} 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : <><Save size={18}/> DEĞİŞİKLİKLERİ KAYDET</>}
          </button>
        </div>

      </div>
    </div>
  );
}