// ---------------------------------------------------------
// Desa Buara — interaksi umum & rendering dinamis dari Store
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initAccordionDelegation();
    initLightbox();
    initContactForm();
    markActiveNav();

    renderStatsHome();
    renderBeritaList();
    renderBeritaHome();
    renderBeritaDetail();
    renderGaleri();

    renderTimeline();
    renderVisiMisi();
    renderBatasWilayah();
    renderMiniStats();

    renderStruktur();
    renderLayanan();
});

/* ---------------- Navbar mobile toggle ---------------- */
function initNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const mobile = document.querySelector("[data-nav-mobile]");
    if (!toggle || !mobile) return;

    toggle.addEventListener("click", () => {
        const isOpen = mobile.classList.toggle("is-open");
        toggle.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
    });
}

function markActiveNav() {
    const current = document.body.dataset.page;
    if (!current) return;
    document.querySelectorAll(`[data-nav-link="${current}"]`).forEach((el) => {
        el.classList.add("active");
    });
}

/* ---------------- Beranda: statistik ---------------- */
function renderStatsHome() {
    const container = document.querySelector("[data-stats-grid]");
    if (!container) return;
    const statistik = Store.get("profil").statistik || [];
    container.innerHTML = statistik.map((item) => `
        <div class="stat-cell">
            <p class="val">${item.nilai}</p>
            <p class="unit">${item.satuan || "&nbsp;"}</p>
            <p class="label eyebrow">${item.label}</p>
        </div>`).join("");
}

/* ---------------- Profil: timeline sejarah ---------------- */
function renderTimeline() {
    const container = document.querySelector("[data-timeline]");
    if (!container) return;
    const timeline = Store.get("profil").sejarahTimeline || [];
    container.innerHTML = timeline.map((t) => `
        <li><p class="year">${t.tahun}</p><p class="event">${t.peristiwa}</p></li>`).join("");
}

/* ---------------- Profil: visi & misi ---------------- */
function renderVisiMisi() {
    const visiEl = document.querySelector("[data-visi]");
    const misiEl = document.querySelector("[data-misi]");
    if (!visiEl && !misiEl) return;
    const profil = Store.get("profil");

    if (visiEl) visiEl.textContent = `“${profil.visi}”`;
    if (misiEl) {
        misiEl.innerHTML = (profil.misi || []).map((m, i) => `
            <li><span class="num">${String(i + 1).padStart(2, "0")}</span> ${m}</li>`).join("");
    }
}

/* ---------------- Profil: batas wilayah & mini stats ---------------- */
function renderBatasWilayah() {
    const container = document.querySelector("[data-batas-grid]");
    if (!container) return;
    const batas = Store.get("profil").batasWilayah || [];
    container.innerHTML = batas.map((b) => `
        <div class="batas-cell"><p class="eyebrow">${b.arah}</p><p class="place">${b.batas}</p></div>`).join("");
}

function renderMiniStats() {
    const container = document.querySelector("[data-mini-stats]");
    if (!container) return;
    const statistik = Store.get("profil").statistik || [];
    container.innerHTML = statistik.map((s) => `
        <div class="cell"><p class="val">${s.nilai} <span class="unit">${s.satuan || ""}</span></p><p class="label eyebrow">${s.label}</p></div>`).join("");
}

/* ---------------- Struktur organisasi ---------------- */
function renderStruktur() {
    const container = document.querySelector("[data-struktur-grid]");
    if (!container) return;
    const orang = Store.get("struktur") || [];
    container.innerHTML = orang.map((o, i) => {
        const initials = o.nama.split(" ").map((w) => w[0]).slice(0, 2).join("");
        const isLead = i === 0;
        const cls = "org-card" + (isLead ? " lead" : "");
        const style = isLead ? ' style="grid-column: 1 / -1;"' : "";
        return `
        <div class="${cls}"${style}>
            <span class="org-avatar">${initials}</span>
            <div><p class="org-name">${o.nama}</p><p class="org-role eyebrow">${o.jabatan}</p></div>
        </div>`;
    }).join("");
}

/* ---------------- Layanan publik ---------------- */
function renderLayanan() {
    const listContainer = document.querySelector("[data-layanan-list]");
    const jamContainer = document.querySelector("[data-jam-layanan]");
    if (!listContainer && !jamContainer) return;

    const layanan = Store.get("layanan");

    if (listContainer) {
        listContainer.innerHTML = (layanan.daftarLayanan || []).map((item, i) => `
            <div class="acc-item${i === 0 ? " is-open" : ""}" data-acc-item>
                <button class="acc-trigger" data-acc-trigger aria-expanded="${i === 0}">
                    <span><span class="num">${String(i + 1).padStart(2, "0")}</span><span class="title">${item.nama}</span></span>
                    <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                </button>
                <div class="acc-panel"><div class="acc-panel-inner">
                    <span class="eyebrow">Persyaratan</span>
                    <ul>
                        ${(item.syarat || []).map((s) => `<li><span class="check">✓</span>${s}</li>`).join("")}
                    </ul>
                    <p class="time">Estimasi waktu: <span class="mono">${item.waktu}</span></p>
                </div></div>
            </div>`).join("");
        initAccordion(); // (re)bind triggers on the freshly rendered items
    }

    if (jamContainer) {
        jamContainer.innerHTML = (layanan.jamLayanan || []).map((j) => `
            <div class="jam-row"><span class="day">${j.hari}</span><span class="time">${j.jam}</span></div>`).join("");
    }
}

/* ---------------- Accordion (dibind ulang setiap kali render) ---------------- */
function initAccordionDelegation() {
    // no-op placeholder kept for readability; real binding happens in initAccordion()
    // after dynamic content is injected (see renderLayanan()).
}

function initAccordion() {
    document.querySelectorAll("[data-acc-trigger]").forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const item = trigger.closest("[data-acc-item]");
            item.classList.toggle("is-open");
            trigger.setAttribute("aria-expanded", String(item.classList.contains("is-open")));
        });
    });
}

/* ---------------- Lightbox (halaman Galeri) ---------------- */
function initLightbox() {
    const lightbox = document.querySelector("[data-lightbox]");
    if (!lightbox) return;

    const closeBtn = lightbox.querySelector("[data-lightbox-close]");
    const titleEl = lightbox.querySelector("[data-lightbox-title]");
    const catEl = lightbox.querySelector("[data-lightbox-category]");

    function open(item) {
        titleEl.textContent = item.judul;
        catEl.textContent = item.kategori;
        lightbox.classList.add("is-open");
    }
    function close() {
        lightbox.classList.remove("is-open");
    }

    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    window.__openLightbox = open;
}

/* ---------------- Form kontak (validasi + status, tanpa backend) ---------------- */
function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    const status = document.querySelector("[data-form-status]");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;

        form.querySelectorAll("[data-field]").forEach((field) => {
            const input = field.querySelector("input, textarea");
            const error = field.querySelector("[data-field-error]");
            const isEmpty = !input.value.trim();
            const isBadEmail = input.type === "email" && input.value && !/^\S+@\S+\.\S+$/.test(input.value);

            if (isEmpty || isBadEmail) {
                valid = false;
                error.textContent = isEmpty ? "Kolom ini wajib diisi." : "Format email tidak valid.";
                error.style.display = "block";
            } else {
                error.style.display = "none";
            }
        });

        if (!valid) return;

        status.textContent = "Pesan Anda berhasil terkirim. Perangkat desa akan segera merespons.";
        status.classList.add("is-visible");
        form.reset();
        status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}

/* ---------------- Berita: render daftar (halaman Berita) ---------------- */
function renderBeritaList() {
    const container = document.querySelector("[data-berita-list]");
    if (!container) return;
    container.innerHTML = Store.get("berita").map(newsCardHTML).join("");
}

/* ---------------- Berita: render 3 terbaru (Beranda) ---------------- */
function renderBeritaHome() {
    const container = document.querySelector("[data-berita-home]");
    if (!container) return;
    container.innerHTML = Store.get("berita").slice(0, 3).map(newsCardHTML).join("");
}

function newsCardHTML(item) {
    // "../berita/detail.html" berfungsi dari halaman mana pun karena semua
    // halaman berada persis satu tingkat di bawah root (lihat README).
    return `
    <a href="../berita/detail.html?slug=${item.slug}" class="news-card">
        <div class="news-thumb">
            <svg viewBox="0 0 300 120" preserveAspectRatio="none"><path d="M0 90 L50 70 L100 95 L150 60 L200 85 L250 55 L300 80 L300 120 L0 120 Z" fill="#0d2a20"/></svg>
            <span class="news-tag">${item.kategori}</span>
        </div>
        <div class="news-body">
            <p class="news-date">${item.tanggal}</p>
            <h3>${item.judul}</h3>
            <p class="news-excerpt">${item.ringkasan}</p>
        </div>
    </a>`;
}

/* ---------------- Berita: render detail (halaman berita/detail.html) ---------------- */
function renderBeritaDetail() {
    const wrap = document.querySelector("[data-berita-detail]");
    if (!wrap) return;

    const data = Store.get("berita");
    const slug = new URLSearchParams(window.location.search).get("slug");
    const item = data.find((b) => b.slug === slug) || data[0];
    if (!item) return;

    wrap.querySelector("[data-detail-kategori]").textContent = item.kategori;
    wrap.querySelector("[data-detail-judul]").textContent = item.judul;
    wrap.querySelector("[data-detail-tanggal]").textContent = item.tanggal;
    document.title = item.judul + " — Desa Buara";

    const content = wrap.querySelector("[data-detail-content]");
    content.innerHTML = item.isi.map((p) => `<p>${p}</p>`).join("");

    const related = document.querySelector("[data-berita-related]");
    if (related) {
        const others = data.filter((b) => b.slug !== item.slug).slice(0, 3);
        related.innerHTML = others.map((b) => `
            <a href="../berita/detail.html?slug=${b.slug}" class="related-card">
                <div class="related-thumb"></div>
                <div class="body">
                    <p class="news-date">${b.tanggal}</p>
                    <h3>${b.judul}</h3>
                </div>
            </a>`).join("");
    }
}

/* ---------------- Galeri: render grid + lightbox ---------------- */
function renderGaleri() {
    const container = document.querySelector("[data-galeri-grid]");
    if (!container) return;
    const data = Store.get("galeri");

    container.innerHTML = data.map((item, i) => `
        <button type="button" class="gal-item" data-gal-index="${i}">
            <svg viewBox="0 0 300 375" preserveAspectRatio="none">
                <path d="M0 ${260 + (i % 3) * 15} L75 ${220 + (i % 4) * 10} L150 ${270 - (i % 3) * 10} L225 ${230 + (i % 2) * 20} L300 260 L300 375 L0 375 Z" fill="#0d2a20"/>
            </svg>
            <div class="gal-caption">
                <p class="eyebrow">${item.kategori}</p>
                <p class="title">${item.judul}</p>
            </div>
        </button>`).join("");

    container.querySelectorAll("[data-gal-index]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const item = data[Number(btn.dataset.galIndex)];
            if (window.__openLightbox) window.__openLightbox(item);
        });
    });
}
