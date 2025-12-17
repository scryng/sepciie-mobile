// utils/cookieJar.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const JAR_KEY = '@cookiejar/v1';

type CookieRec = {
  value: string;
  // epoch ms; se ausente, trata como sessão longa
  expiresAt?: number;
};

type CookieJar = Record<string, CookieRec>;

// ----- helpers -----
const parseCookieLine = (line: string): { name: string; value: string; expiresAt?: number } | null => {
  // Ex: ".AspNetCore.Cookies=XYZ; path=/; httponly; samesite=lax; expires=Tue, 30 Sep 2025 19:46:07 GMT"
  const parts = line.split(';').map((s) => s.trim());
  if (!parts[0]) return null;
  const [name, ...rest] = parts[0].split('=');
  const value = rest.join('=');
  if (!name || value === undefined) return null;

  let expiresAt: number | undefined;
  for (const p of parts.slice(1)) {
    const [k, v] = p.split('=');
    if (/^expires$/i.test(k?.trim() || '')) {
      const ts = Date.parse(v?.trim() || '');
      if (!Number.isNaN(ts)) expiresAt = ts;
    }
  }
  return { name, value, expiresAt };
};

export const saveCookiesFromResponse = async (setCookieHeader?: string | string[] | null) => {
  if (!setCookieHeader) return;

  let lines: string[] = [];
  if (Array.isArray(setCookieHeader)) {
    lines = setCookieHeader;
  } else {
    lines = setCookieHeader.split(/\r?\n/).filter(Boolean);
    if (!lines.length) lines = [setCookieHeader];
  }

  const raw = (await AsyncStorage.getItem(JAR_KEY)) || '{}';
  const jar: CookieJar = JSON.parse(raw);

  for (const line of lines) {
    const parsed = parseCookieLine(line);
    if (parsed) {
      jar[parsed.name] = { value: parsed.value, ...(parsed.expiresAt ? { expiresAt: parsed.expiresAt } : {}) };
    }
  }
  await AsyncStorage.setItem(JAR_KEY, JSON.stringify(jar));
};

export const buildCookieHeader = async (): Promise<string | null> => {
  const raw = (await AsyncStorage.getItem(JAR_KEY)) || '{}';
  const jar: CookieJar = JSON.parse(raw);

  const now = Date.now();
  const livePairs: string[] = [];
  let changed = false;

  for (const [name, rec] of Object.entries(jar)) {
    if (rec.expiresAt && rec.expiresAt < now) {
      // expirado -> remove
      delete jar[name];
      changed = true;
      continue;
    }
    livePairs.push(`${name}=${rec.value}`);
  }
  if (changed) {
    await AsyncStorage.setItem(JAR_KEY, JSON.stringify(jar));
  }
  return livePairs.length ? livePairs.join('; ') : null;
};

export const clearCookieJar = async () => {
  await AsyncStorage.removeItem(JAR_KEY);
};
