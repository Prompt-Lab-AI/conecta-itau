import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Manifestation, 
  Secretariat, 
  StaffUser, 
  WhatsAppNotification, 
  ManifestationStatus,
  TimelineEntry,
  Attachment
} from '../types';
import { 
  INITIAL_MANIFESTATIONS, 
  INITIAL_SECRETARIATS, 
  INITIAL_STAFF_USERS 
} from '../data/initialData';
import { playNotificationChime } from '../utils/audio';
import { notifyNewOccurrence, requestNotificationPermission } from '../utils/notifications';
import {
  subscribeToManifestations,
  subscribeToSecretariats,
  subscribeToStaffUsers,
  persistManifestation,
  persistSecretariat,
  persistStaffUser
} from '../lib/firebase';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  manifestations: Manifestation[];
  secretariats: Secretariat[];
  staffUsers: StaffUser[];
  currentStaffUser: StaffUser | null;
  activeCitizenView: 'home' | 'register' | 'track';
  activeStaffTab: 'atendimento' | 'gestao' | 'configuracoes';
  prefilledTrackingCode: string;
  prefilledTrackingKey: string;
  emergencyModalOpen: boolean;
  activeWhatsAppNotification: WhatsAppNotification | null;
  toast: Toast | null;
  isCloudConnected: boolean;
  alertsActive: boolean;
  enableBrowserAlerts: () => Promise<boolean>;
  
  // Navigation actions
  setActiveCitizenView: (view: 'home' | 'register' | 'track') => void;
  setActiveStaffTab: (tab: 'atendimento' | 'gestao' | 'configuracoes') => void;
  setEmergencyModalOpen: (open: boolean) => void;
  setActiveWhatsAppNotification: (notif: WhatsAppNotification | null) => void;
  goToTracking: (protocol: string, key?: string) => void;
  showToast: (title: string, message: string, type?: Toast['type']) => void;

  // Business logic
  registerNewManifestation: (manifestationData: Omit<Manifestation, 'id' | 'protocol' | 'accessKey' | 'createdAt' | 'updatedAt' | 'timeline' | 'complementations' | 'status'>) => { protocol: string; accessKey: string };
  updateManifestationStatus: (
    protocol: string, 
    newStatus: ManifestationStatus, 
    note: string, 
    notifyWhatsApp: boolean,
    assignedStaffName?: string
  ) => void;
  addComplementation: (protocol: string, text: string, attachments?: Attachment[]) => void;
  evaluateManifestation: (protocol: string, rating: number, comment: string, solvedProblem: boolean) => void;
  
  // Staff Auth
  loginStaff: (userId: string) => void;
  logoutStaff: () => void;
  switchStaffRole: (userId: string) => void;

  // Management CRUD
  addSecretariat: (secretariat: Omit<Secretariat, 'id'>) => void;
  updateSecretariat: (id: string, updated: Partial<Secretariat>) => void;
  deleteSecretariat: (id: string) => void;
  addStaffUser: (user: Omit<StaffUser, 'id'>) => void;
  updateStaffUser: (id: string, updated: Partial<StaffUser>) => void;
  deleteStaffUser: (id: string) => void;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MANIFESTATIONS: 'conecta_itau_manifestations_v1',
  SECRETARIATS: 'conecta_itau_secretariats_v1',
  STAFF_USERS: 'conecta_itau_staff_v1',
  CURRENT_USER: 'conecta_itau_current_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manifestations, setManifestations] = useState<Manifestation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MANIFESTATIONS);
      return saved ? JSON.parse(saved) : INITIAL_MANIFESTATIONS;
    } catch {
      return INITIAL_MANIFESTATIONS;
    }
  });

  const [secretariats, setSecretariats] = useState<Secretariat[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECRETARIATS);
      return saved ? JSON.parse(saved) : INITIAL_SECRETARIATS;
    } catch {
      return INITIAL_SECRETARIATS;
    }
  });

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF_USERS);
      return saved ? JSON.parse(saved) : INITIAL_STAFF_USERS;
    } catch {
      return INITIAL_STAFF_USERS;
    }
  });

  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeCitizenView, setActiveCitizenView] = useState<'home' | 'register' | 'track'>('home');
  const [activeStaffTab, setActiveStaffTab] = useState<'atendimento' | 'gestao' | 'configuracoes'>('atendimento');
  const [prefilledTrackingCode, setPrefilledTrackingCode] = useState('');
  const [prefilledTrackingKey, setPrefilledTrackingKey] = useState('');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [activeWhatsAppNotification, setActiveWhatsAppNotification] = useState<WhatsAppNotification | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [alertsActive, setAlertsActive] = useState(() => {
    return typeof Notification !== 'undefined' && Notification.permission === 'granted';
  });

  const enableBrowserAlerts = async () => {
    const granted = await requestNotificationPermission();
    setAlertsActive(granted);
    if (granted) {
      showToast('Notificações Ativadas', 'Você receberá avisos sonoros e na tela a cada nova demanda.', 'success');
      notifyNewOccurrence('Conecta Itaú', 'Alertas da Ouvidoria Municipal ativados com sucesso.');
    } else {
      showToast('Permissão Negada', 'Habilite as notificações no seu navegador para receber alertas.', 'warning');
    }
    return granted;
  };

  // Firestore Real-Time Subscriptions
  useEffect(() => {
    let unsubscribeManifestations: (() => void) | undefined;
    let unsubscribeSecretariats: (() => void) | undefined;
    let unsubscribeStaff: (() => void) | undefined;
    let isInitialLoad = true;

    try {
      unsubscribeManifestations = subscribeToManifestations((cloudItems) => {
        if (cloudItems && cloudItems.length > 0) {
          // If not initial load and there are new items, notify!
          if (!isInitialLoad) {
            setManifestations((prev) => {
              const prevProtocols = new Set(prev.map((p) => p.protocol));
              const brandNew = cloudItems.find((item) => !prevProtocols.has(item.protocol));
              if (brandNew) {
                notifyNewOccurrence(
                  `Novo Chamado: #${brandNew.protocol}`,
                  `${brandNew.category} - ${brandNew.location.zone === 'rural' ? brandNew.location.ruralCommunity : brandNew.location.neighborhood}`
                );
              }
              return cloudItems;
            });
          } else {
            setManifestations(cloudItems);
            isInitialLoad = false;
          }
          setIsCloudConnected(true);
        }
      });

      unsubscribeSecretariats = subscribeToSecretariats((cloudSecs) => {
        if (cloudSecs && cloudSecs.length > 0) {
          setSecretariats(cloudSecs);
        }
      });

      unsubscribeStaff = subscribeToStaffUsers((cloudUsers) => {
        if (cloudUsers && cloudUsers.length > 0) {
          setStaffUsers(cloudUsers);
        }
      });
    } catch (err) {
      console.warn('Operando com fallback local:', err);
    }

    return () => {
      unsubscribeManifestations?.();
      unsubscribeSecretariats?.();
      unsubscribeStaff?.();
    };
  }, []);

  // Sync to local storage as continuous fallback
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MANIFESTATIONS, JSON.stringify(manifestations));
  }, [manifestations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECRETARIATS, JSON.stringify(secretariats));
  }, [secretariats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF_USERS, JSON.stringify(staffUsers));
  }, [staffUsers]);

  useEffect(() => {
    if (currentStaffUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentStaffUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentStaffUser]);

  const showToast = (title: string, message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 5000);
  };

  const goToTracking = (protocol: string, key: string = '') => {
    setPrefilledTrackingCode(protocol);
    setPrefilledTrackingKey(key);
    setActiveCitizenView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Business Logic: Register new Manifestation
  const registerNewManifestation = (
    data: Omit<Manifestation, 'id' | 'protocol' | 'accessKey' | 'createdAt' | 'updatedAt' | 'timeline' | 'complementations' | 'status'>
  ) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const protocol = `2026-ITAU-${randomNum}`;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let accessKey = '';
    for (let i = 0; i < 6; i++) {
      accessKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const now = new Date().toISOString();
    const targetSecretariat = secretariats.find((s) => s.id === data.secretariatId) || secretariats[0];

    const initialTimeline: TimelineEntry = {
      id: `tl-${Date.now()}`,
      date: now,
      title: 'Manifestação Aberta pelo Munícipe',
      description: `Protocolo registrado com sucesso no banco de dados da Ouvidoria. Encaminhado automaticamente para triagem na ${targetSecretariat.name}.`,
      author: data.citizen.isAnonymous ? 'Cidadão Anônimo' : data.citizen.name || 'Munícipe de Itaú',
      role: 'Cidadão',
      status: 'novo'
    };

    const newManifestation: Manifestation = {
      ...data,
      id: `man-${Date.now()}`,
      protocol,
      accessKey,
      status: 'novo',
      createdAt: now,
      updatedAt: now,
      slaDays: targetSecretariat.defaultSlaDays || 5,
      timeline: [initialTimeline],
      complementations: []
    };

    // Update local state immediately
    setManifestations((prev) => [newManifestation, ...prev]);

    // Persist to Cloud Firestore database
    persistManifestation(newManifestation);

    // Audio chime
    playNotificationChime();

    // Trigger instant toast notification
    showToast(
      'Protocolo Aberto!',
      `Seu chamado #${protocol} foi registrado no banco de dados e o Secretário foi notificado.`,
      'success'
    );

    // Business rule: Notificação instantânea no WhatsApp do secretário/coordenador responsável
    const waNotification: WhatsAppNotification = {
      id: `wa-${Date.now()}`,
      recipientName: targetSecretariat.secretaryName,
      recipientPhone: targetSecretariat.whatsapp,
      recipientType: 'secretario',
      protocol: protocol,
      message: `🔔 *ALERTA CONECTA ITAÚ*\nOlá, *${targetSecretariat.secretaryName}*!\nNovo chamado recebido para a *${targetSecretariat.acronym}*:\n\n📋 *Protocolo:* ${protocol}\n📌 *Assunto:* ${newManifestation.category}\n📍 *Local:* ${newManifestation.location.zone === 'rural' ? newManifestation.location.ruralCommunity : newManifestation.location.street + ', ' + (newManifestation.location.neighborhood || '')}\n⚠️ *Prioridade:* ${newManifestation.priority.toUpperCase()}\n\nAcesse o Painel de Atendimento do Município para despachar.`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setActiveWhatsAppNotification(waNotification);

    return { protocol, accessKey };
  };

  // Business Logic: Update status and dispatch internal dispatch
  const updateManifestationStatus = (
    protocol: string,
    newStatus: ManifestationStatus,
    note: string,
    notifyWhatsApp: boolean,
    assignedStaffName?: string
  ) => {
    const now = new Date().toISOString();
    const authorName = currentStaffUser?.name || 'Servidor Municipal';
    const authorRole = currentStaffUser?.roleTitle || 'Atendimento Conecta Itaú';

    let statusTitle = 'Atualização de Status';
    if (newStatus === 'em_analise') statusTitle = 'Chamado em Análise Técnica';
    if (newStatus === 'encaminhado') statusTitle = 'Encaminhado para Equipe de Campo';
    if (newStatus === 'em_execucao') statusTitle = 'Serviço em Execução';
    if (newStatus === 'concluido') statusTitle = 'Atendimento Concluído';
    if (newStatus === 'indeferido') statusTitle = 'Manifestação Finalizada / Indeferida';

    let updatedTarget: Manifestation | undefined;

    setManifestations((prev) =>
      prev.map((item) => {
        if (item.protocol === protocol) {
          const newTimelineEntry: TimelineEntry = {
            id: `tl-${Date.now()}`,
            date: now,
            title: statusTitle,
            description: note,
            author: authorName,
            role: authorRole,
            status: newStatus
          };

          const updated = {
            ...item,
            status: newStatus,
            updatedAt: now,
            assignedStaff: assignedStaffName || item.assignedStaff || authorName,
            timeline: [...item.timeline, newTimelineEntry]
          };
          updatedTarget = updated;

          // Save to Firestore
          persistManifestation(updated);

          return updated;
        }
        return item;
      })
    );

    playNotificationChime();
    showToast('Status Atualizado', `Protocolo #${protocol} atualizado para "${statusTitle}". Salvo na nuvem.`, 'info');

    // Trigger WhatsApp notification to the citizen
    if (notifyWhatsApp && updatedTarget) {
      const citizenPhone = (updatedTarget as Manifestation).citizen.phone || '(84) 99812-4010';
      const citizenName = (updatedTarget as Manifestation).citizen.name || 'Cidadão';

      const waNotif: WhatsAppNotification = {
        id: `wa-${Date.now()}`,
        recipientName: citizenName,
        recipientPhone: citizenPhone,
        recipientType: 'cidadao',
        protocol: protocol,
        message: `🏛️ *PREFEITURA MUNICIPAL DE ITAÚ - CONECTA ITAÚ*\nOlá, *${citizenName}*!\n\nHouve uma atualização na sua solicitação:\n📋 *Protocolo:* ${protocol}\n📌 *Novo Status:* ${statusTitle}\n📝 *Despacho:* "${note}"\n\nAcompanhe os detalhes no portal: conecta.itau.rn.gov.br`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setActiveWhatsAppNotification(waNotif);
    }
  };

  const addComplementation = (protocol: string, text: string, attachments: Attachment[] = []) => {
    const now = new Date().toISOString();
    setManifestations((prev) =>
      prev.map((item) => {
        if (item.protocol === protocol) {
          const complementation = {
            id: `comp-${Date.now()}`,
            date: now,
            text,
            author: item.citizen.name || 'Cidadão Solicitante',
            attachments
          };

          const timelineNote: TimelineEntry = {
            id: `tl-${Date.now()}`,
            date: now,
            title: 'Informação Complementar Anexada',
            description: `O cidadão adicionou novos esclarecimentos: "${text}"`,
            author: item.citizen.name || 'Cidadão Solicitante',
            role: 'Cidadão'
          };

          const updated = {
            ...item,
            updatedAt: now,
            complementations: [...item.complementations, complementation],
            timeline: [...item.timeline, timelineNote]
          };

          persistManifestation(updated);
          return updated;
        }
        return item;
      })
    );

    showToast('Complementação Enviada', 'Suas informações foram salvas no protocolo.', 'success');
  };

  const evaluateManifestation = (protocol: string, rating: number, comment: string, solvedProblem: boolean) => {
    const now = new Date().toISOString();
    setManifestations((prev) =>
      prev.map((item) => {
        if (item.protocol === protocol) {
          const timelineNote: TimelineEntry = {
            id: `tl-${Date.now()}`,
            date: now,
            title: `Avaliação do Cidadão: ${rating} / 5 estrelas`,
            description: `O munícipe avaliou o atendimento com a nota ${rating}/5. Resolveu o problema: ${solvedProblem ? 'Sim' : 'Não'}. Comentário: "${comment || 'Sem comentários adicionais.'}"`,
            author: item.citizen.name || 'Munícipe',
            role: 'Cidadão'
          };

          const updated = {
            ...item,
            updatedAt: now,
            evaluation: {
              rating,
              comment,
              evaluatedAt: now,
              solvedProblem
            },
            timeline: [...item.timeline, timelineNote]
          };

          persistManifestation(updated);
          return updated;
        }
        return item;
      })
    );

    showToast('Obrigado pela Avaliação!', 'Sua opinião foi gravada no banco de dados municipal.', 'success');
  };

  // Staff management
  const loginStaff = (userId: string) => {
    const user = staffUsers.find((u) => u.id === userId || u.email === userId);
    if (user) {
      setCurrentStaffUser(user);
      showToast('Bem-vindo(a)', `Conectado como ${user.name} (${user.roleTitle}).`, 'success');
    }
  };

  const logoutStaff = () => {
    setCurrentStaffUser(null);
    showToast('Sessão Encerrada', 'Você retornou à área pública do cidadão.', 'info');
  };

  const switchStaffRole = (userId: string) => {
    const user = staffUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentStaffUser(user);
      showToast('Perfil Alternado', `Operando agora como ${user.name} (${user.roleTitle})`, 'info');
    }
  };

  const addSecretariat = (sec: Omit<Secretariat, 'id'>) => {
    const newSec: Secretariat = {
      ...sec,
      id: `sec-${Date.now()}`
    };
    setSecretariats((prev) => [...prev, newSec]);
    persistSecretariat(newSec);
    showToast('Secretaria Criada', `A secretaria ${newSec.name} foi adicionada ao banco de dados.`, 'success');
  };

  const updateSecretariat = (id: string, updated: Partial<Secretariat>) => {
    setSecretariats((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const full = { ...s, ...updated };
          persistSecretariat(full);
          return full;
        }
        return s;
      })
    );
    showToast('Secretaria Atualizada', 'As alterações foram salvas no banco.', 'success');
  };

  const deleteSecretariat = (id: string) => {
    setSecretariats((prev) => prev.filter((s) => s.id !== id));
    showToast('Secretaria Removida', 'Secretaria excluída da base municipal.', 'info');
  };

  const addStaffUser = (usr: Omit<StaffUser, 'id'>) => {
    const newUser: StaffUser = {
      ...usr,
      id: `usr-${Date.now()}`
    };
    setStaffUsers((prev) => [...prev, newUser]);
    persistStaffUser(newUser);
    showToast('Servidor Cadastrado', `O usuário ${newUser.name} foi gravado na nuvem.`, 'success');
  };

  const updateStaffUser = (id: string, updated: Partial<StaffUser>) => {
    setStaffUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const full = { ...u, ...updated };
          persistStaffUser(full);
          return full;
        }
        return u;
      })
    );
    showToast('Usuário Atualizado', 'Cadastro do servidor atualizado.', 'success');
  };

  const deleteStaffUser = (id: string) => {
    setStaffUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Usuário Removido', 'Acesso de servidor revogado.', 'info');
  };

  const resetToInitialData = () => {
    setManifestations(INITIAL_MANIFESTATIONS);
    setSecretariats(INITIAL_SECRETARIATS);
    setStaffUsers(INITIAL_STAFF_USERS);
    // Persist all initials
    for (const m of INITIAL_MANIFESTATIONS) persistManifestation(m);
    for (const s of INITIAL_SECRETARIATS) persistSecretariat(s);
    for (const u of INITIAL_STAFF_USERS) persistStaffUser(u);
    showToast('Dados Restaurados', 'O banco de dados foi reiniciado com o modelo de Itaú-RN.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        manifestations,
        secretariats,
        staffUsers,
        currentStaffUser,
        activeCitizenView,
        activeStaffTab,
        prefilledTrackingCode,
        prefilledTrackingKey,
        emergencyModalOpen,
        activeWhatsAppNotification,
        toast,
        isCloudConnected,
        alertsActive,
        enableBrowserAlerts,
        setActiveCitizenView,
        setActiveStaffTab,
        setEmergencyModalOpen,
        setActiveWhatsAppNotification,
        goToTracking,
        showToast,
        registerNewManifestation,
        updateManifestationStatus,
        addComplementation,
        evaluateManifestation,
        loginStaff,
        logoutStaff,
        switchStaffRole,
        addSecretariat,
        updateSecretariat,
        deleteSecretariat,
        addStaffUser,
        updateStaffUser,
        deleteStaffUser,
        resetToInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
