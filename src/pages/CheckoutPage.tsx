import React, { useState } from 'react';
import { useShop, OrderDetails } from '../context/ShopContext.tsx';
import { SHIPPING_OPTIONS, ShippingOption } from '../data/products.ts';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  MapPin,
  User,
  Phone,
  Mail
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedVoucher,
    selectedShipping,
    setSelectedShipping,
    placeOrder,
    setActivePage,
    storeSettings
  } = useShop();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bandung');
  const [postalCode, setPostalCode] = useState('40142');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca_va' | 'mandiri_va' | 'bank_transfer' | 'cod'>('qris');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const freeShippingThreshold = storeSettings.freeShippingThreshold || 250000;
  const isFreeShippingEligible = cartSubtotal >= freeShippingThreshold;

  // Calculate actual shipping fee
  const actualShippingFee = (isFreeShippingEligible && selectedShipping.id === 'standard')
    ? 0
    : (selectedShipping.cost ?? (selectedShipping as any).price ?? 15000);

  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const finalTotal = Math.max(0, cartSubtotal + actualShippingFee - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setFormError('Mohon lengkapi nama, nomor telepon, alamat, dan kota pengiriman.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `BB-${new Date().getFullYear().toString().slice(-2)}${randomSuffix}`;

    const orderPayload: OrderDetails = {
      orderId,
      customerName,
      phone,
      email: email || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      address,
      city,
      postalCode: postalCode || '40000',
      shippingOption: {
        ...selectedShipping,
        cost: actualShippingFee
      },
      paymentMethod:
        paymentMethod === 'qris'
          ? 'QRIS (GoPay/OVO/ShopeePay)'
          : paymentMethod === 'bca_va'
          ? 'BCA Virtual Account'
          : paymentMethod === 'mandiri_va'
          ? 'Mandiri Virtual Account'
          : paymentMethod === 'bank_transfer'
          ? 'Transfer Bank Manual'
          : 'COD (Bayar di Tempat)',
      items: cart,
      subtotal: cartSubtotal,
      shippingFee: actualShippingFee,
      discount: discountAmount,
      total: finalTotal,
      status: paymentMethod === 'cod' ? 'Processing' : 'Awaiting Payment',
      date: new Date().toISOString()
    };

    try {
      await placeOrder(orderPayload);
    } catch (err) {
      console.error(err);
      setFormError('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#60463E] mb-2">Keranjangmu Kosong</h2>
        <p className="text-sm text-[#60463E]/70 mb-6">Pilih produk favoritmu terlebih dahulu sebelum checkout.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="px-6 py-2.5 rounded-full bg-[#B94B50] text-[#FFF8EC] text-sm font-medium"
        >
          Lihat Katalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-28 sm:pb-16">
      {/* Header & Back Button */}
      <div className="mb-8">
        <button
          onClick={() => setActivePage('cart')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#60463E]/70 hover:text-[#B94B50] mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Keranjang</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">Checkout Pesanan</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#60463E]/70 mt-1">
          Lengkapi detail pengiriman dan pilih metode pembayaran favoritmu.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Informasi Kontak */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#60463E]/10 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#60463E]/10">
                <div className="w-6 h-6 rounded-full bg-[#B94B50] text-[#FFF8EC] text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#60463E]">
                  Informasi Penerima
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#60463E] mb-1.5">
                    Nama Lengkap <span className="text-[#B94B50]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#60463E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Maya Kirana"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#60463E] mb-1.5">
                      No. WhatsApp / HP <span className="text-[#B94B50]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#60463E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0812-3456-7890"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#60463E] mb-1.5">
                      Email (Untuk Faktur & Notifikasi)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#60463E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="maya@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Alamat Pengiriman */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#60463E]/10 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#60463E]/10">
                <div className="w-6 h-6 rounded-full bg-[#B94B50] text-[#FFF8EC] text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#60463E]">
                  Alamat Pengiriman
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#60463E] mb-1.5">
                    Alamat Lengkap & Patokan <span className="text-[#B94B50]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#60463E]/40 absolute left-3.5 top-3" />
                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/30 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#60463E] mb-1.5">
                      Kota / Kabupaten <span className="text-[#B94B50]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kota Bandung"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#60463E] mb-1.5">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="40142"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Kurir & Opsi Pengiriman */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#60463E]/10 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#60463E]/10">
                <div className="w-6 h-6 rounded-full bg-[#B94B50] text-[#FFF8EC] text-xs font-bold flex items-center justify-center">
                  3
                </div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#60463E]">
                  Pilihan Kurir & Pengiriman
                </h2>
              </div>

              <div className="space-y-3">
                {SHIPPING_OPTIONS.map((opt: ShippingOption) => {
                  const isSelected = selectedShipping.id === opt.id;
                  const isFree = isFreeShippingEligible && opt.id === 'standard';
                  return (
                    <label
                      key={opt.id}
                      onClick={() => setSelectedShipping(opt)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#B94B50] bg-[#E99AA8]/10'
                          : 'border-[#60463E]/10 bg-white hover:border-[#60463E]/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#B94B50]' : 'border-[#60463E]/30'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#B94B50]" />}
                        </div>
                        <div>
                          <div className="font-medium text-xs sm:text-sm text-[#60463E] flex items-center gap-2">
                            <span>{opt.name}</span>
                            {isFree && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                GRATIS ONGKIR
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#60463E]/60 flex items-center gap-1.5 mt-0.5">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{opt.courier} · Estimasi {opt.estimate || (opt as any).etd}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {isFree ? (
                          <div>
                            <span className="line-through text-xs text-[#60463E]/40 mr-1.5">
                              Rp{(opt.cost ?? (opt as any).price ?? 0).toLocaleString('id-ID')}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-emerald-700">Rp0</span>
                          </div>
                        ) : (
                          <span className="font-bold text-xs sm:text-sm text-[#60463E]">
                            Rp{(opt.cost ?? (opt as any).price ?? 0).toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Metode Pembayaran */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#60463E]/10 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#60463E]/10">
                <div className="w-6 h-6 rounded-full bg-[#B94B50] text-[#FFF8EC] text-xs font-bold flex items-center justify-center">
                  4
                </div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#60463E]">
                  Metode Pembayaran
                </h2>
              </div>

              <div className="space-y-3">
                {/* QRIS */}
                <label
                  onClick={() => setPaymentMethod('qris')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'qris'
                      ? 'border-[#B94B50] bg-[#E99AA8]/10'
                      : 'border-[#60463E]/10 bg-white hover:border-[#60463E]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'qris' ? 'border-[#B94B50]' : 'border-[#60463E]/30'
                      }`}
                    >
                      {paymentMethod === 'qris' && <div className="w-2 h-2 rounded-full bg-[#B94B50]" />}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF8EC] border border-[#60463E]/10 flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-[#B94B50]" />
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm text-[#60463E]">
                          QRIS (Instan & Bebas Biaya)
                        </div>
                        <div className="text-[11px] text-[#60463E]/60">
                          GoPay, OVO, ShopeePay, BCA, Livin, Dana, LinkAja
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#F6E7A6]/60 text-[#60463E] text-[10px] font-bold">
                    Paling Cepat
                  </span>
                </label>

                {/* BCA Virtual Account */}
                <label
                  onClick={() => setPaymentMethod('bca_va')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bca_va'
                      ? 'border-[#B94B50] bg-[#E99AA8]/10'
                      : 'border-[#60463E]/10 bg-white hover:border-[#60463E]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'bca_va' ? 'border-[#B94B50]' : 'border-[#60463E]/30'
                      }`}
                    >
                      {paymentMethod === 'bca_va' && <div className="w-2 h-2 rounded-full bg-[#B94B50]" />}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF8EC] border border-[#60463E]/10 flex items-center justify-center">
                        <Building className="w-4 h-4 text-[#60463E]" />
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm text-[#60463E]">
                          BCA Virtual Account
                        </div>
                        <div className="text-[11px] text-[#60463E]/60">
                          Verifikasi otomatis tanpa perlu upload bukti transfer
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Mandiri VA */}
                <label
                  onClick={() => setPaymentMethod('mandiri_va')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'mandiri_va'
                      ? 'border-[#B94B50] bg-[#E99AA8]/10'
                      : 'border-[#60463E]/10 bg-white hover:border-[#60463E]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'mandiri_va' ? 'border-[#B94B50]' : 'border-[#60463E]/30'
                      }`}
                    >
                      {paymentMethod === 'mandiri_va' && <div className="w-2 h-2 rounded-full bg-[#B94B50]" />}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF8EC] border border-[#60463E]/10 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-[#60463E]" />
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm text-[#60463E]">
                          Mandiri Virtual Account
                        </div>
                        <div className="text-[11px] text-[#60463E]/60">
                          Bayar via Livin by Mandiri atau ATM
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* COD */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#B94B50] bg-[#E99AA8]/10'
                      : 'border-[#60463E]/10 bg-white hover:border-[#60463E]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'border-[#B94B50]' : 'border-[#60463E]/30'
                      }`}
                    >
                      {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-[#B94B50]" />}
                    </div>
                    <div>
                      <div className="font-medium text-xs sm:text-sm text-[#60463E]">
                        COD (Bayar di Tempat)
                      </div>
                      <div className="text-[11px] text-[#60463E]/60">
                        Bayar tunai kepada kurir saat paket tiba di alamatmu
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sticky Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#FFF8EC] rounded-2xl p-5 border-2 border-[#F6E7A6] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#60463E] pb-2 border-b border-[#60463E]/10 flex items-center justify-between">
                <span>Ringkasan Item ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                <span className="text-xs font-sans font-normal text-[#B94B50]">Buttonberry</span>
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}`}
                    className="flex items-center gap-3 text-xs"
                  >
                    <img
                      src={item.product.image || item.product.gallery?.[0] || (item.product as any).images?.[0] || ''}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-white border border-[#60463E]/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#60463E] truncate">{item.product.name}</div>
                      <div className="text-[11px] text-[#60463E]/60">
                        {item.selectedColor} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold text-[#60463E]">
                      Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-[#60463E]/10 space-y-2 text-xs sm:text-sm text-[#60463E]">
                <div className="flex justify-between">
                  <span className="text-[#60463E]/70">Subtotal Item</span>
                  <span className="font-semibold">Rp{cartSubtotal.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#60463E]/70">Ongkos Kirim ({selectedShipping.name})</span>
                  <span className="font-semibold">
                    {actualShippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">GRATIS</span>
                    ) : (
                      `Rp${actualShippingFee.toLocaleString('id-ID')}`
                    )}
                  </span>
                </div>

                {appliedVoucher && (
                  <div className="flex justify-between text-[#B94B50]">
                    <span>Diskon Voucher ({appliedVoucher.code})</span>
                    <span className="font-semibold">-Rp{discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-[#60463E]/15 flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#60463E]/70">
                    Total Pembayaran
                  </div>
                  <div className="text-[11px] text-[#60463E]/50">Termasuk pajak & asuransi pengiriman</div>
                </div>
                <div className="font-serif text-2xl font-bold text-[#B94B50]">
                  Rp{finalTotal.toLocaleString('id-ID')}
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-xl bg-[#B94B50] text-[#FFF8EC] font-semibold text-sm shadow-md hover:bg-[#a03e43] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Memproses Pesanan...' : 'Bayar & Konfirmasi Pesanan'}</span>
              </button>

              <div className="pt-2 text-center text-[11px] text-[#60463E]/60 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Garansi 100% Produk Original & Handmade Craft</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
