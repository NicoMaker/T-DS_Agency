/* ============================================
   data.js — Caricamento dati JSON
   ============================================ */

export async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`JSON load failed: ${path}`);
  return res.json();
}

export async function loadAllData() {
  const [siteData, progettiData, serviziData] = await Promise.all([
    loadJSON("data/site.json"),
    loadJSON("data/progetti.json"),
    loadJSON("data/servizi.json"),
  ]);
  return { siteData, progettiData, serviziData };
}