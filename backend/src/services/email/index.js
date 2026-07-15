// ============================================================
// services/email/index.js — Punto d'ingresso del servizio email
// ============================================================
module.exports = {
  sendAzienda: require("./sendAzienda"),
  sendCliente: require("./sendCliente"),
};
