import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useShop } from '../../context/ShopContext.tsx';
import { Product } from '../../data/products.ts';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  AlertTriangle,
  Upload,
  Sparkles
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { token } = useAdminAuth();
  const { refreshProducts, showToast, openProductDetail } = useShop();

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tote Bags',
    price: 99000,
    originalPrice: 119000,
    description: '',
    story: '',
    image: '/src/assets/images/hero_buttonberry_collection_1793250120557.jpg',
    galleryText: '',
    tag: 'New' as any,
    dimensions: 'Standard size',
    material: 'Premium Cotton Linen',
    stock: 15,
    lowStockThreshold: 5,
    status: 'active' as 'active' | 'draft',
    isBestseller: false,
    isNew: true,
    colors: [
      { name: 'Strawberry Pink', hex: '#E99AA8' },
      { name: 'Butter Yellow', hex: '#F6E7A6' }
    ]
  });

  const categories = ['Tote Bags', 'Sling Bags', 'Card Holders', 'Pouches', 'Bag Straps', 'Keychains'];

  const fetchAdminProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProductsList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, [token]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Tote Bags',
      price: 99000,
      originalPrice: 119000,
      description: 'Aksesori manis berdetail khas Buttonberry.',
      story: 'Dibuat dengan tangan dengan sentuhan vintage.',
      image: '/src/assets/images/product_strawberry_picnic_tote_1793250121895.jpg',
      galleryText: '/src/assets/images/product_strawberry_picnic_tote_1793250121895.jpg\n/src/assets/images/hero_buttonberry_collection_1793250120557.jpg',
      tag: 'New',
      dimensions: '30 cm × 25 cm',
      material: 'Cotton Linen & Wood Button',
      stock: 12,
      lowStockThreshold: 5,
      status: 'active',
      isBestseller: false,
      isNew: true,
      colors: [
        { name: 'Strawberry Pink', hex: '#E99AA8' },
        { name: 'Cream', hex: '#FFF8EC' }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      description: product.description,
      story: product.story || '',
      image: product.image,
      galleryText: (product.gallery || [product.image]).join('\n'),
      tag: product.tag || 'New',
      dimensions: product.dimensions,
      material: product.material,
      stock: product.stock,
      lowStockThreshold: (product as any).lowStockThreshold || 5,
      status: (product as any).status || 'active',
      isBestseller: Boolean(product.isBestseller),
      isNew: Boolean(product.isNew),
      colors: product.colors.length > 0 ? product.colors : [{ name: 'Default', hex: '#E99AA8' }]
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('Nama dan harga produk wajib diisi', 'info');
      return;
    }

    const gallery = formData.galleryText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock),
      lowStockThreshold: Number(formData.lowStockThreshold),
      gallery: gallery.length > 0 ? gallery : [formData.image]
    };

    try {
      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(`Produk "${formData.name}" berhasil diperbarui!`, 'success');
        }
      } else {
        // POST create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(`Produk baru "${formData.name}" berhasil ditambahkan!`, 'success');
        }
      }

      setIsModalOpen(false);
      fetchAdminProducts();
      refreshProducts(); // Sync storefront live
    } catch (err: any) {
      showToast('Gagal menyimpan produk: ' + err.message, 'info');
    }
  };

  const handleDeleteProduct = async () => {
    if (!showDeleteConfirm) return;
    try {
      const res = await fetch(`/api/products/${showDeleteConfirm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast(`Produk "${showDeleteConfirm.name}" berhasil dihapus`, 'info');
        setShowDeleteConfirm(null);
        fetchAdminProducts();
        refreshProducts();
      }
    } catch (err: any) {
      showToast('Gagal menghapus produk: ' + err.message, 'info');
    }
  };

  const filteredProducts = productsList.filter((p) => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price).replace(/\s/, '');
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
            Katalog Produk Buttonberry
          </h1>
          <p className="text-xs text-[#60463E]/70 mt-1">
            Tambah, edit varian, kelola foto, dan tentukan ketersediaan produk di storefront.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#B94B50] hover:bg-[#a03d42] text-[#FFF8EC] font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#E99AA8]/30 shadow-2xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60463E]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk berdasarkan nama..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FFF8EC]/30 border border-[#E99AA8]/40 rounded-xl focus:outline-none focus:border-[#B94B50] text-[#60463E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium bg-[#FFF8EC]/30 border border-[#E99AA8]/40 rounded-xl px-3 py-2 text-[#60463E] focus:outline-none"
          >
            <option value="All">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-3xl border border-[#E99AA8]/30 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FFF8EC]/60 text-[#60463E]/70 uppercase tracking-wider text-[10px] border-b border-[#E99AA8]/20">
                <th className="py-3 px-4 font-bold">Produk</th>
                <th className="py-3 px-4 font-bold">Kategori</th>
                <th className="py-3 px-4 font-bold">Harga</th>
                <th className="py-3 px-4 font-bold">Stok</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E99AA8]/15 text-[#60463E]">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= ((p as any).lowStockThreshold || 5);
                return (
                  <tr key={p.id} className="hover:bg-[#FFF8EC]/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-[#FFF8EC] border border-[#E99AA8]/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-serif font-bold text-[#60463E] line-clamp-1">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.tag && (
                              <span className="text-[9px] bg-[#FFF8EC] border border-[#E99AA8]/30 px-1.5 py-0.2 rounded font-semibold text-[#B94B50]">
                                {p.tag}
                              </span>
                            )}
                            <span className="text-[10px] text-[#60463E]/60">{p.colors.length} varian warna</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{p.category}</td>
                    <td className="py-3 px-4 font-semibold tabular-nums">{formatPrice(p.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-semibold tabular-nums ${isLow ? 'text-red-600' : 'text-[#60463E]'}`}>
                        {p.stock}
                        {isLow && <AlertTriangle className="w-3 h-3" />}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (p as any).status === 'draft' ? 'bg-slate-100 text-slate-600' : 'bg-[#A8B69A]/20 text-[#60463E]'
                      }`}>
                        {(p as any).status || 'active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-[#60463E]/70 hover:text-[#B94B50] rounded-lg hover:bg-[#FFF8EC] transition-colors"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(p)}
                          className="p-1.5 text-red-400 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E99AA8]/40 p-6 sm:p-8 max-w-2xl w-full my-8 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-[#E99AA8]/20 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#60463E]">
                  {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
                </h3>
                <p className="text-xs text-[#60463E]/60">
                  Data produk akan langsung tersinkronisasi di katalog toko.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#60463E]/60 hover:text-[#60463E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Harga Jual (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Harga Coret (Opsional)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Stok Awal *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#60463E]">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#60463E]">URL Foto Produk Utama</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#60463E]">URL Galeri Foto (1 baris per URL)</label>
                <textarea
                  rows={2}
                  value={formData.galleryText}
                  onChange={(e) => setFormData({ ...formData, galleryText: e.target.value })}
                  placeholder="https://... atau /src/assets/images/..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Label Produk</label>
                  <select
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  >
                    <option value="Bestseller">Bestseller</option>
                    <option value="New">New Arrival</option>
                    <option value="Little Favorite">Little Favorite</option>
                    <option value="Handmade Delight">Handmade Delight</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  >
                    <option value="active">Active (Tayang di Toko)</option>
                    <option value="draft">Draft (Disembunyikan)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#60463E]">Batas Peringatan Stok Rendah</label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E99AA8]/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#60463E]/20 text-[#60463E] font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#B94B50] hover:bg-[#a03d42] text-white font-semibold text-xs shadow-xs"
                >
                  Simpan & Perbarui Toko
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-red-200 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#60463E]">
                Hapus Produk?
              </h3>
              <p className="text-xs text-[#60463E]/70">
                Apakah kamu yakin ingin menghapus <strong>"{showDeleteConfirm.name}"</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#60463E]/20 text-xs font-semibold text-[#60463E]"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
