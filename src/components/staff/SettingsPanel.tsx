import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Secretariat, StaffUser, UserRole } from '../../types';

export const SettingsPanel: React.FC = () => {
  const { 
    secretariats, 
    staffUsers, 
    addSecretariat, 
    updateSecretariat, 
    deleteSecretariat,
    addStaffUser,
    deleteStaffUser,
    resetToInitialData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'setores' | 'usuarios' | 'prazos'>('setores');

  // Modal: Nova Secretaria
  const [secModalOpen, setSecModalOpen] = useState(false);
  const [editingSec, setEditingSec] = useState<Secretariat | null>(null);
  const [secName, setSecName] = useState('');
  const [secAcronym, setSecAcronym] = useState('');
  const [secSecretary, setSecSecretary] = useState('');
  const [secPhone, setSecPhone] = useState('');
  const [secWhatsapp, setSecWhatsapp] = useState('');
  const [secEmail, setSecEmail] = useState('');
  const [secSla, setSecSla] = useState(5);
  const [secServicesStr, setSecServicesStr] = useState('');

  // Modal: Novo Servidor
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('atendente');
  const [userRoleTitle, setUserRoleTitle] = useState('');
  const [userSecId, setUserSecId] = useState(secretariats[0]?.id || '');
  const [userPhone, setUserPhone] = useState('');

  // SLAs custom configuration simulation
  const [slaBaixa, setSlaBaixa] = useState(7);
  const [slaMedia, setSlaMedia] = useState(5);
  const [slaAlta, setSlaAlta] = useState(3);
  const [slaUrgente, setSlaUrgente] = useState(1);
  const [waAutoNotify, setWaAutoNotify] = useState(true);
  const [waSecretaryNotify, setWaSecretaryNotify] = useState(true);

  const openNewSecModal = () => {
    setEditingSec(null);
    setSecName('');
    setSecAcronym('');
    setSecSecretary('');
    setSecPhone('(84) 3376-0120');
    setSecWhatsapp('(84) 99812-4000');
    setSecEmail('contato@itau.rn.gov.br');
    setSecSla(5);
    setSecServicesStr('Serviço 1, Serviço 2, Serviço 3');
    setSecModalOpen(true);
  };

  const openEditSecModal = (sec: Secretariat) => {
    setEditingSec(sec);
    setSecName(sec.name);
    setSecAcronym(sec.acronym);
    setSecSecretary(sec.secretaryName);
    setSecPhone(sec.phone);
    setSecWhatsapp(sec.whatsapp);
    setSecEmail(sec.email);
    setSecSla(sec.defaultSlaDays);
    setSecServicesStr(sec.services.join(', '));
    setSecModalOpen(true);
  };

  const handleSaveSec = (e: React.FormEvent) => {
    e.preventDefault();
    const services = secServicesStr.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingSec) {
      updateSecretariat(editingSec.id, {
        name: secName,
        acronym: secAcronym,
        secretaryName: secSecretary,
        phone: secPhone,
        whatsapp: secWhatsapp,
        email: secEmail,
        defaultSlaDays: secSla,
        services: services.length > 0 ? services : ['Atendimento Geral']
      });
    } else {
      addSecretariat({
        name: secName,
        acronym: secAcronym,
        secretaryName: secSecretary,
        phone: secPhone,
        whatsapp: secWhatsapp,
        email: secEmail,
        defaultSlaDays: secSla,
        icon: 'account_balance',
        color: '#003781',
        services: services.length > 0 ? services : ['Atendimento Geral']
      });
    }

    setSecModalOpen(false);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    addStaffUser({
      name: userName,
      email: userEmail,
      role: userRole,
      roleTitle: userRoleTitle || (userRole === 'secretario' ? 'Secretário Municipal' : 'Atendente de Protocolo'),
      secretariatId: userRole === 'secretario' ? userSecId : undefined,
      phone: userPhone,
      active: true
    });
    setUserModalOpen(false);
    setUserName('');
    setUserEmail('');
    setUserPhone('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#191C1E]">Configurações da Plataforma</h1>
        <p className="text-xs sm:text-sm text-[#434752]">
          Parametrização de secretarias, cadastro de servidores municipais, prazos regulamentares e notificações.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('setores')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'setores'
              ? 'border-[#003781] text-[#003781]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">apartment</span>
          <span>Setores e Serviços ({secretariats.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('usuarios')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'usuarios'
              ? 'border-[#003781] text-[#003781]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">group</span>
          <span>Usuários e Acessos ({staffUsers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('prazos')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'prazos'
              ? 'border-[#003781] text-[#003781]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">tune</span>
          <span>Prazos SLAs e WhatsApp</span>
        </button>
      </div>

      {/* TAB 1: SETORES E SERVIÇOS */}
      {activeTab === 'setores' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#434752]">
              Secretarias do Município de Itaú-RN responsáveis pelo atendimento das manifestações:
            </p>
            <button
              type="button"
              onClick={openNewSecModal}
              className="px-3.5 py-2 bg-[#003781] hover:bg-[#174EA6] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Cadastrar Nova Secretaria</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secretariats.map((sec) => (
              <div
                key={sec.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003781] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-xl">{sec.icon || 'apartment'}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#191C1E]">{sec.name}</h3>
                      <span className="text-xs font-bold text-[#003781]">{sec.acronym}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditSecModal(sec)}
                      className="p-1.5 text-slate-500 hover:text-[#003781] hover:bg-slate-100 rounded-lg"
                      title="Editar Secretaria"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    {secretariats.length > 2 && (
                      <button
                        type="button"
                        onClick={() => deleteSecretariat(sec.id)}
                        className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        title="Remover Secretaria"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 bg-[#F7F9FC] p-3 rounded-lg">
                  <p><strong>Titular / Secretário:</strong> {sec.secretaryName}</p>
                  <p><strong>WhatsApp Oficial:</strong> {sec.whatsapp}</p>
                  <p><strong>E-mail:</strong> {sec.email}</p>
                  <p><strong>SLA Regulamentar:</strong> {sec.defaultSlaDays} dias úteis</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Serviços Vinculados ({sec.services.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sec.services.map((serv, i) => (
                      <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {serv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: USUÁRIOS E ACESSOS */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#434752]">
              Controle de servidores, secretários e administradores do Conecta Itaú:
            </p>
            <button
              type="button"
              onClick={() => {
                setUserName('');
                setUserEmail('');
                setUserPhone('(84) 99812-');
                setUserRoleTitle('');
                setUserModalOpen(true);
              }}
              className="px-3.5 py-2 bg-[#003781] hover:bg-[#174EA6] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Cadastrar Novo Servidor</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9FC] text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Nome do Servidor</th>
                  <th className="p-3.5">E-mail Institucional</th>
                  <th className="p-3.5">Perfil de Acesso</th>
                  <th className="p-3.5">Secretaria Vinculada</th>
                  <th className="p-3.5">Telefone / WhatsApp</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {staffUsers.map((user) => {
                  const sec = secretariats.find((s) => s.id === user.secretariatId);

                  return (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">
                        {user.name}
                        <div className="text-[10px] font-normal text-slate-500">{user.roleTitle}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{user.email}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'secretario' ? 'bg-blue-100 text-[#003781]' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {sec ? `${sec.acronym}` : 'Geral / Ouvidoria'}
                      </td>
                      <td className="p-3.5 text-slate-600">{user.phone}</td>
                      <td className="p-3.5 text-right">
                        {staffUsers.length > 2 && (
                          <button
                            type="button"
                            onClick={() => deleteStaffUser(user.id)}
                            className="p-1 text-slate-400 hover:text-red-700"
                            title="Remover Servidor"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRAZOS SLAS E WHATSAPP */}
      {activeTab === 'prazos' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#191C1E]">Prazos Regulamentares de SLA por Gravidade</h3>
            <p className="text-xs text-[#434752]">
              Defina a quantidade máxima de dias para conclusão do chamado a partir da abertura pelo cidadão:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-700 block">Prioridade Baixa</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={slaBaixa}
                  onChange={(e) => setSlaBaixa(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded font-bold"
                />
                <span className="text-[10px] text-slate-400">dias úteis</span>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-1">
                <span className="text-xs font-bold text-blue-900 block">Prioridade Média</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={slaMedia}
                  onChange={(e) => setSlaMedia(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-blue-300 rounded font-bold"
                />
                <span className="text-[10px] text-blue-600">dias úteis</span>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-1">
                <span className="text-xs font-bold text-amber-900 block">Prioridade Alta</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={slaAlta}
                  onChange={(e) => setSlaAlta(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-amber-300 rounded font-bold"
                />
                <span className="text-[10px] text-amber-600">dias úteis</span>
              </div>

              <div className="p-3 bg-red-50/50 rounded-xl border border-red-200 space-y-1">
                <span className="text-xs font-bold text-red-900 block">Urgência Imediata</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={slaUrgente}
                  onChange={(e) => setSlaUrgente(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-red-300 rounded font-bold text-red-700"
                />
                <span className="text-[10px] text-red-600">dias úteis</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Automation Rules */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <span className="material-symbols-outlined text-2xl">chat</span>
              <h3 className="font-bold text-sm">Disparos Automáticos via WhatsApp Municipal</h3>
            </div>
            <p className="text-xs text-[#434752]">
              Parâmetros de envio em conformidade com as regras de negócio de Itaú-RN:
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waSecretaryNotify}
                  onChange={(e) => setWaSecretaryNotify(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded"
                />
                <div>
                  <span className="font-bold text-emerald-950 block">
                    Alerta instantâneo no WhatsApp do Secretário / Coordenador da Pasta
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    O titular da secretaria recebe uma mensagem com o resumo, protocolo e prioridade assim que o munícipe registra a manifestação.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waAutoNotify}
                  onChange={(e) => setWaAutoNotify(e.target.checked)}
                  className="w-4 h-4 text-[#003781] rounded"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Notificar Munícipe a cada mudança de status e despacho
                  </span>
                  <span className="text-[11px] text-slate-600">
                    O cidadão recebe aviso no WhatsApp com o parecer emitido pela prefeitura.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Reset Demo Data button */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Restaurar Banco de Dados Demonstração</h4>
              <p className="text-[11px] text-slate-500">
                Reinicializa todas as manifestações, secretarias e servidores para o modelo padrão de Itaú-RN.
              </p>
            </div>
            <button
              type="button"
              onClick={resetToInitialData}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-lg shadow-2xs"
            >
              Restaurar Dados
            </button>
          </div>
        </div>
      )}

      {/* MODAL: SECRETARIA */}
      {secModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#003781] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingSec ? 'Editar Secretaria' : 'Nova Secretaria Municipal'}
              </h3>
              <button onClick={() => setSecModalOpen(false)} className="text-white/80 hover:text-white">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveSec} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-semibold text-slate-800">Nome Oficial da Secretaria *</label>
                  <input
                    type="text"
                    required
                    value={secName}
                    onChange={(e) => setSecName(e.target.value)}
                    placeholder="Ex: Secretaria Municipal de Turismo"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Sigla *</label>
                  <input
                    type="text"
                    required
                    value={secAcronym}
                    onChange={(e) => setSecAcronym(e.target.value.toUpperCase())}
                    placeholder="Ex: SETUR"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Nome do(a) Secretário(a) *</label>
                  <input
                    type="text"
                    required
                    value={secSecretary}
                    onChange={(e) => setSecSecretary(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">WhatsApp Oficial *</label>
                  <input
                    type="text"
                    required
                    value={secWhatsapp}
                    onChange={(e) => setSecWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">E-mail Institucional</label>
                  <input
                    type="email"
                    value={secEmail}
                    onChange={(e) => setSecEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">SLA Regulamentar (dias)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={secSla}
                    onChange={(e) => setSecSla(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Serviços Oferecidos (separados por vírgula)</label>
                <textarea
                  rows={2}
                  value={secServicesStr}
                  onChange={(e) => setSecServicesStr(e.target.value)}
                  placeholder="Ex: Iluminação, Calçamento, Pavimentação"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSecModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003781] hover:bg-[#174EA6] text-white font-bold rounded-lg shadow-xs"
                >
                  Salvar Secretaria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVO SERVIDOR */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#003781] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Cadastrar Novo Servidor</h3>
              <button onClick={() => setUserModalOpen(false)} className="text-white/80 hover:text-white">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">E-mail Institucional *</label>
                <input
                  type="email"
                  required
                  placeholder="nome@itau.rn.gov.br"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Perfil de Acesso *</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="atendente">Atendente Central</option>
                    <option value="secretario">Secretário Municipal</option>
                    <option value="admin">Administrador Geral</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {userRole === 'secretario' && (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Secretaria Vinculada *</label>
                  <select
                    value={userSecId}
                    onChange={(e) => setUserSecId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {secretariats.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.acronym} - {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Cargo / Função Exibida</label>
                <input
                  type="text"
                  placeholder="Ex: Coordenador de Obras Urbanas"
                  value={userRoleTitle}
                  onChange={(e) => setUserRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003781] hover:bg-[#174EA6] text-white font-bold rounded-lg shadow-xs"
                >
                  Cadastrar Servidor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
