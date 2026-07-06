document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initBuyForm();
  initFAQ();
  initScrollAnimations();
});

function initHeader() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { nav.classList.remove('open'); document.body.style.overflow = ''; });
  });
}

function initBuyForm() {
  const form = document.getElementById('buyForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('buyBtn');
    const orig = btn.textContent;
    btn.textContent = 'Redirection vers le paiement...';
    btn.disabled = true;
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    if (!email) { showNotif('Veuillez entrer votre email'); btn.textContent = orig; btn.disabled = false; return; }
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const result = await res.json();
      if (result.error) { showNotif(result.error); btn.textContent = orig; btn.disabled = false; return; }
      if (result.url) window.location.href = result.url;
    } catch (err) {
      showNotif('Erreur de connexion. Reessayez.');
      btn.textContent = orig;
      btn.disabled = false;
    }
  });
}

function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

function showNotif(msg) {
  const n = document.getElementById('notification');
  if (!n) return;
  n.querySelector('.notification-text span').textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3000);
}

function initScrollAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
