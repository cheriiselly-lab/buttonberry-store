import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useShop } from '../../context/ShopContext.tsx';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const { setActivePage, setAdminView } = useShop();

  const [email, setEmail] = useState('admin@buttonberry.com');
  const [password, setPassword] = useState('buttonberry2026');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      setAdminView('overview');
      setActivePage('admin');
    } else {
      setErrorMsg(res.error || 'Email atau password salah.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gingham-pink">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E99AA8]/40 p-7 sm:p-10 shadow-lg space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#FFF8EC] text-[#B94B50] rounded-2xl flex items-center justify-center mx-auto text-2xl border border-[#E99AA8]/40 shadow-2xs">
            🍓
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#60463E]">
            Buttonberry Control Panel
          </h1>
          <p className="text-xs text-[#60463E]/70">
            Portal otentikasi administrator untuk pemilik toko & staf
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#60463E] uppercase tracking-wider text-[11px]">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60463E]/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@buttonberry.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-sm text-[#60463E] focus:outline-none focus:border-[#B94B50]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#60463E] uppercase tracking-wider text-[11px]">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60463E]/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E99AA8]/40 bg-[#FFF8EC]/30 text-sm text-[#60463E] focus:outline-none focus:border-[#B94B50]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[46px] py-3 px-6 bg-[#B94B50] hover:bg-[#a03d42] disabled:opacity-60 text-[#FFF8EC] font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isLoading ? (
              <span>Memverifikasi Sesi...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Card */}
        <div className="p-3.5 rounded-2xl bg-[#FFF8EC] border border-[#E99AA8]/40 text-xs space-y-1 text-[#60463E]">
          <div className="flex items-center gap-1.5 font-bold text-[#B94B50] text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kredensial Akses Administrator:</span>
          </div>
          <div className="grid grid-cols-1 gap-0.5 text-[11px] font-mono text-[#60463E]/85">
            <p>Email: <span className="font-bold">admin@buttonberry.com</span></p>
            <p>Password: <span className="font-bold">buttonberry2026</span></p>
          </div>
          <p className="text-[10px] text-[#60463E]/60 pt-1">
            Terhubung langsung ke server database backend dengan enkripsi SHA-256 dan token sesi.
          </p>
        </div>

        {/* Back to storefront link */}
        <div className="text-center pt-2">
          <button
            onClick={() => setActivePage('home')}
            className="inline-flex items-center gap-1.5 text-xs text-[#60463E]/70 hover:text-[#B94B50] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Toko Buttonberry</span>
          </button>
        </div>

      </div>
    </div>
  );
};
