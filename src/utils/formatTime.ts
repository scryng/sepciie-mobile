export function formatTime(min: number | string | null | undefined): string {
  const total = Math.max(0, Math.floor(Number(min) || 0));
  if (total < 60) return `${total} min`;

  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}min`;
}
