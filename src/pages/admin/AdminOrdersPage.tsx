import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useShop } from '../../context/ShopContext.tsx';
import {
  Search,
  Filter,
  Eye,
  Truck,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  AlertCircle
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { token } = useAdminAuth();
  const { showToast } = useShop();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Order Details Modal / Drawer
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [newStatusInput, setNewStatusInput] = useState('');
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

  const statuses = [
    'Pending',
    'Awaiting Payment',
    'Paid',
    'Processing',
    'Shipped',
    'Completed',
    'Cancelled'
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?status=${statusFilter}&search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search, token]);

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setTrackingInput(order.trackingNumber || '');
    setNewStatusInput(order.status || 'Pending');
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatusInput,
          trackingNumber: trackingInput
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(updated);
        showToast(`Status pesanan #${updated.orderId} diubah menjadi "${updated.status}"`, 'success');
        setShowStatusConfirm(false);
        fetchOrders();
      }
    } catch (err: any) {
      showToast('Gagal memperbarui status: ' + err.message, 'info');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price || 0).replace(/\s/, '');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
          Pengelolaan Pesanan Pelanggan
        </h1>
        <p className="text-xs text-[#60463E]/70 mt-1">
          Pantau status pembayaran, proses pengemasan, dan input nomor resi kurir.
        </p>
      </div>

      {/* Toolbar: Search and Status Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#E99AA8]/30 shadow-2xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60463E]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Order ID, nama pembeli, email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FFF8EC]/30 border border-[#E99AA8]/40 rounded-xl focus:outline-none focus:border-[#B94B50] text-[#60463E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium bg-[#FFF8EC]/30 border border-[#E99AA8]/40 rounded-xl px-3 py-2 text-[#60463E] focus:outline-none"
          >
            <option value="all">Semua Status Pesanan</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E99AA8]/30 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FFF8EC]/60 text-[#60463E]/70 uppercase tracking-wider text-[10px] border-b border-[#E99AA8]/20">
                <th className="py-3 px-4 font-bold">Order ID</th>
                <th className="py-3 px-4 font-bold">Pelanggan</th>
                <th className="py-3 px-4 font-bold">Tanggal</th>
                <th className="py-3 px-4 font-bold">Item Dibeli</th>
                <th className="py-3 px-4 font-bold">Metode Bayar</th>
                <th className="py-3 px-4 font-bold">Total</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E99AA8]/15 text-[#60463E]">
              {orders.map((o) => (
                <tr key={o.orderId} className="hover:bg-[#FFF8EC]/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#B94B50]">
                    {o.orderId}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    <p className="font-semibold text-[#60463E]">{o.customerName}</p>
                    <p className="text-[10px] text-[#60463E]/60">{o.phone || o.email}</p>
                  </td>
                  <td className="py-3 px-4 text-[#60463E]/70">{o.date}</td>
                  <td className="py-3 px-4">
                    <div className="max-w-[180px] truncate" title={o.items?.map((i: any) => `${i.productName} (${i.quantity})`).join(', ')}>
                      {o.items?.map((i: any) => `${i.productName} (${i.quantity})`).join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#60463E]/80">
                    {o.paymentMethod}
                  </td>
                  <td className="py-3 px-4 font-semibold tabular-nums text-[#60463E]">
                    {formatPrice(o.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      o.status === 'Completed'
                        ? 'bg-[#A8B69A]/20 text-[#60463E]'
                        : o.status === 'Shipped'
                        ? 'bg-blue-50 text-blue-700'
                        : o.status === 'Cancelled'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-800'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenDetail(o)}
                      className="px-3 py-1.5 rounded-xl border border-[#E99AA8]/40 hover:bg-[#FFF8EC] text-[#60463E] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B94B50]" />
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E99AA8]/40 p-6 sm:p-8 max-w-xl w-full my-6 space-y-5 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E99AA8]/20 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B94B50]">
                  Rincian Pesanan
                </span>
                <h3 className="font-serif text-xl font-bold text-[#60463E]">
                  Order #{selectedOrder.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#60463E]/60 hover:text-[#60463E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Information */}
            <div className="p-4 rounded-2xl bg-[#FFF8EC]/60 border border-[#E99AA8]/25 space-y-1.5 text-xs">
              <p className="font-bold text-[#60463E]">Informasi Penerima:</p>
              <p className="font-semibold">{selectedOrder.customerName} · {selectedOrder.phone}</p>
              <p className="text-[#60463E]/80">{selectedOrder.email}</p>
              <p className="text-[#60463E]/80 pt-1">
                Alamat: {selectedOrder.address}, {selectedOrder.city} {selectedOrder.postalCode}
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#60463E] text-[11px] uppercase tracking-wider">
                Produk yang Dipesan:
              </span>
              <div className="divide-y divide-[#E99AA8]/15 border rounded-2xl p-3 border-[#E99AA8]/25 space-y-2">
                {selectedOrder.items?.map((it: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between pt-1 first:pt-0">
                    <div className="flex items-center gap-2.5">
                      {it.image && (
                        <img src={it.image} alt={it.productName} className="w-8 h-8 rounded-lg object-cover bg-white" />
                      )}
                      <div>
                        <p className="font-serif font-bold text-[#60463E]">{it.productName}</p>
                        <p className="text-[10px] text-[#60463E]/60">Varian: {it.selectedColor} × {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums">{formatPrice(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Breakdown */}
            <div className="space-y-1 pt-1 text-xs border-t border-[#E99AA8]/20">
              <div className="flex justify-between text-[#60463E]/80">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#60463E]/80">
                <span>Ongkir ({selectedOrder.shippingOption?.name || 'Standard'})</span>
                <span className="tabular-nums font-semibold">{formatPrice(selectedOrder.shippingFee)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-[#B94B50]">
                  <span>Potongan Diskon</span>
                  <span className="tabular-nums font-semibold">-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#60463E] pt-2 border-t border-[#E99AA8]/25">
                <span>Total Tagihan</span>
                <span className="text-[#B94B50] tabular-nums">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status & Resi Editor */}
            <div className="space-y-3 p-4 rounded-2xl bg-white border border-[#E99AA8]/30 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Status Pesanan</label>
                  <select
                    value={newStatusInput}
                    onChange={(e) => setNewStatusInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Nomor Resi Pengiriman</label>
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Contoh: JT123456789ID"
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="px-3 py-2 rounded-xl border border-[#60463E]/20 text-[#60463E] hover:bg-slate-50 flex items-center gap-1.5 font-semibold text-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#B94B50]" />
                  <span>Cetak Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowStatusConfirm(true)}
                  className="px-5 py-2 rounded-xl bg-[#B94B50] hover:bg-[#a03d42] text-white font-semibold text-xs shadow-xs"
                >
                  Perbarui Status Pesanan
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Confirmation Dialog before status change */}
      {showStatusConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E99AA8]/40 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-[#FFF8EC] text-[#B94B50] rounded-full flex items-center justify-center mx-auto text-xl border border-[#E99AA8]/30">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#60463E]">
                Konfirmasi Perubahan Status
              </h3>
              <p className="text-xs text-[#60463E]/70">
                Ubah status pesanan <strong>#{selectedOrder?.orderId}</strong> menjadi <strong>"{newStatusInput}"</strong>?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowStatusConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#60463E]/20 text-xs font-semibold text-[#60463E]"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStatus}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#B94B50] hover:bg-[#a03d42] text-white text-xs font-semibold"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
