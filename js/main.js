import { loadAllData } from "./data.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import {
  renderProgetti,
  renderServizi,
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

(async function () {
  "use strict";

  // --- Inizializzazioni generali ---
  initNav();
  const revealIO = initReveal();
  initParticles();
  initTypewriter();
  initParallax();
  initMouseGlow();

  try {
    // --- Caricamento dati ---
    const { siteData, progettiData, serviziData } = await loadAllData();

    // --- Contatore progetti ---
    const totalProgetti = progettiData.progetti.length;
    const statItems = document.querySelectorAll(".stat-item");
    statItems.forEach((item) => {
      const label = item.querySelector(".label");
      if (label && label.textContent.trim() === "Progetti realizzati") {
        item.dataset.count = totalProgetti;
      }
    });
    initCounter();

    // --- Render dei contenuti ---
    renderProgetti(progettiData, revealIO);
    renderServizi(serviziData, revealIO);
    renderContatti(siteData, revealIO);
    renderFooterSocial(siteData);

    // --- Popolamento dropdown categorie ---
    const dropdownMenu = document.querySelector(".nav-dropdown-menu");
    if (dropdownMenu && progettiData) {
      const categorieSet = new Set(
        progettiData.progetti.map((p) => p.categoria),
      );
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

      // -------------------------------
      // DELEGAZIONE EVENTI: ascolto i click su tutto il dropdown
      // -------------------------------
      dropdownMenu.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        // Verifico che sia un link interno al dropdown (con dataset.cat)
        if (!link.dataset.cat) return;

        e.preventDefault(); // Blocca il comportamento predefinito dell'ancora

        const categoria = link.dataset.cat;

        // Scroll alla sezione progetti (con fallback se non esiste)
        const progettiSection = document.getElementById("progetti");
        if (progettiSection) {
          progettiSection.scrollIntoView({ behavior: "smooth" });
        } else {
          console.warn("Sezione #progetti non trovata");
        }

        // Imposta il select e attiva il filtro
        const select = document.getElementById("categoria-select");
        if (select) {
          select.value = categoria;
          select.dispatchEvent(new Event("change"));
        }
      });
    }

    // -------------------------------
    // SCROLL AUTOMATICO ALL'AVVIO CON HASH #progetti
    // -------------------------------
    if (window.location.hash === "#progetti") {
      // Attendere il completamento del rendering (layout) prima di scrollare
      // Uso un setTimeout per dare tempo ai contenuti di essere renderizzati
      setTimeout(() => {
        const progettiSection = document.getElementById("progetti");
        if (progettiSection) {
          progettiSection.scrollIntoView({ behavior: "smooth" });
        } else {
          console.warn("Sezione #progetti non trovata per lo scroll iniziale");
        }
      }, 600); // 600 ms è un buon compromesso
    }

    // -------------------------------
    // LISTENER DI FILTRO (se non già presente in render.js)
    // -------------------------------
    const select = document.getElementById("categoria-select");
    if (select) {
      // Rimuovo eventuali listener precedenti (per evitare duplicati)
      // Nota: se render.js ha già un listener, questo si aggiunge e coesiste.
      select.addEventListener("change", function () {
        const categoria = this.value;
        const cards = document.querySelectorAll("#progetti-grid .project-card");
        cards.forEach((card) => {
          const cardCat = card.dataset.categoria;
          if (categoria === "Tutti" || cardCat === categoria) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    }
  } catch (err) {
    console.error("Errore caricamento dati:", err);
  }
})();

// --- Gestione anno nel footer (invariata) ---
document.getElementById("current-year").textContent = new Date().getFullYear();

function updateYear() {
  const yearEl = document.getElementById("current-year");
  if (!yearEl) return;
  const now = new Date();
  const currentYear = now.getFullYear();
  if (yearEl.textContent !== currentYear.toString()) {
    yearEl.textContent = currentYear;
  }
  const nextYear = currentYear + 1;
  const nextJan1 = new Date(nextYear, 0, 1, 0, 0, 0, 0);
  const msUntilMidnight = nextJan1 - now;
  if (msUntilMidnight > 0 && msUntilMidnight < 86400000) {
    clearTimeout(window._yearTimer);
    window._yearTimer = setTimeout(() => {
      updateYear();
      setInterval(updateYear, 1000);
    }, msUntilMidnight + 10);
  }
}

updateYear();
setInterval(updateYear, 1000);