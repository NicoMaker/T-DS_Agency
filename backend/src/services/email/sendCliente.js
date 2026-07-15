// ============================================================
// services/email/sendCliente.js — Conferma automatica al cliente
// ============================================================
const transporter = require("./transporter");
const config = require("../../config");
const { templateCliente } = require("./templates");

async function sendCliente(dati) {
  try {
    if (!dati.email) {
      throw new Error("Email del cliente non fornita");
    }

    const info = await transporter.sendMail({
      from: `"${config.mailFrom.name}" <${config.mailFrom.email}>`,
      to: dati.email,
      subject: dati.servizio
        ? `Abbiamo ricevuto la tua richiesta per ${dati.servizio} — ${config.azienda.nome}`
        : `Abbiamo ricevuto la tua richiesta — ${config.azienda.nome}`,
      html: templateCliente(dati),
      // Opzioni per migliorare deliverability
      headers: {
        "X-Priority": "3",
        "List-Unsubscribe": `<mailto:${config.mailFrom.email}?subject=unsubscribe>`,
      },
    });

    console.log("✅ Email cliente inviata a:", dati.email);
    console.log("📧 Message ID:", info.messageId);
    console.log(
      "📨 Accettati:",
      info.accepted?.length ? info.accepted.join(", ") : "nessuno",
    );
    console.log(
      "📨 Rifiutati:",
      info.rejected?.length ? info.rejected.join(", ") : "nessuno",
    );

    // Se il server SMTP ha rifiutato la consegna, lanciamo un errore
    if (info.rejected && info.rejected.length > 0) {
      throw new Error(
        `Email rifiutata dal server SMTP per: ${info.rejected.join(", ")}`,
      );
    }

    return info;
  } catch (error) {
    console.error("❌ ERRORE invio email cliente:", error.message);
    // Log completo per debug (solo in sviluppo)
    if (process.env.NODE_ENV === "development") {
      console.error("📋 Dettaglio completo:", error);
    }
    throw error;
  }
}

module.exports = sendCliente;
