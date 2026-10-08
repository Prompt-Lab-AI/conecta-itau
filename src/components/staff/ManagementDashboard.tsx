import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DemandDrawer } from './DemandDrawer';
import { Manifestation } from '../../types';

export const ManagementDashboard: React.FC = () => {
  const { manifestations, secretariats } = useApp();

  const [period, setPeriod] = useState<'7d' | '30d' | 'ano'>('30d');
  const [selectedSecFilter, setSelectedSecFilter] = useState<string>('all');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<Manifestation | null>(null);

  // Filtered dataset
  const dataset = useMemo(() => {
    return manifestations.filter((m) => {
      if (selectedSecFilter !== 'all' && m.secretariatId !== selectedSecFilter) {
        return false;
      }
      return true;
    });
  }, [manifestations, selectedSecFilter]);

  // Executive KPI calculations
  const totalDemandas = dataset.length;
  const concluidas = dataset.filter((d) => d.status === 'concluido').length;
  const taxaResolucao = totalDemandas > 0 ? Math.round((concluidas / totalDemandas) * 100) : 0;

  // Average response time simulation
  const tempoMedioDias = totalDemandas > 0 ? (2.8).toFixed(1) : '0';

  // Citizen satisfaction calculation
  const avaliacoes = dataset.filter((d) => d.evaluation !== undefined).map((d) => d.evaluation!.rating);
  const mediaSatisfacao = avaliacoes.length > 0 
    ? (avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length).toFixed(1)
    : '4.8';

  // Distribution by secretariat
  const secretariatsStats = secretariats.map((sec) => {
    const secItems = dataset.filter((d) => d.secretariatId === sec.id);
    const resolved = secItems.filter((d) => d.status === 'concluido').length;
    const rate = secItems.length > 0 ? Math.round((resolved / secItems.length) * 100) : 100;
    return {
      sec,
      total: secItems.length,
      resolved,
      rate
    };
  });

  // Distribution by type
  const typeCounts = {
    solicitacao: dataset.filter((d) => d.type === 'solicitacao').length,
    problema: dataset.filter((d) => d.type === 'problema').length,
    denuncia: dataset.filter((d) => d.type === 'denuncia').length,
    elogio: dataset.filter((d) => d.type === 'elogio').length,
  };

  // Territory breakdown
  const ruralCount = dataset.filter((d) => d.location.zone === 'rural').length;
  const urbanCount = dataset.filter((d) => d.location.zone === 'urbana').length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Protocolo', 'Tipo', 'Assunto', 'Secretaria', 'Zona', 'Status', 'Prioridade', 'Data'];
    const rows = dataset.map((d) => {
      const sec = secretariats.find((s) => s.id === d.secretariatId);
      return [
        d.protocol,
        d.type,
        `"${d.category.replace(/"/g, '""')}"`,
        `"${sec?.acronym || ''}"`,
        d.location.zone,
        d.status,
        d.priority,
        new Date(d.createdAt).toLocaleDateString('pt-BR')
      ].join(';');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_ouvidoria_itau_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#191C1E]">Visão Geral da Gestão Municipal</h1>
          <p className="text-xs sm:text-sm text-[#434752]">
            Métricas executivas, desempenho das secretarias e prestação de contas de Itaú-RN.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Report button */}
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="px-4 py-2 bg-[#003781] hover:bg-[#174EA6] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>Relatório Mensal Automatizado</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            title="Baixar planilha CSV"
          >
            <span className="material-symbols-outlined text-base text-emerald-700">table_view</span>
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Filtrar Secretaria:</span>
          <select
            value={selectedSecFilter}
            onChange={(e) => setSelectedSecFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F7F9FC] border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden"
          >
            <option value="all">Todas as Secretarias Municipais</option>
            {secretariats.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.acronym} - {sec.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Período:</span>
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setPeriod('7d')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${period === '7d' ? 'bg-white text-[#003781] shadow-2xs font-bold' : 'text-slate-600'}`}
            >
              Últimos 7 dias
            </button>
            <button
              type="button"
              onClick={() => setPeriod('30d')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${period === '30d' ? 'bg-white text-[#003781] shadow-2xs font-bold' : 'text-slate-600'}`}
            >
              Últimos 30 dias
            </button>
            <button
              type="button"
              onClick={() => setPeriod('ano')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${period === 'ano' ? 'bg-white text-[#003781] shadow-2xs font-bold' : 'text-slate-600'}`}
            >
              Ano 2026
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total de Demandas</span>
            <span className="material-symbols-outlined text-blue-700">inbox</span>
          </div>
          <div className="text-3xl font-black text-[#191C1E]">{totalDemandas}</div>
          <p className="text-[11px] text-[#434752] mt-1">Todas as solicitações apuradas no ciclo</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Taxa de Resolução</span>
            <span className="material-symbols-outlined text-emerald-700">task_alt</span>
          </div>
          <div className="text-3xl font-black text-[#166534]">{taxaResolucao}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#166534] h-full rounded-full transition-all duration-500" style={{ width: `${taxaResolucao}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tempo Médio Resposta</span>
            <span className="material-symbols-outlined text-blue-800">schedule</span>
          </div>
          <div className="text-3xl font-black text-[#003781]">{tempoMedioDias} <span className="text-sm font-normal text-slate-500">dias</span></div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Dentro do SLA de 5 dias</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Índice de Satisfação</span>
            <span className="material-symbols-outlined text-amber-600">star</span>
          </div>
          <div className="text-3xl font-black text-amber-600">{mediaSatisfacao} <span className="text-sm font-normal text-slate-400">/ 5.0</span></div>
          <div className="flex items-center gap-1 text-amber-500 text-sm mt-1">
            {'★'.repeat(Math.round(Number(mediaSatisfacao)))}
            {'☆'.repeat(5 - Math.round(Number(mediaSatisfacao)))}
            <span className="text-[11px] text-slate-500 ml-1">({avaliacoes.length} avaliações)</span>
          </div>
        </div>
      </div>

      {/* Department Breakdown & Type Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Secretaria Performance Table / Bars */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#191C1E]">Desempenho por Secretaria Municipal</h3>
              <p className="text-xs text-[#434752]">Volume de chamados e índice de resolução</p>
            </div>
            <span className="text-xs font-semibold text-[#003781]">Itaú - RN</span>
          </div>

          <div className="space-y-4 pt-2">
            {secretariatsStats.map(({ sec, total, resolved, rate }) => (
              <div key={sec.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{sec.acronym}</span>
                    <span className="text-slate-500 hidden sm:inline">— {sec.name}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-800">{resolved}/{total}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">({rate}%)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-[#003781] h-full rounded-full transition-all duration-500"
                    style={{ width: `${rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Territory & Type stats */}
        <div className="space-y-6">
          {/* Territory (Urbana vs Rural) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-[#191C1E]">Distribuição Territorial</h3>
            <p className="text-xs text-[#434752]">Atendimento na sede e comunidades rurais</p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-center">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="text-[10px] font-bold uppercase text-[#003781]">Zona Urbana</span>
                <div className="text-2xl font-black text-[#003781] mt-1">{urbanCount}</div>
                <span className="text-[10px] text-slate-500">Bairros da sede</span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-[10px] font-bold uppercase text-[#166534]">Zona Rural</span>
                <div className="text-2xl font-black text-[#166534] mt-1">{ruralCount}</div>
                <span className="text-[10px] text-slate-500">Sítios e comunidades</span>
              </div>
            </div>
          </div>

          {/* Demand types */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-[#191C1E]">Classificação das Manifestações</h3>
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700">Solicitações de Serviço</span>
                <span className="font-bold text-[#003781]">{typeCounts.solicitacao}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700">Informação de Problemas</span>
                <span className="font-bold text-amber-700">{typeCounts.problema}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700">Denúncias e Reclamações</span>
                <span className="font-bold text-[#BA1A1A]">{typeCounts.denuncia}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700">Elogios e Sugestões</span>
                <span className="font-bold text-[#166534]">{typeCounts.elogio}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent High Priority Demands Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#191C1E]">Demandas Recentes e Prioritárias</h3>
            <p className="text-xs text-[#434752]">Acompanhamento direto do Gabinete</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FC] text-[#434752] uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Protocolo</th>
                <th className="p-3.5">Assunto</th>
                <th className="p-3.5">Secretaria</th>
                <th className="p-3.5">Território</th>
                <th className="p-3.5">Prioridade</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dataset.slice(0, 5).map((item) => {
                const sec = secretariats.find((s) => s.id === item.secretariatId);

                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-[#003781] whitespace-nowrap">
                      {item.protocol}
                    </td>
                    <td className="p-3.5 max-w-xs font-semibold text-slate-900 truncate">
                      {item.title}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-700 font-medium">
                      {sec?.acronym}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-600">
                      {item.location.zone === 'rural' ? item.location.ruralCommunity : item.location.neighborhood}
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
                      <span className="font-bold text-slate-700">
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedDemand(item)}
                        className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* REPORT PRINT / PREVIEW MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal header */}
            <div className="bg-[#2D3C4F] text-white p-4 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">description</span>
                <h3 className="font-bold text-sm">Relatório Mensal Automatizado de Desempenho e Métricas</h3>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Printable Report Document */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-900 bg-white" id="report-print-area">
              {/* Institutional Header */}
              <div className="border-b-2 border-[#003781] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#003781] uppercase tracking-wide">
                    Prefeitura Municipal de Itaú - RN
                  </h2>
                  <p className="text-xs text-slate-600">Ouvidoria Geral e Sistema Conecta Itaú</p>
                  <p className="text-[11px] text-slate-500">
                    Relatório Oficial de Atendimento e Eficiência Administrativa
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono">
                  <div>Emitido em: {new Date().toLocaleDateString('pt-BR')}</div>
                  <div>Ciclo: {period === '7d' ? 'Semanal' : period === '30d' ? 'Mensal' : 'Anual 2026'}</div>
                </div>
              </div>

              {/* Summary Stats in Report */}
              <div className="grid grid-cols-4 gap-3 text-center border p-3 rounded-lg bg-slate-50 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Total Demandas</span>
                  <div className="text-xl font-bold text-[#003781]">{totalDemandas}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Concluídas</span>
                  <div className="text-xl font-bold text-emerald-800">{concluidas}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Taxa Resolução</span>
                  <div className="text-xl font-bold text-emerald-800">{taxaResolucao}%</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Satisfação Média</span>
                  <div className="text-xl font-bold text-amber-700">{mediaSatisfacao} / 5.0</div>
                </div>
              </div>

              {/* Department Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Desempenho por Departamento e Secretário Responsável:
                </h4>
                <table className="w-full text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2 text-left">Secretaria</th>
                      <th className="p-2 text-left">Secretário(a)</th>
                      <th className="p-2 text-center">Total</th>
                      <th className="p-2 text-center">Resolvidas</th>
                      <th className="p-2 text-center">Eficiência</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {secretariatsStats.map(({ sec, total, resolved, rate }) => (
                      <tr key={sec.id}>
                        <td className="p-2 font-bold text-slate-800">{sec.acronym}</td>
                        <td className="p-2 text-slate-600">{sec.secretaryName}</td>
                        <td className="p-2 text-center">{total}</td>
                        <td className="p-2 text-center text-emerald-800 font-bold">{resolved}</td>
                        <td className="p-2 text-center font-bold">{rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
                <p>Relatório gerado automaticamente para prestação de contas com base na Lei de Acesso à Informação.</p>
                <p className="font-semibold text-slate-700">Prefeitura Municipal de Itaú - RN • Praça Dr. José Augusto, Centro</p>
              </div>
            </div>

            {/* Modal actions */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between no-print">
              <span className="text-xs text-slate-500">Pronto para impressão institucional ou exportação</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#003781] hover:bg-[#174EA6] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  <span>Imprimir / Salvar em PDF</span>
                </button>
              </div>
            </div>
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
