// ============================================================
// middlewares/errorHandler.js — Gestione errori centralizzata
// ============================================================
function errorHandler(err, req, res, next) {
  console.error("❌ Errore non gestito:", err);
  res.status(err.status || 500).json({
    ok: false,
    errori: ["Si è verificato un errore interno. Riprova più tardi."],
  });
}

module.exports = errorHandler;
