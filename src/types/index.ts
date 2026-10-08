export type ManifestationType = 'solicitacao' | 'problema' | 'denuncia' | 'elogio';

export type ManifestationStatus = 
  | 'novo'
  | 'em_analise'
  | 'encaminhado'
  | 'em_execucao'
  | 'concluido'
  | 'indeferido';

export type PriorityLevel = 'baixa' | 'media' | 'alta' | 'urgente';

export type UserRole = 'cidadao' | 'atendente' | 'secretario' | 'admin';

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  author: string;
  role: string;
  status?: ManifestationStatus;
  isInternal?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
}

export interface LocationInfo {
  zone: 'urbana' | 'rural';
  street?: string;
  number?: string;
  neighborhood?: string;
  ruralCommunity?: string;
  referencePoint?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CitizenContact {
  isAnonymous: boolean;
  name?: string;
  cpf?: string;
  phone?: string;
  email?: string;
}

export interface Evaluation {
  rating: number; // 1 to 5
  comment: string;
  evaluatedAt: string;
  solvedProblem: boolean;
}

export interface Complementation {
  id: string;
  date: string;
  text: string;
  author: string;
  attachments?: Attachment[];
}

export interface Manifestation {
  id: string;
  protocol: string;
  accessKey: string;
  type: ManifestationType;
  category: string;
  secretariatId: string;
  title: string;
  description: string;
  location: LocationInfo;
  citizen: CitizenContact;
  attachments: Attachment[];
  status: ManifestationStatus;
  priority: PriorityLevel;
  createdAt: string;
  updatedAt: string;
  slaDays: number;
  assignedStaff?: string;
  timeline: TimelineEntry[];
  complementations: Complementation[];
  evaluation?: Evaluation;
}

export interface Secretariat {
  id: string;
  name: string;
  acronym: string;
  secretaryName: string;
  phone: string;
  whatsapp: string;
  email: string;
  icon: string;
  defaultSlaDays: number;
  services: string[];
  color: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  secretariatId?: string;
  phone: string;
  avatar?: string;
  active: boolean;
}

export interface WhatsAppNotification {
  id: string;
  recipientName: string;
  recipientPhone: string;
  recipientType: 'secretario' | 'cidadao';
  protocol: string;
  message: string;
  timestamp: string;
}
