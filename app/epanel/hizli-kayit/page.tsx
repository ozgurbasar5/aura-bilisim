"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { 
  PackagePlus, Save, Smartphone, User, 
  FileText, Cpu, AlertCircle, Loader2, ArrowLeft 
} from "lucide-react";

export default function HizliKayit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form Verileri
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    device: "",
    category: "Cep Telefonu",
    fault: "",
    password: "", // Opsiyonel (Desen/Şifre)
    price: "",
    cost: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer || !formData.device) {
      alert("Lütfen Müşteri Adı ve Cihaz Modelini giriniz.");
      return;
    }

    setLoading(true);

    // 1. VERİYİ SUPABASE'E GÖNDER
    const { error } = await supabase
      .from('aura_jobs')
      .insert([
        {
          customer: formData.customer,
          phone: formData.phone,
          device: formData.device,
          category: formData.category,
          fault: formData.fault,
          pattern_lock: formData.password,
          price: Number(formData.price) || 0,
          cost: Number(formData.cost) || 0,
          notes: formData.notes,
          status: "Bekliyor"
        }
      ]);

    if (error) {
      console.error(error);
      alert("Kayıt oluşturulurken bir hata oluştu!");
    } else {
      // Başarılı
      router.push("/epanel/atolye"); // Listeye yönlendir
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-slate-200 pb-20 animate-in fade-in zoom-in-95 duration-300">
      
      <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-slate-500 hover:text-white transition-colors text-sm font-bold">
          <ArrowLeft size={16}/> Geri Dön
      </button>

      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
          <PackagePlus size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">YENİ SERVİS KAYDI</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">BULUT SİSTEMİNE KAYIT AÇILIYOR</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* MÜŞTERİ & CİHAZ BİLGİLERİ */}
        <div className="bg-[#151a25] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <User size={16} className="text-cyan-500"/> Müşteri & Cihaz
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Müşteri Adı Soyadı</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                      placeholder="Örn: Ahmet Yılmaz"
                      value={formData.customer}
                      onChange={(e) => setFormData({...formData, customer: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Telefon Numarası</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                      placeholder="05XX..."
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, device: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Kategori</label>
                    <select 
                      className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        <option>Cep Telefonu</option>
                        <option>Robot Süpürge</option>
                        <option>Bilgisayar</option>
                        <option>Tablet</option>
                        <option>Akıllı Saat</option>
                        <option>Diğer</option>
                    </select>
                </div>
            </div>
        </div>

        {/* ARIZA & DETAYLAR */}
        <div className="bg-[#151a25] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <Cpu size={16} className="text-purple-500"/> Teknik Detaylar
            </h3>

            <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Arıza Tanımı / Şikayet</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none transition-colors"
                  placeholder="Örn: Ekran kırık, şarj almıyor..."
                  value={formData.fault}
                  onChange={(e) => setFormData({...formData, fault: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Tahmini Fiyat (TL)</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-emerald-400 font-bold focus:border-emerald-500 outline-none transition-colors"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Ekran Kilidi / Parola</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none transition-colors"
                      placeholder="Yok veya 123456"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Özel Notlar (Teknisyen)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-slate-300 focus:border-purple-500 outline-none transition-colors resize-none"
                  placeholder="Cihazın kasasında çizik var..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
            </div>
        </div>

        {/* KAYDET BUTONU */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-cyan-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>}
          {loading ? "SİSTEME İŞLENİYOR..." : "KAYDI OLUŞTUR VE ATÖLYEYE GÖNDER"}
        </button>

      </form>
    </div>
  );
}