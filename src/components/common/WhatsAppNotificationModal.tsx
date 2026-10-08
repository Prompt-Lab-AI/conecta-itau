import React from 'react';
import { useApp } from '../../context/AppContext';
import { openWhatsAppChat } from '../../utils/whatsapp';

export const WhatsAppNotificationModal: React.FC = () => {
  const { activeWhatsAppNotification, setActiveWhatsAppNotification } = useApp();

  if (!activeWhatsAppNotification) return null;

  const handleOpenRealWhatsApp = () => {
    openWhatsAppChat(
      activeWhatsAppNotification.recipientPhone,
      activeWhatsAppNotification.message
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#ECE5DD] rounded-xl overflow-hidden shadow-2xl border border-slate-300 transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wa-modal-title"
      >
        {/* WhatsApp Header */}
        <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30">
              <span className="material-symbols-outlined text-xl">account_balance</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm leading-tight">Prefeitura de Itaú - Notificação</span>
                <span className="material-symbols-outlined text-xs text-emerald-300">verified</span>
              </div>
              <p className="text-[11px] text-emerald-100/90 leading-tight">
                {activeWhatsAppNotification.recipientType === 'secretario' ? 'Para Secretário(a)' : 'Para Munícipe'} • {activeWhatsAppNotification.recipientPhone}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveWhatsAppNotification(null)}
            className="text-white/80 hover:text-white p-1 rounded-full transition-colors focus:outline-hidden"
            aria-label="Fechar notificação WhatsApp"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-emerald-100 text-[#075E54] text-xs px-3 py-1.5 border-b border-emerald-200 flex items-center justify-between">
          <span className="flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-sm">bolt</span>
            Disparo Instantâneo Automático via WhatsApp
          </span>
          <span className="text-[10px] text-slate-500">{activeWhatsAppNotification.timestamp}</span>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="p-4 space-y-3 min-h-[190px] max-h-[360px] overflow-y-auto">
          <div className="flex justify-center">
            <span className="text-[11px] bg-white/80 text-slate-600 px-2.5 py-0.5 rounded shadow-2xs">
              Hoje, {new Date().toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 max-w-[90%] shadow-xs text-xs text-slate-800 space-y-2 relative border border-slate-200/60">
              <div className="whitespace-pre-line leading-relaxed font-sans">
                {activeWhatsAppNotification.message}
              </div>
              <div className="text-[10px] text-slate-400 text-right flex items-center justify-end gap-1 pt-1">
                <span>{activeWhatsAppNotification.timestamp}</span>
                <span className="material-symbols-outlined text-xs text-sky-500">done_all</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="bg-white p-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] text-[#434752] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
            <span>Link direto 100% gratuito (wa.me)</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveWhatsAppNotification(null)}
              className="flex-1 sm:flex-none px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleOpenRealWhatsApp}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1EBE5D] rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>Abrir WhatsApp do {activeWhatsAppNotification.recipientType === 'secretario' ? 'Secretário' : 'Cidadão'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
