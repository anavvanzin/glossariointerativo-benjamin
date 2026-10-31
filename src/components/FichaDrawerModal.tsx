import React from 'react';
import {
  ABNT_REFERENCES,
  ConstellationNodeItem,
  HARDENING_INDICATORS,
  generateArchivalEngravingSvg,
} from '../data/iconocracyData';
import {
  ArrowUpRight,
  BookOpen,
  Eye,
  GitCommit,
  Layers,
  AlertTriangle,
  X,
} from 'lucide-react';
import { AcervoViewMode } from './ConstellationViewport3D';

interface FichaDrawerModalProps {
  node: ConstellationNodeItem | null;
  allNodes: ConstellationNodeItem[];
  onClose: () => void;
  onSelectConnectedNode: (node: ConstellationNodeItem) => void;
  viewMode: AcervoViewMode;
  onChangeViewMode: (mode: AcervoViewMode) => void;
  montageIds: string[];
  onToggleMontageItem: (id: string) => void;
}

const ORDINAL_LABELS: Record<number, string> = {
  0: '0 · ausente',
  1: '1 · incipiente',
  2: '2 · marcado',
  3: '3 · pleno',
};

export const FichaDrawerModal: React.FC<FichaDrawerModalProps> = ({
  node,
  allNodes,
  onClose,
  onSelectConnectedNode,
  viewMode,
  onChangeViewMode,
  montageIds,
  onToggleMontageItem,
}) => {
  if (!node) return null;

  const isInMontage = montageIds.includes(node.id);
  const connectedNodes = node.connections
    .map((cid) => allNodes.find((n) => n.id === cid))
    .filter((n): n is ConstellationNodeItem => Boolean(n));

  const matchingRefs = ABNT_REFERENCES.filter((r) =>
    node.abntKeys.includes(r.key)
  );

  const engravingDataUrl = generateArchivalEngravingSvg(
    node.title,
    `${node.categoryLabel} · ${node.regime}`,
    node.archetype
  );

  return (
    <aside
      aria-label="Ficha catalográfica e conceitual"
      className="fixed top-[65px] right-0 bottom-0 z-30 w-full sm:w-[490px] md:w-[540px] bg-[#FBF9F5] text-[#1C1917] border-l border-[#D6CEBE] shadow-2xl overflow-y-auto select-text"
    >
      {/* Sticky Dossier Top Header */}
      <div className="sticky top-0 z-10 bg-[#FBF9F5]/95 border-b border-[#E5DEC9] px-6 py-4 flex items-center justify-between gap-4">
        <div className="text-xs font-mono text-[#57534E] truncate">
          <span>{node.categoryLabel}</span>
          <span aria-hidden="true"> · </span>
          <span>Regime {node.regime}</span>
          {node.chapterRef && (
            <>
              <span aria-hidden="true"> · </span>
              <span>{node.chapterRef}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() =>
              onChangeViewMode(viewMode === 'palco' ? 'constelacao' : 'palco')
            }
            className="px-2.5 py-1 text-xs font-mono border border-[#D6CEBE] bg-[#F3EFE6] hover:bg-[#E5DEC9] text-[#1C1917] flex items-center gap-1 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            {viewMode === 'palco' ? 'Voltar à Constelação' : 'Inspecionar no Palco 3D'}
          </button>
          <button
            onClick={onClose}
            title="Fechar ficha e devolver o foco à obra no campo (Esc)"
            className="p-1.5 border border-[#D6CEBE] hover:bg-[#F3EFE6] text-[#1C1917]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Title & Subtitle */}
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] leading-tight">
            {node.title}
          </h2>
          {node.subtitle && (
            <p className="text-xs font-mono uppercase tracking-wider text-[#78716C] mt-2">
              {node.subtitle}
            </p>
          )}

          {/* Action Bar: Add to Zwischenraum Montage */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onToggleMontageItem(node.id)}
              className={`px-3.5 py-1.5 text-xs font-mono border transition-colors whitespace-nowrap ${
                isInMontage
                  ? 'bg-[#9A3412] text-[#FBF9F5] border-[#9A3412]'
                  : 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917] hover:bg-[#292524]'
              }`}
            >
              {isInMontage
                ? '✓ Fixado na Montagem Zwischenraum'
                : '+ Fixar na Montagem Zwischenraum'}
            </button>
            <span className="text-xs font-serif italic text-[#57534E]">
              Selecione qualquer trecho de texto abaixo para gerar nota + gravura IA.
            </span>
          </div>
        </div>

        {/* #verificar Audit Flag if present */}
        {node.verificarFlag && (
          <div className="border border-[#B5651D] bg-[#F9E0E0]/60 p-4 text-xs text-[#6E3209]">
            <div className="font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Marcador #verificar (Auditoria Documental)
            </div>
            <p className="font-serif leading-relaxed">{node.verificarFlag}</p>
          </div>
        )}

        {/* Archival Plate Preview + Accession Metadata Grid (dl) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start border-y border-[#E5DEC9] py-6">
          <div className="sm:col-span-5 bg-[#F3EFE6] border border-[#D6CEBE] p-2">
            <img
              src={engravingDataUrl}
              alt={`Gravura esquemática de ${node.title}`}
              referrerPolicy="no-referrer"
              className="w-full h-auto block"
            />
            <p className="text-[11px] font-serif italic text-[#57534E] mt-1.5 text-center">
              Prancha indiciária · ID: {node.id}
            </p>
          </div>

          <dl className="sm:col-span-7 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-[#E5DEC9] pb-1.5">
              <dt className="font-mono text-[#78716C]">Estatuto Epistêmico</dt>
              <dd className="font-medium text-[#1C1917] text-right">
                {node.categoryLabel}
              </dd>
            </div>
            <div className="flex justify-between border-b border-[#E5DEC9] pb-1.5">
              <dt className="font-mono text-[#78716C]">Escopo Metodológico</dt>
              <dd className="font-mono text-[#1C1917] text-right">
                {node.corpusScope === 'core'
                  ? 'Corpus Core (1800–2000)'
                  : node.corpusScope === 'comparador_apendice'
                  ? 'Comparador / Apêndice'
                  : 'Aparato Conceitual / Operacional'}
              </dd>
            </div>
            {node.country && (
              <div className="flex justify-between border-b border-[#E5DEC9] pb-1.5">
                <dt className="font-mono text-[#78716C]">Recorte Espacial</dt>
                <dd className="font-mono text-[#1C1917] text-right">
                  {node.country}
                </dd>
              </div>
            )}
            {node.period && (
              <div className="flex justify-between border-b border-[#E5DEC9] pb-1.5">
                <dt className="font-mono text-[#78716C]">Janela Cronológica</dt>
                <dd className="font-mono text-[#1C1917] text-right">
                  {node.period}
                </dd>
              </div>
            )}
            {node.support && (
              <div className="flex justify-between border-b border-[#E5DEC9] pb-1.5">
                <dt className="font-mono text-[#78716C]">Suporte Material</dt>
                <dd className="text-[#1C1917] text-right max-w-[210px]">
                  {node.support}
                </dd>
              </div>
            )}
            {node.iconclassCodes && node.iconclassCodes.length > 0 && (
              <div className="flex justify-between border-b border-[#E5DEC9] pb-1.5">
                <dt className="font-mono text-[#78716C]">Códigos Iconclass</dt>
                <dd className="font-mono text-[#9A3412] font-semibold text-right">
                  {node.iconclassCodes.join(' · ')}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Core Definition */}
        <section>
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#78716C] mb-2">
            01. Definição Canônica
          </h3>
          <p className="font-serif text-base text-[#1C1917] leading-relaxed">
            {node.definition}
          </p>
        </section>

        {/* Provenance & Authorship Rule */}
        <section className="bg-[#F3EFE6] border border-[#D6CEBE] p-5">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#9A3412] font-semibold mb-2">
            02. Proveniência & Regra de Autoria
          </h3>
          <p className="font-serif text-sm text-[#292524] leading-relaxed">
            {node.provenanceNote}
          </p>
        </section>

        {/* Usage in Thesis & Sense Produced vs Received */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#78716C] mb-1.5">
              03. Operação na Tese
            </h3>
            <p className="font-serif text-sm text-[#292524] leading-relaxed">
              {node.thesisUsage}
            </p>
          </div>

          {node.senseProducedVsReceived && (
            <div className="border-t border-[#E5DEC9] pt-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#78716C] mb-1.5">
                Sentido Produzido pelo Dispositivo Estatal vs. Recepção Histórica
              </h4>
              <p className="font-serif text-sm text-[#292524] leading-relaxed">
                {node.senseProducedVsReceived}
              </p>
            </div>
          )}
        </section>

        {/* 10 Hardening Indicators Profile (Ordinal 0-3, NEVER summed) */}
        {node.hardeningProfile && (
          <section className="border-t border-[#D6CEBE] pt-6">
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#1C1917] font-semibold">
                04. Perfil Indiciário de Endurecimento (10 Indicadores · 0–3)
              </h3>
              <span className="text-[11px] font-mono text-[#9A3412]">
                Sem soma agregada (Dec. 2026-09-24)
              </span>
            </div>
            <p className="text-xs font-serif text-[#57534E] mb-4">
              Inventário verbal e ordinal sob paradigma indiciário (Morelli–Ginzburg). O antigo campo{' '}
              <code className="font-mono">endurecimento_score</code> foi removido definitivamente.
            </p>

            <div className="space-y-2.5">
              {HARDENING_INDICATORS.map((ind) => {
                const val = node.hardeningProfile?.[ind.key] ?? 0;
                const widthPct = (val / 3) * 100;
                return (
                  <div key={ind.id} className="text-xs">
                    <div className="flex items-center justify-between font-mono mb-1">
                      <span className="text-[#1C1917] font-medium">
                        {ind.index}. {ind.label}
                      </span>
                      <span className="tabular-nums text-[#57534E]">
                        {ORDINAL_LABELS[val]}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E5DEC9] overflow-hidden">
                      <div
                        className="h-full bg-[#1C1917] transition-all duration-200"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#78716C] mt-0.5">
                      {ind.measures}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Constellation Connections (Navigate directly to linked stars) */}
        {connectedNodes.length > 0 && (
          <section className="border-t border-[#D6CEBE] pt-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#78716C] mb-3 flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5" />
              05. Relações na Constelação ({connectedNodes.length} conexões)
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {connectedNodes.map((conn) => (
                <button
                  key={conn.id}
                  onClick={() => onSelectConnectedNode(conn)}
                  className="w-full text-left p-3 border border-[#E5DEC9] hover:border-[#9A3412] bg-[#F5F1E8]/60 hover:bg-[#F3EFE6] transition-colors flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-[11px] font-mono text-[#78716C]">
                      {conn.categoryLabel} · {conn.regime}
                    </div>
                    <div className="font-display text-lg font-semibold text-[#1C1917]">
                      {conn.title}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9A3412] shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ABNT NBR 6023:2025 References */}
        {matchingRefs.length > 0 && (
          <section className="border-t border-[#D6CEBE] pt-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#78716C] mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              06. Referências Vinculadas (ABNT NBR 6023:2025)
            </h3>
            <div className="space-y-3">
              {matchingRefs.map((ref) => (
                <div
                  key={ref.key}
                  className="text-xs font-serif text-[#292524] leading-relaxed bg-[#F3EFE6] p-3 border border-[#E5DEC9]"
                >
                  <div className="font-mono text-[11px] text-[#9A3412] font-semibold mb-1">
                    {ref.key}
                  </div>
                  <p>{ref.citation}</p>
                  {ref.translationNote && (
                    <p className="text-[#57534E] italic mt-1">
                      [{ref.translationNote}]
                    </p>
                  )}
                  {ref.statusNote && (
                    <p className="font-mono text-[11px] text-[#78350F] mt-1">
                      Nota: {ref.statusNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
};
