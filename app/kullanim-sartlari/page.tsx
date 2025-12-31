"use client";

import { Scale, Wrench, AlertTriangle, CreditCard, Clock } from "lucide-react";

export default function KullanimSartlari() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10 text-slate-300">
      
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Kullanım Şartları</h1>
        <p className="text-purple-400 font-mono text-sm">Servis Prosedürleri ve Yasal Uyarılar</p>
      </div>

      <div className="space-y-12">

        <section className="bg-[#0f172a]/50 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
          <p className="leading-relaxed">
            Bu internet sitesini kullanarak veya Aura Bilişim teknik servis hizmetlerinden yararlanarak aşağıdaki hüküm ve koşulları kabul etmiş sayılırsınız. Lütfen cihazınızı teslim etmeden önce bu metni dikkatlice okuyunuz.
          </p>
        </section>

        {/* 1. Hizmet Kapsamı */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"><Wrench size={20}/></div>
            1. Teknik Servis Hizmet Kapsamı
          </h3>
          <p>
            Aura Bilişim; akıllı telefon, tablet, bilgisayar ve robot süpürge gibi elektronik cihazların garanti dışı onarım, bakım ve yedek parça değişim işlemlerini yürütür. Yapılan işlemler "Özel Teknik Servis" statüsündedir ve üretici firma garantisi (varsa) işlemin türüne göre bozulabilir. Müşteri bunu bilerek cihazını teslim eder.
          </p>
        </section>

        {/* 2. Garanti Koşulları */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400"><Scale size={20}/></div>
            2. Garanti Koşulları
          </h3>
          <div className="space-y-4">
            <p>Servisimizde değişen parçalar ve yapılan işçilik, aksi belirtilmedikçe <strong>6 (altı) ay</strong> Aura Bilişim garantisi altındadır.</p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-slate-400 marker:text-green-500 text-sm">
              <li>Garanti sadece değişen parçayı veya yapılan spesifik işlemi kapsar.</li>
              <li>Sıvı teması, darbe, düşme, yüksek voltaj veya yetkisiz müdahale sonucu oluşan arızalar garanti kapsamı dışındadır.</li>
              <li>Garanti etiketi sökülen veya hasar gören cihazlar garanti dışı kalır.</li>
              <li>Ekran değişimlerinde iç ekranda (LCD/OLED) oluşabilecek kırık veya mürekkep dağılması kullanıcı hatası sayılır, garantiye girmez.</li>
            </ul>
          </div>
        </section>

        {/* 3. Veri Yedekleme ve Sorumluluk */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400"><AlertTriangle size={20}/></div>
            3. Veri Kaybı Sorumluluğu
          </h3>
          <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-200 font-medium mb-2">ÖNEMLİ UYARI</p>
            <p className="text-sm text-red-200/80 leading-relaxed">
              Teknik servis işlemleri sırasında (yazılım yükleme, anakart müdahalesi vb.) cihazdaki verilerin silinme ihtimali her zaman mevcuttur. Müşteri, cihazını servise teslim etmeden önce tüm verilerini (rehber, fotoğraf, belge vb.) yedeklemekle yükümlüdür. Aura Bilişim, işlem sırasında oluşabilecek veri kayıplarından <strong>kesinlikle sorumlu tutulamaz.</strong>
            </p>
          </div>
        </section>

        {/* 4. Teslimat ve Ücretlendirme */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><Clock size={20}/></div>
                4. Teslimat Süresi
              </h3>
              <p className="text-sm leading-relaxed">
                Onarım süresi arıza durumuna ve parça stok durumuna göre 1 ile 10 iş günü arasında değişebilir. 90 gün içerisinde teslim alınmayan cihazlardan firmamız sorumlu değildir ve bu cihazlar geri dönüşüme ayrılabilir.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400"><CreditCard size={20}/></div>
                5. Arıza Tespit ve Ücret
              </h3>
              <p className="text-sm leading-relaxed">
                Cihaz arıza tespiti ücretsizdir. Ancak onarım onayı verildikten sonra işlemden vazgeçilmesi durumunda, harcanan emek ve mesai karşılığı olarak servis bedeli talep edilebilir.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}