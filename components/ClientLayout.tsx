"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Eğer adres "/epanel" ile başlıyorsa, bu bir yönetim sayfasıdır.
  const isPanel = pathname.startsWith("/epanel");

  // Paneldeysek SADECE içeriği göster (Navbar ve Footer YOK)
  if (isPanel) {
    return <>{children}</>;
  }

  // Panelde değilsek (Normal Müşteri Sitesi), Navbar ve Footer'ı GÖSTER
  return (
    <div className="flex flex-col min-h-screen relative z-10">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}