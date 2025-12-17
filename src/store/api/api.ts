// src/store/api/api.ts
import { AuthenticationService } from '@/services/api/auth/authentication.api';
import { clearCookieJar, saveCookiesFromResponse } from '@/utils/cookies';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Environment, setEnvironment } from '../slices/environmentSlice';
import { setHydrated } from '../slices/privacySlice';
import { RootState } from '../store';
import { AuthLoginRequest, AuthLoginResponse, AuthLoginUserData } from '@/types/api/auth';
import { ApiResponse } from '@/types/api/path/ApiResponse.types';

const ENV_KEY = '@app:environment';
const isValidEnv = (v: any): v is Environment => v === 'production' || v === 'development' || v === 'local';

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Auth', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthLoginResponse>, AuthLoginRequest>({
      query: (body) => ({
        url: '/api/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data: response } = await queryFulfilled;

          if (response?.data && 'token' in response.data && 'user' in response.data) {
            const { token, user } = response.data; // TypeScript agora aceita graças ao check acima

            // Usa o serviço centralizado — mais limpo e consistente
            await AuthenticationService.setAuthenticatedUser(token, {
              id: user.id,
              name: user.name,
              role: user.role,
            });
          }

          const setCookie = '4f7460d7-ca1b-48fd-9b49-aab1d4f6d206';
          await saveCookiesFromResponse(setCookie);

          dispatch(api.util.invalidateTags(['Auth', 'User']));
        } catch (e) {
          await clearCookieJar();
        }
      },
    }),

    logout: builder.mutation<null, void>({
      queryFn: async () => {
        await AuthenticationService.logout();
        await clearCookieJar();
        return { data: null };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(api.util.resetApiState());
        } catch {}
      },
    }),

    checkLoginStatus: builder.query<boolean, void>({
      queryFn: async (_arg, { dispatch, getState }) => {
        try {
          const saved = await AsyncStorage.getItem(ENV_KEY);
          const state = getState() as RootState;
          const current = state.environment?.currentEnvironment;

          if (isValidEnv(saved) && saved !== current) {
            dispatch(setEnvironment(saved));
          }

          dispatch(setHydrated(true));

          const isLogged = await AuthenticationService.isLoggedIn();
          return { data: isLogged };
        } catch {
          dispatch(setHydrated(true));
          return { data: false };
        }
      },
      providesTags: ['Auth'],
    }),

    getCurrentUser: builder.query<AuthLoginUserData | null, void>({
      queryFn: async () => {
        try {
          const user = await AuthenticationService.getCurrentUser();
          return { data: user };
        } catch {
          return { data: null };
        }
      },
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useCheckLoginStatusQuery,
  useGetCurrentUserQuery,
  usePrefetch: useAuthPrefetch,
} = api;