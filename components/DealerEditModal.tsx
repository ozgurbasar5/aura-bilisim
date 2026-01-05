import React, { useState } from 'react';
import { Save, X, Calendar, Shield, Lock, User, FileText, Briefcase } from 'lucide-react';
import { supabase } from '@/app/lib/supabase'; // Yolunu kendine göre ayarla

interface DealerEditModalProps {
  dealer: any;
  technicians: any[]; // <--- BU SATIR ÖNEMLİ: Listeyi buradan alıyor
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function DealerEditModal({ dealer, technicians, isOpen, onClose, onUpdate }: DealerEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subscription_plan: dealer?.subscription_plan || 'standard',
    subscription_expiry: dealer?.subscription_expiry ? dealer.subscription_expiry.split('T')[0] : '',
    admin_notes: dealer?.admin_notes || '',
    account_status: dealer?.account_status || 'active',
    dedicated_technician_id: dealer?.dedicated_technician_id || '', // <--- YENİ
    new_password: ''
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: formData.subscription_plan,
          subscription_expiry: formData.subscription_expiry,
          admin_notes: formData.admin_notes,
          account_status: formData.account_status,
          dedicated_technician_id: formData.dedicated_technician_id || null // <--- YENİ
        })
        .eq('id', dealer.id);

      if (error) throw error;

      if (formData.new_password) {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          dealer.id,
          { password: formData.new_password }
        );
        if (passwordError) throw passwordError;
      }

      alert('Bayi ve Atanan Danışman güncellendi!');
      onUpdate();
      onClose();
    } catch (err: any) {
      alert('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#1e293b]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User size={20} className="text-amber-500" />
              {dealer.company_name || dealer.email}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Bayi Yönetim Paneli</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24}/></button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* 1. Paket ve Durum */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-2">Abonelik Paketi</label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 text-slate-500" size={16} />
                <select 
                  value={formData.subscription_plan}
                  onChange={(e) => setFormData({...formData, subscription_plan: e.target.value})}
                  className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-amber-500 outline-none appearance-none"
                >
                  <option value="standard">Standart Paket</option>
                  <option value="gold">Gold Paket</option>
                  <option value="platinum">Platinum Paket</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-2">Hesap Durumu</label>
              <select 
                value={formData.account_status}
                onChange={(e) => setFormData({...formData, account_status: e.target.value})}
                className={`w-full bg-[#020617] border border-white/10 rounded-xl py-3 px-4 outline-none font-bold ${
                  formData.account_status === 'active' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                <option value="pending">Onay Bekliyor</option>
                <option value="active">Aktif</option>
                <option value="suspended">Askıya Alındı</option>
              </select>
            </div>
          </div>

          {/* 2. ATANAN TEKNİSYEN SEÇİMİ (BU KISIM EKLENDİ) */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
             <label className="text-xs text-indigo-300 block mb-2 flex items-center gap-1">
                <Briefcase size={14} /> Özel Müşteri Temsilcisi Atama
             </label>
             <select 
                value={formData.dedicated_technician_id}
                onChange={(e) => setFormData({...formData, dedicated_technician_id: e.target.value})}
                className="w-full bg-[#020617] border border-indigo-500/30 rounded-xl py-3 px-4 text-white focus:border-indigo-500 outline-none"
             >
                <option value="">-- Temsilci Seçiniz (Standart Destek) --</option>
                {/* technicians prop'u burada kullanılıyor */}
                {technicians && technicians.map((tech) => (
                   <option key={tech.id} value={tech.id}>
                      {tech.ad_soyad} ({tech.rol})
                   </option>
                ))}
             </select>
             <p className="text-[10px] text-slate-500 mt-2">
                * Seçilen personel, müşterinin panelinde "Danışmanım" olarak gözükecektir.
             </p>
          </div>

          {/* 3. Süre Ayarlama */}
          <div>
            <label className="text-xs text-slate-400 block mb-2">Abonelik Bitiş Tarihi</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-500" size={16} />
              <input 
                type="date" 
                value={formData.subscription_expiry}
                onChange={(e) => setFormData({...formData, subscription_expiry: e.target.value})}
                className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-amber-500 outline-none"
              />
            </div>
            <div className="flex gap-2 mt-2">
               <button onClick={() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); setFormData({...formData, subscription_expiry: d.toISOString().split('T')[0]}) }} className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-amber-500">+1 Yıl</button>
               <button onClick={() => { const d = new Date(); d.setMonth(d.getMonth() + 1); setFormData({...formData, subscription_expiry: d.toISOString().split('T')[0]}) }} className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-slate-400">+1 Ay</button>
            </div>
          </div>

          {/* 4. Şifre ve Notlar */}
          <div className="grid grid-cols-1 gap-4">
             <div>
                <label className="text-xs text-slate-400 block mb-2">Özel Notlar (Admin)</label>
                <textarea 
                  rows={2}
                  value={formData.admin_notes}
                  onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                  className="w-full bg-[#020617] border border-white/10 rounded-xl p-3 text-slate-300 text-sm focus:border-amber-500 outline-none resize-none"
                />
             </div>
             <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-xl">
                <label className="text-xs text-red-400 block mb-2 flex items-center gap-1"><Lock size={12}/> Şifre Sıfırlama</label>
                <input type="text" placeholder="Yeni şifre (Boş bırakırsan değişmez)" value={formData.new_password} onChange={(e) => setFormData({...formData, new_password: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-xl py-2 px-4 text-white focus:border-red-500 outline-none text-sm"/>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#1e293b] flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-400 hover:text-white font-medium">İptal</button>
          <button onClick={handleSave} disabled={loading} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center gap-2 disabled:opacity-50">
            <Save size={18} /> {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}