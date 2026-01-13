"use client";

import { useState, useEffect } from "react";
import { 
  Box, Plus, Trash2, Printer, Search, X, 
  Grid3X3, ArrowLeft 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react"; 

// Çekmece Yapılandırması: A-D arası satırlar, 1-10 arası sütunlar
const ROWS = ["A", "B", "C", "D"]; 
const COLS = 10;

export default function SanalCekmecePage() {
  const router = useRouter();
  
  // Verileri tutacak state
  const [drawerData, setDrawerData] = useState<Record<string, string[]>>({});
  const [selectedDrawer, setSelectedDrawer] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [printData, setPrintData] = useState<{id: string, items: string[]} | null>(null);

  // Verileri tarayıcı hafızasına (LocalStorage) kaydet/yükle
  useEffect(() => {
    const saved = localStorage.getItem("aura_drawers_v2");
    if (saved) setDrawerData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (Object.keys(drawerData).length > 0) {
      localStorage.setItem("aura_drawers_v2", JSON.stringify(drawerData));
    }
  }, [drawerData]);

  // Ekleme İşlemi
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItem.trim() || !selectedDrawer) return;
    
    setDrawerData(prev => {
      const currentItems = prev[selectedDrawer] || [];
      return { ...prev, [selectedDrawer]: [newItem.trim(), ...currentItems] };
    });
    setNewItem("");
  };

  // Silme İşlemi
  const handleRemoveItem = (drawerId: string, itemIndex: number) => {
    if(!confirm("Bu parçayı çekmeceden çıkarmak istiyor musunuz?")) return;
    setDrawerData(prev => {
      const currentItems = prev[drawerId] || [];
      const newItems = [...currentItems];
      newItems.splice(itemIndex, 1);
      return { ...prev, [drawerId]: newItems };
    });
  };

  // Yazdırma Hazırlığı
  const preparePrint = (drawerId: string) => {
    const items = drawerData[drawerId] || [];
    setPrintData({ id: drawerId, items });
    setTimeout(() => {
      window.print();
      setPrintData(null);
    }, 500);
  };

  // Arama Fonksiyonu
  const findDrawerByItem = (term: string) => {
    if (!term) return [];
    return Object.entries(drawerData)
      .filter(([key, items]) => items.some(i => i.toLowerCase().includes(term.toLowerCase())))
      .map(([key]) => key);
  };

  const searchResults = findDrawerByItem(searchTerm);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 font-sans relative overflow-hidden">
      
      {/* ÜST PANEL */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
        <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><ArrowLeft size={20}/></button>
            <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <Grid3X3 className="text-cyan-500" size={32}/> 
                SANAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">ÇEKMECE</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">A1 - D10 Atölye Düzeni</p>
            </div>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center bg-[#151921] border border-slate-700 rounded-xl overflow-hidden focus-within:border-cyan-500 transition-colors">
            <Search className="ml-3 text-slate-500" size={20}/>
            <input 
              type="text" 
              placeholder="Hangi parça nerede? (Örn: Vida)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none p-3 text-white outline-none placeholder:text-slate-600"
            />
            {searchTerm && <button onClick={() => setSearchTerm("")} className="mr-3 text-slate-500 hover:text-white"><X size={16}/></button>}
          </div>
        </div>
      </div>

      {/* IZGARA SİSTEMİ (GRID) */}
      <div className="max-w-7xl mx-auto grid gap-6 overflow-x-auto pb-10 print:hidden">
        {ROWS.map(row => (
          <div key={row} className="flex gap-4 items-center">
            {/* Satır Harfi */}
            <div className="w-12 h-12 flex justify-center items-center bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
              <span className="text-2xl font-black text-slate-500">{row}</span>
            </div>
            
            {/* Çekmeceler 1-10 */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3 flex-1">
              {Array.from({ length: COLS }, (_, i) => i + 1).map(col => {
                const id = `${row}${col}`;
                const items = drawerData[id] || [];
                const count = items.length;
                const isFound = searchResults.includes(id);
                
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedDrawer(id)}
                    className={`
                      relative h-24 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center group overflow-hidden
                      ${isFound 
                        ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)] z-10 scale-105'
                        : count > 0 
                            ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-cyan-500' 
                            : 'bg-[#0f1219] border-slate-800/50 hover:border-slate-600 opacity-70 hover:opacity-100'
                      }
                    `}
                  >
                    <span className={`text-lg font-black ${isFound ? 'text-yellow-400' : 'text-slate-500 group-hover:text-white'}`}>{id}</span>
                    
                    {count > 0 && (
                        <div className="absolute bottom-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/40 text-cyan-400 border border-cyan-500/30">
                            {count} Prç
                        </div>
                    )}
                    
                    {/* Doluluk Çizgisi */}
                    <div className="absolute bottom-0 left-0 h-1 bg-cyan-500 transition-all" style={{ width: `${Math.min(count * 10, 100)}%` }}></div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* DETAY MODALI (EKLE/ÇIKAR) */}
      {selectedDrawer && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 print:hidden" onClick={() => setSelectedDrawer(null)}>
          <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
            
            <div className="bg-slate-900 p-5 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  {selectedDrawer}
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Çekmece İçeriği</h2>
                  <p className="text-slate-400 text-xs">Toplam {(drawerData[selectedDrawer] || []).length} parça</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => preparePrint(selectedDrawer)} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors" title="Etiket Yazdır">
                  <Printer size={20}/>
                </button>
                <button onClick={() => setSelectedDrawer(null)} className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <X size={20}/>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-[#0b0e14]">
              {(drawerData[selectedDrawer] || []).length === 0 ? (
                <div className="text-center py-12 opacity-40">
                  <Box size={48} className="mx-auto mb-3 text-slate-600"/>
                  <p className="text-slate-500 text-sm">Bu çekmece boş.</p>
                </div>
              ) : (
                (drawerData[selectedDrawer] || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-[#151921] border border-slate-800 rounded-lg group hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0"></div>
                      <span className="text-sm font-medium text-slate-200 truncate">{item}</span>
                    </div>
                    <button onClick={() => handleRemoveItem(selectedDrawer, idx)} className="text-slate-600 hover:text-red-500 p-1.5 rounded hover:bg-red-500/10 transition-all">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-800 border-t border-slate-700">
              <form onSubmit={handleAddItem} className="flex gap-2">
                <input 
                  type="text" 
                  value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                  placeholder="Parça adı ekle..." 
                  className="flex-1 bg-[#0b0e14] border border-slate-600 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition-colors"
                  autoFocus
                />
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 rounded-lg font-bold transition-colors">
                  <Plus size={20}/>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* YAZDIRMA ŞABLONU (GİZLİ) */}
      <div id="printable-label" className="hidden">
        {printData && (
          <div className="w-[80mm] h-[50mm] border-2 border-black p-2 flex flex-col justify-between box-border bg-white text-black font-sans">
             <div className="flex justify-between items-start border-b-2 border-black pb-1 mb-1">
                <div>
                   <h1 className="text-5xl font-black leading-none tracking-tighter">{printData.id}</h1>
                   <p className="text-[9px] uppercase font-bold mt-1">AURA STOK</p>
                </div>
                <div className="w-14 h-14">
                    <QRCodeSVG value={`DRAWER:${printData.id}`} size={56} />
                </div>
             </div>
             <div className="flex-1 overflow-hidden">
                <ul className="text-[11px] font-bold leading-tight list-square pl-4 pt-1">
                   {printData.items.slice(0, 6).map((it, i) => (
                      <li key={i} className="mb-0.5 truncate">{it}</li>
                   ))}
                   {printData.items.length > 6 && <li className="italic text-[9px]">+ {printData.items.length - 6} parça daha...</li>}
                </ul>
             </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #printable-label, #printable-label * { visibility: visible; }
          #printable-label { 
            position: fixed; left: 0; top: 0; width: 80mm; height: 50mm; 
            display: flex !important; align-items: center; justify-content: center;
          }
          @page { size: auto; margin: 0; }
        }
      `}</style>
    </div>
  );
}