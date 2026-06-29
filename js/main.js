/* ============================================
   NOOO AGENCY — Main JavaScript
   Carica dati JSON, gestisce navbar, hamburger,
   scroll reveal, form
   ============================================ */

(async function () {
  "use strict";

  /* ---- Helpers ---- */
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ---- Caricamento dati JSON ---- */
  async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`JSON load failed: ${path}`);
    return res.json();
  }

  let siteData, progettiData, serviziData;
  try {
    [siteData, progettiData, serviziData] = await Promise.all([
      loadJSON("data/site.json"),
      loadJSON("data/progetti.json"),
      loadJSON("data/servizi.json"),
    ]);
  } catch (e) {
    console.error("Errore caricamento dati:", e);
  }

  /* ---- Navbar scroll ---- */
  const navbar = qs("#navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  });

  /* ---- Hamburger Menu ---- */
  const hamburger = qs(".hamburger");
  const navMobile = qs(".nav-mobile");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navMobile.classList.toggle("open");
    document.body.style.overflow = navMobile.classList.contains("open")
      ? "hidden"
      : "";
  });

  // Chiudi mobile nav al click su link
  qsa(".nav-mobile a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navMobile.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = qsa("section[id]");
  const navLinks = qsa(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("active"));
          const active = qs(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => observer.observe(s));

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  function setupReveal() {
    qsa(".reveal").forEach((el) => revealObserver.observe(el));
  }

  /* ---- Render Progetti ---- */
  function renderProgetti() {
    const grid = qs("#progetti-grid");
    if (!grid || !progettiData) return;

    grid.innerHTML = progettiData.progetti
      .map(
        (p) => `
      <div class="project-card reveal">
        <div class="project-img-wrap">
          <img
            src="${p.immagine_placeholder}"
            alt="${p.titolo}"
            loading="lazy"
            onerror="this.src='${p.immagine_placeholder}'"
          >
          <div class="project-overlay"></div>
          <span class="project-tag">${p.categoria}</span>
        </div>
        <div class="project-body">
          <p class="project-anno">${p.anno}</p>
          <h3 class="project-title">${p.titolo}</h3>
          <p class="project-desc">${p.descrizione}</p>
          <div class="project-tech">
            ${p.tecnologie.map((t) => `<span class="tech-tag">${t}</span>`).join("")}
          </div>
        </div>
      </div>`
      )
      .join("");
  }

  /* ---- Render Servizi ---- */
  function renderServizi() {
    const grid = qs("#servizi-grid");
    if (!grid || !serviziData) return;

    grid.innerHTML = serviziData.servizi
      .map(
        (s) => `
      <div class="servizio-card reveal">
        <span class="servizio-icon">${s.icona}</span>
        <h3 class="servizio-title">${s.titolo}</h3>
        <p class="servizio-desc">${s.descrizione}</p>
        <ul class="servizio-lista">
          ${s.dettagli.map((d) => `<li>${d}</li>`).join("")}
        </ul>
      </div>`
      )
      .join("");
  }

  /* ---- Render Contatti ---- */
  function renderContatti() {
    const cards = qs("#contatti-cards");
    if (!cards || !siteData) return;

    const c = siteData.contatti;
    const items = [
      {
        href: c.whatsapp.url,
        icon: "💬",
        iconClass: "whatsapp",
        label: c.whatsapp.label,
        sub: c.telefono.numero,
      },
      {
        href: c.telefono.url,
        icon: "📞",
        iconClass: "phone",
        label: c.telefono.label,
        sub: c.telefono.numero,
      },
      {
        href: c.email.url,
        icon: "✉️",
        iconClass: "email",
        label: c.email.label,
        sub: c.email.indirizzo,
      },
      {
        href: "#contatti-form",
        icon: "💬",
        iconClass: "message",
        label: c.messaggio.label,
        sub: "Compila il modulo qui sotto",
      },
    ];

    cards.innerHTML = items
      .map(
        (i) => `
      <a href="${i.href}" class="contatto-card reveal" ${i.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
        <div class="contatto-icon ${i.iconClass}">${i.icon}</div>
        <div class="contatto-info">
          <span class="label">${i.label}</span>
          <span class="sub">${i.sub}</span>
        </div>
        <span class="contatto-arrow">→</span>
      </a>`
      )
      .join("");
  }

  /* ---- Form submit ---- */
  function setupForm() {
    const form = qs("#contatto-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formEl = form;
      const successEl = qs("#form-success");
      formEl.style.display = "none";
      if (successEl) successEl.style.display = "block";
    });
  }

  /* ---- Init ---- */
  renderProgetti();
  renderServizi();
  renderContatti();
  setupReveal();
  setupForm();

})();
