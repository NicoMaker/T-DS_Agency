// ============================================================
// services/email/sendAzienda.js — Notifica all'azienda
// ============================================================
const transporter = require("./transporter");
const config = require("../../config");
const { templateAzienda } = require("./templates");

async function sendAzienda(dati) {
  return transporter.sendMail({
    from: `"${config.mailFrom.name}" <${config.mailFrom.email}>`,
    to: config.mailTo,
    replyTo: dati.email, // "Rispondi" va direttamente al cliente
    subject: `📩 Nuova richiesta: ${dati.servizio} — ${dati.nomeCompleto}`,
    html: templateAzienda(dati),
  });
}

module.exports = sendAzienda;