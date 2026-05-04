/* ═══════════════════════════════════════
   CM STUDIO — DESIGNROOM V4
   js/cursor.js
   Cursor-reactive ambient background
   + Tab cascade animations
═══════════════════════════════════════ */

// ══════════════════════════════════════
// CURSOR REACTIVE AMBIENT BACKGROUND
// ══════════════════════════════════════
function initCursorReactive() {
  // Inject the ambient layer into the page
  const layer = document.createElement('div');
  layer.id = 'cursor-ambient';
  layer.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.4s ease;
    opacity: 0;
  `;
  document.body.prepend(layer);

  let cx = window.innerWidth  / 2;
  let cy = window.innerHeight / 2;
  let tx = cx, ty = cy;
  let rafId;
  let active = false;

  // Smooth follow
  function tick() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#00e5ff';

    layer.style.background = `
      radial-gradient(
        800px circle at ${cx}px ${cy}px,
        ${hexToRgba(accent, 0.04)},
        transparent 70%
      )
    `;
    rafId = requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    if (!active) {
      active = true;
      layer.style.opacity = '1';
      tick();
    }
  });

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else if (active) {
      tick();
    }
  });
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0,2), 16);
  const g = parseInt(clean.substring(2,4), 16);
  const b = parseInt(clean.substring(4,6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ══════════════════════════════════════
// TAB CASCADE ANIMATIONS
// ══════════════════════════════════════
function cascadeCards(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const cards = panel.querySelectorAll('.preview-card');
  if (!cards.length) return;

  // Reset all cards
  cards.forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(22px)';
    card.style.transition = 'none';
  });

  // Stagger them in
  requestAnimationFrame(() => {
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
      }, i * 38);
    });
  });
}

// Hook into tab switching
function initTabCascade() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = 'tab-' + btn.dataset.tab;
      // Small delay so panel is visible first
      setTimeout(() => cascadeCards(tabId), 30);
    });
  });

  // Cascade the first tab on load
  setTimeout(() => cascadeCards('tab-backgrounds'), 100);
}

// ══════════════════════════════════════
// CARD HOVER PREVIEW EXPANSION
// ══════════════════════════════════════
function initCardHoverExpand() {
  // Add preview hint to every card on hover
  document.addEventListener('mouseover', e => {
    const card = e.target.closest('.preview-card');
    if (!card) return;
    if (card._hintAdded) return;
    card._hintAdded = true;

    const hint = document.createElement('div');
    hint.className = 'card-preview-hint';
    hint.textContent = 'Click to preview fullscreen';
    hint.style.cssText = `
      position: absolute;
      bottom: 48px;
      right: 10px;
      background: rgba(0,0,0,0.75);
      color: rgba(255,255,255,0.7);
      font-family: 'Syne', sans-serif;
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 20px;
      pointer-events: none;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      z-index: 4;
      white-space: nowrap;
    `;
    card.appendChild(hint);

    card.addEventListener('mouseenter', () => {
      hint.style.opacity   = '1';
      hint.style.transform = 'translateY(0)';
    });
    card.addEventListener('mouseleave', () => {
      hint.style.opacity   = '0';
      hint.style.transform = 'translateY(4px)';
    });
  });
}

// ══════════════════════════════════════
// 3D CARD FLIP — Colour Schemes
// ══════════════════════════════════════
function init3DFlips() {
  // Inject flip styles
  if (!document.getElementById('flip-styles')) {
    const style = document.createElement('style');
    style.id = 'flip-styles';
    style.textContent = `
      .flip-card {
        perspective: 900px;
      }
      .flip-card .flip-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .flip-card:hover .flip-inner {
        transform: rotateY(180deg);
      }
      .flip-front,
      .flip-back {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        border-radius: inherit;
        overflow: hidden;
      }
      .flip-back {
        transform: rotateY(180deg);
        background: var(--bg2);
        border: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1.2rem;
        gap: 0.6rem;
      }
      .flip-back-title {
        font-family: 'Syne', sans-serif;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--accent);
        margin-bottom: 0.3rem;
      }
      .flip-back-mood {
        font-family: 'Syne', sans-serif;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text);
        line-height: 1.4;
      }
      .flip-back-desc {
        font-size: 0.75rem;
        color: var(--dim);
        line-height: 1.5;
      }
      .flip-back-swatches {
        display: flex;
        gap: 0.4rem;
        margin-top: 0.4rem;
        flex-wrap: wrap;
      }
      .flip-swatch {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.62rem;
        color: var(--dim);
        font-family: 'JetBrains Mono', monospace;
      }
      .flip-swatch-dot {
        width: 14px;
        height: 14px;
        border-radius: 3px;
        flex-shrink: 0;
        border: 1px solid rgba(255,255,255,0.08);
      }
    `;
    document.head.appendChild(style);
  }
}

const schemeDetails = {
  'Charcoal + Cyan':      { mood: 'Clarity. Precision. Technology.', desc: 'Perfect for tech companies, security firms and modern service businesses.', hex: ['#0a0a0a','#141414','#00e5ff','#f0f0f0'] },
  'Navy + Gold':          { mood: 'Authority. Tradition. Trust.', desc: 'Ideal for professional services, legal, finance and premium brands.', hex: ['#09101e','#111828','#d4a843','#eef0f4'] },
  'Black + White':        { mood: 'Simplicity. Confidence. Timeless.', desc: 'Suits luxury brands, creatives and businesses that let their work speak.', hex: ['#ffffff','#eeeeee','#000000','#888888'] },
  'Dark + Red':           { mood: 'Power. Urgency. Confidence.', desc: 'Strong for security, emergency services, gyms and bold brands.', hex: ['#0d0505','#160808','#e63333','#f5f2f2'] },
  'Slate + Emerald':      { mood: 'Growth. Calm. Progress.', desc: 'Works beautifully for health, wellness, sustainability and finance.', hex: ['#0e141a','#16202a','#10b981','#e8edf2'] },
  'Dark Forest':          { mood: 'Grounded. Natural. Honest.', desc: 'Perfect for eco brands, outdoors, agriculture and wellness businesses.', hex: ['#080d08','#101810','#4ade80','#e8f0e8'] },
  'Deep Purple + Violet': { mood: 'Creative. Ambitious. Unique.', desc: 'Stands out for creative agencies, music, events and entertainment.', hex: ['#120820','#1a1030','#a855f7','#f0eaff'] },
  'Copper + Orange':      { mood: 'Warmth. Energy. Craft.', desc: 'Excellent for food, hospitality, construction and artisan brands.', hex: ['#0f0a06','#1a1008','#e8943a','#f5efe8'] },
  'Midnight + Pink':      { mood: 'Modern. Bold. Unforgettable.', desc: 'Made for beauty, fashion, lifestyle and brands that refuse to blend in.', hex: ['#08080a','#121218','#ff3366','#ffffff'] },
  'Ocean Dark + Teal':    { mood: 'Fresh. Clear. Professional.', desc: 'Ideal for healthcare, travel, maritime and clean tech businesses.', hex: ['#060c10','#0e1820','#00bcd4','#e8f4ff'] },
};

function wrapColourCardWithFlip(card) {
  const label  = card.dataset.label;
  const detail = schemeDetails[label];
  if (!detail) return;

  card.classList.add('flip-card');
  const pw = card.querySelector('.pw');
  const foot = card.querySelector('.card-foot');
  if (!pw) return;

  // Wrap existing content in flip-front
  const front = document.createElement('div');
  front.className = 'flip-front';
  const pwClone = pw.cloneNode(true);
  const footClone = foot ? foot.cloneNode(true) : null;
  front.appendChild(pwClone);
  if (footClone) front.appendChild(footClone);

  // Build flip-back
  const back = document.createElement('div');
  back.className = 'flip-back';
  back.innerHTML = `
    <div class="flip-back-title">${label}</div>
    <div class="flip-back-mood">${detail.mood}</div>
    <div class="flip-back-desc">${detail.desc}</div>
    <div class="flip-back-swatches">
      ${detail.hex.map(h => `
        <div class="flip-swatch">
          <div class="flip-swatch-dot" style="background:${h}"></div>
          <span>${h}</span>
        </div>`).join('')}
    </div>
  `;

  // Build inner wrapper
  const inner = document.createElement('div');
  inner.className = 'flip-inner';
  inner.appendChild(front);
  inner.appendChild(back);

  // Clear card and rebuild
  card.innerHTML = '';
  card.appendChild(inner);

  // Prevent flip from triggering modal open
  card.ondblclick = null;
}

function initColourFlips() {
  init3DFlips();
  // Wait for grids to be built
  setTimeout(() => {
    document.querySelectorAll('.preview-card[data-category="Colour Scheme"]')
      .forEach(wrapColourCardWithFlip);
  }, 300);
}

// ══════════════════════════════════════
// CANVAS PERFORMANCE — IntersectionObserver
// ══════════════════════════════════════
function initCanvasVisibilityPause() {
  const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const canvas = entry.target;
      canvas._visible = entry.isIntersecting;
    });
  }, { threshold: 0 });

  // Observe all canvases
  function observeCanvases() {
    document.querySelectorAll('canvas').forEach(c => {
      if (!c._observed) {
        c._observed = true;
        canvasObserver.observe(c);
      }
    });
  }

  // Run now and after grids are built
  observeCanvases();
  setTimeout(observeCanvases, 500);
  setTimeout(observeCanvases, 1500);
}

// ══════════════════════════════════════
// NUDGE LINE — single elegant hint
// ══════════════════════════════════════
function initNudgeLine() {
  const nudge = document.getElementById('nudge-line');
  if (!nudge) return;
  nudge.style.opacity   = '0';
  nudge.style.transform = 'translateY(8px)';
  nudge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
}

// ══════════════════════════════════════
// INIT ALL
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNudgeLine();
  initCanvasVisibilityPause();
  // Tab cascade and card hover init after grids load
  setTimeout(() => {
    initTabCascade();
    initCardHoverExpand();
    initColourFlips();
  }, 400);
});