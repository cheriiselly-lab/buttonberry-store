import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Truck,
  ShieldCheck
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    setActivePage,
    addToCart,
    isWishlisted,
    toggleWishlist
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const [selectedImage, setSelectedImage] = useState(product?.gallery?.[0] || product?.image);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'care'>('desc');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-lg text-[#60463E]">Produk tidak ditemukan.</p>
        <button onClick={() => setActivePage('shop')} className="mt-3 text-xs text-[#B94B50] font-bold underline">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const isFavorite = isWishlisted(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price).replace(/\s/, '');
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const relatedProducts = products.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isBestseller)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      
      {/* Top back navigation button */}
      <div>
        <button
          onClick={() => setActivePage('shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#60463E]/80 hover:text-[#B94B50] transition-colors py-1 px-2 rounded-lg -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Koleksi Produk</span>
        </button>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-4/3 rounded-3xl bg-white border border-[#E99AA8]/30 overflow-hidden shadow-sm">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-[#FFF8EC]/95 text-[#60463E] border border-[#E99AA8]/40 text-xs font-semibold px-3 py-1 rounded-md shadow-2xs">
                {product.tag}
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    (selectedImage || product.image) === img
                      ? 'border-[#B94B50] ring-2 ring-[#B94B50]/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E99AA8]/30 shadow-xs">
          
          {/* Header & Category */}
          <div className="space-y-1.5 border-b border-[#E99AA8]/20 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B94B50]">
                {product.category}
              </span>
              <span className="text-xs font-medium text-[#60463E]/60 flex items-center gap-1">
                ⭐ {product.rating} ({product.reviewCount} ulasan)
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-bold text-[#B94B50] tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#60463E]/50 line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Color / Variant Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#60463E] flex items-center justify-between">
              <span>Pilihan Warna:</span>
              <span className="text-[#B94B50] font-medium capitalize">{selectedColor}</span>
            </label>
            <div className="flex items-center gap-3">
              {product.colors?.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    selectedColor === color.name
                      ? 'border-[#B94B50] bg-[#FFF8EC] text-[#60463E] shadow-2xs font-semibold'
                      : 'border-[#60463E]/15 hover:border-[#60463E]/40 text-[#60463E]/80'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Stock Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-[#60463E]">
                Jumlah:
              </label>
              <span className="text-[#A8B69A] font-semibold">
                ● Tersedia {product.stock} buah di studio
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E99AA8]/50 rounded-xl bg-[#FFF8EC] p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-[#60463E] transition-colors"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-[#60463E] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-[#60463E] transition-colors"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-xs text-[#60463E]/60">
                Subtotal: <strong>{formatPrice(product.price * quantity)}</strong>
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 min-h-[48px] py-3 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
                  added
                    ? 'bg-[#A8B69A] text-white'
                    : 'bg-[#B94B50] hover:bg-[#a03d42] text-[#FFF8EC]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Ditambahkan ke Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Tambah ke Keranjang • {formatPrice(product.price * quantity)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`min-w-[48px] min-h-[48px] rounded-2xl border flex items-center justify-center transition-colors ${
                  isFavorite
                    ? 'bg-[#FFF8EC] border-[#B94B50] text-[#B94B50]'
                    : 'border-[#E99AA8]/50 text-[#60463E] hover:bg-[#FFF8EC]'
                }`}
                aria-label="Simpan ke wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#B94B50]' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, selectedColor, quantity);
                setActivePage('cart');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FFF8EC] hover:bg-[#F6E7A6]/30 border border-[#E99AA8]/40 text-xs font-semibold text-[#60463E] transition-colors"
            >
              Beli Sekarang & Buka Keranjang
            </button>
          </div>

          {/* Value Props & Care summary */}
          <div className="pt-4 border-t border-[#E99AA8]/20 grid grid-cols-2 gap-3 text-xs text-[#60463E]/80">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#A8B69A] shrink-0" />
              <span>Kirim dari Bandung</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B94B50] shrink-0" />
              <span>Garansi Tukar Produk</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs: Description, Story, Specifications & Care */}
      <div className="bg-white rounded-3xl border border-[#E99AA8]/30 p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3 sm:gap-6 border-b border-[#E99AA8]/20 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('desc')}
            className={`font-serif text-sm sm:text-base font-bold pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'desc'
                ? 'text-[#B94B50] border-b-2 border-[#B94B50]'
                : 'text-[#60463E]/60 hover:text-[#60463E]'
            }`}
          >
            Deskripsi & Cerita
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`font-serif text-sm sm:text-base font-bold pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'text-[#B94B50] border-b-2 border-[#B94B50]'
                : 'text-[#60463E]/60 hover:text-[#60463E]'
            }`}
          >
            Material & Ukuran
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`font-serif text-sm sm:text-base font-bold pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'care'
                ? 'text-[#B94B50] border-b-2 border-[#B94B50]'
                : 'text-[#60463E]/60 hover:text-[#60463E]'
            }`}
          >
            Panduan Perawatan
          </button>
        </div>

        <div className="text-sm text-[#60463E]/85 leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-3xl">
              <p className="text-base font-medium text-[#60463E]">
                {product.description}
              </p>
              <div className="p-4 rounded-2xl bg-[#FFF8EC] border border-[#E99AA8]/30">
                <span className="font-script text-base text-[#B94B50] font-bold block mb-1">
                  Catatan dari Studio:
                </span>
                <p className="text-xs sm:text-sm text-[#60463E]/80 leading-relaxed italic">
                  "{product.story}"
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <div className="p-4 rounded-xl bg-[#FFF8EC] border border-[#E99AA8]/20 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B94B50]">
                  Dimensi / Ukuran
                </span>
                <p className="font-medium text-[#60463E]">{product.dimensions}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#FFF8EC] border border-[#E99AA8]/20 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B94B50]">
                  Material Utama
                </span>
                <p className="font-medium text-[#60463E]">{product.material}</p>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <ul className="space-y-2.5 max-w-xl">
              {product.careInstructions?.map((instruction, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#E99AA8]/20 text-[#B94B50] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#60463E]">
              Produk Serasi Lainnya
            </h2>
            <button
              onClick={() => setActivePage('shop')}
              className="text-xs font-semibold text-[#B94B50] hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
