"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  TrendingUp, ShoppingCart, CreditCard, Users, 
  Package, History, Search, 
  MoreHorizontal, PlusCircle, BarChart3, 
  Wallet, Printer, X, CheckCircle2, Loader2, RefreshCw, AlertCircle 
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; // Supabase bağlantısı

export default function SatisYonetimPaneli() {
  // --- STATE'LER ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [dateStr, setDateStr] = useState("");
  
  // Veritabanından çekilecek gerçek veriler
  const [sales, setSales] = useState<any[]>([]);
  
  // İstatistikler
  const [stats, setStats] = useState({
    ciro: 0,
    satisAdet: 0,
    sepetOrt: 0,
    bekleyen: 0
  });

  // Yeni Satış Formu
  const [newSale, setNewSale] = useState({
    customer: "",
    items: "",
    price: "",
    method: "Nakit",
    status: "Tamamlandı"
  });

  // --- VERİ ÇEKME VE HESAPLAMA ---
  const fetchSales = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Supabase'den 'satis_gecmisi' tablosunu çek
      const { data, error } = await supabase
        .from('satis_gecmisi')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSales(data || []);
      calculateStats(data || []);
    } catch (err: any) {
      console.error("Veri hatası:", err);
      setErrorMsg("Veri çekilemedi. Tablo oluşturulmamış olabilir.");
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStats = (data: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalCiro = 0;
    let dailyCount = 0;
    let pendingAmount = 0;

    data.forEach(item => {
      const price = parseFloat(item.tutar) || 0;
      const saleDate = new Date(item.created_at);

      // Toplam Ciro (Sadece Tamamlananlar)
      if (item.durum === 'Tamamlandı') {
        // Bugün yapılan satışlar ciroya eklenir (İsterseniz tarih kontrolünü kaldırıp tüm zamanları yapabilirsiniz)
        // Burada GÜNLÜK Ciro mantığı işliyor:
        if (saleDate >= today) {
           totalCiro += price;
           dailyCount++;
        }
      }

      // Bekleyen Tahsilat (Tarihten bağımsız tüm bekleyenler)
      if (item.durum === 'Onay Bekliyor' || item.durum === 'Veresiye') {
        pendingAmount += price;
      }
    });

    setStats({
      ciro: totalCiro,
      satisAdet: dailyCount,
      sepetOrt: dailyCount > 0 ? Math.floor(totalCiro / dailyCount) : 0,
      bekleyen: pendingAmount
    });
  };

  // --- SAYFA YÜKLENDİĞİNDE VE REALTIME ---
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }));
    
    // İlk Yükleme
    fetchSales();

    // GERÇEK ZAMANLI DİNLEME (REALTIME)
    const channel = supabase
      .channel('satis_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'satis_gecmisi' },
        (payload) => {
          console.log('Değişiklik algılandı:', payload);
          fetchSales(); // Bir değişiklik olduğunda verileri tekrar çek
        }
      )
      .subscribe();

    // Temizlik
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSales]);

  // --- İŞLEMLER ---

  const handlePrint = () => {
    window.print();
  };

  const handleSaveSale = async () => {
    if (!newSale.items || !newSale.price) {
      alert("Lütfen ürün adı ve fiyat giriniz!");
      return;
    }

    const priceNum = parseFloat(newSale.price);

    try {
      const { error } = await supabase
        .from('satis_gecmisi')
        .insert([
          {
            musteri: newSale.customer || "Misafir Müşteri",
            urunler: newSale.items,
            tutar: priceNum,
            odeme_yontemi: newSale.method,
            durum: newSale.status,
          }
        ]);

      if (error) throw error;

      // Realtime zaten dinlediği için fetchSales'i manuel çağırmaya gerek yok ama garanti olsun:
      fetchSales();

      // Formu Sıfırla ve Kapat
      setNewSale({ customer: "", items: "", price: "", method: "Nakit", status: "Tamamlandı" });
      setIsModalOpen(false);
      
    } catch (error: any) {
      alert("Kayıt hatası: " + error.message);
    }
  };

  return (
    <div className="min-h-screen text-slate-200 pb-20 animate-in fade-in duration-500">
      
      {/* --- YAZDIRMA BAŞLIĞI (Sadece Yazıcıda) --- */}
      <div className="hidden print:block text-black mb-8 border-b-2 border-black pb-4">
          <div className="flex justify-between items-center">
              <div>
                  <h1 className="text-3xl font-bold uppercase tracking-widest">SATIŞ VE CİRO RAPORU</h1>
                  <p className="text-sm font-mono mt-1">AURA BİLİŞİM TEKNOLOJİLERİ</p>
              </div>
              <div className="text-right">
                  <p className="font-bold">{dateStr}</p>
                  <p className="text-xs">Oluşturan: Sistem</p>
              </div>
          </div>
      </div>

      {/* --- EKRAN BAŞLIĞI (Yazıcıda Gizli) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            SATIŞ YÖNETİMİ
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 tracking-wide">POS TERMINAL v3.0 (LIVE)</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm">Anlık satış verileri ve kasa durumu.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchSales} className="bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-400 hover:text-white px-3 py-2.5 rounded-xl transition-all" title="Yenile">
                <RefreshCw size={18} className={loading ? "animate-spin" : ""}/>
            </button>
            <button onClick={handlePrint} className="bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm">
                <Printer size={16}/> Rapor Yazdır
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-cyan-900/40 transition-all flex items-center gap-2 text-sm transform hover:scale-105 active:scale-95">
                <PlusCircle size={18}/> HIZLI SATIŞ YAP
            </button>
        </div>
      </div>

      {/* --- HATA MESAJI VARSA --- */}
      {errorMsg && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm print:hidden">
            <AlertCircle size={20}/> {errorMsg}
        </div>
      )}

      {/* --- İSTATİSTİKLER --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:grid-cols-4 print:gap-2">
        {/* CİRO */}
        <div className="bg-[#0f172a] border border-green-500/20 bg-green-500/5 rounded-2xl p-5 relative overflow-hidden group print:bg-white print:border-2 print:border-black print:text-black">
            <div className="relative z-10">
              <div className="flex justify-between">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 print:text-black">GÜNLÜK CİRO</p>
                <TrendingUp size={16} className="text-green-400 print:hidden"/>
              </div>
              <h3 className="text-2xl font-black text-white print:text-black">₺{stats.ciro.toLocaleString('tr-TR')}</h3>
            </div>
        </div>

        {/* GÜNLÜK ADET */}
        <div className="bg-[#0f172a] border border-blue-500/20 bg-blue-500/5 rounded-2xl p-5 relative overflow-hidden group print:bg-white print:border-2 print:border-black print:text-black">
            <div className="relative z-10">
              <div className="flex justify-between">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 print:text-black">BUGÜNKÜ SATIŞ</p>
                <ShoppingCart size={16} className="text-blue-400 print:hidden"/>
              </div>
              <h3 className="text-2xl font-black text-white print:text-black">{stats.satisAdet} Adet</h3>
            </div>
        </div>

        {/* ORT SEPET */}
        <div className="bg-[#0f172a] border border-purple-500/20 bg-purple-500/5 rounded-2xl p-5 relative overflow-hidden group print:bg-white print:border-2 print:border-black print:text-black">
             <div className="relative z-10">
              <div className="flex justify-between">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 print:text-black">ORT. SEPET</p>
                <Wallet size={16} className="text-purple-400 print:hidden"/>
              </div>
              <h3 className="text-2xl font-black text-white print:text-black">₺{stats.sepetOrt.toLocaleString('tr-TR')}</h3>
            </div>
        </div>

        {/* BEKLEYEN */}
        <div className="bg-[#0f172a] border border-orange-500/20 bg-orange-500/5 rounded-2xl p-5 relative overflow-hidden group print:bg-white print:border-2 print:border-black print:text-black">
             <div className="relative z-10">
              <div className="flex justify-between">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 print:text-black">TAHSİLAT BEKLEYEN</p>
                <CreditCard size={16} className="text-orange-400 print:hidden"/>
              </div>
              <h3 className="text-2xl font-black text-white print:text-black">₺{stats.bekleyen.toLocaleString('tr-TR')}</h3>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* --- SOL MENÜ (Yazıcıda Yok) --- */}
          <div className="xl:col-span-1 space-y-6 print:hidden">
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 relative">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <MoreHorizontal size={16} className="text-cyan-400"/> HIZLI MENÜ
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                      <Link href="/epanel/magaza" className="bg-[#1e293b] hover:bg-cyan-900/20 border border-slate-700 hover:border-cyan-500/50 p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all group">
                          <Package size={24} className="text-slate-400 group-hover:text-cyan-400"/>
                          <span className="text-xs font-bold text-slate-300">Ürünler</span>
                      </Link>
                      <Link href="/epanel/hizli-kayit" className="bg-[#1e293b] hover:bg-purple-900/20 border border-slate-700 hover:border-purple-500/50 p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all group">
                          <Users size={24} className="text-slate-400 group-hover:text-purple-400"/>
                          <span className="text-xs font-bold text-slate-300">Müşteriler</span>
                      </Link>
                      <button onClick={handlePrint} className="bg-[#1e293b] hover:bg-green-900/20 border border-slate-700 hover:border-green-500/50 p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all group">
                          <BarChart3 size={24} className="text-slate-400 group-hover:text-green-400"/>
                          <span className="text-xs font-bold text-slate-300">Rapor Al</span>
                      </button>
                      <Link href="/epanel/finans" className="bg-[#1e293b] hover:bg-orange-900/20 border border-slate-700 hover:border-orange-500/50 p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all group">
                          <Wallet size={24} className="text-slate-400 group-hover:text-orange-400"/>
                          <span className="text-xs font-bold text-slate-300">Kasa</span>
                      </Link>
                  </div>
              </div>
          </div>

          {/* --- SAĞ TABLO (Yazıcıda Tam Sayfa) --- */}
          <div className="xl:col-span-2 print:col-span-3 print:w-full">
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-full print:border-none print:bg-white print:shadow-none">
                  
                  {/* Tablo Başlığı */}
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#162032] print:bg-white print:border-b-2 print:border-black">
                      <h3 className="font-bold text-white flex items-center gap-2 print:text-black">
                          <History size={18} className="text-cyan-400 print:hidden"/> GEÇMİŞ İŞLEMLER
                      </h3>
                      {/* Arama Kutusu (Yazıcıda Gizli) */}
                      <div className="relative print:hidden">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                          <input type="text" placeholder="Ara..." className="bg-[#020617] border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:border-cyan-500 outline-none w-48"/>
                      </div>
                  </div>
                  
                  {/* Tablo İçeriği */}
                  <div className="overflow-x-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full p-10 gap-3 text-slate-500">
                            <Loader2 className="animate-spin" size={32}/> Veriler Yükleniyor...
                        </div>
                    ) : sales.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-10 gap-3 text-slate-500 border-t border-slate-800">
                            <History size={32} className="opacity-20"/> Henüz kayıt bulunamadı.
                        </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-[#0b1121] text-xs uppercase text-slate-500 font-bold sticky top-0 print:bg-white print:text-black print:border-b">
                              <tr>
                                  <th className="p-4 border-b border-slate-800 print:border-black">Tarih</th>
                                  <th className="p-4 border-b border-slate-800 print:border-black">Müşteri</th>
                                  <th className="p-4 border-b border-slate-800 print:border-black">Ürün / Hizmet</th>
                                  <th className="p-4 border-b border-slate-800 print:border-black">Tutar</th>
                                  <th className="p-4 border-b border-slate-800 print:border-black">Durum</th>
                              </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-800 print:divide-slate-300 print:text-black">
                              {sales.map((sale) => (
                                  <tr key={sale.id} className="hover:bg-slate-800/50 transition-colors print:hover:bg-transparent">
                                      <td className="p-4 font-mono text-slate-400 text-xs print:text-black">
                                        {new Date(sale.created_at).toLocaleDateString('tr-TR')} {new Date(sale.created_at).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                      </td>
                                      <td className="p-4 font-bold text-slate-200 print:text-black">{sale.musteri}</td>
                                      <td className="p-4 text-slate-400 text-xs max-w-[200px] truncate print:text-black print:whitespace-normal">{sale.urunler}</td>
                                      <td className="p-4 font-bold text-white print:text-black">₺{parseFloat(sale.tutar).toLocaleString('tr-TR')}</td>
                                      <td className="p-4">
                                          <span className={`flex items-center gap-1.5 text-xs font-bold ${
                                              sale.durum === 'Tamamlandı' ? 'text-emerald-400 print:text-black' : 
                                              sale.durum === 'İade' ? 'text-red-400 print:text-black' : 'text-amber-400 print:text-black'
                                          }`}>
                                              {sale.durum}
                                          </span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    )}
                  </div>

                  {/* İmza Alanı (Sadece Yazıcıda) */}
                  <div className="hidden print:flex justify-between items-end mt-12 px-8 pb-8">
                      <div className="text-center">
                          <p className="font-bold border-t border-black pt-2 w-40 text-sm">Muhasebe</p>
                      </div>
                      <div className="text-center">
                          <p className="font-bold border-t border-black pt-2 w-40 text-sm">Onay / İmza</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* --- HIZLI SATIŞ PENCERESİ (Yazıcıda Gizli) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200 p-4 print:hidden">
            <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#1e293b]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2"><PlusCircle className="text-cyan-400"/> HIZLI SATIŞ GİRİŞİ</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">ÜRÜN / HİZMET ADI</label>
                        <input 
                          type="text" 
                          placeholder="Örn: iPhone 11 Kılıf" 
                          className="w-full bg-[#020617] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                          value={newSale.items}
                          onChange={(e) => setNewSale({...newSale, items: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">FİYAT (TL)</label>
                            <input 
                              type="number" 
                              placeholder="0.00" 
                              className="w-full bg-[#020617] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none font-bold"
                              value={newSale.price}
                              onChange={(e) => setNewSale({...newSale, price: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">ÖDEME YÖNTEMİ</label>
                            <select 
                              className="w-full bg-[#020617] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                              value={newSale.method}
                              onChange={(e) => setNewSale({...newSale, method: e.target.value})}
                            >
                                <option>Nakit</option>
                                <option>Kredi Kartı</option>
                                <option>Havale / EFT</option>
                                <option>Veresiye</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">MÜŞTERİ (Opsiyonel)</label>
                        <input 
                          type="text" 
                          placeholder="Müşteri Adı Soyadı" 
                          className="w-full bg-[#020617] border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                          value={newSale.customer}
                          onChange={(e) => setNewSale({...newSale, customer: e.target.value})}
                        />
                    </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">DURUM</label>
                        <div className="flex gap-2">
                             {['Tamamlandı', 'Onay Bekliyor', 'İade'].map((s) => (
                                 <button 
                                  key={s}
                                  onClick={() => setNewSale({...newSale, status: s})}
                                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${newSale.status === s ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                                 >
                                     {s}
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-800 bg-[#1e293b] flex gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-700 transition-colors">İPTAL</button>
                    <button onClick={handleSaveSale} className="flex-[2] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/30 flex justify-center items-center gap-2">
                        <CheckCircle2 size={18}/> SATIŞI ONAYLA
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}