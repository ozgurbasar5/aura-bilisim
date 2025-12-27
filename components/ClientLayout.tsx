"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 1. Yönetim Paneli ve Login sayfalarında Navbar/Footer GİZLE
  // (Burası kalmalı yoksa panelin içine müşteri menüsü girer)
  const isPanelOrLogin = pathname.startsWith("/epanel") || pathname === "/login";

  if (isPanelOrLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Üst Bar (Her yerde sabit) */}
      <Navbar />
      
      {/* Sayfa İçeriği */}
      <main className="flex-1">
        {children}
      </main>

      {/* Alt Bar (Her yerde sabit) */}
      <Footer />
    </div>
  );
}