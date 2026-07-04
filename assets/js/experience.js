// ---------------------------------------------------------
// Desa Buara — pengalaman halaman: transisi antar-halaman,
// loader singkat, dan animasi "muncul" saat elemen di-scroll.
// ---------------------------------------------------------

(function pageEntry() {
    // Body dimulai dengan class "is-entering" (lihat HTML) supaya tidak ada
    // kedipan konten sebelum animasi masuk berjalan.
    window.addEventListener("load", () => {
        requestAnimationFrame(() => {
            document.body.classList.remove("is-entering");
        });
        setTimeout(hideLoader, 320);
    });

    // Jaga-jaga kalau event "load" sudah lewat saat script ini jalan
    // (misalnya karena cache), tetap sembunyikan loader.
    if (document.readyState === "complete") {
        document.body.classList.remove("is-entering");
        setTimeout(hideLoader, 100);
    }
})();

function hideLoader() {
    const loader = document.querySelector("[data-page-loader]");
    if (loader) loader.classList.add("is-hidden");
}
function showLoader() {
    const loader = document.querySelector("[data-page-loader]");
    if (loader) loader.classList.remove("is-hidden");
}

/* ---------------- Transisi keluar saat berpindah halaman ---------------- */
document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    if (/^(mailto:|tel:|javascript:)/.test(href)) return;

    let url;
    try {
        url = new URL(href, window.location.href);
    } catch (err) {
        return;
    }
    if (url.origin !== window.location.origin) return;

    // Klik dengan modifier (buka tab baru dll.) biarkan berjalan normal.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    showLoader();
    document.body.classList.add("is-leaving");
    setTimeout(() => { window.location.href = url.href; }, 320);
});

/* ---------------- Scroll reveal ---------------- */
document.addEventListener("DOMContentLoaded", () => {
    // Tandai elemen yang lazim ingin "muncul" saat discroll — dijalankan
    // setelah konten dinamis (main.js) selesai dirender karena script ini
    // disertakan setelah main.js di setiap halaman.
    const autoSelectors = [
        ".potensi-card", ".news-card", ".org-card", ".vm-card",
        ".contact-info-card", ".gal-item", ".acc-item", ".batas-cell",
        ".timeline li", ".related-card"
    ];
    document.querySelectorAll(autoSelectors.join(",")).forEach((el, i) => {
        if (!el.hasAttribute("data-reveal")) {
            el.setAttribute("data-reveal", "");
            el.style.transitionDelay = Math.min(i % 6, 5) * 70 + "ms";
        }
    });

    const targets = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
        targets.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    targets.forEach((el) => observer.observe(el));
});
