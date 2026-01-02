"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { 
  Package, Search, Plus, Trash2, Edit, 
  Calendar, Tag, User, Barcode, DollarSign, X, TrendingUp, RefreshCw
} from "lucide-react";

export default function StokYonetimi() {
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState<any[]>([]);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dolarKuru, setDolarKuru] = useState<number>(0);
  
  // İstatistikler
  const [totalValue, setTotalValue] = useState(0); // Toplam Maliyet
  const [totalPotential, setTotalPotential] = useState(0); // Toplam Satış
  const [totalProfit, setTotalProfit] = useState(0); // Tahmini Kâr
  const [totalCount, setTotalCount] = useState(0); // Toplam Adet

  // Form State
  const [formData, setFormData] = useState<any>({
    id: null,
    urun_adi: "",
    stok_kodu: "",
    kategori: "Yedek Parça",
    tedarikci: "",
    alis_fiyati_usd: "", // Dolar alış fiyatı (boş olabilir)
    alis_fiyati: 0,      // TL karşılığı (asıl maliyet)
    satis_fiyati: 0,
    stok_adedi: 0,
    alis_tarihi: new Date().toISOString().split('T')[0]
  });

  const [oldStockCount, setOldStockCount] = useState(0);

  useEffect(() => {
    fetchStocks();
    fetchDolar();
  }, []);

  // DOLAR KURU ÇEKME
  const fetchDolar = async () => {
    try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY');
        const data = await res.json();
        setDolarKuru(data.rates.TRY);
    } catch (err) {
        console.error("Kur çekilemedi", err);
        setDolarKuru(36.00); // Hata olursa manuel fallback
    }
  };

  // OTOMATİK STOK KODU
  useEffect(() => {
    if (formData.urun_adi && !formData.id && !formData.stok_kodu) { 
        const words = formData.urun_adi.split(' ');
        const prefix = words.length > 1 
            ? (words[0].substring(0, 1) + words[1].substring(0, 1)).toUpperCase() 
            : words[0].substring(0, 2).toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        setFormData((prev:any) => ({ ...prev, stok_kodu: `${prefix}-${random}` }));
    }
  }, [formData.urun_adi]);

  const fetchStocks = async () => {
    setLoading(true);
    const { data } = await supabase.from('aura_stok').select('*').order('created_at', { ascending: false });
    if (data) {
      setStocks(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (data: any[]) => {
    let cost = 0;
    let potential = 0;
    let count = 0;
    data.forEach(item => {
      cost += (Number(item.alis_fiyati) * Number(item.stok_adedi));
      potential += (Number(item.satis_fiyati) * Number(item.stok_adedi));
      count += Number(item.stok_adedi);
    });
    setTotalValue(cost);
    setTotalPotential(potential);
    setTotalProfit(potential - cost); 
    setTotalCount(count);
  };

  // DOLAR GİRİLİNCE TL HESAPLA
  const handleUsdChange = (val: string) => {
      const usdVal = parseFloat(val);
      if (!isNaN(usdVal) && dolarKuru > 0) {
          const tlVal = (usdVal * dolarKuru).toFixed(2);
          setFormData({ ...formData, alis_fiyati_usd: val, alis_fiyati: tlVal });
      } else {
          setFormData({ ...formData, alis_fiyati_usd: val });
      }
  };

  const handleSave = async () => {
    if (!formData.urun_adi) { alert("Ürün adı zorunlu!"); return; }

    const payload = {
        urun_adi: formData.urun_adi,
        stok_kodu: formData.stok_kodu,
        kategori: formData.kategori,
        tedarikci: formData.tedarikci,
        alis_fiyati: Number(formData.alis_fiyati),
        satis_fiyati: Number(formData.satis_fiyati),
        stok_adedi: Number(formData.stok_adedi),
        alis_tarihi: formData.alis_tarihi
        // alis_fiyati_usd veritabanında sütun varsa eklenebilir, yoksa TL kaydedilir
    };

    // GİDER FİŞİ OLUŞTURMA (STOK ARTIŞINDA)
    const stockDifference = Number(formData.stok_adedi) - oldStockCount;
    if (stockDifference > 0) {
        const expenseAmount = stockDifference * Number(formData.alis_fiyati);
        if(expenseAmount > 0) {
            await supabase.from('aura_finans').insert([{
                tur: 'Gider',
                kategori: 'Mal Alımı',
                tutar: expenseAmount,
                aciklama: `${formData.urun_adi} (${stockDifference} Adet) Stok Girişi`,
                tarih: new Date().toISOString().split('T')[0]
            }]);
        }
    }

    let error;
    if (formData.id) {
        const res = await supabase.from('aura_stok').update(payload).eq('id', formData.id);
        error = res.error;
    } else {
        const res = await supabase.from('aura_stok').insert([payload]);
        error = res.error;
    }

    if (!error) {
        setIsModalOpen(false);
        setFormData({ id: null, urun_adi: "", stok_kodu: "", kategori: "Yedek Parça", tedarikci: "", alis_fiyati_usd: "", alis_fiyati: 0, satis_fiyati: 0, stok_adedi: 0, alis_tarihi: new Date().toISOString().split('T')[0] });
        fetchStocks();
    } else {
        alert("Hata: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
      if(!confirm("Bu stok kartını silmek istediğinize emin misiniz?")) return;
      await supabase.from('aura_stok').delete().eq('id', id);
      fetchStocks();
  };

  const openEdit = (item: any) => {
      setFormData({ ...item, alis_fiyati_usd: "" }); // Düzenlerken USD sıfırlanır, TL baz alınır
      setOldStockCount(item.stok_adedi); 
      setIsModalOpen(true);
  };

  const filteredStocks = stocks.filter(s => 
    s.urun_adi.toLowerCase().includes(filterText.toLowerCase()) || 
    s.stok_kodu?.toLowerCase().includes(filterText.toLowerCase()) ||
    s.tedarikci?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 font-sans">
        {/* HEADER & STATS */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <Package className="text-yellow-500" size={28}/> STOK YÖNETİMİ
                </h1>
                <p className="text-slate-500 text-xs mt-1 font-mono flex items-center gap-2">
                    ENVANTER TAKİBİ <span className="text-slate-600">|</span> 
                    <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <DollarSign size={10}/> USD: {dolarKuru.toFixed(2)} ₺
                    </span>
                </p>
            </div>
            
            <div className="flex gap-4">
                <div className="bg-[#151921] border border-slate-800 p-3 rounded-xl min-w-[120px]">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">TOPLAM ADET</p>
                    <p className="text-xl font-black text-white">{totalCount}</p>
                </div>
                <div className="bg-[#151921] border border-slate-800 p-3 rounded-xl min-w-[140px]">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">STOK MALİYETİ</p>
                    <p className="text-xl font-black text-red-400">{totalValue.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-[#151921] border border-slate-800 p-3 rounded-xl min-w-[140px]">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">SATIŞ DEĞERİ</p>
                    <p className="text-xl font-black text-blue-400">{totalPotential.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-[#151921] border border-emerald-900/30 p-3 rounded-xl min-w-[140px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 opacity-20"><TrendingUp className="text-emerald-500" size={40}/></div>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase">TAHMİNİ KÂR</p>
                    <p className="text-xl font-black text-emerald-400">{totalProfit.toLocaleString('tr-TR')} ₺</p>
                </div>
            </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex justify-between items-center bg-[#151921] p-4 rounded-xl border border-slate-800 mb-6">
            <div className="relative w-full max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500" size={18}/>
                <input 
                    type="text" 
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Parça adı, stok kodu veya tedarikçi ara..." 
                    className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-yellow-500 transition-colors"
                />
            </div>
            <button onClick={() => { setFormData({ id: null, urun_adi: "", stok_kodu: "", kategori: "Yedek Parça", tedarikci: "", alis_fiyati_usd: "", alis_fiyati: 0, satis_fiyati: 0, stok_adedi: 0, alis_tarihi: new Date().toISOString().split('T')[0] }); setOldStockCount(0); setIsModalOpen(true); }} className="bg-yellow-600 hover:bg-yellow-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-yellow-900/20 active:scale-95 transition-all">
                <Plus size={18}/> YENİ EKLE
            </button>
        </div>

        {/* TABLE */}
        <div className="bg-[#151921] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                        <th className="p-4">STOK KODU</th>
                        <th className="p-4">ÜRÜN ADI</th>
                        <th className="p-4">KATEGORİ</th>
                        <th className="p-4">TEDARİKÇİ</th>
                        <th className="p-4 text-center">ADET</th>
                        <th className="p-4 text-right">ALIŞ</th>
                        <th className="p-4 text-right">SATIŞ</th>
                        <th className="p-4 text-right">İŞLEM</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr><td colSpan={8} className="p-8 text-center text-slate-500 animate-pulse">Yükleniyor...</td></tr>
                    ) : filteredStocks.length > 0 ? (
                        filteredStocks.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="p-4 text-slate-500 font-mono text-xs">{item.stok_kodu || "-"}</td>
                                <td className="p-4 font-bold text-white">{item.urun_adi}</td>
                                <td className="p-4 text-slate-400 text-xs"><span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">{item.kategori}</span></td>
                                <td className="p-4 text-cyan-500 text-xs font-bold">{item.tedarikci || "-"}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-3 py-1 rounded font-bold text-xs ${item.stok_adedi <= 2 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-white'}`}>
                                        {item.stok_adedi}
                                    </span>
                                </td>
                                <td className="p-4 text-right text-slate-400 font-mono">{item.alis_fiyati} ₺</td>
                                <td className="p-4 text-right text-green-400 font-bold font-mono">{item.satis_fiyati} ₺</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(item)} className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition-colors"><Edit size={14}/></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={14}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={8} className="p-8 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* MODAL */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#1e293b] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                    <div className="p-5 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                        <h2 className="text-white font-bold flex items-center gap-2"><Package size={20} className="text-yellow-500"/> {formData.id ? "STOK DÜZENLE" : "YENİ STOK GİRİŞİ"}</h2>
                        <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400 hover:text-white"/></button>
                    </div>
                    
                    <div className="p-6 grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 mb-1 block">ÜRÜN ADI</label>
                            <input type="text" value={formData.urun_adi} onChange={e => setFormData({...formData, urun_adi: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-sm outline-none focus:border-yellow-500" placeholder="Örn: iPhone 11 Ekran (Orijinal)"/>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1"><Barcode size={10}/> STOK KODU (OTOMATİK)</label>
                            <input type="text" value={formData.stok_kodu} onChange={e => setFormData({...formData, stok_kodu: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-sm outline-none focus:border-yellow-500" placeholder="Örn: IP11-2342"/>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1"><Tag size={10}/> KATEGORİ</label>
                            <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-sm outline-none">
                                <option>Yedek Parça</option>
                                <option>Aksesuar</option>
                                <option>Sarf Malzeme</option>
                                <option>Cihaz</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1"><User size={10}/> TEDARİKÇİ / NEREDEN?</label>
                            <input type="text" value={formData.tedarikci} onChange={e => setFormData({...formData, tedarikci: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-sm outline-none focus:border-yellow-500" placeholder="Örn: Tahtakale İletişim"/>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1"><Calendar size={10}/> ALIŞ TARİHİ</label>
                            <input type="date" value={formData.alis_tarihi} onChange={e => setFormData({...formData, alis_tarihi: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-sm outline-none focus:border-yellow-500"/>
                        </div>

                        {/* --- YENİ EKLENEN: DOLAR & TL HESAPLAMA --- */}
                        <div className="col-span-2 grid grid-cols-3 gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                             <div>
                                <label className="text-[10px] font-bold text-blue-400 mb-1 flex items-center gap-1"><DollarSign size={10}/> ALIŞ ($)</label>
                                <input type="number" value={formData.alis_fiyati_usd} onChange={(e) => handleUsdChange(e.target.value)} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-sm font-mono outline-none focus:border-blue-500" placeholder="USD"/>
                             </div>
                             <div>
                                <label className="text-[10px] font-bold text-red-400 mb-1 flex items-center gap-1">ALIŞ (TL) MALİYET</label>
                                <input type="number" value={formData.alis_fiyati} onChange={e => setFormData({...formData, alis_fiyati: Number(e.target.value), alis_fiyati_usd: ""})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-sm font-mono outline-none focus:border-red-500"/>
                             </div>
                             <div className="flex flex-col justify-center items-center text-[10px] text-slate-500 font-mono">
                                 <span>GÜNCEL KUR</span>
                                 <span className="text-emerald-400 text-lg font-bold">{dolarKuru.toFixed(2)} ₺</span>
                             </div>
                        </div>

                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-green-400 mb-1 flex items-center gap-1"><DollarSign size={10}/> SATIŞ FİYATI (TL)</label>
                            <input type="number" value={formData.satis_fiyati} onChange={e => setFormData({...formData, satis_fiyati: Number(e.target.value)})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-sm font-mono outline-none focus:border-green-500"/>
                        </div>

                        <div className="col-span-1">
                            <label className="text-[10px] font-bold text-yellow-500 mb-1 block">STOK ADEDİ</label>
                            <input type="number" value={formData.stok_adedi} onChange={e => setFormData({...formData, stok_adedi: Number(e.target.value)})} className="w-full bg-[#0b0e14] border border-slate-600 rounded-lg p-3 text-white text-xl font-black text-center outline-none focus:border-yellow-500"/>
                        </div>
                    </div>

                    <div className="p-5 bg-slate-900 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500">* Stok artışı GİDER olarak kaydedilir.</span>
                        <div className="flex gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-bold text-xs transition-colors">İPTAL</button>
                            <button onClick={handleSave} className="px-8 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-bold text-xs shadow-lg transition-all active:scale-95">KAYDET</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}