// ============================================================
// render.js — Costruzione delle sezioni dai JSON originali
// (site.json, servizi.json, progetti.json, video.json)
// ============================================================

// ── Social SVG icons ──────────────────────────────────────────
const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/><circle cx="18.5" cy="5.5" r="1.2" fill="currentColor"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.8"/><path d="M8 10v6M8 8v.01M12 16v-4.5M12 12c0-1.5 1-2 2-2s2 .5 2 2v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.8"/><path d="M14 9h3l-.4 2.5H14V21h-3v-9.5H9V9h2V7a3 3 0 0 1 3-3v2h-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  behance: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.8"/><path d="M8 8h5v1.5H8V8zm0 3.5h6.5V13H8v-1.5zm0 3h8.5v1.5H8v-1.5zM16 8h3v1.5h-3V8zm.5 4.5c1.5 0 3 .8 3 2.5 0 2-1.8 3-3.5 3-1.5 0-3-.8-3-2.5h1.5c0 .8.8 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.8-.8-1.5-1.5-1.5h-.5v-1.5h.5z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

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
        data-search="${(`${p.titolo} ${p.descrizione || ""} ${(p.tecnologie || []).join(" ")}`).replace(/"/g, "&quot;").toLowerCase()}"${attrLink}
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
            ${apribile ? `<span class="project-link-btn">Apri ${SVG_EXTERNAL}</span>` : ""}
          </div>
        </div>
      </${tag}>`;
    })
    .join("");
}

// Considera valido solo un link che sembra davvero un URL (evita
// di mostrare un bottone "Apri" rotto per valori segnaposto tipo "ejoi2j")
function isUrlValida(link) {
  if (!link || typeof link !== "string") return false;
  return /^(https?:\/\/|\/)/i.test(link.trim());
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

// Formatta un numero "+393331234567" come "+39 333 123 4567",
// così anche il numero WhatsApp appare leggibile come quello del telefono
// (funziona su qualunque numero, anche se nel JSON è scritto senza spazi)
function formatNumeroVisuale(numero) {
  if (!numero) return "";
  const pulito = String(numero).replace(/\s+/g, "");
  const match = pulito.match(/^(\+\d{1,3})(\d+)$/);
  if (!match) return numero;

  const [, prefisso, resto] = match;
  const gruppi = [];
  for (let i = 0; i < resto.length; i += 3) gruppi.push(resto.slice(i, i + 3));

  // L'ultimo gruppo, se troppo corto, si unisce al precedente (es. "4","567" → "4567")
  if (gruppi.length > 1 && gruppi[gruppi.length - 1].length < 3) {
    const ultimo = gruppi.pop();
    gruppi[gruppi.length - 1] += ultimo;
  }

  return `${prefisso} ${gruppi.join(" ")}`;
}

// Icona WhatsApp (fumetto + cornetta stilizzata), colorata di verde
// per essere riconoscibile a colpo d'occhio rispetto a chiamata/email
const WHATSAPP_ICON_SVG = `<svg class="icon-whatsapp" width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" stroke="#25D366" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M8.6 8.4c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.4.2.5.7 1.7.7 1.8.1.1.1.3 0 .4-.1.2-.2.3-.3.4l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4.1.4-.1 1.1-.5 1.5-.5.5-1.5.8-2.5.5-2.4-.6-4.4-2.3-5.9-4.3-.6-.8-1-1.7-1-2.7 0-.9.4-1.6.6-1.9Z" fill="#25D366"/>
</svg>`;

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
            ${contattoTeam(m.contatti && m.contatti.whatsapp, WHATSAPP_ICON_SVG, formatNumeroVisuale(m.contatti && m.contatti.whatsapp && m.contatti.whatsapp.numero))}
            ${contattoTeam(m.contatti && m.contatti.telefono, "call", formatNumeroVisuale(m.contatti && m.contatti.telefono && m.contatti.telefono.numero))}
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
// "icona" può essere il nome di una Material Icon (es. "call") oppure
// una stringa SVG già pronta (usata per WhatsApp, per essere riconoscibile)
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

// ── Footer social (riutilizzato anche da servizio.html) ─────
const SVG_EXTERNAL = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Mappatura piattaforme con chiave, label e icona SVG
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