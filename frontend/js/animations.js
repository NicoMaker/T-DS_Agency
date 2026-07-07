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
  setTimeout(() => loader.remove(), 700);
}

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

// ── Glow che segue il cursore nell'hero (profondità, stile agency) ──
function initHeroGlow() {
  if (prefersReducedMotion) return;
  const hero = document.getElementById("home");
  const media = document.getElementById("hero-media");
  if (!hero || !media || window.matchMedia("(hover: none)").matches) return;

  let raf = null;
  hero.addEventListener("mousemove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      media.style.setProperty("--glow-x", `${x}%`);
      media.style.setProperty("--glow-y", `${y}%`);
      raf = null;
    });
  });
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
