import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  DriveFileItem,
  DriveQuota,
  deleteDriveFile,
  ensureThesisFolders,
  getAccessToken,
  googleSignIn,
  googleSignOut,
  listThesisFiles,
  uploadDriveFile,
} from '../services/googleDriveService';
import {
  ICONOCRACY_NODES,
  ABNT_REFERENCES,
} from '../data/iconocracyData';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  HardDrive,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from 'lucide-react';

interface DriveIntegrationPanelProps {
  currentUser: User | null;
  accessToken: string | null;
  onAuthChange: (user: User | null, token: string | null) => void;
}

export const DriveIntegrationPanel: React.FC<DriveIntegrationPanelProps> = ({
  currentUser,
  accessToken,
  onAuthChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [rootFolderId, setRootFolderId] = useState<string | null>(null);
  const [quota, setQuota] = useState<DriveQuota | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [subfolderFilter, setSubfolderFilter] = useState('todos');
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Destructive operation confirmation state (MANDATORY REQUIREMENT)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFiles = async (token: string) => {
    setIsLoading(true);
    try {
      const data = await listThesisFiles(token);
      setFiles(data.files);
      setRootFolderId(data.rootFolderId);
      setQuota(data.quota);
    } catch (err: any) {
      console.error('Erro ao listar arquivos do Google Drive:', err);
      setFeedbackMsg({
        type: 'error',
        text: `Erro ao carregar arquivos do Drive: ${err.message || 'Falha de comunicação'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchFiles(accessToken);
    } else {
      setFiles([]);
      setRootFolderId(null);
    }
  }, [accessToken]);

  const handleLogin = async () => {
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        onAuthChange(result.user, result.accessToken);
        setFeedbackMsg({
          type: 'success',
          text: `Conectado com sucesso como ${result.user.email}!`,
        });
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Falha na autenticação com o Google.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await googleSignOut();
    onAuthChange(null, null);
    setFiles([]);
    setFeedbackMsg({
      type: 'success',
      text: 'Desconectado do Google Drive com segurança.',
    });
  };

  // Full catalog and bibliography backup to Google Drive
  const handleBackupFullCatalog = async () => {
    if (!accessToken) return;
    setIsSyncingAll(true);
    setFeedbackMsg(null);

    try {
      const folders = await ensureThesisFolders(accessToken);
      const dateStr = new Date().toISOString().slice(0, 10);

      // 1. JSON Backup of all 23 nodes and references
      const catalogData = {
        metadata: {
          tese: 'Iconocracia: Alegoria Feminina na História da Cultura Jurídica (séculos XIX–XX)',
          autora: 'Ana Vanzin',
          exportDate: new Date().toISOString(),
          version: '1.0.0-dec-2026-07-29',
        },
        nodes: ICONOCRACY_NODES,
        abntReferences: ABNT_REFERENCES,
      };

      await uploadDriveFile({
        token: accessToken,
        folderId: folders.subfolders.catalogo,
        fileName: `Catalogo_Corpus_Iconocracia_${dateStr}.json`,
        content: JSON.stringify(catalogData, null, 2),
        contentType: 'application/json',
        asGoogleDoc: false,
        description: 'Backup em JSON do catálogo de obras e conceitos da tese Iconocracia',
      });

      // 2. Google Doc with the complete bibliography in ABNT NBR 6023:2025
      const biblioHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bibliografia ABNT - Iconocracia</title><style>body { font-family: 'Georgia', serif; line-height: 1.6; max-width: 800px; margin: auto; padding: 30px; } h1 { border-bottom: 2px solid #9a3412; } li { margin-bottom: 12px; font-size: 13px; }</style></head><body><h1>Bibliografia da Tese (ABNT NBR 6023:2025)</h1><p>Cotejado com vault/tese/references.bib.</p><ol>${ABNT_REFERENCES.map(
        (r) =>
          `<li><strong>${r.key}</strong>: ${r.citation} ${
            r.translationNote ? `[${r.translationNote}]` : ''
          }</li>`
      ).join('')}</ol></body></html>`;

      await uploadDriveFile({
        token: accessToken,
        folderId: folders.subfolders.catalogo,
        fileName: `Bibliografia_ABNT_Iconocracia_${dateStr}`,
        content: biblioHtml,
        contentType: 'text/html',
        asGoogleDoc: true,
        description: 'Referências bibliográficas completas em ABNT NBR 6023:2025',
      });

      setFeedbackMsg({
        type: 'success',
        text: 'Backup completo do catálogo e bibliografia exportado para o Google Drive com sucesso!',
      });
      await fetchFiles(accessToken);
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: `Falha ao sincronizar catálogo: ${err.message || 'Erro desconhecido'}`,
      });
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!accessToken || !fileToDelete) return;
    setIsDeleting(true);
    try {
      const ok = await deleteDriveFile(accessToken, fileToDelete.id);
      if (ok) {
        setFeedbackMsg({
          type: 'success',
          text: `Arquivo "${fileToDelete.name}" removido do Google Drive.`,
        });
        setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
        setFileToDelete(null);
      } else {
        throw new Error('O Google Drive recusou a exclusão.');
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: `Erro ao excluir: ${err.message}`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFiles = files.filter((f) => {
    if (subfolderFilter !== 'todos' && f.subfolder !== subfolderFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      return f.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-12 py-12 space-y-10 select-text">
      {/* Header */}
      <div className="border-b border-[#D6CEBE] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#9A3412]">
            Google Workspace Integration · Google Drive API v3
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1C1917] mt-1">
            Google Drive da Pesquisa
          </h1>
          <p className="font-serif text-base text-[#292524] mt-2 max-w-2xl">
            Sincronização persistente de relatórios Zwischenraum, fichas conceituais com perfil de endurecimento e catálogo bibliográfico da tese na sua pasta estruturada do Google Drive.
          </p>
        </div>

        {accessToken && rootFolderId && (
          <a
            href={`https://drive.google.com/drive/folders/${rootFolderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#1C1917] text-[#FBF9F5] text-xs font-mono hover:bg-[#292524] flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
          >
            <FolderOpen className="w-4 h-4 text-[#9A8A2A]" />
            Abrir Pasta da Tese no Drive
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Feedback Alert Bar */}
      {feedbackMsg && (
        <div
          className={`p-4 border text-xs font-mono flex items-center justify-between gap-3 ${
            feedbackMsg.type === 'success'
              ? 'bg-[#D8ECD8] border-[#2A7A2A] text-[#184D18]'
              : 'bg-[#F9E0E0] border-[#9A3412] text-[#6E3209]'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs underline hover:no-underline"
          >
            Fechar
          </button>
        </div>
      )}

      {/* AUTH STATUS & USER CARD */}
      {!accessToken || !currentUser ? (
        <div className="bg-[#F3EFE6] border border-[#D6CEBE] p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-white border border-[#D6CEBE] rounded-full flex items-center justify-center text-[#9A3412] shadow-sm">
            <HardDrive className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Conecte sua conta do Google Drive
            </h2>
            <p className="font-serif text-sm text-[#57534E]">
              Acesse e salve automaticamente os documentos e relatórios da sua pesquisa de tese na pasta dedicada <em>Iconocracia - Pesquisa de Tese (Ana Vanzin)</em> com permissão explícita.
            </p>
          </div>

          {/* Official Sign in with Google Button (GSI Guidelines) */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="inline-flex items-center gap-3 px-6 py-3 border border-[#747775] bg-white text-[#1f1f1f] hover:bg-[#F8FAFC] active:bg-[#EEEEEE] rounded-sm font-medium text-sm transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#9A3412]" />
              ) : (
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-5 h-5"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
              )}
              <span className="font-sans font-medium text-sm">
                Fazer login com o Google
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#F3EFE6] border border-[#D6CEBE] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Usuário'}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full border border-[#D6CEBE]"
              />
            ) : (
              <div className="w-14 h-14 bg-[#1C1917] text-white rounded-full flex items-center justify-center font-display text-xl">
                {currentUser.displayName?.[0] || 'A'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-semibold text-[#1C1917]">
                  {currentUser.displayName || 'Pesquisadora'}
                </span>
                <span className="text-[11px] font-mono text-[#2A7A2A] bg-[#D8ECD8] px-2 py-0.5 border border-[#2A7A2A]">
                  Conectada ao Drive
                </span>
              </div>
              <div className="text-xs font-mono text-[#57534E]">
                {currentUser.email}
              </div>
              {quota && quota.usage && (
                <div className="text-[11px] font-mono text-[#78716C] mt-1">
                  Espaço em uso: {(Number(quota.usage) / 1024 / 1024 / 1024).toFixed(2)} GB
                  {quota.limit ? ` de ${(Number(quota.limit) / 1024 / 1024 / 1024).toFixed(0)} GB` : ''}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleBackupFullCatalog}
              disabled={isSyncingAll}
              className="px-4 py-2 bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {isSyncingAll ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sincronizando Catálogo...
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  Sincronizar Catálogo & Bibliografia
                </>
              )}
            </button>
            <button
              onClick={() => accessToken && fetchFiles(accessToken)}
              className="p-2 border border-[#D6CEBE] bg-white text-[#1C1917] hover:bg-[#F3EFE6]"
              title="Atualizar lista de arquivos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 border border-[#D6CEBE] text-xs font-mono text-[#78716C] hover:text-[#1C1917] hover:bg-white flex items-center gap-1.5 whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              Desconectar
            </button>
          </div>
        </div>
      )}

      {/* THESIS FOLDER STRUCTURE & SYNC GUIDELINES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: '01. Montagens Zwischenraum',
            desc: 'Pareceres comparativos gerados pelo Atlas, convertidos em Google Docs editáveis.',
            filter: '01. Montagens Zwischenraum',
          },
          {
            title: '02. Fichas e Dossiês',
            desc: 'Fichas completas de obras e conceitos com os 10 indicadores de endurecimento (0–3).',
            filter: '02. Fichas e Dossiês',
          },
          {
            title: '03. Notas Iconológicas',
            desc: 'Notas rápidas de leitura capturadas no texto pelo tooltip de seleção.',
            filter: '03. Notas Iconológicas',
          },
          {
            title: '04. Catálogo e Bibliografia',
            desc: 'Backups em JSON do acervo e referências completas em ABNT NBR 6023:2025.',
            filter: '04. Catálogo e Bibliografia',
          },
        ].map((folder, i) => (
          <div
            key={i}
            onClick={() => setSubfolderFilter(subfolderFilter === folder.filter ? 'todos' : folder.filter)}
            className={`border p-4 transition-colors cursor-pointer ${
              subfolderFilter === folder.filter
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-white border-[#D6CEBE] hover:border-[#9A3412]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <FolderOpen
                className={`w-4 h-4 ${
                  subfolderFilter === folder.filter ? 'text-[#9A8A2A]' : 'text-[#9A3412]'
                }`}
              />
              <span className="font-mono text-xs font-semibold truncate">
                {folder.title}
              </span>
            </div>
            <p
              className={`text-xs font-serif ${
                subfolderFilter === folder.filter ? 'text-[#D6CEBE]' : 'text-[#57534E]'
              }`}
            >
              {folder.desc}
            </p>
          </div>
        ))}
      </div>

      {/* FILE LIST TABLE */}
      {accessToken && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-2xl font-semibold text-[#1C1917]">
                Arquivos Sincronizados ({filteredFiles.length})
              </h3>
              {subfolderFilter !== 'todos' && (
                <button
                  onClick={() => setSubfolderFilter('todos')}
                  className="text-xs font-mono text-[#9A3412] underline ml-2"
                >
                  Ver todos os arquivos
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar arquivos na pasta..."
                className="w-full bg-white border border-[#D6CEBE] pl-9 pr-3 py-1.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-xs font-mono text-[#78716C] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#9A3412]" />
              Consultando arquivos no Google Drive...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="py-16 border border-[#D6CEBE] bg-white text-center space-y-3">
              <FileText className="w-8 h-8 text-[#D6CEBE] mx-auto" />
              <p className="font-serif text-sm text-[#57534E]">
                Nenhum arquivo encontrado nesta pasta ainda.
              </p>
              <button
                onClick={handleBackupFullCatalog}
                className="px-4 py-2 border border-[#1C1917] text-xs font-mono hover:bg-[#F3EFE6]"
              >
                Gerar Primeiro Backup do Catálogo
              </button>
            </div>
          ) : (
            <div className="border border-[#D6CEBE] bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#1C1917] text-[#FBF9F5] font-mono">
                    <th className="py-3 px-4">Documento</th>
                    <th className="py-3 px-4">Subpasta</th>
                    <th className="py-3 px-4">Modificação</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DEC9]">
                  {filteredFiles.map((file) => {
                    const isGoogleDoc = file.mimeType.includes('google-apps.document');
                    return (
                      <tr key={file.id} className="hover:bg-[#F3EFE6]/60">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FileText
                              className={`w-4 h-4 shrink-0 ${
                                isGoogleDoc ? 'text-[#4285F4]' : 'text-[#78716C]'
                              }`}
                            />
                            <div>
                              <div className="font-medium text-[#1C1917] leading-tight">
                                {file.name}
                              </div>
                              <span className="text-[10px] font-mono text-[#78716C]">
                                {isGoogleDoc ? 'Google Doc Editável' : file.mimeType}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[#57534E]">
                          {file.subfolder}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#78716C] whitespace-nowrap">
                          {file.modifiedTime
                            ? new Date(file.modifiedTime).toLocaleDateString('pt-BR')
                            : '—'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 text-xs font-mono bg-[#F3EFE6] hover:bg-[#E5DEC9] text-[#1C1917] border border-[#D6CEBE] inline-flex items-center gap-1"
                              >
                                {isGoogleDoc ? 'Abrir no Docs' : 'Ver no Drive'}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <button
                              onClick={() => setFileToDelete(file)}
                              title="Excluir arquivo do Google Drive"
                              className="p-1 text-[#78716C] hover:text-[#DC2626] border border-transparent hover:border-[#DC2626]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MANDATORY DESTRUCTIVE CONFIRMATION MODAL */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#FBF9F5] border border-[#DC2626] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#DC2626] font-mono text-xs uppercase tracking-wider font-semibold">
              <AlertTriangle className="w-4 h-4" />
              Confirmação de Exclusão no Google Drive
            </div>

            <h3 className="font-display text-2xl font-semibold text-[#1C1917]">
              Excluir este arquivo?
            </h3>

            <p className="font-serif text-sm text-[#292524] leading-relaxed">
              Você está prestes a excluir permanentemente o arquivo{' '}
              <strong className="font-mono text-xs text-[#1C1917]">
                "{fileToDelete.name}"
              </strong>{' '}
              da pasta <span className="font-mono text-xs">{fileToDelete.subfolder}</span> do seu Google Drive. Esta ação não poderá ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6CEBE]">
              <button
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-[#D6CEBE] text-xs font-mono hover:bg-[#F3EFE6]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Confirmar Exclusão
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
