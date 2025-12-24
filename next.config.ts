import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Atölye ERP için gerekebilecek ek ayarlar
  images: {
    unoptimized: true, // Statik çıktılar veya hızlı yükleme için
  },
  // Varsa diğer özel ayarların
};

export default nextConfig;