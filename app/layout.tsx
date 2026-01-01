import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Yeni oluşturduğumuz bileşenleri çağırıyoruz
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura Bilişim | Teknoloji Üssü",
  description: "Telefon, Bilgisayar ve Robot Süpürge için İleri Seviye Onarım Merkezi.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
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
        {/* Navbar burada olduğu için her sayfada çıkacak */}
        <Navbar />
        
        {children}
        
        {/* Footer burada olduğu için her sayfada çıkacak */}
        <Footer />
      </body>
    </html>
  );
}