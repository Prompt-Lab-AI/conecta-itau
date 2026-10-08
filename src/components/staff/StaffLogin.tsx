import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const StaffLogin: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { staffUsers, loginStaff } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const found = staffUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (found) {
        setIsLoading(false);
        loginStaff(found.id);
        onClose();
      } else {
        setIsLoading(false);
        setErrorMsg('Credenciais não encontradas para o e-mail informado. Use um dos acessos rápidos abaixo para testar.');
      }
    }, 600);
  };

  const handleQuickLogin = (userId: string) => {
    loginStaff(userId);
    onClose();
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryEmail.trim()) {
      setRecoverySuccess(true);
      setTimeout(() => {
        setRecoverySuccess(false);
        setRecoveryModalOpen(false);
        setRecoveryEmail('');
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Institutional Header */}
        <div className="bg-[#2D3C4F] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-300 hover:text-white p-1 rounded-lg"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#003781] text-white flex items-center justify-center font-bold ring-2 ring-white/20">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <div>
              <h2 className="text-lg font-bold">Portal do Servidor Municipal</h2>
              <p className="text-xs text-slate-300">Prefeitura Municipal de Itaú - RN</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[#BA1A1A] text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#191C1E]">
                E-mail Institucional (@itau.rn.gov.br) *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">mail</span>
                <input
                  type="email"
                  required
                  placeholder="nome.sobrenome@itau.rn.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:ring-2 focus:ring-[#003781] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#191C1E]">
                  Senha de Acesso *
                </label>
                <button
                  type="button"
                  onClick={() => setRecoveryModalOpen(true)}
                  className="text-[11px] text-[#003781] hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">lock</span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:ring-2 focus:ring-[#003781] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#003781] hover:bg-[#174EA6] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">
                {isLoading ? 'sync' : 'login'}
              </span>
              <span>{isLoading ? 'Autenticando...' : 'Acessar Painel de Gestão'}</span>
            </button>
          </form>

          {/* Test / Quick role credentials */}
          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Acesso Rápido para Demonstração:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {staffUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u.id)}
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-[#003781] hover:bg-blue-50/60 transition-all text-xs"
                >
                  <div className="font-semibold text-slate-900 truncate">{u.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{u.roleTitle}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="bg-[#F7F9FC] p-4 border-t border-slate-200 flex items-center justify-between text-xs text-[#434752]">
          <span>Conexão segura SSL 256-bit</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Voltar ao Portal do Cidadão
          </button>
        </div>
      </div>

      {/* Recovery Modal */}
      {recoveryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-[#191C1E]">Recuperar Senha de Servidor</h3>
            <p className="text-xs text-[#434752]">
              Informe seu e-mail institucional para receber um link de redefinição autorizado pela Ouvidoria Municipal.
            </p>

            {recoverySuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold">
                Link de redefinição enviado com sucesso para sua caixa de entrada institucional!
              </div>
            ) : (
              <form onSubmit={handleRecovery} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="seu.email@itau.rn.gov.br"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRecoveryModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#003781] text-white text-xs font-bold rounded-lg"
                  >
                    Enviar Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
