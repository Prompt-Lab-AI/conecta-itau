import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setEmergencyModalOpen, setActiveCitizenView } = useApp();

  return (
    <footer className="bg-[#2D3C4F] text-slate-200 mt-16 border-t border-slate-700">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Institutional Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#003781] text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-lg">account_balance</span>
              </div>
              <h3 className="font-bold text-base text-white tracking-tight">Conecta Itaú</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Plataforma oficial de comunicação e ouvidoria da Prefeitura Municipal de Itaú - RN. Aproximando a gestão dos moradores da sede e da zona rural.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">CNPJ:</span> 08.151.789/0001-50
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-3 tracking-wide">Cidadão</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button 
                  onClick={() => { setActiveCitizenView('register'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Registrar Manifestação
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveCitizenView('track'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Acompanhar Protocolo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setEmergencyModalOpen(true)}
                  className="hover:text-red-300 text-red-200 font-medium transition-colors"
                >
                  Telefones Úteis e Emergência
                </button>
              </li>
              <li>
                <a 
                  href="https://itau.rn.gov.br" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  Portal da Transparência
                </a>
              </li>
            </ul>
          </div>

          {/* Secretariats */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-3 tracking-wide">Principais Secretarias</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>Obras e Infraestrutura (SEMOB)</li>
              <li>Saúde Municipal (SMS)</li>
              <li>Educação e Cultura (SEMEC)</li>
              <li>Serviços Urbanos e Meio Ambiente</li>
              <li>Agricultura e Recursos Hídricos</li>
              <li>Assistência Social (CRAS)</li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-2.5 text-xs text-slate-300">
            <h4 className="font-semibold text-sm text-white mb-3 tracking-wide">Sede Administrativa</h4>
            <p className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base text-blue-400 shrink-0">location_on</span>
              <span>Praça Dr. José Augusto, Centro, Itaú - RN, CEP 59845-000</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-blue-400 shrink-0">schedule</span>
              <span>Segunda a Sexta: 07:00 às 13:00</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-blue-400 shrink-0">call</span>
              <span>(84) 3376-0120 | ouvidoria@itau.rn.gov.br</span>
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Conecta Itaú • Prefeitura Municipal de Itaú - RN. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Acessibilidade WCAG AA</span>
            <span>·</span>
            <span>Segurança e Sigilo LGPD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
