/* ============================================================
   BEAUTY STUDIO — ISADORA ROCHA  |  script.js
   ============================================================ */

// ─── CUSTOM CURSOR ────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

// ─── GLITTER PARTICLES ────────────────────────────────────
const canvas = document.getElementById('glitter-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Sparkle particle
class Particle {
  constructor() { this.reset(true); }
  reset(fromBottom = false) {
    this.x    = Math.random() * canvas.width;
    this.y    = fromBottom ? canvas.height + 20 : Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedY  = -(Math.random() * 0.5 + 0.2);
    this.speedX  = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.fade    = Math.random() * 0.004 + 0.001;
    this.twinkle = Math.random() * Math.PI * 2; // phase
    this.twinkleSpeed = Math.random() * 0.04 + 0.01;
    // shape: 0 = circle, 1 = cross/spark
    this.shape   = Math.random() > 0.6 ? 1 : 0;
    // gold palette
    const golds  = ['#c9a96e','#e8d5b0','#f5eed8','#b8934a','#dfc485'];
    this.color   = golds[Math.floor(Math.random() * golds.length)];
  }

  drawSpark(x, y, size) {
    const s = size * 2;
    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.lineTo(x + s, y);
    ctx.moveTo(x, y - s);
    ctx.lineTo(x, y + s);
    // diagonals (smaller)
    const d = s * 0.6;
    ctx.moveTo(x - d, y - d);
    ctx.lineTo(x + d, y + d);
    ctx.moveTo(x + d, y - d);
    ctx.lineTo(x - d, y + d);
    ctx.strokeStyle = this.color;
    ctx.lineWidth   = 0.8;
    ctx.globalAlpha = this.opacity * (0.5 + 0.5 * Math.sin(this.twinkle));
    ctx.stroke();
  }

  draw() {
    this.twinkle += this.twinkleSpeed;
    const pulse = 0.6 + 0.4 * Math.sin(this.twinkle);

    if (this.shape === 1) {
      this.drawSpark(this.x, this.y, this.size);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity * pulse;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.opacity -= this.fade;
    if (this.opacity <= 0 || this.y < -30) this.reset(true);
  }
}

const particles = Array.from({ length: 90 }, () => new Particle());

function animateGlitter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.update();
    p.draw();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateGlitter);
}
animateGlitter();

// ─── HEADER SCROLL EFFECT ─────────────────────────────────
const header = document.getElementById('mainHeader');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const scrollY   = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress  = (scrollY / maxScroll) * 100;

  scrollProgress.style.width = progress + '%';

  if (scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  if (scrollY > 500) {
  }
}, { passive: true });


// ─── HERO PARALLAX ────────────────────────────────────────
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const y = window.scrollY;
  if (y < window.innerHeight * 1.5) {
    heroBg.style.transform = `translateY(${y * 0.35}px)`;
  }
}, { passive: true });

// ─── MOBILE MENU ──────────────────────────────────────────
const menuIcon = document.getElementById('menuIcon');
const navMenu  = document.getElementById('navMenu');

menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('open');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuIcon.classList.remove('open');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ─── SCROLL REVEAL ────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up, .reveal-card').forEach(el => {
  revealObserver.observe(el);
});

// ─── COUNTER ANIMATION ────────────────────────────────────
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    let start    = 0;
    const step   = Math.ceil(target / 60);
    const timer  = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = start;
    }, 30);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
  counterObserver.observe(el);
});

// ─── FEEDBACK CAROUSEL ────────────────────────────────────
const track   = document.getElementById('feedbackTrack');
const dotsWrap = document.getElementById('fbDots');
const slides  = document.querySelectorAll('.feedback-slide');
const btnPrev = document.getElementById('fbPrev');
const btnNext = document.getElementById('fbNext');

let current = 0;
let autoPlay;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'fb-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

function goTo(idx) {
  current = (idx + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  document.querySelectorAll('.fb-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

function startAuto() {
  autoPlay = setInterval(() => goTo(current + 1), 4500);
}
function resetAuto() {
  clearInterval(autoPlay);
  startAuto();
}

startAuto();

// ─── MAGNETIC BUTTONS ─────────────────────────────────────
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect   = el.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) * 0.25;
    const dy     = (e.clientY - cy) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// ─── CARD 3D TILT ─────────────────────────────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const rx    = ((e.clientY - cy) / (rect.height / 2)) * 5;
    const ry    = ((e.clientX - cx) / (rect.width  / 2)) * -5;
    card.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── SMOOTH ACTIVE NAV ON SCROLL ─────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ─── PAGE LOAD FADE ───────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
