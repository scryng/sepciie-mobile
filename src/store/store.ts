// store/index.ts
import { configureStore, isPlain } from '@reduxjs/toolkit';
import { api } from './api/api';
import { mainApi } from './api/mainApi';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './slices/authSlice';
import snackbarSlice from './slices/snackbarSlice';
import privacyReducer from './slices/privacySlice';
import qrScannerReducer from './slices/qrCodeSlice';
import environmentReducer from './slices/environmentSlice';
import locationReducer from './slices/locationSlice';

export const store = configureStore({
  reducer: {
    environment: environmentReducer,
    auth: authSlice,
    qrScanner: qrScannerReducer,
    privacy: privacyReducer,
    snackbar: snackbarSlice,
    location: locationReducer,
    [api.reducerPath]: api.reducer,
    [mainApi.reducerPath]: mainApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        isSerializable: (value: any) => typeof value === 'bigint' || isPlain(value),
      },
    }).concat(
      api.middleware,
      mainApi.middleware,
    ),
  devTools: {
    serialize: {
      replacer: (_key, value) =>
        // Convert BigInts to strings for DevTools display
        typeof value === 'bigint' ? value.toString() : value,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
