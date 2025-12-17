import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { Alert, Linking, Platform } from 'react-native';

type ProgressCallback = (written: number, expected: number) => void;

/**
 * Abre um PDF usando o aplicativo mais apropriado do sistema
 */
async function openPdfWithChooser(fileUri: string): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      // Android: usa IntentLauncher com content URI
      const contentUri = await FileSystem.getContentUriAsync(fileUri);
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        type: 'application/pdf',
      });
    } else {
      // iOS: tenta abrir diretamente
      const canOpen = await Linking.canOpenURL(fileUri);
      if (canOpen) {
        await Linking.openURL(fileUri);
      } else {
        throw new Error('Cannot open PDF directly');
      }
    }
  } catch (err) {
    // Fallback: usar o sistema de compartilhamento
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Abrir PDF com...',
      });
    } else {
      throw new Error('Nenhum aplicativo disponível para abrir PDF');
    }
  }
}

/**
 * Baixa um PDF de uma URL e abre
 */
export async function downloadAndOpenPdf(
  url: string,
  filename?: string,
  onProgress?: ProgressCallback
): Promise<string> {
  const safeName = filename || url.split('/').pop() || 'arquivo.pdf';
  const fileUri = `${FileSystem.cacheDirectory}${safeName}`;

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    fileUri,
    {},
    (progress) =>
      onProgress?.(
        progress.totalBytesWritten,
        progress.totalBytesExpectedToWrite
      )
  );

  const result = await downloadResumable.downloadAsync();
  if (!result?.uri) {
    throw new Error('Falha no download do PDF');
  }

  await openPdfWithChooser(result.uri);
  return result.uri;
}

export async function downloadAndShareFile(
  url: string,
  filename: string
): Promise<void> {
  const filePath = await FileSystem.downloadAsync(
    url,
    FileSystem.cacheDirectory + filename
  );
  await Sharing.shareAsync(filePath.uri, {
    mimeType: 'application/pdf',
  });
}

/**
 * Converte base64 para PDF e abre
 */
export async function openPdfFromBase64(
  base64Data: string,
  filename?: string
): Promise<string> {
  try {
    // Remove prefixo se existir
    const cleanBase64 = base64Data.replace(
      /^data:application\/pdf;base64,/,
      ''
    );

    // Gera nome único para o arquivo
    const safeName = filename || `pdf_${Date.now()}.pdf`;
    const fileUri = `${FileSystem.cacheDirectory}${safeName}`;

    // Escreve o arquivo PDF
    await FileSystem.writeAsStringAsync(fileUri, cleanBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Verifica se o arquivo foi criado
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error('Falha ao criar o arquivo PDF');
    }

    // Abre o PDF
    await openPdfWithChooser(fileUri);
    return fileUri;
  } catch (error) {
    console.error('Erro ao processar PDF base64:', error);
    throw error;
  }
}

/**
 * Baixa PDF de uma API que retorna base64
 */
export async function downloadPdfFromApi(
  url: string,
  filename?: string,
  headers?: Record<string, string>
): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const payload = await response.json();
    const base64Data: string | undefined = payload?.pdfBase64;

    if (!base64Data) {
      throw new Error('Resposta da API não contém "pdfBase64"');
    }

    return await openPdfFromBase64(base64Data, filename);
  } catch (error) {
    console.error('Erro ao baixar PDF da API:', error);
    throw error;
  }
}

/**
 * Obtém PDF de uma API que retorna base64 e apenas retorna o caminho do arquivo (sem abrir)
 */
export async function getPdfFile(
  url: string,
  filename?: string,
  headers?: Record<string, string>
): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const payload = await response.json();
    const base64Data: string | undefined = payload?.pdfBase64;

    if (!base64Data) {
      throw new Error('Resposta da API não contém "pdfBase64"');
    }

    // Remove prefixo se existir
    const cleanBase64 = base64Data.replace(
      /^data:application\/pdf;base64,/,
      ''
    );

    // Gera nome único para o arquivo
    const safeName = filename || `pdf_${Date.now()}.pdf`;
    const fileUri = `${FileSystem.cacheDirectory}${safeName}`;

    // Escreve o arquivo PDF
    await FileSystem.writeAsStringAsync(fileUri, cleanBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Verifica se o arquivo foi criado
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error('Falha ao criar o arquivo PDF');
    }
    // Retorna apenas o caminho do arquivo, sem abrir
    return fileUri;
  } catch (error) {
    throw error;
  }
}

/**
 * Limpa arquivos PDF temporários antigos
 */
export async function cleanupTempPdfFiles(
  olderThanHours: number = 1
): Promise<void> {
  try {
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) return;

    const files = await FileSystem.readDirectoryAsync(cacheDir);
    const pdfFiles = files.filter(
      (file) =>
        (file.startsWith('certificado_') || file.startsWith('pdf_')) &&
        file.endsWith('.pdf')
    );

    const cutoffTime = Date.now() - olderThanHours * 60 * 60 * 1000;

    for (const file of pdfFiles) {
      const fileUri = cacheDir + file;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (
        fileInfo.exists &&
        fileInfo.modificationTime &&
        fileInfo.modificationTime * 1000 < cutoffTime
      ) {
        await FileSystem.deleteAsync(fileUri);
      }
    }
  } catch (error) {
    console.log('Erro ao limpar arquivos PDF temporários:', error);
  }
}

export function showPdfError(error: any, customMessage?: string): void {
  const message = customMessage || error?.message || 'Falha ao processar PDF';
  Alert.alert('Erro', message);
}
