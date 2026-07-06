const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { generateGuide } = require('./generate-guide');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== JSON DATABASE ====================
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const DB_PATH = path.join(dataDir, 'db.json');

function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch(e) {}
  return { orders: [], newsletter: [], downloads: [] };
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ==================== PRODUCT ====================
const PRODUCT = {
  id: 'guide-30-jours',
  name: 'Guide Routine Peau Parfaite 30 Jours',
  price: 27,
  priceInCents: 2700,
  oldPrice: 67,
  description: 'Le guide complet pour transformer votre peau en 30 jours.',
  currency: 'cad'
};

// ==================== MIDDLEWARE ====================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/config', (req, res) => {
  res.json({
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    tiktokPixelId: process.env.TIKTOK_PIXEL_ID,
    baseUrl: process.env.BASE_URL || `http://localhost:${PORT}`
  });
});

app.get('/api/product', (req, res) => {
  res.json({
    id: PRODUCT.id,
    name: PRODUCT.name,
    price: PRODUCT.price,
    oldPrice: PRODUCT.oldPrice,
    description: PRODUCT.description
  });
});

// ==================== CHECKOUT ====================
app.post('/api/checkout', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis' });

    const orderId = 'LUM-' + uuidv4().slice(0, 8).toUpperCase();
    const downloadToken = uuidv4();

    const order = {
      id: orderId,
      customer_name: name || '',
      customer_email: email,
      product: PRODUCT.name,
      price: PRODUCT.price,
      downloadToken,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && !stripeKey.includes('VOTRE_CLE')) {
      const stripe = require('stripe')(stripeKey);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'cad',
            product_data: {
              name: PRODUCT.name,
              description: 'Guide digital PDF - Livraison instantanee par telechargement'
            },
            unit_amount: PRODUCT.priceInCents
          },
          quantity: 1
        }],
        mode: 'payment',
        success_url: `${process.env.BASE_URL || 'http://localhost:' + PORT}/success.html?order=${orderId}&token=${downloadToken}`,
        cancel_url: `${process.env.BASE_URL || 'http://localhost:' + PORT}/`,
        customer_email: email,
        metadata: { orderId, downloadToken }
      });

      order.stripe_session_id = session.id;
      const db = loadDB();
      db.orders.push(order);
      saveDB(db);
      return res.json({ url: session.url, orderId });
    }

    // Demo mode
    order.status = 'confirmed';
    const db = loadDB();
    db.orders.push(order);
    saveDB(db);
    res.json({ url: `/success.html?order=${orderId}&token=${downloadToken}`, orderId, demo: true });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== STRIPE WEBHOOK ====================
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || stripeKey.includes('VOTRE_CLE')) return res.sendStatus(200);
  try {
    const stripe = require('stripe')(stripeKey);
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body);
    }
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      const db = loadDB();
      const order = db.orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'confirmed';
        order.paid_at = new Date().toISOString();
        saveDB(db);
      }
      console.log(`Order ${orderId} confirmed!`);
    }
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  res.sendStatus(200);
});

// ==================== DOWNLOAD ====================
app.get('/api/download/:token', (req, res) => {
  const { token } = req.params;
  const db = loadDB();
  const order = db.orders.find(o => o.downloadToken === token);
  if (!order) return res.status(404).json({ error: 'Lien invalide' });

  const guidePath = path.join(__dirname, 'data', 'guide-lumea.pdf');
  if (!fs.existsSync(guidePath)) {
    return res.status(500).json({ error: 'Guide en preparation. Reessayez dans 1 minute.' });
  }

  order.status = 'delivered';
  order.downloaded_at = new Date().toISOString();
  if (!db.downloads) db.downloads = [];
  db.downloads.push({ orderId: order.id, email: order.customer_email, date: new Date().toISOString() });
  saveDB(db);
  res.download(guidePath, 'LUMEA-Guide-Routine-Peau-Parfaite-30-Jours.pdf');
});

// ==================== ORDER STATUS ====================
app.get('/api/orders/:id', (req, res) => {
  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });
  res.json({ id: order.id, status: order.status, product: order.product, price: order.price });
});

// ==================== NEWSLETTER ====================
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis' });
  const db = loadDB();
  if (!db.newsletter.find(s => s.email === email)) {
    db.newsletter.push({ email, created_at: new Date().toISOString() });
    saveDB(db);
  }
  res.json({ success: true });
});

// ==================== ADMIN ====================
app.post('/api/admin/login', (req, res) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    res.json({ token: 'admin-' + Date.now() });
  } else {
    res.status(401).json({ error: 'Mot de passe incorrect' });
  }
});

app.get('/api/admin/orders', (req, res) => {
  if (!req.headers.authorization?.startsWith('admin-')) return res.status(401).json({ error: 'Non autorise' });
  const db = loadDB();
  const orders = db.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json({
    orders,
    stats: {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.price, 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      confirmedOrders: orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').length
    }
  });
});

app.get('/api/admin/newsletter', (req, res) => {
  if (!req.headers.authorization?.startsWith('admin-')) return res.status(401).json({ error: 'Non autorise' });
  res.json(loadDB().newsletter);
});

// ==================== START ====================
async function startServer() {
  try {
    await generateGuide();
    console.log('Guide PDF ready!');
  } catch (err) {
    console.error('Error generating guide:', err.message);
  }
  app.listen(PORT, () => {
    const mode = process.env.STRIPE_SECRET_KEY?.includes('VOTRE_CLE') ? 'DEMO' : 'PRODUCTION';
    console.log(`
  ========================================
      LUMEA BOUTIQUE - Produits Digitaux
  ========================================
  Site  : http://localhost:${PORT}
  Admin : http://localhost:${PORT}/admin.html
  Mode  : ${mode}
  ========================================
    `);
  });
}

startServer();
