
/* ═══════════════════════════════════════════════
   HTML ESCAPE — FIX #4 (XSS)
   All user-supplied or AI-generated text that
   gets injected into innerHTML must go through
   this function first.
═══════════════════════════════════════════════ */
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

/* ═══════════════════════════════════════════════
   FONT CONFIGS
═══════════════════════════════════════════════ */
const FONTS = {
  editorial: {
    heading: 'Playfair Display',
    body: 'DM Sans',
    url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap'
  },
  modern: {
    heading: 'Plus Jakarta Sans',
    body: 'Plus Jakarta Sans',
    url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap'
  },
  warm: {
    heading: 'Lora',
    body: 'Nunito Sans',
    url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap'
  },
  technical: {
    heading: 'Space Grotesk',
    body: 'Space Grotesk',
    url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
  },
  bold: {
    heading: 'Fraunces',
    body: 'Outfit',
    url: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;600;700&family=Outfit:wght@400;500;600;700&display=swap'
  }
};

/* ═══════════════════════════════════════════════
   COLOR DERIVATION
═══════════════════════════════════════════════ */
function hexToHsl(hex) {
  let r = parseInt(hex.slice(1,3), 16) / 255;
  let g = parseInt(hex.slice(3,5), 16) / 255;
  let b = parseInt(hex.slice(5,7), 16) / 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function derivePalette(hex) {
  const [h, s, l] = hexToHsl(hex);
  const isWarm = (h >= 0 && h <= 60) || (h >= 300 && h <= 360);
  return {
    primary:     hex,
    light:       hslToHex(h, Math.max(s - 10, 20), Math.min(l + 20, 85)),
    dark:        hslToHex(h, Math.min(s + 10, 90), Math.max(l - 30, 15)),
    lightBg:     isWarm ? hslToHex(h, 20, 97) : hslToHex(h, 10, 97),
    lightBorder: isWarm ? hslToHex(h, 15, 90) : hslToHex(h, 8, 90),
    darkBg:      isWarm ? '#1A1918' : hslToHex(h, 20, 10)
  };
}

function syncColor(val) {
  document.getElementById('colorHex').value = val;
  updatePalettePreview(val);
}
function syncHex(val) {
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    document.getElementById('colorPicker').value = val;
    updatePalettePreview(val);
  }
}
function randomColor() {
  // Generate a visually rich random color — high saturation, mid-range lightness
  // so it's never too dark or too washed out for a brand palette
  const h = Math.floor(Math.random() * 360);
  const s = 55 + Math.floor(Math.random() * 35); // 55–90%
  const l = 38 + Math.floor(Math.random() * 22); // 38–60%
  const hex = hslToHex(h, s, l);
  document.getElementById('colorHex').value   = hex;
  document.getElementById('colorPicker').value = hex;
  updatePalettePreview(hex);
}
function updatePalettePreview(hex) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
  const p = derivePalette(hex);
  const labels = ['Primary', 'Light', 'Dark', 'Light BG', 'Border', 'Dark BG'];
  const colors = [p.primary, p.light, p.dark, p.lightBg, p.lightBorder, p.darkBg];
  document.getElementById('palettePreview').innerHTML = colors
    .map((c, i) => `<div class="swatch" style="background:${c}" data-label="${labels[i]}: ${c}" title="${labels[i]}: ${c}"></div>`)
    .join('');
}
updatePalettePreview('#6C5CE7'); // init

/* ═══════════════════════════════════════════════
   STATUS HELPER
═══════════════════════════════════════════════ */
function setStatus(msg, type = '') {
  const el = document.getElementById('statusBar');
  el.textContent = msg;
  el.className = 'status-bar' + (type ? ' ' + type : '');
}

/* ═══════════════════════════════════════════════
   EXAMPLE FILLER
═══════════════════════════════════════════════ */
const examples = [
  { name: 'Zenly Brand',  handle: '@zenlybrand',  color: '#E17055', font: 'bold',      tone: 'bold',         topic: 'Launching our new product line. The future of sustainable packaging — 5 reasons to care.' },
  { name: 'MindFlow',     handle: '@mindflow.co', color: '#00B894', font: 'modern',    tone: 'professional', topic: '5 productivity habits that changed how I work. From chaotic to calm in 30 days.' },
  { name: 'Amplify Co',   handle: '@amplifyhq',   color: '#0984E3', font: 'editorial', tone: 'professional', topic: 'Your social media strategy is broken. Here is what actually works in 2026.' }
];
function fillExample(i) {
  const e = examples[i];
  document.getElementById('brandName').value  = e.name;
  document.getElementById('igHandle').value   = e.handle;
  document.getElementById('colorHex').value   = e.color;
  document.getElementById('colorPicker').value = e.color;
  document.getElementById('fontStyle').value  = e.font;
  document.getElementById('tone').value       = e.tone;
  document.getElementById('topic').value      = e.topic;
  updatePalettePreview(e.color);
}

/* ═══════════════════════════════════════════════
   SLIDE CONTENT GENERATOR
═══════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════
   AI CONTENT GENERATION
   Calls our own /api/generate endpoint — the API
   key lives on the server, never in the browser.
═══════════════════════════════════════════════ */
async function generateSlideContent(topic, tone) {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, tone })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server error ${response.status}`);
    }

    const parsed = await response.json();
    if (!Array.isArray(parsed?.slides) || !parsed.slides.length) {
      throw new Error('Invalid response from server');
    }
    return parsed;

  } catch (err) {
    console.warn('Content generation failed:', err.message);
    setStatus(`${err.message} — using fallback content`, 'error');
    await new Promise(r => setTimeout(r, 1500));
    return { ...fallbackSlideContent(topic, tone), sample: true };
  }
}

/* ═══════════════════════════════════════════════
   FALLBACK CONTENT (server unreachable / error)
═══════════════════════════════════════════════ */
function fallbackSlideContent(topic, tone) {
  const toneMap = {
    professional: { cta: 'Follow for more insights',    action: 'Learn More',  tag: 'INSIGHTS'   },
    casual:       { cta: 'Drop a comment below!',       action: 'Say Hi',      tag: "LET'S TALK" },
    playful:      { cta: 'Tag someone who needs this!', action: 'Join Us',     tag: 'FUN STUFF'  },
    bold:         { cta: 'Start today. Not tomorrow.',  action: "Let's Go",    tag: 'NO EXCUSES' },
    minimal:      { cta: 'Less noise. More signal.',    action: 'Explore',     tag: 'ESSENTIALS' }
  };
  const t = toneMap[tone] || toneMap.professional;
  const headline = topic.length > 50 ? topic.substring(0, 47) + '...' : topic;
  return { slides: [
    { type: 'hero',     tag: 'FEATURED',      headline, sub: 'Swipe to see the full breakdown →' },
    { type: 'problem',  tag: 'THE PROBLEM',   headline: 'Most people are doing this wrong',
      points: ['Time wasted on the wrong things', 'No clear system or framework', 'Starting over from scratch every time'] },
    { type: 'solution', tag: 'THE SOLUTION',  headline: "Here's what actually works",
      quote: "The best approach is the one you'll actually stick to." },
    { type: 'features', tag: t.tag,           headline: "What you'll get from this",
      features: [
        { icon: '✦', label: 'Clarity',     desc: 'Know exactly what to focus on'     },
        { icon: '◈', label: 'Speed',       desc: 'Cut the time it takes to execute'  },
        { icon: '◉', label: 'Consistency', desc: 'Build habits that stick long-term' },
        { icon: '◆', label: 'Results',     desc: 'See measurable outcomes faster'    }
      ]},
    { type: 'details',  tag: 'HOW IT WORKS',  headline: 'The framework in 3 parts',
      pills: ['Step 1: Audit', 'Step 2: Build', 'Step 3: Scale', 'Repeat'] },
    { type: 'howto',    tag: 'YOUR ROADMAP',  headline: 'Start here',
      steps: [
        { n: '01', title: 'Define your goal',  desc: 'Be specific — vague goals produce vague results'  },
        { n: '02', title: 'Remove blockers',   desc: "Identify what's slowing you down right now"      },
        { n: '03', title: 'Execute daily',     desc: 'Small consistent actions beat big sporadic ones' }
      ]},
    { type: 'cta', tag: 'TAKE ACTION', headline: t.cta, cta: t.action }
  ]};
}

/* ═══════════════════════════════════════════════
   SLIDE BUILDER
   FIX #3: every inner slide div gets overflow:hidden
   FIX #4: progress bar height = 50px, padding-bottom = 58px (safe clearance)
   FIX #15: word-break:break-word on all headings & body text
═══════════════════════════════════════════════ */
const PB_HEIGHT = 50; // progress bar zone height in px — matches padding-bottom below
const CONTENT_PAD = `36px 32px ${PB_HEIGHT + 10}px`; // top | sides | bottom clearance

function buildSlide(slide, index, total, P, fonts, brand, handle) {
  const isLast = index === total - 1;
  const HF = fonts.heading;
  const BF = fonts.body;
  const pct = ((index + 1) / total) * 100;

  /* ── Progress bar (FIX #23: 10px font, consistent) ── */
  const progressBar = (light) => {
    const track = light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)';
    const fill  = light ? P.primary : '#fff';
    const label = light ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.4)';
    return `<div style="position:absolute;bottom:0;left:0;right:0;height:${PB_HEIGHT}px;display:flex;align-items:center;padding:0 28px;gap:10px;z-index:10;">
      <div style="flex:1;height:3px;background:${track};border-radius:2px;overflow:hidden;">
        <div style="height:100%;width:${pct}%;background:${fill};border-radius:2px;transition:width 0.4s;"></div>
      </div>
      <span style="font-size:10px;color:${label};font-weight:500;white-space:nowrap;">${index + 1}/${total}</span>
    </div>`;
  };

  /* ── Swipe arrow (not on last slide) ── */
  const swipeArrow = (light) => {
    if (isLast) return '';
    const bg     = light ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.07)';
    const stroke = light ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.32)';
    return `<div style="position:absolute;right:0;top:0;bottom:0;width:40px;z-index:9;display:flex;align-items:center;justify-content:center;background:linear-gradient(to right,transparent,${bg});pointer-events:none;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M9 6l6 6-6 6" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`;
  };

  /* ── Tag label ── */
  const tag = (text, light, gradient = false) => {
    const c = gradient ? 'rgba(255,255,255,0.6)' : light ? P.primary : P.light;
    return `<div style="font-family:'${BF}',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${c};margin-bottom:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(text)}</div>`;
  };

  /* ── Logo lockup (hero + CTA) ── */
  const logoLockup = (light) => {
    const circleBg = light ? P.primary : 'rgba(255,255,255,0.15)';
    const letterC  = '#fff';
    const nameC    = light ? P.darkBg : '#fff';
    const subC     = light ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';
    return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;flex-shrink:0;">
      <div style="width:34px;height:34px;border-radius:50%;background:${circleBg};display:flex;align-items:center;justify-content:center;font-family:'${HF}',serif;font-size:14px;font-weight:700;color:${letterC};flex-shrink:0;">${escapeHtml(brand.charAt(0).toUpperCase())}</div>
      <div style="min-width:0;">
        <div style="font-family:'${BF}',sans-serif;font-size:12px;font-weight:600;color:${nameC};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(brand)}</div>
        <div style="font-family:'${BF}',sans-serif;font-size:10px;color:${subC};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(handle)}</div>
      </div>
    </div>`;
  };

  /* ── Common text style helpers ── */
  const h1Style = `font-family:'${HF}',serif;font-size:28px;font-weight:700;line-height:1.1;letter-spacing:-0.4px;margin-bottom:12px;overflow-wrap:break-word;word-break:break-word;`;
  const h2Style = `font-family:'${HF}',serif;font-size:23px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;margin-bottom:14px;overflow-wrap:break-word;word-break:break-word;`;
  const bodyStyle = `font-family:'${BF}',sans-serif;font-size:13px;line-height:1.5;overflow-wrap:break-word;word-break:break-word;`;

  /* ── Shared wrapper style ── */
  // FIX #3: overflow:hidden on every slide inner div
  const wrapStyle = (bg, justify = 'flex-end') =>
    `width:100%;height:100%;background:${bg};position:relative;display:flex;flex-direction:column;justify-content:${justify};padding:${CONTENT_PAD};overflow:hidden;`;

  let inner = '';

  /* ── HERO ── */
  if (slide.type === 'hero') {
    inner = `<div style="${wrapStyle(P.lightBg)}">
      ${logoLockup(true)}
      ${tag(slide.tag, true)}
      <h1 style="${h1Style}color:${P.darkBg};">${escapeHtml(slide.headline)}</h1>
      <p style="${bodyStyle}color:rgba(0,0,0,0.45);">${escapeHtml(slide.sub)}</p>
      <div style="position:absolute;top:24px;right:32px;width:72px;height:72px;border-radius:50%;background:${P.primary};opacity:0.06;pointer-events:none;"></div>
      <div style="position:absolute;top:56px;right:16px;width:36px;height:36px;border-radius:50%;background:${P.primary};opacity:0.08;pointer-events:none;"></div>
      ${swipeArrow(true)}${progressBar(true)}
    </div>`;
  }

  /* ── PROBLEM ── */
  else if (slide.type === 'problem') {
    const items = slide.points.map(p =>
      `<div style="display:flex;align-items:flex-start;gap:12px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;">
        <span style="color:${P.primary};font-size:14px;margin-top:2px;flex-shrink:0;">✕</span>
        <span style="${bodyStyle}color:rgba(255,255,255,0.78);">${escapeHtml(p)}</span>
      </div>`
    ).join('');
    inner = `<div style="${wrapStyle(P.darkBg)}">
      ${tag(slide.tag, false)}
      <h2 style="${h2Style}color:#fff;">${escapeHtml(slide.headline)}</h2>
      <div style="display:flex;flex-direction:column;overflow:hidden;">${items}</div>
      ${swipeArrow(false)}${progressBar(false)}
    </div>`;
  }

  /* ── SOLUTION ── */
  else if (slide.type === 'solution') {
    const grad = `linear-gradient(165deg,${P.dark} 0%,${P.primary} 55%,${P.light} 100%)`;
    inner = `<div style="${wrapStyle(grad, 'center')}">
      ${tag(slide.tag, false, true)}
      <h2 style="${h2Style}color:#fff;">${escapeHtml(slide.headline)}</h2>
      <div style="padding:14px;background:rgba(0,0,0,0.18);border-radius:12px;border:1px solid rgba(255,255,255,0.1);flex-shrink:0;">
        <div style="font-family:'${BF}',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:7px;">KEEP IN MIND</div>
        <div style="font-family:'${HF}',serif;font-size:14px;color:#fff;font-style:italic;line-height:1.5;overflow-wrap:break-word;">&ldquo;${escapeHtml(slide.quote)}&rdquo;</div>
      </div>
      ${swipeArrow(false)}${progressBar(false)}
    </div>`;
  }

  /* ── FEATURES ── */
  else if (slide.type === 'features') {
    // FIX #18: no border on last row
    const rows = slide.features.map((f, idx) => {
      const isLastRow = idx === slide.features.length - 1;
      const border = isLastRow ? '' : `border-bottom:1px solid ${P.lightBorder};`;
      return `<div style="display:flex;align-items:flex-start;gap:12px;padding:9px 0;${border}flex-shrink:0;">
        <span style="color:${P.primary};font-size:15px;width:18px;text-align:center;flex-shrink:0;margin-top:1px;">${escapeHtml(f.icon)}</span>
        <div style="min-width:0;">
          <div style="font-family:'${BF}',sans-serif;font-size:13px;font-weight:600;color:${P.darkBg};margin-bottom:1px;overflow-wrap:break-word;">${escapeHtml(f.label)}</div>
          <div style="font-family:'${BF}',sans-serif;font-size:11px;color:#8a8580;line-height:1.4;overflow-wrap:break-word;">${escapeHtml(f.desc)}</div>
        </div>
      </div>`;
    }).join('');
    inner = `<div style="${wrapStyle(P.lightBg)}">
      ${tag(slide.tag, true)}
      <h2 style="${h2Style}color:${P.darkBg};">${escapeHtml(slide.headline)}</h2>
      <div style="display:flex;flex-direction:column;overflow:hidden;">${rows}</div>
      ${swipeArrow(true)}${progressBar(true)}
    </div>`;
  }

  /* ── DETAILS ── */
  else if (slide.type === 'details') {
    const pills = slide.pills.map(p =>
      `<span style="display:inline-flex;align-items:center;font-family:'${BF}',sans-serif;font-size:11px;padding:5px 13px;background:rgba(255,255,255,0.07);border-radius:20px;color:${P.light};border:1px solid rgba(255,255,255,0.1);white-space:nowrap;">${escapeHtml(p)}</span>`
    ).join('');
    inner = `<div style="${wrapStyle(P.darkBg)}">
      ${tag(slide.tag, false)}
      <h2 style="${h2Style}color:#fff;">${escapeHtml(slide.headline)}</h2>
      <div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px;">${pills}</div>
      <div style="padding:14px;background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid rgba(255,255,255,0.07);flex-shrink:0;">
        <p style="${bodyStyle}font-size:12px;color:rgba(255,255,255,0.5);">Each step builds on the last. Skip one and the whole system breaks down. That's why consistency beats intensity every time.</p>
      </div>
      ${swipeArrow(false)}${progressBar(false)}
    </div>`;
  }

  /* ── HOW-TO ── */
  else if (slide.type === 'howto') {
    // FIX #18: no border on last step row
    const steps = slide.steps.map((s, idx) => {
      const isLastStep = idx === slide.steps.length - 1;
      const border = isLastStep ? '' : `border-bottom:1px solid ${P.lightBorder};`;
      return `<div style="display:flex;align-items:flex-start;gap:14px;padding:11px 0;${border}flex-shrink:0;">
        <span style="font-family:'${HF}',serif;font-size:22px;font-weight:300;color:${P.primary};min-width:32px;line-height:1.1;flex-shrink:0;">${escapeHtml(s.n)}</span>
        <div style="min-width:0;">
          <div style="font-family:'${BF}',sans-serif;font-size:13px;font-weight:600;color:${P.darkBg};margin-bottom:2px;overflow-wrap:break-word;">${escapeHtml(s.title)}</div>
          <div style="font-family:'${BF}',sans-serif;font-size:11px;color:#8a8580;line-height:1.4;overflow-wrap:break-word;">${escapeHtml(s.desc)}</div>
        </div>
      </div>`;
    }).join('');
    inner = `<div style="${wrapStyle(P.lightBg)}">
      ${tag(slide.tag, true)}
      <h2 style="${h2Style}color:${P.darkBg};">${escapeHtml(slide.headline)}</h2>
      <div style="display:flex;flex-direction:column;overflow:hidden;">${steps}</div>
      ${swipeArrow(true)}${progressBar(true)}
    </div>`;
  }

  /* ── CTA ── */
  else if (slide.type === 'cta') {
    const grad = `linear-gradient(165deg,${P.dark} 0%,${P.primary} 55%,${P.light} 100%)`;
    inner = `<div style="${wrapStyle(grad, 'center')}">
      ${logoLockup(false)}
      ${tag(slide.tag, false, true)}
      <h2 style="${h2Style}color:#fff;">${escapeHtml(slide.headline)}</h2>
      <div style="display:inline-flex;align-items:center;gap:8px;padding:11px 26px;background:${P.lightBg};color:${P.dark};font-family:'${BF}',sans-serif;font-weight:700;font-size:13px;border-radius:28px;flex-shrink:0;align-self:flex-start;white-space:nowrap;">
        ${escapeHtml(slide.cta)} →
      </div>
      ${progressBar(false)}
    </div>`;
  }

  return inner;
}

/* ═══════════════════════════════════════════════
   CAROUSEL STATE
═══════════════════════════════════════════════ */
let currentSlide = 0;
let totalSlides  = 0;
let slideWidth   = 380; // updated after render via measureAndSetSlideWidths()
let isGenerating = false; // FIX #12: re-entry guard

/* ═══════════════════════════════════════════════
   MEASURE & SET SLIDE WIDTHS (FIX #1, #2)
   Must run AFTER the frame is in the DOM.
   Uses actual rendered offsetWidth — not hardcoded.
═══════════════════════════════════════════════ */
function measureAndSetSlideWidths() {
  const vp = document.getElementById('igViewport');
  if (!vp) return;
  slideWidth = vp.offsetWidth;
  document.querySelectorAll('.ig-slide-wrap').forEach(el => {
    el.style.width    = slideWidth + 'px';
    el.style.minWidth = slideWidth + 'px';
  });
}

/* ═══════════════════════════════════════════════
   SLIDE NAVIGATION
═══════════════════════════════════════════════ */
function goToSlide(n, animate = true) {
  currentSlide = Math.max(0, Math.min(n, totalSlides - 1));
  const track = document.getElementById('igTrack');
  if (!track) return;
  // FIX #1: pixel-based transform — not percentage
  if (!animate) track.classList.add('no-transition');
  track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  if (!animate) requestAnimationFrame(() => track.classList.remove('no-transition'));

  document.querySelectorAll('.ig-ind').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  const counter = document.getElementById('slideCounter');
  if (counter) counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
}
function prevSlide() { goToSlide(currentSlide - 1); }
function nextSlide() { goToSlide(currentSlide + 1); }

/* ═══════════════════════════════════════════════
   DRAG INTERACTION (FIX #7, #8, #9, #10, #20)
   Uses Pointer Events + setPointerCapture for
   reliable cross-device, cross-boundary drag.
═══════════════════════════════════════════════ */
function setupDrag() {
  const vp = document.getElementById('igViewport');
  if (!vp) return;

  let dragStartX  = 0;
  let dragging    = false;
  let liveDelta   = 0;

  vp.addEventListener('pointerdown', e => {
    dragging   = true;
    dragStartX = e.clientX;
    liveDelta  = 0;
    vp.classList.add('dragging');
    vp.setPointerCapture(e.pointerId); // FIX #8: capture keeps events even outside element
  });

  vp.addEventListener('pointermove', e => {
    if (!dragging) return;
    liveDelta = dragStartX - e.clientX;
    // FIX #7: live visual feedback during drag
    const track = document.getElementById('igTrack');
    if (track) {
      track.classList.add('no-transition');
      track.style.transform = `translateX(${-(currentSlide * slideWidth) - liveDelta}px)`;
    }
  });

  vp.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    vp.classList.remove('dragging');
    // Snap to slide based on drag distance
    if (Math.abs(liveDelta) > slideWidth * 0.2) {
      liveDelta > 0 ? nextSlide() : prevSlide();
    } else {
      goToSlide(currentSlide); // snap back
    }
    liveDelta = 0;
  });

  vp.addEventListener('pointercancel', () => {
    if (!dragging) return;
    dragging = false;
    vp.classList.remove('dragging');
    goToSlide(currentSlide); // snap back on cancel
    liveDelta = 0;
  });
}

/* ═══════════════════════════════════════════════
   FONT LOADER (FIX #11, #21)
   Injects font link, then polls document.fonts
   until the heading font is available (or timeout).
═══════════════════════════════════════════════ */
function loadFont(font) {
  return new Promise((resolve) => {
    let link = document.getElementById('dynamicFont');
    if (!link) {
      link = document.createElement('link');
      link.id  = 'dynamicFont';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = font.url;

    // Poll until font is ready or timeout (1500ms)
    const testFont = `600 16px "${font.heading}"`;
    const deadline = Date.now() + 1500;

    const check = () => {
      if (document.fonts.check(testFont) || Date.now() >= deadline) {
        resolve(); // resolve regardless — fallback fonts will be used if needed
      } else {
        requestAnimationFrame(check);
      }
    };
    // Wait a tick for the link to register, then start checking
    requestAnimationFrame(check);
  });
}

/* ═══════════════════════════════════════════════
   MAIN GENERATOR (FIX #12: re-entry guard)
═══════════════════════════════════════════════ */
async function generateCarousel() {
  // FIX #12: prevent double-click race condition
  if (isGenerating) return;
  isGenerating = true;

  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  btn.textContent = 'Loading fonts...';
  setStatus('');

  const brand   = document.getElementById('brandName').value.trim() || 'Your Brand';
  const handle  = (document.getElementById('igHandle').value.trim() || '@yourhandle')
                    .replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 30)
                    .replace(/^/, '@'); // normalize a display handle
  const hex     = document.getElementById('colorHex').value.trim();
  const fontKey = document.getElementById('fontStyle').value;
  const tone    = document.getElementById('tone').value;
  const topic   = document.getElementById('topic').value.trim() || '5 tips to grow your brand on Instagram';

  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    setStatus('Enter a valid hex color (e.g. #6C5CE7)', 'error');
    btn.disabled = false;
    btn.textContent = 'Generate Carousel →';
    isGenerating = false;
    return;
  }

  // Load font and generate AI content in parallel
  const font = FONTS[fontKey];
  btn.textContent = '✦ Asking Claude Haiku...';

  const [, content] = await Promise.all([
    loadFont(font),
    generateSlideContent(topic, tone)
  ]);

  btn.textContent = 'Building slides...';
  const palette = derivePalette(hex);
  const slides  = content.slides;
  totalSlides   = slides.length;
  currentSlide  = 0;

  const slideHTMLs = slides.map((s, i) => buildSlide(s, i, totalSlides, palette, font, brand, handle));
  const dots       = slides.map((_, i) => `<div class="ig-ind${i === 0 ? ' active' : ''}"></div>`).join('');
  const slideWraps = slideHTMLs.map(h => `<div class="ig-slide-wrap">${h}</div>`).join('');

  document.getElementById('mainArea').innerHTML = `
    <div class="ig-frame" id="igFrame">
      <div class="ig-header">
        <div class="ig-avatar" style="background:${palette.primary}">${escapeHtml(brand.charAt(0).toUpperCase())}</div>
        <div class="ig-header-info">
          <div class="ig-handle">${escapeHtml(handle)}</div>
          <div class="ig-sub">${escapeHtml(brand)} · Carousel</div>
        </div>
        <div class="ig-dots-row">
          <div class="ig-dot"></div><div class="ig-dot"></div><div class="ig-dot"></div>
        </div>
      </div>

      <div class="ig-viewport" id="igViewport">
        <div class="ig-track" id="igTrack">${slideWraps}</div>
      </div>

      <div class="ig-indicators" id="igIndicators">${dots}</div>

      <div class="ig-actions">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        <svg class="bookmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </div>

      <div class="ig-caption">
        <div class="ig-caption-text">
          <strong>${escapeHtml(handle)}</strong> ${escapeHtml(topic.length > 80 ? topic.substring(0, 80) + '…' : topic)}
        </div>
        <div class="ig-time">2 HOURS AGO</div>
      </div>
    </div>

    <div class="slide-nav">
      <button data-action="prevSlide" title="Previous slide">‹</button>
      <span id="slideCounter">1 / ${totalSlides}</span>
      <button data-action="nextSlide" title="Next slide">›</button>
    </div>

    <div class="export-controls">
      <div class="export-label">Instagram</div>
      <button class="btn-export" data-action="exportCurrentSlide">⬇ Current Slide</button>
      <button class="btn-export-all" data-action="exportAllSlides">⬇ All ${totalSlides} Slides (PNG)</button>
      <hr class="export-divider">
      <div class="export-label">LinkedIn</div>
      <button class="btn-linkedin" id="linkedinBtn" data-action="exportLinkedInPDF">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        Export as PDF (LinkedIn Carousel)
      </button>
    </div>
  `;

  // FIX #1: measure actual rendered width AFTER DOM paint, then set slide widths
  requestAnimationFrame(() => {
    measureAndSetSlideWidths();
    goToSlide(0, false); // set initial position without animation
    setupDrag();

    btn.textContent = 'Generate Carousel →';
    btn.disabled = false;
    setStatus(content.sample ? `${totalSlides} sample slides shown. AI generation was unavailable.` : `✓ ${totalSlides} slides generated`, content.sample ? 'error' : 'success');
    isGenerating = false;
  });
}

/* ═══════════════════════════════════════════════
   EXPORT (FIX #25: sequential via promise chain)
═══════════════════════════════════════════════ */
function exportCurrentSlide() {
  const wrap = document.querySelectorAll('.ig-slide-wrap')[currentSlide];
  if (!wrap) return;
  setStatus('Exporting slide ' + (currentSlide + 1) + '...');
  html2canvas(wrap, { scale: 1080 / wrap.getBoundingClientRect().width, useCORS: true, allowTaint: false, backgroundColor: null })
    .then(canvas => {
      const a = document.createElement('a');
      a.download = `slide-${currentSlide + 1}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      setStatus(`✓ Slide ${currentSlide + 1} exported`, 'success');
    })
    .catch(() => setStatus('Export failed. Try again.', 'error'));
}

function exportAllSlides() {
  const wraps = [...document.querySelectorAll('.ig-slide-wrap')];
  if (!wraps.length) return;
  setStatus(`Exporting all ${wraps.length} slides...`);

  // FIX #25: chain promises so exports don't race
  wraps.reduce((chain, wrap, i) => {
    return chain.then(() =>
      html2canvas(wrap, { scale: 1080 / wrap.getBoundingClientRect().width, useCORS: true, allowTaint: false, backgroundColor: null })
        .then(canvas => {
          const a = document.createElement('a');
          a.download = `slide-${i + 1}.png`;
          a.href = canvas.toDataURL('image/png');
          a.click();
          setStatus(`Exporting... ${i + 1}/${wraps.length}`);
          return new Promise(r => setTimeout(r, 300));
        })
    );
  }, Promise.resolve())
  .then(() => setStatus(`✓ All ${wraps.length} slides exported`, 'success'))
  .catch(() => setStatus('Export failed on one or more slides.', 'error'));
}

/* ═══════════════════════════════════════════════
   LINKEDIN PDF EXPORT
   Captures each slide via html2canvas, then
   assembles them into a single PDF using jsPDF.
   Each slide = one PDF page (4:5 ratio).
═══════════════════════════════════════════════ */
async function exportLinkedInPDF() {
  const wraps = [...document.querySelectorAll('.ig-slide-wrap')];
  if (!wraps.length) return;

  const btn = document.getElementById('linkedinBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Building PDF...'; }
  setStatus(`Capturing ${wraps.length} slides for LinkedIn PDF...`);

  try {
    const { jsPDF } = window.jspdf;

    // Capture all slides as canvases first
    const canvases = [];
    for (let i = 0; i < wraps.length; i++) {
      setStatus(`Rendering slide ${i + 1} of ${wraps.length}...`);
      const canvas = await html2canvas(wraps[i], {
        scale: 1080 / wraps[i].getBoundingClientRect().width,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null
      });
      canvases.push(canvas);
    }

    // Use first slide dimensions to set PDF page size
    const firstCanvas = canvases[0];
    const pxW = firstCanvas.width;
    const pxH = firstCanvas.height;

    // Convert px to mm at 96dpi (jsPDF uses mm internally)
    const mmW = (pxW / 96) * 25.4;
    const mmH = (pxH / 96) * 25.4;

    const pdf = new jsPDF({
      orientation: mmW > mmH ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [mmW, mmH]
    });

    canvases.forEach((canvas, i) => {
      if (i > 0) pdf.addPage([mmW, mmH], mmW > mmH ? 'landscape' : 'portrait');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, mmW, mmH);
    });

    // Generate filename from brand name if available
    const brand = (document.getElementById('brandName').value.trim() || 'carousel')
      .toLowerCase().replace(/\s+/g, '-');
    pdf.save(`${brand}-linkedin-carousel.pdf`);

    setStatus(`✓ LinkedIn PDF exported (${wraps.length} pages)`, 'success');
  } catch (err) {
    console.error(err);
    setStatus('PDF export failed. Check console for details.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> Export as PDF (LinkedIn Carousel)`;
    }
  }
}

/* ── Keyboard navigation ── */
document.addEventListener('keydown', e => {
  if (!totalSlides) return;
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft')  prevSlide();
});

/* ── Handle window resize: re-measure slide widths ── */
window.addEventListener('resize', () => {
  if (!totalSlides) return;
  requestAnimationFrame(() => {
    measureAndSetSlideWidths();
    goToSlide(currentSlide, false);
  });
});

const actions = { randomColor, generateCarousel, prevSlide, nextSlide, exportCurrentSlide, exportAllSlides, exportLinkedInPDF };
document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button || button.disabled) return;
  if (button.dataset.action === 'example') return fillExample(Number(button.dataset.example));
  const action = actions[button.dataset.action];
  if (action) action();
});
document.getElementById('colorPicker').addEventListener('input', e => syncColor(e.target.value));
document.getElementById('colorHex').addEventListener('input', e => syncHex(e.target.value));
