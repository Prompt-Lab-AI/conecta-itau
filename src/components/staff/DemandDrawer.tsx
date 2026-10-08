import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Manifestation } from '../../types';
import { UpdateStatusModal } from './UpdateStatusModal';
import { openWhatsAppChat } from '../../utils/whatsapp';
import { ImageLightboxModal } from '../common/ImageLightboxModal';

interface Props {
  manifestation: Manifestation;
  onClose: () => void;
}

export const DemandDrawer: React.FC<Props> = ({ manifestation, onClose }) => {
  const { secretariats, manifestations } = useApp();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Keep synced with latest manifestation in context
  const currentItem = manifestations.find((m) => m.protocol === manifestation.protocol) || manifestation;
  const currentSec = secretariats.find((s) => s.id === currentItem.secretariatId);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
        <div 
          className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Drawer Header */}
          <div className="bg-[#2D3C4F] text-white p-5 flex items-center justify-between border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-0.5">
                <span className="font-mono uppercase font-bold tracking-wider">#{currentItem.protocol}</span>
                <span>·</span>
                <span>Chave: {currentItem.accessKey}</span>
              </div>
              <h2 className="text-base font-bold truncate max-w-md">{currentItem.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-lg"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Quick status bar */}
          <div className="bg-[#F7F9FC] px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#434752]">Status Atual:</span>
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-[#003781] text-white">
                {currentItem.status.replace('_', ' ')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUpdateModalOpen(true)}
              className="px-3 py-1.5 bg-[#003781] hover:bg-[#174EA6] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              <span>Despachar / Mudar Status</span>
            </button>
          </div>

          {/* Body content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
            {/* Essential meta */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Secretaria</span>
                <span className="font-semibold text-slate-900">{currentSec?.acronym} - {currentSec?.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Prioridade</span>
                <span className={`font-bold uppercase ${currentItem.priority === 'urgente' ? 'text-red-700' : 'text-slate-700'}`}>
                  {currentItem.priority}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Data de Abertura</span>
                <span className="text-slate-800">{new Date(currentItem.createdAt).toLocaleString('pt-BR')}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Atendente / Secretário</span>
                <span className="text-slate-800">{currentItem.assignedStaff || 'Aguardando atribuição'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase font-bold text-slate-500 block">Descrição do Munícipe</span>
              <p className="p-3 bg-[#F7F9FC] rounded-xl border border-slate-200 text-slate-800 leading-relaxed text-xs">
                {currentItem.description}
              </p>
            </div>

            {/* Citizen Details */}
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] uppercase font-bold text-slate-500 block">Dados do Solicitante</span>
              {currentItem.citizen.isAnonymous ? (
                <div className="text-amber-800 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">visibility_off</span>
                  <span>Manifestação Anônima — Identidade sob sigilo</span>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-700">
                  <p><strong className="text-slate-900">Nome:</strong> {currentItem.citizen.name}</p>
                  {currentItem.citizen.phone && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 pb-1">
                      <p className="flex items-center gap-1">
                        <strong className="text-slate-900">WhatsApp:</strong> {currentItem.citizen.phone}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const msg = `🏛️ *PREFEITURA DE ITAÚ - RN (CONECTA ITAÚ)*\nOlá, *${currentItem.citizen.name || 'Munícipe'}*!\n\nAqui é ${currentItem.assignedStaff || 'a Ouvidoria da Prefeitura de Itaú'}. Estamos em contato a respeito da sua manifestação *#${currentItem.protocol}* (${currentItem.category}).\n\nComo podemos lhe ajudar ou solicitar mais detalhes sobre o chamado?`;
                          openWhatsAppChat(currentItem.citizen.phone!, msg);
                        }}
                        className="px-2.5 py-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-md text-[11px] shadow-2xs flex items-center gap-1 w-fit"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        <span>Conversar no WhatsApp</span>
                      </button>
                    </div>
                  )}
                  {currentItem.citizen.email && (
                    <p><strong className="text-slate-900">E-mail:</strong> {currentItem.citizen.email}</p>
                  )}
                  {currentItem.citizen.cpf && (
                    <p><strong className="text-slate-900">CPF:</strong> {currentItem.citizen.cpf}</p>
                  )}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] uppercase font-bold text-slate-500 block">Endereço e Território</span>
              {currentItem.location.zone === 'rural' ? (
                <div className="space-y-0.5">
                  <span className="text-emerald-800 font-bold">Zona Rural de Itaú-RN</span>
                  <p className="font-semibold text-slate-900">{currentItem.location.ruralCommunity}</p>
                  {currentItem.location.referencePoint && (
                    <p className="text-slate-600">Ponto de ref: {currentItem.location.referencePoint}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="text-[#003781] font-bold">Zona Urbana</span>
                  <p className="font-semibold text-slate-900">
                    {currentItem.location.street}, {currentItem.location.number || 'S/N'}
                  </p>
                  <p className="text-slate-600">Bairro: {currentItem.location.neighborhood}</p>
                  {currentItem.location.referencePoint && (
                    <p className="text-slate-600">Ponto de ref: {currentItem.location.referencePoint}</p>
                  )}
                </div>
              )}

              {currentItem.location.coordinates && (
                <div className="pt-1 text-[11px] text-blue-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  <span>Coordenadas GPS: Lat {currentItem.location.coordinates.lat}, Lng {currentItem.location.coordinates.lng}</span>
                </div>
              )}
            </div>

            {/* Attachments */}
            {currentItem.attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-bold text-slate-500 block">
                  Evidências / Fotos ({currentItem.attachments.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {currentItem.attachments.map((att) => (
                    <div 
                      key={att.id} 
                      onClick={() => {
                        if (att.dataUrl) {
                          setLightboxImage({ url: att.dataUrl, title: att.name });
                        }
                      }}
                      className={`p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2 ${att.dataUrl ? 'cursor-pointer hover:border-[#003781] hover:bg-blue-50/30' : ''}`}
                    >
                      {att.dataUrl ? (
                        <img 
                          src={att.dataUrl} 
                          alt={att.name} 
                          className="w-10 h-10 object-cover rounded-md border border-slate-200 shrink-0" 
                        />
                      ) : (
                        <span className="material-symbols-outlined text-blue-600">image</span>
                      )}
                      <div className="truncate">
                        <div className="truncate font-medium text-slate-900">{att.name}</div>
                        <div className="text-[10px] text-slate-400">{att.size}</div>
                        {att.dataUrl && (
                          <span className="text-[10px] text-[#003781] font-semibold flex items-center gap-0.5 mt-0.5">
                            <span className="material-symbols-outlined text-xs">zoom_in</span>
                            <span>Ver foto</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluation if present */}
            {currentItem.evaluation && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <span className="text-[11px] uppercase font-bold text-amber-900 block">Avaliação do Cidadão</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  {'★'.repeat(currentItem.evaluation.rating)}
                  {'☆'.repeat(5 - currentItem.evaluation.rating)}
                  <span className="text-xs text-amber-900 ml-1">({currentItem.evaluation.rating}/5)</span>
                </div>
                <p className="text-slate-700 italic">"{currentItem.evaluation.comment || 'Sem comentário adicional'}"</p>
                <div className="text-[10px] text-slate-500 pt-1">
                  Problema resolvido: {currentItem.evaluation.solvedProblem ? 'Sim' : 'Não'}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <span className="text-[11px] uppercase font-bold text-slate-500 block">
                Histórico de Despachos ({currentItem.timeline.length})
              </span>
              <div className="space-y-3 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-200">
                {currentItem.timeline.map((entry, idx) => (
                  <div key={entry.id || idx} className="relative">
                    <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-[#003781]"></div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{entry.title}</span>
                        <span className="text-slate-400 font-mono">{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-slate-600">{entry.description}</p>
                      <div className="text-[10px] text-slate-400">
                        {entry.author} ({entry.role})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
            >
              Fechar Painel
            </button>
            <button
              type="button"
              onClick={() => setUpdateModalOpen(true)}
              className="px-4 py-2 bg-[#003781] hover:bg-[#174EA6] text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              <span>Despachar Demanda</span>
            </button>
          </div>
        </div>
      </div>

      {updateModalOpen && (
        <UpdateStatusModal
          manifestation={currentItem}
          onClose={() => setUpdateModalOpen(false)}
          onSuccess={() => setUpdateModalOpen(false)}
        />
      )}

      {lightboxImage && (
        <ImageLightboxModal
          imageUrl={lightboxImage.url}
          imageTitle={lightboxImage.title}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
};
