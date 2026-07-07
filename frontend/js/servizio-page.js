// ============================================================
// servizio-page.js — Pagina di dettaglio di un singolo servizio
// (servizio.html?slug=xxx). Script classico, coerente con il
// resto del sito (nessun modulo ES).
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

  const loadingEl = document.getElementById("sd-loading");
  const notfoundEl = document.getElementById("sd-notfound");
  const contentEl = document.getElementById("sd-content");

  try {
    // --- Slug dalla query string: servizio.html?slug=siti-web ---
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    const [siteData, progettiData, serviziData] = await Promise.all([
      SiteData.load("site"),
      SiteData.load("progetti"),
      SiteData.load("servizi"),
    ]);

    renderFooterSocial(siteData);

    const servizio = (serviziData.servizi || []).find((s) => s.slug === slug);

    if (!servizio) {
      loadingEl.style.display = "none";
      notfoundEl.style.display = "";
      initNav();
      return;
    }

    // --- Titolo pagina dinamico ---
    document.title = `${servizio.titolo} – Nooo Agency`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", servizio.descrizione);

    // --- Popolo i campi ---
    document.getElementById("sd-icon").textContent = servizio.icona;
    document.getElementById("sd-title").textContent = servizio.titolo;
    document.getElementById("sd-desc").textContent = servizio.descrizione;

    // Lista dettagli
    const lista = document.getElementById("sd-lista");
    lista.innerHTML = (servizio.dettagli || [])
      .map((d) => `<li><span class="lista-check">✓</span>${d}</li>`)
      .join("");

    // FAQ accordion
    const faqWrap = document.getElementById("sd-faq");
    if (servizio.faq && servizio.faq.length) {
      faqWrap.innerHTML = servizio.faq
        .map(
          (f, i) => `
        <div class="faq-item">
          <button class="faq-toggle" aria-expanded="false" aria-controls="faq-body-${i}">
            <span>${f.domanda}</span>
            <span class="faq-arrow">+</span>
          </button>
          <div class="faq-body" id="faq-body-${i}" hidden>
            <p>${f.risposta}</p>
          </div>
        </div>
      `,
        )
        .join("");

      faqWrap.querySelectorAll(".faq-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
          const expanded = btn.getAttribute("aria-expanded") === "true";
          faqWrap.querySelectorAll(".faq-toggle").forEach((b) => {
            b.setAttribute("aria-expanded", "false");
            b.querySelector(".faq-arrow").textContent = "+";
            document.getElementById(b.getAttribute("aria-controls")).hidden = true;
          });
          if (!expanded) {
            btn.setAttribute("aria-expanded", "true");
            btn.querySelector(".faq-arrow").textContent = "−";
            document.getElementById(btn.getAttribute("aria-controls")).hidden = false;
          }
        });
      });
    } else {
      faqWrap.innerHTML = "";
    }

    // Progetti correlati
    const correlatiWrap = document.getElementById("sd-correlati-wrap");
    const correlatiGrid = document.getElementById("sd-correlati-grid");
    let correlati =
      servizio.categorie_correlate && servizio.categorie_correlate.length
        ? progettiData.progetti.filter((p) =>
            servizio.categorie_correlate.includes(p.categoria),
          )
        : [];

    // Fallback: se non ci sono progetti correlati per categoria,
    // mostro comunque alcuni progetti (i più recenti) invece di nascondere la sezione
    if (!correlati.length) {
      correlati = [...progettiData.progetti]
        .sort((a, b) => b.anno - a.anno)
        .slice(0, 3);
    }

    if (correlati.length) {
      correlatiGrid.innerHTML = correlati
        .map((p) => {
          const isPresetCat =
            servizio.categorie_correlate &&
            servizio.categorie_correlate.includes(p.categoria);
          const apribile = isUrlValida(p.link);
          const tag = apribile ? "a" : "div";
          const attrLink = apribile
            ? ` href="${p.link}" target="_blank" rel="noopener" aria-label="Apri il progetto ${p.titolo}"`
            : "";
          return `
        <${tag} class="project-card" data-cat="${p.categoria}" data-search="${(`${p.titolo} ${p.descrizione} ${(p.tecnologie || []).join(" ")}`).toLowerCase()}"${attrLink}>
          <div class="project-img-wrap">
            <img src="${p.immagine_placeholder}" alt="${p.titolo}" loading="lazy">
            <div class="project-overlay"></div>
            ${isPresetCat ? "" : `<span class="project-tag">${p.categoria}</span>`}
          </div>
          <div class="project-body">
            <p class="project-anno">${p.anno}</p>
            <h3 class="project-title">${p.titolo}</h3>
            <p class="project-desc">${p.descrizione}</p>
            <div class="project-card-footer">
              <div class="project-tech">${(p.tecnologie || []).map((t) => `<span class="tech-tag">${t}</span>`).join("")}</div>
              ${apribile ? `<span class="project-link-btn">Apri ${SVG_EXTERNAL}</span>` : ""}
            </div>
          </div>
        </${tag}>
      `;
        })
        .join("");
      correlatiWrap.style.display = "";

      // --- Ricerca + filtro categorie nei progetti correlati ---
      initFilterGrid({
        grid: correlatiGrid,
        searchInput: document.getElementById("sd-search-correlati"),
        catWrap: document.getElementById("sd-correlati-categorie"),
        emptyEl: document.getElementById("sd-correlati-empty"),
        cardSelector: ".project-card",
      });
    } else {
      correlatiWrap.style.display = "none";
    }

    // Servizi correlati (solo quelli pertinenti a questa attività, non tutti)
    const altriSelect = document.getElementById("sd-altri-select");
    let correlatiServizi = (servizio.correlati || [])
      .map((relSlug) => serviziData.servizi.find((s) => s.slug === relSlug))
      .filter(Boolean);

    // Fallback: se il servizio non ha una lista "correlati" in servizi.json,
    // mostro comunque un paio di alternative invece di nascondere il blocco
    if (!correlatiServizi.length) {
      correlatiServizi = serviziData.servizi
        .filter((s) => s.slug !== slug)
        .slice(0, 3);
    }

    if (altriSelect) {
      altriSelect.innerHTML =
        `<option value="" disabled selected>Scegli un servizio correlato…</option>` +
        correlatiServizi
          .map(
            (s) =>
              `<option value="${s.slug}">${s.icona ? s.icona + " " : ""}${s.titolo}</option>`,
          )
          .join("");

      // Navigazione automatica: appena selezioni, si va subito
      // all'inizio del dettaglio del nuovo servizio (nessun bottone da premere).
      altriSelect.addEventListener("change", () => {
        const nuovoSlug = altriSelect.value;
        if (nuovoSlug) window.location.href = `servizio.html?slug=${nuovoSlug}`;
      });
    }

    // --- Mostro il contenuto ---
    loadingEl.style.display = "none";
    contentEl.style.display = "";

    // --- Nav + reveal animations ---
    initNav();
    initReveal();
    if (typeof initMagneticButtons === "function") initMagneticButtons();
  } catch (err) {
    console.error("Errore caricamento servizio:", err);
    loadingEl.style.display = "none";
    notfoundEl.style.display = "";
    initNav();
  }
});

// --- Anno footer ---
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});