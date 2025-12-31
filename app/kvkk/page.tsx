"use client";

import { ShieldCheck, UserCheck, Scale, FileSearch } from "lucide-react";

export default function KVKK() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10 text-slate-300">
      
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">KVKK Aydınlatma Metni</h1>
        <p className="text-green-400 font-mono text-sm">Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme</p>
      </div>

      <div className="space-y-12">

        <section className="bg-[#0f172a]/50 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
          <p className="leading-relaxed">
            Bu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuat uyarınca, Aura Bilişim Teknolojileri A.Ş. ("Veri Sorumlusu") tarafından kişisel verilerinizin işlenmesine ilişkin usul ve esasları belirlemek amacıyla hazırlanmıştır.
          </p>
        </section>

        {/* 1. Veri Sorumlusu */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400"><ShieldCheck size={20}/></div>
            1. Veri Sorumlusu
          </h3>
          <p>
            KVKK uyarınca, kişisel verileriniz; veri sorumlusu olarak Aura Bilişim tarafından aşağıda açıklanan kapsamda toplanacak, kaydedilecek, işlenecek, saklanacak ve mevzuatın izin verdiği durumlarda 3. kişilerle paylaşılabilecektir.
          </p>
        </section>

        {/* 2. Hukuki Sebepler */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400"><Scale size={20}/></div>
            2. Kişisel Verilerin İşlenme Hukuki Sebepleri
          </h3>
          <p className="mb-4">Kişisel verileriniz, KVKK’nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayalı olarak işlenmektedir:</p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-slate-400 text-sm">
            <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (Teknik servis sözleşmesi).</li>
            <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması (Fatura kesimi).</li>
            <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması.</li>
            <li>Kanunlarda açıkça öngörülmesi.</li>
          </ul>
        </section>

        {/* 3. İlgili Kişinin Hakları */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"><UserCheck size={20}/></div>
            3. KVKK 11. Madde Uyarınca Haklarınız
          </h3>
          <div className="bg-[#1e293b]/50 border border-white/5 rounded-2xl p-6">
            <p className="mb-4 text-sm">Kişisel veri sahibi olarak firmamıza başvurarak şu haklarınızı kullanabilirsiniz:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div> Kişisel veri işlenip işlenmediğini öğrenme,</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div> İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div> İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div> Yurt içinde veya yurt dışında aktarıldığı 3. kişileri bilme,</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div> Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div> KVKK 7. maddesi öngörülen şartlar çerçevesinde silinmesini isteme.</li>
            </ul>
          </div>
        </section>

        {/* 4. Başvuru Yöntemi */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400"><FileSearch size={20}/></div>
            4. Başvuru Yöntemi
          </h3>
          <p className="text-sm leading-relaxed">
            Yukarıda belirtilen haklarınızı kullanmak için taleplerinizi, yazılı olarak veya kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da bize daha önce bildirdiğiniz ve sistemimizde kayıtlı bulunan elektronik posta adresini kullanmak suretiyle <strong>destek@aurabilisim.com</strong> adresine iletebilirsiniz. Başvurunuz 30 gün içinde sonuçlandırılacaktır.
          </p>
        </section>

      </div>
    </div>
  );
}