"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, TrendingDown, TrendingUp, Plus, 
  ArrowUpRight, ArrowDownRight, FileText, 
  PieChart, Trash2, Calendar, Wrench, ShoppingBag
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function FinansYonetimi() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Veriler
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    monthlyExpense: 0
  });

  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "Genel",
    method: "Nakit"
  });

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    setLoading(true);
    
    // 1. MAĞAZA SATIŞLARI (Hızlı Satış + Aura Store)
    const { data: sales } = await supabase
      .from('satis_gecmisi')
      .select('*')
      .eq('durum', 'Tamamlandı')
      .order('created_at', { ascending: false });

    // 2. ATÖLYE (SERVİS) GELİRLERİ
    const { data: jobs } = await supabase
      .from('aura_jobs')
      .select('*')
      .eq('status', 'Teslim Edildi') // Sadece teslim edilenler kasaya girer
      .order('created_at', { ascending: false });

    // 3. GİDERLER
    const { data: expenses } = await supabase
      .from('giderler')
      .select('*')
      .order('created_at', { ascending: false });

    // --- VERİLERİ BİRLEŞTİRME VE DÜZENLEME ---
    const allSales = sales || [];
    const allJobs = jobs || [];
    const allExpenses = expenses || [];
    
    // Hepsini tek bir "İşlem Listesi" haline getir
    const combined = [
        // Mağaza Satışları
        ...allSales.map(s => ({ 
            id: `S-${s.id}`,
            realId: s.id,
            source: 'store',
            type: 'income', 
            title: s.urunler || 'Mağaza Satışı', 
            tutar: parseFloat(s.tutar), 
            date: s.created_at,
            kategori: 'Mağaza'
        })),
        // Atölye (Servis) Gelirleri
        ...allJobs.map(j => ({ 
            id: `J-${j.id}`,
            realId: j.id,
            source: 'service',
            type: 'income', 
            title: `${j.device} - ${j.customer}`, 
            tutar: parseFloat(j.price || 0), 
            date: j.updated_at || j.created_at, // Teslim tarihi genelde update olur
            kategori: 'Teknik Servis'
        })),
        // Giderler
        ...allExpenses.map(e => ({ 
            id: `E-${e.id}`,
            realId: e.id,
            source: 'expense',
            type: 'expense', 
            title: e.baslik, 
            tutar: parseFloat(e.tutar), 
            date: e.created_at,
            kategori: e.kategori 
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // --- HESAPLAMALAR ---
    // Gelirler (Mağaza + Servis)
    const totalStoreIncome = allSales.reduce((acc, curr) => acc + (parseFloat(curr.tutar) || 0), 0);
    const totalServiceIncome = allJobs.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
    const totalInc = totalStoreIncome + totalServiceIncome;

    // Giderler
    const totalExp = allExpenses.reduce((acc, curr) => acc + (parseFloat(curr.tutar) || 0), 0);
    
    // Bu Ayki Gider
    const currentMonth = new Date().getMonth();
    const monthlyExp = allExpenses.reduce((acc, curr) => {
        const d = new Date(curr.created_at);
        return d.getMonth() === currentMonth ? acc + (parseFloat(curr.tutar) || 0) : acc;
    }, 0);

    setTransactions(combined);
    setStats({
        totalIncome: totalInc,
        totalExpense: totalExp,
        netBalance: totalInc - totalExp,
        monthlyExpense: monthlyExp
    });
    setLoading(false);
  };

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) return alert("Başlık ve Tutar zorunlu.");

    const { error } = await supabase.from('giderler').insert([{
        baslik: newExpense.title,
        tutar: parseFloat(newExpense.amount),
        kategori: newExpense.category,
        odeme_yontemi: newExpense.method
    }]);

    if (!error) {
        setIsModalOpen(false);
        setNewExpense({ title: "", amount: "", category: "Genel", method: "Nakit" });
        fetchFinanceData();
    } else {
        alert("Hata: " + error.message);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if(!confirm("Bu gider kaydını silmek istediğine emin misin?")) return;
    await supabase.from('giderler').delete().eq('id', id);
    fetchFinanceData();
  };

  return (
    <div className="min-h-screen text-slate-200 pb-20 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            FİNANS & KASA
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20 tracking-wide">NAKİT AKIŞI</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm">Servis gelirleri, mağaza satışları ve gider takibi.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-900/30 flex items-center gap-2 text-sm transition-all transform hover:scale-105 active:scale-95">
             <TrendingDown size={18}/> GİDER EKLE
        </button>
      </div>

      {/* --- KARTLAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* NET KASA */}
          <div className="bg-[#151a25] border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><Wallet size={24}/></div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${stats.netBalance >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {stats.netBalance >= 0 ? 'Kârda' : 'Zararda'}
                  </span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">NET KASA MEVCUDU</p>
              <h2 className={`text-4xl font-black ${stats.netBalance >= 0 ? 'text-white' : 'text-red-400'}`}>{stats.netBalance.toLocaleString('tr-TR')} ₺</h2>
          </div>

          {/* TOPLAM GELİR */}
          <div className="bg-[#151a25] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><TrendingUp size={24}/></div>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">TOPLAM GELİR</p>
              <h2 className="text-3xl font-bold text-green-400">+{stats.totalIncome.toLocaleString('tr-TR')} ₺</h2>
              <p className="text-[10px] text-slate-500 mt-2 flex gap-2">
                  <span>Atölye + Mağaza</span>
              </p>
          </div>

          {/* TOPLAM GİDER */}
          <div className="bg-[#151a25] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-500/10 rounded-xl text-red-400"><TrendingDown size={24}/></div>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Calendar size={12}/> Bu Ay: {stats.monthlyExpense.toLocaleString()} ₺</span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">TOPLAM GİDER</p>
              <h2 className="text-3xl font-bold text-red-400">-{stats.totalExpense.toLocaleString('tr-TR')} ₺</h2>
          </div>
      </div>

      {/* --- HAREKET GEÇMİŞİ TABLOSU --- */}
      <div className="bg-[#151a25] border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#1e2532]">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <FileText size={18} className="text-indigo-400"/> SON HESAP HAREKETLERİ
              </h3>
          </div>
          
          <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left border-collapse">
                  <thead className="bg-[#0b0e14] text-xs uppercase text-slate-500 font-bold sticky top-0">
                      <tr>
                          <th className="p-4 border-b border-slate-800">Tarih</th>
                          <th className="p-4 border-b border-slate-800">Kaynak</th>
                          <th className="p-4 border-b border-slate-800">İşlem / Açıklama</th>
                          <th className="p-4 border-b border-slate-800">Kategori</th>
                          <th className="p-4 border-b border-slate-800 text-right">Tutar</th>
                          <th className="p-4 border-b border-slate-800 text-center">İşlem</th>
                      </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-800">
                      {loading ? (
                          <tr><td colSpan={6} className="p-8 text-center text-slate-500">Hesaplar kontrol ediliyor...</td></tr>
                      ) : transactions.length === 0 ? (
                          <tr><td colSpan={6} className="p-8 text-center text-slate-500">Kayıt yok.</td></tr>
                      ) : (
                        transactions.map((tx, i) => (
                          <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                              <td className="p-4 text-slate-400 text-xs font-mono">
                                  {new Date(tx.date).toLocaleDateString('tr-TR')}
                              </td>
                              <td className="p-4">
                                   {tx.source === 'service' && <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded w-fit"><Wrench size={10}/> SERVİS</span>}
                                   {tx.source === 'store' && <span className="flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded w-fit"><ShoppingBag size={10}/> MAĞAZA</span>}
                                   {tx.source === 'expense' && <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded w-fit"><TrendingDown size={10}/> GİDER</span>}
                              </td>
                              <td className="p-4 font-bold text-white text-xs">
                                  {tx.title}
                              </td>
                              <td className="p-4 text-[10px] text-slate-400 font-bold uppercase">{tx.kategori}</td>
                              <td className={`p-4 font-bold text-right ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                  {tx.type === 'income' ? '+' : '-'}{parseFloat(tx.tutar).toLocaleString('tr-TR')} ₺
                              </td>
                              <td className="p-4 text-center">
                                  {tx.source === 'expense' ? (
                                      <button onClick={() => handleDeleteExpense(tx.realId)} className="p-2 text-slate-600 hover:text-red-500 transition-colors" title="Sil">
                                          <Trash2 size={16}/>
                                      </button>
                                  ) : (
                                      <span className="text-[10px] text-slate-600">Oto</span>
                                  )}
                              </td>
                          </tr>
                        ))
                      )}
                  </tbody>
              </table>
          </div>
      </div>

      {/* --- GİDER EKLEME MODALI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
             <div className="bg-[#151a25] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                 <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <TrendingDown className="text-red-500"/> GİDER / ÖDEME EKLE
                 </h2>
                 
                 <div className="space-y-4">
                     <div>
                         <label className="text-xs font-bold text-slate-500 block mb-1">AÇIKLAMA</label>
                         <input 
                            type="text" 
                            placeholder="Örn: Haziran Dükkan Kirası" 
                            className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                            value={newExpense.title}
                            onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                         />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="text-xs font-bold text-slate-500 block mb-1">TUTAR (TL)</label>
                             <input 
                                type="number" 
                                placeholder="0.00" 
                                className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none font-bold"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                             />
                         </div>
                         <div>
                             <label className="text-xs font-bold text-slate-500 block mb-1">KATEGORİ</label>
                             <select 
                                className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                             >
                                 <option>Genel</option>
                                 <option>Kira</option>
                                 <option>Fatura (Elektrik/Su/Net)</option>
                                 <option>Personel Maaşı</option>
                                 <option>Yemek / Mutfak</option>
                                 <option>Teknik Malzeme</option>
                                 <option>Vergi / Muhasebe</option>
                             </select>
                         </div>
                     </div>
                     <div>
                         <label className="text-xs font-bold text-slate-500 block mb-1">ÖDEME KAYNAĞI</label>
                         <select 
                            className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                            value={newExpense.method}
                            onChange={(e) => setNewExpense({...newExpense, method: e.target.value})}
                         >
                             <option>Nakit Kasadan</option>
                             <option>Banka Hesabından</option>
                             <option>Kredi Kartı</option>
                         </select>
                     </div>
                 </div>

                 <div className="flex gap-3 mt-6">
                     <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-400 font-bold hover:bg-white/5 rounded-xl transition-colors">İPTAL</button>
                     <button onClick={handleAddExpense} className="flex-[2] bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-900/40 transition-transform active:scale-95">
                         KAYDET
                     </button>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
}