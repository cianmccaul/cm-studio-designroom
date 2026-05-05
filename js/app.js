/* ═══════════════════════════════════════
   CM STUDIO — DESIGNROOM V4
   js/app.js — all bugs fixed
   FIX 1: single-click fullscreen button
   FIX 2: compare filmstrip picker
   FIX 3: preview = "Your Business"
   FIX 4: logo viewBox (in logo.svg)
   FIX 5: intro timing + get started
═══════════════════════════════════════ */

// ── STATE ──
const selections = {};
let cartOpen = false;
let currentScheme = null;
let schemeTransformActive = false;
let qStep = 1;
const Q_TOTAL = 5;
let modalCard = null;
let compareMode = false;
let comparePickCard = null;
let lightMode = false;
const moodFiles = [];

const schemeMap = {
  'Charcoal + Cyan':'cyan','Navy + Gold':'gold','Black + White':'mono',
  'Dark + Red':'red','Slate + Emerald':'emerald','Dark Forest':'forest',
  'Deep Purple + Violet':'violet','Copper + Orange':'copper',
  'Midnight + Pink':'pink','Ocean Dark + Teal':'teal'
};

const schemeColors = {
  'Charcoal + Cyan':     {bg:'#0a0a0a',nav:'#141414',accent:'#00e5ff',text:'#f0f0f0',btn:'#00e5ff',btnText:'#000'},
  'Navy + Gold':         {bg:'#09101e',nav:'#111828',accent:'#d4a843',text:'#eef0f4',btn:'#d4a843',btnText:'#000'},
  'Black + White':       {bg:'#ffffff',nav:'#f5f5f5',accent:'#000000',text:'#111111',btn:'#000',btnText:'#fff'},
  'Dark + Red':          {bg:'#0d0505',nav:'#160808',accent:'#e63333',text:'#f5f2f2',btn:'#e63333',btnText:'#fff'},
  'Slate + Emerald':     {bg:'#0e141a',nav:'#16202a',accent:'#10b981',text:'#e8edf2',btn:'#10b981',btnText:'#000'},
  'Dark Forest':         {bg:'#080d08',nav:'#101810',accent:'#4ade80',text:'#e8f0e8',btn:'#4ade80',btnText:'#000'},
  'Deep Purple + Violet':{bg:'#120820',nav:'#1a1030',accent:'#a855f7',text:'#f0eaff',btn:'#a855f7',btnText:'#fff'},
  'Copper + Orange':     {bg:'#0f0a06',nav:'#1a1008',accent:'#e8943a',text:'#f5efe8',btn:'#e8943a',btnText:'#000'},
  'Midnight + Pink':     {bg:'#08080a',nav:'#121218',accent:'#ff3366',text:'#ffffff',btn:'#ff3366',btnText:'#fff'},
  'Ocean Dark + Teal':   {bg:'#060c10',nav:'#0e1820',accent:'#00bcd4',text:'#e8f4ff',btn:'#00bcd4',btnText:'#000'}
};

// ══════════════════════════════════════
// BOOT
// ══════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  buildAllGrids();
  initTabs();
  initQuestionnaire();
  initNudge();
  checkSavedProgress();
  injectStyles();
  setTimeout(addCardPreviewButtons, 200);
  // Rebuild colors grid after a short delay to ensure it renders
  setTimeout(() => { buildColorsGrid(); }, 100);
});

function injectStyles() {
  if (document.getElementById('v4-injected-styles')) return;
  const s = document.createElement('style');
  s.id = 'v4-injected-styles';
  s.textContent = `
    .card-preview-btn {
      position:absolute;bottom:50px;right:8px;
      background:rgba(0,0,0,0.8);color:rgba(255,255,255,0.85);
      border:1px solid rgba(255,255,255,0.2);
      font-family:'Syne',sans-serif;font-size:0.58rem;font-weight:700;
      letter-spacing:0.08em;text-transform:uppercase;
      padding:4px 10px;border-radius:20px;cursor:pointer;
      opacity:0;transform:translateY(4px);
      transition:opacity 0.2s,transform 0.2s;
      z-index:6;white-space:nowrap;
    }
    .preview-card:hover .card-preview-btn { opacity:1;transform:translateY(0); }
    .scheme-applied-notice {
      position:fixed;top:80px;left:50%;
      transform:translateX(-50%) translateY(-10px);
      background:var(--bg2);border:1px solid var(--accent-b);
      color:var(--accent);font-family:'Syne',sans-serif;
      font-size:0.72rem;font-weight:700;letter-spacing:0.1em;
      text-transform:uppercase;padding:8px 20px;border-radius:30px;
      z-index:300;opacity:0;transition:all 0.4s ease;
      pointer-events:none;white-space:nowrap;
    }
    .scheme-applied-notice.show { opacity:1;transform:translateX(-50%) translateY(0); }
    @keyframes pulseAnim{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
    @keyframes countPulse{0%{opacity:0.3}50%{opacity:1}100%{opacity:0.3}}
    @keyframes marqueeScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes textGlow{0%{text-shadow:0 0 10px rgba(0,229,255,0.3)}100%{text-shadow:0 0 30px rgba(0,229,255,0.8)}}
    @keyframes cursorGlow{0%{transform:translate(-50%,-50%) scale(1)}100%{transform:translate(-30%,-40%) scale(1.3)}}
    @keyframes gradFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes meshPulse{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(25deg)}}
    @keyframes auroraPulse{0%{opacity:0.7}100%{opacity:1}}
    @keyframes lightGrad{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(30deg)}}
    @keyframes typing{0%,8%{width:0}50%,88%{width:10ch}96%,100%{width:0}}
    @keyframes blink{50%{border-color:transparent}}
    @keyframes geoSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes blobFloat{0%{transform:translate(0,0) scale(1)}100%{transform:translate(15px,-15px) scale(1.1)}}
    @keyframes plax1{from{transform:translateY(-8px)}to{transform:translateY(8px)}}
    @keyframes plax2{from{transform:translateY(6px)}to{transform:translateY(-6px)}}
    @keyframes wipeReveal{0%{transform:translateX(0)}50%{transform:translateX(100%)}51%{transform:translateX(-100%)}100%{transform:translateX(0)}}
  `;
  document.head.appendChild(s);
}

// ══════════════════════════════════════
// FIX 1: SINGLE-CLICK FULLSCREEN
// ══════════════════════════════════════
function addCardPreviewButtons() {
  document.querySelectorAll('.preview-card').forEach(card => {
    if (card._previewBtnAdded) return;
    card._previewBtnAdded = true;
    const btn = document.createElement('button');
    btn.className = 'card-preview-btn';
    btn.innerHTML = '⤢ Preview';
    btn.addEventListener('click', e => { e.stopPropagation(); openModal(card); });
    card.appendChild(btn);
  });
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
      if (btn.dataset.tab === 'colors') buildColorsGrid();
      updateNudge();
      setTimeout(addCardPreviewButtons, 60);
    });
  });
}

// ══════════════════════════════════════
// THEME + SCHEME
// ══════════════════════════════════════
function toggleTheme() {
  lightMode = !lightMode;
  document.body.classList.toggle('light-mode', lightMode);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = lightMode ? '☾ Dark' : '☀ Light';
}

function toggleSchemeTransform() {
  if (!currentScheme) return;
  schemeTransformActive = !schemeTransformActive;
  applySchemeTransform();
  const btn = document.getElementById('scheme-btn');
  if (btn) btn.textContent = schemeTransformActive ? '◐ Reset Scheme' : '◐ Apply Scheme';
  if (schemeTransformActive) {
    let n = document.getElementById('scheme-notice');
    if (!n) { n = document.createElement('div'); n.id='scheme-notice'; n.className='scheme-applied-notice'; document.body.appendChild(n); }
    n.textContent = 'Your brand. Applied.';
    n.classList.add('show');
    setTimeout(() => n.classList.remove('show'), 2200);
  }
}

function applySchemeTransform() {
  Object.values(schemeMap).forEach(cls => document.body.classList.remove('scheme-' + cls));
  if (schemeTransformActive && currentScheme) {
    const cls = schemeMap[currentScheme];
    if (cls) document.body.classList.add('scheme-' + cls);
  }
}

// ══════════════════════════════════════
// SELECTIONS
// ══════════════════════════════════════
function toggleSelect(card) {
  const cat = card.dataset.category, label = card.dataset.label;
  if (!cat || !label) return;
  if (card.classList.contains('selected')) {
    card.classList.remove('selected');
    if (selections[cat] === label) delete selections[cat];
    if (cat === 'Colour Scheme') {
      currentScheme = null;
      const sb = document.getElementById('scheme-btn'); if (sb) sb.style.display = 'none';
      if (schemeTransformActive) { schemeTransformActive = false; applySchemeTransform(); }
    }
  } else {
    document.querySelectorAll(`.preview-card[data-category="${cat}"]`).forEach(c => c.classList.remove('selected'));
    card.classList.add('selected'); selections[cat] = label;
    if (cat === 'Colour Scheme') {
      currentScheme = label;
      const sb = document.getElementById('scheme-btn'); if (sb) sb.style.display = '';
      if (schemeTransformActive) applySchemeTransform();
    }
  }
  updateCart(); updateNudge(); updatePreviewLive();
}

function removeItem(cat) {
  delete selections[cat];
  document.querySelectorAll(`.preview-card[data-category="${cat}"]`).forEach(c => c.classList.remove('selected'));
  if (cat === 'Colour Scheme') {
    currentScheme = null;
    const sb = document.getElementById('scheme-btn'); if (sb) sb.style.display = 'none';
    schemeTransformActive = false; applySchemeTransform();
  }
  updateCart(); updateNudge();
}

function clearAll() {
  document.querySelectorAll('.preview-card.selected').forEach(c => c.classList.remove('selected'));
  Object.keys(selections).forEach(k => delete selections[k]);
  currentScheme = null; schemeTransformActive = false; applySchemeTransform();
  const sb = document.getElementById('scheme-btn'); if (sb) sb.style.display = 'none';
  updateCart(); updateNudge();
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
  const cc = document.getElementById('cart-count'); if (cc) cc.textContent = keys.length;
  const el = document.getElementById('cart-items'); if (!el) return;
  if (!keys.length) { el.innerHTML = '<div class="cart-empty"><strong>Nothing selected yet</strong>Browse the tabs and click anything you like.</div>'; return; }
  el.innerHTML = keys.map(k => `<div class="cart-item"><div><div class="ci-cat">${k}</div><div class="ci-label">${selections[k]}</div></div><button class="ci-remove" onclick="removeItem('${k}')">✕</button></div>`).join('');
}

// ══════════════════════════════════════
// NUDGE
// ══════════════════════════════════════
const NUDGE_CATS = ['Background','Navbar','Hero Section','Colour Scheme','Card Style','Footer','Contact Form','Scroll Animation'];

function initNudge() {
  const dots = document.getElementById('nudge-dots');
  if (dots) dots.innerHTML = NUDGE_CATS.map(() => '<div class="nudge-dot"></div>').join('');
  updateNudge();
}

function updateNudge() {
  document.querySelectorAll('.nudge-dot').forEach((d, i) => d.classList.toggle('filled', !!selections[NUDGE_CATS[i]]));
  const msg = document.getElementById('nudge-msg'); if (!msg) return;
  const n = Object.keys(selections).length;
  const msgs = ['Start by picking a background',`${n} selection — keep going!`,`${n} selections — looking good`,`Halfway there — ${8-n} to go`,`${n} down, keep picking`,`Great taste — ${8-n} left`,'Almost complete — nearly there!',"One more and you're done ✦",'All done! Hit Submit when ready ✦'];
  msg.textContent = msgs[Math.min(n, 8)];
}

// ══════════════════════════════════════
// SAVE PROGRESS
// ══════════════════════════════════════
async function saveProgress() {
  const email = document.getElementById('save-email')?.value?.trim();
  if (!email) { showToast('Enter your email to save progress', 'error'); return; }
  const id = btoa(email).replace(/=/g,'').substring(0,12);
  try {
    localStorage.setItem('dr_progress_'+id, JSON.stringify({email,selections,savedAt:new Date().toISOString()}));
    const url = window.location.origin + window.location.pathname + '?progress=' + id;
    await navigator.clipboard.writeText(url);
    showToast('Link copied! Send it to yourself ✦', 'success');
  } catch(e) { showToast('Progress saved locally', 'success'); }
}

function checkSavedProgress() {
  const id = new URLSearchParams(window.location.search).get('progress');
  if (!id) return;
  try {
    const saved = localStorage.getItem('dr_progress_'+id); if (!saved) return;
    const data = JSON.parse(saved);
    Object.assign(selections, data.selections || {});
    Object.entries(selections).forEach(([cat,label]) => {
      const card = document.querySelector(`.preview-card[data-category="${cat}"][data-label="${label}"]`);
      if (card) card.classList.add('selected');
      if (cat === 'Colour Scheme') { currentScheme = label; const sb = document.getElementById('scheme-btn'); if(sb) sb.style.display=''; }
    });
    updateCart(); updateNudge();
    showToast('Selections restored ✦', 'success');
  } catch(e) {}
}

// ══════════════════════════════════════
// FIX 2: FULLSCREEN MODAL — single click
// ondblclick removed; preview btn opens it
// ══════════════════════════════════════
function openModal(card) {
  modalCard = card; compareMode = false; comparePickCard = null;
  document.getElementById('modal-title').textContent = card.dataset.label;
  document.getElementById('modal-tag').textContent = card.querySelector('.ct')?.textContent || '';
  const selBtn = document.getElementById('modal-select-btn');
  if (selBtn) selBtn.textContent = card.classList.contains('selected') ? '✓ Selected' : 'Add to Brief';
  const body = document.getElementById('modal-body');
  body.innerHTML = '';
  body.appendChild(buildModalContent(card));
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  modalCard = null; compareMode = false; comparePickCard = null;
}

function modalSelect() {
  if (!modalCard) return;
  toggleSelect(modalCard);
  const selBtn = document.getElementById('modal-select-btn');
  if (selBtn) selBtn.textContent = modalCard.classList.contains('selected') ? '✓ Selected' : 'Add to Brief';
}

// ══════════════════════════════════════
// FIX 3: COMPARE — FILMSTRIP PICKER
// ══════════════════════════════════════
function toggleCompare() {
  if (!modalCard) return;
  compareMode = !compareMode;
  const body = document.getElementById('modal-body');
  body.innerHTML = '';
  if (!compareMode) { body.appendChild(buildModalContent(modalCard)); return; }

  const cat = modalCard.dataset.category;
  const others = Array.from(document.querySelectorAll(`.preview-card[data-category="${cat}"]`)).filter(c => c !== modalCard);
  comparePickCard = others[0] || null;

  // outer layout
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;height:100%;';

  // split area
  const split = document.createElement('div');
  split.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;flex:1;overflow:hidden;';

  // LEFT
  const leftWrap = document.createElement('div');
  leftWrap.style.cssText = 'position:relative;overflow:hidden;border-right:2px solid var(--accent);';
  leftWrap.appendChild(buildModalContent(modalCard));
  leftWrap.appendChild(makePanelLabel(modalCard.dataset.label, false));
  leftWrap.appendChild(makePanelSelectBtn(modalCard, 'left'));

  // RIGHT
  const rightWrap = document.createElement('div');
  rightWrap.id = 'compare-right';
  rightWrap.style.cssText = 'position:relative;overflow:hidden;';
  renderCompareRight(rightWrap, comparePickCard);

  split.appendChild(leftWrap);
  split.appendChild(rightWrap);

  // FILMSTRIP
  const strip = document.createElement('div');
  strip.style.cssText = 'display:flex;gap:8px;padding:10px 14px;background:var(--bg2);border-top:1px solid var(--border);overflow-x:auto;flex-shrink:0;scrollbar-width:thin;align-items:center;';
  const stripLabel = document.createElement('div');
  stripLabel.style.cssText = 'font-family:Syne,sans-serif;font-size:0.6rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--dim);white-space:nowrap;padding-right:10px;border-right:1px solid var(--border);margin-right:4px;flex-shrink:0;';
  stripLabel.textContent = 'Compare with';
  strip.appendChild(stripLabel);

  others.forEach(c => {
    const thumb = document.createElement('div');
    thumb.style.cssText = `flex-shrink:0;width:74px;border-radius:6px;overflow:hidden;border:2px solid ${c===comparePickCard?'var(--accent)':'var(--border)'};cursor:pointer;transition:border-color 0.15s,transform 0.15s;`;
    thumb.dataset.label = c.dataset.label;

    const pw = c.querySelector('.pw');
    if (pw) {
      const clone = pw.cloneNode(true);
      clone.style.cssText = 'height:50px;pointer-events:none;overflow:hidden;';
      clone.querySelectorAll('canvas').forEach(cv => cv.remove());
      thumb.appendChild(clone);
    }
    const tLabel = document.createElement('div');
    tLabel.textContent = c.dataset.label;
    tLabel.style.cssText = 'font-family:Syne,sans-serif;font-size:0.54rem;font-weight:700;padding:3px 5px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--bg3);';
    thumb.appendChild(tLabel);

    thumb.addEventListener('click', () => {
      strip.querySelectorAll('[data-active]').forEach(t => { t.style.borderColor='var(--border)'; delete t.dataset.active; });
      thumb.style.borderColor = 'var(--accent)'; thumb.dataset.active = '1';
      comparePickCard = c;
      const rw = document.getElementById('compare-right');
      if (rw) renderCompareRight(rw, c);
    });
    strip.appendChild(thumb);
  });

  wrap.appendChild(split);
  wrap.appendChild(strip);
  body.appendChild(wrap);
}

function renderCompareRight(container, card) {
  container.innerHTML = '';
  if (!card) {
    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--dim);font-family:Syne,sans-serif;font-size:0.8rem;">Pick a card in the filmstrip below</div>';
    return;
  }
  container.appendChild(buildModalContent(card));
  container.appendChild(makePanelLabel(card.dataset.label, true));
  container.appendChild(makePanelSelectBtn(card, 'right'));
}

function makePanelLabel(text, isRight) {
  const el = document.createElement('div');
  el.style.cssText = `position:absolute;top:10px;${isRight?'right':'left'}:10px;background:rgba(0,0,0,0.75);color:#fff;font-family:Syne,sans-serif;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border-radius:20px;z-index:5;pointer-events:none;white-space:nowrap;`;
  el.textContent = text; return el;
}

function makePanelSelectBtn(card, side) {
  const btn = document.createElement('button');
  btn.style.cssText = `position:absolute;bottom:14px;${side==='right'?'right':'left'}:14px;font-family:Syne,sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;background:var(--accent);color:#000;border:none;padding:8px 16px;border-radius:5px;cursor:pointer;z-index:6;transition:opacity 0.15s;`;
  btn.textContent = card.classList.contains('selected') ? '✓ Selected' : 'Select This';
  btn.addEventListener('click', e => {
    e.stopPropagation(); toggleSelect(card);
    btn.textContent = card.classList.contains('selected') ? '✓ Selected' : 'Select This';
    if (card === modalCard) { const sb = document.getElementById('modal-select-btn'); if(sb) sb.textContent = card.classList.contains('selected') ? '✓ Selected' : 'Add to Brief'; }
  });
  return btn;
}

// ══════════════════════════════════════
// MODAL CONTENT BUILDER
// ══════════════════════════════════════
function buildModalContent(card) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';
  const cat = card.dataset.category, label = card.dataset.label;
  const activeSwEl = card.querySelector('.cs-swatch.active');
  const color = activeSwEl?.dataset?.color || activeSwEl?.style?.background || '#00e5ff';

  if (cat === 'Background') {
    wrap.style.overflow = 'hidden';
    wrap.appendChild(buildFullscreenBg(label, color));
  } else if (cat === 'Scroll Animation') {
    wrap.style.overflow = 'auto';
    wrap.innerHTML = buildScrollAnimDemo(label);
  } else {
    const pw = card.querySelector('.pw');
    if (pw) { const c = pw.cloneNode(true); c.style.cssText='width:100%;height:100%;position:absolute;inset:0;'; wrap.style.overflow='hidden'; wrap.appendChild(c); }
  }
  return wrap;
}

function buildFullscreenBg(label, color) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';
  const mkC = () => { const c=document.createElement('canvas'); c.style.cssText='position:absolute;inset:0;width:100%;height:100%'; wrap.appendChild(c); return c; };
  const map = {
    'Particle Field':  ()=>{ wrap.style.background='#050510'; const c=mkC(); c.dataset.color=color; setTimeout(()=>{c.width=wrap.offsetWidth;c.height=wrap.offsetHeight;initSingleParticleCanvas(c);},80); },
    'Starfield':       ()=>{ wrap.style.background='#020208'; const c=mkC(); c.dataset.color=color; setTimeout(()=>{c.width=wrap.offsetWidth;c.height=wrap.offsetHeight;initSingleStarCanvas(c);},80); },
    'Matrix Rain':     ()=>{ wrap.style.background='#000500'; const c=mkC(); c.dataset.color=color; setTimeout(()=>{c.width=wrap.offsetWidth;c.height=wrap.offsetHeight;initSingleMatrixCanvas(c);},80); },
    'CCTV Tracker':    ()=>{ wrap.style.background='#080808'; const c=mkC(); c.dataset.color=color; setTimeout(()=>{c.width=wrap.offsetWidth;c.height=wrap.offsetHeight;initSingleCCTVCanvas(c);},80); },
    'Gradient Flow':   ()=>{ wrap.style.cssText+='background:linear-gradient(-45deg,#0a0015,#001a2e,#0d1f00,#1a0010);background-size:400% 400%;animation:gradFlow 6s ease infinite;'; },
    'Dark Grid':       ()=>{ wrap.style.cssText+='background-color:#060612;background-image:linear-gradient(rgba(0,229,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.06) 1px,transparent 1px);background-size:28px 28px;'; },
    'Mesh Gradient':   ()=>{ wrap.style.cssText+='background:radial-gradient(ellipse at 20% 50%,rgba(100,30,200,0.28) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(0,80,200,0.28) 0%,transparent 50%),#080808;animation:meshPulse 8s ease-in-out infinite alternate;'; },
    'Aurora':          ()=>{ wrap.style.background='#030310'; wrap.innerHTML='<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgba(0,200,150,0.2) 0%,transparent 55%),radial-gradient(ellipse at 70% 30%,rgba(100,0,200,0.2) 0%,transparent 55%);animation:auroraPulse 6s ease-in-out infinite alternate;"></div>'; },
    'Scanlines':       ()=>{ wrap.style.background='#050505'; wrap.innerHTML='<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,100,0.012) 2px,rgba(0,255,100,0.012) 4px);"></div>'; },
    'Noise Texture':   ()=>{ wrap.style.background='#0c0c0c'; },
    'Circuit Board':   ()=>{ wrap.style.cssText+='background:#050a05;background-image:linear-gradient(rgba(0,200,80,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,80,0.04) 1px,transparent 1px);background-size:20px 20px;'; },
    'Floating Blobs':  ()=>{ wrap.style.background='#08080f'; wrap.dataset.blobs='true'; setTimeout(()=>initBlobs&&initBlobs(),50); },
    'Clean White':     ()=>{ wrap.style.background='#ffffff'; },
    'Soft Paper':      ()=>{ wrap.style.background='#faf8f5'; },
    'Light Gradient':  ()=>{ wrap.style.cssText+='background:linear-gradient(135deg,#f0f4ff,#faf0ff,#f0fff4);animation:lightGrad 8s ease infinite alternate;'; },
    'Diagonal Lines':  ()=>{ wrap.style.cssText+='background:#080808;background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 20px);'; },
    'Dot Grid':        ()=>{ wrap.style.cssText+='background:#06060c;background-image:radial-gradient(circle,rgba(0,229,255,0.2) 1px,transparent 1px);background-size:22px 22px;'; },
    'Topographic':     ()=>{ wrap.style.background='#060810'; wrap.innerHTML='<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.12" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#00e5ff" stroke-width="1"><path d="M0,300 Q200,200 400,300 T800,300"/><path d="M0,260 Q200,160 400,260 T800,260"/><path d="M0,340 Q200,240 400,340 T800,340"/><path d="M0,220 Q200,120 400,220 T800,220"/><path d="M0,380 Q200,280 400,380 T800,380"/><path d="M0,180 Q200,80 400,180 T800,180"/><path d="M0,420 Q200,320 400,420 T800,420"/></g></svg>'; },
  };
  (map[label] || (()=>{ wrap.style.background='#080808'; }))();
  return wrap;
}

function buildScrollAnimDemo(label) {
  // Build card HTML safely without nested template literal conflicts
  function makeCards(cls, tr, count) {
    var out = '';
    for (var i = 1; i <= count; i++) {
      out += '<div class="' + cls + '" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1.5rem;margin-bottom:1.5rem;opacity:0;' + tr + ';transition:all 0.7s ease ' + (i * 0.1) + 's;">'
           + '<h3 style="font-family:Syne,sans-serif;font-size:1rem;font-weight:700;margin-bottom:0.4rem;color:#00e5ff;">Service ' + i + '</h3>'
           + '<p style="color:#666;font-size:0.85rem;line-height:1.6;">Animates in as the visitor scrolls down.</p></div>';
    }
    return out;
  }

  var wrap = 'style="background:#060608;min-height:100%;padding:3rem 4rem;font-family:DM Sans,sans-serif;color:#f0f0f0;overflow-y:auto;" id="anim-inner"';
  var h = {
    'Fade In Up':    '<div ' + wrap + '><h2 style="font-family:Bebas Neue,sans-serif;font-size:2.5rem;color:#00e5ff;margin-bottom:0.5rem;">Fade In Up</h2><p style="color:#666;margin-bottom:3rem;font-size:0.9rem;">Scroll down to see elements animate in</p>' + makeCards('anim-f', 'transform:translateY(30px)', 5) + '</div>',
    'Slide In Left': '<div ' + wrap + '><h2 style="font-family:Bebas Neue,sans-serif;font-size:2.5rem;color:#00e5ff;margin-bottom:0.5rem;">Slide In Left</h2><p style="color:#666;margin-bottom:3rem;font-size:0.9rem;">Elements slide in from the left</p>' + makeCards('anim-s', 'transform:translateX(-40px)', 5) + '</div>',
    'Scale In':      '<div ' + wrap + '><h2 style="font-family:Bebas Neue,sans-serif;font-size:2.5rem;color:#00e5ff;margin-bottom:0.5rem;">Scale In</h2><p style="color:#666;margin-bottom:3rem;font-size:0.9rem;">Elements scale up into view</p><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;">' + (function(){ var o=''; for(var i=1;i<=6;i++){o+='<div class="anim-sc" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1.5rem;opacity:0;transform:scale(0.8);transition:all 0.6s ease '+(i*0.08)+'s;"><div style="width:32px;height:32px;border-radius:8px;background:rgba(0,229,255,0.15);margin-bottom:0.8rem;"></div><div style="font-family:Syne,sans-serif;font-size:0.85rem;font-weight:700;color:#00e5ff;">Card '+i+'</div></div>';} return o; })() + '</div></div>',
    'Count Up Numbers': '<div ' + wrap + '><h2 style="font-family:Bebas Neue,sans-serif;font-size:2.5rem;color:#00e5ff;margin-bottom:3rem;">Count Up Numbers</h2><div style="display:flex;gap:3rem;justify-content:center;flex-wrap:wrap;"><div style="text-align:center;"><div class="anim-cu" data-target="500" data-suffix="+" style="font-family:Bebas Neue,sans-serif;font-size:4rem;color:#00e5ff;line-height:1;">0+</div><div style="font-size:0.7rem;color:#666;letter-spacing:0.12em;text-transform:uppercase;margin-top:0.3rem;">Clients</div></div><div style="text-align:center;"><div class="anim-cu" data-target="12" data-suffix="yr" style="font-family:Bebas Neue,sans-serif;font-size:4rem;color:#00e5ff;line-height:1;">0yr</div><div style="font-size:0.7rem;color:#666;text-transform:uppercase;margin-top:0.3rem;">Experience</div></div><div style="text-align:center;"><div class="anim-cu" data-target="99" data-suffix="%" style="font-family:Bebas Neue,sans-serif;font-size:4rem;color:#00e5ff;line-height:1;">0%</div><div style="font-size:0.7rem;color:#666;text-transform:uppercase;margin-top:0.3rem;">Satisfaction</div></div><div style="text-align:center;"><div class="anim-cu" data-target="247" data-suffix="+" style="font-family:Bebas Neue,sans-serif;font-size:4rem;color:#00e5ff;line-height:1;">0+</div><div style="font-size:0.7rem;color:#666;text-transform:uppercase;margin-top:0.3rem;">Projects</div></div></div></div>',
    'Stagger Grid':  '<div ' + wrap + '><h2 style="font-family:Bebas Neue,sans-serif;font-size:2.5rem;color:#00e5ff;margin-bottom:0.5rem;">Stagger Grid</h2><p style="color:#666;margin-bottom:3rem;font-size:0.9rem;">Cards animate in one by one</p><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;">' + (function(){ var items=['CCTV','Alarms','Access','Support','Monitor','Fire','Intercoms','Gates'],o=''; items.forEach(function(s,i){o+='<div class="anim-st" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1.2rem;opacity:0;transform:translateY(20px);transition:all 0.5s ease '+(i*0.08)+'s;"><div style="width:28px;height:28px;border-radius:6px;background:rgba(0,229,255,0.15);margin-bottom:0.7rem;"></div><div style="font-family:Syne,sans-serif;font-size:0.82rem;font-weight:700;color:#00e5ff;">'+s+'</div></div>';}); return o; })() + '</div></div>',
    'Text Reveal':   '<div ' + wrap + '><p style="color:#666;margin-bottom:4rem;font-size:0.9rem;">Scroll down — text reveals from below</p>' + (function(){ var lines=['WE PROTECT','WHAT MATTERS','TO YOU.'],o=''; lines.forEach(function(t,i){var col=i===1?'color:#00e5ff;':''; o+='<div style="overflow:hidden;margin-bottom:0.3rem;"><div class="anim-rv" style="font-family:Bebas Neue,sans-serif;font-size:4rem;letter-spacing:0.04em;line-height:0.95;transform:translateY(110%);transition:transform 0.8s cubic-bezier(0.16,1,0.3,1) '+(i*0.12)+'s;'+col+'">'+t+'</div></div>';}); return o; })() + '</div>',
    'Parallax Layers':'<div ' + wrap + '><h2 style="font-family:Bebas Neue,sans-serif;font-size:2.5rem;color:#00e5ff;margin-bottom:0.5rem;">Parallax Layers</h2><p style="color:#666;margin-bottom:4rem;font-size:0.9rem;">Background layers move at different speeds as you scroll</p><div style="position:relative;min-height:400px;"><div class="plax" data-speed="0.2" style="position:absolute;inset:0;font-family:Bebas Neue,sans-serif;font-size:10rem;color:rgba(255,255,255,0.02);text-align:center;">BRAND</div><div class="plax" data-speed="0.5" style="position:absolute;top:30%;font-family:Bebas Neue,sans-serif;font-size:6rem;color:rgba(0,229,255,0.03);text-align:center;width:100%;">STUDIO</div></div></div>',
  };

  var html = h[label] || '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-family:Syne,sans-serif;">' + label + '</div>';

  return '<div id="anim-demo-wrap" style="height:100%;overflow-y:auto;">' + html + '</div>'
    + '<script>(function(){'
    + 'var w=document.getElementById("anim-demo-wrap");if(!w)return;'
    + 'var o=new IntersectionObserver(function(entries){'
    + 'entries.forEach(function(e){'
    + 'if(!e.isIntersecting)return;'
    + 'var el=e.target;'
    + 'el.style.opacity="1";'
    + 'el.style.transform="translateY(0) translateX(0) scale(1)";'
    + 'if(el.classList.contains("anim-cu")){'
    + 'var t=parseInt(el.dataset.target),s=el.dataset.suffix||"",c=0;'
    + 'var ti=setInterval(function(){c=Math.min(c+t/60,t);el.textContent=Math.floor(c)+s;if(c>=t)clearInterval(ti);},20);}'
    + 'o.unobserve(el);});},{threshold:0.15,root:w});'
    + 'w.addEventListener("scroll",function(){'
    + 'w.querySelectorAll(".plax").forEach(function(el){'
    + 'el.style.transform="translateY("+(w.scrollTop*parseFloat(el.dataset.speed||0.3))+"px)";});});'
    + 'setTimeout(function(){w.querySelectorAll(".anim-f,.anim-s,.anim-sc,.anim-st,.anim-cu,.anim-rv").forEach(function(el){o.observe(el);});},100);'
    + '})();<\/script>';
}

// ══════════════════════════════════════
// GRID BUILDERS
// ══════════════════════════════════════
function buildAllGrids() {
  buildNavbarsGrid(); buildHeroesGrid(); buildColorsGrid();
  buildCardsGrid(); buildFootersGrid(); buildFormsGrid(); buildAnimationsGrid();
  setTimeout(addCardPreviewButtons, 150);
}

function card(cat, label, tag, pwHTML, swatches) {
  return `<div class="preview-card" data-category="${cat}" data-label="${label}" onclick="toggleSelect(this)">
    <div class="pw">${pwHTML}</div>
    <div class="card-foot"><span class="cl">${label}</span><span class="ct">${tag}</span></div>
    ${swatches||''}
  </div>`;
}

function buildNavbarsGrid() {
  const el = document.getElementById('navbars-grid'); if(!el) return;
  const nbg = c => `<div class="nav-preview-bg" style="display:flex;flex-direction:column;">${c}</div>`;
  el.innerHTML = [
    card('Navbar','Frosted Glass','Modern',nbg(`<div class="np" style="padding:13px 18px;background:rgba(255,255,255,0.055);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.09);"><span class="np-logo">BRAND</span><div class="np-links"><span>Home</span><span>Services</span><span>Contact</span></div></div>`)),
    card('Navbar','Solid Accent Bar','Bold',nbg(`<div class="np" style="padding:13px 18px;background:#111;border-bottom:2px solid #00e5ff;"><span class="np-logo" style="color:#00e5ff">BRAND</span><div class="np-links"><span>Home</span><span>Services</span><span>Contact</span></div></div>`)),
    card('Navbar','Minimal Centred','Clean',nbg(`<div class="np" style="padding:13px 18px;justify-content:center;gap:24px;border-bottom:1px solid rgba(255,255,255,0.05);"><span style="font-size:0.6rem;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase;font-family:Syne,sans-serif;font-weight:600;">Home</span><span style="font-size:0.6rem;color:#fff;letter-spacing:0.1em;text-transform:uppercase;font-family:Syne,sans-serif;font-weight:600;border-bottom:1px solid #fff;padding-bottom:2px;">Services</span><span style="font-size:0.6rem;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase;font-family:Syne,sans-serif;font-weight:600;">Contact</span></div>`)),
    card('Navbar','Bold + CTA','Conversion',nbg(`<div class="np" style="padding:0 18px;height:50px;background:#0d0d0d;border-left:3px solid #ff3366;"><span class="np-logo">BRAND</span><div class="np-links"><span>Services</span><span>About</span></div><span class="np-cta" style="background:#ff3366;color:#fff;">Get Quote</span></div>`)),
    card('Navbar','Hamburger','Responsive',nbg(`<div class="np" style="padding:13px 18px;border-bottom:1px solid rgba(255,255,255,0.06);"><span class="np-logo">BRAND</span><div class="hbg"><span></span><span></span><span style="width:14px"></span></div></div>`)),
    card('Navbar','Sidebar Vertical','Dashboard',`<div style="display:flex;height:100%;background:#06060e;"><div style="width:60px;background:#0d0d0d;border-right:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:14px;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.8rem;color:#00e5ff;">B</span><div style="width:5px;height:5px;border-radius:50%;background:#00e5ff;"></div><div style="width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.15);"></div><div style="width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.15);"></div></div><div style="flex:1;display:flex;align-items:center;padding:16px;"><div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:0.05em;">Page Title</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.3);margin-top:3px;">Sidebar nav</div></div></div></div>`),
    card('Navbar','Split Logo','Elegant',nbg(`<div class="np" style="padding:13px 18px;background:#09090d;border-bottom:1px solid rgba(255,255,255,0.07);"><div class="np-links"><span>Services</span><span>About</span></div><span class="np-logo" style="font-size:1.1rem;">BRAND</span><div class="np-links"><span>Portfolio</span><span>Contact</span></div></div>`)),
    card('Navbar','Floating Pill','Trendy',`<div style="background:#080808;height:100%;display:flex;align-items:center;justify-content:center;border-bottom:1px solid rgba(255,255,255,0.06);"><div style="display:flex;gap:4px;background:rgba(255,255,255,0.05);padding:4px;border-radius:30px;"><span style="font-size:0.57rem;color:#000;padding:5px 10px;border-radius:24px;background:#00e5ff;font-family:Syne,sans-serif;font-weight:700;text-transform:uppercase;">Home</span><span style="font-size:0.57rem;color:rgba(255,255,255,0.45);padding:5px 10px;border-radius:24px;font-family:Syne,sans-serif;font-weight:600;text-transform:uppercase;">Services</span><span style="font-size:0.57rem;color:rgba(255,255,255,0.45);padding:5px 10px;border-radius:24px;font-family:Syne,sans-serif;font-weight:600;text-transform:uppercase;">About</span><span style="font-size:0.57rem;color:rgba(255,255,255,0.45);padding:5px 10px;border-radius:24px;font-family:Syne,sans-serif;font-weight:600;text-transform:uppercase;">Contact</span></div></div>`),
    card('Navbar','Transparent Overlay','Hero',`<div style="background:linear-gradient(180deg,rgba(0,229,255,0.04) 0%,transparent 100%);height:100%;"><div class="np" style="padding:15px 18px;background:transparent;"><span class="np-logo">BRAND</span><div class="np-links"><span>Home</span><span>Services</span><span>Contact</span></div></div></div>`),
    card('Navbar','Underline Active','Editorial',nbg(`<div class="np" style="padding:13px 18px;background:#080808;border-bottom:1px solid rgba(255,255,255,0.05);"><span class="np-logo">BRAND</span><div class="np-links"><span>Home</span><span style="color:#fff;border-bottom:2px solid #00e5ff;padding-bottom:4px;">Services</span><span>About</span><span>Contact</span></div></div>`)),
    card('Navbar','Double Row','Full Featured',nbg(`<div style="padding:7px 18px;background:#0a0a0a;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;justify-content:flex-end;gap:12px;"><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);font-family:Syne,sans-serif;">+353 87 000 0000</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);font-family:Syne,sans-serif;">hello@brand.ie</span></div><div class="np" style="padding:11px 18px;background:#111;border-bottom:1px solid rgba(255,255,255,0.06);"><span class="np-logo" style="color:#00e5ff;">BRAND</span><div class="np-links"><span>Home</span><span>Services</span><span>About</span></div><span class="np-cta" style="background:#00e5ff;color:#000;">Contact</span></div>`)),
    card('Navbar','Announcement Bar','Marketing',nbg(`<div style="background:#00e5ff;padding:5px 18px;text-align:center;font-size:0.58rem;color:#000;font-family:Syne,sans-serif;font-weight:700;letter-spacing:0.06em;">🎉 Serving clients across Ireland — Get a free quote today</div><div class="np" style="padding:11px 18px;background:#0d0d0d;border-bottom:1px solid rgba(255,255,255,0.07);"><span class="np-logo">BRAND</span><div class="np-links"><span>Home</span><span>Services</span><span>Contact</span></div></div>`)),
    card('Navbar','Mega Menu','Enterprise',`<div style="background:#06060e;height:100%;display:flex;flex-direction:column;"><div class="np" style="padding:11px 18px;border-bottom:1px solid rgba(255,255,255,0.06);background:#0d0d0d;"><span class="np-logo">BRAND</span><div class="np-links"><span style="color:#00e5ff;">Services ▾</span><span>About</span><span>Contact</span></div></div><div style="background:rgba(0,0,0,0.9);padding:12px 18px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;"><div><div style="font-family:Syne,sans-serif;font-size:0.58rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#00e5ff;margin-bottom:4px;">Security</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.4);line-height:1.8;">CCTV Systems<br>Alarm Systems<br>Access Control</div></div><div><div style="font-family:Syne,sans-serif;font-size:0.58rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#00e5ff;margin-bottom:4px;">Monitoring</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.4);line-height:1.8;">24/7 Response<br>Mobile Alerts<br>Remote View</div></div><div><div style="font-family:Syne,sans-serif;font-size:0.58rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#00e5ff;margin-bottom:4px;">Support</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.4);line-height:1.8;">Installation<br>Maintenance<br>Emergency</div></div></div></div>`),
    card('Navbar','Full-Screen Overlay','Dramatic',`<div style="background:#030303;height:100%;display:flex;flex-direction:column;"><div class="np" style="padding:13px 18px;border-bottom:1px solid rgba(255,255,255,0.05);"><span class="np-logo">BRAND</span><div style="font-family:Syne,sans-serif;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.4);">☰ MENU</div></div><div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:2.2rem;letter-spacing:0.06em;color:rgba(255,255,255,0.85);">Home</div><div style="font-family:'Bebas Neue',sans-serif;font-size:2.2rem;letter-spacing:0.06em;color:#00e5ff;">Services</div><div style="font-family:'Bebas Neue',sans-serif;font-size:2.2rem;letter-spacing:0.06em;color:rgba(255,255,255,0.85);">About</div><div style="font-family:'Bebas Neue',sans-serif;font-size:2.2rem;letter-spacing:0.06em;color:rgba(255,255,255,0.85);">Contact</div></div></div>`),
    card('Navbar','Bottom Dock','App Style',`<div style="background:#060608;height:100%;position:relative;"><div style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:4px;background:rgba(255,255,255,0.06);backdrop-filter:blur(12px);padding:6px;border-radius:16px;border:1px solid rgba(255,255,255,0.08);"><div style="width:36px;height:36px;border-radius:10px;background:rgba(0,229,255,0.15);display:flex;align-items:center;justify-content:center;font-size:0.65rem;">🏠</div><div style="width:36px;height:36px;border-radius:10px;background:rgba(0,229,255,0.08);display:flex;align-items:center;justify-content:center;font-size:0.65rem;">🔒</div><div style="width:36px;height:36px;border-radius:10px;background:rgba(0,229,255,0.08);display:flex;align-items:center;justify-content:center;font-size:0.65rem;">📋</div><div style="width:36px;height:36px;border-radius:10px;background:rgba(255,51,102,0.15);display:flex;align-items:center;justify-content:center;font-size:0.65rem;">📞</div></div></div>`),
    card('Navbar','Scroll-Transform','Smart',`<div style="background:#060608;height:100%;position:relative;overflow:hidden;"><div style="padding:13px 18px;background:rgba(6,6,8,0.1);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:space-between;"><span class="np-logo" style="font-size:0.7rem;">BRAND</span><div class="np-links" style="gap:10px;"><span>Home</span><span>Services</span><span>Contact</span></div></div><div style="position:absolute;bottom:0;left:0;right:0;padding:7px 10px;background:rgba(8,8,12,0.95);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;"><span class="np-logo" style="font-size:0.55rem;">BRAND</span><div class="np-links" style="gap:8px;"><span style="font-size:0.52rem;">Home</span><span style="font-size:0.52rem;">Services</span><span style="font-size:0.52rem;">Contact</span></div></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:0.58rem;color:rgba(255,255,255,0.25);font-family:Syne,sans-serif;text-align:center;letter-spacing:0.1em;text-transform:uppercase;">Shrinks on scroll</div></div>`),
  ].join('');
}

function buildHeroesGrid() {
  const el = document.getElementById('heroes-grid'); if(!el) return;
  el.innerHTML = [
    card('Hero Section','Centred Minimal','Classic',`<div style="background:#050505;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6px;padding:16px;"><span style="font-size:0.6rem;color:#00e5ff;letter-spacing:0.28em;text-transform:uppercase;font-family:Syne,sans-serif;font-weight:700;">Welcome</span><span style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:0.07em;">YOUR BRAND</span><div style="width:32px;height:2px;background:#00e5ff;"></div><span style="font-size:0.6rem;color:rgba(255,255,255,0.4);max-width:160px;line-height:1.5;">Professional services for modern businesses</span></div>`),
    card('Hero Section','Split Layout','Modern',`<div style="display:grid;grid-template-columns:1fr 1fr;height:100%;background:#050508;"><div style="padding:16px;display:flex;flex-direction:column;justify-content:center;gap:5px;"><span style="font-size:0.6rem;color:#00e5ff;letter-spacing:0.22em;text-transform:uppercase;font-family:Syne,sans-serif;">Est. 2024</span><span style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;line-height:0.93;">WE BUILD<br><span style="color:#00e5ff;">THINGS</span></span><span style="font-size:0.58rem;color:rgba(255,255,255,0.45);">Professional services</span><span style="font-size:0.56rem;padding:5px 11px;border-radius:3px;font-family:Syne,sans-serif;font-weight:700;text-transform:uppercase;width:fit-content;background:#00e5ff;color:#000;margin-top:6px;">Get Started</span></div><div style="background:linear-gradient(135deg,#0a0a20,#180535);display:flex;align-items:center;justify-content:center;"><div style="width:60px;height:60px;border-radius:50%;background:rgba(0,229,255,0.12);border:1px solid rgba(0,229,255,0.25);animation:pulseAnim 2.5s ease-in-out infinite;"></div></div></div>`),
    card('Hero Section','Bold Typography','Impactful',`<div style="background:#030303;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:16px;position:relative;overflow:hidden;"><span style="position:absolute;font-family:'Bebas Neue',sans-serif;font-size:7rem;color:rgba(255,255,255,0.025);top:-10px;right:-8px;line-height:1;user-select:none;">01</span><span style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;line-height:0.93;">WE ARE<br><span style="color:#00e5ff;">DIFFERENT</span></span><span style="font-size:0.58rem;color:rgba(255,255,255,0.4);margin-top:4px;">Security solutions you can trust</span></div>`),
    card('Hero Section','Typing Animation','Animated',`<div style="background:#050510;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;text-align:center;padding:16px;"><span style="font-size:0.6rem;color:#00e5ff;letter-spacing:0.18em;font-family:Syne,sans-serif;font-weight:700;">Welcome to</span><span style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;border-right:2px solid #00e5ff;padding-right:3px;white-space:nowrap;overflow:hidden;animation:typing 3.5s steps(10) infinite, blink 0.6s step-end infinite;width:0;">YOUR BRAND</span></div>`),
    card('Hero Section','Full-Bleed Editorial','Premium',`<div style="background:#f4efe6;height:100%;display:flex;flex-direction:column;padding:16px;justify-content:space-between;"><div style="font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;font-family:Syne,sans-serif;font-weight:700;color:rgba(0,0,0,0.4);">Est. 2024</div><div><div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#111;line-height:0.93;">YOUR BRAND<br><span style="color:#d2691e;">NAME</span></div><div style="width:32px;height:2px;background:#111;margin-top:6px;"></div></div><div style="font-size:0.58rem;color:rgba(0,0,0,0.45);">Professional services</div></div>`),
    card('Hero Section','Stats Hero','Trust Building',`<div style="background:#060608;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px;padding:16px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;letter-spacing:0.08em;color:rgba(255,255,255,0.4);">Trusted by Hundreds</div><div style="display:flex;gap:14px;"><div style="text-align:center;"><div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#00e5ff;line-height:1;animation:countPulse 3s ease-in-out infinite;">500+</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;">Clients</div></div><div style="text-align:center;"><div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#00e5ff;line-height:1;animation:countPulse 3s ease-in-out infinite 0.5s;">12yr</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;">Exp</div></div><div style="text-align:center;"><div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#00e5ff;line-height:1;animation:countPulse 3s ease-in-out infinite 1s;">24/7</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;">Support</div></div></div></div>`),
    card('Hero Section','Marquee Text','Striking',`<div style="background:#030303;height:100%;display:flex;flex-direction:column;justify-content:center;overflow:hidden;position:relative;"><div style="overflow:hidden;"><div style="white-space:nowrap;animation:marqueeScroll 8s linear infinite;"><span style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;color:rgba(255,255,255,0.08);margin-right:40px;">YOUR BRAND</span><span style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;color:rgba(0,229,255,0.2);margin-right:40px;">——</span><span style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;color:rgba(255,255,255,0.08);margin-right:40px;">YOUR BRAND</span><span style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;color:rgba(0,229,255,0.2);margin-right:40px;">——</span><span style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;color:rgba(255,255,255,0.08);margin-right:40px;">YOUR BRAND</span></div></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:0.08em;">Professional Services</div><div style="font-size:0.58rem;color:rgba(255,255,255,0.4);font-family:Syne,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">Ireland · Est. 2024</div></div></div>`),
    card('Hero Section','Diagonal Split','Dynamic',`<div style="height:100%;position:relative;overflow:hidden;background:#050505;"><div style="position:absolute;inset:0;clip-path:polygon(0 0,65% 0,50% 100%,0 100%);background:#0a0a14;display:flex;flex-direction:column;justify-content:center;padding:16px;gap:4px;"><span style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;line-height:0.93;">SHARP<br><span style="color:#00e5ff;">FOCUS</span></span><span style="font-size:0.58rem;color:rgba(255,255,255,0.4);">Professional security</span></div><div style="position:absolute;right:0;top:0;bottom:0;width:50%;background:linear-gradient(135deg,#0a0a20,#180535);"></div></div>`),
    card('Hero Section','Kinetic Type','Cutting Edge',`<div style="background:#000;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;overflow:hidden;position:relative;"><div style="position:absolute;font-family:'Bebas Neue',sans-serif;font-size:6rem;color:rgba(255,255,255,0.03);letter-spacing:0.02em;line-height:1;text-align:center;">SECURE<br>BRAND</div><div style="position:relative;text-align:center;"><div style="font-family:Syne,sans-serif;font-size:0.62rem;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#00e5ff;margin-bottom:8px;">CM Studio</div><div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:0.06em;animation:textGlow 2s ease-in-out infinite alternate;">YOUR BUSINESS</div><div style="width:40px;height:1px;background:#00e5ff;margin:8px auto;"></div><div style="font-size:0.6rem;color:rgba(255,255,255,0.4);">Made to be remembered</div></div></div>`),
    card('Hero Section','Cursor Reactive','Interactive',`<div style="background:linear-gradient(135deg,#060608,#0a0a18);height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:16px;position:relative;overflow:hidden;"><div style="position:absolute;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(0,229,255,0.12),transparent);animation:cursorGlow 3s ease-in-out infinite alternate;top:30%;left:40%;transform:translate(-50%,-50%);"></div><div style="position:relative;text-align:center;"><div style="font-size:0.6rem;color:#00e5ff;letter-spacing:0.2em;text-transform:uppercase;font-family:Syne,sans-serif;margin-bottom:6px;">Move your cursor</div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.5rem;letter-spacing:0.06em;">REACTIVE HERO</div><div style="font-size:0.58rem;color:rgba(255,255,255,0.35);margin-top:4px;">Background responds to mouse position</div></div></div>`),
    card('Hero Section','Bento Grid','Modern',`<div style="background:#060608;height:100%;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4px;padding:8px;"><div style="grid-column:1;grid-row:1/3;background:#0d0d16;border-radius:6px;padding:12px;display:flex;flex-direction:column;justify-content:flex-end;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:#00e5ff;line-height:0.95;">WE BUILD<br>THINGS</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.3);margin-top:4px;">Professional web design</div></div><div style="background:#0d0d16;border-radius:6px;padding:10px;display:flex;align-items:center;gap:6px;"><div style="width:20px;height:20px;border-radius:50%;background:rgba(0,229,255,0.2);flex-shrink:0;"></div><div style="font-size:0.62rem;color:rgba(255,255,255,0.5);font-family:Syne,sans-serif;font-weight:600;">500+ clients</div></div><div style="background:#0d0d16;border-radius:6px;padding:10px;display:flex;align-items:center;justify-content:center;"><div style="font-size:0.58rem;padding:4px 10px;background:#00e5ff;color:#000;border-radius:20px;font-family:Syne,sans-serif;font-weight:700;">Get Quote →</div></div></div>`),
    card('Hero Section','Scrollytelling','Narrative',`<div style="background:#030303;height:100%;display:flex;flex-direction:column;padding:12px;overflow:hidden;"><div style="flex:1;display:flex;flex-direction:column;justify-content:flex-start;gap:5px;"><div style="font-family:Syne,sans-serif;font-size:0.55rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#00e5ff;">Chapter 01</div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:0.04em;line-height:1;">THE PROBLEM</div><div style="width:20px;height:1px;background:#00e5ff;margin:4px 0;"></div><div style="font-size:0.58rem;color:rgba(255,255,255,0.35);line-height:1.6;">Every business needs a strong online presence. Most websites fail to convert.</div></div><div style="display:flex;flex-direction:column;gap:5px;border-top:1px solid rgba(255,255,255,0.06);padding-top:8px;"><div style="height:3px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;"><div style="height:100%;background:#00e5ff;width:20%;border-radius:2px;"></div></div><div style="font-size:0.55rem;color:rgba(255,255,255,0.25);font-family:Syne,sans-serif;letter-spacing:0.08em;">SCROLL TO CONTINUE</div></div></div>`),
    card('Hero Section','Asymmetric Grid','Editorial',`<div style="background:#050505;height:100%;display:grid;grid-template-columns:3fr 2fr;overflow:hidden;"><div style="padding:14px;display:flex;flex-direction:column;justify-content:center;gap:5px;border-right:1px solid rgba(255,255,255,0.05);"><div style="font-size:0.55rem;letter-spacing:0.25em;text-transform:uppercase;font-family:Syne,sans-serif;font-weight:700;color:rgba(255,255,255,0.3);">2024 —</div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;line-height:0.9;">WE BUILD<br><span style="color:#00e5ff;">BEAUTIFUL</span><br>WEBSITES</div></div><div style="padding:10px;display:flex;flex-direction:column;justify-content:space-between;"><div style="font-size:0.56rem;color:rgba(255,255,255,0.25);line-height:1.6;">Specialising in<br>web design &<br>development</div><div style="font-size:0.56rem;color:#00e5ff;font-family:Syne,sans-serif;font-weight:700;letter-spacing:0.06em;">Dublin, Ireland ↗</div></div></div>`),
    card('Hero Section','3D Depth','Dimensional',`<div style="background:linear-gradient(180deg,#060608 0%,#0a0a18 100%);height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;position:relative;overflow:hidden;"><div style="position:absolute;width:90px;height:90px;border-radius:12px;background:rgba(0,229,255,0.06);border:1px solid rgba(0,229,255,0.15);transform:perspective(400px) rotateX(20deg) rotateY(-15deg);box-shadow:0 20px 40px rgba(0,0,0,0.6),0 0 30px rgba(0,229,255,0.08);"></div><div style="position:relative;text-align:center;margin-top:60px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:0.08em;">BRAND NAME</div><div style="font-size:0.58rem;color:rgba(255,255,255,0.35);font-family:Syne,sans-serif;margin-top:4px;">Web Design Studio</div></div></div>`),
    card('Hero Section','Full Screen Reveal','Cinematic',`<div style="background:#000;height:100%;display:flex;align-items:flex-end;padding:16px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.2) 60%,transparent 100%);"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;border:2px solid rgba(255,255,255,0.4);border-radius:50%;display:flex;align-items:center;justify-content:center;"><span style="font-size:0.7rem;margin-left:3px;">▶</span></div><div style="position:relative;z-index:1;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:0.06em;">YOUR STORY</div><div style="font-size:0.6rem;color:rgba(255,255,255,0.5);font-family:Syne,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">Scroll to explore</div></div></div>`),
  ].join('');
}

function buildColorsGrid() {
  const el = document.getElementById('colors-grid'); if(!el) return;
  const schemes = [
    ['Charcoal + Cyan','Dark / Tech','cyan'],['Navy + Gold','Premium','gold'],
    ['Black + White','Minimal','mono'],['Dark + Red','Bold','red'],
    ['Slate + Emerald','Fresh','emerald'],['Dark Forest','Natural','forest'],
    ['Deep Purple + Violet','Creative','violet'],['Copper + Orange','Warm','copper'],
    ['Midnight + Pink','Vibrant','pink'],['Ocean Dark + Teal','Cool','teal'],
  ];
  el.innerHTML = schemes.map(([label,tag,cls]) => `
    <div class="preview-card cs-${cls}" data-category="Colour Scheme" data-label="${label}" onclick="toggleSelect(this)">
      <div class="pw cs-${cls}">
        <div class="cs-preview-wrap">
          <div class="cs-demo"><div class="cd-nav"></div><div class="cd-t"></div><div class="cd-s"></div><div class="cd-b"></div></div>
          <div class="cs-swatches-row"><div class="csw"></div><div class="csw"></div><div class="csw"></div><div class="csw"></div></div>
        </div>
      </div>
      <div class="card-foot"><span class="cl">${label}</span><span class="ct">${tag}</span></div>
    </div>`).join('');
}

function buildCardsGrid() {
  const el = document.getElementById('cards-grid'); if(!el) return;
  const cbg = `<div class="cards-preview-bg">`;
  const dci = `<div class="dci" style="background:rgba(0,229,255,0.15);border:1px solid rgba(0,229,255,0.3);"></div>`;
  el.innerHTML = [
    card('Card Style','Glass Morphism','Modern',`${cbg}<div class="dc" style="background:rgba(255,255,255,0.045);border:1px solid rgba(255,255,255,0.09);backdrop-filter:blur(10px);padding:14px;">${dci}<div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Bordered Minimal','Clean',`${cbg}<div class="dc" style="border:1px solid rgba(255,255,255,0.1);background:#0d0d0d;padding:14px;"><div class="dcline" style="background:#00e5ff;"></div><div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Gradient Border','Premium',`${cbg}<div class="dc" style="background:linear-gradient(#0d0d0d,#0d0d0d) padding-box,linear-gradient(135deg,#00e5ff,#ff3366) border-box;border:1px solid transparent;padding:14px;">${dci}<div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Accent Header','Structured',`${cbg}<div class="dc" style="background:#0d0d0d;"><div style="background:linear-gradient(135deg,rgba(0,229,255,0.1),rgba(0,229,255,0.03));height:34px;border-bottom:1px solid rgba(0,229,255,0.18);"></div><div style="padding:10px 14px;"><div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div></div>`),
    card('Card Style','Flat Numbered','Editorial',`${cbg}<div class="dc" style="background:#111;padding:14px;"><div class="dcnum">01</div><div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Glow Hover','Interactive',`${cbg}<div class="dc" style="background:#0a0a12;border:1px solid rgba(80,80,200,0.12);padding:14px;box-shadow:0 0 20px rgba(0,229,255,0.06);">${dci}<div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Image Card','Visual',`${cbg}<div class="dc" style="background:#0d0d0d;overflow:hidden;"><div style="height:65px;background:linear-gradient(135deg,#0a0a20,#180535);display:flex;align-items:center;justify-content:center;font-size:1.3rem;opacity:0.5;">📷</div><div style="padding:10px 14px;"><div class="dct">Service Title</div><div class="dcd">Brief description of service.</div></div></div></div>`),
    card('Card Style','Horizontal','Compact',`${cbg}<div style="width:100%;max-width:210px;background:#0d0d0d;border:1px solid rgba(255,255,255,0.08);display:flex;gap:10px;padding:12px;align-items:center;border-radius:7px;"><div style="width:34px;height:34px;border-radius:8px;background:rgba(0,229,255,0.15);border:1px solid rgba(0,229,255,0.3);flex-shrink:0;"></div><div><div class="dct">Service</div><div class="dcd">Brief description here.</div></div></div></div>`),
    card('Card Style','Pricing Card','Sales',`${cbg}<div class="dc" style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.1);padding:14px;text-align:center;"><div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#00e5ff;line-height:1;margin-bottom:3px;">€299</div><div style="font-size:0.54rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;">Per Month</div><div class="dct" style="margin-top:8px;">Starter Package</div><div class="dcd">Everything you need.</div></div></div>`),
    card('Card Style','Dark Outline','Sharp',`${cbg}<div class="dc" style="border:2px solid rgba(255,255,255,0.15);background:transparent;padding:14px;border-radius:7px;"><div style="width:26px;height:2px;background:#fff;margin-bottom:9px;"></div><div class="dct">Service Title</div><div class="dcd">Brief description of what this service includes.</div></div></div>`),
    card('Card Style','Bento Cell','Apple-Style',`${cbg}<div style="width:100%;max-width:210px;display:grid;grid-template-columns:1fr 1fr;gap:5px;"><div style="grid-column:1/-1;background:#0d0d0d;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px;"><div style="width:28px;height:28px;border-radius:6px;background:rgba(0,229,255,0.15);margin-bottom:7px;"></div><div class="dct">Main Service</div><div class="dcd">Primary feature card.</div></div><div style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:#00e5ff;line-height:1;">24/7</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.3);">Support</div></div><div style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:#4ade80;line-height:1;">500+</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.3);">Clients</div></div></div></div>`),
    card('Card Style','Testimonial','Trust',`${cbg}<div class="dc" style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.08);padding:14px;"><div style="font-size:1rem;color:#00e5ff;margin-bottom:6px;">"</div><div style="font-size:0.72rem;color:rgba(255,255,255,0.6);line-height:1.6;font-style:italic;margin-bottom:10px;">Absolutely brilliant service.</div><div style="display:flex;align-items:center;gap:7px;"><div style="width:22px;height:22px;border-radius:50%;background:rgba(0,229,255,0.2);flex-shrink:0;"></div><div><div style="font-size:0.65rem;font-family:Syne,sans-serif;font-weight:700;">John Murphy</div><div style="font-size:0.58rem;color:rgba(255,255,255,0.3);">Dublin Business Owner</div></div></div></div></div>`),
    card('Card Style','Stat Card','Metrics',`${cbg}<div class="dc" style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.08);padding:14px;text-align:center;"><div style="font-size:0.58rem;color:rgba(255,255,255,0.3);letter-spacing:0.1em;text-transform:uppercase;font-family:Syne,sans-serif;margin-bottom:4px;">Projects Completed</div><div style="font-family:'Bebas Neue',sans-serif;font-size:3rem;color:#00e5ff;line-height:1;animation:countPulse 3s ease-in-out infinite;">247+</div><div style="font-size:0.6rem;color:rgba(255,255,255,0.3);margin-top:4px;">Since 2019</div></div></div>`),
    card('Card Style','Timeline Card','Process',`${cbg}<div style="width:100%;max-width:210px;display:flex;flex-direction:column;gap:0;">${[['Discovery','We learn about your business.'],['Design','Build your visual identity.']].map(([t,d],i)=>`<div style="display:flex;gap:8px;align-items:flex-start;padding:8px 0;"><div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;"><div style="width:18px;height:18px;border-radius:50%;${i===0?'background:#00e5ff;color:#000;':'border:1.5px solid rgba(0,229,255,0.3);color:rgba(255,255,255,0.5);'}display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:700;">${i+1}</div>${i===0?'<div style="width:1px;height:20px;background:rgba(0,229,255,0.2);"></div>':''}</div><div><div style="font-family:Syne,sans-serif;font-size:0.72rem;font-weight:700;${i>0?'color:rgba(255,255,255,0.5);':''}">${t}</div><div class="dcd" style="${i>0?'color:rgba(255,255,255,0.25);':''}">${d}</div></div></div>`).join('')}</div></div>`),
  ].join('');
}

function buildFootersGrid() {
  const el = document.getElementById('footers-grid'); if(!el) return;
  const fbg = `<div class="footer-preview-bg">`;
  el.innerHTML = [
    card('Footer','3 Column','Full',`${fbg}<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:12px;background:#0d0d0d;border-top:1px solid rgba(255,255,255,0.05);width:100%;"><div style="display:flex;flex-direction:column;gap:3px;"><span style="font-family:Syne,sans-serif;font-size:0.57rem;font-weight:700;color:#fff;margin-bottom:1px;">BRAND</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">About</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">Services</span></div><div style="display:flex;flex-direction:column;gap:3px;"><span style="font-family:Syne,sans-serif;font-size:0.57rem;font-weight:700;color:#fff;margin-bottom:1px;">LINKS</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">Privacy</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">Terms</span></div><div style="display:flex;flex-direction:column;gap:3px;"><span style="font-family:Syne,sans-serif;font-size:0.57rem;font-weight:700;color:#fff;margin-bottom:1px;">CONTACT</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">hello@brand.ie</span><span style="font-size:0.55rem;color:rgba(255,255,255,0.3);">+353 87 000 0000</span></div></div></div>`),
    card('Footer','Minimal Row','Clean',`${fbg}<div style="display:flex;align-items:center;justify-content:space-between;padding:13px 15px;background:#080808;border-top:1px solid rgba(255,255,255,0.05);font-size:0.56rem;color:rgba(255,255,255,0.3);width:100%;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;color:#fff;letter-spacing:0.1em;">BRAND</span><div style="display:flex;gap:10px;"><span>Privacy</span><span>Terms</span><span>Contact</span></div><span>© 2025</span></div></div>`),
    card('Footer','Big Logo','Bold',`${fbg}<div style="background:#080808;border-top:1px solid rgba(255,255,255,0.05);width:100%;"><div style="padding:12px;"><span style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;color:rgba(255,255,255,0.06);letter-spacing:0.04em;">BRAND NAME</span></div><div style="padding:7px 12px;border-top:1px solid rgba(255,255,255,0.04);font-size:0.54rem;color:rgba(255,255,255,0.22);display:flex;justify-content:space-between;"><span>© 2025 Brand Name Ltd.</span><span>Privacy · Terms</span></div></div></div>`),
    card('Footer','Accent Strip','On-brand',`${fbg}<div style="background:#080808;width:100%;"><div style="background:rgba(0,229,255,0.035);padding:11px 13px;border-bottom:1px solid rgba(0,229,255,0.1);display:flex;justify-content:space-between;align-items:center;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.9rem;color:#00e5ff;letter-spacing:0.1em;">BRAND</span><div style="display:flex;gap:10px;"><span style="font-size:0.54rem;color:rgba(255,255,255,0.38);font-family:Syne,sans-serif;">Services</span><span style="font-size:0.54rem;color:rgba(255,255,255,0.38);font-family:Syne,sans-serif;">About</span></div></div><div style="padding:7px 13px;font-size:0.54rem;color:rgba(255,255,255,0.2);">© 2025 Brand Name. All rights reserved.</div></div></div>`),
    card('Footer','Newsletter','Engagement',`${fbg}<div style="background:#080808;border-top:1px solid rgba(255,255,255,0.05);width:100%;padding:12px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;letter-spacing:0.1em;">BRAND</span><div style="display:flex;gap:5px;"><div style="width:16px;height:16px;border-radius:4px;background:rgba(255,255,255,0.06);"></div><div style="width:16px;height:16px;border-radius:4px;background:rgba(255,255,255,0.06);"></div></div></div><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:4px;padding:6px 9px;font-size:0.56rem;color:rgba(255,255,255,0.25);display:flex;justify-content:space-between;align-items:center;"><span>Your email</span><span style="font-size:0.53rem;background:#00e5ff;color:#000;padding:2px 7px;border-radius:3px;font-family:Syne,sans-serif;font-weight:700;">Join</span></div></div></div>`),
    card('Footer','Map + Contact','Local',`${fbg}<div style="background:#080808;border-top:1px solid rgba(255,255,255,0.05);width:100%;display:flex;"><div style="padding:12px;flex:1;display:flex;flex-direction:column;gap:4px;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;letter-spacing:0.1em;">BRAND</span><div style="font-size:0.54rem;color:rgba(255,255,255,0.3);line-height:1.6;">123 Main Street<br>Dublin, Ireland<br>+353 1 000 0000</div></div><div style="width:75px;background:linear-gradient(135deg,#0a1020,#0a2010);border-left:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;font-size:1.1rem;opacity:0.4;">📍</div></div></div>`),
    card('Footer','Wave Divider','Organic',`${fbg}<div style="background:#080808;width:100%;position:relative;"><svg viewBox="0 0 400 30" style="display:block;width:100%;" preserveAspectRatio="none"><path d="M0,20 Q100,5 200,20 T400,20 L400,30 L0,30 Z" fill="#0d0d0d"/></svg><div style="padding:8px 13px;display:flex;justify-content:space-between;align-items:center;background:#0d0d0d;"><span style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;color:#00e5ff;">BRAND</span><span style="font-size:0.54rem;color:rgba(255,255,255,0.2);">© 2025</span></div></div></div>`),
    card('Footer','Agency Statement','Oversized',`${fbg}<div style="background:#080808;width:100%;border-top:1px solid rgba(255,255,255,0.05);"><div style="padding:14px 13px;"><span style="font-family:'Bebas Neue',sans-serif;font-size:1.5rem;color:rgba(255,255,255,0.07);letter-spacing:0.03em;display:block;">LET'S BUILD<br>SOMETHING</span></div><div style="padding:6px 13px;border-top:1px solid rgba(255,255,255,0.04);display:flex;justify-content:space-between;font-size:0.53rem;color:rgba(255,255,255,0.2);"><span>hello@brand.ie</span><span>© 2025</span></div></div></div>`),
    card('Footer','Full Bleed Colour','Vibrant',`${fbg}<div style="background:#00e5ff;width:100%;padding:14px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#000;letter-spacing:0.08em;margin-bottom:4px;">BRAND NAME</div><div style="font-size:0.56rem;color:rgba(0,0,0,0.6);line-height:1.6;">hello@brand.ie · +353 87 000 0000</div><div style="margin-top:7px;font-size:0.52rem;color:rgba(0,0,0,0.4);">© 2025 Brand Name Ltd.</div></div></div>`),
    card('Footer','Trust Badges','Credibility',`${fbg}<div style="background:#080808;border-top:1px solid rgba(255,255,255,0.05);width:100%;padding:10px 13px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;color:#fff;margin-bottom:7px;">BRAND</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">${['SSL','ISO','GDPR','Google'].map(b=>`<div style="font-size:0.5rem;padding:2px 7px;border:1px solid rgba(255,255,255,0.12);border-radius:3px;color:rgba(255,255,255,0.4);font-family:Syne,sans-serif;font-weight:600;">${b}</div>`).join('')}</div><div style="font-size:0.52rem;color:rgba(255,255,255,0.2);">© 2025 · Privacy · Terms</div></div></div>`),
    card('Footer','Chat CTA','Conversational',`${fbg}<div style="background:#080808;border-top:1px solid rgba(255,255,255,0.05);width:100%;padding:12px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;margin-bottom:6px;">HAVE A PROJECT?</div><div style="font-size:0.62rem;color:rgba(255,255,255,0.4);margin-bottom:8px;line-height:1.5;">We'd love to hear about it.</div><div style="display:flex;gap:5px;"><div style="font-size:0.57rem;padding:5px 10px;background:#00e5ff;color:#000;border-radius:5px;font-family:Syne,sans-serif;font-weight:700;">Get in Touch</div><div style="font-size:0.57rem;padding:5px 10px;background:#25D366;color:#fff;border-radius:5px;font-family:Syne,sans-serif;font-weight:700;">WhatsApp</div></div></div></div>`),
    card('Footer','Startup Minimal','Understated',`${fbg}<div style="background:#040404;border-top:1px solid rgba(255,255,255,0.04);width:100%;display:flex;align-items:center;justify-content:center;padding:16px;"><div style="text-align:center;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:0.12em;color:rgba(255,255,255,0.4);">BRAND</div><div style="font-size:0.52rem;color:rgba(255,255,255,0.2);margin-top:3px;">© 2025 · Made with ♥ in Ireland</div></div></div></div>`),
    card('Footer','Social Heavy','Community',`${fbg}<div style="background:#080808;border-top:1px solid rgba(255,255,255,0.05);width:100%;padding:12px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:0.85rem;margin-bottom:7px;">FOLLOW US</div><div style="display:flex;gap:6px;margin-bottom:7px;">${['ig','fb','li','tw','yt'].map(s=>`<div style="width:24px;height:24px;border-radius:6px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:0.58rem;color:rgba(255,255,255,0.4);">${s}</div>`).join('')}</div><div style="font-size:0.52rem;color:rgba(255,255,255,0.2);">© 2025 Brand Name Ltd. All rights reserved.</div></div></div>`),
  ].join('');
}

function buildFormsGrid() {
  const el = document.getElementById('forms-grid'); if(!el) return;
  const fbg = `<div class="form-preview-bg">`;
  el.innerHTML = [
    card('Contact Form','Minimal Floating Label','Elegant',`${fbg}<div class="dform"><div class="dft">Get in Touch</div>${[['Name','John Smith'],['Email','john@email.com'],['Message',"Hi, I'd like to..."]].map(([l,p])=>`<div style="border-bottom:1px solid rgba(255,255,255,0.13);padding:5px 0;font-size:0.62rem;color:rgba(255,255,255,0.38);"><span style="display:block;font-size:0.5rem;color:rgba(255,255,255,0.28);margin-bottom:1px;letter-spacing:0.06em;text-transform:uppercase;">${l}</span>${p}</div>`).join('')}<div class="dfb" style="background:#fff;color:#000;border-radius:2px;margin-top:3px;">Send Message</div></div></div>`),
    card('Contact Form','Boxed Dark','Professional',`${fbg}<div class="dform"><div class="dft">Get in Touch</div>${['Your name','Your email','Your message'].map(f=>`<div class="dff" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 9px;border-radius:4px;">${f}</div>`).join('')}<div class="dfb" style="background:#00e5ff;color:#000;border-radius:4px;">Send Message</div></div></div>`),
    card('Contact Form','Outlined Accent','Sharp',`${fbg}<div class="dform"><div class="dft">Get in Touch</div>${['Your name','Your email','Your message'].map(f=>`<div class="dff" style="border:1px solid rgba(0,229,255,0.18);padding:6px 9px;border-radius:4px;background:transparent;">${f}</div>`).join('')}<div class="dfb" style="background:transparent;border:1px solid #00e5ff;color:#00e5ff;border-radius:4px;">Send Message</div></div></div>`),
    card('Contact Form','Split Layout','Spacious',`${fbg}<div style="width:100%;max-width:240px;display:grid;grid-template-columns:1fr 1fr;gap:6px;"><div style="grid-column:1/-1;font-family:Syne,sans-serif;font-size:0.77rem;font-weight:700;margin-bottom:2px;">Get in Touch</div><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:5px 8px;font-size:0.6rem;color:rgba(255,255,255,0.3);border-radius:4px;">First name</div><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:5px 8px;font-size:0.6rem;color:rgba(255,255,255,0.3);border-radius:4px;">Last name</div><div style="grid-column:1/-1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:5px 8px;font-size:0.6rem;color:rgba(255,255,255,0.3);border-radius:4px;">Email</div><div style="grid-column:1/-1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:5px 8px;font-size:0.6rem;color:rgba(255,255,255,0.3);border-radius:4px;">Message</div><div style="grid-column:1/-1;background:#00e5ff;color:#000;font-size:0.6rem;padding:7px;font-family:Syne,sans-serif;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-align:center;border-radius:4px;">Send</div></div></div>`),
    card('Contact Form','Multi-Step','Guided',`${fbg}<div class="dform"><div class="dft">Get in Touch</div><div style="display:flex;gap:5px;align-items:center;margin-bottom:6px;">${[1,2,3].map((n,i)=>`<div style="width:20px;height:20px;border-radius:50%;${i===0?'border:1.5px solid #00e5ff;color:#00e5ff;':'border:1.5px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.35);'}display:flex;align-items:center;justify-content:center;font-size:0.53rem;font-family:Syne,sans-serif;font-weight:700;flex-shrink:0;">${n}</div>${i<2?'<div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>':''}`).join('')}</div><div class="dff" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 9px;border-radius:4px;">Your full name</div><div class="dff" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 9px;border-radius:4px;">Your email</div><div class="dfb" style="background:#00e5ff;color:#000;border-radius:4px;">Next →</div></div></div>`),
    card('Contact Form','Glow Focus','Interactive',`${fbg}<div class="dform"><div class="dft">Get in Touch</div><div style="border:1px solid rgba(0,229,255,0.35);padding:6px 9px;border-radius:4px;background:rgba(0,229,255,0.04);box-shadow:0 0 12px rgba(0,229,255,0.1);font-size:0.62rem;color:rgba(255,255,255,0.5);">Your name</div><div style="border:1px solid rgba(0,229,255,0.15);padding:6px 9px;border-radius:4px;font-size:0.62rem;color:rgba(255,255,255,0.3);">Your email</div><div style="border:1px solid rgba(0,229,255,0.15);padding:6px 9px;border-radius:4px;font-size:0.62rem;color:rgba(255,255,255,0.3);">Your message</div><div class="dfb" style="background:linear-gradient(135deg,#00e5ff,#0099bb);color:#000;border-radius:4px;">Send Message</div></div></div>`),
    card('Contact Form','WhatsApp CTA','Friendly',`${fbg}<div class="dform"><div class="dft">Get in Touch</div><div style="font-size:0.68rem;color:rgba(255,255,255,0.4);margin-bottom:8px;line-height:1.6;">We'll get back to you within hours.</div><div class="dff" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 9px;border-radius:4px;">Your email</div><div class="dff" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 9px;border-radius:4px;">Your message</div><div style="display:flex;gap:5px;margin-top:2px;"><div class="dfb" style="flex:1;background:#00e5ff;color:#000;border-radius:4px;font-size:0.57rem;padding:6px;">Email Us</div><div class="dfb" style="flex:1;background:#25D366;color:#fff;border-radius:4px;font-size:0.57rem;padding:6px;text-align:center;">WhatsApp</div></div></div></div>`),
    card('Contact Form','Side-by-Side Trust','Converts',`${fbg}<div style="width:100%;max-width:240px;display:grid;grid-template-columns:1fr 1fr;gap:6px;"><div style="display:flex;flex-direction:column;gap:6px;"><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:6px;padding:8px;"><div style="font-size:0.6rem;font-style:italic;color:rgba(255,255,255,0.5);line-height:1.4;margin-bottom:5px;">"Brilliant work"</div><div style="font-size:0.54rem;color:rgba(255,255,255,0.3);">— John M, Dublin</div></div><div style="display:flex;gap:3px;flex-wrap:wrap;">${['Google','GDPR','IE'].map(b=>`<div style="font-size:0.48rem;padding:2px 5px;border:1px solid rgba(255,255,255,0.1);border-radius:3px;color:rgba(255,255,255,0.35);">${b}</div>`).join('')}</div></div><div style="display:flex;flex-direction:column;gap:5px;"><div class="dft" style="font-size:0.72rem;">Quick Quote</div><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:5px 7px;font-size:0.58rem;color:rgba(255,255,255,0.3);border-radius:4px;">Name</div><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:5px 7px;font-size:0.58rem;color:rgba(255,255,255,0.3);border-radius:4px;">Email</div><div style="background:#00e5ff;color:#000;font-size:0.58rem;padding:6px;font-family:Syne,sans-serif;font-weight:700;text-align:center;border-radius:4px;">Send →</div></div></div></div>`),
    card('Contact Form','Book a Call','Calendly-Style',`${fbg}<div class="dform"><div class="dft">Book a Free Call</div><div style="font-size:0.65rem;color:rgba(255,255,255,0.35);margin-bottom:8px;">15 min · Free · No obligation</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:6px;">${['Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i)=>`<div style="background:${i===1?'#00e5ff':'rgba(255,255,255,0.04)'};border:1px solid ${i===1?'#00e5ff':'rgba(255,255,255,0.07)'};border-radius:4px;padding:4px;text-align:center;font-size:0.55rem;color:${i===1?'#000':'rgba(255,255,255,0.4)'};font-family:Syne,sans-serif;font-weight:600;">${d}</div>`).join('')}</div><div class="dff" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 9px;border-radius:4px;">Your email</div><div class="dfb" style="background:#00e5ff;color:#000;border-radius:4px;">Confirm Booking</div></div></div>`),
    card('Contact Form','Conversational','Typeform-Style',`${fbg}<div class="dform"><div style="font-size:0.6rem;color:#00e5ff;font-family:Syne,sans-serif;font-weight:700;letter-spacing:0.08em;margin-bottom:4px;">01 →</div><div class="dft" style="font-size:0.9rem;line-height:1.4;">What's your name?</div><div style="border-bottom:2px solid #00e5ff;padding:6px 0;font-size:0.72rem;color:rgba(255,255,255,0.5);margin-top:4px;">Sarah Johnson</div><div style="margin-top:10px;font-size:0.6rem;color:rgba(255,255,255,0.25);">Press Enter ↵ to continue</div><div style="margin-top:10px;display:flex;gap:4px;justify-content:flex-end;"><div style="font-size:0.57rem;padding:5px 11px;background:#00e5ff;color:#000;border-radius:4px;font-family:Syne,sans-serif;font-weight:700;">OK ✓</div></div></div></div>`),
    card('Contact Form','Glass Dark','Premium',`${fbg}<div class="dform" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(12px);border-radius:8px;padding:12px;"><div class="dft">Get in Touch</div>${['Your name','Your email','Your message'].map(f=>`<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);padding:6px 9px;border-radius:4px;font-size:0.62rem;color:rgba(255,255,255,0.3);">${f}</div>`).join('')}<div class="dfb" style="background:rgba(0,229,255,0.9);color:#000;border-radius:4px;">Send Message</div></div></div>`),
    card('Contact Form','Inline Quick','Minimal',`${fbg}<div class="dform"><div class="dft">Quick Message</div><div style="display:flex;gap:5px;margin-bottom:5px;"><div style="flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 8px;font-size:0.6rem;color:rgba(255,255,255,0.3);border-radius:4px;">Name</div><div style="flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 8px;font-size:0.6rem;color:rgba(255,255,255,0.3);border-radius:4px;">Email</div></div><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:6px 9px;border-radius:4px;font-size:0.62rem;color:rgba(255,255,255,0.3);margin-bottom:5px;">Quick message...</div><div class="dfb" style="background:#00e5ff;color:#000;border-radius:4px;">Send →</div></div></div>`),
  ].join('');
}

function buildAnimationsGrid() {
  const el = document.getElementById('animations-grid'); if(!el) return;
  
  // Auto-playing animation demos with looping animations
  const items = (animType) => `<div class="anim-demo-item ${animType}" style="padding:14px;margin:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;"><div style="font-family:'Bebas Neue',sans-serif;font-size:0.95rem;margin-bottom:4px;">Service Item</div><div style="font-size:0.6rem;color:rgba(255,255,255,0.4);">Scroll triggers this</div></div>`.repeat(3);
  
  el.innerHTML = [
    card('Scroll Animation','Fade In Up','Popular',`<div class="anim-preview-bg" style="padding:8px;position:relative;overflow:hidden;"><div style="position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:0.55rem;color:rgba(255,255,255,0.35);z-index:5;background:rgba(0,0,0,0.5);padding:2px 8px;border-radius:10px;">Auto-playing demo</div><div class="autoplay-fade-container" style="animation:containerPulse 3s ease-in-out infinite;">${items('fade-demo')}</div></div>`),
    card('Scroll Animation','Slide In Left','Dynamic',`<div class="anim-preview-bg" style="padding:8px;position:relative;overflow:hidden;"><div style="position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:0.55rem;color:rgba(255,255,255,0.35);z-index:5;background:rgba(0,0,0,0.5);padding:2px 8px;border-radius:10px;">Auto-playing demo</div><div class="autoplay-slide-container" style="animation:containerPulse 3s ease-in-out infinite 0.5s;">${items('slide-demo')}</div></div>`),
    card('Scroll Animation','Scale In','Subtle',`<div class="anim-preview-bg" style="padding:8px;position:relative;overflow:hidden;"><div style="position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:0.55rem;color:rgba(255,255,255,0.35);z-index:5;background:rgba(0,0,0,0.5);padding:2px 8px;border-radius:10px;">Auto-playing demo</div><div class="autoplay-scale-container" style="animation:containerPulse 3s ease-in-out infinite 1s;">${items('scale-demo')}</div></div>`),
    card('Scroll Animation','Count Up Numbers','Trust',`<div class="anim-preview-bg" style="flex-direction:row;gap:10px;flex-wrap:wrap;justify-content:center;position:relative;"><div class="count-item" style="animation:countPulse 2s ease-in-out infinite;"><div class="count-num">500+</div><div class="count-lbl">Clients</div></div><div class="count-item" style="animation:countPulse 2s ease-in-out infinite 0.3s;"><div class="count-num">12yr</div><div class="count-lbl">Exp</div></div><div class="count-item" style="animation:countPulse 2s ease-in-out infinite 0.6s;"><div class="count-num">24/7</div><div class="count-lbl">Support</div></div></div>`),
    card('Scroll Animation','Stagger Grid','Services',`<div class="anim-preview-bg" style="flex-direction:row;flex-wrap:wrap;gap:4px;padding:12px;position:relative;">${[1,2,3,4].map((i,d)=>`<div class="sg-item" style="animation:staggerPulse 2s ease-in-out infinite ${d*0.15}s;"><div class="sg-icon"></div><div class="sg-t">Item ${i}</div><div class="sg-d">Service</div></div>`).join('')}</div>`),
    card('Scroll Animation','Parallax Layers','Depth',`<div class="anim-preview-bg" style="position:relative;overflow:hidden;background:#030308;"><div class="parallax-layer" style="position:absolute;width:140%;height:140%;left:-20%;top:-20%;background:radial-gradient(circle at 40% 40%,rgba(0,229,255,0.12),transparent 60%);animation:parallaxMove 4s ease-in-out infinite;"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;z-index:2;"><div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:0.08em;">Parallax</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.35);font-family:Syne,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">Multi-layer depth</div></div></div>`),
    card('Scroll Animation','Text Reveal','Cinematic',`<div class="anim-preview-bg" style="align-items:flex-start;padding:16px;position:relative;overflow:hidden;"><div class="reveal-line" style="width:0;height:2px;background:#00e5ff;margin-bottom:12px;animation:lineGrow 2s ease-in-out infinite;"></div><div class="reveal-text" style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:0.06em;clip-path:inset(0 100% 0 0);animation:textReveal 2s ease-in-out infinite;">WE PROTECT</div><div class="reveal-text" style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:0.06em;margin-top:6px;clip-path:inset(0 100% 0 0);animation:textReveal 2s ease-in-out infinite 0.3s;">WHAT MATTERS</div></div>`),
    card('Scroll Animation','Horizontal Scroll','Immersive',`<div class="anim-preview-bg" style="position:relative;overflow:hidden;padding:10px;"><div style="display:flex;gap:6px;animation:horizontalScroll 4s ease-in-out infinite;">${[1,2,3,4,5].map(i=>`<div style="flex-shrink:0;width:70px;background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:8px;"><div style="font-family:Syne,sans-serif;font-size:0.65rem;font-weight:700;color:#00e5ff;margin-bottom:3px;">Panel ${i}</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.3);">Scroll</div></div>`).join('')}</div></div>`),
    card('Scroll Animation','Progress Bar','Orientation',`<div class="anim-preview-bg" style="flex-direction:column;align-items:stretch;padding:0;position:relative;"><div style="height:3px;background:rgba(255,255,255,0.06);width:100%;"><div style="height:100%;background:linear-gradient(90deg,#00e5ff,#0099bb);width:0%;animation:progressGrow 3s ease-in-out infinite;"></div></div><div style="padding:12px;flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px;">${[1,2,3].map(i=>`<div style="padding:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;font-size:0.7rem;">Content Item ${i}</div>`).join('')}</div></div>`),
    card('Scroll Animation','Sticky Sections','Showcase',`<div class="anim-preview-bg" style="flex-direction:row;gap:0;padding:0;position:relative;"><div style="width:50%;border-right:1px solid rgba(255,255,255,0.06);padding:10px;display:flex;flex-direction:column;justify-content:center;background:rgba(0,229,255,0.03);"><div style="font-family:'Bebas Neue',sans-serif;font-size:0.9rem;letter-spacing:0.06em;margin-bottom:4px;">STICKY</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.3);line-height:1.4;">Fixed while content scrolls</div></div><div style="width:50%;padding:10px;display:flex;flex-direction:column;gap:5px;animation:stickyScroll 3s ease-in-out infinite;">${[1,2,3,4].map(i=>`<div style="background:#111;border:1px solid rgba(255,255,255,0.06);border-radius:5px;padding:6px;font-size:0.58rem;color:rgba(255,255,255,0.4);">Feature ${i}</div>`).join('')}</div></div>`),
    card('Scroll Animation','Text Scramble','Technical',`<div class="anim-preview-bg" style="align-items:center;justify-content:center;position:relative;"><div style="text-align:center;"><div class="scramble-anim" style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:0.08em;color:#00e5ff;animation:textScramble 2.5s steps(8) infinite;">SECURITY</div><div style="font-size:0.55rem;color:rgba(255,255,255,0.3);font-family:Syne,sans-serif;letter-spacing:0.12em;text-transform:uppercase;margin-top:5px;">Text scrambles in</div></div></div>`),
    card('Scroll Animation','Image Reveal Wipe','Editorial',`<div class="anim-preview-bg" style="padding:12px;position:relative;"><div style="width:100%;height:85px;background:linear-gradient(135deg,#0a0a20,#180535);border-radius:6px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:#080808;animation:wipeReveal 2.5s ease-in-out infinite;"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:0.06em;color:rgba(255,255,255,0.6);">REVEAL</div></div></div>`),
    card('Scroll Animation','Morphing Shape','Organic',`<div class="anim-preview-bg" style="align-items:center;justify-content:center;position:relative;overflow:hidden;"><svg viewBox="0 0 100 100" style="width:90px;height:90px;animation:morphRotate 4s ease-in-out infinite;"><path class="morph-path" d="M50,10 Q80,10 90,50 Q80,90 50,90 Q20,90 10,50 Q20,10 50,10" fill="none" stroke="#00e5ff" stroke-width="1.5" opacity="0.5"/><circle cx="50" cy="50" r="25" fill="rgba(0,229,255,0.08)" stroke="#00e5ff" stroke-width="1"/></svg><div style="position:absolute;bottom:12px;font-size:0.58rem;color:rgba(255,255,255,0.35);font-family:Syne,sans-serif;">SVG morphs between shapes</div></div>`),
  ].join('');
}

// ══════════════════════════════════════
// FIX 3: LIVE PREVIEW — "Your Business"
// ══════════════════════════════════════
function updatePreviewLive() {
  const panel = document.getElementById('tab-generate');
  if (panel && panel.classList.contains('active')) buildPreviewPanel();
}

function buildPreviewPanel() {
  const container = document.getElementById('preview-container'); if(!container) return;
  const keys = Object.keys(selections);
  const chips = keys.map(k => `<div class="gen-chip"><span class="gc">${k}:</span>${selections[k]}</div>`).join('');
  if (!keys.length) {
    container.innerHTML = `<div class="gen-empty"><div class="gen-icon">✦</div><div class="gen-title">Live Preview</div><div class="gen-sub">Make selections from the tabs above, then come back here to see your site assembled in real time.</div></div>`;
    return;
  }
  container.innerHTML = `<div class="gen-empty" style="text-align:center;padding:1.5rem 0;"><div class="gen-chips">${chips}</div><button class="gen-btn" onclick="generatePreview()">Generate Live Preview</button><div class="gen-hint">${keys.length} selection${keys.length>1?'s':''} ready</div></div><div id="gen-preview-wrap" style="display:none;"></div>`;
}

function generatePreview() {
  const keys = Object.keys(selections); if (!keys.length) return;

  // FIX: pull from questionnaire or use generic placeholder
  const bizName = document.getElementById('q-biz')?.value?.trim() || 'Your Business';

  const scheme = selections['Colour Scheme'] || 'Charcoal + Cyan';
  const c = schemeColors[scheme] || schemeColors['Charcoal + Cyan'];
  const bg = selections['Background'] || 'Dark Grid';
  const anim = selections['Scroll Animation'] || 'Fade In Up';

  const animCSS = {
    'Fade In Up':    `.anim-el{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease}.anim-el.visible{opacity:1;transform:translateY(0)}`,
    'Slide In Left': `.anim-el{opacity:0;transform:translateX(-40px);transition:opacity 0.6s ease,transform 0.6s ease}.anim-el.visible{opacity:1;transform:translateX(0)}`,
    'Scale In':      `.anim-el{opacity:0;transform:scale(0.85);transition:opacity 0.6s ease,transform 0.6s ease}.anim-el.visible{opacity:1;transform:scale(1)}`,
    'Stagger Grid':  `.anim-el{opacity:0;transform:translateY(20px);transition:opacity 0.5s ease,transform 0.5s ease}.anim-el.visible{opacity:1;transform:translateY(0)}`,
    'Count Up Numbers':`.anim-el{opacity:0;transition:opacity 0.8s ease}.anim-el.visible{opacity:1}`,
  };

  const bgCSS = bg==='Dark Grid' ? `background:${c.bg};background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:28px 28px;`
    : bg==='Gradient Flow' ? `background:linear-gradient(-45deg,${c.bg},${c.nav},${c.bg});background-size:400% 400%;animation:gf 6s ease infinite;`
    : bg==='Mesh Gradient' ? `background:radial-gradient(ellipse at 20% 50%,${c.accent}22 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,${c.accent}18 0%,transparent 50%),${c.bg};`
    : `background:${c.bg};`;

  const parts = bizName.toUpperCase().split(' ');
  const h1 = parts.slice(0, Math.ceil(parts.length/2)).join(' ');
  const h2 = parts.slice(Math.ceil(parts.length/2)).join(' ');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>
*{margin:0;padding:0;box-sizing:border-box}
@keyframes gf{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
body{${bgCSS}color:${c.text};font-family:'Segoe UI',system-ui,sans-serif;min-height:100vh}
${animCSS[anim]||animCSS['Fade In Up']}
nav{background:${c.nav};padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(128,128,128,0.12);position:sticky;top:0;z-index:10;backdrop-filter:blur(12px);}
.logo{font-size:1.3rem;font-weight:900;letter-spacing:0.06em}.logo span{color:${c.accent}}
.nav-links{display:flex;gap:1.5rem}.nav-links a{font-size:0.8rem;color:${c.text};opacity:0.6;text-decoration:none;letter-spacing:0.04em;transition:opacity 0.2s}.nav-links a:hover{opacity:1;color:${c.accent}}
.hero{padding:6rem 2rem;text-align:center;max-width:760px;margin:0 auto}
.eyebrow{font-size:0.7rem;color:${c.accent};letter-spacing:0.28em;text-transform:uppercase;margin-bottom:1.2rem;font-weight:700}
h1{font-size:clamp(2.5rem,6vw,5rem);font-weight:900;line-height:0.92;letter-spacing:0.03em;margin-bottom:1.2rem}
h1 em{color:${c.accent};font-style:normal}
.hero-sub{font-size:1rem;color:${c.text};opacity:0.5;line-height:1.7;margin-bottom:2.5rem;max-width:500px;margin-left:auto;margin-right:auto}
.btn{background:${c.btn};color:${c.btnText};padding:14px 34px;border:none;border-radius:5px;font-size:0.84rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;display:inline-block;text-decoration:none;margin-right:10px}
.btn-ghost{background:transparent;border:1px solid ${c.accent};color:${c.accent};padding:13px 28px;border-radius:5px;font-size:0.84rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;display:inline-block;text-decoration:none}
.stats{display:flex;gap:3rem;justify-content:center;padding:3rem 2rem;border-top:1px solid rgba(128,128,128,0.1);border-bottom:1px solid rgba(128,128,128,0.1)}
.stat-v{font-size:2.5rem;font-weight:900;color:${c.accent};line-height:1}
.stat-l{font-size:0.68rem;color:${c.text};opacity:0.4;text-transform:uppercase;letter-spacing:0.12em;margin-top:0.3rem}
.services{padding:4rem 2rem;max-width:980px;margin:0 auto}
.s-eye{font-size:0.65rem;color:${c.accent};letter-spacing:0.22em;text-transform:uppercase;margin-bottom:0.5rem;font-weight:700}
.s-h{font-size:2rem;font-weight:800;margin-bottom:2.5rem}
.s-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}
.s-card{background:${c.nav};border:1px solid rgba(128,128,128,0.1);border-radius:10px;padding:1.5rem}
.s-icon{width:36px;height:36px;border-radius:8px;background:${c.accent}22;border:1px solid ${c.accent}44;margin-bottom:1rem}
.s-card h3{font-size:1rem;font-weight:700;margin-bottom:0.4rem;color:${c.accent}}
.s-card p{font-size:0.8rem;color:${c.text};opacity:0.45;line-height:1.6}
footer{border-top:1px solid rgba(128,128,128,0.08);padding:1.5rem 2rem;display:flex;justify-content:space-between;font-size:0.7rem;color:${c.text};opacity:0.3;margin-top:3rem}
@media(max-width:640px){.s-grid{grid-template-columns:1fr}.stats{flex-direction:column;align-items:center;gap:1.5rem}.nav-links{display:none}}
</style></head><body>
<nav><div class="logo">${h1}<span>${h2||'·'}</span></div><div class="nav-links"><a href="#">Home</a><a href="#">Services</a><a href="#">About</a><a href="#">Contact</a></div><a class="btn" href="#" style="padding:8px 18px;font-size:0.72rem;">Get Quote</a></nav>
<div class="hero anim-el"><p class="eyebrow">Professional Services · Ireland</p><h1>${h1}<br><em>${h2||''}</em></h1><p class="hero-sub">Professional services for homes and businesses across Ireland. Trusted by hundreds of clients.</p><a href="#" class="btn">Get a Free Quote</a><a href="#" class="btn-ghost">Our Services</a></div>
<div class="stats"><div class="anim-el" style="text-align:center"><div class="stat-v">500+</div><div class="stat-l">Clients</div></div><div class="anim-el" style="text-align:center;transition-delay:0.1s"><div class="stat-v">12yr</div><div class="stat-l">Experience</div></div><div class="anim-el" style="text-align:center;transition-delay:0.2s"><div class="stat-v">24/7</div><div class="stat-l">Support</div></div></div>
<div class="services"><p class="s-eye anim-el">What We Do</p><h2 class="s-h anim-el">Our Services</h2><div class="s-grid"><div class="s-card anim-el"><div class="s-icon"></div><h3>Service One</h3><p>Professional service delivering real results for your business across Ireland.</p></div><div class="s-card anim-el" style="transition-delay:0.1s"><div class="s-icon"></div><h3>Service Two</h3><p>Reliable and trusted, installed by experienced professionals. Call today.</p></div><div class="s-card anim-el" style="transition-delay:0.2s"><div class="s-icon"></div><h3>Service Three</h3><p>Modern solutions professionally installed. Serving clients nationwide.</p></div></div></div>
<footer><span>© 2025 ${bizName}. All rights reserved.</span><span>Ireland · hello@yourbusiness.ie</span></footer>
<script>const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:0.15});document.querySelectorAll('.anim-el').forEach(el=>obs.observe(el));<\/script>
</body></html>`;

  const wrap = document.getElementById('gen-preview-wrap'); if(!wrap) return;
  wrap.style.display = 'block';
  wrap.innerHTML = `<div class="mac-browser" id="preview-browser"><div class="mac-bar"><div class="mac-dots"><div class="mac-dot"></div><div class="mac-dot"></div><div class="mac-dot"></div></div><div class="mac-url">${bizName.toLowerCase().replace(/\s+/g,'')+'.ie'} — CM Studio Preview</div><div class="mac-actions"><div class="mac-action" onclick="togglePreviewFullscreen()" title="Fullscreen">⛶</div><div class="mac-action">←</div><div class="mac-action">→</div><div class="mac-action">⟳</div></div></div><iframe id="preview-iframe" sandbox="allow-scripts" title="Site Preview" style="width:100%;height:580px;border:none;display:block;"></iframe></div><div style="text-align:center;margin-top:1.2rem;"><button class="gen-btn" onclick="buildPreviewPanel()">← Change Selections</button></div>`;
  const iframe = document.getElementById('preview-iframe');
  if (iframe) iframe.srcdoc = html;
}

function togglePreviewFullscreen() {
  const browser = document.getElementById('preview-browser');
  if (!browser) return;
  
  if (!document.fullscreenElement) {
    browser.requestFullscreen().catch(err => {
      // Fallback: expand to fill viewport
      browser.style.position = 'fixed';
      browser.style.top = '0';
      browser.style.left = '0';
      browser.style.right = '0';
      browser.style.bottom = '0';
      browser.style.zIndex = '9999';
      browser.style.maxWidth = '100%';
      browser.style.height = '100vh';
      browser.style.borderRadius = '0';
      browser._isExpanded = true;
    });
  } else {
    document.exitFullscreen().catch(() => {
      // Remove fallback styles
      if (browser._isExpanded) {
        browser.style.position = '';
        browser.style.top = '';
        browser.style.left = '';
        browser.style.right = '';
        browser.style.bottom = '';
        browser.style.zIndex = '';
        browser.style.maxWidth = '';
        browser.style.height = '';
        browser.style.borderRadius = '';
        browser._isExpanded = false;
      }
    });
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
    label.querySelector('input')?.addEventListener('change', () =>
      label.classList.toggle('checked', label.querySelector('input').checked));
  });
  document.getElementById('q-overlay')?.addEventListener('click', function(e) {
    if (e.target === this) closeQuestionnaire();
  });
}

function openQuestionnaire() {
  if (!Object.keys(selections).length) { showToast('Make at least one selection first', 'error'); return; }
  if (cartOpen) toggleCart();
  qStep = 1; showQStep(1);
  document.getElementById('q-overlay').classList.add('open');
  const footer = document.getElementById('q-footer'); if(footer) footer.style.display='';
  document.getElementById('q-success').classList.remove('show');
  document.querySelectorAll('.q-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-1').classList.add('active');
}

function closeQuestionnaire() { document.getElementById('q-overlay').classList.remove('open'); }

function showQStep(n) {
  document.querySelectorAll('.q-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + n)?.classList.add('active');
  const titles = ['Your Details','Pages & Features','Your Content','Style & Branding','Almost Done!'];
  document.getElementById('q-title').textContent = titles[n-1]||'';
  document.getElementById('q-ind').textContent = `Step ${n} of ${Q_TOTAL}`;
  document.getElementById('q-progress-fill').style.width = ((n/Q_TOTAL)*100)+'%';
  const back = document.getElementById('q-back'); if(back) back.style.visibility = n>1?'visible':'hidden';
  const next = document.getElementById('q-next'); if(next) next.textContent = n===Q_TOTAL?'Submit Brief ✦':'Next →';
}

function prevStep() { if(qStep>1){qStep--;showQStep(qStep);} }

function nextStep() {
  if (qStep===1) {
    const name=document.getElementById('q-name')?.value?.trim(), email=document.getElementById('q-email')?.value?.trim();
    if(!name||!email){showToast('Please enter your name and email','error');return;}
    if(!email.includes('@')){showToast('Please enter a valid email address','error');return;}
  }
  if(qStep<Q_TOTAL){qStep++;showQStep(qStep);}else{submitBrief();}
}

function handleMoodUpload(input) {
  const previews = document.getElementById('upload-previews');
  Array.from(input.files).forEach(file => {
    if (file.size > 5*1024*1024) { showToast('File too large — max 5MB','error'); return; }
    moodFiles.push(file);
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result; img.className = 'upload-thumb'; img.title = file.name;
      previews?.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

function showToast(msg, type='') {
  const t = document.getElementById('toast'); if(!t) return;
  t.textContent = msg; t.className = 'toast show ' + type;
  setTimeout(() => { t.className = 'toast'; }, 3500);
}

function injectAnimKeyframes() { /* keyframes already injected in injectStyles */ }