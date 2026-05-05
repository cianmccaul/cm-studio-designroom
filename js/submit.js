function getVal(id) {
  return document.getElementById(id)?.value?.trim() || '';
}

function getChecked(stepId) {
  const step = document.getElementById(stepId);
  if (!step) return [];
  return Array.from(step.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
}

function collectQuestionnaireData() {
  const allChecked = getChecked('step-2');
  const pageOptions = ['Home Page', 'About Us', 'Services Page', 'Contact Page', 'Gallery / Portfolio', 'Testimonials', 'FAQ Page', 'Pricing Page'];
  const featureOptions = ['Contact Form', 'Google Maps', 'WhatsApp Button', 'Cookie Banner', 'Social Media Icons', 'Live Chat', 'Photo Gallery', 'Before & After Slider', 'Scroll Animations', 'Mobile Optimised'];

  return {
    client_name: getVal('q-name'),
    client_email: getVal('q-email'),
    business_name: getVal('q-biz'),
    what_they_do: getVal('q-what'),
    phone: getVal('q-phone'),
    location: getVal('q-location'),
    pages_needed: allChecked.filter(value => pageOptions.includes(value)),
    features_needed: allChecked.filter(value => featureOptions.includes(value)),
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
    mood_board_files: moodFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))
  };
}

function buildBriefPayload() {
  return {
    id: `brief-${Date.now()}`,
    generated_at: new Date().toISOString(),
    selections: { ...selections },
    questionnaire: collectQuestionnaireData()
  };
}

function makeList(label, values) {
  if (!values || (Array.isArray(values) && !values.length)) return '';
  const rendered = Array.isArray(values) ? values.join(', ') : values;
  return `- ${label}: ${rendered}`;
}

function buildBriefMarkdown(payload) {
  const q = payload.questionnaire;
  const selectionLines = Object.entries(payload.selections).map(([key, value]) => `- ${key}: ${value}`);
  const detailLines = [
    makeList('Client name', q.client_name),
    makeList('Client email', q.client_email),
    makeList('Business name', q.business_name),
    makeList('What the business does', q.what_they_do),
    makeList('Phone', q.phone),
    makeList('Location', q.location),
    makeList('Pages needed', q.pages_needed),
    makeList('Features needed', q.features_needed),
    makeList('Tagline', q.tagline),
    makeList('Services', q.services),
    makeList('Homepage notes', q.homepage_content),
    makeList('Social links', q.social_links),
    makeList('Logo', q.has_logo),
    makeList('Photos', q.has_photos),
    makeList('Brand colours', q.brand_colours),
    makeList('Inspiration sites', q.inspiration_sites),
    makeList("Avoid", q.dont_wants),
    makeList('Domain status', q.has_domain),
    makeList('Domain name', q.domain_name),
    makeList('Existing site', q.existing_site),
    makeList('Existing URL', q.existing_url),
    makeList('Extra notes', q.extra_notes),
    makeList('Mood board files', q.mood_board_files.map(file => file.name))
  ].filter(Boolean);

  return [
    '# CM Studio Website Brief',
    '',
    `Generated: ${payload.generated_at}`,
    '',
    '## Visual selections',
    selectionLines.length ? selectionLines.join('\n') : '- No visual selections recorded',
    '',
    '## Project details',
    detailLines.length ? detailLines.join('\n') : '- No questionnaire data recorded'
  ].join('\n');
}

function downloadBriefFile(filename, contents, mimeType = 'text/markdown;charset=utf-8') {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyBriefSummary(markdown) {
  if (!navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(markdown);
    return true;
  } catch (error) {
    return false;
  }
}

function openEmailDraft(payload, markdown) {
  const q = payload.questionnaire;
  const subject = `Website brief for ${q.business_name || q.client_name || 'new project'}`;
  const shortSummary = [
    `Client: ${q.client_name || 'Not provided'}`,
    `Business: ${q.business_name || 'Not provided'}`,
    `Email: ${q.client_email || 'Not provided'}`,
    '',
    'Key selections:',
    ...Object.entries(payload.selections).map(([key, value]) => `- ${key}: ${value}`),
    '',
    'The full brief has been downloaded locally.'
  ].join('\n');
  window.location.href = `mailto:cian.mccaul2@mail.dcu.ie?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shortSummary)}`;
  return markdown;
}

function renderBriefActions(payload, markdown) {
  const success = document.getElementById('q-success');
  if (!success) return;

  const title = success.querySelector('.q-success-title');
  const sub = success.querySelector('.q-success-sub');
  if (title) title.textContent = 'Brief Ready';
  if (sub) sub.innerHTML = 'Your project summary was prepared locally.<br>Download it, copy it, or open an email draft to send it on.';

  let actions = document.getElementById('q-actions');
  if (!actions) {
    actions = document.createElement('div');
    actions.id = 'q-actions';
    actions.className = 'q-actions';
    success.appendChild(actions);
  }
  actions.innerHTML = '';

  const downloadBtn = document.createElement('button');
  downloadBtn.type = 'button';
  downloadBtn.className = 'q-action-btn primary';
  downloadBtn.textContent = 'Download Brief';
  downloadBtn.addEventListener('click', () => {
    const safeName = (payload.questionnaire.business_name || payload.questionnaire.client_name || 'website-brief')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    downloadBriefFile(`${safeName || 'website-brief'}.md`, markdown);
  });

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'q-action-btn';
  copyBtn.textContent = 'Copy Summary';
  copyBtn.addEventListener('click', async () => {
    const copied = await copyBriefSummary(markdown);
    showToast(copied ? 'Brief copied to clipboard' : 'Clipboard copy is not available here', copied ? 'success' : 'error');
  });

  const emailBtn = document.createElement('button');
  emailBtn.type = 'button';
  emailBtn.className = 'q-action-btn';
  emailBtn.textContent = 'Open Email Draft';
  emailBtn.addEventListener('click', () => openEmailDraft(payload, markdown));

  const exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.className = 'q-action-btn';
  exportBtn.textContent = 'Export Admin JSON';
  exportBtn.addEventListener('click', () => {
    const safeName = (payload.questionnaire.business_name || payload.questionnaire.client_name || payload.id)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    downloadBriefFile(`${safeName || 'website-brief'}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
  });

  actions.appendChild(downloadBtn);
  actions.appendChild(copyBtn);
  actions.appendChild(emailBtn);
  actions.appendChild(exportBtn);
}

async function submitBrief() {
  const nextButton = document.getElementById('q-next');
  if (nextButton) {
    nextButton.textContent = 'Preparing...';
    nextButton.disabled = true;
  }

  const payload = buildBriefPayload();
  const markdown = buildBriefMarkdown(payload);

  try {
    localStorage.setItem('cm_studio_last_brief', JSON.stringify(payload));
    const history = JSON.parse(localStorage.getItem('cm_studio_briefs') || '[]');
    history.unshift(payload);
    localStorage.setItem('cm_studio_briefs', JSON.stringify(history.slice(0, 25)));
    renderBriefActions(payload, markdown);

    document.querySelectorAll('.q-step').forEach(step => step.classList.remove('active'));
    document.getElementById('q-success')?.classList.add('show');
    const footer = document.getElementById('q-footer');
    if (footer) footer.style.display = 'none';
    const progress = document.getElementById('q-progress-fill');
    if (progress) progress.style.width = '100%';

    const safeName = (payload.questionnaire.business_name || payload.questionnaire.client_name || 'website-brief')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    downloadBriefFile(`${safeName || 'website-brief'}.md`, markdown);

    const copied = await copyBriefSummary(markdown);
    showToast(copied ? 'Brief prepared and copied' : 'Brief prepared locally', 'success');
  } catch (error) {
    console.error('Brief preparation error:', error);
    showToast('Could not prepare the brief. Please try again.', 'error');
    if (nextButton) {
      nextButton.textContent = 'Prepare Brief ✦';
      nextButton.disabled = false;
    }
  }
}
