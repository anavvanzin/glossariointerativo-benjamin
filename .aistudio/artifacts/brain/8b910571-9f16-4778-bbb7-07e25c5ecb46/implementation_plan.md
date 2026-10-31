# Iconocracia — Constelação 3D & Glossário Interativo da Tese

Uma plataforma de navegação conceitual e visual para a tese *"Iconocracia: Alegoria Feminina na História da Cultura Jurídica (séculos XIX–XX)"* (Ana Vanzin), articulando a **Constelação 3D** como entrada principal do acervo (em diálogo com Walter Benjamin, Sigrid Weigel e o *Bilderatlas Mnemosyne* de Aby Warburg) com o **Glossário Canônico** e um **Tooltip Interativo de Leitura** que gera instantaneamente notas iconológicas e gravuras contextuais ao selecionar qualquer termo ou passagem.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> As decisões abaixo consolidam suas respostas na etapa de alinhamento e estabelecem as regras metodológicas inegociáveis da tese (`DEC-2026-07-29-APARATO-MINIMO` e `Glossario.md`).

- **Decisão Confirmada 1 — Experiência Principal (`Constelação 3D + Glossário Interativo`)**: A entrada principal apresenta a **Constelação** (com alternância imediata para **Palco** e **Grade**, conforme `constellation-method.md`) articulada ao **Glossário Completo** da tese (Conceitos Autorais, Mobilizados, Operacionais, Alegorias Nacionais, Léxico Warburguiano, Interlocutores e Referências ABNT NBR 6023:2025).
- **Decisão Confirmada 2 — Navegação Espacial (`Three.js: Constelação, Palco e Grade`)**: O campo tridimensional distribui os nós de conceitos e obras do corpus por regra estável ligada ao ID, sem hierarquizar relevância científica por tamanho ou moldura, permitindo abrir a ficha documental sobre o campo e retornar o foco ao objeto ao fechá-la, além de compor painéis comparativos (*Zwischenraum*).
- **Decisão Confirmada 3 — Inteligência Artificial (`Tooltip Visual ao Selecionar Texto`)**: Selecionar qualquer palavra, expressão ou passagem nos verbetes do Glossário, nas fichas ou nos textos metodológicos aciona um tooltip flutuante que consulta o servidor Gemini (`/api/generate-image` e `/api/explain-term`) para produzir uma síntese rigorosa no vocabulário estável da tese acompanhada de uma gravura/ilustração alegórica gerada sob demanda.
- **Decisão Confirmada 4 — Escopo Estrito em História do Direito e Iconocracia**: Foco 100% dedicado à tese *Iconocracia* (janela 1800–2000, suportes forenses/estatais, separação explícita entre *corpus core* e *comparador/apêndice*, vedação absoluta a métricas psicométricas de análise de conteúdo ou uso do termo proibido "ciberfeminismo").

---

## 1. Overview & Core Concept

- **O que a aplicação faz**:
  1. **Entrada Principal `/acervo` em Constelação 3D (Three.js)**: Um espaço tridimensional inspirado nos painéis negros do *Bilderatlas Mnemosyne* e na *Idee als Konfiguration* de Walter Benjamin, onde cada estrela/nó materializa um verbete do Glossário ou um objeto exemplar do corpus (moeda, selo, monumento, arquitetura forense, estampa, frontispício, papel-moeda, cartaz).
  2. **Três Modos de Inspeção (`Constelação` · `Palco` · `Grade`)**:
     - **Constelação** (primeiro botão e padrão): Grafo espacial 3D onde conexões genealógicas e operacionais (ex.: *Purificação Clássica* → *Endurecimento* e *Contrato Sexual Visual*; matrizes de Kantorowicz, Legendre, Hespanha e extensão ferramental Latour, Haraway, Descola) são visíveis como fios luminosos discretos.
     - **Palco**: Inspeção em câmera aproximada do artefato ou conceito selecionado em modelo procedural 3D composto (3–12 partes em `THREE.Group`: ex. balança/espada/venda de *Justitia*, moeda/medalha republicana cunhada em relevo, coluna/frontão forense, estela monumental) com iluminação PBR de estúdio e os **10 indicadores de endurecimento (escala ordinal 0–3, sem soma)**.
     - **Grade**: Catálogo documentado de leitura comparativa e filtragem por categoria epistêmica (`Autoral`, `Mobilizado`, `Operacional`, `Alegoria`, `Interlocutor`), regime iconocrático (`FUNDACIONAL`, `NORMATIVO`, `MILITAR`, `CONTRA-ALEGORIA`) e país (`FR`, `UK`, `DE`, `US`, `BE`, `BR`, mais nota para `AT`, `NL`, `DK`, `ES`).
  3. **Montagem Autoral (*Zwischenraum Panel*)**: Permite selecionar dois ou mais nós/obras da Constelação para abrir uma prancha comparativa lado a lado, explicitando a pergunta de pesquisa, o suporte material, a função jurídico-política, a distinção entre sentido *produzido* pelo dispositivo estatal e sentido *recebido*, e os silêncios do corpus.
  4. **Leitura Interativa com Tooltip Gerador (Explicação + Gravura)**: Ao selecionar qualquer trecho de texto em qualquer verbete ou documento, um tooltip editorial flutuante apresenta instantaneamente uma nota analítica fundamentada no glossário da tese e uma imagem em estilo calcográfico/gravura histórica gerada via Gemini no servidor.

---

## 2. User Experience & Visual Design

- **Fluxos Principais do Usuário**:
  1. **Abertura na Constelação (`/acervo`)**: O usuário ingressa diretamente no campo relacional 3D (ou aciona o CTA principal da apresentação editorial). O dock inferior retrátil oferece busca instantânea, filtros de estatuto epistêmico e alternância suave (`Constelação` | `Palco` | `Grade`).
  2. **Inspeção de Ficha e Retorno de Foco**: Clicar em um nó 3D desliza suavemente a câmera amortecida até o objeto e abre a ficha lateral/sobreposta com: selo de categoria (`Autoral`, `Mobilizado`, `Operacional`, `Alegoria`, `Interlocutor`), definição completa, caixa de proveniência/autoria (preservando a regra não-negociável dos 4 conceitos autorais), inventário verbal dos 10 indicadores de endurecimento (0–3) e citações ABNT NBR 6023:2025 (`@chave`). Fechar a ficha devolve o foco exatamente à obra no campo.
  3. **Destaque de Texto (Peek-a-Concept Tooltip)**: No modo Glossário Editorial ou dentro de qualquer ficha/dossiê (incluindo o texto integral de *Constelação como entrada principal do acervo* e o aviso de verificação do código Iconclass `48C51` vs `44` e `11M44`), selecionar qualquer palavra ou frase dispara o tooltip flutuante com loader gráfico e retorna a nota conceitual + gravura gerada.
  4. **Montagem *Zwischenraum***: O usuário fixa até 3 itens na barra de montagem para inspecionar o intervalo (*Zwischenraum*) entre imagens e conceitos, registrando a pergunta comparativa e exportando a ficha em formato acadêmico (Problema / Argumento / Evidências / Lacunas / Próximos passos).

- **Identidade Visual & Tema (Museu / Arquivo Editorial & Espaço Mnemosyne)**:
  - *Direção Estética*: Dupla camada — os painéis do **Atlas/Constelação 3D** evocam o tecido negro profundo das pranchas de Aby Warburg (`#0C0B0A`), enquanto o **Glossário e Fichas Documentais** seguem o padrão *Archival Warm Paper* (`#FBF9F5` / `#F5F1E8`) com texto carvão antigo (`#1C1917`) e divisórias fio-de-cabelo (`1px solid #E5DEC9`).
  - *Paleta dos Regimes Iconocráticos (conforme `Glossario.md`)*:
    - **FUNDACIONAL** (sacrificial · corpo vivo): Terracota suave (`#F9E0E0` / acento `#B5651D`)
    - **NORMATIVO** (domesticado · burocrático): Pergaminho dourado (`#F5F0D0` / acento `#9A8A2A`)
    - **MILITAR** (endurecido · imperial): Ardósia férrea (`#D8D8E8` / acento `#444466`)
    - **CONTRA-ALEGORIA** (contestado · subversão): Verde musgo documental (`#D8ECD8` / acento `#2A7A2A`)
  - *Tipografia (Regra 2+1)*:
    - **Display / Títulos**: `Cormorant Garamond` (serifa editorial de alto contraste para cabeçalhos de verbetes, pranchas e títulos).
    - **Prosa / Leitura Longa**: `Source Serif 4` e `Plus Jakarta Sans` (medida de 65–75 caracteres por linha, entrelinha 1.75).
    - **Metadados, Códigos Iconclass & Indicadores Ordinais (0–3)**: `JetBrains Mono` com `tabular-nums`.
  - *Disciplina Anti-Slop e Top Bar Contract*:
    - Barra superior estrita em 3 zonas (`Iconocracia` wordmark — links de navegação em linha única: `Constelação`, `Glossário`, `Regimes & Endurecimento`, `Método Benjamin-Weigel`, `Referências ABNT` — 1 ação primária: `Nova Montagem`).
    - Zero pílulas estáticas em metadados (uso de separadores tipográficos `·` e `/`) e controle inferior retrátil no viewport 3D sem `backdrop-filter` sobre o canvas WebGL ativo.

---

## 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Preservação Rigorosa do Aparato Metodológico (`DEC-2026-07-29-APARATO-MINIMO` & `2026-09-24`)**
  - *Abordagem Escolhida*: Os 10 indicadores de endurecimento (`desincorporação`, `rigidez_postural`, `dessexualização`, `uniformização_facial`, `heraldicização`, `enquadramento_arquitetônico`, `apagamento_narrativo`, `monocromatização`, `serialidade`, `inscrição_estatal`) são exibidos como **inventário verbal e perfil ordinal (0–3)** em gráfico de barras/perfil individualizado, **nunca somados** em um `endurecimento_score` agregado.
  - *Por quê*: Cumpre estritamente a decisão metodológica de 2026-09-24 registrada no Glossário e o paradigma indiciário (Morelli–Ginzburg).
- **Decisão 2: Regra de Posição Estável na Constelação 3D**
  - *Abordagem Escolhida*: A posição espacial `(x, y, z)` de cada nó na Constelação é calculada por uma função hash determinística sobre o `id` canônico do verbete/obra, e todos os nós compartilham escala e moldura neutras idênticas.
  - *Por quê*: Respeita a diretriz de `constellation-method.md` ("Posição, tamanho e moldura não representam relevância científica, aprovação ou intensidade de uma relação").
- **Decisão 3: Chamadas Gemini 100% Server-Side com Vocabulário Estável**
  - *Abordagem Escolhida*: Remoção de qualquer fluxo legado `window.aistudio.openSelectKey` no cliente; todas as chamadas ao SDK `@google/genai` ocorrem em `server.ts` usando `gemini-3.8-flash` (com `googleSearch` opcional para cotejo bibliográfico e instrução de sistema ancorada no Glossário de Iconocracia) e `gemini-3.1-flash-lite-image` para gerar gravuras alegóricas no tooltip de seleção de texto.
  - *Por quê*: Garante segurança da chave, aderência estrita ao vocabulário controlado da tese e ausência de alucinação de autores ou conceitos.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Top Bar (3-Zone Contract)                             │
│  [Iconocracia]  ──  [Constelação · Glossário · Regimes · Método · ABNT] ──   │
│                                                       [Montagem Zwischenraum]│
└───────────────┬──────────────────────────────────────────────┬───────────────┘
                │                                              │
                ▼                                              ▼
┌───────────────────────────────────────┐    ┌─────────────────────────────────┐
│   Viewport Principal (/acervo)        │    │  Painel Documental & Leitura    │
│  ┌─────────────────────────────────┐  │    │  ┌───────────────────────────┐  │
│  │ Three.js Canvas (Isolado useRef)│  │    │  │ Ficha do Verbete / Obra   │  │
│  │ - Modo 1: Constelação (Grafo 3D)│  │◄──►│  │ - Categoria & Proveniência│  │
│  │ - Modo 2: Palco (3-12 part PBR) │  │    │  │ - Perfil 10 Indicadores   │  │
│  │ - Modo 3: Grade (Catálogo)      │  │    │  │ - Distinção Core/Apêndice │  │
│  └─────────────────────────────────┘  │    │  └───────────────────────────┘  │
│  ┌─────────────────────────────────┐  │    │  ┌───────────────────────────┐  │
│  │ Dock Inferior Retrátil (Zen)    │  │    │  │ Montagem Zwischenraum     │  │
│  │ [Constelação | Palco | Grade]   │  │    │  │ - Comparação de Objetos   │  │
│  │ Filtros · Busca · Câmara Reset  │  │    │  │ - Relatório 5 Seções      │  │
│  └─────────────────────────────────┘  │    └───────────────┬─────────────────┘
└───────────────────────────────────────┘                    │
                                                             ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│           Selection Tooltip Engine (Qualquer Texto Selecionado)              │
│  - Detecta window.getSelection() em verbetes, fichas e documento metodológico│
│  - Renderiza Tooltip Flutuante (Desktop) / Bottom Sheet (Mobile)             │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        │ POST /api/iconocracy/peek
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     Express Backend (server.ts)                              │
│  - POST /api/iconocracy/peek:                                                │
│      1. gemini-3.8-flash: Nota analítica com vocabulário estável da tese     │
│      2. gemini-3.1-flash-lite-image: Gravura alegórica contextual (1:1)      │
│  - POST /api/iconocracy/zwischenraum:                                        │
│      1. gemini-3.8-flash (com googleSearch): Síntese comparativa estruturada │
│         (Problema / Argumento / Evidências / Lacunas / Próximos passos)      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **`GlossaryEntry` (Base Canônica Completa)**:
  - Contém todos os verbetes de `Glossario_9ed50eeb.md`:
    - **Conceitos Autorais (8)**: *Contrato Sexual Visual*, *Feminilidade de Estado*, *Contrato Racial Visual*, *Purificação Clássica*, *Endurecimento*, *Regime Iconocrático*, *Acoplamento imagem-norma*, *Pintura de alma*.
    - **Conceitos Mobilizados (2 + Léxico Warburguiano 5)**: *Iconocracia* (Mondzain 2002), *Visiocracia* (Goodrich 2013), *Pathosformel*, *Nachleben*, *Zwischenraum*, *Denkraum*, *Mnemosyne / Bilderatlas*.
    - **Aparato Operacional**: *Três Regimes Iconocráticos (+ Contra-Alegoria)*, *10 Indicadores de Endurecimento (0–3)*, *Critérios de Inclusão no Corpus*, *Níveis de Panofsky (I, II, III)*, *Iconclass (`44`, `11M44`, e alerta crítico sobre `48C51`)*, *Colonialidade do ver*, *Ausência alegórica*, *Suporte*.
    - **Alegorias Nacionais (7 matrizes)**: França (*Marianne / La République, La Liberté, La Justice*), Reino Unido (*Britannia, Justice, Hibernia, Scotia*), Alemanha (*Germania, Justitia, Minerva* — Niederwald 1883), EUA (*Columbia, Lady Liberty, Lady Justice, America*), Bélgica (*La Belgique*), Brasil (*A República, A Justiça* — 1889), e *Justitia / Lady Justice* transnacional.
    - **Interlocutores Teóricos (12)**: Kantorowicz (1957), Legendre (1974/1994), Hespanha (2005), Pateman (1988), Mondzain (2002), Carson (1990), Latour (1991), Haraway (1985), Descola (2021), Goodrich (2013), Agulhon (1979/1989), Resnik & Curtis (2011), mais Benjamin (1928) e Weigel (1996/2005) do documento de Constelação.
- **`CorpusExemplar` (Objetos do Campo `/acervo`)**:
  - Casos documentados do *corpus core* (1800–2000) e itens marcados como *comparador/apêndice*, com ID estável, suporte material, datação, país, regime iconocrático, perfil nos 10 indicadores ordinais (0–3), códigos Iconclass (`44`, `11M44`), proveniência institucional e links para o *Companion*, *Atlas* e *GitHub Corpus*.

### Interactive Component & State Mapping

- **Sincronização URL & Foco (`constellation-method.md`)**:
  - Suporte a parâmetros de consulta (`?mode=constelacao|palco|grade&item=<id>`) para que links diretos abram o modo ou a ficha correspondente e, ao fechar a ficha, o foco retorne ao nó no campo 3D.
- **Modelos Procedurais 3D (`THREE.Group` de 3–12 partes no Modo Palco & Constelação)**:
  - Cada nó/artefato no Three.js é construído proceduralmente com geometrias compostas (`LatheGeometry`, `ExtrudeGeometry`, `TubeGeometry`, `CylinderGeometry`) e materiais PBR (`MeshStandardMaterial` / `MeshPhysicalMaterial` com `RoomEnvironment` PMREM, luz-chave direcional quente e preenchimento `HemisphereLight` frio), representando suportes jurídicos (moeda cunhada, selo emoldurado, balança e espada de *Justitia*, busto republicano com barrete frígio, frontão forense, prancha *Mnemosyne*).
- **Tooltip de Seleção de Texto (`Peek-a-Concept`)**:
  - Ao selecionar qualquer texto na interface, caso o termo corresponda diretamente a um verbete do Glossário, exibe imediatamente os metadados canônicos enquanto busca em `/api/iconocracy/peek` a síntese contextualizada e a gravura alegórica gerada por IA.
