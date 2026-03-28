'use strict';

/* ═══════════════════════════════════════════
   NAVBAR — scroll shrink + active link
═══════════════════════════════════════════ */
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  highlightNavLink();
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
