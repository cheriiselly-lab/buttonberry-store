import React from 'react';
import { useShop } from '../context/ShopContext.tsx';
import { CheckCircle2, Heart, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'text-[#B94B50]';
        let bgStyle = 'bg-[#FFF8EC] border-[#E99AA8]';

        if (toast.type === 'favorite') {
          Icon = Heart;
          iconColor = 'text-[#B94B50] fill-[#B94B50]';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'text-[#A8B69A]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-lg border text-sm text-[#60463E] ${bgStyle} animate-in fade-in slide-in-from-top-2 duration-200`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <span className="font-medium leading-tight">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#60463E]/50 hover:text-[#60463E] p-1 rounded transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
