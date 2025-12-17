const validarCPF = (cpf: string) => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigito = (t: number) => {
    let sum = 0;
    for (let i = 0; i < t - 1; i++) {
      sum += parseInt(cpf.charAt(i), 10) * (t - i);
    }
    let d = 11 - (sum % 11);
    return d >= 10 ? 0 : d;
  };

  const d1 = calcDigito(10);
  const d2 = calcDigito(11);
  return (
    d1 === parseInt(cpf.charAt(9), 10) && d2 === parseInt(cpf.charAt(10), 10)
  );
};
export default validarCPF;
