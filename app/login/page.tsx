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
  const [pageLoading, setPageLoading] = useState(true); 
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Eğer oturum varsa, bu kişinin bayi olup olmadığını kontrol et
        const isDealer = await checkIsDealer(session.user.email);
        if (isDealer) {
            // Bayi ise oturumu kapat ve uyar
            await supabase.auth.signOut();
            setPageLoading(false);
        } else {
            // Personelse panele al
            router.replace("/epanel");
        }
      } else {
        setPageLoading(false);
      }
    };
    checkSession();
  }, [router]);

  // Yardımcı Fonksiyon: Email bir bayiye mi ait?
  const checkIsDealer = async (userEmail: string | undefined) => {
    if (!userEmail) return false;
    
    // 'bayi_basvurulari' tablosunda bu email var mı diye bakıyoruz
    const { data } = await supabase
        .from('bayi_basvurulari')
        .select('id')
        .eq('email', userEmail)
        .maybeSingle(); // single() yerine maybeSingle() hata fırlatmaz, null döner
    
    return !!data; // Varsa true, yoksa false döner
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Önce Giriş Yapmayı Dene
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 2. GÜVENLİK KONTROLÜ: Giren kişi Bayi mi?
      // Eğer bayiyse, sistemden atacağız.
      const isDealer = await checkIsDealer(email);

      if (isDealer) {
        // Oturumu hemen sonlandır
        await supabase.auth.signOut();
        throw new Error("DEALER_DETECTED");
      }

      // 3. Personelse İçeri Al
      router.replace("/epanel");

    } catch (error: any) {
      if (error.message === "DEALER_DETECTED") {
        setErrorMsg("Bayi hesapları buradan giremez! Lütfen 'Bayi Portal' girişini kullanın.");
      } else {
        setErrorMsg("Giriş başarısız! E-posta veya şifre hatalı.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
            <Loader2 className="animate-spin text-cyan-500 w-8 h-8" />
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="bg-[#1E293B] p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-purple-500"></div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
            <Lock className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">AURA YÖNETİM</h1>
          <p className="text-slate-400 text-sm">Yetkili personel girişi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
            <input 
              type="email" 
              placeholder="E-Posta Adresi" 
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Key className="absolute left-4 top-3.5 text-slate-500" size={20} />
            <input 
              type="password" 
              placeholder="Parola" 
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex flex-col items-center gap-1 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2 font-bold">
                 <ShieldAlert size={16}/> ERIŞIM ENGELLENDI
              </div>
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {loading ? "KONTROL EDİLİYOR..." : <><LogIn size={20}/> GİRİŞ YAP</>}
          </button>
        </form>

      </div>
    </main>
  );
}