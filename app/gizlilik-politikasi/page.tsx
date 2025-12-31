"use client";

import { Shield, Lock, Eye, Server, FileText } from "lucide-react";

export default function GizlilikPolitikasi() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10 text-slate-300">
      
      {/* Başlık Alanı */}
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Gizlilik Politikası</h1>
        <p className="text-cyan-400 font-mono text-sm">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
      </div>

      <div className="space-y-12">
        
        {/* Giriş */}
        <section className="bg-[#0f172a]/50 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
          <p className="leading-relaxed">
            Aura Bilişim Teknolojileri A.Ş. ("Şirket") olarak, müşterilerimizin, web sitesi ziyaretçilerimizin ve iş ortaklarımızın kişisel verilerinin gizliliğine ve güvenliğine en üst düzeyde önem veriyoruz. Bu politika, cihaz onarım süreçlerinde, web sitemizi ziyaret ettiğinizde veya hizmetlerimizden yararlandığınızda verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu şeffaf bir şekilde açıklamaktadır.
          </p>
        </section>

        {/* 1. Toplanan Veriler */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400"><FileText size={20}/></div>
            1. Topladığımız Veriler
          </h3>
          <ul className="list-disc list-inside space-y-2 pl-4 text-slate-400 leading-relaxed marker:text-cyan-500">
            <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası (fatura işlemleri için gerekliyse).</li>
            <li><strong>İletişim Bilgileri:</strong> Telefon numarası, e-posta adresi, teslimat adresi.</li>
            <li><strong>Cihaz Bilgileri:</strong> Cihaz markası, modeli, seri numarası (IMEI/Serial), arıza geçmişi, sistem logları.</li>
            <li><strong>İşlem Güvenliği:</strong> IP adresi, web sitesi giriş-çıkış bilgileri, çerez (cookie) kayıtları.</li>
            <li><strong>Görsel ve İşitsel Kayıtlar:</strong> Çağrı merkezi görüşme kayıtları ve fiziksel mağaza güvenlik kamerası görüntüleri.</li>
          </ul>
        </section>

        {/* 2. Kullanım Amacı */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"><Server size={20}/></div>
            2. Verilerin Kullanım Amacı
          </h3>
          <p className="mb-4">Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Hizmet Süreçleri</h4>
              <p className="text-sm">Onarım kaydı oluşturma, durum takibi sağlama ve cihaz teslimat süreçlerinin yönetimi.</p>
            </div>
            <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Yasal Yükümlülükler</h4>
              <p className="text-sm">Fatura düzenleme, vergi kanunlarına uyum ve yetkili makamlara bilgi verme.</p>
            </div>
            <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-white/5">
              <h4 className="font-bold text-white mb-2">İletişim</h4>
              <p className="text-sm">Onarım onayı alma, fiyat bilgilendirmesi yapma ve kampanya duyuruları (izin verilmesi halinde).</p>
            </div>
            <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Güvenlik</h4>
              <p className="text-sm">Web sitesi güvenliğinin sağlanması ve dolandırıcılık faaliyetlerinin önlenmesi.</p>
            </div>
          </div>
        </section>

        {/* 3. Veri Paylaşımı */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400"><Eye size={20}/></div>
            3. Verilerin Paylaşımı
          </h3>
          <p className="mb-4">Kişisel verileriniz, açık rızanız olmaksızın üçüncü şahıslarla paylaşılmaz. Ancak hizmetin ifası gereği aşağıdaki durumlar istisnadır:</p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-slate-400 marker:text-green-500">
            <li><strong>Lojistik Firmaları:</strong> Cihazın size ulaştırılması için kargo şirketleri (Yurtiçi Kargo vb.) ile ad, soyad, adres ve telefon bilgisi paylaşılır.</li>
            <li><strong>Yasal Kurumlar:</strong> Mahkeme kararı veya yasal bir talep olması durumunda emniyet birimleri ve adli mercilerle paylaşılabilir.</li>
            <li><strong>Ödeme Altyapıları:</strong> Online ödeme yapılması durumunda banka ve ödeme kuruluşları ile gerekli finansal veriler paylaşılır.</li>
          </ul>
        </section>

        {/* 4. Veri Güvenliği */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400"><Lock size={20}/></div>
            4. Veri Güvenliği ve Saklama
          </h3>
          <p className="mb-4">
            Aura Bilişim, verilerinizi korumak için SSL şifreleme, güvenlik duvarları ve yetki sınırlandırmaları gibi teknik önlemler almaktadır. Cihazlarınızdaki veriler (fotoğraf, rehber vb.) onarım süreciyle ilgili olmadığı sürece <strong>görüntülenmez, kopyalanmaz ve yedeklenmez.</strong>
          </p>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
            <span className="font-bold">Önemli Not:</span> Cihazınızı servise göndermeden önce kişisel verilerinizi yedeklemeniz ve mümkünse cihazı sıfırlamanız tavsiye edilir. Donanımsal müdahaleler sırasında oluşabilecek veri kayıplarından şirketimiz sorumlu tutulamaz.
          </div>
        </section>

      </div>
    </div>
  );
}