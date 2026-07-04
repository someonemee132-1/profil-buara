// ---------------------------------------------------------
// Store — lapisan data situs Desa Buara.
//
// PENTING (batasan situs statis): karena situs ini tidak punya server atau
// database, semua perubahan yang disimpan lewat halaman admin hanya
// tersimpan di localStorage BROWSER tempat admin login & menyimpan. Artinya:
//  - Perubahan TIDAK otomatis muncul di browser pengunjung lain.
//  - Kalau mau perubahan berlaku untuk semua orang, admin perlu membuka
//    "Ekspor Data" di dashboard, salin hasilnya, lalu tempelkan ke file
//    assets/js/default-data.js sebelum mengunggah ulang situs ke hosting.
// Ini adalah konsekuensi wajar dari "situs statis tanpa backend" — kalau ke
// depannya butuh banyak admin / banyak pengunjung yang harus melihat data
// yang sama secara real-time, situs ini perlu di-upgrade pakai backend +
// database sungguhan.
// ---------------------------------------------------------

const STORE_KEY = "desaBuaraData";
const AUTH_KEY = "desaBuaraAdminAuthed";

const Store = {
    _read() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.warn("Store: gagal membaca localStorage", e);
            return {};
        }
    },

    _write(all) {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(all));
            return true;
        } catch (e) {
            console.warn("Store: gagal menyimpan ke localStorage", e);
            return false;
        }
    },

    /** Ambil data satu bagian (profil | struktur | layanan | berita | galeri). */
    get(section) {
        const overrides = this._read();
        if (overrides && Object.prototype.hasOwnProperty.call(overrides, section)) {
            return overrides[section];
        }
        return DEFAULT_DATA[section];
    },

    /** Simpan data satu bagian. */
    set(section, value) {
        const overrides = this._read();
        overrides[section] = value;
        return this._write(overrides);
    },

    /** Kembalikan satu bagian ke nilai default (hapus override-nya saja). */
    resetSection(section) {
        const overrides = this._read();
        delete overrides[section];
        return this._write(overrides);
    },

    /** Kembalikan SEMUA data ke default. */
    resetAll() {
        localStorage.removeItem(STORE_KEY);
    },

    /** Untuk tombol "Ekspor Data" di dashboard — gabungan default + override. */
    exportAll() {
        const merged = {};
        ["profil", "struktur", "layanan", "berita", "galeri"].forEach((s) => {
            merged[s] = this.get(s);
        });
        return merged;
    }
};

/* ---------------------------------------------------------
   Auth admin — DEMO ONLY.
   Login ini murni pengecekan di sisi browser (bukan server), jadi siapa pun
   yang membuka kode sumbernya bisa melihat kredensialnya. Cukup untuk
   mencegah pengunjung biasa iseng mengedit, TAPI BUKAN keamanan sungguhan.
   Kalau situs ini nanti dipakai serius, ganti dengan backend + autentikasi
   yang benar sebelum menyimpan data penting di baliknya.
--------------------------------------------------------- */
const AdminAuth = {
    CREDENTIALS: { username: "admin", password: "buara2026" },

    login(username, password) {
        const ok = username === this.CREDENTIALS.username && password === this.CREDENTIALS.password;
        if (ok) sessionStorage.setItem(AUTH_KEY, "1");
        return ok;
    },

    isLoggedIn() {
        return sessionStorage.getItem(AUTH_KEY) === "1";
    },

    logout() {
        sessionStorage.removeItem(AUTH_KEY);
    },

    /** Panggil di awal setiap halaman admin (kecuali login.html) untuk memaksa login. */
    requireLogin() {
        if (!this.isLoggedIn()) {
            window.location.href = "login.html";
        }
    }
};
