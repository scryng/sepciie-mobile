export const PWD = {
  MIN: 8,
  LOWER: /[a-z]/,
  UPPER: /[A-Z]/,
  DIGIT: /\d/,
  SPECIAL: /[^A-Za-z0-9\s]/,
};

// Monta lista pt-BR: "a, b e c"
const listPt = (items: string[]) =>
  items.length <= 1
    ? items[0]
    : `${items.slice(0, -1).join(', ')} e ${items.slice(-1)}`;

export const validatePassword = (v?: string) => {
  const value = (v ?? '').trim();

  const missing: string[] = [];
  if (value.length < PWD.MIN) missing.push(`mínimo de ${PWD.MIN} caracteres`);
  if (!PWD.LOWER.test(value)) missing.push('letra minúscula');
  if (!PWD.UPPER.test(value)) missing.push('letra maiúscula');
  if (!PWD.DIGIT.test(value)) missing.push('número');
  if (!PWD.SPECIAL.test(value)) missing.push('caractere especial');

  return missing.length ? `A senha precisa de: ${listPt(missing)}.` : true;
};
