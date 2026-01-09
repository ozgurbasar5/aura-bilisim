import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Frontend'den gelen veriyi al
    const body = await request.json();

    // 1. ADIM: Başvuruyu 'aura_jobs' (veya senin başvuru tablon) tablosuna kaydet
    // Not: Eğer ayrı bir 'online_basvuru' tablon yoksa, işleri tuttuğun ana tabloya 'Bekliyor' statüsüyle ekliyoruz.
    const { data: yeniBasvuru, error: basvuruError } = await supabase
      .from('aura_jobs') 
      .insert([
        {
          customer: `${body.ad} ${body.soyad}`, // Ad ve Soyadı birleştirip customer yapıyoruz
          device: body.cihaz_modeli || body.cihaz,
          phone: body.telefon,
          description: body.ariza || "Online Başvuru",
          status: 'Bekliyor', // İlk statü
          tracking_code: 'WEB-' + Math.floor(100000 + Math.random() * 900000), // Rastgele takip kodu
          // Eklenecek diğer alanların varsa buraya ekle (örn: imei, email vb.)
        }
      ])
      .select()
      .single();

    if (basvuruError) {
      console.error("Kayıt Hatası:", basvuruError);
      return NextResponse.json({ error: basvuruError.message }, { status: 500 });
    }

    // 2. ADIM: Yöneticiye Bildirim Oluştur (Notification Tablosuna Ekle)
    // Eğer veritabanında 'notifications' isimli bir tablon varsa burası çalışır.
    if (yeniBasvuru) {
      const { error: bildirimError } = await supabase
        .from('notifications') // Veritabanındaki tablo adının tam olarak bu olduğundan emin ol
        .insert([
          {
            baslik: "Yeni Online Başvuru",
            mesaj: `${yeniBasvuru.customer} - ${yeniBasvuru.device} için kayıt oluşturdu.`,
            okundu_mu: false, // veya veritabanındaki kolon adı 'is_read' olabilir, kontrol et.
            tip: "basvuru",
            link: `/epanel/atolye/${yeniBasvuru.id}`,
            created_at: new Date()
          }
        ]);
        
      if (bildirimError) {
          console.error("Bildirim oluşturulamadı (Önemli değil, kayıt devam eder):", bildirimError);
      }
    }

    // Başarılı yanıt dön
    return NextResponse.json({ success: true, data: yeniBasvuru });

  } catch (error) {
    console.error("API Sunucu Hatası:", error);
    return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
  }
}