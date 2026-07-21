// ---------------------------------------------------------
// Data bawaan (default) Desa Buara.
// Ini HANYA dipakai sebagai isi awal / fallback. Begitu admin login dan
// menyimpan perubahan lewat /admin/dashboard.html, data yang dipakai situs
// akan diambil dari localStorage (lihat assets/js/store.js), bukan dari
// file ini lagi — kecuali admin menekan tombol "Kembalikan ke Default".
// ---------------------------------------------------------

const DEFAULT_DATA = {

    profil: {
        statistik: [
            { label: "Jumlah Penduduk", nilai: "1790", satuan: "jiwa" },
            { label: "Luas Wilayah", nilai: "15.9", satuan: "km²" },
            { label: "Dusun", nilai: "3", satuan: "dusun" },
            { label: "RT / RW", nilai: "9 / 3", satuan: "" }
        ],
        sejarahTimeline: [
            { tahun: "Abad ke-18", peristiwa: "Cikal bakal permukiman dibuka oleh sesepuh desa di tepi aliran sungai kecil yang kini menjadi batas Dusun I." },
            { tahun: "1946", peristiwa: "Desa Buara resmi tercatat sebagai desa definitif dalam wilayah administratif Kabupaten Purbalingga." },
            { tahun: "1998", peristiwa: "Pembangunan balai desa dan jaringan irigasi teknis pertama untuk mendukung pertanian warga." },
            { tahun: "2015", peristiwa: "Dimulainya program Dana Desa untuk infrastruktur jalan, drainase, dan penerangan jalan umum." },
            { tahun: "Sekarang", peristiwa: "Desa terus mengembangkan potensi wisata, UMKM, dan digitalisasi pelayanan publik." }
        ],
        visi: "Mewujudkan Desa Buara yang mandiri, agraris, dan berbudaya menuju masyarakat sejahtera.",
        misi: [
            "Meningkatkan kualitas infrastruktur dan pelayanan publik yang merata.",
            "Mengoptimalkan potensi pertanian dan UMKM lokal.",
            "Menjaga kelestarian lingkungan dan budaya gotong royong.",
            "Mendorong transparansi dan digitalisasi tata kelola desa."
        ],
        batasWilayah: [
            { arah: "Utara", batas: "Desa Limbasari" },
            { arah: "Selatan", batas: "Desa Lumpang" },
            { arah: "Timur", batas: "Desa Brakas" },
            { arah: "Barat", batas: "Desa Banjarsari" }
        ],
        wilayah: [
            { nama: "Dusun I", rt: "RT 01–03", deskripsi: "Sentra utama persawahan padi warga, berbatasan langsung dengan aliran sungai desa." },
            { nama: "Dusun II", rt: "RT 04–06", deskripsi: "Pusat kegiatan UMKM warga, mulai dari warung kelontong hingga produk olahan rumahan." },
            { nama: "Dusun III", rt: "RT 07–09", deskripsi: "Kawasan perkebunan kelapa yang menjadi basis produksi olahan nira khas desa." }
        ],
        kependudukan: [
            { label: "Laki-laki", nilai: "905" },
            { label: "Perempuan", nilai: "885" },
            { label: "Usia Produktif (15–64 th)", nilai: "1.180" },
            { label: "Lansia (65+ th)", nilai: "145" }
        ]
    },

    // Elemen pertama otomatis ditampilkan sebagai kartu "pimpinan" (Kepala Desa).
    struktur: [
        { nama: "Amin", jabatan: "Kepala Desa" },
        { nama: "Sodikin", jabatan: "Sekretaris Desa" },
        { nama: "Teguh Efendi", jabatan: "Kaur TU dan Umum" },
        { nama: "Ma'ruf Arifin", jabatan: "Kaur Perencanaan" },
        { nama: "Miswadi", jabatan: "Kasi Kesejahteraan" },
        { nama: "-", jabatan: "Kepala Dusun I" },
        { nama: "Kuswanidi", jabatan: "Kepala Dusun II" },
        { nama: "Muniyo", jabatan: "Kepala Dusun III" }
    ],

    layanan: {
        daftarLayanan: [
            { nama: "Surat Pengantar KTP / KK", syarat: ["Fotokopi KK", "Fotokopi KTP lama (jika ada)", "Datang langsung ke kantor desa"], waktu: "1 hari kerja" },
            { nama: "Surat Keterangan ", syarat: ["Fotokopi KTP", "Fotokopi KK", "Surat pengantar RT/RW"], waktu: "1 hari kerja" },
            { nama: "Surat Keterangan Usaha (SKU)", syarat: ["Fotokopi KTP", "Foto lokasi usaha", "Surat pengantar RT/RW"], waktu: "2 hari kerja" },
            { nama: "Surat Keterangan Tidak Mampu (SKTM)", syarat: ["Fotokopi KTP & KK", "Surat pengantar RT/RW", "Diketahui Kasi Kesejahteraan"], waktu: "2 hari kerja" },
            { nama: "Legalisasi Dokumen", syarat: ["Dokumen asli", "Fotokopi dokumen yang akan dilegalisasi"], waktu: "Selesai di tempat" }
        ],
        jamLayanan: [
            { hari: "Senin – Kamis", jam: "08.00 – 15.00 WIB" },
            { hari: "Jumat", jam: "08.00 – 11.00 WIB" },
            { hari: "Sabtu – Minggu", jam: "Tutup" }
        ]
    },

    berita: [
        {
            slug: "musyawarah-desa-rkp-2027",
            judul: "Musyawarah Desa Bahas Rencana Kerja Pemerintah Desa 2027",
            tanggal: "28 Juni 2026",
            kategori: "Pemerintahan",
            ringkasan: "Perangkat desa bersama BPD dan tokoh masyarakat menyusun prioritas pembangunan untuk tahun anggaran mendatang.",
            isi: [
                "Pemerintah Desa Buara menggelar Musyawarah Desa (Musdes) di balai desa untuk membahas Rencana Kerja Pemerintah Desa (RKP) tahun 2027. Musyawarah dihadiri oleh perangkat desa, Badan Permusyawaratan Desa (BPD), tokoh masyarakat, dan perwakilan setiap dusun.",
                "Dalam forum tersebut, warga menyampaikan usulan prioritas pembangunan, di antaranya perbaikan saluran irigasi, pelebaran jalan produksi tani, dan penambahan penerangan jalan umum di Dusun III. Kepala Desa menyampaikan bahwa seluruh usulan akan diverifikasi tim perencana sebelum ditetapkan dalam dokumen RKP definitif.",
                "Musyawarah ditutup dengan kesepakatan untuk melanjutkan pembahasan teknis anggaran pada pekan berikutnya."
            ]
        },
        {
            slug: "panen-raya-padi-dusun-satu",
            judul: "Panen Raya Padi di Dusun I Capai Hasil Terbaik dalam 3 Tahun Terakhir",
            tanggal: "15 Juni 2026",
            kategori: "Pertanian",
            ringkasan: "Kelompok Tani Sido Makmur melaporkan hasil panen rata-rata 7,2 ton per hektare berkat perbaikan irigasi.",
            isi: [
                "Musim panen di Dusun I berlangsung meriah setelah Kelompok Tani Sido Makmur mencatat hasil panen padi rata-rata 7,2 ton per hektare, naik dari 6 ton pada musim sebelumnya. Peningkatan ini disebut tidak lepas dari perbaikan saluran irigasi teknis yang rampung awal tahun.",
                "Penyuluh pertanian lapangan turut hadir memantau proses panen sekaligus memberikan pendampingan terkait penanganan pascapanen agar kualitas gabah tetap terjaga hingga ke penggilingan.",
                "Kepala Dusun I berharap capaian ini dapat direplikasi di dusun-dusun lain pada musim tanam berikutnya."
            ]
        },
        {
            slug: "pelatihan-anyaman-bambu-ibu-pkk",
            judul: "Ibu-Ibu PKK Ikuti Pelatihan Anyaman Bambu Bernilai Jual",
            tanggal: "2 Juni 2026",
            kategori: "UMKM",
            ringkasan: "Pelatihan menghadirkan pengrajin dari Kecamatan Karanganyar untuk meningkatkan kualitas dan desain produk anyaman.",
            isi: [
                "Sebanyak 30 anggota PKK dari tiga dusun mengikuti pelatihan anyaman bambu yang diselenggarakan di balai desa. Pelatihan menghadirkan pengrajin berpengalaman dari Kecamatan Karanganyar untuk berbagi teknik anyaman serta strategi pemasaran produk.",
                "Produk yang dihasilkan berupa tampah, besek, dan tas anyaman yang rencananya akan dipasarkan melalui BUMDes dan platform daring. Ketua PKK Desa Buara berharap pelatihan ini menjadi langkah awal membentuk sentra kerajinan yang mampu menambah penghasilan keluarga."
            ]
        },
        {
            slug: "posyandu-balita-rutin-juni",
            judul: "Kegiatan Posyandu Balita Rutin Digelar Serentak di 3 Dusun",
            tanggal: "20 Mei 2026",
            kategori: "Kesehatan",
            ringkasan: "Penimbangan, imunisasi, dan pemberian makanan tambahan berlangsung lancar dengan tingkat kehadiran tinggi.",
            isi: [
                "Kegiatan Posyandu balita bulan ini berlangsung serentak di tiga dusun dengan agenda penimbangan berat badan, pengukuran tinggi badan, imunisasi, serta pemberian makanan tambahan bergizi. Kader kesehatan desa turut memberikan edukasi singkat mengenai pencegahan stunting kepada para orang tua.",
                "Bidan desa melaporkan tingkat kehadiran balita mencapai lebih dari 90 persen dari total sasaran, dan sebagian besar balita tercatat memiliki status gizi baik."
            ]
        },
        {
            slug: "gotong-royong-bersih-desa",
            judul: "Gotong Royong Bersih Desa Sambut Musim Hujan",
            tanggal: "5 Mei 2026",
            kategori: "Kegiatan Warga",
            ringkasan: "Warga bersama perangkat desa membersihkan saluran drainase dan menanam pohon penahan longsor di area perbukitan.",
            isi: [
                "Menjelang musim hujan, warga Desa Buara bersama perangkat desa dan karang taruna menggelar kerja bakti membersihkan saluran drainase yang tersumbat sampah dan sedimen. Selain itu, dilakukan pula penanaman bibit pohon di area perbukitan rawan longsor sebagai upaya konservasi.",
                "Kegiatan ini merupakan agenda rutin tahunan desa yang selalu mendapat antusiasme tinggi dari warga di seluruh dusun."
            ]
        },
        {
            slug: "jalan-rabat-beton-dusun-dua",
            judul: "Pembangunan Jalan Rabat Beton Dusun II Rampung 100 Persen",
            tanggal: "18 April 2026",
            kategori: "Infrastruktur",
            ringkasan: "Proyek sepanjang 850 meter didanai dari Dana Desa dan swadaya masyarakat, mempermudah akses distribusi hasil tani.",
            isi: [
                "Proyek pembangunan jalan rabat beton sepanjang 850 meter di Dusun II resmi rampung dan telah digunakan warga. Proyek yang didanai dari Dana Desa dan swadaya masyarakat ini diharapkan mempermudah akses distribusi hasil pertanian menuju jalan kabupaten.",
                "Kepala Desa menyampaikan apresiasi kepada seluruh warga yang turut berpartisipasi dalam bentuk tenaga maupun material selama proses pembangunan berlangsung."
            ]
        }
    ],

    galeri: [
        { judul: "Panen Raya Padi", kategori: "Pertanian" },
        { judul: "Gotong Royong Bersih Desa", kategori: "Kegiatan Warga" },
        { judul: "Sawah Berundak Dusun III", kategori: "Alam" },
        { judul: "Pelatihan Anyaman Bambu", kategori: "UMKM" },
        { judul: "Peringatan HUT RI di Balai Desa", kategori: "Kegiatan Warga" },
        { judul: "Posyandu Balita", kategori: "Kesehatan" },
        { judul: "Jalan Rabat Beton Dusun II", kategori: "Infrastruktur" },
        { judul: "Sunset di Bukit Pandang", kategori: "Alam" }
    ]
};