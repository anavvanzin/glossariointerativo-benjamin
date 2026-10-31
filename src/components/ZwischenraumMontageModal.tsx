import React, { useState } from 'react';
import {
  CURATED_PATHWAYS,
  ConstellationNodeItem,
  CuratedPathway,
  HARDENING_INDICATORS,
  generateArchivalEngravingSvg,
} from '../data/iconocracyData';
import {
  BookOpen,
  Compass,
  ExternalLink,
  HardDrive,
  CheckCircle2,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  exportMontageToDrive,
  getAccessToken,
  googleSignIn,
} from '../services/googleDriveService';

interface ZwischenraumMontageModalProps {
  isOpen: boolean;
  onClose: () => void;
  allNodes: ConstellationNodeItem[];
  montageIds: string[];
  onSetMontageIds: (ids: string[]) => void;
  onSelectNodeFromMontage: (node: ConstellationNodeItem) => void;
}

interface ZwischenraumReport {
  problema?: string;
  argumento?: string;
  evidencias?: string;
  lacunas?: string;
  proximosPassos?: string;
  referenciasAbnt?: string[];
  rawMarkdown?: string;
  citations?: { title: string; uri: string }[];
}

export const ZwischenraumMontageModal: React.FC<
  ZwischenraumMontageModalProps
> = ({
  isOpen,
  onClose,
  allNodes,
  montageIds,
  onSetMontageIds,
  onSelectNodeFromMontage,
}) => {
  const [researchQuestion, setResearchQuestion] = useState(
    'Como a Purificação Clássica e o acoplamento imagem-norma operam no intervalo (Zwischenraum) entre estes elementos sem pressupor transmissão linear?'
  );
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<ZwischenraumReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Google Drive export state
  const [isExportingDrive, setIsExportingDrive] = useState(false);
  const [driveExportSuccess, setDriveExportSuccess] = useState<{
    docUrl?: string;
    name: string;
  } | null>(null);
  const [driveExportError, setDriveExportError] = useState<string | null>(null);

  const handleExportToDrive = async (asGoogleDoc = true) => {
    if (!report) return;
    setIsExportingDrive(true);
    setDriveExportError(null);
    setDriveExportSuccess(null);
    try {
      let token = await getAccessToken();
      if (!token) {
        const signResult = await googleSignIn();
        if (!signResult?.accessToken) {
          throw new Error('Conecte sua conta do Google para salvar no Drive.');
        }
        token = signResult.accessToken;
      }

      const file = await exportMontageToDrive({
        token,
        question: researchQuestion,
        report,
        selectedItems,
        asGoogleDoc,
      });

      setDriveExportSuccess({
        docUrl: file.webViewLink,
        name: file.name,
      });
    } catch (err: any) {
      setDriveExportError(err.message || 'Falha ao salvar no Google Drive.');
    } finally {
      setIsExportingDrive(false);
    }
  };

  if (!isOpen) return null;

  const selectedItems = montageIds
    .map((id) => allNodes.find((n) => n.id === id))
    .filter((n): n is ConstellationNodeItem => Boolean(n));

  const handleLoadPathway = (pathway: CuratedPathway) => {
    onSetMontageIds(pathway.nodeIds);
    setResearchQuestion(pathway.researchQuestion);
    setReport(null);
    setErrorMsg(null);
  };

  const handleGenerateMontageAnalysis = async () => {
    if (selectedItems.length < 2) {
      setErrorMsg(
        'Selecione ao menos 2 estrelas/nós da Constelação para constituir um intervalo Zwischenraum.'
      );
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/iconocracy/zwischenraum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems,
          researchQuestion,
          useSearchGrounding,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Erro ao sintetizar montagem.');
      }
      setReport(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha de comunicação com o servidor.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/75 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-text">
      <div className="bg-[#FBF9F5] text-[#1C1917] border border-[#D6CEBE] w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-[#181614] text-[#FBF9F5] flex items-center justify-between gap-4 border-b border-[#38332E]">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#D6CEBE]">
              Prancha Comparativa Warburguiana · Zwischenraum Panel (Cap. 8)
            </p>
            <h2 className="font-display text-2xl font-semibold">
              Montagem Autoral & Constelação Benjamin-Weigel
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#D6CEBE] hover:text-white border border-[#38332E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Curated Pathways Bar */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#78716C] mb-3">
              Percursos Curatoriais Pré-Configurados (Clique para carregar na prancha)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CURATED_PATHWAYS.map((pw) => (
                <button
                  key={pw.id}
                  onClick={() => handleLoadPathway(pw)}
                  className="text-left p-4 border border-[#D6CEBE] bg-[#F3EFE6]/70 hover:border-[#9A3412] transition-colors"
                >
                  <div className="font-display text-lg font-semibold text-[#1C1917]">
                    {pw.title}
                  </div>
                  <p className="text-xs font-serif text-[#57534E] mt-1">
                    {pw.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mnemosyne Board Displaying Selected Plates */}
          <div className="bg-[#0C0B0A] text-[#FBF9F5] p-6 border border-[#292524]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#292524]">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D6CEBE]">
                Pano Negro Mnemosyne · {selectedItems.length} elementos em configuração
              </span>
              {selectedItems.length > 0 && (
                <button
                  onClick={() => {
                    onSetMontageIds([]);
                    setReport(null);
                  }}
                  className="text-xs font-mono text-[#A8A29E] hover:text-white flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Limpar Prancha
                </button>
              )}
            </div>

            {selectedItems.length === 0 ? (
              <div className="py-10 text-center text-sm font-serif text-[#A8A29E]">
                Nenhum nó fixado ainda. Selecione um dos Percursos Curatoriais acima ou clique em{' '}
                <span className="font-mono text-[#FBF9F5]">+ Fixar na Montagem Zwischenraum</span>{' '}
                em qualquer ficha do acervo.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedItems.map((item) => {
                  const svgUrl = generateArchivalEngravingSvg(
                    item.title,
                    item.regime,
                    item.archetype
                  );
                  return (
                    <div
                      key={item.id}
                      className="bg-[#181614] border border-[#38332E] p-3 flex flex-col justify-between"
                    >
                      <div>
                        <img
                          src={svgUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-36 object-contain bg-[#F5F1E8] mb-3"
                        />
                        <div className="text-[11px] font-mono text-[#D6CEBE]">
                          {item.categoryLabel} · {item.regime}
                        </div>
                        <h4 className="font-display text-lg font-semibold text-white mt-0.5 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#A8A29E] font-serif mt-1.5 line-clamp-3">
                          {item.definition}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-[#292524] flex items-center justify-between">
                        <button
                          onClick={() => {
                            onSelectNodeFromMontage(item);
                            onClose();
                          }}
                          className="text-xs font-mono text-[#D6CEBE] hover:text-white underline"
                        >
                          Voltar à Ficha
                        </button>
                        <button
                          onClick={() =>
                            onSetMontageIds(
                              montageIds.filter((id) => id !== item.id)
                            )
                          }
                          className="text-xs font-mono text-[#EF4444] hover:underline"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Research Question & Synthesis Controls */}
          <div className="bg-[#F3EFE6] border border-[#D6CEBE] p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-[#1C1917] font-semibold mb-2">
                Pergunta Norteadora da Montagem (constellation-method.md)
              </label>
              <textarea
                rows={2}
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#D6CEBE] p-3 font-serif text-sm text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-xs font-mono text-[#292524] cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSearchGrounding}
                  onChange={(e) => setUseSearchGrounding(e.target.checked)}
                  className="accent-[#9A3412]"
                />
                Incluir cotejo bibliográfico em tempo real via Google Search Grounding (gemini-3.8-flash)
              </label>

              <button
                onClick={handleGenerateMontageAnalysis}
                disabled={isGenerating || selectedItems.length < 2}
                className="px-5 py-2.5 bg-[#9A3412] text-[#FBF9F5] text-xs font-mono uppercase tracking-wider hover:bg-[#7C2D12] disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando Leitura Densa (5 Seções)...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar Parecer da Montagem (Problema → Próximos Passos)
                  </>
                )}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs font-mono text-[#9A3412]">{errorMsg}</p>
            )}
          </div>

          {/* 5-Section Academic Deliverable Output */}
          {report && (
            <div className="border border-[#1C1917] bg-[#FBF9F5] p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#D6CEBE] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#9A3412]">
                    Entregável Acadêmico · DEC-2026-07-29-APARATO-MINIMO
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-1">
                    Leitura Indiciária do Intervalo (Zwischenraum)
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleExportToDrive(true)}
                    disabled={isExportingDrive}
                    className="px-3.5 py-2 bg-[#1C1917] text-white hover:bg-[#292524] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isExportingDrive ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Salvando no Drive...
                      </>
                    ) : (
                      <>
                        <HardDrive className="w-3.5 h-3.5 text-[#9A8A2A]" />
                        Salvar Google Doc no Drive
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleExportToDrive(false)}
                    disabled={isExportingDrive}
                    className="px-3 py-2 border border-[#D6CEBE] text-xs font-mono hover:bg-[#F3EFE6] whitespace-nowrap"
                    title="Exportar como arquivo Markdown (.md)"
                  >
                    Salvar .MD
                  </button>
                </div>
              </div>

              {/* Drive Export Success Banner */}
              {driveExportSuccess && (
                <div className="p-3.5 bg-[#D8ECD8] border border-[#2A7A2A] text-xs font-mono text-[#184D18] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      Relatório salvo em <strong>01_Montagens_Zwischenraum/{driveExportSuccess.name}</strong>!
                    </span>
                  </div>
                  {driveExportSuccess.docUrl && (
                    <a
                      href={driveExportSuccess.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold flex items-center gap-1"
                    >
                      Abrir no Google Docs <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {driveExportError && (
                <div className="p-3 bg-[#F9E0E0] border border-[#9A3412] text-xs font-mono text-[#6E3209]">
                  {driveExportError}
                </div>
              )}

              {report.rawMarkdown ? (
                <div className="font-serif text-sm text-[#1C1917] whitespace-pre-wrap leading-relaxed">
                  {report.rawMarkdown}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 font-serif text-sm text-[#1C1917] leading-relaxed">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-1">
                      1. Problema
                    </h4>
                    <p>{report.problema}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-1">
                      2. Argumento
                    </h4>
                    <p>{report.argumento}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-1">
                      3. Evidências (Paradigma Indiciário & Sentido Produzido vs. Recebido)
                    </h4>
                    <p>{report.evidencias}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-1">
                      4. Lacunas & Silêncios do Corpus
                    </h4>
                    <p>{report.lacunas}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-[#9A3412] font-semibold mb-1">
                      5. Próximos Passos & Recorte Core / Apêndice
                    </h4>
                    <p>{report.proximosPassos}</p>
                  </div>
                  {report.referenciasAbnt && report.referenciasAbnt.length > 0 && (
                    <div className="border-t border-[#E5DEC9] pt-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-[#57534E] font-semibold mb-2">
                        Referências Mobilizadas (ABNT NBR 6023:2025)
                      </h4>
                      <ul className="space-y-1.5 text-xs font-mono text-[#292524]">
                        {report.referenciasAbnt.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {report.citations && report.citations.length > 0 && (
                <div className="border-t border-[#E5DEC9] pt-4">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#57534E] mb-2">
                    Fontes Verificadas via Google Search Grounding
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {report.citations.map((c, idx) => (
                      <a
                        key={idx}
                        href={c.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-[#1E3A8A] underline flex items-center gap-1"
                      >
                        {c.title || c.uri}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
