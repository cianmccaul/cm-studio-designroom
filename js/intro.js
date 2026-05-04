/* ═══════════════════════════════════════
   CM STUDIO — DESIGNROOM V4
   js/intro.js
   Cinematic intro sequence
═══════════════════════════════════════ */

(function () {

  // ── CONFIG ──
  const INTRO_DURATION = 3200;   // ms before morph begins
  const MORPH_DURATION = 900;    // ms for the morph transition

  // ── STATE ──
  let introCanvas, introCtx;
  let introParticles = [];
  let introAnimId;
  let morphing = false;

  // ── PARTICLE CONFIG ──
  const P_COUNT   = 90;
  const P_COLOR   = '#00e5ff';
  const P_CONNECT = 90;   // px connection distance
  const P_SPEED   = 0.45;

  // ════════════════════════════════
  // BOOT
  // ════════════════════════════════
  function boot() {
    buildIntroDOM();
    initIntroParticles();
    animateIntro();
    scheduleReveal();
  }

  // ════════════════════════════════
  // BUILD DOM
  // ════════════════════════════════
  function buildIntroDOM() {
    const screen = document.getElementById('intro-screen');
    if (!screen) return;

    // Canvas fills the screen
    introCanvas = document.createElement('canvas');
    introCanvas.id = 'intro-canvas';
    introCanvas.style.cssText = `
      position:absolute;inset:0;width:100%;height:100%;
      display:block;z-index:0;
    `;
    screen.prepend(introCanvas);
    introCtx = introCanvas.getContext('2d');
    resizeIntroCanvas();
    window.addEventListener('resize', resizeIntroCanvas);

    // Content sits above canvas
    const content = screen.querySelector('.intro-content');
    if (content) content.style.position = 'relative';
  }

  function resizeIntroCanvas() {
    if (!introCanvas) return;
    introCanvas.width  = window.innerWidth;
    introCanvas.height = window.innerHeight;
  }

  // ════════════════════════════════
  // PARTICLES
  // ════════════════════════════════
  function initIntroParticles() {
    introParticles = Array.from({ length: P_COUNT }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * P_SPEED,
      vy: (Math.random() - 0.5) * P_SPEED,
      r:  Math.random() * 1.6 + 0.5,
      o:  Math.random() * 0.6 + 0.4,
    }));
  }

  function drawIntroParticles() {
    const w = introCanvas.width;
    const h = introCanvas.height;
    const ctx = introCtx;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // Update + draw particles
    introParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle   = P_COLOR;
      ctx.globalAlpha = p.o;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw connections
    for (let i = 0; i < introParticles.length; i++) {
      for (let j = i + 1; j < introParticles.length; j++) {
        const a  = introParticles[i];
        const b  = introParticles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < P_CONNECT) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle  = P_COLOR;
          ctx.globalAlpha  = 0.12 * (1 - d / P_CONNECT);
          ctx.lineWidth    = 0.6;
          ctx.stroke();
          ctx.globalAlpha  = 1;
        }
      }
    }
  }

  function animateIntro() {
    if (!morphing) {
      drawIntroParticles();
      introAnimId = requestAnimationFrame(animateIntro);
    }
  }

  // ════════════════════════════════
  // REVEAL SEQUENCE
  // ════════════════════════════════
  function scheduleReveal() {
    // Step 1 — animate logo elements in
    const logo    = document.querySelector('.intro-logo');
    const sub     = document.querySelector('.intro-sub');
    const line    = document.querySelector('.intro-line');
    const tagline = document.querySelector('.intro-tagline');
    const hint    = document.querySelector('.intro-hint');

    // Elements start invisible via CSS
    // Stagger them in
    if (logo)    setTimeout(() => logo.classList.add('visible'),    200);
    if (sub)     setTimeout(() => sub.classList.add('visible'),     550);
    if (line)    setTimeout(() => line.classList.add('visible'),    900);
    if (tagline) setTimeout(() => tagline.classList.add('visible'), 1300);
    if (hint)    setTimeout(() => hint.classList.add('visible'),    2000);

    // Step 2 — begin morph
    setTimeout(beginMorph, INTRO_DURATION);
  }

  // ════════════════════════════════
  // MORPH — intro dissolves into showroom
  // ════════════════════════════════
  function beginMorph() {
    morphing = true;
    cancelAnimationFrame(introAnimId);

    const screen  = document.getElementById('intro-screen');
    const main    = document.getElementById('main-app');
    const nudge   = document.getElementById('nudge-line');

    if (!screen) return;

    // 1. Reveal the main app underneath (invisible for now)
    if (main) {
      main.style.opacity  = '0';
      main.style.display  = 'block';
    }

    // 2. Freeze particle frame — do one last draw
    drawIntroParticles();

    // 3. Fade intro canvas upward while fading out
    introCanvas.style.transition = `opacity ${MORPH_DURATION}ms ease, transform ${MORPH_DURATION}ms ease`;
    introCanvas.style.opacity    = '0';
    introCanvas.style.transform  = 'scale(1.04)';

    // 4. Fade intro content down
    const content = screen.querySelector('.intro-content');
    if (content) {
      content.style.transition = `opacity ${MORPH_DURATION * 0.6}ms ease, transform ${MORPH_DURATION * 0.6}ms ease`;
      content.style.opacity    = '0';
      content.style.transform  = 'translateY(-16px)';
    }

    // 5. After morph — hide intro, show main, show nudge
    setTimeout(() => {
      if (screen) screen.style.display = 'none';
      if (main) {
        main.style.transition = `opacity ${MORPH_DURATION * 0.5}ms ease`;
        main.style.opacity    = '1';
      }
      // Show subtle nudge line
      if (nudge) {
        nudge.style.opacity   = '1';
        nudge.style.transform = 'translateY(0)';
      }
      // Init cursor reactive background
      if (typeof initCursorReactive === 'function') initCursorReactive();
      // Init main canvas animations
      if (typeof initAllCanvases === 'function') initAllCanvases();
      // Build all grids
      if (typeof buildAllGrids === 'function') buildAllGrids();
      // Init tabs
      if (typeof initTabs === 'function') initTabs();
      // Init questionnaire
      if (typeof initQuestionnaire === 'function') initQuestionnaire();
      // Init nudge
      if (typeof initNudge === 'function') initNudge();
      // Check saved progress
      if (typeof checkSavedProgress === 'function') checkSavedProgress();
    }, MORPH_DURATION + 50);
  }

  // ── KICK OFF ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();