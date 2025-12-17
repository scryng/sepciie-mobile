import { AuthenticationService } from './auth/authentication.api';

export class ApiConfig {
  static async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AuthenticationService.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  static async getAuthHeadersForFormData(): Promise<Record<string, string>> {
    const token = await AuthenticationService.getToken();

    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }
}
