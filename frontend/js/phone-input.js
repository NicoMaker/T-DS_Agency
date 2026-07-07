// ============================================================
// phone-input.js — Campo cellulare con selettore nazione
// - Bandiera + prefisso internazionale selezionabile
// - Nel campo si possono digitare SOLO cifre (e spazi)
// - Espone PhoneInput.getFullNumber() e PhoneInput.isValid()
// ============================================================

const PHONE_COUNTRIES = [
  { iso: "IT", nome: "Italia", dial: "+39", min: 8, max: 11 },
  { iso: "AT", nome: "Austria", dial: "+43", min: 7, max: 13 },
  { iso: "BE", nome: "Belgio", dial: "+32", min: 8, max: 10 },
  { iso: "CH", nome: "Svizzera", dial: "+41", min: 9, max: 9 },
  { iso: "DE", nome: "Germania", dial: "+49", min: 7, max: 13 },
  { iso: "ES", nome: "Spagna", dial: "+34", min: 9, max: 9 },
  { iso: "FR", nome: "Francia", dial: "+33", min: 9, max: 9 },
  { iso: "GB", nome: "Regno Unito", dial: "+44", min: 9, max: 10 },
  { iso: "HR", nome: "Croazia", dial: "+385", min: 8, max: 9 },
  { iso: "NL", nome: "Paesi Bassi", dial: "+31", min: 9, max: 9 },
  { iso: "PL", nome: "Polonia", dial: "+48", min: 9, max: 9 },
  { iso: "PT", nome: "Portogallo", dial: "+351", min: 9, max: 9 },
  { iso: "RO", nome: "Romania", dial: "+40", min: 9, max: 9 },
  { iso: "SI", nome: "Slovenia", dial: "+386", min: 8, max: 8 },
  { iso: "SM", nome: "San Marino", dial: "+378", min: 6, max: 10 },
  { iso: "US", nome: "Stati Uniti", dial: "+1", min: 10, max: 10 },
];

const PhoneInput = {
  paese: PHONE_COUNTRIES[0], // default: Italia
  input: null,

  init() {
    this.input = document.getElementById("f-telefono");
    const btn = document.getElementById("phone-country-btn");
    const dropdown = document.getElementById("phone-dropdown");
    const flagEl = document.getElementById("phone-flag");
    const dialEl = document.getElementById("phone-dial");
    if (!this.input || !btn || !dropdown) return;

    // ── Costruisce la lista nazioni (bandiere reali, non emoji) ──
    dropdown.innerHTML = PHONE_COUNTRIES.map(
      (c) => `
      <li role="option" data-iso="${c.iso}" aria-selected="${c.iso === this.paese.iso}">
        <span class="dd-flag">${flagImgHtml(c.iso, { width: 20, height: 15 })}</span>
        <span>${c.nome}</span>
        <span class="dd-dial">${c.dial}</span>
      </li>`,
    ).join("");

    // Imposta subito la bandiera reale al posto del placeholder statico in HTML
    flagEl.innerHTML = flagImgHtml(this.paese.iso, { width: 20, height: 15 });

    const chiudi = () => {
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });

    dropdown.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-iso]");
      if (!li) return;
      const paese = PHONE_COUNTRIES.find((c) => c.iso === li.dataset.iso);
      if (paese) {
        this.paese = paese;
        flagEl.innerHTML = flagImgHtml(paese.iso, { width: 20, height: 15 });
        dialEl.textContent = paese.dial;
        dropdown
          .querySelectorAll("li")
          .forEach((el) => el.setAttribute("aria-selected", String(el === li)));
        // Rivalida con le nuove regole di lunghezza
        this.input.dispatchEvent(new Event("input"));
      }
      chiudi();
      this.input.focus();
    });

    document.addEventListener("click", chiudi);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") chiudi();
    });

    // ── SOLO cifre: blocca lettere e simboli alla digitazione ──
    this.input.addEventListener("beforeinput", (e) => {
      if (e.inputType.startsWith("insert") && e.data) {
        if (/[^\d\s]/.test(e.data)) e.preventDefault();
      }
    });

    // Pulisce anche incolla / autocompletamento
    this.input.addEventListener("input", () => {
      const pulito = this.input.value.replace(/[^\d\s]/g, "");
      if (pulito !== this.input.value) this.input.value = pulito;

      // Limita alla lunghezza massima del paese
      const cifre = this.getDigits();
      if (cifre.length > this.paese.max) {
        let rimaste = this.paese.max;
        this.input.value = this.input.value
          .replace(/\d/g, (d) => (rimaste-- > 0 ? d : ""))
          .trimEnd();
      }
    });
  },

  getDigits() {
    return this.input ? this.input.value.replace(/\D/g, "") : "";
  },

  // Numero completo con prefisso, es. "+393391234567"
  getFullNumber() {
    return this.paese.dial + this.getDigits();
  },

  isValid() {
    const n = this.getDigits().length;
    return n >= this.paese.min && n <= this.paese.max;
  },

  messaggioErrore() {
    if (!this.getDigits().length)
      return "Il numero di cellulare è obbligatorio.";
    return `Numero non valido per ${this.paese.nome}: servono da ${this.paese.min} a ${this.paese.max} cifre.`;
  },
};
