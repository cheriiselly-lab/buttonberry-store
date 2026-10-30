export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'Tote Bags' | 'Sling Bags' | 'Card Holders' | 'Pouches' | 'Bag Straps' | 'Keychains';
  price: number;
  originalPrice?: number;
  colors: ProductColor[];
  description: string;
  story: string;
  image: string;
  gallery: string[];
  tag?: 'Bestseller' | 'New' | 'Little Favorite' | 'Handmade Delight';
  dimensions: string;
  material: string;
  stock: number;
  isBestseller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  careInstructions: string[];
}

export interface CategoryInfo {
  id: string;
  name: 'Tote Bags' | 'Sling Bags' | 'Card Holders' | 'Pouches' | 'Bag Straps' | 'Keychains';
  description: string;
  tagline: string;
  image: string;
  itemCount: number;
}

export const PRODUCTS: Product[] = [
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
    isBestseller: true,
    isNew: false,
    rating: 5.0,
    reviewCount: 42,
    careInstructions: [
      'Bersihkan noda permukaan dengan kain microfiber basah yang lembut',
      'Simpan dalam dustbag saat tidak digunakan',
      'Jauhkan dari sinar matahari terik langsung dalam waktu lama'
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
      '/images/product-cherry-card-holder.jpg',
      '/images/hero-buttonberry-collection.jpg'
    ],
    tag: 'Bestseller',
    dimensions: '10.2 cm × 7.5 cm × 0.4 cm',
    material: 'Supple Pebble Vegan Leather, Raised Embroidery Patch, RFID-Shielded Core',
    stock: 22,
    isBestseller: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 56,
    careInstructions: [
      'Lap lembut dengan kain kering',
      'Hindari menekuk secara berlebihan agar slot kartu tetap presisi'
    ]
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
      '/images/product-sunday-notes-pouch.jpg',
      '/images/product-butter-coin-purse.jpg'
    ],
    tag: 'New',
    dimensions: '18 cm × 12 cm × 6 cm',
    material: 'Natural Cotton Duck Canvas, Embroidered Scallop Edge, YKK Vintage Gold Zipper',
    stock: 19,
    isBestseller: false,
    isNew: true,
    rating: 4.9,
    reviewCount: 19,
    careInstructions: [
      'Cuci lembut dengan deterjen cair bebas pemutih',
      'Keringkan mendatar (flat dry)'
    ]
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
      '/images/product-berry-loop-strap.jpg',
      '/images/product-little-daydream-sling.jpg'
    ],
    tag: 'Little Favorite',
    dimensions: 'Lebar 4 cm, Panjang dapat diatur 80 - 135 cm',
    material: 'Jacquard High-Density Weave, Antique Brass Swivel Snap Hooks',
    stock: 16,
    isBestseller: false,
    isNew: true,
    rating: 4.7,
    reviewCount: 24,
    careInstructions: [
      'Bersihkan spot kotor dengan sikat gigi halus berbusa',
      'Bilas dan angin-anginkan hingga kering sempurna'
    ]
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
      '/images/product-tiny-treasure-keychain.jpg',
      '/images/hero-buttonberry-collection.jpg'
    ],
    tag: 'Bestseller',
    dimensions: 'Panjang total 8.5 cm (Ring diameter 3 cm)',
    material: 'Hard Enamel, Natural Hardwood Button, Antique Brass Ring & Charms',
    stock: 35,
    isBestseller: true,
    isNew: false,
    rating: 5.0,
    reviewCount: 67,
    careInstructions: [
      'Hindari terkena parfum atau cairan kimia keras secara langsung',
      'Gosok perlahan dengan kain kacamata untuk mengembalikan kilau kuningan'
    ]
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
      '/images/product-butter-coin-purse.jpg',
      '/images/hero-buttonberry-collection.jpg'
    ],
    tag: 'Handmade Delight',
    dimensions: '11 cm × 9.5 cm × 4.5 cm',
    material: 'Soft Calf-grain Vegan Leather, Embossed Antique Brass Kiss-Lock, Daisy Silk Embroidery',
    stock: 11,
    isBestseller: false,
    isNew: true,
    rating: 4.9,
    reviewCount: 15,
    careInstructions: [
      'Hindari benturan keras pada bingkai kiss-lock',
      'Lapisi dengan dustbag katun saat disimpan di dalam tas'
    ]
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
      '/images/product-ribbon-bag-tie.jpg',
      '/images/hero-buttonberry-collection.jpg'
    ],
    tag: 'New',
    dimensions: 'Panjang pita 14 cm, Lebar 2.5 cm',
    material: 'Hand-woven Cotton Gingham Ribbon, Linen Padded Charm, Brass Crocodile Clip',
    stock: 25,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewCount: 18,
    careInstructions: [
      'Bisa disetrika dengan alas kain pelindung pada suhu rendah'
    ]
  }
];

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'cat-1',
    name: 'Tote Bags',
    description: 'Tas jinjing bermotif gingham & aksen kancing kayu yang luas dan kuat.',
    tagline: 'Ruang luas untuk segala hal manis',
    image: '/images/product-strawberry-picnic-tote.jpg',
    itemCount: 1
  },
  {
    id: 'cat-2',
    name: 'Sling Bags',
    description: 'Tas selempang praktis bersiluet vintage modern untuk petualangan harian.',
    tagline: 'Ringan menemani langkah ceritamu',
    image: '/images/product-little-daydream-sling.jpg',
    itemCount: 1
  },
  {
    id: 'cat-3',
    name: 'Card Holders',
    description: 'Tempat kartu ramping berdetail patch cherry yang mudah diselipkan.',
    tagline: 'Kecil, rapi, dan selalu siap',
    image: '/images/product-cherry-card-holder.jpg',
    itemCount: 1
  },
  {
    id: 'cat-4',
    name: 'Pouches',
    description: 'Kantong serbaguna berdetail scallop vintage untuk barang-barang esensial.',
    tagline: 'Merawat rahasia kecilmu dengan manis',
    image: '/images/product-sunday-notes-pouch.jpg',
    itemCount: 2
  },
  {
    id: 'cat-5',
    name: 'Bag Straps',
    description: 'Tali tas bermotif jacquard dan pita klip untuk menyegarkan gaya tasmu.',
    tagline: 'Beri karakter baru pada tas favoritmu',
    image: '/images/product-berry-loop-strap.jpg',
    itemCount: 2
  },
  {
    id: 'cat-6',
    name: 'Keychains',
    description: 'Gantungan kunci enamel strawberry, liontin kancing, dan kuningan antik.',
    tagline: 'Secuil senyum di ujung jemarimu',
    image: '/images/product-tiny-treasure-keychain.jpg',
    itemCount: 1
  }
];

export interface CartItem {
  product: Product;
  selectedColor: string;
  quantity: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  courier: string;
  estimate: string;
  cost: number;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'ship-regular',
    name: 'Standard Berry Express',
    courier: 'J&T / SiCepat',
    estimate: '2-3 hari kerja',
    cost: 15000
  },
  {
    id: 'ship-fast',
    name: 'Quick Strawberry Courier',
    courier: 'JNE YES / Paxel',
    estimate: '1 hari sampai',
    cost: 28000
  },
  {
    id: 'ship-pickup',
    name: 'Free Studio Pickup',
    courier: 'Ambil di Studio Buttonberry (Bandung)',
    estimate: 'Ready dalam 24 jam',
    cost: 0
  }
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Produk' | 'Pemesanan' | 'Pengiriman' | 'Pembayaran' | 'Pengembalian';
}

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Produk',
    question: 'Apakah produk Buttonberry buatan tangan (handmade)?',
    answer: 'Ya, sebagian besar aksesoris kami diproduksi secara terbatas melalui kolaborasi bersama penjahit dan perajin lokal di Indonesia.'
  },
  {
    id: 'faq-2',
    category: 'Produk',
    question: 'Bahan apa yang digunakan untuk tas Buttonberry?',
    answer: 'Kami mengutamakan bahan kain katun linen premium, kanvas bertekstur, serta kulit sintetis ramah lingkungan (cruelty-free vegan leather).'
  },
  {
    id: 'faq-3',
    category: 'Pemesanan',
    question: 'Bagaimana cara memesan produk di Buttonberry?',
    answer: 'Pilih produk yang kamu sukai di katalog Shop, tentukan warna pilihan, lalu klik "Tambah ke Keranjang" (Add to Bag).'
  },
  {
    id: 'faq-4',
    category: 'Pengiriman',
    question: 'Berapa lama estimasi pengiriman dan dari mana dikirim?',
    answer: 'Semua pesanan dikemas rapi dari studio kami di Bandung. Pengiriman memakan waktu 1–3 hari kerja untuk Pulau Jawa dan 3–5 hari kerja untuk luar Pulau Jawa.'
  },
  {
    id: 'faq-5',
    category: 'Pembayaran',
    question: 'Metode pembayaran apa saja yang didukung?',
    answer: 'Kami mendukung QRIS instan (GoPay, OVO, Dana, ShopeePay), Transfer Bank BCA / Mandiri, serta Cash on Delivery (COD).'
  },
  {
    id: 'faq-6',
    category: 'Pengembalian',
    question: 'Bagaimana kebijakan retur jika barang yang diterima cacat?',
    answer: 'Jika produk memiliki cacat produksi atau kesalahan kirim varian, silakan hubungi kami dalam 3 hari setelah paket diterima beserta video unboxing.'
  }
];

export const DEMO_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Clara Anindita',
    city: 'Jakarta Selatan',
    item: 'Strawberry Picnic Tote',
    comment: 'Tote bag-nya manis banget! Kain linen tebal dan kancing kayunya punya detail yang sangat rapi. Muat laptop 13 inch dan botol minum dengan nyaman.',
    rating: 5,
    date: '24 Oktober 2026',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Nabila Putri',
    city: 'Bandung',
    item: 'Little Daydream Sling',
    comment: 'Warnanya sage green lembut sesuai ekspektasi. Gesper kuningan antiknya bikin look jadi vintage dan nggak pasaran. Pas banget buat jalan akhir pekan!',
    rating: 5,
    date: '19 Oktober 2026',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Tiara Maharani',
    city: 'Yogyakarta',
    item: 'Cherry Patch Card Holder',
    comment: 'Packagingnya cantik seperti kado, ada pita dan stempel lilin. Card holdernya compact dan slot kartunya pas di kantong celana maupun tas kecil.',
    rating: 5,
    date: '12 Oktober 2026',
    verified: true
  }
];
