// ============================================================
// utils/validators.js — Validazione lato server del form
// (specchio delle regole del frontend: mai fidarsi del client)
// ============================================================

// Email valida: nome@dominio.tld
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Telefono internazionale: "+" seguito da 8–15 cifre (standard E.164)
const PHONE_REGEX = /^\+\d{8,15}$/;

// Telefono fisso (rete fissa italiana): il campo del form non aggiunge
// il prefisso internazionale, quindi arrivano solo cifre (5–12).
const PHONE_FISSO_REGEX = /^\d{5,12}$/;

/**
 * Valida i campi del form contatti.
 * @param {Object} body - req.body
 * @returns {string[]} array di messaggi di errore (vuoto = tutto ok)
 */
function validaForm(body) {
  const errori = [];

  const campiObbligatori = {
    nome: "Nome",
    cognome: "Cognome",
    email: "Email",
    telefono: "Numero di cellulare",
    servizio: "Servizio desiderato",
    messaggio: "Messaggio",
  };

  for (const [campo, label] of Object.entries(campiObbligatori)) {
    if (!body[campo] || !String(body[campo]).trim()) {
      errori.push(`Il campo "${label}" è obbligatorio.`);
    }
  }

  // ── Email: SOLO indirizzi validi ──
  if (body.email && !EMAIL_REGEX.test(String(body.email).trim())) {
    errori.push("L'indirizzo email non è valido.");
  }

  // ── Telefono: solo cifre; con prefisso internazionale se cellulare ──
  if (body.telefono) {
    const telefono = String(body.telefono).replace(/\s/g, "");
    const isFisso = body.tipoTelefono === "fisso";

    if (isFisso) {
      if (!PHONE_FISSO_REGEX.test(telefono)) {
        errori.push(
          "Il numero di telefono fisso non è valido: sono ammesse solo cifre (da 5 a 12).",
        );
      }
    } else if (!PHONE_REGEX.test(telefono)) {
      errori.push(
        "Il numero di cellulare non è valido: sono ammesse solo cifre con prefisso internazionale (es. +39 339 1234567).",
      );
    }
  }

  // ── Messaggio: lunghezza minima e massima ──
  if (body.messaggio) {
    const msg = String(body.messaggio).trim();
    if (msg.length < 10)
      errori.push("Il messaggio è troppo corto (minimo 10 caratteri).");
    if (msg.length > 5000)
      errori.push("Il messaggio è troppo lungo (massimo 5000 caratteri).");
  }

  return errori;
}

/**
 * Sanifica una stringa per l'inserimento in HTML email
 * (previene injection nei template).
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = {
  validaForm,
  escapeHtml,
  EMAIL_REGEX,
  PHONE_REGEX,
  PHONE_FISSO_REGEX,
};
