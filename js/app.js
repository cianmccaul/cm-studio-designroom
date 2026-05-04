/* ═══════════════════════════════════════
   CM STUDIO — DESIGNROOM V3
   js/app.js
   Core app logic
═══════════════════════════════════════ */

// ── CONFIG ──
const ADMIN_PASSWORD = 'designroom2025';

// ── STATE ──
const selections = {};
let cartOpen = false;
let currentScheme = null;
let schemeTransformActive = false;
let qStep = 1;
const Q_TOTAL = 5;
let modalCard = null;
let compareMode = false;
let compareCard = null;
let lightMode = false;
const moodFiles = [];

// ── SCHEME MAP ──
const schemeMap = {
  'Charcoal + Cyan': 'cyan',
  'Navy + Gold': 'gold',
  'Black + White': 'mono',
  'Dark + Red': 'red',
  'Slate + Emerald': 'emerald',
  'Dark Forest': 'forest',
  'Deep Purple + Violet': 'violet',
  'Copper + Orange': 'copper',
  'Midnight + Pink': 'pink',
  'Ocean Dark + Teal': 'teal'
};

const schemeColors = {
  'Charcoal + Cyan':    { bg:'#0a0a0a', nav:'#141414', accent:'#00e5ff', text:'#f0f0f0', btn:'#00e5ff', btnText:'#000' },
  'Navy + Gold':        { bg:'#09101e', nav:'#111828', accent:'#d4a843', text:'#eef0f4', btn:'#d4a843', btnText:'#000' },
  'Black + White':      { bg:'#ffffff', nav:'#f5f5f5', accent:'#000000', text:'#111111', btn:'#000',    btnText:'#fff' },
  'Dark + Red':         { bg:'#0d0505', nav:'#160808', accent:'#e63333', text:'#f5f2f2', btn:'#e63333', btnText:'#fff' },
  'Slate + Emerald':    { bg:'#0e141a', nav:'#16202a', accent:'#10b981', text:'#e8edf2', btn:'#10b981', btnText:'#000' },
  'Dark Forest':        { bg:'#080d08', nav:'#101810', accent:'#4ade80', text:'#e8f0e8', btn:'#4ade80', btnText:'#000' },
  'Deep Purple + Violet':{ bg:'#120820', nav:'#1a1030', accent:'#a855f7', text:'#f0eaff', btn:'#a855f7', btnText:'#fff' },
  'Copper + Orange':    { bg:'#0f0a06', nav:'#1a1008', accent:'#e8943a', text:'#f5efe8', btn:'#e8943a', btnText:'#000' },
  'Midnight + Pink':    { bg:'#08080a', nav:'#121218', accent:'#ff3366', text:'#ffffff', btn:'#ff3366', btnText:'#fff' },
  'Ocean Dark + Teal':  { bg:'#060c10', nav:'#0e1820', accent:'#00bcd4', text:'#e8f4ff', btn:'#00bcd4', btnText:'#000' }
};

// ══════════════════════════════════════
// INTRO + WELCOME
// ══════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro-screen');
  if (intro) {
    setTimeout(() => {
      intro.style.transition = 'opacity 0.6s ease';
      intro.style.opacity = '0';
      setTimeout(() => {
        intro.style.display = 'none';
        showWelcome();
      }, 600);
    }, 2400);
  }

  buildAllGrids();
  initTabs();
  initQuestionnaire();
  initNudge();
  checkSavedProgress();
});

function showWelcome() {
  const ov = document.getElementById('welcome-overlay');
  if (ov) ov.classList.add('show');
}

function closeWelcome() {
  const ov = document.getElementById('welcome-overlay');
  if (ov) ov.classList.remove('show');
}

// ══════════════════════════════════════
// TABS
// ══════════════════════════════════════
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
      if (btn.dataset.tab === 'generate') buildPreviewPanel();
      updateNudge();
    });
  });
}

// ══════════════════════════════════════
// THEME TOGGLE
// ══════════════════════════════════════
function toggleTheme() {
  lightMode = !lightMode;
  document.body.classList.toggle('light-mode', lightMode);
  document.getElementById('theme-btn').textContent = lightMode ? '☾ Dark' : '☀ Light';
}

// ══════════════════════════════════════
// COLOUR SCHEME TRANSFORM
// ══════════════════════════════════════
function toggleSchemeTransform() {
  if (!currentScheme) return;
  schemeTransformActive = !schemeTransformActive;
  applySchemeTransform();
  const btn = document.getElementById('scheme-btn');
  btn.textContent = schemeTransformActive ? '◐ Reset Scheme' : '◐ Apply Scheme';
}

function applySchemeTransform() {
  // remove all scheme classes
  Object.values(schemeMap).forEach(cls => document.body.classList.remove('scheme-' + cls));
  if (schemeTransformActive && currentScheme) {
    const cls = schemeMap[currentScheme];
    if (cls) document.body.classList.add('scheme-' + cls);
  }
}

// ══════════════════════════════════════
// SELECTION LOGIC
// ══════════════════════════════════════
function toggleSelect(card) {
  const cat = card.dataset.category;
  const label = card.dataset.label;

  if (card.classList.contains('selected')) {
    card.classList.remove('selected');
    if (selections[cat] === label) delete selections[cat];
    if (cat === 'Colour Scheme') {
      currentScheme = null;
      document.getElementById('scheme-btn').style.display = 'none';
      if (schemeTransformActive) {
        schemeTransformActive = false;
        applySchemeTransform();
      }
    }
  } else {
    document.querySelectorAll(`.preview-card[data-category="${cat}"]`)
      .forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selections[cat] = label;

    if (cat === 'Colour Scheme') {
      currentScheme = label;
      document.getElementById('scheme-btn').style.display = '';
      if (schemeTransformActive) applySchemeTransform();
    }
  }

  updateCart();
  updateNudge();
  updatePreviewLive();
}

function removeItem(cat) {
  delete selections[cat];
  document.querySelectorAll(`.preview-card[data-category="${cat}"]`)
    .forEach(c => c.classList.remove('selected'));
  if (cat === 'Colour Scheme') {
    currentScheme = null;
    document.getElementById('scheme-btn').style.display = 'none';
    schemeTransformActive = false;
    applySchemeTransform();
  }
  updateCart();
  updateNudge();
}

function clearAll() {
  document.querySelectorAll('.preview-card.selected').forEach(c => c.classList.remove('selected'));
  Object.keys(selections).forEach(k => delete selections[k]);
  currentScheme = null;
  schemeTransformActive = false;
  applySchemeTransform();
  document.getElementById('scheme-btn').style.display = 'none';
  updateCart();
  updateNudge();
  if (cartOpen) toggleCart();
}

// ══════════════════════════════════════
// CART
// ══════════════════════════════════════
function toggleCart() {
  cartOpen = !cartOpen;
  document.getElementById('cart-sidebar').classList.toggle('open', cartOpen);
  document.getElementById('cart-overlay-bg').classList.toggle('open', cartOpen);
}

function updateCart() {
  const keys = Object.keys(selections);
  document.getElementById('cart-count').textContent = keys.length;
  const el = document.getElementById('cart-items');

  if (!keys.length) {
    el.innerHTML = '<div class="cart-empty"><strong>Nothing selected yet</strong>Browse the tabs and click anything you like.</div>';
    return;
  }

  el.innerHTML = keys.map(k => `
    <div class="cart-item">
      <div>
        <div class="ci-cat">${k}</div>
        <div class="ci-label">${selections[k]}</div>
      </div>
      <button class="ci-remove" onclick="removeItem('${k}')">✕</button>
    </div>
  `).join('');
}

// ══════════════════════════════════════
// PROGRESS NUDGE
// ══════════════════════════════════════
const NUDGE_CATS = ['Background','Navbar','Hero Section','Colour Scheme','Card Style','Footer','Contact Form','Scroll Animation'];

function initNudge() {
  const bar = document.getElementById('nudge-bar');
  if (!bar) return;
  bar.innerHTML = NUDGE_CATS.map(() => '<div class="nudge-dot"></div>').join('');
}

function updateNudge() {
  const dots = document.querySelectorAll('.nudge-dot');
  const text = document.getElementById('nudge-text');
  dots.forEach((dot, i) => {
    dot.classList.toggle('filled', !!selections[NUDGE_CATS[i]]);
  });
  const count = Object.keys(selections).length;
  if (!count) text.textContent = 'Start by picking a background';
  else if (count < 3) text.textContent = `${count} selection${count>1?'s':''} — keep going!`;
  else if (count < 6) text.textContent = `Looking great — ${8-count} categories left`;
  else if (count < 8) text.textContent = 'Almost there — nearly ready to submit!';
  else text.textContent = 'All done! Hit "Submit My Brief" when ready ✦';
}

// ══════════════════════════════════════
// SAVE PROGRESS
// ══════════════════════════════════════
async function saveProgress() {
  const email = document.getElementById('save-email').value.trim();
  if (!email) { showToast('Enter your email to save progress', 'error'); return; }

  const id = btoa(email).replace(/=/g,'').substring(0,12);
  const data = { email, selections, savedAt: new Date().toISOString() };

  try {
    localStorage.setItem('dr_progress_' + id, JSON.stringify(data));
    const url = window.location.origin + window.location.pathname + '?progress=' + id;
    await navigator.clipboard.writeText(url);
    showToast('Link copied! Send it to yourself to return later ✦', 'success');
  } catch(e) {
    showToast('Progress saved locally', 'success');
  }
}

function checkSavedProgress() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('progress');
  if (!id) return;

  try {
    const saved = localStorage.getItem('dr_progress_' + id);
    if (!saved) return;
    const data = JSON.parse(saved);
    Object.assign(selections, data.selections || {});

    // restore visual state
    Object.entries(selections).forEach(([cat, label]) => {
      const card = document.querySelector(`.preview-card[data-category="${cat}"][data-label="${label}"]`);
      if (card) card.classList.add('selected');
      if (cat === 'Colour Scheme') {
        currentScheme = label;
        document.getElementById('scheme-btn').style.display = '';
      }
    });

    updateCart();
    updateNudge();
    showToast('Welcome back — your selections have been restored ✦', 'success');
  } catch(e) { /* silent */ }
}

// ══════════════════════════════════════
// FULLSCREEN MODAL
// ══════════════════════════════════════
function openModal(card) {
  modalCard = card;
  compareMode = false;
  compareCard = null;

  const label = card.dataset.label;
  const cat = card.dataset.category;
  const tag = card.querySelector('.ct')?.textContent || '';

  document.getElementById('modal-title').textContent = label;
  document.getElementById('modal-tag').textContent = tag;
  document.getElementById('modal-select-btn').textContent =
    card.classList.contains('selected') ? '✓ Selected' : 'Add to Brief';

  const body = document.getElementById('modal-body');
  body.innerHTML = '';

  const content = buildModalContent(card);
  body.appendChild(content);

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  modalCard = null;
  compareMode = false;
  compareCard = null;
}

function modalSelect() {
  if (modalCard) {
    toggleSelect(modalCard);
    document.getElementById('modal-select-btn').textContent =
      modalCard.classList.contains('selected') ? '✓ Selected' : 'Add to Brief';
  }
}

function toggleCompare() {
  if (!modalCard) return;
  compareMode = !compareMode;
  const body = document.getElementById('modal-body');
  body.innerHTML = '';

  if (compareMode) {
    // find another card in same category
    const cat = modalCard.dataset.category;
    const cards = document.querySelectorAll(`.preview-card[data-category="${cat}"]`);
    let nextCard = null;
    let found = false;
    cards.forEach(c => {
      if (found && !nextCard) nextCard = c;
      if (c === modalCard) found = true;
    });
    if (!nextCard) nextCard = cards[0] !== modalCard ? cards[0] : cards[1];
    compareCard = nextCard;

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;height:100%;';

    const left = document.createElement('div');
    left.style.cssText = 'position:relative;overflow:hidden;border-right:2px solid var(--accent);';
    const lLabel = document.createElement('div');
    lLabel.style.cssText = 'position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#fff;font-family:Syne,sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:4px 12px;border-radius:20px;z-index:5;white-space:nowrap;';
    lLabel.textContent = modalCard.dataset.label;
    const lContent = buildModalContent(modalCard);
    left.appendChild(lLabel);
    left.appendChild(lContent);

    const right = document.createElement('div');
    right.style.cssText = 'position:relative;overflow:hidden;';
    const rLabel = document.createElement('div');
    rLabel.style.cssText = lLabel.style.cssText;
    rLabel.textContent = compareCard ? compareCard.dataset.label : 'Compare';
    const rContent = compareCard ? buildModalContent(compareCard) : document.createElement('div');
    right.appendChild(rLabel);
    right.appendChild(rContent);

    grid.appendChild(left);
    grid.appendChild(right);
    body.appendChild(grid);
  } else {
    const content = buildModalContent(modalCard);
    body.appendChild(content);
  }
}

function buildModalContent(card) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;overflow-y:auto;';

  const cat = card.dataset.category;
  const label = card.dataset.label;
  const color = card.querySelector('.c-particles,c-stars,.c-matrix,.c-cctv')?.dataset?.color || '#00e5ff';

  if (cat === 'Background') {
    const inner = buildFullscreenBackground(label, color);
    wrap.style.overflow = 'hidden';
    wrap.appendChild(inner);
  } else if (cat === 'Scroll Animation') {
    wrap.innerHTML = buildScrollAnimDemo(label);
  } else {
    const clone = card.querySelector('.pw').cloneNode(true);
    clone.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';
    const canvases = clone.querySelectorAll('canvas');
    canvases.forEach(c => {
      setTimeout(() => {
        c.width = wrap.offsetWidth || 800;
        c.height = wrap.offsetHeight || 500;
      }, 50);
    });
    wrap.style.overflow = 'hidden';
    wrap.appendChild(clone);
  }

  return wrap;
}

function buildFullscreenBackground(label, color) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';

  const bgMap = {
    'Particle Field': () => { wrap.style.background = '#050510'; const c = document.createElement('canvas'); c.style.cssText='position:absolute;inset:0;width:100%;height:100%'; c.dataset.color = color; wrap.appendChild(c); setTimeout(() => { c.width=wrap.offsetWidth; c.height=wrap.offsetHeight; initSingleParticleCanvas(c); }, 80); },
    'Starfield': () => { wrap.style.background = '#020208'; const c = document.createElement('canvas'); c.style.cssText='position:absolute;inset:0;width:100%;height:100%'; c.dataset.color = color; wrap.appendChild(c); setTimeout(() => { c.width=wrap.offsetWidth; c.height=wrap.offsetHeight; initSingleStarCanvas(c); }, 80); },
    'Matrix Rain': () => { wrap.style.background = '#000500'; const c = document.createElement('canvas'); c.style.cssText='position:absolute;inset:0;width:100%;height:100%'; c.dataset.color = color; wrap.appendChild(c); setTimeout(() => { c.width=wrap.offsetWidth; c.height=wrap.offsetHeight; initSingleMatrixCanvas(c); }, 80); },
    'CCTV Tracker': () => { wrap.style.background = '#080808'; const c = document.createElement('canvas'); c.style.cssText='position:absolute;inset:0;width:100%;height:100%'; c.dataset.color = color; wrap.appendChild(c); setTimeout(() => { c.width=wrap.offsetWidth; c.height=wrap.offsetHeight; initSingleCCTVCanvas(c); }, 80); },
    'Gradient Flow': () => { wrap.style.cssText += 'background:linear-gradient(-45deg,#0a0015,#001a2e,#0d1f00,#1a0010);background-size:400% 400%;animation:gradFlow 6s ease infinite;'; },
    'Dark Grid': () => { wrap.style.cssText += 'background-color:#060612;background-image:linear-gradient(rgba(0,229,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.06) 1px,transparent 1px);background-size:28px 28px;'; },
    'Mesh Gradient': () => { wrap.style.cssText += 'background:radial-gradient(ellipse at 20% 50%,rgba(100,30,200,0.28) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(0,80,200,0.28) 0%,transparent 50%),#080808;animation:meshPulse 8s ease-in-out infinite alternate;'; },
    'Aurora': () => { wrap.style.background = '#030310'; wrap.innerHTML = '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgba(0,200,150,0.2) 0%,transparent 55%),radial-gradient(ellipse at 70% 30%,rgba(100,0,200,0.2) 0%,transparent 55%),radial-gradient(ellipse at 50% 80%,rgba(0,150,255,0.15) 0%,transparent 50%);animation:auroraPulse 6s ease-in-out infinite alternate;"></div>'; },
    'Scanlines': () => { wrap.style.background = '#050505'; wrap.innerHTML = '<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,100,0.012) 2px,rgba(0,255,100,0.012) 4px);"></div><div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(0,255,100,0.07) 0%,transparent 65%);"></div>'; },
    'Noise Texture': () => { wrap.style.background = '#0c0c0c'; },
    'Circuit Board': () => { wrap.style.cssText += 'background:#050a05;background-image:linear-gradient(rgba(0,200,80,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,80,0.04) 1px,transparent 1px);background-size:20px 20px;'; },
    'Floating Blobs': () => { wrap.style.background = '#08080f'; wrap.dataset.blobs = 'true'; setTimeout(() => initBlobs(), 50); },
    'Clean White': () => { wrap.style.background = '#ffffff'; },
    'Soft Paper': () => { wrap.style.background = '#faf8f5'; },
    'Light Gradient': () => { wrap.style.cssText += 'background:linear-gradient(135deg,#f0f4ff,#faf0ff,#f0fff4);animation:lightGrad 8s ease infinite alternate;'; },
    'Diagonal Lines': () => { wrap.style.cssText += 'background:#080808;background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 20px);'; },
  };

  const builder = bgMap[label];
  if (builder) builder();
  return wrap;
}

function buildScrollAnimDemo(label) {
  const demos = {
    'Fade In Up': `<div style="background:#060608;min-height:100%;padding:3rem 4rem;font-family:'DM Sans',sans-serif;color:#f0f0f0;overflow-y:auto;">
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;letter-spacing:0.06em;margin-bottom:0.5rem;color:#00e5ff;">Fade In Up</h2>
      <p style="color:#666;margin-bottom:3rem;font-size:0.9rem;">Scroll down to see elements fade in from below</p>
      ${[1,2,3,4,5].map(i=>`<div class="scroll-fade-demo" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1.5rem;margin-bottom:1.5rem;opacity:0;transform:translateY(30px);transition:opacity 0.7s ease ${i*0.1}s,transform 0.7s ease ${i*0.1}s;"><h3 style="font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;margin-bottom:0.4rem;">Service ${i}</h3><p style="color:#666;font-size:0.85rem;line-height:1.6;">This element fades in smoothly as the visitor scrolls down the page. Each item appears slightly after the previous one.</p></div>`).join('')}
    </div>`,
    'Slide In Left': `<div style="background:#060608;min-height:100%;padding:3rem 4rem;font-family:'DM Sans',sans-serif;color:#f0f0f0;">
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;letter-spacing:0.06em;margin-bottom:0.5rem;color:#00e5ff;">Slide In Left</h2>
      <p style="color:#666;margin-bottom:3rem;font-size:0.9rem;">Scroll down to see elements slide in from the left</p>
      ${[1,2,3,4,5].map(i=>`<div class="scroll-slide-demo" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1.5rem;margin-bottom:1.5rem;opacity:0;transform:translateX(-40px);transition:opacity 0.6s ease ${i*0.1}s,transform 0.6s ease ${i*0.1}s;"><h3 style="font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;margin-bottom:0.4rem;">Feature ${i}</h3><p style="color:#666;font-size:0.85rem;line-height:1.6;">This element slides in from the left side as the visitor scrolls. Creates a dynamic, directional feel.</p></div>`).join('')}
    </div>`,
    'Scale In': `<div style="background:#060608;min-height:100%;padding:3rem 4rem;font-family:'DM Sans',sans-serif;color:#f0f0f0;">
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;letter-spacing:0.06em;margin-bottom:0.5rem;color:#00e5ff;">Scale In</h2>
      <p style="color:#666;margin-bottom:3rem;font-size:0.9rem;">Scroll down to see elements scale up into view</p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;">
      ${[1,2,3,4,5,6].map(i=>`<div class="scroll-scale-demo" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1.5rem;opacity:0;transform:scale(0.8);transition:opacity 0.6s ease ${i*0.08}s,transform 0.6s ease ${i*0.08}s;"><div style="width:32px;height:32px;border-radius:8px;background:rgba(0,229,255,0.15);border:1px solid rgba(0,229,255,0.3);margin-bottom:0.8rem;"></div><div style="font-family:'Syne',sans-serif;font-size:0.85rem;font-weight:700;margin-bottom:0.3rem;">Card ${i}</div><div style="color:#666;font-size:0.78rem;line-height:1.5;">Scales up smoothly on scroll.</div></div>`).join('')}
      </div>
    </div>`,
    'Count Up Numbers': `<div style="background:#060608;min-height:100%;padding:3rem 4rem;font-family:'DM Sans',sans-serif;color:#f0f0f0;display:flex;flex-direction:column;justify-content:center;">
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;letter-spacing:0.06em;margin-bottom:0.5rem;color:#00e5ff;">Count Up Numbers</h2>
      <p style="color:#666;margin-bottom:4rem;font-size:0.9rem;">Stats count up when they enter the viewport</p>
      <div style="display:flex;gap:3rem;justify-content:center;flex-wrap:wrap;">
        <div style="text-align:center;"><div class="count-up-demo" data-target="500" style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#00e5ff;line-height:1;">0</div><div style="font-size:0.7rem;color:#666;letter-spacing:0.15em;text-transform:uppercase;margin-top:0.3rem;">Clients Served</div></div>
        <div style="text-align:center;"><div class="count-up-demo" data-target="12" style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#00e5ff;line-height:1;">0</div><div style="font-size:0.7rem;color:#666;letter-spacing:0.15em;text-transform:uppercase;margin-top:0.3rem;">Years Experience</div></div>
        <div style="text-align:center;"><div class="count-up-demo" data-target="99" style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#00e5ff;line-height:1;">0</div><div style="font-size:0.7rem;color:#666;letter-spacing:0.15em;text-transform:uppercase;margin-top:0.3rem;">% Satisfaction</div></div>
        <div style="text-align:center;"><div class="count-up-demo" data-target="247" style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#00e5ff;line-height:1;">0</div><div style="font-size:0.7rem;color:#666;letter-spacing:0.15em;text-transform:uppercase;margin-top:0.3rem;">Projects Done</div></div>
      </div>
    </div>`,
    'Stagger Grid': `<div style="background:#060608;min-height:100%;padding:3rem 4rem;font-family:'DM Sans',sans-serif;color:#f0f0f0;">
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;letter-spacing:0.06em;margin-bottom:0.5rem;color:#00e5ff;">Stagger Grid</h2>
      <p style="color:#666;margin-bottom:3rem;font-size:0.9rem;">Cards animate in one by one as you scroll</p>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;">
      ${['CCTV','Alarms','Access','Support','Monitoring','Fire','Intercoms','Gates'].map((s,i)=>`<div class="scroll-stagger-demo" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1.2rem;opacity:0;transform:translateY(20px);transition:opacity 0.5s ease ${i*0.08}s,transform 0.5s ease ${i*0.08}s;"><div style="width:28px;height:28px;border-radius:6px;background:rgba(0,229,255,0.15);margin-bottom:0.7rem;"></div><div style="font-family:'Syne',sans-serif;font-size:0.82rem;font-weight:700;margin-bottom:0.2rem;">${s}</div><div style="color:#555;font-size:0.72rem;line-height:1.4;">Professional installation</div></div>`).join('')}
      </div>
    </div>`,
    'Parallax Layers': `<div style="background:#030308;min-height:150%;padding:3rem 4rem;font-family:'DM Sans',sans-serif;color:#f0f0f0;position:relative;overflow:hidden;">
      <div class="parallax-layer" data-speed="0.2" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:12rem;color:rgba(255,255,255,0.02);letter-spacing:0.05em;user-select:none;">BRAND</div>
      <div class="parallax-layer" data-speed="0.5" style="position:absolute;top:30%;left:0;right:0;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:7rem;color:rgba(0,229,255,0.04);letter-spacing:0.08em;user-select:none;">STUDIO</div>
      <div style="position:relative;z-index:2;text-align:center;padding-top:4rem;">
        <h2 style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;letter-spacing:0.06em;margin-bottom:0.5rem;color:#00e5ff;">Parallax Layers</h2>
        <p style="color:#666;margin-bottom:2rem;font-size:0.9rem;">Background layers move at different speeds as you scroll</p>
        <p style="color:#555;font-size:0.85rem;max-width:400px;margin:0 auto;line-height:1.7;">Scroll down to see the depth effect. Background elements move slower than foreground content, creating a sense of depth and dimension.</p>
      </div>
    </div>`,
    'Text Reveal': `<div style="background:#030303;min-height:100%;padding:3rem 4rem;font-family:'DM Sans',sans-serif;color:#f0f0f0;">
      <p style="color:#666;margin-bottom:4rem;font-size:0.9rem;">Scroll down to see text reveal</p>
      <div style="overflow:hidden;margin-bottom:0.3rem;"><div class="scroll-reveal-demo" style="transform:translateY(110%);transition:transform 0.7s cubic-bezier(0.16,1,0.3,1);font-family:'Bebas Neue',sans-serif;font-size:4rem;letter-spacing:0.04em;line-height:0.95;">WE PROTECT</div></div>
      <div style="overflow:hidden;margin-bottom:0.3rem;"><div class="scroll-reveal-demo" style="transform:translateY(110%);transition:transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s;font-family:'Bebas Neue',sans-serif;font-size:4rem;letter-spacing:0.04em;line-height:0.95;color:#00e5ff;">WHAT MATTERS</div></div>
      <div style="overflow:hidden;margin-bottom:3rem;"><div class="scroll-reveal-demo" style="transform:translateY(110%);transition:transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s;font-family:'Bebas Neue',sans-serif;font-size:4rem;letter-spacing:0.04em;line-height:0.95;">TO YOU.</div></div>
      <div class="scroll-reveal-demo" style="opacity:0;transition:opacity 0.8s ease 0.5s;color:#666;font-size:0.9rem;max-width:400px;line-height:1.7;">Professional security solutions for homes and businesses across Ireland. Trusted by hundreds of clients for over a decade.</div>
    </div>`,
  };

  const html = demos[label] || `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-family:'Syne',sans-serif;">${label} — scroll animation demo</div>`;

  // wrap with scroll observer init
  return `<div id="anim-demo-wrap" style="height:100%;overflow-y:auto;">${html}</div>
  <script>
    (function(){
      const wrap = document.getElementById('anim-demo-wrap');
      if(!wrap) return;
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if(e.isIntersecting) {
            const el = e.target;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) translateX(0) scale(1)';
            // count up
            if(el.classList.contains('count-up-demo')) {
              const target = parseInt(el.dataset.target);
              let current = 0;
              const step = target / 60;
              const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = Math.floor(current) + (target >= 100 ? '+' : target === 99 ? '%' : 'yr');
                if(current >= target) clearInterval(timer);
              }, 25);
            }
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.2, root: wrap });

      // parallax
      wrap.addEventListener('scroll', () => {
        const scrolled = wrap.scrollTop;
        wrap.querySelectorAll('.parallax-layer').forEach(el => {
          const speed = parseFloat(el.dataset.speed) || 0.3;
          el.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
        });
      });

      setTimeout(() => {
        wrap.querySelectorAll('.scroll-fade-demo,.scroll-slide-demo,.scroll-scale-demo,.scroll-stagger-demo,.scroll-reveal-demo,.count-up-demo').forEach(el => obs.observe(el));
      }, 100);
    })();
  <\/script>`;
}

// ══════════════════════════════════════
// BUILD GRIDS (Navbars, Heroes, etc)
// ══════════════════════════════════════
function buildAllGrids() {
  buildNavbarsGrid();
  buildHeroesGrid();
  buildColorsGrid();
  buildCardsGrid();
  buildFootersGrid();
  buildFormsGrid();
  buildAnimationsGrid();
}

function card(category, label, tag, pwHTML, swatches = '') {
  return `<div class="preview-card" data-category="${category}" data-label="${label}" onclick="toggleSelect(this)" ondblclick="openModal(this)">
    <div class="pw">${pwHTML}</div>
    <div class="card-foot"><span class="cl">${label}</span><span class="ct">${tag}</span></div>
    ${swatches}
  </div>`;
}

function navBg(content) {
  return `<div class="nav-preview-bg" style="display:flex;flex-direction:column;">${content}</div>`;
}

function buildNavbarsGrid() {
  const el = document.getElementById('navbars-grid');
  if (!el) return;
  el.innerHTML = [
    card('Navbar','Frosted Glass','Modern', navBg(`<div class="np" style="padding:13px 18px;background:rgba(255,255,255,0.055);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.09);"><span class="np-logo">BRAND</span><div class="np-links"><span>Home</span><span>Services</span><span>Contact</span></div></div>`)),
    card('Navbar','Solid Accent Bar','Bold', navBg(`<div class="np" style="padding:13px 18px;background:#111;border-bottom:2px solid #00e5ff;"><span class="np-logo" style="color:#00e5ff">BRAND</span><div class="np-links"><span>Home</span><span>Services</span><span>Contact</span></div></div>`)),
    card('Navbar','Minimal Centered','Clean', navBg(`<div class="np" style="padding:13px 18px;justify-content:center;gap:24px;border-bottom:1px solid rgba(255,255,255,0.05);"><span style="font-size:0.6rem;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase;font-family:Syne,sans-serif;font-weight:600;">Home</span><span style="font-size:0.6rem;color:#fff;letter-spacing:0.1em;text-transform:uppercase;font-family:Syne,sans-serif;font-weight:600;border-bottom:1px solid #fff;padding-bottom:2px;">Services</span><span style="font-size:0.6rem;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase;font-family:Syne,sans-serif;font-weight:600;">About</span><span style="font-size:0.6rem;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase;font-family:Syne,sans-serif;font-weight:600;">Contact</span></div>`)),
    card('Navbar','Bold + CTA Button','Conversion', navBg(`<div class="np" style="padding:0 18px;height:50px;background:#0d0d0d;border-left:3px solid #ff3366;"><span class="np-logo">BRAND</span><div class="np-links"><span>Services</span><span>About</span></div><span class="np-cta" style="background:#ff3366;color:#fff;">Get Quote</span></div>`)),
    card('Navbar','Hamburger Mobile','Responsive', navBg(`<div class="np" style="padding:13px 18px;border-bottom:1px solid rgba(255,255,255,0.06);"><span class="np-logo">BRAND</span><div class="hbg"><span></span><span></span><span style="width:14px"></span></div></div>`)),
    card('Navbar','Sidebar Vertical','Dashboard', `<div style="display:flex;height:100%;background:#06060e;"><div style="width:65px;background:#0d0d0d;border-right:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:14px;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.8rem;color:#00e5ff;">B</span><div style="width:5px;height:5px;border-radius:50%;background:#00e5ff;"></div><div style="width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.15);"></div><div style="width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.15);"></div><div style="width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.15);"></div></div><div style="flex:1;display:flex;align-items:center;padding:16px;"><div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:0.05em;">Page Title</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.3);margin-top:3px;">Sidebar navigation layout</div></div></div></div>`),
    card('Navbar','Split Centered Logo','Elegant', navBg(`<div class="np" style="padding:13px 18px;background:#09090d;border-bottom:1px solid rgba(255,255,255,0.07);"><div class="np-links"><span>Services</span><span>About</span></div><span class="np-logo" style="font-size:1.1rem;">BRAND</span><div class="np-links"><span>Portfolio</span><span>Contact</span></div></div>`)),
    card('Navbar','Pill Style','Modern', `<div style="background:#080808;height:100%;display:flex;align-items:center;justify-content:center;border-bottom:1px solid rgba(255,255,255,0.06);"><div style="display:flex;gap:4px;background:rgba(255,255,255,0.05);padding:4px;border-radius:30px;"><span style="font-size:0.57rem;color:#000;padding:5px 10px;border-radius:24px;background:#00e5ff;font-family:Syne,sans-serif;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Home</span><span style="font-size:0.57rem;color:rgba(255,255,255,0.45);padding:5px 10px;border-radius:24px;font-family:Syne,sans-serif;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Services</span><span style="font-size:0.57rem;color:rgba(255,255,255,0.45);padding:5px 10px;border-radius:24px;font-family:Syne,sans-serif;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">About</span><span style="font-size:0.57rem;color:rgba(255,255,255,0.45);padding:5px 10px;border-radius:24px;font-family:Syne,sans-serif;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Contact</span></div></div>`),
    card('Navbar','Transparent Overlay','Overlay', `<div style="background:linear-gradient(180deg,rgba(0,229,255,0.04) 0%,transparent 100%);height:100%;"><div class="np" style="padding:15px 18px;background:transparent;"><span class="np-logo">BRAND</span><div class="np-links"><span>Home</span><span>Services</span><span>Contact</span></div></div></div>`),
    card('Navbar','Underline Active','Editorial', navBg(`<div class="np" style="padding:13px 18px;background:#080808;border-bottom:1px solid rgba(255,255,255,0.05);"><span class="np-logo">BRAND</span><div class="np-links"><span>Home</span><span style="color:#fff;border-bottom:2px solid #00e5ff;padding-bottom:4px;">Services</span><span>About</span><span>Contact</span></div></div>`)),
    card('Navbar','Double Row','Full Featured', navBg(`<div style="padding:8px 18px;background:#0a0a0a;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;justify-content:flex-end;gap:14px;"><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);font-family:Syne,sans-serif;">+353 87 000 0000</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);font-family:Syne,sans-serif;">hello@brand.ie</span></div><div class="np" style="padding:11px 18px;background:#111;border-bottom:1px solid rgba(255,255,255,0.06);"><span class="np-logo" style="color:#00e5ff;">BRAND</span><div class="np-links"><span>Home</span><span>Services</span><span>About</span></div><span class="np-cta" style="background:#00e5ff;color:#000;">Contact</span></div>`)),
  ].join('');
}

function buildHeroesGrid() {
  const el = document.getElementById('heroes-grid');
  if (!el) return;
  el.innerHTML = [
    card('Hero Section','Centered Minimal','Classic', `<div style="background:#050505;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6px;padding:16px;"><span class="h-eye" style="color:rgba(255,255,255,0.35);letter-spacing:0.28em;">Welcome</span><span class="h-t" style="font-size:1.8rem;letter-spacing:0.07em;">YOUR BRAND</span><div style="width:32px;height:2px;background:#00e5ff;"></div><span style="font-size:0.6rem;color:rgba(255,255,255,0.4);max-width:160px;line-height:1.5;">Professional services for modern businesses</span></div>`),
    card('Hero Section','Split Layout','Modern', `<div style="display:grid;grid-template-columns:1fr 1fr;height:100%;background:#050508;"><div style="padding:16px;display:flex;flex-direction:column;justify-content:center;gap:5px;"><span class="h-eye" style="color:#00e5ff;">Est. 2024</span><span class="h-t">WE BUILD<br><em style="color:#00e5ff;font-style:normal;">THINGS</em></span><span class="h-s">Professional services</span><span class="h-b" style="background:#00e5ff;color:#000;margin-top:6px;">Get Started</span></div><div style="background:linear-gradient(135deg,#0a0a20,#180535);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div style="width:60px;height:60px;border-radius:50%;background:rgba(0,229,255,0.12);border:1px solid rgba(0,229,255,0.25);animation:pulseAnim 2.5s ease-in-out infinite;"></div></div></div>`),
    card('Hero Section','Bold Typography','Impactful', `<div style="background:#030303;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:16px;position:relative;overflow:hidden;"><span style="position:absolute;font-family:'Bebas Neue',sans-serif;font-size:7rem;color:rgba(255,255,255,0.025);top:-10px;right:-8px;line-height:1;user-select:none;">01</span><span class="h-t">WE ARE<br><em style="color:#00e5ff;font-style:normal;">DIFFERENT</em></span><span class="h-s" style="margin-top:4px;">Security solutions you can trust</span></div>`),
    card('Hero Section','Typing Animation','Animated', `<div style="background:#050510;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;text-align:center;padding:16px;"><span class="h-eye" style="color:#00e5ff;letter-spacing:0.18em;">Welcome to</span><span class="typing-anim">YOUR BRAND</span></div>`),
    card('Hero Section','Cinematic Video','Premium', `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:16px;position:relative;text-align:center;background:linear-gradient(-45deg,#0a0020,#000a1e,#000e06,#1a0008);background-size:400% 400%;animation:gradFlow 5s ease infinite;"><div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.008) 2px,rgba(255,255,255,0.008) 4px);"></div><span class="h-eye" style="position:relative;color:rgba(255,255,255,0.45);letter-spacing:0.28em;">Now Playing</span><span class="h-t" style="position:relative;font-size:1.7rem;letter-spacing:0.08em;">YOUR STORY</span><div class="play-btn" style="position:relative;"></div></div>`),
    card('Hero Section','Stats Hero','Trust Building', `<div style="background:#060608;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px;padding:16px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;letter-spacing:0.08em;color:rgba(255,255,255,0.4);">Trusted by Hundreds</div><div style="display:flex;gap:14px;"><div style="text-align:center;"><div class="count-num">500+</div><div class="count-lbl">Clients</div></div><div style="text-align:center;"><div class="count-num">12yr</div><div class="count-lbl">Experience</div></div><div style="text-align:center;"><div class="count-num">24/7</div><div class="count-lbl">Support</div></div></div></div>`),
    card('Hero Section','Marquee Text','Striking', `<div style="background:#030303;height:100%;display:flex;flex-direction:column;justify-content:center;overflow:hidden;position:relative;"><div class="marquee-wrap"><div class="marquee-track"><span>YOUR BRAND</span><span class="acc">——</span><span>YOUR BRAND</span><span class="acc">——</span><span>YOUR BRAND</span><span class="acc">——</span><span>YOUR BRAND</span><span class="acc">——</span></div></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:0.08em;">Professional Services</div><div style="font-size:0.58rem;color:rgba(255,255,255,0.4);font-family:Syne,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">Est. Ireland 2024</div></div></div>`),
    card('Hero Section','Diagonal Split','Dynamic', `<div style="height:100%;position:relative;overflow:hidden;background:#050505;"><div style="position:absolute;inset:0;clip-path:polygon(0 0,65% 0,50% 100%,0 100%);background:#0a0a14;display:flex;flex-direction:column;justify-content:center;padding:16px;gap:4px;"><span class="h-t">SHARP<br><em style="color:#00e5ff;font-style:normal;">FOCUS</em></span><span class="h-s">Professional security</span></div><div style="position:absolute;right:0;top:0;bottom:0;width:50%;background:linear-gradient(135deg,#0a0a20,#180535);"></div></div>`),
    card('Hero Section','Full Screen Video','Immersive', `<div style="background:#000;height:100%;display:flex;align-items:flex-end;padding:16px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.2) 60%,transparent 100%);"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;border:2px solid rgba(255,255,255,0.4);border-radius:50%;display:flex;align-items:center;justify-content:center;"><span style="font-size:0.7rem;margin-left:3px;">▶</span></div><div style="position:relative;z-index:1;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:0.06em;">YOUR STORY</div><div style="font-size:0.6rem;color:rgba(255,255,255,0.5);font-family:Syne,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">Scroll to explore</div></div></div>`),
  ].join('');
  if (!document.getElementById('pulse-anim-style')) {
    const s = document.createElement('style');
    s.id = 'pulse-anim-style';
    s.textContent = '@keyframes pulseAnim{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}} @keyframes gradFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}} @keyframes meshPulse{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(25deg)}} @keyframes auroraPulse{0%{opacity:0.7;transform:scale(1)}100%{opacity:1;transform:scale(1.04)}} @keyframes lightGrad{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(30deg)}}';
    document.head.appendChild(s);
  }
}

function buildColorsGrid() {
  const el = document.getElementById('colors-grid');
  if (!el) return;
  const schemes = [
    ['Charcoal + Cyan','Dark / Tech','cyan','#0a0a0a','#1a1a1a','#00e5ff','#fff'],
    ['Navy + Gold','Premium','gold','#09101e','#131d30','#d4a843','#eef0f4'],
    ['Black + White','Minimal','mono','#fff','#eee','#000','#888'],
    ['Dark + Red','Bold','red','#0d0505','#1a0808','#e63333','#f5f2f2'],
    ['Slate + Emerald','Fresh','emerald','#0e141a','#192028','#10b981','#e8edf2'],
    ['Dark Forest','Natural','forest','#080d08','#101a10','#4ade80','#e8f0e8'],
    ['Deep Purple + Violet','Creative','violet','#120820','#1e1030','#a855f7','#f0eaff'],
    ['Copper + Orange','Warm','copper','#0f0a06','#1e1408','#e8943a','#f5efe8'],
    ['Midnight + Pink','Vibrant','pink','#08080a','#141416','#ff3366','#fff'],
    ['Ocean Dark + Teal','Cool','teal','#060c10','#0e1820','#00bcd4','#e8f4ff'],
  ];
  el.innerHTML = schemes.map(([label, tag, cls, c1, c2, c3, c4]) => `
    <div class="preview-card cs-${cls}" data-category="Colour Scheme" data-label="${label}" onclick="toggleSelect(this);handleSchemeClick('${label}')" ondblclick="openModal(this)">
      <div class="pw cs-${cls}">
        <div class="cs-preview-wrap">
          <div class="cs-demo"><div class="cd-nav"></div><div class="cd-t"></div><div class="cd-s"></div><div class="cd-b"></div></div>
          <div class="cs-swatches-row"><div class="csw"></div><div class="csw"></div><div class="csw"></div><div class="csw"></div></div>
        </div>
      </div>
      <div class="card-foot"><span class="cl">${label}</span><span class="ct">${tag}</span></div>
    </div>
  `).join('');
}

function handleSchemeClick(label) {
  currentScheme = label;
  document.getElementById('scheme-btn').style.display = '';
  if (schemeTransformActive) applySchemeTransform();
}

function buildCardsGrid() {
  const el = document.getElementById('cards-grid');
  if (!el) return;
  const cardBg = `<div class="cards-preview-bg">`;
  const dci = `<div class="dci" style="background:rgba(0,229,255,0.15);border:1px solid rgba(0,229,255,0.3);"></div>`;
  el.innerHTML = [
    card('Card Style','Glass Morphism','Modern', `${cardBg}<div class="dc" style="background:rgba(255,255,255,0.045);border:1px solid rgba(255,255,255,0.09);backdrop-filter:blur(10px);padding:14px;">${dci}<div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Bordered Minimal','Clean', `${cardBg}<div class="dc" style="border:1px solid rgba(255,255,255,0.1);background:#0d0d0d;padding:14px;"><div class="dcline" style="background:#00e5ff;"></div><div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Gradient Border','Premium', `${cardBg}<div class="dc" style="background:linear-gradient(#0d0d0d,#0d0d0d) padding-box,linear-gradient(135deg,#00e5ff,#ff3366) border-box;border:1px solid transparent;padding:14px;"><div class="dci" style="background:linear-gradient(135deg,rgba(0,229,255,0.18),rgba(255,51,102,0.18));border:none;"></div><div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Accent Header','Structured', `${cardBg}<div class="dc" style="background:#0d0d0d;"><div style="background:linear-gradient(135deg,rgba(0,229,255,0.1),rgba(0,229,255,0.03));height:34px;border-bottom:1px solid rgba(0,229,255,0.18);"></div><div style="padding:10px 14px;"><div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div></div>`),
    card('Card Style','Flat Numbered','Editorial', `${cardBg}<div class="dc" style="background:#111;padding:14px;"><div class="dcnum">01</div><div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Glow on Hover','Interactive', `${cardBg}<div class="dc" style="background:#0a0a12;border:1px solid rgba(80,80,200,0.12);padding:14px;"><div class="dci" style="border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;background:rgba(0,229,255,0.08);border:1px solid rgba(0,229,255,0.2);">✦</div><div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Image Card','Visual', `${cardBg}<div class="dc" style="background:#0d0d0d;overflow:hidden;"><div style="height:65px;background:linear-gradient(135deg,#0a0a20,#180535);display:flex;align-items:center;justify-content:center;font-size:1.3rem;opacity:0.5;">📷</div><div style="padding:10px 14px;"><div class="dct">Service Title</div><div class="dcd">Brief description of service.</div></div></div></div>`),
    card('Card Style','Horizontal Card','Compact', `${cardBg}<div style="width:100%;max-width:210px;background:#0d0d0d;border:1px solid rgba(255,255,255,0.08);display:flex;gap:10px;padding:12px;align-items:center;border-radius:7px;"><div style="width:34px;height:34px;border-radius:8px;background:rgba(0,229,255,0.15);border:1px solid rgba(0,229,255,0.3);flex-shrink:0;"></div><div><div class="dct">Service</div><div class="dcd">Brief description here.</div></div></div></div>`),
    card('Card Style','Pricing Card','Sales', `${cardBg}<div class="dc" style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.1);padding:14px;text-align:center;"><div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#00e5ff;line-height:1;margin-bottom:3px;">€299</div><div style="font-size:0.54rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;">Per Month</div><div class="dct" style="margin-top:8px;">Starter Package</div><div class="dcd">Everything you need.</div></div></div>`),
    card('Card Style','Dark Outline','Sharp', `${cardBg}<div class="dc" style="border:2px solid rgba(255,255,255,0.15);background:transparent;padding:14px;border-radius:7px;"><div style="width:26px;height:2px;background:#fff;margin-bottom:9px;"></div><div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
  ].join('');
}

function buildFootersGrid() {
  const el = document.getElementById('footers-grid');
  if (!el) return;
  const fbg = `<div class="footer-preview-bg">`;
  el.innerHTML = [
    card('Footer','3 Column','Full', `${fbg}<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:12px;background:#0d0d0d;border-top:1px solid rgba(255,255,255,0.05);width:100%;"><div style="display:flex;flex-direction:column;gap:3px;"><span style="font-family:Syne,sans-serif;font-size:0.57rem;font-weight:700;color:#fff;letter-spacing:0.1em;margin-bottom:1px;">BRAND</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">About</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">Services</span></div><div style="display:flex;flex-direction:column;gap:3px;"><span style="font-family:Syne,sans-serif;font-size:0.57rem;font-weight:700;color:#fff;letter-spacing:0.1em;margin-bottom:1px;">LINKS</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">Privacy</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">Terms</span></div><div style="display:flex;flex-direction:column;gap:3px;"><span style="font-family:Syne,sans-serif;font-size:0.57rem;font-weight:700;color:#fff;letter-spacing:0.1em;margin-bottom:1px;">CONTACT</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">hello@brand.ie</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">+353 87 000 0000</span></div></div></div>`),
    card('Footer','Minimal Single Row','Clean', `${fbg}<div style="display:flex;align-items:center;justify-content:space-between;padding:13px 15px;background:#080808;border-top:1px solid rgba(255,255,255,0.05);font-size:0.56rem;color:rgba(255,255,255,0.3);width:100%;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;color:#fff;letter-spacing:0.1em;">BRAND</span><div style="display:flex;gap:10px;"><span>Privacy</span><span>Terms</span><span>Contact</span></div><span>© 2025</span></div></div>`),
    card('Footer','Big Logo','Bold', `${fbg}<div style="background:#080808;border-top:1px solid rgba(255,255,255,0.05);width:100%;"><div style="padding:12px;"><span style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;color:rgba(255,255,255,0.06);letter-spacing:0.04em;">BRAND NAME</span></div><div style="padding:7px 12px;border-top:1px solid rgba(255,255,255,0.04);font-size:0.54rem;color:rgba(255,255,255,0.22);display:flex;justify-content:space-between;"><span>© 2025 Brand Name Ltd.</span><span>Privacy · Terms</span></div></div></div>`),
    card('Footer','Accent Strip','On-brand', `${fbg}<div style="background:#080808;width:100%;"><div style="background:rgba(0,229,255,0.035);padding:11px 13px;border-bottom:1px solid rgba(0,229,255,0.1);display:flex;justify-content:space-between;align-items:center;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.9rem;color:#00e5ff;letter-spacing:0.1em;">BRAND</span><div style="display:flex;gap:10px;"><span style="font-size:0.54rem;color:rgba(255,255,255,0.38);font-family:Syne,sans-serif;">Services</span><span style="font-size:0.54rem;color:rgba(255,255,255,0.38);font-family:Syne,sans-serif;">About</span><span style="font-size:0.54rem;color:rgba(255,255,255,0.38);font-family:Syne,sans-serif;">Contact</span></div></div><div style="padding:7px 13px;font-size:0.54rem;color:rgba(255,255,255,0.2);">© 2025 Brand Name. All rights reserved.</div></div></div>`),
    card('Footer','Newsletter Footer','Engagement', `${fbg}<div style="background:#080808;border-top:1px solid rgba(255,255,255,0.05);width:100%;padding:12px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;letter-spacing:0.1em;">BRAND</span><div style="display:flex;gap:5px;"><div style="width:16px;height:16px;border-radius:4px;background:rgba(255,255,255,0.06);"></div><div style="width:16px;height:16px;border-radius:4px;background:rgba(255,255,255,0.06);"></div><div style="width:16px;height:16px;border-radius:4px;background:rgba(255,255,255,0.06);"></div></div></div><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:4px;padding:6px 9px;font-size:0.56rem;color:rgba(255,255,255,0.25);display:flex;justify-content:space-between;align-items:center;"><span>Your email address</span><span style="font-size:0.53rem;background:#00e5ff;color:#000;padding:2px 7px;border-radius:3px;font-family:Syne,sans-serif;font-weight:700;">Join</span></div><div style="font-size:0.5rem;color:rgba(255,255,255,0.2);margin-top:5px;">© 2025 Brand Name Ltd.</div></div></div>`),
    card('Footer','Map + Contact','Local Business', `${fbg}<div style="background:#080808;border-top:1px solid rgba(255,255,255,0.05);width:100%;display:flex;"><div style="padding:12px;flex:1;display:flex;flex-direction:column;gap:4px;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;letter-spacing:0.1em;">BRAND</span><div style="font-size:0.54rem;color:rgba(255,255,255,0.3);line-height:1.6;">123 Main Street<br>Dublin, Ireland<br>+353 1 000 0000</div></div><div style="width:75px;background:linear-gradient(135deg,#0a1020,#0a2010);border-left:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;font-size:1.1rem;opacity:0.4;">📍</div></div></div>`),
    card('Footer','Dark Accent Red','Bold', `${fbg}<div style="background:#050505;border-top:3px solid #ff3366;width:100%;"><div style="display:grid;grid-template-columns:1fr 1fr;"><div style="padding:11px 13px;border-right:1px solid rgba(255,255,255,0.05);"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:0.08em;color:#ff3366;">BRAND</div><div style="font-size:0.52rem;color:rgba(255,255,255,0.25);margin-top:1px;">Professional Services</div></div><div style="padding:11px 13px;display:flex;flex-direction:column;gap:2px;"><span style="font-size:0.54rem;color:rgba(255,255,255,0.3);">Services</span><span style="font-size:0.54rem;color:rgba(255,255,255,0.3);">About Us</span><span style="font-size:0.54rem;color:rgba(255,255,255,0.3);">Contact</span></div></div></div></div>`),
  ].join('');
}

function buildFormsGrid() {
  const el = document.getElementById('forms-grid');
  if (!el) return;
  const fbg = `<div class="form-preview-bg">`;
  const df = (style, fields, btnStyle) => `${fbg}<div class="dform"><div class="dft">Get in Touch</div>${fields.map(f=>`<div class="dff" style="${style}">${f}</div>`).join('')}<div class="dfb" style="${btnStyle}">Send Message</div></div></div>`;
  el.innerHTML = [
    card('Contact Form','Minimal Floating Label','Elegant', `${fbg}<div class="dform"><div class="dft">Get in Touch</div><div style="border-bottom:1px solid rgba(255,255,255,0.13);padding:5px 0;font-size:0.62rem;color:rgba(255,255,255,0.38);"><span style="display:block;font-size:0.5rem;color:rgba(255,255,255,0.28);margin-bottom:1px;letter-spacing:0.06em;text-transform:uppercase;">Name</span>John Smith</div><div style="border-bottom:1px solid rgba(255,255,255,0.13);padding:5px 0;font-size:0.62rem;color:rgba(255,255,255,0.38);"><span style="display:block;font-size:0.5rem;color:rgba(255,255,255,0.28);margin-bottom:1px;letter-spacing:0.06em;text-transform:uppercase;">Email</span>john@email.com</div><div style="border-bottom:1px solid rgba(255,255,255,0.13);padding:5px 0;font-size:0.62rem;color:rgba(255,255,255,0.38);"><span style="display:block;font-size:0.5rem;color:rgba(255,255,255,0.28);margin-bottom:1px;letter-spacing:0.06em;text-transform:uppercase;">Message</span>Hi, I'd like to...</div><div class="dfb" style="background:#fff;color:#000;border-radius:2px;margin-top:3px;">Send Message</div></div></div>`),
    card('Contact Form','Boxed Dark','Professional', df('background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 9px;border-radius:4px;',['Your name','Your email','Your message'],'background:#00e5ff;color:#000;border-radius:4px;')),
    card('Contact Form','Outlined Accent','Sharp', df('border:1px solid rgba(0,229,255,0.18);padding:6px 9px;border-radius:4px;background:transparent;',['Your name','Your email','Your message'],'background:transparent;border:1px solid #00e5ff;color:#00e5ff;border-radius:4px;')),
    card('Contact Form','Split Layout','Spacious', `${fbg}<div style="width:100%;max-width:240px;display:grid;grid-template-columns:1fr 1fr;gap:6px;"><div style="grid-column:1/-1;font-family:Syne,sans-serif;font-size:0.77rem;font-weight:700;margin-bottom:2px;">Get in Touch</div><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:5px 8px;font-size:0.6rem;color:rgba(255,255,255,0.3);border-radius:4px;">First name</div><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:5px 8px;font-size:0.6rem;color:rgba(255,255,255,0.3);border-radius:4px;">Last name</div><div style="grid-column:1/-1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:5px 8px;font-size:0.6rem;color:rgba(255,255,255,0.3);border-radius:4px;">Email address</div><div style="grid-column:1/-1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:5px 8px;font-size:0.6rem;color:rgba(255,255,255,0.3);border-radius:4px;">Your message</div><div style="grid-column:1/-1;background:#00e5ff;color:#000;font-size:0.6rem;padding:7px;font-family:Syne,sans-serif;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-align:center;border-radius:4px;">Send Message</div></div></div>`),
    card('Contact Form','Multi-Step Form','Guided', `${fbg}<div class="dform"><div class="dft">Get in Touch</div><div style="display:flex;gap:5px;align-items:center;margin-bottom:6px;"><div style="width:20px;height:20px;border-radius:50%;border:1.5px solid #00e5ff;display:flex;align-items:center;justify-content:center;font-size:0.53rem;font-family:Syne,sans-serif;font-weight:700;color:#00e5ff;flex-shrink:0;">1</div><div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div><div style="width:20px;height:20px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:0.53rem;font-family:Syne,sans-serif;font-weight:700;color:rgba(255,255,255,0.35);flex-shrink:0;">2</div><div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div><div style="width:20px;height:20px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:0.53rem;font-family:Syne,sans-serif;font-weight:700;color:rgba(255,255,255,0.35);flex-shrink:0;">3</div></div><div class="dff" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 9px;border-radius:4px;">Your full name</div><div class="dff" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 9px;border-radius:4px;">Your email</div><div class="dfb" style="background:#00e5ff;color:#000;border-radius:4px;">Next →</div></div></div>`),
    card('Contact Form','Glow Focus','Interactive', `${fbg}<div class="dform"><div class="dft">Get in Touch</div><div style="border:1px solid rgba(0,229,255,0.35);padding:6px 9px;border-radius:4px;background:rgba(0,229,255,0.04);box-shadow:0 0 12px rgba(0,229,255,0.1);font-size:0.62rem;color:rgba(255,255,255,0.5);">Your name</div><div style="border:1px solid rgba(0,229,255,0.15);padding:6px 9px;border-radius:4px;background:rgba(0,229,255,0.02);font-size:0.62rem;color:rgba(255,255,255,0.3);">Your email</div><div style="border:1px solid rgba(0,229,255,0.15);padding:6px 9px;border-radius:4px;background:rgba(0,229,255,0.02);font-size:0.62rem;color:rgba(255,255,255,0.3);">Your message</div><div class="dfb" style="background:linear-gradient(135deg,#00e5ff,#0099bb);color:#000;border-radius:4px;">Send Message</div></div></div>`),
  ].join('');
}

function buildAnimationsGrid() {
  const el = document.getElementById('animations-grid');
  if (!el) return;
  const items = (cls) => `<div class="ab-item"><div class="ab-t">Service One</div><div class="ab-d">Animates in on scroll.</div></div><div class="ab-item"><div class="ab-t">Service Two</div><div class="ab-d">Each staggered slightly.</div></div><div class="ab-item"><div class="ab-t">Service Three</div><div class="ab-d">Smooth and clean.</div></div>`;
  el.innerHTML = [
    card('Scroll Animation','Fade In Up','Popular', `<div class="anim-preview-bg anim-fade"><div class="anim-box">${items()}</div></div>`),
    card('Scroll Animation','Slide In Left','Dynamic', `<div class="anim-preview-bg anim-slide"><div class="anim-box">${items()}</div></div>`),
    card('Scroll Animation','Scale In','Subtle', `<div class="anim-preview-bg anim-scale"><div class="anim-box">${items()}</div></div>`),
    card('Scroll Animation','Count Up Numbers','Trust Building', `<div class="anim-preview-bg" style="flex-direction:row;gap:12px;flex-wrap:wrap;justify-content:center;"><div class="count-item"><div class="count-num">500+</div><div class="count-lbl">Clients</div></div><div class="count-item"><div class="count-num">12yr</div><div class="count-lbl">Experience</div></div><div class="count-item"><div class="count-num">24/7</div><div class="count-lbl">Support</div></div></div>`),
    card('Scroll Animation','Parallax Layers','Depth', `<div class="anim-preview-bg" style="position:relative;overflow:hidden;background:#030308;"><div style="position:absolute;width:100%;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:2.5rem;color:rgba(255,255,255,0.04);top:10%;animation:plax1 6s ease-in-out infinite alternate;">BRAND</div><div style="position:absolute;width:100%;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:4.5rem;color:rgba(255,255,255,0.025);top:25%;animation:plax2 6s ease-in-out infinite alternate;">YOUR</div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;letter-spacing:0.08em;">Parallax</div><div style="font-size:0.58rem;color:rgba(255,255,255,0.35);font-family:Syne,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">Multi-layer depth</div></div></div>`),
    card('Scroll Animation','Stagger Grid','For Services', `<div class="anim-preview-bg" style="flex-direction:row;flex-wrap:wrap;gap:5px;padding:14px;"><div class="sg-item"><div class="sg-icon"></div><div class="sg-t">CCTV</div><div class="sg-d">24hr</div></div><div class="sg-item"><div class="sg-icon"></div><div class="sg-t">Alarms</div><div class="sg-d">Cover</div></div><div class="sg-item"><div class="sg-icon"></div><div class="sg-t">Access</div><div class="sg-d">Control</div></div><div class="sg-item"><div class="sg-icon"></div><div class="sg-t">Support</div><div class="sg-d">24/7</div></div></div>`),
    card('Scroll Animation','Text Reveal','Cinematic', `<div class="anim-preview-bg" style="align-items:flex-start;padding:18px;"><div class="rv-line"></div><div class="rv-t"><span>WE PROTECT</span></div><div class="rv-t"><span>WHAT MATTERS</span></div><div class="rv-line"></div></div>`),
  ].join('');

  if (!document.getElementById('plax-style')) {
    const s = document.createElement('style');
    s.id = 'plax-style';
    s.textContent = '@keyframes plax1{from{transform:translateY(-8px)}to{transform:translateY(8px)}} @keyframes plax2{from{transform:translateY(6px)}to{transform:translateY(-6px)}}';
    document.head.appendChild(s);
  }
}

// ══════════════════════════════════════
// QUESTIONNAIRE
// ══════════════════════════════════════
function initQuestionnaire() {
  document.getElementById('q-domain')?.addEventListener('change', function() {
    const f = document.getElementById('q-domain-field');
    if (f) f.style.display = this.value === 'Yes — I own one already' ? 'block' : 'none';
  });

  document.querySelectorAll('.q-check').forEach(label => {
    label.querySelector('input')?.addEventListener('change', () => {
      label.classList.toggle('checked', label.querySelector('input').checked);
    });
  });

  document.getElementById('q-overlay')?.addEventListener('click', function(e) {
    if (e.target === this) closeQuestionnaire();
  });
}

function openQuestionnaire() {
  if (!Object.keys(selections).length) {
    showToast('Make at least one selection first', 'error');
    return;
  }
  if (cartOpen) toggleCart();
  qStep = 1;
  showQStep(1);
  document.getElementById('q-overlay').classList.add('open');
  document.getElementById('q-footer').style.display = '';
  document.getElementById('q-success').classList.remove('show');
  document.querySelectorAll('.q-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-1').classList.add('active');
}

function closeQuestionnaire() {
  document.getElementById('q-overlay').classList.remove('open');
}

function showQStep(n) {
  document.querySelectorAll('.q-step').forEach(s => s.classList.remove('active'));
  const step = document.getElementById('step-' + n);
  if (step) step.classList.add('active');
  const titles = ['Your Details','Pages & Features','Your Content','Style & Branding','Almost Done!'];
  document.getElementById('q-title').textContent = titles[n-1] || '';
  document.getElementById('q-ind').textContent = `Step ${n} of ${Q_TOTAL}`;
  document.getElementById('q-progress-fill').style.width = ((n / Q_TOTAL) * 100) + '%';
  document.getElementById('q-back').style.visibility = n > 1 ? 'visible' : 'hidden';
  document.getElementById('q-next').textContent = n === Q_TOTAL ? 'Submit Brief ✦' : 'Next →';
}

function prevStep() {
  if (qStep > 1) { qStep--; showQStep(qStep); }
}

function nextStep() {
  if (qStep === 1) {
    const name = document.getElementById('q-name')?.value.trim();
    const email = document.getElementById('q-email')?.value.trim();
    if (!name || !email) { showToast('Please enter your name and email', 'error'); return; }
    if (!email.includes('@')) { showToast('Please enter a valid email address', 'error'); return; }
  }
  if (qStep < Q_TOTAL) {
    qStep++;
    showQStep(qStep);
  } else {
    submitBrief();
  }
}

// ══════════════════════════════════════
// MOOD BOARD UPLOAD
// ══════════════════════════════════════
function handleMoodUpload(input) {
  const previews = document.getElementById('upload-previews');
  Array.from(input.files).forEach(file => {
    if (file.size > 5 * 1024 * 1024) { showToast('File too large — max 5MB', 'error'); return; }
    moodFiles.push(file);
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'upload-thumb';
      img.title = file.name;
      previews.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// ══════════════════════════════════════
// LIVE PREVIEW UPDATE
// ══════════════════════════════════════
function updatePreviewLive() {
  const panel = document.getElementById('tab-generate');
  if (panel && panel.classList.contains('active')) {
    buildPreviewPanel();
  }
}

function buildPreviewPanel() {
  const container = document.getElementById('preview-container');
  if (!container) return;
  const keys = Object.keys(selections);

  const chips = keys.map(k => `<div class="gen-chip"><span class="gc">${k}:</span>${selections[k]}</div>`).join('');

  if (!keys.length) {
    container.innerHTML = `<div class="gen-empty"><div class="gen-icon">✦</div><div class="gen-title">Live Preview</div><div class="gen-sub">Make selections from the tabs above, then come back here to see your site assembled in real time.</div><div class="gen-chips">${chips}</div></div>`;
    return;
  }

  container.innerHTML = `<div class="gen-empty" style="text-align:center;padding:1.5rem 0;"><div class="gen-chips">${chips}</div><button class="gen-btn" onclick="generatePreview()">Generate Live Preview</button><div class="gen-hint" id="gen-hint">${keys.length} selection${keys.length>1?'s':''} ready</div></div><div id="gen-preview-wrap" style="display:none;"></div>`;
}

function generatePreview() {
  const keys = Object.keys(selections);
  if (!keys.length) return;

  const scheme = selections['Colour Scheme'] || 'Charcoal + Cyan';
  const c = schemeColors[scheme] || schemeColors['Charcoal + Cyan'];
  const bg = selections['Background'] || 'Dark Grid';
  const anim = selections['Scroll Animation'] || 'Fade In Up';

  const animCSS = {
    'Fade In Up': `.anim-el{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease}.anim-el.visible{opacity:1;transform:translateY(0)}`,
    'Slide In Left': `.anim-el{opacity:0;transform:translateX(-40px);transition:opacity 0.6s ease,transform 0.6s ease}.anim-el.visible{opacity:1;transform:translateX(0)}`,
    'Scale In': `.anim-el{opacity:0;transform:scale(0.85);transition:opacity 0.6s ease,transform 0.6s ease}.anim-el.visible{opacity:1;transform:scale(1)}`,
    'Stagger Grid': `.anim-el{opacity:0;transform:translateY(20px);transition:opacity 0.5s ease,transform 0.5s ease}.anim-el.visible{opacity:1;transform:translateY(0)}`,
    'Text Reveal': `.anim-el{opacity:0;transform:translateY(20px);transition:opacity 0.7s ease,transform 0.7s ease}.anim-el.visible{opacity:1;transform:translateY(0)}`,
    'Count Up Numbers': `.anim-el{opacity:0;transition:opacity 0.8s ease}.anim-el.visible{opacity:1}`,
  };

  const bgCSS = bg === 'Dark Grid'
    ? `background:${c.bg};background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:28px 28px;`
    : bg === 'Gradient Flow'
    ? `background:linear-gradient(-45deg,${c.bg},${c.nav},${c.bg});background-size:400% 400%;animation:gf 6s ease infinite;`
    : bg === 'Mesh Gradient'
    ? `background:radial-gradient(ellipse at 20% 50%,${c.accent}22 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,${c.accent}18 0%,transparent 50%),${c.bg};`
    : bg === 'Aurora'
    ? `background:${c.bg};`
    : bg === 'Scanlines'
    ? `background:${c.bg};`
    : bg === 'Clean White' || bg === 'Soft Paper' || bg === 'Light Gradient'
    ? `background:${c.bg};`
    : `background:${c.bg};`;

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>
*{margin:0;padding:0;box-sizing:border-box}
@keyframes gf{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
body{${bgCSS}color:${c.text};font-family:'Segoe UI',system-ui,sans-serif;min-height:100vh}
${animCSS[anim] || animCSS['Fade In Up']}
nav{background:${c.nav};padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(128,128,128,0.12);position:sticky;top:0;z-index:10;}
.logo{font-size:1.3rem;font-weight:900;letter-spacing:0.06em}.logo span{color:${c.accent}}
.nav-links{display:flex;gap:1.5rem}.nav-links a{font-size:0.8rem;color:${c.text};opacity:0.6;text-decoration:none;letter-spacing:0.04em;transition:opacity 0.2s}.nav-links a:hover{opacity:1}
.hero{padding:6rem 2rem;text-align:center;max-width:760px;margin:0 auto}
.eyebrow{font-size:0.7rem;color:${c.accent};letter-spacing:0.28em;text-transform:uppercase;margin-bottom:1.2rem}
h1{font-size:clamp(2.5rem,6vw,5rem);font-weight:900;line-height:0.92;letter-spacing:0.03em;margin-bottom:1.2rem}
h1 em{color:${c.accent};font-style:normal}
.hero-sub{font-size:1rem;color:${c.text};opacity:0.5;line-height:1.7;margin-bottom:2.5rem;max-width:500px;margin-left:auto;margin-right:auto}
.btn{background:${c.btn};color:${c.btnText};padding:14px 34px;border:none;border-radius:5px;font-size:0.84rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;display:inline-block;text-decoration:none;margin-right:10px}
.btn-ghost{background:transparent;border:1px solid ${c.accent};color:${c.accent};padding:13px 28px;border-radius:5px;font-size:0.84rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;display:inline-block;text-decoration:none}
.stats{display:flex;gap:3rem;justify-content:center;padding:3rem 2rem;border-top:1px solid rgba(128,128,128,0.1);border-bottom:1px solid rgba(128,128,128,0.1)}
.stat-v{font-size:2.5rem;font-weight:900;color:${c.accent};line-height:1}
.stat-l{font-size:0.68rem;color:${c.text};opacity:0.4;text-transform:uppercase;letter-spacing:0.12em;margin-top:0.3rem}
.services{padding:4rem 2rem;max-width:980px;margin:0 auto}
.s-eye{font-size:0.65rem;color:${c.accent};letter-spacing:0.22em;text-transform:uppercase;margin-bottom:0.5rem}
.s-h{font-size:2rem;font-weight:800;margin-bottom:2.5rem}
.s-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}
.s-card{background:${c.nav};border:1px solid rgba(128,128,128,0.1);border-radius:10px;padding:1.5rem}
.s-icon{width:36px;height:36px;border-radius:8px;background:${c.accent}22;border:1px solid ${c.accent}44;margin-bottom:1rem}
.s-card h3{font-size:1rem;font-weight:700;margin-bottom:0.4rem;color:${c.accent}}
.s-card p{font-size:0.8rem;color:${c.text};opacity:0.45;line-height:1.6}
footer{border-top:1px solid rgba(128,128,128,0.08);padding:1.5rem 2rem;display:flex;justify-content:space-between;font-size:0.7rem;color:${c.text};opacity:0.3;margin-top:3rem}
@media(max-width:640px){.s-grid{grid-template-columns:1fr}.stats{flex-direction:column;align-items:center;gap:1.5rem}.nav-links{display:none}}
</style></head><body>
<nav><div class="logo">UNIQUE<span>FIRE</span></div><div class="nav-links"><a href="#">Home</a><a href="#">Services</a><a href="#">About</a><a href="#">Contact</a></div><a class="btn" href="#" style="padding:8px 18px;font-size:0.72rem;">Get Quote</a></nav>
<div class="hero anim-el">
  <p class="eyebrow">Security & Protection · Ireland</p>
  <h1>WE KEEP YOU <em>SAFE</em></h1>
  <p class="hero-sub">Professional CCTV, alarm systems and access control for homes and businesses across Ireland. Trusted by hundreds of clients.</p>
  <a href="#" class="btn">Get a Free Quote</a><a href="#" class="btn-ghost">Our Services</a>
</div>
<div class="stats">
  <div class="anim-el" style="text-align:center"><div class="stat-v">500+</div><div class="stat-l">Clients</div></div>
  <div class="anim-el" style="text-align:center;transition-delay:0.1s"><div class="stat-v">12yr</div><div class="stat-l">Experience</div></div>
  <div class="anim-el" style="text-align:center;transition-delay:0.2s"><div class="stat-v">24/7</div><div class="stat-l">Support</div></div>
</div>
<div class="services">
  <p class="s-eye anim-el">What We Do</p>
  <h2 class="s-h anim-el">Our Services</h2>
  <div class="s-grid">
    <div class="s-card anim-el"><div class="s-icon"></div><h3>CCTV Systems</h3><p>HD camera systems with remote viewing for homes and businesses across Ireland.</p></div>
    <div class="s-card anim-el" style="transition-delay:0.1s"><div class="s-icon"></div><h3>Alarm Systems</h3><p>Intruder alarms, fire alarms and fully monitored security solutions installed.</p></div>
    <div class="s-card anim-el" style="transition-delay:0.2s"><div class="s-icon"></div><h3>Access Control</h3><p>Key fobs, intercoms and gate automation systems professionally installed.</p></div>
  </div>
</div>
<footer><span>© 2025 Unique Fire Security Ltd. All rights reserved.</span><span>Dublin, Ireland · hello@uniquefire.ie</span></footer>
<script>
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:0.15});
document.querySelectorAll('.anim-el').forEach(el=>obs.observe(el));
<\/script>
</body></html>`;

  const wrap = document.getElementById('gen-preview-wrap');
  if (!wrap) return;
  wrap.style.display = 'block';

  wrap.innerHTML = `<div class="mac-browser">
    <div class="mac-bar">
      <div class="mac-dots"><div class="mac-dot"></div><div class="mac-dot"></div><div class="mac-dot"></div></div>
      <div class="mac-url">uniquefire.ie — CM Studio Preview</div>
      <div class="mac-actions"><div class="mac-action">←</div><div class="mac-action">→</div><div class="mac-action">⟳</div></div>
    </div>
    <iframe id="preview-iframe" sandbox="allow-scripts" title="Site Preview" style="width:100%;height:580px;border:none;display:block;"></iframe>
  </div>
  <div style="text-align:center;margin-top:1.2rem;">
    <button class="gen-btn" onclick="buildPreviewPanel()">← Change Selections</button>
  </div>`;

  const iframe = document.getElementById('preview-iframe');
  if (iframe) iframe.srcdoc = html;
}

// ══════════════════════════════════════
// TOAST
// ══════════════════════════════════════
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => { t.className = 'toast'; }, 3500);
}