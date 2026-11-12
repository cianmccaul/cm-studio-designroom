/* ═══════════════════════════════════════
   CM STUDIO — DESIGNROOM
   js/demo.js
   Demo-safe mode for portfolio visitors.

   Open the showroom with ?demo=1 and:
   - sending a brief shows the normal success screen, but nothing is
     uploaded, saved to Supabase or emailed (submit.js checks DR_DEMO
     and never creates the Supabase or EmailJS clients)
   - a small banner says it's a demo
   Without ?demo=1 the showroom works as normal for real clients.
═══════════════════════════════════════ */

window.DR_DEMO = (function () {
  try {
    return new URLSearchParams(window.location.search).get('demo') === '1';
  } catch (e) {
    return false;
  }
})();

(function () {
  if (!window.DR_DEMO) return;
  document.documentElement.classList.add('dr-demo');

  function addBanner() {
    if (document.getElementById('dr-demo-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'dr-demo-banner';
    banner.setAttribute('role', 'status');
    banner.innerHTML =
      '<strong>Demo</strong><span>Briefs aren’t saved or emailed</span>';
    document.body.appendChild(banner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addBanner);
  } else {
    addBanner();
  }
})();
