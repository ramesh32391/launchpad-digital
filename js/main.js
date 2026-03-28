'use strict';

/* ═══════════════════════════════════════════
   NAVBAR — scroll shrink + active link
═══════════════════════════════════════════ */
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  highlightNavLink();

  // Close mobile menu on scroll
  const mobileMenu = document.getElementById('navMenu');
  if (mobileMenu && mobileMenu.classList.contains('show')) {
    bootstrap.Collapse.getInstance(mobileMenu)?.hide();
  }
}, { passive: true });

function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('#navMenu .nav-link[href^="#"]');
  let current    = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
    const collapse = document.getElementById('navMenu');
    if (collapse && collapse.classList.contains('show')) {
      new bootstrap.Collapse(collapse).hide();
    }
  });
});

/* ═══════════════════════════════════════════
   INTERSECTION OBSERVER — FADE ANIMATIONS
═══════════════════════════════════════════ */
const fadeEls = document.querySelectorAll('.fade-up, .fade-in, .fade-in-right');
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => fadeObs.observe(el));

/* ═══════════════════════════════════════════
   TYPED HEADLINE EFFECT (Hero)
   Rotates through words in .hero-title-red
═══════════════════════════════════════════ */
const typedEl = document.querySelector('.hero-title-red');
if (typedEl) {
  const words   = ['better website', 'higher rankings', 'more customers', 'stronger brand'];
  let   wIdx    = 0;
  let   cIdx    = 0;
  let   deleting = false;
  let   paused   = false;

  function type() {
    const word    = words[wIdx];
    const current = deleting ? word.slice(0, cIdx - 1) : word.slice(0, cIdx + 1);
    typedEl.textContent = current;

    if (!deleting && current === word) {
      paused = true;
      setTimeout(() => { paused = false; deleting = true; type(); }, 2200);
      return;
    }
    if (deleting && current === '') {
      deleting = false;
      wIdx = (wIdx + 1) % words.length;
      cIdx = 0;
      setTimeout(type, 400);
      return;
    }

    cIdx = deleting ? cIdx - 1 : cIdx + 1;
    setTimeout(type, deleting ? 40 : 75);
  }

  // Add blinking cursor
  typedEl.style.borderRight = '3px solid #d80c18';
  typedEl.style.paddingRight = '4px';
  setInterval(() => {
    typedEl.style.borderRightColor =
      typedEl.style.borderRightColor === 'transparent' ? '#d80c18' : 'transparent';
  }, 530);

  setTimeout(type, 900);
}

/* ═══════════════════════════════════════════
   ANIMATED STAT COUNTERS
═══════════════════════════════════════════ */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCount(el, target, duration) {
  const start = performance.now();
  const isInt = Number.isInteger(target);

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = easeOutCubic(progress) * target;
    el.textContent = isInt ? Math.floor(value) : value.toFixed(1);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const raw = parseFloat(el.dataset.count);
    if (!isNaN(raw)) animateCount(el, raw, 1800);
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ═══════════════════════════════════════════
   MAIN TABS (Services / Industries / How)
═══════════════════════════════════════════ */
document.querySelectorAll('.main-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.main-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(`tab-${tab.dataset.tab}`);
    if (panel) panel.classList.add('active');
  });
});

/* ═══════════════════════════════════════════
   SERVICE SIDEBAR SWITCHER
═══════════════════════════════════════════ */
document.querySelectorAll('.tsv-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.tsv-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.tab-service-detail').forEach(d => d.classList.remove('active'));
    item.classList.add('active');
    const detail = document.getElementById(`sv-${item.dataset.service}`);
    if (detail) detail.classList.add('active');
  });
});

/* ═══════════════════════════════════════════
   ACCORDION
═══════════════════════════════════════════ */
document.querySelectorAll('.accord-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item    = trigger.closest('.accord-item');
    const isOpen  = item.classList.contains('open');

    // close all
    document.querySelectorAll('.accord-item').forEach(i => i.classList.remove('open'));

    // open clicked (unless it was already open)
    if (!isOpen) item.classList.add('open');
  });
});

/* ═══════════════════════════════════════════
   PORTFOLIO FILTER
═══════════════════════════════════════════ */
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      if (show) {
        item.style.opacity   = '1';
        item.style.transform = 'scale(1)';
        item.style.display   = '';
      } else {
        item.style.opacity   = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (item.dataset.category !== btn.dataset.filter && btn.dataset.filter !== 'all') {
            item.style.display = 'none';
          }
        }, 350);
      }
    });
  });
});

/* ═══════════════════════════════════════════
   HERO CHART BARS — staggered load animation
═══════════════════════════════════════════ */
function animateHeroBars() {
  const bars    = document.querySelectorAll('.bc-bar-wrap');
  const heights = ['35%','55%','45%','72%','62%','90%','80%','100%'];
  bars.forEach((bar, i) => {
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.transition = 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      bar.style.height     = heights[i];
    }, 600 + i * 90);
  });
}
window.addEventListener('load', animateHeroBars);

/* ═══════════════════════════════════════════
   SCROLL-TRIGGERED NUMBER REVEAL on stats
   (red bar section)
═══════════════════════════════════════════ */
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const statsObs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
      animateCount(el, parseFloat(el.dataset.count), 1600);
    });
    statsObs.unobserve(statsSection);
  }, { threshold: 0.4 });
  statsObs.observe(statsSection);
}

/* ═══════════════════════════════════════════
   STAGGERED CARD REVEAL (portfolio, reviews)
═══════════════════════════════════════════ */
const cardGroups = document.querySelectorAll('.portfolio-grid, .row:has(.review-card), .row:has(.why-card), .row:has(.how-card)');
cardGroups.forEach(group => {
  const cards = group.querySelectorAll('[class*="col-"]');
  const groupObs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('card-visible'), i * 80);
    });
    groupObs.unobserve(group);
  }, { threshold: 0.1 });
  groupObs.observe(group);
});

/* ═══════════════════════════════════════════
   PARALLAX — subtle hero bg movement
═══════════════════════════════════════════ */
const heroBg = document.querySelector('.hero-bg-lines');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
  }, { passive: true });
}

/* ═══════════════════════════════════════════
   LOGO STRIP — infinite marquee-style fade
═══════════════════════════════════════════ */
const logoItems = document.querySelectorAll('.logo-item');
if (logoItems.length) {
  let active = 0;
  function cycleLogos() {
    logoItems.forEach((item, i) => {
      item.style.transition = 'color 0.5s ease, border-color 0.5s ease';
      if (i === active) {
        item.style.color       = 'rgba(255,255,255,0.55)';
        item.style.borderColor = 'rgba(216,12,24,0.3)';
      } else {
        item.style.color       = '';
        item.style.borderColor = '';
      }
    });
    active = (active + 1) % logoItems.length;
  }
  setInterval(cycleLogos, 1200);
  cycleLogos();
}

/* ═══════════════════════════════════════════
   HERO CARD STACK — smooth lerp tilt + shine
═══════════════════════════════════════════ */
(function () {
  const wrap  = document.querySelector('.hero-card-wrap');
  if (!wrap) return;

  const front = wrap.querySelector('.hs-front');
  const mid   = wrap.querySelector('.hs-mid');
  const back  = wrap.querySelector('.hs-back');
  const glow  = wrap.querySelector('.hcw-glow');

  // Lerp state: target and current, normalised -1 → +1
  let tX = 0, tY = 0;
  let cX = 0, cY = 0;
  let hovering = false;
  let rafId    = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    // Lerp toward target (or toward 0 when not hovering)
    const speed = 0.075;
    cX = lerp(cX, hovering ? tX : 0, speed);
    cY = lerp(cY, hovering ? tY : 0, speed);

    const rX  = -cY * 13;
    const rY  =  cX * 13;
    const p   = 'perspective(900px)';

    // Front: full tilt, floats up, dynamic directional shadow
    const sX  = (-rY * 2).toFixed(1);
    const sY  = (rX  * 2 + 24).toFixed(1);
    front.style.transform = `${p} rotateX(${rX.toFixed(2)}deg) rotateY(${rY.toFixed(2)}deg) translateZ(30px) translateY(-6px)`;
    front.style.boxShadow = `${sX}px ${sY}px 55px rgba(79,70,229,0.42), 0 8px 24px rgba(0,0,0,0.12)`;

    // Mid: 55% tilt, stays in its rotated slot
    mid.style.transform = `${p} rotateX(${(rX*0.55).toFixed(2)}deg) rotateY(${(rY*0.55).toFixed(2)}deg) rotate(-3deg) translateX(-7px) translateZ(10px)`;

    // Back: 25% tilt, stays deepest
    back.style.transform = `${p} rotateX(${(rX*0.25).toFixed(2)}deg) rotateY(${(rY*0.25).toFixed(2)}deg) rotate(-6deg) translateX(-14px) translateZ(-10px)`;

    // Holographic shine tracks cursor on front card
    const shX = ((cX * 0.5 + 0.5) * 100).toFixed(1);
    const shY = ((cY * 0.5 + 0.5) * 100).toFixed(1);
    front.style.setProperty('--shine-x', `${shX}%`);
    front.style.setProperty('--shine-y', `${shY}%`);

    // Move ambient glow
    if (glow) {
      glow.style.left = `${((cX * 0.5 + 0.5) * 100).toFixed(1)}%`;
      glow.style.top  = `${((cY * 0.5 + 0.5) * 100).toFixed(1)}%`;
    }

    // Stop loop only when fully settled back at rest
    const settled = !hovering && Math.abs(cX) < 0.002 && Math.abs(cY) < 0.002;
    if (settled) {
      front.style.transform = '';
      front.style.boxShadow = '';
      mid.style.transform   = 'rotate(-3deg) translateX(-7px) scale(0.985)';
      back.style.transform  = 'rotate(-6deg) translateX(-14px) scale(0.97)';
      front.style.removeProperty('--shine-x');
      front.style.removeProperty('--shine-y');
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  wrap.addEventListener('mouseenter', () => {
    hovering = true;
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    tX = (e.clientX - r.left) / r.width  * 2 - 1;
    tY = (e.clientY - r.top)  / r.height * 2 - 1;
  });

  wrap.addEventListener('mouseleave', () => {
    hovering = false;
    // RAF loop keeps running, lerps smoothly back to 0
  });

  // Hovering directly on a back/mid card pops it forward
  [mid, back].forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex  = '5';
      card.style.opacity = '1';
      card.style.filter  = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.zIndex  = '';
      card.style.opacity = '';
      card.style.filter  = '';
    });
  });
}());

/* ═══════════════════════════════════════════
   RED BAR HOVER LIFT on how-cards
═══════════════════════════════════════════ */
document.querySelectorAll('.how-card, .why-card, .review-card, .pcn-card, .portfolio-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.willChange = 'transform, box-shadow';
  });
  card.addEventListener('mouseleave', () => {
    card.style.willChange = 'auto';
  });
});
