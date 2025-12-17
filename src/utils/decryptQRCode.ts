import { ProcessedResult, processCryptedQRData } from '@/utils/fetchMockAPI';
import CryptoJS from 'crypto-js';
import { Alert } from 'react-native';

export const processQRData = async (qrData: string): Promise<ProcessedResult> => {
  try {
    // Descriptografar QR Code
    const key = CryptoJS.enc.Utf8.parse(process.env.EXPO_PUBLIC_CRYPTO_KEY || '1234567890123456');
    const iv = CryptoJS.enc.Utf8.parse(process.env.EXPO_PUBLIC_CRYPTO_IV || '6543210987654321');

    const decrypted = CryptoJS.AES.decrypt(qrData, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedHash = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedHash) {
      throw new Error('Falha na descriptografia');
    }

    console.log('QR Code descriptografado:', decryptedHash);
    return await processCryptedQRData(decryptedHash);
  } catch (error) {
    Alert.alert('Erro ao processar QR Code', 'O QR Code não pôde ser descriptografado ou é inválido.');

    console.error('Erro ao processar QR Code:', error);
    throw new Error('QR Code inválido. Verifique se é um QR Code oficial MAPA e tente novamente.');
  }
};
