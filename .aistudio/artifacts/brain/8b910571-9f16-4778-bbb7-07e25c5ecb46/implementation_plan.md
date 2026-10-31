# Integração do Google Drive — Plataforma Iconocracia

Plano de arquitetura e integração da API do Google Drive na aplicação *"Iconocracia: Alegoria Feminina na História da Cultura Jurídica (séculos XIX–XX)"*, permitindo sincronização completa de relatórios Zwischenraum, fichas conceituais, notas iconológicas com gravuras e catálogo documental em uma pasta estruturada no Google Drive da pesquisadora.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> As decisões abaixo refletem as escolhas confirmadas na etapa de alinhamento e as diretrizes obrigatórias de segurança e OAuth da plataforma.

- **Decisão Confirmada 1 — Escopo da Integração**: Sincronização completa de relatórios, notas e arquivos de pesquisa.
- **Decisão Confirmada 2 — Organização no Google Drive**: Criação e manutenção de uma pasta dedicada na raiz do Drive do usuário intitulada `Iconocracia - Pesquisa de Tese (Ana Vanzin)`, com subpastas setoriais (`01_Montagens_Zwischenraum/`, `02_Fichas_e_Dossies/`, `03_Notas_Iconologicas_Peek/` e `04_Catalogo_e_Bibliografia/`), contendo arquivos em formato Google Docs nativo e Markdown acadêmico.
- **Decisão Confirmada 3 — Autenticação e Token (Least Privilege & Segurança)**:
  - Autenticação cliente via Firebase Auth (`signInWithPopup` com `GoogleAuthProvider`) utilizando as credenciais já provisionadas em `firebase-applet-config.json`.
  - Cache do token OAuth estritamente em memória (nunca em `localStorage` ou `sessionStorage`), com limpeza no logout.
  - Botão oficial padronizado *"Sign in with Google"* no cabeçalho e na gaveta do Drive.
- **Decisão Confirmada 4 — Proteção Obrigatória contra Operações Destrutivas**: Toda ação de exclusão, substituição ou movimentação de arquivos no Drive exige modal de confirmação explícito com detalhes dos itens afetados.

---

## 1. Overview & Core Concept

- **O que faz**:
  Permite que a pesquisadora conecte sua conta Google para sincronizar, arquivar e consultar diretamente no Google Drive todos os produtos intelectuais gerados na plataforma:
  1. **Exportação de Montagens Zwischenraum**: Salva relatórios analíticos comparativos (estruturados nas 5 seções acadêmicas: *Problema, Argumento, Evidências, Lacunas, Próximos passos*) diretamente como Google Docs editáveis ou arquivos Markdown.
  2. **Arquivamento de Fichas e Dossiês**: Exporta a ficha catalográfica e conceitual de qualquer obra ou operador do Glossário (com proveniência, regra de autoria e o perfil indiciário dos 10 indicadores de endurecimento).
  3. **Preservação de Notas Iconológicas (*Peek-a-Concept*)**: Salva excertos selecionados, comentários da IA e gravuras calcográficas geradas.
  4. **Navegador e Gestor de Arquivos do Drive da Tese**: Aba e painel modal para visualizar arquivos salvos, abrir diretamente no Google Docs/Drive em nova aba, carregar novos arquivos de pesquisa e monitorar a sincronização.
- **Público-alvo**: A pesquisadora e historiadores do direito trabalhando na tese de doutorado, assegurando persistência e interoperabilidade de dados entre a plataforma e o ecossistema Google Workspace.
- **Valor Principal**: Transforma a exploração visual e analítica (Constelação, Palco, Grade e Zwischenraum) em documentos de trabalho acadêmico prontos para redação, compartilhamento com orientadores e arquivo perene no Google Drive.

---

## 2. User Experience & Visual Design

### Fluxos Principais do Usuário

1. **Conexão e Autenticação com o Google**:
   - No topo da aplicação (ou dentro da nova aba/modal *Google Drive*), um indicador discreto exibe o estado de conexão: se desconectado, apresenta o botão oficial *"Sign in with Google"*; se conectado, exibe o avatar e e-mail do usuário com botão de desconexão.
2. **Exportar Relatório Zwischenraum para o Google Drive**:
   - No painel da montagem comparativa, após gerar o parecer em 5 seções, um botão primário *"Salvar no Google Drive"* permite escolher salvar como **Google Doc** ou **Arquivo Markdown**.
   - A aplicação localiza ou cria a pasta `Iconocracia - Pesquisa de Tese (Ana Vanzin)/01_Montagens_Zwischenraum/`, envia o arquivo formatado e exibe confirmação com link direto para abrir no Google Docs.
3. **Exportar Ficha Conceitual da Gaveta Lateral**:
   - Na *Ficha do Verbete/Obra*, um novo botão de ação *"Exportar Ficha para o Drive"* gera o dossiê documentado em `02_Fichas_e_Dossies/`.
4. **Navegador Dedicado de Arquivos do Drive**:
   - Uma visão integrada lista os arquivos da pasta de pesquisa com metadados (nome, data de modificação, tamanho, tipo de documento), busca interna e opções para abrir no Drive, fazer download ou excluir (com confirmação prévia).

### Identidade Visual & Diretrizes de Design

- **Alinhamento com o Estilo Editorial e de Museu**:
  - Superfícies em papel acolhedor (`#FBF9F5` e `#F3EFE6`), tipografia com serifa editorial `Cormorant Garamond` para títulos e `Source Serif 4` para prosa, combinadas com `Plus Jakarta Sans` para botões funcionais e `JetBrains Mono` para metadados e identificadores.
  - Botão oficial *"Sign in with Google"* estilizado segundo as diretrizes de identidade do Google (Material Design), respeitando as cores e o ícone SVG de quatro cores.
  - Zero pílulas estáticas em metadados: listagens de arquivos utilizam texto limpo com separadores tipográficos (`·`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Autenticação Cliente Direta via Firebase Auth com In-Memory Token Cache**
  - *Abordagem*: Inicialização do Firebase com `firebase-applet-config.json` já existente; o token de acesso OAuth é obtido via `signInWithPopup` com os escopos de Drive e mantido exclusivamente em variável de módulo em memória.
  - *Por quê*: Cumpre as diretrizes de segurança da plataforma, evita redirecionamentos de servidor que falhariam em URLs efêmeras de preview (`redirect_uri_mismatch`) e garante descarte seguro do token ao fechar ou deslogar.
  - *Alternativas Consideradas*: Fluxo server-side OAuth2 com refresh token (inviável no ambiente de preview da AI Studio devido a URLs dinâmicas).
- **Decisão 2: Estrutura Padronizada de Pastas Automática**
  - *Abordagem*: Na primeira exportação ou ao abrir a aba do Drive, a aplicação verifica via API se a pasta `Iconocracia - Pesquisa de Tese (Ana Vanzin)` já existe; se não existir, cria a pasta principal e suas 4 subpastas temáticas.
  - *Por quê*: Evita dispersar arquivos soltos na raiz do Drive da usuária e organiza o material por tipo documental da tese.
- **Decisão 3: Criação de Google Docs Nativos via MimeType `application/vnd.google-apps.document`**
  - *Abordagem*: Utiliza upload multipart/resumable da Google Drive API v3 convertendo texto HTML/Markdown para documento nativo do Docs, facilitando a edição imediata no navegador.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Top Bar (3-Zone Contract)                             │
│  [Iconocracia] ── [Constelação · Glossário · Regimes · Método · Drive] ──   │
│                                            [Google Auth Badge / Sign-In]     │
└───────────────┬──────────────────────────────────────────────┬───────────────┘
                │                                              │
                ▼                                              ▼
┌───────────────────────────────────────┐    ┌─────────────────────────────────┐
│        Google Drive Client SDK        │    │    Fichas & Montagem            │
│  (src/services/googleDriveService.ts) │    │  - FichaDrawerModal             │
│  - initAuth, signIn, signOut          │◄───┤  - ZwischenraumMontageModal     │
│  - getAccessToken (In-Memory Cache)   │    │  - SelectionPeekTooltip         │
│  - ensureThesisFolders()              │    └─────────────────────────────────┘
│  - uploadGoogleDoc() / uploadFile()   │                      │
│  - listThesisFiles() / deleteFile()   │                      │
└───────────────────┬───────────────────┘                      │
                    │                                          │
                    ▼ Bearer <token>                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                  Google Drive API v3 (drive.googleapis.com)                  │
│  - POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart│
│  - GET  https://www.googleapis.com/drive/v3/files                            │
│  - DELETE https://www.googleapis.com/drive/v3/files/{fileId}                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Componentes a Criar e Atualizar

1. **`src/services/googleDriveService.ts`**:
   - Inicializa Firebase com `firebase-applet-config.json`.
   - Gerencia autenticação (`initAuth`, `googleSignIn`, `googleSignOut`, `getAccessToken`).
   - Implementa chamadas da API do Google Drive v3:
     - `ensureThesisFolders()`: Localiza ou cria a pasta raiz e subpastas.
     - `exportMontageToDrive()`: Cria Google Doc ou Markdown com o parecer da montagem.
     - `exportFichaToDrive()`: Salva ficha catalográfica com os 10 indicadores de endurecimento.
     - `exportPeekNoteToDrive()`: Salva nota iconológica com imagem em anexo.
     - `listThesisFiles()`: Lista arquivos salvos na pasta da tese.
     - `deleteDriveFile()`: Exclui arquivo após confirmação.
2. **`src/components/DriveIntegrationPanel.tsx`**:
   - Interface visual da aba/modal do Google Drive, contendo:
     - Cartão de status da conexão e usuário autenticado.
     - Resumo de pastas da tese e atalho para abrir a pasta no Google Drive.
     - Lista interativa de documentos sincronizados com opções de visualização e abertura no Docs.
     - Diálogo de confirmação para exclusão de arquivos.
3. **Atualizações em `src/App.tsx`**:
   - Adição da aba `Google Drive` na barra de navegação e menu móvel.
   - Botão de status/login do Google no Top Bar.
4. **Atualizações em `src/components/ZwischenraumMontageModal.tsx`**:
   - Botão *"Exportar para o Google Drive"* após a geração do parecer em 5 seções.
5. **Atualizações em `src/components/FichaDrawerModal.tsx`**:
   - Botão *"Salvar Ficha no Google Drive"*.
6. **Atualizações em `src/components/SelectionPeekTooltip.tsx`**:
   - Botão de salvamento rápido da nota no Google Drive.
7. **Dependências**:
   - Instalação do pacote `firebase` no `package.json`.
