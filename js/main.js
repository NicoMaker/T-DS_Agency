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

  // --- Inizializzazioni che non dipendono dal DOM dei contenuti ---
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

    // --- Inizializzo l'Observer per le animazioni di comparsa ---
    const revealIO = initReveal();

    // --- Render dei contenuti (popola le sezioni) ---
    renderProgetti(progettiData, revealIO);
    renderServizi(serviziData, revealIO);
    renderContatti(siteData, revealIO);
    renderFooterSocial(siteData);

    // --- NAVIGAZIONE: ora che il DOM è completo, attivo il nav ---
    initNav();

    // --- Popolamento dropdown categorie progetti ---
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

      // Delegazione eventi per il dropdown progetti
      dropdownMenu.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link || !link.dataset.cat) return;
        e.preventDefault();

        const categoria = link.dataset.cat;
        const progettiSection = document.getElementById("progetti");
        if (progettiSection) {
          progettiSection.scrollIntoView({ behavior: "smooth" });
        }

        const select = document.getElementById("categoria-select");
        if (select) {
          select.value = categoria;
          select.dispatchEvent(new Event("change"));
        }
      });
    }

    // --- Popolamento dropdown SERVIZI (link a pagine separate) ---
    const serviziDropdown = document.getElementById("servizi-dropdown-menu");
    if (serviziDropdown && serviziData) {
      serviziDropdown.innerHTML = "";
      serviziData.servizi.forEach((s) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `servizio.html?slug=${s.slug}`;
        a.textContent = `${s.icona} ${s.titolo}`;
        li.appendChild(a);
        serviziDropdown.appendChild(li);
      });
    }

    // --- SCROLL AUTOMATICO PER QUALSIASI HASH ALL'AVVIO ---
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const targetId = hash.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }

    // --- FORZO L'AGGIORNAMENTO DELLA CLASSE ACTIVE SUI LINK DI NAV ---
    setTimeout(() => {
      const currentHash = window.location.hash || "#home";
      const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
      navLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === currentHash);
      });
      const mobileLinks = document.querySelectorAll('.nav-mobile a[href^="#"]');
      mobileLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === currentHash);
      });
    }, 600);

    // --- Listener di filtro per il select progetti ---
    const select = document.getElementById("categoria-select");
    if (select) {
      select.addEventListener("change", function () {
        const categoria = this.value;
        const cards = document.querySelectorAll("#progetti-grid .project-card");
        cards.forEach((card) => {
          const cardCat = card.dataset.cat;
          if (categoria === "Tutti" || cardCat === categoria) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    }

    // --- PROTEZIONE PER I LINK DEI CONTATTI ---
    document.querySelectorAll(".contatto-card").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href === "#progetti" || href === "") {
        link.style.pointerEvents = "none";
        link.style.opacity = "0.5";
        link.title = "Link non valido (controlla i dati)";
        console.warn(
          "⚠️ Link contatto non valido:",
          link,
          "href =",
          href,
          "\nControlla il file site.json per questo contatto.",
        );
      }
    });
  } catch (err) {
    console.error("Errore caricamento dati:", err);
  }
})();

// --- Gestione anno nel footer ---
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