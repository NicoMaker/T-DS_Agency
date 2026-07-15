// ============================================================
// services/email/sendAzienda.js — Notifica all'azienda
// ============================================================
const transporter = require("./transporter");
const config = require("../../config");
const { templateAzienda } = require("./templates");

async function sendAzienda(dati) {
  try {
    // Se config.mailTo è vuoto, lancia un errore chiaro
    if (!config.mailTo || config.mailTo.length === 0) {
      throw new Error("Nessun destinatario configurato in MAIL_TO");
    }

    const destinatari = config.mailTo.join(", ");

    const info = await transporter.sendMail({
      from: `"${config.mailFrom.name}" <${config.mailFrom.email}>`,
      to: destinatari,
      replyTo: dati.email, // "Rispondi" va direttamente al cliente
      subject: `📩 Nuova richiesta: ${dati.servizio || "Contatto"} — ${dati.nomeCompleto || "Anonimo"}`,
      html: templateAzienda(dati),
    });

    console.log("✅ Email azienda inviata a:", destinatari);
    console.log("📧 Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ ERRORE invio email azienda:", error.message);
    console.error("📋 Dettaglio:", error);
    throw error; // propaga al chiamante per gestione a monte
  }
}

module.exports = sendAzienda;
