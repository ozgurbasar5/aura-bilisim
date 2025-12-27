"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Plus, Upload, Trash2, Edit, X, Save, ExternalLink } from "lucide-react";
// Yeni storage fonksiyonlarını ve tiplerini import ediyoruz
import { 
  saveProductsToStorage, 
  getProductsFromStorage, 
  fileToBase64, 
  Product, 
  generateId 
} from "@/utils/storage";

const CATEGORIES = ["Cep Telefonu", "Robot Süpürge", "Bilgisayar/Laptop", "Akıllı Saat", "Diğer"];

export default function SatisPaneli() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // ID artık string

  // Başlangıç Form Verisi
  const initialForm: Product = {
    id: "", // ID string oldu
    name: "", 
    category: "Cep Telefonu", 
    condition: "Sıfır", 
    description: "", 
    price: 0, 
    image: "", 
    sahibindenLink: "", 
    dolapLink: "", 
    letgoLink: "",
    stock: 1
  };

  const [formData, setFormData] = useState<Product>(initialForm);

  // Verileri Çek
  useEffect(() => {
    const data = getProductsFromStorage();
    setProducts(data);
  }, []);

  // Verileri Kaydet
  const updateStorage = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveProductsToStorage(newProducts);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        if (e.target.files[0].size > 2 * 1024 * 1024) {
            alert("Dosya boyutu çok yüksek! Lütfen 2MB altı bir resim seçin.");
            return;
        }
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
      // Düzenleme Modu
      updatedProducts = products.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      // Yeni Ekleme Modu (ID'yi burada oluşturuyoruz)
      updatedProducts = [...products, { ...formData, id: generateId() }];
    }
    updateStorage(updatedProducts);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Silinecek emin misin?")) {
      updateStorage(products.filter((p) => p.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); 
    setEditingId(null);
    setFormData(initialForm);
  };

  const startEdit = (p: Product) => { 
      setFormData(p); 
      setEditingId(p.id); 
      setIsModalOpen(true); 
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-4">
        <div>
            <h1 className="text-3xl font-bold text-cyan-400">Aura Store Yönetim</h1>
            <p className="text-slate-400 text-sm">Eklenen ürünler anında vitrine düşer.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors">
            <Plus size={20} /> Ürün Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-cyan-500/50 transition-all">
            <div className="h-48 bg-slate-800 relative flex items-center justify-center overflow-hidden">
              {p.image ? (
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
              ) : (
                  <div className="text-slate-600 flex flex-col items-center"><Upload size={24}/> <span className="text-xs">Görsel Yok</span></div>
              )}
              
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                 <span className={`text-[10px] px-2 py-1 rounded font-bold shadow-sm ${p.condition === 'Outlet' ? 'bg-red-600' : 'bg-green-600'}`}>{p.condition}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold line-clamp-1 text-lg">{p.name}</h3>
              <p className="text-cyan-400 font-mono mt-1 text-xl font-bold">{p.price} ₺</p>
              
              <div className="flex gap-2 mt-3 text-xs text-slate-500 min-h-[20px]">
                {p.sahibindenLink && <span className="text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">Sahibinden</span>}
                {p.dolapLink && <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Dolap</span>}
                {p.letgoLink && <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Letgo</span>}
              </div>

              <div className="flex gap-2 mt-4">
                  <button onClick={() => startEdit(p)} className="flex-1 bg-slate-800 py-2 rounded text-sm hover:bg-cyan-900 hover:text-cyan-400 border border-slate-700 transition-colors flex items-center justify-center gap-2"><Edit size={14}/> Düzenle</button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 bg-slate-800 py-2 rounded text-sm hover:bg-red-900/30 hover:text-red-500 border border-slate-700 transition-colors flex items-center justify-center gap-2"><Trash2 size={14}/> Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-500 hover:text-white bg-slate-800 p-1 rounded-full"><X size={20}/></button>
            <h2 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
                {editingId ? <Edit size={24}/> : <Plus size={24}/>}
                {editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h2>
            
            <div className="space-y-5">
              {/* Resim Alanı */}
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 transition-colors rounded-xl p-4 text-center relative h-48 flex items-center justify-center bg-slate-950 group">
                  {formData.image ? (
                      <img src={formData.image} className="h-full object-contain rounded-lg shadow-lg"/>
                  ) : (
                      <div className="text-slate-500 group-hover:text-cyan-400 transition-colors">
                          <Upload className="mx-auto mb-2 w-10 h-10"/>
                          <span className="font-medium">Ürün Görseli Seç</span>
                          <p className="text-xs text-slate-600 mt-1">Maksimum 2MB</p>
                      </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
              </div>

              {/* Bilgiler */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-slate-400 ml-1 block mb-1">Ürün Adı</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 p-3 rounded-lg w-full outline-none focus:border-cyan-500 transition-colors text-white"/>
                </div>
                <div>
                    <label className="text-xs text-slate-400 ml-1 block mb-1">Fiyat (TL)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 p-3 rounded-lg w-full outline-none focus:border-cyan-500 transition-colors text-white"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-slate-400 ml-1 block mb-1">Kategori</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 p-3 rounded-lg w-full outline-none text-white focus:border-cyan-500">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-slate-400 ml-1 block mb-1">Durum</label>
                    <select name="condition" value={formData.condition} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 p-3 rounded-lg w-full outline-none text-white focus:border-cyan-500">
                        <option value="Sıfır">Sıfır</option>
                        <option value="Outlet">Outlet / Çıkma</option>
                    </select>
                </div>
              </div>

              <div>
                  <label className="text-xs text-slate-400 ml-1 block mb-1">Açıklama</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="bg-slate-950 border border-slate-800 p-3 rounded-lg w-full outline-none focus:border-cyan-500 transition-colors text-white"/>
              </div>

              {/* Satış Kanalları */}
              <div className="space-y-3 border-t border-slate-800 pt-4 bg-slate-950/30 p-4 rounded-xl">
                <p className="text-sm text-cyan-400 font-bold mb-2 flex items-center gap-2"><ExternalLink size={14}/> Satış Linkleri (İsteğe Bağlı)</p>
                <div className="flex items-center gap-3">
                    <span className="text-xs w-20 text-yellow-500 font-bold">Sahibinden</span>
                    <input type="text" name="sahibindenLink" value={formData.sahibindenLink} onChange={handleInputChange} placeholder="https://..." className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-xs text-slate-300 focus:border-yellow-500/50 outline-none"/>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs w-20 text-green-500 font-bold">Dolap</span>
                    <input type="text" name="dolapLink" value={formData.dolapLink} onChange={handleInputChange} placeholder="https://..." className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-xs text-slate-300 focus:border-green-500/50 outline-none"/>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs w-20 text-red-500 font-bold">Letgo</span>
                    <input type="text" name="letgoLink" value={formData.letgoLink} onChange={handleInputChange} placeholder="https://..." className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-xs text-slate-300 focus:border-red-500/50 outline-none"/>
                </div>
              </div>

              <button onClick={handleSave} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl mt-4 flex justify-center items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02]">
                  <Save size={20} /> {editingId ? "Değişiklikleri Kaydet" : "Ürünü Yayınla"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}