// ==================== CART STATE ====================
var cart = JSON.parse(localStorage.getItem('lumea-cart') || '[]');

function saveCart() { localStorage.setItem('lumea-cart', JSON.stringify(cart)); updateCartUI(); }

function addToCart(productId) {
  var existing = cart.find(function(c) { return c.id === productId; });
  if (existing) { existing.qty++; } else { cart.push({ id: productId, qty: 1 }); }
  saveCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(function(c) { return c.id !== productId; });
  saveCart();
}

function changeQty(productId, delta) {
  var item = cart.find(function(c) { return c.id === productId; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(function(c) { return c.id !== productId; });
  saveCart();
}

// ==================== PRODUCTS ====================
var allProducts = [];

function loadProducts() {
  fetch('/api/products').then(function(r) { return r.json(); }).then(function(products) {
    allProducts = products;
    renderProducts();
    updateCartUI();
  });
}

function renderProducts() {
  var grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = allProducts.map(function(p) {
    var discount = Math.round((1 - p.price / p.oldPrice) * 100);
    var imgHtml = p.image
      ? '<div class="product-img"><img src="' + p.image + '" alt="' + p.name + '"></div>'
      : '<div class="product-img product-img-emoji">' + p.emoji + '</div>';
    return '<div class="product-card reveal">' +
      '<div class="product-tag" style="background:' + p.color + '">' + p.tag + '</div>' +
      imgHtml +
      '<div class="product-card-body">' +
      '<h3 class="product-name">' + p.name + '</h3>' +
      '<p class="product-subtitle">' + p.subtitle + '</p>' +
      '<div class="product-price"><span class="price-old">' + p.oldPrice.toFixed(2) + ' $</span><span class="price-current">' + p.price.toFixed(2) + ' $</span><span class="price-save">-' + discount + '%</span></div>' +
      '<ul class="product-features">' + p.features.map(function(f) { return '<li>&#10003; ' + f + '</li>'; }).join('') + '</ul>' +
      (p.type === 'digital' ? '<p class="digital-note">Instant PDF download after purchase</p>' : '') +
      '<button class="btn btn-primary btn-full add-cart-btn" onclick="addToCart(\'' + p.id + '\')">Add to Cart</button>' +
      '</div>' +
    '</div>';
  }).join('');
  initReveal();
}

// ==================== CART UI ====================
function updateCartUI() {
  var countEl = document.getElementById('cartCount');
  var itemsEl = document.getElementById('cartItems');
  var footerEl = document.getElementById('cartFooter');
  var totalEl = document.getElementById('cartTotal');
  if (!countEl) return;

  var totalQty = cart.reduce(function(s, c) { return s + c.qty; }, 0);
  countEl.textContent = totalQty;

  if (!itemsEl) return;
  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p><a href="#products" class="btn btn-primary" onclick="closeCart()">Shop Now</a></div>';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  var total = 0;
  itemsEl.innerHTML = cart.map(function(c) {
    var p = allProducts.find(function(x) { return x.id === c.id; });
    if (!p) return '';
    var subtotal = p.price * c.qty;
    total += subtotal;
    return '<div class="cart-item">' +
      '<div class="cart-item-img"><img src="' + p.image + '" alt="' + p.name + '"></div>' +
      '<div class="cart-item-info"><h4>' + p.name + '</h4><p>' + p.price.toFixed(2) + ' $ x ' + c.qty + '</p></div>' +
      '<div class="cart-item-actions">' +
        '<button onclick="changeQty(\'' + c.id + '\', -1)">-</button>' +
        '<span>' + c.qty + '</span>' +
        '<button onclick="changeQty(\'' + c.id + '\', 1)">+</button>' +
        '<button class="remove-btn" onclick="removeFromCart(\'' + c.id + '\')">&times;</button>' +
      '</div></div>';
  }).join('');

  if (totalEl) totalEl.textContent = total.toFixed(2);
  if (footerEl) footerEl.style.display = 'block';
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function openCheckout() {
  closeCart();
  document.getElementById('checkoutModal').style.display = 'flex';

  // Check if cart has physical items
  var hasPhysical = cart.some(function(c) {
    var p = allProducts.find(function(x) { return x.id === c.id; });
    return p && p.type !== 'digital';
  });

  // Show/hide shipping fields
  var shippingTitle = document.getElementById('shippingTitle');
  var shippingFields = document.getElementById('shippingFields');
  var paySecure = document.getElementById('paySecure');
  if (shippingTitle) shippingTitle.style.display = hasPhysical ? '' : 'none';
  if (shippingFields) {
    shippingFields.style.display = hasPhysical ? '' : 'none';
    shippingFields.querySelectorAll('input').forEach(function(input) {
      if (hasPhysical) input.setAttribute('required', '');
      else input.removeAttribute('required');
    });
  }
  if (paySecure) paySecure.textContent = hasPhysical ? 'Secured by Stripe | 7-15 day shipping' : 'Secured by Stripe | Instant PDF download';

  var summary = document.getElementById('checkoutSummary');
  var total = 0;
  summary.innerHTML = '<h4>Order Summary</h4>' + cart.map(function(c) {
    var p = allProducts.find(function(x) { return x.id === c.id; });
    if (!p) return '';
    var st = p.price * c.qty; total += st;
    return '<div class="summary-line"><span>' + p.name + ' x' + c.qty + '</span><span>' + st.toFixed(2) + ' $</span></div>';
  }).join('') +
  '<div class="summary-line summary-total"><span>Total</span><span>' + total.toFixed(2) + ' $ CAD</span></div>' +
  (hasPhysical ? '<div class="summary-bonus">+ FREE Perfect Skin Routine Guide!</div>' : '');
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
  loadProducts();

  var cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  var cartClose = document.getElementById('cartClose');
  if (cartClose) cartClose.addEventListener('click', closeCart);
  var cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  var checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  var modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', function() { document.getElementById('checkoutModal').style.display = 'none'; });

  var form = document.getElementById('checkoutForm');
  if (form) form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = document.getElementById('payBtn');
    btn.disabled = true; btn.textContent = 'Processing...';
    var fd = new FormData(form);
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'), email: fd.get('email'), address: fd.get('address'),
        city: fd.get('city'), province: fd.get('province'), postal: fd.get('postal'), country: fd.get('country'),
        items: cart.map(function(c) { return { id: c.id, qty: c.qty }; })
      })
    }).then(function(r) { return r.json(); }).then(function(data) {
      if (data.url) { cart = []; saveCart(); window.location.href = data.url; }
      else { alert(data.error || 'Error'); btn.disabled = false; btn.textContent = 'Pay Now'; }
    }).catch(function() { alert('Connection error'); btn.disabled = false; btn.textContent = 'Pay Now'; });
  });

  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() { this.parentElement.classList.toggle('open'); });
  });

  var toggle = document.querySelector('.menu-toggle');
  if (toggle) toggle.addEventListener('click', function() { document.querySelector('.nav-links').classList.toggle('open'); });
});

function initReveal() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(function(el) { observer.observe(el); });
}
initReveal();

// ==================== EMAIL POPUP ====================
(function() {
  var overlay = document.getElementById('popupOverlay');
  var closeBtn = document.getElementById('popupClose');
  var form = document.getElementById('popupForm');
  if (!overlay) return;

  function showPopup() { overlay.classList.add('active'); }
  function hidePopup() { overlay.classList.remove('active'); }

  setTimeout(showPopup, 5000);

  document.addEventListener('mouseleave', function(e) {
    if (e.clientY < 5 && !overlay.classList.contains('active')) showPopup();
  });

  closeBtn.addEventListener('click', hidePopup);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) hidePopup(); });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('popupEmail').value;
    fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    }).then(function() {
      form.parentElement.innerHTML = '<div class="popup-success">&#10003; You\'re in!<br><span style="font-size:14px;color:#555;font-weight:400">Check your inbox for your 10% code.</span></div>';
      setTimeout(hidePopup, 3000);
    });
  });
})();
