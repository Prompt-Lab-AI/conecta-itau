import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Manifestation, ManifestationStatus } from '../../types';

interface Props {
  manifestation: Manifestation;
  onClose: () => void;
  onSuccess: () => void;
}

export const UpdateStatusModal: React.FC<Props> = ({ manifestation, onClose, onSuccess }) => {
  const { updateManifestationStatus, currentStaffUser } = useApp();

  const [newStatus, setNewStatus] = useState<ManifestationStatus>(manifestation.status);
  const [dispatchNote, setDispatchNote] = useState('');
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [assignedStaff, setAssignedStaff] = useState(manifestation.assignedStaff || currentStaffUser?.name || '');

  const statusOptions: { value: ManifestationStatus; label: string; desc: string }[] = [
    { value: 'novo', label: 'Novo / Recebido', desc: 'Em fila de triagem inicial da ouvidoria' },
    { value: 'em_analise', label: 'Em Análise Técnica', desc: 'Equipe técnica avaliando viabilidade e vistoria' },
    { value: 'encaminhado', label: 'Encaminhado ao Setor', desc: 'Despachado para equipe de campo responsável' },
    { value: 'em_execucao', label: 'Em Execução / Na Rua', desc: 'Ordem de serviço aberta e obras/conserto em andamento' },
    { value: 'concluido', label: 'Concluído', desc: 'Serviço finalizado ou demanda atendida na totalidade' },
    { value: 'indeferido', label: 'Finalizado / Indeferido', desc: 'Sem viabilidade técnica, fora da competência ou duplicado' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchNote.trim()) return;

    updateManifestationStatus(
      manifestation.protocol,
      newStatus,
      dispatchNote.trim(),
      notifyWhatsApp,
      assignedStaff
    );

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#003781] text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm">Despachar e Atualizar Status</h3>
            <p className="text-[11px] text-blue-100">Protocolo: #{manifestation.protocol}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#191C1E]">
              Novo Status da Demanda *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ManifestationStatus)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:outline-hidden focus:ring-2 focus:ring-[#003781]"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — {opt.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Staff */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#191C1E]">
              Servidor Responsável pelo Despacho
            </label>
            <input
              type="text"
              value={assignedStaff}
              onChange={(e) => setAssignedStaff(e.target.value)}
              placeholder="Nome do servidor ou técnico"
              className="w-full px-3 py-2 text-xs bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
            />
          </div>

          {/* Dispatch Note */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#191C1E]">
              Despacho / Parecer Formal da Secretaria *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Descreva a ação tomada (ex: Ordem de serviço nº 198 emitida, equipe agendada para 08/10, etc.)..."
              value={dispatchNote}
              onChange={(e) => setDispatchNote(e.target.value)}
              className="w-full p-3 text-xs bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:outline-hidden focus:ring-2 focus:ring-[#003781]"
            />
            <p className="text-[11px] text-[#434752]">
              Este parecer aparecerá na linha do tempo pública do protocolo e será notificado ao cidadão.
            </p>
          </div>

          {/* WhatsApp Notification Checkbox & Preview */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyWhatsApp}
                onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">chat</span>
                Disparar notificação automática no WhatsApp do Cidadão
              </span>
            </label>

            {notifyWhatsApp && (
              <div className="text-[11px] text-emerald-800 bg-white/70 p-2.5 rounded-lg border border-emerald-300/60 leading-relaxed font-mono">
                📱 Prévia da mensagem: "Prefeitura de Itaú informa: Seu chamado #{manifestation.protocol} avançou para [{newStatus.toUpperCase()}]: {dispatchNote ? `"${dispatchNote}"` : '...'}"
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#003781] hover:bg-[#174EA6] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>Confirmar Despacho</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
