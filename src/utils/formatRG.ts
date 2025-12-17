export type FormatIdOptions = {
  /** Se true (padrão), 11 dígitos formatam como CPF; se false, só agrupa com pontos. */
  elevenAsCpf?: boolean;
};

export function formatRG(input?: string, opts: FormatIdOptions = {}): string {
  const { elevenAsCpf = true } = opts;
  const raw = (input ?? '').toString();

  const cleaned = raw
    .normalize?.('NFKC')
    .replace(/[^0-9A-Za-z]/g, '')
    .toUpperCase();

  if (!cleaned) return '';

  const group = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const m14 = cleaned.match(/^(\d{14})/);
  if (m14) {
    return group(m14[1]);
  }

  // 13 dígitos -> apenas agrupado
  const m13 = cleaned.match(/^(\d{13})/);
  if (m13) {
    return group(m13[1]);
  }

  // 12 dígitos -> apenas agrupado
  const m12 = cleaned.match(/^(\d{12})/);
  if (m12) {
    return group(m12[1]);
  }

  // 11 dígitos no início -> CIN/CPF
  const m11 = cleaned.match(/^(\d{11})/);
  if (m11) {
    const eleven = m11[1];
    return elevenAsCpf ? eleven.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : group(eleven);
  }

  // dígitos + DV 'X' opcional (RG)
  const mRG = cleaned.match(/^(\d+X?)/);
  if (!mRG) return '';

  let core = mRG[1];

  // Se terminar com X, é RG com DV 'X' -> limitar a 8+X
  if (core.endsWith('X')) {
    core = core.replace(/X$/, '');
    if (core.length > 8) core = core.slice(0, 8);
    return `${group(core)}-X`;
  }

  // Sem 'X': manter até 14 (para não travar chegada a 12–14); casos 12–14 já pegos acima
  if (core.length > 14) core = core.slice(0, 14);

  const len = core.length;

  if (len <= 8) {
    // 1..8: agrupamento
    return group(core);
  }

  if (len === 9) {
    // 9: RG com DV numérico (8 + 1)
    const corpo = core.slice(0, 8);
    const dv = core.slice(8);
    return `${group(corpo)}-${dv}`;
  }

  if (len === 10) {
    // 10: apenas agrupado (permite crescer para 11/12/13/14)
    return group(core);
  }

  // Qualquer outro (11 já tratado; 12–14 tratados acima) -> fallback agrupado
  return group(core);
}

export default formatRG;

/**
 * Núcleo "puro" do documento, sem máscara:
 * - 14/13/12 dígitos no início, se existirem;
 * - Senão 11 dígitos no início;
 * - Senão RG: até 8 dígitos + 'X' OU até 9 dígitos.
 */
export function unformatRG(input?: string): string {
  const raw = (input ?? '').toString();
  const cleaned = raw
    .normalize?.('NFKC')
    .replace(/[^0-9A-Za-z]/g, '')
    .toUpperCase();

  if (!cleaned) return '';

  const m14 = cleaned.match(/^(\d{14})/);
  if (m14) return m14[1];

  const m13 = cleaned.match(/^(\d{13})/);
  if (m13) return m13[1];

  const m12 = cleaned.match(/^(\d{12})/);
  if (m12) return m12[1];

  const m11 = cleaned.match(/^(\d{11})/);
  if (m11) return m11[1];

  const mRG = cleaned.match(/^(\d+X?)/);
  if (!mRG) return '';

  let core = mRG[1];

  if (core.endsWith('X')) {
    core = core.replace(/X$/, '');
    if (core.length > 8) core = core.slice(0, 8);
    return core + 'X';
  }

  // até 14 dígitos (para não travar progressão)
  if (core.length > 14) core = core.slice(0, 14);
  return core;
}
