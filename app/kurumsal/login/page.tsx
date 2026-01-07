"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Eye, EyeOff, ArrowRight, Building2, Lock } from "lucide-react";
import Link from "next/link";

export default function KurumsalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. ÖZEL DOĞRULAMA (Custom Auth)
      // Supabase Auth yerine doğrudan 'bayi_basvurulari' tablosunu sorguluyoruz.
      // Bu sayede personel hesaplarıyla çakışma riski sıfıra iner.
      const { data, error: dbError } = await supabase
        .from('bayi_basvurulari')
        .select('*')
        .eq('email', email)
        .eq('password', password) // Şifre eşleşmesi kontrolü
        .eq('durum', 'Onaylandı') // Sadece onaylı bayiler girebilir
        .single();

      if (dbError || !data) {
        throw new Error("E-posta veya şifre hatalı, ya da hesabınız henüz onaylanmadı.");
      }

      // 2. OTURUM AÇMA BAŞARILI
      // Bayi bilgilerini tarayıcı hafızasına (localStorage) kaydediyoruz.
      // Panel sayfalarında bu bilgiyi kontrol ederek içeri alacağız.
      localStorage.setItem('aura_dealer_user', JSON.stringify(data));
      
      // 3. YÖNLENDİRME
      router.push('/business/dashboard'); // Bayi paneline yönlendir
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arkaplan Efektleri */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-amber-500/20 mb-4 transform rotate-3">
                <Building2 className="text-black" size={32}/>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Kurumsal Giriş</h1>
            <p className="text-slate-400 mt-2 text-sm">Aura Bilişim İş Ortağı Paneli</p>
        </div>

        <div className="bg-[#161b22] border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Kurumsal E-posta</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full bg-[#0d1117] border border-slate-700 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-amber-500 transition-all placeholder:text-slate-600"
                  placeholder="firma@ornek.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Bayi Şifresi</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-[#0d1117] border border-slate-700 text-white text-sm rounded-xl py-3.5 pl-11 pr-12 outline-none focus:border-amber-500 transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                "Giriş Yapılıyor..."
              ) : (
                <>
                  PANEL'E GİRİŞ YAP <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-xs">
              Henüz bayimiz değil misiniz?{" "}
              <Link href="/kurumsal" className="text-amber-500 hover:text-amber-400 font-bold transition-colors">
                Başvuru Yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}