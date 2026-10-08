import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Manifestation, ManifestationStatus, ManifestationType } from '../../types';
import { DemandDrawer } from './DemandDrawer';
import { NEIGHBORHOODS_ITAU, RURAL_COMMUNITIES_ITAU } from '../../data/initialData';

export const AttendancePanel: React.FC = () => {
  const { 
    manifestations, 
    secretariats, 
    currentStaffUser 
  } = useApp();

  // View state
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedDemand, setSelectedDemand] = useState<Manifestation | null>(null);

  // Filters
  const [selectedSecretariat, setSelectedSecretariat] = useState<string>(() => {
    // If the logged in user is a secretary, default to their secretariat
    return currentStaffUser?.secretariatId || 'all';
  });
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTerritory, setSelectedTerritory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered dataset
  const filteredManifestations = useMemo(() => {
    return manifestations.filter((item) => {
      // Secretariat
      if (selectedSecretariat !== 'all' && item.secretariatId !== selectedSecretariat) {
        return false;
      }
      // Type
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }
      // Status
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      // Territory
      if (selectedTerritory !== 'all') {
        if (selectedTerritory === 'rural' && item.location.zone !== 'rural') return false;
        if (selectedTerritory === 'urbana' && item.location.zone !== 'urbana') return false;
        if (selectedTerritory !== 'rural' && selectedTerritory !== 'urbana') {
          const inNeighborhood = item.location.neighborhood === selectedTerritory;
          const inRural = item.location.ruralCommunity === selectedTerritory;
          if (!inNeighborhood && !inRural) return false;
        }
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesProtocol = item.protocol.toLowerCase().includes(query);
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCitizen = item.citizen.name?.toLowerCase().includes(query);
        if (!matchesProtocol && !matchesTitle && !matchesDesc && !matchesCitizen) {
          return false;
        }
      }
      return true;
    });
  }, [manifestations, selectedSecretariat, selectedType, selectedStatus, selectedTerritory, searchQuery]);

  // KPI Calculations
  const kpiNovos = filteredManifestations.filter((m) => m.status === 'novo').length;
  const kpiEmAndamento = filteredManifestations.filter((m) => ['em_analise', 'encaminhado', 'em_execucao'].includes(m.status)).length;
  const kpiUrgentes = filteredManifestations.filter((m) => m.priority === 'urgente' && m.status !== 'concluido').length;
  const kpiConcluidos = filteredManifestations.filter((m) => m.status === 'concluido').length;

  // Kanban Columns
  const kanbanColumns: { id: ManifestationStatus; title: string; icon: string; border: string; bg: string }[] = [
    { id: 'novo', title: 'Novos / Triagem', icon: 'mark_email_unread', border: 'border-blue-400', bg: 'bg-blue-50/50' },
    { id: 'em_analise', title: 'Em Análise Técnica', icon: 'analytics', border: 'border-amber-400', bg: 'bg-amber-50/40' },
    { id: 'encaminhado', title: 'Encaminhados', icon: 'forward_to_inbox', border: 'border-indigo-400', bg: 'bg-indigo-50/40' },
    { id: 'em_execucao', title: 'Em Execução nas Ruas', icon: 'engineering', border: 'border-purple-400', bg: 'bg-purple-50/40' },
    { id: 'concluido', title: 'Concluídos', icon: 'task_alt', border: 'border-emerald-400', bg: 'bg-emerald-50/40' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#191C1E]">Painel de Atendimento</h1>
          <p className="text-xs sm:text-sm text-[#434752]">
            Triagem, despacho e acompanhamento operacional das demandas da população de Itaú-RN.
          </p>
        </div>

        {/* View toggle (Kanban / Lista) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#003781] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">view_kanban</span>
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#003781] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">format_list_bulleted</span>
              <span>Lista Detalhada</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Novos (Sem Triagem)</span>
            <div className="text-2xl font-black text-[#003781] mt-0.5">{kpiNovos}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003781] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">fiber_new</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Em Andamento</span>
            <div className="text-2xl font-black text-amber-700 mt-0.5">{kpiEmAndamento}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">pending</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Urgentes / Atenção</span>
            <div className="text-2xl font-black text-[#BA1A1A] mt-0.5">{kpiUrgentes}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#BA1A1A] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">warning</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Concluídos</span>
            <div className="text-2xl font-black text-[#166534] mt-0.5">{kpiConcluidos}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">check_circle</span>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search query */}
          <div className="lg:col-span-2 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Buscar por protocolo, cidadão ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:outline-hidden focus:ring-2 focus:ring-[#003781]"
            />
          </div>

          {/* Secretaria */}
          <div>
            <select
              value={selectedSecretariat}
              onChange={(e) => setSelectedSecretariat(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:outline-hidden"
            >
              <option value="all">Todas as Secretarias</option>
              {secretariats.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.acronym} - {sec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:outline-hidden"
            >
              <option value="all">Todos os Tipos</option>
              <option value="solicitacao">Solicitação</option>
              <option value="problema">Problema</option>
              <option value="denuncia">Denúncia</option>
              <option value="elogio">Elogio</option>
            </select>
          </div>

          {/* Território */}
          <div>
            <select
              value={selectedTerritory}
              onChange={(e) => setSelectedTerritory(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:outline-hidden"
            >
              <option value="all">Todo o Território</option>
              <option value="urbana">Apenas Zona Urbana</option>
              <option value="rural">Apenas Zona Rural</option>
              <optgroup label="Bairros Urbanos">
                {NEIGHBORHOODS_ITAU.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </optgroup>
              <optgroup label="Comunidades Rurais">
                {RURAL_COMMUNITIES_ITAU.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Quick Reset Filters button if any filter is set */}
        {(selectedSecretariat !== 'all' || selectedType !== 'all' || selectedStatus !== 'all' || selectedTerritory !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Exibindo <strong>{filteredManifestations.length}</strong> de {manifestations.length} chamados</span>
            <button
              type="button"
              onClick={() => {
                setSelectedSecretariat('all');
                setSelectedType('all');
                setSelectedStatus('all');
                setSelectedTerritory('all');
                setSearchQuery('');
              }}
              className="text-[#003781] hover:underline font-semibold"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colItems = filteredManifestations.filter((m) => m.status === col.id);

            return (
              <div 
                key={col.id} 
                className={`rounded-xl border ${col.border} ${col.bg} p-3 flex flex-col min-h-[450px] shadow-2xs`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-slate-700">{col.icon}</span>
                    <h3 className="font-bold text-xs text-slate-900">{col.title}</h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {colItems.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colItems.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-[11px] text-slate-400 italic">
                      Nenhum chamado nesta coluna
                    </div>
                  ) : (
                    colItems.map((item) => {
                      const sec = secretariats.find((s) => s.id === item.secretariatId);

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedDemand(item)}
                          className="bg-white p-3 rounded-xl border border-slate-200 hover:border-[#003781] hover:shadow-md transition-all cursor-pointer space-y-2 text-xs group"
                        >
                          <div className="flex items-center justify-between gap-1 text-[10px] text-slate-500 font-mono">
                            <span className="font-bold text-[#003781] group-hover:underline">#{item.protocol}</span>
                            <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>

                          <h4 className="font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#003781] transition-colors">
                            {item.title}
                          </h4>

                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px]">
                            <span className="font-semibold text-slate-700 truncate">{sec?.acronym || 'Itaú'}</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                              item.priority === 'urgente' ? 'bg-red-100 text-red-700' :
                              item.priority === 'alta' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {item.priority}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                            <span className="material-symbols-outlined text-xs">location_on</span>
                            <span className="truncate">
                              {item.location.zone === 'rural' ? item.location.ruralCommunity : item.location.neighborhood}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST DETAILED VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9FC] text-[#434752] uppercase font-bold border-b border-slate-200 tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Protocolo</th>
                  <th className="p-3.5">Título & Assunto</th>
                  <th className="p-3.5">Secretaria</th>
                  <th className="p-3.5">Cidadão</th>
                  <th className="p-3.5">Localização</th>
                  <th className="p-3.5">Prioridade</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredManifestations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                      Nenhuma manifestação encontrada com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredManifestations.map((item) => {
                    const sec = secretariats.find((s) => s.id === item.secretariatId);

                    return (
                      <tr 
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedDemand(item)}
                      >
                        <td className="p-3.5 font-mono font-bold text-[#003781] whitespace-nowrap">
                          {item.protocol}
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <div className="font-bold text-slate-900 truncate">{item.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{item.category}</div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap font-medium text-slate-700">
                          {sec?.acronym}
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-slate-600">
                          {item.citizen.isAnonymous ? (
                            <span className="italic text-slate-400">Anônimo</span>
                          ) : (
                            item.citizen.name || 'Munícipe'
                          )}
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-slate-600">
                          {item.location.zone === 'rural' ? (
                            <span className="text-emerald-800 font-semibold">{item.location.ruralCommunity}</span>
                          ) : (
                            <span>{item.location.neighborhood}</span>
                          )}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.priority === 'urgente' ? 'bg-red-100 text-red-700' :
                            item.priority === 'alta' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">
                            {item.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDemand(item);
                            }}
                            className="px-3 py-1 bg-[#003781] hover:bg-[#174EA6] text-white font-bold rounded-lg text-xs"
                          >
                            Atender
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer */}
      {selectedDemand && (
        <DemandDrawer
          manifestation={selectedDemand}
          onClose={() => setSelectedDemand(null)}
        />
      )}
    </div>
  );
};
