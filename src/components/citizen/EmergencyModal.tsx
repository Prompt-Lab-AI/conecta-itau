import React from 'react';
import { useApp } from '../../context/AppContext';

export const EmergencyModal: React.FC = () => {
  const { emergencyModalOpen, setEmergencyModalOpen } = useApp();

  if (!emergencyModalOpen) return null;

  const emergencyContacts = [
    {
      title: 'SAMU - Atendimento Médico de Urgência',
      number: '192',
      desc: 'Acidentes graves, paradas cardíacas, crises respiratórias e emergências de saúde.',
      icon: 'ambulance',
      bgColor: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      title: 'Polícia Militar - Emergência Policial',
      number: '190',
      desc: 'Crimes em andamento, violência doméstica, perturbação da ordem e assaltos.',
      icon: 'shield_person',
      bgColor: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    {
      title: 'Corpo de Bombeiros Militar',
      number: '193',
      desc: 'Incêndios, resgates em altura, afogamentos e acidentes com produtos perigosos.',
      icon: 'local_fire_department',
      bgColor: 'bg-orange-50 text-orange-800 border-orange-200'
    },
    {
      title: 'Defesa Civil Municipal de Itaú-RN',
      number: '199',
      subNumber: '(84) 99812-4010',
      desc: 'Desabamentos, enchentes, quedas de árvores sobre vias e risco iminente de desastre.',
      icon: 'crisis_alert',
      bgColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      title: 'Conselho Tutelar de Itaú-RN',
      number: '(84) 99812-4077',
      desc: 'Violação de direitos, abandono ou perigo iminente a crianças e adolescentes.',
      icon: 'family_restroom',
      bgColor: 'bg-purple-50 text-purple-800 border-purple-200'
    },
    {
      title: 'Unidade Mista de Saúde / Plantão Itaú-RN',
      number: '(84) 3376-0155',
      desc: 'Pronto atendimento municipal para primeiros socorros locais.',
      icon: 'local_hospital',
      bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-title"
      >
        <div className="bg-[#BA1A1A] text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">emergency</span>
            </div>
            <div>
              <h2 id="emergency-title" className="text-lg font-bold">Canais de Emergência Imediata</h2>
              <p className="text-xs text-red-100">
                O Conecta Itaú é para ouvidoria e solicitações de rotina. Em risco de vida, ligue imediatamente:
              </p>
            </div>
          </div>
          <button
            onClick={() => setEmergencyModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg transition-colors focus:outline-hidden"
            aria-label="Fechar modal de emergência"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
          {emergencyContacts.map((contact, idx) => (
            <div 
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${contact.bgColor}`}
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-2xl mt-0.5">{contact.icon}</span>
                <div>
                  <h4 className="font-semibold text-sm leading-snug">{contact.title}</h4>
                  <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{contact.desc}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <a
                  href={`tel:${contact.number.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 font-bold text-sm shadow-xs border border-black/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>{contact.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#F7F9FC] border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-[#434752]">
            Atendimento gratuito 24 horas por dia
          </span>
          <button
            type="button"
            onClick={() => setEmergencyModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#003781] hover:bg-[#174EA6] rounded-lg transition-colors"
          >
            Voltar ao Conecta Itaú
          </button>
        </div>
      </div>
    </div>
  );
};
