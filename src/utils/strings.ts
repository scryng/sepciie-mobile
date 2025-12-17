export function stripAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Remove acentos da strings e deixa em letra maiuscula */
export function normalizeText(str: string): string {
  return stripAccents(str).toUpperCase();
}

export function formatCurrency(value: number, currency = 'BRL', locale = 'pt-BR'): string {
  return value.toLocaleString(locale, { style: 'currency', currency: currency });
}

/**
 * Returns only the digits from a string.
 * @param value The input string or number.
 * @returns A string containing only digits.
 */
export function digitsOnly(value: string | number | null | undefined): string {
  if (!value) return '';
  return String(value).replace(/\D/g, '');
}

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function isNullOrBlank(value: string | null | undefined): boolean {
  if (!value) {
    return true;
  }

  return isBlank(value);
}

export function isUppercase(str: string | null | undefined): boolean {
  if (!str) {
    return false;
  }

  if (str.trim().length === 0) {
    return false;
  }

  return str === str.toUpperCase();
}
