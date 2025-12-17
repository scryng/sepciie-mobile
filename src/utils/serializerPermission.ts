import { PermRow } from '@/services/models/types/access';
import { NivelPermissao } from '@/services/models/types/users';
import { stringify } from 'lossless-json';

export const to01 = (v: unknown): 0 | 1 => (v === 1 || v === '1' || v === true ? 1 : 0);

export const serializeNivel = (nivel: string | NivelPermissao | undefined): string => {
  try {
    if (!nivel) return stringify({ access: [] })!;
    const obj = typeof nivel === 'string' ? JSON.parse(nivel) : nivel;
    const access = Array.isArray(obj?.access) ? obj.access : [];
    // normaliza chaves e flags para o backend
    const norm = access.map((p: any) => ({
      page: String(p.page ?? p.pagina ?? ''),
      a: to01(p.a ?? p.c),
      e: to01(p.e),
      d: to01(p.d),
    }));
    return stringify({ access: norm })!;
  } catch {
    return stringify({ access: [] })!;
  }
};

export const serializePermissions = (rows: PermRow[]): string => {
  const toBackendPage = (label: string) => {
    if (label === 'ONUs Permitidos') return 'ListOnusPermitido';
    if (label === 'Implementos') return 'Veículos';
    return label;
  };
  const access = rows.map((r) => ({
    page: toBackendPage(String(r.pagina)),
    a: r.c ? 1 : 0,
    e: r.e ? 1 : 0,
    d: r.d ? 1 : 0,
  }));
  return stringify({ access })!;
};
