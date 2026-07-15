// ============================================================
// services/email/templates.js — Template HTML delle email
// Stile "carta intestata" T-DS studio:
// bianco puro · nero · rosso brand #EF3E36 · quadratini rossi
// Wordmark tipografico "T-DS studio" come nell'identity.
// ============================================================
const { escapeHtml } = require("../../utils/validators");
const config = require("../../config");

// ── Palette brand (dalle card identity / carta intestata) ──
const COLORI = {
  bg: "#f2f2f2", // sfondo esterno neutro
  panel: "#ffffff", // foglio bianco
  panel2: "#f6f6f5",
  ink: "#0a0a0a", // nero brand
  inkDim: "#3a3a3a",
  muted: "#6f7076",
  accent: "#ef3e36", // rosso brand T-DS
  accent2: "#d42a22",
  line: "rgba(10,10,10,0.10)",
  lineStrong: "#0a0a0a", // riga nera piena, come il footer della carta
};

const FONT_DISPLAY = "'Manrope', 'Segoe UI', Helvetica, Arial, sans-serif";
const FONT_BODY = "'Manrope', 'Segoe UI', Helvetica, Arial, sans-serif";
const FONT_MONO = "'Manrope', 'Segoe UI', Helvetica, Arial, sans-serif";

// ── Prefissi distrettuali italiani (numeri fissi) ────────────
// Il piano di numerazione italiano ha prefissi geografici a lunghezza
// variabile: 2 cifre (02 Milano, 06 Roma), 3 cifre (lista sotto),
// tutti gli altri che iniziano con 0 hanno 4 cifre (es. 0432 Udine,
// 0444 Vicenza, 0421 San Donà...).
const PREFISSI_FISSI_2 = ["02", "06"];
const PREFISSI_FISSI_3 = [
  "010", // Genova
  "011", // Torino
  "015", // Biella
  "019", // Savona
  "030", // Brescia
  "031", // Como
  "035", // Bergamo
  "039", // Monza
  "040", // Trieste
  "041", // Venezia
  "045", // Verona
  "049", // Padova
  "050", // Pisa
  "051", // Bologna
  "055", // Firenze
  "059", // Modena
  "070", // Cagliari
  "071", // Ancona
  "075", // Perugia
  "079", // Sassari
  "080", // Bari
  "081", // Napoli
  "085", // Pescara
  "089", // Salerno
  "090", // Messina
  "091", // Palermo
  "095", // Catania
  "099", // Taranto
];

// Divide un numero fisso italiano in [prefisso distrettuale, resto].
// Es. "0432123456" -> ["0432", "123456"] · "0212345678" -> ["02", "12345678"]
function splitPrefissoFisso(locali) {
  if (PREFISSI_FISSI_2.includes(locali.slice(0, 2)))
    return [locali.slice(0, 2), locali.slice(2)];
  if (PREFISSI_FISSI_3.includes(locali.slice(0, 3)))
    return [locali.slice(0, 3), locali.slice(3)];
  // Tutti gli altri prefissi geografici sono a 4 cifre (0432, 0444, ...)
  return [locali.slice(0, 4), locali.slice(4)];
}

// Raggruppa cifre a blocchi di 3, unendo la coda corta all'ultimo blocco
// Es. "123456" -> "123 456" · "1234567" -> "123 4567"
function gruppiDiTre(cifre) {
  const gruppi = [];
  for (let i = 0; i < cifre.length; i += 3) gruppi.push(cifre.slice(i, i + 3));
  if (gruppi.length > 1 && gruppi[gruppi.length - 1].length < 3) {
    const ultimo = gruppi.pop();
    gruppi[gruppi.length - 1] += ultimo;
  }
  return gruppi.join(" ");
}

// Formatta il numero d'utente di un fisso (la parte DOPO il prefisso
// distrettuale) secondo la convenzione italiana:
// 5 cifre "12 345" · 6 "123 456" · 7 "123 4567" · 8 "1234 5678"
function formattaUtenteFisso(cifre) {
  const n = cifre.length;
  if (n <= 4) return cifre;
  if (n === 5) return `${cifre.slice(0, 2)} ${cifre.slice(2)}`;
  if (n === 6 || n === 7) return `${cifre.slice(0, 3)} ${cifre.slice(3)}`;
  if (n === 8) return `${cifre.slice(0, 4)} ${cifre.slice(4)}`;
  return gruppiDiTre(cifre);
}

// ── Utility: formatta un numero di telefono italiano in modo leggibile ──
// Mobile:  "3331234567"    -> "333 123 4567"
//          "+393331234567" -> "+39 333 123 4567"
// Fisso:   "0432123456"    -> "0432 123 456"  (prefisso distrettuale separato)
//          "0212345678"    -> "02 123 456 78"
function formatTelefono(telefono, tipoTelefono) {
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

  // ── Numero FISSO italiano: separa il prefisso distrettuale ──
  // (i fissi italiani iniziano sempre con 0: 02, 041, 0432, ...)
  if ((tipoTelefono === "fisso" || locali.startsWith("0")) && locali.length >= 5) {
    const [distrettuale, resto] = splitPrefissoFisso(locali);
    corpo = resto ? `${distrettuale} ${formattaUtenteFisso(resto)}` : distrettuale;
  } else if (locali.length === 10) {
    // mobile IT: 3 + 3 + 4 (es. 333 123 4567)
    corpo = `${locali.slice(0, 3)} ${locali.slice(3, 6)} ${locali.slice(6)}`;
  } else if (locali.length === 9 || locali.length === 8) {
    corpo = gruppiDiTre(locali);
  } else {
    return raw; // formato non riconosciuto: lascialo intatto
  }
  return prefisso ? `${prefisso} ${corpo}` : corpo;
}

// ── Nome della nazione in italiano, dal codice ISO ───────────
// Es. "IT" -> "Italia" · "DE" -> "Germania" · "US" -> "Stati Uniti"
// Usa Intl.DisplayNames (nativo in Node); se non disponibile,
// ricade sulla sigla ISO.
function nomeNazione(iso) {
  if (!iso || !/^[A-Za-z]{2}$/.test(iso)) return "";
  try {
    const nome = new Intl.DisplayNames(["it"], { type: "region" }).of(
      iso.toUpperCase(),
    );
    return nome && nome !== iso.toUpperCase() ? nome : iso.toUpperCase();
  } catch {
    return iso.toUpperCase();
  }
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
// di posta (Gmail, Outlook, Apple Mail).
function flagEmailHtml(iso) {
  if (!iso || !/^[A-Za-z]{2}$/.test(iso)) return "";
  const code = iso.toLowerCase();
  return `<img src="https://flagcdn.com/40x30/${code}.png" width="20" height="15" alt="${escapeHtml(iso.toUpperCase())}" style="display:inline-block;vertical-align:-2px;border-radius:2px;border:1px solid ${COLORI.line};" />`;
}

// Etichetta del tipo di numero: "Telefono fisso" oppure "Cellulare"
function labelTipoTelefono(tipoTelefono) {
  return tipoTelefono === "fisso" ? "Telefono fisso" : "Cellulare";
}

// ── Riga telefono: bandiera + nazione + numero cliccabile + tipo ──
// Usata sia nell'email all'azienda sia nel riepilogo al cliente.
function rigaTelefono({ telefono, nazione, tipoTelefono }) {
  if (!telefono) return "";
  const label = labelTipoTelefono(tipoTelefono);
  // Niente bandiera né nome nazione per il numero fisso: mostra solo
  // il numero formattato col prefisso distrettuale e il badge "Telefono fisso".
  const isFisso = tipoTelefono === "fisso";
  const flag = isFisso ? "" : flagEmailHtml(nazione);
  const paese = isFisso ? "" : nomeNazione(nazione);
  const numero = formatTelefono(telefono, tipoTelefono);

  const contenuto = `
    ${flag ? `<span style="margin-right:6px;">${flag}</span>` : ""}${
      paese
        ? `<span style="margin-right:10px;color:${COLORI.inkDim};font-size:13px;font-weight:600;">${escapeHtml(paese)}</span>`
        : ""
    }<a href="tel:${escapeHtml(telHref(telefono))}" style="color:${COLORI.accent2};text-decoration:none;font-weight:700;">${escapeHtml(numero)}</a>
    <span style="display:inline-block;margin-left:8px;padding:2px 10px;border:1px solid ${COLORI.line};border-radius:999px;background:${COLORI.panel2};color:${COLORI.inkDim};font-family:${FONT_MONO};font-size:10.5px;letter-spacing:0.06em;text-transform:uppercase;vertical-align:1px;">${escapeHtml(label)}</span>`;

  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORI.line};color:${COLORI.muted};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:${FONT_MONO};font-weight:700;vertical-align:top;width:130px;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORI.line};color:${COLORI.ink};font-size:15px;">
      ${contenuto}
    </td>
  </tr>`;
}

// ── Wordmark tipografico "T-DS studio" (nero + rosso) ───────
function wordmarkHtml(size = 34) {
  const studioSize = Math.round(size * 0.4);
  return `
  <span style="font-family:${FONT_DISPLAY};font-weight:800;font-size:${size}px;letter-spacing:-0.04em;color:${COLORI.ink};line-height:1;">T-DS<span style="font-size:${studioSize}px;font-weight:700;color:${COLORI.accent};letter-spacing:0;">&nbsp;studio</span></span>`;
}

// Quadratino rosso brand (come a margine dei paragrafi della carta intestata)
function quadratino(size = 8) {
  return `<span style="display:inline-block;width:${size}px;height:${size}px;background:${COLORI.accent};"></span>`;
}

// ============================================================
// LAYOUT BASE — replica la carta intestata:
// foglio bianco, wordmark in alto, riga nera e footer in basso
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

        <!-- Foglio "carta intestata" -->
        <div style="background:${COLORI.panel};border:1px solid ${COLORI.line};border-radius:6px;overflow:hidden;box-shadow:0 20px 60px rgba(10,10,10,0.10);">

          <!-- Intestazione: wordmark T-DS studio, come sulla carta -->
          <div style="padding:34px 36px 0;">
            ${wordmarkHtml(38)}
          </div>

          <!-- Titolo del documento con quadratino rosso -->
          <div style="padding:26px 36px 6px;">
            <table role="presentation" style="border-collapse:collapse;"><tr>
              <td style="vertical-align:middle;padding-right:10px;">${quadratino(10)}</td>
              <td style="vertical-align:middle;">
                <h1 style="margin:0;font-family:${FONT_DISPLAY};font-size:22px;font-weight:800;letter-spacing:-0.02em;color:${COLORI.ink};">
                  ${titolo}
                </h1>
              </td>
            </tr></table>
          </div>

          <div style="padding:14px 36px 30px;color:${COLORI.ink};font-size:15px;line-height:1.7;">
            ${corpo}
          </div>

          <!-- Piè di pagina interno: riga nera piena, come la carta -->
          <div style="margin:0 36px;border-top:2px solid ${COLORI.lineStrong};"></div>
          <div style="padding:16px 36px 26px;">
            <table role="presentation" style="width:100%;border-collapse:collapse;"><tr>
              <td style="font-family:${FONT_DISPLAY};font-weight:800;font-size:14px;color:${COLORI.ink};letter-spacing:-0.02em;white-space:nowrap;">
                T-DS <span style="color:${COLORI.accent};font-size:10px;font-weight:700;">studio</span>
              </td>
              <td style="text-align:center;color:${COLORI.muted};font-size:11px;letter-spacing:0.04em;">
                ${escapeHtml(config.azienda.nome)} · ${escapeHtml(config.azienda.sito)} · ${escapeHtml(config.azienda.email)}
              </td>
              <td style="text-align:right;width:12px;">${quadratino(8)}</td>
            </tr></table>
          </div>
        </div>

      </div>
    </div>
  </body>
</html>`;
}

// Riga dato in stile "tabella pulita" della carta intestata
// Se href è passato, il valore diventa un link cliccabile (mailto:/tel:)
function rigaDato(label, valore, href) {
  const contenuto = href
    ? `<a href="${escapeHtml(href)}" style="color:${COLORI.accent2};text-decoration:none;font-weight:700;">${escapeHtml(valore)}</a>`
    : escapeHtml(valore);

  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORI.line};color:${COLORI.muted};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:${FONT_MONO};font-weight:700;vertical-align:top;width:130px;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORI.line};color:${COLORI.ink};font-size:15px;">
      ${contenuto}
    </td>
  </tr>`;
}

// Pulsante CTA: rosso brand pieno, squadrato-morbido come le card identity
function bottone(testo, href) {
  return `
  <a href="${escapeHtml(href)}" style="display:inline-block;background:${COLORI.accent};color:#ffffff;font-family:${FONT_DISPLAY};font-size:13.5px;font-weight:800;letter-spacing:0.03em;text-decoration:none;padding:13px 30px;border-radius:8px;">
    ${escapeHtml(testo)}
  </a>`;
}

// Voci elenco con quadratino rosso brand (niente cerchi: stile carta intestata)
function vociCheck(voci) {
  return `
  <table style="width:100%;border-collapse:collapse;margin:6px 0 0;">
    ${voci
      .map(
        (v) => `
      <tr>
        <td style="padding:7px 0;vertical-align:top;width:22px;">
          ${quadratino(9)}
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

    <div style="margin-top:20px;padding:18px 20px;background:${COLORI.panel2};border-left:4px solid ${COLORI.accent};border-radius:6px;">
      <div style="color:${COLORI.accent2};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:${FONT_MONO};font-weight:800;margin-bottom:10px;">
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
    <p style="margin:0 0 16px;color:${COLORI.ink};font-weight:700;">
      Ciao ${escapeHtml(primoNome)},
    </p>
    <p style="margin:0 0 20px;color:${COLORI.inkDim};">
      grazie per averci scritto! Abbiamo ricevuto la tua richiesta
      ${servizio ? `per <strong style="color:${COLORI.accent2};">${escapeHtml(servizio)}</strong>` : ""}
      e ti risponderemo entro un giorno lavorativo.
    </p>

    <!-- Riepilogo dati inviati -->
    <div style="margin:0 0 22px;padding:18px 20px;background:${COLORI.panel2};border-left:4px solid ${COLORI.accent};border-radius:6px;">
      <div style="color:${COLORI.accent2};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:${FONT_MONO};font-weight:800;margin-bottom:10px;">
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
               <div style="color:${COLORI.muted};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-family:${FONT_MONO};font-weight:700;margin-bottom:6px;">Messaggio</div>
               <div style="white-space:pre-wrap;color:${COLORI.ink};font-size:14.5px;">${escapeHtml(messaggio)}</div>
             </div>`
          : ""
      }
    </div>

    <!-- Prossimi passi -->
    <div style="margin:0 0 22px;">
      <div style="color:${COLORI.ink};font-family:${FONT_DISPLAY};font-size:15px;font-weight:800;margin-bottom:8px;">
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
      <a href="mailto:${escapeHtml(config.azienda.email)}" style="color:${COLORI.accent2};font-weight:700;text-decoration:none;">${escapeHtml(config.azienda.email)}</a>.
    </p>

    <p style="margin:20px 0 0;color:${COLORI.ink};">
      A presto,<br/><strong>T-DS studio</strong> — la squadra di ${escapeHtml(config.azienda.nome)}
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
  nomeNazione,
};