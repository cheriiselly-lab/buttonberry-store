import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useShop, AdminView } from '../../context/ShopContext.tsx';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Boxes,
  Users,
  TicketPercent,
  Palette,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminUser, logout } = useAdminAuth();
  const { adminView, setAdminView, setActivePage, showToast } = useShop();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems: { id: AdminView; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Ringkasan (Overview)', icon: LayoutDashboard },
    { id: 'products', label: 'Katalog Produk', icon: ShoppingBag },
    { id: 'orders', label: 'Pesanan Pelanggan', icon: ClipboardList },
    { id: 'inventory', label: 'Manajemen Stok', icon: Boxes },
    { id: 'customers', label: 'Data Pelanggan', icon: Users },
    { id: 'promotions', label: 'Diskon & Promo', icon: TicketPercent },
    { id: 'homepage', label: 'Editor Homepage', icon: Palette },
    { id: 'settings', label: 'Pengaturan Toko', icon: Settings }
  ];

  const handleMenuSelect = (view: AdminView) => {
    setAdminView(view);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    showToast('Berhasil logout dari Control Panel', 'info');
    setActivePage('admin-login');
  };

  const currentMenuLabel = menuItems.find((m) => m.id === adminView)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#FFF8EC] flex flex-col md:flex-row text-[#60463E]">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E99AA8]/30 shrink-0">
        
        {/* Brand Lockup */}
        <div className="p-5 border-b border-[#E99AA8]/20 flex items-center justify-between">
          <button
            onClick={() => handleMenuSelect('overview')}
            className="flex items-center gap-2.5 text-left"
          >
            <span className="w-8 h-8 rounded-xl bg-[#FFF8EC] text-[#B94B50] flex items-center justify-center text-lg border border-[#E99AA8]/40 shadow-2xs">
              🍓
            </span>
            <div>
              <span className="font-serif font-bold text-base text-[#60463E] block leading-tight">
                Buttonberry
              </span>
              <span className="text-[10px] font-semibold text-[#B94B50] uppercase tracking-wider block">
                Control Panel
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#B94B50] text-[#FFF8EC] shadow-xs'
                    : 'text-[#60463E]/80 hover:bg-[#FFF8EC] hover:text-[#60463E]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#60463E]/60'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Storefront Switcher & Admin Footer Info */}
        <div className="p-4 border-t border-[#E99AA8]/20 space-y-3 bg-[#FFF8EC]/30">
          <button
            onClick={() => setActivePage('home')}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#E99AA8]/40 bg-white hover:bg-[#FFF8EC] text-xs font-semibold text-[#60463E] transition-colors"
          >
            <span>Lihat Toko (Storefront)</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B94B50]" />
          </button>

          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="min-w-0">
              <p className="font-semibold text-[#60463E] truncate">{adminUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-[#A8B69A] font-medium capitalize">
                ● {adminUser?.role?.replace('_', ' ') || 'Super Admin'}
              </p>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-1.5 text-[#60463E]/60 hover:text-[#B94B50] rounded-lg transition-colors"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* 2. Mobile Drawer for Android Screen (360 - 430px) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col z-10 shadow-2xl">
            <div className="p-4 border-b border-[#E99AA8]/20 flex items-center justify-between bg-[#FFF8EC]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍓</span>
                <div>
                  <span className="font-serif font-bold text-sm text-[#60463E] block">
                    Buttonberry Admin
                  </span>
                  <span className="text-[10px] text-[#B94B50] font-semibold uppercase">
                    Control Panel
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-[#60463E]/70 hover:text-[#60463E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = adminView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#B94B50] text-[#FFF8EC] shadow-xs'
                        : 'text-[#60463E]/80 hover:bg-[#FFF8EC]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#E99AA8]/20 space-y-2 bg-[#FFF8EC]/30">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setActivePage('home');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#E99AA8]/40 bg-white text-xs font-semibold text-[#60463E]"
              >
                <span>Buka Tampilan Pelanggan</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#B94B50]" />
              </button>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[#B94B50] hover:bg-red-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header & Breadcrumbs */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E99AA8]/25 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-[#60463E] hover:text-[#B94B50] rounded-lg"
              aria-label="Buka menu admin"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => handleMenuSelect('overview')}
                className="text-[#60463E]/60 hover:text-[#B94B50] font-medium"
              >
                Control Panel
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#60463E]/40" />
              <span className="font-bold text-[#60463E]">{currentMenuLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActivePage('home')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#60463E] hover:text-[#B94B50] py-1.5 px-3 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]"
            >
              <span>Preview Toko</span>
              <ExternalLink className="w-3 h-3 text-[#B94B50]" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-[#E99AA8]/20">
              <div className="w-7 h-7 rounded-full bg-[#E99AA8]/20 text-[#B94B50] flex items-center justify-center text-xs font-bold font-serif">
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-xs font-semibold text-[#60463E] hidden md:inline">
                {adminUser?.name || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          {children}
        </main>

      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E99AA8]/40 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-red-50 text-[#B94B50] rounded-full flex items-center justify-center mx-auto text-xl">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#60463E]">
                Konfirmasi Keluar
              </h3>
              <p className="text-xs text-[#60463E]/70">
                Apakah kamu yakin ingin keluar dari sesi administrator Buttonberry?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#60463E]/20 text-xs font-semibold text-[#60463E] hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#B94B50] hover:bg-[#a03d42] text-white text-xs font-semibold shadow-xs"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
