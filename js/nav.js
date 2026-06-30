export function initNav() {
  const navbar = document.querySelector("#navbar");
  const hamburger = document.querySelector(".hamburger");
  const navMobile = document.querySelector(".nav-mobile");
  const mobileLinks = document.querySelectorAll(".nav-mobile a");
  const sections = [...document.querySelectorAll("section[id]")];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  let ticking = false;
  function getCurrentSection() {
    const scrollY = window.scrollY + 120;
    let current = sections[0]?.id || "";
    sections.forEach((sec) => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    return current;
  }
  function setActive() {
    const current = getCurrentSection();
    navLinks.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`),
    );
    if (current && window.location.hash !== `#${current}`)
      history.replaceState(null, "", `#${current}`);
  }
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
    if (!ticking) {
      requestAnimationFrame(() => {
        setActive();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  if (!window.location.hash) history.replaceState(null, "", "#home");
  onScroll();

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
  hamburger.addEventListener("click", () =>
    hamburger.classList.contains("open") ? closeMenu() : openMenu(),
  );
  mobileLinks.forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}