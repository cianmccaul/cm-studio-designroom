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
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
      // A random file name: the image is viewable by its link, so the link shouldn't say whose it is.
      const path = `moodboards/${crypto.randomUUID()}.${ext}`;
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
