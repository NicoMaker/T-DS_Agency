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

  initNav();
  const revealIO = initReveal();
  initParticles();
  initTypewriter();
  initParallax();
  initMouseGlow();

  try {
    const { siteData, progettiData, serviziData } = await loadAllData();

    const totalProgetti = progettiData.progetti.length;
    const statItems = document.querySelectorAll(".stat-item");
    statItems.forEach((item) => {
      const label = item.querySelector(".label");
      if (label && label.textContent.trim() === "Progetti realizzati") {
        item.dataset.count = totalProgetti;
      }
    });

    initCounter();

    // Render dei contenuti
    renderProgetti(progettiData, revealIO);
    renderServizi(serviziData, revealIO);
    renderContatti(siteData, revealIO);
    renderFooterSocial(siteData);

    // ---- POPOLO IL DROPDOWN NAVBAR CON LE CATEGORIE ----
    const dropdownMenu = document.querySelector(".nav-dropdown-menu");
    if (dropdownMenu && progettiData) {
      // Estraggo le categorie uniche
      const categorieSet = new Set(progettiData.progetti.map((p) => p.categoria));
      const categorie = ["Tutti", ...Array.from(categorieSet)];

      // Svuoto il menu (tranne eventuali voci fisse, ma non ce ne sono)
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

      // Aggiungo event listener a ogni voce
      dropdownMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const categoria = link.dataset.cat;

          // Scorro alla sezione progetti
          const progettiSection = document.getElementById("progetti");
          if (progettiSection) {
            progettiSection.scrollIntoView({ behavior: "smooth" });
          }

          // Imposto il select e attivo il filtro
          const select = document.getElementById("categoria-select");
          if (select) {
            select.value = categoria;
            // Trigger dell'evento 'change' per filtrare
            select.dispatchEvent(new Event("change"));
          }
        });
      });
    }
  } catch (err) {
    console.error("Errore caricamento dati:", err);
  }
})();