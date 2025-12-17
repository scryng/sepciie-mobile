// utils/uuid.ts
import { Platform } from 'react-native';

/**
 * Gera UUID v4 compatível com web e mobile
 */
export function generateUUID(): string {
  if (Platform.OS === 'web') {
    // Versão para web usando crypto.randomUUID se disponível
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback para web sem crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  } else {
    // Para mobile, usar a biblioteca uuid
    try {
      const { v4: uuidv4 } = require('uuid');
      return uuidv4();
    } catch (error) {
      // Fallback se uuid não estiver disponível
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }
}

