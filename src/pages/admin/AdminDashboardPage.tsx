import React, { useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useShop } from '../../context/ShopContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { AdminOverviewPage } from './AdminOverviewPage.tsx';
import { AdminProductsPage } from './AdminProductsPage.tsx';
import { AdminOrdersPage } from './AdminOrdersPage.tsx';
import { AdminInventoryPage } from './AdminInventoryPage.tsx';
import { AdminCustomersPage } from './AdminCustomersPage.tsx';
import { AdminPromotionsPage } from './AdminPromotionsPage.tsx';
import { AdminHomepageEditorPage } from './AdminHomepageEditorPage.tsx';
import { AdminStoreSettingsPage } from './AdminStoreSettingsPage.tsx';
import { AdminLoginPage } from './AdminLoginPage.tsx';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { adminView } = useShop();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8EC]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm border border-[#E99AA8]/30 animate-bounce">
            🍓
          </div>
          <p className="font-serif text-sm font-semibold text-[#60463E]">
            Memuat Buttonberry Control Panel...
          </p>
        </div>
      </div>
    );
  }

  // Route protection: If unauthenticated, render login view
  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  const renderCurrentView = () => {
    switch (adminView) {
      case 'overview':
        return <AdminOverviewPage />;
      case 'products':
        return <AdminProductsPage />;
      case 'orders':
        return <AdminOrdersPage />;
      case 'inventory':
        return <AdminInventoryPage />;
      case 'customers':
        return <AdminCustomersPage />;
      case 'promotions':
        return <AdminPromotionsPage />;
      case 'homepage':
        return <AdminHomepageEditorPage />;
      case 'settings':
        return <AdminStoreSettingsPage />;
      default:
        return <AdminOverviewPage />;
    }
  };

  return <AdminLayout>{renderCurrentView()}</AdminLayout>;
};
