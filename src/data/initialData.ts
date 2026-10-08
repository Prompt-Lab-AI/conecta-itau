import { Secretariat, StaffUser, Manifestation } from '../types';

export const INITIAL_SECRETARIATS: Secretariat[] = [
  {
    id: 'sec-obras',
    name: 'Secretaria Municipal de Obras e Infraestrutura',
    acronym: 'SEMOB',
    secretaryName: 'Eng. Raimundo Nonato de Paiva',
    phone: '(84) 3376-0120',
    whatsapp: '(84) 99812-4010',
    email: 'obras@itau.rn.gov.br',
    icon: 'construction',
    defaultSlaDays: 5,
    color: '#003781',
    services: [
      'Iluminação Pública e Troca de Lâmpadas',
      'Tapa-buracos e Pavimentação',
      'Manutenção de Praças e Calçadas',
      'Recuperação de Estradas Vicinais',
      'Limpeza de Galerias e Bueiros'
    ]
  },
  {
    id: 'sec-saude',
    name: 'Secretaria Municipal de Saúde',
    acronym: 'SMS',
    secretaryName: 'Dra. Maria Cláudia Holanda',
    phone: '(84) 3376-0155',
    whatsapp: '(84) 99812-4022',
    email: 'saude@itau.rn.gov.br',
    icon: 'local_hospital',
    defaultSlaDays: 3,
    color: '#0D6EFD',
    services: [
      'Agendamento de Consultas e Exames',
      'Atendimento nas UBSs Municipais',
      'Vigilância Sanitária e Controle de Endemias',
      'Transporte de Pacientes (TFD)',
      'Medicamentos da Farmácia Básica'
    ]
  },
  {
    id: 'sec-educacao',
    name: 'Secretaria Municipal de Educação e Cultura',
    acronym: 'SEMEC',
    secretaryName: 'Prof. Antônio Marcos Soares',
    phone: '(84) 3376-0133',
    whatsapp: '(84) 99812-4033',
    email: 'educacao@itau.rn.gov.br',
    icon: 'school',
    defaultSlaDays: 7,
    color: '#0284C7',
    services: [
      'Transporte Escolar Rural e Urbano',
      'Merenda e Infraestrutura Escolar',
      'Matrículas e Vagas em Creches',
      'Apoio Pedagógico e Biblioteca Municipal'
    ]
  },
  {
    id: 'sec-limpeza',
    name: 'Secretaria de Serviços Urbanos e Meio Ambiente',
    acronym: 'SEMURB',
    secretaryName: 'José Wellington Bezerra',
    phone: '(84) 3376-0180',
    whatsapp: '(84) 99812-4044',
    email: 'servicosurbanos@itau.rn.gov.br',
    icon: 'cleaning_services',
    defaultSlaDays: 2,
    color: '#166534',
    services: [
      'Coleta de Lixo Domiciliar',
      'Poda de Árvores e Roço de Vias',
      'Entulho e Descarte Irregular',
      'Fiscalização Ambiental e Saneamento'
    ]
  },
  {
    id: 'sec-assistencia',
    name: 'Secretaria de Assistência Social e Habitação',
    acronym: 'SEMAS',
    secretaryName: 'Francisca Valéria Dantas',
    phone: '(84) 3376-0190',
    whatsapp: '(84) 99812-4055',
    email: 'assistenciasocial@itau.rn.gov.br',
    icon: 'diversity_3',
    defaultSlaDays: 4,
    color: '#7C3AED',
    services: [
      'Atendimento CRAS e Cadastro Único',
      'Benefícios Eventuais e Cesta Básica',
      'Programas para Idosos e Crianças',
      'Habitação Popular e Regularização'
    ]
  },
  {
    id: 'sec-agricultura',
    name: 'Secretaria de Agricultura e Recursos Hídricos',
    acronym: 'SEMARH',
    secretaryName: 'Manoel Ferreira dos Santos',
    phone: '(84) 3376-0112',
    whatsapp: '(84) 99812-4066',
    email: 'agricultura@itau.rn.gov.br',
    icon: 'water_drop',
    defaultSlaDays: 4,
    color: '#0891B2',
    services: [
      'Abastecimento de Água via Carro-Pipa',
      'Corte de Terra para Agricultores',
      'Manutenção de Poços Tubulares e Cataventos',
      'Apoio ao Produtor Rural e Feira Livre'
    ]
  }
];

export const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'usr-admin-1',
    name: 'Carlos Eduardo Silveira',
    email: 'ouvidor@itau.rn.gov.br',
    role: 'admin',
    roleTitle: 'Ouvidor Geral do Município',
    phone: '(84) 99812-9001',
    active: true
  },
  {
    id: 'usr-sec-obras',
    name: 'Eng. Raimundo Nonato de Paiva',
    email: 'secretario.obras@itau.rn.gov.br',
    role: 'secretario',
    roleTitle: 'Secretário Municipal de Obras',
    secretariatId: 'sec-obras',
    phone: '(84) 99812-4010',
    active: true
  },
  {
    id: 'usr-sec-saude',
    name: 'Dra. Maria Cláudia Holanda',
    email: 'secretaria.saude@itau.rn.gov.br',
    role: 'secretario',
    roleTitle: 'Secretária Municipal de Saúde',
    secretariatId: 'sec-saude',
    phone: '(84) 99812-4022',
    active: true
  },
  {
    id: 'usr-atendente-1',
    name: 'Ana Beatriz Medeiros',
    email: 'atendimento@itau.rn.gov.br',
    role: 'atendente',
    roleTitle: 'Atendente Central de Protocolos',
    phone: '(84) 99812-9005',
    active: true
  }
];

export const INITIAL_MANIFESTATIONS: Manifestation[] = [
  {
    id: 'man-001',
    protocol: '2026-ITAU-0842',
    accessKey: '7K9P2X',
    type: 'problema',
    category: 'Iluminação Pública e Troca de Lâmpadas',
    secretariatId: 'sec-obras',
    title: 'Lâmpada queimada em poste da Rua Vicente Fernandes',
    description: 'Poste em frente ao número 142 está com a lâmpada apagada há quase duas semanas. O trecho está muito escuro à noite, gerando insegurança para os moradores e pedestres que voltam da escola.',
    location: {
      zone: 'urbana',
      street: 'Rua Vicente Fernandes de Queiroz',
      number: '142',
      neighborhood: 'Centro',
      referencePoint: 'Próximo à padaria de Seu Geraldo',
      coordinates: { lat: -5.8421, lng: -37.9042 }
    },
    citizen: {
      isAnonymous: false,
      name: 'Francisco Canindé de Lima',
      cpf: '045.***.***-21',
      phone: '(84) 98845-1234',
      email: 'caninde.lima@gmail.com'
    },
    attachments: [
      {
        id: 'att-1',
        name: 'foto_poste_apagado.jpg',
        size: '1.4 MB',
        type: 'image/jpeg'
      }
    ],
    status: 'em_execucao',
    priority: 'alta',
    createdAt: '2026-10-04T09:15:00Z',
    updatedAt: '2026-10-06T14:30:00Z',
    slaDays: 5,
    assignedStaff: 'Eng. Raimundo Nonato de Paiva',
    timeline: [
      {
        id: 'tl-1',
        date: '2026-10-04T09:15:00Z',
        title: 'Manifestação Registrada',
        description: 'Protocolo gerado pelo cidadão através do portal web.',
        author: 'Portal do Cidadão',
        role: 'Sistema',
        status: 'novo'
      },
      {
        id: 'tl-2',
        date: '2026-10-04T10:45:00Z',
        title: 'Triagem e Encaminhamento',
        description: 'Manifestação analisada pela Ouvidoria e encaminhada para a Secretaria de Obras.',
        author: 'Ana Beatriz Medeiros',
        role: 'Atendente Central',
        status: 'encaminhado'
      },
      {
        id: 'tl-3',
        date: '2026-10-06T14:30:00Z',
        title: 'Equipe de Campo Escalada',
        description: 'Ordem de serviço nº 184 emitida para troca do reator e lâmpada LED. Veículo com cesto aéreo programado para o turno matutino.',
        author: 'Eng. Raimundo Nonato de Paiva',
        role: 'Secretário Municipal de Obras',
        status: 'em_execucao'
      }
    ],
    complementations: []
  },
  {
    id: 'man-002',
    protocol: '2026-ITAU-0843',
    accessKey: '4M2L9Q',
    type: 'solicitacao',
    category: 'Abastecimento de Água via Carro-Pipa',
    secretariatId: 'sec-agricultura',
    title: 'Solicitação de abastecimento de cisterna comunitária',
    description: 'A cisterna comunitária do Sítio Poço Escuro está com o nível crítico de água devido à estiagem. Solicitamos a rota do caminhão pipa com urgência para atender cerca de 18 famílias cadastradas na associação comunitária.',
    location: {
      zone: 'rural',
      ruralCommunity: 'Sítio Poço Escuro',
      referencePoint: 'Ao lado da Capela de Santa Luzia',
      coordinates: { lat: -5.8612, lng: -37.8920 }
    },
    citizen: {
      isAnonymous: false,
      name: 'Maria das Graças Silva',
      cpf: '012.***.***-89',
      phone: '(84) 99611-7788',
      email: 'graca.silva.itau@hotmail.com'
    },
    attachments: [
      {
        id: 'att-2',
        name: 'nivel_cisterna.jpg',
        size: '2.1 MB',
        type: 'image/jpeg'
      }
    ],
    status: 'em_analise',
    priority: 'urgente',
    createdAt: '2026-10-05T11:20:00Z',
    updatedAt: '2026-10-05T15:00:00Z',
    slaDays: 4,
    assignedStaff: 'Manoel Ferreira dos Santos',
    timeline: [
      {
        id: 'tl-4',
        date: '2026-10-05T11:20:00Z',
        title: 'Manifestação Registrada',
        description: 'Protocolo de solicitação de água rural registrado com prioridade alta.',
        author: 'Portal do Cidadão',
        role: 'Sistema',
        status: 'novo'
      },
      {
        id: 'tl-5',
        date: '2026-10-05T15:00:00Z',
        title: 'Em Análise Logística',
        description: 'Recebido pela Secretaria de Agricultura. Verificando escala do cronograma de pipas do convênio da Defesa Civil.',
        author: 'Manoel Ferreira dos Santos',
        role: 'Secretário de Agricultura',
        status: 'em_analise'
      }
    ],
    complementations: []
  },
  {
    id: 'man-003',
    protocol: '2026-ITAU-0844',
    accessKey: '9V1X8H',
    type: 'problema',
    category: 'Tapa-buracos e Pavimentação',
    secretariatId: 'sec-obras',
    title: 'Buraco profundo na entrada do Bairro São Geraldo',
    description: 'Após as últimas chuvas formou-se uma cratera na curva de acesso ao bairro, arrancando parte do calçamento e oferecendo perigo constante de acidentes para motociclistas.',
    location: {
      zone: 'urbana',
      street: 'Avenida Coronel Severino',
      number: 'S/N',
      neighborhood: 'Bairro São Geraldo',
      referencePoint: 'Próximo ao trevo de acesso à RN-117',
      coordinates: { lat: -5.8450, lng: -37.9100 }
    },
    citizen: {
      isAnonymous: false,
      name: 'José Valdemir de Morais',
      cpf: '034.***.***-45',
      phone: '(84) 99123-5566',
      email: 'valdemir.morais@gmail.com'
    },
    attachments: [
      {
        id: 'att-3',
        name: 'buraco_calcamento.jpg',
        size: '1.8 MB',
        type: 'image/jpeg'
      }
    ],
    status: 'concluido',
    priority: 'alta',
    createdAt: '2026-09-28T08:00:00Z',
    updatedAt: '2026-10-02T16:20:00Z',
    slaDays: 5,
    assignedStaff: 'Eng. Raimundo Nonato de Paiva',
    timeline: [
      {
        id: 'tl-6',
        date: '2026-09-28T08:00:00Z',
        title: 'Manifestação Aberta',
        description: 'Registro realizado com foto do dano na via.',
        author: 'Portal do Cidadão',
        role: 'Sistema',
        status: 'novo'
      },
      {
        id: 'tl-7',
        date: '2026-09-29T09:30:00Z',
        title: 'Vistoria Técnica Realizada',
        description: 'Engenheiro fiscal esteve no local e delimitou recomposição de 15m² em paralelepípedo com reforço de base.',
        author: 'Eng. Raimundo Nonato de Paiva',
        role: 'Secretário Municipal de Obras',
        status: 'em_execucao'
      },
      {
        id: 'tl-8',
        date: '2026-10-02T16:20:00Z',
        title: 'Serviço Concluído com Sucesso',
        description: 'Recomposição do calçamento finalizada e via liberada para o tráfego normal de veículos.',
        author: 'Eng. Raimundo Nonato de Paiva',
        role: 'Secretário Municipal de Obras',
        status: 'concluido'
      }
    ],
    complementations: [],
    evaluation: {
      rating: 5,
      comment: 'Serviço muito bem executado e equipe atenciosa! Ficou excelente.',
      evaluatedAt: '2026-10-03T10:15:00Z',
      solvedProblem: true
    }
  },
  {
    id: 'man-004',
    protocol: '2026-ITAU-0845',
    accessKey: '3B8W5T',
    type: 'elogio',
    category: 'Atendimento nas UBSs Municipais',
    secretariatId: 'sec-saude',
    title: 'Elogio à equipe da Unidade Básica de Saúde Dr. Pedro Paulo',
    description: 'Gostaria de registrar um agradecimento especial à técnica de enfermagem e à médica da UBS central pelo atendimento humanizado, pontualidade e dedicação prestados à minha mãe idosa durante a vacinação e curativo.',
    location: {
      zone: 'urbana',
      street: 'Rua São José',
      number: '45',
      neighborhood: 'Centro',
      referencePoint: 'UBS Dr. Pedro Paulo'
    },
    citizen: {
      isAnonymous: false,
      name: 'Antônia Luciana Gurgel',
      cpf: '067.***.***-10',
      phone: '(84) 99402-1199',
      email: 'lucianagurgel@gmail.com'
    },
    attachments: [],
    status: 'concluido',
    priority: 'baixa',
    createdAt: '2026-10-01T14:10:00Z',
    updatedAt: '2026-10-02T09:00:00Z',
    slaDays: 3,
    assignedStaff: 'Dra. Maria Cláudia Holanda',
    timeline: [
      {
        id: 'tl-9',
        date: '2026-10-01T14:10:00Z',
        title: 'Elogio Recebido',
        description: 'Elogio registrado pelo munícipe no Conecta Itaú.',
        author: 'Portal do Cidadão',
        role: 'Sistema',
        status: 'novo'
      },
      {
        id: 'tl-10',
        date: '2026-10-02T09:00:00Z',
        title: 'Elogio Repassado à Equipe',
        description: 'Mensagem encaminhada para o mural da unidade de saúde e anexada na ficha de avaliação da equipe de referência.',
        author: 'Dra. Maria Cláudia Holanda',
        role: 'Secretária Municipal de Saúde',
        status: 'concluido'
      }
    ],
    complementations: []
  },
  {
    id: 'man-005',
    protocol: '2026-ITAU-0846',
    accessKey: '8N4D3C',
    type: 'denuncia',
    category: 'Entulho e Descarte Irregular',
    secretariatId: 'sec-limpeza',
    title: 'Descarte irregular de entulho e lixo hospitalar em terreno baldio',
    description: 'Caminhonete descarregou sacos pretos de restos de construção e material contaminado em terreno baldio próximo à ponte velha. Há risco para as crianças vizinhas e mau cheiro insuportável.',
    location: {
      zone: 'urbana',
      street: 'Travessa Riachuelo',
      number: 'Final da rua',
      neighborhood: 'Nossa Senhora das Graças',
      referencePoint: 'Próximo à antiga olaria'
    },
    citizen: {
      isAnonymous: true
    },
    attachments: [
      {
        id: 'att-5',
        name: 'entulho_terreno.jpg',
        size: '2.5 MB',
        type: 'image/jpeg'
      }
    ],
    status: 'novo',
    priority: 'urgente',
    createdAt: '2026-10-07T08:30:00Z',
    updatedAt: '2026-10-07T08:30:00Z',
    slaDays: 2,
    timeline: [
      {
        id: 'tl-11',
        date: '2026-10-07T08:30:00Z',
        title: 'Denúncia Anônima Aberta',
        description: 'Protocolo registrado com sigilo de identidade garantido por lei.',
        author: 'Cidadão Anônimo',
        role: 'Cidadão',
        status: 'novo'
      }
    ],
    complementations: []
  }
];

export const RURAL_COMMUNITIES_ITAU = [
  'Sítio Poço Escuro',
  'Sítio Varzinha',
  'Sítio Currais',
  'Sítio Lagoa Seca',
  'Sítio Baixa Verde',
  'Sítio Malhada Nova',
  'Sítio Olho D’Água',
  'Comunidade Canto de Baixo',
  'Comunidade São Bento Rural'
];

export const NEIGHBORHOODS_ITAU = [
  'Centro',
  'Bairro São Geraldo',
  'Bairro Nossa Senhora das Graças',
  'Alto do Rodrigues',
  'Bairro Primavera',
  'Conjunto Habitacional Nova Esperança',
  'Zona de Expansão Norte'
];
