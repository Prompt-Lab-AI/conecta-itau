import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Manifestation, Attachment } from '../../types';
import { openWhatsAppChat } from '../../utils/whatsapp';
import { ImageLightboxModal } from '../common/ImageLightboxModal';

export const TrackProtocol: React.FC = () => {
  const { 
    manifestations, 
    secretariats, 
    prefilledTrackingCode, 
    prefilledTrackingKey,
    addComplementation,
    evaluateManifestation
  } = useApp();

  const [searchProtocol, setSearchProtocol] = useState(prefilledTrackingCode || '');
  const [searchKey, setSearchKey] = useState(prefilledTrackingKey || '');
  const [selectedManifestation, setSelectedManifestation] = useState<Manifestation | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Modals
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [compModalOpen, setCompModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Evaluation form state
  const [evalRating, setEvalRating] = useState(5);
  const [evalComment, setEvalComment] = useState('');
  const [evalSolved, setEvalSolved] = useState(true);

  // Complementation form state
  const [compText, setCompText] = useState('');
  const [compAttachments, setCompAttachments] = useState<Attachment[]>([]);

  // Auto-search if prefilled
  useEffect(() => {
    if (prefilledTrackingCode) {
      setSearchProtocol(prefilledTrackingCode);
      if (prefilledTrackingKey) setSearchKey(prefilledTrackingKey);
      executeSearch(prefilledTrackingCode, prefilledTrackingKey);
    }
  }, [prefilledTrackingCode, prefilledTrackingKey]);

  const executeSearch = (proto: string, _key: string = '') => {
    setSearchError('');
    setHasSearched(true);
    const cleanProto = proto.trim().toUpperCase();
    if (!cleanProto) {
      setSearchError('Digite o número do protocolo para consultar.');
      setSelectedManifestation(null);
      return;
    }

    const found = manifestations.find((m) => m.protocol.toUpperCase() === cleanProto);
    if (found) {
      setSelectedManifestation(found);
    } else {
      setSelectedManifestation(null);
      setSearchError(`Nenhuma manifestação encontrada com o protocolo "${cleanProto}". Verifique os dígitos e tente novamente.`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchProtocol, searchKey);
  };

  const currentSec = selectedManifestation 
    ? secretariats.find((s) => s.id === selectedManifestation.secretariatId)
    : null;

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManifestation) return;
    evaluateManifestation(selectedManifestation.protocol, evalRating, evalComment, evalSolved);
    setEvalModalOpen(false);
    // Refresh local manifestation
    const updated = manifestations.find((m) => m.protocol === selectedManifestation.protocol);
    if (updated) setSelectedManifestation(updated);
  };

  const handleSaveComplementation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManifestation || !compText.trim()) return;
    addComplementation(selectedManifestation.protocol, compText.trim(), compAttachments);
    setCompText('');
    setCompAttachments([]);
    setCompModalOpen(false);
    // Refresh local manifestation
    const updated = manifestations.find((m) => m.protocol === selectedManifestation.protocol);
    if (updated) setSelectedManifestation(updated);
  };

  const getStatusBadge = (status: Manifestation['status']) => {
    const map = {
      novo: { label: 'Novo / Aguardando Triagem', color: 'bg-blue-100 text-[#003781] border-blue-200' },
      em_analise: { label: 'Em Análise Técnica', color: 'bg-amber-100 text-amber-800 border-amber-200' },
      encaminhado: { label: 'Encaminhado ao Setor', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      em_execucao: { label: 'Em Execução / Na Rua', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      concluido: { label: 'Concluído com Sucesso', color: 'bg-emerald-100 text-[#166534] border-emerald-200' },
      indeferido: { label: 'Finalizado / Não Atendido', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    }[status];

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${map.color}`}>
        <span className="w-2 h-2 rounded-full bg-current"></span>
        {map.label}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191C1E]">Acompanhar Manifestação</h1>
        <p className="text-xs sm:text-sm text-[#434752] max-w-xl mx-auto">
          Digite seu número de protocolo para ver o andamento em tempo real, despachos dos secretários e avaliar o atendimento.
        </p>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-semibold text-[#191C1E]">
              Número do Protocolo *
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">tag</span>
              <input
                type="text"
                required
                placeholder="Ex: 2026-ITAU-0842"
                value={searchProtocol}
                onChange={(e) => setSearchProtocol(e.target.value.toUpperCase())}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] uppercase tracking-wider font-mono focus:outline-hidden focus:ring-2 focus:ring-[#003781]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#191C1E]">
              Chave de Segurança
            </label>
            <input
              type="text"
              placeholder="Ex: 7K9P2X"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] uppercase tracking-widest font-mono focus:outline-hidden focus:ring-2 focus:ring-[#003781]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <span>Protocolos recentes para teste:</span>
            <button 
              type="button" 
              onClick={() => { setSearchProtocol('2026-ITAU-0842'); executeSearch('2026-ITAU-0842'); }}
              className="text-[#003781] hover:underline font-semibold"
            >
              #0842
            </button>
            <span>·</span>
            <button 
              type="button" 
              onClick={() => { setSearchProtocol('2026-ITAU-0843'); executeSearch('2026-ITAU-0843'); }}
              className="text-[#003781] hover:underline font-semibold"
            >
              #0843
            </button>
            <span>·</span>
            <button 
              type="button" 
              onClick={() => { setSearchProtocol('2026-ITAU-0844'); executeSearch('2026-ITAU-0844'); }}
              className="text-[#003781] hover:underline font-semibold"
            >
              #0844
            </button>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#003781] hover:bg-[#174EA6] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-xs flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Consultar</span>
          </button>
        </div>
      </form>

      {/* Error State */}
      {searchError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-lg text-amber-700">info</span>
          <span>{searchError}</span>
        </div>
      )}

      {/* RESULT DETAILS */}
      {selectedManifestation && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#434752] mb-1">
                  <span className="font-mono uppercase font-bold text-slate-800">
                    Protocolo: {selectedManifestation.protocol}
                  </span>
                  <span>·</span>
                  <span>Aberto em {new Date(selectedManifestation.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#191C1E]">
                  {selectedManifestation.title}
                </h2>
              </div>
              <div className="shrink-0">
                {getStatusBadge(selectedManifestation.status)}
              </div>
            </div>

            {/* Quick action bar for Citizen: Avaliar / Complementar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <div className="text-xs text-[#434752] flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#003781]">account_balance</span>
                <span>Secretaria: <strong>{currentSec?.name || 'Prefeitura de Itaú'}</strong></span>
                {selectedManifestation.assignedStaff && (
                  <>
                    <span>·</span>
                    <span>Responsável: <strong>{selectedManifestation.assignedStaff}</strong></span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {currentSec?.whatsapp && (
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `🏛️ *CONECTA ITAÚ - DÚVIDA SOBRE PROTOCOLO*\nOlá, Secretário(a) *${currentSec.secretaryName}* (${currentSec.acronym})!\n\nGostaria de obter informações sobre o andamento do meu protocolo *#${selectedManifestation.protocol}* (${selectedManifestation.category}).\n\nStatus atual: ${selectedManifestation.status.replace('_', ' ').toUpperCase()}`;
                      openWhatsAppChat(currentSec.whatsapp, msg);
                    }}
                    className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>Falar no WhatsApp ({currentSec.acronym})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setCompModalOpen(true)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-base text-blue-600">add_comment</span>
                  <span>Complementar Informação</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEvalModalOpen(true)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-base text-amber-500">star</span>
                  <span>{selectedManifestation.evaluation ? 'Ver Avaliação' : 'Avaliar Atendimento'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Manifestation Content Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#434752] mb-1">
                    Descrição da Solicitação
                  </h3>
                  <p className="text-sm text-[#191C1E] leading-relaxed bg-[#F7F9FC] p-4 rounded-xl border border-slate-200">
                    {selectedManifestation.description}
                  </p>
                </div>

                {/* Complementation notes if any */}
                {selectedManifestation.complementations.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#434752]">
                      Informações Complementares Adicionadas
                    </h3>
                    {selectedManifestation.complementations.map((comp) => (
                      <div key={comp.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 text-xs text-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-[#434752]">
                          <span className="font-semibold">{comp.author}</span>
                          <span>{new Date(comp.date).toLocaleString('pt-BR')}</span>
                        </div>
                        <p>{comp.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Attachments */}
                {selectedManifestation.attachments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#434752] mb-2">
                      Anexos ({selectedManifestation.attachments.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedManifestation.attachments.map((att) => (
                        <div 
                          key={att.id} 
                          onClick={() => {
                            if (att.dataUrl) {
                              setLightboxImage({ url: att.dataUrl, title: att.name });
                            }
                          }}
                          className={`p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2 text-xs ${att.dataUrl ? 'cursor-pointer hover:border-[#003781] hover:bg-blue-50/40' : ''}`}
                        >
                          {att.dataUrl ? (
                            <img 
                              src={att.dataUrl} 
                              alt={att.name} 
                              className="w-8 h-8 object-cover rounded border border-slate-200 shrink-0" 
                            />
                          ) : (
                            <span className="material-symbols-outlined text-blue-600">image</span>
                          )}
                          <div>
                            <span className="font-medium text-slate-700 block truncate max-w-[150px]">{att.name}</span>
                            <span className="text-[10px] text-slate-400">({att.size})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Side Info */}
              <div className="space-y-4 bg-[#F7F9FC] p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-[#191C1E] block mb-1">Localização</span>
                  {selectedManifestation.location.zone === 'rural' ? (
                    <div className="space-y-0.5 text-[#434752]">
                      <p className="font-semibold text-emerald-800">Zona Rural de Itaú</p>
                      <p>{selectedManifestation.location.ruralCommunity}</p>
                      {selectedManifestation.location.referencePoint && (
                        <p className="text-[11px] text-slate-500">Ref: {selectedManifestation.location.referencePoint}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-0.5 text-[#434752]">
                      <p>{selectedManifestation.location.street}, {selectedManifestation.location.number || 'S/N'}</p>
                      <p>Bairro: {selectedManifestation.location.neighborhood}</p>
                      {selectedManifestation.location.referencePoint && (
                        <p className="text-[11px] text-slate-500">Ref: {selectedManifestation.location.referencePoint}</p>
                      )}
                    </div>
                  )}
                  {selectedManifestation.location.coordinates && (
                    <div className="mt-2 text-[11px] text-blue-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      <span>GPS: {selectedManifestation.location.coordinates.lat}, {selectedManifestation.location.coordinates.lng}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-[#191C1E] block mb-1">Solicitante</span>
                  {selectedManifestation.citizen.isAnonymous ? (
                    <span className="text-slate-500 italic">Manifestação Anônima (Identidade protegida)</span>
                  ) : (
                    <div className="space-y-0.5 text-[#434752]">
                      <p className="font-medium">{selectedManifestation.citizen.name}</p>
                      {selectedManifestation.citizen.phone && <p>Tel: {selectedManifestation.citizen.phone}</p>}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-[#191C1E] block mb-1">Prazo SLA de Resposta</span>
                  <p className="text-[#434752]">
                    Meta regulamentar: até <strong>{selectedManifestation.slaDays} dias úteis</strong>.
                  </p>
                </div>

                {selectedManifestation.evaluation && (
                  <div className="pt-2 border-t border-slate-200 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1">Avaliação do Cidadão</span>
                    <div className="flex items-center gap-1 text-amber-500 text-sm mb-1">
                      {'★'.repeat(selectedManifestation.evaluation.rating)}
                      {'☆'.repeat(5 - selectedManifestation.evaluation.rating)}
                    </div>
                    <p className="text-[11px] text-amber-800 italic">
                      "{selectedManifestation.evaluation.comment || 'Sem comentários'}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* TIMELINE / HISTÓRICO DE TRAMITAÇÃO */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#191C1E] flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-[#003781]">history</span>
                  <span>Linha do Tempo e Histórico de Despachos</span>
                </h3>
                <span className="text-xs text-[#434752]">
                  {selectedManifestation.timeline.length} registro(s)
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedManifestation.timeline.map((entry, idx) => (
                  <div key={entry.id || idx} className="relative group">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#003781] ring-4 ring-white border border-blue-300"></div>
                    <div className="bg-[#F7F9FC] p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-bold text-sm text-[#191C1E]">{entry.title}</span>
                        <span className="text-[11px] text-[#434752] font-mono">
                          {new Date(entry.date).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-xs text-[#434752] leading-relaxed">
                        {entry.description}
                      </p>
                      <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs">person</span>
                        <span>{entry.author}</span>
                        <span>·</span>
                        <span className="font-medium">{entry.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: COMPLEMENTAR INFORMAÇÃO */}
      {compModalOpen && selectedManifestation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-[#003781] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Complementar Informações ao Protocolo</h3>
              <button 
                type="button"
                onClick={() => setCompModalOpen(false)} 
                className="text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveComplementation} className="p-6 space-y-4">
              <div className="text-xs text-[#434752]">
                Protocolo: <strong>{selectedManifestation.protocol}</strong>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#191C1E]">
                  Novos Esclarecimentos ou Detalhes *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Acrescente referências, horários ou informações que faltaram..."
                  value={compText}
                  onChange={(e) => setCompText(e.target.value)}
                  className="w-full p-3 text-xs bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003781] hover:bg-[#174EA6] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Enviar Complemento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AVALIAR ATENDIMENTO */}
      {evalModalOpen && selectedManifestation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-[#003781] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Avaliar Atendimento da Prefeitura</h3>
              <button 
                type="button"
                onClick={() => setEvalModalOpen(false)} 
                className="text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveEvaluation} className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <p className="text-xs text-[#434752]">Como você avalia a agilidade e a qualidade da resposta?</p>
                <div className="flex items-center justify-center gap-2 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEvalRating(star)}
                      className={`transition-transform hover:scale-125 ${
                        star <= evalRating ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {evalRating === 5 ? 'Excelente' : evalRating === 4 ? 'Bom' : evalRating === 3 ? 'Regular' : evalRating === 2 ? 'Ruim' : 'Péssimo'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#191C1E]">
                  O seu problema ou solicitação foi efetivamente resolvido?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="radio"
                      name="solved"
                      checked={evalSolved}
                      onChange={() => setEvalSolved(true)}
                    />
                    <span>Sim, resolvido</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="radio"
                      name="solved"
                      checked={!evalSolved}
                      onChange={() => setEvalSolved(false)}
                    />
                    <span>Não resolvido</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#191C1E]">
                  Comentários Adicionais (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Deixe um comentário com sugestões ou agradecimentos..."
                  value={evalComment}
                  onChange={(e) => setEvalComment(e.target.value)}
                  className="w-full p-3 text-xs bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvalModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#166534] hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Registrar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <ImageLightboxModal
          imageUrl={lightboxImage.url}
          imageTitle={lightboxImage.title}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
};
