// ============================================================
// animations.js — Reveal allo scroll, contatori, parallax, loader
// ============================================================

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ── Loader iniziale ─────────────────────────────────────────
function hidePageLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;
  loader.classList.add("hidden");
  setTimeout(() => loader.remove(), 450);
}

// Il loader si chiude solo quando SIA la sequenza video+logo è finita
// SIA i dati del sito sono pronti (chiamato da main.js). Così, anche se i
// dati arrivano subito, il video ha comunque il tempo di andare in scena.
let introSequenceDone = false;
let siteDataReady = false;

function tryHidePageLoader() {
  if (introSequenceDone && siteDataReady) hidePageLoader();
}

function markSiteDataReady() {
  siteDataReady = true;
  tryHidePageLoader();
}
window.markSiteDataReady = markSiteDataReady;

// ── Video di apertura (opzionale) ────────────────────────────
// Sequenza voluta: parte solo il video, a video finito compare il logo
// e il video resta fermo. Se in /video/intro.mp4 non c'è nessun
// file, il logo compare subito senza aspettare nulla.
// Se si arriva da un'altra pagina dello stesso sito (es. servizio.html → home),
// il loader viene saltato completamente per non ripetere l'intro.
function initIntroVideo() {
  const loader = document.getElementById("page-loader");

  // ── Salta il loader se si arriva da una pagina interna ──────
  const ref = document.referrer;
  const isInternalNavigation =
    ref &&
    (ref.includes(window.location.hostname) ||
      ref.includes("servizio.html") ||
      ref.includes("index.html"));

  if (isInternalNavigation && loader) {
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 0);
    introSequenceDone = true;
    tryHidePageLoader();
    return;
  }

  const video = document.getElementById("intro-video");
  if (!video || !loader) {
    introSequenceDone = true;
    tryHidePageLoader();
    return;
  }

  const mostraLogo = () => {
    if (loader.classList.contains("show-word")) return;
    loader.classList.add("show-word");
    // Logo breve e immediato: il sito parte quasi subito dopo.
    setTimeout(() => {
      introSequenceDone = true;
      tryHidePageLoader();
    }, 350);
  };

  const nascondiVideo = () => {
    video.style.display = "none";
    mostraLogo();
  };

  // Con "autoplay" il video parte già durante il parsing dell'HTML:
  // l'errore (file mancante) può essere scattato prima che questo
  // script venisse eseguito, quindi controlliamo anche lo stato attuale.
  if (video.error || video.networkState === 3 /* NETWORK_NO_SOURCE */) {
    nascondiVideo();
    return;
  }
  video.addEventListener("error", nascondiVideo);
  video.addEventListener("playing", () => loader.classList.add("has-video"));
  // Il video non è più in loop: quando finisce di girare (una volta sola)
  // resta fermo sull'ultimo fotogramma e a quel punto compare il logo.
  video.addEventListener("ended", mostraLogo);
  // Rete di sicurezza: se per qualche motivo il video non parte o non
  // finisce mai, mostra comunque il logo dopo un tempo massimo.
  setTimeout(mostraLogo, 6000);
}

// ── Video di sfondo nella hero (opzionale) ───────────────────
// Stessa logica per /video/hero.mp4: se manca il file, resta lo sfondo
// astratto già impostato via CSS su .hero-media.
function initHeroVideo() {
  const video = document.getElementById("hero-video");
  const home = document.getElementById("home");
  if (!video) return;

  const nascondi = () => {
    video.style.display = "none";
  };

  if (video.error || video.networkState === 3 /* NETWORK_NO_SOURCE */) {
    nascondi();
  } else {
    video.addEventListener("error", nascondi);
  }

  // Con un video attivo il contenuto sopra deve restare leggibile a
  // prescindere da cosa mostra il filmato: passiamo a testi/velo scuri
  // pensati apposta (vedi regole "#home.hero-has-video" nel CSS).
  const attivaStileVideo = () => {
    if (home) home.classList.add("hero-has-video");
    document.body.classList.add("hero-has-video");
  };
  video.addEventListener("loadeddata", attivaStileVideo);
  video.addEventListener("playing", attivaStileVideo);
}

// Attivati il prima possibile: l'attributo "autoplay" fa già partire il
// tentativo di caricamento durante il parsing dell'HTML, prima ancora
// che gli script vengano eseguiti.
initIntroVideo();
initHeroVideo();

// ── Reveal allo scroll ──────────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ── Contatori animati (sezione numeri) ─────────────────────
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const suffisso = el.dataset.suffix || "";
    if (prefersReducedMotion) {
      el.textContent = target + suffisso;
      return;
    }
    const durata = 1600;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / durata, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = Math.round(target * eased) + suffisso;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((c) => obs.observe(c));
}

// ── Parallax leggero sull'hero ──────────────────────────────
function initParallax() {
  if (prefersReducedMotion) return;
  const media = document.getElementById("hero-media");
  if (!media) return;

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          media.style.transform = `translateY(${y * 0.22}px)`;
        }
        ticking = false;
      });
    },
    { passive: true },
  );
}

// ── Pulsanti "magnetici" (si spostano leggermente verso il cursore) ──
function initMagneticButtons() {
  if (prefersReducedMotion) return;
  if (window.matchMedia("(hover: none)").matches) return; // no touch

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

// ── Glow che segue il cursore nell'hero (disabilitato per b/n) ──
function initHeroGlow() {
  // Non facciamo nulla per evitare gradienti colorati
}

// ── Marquee (duplicazione contenuto per loop infinito) ──────
function buildMarquee(parole) {
  const track = document.getElementById("marquee-track");
  if (!track || !parole || !parole.length) return;

  const blocco = parole
    .map(
      (p) =>
        `<span class="marquee-item">${p} <span class="marquee-sep">✳</span></span>`,
    )
    .join("");

  // Due copie identiche per un loop continuo (translateX -50%)
  track.innerHTML = blocco + blocco;
}

// ── Barra di progresso scroll in cima alla pagina ────────────
function initScrollProgress() {
  if (prefersReducedMotion) return;
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.min(Math.max(p, 0), 1)})`;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

// ── Spotlight sulle card: un alone arancio segue il cursore ──
// (le card leggono --mx / --my nel CSS via radial-gradient)
function initCardSpotlight() {
  if (prefersReducedMotion) return;
  if (window.matchMedia("(hover: none)").matches) return;

  const selettori =
    ".servizio-card, .progetto-card, .team-card, .project-card";

  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest(selettori);
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}

initScrollProgress();
// Delegato sul documento: funziona anche sulle card generate dopo il render
initCardSpotlight();
