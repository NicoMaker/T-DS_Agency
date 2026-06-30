import { loadAllData } from "./data.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import {
  renderProgetti,
  renderServizi,
  renderServizioDetail,
  renderContatti,
  renderFooterSocial,
} from "./render.js";
import {
  initParticles,
  initTypewriter,
  initCounter,
  initParallax,
  initMouseGlow,
} from "./animations.js";

// ─── Sezioni principali (usate dal router) ───────────────────────────────────
const MAIN_SECTIONS = ["home", "progetti", "servizi", "contatti"];

// ─── Riferimento globale al revealObserver ───────────────────────────────────
let revealIO = null;

// ─── ROUTER ─────────────────────────────────────────────────────────────────
// Gestisce #servizio/<slug> vs hash normali (#home, #progetti, ecc.)
function router(hash) {
  const detailSection = document.getElementById("servizio-detail");

  // Pagina dettaglio servizio: #servizio/<slug>
  if (hash && hash.startsWith("#servizio/")) {
    const slug = hash.replace("#servizio/", "");
    const ok = renderServizioDetail(slug, revealIO);
    if (ok) {
      // Nascondi le sezioni normali, mostra la pagina dettaglio
      MAIN_SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === "home" ? "" : "none";
      });
      detailSection.style.display = "";
      detailSection.scrollIntoView({ behavior: "smooth" });
      return;
    }
  }

  // Navigazione normale: mostra tutto, nascondi servizio-detail
  detailSection.style.display = "none";
  MAIN_SECTIONS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "";
  });

  // Scroll all'ancora
  if (hash && hash.length > 1) {
    const targetId = hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      setTimeout(() => targetElement.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
(async function () {
  "use strict";

  initParticles();
  initTypewriter();
  initParallax();
  initMouseGlow();

  try {
    const { siteData, progettiData, serviziData } = await loadAllData();

    // Contatore progetti
    const totalProgetti = progettiData.progetti.length;
    const statItems = document.querySelectorAll(".stat-item");
    statItems.forEach((item) => {
      const label = item.querySelector(".label");
      if (label && label.textContent.trim() === "Progetti realizzati") {
        item.dataset.count = totalProgetti;
      }
    });
    initCounter();

    // Observer animazioni
    revealIO = initReveal();

    // Render contenuti
    renderProgetti(progettiData, revealIO);
    renderServizi(serviziData, revealIO);
    renderContatti(siteData, revealIO);
    renderFooterSocial(siteData);

    // Nav
    initNav();

    // ── Dropdown PROGETTI ──────────────────────────────────────────────────
    const dropdownMenu = document.querySelector(".nav-dropdown-menu");
    if (dropdownMenu && progettiData) {
      const categorieSet = new Set(progettiData.progetti.map((p) => p.categoria));
      const categorie = ["Tutti", ...Array.from(categorieSet)];
      dropdownMenu.innerHTML = "";
      categorie.forEach((cat) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#progetti";
        a.dataset.cat = cat;
        a.textContent = cat;
        li.appendChild(a);
        dropdownMenu.appendChild(li);
      });

      dropdownMenu.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link || !link.dataset.cat) return;
        e.preventDefault();
        const categoria = link.dataset.cat;
        document.getElementById("progetti")?.scrollIntoView({ behavior: "smooth" });
        const select = document.getElementById("categoria-select");
        if (select) {
          select.value = categoria;
          select.dispatchEvent(new Event("change"));
        }
      });
    }

    // ── Dropdown SERVIZI ───────────────────────────────────────────────────
    const serviziDropdown = document.getElementById("servizi-dropdown-menu");
    if (serviziDropdown && serviziData) {
      serviziDropdown.innerHTML = "";
      serviziData.servizi.forEach((s) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#servizio/${s.slug}`;
        a.textContent = `${s.icona} ${s.titolo}`;
        li.appendChild(a);
        serviziDropdown.appendChild(li);
      });
    }

    // ── Bottone "← Tutti i servizi" ───────────────────────────────────────
    const btnBack = document.getElementById("btn-back-servizi");
    if (btnBack) {
      btnBack.addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState(null, "", "#servizi");
        router("#servizi");
      });
    }

    // ── Listener click su carte servizi (delegazione) ─────────────────────
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[href^='#servizio/']");
      if (!link) return;
      e.preventDefault();
      const hash = link.getAttribute("href");
      history.pushState(null, "", hash);
      router(hash);
    });

    // ── Listener select filtro progetti ───────────────────────────────────
    const select = document.getElementById("categoria-select");
    if (select) {
      select.addEventListener("change", function () {
        const categoria = this.value;
        const cards = document.querySelectorAll("#progetti-grid .project-card");
        cards.forEach((card) => {
          card.style.display =
            categoria === "Tutti" || card.dataset.cat === categoria ? "" : "none";
        });
      });
    }

    // ── Router iniziale + ascolto hashchange ──────────────────────────────
    router(window.location.hash || "#home");
    window.addEventListener("hashchange", () => router(window.location.hash));

    // ── Protezione link contatti vuoti ────────────────────────────────────
    document.querySelectorAll(".contatto-card").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href === "#progetti" || href === "") {
        link.style.pointerEvents = "none";
        link.style.opacity = "0.5";
        link.title = "Link non valido (controlla i dati)";
        console.warn("⚠️ Link contatto non valido:", href);
      }
    });

    // ── Aggiornamento classe active nav ───────────────────────────────────
    setTimeout(() => {
      const currentHash = window.location.hash || "#home";
      document.querySelectorAll('.nav-links a[href^="#"]').forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === currentHash);
      });
      document.querySelectorAll('.nav-mobile a[href^="#"]').forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === currentHash);
      });
    }, 600);

  } catch (err) {
    console.error("Errore caricamento dati:", err);
  }
})();

// ─── Anno footer ─────────────────────────────────────────────────────────────
document.getElementById("current-year").textContent = new Date().getFullYear();

function updateYear() {
  const yearEl = document.getElementById("current-year");
  if (!yearEl) return;
  const now = new Date();
  const currentYear = now.getFullYear();
  if (yearEl.textContent !== currentYear.toString()) yearEl.textContent = currentYear;
  const nextJan1 = new Date(currentYear + 1, 0, 1);
  const ms = nextJan1 - now;
  if (ms > 0 && ms < 86400000) {
    clearTimeout(window._yearTimer);
    window._yearTimer = setTimeout(() => {
      updateYear();
      setInterval(updateYear, 1000);
    }, ms + 10);
  }
}
updateYear();
setInterval(updateYear, 1000);
