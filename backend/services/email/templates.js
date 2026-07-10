// ============================================================
// services/email/templates.js — Template HTML delle email
// Stile coerente col sito (T-DS Agency — "Digital Atelier")
// Bianco + arancio brand, Space Grotesk / Instrument Sans / JetBrains Mono
// ============================================================
const { escapeHtml } = require("../../utils/validators");
const config = require("../../config");

// ── Palette presa 1:1 da style.css (:root) ──
const COLORI = {
  bg: "#f7f5f1", // --bg-2
  panel: "#ffffff", // --panel
  panel2: "#f1efe9", // --panel-2
  ink: "#171a21", // --ink
  inkDim: "#3f434e", // --ink-dim
  muted: "#7b8090", // --muted
  accent: "#e85d1f", // --accent
  accent2: "#c2470e", // --accent-2
  line: "rgba(23,26,33,0.10)", // --line
  lineStrong: "rgba(23,26,33,0.16)",
};

const FONT_DISPLAY =
  "'Space Grotesk', 'Segoe UI', Helvetica, Arial, sans-serif";
const FONT_BODY = "'Instrument Sans', 'Segoe UI', Helvetica, Arial, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";

// ── Utility: formatta un numero di telefono italiano in modo leggibile ──
// Es: "3331234567" -> "333 123 4567" · "+393331234567" -> "+39 333 123 4567"
function formatTelefono(telefono) {
  if (!telefono) return "";
  const raw = String(telefono).trim();
  let cifre = raw.replace(/[^\d]/g, "");
  let prefisso = "";

  // Riconosce il prefisso Italia in entrambe le notazioni: +39 / 0039
  if (raw.startsWith("+39")) {
    prefisso = "+39";
    cifre = cifre.slice(2); // rimuove "39" dalle cifre
  } else if (cifre.startsWith("0039")) {
    prefisso = "+39";
    cifre = cifre.slice(4);
  }

  const locali = cifre;
  let corpo;
  if (locali.length === 10) {
    // mobile IT: 3 + 3 + 4 (es. 333 123 4567)
    corpo = `${locali.slice(0, 3)} ${locali.slice(3, 6)} ${locali.slice(6)}`;
  } else if (locali.length === 9) {
    corpo = `${locali.slice(0, 3)} ${locali.slice(3, 6)} ${locali.slice(6)}`;
  } else if (locali.length === 8) {
    corpo = `${locali.slice(0, 2)} ${locali.slice(2, 5)} ${locali.slice(5)}`;
  } else {
    return raw; // formato non riconosciuto: lascialo intatto
  }
  return prefisso ? `${prefisso} ${corpo}` : corpo;
}

// Numero "pulito" da usare in tel:, mantenendo il + se presente
function telHref(telefono) {
  if (!telefono) return "";
  const raw = String(telefono).trim();
  const cifre = raw.replace(/[^\d]/g, "");
  return raw.startsWith("+") ? `+${cifre}` : cifre;
}

// ── Bandiera nazionale nell'email ────────────────────────────
// PNG (non SVG né emoji): è il formato più affidabile nei client
// di posta (Gmail, Outlook, Apple Mail). flagcdn è lo stesso servizio
// già usato dal frontend per il selettore del prefisso.
function flagEmailHtml(iso) {
  if (!iso || !/^[A-Za-z]{2}$/.test(iso)) return "";
  const code = iso.toLowerCase();
  return `<img src="https://flagcdn.com/40x30/${code}.png" width="20" height="15" alt="${escapeHtml(iso.toUpperCase())}" style="display:inline-block;vertical-align:-2px;border-radius:2px;border:1px solid ${COLORI.line};" />`;
}

// Etichetta del tipo di numero: "Telefono fisso" oppure "Cellulare"
function labelTipoTelefono(tipoTelefono) {
  return tipoTelefono === "fisso" ? "Telefono fisso" : "Cellulare";
}

// ── Riga telefono: bandiera + numero cliccabile + tipo ──────
// Usata sia nell'email all'azienda sia nel riepilogo al cliente.
function rigaTelefono({ telefono, nazione, tipoTelefono }) {
  if (!telefono) return "";
  const label = labelTipoTelefono(tipoTelefono);
  const flag = flagEmailHtml(nazione);
  const numero = formatTelefono(telefono);

  const contenuto = `
    ${flag ? `<span style="margin-right:8px;">${flag}</span>` : ""}<a href="tel:${escapeHtml(telHref(telefono))}" style="color:${COLORI.accent2};text-decoration:none;font-weight:600;">${escapeHtml(numero)}</a>
    <span style="display:inline-block;margin-left:8px;padding:2px 10px;border:1px solid ${COLORI.line};border-radius:999px;background:${COLORI.panel2};color:${COLORI.inkDim};font-family:${FONT_MONO};font-size:10.5px;letter-spacing:0.06em;text-transform:uppercase;vertical-align:1px;">${escapeHtml(label)}</span>`;

  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORI.line};color:${COLORI.muted};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:${FONT_MONO};vertical-align:top;width:130px;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORI.line};color:${COLORI.ink};font-size:15px;">
      ${contenuto}
    </td>
  </tr>`;
}

// ============================================================
// LAYOUT BASE — replica header/panel/footer del sito
// ============================================================
function layoutBase(titolo, corpo, { preheader = "" } = {}) {
  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(titolo)}</title>
  </head>
  <body style="margin:0;padding:0;background:${COLORI.bg};">
    ${
      preheader
        ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>`
        : ""
    }
    <div style="background:${COLORI.bg};padding:40px 16px;font-family:${FONT_BODY};">
      <div style="max-width:600px;margin:0 auto;">

        <!-- Header brand, come .nav-logo / accento mono del sito -->
        <div style="text-align:center;padding-bottom:22px;">
          <div style="display:inline-block;font-family:${FONT_MONO};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${COLORI.accent2};font-weight:700;">
            ${escapeHtml(config.azienda.nome)}
          </div>
        </div>

        <!-- Card principale, come .panel / .faq-item / .lista-check li -->
        <div style="background:${COLORI.panel};border:1px solid ${COLORI.line};border-radius:22px;overflow:hidden;box-shadow:0 20px 60px rgba(23,26,33,0.06);">

          <!-- Striscia accento in alto, come .scroll-progress -->
          <div style="height:4px;background:linear-gradient(90deg, ${COLORI.accent}, ${COLORI.accent2});"></div>

          <div style="padding:34px 32px 8px;">
            <h1 style="margin:0;font-family:${FONT_DISPLAY};font-size:24px;font-weight:600;letter-spacing:-0.02em;color:${COLORI.ink};">
              ${titolo}
            </h1>
          </div>

          <div style="padding:14px 32px 32px;color:${COLORI.ink};font-size:15px;line-height:1.7;">
            ${corpo}
          </div>
        </div>

        <!-- Footer, come .site-footer -->
        <div style="text-align:center;padding:26px 12px 0;">
          <div style="color:${COLORI.muted};font-size:12px;font-family:${FONT_MONO};letter-spacing:0.02em;">
            ${escapeHtml(config.azienda.nome)} · ${escapeHtml(config.azienda.sito)} · ${escapeHtml(config.azienda.email)}
          </div>
        </div>

      </div>
    </div>
  </body>
</html>`;
}

// Riga dato in stile "tabella pulita" (come rigaDato originale, ma nella nuova palette)
// Se href è passato, il valore diventa un link cliccabile (mailto:/tel:)
function rigaDato(label, valore, href) {
  const contenuto = href
    ? `<a href="${escapeHtml(href)}" style="color:${COLORI.accent2};text-decoration:none;font-weight:600;">${escapeHtml(valore)}</a>`
    : escapeHtml(valore);

  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORI.line};color:${COLORI.muted};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:${FONT_MONO};vertical-align:top;width:130px;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORI.line};color:${COLORI.ink};font-size:15px;">
      ${contenuto}
    </td>
  </tr>`;
}

// Pulsante CTA in stile .btn / .btn-submit del sito (pillola arancio)
function bottone(testo, href) {
  return `
  <a href="${escapeHtml(href)}" style="display:inline-block;background:${COLORI.accent};color:#ffffff;font-family:${FONT_MONO};font-size:13px;font-weight:600;letter-spacing:0.03em;text-decoration:none;padding:13px 28px;border-radius:999px;">
    ${escapeHtml(testo)}
  </a>`;
}

// Voce con spunta arancio, come .lista-check li::before
function vociCheck(voci) {
  return `
  <table style="width:100%;border-collapse:collapse;margin:6px 0 0;">
    ${voci
      .map(
        (v) => `
      <tr>
        <td style="padding:6px 0;vertical-align:top;width:26px;">
          <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${COLORI.accent};color:#ffffff;font-size:11px;line-height:20px;text-align:center;font-weight:700;">✓</span>
        </td>
        <td style="padding:6px 0;color:${COLORI.inkDim};font-size:14px;">${escapeHtml(v)}</td>
      </tr>`,
      )
      .join("")}
  </table>`;
}

// ============================================================
// EMAIL PER L'AZIENDA — nuova richiesta dal sito
// ============================================================
function templateAzienda({
  nomeCompleto,
  email,
  telefono,
  nazione,
  tipoTelefono,
  servizio,
  messaggio,
}) {
  const corpo = `
    <p style="margin:0 0 20px;color:${COLORI.inkDim};">
      Hai ricevuto una nuova richiesta di preventivo dal sito:
    </p>

    <table style="width:100%;border-collapse:collapse;">
      ${rigaDato("Nome", nomeCompleto)}
      ${rigaDato("Email", email, `mailto:${email}`)}
      ${rigaTelefono({ telefono, nazione, tipoTelefono })}
      ${rigaDato("Servizio", servizio)}
    </table>

    <div style="margin-top:20px;padding:18px 20px;background:${COLORI.panel2};border:1px solid ${COLORI.line};border-radius:14px;">
      <div style="color:${COLORI.accent2};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:${FONT_MONO};margin-bottom:10px;">
        Messaggio
      </div>
      <div style="white-space:pre-wrap;color:${COLORI.ink};">${escapeHtml(messaggio)}</div>
    </div>

    <div style="margin-top:24px;text-align:center;">
      ${bottone("Rispondi al cliente", `mailto:${email}`)}
    </div>

    <p style="margin:20px 0 0;color:${COLORI.muted};font-size:12.5px;text-align:center;">
      Puoi rispondere direttamente a questa email: il mittente è impostato sull'indirizzo del cliente.
    </p>`;

  return layoutBase("Nuova richiesta di preventivo", corpo, {
    preheader: `Nuova richiesta — ${servizio} — ${nomeCompleto}`,
  });
}

// ============================================================
// EMAIL DI CONFERMA PER IL CLIENTE — con riepilogo dati completo
// ============================================================
function templateCliente({
  nomeCompleto,
  nome,
  email,
  telefono,
  nazione,
  tipoTelefono,
  servizio,
  messaggio,
}) {
  const nomeVisualizzato = nomeCompleto || nome || "";
  const primoNome = nomeVisualizzato.split(" ")[0] || nomeVisualizzato;

  const corpo = `
    <p style="margin:0 0 16px;color:${COLORI.ink};">
      Ciao ${escapeHtml(primoNome)},
    </p>
    <p style="margin:0 0 20px;color:${COLORI.inkDim};">
      grazie per averci scritto! Abbiamo ricevuto la tua richiesta
      ${servizio ? `per <strong style="color:${COLORI.accent2};">${escapeHtml(servizio)}</strong>` : ""}
      e ti risponderemo entro un giorno lavorativo.
    </p>

    <!-- Riepilogo dati inviati -->
    <div style="margin:0 0 22px;padding:18px 20px;background:${COLORI.panel2};border:1px solid ${COLORI.line};border-radius:14px;">
      <div style="color:${COLORI.accent2};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:${FONT_MONO};margin-bottom:10px;">
        Riepilogo della tua richiesta
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${rigaDato("Nome", nomeVisualizzato)}
        ${rigaDato("Email", email, `mailto:${email}`)}
        ${rigaTelefono({ telefono, nazione, tipoTelefono })}
        ${servizio ? rigaDato("Servizio", servizio) : ""}
      </table>
      ${
        messaggio
          ? `<div style="margin-top:14px;">
               <div style="color:${COLORI.muted};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:${FONT_MONO};margin-bottom:6px;">Messaggio</div>
               <div style="white-space:pre-wrap;color:${COLORI.ink};font-size:14.5px;">${escapeHtml(messaggio)}</div>
             </div>`
          : ""
      }
    </div>

    <!-- Prossimi passi -->
    <div style="margin:0 0 22px;">
      <div style="color:${COLORI.ink};font-family:${FONT_DISPLAY};font-size:15px;font-weight:600;margin-bottom:8px;">
        Cosa succede adesso
      </div>
      ${vociCheck([
        "Il nostro team esamina la tua richiesta",
        "Ti ricontattiamo entro un giorno lavorativo",
        "Definiamo insieme i dettagli del progetto",
      ])}
    </div>

    <p style="margin:0 0 4px;color:${COLORI.inkDim};">
      Se hai fretta, scrivici direttamente a
      <a href="mailto:${escapeHtml(config.azienda.email)}" style="color:${COLORI.accent2};font-weight:600;text-decoration:none;">${escapeHtml(config.azienda.email)}</a>.
    </p>

    <p style="margin:20px 0 0;color:${COLORI.ink};">
      A presto,<br/>la squadra di ${escapeHtml(config.azienda.nome)}
    </p>`;

  return layoutBase("Abbiamo ricevuto la tua richiesta", corpo, {
    preheader: "Grazie per averci contattato — ti risponderemo a breve.",
  });
}

module.exports = {
  templateAzienda,
  templateCliente,
  formatTelefono,
  flagEmailHtml,
  labelTipoTelefono,
};
