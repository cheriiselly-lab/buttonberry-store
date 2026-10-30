import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useShop } from '../../context/ShopContext.tsx';
import { Settings, Save, ShieldCheck, Store, Truck, MapPin, Phone } from 'lucide-react';

export const AdminStoreSettingsPage: React.FC = () => {
  const { token } = useAdminAuth();
  const { storeSettings, refreshSettings, showToast } = useShop();

  const [formData, setFormData] = useState(storeSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(storeSettings);
  }, [storeSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showToast('Pengaturan toko berhasil diperbarui!', 'success');
        refreshSettings();
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
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
          Pengaturan Toko Buttonberry
        </h1>
        <p className="text-xs text-[#60463E]/70 mt-1">
          Kelola profil toko, kontak studio, batas gratis ongkos kirim, dan status ketersediaan toko online.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Profile Toko */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E99AA8]/30 space-y-4 shadow-2xs">
          <h2 className="font-serif text-base font-bold text-[#60463E] flex items-center gap-2">
            <Store className="w-4 h-4 text-[#B94B50]" />
            <span>Identitas & Profil Toko</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Nama Brand / Toko</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#60463E]">Deskripsi Singkat Toko</label>
              <input
                type="text"
                value={formData.storeDescription}
                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Status Ketersediaan Toko</label>
              <select
                value={formData.storeAvailability}
                onChange={(e) => setFormData({ ...formData, storeAvailability: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              >
                <option value="open">Buka (Menerima Pesanan)</option>
                <option value="closed">Tutup Sementara (Maintenance)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Mata Uang Utama</label>
              <input
                type="text"
                disabled
                value="Indonesian Rupiah (IDR)"
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/30 bg-slate-100 text-[#60463E]/60 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Kontak & Alamat Studio */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E99AA8]/30 space-y-4 shadow-2xs">
          <h2 className="font-serif text-base font-bold text-[#60463E] flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#A8B69A]" />
            <span>Kontak & Alamat Studio</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Email Dukungan / Pesanan</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">WhatsApp Hotline</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Instagram URL</label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">TikTok URL</label>
              <input
                type="text"
                value={formData.tiktokUrl}
                onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#60463E]">Alamat Studio & Pengiriman</label>
              <input
                type="text"
                value={formData.storeAddress}
                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pengaturan Ongkir */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E99AA8]/30 space-y-4 shadow-2xs">
          <h2 className="font-serif text-base font-bold text-[#60463E] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#B94B50]" />
            <span>Aturan Ongkos Kirim</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Tarif Standar Ekspedisi (IDR)</label>
              <input
                type="number"
                value={formData.standardShippingFee}
                onChange={(e) => setFormData({ ...formData, standardShippingFee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#60463E]">Batas Minimal Bebas Ongkir (IDR)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-[#60463E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-3 bg-[#B94B50] hover:bg-[#a03d42] text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            {isSaving ? (
              <span>Menyimpan Pengaturan...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Toko</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
