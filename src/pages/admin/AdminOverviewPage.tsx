import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useShop } from '../../context/ShopContext.tsx';
import {
  DollarSign,
  ShoppingBag,
  PackageCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
  Boxes,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const { token } = useAdminAuth();
  const { setAdminView, refreshProducts } = useShop();

  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'month' | 'all'>('all');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/dashboard/stats?period=${period}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period, token]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price || 0).replace(/\s/, '');
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
            Ringkasan Toko (Overview)
          </h1>
          <p className="text-xs text-[#60463E]/70 mt-1">
            Pantau performa penjualan, pesanan masuk, dan kesehatan inventaris Buttonberry.
          </p>
        </div>

        {/* Period Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#E99AA8]/30 overflow-x-auto scrollbar-none">
          {[
            { id: 'today', label: 'Hari Ini' },
            { id: '7days', label: '7 Hari' },
            { id: '30days', label: '30 Hari' },
            { id: 'month', label: 'Bulan Ini' },
            { id: 'all', label: 'Semua' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                period === p.id
                  ? 'bg-[#B94B50] text-[#FFF8EC] shadow-2xs'
                  : 'text-[#60463E]/70 hover:text-[#60463E]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E99AA8]/30 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#B94B50]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#60463E]/70">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF8EC] flex items-center justify-center border border-[#E99AA8]/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-lg sm:text-2xl font-bold text-[#60463E] tabular-nums">
            {formatPrice(stats?.totalRevenue)}
          </p>
          <p className="text-[10px] text-[#A8B69A] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Pemasukan pesanan valid</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E99AA8]/30 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#60463E]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#60463E]/70">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF8EC] flex items-center justify-center border border-[#E99AA8]/20 text-[#60463E]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-lg sm:text-2xl font-bold text-[#60463E] tabular-nums">
            {stats?.totalOrders || 0}
          </p>
          <p className="text-[10px] text-[#60463E]/60">
            Transaksi masuk periode ini
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E99AA8]/30 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#B94B50]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#60463E]/70">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-lg sm:text-2xl font-bold text-[#B94B50] tabular-nums">
            {stats?.pendingOrdersCount || 0}
          </p>
          <button
            onClick={() => setAdminView('orders')}
            className="text-[10px] text-[#B94B50] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Periksa pesanan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Total Products */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E99AA8]/30 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#60463E]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#60463E]/70">
              Total Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF8EC] flex items-center justify-center border border-[#E99AA8]/20 text-[#60463E]">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-lg sm:text-2xl font-bold text-[#60463E] tabular-nums">
            {stats?.totalProducts || 0}
          </p>
          <p className="text-[10px] text-[#A8B69A] font-semibold">
            {stats?.activeProducts || 0} produk aktif tayang
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E99AA8]/30 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#60463E]/70">
              Low Stock Alert
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center border border-red-200 text-[#B94B50]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-lg sm:text-2xl font-bold text-[#B94B50] tabular-nums">
            {stats?.lowStockCount || 0}
          </p>
          <button
            onClick={() => setAdminView('inventory')}
            className="text-[10px] text-[#B94B50] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Restock sekarang</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Products in Stock */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E99AA8]/30 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#A8B69A]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#60463E]/70">
              Products in Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF8EC] flex items-center justify-center border border-[#E99AA8]/20 text-[#A8B69A]">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-lg sm:text-2xl font-bold text-[#60463E] tabular-nums">
            {(stats?.totalProducts || 0) - (stats?.lowStockCount || 0)}
          </p>
          <p className="text-[10px] text-[#60463E]/60">
            Stok dalam batas aman
          </p>
        </div>

      </div>

      {/* Low Stock Warning Banner if any */}
      {stats?.lowStockItems && stats.lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Peringatan Stok Rendah:</strong> Terdapat {stats.lowStockItems.length} produk yang hampir habis: {stats.lowStockItems.map((i: any) => `${i.name} (sisa ${i.stock})`).join(', ')}.
            </span>
          </div>
          <button
            onClick={() => setAdminView('inventory')}
            className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-[11px] shrink-0 self-start sm:self-auto"
          >
            Kelola Stok
          </button>
        </div>
      )}

      {/* Split Section: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Recent Orders Table */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-[#E99AA8]/30 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E99AA8]/20 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-[#60463E]">
                Pesanan Terbaru
              </h3>
              <p className="text-[11px] text-[#60463E]/60">
                5 transaksi terbaru yang masuk ke Buttonberry
              </p>
            </div>
            <button
              onClick={() => setAdminView('orders')}
              className="text-xs font-semibold text-[#B94B50] hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#60463E]/60 uppercase tracking-wider text-[10px] border-b border-[#E99AA8]/15">
                  <th className="pb-2 font-bold">Order ID</th>
                  <th className="pb-2 font-bold">Pelanggan</th>
                  <th className="pb-2 font-bold">Total</th>
                  <th className="pb-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E99AA8]/10 text-[#60463E]">
                {stats?.recentOrders?.map((order: any) => (
                  <tr key={order.orderId} className="hover:bg-[#FFF8EC]/40 transition-colors">
                    <td className="py-2.5 font-mono font-bold text-[#B94B50]">
                      {order.orderId}
                    </td>
                    <td className="py-2.5">
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-[10px] text-[#60463E]/60">{order.date}</p>
                    </td>
                    <td className="py-2.5 font-semibold tabular-nums">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Completed'
                          ? 'bg-[#A8B69A]/20 text-[#60463E]'
                          : order.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Top Selling Products & Store Activity */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Top Products Card */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E99AA8]/30 space-y-4 shadow-2xs">
            <div className="border-b border-[#E99AA8]/20 pb-3">
              <h3 className="font-serif text-base font-bold text-[#60463E]">
                Produk Terlaris
              </h3>
              <p className="text-[11px] text-[#60463E]/60">
                Aksesori paling diminati pelanggan
              </p>
            </div>

            <div className="space-y-3">
              {stats?.topProducts?.map((prod: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-[#FFF8EC] text-[#B94B50] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#E99AA8]/30">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-[#60463E] truncate">
                      {prod.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-[#B94B50] tabular-nums">
                      {prod.quantity} terjual
                    </span>
                    <p className="text-[10px] text-[#60463E]/50 tabular-nums">
                      {formatPrice(prod.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E99AA8]/30 space-y-3 shadow-2xs">
            <h3 className="font-serif text-base font-bold text-[#60463E] border-b border-[#E99AA8]/20 pb-2">
              Aktivitas Toko Terbaru
            </h3>
            <div className="space-y-2 text-xs">
              {stats?.recentActivity?.map((act: any) => (
                <div key={act.id} className="p-2.5 rounded-xl bg-[#FFF8EC]/60 border border-[#E99AA8]/20 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B94B50] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#60463E]">{act.note}</p>
                    <p className="text-[10px] text-[#60463E]/60">
                      {act.productName} · {new Date(act.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
