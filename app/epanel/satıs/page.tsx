"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Plus, Upload, Trash2, Edit, X, Save, ExternalLink } from "lucide-react";
import { saveProductsToStorage, getProductsFromStorage, fileToBase64 } from "@/utils/storage";

const CATEGORIES = ["Cep Telefonu", "Robot Süpürge", "Bilgisayar/Laptop", "Akıllı Saat", "Diğer"];

interface Product {
  id: number;
  name: string;
  category: string;
  condition: string;
  description: string;
  price: number;
  image: string;
  sahibindenLink: string;
  dolapLink: string;
  letgoLink: string;
}

export default function SatisPaneli() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Verileri Çek
  useEffect(() => {
    setProducts(getProductsFromStorage());
  }, []);

  // Verileri Kaydet
  const updateStorage = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveProductsToStorage(newProducts);
  };

  const [formData, setFormData] = useState<Product>({
    id: 0, name: "", category: "Cep Telefonu", condition: "Sıfır", description: "", price: 0, image: "", sahibindenLink: "", dolapLink: "", letgoLink: "",
  });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64Image = await fileToBase64(e.target.files[0]);
        setFormData({ ...formData, image: base64Image });
      } catch (error) { console.error("Resim hatası", error); }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) { alert("Ad ve Fiyat zorunlu."); return; }
    let updatedProducts;
    if (editingId) {
      updatedProducts = products.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      updatedProducts = [...products, { ...formData, id: Date.now() }];
    }
    updateStorage(updatedProducts);
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Silinecek emin misin?")) {
      updateStorage(products.filter((p) => p.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); setEditingId(null);
    setFormData({ id: 0, name: "", category: "Cep Telefonu", condition: "Sıfır", description: "", price: 0, image: "", sahibindenLink: "", dolapLink: "", letgoLink: "" });
  };

  const startEdit = (p: Product) => { setFormData(p); setEditingId(p.id); setIsModalOpen(true); };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-4">
        <div><h1 className="text-3xl font-bold text-cyan-400">Aura Store Yönetim</h1><p className="text-slate-400 text-sm">Eklenen ürünler anında vitrine düşer.</p></div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg"><Plus size={20} /> Ürün Ekle</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group">
            <div className="h-48 bg-slate-800 relative">
              {p.image && <img src={p.image} className="w-full h-full object-cover" />}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                 <span className={`text-[10px] px-2 py-1 rounded font-bold ${p.condition === 'Outlet' ? 'bg-red-600' : 'bg-green-600'}`}>{p.condition}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold line-clamp-1">{p.name}</h3>
              <p className="text-cyan-400 font-mono mt-1">{p.price} ₺</p>
              
              {/* Link Göstergesi */}
              <div className="flex gap-2 mt-2 text-xs text-slate-500">
                {p.sahibindenLink && <span className="text-yellow-500">Sahibinden</span>}
                {p.dolapLink && <span className="text-green-500">Dolap</span>}
                {p.letgoLink && <span className="text-red-500">Letgo</span>}
              </div>

              <div className="flex gap-2 mt-4"><button onClick={() => startEdit(p)} className="flex-1 bg-slate-800 py-2 rounded text-sm hover:text-cyan-400">Düzenle</button><button onClick={() => handleDelete(p.id)} className="flex-1 bg-slate-800 py-2 rounded text-sm hover:text-red-500">Sil</button></div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
            <h2 className="text-xl font-bold mb-4 text-cyan-400">{editingId ? "Düzenle" : "Yeni Ekle"}</h2>
            <div className="space-y-4">
              {/* Resim Alanı */}
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center relative h-32 flex items-center justify-center bg-slate-950">
                 {formData.image ? <img src={formData.image} className="h-full object-contain"/> : <div className="text-slate-500"><Upload className="mx-auto mb-1"/>Resim Seç</div>}
                 <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
              </div>

              {/* Bilgiler */}
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ürün Adı" className="bg-slate-950 border border-slate-800 p-3 rounded-lg w-full outline-none focus:border-cyan-500"/>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Fiyat" className="bg-slate-950 border border-slate-800 p-3 rounded-lg w-full outline-none focus:border-cyan-500"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select name="category" value={formData.category} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 p-3 rounded-lg w-full outline-none text-white">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                <select name="condition" value={formData.condition} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 p-3 rounded-lg w-full outline-none text-white"><option value="Sıfır">Sıfır</option><option value="Outlet">Outlet / Çıkma</option></select>
              </div>

              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Açıklama" rows={2} className="bg-slate-950 border border-slate-800 p-3 rounded-lg w-full outline-none focus:border-cyan-500"/>

              {/* Satış Kanalları */}
              <div className="space-y-2 border-t border-slate-800 pt-2 bg-slate-950/50 p-3 rounded-xl">
                <p className="text-sm text-cyan-400 font-bold mb-2 flex items-center gap-2"><ExternalLink size={14}/> Satış Linkleri (İsteğe Bağlı)</p>
                <div className="flex items-center gap-2">
                    <span className="text-xs w-20 text-yellow-500">Sahibinden:</span>
                    <input type="text" name="sahibindenLink" value={formData.sahibindenLink} onChange={handleInputChange} placeholder="Link yapıştır" className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-xs"/>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs w-20 text-green-500">Dolap:</span>
                    <input type="text" name="dolapLink" value={formData.dolapLink} onChange={handleInputChange} placeholder="Link yapıştır" className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-xs"/>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs w-20 text-red-500">Letgo:</span>
                    <input type="text" name="letgoLink" value={formData.letgoLink} onChange={handleInputChange} placeholder="Link yapıştır" className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-xs"/>
                </div>
              </div>

              <button onClick={handleSave} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg mt-2 flex justify-center items-center gap-2"><Save size={18} /> Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}