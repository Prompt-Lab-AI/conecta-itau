import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManifestationType, Attachment, PriorityLevel } from '../../types';
import { RURAL_COMMUNITIES_ITAU, NEIGHBORHOODS_ITAU } from '../../data/initialData';
import { openWhatsAppChat } from '../../utils/whatsapp';
import { compressImageFile } from '../../utils/image';

interface Props {
  initialType?: ManifestationType;
  initialCategory?: string;
  onCancel: () => void;
}

export const RegisterManifestation: React.FC<Props> = ({ 
  initialType = 'solicitacao', 
  initialCategory = '', 
  onCancel 
}) => {
  const { 
    secretariats, 
    registerNewManifestation, 
    goToTracking 
  } = useApp();

  // Form states
  const [type, setType] = useState<ManifestationType>(initialType);
  const [selectedSecId, setSelectedSecId] = useState<string>(() => {
    return secretariats[0]?.id || 'sec-obras';
  });
  const [category, setCategory] = useState<string>(initialCategory || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Location
  const [zone, setZone] = useState<'urbana' | 'rural'>('urbana');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState(NEIGHBORHOODS_ITAU[0]);
  const [ruralCommunity, setRuralCommunity] = useState(RURAL_COMMUNITIES_ITAU[0]);
  const [referencePoint, setReferencePoint] = useState('');
  const [gpsCaptured, setGpsCaptured] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Citizen data
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [citizenName, setCitizenName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Priority
  const [priority, setPriority] = useState<PriorityLevel>('media');

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // State: Form, Submitting, Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{ protocol: string; accessKey: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedProtocol, setCopiedProtocol] = useState(false);

  // Available services for the chosen secretariat
  const currentSec = secretariats.find((s) => s.id === selectedSecId) || secretariats[0];

  // GPS Simulation or Browser API
  const handleCaptureGPS = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCaptured({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5))
          });
          setGpsLoading(false);
        },
        () => {
          // Fallback to center coordinates of Itaú-RN
          setGpsCaptured({ lat: -5.8427, lng: -37.9048 });
          setGpsLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      setGpsCaptured({ lat: -5.8427, lng: -37.9048 });
      setGpsLoading(false);
    }
  };

  // Compress and attach real photo file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      try {
        const compressed = await compressImageFile(f);
        const newAtt: Attachment = {
          id: `att-${Date.now()}-${i}`,
          name: f.name,
          size: compressed.sizeFormatted,
          type: f.type || 'image/jpeg',
          dataUrl: compressed.dataUrl
        };
        setAttachments((prev) => [...prev, newAtt]);
      } catch {
        // Fallback
        const fallbackAtt: Attachment = {
          id: `att-${Date.now()}-${i}`,
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          type: f.type || 'application/octet-stream'
        };
        setAttachments((prev) => [...prev, fallbackAtt]);
      }
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Por favor, informe um título ou assunto para a manifestação.');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setErrorMsg('A descrição detalhada precisa conter pelo menos 15 caracteres.');
      return;
    }
    if (zone === 'urbana' && !street.trim()) {
      setErrorMsg('Por favor, informe o logradouro ou rua onde se localiza a demanda.');
      return;
    }
    if (!isAnonymous && !citizenName.trim()) {
      setErrorMsg('Informe seu nome ou selecione a opção de Manifestação Anônima.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const result = registerNewManifestation({
          type,
          category: category || currentSec.services[0] || 'Atendimento Geral',
          secretariatId: selectedSecId,
          title: title.trim(),
          description: description.trim(),
          location: {
            zone,
            street: zone === 'urbana' ? street.trim() : undefined,
            number: zone === 'urbana' ? number.trim() : undefined,
            neighborhood: zone === 'urbana' ? neighborhood : undefined,
            ruralCommunity: zone === 'rural' ? ruralCommunity : undefined,
            referencePoint: referencePoint.trim() || undefined,
            coordinates: gpsCaptured || undefined
          },
          citizen: {
            isAnonymous,
            name: isAnonymous ? undefined : citizenName.trim(),
            cpf: isAnonymous ? undefined : cpf.trim(),
            phone: isAnonymous ? undefined : phone.trim(),
            email: isAnonymous ? undefined : email.trim()
          },
          attachments,
          priority,
          slaDays: currentSec.defaultSlaDays || 5
        });

        setIsSubmitting(false);
        setSubmitSuccess(result);
      } catch {
        setIsSubmitting(false);
        setErrorMsg('Ocorreu um erro ao registrar a manifestação. Tente novamente.');
      }
    }, 700);
  };

  const handleCopyText = (text: string, type: 'protocol' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'protocol') {
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 2500);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  // SUCCESS SCREEN
  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden animate-in fade-in duration-300">
        <div className="bg-[#166534] text-white p-6 sm:p-8 text-center space-y-2">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 ring-4 ring-white/30">
            <span className="material-symbols-outlined text-4xl text-white">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Manifestação Registrada com Sucesso!</h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
            Sua solicitação foi enviada para a equipe da Prefeitura de Itaú-RN. O secretário responsável já recebeu a notificação.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-5 bg-[#F7F9FC] rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs text-[#434752] font-medium uppercase tracking-wider">Número do Protocolo</span>
                <div className="text-2xl font-black text-[#003781] tracking-wider">{submitSuccess.protocol}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(submitSuccess.protocol, 'protocol')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-lg transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-base">
                  {copiedProtocol ? 'check' : 'content_copy'}
                </span>
                <span>{copiedProtocol ? 'Copiado!' : 'Copiar Protocolo'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-[#434752] font-medium uppercase tracking-wider">Chave de Acesso Segura</span>
                <div className="text-xl font-black text-[#191C1E] tracking-widest">{submitSuccess.accessKey}</div>
                <p className="text-[11px] text-[#434752]">Guarde esta chave para consultar o andamento da sua solicitação.</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(submitSuccess.accessKey, 'key')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-lg transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-base">
                  {copiedKey ? 'check' : 'content_copy'}
                </span>
                <span>{copiedKey ? 'Copiada!' : 'Copiar Chave'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#003781] space-y-2">
            <div className="font-bold flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">notifications_active</span>
                <span>Notificação WhatsApp Disponível</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                100% Gratuito
              </span>
            </div>
            <p className="leading-relaxed text-slate-700">
              Você pode enviar os detalhes deste chamado diretamente para o WhatsApp oficial do Secretário(a) <strong>{currentSec.secretaryName}</strong> ({currentSec.whatsapp}):
            </p>
            <button
              type="button"
              onClick={() => {
                const locationText = zone === 'rural' ? ruralCommunity : `${street}, ${neighborhood}`;
                const msg = `🏛️ *CONECTA ITAÚ - PREFEITURA DE ITAÚ-RN*\nOlá, Secretário(a) *${currentSec.secretaryName}*!\n\nAcabei de registrar uma manifestação no portal oficial Conecta Itaú para a pasta da *${currentSec.acronym}*:\n\n📋 *Protocolo:* ${submitSuccess.protocol}\n🔑 *Chave de Acesso:* ${submitSuccess.accessKey}\n📌 *Assunto:* ${category || title}\n📍 *Localização:* ${locationText}\n📝 *Resumo:* "${title}"\n\nPor favor, acompanhe no sistema da Ouvidoria: conecta.itau.rn.gov.br`;
                openWhatsAppChat(currentSec.whatsapp, msg);
              }}
              className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>Enviar Protocolo no WhatsApp do Secretário Agora</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => goToTracking(submitSuccess.protocol, submitSuccess.accessKey)}
              className="flex-1 py-3 px-4 bg-[#003781] hover:bg-[#174EA6] text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">search</span>
              <span>Acompanhar este Protocolo Agora</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="py-3 px-5 bg-white border border-slate-300 hover:bg-slate-50 text-[#191C1E] font-medium text-sm rounded-xl transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE REGISTRATION FORM
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#003781] hover:underline mb-1"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Voltar ao Portal</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191C1E]">Registrar Manifestação</h1>
          <p className="text-xs sm:text-sm text-[#434752]">
            Preencha os campos abaixo com o máximo de detalhes para facilitar o atendimento.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-[#BA1A1A] text-xs font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-8">
        {/* 1. Tipo de Manifestação (Chips/Radios) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#191C1E]">
            1. Tipo de Manifestação *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'solicitacao', label: 'Solicitar serviço', icon: 'engineering' },
              { id: 'problema', label: 'Informar problema', icon: 'report_problem' },
              { id: 'denuncia', label: 'Denúncia / Reclamação', icon: 'shield_lock' },
              { id: 'elogio', label: 'Elogio ou sugestão', icon: 'thumb_up' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id as ManifestationType)}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                  type === t.id
                    ? 'border-[#003781] bg-blue-50/70 text-[#003781] ring-1 ring-[#003781]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{t.icon}</span>
                <span className="text-xs font-bold leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Secretaria Responsável e Assunto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#191C1E]">
              Secretaria Destino *
            </label>
            <select
              value={selectedSecId}
              onChange={(e) => {
                setSelectedSecId(e.target.value);
                const s = secretariats.find((sec) => sec.id === e.target.value);
                if (s && s.services.length > 0) {
                  setCategory(s.services[0]);
                }
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:outline-hidden focus:ring-2 focus:ring-[#003781]"
            >
              {secretariats.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.acronym} - {sec.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#434752]">
              Secretário: <strong className="text-slate-800">{currentSec.secretaryName}</strong> (SLA: {currentSec.defaultSlaDays} dias)
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#191C1E]">
              Categoria / Assunto Específico *
            </label>
            <select
              value={category || currentSec.services[0] || ''}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:outline-hidden focus:ring-2 focus:ring-[#003781]"
            >
              {currentSec.services.map((serv, idx) => (
                <option key={idx} value={serv}>
                  {serv}
                </option>
              ))}
              <option value="Outro assunto">Outro assunto não listado</option>
            </select>
          </div>
        </div>

        {/* 3. Título e Descrição com contador de caracteres */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#191C1E]">
              Título Resumido da Manifestação *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Poste com luz apagada há duas semanas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:outline-hidden focus:ring-2 focus:ring-[#003781]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#191C1E]">
                Descrição Detalhada do Fato *
              </label>
              <span className={`text-[11px] font-mono ${description.length >= 950 ? 'text-red-600 font-bold' : 'text-[#434752]'}`}>
                {description.length} / 1000 caracteres
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={1000}
              placeholder="Descreva o que aconteceu, horários, pontos de referência e detalhes que ajudem a equipe municipal a resolver com rapidez..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E] focus:outline-hidden focus:ring-2 focus:ring-[#003781]"
            />
          </div>
        </div>

        {/* 4. Localização (Urbana e Rural de Itaú-RN + GPS) */}
        <div className="space-y-4 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#191C1E]">
              2. Localização da Demanda *
            </label>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setZone('urbana')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  zone === 'urbana' ? 'bg-white text-[#003781] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Zona Urbana
              </button>
              <button
                type="button"
                onClick={() => setZone('rural')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  zone === 'rural' ? 'bg-white text-[#003781] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Zona Rural / Sítio
              </button>
            </div>
          </div>

          {zone === 'urbana' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-medium text-[#434752]">Rua / Logradouro *</label>
                <input
                  type="text"
                  placeholder="Ex: Rua Vicente Fernandes de Queiroz"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#434752]">Número / Lote</label>
                <input
                  type="text"
                  placeholder="Ex: 142 ou S/N"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                />
              </div>
              <div className="sm:col-span-1 space-y-1">
                <label className="block text-xs font-medium text-[#434752]">Bairro de Itaú *</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                >
                  {NEIGHBORHOODS_ITAU.map((bairro, idx) => (
                    <option key={idx} value={bairro}>
                      {bairro}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-medium text-[#434752]">Ponto de Referência</label>
                <input
                  type="text"
                  placeholder="Ex: Ao lado da praça ou perto do mercadinho"
                  value={referencePoint}
                  onChange={(e) => setReferencePoint(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#434752]">Comunidade / Sítio Rural de Itaú *</label>
                <select
                  value={ruralCommunity}
                  onChange={(e) => setRuralCommunity(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                >
                  {RURAL_COMMUNITIES_ITAU.map((sitio, idx) => (
                    <option key={idx} value={sitio}>
                      {sitio}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#434752]">Ponto de Referência no Sítio</label>
                <input
                  type="text"
                  placeholder="Ex: Próximo à capela, caixa d'água ou casa de Zé"
                  value={referencePoint}
                  onChange={(e) => setReferencePoint(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                />
              </div>
            </div>
          )}

          {/* GPS capture row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs text-[#434752]">
              <span className="material-symbols-outlined text-[#003781]">my_location</span>
              {gpsCaptured ? (
                <span className="font-medium text-emerald-800">
                  Localização GPS capturada: Lat {gpsCaptured.lat}, Lng {gpsCaptured.lng} (Itaú-RN)
                </span>
              ) : (
                <span>Opcional: fixe as coordenadas exatas do local pelo seu celular.</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleCaptureGPS}
              disabled={gpsLoading}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">
                {gpsLoading ? 'sync' : 'pin_drop'}
              </span>
              <span>{gpsLoading ? 'Obtendo GPS...' : gpsCaptured ? 'Atualizar GPS' : 'Capturar GPS Agora'}</span>
            </button>
          </div>
        </div>

        {/* 5. Anexos (Fotos ou Documentos) */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#191C1E]">
            3. Anexos e Evidências (Fotos / PDF)
          </label>
          <div className="p-4 border-2 border-dashed border-slate-300 hover:border-[#003781] rounded-xl text-center bg-[#F7F9FC] transition-colors relative cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="space-y-1">
              <span className="material-symbols-outlined text-3xl text-slate-400">cloud_upload</span>
              <p className="text-xs font-semibold text-[#191C1E]">
                Clique aqui para selecionar fotos ou documentos
              </p>
              <p className="text-[11px] text-[#434752]">
                Formatos aceitos: JPG, PNG, PDF (Até 10MB por arquivo)
              </p>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-slate-500">attach_file</span>
                    <span className="truncate font-medium text-slate-800">{att.name}</span>
                    <span className="text-[10px] text-slate-500">({att.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Remover anexo"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Dados do Solicitante / Anonimato */}
        <div className="space-y-4 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#191C1E]">
              4. Identificação do Cidadão
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-[#003781] focus:ring-[#003781]"
              />
              <span className="text-xs font-bold text-[#003781]">Manifestação 100% Anônima</span>
            </label>
          </div>

          {isAnonymous ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5">verified_user</span>
              <p>
                Sua identidade será totalmente preservada. Atenção: você precisará anotar rigorosamente o número do protocolo e a chave de acesso, pois não receberá avisos automáticos por e-mail ou WhatsApp.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-medium text-[#434752]">Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#434752]">WhatsApp / Telefone para Contato</label>
                <input
                  type="tel"
                  placeholder="(84) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                />
                <span className="text-[10px] text-slate-500">Usado para enviar o despacho da prefeitura.</span>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#434752]">E-mail para Acompanhamento</label>
                <input
                  type="email"
                  placeholder="exemplo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F9FC] border border-slate-300 rounded-lg text-[#191C1E]"
                />
              </div>
            </div>
          )}
        </div>

        {/* 7. Prioridade */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <label className="block text-xs font-medium text-[#434752]">Gravidade / Urgência Declarada</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'baixa', label: 'Baixa', desc: 'Rotina sem risco' },
              { id: 'media', label: 'Média', desc: 'Atenção necessária' },
              { id: 'alta', label: 'Alta', desc: 'Prejudica a comunidade' },
              { id: 'urgente', label: 'Urgente', desc: 'Risco de acidente/interrupção' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id as PriorityLevel)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  priority === p.id
                    ? 'bg-[#003781] text-white border-[#003781] shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p.label} - <span className="text-[10px] opacity-80">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#003781] hover:bg-[#174EA6] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">
              {isSubmitting ? 'sync' : 'send'}
            </span>
            <span>{isSubmitting ? 'Enviando Manifestação...' : 'Enviar Manifestação Oficial'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
