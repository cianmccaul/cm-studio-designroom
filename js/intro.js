/* ═══════════════════════════════════════
CM STUDIO — DESIGNROOM V4
js/intro.js
Cinematic intro: particles + logo +
three-step cards + Get Started button
═══════════════════════════════════════ */

(function () {
const MORPH_DURATION = 900;
let introCanvas, introCtx, introAnimId, morphing = false, started = false;
const P_COUNT = 85, P_COLOR = ‘#00e5ff’, P_CONNECT = 90, P_SPEED = 0.4;
let introParticles = [];

function boot() {
buildIntroCanvas();
buildStepCards();
initParticles();
animateLoop();
scheduleReveal();
}

function buildIntroCanvas() {
const screen = document.getElementById(‘intro-screen’);
if (!screen) return;
introCanvas = document.createElement(‘canvas’);
introCanvas.id = ‘intro-canvas’;
introCanvas.style.cssText = ‘position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0;’;
screen.prepend(introCanvas);
introCtx = introCanvas.getContext(‘2d’);
resize();
window.addEventListener(‘resize’, resize);
const c = screen.querySelector(’.intro-content’);
if (c) c.style.position = ‘relative’;
}

function resize() {
if (!introCanvas) return;
introCanvas.width = window.innerWidth;
introCanvas.height = window.innerHeight;
}

function buildStepCards() {
const screen = document.getElementById(‘intro-screen’);
if (!screen) return;

```
const stepsWrap = document.createElement('div');
stepsWrap.id = 'intro-steps';
stepsWrap.style.cssText = 'display:flex;gap:0.8rem;justify-content:center;padding:1.5rem 1.5rem 0;z-index:2;pointer-events:none;width:100%;max-width:600px;';

[
  { num: '01', label: 'Browse', desc: 'Explore backgrounds, navbars, heroes and more' },
  { num: '02', label: 'Select', desc: 'Click anything you like — mix and match freely' },
  { num: '03', label: 'Submit', desc: 'Fill in your brief and we\'ll be in touch within 48hrs' },
].forEach((s, i) => {
  const card = document.createElement('div');
  card.style.cssText = `background:rgba(10,10,20,0.7);border:1px solid rgba(0,229,255,0.15);border-radius:12px;padding:1.2rem 1rem;text-align:center;max-width:180px;flex:1;opacity:0;transform:translateY(30px);transition:opacity 0.6s ease ${i * 0.15}s,transform 0.6s ease ${i * 0.15}s;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);`;
  card.innerHTML = `<div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#00e5ff;line-height:1;margin-bottom:0.3rem;">${s.num}</div><div style="font-family:'Syne',sans-serif;font-size:0.78rem;font-weight:700;margin-bottom:0.3rem;">${s.label}</div><div style="font-size:0.66rem;color:rgba(255,255,255,0.4);line-height:1.5;">${s.desc}</div>`;
  stepsWrap.appendChild(card);
});

const btn = document.createElement('button');
btn.id = 'intro-start-btn';
btn.textContent = 'Get Started →';
btn.style.cssText = "font-family:'Syne',sans-serif;font-size:0.82rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;background:#00e5ff;color:#000;border:none;padding:13px 36px;border-radius:6px;cursor:pointer;opacity:0;transition:opacity 0.6s ease,transform 0.4s ease;z-index:10;pointer-events:none;white-space:nowrap;margin-top:1.5rem;";
btn.addEventListener('click', () => {
  if (!started) { started = true; beginMorph(); }
});

const introContent = screen.querySelector('.intro-content');
if (introContent) {
  introContent.appendChild(stepsWrap);
  introContent.appendChild(btn);
} else {
  screen.appendChild(stepsWrap);
  screen.appendChild(btn);
}
```

}

function initParticles() {
introParticles = Array.from({ length: P_COUNT }, () => ({
x: Math.random() * window.innerWidth,
y: Math.random() * window.innerHeight,
vx: (Math.random() - 0.5) * P_SPEED,
vy: (Math.random() - 0.5) * P_SPEED,
r: Math.random() * 1.6 + 0.5,
o: Math.random() * 0.6 + 0.4,
}));
}

function drawParticles() {
const w = introCanvas.width, h = introCanvas.height, ctx = introCtx;
ctx.clearRect(0, 0, w, h);
ctx.fillStyle = ‘#000’;
ctx.fillRect(0, 0, w, h);
introParticles.forEach(p => {
p.x += p.vx; p.y += p.vy;
if (p.x < 0 || p.x > w) p.vx *= -1;
if (p.y < 0 || p.y > h) p.vy *= -1;
ctx.beginPath();
ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
ctx.fillStyle = P_COLOR;
ctx.globalAlpha = p.o;
ctx.fill();
ctx.globalAlpha = 1;
});
for (let i = 0; i < introParticles.length; i++) {
for (let j = i + 1; j < introParticles.length; j++) {
const a = introParticles[i], b = introParticles[j];
const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
if (d < P_CONNECT) {
ctx.beginPath();
ctx.moveTo(a.x, a.y);
ctx.lineTo(b.x, b.y);
ctx.strokeStyle = P_COLOR;
ctx.globalAlpha = 0.1 * (1 - d / P_CONNECT);
ctx.lineWidth = 0.6;
ctx.stroke();
ctx.globalAlpha = 1;
}
}
}
}

function animateLoop() {
if (!morphing) {
drawParticles();
introAnimId = requestAnimationFrame(animateLoop);
}
}

function scheduleReveal() {
const show = (sel, delay) => setTimeout(() => {
const el = document.querySelector(sel);
if (el) el.classList.add(‘visible’);
}, delay);

```
show('.intro-mark-img', 150);
show('.intro-logo',     350);
show('.intro-sub',      700);
show('.intro-line',    1050);
show('.intro-tagline', 1500);
show('.intro-hint',    2100);

// Step cards rise up
setTimeout(() => {
  const steps = document.getElementById('intro-steps');
  if (steps) steps.querySelectorAll('div').forEach(c => {
    c.style.opacity = '1';
    c.style.transform = 'translateY(0)';
  });
}, 2700);

// Get Started button appears + pulses
setTimeout(() => {
  const btn = document.getElementById('intro-start-btn');
  if (btn) {
    btn.style.opacity = '1';
    btn.style.transform = 'translateY(0)';
    btn.style.pointerEvents = 'all';
    if (!document.getElementById('btn-pulse-style')) {
      const s = document.createElement('style');
      s.id = 'btn-pulse-style';
      s.textContent = '@keyframes btnPulse{0%,100%{box-shadow:0 0 0 0 rgba(0,229,255,0.45)}60%{box-shadow:0 0 0 14px rgba(0,229,255,0)}}';
      document.head.appendChild(s);
    }
    btn.style.animation = 'btnPulse 2s ease-in-out infinite';
  }
}, 3400);

// Auto-advance fallback at 10 seconds
setTimeout(() => {
  if (!started) { started = true; beginMorph(); }
}, 10000);
```

}

function beginMorph() {
morphing = true;
cancelAnimationFrame(introAnimId);
const screen = document.getElementById(‘intro-screen’);
const main   = document.getElementById(‘main-app’);
if (!screen) return;
if (main) { main.style.opacity = ‘0’; main.style.display = ‘block’; }

```
drawParticles();

introCanvas.style.transition = `opacity ${MORPH_DURATION}ms ease,transform ${MORPH_DURATION}ms ease`;
introCanvas.style.opacity    = '0';
introCanvas.style.transform  = 'scale(1.04)';

const content = screen.querySelector('.intro-content');
if (content) {
  content.style.transition = `opacity ${MORPH_DURATION * 0.6}ms ease,transform ${MORPH_DURATION * 0.6}ms ease`;
  content.style.opacity = '0';
  content.style.transform = 'translateY(-16px)';
}

const steps = document.getElementById('intro-steps');
const btn   = document.getElementById('intro-start-btn');
if (steps) {
  steps.style.transition = `opacity ${MORPH_DURATION * 0.5}ms ease`;
  steps.style.opacity = '0';
}
if (btn) {
  btn.style.transition = `opacity ${MORPH_DURATION * 0.4}ms ease`;
  btn.style.opacity = '0';
}

setTimeout(() => {
  if (screen) screen.style.display = 'none';
  if (main) {
    main.style.transition = `opacity ${MORPH_DURATION * 0.5}ms ease`;
    main.style.opacity = '1';
  }
  if (typeof initCursorReactive === 'function') initCursorReactive();
  if (typeof initAllCanvases    === 'function') initAllCanvases();
  if (typeof initNudge          === 'function') initNudge();
}, MORPH_DURATION + 50);
```

}

if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, boot);
} else {
boot();
}
})();
