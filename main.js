/* ══════════════════════════════════════════════
   HOBBY TOOLTIP — hover (mouseenter) + touch (touchstart)
   No click required.
══════════════════════════════════════════════ */
document.querySelectorAll('.hobby-chip').forEach(chip => {
  const tooltip = chip.querySelector('.hobby-tooltip');
  if (!tooltip) return;

  chip.addEventListener('mouseenter', () => {
    tooltip.classList.add('visible');
  });
  chip.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
  });

  chip.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const isOpen = tooltip.classList.contains('visible');
    document.querySelectorAll('.hobby-tooltip.visible').forEach(t => t.classList.remove('visible'));
    if (!isOpen) tooltip.classList.add('visible');
  }, { passive: false });
});

document.addEventListener('touchstart', (e) => {
  if (!e.target.closest('.hobby-chip')) {
    document.querySelectorAll('.hobby-tooltip.visible').forEach(t => t.classList.remove('visible'));
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.hobby-chip')) {
    document.querySelectorAll('.hobby-tooltip.visible').forEach(t => t.classList.remove('visible'));
  }
});

function closeHobby(e, force) {
      if (force || (e && e.target === document.getElementById('hobbyOverlay'))) {
        document.getElementById('hobbyOverlay').classList.remove('open');
        document.body.style.overflow = '';
      }
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeHobby(null, true); });

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════════
   NAV ACTIVE STATE
   — scroll-position based, reliable on initial load
══════════════════════════════════════════════ */
const navLinks = document.querySelectorAll('.nav-pill a');

// Each entry maps a nav href to the element whose top edge we track.
// section-anchors sit 80px above the visual section, which is perfect
// for triggering a little before the section fully arrives.
const navTargets = [
  { href: '#hero',      el: document.getElementById('hero') },
  { href: '#published', el: document.getElementById('published') },
  { href: '#personal',  el: document.getElementById('personal') },
  { href: '#blog',      el: document.getElementById('blog') },
].filter(t => t.el);

function setActiveNav(href) {
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === href);
  });
}

function updateNav() {
  const scrollY = window.scrollY;

  // Walk through targets in order; the last one whose top edge has
  // scrolled past 40% of the viewport height wins.
  let active = navTargets[0];
  for (const t of navTargets) {
    const top = t.el.getBoundingClientRect().top + scrollY;
    if (scrollY + window.innerHeight * 0.4 >= top) {
      active = t;
    }
  }
  setActiveNav(active.href);
}

// Run immediately so Home is active before any scroll
updateNav();

// Re-run on scroll (rAF-throttled for performance)
let rafPending = false;
window.addEventListener('scroll', () => {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => { updateNav(); rafPending = false; });
}, { passive: true });

// Instant feedback when the user clicks a nav link
navLinks.forEach(a => {
  a.addEventListener('click', () => {
    setActiveNav(a.getAttribute('href'));
  });
});

/* ══════════════════════════════════════════════
   VIDEO HELPERS — unified shell versions
══════════════════════════════════════════════ */

/* iPhone shell: remove placeholder, inject <video> into screen-wrap */
function playVideoPhone(placeholderId, src) {
  const ph = document.getElementById(placeholderId);
  if (!ph) return;
  const sw = ph.parentElement;
  ph.remove();
  const v = document.createElement('video');
  v.src = src;
  v.className = 'iphone-video-el';
  v.muted = true;
  v.controls = true;
  v.autoplay = true;
  v.playsInline = true;
  sw.appendChild(v);
}

/* iPad unified shell: remove placeholder, inject <video> into .ipad-u-screen */
function playVideoIPadU(placeholderId, screenId, src) {
  const ph = document.getElementById(placeholderId);
  const scr = document.getElementById(screenId);
  if (!ph || !scr) return;
  ph.remove();
  const v = document.createElement('video');
  v.src = src;
  v.controls = true;
  v.muted = true;
  v.autoplay = true;
  v.playsInline = true;
  v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:23px;';
  scr.appendChild(v);
}

/* Mac unified shell: remove placeholder, inject <video> into .mac-u-screen */
function playVideoMacU(placeholderId, screenId, src) {
  const ph = document.getElementById(placeholderId);
  const scr = document.getElementById(screenId);
  if (!ph || !scr) return;
  ph.remove();
  const v = document.createElement('video');
  v.src = src;
  v.controls = true;
  v.autoplay = true;
  v.playsInline = true;
  v.muted = true;
  v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;border-radius:23px;'; scr.appendChild(v);
}

/* Space Invaders shell:*/
function playVideoSI(placeholderId, screenId, src) {
  const ph = document.getElementById(placeholderId);
  const scr = document.getElementById(screenId);
  if (!ph || !scr) return;
  ph.remove();
  const v = document.createElement('video');
  v.src = src;
  v.controls = true;
  v.autoplay = true;
  v.playsInline = true;
  v.muted = true;
  v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:content;';
  scr.appendChild(v);
}



/* ══════════════════════════════════════════════
   DEVICE TOGGLE
══════════════════════════════════════════════ */
function switchDevice(project, device) {
  document.querySelectorAll(`[id^="view-"][id$="-${project}"]`).forEach(v => {
    v.style.display = 'none';
  });
  document.querySelectorAll(`[id^="tab-"][id$="-${project}"]`).forEach(t => {
    t.classList.remove('active');
  });
  const targetView = document.getElementById(`view-${device}-${project}`);
  const targetTab = document.getElementById(`tab-${device}-${project}`);
  if (targetView) targetView.style.display = 'block';
  if (targetTab) targetTab.classList.add('active');
}

/* ══════════════════════════════════════════════
   IMAGE STRIP CAROUSEL
══════════════════════════════════════════════ */
const stripState = {};
function initStrip(id) {
  const inner = document.getElementById('strip-' + id + '-inner');
  const dotsEl = document.getElementById('dots-' + id);
  if (!inner) return;
  const frames = inner.querySelectorAll('.phone-frame');
  const count = frames.length;
  stripState[id] = { idx: 0, count };
  if (count > 3 && dotsEl) {
    dotsEl.innerHTML = '';
    for (let i = 0; i <= count - 3; i++) {
      const d = document.createElement('div');
      d.className = 'strip-dot' + (i === 0 ? ' active' : '');
      d.onclick = () => goStrip(id, i);
      dotsEl.appendChild(d);
    }
  }
}
function stripSlide(id, dir) {
  const s = stripState[id]; if (!s) return;
  s.idx = Math.max(0, Math.min(s.count - 3, s.idx + dir));
  applyStrip(id);
}
function goStrip(id, idx) {
  const s = stripState[id]; if (!s) return;
  s.idx = idx; applyStrip(id);
}
function applyStrip(id) {
  const s = stripState[id];
  const inner = document.getElementById('strip-' + id + '-inner');
  const dotsEl = document.getElementById('dots-' + id);
  const frame = inner.querySelector('.phone-frame');
  if (!frame) return;
  const frameW = frame.offsetWidth + 10;
  inner.style.transform = 'translateX(-' + (s.idx * frameW) + 'px)';
  const dots = dotsEl ? dotsEl.querySelectorAll('.strip-dot') : [];
  dots.forEach((d, i) => d.classList.toggle('active', i === s.idx));
}
window.addEventListener('load', () => {
  ['mausam', 'crush', 'bloom', 'hanoi'].forEach(initStrip);
});

/* ══════════════════════════════════════════════
   BIO TYPEWRITER — quote only
══════════════════════════════════════════════ */
(function () {
  const HOOK = '"We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle';
  const hookEl  = document.querySelector('.hook-text');
  const cursorEl = document.querySelector('.hook-cursor');
  if (!hookEl || !cursorEl) return;

  const TYPE_SPEED   = 38;   
  const DELETE_SPEED = 18;   
  const PAUSE_AFTER_TYPE   = 2200; 
  const PAUSE_AFTER_DELETE = 600;  

  let i = 0;
  let deleting = false;

  function tick() {
    if (!deleting) {
      hookEl.textContent = HOOK.slice(0, i + 1);
      i++;
      if (i === HOOK.length) {
        deleting = true;
        setTimeout(tick, PAUSE_AFTER_TYPE);
      } else {
        setTimeout(tick, TYPE_SPEED);
      }
    } else {
      hookEl.textContent = HOOK.slice(0, i - 1);
      i--;
      if (i === 0) {
        deleting = false;
        setTimeout(tick, PAUSE_AFTER_DELETE);
      } else {
        setTimeout(tick, DELETE_SPEED);
      }
    }
  }
  setTimeout(tick, 700);
})();