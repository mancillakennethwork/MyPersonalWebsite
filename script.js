/* =====================================================================
   KenSaMa — Portfolio & Services
   script.js  |  Vanilla JavaScript only (no libraries)
   - Reusable navbar + footer injection
   - Mobile hamburger menu
   - Active navigation highlight
   - Scroll reveal animations (IntersectionObserver)
   - FAQ accordion
   - Contact + Payment forms (FormSubmit — free & unlimited)
   - Smooth anchor scrolling + back-to-top
   ===================================================================== */


/* #####################################################################
   #####################################################################
        ⚡  OWNER SETTINGS  —  EDIT EVERYTHING YOU NEED HERE  ⚡
   #####################################################################
   This is the ONLY place you need to touch. Fill in the values between
   the quotes (" ") and the links. After editing, save and redeploy.

   ┌──────────────────────────────────────────────────────────────┐
   │  REPLACE LIST (search these words to jump to each one):      │
   │                                                              │
   │  [1]  contact email  → kensama1206@gmail.com (already set)   │
   │  [2]  paymongo link  → STATIC FALLBACK only (already set).   │
   │       Real checkout now uses the PayMongo API + Upstash DB + │
   │       webhook (deposit → balance flow). Set in Vercel:       │
   │         PAYMONGO_SECRET_KEY        (sk_live_...)             │
   │         PAYMONGO_WEBHOOK_SECRET                                │
   │         UPSTASH_REDIS_REST_URL     (https://xx.upstash.io)   │
   │         UPSTASH_REDIS_REST_TOKEN   (xxxxxxxxxxxx)            │
   │         ADMIN_TOKEN                (any secret you choose)   │
   │         OWNER_EMAIL                (kensama1206@gmail.com)   │
   │         SITE_URL                   (https://kensama.com)     │
   │       EMAILS reuse FormSubmit (already active — no new keys).│
   │  [3]  facebook       → your Facebook profile link            │
   │                                                              │
   │  See the full setup guide in the chat (deposit+balance flow).│
   │  The FIRST submission triggers a one-time activation email   │
   │  to [1] — open it and click "Activate Form". Done forever.   │
   │  FormSubmit ONLY works on a LIVE site (http/https), not a    │
   │  local file:// — test via VS Code Live Server or after deploy.│
   │                                                              │
   │  PayMongo free signup: https://www.paymongo.com              │
   └──────────────────────────────────────────────────────────────┘
   ##################################################################### */
const SETTINGS = {

  /* [1] CONTACT EMAIL — where contact + payment notifications arrive.
     Using FormSubmit (free, unlimited, no signup/account needed). */
  SOCIAL: {
    email:    'kensama1206@gmail.com',                                       // [1] ✓
    facebook: 'https://www.facebook.com/profile.php?id=61575598882519'       // [5] ✓
  },

   /* PAYMONGO PAYMENT PAGES — one hosted page per fixed amount.
      These work instantly with NO API keys / database needed. */
   CHECKOUT: {
    /* The ₱5,000 upfront deposit (also Tier 1 full price). */
    upfront:   'https://paymongo.page/l/upfront',
    /* Full-price pages for each tier: */
    tier1:     'https://paymongo.page/l/starterpage',       // ₱5,000
    tier2:     'https://paymongo.page/l/basicpage',         // ₱20,000
    tier3:     'https://paymongo.page/l/professionalpage',  // ₱40,000
    /* Generic fallback (used for Website Update ₱2,000 if the API isn't set). */
    paymongo:  'https://pm.link/org-kAJmabWoKVdUY8YVRxWyYDXp/E6uPWjx'
  }

};

/* Shorthand so the rest of the code reads cleanly */
const OWNER_EMAIL = SETTINGS.SOCIAL.email;

/* #####################################################################
        ⚡  END OF OWNER SETTINGS  —  code below, no need to edit  ⚡
   ##################################################################### */


/* ---------------------------------------------------------------------
   Reusable NAVBAR markup
   --------------------------------------------------------------------- */
const NAV_HTML = `
<nav class="nav container" aria-label="Primary">
  <a href="index.html" class="brand" aria-label="KenSaMa — home">
    <img class="brand__mark" src="Logo/kensama-logo.svg" alt="KenSaMa logo" width="44" height="44" />
    <span class="brand__text">KenSaMa<span>.</span></span>
  </a>

  <ul class="nav__links" id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="services.html">Services</a></li>
    <li><a href="blog.html">Blog</a></li>
    <li><a href="faq.html">FAQ</a></li>
    <li><a href="payment.html">Payments</a></li>
    <li><a href="contact.html">Contact</a></li>
    <li class="mobile-cta"><a href="contact.html" class="btn btn-primary btn-block">Get a Quote</a></li>
  </ul>

  <div class="nav__right">
    <a href="contact.html" class="btn btn-primary nav__cta">Get a Quote</a>
    <button class="nav__toggle" id="navToggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navLinks">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;

/* ---------------------------------------------------------------------
   Reusable FOOTER markup
   --------------------------------------------------------------------- */
const FOOTER_HTML = `
<div class="footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      <a href="index.html" class="brand">
        <img class="brand__mark" src="Logo/kensama-logo.svg" alt="KenSaMa logo" width="44" height="44" />
        <span class="brand__text" style="color:#fff">KenSaMa<span>.</span></span>
      </a>
      <p>Freelance web designer &amp; developer crafting modern, responsive websites that help businesses grow.</p>
      <div class="footer__social">
        <a href="mailto:${SETTINGS.SOCIAL.email}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
          Email
        </a>
        <a href="${SETTINGS.SOCIAL.facebook}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>
          Facebook
        </a>
      </div>
    </div>

    <div class="footer__col">
      <h4>Pages</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="faq.html">FAQ</a></li>
        <li><a href="payment.html">Payments</a></li>
      </ul>
    </div>

    <div class="footer__col">
      <h4>Services</h4>
      <ul>
        <li><a href="services.html">Website Design &amp; Dev</a></li>
        <li><a href="services.html">Website Updates</a></li>
        <li><a href="services.html">Pricing Tiers</a></li>
      </ul>
    </div>

    <div class="footer__col">
      <h4>Get in touch</h4>
      <ul>
        <li><a href="mailto:${SETTINGS.SOCIAL.email}">${SETTINGS.SOCIAL.email}</a></li>
        <li>Facebook: Ken Ken</li>
        <li>Available for freelance projects</li>
      </ul>
    </div>
  </div>
  <div class="footer__bottom container">
    <p>&copy; <span id="year"></span> KenSaMa. All rights reserved.</p>
    <p>Designed &amp; developed with care by KenSaMa.</p>
  </div>
</div>

<button class="to-top" id="toTop" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
</button>`;

/* ---------------------------------------------------------------------
   Inject navbar + footer into the page shell
   --------------------------------------------------------------------- */
function buildShell() {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  if (header) header.innerHTML = NAV_HTML;
  if (footer) footer.innerHTML = FOOTER_HTML;

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------
   Navbar behaviour: active highlight, mobile toggle, scroll shadow
   --------------------------------------------------------------------- */
function setupNavbar() {
  // Determine current page file name (fallback to index.html on root)
  let page = window.location.pathname.split('/').pop();
  if (!page || page === '') page = 'index.html';

  document.querySelectorAll('.nav__links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === page) link.classList.add('active');
  });

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove('open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    // Close menu when any link is clicked
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    // Close on Escape
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  // Sticky header shadow on scroll
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

/* ---------------------------------------------------------------------
   Scroll reveal animations
   --------------------------------------------------------------------- */
function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('in'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  els.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------
   FAQ accordion
   --------------------------------------------------------------------- */
function setupFaq() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector('.faq__q');
    const panel = item.querySelector('.faq__a');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all (one open at a time)
      items.forEach((other) => {
        other.classList.remove('open');
        const p = other.querySelector('.faq__a');
        const b = other.querySelector('.faq__q');
        if (p) p.style.maxHeight = null;
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      // Open the clicked one if it was closed
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---------------------------------------------------------------------
   FormSubmit helper — sends emails for the WHOLE site.
   FormSubmit is FREE + UNLIMITED and needs NO signup/account.
   The recipient email is SETTINGS.SOCIAL.email (kensama1206@gmail.com).

   ⚠️ FIRST-TIME ACTIVATION:
      The very first submission triggers a one-time activation email to
      kensama1206@gmail.com. Open it and click "Activate Form". After that,
      every submission is delivered. (Happens once per recipient email.)

   ⚠️ FormSubmit only works on a LIVE site (http/https). It will refuse
      to send when the page is opened as a local file:// (file browsed).
   --------------------------------------------------------------------- */
function submitFormSubmit({ toEmail, subject, fields }) {
  const endpoint = 'https://formsubmit.co/ajax/' + encodeURIComponent(toEmail);
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: subject,   // email subject line
      _template: 'table',  // render fields as a neat table
      ...fields
    })
  }).then((res) => res.json().catch(() => ({})).then((data) => {
    // FormSubmit returns success:"true" (string) once activated.
    const msg = (typeof data.message === 'string' ? data.message : '').toLowerCase();
    const ok = res.ok && (data.success === 'true' || data.success === true);
    if (!ok) {
      if (msg.includes('html files') || msg.includes('web server')) {
        throw new Error('HOSTED_ONLY');   // opened as a local file
      }
      if (msg.includes('activat') || msg.includes('confirm')) {
        throw new Error('NEEDS_ACTIVATION'); // first-time activation required
      }
      throw new Error(data.message || 'Submission failed');
    }
    return true;
  }));
}

/* ---------------------------------------------------------------------
   Contact form validation
   --------------------------------------------------------------------- */
function setupForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setError = (group, message) => {
    group.classList.add('invalid');
    const err = group.querySelector('.field-error');
    if (err && message) err.textContent = message;
  };
  const clearError = (group) => group.classList.remove('invalid');

  const fields = [
    { id: 'name', validate: (v) => v.trim().length >= 2 || 'Please enter your name (2+ characters).' },
    { id: 'email', validate: (v) => (emailRegex.test(v.trim()) || 'Please enter a valid email address.') },
    { id: 'message', validate: (v) => v.trim().length >= 10 || 'Tell me a bit more (10+ characters).' }
  ];

  // Live clear on input
  fields.forEach(({ id }) => {
    const input = document.getElementById(id);
    if (input) input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) clearError(group);
    });
  });

  const submitBtn = form.querySelector('button[type="submit"]');
  const setSubmitting = (state) => {
    if (!submitBtn) return;
    if (state) {
      submitBtn.dataset.resting = submitBtn.innerHTML;   // remember original label
      submitBtn.disabled = true;
      submitBtn.style.opacity = '.75';
      submitBtn.innerHTML = 'Sending…';
    } else {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      if (submitBtn.dataset.resting) submitBtn.innerHTML = submitBtn.dataset.resting;
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    let firstInvalid = null;

    fields.forEach(({ id, validate }) => {
      const input = document.getElementById(id);
      if (!input) return;
      const group = input.closest('.form-group');
      const result = validate(input.value);
      if (result !== true) {
        if (group) setError(group, result);
        valid = false;
        if (!firstInvalid) firstInvalid = input;
      } else if (group) {
        clearError(group);
      }
    });

    if (!valid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    setSubmitting(true);
    const success = document.getElementById('formSuccess');
    try {
      // Send ONLY the inquiry to your inbox (kensama1206@gmail.com) — no auto-reply.
      await submitFormSubmit({
        toEmail:  OWNER_EMAIL,
        subject:  '📨 New inquiry from ' + name,
        fields:   { name: name, email: email, message: message }
      });

      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      setTimeout(() => { if (success) success.classList.remove('show'); }, 9000);
    } catch (err) {
      // Surface the REAL reason so this is never a mystery.
      let text = 'Sorry, your message could not be sent right now. Please email me directly at ' + OWNER_EMAIL + '.';
      if (err.message === 'HOSTED_ONLY') {
        text = '⚠️ This form only works when the site is hosted live (e.g. Vercel, Netlify) — it cannot send email when opened as a local file (file://). Publish the site online, then it will deliver to ' + OWNER_EMAIL + '.';
      } else if (err.message === 'NEEDS_ACTIVATION') {
        text = '✅ Almost there! FormSubmit sent a one-time activation email to ' + OWNER_EMAIL + '.\n\nOpen it and click "Activate Form", then submit again (check your Spam folder too). This only happens once.';
      }
      alert(text);
    } finally {
      setSubmitting(false);
    }
  });
}

/* ---------------------------------------------------------------------
   Payment page — stepped checkout wizard
   ---------------------------------------------------------------------
   Flow:  details  →  method  →  purpose (+tier)  →  review  →  pay
     • Website Development  → ₱5,000 upfront deposit, balance due after
       finalization (based on the chosen tier's full price).
     • Website Update       → ₱2,000 flat.
   On submit: notify owner (FormSubmit) then redirect to PayMongo.
   --------------------------------------------------------------------- */
function setupPayment() {
  const form = document.getElementById('paymentForm');
  if (!form) return;

  /* ---- Pricing model ---- */
  const TIERS = {
    1: { name: 'Starter',      full: 5000 },
    2: { name: 'Basic',        full: 20000 },
    3: { name: 'Professional', full: 40000 }
  };
  const DEPOSIT     = 5000;   // upfront cost charged for Website Development
  const UPDATE_PRICE = 2000;  // flat cost charged for Website Updates
  const peso = (n) => '₱' + Number(n).toLocaleString('en-PH');

  /* ---- Wizard state ---- */
  let currentStep = 1;
  const state = { method: 'qrph', methodLabel: 'QR Ph', purpose: '', tier: 0 };

  const panels   = document.querySelectorAll('.pay-step-panel');
  const progFill = document.getElementById('progFill');
  const progSteps = document.querySelectorAll('.pay-progress__steps .pay-step');

  /* Show a given step and update the progress bar */
  const goToStep = (n) => {
    currentStep = n;
    panels.forEach((p) => p.classList.toggle('active', Number(p.dataset.step) === n));
    if (progFill) progFill.style.width = (n / 4 * 100) + '%';
    progSteps.forEach((s) => s.classList.toggle('active', Number(s.dataset.prog) <= n));
    const card = document.querySelector('.pay-form');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ---- Validation helpers ---- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const setGroupError = (input, message) => {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.add('invalid');
    const err = group.querySelector('.field-error');
    if (err && message) err.textContent = message;
  };
  const clearError = (input) => input.closest('.form-group')?.classList.remove('invalid');

  const nameEl  = document.getElementById('p-name');
  const emailEl = document.getElementById('p-email');
  if (nameEl)  nameEl.addEventListener('input', () => clearError(nameEl));
  if (emailEl) emailEl.addEventListener('input', () => clearError(emailEl));

  const validateStep = (n) => {
    if (n === 1) {
      let ok = true;
      if (!nameEl.value.trim() || nameEl.value.trim().length < 2) { setGroupError(nameEl, 'Please enter your name.'); ok = false; }
      if (!emailRegex.test(emailEl.value.trim())) { setGroupError(emailEl, 'Please enter a valid email address.'); ok = false; }
      return ok;
    }
    if (n === 2) return !!state.method;                       // always set (defaults to QR Ph)
    if (n === 3) {
      if (!state.purpose) { alert('Please choose what you are paying for.'); return false; }
      if (state.purpose === 'dev' && !state.tier) {
        const tierError = document.getElementById('tierError');
        if (tierError) tierError.style.display = 'block';
        document.getElementById('tierBlock')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      return true;
    }
    return true;
  };

  /* ---- Selection: payment method ---- */
  const methodCards = document.querySelectorAll('#methodGroup .method-card');
  methodCards.forEach((card) => card.addEventListener('click', () => {
    state.method = card.dataset.method;
    state.methodLabel = card.dataset.label;
    methodCards.forEach((c) => c.classList.remove('active'));
    card.classList.add('active');
  }));

  /* ---- Selection: purpose (with conditional tier block) ---- */
  const purposeCards = document.querySelectorAll('#purposeGroup .method-card');
  const tierBlock = document.getElementById('tierBlock');
  purposeCards.forEach((card) => card.addEventListener('click', () => {
    purposeCards.forEach((c) => c.classList.remove('active'));
    card.classList.add('active');
    state.purpose = card.dataset.purpose;
    state.tier = 0;                                          // reset tier on purpose change
    document.querySelectorAll('#tierGroup .tier-pick').forEach((t) => t.classList.remove('active'));
    if (state.purpose === 'dev') {
      if (tierBlock) tierBlock.hidden = false;              // show tier chooser
    } else {
      if (tierBlock) tierBlock.hidden = true;               // updates don't need a tier
    }
  }));

  /* ---- Selection: tier ---- */
  const tierCards = document.querySelectorAll('#tierGroup .tier-pick');
  tierCards.forEach((card) => card.addEventListener('click', () => {
    state.tier = Number(card.dataset.tier);
    tierCards.forEach((t) => t.classList.remove('active'));
    card.classList.add('active');
    const tierError = document.getElementById('tierError');
    if (tierError) tierError.style.display = 'none';
  }));

  /* ---- Build the review summary + compute amounts ---- */
  const updateSummary = () => {
    document.getElementById('sum-method').textContent  = state.methodLabel;
    document.getElementById('sum-purpose').textContent = state.purpose === 'dev' ? 'Website Development' : state.purpose === 'update' ? 'Website Update' : '—';

    const tierRow  = document.getElementById('sum-tier-row');
    const fullRow  = document.getElementById('sum-full-row');
    const balRow   = document.getElementById('sum-bal-row');
    const payBtn   = document.getElementById('payNowBtn');
    let dueNow = 0, balance = 0;

    if (state.purpose === 'dev' && state.tier) {
      const t = TIERS[state.tier];
      tierRow.hidden = false;
      document.getElementById('sum-tier').textContent = 'Tier ' + state.tier + ' — ' + t.name;
      fullRow.hidden = false;
      document.getElementById('sum-full').textContent = peso(t.full);
      dueNow = DEPOSIT;
      balance = Math.max(0, t.full - DEPOSIT);
      balRow.hidden = false;
      document.getElementById('sum-bal').textContent = peso(balance) + ' (due after finalization)';
    } else {
      tierRow.hidden = true;
      fullRow.hidden = true;
      balRow.hidden = true;
      dueNow = UPDATE_PRICE;
    }
    document.getElementById('sum-now').textContent = peso(dueNow);
    state.amountNow = dueNow;                                // remember for the email
    if (payBtn) payBtn.textContent = 'Pay ' + peso(dueNow) + ' Now →';
    return dueNow;
  };

  /* ---- Back / Next buttons ---- */
  form.querySelectorAll('[data-next]').forEach((btn) => btn.addEventListener('click', () => {
    const from = Number(btn.dataset.next);
    if (!validateStep(from)) return;
    if (from === 3) updateSummary();                         // refresh review before showing it
    goToStep(from + 1);
  }));
  form.querySelectorAll('[data-prev]').forEach((btn) => btn.addEventListener('click', () => {
    goToStep(Number(btn.dataset.prev) - 1);
  }));

  /* ---- Submit → notify owner (FormSubmit) + redirect to PayMongo ---- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(3)) { goToStep(3); return; }
    const dueNow = updateSummary();

    const name  = nameEl.value.trim();
    const email = emailEl.value.trim();
    const purposeLabel = state.purpose === 'dev' ? 'Website Development' : 'Website Update';
    const tierLabel = (state.purpose === 'dev' && state.tier)
      ? 'Tier ' + state.tier + ' — ' + TIERS[state.tier].name + ' (' + peso(TIERS[state.tier].full) + ')'
      : '—';
    const description = purposeLabel + (tierLabel !== '—' ? ' — ' + tierLabel : '');

    const success = document.getElementById('paySuccess');
    const payBtn = document.getElementById('payNowBtn');
    if (payBtn) { payBtn.disabled = true; payBtn.style.opacity = '.75'; payBtn.textContent = 'Redirecting…'; }
    if (success) { success.classList.add('show'); success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }

    let redirectUrl = null;
    let apiError = null;
    try {
      // Create a PayMongo Checkout Session with the EXACT amount + client metadata.
      // The metadata flows to /api/paymongo-webhook after payment succeeds.
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose:    state.purpose,       // "dev" | "update"
          tier:       state.tier,          // 1-4 (for dev) — server computes the deposit + total
          clientName: name,
          clientEmail: email,
          method: state.methodLabel
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.checkoutUrl) {
        redirectUrl = data.checkoutUrl;
      } else {
        console.warn('create-checkout did not return a URL:', data);
        apiError = data.error || data.detail || 'Checkout could not be created.';
      }
    } catch (err) {
      console.warn('create-checkout request failed (non-fatal):', err.message);
      apiError = err.message;
    }

    // Fallback: if the API isn't configured, use the dedicated PayMongo page
    // for this payment (deposit → upfront page; update → generic link).
    if (!redirectUrl) {
      const pages = SETTINGS.CHECKOUT || {};
      redirectUrl = state.purpose === 'dev' ? (pages.upfront || pages.paymongo) : pages.paymongo;
      if (!redirectUrl || redirectUrl.indexOf('YOUR_') !== -1) {
        if (payBtn) { payBtn.disabled = false; payBtn.style.opacity = ''; payBtn.textContent = 'Pay ' + peso(dueNow) + ' Now →'; }
        alert('⚠️ Online checkout is not set up yet.\n\n' + (apiError ? 'Server: ' + apiError + '\n\n' : '') + 'Add your PayMongo links in script.js (see the setup guide). Meanwhile, email me at ' + OWNER_EMAIL + '.');
        return;
      }
    }

    // Open the PayMongo secure hosted checkout in a NEW TAB
    // (keeps your website open so the client can return easily)
    setTimeout(() => {
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
      // Update the message + button so the client knows what happened and can reopen the tab
      const msg = document.getElementById('successMsg');
      if (msg) msg.textContent = 'Secure checkout opened in a new tab. Complete your payment there. (If it didn\'t open, tap the button below.)';
      if (payBtn) {
        payBtn.disabled = false;
        payBtn.style.opacity = '';
        payBtn.textContent = 'Re-open checkout';
        payBtn.onclick = () => window.open(redirectUrl, '_blank', 'noopener,noreferrer');
      }
    }, 700);
  });
}

/* ---------------------------------------------------------------------
   Smooth scroll for in-page anchors + back to top
   --------------------------------------------------------------------- */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function setupBackToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('show', window.scrollY > 500);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------------------------------------------------------------------
   Initialise everything once the DOM is ready
   --------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Version marker — visible in the browser console (F12 → Console).
  // If you don't see this on the LIVE site, the deployed code is out of date.
  console.log('%c KenSaMa — script v6 (deposit + balance flow active) loaded ', 'background:#7A4F2C;color:#fff;padding:5px 9px;border-radius:5px;font-weight:bold;');

  buildShell();        // inject navbar + footer first
  setupNavbar();       // wire up nav behaviour
  setupReveal();       // scroll animations
  setupFaq();          // FAQ accordion
  setupForm();         // contact form validation
  setupPayment();      // payment tabs, copy buttons, notification form
  setupSmoothScroll(); // anchor links
  setupBackToTop();    // back-to-top button
});
