import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManifestationType } from '../../types';

export const CitizenHome: React.FC<{ onSelectType: (type: ManifestationType, defaultCategory?: string) => void }> = ({ onSelectType }) => {
  const { 
    manifestations, 
    goToTracking, 
    setEmergencyModalOpen 
  } = useApp();

  const [quickProtocolInput, setQuickProtocolInput] = useState('');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickProtocolInput.trim()) {
      goToTracking(quickProtocolInput.trim().toUpperCase());
    }
  };

  // Metrics summary
  const totalCount = manifestations.length;
  const resolvedCount = manifestations.filter(m => m.status === 'concluido').length;
  const inProgressCount = manifestations.filter(m => m.status === 'em_execucao' || m.status === 'em_analise' || m.status === 'encaminhado').length;

  const mainActions = [
    {
      type: 'solicitacao' as ManifestationType,
      title: 'Solicitar serviço',
      description: 'Peça serviços públicos como troca de lâmpadas, limpeza, poda de árvores, abastecimento de água e consertos.',
      icon: 'engineering',
      badge: 'Mais solicitado',
      accentColor: 'border-l-4 border-[#003781] hover:border-l-8',
      iconBg: 'bg-blue-50 text-[#003781]'
    },
    {
      type: 'problema' as ManifestationType,
      title: 'Informar problema',
      description: 'Avise sobre buracos em vias, esgoto a céu aberto, vazamentos de canos ou falhas na infraestrutura do município.',
      icon: 'report_problem',
      badge: 'Prioridade',
      accentColor: 'border-l-4 border-amber-600 hover:border-l-8',
      iconBg: 'bg-amber-50 text-amber-700'
    },
    {
      type: 'denuncia' as ManifestationType,
      title: 'Denúncia ou reclamação',
      description: 'Relate descartes irregulares de lixo, infrações ambientais ou má conduta. Opção de anonimato total garantida por lei.',
      icon: 'shield_lock',
      badge: 'Sigilo 100%',
      accentColor: 'border-l-4 border-[#BA1A1A] hover:border-l-8',
      iconBg: 'bg-red-50 text-[#BA1A1A]'
    },
    {
      type: 'elogio' as ManifestationType,
      title: 'Elogio ou sugestão',
      description: 'Reconheça o atendimento de servidores e equipes municipais, ou proponha melhorias para sua comunidade.',
      icon: 'thumb_up',
      badge: 'Participação',
      accentColor: 'border-l-4 border-emerald-600 hover:border-l-8',
      iconBg: 'bg-emerald-50 text-emerald-700'
    }
  ];

  const categoryShortcuts = [
    { name: 'Iluminação Pública', icon: 'lightbulb', type: 'problema' as ManifestationType, cat: 'Iluminação Pública e Troca de Lâmpadas' },
    { name: 'Ruas e Buracos', icon: 'traffic', type: 'problema' as ManifestationType, cat: 'Tapa-buracos e Pavimentação' },
    { name: 'Limpeza Urbana', icon: 'delete_sweep', type: 'solicitacao' as ManifestationType, cat: 'Coleta de Lixo Domiciliar' },
    { name: 'Saneamento e Esgoto', icon: 'water_damage', type: 'problema' as ManifestationType, cat: 'Fiscalização Ambiental e Saneamento' },
    { name: 'Saúde e UBS', icon: 'medical_services', type: 'solicitacao' as ManifestationType, cat: 'Atendimento nas UBSs Municipais' },
    { name: 'Assistência Social', icon: 'family_restroom', type: 'solicitacao' as ManifestationType, cat: 'Atendimento CRAS e Cadastro Único' },
    { name: 'Educação Municipal', icon: 'school', type: 'solicitacao' as ManifestationType, cat: 'Transporte Escolar Rural e Urbano' },
    { name: 'Água e Zona Rural', icon: 'water_drop', type: 'solicitacao' as ManifestationType, cat: 'Abastecimento de Água via Carro-Pipa' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Banner Section */}
      <section className="bg-radial from-[#003781] to-[#00275C] text-white py-12 px-4 rounded-2xl shadow-md border border-[#174EA6]/40 relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[300px]">account_balance</span>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-blue-100 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Canal Direto com o Gabinete e Secretarias de Itaú-RN
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Como podemos ajudar você hoje?
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Seja na sede do município ou nas comunidades rurais, registre sua manifestação. O secretário responsável recebe o alerta no WhatsApp em tempo real.
          </p>

          {/* Quick protocol tracking form directly inside hero */}
          <div className="pt-4 max-w-xl mx-auto">
            <form 
              onSubmit={handleQuickTrack}
              className="bg-white p-2 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-2 px-3 py-2 w-full text-slate-800">
                <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                <input
                  type="text"
                  placeholder="Já tem um protocolo? Ex: 2026-ITAU-0842"
                  value={quickProtocolInput}
                  onChange={(e) => setQuickProtocolInput(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent outline-hidden text-[#191C1E] placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#003781] hover:bg-[#174EA6] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                Consultar
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 4 Main Action Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#191C1E]">Selecione o tipo de manifestação</h2>
          <p className="text-xs sm:text-sm text-[#434752]">
            Escolha uma das opções abaixo para abrir seu chamado com a prefeitura:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainActions.map((action) => (
            <button
              key={action.type}
              type="button"
              onClick={() => onSelectType(action.type)}
              className={`p-6 bg-white rounded-xl shadow-xs border border-slate-200 transition-all text-left flex items-start gap-4 group hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${action.accentColor}`}
            >
              <div className={`p-3.5 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${action.iconBg}`}>
                <span className="material-symbols-outlined text-3xl">{action.icon}</span>
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-[#191C1E] group-hover:text-[#003781] transition-colors">
                    {action.title}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-500">
                    {action.badge}
                  </span>
                </div>
                <p className="text-xs text-[#434752] leading-relaxed">
                  {action.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-[#003781] group-hover:translate-x-1 transition-transform">
                  <span>Preencher solicitação</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-[#191C1E]">Atalhos rápidos por assunto</h3>
          <p className="text-xs text-[#434752]">
            Clique direto na demanda mais comum para iniciar o formulário pré-selecionado:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categoryShortcuts.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectType(cat.type, cat.cat)}
              className="p-3.5 rounded-xl border border-slate-200/80 hover:border-[#003781] hover:bg-blue-50/50 transition-all text-left flex flex-col gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#003781] group-hover:text-white text-slate-700 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-lg">{cat.icon}</span>
              </div>
              <span className="text-xs font-semibold text-[#191C1E] group-hover:text-[#003781] leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Transparency Stats & Community Impact */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003781] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <div className="text-2xl font-black text-[#191C1E]">{totalCount}</div>
            <div className="text-xs text-[#434752]">Manifestações registradas no sistema</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
          <div>
            <div className="text-2xl font-black text-[#166534]">{resolvedCount}</div>
            <div className="text-xs text-[#434752]">Demandas concluídas com sucesso</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-700">{inProgressCount}</div>
            <div className="text-xs text-[#434752]">Em atendimento e execução nas ruas</div>
          </div>
        </div>
      </section>

      {/* Emergency Alert Callout */}
      <section className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 text-[#BA1A1A] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">emergency</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-900">Precisa de atendimento de urgência médica ou policial?</h4>
            <p className="text-xs text-red-700">
              Em caso de acidentes, violência ou risco de morte imediato, utilize os canais diretos de emergência.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEmergencyModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-[#BA1A1A] hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs whitespace-nowrap"
        >
          Ver Telefones de Urgência
        </button>
      </section>
    </div>
  );
};
