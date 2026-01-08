// ... (Mevcut başvuru kaydetme kodların bittiği yer)

const yeniBasvuru = await prisma.onlineBasvuru.create({ /* senin kodların */ });

// --- EKLEMEN GEREKEN KISIM BAŞLANGIÇ ---
if (yeniBasvuru) {
  // Yöneticiye bildirim at
  await prisma.notification.create({
    data: {
      baslik: "Yeni Cihaz Başvurusu",
      mesaj: `${yeniBasvuru.ad} ${yeniBasvuru.soyad} - ${yeniBasvuru.cihaz_modeli} için kayıt oluşturdu.`,
      okunduMu: false,
      tip: "basvuru",
      link: `/panel/basvuru-detay/${yeniBasvuru.id}`,
      tarih: new Date()
    }
  });
}
// --- EKLEMEN GEREKEN KISIM BİTİŞ ---

return NextResponse.json({ success: true });