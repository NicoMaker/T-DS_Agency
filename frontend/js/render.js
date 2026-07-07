// ============================================================
// render.js — Costruzione delle sezioni dai JSON originali
// (site.json, servizi.json, progetti.json, video.json)
// ============================================================

// ── Marquee: generato dai titoli dei servizi ────────────────
function renderMarquee(datiServizi) {
  const parole = (datiServizi.servizi || []).map((s) => s.titolo);
  buildMarquee(parole);
}

// ── Servizi (con dettagli + FAQ a fisarmonica) ──────────────
function renderServizi(dati) {
  const grid = document.getElementById("servizi-grid");
  const titolo = document.getElementById("servizi-titolo");
  const sotto = document.getElementById("servizi-sottotitolo");
  if (!grid) return;

  if (titolo && dati.titolo) titolo.textContent = dati.titolo;
  if (sotto && dati.sottotitolo) sotto.textContent = dati.sottotitolo;

  grid.innerHTML = (dati.servizi || [])
    .map(
      (s, i) => `
      <a
        href="servizio.html?slug=${s.slug}"
        class="servizio-card reveal reveal-delay-${i % 3}"
        style="--card-accent:${s.colore || "var(--accent)"}"
        aria-label="Scopri i dettagli di ${s.titolo}"
      >
        <div class="servizio-icona" aria-hidden="true">${s.icona || "◆"}</div>
        <h3>${s.titolo}</h3>
        <p>${s.descrizione}</p>
        <ul class="servizio-dettagli">
          ${(s.dettagli || []).map((d) => `<li>${d}</li>`).join("")}
        </ul>
        <span class="servizio-cta">
          Scopri i dettagli
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>`,
    )
    .join("");

  // Popola anche il select del form
  const select = document.getElementById("f-servizio");
  if (select) {
    (dati.servizi || []).forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.titolo;
      opt.textContent = s.titolo;
      select.appendChild(opt);
    });
    const altro = document.createElement("option");
    altro.value = "Altro";
    altro.textContent = "Altro / non so ancora";
    select.appendChild(altro);
  }
}

// ── Progetti ────────────────────────────────────────────────
function renderProgetti(dati) {
  const grid = document.getElementById("progetti-grid");
  const titolo = document.getElementById("progetti-titolo");
  const sotto = document.getElementById("progetti-sottotitolo");
  if (!grid) return;

  if (titolo && dati.titolo) titolo.textContent = dati.titolo;
  if (sotto && dati.sottotitolo) sotto.textContent = dati.sottotitolo;

  grid.innerHTML = (dati.progetti || [])
    .map(
      (p, i) => `
      <article
        class="progetto-card reveal reveal-delay-${i % 3}"
        style="--card-accent:${p.colore || "var(--accent)"}"
        data-cat="${p.categoria || ""}"
        data-search="${(`${p.titolo} ${p.descrizione || ""} ${(p.tecnologie || []).join(" ")}`).replace(/"/g, "&quot;").toLowerCase()}"
      >
        <div class="progetto-media">
          <img
            src="${p.immagine}"
            alt="${p.titolo}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${p.immagine_placeholder || ""}'"
          />
        </div>
        <div class="progetto-body">
          <div class="progetto-meta">
            <span>${p.categoria || ""}</span>
            <span class="anno">${p.anno || ""}</span>
          </div>
          <h3>${p.titolo}</h3>
          <p>${p.descrizione || ""}</p>
          ${
            p.tecnologie && p.tecnologie.length
              ? `<div class="progetto-tags">${p.tecnologie
                  .map((t) => `<span class="tag">${t}</span>`)
                  .join("")}</div>`
              : ""
          }
        </div>
      </article>`,
    )
    .join("");
}

// ── Video ───────────────────────────────────────────────────
function renderVideo(dati) {
  const grid = document.getElementById("video-grid");
  const titolo = document.getElementById("video-titolo");
  const sotto = document.getElementById("video-sottotitolo");
  if (!grid) return;

  if (titolo && dati.titolo) titolo.textContent = dati.titolo;
  if (sotto && dati.sottotitolo) sotto.textContent = dati.sottotitolo;

  const lista = dati.video || [];
  if (!lista.length) {
    document.getElementById("video").style.display = "none";
    return;
  }

  grid.innerHTML = lista
    .map((v, i) => {
      let frame = "";
      if (v.tipo === "youtube" && v.id) {
        frame = `<iframe
          src="https://www.youtube-nocookie.com/embed/${v.id}"
          title="${v.titolo || "Video"}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>`;
      } else if (v.tipo === "mp4" && v.src) {
        frame = `<video controls preload="metadata" ${v.poster ? `poster="${v.poster}"` : ""}>
          <source src="${v.src}" type="video/mp4" />
          Il tuo browser non supporta il video.
        </video>`;
      } else {
        return "";
      }

      return `
      <article class="video-card reveal reveal-delay-${i % 3}">
        <div class="video-frame">${frame}</div>
        <div class="video-body">
          <h3>${v.titolo || ""}</h3>
          <p>${v.descrizione || ""}</p>
        </div>
      </article>`;
    })
    .join("");
}

// ── Team (da site.json) ─────────────────────────────────────
function renderTeam(site) {
  const grid = document.getElementById("team-grid");
  const sotto = document.getElementById("team-sottotitolo");
  if (!grid) return;

  const azienda = site.azienda || {};
  if (sotto && azienda.descrizione) sotto.textContent = azienda.descrizione;

  grid.innerHTML = (site.team || [])
    .map(
      (m, i) => `
      <article class="team-card reveal reveal-delay-${i % 3}">
        <div class="team-foto">
          <img src="${m.foto}" alt="${m.nome}" loading="lazy" />
        </div>
        <div class="team-body">
          <h3>${m.nome}</h3>
          <div class="team-ruolo">${m.ruolo || ""}</div>
          ${m.piva ? `<div class="team-piva">${renderPiva(m.piva)}</div>` : ""}
          <div class="team-contatti-list">
            ${contattoTeam(m.contatti && m.contatti.whatsapp, "chat", m.contatti && m.contatti.whatsapp && m.contatti.whatsapp.numero)}
            ${contattoTeam(m.contatti && m.contatti.telefono, "call", m.contatti && m.contatti.telefono && m.contatti.telefono.numero)}
            ${contattoTeam(m.contatti && m.contatti.email, "email", m.contatti && m.contatti.email && m.contatti.email.indirizzo)}
          </div>
        </div>
      </article>`,
    )
    .join("");
}

// Converte un prefisso ISO a 2 lettere (es. "IT") nella relativa bandiera emoji
function isoToFlag(iso) {
  if (!iso || iso.length !== 2) return "";
  return iso
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

// Mostra la bandiera al posto del prefisso testuale "IT", "DE", ecc. nella P.IVA
function renderPiva(piva) {
  const match = String(piva).match(/^([A-Za-z]{2})(.*)$/);
  if (!match) return `P.IVA ${piva}`;
  const flag = isoToFlag(match[1]);
  return `<span class="team-piva-flag" aria-hidden="true">${flag || match[1]}</span> P.IVA ${match[2]}`;
}

// Riga di contatto con icona + numero/indirizzo visibile (non solo icona)
function contattoTeam(c, icona, valore) {
  if (!c || !c.url) return "";
  return `<a class="team-contatto-riga" href="${c.url}" target="_blank" rel="noopener" title="${c.label || ""}" aria-label="${c.label || ""}">
    <span class="material-icons" aria-hidden="true">${icona}</span>
    <span class="team-contatto-testo">${valore || c.label || ""}</span>
  </a>`;
}

// ── Footer social (riutilizzato anche da servizio.html) ─────
const SVG_EXTERNAL = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", short: "IG" },
  { key: "linkedin", label: "LinkedIn", short: "in" },
  { key: "facebook", label: "Facebook", short: "f" },
  { key: "behance", label: "Behance", short: "Be" },
];

function renderFooterSocial(site) {
  const wrap = document.getElementById("footer-social");
  if (!wrap) return;
  const social = (site && site.social) || {};

  wrap.innerHTML = SOCIAL_PLATFORMS.filter((p) => social[p.key])
    .map(
      (p) => `
      <a
        href="${social[p.key]}"
        target="_blank"
        rel="noopener"
        class="footer-social-link"
        aria-label="${p.label}"
        title="${p.label}"
        >${p.short}</a>`,
    )
    .join("");
}
