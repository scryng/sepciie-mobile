import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, Text, TouchableOpacity, View } from 'react-native';

export const Docs = {
  Termos_de_Uso: {
    url: 'https://google.com',
    name: 'Termos.pdf',
  },
};

type DocType = keyof typeof Docs;

export function Download() {
  const [isDownloading, setIsDownloading] = useState<Record<DocType, boolean>>({
    Termos_de_Uso: false,
  });
  const [progress, setProgress] = useState<Record<DocType, number>>({
    Termos_de_Uso: 0,
  });

  function onDownloadProgress(
    docType: DocType,
    {
      totalBytesWritten,
      totalBytesExpectedToWrite,
    }: {
      totalBytesWritten: number;
      totalBytesExpectedToWrite: number;
    }
  ) {
    const progressValue = (totalBytesWritten / totalBytesExpectedToWrite) * 100;
    setProgress((prev) => ({
      ...prev,
      [docType]: progressValue,
    }));
    console.log(`Download progress for ${docType}: ${progressValue}%`);
  }

  async function handleDownload(docType: DocType) {
    try {
      setIsDownloading((prev) => ({
        ...prev,
        [docType]: true,
      }));

      const doc = Docs[docType];
      const fileUri = FileSystem.documentDirectory + doc.name;

      const downloadResumable = FileSystem.createDownloadResumable(doc.url, fileUri, {}, (downloadProgress) => onDownloadProgress(docType, downloadProgress));

      const downloadResponse = await downloadResumable.downloadAsync();

      if (downloadResponse?.uri) {
        await fileSave(downloadResponse.uri, doc.name);
        setProgress((prev) => ({
          ...prev,
          [docType]: 0,
        }));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível baixar o documento. Verifique sua conexão com a internet e tente novamente.');
      console.log(error);
    } finally {
      setIsDownloading((prev) => ({
        ...prev,
        [docType]: false,
      }));
    }
  }

  const openPdfWithChooser = async (fileUri: string, title: string) => {
    try {
      if (Platform.OS === 'android') {
        // "Abrir com…" via ACTION_VIEW (mostra Adobe/Drive etc.)
        const contentUri = await FileSystem.getContentUriAsync(fileUri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: 'application/pdf',
        });
      } else {
        // iOS: Quick Look
        await Linking.openURL(fileUri);
      }
    } catch (error) {
      console.log('Erro ao abrir PDF, usando sharing como fallback:', error);
      // Fallback para sharing se não conseguir abrir diretamente
      await Sharing.shareAsync(fileUri);
    }
  };

  async function fileSave(uri: string, filename: string) {
    try {
      await openPdfWithChooser(uri, filename);
    } catch (error) {
      console.log('Erro ao abrir PDF com chooser, usando sharing como fallback:', error);
      // Fallback para o método anterior
      if (Platform.OS === 'android') {
        const directoryUri = FileSystem.cacheDirectory + filename;
        const base64File = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.writeAsStringAsync(directoryUri, base64File, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await Sharing.shareAsync(directoryUri);
      } else {
        await Sharing.shareAsync(uri);
      }
    }
  }

  return (
    <View className="items-center justify-center space-y-3">
      <TouchableOpacity onPress={() => handleDownload('Termos_de_Uso')} disabled={isDownloading.Termos_de_Uso}>
        <View className="flex-row items-center">
          {isDownloading.Termos_de_Uso ? (
            <>
              <ActivityIndicator size="small" />
              <Text className="ml-2 text-xs text-text-muted">Abrindo... {progress.Termos_de_Uso.toFixed(1)}%</Text>
            </>
          ) : (
            <Text className="mb-2 text-xs text-center text-text-muted">Termos de Uso</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
