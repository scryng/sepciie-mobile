// src/store/thunks/initEnvironment.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch, RootState } from '@/store/store';
import {
  Environment,
  setEnvironment,
  setHydrated,
} from '@/store/slices/environmentSlice';

const ENV_KEY = '@app:environment';
const isValidEnv = (v: any): v is Environment =>
  v === 'production' || v === 'development' || v === 'local';

export const initEnvironment =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { appVariant } = getState().environment;

      if (appVariant === 'production') {
        dispatch(setEnvironment('production'));
        dispatch(setHydrated(true));
        return;
      }

      // fora de produção, pode ler o valor salvo em asyncStorage
      const saved = await AsyncStorage.getItem(ENV_KEY);
      if (isValidEnv(saved)) dispatch(setEnvironment(saved));
    } catch (e) {
      console.warn('initEnvironment: failed', e);
    } finally {
      dispatch(setHydrated(true));
    }
  };
