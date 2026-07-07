const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { generateGuide } = require('./generate-guide');

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
const DB_PATH = path.join(dataDir, 'db.json');

function loadDB() {
  try { if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch(e) {}
  return { orders: [], newsletter: [], knownEmails: [] };
}
function saveDB(data) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }

// ==================== PRODUCTS CATALOG ====================
const PRODUCTS = [
  {
    id: 'ice-bath-bowl',
    name: 'Facial Ice Bath Bowl',
    subtitle: 'De-puff & tighten pores instantly',
    price: 29.99,
    oldPrice: 54.99,
    description: 'Foldable silicone face ice bath bowl for full facial immersion. Reduces inflammation, tightens pores and soothes acne. Built-in ice mold included. Compact and travel-friendly.',
    features: ['Reduces puffiness & swelling', 'Tightens pores in 3 min', 'BPA-free foldable silicone', 'Built-in ice mold'],
    tag: 'VIRAL TIKTOK',
    emoji: '\u2744\uFE0F',
    image: '/images/ice-bath-bowl.jpg',
    color: '#E3F2FD'
  },
  {
    id: 'wonderskin-lip-stain',
    name: 'Wonderskin Lip Stain Peel-Off',
    subtitle: '1 sold every 5 seconds on TikTok',
    price: 24.99,
    oldPrice: 39.99,
    description: 'The viral lip stain that broke TikTok! Apply the masque, let it dry, peel off \u2014 reveal a 12h+ waterproof, transfer-proof color. Wonder Blading technology for perfect lips.',
    features: ['12h+ waterproof wear', 'Peel-off transfer-proof', '1 sold / 5 sec on TikTok', 'Wonder Blading technology'],
    tag: '#1 TIKTOK',
    emoji: '\uD83D\uDC8B',
    image: '/images/wonderskin.jpg',
    color: '#FCE4EC'
  },
  {
    id: 'lip-liner-peel',
    name: 'Lip Liner Stay-N-Peel',
    subtitle: 'Perfect lips all day long',
    price: 14.99,
    oldPrice: 29.99,
    description: 'The lip liner that generated $46 million in sales on TikTok! Apply, let dry, peel \u2014 guaranteed 12h+ long-lasting color with zero transfer.',
    features: ['12h+ transfer-proof wear', 'Natural peel-off finish', '6 shades available', '$46M TikTok sales'],
    tag: '#1 TIKTOK',
    emoji: '\uD83D\uDC8B',
    image: '/images/lip-liner.png',
    color: '#FCE4EC'
  },
  {
    id: 'neck-cream',
    name: 'Neck & D\u00e9collet\u00e9 Firming Cream',
    subtitle: 'Tighten & lift visibly',
    price: 34.99,
    oldPrice: 64.99,
    description: 'Specially formulated cream for the neck and d\u00e9collet\u00e9 \u2014 the most overlooked aging zones. Visible tightening results in 7 days. Peptides + hyaluronic acid.',
    features: ['Visible firming in 7 days', 'Peptides + hyaluronic acid', 'Neck & d\u00e9collet\u00e9 zone', '$32M TikTok sales'],
    tag: 'ANTI-AGING',
    emoji: '\u2B50',
    image: '/images/neck-cream.png',
    color: '#FFF8E1'
  },
  {
    id: 'biodance-collagen-mask',
    name: 'Biodance Collagen Deep Mask',
    subtitle: '#1 viral Korean skincare mask',
    price: 22.99,
    oldPrice: 39.99,
    description: 'The collagen hydrogel mask that conquered TikTok! +204% hydration, -83% pore reduction, +20% glow. Overnight use for glass skin in the morning. 42K+ reviews, 4.5 stars on Amazon.',
    features: ['+204% proven hydration', 'Glass skin overnight', '42K+ Amazon reviews 4.5\u2605', '8K+ sold per month'],
    tag: 'GLASS SKIN',
    emoji: '\u2728',
    image: '/images/biodance.jpg',
    color: '#E8F5E9'
  },
  {
    id: 'medicube-glow-serum',
    name: 'Medicube Glass Glow Serum',
    subtitle: '#1 K-beauty serum on TikTok',
    price: 19.99,
    oldPrice: 34.99,
    description: 'Triple collagen + niacinamide + hyaluronic acid serum for instant glass skin glow. Formulated with dermatologists. The most viral K-beauty brand of 2025.',
    features: ['Triple collagen + niacinamide', 'Instant glass glow effect', 'Dermatologist-formulated', 'Top K-beauty brand TikTok'],
    tag: 'K-BEAUTY',
    emoji: '\uD83E\uDDF4',
    image: '/images/medicube.jpg',
    color: '#F3E5F5'
  },
  {
    id: 'skincare-guide-pdf',
    name: 'Perfect Skin Routine — 30 Day Guide',
    subtitle: '22-page digital guide (PDF)',
    price: 12.99,
    oldPrice: 27.00,
    description: 'Complete 22-page skincare guide: skin type quiz, personalized AM & PM routines, 8 miracle ingredients explained, 5 DIY face mask recipes, 30-day transformation calendar, and expert product recommendations.',
    features: ['Skin type quiz', 'AM & PM routines', '5 DIY face masks', '30-day calendar'],
    tag: 'DIGITAL',
    emoji: '\uD83D\uDCD6',
    image: '',
    color: '#FFF3E0',
    type: 'digital'
  }
];

// ==================== MIDDLEWARE ====================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/config', function(req, res) {
  res.json({
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    baseUrl: process.env.BASE_URL || ('http://localhost:' + PORT)
  });
});

app.get('/api/products', function(req, res) {
  res.json(PRODUCTS.map(function(p) {
    return { id: p.id, name: p.name, subtitle: p.subtitle, price: p.price, oldPrice: p.oldPrice, description: p.description, features: p.features, tag: p.tag, emoji: p.emoji, image: p.image, color: p.color, type: p.type || 'physical' };
  }));
});

app.get('/api/products/:id', function(req, res) {
  var p = PRODUCTS.find(function(x) { return x.id === req.params.id; });
  if (!p) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(p);
});

// ==================== CHECKOUT (physical products) ====================
app.post('/api/checkout', async function(req, res) {
  try {
    var body = req.body;
    var email = body.email, name = body.name, address = body.address, city = body.city, province = body.province, postal = body.postal, country = body.country, items = body.items;
    if (!email || !items || !items.length) return res.status(400).json({ error: 'Email and products required' });

    // Check if order has physical items
    var hasPhysical = items.some(function(item) {
      var prod = PRODUCTS.find(function(p) { return p.id === item.id; });
      return !prod || prod.type !== 'digital';
    });
    if (hasPhysical && (!address || !city || !postal)) return res.status(400).json({ error: 'Shipping address required' });

    var orderItems = [];
    var totalCents = 0;
    items.forEach(function(item) {
      var prod = PRODUCTS.find(function(p) { return p.id === item.id; });
      if (prod) {
        var qty = item.qty || 1;
        orderItems.push({ id: prod.id, name: prod.name, price: prod.price, qty: qty });
        totalCents += Math.round(prod.price * 100) * qty;
      }
    });
    if (!orderItems.length) return res.status(400).json({ error: 'Aucun produit valide' });

    // Check if this email already ordered (for PDF bonus logic)
    var db = loadDB();
    var isNewCustomer = !db.knownEmails.includes(email.toLowerCase());
    var boughtGuide = items.some(function(item) { return item.id === 'skincare-guide-pdf'; });

    var orderId = 'LUM-' + uuidv4().slice(0, 8).toUpperCase();
    var downloadToken = (isNewCustomer || boughtGuide) ? uuidv4() : null;

    var order = {
      id: orderId,
      customer_name: name || '',
      customer_email: email,
      shipping: { address: address, city: city, province: province || '', postal: postal, country: country || '' },
      items: orderItems,
      total: totalCents / 100,
      downloadToken: downloadToken,
      isNewCustomer: isNewCustomer,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    var stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && stripeKey.indexOf('VOTRE_CLE') === -1) {
      var stripe = require('stripe')(stripeKey);
      var lineItems = orderItems.map(function(item) {
        return {
          price_data: {
            currency: 'cad',
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100)
          },
          quantity: item.qty
        };
      });

      var successUrl = (process.env.BASE_URL || 'http://localhost:' + PORT) + '/success.html?order=' + orderId;
      if (downloadToken) successUrl += '&token=' + downloadToken;

      var session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: (process.env.BASE_URL || 'http://localhost:' + PORT) + '/',
        customer_email: email,
        metadata: { orderId: orderId }
      });

      order.stripe_session_id = session.id;
      db.orders.push(order);
      if (isNewCustomer) db.knownEmails.push(email.toLowerCase());
      saveDB(db);
      return res.json({ url: session.url, orderId: orderId });
    }

    // Demo mode
    order.status = 'confirmed';
    db.orders.push(order);
    if (isNewCustomer) db.knownEmails.push(email.toLowerCase());
    saveDB(db);
    var demoUrl = '/success.html?order=' + orderId;
    if (downloadToken) demoUrl += '&token=' + downloadToken;
    res.json({ url: demoUrl, orderId: orderId, demo: true });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== STRIPE WEBHOOK ====================
app.post('/api/webhook', express.raw({ type: 'application/json' }), function(req, res) {
  var stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || stripeKey.indexOf('VOTRE_CLE') !== -1) return res.sendStatus(200);
  try {
    var stripe = require('stripe')(stripeKey);
    var sig = req.headers['stripe-signature'];
    var webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    var event;
    if (webhookSecret) { event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret); }
    else { event = JSON.parse(req.body); }
    if (event.type === 'checkout.session.completed') {
      var session = event.data.object;
      var orderId = session.metadata.orderId;
      var db = loadDB();
      var order = db.orders.find(function(o) { return o.id === orderId; });
      if (order) { order.status = 'confirmed'; order.paid_at = new Date().toISOString(); saveDB(db); }
    }
  } catch (err) { console.error('Webhook error:', err.message); return res.status(400).send('Webhook Error'); }
  res.sendStatus(200);
});

// ==================== DOWNLOAD (PDF bonus) ====================
app.get('/api/download/:token', function(req, res) {
  var token = req.params.token;
  var db = loadDB();
  var order = db.orders.find(function(o) { return o.downloadToken === token; });
  if (!order) return res.status(404).json({ error: 'Lien invalide' });
  var guidePath = path.join(__dirname, 'data', 'guide-lumea.pdf');
  if (!fs.existsSync(guidePath)) return res.status(500).json({ error: 'Guide en preparation.' });
  res.download(guidePath, 'LUMEA-Guide-Routine-Peau-Parfaite-30-Jours.pdf');
});

// ==================== ORDER STATUS ====================
app.get('/api/orders/:id', function(req, res) {
  var db = loadDB();
  var order = db.orders.find(function(o) { return o.id === req.params.id; });
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });
  res.json({ id: order.id, status: order.status, items: order.items, total: order.total, shipping: order.shipping, isNewCustomer: order.isNewCustomer });
});

// ==================== ADMIN ====================
app.post('/api/admin/login', function(req, res) {
  if (req.body.password === process.env.ADMIN_PASSWORD) res.json({ token: 'admin-' + Date.now() });
  else res.status(401).json({ error: 'Mot de passe incorrect' });
});
app.get('/api/admin/orders', function(req, res) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('admin-')) return res.status(401).json({ error: 'Non autorise' });
  var db = loadDB();
  var orders = db.orders.sort(function(a, b) { return new Date(b.created_at) - new Date(a.created_at); });
  res.json({
    orders: orders,
    stats: {
      totalOrders: orders.length,
      totalRevenue: orders.reduce(function(s, o) { return s + (o.total || 0); }, 0),
      pendingOrders: orders.filter(function(o) { return o.status === 'pending'; }).length,
      confirmedOrders: orders.filter(function(o) { return o.status === 'confirmed'; }).length
    }
  });
});

// ==================== NEWSLETTER ====================
app.post('/api/newsletter', function(req, res) {
  var email = req.body.email;
  if (!email) return res.status(400).json({ error: 'Email requis' });
  var db = loadDB();
  if (!db.newsletter) db.newsletter = [];
  if (!db.newsletter.find(function(s) { return s.email === email; })) {
    db.newsletter.push({ email: email, created_at: new Date().toISOString() });
    saveDB(db);
  }
  res.json({ success: true });
});

// ==================== START ====================
async function startServer() {
  try { await generateGuide(); console.log('Guide PDF ready!'); }
  catch (err) { console.error('Error generating guide:', err.message); }
  app.listen(PORT, function() {
    console.log('\n  LUMEA BOUTIQUE on port ' + PORT + '\n');
  });
}
startServer();
