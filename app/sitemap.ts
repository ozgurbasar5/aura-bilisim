import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Lütfen burayı canlıya alırken kendi domain adresinizle değiştirin
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aurabilisim.com'

  // Statik Sayfalar
  const staticRoutes = [
    '', // Ana Sayfa
    '/hakkimizda',
    '/hizmetler',
    '/magaza',
    '/iletisim',
    '/destek',
    '/sss',
    '/kurumsal-cozumler',
    '/cihaz-sorgula',
    '/onarim-talebi',
    '/kurye-talep',
    '/markalar',
    '/dna',
    '/satis',
    // Yasal Sayfalar
    '/gizlilik-politikasi',
    '/kullanim-sartlari',
    '/kvkk',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))

  return sitemapEntries
  
  // Not: Eğer blog veya ürün detay sayfalarınız (dynamic routes) varsa, 
  // veritabanından çekip buraya ekleyebilirsiniz. Örnek:
  /*
  const products = await prisma.product.findMany()
  const productEntries = products.map(product => ({
    url: `${baseUrl}/magaza/${product.slug}`,
    lastModified: product.updatedAt,
  }))
  return [...sitemapEntries, ...productEntries]
  */
}