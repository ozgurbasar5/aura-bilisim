/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Atölye ERP için gerekebilecek ek ayarlar
  images: {
    unoptimized: true, // Statik çıktılar veya hızlı yükleme için
  },
  // Vercel build hatalarını minimize etmek için gerekirse buraya ekleme yapılabilir
};

export default nextConfig;