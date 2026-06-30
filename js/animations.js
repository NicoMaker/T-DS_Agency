/* ============================================
   animations.js — Tutte le animazioni extra
   ============================================ */

// ---- PARTICLLE ----
export function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26, 108, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(26, 108, 255, ${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ---- TYPEWRITER ----
export function initTypewriter() {
  const el = document.querySelector(".typewriter");
  if (!el) return;
  const words = [
    'Il digitale che fa la <span class="accent">differenza</span>',
    'Innovazione e <span class="accent">creatività</span>',
    'Soluzioni <span class="accent">su misura</span>',
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentText = "";

  function type() {
    const fullText = words[wordIndex];
    if (isDeleting) {
      currentText = fullText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      currentText = fullText.substring(0, charIndex + 1);
      charIndex++;
    }
    el.innerHTML = currentText;
    if (!isDeleting && charIndex === fullText.length) {
      isDeleting = true;
      setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 400);
    } else {
      setTimeout(type, isDeleting ? 60 : 120);
    }
  }
  type();
}

// ---- COUNTER ANIMATO (ora usa il data-count al momento della chiamata) ----
export function initCounter() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const parent = el.closest(".stat-item");
          if (!parent) return;
          const target = parseInt(parent.dataset.count, 10) || 0;
          let current = 0;
          const increment = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current;
          }, 20);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => observer.observe(c));
}

// ---- PARALLASSE HERO ----
export function initParallax() {
  const hero = document.querySelector("#home");
  if (!hero) return;
  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;
      const bg = hero.querySelector(".hero-bg");
      const grid = hero.querySelector(".hero-grid");
      if (bg)
        bg.style.transform = `translateY(${scrolled * 0.05}px) scale(1.02)`;
      if (grid) grid.style.transform = `translateY(${scrolled * 0.02}px)`;
    },
    { passive: true },
  );
}

// ---- MOUSE GLOW ----
export function initMouseGlow() {
  const glow = document.createElement("div");
  glow.id = "mouse-glow";
  document.body.appendChild(glow);
  const moveGlow = (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  };
  document.addEventListener("mousemove", moveGlow);
  document.addEventListener("touchstart", () => {
    glow.style.display = "none";
  });
}