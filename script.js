/* =====================================================================
   Kenneth Mancilla — Portfolio & Services
   script.js  |  Vanilla JavaScript only (no libraries)
   - Reusable navbar + footer injection
   - Mobile hamburger menu
   - Active navigation highlight
   - Scroll reveal animations (IntersectionObserver)
   - FAQ accordion
   - Contact + Payment forms (EmailJS)
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
   │  [1]  PUBLIC_KEY     → EmailJS Public Key                    │
   │  [2]  SERVICE_ID     → EmailJS Service ID (Gmail)            │
   │  [3]  TEMPLATE_ID    → EmailJS Template ID                   │
   │  [4]  paymongo link  → PayMongo Payment Link (Bank/GCash/Maya)│
   │  [5]  paypal.me      → your PayPal.me link                   │
   │  [6]  wise           → your Wise pay-me link (optional)      │
   │  [7]  facebook       → your Facebook profile link            │
   │  [8]  bank name + account name → see payment.html guide      │
   │       (only needed if you show bank details manually)        │
   │                                                              │
   │  EmailJS free signup : https://dashboard.emailjs.com         │
   │  PayMongo free signup: https://www.paymongo.com              │
   └──────────────────────────────────────────────────────────────┘
   ##################################################################### */
const SETTINGS = {

  /* [1][2][3] EMAILJS — sends the contact + payment emails (free).
     Create an account, connect Gmail, make ONE template, then paste
     the 3 IDs here. Template setup:
        To Email: {{to_email}}   Subject: {{subject}}
        Content:  {{message_body}}   Reply To: {{reply_to}}
        From Name: {{from_name}}                                     */
  EMAILJS: {
    PUBLIC_KEY:  '1aNZqnZEKBCQ_jvrV',  // [1] ✓ set
    SERVICE_ID:  'service_kensama',    // [2] ✓ set
    TEMPLATE_ID: 'template_KenSaMa'   // [3] ✓ set
  },

  /* [4][5][6] HOSTED CHECKOUT LINKS — where the client is sent to pay.
     These are SECURE pages run by the payment provider (not your site),
     so card/bank details are safe and money goes to your account.        */
  CHECKOUT: {
    paymongo: 'https://YOUR_PAYMONGO_LINK',   // [4] ← PayMongo link (Bank + GCash + Maya + Card)
    paypal:   'https://www.paypal.me/YOUR_USERNAME',  // [5] ← your PayPal.me
    wise:     'https://wise.com/pay/me/YOUR_HANDLE'   // [6] ← optional
  },

  /* [7] SOCIAL / CONTACT links */
  SOCIAL: {
    facebook: 'https://www.facebook.com/profile.php?id=61575598882519',  // [7] ✓ already set
    email:    'kensama1206@gmail.com'                                    // ✓ contact email
  }

};

/* Shorthand so the rest of the code reads cleanly */
const EMAILJS     = SETTINGS.EMAILJS;
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
    <span class="brand__mark">KSM</span>
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
        <span class="brand__mark">KSM</span>
        <span class="brand__text" style="color:#fff">KenSaMa<span>.</span></span>
      </a>
      <p>Freelance web designer &amp; multimedia artist crafting modern, responsive websites and bold visual identities that help businesses grow.</p>
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
        <li><a href="services.html">Multimedia &amp; Graphics</a></li>
        <li><a href="services.html">Branding</a></li>
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
   EMAILJS helpers — values come from the SETTINGS block at the top.
   One FLEXIBLE template handles all emails. Template setup:
        To Email: {{to_email}}   From Name: {{from_name}}
        Reply To: {{reply_to}}   Subject: {{subject}}
        Content:  {{message_body}}   (+ optional {{name}} and {{title}})
   --------------------------------------------------------------------- */
function emailjsConfigured() {
  return window.emailjs
    && EMAILJS.PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY'
    && EMAILJS.SERVICE_ID  !== 'YOUR_SERVICE_ID'
    && EMAILJS.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';
}

// Initialise EmailJS once (only on pages that load the SDK)
function initEmailJS() {
  if (window.emailjs && EMAILJS.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    try { emailjs.init({ publicKey: EMAILJS.PUBLIC_KEY }); } catch (e) { /* ignore */ }
  }
}

// Send one email through the single flexible template.
// `name` and `title` are optional — used by the client auto-reply template.
function sendEmail({ toEmail, subject, body, fromName, replyTo, name, title }) {
  return emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.TEMPLATE_ID, {
    to_email:     toEmail,
    subject:      subject,
    message_body: body,
    from_name:    fromName || '',
    reply_to:     replyTo || '',
    name:         name || '',
    title:        title || ''
  });
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

    // Make sure the email API is configured before trying to send
    if (!emailjsConfigured()) {
      alert('⚠️ The email API is not configured yet.\n\nThe owner needs to add their EmailJS keys in script.js (search for "YOUR_PUBLIC_KEY"). See the setup guide. Until then, please email me directly at ' + OWNER_EMAIL + '.');
      return;
    }

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    setSubmitting(true);
    const success = document.getElementById('formSuccess');
    try {
      // 1) Send the inquiry to the OWNER (you) — so you get the message
      await sendEmail({
        toEmail:   OWNER_EMAIL,
        subject:   '📨 New inquiry from ' + name,
        fromName:  name,
        replyTo:   email,
        body:      'You received a new project inquiry:\n\n'
                 + 'Name: ' + name + '\n'
                 + 'Email: ' + email + '\n\n'
                 + 'Message:\n' + message + '\n\n'
                 + '— Sent from your website contact form'
      });

      // NOTE: No auto-reply is sent. The contact form sends ONLY this single
      // inquiry to your inbox (kensama1206@gmail.com). You can reply to the
      // client directly afterwards — the message includes their email and the
      // reply_to is set to their address.

      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      setTimeout(() => { if (success) success.classList.remove('show'); }, 9000);
    } catch (err) {
      console.error('EmailJS error:', err);
      alert('Sorry, your message could not be sent right now (' + (err && err.text ? err.text : 'network error') + ').\n\nPlease email me directly at ' + OWNER_EMAIL + '.');
    } finally {
      setSubmitting(false);
    }
  });
}

/* ---------------------------------------------------------------------
   Payment page: method tabs, copy buttons, notification form
   --------------------------------------------------------------------- */
/* =====================================================================
   PAYMENT PAGE — EmailJS API integration
   ---------------------------------------------------------------------
   This sends an email DIRECTLY from JavaScript (no server needed).
   To activate it you must create a FREE EmailJS account and paste your
   3 keys below. Full step-by-step guide is in the chat after the code.
   ===================================================================== */
function setupPayment() {
  const form = document.getElementById('paymentForm');
  if (!form) return;

  /* Hosted-checkout links come from the SETTINGS block at the top of this file.
     PayMongo's single link handles Bank + GCash + Maya + Card. */
  const HOSTED_CHECKOUT = {
    bank:   SETTINGS.CHECKOUT.paymongo,
    gcash:  SETTINGS.CHECKOUT.paymongo,
    maya:   SETTINGS.CHECKOUT.paymongo,
    paypal: SETTINGS.CHECKOUT.paypal,
    wise:   SETTINGS.CHECKOUT.wise
  };

  // Friendly note shown under the method selector
  const PROVIDER_NOTE = {
    bank:   "You'll be redirected to PayMongo's secure page to pay by bank transfer, GCash, Maya, or card.",
    gcash:  "You'll be redirected to PayMongo's secure page to pay via GCash.",
    maya:   "You'll be redirected to PayMongo's secure page to pay via Maya.",
    paypal: "You'll be redirected to PayPal's secure checkout to complete your payment.",
    wise:   "You'll be redirected to Wise's secure page to complete your transfer."
  };

  /* EmailJS is initialised globally via initEmailJS(). */

  /* ---- A · Method tabs: track the chosen method + update the note ---- */
  const methodCards   = document.querySelectorAll('.method-card');
  const methodInput   = document.getElementById('p-method');
  const providerNote  = document.getElementById('providerNote');
  let chosenMethod    = 'bank';

  const setActiveMethod = (key) => {
    chosenMethod = key;
    methodCards.forEach((c) => c.classList.toggle('active', c.dataset.method === key));
    const card = [...methodCards].find((c) => c.dataset.method === key);
    if (methodInput && card && card.dataset.label) methodInput.value = card.dataset.label;
    if (providerNote && PROVIDER_NOTE[key]) providerNote.textContent = PROVIDER_NOTE[key];
  };
  methodCards.forEach((card) => card.addEventListener('click', () => setActiveMethod(card.dataset.method)));

  /* ---- B · Validation helpers ---- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const setGroupError = (input, message) => {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.add('invalid');
    const err = group.querySelector('.field-error');
    if (err && message) err.textContent = message;
  };
  const clearError = (input) => input.closest('.form-group')?.classList.remove('invalid');

  const nameEl    = document.getElementById('p-name');
  const emailEl   = document.getElementById('p-email');
  const purposeEl = document.getElementById('p-purpose');
  const amountEl  = document.getElementById('p-amount');
  const noteEl    = document.getElementById('p-note');

  [nameEl, emailEl, amountEl].forEach((el) => { if (el) el.addEventListener('input', () => clearError(el)); });
  if (purposeEl) purposeEl.addEventListener('change', () => clearError(purposeEl));

  const submitBtn = form.querySelector('button[type="submit"]');
  const setButton = (html, disabled) => {
    if (!submitBtn) return;
    submitBtn.innerHTML = html;
    submitBtn.disabled = !!disabled;
    submitBtn.style.opacity = disabled ? '.75' : '';
  };
  const RESTING_HTML = 'Continue to Secure Checkout <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---- C · Build the hosted checkout URL for the chosen method ---- */
  const buildCheckoutUrl = (method, amount) => {
    let url = HOSTED_CHECKOUT[method] || HOSTED_CHECKOUT.bank;
    if (url.indexOf('YOUR_') !== -1) return null;            // owner hasn't configured it yet
    // PayPal.me supports an amount suffix: paypal.me/username/500
    if (method === 'paypal' && amount && /paypal\.me\/[^/]+$/i.test(url)) {
      url = url.replace(/\/$/, '') + '/' + amount;
    }
    return url;
  };

  /* ---- D · Submit → notify (EmailJS) + redirect to hosted checkout ---- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    if (!nameEl.value.trim() || nameEl.value.trim().length < 2) { setGroupError(nameEl, 'Please enter your name.'); valid = false; }
    if (!emailRegex.test(emailEl.value.trim())) { setGroupError(emailEl, 'Please enter a valid email address.'); valid = false; }
    if (!purposeEl.value) { setGroupError(purposeEl, 'Please choose a payment purpose.'); valid = false; }
    const amt = parseFloat(amountEl.value);
    if (isNaN(amt) || amt <= 0) { setGroupError(amountEl, 'Please enter a valid amount.'); valid = false; }

    if (!valid) {
      form.querySelector('.form-group.invalid')?.querySelector('input,select,textarea')?.focus();
      return;
    }

    // Must have a hosted-checkout link configured for this method
    const checkoutUrl = buildCheckoutUrl(chosenMethod, amt);
    if (!checkoutUrl) {
      alert('⚠️ Online checkout for "' + (methodInput ? methodInput.value : chosenMethod) + '" is not set up yet.\n\nThe owner needs to add a hosted payment link in script.js (search for "YOUR_PAYMONGO_LINK"). Meanwhile, please email me at ' + OWNER_EMAIL + '.');
      return;
    }

    const amountStr = '₱' + amt.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const noteStr   = noteEl.value.trim() || '—';
    const success   = document.getElementById('paySuccess');
    const methodLabel = methodInput ? methodInput.value : chosenMethod;

    // 1) Send the instant notification email (so you know a payment is incoming)
    setButton('Redirecting…', true);
    if (success) { success.classList.add('show'); success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }

    // Best-effort notification email — don't let it block the checkout redirect
    try {
      if (emailjsConfigured()) {
        await sendEmail({
          toEmail:  OWNER_EMAIL,
          subject:  '💰 ' + purposeEl.value + ' — ' + methodLabel + ' checkout started (' + amountStr + ')',
          fromName: nameEl.value.trim(),
          replyTo:  emailEl.value.trim(),
          body:     'A client started a secure checkout:\n\n'
                 + 'Name: ' + nameEl.value.trim() + '\n'
                 + 'Email: ' + emailEl.value.trim() + '\n'
                 + 'Purpose: ' + purposeEl.value + '\n'
                 + 'Method: ' + methodLabel + '\n'
                 + 'Amount: ' + amountStr + '\n'
                 + 'Message: ' + noteStr + '\n\n'
                 + '— Sent from your website payment form'
        });
      } else {
        console.warn('EmailJS not configured — skipping notification email. Redirecting to checkout anyway.');
      }
    } catch (err) {
      console.error('EmailJS error (non-fatal):', err);
      // Don't block payment — still redirect to checkout
    }

    // 2) Redirect to the provider's secure hosted checkout
    setTimeout(() => { window.location.href = checkoutUrl; }, 700);
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
  console.log('%c KenSaMa — script v3 (EmailJS active) loaded ', 'background:#7A4F2C;color:#fff;padding:5px 9px;border-radius:5px;font-weight:bold;');

  buildShell();        // inject navbar + footer first
  initEmailJS();       // initialise the email API (safe on pages without the SDK)
  setupNavbar();       // wire up nav behaviour
  setupReveal();       // scroll animations
  setupFaq();          // FAQ accordion
  setupForm();         // contact form validation
  setupPayment();      // payment tabs, copy buttons, notification form
  setupSmoothScroll(); // anchor links
  setupBackToTop();    // back-to-top button
});
