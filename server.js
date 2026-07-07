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
    subtitle: 'Soin visage anti-poches & pores',
    price: 29.99,
    oldPrice: 54.99,
    description: 'Bol de glace facial en silicone pliable pour une immersion compl\u00e8te du visage. R\u00e9duit les inflammations, resserre les pores et apaise l\u2019acn\u00e9. Inclut un moule \u00e0 glace int\u00e9gr\u00e9. Compact et id\u00e9al pour voyager.',
    features: ['R\u00e9duit poches et gonflements', 'Resserre les pores en 3 min', 'Silicone BPA-free pliable', 'Moule \u00e0 glace int\u00e9gr\u00e9'],
    tag: 'VIRAL TIKTOK',
    emoji: '\u2744\uFE0F',
    image: '/images/ice-bath-bowl.jpg',
    color: '#E3F2FD'
  },
  {
    id: 'wonderskin-lip-stain',
    name: 'Wonderskin Lip Stain Peel-Off',
    subtitle: '1 vendu toutes les 5 secondes sur TikTok',
    price: 24.99,
    oldPrice: 39.99,
    description: 'Le lip stain viral qui a explos\u00e9 sur TikTok ! Appliquez le masque, laissez s\u00e9cher, pelez \u2014 r\u00e9v\u00e9lez une couleur longue tenue 12h+ waterproof et sans transfert. La technologie Wonder Blading pour des l\u00e8vres parfaites.',
    features: ['Tenue 12h+ waterproof', 'Peel-off sans transfert', '1 vendu / 5 sec sur TikTok', 'Technologie Wonder Blading'],
    tag: '#1 TIKTOK',
    emoji: '\uD83D\uDC8B',
    image: '/images/wonderskin.jpg',
    color: '#FCE4EC'
  },
  {
    id: 'lip-liner-peel',
    name: 'Lip Liner Stay-N-Peel',
    subtitle: 'L\u00e8vres parfaites toute la journ\u00e9e',
    price: 14.99,
    oldPrice: 29.99,
    description: 'Le lip liner qui a g\u00e9n\u00e9r\u00e9 46 millions de dollars de ventes sur TikTok ! Appliquez, laissez s\u00e9cher, pelez \u2014 couleur longue tenue garantie 12h+ sans transfert.',
    features: ['Tenue 12h+ sans transfert', 'Effet naturel et peel-off', '6 teintes disponibles', '46M de ventes TikTok'],
    tag: '#1 TIKTOK',
    emoji: '\uD83D\uDC8B',
    image: '/images/lip-liner.png',
    color: '#FCE4EC'
  },
  {
    id: 'neck-cream',
    name: 'Cr\u00e8me Cou & D\u00e9collet\u00e9 Anti-\u00c2ge',
    subtitle: 'Raffermissant et lissant',
    price: 34.99,
    oldPrice: 64.99,
    description: 'Cr\u00e8me sp\u00e9cialement formul\u00e9e pour le cou et le d\u00e9collet\u00e9 \u2014 zones souvent oubli\u00e9es. Effet tenseur visible d\u00e8s 7 jours. Peptides + acide hyaluronique.',
    features: ['Effet tenseur en 7 jours', 'Peptides + acide hyaluronique', 'Zone cou et d\u00e9collet\u00e9', '32M de ventes TikTok'],
    tag: 'ANTI-\u00c2GE',
    emoji: '\u2B50',
    image: '/images/neck-cream.png',
    color: '#FFF8E1'
  },
  {
    id: 'biodance-collagen-mask',
    name: 'Biodance Collagen Deep Mask',
    subtitle: 'Le masque viral #1 Korean skincare',
    price: 22.99,
    oldPrice: 39.99,
    description: 'Le masque hydrogel au collag\u00e8ne qui a conquis TikTok ! Hydratation +204%, pores r\u00e9duits -83%, \u00e9clat +20%. Pose de nuit pour un effet glass skin au r\u00e9veil. 42K+ avis 4.5 \u00e9toiles sur Amazon.',
    features: ['Hydratation +204% prouv\u00e9e', 'Glass skin au r\u00e9veil', '42K+ avis Amazon 4.5\u2605', '8K+ vendus par mois'],
    tag: 'GLASS SKIN',
    emoji: '\u2728',
    image: '/images/biodance.jpg',
    color: '#E8F5E9'
  },
  {
    id: 'medicube-glow-serum',
    name: 'Medicube Glass Glow Serum',
    subtitle: 'Le s\u00e9rum K-beauty #1 TikTok',
    price: 19.99,
    oldPrice: 34.99,
    description: 'S\u00e9rum au triple collag\u00e8ne + niacinamide + acide hyaluronique pour un \u00e9clat glass skin instantan\u00e9. Formul\u00e9 avec des dermatologues. La marque K-beauty la plus virale de 2025.',
    features: ['Triple collag\u00e8ne + niacinamide', 'Effet glass glow instantan\u00e9', 'Formul\u00e9 par dermatologues', 'Top marque K-beauty TikTok'],
    tag: 'K-BEAUTY',
    emoji: '\uD83E\uDDF4',
    image: '/images/medicube.jpg',
    color: '#F3E5F5'
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
    return { id: p.id, name: p.name, subtitle: p.subtitle, price: p.price, oldPrice: p.oldPrice, description: p.description, features: p.features, tag: p.tag, emoji: p.emoji, image: p.image, color: p.color };
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
    var email = body.email, name = body.name, address = body.address, city = body.city, province = body.province, postal = body.postal, items = body.items;
    if (!email || !items || !items.length) return res.status(400).json({ error: 'Email et produits requis' });
    if (!address || !city || !postal) return res.status(400).json({ error: 'Adresse de livraison requise' });

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

    var orderId = 'LUM-' + uuidv4().slice(0, 8).toUpperCase();
    var downloadToken = isNewCustomer ? uuidv4() : null;

    var order = {
      id: orderId,
      customer_name: name || '',
      customer_email: email,
      shipping: { address: address, city: city, province: province || '', postal: postal },
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
