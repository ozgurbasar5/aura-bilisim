"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, TrendingDown, TrendingUp, Plus, 
  ArrowUpRight, ArrowDownRight, FileText, 
  PieChart, Trash2, Calendar, Wrench, ShoppingBag, 
  Printer, Filter, Download, ToggleLeft, ToggleRight
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function FinansYonetimi() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // TARİH FİLTRESİ AYARLARI
  const [useDateFilter, setUseDateFilter] = useState(true); 

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState({
    start: firstDay,
    end: lastDay
  });

  // Veriler
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    filteredCount: 0
  });

  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "Genel",
    method: "Nakit"
  });

  useEffect(() => {
    fetchFinanceData();
  }, [dateRange, useDateFilter]);

  const fetchFinanceData = async () => {
    setLoading(true);
    
    const startISO = `${dateRange.start}T00:00:00`;
    const endISO = `${dateRange.end}T23:59:59`;

    // 1. MAĞAZA SATIŞLARI
    let salesQuery = supabase
      .from('satis_gecmisi')
      .select('*')
      .eq('durum', 'Tamamlandı')
      .order('created_at', { ascending: false });
    
    if (useDateFilter) {
        salesQuery = salesQuery.gte('created_at', startISO).lte('created_at', endISO);
    }

    // 2. ATÖLYE (SERVİS) GELİRLERİ
    let jobsQuery = supabase
      .from('aura_jobs')
      .select('*')
      .or('status.eq.Teslim Edildi,status.eq.Tamamlandı') 
      .order('created_at', { ascending: false });

    if (useDateFilter) {
        jobsQuery = jobsQuery.gte('created_at', startISO).lte('created_at', endISO);
    }

    // 3. GİDERLER
    let expensesQuery = supabase
      .from('aura_finans')
      .select('*')
      .eq('tur', 'Gider')
      .order('created_at', { ascending: false });

    if (useDateFilter) {
        expensesQuery = expensesQuery.gte('created_at', startISO).lte('created_at', endISO);
    }

    const [salesRes, jobsRes, expensesRes] = await Promise.all([salesQuery, jobsQuery, expensesQuery]);
    
    const sales = salesRes.data || [];
    const jobs = jobsRes.data || [];
    const expenses = expensesRes.data || [];

    const combined = [
        ...sales.map(s => ({ 
            id: `S-${s.id}`, realId: s.id, source: 'store', type: 'income', 
            title: s.urunler || 'Mağaza Satışı', tutar: parseFloat(s.tutar), 
            date: s.created_at, kategori: 'Mağaza'
        })),
        ...jobs.map(j => ({ 
            id: `J-${j.id}`, realId: j.id, source: 'service', type: 'income', 
            title: `${j.device} - ${j.customer}`, tutar: parseFloat(j.price || 0), 
            date: j.updated_at || j.created_at, kategori: 'Teknik Servis'
        })),
        ...expenses.map(e => ({ 
            id: `E-${e.id}`, realId: e.id, source: 'expense', type: 'expense', 
            title: e.baslik, tutar: parseFloat(e.tutar), 
            date: e.created_at, kategori: e.kategori 
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalInc = combined.filter(x => x.type === 'income').reduce((acc, curr) => acc + curr.tutar, 0);
    const totalExp = combined.filter(x => x.type === 'expense').reduce((acc, curr) => acc + curr.tutar, 0);

    setTransactions(combined);
    setStats({
        totalIncome: totalInc,
        totalExpense: totalExp,
        netBalance: totalInc - totalExp,
        filteredCount: combined.length
    });
    setLoading(false);
  };

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) return alert("Başlık ve Tutar zorunlu.");

    const { error } = await supabase.from('aura_finans').insert([{
        tur: 'Gider',
        baslik: newExpense.title,
        tutar: parseFloat(newExpense.amount),
        kategori: newExpense.category,
        odeme_yontemi: newExpense.method,
        tarih: new Date().toISOString()
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
    await supabase.from('aura_finans').delete().eq('id', id);
    fetchFinanceData();
  };

  // --- PDF RAPOR OLUŞTURMA ---
  const generatePDF = async () => {
    try {
        const doc = new jsPDF();
        
        // --- 1. KURUMSAL HEADER (Lacivert Bant) ---
        doc.setFillColor(15, 23, 42); // Slate-900 (Koyu Lacivert)
        doc.rect(0, 0, 210, 40, 'F'); 

        // --- 2. LOGO EKLEME (public/image/aura-logo.png) ---
        const logoUrl = '/image/aura-logo.png';
        const logoImg = new Image();
        logoImg.src = logoUrl;
        
        // Resmi yüklemek için Promise kullanıyoruz
        await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = reject;
        });

        // Logo Yerleşimi (x, y, w, h)
        doc.addImage(logoImg, 'PNG', 14, 5, 30, 30); // 30x30 boyutunda

        // --- 3. BAŞLIK VE FİRMA BİLGİSİ ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255); // Beyaz
        doc.text("AURA", 50, 20);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(6, 182, 212); // Cyan
        doc.text("BILISIM", 78, 20);

        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.text("TEKNOLOJI VE YAZILIM USSU", 50, 26);

        // --- 4. RAPOR BİLGİLERİ (Sağ Üst) ---
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text("FINANSAL RAPOR", 195, 15, { align: "right" });
        
        doc.setFontSize(8);
        doc.setTextColor(203, 213, 225); 
        const tarihMetni = useDateFilter 
            ? `${new Date(dateRange.start).toLocaleDateString('tr-TR')} - ${new Date(dateRange.end).toLocaleDateString('tr-TR')}`
            : "TUM ZAMANLAR";
        doc.text(tarihMetni, 195, 22, { align: "right" });
        doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 195, 28, { align: "right" });

        // --- 5. FİNANSAL ÖZET KARTLARI ---
        let yPos = 55;
        
        // Gelir Kutusu
        doc.setDrawColor(34, 197, 94); // Yeşil Çerçeve
        doc.setFillColor(240, 253, 244); 
        doc.roundedRect(14, yPos, 45, 25, 3, 3, 'FD');
        doc.setFontSize(10);
        doc.setTextColor(21, 128, 61);
        doc.text("Toplam Gelir", 36.5, yPos + 8, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${stats.totalIncome.toLocaleString('tr-TR')} TL`, 36.5, yPos + 18, { align: "center" });

        // Gider Kutusu
        doc.setDrawColor(239, 68, 68); 
        doc.setFillColor(254, 242, 242); 
        doc.roundedRect(65, yPos, 45, 25, 3, 3, 'FD');
        doc.setFontSize(10);
        doc.setTextColor(185, 28, 28);
        doc.text("Toplam Gider", 87.5, yPos + 8, { align: "center" });
        doc.setFontSize(12);
        doc.text(`${stats.totalExpense.toLocaleString('tr-TR')} TL`, 87.5, yPos + 18, { align: "center" });

        // Net Kasa Kutusu
        doc.setDrawColor(59, 130, 246); 
        doc.setFillColor(239, 246, 255); 
        doc.roundedRect(116, yPos, 45, 25, 3, 3, 'FD');
        doc.setFontSize(10);
        doc.setTextColor(29, 78, 216);
        doc.text("Net Kasa", 138.5, yPos + 8, { align: "center" });
        doc.setFontSize(12);
        doc.text(`${stats.netBalance.toLocaleString('tr-TR')} TL`, 138.5, yPos + 18, { align: "center" });

        // İşlem Sayısı
        doc.setDrawColor(100); 
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(167, yPos, 30, 25, 3, 3, 'FD');
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text("Islem", 182, yPos + 8, { align: "center" });
        doc.setFontSize(12);
        doc.text(`${stats.filteredCount}`, 182, yPos + 18, { align: "center" });

        // --- 6. TABLO ---
        const tableRows = transactions.map(t => [
            new Date(t.date).toLocaleDateString('tr-TR'),
            t.source === 'service' ? 'SERVIS' : t.source === 'store' ? 'MAGAZA' : 'GIDER',
            t.title,
            t.kategori,
            t.type === 'income' ? `+${t.tutar.toLocaleString('tr-TR')} TL` : `-${t.tutar.toLocaleString('tr-TR')} TL`
        ]);

        autoTable(doc, {
            startY: yPos + 35,
            head: [['Tarih', 'Kaynak', 'Aciklama', 'Kategori', 'Tutar']],
            body: tableRows,
            theme: 'grid',
            headStyles: { 
                fillColor: [15, 23, 42], 
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: { 
                fontSize: 9, 
                cellPadding: 3,
                lineColor: [226, 232, 240] 
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252] 
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 25, fontStyle: 'bold' },
                4: { halign: 'right', fontStyle: 'bold' } 
            },
            didParseCell: function(data) {
                if (data.section === 'body' && data.column.index === 4) {
                    const text = data.cell.raw as string;
                    if (text.startsWith('+')) {
                        data.cell.styles.textColor = [22, 163, 74]; // Yeşil
                    } else {
                        data.cell.styles.textColor = [220, 38, 38]; // Kırmızı
                    }
                }
            }
        });

        // --- 7. FOOTER ---
        const pageCount = (doc as any).internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setDrawColor(200);
            doc.line(14, 280, 196, 280);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Aura Bilisim Yonetim Sistemleri`, 14, 288);
            doc.text(`Sayfa ${i} / ${pageCount}`, 196, 288, { align: 'right' });
        }

        doc.save(`Aura_Finans_${new Date().toISOString().slice(0,10)}.pdf`);
    
    } catch (error: any) {
        console.error("PDF Hatası:", error);
        alert("PDF oluşturulurken bir hata oluştu: " + error.message);
    }
  };

  return (
    <div className="min-h-screen text-slate-200 pb-20 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            FİNANS & KASA
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20 tracking-wide">NAKİT AKIŞI</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm">
            {useDateFilter 
                ? `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()} arası veriler.` 
                : "Tüm zamanların verileri gösteriliyor."}
          </p>
        </div>

        {/* ARAÇLAR */}
        <div className="flex flex-wrap items-center gap-3 bg-[#151a25] p-2 rounded-xl border border-white/10">
            
            <button 
                onClick={() => setUseDateFilter(!useDateFilter)} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                    useDateFilter 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
            >
                {useDateFilter ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
                {useDateFilter ? 'FİLTRE AÇIK' : 'TÜMÜNÜ GÖSTER'}
            </button>

            {useDateFilter && (
                <div className="flex items-center gap-2 bg-[#0b0e14] p-1 rounded-lg border border-white/10 animate-in slide-in-from-left-2 fade-in">
                    <input 
                        type="date" 
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                        className="bg-transparent text-white text-xs p-1 outline-none cursor-pointer"
                    />
                    <span className="text-slate-500">-</span>
                    <input 
                        type="date" 
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                        className="bg-transparent text-white text-xs p-1 outline-none cursor-pointer"
                    />
                </div>
            )}
            
            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

            <button onClick={generatePDF} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
                <Printer size={16}/> RAPOR (PDF)
            </button>
            
            <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-red-500/20">
                <TrendingDown size={16}/> GİDER EKLE
            </button>
        </div>
      </div>

      {/* --- KARTLAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* NET KASA */}
          <div className="bg-[#151a25] border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><Wallet size={24}/></div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${stats.netBalance >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {stats.netBalance >= 0 ? 'Kârda' : 'Zararda'}
                  </span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                  NET KASA DURUMU
              </p>
              <h2 className={`text-4xl font-black ${stats.netBalance >= 0 ? 'text-white' : 'text-red-400'}`}>{stats.netBalance.toLocaleString('tr-TR')} ₺</h2>
          </div>

          {/* TOPLAM GELİR */}
          <div className="bg-[#151a25] border border-slate-800 p-6 rounded-2xl relative overflow-hidden hover:border-green-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><TrendingUp size={24}/></div>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">GELİR TOPLAMI</p>
              <h2 className="text-3xl font-bold text-green-400">+{stats.totalIncome.toLocaleString('tr-TR')} ₺</h2>
              <p className="text-[10px] text-slate-500 mt-2 flex gap-2 font-mono">
                  <span>Atölye + Mağaza</span>
              </p>
          </div>

          {/* TOPLAM GİDER */}
          <div className="bg-[#151a25] border border-slate-800 p-6 rounded-2xl relative overflow-hidden hover:border-red-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-500/10 rounded-xl text-red-400"><TrendingDown size={24}/></div>
                  {useDateFilter && <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Calendar size={12}/> Bu Aralık</span>}
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">GİDER TOPLAMI</p>
              <h2 className="text-3xl font-bold text-red-400">-{stats.totalExpense.toLocaleString('tr-TR')} ₺</h2>
          </div>
      </div>

      {/* --- HAREKET GEÇMİŞİ TABLOSU --- */}
      <div className="bg-[#151a25] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#1e2532]">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <FileText size={18} className="text-indigo-400"/> 
                  <span>
                      HESAP HAREKETLERİ 
                      <span className="text-slate-500 text-xs ml-2 font-normal">
                          {useDateFilter 
                            ? `(${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()})` 
                            : '(TÜM KAYITLAR)'}
                      </span>
                  </span>
              </h3>
              <span className="text-xs text-slate-500 font-bold bg-[#0b0e14] px-3 py-1 rounded-full">{stats.filteredCount} İşlem</span>
          </div>
          
          <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
              <table className="w-full text-left border-collapse">
                  <thead className="bg-[#0b0e14] text-xs uppercase text-slate-500 font-bold sticky top-0 z-10 shadow-sm">
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
                          <tr><td colSpan={6} className="p-8 text-center text-slate-500">Veriler analiz ediliyor...</td></tr>
                      ) : transactions.length === 0 ? (
                          <tr><td colSpan={6} className="p-8 text-center text-slate-500">Bu kriterlere uygun kayıt bulunamadı.</td></tr>
                      ) : (
                        transactions.map((tx, i) => (
                          <tr key={i} className="hover:bg-slate-800/50 transition-colors group">
                              <td className="p-4 text-slate-400 text-xs font-mono">
                                  {new Date(tx.date).toLocaleDateString('tr-TR')}
                              </td>
                              <td className="p-4">
                                   {tx.source === 'service' && <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded w-fit border border-blue-500/20"><Wrench size={10}/> SERVİS</span>}
                                   {tx.source === 'store' && <span className="flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded w-fit border border-purple-500/20"><ShoppingBag size={10}/> MAĞAZA</span>}
                                   {tx.source === 'expense' && <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded w-fit border border-red-500/20"><TrendingDown size={10}/> GİDER</span>}
                              </td>
                              <td className="p-4 font-bold text-white text-xs">
                                  {tx.title}
                              </td>
                              <td className="p-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">{tx.kategori}</td>
                              <td className={`p-4 font-bold text-right font-mono ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                  {tx.type === 'income' ? '+' : '-'}{parseFloat(tx.tutar).toLocaleString('tr-TR')} ₺
                              </td>
                              <td className="p-4 text-center">
                                  {tx.source === 'expense' ? (
                                      <button onClick={() => handleDeleteExpense(tx.realId)} className="p-2 text-slate-600 hover:text-red-500 transition-colors bg-white/5 rounded-lg opacity-0 group-hover:opacity-100" title="Sil">
                                          <Trash2 size={14}/>
                                      </button>
                                  ) : (
                                      <span className="text-[10px] text-slate-600 opacity-50">Oto</span>
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
             <div className="bg-[#151a25] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><Trash2 size={18} className="rotate-45"/></button> 
                 
                 <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <div className="p-2 bg-red-500/20 rounded-lg text-red-500"><TrendingDown size={20}/></div>
                     GİDER / ÖDEME EKLE
                 </h2>
                 
                 <div className="space-y-4">
                     <div>
                         <label className="text-xs font-bold text-slate-500 block mb-1">AÇIKLAMA</label>
                         <input 
                           type="text" 
                           placeholder="Örn: Haziran Dükkan Kirası" 
                           className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors placeholder:text-slate-600 text-sm"
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
                                className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none font-bold font-mono transition-colors placeholder:text-slate-600 text-sm"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                             />
                         </div>
                         <div>
                             <label className="text-xs font-bold text-slate-500 block mb-1">KATEGORİ</label>
                             <select 
                                className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none text-sm cursor-pointer"
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
                           className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none text-sm cursor-pointer"
                           value={newExpense.method}
                           onChange={(e) => setNewExpense({...newExpense, method: e.target.value})}
                         >
                             <option>Nakit Kasadan</option>
                             <option>Banka Hesabından</option>
                             <option>Kredi Kartı</option>
                         </select>
                     </div>
                 </div>

                 <div className="flex gap-3 mt-8 pt-4 border-t border-white/5">
                     <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-400 font-bold hover:bg-white/5 rounded-xl transition-colors text-sm">İPTAL</button>
                     <button onClick={handleAddExpense} className="flex-[2] bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-900/40 transition-transform active:scale-95 text-sm flex items-center justify-center gap-2">
                         KAYDET
                     </button>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
}