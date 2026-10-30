import React from 'react';
import { useShop } from '../context/ShopContext.tsx';
import {
  CheckCircle,
  Printer,
  Home,
  ShoppingBag,
  Clock,
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastOrder, setActivePage, showToast } = useShop();

  if (!lastOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#60463E] mb-2">Belum Ada Pesanan Aktif</h2>
        <p className="text-sm text-[#60463E]/70 mb-6">Mulai belanja dan temukan koleksi manis favoritmu.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="px-6 py-2.5 rounded-full bg-[#B94B50] text-[#FFF8EC] text-sm font-medium"
        >
          Ke Toko
        </button>
      </div>
    );
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(lastOrder.orderId);
    showToast('Nomor pesanan berhasil disalin!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const isQris = lastOrder.paymentMethod.includes('QRIS');
  const isVa = lastOrder.paymentMethod.includes('Virtual Account');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-28 sm:pb-16 print:p-0 print:max-w-full">
      {/* Whimsical Receipt Container */}
      <div className="bg-[#FFF8EC] border-2 border-dashed border-[#B94B50]/30 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden print:border-none print:shadow-none">
        {/* Decorative Vintage Stamp */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 transform rotate-12 pointer-events-none opacity-85">
          <div className="border-2 border-dashed border-[#B94B50] rounded-xl px-3 py-1.5 text-center text-[#B94B50]">
            <div className="text-[10px] uppercase font-bold tracking-widest">Buttonberry</div>
            <div className="text-xs font-serif font-bold">APPROVED</div>
          </div>
        </div>

        {/* Success Header */}
        <div className="text-center pb-6 border-b border-[#60463E]/10">
          <div className="w-16 h-16 rounded-full bg-[#E99AA8]/30 border-2 border-[#B94B50] text-[#B94B50] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-[#B94B50] uppercase tracking-widest flex items-center justify-center gap-1">
            <span>🍓</span>
            <span>Little Things, Lovely Days</span>
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E] mt-1">
            Terima Kasih, Berry Friend!
          </h1>
          <p className="text-xs sm:text-sm text-[#60463E]/70 mt-1 max-w-md mx-auto">
            Pesananmu telah tercatat di sistem Buttonberry. Kami akan segera menyiapkan paket manis ini untukmu.
          </p>
        </div>

        {/* Order Meta Pill */}
        <div className="my-6 p-4 rounded-2xl bg-white border border-[#60463E]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="text-[#60463E]/60 text-[11px]">Nomor Pesanan:</div>
            <div className="font-mono font-bold text-sm text-[#60463E] flex items-center gap-1.5 mt-0.5">
              <span>{lastOrder.orderId}</span>
              <button
                onClick={handleCopyOrderId}
                className="text-[#B94B50] hover:text-[#60463E] p-1 print:hidden"
                title="Salin Nomor Pesanan"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <div className="text-[#60463E]/60 text-[11px]">Tanggal Pemesanan:</div>
            <div className="font-medium text-[#60463E] mt-0.5">
              {new Date(lastOrder.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>

          <div>
            <div className="text-[#60463E]/60 text-[11px]">Status Pesanan:</div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F6E7A6] text-[#60463E] mt-0.5">
              {lastOrder.status || 'Diproses'}
            </span>
          </div>
        </div>

        {/* Payment Instructions / Simulation */}
        <div className="p-4 rounded-2xl bg-[#F6E7A6]/30 border border-[#F6E7A6] mb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#60463E]">
            <CreditCard className="w-4 h-4 text-[#B94B50]" />
            <span>Instruksi Pembayaran · {lastOrder.paymentMethod}</span>
          </div>

          {isQris && (
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-xl border border-[#60463E]/10">
              <div className="w-28 h-28 bg-[#FFF8EC] border-2 border-dashed border-[#60463E]/20 rounded-xl flex flex-col items-center justify-center p-2 text-center shrink-0">
                <QrCode className="w-16 h-16 text-[#60463E]" />
                <span className="text-[9px] font-bold text-[#60463E]/60 uppercase tracking-wider mt-1">
                  QRIS Buttonberry
                </span>
              </div>
              <div className="text-xs text-[#60463E] space-y-1 text-center sm:text-left">
                <p className="font-semibold text-emerald-800">
                  Scan QR di atas menggunakan aplikasi e-wallet atau mobile banking favoritmu.
                </p>
                <p className="text-[11px] text-[#60463E]/70">
                  Nominal pas:{' '}
                  <strong className="text-[#B94B50] text-sm">
                    Rp{lastOrder.total.toLocaleString('id-ID')}
                  </strong>
                </p>
                <p className="text-[10px] text-[#60463E]/60">
                  Verifikasi pembayaran berlangsung instan dan otomatis.
                </p>
              </div>
            </div>
          )}

          {isVa && (
            <div className="bg-white p-3.5 rounded-xl border border-[#60463E]/10 space-y-2">
              <div className="text-xs text-[#60463E]/70">Nomor Rekening Virtual Account:</div>
              <div className="flex items-center justify-between p-2.5 bg-[#FFF8EC] rounded-lg">
                <span className="font-mono font-bold text-base text-[#60463E] tracking-wider">
                  8808 2026 {lastOrder.orderId.replace(/[^0-9]/g, '').padEnd(4, '0')}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`88082026${lastOrder.orderId.replace(/[^0-9]/g, '')}`);
                    showToast('Nomor VA disalin!', 'success');
                  }}
                  className="text-xs font-semibold text-[#B94B50] hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </button>
              </div>
              <div className="text-[11px] text-[#60463E]/70">
                Total yang harus dibayar:{' '}
                <strong className="text-[#B94B50]">Rp{lastOrder.total.toLocaleString('id-ID')}</strong>
              </div>
            </div>
          )}

          {!isQris && !isVa && (
            <div className="text-xs text-[#60463E]/80 bg-white p-3 rounded-xl border border-[#60463E]/10">
              Silakan siapkan uang pas sebesar{' '}
              <strong className="text-[#B94B50]">Rp{lastOrder.total.toLocaleString('id-ID')}</strong> saat kurir
              mengantarkan paket ke alamatmu.
            </div>
          )}
        </div>

        {/* Shipping & Recipient Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 mb-6 border-b border-[#60463E]/10 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-[#60463E]/10">
            <div className="font-bold text-[#60463E] flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B94B50]" />
              <span>Tujuan Pengiriman</span>
            </div>
            <div className="font-medium text-[#60463E]">{lastOrder.customerName}</div>
            <div className="text-[#60463E]/70 text-[11px] mt-0.5">{lastOrder.phone}</div>
            <div className="text-[#60463E]/70 text-[11px] mt-1 leading-relaxed">
              {lastOrder.address}, {lastOrder.city} {lastOrder.postalCode}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#60463E]/10">
            <div className="font-bold text-[#60463E] flex items-center gap-1.5 mb-1.5">
              <Truck className="w-3.5 h-3.5 text-[#B94B50]" />
              <span>Pengiriman</span>
            </div>
            <div className="font-medium text-[#60463E]">
              {lastOrder.shippingOption.name} ({lastOrder.shippingOption.courier})
            </div>
            <div className="text-[#60463E]/70 text-[11px] mt-0.5">
              Estimasi tiba: {lastOrder.shippingOption.estimate || (lastOrder.shippingOption as any).etd || '2-3 hari kerja'}
            </div>
            <div className="text-[#60463E]/70 text-[11px] mt-1">
              Ongkir: Rp{lastOrder.shippingFee.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Items Purchased Table */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#60463E]">
            Barang yang Dipesan
          </div>
          <div className="space-y-2">
            {lastOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#60463E]/5 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image || item.product.gallery?.[0] || (item.product as any).images?.[0] || ''}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-[#FFF8EC] border border-[#60463E]/10"
                  />
                  <div>
                    <div className="font-medium text-[#60463E]">{item.product.name}</div>
                    <div className="text-[11px] text-[#60463E]/60">
                      {item.selectedColor} × {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-[#60463E]">
                  Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 rounded-2xl bg-white border border-[#60463E]/10 space-y-2 text-xs sm:text-sm text-[#60463E] mb-8">
          <div className="flex justify-between">
            <span className="text-[#60463E]/70">Subtotal Produk</span>
            <span className="font-semibold">Rp{lastOrder.subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#60463E]/70">Ongkos Kirim</span>
            <span className="font-semibold">Rp{lastOrder.shippingFee.toLocaleString('id-ID')}</span>
          </div>
          {lastOrder.discount ? (
            <div className="flex justify-between text-[#B94B50]">
              <span>Diskon Voucher</span>
              <span className="font-semibold">-Rp{lastOrder.discount.toLocaleString('id-ID')}</span>
            </div>
          ) : null}
          <div className="pt-2 border-t border-[#60463E]/10 flex justify-between font-bold text-base sm:text-lg text-[#B94B50]">
            <span>Total Akhir</span>
            <span>Rp{lastOrder.total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl border-2 border-[#60463E]/20 text-[#60463E] font-medium text-xs sm:text-sm hover:border-[#60463E] hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Bukti Pemesanan</span>
          </button>

          <button
            onClick={() => setActivePage('shop')}
            className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-[#B94B50] text-[#FFF8EC] font-semibold text-xs sm:text-sm hover:bg-[#a03e43] shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Lanjut Belanja</span>
          </button>
        </div>
      </div>
    </div>
  );
};
