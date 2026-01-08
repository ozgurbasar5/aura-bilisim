"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { Plus, Trash2, ShoppingBag, Save, X } from "lucide-react";

const CATEGORIES = ["Cep Telefonu", "Robot Süpürge", "Bilgisayar", "Tablet", "Akıllı Saat", "Diğer"];

export default function FirsatUrunleriYonetimi() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Cep Telefonu" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('aura_upsell_products').select('*').order('category');
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price) return alert("İsim ve Fiyat giriniz.");
    
    // DÜZELTME: is_active: true eklendi
    const { error } = await supabase.from('aura_upsell_products').insert([{
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      is_active: true
    }]);

    if (!error) {
      setNewProduct({ name: "", price: "", category: "Cep Telefonu" });
      fetchProducts();
    } else {
      alert("Hata: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    await supabase.from('aura_upsell_products').delete().eq('id', id);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-8">
      <h1 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
        <ShoppingBag className="text-pink-500" /> FIRSAT ÜRÜNLERİ YÖNETİMİ
      </h1>

      {/* YENİ ÜRÜN EKLEME */}
      <div className="bg-[#151921] p-6 rounded-2xl border border-slate-800 mb-8 shadow-lg">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Yeni Ürün Ekle</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            value={newProduct.category} 
            onChange={e => setNewProduct({...newProduct, category: e.target.value})}
            className="bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-pink-500"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="Ürün Adı (Örn: Kırılmaz Cam)" 
            value={newProduct.name}
            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            className="bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-pink-500"
          />
          <input 
            type="number" 
            placeholder="Fiyat (TL)" 
            value={newProduct.price}
            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
            className="bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-pink-500"
          />
          <button onClick={handleAdd} className="bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg p-3 flex items-center justify-center gap-2 transition-all">
            <Plus size={18}/> EKLE
          </button>
        </div>
      </div>

      {/* LİSTE */}
      {loading ? <div className="text-center animate-pulse">Yükleniyor...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(cat => {
            const catProducts = products.filter(p => p.category === cat);
            if (catProducts.length === 0) return null;

            return (
              <div key={cat} className="bg-[#151921] border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 p-3 border-b border-slate-700 font-bold text-sm text-cyan-400 uppercase tracking-widest">
                  {cat}
                </div>
                <div className="p-2">
                  {catProducts.map(prod => (
                    <div key={prod.id} className="flex justify-between items-center p-3 border-b border-slate-800/50 last:border-0 hover:bg-white/5 transition-colors group">
                      <div>
                        <div className="text-sm font-bold text-white">{prod.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{prod.price} TL</div>
                      </div>
                      <button onClick={() => handleDelete(prod.id)} className="text-slate-600 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}