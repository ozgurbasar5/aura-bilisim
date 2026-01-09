import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q"); // Arama terimi

  // Arama kutusu boşsa veya çok kısaysa boş dön
  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Supabase 'aura_jobs' tablosunda arama yapıyoruz
    // İsim, Cihaz, Takip No, IMEI ve Telefon alanlarında arar (ilike = harf büyüklüğüne bakmaz)
    const { data, error } = await supabase
      .from('aura_jobs') 
      .select('id, customer, device, tracking_code, status, phone, imei')
      .or(`customer.ilike.%${q}%,device.ilike.%${q}%,tracking_code.ilike.%${q}%,imei.ilike.%${q}%,phone.ilike.%${q}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Supabase Arama Hatası:", error);
      return NextResponse.json({ results: [] });
    }

    return NextResponse.json({ results: data });

  } catch (error) {
    console.error("Genel Arama Hatası:", error);
    return NextResponse.json({ results: [] });
  }
}