export const fmtDateBR = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      })
    : '—';
