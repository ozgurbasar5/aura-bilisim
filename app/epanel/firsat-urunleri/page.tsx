"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { Plus, Trash2, ShoppingBag, Zap, ShieldCheck, Package } from "lucide-react";

// Kategorileri ikiye ayırdık: Ürünler ve Hizmetler
const PRODUCT_CATEGORIES = ["Cep Telefonu", "Robot Süpürge", "Bilgisayar", "Aksesuar", "Diğer"];
const SERVICE_CATEGORIES = ["Garanti Uzatma", "Koruma Paketi", "Yazılım Hizmeti", "Bakım Paketi"];

export default function FirsatUrunleriYonetimi() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"product" | "service">("product"); // Ürün mü Hizmet mi?
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Aksesuar" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from('aura_upsell_products').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newItem.name || !newItem.price) return alert("İsim ve Fiyat giriniz.");
    
    const { error } = await supabase.from('aura_upsell_products').insert([{
      name: newItem.name,
      price: Number(newItem.price),
      category: newItem.category,
      type: type, // Veritabanında 'type' kolonu açman gerekebilir veya meta_data json kullanabilirsin. 
                  // Eğer kolon yoksa bu alanı 'description' veya mevcut bir alana gömebiliriz.
                  // Şimdilik 'category' üzerinden filtreleme yapacağız.
      is_active: true
    }]);

    if (!error) {
      setNewItem({ name: "", price: "", category: type === 'product' ? "Aksesuar" : "Garanti Uzatma" });
      fetchItems();
    } else {
      alert("Hata: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    await supabase.from('aura_upsell_products').delete().eq('id', id);
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-8 font-sans">
      <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
        <Zap className="text-yellow-500" /> FIRSAT & HİZMET YÖNETİMİ
      </h1>
      <p className="text-slate-400 mb-8">Teknisyen panelinde ve müşteri sorgulama ekranında çıkacak ek satış kalemleri.</p>

      {/* EKLEME PANELİ */}
      <div className="bg-[#151921] p-6 rounded-2xl border border-slate-800 mb-8 shadow-lg">
        <div className="flex gap-4 mb-6 bg-black/20 p-1 rounded-lg w-fit">
            <button onClick={() => { setType("product"); setNewItem({...newItem, category: "Aksesuar"}) }} className={`px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${type === 'product' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <Package size={16}/> Fiziksel Ürün
            </button>
            <button onClick={() => { setType("service"); setNewItem({...newItem, category: "Garanti Uzatma"}) }} className={`px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${type === 'service' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <ShieldCheck size={16}/> Ek Hizmet
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            value={newItem.category} 
            onChange={e => setNewItem({...newItem, category: e.target.value})}
            className="bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500"
          >
            {(type === 'product' ? PRODUCT_CATEGORIES : SERVICE_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
            type="text" 
            placeholder={type === 'product' ? "Ürün Adı (Örn: Kırılmaz Cam)" : "Hizmet Adı (Örn: +1 Yıl Garanti)"}
            value={newItem.name}
            onChange={e => setNewItem({...newItem, name: e.target.value})}
            className="bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500"
          />
          <input 
            type="number" 
            placeholder="Fiyat (TL)" 
            value={newItem.price}
            onChange={e => setNewItem({...newItem, price: e.target.value})}
            className="bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500"
          />
          <button onClick={handleAdd} className={`font-bold rounded-lg p-3 flex items-center justify-center gap-2 transition-all text-white ${type === 'product' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-purple-600 hover:bg-purple-500'}`}>
            <Plus size={18}/> {type === 'product' ? 'ÜRÜN EKLE' : 'HİZMET EKLE'}
          </button>
        </div>
      </div>

      {/* LİSTE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ÜRÜNLER LİSTESİ */}
          <div>
              <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2"><Package size={18}/> FİZİKSEL ÜRÜNLER</h3>
              <div className="space-y-2">
                  {items.filter(i => i.type !== 'service' && !SERVICE_CATEGORIES.includes(i.category)).map(item => (
                      <div key={item.id} className="bg-[#151921] border border-slate-800 p-3 rounded-xl flex justify-between items-center group hover:border-cyan-500/50 transition-colors">
                          <div>
                              <div className="font-bold text-white">{item.name}</div>
                              <div className="text-xs text-slate-500">{item.category}</div>
                          </div>
                          <div className="flex items-center gap-4">
                              <div className="font-mono font-bold text-cyan-400">{item.price} ₺</div>
                              <button onClick={() => handleDelete(item.id)} className="text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* HİZMETLER LİSTESİ */}
          <div>
              <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><ShieldCheck size={18}/> EK HİZMETLER</h3>
              <div className="space-y-2">
                  {items.filter(i => i.type === 'service' || SERVICE_CATEGORIES.includes(i.category)).map(item => (
                      <div key={item.id} className="bg-[#151921] border border-slate-800 p-3 rounded-xl flex justify-between items-center group hover:border-purple-500/50 transition-colors">
                          <div>
                              <div className="font-bold text-white">{item.name}</div>
                              <div className="text-xs text-slate-500">{item.category}</div>
                          </div>
                          <div className="flex items-center gap-4">
                              <div className="font-mono font-bold text-purple-400">{item.price} ₺</div>
                              <button onClick={() => handleDelete(item.id)} className="text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}