import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// E-Posta Ayarları (Buraları kendi bilgilerine göre dolduracaksın)
// Güvenlik için bu bilgileri .env dosyasında saklamak en doğrusudur ama şimdilik buraya yazıyorum.
const SMTP_EMAIL = 'destek@aurabilisim.com'; // Senin mailin
const SMTP_PASSWORD = 'buraya-mail-sifresi-gelecek'; // Mail şifren

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, type, data } = body; 
    // data: { customerName, device, price, status, ... }

    // 1. Mail Taşıyıcısını (Transporter) Oluştur
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Veya 'hostinger', 'yandex' vb. smtp bilgileri
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    // 2. Şablonu Seç (HTML Mail Tasarımı)
    let htmlContent = '';

    if (type === 'hazir') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #d97706;">Cihazınız Teslime Hazır! 🚀</h2>
          <p>Sayın <strong>${data.customerName}</strong>,</p>
          <p>Servisimize bıraktığınız <strong>${data.device}</strong> cihazınızın işlemleri tamamlanmıştır.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Cihaz Durumu:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; color: green; font-weight: bold;">HAZIR / TAMAMLANDI</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Yapılan İşlem:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.islem}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Toplam Tutar:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; font-size: 1.2em; font-weight: bold;">${data.price} TL</td>
            </tr>
          </table>

          <p>Cihazınızı dilediğiniz zaman servisimizden teslim alabilirsiniz.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">Bu mail Aura Bilişim tarafından otomatik gönderilmiştir.</p>
        </div>
      `;
    } 
    else if (type === 'fiyat_onayi') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">Fiyat Onayı Bekleniyor</h2>
          <p>Sayın ${data.customerName}, ${data.device} cihazınız için arıza tespiti yapılmıştır.</p>
          <p><strong>Onarım Tutarı: ${data.price} TL</strong></p>
          <p>Onaylamak için lütfen bu maili cevaplayınız veya bizi arayınız.</p>
        </div>
      `;
    }

    // 3. Maili Gönder
    await transporter.sendMail({
      from: `"Aura Bilişim Servis" <${SMTP_EMAIL}>`,
      to: to, // Müşterinin maili
      subject: subject || 'Cihaz Durum Bilgilendirmesi',
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Mail gönderildi' });

  } catch (error) {
    console.error('Mail hatası:', error);
    return NextResponse.json({ success: false, error: 'Mail gönderilemedi' }, { status: 500 });
  }
}