// src/services/api/auth/authentication.api.ts
import { AuthLoginUserData } from '@/types/api/auth';
import * as SecureStore from 'expo-secure-store';

export class AuthenticationService {
  private static readonly KEYS = {
    TOKEN: 'userToken',
    USER_ID: 'userId',
    USER_NAME: 'userName',
    USER_ROLE: 'userRole',
    LAST_LOGIN: 'lastLoginTimestamp',
  } as const;

  // Salva os dados após o login bem-sucedido
  static async setAuthenticatedUser(token: string, user: { id: string; name: string; role: string }): Promise<void> {
    const timestamp = Date.now().toString();

    const items: [string, string][] = [
      [this.KEYS.TOKEN, token],
      [this.KEYS.USER_ID, user.id],
      [this.KEYS.USER_NAME, user.name],
      [this.KEYS.USER_ROLE, user.role],
      [this.KEYS.LAST_LOGIN, timestamp],
    ];

    for (const [key, value] of items) {
      await SecureStore.setItemAsync(key, value);
    }
  }

  // Logout: remove tudo relacionado à sessão
  static async logout(): Promise<void> {
    const keysToRemove = Object.values(this.KEYS);

    await Promise.all(
      keysToRemove.map(key => SecureStore.deleteItemAsync(key).catch(() => {})) // ignora erros individuais
    );
  }

  // Verifica se o usuário está logado (simples: tem token?)
  static async isLoggedIn(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync(this.KEYS.TOKEN);
      return !!token;
    } catch {
      return false;
    }
  }

  // Retorna apenas o token (útil para headers)
  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.KEYS.TOKEN);
    } catch {
      return null;
    }
  }

  // Retorna os dados do usuário atual (ou null se não logado)
  static async getCurrentUser(): Promise<AuthLoginUserData | null> {
    try {
      const [token, userId, userName, userRole] = await Promise.all([
        SecureStore.getItemAsync(this.KEYS.TOKEN),
        SecureStore.getItemAsync(this.KEYS.USER_ID),
        SecureStore.getItemAsync(this.KEYS.USER_NAME),
        SecureStore.getItemAsync(this.KEYS.USER_ROLE),
      ]);

      if (!token || !userId || !userName) {
        return null;
      }

      return {
        id: userId,
        name: userName,
        role: userRole ?? '',
      };
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }
}