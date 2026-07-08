// ============================================================
// services/email/sendCliente.js — Conferma automatica al cliente
// ============================================================
const transporter = require("./transporter");
const config = require("../../config");
const { templateCliente } = require("./templates");

async function sendCliente(dati) {
  return transporter.sendMail({
    from: `"${config.mailFrom.name}" <${config.mailFrom.email}>`,
    to: dati.email,
    subject: dati.servizio
      ? `Abbiamo ricevuto la tua richiesta per ${dati.servizio} — ${config.azienda.nome}`
      : `Abbiamo ricevuto la tua richiesta — ${config.azienda.nome}`,
    html: templateCliente(dati),
  });
}

module.exports = sendCliente;