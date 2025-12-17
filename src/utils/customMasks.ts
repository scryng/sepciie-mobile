export const getPhoneOrCellMask = (text?: string): (string | RegExp)[] => {
  const digits = text?.replace(/\D/g, '') || '';
  if (digits.length > 10) {
    return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  }
  return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
};

export const getCpfCnpjMask = (text?: string): (string | RegExp)[] => {
  const digits = text?.replace(/\D/g, '') || '';

  if (digits.length > 11) {
    return [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  }

  return [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
};
