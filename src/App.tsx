import React, { useEffect } from 'react';
import { AdminAuthProvider } from './context/AdminAuthContext.tsx';
import { ShopProvider, useShop } from './context/ShopContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { ToastContainer } from './components/Toast.tsx';

// Storefront Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderSuccessPage } from './pages/OrderSuccessPage.tsx';
import { WishlistPage } from './pages/WishlistPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';

// Admin Control Panel
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';

const AppContent: React.FC = () => {
  const { activePage, setActivePage } = useShop();

  // Listen to hash changes for deep linking (e.g., #admin, #cart, #shop)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setActivePage('admin');
      } else if (hash === 'cart') {
        setActivePage('cart');
      } else if (hash === 'wishlist') {
        setActivePage('wishlist');
      } else if (hash === 'shop') {
        setActivePage('shop');
      } else if (hash === 'about') {
        setActivePage('about');
      } else if (hash === 'contact') {
        setActivePage('contact');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setActivePage]);

  // If in admin mode, display Admin Control Panel full-screen
  if (activePage === 'admin' || activePage === 'admin-login') {
    return (
      <div className="min-h-screen bg-[#FFF8EC] text-[#60463E] font-sans antialiased selection:bg-[#E99AA8]/30 selection:text-[#B94B50]">
        <AdminDashboardPage />
        <ToastContainer />
      </div>
    );
  }

  // Customer Storefront Routing
  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8EC] text-[#60463E] font-sans antialiased selection:bg-[#E99AA8]/30 selection:text-[#B94B50]">
      <Navbar />
      <main className="flex-1">{renderCurrentPage()}</main>
      <Footer />
      <BottomNav />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AdminAuthProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </AdminAuthProvider>
  );
}
