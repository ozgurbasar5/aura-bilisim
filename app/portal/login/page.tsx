"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Building2, Lock, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function BayiLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Şimdilik şifre inputu koyuyoruz, veritabanına ekleyeceğiz.
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Bayi tablosunda bu email var mı kontrol et
      const { data: dealer, error: dbError } = await supabase
        .from('bayi_basvurulari')
        .select('*')
        .eq('email', email)
        .eq('durum', 'Onaylandı') // Sadece onaylı bayiler girebilir
        .single();

      if (dbError || !dealer) {
        throw new Error("Bayi bulunamadı veya üyeliğiniz henüz onaylanmadı.");
      }

      // 2. Simüle edilmiş şifre kontrolü (Gerçekte Supabase Auth kullanacağız ama şimdilik "sirket_adi"nı şifre gibi kabul edelim veya "123456" yapalım basitlik için)
      // NOT: Gerçek projede burası Supabase Auth Login fonksiyonu olacak.
      // Şimdilik demo amaçlı: Şifre "123456" ise ve bayi veritabanında varsa girsin.
      if (password !== "123456") { 
         throw new Error("Hatalı şifre.");
      }

      // 3. Giriş Başarılı -> LocalStorage'a kaydet (Oturum yönetimi)
      localStorage.setItem("bayi_session", JSON.stringify(dealer));
      
      // 4. Yönlendir
      router.push("/portal/dashboard");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#020617] to-[#020617] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0a0e17] border border-white/5 rounded-3xl p-8 relative z-10 shadow-[0_0_50px_rgba(245,158,11,0.05)]">
        
        {/* Logo & Başlık */}
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mb-6 border border-amber-500/20 shadow-lg shadow-amber-500/10">
                <Building2 size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Bayi Portalı</h1>
            <p className="text-slate-500 mt-2 text-sm">Kurumsal iş ortakları giriş ekranı.</p>
        </div>

        {/* Hata Mesajı */}
        {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-in slide-in-from-top-2">
                <ShieldCheck size={18} />
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kurumsal E-Posta</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18}/>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-600"
                        placeholder="ornek@sirket.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Bayi Şifresi</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18}/>
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-600"
                        placeholder="••••••••"
                    />
                </div>
                <div className="text-right">
                    <a href="#" className="text-xs text-slate-500 hover:text-amber-500 transition-colors">Şifremi Unuttum?</a>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-xl text-lg shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="animate-spin" /> : <>GİRİŞ YAP <ArrowRight size={20} strokeWidth={3}/></>}
            </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-xs text-slate-500">Henüz bayi değil misiniz?</p>
            <Link href="/kurumsal-cozumler" className="text-amber-500 font-bold text-sm hover:text-amber-400 mt-1 inline-block">
                Hemen Başvuru Yapın
            </Link>
        </div>

      </div>
    </div>
  );
}