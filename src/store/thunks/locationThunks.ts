// src/store/thunks/locationThunks.ts
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { hasForegroundLocationPermission, openAppSettings, requestForegroundLocationPermission } from '@/services/requestPermission/locationPermission';
import { AppDispatch, RootState } from '@/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setHydrated,
  setLocationEnabled,
  setUserDisabledLocation,
} from '../slices/privacySlice';
import { showMessage } from '../slices/snackbarSlice';
import { Alert } from 'react-native';
import { use } from 'react';
import { useToast } from '@/hooks/useToast';

export const initLocationStateThunk = () => async (dispatch: AppDispatch) => {
  try {
    const [locPair, userPair] = await AsyncStorage.multiGet([
      STORAGE_KEYS.location,
      STORAGE_KEYS.locationUserDisabled,
    ]);
    const savedLocation = locPair?.[1];
    const userDisabled = userPair?.[1] === 'true';
    const hasPerm = await hasForegroundLocationPermission();

    if (userDisabled) {
      dispatch(setUserDisabledLocation(true));
      dispatch(setLocationEnabled(false));
      if (savedLocation !== 'false')
        await AsyncStorage.setItem(STORAGE_KEYS.location, 'false');
    } else if (hasPerm) {
      dispatch(setUserDisabledLocation(false));
      dispatch(setLocationEnabled(true));
      if (savedLocation !== 'true')
        await AsyncStorage.setItem(STORAGE_KEYS.location, 'true');
    } else {
      dispatch(setUserDisabledLocation(false));
      dispatch(setLocationEnabled(false));
      if (savedLocation !== 'false')
        await AsyncStorage.setItem(STORAGE_KEYS.location, 'false');
    }
  } finally {
    dispatch(setHydrated(true));
  }
};

export const acceptLocationPermissionThunk =
  () => async (dispatch: AppDispatch) => {
    // const status = await requestForegroundLocationPermission();
    const toast = useToast();

    // const showToast = (messageType: string, title: string, msg: string) => {
    //   dispatch(
    //     showMessage({
    //       messageType: messageType,
    //       message: msg,
    //       title: title,
    //     })
    //   );
    // };

    switch (status) {
      case 'granted':
        dispatch(setLocationEnabled(true));
        dispatch(setUserDisabledLocation(false));
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.location, 'true'],
          [STORAGE_KEYS.locationUserDisabled, 'false'],
        ]);
        toast.success(
          'Agora você pode acessar sua localização.',
          'Permissão concedida!'
        );
        break;
      case 'denied':
        dispatch(setLocationEnabled(false));
        dispatch(setUserDisabledLocation(false));
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.location, 'false'],
          [STORAGE_KEYS.locationUserDisabled, 'false'],
        ]);
        toast.info(
          'Você pode ativar depois nas configurações.',
          'Permissão negada'
        );
        break;
      case 'blocked':
        dispatch(setLocationEnabled(false));
        await AsyncStorage.setItem(STORAGE_KEYS.location, 'false');
        toast.warning(
          'Ative a localização nas configurações do sistema.',
          'Permissão bloqueada'
        );
        openAppSettings();
        break;
      default:
        dispatch(setLocationEnabled(false));
        await AsyncStorage.setItem(STORAGE_KEYS.location, 'false');
        toast.error('Tente novamente.', 'Erro ao pedir permissão');
    }
    return status;
  };

export const disableLocationThunk =
  (opts?: {
    stopForegroundWatch?: () => void;
    stopBackgroundUpdates?: () => Promise<void>;
    stopGeofencing?: () => Promise<void>;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      opts?.stopForegroundWatch?.();
    } catch {}
    try {
      await opts?.stopBackgroundUpdates?.();
    } catch {}
    try {
      await opts?.stopGeofencing?.();
    } catch {}

    dispatch(setLocationEnabled(false));
    dispatch(setUserDisabledLocation(true));
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.location, 'false'],
      [STORAGE_KEYS.locationUserDisabled, 'true'],
    ]);
    Alert.alert(
      'Localização desativada',
      'Você pode reativar a qualquer momento.'
    );
  };

export const refreshLocationPermissionThunk = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const {
    privacy: { userDisabledLocation, locationEnabled },
  } = getState();
  const hasPerm = await hasForegroundLocationPermission();

  if (!userDisabledLocation && hasPerm !== locationEnabled) {
    dispatch(setLocationEnabled(hasPerm));
    await AsyncStorage.setItem(STORAGE_KEYS.location, String(hasPerm));
  } else if (userDisabledLocation && !hasPerm) {
    dispatch(setUserDisabledLocation(false));
    await AsyncStorage.setItem(STORAGE_KEYS.locationUserDisabled, 'false');
  }
};
