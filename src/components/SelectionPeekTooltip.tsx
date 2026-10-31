import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ConstellationNodeItem,
  generateArchivalEngravingSvg,
} from '../data/iconocracyData';
import { BookOpen, Sparkles, X } from 'lucide-react';

interface SelectionPeekTooltipProps {
  allNodes: ConstellationNodeItem[];
  onOpenNodeFicha: (node: ConstellationNodeItem) => void;
}

interface PeekResult {
  explanation: string;
  epistemicStatus: string;
  provenanceNote: string;
  abntRef: string;
  imageUrl: string | null;
}

export const SelectionPeekTooltip: React.FC<SelectionPeekTooltipProps> = ({
  allNodes,
  onOpenNodeFicha,
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'DONE'>('IDLE');
  const [result, setResult] = useState<PeekResult | null>(null);
  const [matchedNode, setMatchedNode] = useState<ConstellationNodeItem | null>(
    null
  );
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;

    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        return;
      }

      const text = sel.toString().trim();
      // Trigger on meaningful selections between 3 and 220 characters
      if (text.length < 3 || text.length > 220) {
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const clampedX = Math.min(
          Math.max(rect.left + rect.width / 2, 190),
          window.innerWidth - 210
        );
        const clampedY = Math.min(
          Math.max(rect.bottom + 12, 80),
          window.innerHeight - 360
        );

        setAnchorPos({ x: clampedX, y: clampedY });
        setSelectedText(text);

        // Check if selection matches a canonical Glossary entry
        const norm = text.toLowerCase();
        const found =
          allNodes.find(
            (n) =>
              n.title.toLowerCase().includes(norm) ||
              norm.includes(n.title.toLowerCase().split('(')[0].trim())
          ) || null;
        setMatchedNode(found);

        setStatus('LOADING');
        fetch('/api/iconocracy/peek', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: text,
            contextTitle: found?.title,
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.error) {
              // Fallback to canonical glossary entry if available
              setResult({
                explanation:
                  found?.definition ||
                  `Operador do vocabulário controlado da tese Iconocracia aplicado à leitura de "${text}".`,
                epistemicStatus: found?.categoryLabel || 'Leitura Indiciária',
                provenanceNote:
                  found?.provenanceNote ||
                  'Distinguir sentido produzido pelo dispositivo estatal de sentido recebido.',
                abntRef: found?.abntKeys.join(', ') || 'VANZIN, 2026',
                imageUrl: null,
              });
            } else {
              setResult(data);
            }
            setStatus('DONE');
          })
          .catch(() => {
            setResult({
              explanation:
                found?.definition ||
                `Conceito mobilizado no recorte jurídico-iconográfico da tese para "${text}".`,
              epistemicStatus: found?.categoryLabel || 'Vocabulário da Tese',
              provenanceNote:
                found?.provenanceNote ||
                'Regime iconocrático (séculos XIX–XX).',
              abntRef: found?.abntKeys.join(', ') || 'VANZIN, 2026',
              imageUrl: null,
            });
            setStatus('DONE');
          });
      }, 450);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      clearTimeout(debounceTimer);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [allNodes]);

  if (status === 'IDLE' || !selectedText) return null;

  const fallbackEngraving = generateArchivalEngravingSvg(
    matchedNode?.title || selectedText,
    result?.epistemicStatus || 'GLOSSÁRIO ICONOCRACIA',
    matchedNode?.archetype || 'scales_justitia'
  );

  const displayImage = result?.imageUrl || fallbackEngraving;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.16 }}
        style={{
          left: anchorPos.x,
          top: anchorPos.y,
          transform: 'translateX(-50%)',
        }}
        className="fixed z-50 w-[350px] sm:w-[380px] bg-[#181614] text-[#FBF9F5] border border-[#9A8A2A] shadow-2xl p-4 pointer-events-auto"
      >
        <div className="flex items-start justify-between gap-2 border-b border-[#292524] pb-2.5 mb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6CEBE] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#9A8A2A]" />
              Nota Iconológica & Gravura Contextual
            </span>
            <h4 className="font-display text-lg font-semibold text-white line-clamp-1 mt-0.5">
              “{selectedText}”
            </h4>
          </div>
          <button
            onClick={() => {
              setStatus('IDLE');
              setSelectedText('');
              window.getSelection()?.removeAllRanges();
            }}
            className="text-[#A8A29E] hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {status === 'LOADING' ? (
          <div className="space-y-3 py-2">
            <div className="text-xs font-mono text-[#D6CEBE]">
              Consultando Glossário Canônico & gerando gravura alegórica...
            </div>
            <div className="h-3 bg-[#292524] w-11/12" />
            <div className="h-3 bg-[#292524] w-4/5" />
            <div className="w-full h-36 bg-[#292524] border border-[#38332E] flex items-center justify-center font-mono text-xs text-[#A8A29E]">
              Cunhando prancha calcográfica...
            </div>
          </div>
        ) : (
          result && (
            <div className="space-y-3">
              <div className="text-[11px] font-mono text-[#9A8A2A]">
                {result.epistemicStatus} · {result.abntRef}
              </div>

              <p className="font-serif text-xs text-[#F5F1E8] leading-relaxed">
                {result.explanation}
              </p>

              <p className="font-mono text-[10px] text-[#A8A29E] border-t border-[#292524] pt-2">
                {result.provenanceNote}
              </p>

              <div className="w-full h-40 bg-[#F5F1E8] border border-[#38332E] overflow-hidden flex items-center justify-center">
                <img
                  src={displayImage}
                  alt={`Gravura contextual para ${selectedText}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              {matchedNode && (
                <button
                  onClick={() => {
                    onOpenNodeFicha(matchedNode);
                    setStatus('IDLE');
                  }}
                  className="w-full py-1.5 bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Abrir Ficha Canônica: {matchedNode.title}
                </button>
              )}
            </div>
          )
        )}
      </motion.div>
    </AnimatePresence>
  );
};
