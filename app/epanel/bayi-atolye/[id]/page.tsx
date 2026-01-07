"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Printer, User, Smartphone, Zap, Laptop, Watch, Box, 
  CheckSquare, ClipboardCheck, History, AlertTriangle, MessageCircle, Lock,
  Battery, Fan, Eye, ShieldCheck, Database, Wrench, HardDrive, Trash2, Camera, Upload, X,
  CheckCircle2, ShoppingBag, Plus, Book, Search, Clock, PackageMinus, Gift
} from "lucide-react";
import { supabase } from "@/app/lib/supabase"; 

// --- SABİT KATEGORİ VE İPUCU VERİLERİ ---
const CATEGORY_TIPS: any = {
  "Cep Telefonu": [{ id: "pil", title: "Pil Sağlığı", desc: "Cihazı %20-%80 arası şarj edin.", icon: Battery, color: "text-green-400" }],
  "Robot Süpürge": [{ id: "sensor", title: "Lidar Bakımı", desc: "Sensörleri düzenli temizleyin.", icon: Eye, color: "text-purple-400" }],
  "Diğer": [{ id: "genel", title: "Genel Bakım", desc: "Orijinal aksesuar kullanın.", icon: ShieldCheck, color: "text-blue-400" }]
};

const CATEGORY_DATA: any = {
  "Cep Telefonu": { accessories: ["Şarj Aleti", "Kılıf"], preChecks: ["Ekran Kırık", "Sıvı Temas"], finalChecks: ["Şebeke", "Kamera"] },
  "Diğer": { accessories: ["Kutu", "Kablo"], preChecks: ["Hasar Var", "Çalışmıyor"], finalChecks: ["Test Ok"] }
};

export default function BayiAtolyeDetayPage() {
  const router = useRouter();
  const params = useParams(); 
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("Sistem");
  
  // MODALLAR
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState({ amount: 0, desc: "" });
  
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockSearchTerm, setStockSearchTerm] = useState("");
  const [stockResults, setStockResults] = useState<any[]>([]);
  
  const [usedParts, setUsedParts] = useState<any[]>([]); 
  const [timelineLogs, setTimelineLogs] = useState<any[]>([]);
  const [upsellPool, setUpsellPool] = useState<any[]>([]);

  // FORM DATA
  const [formData, setFormData] = useState<any>({
    id: 0, customerType: "Bayi", customer: "", phone: "", address: "",
    category: "Cep Telefonu", device: "", serialNo: "", password: "",
    issue: "", privateNote: "", notes: "", 
    accessories: [], preCheck: [], finalCheck: [],
    status: "Bekliyor", price: 0, cost: 0, date: "",
    tracking_code: "", tip_id: "", images: [],
    approval_status: 'none', approval_amount: 0, approval_desc: '',
    recommended_upsells: [], sold_upsells: []
  });

  const getCategoryInfo = (catName: string) => CATEGORY_DATA[catName] || CATEGORY_DATA["Diğer"];

  useEffect(() => {
      const init = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) setCurrentUserEmail(user.email);
          
          // Fırsat Ürünlerini Çek
          const { data: products } = await supabase.from('firsat_urunleri').select('*').eq('durum', 'Aktif');
          if (products) setUpsellPool(products);

          if (params.id) fetchJobData();
      };
      init();
  }, [params.id]);

  const fetchJobData = async () => {
      const { data, error } = await supabase.from('aura_jobs').select('*').eq('id', params.id).single();
      if (error) { alert("Kayıt bulunamadı"); router.push('/epanel/bayi-atolye'); return; }
      
      if (data) {
          setFormData({
              id: data.id, tracking_code: data.tracking_code,
              customer: data.customer, phone: data.phone, customerType: data.customer_type || "Bayi",
              address: data.address || "", category: data.category || "Diğer", 
              device: data.device, serialNo: data.serial_no || "", password: data.password || "",
              issue: data.problem || "", privateNote: data.private_note || "", notes: data.process_details || "",
              status: data.status, price: data.price || 0, cost: data.cost || 0,
              date: new Date(data.created_at).toLocaleDateString('tr-TR'),
              accessories: Array.isArray(data.accessories) ? data.accessories : [],
              preCheck: Array.isArray(data.pre_checks) ? data.pre_checks : [],
              finalCheck: Array.isArray(data.final_checks) ? data.final_checks : [],
              tip_id: data.tip_id || "genel", images: Array.isArray(data.images) ? data.images : [],
              approval_status: data.approval_status || 'none', approval_amount: data.approval_amount || 0, approval_desc: data.approval_desc || "",
              recommended_upsells: Array.isArray(data.recommended_upsells) ? data.recommended_upsells : [],
              sold_upsells: Array.isArray(data.sold_upsells) ? data.sold_upsells : []
          });
          fetchTimeline(data.id);
          fetchUsedParts(data.id);
      }
      setLoading(false);
  };

  const fetchTimeline = async (jobId: number) => {
      const { data } = await supabase.from('aura_timeline').select('*').eq('job_id', jobId).order('created_at', { ascending: false });
      if (data) setTimelineLogs(data);
  };

  const logToTimeline = async (action: string, desc: string) => {
      const newLog = { job_id: params.id, action_type: action, description: desc, created_by: currentUserEmail };
      await supabase.from('aura_timeline').insert([newLog]);
      setTimelineLogs(prev => [newLog, ...prev]);
  };

  const fetchUsedParts = async (jobId: number) => {
      const { data } = await supabase.from('aura_servis_parcalari').select(`*, aura_stok(urun_adi)`).eq('job_id', jobId);
      if(data) setUsedParts(data);
  };

  // --- İŞLEMLER ---
  const handleSave = async () => {
    setLoading(true);
    const payload = {
        customer: formData.customer, phone: formData.phone, customer_type: formData.customerType, address: formData.address,
        category: formData.category, device: formData.device, serial_no: formData.serialNo, password: formData.password,
        problem: formData.issue, private_note: formData.privateNote, process_details: formData.notes,
        status: formData.status, price: Number(formData.price), cost: Number(formData.cost),
        accessories: formData.accessories, pre_checks: formData.preCheck, final_checks: formData.finalCheck,
        tip_id: formData.tip_id, images: formData.images,
        approval_status: formData.approval_status, approval_amount: formData.approval_amount, approval_desc: formData.approval_desc,
        recommended_upsells: formData.recommended_upsells, sold_upsells: formData.sold_upsells
    };

    const { error } = await supabase.from('aura_jobs').update(payload).eq('id', params.id);
    if (!error) {
        logToTimeline("Kayıt Güncellendi", `Durum: ${formData.status}, Tutar: ${formData.price}TL`);
        alert("✅ Kayıt Başarılı!");
    } else {
        alert("Hata: " + error.message);
    }
    setLoading(false);
  };

  const sendApprovalRequest = async () => {
    setLoading(true);
    const { error } = await supabase.from('aura_jobs').update({
        approval_status: 'pending', approval_amount: approvalData.amount, approval_desc: approvalData.desc, status: 'Onay Bekliyor'
    }).eq('id', params.id);
    if (!error) {
        alert("Bayiye onay isteği gönderildi!");
        setFormData({ ...formData, status: 'Onay Bekliyor', approval_status: 'pending', approval_amount: approvalData.amount, approval_desc: approvalData.desc });
        logToTimeline("Onay İsteği", `Bayiden ${approvalData.amount} TL onay istendi.`);
        setApprovalModalOpen(false);
    }
    setLoading(false);
  };

  // Stok Ekleme (Basitleştirilmiş)
  const handleStockSearch = async () => {
      if(stockSearchTerm.length < 2) return;
      const { data } = await supabase.from('aura_stok').select('*').ilike('urun_adi', `%${stockSearchTerm}%`).gt('stok_adedi', 0).limit(10);
      setStockResults(data || []);
  };

  const addPartToJob = async (part: any) => {
      const quantityStr = prompt(`Kaç adet "${part.urun_adi}"?`, "1");
      const qty = Number(quantityStr);
      if(!qty || qty < 1) return;

      const totalCost = Number(part.alis_fiyati) * qty;
      const totalPrice = Number(part.satis_fiyati) * qty;

      await supabase.from('aura_servis_parcalari').insert([{ job_id: params.id, stok_id: part.id, adet: qty, alis_fiyati_anlik: part.alis_fiyati, satis_fiyati_anlik: part.satis_fiyati }]);
      await supabase.from('aura_stok').update({ stok_adedi: part.stok_adedi - qty }).eq('id', part.id);
      
      const newPrice = Number(formData.price) + totalPrice;
      const newCost = Number(formData.cost) + totalCost;
      
      await supabase.from('aura_jobs').update({ price: newPrice, cost: newCost }).eq('id', params.id);
      setFormData({ ...formData, price: newPrice, cost: newCost });
      logToTimeline("Parça Kullanıldı", `${part.urun_adi} (x${qty}) eklendi.`);
      fetchUsedParts(Number(params.id));
      setIsStockModalOpen(false);
  };

  // Upsell Toggle
  const toggleRecommendation = (product: any) => {
      const current = Array.isArray(formData.recommended_upsells) ? [...formData.recommended_upsells] : [];
      const exists = current.find((i:any) => i.id === product.id);
      const updated = exists ? current.filter((i:any) => i.id !== product.id) : [...current, { id: product.id, name: product.urun_adi, price: product.indirimli_fiyat }];
      setFormData({ ...formData, recommended_upsells: updated });
  };

  if (loading) return <div className="p-20 text-white text-center font-bold animate-pulse">Yükleniyor...</div>;
  const catInfo = getCategoryInfo(formData.category);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-6 font-sans relative">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-800 pb-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur-md z-50 gap-4">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 font-bold text-sm"><ArrowLeft size={18}/> GERİ</button>
                <div>
                    <h1 className="text-xl font-black text-white flex items-center gap-2">
                        BAYİ SERVİS <span className="text-cyan-500">#{formData.tracking_code}</span>
                    </h1>
                    <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">KURUMSAL</span>
                </div>
            </div>
            <div className="flex gap-3">
                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg font-bold text-xs hover:bg-slate-600"><Printer size={16}/> YAZDIR</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-cyan-600 rounded-lg font-bold text-sm hover:bg-cyan-500 shadow-lg"><Save size={18}/> KAYDET</button>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-6 print:hidden">
            {/* SOL: MÜŞTERİ BİLGİSİ & FIRSATLAR */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
                <div className="bg-[#151921] border border-indigo-500/50 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <User size={14} className="text-indigo-500"/> Bayi Bilgisi
                    </h3>
                    <div className="space-y-3">
                        <input type="text" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-white outline-none" placeholder="Bayi Adı"/>
                        <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-mono" placeholder="Telefon"/>
                        
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-white"><option>Bekliyor</option><option>İşlemde</option><option>Parça Bekliyor</option><option>Onay Bekliyor</option><option>Hazır</option><option>Teslim Edildi</option></select>
                            
                            {formData.approval_status === 'none' && (
                                <button onClick={() => setApprovalModalOpen(true)} className="w-full py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg font-bold text-xs flex justify-center gap-2"><Zap size={14}/> EKSTRA ONAY İSTE</button>
                            )}
                            {formData.approval_status === 'pending' && <div className="text-center text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/30 animate-pulse">ONAY BEKLENİYOR ({formData.approval_amount}₺)</div>}
                            {formData.approval_status === 'approved' && <div className="text-center text-xs text-green-500 bg-green-500/10 p-2 rounded border border-green-500/30">MÜŞTERİ ONAYLADI ✅</div>}
                        </div>
                    </div>
                </div>

                {/* UPSELL KUTUSU */}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col max-h-[400px]">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Gift size={14} className="text-pink-500"/> Fırsat Öner</h3>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {upsellPool.map(prod => {
                            const isRec = formData.recommended_upsells.some((i:any) => i.id === prod.id);
                            const isSold = formData.sold_upsells.some((i:any) => i.id === prod.id);
                            return (
                                <div key={prod.id} className="p-2 rounded border text-xs flex justify-between items-center bg-[#0b0e14] border-slate-700">
                                    <div><div className="text-white font-bold">{prod.urun_adi}</div><div className="text-slate-500">{prod.indirimli_fiyat} ₺</div></div>
                                    {isSold ? <span className="text-green-500 font-bold">SATILDI</span> : <button onClick={() => toggleRecommendation(prod)} className={`px-2 py-1 rounded text-[10px] font-bold ${isRec ? 'bg-pink-600 text-white' : 'bg-slate-700 text-slate-400'}`}>{isRec ? 'ÖNERİLDİ' : 'ÖNER'}</button>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ORTA: CİHAZ DETAY */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2"><Smartphone size={14} className="text-blue-500"/> Cihaz Detayı</h3>
                    <div className="space-y-4">
                        <input type="text" value={formData.device} onChange={e => setFormData({...formData, device: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-lg font-black text-white outline-none focus:border-cyan-500" placeholder="Model"/>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" value={formData.serialNo} onChange={e => setFormData({...formData, serialNo: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm font-mono uppercase outline-none" placeholder="IMEI"/>
                            <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-[#0b0e14] border border-red-900/30 text-red-400 rounded-lg p-3 font-bold outline-none" placeholder="Şifre"/>
                        </div>
                        <textarea value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm h-24 outline-none resize-none focus:border-cyan-500" placeholder="Arıza..."></textarea>
                    </div>
                </div>

                {/* PARÇALAR */}
                <div className="bg-[#151921] border border-slate-800 rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><PackageMinus size={14} className="text-yellow-500"/> Parçalar</h3>
                        <button onClick={() => setIsStockModalOpen(true)} className="text-[10px] bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-lg"><Plus size={12}/> STOKTAN DÜŞ</button>
                    </div>
                    <div className="space-y-2">
                        {usedParts.map((part) => (
                            <div key={part.id} className="flex justify-between items-center bg-[#0b0e14] border border-slate-800 p-2.5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold text-xs">{part.adet}x</div>
                                    <div><p className="text-xs font-bold text-white">{part.aura_stok?.urun_adi}</p><p className="text-[10px] text-slate-500">Maliyet: {(part.alis_fiyati_anlik * part.adet)}₺</p></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SAĞ: RAPOR & LOG */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-[#151921] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col max-h-[300px]">
                    <div className="p-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center"><h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-emerald-500"/> Akış</h3></div>
                    <div className="overflow-y-auto custom-scrollbar p-3 space-y-3">
                        {timelineLogs.map((log: any) => (
                            <div key={log.id} className="flex gap-3 text-xs">
                                <div className="flex flex-col items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5"></div><div className="w-px h-full bg-slate-800"></div></div>
                                <div className="pb-2"><p className="text-slate-300 font-bold">{log.action_type}</p><p className="text-slate-500 text-[10px]">{log.description}</p></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><History size={14} className="text-purple-500"/> İşlem Raporu</h3>
                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-[#0b0e14] border border-slate-700 rounded-lg p-3 text-sm h-32 outline-none focus:border-purple-500 resize-none" placeholder="Yapılan işlemler..."></textarea>
                </div>
            </div>
        </div>

        {/* MODALLAR */}
        {isStockModalOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-[#1e293b] rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
                    <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center"><h3 className="text-white font-bold flex items-center gap-2"><Box size={18} className="text-yellow-400"/> STOKTAN PARÇA SEÇ</h3><button onClick={() => setIsStockModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white"/></button></div>
                    <div className="p-4 bg-[#0b0e14]"><div className="relative"><input type="text" value={stockSearchTerm} onChange={(e) => { setStockSearchTerm(e.target.value); if(e.target.value.length>1) handleStockSearch(); }} className="w-full bg-[#151921] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-yellow-500" placeholder="Parça ara..." autoFocus/><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/></div></div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">{stockResults.map((part) => (<button key={part.id} onClick={() => addPartToJob(part)} className="w-full flex justify-between items-center p-3 hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700 transition-all group text-left"><div><p className="text-sm font-bold text-white group-hover:text-yellow-400">{part.urun_adi}</p><p className="text-[10px] text-slate-500">{part.kategori} • Stok: {part.stok_adedi}</p></div><div className="text-right"><p className="text-xs font-bold text-slate-300">Satış: {part.satis_fiyati}₺</p></div></button>))}</div>
                </div>
            </div>
        )}

        {approvalModalOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-[#1e293b] p-6 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Zap size={18} className="text-purple-500"/> Ekstra İşlem Onayı</h3>
                    <input type="number" onChange={(e) => setApprovalData({...approvalData, amount: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mb-3 text-white outline-none focus:border-purple-500 font-bold" placeholder="Tutar (TL)"/>
                    <textarea onChange={(e) => setApprovalData({...approvalData, desc: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mb-4 text-white h-24 text-sm resize-none outline-none focus:border-purple-500" placeholder="Açıklama..."></textarea>
                    <div className="flex gap-2"><button onClick={() => setApprovalModalOpen(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg text-xs font-bold text-slate-300">İPTAL</button><button onClick={sendApprovalRequest} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-lg text-xs font-bold text-white shadow-lg">GÖNDER</button></div>
                </div>
            </div>
        )}
    </div>
  );
}