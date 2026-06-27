/* =====================================================================
   Kenneth Mancilla — Portfolio & Services
   script.js  |  Vanilla JavaScript only (no libraries)
   - Reusable navbar + footer injection
   - Mobile hamburger menu
   - Active navigation highlight
   - Scroll reveal animations (IntersectionObserver)
   - FAQ accordion
   - Contact form validation
   - Smooth anchor scrolling + back-to-top
   ===================================================================== */

/* ---------------------------------------------------------------------
   Reusable NAVBAR markup
   --------------------------------------------------------------------- */
const NAV_HTML = `
<nav class="nav container" aria-label="Primary">
  <a href="index.html" class="brand" aria-label="Kenneth Mancilla — home">
    <span class="brand__mark">KM</span>
    <span class="brand__text">Kenneth<span>.</span></span>
  </a>

  <ul class="nav__links" id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="services.html">Services</a></li>
    <li><a href="blog.html">Blog</a></li>
    <li><a href="faq.html">FAQ</a></li>
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
        <span class="brand__mark">KM</span>
        <span class="brand__text" style="color:#fff">Kenneth<span>.</span></span>
      </a>
      <p>Freelance web designer &amp; multimedia artist crafting modern, responsive websites and bold visual identities that help businesses grow.</p>
      <div class="footer__social">
        <a href="mailto:mancillakennethwork@gmail.com">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
          Email
        </a>
        <a href="https://www.facebook.com/profile.php?id=61575598882519" target="_blank" rel="noopener noreferrer">
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
      </ul>
    </div>

    <div class="footer__col">
      <h4>Services</h4>
      <ul>
        <li><a href="services.html">Website Design &amp; Dev</a></li>
        <li><a href="services.html">Multimedia &amp; Graphics</a></li>
        <li><a href="services.html">Branding</a></li>
        <li><a href="contact.html">Get a Quote</a></li>
      </ul>
    </div>

    <div class="footer__col">
      <h4>Get in touch</h4>
      <ul>
        <li><a href="mailto:mancillakennethwork@gmail.com">mancillakennethwork@gmail.com</a></li>
        <li>Facebook: Ken Ken</li>
        <li>Available for freelance projects</li>
      </ul>
    </div>
  </div>
  <div class="footer__bottom container">
    <p>&copy; <span id="year"></span> Kenneth Mancilla. All rights reserved.</p>
    <p>Designed &amp; developed with care.</p>
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

  form.addEventListener('submit', (e) => {
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

    // Simulate successful submission (no backend)
    const success = document.getElementById('formSuccess');
    if (success) {
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.reset();

    // Hide success after a while
    setTimeout(() => { if (success) success.classList.remove('show'); }, 8000);
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
  buildShell();        // inject navbar + footer first
  setupNavbar();       // wire up nav behaviour
  setupReveal();       // scroll animations
  setupFaq();          // FAQ accordion
  setupForm();         // contact form validation
  setupSmoothScroll(); // anchor links
  setupBackToTop();    // back-to-top button
});
