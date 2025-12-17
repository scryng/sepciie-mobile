import { EnderecoListItem } from '@/services/models/types/routes';

// helpers
export const getLat = (e: EnderecoListItem) => Number(e.latitude);
export const getLng = (e: EnderecoListItem) => Number(e.longitude);

export const prettyAddress = (e?: EnderecoListItem | null) => {
  if (!e) return { l1: '', l2: '' };
  const apelido = (e.apelido_endereco || '').trim();
  const l1 = apelido || `${e.rua}${e.numero ? `, ${e.numero}` : ''}`;
  const l2 = `${e.bairro ? `${e.bairro} • ` : ''}${e.cidade}${e.estado ? `-${e.estado}` : ''}`;
  return { l1, l2 };
};
