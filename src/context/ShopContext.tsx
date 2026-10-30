import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, PRODUCTS as DEFAULT_PRODUCTS, ShippingOption, SHIPPING_OPTIONS } from '../data/products.ts';

export type ActivePage =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'wishlist'
  | 'about'
  | 'contact'
  | 'admin-login'
  | 'admin';

export type AdminView =
  | 'overview'
  | 'products'
  | 'orders'
  | 'inventory'
  | 'customers'
  | 'promotions'
  | 'homepage'
  | 'settings';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  shippingOption: ShippingOption;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
  status?: string;
  trackingNumber?: string;
  date: string;
}

export interface AppliedVoucher {
  code: string;
  name: string;
  discountAmount: number;
  type: string;
}

export interface HomepageContent {
  announcementBar: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroImage: string;
  promoBannerTitle: string;
  promoBannerHeading: string;
  promoBannerText: string;
  brandIntroTitle: string;
  brandIntroDescription: string;
  newsletterHeading: string;
  newsletterDescription: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  storeDescription: string;
  contactEmail: string;
  whatsappNumber: string;
  instagramUrl: string;
  tiktokUrl: string;
  storeAddress: string;
  currency: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  storeAvailability: string;
}

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'favorite';
}

interface ShopContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  adminView: AdminView;
  setAdminView: (view: AdminView) => void;
  selectedProductId: string | null;
  openProductDetail: (productId: string) => void;
  
  // Products
  products: Product[];
  refreshProducts: () => Promise<void>;
  isLoadingProducts: boolean;

  // Content & Settings
  homepageContent: HomepageContent;
  refreshContent: () => Promise<void>;
  storeSettings: StoreSettings;
  refreshSettings: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, selectedColor?: string, quantity?: number) => void;
  updateQuantity: (productId: string, selectedColor: string, delta: number) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  // Shipping & Checkout
  selectedShipping: ShippingOption;
  setSelectedShipping: (option: ShippingOption) => void;
  appliedVoucher: AppliedVoucher | null;
  applyVoucher: (code: string) => Promise<{ success: boolean; message: string }>;
  removeVoucher: () => void;
  lastOrder: OrderDetails | null;
  placeOrder: (order: OrderDetails) => Promise<void>;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Toasts
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'favorite') => void;
  removeToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<ActivePage>('home');
  const [adminView, setAdminView] = useState<AdminView>('overview');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Live products loaded from unified backend
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Dynamic Homepage Content
  const [homepageContent, setHomepageContent] = useState<HomepageContent>({
    announcementBar: 'Little treasures, made for everyday adventures. · Gratis ongkir untuk pesanan di atas Rp250.000',
    heroHeadline: 'Small Things, Big Whimsy.',
    heroSubtitle: 'Aksesori kecil untuk menemani hari-harimu yang penuh cerita. Dibuat dengan motif gingham, kancing vintage, dan sentuhan cinta.',
    heroImage: '/src/assets/images/hero_buttonberry_collection_1793250120557.jpg',
    promoBannerTitle: 'Collect Little Joys',
    promoBannerHeading: 'Temukan aksesori yang terasa seperti kamu.',
    promoBannerText: 'Setiap potongan dirancang untuk tahan lama, praktis, dan memberi warna manis pada outfit harianmu.',
    brandIntroTitle: 'A Little World of Lovely Things.',
    brandIntroDescription: 'Di Buttonberry, kami percaya bahwa benda sehari-hari juga bisa punya cerita. Dari tas untuk menemani petualangan hingga gantungan kecil yang membuatmu tersenyum, setiap detail dirancang agar fungsional sekaligus penuh karakter.',
    newsletterHeading: 'Letters from Buttonberry',
    newsletterDescription: 'Dapatkan kabar koleksi terbaru, cerita kecil dari meja pengrajin, dan kejutan manis diskon pembuka.'
  });

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
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
  });

  const refreshProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (err) {
      console.warn('Backend /api/products unreachable, using cached catalog', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setHomepageContent(data);
      }
    } catch (err) {
      console.warn('Backend /api/content unreachable', err);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setStoreSettings(data);
      }
    } catch (err) {
      console.warn('Backend /api/settings unreachable', err);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    refreshProducts();
    refreshContent();
    refreshSettings();
  }, [refreshProducts, refreshContent, refreshSettings]);

  // LocalStorage initialization for Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('buttonberry_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage initialization for Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('buttonberry_wishlist');
      return saved ? JSON.parse(saved) : ['bb-01', 'bb-06'];
    } catch {
      return ['bb-01', 'bb-06'];
    }
  });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('buttonberry_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('buttonberry_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const setActivePage = (page: ActivePage) => {
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setActivePageState('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'favorite' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, selectedColor?: string, quantity = 1) => {
    const color = selectedColor || product.colors[0]?.name || 'Standard';
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        return [...prev, { product, selectedColor: color, quantity }];
      }
    });
    showToast(`"${product.name}" ditambahkan ke keranjang belanja!`, 'success');
  };

  const updateQuantity = (productId: string, selectedColor: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedColor === selectedColor) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string, selectedColor: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === selectedColor)
      )
    );
    showToast('Produk dihapus dari keranjang', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
  };

  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast(`"${product?.name || 'Produk'}" dihapus dari wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`"${product?.name || 'Produk'}" disimpan ke wishlist!`, 'favorite');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const applyVoucher = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Voucher tidak valid.' };
      }

      setAppliedVoucher({
        code: data.promo.code,
        name: data.promo.name,
        discountAmount: data.promo.discountAmount,
        type: data.promo.type
      });
      showToast(`Voucher ${data.promo.code} berhasil diterapkan!`, 'success');
      return { success: true, message: `Diskon Rp${data.promo.discountAmount.toLocaleString('id-ID')} aktif` };
    } catch (err: any) {
      return { success: false, message: 'Gagal memvalidasi voucher: ' + err.message };
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('Voucher dihapus', 'info');
  };

  const placeOrder = async (order: OrderDetails) => {
    try {
      // Send to server to sync database and update stock
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (res.ok) {
        const createdOrder = await res.json();
        setLastOrder(createdOrder);
      } else {
        setLastOrder(order);
      }
    } catch (err) {
      console.warn('Backend order save failed, keeping in local memory', err);
      setLastOrder(order);
    } finally {
      // Refresh products to reflect deducted stock
      refreshProducts();
      clearCart();
      setActivePage('order-success');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        activePage,
        setActivePage,
        adminView,
        setAdminView,
        selectedProductId,
        openProductDetail,
        products,
        refreshProducts,
        isLoadingProducts,
        homepageContent,
        refreshContent,
        storeSettings,
        refreshSettings,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        selectedShipping,
        setSelectedShipping,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        lastOrder,
        placeOrder,
        wishlist,
        toggleWishlist,
        isWishlisted,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
