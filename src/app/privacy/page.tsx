export const metadata = {
  title: "Kebijakan Privasi | Renqar",
  description: "Kebijakan Privasi Renqar",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Kebijakan Privasi Renqar</h1>
      <p className="mt-2 text-sm text-muted-foreground">Terakhir diperbarui: 17 September 2025</p>

      <section className="mt-8 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          {`Kebijakan Privasi ini menjelaskan bagaimana Renqar ("kami") mengumpulkan, menggunakan, mengungkapkan,
          dan melindungi data pribadi Anda saat menggunakan layanan kami. Dengan mengakses atau menggunakan Renqar,
          Anda menyetujui praktik yang dijelaskan di sini.`}
        </p>

        <h2 className="text-xl font-semibold text-foreground">Informasi yang Kami Kumpulkan</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="text-foreground font-medium">Data Akun</span>: email, nama, peran/role yang Anda pilih.</li>
          <li><span className="text-foreground font-medium">Data Penggunaan</span>: log aktivitas, perangkat, browser, dan informasi teknis lainnya.</li>
          <li><span className="text-foreground font-medium">Cookie & Teknologi Serupa</span>: untuk autentikasi, preferensi, dan analitik.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">Tujuan Penggunaan Data</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Menyediakan dan meningkatkan layanan Renqar.</li>
          <li>Autentikasi pengguna, pencegahan penyalahgunaan, dan keamanan.</li>
          <li>Komunikasi terkait layanan termasuk pembaruan fitur dan dukungan.</li>
          <li>Analitik penggunaan anonim untuk meningkatkan performa dan pengalaman.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">Dasar Hukum Pemrosesan</h2>
        <p>
          Kami memproses data berdasarkan salah satu atau beberapa dasar hukum yang berlaku, seperti persetujuan Anda,
          pelaksanaan kontrak, kepentingan yang sah, dan/atau kepatuhan terhadap peraturan.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Berbagi Data</h2>
        <p>
          Kami dapat membagikan data dengan penyedia layanan pihak ketiga tepercaya untuk hosting, analitik,
          dan dukungan operasional, dengan kewajiban kerahasiaan yang sesuai. Kami tidak menjual data pribadi Anda.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Penyimpanan dan Keamanan</h2>
        <p>
          Kami menerapkan langkah-langkah teknis dan organisasi yang wajar untuk melindungi data. Meskipun demikian,
          tidak ada sistem yang sepenuhnya aman. Simpan kredensial Anda dengan baik dan hubungi kami jika terjadi
          dugaan pelanggaran.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Hak Anda</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Akses, perbaikan, penghapusan, atau pembatasan pemrosesan data pribadi.</li>
          <li>Penarikan persetujuan kapan saja, tanpa memengaruhi pemrosesan yang telah dilakukan.</li>
          <li>Portabilitas data, jika berlaku.</li>
          <li>Mengajukan keluhan kepada otoritas perlindungan data setempat.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">Retensi Data</h2>
        <p>
          Data disimpan selama diperlukan untuk memenuhi tujuan pengumpulan dan kewajiban hukum. Setelah itu,
          data akan dihapus atau dianonimkan secara aman.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Transfer Internasional</h2>
        <p>
          Jika terjadi transfer data lintas negara, kami akan memastikan perlindungan yang memadai sesuai peraturan
          yang berlaku.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Perubahan Kebijakan</h2>
        <p>
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui
          situs atau email. Tanggal pembaruan tercantum di bagian atas halaman ini.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Kontak</h2>
        <p>
          Untuk pertanyaan atau permintaan terkait data pribadi, hubungi kami di: support@Renqar.com.
        </p>
      </section>
    </main>
  );
}

