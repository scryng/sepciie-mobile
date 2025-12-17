import { SelectOption } from '@/types/common';

/** Lista de UFs (opções para o primeiro dropdown) */
export const UF_OPTIONS: SelectOption[] = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
].map((u) => ({ id: u, label: u }));

/** Tipagem de UF e Órgão */
export type UF =
  | 'AC'
  | 'AL'
  | 'AP'
  | 'AM'
  | 'BA'
  | 'CE'
  | 'DF'
  | 'ES'
  | 'GO'
  | 'MA'
  | 'MT'
  | 'MS'
  | 'MG'
  | 'PA'
  | 'PB'
  | 'PR'
  | 'PE'
  | 'PI'
  | 'RJ'
  | 'RN'
  | 'RS'
  | 'RO'
  | 'RR'
  | 'SC'
  | 'SP'
  | 'SE'
  | 'TO';

export type Orgao =
  | 'SSP' // Secretarias de Segurança Pública
  | 'PC' // Polícia Civil (aparece em alguns RGs/legados)
  | 'IGP' // Instituto-Geral de Perícias (RS/SC)
  | 'IIFP' // Instituto de Identificação Félix Pacheco (RJ, legado)
  | 'IFP' // Inst. Félix Pacheco (RJ, legado)
  | 'DETRAN' // Diretoria/Identificação Civil (RJ)
  | 'ITEP' // RN
  | 'POLITEC' // MT
  | 'SEJUSP' // MS
  | 'SESP' // Segurança Pública (alguns estados)
  | 'SSPDS' // CE
  | 'SDS' // PE
  | 'SPTC'; // Superintendência Técnico-Científica (PA/GO)

/** Mapeia, por UF, quais órgãos podem aparecer (amplo, inclui legados) */
export const ORGAOS_BY_UF: Record<UF, Orgao[]> = {
  AC: ['SSP', 'SESP', 'PC'],
  AL: ['SSP', 'PC'],
  AP: ['SSP', 'PC'],
  AM: ['SSP', 'PC'],
  BA: ['SSP'],
  CE: ['SSPDS', 'SSP'],
  DF: ['PC', 'SSP'],
  ES: ['SSP', 'PC'],
  GO: ['SPTC', 'SSP', 'PC'],
  MA: ['SSP'],
  MT: ['POLITEC', 'SESP', 'SSP'],
  MS: ['SEJUSP', 'PC'],
  MG: ['SSP'],
  PA: ['PC', 'SPTC', 'SSP'],
  PB: ['SSP'],
  PR: ['SESP', 'SSP', 'PC'],
  PE: ['SDS', 'SSP'],
  PI: ['SSP', 'PC'],
  RJ: ['DETRAN', 'IFP', 'IIFP', 'SSP'],
  RN: ['ITEP', 'SSP'],
  RS: ['IGP', 'SSP'],
  RO: ['SESP', 'PC', 'SSP'],
  RR: ['SESP', 'PC', 'SSP'],
  SC: ['IGP', 'SSP'],
  SP: ['SSP'],
  SE: ['SSP'],
  TO: ['SSP', 'PC'],
};

/** Labels para o segundo dropdown */
export const ORGAO_LABELS: Record<Orgao, string> = {
  SSP: 'SSP — Secretaria de Segurança Pública',
  PC: 'PC — Polícia Civil',
  IGP: 'IGP — Instituto-Geral de Perícias',
  IIFP: 'IIFP — Instituto de Identificação Félix Pacheco (RJ)',
  IFP: 'IFP — Inst. Félix Pacheco (RJ — legado)',
  DETRAN: 'DETRAN — Identificação Civil (RJ)',
  ITEP: 'ITEP — Instituto Técnico-Científico (RN)',
  POLITEC: 'POLITEC — Perícia Oficial (MT)',
  SEJUSP: 'SEJUSP — MS',
  SESP: 'SESP — Segurança Pública',
  SSPDS: 'SSPDS — CE',
  SDS: 'SDS — PE',
  SPTC: 'SPTC — Superintendência Técnico-Científica',
};

/** Helpers simples para montar/ler 'ORG/UF' */
export const toSingleField = (orgao: Orgao, uf: UF) => `${orgao}/${uf}`;

export const splitSingleField = (value?: string | null): { orgao: Orgao; uf: UF } | null => {
  if (!value) return null;
  const v = String(value).toUpperCase().trim().replace(/\s+/g, '');
  const m = v.match(/^([A-Z]+)[/-]([A-Z]{2})$/);
  if (!m) return null;
  const org = m[1] as Orgao;
  const uf = m[2] as UF;
  return org in ORGAO_LABELS && ORGAOS_BY_UF[uf]?.includes(org) ? { orgao: org, uf } : null;
};
