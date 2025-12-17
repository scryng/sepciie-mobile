import { AutoTrackingManager } from '@/context/AutoTrackingManager';
import { ThemeProvider } from '@/context/themeContext';
import Theme from '@/hooks/useTheme';
import { Slot, Stack, useRootNavigationState } from 'expo-router';
import { store } from '@/store/store';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import './global.css';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { LoadingProvider } from '@/context/LoadingContext';
import { GlobalSpinner } from '@/components/GlobalSpinner';
import { PaperProvider } from 'react-native-paper';

import { CustomToast } from '@/components/CustomToast';

import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';
import { usePush } from '@/hooks/usePush';
import { useApi } from '@/hooks/useApi';

const InitialLayout = () => {
  const { isAuthenticated } = useApi();
  const rootNavigationState = useRootNavigationState();

  usePush();

  const checkUpdate = async () => {
    try {
      // const isReleaseBuild = true;
      const isReleaseBuild = !__DEV__;
      const inAppUpdates = new SpInAppUpdates(isReleaseBuild);

      // console.log('Checando atualização...');
      const result = await inAppUpdates.checkNeedsUpdate();
      if (!result.shouldUpdate) {
        return;
      }

      // console.log('Checando atualização...');
      await inAppUpdates.startUpdate({
        updateType: IAUUpdateKind.IMMEDIATE,
      });

      // console.log('atualizado...?');
    } catch (e) {
      console.log('Erro ao checar atualização:', e);
    }
  };

  useEffect(() => {
    checkUpdate();
  }, []);

  // Workaround para erro "Attempted to navigate before mounting the Root Layout"
  // Issue: https://github.com/expo/router/issues/740
  // Aguarda o Root Navigation estar pronto antes de renderizar qualquer coisa
  if (!rootNavigationState?.key) return null;

  if (process.env.EXPO_PUBLIC_APP_VARIANT === 'webview') {
    return <Slot />;
  }

  return (
    <>
      <CustomToast />

      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Protected guard={isAuthenticated}>
              {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
              {/* <Stack.Screen name="(pages)" options={{ headerShown: false }} /> */}
              <Stack.Screen name='(drawer)' options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name='login' options={{ headerShown: false }} />
            </Stack.Protected>
          </Stack>
        </View>
      </GestureHandlerRootView>
    </>
  );
};

export default function RootLayout() {
  return (
    <LoadingProvider>
      <GlobalSpinner />
      <Provider store={store}>
        <KeyboardProvider>
          <ThemeProvider>
            <Theme name='app'>
              <AutoTrackingManager>
                <PaperProvider>
                  <InitialLayout />
                </PaperProvider>
              </AutoTrackingManager>
            </Theme>
          </ThemeProvider>
        </KeyboardProvider>
      </Provider>
    </LoadingProvider>
  );
}
