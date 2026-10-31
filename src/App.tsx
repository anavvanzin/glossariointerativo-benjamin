import React, { useEffect, useMemo, useState } from 'react';
import {
  ABNT_REFERENCES,
  CURATED_PATHWAYS,
  ConstellationNodeItem,
  EpistemicCategory,
  HARDENING_INDICATORS,
  ICONOCRACY_NODES,
  IconocraticRegime,
  REGIME_DEFINITIONS,
} from './data/iconocracyData';
import {
  AcervoViewMode,
  ConstellationViewport3D,
} from './components/ConstellationViewport3D';
import { FichaDrawerModal } from './components/FichaDrawerModal';
import { ZwischenraumMontageModal } from './components/ZwischenraumMontageModal';
import { SelectionPeekTooltip } from './components/SelectionPeekTooltip';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Compass,
  ExternalLink,
  Eye,
  FileText,
  Layers,
  Scale,
  Search,
  Sparkles,
} from 'lucide-react';

type MainSectionTab =
  | 'acervo'
  | 'glossario'
  | 'regimes'
  | 'metodo'
  | 'referencias';

export default function App() {
  // Parse initial URL parameters per constellation-method.md ("Links diretos continuam utilizáveis e modos explicitamente escolhidos na URL são respeitados")
  const initialParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  const [activeTab, setActiveTab] = useState<MainSectionTab>(() => {
    const t = initialParams.get('tab') as MainSectionTab;
    return ['acervo', 'glossario', 'regimes', 'metodo', 'referencias'].includes(
      t
    )
      ? t
      : 'acervo';
  });

  const [viewMode, setViewMode] = useState<AcervoViewMode>(() => {
    const m = initialParams.get('mode') as AcervoViewMode;
    return ['constelacao', 'palco', 'grade'].includes(m) ? m : 'constelacao';
  });

  const [selectedNode, setSelectedNode] =
    useState<ConstellationNodeItem | null>(() => {
      const id = initialParams.get('item');
      if (id) {
        return ICONOCRACY_NODES.find((n) => n.id === id) || null;
      }
      return null;
    });

  const [activeCategory, setActiveCategory] = useState<
    EpistemicCategory | 'todos'
  >('todos');
  const [activeRegime, setActiveRegime] = useState<
    IconocraticRegime | 'todos'
  >('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Montage state (Zwischenraum Panel)
  const [montageIds, setMontageIds] = useState<string[]>([
    'purificacao-classica',
    'contrato-sexual-visual',
    'republica-br',
  ]);
  const [isMontageOpen, setIsMontageOpen] = useState(false);

  // Compare hardening profiles selector in Regimes tab
  const [compareAllegoryIds, setCompareAllegoryIds] = useState<string[]>([
    'pathosformel-warburg',
    'marianne-fr',
    'republica-br',
    'germania-de',
  ]);

  // Synchronize URL search params without page reload
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== 'acervo') params.set('tab', activeTab);
    if (viewMode !== 'constelacao') params.set('mode', viewMode);
    if (selectedNode) params.set('item', selectedNode.id);

    const qs = params.toString();
    const nextUrl = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname;
    window.history.replaceState(null, '', nextUrl);
  }, [activeTab, viewMode, selectedNode]);

  // Keyboard Escape closes open Ficha and returns focus to the field
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMontageOpen) setIsMontageOpen(false);
        else if (selectedNode) setSelectedNode(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMontageOpen, selectedNode]);

  const filteredNodes = useMemo(() => {
    return ICONOCRACY_NODES.filter((n) => {
      if (activeCategory !== 'todos' && n.category !== activeCategory) {
        return false;
      }
      if (activeRegime !== 'todos' && n.regime !== activeRegime) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${n.title} ${n.subtitle || ''} ${n.definition} ${
          n.provenanceNote
        } ${n.abntKeys.join(' ')} ${n.country || ''}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [activeCategory, activeRegime, searchQuery]);

  const handleToggleMontageItem = (id: string) => {
    setMontageIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openNodeById = (id: string) => {
    const found = ICONOCRACY_NODES.find((n) => n.id === id);
    if (found) {
      setSelectedNode(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* =====================================================================
          STRICT 3-ZONE TOP BAR CONTRACT (frontend-design Section 2)
          Zone 1: Single text wordmark | Zone 2: 5 single-line nav links | Zone 3: 1 primary CTA
      ====================================================================== */}
      <header className="sticky top-0 z-30 h-[65px] flex items-center justify-between gap-8 px-6 bg-[#141210] text-[#FBF9F5] border-b border-[#292524]">
        {/* Zone 1: Brand Wordmark (single text element) */}
        <a
          href="#acervo"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('acervo');
            setViewMode('constelacao');
          }}
          className="font-display text-2xl font-semibold tracking-tight text-[#FBF9F5] whitespace-nowrap shrink-0"
        >
          Iconocracia
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
          <button
            onClick={() => setActiveTab('acervo')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
              activeTab === 'acervo'
                ? 'text-white border-[#9A3412]'
                : 'text-[#A8A29E] border-transparent hover:text-white'
            }`}
          >
            Constelação (/acervo)
          </button>
          <button
            onClick={() => setActiveTab('glossario')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
              activeTab === 'glossario'
                ? 'text-white border-[#9A3412]'
                : 'text-[#A8A29E] border-transparent hover:text-white'
            }`}
          >
            Glossário Canônico
          </button>
          <button
            onClick={() => setActiveTab('regimes')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
              activeTab === 'regimes'
                ? 'text-white border-[#9A3412]'
                : 'text-[#A8A29E] border-transparent hover:text-white'
            }`}
          >
            Regimes & Endurecimento
          </button>
          <button
            onClick={() => setActiveTab('metodo')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
              activeTab === 'metodo'
                ? 'text-white border-[#9A3412]'
                : 'text-[#A8A29E] border-transparent hover:text-white'
            }`}
          >
            Método Benjamin-Weigel
          </button>
          <button
            onClick={() => setActiveTab('referencias')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
              activeTab === 'referencias'
                ? 'text-white border-[#9A3412]'
                : 'text-[#A8A29E] border-transparent hover:text-white'
            }`}
          >
            Referências ABNT
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMontageOpen(true)}
            className="px-4 py-2 text-xs font-mono bg-[#9A3412] text-[#FBF9F5] hover:bg-[#7C2D12] transition-colors whitespace-nowrap shrink-0"
          >
            Montagem Zwischenraum ({montageIds.length})
          </button>
        </div>
      </header>

      {/* Mobile Secondary Navigation Strip */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto px-4 py-2 bg-[#1C1917] text-[#D6CEBE] border-b border-[#292524] text-xs font-mono">
        {(
          [
            ['acervo', 'Constelação'],
            ['glossario', 'Glossário'],
            ['regimes', 'Regimes & 10 Ind.'],
            ['metodo', 'Método Benjamin'],
            ['referencias', 'ABNT'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-2.5 py-1 whitespace-nowrap shrink-0 ${
              activeTab === key ? 'bg-[#9A3412] text-white' : 'text-[#A8A29E]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* =====================================================================
          MAIN WORKSPACE CONTENT
      ====================================================================== */}
      <main className="flex-1 relative">
        {/* TAB 1: /ACERVO — CONSTELAÇÃO 3D, PALCO E GRADE */}
        {activeTab === 'acervo' && (
          <ConstellationViewport3D
            nodes={filteredNodes}
            selectedNode={selectedNode}
            onSelectNode={(node) => setSelectedNode(node)}
            viewMode={viewMode}
            onChangeViewMode={(m) => setViewMode(m)}
            activeCategory={activeCategory}
            onChangeCategory={(c) => setActiveCategory(c)}
            activeRegime={activeRegime}
            onChangeRegime={(r) => setActiveRegime(r)}
            searchQuery={searchQuery}
            onChangeSearch={(q) => setSearchQuery(q)}
            montageIds={montageIds}
            onToggleMontageItem={handleToggleMontageItem}
          />
        )}

        {/* TAB 2: GLOSSÁRIO CANÔNICO COMPLETO (Glossario_9ed50eeb.md) */}
        {activeTab === 'glossario' && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 space-y-14 select-text">
            {/* Editorial Marquee Header */}
            <div className="border-b border-[#D6CEBE] pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-xs font-mono uppercase tracking-widest text-[#9A3412]">
                  Tese de Doutorado · Ana Vanzin · Atualizado em 2026-06-26 (ABNT NBR 6023:2025)
                </p>
                <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1C1917] mt-2 leading-tight">
                  Glossário: Iconocracia & Alegoria Feminina na História da Cultura Jurídica (Séculos XIX–XX)
                </h1>
                <p className="font-serif text-base text-[#292524] leading-relaxed mt-4">
                  Verbete = <strong>termo</strong> · <strong>categoria</strong> (estatuto epistêmico) ·{' '}
                  <strong>definição</strong> · <strong>proveniência/autoria</strong> ·{' '}
                  <strong>uso na tese</strong>. Selecione qualquer palavra ou frase em qualquer verbete abaixo para gerar instantaneamente uma nota iconológica e gravura contextual.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                <button
                  onClick={() => {
                    setActiveTab('acervo');
                    setViewMode('constelacao');
                  }}
                  className="px-4 py-2.5 bg-[#1C1917] text-[#FBF9F5] text-xs font-mono uppercase tracking-wider hover:bg-[#292524] flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-[#9A8A2A]" />
                  Explorar na Constelação 3D
                </button>
                <button
                  onClick={() => setIsMontageOpen(true)}
                  className="px-4 py-2 border border-[#1C1917] text-[#1C1917] text-xs font-mono hover:bg-[#F3EFE6] whitespace-nowrap"
                >
                  Abrir Prancha Zwischenraum ({montageIds.length})
                </button>
              </div>
            </div>

            {/* Epistemic Categories Legend & Non-Negotiable Authorship Callout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 bg-[#F3EFE6] border border-[#D6CEBE] p-6">
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#57534E] mb-4">
                  Legenda das Categorias (Estatuto Epistêmico)
                </h2>
                <div className="divide-y divide-[#E5DEC9] text-sm">
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <span className="font-mono font-semibold text-[#1C1917] whitespace-nowrap">
                      🔹 Autoral
                    </span>
                    <span className="font-serif text-[#292524] text-right">
                      Conceito original da tese. Não deve ser atribuído a terceiros, ainda que dialogue com eles.
                    </span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <span className="font-mono font-semibold text-[#1C1917] whitespace-nowrap">
                      🔸 Mobilizado
                    </span>
                    <span className="font-serif text-[#292524] text-right">
                      Termo de outro autor, deslocado para o recorte jurídico-iconográfico da tese.
                    </span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <span className="font-mono font-semibold text-[#1C1917] whitespace-nowrap">
                      ⚙️ Operacional
                    </span>
                    <span className="font-serif text-[#292524] text-right">
                      Instrumento metodológico de codificação/análise indiciária do corpus.
                    </span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <span className="font-mono font-semibold text-[#1C1917] whitespace-nowrap">
                      🏛️ Alegoria
                    </span>
                    <span className="font-serif text-[#292524] text-right">
                      Figura alegórica feminina nacional (objeto empírico do corpus core 1800–2000).
                    </span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <span className="font-mono font-semibold text-[#1C1917] whitespace-nowrap">
                      👤 Interlocutor
                    </span>
                    <span className="font-serif text-[#292524] text-right">
                      Autor(a) e obra de referência cuja matriz teórica ou ferramental é convocada.
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#F9E0E0]/60 border border-[#9A3412] p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#9A3412] font-semibold mb-2">
                    Regra de Autoria (Não-Negociável)
                  </div>
                  <p className="font-serif text-sm text-[#1C1917] leading-relaxed">
                    Os <strong>quatro conceitos autorais</strong> —{' '}
                    <button
                      onClick={() => openNodeById('contrato-sexual-visual')}
                      className="underline font-semibold hover:text-[#9A3412]"
                    >
                      Contrato Sexual Visual
                    </button>
                    ,{' '}
                    <button
                      onClick={() => openNodeById('feminilidade-de-estado')}
                      className="underline font-semibold hover:text-[#9A3412]"
                    >
                      Feminilidade de Estado
                    </button>
                    ,{' '}
                    <button
                      onClick={() => openNodeById('contrato-racial-visual')}
                      className="underline font-semibold hover:text-[#9A3412]"
                    >
                      Contrato Racial Visual
                    </button>{' '}
                    e{' '}
                    <button
                      onClick={() => openNodeById('purificacao-classica')}
                      className="underline font-semibold hover:text-[#9A3412]"
                    >
                      Purificação Clássica
                    </button>{' '}
                    — <strong>não</strong> são derivações cedidas a Pateman, Mondzain, Legendre, Latour ou Haraway. Esses autores entram como{' '}
                    <em>raízes genealógicas</em> ou <em>matriz ferramental</em>; a extensão visual/jurídica é autoral.
                  </p>
                </div>
                <p className="text-xs font-mono text-[#6E3209] mt-4 pt-3 border-t border-[#B5651D]/40">
                  Convenção do manuscrito: usar sempre "Purificação Clássica" (nunca "purificação iconocrática") e "Endurecimento" em português (nunca "hardening"). Termo "ciberfeminismo" proibido.
                </p>
              </div>
            </div>

            {/* Interactive Conceptual Map (Translating the Mermaid Flowchart from Glossario.md) */}
            <section className="bg-[#141210] text-[#FBF9F5] border border-[#292524] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#292524] pb-4 mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#9A8A2A]">
                    Mapa Conceitual Interativo (Clique em qualquer operador para abrir a Ficha)
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-white mt-0.5">
                    Arquitetura da Purificação Clássica, Endurecimento & Matrizes Convocadas
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Column: Matriz Convocada (Interlocutores) */}
                <div className="lg:col-span-5 border border-[#38332E] bg-[#1C1917] p-4 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#D6CEBE] border-b border-[#292524] pb-2">
                    Matriz Convocada (Interlocutores)
                  </div>
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-[#9A8A2A]">
                      Matriz Primária (Jurídica):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        ['kantorowicz-ernst', '👤 Kantorowicz', 'Dois corpos do rei'],
                        ['legendre-pierre', '👤 Legendre', 'Juiz totêmico'],
                        ['hespanha-antonio', '👤 Hespanha', 'Cultura jurídica'],
                      ].map(([id, name, sub]) => (
                        <button
                          key={id}
                          onClick={() => openNodeById(id)}
                          className="p-2.5 text-left border border-[#38332E] hover:border-[#9A8A2A] bg-[#141210] transition-colors"
                        >
                          <div className="font-mono text-xs font-semibold text-white">
                            {name}
                          </div>
                          <div className="text-[11px] text-[#A8A29E]">{sub}</div>
                        </button>
                      ))}
                    </div>

                    <div className="text-[11px] font-mono text-[#9A8A2A] pt-2">
                      Extensão Ferramental:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        ['latour-bruno', '👤 Latour 1991', 'Purificação/tradução'],
                        ['haraway-donna', '👤 Haraway 1985', 'Fronteiras nat./cult.'],
                        ['descola-philippe', '👤 Descola 2021', 'Formas do visível'],
                      ].map(([id, name, sub]) => (
                        <button
                          key={id}
                          onClick={() => openNodeById(id)}
                          className="p-2.5 text-left border border-[#38332E] hover:border-[#9A8A2A] bg-[#141210] transition-colors"
                        >
                          <div className="font-mono text-xs font-semibold text-white">
                            {name}
                          </div>
                          <div className="text-[11px] text-[#A8A29E]">{sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center Hub: Purificação Clássica -> Endurecimento */}
                <div className="lg:col-span-3 flex flex-col items-center justify-center gap-4">
                  <button
                    onClick={() => openNodeById('purificacao-classica')}
                    className="w-full p-4 border-2 border-[#9A3412] bg-[#9A3412]/20 hover:bg-[#9A3412]/30 text-center transition-colors"
                  >
                    <div className="text-xs font-mono text-[#F9E0E0]">
                      🔹 CONCEITO AUTORAL #4
                    </div>
                    <div className="font-display text-2xl font-semibold text-white mt-0.5">
                      Purificação Clássica
                    </div>
                    <div className="text-xs font-serif italic text-[#D6CEBE] mt-1">
                      Operação formal (Cap. 5.2)
                    </div>
                  </button>

                  <div className="text-xs font-mono text-[#9A8A2A]">
                    ▼ operacionaliza-se em ▼
                  </div>

                  <button
                    onClick={() => openNodeById('endurecimento')}
                    className="w-full p-4 border border-[#9A8A2A] bg-[#1C1917] hover:border-white text-center transition-colors"
                  >
                    <div className="text-xs font-mono text-[#9A8A2A]">
                      ⚙️ OPERACIONAL · CAP. 6–7
                    </div>
                    <div className="font-display text-xl font-semibold text-white mt-0.5">
                      Endurecimento
                    </div>
                    <div className="text-xs font-mono text-[#A8A29E] mt-1">
                      10 indicadores ordinais (0–3)
                    </div>
                  </button>
                </div>

                {/* Right Column: Contratos Visuais & Acoplamento Imagem-Norma */}
                <div className="lg:col-span-4 space-y-3">
                  {[
                    [
                      'contrato-sexual-visual',
                      '🔹 Contrato Sexual Visual (#1)',
                      'Exclusão civil × hiper-presença alegórica',
                    ],
                    [
                      'feminilidade-de-estado',
                      '🔹 Feminilidade de Estado (#2)',
                      'Corpo totêmico esvaziado de mulher concreta',
                    ],
                    [
                      'contrato-racial-visual',
                      '🔹 Contrato Racial Visual (#3)',
                      'Branquitude constitutiva & transferência transatlântica',
                    ],
                    [
                      'acoplamento-imagem-norma',
                      '🔹 Acoplamento imagem-norma',
                      'Ver a figura é reconhecer a autoridade da lei',
                    ],
                  ].map(([id, title, desc]) => (
                    <button
                      key={id}
                      onClick={() => openNodeById(id)}
                      className="w-full p-3 text-left border border-[#38332E] hover:border-[#9A3412] bg-[#1C1917] transition-colors"
                    >
                      <div className="font-display text-lg font-semibold text-white">
                        {title}
                      </div>
                      <div className="text-xs text-[#A8A29E] font-serif">
                        {desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Filter & Search Bar for Glossary Sections */}
            <div className="sticky top-[65px] z-20 bg-[#FBF9F5]/95 border-y border-[#D6CEBE] py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(
                  [
                    ['todos', 'Todas as Categorias (27)'],
                    ['autoral', '1. Conceitos Autorais 🔹'],
                    ['mobilizado', '2. Mobilizados 🔸'],
                    ['operacional', '3. Aparato Operacional ⚙️'],
                    ['warburg', '4. Léxico Warburguiano 🔸'],
                    ['alegoria', '5. Alegorias Nacionais 🏛️'],
                    ['interlocutor', '6. Interlocutores 👤'],
                  ] as const
                ).map(([catKey, label]) => (
                  <button
                    key={catKey}
                    onClick={() => setActiveCategory(catKey)}
                    className={`px-3 py-1.5 text-xs font-mono border transition-colors whitespace-nowrap ${
                      activeCategory === catKey
                        ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                        : 'bg-[#F3EFE6] text-[#292524] border-[#D6CEBE] hover:border-[#1C1917]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar termo, autor, @chave..."
                  className="w-full bg-white border border-[#D6CEBE] pl-9 pr-3 py-1.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
                />
              </div>
            </div>

            {/* Glossary Entries List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNodes.map((node) => (
                <article
                  key={node.id}
                  className="border border-[#D6CEBE] bg-[#FBF9F5] p-6 flex flex-col justify-between hover:border-[#1C1917] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#78716C] mb-2">
                      <span>
                        {node.categoryLabel} · Regime {node.regime}
                      </span>
                      <span>{node.chapterRef || 'Corpus Core'}</span>
                    </div>

                    <h3
                      onClick={() => setSelectedNode(node)}
                      className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917] hover:text-[#9A3412] cursor-pointer"
                    >
                      {node.title}
                    </h3>

                    {node.verificarFlag && (
                      <div className="mt-2 text-xs font-mono text-[#9A3412] bg-[#F9E0E0]/50 px-2.5 py-1 border border-[#B5651D]/40">
                        #verificar: {node.verificarFlag}
                      </div>
                    )}

                    <p className="font-serif text-sm text-[#1C1917] leading-relaxed mt-3">
                      {node.definition}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#E5DEC9] text-xs font-serif text-[#57534E]">
                      <strong className="font-mono text-[#1C1917] uppercase">
                        Proveniência:{' '}
                      </strong>
                      {node.provenanceNote}
                    </div>

                    <div className="mt-2 text-xs font-serif text-[#57534E]">
                      <strong className="font-mono text-[#1C1917] uppercase">
                        Uso na Tese:{' '}
                      </strong>
                      {node.thesisUsage}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#E5DEC9] flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-[#9A3412]">
                      {node.abntKeys.join(' · ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedNode(node);
                          setActiveTab('acervo');
                          setViewMode('palco');
                        }}
                        className="px-2.5 py-1 text-xs font-mono border border-[#D6CEBE] hover:bg-[#F3EFE6] text-[#1C1917]"
                      >
                        Ver no Palco 3D
                      </button>
                      <button
                        onClick={() => setSelectedNode(node)}
                        className="px-3 py-1 text-xs font-mono bg-[#1C1917] text-[#FBF9F5] hover:bg-[#292524]"
                      >
                        Ficha Completa
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REGIMES ICONOCRÁTICOS, 10 INDICADORES DE ENDURECIMENTO, PANOFSKY & ICONCLASS */}
        {activeTab === 'regimes' && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 space-y-14 select-text">
            <div className="border-b border-[#D6CEBE] pb-6">
              <p className="text-xs font-mono uppercase tracking-widest text-[#9A3412]">
                Aparato Operacional ⚙️ · DEC-2026-07-29-APARATO-MINIMO
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1C1917] mt-2">
                Regimes Iconocráticos, 10 Indicadores de Endurecimento & Auditoria Iconclass
              </h1>
              <p className="font-serif text-base text-[#292524] leading-relaxed mt-3 max-w-3xl">
                Os regimes iconocráticos são tipologia analítica construída por leitura densa de casos exemplares, e os 10 indicadores de endurecimento operam sob estatuto de <strong>paradigma indiciário (Morelli–Ginzburg)</strong> — nunca somados em um score agregado.
              </p>
            </div>

            {/* Progressão dos Regimes Iconocráticos */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                1. Progressão dos Regimes Iconocráticos (+ Contra-Alegoria)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {REGIME_DEFINITIONS.map((reg, idx) => (
                  <div
                    key={reg.id}
                    style={{
                      backgroundColor: reg.bgHex,
                      borderColor: reg.borderHex,
                    }}
                    className="border-2 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        style={{ color: reg.textHex }}
                        className="text-xs font-mono uppercase tracking-widest font-semibold"
                      >
                        {idx < 3 ? `Regime 0${idx + 1}` : 'Ruptura / Subversão'}
                      </div>
                      <h3 className="font-display text-2xl font-bold text-[#1C1917] mt-1">
                        {reg.title}
                      </h3>
                      <dl className="mt-4 space-y-2 text-xs font-serif text-[#1C1917]">
                        <div>
                          <dt className="font-mono uppercase text-[10px] opacity-75">
                            Corpo Alegórico:
                          </dt>
                          <dd className="font-semibold">{reg.bodyType}</dd>
                        </div>
                        <div>
                          <dt className="font-mono uppercase text-[10px] opacity-75">
                            Lógica Institucional:
                          </dt>
                          <dd>{reg.logic}</dd>
                        </div>
                        <div>
                          <dt className="font-mono uppercase text-[10px] opacity-75">
                            Marca Visual Dominante:
                          </dt>
                          <dd>{reg.visualMark}</dd>
                        </div>
                      </dl>
                    </div>

                    <button
                      onClick={() => {
                        setActiveRegime(reg.id as IconocraticRegime);
                        setActiveTab('acervo');
                        setViewMode('constelacao');
                      }}
                      className="mt-5 pt-2.5 border-t border-black/15 text-xs font-mono text-[#1C1917] hover:underline flex items-center justify-between"
                    >
                      <span>Filtrar na Constelação</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Os 10 Indicadores de Endurecimento + Comparador de Perfis Ordinais */}
            <section className="space-y-6 border-t border-[#D6CEBE] pt-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-semibold text-[#1C1917]">
                    2. Os 10 Indicadores Ordinais de Endurecimento (Escala 0–3)
                  </h2>
                  <p className="font-serif text-sm text-[#57534E] mt-1">
                    Leitura da escala: <code className="font-mono">0 = ausente</code> ·{' '}
                    <code className="font-mono">1 = incipiente</code> ·{' '}
                    <code className="font-mono">2 = marcado</code> ·{' '}
                    <code className="font-mono">3 = pleno</code>. O campo{' '}
                    <code className="font-mono">endurecimento_score</code> foi removido definitivamente em 2026-09-24.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#D6CEBE] bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1C1917] text-[#FBF9F5] font-mono">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Indicador (Chave Canônica)</th>
                      <th className="py-3 px-4">O que mede empiricamente</th>
                      {compareAllegoryIds.map((id) => {
                        const item = ICONOCRACY_NODES.find((n) => n.id === id);
                        return (
                          <th key={id} className="py-3 px-4 text-center">
                            {item ? item.title.split('(')[0].trim() : id}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DEC9]">
                    {HARDENING_INDICATORS.map((ind) => (
                      <tr key={ind.id} className="hover:bg-[#F3EFE6]/60">
                        <td className="py-3 px-4 font-mono tabular-nums text-[#78716C]">
                          {ind.index}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#1C1917]">
                          {ind.label}
                        </td>
                        <td className="py-3 px-4 font-serif text-sm text-[#292524]">
                          {ind.measures}
                        </td>
                        {compareAllegoryIds.map((id) => {
                          const item = ICONOCRACY_NODES.find(
                            (n) => n.id === id
                          );
                          const val = item?.hardeningProfile?.[ind.key];
                          return (
                            <td
                              key={id}
                              className="py-3 px-4 font-mono tabular-nums text-center font-semibold"
                            >
                              {val !== undefined ? (
                                <span
                                  className={`inline-block px-2 py-0.5 ${
                                    val === 3
                                      ? 'bg-[#1C1917] text-white'
                                      : val === 2
                                      ? 'bg-[#D6CEBE] text-[#1C1917]'
                                      : 'bg-[#F3EFE6] text-[#57534E]'
                                  }`}
                                >
                                  {val}
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Iconclass Audit Warning (48C51 vs 44 / 11M44) & Panofsky */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-[#D6CEBE] pt-10">
              <div className="bg-[#F9E0E0]/60 border border-[#9A3412] p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#9A3412] font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  Auditoria Iconclass (Verificado na API Oficial iconclass.org em 2026-06-26)
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917]">
                  Correção da Referência ao Código 48C51 vs. 44 e 11M44
                </h3>
                <p className="font-serif text-sm text-[#1C1917] leading-relaxed">
                  O <code className="font-mono">CLAUDE.md</code> registrava{' '}
                  <em>"Iconclass 48C51 = código-chave para iconografia feminista"</em>, mas o{' '}
                  <strong>iconclass.org oficial</strong> rotula{' '}
                  <code className="font-mono">48C51</code> como{' '}
                  <strong>"painting (including book-illumination, miniature-painting)"</strong> — é a forma de arte pintura, não um tema feminista ou jurídico.
                </p>
                <div className="bg-[#FBF9F5] border border-[#D6CEBE] p-4 space-y-2 text-xs font-mono">
                  <div>
                    <strong className="text-[#9A3412]">44</strong> —{' '}
                    <em>state; law; political life</em> (ramo jurídico-político central do corpus)
                  </div>
                  <div>
                    <strong className="text-[#9A3412]">11M44</strong> —{' '}
                    <em>Justice, 'Justitia'; 'Giustitia divina' (Ripa) ~ one of the Four Cardinal Virtues</em>
                  </div>
                  <div className="text-[#78716C]">
                    <strong>48C51</strong> —{' '}
                    <em>painting (including book-illumination, miniature-painting)</em> [Forma de arte]
                  </div>
                </div>
              </div>

              <div className="bg-[#F3EFE6] border border-[#D6CEBE] p-6 space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-[#57534E]">
                  Critérios de Inclusão no Corpus Core (Todos Obrigatórios)
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917]">
                  Catálogo Documentado (1800–2000) & Níveis de Panofsky
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 font-serif text-sm text-[#1C1917]">
                  <li>
                    Figura <strong>alegórica feminina</strong>;
                  </li>
                  <li>
                    <strong>Função jurídico-política</strong> explícita;
                  </li>
                  <li>
                    Datável em <strong>1800–2000</strong> (prioridade 1880–1920);
                  </li>
                  <li>
                    <strong>Suporte aceito</strong> (moeda · selo · monumento/escultura · arquitetura forense · estampa/gravura · frontispício · papel-moeda · cartaz).
                  </li>
                </ol>
                <p className="text-xs font-serif italic text-[#57534E] pt-2 border-t border-[#E5DEC9]">
                  Nota (2026-06-22): O país é hoje variável analítica, não gate de inclusão — a alegoria dita "universal" é transnacional (base do Contrato Racial Visual).
                </p>
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: MÉTODO BENJAMIN-WEIGEL (constellation-method_c71ded18.md) */}
        {activeTab === 'metodo' && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 select-text">
            {/* Asymmetric 70/30 Editorial Reading Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <div className="border-b border-[#D6CEBE] pb-6">
                  <p className="text-xs font-mono uppercase tracking-widest text-[#9A3412]">
                    Orientação Autoral · 4 de outubro de 2026 (constellation-method.md)
                  </p>
                  <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1C1917] mt-2 leading-tight">
                    Constelação como Entrada Principal do Acervo
                  </h1>
                </div>

                <div className="font-serif text-base text-[#1C1917] leading-relaxed space-y-6 max-w-prose">
                  <p className="first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#9A3412]">
                    A constelação deve ser a maneira principal de apresentar o acervo, em diálogo com Walter Benjamin e Sigrid Weigel. Este documento traduz essa orientação em escolhas de interface; não altera o PDF de fundamentação enviado na conversa, o corpus ou as aprovações editoriais.
                  </p>

                  <h2 className="font-display text-2xl font-semibold text-[#1C1917] pt-4">
                    Fundamento e Interpretação Operacional
                  </h2>
                  <p>
                    O estudo <em>Sigrid Weigel e a economia imagética do feminino: fundamentos para uma leitura iconocrática da alegoria jurídica</em> sustenta que as imagens participam da produção do pensamento e que a passagem da teoria de Weigel à cultura jurídica exige uma transposição conceitual explícita.
                  </p>
                  <p>
                    No prefácio de <em>Ursprung des deutschen Trauerspiels</em>, Benjamin aproxima ideias e coisas da relação entre constelações e estrelas. A configuração preserva diferenças e singularidades; sua função não se reduz à classificação por gênero ou à formulação de leis. Essa passagem fundamenta a escolha de uma entrada relacional para o acervo, como interpretação operacional desta pesquisa.
                  </p>
                  <p>
                    Na introdução de <em>Body- and Image-Space</em> (pp. viii–ix), Weigel descreve a imagem benjaminiana como constelação heterogênea e como meio do trabalho teórico. A aproximação de imagens pode, assim, constituir o argumento da apresentação. Sua tradução em interface permanece uma decisão desta pesquisa, não uma prescrição tecnológica de Benjamin ou Weigel.
                  </p>

                  <h2 className="font-display text-2xl font-semibold text-[#1C1917] pt-4">
                    Hierarquia que Passa a Valer
                  </h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      A entrada <code className="font-mono text-xs">/acervo</code> abre no campo de imagens. O botão <strong>Constelação</strong> vem primeiro; <strong>Palco</strong> e <strong>Grade</strong> continuam disponíveis como modos de inspeção e consulta.
                    </li>
                    <li>
                      A ação principal leva diretamente à constelação. Textos próprios, identidade visual e dossiês existentes permanecem preservados.
                    </li>
                    <li>
                      A ficha de uma obra abre sobre o campo; fechá-la devolve o foco à obra. Links diretos continuam utilizáveis e modos explicitamente escolhidos na URL são respeitados.
                    </li>
                    <li>
                      O campo acompanha a largura da tela. <strong>Posição, tamanho e moldura não representam relevância científica, aprovação ou intensidade de uma relação.</strong>
                    </li>
                    <li>
                      Percursos curatoriais aprovados oferecem configurações determinadas pela autoria editorial, com leitura sequencial acessível como alternativa.
                    </li>
                  </ul>

                  <h2 className="font-display text-2xl font-semibold text-[#1C1917] pt-4">
                    Como Desenvolver a Montagem Autoral
                  </h2>
                  <p>
                    Uma aproximação entre obras começa por uma pergunta da pesquisa. O suporte da imagem pode importar tanto quanto seu lugar de exposição; a função jurídico-política exige documentação própria. Cada montagem deverá explicitar o que sustenta a comparação e permitir voltar à ficha de cada objeto. A semelhança entre figuras, isoladamente, não estabelece transmissão histórica. A mesma obra pode participar de mais de uma montagem.
                  </p>

                  <h2 className="font-display text-2xl font-semibold text-[#1C1917] pt-4">
                    Cotejo Bibliográfico do Anexo (Weigel 1996 / 2005)
                  </h2>
                  <p>
                    O integral de Weigel disponibilizado pela autora permite resolver uma das lacunas do PDF: a folha editorial registra primeira publicação em 1996 e edição eletrônica Taylor & Francis de 2005. As passagens indicadas nas pp. 58 e 92–93 estão presentes nessa edição.
                  </p>
                  <p className="bg-[#F3EFE6] border border-[#D6CEBE] p-4 text-sm">
                    <strong>Precisão de atribuição a conservar em futura revisão do texto:</strong> na p. 58, o referente de <em>“its imaginative concepts”</em> é a cultura ocidental, que o parágrafo nomeia, e não exclusivamente os conceitos de Benjamin.
                  </p>
                </div>
              </div>

              {/* Margin Sidebar: External Artifacts & Primary Sources */}
              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-[#F3EFE6] border border-[#D6CEBE] p-6 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#9A3412] font-semibold">
                    Artefatos Oficiais do Projeto
                  </h3>
                  <div className="space-y-3 text-xs font-mono">
                    <a
                      href="https://iconocracia-companion.warholana.workers.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-[#FBF9F5] border border-[#D6CEBE] hover:border-[#9A3412] text-[#1C1917]"
                    >
                      <span>Iconocracia Companion</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#9A3412]" />
                    </a>
                    <a
                      href="https://www.perplexity.ai/computer/a/iconocracia-atlas-7saKqNyZTLCkLkFNF.tbOw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-[#FBF9F5] border border-[#D6CEBE] hover:border-[#9A3412] text-[#1C1917]"
                    >
                      <span>Iconocracia Atlas (Síntese)</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#9A3412]" />
                    </a>
                    <a
                      href="https://github.com/anavvanzin/iconocracy-corpus"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-[#FBF9F5] border border-[#D6CEBE] hover:border-[#9A3412] text-[#1C1917]"
                    >
                      <span>Repositório GitHub Corpus</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#9A3412]" />
                    </a>
                  </div>
                </div>

                <div className="bg-[#F3EFE6] border border-[#D6CEBE] p-6 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#57534E] font-semibold">
                    Fontes Primárias Citadas na Orientação
                  </h3>
                  <div className="space-y-3 text-xs font-serif">
                    <a
                      href="https://www.textlog.de/benjamin/abhandlungen/ursprung-des-deutschen-trauerspiels/idee-als-konfiguration"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-[#FBF9F5] border border-[#D6CEBE] hover:border-[#1C1917]"
                    >
                      <div className="font-mono text-[#9A3412] font-semibold">
                        Walter Benjamin (1928)
                      </div>
                      <div className="mt-1">
                        Ursprung des deutschen Trauerspiels — “Idee als Konfiguration” (textlog.de)
                      </div>
                    </a>
                    <a
                      href="https://www.researchgate.net/publication/245588413_Body-and_Image-Space_Re-Reading_Walter_Benjamin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-[#FBF9F5] border border-[#D6CEBE] hover:border-[#1C1917]"
                    >
                      <div className="font-mono text-[#9A3412] font-semibold">
                        Sigrid Weigel (1996 / 2005)
                      </div>
                      <div className="mt-1">
                        Body- and Image-Space: Re-Reading Walter Benjamin (Integral ResearchGate)
                      </div>
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* TAB 5: REFERÊNCIAS ABNT NBR 6023:2025 */}
        {activeTab === 'referencias' && (
          <div className="max-w-6xl mx-auto px-6 sm:px-12 py-12 space-y-10 select-text">
            <div className="border-b border-[#D6CEBE] pb-6">
              <p className="text-xs font-mono uppercase tracking-widest text-[#9A3412]">
                Cotejado com vault/tese/references.bib · ABNT NBR 6023:2025
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1C1917] mt-2">
                Referências Bibliográficas & Controle de Auditoria
              </h1>
              <p className="font-serif text-base text-[#292524] mt-3 max-w-3xl">
                Entradas alinhadas às chaves BibTeX da tese (<code className="font-mono">@chave</code>). Onde a tese mantém edição original e tradução em português, ambas constam explicitamente.
              </p>
            </div>

            <div className="space-y-4">
              {ABNT_REFERENCES.map((ref) => (
                <div
                  key={ref.key}
                  className="bg-[#FBF9F5] border border-[#D6CEBE] p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono text-[#9A3412] font-semibold">
                      {ref.key}
                    </div>
                    <p className="font-serif text-sm text-[#1C1917] leading-relaxed">
                      {ref.citation}
                    </p>
                    {ref.translationNote && (
                      <p className="font-serif text-xs italic text-[#57534E]">
                        [{ref.translationNote}]
                      </p>
                    )}
                    {ref.statusNote && (
                      <p className="font-mono text-xs text-[#78350F] pt-1">
                        Status de auditoria: {ref.statusNote}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSearchQuery(ref.key);
                      setActiveTab('glossario');
                    }}
                    className="px-3 py-1.5 text-xs font-mono border border-[#D6CEBE] hover:bg-[#F3EFE6] text-[#1C1917] whitespace-nowrap shrink-0"
                  >
                    Ver Verbetes Vinculados
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FICHA DOSSIER OVERLAY (Opens over the Constellation or Glossary; closing returns focus to the field) */}
        <FichaDrawerModal
          node={selectedNode}
          allNodes={ICONOCRACY_NODES}
          onClose={() => setSelectedNode(null)}
          onSelectConnectedNode={(target) => setSelectedNode(target)}
          viewMode={viewMode}
          onChangeViewMode={(m) => {
            setActiveTab('acervo');
            setViewMode(m);
          }}
          montageIds={montageIds}
          onToggleMontageItem={handleToggleMontageItem}
        />

        {/* ZWISCHENRAUM COMPARATIVE MONTAGE MODAL */}
        <ZwischenraumMontageModal
          isOpen={isMontageOpen}
          onClose={() => setIsMontageOpen(false)}
          allNodes={ICONOCRACY_NODES}
          montageIds={montageIds}
          onSetMontageIds={setMontageIds}
          onSelectNodeFromMontage={(node) => {
            setSelectedNode(node);
            setActiveTab('acervo');
          }}
        />

        {/* SELECTION PEEK-A-CONCEPT TOOLTIP (Triggers on any text highlight) */}
        <SelectionPeekTooltip
          allNodes={ICONOCRACY_NODES}
          onOpenNodeFicha={(node) => setSelectedNode(node)}
        />
      </main>
    </div>
  );
}
