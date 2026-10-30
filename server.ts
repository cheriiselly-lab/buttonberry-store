import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.resolve(__dirname, 'server_data', 'buttonberry_db.json');

app.use(express.json());
// Serve public directory for static images and assets
app.use(express.static(path.resolve(__dirname, 'public')));

// Ensure storage directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Password hashing helper (SHA-256 with fixed salt for deterministic matching)
const SALT = 'bb_salt_2026';
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + SALT).digest('hex');
}

// In-memory active tokens set: token -> { adminId, expiresAt }
const activeSessions: Map<string, { adminId: string; expiresAt: number }> = new Map();

// Initial database seeding
const DEFAULT_PRODUCTS = [
  {
    id: 'bb-01',
    name: 'Strawberry Picnic Tote',
    slug: 'strawberry-picnic-tote',
    category: 'Tote Bags',
    price: 129000,
    originalPrice: 149000,
    colors: [
      { name: 'Strawberry Pink', hex: '#E99AA8' },
      { name: 'Butter Yellow', hex: '#F6E7A6' }
    ],
    description: 'Tote bag dengan motif gingham dan detail strawberry yang playful. Dirancang untuk membawa laptop, buku bacaan, dan perlengkapan harianmu.',
    story: 'Terinspirasi dari sore piknik di bawah pohon rindang dengan keranjang rotan dan buah stroberi segar. Setiap tote memiliki saku depan berbordir tangan dan kancing kayu mungil yang dijahit dengan benang katun pilihan.',
    image: '/images/product-strawberry-picnic-tote.jpg',
    gallery: [
      '/images/product-strawberry-picnic-tote.jpg',
      '/images/hero-buttonberry-collection.jpg'
    ],
    tag: 'Bestseller',
    dimensions: '38 cm × 34 cm × 9 cm (Handle drop: 28 cm)',
    material: 'Premium Heavyweight Cotton Linen, Cotton Canvas Lining, Hand-carved Wood Button',
    stock: 14,
    status: 'Active',
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 38,
    careInstructions: [
      'Cuci dengan tangan menggunakan air dingin & sabun lembut',
      'Hindari memeras terlalu kuat untuk menjaga bentuk struktur saku',
      'Keringkan di tempat teduh dan setrika dengan suhu sedang'
    ]
  },
  {
    id: 'bb-02',
    name: 'Little Daydream Sling',
    slug: 'little-daydream-sling',
    category: 'Sling Bags',
    price: 189000,
    originalPrice: 219000,
    colors: [
      { name: 'Cream', hex: '#FFF8EC' },
      { name: 'Sage Green', hex: '#A8B69A' }
    ],
    description: 'Sling bag praktis untuk kebutuhan sehari-hari dengan siluet vintage modern, gesper logam kuningan antik, dan strap yang nyaman.',
    story: 'Sahabat setia untuk jalan-jalan santai mencari toko buku tua dan kedai kopi tenang. Siluet kotaknya kokoh namun lembut, memadukan nuansa kulit vegan premium dengan jahitan rapi buatan pengrajin lokal.',
    image: '/images/product-little-daydream-sling.jpg',
    gallery: [
      '/images/product-little-daydream-sling.jpg',
      '/images/hero-buttonberry-collection.jpg'
    ],
    tag: 'Little Favorite',
    dimensions: '21 cm × 16 cm × 7.5 cm (Adjustable strap: 95 - 125 cm)',
    material: 'Smooth Vegan Leather, Antique Brass Hardware, Peach Twill Lining',
    stock: 8,
    status: 'Active',
    isBestseller: true,
    isNew: false,
    rating: 5.0,
    reviewCount: 42,
    careInstructions: [
      'Bersihkan noda permukaan dengan kain microfiber basah yang lembut',
      'Simpan dalam dustbag saat tidak digunakan'
    ]
  },
  {
    id: 'bb-03',
    name: 'Cherry Patch Card Holder',
    slug: 'cherry-patch-card-holder',
    category: 'Card Holders',
    price: 59000,
    originalPrice: 69000,
    colors: [
      { name: 'Cherry Red', hex: '#B94B50' },
      { name: 'Cream', hex: '#FFF8EC' }
    ],
    description: 'Card holder compact dengan detail patch cherry timbul, 4 slot kartu utama, dan 1 saku tengah serbaguna.',
    story: 'Kecil dan praktis untuk menyimpan kartu transportasi, e-money, dan kartu prioritasmu. Detail buah ceri merah dengan daun hijau mungil memberikan sentuhan keceriaan.',
    image: '/images/product-cherry-card-holder.jpg',
    gallery: [
      '/images/product-cherry-card-holder.jpg'
    ],
    tag: 'Bestseller',
    dimensions: '10.2 cm × 7.5 cm × 0.4 cm',
    material: 'Supple Pebble Vegan Leather, Raised Embroidery Patch, RFID-Shielded Core',
    stock: 22,
    status: 'Active',
    isBestseller: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 56,
    careInstructions: ['Lap lembut dengan kain kering']
  },
  {
    id: 'bb-04',
    name: 'Sunday Notes Pouch',
    slug: 'sunday-notes-pouch',
    category: 'Pouches',
    price: 79000,
    originalPrice: 89000,
    colors: [
      { name: 'Butter Yellow', hex: '#F6E7A6' },
      { name: 'Strawberry Pink', hex: '#E99AA8' }
    ],
    description: 'Pouch multifungsi untuk menyimpan barang-barang kecil, kosmetik, earphone, alat tulis, atau obat-obatan pribadi.',
    story: 'Didesain menyerupai kantong surat vintage dengan tepi scalloped bergelombang yang manis. Dilengkapi tarikan ritsleting kancing kayu berukir stroberi.',
    image: '/images/product-sunday-notes-pouch.jpg',
    gallery: [
      '/images/product-sunday-notes-pouch.jpg'
    ],
    tag: 'New',
    dimensions: '18 cm × 12 cm × 6 cm',
    material: 'Natural Cotton Duck Canvas, Embroidered Scallop Edge, YKK Vintage Gold Zipper',
    stock: 4,
    status: 'Active',
    isBestseller: false,
    isNew: true,
    rating: 4.9,
    reviewCount: 19,
    careInstructions: ['Cuci lembut dengan deterjen cair']
  },
  {
    id: 'bb-05',
    name: 'Berry Loop Bag Strap',
    slug: 'berry-loop-bag-strap',
    category: 'Bag Straps',
    price: 49000,
    originalPrice: 59000,
    colors: [
      { name: 'Pink Mix', hex: '#E99AA8' },
      { name: 'Cherry Mix', hex: '#B94B50' }
    ],
    description: 'Strap tas dengan kombinasi warna playful, rajutan jacquard rapat, dan kaitan kuningan putar 360 derajat yang kuat.',
    story: 'Ubah suasana tas favoritmu dalam sekejap! Motif rajut strawberry & geometric vintage memberikan aksen statement instan pada tas polos apa pun.',
    image: '/images/product-berry-loop-strap.jpg',
    gallery: [
      '/images/product-berry-loop-strap.jpg'
    ],
    tag: 'Little Favorite',
    dimensions: 'Lebar 4 cm, Panjang dapat diatur 80 - 135 cm',
    material: 'Jacquard High-Density Weave, Antique Brass Swivel Snap Hooks',
    stock: 16,
    status: 'Active',
    isBestseller: false,
    isNew: true,
    rating: 4.7,
    reviewCount: 24,
    careInstructions: ['Bersihkan spot kotor dengan sikat gigi halus']
  },
  {
    id: 'bb-06',
    name: 'Tiny Treasure Keychain',
    slug: 'tiny-treasure-keychain',
    category: 'Keychains',
    price: 35000,
    colors: [
      { name: 'Strawberry', hex: '#B94B50' },
      { name: 'Cherry', hex: '#E99AA8' },
      { name: 'Daisy', hex: '#F6E7A6' }
    ],
    description: 'Gantungan kunci dekoratif untuk tas, dompet, kunci rumah, dan aksesori pribadi dengan pesona vintage scrapbook.',
    story: 'Sebuah jimat kecil pembawa senyum di saku atau tasmu. Menggabungkan pesona strawberry enamel merah, liontin daun kuningan, dan kancing kayu asli.',
    image: '/images/product-tiny-treasure-keychain.jpg',
    gallery: [
      '/images/product-tiny-treasure-keychain.jpg'
    ],
    tag: 'Bestseller',
    dimensions: 'Panjang total 8.5 cm (Ring diameter 3 cm)',
    material: 'Hard Enamel, Natural Hardwood Button, Antique Brass Ring & Charms',
    stock: 35,
    status: 'Active',
    isBestseller: true,
    isNew: false,
    rating: 5.0,
    reviewCount: 67,
    careInstructions: ['Hindari terkena parfum langsung']
  },
  {
    id: 'bb-07',
    name: 'Butter Blossom Coin Purse',
    slug: 'butter-blossom-coin-purse',
    category: 'Pouches',
    price: 85000,
    originalPrice: 95000,
    colors: [
      { name: 'Butter Yellow', hex: '#F6E7A6' },
      { name: 'Cream', hex: '#FFF8EC' }
    ],
    description: 'Dompet koin kiss-lock klasik dengan sulaman bunga daisy dan bingkai kuningan timbul bernuansa antik.',
    story: 'Bunyi klik logam kiss-lock yang renyah membawa memori manis ke masa lalu. Dibuat dari kulit lembut bergradasi mentega hangat dengan bordir bunga aster putih.',
    image: '/images/product-butter-coin-purse.jpg',
    gallery: [
      '/images/product-butter-coin-purse.jpg'
    ],
    tag: 'Handmade Delight',
    dimensions: '11 cm × 9.5 cm × 4.5 cm',
    material: 'Soft Calf-grain Vegan Leather, Embossed Antique Brass Kiss-Lock, Daisy Silk Embroidery',
    stock: 3,
    status: 'Active',
    isBestseller: false,
    isNew: true,
    rating: 4.9,
    reviewCount: 15,
    careInstructions: ['Hindari benturan keras pada bingkai kiss-lock']
  },
  {
    id: 'bb-08',
    name: 'Gingham Ribbon Bag Charm',
    slug: 'gingham-ribbon-bag-charm',
    category: 'Bag Straps',
    price: 42000,
    colors: [
      { name: 'Strawberry Pink', hex: '#E99AA8' },
      { name: 'Sage Green', hex: '#A8B69A' }
    ],
    description: 'Pita gantungan tas motif gingham dengan kancing kayu bordir strawberry dan klip penjepit kuningan antik.',
    story: 'Sentuhan manis yang membuat setiap tas polos langsung terasa seperti edisi khusus Buttonberry.',
    image: '/images/product-ribbon-bag-tie.jpg',
    gallery: [
      '/images/product-ribbon-bag-tie.jpg'
    ],
    tag: 'New',
    dimensions: 'Panjang pita 14 cm, Lebar 2.5 cm',
    material: 'Hand-woven Cotton Gingham Ribbon, Linen Padded Charm, Brass Crocodile Clip',
    stock: 25,
    status: 'Active',
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewCount: 18,
    careInstructions: ['Setrika dengan alas kain pelindung pada suhu rendah']
  }
];

function getInitialDb() {
  return {
    admins: [
      {
        id: 'admin-01',
        name: 'Berry Studio Owner',
        email: 'admin@buttonberry.com',
        // Hash for 'buttonberry2026' with salt 'bb_salt_2026'
        passwordHash: hashPassword('buttonberry2026'),
        role: 'Super Admin',
        lastLogin: new Date().toISOString()
      }
    ],
    products: DEFAULT_PRODUCTS,
    orders: [
      {
        orderId: 'BB-2601',
        customerName: 'Clara Anindita',
        phone: '081234567890',
        email: 'clara@example.com',
        address: 'Jl. Senopati No. 18, Kebayoran Baru',
        city: 'Jakarta Selatan',
        postalCode: '12190',
        shippingOption: { id: 'ship-regular', name: 'Standard Berry Express', courier: 'SiCepat', estimate: '2-3 hari', cost: 15000 },
        paymentMethod: 'QRIS (GoPay/OVO/ShopeePay)',
        items: [
          { product: DEFAULT_PRODUCTS[0], selectedColor: 'Strawberry Pink', quantity: 1 }
        ],
        subtotal: 129000,
        shippingFee: 15000,
        discount: 0,
        total: 144000,
        status: 'Processing',
        trackingNumber: 'SCP-BB-9921',
        date: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        orderId: 'BB-2602',
        customerName: 'Nabila Putri',
        phone: '081398765432',
        email: 'nabila@example.com',
        address: 'Jl. Riau No. 55',
        city: 'Bandung',
        postalCode: '40115',
        shippingOption: { id: 'ship-fast', name: 'Quick Strawberry Courier', courier: 'Paxel', estimate: '1 hari sampai', cost: 28000 },
        paymentMethod: 'BCA Virtual Account',
        items: [
          { product: DEFAULT_PRODUCTS[1], selectedColor: 'Sage Green', quantity: 1 },
          { product: DEFAULT_PRODUCTS[5], selectedColor: 'Strawberry', quantity: 2 }
        ],
        subtotal: 259000,
        shippingFee: 28000,
        discount: 20000,
        total: 267000,
        status: 'Shipped',
        trackingNumber: 'PXL-2026-8812',
        date: new Date(Date.now() - 3600000 * 28).toISOString()
      },
      {
        orderId: 'BB-2603',
        customerName: 'Tiara Maharani',
        phone: '085711223344',
        email: 'tiara@example.com',
        address: 'Jl. Malioboro No. 12',
        city: 'Yogyakarta',
        postalCode: '55271',
        shippingOption: { id: 'ship-regular', name: 'Standard Berry Express', courier: 'J&T', estimate: '2-3 hari', cost: 15000 },
        paymentMethod: 'Transfer Bank Manual',
        items: [
          { product: DEFAULT_PRODUCTS[2], selectedColor: 'Cherry Red', quantity: 1 }
        ],
        subtotal: 59000,
        shippingFee: 15000,
        discount: 0,
        total: 74000,
        status: 'Completed',
        trackingNumber: 'JNT-90812301',
        date: new Date(Date.now() - 3600000 * 72).toISOString()
      }
    ],
    promotions: [
      {
        id: 'promo-01',
        code: 'BUTTONJOY10',
        name: 'Diskon Sambutan 10%',
        type: 'percentage',
        value: 10,
        minSpend: 100000,
        usageCount: 42,
        maxUsage: 500,
        isActive: true,
        expiryDate: '2026-12-31'
      },
      {
        id: 'promo-02',
        code: 'LOVELY20K',
        name: 'Potongan Rp20.000 Hari Spesial',
        type: 'nominal',
        value: 20000,
        minSpend: 150000,
        usageCount: 18,
        maxUsage: 100,
        isActive: true,
        expiryDate: '2026-12-31'
      },
      {
        id: 'promo-03',
        code: 'BERRYNEW15',
        name: 'Diskon Member Baru 15%',
        type: 'percentage',
        value: 15,
        minSpend: 200000,
        usageCount: 5,
        maxUsage: 50,
        isActive: true,
        expiryDate: '2026-11-30'
      }
    ],
    auditLogs: [
      {
        id: 'log-01',
        action: 'Pembaruan Stok',
        details: 'Stok Strawberry Picnic Tote diubah menjadi 14 unit.',
        user: 'Berry Studio Owner',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: 'log-02',
        action: 'Pengiriman Pesanan',
        details: 'Pesanan #BB-2602 diubah menjadi Shipped (No. Resi: PXL-2026-8812).',
        user: 'Berry Studio Owner',
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString()
      }
    ],
    homepageContent: {
      announcementBar: 'Little treasures, made for everyday adventures. · Gratis ongkir untuk pesanan di atas Rp250.000',
      heroHeadline: 'Small Things, Big Whimsy.',
      heroSubtitle: 'Aksesori kecil untuk menemani hari-harimu yang penuh cerita. Dibuat dengan motif gingham, kancing vintage, dan sentuhan cinta.',
      heroImage: '/images/hero-buttonberry-collection.jpg',
      promoBannerTitle: 'Collect Little Joys',
      promoBannerHeading: 'Temukan aksesori yang terasa seperti kamu.',
      promoBannerText: 'Setiap potongan dirancang untuk tahan lama, praktis, dan memberi warna manis pada outfit harianmu.',
      brandIntroTitle: 'A Little World of Lovely Things.',
      brandIntroDescription: 'Di Buttonberry, kami percaya bahwa benda sehari-hari juga bisa punya cerita. Dari tas untuk menemani petualangan hingga gantungan kecil yang membuatmu tersenyum, setiap detail dirancang agar fungsional sekaligus penuh karakter.',
      newsletterHeading: 'Letters from Buttonberry',
      newsletterDescription: 'Dapatkan kabar koleksi terbaru, cerita kecil dari meja pengrajin, dan kejutan manis diskon pembuka.'
    },
    storeSettings: {
      storeName: 'Buttonberry',
      tagline: 'Little Things, Lovely Days',
      storeDescription: 'Toko butik aksesori fungsional bertema whimsical vintage.',
      contactEmail: 'hello@buttonberry.com',
      whatsappNumber: '+62 812-9876-5432',
      instagramUrl: 'https://instagram.com/buttonberry',
      tiktokUrl: 'https://tiktok.com/@buttonberry',
      storeAddress: 'Jl. Ciumbuleuit No. 42, Cidadap, Kota Bandung, Jawa Barat 40142',
      currency: 'IDR',
      standardShippingFee: 15000,
      freeShippingThreshold: 250000,
      storeAvailability: 'open'
    }
  };
}

// Database Read / Write Helpers
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = getInitialDb();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading database, resetting to initial', err);
    const initial = getInitialDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed writing database', err);
  }
}

// Ensure database file exists on startup
readDb();

// Authentication Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Akses ditolak: Token autentikasi tidak ditemukan.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    res.status(401).json({ error: 'Sesi login telah kedaluwarsa. Silakan login kembali.' });
    return;
  }

  const db = readDb();
  const admin = db.admins.find((a: any) => a.id === session.adminId);
  if (!admin) {
    res.status(401).json({ error: 'Akun administrator tidak valid.' });
    return;
  }

  (req as any).admin = admin;
  next();
}

/* ==========================================================================
   AUTHENTICATION ENDPOINTS
   ========================================================================== */

app.post('/api/admin/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email dan password harus diisi.' });
    return;
  }

  const db = readDb();
  const hashedInput = hashPassword(password);
  const admin = db.admins.find(
    (a: any) => a.email.toLowerCase() === email.toLowerCase().trim() && a.passwordHash === hashedInput
  );

  if (!admin) {
    res.status(401).json({ error: 'Email atau password administrator salah.' });
    return;
  }

  // Generate secure 32-byte session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeSessions.set(token, { adminId: admin.id, expiresAt });

  // Update last login
  admin.lastLogin = new Date().toISOString();
  writeDb(db);

  res.json({
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin
    }
  });
});

app.post('/api/admin/logout', requireAdminAuth, (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Berhasil logout.' });
});

app.get('/api/admin/me', requireAdminAuth, (req: Request, res: Response): void => {
  const admin = (req as any).admin;
  res.json({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    lastLogin: admin.lastLogin
  });
});

/* ==========================================================================
   DASHBOARD OVERVIEW & ANALYTICS
   ========================================================================== */

app.get('/api/admin/dashboard/stats', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const period = (req.query.period as string) || 'all';

  let filteredOrders = db.orders || [];
  const now = Date.now();

  if (period === 'today') {
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    filteredOrders = filteredOrders.filter((o: any) => new Date(o.date).getTime() >= oneDayAgo);
  } else if (period === '7days') {
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    filteredOrders = filteredOrders.filter((o: any) => new Date(o.date).getTime() >= sevenDaysAgo);
  } else if (period === '30days') {
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    filteredOrders = filteredOrders.filter((o: any) => new Date(o.date).getTime() >= thirtyDaysAgo);
  }

  const totalRevenue = filteredOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const totalOrders = filteredOrders.length;
  const pendingOrders = filteredOrders.filter(
    (o: any) => o.status === 'Pending' || o.status === 'Awaiting Payment' || o.status === 'Processing'
  ).length;

  const totalProducts = db.products.length;
  const lowStockCount = db.products.filter((p: any) => p.stock <= 5).length;
  const totalUnitsInStock = db.products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0);

  // Top selling products calculated from all orders
  const salesByProduct: Record<string, { product: any; unitsSold: number; revenue: number }> = {};
  for (const order of db.orders) {
    for (const item of order.items || []) {
      const pid = item.product?.id;
      if (!pid) continue;
      if (!salesByProduct[pid]) {
        salesByProduct[pid] = {
          product: item.product,
          unitsSold: 0,
          revenue: 0
        };
      }
      salesByProduct[pid].unitsSold += item.quantity || 1;
      salesByProduct[pid].revenue += (item.product.price || 0) * (item.quantity || 1);
    }
  }

  const topProducts = Object.values(salesByProduct)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  res.json({
    period,
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalProducts,
    lowStockCount,
    totalUnitsInStock,
    recentOrders: db.orders.slice(0, 5),
    topProducts,
    recentLogs: db.auditLogs ? db.auditLogs.slice(0, 6) : []
  });
});

/* ==========================================================================
   PRODUCTS CATALOG (SHARED UNIFIED STOREFRONT & ADMIN)
   ========================================================================== */

app.get('/api/products', (req: Request, res: Response): void => {
  const db = readDb();
  res.json(db.products || []);
});

app.post('/api/products', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const productData = req.body;

  if (!productData.name || !productData.price) {
    res.status(400).json({ error: 'Nama dan harga produk wajib diisi.' });
    return;
  }

  const id = `bb-${Date.now().toString().slice(-4)}`;
  const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProduct = {
    id,
    slug,
    name: productData.name,
    category: productData.category || 'Tote Bags',
    price: Number(productData.price),
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
    colors: productData.colors && productData.colors.length > 0
      ? productData.colors
      : [{ name: 'Default', hex: '#E99AA8' }],
    description: productData.description || '',
    story: productData.story || '',
    image: productData.image || (productData.gallery && productData.gallery[0]) || '/images/hero-buttonberry-collection.jpg',
    gallery: productData.gallery || [productData.image || '/images/hero-buttonberry-collection.jpg'],
    tag: productData.tag || 'New',
    dimensions: productData.dimensions || 'Standard',
    material: productData.material || 'Linen / Cotton',
    stock: Number(productData.stock) || 10,
    status: productData.status || 'Active',
    isBestseller: !!productData.isBestseller,
    isNew: true,
    rating: 5.0,
    reviewCount: 0,
    careInstructions: productData.careInstructions || ['Cuci lembut dengan tangan']
  };

  db.products.unshift(newProduct);

  // Add audit log
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Tambah Produk',
    details: `Menambahkan produk baru "${newProduct.name}" (Stok: ${newProduct.stock}).`,
    user: (req as any).admin.name,
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const { id } = req.params;
  const index = db.products.findIndex((p: any) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Produk tidak ditemukan.' });
    return;
  }

  const existing = db.products[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // prevent ID change
    price: Number(req.body.price ?? existing.price),
    stock: Number(req.body.stock ?? existing.stock)
  };

  db.products[index] = updated;

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Edit Produk',
    details: `Memperbarui detail produk "${updated.name}".`,
    user: (req as any).admin.name,
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.json(updated);
});

app.delete('/api/products/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const { id } = req.params;
  const index = db.products.findIndex((p: any) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Produk tidak ditemukan.' });
    return;
  }

  const removed = db.products.splice(index, 1)[0];

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Hapus Produk',
    details: `Menghapus produk "${removed.name}" dari katalog.`,
    user: (req as any).admin.name,
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.json({ success: true, message: `Produk "${removed.name}" berhasil dihapus.` });
});

/* ==========================================================================
   ORDERS MANAGEMENT
   ========================================================================== */

app.get('/api/orders', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  res.json(db.orders || []);
});

// Storefront placing order or Admin creating order
app.post('/api/orders', (req: Request, res: Response): void => {
  const db = readDb();
  const orderData = req.body;

  if (!orderData.items || orderData.items.length === 0) {
    res.status(400).json({ error: 'Keranjang belanja kosong.' });
    return;
  }

  const orderId = orderData.orderId || `BB-${Date.now().toString().slice(-6)}`;
  const newOrder = {
    ...orderData,
    orderId,
    status: orderData.status || 'Awaiting Payment',
    date: orderData.date || new Date().toISOString()
  };

  // Deduct inventory stock for purchased products
  for (const item of newOrder.items) {
    const prodId = item.product?.id;
    if (prodId) {
      const prodIndex = db.products.findIndex((p: any) => p.id === prodId);
      if (prodIndex !== -1) {
        db.products[prodIndex].stock = Math.max(0, db.products[prodIndex].stock - item.quantity);
      }
    }
  }

  db.orders.unshift(newOrder);

  // Add audit log
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Pesanan Baru',
    details: `Pesanan #${newOrder.orderId} diterima dari ${newOrder.customerName} (${newOrder.items.length} item).`,
    user: 'Storefront Checkout',
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const { id } = req.params;
  const index = db.orders.findIndex((o: any) => o.orderId === id);

  if (index === -1) {
    res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    return;
  }

  const updatedOrder = {
    ...db.orders[index],
    ...req.body,
    orderId: db.orders[index].orderId
  };

  db.orders[index] = updatedOrder;

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Update Pesanan',
    details: `Pesanan #${updatedOrder.orderId} status diubah ke "${updatedOrder.status}".`,
    user: (req as any).admin.name,
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.json(updatedOrder);
});

/* ==========================================================================
   INVENTORY MANAGEMENT & AUDIT LOGS
   ========================================================================== */

app.get('/api/inventory', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const inventoryItems = (db.products || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    image: p.image,
    stock: p.stock,
    price: p.price,
    status: p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock'
  }));
  res.json({
    items: inventoryItems,
    logs: db.auditLogs || []
  });
});

app.put('/api/inventory/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const { id } = req.params;
  const { stock, reason } = req.body;

  const prodIndex = db.products.findIndex((p: any) => p.id === id);
  if (prodIndex === -1) {
    res.status(404).json({ error: 'Produk tidak ditemukan.' });
    return;
  }

  const prevStock = db.products[prodIndex].stock;
  const newStock = Math.max(0, Number(stock));
  db.products[prodIndex].stock = newStock;

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Penyesuaian Stok',
    details: `Stok "${db.products[prodIndex].name}" diubah dari ${prevStock} ke ${newStock} unit. Alasan: ${reason || 'Penyesuaian manual'}.`,
    user: (req as any).admin.name,
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.json({
    product: db.products[prodIndex],
    message: 'Stok berhasil diperbarui.'
  });
});

/* ==========================================================================
   CUSTOMER MANAGEMENT (CRM)
   ========================================================================== */

app.get('/api/customers', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const customerMap: Record<string, any> = {};

  for (const order of db.orders || []) {
    const key = order.email || order.phone || order.customerName;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: order.customerName,
        email: order.email,
        phone: order.phone,
        city: order.city,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: order.date
      };
    }
    customerMap[key].totalOrders += 1;
    customerMap[key].totalSpent += order.total || 0;
    if (new Date(order.date) > new Date(customerMap[key].lastOrderDate)) {
      customerMap[key].lastOrderDate = order.date;
    }
  }

  res.json(Object.values(customerMap));
});

/* ==========================================================================
   PROMOTIONS & VOUCHERS
   ========================================================================== */

app.get('/api/promotions', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  res.json(db.promotions || []);
});

app.post('/api/promotions', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const { code, name, type, value, minSpend, maxUsage, expiryDate } = req.body;

  if (!code || !name || !value) {
    res.status(400).json({ error: 'Kode, nama, dan nilai diskon harus diisi.' });
    return;
  }

  const existing = db.promotions.find(
    (p: any) => p.code.toUpperCase() === code.toUpperCase().trim()
  );
  if (existing) {
    res.status(400).json({ error: `Kode voucher "${code.toUpperCase()}" sudah digunakan.` });
    return;
  }

  const newPromo = {
    id: `promo-${Date.now()}`,
    code: code.toUpperCase().trim(),
    name,
    type: type || 'percentage',
    value: Number(value),
    minSpend: Number(minSpend || 0),
    usageCount: 0,
    maxUsage: Number(maxUsage || 100),
    isActive: true,
    expiryDate: expiryDate || '2026-12-31'
  };

  db.promotions.push(newPromo);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Tambah Voucher',
    details: `Menambahkan kode voucher baru "${newPromo.code}".`,
    user: (req as any).admin.name,
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.status(201).json(newPromo);
});

app.put('/api/promotions/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const { id } = req.params;
  const index = db.promotions.findIndex((p: any) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Voucher tidak ditemukan.' });
    return;
  }

  db.promotions[index] = {
    ...db.promotions[index],
    ...req.body,
    id: db.promotions[index].id
  };

  writeDb(db);
  res.json(db.promotions[index]);
});

app.delete('/api/promotions/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  const { id } = req.params;
  const index = db.promotions.findIndex((p: any) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Voucher tidak ditemukan.' });
    return;
  }

  const removed = db.promotions.splice(index, 1)[0];
  writeDb(db);
  res.json({ success: true, message: `Voucher ${removed.code} dihapus.` });
});

// Public voucher validation for checkout
app.post('/api/promotions/validate', (req: Request, res: Response): void => {
  const { code, cartSubtotal } = req.body;
  if (!code) {
    res.status(400).json({ error: 'Kode voucher harus diisi.' });
    return;
  }

  const db = readDb();
  const promo = (db.promotions || []).find(
    (p: any) => p.code.toUpperCase() === code.toUpperCase().trim() && p.isActive
  );

  if (!promo) {
    res.status(404).json({ error: 'Kode voucher tidak valid atau sudah kedaluwarsa.' });
    return;
  }

  if (promo.minSpend && cartSubtotal < promo.minSpend) {
    res.status(400).json({
      error: `Voucher ini memerlukan minimal belanja Rp${promo.minSpend.toLocaleString('id-ID')}.`
    });
    return;
  }

  if (promo.usageCount >= promo.maxUsage) {
    res.status(400).json({ error: 'Kuota penggunaan voucher ini telah habis.' });
    return;
  }

  let discountAmount = 0;
  if (promo.type === 'percentage') {
    discountAmount = Math.round((cartSubtotal * promo.value) / 100);
  } else {
    discountAmount = promo.value;
  }

  res.json({
    valid: true,
    promo: {
      code: promo.code,
      name: promo.name,
      type: promo.type,
      discountAmount
    }
  });
});

/* ==========================================================================
   HOMEPAGE CONTENT & SETTINGS
   ========================================================================== */

app.get('/api/content', (req: Request, res: Response): void => {
  const db = readDb();
  res.json(db.homepageContent || {});
});

app.put('/api/content', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  db.homepageContent = {
    ...db.homepageContent,
    ...req.body
  };

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Edit Konten',
    details: 'Memperbarui konten teks & banner storefront homepage.',
    user: (req as any).admin.name,
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.json(db.homepageContent);
});

app.get('/api/settings', (req: Request, res: Response): void => {
  const db = readDb();
  res.json(db.storeSettings || {});
});

app.put('/api/settings', requireAdminAuth, (req: Request, res: Response): void => {
  const db = readDb();
  db.storeSettings = {
    ...db.storeSettings,
    ...req.body
  };

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Edit Pengaturan',
    details: 'Memperbarui informasi toko & konfigurasi operasional.',
    user: (req as any).admin.name,
    timestamp: new Date().toISOString()
  });

  writeDb(db);
  res.json(db.storeSettings);
});

/* ==========================================================================
   VITE SPA MIDDLEWARE / STATIC ASSETS
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🍓 Buttonberry Server is running on port ${PORT}`);
  });
}

startServer();
