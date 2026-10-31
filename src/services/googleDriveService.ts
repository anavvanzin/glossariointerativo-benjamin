import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ConstellationNodeItem, HARDENING_INDICATORS } from '../data/iconocracyData';

// Initialize Firebase App safely (singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Workspace Drive scopes as configured
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory token cache (NEVER stored in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  iconLink?: string;
  subfolder?: string;
}

export interface DriveQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
}

export interface FolderStructure {
  rootFolderId: string;
  subfolders: {
    montagens: string;
    fichas: string;
    notas: string;
    catalogo: string;
  };
}

let cachedFolders: FolderStructure | null = null;

// Auth listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not yet retrieved or expired
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      cachedFolders = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Falha ao obter o token de acesso do Google.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Erro na autenticação com o Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  cachedFolders = null;
};

/**
 * Ensures the dedicated thesis folder hierarchy exists in the user's Google Drive:
 * "Iconocracia - Pesquisa de Tese (Ana Vanzin)/"
 *   ├── "01_Montagens_Zwischenraum/"
 *   ├── "02_Fichas_e_Dossies/"
 *   ├── "03_Notas_Iconologicas_Peek/"
 *   └── "04_Catalogo_e_Bibliografia/"
 */
export async function ensureThesisFolders(token: string): Promise<FolderStructure> {
  if (cachedFolders) {
    return cachedFolders;
  }

  const rootName = 'Iconocracia - Pesquisa de Tese (Ana Vanzin)';

  // 1. Search for existing root folder
  const searchRootRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      `name = '${rootName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    )}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const searchRootData = await searchRootRes.json();
  let rootFolderId = searchRootData.files?.[0]?.id;

  // Create root folder if not found
  if (!rootFolderId) {
    const createRootRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: rootName,
        mimeType: 'application/vnd.google-apps.folder',
        description:
          'Pasta estruturada de pesquisa da tese Iconocracia: Alegoria Feminina na História da Cultura Jurídica (séculos XIX–XX), por Ana Vanzin.',
      }),
    });
    const createdRoot = await createRootRes.json();
    rootFolderId = createdRoot.id;
  }

  // 2. Ensure subfolders exist inside root
  const subfolderNames = {
    montagens: '01_Montagens_Zwischenraum',
    fichas: '02_Fichas_e_Dossies',
    notas: '03_Notas_Iconologicas_Peek',
    catalogo: '04_Catalogo_e_Bibliografia',
  };

  const subfolderIds: Record<string, string> = {};

  for (const [key, name] of Object.entries(subfolderNames)) {
    const searchSubRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        `name = '${name}' and '${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
      )}&fields=files(id,name)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const searchSubData = await searchSubRes.json();
    let subId = searchSubData.files?.[0]?.id;

    if (!subId) {
      const createSubRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [rootFolderId],
        }),
      });
      const createdSub = await createSubRes.json();
      subId = createdSub.id;
    }
    subfolderIds[key] = subId;
  }

  cachedFolders = {
    rootFolderId,
    subfolders: {
      montagens: subfolderIds.montagens,
      fichas: subfolderIds.fichas,
      notas: subfolderIds.notas,
      catalogo: subfolderIds.catalogo,
    },
  };

  return cachedFolders;
}

/**
 * Creates a file in Google Drive using multipart upload.
 * If asGoogleDoc is true, converts HTML to an editable Google Doc.
 */
export async function uploadDriveFile({
  token,
  folderId,
  fileName,
  content,
  contentType,
  asGoogleDoc = false,
  description = '',
}: {
  token: string;
  folderId: string;
  fileName: string;
  content: string;
  contentType: string;
  asGoogleDoc?: boolean;
  description?: string;
}): Promise<DriveFileItem> {
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    parents: [folderId],
    description,
    ...(asGoogleDoc ? { mimeType: 'application/vnd.google-apps.document' } : {}),
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${contentType}; charset=UTF-8\r\n\r\n` +
    content +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,createdTime,modifiedTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Falha no upload para o Google Drive: ${errorText}`);
  }

  return await res.json();
}

/**
 * Exports a Zwischenraum comparative montage report directly into the thesis folder.
 */
export async function exportMontageToDrive({
  token,
  question,
  report,
  selectedItems,
  asGoogleDoc = true,
}: {
  token: string;
  question: string;
  report: {
    problema?: string;
    argumento?: string;
    evidencias?: string;
    lacunas?: string;
    proximosPassos?: string;
    referenciasAbnt?: string[];
    rawMarkdown?: string;
  };
  selectedItems: ConstellationNodeItem[];
  asGoogleDoc?: boolean;
}): Promise<DriveFileItem> {
  const folders = await ensureThesisFolders(token);
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 5).replace(':', 'h');
  const safeTitle = `Zwischenraum - ${selectedItems.map((i) => i.title.split('(')[0].trim()).join(' x ')} (${dateStr})`;

  const itemsListHtml = selectedItems
    .map(
      (item) =>
        `<li><strong>${item.title}</strong> (${item.categoryLabel} · Regime: ${item.regime} · País/Recorte: ${
          item.country || 'Transnacional'
        })<br/><em>${item.definition}</em></li>`
    )
    .join('');

  const refsHtml = (report.referenciasAbnt || [])
    .map((ref) => `<li>${ref}</li>`)
    .join('');

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${safeTitle}</title>
<style>
  body { font-family: 'Georgia', serif; line-height: 1.6; color: #1c1917; max-width: 800px; margin: auto; padding: 30px; }
  h1 { font-size: 26px; border-bottom: 2px solid #9a3412; padding-bottom: 8px; color: #1c1917; }
  h2 { font-size: 18px; color: #9a3412; margin-top: 24px; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; }
  .meta { font-family: monospace; font-size: 12px; color: #57534e; margin-bottom: 20px; }
  .card { background-color: #f5f1e8; border: 1px solid #d6cebe; padding: 15px; margin: 15px 0; }
  ul { padding-left: 20px; }
  li { margin-bottom: 8px; }
</style>
</head>
<body>
  <div class="meta">ICONOCRACIA: ALEGORIA FEMININA NA HISTÓRIA DA CULTURA JURÍDICA (SÉCULOS XIX–XX)<br/>Relatório de Montagem Autoral · Zwischenraum Panel · Gerado em ${dateStr} às ${timeStr}</div>
  <h1>${safeTitle}</h1>
  
  <div class="card">
    <strong>Pergunta da Pesquisa:</strong> ${question}
  </div>

  <h2>Elementos da Constelação em Configuração</h2>
  <ul>
    ${itemsListHtml}
  </ul>

  <h2>1. Problema</h2>
  <p>${report.problema || 'N/A'}</p>

  <h2>2. Argumento</h2>
  <p>${report.argumento || 'N/A'}</p>

  <h2>3. Evidências (Paradigma Indiciário & Sentido Produzido vs. Recebido)</h2>
  <p>${report.evidencias || 'N/A'}</p>

  <h2>4. Lacunas & Silêncios do Corpus</h2>
  <p>${report.lacunas || 'N/A'}</p>

  <h2>5. Próximos Passos & Recorte Core / Apêndice</h2>
  <p>${report.proximosPassos || 'N/A'}</p>

  ${
    refsHtml
      ? `<h2>Referências Bibliográficas (ABNT NBR 6023:2025)</h2><ul>${refsHtml}</ul>`
      : ''
  }
</body>
</html>`;

  return uploadDriveFile({
    token,
    folderId: folders.subfolders.montagens,
    fileName: asGoogleDoc ? safeTitle : `${safeTitle}.md`,
    content: asGoogleDoc
      ? htmlContent
      : `# ${safeTitle}\n\n**Pergunta da Pesquisa:** ${question}\n\n## 1. Problema\n${
          report.problema || ''
        }\n\n## 2. Argumento\n${report.argumento || ''}\n\n## 3. Evidências\n${
          report.evidencias || ''
        }\n\n## 4. Lacunas\n${report.lacunas || ''}\n\n## 5. Próximos Passos\n${
          report.proximosPassos || ''
        }`,
    contentType: asGoogleDoc ? 'text/html' : 'text/markdown',
    asGoogleDoc,
    description: `Montagem comparativa Zwischenraum da tese Iconocracia sobre: ${question}`,
  });
}

/**
 * Exports a full dossier sheet for any canonical concept or allegory to Google Drive.
 */
export async function exportFichaToDrive({
  token,
  node,
  asGoogleDoc = true,
}: {
  token: string;
  node: ConstellationNodeItem;
  asGoogleDoc?: boolean;
}): Promise<DriveFileItem> {
  const folders = await ensureThesisFolders(token);
  const safeTitle = `Ficha - ${node.title} (${node.categoryLabel})`;

  const indicatorsRows = HARDENING_INDICATORS.map((ind) => {
    const val = node.hardeningProfile?.[ind.key] ?? 'N/A';
    return `<tr><td style="padding: 6px; border: 1px solid #d6cebe; font-family: monospace;">${ind.index}. ${ind.label}</td><td style="padding: 6px; border: 1px solid #d6cebe; font-weight: bold; text-align: center;">${val}</td><td style="padding: 6px; border: 1px solid #d6cebe; font-size: 12px;">${ind.measures}</td></tr>`;
  }).join('');

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${safeTitle}</title>
<style>
  body { font-family: 'Georgia', serif; line-height: 1.6; color: #1c1917; max-width: 800px; margin: auto; padding: 30px; }
  h1 { font-size: 26px; border-bottom: 2px solid #9a3412; padding-bottom: 8px; color: #1c1917; }
  h2 { font-size: 14px; color: #9a3412; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; font-family: monospace; }
  .meta { font-family: monospace; font-size: 12px; color: #57534e; margin-bottom: 15px; }
  .box { background-color: #f5f1e8; border: 1px solid #d6cebe; padding: 15px; margin: 15px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
  th { background-color: #1c1917; color: #fff; padding: 8px; font-family: monospace; }
</style>
</head>
<body>
  <div class="meta">ICONOCRACIA: ALEGORIA FEMININA NA HISTÓRIA DA CULTURA JURÍDICA (SÉCULOS XIX–XX)<br/>Ficha Catalográfica e Conceitual · ID: ${node.id}</div>
  <h1>${node.title}</h1>
  <div class="meta">${node.categoryLabel} · Regime: ${node.regime} · ${node.chapterRef || 'Capítulo da Tese'}</div>

  <div class="box">
    <strong>Definição Canônica:</strong><br/>
    ${node.definition}
  </div>

  <h2>Proveniência & Regra de Autoria</h2>
  <p>${node.provenanceNote}</p>

  <h2>Uso e Operação na Tese</h2>
  <p>${node.thesisUsage}</p>

  ${
    node.senseProducedVsReceived
      ? `<h2>Sentido Produzido pelo Dispositivo Estatal vs. Recepção Histórica</h2><p>${node.senseProducedVsReceived}</p>`
      : ''
  }

  ${
    node.hardeningProfile
      ? `<h2>Perfil Indiciário de Endurecimento (10 Indicadores Ordinais 0–3, sem soma)</h2>
         <p style="font-size: 12px; font-style: italic;">Nota metodológica (Decisão 2026-09-24): O campo endurecimento_score foi removido definitivamente. As dimensões são avaliadas como perfil indiciário qualitativo.</p>
         <table>
           <thead><tr><th>Indicador</th><th>Grau (0–3)</th><th>O que mede</th></tr></thead>
           <tbody>${indicatorsRows}</tbody>
         </table>`
      : ''
  }

  <h2>Chaves ABNT NBR 6023:2025</h2>
  <p style="font-family: monospace; font-size: 13px; color: #9a3412;">${node.abntKeys.join(' · ')}</p>
</body>
</html>`;

  return uploadDriveFile({
    token,
    folderId: folders.subfolders.fichas,
    fileName: asGoogleDoc ? safeTitle : `${safeTitle}.md`,
    content: asGoogleDoc
      ? htmlContent
      : `# ${node.title}\n\n**Estatuto:** ${node.categoryLabel} · Regime ${node.regime}\n\n## Definição\n${node.definition}\n\n## Proveniência\n${node.provenanceNote}\n\n## Uso na Tese\n${node.thesisUsage}`,
    contentType: asGoogleDoc ? 'text/html' : 'text/markdown',
    asGoogleDoc,
    description: `Ficha conceitual da tese Iconocracia: ${node.title}`,
  });
}

/**
 * Exports an iconological peek note captured via text selection.
 */
export async function exportPeekNoteToDrive({
  token,
  term,
  explanation,
  epistemicStatus,
  provenanceNote,
  abntRef,
}: {
  token: string;
  term: string;
  explanation: string;
  epistemicStatus: string;
  provenanceNote: string;
  abntRef: string;
}): Promise<DriveFileItem> {
  const folders = await ensureThesisFolders(token);
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const safeTitle = `Nota Iconológica - ${term.slice(0, 30)} (${dateStr})`;

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${safeTitle}</title>
<style>
  body { font-family: 'Georgia', serif; line-height: 1.6; color: #1c1917; max-width: 700px; margin: auto; padding: 30px; }
  h1 { font-size: 22px; border-bottom: 1px solid #9a3412; padding-bottom: 6px; }
  .meta { font-family: monospace; font-size: 12px; color: #57534e; }
  .box { background-color: #f5f1e8; border: 1px solid #d6cebe; padding: 12px; margin: 15px 0; }
</style>
</head>
<body>
  <div class="meta">ICONOCRACIA · Nota Iconológica Peek-a-Concept · ${dateStr}</div>
  <h1>Termo Selecionado: “${term}”</h1>
  <div class="meta">Estatuto: ${epistemicStatus} · Referência: ${abntRef}</div>

  <div class="box">
    <strong>Síntese Analítica:</strong><br/>
    ${explanation}
  </div>

  <p><strong>Nota de Proveniência:</strong> ${provenanceNote}</p>
</body>
</html>`;

  return uploadDriveFile({
    token,
    folderId: folders.subfolders.notas,
    fileName: safeTitle,
    content: htmlContent,
    contentType: 'text/html',
    asGoogleDoc: true,
    description: `Nota iconológica da tese sobre "${term}"`,
  });
}

/**
 * Lists files stored across the thesis folder structure in Google Drive.
 */
export async function listThesisFiles(token: string): Promise<{
  rootFolderId: string;
  files: DriveFileItem[];
  quota?: DriveQuota;
}> {
  const folders = await ensureThesisFolders(token);

  const folderIds = [
    folders.rootFolderId,
    folders.subfolders.montagens,
    folders.subfolders.fichas,
    folders.subfolders.notas,
    folders.subfolders.catalogo,
  ];

  const parentConditions = folderIds.map((id) => `'${id}' in parents`).join(' or ');
  const query = `(${parentConditions}) and trashed = false`;

  const filesRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,mimeType,webViewLink,webContentLink,createdTime,modifiedTime,size,iconLink,parents)&orderBy=modifiedTime desc&pageSize=100`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const filesData = await filesRes.json();
  const files: DriveFileItem[] = (filesData.files || []).map((f: any) => {
    let subfolder = 'Raiz da Tese';
    if (f.parents?.includes(folders.subfolders.montagens)) subfolder = '01. Montagens Zwischenraum';
    else if (f.parents?.includes(folders.subfolders.fichas)) subfolder = '02. Fichas e Dossiês';
    else if (f.parents?.includes(folders.subfolders.notas)) subfolder = '03. Notas Iconológicas';
    else if (f.parents?.includes(folders.subfolders.catalogo)) subfolder = '04. Catálogo e Bibliografia';

    return {
      ...f,
      subfolder,
    };
  });

  // Query quota info
  let quota: DriveQuota | undefined;
  try {
    const aboutRes = await fetch(
      'https://www.googleapis.com/drive/v3/about?fields=storageQuota',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (aboutRes.ok) {
      const aboutData = await aboutRes.json();
      quota = aboutData.storageQuota;
    }
  } catch (err) {
    console.warn('Quota check failed:', err);
  }

  return {
    rootFolderId: folders.rootFolderId,
    files,
    quota,
  };
}

/**
 * Permanently deletes or moves a file to trash in Google Drive.
 * (MANDATORY: MUST only be called after explicit user confirmation dialog in UI)
 */
export async function deleteDriveFile(token: string, fileId: string): Promise<boolean> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}
