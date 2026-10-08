import React from 'react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgBorder = {
    success: 'bg-emerald-50 border-emerald-500 text-emerald-900',
    info: 'bg-blue-50 border-[#003781] text-[#191C1E]',
    warning: 'bg-amber-50 border-amber-500 text-amber-900',
    error: 'bg-red-50 border-[#BA1A1A] text-red-900',
  }[toast.type];

  const iconName = {
    success: 'check_circle',
    info: 'info',
    warning: 'warning',
    error: 'error',
  }[toast.type];

  const iconColor = {
    success: 'text-emerald-700',
    info: 'text-[#003781]',
    warning: 'text-amber-700',
    error: 'text-[#BA1A1A]',
  }[toast.type];

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-4 duration-200">
      <div className={`p-4 rounded-xl border-l-4 shadow-lg bg-white flex items-start gap-3 ${bgBorder}`}>
        <span className={`material-symbols-outlined text-2xl shrink-0 ${iconColor}`}>
          {iconName}
        </span>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-[#191C1E]">{toast.title}</h4>
          <p className="text-xs text-[#434752] mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};
