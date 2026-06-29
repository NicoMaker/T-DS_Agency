/* ============================================
   render.js — Popola DOM da dati JSON:
               progetti, servizi, contatti (2 persone)
   ============================================ */

/* ---- Progetti ---- */
export function renderProgetti(progettiData, revealObserver) {
  const grid = document.querySelector("#progetti-grid");
  if (!grid || !progettiData) return;

  grid.innerHTML = progettiData.progetti.map((p) => `
    <div class="project-card reveal">
      <div class="project-img-wrap">
        <img
          src="${p.immagine_placeholder}"
          alt="${p.titolo}"
          loading="lazy"
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
    </div>
  `).join("");

  /* Registra i nuovi elementi con reveal */
  if (revealObserver) {
    grid.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  }
}

/* ---- Servizi ---- */
export function renderServizi(serviziData, revealObserver) {
  const grid = document.querySelector("#servizi-grid");
  if (!grid || !serviziData) return;

  grid.innerHTML = serviziData.servizi.map((s) => `
    <div class="servizio-card reveal">
      <span class="servizio-icon">${s.icona}</span>
      <h3 class="servizio-title">${s.titolo}</h3>
      <p class="servizio-desc">${s.descrizione}</p>
      <ul class="servizio-lista">
        ${s.dettagli.map((d) => `<li>${d}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  if (revealObserver) {
    grid.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  }
}

/* ---- Contatti: 2 persone ---- */
export function renderContatti(siteData, revealObserver) {
  const wrap = document.querySelector("#contatti-persone");
  if (!wrap || !siteData) return;

  wrap.innerHTML = siteData.team.map((persona) => {
    const c = persona.contatti;
    const links = [
      {
        href: c.whatsapp.url,
        icon: "💬",
        cls: "whatsapp",
        label: c.whatsapp.label,
        sub: persona.contatti.telefono.numero,
        external: true,
      },
      {
        href: c.telefono.url,
        icon: "📞",
        cls: "phone",
        label: c.telefono.label,
        sub: persona.contatti.telefono.numero,
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
          <img
            class="persona-foto"
            src="${persona.foto}"
            alt="Foto di ${persona.nome}"
            loading="lazy"
          >
          <div>
            <h3 class="persona-nome">${persona.nome}</h3>
            <span class="persona-ruolo">${persona.ruolo}</span>
          </div>
        </div>
        <div class="persona-links">
          ${links.map((lnk) => `
            <a href="${lnk.href}"
               class="contatto-card"
               ${lnk.external ? 'target="_blank" rel="noopener"' : ""}>
              <div class="contatto-icon ${lnk.cls}">${lnk.icon}</div>
              <div class="contatto-info">
                <span class="label">${lnk.label}</span>
                <span class="sub">${lnk.sub}</span>
              </div>
              <span class="contatto-arrow">→</span>
            </a>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  if (revealObserver) {
    wrap.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  }
}
