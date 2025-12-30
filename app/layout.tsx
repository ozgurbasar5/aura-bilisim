import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Cpu } from "lucide-react";
import ClientLayout from "@/components/ClientLayout"; 

const inter = Inter({ subsets: ["latin"] });

// --- METADATA & FAVICON AYARLARI ---
export const metadata: Metadata = {
  title: "Aura Bilişim | Teknoloji Üssü",
  description: "Telefon, Bilgisayar ve Robot Süpürge için İleri Seviye Onarım Merkezi.",
  icons: {
    // BURASI ÖNEMLİ: Dosya adın 'favicon.svg' olduğu için burayı güncelledik
    icon: '/favicon.svg',      
    shortcut: '/favicon.svg',
    // Not: Apple cihazlar genelde PNG ister ama şimdilik SVG deneyebilirsin 
    // veya ilerde PNG'ye çevirip burayı '/favicon.png' yapabilirsin.
    apple: '/favicon.svg',     
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-[#020617] text-white antialiased min-h-screen selection:bg-cyan-500/30`}>
        
        {/* --- GLOBAL ARKA PLAN (Deep Tech Atmosferi) --- */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
          
          {/* 1. CSS Grid Deseni */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          {/* 2. Sol Üstteki Dekoratif CPU İkonu */}
          <div className="absolute top-24 left-4 md:top-28 md:left-10 opacity-5 animate-pulse duration-[4000ms]">
            <div className="relative">
              <Cpu size={120} className="text-cyan-500" strokeWidth={1} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full"></div>
            </div>
          </div>

          {/* 3. Ortam Işıkları (Ambient Glow) */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
          
          {/* 4. Vignette (Kenarları Karartma Efekti) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]"></div>
        </div>

        {/* --- İÇERİK YÖNETİMİ --- */}
        <ClientLayout>
            {children}
        </ClientLayout>

      </body>
    </html>
  );
}