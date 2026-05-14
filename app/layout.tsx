import type { Metadata, Viewport } from "next";
import "./globals.css";

// Bileşenleri çağırıyoruz
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// PWA için tema rengi ve mobil tarayıcı ayarları (Next.js 14+ standardı)
export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  // PWA Manifest bağlantısı
  manifest: "/manifest.json",
  
  title: "Aura Bilişim | Teknoloji Üssü",
  description: "Türkiye'nin teknoloji üssü. iPhone, Laptop, Robot Süpürge, Araç Kamerası ve Kurumsal Bilişim çözümleri için profesyonel onarım merkezi. Kargo ile tüm Türkiye'ye hizmet.",
  
  // --- SEO Anahtar Kelimeler ---
  keywords: [
    "Aura Bilişim", "Teknoloji Üssü", "Aura Teknik Servis",
    "Türkiye Teknik Servis", "İstanbul Teknik Servis", "Kargo ile Telefon Tamiri", "Online Teknik Servis", "Garantili Onarım Merkezi",
    "Cep Telefonu Tamiri", "iPhone Servis Türkiye", "Samsung Telefon Tamiri", "Xiaomi Servis", "iPad Tamiri", "Tablet Onarımı", "Ekran Değişimi", "Batarya Değişimi", "FaceID Tamiri",
    "Bilgisayar Tamiri", "Laptop Servisi", "Notebook Onarımı", "Gaming Laptop Tamiri", "Masaüstü PC Tamiri", "Macbook Servisi", "Ekran Kartı Tamiri", "Anakart Tamiri", "Sıvı Teması Onarımı", "Termal Macun Değişimi", "Gaming PC Toplama",
    "Robot Süpürge Tamiri", "Roborock Servis Türkiye", "Xiaomi Robot Süpürge Tamiri", "Dreame Servis", "Lidar Sensör Tamiri", "Robot Süpürge Batarya",
    "Araç Kamerası Montajı", "Araç Kamerası Tamiri", "Dashcam Servisi", "Yol Kamerası Montajı", "Dikiz Aynası Kamera Tamiri", "Güvenlik Kamerası Sistemleri", "Araç İçi Teknoloji",
    "Akıllı Saat Tamiri", "Apple Watch Tamiri", "Samsung Watch Servis",
    "Kurumsal Bilişim Çözümleri", "Veri Kurtarma", "Bakım Anlaşması", "Bilişim Danışmanlığı", "Network Kurulumu", "Server Bakımı"
  ],

  // İkon Ayarları
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },

  // Sosyal Medya (OpenGraph)
  openGraph: {
    title: "Aura Bilişim | Türkiye'nin Teknoloji Üssü",
    description: "Telefon, Bilgisayar, Araç Kamerası ve Robot Süpürge onarımında uzman çözüm ortağınız.",
    url: "https://www.aurabilisim.net",
    siteName: "Aura Bilişim",
    locale: "tr_TR",
    type: "website",
  },

  // Google Bot İzinleri
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="overflow-x-hidden">
      <body className="bg-[#020617] text-white antialiased min-h-screen selection:bg-cyan-500/30 overflow-x-hidden w-full relative">
        {/* Navigasyon Paneli */}
        <Navbar />
        
        <main>
          {children}
        </main>
        
        {/* Alt Bilgi Alanı */}
        <Footer />
      </body>
    </html>
  );
}