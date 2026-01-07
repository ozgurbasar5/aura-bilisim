import React, { useState, useEffect } from 'react';
import { Save, X, Calendar, Shield, Lock, User, Briefcase, AlertCircle } from 'lucide-react';
import { supabase } from '@/app/lib/supabase'; 

interface DealerEditModalProps {
  dealer: any;
  technicians: any[]; 
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function DealerEditModal({ dealer, technicians, isOpen, onClose, onUpdate }: DealerEditModalProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    subscription_plan: 'standard',
    subscription_expiry: '',
    admin_notes: '',
    dedicated_technician_id: '',
    password: '' // Artık direkt tablodaki password sütunu
  });

  useEffect(() => {
    if (dealer) {
        setFormData({
            subscription_plan: dealer.subscription_plan || 'standard',
            subscription_expiry: dealer.subscription_expiry ? dealer.subscription_expiry.split('T')[0] : '',
            admin_notes: dealer.admin_notes || '',
            dedicated_technician_id: dealer.dedicated_technician_id || '',
            password: dealer.password || '' 
        });
    }
  }, [dealer]);

  if (!isOpen || !dealer) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      // SADECE TABLOYU GÜNCELLİYORUZ (Supabase Auth'a dokunmuyoruz)
      const { error } = await supabase
        .from('bayi_basvurulari')
        .update({
          subscription_plan: formData.subscription_plan,
          subscription_expiry: formData.subscription_expiry === '' ? null : formData.subscription_expiry,
          admin_notes: formData.admin_notes,
          dedicated_technician_id: formData.dedicated_technician_id === '' ? null : formData.dedicated_technician_id,
          password: formData.password // Şifreyi direkt metin olarak kaydediyoruz (Kendi özel auth sistemimiz)
        })
        .eq('id', dealer.id);

      if (error) throw error;

      alert('✅ Bayi bilgileri ve giriş şifresi güncellendi! (Personel hesabından bağımsız)');
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#1e293b]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User size={20} className="text-amber-500" />
              {dealer.sirket_adi}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Bayi Yönetim Paneli</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Paket ve Süre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-2 font-bold uppercase">Abonelik Paketi</label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 text-slate-500" size={16} />
                <select 
                  value={formData.subscription_plan}
                  onChange={(e) => setFormData({...formData, subscription_plan: e.target.value})}
                  className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-amber-500 outline-none appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <option value="standard">Standart Paket</option>
                  <option value="gold">Gold Paket</option>
                  <option value="platinum">Platinum Paket</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-slate-400 block mb-2 font-bold uppercase">Abonelik Bitiş</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-500" size={16} />
                <input 
                  type="date" 
                  value={formData.subscription_expiry}
                  onChange={(e) => setFormData({...formData, subscription_expiry: e.target.value})}
                  className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Teknisyen Atama */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
             <label className="text-xs text-indigo-300 block mb-2 flex items-center gap-1 font-bold">
                <Briefcase size={14} /> Temsilci Atama
             </label>
             <select 
                value={formData.dedicated_technician_id}
                onChange={(e) => setFormData({...formData, dedicated_technician_id: e.target.value})}
                className="w-full bg-[#020617] border border-indigo-500/30 rounded-xl py-3 px-4 text-white focus:border-indigo-500 outline-none cursor-pointer hover:bg-indigo-500/10 transition-colors"
             >
                <option value="">-- Genel Destek --</option>
                {technicians && technicians.map((tech) => (
                   <option key={tech.id} value={tech.id}>
                      {tech.ad_soyad} ({tech.rol})
                   </option>
                ))}
             </select>
          </div>

          {/* ÖZEL ŞİFRE ALANI - AYRI SQL */}
          <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
            <label className="text-xs text-amber-500 block mb-2 flex items-center gap-1 font-bold">
                <Lock size={12}/> BAYİ GİRİŞ ŞİFRESİ (ÖZEL)
            </label>
            <input 
                type="text" 
                placeholder="Bayinin sisteme gireceği şifre..." 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none text-sm font-mono tracking-wider"
            />
            <p className="text-[10px] text-slate-500 mt-2">
                * Bu şifre sadece bayinin kurumsal paneline girişi içindir. Personel hesaplarını etkilemez.
            </p>
          </div>

          {/* Admin Notları */}
          <div>
            <label className="text-xs text-slate-400 block mb-2 font-bold uppercase">Admin Notları</label>
            <textarea 
                rows={2}
                value={formData.admin_notes}
                onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                className="w-full bg-[#020617] border border-white/10 rounded-xl p-3 text-slate-300 text-sm focus:border-amber-500 outline-none resize-none"
                placeholder="Notlar..."
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#1e293b] flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-400 hover:text-white font-medium hover:bg-white/5 transition-all">Vazgeç</button>
          <button onClick={handleSave} disabled={loading} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20 active:scale-95">
            <Save size={18} /> {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}