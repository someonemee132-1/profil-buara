// ---------------------------------------------------------
// Dashboard Admin — Desa Buara
// ---------------------------------------------------------

AdminAuth.requireLogin();

document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initMobileNav();
    initLogout();
    initExport();

    initProfilPanel();
    initStrukturPanel();
    initLayananPanel();
    initBeritaPanel();
    initGaleriPanel();
});

/* ---------------- Tab navigation ---------------- */
function initTabs() {
    const buttons = document.querySelectorAll("[data-tab-btn]");
    const panels = document.querySelectorAll("[data-panel]");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tabBtn;
            buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
            panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === target));
            closeMobileNav();
        });
    });
}

function initMobileNav() {
    const toggle = document.querySelector("[data-admin-mobile-toggle]");
    const sidebar = document.querySelector("[data-admin-sidebar]");
    if (!toggle || !sidebar) return;

    toggle.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("is-open");
        toggle.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
    });
}

function closeMobileNav() {
    const toggle = document.querySelector("[data-admin-mobile-toggle]");
    const sidebar = document.querySelector("[data-admin-sidebar]");
    if (!toggle || !sidebar) return;
    sidebar.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
}

function initLogout() {
    document.querySelector("[data-logout]")?.addEventListener("click", () => {
        AdminAuth.logout();
        window.location.href = "login.html";
    });
}

function showToast(message) {
    const toast = document.querySelector("[data-toast]");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

/** Simpan satu bagian ke Store dan beri tahu admin kalau gagal (biasanya karena
 *  kuota localStorage penuh — umumnya disebabkan terlalu banyak/besar foto). */
function saveSection(section, data, successMessage) {
    const ok = Store.set(section, data);
    if (ok) {
        showToast(successMessage);
    } else {
        showToast("Gagal menyimpan — kemungkinan penyimpanan browser penuh (terlalu banyak/besar foto).");
    }
    return ok;
}

/* =========================================================
   Generic row-editor engine
   Renders a list of "objects" as repeatable card rows with
   add/remove controls, and can collect the current DOM state
   back into a plain array of objects.
   ========================================================= */

function renderRowEditor(container, items, fields) {
    container.innerHTML = "";
    items.forEach((item) => container.appendChild(buildRow(fields, item)));
}

function buildRow(fields, item) {
    const row = document.createElement("div");
    row.className = "row-editor-item";
    row.innerHTML = `
        <button type="button" class="row-remove" data-row-remove>Hapus</button>
        <div class="row-fields">
            ${fields.map((f) => fieldHTML(f, item ? item[f.key] : "")).join("")}
        </div>`;
    row.querySelector("[data-row-remove]").addEventListener("click", () => row.remove());

    fields.filter((f) => f.type === "image").forEach((f) => wireImageField(row, f));

    return row;
}

function fieldHTML(field, value) {
    const id = "f_" + Math.random().toString(36).slice(2, 9);
    let val = value;
    if (field.type === "textarea-lines") val = Array.isArray(value) ? value.join("\n") : (value || "");
    if (field.type === "textarea-paragraphs") val = Array.isArray(value) ? value.join("\n\n") : (value || "");

    if (field.type === "image") {
        const hasImage = Boolean(value);
        return `
        <div>
            <label>${field.label}</label>
            <div class="image-field" data-image-field="${field.key}">
                <div class="image-preview" data-image-preview>
                    ${hasImage ? `<img src="${value}" alt="">` : `<span class="image-empty">Belum ada gambar</span>`}
                </div>
                <div class="image-field-actions">
                    <input type="file" accept="image/*" data-image-input>
                    <button type="button" class="image-clear-btn" data-image-clear style="${hasImage ? "" : "display:none;"}">Hapus Gambar</button>
                </div>
                <input type="hidden" data-key="${field.key}" data-type="image" value="${escapeAttr(value || "")}">
            </div>
        </div>`;
    }

    if (field.type === "textarea" || field.type === "textarea-lines" || field.type === "textarea-paragraphs") {
        return `<div><label for="${id}">${field.label}</label><textarea id="${id}" data-key="${field.key}" data-type="${field.type}">${escapeHTML(val || "")}</textarea></div>`;
    }
    return `<div><label for="${id}">${field.label}</label><input type="text" id="${id}" data-key="${field.key}" data-type="text" value="${escapeAttr(val || "")}"></div>`;
}

/** Hubungkan input file gambar: baca file, perkecil lewat canvas, simpan sebagai data URL di input hidden. */
function wireImageField(row, field) {
    const wrap = row.querySelector(`[data-image-field="${field.key}"]`);
    if (!wrap) return;

    const fileInput = wrap.querySelector("[data-image-input]");
    const hiddenInput = wrap.querySelector(`[data-key="${field.key}"]`);
    const preview = wrap.querySelector("[data-image-preview]");
    const clearBtn = wrap.querySelector("[data-image-clear]");

    function setImage(dataUrl) {
        hiddenInput.value = dataUrl || "";
        preview.innerHTML = dataUrl ? `<img src="${dataUrl}" alt="">` : `<span class="image-empty">Belum ada gambar</span>`;
        clearBtn.style.display = dataUrl ? "" : "none";
    }

    fileInput.addEventListener("change", () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("File yang dipilih bukan gambar.");
            fileInput.value = "";
            return;
        }
        compressImage(file, 900, 0.72)
            .then((dataUrl) => setImage(dataUrl))
            .catch(() => alert("Gagal memproses gambar. Coba file lain."))
            .finally(() => { fileInput.value = ""; });
    });

    clearBtn.addEventListener("click", () => setImage(""));
}

/** Baca file gambar, batasi dimensi terpanjang ke maxDim, lalu kompres jadi JPEG data URL. */
function compressImage(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                let { width, height } = img;
                if (width > height && width > maxDim) {
                    height = Math.round(height * (maxDim / width));
                    width = maxDim;
                } else if (height > maxDim) {
                    width = Math.round(width * (maxDim / height));
                    height = maxDim;
                }
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", quality));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

function collectRowEditor(container, fields) {
    return Array.from(container.querySelectorAll(".row-editor-item")).map((row) => {
        const obj = {};
        fields.forEach((f) => {
            const el = row.querySelector(`[data-key="${f.key}"]`);
            const raw = el ? el.value : "";
            if (f.type === "textarea-lines") {
                obj[f.key] = raw.split("\n").map((s) => s.trim()).filter(Boolean);
            } else if (f.type === "textarea-paragraphs") {
                obj[f.key] = raw.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
            } else if (f.type === "image") {
                obj[f.key] = raw || "";
            } else {
                obj[f.key] = raw.trim();
            }
        });
        return obj;
    });
}

function escapeHTML(str) {
    return String(str).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}
function escapeAttr(str) {
    return escapeHTML(str).replace(/"/g, "&quot;");
}
function slugify(text) {
    return String(text).toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

/* =========================================================
   PROFIL
   ========================================================= */
function initProfilPanel() {
    const panel = document.querySelector('[data-panel="profil"]');
    if (!panel) return;

    const statRows = panel.querySelector("[data-stat-rows]");
    const misiRows = panel.querySelector("[data-misi-rows]");
    const batasRows = panel.querySelector("[data-batas-rows]");
    const wilayahRows = panel.querySelector("[data-wilayah-rows]");
    const kependudukanRows = panel.querySelector("[data-kependudukan-rows]");
    const visiInput = panel.querySelector("[data-visi-input]");

    const statFields = [{ key: "label", label: "Label" }, { key: "nilai", label: "Nilai" }, { key: "satuan", label: "Satuan" }];
    const misiFields = [{ key: "value", label: "Poin Misi" }];
    const batasFields = [{ key: "arah", label: "Arah Mata Angin" }, { key: "batas", label: "Nama Desa Berbatasan" }];
    const wilayahFields = [
        { key: "nama", label: "Nama Dusun (mis. Dusun I)" },
        { key: "deskripsi", label: "Deskripsi Singkat", type: "textarea" }
    ];
    const kependudukanFields = [{ key: "label", label: "Label (mis. Laki-laki)" }, { key: "nilai", label: "Nilai" }];

    function load() {
        const profil = Store.get("profil");
        renderRowEditor(statRows, profil.statistik || [], statFields);
        renderRowEditor(misiRows, (profil.misi || []).map((v) => ({ value: v })), misiFields);
        renderRowEditor(batasRows, profil.batasWilayah || [], batasFields);
        renderRowEditor(wilayahRows, profil.wilayah || [], wilayahFields);
        renderRowEditor(kependudukanRows, profil.kependudukan || [], kependudukanFields);
        visiInput.value = profil.visi || "";
    }

    panel.querySelector('[data-add="stat"]').addEventListener("click", () => statRows.appendChild(buildRow(statFields, {})));
    panel.querySelector('[data-add="misi"]').addEventListener("click", () => misiRows.appendChild(buildRow(misiFields, {})));
    panel.querySelector('[data-add="batas"]').addEventListener("click", () => batasRows.appendChild(buildRow(batasFields, {})));
    panel.querySelector('[data-add="wilayah"]').addEventListener("click", () => wilayahRows.appendChild(buildRow(wilayahFields, {})));
    panel.querySelector('[data-add="kependudukan"]').addEventListener("click", () => kependudukanRows.appendChild(buildRow(kependudukanFields, {})));

    panel.querySelector('[data-save="profil"]').addEventListener("click", () => {
        const data = {
            statistik: collectRowEditor(statRows, statFields),
            misi: collectRowEditor(misiRows, misiFields).map((r) => r.value),
            batasWilayah: collectRowEditor(batasRows, batasFields),
            wilayah: collectRowEditor(wilayahRows, wilayahFields),
            kependudukan: collectRowEditor(kependudukanRows, kependudukanFields),
            visi: visiInput.value.trim()
        };
        saveSection("profil", data, "Profil desa tersimpan.");
    });

    panel.querySelector('[data-reset="profil"]').addEventListener("click", () => {
        if (!confirm("Kembalikan seluruh data Profil ke bawaan? Perubahan yang belum disimpan akan hilang.")) return;
        Store.resetSection("profil");
        load();
        showToast("Profil dikembalikan ke default.");
    });

    load();
}

/* =========================================================
   STRUKTUR ORGANISASI
   ========================================================= */
function initStrukturPanel() {
    const panel = document.querySelector('[data-panel="struktur"]');
    if (!panel) return;

    const rows = panel.querySelector("[data-struktur-rows]");
    const fields = [{ key: "nama", label: "Nama Lengkap" }, { key: "jabatan", label: "Jabatan" }];

    function load() { renderRowEditor(rows, Store.get("struktur") || [], fields); }

    panel.querySelector('[data-add="struktur"]').addEventListener("click", () => rows.appendChild(buildRow(fields, {})));

    panel.querySelector('[data-save="struktur"]').addEventListener("click", () => {
        saveSection("struktur", collectRowEditor(rows, fields), "Struktur organisasi tersimpan.");
    });

    panel.querySelector('[data-reset="struktur"]').addEventListener("click", () => {
        if (!confirm("Kembalikan Struktur Organisasi ke data bawaan?")) return;
        Store.resetSection("struktur");
        load();
        showToast("Struktur dikembalikan ke default.");
    });

    load();
}

/* =========================================================
   LAYANAN PUBLIK
   ========================================================= */
function initLayananPanel() {
    const panel = document.querySelector('[data-panel="layanan"]');
    if (!panel) return;

    const listRows = panel.querySelector("[data-layanan-rows]");
    const jamRows = panel.querySelector("[data-jam-rows]");

    const listFields = [
        { key: "nama", label: "Nama Layanan" },
        { key: "syarat", label: "Persyaratan (satu baris = satu syarat)", type: "textarea-lines" },
        { key: "waktu", label: "Estimasi Waktu" }
    ];
    const jamFields = [{ key: "hari", label: "Hari" }, { key: "jam", label: "Jam" }];

    function load() {
        const layanan = Store.get("layanan");
        renderRowEditor(listRows, layanan.daftarLayanan || [], listFields);
        renderRowEditor(jamRows, layanan.jamLayanan || [], jamFields);
    }

    panel.querySelector('[data-add="layanan"]').addEventListener("click", () => listRows.appendChild(buildRow(listFields, {})));
    panel.querySelector('[data-add="jam"]').addEventListener("click", () => jamRows.appendChild(buildRow(jamFields, {})));

    panel.querySelector('[data-save="layanan"]').addEventListener("click", () => {
        saveSection("layanan", {
            daftarLayanan: collectRowEditor(listRows, listFields),
            jamLayanan: collectRowEditor(jamRows, jamFields)
        }, "Layanan publik tersimpan.");
    });

    panel.querySelector('[data-reset="layanan"]').addEventListener("click", () => {
        if (!confirm("Kembalikan Layanan Publik ke data bawaan?")) return;
        Store.resetSection("layanan");
        load();
        showToast("Layanan dikembalikan ke default.");
    });

    load();
}

/* =========================================================
   BERITA
   ========================================================= */
function initBeritaPanel() {
    const panel = document.querySelector('[data-panel="berita"]');
    if (!panel) return;

    const rows = panel.querySelector("[data-berita-rows]");
    const fields = [
        { key: "judul", label: "Judul Berita" },
        { key: "tanggal", label: "Tanggal (mis. 28 Juni 2026)" },
        { key: "kategori", label: "Kategori" },
        { key: "gambar", label: "Foto Berita (opsional, otomatis dikecilkan)", type: "image" },
        { key: "ringkasan", label: "Ringkasan Singkat", type: "textarea" },
        { key: "isi", label: "Isi Berita (pisahkan tiap paragraf dengan baris kosong)", type: "textarea-paragraphs" }
    ];

    function load() {
        // slug disimpan tapi tidak ditampilkan sebagai field yang diedit —
        // dibuat ulang otomatis dari judul saat disimpan.
        renderRowEditor(rows, Store.get("berita") || [], fields);
    }

    panel.querySelector('[data-add="berita"]').addEventListener("click", () => rows.appendChild(buildRow(fields, {})));

    panel.querySelector('[data-save="berita"]').addEventListener("click", () => {
        const collected = collectRowEditor(rows, fields);
        const withSlug = collected.map((item, i) => ({
            ...item,
            slug: item.judul ? slugify(item.judul) : `berita-${i + 1}`
        }));
        saveSection("berita", withSlug, "Berita tersimpan.");
        load();
    });

    panel.querySelector('[data-reset="berita"]').addEventListener("click", () => {
        if (!confirm("Kembalikan Berita ke data bawaan? Berita yang kamu tambahkan akan hilang.")) return;
        Store.resetSection("berita");
        load();
        showToast("Berita dikembalikan ke default.");
    });

    load();
}

/* =========================================================
   GALERI
   ========================================================= */
function initGaleriPanel() {
    const panel = document.querySelector('[data-panel="galeri"]');
    if (!panel) return;

    const rows = panel.querySelector("[data-galeri-rows]");
    const fields = [
        { key: "judul", label: "Judul Foto" },
        { key: "kategori", label: "Kategori" },
        { key: "gambar", label: "Foto (opsional, otomatis dikecilkan)", type: "image" }
    ];

    function load() { renderRowEditor(rows, Store.get("galeri") || [], fields); }

    panel.querySelector('[data-add="galeri"]').addEventListener("click", () => rows.appendChild(buildRow(fields, {})));

    panel.querySelector('[data-save="galeri"]').addEventListener("click", () => {
        saveSection("galeri", collectRowEditor(rows, fields), "Galeri tersimpan.");
    });

    panel.querySelector('[data-reset="galeri"]').addEventListener("click", () => {
        if (!confirm("Kembalikan Galeri ke data bawaan?")) return;
        Store.resetSection("galeri");
        load();
        showToast("Galeri dikembalikan ke default.");
    });

    load();
}

/* =========================================================
   EKSPOR DATA
   ========================================================= */
function initExport() {
    const btn = document.querySelector("[data-export-btn]");
    const box = document.querySelector("[data-export-box]");
    if (!btn || !box) return;

    btn.addEventListener("click", () => {
        box.textContent = JSON.stringify(Store.exportAll(), null, 4);
        box.style.display = "block";
    });

    document.querySelector("[data-reset-all]")?.addEventListener("click", () => {
        if (!confirm("Kembalikan SEMUA data (Profil, Struktur, Layanan, Berita, Galeri) ke bawaan?")) return;
        Store.resetAll();
        window.location.reload();
    });
}