// ============================================================
// nav.js — Navbar sticky, menu mobile, evidenziazione sezione
// ============================================================

// ── Scroll corretto verso l'ancora richiesta ───────────────────
// Le sezioni (#servizi, #team, ecc.) vengono popolate via JS dopo il
// caricamento dei JSON: se si arriva da un'altra pagina (es. servizio.html
// → index.html#servizi) il browser salta all'ancora PRIMA che i contenuti
// dinamici (marquee, grid, ecc.) abbiano la loro altezza definitiva, e la
// pagina finisce per mostrare la sezione sbagliata. Richiamando questa
// funzione a rendering completato correggiamo la posizione.
function scrollToCurrentHash() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;
  let target;
  try {
    target = document.querySelector(hash);
  } catch (e) {
    return;
  }
  if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
}

// ── Anno corrente nel footer, sempre aggiornato ────────────────
// Si aggiorna da solo appena scocca la mezzanotte del 1° gennaio,
// senza bisogno che l'utente ricarichi la pagina.
function initFooterYear() {
  const yearEl = document.getElementById("current-year");
  if (!yearEl) return;

  const aggiornaAnno = () => {
    const annoReale = String(new Date().getFullYear());
    if (yearEl.textContent !== annoReale) yearEl.textContent = annoReale;
  };

  aggiornaAnno();
  // Ricontrolla ogni minuto: overhead trascurabile, aggiornamento
  // comunque quasi istantaneo al cambio d'anno.
  setInterval(aggiornaAnno, 60 * 1000);
}

function initNav() {
  initFooterYear();

  const navbar = document.getElementById("navbar");
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".nav-mobile");

  // Navbar compatta allo scroll
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const toggleMenu = (open) => {
    const isOpen =
      open !== undefined ? open : !mobileNav.classList.contains("open");
    mobileNav.classList.toggle("open", isOpen);
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  hamburger.addEventListener("click", () => toggleMenu());
  mobileNav
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  // ── Evidenzia link attivo ──────────────────────────────────
  const path = window.location.pathname;
  const isHome = path.endsWith("index.html") || path === "/" || path === "";

  if (isHome) {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".nav-links a");

    // Imposta il link attivo in base all'hash all'avvio
    const setActiveFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        links.forEach((l) => {
          const href = l.getAttribute("href");
          if (href && href.split("#")[1] === hash) {
            l.classList.add("active");
          } else {
            l.classList.remove("active");
          }
        });
      }
    };
    setActiveFromHash();

    // Osservatore per lo scroll – con soglia più permissiva
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => {
            const href = l.getAttribute("href");
            if (href) {
              const targetId = href.split("#")[1];
              // Aggiunge/rimuove la classe active in base all'ID
              l.classList.toggle("active", targetId === entry.target.id);
            }
          });
        });
      },
      // Soglia: almeno il 30% della sezione deve essere visibile
      { threshold: 0.3 },
    );

    sections.forEach((s) => spy.observe(s));
  } else {
    // Su pagine secondarie (es. servizio.html): evidenzia "Servizi"
    const serviziLink = document.querySelector('.nav-links a[href*="servizi"]');
    if (serviziLink) serviziLink.classList.add("active");
  }
}
