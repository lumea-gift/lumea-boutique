// ==================== LUMEA E-COMMERCE APP ====================

const PRODUCTS = [
  {
    id: 1,
    name: "Sérum Éclat",
    category: "Soin Visage",
    price: 49,
    oldPrice: 65,
    badge: "Best-seller",
    image: "images/serum.png",
    description: "Notre sérum signature à la vitamine C pure et à l'acide hyaluronique. Illumine le teint, réduit les taches et booste l'éclat naturel de votre peau en seulement 2 semaines.",
    features: [
      "Vitamine C stabilisée à 15%",
      "Acide hyaluronique triple poids moléculaire",
      "Résultats visibles en 14 jours",
      "Convient à tous les types de peau",
      "Sans paraben, sans sulfate"
    ]
  },
  {
    id: 2,
    name: "Crème Hydra-Luxe",
    category: "Hydratation",
    price: 59,
    oldPrice: null,
    badge: null,
    image: "images/creme.png",
    description: "Crème hydratante luxueuse à l'acide hyaluronique et au beurre de karité bio. Une hydratation intense qui dure 72 heures pour une peau repulpée et soyeuse.",
    features: [
      "Hydratation 72h prouvée cliniquement",
      "Beurre de karité bio & squalane",
      "Texture fondante non grasse",
      "Barrière cutanée renforcée",
      "Formule vegan & cruelty-free"
    ]
  },
  {
    id: 3,
    name: "Nettoyant Pur",
    category: "Nettoyage",
    price: 35,
    oldPrice: 45,
    badge: "Nouveau",
    image: "images/nettoyant.png",
    description: "Gel nettoyant doux qui élimine impuretés et maquillage sans agresser la peau. Enrichi en extrait de thé vert antioxydant et en aloe vera apaisant.",
    features: [
      "Nettoyage profond & doux",
      "Extrait de thé vert antioxydant",
      "Aloe vera bio apaisant",
      "pH équilibré pour la peau",
      "Idéal matin et soir"
    ]
  }
];

const TAX_RATE = 0.14975; // QC: TPS 5% + TVQ 9.975%

// State
let cart = [];
let currentModalQty = 1;

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCart();
  initProducts();
  initScrollAnimations();
  initNewsletter();
  initMobileMenu();
  initSocialProof();
});

// ==================== HEADER ====================
function initHeader() {
  const header = document.querySelector('.header');
  const banner = document.getElementById('promoBanner');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      if (banner) banner.style.transform = 'translateY(-100%)';
    } else {
      header.classList.remove('scrolled');
      if (banner) banner.style.transform = 'translateY(0)';
    }
  });
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ==================== PRODUCTS ====================
function initProducts() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = parseInt(btn.dataset.id);
      addToCart(productId);
    });
  });

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = parseInt(btn.dataset.id);
      openProductModal(productId);
    });
  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const productId = parseInt(card.dataset.id);
      openProductModal(productId);
    });
  });
}

// ==================== PRODUCT MODAL ====================
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentModalQty = 1;
  const modal = document.getElementById('productModal');

  modal.querySelector('.modal-image img').src = product.image;
  modal.querySelector('.modal-image img').alt = product.name;
  modal.querySelector('.product-category').textContent = product.category;
  modal.querySelector('.product-name').textContent = product.name;

  let priceHTML = `${product.price} $`;
  if (product.oldPrice) {
    priceHTML += `<span class="old-price">${product.oldPrice} $</span>`;
  }
  modal.querySelector('.product-price').innerHTML = priceHTML;
  modal.querySelector('.modal-description').textContent = product.description;

  const featuresList = modal.querySelector('.modal-features');
  featuresList.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');

  modal.querySelector('.modal-qty-value').textContent = '1';
  modal.querySelector('.modal-add-btn').dataset.id = product.id;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // TikTok Pixel: View Content
  if (window.ttq) ttq.track('ViewContent', {
    content_id: product.id,
    content_name: product.name,
    content_type: 'product',
    price: product.price,
    currency: 'CAD'
  });

  modal.querySelector('.modal-close').onclick = () => closeProductModal();
  modal.onclick = (e) => { if (e.target === modal) closeProductModal(); };

  modal.querySelector('.modal-qty-minus').onclick = () => {
    if (currentModalQty > 1) {
      currentModalQty--;
      modal.querySelector('.modal-qty-value').textContent = currentModalQty;
    }
  };

  modal.querySelector('.modal-qty-plus').onclick = () => {
    if (currentModalQty < 10) {
      currentModalQty++;
      modal.querySelector('.modal-qty-value').textContent = currentModalQty;
    }
  };

  modal.querySelector('.modal-add-btn').onclick = () => {
    addToCart(product.id, currentModalQty);
    closeProductModal();
  };
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ==================== CART ====================
function initCart() {
  const saved = localStorage.getItem('lumea_cart');
  if (saved) {
    try { cart = JSON.parse(saved); } catch(e) { cart = []; }
  }

  updateCartUI();

  document.querySelector('.cart-btn').addEventListener('click', () => toggleCart(true));
  document.querySelector('.cart-overlay').addEventListener('click', () => toggleCart(false));
  document.querySelector('.cart-close').addEventListener('click', () => toggleCart(false));

  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      toggleCart(false);
      openCheckout();
    });
  }

  const continueBtn = document.querySelector('.continue-shopping-btn');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => toggleCart(false));
  }
}

function toggleCart(open) {
  const sidebar = document.querySelector('.cart-sidebar');
  const overlay = document.querySelector('.cart-overlay');

  if (open) {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 10);
  } else {
    cart.push({ id: productId, qty: qty });
  }

  saveCart();
  updateCartUI();
  showNotification(`${product.name} ajouté au panier`);

  // TikTok Pixel: Add to Cart
  if (window.ttq) ttq.track('AddToCart', {
    content_id: product.id,
    content_name: product.name,
    content_type: 'product',
    price: product.price,
    quantity: qty,
    currency: 'CAD'
  });
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  if (item.qty > 10) item.qty = 10;

  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('lumea_cart', JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartCount() {
  return cart.reduce((count, item) => count + item.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();

  const badge = document.querySelector('.cart-count');
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);

  const cartItems = document.querySelector('.cart-items');
  const cartEmpty = document.querySelector('.cart-empty');
  const cartFooter = document.querySelector('.cart-footer');

  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartFooter.style.display = 'none';
    cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());
  } else {
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';

    cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());

    cart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return;

      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">${product.price} $</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateQty(${product.id}, -1)">−</button>
            <span class="cart-item-qty">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${product.id}, 1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart(${product.id})">×</button>
          </div>
        </div>
      `;
      cartItems.appendChild(el);
    });

    const shipping = total >= 75 ? 0 : 9.95;
    document.querySelector('.subtotal-value').textContent = `${total.toFixed(2)} $`;
    document.querySelector('.shipping-value').textContent = shipping === 0 ? 'Gratuit' : `${shipping.toFixed(2)} $`;
    document.querySelector('.total-value').textContent = `${(total + shipping).toFixed(2)} $`;
  }
}

// ==================== CHECKOUT ====================
function openCheckout() {
  const modal = document.getElementById('checkoutModal');
  const total = getCartTotal();
  const shipping = total >= 75 ? 0 : 9.95;
  const tax = parseFloat((total * TAX_RATE).toFixed(2));
  const grandTotal = parseFloat((total + shipping + tax).toFixed(2));

  const summaryContainer = modal.querySelector('.checkout-items-summary');
  summaryContainer.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return `<div class="checkout-summary-row">
      <span>${product.name} × ${item.qty}</span>
      <span>${(product.price * item.qty).toFixed(2)} $</span>
    </div>`;
  }).join('');

  modal.querySelector('.checkout-subtotal').textContent = `${total.toFixed(2)} $`;
  modal.querySelector('.checkout-shipping').textContent = shipping === 0 ? 'Gratuit' : `${shipping.toFixed(2)} $`;
  modal.querySelector('.checkout-tax').textContent = `${tax.toFixed(2)} $`;
  modal.querySelector('.checkout-total').textContent = `${grandTotal.toFixed(2)} $`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // TikTok Pixel: Initiate Checkout
  if (window.ttq) ttq.track('InitiateCheckout', {
    content_type: 'product',
    value: grandTotal,
    currency: 'CAD'
  });

  modal.querySelector('.modal-close').onclick = () => closeCheckout();
  modal.onclick = (e) => { if (e.target === modal) closeCheckout(); };
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

function handleCheckout(e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  // Validate
  let valid = true;
  form.querySelectorAll('input[required], select[required]').forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#E53935';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  if (!valid) return;

  const btn = form.querySelector('.checkout-submit-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Traitement...';
  btn.disabled = true;

  const customer = {
    name: `${data.get('firstname')} ${data.get('lastname')}`,
    email: data.get('email'),
    phone: data.get('phone'),
    address: data.get('address'),
    city: data.get('city'),
    province: data.get('province'),
    postalCode: data.get('zipcode')
  };

  // Send to server
  fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, customer })
  })
  .then(r => r.json())
  .then(result => {
    if (result.error) {
      showNotification(result.error);
      btn.textContent = originalText;
      btn.disabled = false;
      return;
    }

    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    closeCheckout();
    form.reset();
    btn.textContent = originalText;
    btn.disabled = false;

    // Redirect to Stripe or success page
    if (result.url) {
      window.location.href = result.url;
    }
  })
  .catch(err => {
    showNotification('Erreur de connexion. Veuillez réessayer.');
    btn.textContent = originalText;
    btn.disabled = false;
  });
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, isSuccess = false) {
  const notif = document.getElementById('notification');
  notif.querySelector('.notification-text strong').textContent = isSuccess ? 'Merci !' : 'Panier mis à jour';
  notif.querySelector('.notification-text span').textContent = message;

  notif.classList.add('show');
  setTimeout(() => { notif.classList.remove('show'); }, 3000);
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

// ==================== NEWSLETTER ====================
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const email = input.value.trim();
    if (!email) return;

    fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(() => {
      showNotification('Bienvenue dans la famille LUMEA ! -10% sur votre 1re commande.', true);
      input.value = '';
    })
    .catch(() => {
      showNotification('Bienvenue dans la famille LUMEA !', true);
      input.value = '';
    });
  });
}

// ==================== SOCIAL PROOF ====================
function initSocialProof() {
  const proofs = [
    "Sophie de Montréal vient d'acheter le Sérum Éclat",
    "Marie de Québec vient d'ajouter la Crème Hydra-Luxe",
    "23 personnes regardent ce produit en ce moment",
    "Amira de Toronto vient de commander le coffret complet",
    "Le Sérum Éclat est en rupture de stock dans 2 jours",
    "Léa de Laval vient d'acheter le Nettoyant Pur",
    "17 commandes dans la dernière heure",
    "Camille d'Ottawa vient d'acheter le Sérum Éclat"
  ];

  const el = document.getElementById('socialProof');
  const text = document.getElementById('socialProofText');
  let index = 0;

  function showProof() {
    text.textContent = proofs[index];
    el.classList.add('show');

    setTimeout(() => {
      el.classList.remove('show');
    }, 4000);

    index = (index + 1) % proofs.length;
  }

  // Start after 8 seconds, repeat every 15 seconds
  setTimeout(() => {
    showProof();
    setInterval(showProof, 15000);
  }, 8000);
}
