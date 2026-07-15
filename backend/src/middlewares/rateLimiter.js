// ============================================================
// middlewares/rateLimiter.js — Anti-spam semplice per il form
// Max 5 invii ogni 15 minuti per IP (in memoria, senza librerie)
// ============================================================
const FINESTRA_MS = 15 * 60 * 1000;
const MAX_RICHIESTE = 5;

const richieste = new Map(); // ip → array di timestamp

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || "sconosciuto";
  const ora = Date.now();

  const storico = (richieste.get(ip) || []).filter(
    (t) => ora - t < FINESTRA_MS,
  );

  if (storico.length >= MAX_RICHIESTE) {
    return res.status(429).json({
      ok: false,
      errori: [
        "Troppe richieste in poco tempo. Riprova tra qualche minuto o chiamaci direttamente.",
      ],
    });
  }

  storico.push(ora);
  richieste.set(ip, storico);

  // Pulizia periodica per non far crescere la mappa
  if (richieste.size > 1000) {
    for (const [k, v] of richieste) {
      if (!v.some((t) => ora - t < FINESTRA_MS)) richieste.delete(k);
    }
  }

  next();
}

module.exports = rateLimiter;
