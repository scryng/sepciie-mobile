// utils/maskers.ts

// Mantém a máscara dd/mm/aaaa
export const maskDate = (text: string) => {
  const d = text.replace(/\D/g, '').slice(0, 8);
  const dd = d.slice(0, 2);
  const mm = d.slice(2, 4);
  const yyyy = d.slice(4, 8);

  if (d.length <= 2) return dd;
  if (d.length <= 4) return `${dd}/${mm}`;
  return `${dd}/${mm}/${yyyy}`;
};

/**
 * Valida data pt-BR (dd/mm/aaaa), data real, não-futura e idade mínima.
 * Por padrão: minAge=18, não permite futuro.
 */
export const isValidDatePtBR = (
  s?: string,
  opts: { minAge?: number; allowFuture?: boolean; now?: Date } = {}
) => {
  if (!s) return true;
  const { minAge = 18, allowFuture = false, now = new Date() } = opts;

  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) return false;

  const d = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10) - 1;
  const y = parseInt(m[3], 10);

  const dt = new Date(y, mo, d);
  // confere existência da data
  const isReal =
    dt.getFullYear() === y && dt.getMonth() === mo && dt.getDate() === d;
  if (!isReal) return false;

  // zera horas para comparação "de calendário"
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const birth = new Date(y, mo, d);

  // não pode futuro
  if (!allowFuture && birth > today) return false;

  // idade mínima (>= minAge)
  const minBirth = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDate()
  );
  if (birth > minBirth) return false;

  return true;
};

export const birthDateRHFValidate = (
  s?: string,
  opts: { minAge?: number; now?: Date } = {}
) => {
  if (!s) return true;
  const { minAge = 18, now = new Date() } = opts;

  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) return 'Data inválida.';

  const d = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10) - 1;
  const y = parseInt(m[3], 10);

  const dt = new Date(y, mo, d);
  const isReal =
    dt.getFullYear() === y && dt.getMonth() === mo && dt.getDate() === d;
  if (!isReal) return 'Data inválida.';

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const birth = new Date(y, mo, d);

  if (birth > today) return 'Data no futuro não é permitida.';

  const minBirth = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDate()
  );
  if (birth > minBirth) return `É necessário ter ${minAge} anos ou mais.`;

  return true;
};
