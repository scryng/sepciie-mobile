const AVATAR_FALLBACKS = ['\\images\\user.png', '/images/user.png', 'user.png'];
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export function isValidPhoto(foto?: string | null): boolean {
  if (!foto) return false;
  const trimmed = foto.trim();
  if (!trimmed) return false;
  if (AVATAR_FALLBACKS.some((f) => trimmed.includes(f))) return false;
  if (API_BASE_URL && trimmed === API_BASE_URL) return false;
  return true;
}
