// ============================================================
// controllers/contattiController.js — Logica del form contatti
// ============================================================
const { validaForm } = require("../utils/validators");
const { sendAzienda, sendCliente } = require("../services/email");
const config = require("../config");

exports.inviaFormContatti = async (req, res) => {
  try {
    const {
      nome,
      cognome,
      email,
      servizio,
      telefono,
      messaggio,
      nazione,
      tipoTelefono,
    } = req.body;

    // 1. Validazione
    const errori = validaForm(req.body);
    if (errori.length) {
      return res.status(400).json({ ok: false, errori });
    }

    const nomeCompleto = `${nome.trim()} ${cognome.trim()}`;
    const dati = {
      nome: nome.trim(),
      cognome: cognome.trim(),
      nomeCompleto,
      email: email.trim(),
      telefono: String(telefono).replace(/\s/g, ""),
      // ISO 3166-1 alpha-2 della nazione del numero (es. "IT"): serve
      // per mostrare la bandiera nell'email. Il fisso arriva già come "IT".
      nazione: String(nazione || "")
        .trim()
        .toUpperCase()
        .slice(0, 2),
      // "fisso" | "mobile" → nell'email diventa "Telefono fisso" / "Cellulare"
      tipoTelefono: tipoTelefono === "fisso" ? "fisso" : "mobile",
      servizio,
      messaggio: messaggio.trim(),
    };

    // 2. Notifica all'azienda (deve funzionare)
    await sendAzienda(dati);

    // 3. Conferma al cliente (se fallisce, logghiamo ma non blocchiamo la risposta)
    try {
      await sendCliente(dati);
    } catch (err) {
      console.error("⚠️  Conferma al cliente NON INVIATA:", err.message);
      // Opzionale: invia una notifica all'admin via email (solo se l'azienda ha ricevuto)
      // In produzione, potresti inviare un'email di avviso a te stesso
      // Esempio:
      // await transporter.sendMail({ ... });
    }

    return res.json({
      ok: true,
      message: "Richiesta inviata! Ti risponderemo entro un giorno lavorativo.",
    });
  } catch (err) {
    console.error("❌ Errore invio email:", err);
    return res.status(500).json({
      ok: false,
      errori: [
        "Si è verificato un errore durante l'invio. Riprova più tardi o chiamaci direttamente.",
      ],
    });
  }
};
