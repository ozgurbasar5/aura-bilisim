import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Lütfen burayı canlıya alırken kendi domain adresinizle değiştirin

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aurabilisim.net'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/epanel/',       // Yönetim Paneli
        '/business/',     // İş Ortağı Paneli
        '/portal/',       // Bayi Portalı
        '/api/',          // API Endpointleri
        '/login',         // Kullanıcı Girişi
        '/kurumsal/login',// Kurumsal Giriş
        '/_next/',        // Next.js sistem dosyaları
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}