"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { X, Save, Building, User, Phone, Mail, CreditCard, Crown } from "lucide-react";

interface DealerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealer: any;
  onUpdate: () => void;
  technicians?: any[]; // Opsiyonel
}

export default function DealerEditModal({ isOpen, onClose, dealer, onUpdate }: DealerEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sirket_adi: "",
    yetkili_kisi: "",
    telefon: "",
    email: "",
    adres: "",
    vergi_no: "",
    subscription_plan: "Standart" // Varsayılan
  });

  useEffect(() => {
    if (dealer) {
      setFormData({
        sirket_adi: dealer.sirket_adi || "",
        yetkili_kisi: dealer.yetkili_kisi || "",
        telefon: dealer.telefon || "",
        email: dealer.email || "",
        adres: dealer.adres || "",
        vergi_no: dealer.vergi_no || "",
        subscription_plan: dealer.subscription_plan || "Standart"
      });
    }
  }, [dealer]);

  const handleSave = async () => {
    setLoading(true);
    try {
        const { error } = await supabase
            .from('bayi_basvurulari')
            .update({
                sirket_adi: formData.sirket_adi,
                yetkili_kisi: formData.yetkili_kisi,
                telefon: formData.telefon,
                email: formData.email,
                adres: formData.adres,
                vergi_no: formData.vergi_no,
                subscription_plan: formData.subscription_plan, // Paketi güncelle
                updated_at: new Date().toISOString()
            })
            .eq('id', dealer.id);

        if (error) throw error;
        
        alert("Bayi bilgileri ve paketi güncellendi.");
        onUpdate();
        onClose();
    } catch (error: any) {
        alert("Hata: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#151921] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#0b0e14] rounded-t-2xl">
          <h3 className="font-bold text-white flex items-center gap-2">
             <Building size={18} className="text-cyan-500"/> Bayi Düzenle
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
            
            {/* PAKET SEÇİMİ - ÖNEMLİ KISIM */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <label className="text-xs font-bold text-amber-500 mb-2 flex items-center gap-2">
                    <Crown size={14}/> ABONELİK PAKETİ
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {["Standart", "Gold", "Platinum"].map((plan) => (
                        <button
                            key={plan}
                            onClick={() => setFormData({...formData, subscription_plan: plan})}
                            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                                formData.subscription_plan === plan 
                                ? plan === 'Platinum' ? 'bg-amber-500 text-black border-amber-500' 
                                : plan === 'Gold' ? 'bg-yellow-600 text-white border-yellow-500'
                                : 'bg-slate-600 text-white border-slate-500'
                                : 'bg-[#0b0e14] text-slate-400 border-white/10 hover:border-white/30'
                            }`}
                        >
                            {plan} Partner
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Şirket Adı</label>
                    <div className="flex items-center bg-[#0b0e14] border border-white/10 rounded-lg px-3 py-2">
                        <Building size={14} className="text-slate-500 mr-2"/>
                        <input type="text" className="bg-transparent text-sm text-white w-full outline-none" value={formData.sirket_adi} onChange={e => setFormData({...formData, sirket_adi: e.target.value})}/>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Yetkili Kişi</label>
                    <div className="flex items-center bg-[#0b0e14] border border-white/10 rounded-lg px-3 py-2">
                        <User size={14} className="text-slate-500 mr-2"/>
                        <input type="text" className="bg-transparent text-sm text-white w-full outline-none" value={formData.yetkili_kisi} onChange={e => setFormData({...formData, yetkili_kisi: e.target.value})}/>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Telefon</label>
                    <div className="flex items-center bg-[#0b0e14] border border-white/10 rounded-lg px-3 py-2">
                        <Phone size={14} className="text-slate-500 mr-2"/>
                        <input type="text" className="bg-transparent text-sm text-white w-full outline-none" value={formData.telefon} onChange={e => setFormData({...formData, telefon: e.target.value})}/>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">E-Posta</label>
                    <div className="flex items-center bg-[#0b0e14] border border-white/10 rounded-lg px-3 py-2">
                        <Mail size={14} className="text-slate-500 mr-2"/>
                        <input type="text" className="bg-transparent text-sm text-white w-full outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
                    </div>
                </div>
            </div>

            <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Adres</label>
                <textarea className="w-full bg-[#0b0e14] border border-white/10 rounded-lg p-3 text-sm text-white outline-none resize-none h-20" value={formData.adres} onChange={e => setFormData({...formData, adres: e.target.value})}></textarea>
            </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-[#0b0e14] rounded-b-2xl">
            <button 
                onClick={handleSave} 
                disabled={loading}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                <Save size={18}/>
                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
        </div>
      </div>
    </div>
  );
}