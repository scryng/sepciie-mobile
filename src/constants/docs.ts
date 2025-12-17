export const DOCS = {
  Termos_de_Uso: {
    url:'https://example.com',
    name: 'Termos.pdf',
  },
} as const;

export type DocId = keyof typeof DOCS;