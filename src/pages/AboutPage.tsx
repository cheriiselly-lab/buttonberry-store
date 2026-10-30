import React from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { Sparkles, Heart, Scissors, Feather, ArrowRight, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useShop();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 sm:pb-16 space-y-12">
      {/* Hero Scrapbook Banner */}
      <div className="bg-[#FFF8EC] border-2 border-[#F6E7A6] rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden shadow-xs">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E99AA8]/20 text-[#B94B50] text-xs font-semibold uppercase tracking-wider mb-3">
          <span>🍓</span>
          <span>Our Little Story</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#60463E] mb-3 leading-tight">
          A Little World of <br className="hidden sm:inline" />
          <span className="italic text-[#B94B50]">Lovely Things</span>
        </h1>
        <p className="text-xs sm:text-base text-[#60463E]/80 max-w-xl mx-auto leading-relaxed">
          Buttonberry lahir dari kecintaan pada benda-benda mungil, buku kliping antik, pola gingham yang hangat, dan keajaiban hari-hari biasa.
        </p>

        {/* Decorative Tape Strip */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#F6E7A6]/80 -rotate-2 shadow-xs border-y border-[#60463E]/10" />
      </div>

      {/* Story Narrative & Values */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 relative">
          <div className="aspect-4/5 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-[#FFF8EC] rotate-1 hover:rotate-0 transition-transform duration-300">
            <img
              src="/images/about-workshop-flatlay.jpg"
              alt="Buttonberry Workshop"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Scrapbook pin decoration */}
          <div className="absolute -bottom-3 -right-2 px-3 py-1.5 rounded-full bg-[#B94B50] text-[#FFF8EC] text-[10px] font-bold shadow-md uppercase tracking-wider">
            Handcrafted with Love
          </div>
        </div>

        <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-[#60463E]/85 leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-[#60463E]">
            Mengubah Keseharian Menjadi Potongan Kebahagiaan
          </h2>
          <p>
            Di Buttonberry, kami percaya bahwa barang yang paling sering kita sentuh—tote bag belanjaan, dompet koin, kantong pensil, hingga gantungan kunci—berhak memiliki jiwa dan cerita.
          </p>
          <p>
            Terinspirasi oleh toko alat tulis kuno di Eropa dan rak-rak kerajinan tangan vintage, setiap produk kami dibuat dengan perhatian pada detail kecil: kancing kayu alami, renda katun lembut, bordir strawberry manis, dan bahan yang tahan banting untuk menemani harimu.
          </p>
          <blockquote className="p-4 rounded-2xl bg-[#F6E7A6]/30 border-l-4 border-[#B94B50] font-serif italic text-sm text-[#60463E]">
            "Little Things, Lovely Days. Karena hari yang indah sering kali tersusun dari hal-hal yang paling mungil."
          </blockquote>
        </div>
      </div>

      {/* The 4 Buttonberry Values */}
      <div className="pt-6">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
            Nilai di Balik Setiap Kancing
          </h2>
          <p className="text-xs sm:text-sm text-[#60463E]/70 mt-1">
            Empat pilar yang selalu kami sematkan dalam setiap jahitan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-[#60463E]/10 shadow-xs hover:border-[#E99AA8] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#E99AA8]/20 text-[#B94B50] flex items-center justify-center mb-3">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#60463E] mb-1">
              Functional Fashion
            </h3>
            <p className="text-xs text-[#60463E]/75 leading-relaxed">
              Tidak sekadar manis dipandang, semua produk kami dirancang fungsional untuk kebutuhan harian: kompartemen teratur, resleting halus, dan bahan kuat.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#60463E]/10 shadow-xs hover:border-[#F6E7A6] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F6E7A6]/50 text-[#60463E] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-[#B94B50]" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#60463E] mb-1">
              Nostalgic Whimsy
            </h3>
            <p className="text-xs text-[#60463E]/75 leading-relaxed">
              Pola gingham klasik, kain linen bertekstur, kancing vintage, dan detail pita mengembalikan kehangatan kenangan masa kecil yang menyenangkan.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#60463E]/10 shadow-xs hover:border-[#A8B69A] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#A8B69A]/20 text-[#60463E] flex items-center justify-center mb-3">
              <Heart className="w-5 h-5 text-[#A8B69A]" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#60463E] mb-1">
              Ethical & Small Batch
            </h3>
            <p className="text-xs text-[#60463E]/75 leading-relaxed">
              Diproduksi dalam jumlah terbatas bersama penjahit lokal untuk memastikan standar kualitas tinggi dan meminimalkan limbah kain produksi.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#60463E]/10 shadow-xs hover:border-[#B94B50] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#B94B50]/15 text-[#B94B50] flex items-center justify-center mb-3">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#60463E] mb-1">
              Little Joy in Everyday Life
            </h3>
            <p className="text-xs text-[#60463E]/75 leading-relaxed">
              Kemasan ramah lingkungan dengan kartu ucapan bertinta stempel vintage, siap menjadi kado manis bagi orang terkasih atau self-reward istimewa.
            </p>
          </div>
        </div>
      </div>

      {/* Workshop Location Note */}
      <div className="bg-[#FFF8EC] rounded-2xl p-6 border border-[#60463E]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#B94B50] text-white flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif font-bold text-[#60463E] text-sm sm:text-base">
              Buttonberry Studio & Workshop
            </div>
            <div className="text-xs text-[#60463E]/70">
              Jl. Ciumbuleuit No. 42, Kota Bandung, Jawa Barat 40142
            </div>
          </div>
        </div>

        <button
          onClick={() => setActivePage('shop')}
          className="px-5 py-2.5 rounded-full bg-[#B94B50] text-[#FFF8EC] text-xs font-semibold hover:bg-[#a03e43] transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Jelajahi Koleksi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
