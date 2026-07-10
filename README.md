# Website Profil Desa Buara — HTML, CSS & JavaScript + Panel Admin

Situs statis (tanpa server/database) dengan setiap halaman dalam foldernya
sendiri, ditambah halaman login &amp; dashboard admin untuk mengedit Profil,
Struktur Organisasi, Layanan, Berita, dan Galeri langsung dari browser.

## Struktur folder

```
desa-buara-v2/
├── index.html                 Redirect otomatis ke beranda/index.html
├── beranda/index.html         Beranda
├── profil/index.html          Sejarah, visi-misi, geografis
├── struktur/index.html        Struktur organisasi
├── layanan/index.html         Layanan publik (accordion)
├── berita/index.html          Daftar berita
├── berita/detail.html         Detail berita (?slug=...)
├── galeri/index.html          Galeri foto + lightbox
├── kontak/index.html          Info kontak + form pesan
├── admin/
│   ├── login.html             Login admin
│   └── dashboard.html         Dashboard edit konten
└── assets/
    ├── css/style.css          Semua styling situs (termasuk tampilan admin)
    └── js/
        ├── default-data.js    Data bawaan/pabrik (fallback & tombol "reset")
        ├── store.js           Lapisan data (localStorage) + otentikasi admin
        ├── main.js             Rendering halaman publik + interaksi (nav, accordion, lightbox, form)
        └── admin-dashboard.js  Logika dashboard admin (form, simpan, ekspor)
```

Setiap halaman publik berada **persis satu tingkat** di bawah folder utama,
jadi semua tautan antar-halaman konsisten memakai pola `../nama-folder/`.

## Cara pakai

Buka `index.html` — otomatis diarahkan ke Beranda. Atau langsung buka
`beranda/index.html`. Untuk hosting online, unggah seluruh folder ini apa
adanya ke layanan hosting statis (GitHub Pages, Netlify, cPanel, dll).

## Login Admin

Buka `admin/login.html` (atau klik "Login Admin" di footer situs).

```
Username : admin
Password : buara2026
```

Ganti kredensial ini di `assets/js/store.js`, pada bagian `AdminAuth.CREDENTIALS`,
sebelum situs benar-benar dipakai.

⚠️ **Batasan penting**: ini situs statis tanpa server, jadi login ini murni
pengecekan di sisi browser (JavaScript) — cukup untuk mencegah pengunjung
biasa iseng membuka dashboard, **tapi bukan keamanan tingkat produksi**.
Siapa pun yang membuka source code bisa melihat kredensialnya. Kalau nanti
situs ini dipakai serius dengan data penting, ganti dengan backend +
autentikasi yang sesungguhnya.

## Bagaimana admin mengedit konten

1. Login di `admin/login.html`.
2. Di dashboard, pilih tab: **Profil Desa**, **Struktur Organisasi**,
   **Layanan Publik**, **Berita**, atau **Galeri**.
3. Ubah, tambah (+), atau hapus baris data lewat form yang tersedia.
   Untuk **Berita** dan **Galeri**, setiap baris juga punya field **Foto** —
   klik file gambar di sana untuk mengunggah foto asli (otomatis dikecilkan
   di browser sebelum disimpan). Kalau foto tidak diisi, halaman publik
   tetap menampilkan ilustrasi gradien seperti biasa.
4. Klik **Simpan Perubahan**. Halaman publik terkait akan langsung
   menampilkan data baru (buka tab/situs di browser yang sama).
5. Kalau salah edit, tombol **Kembalikan ke Default** per bagian akan
   mengembalikan bagian itu saja ke data bawaan.

### ⚠️ Perubahan hanya tersimpan di browser tempat admin login

Karena situs ini tidak punya server/database, semua perubahan disimpan di
`localStorage` **browser admin itu sendiri** — bukan di server. Konsekuensinya:

- Pengunjung lain yang membuka situs di perangkat/browser berbeda **tidak
  akan melihat** perubahan itu (mereka tetap melihat data bawaan).
- Kalau kamu ganti browser, mode Incognito, atau bersihkan data situs,
  perubahan yang tersimpan akan hilang.
- `localStorage` punya batas ukuran (umumnya sekitar 5–10MB per browser).
  Foto otomatis dikecilkan saat diunggah supaya hemat tempat, tapi kalau
  dashboard menampilkan pesan "penyimpanan browser penuh", hapus beberapa
  foto lama lewat tombol **Hapus Gambar** untuk memberi ruang.

**Supaya perubahan berlaku untuk semua orang:** buka tab **Ekspor & Reset**
di dashboard → klik **Tampilkan JSON** → salin seluruh isinya → tempelkan
sebagai isi `const DEFAULT_DATA = { ... }` di file `assets/js/default-data.js`
→ unggah ulang seluruh folder situs ke hosting. Dengan begitu data barunya
menjadi bawaan yang sama untuk semua pengunjung. (Catatan: kalau ada banyak
foto, hasil JSON ekspornya akan cukup panjang karena foto disimpan sebagai
teks base64 — tetap aman disalin, hanya saja filenya jadi besar.)

Kalau ke depannya kamu butuh banyak admin dan pengunjung yang harus melihat
data yang selalu sinkron secara real-time (tanpa proses ekspor manual di
atas), situs ini perlu di-upgrade memakai backend + database sungguhan
(misalnya versi Laravel yang sebelumnya sudah dibuat).

## Mengedit hal yang tidak ada di dashboard

- **Potensi Desa & hero Beranda** — masih statis di `beranda/index.html`,
  edit langsung teksnya di HTML.
- **Peta lokasi** — ganti URL `google.com/maps?q=...` di `beranda/index.html`
  dan `kontak/index.html`.
- **Form kontak** — hanya validasi + pesan sukses di browser (tidak mengirim
  email sungguhan karena situs statis tidak punya backend). Hubungkan ke
  Formspree/Getform atau backend terpisah kalau ingin pesan benar-benar terkirim.

## Arah desain

Palet warna terinspirasi sawah berundak & senja di perbukitan (hijau hutan,
sage, emas panen, krem kertas padi, cokelat tanah) — didefinisikan sebagai
CSS custom properties di baris atas `assets/css/style.css`. Motif garis
kontur berulang (`.terrace-divider`) dipakai sebagai pembatas antar-bagian.
Tipografi: **Fraunces** (heading), **Plus Jakarta Sans** (body), **JetBrains
Mono** (angka/label kecil).

Semua teks & data contoh memakai nama **Desa Buara, Kecamatan Karanganyar,
Kabupaten Purbalingga** — cari-ganti nama tersebut di semua file kalau mau
dipakai untuk desa lain (atau langsung edit lewat dashboard admin untuk
bagian yang sudah didukung).
