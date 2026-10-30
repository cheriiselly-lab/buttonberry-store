import React from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { Home, Grid, Heart, ShoppingBag } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage, cartCount, wishlist } = useShop();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      page: 'home' as const,
      badge: 0
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: Grid,
      page: 'shop' as const,
      badge: 0
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      page: 'wishlist' as const,
      badge: wishlist.length
    },
    {
      id: 'cart',
      label: 'Bag',
      icon: ShoppingBag,
      page: 'cart' as const,
      badge: cartCount
    }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF8EC]/95 backdrop-blur-md border-t border-[#E99AA8]/30 shadow-[0_-4px_12px_rgba(96,70,62,0.06)] pb-safe"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center px-1">
        {navItems.map((item) => {
          const isActive =
            activePage === item.page ||
            (item.page === 'shop' && activePage === 'product-detail');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.page)}
              className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
                isActive ? 'text-[#B94B50]' : 'text-[#60463E]/70 hover:text-[#60463E]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#B94B50] text-[#FFF8EC] text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 font-medium tracking-tight ${
                  isActive ? 'font-bold text-[#B94B50]' : 'text-[#60463E]/75'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
