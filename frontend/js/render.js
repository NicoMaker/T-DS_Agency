// ============================================================
// render.js — Costruzione delle sezioni dai JSON originali
// ============================================================

// ── Social SVG icons ──────────────────────────────────────────
const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/><circle cx="18.5" cy="5.5" r="1.2" fill="currentColor"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.8"/><path d="M8 10v6M8 8v.01M12 16v-4.5M12 12c0-1.5 1-2 2-2s2 .5 2 2v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.8"/><path d="M14 9h3l-.4 2.5H14V21h-3v-9.5H9V9h2V7a3 3 0 0 1 3-3v2h-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  behance: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.8"/><path d="M8 8h5v1.5H8V8zm0 3.5h6.5V13H8v-1.5zm0 3h8.5v1.5H8v-1.5zM16 8h3v1.5h-3V8zm.5 4.5c1.5 0 3 .8 3 2.5 0 2-1.8 3-3.5 3-1.5 0-3-.8-3-2.5h1.5c0 .8.8 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.8-.8-1.5-1.5-1.5h-.5v-1.5h.5z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

// ── Marquee ───────────────────────────────────────────────────
function renderMarquee(datiServizi) {
  const parole = (datiServizi.servizi || []).map((s) => s.titolo);
  buildMarquee(parole);
}

// ── Servizi ──────────────────────────────────────────────────
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

// ── Progetti ─────────────────────────────────────────────────
function renderProgetti(dati) {
  const grid = document.getElementById("progetti-grid");
  const titolo = document.getElementById("progetti-titolo");
  const sotto = document.getElementById("progetti-sottotitolo");
  if (!grid) return;

  if (titolo && dati.titolo) titolo.textContent = dati.titolo;
  if (sotto && dati.sottotitolo) sotto.textContent = dati.sottotitolo;

  grid.innerHTML = (dati.progetti || [])
    .map((p, i) => {
      const apribile = isUrlValida(p.link);
      const tag = apribile ? "a" : "article";
      const attrLink = apribile
        ? ` href="${p.link}" target="_blank" rel="noopener" aria-label="Apri il progetto ${p.titolo}"`
        : "";
      return `
      <${tag}
        class="progetto-card reveal reveal-delay-${i % 3}"
        style="--card-accent:${p.colore || "var(--accent)"}"
        data-cat="${p.categoria || ""}"
        data-search="${`${p.titolo} ${p.descrizione || ""} ${(p.tecnologie || []).join(" ")}`.replace(/"/g, "&quot;").toLowerCase()}"${attrLink}
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
          <div class="progetto-footer">
            ${
              p.tecnologie && p.tecnologie.length
                ? `<div class="progetto-tags">${p.tecnologie
                    .map((t) => `<span class="tag">${t}</span>`)
                    .join("")}</div>`
                : "<span></span>"
            }
            ${apribile ? `<span class="project-link-btn">Apri ${p.categoria || "progetto"} ${SVG_EXTERNAL}</span>` : ""}
          </div>
        </div>
      </${tag}>`;
    })
    .join("");
}

function isUrlValida(link) {
  if (!link || typeof link !== "string") return false;
  return /^(https?:\/\/|\/)/i.test(link.trim());
}

// ── Video ────────────────────────────────────────────────────
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

// ── Utilità per numeri e icone ──────────────────────────────
function formatNumeroVisuale(numero) {
  if (!numero) return "";
  const pulito = String(numero).replace(/\s+/g, "");
  const match = pulito.match(/^(\+\d{1,3})(\d+)$/);
  if (!match) return numero;

  const [, prefisso, resto] = match;
  const gruppi = [];
  for (let i = 0; i < resto.length; i += 3) gruppi.push(resto.slice(i, i + 3));

  if (gruppi.length > 1 && gruppi[gruppi.length - 1].length < 3) {
    const ultimo = gruppi.pop();
    gruppi[gruppi.length - 1] += ultimo;
  }

  return `${prefisso} ${gruppi.join(" ")}`;
}

// Icona WhatsApp in grigio (senza colori), tratto pulito e proporzioni curate
const WHATSAPP_ICON_SVG = `<svg class="icon-whatsapp" width="21" height="21" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M16.02 4C9.4 4 4.05 9.35 4.05 16c0 2.24.6 4.34 1.66 6.15L4 28l6.02-1.58A11.93 11.93 0 0 0 16.02 28C22.64 28 28 22.65 28 16S22.64 4 16.02 4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M11.6 10.75c.3-.66.55-.7.9-.71.28-.02.6-.02.87 0 .3.02.65-.06.95.7.3.79 1.03 2.5 1.12 2.68.1.19.16.4.03.63-.12.23-.19.35-.38.55l-.55.63c-.18.2-.38.4-.16.79.23.4 1.02 1.7 2.24 2.79 1.55 1.34 2.8 1.78 3.2 1.98.4.19.65.16.9-.1.27-.28.87-.98 1.1-1.32.24-.32.48-.27.8-.15l2.5 1.22c.3.14.5.22.56.35.1.2.1.83-.2 1.62-.3.8-1.67 1.54-2.32 1.64-.6.1-1.3.14-2.1-.13-.48-.16-1.1-.36-1.9-.71-3.35-1.5-5.56-4.86-5.73-5.1-.18-.23-1.37-1.83-1.37-3.48 0-1.66.85-2.48 1.14-2.8Z" fill="currentColor"/>
</svg>`;

// ── Bandiere nazionali (immagine reale, non emoji) ─────────────
// Le emoji-bandiera su alcuni sistemi/browser (es. Windows meno recenti)
// non vengono renderizzate a colori e appaiono come semplice testo ("IT",
// "GB", ecc.). Usiamo quindi una vera immagine SVG della bandiera.
function flagImgHtml(iso, opts = {}) {
  if (!iso || iso.length !== 2) return "";
  const { width = 20, height = 15, className = "flag-icon" } = opts;
  const code = iso.toLowerCase();
  return `<img src="https://flagcdn.com/${code}.svg" alt="${iso.toUpperCase()}" class="${className}" width="${width}" height="${height}" loading="lazy" />`;
}

function renderPiva(piva) {
  const match = String(piva).match(/^([A-Za-z]{2})(.*)$/);
  if (!match) return `P.IVA ${piva}`;
  const iso = match[1].toUpperCase();
  const flagHtml = flagImgHtml(iso, { width: 18, height: 13 });
  return `<span class="team-piva-flag" aria-hidden="true">${flagHtml || iso}</span> P.IVA ${match[2]}`;
}

function contattoTeam(c, icona, valore) {
  if (!c || !c.url) return "";
  const iconaHtml = icona.trim().startsWith("<svg")
    ? icona
    : `<span class="material-icons" aria-hidden="true">${icona}</span>`;
  return `<a class="team-contatto-riga" href="${c.url}" target="_blank" rel="noopener" title="${c.label || ""}" aria-label="${c.label || ""}">
    ${iconaHtml}
    <span class="team-contatto-testo">${valore || c.label || ""}</span>
  </a>`;
}

// ── Team (con card aziendale) ──────────────────────────────
function renderTeam(site) {
  const grid = document.getElementById("team-grid");
  const sotto = document.getElementById("team-sottotitolo");
  if (!grid) return;

  const azienda = site.azienda || {};
  if (sotto && azienda.descrizione) sotto.textContent = azienda.descrizione;

  let html = (site.team || [])
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
            ${contattoTeam(m.contatti && m.contatti.whatsapp, WHATSAPP_ICON_SVG, formatNumeroVisuale(m.contatti && m.contatti.whatsapp && m.contatti.whatsapp.numero))}
            ${contattoTeam(m.contatti && m.contatti.telefono, "call", formatNumeroVisuale(m.contatti && m.contatti.telefono && m.contatti.telefono.numero))}
            ${contattoTeam(m.contatti && m.contatti.email, "email", m.contatti && m.contatti.email && m.contatti.email.indirizzo)}
          </div>
        </div>
      </article>
    `,
    )
    .join("");

  // ── Card aziendale (senza gradienti) ──
  if (azienda.contattiAzienda) {
    const ca = azienda.contattiAzienda;
    const contattiAzienda = [
      ca.whatsapp &&
        contattoTeam(
          ca.whatsapp,
          WHATSAPP_ICON_SVG,
          formatNumeroVisuale(ca.whatsapp.numero),
        ),
      ca.telefono &&
        contattoTeam(
          ca.telefono,
          "call",
          formatNumeroVisuale(ca.telefono.numero),
        ),
      ca.email && contattoTeam(ca.email, "email", ca.email.indirizzo),
    ].filter(Boolean);

    const delayIndex = (site.team || []).length % 3;

    html += `
      <article class="team-card azienda reveal reveal-delay-${delayIndex}" style="border-color: var(--line-strong);">
        <div class="team-foto" style="background: var(--accent); display: grid; place-items: center; font-size: 2.2rem; color: #fff; font-weight: 800;">
          <span>N.</span>
        </div>
        <div class="team-body">
          <h3>${azienda.nome || "Azienda"}</h3>
          <div class="team-ruolo">${ca.ruolo || "Contatti generali"}</div>
          <div class="team-contatti-list">
            ${contattiAzienda.join("")}
          </div>
        </div>
      </article>
    `;
  }

  grid.innerHTML = html;
}

// ── Footer social ────────────────────────────────────────────
const SVG_EXTERNAL = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: SOCIAL_ICONS.instagram },
  { key: "linkedin", label: "LinkedIn", icon: SOCIAL_ICONS.linkedin },
  { key: "facebook", label: "Facebook", icon: SOCIAL_ICONS.facebook },
  { key: "behance", label: "Behance", icon: SOCIAL_ICONS.behance },
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
      >
        ${p.icon}
        <span class="footer-social-label">${p.label}</span>
      </a>`,
    )
    .join("");
}
