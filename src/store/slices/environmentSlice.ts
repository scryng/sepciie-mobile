import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Tipos do ambiente
export type Environment = 'production' | 'development' | 'local';

interface EnvironmentState {
  currentEnvironment: Environment;
  apiUrl: string;
  showToggle: boolean;
  appVariant: string;
  hydrated: boolean; // <- indica se já sincronizou com o AsyncStorage
}

// --- Helpers ---
const isValidEnv = (v: any): v is Environment =>
  v === 'production' || v === 'development' || v === 'local';

const resolveApiUrl = (env: Environment): string => {
  switch (env) {
    case 'production':
      return (
        process.env.EXPO_PUBLIC_API_URL_PROD ||
        process.env.EXPO_PUBLIC_API_URL ||
        'não definida'
      );
    case 'development':
      return (
        process.env.EXPO_PUBLIC_API_URL_DEV ||
        process.env.EXPO_PUBLIC_API_URL ||
        'http://localhost:5062'
      );
    case 'local':
      return process.env.EXPO_PUBLIC_API_URL_LOCAL || 'http://localhost:5062';
    default:
      return process.env.EXPO_PUBLIC_API_URL_PROD ||
        process.env.EXPO_PUBLIC_API_URL_DEV ||
        process.env.EXPO_PUBLIC_API_URL ||
        'http://localhost:5062';
  }
};

const DEFAULT_ENV: Environment = isValidEnv(process.env.EXPO_PUBLIC_DEFAULT_ENV)
  ? (process.env.EXPO_PUBLIC_DEFAULT_ENV as Environment)
  : 'production';

const initialState: EnvironmentState = {
  currentEnvironment: DEFAULT_ENV,
  apiUrl: resolveApiUrl(DEFAULT_ENV),
  showToggle: process.env.EXPO_PUBLIC_SHOW_ENV_TOGGLE === 'true',
  appVariant: process.env.EXPO_PUBLIC_APP_VARIANT || 'production',
  hydrated: false,
};

const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    setEnvironment: (state, action: PayloadAction<Environment>) => {
      state.currentEnvironment = action.payload;
      state.apiUrl = resolveApiUrl(action.payload);
    },
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.hydrated = action.payload;
    },
  },
});

export const { setEnvironment, setHydrated } = environmentSlice.actions;
export default environmentSlice.reducer;
