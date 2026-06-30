import { loadJSON } from "./data.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import { renderFooterSocial, SVG_EXTERNAL } from "./render.js";
import {
  initParticles,
  initParallax,
  initMouseGlow,
} from "./animations.js";

(async function () {
  "use strict";

  initParticles();
  initParallax();
  initMouseGlow();

  const loadingEl = document.getElementById("sd-loading");
  const notfoundEl = document.getElementById("sd-notfound");
  const contentEl = document.getElementById("sd-content");

  try {
    // --- Slug dalla query string: servizio.html?slug=siti-web ---
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    const [siteData, progettiData, serviziData] = await Promise.all([
      loadJSON("data/site.json"),
      loadJSON("data/progetti.json"),
      loadJSON("data/servizi.json"),
    ]);

    renderFooterSocial(siteData);

    const servizio = serviziData.servizi.find((s) => s.slug === slug);

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
    lista.innerHTML = servizio.dettagli
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
        .map(
          (p) => `
        <div class="project-card reveal" data-cat="${p.categoria}">
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
      correlatiWrap.style.display = "";
    } else {
      correlatiWrap.style.display = "none";
    }

    // Altri servizi (escluso quello corrente)
    const altriGrid = document.getElementById("sd-altri-grid");
    const altri = serviziData.servizi.filter((s) => s.slug !== slug);
    altriGrid.innerHTML = altri
      .map(
        (s) => `
      <div class="servizio-card reveal" style="--servizio-color:${s.colore}">
        <span class="servizio-icon">${s.icona}</span>
        <h3 class="servizio-title">${s.titolo}</h3>
        <p class="servizio-desc">${s.descrizione}</p>
        <a href="servizio.html?slug=${s.slug}" class="btn-servizio-detail">Scopri di più →</a>
      </div>
    `,
      )
      .join("");

    // --- Mostro il contenuto ---
    loadingEl.style.display = "none";
    contentEl.style.display = "";

    // --- Nav + reveal animations ---
    initNav();
    const revealIO = initReveal();
    document
      .querySelectorAll("#servizio-detail .reveal")
      .forEach((el) => revealIO.observe(el));
  } catch (err) {
    console.error("Errore caricamento servizio:", err);
    loadingEl.style.display = "none";
    notfoundEl.style.display = "";
    initNav();
  }
})();

// --- Anno footer ---
const yearEl = document.getElementById("current-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();