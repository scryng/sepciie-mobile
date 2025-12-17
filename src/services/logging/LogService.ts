// src/services/logging/LogService.ts

/**
 * Um serviço de log simples para monitoramento e depuração.
 * Em um ambiente de produção, isso poderia ser integrado com serviços como Sentry, Firebase, etc.
 */
export class LogService {
  private static _isEnabled: boolean | null = null;

  static get isEnabled(): boolean {
    if (this._isEnabled === null) {
      const isEnabled = process.env['EXPO_PUBLIC_ENABLE_LOGSERVICE'] === 'true';
      this._isEnabled = isEnabled;
    }

    return this._isEnabled;
  }

  static info(message: string, data?: object): void {
    if (!this.isEnabled) return;

    console.log(`[INFO] ${message}`, data || '');
  }

  static warn(message: string, data?: object): void {
    if (!this.isEnabled) return;

    console.warn(`[WARN] ${message}`, data || '');
  }

  static error(message: string, error?: any): void {
    if (!this.isEnabled) return;

    console.error(`[ERROR] ${message}`, error);
  }
}
