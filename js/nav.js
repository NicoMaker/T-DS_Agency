/* ============================================
   nav.js — Navbar: scroll, hamburger overlay,
             active link, menu a tendina
   ============================================ */

export function initNav() {
  const navbar   = document.querySelector("#navbar");
  const hamburger = document.querySelector(".hamburger");
  const navMobile = document.querySelector(".nav-mobile");
  const mobileLinks = document.querySelectorAll(".nav-mobile a");

  /* ---- Scroll: sfondo navbar ---- */
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  });

  /* ---- Hamburger toggle ---- */
  function openMenu() {
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    navMobile.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    navMobile.classList.remove("open");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.contains("open") ? closeMenu() : openMenu();
  });

  /* ---- Chiudi cliccando un link ---- */
  mobileLinks.forEach((a) => a.addEventListener("click", closeMenu));

  /* ---- Chiudi premendo Escape ---- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---- Active link on scroll ---- */
  /* Usa scrollY diretto: più affidabile con sezioni di altezze diverse */
  const sections = [...document.querySelectorAll("section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];

  function setActive() {
    const scrollY = window.scrollY + 120; // offset navbar
    let current = sections[0]?.id || "";

    sections.forEach((sec) => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });

    navLinks.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${current}`;
      a.classList.toggle("active", isActive);
    });
  }

  window.addEventListener("scroll", setActive, { passive: true });
  setActive(); // esegui subito al caricamento
}
