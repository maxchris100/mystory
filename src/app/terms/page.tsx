export const metadata = {
  title: "Syarat & Ketentuan | Renqar",
  description: "Syarat dan Ketentuan Layanan Renqar",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Syarat & Ketentuan Renqar</h1>
      <p className="mt-2 text-sm text-muted-foreground">Terakhir diperbarui: 17 September 2025</p>

      <section className="mt-8 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          {`Dengan mengakses atau menggunakan Renqar ("Layanan"), Anda menyetujui Syarat & Ketentuan ini. Jika Anda
          tidak setuju, mohon untuk tidak menggunakan Layanan.`}
        </p>

        <h2 className="text-xl font-semibold text-foreground">Akun</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Anda wajib memberikan informasi yang akurat dan memperbaruinya bila terjadi perubahan.</li>
          <li>Jaga kerahasiaan kredensial Anda dan bertanggung jawab atas semua aktivitas pada akun Anda.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">Penggunaan yang Dilarang</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Penyalahgunaan, peretasan, atau tindakan yang mengganggu operasi Layanan.</li>
          <li>{`Melanggar hukum atau hak pihak ketiga (termasuk hak kekayaan intelektual).`}</li>
          <li>Unggahan konten ilegal, berbahaya, atau menyesatkan.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">Kepemilikan dan Lisensi</h2>
        <p>
          Renqar dan semua hak terkait merek, logo, dan kode adalah milik Renqar. Anda diberikan lisensi terbatas,
          non-eksklusif, dan dapat dicabut untuk menggunakan Layanan sesuai Syarat ini.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Konten Pengguna</h2>
        <p>
          Anda mempertahankan hak atas konten yang Anda buat dan unggah. Dengan menggunakan Layanan, Anda memberi kami
          lisensi terbatas untuk menyimpan dan memproses konten semata-mata untuk menyediakan Layanan.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Pembayaran</h2>
        <p>
          Fitur berbayar tunduk pada harga dan kebijakan penagihan yang ditampilkan. Pajak dapat berlaku sesuai hukum
          yang berlaku.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Penafian</h2>
        <p>
          {`Layanan diberikan "sebagaimana adanya" tanpa jaminan apa pun. Sejauh diizinkan hukum, kami menolak semua
  jaminan tersurat maupun tersirat.`}
        </p>

        <h2 className="text-xl font-semibold text-foreground">Pembatasan Tanggung Jawab</h2>
        <p>
          Sejauh diizinkan hukum, Renqar tidak bertanggung jawab atas kehilangan pendapatan, data, atau kerugian
          tidak langsung/insidental yang timbul dari penggunaan Layanan.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Pengakhiran</h2>
        <p>
          Kami dapat menangguhkan atau menghentikan akses Anda jika Anda melanggar Syarat ini atau jika diwajibkan oleh
          hukum. Anda dapat berhenti menggunakan Layanan kapan saja.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Hukum yang Berlaku</h2>
        <p>
          Syarat ini diatur oleh hukum yang berlaku di yurisdiksi kami beroperasi. Sengketa akan diselesaikan di
          pengadilan yang berwenang.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Perubahan Syarat</h2>
        <p>
          Kami dapat memperbarui Syarat ini sewaktu-waktu. Perubahan material akan diberitahukan melalui situs atau
          email. Tanggal pembaruan tercantum di bagian atas halaman ini.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Kontak</h2>
        <p>
          Untuk pertanyaan tentang Syarat ini, hubungi kami di: support@Renqar.com.
        </p>
      </section>
    </main>
  );
}

