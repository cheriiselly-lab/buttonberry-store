import React from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { Heart, Instagram, Mail, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, setSelectedCategory } = useShop();

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setActivePage('shop');
  };

  return (
    <footer className="bg-[#60463E] text-[#FFF8EC] pt-14 pb-24 md:pb-14 border-t border-[#60463E]/30 relative overflow-hidden">
      {/* Whimsical decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#E99AA8]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand Identity & Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍓</span>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FFF8EC]">
                Buttonberry
              </span>
            </div>
            
            <p className="text-xs text-[#E99AA8] font-semibold uppercase tracking-widest">
              Functional Fashion Accessories · Est. 2024
            </p>

            <p className="text-sm text-[#FFF8EC]/80 leading-relaxed max-w-md">
              Buttonberry is a little world of lovely things. Kami menciptakan aksesoris fungsional
              yang whimsical dan menggemaskan untuk menemani hari-harimu dengan penuh cerita manis.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#FFF8EC]/10 hover:bg-[#E99AA8] hover:text-[#60463E] flex items-center justify-center transition-colors"
                aria-label="Instagram Buttonberry"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#FFF8EC]/10 hover:bg-[#E99AA8] hover:text-[#60463E] flex items-center justify-center transition-colors"
                aria-label="TikTok Buttonberry"
              >
                <span className="font-bold text-xs">TT</span>
              </a>
              <button
                onClick={() => setActivePage('contact')}
                className="w-9 h-9 rounded-full bg-[#FFF8EC]/10 hover:bg-[#E99AA8] hover:text-[#60463E] flex items-center justify-center transition-colors"
                aria-label="Email Studio"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#F6E7A6]">
              Koleksi Produk
            </h4>
            <ul className="space-y-2 text-sm text-[#FFF8EC]/75">
              <li>
                <button
                  onClick={() => handleCategoryClick('Tote Bags')}
                  className="hover:text-[#FFF8EC] transition-colors"
                >
                  Tote Bags
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Sling Bags')}
                  className="hover:text-[#FFF8EC] transition-colors"
                >
                  Sling Bags
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Card Holders')}
                  className="hover:text-[#FFF8EC] transition-colors"
                >
                  Card Holders
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Pouches')}
                  className="hover:text-[#FFF8EC] transition-colors"
                >
                  Pouches & Coin Purses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Bag Straps')}
                  className="hover:text-[#FFF8EC] transition-colors"
                >
                  Bag Straps & Ribbons
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Keychains')}
                  className="hover:text-[#FFF8EC] transition-colors"
                >
                  Keychains & Trinkets
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care & Info */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#F6E7A6]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-[#FFF8EC]/75">
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="hover:text-[#FFF8EC] transition-colors"
                >
                  Cerita Brand Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-[#FFF8EC] transition-colors"
                >
                  Pertanyaan Populer (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-[#FFF8EC] transition-colors"
                >
                  Pengiriman & Pengembalian
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-[#FFF8EC] transition-colors"
                >
                  Hubungi Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('admin')}
                  className="hover:text-[#F6E7A6] text-[#E99AA8] transition-colors flex items-center gap-1 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Control Panel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Studio Note & Stamp */}
          <div className="space-y-3 bg-[#FFF8EC]/5 p-4 rounded-2xl border border-[#FFF8EC]/10">
            <div className="flex items-center gap-1.5 text-xs text-[#F6E7A6] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#E99AA8]" />
              <span>Buttonberry Studio</span>
            </div>
            <p className="text-xs text-[#FFF8EC]/80 leading-relaxed">
              Jalan Ciumbuleuit No. 42, Kota Bandung, Jawa Barat.
              Setiap pesanan dibungkus dengan pita manis dan wangi lavender.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#A8B69A]">
              <Sparkles className="w-3 h-3" />
              <span>Dibuat dengan cinta & kebahagiaan kecil</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#FFF8EC]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF8EC]/60">
          <p>© {new Date().getFullYear()} Buttonberry. All rights reserved. "Little Things, Lovely Days."</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#FFF8EC]/80">
              Handmade & Whimsical Craft <Heart className="w-3 h-3 text-[#E99AA8] fill-[#E99AA8]" />
            </span>
            <span>·</span>
            <span>Functional Fashion Accessories</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
