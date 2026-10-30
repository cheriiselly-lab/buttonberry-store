import React, { useState } from 'react';
import { Product } from '../data/products.ts';
import { useShop } from '../context/ShopContext.tsx';
import { Heart, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetail, addToCart, isWishlisted, toggleWishlist } = useShop();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFavorite = isWishlisted(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price).replace(/\s/, '');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => openProductDetail(product.id)}
      className="group relative flex flex-col bg-white rounded-2xl border border-[#E99AA8]/30 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 sm:aspect-square bg-[#FFF8EC] overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF8EC] text-[#60463E]/60 p-4 text-center">
            <span className="text-3xl mb-1">🍓</span>
            <span className="text-xs font-serif">{product.name}</span>
          </div>
        )}

        {/* Tag Sticker (Subtle scrapbook label) */}
        {product.tag && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="inline-block bg-[#FFF8EC]/95 text-[#60463E] border border-[#E99AA8]/40 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md shadow-xs">
              {product.tag}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-2.5 right-2.5 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] rounded-full bg-white/90 hover:bg-white text-[#60463E] flex items-center justify-center shadow-xs transition-transform active:scale-90"
          aria-label={isFavorite ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-[#B94B50] text-[#B94B50]' : 'text-[#60463E]/70 hover:text-[#B94B50]'
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover / Mobile Floating Tap */}
        <div className="absolute bottom-2.5 right-2.5">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`min-w-[42px] min-h-[42px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
              addedAnimation
                ? 'bg-[#A8B69A] text-white'
                : 'bg-[#B94B50] hover:bg-[#a03d42] text-[#FFF8EC]'
            }`}
            title="Tambah Cepat ke Bag"
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Ditambah</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Tambah</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category */}
          <span className="text-[11px] font-medium tracking-wide uppercase text-[#B94B50]/90">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="font-serif text-sm sm:text-base font-semibold text-[#60463E] mt-0.5 line-clamp-1 group-hover:text-[#B94B50] transition-colors">
            {product.name}
          </h3>

          {/* Color swatches */}
          {product.colors.length > 0 && (
            <div
              className="flex items-center gap-1.5 mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  title={color.name}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColor === color.name
                      ? 'ring-2 ring-[#B94B50] ring-offset-1 scale-110'
                      : 'border-black/15 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              <span className="text-[10px] text-[#60463E]/60 ml-1">
                {selectedColor}
              </span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-3 pt-2 border-t border-[#E99AA8]/15">
          <span className="font-semibold text-sm sm:text-base text-[#60463E] tabular-nums">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#60463E]/50 line-through tabular-nums">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
