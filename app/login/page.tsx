"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/app/lib/supabase"; 
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Key, LogIn, Loader2, ShieldAlert } from "lucide-react";

// Google İkonu (Bağımlılık olmaması için elle çizdik)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.489 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.989 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
);

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sayfa yüklendiğinde oturum kontrolü
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
         // Oturum varsa direkt panele fırlat (window.location kullanarak zorla)
         window.location.href = "/epanel";
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Bayi Kontrolü
      const { data: dealerData } = await supabase
        .from('bayi_basvurulari')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (dealerData) {
        await supabase.auth.signOut();
        setErrorMsg("Bayi girişi için lütfen Bayi Portalını kullanın.");
        setLoading(false);
        return;
      }

      // BAŞARILI: Zorla yönlendir
      window.location.href = "/epanel";

    } catch (error: any) {
      console.error("Login Hatası:", error);
      setErrorMsg("Giriş başarısız! Bilgilerinizi kontrol edin.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/epanel`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
  };

  return (
    <div className="bg-[#1E293B] p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-black text-white">AURA YÖNETİM</h1>
          <p className="text-slate-400 text-sm">Personel Girişi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
            <input type="email" placeholder="E-Posta" className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="relative">
            <Key className="absolute left-4 top-3.5 text-slate-500" size={20} />
            <input type="password" placeholder="Parola" className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {errorMsg && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center justify-center gap-2">
              <ShieldAlert size={16}/> {errorMsg}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20}/> : <><LogIn size={20}/> GİRİŞ YAP</>}
          </button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1E293B] px-2 text-slate-500 font-bold">Veya</span></div>
        </div>

        
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 relative overflow-hidden">
      <Suspense fallback={<div className="text-cyan-500"><Loader2 className="animate-spin" size={32}/></div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}