import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { CATEGORIES, DEMO_REVIEWS } from '../data/products.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ArrowRight, Sparkles, Star, Package, ShieldCheck, Mail, Check } from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    products,
    homepageContent,
    setActivePage,
    setSelectedCategory,
    showToast
  } = useShop();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActivePage('shop');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Mohon masukkan alamat email yang valid', 'info');
      return;
    }
    setNewsletterSubscribed(true);
    showToast('Terima kasih! Kamu telah berlangganan Letters from Buttonberry 💌', 'success');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-4 sm:pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFF8EC] rounded-3xl border border-[#E99AA8]/40 p-6 sm:p-10 lg:p-14 relative shadow-sm overflow-hidden bg-gingham-pink">
            
            {/* Scrapbook corner stickers */}
            <div className="absolute -top-3 -right-3 w-20 h-8 bg-[#F6E7A6] rotate-12 opacity-80 border border-[#60463E]/20 flex items-center justify-center text-[11px] font-script font-bold text-[#60463E]">
              Handcrafted
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Headline & Editorial Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                {/* Brand Tagline Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E99AA8]/50 shadow-2xs">
                  <span className="text-sm">🍓</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#B94B50]">
                    Little Things, Lovely Days
                  </span>
                </div>

                <div className="space-y-3">
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#60463E] leading-[1.15] text-balance">
                    {homepageContent?.heroHeadline || 'Small Things, Big Whimsy.'}
                  </h1>
                  <p className="text-base sm:text-lg text-[#60463E]/80 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                    {homepageContent?.heroSubtitle || 'Aksesori kecil untuk menemani hari-harimu yang penuh cerita.'}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setActivePage('shop');
                    }}
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#B94B50] hover:bg-[#a03d42] text-[#FFF8EC] font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-95"
                  >
                    <span>Shop the Collection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActivePage('about')}
                    className="w-full sm:w-auto px-7 py-3.5 bg-white/90 hover:bg-white text-[#60463E] border border-[#E99AA8]/60 font-semibold text-sm rounded-full shadow-2xs hover:shadow-xs transition-all active:scale-95"
                  >
                    Meet Buttonberry
                  </button>
                </div>

                {/* Trust mini bar */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-[#60463E]/75 border-t border-[#E99AA8]/20">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#B94B50]" />
                    <span>Desain Orisinal & Unik</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#A8B69A]" />
                    <span>Packaging Kado Cantik</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#B94B50]" />
                    <span>Garansi 100% Kualitas</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Hero Showcase Image with Scrapbook Frame */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="absolute inset-0 bg-[#F6E7A6]/50 rounded-3xl transform rotate-2 translate-x-2 translate-y-2 border border-[#60463E]/10" />
                  
                  <div className="relative bg-white p-3 rounded-3xl border border-[#E99AA8]/40 shadow-md">
                    <div className="aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden relative">
                      <img
                        src={homepageContent?.heroImage || '/images/hero-buttonberry-collection.jpg'}
                        alt="Buttonberry Flatlay Collection"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between px-2 text-xs">
                      <span className="font-script text-base text-[#B94B50] font-bold">
                        "Made for everyday adventures"
                      </span>
                      <span className="text-[10px] text-[#60463E]/60 uppercase tracking-widest font-mono">
                        Vol. 01 / 2026
                      </span>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-[#E99AA8]/50 shadow-md flex items-center gap-3 max-w-[210px] hidden sm:flex">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF8EC] flex items-center justify-center shrink-0 border border-[#E99AA8]/30">
                      🍓
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#B94B50]">
                        Loved by many
                      </p>
                      <p className="text-xs font-serif font-semibold text-[#60463E] leading-tight">
                        Strawberry Picnic Tote
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8 sm:mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#B94B50]">
            Pilih Sesuai Suasana Hatimu
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#60463E]">
            Jelajahi Kategori Pilihan
          </h2>
          <p className="text-sm text-[#60463E]/70 max-w-lg mx-auto">
            Temukan aksesoris praktis yang siap mempercantik harimu dari ujung tas hingga gantungan kunci.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group text-left bg-white rounded-2xl border border-[#E99AA8]/30 p-2.5 sm:p-3 hover:border-[#B94B50] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-[#FFF8EC] mb-2.5 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute bottom-2 right-2 bg-white/90 text-[#60463E] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs">
                  {cat.itemCount} Item
                </span>
              </div>

              <div>
                <h3 className="font-serif text-sm font-bold text-[#60463E] group-hover:text-[#B94B50] transition-colors leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#60463E]/60 line-clamp-1 mt-0.5">
                  {cat.tagline}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. BESTSELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#B94B50] mb-1">
              <Star className="w-3.5 h-3.5 fill-[#B94B50]" />
              <span>Paling Dicintai</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#60463E]">
              Bestseller Buttonberry
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActivePage('shop');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B94B50] hover:text-[#a03d42] transition-colors group"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BRAND INTRODUCTION (SCRAPBOOK STORY CARD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF8EC] rounded-3xl border border-[#E99AA8]/50 p-6 sm:p-12 relative overflow-hidden bg-gingham-yellow shadow-xs">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-2xl sm:text-3xl">🧵 🍓 ✨</span>
            
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#60463E] text-balance">
              "{homepageContent?.brandIntroTitle || 'A Little World of Lovely Things.'}"
            </h2>

            <p className="text-base sm:text-lg text-[#60463E]/85 leading-relaxed font-normal">
              {homepageContent?.brandIntroDescription ||
                'Di Buttonberry, kami percaya bahwa benda sehari-hari juga bisa punya cerita. Dari tas untuk menemani petualangan hingga gantungan kecil yang membuatmu tersenyum, setiap detail dirancang agar fungsional sekaligus penuh karakter.'}
            </p>

            <div className="pt-2">
              <button
                onClick={() => setActivePage('about')}
                className="px-8 py-3.5 bg-[#60463E] hover:bg-[#4b352e] text-[#FFF8EC] font-semibold text-sm rounded-full shadow-md transition-all active:scale-95"
              >
                Our Story — Kisah Buttonberry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#A8B69A] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Baru Saja Mendarat di Studio</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#60463E]">
              Koleksi Terbaru
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActivePage('shop');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B94B50] hover:text-[#a03d42] transition-colors group"
          >
            <span>Jelajahi Katalog Lengkap</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#B94B50] text-[#FFF8EC] p-8 sm:p-14 relative overflow-hidden shadow-lg">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute top-4 right-8 text-6xl opacity-20 pointer-events-none select-none font-serif">
            🍓
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block bg-[#F6E7A6] text-[#60463E] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {homepageContent?.promoBannerTitle || 'Collect Little Joys'}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-balance leading-tight">
              {homepageContent?.promoBannerHeading || 'Temukan aksesori yang terasa seperti kamu.'}
            </h2>
            <p className="text-sm sm:text-base text-[#FFF8EC]/90 leading-relaxed max-w-lg">
              {homepageContent?.promoBannerText || 'Setiap potongan dirancang untuk tahan lama, praktis, dan memberi warna manis pada outfit harianmu.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setActivePage('shop');
                }}
                className="px-7 py-3 bg-[#FFF8EC] text-[#B94B50] hover:bg-white font-semibold text-sm rounded-full shadow-md transition-all active:scale-95"
              >
                Explore All Products
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F6E7A6]/60 rounded-full text-xs font-semibold text-[#60463E]">
            <span>Ulasan Pelanggan</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#60463E]">
            Kata Mereka tentang Buttonberry
          </h2>
          <p className="text-sm text-[#60463E]/70 max-w-md mx-auto">
            Cerita manis dari pembeli yang membawa pulang teman kecil mereka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-[#E99AA8]/30 p-6 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow relative"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F6E7A6] text-[#F6E7A6]" />
                  ))}
                </div>

                <p className="text-sm text-[#60463E]/85 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E99AA8]/15 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#60463E]">{review.author}</p>
                  <p className="text-[#60463E]/60 text-[11px]">{review.city}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium text-[#B94B50] bg-[#FFF8EC] px-2 py-0.5 rounded-md border border-[#E99AA8]/30">
                    {review.item}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF8EC] rounded-3xl border border-[#E99AA8]/50 p-6 sm:p-12 text-center space-y-6 shadow-sm bg-gingham-pink">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-xl shadow-xs border border-[#E99AA8]/40">
            💌
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
              {homepageContent?.newsletterHeading || 'Letters from Buttonberry'}
            </h2>
            <p className="text-sm text-[#60463E]/80 max-w-md mx-auto">
              {homepageContent?.newsletterDescription || 'Dapatkan kabar koleksi terbaru, cerita kecil dari meja pengrajin, dan kejutan manis diskon pembuka.'}
            </p>
          </div>

          {newsletterSubscribed ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-[#A8B69A]/20 border border-[#A8B69A] text-[#60463E] rounded-full text-sm font-semibold">
              <Check className="w-4 h-4 text-[#A8B69A]" />
              <span>Hore! Emailmu sudah terdaftar di surat berkala kami.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60463E]/40" />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Masukkan alamat email kamu..."
                  className="w-full pl-10 pr-4 py-3 bg-white text-sm border border-[#E99AA8]/50 rounded-full focus:outline-none focus:border-[#B94B50] text-[#60463E]"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#B94B50] hover:bg-[#a03d42] text-[#FFF8EC] font-semibold text-xs uppercase tracking-wider rounded-full shadow-xs transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[11px] text-[#60463E]/60">
            Kami menghormati privasimu. Tanpa spam, hanya kabar manis.
          </p>
        </div>
      </section>

    </div>
  );
};
