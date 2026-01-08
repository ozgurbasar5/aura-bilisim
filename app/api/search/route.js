// app/api/search/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q"); // Arama terimi

  // Eğer arama kutusu boşsa hepsini getirmesin (veya son 10 kaydı getirsin istersen ayarlanır)
  if (!q) {
     // Boşsa boş dön veya varsayılan listeyi dön
     return NextResponse.json({ results: [] });
  }

  try {
    const results = await prisma.customer.findMany({
      where: {
        OR: [
          // İsimde ara
          { ad: { contains: q, mode: 'insensitive' } }, 
          // Soyisimde ara
          { soyad: { contains: q, mode: 'insensitive' } },
          // Cihaz modelinde ara
          { cihaz_modeli: { contains: q, mode: 'insensitive' } },
          // Telefon numarasında ara
          { telefon: { contains: q } },
          // İŞTE BURASI: Takip numarasının İÇİNDE ara (SRV yazsan da, 863 yazsan da bulur)
          { takip_no: { contains: q, mode: 'insensitive' } } 
        ]
      },
      take: 20, // Çok fazla veri gelip sistemi yormasın, en uygun 20 tanesi
      orderBy: {
        id: 'desc' // En yeniler en üstte
      }
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Arama hatası:", error);
    return NextResponse.json({ results: [] });
  }
}