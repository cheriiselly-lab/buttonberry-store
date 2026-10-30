import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, Sparkles, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    setActivePage,
    openProductDetail,
    storeSettings
  } = useShop();

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);

  const freeShippingThreshold = storeSettings.freeShippingThreshold || 250000;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    setVoucherError('');
    setVoucherLoading(true);
    const res = await applyVoucher(voucherInput.trim());
    setVoucherLoading(false);
    if (!res.success) {
      setVoucherError(res.message);
    } else {
      setVoucherInput('');
    }
  };

  const sampleCoupons = [
    { code: 'BUTTONJOY10', desc: 'Diskon 10% (min. Rp100k)' },
    { code: 'LOVELY20K', desc: 'Potongan Rp20.000 (min. Rp150k)' }
  ];

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-[#F6E7A6]/50 border-2 border-dashed border-[#B94B50]/30 flex items-center justify-center mb-6 relative">
          <ShoppingBag className="w-10 h-10 text-[#60463E]/60" />
          <span className="absolute -top-1 -right-1 text-2xl">🍓</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E] mb-2">
          Keranjangmu Masih Kosong
        </h2>
        <p className="text-sm text-[#60463E]/70 max-w-sm mb-6 leading-relaxed">
          Belum ada aksesori mungil yang kamu simpan di sini. Yuk intip koleksi terbaru Buttonberry dan temukan sahabat barumu!
        </p>
        <button
          onClick={() => setActivePage('shop')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B94B50] text-[#FFF8EC] font-medium text-sm shadow-md hover:bg-[#a03e43] transition-all transform hover:-translate-y-0.5"
        >
          <span>Jelajahi Koleksi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-28 sm:pb-16">
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E99AA8]/20 text-[#B94B50] text-xs font-semibold uppercase tracking-wider mb-2">
          <span>🍓</span>
          <span>Shopping Bag</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#60463E]">Keranjang Belanja</h1>
        <p className="text-xs sm:text-sm text-[#60463E]/70 mt-1">
          Periksa kembali pilihan aksesori favoritmu sebelum melangkah ke pembayaran.
        </p>
      </div>

      {/* Free Shipping Meter */}
      <div className="bg-[#FFF8EC] border-2 border-[#F6E7A6] rounded-2xl p-4 mb-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-xs sm:text-sm text-[#60463E] font-medium mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B94B50]" />
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-semibold">Selamat! Pesananmu berhak mendapatkan GRATIS ONGKIR 🎉</span>
            ) : (
              <span>
                Tambah <strong className="text-[#B94B50]">Rp{remainingForFreeShipping.toLocaleString('id-ID')}</strong> lagi untuk Gratis Ongkir!
              </span>
            )}
          </div>
          <span className="text-xs text-[#60463E]/60 hidden sm:inline">Min. Rp{freeShippingThreshold.toLocaleString('id-ID')}</span>
        </div>
        <div className="w-full h-2.5 bg-[#60463E]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F6E7A6] to-[#E99AA8] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedColor}`}
              className="bg-white rounded-2xl p-4 border border-[#60463E]/10 shadow-xs hover:border-[#E99AA8]/40 transition-all flex gap-3 sm:gap-4 relative group"
            >
              {/* Product Thumbnail */}
              <div
                onClick={() => openProductDetail(item.product.id)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#FFF8EC] overflow-hidden shrink-0 border border-[#60463E]/5 cursor-pointer relative"
              >
                <img
                  src={item.product.image || item.product.gallery?.[0] || (item.product as any).images?.[0] || ''}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => openProductDetail(item.product.id)}
                      className="font-serif text-sm sm:text-base font-bold text-[#60463E] truncate hover:text-[#B94B50] cursor-pointer"
                    >
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                      className="text-[#60463E]/40 hover:text-[#B94B50] p-1 rounded-md transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#60463E]/60 mt-0.5">
                    Warna: <span className="font-medium text-[#60463E]">{item.selectedColor}</span>
                  </p>

                  <div className="font-semibold text-sm sm:text-base text-[#B94B50] mt-1">
                    Rp{item.product.price.toLocaleString('id-ID')}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-[#60463E]/10">
                  <div className="flex items-center gap-2 border border-[#60463E]/20 rounded-full px-2 py-0.5 bg-[#FFF8EC]">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedColor, -1)}
                      className="w-6 h-6 flex items-center justify-center text-[#60463E] hover:text-[#B94B50] transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-[#60463E] min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedColor, 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#60463E] hover:text-[#B94B50] transition-colors"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm font-bold text-[#60463E]">
                    Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <button
              onClick={() => setActivePage('shop')}
              className="text-xs sm:text-sm text-[#B94B50] hover:underline font-medium inline-flex items-center gap-1.5"
            >
              <span>← Lanjut belanja barang lainnya</span>
            </button>
          </div>
        </div>

        {/* Order Summary & Voucher */}
        <div className="lg:col-span-5 space-y-5">
          {/* Voucher Box */}
          <div className="bg-white rounded-2xl p-5 border border-[#60463E]/10 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#60463E] mb-3">
              <Tag className="w-4 h-4 text-[#B94B50]" />
              <span>Kode Voucher Diskon</span>
            </div>

            {appliedVoucher ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#E99AA8]/15 border border-[#E99AA8]/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#B94B50] text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#B94B50]">{appliedVoucher.code}</div>
                    <div className="text-[11px] text-[#60463E]/70">{appliedVoucher.name}</div>
                  </div>
                </div>
                <button
                  onClick={removeVoucher}
                  className="text-xs text-[#B94B50] hover:underline font-semibold"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyVoucher} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: BUTTONJOY10"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm uppercase tracking-wider text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/40"
                  />
                  <button
                    type="submit"
                    disabled={voucherLoading || !voucherInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#60463E] text-[#FFF8EC] font-medium text-xs hover:bg-[#4a342d] disabled:opacity-50 transition-colors"
                  >
                    {voucherLoading ? 'Cek...' : 'Terapkan'}
                  </button>
                </div>
                {voucherError && (
                  <p className="text-[11px] text-red-600 font-medium">{voucherError}</p>
                )}

                {/* Sample Vouchers */}
                <div className="pt-2">
                  <p className="text-[11px] text-[#60463E]/60 mb-1.5">Voucher rekomendasi hari ini:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleCoupons.map((c) => (
                      <button
                        type="button"
                        key={c.code}
                        onClick={() => {
                          setVoucherInput(c.code);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-[#FFF8EC] border border-dashed border-[#B94B50]/40 text-[#60463E] hover:border-[#B94B50] hover:bg-[#F6E7A6]/30 transition-colors flex items-center gap-1"
                      >
                        <span className="font-mono font-bold text-[#B94B50]">{c.code}</span>
                        <span className="text-[10px] text-[#60463E]/60">({c.desc})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-[#FFF8EC] rounded-2xl p-5 border-2 border-[#F6E7A6] shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#60463E] pb-2 border-b border-[#60463E]/10">
              Ringkasan Belanja
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-[#60463E]">
              <div className="flex justify-between">
                <span className="text-[#60463E]/70">Subtotal Produk</span>
                <span className="font-semibold">Rp{cartSubtotal.toLocaleString('id-ID')}</span>
              </div>

              {appliedVoucher && (
                <div className="flex justify-between text-[#B94B50]">
                  <span>Diskon Voucher ({appliedVoucher.code})</span>
                  <span className="font-semibold">-Rp{discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[#60463E]/70">Estimasi Ongkos Kirim</span>
                <span className="text-xs text-[#60463E]/60 italic">Dihitung di Checkout</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#60463E]/15 flex items-baseline justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#60463E]/70">Total Sementara</div>
                <div className="text-[11px] text-[#60463E]/50">Belum termasuk ongkir</div>
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-[#B94B50]">
                Rp{finalTotal.toLocaleString('id-ID')}
              </div>
            </div>

            <button
              onClick={() => setActivePage('checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-[#B94B50] text-[#FFF8EC] font-semibold text-sm shadow-md hover:bg-[#a03e43] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Guarantee Badge */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#60463E]/70 text-center">
              <ShieldCheck className="w-4 h-4 text-[#A8B69A]" />
              <span>Transaksi aman, kemasan rapi & garansi retur jika rusak.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
