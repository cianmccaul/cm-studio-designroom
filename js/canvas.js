/* ═══════════════════════════════════════
   CM STUDIO — DESIGNROOM V3
   js/canvas.js
   All canvas animations & bg effects
═══════════════════════════════════════ */

// ── COLOUR SWATCH SWAP ──
function swapCanvasColor(e, swatch, canvasClass, color) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  swatch.parentElement.querySelectorAll('.cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const canvas = card.querySelector('.' + canvasClass);
  if (canvas) {
    canvas.dataset.color = color;
    // trigger redraw by updating the color ref
    canvas._currentColor = color;
  }
}

// ── BACKGROUND COLOUR SWAP (for particle field, stars, etc) ──
function swapBackgroundColor(e, swatch, canvasClass, bgColor) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  swatch.parentElement.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const canvas = card.querySelector('.' + canvasClass);
  if (canvas) {
    canvas.dataset.bgColor = bgColor;
    canvas._currentBgColor = bgColor;
    if (canvas._drawFn) canvas._drawFn();
  }
}

// ── CSS BACKGROUND SWAPS (non-canvas backgrounds) ──
function swapMesh(e, swatch, r1, r2, r3) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.card-swatches:first-of-type .cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.bg-mesh');
  if (pw) pw.style.setProperty('--m1', `rgb(${r1})`);
  if (pw) pw.style.setProperty('--m2', `rgb(${r2})`);
  if (pw) pw.style.setProperty('--m3', `rgb(${r3})`);
}

function swapScan(e, swatch, rgb) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.bg-scan');
  if (pw) pw.style.setProperty('--scan-color', `rgb(${rgb})`);
}

function swapCircuit(e, swatch, rgb) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.bg-circuit');
  if (pw) pw.style.setProperty('--circuit-color', `rgb(${rgb})`);
}

function swapGrid(e, swatch, rgba) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.bg-dark-grid');
  if (pw) pw.style.setProperty('--grid-color', rgba);
}

function swapGradFlow(e, swatch, c1, c2, c3, c4) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.card-swatches:first-of-type .cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.bg-grad-flow');
  if (pw) pw.style.background = `linear-gradient(-45deg,${c1},${c2},${c3},${c4})`;
}

function swapGradFlowBg(e, swatch, cls, c1, c2, c3, c4) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.background = `linear-gradient(-45deg,${c1},${c2},${c3},${c4})`;
}

function swapGridBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.backgroundColor = bg;
}

function swapMeshBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.setProperty('--mesh-bg', bg);
}

function swapAurora(e, swatch, r1, r2, r3) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.card-swatches:first-of-type .cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.bg-aurora');
  if (pw) {
    pw.style.setProperty('--aurora-c1', `rgba(${r1},0.2)`);
    pw.style.setProperty('--aurora-c2', `rgba(${r2},0.2)`);
    pw.style.setProperty('--aurora-c3', `rgba(${r3},0.15)`);
  }
}

function swapAuroraBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.background = bg;
}

function swapScanBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.background = bg;
}

function swapNoiseBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.background = bg;
}

function swapCircuitBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.background = bg;
}

function swapBlobColors(e, swatch, r1, r2, r3) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.card-swatches:first-of-type .cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const blobs = card.querySelectorAll('.blob');
  const colors = [`rgb(${r1})`, `rgb(${r2})`, `rgb(${r3})`];
  blobs.forEach((b, i) => { b.style.background = colors[i % colors.length]; });
}

function swapBlobBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.background = bg;
}

function swapWhiteBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.background = bg;
}

function swapPaperBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.background = bg;
}

function swapLightGrad(e, swatch, cls, c1, c2) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.background = `linear-gradient(135deg,${c1},${c2})`;
}

function swapBokeh(e, swatch, r1, r2, r3) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.card-swatches:first-of-type .cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.bg-bokeh');
  if (pw) {
    pw.style.setProperty('--bk1', `rgba(${r1},0.55)`);
    pw.style.setProperty('--bk2', `rgba(${r2},0.5)`);
    pw.style.setProperty('--bk3', `rgba(${r3},0.4)`);
  }
}

function swapBokehBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.setProperty('--bk-bg', bg);
}

function swapLiquidBlobs(e, swatch, r1, r2, r3) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.card-swatches:first-of-type .cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.bg-liquid-blobs');
  if (pw) {
    pw.style.setProperty('--lb1', `rgba(${r1},0.55)`);
    pw.style.setProperty('--lb2', `rgba(${r2},0.5)`);
    pw.style.setProperty('--lb3', `rgba(${r3},0.45)`);
  }
}

function swapLiquidBlobBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.background = bg;
}

function swapImgOverlay(e, swatch, cls, overlay) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) pw.style.setProperty('--img-overlay', overlay);
}

function swapGeoWeb(e, swatch, rgb) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.card-swatches:first-of-type .cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const canvas = card.querySelector('.c-geo-web');
  if (canvas) { canvas._color = `rgb(${rgb})`; }
}

function swapGeoWebBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const canvas = card.querySelector('.' + cls);
  if (canvas) { canvas._bgColor = bg; }
  const pw = card.querySelector('.bg-geo-web');
  if (pw) pw.style.background = bg;
}

function swapDiagonalBg(e, swatch, cls, bg) {
  e.stopPropagation();
  const card = swatch.closest('.preview-card');
  card.querySelectorAll('.cs-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const pw = card.querySelector('.' + cls);
  if (pw) {
    pw.style.backgroundColor = bg;
    pw.style.backgroundImage = `repeating-linear-gradient(45deg, rgba(128,128,128,0.04) 0px, rgba(128,128,128,0.04) 1px, transparent 1px, transparent 20px)`;
  }
}

// ── INIT ALL CANVASES ──
function initAllCanvases() {
  initParticles();
  initStars();
  initMatrix();
  initCCTV();
  initGeometricShapes();
  initBlobs();
  initGeoWeb();
}

// ══════════════════════════════════════
// GEOMETRIC WEB
// ══════════════════════════════════════
function initGeoWeb() {
  document.querySelectorAll('.c-geo-web').forEach(canvas => {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth || 240;
    canvas.height = parent.offsetHeight || 185;
    canvas._color = '#00e5ff';
    canvas._bgColor = '#060612';
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const N = 28;
    const pts = Array.from({length:N}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4
    }));
    const DIST = 70;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = canvas._bgColor;
      ctx.fillRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      const col = canvas._color || '#00e5ff';
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.strokeStyle = col.replace(')', `,${1 - d/DIST})`).replace('rgb(', 'rgba(');
            ctx.lineWidth = 0.6;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = canvas._color || '#00e5ff';
        ctx.fill();
      });
      canvas._geoRaf = requestAnimationFrame(draw);
    }
    if (canvas._geoRaf) cancelAnimationFrame(canvas._geoRaf);
    draw();
  });
}

function initSingleGeoWebCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const N = 80;
  const pts = Array.from({length:N}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5
  }));
  const DIST = 120;
  function draw() {
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = canvas._bgColor || '#060612';
    ctx.fillRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
    });
    const col = canvas._color || '#00e5ff';
    for(let i=0;i<N;i++){
      for(let j=i+1;j<N;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<DIST){
          ctx.beginPath();
          ctx.strokeStyle=col.replace(')',`,${1-d/DIST})`).replace('rgb(','rgba(');
          ctx.lineWidth=0.7;
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.stroke();
        }
      }
    }
    pts.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,2,0,Math.PI*2);
      ctx.fillStyle=col;
      ctx.fill();
    });
    canvas._geoRaf=requestAnimationFrame(draw);
  }
  if(canvas._geoRaf) cancelAnimationFrame(canvas._geoRaf);
  draw();
}

// ══════════════════════════════════════
// PARTICLE FIELD
// ══════════════════════════════════════
function initParticles() {
  document.querySelectorAll('.c-particles').forEach(canvas => {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    const ctx = canvas.getContext('2d');
    canvas._currentColor = canvas.dataset.color || '#00e5ff';
    canvas._currentBgColor = canvas.dataset.bgColor || '#050510';

    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.5 + 0.4
    }));

    function draw() {
      const color = canvas._currentColor || '#00e5ff';
      const bg = canvas._currentBgColor || '#050510';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 60) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            // parse color to rgba
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.15 * (1 - d / 60);
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  });
}

// ══════════════════════════════════════
// STARFIELD
// ══════════════════════════════════════
function initStars() {
  document.querySelectorAll('.c-stars').forEach(canvas => {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    const ctx = canvas.getContext('2d');
    canvas._currentColor = canvas.dataset.color || '#ffffff';

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      o: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    }));

    // shooting stars
    const shooters = [];
    function maybeShoot() {
      if (Math.random() < 0.003) {
        shooters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          len: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 4,
          alpha: 1
        });
      }
    }

    function draw() {
      const color = canvas._currentColor || '#ffffff';
      ctx.fillStyle = '#020208';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.o += (Math.random() - 0.5) * s.speed;
        s.o = Math.max(0.05, Math.min(1, s.o));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = s.o;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      maybeShoot();
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y - s.len * 0.4);
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.4);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.globalAlpha = s.alpha;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
        s.x += s.speed;
        s.y += s.speed * 0.4;
        s.alpha -= 0.025;
        if (s.alpha <= 0) shooters.splice(i, 1);
      }
      requestAnimationFrame(draw);
    }
    draw();
  });
}

// ══════════════════════════════════════
// MATRIX RAIN
// ══════════════════════════════════════
function initMatrix() {
  document.querySelectorAll('.c-matrix').forEach(canvas => {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    const ctx = canvas.getContext('2d');
    canvas._currentColor = canvas.dataset.color || '#00e5ff';

    const cols = Math.floor(canvas.width / 13);
    const drops = Array(cols).fill(0).map(() => Math.random() * -canvas.height);
    const chars = '01アイウエオカキクケコサシスセソタチツテト0110';

    function draw() {
      const color = canvas._currentColor || '#00e5ff';
      ctx.fillStyle = 'rgba(0,5,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '11px monospace';

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        // bright head
        ctx.fillStyle = y < 20 ? '#ffffff' : color;
        ctx.globalAlpha = y < 20 ? 1 : 0.75;
        ctx.fillText(char, i * 13, y);
        ctx.globalAlpha = 1;
        drops[i] += 13;
        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.random() * -100;
        }
      });
    }
    setInterval(draw, 55);
  });
}

// ══════════════════════════════════════
// CCTV TRACKER
// ══════════════════════════════════════
function initCCTV() {
  document.querySelectorAll('.c-cctv').forEach(canvas => {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    const ctx = canvas.getContext('2d');
    canvas._currentColor = canvas.dataset.color || '#00e5ff';

    let mx = canvas.width / 2;
    let my = canvas.height / 2;
    let targetMx = mx, targetMy = my;

    // mouse tracking
    parent.addEventListener('mousemove', e => {
      const r = parent.getBoundingClientRect();
      targetMx = e.clientX - r.left;
      targetMy = e.clientY - r.top;
    });

    // idle sweep when no mouse
    let idleAngle = 0;
    let idleDir = 1;
    let hasMoused = false;
    parent.addEventListener('mouseenter', () => hasMoused = true);
    parent.addEventListener('mouseleave', () => hasMoused = false);

    function draw() {
      const color = canvas._currentColor || '#00e5ff';

      // smooth follow
      mx += (targetMx - mx) * 0.08;
      my += (targetMy - my) * 0.08;

      // idle sweep
      if (!hasMoused) {
        idleAngle += 0.008 * idleDir;
        if (Math.abs(idleAngle) > 0.6) idleDir *= -1;
        targetMx = canvas.width / 2 + Math.sin(idleAngle) * canvas.width * 0.35;
        targetMy = canvas.height * 0.6;
      }

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // scanlines
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.fillRect(0, i, canvas.width, 2);
      }

      // vignette
      const vgn = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      vgn.addColorStop(0, 'transparent');
      vgn.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = vgn;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = 28;

      // mount pole
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // camera body
      const ang = Math.atan2(my - cy, mx - cx);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);

      // body shadow
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#1a1a1a';
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-20, -9, 40, 18, 5);
      } else {
        ctx.rect(-20, -9, 40, 18);
      }
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // lens
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(20, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(20, 0, 2, 0, Math.PI * 2);
      ctx.fill();

      // lens glow ring
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.arc(20, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.restore();

      // FOV cone
      ctx.save();
      ctx.translate(cx, cy);
      const spread = 0.32;
      const coneLen = Math.max(canvas.width, canvas.height) * 1.2;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, coneLen);
      grad.addColorStop(0, color + '18');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang - spread) * coneLen, Math.sin(ang - spread) * coneLen);
      ctx.lineTo(Math.cos(ang + spread) * coneLen, Math.sin(ang + spread) * coneLen);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // cone outline
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();

      // REC indicator
      const recOn = Math.sin(Date.now() / 500) > 0;
      ctx.fillStyle = recOn ? '#ff3333' : '#661111';
      ctx.shadowColor = recOn ? '#ff3333' : 'transparent';
      ctx.shadowBlur = recOn ? 6 : 0;
      ctx.beginPath();
      ctx.arc(12, 12, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('REC', 20, 16);

      // timestamp
      const now = new Date();
      const ts = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.4;
      ctx.font = '8px monospace';
      ctx.fillText('CAM 01  ' + ts, 6, canvas.height - 8);
      ctx.globalAlpha = 1;

      requestAnimationFrame(draw);
    }
    draw();
  });
}

// ══════════════════════════════════════
// GEOMETRIC SHAPES
// ══════════════════════════════════════
function initGeometricShapes() {
  document.querySelectorAll('[data-geo="true"]').forEach(wrap => {
    const shapes = [
      { w: 55, h: 55, t: '18%', l: '8%', d: '0s', dur: '9s' },
      { w: 38, h: 38, t: '48%', l: '62%', d: '-2s', dur: '7s' },
      { w: 72, h: 72, t: '8%', l: '62%', d: '-4s', dur: '11s' },
      { w: 28, h: 28, t: '62%', l: '18%', d: '-1s', dur: '8s' },
      { w: 46, h: 46, t: '28%', l: '38%', d: '-3s', dur: '10s' }
    ];
    shapes.forEach(s => {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute;
        width:${s.w}px;height:${s.h}px;
        top:${s.t};left:${s.l};
        border:1px solid rgba(255,255,255,0.05);
        border-radius:3px;
        animation:geoSpin ${s.dur} linear ${s.d} infinite;
      `;
      wrap.appendChild(el);
    });
  });

  // inject keyframe if not already present
  if (!document.getElementById('geo-spin-style')) {
    const style = document.createElement('style');
    style.id = 'geo-spin-style';
    style.textContent = '@keyframes geoSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }';
    document.head.appendChild(style);
  }
}

// ══════════════════════════════════════
// FLOATING BLOBS
// ══════════════════════════════════════
function initBlobs() {
  document.querySelectorAll('[data-blobs="true"]').forEach(wrap => {
    const blobs = [
      { s: 80, t: '10%', l: '10%', c: 'rgba(100,30,200,0.25)', dur: '6s' },
      { s: 60, t: '50%', l: '55%', c: 'rgba(0,80,200,0.2)', dur: '8s' },
      { s: 70, t: '60%', l: '20%', c: 'rgba(200,0,100,0.15)', dur: '7s' }
    ];
    blobs.forEach(b => {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute;
        width:${b.s}px;height:${b.s}px;
        top:${b.t};left:${b.l};
        background:${b.c};
        border-radius:50%;
        filter:blur(40px);
        animation:blobFloat ${b.dur} ease-in-out infinite alternate;
      `;
      wrap.appendChild(el);
    });
  });
}

// ══════════════════════════════════════
// FULLSCREEN CANVAS CLONES
// Used when opening a card in modal
// ══════════════════════════════════════
function buildFullscreenCanvas(type, color) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'width:100%;height:100%;position:relative;overflow:hidden;';

  if (type === 'particles') {
    const bgColor = arguments[2] || '#050510';
    wrap.style.background = bgColor;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    canvas.dataset.color = color || '#00e5ff';
    canvas.dataset.bgColor = bgColor;
    canvas.className = 'c-particles';
    wrap.appendChild(canvas);
    setTimeout(() => {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
      initSingleParticleCanvas(canvas);
    }, 50);
  }

  if (type === 'stars') {
    wrap.style.background = '#020208';
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    canvas.dataset.color = color || '#ffffff';
    wrap.appendChild(canvas);
    setTimeout(() => {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
      initSingleStarCanvas(canvas);
    }, 50);
  }

  if (type === 'matrix') {
    wrap.style.background = '#000500';
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    canvas.dataset.color = color || '#00e5ff';
    wrap.appendChild(canvas);
    setTimeout(() => {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
      initSingleMatrixCanvas(canvas);
    }, 50);
  }

  if (type === 'cctv') {
    wrap.style.background = '#080808';
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    canvas.dataset.color = color || '#00e5ff';
    wrap.appendChild(canvas);
    setTimeout(() => {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
      initSingleCCTVCanvas(canvas);
    }, 50);
  }

  return wrap;
}

function initSingleParticleCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  canvas._currentColor = canvas.dataset.color || '#00e5ff';
  canvas._currentBgColor = canvas._currentBgColor || canvas.dataset.bgColor || '#050510';
  const pts = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    r: Math.random() * 1.8 + 0.5
  }));
  function draw() {
    const color = canvas._currentColor || '#00e5ff';
    ctx.fillStyle = canvas._currentBgColor || '#050510';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 80) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.12 * (1 - d / 80);
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

function initSingleStarCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  canvas._currentColor = canvas.dataset.color || '#ffffff';
  const stars = Array.from({ length: 160 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.2,
    o: Math.random(),
    speed: Math.random() * 0.015 + 0.003
  }));
  function draw() {
    const color = canvas._currentColor || '#ffffff';
    ctx.fillStyle = '#020208';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.o += (Math.random() - 0.5) * s.speed;
      s.o = Math.max(0.05, Math.min(1, s.o));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = s.o;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function initSingleMatrixCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  canvas._currentColor = canvas.dataset.color || '#00e5ff';
  const cols = Math.floor(canvas.width / 13);
  const drops = Array(cols).fill(0).map(() => Math.random() * -canvas.height);
  const chars = '01アイウエオカキクケコサシスセソタチツテト';
  function draw() {
    const color = canvas._currentColor || '#00e5ff';
    ctx.fillStyle = 'rgba(0,5,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '13px monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = y < 20 ? '#ffffff' : color;
      ctx.globalAlpha = y < 20 ? 1 : 0.75;
      ctx.fillText(char, i * 13, y);
      ctx.globalAlpha = 1;
      drops[i] += 13;
      if (drops[i] > canvas.height && Math.random() > 0.975) drops[i] = Math.random() * -100;
    });
  }
  setInterval(draw, 55);
}

function initSingleCCTVCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  canvas._currentColor = canvas.dataset.color || '#00e5ff';
  let mx = canvas.width / 2, my = canvas.height / 2;
  let tmx = mx, tmy = my;
  let hasMoused = false;
  let idleAngle = 0, idleDir = 1;

  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.parentElement.getBoundingClientRect();
    tmx = e.clientX - r.left;
    tmy = e.clientY - r.top;
    hasMoused = true;
  });
  canvas.parentElement.addEventListener('mouseleave', () => hasMoused = false);

  function draw() {
    const color = canvas._currentColor || '#00e5ff';
    mx += (tmx - mx) * 0.06;
    my += (tmy - my) * 0.06;

    if (!hasMoused) {
      idleAngle += 0.005 * idleDir;
      if (Math.abs(idleAngle) > 0.7) idleDir *= -1;
      tmx = canvas.width / 2 + Math.sin(idleAngle) * canvas.width * 0.38;
      tmy = canvas.height * 0.6;
    }

    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < canvas.height; i += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.07)';
      ctx.fillRect(0, i, canvas.width, 2);
    }

    const vgn = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width*0.8);
    vgn.addColorStop(0, 'transparent');
    vgn.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vgn;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2, cy = 35;
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    const ang = Math.atan2(my - cy, mx - cx);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ang);

    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-22, -10, 44, 20, 6);
    } else {
      ctx.rect(-22, -10, 44, 20);
    }
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(22, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(22, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.arc(22, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    const spread = 0.3;
    const coneLen = Math.max(canvas.width, canvas.height) * 1.5;
    ctx.save();
    ctx.translate(cx, cy);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, coneLen);
    grad.addColorStop(0, color + '20');
    grad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(ang - spread) * coneLen, Math.sin(ang - spread) * coneLen);
    ctx.lineTo(Math.cos(ang + spread) * coneLen, Math.sin(ang + spread) * coneLen);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    const recOn = Math.sin(Date.now() / 500) > 0;
    ctx.fillStyle = recOn ? '#ff3333' : '#661111';
    ctx.shadowColor = recOn ? '#ff3333' : 'transparent';
    ctx.shadowBlur = recOn ? 8 : 0;
    ctx.beginPath();
    ctx.arc(14, 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('REC', 22, 18);

    const now = new Date();
    const ts = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.45;
    ctx.font = '9px monospace';
    ctx.fillText('CAM 01  ' + ts, 8, canvas.height - 10);
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }
  draw();
}

// ── INIT ON DOM READY ──
document.addEventListener('DOMContentLoaded', initAllCanvases);