import { ConfigContext, ExpoConfig } from 'expo/config';

const majorVersion = 1;
const minorVersion = 0;
const patchVersion = 0;
const version = `${majorVersion}.${minorVersion}.${patchVersion}`;

const DEFAULT_EAS_PROJECT_ID = 'bbb3c96b-4c56-4544-8c71-312f614fb249';
const DEFAULT_PROJECT_SLUG = 'sepciie';
const OWNER = 'gscryng';

const APP_NAME = 'SEPCIIE';
const BUNDLE_IDENTIFIER = 'com.gscryng.sepciie';
const PACKAGE_NAME = 'com.gscryng.sepciie';
const ICON = './src/assets/icons/ios.png';
const DARK_ICON = './src/assets/icons/ios-dark.png';
const TINTED_ICON = './src/assets/icons/ios-tinted.png';
const ADAPTIVE_ICON = './src/assets/icons/adaptive-icon.png';
const SCHEME = 'sepciie';

type AppEnv = 'development' | 'production';

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = (process.env.APP_VARIANT as AppEnv) || (process.env.EAS_BUILD_PROFILE as AppEnv) || 'production';

  const {
    name,
    bundleIdentifier,
    icon,
    adaptiveIcon,
    packageName,
    scheme,
    projectId,
    projectSlug,
    androidGoogleServices,
    iOSGoogleServices,
  } = getDynamicAppConfig(env);

  return {
    ...config,
    name,
    slug: projectSlug!,
    version,
    orientation: 'portrait',
    icon: './src/assets/icons/icon1.png',
    scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    experiments: {
      reactCompiler: true,
      typedRoutes: true,
    },

    ios: {
      buildNumber: patchVersion.toString(),
      supportsTablet: true,
      icon: {
        light: icon,
        dark: DARK_ICON,
        tinted: TINTED_ICON,
      },
      infoPlist: {
        UIBackgroundModes: ['location', 'processing', 'fetch'],
        BGTaskSchedulerPermittedIdentifiers: ['com.expo.modules.backgroundtask.processing', BUNDLE_IDENTIFIER],
        infoPlist: {
          LSApplicationQueriesSchemes: ['itms-apps'],
        },
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          'O aplicativo $(PRODUCT_NAME) é uma solução crítica de segurança pública que monitora o transporte de produtos regulamentados. Este aplicativo utiliza sua localização para registrar onde as leituras de QR Code são realizadas, garantindo a rastreabilidade dos produtos.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'O aplicativo $(PRODUCT_NAME) é uma solução crítica de segurança pública que monitora o transporte de produtos regulamentados. Este aplicativo usa sua localização para garantir que o veículo segue apenas trajetos aprovados pelas autoridades, garantindo a segurança dos produtos.',
        NSLocationAlwaysUsageDescription:
          'O aplicativo $(PRODUCT_NAME) é uma solução crítica de segurança pública que monitora o transporte de produtos regulamentados. Este aplicativo usa sua localização para garantir que o veículo segue apenas trajetos aprovados pelas autoridades, garantindo a segurança dos produtos.',
        NSPhotoLibraryUsageDescription:
          'Este aplicativo usa sua localização para garantir que o veículo segue apenas trajetos aprovados pelas autoridades, garantindo a segurança dos produtos.',
      },
      bundleIdentifier,
      googleServicesFile: iOSGoogleServices,
    },

    android: {
      versionCode: patchVersion,
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: packageName,
      permissions: [
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_BACKGROUND_LOCATION',
        'android.permission.FOREGROUND_SERVICE',
        'android.permission.WAKE_LOCK',
        'android.permission.RECEIVE_BOOT_COMPLETED',
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO',
      ],
      googleServicesFile: androidGoogleServices,
    },

    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './src/assets/icons/web/icon-12.png',
    },

    splash: {
      backgroundColor: '#ffffff',
      image: './src/assets/icons/splash-logo-light1.png',
      resizeMode: 'contain',
      dark: {
        backgroundColor: '#14222a',
        image: './src/assets/icons/splash-logo-dark1.png',
      },
    },

    plugins: [
      '@react-native-firebase/app',
      '@react-native-firebase/crashlytics',
      'expo-secure-store',
      'expo-router',
      'expo-notifications',
      [
        'expo-camera',
        {
          cameraPermission: 'Permitir que $(PRODUCT_NAME) acesse sua câmera para ler QR Codes.',
          recordAudioAndroid: true,
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Permitir que $(PRODUCT_NAME) use sua localização para garantir que o veículo segue apenas trajetos aprovados pelas autoridades.',
          locationAlwaysPermission:
            'Permitir que $(PRODUCT_NAME) use sua localização para garantir que o veículo segue apenas trajetos aprovados pelas autoridades.',
          locationWhenInUsePermission:
            'Permitir que $(PRODUCT_NAME) use sua localização para garantir que o veículo segue apenas trajetos aprovados pelas autoridades.',
          isAndroidBackgroundLocationEnabled: true,
          isAndroidForegroundServiceEnabled: true,
        },
      ],
      'expo-font',
      'expo-task-manager',
      'expo-background-fetch',
      '@maplibre/maplibre-react-native',
      [
        'expo-notifications',
        {
          icon: TINTED_ICON,
          color: '#f4b223',
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
          android: {
            usesCleartextTraffic: true,
            extraProguardRules: `
-keep class com.android.installreferrer.api.** {
  *;
}

-keep class com.google.android.gms.common.** {*;}
`.trim(),
          },
        },
      ],
    ],

    extra: {
      router: {},
      eas: { projectId: projectId },
      appVariant: env,
    },

    owner: OWNER,
  };
};

export const getDynamicAppConfig = (environment: AppEnv) => {
  if (environment === 'production') {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
      androidGoogleServices: './google-services.json',
      iOSGoogleServices: './GoogleService-Info.plist',
      projectId: DEFAULT_EAS_PROJECT_ID,
      projectSlug: DEFAULT_PROJECT_SLUG,
    };
  }
  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: './src/assets/icons/ios.png',
    adaptiveIcon: './src/assets/icons/adaptive-icon.png',
    scheme: `${SCHEME}-dev`,
    androidGoogleServices: './google-services-dev.json',
    iOSGoogleServices: './GoogleService-Info-dev.plist',
    projectId: DEFAULT_EAS_PROJECT_ID,
    projectSlug: DEFAULT_PROJECT_SLUG,
  };
};
