import React from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setActivePage } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-28 sm:pb-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E99AA8]/20 text-[#B94B50] text-xs font-semibold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5 fill-[#B94B50]" />
          <span>Little Wishlist</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#60463E]">
          Barang Impianmu
        </h1>
        <p className="text-xs sm:text-sm text-[#60463E]/70 mt-1">
          Koleksi aksesori manis yang telah kamu simpan. Kapan pun kamu siap membawanya pulang, mereka selalu menunggumu di sini.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-12">
          <div className="w-20 h-20 rounded-full bg-[#FFF8EC] border-2 border-dashed border-[#E99AA8] flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-[#E99AA8]" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#60463E] mb-2">
            Wishlist-mu Masih Sunyi
          </h3>
          <p className="text-xs sm:text-sm text-[#60463E]/70 max-w-xs mb-6">
            Ketuk ikon hati pada produk apa pun untuk menyimpannya ke daftar favorit pribadimu.
          </p>
          <button
            onClick={() => setActivePage('shop')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B94B50] text-[#FFF8EC] font-medium text-xs sm:text-sm hover:bg-[#a03e43] shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Jelajahi Koleksi</span>
          </button>
        </div>
      ) : (
        <div>
          <div className="text-xs text-[#60463E]/60 mb-4 font-medium">
            Menampilkan {wishlistedProducts.length} aksesori tersimpan:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
