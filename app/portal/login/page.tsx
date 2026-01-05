"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Building2, Lock, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function BayiLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Zaten giriş yapmışsa portal dashboard'a at
    const check = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if(session) checkDealerRole(session.user.email);
    }
    check();
  }, []);

  const checkDealerRole = async (email: string | undefined) => {
      if(!email) return;
      // Bayi mi kontrol et
      const { data: dealer } = await supabase.from('bayi_basvurulari').select('*').eq('email', email).eq('durum', 'Onaylandı').single();
      
      if(dealer) {
          router.replace("/portal/dashboard");
      } else {
          await supabase.auth.signOut();
          setLoading(false);
          setError("Bu giriş sadece onaylı bayiler içindir. Personel iseniz yönetim panelini kullanın.");
      }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Auth Girişi
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // 2. Bayi Kontrolü
      if (data.session) {
          await checkDealerRole(data.session.user.email);
      }
    } catch (err: any) {
      setLoading(false);
      setError("Giriş başarısız. E-posta veya şifre hatalı.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arkaplan Süslemeleri */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#020617] to-[#020617] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-[#0a0e17] border border-white/5 rounded-3xl p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mb-6 border border-amber-500/20">
                <Building2 size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Bayi Portalı</h1>
            <p className="text-slate-500 mt-2 text-sm">Kurumsal İş Ortağı Girişi</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <ShieldCheck size={18} /> {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Kurumsal E-Posta</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#020617] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none" placeholder="ornek@sirket.com" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Şifre</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#020617] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none" placeholder="••••••••" />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-xl text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <>GİRİŞ YAP <ArrowRight size={20}/></>}
            </button>
        </form>
        
        <div className="mt-6 text-center">
            <Link href="/kurumsal-cozumler" className="text-xs text-slate-500 hover:text-amber-500">Bayi başvurusu yapmak istiyorum</Link>
        </div>
      </div>
    </div>
  );
}