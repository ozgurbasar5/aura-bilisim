import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Cpu } from "lucide-react";
import ClientLayout from "@/components/ClientLayout"; // Trafik polisi burada

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
      <body className={`${inter.className} bg-[#0F172A] text-white antialiased min-h-screen`}>
        
        {/* GLOBAL BACKGROUND (Bu her yerde kalsın, panelde de havalı durur) */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-60"></div>

          <div className="absolute top-24 left-4 md:top-28 md:left-10 opacity-20 animate-pulse">
            <div className="relative">
              <Cpu size={120} className="text-cyan-500" strokeWidth={1} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500/20 blur-2xl rounded-full"></div>
            </div>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0F172A_100%)]"></div>
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