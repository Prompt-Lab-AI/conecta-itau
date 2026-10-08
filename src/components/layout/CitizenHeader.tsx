import React from 'react';
import { useApp } from '../../context/AppContext';

export const CitizenHeader: React.FC<{ onOpenStaffLogin: () => void }> = ({ onOpenStaffLogin }) => {
  const { 
    activeCitizenView, 
    setActiveCitizenView, 
    setEmergencyModalOpen,
    currentStaffUser
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#003781] text-white shadow-md border-b border-[#174EA6]">
      {/* Top micro bar */}
      <div className="bg-[#00275C] px-4 py-1 text-[11px] text-blue-100/90 border-b border-blue-900/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide">ESTADO DO RIO GRANDE DO NORTE</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">PREFEITURA MUNICIPAL DE ITAÚ</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Nuvem Firestore Conectada</span>
            </span>
            <span className="hidden md:inline">|</span>
            <span className="text-blue-200 hidden sm:inline">Ouvidoria & Serviços Públicos</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">CEP 59845-000</span>
          </div>
        </div>
      </div>

      {/* Main institutional bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div 
          onClick={() => setActiveCitizenView('home')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Municipal Coat of arms inspired emblem */}
          <div className="w-10 h-10 rounded-xl bg-white text-[#003781] flex items-center justify-center font-black shadow-xs ring-2 ring-white/30 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl text-[#003781]">account_balance</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-100 transition-colors">
                Conecta Itaú
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#174EA6] text-white">
                Oficial
              </span>
            </div>
            <p className="text-[11px] text-blue-100/80 hidden sm:block">
              Prefeitura Municipal de Itaú - RN
            </p>
          </div>
        </div>

        {/* Center / Right navigation */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveCitizenView('home')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activeCitizenView === 'home' 
                ? 'bg-[#174EA6] text-white shadow-xs' 
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            Início
          </button>

          <button
            type="button"
            onClick={() => setActiveCitizenView('register')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activeCitizenView === 'register' 
                ? 'bg-[#174EA6] text-white shadow-xs' 
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            Nova Manifestação
          </button>

          <button
            type="button"
            onClick={() => setActiveCitizenView('track')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors ${
              activeCitizenView === 'track' 
                ? 'bg-[#174EA6] text-white shadow-xs' 
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Acompanhar Protocolo</span>
          </button>

          {/* Emergency SOS button */}
          <button
            type="button"
            onClick={() => setEmergencyModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#BA1A1A] hover:bg-red-700 text-white flex items-center gap-1 transition-colors shadow-xs ml-1"
            title="Telefones de Emergência Imediata"
          >
            <span className="material-symbols-outlined text-base animate-pulse">crisis_alert</span>
            <span className="hidden md:inline">Emergência</span>
          </button>

          {/* Access for Municipal Staff */}
          <button
            type="button"
            onClick={onOpenStaffLogin}
            className="ml-1 sm:ml-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-white text-[#003781] hover:bg-blue-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">badge</span>
            <span>{currentStaffUser ? 'Área do Servidor' : 'Acesso Servidor'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
