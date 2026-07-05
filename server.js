const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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
  return { orders: [], newsletter: [] };
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ==================== PRODUCTS ====================
const PRODUCTS = [
  {
    id: 1, name: "Sérum Éclat", category: "Soin Visage",
    price: 4900, displayPrice: 49, oldPrice: 65, badge: "Best-seller",
    image: "/images/serum.png",
    description: "Sérum signature à la vitamine C pure et à l'acide hyaluronique."
  },
  {
    id: 2, name: "Crème Hydra-Luxe", category: "Hydratation",
    price: 5900, displayPrice: 59, oldPrice: null, badge: null,
    image: "/images/creme.png",
    description: "Crème hydratante luxueuse. Hydratation intense 72 heures."
  },
  {
    id: 3, name: "Nettoyant Pur", category: "Nettoyage",
    price: 3500, displayPrice: 35, oldPrice: 45, badge: "Nouveau",
    image: "/images/nettoyant.png",
    description: "Gel nettoyant doux au thé vert et aloe vera."
  }
];

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

app.get('/api/products', (req, res) => {
  res.json(PRODUCTS.map(p => ({
    id: p.id, name: p.name, category: p.category,
    price: p.displayPrice, oldPrice: p.oldPrice,
    badge: p.badge, image: p.image, description: p.description
  })));
});

// ==================== CHECKOUT ====================
app.post('/api/checkout', async (req, res) => {
  try {
    const { items, customer } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'Panier vide' });

    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) throw new Error(`Produit ${item.id} introuvable`);
      const lineTotal = product.displayPrice * item.qty;
      subtotal += lineTotal;
      return { id: product.id, name: product.name, price: product.displayPrice, qty: item.qty, total: lineTotal };
    });

    const shipping = subtotal >= 75 ? 0 : 9.95;
    const taxRate = 0.14975;
    const tax = parseFloat((subtotal * taxRate).toFixed(2));
    const total = parseFloat((subtotal + shipping + tax).toFixed(2));
    const orderId = 'LUM-' + uuidv4().slice(0, 8).toUpperCase();

    const order = {
      id: orderId,
      customer_name: customer?.name || '',
      customer_email: customer?.email || '',
      customer_phone: customer?.phone || '',
      address: customer?.address || '',
      city: customer?.city || '',
      province: customer?.province || '',
      postal_code: customer?.postalCode || '',
      items: orderItems,
      subtotal, shipping, tax, total,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };

    // Try Stripe if configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && !stripeKey.includes('VOTRE_CLE')) {
      const stripe = require('stripe')(stripeKey);

      const lineItems = orderItems.map(item => ({
        price_data: {
          currency: 'cad',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.qty
      }));

      if (shipping > 0) {
        lineItems.push({
          price_data: { currency: 'cad', product_data: { name: 'Livraison' }, unit_amount: Math.round(shipping * 100) },
          quantity: 1
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/success.html?order=${orderId}`,
        cancel_url: `${process.env.BASE_URL}/#produits`,
        customer_email: customer?.email,
        metadata: { orderId }
      });

      order.status = 'pending';
      order.stripe_session_id = session.id;

      const db = loadDB();
      db.orders.push(order);
      saveDB(db);

      return res.json({ url: session.url, orderId });
    }

    // Demo mode
    const db = loadDB();
    db.orders.push(order);
    saveDB(db);

    res.json({ url: `/success.html?order=${orderId}`, orderId, demo: true });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== WEBHOOK ====================
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || stripeKey.includes('VOTRE_CLE')) return res.sendStatus(200);

  try {
    const stripe = require('stripe')(stripeKey);
    const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed') {
      const orderId = event.data.object.metadata.orderId;
      const db = loadDB();
      const order = db.orders.find(o => o.id === orderId);
      if (order) { order.status = 'confirmed'; saveDB(db); }
      console.log(`Order ${orderId} confirmed!`);
    }
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  res.sendStatus(200);
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

// ==================== ORDER STATUS ====================
app.get('/api/orders/:id', (req, res) => {
  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });
  res.json(order);
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
  if (!req.headers.authorization?.startsWith('admin-')) return res.status(401).json({ error: 'Non autorisé' });

  const db = loadDB();
  const orders = db.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({
    orders,
    stats: {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      confirmedOrders: orders.filter(o => o.status === 'confirmed').length
    }
  });
});

app.patch('/api/admin/orders/:id', (req, res) => {
  if (!req.headers.authorization?.startsWith('admin-')) return res.status(401).json({ error: 'Non autorisé' });

  const { status } = req.body;
  if (!['pending','confirmed','shipped','delivered','cancelled'].includes(status))
    return res.status(400).json({ error: 'Statut invalide' });

  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (order) { order.status = status; saveDB(db); }
  res.json({ success: true });
});

app.get('/api/admin/newsletter', (req, res) => {
  if (!req.headers.authorization?.startsWith('admin-')) return res.status(401).json({ error: 'Non autorisé' });
  res.json(loadDB().newsletter);
});

// ==================== START ====================
app.listen(PORT, () => {
  const mode = process.env.STRIPE_SECRET_KEY?.includes('VOTRE_CLE') ? 'DEMO' : 'PRODUCTION';
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║             LUMEA BOUTIQUE                    ║
  ║                                               ║
  ║  Boutique : http://localhost:${PORT}             ║
  ║  Admin    : http://localhost:${PORT}/admin.html   ║
  ║                                               ║
  ║  Mode: ${mode.padEnd(40)}║
  ╚═══════════════════════════════════════════════╝
  `);
});
