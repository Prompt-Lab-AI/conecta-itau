import React from 'react';

interface Props {
  imageUrl: string;
  imageTitle: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<Props> = ({ imageUrl, imageTitle, onClose }) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
        <div className="bg-[#2D3C4F] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="material-symbols-outlined text-xl">image</span>
            <span className="font-bold text-xs truncate">{imageTitle}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-hidden">
          <img
            src={imageUrl}
            alt={imageTitle}
            className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-md"
          />
        </div>

        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600">Foto armazenada no banco oficial Conecta Itaú</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#003781] hover:bg-[#174EA6] text-white font-bold rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
