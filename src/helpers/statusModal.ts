export type PendingDocumentsMode =
  | 'documents'
  | 'technical_responsible'
  | 'already_exists';

export const getPendingDocumentsMode = (
  message: string
): PendingDocumentsMode => {
  if (/Já existe um certificado/i.test(message)) return 'already_exists';
  if (/responsável técnico/i.test(message)) return 'technical_responsible';
  return 'documents';
};

export const parsePendingDocuments = (message: string): string[] => {
  if (!message) return [];

  const s = String(message).trim();
  const afterColon = s.replace(/^[^:]*:\s*/i, '');
  if (!afterColon || /^[\s.]+$/.test(afterColon)) return [];

  return afterColon
    .split(/[,;\n•\-–]+/g)
    .map((t) => t.trim())
    .filter(Boolean);
};

export const MODE_UI = {
  already_exists: {
    title: 'Certificado Já Existe',
    icon: 'check-circle',
    color: '#10B981',
    subtitle:
      'Já existe um certificado para esta placa, ONU e CIPP na mesma data.',
  },
  technical_responsible: {
    title: 'Responsável Técnico Necessário',
    icon: 'person',
    color: '#F59E0B',
    subtitle: 'Cadastre o responsável técnico para continuar.',
  },
  documents: {
    title: 'Documentos Pendentes',
    icon: 'description',
    color: '#F59E0B',
    subtitle:
      'Complete os documentos obrigatórios para seguir com o pagamento.',
  },
} as const;
