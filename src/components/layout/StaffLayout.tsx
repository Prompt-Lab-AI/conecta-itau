import React from 'react';
import { useApp } from '../../context/AppContext';

interface Props {
  children: React.ReactNode;
  onGoToCitizenPortal: () => void;
}

export const StaffLayout: React.FC<Props> = ({ children, onGoToCitizenPortal }) => {
  const { 
    currentStaffUser, 
    staffUsers, 
    logoutStaff, 
    switchStaffRole,
    activeStaffTab, 
    setActiveStaffTab,
    secretariats,
    alertsActive,
    enableBrowserAlerts
  } = useApp();

  const userSec = currentStaffUser?.secretariatId 
    ? secretariats.find((s) => s.id === currentStaffUser.secretariatId)
    : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7F9FC]">
      {/* Sidebar (Terciária #2D3C4F) */}
      <aside className="w-full md:w-64 bg-[#2D3C4F] text-slate-200 shrink-0 flex flex-col justify-between border-r border-slate-700/80">
        <div>
          {/* Logo & Municipal identity */}
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#003781] text-white flex items-center justify-center font-bold ring-1 ring-white/20">
                <span className="material-symbols-outlined text-xl">account_balance</span>
              </div>
              <div>
                <h1 className="font-bold text-sm text-white tracking-tight">Conecta Itaú</h1>
                <p className="text-[10px] text-slate-400">Painel do Servidor</p>
              </div>
            </div>
          </div>

          {/* User profile capsule in sidebar */}
          {currentStaffUser && (
            <div className="p-3.5 mx-3 mt-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#003781] text-white flex items-center justify-center font-bold text-xs uppercase">
                  {currentStaffUser.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="font-semibold text-white truncate">{currentStaffUser.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentStaffUser.roleTitle}</div>
                </div>
              </div>

              {userSec && (
                <div className="pt-1.5 border-t border-slate-700/80 flex items-center gap-1.5 text-[11px] text-blue-300">
                  <span className="material-symbols-outlined text-xs">apartment</span>
                  <span className="truncate">{userSec.acronym}</span>
                </div>
              )}

              {/* Fast role switcher select */}
              <div className="pt-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Alternar Perfil p/ Teste:
                </label>
                <select
                  value={currentStaffUser.id}
                  onChange={(e) => switchStaffRole(e.target.value)}
                  className="w-full bg-[#2D3C4F] border border-slate-600 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-hidden"
                >
                  {staffUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              type="button"
              onClick={() => setActiveStaffTab('atendimento')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeStaffTab === 'atendimento'
                  ? 'bg-[#003781] text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">view_kanban</span>
              <span>Painel de Atendimento</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStaffTab('gestao')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeStaffTab === 'gestao'
                  ? 'bg-[#003781] text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">analytics</span>
              <span>Visão Geral da Gestão</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStaffTab('configuracoes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeStaffTab === 'configuracoes'
                  ? 'bg-[#003781] text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">settings</span>
              <span>Configurações & SLAs</span>
            </button>
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="p-3 border-t border-slate-700 space-y-1.5">
          <button
            type="button"
            onClick={onGoToCitizenPortal}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-base">public</span>
            <span>Ver Portal do Cidadão</span>
          </button>

          <button
            type="button"
            onClick={logoutStaff}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {activeStaffTab === 'atendimento' && 'Gestão Operacional de Demandas'}
              {activeStaffTab === 'gestao' && 'Painel Executivo e Métricas'}
              {activeStaffTab === 'configuracoes' && 'Parâmetros Institucionais e Secretarias'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[#434752]">
            <button
              type="button"
              onClick={enableBrowserAlerts}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                alertsActive 
                  ? 'bg-blue-50 text-[#003781] border-blue-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title={alertsActive ? 'Alertas sonoros e notificações ativados' : 'Clique para habilitar notificações na tela'}
            >
              <span className={`material-symbols-outlined text-sm ${alertsActive ? 'text-[#003781]' : 'text-amber-700'}`}>
                {alertsActive ? 'notifications_active' : 'notifications_paused'}
              </span>
              <span>{alertsActive ? 'Alertas Ativos' : 'Ativar Avisos'}</span>
            </button>

            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-medium text-[11px] hidden sm:inline">Nuvem & WhatsApp Ativos</span>
            </div>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Itaú - RN</span>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
