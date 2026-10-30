import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useShop } from '../../context/ShopContext.tsx';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  Save,
  RotateCcw
} from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const { token } = useAdminAuth();
  const { showToast, refreshProducts } = useShop();

  const [stockList, setStockList] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick adjust modal
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [stockDelta, setStockDelta] = useState(5);
  const [adjustNote, setAdjustNote] = useState('Restock batch studio');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStockList(data.stockList);
        setLogs(data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [token]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    try {
      const res = await fetch(`/api/inventory/${activeItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          delta: stockDelta,
          note: adjustNote
        })
      });

      if (res.ok) {
        showToast(`Stok "${activeItem.name}" berhasil disesuaikan!`, 'success');
        setActiveItem(null);
        fetchInventory();
        refreshProducts();
      }
    } catch (err: any) {
      showToast('Gagal mengubah stok: ' + err.message, 'info');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
          Manajemen Stok & Inventaris
        </h1>
        <p className="text-xs text-[#60463E]/70 mt-1">
          Pantau stok produk fisik di studio Bandung, batas minimum restock, dan riwayat mutasi barang.
        </p>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-3xl border border-[#E99AA8]/30 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#E99AA8]/20 flex items-center justify-between">
          <h2 className="font-serif font-bold text-sm sm:text-base text-[#60463E] flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#B94B50]" />
            <span>Daftar Stok Produk Aktif</span>
          </h2>
          <span className="text-xs text-[#60463E]/60">
            {stockList.filter((s) => s.isLowStock).length} produk mendekati habis
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FFF8EC]/60 text-[#60463E]/70 uppercase tracking-wider text-[10px] border-b border-[#E99AA8]/20">
                <th className="py-3 px-4 font-bold">Produk</th>
                <th className="py-3 px-4 font-bold">Kategori</th>
                <th className="py-3 px-4 font-bold">Stok Saat Ini</th>
                <th className="py-3 px-4 font-bold">Batas Minimum</th>
                <th className="py-3 px-4 font-bold">Kondisi</th>
                <th className="py-3 px-4 font-bold text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E99AA8]/15 text-[#60463E]">
              {stockList.map((item) => (
                <tr key={item.id} className="hover:bg-[#FFF8EC]/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover bg-[#FFF8EC] border border-[#E99AA8]/20"
                      />
                      <span className="font-serif font-bold text-[#60463E] line-clamp-1">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#60463E]/80">{item.category}</td>
                  <td className="py-3 px-4 font-bold tabular-nums text-sm">
                    {item.stock} unit
                  </td>
                  <td className="py-3 px-4 tabular-nums text-[#60463E]/60">
                    ≤ {item.lowStockThreshold} unit
                  </td>
                  <td className="py-3 px-4">
                    {item.isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3" />
                        <span>Habis (Out of Stock)</span>
                      </span>
                    ) : item.isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Stok Rendah</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Aman</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setActiveItem(item);
                        setStockDelta(10);
                        setAdjustNote('Restock batch studio');
                      }}
                      className="px-3 py-1.5 rounded-xl border border-[#E99AA8]/40 hover:bg-[#B94B50] hover:text-white text-[#B94B50] text-xs font-semibold transition-colors"
                    >
                      Sesuaikan Stok
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Audit Logs */}
      <div className="bg-white rounded-3xl border border-[#E99AA8]/30 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="border-b border-[#E99AA8]/20 pb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-base text-[#60463E] flex items-center gap-2">
              <History className="w-4 h-4 text-[#A8B69A]" />
              <span>Riwayat Mutasi Stok (Inventory Logs)</span>
            </h2>
            <p className="text-[11px] text-[#60463E]/60 mt-0.5">
              Catatan otomatis dari pemesanan pelanggan dan penyesuaian manual administrator
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#E99AA8]/15 text-xs">
          {logs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-[#60463E]">{log.productName}</p>
                <p className="text-[11px] text-[#60463E]/60">{log.note}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`font-mono font-bold text-xs ${log.amount > 0 ? 'text-emerald-700' : 'text-[#B94B50]'}`}>
                  {log.amount > 0 ? `+${log.amount}` : log.amount} unit
                </span>
                <p className="text-[10px] text-[#60463E]/50">
                  Sisa: {log.balanceAfter} unit · {new Date(log.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E99AA8]/40 p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#60463E]">
              Sesuaikan Stok Produk
            </h3>
            <p className="text-xs text-[#60463E]/70">
              Produk: <strong>{activeItem.name}</strong> (Stok saat ini: {activeItem.stock} unit)
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#60463E]">Jumlah Perubahan (+ / -)</label>
                <input
                  type="number"
                  required
                  value={stockDelta}
                  onChange={(e) => setStockDelta(Number(e.target.value))}
                  placeholder="Contoh: 10 untuk tambah, -2 untuk kurangi"
                  className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                />
                <p className="text-[10px] text-[#60463E]/60">
                  Stok setelah penyesuaian: <strong>{Math.max(0, activeItem.stock + stockDelta)}</strong> unit
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#60463E]">Catatan Penyesuaian</label>
                <input
                  type="text"
                  required
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="Alasan perubahan stok..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#60463E]/20 text-xs font-semibold text-[#60463E]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#B94B50] hover:bg-[#a03d42] text-white text-xs font-semibold shadow-xs"
                >
                  Simpan Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
