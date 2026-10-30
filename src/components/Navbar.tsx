import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    homepageContent
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (page: any) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePage('shop');
    setSearchOpen(false);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#E99AA8] text-[#FFF8EC] text-xs py-2 px-4 text-center font-medium tracking-wide">
        <p className="flex items-center justify-center gap-2">
          <span>{homepageContent?.announcementBar || 'Little treasures, made for everyday adventures.'}</span>
        </p>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#FFF8EC]/95 backdrop-blur-md border-b border-[#E99AA8]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            
            {/* Left: Mobile Menu Trigger + Brand Wordmark */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 -ml-2 text-[#60463E] hover:text-[#B94B50] rounded-lg transition-colors focus:outline-none"
                aria-label="Buka menu navigasi"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2 group text-left focus:outline-none"
              >
                <span className="w-8 h-8 rounded-full bg-[#E99AA8]/25 flex items-center justify-center text-[#B94B50] group-hover:scale-105 transition-transform">
                  🍓
                </span>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#60463E]">
                    Buttonberry
                  </span>
                  <span className="hidden xs:block text-[10px] font-medium tracking-widest text-[#B94B50] uppercase -mt-1">
                    Little Things, Lovely Days
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#60463E]">
              <button
                onClick={() => handleNavClick('home')}
                className={`py-1 transition-colors hover:text-[#B94B50] whitespace-nowrap ${
                  activePage === 'home' ? 'text-[#B94B50] border-b-2 border-[#B94B50] font-semibold' : ''
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => handleNavClick('shop')}
                className={`py-1 transition-colors hover:text-[#B94B50] whitespace-nowrap ${
                  activePage === 'shop' ? 'text-[#B94B50] border-b-2 border-[#B94B50] font-semibold' : ''
                }`}
              >
                Koleksi Produk
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`py-1 transition-colors hover:text-[#B94B50] whitespace-nowrap ${
                  activePage === 'about' ? 'text-[#B94B50] border-b-2 border-[#B94B50] font-semibold' : ''
                }`}
              >
                Cerita Kami
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`py-1 transition-colors hover:text-[#B94B50] whitespace-nowrap ${
                  activePage === 'contact' ? 'text-[#B94B50] border-b-2 border-[#B94B50] font-semibold' : ''
                }`}
              >
                FAQ & Kontak
              </button>
            </nav>

            {/* Right: Actions (Search, Wishlist, Bag, Admin) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#60463E] hover:text-[#B94B50] rounded-full hover:bg-[#F6E7A6]/30 transition-colors"
                aria-label="Cari produk"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleNavClick('wishlist')}
                className="relative p-2 text-[#60463E] hover:text-[#B94B50] rounded-full hover:bg-[#F6E7A6]/30 transition-colors"
                aria-label="Daftar keinginan"
              >
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#B94B50]' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B94B50] text-[#FFF8EC] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('cart')}
                className="relative p-2 text-[#60463E] hover:text-[#B94B50] rounded-full hover:bg-[#F6E7A6]/30 transition-colors"
                aria-label="Keranjang belanja"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B94B50] text-[#FFF8EC] text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Entry Button */}
              <button
                onClick={() => handleNavClick('admin')}
                className="p-2 text-[#60463E]/75 hover:text-[#B94B50] rounded-full hover:bg-[#F6E7A6]/30 transition-colors"
                title="Buka Admin Control Panel"
                aria-label="Admin Control Panel"
              >
                <ShieldCheck className="w-5 h-5 text-[#B94B50]" />
              </button>

              <button
                onClick={() => handleNavClick('shop')}
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FFF8EC] bg-[#B94B50] hover:bg-[#a03d42] rounded-full shadow-sm transition-all"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Collapsible Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#E99AA8]/20 bg-[#FFF8EC] p-3 shadow-inner">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60463E]/50" />
                <input
                  type="text"
                  placeholder="Cari tote bag, keychain, card holder, strap..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#E99AA8]/40 rounded-full focus:outline-none focus:border-[#B94B50] text-[#60463E] placeholder-[#60463E]/40"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-[#FFF8EC] bg-[#B94B50] rounded-full hover:bg-[#a03d42] transition-colors"
              >
                Cari
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-[#60463E]/60 hover:text-[#60463E]"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E99AA8]/20 bg-[#FFF8EC] px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                  activePage === 'home' ? 'bg-[#E99AA8]/20 text-[#B94B50] font-semibold' : 'text-[#60463E]'
                }`}
              >
                <span>Beranda (Home)</span>
                <span>🍓</span>
              </button>

              <button
                onClick={() => handleNavClick('shop')}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                  activePage === 'shop' ? 'bg-[#E99AA8]/20 text-[#B94B50] font-semibold' : 'text-[#60463E]'
                }`}
              >
                <span>Koleksi Produk (Shop)</span>
                <span className="text-xs bg-[#F6E7A6] px-2 py-0.5 rounded-full text-[#60463E]">Semua</span>
              </button>

              <button
                onClick={() => handleNavClick('wishlist')}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                  activePage === 'wishlist' ? 'bg-[#E99AA8]/20 text-[#B94B50] font-semibold' : 'text-[#60463E]'
                }`}
              >
                <span>Wishlist Saya</span>
                {wishlist.length > 0 && (
                  <span className="text-xs bg-[#B94B50] text-white px-2 py-0.5 rounded-full">
                    {wishlist.length} item
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('about')}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                  activePage === 'about' ? 'bg-[#E99AA8]/20 text-[#B94B50] font-semibold' : 'text-[#60463E]'
                }`}
              >
                <span>Cerita Kami (Our Story)</span>
                <span>🧵</span>
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                  activePage === 'contact' ? 'bg-[#E99AA8]/20 text-[#B94B50] font-semibold' : 'text-[#60463E]'
                }`}
              >
                <span>FAQ & Hubungi Kami</span>
                <span>💌</span>
              </button>

              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between text-[#B94B50] bg-[#FFF8EC] border border-[#E99AA8]/30"
              >
                <span className="font-semibold">Admin Control Panel</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 border-t border-[#E99AA8]/20">
              <button
                onClick={() => handleNavClick('cart')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#B94B50] text-[#FFF8EC] rounded-xl text-sm font-semibold shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Lihat Keranjang Belanja ({cartCount})</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
