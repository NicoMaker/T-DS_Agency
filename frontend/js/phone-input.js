// ============================================================
// phone-input.js — Campo cellulare con selettore nazione
// - Bandiera + prefisso internazionale selezionabile
// - Nel campo si possono digitare SOLO cifre (e spazi)
// - Espone PhoneInput.getFullNumber() e PhoneInput.isValid()
// - L'elenco paesi/prefissi arriva da data/paesi-telefono.json
// ============================================================

// Paese di riserva, usato solo se data/paesi-telefono.json non si carica
const PHONE_COUNTRY_FALLBACK = { iso: "IT", nome: "Italia", dial: "+39", min: 8, max: 11 };

const PhoneInput = {
  paese: PHONE_COUNTRY_FALLBACK, // sostituito appena il JSON è caricato
  countries: [PHONE_COUNTRY_FALLBACK],
  input: null,

  async init() {
    this.input = document.getElementById("f-telefono");
    const btn = document.getElementById("phone-country-btn");
    const dropdown = document.getElementById("phone-dropdown");
    const flagEl = document.getElementById("phone-flag");
    const dialEl = document.getElementById("phone-dial");
    if (!this.input || !btn || !dropdown) return;

    try {
      const lista = await SiteData.load("paesi-telefono");
      if (Array.isArray(lista) && lista.length) this.countries = lista;
    } catch (err) {
      console.error("Impossibile caricare data/paesi-telefono.json:", err);
      // Resta l'elenco di riserva con la sola Italia
    }

    this.paese =
      this.countries.find((c) => c.iso === "IT") || this.countries[0];

    // ── Costruisce la lista nazioni (bandiere reali, non emoji) ──
    dropdown.innerHTML = this.countries
      .map(
        (c) => `
      <li role="option" data-iso="${c.iso}" aria-selected="${c.iso === this.paese.iso}">
        <span class="dd-flag">${flagImgHtml(c.iso, { width: 20, height: 15 })}</span>
        <span>${c.nome}</span>
        <span class="dd-dial">${c.dial}</span>
      </li>`,
      )
      .join("");

    // Imposta subito la bandiera/prefisso reali al posto del placeholder statico in HTML
    flagEl.innerHTML = flagImgHtml(this.paese.iso, { width: 20, height: 15 });
    dialEl.textContent = this.paese.dial;

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
      const paese = this.countries.find((c) => c.iso === li.dataset.iso);
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

