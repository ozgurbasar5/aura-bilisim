"use client";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Bike, MapPin, Phone, User, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export default function KuryeTalepPage() {
    const [form, setForm] = useState({ name: "", phone: "", address: "", device: "", note: "" });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('aura_courier').insert([{ ...form, status: 'Bekliyor' }]);
        setLoading(false);
        if(!error) setSuccess(true);
        else alert("Bir hata oluştu.");
    };

    if (success) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center font-sans">
            <div className="bg-[#151921] p-10 rounded-3xl border border-green-500/30 max-w-md w-full shadow-2xl shadow-green-900/20">
                <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6"/>
                <h1 className="text-2xl font-black text-white mb-2">Talep Alındı!</h1>
                <p className="text-slate-400 text-sm">Moto kurye yönlendirmesi için ekibimiz sizi en kısa sürede arayacak.</p>
                <button onClick={() => window.location.reload()} className="mt-6 text-sm text-slate-500 underline hover:text-white">Yeni Talep</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 font-sans flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>

            <div className="w-full max-w-lg relative z-10">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-orange-900/30 border border-orange-500/30 px-4 py-2 rounded-full text-orange-400 font-bold text-sm mb-4 animate-pulse">
                        <Bike size={18}/> HIZLI TESLİMAT
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Kurye Çağır</h1>
                    <p className="text-slate-400">Siz yorulmayın, cihazınızı kapınızdan alıp onarıp geri getirelim.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#151921]/80 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1 block">AD SOYAD</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-500" size={18}/>
                            <input required type="text" className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 pl-11 text-white outline-none focus:border-cyan-500 transition-all text-sm font-bold" placeholder="İsim Soyisim" value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/>
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1 block">TELEFON</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 text-slate-500" size={18}/>
                            <input required type="text" className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 pl-11 text-white outline-none focus:border-cyan-500 transition-all text-sm font-bold" placeholder="05XX..." value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})}/>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1 block">CİHAZ VE SORUN</label>
                        <input required type="text" className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500 transition-all text-sm" placeholder="Örn: iPhone 13, Ekran Kırık" value={form.device} onChange={e=>setForm({...form, device: e.target.value})}/>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1 block">ADRES</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 text-slate-500" size={18}/>
                            <textarea required className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-3 pl-11 text-white outline-none focus:border-cyan-500 transition-all h-24 resize-none text-sm" placeholder="Açık adres..." value={form.address} onChange={e=>setForm({...form, address: e.target.value})}></textarea>
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
                        {loading ? <Loader2 className="animate-spin"/> : <>TALEBİ GÖNDER <ArrowRight size={18}/></>}
                    </button>
                    <p className="text-[10px] text-center text-slate-500 mt-2">* Kurye hizmeti ekstra ücrete tabidir.</p>
                </form>
            </div>
        </div>
    );
}