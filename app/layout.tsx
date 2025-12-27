import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Cpu } from "lucide-react";
import ClientLayout from "@/components/ClientLayout"; // Trafik polisi devrede

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura Bilişim | Teknik Servis Laboratuvarı",
  description: "Telefon, Bilgisayar ve Robot Süpürge Onarım Merkezi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-[#020617] text-white antialiased min-h-screen selection:bg-cyan-500/30`}>
        
        {/* GLOBAL BACKGROUND (Panelde de, sitede de havalı duran o arka plan) */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
          {/* Hafif nokta dokusu (varsa) yoksa gradient */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>

          {/* Animasyonlu CPU İkonu */}
          <div className="absolute top-24 left-4 md:top-28 md:left-10 opacity-10 animate-pulse duration-[4000ms]">
            <div className="relative">
              <Cpu size={120} className="text-cyan-500" strokeWidth={1} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full"></div>
            </div>
          </div>

          {/* Köşelerden gelen hafif ışıklar */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
          
          {/* Genel karartma */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]"></div>
        </div>

        {/* İÇERİK YÖNETİMİ */}
        {/* Navbar ve Footer kararını artık ClientLayout verecek */}
        <ClientLayout>
            {children}
        </ClientLayout>

      </body>
    </html>
  );
}