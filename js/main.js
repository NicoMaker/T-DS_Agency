/* ============================================
   main.js — Entry point: coordina tutti i moduli
   ============================================ */

import { loadAllData }  from './data.js';
import { initNav }      from './nav.js';
import { initReveal }   from './reveal.js';
import { renderProgetti, renderServizi, renderContatti, renderFooterSocial } from './render.js';

(async function () {
  'use strict';

  initNav();
  const revealIO = initReveal();

  try {
    const { siteData, progettiData, serviziData } = await loadAllData();
    renderProgetti(progettiData, revealIO);
    renderServizi(serviziData, revealIO);
    renderContatti(siteData, revealIO);
    renderFooterSocial(siteData);
  } catch (err) {
    console.error('Errore caricamento dati:', err);
  }
})();
