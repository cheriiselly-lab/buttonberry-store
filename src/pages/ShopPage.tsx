import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { CATEGORIES, Product } from '../data/products.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { Search, SlidersHorizontal, X, RotateCcw, ArrowUpDown } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useShop();

  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popular'>('featured');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<'all' | 'under-50' | '50-100' | 'over-100'>('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const availableColors = [
    { label: 'Semua Warna', value: 'All' },
    { label: 'Strawberry Pink', value: 'Pink', hex: '#E99AA8' },
    { label: 'Butter Yellow', value: 'Yellow', hex: '#F6E7A6' },
    { label: 'Cream', value: 'Cream', hex: '#FFF8EC' },
    { label: 'Sage Green', value: 'Sage', hex: '#A8B69A' },
    { label: 'Cherry Red', value: 'Cherry', hex: '#B94B50' }
  ];

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesMaterial = product.material.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesMaterial) {
          return false;
        }
      }

      // Color filter
      if (selectedColorFilter !== 'All') {
        const hasColor = product.colors.some((c) =>
          c.name.toLowerCase().includes(selectedColorFilter.toLowerCase())
        );
        if (!hasColor) return false;
      }

      // Price filter
      if (priceRange === 'under-50' && product.price >= 50000) return false;
      if (priceRange === '50-100' && (product.price < 50000 || product.price > 100000)) return false;
      if (priceRange === 'over-100' && product.price <= 100000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popular') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedCategory, searchQuery, selectedColorFilter, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedColorFilter('All');
    setPriceRange('all');
    setSortBy('featured');
  };

  const isFiltered =
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    selectedColorFilter !== 'All' ||
    priceRange !== 'all' ||
    sortBy !== 'featured';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* Header and Search */}
      <div className="space-y-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#B94B50] mb-1">
            <span>Katalog Lengkap</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#60463E]">
            {selectedCategory === 'All' ? 'Semua Koleksi Buttonberry' : selectedCategory}
          </h1>
          <p className="text-sm text-[#60463E]/70 mt-1 max-w-xl">
            Aksesori fungsional bernuansa vintage dan playful untuk menemani keseharianmu.
          </p>
        </div>

        {/* Search input in page */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60463E]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, model, warna, atau bahan..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#E99AA8]/40 rounded-full focus:outline-none focus:border-[#B94B50] text-[#60463E] placeholder-[#60463E]/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#60463E]/50 hover:text-[#60463E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Horizontal Carousel on Mobile / Segmented Control */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
            selectedCategory === 'All'
              ? 'bg-[#B94B50] text-[#FFF8EC] shadow-xs'
              : 'bg-white border border-[#E99AA8]/40 text-[#60463E] hover:border-[#B94B50]'
          }`}
        >
          Semua ({products.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === cat.name
                ? 'bg-[#B94B50] text-[#FFF8EC] shadow-xs'
                : 'bg-white border border-[#E99AA8]/40 text-[#60463E] hover:border-[#B94B50]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Toolbar: Filters, Sort, and Item Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#E99AA8]/30">
        
        {/* Left: Filter Toggle & Active tags */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[#E99AA8]/50 bg-[#FFF8EC] hover:bg-[#F6E7A6]/20 text-xs font-semibold text-[#60463E] flex items-center gap-2 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B94B50]" />
            <span>Filter Tambahan</span>
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-[#B94B50]" />
            )}
          </button>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#B94B50] hover:underline flex items-center gap-1 font-medium ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Sort and Count */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-[#60463E]/60 hidden sm:inline">
            Menampilkan <strong>{filteredProducts.length}</strong> produk
          </span>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#60463E]/60 hidden xs:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium bg-[#FFF8EC] border border-[#E99AA8]/40 rounded-xl px-3 py-2 text-[#60463E] focus:outline-none focus:border-[#B94B50]"
            >
              <option value="featured">Urutan: Rekomendasi</option>
              <option value="newest">Urutan: Terbaru</option>
              <option value="price-asc">Harga: Terendah ke Tertinggi</option>
              <option value="price-desc">Harga: Tertinggi ke Terendah</option>
              <option value="popular">Popularitas & Rating</option>
            </select>
          </div>
        </div>

      </div>

      {/* Expanded Filter Panel */}
      {mobileFilterOpen && (
        <div className="p-5 bg-white rounded-2xl border border-[#E99AA8]/40 space-y-5 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E99AA8]/20 pb-3">
            <h3 className="font-serif text-base font-bold text-[#60463E]">
              Filter Detail Produk
            </h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="p-1 text-[#60463E]/60 hover:text-[#60463E]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#60463E]">
                Rentang Harga
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Semua Harga', value: 'all' },
                  { label: '< Rp50.000', value: 'under-50' },
                  { label: 'Rp50.000 - Rp100.000', value: '50-100' },
                  { label: '> Rp100.000', value: 'over-100' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setPriceRange(range.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      priceRange === range.value
                        ? 'bg-[#B94B50] text-[#FFF8EC]'
                        : 'bg-[#FFF8EC] text-[#60463E] hover:bg-[#F6E7A6]/30'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#60463E]">
                Pilihan Nuansa Warna
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColorFilter(c.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedColorFilter === c.value
                        ? 'bg-[#60463E] text-[#FFF8EC]'
                        : 'bg-[#FFF8EC] text-[#60463E] hover:bg-[#F6E7A6]/30 border border-[#E99AA8]/20'
                    }`}
                  >
                    {c.hex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                    )}
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="px-5 py-2 text-xs font-semibold bg-[#B94B50] text-white rounded-full"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E99AA8]/40 p-10 sm:p-16 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#FFF8EC] rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs border border-[#E99AA8]/30">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[#60463E]">
              Tidak Ada Aksesori Ditemukan
            </h3>
            <p className="text-xs text-[#60463E]/70 max-w-xs mx-auto">
              Coba sesuaikan kata kunci pencarian atau bersihkan filter untuk melihat koleksi lainnya.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-[#B94B50] hover:bg-[#a03d42] text-[#FFF8EC] rounded-full text-xs font-semibold shadow-xs transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

    </div>
  );
};
