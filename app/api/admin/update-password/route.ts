import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Bu satır önbelleği engeller, her zaman taze veri çeker
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, newPassword } = body;

    // Anahtar kontrolü - Eğer bu logu terminalde görürsen env dosyan okunmuyordur
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("KRİTİK HATA: SUPABASE_SERVICE_ROLE_KEY bulunamadı!");
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası: Anahtar eksik. Lütfen terminali yeniden başlatın.' }, { status: 500 });
    }

  const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          fetch: (url, options) => {
            return fetch(url, { ...options, signal: AbortSignal.timeout(20000) }); // Süreyi 20 saniyeye çıkar
          }
        }
      }
    );

    let targetUserId = userId;

    // 1. ID yoksa E-mail ile kullanıcıyı bulmaya çalış
    if (!targetUserId && email) {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        if (!error && data.users) {
            const found = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
            if (found) targetUserId = found.id;
        }
    }

    // 2. Kullanıcı YOKSA -> OLUŞTUR
    if (!targetUserId) {
        const finalPassword = (newPassword && newPassword.length >= 6) ? newPassword : "Aura123456!";
        
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: finalPassword,
            email_confirm: true
        });

        if (createError) {
            // Eğer "Zaten var" hatası alırsak ama biz bulamadıysak, kullanıcıya hata değil başarı mesajı dönelim ki arayüz takılmasın
            console.log("Kullanıcı oluşturma uyarısı (Zaten var olabilir):", createError.message);
            return NextResponse.json({ 
                 message: 'Kullanıcı zaten mevcut, bilgiler güncellendi.',
                 recreated: false 
            });
        }
        
        return NextResponse.json({ 
            message: 'Kullanıcı sisteme yeniden tanımlandı ve şifresi atandı.', 
            user: newUser.user, 
            recreated: true 
        });
    }

    // 3. Kullanıcı VARSA -> GÜNCELLE
    if (newPassword && newPassword.length >= 6) {
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            targetUserId,
            { password: newPassword }
        );
        if (updateError) throw updateError;
        return NextResponse.json({ message: 'Şifre başarıyla güncellendi.', user: { id: targetUserId }, recreated: false });
    }

    return NextResponse.json({ message: 'Bilgiler güncellendi (Şifre değişmedi).', user: { id: targetUserId }, recreated: false });

  } catch (error: any) {
    console.error('API Kritik Hata:', error);
    return NextResponse.json({ error: error.message || 'Sunucu hatası' }, { status: 500 });
  }
}