/* ═══════════════════════════════════════
   CM STUDIO — DESIGNROOM V3
   js/submit.js
   Supabase + EmailJS submission system
═══════════════════════════════════════ */

// ── CREDENTIALS ──
const SUPABASE_URL = 'https://keqizgtvunwdabwvgrik.supabase.co';
const SUPABASE_KEY = 'sb_publishable_omG3I_QFY_hpIhCcugVlmA_H2HqvTkm';
const EMAILJS_SERVICE = 'service_p4zuxps';
const EMAILJS_TEMPLATE_CIAN = 'template_2dn06z6';
const EMAILJS_TEMPLATE_CLIENT = 'template_skiyfln';
const EMAILJS_PUBLIC_KEY = 'M9uCIf7tZKXTnZZ_a';

// ── INIT ──
// Deferred so CDN scripts (supabase, emailjs) have finished loading
let db;

function initSupabase() {
  try {
    if (typeof supabase !== 'undefined') {
      const { createClient } = supabase;
      db = createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  } catch (e) {
    console.error('Init error:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupabase);
} else {
  initSupabase();
}

// ══════════════════════════════════════
// HELPERS
// ══════════════════════════════════════
function getVal(id) {
  return document.getElementById(id)?.value?.trim() || '';
}

function getChecked(stepId) {
  const step = document.getElementById(stepId);
  if (!step) return [];
  return Array.from(step.querySelectorAll('input[type=checkbox]:checked'))
    .map(c => c.value);
}

function formatSelections(sel) {
  return Object.entries(sel)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
}

function formatQuestionnaire(q) {
  return Object.entries(q)
    .filter(([, v]) => v && (Array.isArray(v) ? v.length : v))
    .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n');
}

// ══════════════════════════════════════
// MOOD BOARD UPLOAD
// ══════════════════════════════════════
async function uploadMoodFiles(clientName) {
  const urls = [];
  if (!moodFiles || !moodFiles.length) return urls;

  for (const file of moodFiles) {
    try {
      const ext = file.name.split('.').pop();
      const path = `moodboards/${clientName.replace(/\s/g, '-')}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${ext}`;
      const { data, error } = await db.storage
        .from('moodboards')
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (!error && data) {
        const { data: urlData } = db.storage.from('moodboards').getPublicUrl(path);
        if (urlData?.publicUrl) urls.push(urlData.publicUrl);
      }
    } catch (e) {
      console.warn('Upload failed for file:', file.name, e);
    }
  }
  return urls;
}

// ══════════════════════════════════════
// MAIN SUBMIT
// ══════════════════════════════════════
async function submitBrief() {
  const btn = document.getElementById('q-next');
  if (btn) { btn.textContent = 'Submitting...'; btn.disabled = true; }

  const clientName = getVal('q-name');
  const clientEmail = getVal('q-email');

  // Gather all step data
  const allChecked = getChecked('step-2');
  const pageOptions = ['Home Page','About Us','Services Page','Contact Page','Gallery / Portfolio','Testimonials','FAQ Page','Pricing Page'];
  const featureOptions = ['Contact Form','Google Maps','WhatsApp Button','Cookie Banner','Social Media Icons','Live Chat','Photo Gallery','Before & After Slider','Scroll Animations','Mobile Optimised'];

  const questionnaire = {
    business_name: getVal('q-biz'),
    what_they_do: getVal('q-what'),
    phone: getVal('q-phone'),
    location: getVal('q-location'),
    pages_needed: allChecked.filter(v => pageOptions.includes(v)),
    features_needed: allChecked.filter(v => featureOptions.includes(v)),
    tagline: getVal('q-tagline'),
    services: getVal('q-services'),
    homepage_content: getVal('q-homepage'),
    social_links: getVal('q-social'),
    has_logo: getVal('q-logo'),
    has_photos: getVal('q-photos'),
    brand_colours: getVal('q-colours'),
    inspiration_sites: getVal('q-inspo'),
    dont_wants: getVal('q-donts'),
    has_domain: getVal('q-domain'),
    domain_name: getVal('q-domain-name'),
    existing_site: getVal('q-existing'),
    existing_url: getVal('q-existing-url'),
    extra_notes: getVal('q-notes'),
  };

  const selectionText = formatSelections(selections);
  const questionnaireText = formatQuestionnaire(questionnaire);

  try {
    // 1. Upload mood board images
    let moodUrls = [];
    try {
      moodUrls = await uploadMoodFiles(clientName);
    } catch (e) {
      console.warn('Mood upload skipped:', e);
    }

    // 2. Save to Supabase
    const { error: dbError } = await db.from('submissions').insert({
      client_name: clientName,
      client_email: clientEmail,
      selections: selections,
      questionnaire: {
        ...questionnaire,
        mood_board_urls: moodUrls
      }
    });

    if (dbError) throw dbError;

    // 3. Email to Cian
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_CIAN, {
      client_name: clientName,
      client_email: clientEmail,
      selections: selectionText,
      questionnaire: questionnaireText + (moodUrls.length ? `\n\nMood Board Images:\n${moodUrls.join('\n')}` : '')
    });

    // 4. Confirmation email to client
    try {
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_CLIENT, {
        client_name: clientName,
        client_email: clientEmail,
        selections: selectionText,
        name: clientName
      });
    } catch (e) {
      console.warn('Client confirmation email failed:', e);
      // Don't throw — submission still succeeded
    }

    // 5. Show success
    document.querySelectorAll('.q-step').forEach(s => s.classList.remove('active'));
    const success = document.getElementById('q-success');
    if (success) success.classList.add('show');
    const footer = document.getElementById('q-footer');
    if (footer) footer.style.display = 'none';
    const progress = document.getElementById('q-progress-fill');
    if (progress) progress.style.width = '100%';
    showToast('Brief submitted — check your email ✦', 'success');

    // 6. Clear local storage progress
    try { localStorage.removeItem('dr_progress'); } catch(e) {}

  } catch (err) {
    console.error('Submission error:', err);
    showToast('Something went wrong. Please try again.', 'error');
    if (btn) { btn.textContent = 'Submit Brief ✦'; btn.disabled = false; }
  }
}

// ══════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════

// Only runs on admin.html
if (window.location.pathname.includes('admin')) {
  document.addEventListener('DOMContentLoaded', initAdmin);
}

let submissions = [];
let activeSubmissionId = null;

function initAdmin() {
  const loginPw = document.getElementById('login-pw');
  if (loginPw) {
    loginPw.addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  }
}

function doLogin() {
  const pw = document.getElementById('login-pw')?.value;
  if (pw === ADMIN_PASSWORD) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin').classList.add('visible');
    loadSubmissions();
  } else {
    const err = document.getElementById('login-err');
    if (err) err.style.display = 'block';
  }
}

function logout() {
  document.getElementById('admin').classList.remove('visible');
  document.getElementById('login-screen').style.display = 'flex';
  const pw = document.getElementById('login-pw');
  if (pw) pw.value = '';
  const err = document.getElementById('login-err');
  if (err) err.style.display = 'none';
}

async function loadSubmissions() {
  try {
    const { data, error } = await db
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    submissions = data || [];
    renderSidebar();
    renderStats();
  } catch (e) {
    console.error('Load error:', e);
    showAdminToast('Failed to load submissions', 'error');
  }
}

function renderStats() {
  const bar = document.getElementById('stats-bar');
  if (!bar) return;
  const today = submissions.filter(s => isToday(s.created_at)).length;
  const thisWeek = submissions.filter(s => isThisWeek(s.created_at)).length;
  bar.innerHTML = `
    <div class="stat-pill"><div class="sv">${submissions.length}</div><div class="sl">Total</div></div>
    <div class="stat-pill"><div class="sv">${thisWeek}</div><div class="sl">This Week</div></div>
    <div class="stat-pill"><div class="sv">${today}</div><div class="sl">Today</div></div>
  `;
}

function isToday(dateStr) {
  const d = new Date(dateStr), now = new Date();
  return d.toDateString() === now.toDateString();
}

function isThisWeek(dateStr) {
  const d = new Date(dateStr), now = new Date();
  const week = 7 * 24 * 60 * 60 * 1000;
  return (now - d) < week;
}

function renderSidebar() {
  const el = document.getElementById('sidebar-list');
  if (!el) return;

  if (!submissions.length) {
    el.innerHTML = '<div class="sidebar-section">Submissions</div><div style="text-align:center;padding:2rem;color:var(--dim);font-size:0.8rem;">No submissions yet</div>';
    return;
  }

  el.innerHTML = '<div class="sidebar-section">Submissions</div>' + submissions.map(s => {
    const d = new Date(s.created_at);
    const selCount = Object.keys(s.selections || {}).length;
    const status = s.status || 'new';
    const statusColors = { new: '#00e5ff', inprogress: '#f59e0b', quoted: '#a855f7', complete: '#4ade80' };
    const statusLabels = { new: 'New', inprogress: 'In Progress', quoted: 'Quoted', complete: 'Complete' };
    return `
      <div class="sub-item ${s.id === activeSubmissionId ? 'active' : ''}" onclick="viewSubmission('${s.id}')">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <div class="sub-name">${s.client_name || 'Unknown'}</div>
          <div style="width:7px;height:7px;border-radius:50%;background:${statusColors[status] || '#00e5ff'};flex-shrink:0;" title="${statusLabels[status] || 'New'}"></div>
        </div>
        <div class="sub-meta">${s.client_email || ''}</div>
        <div class="sub-meta">${d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}</div>
        <span class="sub-badge">${selCount} selection${selCount !== 1 ? 's' : ''}</span>
      </div>`;
  }).join('');
}

function viewSubmission(id) {
  activeSubmissionId = id;
  renderSidebar();
  const s = submissions.find(x => x.id === id);
  if (!s) return;

  const d = new Date(s.created_at);
  document.getElementById('main-title').textContent = s.client_name || 'Submission';
  document.getElementById('main-sub').textContent = `${s.client_email} · ${d.toLocaleString('en-IE')}`;

  const q = s.questionnaire || {};
  const sel = s.selections || {};

  document.getElementById('main-body').innerHTML = `

    <!-- STATUS BAR -->
    <div style="display:flex;gap:0.5rem;margin-bottom:1.5rem;flex-wrap:wrap;">
      ${['new','inprogress','quoted','complete'].map(status => `
        <button onclick="updateStatus('${id}','${status}')" style="font-family:'Syne',sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:6px 14px;border-radius:5px;cursor:pointer;transition:all 0.2s;background:${s.status===status?'var(--accent)':'var(--bg3)'};color:${s.status===status?'#000':'var(--dim)'};border:1px solid ${s.status===status?'var(--accent)':'var(--border)'};">${{new:'New',inprogress:'In Progress',quoted:'Quoted',complete:'Complete'}[status]}</button>
      `).join('')}
    </div>

    <!-- CLIENT DETAILS -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
      <div class="detail-card">
        <div class="dc-title">Client Details</div>
        <div class="dc-row">
          ${adminField('Name', s.client_name)}
          ${adminField('Email', s.client_email)}
          ${adminField('Business', q.business_name)}
          ${adminField('Phone', q.phone)}
          ${adminField('Location', q.location)}
          ${adminField('What they do', q.what_they_do)}
        </div>
      </div>
      <div class="detail-card">
        <div class="dc-title">Technical</div>
        <div class="dc-row">
          ${adminField('Domain', q.has_domain)}
          ${adminField('Domain name', q.domain_name)}
          ${adminField('Existing site', q.existing_site)}
          ${adminField('Existing URL', q.existing_url)}
          ${adminField('Logo', q.has_logo)}
          ${adminField('Photos', q.has_photos)}
        </div>
      </div>
      <div class="detail-card">
        <div class="dc-title">Pages & Features</div>
        <div class="dc-row">
          ${adminField('Pages', Array.isArray(q.pages_needed) ? q.pages_needed.join(', ') : q.pages_needed)}
          ${adminField('Features', Array.isArray(q.features_needed) ? q.features_needed.join(', ') : q.features_needed)}
        </div>
      </div>
      <div class="detail-card">
        <div class="dc-title">Style Notes</div>
        <div class="dc-row">
          ${adminField('Tagline', q.tagline)}
          ${adminField('Brand colours', q.brand_colours)}
          ${adminField('Inspiration', q.inspiration_sites)}
          ${adminField("Don't wants", q.dont_wants)}
          ${adminField('Extra notes', q.extra_notes)}
        </div>
      </div>
    </div>

    ${q.services ? `<div class="detail-card" style="margin-bottom:1.5rem;"><div class="dc-title">Services Listed</div><div style="font-size:0.82rem;line-height:1.9;white-space:pre-line;margin-top:0.5rem;color:var(--text2);">${q.services}</div></div>` : ''}

    <!-- MOOD BOARD -->
    ${q.mood_board_urls && q.mood_board_urls.length ? `
    <div class="detail-card" style="margin-bottom:1.5rem;">
      <div class="dc-title">Mood Board Images</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.75rem;">
        ${q.mood_board_urls.map(url => `<a href="${url}" target="_blank"><img src="${url}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;border:1px solid var(--border);"></a>`).join('')}
      </div>
    </div>` : ''}

    <!-- SELECTIONS -->
    <div class="code-section-title">Style Selections</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:0.6rem;margin-bottom:1.5rem;">
      ${Object.entries(sel).map(([k, v]) => `
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:0.7rem 1rem;">
          <div style="font-size:0.58rem;color:var(--dim);letter-spacing:0.1em;text-transform:uppercase;font-family:'Syne',sans-serif;margin-bottom:2px;">${k}</div>
          <div style="font-family:'Syne',sans-serif;font-size:0.82rem;font-weight:700;color:var(--accent);">${v}</div>
        </div>`).join('')}
    </div>

    <!-- CODE BLOCKS -->
    <div class="code-section-title">Generated Code</div>
    ${generateAllCodeBlocks(sel)}

    <!-- ANALYTICS NOTE -->
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:1.2rem;margin-top:1.5rem;">
      <div class="dc-title">Submission Analytics</div>
      <div style="display:flex;gap:2rem;margin-top:0.75rem;flex-wrap:wrap;">
        <div><div style="font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--accent);">${Object.keys(sel).length}</div><div style="font-size:0.65rem;color:var(--dim);text-transform:uppercase;letter-spacing:0.1em;">Selections Made</div></div>
        <div><div style="font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--accent);">${(q.pages_needed||[]).length}</div><div style="font-size:0.65rem;color:var(--dim);text-transform:uppercase;letter-spacing:0.1em;">Pages Requested</div></div>
        <div><div style="font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--accent);">${(q.features_needed||[]).length}</div><div style="font-size:0.65rem;color:var(--dim);text-transform:uppercase;letter-spacing:0.1em;">Features Requested</div></div>
        <div><div style="font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--accent);">${(q.mood_board_urls||[]).length}</div><div style="font-size:0.65rem;color:var(--dim);text-transform:uppercase;letter-spacing:0.1em;">Mood Board Images</div></div>
      </div>
    </div>
  `;
}

function adminField(label, val) {
  if (!val) return '';
  return `<div style="display:flex;gap:0.5rem;font-size:0.8rem;margin-bottom:0.4rem;">
    <span style="color:var(--dim);min-width:100px;flex-shrink:0;font-size:0.75rem;">${label}</span>
    <span style="color:var(--text);word-break:break-word;">${val}</span>
  </div>`;
}

async function updateStatus(id, status) {
  try {
    const { error } = await db.from('submissions').update({ status }).eq('id', id);
    if (error) throw error;
    const s = submissions.find(x => x.id === id);
    if (s) s.status = status;
    renderSidebar();
    viewSubmission(id);
    showAdminToast('Status updated ✦', 'success');
  } catch (e) {
    showAdminToast('Failed to update status', 'error');
  }
}

function showAdminToast(msg, type = '') {
  const t = document.getElementById('admin-toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'admin-toast show ' + type;
  setTimeout(() => { t.className = 'admin-toast'; }, 3000);
}

// ══════════════════════════════════════
// CODE GENERATORS
// ══════════════════════════════════════
function generateAllCodeBlocks(sel) {
  const blocks = [];

  if (sel['Colour Scheme']) blocks.push(codeBlock('Colour Scheme — ' + sel['Colour Scheme'], getColourCode(sel['Colour Scheme'])));
  if (sel['Background']) blocks.push(codeBlock('Background — ' + sel['Background'], getBackgroundCode(sel['Background'])));
  if (sel['Navbar']) blocks.push(codeBlock('Navbar — ' + sel['Navbar'], getNavbarCode(sel['Navbar'])));
  if (sel['Hero Section']) blocks.push(codeBlock('Hero Section — ' + sel['Hero Section'], getHeroCode(sel['Hero Section'])));
  if (sel['Card Style']) blocks.push(codeBlock('Card Style — ' + sel['Card Style'], getCardCode(sel['Card Style'])));
  if (sel['Footer']) blocks.push(codeBlock('Footer — ' + sel['Footer'], getFooterCode(sel['Footer'])));
  if (sel['Contact Form']) blocks.push(codeBlock('Contact Form — ' + sel['Contact Form'], getFormCode(sel['Contact Form'])));
  if (sel['Scroll Animation']) blocks.push(codeBlock('Scroll Animation — ' + sel['Scroll Animation'], getAnimCode(sel['Scroll Animation'])));

  return blocks.length ? blocks.join('') : '<div style="color:var(--dim);font-size:0.85rem;">No style selections were made.</div>';
}

function codeBlock(label, code) {
  const id = 'cb_' + Math.random().toString(36).substr(2, 9);
  return `
    <div class="code-block-wrap">
      <div class="code-block-hdr">
        <span class="code-block-label">${label}</span>
        <button class="copy-btn" id="${id}" onclick="copyCode('${id}')">Copy</button>
      </div>
      <div class="code-block-body"><pre id="pre_${id}">${escHtml(code)}</pre></div>
    </div>`;
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function copyCode(id) {
  const pre = document.getElementById('pre_' + id);
  if (!pre) return;
  await navigator.clipboard.writeText(pre.textContent);
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.textContent = '✓ Copied';
  btn.classList.add('copied');
  setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
}

function getColourCode(scheme) {
  const map = {
    'Charcoal + Cyan':      { bg:'#0a0a0a', nav:'#141414', accent:'#00e5ff', text:'#f0f0f0', border:'rgba(255,255,255,0.07)' },
    'Navy + Gold':          { bg:'#09101e', nav:'#111828', accent:'#d4a843', text:'#eef0f4', border:'rgba(255,255,255,0.08)' },
    'Black + White':        { bg:'#ffffff', nav:'#f5f5f5', accent:'#000000', text:'#111111', border:'rgba(0,0,0,0.1)' },
    'Dark + Red':           { bg:'#0d0505', nav:'#160808', accent:'#e63333', text:'#f5f2f2', border:'rgba(255,255,255,0.07)' },
    'Slate + Emerald':      { bg:'#0e141a', nav:'#16202a', accent:'#10b981', text:'#e8edf2', border:'rgba(255,255,255,0.07)' },
    'Dark Forest':          { bg:'#080d08', nav:'#101810', accent:'#4ade80', text:'#e8f0e8', border:'rgba(255,255,255,0.07)' },
    'Deep Purple + Violet': { bg:'#120820', nav:'#1a1030', accent:'#a855f7', text:'#f0eaff', border:'rgba(255,255,255,0.08)' },
    'Copper + Orange':      { bg:'#0f0a06', nav:'#1a1008', accent:'#e8943a', text:'#f5efe8', border:'rgba(255,255,255,0.07)' },
    'Midnight + Pink':      { bg:'#08080a', nav:'#121218', accent:'#ff3366', text:'#ffffff', border:'rgba(255,255,255,0.07)' },
    'Ocean Dark + Teal':    { bg:'#060c10', nav:'#0e1820', accent:'#00bcd4', text:'#e8f4ff', border:'rgba(255,255,255,0.07)' },
  };
  const c = map[scheme] || map['Charcoal + Cyan'];
  return `:root {
  --bg: ${c.bg};         /* Page background */
  --bg-nav: ${c.nav};    /* Nav / card background */
  --accent: ${c.accent}; /* Primary accent colour */
  --text: ${c.text};     /* Body text */
  --border: ${c.border}; /* Subtle borders */
}

/* Apply base styles */
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
}

/* Accent colour usage examples */
a { color: var(--accent); }
.btn-primary { background: var(--accent); color: ${c.bg}; }
.accent-text { color: var(--accent); }
.accent-border { border-color: var(--accent); }`;
}

function getBackgroundCode(bg) {
  const codes = {
    'Dark Grid': `/* Dark Grid Background */
body {
  background-color: var(--bg);
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 28px 28px;
}`,
    'Gradient Flow': `/* Animated Gradient Flow */
body {
  background: linear-gradient(-45deg, #0a0015, #001a2e, #0d1f00, #1a0010);
  background-size: 400% 400%;
  animation: gradFlow 6s ease infinite;
}
@keyframes gradFlow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`,
    'Particle Field': `<!-- Add canvas to <body> -->
<canvas id="particles-bg"></canvas>

<style>
#particles-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #050510;
}
</style>

<script>
(function() {
  const canvas = document.getElementById('particles-bg');
  const ctx = canvas.getContext('2d');
  const ACCENT = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim() || '#00e5ff';

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const pts = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 1.5 + 0.5
  }));

  function draw() {
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = ACCENT;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = ACCENT;
          ctx.globalAlpha = 0.1 * (1 - d / 100);
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
<\/script>`,
    'CCTV Tracker': `<!-- CCTV Camera that tracks the cursor -->
<canvas id="cctv-bg"></canvas>

<style>
#cctv-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #080808;
}
</style>

<script>
(function() {
  const canvas = document.getElementById('cctv-bg');
  const ctx    = canvas.getContext('2d');
  const COLOR  = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim() || '#00e5ff';

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let mx = canvas.width / 2, my = canvas.height / 2;
  let tmx = mx, tmy = my;
  document.addEventListener('mousemove', e => { tmx = e.clientX; tmy = e.clientY; });

  function draw() {
    mx += (tmx - mx) * 0.06;
    my += (tmy - my) * 0.06;

    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* scanlines */
    for (let i = 0; i < canvas.height; i += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.07)';
      ctx.fillRect(0, i, canvas.width, 2);
    }

    const cx = canvas.width / 2, cy = 50;
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, cy); ctx.stroke();

    const ang = Math.atan2(my - cy, mx - cx);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-24, -11, 48, 22, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = COLOR;
    ctx.shadowColor = COLOR; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(24, 0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.restore();

    /* FOV cone */
    const spread = 0.3;
    ctx.save(); ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const len = Math.max(canvas.width, canvas.height) * 1.5;
    ctx.lineTo(Math.cos(ang - spread) * len, Math.sin(ang - spread) * len);
    ctx.lineTo(Math.cos(ang + spread) * len, Math.sin(ang + spread) * len);
    ctx.closePath();
    ctx.fillStyle = COLOR + '15';
    ctx.fill(); ctx.restore();

    /* REC dot */
    ctx.fillStyle = Math.sin(Date.now() / 500) > 0 ? '#ff3333' : '#661111';
    ctx.beginPath(); ctx.arc(18, 18, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('REC', 27, 22);

    requestAnimationFrame(draw);
  }
  draw();
})();
<\/script>`,
    'Starfield': `<!-- Animated Starfield with Shooting Stars -->
<canvas id="stars-bg"></canvas>

<style>
#stars-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #020208;
}
</style>

<script>
(function() {
  const canvas = document.getElementById('stars-bg');
  const ctx    = canvas.getContext('2d');
  const COLOR  = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim() || '#ffffff';

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 160 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.2,
    o: Math.random(),
    speed: Math.random() * 0.015 + 0.003
  }));

  function draw() {
    ctx.fillStyle = '#020208';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.o += (Math.random() - 0.5) * s.speed;
      s.o  = Math.max(0.05, Math.min(1, s.o));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle  = COLOR;
      ctx.globalAlpha = s.o;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
<\/script>`,
    'Matrix Rain': `<!-- Matrix Digital Rain -->
<canvas id="matrix-bg"></canvas>

<style>
#matrix-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #000500;
}
</style>

<script>
(function() {
  const canvas = document.getElementById('matrix-bg');
  const ctx    = canvas.getContext('2d');
  const COLOR  = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim() || '#00e5ff';

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const FONT_SIZE = 14;
  let cols  = Math.floor(canvas.width / FONT_SIZE);
  let drops = Array(cols).fill(0);

  const CHARS = '01アイウエオカキクケコサシスセソ';

  function draw() {
    ctx.fillStyle = 'rgba(0,5,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = FONT_SIZE + 'px monospace';

    drops.forEach((y, i) => {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillStyle  = y < 2 ? '#ffffff' : COLOR;
      ctx.globalAlpha = y < 2 ? 1 : 0.75;
      ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE);
      ctx.globalAlpha = 1;
      drops[i]++;
      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0;
    });
  }
  setInterval(draw, 55);
})();
<\/script>`,
    'Mesh Gradient': `/* Animated Mesh Gradient */
body {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(100,30,200,0.28) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(0,80,200,0.28)  0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(200,0,60,0.18)  0%, transparent 50%),
    var(--bg);
  animation: meshPulse 8s ease-in-out infinite alternate;
}
@keyframes meshPulse {
  0%   { filter: hue-rotate(0deg)  brightness(1); }
  100% { filter: hue-rotate(25deg) brightness(1.05); }
}`,
    'Aurora': `/* Aurora Borealis Background */
body { background: #030310; position: relative; overflow-x: hidden; }
body::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse at 30% 60%, rgba(0,200,150,0.2)  0%, transparent 55%),
    radial-gradient(ellipse at 70% 30%, rgba(100,0,200,0.2)  0%, transparent 55%),
    radial-gradient(ellipse at 50% 80%, rgba(0,150,255,0.15) 0%, transparent 50%);
  animation: auroraPulse 6s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: -1;
}
@keyframes auroraPulse {
  0%   { opacity: 0.7; transform: scale(1); }
  100% { opacity: 1;   transform: scale(1.05); }
}`,
    'Scanlines': `/* CRT Scanlines Effect */
body { background: #050505; }
body::before {
  content: '';
  position: fixed; inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,          transparent 2px,
    rgba(0,255,100,0.012) 2px,
    rgba(0,255,100,0.012) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
body::after {
  content: '';
  position: fixed; inset: 0;
  background: radial-gradient(ellipse at 50% 40%, rgba(0,255,100,0.07) 0%, transparent 65%);
  pointer-events: none;
  z-index: 9998;
}`,
    'Clean White': `/* Clean White Background */
body {
  background: #ffffff;
  color: #111111;
}`,
    'Soft Paper': `/* Soft Paper Texture */
body {
  background-color: #faf8f5;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}`,
    'Light Gradient': `/* Soft Light Gradient */
body {
  background: linear-gradient(135deg, #f0f4ff 0%, #faf0ff 50%, #f0fff4 100%);
  animation: lightGrad 8s ease infinite alternate;
}
@keyframes lightGrad {
  0%   { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(30deg); }
}`,
  };
  return codes[bg] || `/* ${bg} background */\n/* Contact CM Studio for implementation */`;
}

function getNavbarCode(nav) {
  const codes = {
    'Frosted Glass': `<!-- Frosted Glass Sticky Navbar -->
<nav class="navbar">
  <div class="nav-logo">YOUR<span>BRAND</span></div>
  <div class="nav-links">
    <a href="#">Home</a>
    <a href="#services">Services</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </div>
  <a href="#contact" class="nav-cta">Get Quote</a>
</nav>

<style>
.navbar {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(8, 8, 8, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: background 0.3s ease;
}
.nav-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem; letter-spacing: 0.08em;
}
.nav-logo span { color: var(--accent); }
.nav-links {
  display: flex; gap: 2rem;
}
.nav-links a {
  font-size: 0.8rem; color: rgba(255,255,255,0.6);
  text-decoration: none; letter-spacing: 0.06em;
  text-transform: uppercase; transition: color 0.2s;
}
.nav-links a:hover { color: var(--accent); }
.nav-cta {
  background: var(--accent); color: #000;
  padding: 8px 20px; border-radius: 4px;
  font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  text-decoration: none; transition: opacity 0.2s;
}
.nav-cta:hover { opacity: 0.85; }
@media (max-width: 768px) {
  .nav-links { display: none; }
}
</style>`,
    'Bold + CTA Button': `<!-- Bold Navbar with Left Accent + CTA -->
<nav class="navbar">
  <div class="nav-logo">YOUR<span>BRAND</span></div>
  <div class="nav-links">
    <a href="#services">Services</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </div>
  <a href="#contact" class="nav-cta">Get Quote</a>
</nav>

<style>
.navbar {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--bg-nav);
  border-left: 4px solid var(--accent);
  box-shadow: 0 2px 20px rgba(0,0,0,0.3);
}
.nav-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem; letter-spacing: 0.08em;
}
.nav-logo span { color: var(--accent); }
.nav-links { display: flex; gap: 2rem; }
.nav-links a {
  font-size: 0.8rem; color: rgba(255,255,255,0.6);
  text-decoration: none; letter-spacing: 0.06em;
  text-transform: uppercase; transition: color 0.2s;
}
.nav-links a:hover { color: var(--accent); }
.nav-cta {
  background: var(--accent); color: #000;
  padding: 9px 22px; border-radius: 4px;
  font-size: 0.78rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  text-decoration: none;
}
</style>`,
  };
  return codes[nav] || getGenericNavCode(nav);
}

function getGenericNavCode(nav) {
  return `<!-- ${nav} Navbar -->
<nav class="navbar">
  <div class="nav-logo">YOUR<span>BRAND</span></div>
  <div class="nav-links">
    <a href="#">Home</a>
    <a href="#services">Services</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </div>
</nav>

<style>
.navbar {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--bg-nav);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem; letter-spacing: 0.08em;
}
.nav-logo span { color: var(--accent); }
.nav-links { display: flex; gap: 2rem; }
.nav-links a {
  font-size: 0.8rem; color: var(--text);
  opacity: 0.6; text-decoration: none;
  letter-spacing: 0.06em; text-transform: uppercase;
  transition: opacity 0.2s;
}
.nav-links a:hover { opacity: 1; color: var(--accent); }
</style>`;
}

function getHeroCode(hero) {
  const codes = {
    'Centered Minimal': `<!-- Centered Minimal Hero Section -->
<section class="hero">
  <p class="hero-eyebrow">Your Tagline Here</p>
  <h1>YOUR <span>BRAND</span> NAME</h1>
  <div class="hero-line"></div>
  <p class="hero-sub">Professional services for modern businesses across Ireland.</p>
  <div class="hero-actions">
    <a href="#contact" class="btn-primary">Get in Touch</a>
    <a href="#services" class="btn-ghost">Our Services</a>
  </div>
</section>

<style>
.hero {
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 2rem;
}
.hero-eyebrow {
  font-size: 0.72rem; color: var(--accent);
  letter-spacing: 0.28em; text-transform: uppercase;
  margin-bottom: 1.2rem;
}
h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 8vw, 7rem);
  letter-spacing: 0.06em; line-height: 0.9;
  margin-bottom: 1.2rem;
}
h1 span { color: var(--accent); }
.hero-line {
  width: 48px; height: 2px;
  background: var(--accent);
  margin: 0 auto 1.5rem;
}
.hero-sub {
  font-size: 1.1rem; opacity: 0.55;
  max-width: 520px; margin: 0 auto 2.5rem;
  line-height: 1.7;
}
.hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-primary {
  background: var(--accent); color: #000;
  padding: 14px 34px; border-radius: 5px;
  font-size: 0.84rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  text-decoration: none; transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.85; }
.btn-ghost {
  border: 1px solid var(--accent); color: var(--accent);
  padding: 13px 30px; border-radius: 5px;
  font-size: 0.84rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  text-decoration: none; transition: background 0.2s;
}
.btn-ghost:hover { background: rgba(var(--accent-rgb), 0.1); }
@media (max-width: 480px) {
  .hero-actions { flex-direction: column; align-items: center; }
}
</style>`,
    'Split Layout': `<!-- Split Hero — Text Left, Image Right -->
<section class="hero-split">
  <div class="hs-left">
    <p class="hs-eyebrow">Est. 2024</p>
    <h1>WE BUILD<br><em>THINGS</em></h1>
    <p class="hs-sub">Professional services for modern businesses across Ireland.</p>
    <a href="#contact" class="btn-primary">Get Started</a>
  </div>
  <div class="hs-right">
    <img src="your-hero-image.jpg" alt="Hero image">
    <!-- Or use a background div -->
  </div>
</section>

<style>
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}
.hs-left {
  display: flex; flex-direction: column;
  justify-content: center;
  padding: 4rem;
  gap: 1.2rem;
}
.hs-eyebrow {
  font-size: 0.72rem; color: var(--accent);
  letter-spacing: 0.22em; text-transform: uppercase;
}
h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 5vw, 5.5rem);
  letter-spacing: 0.04em; line-height: 0.93;
}
h1 em { color: var(--accent); font-style: normal; }
.hs-sub { font-size: 1rem; opacity: 0.55; line-height: 1.7; }
.btn-primary {
  background: var(--accent); color: #000;
  padding: 14px 32px; border-radius: 5px;
  font-size: 0.84rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  text-decoration: none; width: fit-content;
}
.hs-right {
  background: linear-gradient(135deg, #0a0a20, #180535);
  display: flex; align-items: center; justify-content: center;
}
.hs-right img { width: 100%; height: 100%; object-fit: cover; }
@media (max-width: 768px) {
  .hero-split { grid-template-columns: 1fr; }
  .hs-left { padding: 3rem 1.5rem; }
  .hs-right { min-height: 300px; }
}
</style>`,
  };
  return codes[hero] || `<!-- ${hero} Hero Section -->\n<!-- Contact CM Studio for full implementation code -->`;
}

function getCardCode(card) {
  const codes = {
    'Glass Morphism': `<!-- Glass Morphism Service Cards -->
<div class="services-grid">
  <div class="service-card glass">
    <div class="card-icon"></div>
    <h3>Service Name</h3>
    <p>Brief description of what this service includes for your clients.</p>
  </div>
  <!-- Repeat for each service -->
</div>

<style>
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
  padding: 4rem 2rem;
  max-width: 960px;
  margin: 0 auto;
}
.service-card.glass {
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.09);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px; padding: 1.8rem;
  transition: border-color 0.2s, transform 0.2s;
}
.service-card.glass:hover {
  border-color: rgba(255,255,255,0.18);
  transform: translateY(-4px);
}
.card-icon {
  width: 40px; height: 40px; border-radius: 8px;
  background: rgba(var(--accent-rgb), 0.15);
  border: 1px solid rgba(var(--accent-rgb), 0.3);
  margin-bottom: 1rem;
}
.service-card h3 {
  font-size: 1rem; font-weight: 700;
  margin-bottom: 0.5rem; color: var(--accent);
}
.service-card p {
  font-size: 0.85rem; opacity: 0.5; line-height: 1.6;
}
</style>`,
    'Bordered Minimal': `<!-- Bordered Minimal Cards -->
<div class="services-grid">
  <div class="service-card bordered">
    <div class="card-line"></div>
    <h3>Service Name</h3>
    <p>Brief description of what this service includes for your clients.</p>
  </div>
</div>

<style>
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
  padding: 4rem 2rem;
  max-width: 960px; margin: 0 auto;
}
.service-card.bordered {
  border: 1px solid var(--border);
  border-radius: 10px; padding: 1.8rem;
  background: var(--bg-nav);
  transition: border-color 0.2s, transform 0.2s;
}
.service-card.bordered:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
}
.card-line {
  width: 36px; height: 2px;
  background: var(--accent); margin-bottom: 1.2rem;
}
.service-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
.service-card p { font-size: 0.85rem; opacity: 0.5; line-height: 1.6; }
</style>`,
  };
  return codes[card] || `<!-- ${card} Card Style -->\n/* Contact CM Studio for implementation */`;
}

function getFooterCode(footer) {
  return `<!-- ${footer} Footer -->
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="footer-logo">YOUR<span>BRAND</span></div>
      <p>Professional services across Ireland.</p>
    </div>
    <div class="footer-col">
      <span class="footer-heading">Quick Links</span>
      <a href="#">Home</a>
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </div>
    <div class="footer-col">
      <span class="footer-heading">Contact</span>
      <a href="tel:+353870000000">+353 87 000 0000</a>
      <a href="mailto:hello@yourbrand.ie">hello@yourbrand.ie</a>
      <p>Dublin, Ireland</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2025 Your Brand Ltd. All rights reserved.</p>
    <div><a href="#">Privacy</a> · <a href="#">Terms</a></div>
  </div>
</footer>

<style>
.site-footer {
  background: var(--bg-nav);
  border-top: 1px solid var(--border);
  padding: 3rem 2rem 1.5rem;
  margin-top: 4rem;
}
.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
  max-width: 960px; margin: 0 auto 2rem;
}
.footer-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem; letter-spacing: 0.08em;
  color: var(--accent); margin-bottom: 0.5rem;
}
.footer-logo span { color: var(--text); }
.footer-brand p { font-size: 0.82rem; opacity: 0.4; line-height: 1.6; }
.footer-heading {
  display: block; font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 0.8rem;
}
.footer-col {
  display: flex; flex-direction: column; gap: 0.4rem;
}
.footer-col a, .footer-col p {
  font-size: 0.82rem; opacity: 0.4;
  text-decoration: none; transition: opacity 0.2s;
}
.footer-col a:hover { opacity: 0.8; color: var(--accent); }
.footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 1.2rem;
  display: flex; justify-content: space-between;
  font-size: 0.72rem; opacity: 0.3;
  max-width: 960px; margin: 0 auto;
}
.footer-bottom a { text-decoration: none; opacity: 1; }
@media (max-width: 640px) {
  .footer-inner { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 0.5rem; }
}
</style>`;
}

function getFormCode(form) {
  return `<!-- ${form} Contact Form -->
<!-- Uses Formspree — replace YOUR_FORM_ID at formspree.io -->
<section class="contact-section" id="contact">
  <p class="section-eyebrow">Get In Touch</p>
  <h2>Contact Us</h2>
  <form
    action="https://formspree.io/f/YOUR_FORM_ID"
    method="POST"
    class="contact-form"
    id="contact-form"
  >
    <div class="form-row">
      <div class="form-field">
        <label>First Name</label>
        <input type="text" name="first_name" placeholder="John" required>
      </div>
      <div class="form-field">
        <label>Last Name</label>
        <input type="text" name="last_name" placeholder="Smith" required>
      </div>
    </div>
    <div class="form-field">
      <label>Email Address</label>
      <input type="email" name="email" placeholder="john@example.com" required>
    </div>
    <div class="form-field">
      <label>Phone Number</label>
      <input type="tel" name="phone" placeholder="+353 87 000 0000">
    </div>
    <div class="form-field">
      <label>Message</label>
      <textarea name="message" rows="5"
        placeholder="Tell us about your project..." required></textarea>
    </div>
    <!-- Honeypot spam prevention -->
    <input type="text" name="_gotcha" style="display:none">
    <button type="submit">Send Message</button>
    <p class="form-success" id="form-success" style="display:none;">
      ✓ Message sent — we'll be in touch shortly!
    </p>
  </form>
</section>

<style>
.contact-section {
  max-width: 620px; margin: 0 auto; padding: 5rem 2rem;
}
.section-eyebrow {
  font-size: 0.7rem; color: var(--accent);
  letter-spacing: 0.22em; text-transform: uppercase;
  margin-bottom: 0.5rem;
}
.contact-section h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: 0.06em; margin-bottom: 2.5rem;
}
.contact-form { display: flex; flex-direction: column; gap: 1.2rem; }
.form-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
}
.form-field { display: flex; flex-direction: column; gap: 0.4rem; }
.form-field label {
  font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.5;
}
.form-field input,
.form-field textarea {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  color: var(--text); padding: 11px 14px;
  border-radius: 6px; font-size: 0.9rem;
  font-family: inherit; outline: none;
  transition: border-color 0.2s;
}
.form-field input:focus,
.form-field textarea:focus { border-color: var(--accent); }
.form-field textarea { resize: vertical; }
button[type="submit"] {
  background: var(--accent); color: #000;
  padding: 14px; border: none; border-radius: 6px;
  font-size: 0.84rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; transition: opacity 0.2s;
}
button[type="submit"]:hover { opacity: 0.85; }
.form-success { color: var(--accent); font-size: 0.88rem; text-align: center; }
@media (max-width: 480px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>

<script>
/* Optional: Handle Formspree AJAX submission */
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  try {
    const res = await fetch(this.action, {
      method: 'POST',
      body: new FormData(this),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      this.reset();
      document.getElementById('form-success').style.display = 'block';
      btn.textContent = '✓ Sent!';
    } else {
      btn.textContent = 'Try Again';
      btn.disabled = false;
    }
  } catch(err) {
    btn.textContent = 'Try Again';
    btn.disabled = false;
  }
});
<\/script>`;
}

function getAnimCode(anim) {
  const codes = {
    'Fade In Up': `/* Fade In Up Scroll Animation */
/* Add class="anim-el" to any element you want animated */

<style>
.anim-el {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.anim-el.visible {
  opacity: 1;
  transform: translateY(0);
}
/* Stagger children with delay */
.anim-el:nth-child(2) { transition-delay: 0.1s; }
.anim-el:nth-child(3) { transition-delay: 0.2s; }
.anim-el:nth-child(4) { transition-delay: 0.3s; }
</style>

<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.anim-el').forEach(el => observer.observe(el));
<\/script>`,
    'Slide In Left': `/* Slide In Left Scroll Animation */
<style>
.anim-el {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.anim-el.visible {
  opacity: 1;
  transform: translateX(0);
}
.anim-el:nth-child(2) { transition-delay: 0.1s; }
.anim-el:nth-child(3) { transition-delay: 0.2s; }
</style>

<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.anim-el').forEach(el => observer.observe(el));
<\/script>`,
    'Scale In': `/* Scale In Scroll Animation */
<style>
.anim-el {
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.anim-el.visible {
  opacity: 1;
  transform: scale(1);
}
</style>

<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.anim-el').forEach(el => observer.observe(el));
<\/script>`,
    'Count Up Numbers': `/* Count Up Number Animation */
<div class="stats-section">
  <div class="stat anim-count" data-target="500" data-suffix="+">0+</div>
  <div class="stat anim-count" data-target="12" data-suffix="yr">0yr</div>
  <div class="stat anim-count" data-target="99" data-suffix="%">0%</div>
</div>

<style>
.stats-section {
  display: flex; gap: 3rem;
  justify-content: center; flex-wrap: wrap;
  padding: 4rem 2rem;
}
.stat {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 4rem; color: var(--accent);
  line-height: 1; text-align: center;
}
</style>

<script>
function countUp(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 20);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.anim-count').forEach(el => observer.observe(el));
<\/script>`,
    'Stagger Grid': `/* Stagger Grid Animation */
<div class="services-grid">
  <div class="service-card anim-el">Card 1</div>
  <div class="service-card anim-el">Card 2</div>
  <div class="service-card anim-el">Card 3</div>
</div>

<style>
.anim-el {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.anim-el.visible { opacity: 1; transform: translateY(0); }
/* Stagger delays */
.anim-el:nth-child(1) { transition-delay: 0s;    }
.anim-el:nth-child(2) { transition-delay: 0.1s;  }
.anim-el:nth-child(3) { transition-delay: 0.2s;  }
.anim-el:nth-child(4) { transition-delay: 0.3s;  }
.anim-el:nth-child(5) { transition-delay: 0.4s;  }
.anim-el:nth-child(6) { transition-delay: 0.5s;  }
</style>

<script>
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.anim-el').forEach(el => observer.observe(el));
<\/script>`,
    'Text Reveal': `/* Text Reveal Animation */
<!-- Wrap each line in overflow:hidden + inner span -->
<div class="reveal-section">
  <div class="reveal-line"><span class="anim-reveal">WE PROTECT</span></div>
  <div class="reveal-line"><span class="anim-reveal" style="transition-delay:0.1s">WHAT MATTERS</span></div>
  <div class="reveal-line"><span class="anim-reveal" style="transition-delay:0.2s">TO YOU.</span></div>
</div>

<style>
.reveal-section {
  padding: 5rem 2rem;
}
.reveal-line {
  overflow: hidden; /* Critical — clips the sliding text */
  line-height: 0.95;
  margin-bottom: 0.3rem;
}
.anim-reveal {
  display: block;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 8vw, 7rem);
  letter-spacing: 0.04em;
  transform: translateY(110%);
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.anim-reveal.visible {
  transform: translateY(0);
}
</style>

<script>
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.anim-reveal').forEach(el => observer.observe(el));
<\/script>`,
  };
  return codes[anim] || `/* ${anim} Scroll Animation */\n/* Contact CM Studio for implementation */`;
}