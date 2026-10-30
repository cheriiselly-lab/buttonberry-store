import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useShop } from '../../context/ShopContext.tsx';
import {
  TicketPercent,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  X
} from 'lucide-react';

export const AdminPromotionsPage: React.FC = () => {
  const { token } = useAdminAuth();
  const { showToast } = useShop();

  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'shipping',
    value: 10,
    minSpend: 50000,
    maxUsage: 100,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    description: ''
  });

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/promotions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPromotions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [token]);

  const handleOpenAdd = () => {
    setEditingPromo(null);
    setFormData({
      code: '',
      name: '',
      type: 'percentage',
      value: 10,
      minSpend: 50000,
      maxUsage: 100,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      description: 'Potongan diskon untuk pelanggan tercinta'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo: any) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      name: promo.name,
      type: promo.type,
      value: promo.value,
      minSpend: promo.minSpend,
      maxUsage: promo.maxUsage,
      startDate: promo.startDate,
      endDate: promo.endDate,
      description: promo.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      showToast('Kode voucher dan nama wajib diisi', 'info');
      return;
    }

    try {
      if (editingPromo) {
        const res = await fetch(`/api/promotions/${editingPromo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          showToast(`Voucher "${formData.code}" berhasil diperbarui`, 'success');
        }
      } else {
        const res = await fetch('/api/promotions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          showToast(`Voucher baru "${formData.code}" berhasil dibuat!`, 'success');
        } else {
          const err = await res.json();
          showToast(err.error || 'Gagal membuat voucher', 'info');
          return;
        }
      }

      setIsModalOpen(false);
      fetchPromotions();
    } catch (err: any) {
      showToast('Gagal: ' + err.message, 'info');
    }
  };

  const handleToggleActive = async (promo: any) => {
    try {
      const res = await fetch(`/api/promotions/${promo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !promo.isActive })
      });
      if (res.ok) {
        showToast(`Status voucher ${promo.code} diubah`, 'info');
        fetchPromotions();
      }
    } catch (err: any) {
      showToast(err.message, 'info');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus voucher promosi ini?')) return;
    try {
      const res = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Voucher berhasil dihapus', 'info');
        fetchPromotions();
      }
    } catch (err: any) {
      showToast(err.message, 'info');
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
            Kelola Promo & Kode Voucher
          </h1>
          <p className="text-xs text-[#60463E]/70 mt-1">
            Buat kode diskon persentase, potongan rupiah, atau promo gratis ongkir untuk pelanggan Buttonberry.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#B94B50] hover:bg-[#a03d42] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Voucher Baru</span>
        </button>
      </div>

      {/* Promos Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`bg-white rounded-3xl border p-5 space-y-4 shadow-2xs relative flex flex-col justify-between ${
              promo.isActive ? 'border-[#E99AA8]/40' : 'border-slate-200 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-[#B94B50] bg-[#FFF8EC] px-3 py-1 rounded-xl border border-[#E99AA8]/30">
                  {promo.code}
                </span>

                <button
                  onClick={() => handleToggleActive(promo)}
                  className="text-xs flex items-center gap-1 font-semibold"
                  title="Aktifkan / Nonaktifkan"
                >
                  {promo.isActive ? (
                    <span className="text-emerald-700 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aktif</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Nonaktif</span>
                    </span>
                  )}
                </button>
              </div>

              <div>
                <h3 className="font-serif font-bold text-sm text-[#60463E]">{promo.name}</h3>
                <p className="text-xs text-[#60463E]/70 mt-0.5">{promo.description}</p>
              </div>

              <div className="p-3 bg-[#FFF8EC]/60 rounded-xl space-y-1 text-xs text-[#60463E]">
                <div className="flex justify-between">
                  <span className="text-[#60463E]/60">Nilai Potongan:</span>
                  <span className="font-bold text-[#B94B50]">
                    {promo.type === 'percentage'
                      ? `${promo.value}%`
                      : promo.type === 'shipping'
                      ? `Ongkir s/d ${formatPrice(promo.value)}`
                      : formatPrice(promo.value)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#60463E]/60">Min. Belanja:</span>
                  <span className="font-semibold">{formatPrice(promo.minSpend)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#60463E]/60">Pemakaian:</span>
                  <span className="font-semibold">{promo.usageCount} / {promo.maxUsage} kuota</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#60463E]/50 pt-1 border-t border-[#E99AA8]/15">
                  <span>Berlaku hingga:</span>
                  <span>{promo.endDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E99AA8]/15">
              <button
                onClick={() => handleOpenEdit(promo)}
                className="p-1.5 text-[#60463E]/70 hover:text-[#B94B50] rounded-lg"
                title="Edit Voucher"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(promo.id)}
                className="p-1.5 text-red-400 hover:text-red-700 rounded-lg"
                title="Hapus Voucher"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E99AA8]/40 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E99AA8]/20 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#60463E]">
                {editingPromo ? 'Edit Voucher Promo' : 'Buat Kode Voucher Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#60463E]/60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#60463E]">Kode Voucher (Huruf Kapital)</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Contoh: BERRY10"
                  className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#60463E]">Nama Promo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Diskon Manis 10%"
                  className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Tipe Diskon</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  >
                    <option value="percentage">Persentase (%)</option>
                    <option value="fixed">Nominal Tetap (Rp)</option>
                    <option value="shipping">Potongan Ongkir (Rp)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Nilai Potongan</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Min. Belanja (Rp)</label>
                  <input
                    type="number"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Batas Pemakaian</label>
                  <input
                    type="number"
                    value={formData.maxUsage}
                    onChange={(e) => setFormData({ ...formData, maxUsage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#60463E]">Tanggal Berakhir</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E99AA8]/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#60463E]/20 text-xs font-semibold text-[#60463E]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B94B50] hover:bg-[#a03d42] text-white text-xs font-semibold shadow-xs"
                >
                  Simpan Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
