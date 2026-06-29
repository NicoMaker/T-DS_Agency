/* ============================================
   nav.js — Navbar: scroll, hamburger overlay,
             active link on scroll
   ============================================ */

export function initNav() {
  const navbar      = document.querySelector('#navbar');
  const hamburger   = document.querySelector('.hamburger');
  const navMobile   = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile a');

  /* ---- Active link: dichiarate PRIMA di onScroll ---- */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  function setActive() {
    const scrollY = window.scrollY + 120;
    let current = sections[0]?.id || '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  /* ---- Scroll: sfondo navbar + active link ---- */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    setActive();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // esegui subito al caricamento

  /* ---- Hamburger toggle ---- */
  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    navMobile.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    hamburger.classList.contains('open') ? closeMenu() : openMenu()
  );
  mobileLinks.forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}
