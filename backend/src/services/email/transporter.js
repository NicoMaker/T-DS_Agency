// ============================================================
// services/email/transporter.js — Connessione SMTP (Nodemailer)
// ============================================================
const nodemailer = require("nodemailer");
const config = require("../../config");

console.log("📧 Configurazione SMTP caricata:");
console.log("  Host    :", config.smtp.host);
console.log("  Port    :", config.smtp.port);
console.log("  Secure  :", config.smtp.secure);
console.log("  User    :", config.smtp.user);
console.log("  Mittente:", config.mailFrom.email);
console.log("  Destinatari azienda:", config.mailTo);

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verifica asincrona
(async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log("✅ SMTP pronto: le email possono essere inviate.");
  } catch (err) {
    console.error("❌ SMTP non configurato o non raggiungibile:", err.message);
    if (err.code === "EAUTH" || /535/.test(err.message)) {
      console.error(
        "\n🔑 Credenziali rifiutate da Gmail. Checklist:\n" +
          "   1. L'account deve avere la VERIFICA IN 2 PASSAGGI attiva.\n" +
          "   2. Genera una 'Password per le app' su:\n" +
          "      https://myaccount.google.com/apppasswords\n" +
          "   3. Incollala in SMTP_PASS nel file .env (gli spazi vengono\n" +
          "      rimossi automaticamente, ma dev'essere quella giusta e\n" +
          "      generata per l'account indicato in SMTP_USER: " +
          (config.smtp.user || "(vuoto)") +
          ").\n" +
          "   4. Se hai rigenerato la password di recente, attendi qualche\n" +
          "      minuto e riavvia il server.\n",
      );
    }
  }
})();

module.exports = transporter;
