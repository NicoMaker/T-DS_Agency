export const SVG_EXTERNAL = `<svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

const SVG_IG = `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;
const SVG_FB = `<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
const SVG_LI = `<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
const SVG_BE = `<svg viewBox="0 0 24 24"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029L23.726 17zm-5.101-7.5c-1.096 0-2.188.76-2.374 2.5h4.52c-.105-1.65-1.04-2.5-2.146-2.5zm-10.5.5h-3.125v-2h3.125v2zm.001 2v1.5h-3.126v-1.5h3.126zm-3.126 4v1.5H8.1v-1.5H5zm8.1-9C9.386 6 8 7.449 8 9.5c0 2.051 1.386 3.5 5.1 3.5 2.257 0 3.9-1.051 3.9-3.5s-1.643-3.5-3.9-3.5z"/></svg>`;

// ─── Store globale dei dati servizi (per il routing) ──────────────────────────
let _serviziData = null;
let _progettiData = null;

// ─── RENDER PROGETTI ─────────────────────────────────────────────────────────
export function renderProgetti(progettiData, revealObserver) {
  _progettiData = progettiData;
  const grid = document.querySelector("#progetti-grid");
  const searchInput = document.getElementById("search-progetti");
  const select = document.getElementById("categoria-select");
  if (!grid || !progettiData || !select) return;
  const progetti = progettiData.progetti;

  const total = progetti.length;
  const countEl = document.querySelector("#progetti-count");
  if (countEl) {
    countEl.textContent = `${total} progetti realizzati su misura per ogni esigenza.`;
  }

  const categorieSet = new Set(progetti.map((p) => p.categoria));
  const categorie = ["Tutti", ...Array.from(categorieSet)];

  select.innerHTML = categorie
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join("");
  select.value = "Tutti";

  grid.innerHTML = progetti
    .map(
      (p) => `
    <div class="project-card reveal" data-cat="${p.categoria}" data-search="${p.titolo} ${p.descrizione} ${p.tecnologie.join(" ")}">
      <div class="project-img-wrap">
        <img src="${p.immagine_placeholder}" alt="${p.titolo}" loading="lazy">
        <div class="project-overlay"></div>
        <span class="project-tag">${p.categoria}</span>
      </div>
      <div class="project-body">
        <p class="project-anno">${p.anno}</p>
        <h3 class="project-title">${p.titolo}</h3>
        <p class="project-desc">${p.descrizione}</p>
        <div class="project-card-footer">
          <div class="project-tech">${p.tecnologie.map((t) => `<span class="tech-tag">${t}</span>`).join("")}</div>
          ${p.link ? `<a href="${p.link}" class="project-link-btn" target="_blank" rel="noopener" aria-label="Apri ${p.titolo}">Apri ${p.categoria} ${SVG_EXTERNAL}</a>` : ""}
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  const cards = grid.querySelectorAll(".project-card");

  function filterProjects() {
    const categoria = select.value;
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    cards.forEach((card) => {
      const cardCat = card.dataset.cat;
      const searchData = card.dataset.search.toLowerCase();
      const matchCat = categoria === "Tutti" || cardCat === categoria;
      const matchSearch = query === "" || searchData.includes(query);
      const visible = matchCat && matchSearch;
      card.classList.toggle("hidden", !visible);
      const badge = card.querySelector(".project-tag");
      if (badge) badge.style.display = categoria === "Tutti" ? "" : "none";
    });
  }

  select.addEventListener("change", filterProjects);
  if (searchInput) {
    searchInput.addEventListener("input", filterProjects);
  }

  if (revealObserver) {
    cards.forEach((el) => revealObserver.observe(el));
  }

  filterProjects();
}

// ─── RENDER SERVIZI (griglia principale) ─────────────────────────────────────
export function renderServizi(serviziData, revealObserver) {
  _serviziData = serviziData;
  const grid = document.querySelector("#servizi-grid");
  if (!grid || !serviziData) return;

  grid.innerHTML = serviziData.servizi
    .map(
      (s) => `
    <div class="servizio-card reveal" style="--servizio-color:${s.colore}">
      <span class="servizio-icon">${s.icona}</span>
      <h3 class="servizio-title">${s.titolo}</h3>
      <p class="servizio-desc">${s.descrizione}</p>
      <ul class="servizio-lista">${s.dettagli.map((d) => `<li>${d}</li>`).join("")}</ul>
      <a href="servizio.html?slug=${s.slug}" class="btn-servizio-detail">Scopri di più →</a>
    </div>
  `,
    )
    .join("");

  if (revealObserver)
    grid
      .querySelectorAll(".reveal")
      .forEach((el) => revealObserver.observe(el));
}

// ─── RENDER CONTATTI ─────────────────────────────────────────────────────────
export function renderContatti(siteData, revealObserver) {
  const wrap = document.querySelector("#contatti-persone");
  if (!wrap || !siteData) return;
  wrap.innerHTML = siteData.team
    .map((persona) => {
      const c = persona.contatti;
      const links = [
        {
          href: c.whatsapp.url,
          icon: "💬",
          cls: "whatsapp",
          label: c.whatsapp.label,
          sub: c.telefono.numero,
          external: true,
        },
        {
          href: c.telefono.url,
          icon: "📞",
          cls: "phone",
          label: c.telefono.label,
          sub: c.telefono.numero,
          external: false,
        },
        {
          href: c.email.url,
          icon: "✉️",
          cls: "email",
          label: c.email.label,
          sub: c.email.indirizzo,
          external: false,
        },
      ];
      return `
      <div class="persona-block reveal">
        <div class="persona-header">
          <img class="persona-foto" src="${persona.foto}" alt="Foto di ${persona.nome}" loading="lazy">
          <div><h3 class="persona-nome">${persona.nome}</h3><span class="persona-ruolo">${persona.ruolo}</span></div>
        </div>
        <div class="persona-links">
          ${links
            .map(
              (lnk) => `
            <a href="${lnk.href}" class="contatto-card" ${lnk.external ? 'target="_blank" rel="noopener"' : ""}>
              <div class="contatto-icon ${lnk.cls}">${lnk.icon}</div>
              <div class="contatto-info"><span class="label">${lnk.label}</span><span class="sub">${lnk.sub}</span></div>
              <span class="contatto-arrow">→</span>
            </a>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
    })
    .join("");
  if (revealObserver)
    wrap
      .querySelectorAll(".reveal")
      .forEach((el) => revealObserver.observe(el));
}

// ─── RENDER FOOTER SOCIAL ────────────────────────────────────────────────────
export function renderFooterSocial(siteData) {
  const wrap = document.querySelector("#footer-social");
  if (!wrap || !siteData?.social) return;
  const s = siteData.social;
  const links = [];
  if (s.instagram)
    links.push({ href: s.instagram, label: "Instagram", svg: SVG_IG });
  links.push({
    href: s.facebook || "https://facebook.com/",
    label: "Facebook",
    svg: SVG_FB,
  });
  if (s.linkedin)
    links.push({ href: s.linkedin, label: "LinkedIn", svg: SVG_LI });
  if (s.behance) links.push({ href: s.behance, label: "Behance", svg: SVG_BE });
  wrap.innerHTML = links
    .map(
      (l) =>
        `<a href="${l.href}" target="_blank" rel="noopener" aria-label="${l.label}">${l.svg}</a>`,
    )
    .join("");
}