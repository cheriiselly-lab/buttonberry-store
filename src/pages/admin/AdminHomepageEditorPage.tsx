import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useShop } from '../../context/ShopContext.tsx';
import { Palette, Save, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';

export const AdminHomepageEditorPage: React.FC = () => {
  const { token } = useAdminAuth();
  const { homepageContent, refreshContent, setActivePage, showToast } = useShop();

  const [formData, setFormData] = useState(homepageContent);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(homepageContent);
  }, [homepageContent]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showToast('Konten homepage berhasil disimpan & disinkronkan ke storefront!', 'success');
        refreshContent();
      }
    } catch (err: any) {
      showToast('Gagal menyimpan: ' + err.message, 'info');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
            Editor Konten Homepage
          </h1>
          <p className="text-xs text-[#60463E]/70 mt-1">
            Ubah teks headline, announcement bar, dan banner promosi storefront tanpa perlu mengubah kode program.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActivePage('home')}
            className="px-4 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-white hover:bg-[#FFF8EC] text-[#60463E] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Preview Toko</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B94B50]" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Section 1: Announcement Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E99AA8]/30 space-y-3 shadow-2xs">
          <h2 className="font-serif text-base font-bold text-[#60463E] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B94B50]" />
            <span>Pesan Announcement Bar (Paling Atas)</span>
          </h2>
          <div className="space-y-1">
            <input
              type="text"
              value={formData.announcementBar}
              onChange={(e) => setFormData({ ...formData, announcementBar: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* Section 2: Hero Section */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E99AA8]/30 space-y-4 shadow-2xs">
          <h2 className="font-serif text-base font-bold text-[#60463E]">
            Hero Banner (Tampilan Utama)
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Hero Headline</label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Hero Subheadline</label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">URL Foto Hero Flatlay</label>
              <input
                type="text"
                value={formData.heroImage}
                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Promotional Banner */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E99AA8]/30 space-y-4 shadow-2xs">
          <h2 className="font-serif text-base font-bold text-[#60463E]">
            Promotional Banner (Merah Cherry)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Label Tag Banner</label>
              <input
                type="text"
                value={formData.promoBannerTitle}
                onChange={(e) => setFormData({ ...formData, promoBannerTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Judul Utama Banner</label>
              <input
                type="text"
                value={formData.promoBannerHeading}
                onChange={(e) => setFormData({ ...formData, promoBannerHeading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#60463E]">Teks Deskripsi Promo</label>
              <input
                type="text"
                value={formData.promoBannerText}
                onChange={(e) => setFormData({ ...formData, promoBannerText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Brand Intro Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E99AA8]/30 space-y-4 shadow-2xs">
          <h2 className="font-serif text-base font-bold text-[#60463E]">
            Brand Introduction (Kisah Singkat)
          </h2>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Judul Kisah</label>
              <input
                type="text"
                value={formData.brandIntroTitle}
                onChange={(e) => setFormData({ ...formData, brandIntroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Narasi Cerita</label>
              <textarea
                rows={3}
                value={formData.brandIntroDescription}
                onChange={(e) => setFormData({ ...formData, brandIntroDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save button floating bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-3 bg-[#B94B50] hover:bg-[#a03d42] text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            {isSaving ? (
              <span>Menyimpan Perubahan...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan & Publikasikan ke Toko</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
