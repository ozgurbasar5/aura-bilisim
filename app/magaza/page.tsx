"use client";

import { useState, useEffect } from "react";
import { 
  Package, Plus, Search, Trash2, 
  Truck, CheckCircle2, DollarSign, ShoppingBag, 
  AlertCircle, RefreshCw 
} from "lucide-react";

export default function MagazaYonetimi() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Yeni Ürün Formu State'i
  const [newProd, setNewProd] = useState({
    name: "",
    category: "Yedek Parça", // Varsayılan
    buyPrice: "",
    sellPrice: "",
    status: "Satışta" // Başlangıç statüsü
  });

  // Verileri Çek
  useEffect(() => {
    const saved = localStorage.getItem("aura_store_products");
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  // Verileri Kaydet
  const saveToStorage = (updatedList: any[]) => {
    setProducts(updatedList);
    localStorage.setItem("aura_store_products", JSON.stringify(updatedList));
    // Dashboard'ın veriyi hemen algılaması için event tetikleyebiliriz (opsiyonel)
    window.dispatchEvent(new Event("storage")); 
  };

  // Yeni Ürün Ekle
  const handleAddProduct = () => {
    if (!newProd.name || !newProd.sellPrice) return alert("İsim ve Satış Fiyatı zorunludur!");
    
    const product = {
      id: Date.now(),
      name: newProd.name,
      category: newProd.category,
      cost: Number(newProd.buyPrice) || 0,
      price: Number(newProd.sellPrice) || 0,
      date: new Date().toLocaleDateString('tr-TR'),
      status: "Satışta" // İlk eklendiğinde Vitrine düşer
    };

    const updated = [product, ...products];
    saveToStorage(updated);
    setNewProd({ name: "", category: "Yedek Parça", buyPrice: "", sellPrice: "", status: "Satışta" });
    setIsModalOpen(false);
  };

  // --- KRİTİK: DURUM GÜNCELLEME VE VİTRİNDEN DÜŞÜRME ---
  const updateStatus = (id: number, newStatus: string) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    saveToStorage(updated);
  };

  // Ürün Sil
  const handleDelete = (id: number) => {
    if (confirm("Bu ürünü silmek istediğine emin misin?")) {
      const updated = products.filter(p => p.id !== id);
      saveToStorage(updated);
    }
  };

  // Toplam Stok Değeri (Sadece satıştakiler)
  const totalStockValue = products
    .filter(p => p.status === "Satışta")
    .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  return (
    <div className="p-6 text-slate-200 min-h-screen pb-20 space-y-6">
      
      {/* BAŞLIK */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ShoppingBag className="text-purple-500" size={32}/> AURA STORE
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
            STOK & E-TİCARET YÖNETİMİ
          </p>
        </div>
        <div className="text-right">
             <div className="text-[10px] text-slate-500 uppercase">Vitrin Değeri</div>
             <div className="text-2xl font-bold text-emerald-400">{totalStockValue.toLocaleString()} ₺</div>
        </div>
      </div>

      {/* ARAÇ ÇUBUĞU */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center px-4">
          <Search className="text-slate-500" size={20}/>
          <input 
            type="text" 
            placeholder="Ürün ara..." 
            className="bg-transparent border-none outline-none text-white p-3 w-full"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={20}/> YENİ ÜRÜN EKLE
        </button>
      </div>

      {/* ÜRÜN LİSTESİ TABLOSU */}
      <div className="bg-[#151a25] border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-xs text-slate-500 uppercase border-b border-slate-800">
              <th className="p-4">Ürün Adı</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Fiyat</th>
              <th className="p-4">Durum</th>
              <th className="p-4 text-center">YÖNET (Hızlı İşlem)</th>
              <th className="p-4 text-right">Sil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {products.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Henüz ürün eklenmemiş.</td></tr>
            ) : (
              products.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                  
                  <td className="p-4 font-bold text-white">{item.name}</td>
                  <td className="p-4">
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{item.category}</span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400">{item.price} ₺</td>
                  
                  {/* DURUM BADGE */}
                  <td className="p-4">
                    {item.status === "Satışta" && (
                        <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 flex w-fit items-center gap-1">
                            <RefreshCw size={12} className="animate-spin-slow"/> VİTRİNDE
                        </span>
                    )}
                    {item.status === "Kargoda" && (
                        <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20 flex w-fit items-center gap-1">
                            <Truck size={12}/> YOLDA
                        </span>
                    )}
                    {item.status === "Satıldı" && (
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex w-fit items-center gap-1">
                            <CheckCircle2 size={12}/> SATILDI
                        </span>
                    )}
                  </td>

                  {/* --- YÖNETİM BUTONLARI --- */}
                  <td className="p-4 flex justify-center gap-2">
                    
                    {/* Eğer SATIŞTA ise -> Kargola veya Elden Sat */}
                    {item.status === "Satışta" && (
                        <>
                            <button 
                                onClick={() => updateStatus(item.id, "Kargoda")}
                                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                                title="Kargoya Ver"
                            >
                                <Truck size={14}/> Kargola
                            </button>
                            <button 
                                onClick={() => updateStatus(item.id, "Satıldı")}
                                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                                title="Elden Teslim Et"
                            >
                                <DollarSign size={14}/> Elden Sat
                            </button>
                        </>
                    )}

                    {/* Eğer KARGODA ise -> Teslim Edildi işaretle */}
                    {item.status === "Kargoda" && (
                        <button 
                            onClick={() => updateStatus(item.id, "Satıldı")}
                            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                        >
                            <CheckCircle2 size={14}/> Teslim Onayla
                        </button>
                    )}

                    {/* Eğer SATILDI ise -> İşlem yok (Veya İade Al) */}
                    {item.status === "Satıldı" && (
                         <span className="text-[10px] text-slate-600 italic">İşlem Tamam</span>
                    )}

                  </td>

                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                        <Trash2 size={18}/>
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- YENİ ÜRÜN MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a202c] border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Package className="text-purple-500"/> Stok Kartı Aç
            </h2>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-slate-400 block mb-1">Ürün / Parça Adı</label>
                    <input 
                        value={newProd.name} 
                        onChange={(e) => setNewProd({...newProd, name: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-purple-500 outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-400 block mb-1">Kategori</label>
                    <select 
                        value={newProd.category} 
                        onChange={(e) => setNewProd({...newProd, category: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                    >
                        <option>Yedek Parça</option>
                        <option>Aksesuar</option>
                        <option>Cihaz (2. El)</option>
                        <option>Sarf Malzeme</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Alış Fiyatı (Maliyet)</label>
                        <input 
                            type="number"
                            value={newProd.buyPrice} 
                            onChange={(e) => setNewProd({...newProd, buyPrice: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Satış Fiyatı</label>
                        <input 
                            type="number"
                            value={newProd.sellPrice} 
                            onChange={(e) => setNewProd({...newProd, sellPrice: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold text-emerald-400 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-8">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">İptal</button>
                <button onClick={handleAddProduct} className="flex-1 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors">Kaydet & Vitrine Koy</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}