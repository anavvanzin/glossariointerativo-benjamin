export type EpistemicCategory =
  | 'autoral'
  | 'mobilizado'
  | 'operacional'
  | 'alegoria'
  | 'interlocutor'
  | 'warburg';

export type IconocraticRegime =
  | 'FUNDACIONAL'
  | 'NORMATIVO'
  | 'MILITAR'
  | 'CONTRA-ALEGORIA'
  | 'TRANSVERSAL';

export type CorpusScope = 'core' | 'comparador_apendice' | 'aparato_conceitual';

export type ProceduralArchetype =
  | 'scales_justitia'
  | 'coin_marianne'
  | 'monument_niederwald'
  | 'pediment_forensic'
  | 'stamp_republic'
  | 'atlas_panel'
  | 'two_bodies_crown'
  | 'broken_column_contra';

export interface HardeningIndicatorDef {
  id: string;
  index: number;
  key: string;
  label: string;
  measures: string;
}

export interface ConstellationNodeItem {
  id: string;
  title: string;
  subtitle?: string;
  category: EpistemicCategory;
  categoryLabel: string;
  chapterRef?: string;
  regime: IconocraticRegime;
  corpusScope: CorpusScope;
  country?: string;
  period?: string;
  support?: string;
  iconclassCodes?: string[];
  definition: string;
  provenanceNote: string;
  thesisUsage: string;
  senseProducedVsReceived?: string;
  corpusSilenceNote?: string;
  abntKeys: string[];
  connections: string[]; // IDs of connected nodes in the constellation
  archetype: ProceduralArchetype;
  // 10 ordinal indicators (0-3), NEVER summed per 2026-09-24 decision
  hardeningProfile?: Record<string, 0 | 1 | 2 | 3>;
  verificarFlag?: string;
}

export interface AbntReference {
  key: string;
  citation: string;
  translationNote?: string;
  statusNote?: string;
  category: 'primaria_teorica' | 'alegoria_nacional' | 'metodo_constelacao';
}

export const HARDENING_INDICATORS: HardeningIndicatorDef[] = [
  {
    id: 'ind-1',
    index: 1,
    key: 'desincorporacao',
    label: 'desincorporação',
    measures: 'Perda de corpo/carne vivos em favor do emblema estatal.',
  },
  {
    id: 'ind-2',
    index: 2,
    key: 'rigidez_postural',
    label: 'rigidez_postural',
    measures: 'Imobilização da pose; ausência de gesto ou pathos.',
  },
  {
    id: 'ind-3',
    index: 3,
    key: 'dessexualizacao',
    label: 'dessexualização',
    measures: 'Apagamento de marcas de desejo e sexualidade da figura.',
  },
  {
    id: 'ind-4',
    index: 4,
    key: 'uniformizacao_facial',
    label: 'uniformização_facial',
    measures: 'Rosto-tipo neoclássico, intercambiável, sem individuação.',
  },
  {
    id: 'ind-5',
    index: 5,
    key: 'heraldicizacao',
    label: 'heraldicização',
    measures: 'Conversão da figura em brasão ou atributo heráldico de Estado.',
  },
  {
    id: 'ind-6',
    index: 6,
    key: 'enquadramento_arquitetonico',
    label: 'enquadramento_arquitetônico',
    measures: 'Submissão da figura à moldura monumental ou forense.',
  },
  {
    id: 'ind-7',
    index: 7,
    key: 'apagamento_narrativo',
    label: 'apagamento_narrativo',
    measures: 'Supressão de história ou cena em favor do ícone fixo.',
  },
  {
    id: 'ind-8',
    index: 8,
    key: 'monocromatizacao',
    label: 'monocromatização',
    measures: 'Redução cromática; conversão em tom de pedra, bronze ou metal.',
  },
  {
    id: 'ind-9',
    index: 9,
    key: 'serialidade',
    label: 'serialidade',
    measures: 'Repetição padronizada em suportes massivos (moeda, selo, papel-moeda).',
  },
  {
    id: 'ind-10',
    index: 10,
    key: 'inscricao_estatal',
    label: 'inscrição_estatal',
    measures: 'Legenda, divisa ou insígnia normativa que ancora a figura ao Estado.',
  },
];

export const REGIME_DEFINITIONS = [
  {
    id: 'FUNDACIONAL',
    title: 'FUNDACIONAL',
    bodyType: 'Corpo vivo, sacrificial',
    logic: 'Instauração revolucionária e ruptura constituinte',
    visualMark: 'Gesto amplo, movimento, Pathosformel, barrete ou peito desnudo',
    bgHex: '#F9E0E0',
    borderHex: '#B5651D',
    textHex: '#6E3209',
  },
  {
    id: 'NORMATIVO',
    title: 'NORMATIVO',
    bodyType: 'Corpo domesticado',
    logic: 'Rotina burocrática e estabilização institucional do Estado',
    visualMark: 'Serenidade, simetria, atributos heráldicos, túnica composta',
    bgHex: '#F5F0D0',
    borderHex: '#9A8A2A',
    textHex: '#5C5214',
  },
  {
    id: 'MILITAR',
    title: 'MILITAR',
    bodyType: 'Corpo endurecido',
    logic: 'Imperial, bélico, soberania armada',
    visualMark: 'Rigidez extrema, armadura, elmo, espada em riste, monumentalidade',
    bgHex: '#D8D8E8',
    borderHex: '#444466',
    textHex: '#25253B',
  },
  {
    id: 'CONTRA-ALEGORIA',
    title: 'CONTRA-ALEGORIA',
    bodyType: 'Corpo contestado',
    logic: 'Subversão, reapropriação, iconoclasmo ou conflito de imagens',
    visualMark: 'Paródia, fissura, intervenção de rua, denúncia (#contra-alegoria)',
    bgHex: '#D8ECD8',
    borderHex: '#2A7A2A',
    textHex: '#184D18',
  },
] as const;

export const ICONOCRACY_NODES: ConstellationNodeItem[] = [
  // ===========================================================================
  // 1. CONCEITOS AUTORAIS (8)
  // ===========================================================================
  {
    id: 'contrato-sexual-visual',
    title: 'Contrato Sexual Visual',
    subtitle: 'Conceito Autoral #1 · Cap. 1',
    category: 'autoral',
    categoryLabel: 'Autoral · Conceito #1',
    chapterRef: 'Cap. 1',
    regime: 'NORMATIVO',
    corpusScope: 'aparato_conceitual',
    support: 'Moedas, selos, arquitetura forense, frontispícios',
    iconclassCodes: ['44', '11M44'],
    definition:
      'Extensão visual da tese de Carole Pateman: se o contrato social clássico oculta um contrato sexual que institui o direito político masculino sobre o corpo feminino, a alegoria feminina do Estado é o regime de imagem em que esse pacto se torna visível e se naturaliza. A mulher é representada para figurar a lei justamente quando dela é excluída como sujeito.',
    provenanceNote:
      'Pateman (1988) é a fonte do contrato não-visual. A passagem ao registro icônico-jurídico é estritamente autoral — não atribuir o "Contrato Sexual Visual" a Pateman.',
    thesisUsage:
      'Explica o paradoxo estrutural do regime iconocrático: hiper-visibilidade simbólica da alegoria feminina vs. exclusão civil e política de mulheres históricas concretas (reconhecimento sem reciprocidade).',
    senseProducedVsReceived:
      'Sentido produzido pelo dispositivo estatal: universalidade neutra da lei. Leitura crítica da tese: naturalização visual da exclusão feminina.',
    abntKeys: ['@pateman1988', '@pateman1993'],
    connections: [
      'purificacao-classica',
      'feminilidade-de-estado',
      'acoplamento-imagem-norma',
      'pateman-carole',
      'marianne-fr',
      'republica-br',
    ],
    archetype: 'scales_justitia',
    hardeningProfile: {
      desincorporacao: 2,
      rigidez_postural: 2,
      dessexualizacao: 3,
      uniformizacao_facial: 3,
      heraldicizacao: 2,
      enquadramento_arquitetonico: 2,
      apagamento_narrativo: 3,
      monocromatizacao: 2,
      serialidade: 3,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'feminilidade-de-estado',
    title: 'Feminilidade de Estado',
    subtitle: 'Conceito Autoral #2 · Cap. 2',
    category: 'autoral',
    categoryLabel: 'Autoral · Conceito #2',
    chapterRef: 'Cap. 2',
    regime: 'NORMATIVO',
    corpusScope: 'aparato_conceitual',
    support: 'Dispositivos estatais e paratextos normativos',
    iconclassCodes: ['44', '11M44'],
    definition:
      'Dispositivo pelo qual o Estado se faz representar por um corpo feminino idealizado (República, Justiça, Liberdade) — corpo investido de função totêmica e normativa, esvaziado de mulher histórica concreta. Articula a gestão jurídica da imagem (Legendre) com a economia do feminino como pólo de pureza/poluição (Anne Carson, hystéra).',
    provenanceNote:
      'Raízes genealógicas: Pierre Legendre (juiz totêmico, institution des images) + Anne Carson (hystéra). Regra não-negociável: NÃO atribuir a Marie-José Mondzain.',
    thesisUsage:
      'Define a moeda simbólica distribuída pelo regime iconocrático: reconhecimento sem reciprocidade política.',
    senseProducedVsReceived:
      'Sentido produzido: maternidade cívica e virtude incorruptível do Estado.',
    abntKeys: ['@legendre1994', '@legendre1974', '@carson1990'],
    connections: [
      'purificacao-classica',
      'acoplamento-imagem-norma',
      'legendre-pierre',
      'carson-anne',
      'pintura-de-alma',
      'justitia-transnacional',
    ],
    archetype: 'two_bodies_crown',
    hardeningProfile: {
      desincorporacao: 3,
      rigidez_postural: 2,
      dessexualizacao: 3,
      uniformizacao_facial: 3,
      heraldicizacao: 3,
      enquadramento_arquitetonico: 2,
      apagamento_narrativo: 2,
      monocromatizacao: 2,
      serialidade: 2,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'contrato-racial-visual',
    title: 'Contrato Racial Visual',
    subtitle: 'Conceito Autoral #3 · Cap. 3',
    category: 'autoral',
    categoryLabel: 'Autoral · Conceito #3',
    chapterRef: 'Cap. 3',
    regime: 'NORMATIVO',
    corpusScope: 'aparato_conceitual',
    country: 'Transatlântico (Europa → Américas / BR / US)',
    support: 'Monumentos, moedas, selos, pinturas republicanas',
    iconclassCodes: ['44'],
    definition:
      'A branquitude constitutiva da alegoria dita "universal": a figura feminina neoclássica que personifica o Estado pressupõe e produz um corpo branco greco-romano como norma do humano-jurídico. Inclui a transferência transatlântica de modelos neoclássicos (Europa → Américas) e fundamenta a leitura da colonialidade do ver.',
    provenanceNote:
      'Conceito original da tese (Cap. 3). Fundamenta a decisão de 2026-06-22 pela qual o país deixou de ser gate de inclusão para tornar-se variável analítica.',
    thesisUsage:
      'Analisa a recepção brasileira de 1889 e a transição norte-americana da "Princesa Índia" para a "Deusa Grega" Columbia/Liberty.',
    senseProducedVsReceived:
      'Sentido produzido: civilização universal e modernidade republicana pós-abolição (1888–1889 no Brasil).',
    abntKeys: ['@carvalho1990', '@limajunior2020', '@fleming1967'],
    connections: [
      'purificacao-classica',
      'republica-br',
      'columbia-us',
      'marianne-fr',
      'colonialidade-do-ver',
    ],
    archetype: 'pediment_forensic',
    hardeningProfile: {
      desincorporacao: 2,
      rigidez_postural: 2,
      dessexualizacao: 2,
      uniformizacao_facial: 3,
      heraldicizacao: 2,
      enquadramento_arquitetonico: 3,
      apagamento_narrativo: 3,
      monocromatizacao: 3,
      serialidade: 2,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'purificacao-classica',
    title: 'Purificação Clássica',
    subtitle: 'Conceito Autoral #4 · Cap. 5.2',
    category: 'autoral',
    categoryLabel: 'Autoral · Conceito #4',
    chapterRef: 'Cap. 5.2',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    support: 'Operação formal trans-suporte',
    iconclassCodes: ['44', '11M44'],
    definition:
      'Operação formal de extração do feminino histórico para fixá-lo no eterno alegórico: a mulher concreta é depurada de tempo, desejo e narrativa até virar emblema imóvel do Estado. É a operação que o endurecimento mede empiricamente.',
    provenanceNote:
      'Dupla matriz: Matriz primária (jurídica): Kantorowicz · Legendre · Hespanha. Extensão ferramental: Latour (1991) · Haraway (1985) · Descola (2021). No manuscrito final, usar SEMPRE "Purificação Clássica" (nunca "purificação iconocrática", e o termo "ciberfeminismo" é estritamente proibido).',
    thesisUsage:
      'Núcleo do mapa conceitual da tese: operacionaliza-se empiricamente nos 10 indicadores de endurecimento e desdobra-se em Contrato Sexual Visual, Feminilidade de Estado e Contrato Racial Visual.',
    abntKeys: [
      '@kantorowicz1957',
      '@legendre1994',
      '@hespanha2005',
      '@latour1991',
      '@haraway1985',
      '@descola2021',
    ],
    connections: [
      'endurecimento',
      'contrato-sexual-visual',
      'feminilidade-de-estado',
      'contrato-racial-visual',
      'kantorowicz-ernst',
      'legendre-pierre',
      'hespanha-antonio',
      'latour-bruno',
      'haraway-donna',
      'descola-philippe',
    ],
    archetype: 'two_bodies_crown',
    hardeningProfile: {
      desincorporacao: 3,
      rigidez_postural: 3,
      dessexualizacao: 3,
      uniformizacao_facial: 3,
      heraldicizacao: 3,
      enquadramento_arquitetonico: 3,
      apagamento_narrativo: 3,
      monocromatizacao: 3,
      serialidade: 2,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'endurecimento',
    title: 'Endurecimento',
    subtitle: 'Autoral / Operacional · Cap. 6–7',
    category: 'operacional',
    categoryLabel: 'Autoral / Operacional',
    chapterRef: 'Cap. 6–7',
    regime: 'MILITAR',
    corpusScope: 'aparato_conceitual',
    support: 'Moeda, selo, monumento, arquitetura forense',
    iconclassCodes: ['44', '11M44'],
    definition:
      'Operacionalização empírica da Purificação Clássica em 10 indicadores ordinais (0–3). Sempre em português — nunca "hardening" nem "embrutecimento". Mede o grau em que uma alegoria foi depurada do feminino vivo e fixada como emblema estatal.',
    provenanceNote:
      'Decisão metodológica de 2026-09-24: o campo endurecimento_score foi removido definitivamente. A codificação vigente é o inventário verbal de atributos sobre os 10 indicadores — nunca somado, operando sob paradigma indiciário (Morelli–Ginzburg).',
    thesisUsage:
      'Permite rastrear a passagem do regime FUNDACIONAL ao NORMATIVO e ao MILITAR sem recair em psicometria ou análise fatorial.',
    abntKeys: ['@warburg2000', '@kantorowicz1957'],
    connections: [
      'purificacao-classica',
      'regime-iconocratico',
      'germania-de',
      'britannia-uk',
      'denkraum-warburg',
    ],
    archetype: 'monument_niederwald',
    hardeningProfile: {
      desincorporacao: 3,
      rigidez_postural: 3,
      dessexualizacao: 3,
      uniformizacao_facial: 3,
      heraldicizacao: 3,
      enquadramento_arquitetonico: 3,
      apagamento_narrativo: 3,
      monocromatizacao: 3,
      serialidade: 3,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'regime-iconocratico',
    title: 'Regime Iconocrático',
    subtitle: 'Conceito Autoral · Cap. 2',
    category: 'autoral',
    categoryLabel: 'Autoral · Tipologia',
    chapterRef: 'Cap. 2',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      'Configuração histórica do acoplamento entre imagem alegórica e norma estatal. A tese identifica três regimes em progressão — FUNDACIONAL (sacrificial, corpo vivo) → NORMATIVO (domesticado, burocrático) → MILITAR (endurecido, imperial) — e um momento de ruptura, a CONTRA-ALEGORIA (corpo contestado).',
    provenanceNote:
      'Tipologia analítica construída por leitura densa de casos exemplares (DEC-2026-07-29-APARATO-MINIMO), não agrupamento emergente de clusterização estatística.',
    thesisUsage:
      'Organiza a leitura comparativa diacrônica e transnacional do corpus core (1800–2000).',
    abntKeys: ['@mondzain2002', '@agulhon1979', '@agulhon1989'],
    connections: [
      'iconocracia-mondzain',
      'endurecimento',
      'acoplamento-imagem-norma',
      'contra-alegoria',
      'marianne-fr',
      'germania-de',
    ],
    archetype: 'atlas_panel',
  },
  {
    id: 'acoplamento-imagem-norma',
    title: 'Acoplamento imagem-norma',
    subtitle: 'Conceito Autoral · Cap. 5 (#acoplamento-imagem-norma)',
    category: 'autoral',
    categoryLabel: 'Autoral · Cap. 5',
    chapterRef: 'Cap. 5',
    regime: 'NORMATIVO',
    corpusScope: 'aparato_conceitual',
    support: 'Moeda, papel-moeda, selo fiscal, frontispício de código',
    iconclassCodes: ['44', '11M44'],
    definition:
      'Mecanismo pelo qual uma imagem (alegoria feminina) e uma norma (jurídico-política) se prendem uma à outra em suportes oficiais, de modo que ver a figura é reconhecer a autoridade da lei.',
    provenanceNote:
      'Conceito autoral da tese (tag de vault: #acoplamento-imagem-norma), articulado ao Contrato Sexual Visual e à Feminilidade de Estado.',
    thesisUsage:
      'Explica por que a alegoria em moedas, selos e frontispícios normativos não é mero ornamento ilustrativo, mas dispositivo de produção de soberania e curso forçado.',
    abntKeys: ['@legendre1994', '@goodrich2013a', '@hespanha2005'],
    connections: [
      'contrato-sexual-visual',
      'feminilidade-de-estado',
      'pintura-de-alma',
      'visiocracia-goodrich',
    ],
    archetype: 'stamp_republic',
    hardeningProfile: {
      desincorporacao: 2,
      rigidez_postural: 2,
      dessexualizacao: 2,
      uniformizacao_facial: 3,
      heraldicizacao: 3,
      enquadramento_arquitetonico: 2,
      apagamento_narrativo: 3,
      monocromatizacao: 2,
      serialidade: 3,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'pintura-de-alma',
    title: 'Pintura de alma',
    subtitle: 'Conceito Autoral · Cap. 1',
    category: 'autoral',
    categoryLabel: 'Autoral · Síntese',
    chapterRef: 'Cap. 1',
    regime: 'FUNDACIONAL',
    corpusScope: 'aparato_conceitual',
    definition:
      'A imagem que não apenas representa mas institui o sujeito jurídico — a face do poder que "pinta" interiormente o governado, fabricando obediência e adesão afetiva pela via estética.',
    provenanceNote:
      'Síntese autoral a partir de Pierre Legendre (institution des images) + Peter Goodrich (visiocracia) + Marie-José Mondzain (economia icônica).',
    thesisUsage:
      'Distingue a eficácia institucional do dispositivo estatal da mera recepção subjetiva individual.',
    abntKeys: ['@legendre1994', '@goodrich2013a', '@mondzain2002'],
    connections: [
      'feminilidade-de-estado',
      'iconocracia-mondzain',
      'visiocracia-goodrich',
      'legendre-pierre',
    ],
    archetype: 'atlas_panel',
  },

  // ===========================================================================
  // 2. CONCEITOS MOBILIZADOS & MÉTODO DA CONSTELAÇÃO
  // ===========================================================================
  {
    id: 'iconocracia-mondzain',
    title: 'Iconocracia',
    subtitle: 'Conceito Mobilizado (Mondzain 2002 + Tese) · Cap. 2',
    category: 'mobilizado',
    categoryLabel: 'Mobilizado · Mondzain',
    chapterRef: 'Cap. 2',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      'Governo pela imagem: regime de poder em que a autoridade soberana se exerce pela produção, distribuição e gestão de ícones visíveis. A tese desloca o termo de Marie-José Mondzain (economia icônica bizantina) para o campo jurídico-penal e constitucional moderno (séculos XIX–XX).',
    provenanceNote:
      'Mondzain (2002) é a fonte de "iconocracia" e "economia icônica", mas NÃO de "Feminilidade de Estado" (que provém de Legendre + Carson).',
    thesisUsage:
      'Conceito-título da tese: designa o governo do visível que distribui feminilidade de Estado como reconhecimento simbólico sem reciprocidade política.',
    abntKeys: ['@mondzain2002'],
    connections: [
      'regime-iconocratico',
      'pintura-de-alma',
      'visiocracia-goodrich',
      'feminilidade-de-estado',
    ],
    archetype: 'two_bodies_crown',
  },
  {
    id: 'visiocracia-goodrich',
    title: 'Visiocracia',
    subtitle: 'Conceito Mobilizado (Goodrich, 2013) · Cap. 1',
    category: 'mobilizado',
    categoryLabel: 'Mobilizado · Goodrich',
    chapterRef: 'Cap. 1',
    regime: 'NORMATIVO',
    corpusScope: 'aparato_conceitual',
    verificarFlag:
      'Corrigido em 2026-09-22 de 2014 para 2013 (Critical Inquiry, v. 39, @goodrich2013a); confirmar fascículo/páginas na fonte.',
    definition:
      'Poder exercido pelo visual na cultura jurídica; a dimensão estética, emblemática e retórica do direito na tradição ocidental.',
    provenanceNote:
      'Peter Goodrich, "Visiocracy: on the futures of the fingerpost", Critical Inquiry, v. 39, 2013 (@goodrich2013a).',
    thesisUsage:
      'Articula a cultura visual jurídica aos paratextos normativos, frontispícios e arquitetura forense.',
    abntKeys: ['@goodrich2013a'],
    connections: ['iconocracia-mondzain', 'pintura-de-alma', 'acoplamento-imagem-norma'],
    archetype: 'pediment_forensic',
  },
  {
    id: 'constelacao-benjamin-weigel',
    title: 'Constelação (Idee als Konfiguration)',
    subtitle: 'Método de Entrada Principal do Acervo · Benjamin & Weigel',
    category: 'operacional',
    categoryLabel: 'Operacional · Benjamin & Weigel',
    chapterRef: 'Introdução & Cap. 8',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      'Modo principal de apresentação e navegação relacional do acervo: no prefácio epistemológico de Ursprung des deutschen Trauerspiels, Walter Benjamin aproxima ideias e coisas da relação entre constelações e estrelas — a configuração preserva diferenças e singularidades sem reduzi-las a leis gerais. Sigrid Weigel (Body- and Image-Space, 1996/2005, pp. viii–ix, 58, 92–93) descreve a imagem benjaminiana como constelação heterogênea e meio do próprio trabalho teórico.',
    provenanceNote:
      'Orientação autoral de 4 de outubro de 2026 (constellation-method.md). Precisão de atribuição para revisão futura: na p. 58 de Weigel (1996/2005), o referente de "its imaginative concepts" é a cultura ocidental nomeada no parágrafo, e não exclusivamente os conceitos de Benjamin.',
    thesisUsage:
      'Fundamenta a entrada /acervo pelo campo de imagens (Constelação primeiro; Palco e Grade como inspeção/consulta), onde posição, tamanho e moldura seguem regra determinística ligada ao ID e não representam hierarquia científica.',
    abntKeys: ['@warburg2000'],
    connections: [
      'zwischenraum-warburg',
      'mnemosyne-bilderatlas',
      'denkraum-warburg',
      'regime-iconocratico',
    ],
    archetype: 'atlas_panel',
  },

  // ===========================================================================
  // 3. LÉXICO WARBURGUIANO (5)
  // ===========================================================================
  {
    id: 'pathosformel-warburg',
    title: 'Pathosformel',
    subtitle: 'Léxico Warburguiano (em alemão no manuscrito)',
    category: 'warburg',
    categoryLabel: 'Mobilizado · Warburg',
    chapterRef: 'Cap. 2 & Cap. 8',
    regime: 'FUNDACIONAL',
    corpusScope: 'aparato_conceitual',
    definition:
      '"Fórmula de pathos": entrelaçamento indissociável de carga emocional extrema e fórmula iconográfica (drapejado em movimento, gesto sacrificial), transmitido através de épocas e culturas.',
    provenanceNote:
      'Aby Warburg. Permanece em alemão no manuscrito conforme convenção terminológica da tese.',
    thesisUsage:
      'Identifica o gesto-matriz do corpo alegórico vivo e sacrificial no regime FUNDACIONAL (ex.: Marianne de 1789/1830/1848) antes de sua imobilização pelo endurecimento.',
    abntKeys: ['@warburg2000', '@agulhon1979'],
    connections: ['nachleben-warburg', 'marianne-fr', 'regime-iconocratico', 'endurecimento'],
    archetype: 'coin_marianne',
    hardeningProfile: {
      desincorporacao: 0,
      rigidez_postural: 0,
      dessexualizacao: 1,
      uniformizacao_facial: 1,
      heraldicizacao: 1,
      enquadramento_arquitetonico: 0,
      apagamento_narrativo: 0,
      monocromatizacao: 1,
      serialidade: 1,
      inscricao_estatal: 1,
    },
  },
  {
    id: 'nachleben-warburg',
    title: 'Nachleben (der Antike)',
    subtitle: 'Léxico Warburguiano · Sobrevivência da Antiguidade',
    category: 'warburg',
    categoryLabel: 'Mobilizado · Warburg',
    chapterRef: 'Cap. 3 & Cap. 5',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      '"Sobrevivência / pós-vida da Antiguidade": persistência espectral, retorno e metamorfose de formas greco-romanas antigas em contextos jurídicos modernos.',
    provenanceNote:
      'Aby Warburg. Permanece em alemão no manuscrito.',
    thesisUsage:
      'Fundamenta a leitura genealógica da alegoria neoclássica (Themis, Dike, Iustitia augusta, Minerva, Britannia romana) nos tribunais e moedas dos séculos XIX–XX.',
    abntKeys: ['@warburg2000', '@resnikcurtis2011'],
    connections: [
      'pathosformel-warburg',
      'justitia-transnacional',
      'britannia-uk',
      'contrato-racial-visual',
    ],
    archetype: 'scales_justitia',
  },
  {
    id: 'zwischenraum-warburg',
    title: 'Zwischenraum',
    subtitle: 'Léxico Warburguiano · Espaço-entre (Cap. 8)',
    category: 'warburg',
    categoryLabel: 'Mobilizado · Warburg',
    chapterRef: 'Cap. 8',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      '"Espaço-entre": intervalo produtivo onde o sentido histórico e analítico se constitui pela justaposição entre imagens distintas sem reduzi-las a filiação linear.',
    provenanceNote:
      'Aby Warburg (Der Bilderatlas Mnemosyne). Base operacional dos painéis comparativos (zwischenraum_panels) do Cap. 8.',
    thesisUsage:
      'Sustenta a montagem autoral do acervo: cada aproximação parte de uma pergunta da pesquisa e documenta suporte material e função jurídico-política.',
    abntKeys: ['@warburg2000'],
    connections: [
      'constelacao-benjamin-weigel',
      'mnemosyne-bilderatlas',
      'denkraum-warburg',
    ],
    archetype: 'atlas_panel',
  },
  {
    id: 'denkraum-warburg',
    title: 'Denkraum',
    subtitle: 'Léxico Warburguiano · Espaço de pensamento',
    category: 'warburg',
    categoryLabel: 'Mobilizado · Warburg',
    chapterRef: 'Cap. 6–8',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      '"Espaço de pensamento / contemplação": distância reflexiva e crítica conquistada perante a força mítica ou totêmica da imagem.',
    provenanceNote:
      'Aby Warburg. Permanece em alemão no manuscrito.',
    thesisUsage:
      'Identifica a distância crítica que é progressivamente suprimida quando o endurecimento estatal converte a alegoria em insígnia automática de obediência.',
    abntKeys: ['@warburg2000', '@legendre1994'],
    connections: ['endurecimento', 'zwischenraum-warburg', 'pintura-de-alma'],
    archetype: 'atlas_panel',
  },
  {
    id: 'mnemosyne-bilderatlas',
    title: 'Mnemosyne / Bilderatlas',
    subtitle: 'Léxico Warburguiano · 63 Pranchas (1924–1929)',
    category: 'warburg',
    categoryLabel: 'Mobilizado · Warburg',
    chapterRef: 'Cap. 8',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    verificarFlag: 'Cotejar dados exatos da edição crítica de Martin Warnke (Akademie Verlag, 2000) no Zotero/references.bib (#verificar).',
    definition:
      'Atlas de imagens inacabado de Aby Warburg (1924–1929; 63 pranchas de reproduções fotográficas pregadas em painéis revestidos de tecido negro), operando por montagem de constelações visuais trans-históricas.',
    provenanceNote:
      'WARBURG, Aby. Der Bilderatlas Mnemosyne. Ed. Martin Warnke. Berlin: Akademie Verlag, 2000 [orig. 1924–1929] (@warburg2000).',
    thesisUsage:
      'Modelo formal e arquitetônico do método comparativo da tese e do Atlas Iconocracia.',
    abntKeys: ['@warburg2000', '@panofsky1939'],
    connections: ['zwischenraum-warburg', 'constelacao-benjamin-weigel', 'panofsky-iconologia'],
    archetype: 'atlas_panel',
  },

  // ===========================================================================
  // 4. APARATO OPERACIONAL ADICIONAL (Iconclass, Panofsky, Contra-alegoria)
  // ===========================================================================
  {
    id: 'panofsky-iconologia',
    title: 'Níveis de Panofsky (Iconografia / Iconologia)',
    subtitle: 'Aparato Operacional · Studies in Iconology (1939)',
    category: 'operacional',
    categoryLabel: 'Operacional · Panofsky',
    chapterRef: 'Cap. 4',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      'Distinção metodológica em três camadas: Nível I (Pré-iconográfico: assunto primário/natural, formas puras e gestos); Nível II (Iconográfico: assunto secundário/convencional, identificação de temas, motivos e atributos como balança, espada, venda, barrete frígio); Nível III (Iconológico: significado intrínseco, sintoma cultural e ideológico profundo do regime iconocrático).',
    provenanceNote:
      'Erwin Panofsky, Studies in Iconology (Oxford UP, 1939, @panofsky1939).',
    thesisUsage:
      'Estrutura a ficha catalográfica e a leitura densa dos casos exemplares do corpus core.',
    abntKeys: ['@panofsky1939', '@warburg2000'],
    connections: ['iconclass-sistema', 'mnemosyne-bilderatlas', 'justitia-transnacional'],
    archetype: 'scales_justitia',
  },
  {
    id: 'iconclass-sistema',
    title: 'Iconclass (44 · 11M44 · Alerta 48C51)',
    subtitle: 'Aparato Operacional · Henri van de Waal (1973–1985)',
    category: 'operacional',
    categoryLabel: 'Operacional · Iconclass',
    chapterRef: 'Cap. 4',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    iconclassCodes: ['44', '11M44', '48C51'],
    definition:
      'Sistema decimal de classificação iconográfica concebido por Henri van de Waal. Códigos verificados na API oficial iconclass.org (2026-06-26): 44 ("state; law; political life" — ramo jurídico-político central do corpus) e 11M44 ("Justice, Justitia; Giustitia divina (Ripa) ~ one of the Four Cardinal Virtues").',
    provenanceNote:
      'AVISO CRÍTICO DE AUDITORIA: O CLAUDE.md registrava "Iconclass 48C51 = código-chave para iconografia feminista", mas a API oficial iconclass.org rotula 48C51 como "painting (including book-illumination, miniature-painting)" (forma de arte pintura). Os códigos efetivamente pertinentes ao recorte jurídico são 44 e 11M44.',
    thesisUsage:
      'Indexação padronizada e rastreável das obras do corpus core no repositório GitHub iconocracy-corpus.',
    abntKeys: ['@vandewaal1973', '@panofsky1939'],
    connections: ['panofsky-iconologia', 'justitia-transnacional', 'criterios-inclusao-corpus'],
    archetype: 'stamp_republic',
  },
  {
    id: 'criterios-inclusao-corpus',
    title: 'Critérios de Inclusão no Corpus Core (1800–2000)',
    subtitle: 'Aparato Operacional · Catálogo Documentado',
    category: 'operacional',
    categoryLabel: 'Operacional · Escopo Core',
    chapterRef: 'Cap. 4',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    period: '1800–2000 (prioridade 1880–1920)',
    support: 'Moeda · Selo · Monumento/Escultura · Arquitetura forense · Estampa/Gravura · Frontispício · Papel-moeda · Cartaz',
    definition:
      'Quatro critérios cumulativos obrigatórios: (1) Figura alegórica feminina; (2) Função jurídico-política explícita; (3) Datável em 1800–2000 (prioridade 1880–1920); (4) Suporte aceito. Material fora deste escopo vai para "comparador/apêndice" e não entra nas contagens do corpus core.',
    provenanceNote:
      'O corpus core é CATÁLOGO DOCUMENTADO, não amostra estatística probabilística (DEC-2026-07-29-APARATO-MINIMO). Desde 2026-06-22, o país deixou de ser gate de inclusão e opera como variável analítica.',
    thesisUsage:
      'Garante auditabilidade, rastreabilidade de acervo e declaração explícita dos silêncios do corpus (distinguindo ausência substantiva de ausência de coleta).',
    abntKeys: ['@hespanha2005', '@resnikcurtis2011'],
    connections: ['iconclass-sistema', 'contrato-racial-visual', 'contra-alegoria'],
    archetype: 'pediment_forensic',
  },
  {
    id: 'contra-alegoria',
    title: 'Contra-Alegoria & Iconoclasmo Tropical',
    subtitle: 'Ruptura do Regime Iconocrático (#contra-alegoria)',
    category: 'operacional',
    categoryLabel: 'Operacional · Ruptura',
    chapterRef: 'Cap. 7–8',
    regime: 'CONTRA-ALEGORIA',
    corpusScope: 'core',
    country: 'BR / Transnacional',
    period: 'Séculos XIX–XX',
    support: 'Cartaz, estampa satírica, intervenção em monumento',
    iconclassCodes: ['44', '11M44'],
    definition:
      'Momento de ruptura, subversão ou reapropriação crítica em que o corpo alegórico estatal é contestado por paródia gráfica, conflito de imagens, vandalização ou denúncia da exclusão política real.',
    provenanceNote:
      'Articula a tipologia de recusas sob paradigma indiciário e a hipótese de iconocracia/iconoclasmo tropical no Brasil pós-colonial.',
    thesisUsage:
      'Expõe a fratura entre o sentido normativo produzido pelo Estado e a contestação gráfica ou material da alegoria.',
    abntKeys: ['@carvalho1990', '@limajunior2020', '@resnikcurtis2011'],
    connections: ['regime-iconocratico', 'republica-br', 'endurecimento'],
    archetype: 'broken_column_contra',
    hardeningProfile: {
      desincorporacao: 0,
      rigidez_postural: 0,
      dessexualizacao: 0,
      uniformizacao_facial: 1,
      heraldicizacao: 0,
      enquadramento_arquitetonico: 0,
      apagamento_narrativo: 0,
      monocromatizacao: 1,
      serialidade: 1,
      inscricao_estatal: 1,
    },
  },
  {
    id: 'colonialidade-do-ver',
    title: 'Colonialidade do ver & Ausência alegórica',
    subtitle: 'Termos Transversais (#colonialidade-do-ver · #ausencia-alegorica)',
    category: 'operacional',
    categoryLabel: 'Operacional · Transversal',
    chapterRef: 'Cap. 3 & Cap. 6',
    regime: 'NORMATIVO',
    corpusScope: 'aparato_conceitual',
    definition:
      'Colonialidade do ver (#colonialidade-do-ver): regime visual que naturaliza a branquitude neoclássica da alegoria dita "universal" nos espaços pós-coloniais. Ausência alegórica (#ausencia-alegorica): controle negativo documentando contextos constitucionais ou forenses onde a alegoria feminina esperada está substantivamente ausente.',
    provenanceNote:
      'Cumpre a exigência intransigível de declarar os silêncios do corpus como parte do objeto, distinguindo ausência substantiva de ausência de coleta.',
    thesisUsage:
      'Previne o anacronismo e a comparação forçada entre metrópoles europeias e o Brasil pós-colonial.',
    abntKeys: ['@carvalho1990', '@limajunior2020', '@hespanha2005'],
    connections: ['contrato-racial-visual', 'republica-br', 'criterios-inclusao-corpus'],
    archetype: 'pediment_forensic',
  },

  // ===========================================================================
  // 5. ALEGORIAS FEMININAS NACIONAIS (7 MATRIZES EMPÍRICAS DO CORPUS CORE)
  // ===========================================================================
  {
    id: 'marianne-fr',
    title: 'Marianne / La République, La Liberté, La Justice (FR)',
    subtitle: 'Alegoria Nacional · França (1789–1914)',
    category: 'alegoria',
    categoryLabel: 'Alegoria · França (FR)',
    chapterRef: 'Cap. 2 & Cap. 6',
    regime: 'FUNDACIONAL',
    corpusScope: 'core',
    country: 'FR',
    period: '1789–1914 (Longo Século XIX)',
    support: 'Moeda (Semeuse / Cérès), selo postal, busto de mairie, monumento',
    iconclassCodes: ['44', '11M44'],
    definition:
      'Figura feminina como personificação da República Francesa, central à imagética revolucionária e republicana com auge no "longo século XIX". Oscila historicamente entre a Marianne combatente de barrete frígio (regime FUNDACIONAL, corpo vivo e sacrificial) e a República sentada, serena e escolarizada da III República (regime NORMATIVO).',
    provenanceNote:
      'Obra canônica de referência: Maurice Agulhon, Marianne au combat (1789–1880, @agulhon1979) e Marianne au pouvoir (1880–1914, @agulhon1989).',
    thesisUsage:
      'Caso matriz da transição FUNDACIONAL → NORMATIVO e modelo de exportação transatlântica para a República brasileira de 1889.',
    senseProducedVsReceived:
      'Sentido produzido pelo Estado: soberania popular indivisível e laicidade republicana sob código civil napoleônico que negava cidadania ativa às mulheres francesas.',
    abntKeys: ['@agulhon1979', '@agulhon1989', '@pateman1988'],
    connections: [
      'regime-iconocratico',
      'pathosformel-warburg',
      'republica-br',
      'la-belgique-be',
      'contrato-sexual-visual',
    ],
    archetype: 'coin_marianne',
    hardeningProfile: {
      desincorporacao: 1,
      rigidez_postural: 1,
      dessexualizacao: 1,
      uniformizacao_facial: 2,
      heraldicizacao: 2,
      enquadramento_arquitetonico: 1,
      apagamento_narrativo: 1,
      monocromatizacao: 2,
      serialidade: 3,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'britannia-uk',
    title: 'Britannia, Justice, Hibernia, Scotia (UK)',
    subtitle: 'Alegoria Nacional · Reino Unido (Séc. XIX–XX)',
    category: 'alegoria',
    categoryLabel: 'Alegoria · Reino Unido (UK)',
    chapterRef: 'Cap. 3 & Cap. 6',
    regime: 'MILITAR',
    corpusScope: 'core',
    country: 'UK',
    period: '1800–1950 (Era Vitoriana e Imperial)',
    support: 'Moeda (Penny / Trade Dollar), selo imperial, estampa (Punch / Tenniel), monumento',
    iconclassCodes: ['44', '11M44'],
    definition:
      'De origem provincial romana (século II d.C.), revivida no século XVI e consolidada nos séculos XIX–XX: personifica simultaneamente a justiça, a liberdade parlamentar e o Império Britânico em moedas e selos, com elmo coríntio, tridente marítimo e escudo heráldico da Union Jack (pose de deusa greco-romana fixada por John Tenniel).',
    provenanceNote:
      'Fonte-chave do Glossário: @millat2003.',
    thesisUsage:
      'Exemplifica a fusão entre norma constitucional e soberania imperial marítima (endurecimento alto em heraldicização e serialidade numismática).',
    abntKeys: ['@warner1985', '@resnikcurtis2011'],
    connections: ['endurecimento', 'nachleben-warburg', 'germania-de', 'columbia-us'],
    archetype: 'coin_marianne',
    hardeningProfile: {
      desincorporacao: 2,
      rigidez_postural: 3,
      dessexualizacao: 3,
      uniformizacao_facial: 3,
      heraldicizacao: 3,
      enquadramento_arquitetonico: 2,
      apagamento_narrativo: 2,
      monocromatizacao: 3,
      serialidade: 3,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'germania-de',
    title: 'Germania, Justitia, Minerva — Monumento de Niederwald (DE)',
    subtitle: 'Alegoria Nacional · Alemanha (1840–1883)',
    category: 'alegoria',
    categoryLabel: 'Alegoria · Alemanha (DE)',
    chapterRef: 'Cap. 6–7',
    regime: 'MILITAR',
    corpusScope: 'core',
    country: 'DE',
    period: '1840–1918 (Ápice: Niederwald, Johannes Schilling, 1883)',
    support: 'Monumento colossal em bronze, moeda imperial, selo Germania',
    iconclassCodes: ['44'],
    definition:
      'Instrumentalizada desde a crise do Reno (1840) e o Parlamento de Frankfurt (1848) até a fundação do Segundo Império Alemão (1871), atingindo o ápice do regime MILITAR no Monumento de Niederwald (Johannes Schilling, 1883): alegoria totêmica, encouraçada e bélica empunhando a coroa imperial e a espada Reichsschwert.',
    provenanceNote:
      'Fontes-chave do Glossário: @mazon2000 · @gallindo2023.',
    thesisUsage:
      'Caso paradigmático de endurecimento máximo (regime MILITAR): petrificação monumental, couraça, submissão arquitetônica e inscrição estatal imperial.',
    abntKeys: ['@warburg2000'],
    connections: ['endurecimento', 'regime-iconocratico', 'britannia-uk', 'purificacao-classica'],
    archetype: 'monument_niederwald',
    hardeningProfile: {
      desincorporacao: 3,
      rigidez_postural: 3,
      dessexualizacao: 3,
      uniformizacao_facial: 3,
      heraldicizacao: 3,
      enquadramento_arquitetonico: 3,
      apagamento_narrativo: 3,
      monocromatizacao: 3,
      serialidade: 3,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'columbia-us',
    title: 'Columbia, Lady Liberty, Lady Justice, America (US)',
    subtitle: 'Alegoria Nacional · Estados Unidos (1783–1920)',
    category: 'alegoria',
    categoryLabel: 'Alegoria · Estados Unidos (US)',
    chapterRef: 'Cap. 3 & Cap. 6',
    regime: 'NORMATIVO',
    corpusScope: 'core',
    country: 'US',
    period: '1783–1920',
    support: 'Moeda (Liberty Dollar), frontão de tribunal, monumento, cartaz',
    iconclassCodes: ['44', '11M44'],
    definition:
      'Trajetória iconográfica da "Princesa Índia" colonial à "Deusa Grega" neoclássica (Liberty / Minerva / Columbia) na fundação e consolidação republicana norte-americana. Demonstra a depuração racial e formal operada pela Purificação Clássica.',
    provenanceNote:
      'Fonte-chave do Glossário: E. McClung Fleming (@fleming1967) e Judith Resnik & Dennis Curtis (@resnikcurtis2011).',
    thesisUsage:
      'Evidência central do Contrato Racial Visual nas Américas: substituição da alegoria indígena pela branquitude neoclássica greco-romana.',
    abntKeys: ['@resnikcurtis2011'],
    connections: [
      'contrato-racial-visual',
      'republica-br',
      'justitia-transnacional',
      'purificacao-classica',
    ],
    archetype: 'pediment_forensic',
    hardeningProfile: {
      desincorporacao: 2,
      rigidez_postural: 2,
      dessexualizacao: 3,
      uniformizacao_facial: 3,
      heraldicizacao: 2,
      enquadramento_arquitetonico: 3,
      apagamento_narrativo: 2,
      monocromatizacao: 3,
      serialidade: 3,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'la-belgique-be',
    title: 'La Belgique (BE)',
    subtitle: 'Alegoria Nacional · Bélgica (Belle Époque)',
    category: 'alegoria',
    categoryLabel: 'Alegoria · Bélgica (BE)',
    chapterRef: 'Cap. 6',
    regime: 'NORMATIVO',
    corpusScope: 'core',
    country: 'BE',
    period: '1830–1914 (Belle Époque)',
    support: 'Monumento cívico, medalha, selo e arquitetura forense (Palais de Justice de Bruxelas)',
    iconclassCodes: ['44'],
    definition:
      'Emergência de uma "Marianne" belga na Belle Époque, encarnando a auto-imagem nacional constitucional e progressista da monarquia parlamentar industrializada, em contraste com a exclusão jurídica do trabalho feminino.',
    provenanceNote:
      'Fonte-chave do Glossário: Patricia Penn Hilden (@hilden1993). Nota: AT (Allegorie der Austria, Krasa-Florian 2007), NL, DK e ES também integram o corpus core.',
    thesisUsage:
      'Caso comparativo europeu de domesticação constitucional e monumentalidade forense oitocentista.',
    abntKeys: ['@agulhon1989'],
    connections: ['marianne-fr', 'contrato-sexual-visual', 'criterios-inclusao-corpus'],
    archetype: 'pediment_forensic',
    hardeningProfile: {
      desincorporacao: 2,
      rigidez_postural: 2,
      dessexualizacao: 2,
      uniformizacao_facial: 3,
      heraldicizacao: 3,
      enquadramento_arquitetonico: 3,
      apagamento_narrativo: 2,
      monocromatizacao: 2,
      serialidade: 2,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'republica-br',
    title: 'A República & A Justiça no Brasil Pós-Colonial (BR)',
    subtitle: 'Alegoria Nacional · Brasil (1889–2000)',
    category: 'alegoria',
    categoryLabel: 'Alegoria · Brasil (BR)',
    chapterRef: 'Cap. 3, Cap. 6 & Cap. 7',
    regime: 'NORMATIVO',
    corpusScope: 'core',
    country: 'BR',
    period: '1889–2000 (Prioridade Primeira República 1889–1930)',
    support: 'Moeda de Réis/Cruzeiro, selo postal, estampa (Décio Villares / Angelo Agostini), STF',
    iconclassCodes: ['44', '11M44'],
    definition:
      'Recepção transatlântica do modelo neoclássico francês (Marianne positivista e liberal) no embate de imaginários da Proclamação da República (1889), logo após a abolição formal da escravidão (1888). Instala um corpo feminino branco e classicizado como efígie da soberania nacional e da Justiça.',
    provenanceNote:
      'Fontes-chave: José Murilo de Carvalho, A Formação das Almas (1990, @carvalho1990) e Carlos Lima Junior (2020, @limajunior2020).',
    thesisUsage:
      'Foco central da tese: demonstra como o Contrato Sexual Visual e o Contrato Racial Visual se entrelaçam no Brasil pós-colonial, bem como os conflitos de imagem na imprensa ilustrada (Contra-Alegoria).',
    senseProducedVsReceived:
      'Sentido produzido pelo novo regime republicano: ordem, progresso e filiação civilizatória europeia; sentido disputado: apatia popular ("bestializados") e sátira gráfica à República.',
    abntKeys: ['@carvalho1990', '@limajunior2020', '@agulhon1989'],
    connections: [
      'contrato-racial-visual',
      'contrato-sexual-visual',
      'marianne-fr',
      'contra-alegoria',
      'colonialidade-do-ver',
      'justitia-transnacional',
    ],
    archetype: 'coin_marianne',
    hardeningProfile: {
      desincorporacao: 2,
      rigidez_postural: 2,
      dessexualizacao: 3,
      uniformizacao_facial: 3,
      heraldicizacao: 3,
      enquadramento_arquitetonico: 2,
      apagamento_narrativo: 3,
      monocromatizacao: 2,
      serialidade: 3,
      inscricao_estatal: 3,
    },
  },
  {
    id: 'justitia-transnacional',
    title: 'Justitia / Lady Justice (Balança · Espada · Venda)',
    subtitle: 'Alegoria Transnacional · Genealogia de Iustitia aos Tribunais Modernos',
    category: 'alegoria',
    categoryLabel: 'Alegoria · Justitia (11M44)',
    chapterRef: 'Cap. 1, Cap. 4 & Cap. 6',
    regime: 'NORMATIVO',
    corpusScope: 'core',
    country: 'Transnacional (EU / US / BR)',
    period: '1800–2000 (Genealogia: Antiguidade → Modernidade)',
    support: 'Arquitetura forense, frontispícios normativos, selos judiciais, estatuária de tribunais',
    iconclassCodes: ['11M44', '44'],
    definition:
      'De Iustitia romana (sob Augusto) com genealogia em Shamash, Maat, Dike e Themis → virtude cardeal medieval/renascentista (Ripa) → ícone autônomo da jurisdição estatal moderna. Seus três atributos canônicos — balança (ponderação), espada (coerção soberana) e venda (imparcialidade moderna, ambivalente em sua origem renascentista) — sintetizam o acoplamento imagem-norma.',
    provenanceNote:
      'Referência central do recorte jurídico-iconográfico: Judith Resnik & Dennis Curtis, Representing Justice (Yale UP, 2011, @resnikcurtis2011).',
    thesisUsage:
      'Eixo transversal de comparação entre arquitetura forense, paratextos normativos e estatuária judicial (ex.: Alfredo Ceschiatti em Brasília vs. tribunais oitocentistas).',
    abntKeys: ['@resnikcurtis2011', '@vandewaal1973', '@panofsky1939'],
    connections: [
      'feminilidade-de-estado',
      'contrato-sexual-visual',
      'iconclass-sistema',
      'nachleben-warburg',
      'republica-br',
    ],
    archetype: 'scales_justitia',
    hardeningProfile: {
      desincorporacao: 3,
      rigidez_postural: 3,
      dessexualizacao: 3,
      uniformizacao_facial: 3,
      heraldicizacao: 3,
      enquadramento_arquitetonico: 3,
      apagamento_narrativo: 3,
      monocromatizacao: 3,
      serialidade: 2,
      inscricao_estatal: 3,
    },
  },

  // ===========================================================================
  // 6. INTERLOCUTORES TEÓRICOS DA MATRIZ CONVOCADA (9 NÓS PRINCIPAIS)
  // ===========================================================================
  {
    id: 'kantorowicz-ernst',
    title: 'Ernst H. Kantorowicz — Os Dois Corpos do Rei (1957)',
    subtitle: 'Interlocutor Teórico · Matriz Jurídica Primária',
    category: 'interlocutor',
    categoryLabel: 'Interlocutor · Matriz Jurídica',
    chapterRef: 'Cap. 2 & Cap. 5',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      'Teologia política medieval dos dois corpos do rei (body natural mortal, sujeito a paixões e decrepitude × body politic perpétuo e imortal). Na tese, fornece a matriz jurídica primária da Purificação Clássica: o corpo alegórico feminino opera como "corpo político" perpétuo justamente porque o "corpo natural" das mulheres históricas foi interditado da soberania.',
    provenanceNote:
      'KANTOROWICZ, Ernst H. The King\'s Two Bodies: a study in mediaeval political theology. Princeton: Princeton UP, 1957 (@kantorowicz1957; trad. PT 1998, @kantorowicz1998).',
    thesisUsage:
      'Sustenta a passagem da efígie real dinástica para a personificação feminina republicana e constitucional.',
    abntKeys: ['@kantorowicz1957', '@kantorowicz1998'],
    connections: ['purificacao-classica', 'feminilidade-de-estado', 'legendre-pierre'],
    archetype: 'two_bodies_crown',
  },
  {
    id: 'legendre-pierre',
    title: 'Pierre Legendre — Institution des Images & Juiz Totêmico',
    subtitle: 'Interlocutor Teórico · Matriz Jurídica Primária (1974 / 1994)',
    category: 'interlocutor',
    categoryLabel: 'Interlocutor · Matriz Jurídica',
    chapterRef: 'Cap. 1, Cap. 2 & Cap. 5',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    verificarFlag: 'Cotejar edições e volume exato da Ars Dogmatica no Zotero/references.bib (@legendre1974 / @legendre1994).',
    definition:
      'Antropologia dogmática da instituição das imagens (Dieu au miroir, 1994) e da submissão amorosa à lei (L\'Amour du censeur, 1974). O Estado moderno governa montando um espelho totêmico em que o súdito/cidadão se reconhece.',
    provenanceNote:
      'LEGENDRE, Pierre. Dieu au miroir: étude sur l\'institution des images. Paris: Fayard, 1994 (@legendre1994); L\'Amour du censeur. Paris: Seuil, 1974 (@legendre1974).',
    thesisUsage:
      'Raiz genealógica direta (junto a Anne Carson) do conceito autoral de Feminilidade de Estado e de Pintura de alma.',
    abntKeys: ['@legendre1994', '@legendre1974'],
    connections: ['feminilidade-de-estado', 'purificacao-classica', 'pintura-de-alma'],
    archetype: 'two_bodies_crown',
  },
  {
    id: 'hespanha-antonio',
    title: 'António Manuel Hespanha — Cultura Jurídica Europeia (2005)',
    subtitle: 'Interlocutor Teórico · Disciplina contra o Anacronismo',
    category: 'interlocutor',
    categoryLabel: 'Interlocutor · História do Direito',
    chapterRef: 'Cap. 1 & Cap. 4',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    verificarFlag: 'Confirmar dados editoriais da edição Almedina 2005 com Zotero (@hespanha2005).',
    definition:
      'Ampliação do conceito de cultura jurídica para além da legislação estatal escrita, abrangendo imaginários, dispositivos visuais, práticas forenses e paratextos normativos, sob rigorosa disciplina contra o anacronismo (respeito à lógica interna da fonte histórica).',
    provenanceNote:
      'HESPANHA, António Manuel. Cultura Jurídica Europeia: síntese de um milénio. Coimbra: Almedina, 2005 (@hespanha2005).',
    thesisUsage:
      'Enquadramento histórico-jurídico do corpus e exigência metodológica intransigível contra o presentismo.',
    abntKeys: ['@hespanha2005'],
    connections: ['purificacao-classica', 'criterios-inclusao-corpus', 'acoplamento-imagem-norma'],
    archetype: 'pediment_forensic',
  },
  {
    id: 'pateman-carole',
    title: 'Carole Pateman — The Sexual Contract (1988)',
    subtitle: 'Interlocutora Teórica · Raiz do Contrato Sexual Visual',
    category: 'interlocutor',
    categoryLabel: 'Interlocutora · Teoria Feminista',
    chapterRef: 'Cap. 1',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      'Demonstra que o contrato social moderno (Locke, Rousseau, Kant) pressupõe um contrato sexual prévio que institui o direito patriarcal fraterno dos cidadãos sobre as mulheres, dividindo a esfera pública civil da esfera privada.',
    provenanceNote:
      'PATEMAN, Carole. The Sexual Contract. Stanford: Stanford UP, 1988 (@pateman1988; trad. PT 1993, @pateman1993). Pateman formula o contrato não-visual; o Contrato Sexual Visual é conceito autoral #1 da tese.',
    thesisUsage:
      'Ponto de partida para demonstrar como a exclusão contratual das mulheres é compensada e encoberta pela sua hiper-presença alegórica nos emblemas de Estado.',
    abntKeys: ['@pateman1988', '@pateman1993'],
    connections: ['contrato-sexual-visual', 'marianne-fr', 'republica-br'],
    archetype: 'scales_justitia',
  },
  {
    id: 'carson-anne',
    title: 'Anne Carson — Hystéra: Mulher, Poluição e Pureza (1990)',
    subtitle: 'Interlocutora Teórica · Raiz da Feminilidade de Estado',
    category: 'interlocutor',
    categoryLabel: 'Interlocutora · Antiguidade & Gênero',
    chapterRef: 'Cap. 2',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    verificarFlag: 'Metadados reconciliados em 2026-10-06 (@carson1990, p. 135–170); passagem exata da hystéra pendente de conferência final.',
    definition:
      'Análise da economia antiga do corpo feminino (Putting Her in Her Place: Woman, Dirt, and Desire, 1990) como fronteira porosa, úmida e poluente que exige contenção ritual e cívica.',
    provenanceNote:
      'CARSON, Anne. Putting Her in Her Place: Woman, Dirt, and Desire. In: Before Sexuality. Princeton UP, 1990. p. 135–170 (@carson1990).',
    thesisUsage:
      'Explica por que o corpo feminino precisa sofrer Purificação Clássica (petrificação, vedação, dessexualização) antes de poder encarnar a pureza incorruptível da Lei.',
    abntKeys: ['@carson1990'],
    connections: ['feminilidade-de-estado', 'purificacao-classica', 'endurecimento'],
    archetype: 'two_bodies_crown',
  },
  {
    id: 'latour-bruno',
    title: 'Bruno Latour — Purificação e Tradução (1991)',
    subtitle: 'Interlocutor Teórico · Extensão Ferramental da Purificação Clássica',
    category: 'interlocutor',
    categoryLabel: 'Interlocutor · Matriz Ferramental',
    chapterRef: 'Cap. 5.2',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      'Em Nous n\'avons jamais été modernes (1991), a Constituição moderna opera por um duplo movimento: a "purificação" (que separa zonas ontológicas estanques) e a "tradução/mediação" (que multiplica híbridos nos bastidores).',
    provenanceNote:
      'LATOUR, Bruno. Nous n\'avons jamais été modernes. Paris: La Découverte, 1991 (@latour1991; trad. PT 1994, @latour1994). Entra como extensão ferramental da Purificação Clássica (cuja matriz primária é jurídica).',
    thesisUsage:
      'Modela o mecanismo pelo qual o direito moderno purifica a alegoria feminina em símbolo eterno enquanto prolifera híbridos imagem-norma.',
    abntKeys: ['@latour1991', '@latour1994'],
    connections: ['purificacao-classica', 'haraway-donna', 'descola-philippe'],
    archetype: 'atlas_panel',
  },
  {
    id: 'haraway-donna',
    title: 'Donna Haraway — Crítica das Fronteiras Natureza/Cultura (1985)',
    subtitle: 'Interlocutora Teórica · Extensão Ferramental (Sem termo proibido)',
    category: 'interlocutor',
    categoryLabel: 'Interlocutora · Matriz Ferramental',
    chapterRef: 'Cap. 5.2',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    definition:
      'Crítica dos dualismos fundacionais da tradição ocidental (natureza/cultura, organismo/artefato, corpo/lei) em A Manifesto for Cyborgs (1985).',
    provenanceNote:
      'HARAWAY, Donna. Socialist Review, n. 80, 1985 (@haraway1985; trad. PT 2009, @haraway2009). REGRA DA TESE: entra estritamente como extensão ferramental da Purificação Clássica; o termo "ciberfeminismo" é PROIBIDO no texto da tese.',
    thesisUsage:
      'Desnaturaliza a oposição entre mulher biológica/natural (excluída) e artefato alegórico estatal (sacralizado).',
    abntKeys: ['@haraway1985', '@haraway2009'],
    connections: ['purificacao-classica', 'latour-bruno', 'descola-philippe'],
    archetype: 'atlas_panel',
  },
  {
    id: 'descola-philippe',
    title: 'Philippe Descola — Les Formes du visible (2021)',
    subtitle: 'Interlocutor Teórico · Antropologia da Figuração',
    category: 'interlocutor',
    categoryLabel: 'Interlocutor · Matriz Ferramental',
    chapterRef: 'Cap. 5.2',
    regime: 'TRANSVERSAL',
    corpusScope: 'aparato_conceitual',
    verificarFlag: 'Confirmar detalhes da edição PT (As Formas do Visível, Ubu, 2023, @descola2023) no Zotero.',
    definition:
      'Antropologia comparada da figuração (Les Formes du visible, 2021): toda imagem opera como agente ontológico que torna visíveis relações estruturais entre interioridades e fisicalidades.',
    provenanceNote:
      'DESCOLA, Philippe. Les Formes du visible: une anthropologie de la figuration. Paris: Seuil, 2021 (@descola2021; trad. PT Ubu, 2023, @descola2023).',
    thesisUsage:
      'Extensão ferramental para analisar o modo naturalista de figuração neoclássica adotado pelos Estados modernos.',
    abntKeys: ['@descola2021', '@descola2023'],
    connections: ['purificacao-classica', 'latour-bruno', 'haraway-donna'],
    archetype: 'atlas_panel',
  },
];

export const ABNT_REFERENCES: AbntReference[] = [
  {
    key: '@agulhon1979',
    citation:
      "AGULHON, Maurice. Marianne au combat: l'imagerie et la symbolique républicaines de 1789 à 1880. Paris: Flammarion, 1979.",
    category: 'alegoria_nacional',
  },
  {
    key: '@agulhon1989',
    citation:
      "AGULHON, Maurice. Marianne au pouvoir: l'imagerie et la symbolique républicaines de 1880 à 1914. Paris: Flammarion, 1989.",
    category: 'alegoria_nacional',
  },
  {
    key: '@carson1990',
    citation:
      'CARSON, Anne. Putting Her in Her Place: Woman, Dirt, and Desire. In: HALPERIN, David M.; WINKLER, John J.; ZEITLIN, Froma I. (org.). Before Sexuality: The Construction of Erotic Experience in the Ancient Greek World. Princeton: Princeton University Press, 1990. p. 135–170.',
    statusNote:
      'Metadados reconciliados em 2026-10-06; passagem exata da hystéra pendente de conferência final (Cap. 2). A versão Dirt and Desire (2000, @carson2000) permanece reelaboração distinta.',
    category: 'primaria_teorica',
  },
  {
    key: '@carvalho1990',
    citation:
      'CARVALHO, José Murilo de. A formação das almas: o imaginário da República no Brasil. São Paulo: Companhia das Letras, 1990.',
    category: 'alegoria_nacional',
  },
  {
    key: '@descola2021',
    citation:
      'DESCOLA, Philippe. Les Formes du visible: une anthropologie de la figuration. Paris: Seuil, 2021.',
    translationNote: 'Trad. PT: As Formas do Visível. São Paulo: Ubu, 2023 (@descola2023).',
    statusNote: '#verificar edição PT com Zotero.',
    category: 'primaria_teorica',
  },
  {
    key: '@goodrich2013a',
    citation:
      'GOODRICH, Peter. Visiocracy: on the futures of the fingerpost. Critical Inquiry, v. 39, 2013.',
    statusNote: 'Corrigido em 2026-09-22 (verbete anterior dizia 2014). #verificar páginas exatas na fonte.',
    category: 'primaria_teorica',
  },
  {
    key: '@haraway1985',
    citation:
      'HARAWAY, Donna. A manifesto for cyborgs: science, technology, and socialist feminism in the 1980s. Socialist Review, n. 80, 1985.',
    translationNote:
      'Trad. PT: Manifesto ciborgue. In: SILVA, T. T. (org.). Antropologia do Ciborgue. Belo Horizonte: Autêntica, 2009 (@haraway2009).',
    category: 'primaria_teorica',
  },
  {
    key: '@hespanha2005',
    citation:
      'HESPANHA, António Manuel. Cultura Jurídica Europeia: síntese de um milénio. Coimbra: Almedina, 2005.',
    statusNote: '#verificar edição/ano com Zotero.',
    category: 'primaria_teorica',
  },
  {
    key: '@kantorowicz1957',
    citation:
      "KANTOROWICZ, Ernst H. The King's Two Bodies: a study in mediaeval political theology. Princeton: Princeton University Press, 1957.",
    translationNote: 'Trad. PT: Os Dois Corpos do Rei. São Paulo: Companhia das Letras, 1998 (@kantorowicz1998).',
    category: 'primaria_teorica',
  },
  {
    key: '@latour1991',
    citation:
      "LATOUR, Bruno. Nous n'avons jamais été modernes: essai d'anthropologie symétrique. Paris: La Découverte, 1991.",
    translationNote: 'Trad. PT: Jamais Fomos Modernos. Rio de Janeiro: Editora 34, 1994 (@latour1994).',
    category: 'primaria_teorica',
  },
  {
    key: '@legendre1994',
    citation:
      "LEGENDRE, Pierre. Dieu au miroir: étude sur l'institution des images. Paris: Fayard, 1994 [ver tb. L'Amour du censeur: essai sur l'ordre dogmatique. Paris: Seuil, 1974 (@legendre1974)].",
    statusNote: '⏳ Cotejar edições e volume da Ars Dogmatica com Zotero.',
    category: 'primaria_teorica',
  },
  {
    key: '@mondzain2002',
    citation:
      "MONDZAIN, Marie-José. Image, icône, économie: les sources byzantines de l'imaginaire contemporain. Paris: Seuil, 2002.",
    statusNote: '#verificar editora/edição PT com Zotero.',
    category: 'primaria_teorica',
  },
  {
    key: '@panofsky1939',
    citation:
      'PANOFSKY, Erwin. Studies in Iconology: humanistic themes in the art of the Renaissance. New York: Oxford University Press, 1939.',
    category: 'primaria_teorica',
  },
  {
    key: '@pateman1988',
    citation:
      'PATEMAN, Carole. The Sexual Contract. Stanford: Stanford University Press, 1988.',
    translationNote: 'Trad. PT: O contrato sexual. Rio de Janeiro: Paz e Terra, 1993 (@pateman1993).',
    category: 'primaria_teorica',
  },
  {
    key: '@resnikcurtis2011',
    citation:
      'RESNIK, Judith; CURTIS, Dennis. Representing Justice: invention, controversy, and rights in city-states and democratic courtrooms. New Haven: Yale University Press, 2011.',
    statusNote: '✅ Resolvida no references.bib.',
    category: 'alegoria_nacional',
  },
  {
    key: '@vandewaal1973',
    citation:
      'VAN DE WAAL, Henri. Iconclass: an iconographic classification system. Amsterdam: North-Holland, 1973 [17 v., 1973–1985].',
    statusNote: '✅ Confirmados rótulos 44, 11M44 e 48C51 na API JSON oficial iconclass.org (2026-06-26).',
    category: 'metodo_constelacao',
  },
  {
    key: '@warburg2000',
    citation:
      'WARBURG, Aby. Der Bilderatlas Mnemosyne. Ed. Martin Warnke. Berlin: Akademie Verlag, 2000 [orig. 1924–1929].',
    statusNote: '#verificar edição crítica do Atlas com Zotero.',
    category: 'metodo_constelacao',
  },
  {
    key: '@weigel1996',
    citation:
      'WEIGEL, Sigrid. Body- and Image-Space: Re-Reading Walter Benjamin. London; New York: Routledge, 1996 [ed. eletrônica Taylor & Francis, 2005, pp. viii–ix, 58, 92–93].',
    statusNote:
      '✅ Cotejado em constellation-method.md: na p. 58, o referente de "its imaginative concepts" é a cultura ocidental nomeada no parágrafo, e não exclusivamente os conceitos de Benjamin.',
    category: 'metodo_constelacao',
  },
];

export interface CuratedPathway {
  id: string;
  title: string;
  researchQuestion: string;
  description: string;
  nodeIds: string[];
}

export const CURATED_PATHWAYS: CuratedPathway[] = [
  {
    id: 'percurso-quatro-autorais',
    title: 'I. Os Quatro Conceitos Autorais & Purificação Clássica',
    researchQuestion:
      'Como a operação formal da Purificação Clássica articula Contrato Sexual Visual, Feminilidade de Estado e Contrato Racial Visual sem ceder autoria às matrizes convocadas?',
    description:
      'Percurso nuclear da tese: demonstra como a mulher histórica é depurada de tempo e desejo até tornar-se corpo totêmico da lei.',
    nodeIds: [
      'purificacao-classica',
      'contrato-sexual-visual',
      'feminilidade-de-estado',
      'contrato-racial-visual',
      'endurecimento',
    ],
  },
  {
    id: 'percurso-transatlantico-1889',
    title: 'II. Transferência Transatlântica & Brasil Pós-Colonial (1889)',
    researchQuestion:
      'De que modo a recepção da Marianne francesa na Proclamação da República brasileira (1889) opera uma branquitude normativa logo após a abolição (1888) e gera contra-alegorias?',
    description:
      'Montagem comparativa entre França (Marianne), EUA (Columbia), Brasil (A República / A Justiça) e o iconoclasmo tropical.',
    nodeIds: [
      'marianne-fr',
      'republica-br',
      'columbia-us',
      'contrato-racial-visual',
      'contra-alegoria',
    ],
  },
  {
    id: 'percurso-regimes-endurecimento',
    title: 'III. Progressão dos Regimes: Do Pathos Fundacional ao Endurecimento Militar',
    researchQuestion:
      'Como os 10 indicadores ordinais de endurecimento (0–3, sem soma) registram a perda de Pathosformel e Denkraum entre a Marianne revolucionária, a Britannia imperial e a Germania de Niederwald (1883)?',
    description:
      'Leitura indiciária da petrificação progressiva do corpo alegórico estatal.',
    nodeIds: [
      'pathosformel-warburg',
      'marianne-fr',
      'britannia-uk',
      'germania-de',
      'endurecimento',
    ],
  },
  {
    id: 'percurso-benjamin-warburg',
    title: 'IV. Constelação Benjamin-Weigel & Atlas Mnemosyne',
    researchQuestion:
      'Por que a constelação heterogênea (Benjamin/Weigel) e o Zwischenraum (Warburg) preservam a singularidade indiciária dos objetos jurídicos sem reduzi-los a amostragem estatística?',
    description:
      'Fundamentação epistemológica da interface /acervo e da auditoria crítica do código Iconclass 44 / 11M44 vs. 48C51.',
    nodeIds: [
      'constelacao-benjamin-weigel',
      'zwischenraum-warburg',
      'mnemosyne-bilderatlas',
      'iconclass-sistema',
      'criterios-inclusao-corpus',
    ],
  },
];

/**
 * Deterministic 3D position derived solely from the stable ID of the item,
 * fulfilling constellation-method.md:
 * "O campo atual distribui as imagens por uma regra estável ligada ao ID da obra...
 * Posição, tamanho e moldura não representam relevância científica, aprovação ou intensidade de uma relação."
 */
export function getDeterministicPositionFromId(id: string, index: number, total: number): [number, number, number] {
  let hash1 = 2166136261;
  let hash2 = 16777619;
  for (let i = 0; i < id.length; i++) {
    const ch = id.charCodeAt(i);
    hash1 ^= ch;
    hash1 = Math.imul(hash1, 16777619);
    hash2 ^= ch * (i + 1);
    hash2 = Math.imul(hash2, 2166136261);
  }
  const u = ((hash1 >>> 0) % 10000) / 10000;
  const v = ((hash2 >>> 0) % 10000) / 10000;

  // Golden-angle spherical/elliptical distribution seeded by index + deterministic ID offset
  const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * index + u * 0.85;
  const radius = 11.5 + (v - 0.5) * 4.5;

  const x = radius * Math.sin(phi) * Math.cos(theta) * 1.35;
  const y = radius * Math.cos(phi) * 0.72;
  const z = radius * Math.sin(phi) * Math.sin(theta) * 1.1;

  return [Number(x.toFixed(3)), Number(y.toFixed(3)), Number(z.toFixed(3))];
}

/**
 * Generates a zero-404 SVG data URL with a 19th-century copperplate engraving aesthetic
 * tailored to any node or highlighted text selection.
 */
export function generateArchivalEngravingSvg(title: string, subtitle = 'ICONOCRACIA · CORPUS 1800–2000', archetype: ProceduralArchetype = 'scales_justitia'): string {
  const safeTitle = title.replace(/[<>&"']/g, '').slice(0, 38).toUpperCase();
  const safeSub = subtitle.replace(/[<>&"']/g, '').slice(0, 48).toUpperCase();

  let centerpiece = '';
  if (archetype === 'scales_justitia') {
    centerpiece = `
      <line x1="200" y1="75" x2="200" y2="285" stroke="#1C1917" stroke-width="3"/>
      <polygon points="192,75 208,75 200,52" fill="#1C1917"/>
      <line x1="115" y1="125" x2="285" y2="125" stroke="#1C1917" stroke-width="2.5"/>
      <line x1="115" y1="125" x2="95" y2="195" stroke="#1C1917" stroke-width="1.2"/>
      <line x1="115" y1="125" x2="135" y2="195" stroke="#1C1917" stroke-width="1.2"/>
      <path d="M 88 195 Q 115 222 142 195 Z" fill="none" stroke="#1C1917" stroke-width="2"/>
      <line x1="285" y1="125" x2="265" y2="195" stroke="#1C1917" stroke-width="1.2"/>
      <line x1="285" y1="125" x2="305" y2="195" stroke="#1C1917" stroke-width="1.2"/>
      <path d="M 258 195 Q 285 222 312 195 Z" fill="none" stroke="#1C1917" stroke-width="2"/>
      <circle cx="200" cy="125" r="12" fill="#F5F1E8" stroke="#9A3412" stroke-width="2"/>
    `;
  } else if (archetype === 'coin_marianne') {
    centerpiece = `
      <circle cx="200" cy="175" r="88" fill="none" stroke="#1C1917" stroke-width="2.5"/>
      <circle cx="200" cy="175" r="78" fill="none" stroke="#1C1917" stroke-width="1" stroke-dasharray="3,3"/>
      <path d="M 165 225 C 165 170, 175 120, 212 118 C 235 118, 242 145, 232 165 C 225 182, 235 205, 225 225 Z" fill="none" stroke="#9A3412" stroke-width="2.2"/>
      <path d="M 172 150 Q 202 105 228 138" fill="none" stroke="#1C1917" stroke-width="2"/>
    `;
  } else if (archetype === 'monument_niederwald') {
    centerpiece = `
      <rect x="145" y="220" width="110" height="65" fill="none" stroke="#1C1917" stroke-width="2.2"/>
      <rect x="160" y="185" width="80" height="35" fill="none" stroke="#1C1917" stroke-width="2"/>
      <path d="M 180 185 L 185 105 L 215 105 L 220 185 Z" fill="none" stroke="#1C1917" stroke-width="2"/>
      <line x1="226" y1="68" x2="226" y2="175" stroke="#9A3412" stroke-width="2.5"/>
      <circle cx="195" cy="88" r="14" fill="none" stroke="#9A3412" stroke-width="2"/>
    `;
  } else if (archetype === 'pediment_forensic') {
    centerpiece = `
      <polygon points="95,140 200,78 305,140" fill="none" stroke="#1C1917" stroke-width="2.5"/>
      <polygon points="112,135 200,86 288,135" fill="none" stroke="#9A3412" stroke-width="1.2"/>
      <rect x="115" y="148" width="18" height="120" fill="none" stroke="#1C1917" stroke-width="1.8"/>
      <rect x="165" y="148" width="18" height="120" fill="none" stroke="#1C1917" stroke-width="1.8"/>
      <rect x="217" y="148" width="18" height="120" fill="none" stroke="#1C1917" stroke-width="1.8"/>
      <rect x="267" y="148" width="18" height="120" fill="none" stroke="#1C1917" stroke-width="1.8"/>
      <line x1="88" y1="268" x2="312" y2="268" stroke="#1C1917" stroke-width="3"/>
    `;
  } else {
    centerpiece = `
      <rect x="105" y="88" width="85" height="115" fill="none" stroke="#1C1917" stroke-width="1.8"/>
      <rect x="210" y="88" width="85" height="115" fill="none" stroke="#1C1917" stroke-width="1.8"/>
      <line x1="147" y1="145" x2="252" y2="145" stroke="#9A3412" stroke-width="2" stroke-dasharray="4,3"/>
      <circle cx="147" cy="145" r="18" fill="none" stroke="#1C1917" stroke-width="1.5"/>
      <circle cx="252" cy="145" r="18" fill="none" stroke="#1C1917" stroke-width="1.5"/>
      <rect x="140" y="220" width="120" height="55" fill="none" stroke="#1C1917" stroke-width="1.6"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360" width="400" height="360">
    <rect width="400" height="360" fill="#F5F1E8"/>
    <g opacity="0.16" stroke="#78716C" stroke-width="0.6">
      <line x1="0" y1="40" x2="400" y2="40"/><line x1="0" y1="80" x2="400" y2="80"/>
      <line x1="0" y1="120" x2="400" y2="120"/><line x1="0" y1="160" x2="400" y2="160"/>
      <line x1="0" y1="200" x2="400" y2="200"/><line x1="0" y1="240" x2="400" y2="240"/>
      <line x1="0" y1="280" x2="400" y2="280"/><line x1="0" y1="320" x2="400" y2="320"/>
    </g>
    <rect x="16" y="16" width="368" height="328" fill="none" stroke="#1C1917" stroke-width="2"/>
    <rect x="22" y="22" width="356" height="316" fill="none" stroke="#1C1917" stroke-width="0.8"/>
    <text x="200" y="42" text-anchor="middle" font-family="Georgia, serif" font-size="9" letter-spacing="2.5" fill="#57534E">${safeSub}</text>
    ${centerpiece}
    <line x1="48" y1="302" x2="352" y2="302" stroke="#1C1917" stroke-width="0.8"/>
    <text x="200" y="322" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="11" letter-spacing="1.8" fill="#1C1917">${safeTitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
