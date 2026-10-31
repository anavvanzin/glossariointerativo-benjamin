import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const THESIS_SYSTEM_INSTRUCTION = `Você é orientadora sênior de tese em História do Direito, cultura visual jurídica, teoria feminista e história constitucional comparada, especialista na tese "Iconocracia: Alegoria Feminina na História da Cultura Jurídica (séculos XIX–XX)" de Ana Vanzin.

REGRAS TERMINOLÓGICAS E METODOLÓGICAS INEGOCIÁVEIS (DEC-2026-07-29-APARATO-MINIMO):
1. Use SEMPRE o vocabulário estável da tese:
   - iconocracia / regime iconocrático (FUNDACIONAL, NORMATIVO, MILITAR, CONTRA-ALEGORIA)
   - alegoria feminina / personificação feminina
   - reconhecimento sem reciprocidade
   - feminilidade de Estado (raízes: Legendre + Anne Carson / hystéra; NÃO atribuir a Mondzain)
   - Contrato Sexual Visual (autoral #1; extensão visual de Pateman 1988)
   - Contrato Racial Visual (autoral #3; branquitude constitutiva e transferência transatlântica)
   - Purificação Clássica (autoral #4; matriz primária: Kantorowicz, Legendre, Hespanha; extensão ferramental: Latour 1991, Haraway 1985, Descola 2021; NUNCA usar o termo proibido "ciberfeminismo" nem "purificação iconocrática")
   - endurecimento (operacionalização empírica da Purificação Clássica em 10 indicadores ordinais 0–3; NUNCA usar "hardening" nem "embrutecimento", e NUNCA somar os 10 indicadores em um score agregado, pois o campo endurecimento_score foi removido em 2026-09-24)
   - acoplamento imagem-norma / pintura de alma / visiocracia (Goodrich 2013)
   - iconoclasmo / conflito de imagens
   - corpus core (1800–2000) / comparador / apêndice
   - iconografia / iconologia (sentido panofskiano: níveis I, II, III; Iconclass 44 e 11M44; lembre-se que 48C51 na API oficial do Iconclass é apenas 'painting', não iconografia feminista)
   - léxico warburguiano em alemão: Pathosformel, Nachleben, Zwischenraum, Denkraum, Mnemosyne / Bilderatlas
   - método da Constelação em diálogo com Walter Benjamin (Ursprung des deutschen Trauerspiels, 'Idee als Konfiguration') e Sigrid Weigel (Body- and Image-Space, 1996 / ed. eletrônica Taylor & Francis 2005, pp. viii–ix, 58, 92–93).

2. NUNCA fabrique autores, obras, arquivos ou dados. Diferencie citação direta, tradução minha e interpretação minha.
3. Distinga sempre sentido PRODUZIDO pelo dispositivo estatal de sentido RECEBIDO pelo espectador histórico.
4. NUNCA proponha kappa, alfa de Krippendorff/Cronbach, teste-reteste, análise fatorial ou índice agregado de atributos. O corpus opera sob PARADIGMA INDICIÁRIO (Morelli–Ginzburg).
5. Responda sempre em português claro, rigoroso e denso.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Endpoint 1: Peek-a-Concept Tooltip (Text Explanation + Optional Allegorical Engraving)
  app.post('/api/iconocracy/peek', async (req, res) => {
    try {
      const { prompt, contextTitle } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Texto selecionado é obrigatório.' });
      }

      const cleanPrompt = prompt.trim().slice(0, 350);

      // Run text explanation with gemini-3.8-flash and attempt image generation with gemini-3.1-flash-lite-image in parallel
      const textPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Analise o termo ou trecho selecionado: "${cleanPrompt}"${contextTitle ? ` (no contexto de "${contextTitle}")` : ''} à luz do Glossário e da metodologia da tese "Iconocracia: Alegoria Feminina na História da Cultura Jurídica (séculos XIX–XX)".`,
        config: {
          systemInstruction:
            THESIS_SYSTEM_INSTRUCTION +
            `\nRetorne um objeto JSON conciso com:
- "explanation": síntese densa de 2 a 4 frases situando o termo na tese (máx. 420 caracteres).
- "epistemicStatus": categoria epistêmica ("Conceito Autoral", "Conceito Mobilizado", "Instrumento Operacional", "Alegoria Nacional", "Léxico Warburguiano", "Interlocutor Teórico" ou "Leitura Indiciária").
- "provenanceNote": nota curta de autoria/proveniência ou distinção sentido produzido vs. recebido (1 frase).
- "abntRef": referência bibliográfica curta ou chave BibTeX pertinente (ex.: "PATEMAN, 1988 (@pateman1988)" ou "WARBURG, 2000 (@warburg2000)").`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              epistemicStatus: { type: Type.STRING },
              provenanceNote: { type: Type.STRING },
              abntRef: { type: Type.STRING },
            },
            required: ['explanation', 'epistemicStatus', 'provenanceNote', 'abntRef'],
          },
        },
      });

      const imagePromise = ai.models
        .generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                text: `Neoclassical 19th-century copperplate legal engraving and archival museum etching illustrating the historical-legal allegory or concept: "${cleanPrompt}". High-contrast intaglio print lines on aged warm ivory rag paper, architectural or numismatic framing, classical drapery, scales or fasces motifs, Aby Warburg Mnemosyne archival plate aesthetic, no modern text.`,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: '1:1',
              imageSize: '1K',
            },
          },
        })
        .catch((imgErr) => {
          console.warn('Optional image generation fallback triggered:', imgErr?.message || imgErr);
          return null;
        });

      const [textResponse, imageResponse] = await Promise.all([textPromise, imagePromise]);

      let parsedText = {
        explanation:
          textResponse.text ||
          'Operador analítico situado no regime iconocrático de acoplamento entre imagem alegórica e norma estatal.',
        epistemicStatus: 'Leitura Indiciária',
        provenanceNote: 'Sentido produzido pelo dispositivo estatal (interpretação minha).',
        abntRef: 'VANZIN, 2026 (Glossário Iconocracia)',
      };

      try {
        if (textResponse.text) {
          parsedText = JSON.parse(textResponse.text.trim());
        }
      } catch {
        // Keep fallback object with raw text
      }

      let imageUrl: string | null = null;
      const parts = imageResponse?.candidates?.[0]?.content?.parts;
      if (Array.isArray(parts)) {
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      return res.json({
        ...parsedText,
        imageUrl,
      });
    } catch (error: any) {
      console.error('Peek API error:', error);
      return res.status(500).json({
        error: error.message || 'Erro ao consultar o motor iconológico.',
      });
    }
  });

  // Endpoint 2: Zwischenraum Comparative Montage Generator (5 Academic Sections + Google Search Grounding)
  app.post('/api/iconocracy/zwischenraum', async (req, res) => {
    try {
      const { items, researchQuestion, useSearchGrounding } = req.body;
      if (!Array.isArray(items) || items.length < 2) {
        return res.status(400).json({
          error: 'Selecione ao menos 2 estrelas/nós da Constelação para compor um painel Zwischenraum.',
        });
      }

      const itemsSummary = items
        .map(
          (it: any, idx: number) =>
            `${idx + 1}. [${it.id}] ${it.title} (${it.categoryLabel}, Regime: ${it.regime || 'Transversal'}, País/Origem: ${it.country || 'Transnacional'}, Suporte: ${it.support || 'Conceitual'}): ${it.definition}`
        )
        .join('\n');

      const promptText = `Construa uma leitura comparativa de montagem autoral (Zwischenraum Panel / Constelação benjaminiana) articulando os seguintes elementos selecionados no acervo:

${itemsSummary}

Pergunta norteadora da montagem: "${researchQuestion || 'Como o acoplamento imagem-norma e a Purificação Clássica operam no intervalo (Zwischenraum) entre estes elementos?'}"

Siga OBRIGATORIAMENTE as 5 seções de entregável acadêmico da tese:
1. Problema (delimitação da pergunta e do suporte material/função jurídico-política)
2. Argumento (articulação conceitual usando o vocabulário estável: Purificação Clássica, feminilidade de Estado, reconhecimento sem reciprocidade, Contrato Sexual/Racial Visual, endurecimento como perfil ordinal sem soma)
3. Evidências (indícios visuais sob paradigma indiciário Morelli-Ginzburg, distinguindo sentido produzido pelo dispositivo estatal de sentido recebido pelo espectador histórico; semelhança isolada não prova transmissão histórica)
4. Lacunas (silêncios do corpus: distinção entre ausência substantiva e ausência de coleta, incertezas documentais e marcador #verificar quando aplicável)
5. Próximos passos (recomendações de recorte entre corpus core 1800–2000 e comparador/apêndice, mais referências em formato ABNT NBR 6023:2025).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: THESIS_SYSTEM_INSTRUCTION,
          ...(useSearchGrounding
            ? {
                tools: [{ googleSearch: {} }],
              }
            : {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    problema: { type: Type.STRING },
                    argumento: { type: Type.STRING },
                    evidencias: { type: Type.STRING },
                    lacunas: { type: Type.STRING },
                    proximosPassos: { type: Type.STRING },
                    referenciasAbnt: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: [
                    'problema',
                    'argumento',
                    'evidencias',
                    'lacunas',
                    'proximosPassos',
                    'referenciasAbnt',
                  ],
                },
              }),
        },
      });

      const groundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const citations = groundingChunks
        .map((c: any) => c.web)
        .filter(Boolean)
        .map((w: any) => ({ title: w.title, uri: w.uri }));

      if (!useSearchGrounding && response.text) {
        try {
          const parsed = JSON.parse(response.text.trim());
          return res.json({ ...parsed, citations });
        } catch {
          // fall through to text parsing
        }
      }

      return res.json({
        rawMarkdown: response.text || '',
        citations,
      });
    } catch (error: any) {
      console.error('Zwischenraum API error:', error);
      return res.status(500).json({
        error: error.message || 'Falha ao gerar a análise comparativa Zwischenraum.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
