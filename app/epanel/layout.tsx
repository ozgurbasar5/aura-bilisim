"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { LayoutDashboard, Wrench, ShoppingBag, LogOut, UserCircle, Loader2 } from "lucide-react";

export default function EPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const kontrolEt = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setAuthorized(true);
        setUserEmail(session.user.email || "Admin");
      }
    };
    kontrolEt();
  }, [router]);

  const cikisYap = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      
      {/* --- SOL MENÜ (SIDEBAR) --- */}
      <aside className="w-64 bg-[#1E293B] border-r border-slate-700 fixed h-full flex flex-col p-6 z-50 shadow-xl">
        
        {/* Logo Kısmı */}
        <div className="mb-10 flex items-center gap-3 text-cyan-400">
          <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
             <LayoutDashboard size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter">AURA PANEL</h1>
        </div>

        {/* Menü Linkleri */}
        <nav className="flex-1 space-y-4">
          <Link href="/epanel" className={`flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${pathname === '/epanel' || pathname.includes('/detay') ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Wrench size={20} />
            <span>Onarım Talepleri</span>
          </Link>

          <Link href="/epanel/urun-ekle" className={`flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${pathname === '/epanel/urun-ekle' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <ShoppingBag size={20} />
            <span>Ürün Girişi</span>
          </Link>
        </nav>

        {/* Alt Kısım: Hesap Detayları */}
        <div className="mt-auto pt-6 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-cyan-400">
                    <UserCircle size={24} />
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs text-slate-500 font-bold uppercase">Hesap Detayları</p>
                    <p className="text-sm font-bold text-white truncate" title={userEmail}>{userEmail}</p>
                </div>
            </div>
            
            <button onClick={cikisYap} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-sm">
                <LogOut size={18} /> Çıkış Yap
            </button>
        </div>

      </aside>

      {/* --- SAĞ TARAF (İÇERİK) --- */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>

    </div>
  );
}