import React, { useState } from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, ChevronDown } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast, storeSettings } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Pertanyaan Produk');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSent(true);
    showToast('Pesanmu telah terkirim! Tim Buttonberry akan segera membalas.', 'success');
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setIsSent(false);
    }, 2500);
  };

  const faqs = [
    {
      q: 'Berapa lama estimasi pengiriman paket Buttonberry?',
      a: 'Pesanan diproses dalam 1x24 jam kerja (Senin - Sabtu). Untuk wilayah Pulau Jawa estimasi sampai 1-3 hari kerja, sedangkan luar Pulau Jawa 3-5 hari kerja tergantung kurir yang dipilih.'
    },
    {
      q: 'Bagaimana cara merawat dan mencuci produk kain Buttonberry?',
      a: 'Gunakan air dingin dengan sabun cair lembut. Cuci perlahan menggunakan tangan (hand wash), jangan disikat kasar pada bagian bordir dan kancing. Keringkan di tempat teduh tanpa terkena matahari langsung.'
    },
    {
      q: 'Apakah Buttonberry menyediakan kemasan kado (Gift Wrapping)?',
      a: 'Ya! Setiap pesanan Buttonberry secara standar sudah dikemas cantik dengan kertas roti bertema vintage, stempel lilin/pita manis, dan kartu ucapan. Kamu juga bisa menuliskan pesan khusus pada kolom catatan pesanan.'
    },
    {
      q: 'Apakah bisa melakukan penukaran barang jika terjadi cacat produksi?',
      a: 'Tentu saja. Kami memberikan garansi retur/tukar 100% tanpa biaya tambahan apabila barang yang kamu terima memiliki cacat jahitan atau kancing lepas dalam waktu 3 hari setelah paket diterima.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 sm:pb-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E99AA8]/20 text-[#B94B50] text-xs font-semibold uppercase tracking-wider mb-2">
          <span>💌</span>
          <span>Letters & Inquiries</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#60463E]">
          Hubungi Buttonberry
        </h1>
        <p className="text-xs sm:text-sm text-[#60463E]/70 mt-1">
          Punya pertanyaan seputar pesanan, kolaborasi, atau sekadar ingin menyapa? Kami selalu senang mendengar ceritamu.
        </p>
      </div>

      {/* Grid: Contact Cards & Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Sidebar */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#FFF8EC] rounded-2xl p-5 border-2 border-[#F6E7A6] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#60463E] border-b border-[#60463E]/10 pb-2">
              Kanal Resmi
            </h3>

            <div className="space-y-3.5 text-xs text-[#60463E]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#B94B50]/15 text-[#B94B50] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">WhatsApp Customer Care</div>
                  <a
                    href="https://wa.me/6281298765432"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#B94B50] hover:underline"
                  >
                    {storeSettings.whatsappNumber || '+62 812-9876-5432'}
                  </a>
                  <div className="text-[10px] text-[#60463E]/60 mt-0.5">Balasan cepat dalam hitungan menit</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E99AA8]/20 text-[#B94B50] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">Email Korespondensi</div>
                  <a
                    href="mailto:hello@buttonberry.com"
                    className="text-[#B94B50] hover:underline"
                  >
                    {storeSettings.contactEmail || 'hello@buttonberry.com'}
                  </a>
                  <div className="text-[10px] text-[#60463E]/60 mt-0.5">Untuk pertanyaan pesanan & kemitraan</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#A8B69A]/20 text-[#60463E] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#A8B69A]" />
                </div>
                <div>
                  <div className="font-bold">Studio & Lokasi Workshop</div>
                  <p className="text-[11px] text-[#60463E]/70 leading-relaxed">
                    {storeSettings.storeAddress || 'Jl. Ciumbuleuit No. 42, Cidadap, Kota Bandung, Jawa Barat 40142'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F6E7A6]/60 text-[#60463E] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#B94B50]" />
                </div>
                <div>
                  <div className="font-bold">Jam Kerja Studio</div>
                  <p className="text-[11px] text-[#60463E]/70">Senin – Sabtu: 09:00 - 17:00 WIB</p>
                  <p className="text-[10px] text-[#60463E]/50">Minggu & Libur Nasional: Tutup</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-2xl p-5 sm:p-7 border border-[#60463E]/10 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#60463E] mb-1">Kirimkan Surat / Pertanyaan</h2>
          <p className="text-xs text-[#60463E]/70 mb-5">
            Tuliskan pesanmu pada formulir di bawah ini. Kami akan membalas via email secepatnya.
          </p>

          {isSent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-emerald-900">Pesan Berhasil Terkirim!</h3>
              <p className="text-xs text-emerald-700">
                Terima kasih sudah menghubungi kami. Tim Buttonberry akan menanggapi dalam waktu 1x24 jam.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#60463E] mb-1.5">
                  Nama Kamu <span className="text-[#B94B50]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Nadia Safira"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#60463E] mb-1.5">
                  Alamat Email <span className="text-[#B94B50]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nadia@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#60463E] mb-1.5">Topik Pesan</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/30"
                >
                  <option value="Pertanyaan Produk">Pertanyaan Produk & Ketersediaan</option>
                  <option value="Status Pengiriman">Status Pengiriman Pesanan</option>
                  <option value="Garansi & Retur">Klaim Garansi & Retur</option>
                  <option value="Kolaborasi / Kemitraan">Kolaborasi & Kemitraan Kreatif</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#60463E] mb-1.5">
                  Isi Pesan <span className="text-[#B94B50]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ceritakan detail pertanyaan atau masukanmu..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#60463E]/20 text-xs sm:text-sm text-[#60463E] focus:outline-none focus:ring-2 focus:ring-[#B94B50]/30 focus:border-[#B94B50] bg-[#FFF8EC]/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#B94B50] text-[#FFF8EC] font-semibold text-xs sm:text-sm hover:bg-[#a03e43] shadow-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Surat</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="pt-6 border-t border-[#60463E]/10">
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#60463E]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#60463E]/70 mt-1">
            Jawaban cepat untuk pertanyaan yang paling sering ditanyakan berry friends.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#60463E]/10 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[#60463E] hover:bg-[#FFF8EC]/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#B94B50] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-[#60463E]/75 leading-relaxed border-t border-dashed border-[#60463E]/10 mt-1 bg-[#FFF8EC]/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
