import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { Search, Users, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const { token } = useAdminAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

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
          Data Pelanggan (Customer CRM)
        </h1>
        <p className="text-xs text-[#60463E]/70 mt-1">
          Daftar pembeli yang pernah bertransaksi di Buttonberry beserta riwayat belanja mereka.
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E99AA8]/30 shadow-2xs">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60463E]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pelanggan, nomor HP, email, kota..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FFF8EC]/30 border border-[#E99AA8]/40 rounded-xl focus:outline-none focus:border-[#B94B50] text-[#60463E]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#E99AA8]/30 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FFF8EC]/60 text-[#60463E]/70 uppercase tracking-wider text-[10px] border-b border-[#E99AA8]/20">
                <th className="py-3 px-4 font-bold">Nama Pelanggan</th>
                <th className="py-3 px-4 font-bold">Kontak</th>
                <th className="py-3 px-4 font-bold">Kota Pengiriman</th>
                <th className="py-3 px-4 font-bold">Total Transaksi</th>
                <th className="py-3 px-4 font-bold">Total Belanja</th>
                <th className="py-3 px-4 font-bold">Pembelian Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E99AA8]/15 text-[#60463E]">
              {filtered.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#FFF8EC]/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#E99AA8]/20 text-[#B94B50] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-[#60463E]">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <p className="text-[#60463E] flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#B94B50]" />
                      <span>{c.email}</span>
                    </p>
                    <p className="text-[#60463E]/60 text-[11px] flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#A8B69A]" />
                      <span>{c.phone}</span>
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-[#60463E]/80">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#B94B50]" />
                      <span>{c.city}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold tabular-nums">
                    {c.totalOrders} pesanan
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#B94B50] tabular-nums">
                    {formatPrice(c.totalSpending)}
                  </td>
                  <td className="py-3.5 px-4 text-[#60463E]/70">
                    {c.lastPurchase}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
