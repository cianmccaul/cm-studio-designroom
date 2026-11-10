// ═══════════════════════════════════════════════════════
// ADMIN CODE GENERATORS — admin-generators.js
// ═══════════════════════════════════════════════════════

// ── COLOUR SCHEME ──
function getColourCode(scheme) {
  const map = {
    'Charcoal + Cyan':      {bg:'#0a0a0a',nav:'#141414',accent:'#00e5ff',text:'#f0f0f0',border:'rgba(255,255,255,0.07)'},
    'Navy + Gold':          {bg:'#09101e',nav:'#111828',accent:'#d4a843',text:'#eef0f4',border:'rgba(255,255,255,0.08)'},
    'Black + White':        {bg:'#ffffff',nav:'#f5f5f5',accent:'#000000',text:'#111111',border:'rgba(0,0,0,0.1)'},
    'Dark + Red':           {bg:'#0d0505',nav:'#160808',accent:'#e63333',text:'#f5f2f2',border:'rgba(255,255,255,0.07)'},
    'Slate + Emerald':      {bg:'#0e141a',nav:'#16202a',accent:'#10b981',text:'#e8edf2',border:'rgba(255,255,255,0.07)'},
    'Dark Forest':          {bg:'#080d08',nav:'#101810',accent:'#4ade80',text:'#e8f0e8',border:'rgba(255,255,255,0.07)'},
    'Deep Purple + Violet': {bg:'#120820',nav:'#1a1030',accent:'#a855f7',text:'#f0eaff',border:'rgba(255,255,255,0.08)'},
    'Copper + Orange':      {bg:'#0f0a06',nav:'#1a1008',accent:'#e8943a',text:'#f5efe8',border:'rgba(255,255,255,0.07)'},
    'Midnight + Pink':      {bg:'#08080a',nav:'#121218',accent:'#ff3366',text:'#ffffff',border:'rgba(255,255,255,0.07)'},
    'Ocean Dark + Teal':    {bg:'#060c10',nav:'#0e1820',accent:'#00bcd4',text:'#e8f4ff',border:'rgba(255,255,255,0.07)'},
  };
  const c = map[scheme] || map['Charcoal + Cyan'];
  return `:root {\n  --bg: ${c.bg};\n  --bg-nav: ${c.nav};\n  --accent: ${c.accent};\n  --text: ${c.text};\n  --border: ${c.border};\n}\n\nbody {\n  background: var(--bg);\n  color: var(--text);\n  font-family: 'DM Sans', sans-serif;\n}\n\n.btn-primary { background: var(--accent); color: ${c.bg}; border: none; }\na { color: var(--accent); }`;
}

// ── BACKGROUND ──
function getBackgroundCode(bg) {
  const m = {
    'Dark Grid':      "body {\n  background-color: var(--bg);\n  background-image:\n    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),\n    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);\n  background-size: 28px 28px;\n}",
    'Gradient Flow':  "body {\n  background: linear-gradient(-45deg, #0a0015, #001a2e, #0d1f00, #1a0010);\n  background-size: 400% 400%;\n  animation: gradFlow 6s ease infinite;\n}\n@keyframes gradFlow {\n  0%,100% { background-position: 0% 50%; }\n  50%     { background-position: 100% 50%; }\n}",
    'Mesh Gradient':  "body {\n  background:\n    radial-gradient(ellipse at 20% 50%, rgba(100,30,200,0.28) 0%, transparent 50%),\n    radial-gradient(ellipse at 80% 20%, rgba(0,80,200,0.28) 0%, transparent 50%),\n    radial-gradient(ellipse at 60% 80%, rgba(200,0,60,0.18) 0%, transparent 50%),\n    var(--bg);\n  animation: meshPulse 8s ease-in-out infinite alternate;\n}\n@keyframes meshPulse {\n  0%   { filter: hue-rotate(0deg); }\n  100% { filter: hue-rotate(25deg); }\n}",
    'Aurora':         "body { background: #030310; position: relative; }\nbody::before {\n  content: '';\n  position: fixed; inset: 0;\n  background:\n    radial-gradient(ellipse at 30% 60%, rgba(0,200,150,0.2) 0%, transparent 55%),\n    radial-gradient(ellipse at 70% 30%, rgba(100,0,200,0.2) 0%, transparent 55%);\n  animation: auroraPulse 6s ease-in-out infinite alternate;\n  pointer-events: none; z-index: -1;\n}\n@keyframes auroraPulse { 0% { opacity:0.7; } 100% { opacity:1; } }",
    'Particle Field': "/* Add <canvas id=\"particle-canvas\"> before </body> */\n(function(){\n  const c=document.getElementById('particle-canvas');\n  if(!c){c=document.createElement('canvas');c.id='particle-canvas';c.style='position:fixed;inset:0;z-index:-1;pointer-events:none;';document.body.appendChild(c);}\n  const ctx=c.getContext('2d');let W,H,pts=[];\n  function resize(){W=c.width=innerWidth;H=c.height=innerHeight;}\n  resize();window.addEventListener('resize',resize);\n  for(let i=0;i<80;i++)pts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4});\n  function draw(){\n    ctx.clearRect(0,0,W,H);\n    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);ctx.fillStyle='rgba(0,229,255,0.5)';ctx.fill();});\n    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(d<120){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle='rgba(0,229,255,'+(0.15*(1-d/120))+')';ctx.stroke();}}\n    requestAnimationFrame(draw);\n  }\n  draw();\n})();",
    'Scanlines':      "body { background: #050505; }\nbody::before {\n  content: '';\n  position: fixed; inset: 0;\n  background: repeating-linear-gradient(\n    0deg, transparent, transparent 2px,\n    rgba(0,255,100,0.012) 2px, rgba(0,255,100,0.012) 4px\n  );\n  pointer-events: none; z-index: 9999;\n}",
    'Clean White':    "body {\n  background: #ffffff;\n  color: #111111;\n}",
    'Soft Paper':     "body {\n  background-color: #faf8f5;\n}",
    'Light Gradient': "body {\n  background: linear-gradient(135deg, #f0f4ff 0%, #faf0ff 50%, #f0fff4 100%);\n  animation: lightGrad 8s ease infinite alternate;\n}\n@keyframes lightGrad { 0% { filter:hue-rotate(0deg); } 100% { filter:hue-rotate(30deg); } }",
  };
  return m[bg] || ('/* ' + bg + ' background */\nbody { background: var(--bg); }');
}

// ── INTRO ──
function getIntroCode(intro) {
  const m = {
    'Fade In':      "body { animation: pageFade 0.8s ease both; }\n@keyframes pageFade { from { opacity:0; } to { opacity:1; } }",
    'Slide Up':     "body { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }\n@keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }",
    'Glitch Flash': "body { animation: glitchFlash 0.9s steps(2) both; }\n@keyframes glitchFlash {\n  0%   { clip-path: inset(0 0 100% 0); opacity:0; }\n  40%  { clip-path: inset(0 0 30% 0);  opacity:1; }\n  100% { clip-path: inset(0 0 0% 0);   opacity:1; }\n}",
    'Curtain Split':"/* Add to HTML: <div id=\"intro-curtain\"><div class=\"half\"></div><div class=\"half\"></div></div> */\n#intro-curtain { position:fixed;inset:0;z-index:9999;display:flex; }\n#intro-curtain .half { flex:1;background:#000;transition:transform 0.8s cubic-bezier(0.76,0,0.24,1);transition-delay:0.3s; }\n#intro-curtain.open .half:first-child { transform:translateX(-100%); }\n#intro-curtain.open .half:last-child  { transform:translateX(100%); }\nwindow.addEventListener('load',()=>{\n  setTimeout(()=>document.getElementById('intro-curtain').classList.add('open'),400);\n  setTimeout(()=>document.getElementById('intro-curtain').remove(),1400);\n});",
    'Logo Splash':  "/* Add to HTML: <div id=\"intro-splash\"><div class=\"splash-logo\">YOUR<span>BRAND</span></div></div> */\n#intro-splash { position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;align-items:center;justify-content:center;transition:opacity 0.6s ease,visibility 0.6s ease; }\n#intro-splash .splash-logo { font-family:'Bebas Neue',sans-serif;font-size:4rem;letter-spacing:0.1em;animation:splashPulse 1s ease-in-out; }\n#intro-splash .splash-logo span { color:var(--accent); }\n#intro-splash.hidden { opacity:0;visibility:hidden; }\n@keyframes splashPulse { from { opacity:0;transform:scale(0.85); } to { opacity:1;transform:scale(1); } }\nwindow.addEventListener('load',()=>{ setTimeout(()=>document.getElementById('intro-splash').classList.add('hidden'),1600); });",
  };
  return m[intro] || "body { animation: pageFade 0.8s ease both; }\n@keyframes pageFade { from { opacity:0; } to { opacity:1; } }";
}

// ── NAVBAR ──
function getNavbarCode(variant, biz) {
  const name = biz || 'Your Brand';
  const p = name.split(' '), l1 = p[0], l2 = p.slice(1).join(' ');
  return `<!-- ${variant} Navbar -->
<nav class="navbar">
  <a class="nav-logo" href="#">${l1}<span>${l2}</span></a>
  <button class="nav-toggle" id="nav-toggle">&#9776;</button>
  <div class="nav-links" id="nav-links">
    <a href="#">Home</a>
    <a href="#services">Services</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
    <a href="#contact" class="nav-cta">Get in Touch</a>
  </div>
</nav>

<style>
.navbar{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;background:var(--bg-nav);border-bottom:1px solid var(--border);backdrop-filter:blur(20px);}
.nav-logo{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;letter-spacing:0.08em;color:var(--text);text-decoration:none;}
.nav-logo span{color:var(--accent);}
.nav-links{display:flex;gap:2rem;align-items:center;}
.nav-links a{font-size:0.78rem;color:var(--text);opacity:0.55;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;transition:all 0.2s;}
.nav-links a:hover{opacity:1;color:var(--accent);}
.nav-cta{background:var(--accent)!important;color:#000!important;opacity:1!important;padding:7px 18px;border-radius:5px;font-weight:700!important;}
.nav-toggle{display:none;background:none;border:none;color:var(--text);font-size:1.4rem;cursor:pointer;}
@media(max-width:768px){
  .nav-toggle{display:block;}
  .nav-links{display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;background:var(--bg-nav);padding:1rem 2rem;border-bottom:1px solid var(--border);gap:1rem;}
  .nav-links.open{display:flex;}
}
</style>

<script>
document.getElementById('nav-toggle').addEventListener('click',()=>document.getElementById('nav-links').classList.toggle('open'));
<\/script>`;
}

// ── HERO ──
function getHeroCode(variant, biz, tagline) {
  const name = biz || 'Your Brand';
  const p = name.split(' '), h1a = p[0], h1b = p.slice(1).join(' ');
  const sub = tagline || 'Professional services for modern businesses across Ireland.';
  return `<!-- ${variant} Hero -->
<section class="hero">
  <p class="hero-eyebrow">Professional Services · Ireland</p>
  <h1>${h1a} <span>${h1b}</span></h1>
  <div class="hero-line"></div>
  <p class="hero-sub">${sub}</p>
  <div class="hero-actions">
    <a href="#contact" class="btn-primary">Get in Touch</a>
    <a href="#services" class="btn-ghost">Our Services</a>
  </div>
</section>

<style>
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem 4rem;}
.hero-eyebrow{font-size:0.72rem;color:var(--accent);letter-spacing:0.28em;text-transform:uppercase;margin-bottom:1.2rem;}
h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,8vw,7rem);letter-spacing:0.06em;line-height:0.9;margin-bottom:1.2rem;}
h1 span{color:var(--accent);}
.hero-line{width:48px;height:2px;background:var(--accent);margin:0 auto 1.5rem;}
.hero-sub{font-size:1.05rem;opacity:0.55;max-width:520px;margin:0 auto 2.5rem;line-height:1.7;}
.hero-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
.btn-primary{background:var(--accent);color:#000;padding:14px 34px;border-radius:5px;font-size:0.84rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;border:none;cursor:pointer;}
.btn-ghost{border:1px solid var(--accent);color:var(--accent);padding:13px 30px;border-radius:5px;font-size:0.84rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;}
</style>`;
}

// ── CARDS ──
function getCardCode(variant) {
  return `<!-- ${variant} Service Cards -->
<section class="services" id="services">
  <div class="services-inner">
    <h2 class="section-title">Our <span>Services</span></h2>
    <div class="services-grid">
      <div class="service-card anim-el"><div class="card-icon">✦</div><h3>Service One</h3><p>Replace with your first service description.</p></div>
      <div class="service-card anim-el"><div class="card-icon">⚡</div><h3>Service Two</h3><p>Replace with your second service description.</p></div>
      <div class="service-card anim-el"><div class="card-icon">★</div><h3>Service Three</h3><p>Replace with your third service description.</p></div>
    </div>
  </div>
</section>

<style>
.services{padding:6rem 2rem;}
.services-inner{max-width:960px;margin:0 auto;}
.section-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,5vw,3.5rem);letter-spacing:0.06em;margin-bottom:3rem;text-align:center;}
.section-title span{color:var(--accent);}
.services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.2rem;}
.service-card{background:var(--bg-nav);border:1px solid var(--border);border-radius:12px;padding:1.8rem;transition:border-color 0.25s,transform 0.25s;}
.service-card:hover{border-color:var(--accent);transform:translateY(-5px);}
.card-icon{font-size:1.4rem;color:var(--accent);margin-bottom:1rem;display:block;}
.service-card h3{font-size:1rem;font-weight:700;margin-bottom:0.5rem;}
.service-card p{font-size:0.84rem;opacity:0.5;line-height:1.65;}
</style>`;
}

// ── FOOTER ──
function getFooterCode(variant, biz, phone, email) {
  const name = biz || 'Your Brand';
  const p = name.split(' '), l1 = p[0], l2 = p.slice(1).join(' ');
  const yr = new Date().getFullYear();
  const ph = phone || '+353 87 000 0000';
  const em = email || 'hello@yourbrand.ie';
  return `<!-- ${variant} Footer -->
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="footer-logo">${l1}<span>${l2}</span></div>
      <p>Professional services across Ireland.</p>
    </div>
    <div class="footer-col">
      <span class="footer-heading">Quick Links</span>
      <a href="#">Home</a><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a>
    </div>
    <div class="footer-col">
      <span class="footer-heading">Contact</span>
      <a href="tel:${ph.replace(/\s/g,'')}">📞 ${ph}</a>
      <a href="mailto:${em}">✉ ${em}</a>
    </div>
  </div>
  <div class="footer-bottom"><p>© ${yr} ${name}. All rights reserved.</p></div>
</footer>

<style>
.site-footer{background:var(--bg-nav);border-top:1px solid var(--border);padding:3rem 2rem 1.5rem;}
.footer-inner{display:grid;grid-template-columns:2fr 1fr 1fr;gap:2rem;max-width:960px;margin:0 auto 2rem;}
.footer-logo{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:0.08em;margin-bottom:0.5rem;}
.footer-logo span{color:var(--accent);}
.footer-brand p{font-size:0.82rem;opacity:0.35;line-height:1.6;margin-top:0.4rem;}
.footer-heading{display:block;font-size:0.65rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:0.8rem;}
.footer-col{display:flex;flex-direction:column;gap:0.45rem;}
.footer-col a{font-size:0.82rem;opacity:0.4;text-decoration:none;color:var(--text);transition:opacity 0.2s;}
.footer-col a:hover{opacity:0.9;color:var(--accent);}
.footer-bottom{border-top:1px solid var(--border);padding-top:1.2rem;font-size:0.7rem;opacity:0.25;max-width:960px;margin:0 auto;}
@media(max-width:640px){.footer-inner{grid-template-columns:1fr 1fr;}.footer-brand{grid-column:1/-1;}}
</style>`;
}

// ── CONTACT FORM ──
function getFormCode(variant) {
  return `<!-- ${variant} Contact Form — Formspree (free tier) -->
<!-- Sign up at formspree.io, create a form, replace YOUR_FORM_ID -->
<section class="contact-section" id="contact">
  <div class="contact-inner">
    <h2 class="section-title">Get in <span>Touch</span></h2>
    <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form" id="contact-form">
      <div class="form-row">
        <div class="form-field"><label>First Name</label><input type="text" name="first_name" placeholder="John" required></div>
        <div class="form-field"><label>Last Name</label><input type="text" name="last_name" placeholder="Smith" required></div>
      </div>
      <div class="form-field"><label>Email</label><input type="email" name="email" placeholder="john@example.com" required></div>
      <div class="form-field"><label>Phone</label><input type="tel" name="phone" placeholder="+353 87 000 0000"></div>
      <div class="form-field"><label>Message</label><textarea name="message" rows="5" placeholder="Tell us how we can help..." required></textarea></div>
      <button type="submit" class="btn-primary" style="width:100%;padding:14px;border-radius:6px;font-size:0.84rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;border:none;">Send Message →</button>
      <div id="form-success" style="display:none;text-align:center;padding:1rem;color:var(--accent);font-weight:700;">✓ Message sent! We'll be in touch shortly.</div>
    </form>
  </div>
</section>

<style>
.contact-section{padding:6rem 2rem;}
.contact-inner{max-width:600px;margin:0 auto;}
.contact-form{display:flex;flex-direction:column;gap:1.1rem;margin-top:2.5rem;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.form-field{display:flex;flex-direction:column;gap:0.4rem;}
.form-field label{font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;opacity:0.45;}
.form-field input,.form-field textarea{background:rgba(255,255,255,0.04);border:1px solid var(--border);color:var(--text);padding:11px 14px;border-radius:6px;font-size:0.9rem;font-family:inherit;outline:none;transition:border-color 0.2s;}
.form-field input:focus,.form-field textarea:focus{border-color:var(--accent);}
@media(max-width:500px){.form-row{grid-template-columns:1fr;}}
</style>

<script>
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...'; btn.disabled = true;
  const res = await fetch(this.action, { method: 'POST', body: new FormData(this), headers: { Accept: 'application/json' } });
  if (res.ok) { this.reset(); document.getElementById('form-success').style.display = 'block'; btn.style.display = 'none'; }
  else { btn.textContent = 'Try Again'; btn.disabled = false; }
});
<\/script>`;
}

// ── SCROLL ANIMATION ──
function getAnimCode(variant) {
  const effects = {
    'Fade Up':    {from:'opacity:0;transform:translateY(30px)',to:'opacity:1;transform:translateY(0)'},
    'Fade In':    {from:'opacity:0',to:'opacity:1'},
    'Slide Left': {from:'opacity:0;transform:translateX(40px)',to:'opacity:1;transform:translateX(0)'},
    'Scale Up':   {from:'opacity:0;transform:scale(0.92)',to:'opacity:1;transform:scale(1)'},
  };
  const e = effects[variant] || effects['Fade Up'];
  return `/* ${variant} Scroll Animations */
/* Add class="anim-el" to any element you want animated on scroll */

<style>
.anim-el { ${e.from}; transition:opacity 0.7s ease,transform 0.7s ease; }
.anim-el.visible { ${e.to}; }
.anim-el:nth-child(2){transition-delay:0.1s;}
.anim-el:nth-child(3){transition-delay:0.2s;}
.anim-el:nth-child(4){transition-delay:0.3s;}
.anim-el:nth-child(5){transition-delay:0.4s;}
</style>

<script>
const _ao = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); _ao.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.anim-el').forEach(el => _ao.observe(el));
<\/script>`;
}

// ── FEATURES ──
function getFeatureCode(type, extra) {
  if (type === 'chat') return `<!-- Live Chat FAB -->
<div class="chat-fab" onclick="chatOpen()">💬<span class="chat-dot"></span></div>
<div class="chat-window" id="chat-window">
  <div class="chat-hdr"><div><div class="chat-hdr-name">Chat with us</div><div class="chat-hdr-status">● Online</div></div><button onclick="chatClose()">✕</button></div>
  <div class="chat-body" id="chat-body"><div class="chat-msg bot">👋 Hi! How can we help you today?</div></div>
  <div class="chat-input-row"><input id="chat-input" placeholder="Type a message…" onkeydown="if(event.key==='Enter')chatSend()"><button onclick="chatSend()">↑</button></div>
</div>
<style>
.chat-fab{position:fixed;bottom:2rem;right:2rem;width:54px;height:54px;background:var(--accent);color:#000;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.4rem;cursor:pointer;z-index:999;box-shadow:0 4px 20px rgba(0,0,0,0.4);}
.chat-dot{position:absolute;top:4px;right:4px;width:10px;height:10px;background:#4ade80;border-radius:50%;border:2px solid var(--bg);}
.chat-window{position:fixed;bottom:6rem;right:2rem;width:300px;background:var(--bg-nav);border:1px solid var(--border);border-radius:12px;overflow:hidden;display:none;flex-direction:column;z-index:998;box-shadow:0 8px 40px rgba(0,0,0,0.5);}
.chat-window.open{display:flex;}
.chat-hdr{display:flex;align-items:center;justify-content:space-between;padding:0.9rem 1rem;background:var(--accent);color:#000;}
.chat-hdr-name{font-weight:700;font-size:0.85rem;}
.chat-hdr-status{font-size:0.68rem;opacity:0.7;}
.chat-hdr button{background:none;border:none;cursor:pointer;font-size:1.1rem;color:#000;}
.chat-body{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:0.6rem;min-height:160px;max-height:260px;}
.chat-msg{padding:8px 12px;border-radius:10px;font-size:0.82rem;max-width:85%;line-height:1.5;}
.chat-msg.bot{background:rgba(255,255,255,0.07);align-self:flex-start;}
.chat-msg.user{background:var(--accent);color:#000;align-self:flex-end;}
.chat-input-row{display:flex;gap:0.4rem;padding:0.7rem;border-top:1px solid var(--border);}
.chat-input-row input{flex:1;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text);padding:8px 10px;border-radius:6px;font-size:0.82rem;font-family:inherit;outline:none;}
.chat-input-row button{background:var(--accent);color:#000;border:none;border-radius:6px;width:34px;cursor:pointer;font-size:1rem;}
</style>
<script>
function chatOpen(){document.getElementById('chat-window').classList.add('open');}
function chatClose(){document.getElementById('chat-window').classList.remove('open');}
function chatSend(){
  const i=document.getElementById('chat-input'),b=document.getElementById('chat-body');
  if(!i.value.trim())return;
  const m=document.createElement('div');m.className='chat-msg user';m.textContent=i.value.trim();b.appendChild(m);i.value='';b.scrollTop=b.scrollHeight;
  setTimeout(()=>{const r=document.createElement('div');r.className='chat-msg bot';r.textContent="Thanks! We'll get back to you shortly.";b.appendChild(r);b.scrollTop=b.scrollHeight;},1000);
}
<\/script>`;

  if (type === 'maps') return `<!-- Google Maps Embed -->
<!-- Replace YOUR_API_KEY and YOUR_ADDRESS -->
<section class="map-section" id="location">
  <div class="map-inner">
    <h2 class="section-title">Find <span>Us</span></h2>
    <div class="map-wrap">
      <iframe src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=YOUR_ADDRESS,Ireland"
        width="100%" height="400" style="border:0;border-radius:10px;" allowfullscreen loading="lazy"></iframe>
    </div>
  </div>
</section>
<style>
.map-section{padding:4rem 2rem;}
.map-inner{max-width:960px;margin:0 auto;}
.map-wrap{margin-top:2rem;border:1px solid var(--border);border-radius:10px;overflow:hidden;}
</style>`;

  if (type === 'whatsapp') {
    const num = (extra || '').replace(/[^0-9]/g, '').replace(/^353/, '').replace(/^0/, '');
    return `<!-- WhatsApp Floating Button -->
<a class="wa-btn" href="https://wa.me/353${num}" target="_blank" rel="noopener" title="Chat on WhatsApp">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
</a>
<style>
.wa-btn{position:fixed;bottom:2rem;left:2rem;width:54px;height:54px;background:#25D366;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:999;box-shadow:0 4px 20px rgba(0,0,0,0.3);text-decoration:none;transition:transform 0.2s;}
.wa-btn:hover{transform:scale(1.1);}
</style>`;
  }

  if (type === 'cookie') return `<!-- Cookie Consent Banner -->
<div class="cookie-banner" id="cookie-banner">
  <div class="cookie-inner">
    <p>🍪 We use cookies to improve your experience. <a href="/privacy">Learn more</a>.</p>
    <div class="cookie-btns">
      <button class="cookie-decline" onclick="cookieDecline()">Decline</button>
      <button class="cookie-accept" onclick="cookieAccept()">Accept All</button>
    </div>
  </div>
</div>
<style>
.cookie-banner{position:fixed;bottom:0;left:0;right:0;background:var(--bg-nav);border-top:1px solid var(--border);z-index:9998;transform:translateY(100%);transition:transform 0.4s ease;}
.cookie-banner.show{transform:translateY(0);}
.cookie-inner{max-width:960px;margin:0 auto;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:0.82rem;}
.cookie-inner a{color:var(--accent);}
.cookie-btns{display:flex;gap:0.5rem;flex-shrink:0;}
.cookie-decline{background:none;border:1px solid var(--border);color:var(--text);padding:7px 16px;border-radius:5px;cursor:pointer;font-size:0.78rem;opacity:0.6;}
.cookie-accept{background:var(--accent);color:#000;border:none;padding:7px 16px;border-radius:5px;cursor:pointer;font-size:0.78rem;font-weight:700;}
</style>
<script>
function cookieAccept(){localStorage.setItem('cookie_consent','accepted');document.getElementById('cookie-banner').classList.remove('show');}
function cookieDecline(){localStorage.setItem('cookie_consent','declined');document.getElementById('cookie-banner').classList.remove('show');}
if(!localStorage.getItem('cookie_consent')){setTimeout(()=>document.getElementById('cookie-banner').classList.add('show'),1000);}
<\/script>`;

  if (type === 'social') return `<!-- Social Media Icon Bar -->
<div class="social-bar">
  <a href="https://facebook.com/YOURBRAND" target="_blank" class="social-link" aria-label="Facebook">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
  </a>
  <a href="https://instagram.com/YOURBRAND" target="_blank" class="social-link" aria-label="Instagram">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
  </a>
  <a href="https://linkedin.com/company/YOURBRAND" target="_blank" class="social-link" aria-label="LinkedIn">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
  </a>
</div>
<style>
.social-bar{display:flex;gap:0.8rem;align-items:center;}
.social-link{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text);opacity:0.5;transition:all 0.2s;text-decoration:none;}
.social-link:hover{opacity:1;color:var(--accent);border-color:var(--accent);}
</style>`;

  if (type === 'faq') return `<!-- FAQ Accordion -->
<section class="faq-section" id="faq">
  <div class="faq-inner">
    <h2 class="section-title">Frequently Asked <span>Questions</span></h2>
    <div class="faq-list">
      <div class="faq-item"><button class="faq-q" onclick="faqToggle(this)"><span>How long does a website take?</span><span class="faq-icon">+</span></button><div class="faq-a">Most websites are completed within 2–4 weeks depending on size and complexity.</div></div>
      <div class="faq-item"><button class="faq-q" onclick="faqToggle(this)"><span>What do I need to get started?</span><span class="faq-icon">+</span></button><div class="faq-a">Just your business name, a rough idea of what you want, and a way to contact you. We handle the rest.</div></div>
      <div class="faq-item"><button class="faq-q" onclick="faqToggle(this)"><span>Do you offer ongoing support?</span><span class="faq-icon">+</span></button><div class="faq-a">Yes — all sites come with 30 days of free support after launch, and affordable monthly plans after that.</div></div>
      <div class="faq-item"><button class="faq-q" onclick="faqToggle(this)"><span>Can I update the site myself?</span><span class="faq-icon">+</span></button><div class="faq-a">Absolutely. We build with easy content management in mind so you can update text and images yourself.</div></div>
    </div>
  </div>
</section>
<style>
.faq-section{padding:5rem 2rem;}
.faq-inner{max-width:720px;margin:0 auto;}
.faq-list{margin-top:2.5rem;display:flex;flex-direction:column;gap:0.5rem;}
.faq-item{border:1px solid var(--border);border-radius:8px;overflow:hidden;}
.faq-q{width:100%;display:flex;justify-content:space-between;align-items:center;padding:1rem 1.2rem;background:none;border:none;color:var(--text);font-size:0.92rem;font-weight:600;cursor:pointer;text-align:left;gap:1rem;}
.faq-icon{font-size:1.2rem;color:var(--accent);transition:transform 0.2s;flex-shrink:0;}
.faq-item.open .faq-icon{transform:rotate(45deg);}
.faq-a{max-height:0;overflow:hidden;transition:max-height 0.35s ease,padding 0.35s ease;font-size:0.84rem;line-height:1.7;padding:0 1.2rem;opacity:0.6;}
.faq-item.open .faq-a{max-height:200px;padding:0.5rem 1.2rem 1rem;}
</style>
<script>
function faqToggle(btn){const item=btn.closest('.faq-item');const isOpen=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));if(!isOpen)item.classList.add('open');}
<\/script>`;

  if (type === 'newsletter') return `<!-- Newsletter Signup -->
<section class="nl-section" id="newsletter">
  <div class="nl-inner">
    <div class="nl-card">
      <h3 class="nl-title">Stay in the <span>Loop</span></h3>
      <p class="nl-sub">Get tips, updates and exclusive offers straight to your inbox.</p>
      <form class="nl-form" id="nl-form" onsubmit="nlSubmit(event)">
        <input type="email" class="nl-input" placeholder="your@email.com" required>
        <button type="submit" class="btn-primary" style="padding:11px 24px;border-radius:5px;font-size:0.82rem;font-weight:700;cursor:pointer;white-space:nowrap;border:none;">Subscribe →</button>
      </form>
      <div class="nl-success" id="nl-success" style="display:none;">✓ You're subscribed! Check your inbox.</div>
    </div>
  </div>
</section>
<style>
.nl-section{padding:4rem 2rem;}
.nl-inner{max-width:560px;margin:0 auto;}
.nl-card{background:var(--bg-nav);border:1px solid var(--border);border-radius:16px;padding:2.5rem;text-align:center;}
.nl-title{font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:0.06em;margin-bottom:0.5rem;}
.nl-title span{color:var(--accent);}
.nl-sub{font-size:0.85rem;opacity:0.5;line-height:1.6;margin-bottom:1.5rem;}
.nl-form{display:flex;gap:0.5rem;max-width:400px;margin:0 auto;}
.nl-input{flex:1;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text);padding:11px 14px;border-radius:5px;font-size:0.9rem;font-family:inherit;outline:none;transition:border-color 0.2s;}
.nl-input:focus{border-color:var(--accent);}
.nl-success{color:var(--accent);font-weight:700;font-size:0.9rem;margin-top:1rem;}
</style>
<script>
function nlSubmit(e){e.preventDefault();document.getElementById('nl-form').style.display='none';document.getElementById('nl-success').style.display='block';}
<\/script>`;

  if (type === 'reviews') return `<!-- Reviews / Testimonials Carousel -->
<section class="reviews-section" id="reviews">
  <div class="reviews-inner">
    <h2 class="section-title">What Clients <span>Say</span></h2>
    <div class="rev-wrap">
      <div class="rev-track">
        <div class="rev-card active"><div class="rev-stars">★★★★★</div><p class="rev-text">"Absolutely fantastic work. Delivered on time, exactly what we wanted."</p><div class="rev-author">— Sarah M., Dublin</div></div>
        <div class="rev-card"><div class="rev-stars">★★★★★</div><p class="rev-text">"Professional, fast and affordable. Our website has never looked better."</p><div class="rev-author">— John B., Cork</div></div>
        <div class="rev-card"><div class="rev-stars">★★★★★</div><p class="rev-text">"The team understood our vision immediately. Highly recommend to anyone."</p><div class="rev-author">— Emma K., Galway</div></div>
      </div>
      <div class="rev-controls"><button onclick="revMove(-1)">‹</button><div class="rev-dots" id="rev-dots"></div><button onclick="revMove(1)">›</button></div>
    </div>
  </div>
</section>
<style>
.reviews-section{padding:5rem 2rem;}
.reviews-inner{max-width:720px;margin:0 auto;}
.rev-card{background:var(--bg-nav);border:1px solid var(--border);border-radius:12px;padding:2rem;display:none;}
.rev-card.active{display:block;animation:revFade 0.4s ease;}
@keyframes revFade{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.rev-stars{color:var(--accent);font-size:1.1rem;margin-bottom:1rem;}
.rev-text{font-size:1rem;line-height:1.7;opacity:0.75;margin-bottom:1.2rem;font-style:italic;}
.rev-author{font-size:0.78rem;font-weight:700;letter-spacing:0.06em;opacity:0.4;text-transform:uppercase;}
.rev-controls{display:flex;align-items:center;justify-content:center;gap:1rem;margin-top:1.2rem;}
.rev-controls button{background:rgba(255,255,255,0.07);border:1px solid var(--border);color:var(--text);width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1.2rem;}
.rev-dots{display:flex;gap:0.4rem;}
.rev-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.14);border:none;cursor:pointer;transition:background 0.2s;}
.rev-dot.active{background:var(--accent);}
</style>
<script>
(function(){
  let idx=0;const cards=document.querySelectorAll('.rev-card');const dotsEl=document.getElementById('rev-dots');
  if(!cards.length)return;
  dotsEl.innerHTML=Array.from(cards).map((_,i)=>'<button class="rev-dot'+(i===0?' active':'')+'" onclick="revGo('+i+')"></button>').join('');
  window.revMove=d=>revGo((idx+d+cards.length)%cards.length);
  window.revGo=n=>{cards[idx].classList.remove('active');document.querySelectorAll('.rev-dot')[idx].classList.remove('active');idx=n;cards[idx].classList.add('active');document.querySelectorAll('.rev-dot')[idx].classList.add('active');};
  setInterval(()=>revMove(1),4000);
})();
<\/script>`;

  if (type === 'search') return `<!-- Site Search -->
<div class="search-bar-wrap">
  <input class="search-input" id="site-search" placeholder="Search…" oninput="siteSearch(this.value)" onkeydown="if(event.key==='Escape')clearSearch()">
  <span class="search-icon">⌕</span>
  <button class="search-clear" onclick="clearSearch()">✕</button>
</div>
<div class="search-results" id="search-results"></div>
<style>
.search-bar-wrap{position:relative;max-width:500px;margin:0 auto;}
.search-input{width:100%;background:rgba(255,255,255,0.06);border:1px solid var(--border);color:var(--text);padding:12px 40px 12px 16px;border-radius:8px;font-size:0.9rem;font-family:inherit;outline:none;transition:border-color 0.2s;}
.search-input:focus{border-color:var(--accent);}
.search-icon{position:absolute;right:36px;top:50%;transform:translateY(-50%);font-size:1.1rem;opacity:0.3;pointer-events:none;}
.search-clear{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text);opacity:0.3;cursor:pointer;}
.search-results{margin-top:0.5rem;display:flex;flex-direction:column;gap:0.4rem;}
.search-result{padding:0.8rem 1rem;background:var(--bg-nav);border:1px solid var(--border);border-radius:7px;font-size:0.84rem;cursor:pointer;transition:border-color 0.15s;text-decoration:none;color:var(--text);display:block;}
.search-result:hover{border-color:var(--accent);}
.search-result strong{color:var(--accent);display:block;margin-bottom:2px;}
</style>
<script>
const _sd=[{title:'Home',desc:'Welcome to our website.',href:'/'},{title:'Services',desc:'View all our professional services.',href:'#services'},{title:'About',desc:'Learn more about who we are.',href:'#about'},{title:'Contact',desc:'Get in touch with our team.',href:'#contact'}];
function siteSearch(v){const el=document.getElementById('search-results');if(!el)return;const q=v.toLowerCase().trim();if(!q){el.innerHTML='';return;}const m=_sd.filter(r=>r.title.toLowerCase().includes(q)||r.desc.toLowerCase().includes(q));el.innerHTML=m.length?m.map(r=>'<a class="search-result" href="'+r.href+'"><strong>'+r.title+'</strong>'+r.desc+'</a>').join(''):'<div class="search-result" style="opacity:0.5;cursor:default;">No results found.</div>';}
function clearSearch(){document.getElementById('site-search').value='';document.getElementById('search-results').innerHTML='';}
<\/script>`;

  if (type === 'booking') return `<!-- Online Booking System -->
<section class="booking-section" id="book">
  <div class="booking-inner">
    <h2 class="section-title">Book an <span>Appointment</span></h2>
    <div class="booking-card">
      <div class="bk-step" id="bk-1">
        <p class="bk-label">Select a date</p>
        <div class="bk-month-hdr"><button onclick="bkPrevMonth()">‹</button><span id="bk-month"></span><button onclick="bkNextMonth()">›</button></div>
        <div class="bk-weekdays"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div>
        <div class="bk-days" id="bk-days"></div>
      </div>
      <div class="bk-step" id="bk-2" style="display:none">
        <p class="bk-label">Select a time</p>
        <div class="bk-times" id="bk-times"></div>
        <button class="bk-back" onclick="bkGoStep(1)">← Back</button>
      </div>
      <div class="bk-step" id="bk-3" style="display:none">
        <p class="bk-label">Your details</p>
        <input class="bk-input" placeholder="Full Name" id="bk-name">
        <input class="bk-input" placeholder="Email" id="bk-email">
        <div class="bk-actions">
          <button class="bk-back" onclick="bkGoStep(2)">← Back</button>
          <button class="btn-primary" style="padding:10px 24px;border-radius:5px;font-weight:700;cursor:pointer;border:none;" onclick="bkConfirm()">Confirm →</button>
        </div>
      </div>
      <div class="bk-step" id="bk-done" style="display:none;text-align:center;padding:2rem;">
        <div style="font-size:2.5rem;color:var(--accent);margin-bottom:1rem;">✓</div>
        <strong>You're booked!</strong>
        <p id="bk-summary" style="opacity:0.5;margin-top:0.5rem;font-size:0.85rem;"></p>
        <button class="bk-back" onclick="bkReset()">Book Again</button>
      </div>
    </div>
  </div>
</section>
<style>
.booking-section{padding:5rem 2rem;}
.booking-inner{max-width:500px;margin:0 auto;}
.booking-card{background:var(--bg-nav);border:1px solid var(--border);border-radius:12px;padding:1.8rem;margin-top:2rem;}
.bk-label{font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;opacity:0.4;margin-bottom:1rem;}
.bk-month-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;font-weight:700;}
.bk-month-hdr button{background:none;border:1px solid var(--border);color:var(--text);width:30px;height:30px;border-radius:5px;cursor:pointer;}
.bk-weekdays{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:4px;}
.bk-weekdays span{text-align:center;font-size:0.65rem;opacity:0.35;font-weight:700;}
.bk-days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;}
.bk-day{text-align:center;padding:6px 0;border-radius:5px;font-size:0.82rem;cursor:pointer;}
.bk-day:not(.bk-empty):not(.bk-past):hover{background:rgba(0,229,255,0.1);}
.bk-day.bk-sel{background:var(--accent);color:#000;font-weight:700;}
.bk-day.bk-past{opacity:0.2;cursor:default;}
.bk-times{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;}
.bk-time{padding:7px 14px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:6px;font-size:0.82rem;cursor:pointer;}
.bk-time:hover{border-color:var(--accent);}
.bk-time.bk-sel{background:var(--accent);color:#000;border-color:var(--accent);font-weight:700;}
.bk-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--border);color:var(--text);padding:10px 14px;border-radius:6px;font-size:0.88rem;font-family:inherit;outline:none;margin-bottom:0.75rem;}
.bk-input:focus{border-color:var(--accent);}
.bk-actions{display:flex;justify-content:space-between;margin-top:1rem;}
.bk-back{background:none;border:1px solid var(--border);color:var(--text);padding:8px 16px;border-radius:5px;cursor:pointer;font-size:0.8rem;}
</style>
<script>
let _bkDay=null,_bkTime=null,_bkYear,_bkMonth;
(function(){const n=new Date();_bkYear=n.getFullYear();_bkMonth=n.getMonth();bkRenderDays();})();
function bkRenderDays(){
  const mo=['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('bk-month').textContent=mo[_bkMonth]+' '+_bkYear;
  const first=new Date(_bkYear,_bkMonth,1).getDay(),off=(first+6)%7,total=new Date(_bkYear,_bkMonth+1,0).getDate(),n=new Date();
  let h='';for(let i=0;i<off;i++)h+='<div class="bk-day bk-empty"></div>';
  for(let d=1;d<=total;d++){const past=(_bkYear===n.getFullYear()&&_bkMonth===n.getMonth()&&d<n.getDate())||(_bkYear===n.getFullYear()&&_bkMonth<n.getMonth())||_bkYear<n.getFullYear();h+='<div class="bk-day'+(past?' bk-past':'')+'" '+(past?'':('onclick="bkPickDay(this,'+d+')"'))+'>'+d+'</div>';}
  document.getElementById('bk-days').innerHTML=h;
}
function bkPrevMonth(){if(_bkMonth===0){_bkMonth=11;_bkYear--;}else _bkMonth--;bkRenderDays();}
function bkNextMonth(){if(_bkMonth===11){_bkMonth=0;_bkYear++;}else _bkMonth++;bkRenderDays();}
function bkPickDay(el,d){_bkDay=d;document.querySelectorAll('.bk-day').forEach(x=>x.classList.remove('bk-sel'));el.classList.add('bk-sel');document.getElementById('bk-times').innerHTML=['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'].map(t=>'<div class="bk-time" onclick="bkPickTime(this,\''+t+'\')">'+t+'</div>').join('');bkGoStep(2);}
function bkPickTime(el,t){_bkTime=t;document.querySelectorAll('.bk-time').forEach(x=>x.classList.remove('bk-sel'));el.classList.add('bk-sel');bkGoStep(3);}
function bkGoStep(n){['bk-1','bk-2','bk-3','bk-done'].forEach((id,i)=>document.getElementById(id).style.display=(i===n-1?'':'none'));}
function bkConfirm(){const name=document.getElementById('bk-name').value.trim(),email=document.getElementById('bk-email').value.trim();if(!name||!email){alert('Please fill in both fields.');return;}const mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];document.getElementById('bk-summary').textContent=name+' · '+_bkDay+' '+mo[_bkMonth]+' '+_bkYear+' at '+_bkTime;bkGoStep(4);}
function bkReset(){_bkDay=null;_bkTime=null;document.getElementById('bk-name').value='';document.getElementById('bk-email').value='';bkGoStep(1);}
<\/script>`;

  if (type === 'shop') return `<!-- Product Shop -->
<section class="shop-section" id="shop">
  <div class="shop-inner">
    <h2 class="section-title">Our <span>Products</span></h2>
    <div class="shop-bar">
      <span>Cart</span>
      <span class="shop-badge" id="shop-badge">0</span>
      <span id="shop-total" style="margin-left:auto;font-weight:700;">€0</span>
      <button class="shop-view-btn" id="shop-view-btn" onclick="shopViewBasket()" style="display:none;">🛒 Basket</button>
    </div>
    <div class="shop-grid" id="shop-grid">
      <div class="shop-card"><div class="shop-img" style="background:linear-gradient(135deg,#1a1a2e,#16213e);"></div><div class="shop-name">Starter Pack</div><div class="shop-price">€29</div><button class="shop-add" onclick="shopAdd(this,'Starter Pack',29)">Add to Cart</button></div>
      <div class="shop-card"><div class="shop-img" style="background:linear-gradient(135deg,#0d1b2a,#1b4332);"></div><div class="shop-name">Pro Bundle</div><div class="shop-price">€59</div><button class="shop-add" onclick="shopAdd(this,'Pro Bundle',59)">Add to Cart</button></div>
      <div class="shop-card"><div class="shop-img" style="background:linear-gradient(135deg,#2d1b69,#11998e);"></div><div class="shop-name">Premium Kit</div><div class="shop-price">€99</div><button class="shop-add" onclick="shopAdd(this,'Premium Kit',99)">Add to Cart</button></div>
    </div>
    <div class="shop-basket" id="shop-basket" style="display:none;"></div>
  </div>
</section>
<style>
.shop-section{padding:5rem 2rem;}.shop-inner{max-width:960px;margin:0 auto;}
.shop-bar{display:flex;align-items:center;gap:0.75rem;background:var(--bg-nav);border:1px solid var(--border);border-radius:8px;padding:0.75rem 1.2rem;margin-bottom:1.5rem;font-size:0.85rem;}
.shop-badge{background:var(--accent);color:#000;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;}
.shop-view-btn{background:rgba(0,229,255,0.1);color:var(--accent);border:1px solid rgba(0,229,255,0.25);padding:5px 12px;border-radius:5px;cursor:pointer;font-size:0.78rem;font-weight:700;}
.shop-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;}
.shop-card{background:var(--bg-nav);border:1px solid var(--border);border-radius:10px;overflow:hidden;transition:border-color 0.2s;}
.shop-card:hover{border-color:var(--accent);}
.shop-img{width:100%;height:140px;}
.shop-name{padding:0.8rem 1rem 0.2rem;font-weight:700;font-size:0.9rem;}
.shop-price{padding:0 1rem 0.75rem;color:var(--accent);font-weight:700;}
.shop-add{width:calc(100% - 2rem);margin:0 1rem 1rem;background:var(--accent);color:#000;border:none;padding:9px;border-radius:5px;font-size:0.8rem;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:0.06em;}
.basket-item{display:flex;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid var(--border);font-size:0.84rem;}
.basket-total{display:flex;justify-content:space-between;padding:1rem 0 0;font-weight:700;}
.pay-btn{width:100%;background:var(--accent);color:#000;border:none;padding:13px;border-radius:6px;font-size:0.85rem;font-weight:700;cursor:pointer;margin-top:1rem;text-transform:uppercase;letter-spacing:0.08em;}
</style>
<script>
let _si=[];
function shopAdd(btn,name,price){const ex=_si.find(i=>i.name===name);if(ex)ex.qty++;else _si.push({name,price,qty:1});document.getElementById('shop-badge').textContent=_si.reduce((s,i)=>s+i.qty,0);document.getElementById('shop-total').textContent='€'+_si.reduce((s,i)=>s+i.price*i.qty,0);document.getElementById('shop-view-btn').style.display='';btn.textContent='✓ Added';setTimeout(()=>{btn.textContent='Add to Cart';},1200);}
function shopViewBasket(){const total=_si.reduce((s,i)=>s+i.price*i.qty,0);document.getElementById('shop-grid').style.display='none';const b=document.getElementById('shop-basket');b.style.display='';b.innerHTML='<div style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;opacity:0.4;margin-bottom:1rem;">Your Basket</div>'+_si.map(i=>'<div class="basket-item"><span>'+i.name+' ×'+i.qty+'</span><span>€'+(i.price*i.qty)+'</span></div>').join('')+'<div class="basket-total"><span>Total</span><span>€'+total+'</span></div><button class="pay-btn" onclick="shopPay()">Pay Now →</button><button class="bk-back" style="width:100%;margin-top:0.5rem;" onclick="shopBack()">← Continue Shopping</button>';}
function shopBack(){document.getElementById('shop-grid').style.display='';document.getElementById('shop-basket').style.display='none';}
function shopPay(){const total=_si.reduce((s,i)=>s+i.price*i.qty,0);document.getElementById('shop-basket').innerHTML='<div style="text-align:center;padding:2rem;"><div style="font-size:2.5rem;color:var(--accent);margin-bottom:0.75rem;">✓</div><strong>Order Confirmed!</strong><p style="opacity:0.5;margin:0.5rem 0;font-size:0.84rem;">Order #'+Math.floor(1000+Math.random()*9000)+' — €'+total+'</p><button class="bk-back" style="margin-top:1rem;" onclick="shopReset()">Continue Shopping</button></div>';}
function shopReset(){_si=[];document.getElementById('shop-badge').textContent='0';document.getElementById('shop-total').textContent='€0';document.getElementById('shop-view-btn').style.display='none';document.getElementById('shop-grid').style.display='';document.getElementById('shop-basket').style.display='none';}
<\/script>`;

  if (type === 'gallery') return `<!-- Image Gallery with Lightbox -->
<section class="gallery-section" id="gallery">
  <div class="gallery-inner">
    <h2 class="section-title">Our <span>Work</span></h2>
    <div class="gallery-grid">
      <div class="gallery-item" onclick="lbOpen(0)" style="background:linear-gradient(135deg,#1a1a2e,#16213e);"></div>
      <div class="gallery-item" onclick="lbOpen(1)" style="background:linear-gradient(135deg,#0d1b2a,#1b4332);"></div>
      <div class="gallery-item" onclick="lbOpen(2)" style="background:linear-gradient(135deg,#2d1b69,#11998e);"></div>
      <div class="gallery-item" onclick="lbOpen(3)" style="background:linear-gradient(135deg,#450a0a,#7f1d1d);"></div>
      <div class="gallery-item" onclick="lbOpen(4)" style="background:linear-gradient(135deg,#064e3b,#065f46);"></div>
      <div class="gallery-item" onclick="lbOpen(5)" style="background:linear-gradient(135deg,#1e1b4b,#312e81);"></div>
    </div>
  </div>
</section>
<div class="lb-overlay" id="lb-overlay" onclick="lbClose()">
  <div class="lb-content" onclick="event.stopPropagation()">
    <div class="lb-img" id="lb-img"></div>
    <button class="lb-nav lb-prev" onclick="lbMove(-1)">‹</button>
    <button class="lb-nav lb-next" onclick="lbMove(1)">›</button>
    <button class="lb-close" onclick="lbClose()">✕</button>
    <div class="lb-counter" id="lb-counter"></div>
  </div>
</div>
<style>
.gallery-section{padding:6rem 2rem;}
.gallery-inner{max-width:960px;margin:0 auto;}
.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-top:2.5rem;}
.gallery-item{aspect-ratio:1;border-radius:8px;cursor:pointer;transition:transform 0.2s;border:1px solid var(--border);}
.gallery-item:hover{transform:scale(1.03);}
.lb-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:none;align-items:center;justify-content:center;}
.lb-overlay.open{display:flex;}
.lb-content{position:relative;width:min(600px,90vw);}
.lb-img{width:100%;aspect-ratio:1;border-radius:10px;}
.lb-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.1);border:none;color:#fff;font-size:2rem;width:44px;height:44px;border-radius:50%;cursor:pointer;}
.lb-prev{left:-55px;}.lb-next{right:-55px;}
.lb-close{position:absolute;top:-44px;right:0;background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;}
.lb-counter{text-align:center;margin-top:0.75rem;font-size:0.78rem;opacity:0.4;}
</style>
<script>
const _lbItems=document.querySelectorAll('.gallery-item');let _lbIdx=0;
function lbOpen(i){_lbIdx=i;_lbRefresh();document.getElementById('lb-overlay').classList.add('open');}
function lbClose(){document.getElementById('lb-overlay').classList.remove('open');}
function lbMove(d){_lbIdx=(_lbIdx+d+_lbItems.length)%_lbItems.length;_lbRefresh();}
function _lbRefresh(){document.getElementById('lb-img').style.background=_lbItems[_lbIdx].style.background;document.getElementById('lb-counter').textContent=(_lbIdx+1)+' / '+_lbItems.length;}
<\/script>`;

  return `<!-- ${type} feature -->`;
}

// ══════════════════════════════════════
// FULL WEBSITE BUNDLE GENERATOR
// ══════════════════════════════════════
function generateBundleSection(sel, s) {
  const q = (s && s.questionnaire) || {};
  const biz = q.business_name || 'Your Business';
  const tagline = q.tagline || 'Professional services for modern businesses.';
  const phone = q.phone || '+353 87 000 0000';
  const email = (s && s.client_email) || 'hello@yourbrand.ie';
  const colourMap = {
    'Charcoal + Cyan':{bg:'#0a0a0a',nav:'#141414',accent:'#00e5ff',text:'#f0f0f0',border:'rgba(255,255,255,0.07)'},
    'Navy + Gold':{bg:'#09101e',nav:'#111828',accent:'#d4a843',text:'#eef0f4',border:'rgba(255,255,255,0.08)'},
    'Black + White':{bg:'#ffffff',nav:'#f5f5f5',accent:'#000000',text:'#111111',border:'rgba(0,0,0,0.1)'},
    'Dark + Red':{bg:'#0d0505',nav:'#160808',accent:'#e63333',text:'#f5f2f2',border:'rgba(255,255,255,0.07)'},
    'Slate + Emerald':{bg:'#0e141a',nav:'#16202a',accent:'#10b981',text:'#e8edf2',border:'rgba(255,255,255,0.07)'},
    'Dark Forest':{bg:'#080d08',nav:'#101810',accent:'#4ade80',text:'#e8f0e8',border:'rgba(255,255,255,0.07)'},
    'Deep Purple + Violet':{bg:'#120820',nav:'#1a1030',accent:'#a855f7',text:'#f0eaff',border:'rgba(255,255,255,0.08)'},
    'Copper + Orange':{bg:'#0f0a06',nav:'#1a1008',accent:'#e8943a',text:'#f5efe8',border:'rgba(255,255,255,0.07)'},
    'Midnight + Pink':{bg:'#08080a',nav:'#121218',accent:'#ff3366',text:'#ffffff',border:'rgba(255,255,255,0.07)'},
    'Ocean Dark + Teal':{bg:'#060c10',nav:'#0e1820',accent:'#00bcd4',text:'#e8f4ff',border:'rgba(255,255,255,0.07)'},
  };
  const c = colourMap[sel['Colour Scheme']] || colourMap['Charcoal + Cyan'];
  const p = biz.split(' '), l1 = p[0], l2 = p.slice(1).join(' ');
  const yr = new Date().getFullYear();

  const htmlFile = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${biz}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="navbar">
  <a class="nav-logo" href="#">${l1}<span>${l2}</span></a>
  <button class="nav-toggle" id="nav-toggle">&#9776;</button>
  <div class="nav-links" id="nav-links">
    <a href="#">Home</a>
    <a href="#services">Services</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
    <a href="#contact" class="nav-cta">Get in Touch</a>
  </div>
</nav>

<section class="hero">
  <p class="hero-eyebrow">Professional Services · Ireland</p>
  <h1>${l1} <span>${l2}</span></h1>
  <div class="hero-line"></div>
  <p class="hero-sub">${tagline}</p>
  <div class="hero-actions">
    <a href="#contact" class="btn-primary">Get in Touch</a>
    <a href="#services" class="btn-ghost">Our Services</a>
  </div>
</section>

<section class="services" id="services">
  <div class="services-inner">
    <h2 class="section-title">Our <span>Services</span></h2>
    <div class="services-grid">
      <div class="service-card anim-el"><div class="card-icon">✦</div><h3>Service One</h3><p>Replace this with your first service description.</p></div>
      <div class="service-card anim-el"><div class="card-icon">⚡</div><h3>Service Two</h3><p>Replace this with your second service description.</p></div>
      <div class="service-card anim-el"><div class="card-icon">★</div><h3>Service Three</h3><p>Replace this with your third service description.</p></div>
    </div>
  </div>
</section>

<section class="contact-section" id="contact">
  <div class="contact-inner">
    <h2 class="section-title">Get in <span>Touch</span></h2>
    <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form" id="contact-form">
      <div class="form-row">
        <div class="form-field"><label>First Name</label><input type="text" name="first_name" placeholder="John" required></div>
        <div class="form-field"><label>Last Name</label><input type="text" name="last_name" placeholder="Smith" required></div>
      </div>
      <div class="form-field"><label>Email</label><input type="email" name="email" placeholder="john@example.com" required></div>
      <div class="form-field"><label>Phone</label><input type="tel" name="phone" placeholder="${phone}"></div>
      <div class="form-field"><label>Message</label><textarea name="message" rows="5" placeholder="Tell us how we can help..." required></textarea></div>
      <button type="submit" class="btn-primary" style="width:100%;padding:14px;border-radius:6px;font-size:0.84rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;border:none;">Send Message →</button>
      <div id="form-success" style="display:none;text-align:center;padding:1rem;color:var(--accent);font-weight:700;">✓ Message sent!</div>
    </form>
  </div>
</section>

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="footer-logo">${l1}<span>${l2}</span></div>
      <p>Professional services across Ireland.</p>
    </div>
    <div class="footer-col">
      <span class="footer-heading">Quick Links</span>
      <a href="#">Home</a><a href="#services">Services</a><a href="#contact">Contact</a>
    </div>
    <div class="footer-col">
      <span class="footer-heading">Contact</span>
      <a href="tel:${phone.replace(/\s/g,'')}">📞 ${phone}</a>
      <a href="mailto:${email}">✉ ${email}</a>
    </div>
  </div>
  <div class="footer-bottom"><p>© ${yr} ${biz}. All rights reserved.</p></div>
</footer>

<script src="script.js"><\/script>
</body>
</html>`;

  const cssFile = `:root {
  --bg: ${c.bg};
  --bg-nav: ${c.nav};
  --accent: ${c.accent};
  --text: ${c.text};
  --border: ${c.border};
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;line-height:1.6;}
.navbar{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;background:var(--bg-nav);border-bottom:1px solid var(--border);backdrop-filter:blur(20px);}
.nav-logo{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;letter-spacing:0.08em;color:var(--text);text-decoration:none;}
.nav-logo span{color:var(--accent);}
.nav-links{display:flex;gap:2rem;align-items:center;}
.nav-links a{font-size:0.78rem;color:var(--text);opacity:0.55;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;transition:all 0.2s;}
.nav-links a:hover{opacity:1;color:var(--accent);}
.nav-cta{background:var(--accent)!important;color:#000!important;opacity:1!important;padding:7px 18px;border-radius:5px;font-weight:700!important;}
.nav-toggle{display:none;background:none;border:none;color:var(--text);font-size:1.4rem;cursor:pointer;}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem 4rem;}
.hero-eyebrow{font-size:0.72rem;color:var(--accent);letter-spacing:0.28em;text-transform:uppercase;margin-bottom:1.2rem;}
h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,8vw,7rem);letter-spacing:0.06em;line-height:0.9;margin-bottom:1.2rem;}
h1 span{color:var(--accent);}
.hero-line{width:48px;height:2px;background:var(--accent);margin:0 auto 1.5rem;}
.hero-sub{font-size:1.05rem;opacity:0.55;max-width:520px;margin:0 auto 2.5rem;line-height:1.7;}
.hero-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
.btn-primary{background:var(--accent);color:#000;padding:14px 34px;border-radius:5px;font-size:0.84rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;border:none;cursor:pointer;}
.btn-ghost{border:1px solid var(--accent);color:var(--accent);padding:13px 30px;border-radius:5px;font-size:0.84rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;}
.services{padding:6rem 2rem;}
.services-inner,.contact-inner{max-width:960px;margin:0 auto;}
.section-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,5vw,3.5rem);letter-spacing:0.06em;margin-bottom:3rem;text-align:center;}
.section-title span{color:var(--accent);}
.services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.2rem;}
.service-card{background:var(--bg-nav);border:1px solid var(--border);border-radius:12px;padding:1.8rem;transition:border-color 0.25s,transform 0.25s;}
.service-card:hover{border-color:var(--accent);transform:translateY(-5px);}
.card-icon{font-size:1.4rem;color:var(--accent);margin-bottom:1rem;display:block;}
.service-card h3{font-size:1rem;font-weight:700;margin-bottom:0.5rem;}
.service-card p{font-size:0.84rem;opacity:0.5;line-height:1.65;}
.anim-el{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease;}
.anim-el.visible{opacity:1;transform:translateY(0);}
.anim-el:nth-child(2){transition-delay:0.1s;}.anim-el:nth-child(3){transition-delay:0.2s;}.anim-el:nth-child(4){transition-delay:0.3s;}
.contact-section{padding:6rem 2rem;}
.contact-form{display:flex;flex-direction:column;gap:1.1rem;margin-top:2.5rem;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.form-field{display:flex;flex-direction:column;gap:0.4rem;}
.form-field label{font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;opacity:0.45;}
.form-field input,.form-field textarea{background:rgba(255,255,255,0.04);border:1px solid var(--border);color:var(--text);padding:11px 14px;border-radius:6px;font-size:0.9rem;font-family:inherit;outline:none;transition:border-color 0.2s;}
.form-field input:focus,.form-field textarea:focus{border-color:var(--accent);}
.site-footer{background:var(--bg-nav);border-top:1px solid var(--border);padding:3rem 2rem 1.5rem;}
.footer-inner{display:grid;grid-template-columns:2fr 1fr 1fr;gap:2rem;max-width:960px;margin:0 auto 2rem;}
.footer-logo{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:0.08em;margin-bottom:0.5rem;}
.footer-logo span{color:var(--accent);}
.footer-brand p{font-size:0.82rem;opacity:0.35;line-height:1.6;margin-top:0.4rem;}
.footer-heading{display:block;font-size:0.65rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:0.8rem;}
.footer-col{display:flex;flex-direction:column;gap:0.45rem;}
.footer-col a{font-size:0.82rem;opacity:0.4;text-decoration:none;color:var(--text);transition:opacity 0.2s;}
.footer-col a:hover{opacity:0.9;color:var(--accent);}
.footer-bottom{border-top:1px solid var(--border);padding-top:1.2rem;font-size:0.7rem;opacity:0.25;max-width:960px;margin:0 auto;}
@media(max-width:768px){
  .nav-toggle{display:block;}
  .nav-links{display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;background:var(--bg-nav);padding:1rem 2rem;border-bottom:1px solid var(--border);gap:1rem;}
  .nav-links.open{display:flex;}
  .hero{padding:2rem;}
  .footer-inner{grid-template-columns:1fr 1fr;}
  .footer-brand{grid-column:1/-1;}
  .form-row{grid-template-columns:1fr;}
}`;

  const jsFile = `// Scroll animations
const _ao = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); _ao.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.anim-el').forEach(el => _ao.observe(el));

// Mobile nav
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});

// Contact form
const _cf = document.getElementById('contact-form');
if (_cf) {
  _cf.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...'; btn.disabled = true;
    const res = await fetch(this.action, { method: 'POST', body: new FormData(this), headers: { Accept: 'application/json' } });
    if (res.ok) { this.reset(); document.getElementById('form-success').style.display = 'block'; btn.style.display = 'none'; }
    else { btn.textContent = 'Try Again'; btn.disabled = false; }
  });
}`;

  const htmlId = 'bhtml_' + Math.random().toString(36).substr(2,6);
  const cssId  = 'bcss_'  + Math.random().toString(36).substr(2,6);
  const jsId   = 'bjs_'   + Math.random().toString(36).substr(2,6);


  return `<div class="bundle-section">
    <div class="bundle-hdr">
      <div>
        <div class="bundle-title">✦ Complete Website — 3 Files</div>
        <div class="bundle-desc">index.html + style.css + script.js · pre-filled with client details</div>
      </div>
      <button class="download-all-btn" onclick="downloadAll('${htmlId}','${cssId}','${jsId}')">⬇ Download All 3</button>
    </div>
    <div class="bundle-files">
      ${codeBlock('index.html — Main HTML File', htmlFile, htmlId)}
      ${codeBlock('style.css — Styles', cssFile, cssId)}
      ${codeBlock('script.js — JavaScript', jsFile, jsId)}
    </div>
  </div>`;
}

function downloadAll(htmlId, cssId, jsId) {
  const files = [
    { id: htmlId, name: 'index.html', type: 'text/html' },
    { id: cssId,  name: 'style.css',  type: 'text/css' },
    { id: jsId,   name: 'script.js',  type: 'text/javascript' },
  ];
  files.forEach((f, i) => {
    setTimeout(() => {
      const pre = document.getElementById('pre_' + f.id);
      if (!pre) return;
      const blob = new Blob([pre.textContent], { type: f.type });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = f.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, i * 400);
  });
}
