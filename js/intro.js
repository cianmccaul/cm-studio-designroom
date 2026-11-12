/* ═══════════════════════════════════════
   CM STUDIO — DESIGNROOM V4
   js/intro.js
   Cinematic intro: particles + logo +
   three-step cards + Get Started button
═══════════════════════════════════════ */

(function () {
  const MORPH_DURATION = 1800; // Doubled for more luxurious transition
  let introCanvas, introCtx, introAnimId, morphing = false, started = false;
  const P_COUNT = 85, P_COLOR = '#00e5ff', P_CONNECT = 90, P_SPEED = 0.4;

  let revealed = false;

  function boot() {
    buildIntroCanvas();
    buildStepCards();
    buildSkipButton();
    initParticles();
    animateLoop();
    scheduleReveal();
  }

  function buildIntroCanvas() {
    const screen = document.getElementById('intro-screen'); if(!screen) return;
    introCanvas = document.createElement('canvas');
    introCanvas.id = 'intro-canvas';
    introCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0;';
    screen.prepend(introCanvas);
    introCtx = introCanvas.getContext('2d');
    resize(); window.addEventListener('resize', resize);
    const c = screen.querySelector('.intro-content'); if(c) c.style.position='relative';
  }

  function resize() { if(!introCanvas) return; introCanvas.width=window.innerWidth; introCanvas.height=window.innerHeight; }

  function buildStepCards() {
    const content = document.querySelector('.intro-content'); if(!content) return;

    const stepsWrap = document.createElement('div');
    stepsWrap.id = 'intro-steps';
    stepsWrap.style.cssText = 'display:flex;gap:1.2rem;justify-content:center;margin-top:2.5rem;z-index:2;pointer-events:none;opacity:0;transform:translateY(20px);';

    [
      { num:'01', label:'Browse', desc:'Explore backgrounds, navbars, heroes and more' },
      { num:'02', label:'Select', desc:'Click anything you like — mix and match freely' },
      { num:'03', label:'Submit', desc:'Fill in your brief and we\'ll be in touch within 48hrs' },
    ].forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'intro-step-card';
      card.style.cssText = `background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:1.4rem 1.2rem;text-align:center;max-width:200px;flex:1;opacity:0;transform:translateY(30px);transition:opacity 0.8s ease ${i*0.2}s,transform 0.8s ease ${i*0.2}s,box-shadow 0.3s ease;backdrop-filter:blur(12px);pointer-events:auto;`;
      card.innerHTML = `<div style="font-family:'Bebas Neue',sans-serif;font-size:2.2rem;color:#00e5ff;line-height:1;margin-bottom:0.4rem;">${s.num}</div><div style="font-family:'Syne',sans-serif;font-size:0.85rem;font-weight:700;margin-bottom:0.4rem;letter-spacing:0.02em;">${s.label}</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.45);line-height:1.6;">${s.desc}</div>`;
      stepsWrap.appendChild(card);
    });

    const btn = document.createElement('button');
    btn.id = 'intro-start-btn';
    btn.textContent = 'Get Started →';
    btn.style.cssText = 'margin-top:2.5rem;font-family:\'Syne\',sans-serif;font-size:0.9rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;background:#00e5ff;color:#000;border:none;padding:16px 44px;border-radius:8px;cursor:pointer;opacity:0;transform:translateY(15px);transition:opacity 1s ease,transform 0.6s ease,box-shadow 0.3s ease,background 0.3s ease;z-index:10;pointer-events:auto;white-space:nowrap;';
    btn.addEventListener('click', () => { if (!started) { started = true; beginMorph(); } });
    btn.addEventListener('mouseenter', () => { btn.style.boxShadow = '0 0 30px rgba(0,229,255,0.5)'; btn.style.background = '#33ebff'; });
    btn.addEventListener('mouseleave', () => { btn.style.boxShadow = 'none'; btn.style.background = '#00e5ff'; });

    content.appendChild(stepsWrap);
    content.appendChild(btn);
  }

  // Skip straight to the showroom: a button on the intro, or the Escape key.
  function buildSkipButton() {
    const screen = document.getElementById('intro-screen'); if(!screen) return;
    const skip = document.createElement('button');
    skip.id = 'intro-skip-btn';
    skip.type = 'button';
    skip.textContent = 'Skip intro';
    skip.addEventListener('click', skipIntro);
    screen.appendChild(skip);
    document.addEventListener('keydown', onEscape);
  }

  function onEscape(e) { if (e.key === 'Escape') skipIntro(); }

  function skipIntro() {
    if (revealed) return;
    started = true; morphing = true; cancelAnimationFrame(introAnimId);
    document.removeEventListener('keydown', onEscape);
    const screen = document.getElementById('intro-screen');
    const main   = document.getElementById('main-app');
    if (screen) screen.style.display = 'none';
    if (main) { main.style.transition = 'none'; main.style.display = 'block'; main.style.opacity = '1'; }
    reveal();
  }

  // Runs once, whether the intro played out or was skipped.
  function reveal() {
    if (revealed) return;
    revealed = true;
    document.removeEventListener('keydown', onEscape);
    if (typeof initCursorReactive === 'function') initCursorReactive();
    if (typeof initAllCanvases    === 'function') initAllCanvases();
    if (typeof initNudge          === 'function') initNudge();
  }

  function initParticles() {
    introParticles = Array.from({ length: P_COUNT }, () => ({
      x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
      vx:(Math.random()-0.5)*P_SPEED, vy:(Math.random()-0.5)*P_SPEED,
      r:Math.random()*1.6+0.5, o:Math.random()*0.6+0.4,
    }));
  }

  let introParticles = [];

  function drawParticles() {
    const w=introCanvas.width, h=introCanvas.height, ctx=introCtx;
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
    introParticles.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=P_COLOR; ctx.globalAlpha=p.o; ctx.fill(); ctx.globalAlpha=1;
    });
    for(let i=0;i<introParticles.length;i++) for(let j=i+1;j<introParticles.length;j++) {
      const a=introParticles[i],b=introParticles[j];
      const dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<P_CONNECT){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=P_COLOR;ctx.globalAlpha=0.1*(1-d/P_CONNECT);ctx.lineWidth=0.6;ctx.stroke();ctx.globalAlpha=1;}
    }
  }

  function animateLoop() { if(!morphing){drawParticles();introAnimId=requestAnimationFrame(animateLoop);} }

  function scheduleReveal() {
    const show = (sel, delay) => setTimeout(() => { const el=document.querySelector(sel); if(el) el.classList.add('visible'); }, delay);
    show('.intro-mark-img', 200);
    show('.intro-logo',     500);
    show('.intro-sub',      900);
    show('.intro-line',    1300);
    show('.intro-tagline', 1800);

    // Step cards appear with stagger (now below tagline)
    setTimeout(() => {
      const steps = document.getElementById('intro-steps');
      if (steps) {
        steps.style.opacity = '1';
        steps.style.transform = 'translateY(0)';
        steps.querySelectorAll('.intro-step-card').forEach((c, i) => { 
          setTimeout(() => {
            c.style.opacity='1'; 
            c.style.transform='translateY(0)'; 
          }, i * 150);
        });
      }
    }, 2400);

    // Get Started button appears with elegant fade
    setTimeout(() => {
      const btn = document.getElementById('intro-start-btn');
      if (btn) {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
        btn.style.pointerEvents = 'auto';
        if (!document.getElementById('btn-pulse-style')) {
          const s = document.createElement('style');
          s.id = 'btn-pulse-style';
          s.textContent = '@keyframes btnPulse{0%,100%{box-shadow:0 0 0 0 rgba(0,229,255,0.4)}50%{box-shadow:0 0 0 20px rgba(0,229,255,0)}}';
          document.head.appendChild(s);
        }
        btn.style.animation = 'btnPulse 3s ease-in-out infinite';
      }
    }, 3600);

    // Auto-advance fallback at 15 seconds (more time to appreciate)
    setTimeout(() => { if (!started) { started = true; beginMorph(); } }, 15000);
  }

  function beginMorph() {
    if (revealed) return;
    morphing = true; cancelAnimationFrame(introAnimId);
    const screen = document.getElementById('intro-screen');
    const main   = document.getElementById('main-app');
    if (!screen) return;
    if (main) { main.style.opacity='0'; main.style.display='block'; }

    drawParticles();

    // Elegant staggered exit animation
    const btn = document.getElementById('intro-start-btn');
    const steps = document.getElementById('intro-steps');
    const content = screen.querySelector('.intro-content');
    
    // Button fades first
    if (btn) { btn.style.transition=`opacity 400ms ease`; btn.style.opacity='0'; }
    
    // Steps fade second
    setTimeout(() => {
      if (steps) { steps.style.transition=`opacity 500ms ease`; steps.style.opacity='0'; steps.style.transform='translateY(-10px)'; }
    }, 200);
    
    // Content fades third
    setTimeout(() => {
      if (content) { content.style.transition=`opacity 800ms ease,transform 800ms ease`; content.style.opacity='0'; content.style.transform='translateY(-20px) scale(0.98)'; }
    }, 400);
    
    // Canvas fades last (longest)
    setTimeout(() => {
      introCanvas.style.transition = `opacity ${MORPH_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      introCanvas.style.opacity = '0';
      introCanvas.style.transform = 'scale(1.08)';
    }, 600);

    // Finally reveal main app
    setTimeout(() => {
      if (revealed) return; // skipped part-way through
      if (screen) screen.style.display = 'none';
      if (main) { 
        main.style.transition=`opacity ${MORPH_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`; 
        main.style.opacity='1'; 
      }
      reveal();
    }, MORPH_DURATION + 600);
  }

  // Ensure DOM is ready before booting
  function startWhenReady() {
    if (document.getElementById('intro-screen')) {
      boot();
    } else {
      setTimeout(startWhenReady, 10);
    }
  }
  
  if (document.readyState === 'loading') { 
    document.addEventListener('DOMContentLoaded', startWhenReady); 
  } else { 
    startWhenReady(); 
  }
})();