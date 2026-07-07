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
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const links = document.querySelectorAll(".nav-links a, .nav-mobile a");

    const setActiveLink = (id) => {
      links.forEach((l) => {
        const href = l.getAttribute("href");
        const targetId = href ? href.split("#")[1] : null;
        l.classList.toggle("active", !!id && targetId === id);
      });
    };

    // ── Scrollspy basato sulla posizione di scroll ─────────────
    // (non sull'IntersectionObserver: con soglie basate sulla % di
    // sezione visibile, le sezioni molto più alte della finestra —
    // Servizi, Progetti — non raggiungevano mai quella soglia e il
    // link attivo restava bloccato sulla prima sezione).
    // Consideriamo "attiva" la sezione il cui inizio ha già superato
    // la riga di riferimento appena sotto la navbar.
    const getReferenceY = () => {
      const h = navbar ? navbar.offsetHeight : 0;
      return h + 40;
    };

    let ticking = false;
    const aggiornaSezioneAttiva = () => {
      ticking = false;
      const refY = getReferenceY();
      let corrente = sections.length ? sections[0].id : null;

      for (const sec of sections) {
        if (sec.getBoundingClientRect().top <= refY) {
          corrente = sec.id;
        } else {
          break; // le sezioni sono in ordine dall'alto verso il basso
        }
      }

      // In fondo alla pagina forza sempre l'ultima sezione (contatti)
      const inFondo =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight - 2;
      if (inFondo && sections.length) corrente = sections[sections.length - 1].id;

      setActiveLink(corrente);
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(aggiornaSezioneAttiva);
        }
      },
      { passive: true },
    );
    window.addEventListener("resize", aggiornaSezioneAttiva);

    // Stato iniziale (anche se la pagina è già scrollata all'apertura)
    aggiornaSezioneAttiva();
  } else {
    // Su pagine secondarie (es. servizio.html): evidenzia "Servizi"
    // sia nella navbar desktop sia nel menu mobile
    document
      .querySelectorAll('.nav-links a[href*="servizi"], .nav-mobile a[href*="servizi"]')
      .forEach((l) => l.classList.add("active"));
  }
}
