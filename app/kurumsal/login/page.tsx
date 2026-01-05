"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase"; 
import { useRouter } from "next/navigation";
import { Lock, Mail, Key, LogIn, Loader2, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Zaten giriş yapmışsa yönlendir
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        checkUserRole(session.user.email);
      }
    };
    checkSession();
  }, []);

  // ROL KONTROLÜ (KRİTİK NOKTA BURASI)
  const checkUserRole = async (email: string | undefined) => {
    if (!email) return;

    // 1. Bu mail adresi personel listesinde var mı?
    const { data: personnel } = await supabase
        .from('personel_izinleri')
        .select('id')
        .eq('email', email)
        .single();

    if (personnel) {
        // Evet personelse -> Panele al
        router.replace("/epanel");
    } else {
        // Hayır değilse (Belki bayidir) -> Dışarı at
        await supabase.auth.signOut();
        setLoading(false);
        setErrorMsg("Bu panel sadece YETKİLİ PERSONEL içindir. Bayi girişi için portalı kullanınız.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Standart Giriş Dene
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.session) {
          // 2. Giriş başarılı ama kim bu? (Rol Kontrolüne Gönder)
          await checkUserRole(data.session.user.email);
      }

    } catch (error: any) {
      setLoading(false);
      setErrorMsg("Giriş başarısız! Bilgileri kontrol ediniz.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="bg-[#1E293B] p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-purple-500"></div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
            <Lock className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">AURA YÖNETİM</h1>
          <p className="text-slate-400 text-sm">Sadece yetkili personel girişi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
            <input type="email" placeholder="Kurumsal E-Posta" className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="relative">
            <Key className="absolute left-4 top-3.5 text-slate-500" size={20} />
            <input type="password" placeholder="Parola" className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <ShieldAlert size={18} /> {errorMsg}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20}/> GİRİŞ YAP</>}
          </button>
        </form>
      </div>
    </main>
  );
}